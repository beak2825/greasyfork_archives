// ==UserScript==
// @name         小红书悬停滚动自动打开关闭 & 自动翻页
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  上下悬停滚动，悬停笔记自动打开，自动左右翻页，移出自动关闭
// @author       Qiwei
// @match        *://www.xiaohongshu.com/*
// @icon         https://raw.githubusercontent.com/qiwei-ma/xhs-hover-autoview/main/logo.png
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @homepage     https://github.com/qiwei-ma/xhs-hover-autoview
// @homepageURL  https://github.com/qiwei-ma/xhs-hover-autoview
// @supportURL   https://github.com/qiwei-ma/xhs-hover-autoview/issues
// @downloadURL https://update.greasyfork.org/scripts/536676/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E6%82%AC%E5%81%9C%E6%BB%9A%E5%8A%A8%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E5%85%B3%E9%97%AD%20%20%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/536676/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E6%82%AC%E5%81%9C%E6%BB%9A%E5%8A%A8%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E5%85%B3%E9%97%AD%20%20%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function () {
    'use strict';


    /** 默认值 **/
    const DEFAULTS = {
        DELAY_OPEN_MS: 800,
        DELAY_CLOSE_MS: 0,
        MOUSE_MOVE_THRESHOLD: 35,
        EDGE_THRESHOLD: 120,
        CLICK_INTERVAL_MS: 1000,
        HOVER_SCROLL_RATIO: 0.2,// 上下区域占比（0~1）
        HOVER_SCROLL_SPEED: 60,// 滚动速度（像素/秒）
        AUTO_PAGE_TURN: true,
    };

    /** 通用注册函数 **/
    function setupConfig(name, key, minValue = 0) {
        GM_registerMenuCommand(`${name}`, () => {
            const current = Number(GM_getValue(key, DEFAULTS[key]));
            const input = prompt(`请输入 ${name}（当前值：${current}）`, current);
            const newVal = parseFloat(input);
            if (input !== null && !isNaN(newVal) && newVal >= minValue) {
                GM_setValue(key, newVal);
                alert(`设置成功，请刷新页面后生效！`);
            } else {
                alert("无效输入，请输入一个不小于 " + minValue + " 的整数。");
            }
        });
    }

    // 注册所有可配置项
    setupConfig("悬停笔记打开延迟（毫秒）", "DELAY_OPEN_MS");
    setupConfig("笔记关闭延迟（毫秒）", "DELAY_CLOSE_MS");
    setupConfig("退出滚动后鼠标移动触发阈值（像素），避免结束滚动后立即打开所在笔记", "MOUSE_MOVE_THRESHOLD", 1);
    setupConfig("图片翻页边缘触发距离（像素）", "EDGE_THRESHOLD", 10);
    setupConfig("图片自动翻页点击间隔（毫秒）", "CLICK_INTERVAL_MS", 100);
    setupConfig("悬停滚动区域页面上下占比（0-1），0.2即20%", "HOVER_SCROLL_RATIO", 0);
    setupConfig("悬停页面滚动速度（像素/秒）", "HOVER_SCROLL_SPEED", 1);


    // 添加自动翻页开关选项
    GM_registerMenuCommand("是否开启图片自动翻页（若为否则鼠标两侧轻微移动翻页）", () => {
        const current = GM_getValue("AUTO_PAGE_TURN", DEFAULTS.AUTO_PAGE_TURN);
        const newVal = !current;
        GM_setValue("AUTO_PAGE_TURN", newVal);
        alert(`自动翻页已${newVal ? '开启' : '关闭'}，请刷新页面后生效！`);
    });

    /** 工具函数 **/
    const getVal = (key) => Number(GM_getValue(key, DEFAULTS[key]));

    /** 状态变量 **/
    const hoverTimers = new WeakMap();
    const openedNotes = new WeakSet();

    let isBlocked = false;
    let blockTimeout = null;
    let blockInitialPos = null;
    let onMouseMoveAfterBlock = null;

    let lastMousePos = { x: 0, y: 0 };
    window.addEventListener('mousemove', e => {
        lastMousePos = { x: e.clientX, y: e.clientY };
    });

    /** 自动打开逻辑 **/
    function triggerNoteOpen(note) {
        if (!note || openedNotes.has(note)) return;

        if (hoverTimers.has(note)) {
            clearTimeout(hoverTimers.get(note));
            hoverTimers.delete(note);
        }

        const delayTimer = setTimeout(() => {
            const cover = note.querySelector('a.cover');
            if (cover && cover.href && cover.offsetParent !== null) {
                console.log('[XHS自动打开]', cover.href);
                cover.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
                openedNotes.add(note);
                setupAutoClose();
            }
            hoverTimers.delete(note);
        }, getVal('DELAY_OPEN_MS'));

        hoverTimers.set(note, delayTimer);
    }

    function tryOpenNoteUnderMouse() {
        const el = document.elementFromPoint(lastMousePos.x, lastMousePos.y);
        const note = el?.closest('.note-item');
        if (note) triggerNoteOpen(note);
    }

    function monitorMouseAfterScroll() {
        blockInitialPos = null;
        onMouseMoveAfterBlock = (event) => {
            if (!blockInitialPos) {
                blockInitialPos = { x: event.clientX, y: event.clientY };
                return;
            }
            const dx = event.clientX - blockInitialPos.x;
            const dy = event.clientY - blockInitialPos.y;
            if (Math.sqrt(dx * dx + dy * dy) >= getVal('MOUSE_MOVE_THRESHOLD')) {
                isBlocked = false;
                // console.log('[XHS自动打开] 鼠标移动超过阈值，解除滚动阻塞');
                window.removeEventListener('mousemove', onMouseMoveAfterBlock);
                tryOpenNoteUnderMouse();
            }
        };
        window.addEventListener('mousemove', onMouseMoveAfterBlock);
    }

    window.addEventListener('scroll', () => {
        if (!isBlocked) {
            isBlocked = true;
            // console.log('[XHS自动打开] 滚动开始，阻塞自动打开');
        }

        if (onMouseMoveAfterBlock) {
            window.removeEventListener('mousemove', onMouseMoveAfterBlock);
            onMouseMoveAfterBlock = null;
            blockInitialPos = null;
        }

        clearTimeout(blockTimeout);
        blockTimeout = setTimeout(() => {
            // console.log('[XHS自动打开] 滚动结束，等待鼠标移动超过阈值解除阻塞');
            monitorMouseAfterScroll();
        }, 100);
    });
    // 追踪当前正在监听的 note，避免重复绑定
    let currentHoverNote = null;
    let staticCheckTimer = null;
    let staticCheckMoveListener = null;
    let staticStartPos = null;
    let staticRetryTimer = null;

    document.addEventListener('mouseover', (e) => {
        if (isBlocked) return;

        const note = e.target.closest('.note-item');
        if (!note) return;

        // 如果是新 note，取消之前的监听
        if (note !== currentHoverNote) {
            cleanupStaticDetection();
            currentHoverNote = note;
        }

        const delay = getVal('DELAY_OPEN_MS');
        if (hoverTimers.has(note)) {
            clearTimeout(hoverTimers.get(note));
        }

        const delayTimer = setTimeout(() => {
            startStaticDetection(note);
        }, delay);

        hoverTimers.set(note, delayTimer);
    });

    document.addEventListener('mouseout', (e) => {
        const note = e.target.closest('.note-item');
        if (note && note === currentHoverNote) {
            cleanupStaticDetection();
        }
    });

    // 启动静止检测逻辑
    function startStaticDetection(note) {
        staticStartPos = { ...lastMousePos };
        let still = true;

        staticCheckMoveListener = (event) => {
            const dx = event.clientX - staticStartPos.x;
            const dy = event.clientY - staticStartPos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 3) {
                still = false;
                staticStartPos = { x: event.clientX, y: event.clientY };
            } else {
                still = true;
            }
        };

        window.addEventListener('mousemove', staticCheckMoveListener);

        const tryOpenIfStatic = () => {
            const elNow = document.elementFromPoint(lastMousePos.x, lastMousePos.y);
            const currentNote = elNow?.closest('.note-item');

            if (still && currentNote === note) {
                const cover = note.querySelector('a.cover');
                if (cover && cover.href && cover.offsetParent !== null) {
                    //                     console.log('[XHS自动打开] 鼠标静止且仍在笔记上，点击打开：', cover.href);
                    cover.dispatchEvent(new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true
                    }));
                    openedNotes.add(note);
                    setupAutoClose();
                    cleanupStaticDetection();
                    return;
                }
            }

            // 如果未静止或鼠标移出，继续等待 200ms 后再次检测
            staticRetryTimer = setTimeout(tryOpenIfStatic, 200);
        };

        staticCheckTimer = setTimeout(tryOpenIfStatic, 200);
    }

    // 清理所有与静止检测相关的监听器和定时器
    function cleanupStaticDetection() {
        if (staticCheckMoveListener) {
            window.removeEventListener('mousemove', staticCheckMoveListener);
            staticCheckMoveListener = null;
        }
        if (staticCheckTimer) {
            clearTimeout(staticCheckTimer);
            staticCheckTimer = null;
        }
        if (staticRetryTimer) {
            clearTimeout(staticRetryTimer);
            staticRetryTimer = null;
        }

        if (currentHoverNote) {
            if (hoverTimers.has(currentHoverNote)) {
                clearTimeout(hoverTimers.get(currentHoverNote));
                hoverTimers.delete(currentHoverNote);
            }
        }

        currentHoverNote = null;
    }


    document.addEventListener('mouseout', e => {
        const note = e.target.closest('.note-item');
        if (note && hoverTimers.has(note)) {
            clearTimeout(hoverTimers.get(note));
            hoverTimers.delete(note);
            //             console.log('[XHS自动打开] 鼠标移出，取消打开');
        }
    });

    /** 自动关闭逻辑 **/
    let closeTimeout = null;
    function setupAutoClose() {
        const noteContainer = document.getElementById('noteContainer');
        if (!noteContainer) {
            //             console.log('[XHS自动关闭] 未找到 noteContainer，稍后重试');
            setTimeout(setupAutoClose, 500);
            return;
        }

        noteContainer.onmouseleave = () => {
            clearTimeout(closeTimeout);
            closeTimeout = setTimeout(() => {
                const closeBtn = document.querySelector('.close-circle .close');
                if (closeBtn) {
                    //                     console.log('[XHS自动关闭] 鼠标移出，点击关闭');
                    closeBtn.click();
                    handleCloseBlock();
                }
            }, getVal('DELAY_CLOSE_MS'));
        };

        noteContainer.onmouseenter = () => {
            clearTimeout(closeTimeout);
            closeTimeout = null;
        };

    }

    function handleCloseBlock() {
        if (isBlocked) return;
        isBlocked = true;
        const blockStartTime = Date.now();
        const MIN_BLOCK_DURATION = 300;

        if (onMouseMoveAfterBlock) window.removeEventListener('mousemove', onMouseMoveAfterBlock);
        blockInitialPos = null;

        onMouseMoveAfterBlock = (event) => {
            if (!blockInitialPos) {
                blockInitialPos = { x: event.clientX, y: event.clientY };
                return;
            }
            const dx = event.clientX - blockInitialPos.x;
            const dy = event.clientY - blockInitialPos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const duration = Date.now() - blockStartTime;

            if (dist >= getVal('MOUSE_MOVE_THRESHOLD') && duration >= MIN_BLOCK_DURATION) {
                isBlocked = false;
                window.removeEventListener('mousemove', onMouseMoveAfterBlock);
                tryOpenNoteUnderMouse();
            }
        };
        window.addEventListener('mousemove', onMouseMoveAfterBlock);
    }


    // === 图片左右边缘自动翻页功能（自动模式） ===
    (function setupAutoSlideNavigation() {
        let autoDirection = null;
        let lastMouseX = 0;
        let lastMouseY = 0;
        let mouseX = 0;
        let mouseY = 0;
        let lastMoveTime = 0;

        function getActiveImageContainer() {
            return document.querySelector('.swiper-slide-active .note-slider-img, .swiper-slide-active .live-photo-contain');
        }

        function clickArrowIfAvailable(selector) {
            const btnWrapper = document.querySelector(selector);
            const arrowController = btnWrapper?.closest('.arrow-controller');
            if (btnWrapper && arrowController && !arrowController.classList.contains('forbidden')) {
                btnWrapper.click();
                return true;
            }
            return false;
        }

        document.addEventListener('mousemove', (e) => {
            lastMouseX = mouseX;
            lastMouseY = mouseY;
            mouseX = e.clientX;
            mouseY = e.clientY;
            lastMoveTime = Date.now();
        });

        document.addEventListener('mouseleave', () => {
            autoDirection = null;
        });

        // === 自动翻页模式：较慢频率 ===
        setInterval(() => {
            const isAutoPageTurn = GM_getValue("AUTO_PAGE_TURN", DEFAULTS.AUTO_PAGE_TURN) === true;
            if (!isAutoPageTurn) return;

            const container = getActiveImageContainer();
            if (!container) return;

            const rect = container.getBoundingClientRect();

            const insideImage =
                  mouseX >= rect.left &&
                  mouseX <= rect.right &&
                  mouseY >= rect.top &&
                  mouseY <= rect.bottom;

            if (!insideImage) {
                autoDirection = null;
                return;
            }

            if (mouseX - rect.left < getVal('EDGE_THRESHOLD')) {
                autoDirection = 'left';
            } else if (rect.right - mouseX < getVal('EDGE_THRESHOLD')) {
                autoDirection = 'right';
            } else {
                autoDirection = null;
            }

            if (autoDirection === 'left') {
                if (clickArrowIfAvailable('.arrow-controller.left .btn-wrapper')) {
                }
            } else if (autoDirection === 'right') {
                if (clickArrowIfAvailable('.arrow-controller.right .btn-wrapper')) {
                }
            }
        }, getVal('CLICK_INTERVAL_MS')); // 自动模式使用可配置间隔

        // === 手动轻微移动模式：固定 200ms 检查 ===
        const MOVE_INTERVAL_MS = 0;

        setInterval(() => {
            const isAutoPageTurn = GM_getValue("AUTO_PAGE_TURN", DEFAULTS.AUTO_PAGE_TURN) === true;
            if (isAutoPageTurn) return;

            const now = Date.now();
            const timeSinceLastMove = now - lastMoveTime;

            if (timeSinceLastMove < MOVE_INTERVAL_MS) return;

            const container = getActiveImageContainer();
            if (!container) return;

            const rect = container.getBoundingClientRect();

            const insideImage =
                  mouseX >= rect.left &&
                  mouseX <= rect.right &&
                  mouseY >= rect.top &&
                  mouseY <= rect.bottom;

            if (!insideImage) {
                autoDirection = null;
                return;
            }

            if (mouseX === lastMouseX) return;
            lastMouseX = mouseX;
            lastMoveTime = now;

            if (mouseX - rect.left < getVal('EDGE_THRESHOLD')) {
                autoDirection = 'left';
            } else if (rect.right - mouseX < getVal('EDGE_THRESHOLD')) {
                autoDirection = 'right';
            } else {
                autoDirection = null;
            }

            if (autoDirection === 'left') {
                clickArrowIfAvailable('.arrow-controller.left .btn-wrapper');
            } else if (autoDirection === 'right') {
                clickArrowIfAvailable('.arrow-controller.right .btn-wrapper');
            }
        }, MOVE_INTERVAL_MS); // 轻微移动触发固定 200ms 检查
    })();


    // ===页面上下区域悬停自动上下滚动===
    (function setupVerticalHoverScroll() {
        let scrollContainer = null;

        function updateScrollContainer() {
            const newContainer =
                document.querySelector('.feeds-page') ||
                document.querySelector('.feeds-tab-container');

            if (newContainer !== scrollContainer) {
                scrollContainer = newContainer;
                console.log('[悬停滚动] scrollContainer 已更新:', scrollContainer);
            }
        }

        // 初始化一次
        updateScrollContainer();

        // 监听 DOM 变化
        const observer = new MutationObserver(() => {
            updateScrollContainer();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        const sidebarList = document.querySelector('.side-bar');
        const effectiveScrollElement = document.scrollingElement;

        if (!scrollContainer || !sidebarList || !effectiveScrollElement) {
            return;
        }

        const hoverZoneRatio = GM_getValue("HOVER_SCROLL_RATIO", DEFAULTS.HOVER_SCROLL_RATIO); // 比如 0.15
        const scrollSpeed = GM_getValue("HOVER_SCROLL_SPEED", DEFAULTS.HOVER_SCROLL_SPEED); // 比如 20

        let scrollDirection = null;
        let scrollTimer = null;
        let lastScrollTime = 0;


        document.addEventListener("mousemove", (e) => {

            const feedRect = scrollContainer.getBoundingClientRect();
            const sidebarRect = sidebarList.getBoundingClientRect();

            // 计算 hover 区域矩形：从右下角向上延伸 sidebar 高度，向左宽度为 feedRect.width
            const zoneLeft = sidebarRect.right;
            const zoneRight = zoneLeft + feedRect.width;
            const zoneTop = sidebarRect.top;
            const zoneBottom = sidebarRect.bottom;

            const y = e.clientY;
            const x = e.clientX;

            // 判断是否在这个 hover 区域内
            const insideHoverZone = x >= zoneLeft && x <= zoneRight && y >= zoneTop && y <= zoneBottom;

            if (!insideHoverZone) {
                if (scrollDirection !== null) {
                }
                scrollDirection = null;
            } else {
                const zoneHeight = zoneBottom - zoneTop;
                const threshold = zoneHeight * hoverZoneRatio;

                if (y < zoneTop + threshold) {
                    scrollDirection = "up";
                } else if (y > zoneBottom - threshold) {
                    scrollDirection = "down";
                } else {
                    if (scrollDirection !== null) {
                    }
                    scrollDirection = null;
                }
            }

            // 开始或停止滚动
            if (scrollDirection && !scrollTimer) {
                scrollTimer = setInterval(() => {
                    const now = Date.now();
                    if (now - lastScrollTime < 16) return;
                    lastScrollTime = now;

                    const delta = scrollDirection === "up" ? -scrollSpeed / 10 : scrollSpeed / 10;
                    effectiveScrollElement.scrollBy(0, delta);

                    // 派发滚轮事件（可选）
                    const wheelEvent = new WheelEvent('wheel', {
                        deltaY: delta * 3,
                        bubbles: true,
                        cancelable: true
                    });
                    scrollContainer.dispatchEvent(wheelEvent);

                }, 16);
            } else if (!scrollDirection && scrollTimer) {
                clearInterval(scrollTimer);
                scrollTimer = null;
            }

        });

        document.addEventListener("mouseleave", () => {
            if (scrollTimer) {
                clearInterval(scrollTimer);
                scrollTimer = null;
            }
        });

    })();


})();

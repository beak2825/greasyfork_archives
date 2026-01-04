// ==UserScript==
// @name         东航易学助手
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  检测超时弹窗，稳定多开加速，并处理所有弹出按钮
// @author       买不起泡面的Hanley
// @match        *://dhyx.ceair.com/*
// @require      http://code.jquery.com/jquery-1.9.1.min.js
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440423/%E4%B8%9C%E8%88%AA%E6%98%93%E5%AD%A6%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/440423/%E4%B8%9C%E8%88%AA%E6%98%93%E5%AD%A6%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

var Status = 0; // 初始化状态标识
var lastClickTime = Date.now(); // 最后一次点击的时间
var refreshInterval; // 用于存储定时器ID
var isDragging = false; // 用于标识是否正在拖动
var dragStartX, dragStartY; // 记录拖动开始时的鼠标位置
var detectStringObserver = null; // 新增变量
var lastPageDetected = false; // 新增变量

var autoNavigateTimer = null;

function startAutoNavigateTimer() {
    if (autoNavigateTimer) clearInterval(autoNavigateTimer);
    autoNavigateTimer = setInterval(function() {
        if (getAutoNavigateEnabled()) {
            autoNavigateNextChapter();
        }
    }, 300000); // 每5分钟检查一次
}

function safeQuerySelector(selector, root = document) {
    try {
        return root.querySelector(selector);
    } catch (e) {
        return null;
    }
}

function safeQuerySelectorAll(selector, root = document) {
    try {
        return Array.from(root.querySelectorAll(selector));
    } catch (e) {
        return [];
    }
}

function ReSetTimer() {
    //重置并启动计时器
    document.querySelectorAll('iframe').forEach(function(iframe) {
        try {
            // 在每个 iframe 的 window 上下文执行
            iframe.contentWindow.startCount = 0;
            if (typeof iframe.contentWindow.startCountTool === 'function') {
                iframe.contentWindow.startCountTool();
            }
            iframe.contentWindow.startCount = 0;
        } catch (e) {
            // 跨域等异常忽略
            console.warn('无法访问iframe:', e);
        }
    });
}

function getAutoNavigateEnabled() {
    return localStorage.getItem('autoNavigateEnabled') === 'true';
}

function setAutoNavigateEnabled(value) {
    localStorage.setItem('autoNavigateEnabled', value);
    manageAutoRefresh();
}

function manageAutoRefresh() {
    clearInterval(refreshInterval);
    clearInterval(autoNavigateTimer);
    refreshInterval = null;
    autoNavigateTimer = null;

    if (Status == 0 && !getAutoNavigateEnabled()) {
        refreshInterval = setInterval(function() {
            clickCurrentFocusSection();
        }, 360000);
    }
    if (Status == 0 && getAutoNavigateEnabled()) {
        autoNavigateNextChapter(); // 立即执行一次
        autoNavigateTimer = setInterval(function() {
            autoNavigateNextChapter();
        }, 300000);
    }
}

function updateToggleButton(toggleButton) {
    const autoNavigateEnabled = getAutoNavigateEnabled();
    toggleButton.innerText = autoNavigateEnabled ? "自动导航：开" : "自动导航：关";
    toggleButton.style.background = autoNavigateEnabled ? 'rgba(255, 255, 0, 0.5)' : 'rgba(128, 128, 128, 0.5)';
}

function detectAndClickAlertButton() {
    // 查找弹窗的wrapper
    const alertWrapper = document.querySelector('.alert-shadow.new-alert-shadow');
    if (!alertWrapper) {
        return;
    }

    // 查找确定按钮
    const alertButton = document.getElementById('D253btn-ok');
    if (alertButton) {
        alertButton.click(); // 自动点击确定按钮
    }
}

function detectString() {
    if (detectStringObserver) return; // 已注册则不再注册

    function checkString(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.nodeValue.includes('可继续学习')) {
                var confirmBtns3 = document.getElementsByClassName("btn");
                if (confirmBtns3 != null && confirmBtns3.length > 0) {
                    confirmBtns3[0].click();
                    lastClickTime = Date.now();
                }
            } else if (node.nodeValue.includes('恭喜')) {
                var cancelBtns = document.querySelectorAll('button[data-bb-handler="cancel"]');
                if (cancelBtns.length > 0) {
                    cancelBtns[0].click();
                }
                if (getAutoNavigateEnabled()) {
                    setTimeout(function() {
                        window.top.location.reload(true);
                    }, 5000);
                }
            } else if (node.nodeValue.includes('进度已保存')) {
                if (getAutoNavigateEnabled()) {
                    // 5秒后刷新页面
                    setTimeout(function() {
                        window.top.location.reload(true);
                    }, 5000);
                }
            } else if (node.nodeValue.includes('小测试')) {
                // 执行一次遍历
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // 检查元素节点中的文本内容
            if (node.textContent.includes('进度已保存')) {
                if (getAutoNavigateEnabled()) {
                    // 5秒后刷新页面
                    setTimeout(function() {
                        window.top.location.reload(true);
                    }, 5000);
                }
            }
            // 遍历子节点
            for (let child of node.childNodes) {
                checkString(child);
            }
        }
    }

    detectStringObserver = new MutationObserver(function(mutations) {
        for (let mutation of mutations) {
            for (let addedNode of mutation.addedNodes) {
                checkString(addedNode);
            }
        }
    });

    detectStringObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function updateFlagStatus() {
    const flag1 = document.getElementById('flag');
    if (Status == 1) {
        flag1.innerText = "检测到考试!代码停止运行!\nby:买不起泡面的Hanley";
    } else if (Status == 2) {
        flag1.innerText = "运行阅卷脚本\nby:买不起泡面的Hanley";
    } else if (Status == -1) {
        flag1.innerText = "脚本不在首页运行\nby:买不起泡面的Hanley";
    } else {
        flag1.innerText = "脚本正在运行\nby:买不起泡面的Hanley";
    }
}

function makeElementDraggable(element) {
    let offsetX, offsetY;

    element.addEventListener('mousedown', function(event) {
        isDragging = false;
        dragStartX = event.clientX;
        dragStartY = event.clientY;
        offsetX = event.clientX - element.getBoundingClientRect().left;
        offsetY = event.clientY - element.getBoundingClientRect().top;
        element.style.cursor = 'move';

        function onMouseMove(event) {
            const deltaX = event.clientX - dragStartX;
            const deltaY = event.clientY - dragStartY;
            if (!isDragging && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
                isDragging = true;
            }
            if (isDragging) {
                element.style.left = event.clientX - offsetX + 'px';
                element.style.top = event.clientY - offsetY + 'px';
                event.preventDefault(); // 防止选择文本
            }
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            element.style.cursor = 'pointer';
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
}

if (window.self === window.top) { // 仅在顶层窗口显示悬浮窗
    setTimeout(function() {
        const flag = document.createElement("div");
        flag.id = 'flag';
        flag.style.cssText = 'left: 10px;bottom: 10px;background: rgba(26, 89, 183, 0.5);color:#ffffff;overflow: hidden;z-index: 9999;position: fixed;padding:3px;text-align:center;width: 175px;height: 45px;line-height: 20px;border-radius: 4px;cursor: pointer;';
        document.getElementById("content").appendChild(flag);

        updateFlagStatus();

        makeElementDraggable(flag);

        flag.addEventListener('click', function() {
            if (!isDragging && flag.innerText.includes("脚本正在运行")) {
                flag.style.background = 'rgba(255, 0, 0, 0.5)';
                flag.innerText = "正在尝试爆破\nby:买不起泡面的Hanley";
                markVideoAsCompleted();
                setTimeout(function() {
                    flag.style.background = 'rgba(26, 89, 183, 0.5)';
                    updateFlagStatus();
                }, 2000);
                loadKnockoutJs(proceedWithModifications);
            }
        });

        const toggleButton = document.createElement("div");
        toggleButton.id = 'toggleButton';
        toggleButton.style.cssText = 'right: 10px;bottom: 10px;color:#000000;overflow: hidden;z-index: 9999;position: fixed;padding:3px;text-align:center;width: 100px;height: 30px;line-height: 25px;border-radius: 4px;cursor: pointer;';
        document.body.appendChild(toggleButton);

        updateToggleButton(toggleButton); // 确保页面加载时立即更新按钮背景颜色

        makeElementDraggable(toggleButton);

        toggleButton.addEventListener('click', function() {
            if (!isDragging) {
                const newState = !getAutoNavigateEnabled();
                setAutoNavigateEnabled(newState);
                updateToggleButton(toggleButton);
                setTimeout(function() {
                    window.top.location.reload(true);
                }, 1000);//一秒刷新
            }
        });

        // 初始化时检查并设置自动刷新
        manageAutoRefresh();
        ReSetTimer();
        detectString(); // 只在初始化时调用一次
        startAutoNavigateTimer(); // 启动定时器
    }, 4000); // 4秒后显示状态牌
}

var AutoClick = setInterval(function() { Clicker() }, 1000); // 每秒运行一次

function Clicker() {
    console.error = function() {};
    if (location.href.includes('/#/home')) {
        clearInterval(AutoClick);
        clearInterval(refreshInterval);
        Status = -1; // 首页不搞
        updateFlagStatus();
        return;
    }
    if (window.location.href.indexOf("exam") > -1) {
        if (window.location.href.indexOf("mark-paper") > -1) { // 检测到是在阅卷，停止运行但不跳弹窗
            clearInterval(AutoClick); // 阅卷了就不乱点了
            clearInterval(refreshInterval);
            Status = 2; // 阅卷了阅卷了
            updateFlagStatus();
            return;
        } else {
            clearInterval(AutoClick); // 别是在考试，考试就直接摆烂
            clearInterval(refreshInterval);
            Status = 1; // 考试了还玩球，状态标异常
            alert('检测到考试!代码停止运行!');
            updateFlagStatus();
            return;
        }
    }
    checkLoginStatus();
    handleClicks();
    detectAndClickAlertButton();
    clickNextButtonInIframe();

    if (getAutoNavigateEnabled()) {
        const nextPage = document.querySelector(".navBtn.glyphicon.glyphicon-chevron-right");
        if (nextPage && !nextPage.disabled) {
            nextPage.click();
            lastClickTime = Date.now();
        }
    }
}

function handleClicks() {

    const confirmBtns = document.querySelectorAll(".bootbox-close-button.close");
    if (confirmBtns.length > 0) {
        confirmBtns[0].click(); // 自动点击
        lastClickTime = Date.now();
    }

    const confirmBtns2 = document.querySelectorAll(".alertify-button.alertify-button-ok");
    if (confirmBtns2.length > 0) {
        confirmBtns2[0].click();
        lastClickTime = Date.now();
    }
}

let currentSectionId = null;

function autoNavigateNextChapter() {
    // 1. 收集所有章节标题
    const allTitles = Array.from(document.querySelectorAll('.common-title.text-overflow[data-path]'));
    const uuidTitleMap = {};
    allTitles.forEach(title => {
        const dataPathArr = title.getAttribute('data-path').split(',').filter(Boolean);
        if (dataPathArr.length > 0) {
            const uuid = dataPathArr[dataPathArr.length - 1];
            uuidTitleMap[uuid] = title;
        }
    });

    // 2. 按直接父级分组所有小节
    const allSections = Array.from(document.querySelectorAll('dl.chapter-list-box'));
    const parentMap = new Map();

    for (const section of allSections) {
        let parentDiv = section.parentElement;
        while (parentDiv && !parentDiv.className.match(/chapter-/)) {
            parentDiv = parentDiv.parentElement;
        }
        let upUuids = [];
        if (parentDiv) {
            upUuids = Array.from(parentDiv.classList)
                .filter(cls => cls.startsWith('chapter-'))
                .map(cls => cls.replace('chapter-', ''));
        }
        const parentUuid = upUuids.length > 0 ? upUuids[upUuids.length - 1] : null;
        if (!parentUuid) continue;
        if (!parentMap.has(parentUuid)) parentMap.set(parentUuid, []);
        parentMap.get(parentUuid).push(section);
    }

    // 获取下拉菜单选择的起始序号
    const startIndex = parseInt(localStorage.getItem('autoNavigateStartIndex') || "1", 10);

    // 3. 处理每个父级
    for (const [parentUuid, sections] of parentMap.entries()) {
        const parentTitle = uuidTitleMap[parentUuid];
        if (!parentTitle) continue;
        const isParentFinished = parentTitle.innerText.includes('【已完成】');
        // 3.1 优先点击未完成/无状态小节（分流：跳过前N-1个）
        let pendingCount = 0;
        for (const section of sections) {
            const statusSpan = section.querySelector('.pull-right');
            const status = statusSpan ? statusSpan.innerText.trim() : '';
            if (!status || !status.includes('已完成')) {
                pendingCount++;
                if (pendingCount < startIndex) continue; // 跳过前N-1个
                const clickable = section.querySelector('.chapter-item');
                const sectionId = section.id || section.getAttribute('data-sectiontype') || section;
                if (currentSectionId !== sectionId && clickable) {
                    simulateClick(clickable, window);
                    lastPageDetected = false;
                    currentSectionId = sectionId;
                }
                // 停留在未完成/无状态小节
                return;
            }
        }
        // 3.2 如果所有小节都已完成但父级未完成，停留在最后一个小节，并刷新
        if (!isParentFinished && sections.length > 0) {
            const lastSection = sections[sections.length - 1];
            const clickable = lastSection.querySelector('.chapter-item');
            const sectionId = lastSection.id || lastSection.getAttribute('data-sectiontype') || lastSection;
            if (currentSectionId !== sectionId && clickable) {
                simulateClick(clickable, window);
                lastPageDetected = false;
                currentSectionId = sectionId;
            }
            clickCurrentFocusSection();
            return;
        }
    }
    // 4. 所有父级都已完成，重置currentSectionId，并刷新
    currentSectionId = null;
    clickCurrentFocusSection();
}



function clickNextButtonInIframe() {

    // 获取页面上的所有 iframe 元素
    const iframes = document.querySelectorAll('iframe');
    if (iframes.length === 0) {
        return; // 如果没有 iframe，退出函数
    }

    // 遍历每个 iframe，执行相关操作
    iframes.forEach(function(iframe) {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;


        if (getAutoNavigateEnabled()) {
            // 查找并点击下一个完成的按钮
            const nextPageButton = iframeDocument.querySelector('.navBtn.glyphicon.glyphicon-chevron-right.nextCompleted');
            if (nextPageButton) {
                nextPageButton.click();
                lastClickTime = Date.now();
            }

            // 查找并模拟点击弹窗按钮
            const popupBtns = iframeDocument.querySelectorAll('.btn[data-bb-handler="ok"], .btn[data-bb-handler="next"], .btn[data-bb-handler="confirm"]');
            popupBtns.forEach(function(btn) {
                simulateClick(btn, iframe.contentWindow);
                btn.click();
                lastClickTime = Date.now();
            });

            // 检查当前页面是否是最后一页，如果是则点击当前章节刷新学习状态（只执行一次）
            const navigationLabel = iframeDocument.querySelector('.navigation-controls__label');
            if (navigationLabel){
                const pageNumbers = navigationLabel.innerText.split('/');
                if (
                    pageNumbers.length === 2 &&
                    pageNumbers[0].trim() === pageNumbers[1].trim() &&
                    !lastPageDetected
                ) {
                    lastPageDetected = true;
                    // 点击当前章节刷新学习状态
                    clickCurrentFocusSection();
                }
            }
            // 查找并点击暂停按钮，跳过视频
            const buttons = iframeDocument.querySelectorAll('.uikit-primary-button.uikit-primary-button_size_medium.play-controls-container__play-pause-button');
            buttons.forEach(function(button) {
                const svg = button.querySelector('svg');
                if (svg) {
                    const path = svg.querySelector('path');
                    if (path && getAutoNavigateEnabled() && path.getAttribute('d') === 'M5 16.3087V3.54659L5 3.54659L16.8484 8.87836C17.2245 9.04759 17.2455 9.57369 16.8842 9.77243L5 16.3087Z') {
                        simulateClick(button, iframe.contentWindow);
                    }
                }
            });
            //下一页
            const buttonsNext = iframeDocument.querySelectorAll('.uikit-primary-button.uikit-primary-button_size_medium.navigation-controls__button.uikit-primary-button_next.navigation-controls__button_next');
            buttonsNext.forEach(function(button) {
                const svg = button.querySelector('svg');
                if (svg) {
                    const path = svg.querySelector('path');
                    if (path && getAutoNavigateEnabled() && path.getAttribute('d') === 'M8 4L14 10L8 16') {
                        simulateClick(button, iframe.contentWindow);
                    }
                }
            });
        }

        // 处理弹窗按钮
        const popupBtns2 = iframeDocument.querySelectorAll('.message-box-buttons__window-button');
        popupBtns2.forEach(function(btn) {
            simulateClick(btn, iframe.contentWindow);
        });
    });
}

function simulateClick(element, win) {
    let mouseDownEvent, mouseUpEvent, clickEvent;
    try {
        // 优先用传入的 win，如果失败自动降级
        mouseDownEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: win || window });
        mouseUpEvent = new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: win || window });
        clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, view: win || window });
    } catch (e) {
        // 如果view参数报错则降级处理
        mouseDownEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
        mouseUpEvent = new MouseEvent('mouseup', { bubbles: true, cancelable: true });
        clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    }
    element.dispatchEvent(mouseDownEvent);
    element.dispatchEvent(mouseUpEvent);
    element.dispatchEvent(clickEvent);
}

function loadKnockoutJs(callback) {
    var resources = performance.getEntriesByType('resource');
    var regex = /file-cloud\/01\/[0-9A-Za-z]+\/[0-9A-ZaZ]+\/[0-9A-ZaZ]+/;
    var knockoutJsUrl = '';

    for (var i = 0; i < resources.length; i++) {
        var resource = resources[i];
        if (resource.name.includes('scorm_api.jsp?')) {
            var match = resource.name.match(regex);
            if (match) {
                var dynamicPath = match[0];
                if (dynamicPath.includes('/player')) {
                    dynamicPath = dynamicPath.replace('/player', '');
                }
                knockoutJsUrl = 'https://dhyx.ceair.com/' + dynamicPath + '/lib/knockout/knockout.min.js';
                break;
            }
        }
    }

    if (knockoutJsUrl) {
        var script = document.createElement('script');
        script.src = knockoutJsUrl;
        document.head.appendChild(script);

        script.onload = function() {
            callback();
        };
    } else {
        callback();
    }
}

function proceedWithModifications() {
    function findViewModel(root) {
        var queue = [{ obj: root, path: '' }];
        var visited = new Set();

        while (queue.length > 0) {
            var current = queue.shift();
            var obj = current.obj;
            var path = current.path;

            if (visited.has(obj)) {
                continue;
            }
            visited.add(obj);

            for (var prop in obj) {
                if (obj.hasOwnProperty(prop) && typeof obj[prop] === 'object' && obj[prop] !== null) {
                    try {
                        if (obj[prop].constructor && obj[prop].constructor.name === 'CBTPlayer') {
                            return obj[prop];
                        }
                    } catch (e) {
                        continue;
                    }
                    queue.push({ obj: obj[prop], path: path + prop + '.' });
                }
            }
        }
        return null;
    }

    var cbtPlayer = findViewModel(window);

    if (cbtPlayer) {
        var currentOrg = cbtPlayer.currentOrg();
        if (currentOrg && currentOrg.items) {
            currentOrg.items().forEach(function(item) {
                item.completed(true);
                item.visited(true);
                item.playbackFinished(true);
                if (item.type === 'topic' || item.type === 'mergedpages') {
                    item.items().forEach(function(subItem) {
                        subItem.completed(true);
                        subItem.visited(true);
                        subItem.playbackFinished(true);
                    });
                }
            });

            currentOrg.items.valueHasMutated();

            if (typeof cbtPlayer.SavePlayer === 'function') {
                cbtPlayer.SavePlayer();
            }
        }
    }
}

//调用统一认证登录
function checkLoginStatus() {
    if (window.location.href.indexOf("oauth/#login") > -1) {
        setTimeout(function() {
            document.querySelector(".step-item.pointer:nth-child(3)").click();
        }, 5000);
        lastClickTime = Date.now();
    }
}
function clickCurrentFocusSection() {
    try {
        const focused = document.querySelector('dl.chapter-list-box.focus');
        if (focused) {
            let clickable = focused.querySelector('.chapter-item');
            if (!clickable) {
                clickable = focused.querySelector('.text-overflow');
            }
            if (clickable) {
                // 优先用 simulateClick，若无效可直接用 click()
                simulateClick(clickable, window);
                // clickable.click();
            }
        }
    } catch (e) {
        console.error('clickCurrentFocusSection error:', e);
    }
}


// 添加视频爆破功能
function markVideoAsCompleted() {
    var videoElements = document.querySelectorAll('video[id$="player_html5_api"]');
    if (videoElements.length > 0) {
        var videoElement = videoElements[0];
        videojs(videoElement).ready(function() {
            var player = this;
            player.currentTime(player.duration());
            player.trigger('ended');
        });
    }
}

// ==窗口编号选择悬浮窗补丁==
// 仅在 Status 不为 1、2、-1 时显示
(function() {
    if (window.self !== window.top) return;
    setTimeout(function() {
        if (typeof Status !== "undefined" && (Status === 1 || Status === 2 || Status === -1)) return;
        if (document.getElementById("windowSelectDiv")) return;

        const windowSelectDiv = document.createElement("div");
        windowSelectDiv.id = "windowSelectDiv";
        windowSelectDiv.style.cssText = `
            left: 30px;
            top: 80px;
            z-index: 9999;
            position: fixed;
            background: rgba(150, 89, 183, 0.5);
            color: #fff;
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.10);
            padding: 0 18px;
            height: 40px;
            display: flex;
            align-items: center;
            font-size: 16px;
            cursor: move;
            user-select: none;
        `;

        const windowLabel = document.createElement("span");
        windowLabel.innerText = "窗口编号";
        windowLabel.style.cssText = "font-size:15px;margin-right:4px;letter-spacing:0px;";

        const windowSelect = document.createElement("select");
        windowSelect.id = "startIndexSelect";
        windowSelect.style.cssText = `
            width: 40px;
            height: 32px;
            font-size: 15px;
            border-radius: 6px;
            border: 1px solid #e0e0e0;
            outline: none;
            background: rgba(255,255,255,1);
            color: #333;
            cursor: pointer;
            box-shadow: none;
            padding-left: 8px;
        `;
        for (let i = 1; i <= 6; i++) {
            const option = document.createElement("option");
            option.value = i;
            option.text = i;
            windowSelect.appendChild(option);
        }
        windowSelect.value = localStorage.getItem('autoNavigateStartIndex') || "1";
        windowSelect.onchange = function() {
            localStorage.setItem('autoNavigateStartIndex', windowSelect.value);
            window.location.reload();
        };

        windowSelectDiv.appendChild(windowLabel);
        windowSelectDiv.appendChild(windowSelect);
        document.body.appendChild(windowSelectDiv);

        // 调用原有可拖动函数，防止变形
        if (typeof makeElementDraggable === "function") {
            makeElementDraggable(windowSelectDiv);
        }
    }, 4000);
})();

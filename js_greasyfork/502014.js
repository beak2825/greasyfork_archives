// ==UserScript==
// @name         哔哩哔哩自动打开字幕+倍速（兼容自动连播，可配置UP主白名单）
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  仅在指定UP主的视频下自动开启字幕，并支持设置默认倍速（可选择是否跟随白名单），新增跳过片头片尾功能
// @author       Scabish
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502014/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E5%AD%97%E5%B9%95%2B%E5%80%8D%E9%80%9F%EF%BC%88%E5%85%BC%E5%AE%B9%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%92%AD%EF%BC%8C%E5%8F%AF%E9%85%8D%E7%BD%AEUP%E4%B8%BB%E7%99%BD%E5%90%8D%E5%8D%95%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/502014/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E5%AD%97%E5%B9%95%2B%E5%80%8D%E9%80%9F%EF%BC%88%E5%85%BC%E5%AE%B9%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%92%AD%EF%BC%8C%E5%8F%AF%E9%85%8D%E7%BD%AEUP%E4%B8%BB%E7%99%BD%E5%90%8D%E5%8D%95%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentVideoId = '';

    // 初始化页面变化观察器
    function initUrlObserver() {
        // 监听URL变化（History API）
        const pushState = history.pushState;
        history.pushState = function() {
            pushState.apply(this, arguments);
            checkForVideoChange();
        };

        const replaceState = history.replaceState;
        history.replaceState = function() {
            replaceState.apply(this, arguments);
            checkForVideoChange();
        };

        window.addEventListener('popstate', checkForVideoChange);

        // 初始检查
        checkForVideoChange();
    }

    // 检查视频是否变化
    function checkForVideoChange() {
        const newVideoId = getBilibiliVideoIdFromUrlRegex();
        if (newVideoId && newVideoId !== currentVideoId) {
            currentVideoId = newVideoId;
            handlePage();
        }
    }

    // 从URL获取视频ID
    function getBilibiliVideoIdFromUrlRegex() {
        const url = window.location.href;
        const regex = /https:\/\/www\.bilibili\.com\/video\/(BV[a-zA-Z0-9]+)/;
        const match = url.match(regex);
        return (match && match[1]) || null;
    }

    // 处理页面逻辑
    async function handlePage() {
        console.log("[字幕脚本] 检测到新视频，开始处理...");

        // 等待视频播放器加载完成
        await waitForElm('.bpx-player-container');

        // 等待UP主信息加载
        const upName = await getUpName();
        if (!upName) {
            console.log("[字幕脚本] 未获取到UP主信息");
            return;
        }

        const whitelist = getWhitelist();
        const onlyWhitelistForSpeed = getOnlyWhitelistForSpeed();
        const skipIntroOutro = getSkipIntroOutro();

        console.log("[字幕脚本] 当前UP主:", upName,
                  " 白名单:", whitelist,
                  " 倍速跟随白名单:", onlyWhitelistForSpeed,
                  " 自动跳过片头片尾:", skipIntroOutro);

        // 处理字幕
        if (whitelist.includes(upName)) {
            openChineseSubtitle(); // 修改为新的字幕打开方式
        }

        // 处理倍速
        const speed = getDefaultSpeed();
        if (speed) {
            if (!onlyWhitelistForSpeed || whitelist.includes(upName)) {
                setPlaybackRate(speed);
            }
        }

        // 处理跳过片头片尾
        if (skipIntroOutro) {
            setupIntroOutroSkipper();
        }
    }

    // 获取UP主名称（兼容新旧界面）
    async function getUpName() {
        // 尝试多种选择器，兼容不同界面
        const selectors = [
            '.up-name',
            '.video-author-name',
            '.user-name'
        ];

        for (const selector of selectors) {
            const element = await waitForElm(selector, 5000); // 5秒超时
            if (element) {
                return element.textContent.trim();
            }
        }

        return null;
    }

    // 打开中文字幕（修改为点击中文选项的方式）
    function openChineseSubtitle() {
        // 多次尝试，确保能找到按钮
        const maxAttempts = 8;
        let attempts = 0;

        const tryOpenSubtitle = () => {
            if (attempts >= maxAttempts) {
                console.log("[字幕脚本] 尝试打开字幕达到最大次数，可能未找到字幕选项");
                return;
            }

            attempts++;

            // 首先检查字幕是否已经打开
            const subtitleTrack = document.querySelector('.bpx-player-subtitle-track');
            if (subtitleTrack && !subtitleTrack.classList.contains('hide')) {
                console.log("[字幕脚本] 字幕已打开");
                return;
            }

            // 步骤1: 找到并点击字幕按钮，打开字幕菜单
            const subtitleButtons = [
                '.bpx-player-ctrl-btn[aria-label="字幕"]',
                '.sub-btn',
                '.bpx-player-subtitle-switch'
            ].map(selector => document.querySelector(selector));

            const subtitleButton = subtitleButtons.find(btn => btn !== null);

            if (subtitleButton) {
                // 点击字幕按钮打开菜单
                subtitleButton.click();
                console.log("[字幕脚本] 已点击字幕按钮，打开菜单");

                // 步骤2: 等待并点击"中文"字幕选项
                setTimeout(() => {
                    const chineseSubtitle = document.querySelector('.bpx-player-ctrl-subtitle-language-item-text');
                    if (chineseSubtitle && chineseSubtitle.textContent.trim() === "中文") {
                        chineseSubtitle.click();
                        console.log("[字幕脚本] 已点击中文选项，打开字幕");
                    } else {
                        console.log("[字幕脚本] 未找到中文选项，将重试");
                        // 关闭字幕菜单
                        subtitleButton.click();
                        setTimeout(tryOpenSubtitle, 1000);
                    }
                }, 500); // 等待菜单展开
            } else {
                console.log("[字幕脚本] 未找到字幕按钮，将重试");
                setTimeout(tryOpenSubtitle, 1000);
            }
        };

        tryOpenSubtitle();
    }

    // 设置播放速度
    async function setPlaybackRate(speed) {
        // 等待倍速菜单加载
        const speedMenu = await waitForElm('.bpx-player-ctrl-playbackrate', 5000);
        if (!speedMenu) {
            console.warn("[字幕脚本] 未找到倍速控制元素");
            return;
        }

        // 点击打开倍速菜单
        speedMenu.click();

        // 等待菜单项加载
        await waitForElm('.bpx-player-ctrl-playbackrate-menu-item', 2000);

        // 尝试找到对应的倍速选项
        let item = document.querySelector(`.bpx-player-ctrl-playbackrate-menu-item[data-value="${speed}"]`);

        // 如果直接找不到，尝试通过文本查找
        if (!item) {
            const items = document.querySelectorAll('.bpx-player-ctrl-playbackrate-menu-item');
            for (const i of items) {
                if (i.textContent.trim() === `${speed}x`) {
                    item = i;
                    break;
                }
            }
        }

        if (item) {
            item.click();
            console.log("[字幕脚本] 设置倍速:", speed);
        } else {
            console.warn(`[字幕脚本] 未找到倍速 ${speed}x`);
            // 关闭菜单
            speedMenu.click();
        }
    }

    // 设置自动跳过片头片尾
    function setupIntroOutroSkipper() {
        // 监听跳过按钮出现
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                const skipButtons = document.querySelectorAll('.bpx-player-ctrl-jump-item, .jump-btn');
                if (skipButtons.length > 0) {
                    skipButtons[0].click();
                    console.log("[字幕脚本] 已自动跳过片头/片尾");
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });

        // 5分钟后停止观察，避免内存泄漏
        setTimeout(() => observer.disconnect(), 300000);
    }

    // =============== 白名单管理 ===============
    function getWhitelist() {
        return GM_getValue('subtitleWhitelist', []);
    }

    function setWhitelist(arr) {
        GM_setValue('subtitleWhitelist', arr);
    }

    // =============== 倍速管理 ===============
    function getDefaultSpeed() {
        return GM_getValue('defaultPlaybackRate', null);
    }

    function setDefaultSpeed(value) {
        GM_setValue('defaultPlaybackRate', value);
    }

    function getOnlyWhitelistForSpeed() {
        return GM_getValue('onlyWhitelistForSpeed', false);
    }

    function setOnlyWhitelistForSpeed(value) {
        GM_setValue('onlyWhitelistForSpeed', value);
    }

    // =============== 跳过片头片尾管理 ===============
    function getSkipIntroOutro() {
        return GM_getValue('skipIntroOutro', false);
    }

    function setSkipIntroOutro(value) {
        GM_setValue('skipIntroOutro', value);
    }

    // 注册 Tampermonkey 菜单命令
    GM_registerMenuCommand("设置字幕白名单", function() {
        const whitelist = getWhitelist();
        const input = prompt("请输入UP主白名单（用英文逗号分隔）", whitelist.join(","));
        if (input !== null) {
            const arr = input.split(",").map(x => x.trim()).filter(x => x);
            setWhitelist(arr);
            alert("已保存白名单: " + arr.join(", ") + "，刷新页面后生效");
        }
    });

    GM_registerMenuCommand("设置默认倍速", function() {
        const current = getDefaultSpeed() || "1";
        const input = prompt("请输入默认倍速（可选: 2, 1.5, 1.25, 1, 0.75, 0.5）", current);
        if (input !== null) {
            const valid = ["2", "1.5", "1.25", "1", "0.75", "0.5"];
            if (valid.includes(input)) {
                setDefaultSpeed(input);
                alert("已设置默认倍速: " + input + "x" + "，刷新页面后生效");
            } else {
                alert("输入无效，请输入以下之一: " + valid.join(", "));
            }
        }
    });

    GM_registerMenuCommand("切换：倍速仅对白名单UP主生效", function() {
        const current = getOnlyWhitelistForSpeed();
        setOnlyWhitelistForSpeed(!current);
        alert("倍速仅对白名单UP主生效: " + (!current ? "开启" : "关闭") + "，刷新页面后生效");
    });

    GM_registerMenuCommand("切换：自动跳过片头片尾", function() {
        const current = getSkipIntroOutro();
        setSkipIntroOutro(!current);
        alert("自动跳过片头片尾: " + (!current ? "开启" : "关闭") + "，新视频生效");
    });

    // =============== 工具函数 ===============
    function waitForElm(selector, timeout = 10000) {
        return new Promise((resolve) => {
            // 立即检查
            const element = document.querySelector(selector);
            if (element) {
                return resolve(element);
            }

            // 设置超时
            const timer = setTimeout(() => {
                observer.disconnect();
                resolve(null); // 超时返回null
            }, timeout);

            // 观察DOM变化
            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearTimeout(timer);
                    observer.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    // 初始化
    initUrlObserver();
})();

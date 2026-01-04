// ==UserScript==
// @name         [VIP影视解析工具]红狐弹幕播放器
// @namespace    http://tampermonkey.net/
// @version      0.5.2
// @description  <点击网页中出现的logo即可实现跳转>基于红狐弹幕解析编写的脚本,支持解析:腾讯视频、爱奇艺、优酷、芒果TV、Bilibili等
// @author       Aomine
// @match        *.rdfplayer.mrgaocloud.com/*
// @match        *v.qq.com/x*
// @match        *v.qq.com/p*
// @match        *v.qq.com/cover*
// @match        *v.qq.com/tv/*
// @match        *.youku.com/v*
// @match        *m.youku.com/*
// @match        *.iqiyi.com/v_*
// @match        *.iqiyi.com/w_*
// @match        *.iqiyi.com/a_*
// @match        *.iq.com/play/*
// @match        *.bilibili.com/video/*
// @match        *.bilibili.com/anime/*
// @match        *.bilibili.com/bangumi/play/*
// @match        *.bilibili.com/s/*
// @match        *.mgtv.com/b/*
// @license      GPL License
// @icon         data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PgoNPCEtLSBVcGxvYWRlZCB0bzogU1ZHIFJlcG8sIHd3dy5zdmdyZXBvLmNvbSwgR2VuZXJhdG9yOiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4KPHN2ZyB3aWR0aD0iODAwcHgiIGhlaWdodD0iODAwcHgiIHZpZXdCb3g9IjAgMCA5MSA5MSIgaWQ9IkxheWVyXzEiIHZlcnNpb249IjEuMSIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+Cg08c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDojNEU3QTlFO30NCgkuc3Qxe2ZpbGw6I0YwQURBQjt9DQo8L3N0eWxlPgoNPGc+Cg08Zz4KDTxnPgoNPHBhdGggY2xhc3M9InN0MCIgZD0iTTU1LjQsNTMuNmMyLjEtMi4xLDMuMi00LjgsMS43LThjLTIuMy00LjctMTAuMy01LjUtMTMuMy0xLjNjLTAuNiwwLjgsMC4xLDEuOCwwLjgsMi4xICAgICBjMi4zLDAuOCw1LjMtMSw3LjQsMC40YzMuNiwyLjMtMC44LDUuMi0zLjIsNS45Yy0yLjcsMC44LTEuNiw0LjksMS4yLDQuMmMzLjctMC45LDYuMSwyLjgsNC40LDZjLTEuNywzLTUuMywzLjItOCwxLjcgICAgIGMtMy43LTItOC4xLDMuMS00LjYsNmMyLjgsMi40LDcuNiwxLjcsMTAuOCwwLjNjMy4xLTEuNCw1LjctNCw2LjYtNy40QzYwLjEsNTkuNiw1OC40LDU1LjYsNTUuNCw1My42eiIvPgoNPHBhdGggY2xhc3M9InN0MCIgZD0iTTMzLjIsMjAuOWMtMi44LDEuNS01LjEsMy45LTcuMSw2LjRjLTIuNC0zLjEtNS42LTYuMi05LjMtNi4zYy0xLjcsMC0yLjUsMi4xLTEuMywzLjJjMi45LDMsNiw1LjMsOC4zLDguOSAgICAgYzEuMSwxLjgsMy40LDEuNiw0LjYsMGMyLjMtMy4xLDUuMy01LjMsOC4zLTcuOEMzOS4xLDIzLjIsMzUuOSwxOS40LDMzLjIsMjAuOXoiLz4KDTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik03MS45LDIxLjdjLTIuOCwxLjUtNS4xLDMuOS03LjEsNi40Yy0yLjQtMy4xLTUuNi02LjItOS4zLTYuM2MtMS43LDAtMi41LDIuMS0xLjMsMy4yYzIuOSwzLDYsNS4zLDguMyw4LjkgICAgIGMxLjEsMS44LDMuNCwxLjYsNC42LDBjMi4zLTMuMSw1LjMtNS4zLDguMy03LjhDNzcuOSwyNCw3NC43LDIwLjIsNzEuOSwyMS43eiIvPgoNPC9nPgoNPHBhdGggY2xhc3M9InN0MSIgZD0iTTEwLjQsNTIuMWMxLjQtMS40LDIuOC0yLjcsNC4yLTQuMWMxLjQtMS40LDMuNC0yLjcsMy40LTQuOGMwLTEuMi0xLTIuMi0yLjItMi4yYy0yLjMsMC4xLTMuNSwyLjItNC44LDMuOCAgICBjLTEuMiwxLjYtMi4yLDMuNS0zLjIsNS4zQzcuMSw1MS43LDkuMSw1My41LDEwLjQsNTIuMUwxMC40LDUyLjF6Ii8+Cg08cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjEuMiw1Mi44YzEuNC0xLjEsMi44LTIuMiw0LjItMy4zYzEuMy0xLjEsMy4xLTIuMiwzLjgtMy44YzEtMi4yLTEuMS00LjktMy41LTMuNWMtMS43LDAuOS0yLjYsMi45LTMuNiw0LjQgICAgYy0xLDEuNS0yLDMuMS0yLjksNC43QzE4LjMsNTIuNSwyMC4xLDUzLjYsMjEuMiw1Mi44TDIxLjIsNTIuOHoiLz4KDTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik02NS42LDUyLjFjMS40LTEuNCwyLjgtMi43LDQuMi00LjFjMS40LTEuNCwzLjQtMi43LDMuNC00LjhjMC0xLjItMS0yLjItMi4yLTIuMmMtMi4zLDAuMS0zLjUsMi4yLTQuOCwzLjggICAgYy0xLjIsMS42LTIuMiwzLjUtMy4yLDUuM0M2Mi4zLDUxLjcsNjQuMyw1My41LDY1LjYsNTIuMUw2NS42LDUyLjF6Ii8+Cg08cGF0aCBjbGFzcz0ic3QxIiBkPSJNNzYuNCw1Mi44YzEuNC0xLjEsMi44LTIuMiw0LjItMy4zYzEuMy0xLjEsMy4xLTIuMiwzLjgtMy44YzEtMi4yLTEuMS00LjktMy41LTMuNWMtMS43LDAuOS0yLjYsMi45LTMuNiw0LjQgICAgYy0xLDEuNS0yLDMuMS0yLjksNC43QzczLjUsNTIuNSw3NS4zLDUzLjYsNzYuNCw1Mi44TDc2LjQsNTIuOHoiLz4KDTwvZz4KDTwvZz4KDTwvc3ZnPg==
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/525388/%5BVIP%E5%BD%B1%E8%A7%86%E8%A7%A3%E6%9E%90%E5%B7%A5%E5%85%B7%5D%E7%BA%A2%E7%8B%90%E5%BC%B9%E5%B9%95%E6%92%AD%E6%94%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/525388/%5BVIP%E5%BD%B1%E8%A7%86%E8%A7%A3%E6%9E%90%E5%B7%A5%E5%85%B7%5D%E7%BA%A2%E7%8B%90%E5%BC%B9%E5%B9%95%E6%92%AD%E6%94%BE%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 弹幕解析功能
    var am = false;
    var moving = false;
    var logo = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PgoNPCEtLSBVcGxvYWRlZCB0bzogU1ZHIFJlcG8sIHd3dy5zdmdyZXBvLmNvbSwgR2VuZXJhdG9yOiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4KPHN2ZyB3aWR0aD0iODAwcHgiIGhlaWdodD0iODAwcHgiIHZpZXdCb3g9IjAgMCA5MSA5MSIgaWQ9IkxheWVyXzEiIHZlcnNpb249IjEuMSIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+Cg08c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDojNEU3QTlFO30NCgkuc3Qxe2ZpbGw6I0YwQURBQjt9DQo8L3N0eWxlPgoNPGc+Cg08Zz4KDTxnPgoNPHBhdGggY2xhc3M9InN0MCIgZD0iTTU1LjQsNTMuNmMyLjEtMi4xLDMuMi00LjgsMS43LThjLTIuMy00LjctMTAuMy01LjUtMTMuMy0xLjNjLTAuNiwwLjgsMC4xLDEuOCwwLjgsMi4xICAgICBjMi4zLDAuOCw1LjMtMSw3LjQsMC40YzMuNiwyLjMtMC44LDUuMi0zLjIsNS45Yy0yLjcsMC44LTEuNiw0LjksMS4yLDQuMmMzLjctMC45LDYuMSwyLjgsNC40LDZjLTEuNywzLTUuMywzLjItOCwxLjcgICAgIGMtMy43LTItOC4xLDMuMS00LjYsNmMyLjgsMi40LDcuNiwxLjcsMTAuOCwwLjNjMy4xLTEuNCw1LjctNCw2LjYtNy40QzYwLjEsNTkuNiw1OC40LDU1LjYsNTUuNCw1My42eiIvPgoNPHBhdGggY2xhc3M9InN0MCIgZD0iTTMzLjIsMjAuOWMtMi44LDEuNS01LjEsMy45LTcuMSw2LjRjLTIuNC0zLjEtNS42LTYuMi05LjMtNi4zYy0xLjcsMC0yLjUsMi4xLTEuMywzLjJjMi45LDMsNiw1LjMsOC4zLDguOSAgICAgYzEuMSwxLjgsMy40LDEuNiw0LjYsMGMyLjMtMy4xLDUuMy01LjMsOC4zLTcuOEMzOS4xLDIzLjIsMzUuOSwxOS40LDMzLjIsMjAuOXoiLz4KDTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik03MS45LDIxLjdjLTIuOCwxLjUtNS4xLDMuOS03LjEsNi40Yy0yLjQtMy4xLTUuNi02LjItOS4zLTYuM2MtMS43LDAtMi41LDIuMS0xLjMsMy4yYzIuOSwzLDYsNS4zLDguMyw4LjkgICAgIGMxLjEsMS44LDMuNCwxLjYsNC42LDBjMi4zLTMuMSw1LjMtNS4zLDguMy03LjhDNzcuOSwyNCw3NC43LDIwLjIsNzEuOSwyMS43eiIvPgoNPC9nPgoNPHBhdGggY2xhc3M9InN0MSIgZD0iTTEwLjQsNTIuMWMxLjQtMS40LDIuOC0yLjcsNC4yLTQuMWMxLjQtMS40LDMuNC0yLjcsMy40LTQuOGMwLTEuMi0xLTIuMi0yLjItMi4yYy0yLjMsMC4xLTMuNSwyLjItNC44LDMuOCAgICBjLTEuMiwxLjYtMi4yLDMuNS0zLjIsNS4zQzcuMSw1MS43LDkuMSw1My41LDEwLjQsNTIuMUwxMC40LDUyLjF6Ii8+Cg08cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjEuMiw1Mi44YzEuNC0xLjEsMi44LTIuMiw0LjItMy4zYzEuMy0xLjEsMy4xLTIuMiwzLjgtMy44YzEtMi4yLTEuMS00LjktMy41LTMuNWMtMS43LDAuOS0yLjYsMi45LTMuNiw0LjQgICAgYy0xLDEuNS0yLDMuMS0yLjksNC43QzE4LjMsNTIuNSwyMC4xLDUzLjYsMjEuMiw1Mi44TDIxLjIsNTIuOHoiLz4KDTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik02NS42LDUyLjFjMS40LTEuNCwyLjgtMi43LDQuMi00LjFjMS40LTEuNCwzLjQtMi43LDMuNC00LjhjMC0xLjItMS0yLjItMi4yLTIuMmMtMi4zLDAuMS0zLjUsMi4yLTQuOCwzLjggICAgYy0xLjIsMS42LTIuMiwzLjUtMy4yLDUuM0M2Mi4zLDUxLjcsNjQuMyw1My41LDY1LjYsNTIuMUw2NS42LDUyLjF6Ii8+Cg08cGF0aCBjbGFzcz0ic3QxIiBkPSJNNzYuNCw1Mi44YzEuNC0xLjEsMi44LTIuMiw0LjItMy4zYzEuMy0xLjEsMy4xLTIuMiwzLjgtMy44YzEtMi4yLTEuMS00LjktMy41LTMuNWMtMS43LDAuOS0yLjYsMi45LTMuNiw0LjQgICAgYy0xLDEuNS0yLDMuMS0yLjksNC43QzczLjUsNTIuNSw3NS4zLDUzLjYsNzYuNCw1Mi44TDc2LjQsNTIuOHoiLz4KDTwvZz4KDTwvZz4KDTwvc3ZnPg==";;

    // 如果当前网址是 https://rdfplayer.mrgaocloud.com/，不创建图标
    if (window.location.hostname !== 'rdfplayer.mrgaocloud.com') {
        // 使用DOMContentLoaded确保DOM完全加载
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            createButton();
        } else {
            document.addEventListener('DOMContentLoaded', createButton);
        }

        function createButton() {
            // 检查是否已存在按钮，避免重复创建
            if (document.getElementById('imgid')) return;
            // 拖拽功能
            var startDrag = function(target) {
                var getCss = function(o, key) {
                    return o.currentStyle ? o.currentStyle[key] : document.defaultView.getComputedStyle(o, false)[key];
                };
                var params = { left: 0, top: 0, currentX: 0, currentY: 0, rectLeft: 0, rectTop: 0, rectRight: 0 };
                if (getCss(target, "position") === "static") {
                    target.style.position = "relative";
                }
                if (getCss(target, "left") !== "auto") {
                    params.left = getCss(target, "left");
                }
                if (getCss(target, "top") !== "auto") {
                    params.top = getCss(target, "top");
                }
                target.addEventListener("mousedown", function(event) {
                    moving = true;
                    params.rectLeft = target.getBoundingClientRect().left + document.body.scrollLeft;
                    params.rectTop = target.getBoundingClientRect().top + document.body.scrollTop;
                    params.rectRight = document.documentElement.clientWidth - target.getBoundingClientRect().right;
                    if (event.preventDefault) {
                        event.preventDefault();
                    } else {
                        event.returnValue = false;
                    }
                    var e = event;
                    params.currentX = e.clientX;
                    params.currentY = e.clientY;
                    document.addEventListener("mousemove", function(event) {
                        if (moving == false) {
                            return 0;
                        }
                        am = true;
                        var e = event ? event : window.event;
                        var nowX = e.clientX,
                            nowY = e.clientY;
                        var disX = nowX - params.currentX,
                            disY = nowY - params.currentY;
                        if (disX < 0 && Math.abs(disX) > params.rectLeft) {
                            disX = -params.rectLeft;
                        }
                        if (disY < 0 && Math.abs(disY) > params.rectTop) {
                            disY = -params.rectTop;
                        }
                        if (disX > 0 && disX > params.rectRight) {
                            disX = params.rectRight;
                        }
                        target.style.left = parseInt(params.left) + disX + "px";
                        target.style.top = parseInt(params.top) + disY + "px";
                    });

                    document.addEventListener("mouseup", function() {
                        moving = false;
                        setTimeout(function() { am = false; }, 50);
                        if (getCss(target, "left") !== "auto") {
                            params.left = getCss(target, "left");
                        }
                        if (getCss(target, "top") !== "auto") {
                            params.top = getCss(target, "top");
                        }
                    });
                });
            };

            // 创建图标
            var ele = document.createElement("img");
            ele.id = "imgid";
            ele.style = "margin: 150px 0px 0px 10px;width:60px;position: fixed;top:0px;z-index: 99999;";
            ele.src = logo;
            document.body.appendChild(ele);
            startDrag(document.getElementById('imgid'));

            // 添加title属性用于悬停提示
            ele.title = '点我跳转';

            // 跳转解析站并传递B站地址的函数
            function jumpToPlayer() {
                if (am == false) {
                    // 重置状态
                    hasPlayed = false;
                    moving = false;

                    // 直接打开带URL参数的解析站
                    var videoUrl = encodeURIComponent(window.location.href);
                    var targetUrl = `https://rdfplayer.mrgaocloud.com/?url=${videoUrl}`;

                    // 打开新页面
                    window.open(targetUrl, "_blank");
                }
            }

            // 点击事件
            document.getElementById("imgid").addEventListener("click", jumpToPlayer);

            // 键盘快捷键事件
            document.addEventListener("keydown", function(e) {
                // 检测是否按下 Shift + F9
                if (e.shiftKey && e.key === "F9") {
                    jumpToPlayer();
                }
            });
        }
    }
    // 创建自定义提示框
    const customHint = document.createElement('div');
    customHint.style.position = 'fixed'; // 固定位置，脱离父元素限制
    customHint.style.top = '50%';
    customHint.style.left = '50%';
    customHint.style.transform = 'translate(-50%, -50%)';
    customHint.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    customHint.style.color = 'white';
    customHint.style.padding = '5px 10px';
    customHint.style.borderRadius = '5px';
    customHint.style.display = 'none';
    customHint.style.zIndex = '9999'; // 确保在最上层

    // 初始挂载（先加到 body）
    document.body.appendChild(customHint);

    // 监听全屏变化，确保提示框始终添加在全屏容器中
    document.addEventListener('fullscreenchange', () => {
        const fsElement = document.fullscreenElement;
        if (fsElement && !fsElement.contains(customHint)) {
            fsElement.appendChild(customHint);
        } else if (!fsElement && !document.body.contains(customHint)) {
            document.body.appendChild(customHint);
        }
    });

    // 快进/快退控制
    document.addEventListener('keydown', function(e) {
        // 排除输入框的情况
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        // 获取视频元素
        const video = document.querySelector('video');
        if (!video) {
            console.warn('未找到video元素');
            return;
        }

        let seekAmount = 0;
        let feedbackText = '';

        if (e.ctrlKey && (e.code === 'ArrowLeft' || e.code === 'ArrowRight')) {
            seekAmount = 85; // Ctrl组合的快进秒数
        } else if (e.shiftKey && (e.code === 'ArrowLeft' || e.code === 'ArrowRight')) {
            seekAmount = 55; // Shift组合的快进秒数
        } else {
            return;
        }

        if (e.code === 'ArrowLeft') {
            video.currentTime = Math.max(0, video.currentTime - seekAmount);
            feedbackText = `后退${seekAmount + 5}秒，当前: ${formatTime(video.currentTime - 5)}`;
        } else if (e.code === 'ArrowRight') {
            video.currentTime = Math.min(video.duration, video.currentTime + seekAmount);
            feedbackText = `快进${seekAmount + 5}秒，当前: ${formatTime(video.currentTime + 5)}`;
        }

        // 显示反馈提示
        customHint.textContent = feedbackText;
        customHint.style.display = 'block';
        setTimeout(() => customHint.style.display = 'none', 2000);
    })

    // 格式化时间的函数
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' + secs : secs}`;
    }

    // 限定网页生效的条件
    if (window.location.hostname.includes('rdfplayer.mrgaocloud.com') || window.location.pathname.includes('/player/')) {

        // 第一步：通过GM_addStyle强制注入CSS（最高优先级）
        GM_addStyle(`
        .sidebar {
            width: 350px !important;
            min-width: 350px !important;
            max-width: 350px !important;
        }
    `);

        // 第二步：DOM加载后再次强制设置内联样式
        window.addEventListener('DOMContentLoaded', function() {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                // 添加调试标记
                sidebar.dataset.widthForced = 'true';

                // 内联样式覆盖
                sidebar.style.setProperty('width', '350px', 'important');
                sidebar.style.setProperty('min-width', '350px', 'important');
                sidebar.style.setProperty('max-width', '350px', 'important');

                console.log('侧边栏宽度已强制锁定为350px');
                console.log('实际宽度:', sidebar.offsetWidth + 'px');
            }
        });

        // 第三步：3秒后最终确认（应对动态加载）
        setTimeout(() => {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar && sidebar.offsetWidth !== 350) {
                sidebar.style.cssText = 'width: 350px !important; min-width: 350px !important; max-width: 350px !important;';
                console.warn('检测到宽度被修改，已重新强制设置');
            }
        }, 3000);

        // 样式优化
        const style = document.createElement('style');
        style.textContent = `
        .shortcut-hint {
            position: fixed;
            left: 20px;
            bottom: 60px;
            background: rgba(0,0,0,0.85);
            color: white;
            padding: 12px;
            border-radius: 8px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            z-index: 9999
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        .hint-visible {
            opacity: 1 !important;
            pointer-events: auto;
        }
    `;
        document.head.appendChild(style);

        // 创建提示元素（附加到body）
        const hint = document.createElement('div');
        hint.className = 'shortcut-hint';
        hint.innerHTML = `
        <div>快捷键提示:</div>
        <div>W: 网页全屏</div>
        <div>D: 弹幕开关</div>
        <div>Enter/F: 全屏</div>
        <div>空格: 播放/暂停</div>
        <div>Ctrl+←/→: 回退/前进90s</div>
        <div>Shift+←/→: 回退/前进60s</div>
        <div>Shift+?: 显示/隐藏本提示</div>
    `;
        document.body.appendChild(hint);

        // 全屏元素检测
        const checkContainer = () => {
            const fullscreenContainer = document.fullscreenElement;
            // 如果处于全屏状态且提示框不在全屏容器内
            if (fullscreenContainer && !fullscreenContainer.contains(hint)) {
                fullscreenContainer.appendChild(hint);
            }
            // 退出全屏时自动回到body
            else if (!fullscreenContainer && !document.body.contains(hint)) {
                document.body.appendChild(hint);
            }
        };

        // 全屏状态同步
        document.addEventListener('fullscreenchange', checkContainer);

        // 防抖处理窗口变化
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(checkContainer, 100);
        });

        // 快捷键监听
        document.addEventListener('keydown', (e) => {
            if (e.shiftKey && e.key === '?') {
                e.preventDefault();
                hint.classList.toggle('hint-visible');
            }
        });

        // 初始位置修正
        setTimeout(checkContainer, 500); // 应对播放器延迟加载

        // 弹幕开关功能:D
        let danmakuToggleCount = 0;

        // 使用捕获阶段监听键盘事件，确保在全屏模式下也能捕获
        document.addEventListener('keydown', function(event) {
            // 只在按下D/d键时触发
            if (event.key.toLowerCase() === 'd') {
                // 阻止默认行为并停止传播，避免被播放器拦截
                event.preventDefault();
                event.stopPropagation();

                // 尝试查找弹幕按钮（全屏和窗口模式下的不同位置）
                let commentButton = document.querySelector('.rdfplayer-comment-state-icon');

                if (commentButton) {
                    commentButton.click();  // 模拟点击切换弹幕

                    // 更新计数器并显示反馈
                    danmakuToggleCount++;
                    const statusText = danmakuToggleCount % 2 === 1 ? "弹幕关" : "弹幕开";
                    showDanmakuFeedback(statusText);
                }
            }
        }, true); // 注意这里使用了捕获阶段

        // 显示弹幕状态反馈提示
        function showDanmakuFeedback(text) {
            // 移除已存在的反馈提示
            const existingFeedback = document.querySelector('.danmaku-feedback');
            if (existingFeedback) {
                existingFeedback.remove();
            }

            // 创建新的反馈提示
            const feedback = document.createElement('div');
            feedback.className = 'danmaku-feedback';
            feedback.style.position = 'fixed';
            feedback.style.top = '50%';
            feedback.style.left = '50%';
            feedback.style.transform = 'translate(-50%, -50%)';
            feedback.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            feedback.style.color = 'white';
            feedback.style.padding = '10px 20px';
            feedback.style.borderRadius = '5px';
            feedback.style.fontSize = '16px';
            feedback.style.fontWeight = 'bold';
            feedback.style.zIndex = '9999';
            feedback.innerText = text;

            // 获取全屏元素或使用body
            const container = document.fullscreenElement || document.body;
            container.appendChild(feedback);

            // 2秒后移除反馈提示
            setTimeout(() => {
                feedback.remove();
            }, 2000);
        }

        // 全屏开关功能:Enter/F
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === 'F' || event.key === 'f' ) {
                const fullScreenButton = document.querySelector('.rdfplayer-full-icon');
                const exitFullScreenButton = document.querySelector('.rdfplayer-icon.rdfplayer-full-icon');

                // 使用 document.fullscreenElement 判断是否处于全屏状态
                if (document.fullscreenElement) {
                    // 如果是全屏，点击退出全屏按钮
                    if (exitFullScreenButton) {
                        exitFullScreenButton.click();
                    }
                } else {
                    // 如果不是全屏，点击进入全屏按钮
                    if (fullScreenButton) {
                        fullScreenButton.click();
                    }
                }
            }
        });

        // 网页全屏功能:W
        document.addEventListener('keydown', function(event) {
            // 检测是否按下W键
            if (event.key === 'W' || event.key === 'w') {
                // 获取全屏控制按钮
                const fullWebButton = document.querySelector('.rdfplayer-icon.rdfplayer-full-web-icon');

                if (fullWebButton) {
                    // 触发按钮的点击事件
                    fullWebButton.click();

                    // 添加视觉反馈
                    fullWebButton.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        fullWebButton.style.transform = '';
                    }, 200);
                }

                // 阻止默认行为（防止页面滚动）
                event.preventDefault();
            }
        })

        // 空格控制播放
        let isSpaceKeyEnabled = true; // 标志位，控制空格键功能是否启用

        // 播放/暂停视频的函数
        function toggleVideoPlayback() {
            const videoElement = document.querySelector('video'); // 获取 video 元素
            if (videoElement) {
                if (videoElement.paused) {
                    videoElement.play(); // 如果视频暂停，则播放
                } else {
                    videoElement.pause(); // 如果视频正在播放，则暂停
                }
            }
        }

        // 键盘事件监听
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' || event.key === 'Enter') {
                // 如果按下 Esc 或 Enter 键，禁用空格键功能
                isSpaceKeyEnabled = false;
            }

            if (event.key === ' ' && isSpaceKeyEnabled) { // 检测空格键且功能未禁用
                event.preventDefault(); // 防止空格键触发页面滚动
                toggleVideoPlayback(); // 调用播放/暂停函数
            }
        });

        // 鼠标点击事件监听
        document.addEventListener('click', function(event) {
            if (event.button === 0) { // 检测鼠标左键点击
                const videoElement = document.querySelector('video');
                if (videoElement && videoElement.contains(event.target)) { // 检查点击目标是否是视频本身
                    toggleVideoPlayback(); // 调用播放/暂停函数
                }
                isSpaceKeyEnabled = false; // 禁用空格键功能
            }
        });
    }

    // 自动播放功能
    let hasPlayed = false;
    const iframe = document.getElementById("RDFPLAYER_VOD_IFRAME");

    if (!iframe) {
        console.error("Iframe not found!");
        return;
    }

    // 显示自定义提示框
    function showFocusTip() {
        // 创建自定义提示框
        const tipBox = document.createElement("div");
        tipBox.id = "focus-tip-box";
        tipBox.style.position = "fixed";
        tipBox.style.top = "20px";
        tipBox.style.left = "50%";
        tipBox.style.transform = "translateX(-50%)";
        tipBox.style.padding = "10px 20px";
        tipBox.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        tipBox.style.color = "white";
        tipBox.style.borderRadius = "5px";
        tipBox.style.zIndex = "9999";
        tipBox.style.fontSize = "16px";
        tipBox.innerText = "预先点击一次'播放器'或'F键',可确保正常进入全屏模式";

        // 添加到页面上
        document.body.appendChild(tipBox);

        // 自动关闭提示框，5秒后
        setTimeout(() => {
            if (tipBox) {
                tipBox.style.display = "none"; // 隐藏提示框
            }
        }, 5000);
    }

    // 处理 iframe 加载后的操作
    function handleIframeLoad() {
        if (hasPlayed) return;
        hasPlayed = true;

        // 延迟执行播放操作
        setTimeout(function() {
            const playButton = document.getElementById("ssdi");
            if (playButton) {
                playButton.click();
            } else {
                console.error("Play button not found!");
            }

            const message = { action: "play" };
            iframe.contentWindow.postMessage(message, "*");

            // 增加延迟以确保内容加载完毕
            setTimeout(() => {
                enterFullscreen();
            }, 0);
        },3000);
    }

    // 监听 iframe 的 onload 事件
    iframe.onload = handleIframeLoad;

    // 监听 iframe src 属性变化
    let previousSrc = iframe.src;
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                previousSrc = iframe.src;
                iframe.onload = handleIframeLoad;
            }
        });
    });

    observer.observe(iframe, { attributes: true });

    // 检查 iframe src 是否为空或特定值，如果是，则设置新的 src，并弹出提示框
    if (!iframe.src || iframe.src === "https://rdfplayer.mrgaocloud.com/player/?url=") {
        iframe.src = "https://rdfplayer.mrgaocloud.com/player/?url=VALID_VIDEO_URL&t=" + Date.now();
        showFocusTip(); // 弹出提示框
    } else {
        iframe.src = iframe.src + "&t=" + Date.now(); // 添加时间戳参数
    }

    //进入全屏
    function enterFullscreen() {
        try {
            if (iframe.requestFullscreen) {
                iframe.requestFullscreen().then(() => {
                    iframe.contentWindow.focus(); // 将焦点设置到 iframe 的 contentWindow
                });
            } else if (iframe.mozRequestFullScreen) {
                iframe.mozRequestFullScreen().then(() => {
                    iframe.contentWindow.focus();
                });
            } else if (iframe.webkitRequestFullscreen) {
                iframe.webkitRequestFullscreen().then(() => {
                    iframe.contentWindow.focus();
                });
            } else if (iframe.msRequestFullscreen) {
                iframe.msRequestFullscreen().then(() => {
                    iframe.contentWindow.focus();
                });
            } else {
                console.error("Fullscreen API is not supported.");
            }
        } catch (error) {
            console.error("Failed to enter fullscreen:", error);
        }
    }
})

(function() {
    'use strict';

    // 用于广告拦截的元素选择器列表
    const selectorsToBlock = [
        '#pause-ad-close',
        '#pause-ad-tip',
        '#pause-ad-vod',
        '.ad-type-vod.player-pause-ad',
        '.footer > p'
    ];

    // 拦截图片广告
    const blockedImageUrls = [
        'lcdn.redfoxw.com/cache/taobao/ad2.gif'
    ];

    // 移除广告元素的函数
    function removeAds() {
        selectorsToBlock.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.remove();
            });
        });

        // 拦截图片广告
        document.querySelectorAll('img').forEach(img => {
            if (blockedImageUrls.some(url => img.src.includes(url))) {
                img.remove();
            }
        });
    }

    // 使用 MutationObserver 监测 DOM 变化
    const observer = new MutationObserver(function(mutations) {
        removeAds();
    });

    // 开始观察 DOM 变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始执行一次
    removeAds();

    // 监听动态加载的内容（如通过 AJAX）
    document.addEventListener('DOMContentLoaded', removeAds);
    window.addEventListener('load', removeAds);
})();
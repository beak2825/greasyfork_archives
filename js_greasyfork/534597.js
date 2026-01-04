// ==UserScript==
// @name         A2P
// @namespace    https://github.com/MakotoArai-CN/A2P
// @version      1.1.3
// @description  Anime2Potplayer，用Potplayer打开浏览器播放的动漫，然后本地使用SVP4补帧！Potplayer需要是安装版，否则不生效。
// @author       MakotoArai(https://github.com/MakotoArai-CN)
// @supportURL   https://blog.ciy.cool
// @license      GPL-v3
// @icon         https://cravatar.cn/avatar/1e84fce3269537e4aa7473602516bf6d?s=256
// @match        *anich.emmmm.eu.org/*
// @match        *.mutedm.com/*
// @match        *.iyinghua.com/*
// @match        *.5dm.link/*
// @match        *.dmd77.com/*
// @match        *.agefans.la/*
// @match        *43.240.156.118:8443/*
// @match        *tinaacg.net/*
// @match        *susudyy.com/*
// @match        *.5o5k.com/*
// @match        *.k6dm.com/*
// @match        *.233dm.com/*
// @match        *.mgnacg.com/
// @match        *.omofun2.xyz/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/534597/A2P.user.js
// @updateURL https://update.greasyfork.org/scripts/534597/A2P.meta.js
// ==/UserScript==

'use strict';

const m3u8Urls = new Set();
let resultsShown = false;

function showResults(title, text, timeout) {
    // 发送桌面通知
    if (typeof GM_notification !== 'undefined') {
        GM_notification({
            title: title,
            text: text,
            timeout: timeout,
            //点击后触发复制
            onclick: function () {
                GM_setClipboard(text);
            }
        });
    }
}

// 拦截所有网络请求
if (typeof GM_xmlhttpRequest !== 'undefined') {
    const originalXHR = unsafeWindow.XMLHttpRequest;
    unsafeWindow.XMLHttpRequest = function () {
        const xhr = new originalXHR();
        const originalOpen = xhr.open;

        xhr.open = function (method, url) {
            if (url && /\.m3u8($|\?)/i.test(url)) {
                m3u8Urls.add(url);
                if (GM_getValue("notify")) showResults("M3U8嗅探到:", url, 5000);
                console.log('拦截到M3U8 (XHR):', url);
                GM_setValue("Reallyurl", url);
            }
            return originalOpen.apply(this, arguments);
        };

        return xhr;
    };
}

// 监听动态创建的video元素
new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
            if (node.nodeName === 'VIDEO') checkVideoElement(node);
            if (node.querySelectorAll) node.querySelectorAll('video').forEach(checkVideoElement);
        });
    });
}).observe(document, { childList: true, subtree: true });

/**
 * .m3u8嗅探
 * @param {*} video 
 */
function checkVideoElement(video) {
    if (video.src && /\.m3u8($|\?)/i.test(video.src)) {
        m3u8Urls.add(video.src);
        // console.log('发现M3U8 video元素:', video.src);
        // showResults();
    }
}
// 初始检查
document.querySelectorAll('video').forEach(checkVideoElement);
// console.log('M3U8综合嗅探已激活');

window.onload = function () {
    console.info("%cA2P%c%s", "color:red;font-size:40px;font-weight:bold;", "color:black;font-size:16px;font-weight:normal", "\n" + GM_info.script.version);
    // 定时器用于动态嗅探视频链接
    const videoTimer = setInterval(findVideoUrl, 1000);
    console.log(window.top != window ? "嗅探当前处于iframe中" : "嗅探当前不处于iframe中");

    // 域名包含 anich.emmmm.eu.org 则启用下面的逻辑
    if (window.location.href.includes("anich.emmmm.eu.org")) {
        // 定时器检测url是否改变，如果改变则重新调用findVideoUrl
        setInterval(function () {
            if (GM_getValue("url") !== window.location.href) {
                // 存入url方便对比
                GM_setValue("url", window.location.href);
                findVideoUrl();
            }
        }, 1500);
    }

    function Launch(App, url) {
        try {
            if (window.top != window) {
                window.top.postMessage({ type: 'launch', app: App, url: url }, '*');
                console.log("Launch to (iframe):" + `${App}://${url}`);
                return;
            }
            window.location.href = `${App}://${url}`;
            console.log(window.top != window ? "唤起当前处于iframe中" : "唤起当前不处于iframe中");
            console.log("Launch to:" + `${App}://${url}`);
        } catch (error) {
            if (error.message.includes("is not installed")) {
                alert(`请先安装 ${App}`);
            }
        }
    }

    function findVideoUrl() {
        const videoElement = document.querySelector("video");
        if (videoElement && videoElement.src) {
            clearInterval(videoTimer);
            preparePotplayerInteraction(videoElement, GM_getValue("check") ?? false);
        }
    }

    function preparePotplayerInteraction(videoElement, check = true) {
        let videoUrl = videoElement.src;
        console.log(`检测到视频链接: ${videoUrl}`);
        if (videoElement.src.includes("blob:")) videoUrl = GM_getValue("Reallyurl");;
        creatBtn(videoElement);
        if (check) {
            Launch("potplayer", videoUrl)
            // 检测是否播放，如果正在播放则暂停网页的播放
            var pause_Flag = 0;
            const checkTimer = setInterval(() => {
                const isPlaying = !videoElement.paused && !videoElement.ended && videoElement.readyState > 2;
                // console.log(isPlaying ? "正在播放" : "已暂停或结束");
                if (isPlaying) videoElement.pause();
                if (!isPlaying || pause_Flag > 100) clearInterval(checkTimer);
                pause_Flag++;
            }, 1500);
        };

    }

    function creatBtn(videoElement) {
        // 插入自定义CDN
        document.head.insertAdjacentHTML("beforeend", `
            <link href="https://cdn.bootcdn.net/ajax/libs/font-awesome/6.7.2/css/all.min.css" rel="stylesheet">
        `);
        // 右键菜单
        var menu = document.createElement("div");
        document.head.insertAdjacentHTML("beforeend", `
            <style>
                 a {text-decoration: none;}
                div.usercm{background-repeat:no-repeat;background-position:center center;background-size:cover;background-color:#fff;font-size:13px!important;width:160px;-moz-box-shadow:1px 1px 3px rgba
                (0,0,0,.3);box-shadow:0px 0px 15px #333;position:absolute;display:none;z-index:10000;opacity:0.9; border-radius: 8px;}
                div.usercm ul{list-style-type:none;list-style-position:outside;margin:0px;padding:0px;display:block}
                div.usercm ul li{margin:0px;padding:0px;line-height:35px;}
                div.usercm ul li a{color:#666;padding:0 15px;display:block}
                /* div.usercm ul li a:hover{color:#fff;background:rgba(170,222,18,0.88)} */
                div.usercm ul li a:hover{color:#fff;background:rgba(15, 120, 233, 0.88)} /* 蓝色 */
                div.usercm ul li a i{margin-right:10px}
                a.disabled{color:#c8c8c8!important;cursor:not-allowed}
                a.disabled:hover{background-color:rgba(255,11,11,0)!important}
                div.usercm{background:#fff !important;}
            </style>
        )`);
        menu.innerHTML = `
            <div class="usercm" style="left: 199px; top: 5px; display: none;">
                <ul>
                    <li style="border-bottom:1px solid gray"><a href="javascript:window.location.reload();"><i class="fa fa-refresh fa-fw"></i><span>重载网页</span></a></li>
                    <li><a href="javascript:void(0);" class="potplayer"><i class="fas fa-external-link-alt"></i><span>Potplayer(X)</span></a></li>
                    <li><a href="javascript:void(0);" class="aa2p"><i class="fas fa-robot"></i><span>自动跳转</span></a></li>
                    <li><a href="javascript:void(0);" class="notify"><i class="far fa-bell-slash"></i><span>关闭通知</span></a></li>
                    <li><a href="https://blog.ciy.cool"><i class="fas fa-blog"></i><span>联系作者</span></a></li>
                </ul>
            </div>
            `;
        document.body.appendChild(menu);

        function menuFun(GMValue, element, icon_on, icon_off, text) {
            const check = GM_getValue(GMValue) ?? false;
            if (check) {
                GM_setValue(GMValue, false);
                element.innerHTML = `<i class="${icon_off}"></i><span>开启${text}</span>`;
            } else {
                GM_setValue(GMValue, true);
                element.innerHTML = `<i class="${icon_on}"></i><span>关闭${text}</span>`;
            }
        }



        // 自定义鼠标右键菜单行为
        (function () {
            let mouseX = 0;
            let mouseY = 0;
            let windowWidth = 0;
            let windowHeight = 0;

            // 获取元素
            const menu = document.querySelector('.usercm');

            // 鼠标移动事件
            window.addEventListener('mousemove', function (e) {
                windowWidth = window.innerWidth;
                windowHeight = window.innerHeight;
                mouseX = e.clientX;
                mouseY = e.clientY;

                // 设置菜单位置
                let left = e.pageX;
                let top = e.pageY;

                if (mouseX + menu.offsetWidth >= windowWidth) left = left - menu.offsetWidth - 5;
                if (mouseY + menu.offsetHeight >= windowHeight) top = top - menu.offsetHeight - 5;

                // 绑定右键点击事件
                document.documentElement.addEventListener('contextmenu', function (event) {
                    if (event.button === 2) { // 右键点击
                        event.preventDefault();
                        menu.style.left = `${left}px`;
                        menu.style.top = `${top}px`;
                        menu.style.display = 'block';
                    }
                });

                // 点击隐藏菜单
                document.documentElement.addEventListener('click', function () {
                    menu.style.display = 'none';
                });
            });

            // 禁用默认右键菜单
            window.oncontextmenu = function (e) {
                e.preventDefault();
                return false;
            };

            // 判断是否是移动端
            const userAgent = navigator.userAgent;
            const mobileKeywords = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
            let isMobile = false;

            for (let keyword of mobileKeywords) {
                if (userAgent.indexOf(keyword) > -1) {
                    isMobile = true;
                    break;
                }
            }

        })();
        const potplayer = document.querySelector(".potplayer");
        const aa2p = document.querySelector(".aa2p");
        const notify = document.querySelector(".notify");
        let videoUrl = videoElement.src;
        if (videoElement.src.includes("blob:")) videoUrl = GM_getValue("Reallyurl");;
        potplayer.addEventListener("click", function () {
            Launch("potplayer", videoUrl);
            videoElement.pause();
        })

        document.onkeydown = function (e) {
            const keyNum = window.event ? e.keyCode : e.which;
            if (e.altKey && Number.isInteger(keyNum)) {
                switch (keyNum) {
                    case 88://  X 键--> potplayer
                        console.log("potplayer://" + videoUrl);
                        Launch("potplayer", videoUrl)
                        videoElement.pause();
                        break;
                    case 90://  Z 键--> 自动跳转
                        console.log("%cAuto jump %c%s", "", GM_getValue("check") ? "color:green;font-weight:bold;" : "color:red;font-weight:bold;", + GM_getValue("check") ? "Turn on" : "Turn off");
                        menuFun("check", this, "fas fa-toggle-on", "fas fa-toggle-off", "自动跳转");
                        break;
                }
            }
        };

        aa2p.innerHTML = `<i class="${GM_getValue("check") ? "fas fa-toggle-on" : "fas fa-toggle-off"}"></i><span>${GM_getValue("check") ? "关闭自动跳转" : "开启自动跳转"}</span>`;
        aa2p.addEventListener("click", function () { menuFun("check", this, "fas fa-toggle-on", "fas fa-toggle-off", "自动跳转"); });

        notify.innerHTML = `<i class="${GM_getValue("notify") ? "fas fa-bell" : "far fa-bell-slash"}"}"></i><span>${GM_getValue("notify") ? "关闭通知" : "开启通知"}</span>`;
        notify.addEventListener("click", function () { menuFun("notify", this, "fas fa-bell", "far fa-bell-slash", "通知"); });
    }
}

// 接收来自iframe的消息
window.addEventListener('message', function (event) {
    try {
        if (event.data.type === 'launch') {
            window.location.href = `${event.data.app}://${event.data.url}`;
        }
        // console.log(window.top != window ? "接收当前处于iframe中" : "接收当前不处于iframe中");
    } catch (error) {
        try {
            if (window.top != window) {
                window.top.location.href = `${event.data.app}://${event.data.url}`;
                console.log("Launch to (iframe):" + `${event.data.app}://${event.data.url}`);
                return;
            }
        } catch (error) {
            if (error.message.includes("is not installed")) {
                alert(`请先安装 ${event.data.app}`);
            }
        }
    }

});
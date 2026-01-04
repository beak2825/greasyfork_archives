// ==UserScript==
// @name         B站直播增强型关注列表 概念版
// @namespace    http://tampermonkey.net/
// @version      2.3.5
// @description  大点儿操作方便
// @author       SoraYuki & TGSAN
// @match        *://live.bilibili.com/*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/419826/B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%A2%9E%E5%BC%BA%E5%9E%8B%E5%85%B3%E6%B3%A8%E5%88%97%E8%A1%A8%20%E6%A6%82%E5%BF%B5%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/419826/B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%A2%9E%E5%BC%BA%E5%9E%8B%E5%85%B3%E6%B3%A8%E5%88%97%E8%A1%A8%20%E6%A6%82%E5%BF%B5%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let ENABLE_BLUR = true;

    if (ENABLE_BLUR == true) {
        ENABLE_BLUR = CSS.supports("backdrop-filter", "saturate(180%) blur(40px)") || CSS.supports("-webkit-backdrop-filter", "saturate(180%) blur(40px)");
    }

    let isHomePage = document.location.pathname == "/";
    let hasInit = false; // 插件是否初始化成功
    let followListOpened = false; // 关注列表开启状态
    let followListLoading = false; // 列表是否仍在拉取
    let applyUniStyle = document.createElement("style");
    let applyFeatureStyle = document.createElement("style");
    let applyThemeStyle = document.createElement("style");
    let darkStyle = `
        /* 卡片根框架 */
        .plugin-follow-card-root {
            background-color: rgba(176, 176, 196, 0.1);
        }
        /* 卡片信息标题 */
        .plugin-follow-card-text-title {
            color: #fff;
        }
        /* 卡片信息子标题 */
        .plugin-follow-card-text-subtitle {
            color: #999;
        }
        /* 关注列表标题 */
        .plugin-follow-list-title {
            color: #0080c6;
        }
        /* 关注列表 */
        .plugin-follow-list-div {
            background-color: rgba(21, 21, 21, ${ENABLE_BLUR ? "0.85" : "1"});
            pointer-events: none;
            width: 1px; /* 保留1px 绕过 Safari BUG */
            opacity: 0;
        }
        .plugin-follow-list-div-opened {
            ${ENABLE_BLUR ? "backdrop-filter: saturate(180%) blur(40px);" : ""}
            ${ENABLE_BLUR ? "-webkit-backdrop-filter: saturate(180%) blur(40px);" : ""}
            pointer-events: auto !important;
            width: 320px;
            opacity: 1;
        }
        /* 滚动条 */
        .plugin-follow-list-div::-webkit-scrollbar-thumb {
            background-color: rgba(255, 255, 255, 0.1);
        }
    `;
    let lightStyle = `
        /* 卡片根框架 */
        .plugin-follow-card-root {
            background-color: rgba(176, 176, 196, 0.2);
        }
        /* 卡片信息标题 */
        .plugin-follow-card-text-title {
            color: #000;
        }
        /* 卡片信息子标题 */
        .plugin-follow-card-text-subtitle {
            color: #999;
        }
        /* 关注列表标题 */
        .plugin-follow-list-title {
            color: #23ade6;
        }
        /* 关注列表 */
        .plugin-follow-list-div {
            background-color: rgba(255, 255, 255, ${ENABLE_BLUR ? "0.85" : "1"});
            pointer-events: none;
            width: 1px; /* 保留1px 绕过 Safari BUG */
            opacity: 0;
        }
        .plugin-follow-list-div-opened {
            ${ENABLE_BLUR ? "backdrop-filter: saturate(180%) blur(40px);" : ""}
            ${ENABLE_BLUR ? "-webkit-backdrop-filter: saturate(180%) blur(40px);" : ""}
            pointer-events: auto !important;
            width: 320px;
            opacity: 1;
        }
        /* 滚动条 */
        .plugin-follow-list-div::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.1);
        }
    `;
    let uniStyle = `
        /* 卡片根框架 */
        .plugin-follow-card-root {
            width: calc(100% - 50px);
            height: max-content;
            margin: 15px 15px;
            padding: 0px 10px;
            border-radius: 10px;
            transition: transform .2s cubic-bezier(.22,.58,.12,.98);
        }
        .plugin-follow-card-root:hover {
            transform: perspective(1px) scale(1.05) translate3d(0,0,0);
        }
        .plugin-follow-card-root:active {
            transform: perspective(1px) scale(0.98) translate3d(0,0,0);
        }
        /* 卡片信息 */
        .plugin-follow-card-info-div {
            vertical-align: top;
            display: inline-block;
            padding-left: 10px;
            overflow-x: hidden;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            width: calc(100% - 40px);
        }
        /* 卡片信息标题 */
        .plugin-follow-card-text-title {
            font-size: 15px;
        }
        /* 卡片信息子标题 */
        .plugin-follow-card-text-subtitle {
            font-size: 12px;
        }
        /* 卡片头像 */
        .plugin-follow-card-avatar {
            vertical-align: top;
            width: 40px;
            height: 40px;
            margin-top: 10px;
            display: inline-block;
            border-radius: 50%;
            background-color: #F7F7F7;
            background-size: cover;
        }
        /* 卡片文字 */
        .plugin-follow-card-text {
            line-height: 1.15;
            margin: 10px 0;
            display: block;
            overflow: hidden;
            -o-text-overflow: ellipsis;
            text-overflow: ellipsis;
            white-space: nowrap;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }
        /* 关注列表标题 */
        .plugin-follow-list-title {
            font-size: 18px;
            line-height: 24px;
        }
        /* 关注列表 */
        .plugin-follow-list-div {
            position: fixed;
            height: 100vh;
            z-index: 9999;
            top: 0px;
            left: 0px;
            box-shadow: rgba(0, 0, 0, 0.22) 1px 0px 12px 0px;
            transition: opacity 0.4s cubic-bezier(0.22, 0.58, 0.12, 0.98) 0s, width 0.4s cubic-bezier(0.22, 0.58, 0.12, 0.98) 0s;
            overflow-y: auto;
            pointer-events: auto;
            -webkit-tap-highlight-color: transparent;
        }
        /* 滚动条 */
        .plugin-follow-list-div::-webkit-scrollbar {
            width: 20px;
        }
        /* 滚动条 */
        .plugin-follow-list-div::-webkit-scrollbar-thumb {
            height: 56px;
            border-radius: 10px;
            border: 4px solid transparent;
            background-clip: content-box;
        }
    `;
    let featureStyle = `
        /* 直播间显示分区 */
        .header-info-ctnr .rows-ctnr .lower-row .live-area {
            display: flex !important;
        }
        .header-info-ctnr .rows-ctnr .lower-row .live-area .area-link {
            max-width: min-content !important;
        }
        /* 删除瞎子都能看见的“盲水印” */
        .blur-edges-ctnr {
            display: none !important;
        }
        /* 删除非常浪费性能的敏感分区打码 */
        #web-player-module-area-mask-panel > * {
            backdrop-filter: none !important
        }
    `;
    function parseColor(color) {
        var x = document.createElement('div');
        document.body.appendChild(x);
        var rgba;
        var red = 0, green = 0, blue = 0, alpha = 0;
        try {
            x.style = 'color: ' + color + '!important';
            color = window.getComputedStyle(x).color;
            rgba = color.match(/rgba?\((.*)\)/)[1].split(',').map(Number);
            red = rgba[0];
            green = rgba[1];
            blue = rgba[2];
            alpha = '3' in rgba ? rgba[3] : 1;
        }
        catch (e) { }
        x.parentNode.removeChild(x);
        return { 'red': red, 'green': green, 'blue': blue, 'alpha': alpha };
    }

    function secondsToHms(seconds) {
        let SECONDS_PER_DAY = 86400;
        let HOURS_PER_DAY = 24;
        let days = Math.floor(seconds / SECONDS_PER_DAY);
        let remainderSeconds = seconds % SECONDS_PER_DAY;
        let hms = new Date(remainderSeconds * 1000).toISOString().substring(11, 19);
        return hms.replace(/^(\d+)/, h => `${Number(h) + days * HOURS_PER_DAY}`.padStart(2, '0'));
    };

    function createLiveCard(avatarUrl, userName, titleName, link, verifyNum, tiptext) {
        let getVerifyColor = function (_verifyNum) {
            switch (_verifyNum) {
                case -1:
                    return "#fd5d91ff"; // 普通用户
                case 0:
                    return "#feb959ff"; // 个人
                case 1:
                    return "#50c8fdff"; // 企业
                default:
                    return "#808080ff";
            }
        };
        let avatarStyle = "background-image: url(&quot;" + avatarUrl + "&quot;); box-shadow: 0 0 10px 1px " + getVerifyColor(verifyNum) + ";";
        let cardRoot = document.createElement("div");
        cardRoot.className = "plugin-follow-card-root";
        let innerHTML = '<a title="' + tiptext + '" href="' + link + '" target="' + (isHomePage === true ? "_blank" : "_self") + '" ' + (isHomePage === true ? 'onclick="playerInstance.stop()"' : '') + ' style="text-decoration: none; margin: 0;">';
        innerHTML += '<div class="plugin-follow-card-avatar" style="' + avatarStyle + '"></div>';
        innerHTML += '<div class="plugin-follow-card-info-div">';
        innerHTML += '<p class="plugin-follow-card-text plugin-follow-card-text-title">' + userName + '</p>';
        innerHTML += '<p class="plugin-follow-card-text plugin-follow-card-text-subtitle">' + titleName + '</p>';
        innerHTML += '</div>';
        cardRoot.innerHTML = innerHTML;
        return cardRoot;
    }

    function clearList(followListBodyDiv) {
        while (followListBodyDiv.lastElementChild) {
            followListBodyDiv.removeChild(followListBodyDiv.lastElementChild);
        }
    }

    async function loadList(followListBodyDiv) {
        clearList(followListBodyDiv);

        // 标题
        let titleDiv = document.createElement("div");
        titleDiv.style = "width: max-content; padding: 20px 10px 5px 20px;";
        titleDiv.innerHTML = '<a href="https://link.bilibili.com/p/center/index#/user-center/follow/1" target="_blank" style="text-decoration: none;"><span class="plugin-follow-list-title"></span></a>';
        followListBodyDiv.appendChild(titleDiv);
        let titleText = titleDiv.children[0].children[0];
        titleText.innerText = "我的关注 - 载入中...";

        let j;
        try {
            let result = await fetch('https://api.live.bilibili.com/xlive/app-interface/v1/relation/liveAnchor', { credentials: 'include' });
            j = await result.json();
        } catch (e) {
            titleText.innerText = "我的关注 - 列表拉取失败 (ﾟ∀。)";
            return;
        }

        let count = j.data.total_count;

        if (j.data.rooms != undefined) {
            try {
                j.data.rooms.forEach(room => {
                    let tiptext = "人气：" + room.online + "  已开播：" + secondsToHms((Date.now() - (room.live_time * 1000)) / 1000);
                    followListBodyDiv.appendChild(createLiveCard(room.face, room.uname, room.title, "//live.bilibili.com/" + room.roomid, room.official_verify, tiptext));
                })
            } catch (e) {
                titleText.innerText = "我的关注 - 列表读取失败 (ﾟ∀。)";
                return;
            }
        }

        // 页脚
        let footerDiv = document.createElement("div");
        footerDiv.style = "height: 40px;";
        followListBodyDiv.appendChild(footerDiv);

        titleText.innerText = "我的关注 (" + count + ")";
    };

    async function loadListOld(followListBodyDiv) {
        clearList(followListBodyDiv);

        // 标题
        let titleDiv = document.createElement("div");
        titleDiv.style = "width: max-content; padding: 20px 10px 10px 20px;";
        titleDiv.innerHTML = '<a href="https://link.bilibili.com/p/center/index#/user-center/follow/1" target="_blank" style="text-decoration: none;"><span style="font-size: 18px; color: #23ade6; line-height: 24px;"></span></a>';
        followListBodyDiv.appendChild(titleDiv);
        let titleText = titleDiv.children[0].children[0];
        titleText.innerText = "我的关注 - 载入中...";

        let j;
        try {
            let result = await fetch('https://api.live.bilibili.com/xlive/web-ucenter/v1/xfetter/GetWebList?page=1&page_size=10', { credentials: 'include' });
            j = await result.json();
        } catch (e) {
            titleText.innerText = "我的关注 - 列表拉取失败 (ﾟ∀。)";
            return;
        }

        let count = j.data.count;
        let offset = 0;
        while (count > offset) {
            try {
                if (offset > 0) {
                    let result = await fetch('https://api.live.bilibili.com/xlive/web-ucenter/v1/xfetter/GetWebList?page=' + (offset / 10 + 1) + '&page_size=10', { credentials: 'include' });
                    j = await result.json();
                }
            } catch (e) {
                titleText.innerText = "我的关注 - 列表拉取失败 (ﾟ∀。)";
                return;
            }

            for (let i = 0; i < j.data.rooms.length; ++i) {
                let x = j.data.rooms[i];
                followListBodyDiv.appendChild(createLiveCard(x.face, x.uname, x.title, x.link, ""));
            }
            offset += j.data.rooms.length;
        }
        // 页脚
        let footerDiv = document.createElement("div");
        footerDiv.style = "height: 40px;";
        followListBodyDiv.appendChild(footerDiv);

        titleText.innerText = "我的关注 (" + count + ")";
    };

    function openList(followListFrameDiv, followListBodyDiv) {
        if (followListOpened === false) {
            followListOpened = true;
            followListFrameDiv.classList.add("plugin-follow-list-div-opened");
            if (followListLoading === false) {
                followListLoading = true;
                loadList(followListBodyDiv).then(function () {
                    followListLoading = false;
                    if (followListOpened === false) {
                        clearList(followListBodyDiv);
                    }
                });
            }
        }
    }

    function closeList(followListFrameDiv, followListBodyDiv) {
        if (followListOpened === true) {
            followListOpened = false;
            followListFrameDiv.classList.remove("plugin-follow-list-div-opened");
            clearList(followListBodyDiv);
        }
    }

    function updateStyle() {
        let bodyColor = parseColor(window.getComputedStyle(document.body, null)['background-color']);
        let isLight = (bodyColor.alpha == 0 || (((bodyColor.red + bodyColor.green + bodyColor.blue) / 3) >= 128));
        // 添加样式（通用）
        if (document.head == applyFeatureStyle.parentNode) {
            document.head.removeChild(applyFeatureStyle)
        }
        applyFeatureStyle.innerHTML = featureStyle;
        document.head.appendChild(applyFeatureStyle);
        // 添加样式（附加功能）
        if (document.head == applyUniStyle.parentNode) {
            document.head.removeChild(applyUniStyle)
        }
        applyUniStyle.innerHTML = uniStyle;
        document.head.appendChild(applyUniStyle);
        // 添加样式（主题色）
        if (document.head == applyThemeStyle.parentNode) {
            document.head.removeChild(applyThemeStyle)
        }
        applyThemeStyle.innerHTML = isLight ? lightStyle : darkStyle;
        document.head.appendChild(applyThemeStyle);
    }

    let initIntervalId = setInterval(function () {
        let followListFrameDiv = document.createElement("div");
        let followListBodyDiv = document.createElement("div");
        const injectDiag = function(oldFollowDiag) {
            if (oldFollowDiag?.parentElement) {
                oldFollowDiag.parentElement.hidden = true; // 隐藏旧的关注框
            }
        }
        const injectBtn = function(oldFollowBtn) {
            let newFollowBtn = oldFollowBtn.cloneNode(true);
            oldFollowBtn.parentNode.replaceChild(newFollowBtn, oldFollowBtn);
            newFollowBtn.addEventListener('click', function (event) {
                event.cancelBubble = true; // 重新阻止按钮点击事件传递
                if (followListOpened === true) {
                    closeList(followListFrameDiv, followListBodyDiv);
                } else {
                    updateStyle();
                    openList(followListFrameDiv, followListBodyDiv);
                }
            });
        }
        let oldFollowBtnList = [];
        {
            const oldFollowBtn = document.querySelector(".side-bar-btn[data-upgrade-intro='Follow']"); // 直播间侧栏
            if (oldFollowBtn) {
                oldFollowBtnList.push(oldFollowBtn);
            }
        }
        {
            const oldFollowBtn = document.querySelector(".sidebar-btn[title='关注']"); // 旧版首页侧栏
            if (oldFollowBtn) {
                oldFollowBtnList.push(oldFollowBtn);
            }
        }
        {
            const xpath = document.evaluate('//div[@class="text-label" and text()="关注"]', document, null, XPathResult.ANY_TYPE, null ); // 首页（新版，顶栏）
            const btnsub = xpath.iterateNext();
            const oldFollowBtn = btnsub?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement;
            if (oldFollowBtn) {
                oldFollowBtnList.push(oldFollowBtn);
            }
        }
        {
            const oldFollowBtn = document.querySelector(".focus-left-ctnr"); // 首页（新版，粉色按钮）
            if (oldFollowBtn) {
                oldFollowBtnList.push(oldFollowBtn);
            }
        }
        let oldFollowDiagList = document.getElementsByClassName("follow-cntr");
        const isPure = window.isPureRoom;
        if ((!isPure && oldFollowBtnList.length >= 2) || (isPure && oldFollowBtnList.length >= 1)) {
            hasInit = true;

            oldFollowBtnList.forEach(injectBtn);
            for(let i = 0; i < oldFollowDiagList.length; i++) {
                injectDiag(oldFollowDiagList[i]);
            }

            followListFrameDiv.classList.add("plugin-follow-list-div");
            followListFrameDiv.addEventListener("click", function (event) {
                event.cancelBubble = true; // 阻止关注列表点击事件传到父级
            });
            document.addEventListener("click", function () {
                closeList(followListFrameDiv, followListBodyDiv); // 点其他元素（会传递事件的）收回列表
            });
            document.body.appendChild(followListFrameDiv);

            followListBodyDiv.style.setProperty("height", "100%");
            followListBodyDiv.style.setProperty("width", "100%");
            followListFrameDiv.appendChild(followListBodyDiv);

            updateStyle();

            clearInterval(initIntervalId);
        }
    }, 100);

    setTimeout(function () {
        if (hasInit === false) {
            clearInterval(initIntervalId);
        }
    }, 15000); // 元素查找超时（15s）
})();
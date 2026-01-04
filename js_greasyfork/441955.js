// ==UserScript==
// @name            shumin-Bilibili
// @namespace       https://www.tampermonkey.net/
// @version         6.2.4
// @description     视频结束时自动关全屏，添加获取视频封面按钮（在播放器右下方三点里面），修改为彩虹进度条高能进度条改灰色，缩窄顶栏，宽屏简化动态页并淡化非视频动态，清理链接，不显示视频页面的弹幕盒子、广告等右栏杂物，直接显示推荐视频。
// @author          庶民player
// @license         MIT
// @match           *.bilibili.com/*
// @exclude         *://search.bilibili.com/*
// @icon            https://static.hdslb.com/images/favicon.ico
// @grant           none
// @run-at          document-ready
// @downloadURL https://update.greasyfork.org/scripts/441955/shumin-Bilibili.user.js
// @updateURL https://update.greasyfork.org/scripts/441955/shumin-Bilibili.meta.js
// ==/UserScript==


/*
        $("a:has(span:contains('直播'))").closest("li").remove();
        $("a:has(span:contains('游戏中心'))").closest("li").remove();
        $("a:has(span:contains('会员购'))").closest("li").remove();
        $("a:has(span:contains('赛事'))").closest("li").remove();
*/

function go_dn(elemSelector) {
    const elem = document.querySelector(elemSelector);
    if (!elem) return;

    let nextElem = elem.nextElementSibling;
    while (nextElem) {
        const currentNext = nextElem;
        nextElem = nextElem.nextElementSibling;
        currentNext.after(elem);
    }
}
function waitForElement(selector, callback, checkVisibility = false) {
    const element = document.querySelector(selector);
    if (element && (!checkVisibility || (getComputedStyle(element).display !== "none"))) {
        callback(element);
    } else {
        setTimeout(() => waitForElement(selector, callback, checkVisibility), 1000);
    }
}
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
    } else if (document.cancelFullScreen) {
        document.cancelFullScreen();
    }
}
function getUrl() {
    // 获取当前视频的 BV 号
    var source_url = window.location.href;
    var video_BV = /https:\/\/www\.bilibili\.com\/video\/(BV\w+)/i;

    var match = source_url.match(video_BV);
    if (!match) {
        console.error("无法获取BV号");
        return;
    }

    var bvid = match[1]; // 提取 BV 号
    var api_url = `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`;

    // 创建 XMLHttpRequest 对象并发送 API 请求
    var xhr = new XMLHttpRequest();
    xhr.open('GET', api_url, false);
    xhr.send();

    // 解析 API 响应
    if (xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);

        // 检查响应中是否包含封面地址
        if (response.code === 0 && response.data && response.data.pic) {
            return response.data.pic; // 返回封面图片地址
        } else {
            console.error("未能获取封面信息");
            return;
        }
    } else {
        console.error("请求失败，状态码: " + xhr.status);
        return;
    }
}
function thin_topbar() {

    const setH = 42;

    const headerFixed = document.querySelector(".bili-header.fixed-header");
    const miniHeader = document.querySelector(".bili-header__bar.mini-header");

    if (headerFixed) {
        headerFixed.style.height = `${setH}px`;
        headerFixed.style.minHeight = `${setH}px`;
    }

    if (miniHeader) {
        miniHeader.style.height = `${setH}px`;
        miniHeader.style.minHeight = `${setH}px`;
        miniHeader.style.paddingLeft = "7px";
        miniHeader.style.paddingRight = "0px";
    }

    const viewboxReport = document.querySelector("#viewbox_report.video-info-container");
    if (viewboxReport) {
        viewboxReport.style.paddingTop = "13px";
        viewboxReport.style.height = "80px";
    }

    const videoToolbar = document.querySelector(".video-toolbar-container");
    if (videoToolbar) {
        videoToolbar.style.paddingTop = "6px";
        videoToolbar.style.paddingBottom = "3px";
    }

    const uploadEntry = document.querySelector('.header-upload-entry');
    if (uploadEntry) {
        uploadEntry.style.backgroundColor = '#3F703F';
        //uploadEntry.setAttribute('data-darkreader-inline-bgcolor', '#8FBC8F');
    }

    const logoPath = document.querySelector('.mini-header__logo path');
    if (logoPath) {
        logoPath.setAttribute('fill', '#DAA500');
    }

    const biliMainHeader = document.getElementById("biliMainHeader");
    if (biliMainHeader) {
        biliMainHeader.style.height = `${setH}px`;
        biliMainHeader.style.minHeight = `${setH}px`;
        biliMainHeader.style.top = `${(setH-64)/2}px`;
    }

    const download_tip = document.querySelector("#biliMainHeader > div > div > ul.left-entry > li:nth-child(8) > a > span");
    if(download_tip) download_tip.style.display = "none";
    const home_tip = document.querySelector("#biliMainHeader > div > div > ul.left-entry > li:nth-child(1) > a > div > span");
    if(home_tip) home_tip.style.display = "none";

}

function filterContent() {
    const elements = document.querySelectorAll('.bili-dyn-item__main');
    elements.forEach(function(element) {
        let opct = '0.5';

        if (
            element.querySelector(".bili-dyn-card-article") ||
            element.querySelector(".bili-dyn-card-audio") ||
            element.querySelector('.bili-dyn-card-video') ||
            element.querySelector('.bili-dyn-card-pgc')
        ){ opct = '1.0'; } // 白名单

        if (
            element.querySelector('.dyn-card-opus') ||
            element.querySelector('.bili-dyn-card-courses') ||
            element.querySelector('.reference') ||
            !element.querySelector("div[data-type='comment']") ||//不能评论的
            false
        ){ opct = '0.5'; } // 也许有用也许没用的，回调半透明

        if (
            element.querySelector(".dyn-goods") ||
            element.querySelector(".bili-dyn-card-goods") ||
            element.querySelector(".bili-dyn-card-reserve") ||
            element.querySelector(".bili-dyn-card-vote") ||
            element.querySelector(".lottery") ||
            element.querySelector(".bili-dyn-card-live") ||
            element.querySelector(".bili-dyn-card-event") ||
            element.querySelector(".bili-dyn-upower-common") ||
            element.querySelector(".dyn-blocked-mask__content") ||
            Array.from(element.querySelectorAll('.bili-dyn-card-common__badge')).some(badge => badge.textContent.trim() === '活动') ||
            Array.from(element.querySelectorAll('.bili-dyn-card-video__badge')).some(badge => {
                const text = badge.textContent.trim();
                return text === '充电专属' || text === '直播回放';
            }) ||
            false
        ){ opct = '0.2'; } // 含黑名单的，全透明


        element.style.opacity = opct;
    });

}

//-=-=-=-=-=-=-=-=-=-=-=-=-通用-=-=-=-=-=-=-=-=-=-=-=-

thin_topbar();
const topbar_observer = new MutationObserver( thin_topbar );
topbar_observer.observe(document.body, { childList: true, subtree: true });
/*waitForElement('.header-upload-entry', (target_header) => {
    topbar_observer.observe( target_header, {
        childList: true, subtree: true,
        attributes: true, attributeFilter: ['class', 'id', 'style','data-*']
    });
} );*/


//-=-=-=-=-=-=-=-=-=-=-=-=-t.bili-=-=-=-=-=-=-=-=-=-=-=-
    
    if (window.location.href.indexOf("t.bilibili.com") >= 0 ){

        window.onload = function(){
            const elementsToHide = [
                ".right",
                ".left",
                ".bili-dyn-publishing",
                "#bili-header-container ul.left-entry > li:nth-child(1) > a > div > span",
                ".left-entry",
                ".center-search-container",
            ];
            elementsToHide.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => el.style.display = "none");
            });

            if(window.location.href.indexOf("tab=video") < 0){
                const videoTab = document.querySelector(".bili-dyn-list-tabs__item:nth-child(2)");
                if (videoTab) videoTab.click();
            }
            
            const style = document.createElement('style');
            style.textContent = `
                #app > div.bili-dyn-home--member > main {
                    width: 780px !important;
                    margin: 0 auto !important;
                    /*left: 32px;*/
                }
                .bili-dyn-sidebar {
                    right: 0!important;
                }
                #bili-header-container {
                    position: fixed !important;
                    bottom:96px !important;
                    z-index: 1000 !important;
                    transform: rotate(-90deg)  !important;
                    transform-origin: left top !important;
                    will-change: transform;
                }
            `;
            document.head.appendChild(style);

        }
 
        document.body.style.overflowX = "hidden";
        
        let scroll_inter = 256, scroll_num = scroll_inter;
        window.addEventListener('scroll', () => {
            scroll_num++;
            if (scroll_num > scroll_inter) {
                filterContent();
                scroll_num = 0; setTimeout(() => { scroll_num = scroll_inter; }, 100);
            }
        });

        return;
    }
 
//-=-=-=-=-=-=-=-=-=-=-=-=-自动关全屏、封面-=-=-=-=-=-=-=-=-=-=-=-
 
    if (window.location.href.indexOf("bilibili.com/video/") >= 0 ){

        waitForElement('.video-tool-more-dropdown', (container) => {
            const newButton = document.createElement('div');
            newButton.className = 'video-toolbar-right-item dropdown-item';
            newButton.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="video-toolbar-item-icon">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3ZM5 5H19V15L15.75 11.75C15.3358 11.3358 14.6642 11.3358 14.25 11.75L11 15L9.75 13.75C9.33579 13.3358 8.66421 13.3358 8.25 13.75L5 17V5ZM8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"/>
                </svg>
                <span class="video-toolbar-item-text">获取封面</span>
            `;
            newButton.addEventListener('click', function() {
                window.open(getUrl());
            });
            container.appendChild(newButton);
        });

        waitForElement('.bpx-player-ending', exitFullscreen, true );
        waitForElement('.bpx-player-electric-box', exitFullscreen, true );

        waitForElement('.nav-search-btn', (container) => {
            const actNow = document.querySelector('.act-now');
            if (actNow) actNow.style.display = 'none';

            go_dn('.video-card-ad-small');
            go_dn('.video-page-game-card-small');
            go_dn('#paybar_module');
            go_dn('#danmukuBox');

            if (window.location.href.indexOf("bilibili.com/video/") >= 0 ) window.history.replaceState( null, null, window.location.pathname);

            //thin_topbar();
        });

    }
 
//-=-=-=-=-=-=-=-=-=-=-=-=-=-彩虹条=-=-=-=-=-=-=-=-=-=-=-=-=
    var css = `
    /* 进度条样式 */
    .bpx-player-progress-schedule-current {
        /*background: linear-gradient(
            to left,
            #FF0000 0%,
            #FF7F00 16.5%,
            #FFFF00 33%,
            #00FF00 50%,
            #0000FF 66%,
            #4B0082 83.5%,
            #9400D3 100%
        ) !important;*/
        background: linear-gradient(
            to left,
            #FF004D 0%,
            #FF6600 16.5%,
            #FFCC00 33%,
            #66FF33 50%,
            #33CCFF 66%,
            #9933FF 83.5%,
            #FF3399 100%
        ) !important;
    }
    /* 缓冲条样式*/
    .bpx-player-progress-schedule-buffer {
        background: repeating-linear-gradient(
            45deg,
            #888888 0,
            #888888 20px,
            #000000 20px,
            #000000 40px
        );
        background-size: 200% 200%;
        animation: barberPole 10s linear infinite;
    }
    @keyframes barberPole {
        0% { background-position: 0% 0%; }
        100% { background-position: 200% 200%; }
    }
    `;
    if (typeof GM_addStyle != "undefined") {
        GM_addStyle(css);
    } else if (typeof PRO_addStyle != "undefined") {
        PRO_addStyle(css);
    } else if (typeof addStyle != "undefined") {
        addStyle(css);
    } else {
        var node = document.createElement("style");
        node.type = "text/css";
        node.appendChild(document.createTextNode(css));
        var heads = document.getElementsByTagName("head");
        if (heads.length > 0) {
            heads[0].appendChild(node);
        } else {
            document.documentElement.appendChild(node);
        }
    }

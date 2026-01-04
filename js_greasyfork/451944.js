// ==UserScript==
// @name         哔哩哔哩 可滚动网页宽屏
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  fill the window with the video player.
// @description:zh-cn  宽屏但是屏幕可滚动，默认的网页宽屏不能滚动屏幕。
// @author       Xue
// @license      MIT
// @match        https://www.bilibili.com/video/*
// @icon         data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'%3E%3Cpath d='M801 237l-51 .002 44-45c10-10 15-22.667 15-38s-5-28-15-38-22.667-15-38-15-28.333 5-39 15l-128 121H436l-129-121c-10-10-22.667-15-38-15s-28 5-38 15-15 22.667-15 38 5 28 15 38l44 45h-51c-46 1.333-83.833 17-113.5 47s-45.167 67.667-46.5 113v346c1.333 49.333 16.833 89.166 46.5 119.499S178 908.667 224 910h570c46-1.333 84-16.833 114-46.5S953.333 796 954 750V397c2-45.333-11.5-83-40.5-113S847 238.333 801 237zm45 506.002c-.667 16-6.504 29.667-17.504 41s-24.5 17-40.5 17h-557c-16 0-29.667-5.667-41-17s-17-25-17-41v-339c.667-16.667 6.334-30.334 17.001-41.001s24.334-16.334 41.001-17.001h557c16.667.667 30.334 6.334 41.001 17.001s16.334 24.334 17.001 41.001v339zm-500.004-282c-16 .667-29.504 6.5-40.504 17.5s-16.833 24.5-17.5 40.5v58c.667 16 6.334 29.5 17.001 40.5s24.334 16.5 41.001 16.5 30.334-5.5 41.001-16.5 16.334-24.5 17.001-40.5v-58c-.667-16-6.5-29.5-17.5-40.5s-24.5-16.833-40.5-17.5zm332.996 0c-16 .667-29.504 6.5-40.504 17.5s-16.833 24.5-17.5 40.5v58c.667 16 6.334 29.5 17.001 40.5s24.334 16.5 41.001 16.5 30.334-5.5 41.001-16.5 16.334-24.5 17.001-40.5v-58c-.667-16-6.5-29.5-17.5-40.5s-24.5-16.833-40.5-17.5z'/%3E%3C/svg%3E
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/451944/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%20%E5%8F%AF%E6%BB%9A%E5%8A%A8%E7%BD%91%E9%A1%B5%E5%AE%BD%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/451944/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%20%E5%8F%AF%E6%BB%9A%E5%8A%A8%E7%BD%91%E9%A1%B5%E5%AE%BD%E5%B1%8F.meta.js
// ==/UserScript==

// hide the scroll bar but still scroll
GM_addStyle("body::-webkit-scrollbar {display:none;}"); /* Safari and Chrome */
GM_addStyle("body {-ms-overflow-style:none;}"); /* Internet Explorer 10+ */
GM_addStyle("body {scrollbar-width:none;}"); /* Firefox */

GM_addStyle("#bilibili-player {position: fixed; z-index: 100000; borderRadius: 0; left: 0; top: 0; width: 100%; height: 100%}");
//GM_addStyle(`#bilibili-player {height: $\{window.innerHeight.toString() + 'px'\}}`);
GM_addStyle("#biliMainHeader {position: relative}");

(function() {
    'use strict';

    // the main element
    let appElement = document.querySelector("#app");
    // the player
    let playerElement = document.querySelector("#bilibili-player");
    // the original playerWrap
    let playerWrapElement = document.querySelector("#playerWrap");
    // header
    let headerElement = document.querySelector("#biliMainHeader");

    // mode-webscreen class will be removed at initial, utilize cssText to force enable webscreen
    //playerElement.classList.add("mode-webscreen");
    // dirty trick: do not move player DOM ahead at first, until the comment loaded
    //playerElement.style.cssText = "position: fixed; z-index: 100000; borderRadius: 0; left: 0; top: 0; width: 100%; height: 100%";
    //playerWrapElement.style.display = "";
    //appElement.insertBefore(playerElement, headerElement);
    // replace fixed position to relative, which move the header beneath the player
    //headerElement.style.position = "relative";
    // remove the danmu sending bar: before resize the height ######## not work????
    //document.getElementsByClassName('bpx-player-sending-area')[0].style.cssText = 'none !important';
    // brute force hiding the danmu sending bar
    document.getElementsByClassName('bpx-player-sending-area')[0].style.cssText = "z-index: -1; opacity: 0";
    document.getElementsByClassName('bpx-player-sending-bar')[0].style.cssText = "height: 0 !important";

    //playerElement.style.height = window.innerHeight.toString() + 'px';
    // not work?
    document.getElementsByClassName('bpx-player-video-area')[0].style.cssText = `height: ${window.innerHeight}px !important`;



    // remove the black player placeholder
    //playerWrapElement.style.display = 'none';
    // modify 'normal mode' to 'web mode', which remove the tiny navigator off
    //playerElement.firstChild.firstChild.dataset.screen = 'web'; // failed
    document.getElementsByClassName('fixed-nav')[0].style.display = 'none';

    // resize the player height
    window.addEventListener('resize', event => {
        playerElement.style.height = window.innerHeight.toString() + 'px';
    });


    // header stick to the top
    let clockEmojis = "⌛⏳⌚⏰⏱⏲🕰"
    // to be more noticeable with random emojis
    let randomEmojisFunc = ()=> clockEmojis[Math.floor(Math.random() * clockEmojis.length)]
    window.addEventListener("scroll", (event) => {
        let scroll = window.scrollY;

        if (scroll > playerElement.offsetHeight) {
            headerElement.firstChild.firstChild.style.position = "fixed";
        }
        else {
            // as long as scrollY has a tiny value, show the header
            headerElement.style.display = "";
            headerElement.firstChild.firstChild.style.position = "relative";
        };
        // tooltip the flaws: can't scroll at this time
        if (!document.getElementsByClassName("bpx-player-control-bottom-center")[0].firstChild){
            document.getElementsByClassName('bpx-player-loading-panel-text')[0].insertAdjacentHTML('beforeend', `<div class="bpx-player-loading-panel-text-row">
                    <span>[可滚动网页宽屏]</span>
                    <span>正在加载评论，请等待加载完成后滚动${randomEmojisFunc()}</span>
                </div>`)
        }
    });

    // let open = XMLHttpRequest.prototype.open;
    // XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
    //     //console.log("generic request: " + url);
    //     if (url.indexOf("main") > -1) { // main: a json file of comments
    //         console.log("comment found!");
    //         this.addEventListener("readystatechange", function() {
    //             if (this.readyState === 4 && this.status == 200) {
    //                 playerElement.style.cssText = "position: relative; borderRadius: 0; left: 0; top: 0; width: 100%; height: 100%";
    //                 playerWrapElement.style.display = 'none';
    //                 appElement.insertBefore(playerElement, headerElement);
    //                 headerElement.firstChild.firstChild.style.position = "relative";
    //                 playerElement.style.height = window.innerHeight.toString() + 'px';
    //             };
    //         }, false);
    //     }
    //     open.call(this, method, url, async, user, pass);
    // };

    var userSelection = document.getElementsByClassName('bpx-player-sending-area');
    console.log(userSelection);

    for(let i = 0; i < userSelection.length; i++) {
        userSelection[i].addEventListener("unload", function() {
            console.log("Clicked index: " + i);
        })
    }

    //header still on top, failed
    document.addEventListener("load", event => {
        if (event.target.nodeName === "SCRIPT") {
            if (event.target.getAttribute("src").includes("comment")) { // comment-pc-vue.next.js
                playerElement.style.cssText = "position: relative; borderRadius: 0; left: 0; top: 0; width: 100%; height: 100%";
                playerWrapElement.style.display = 'none';
                appElement.insertBefore(playerElement, headerElement);
                // failed
                headerElement.firstChild.firstChild.style.position = "relative";
                // failed to set as relative, so set to invisible
                headerElement.style.display = "none";
                //document.getElementsByClassName('bpx-player-sending-area')[0].style.display = 'none';
                playerElement.style.height = window.innerHeight.toString() + 'px';
                let checkTotalLags = 0;
                let checkSingleLags = 500;
                let redundentTimes = 1;
                console.log("before fire!");
                function moveDanmuElement() {
                    // copied from https://greasyfork.org/en/scripts/445241-mr哔哩哔哩助手-自动宽屏模式-智能连播-宽屏模式体验优化-全新布局/code
                    try {
                        // recover the hided bar
                        document.getElementsByClassName('bpx-player-sending-area')[0].style.cssText = "opacity: 1";
                        // had to go for dinner
                        document.getElementsByClassName('bpx-player-dm-input')[0].placeholder = "";
                        document.getElementsByClassName('bpx-player-control-bottom-center')[0].append(document.getElementsByClassName('bpx-player-sending-area')[0]);
                        // 调整播放器工具栏中间布局宽度为100%，并调整左右空隙
                        document.getElementsByClassName('bpx-player-control-bottom-center')[0].style.cssText = 'width: 100% !important; padding: 0 !important;';
                        // 播放器工具栏中间加背景
                        document.getElementsByClassName('bpx-player-dm-root')[0].style.cssText = 'background: rgba(0, 0, 0, 0.2) !important; border-radius: 10px !important; padding: 1px 2px 1px 6px !important;';
                        // 调整播放器工具栏高度
                        GM_addStyle('.bpx-player-sending-bar {height: 22px !important;}');
                        // 调整播放器工具栏左侧工具空隙
                        document.getElementsByClassName('bpx-player-control-bottom-left')[0].style.cssText = 'min-width: auto !important;';
                        // 显示在看人数
                        document.getElementsByClassName('bpx-player-video-info')[0].style.cssText = 'fill: #fff !important; color: hsla(0,0%,100%,.8) !important; display: flex !important;';
                        // 弹幕发送栏背景改为透明，修改左右空隙，高度
                        document.getElementsByClassName('bpx-player-sending-bar')[0].style.cssText = 'background: transparent !important; padding: 0px 20px 0px 0px !important; max-width: none !important;';
                        // 删掉横线
                        GM_addStyle('.bpx-player-sending-area:before {display: none !important;}');
                        // 弹幕开关样式
                        document.getElementsByClassName('bpx-player-dm-switch bui bui-danmaku-switch')[0].style.cssText = 'fill: #fff !important; color: hsla(0,0%,100%,.8) !important;';
                        // 弹幕设置样式
                        document.getElementsByClassName('bpx-player-dm-setting')[0].style.cssText = 'fill: #fff !important; color: hsla(0,0%,100%,.8) !important;';
                        // 弹幕设置菜单修正
                        document.getElementsByClassName('bpx-player-dm-setting-box bui bui-panel bui-dark')[0].style.cssText = 'overflow: unset !important;';
                        // 调整发送弹幕背景色，大小
                        if (document.getElementsByClassName('bpx-player-video-inputbar focus bpx-player-checkBox-hide')[0]) {
                            document.getElementsByClassName('bpx-player-video-inputbar focus bpx-player-checkBox-hide')[0].style.cssText = 'width: 100% !important; 100% !important; background: hsla(0,0%,100%,.6) !important;';
                        }
                        // 调整字体设置按钮颜色
                        document.getElementsByClassName('bpx-player-video-btn-dm')[0].style.cssText = 'fill: #fff !important;';
                        // 调整发送弹幕提示文本颜色
                        document.getElementsByClassName('bpx-player-dm-wrap')[0].style.cssText = 'color: hsla(0,0%,100%,.6) !important; display: none !important;';
                        // 改掉输入框内文本
                        document.getElementsByClassName('bpx-player-dm-input')[0].style.cssText = 'color: rgba(255, 255, 255, 0.2) !important;';
                        // GM_addStyle('::-webkit-input-placeholder {color: hsla(0,0%,100%,.6) !important;}');
                        // 调整弹幕礼仪按钮样式
                        document.getElementsByClassName('bpx-player-dm-hint')[0].children[0].style.cssText = 'color: hsla(0,0%,100%,.6) !important; fill: hsla(0,0%,100%,.6) !important;';
                    } catch (e) {console.log(e)};
                    if (checkTotalLags < 5000) {
                        console.log("fired");
                        // found that the danmu bar not inserted to the player yet
                        // With boolean operator ||, if first term is true second term won't be evaluated. There utilize this trick to do a robust check
                        if (!document.getElementsByClassName("bpx-player-control-bottom-center")[0].firstChild || redundentTimes-- > 0) {
                            setTimeout(moveDanmuElement, checkSingleLags);
                            checkTotalLags += checkSingleLags;
                        }
                    }
                }
                moveDanmuElement();

            }
        }else {
        };
    }, true);

})();
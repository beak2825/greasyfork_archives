// ==UserScript==
// @name         IYF vedio web full screen
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Make IYF vedio web full screen
// @author       Tim Ren
// @match        https://www.iyf.tv/play/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iyf.tv
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468242/IYF%20vedio%20web%20full%20screen.user.js
// @updateURL https://update.greasyfork.org/scripts/468242/IYF%20vedio%20web%20full%20screen.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...

    let isWebFullScreen = false;

    function webFullScreen() {
        if(!isWebFullScreen) {
            const style = document.createElement('style');
            style.id = "webfullscreen";
            style.innerHTML = `
                #video_player {
                    width: 100vw;
                    height: 100vh;
                    z-index: 9999;
                    position: fixed;
                    left: 0;
                    top: 0;
                    background-color: #090b20;
                }
                vg-overlay-danmu {
                    position: fixed !important;
                    left: 0 !important;
                    top: 0 !important;
                    width: 100vw !important;
                    height: 100vh !important;
                }
                vg-controls.bg-overlayer {
                    position: fixed !important;
                    width: 100vw !important;
                    bottom: 0 !important;
                    left:0 !important;
                    z-index: 9999999 !important;
                }
                body {
                    overflow: hidden;
                }
            `;
            document.getElementsByTagName('head')[0].appendChild(style);
            isWebFullScreen = true;
        } else {
            const styleDom = document.getElementById("webfullscreen");
            if(styleDom) {
                styleDom.remove();
                isWebFullScreen = false;
            }
        }

    }

    function main() {
        const faws = document.createElement('link');
        faws.rel="stylesheet";
        faws.href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        const style = document.createElement('style');
        style.innerHTML = `
        .custom-control-item .iconfont {
            width: 45px;
            height: 57px;
            font-size: 26px;
            padding: 10px 10px 11px;
        }
        `;
        document.getElementsByTagName('head')[0].appendChild(faws);
        document.getElementsByTagName('head')[0].appendChild(style);
        const settingDOM = document.querySelector('.control-item.config');
        if(settingDOM) {
            const webFullScreenDom = document.createElement('div');
            webFullScreenDom.classList.add('custom-control-item');
            webFullScreenDom.innerHTML = `
            <div class="iconfont webfullscreen"><i class="fa fa-expand"></i></div>
            `
            webFullScreenDom.onclick = () => {
                webFullScreen();
            }
            settingDOM.parentNode.insertBefore(webFullScreenDom, settingDOM.nextSibling);
        }
    }

    setTimeout(()=>main(),1000);
})();
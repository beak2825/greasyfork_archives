// ==UserScript==
// @name         URL.canParse dummy
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  URL.canParseがnullになってurlクリックできなくなるので
// @author       You
// @match        https://www.nicovideo.jp/watch/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nicovideo.jp
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513130/URLcanParse%20dummy.user.js
// @updateURL https://update.greasyfork.org/scripts/513130/URLcanParse%20dummy.meta.js
// ==/UserScript==


window.autoHideControllerRetryCount = 0;

function AutoHideController()
{
    // 全画面表示してもコントローラーが消えないのを修正
    let fullScreenButton = document.querySelector('button[aria-label="全画面表示する"]');
    if (fullScreenButton) {
        fullScreenButton.addEventListener("click", ()=> {
            console.log("fullscreen clicked!");

            setTimeout(()=> {
                // 非表示になっていないコントローラー
                let controllerBar = document.querySelector('div[class*="op_100"]');
                if (controllerBar) {
                    console.log("コントローラーを非表示にします");

                    controllerBar.classList.remove("op_100");
                    controllerBar.classList.add("op_0");

                    let videoClickWindow = document.getElementById("nv_watch_VideoAdContainer");
                    videoClickWindow.parentElement.parentElement.addEventListener("click", ()=> {
                        console.log("コントローラーを表示する");
                        controllerBar.classList.remove("op_0");
                        controllerBar.classList.add("op_100");
                    }, { 'once': true });
                } else {
                    console.log("コントローラーは非表示済み");
                }
            }, 1000);

        });
    } else {
        console.log("fullScreenButton not found...");

        if (window.autoHideControllerRetryCount < 10) {
            window.autoHideControllerRetryCount++;
            setTimeout(AutoHideController, 1000);
        }
    }
}

(function() {
    'use strict';

    //alert("test!");

    if (!URL.canParse) {
        console.log("URL.canParse is null");

        URL.canParse = (url) => {
            console.log("URL.canParse : $(url)");
        }
    }
    AutoHideController();

    // Your code here...
})();






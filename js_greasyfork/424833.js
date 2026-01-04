// ==UserScript==
// @name         达达兔自动下一集
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  https://www.dadatuw.com/dm/labixiaoxin/play-0-455.html 自动播放下一集
// @author       ilanyu
// @match        https://www.dadatuw.com/*
// @match        https://img.mljznj.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424833/%E8%BE%BE%E8%BE%BE%E5%85%94%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/424833/%E8%BE%BE%E8%BE%BE%E5%85%94%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E9%9B%86.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const MESSAGE_KEY = 'ended2';
    if (window.top === window.self) {
        window.onload = function () {
            window.addEventListener("message", function (event) {
                if (event.data === MESSAGE_KEY) {
                    let querySelector = document.querySelector("body > div:nth-child(4) > div > div.col-lg-wide-75.col-xs-1.padding-0 > div:nth-child(1) > div > div > div > div.stui-player__detail.detail > ul > li:nth-child(5) > a");
                    querySelector.click()
                }
            })
        }
    } else {
        window.onload = function () {
            let querySelector = document.querySelector("#play-area > div.dplayer-video-wrap > video");
            if (querySelector == null) {
                return
            }
            querySelector.addEventListener("ended", function () {
                sendMessageFromAnIframe(MESSAGE_KEY, "https://www.dadatuw.com");
            })
        }
    }

    function sendMessageFromAnIframe(message, targetDomain) {
        let scriptNode = document.createElement('script');
        scriptNode.textContent = 'parent.postMessage ("' + message + '", "' + targetDomain + '");';
        document.body.appendChild(scriptNode);
    }
})();

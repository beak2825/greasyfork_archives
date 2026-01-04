// ==UserScript==
// @name               shumin-youtube
// @namespace          http://tampermonkey.net/
// @version            3.1
// @description        按Q点赞，视频结束自动关全屏，彩虹进度条。Press Q to like the video, automatically exit fullscreen when the video ends, and enjoy a rainbow progress bar.
// @author             qianjunlang
// @match              *://*.youtube.com/*
// @icon               https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant              GM_setValue
// @grant              GM_getValue
// @run-at             document-idle
// @noframes
// @license            MIT License
// @downloadURL https://update.greasyfork.org/scripts/488207/shumin-youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/488207/shumin-youtube.meta.js
// ==/UserScript==
'use strict';

    var css = `
        .ytp-play-progress {
            background-image: linear-gradient(to left, #FF0000, #FF9900, #FFFF00, #33CC33, #00CCFF, #6633FF, #CC00FF )!important;
        }
        #ytCover {
          font-size: 1em !important;
          color: var(--ytd-searchbox-legacy-button-icon-color)!important;
          /*animation: appear 0.01s;
          animation-iteration-count: 1;*/
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
            // no head yet, stick it whereever
            document.documentElement.appendChild(node);
        }
    }

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

    function isVisible(selector) {
        const element = document.querySelector(selector);
        return element && element.offsetParent !== null;
    }

    let cycle_id = setInterval(() => {

        if(
            isVisible('.ytp-endscreen-previous') ||
            isVisible('.ytp-endscreen-next') ||
            isVisible('.ytp-endscreen-content') ||
            isVisible('.html5-endscreen') ||
            false
        ) {
            document.exitFullscreen();
            document.cancelFullScreen();
            document.webkitCancelFullScreen();
        }

    }, 1000);

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Q' || e.key === 'q') {
            const likeButton = document.querySelector('like-button-view-model button');
            if (likeButton) {
                likeButton.click();
                console.log('Q 键被按下，已点赞！');
            } else {
                console.log('未找到点赞按钮！');
            }
        }
    });
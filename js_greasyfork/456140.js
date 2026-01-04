// ==UserScript==
// @name         Youtube caption selector
// @name:en      Youtube caption selector
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  make youtube caption can be selected
// @author       Kirie
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @require      https://cdn.staticfile.org/jquery/3.5.0/jquery.min.js
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456140/Youtube%20caption%20selector.user.js
// @updateURL https://update.greasyfork.org/scripts/456140/Youtube%20caption%20selector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $(document).ready(function() {
        var timer = setInterval(function() {
            if(document.querySelector('.ytp-caption-window-container') == null) {
                console.log('null');
            }
            else {
                // console.log(document.querySelector('.ytp-caption-window-container'));
                GM_addStyle(`
                    .caption-window {
                        position: absolute;
                        line-height: normal;
                        z-index: 40;
                        pointer-events: auto;
                        cursor: move;
                        cursor: -webkit-grab;
                        cursor: -moz-grab;
                        cursor: text;
                        -moz-user-select: none;
                        -ms-user-select: none;
                        -webkit-user-select: text;
                    }
                `);
                clearInterval(timer);
            }
        },1000);


    });
})();
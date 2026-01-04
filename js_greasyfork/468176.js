// ==UserScript==
// @name         Keep TickTock live room clean
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Remove Douyin/Ticktock live room useless parts.
// @author       You
// @match        https://live.douyin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @grant        GM.addStyle
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468176/Keep%20TickTock%20live%20room%20clean.user.js
// @updateURL https://update.greasyfork.org/scripts/468176/Keep%20TickTock%20live%20room%20clean.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const CSS_HIDE = '{ display: none !important;}'
    const CSS_OPACITY_0 = '{ opacity: 0 !important; height: 0 !important;}'

    let selectorsToHide = [
        // top row
        "main > div:nth-of-type(1)",
        // top second row
        "main >  pace-island",
        // top avatar row
        //"div[data-e2e=living-container] > div:nth-of-type(1) > div:nth-of-type(1)",
        // left first column
        "#root .app-container >  pace-island > div:nth-of-type(1)",

        ".__playerIsFullChatroom",

        ".__isFullPlayer",
        ".__playerIsFull.__roomInfoBarOuter > div:nth-of-type(4)",

        ".metro",
        // right chat column
        // "div[data-e2e=living-container] > div:nth-of-type(2)",
        // bottom gift row
        "div[data-e2e=living-container] > div:nth-of-type(1) > div:nth-of-type(3)",
        // person list in chat column
        "div[data-e2e=living-container] > div:nth-of-type(2) > div:nth-of-type(1)",
        // bottom suggest div
        "div[data-e2e=living-container] + div",
        // msg in chat column
        ".webcast-chatroom__room-message",
        // bottom right feedback btn
        "#douyin-sidebar",
        // danmu
        "xg-danmu"
    ];

    // use opacity 0 instead of display none since some websites may check the ads divs later
    let selectorsToOpacity = [''];

    addStyle(selectorsToHide, CSS_HIDE);

    addStyle(selectorsToOpacity, CSS_OPACITY_0);

    function addStyle(selectors, style = CSS_HIDE) {
        let str = ``
        if(selectors){
            for (let selector of selectors) {
                str += `${selector} ${style} `;
            }
        }

        console.log(`=======================${str}`)
        GM.addStyle(str);
    }

})();
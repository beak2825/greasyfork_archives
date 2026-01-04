// ==UserScript==
// @name         B站捷键+倍速（AUTO）
// @version      1.3
// @author       sign_up
// @description  B站快捷键+倍速
// @icon         https://www.bilibili.com/favicon.ico
// @match        *://*.bilibili.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @namespace
// @license      MIT
// @namespace https://greasyfork.org/users/662341
// @downloadURL https://update.greasyfork.org/scripts/473788/B%E7%AB%99%E6%8D%B7%E9%94%AE%2B%E5%80%8D%E9%80%9F%EF%BC%88AUTO%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/473788/B%E7%AB%99%E6%8D%B7%E9%94%AE%2B%E5%80%8D%E9%80%9F%EF%BC%88AUTO%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    let SpeedIndex = 3;
    let Speed2x = GM_getValue("Speed2x");
    GM_registerMenuCommand("自动2倍速:" + Speed2x, () => {
        GM_setValue("Speed2x", !Speed2x);
        window.location.reload();
    });
    let WidescreenOn = GM_getValue("WidescreenOn");
    GM_registerMenuCommand("自动宽屏:" + WidescreenOn, () => {
        GM_setValue("WidescreenOn", !WidescreenOn);
        window.location.reload();
    });

    document.body.addEventListener("keydown", (e) => {
        if (e.target.nodeName !== "BODY")
            return;
        var SpeedList = document.getElementsByClassName("bpx-player-ctrl-playbackrate-menu-item");
        if (SpeedList.length == 0) {SpeedList = document.querySelectorAll(".squirtle-speed-select-list>.squirtle-select-item ");}
        var WideScreen = document.getElementsByClassName("bpx-player-ctrl-wide-enter")[0];
        if (!WideScreen) { WideScreen = document.getElementsByClassName("squirtle-video-widescreen")[0]; }
        if (e.ctrlKey === false) {
            switch (e.key) {
            case ">":
                if (SpeedIndex > 0) {SpeedIndex--;}
                else { SpeedIndex = 5; }
                SpeedList[SpeedIndex].click();
                break;
            case "<":
                if (SpeedIndex < 6) {
                    SpeedIndex++;
                } else {
                    SpeedIndex = 0;
                }
                SpeedList[SpeedIndex].click();
                break;
            case "?":
                SpeedList[3].click();
                break;
            case "t":
                WideScreen.click();
                SpeedList[0].click();
                break;
            default:
                break;
            }
        }
    });

    let video = document.getElementsByTagName("video")[0];
    if (!video) { video = document.getElementsByTagName("bwp-video")[0]; }
    Speed2x && video.addEventListener( "playing",() => {
        setTimeout(
            () => (document.getElementsByClassName("bpx-player-ctrl-playbackrate-menu-item")[0] || document.querySelectorAll(".squirtle-speed-select-list>.squirtle-select-item")[0]).click(), 500
        );
    }, { once: true } );

    WidescreenOn && video.addEventListener( "playing", () => {
        setTimeout(
            () => (document.getElementsByClassName( "bpx-player-ctrl-wide-enter")[0] || document.getElementsByClassName("squirtle-video-widescreen")[0]).click(), 500
        );
        window.scrollBy(0, 200);
    }, { once: true } );

})();
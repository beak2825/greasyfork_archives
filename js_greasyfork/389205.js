// ==UserScript==
// @name         TI9 DC老师直播间查看实时数据
// @description  TI9 DC老师直播间查看实时数据~
// @namespace    https://greasyfork.org/users/129402
// @match        https://live.bilibili.com/blanc/888?*
// @match        https://live.bilibili.com/blanc/13?*
// @match        https://live.bilibili.com/888*
// @match        https://live.bilibili.com/104*
// @match        https://resource-sec.vpgame.com/project/live/live_v2.html?room_id=13&_liveData
// @grant        unsafeWindow
// @grant        GM_addStyle
// @version      1.0.15
// @license      GNU General Public License v3.0 or later
// @compatible   chrome
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/389205/TI9%20DC%E8%80%81%E5%B8%88%E7%9B%B4%E6%92%AD%E9%97%B4%E6%9F%A5%E7%9C%8B%E5%AE%9E%E6%97%B6%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/389205/TI9%20DC%E8%80%81%E5%B8%88%E7%9B%B4%E6%92%AD%E9%97%B4%E6%9F%A5%E7%9C%8B%E5%AE%9E%E6%97%B6%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==
if (location.hostname === "live.bilibili.com")(function loop(unsafeWindow) {
    if (!unsafeWindow.document.querySelector(".bilibili-live-player")) return setTimeout(loop, 100, unsafeWindow);
    unsafeWindow.$(".bilibili-live-player").append(`<div id="liveDataInPlayer" class="liveData"><iframe src="https://resource-sec.vpgame.com/project/live/live_v2.html?room_id=13&_liveData" scrolling="no"></iframe></div>`);
    unsafeWindow.$("body").append(`<div id="liveDataOutSide" class="liveData"><iframe src="https://resource-sec.vpgame.com/project/live/live_v2.html?room_id=13&_liveData" scrolling="no"></iframe></div>`);
    GM_addStyle(`
        .liveData {
            transition: all .35s;
            overflow: hidden;
            position: fixed;
            top: 0;
            z-index: 10000000;
            width: 150px;
            height: 40px;
            left: unset;
            right: 0px;
        }

        .liveData iframe {
            width: 100%;
            height: 100%;
            border: none;
            overflow: hidden;
        }

        #liveDataInPlayer {
            top: 26px;
        }

        .bilibili-live-player:not([data-player-state="fullscreen"]) #liveDataInPlayer {
            display: none;
        }
    `);
    unsafeWindow.addEventListener("message", ({
        data,
        origin
    }) => {
        if (origin === "https://resource-sec.vpgame.com") {
            $(".liveData").height(data.height).width(data.width);
        }
    }, {
        passive: false,
        capture: true,
    });
})(unsafeWindow);
else(() => {
    GM_addStyle(`
        #live-tabs {
            margin-left: auto;
        }
    `);
})();
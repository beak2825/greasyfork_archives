// ==UserScript==
// @name         Twitch不在直播就自动刷新
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  每3分钟检测是否在直播，没在直播就刷新页面
// @author       冰封
// @match        https://www.twitch.tv/playapex
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/447665/Twitch%E4%B8%8D%E5%9C%A8%E7%9B%B4%E6%92%AD%E5%B0%B1%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/447665/Twitch%E4%B8%8D%E5%9C%A8%E7%9B%B4%E6%92%AD%E5%B0%B1%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function reload(){
        //window.location.reload(true);
        location.replace(location.href);
    }
    setInterval(function () {
        if (document.getElementsByClassName("live-indicator-container").length == 0){
            reload();
        }
    }, 3*60*1000);
})();
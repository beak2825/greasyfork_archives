// ==UserScript==
// @name         个人脚本
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  个人脚本：屏蔽广告
// @author       mrlinhl
// @match        https://pc.xuexi.cn/points/login.html*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/438651/%E4%B8%AA%E4%BA%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/438651/%E4%B8%AA%E4%BA%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
(function() {
    let theInternationale = document.getElementsByTagName('audio')[0];
    if ( theInternationale.src == 'https://pc.xuexi.cn/points/study-login/asset/35131a17802d051385ff98c46ab34d3b.mp3'){
        theInternationale.autoplay = false;
        document.getElementsByClassName('oath')[0].hidden = true;
        document.getElementsByClassName('redflagbox')[0].hidden = true;
    }
})();
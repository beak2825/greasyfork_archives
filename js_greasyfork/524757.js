// ==UserScript==
// @name         修改全坛显示时间
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将全坛的人类友好时间变更为时间日期显示时间
// @author       望月由爱
// @license MIT
// @match        https://sstm.moe/*
// @icon         https://s.sstmlt.com/board/monthly_2017_06/logo_1479532980294_5d1829.png.7c198e484115f85daaf0f04963f81954.png.418af10c64761f5ef969fe30c7992a40.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524757/%E4%BF%AE%E6%94%B9%E5%85%A8%E5%9D%9B%E6%98%BE%E7%A4%BA%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/524757/%E4%BF%AE%E6%94%B9%E5%85%A8%E5%9D%9B%E6%98%BE%E7%A4%BA%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let times=document.querySelectorAll("time");
    times.forEach(c=>{
        c.textContent = c.title;
    })
})();
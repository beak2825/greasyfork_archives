// ==UserScript==
// @name         ImoocAutoNextMedia - 慕课网自动播放下一节视频
// @namespace    https://greasyfork.org/
// @version      0.1.1
// @date         2018-07-29
// @author       romebake
// @blog         https://www.romebake.com
// @code         https://github.com/romebake/ImoocAutoNextMedia
// @description  慕课网自动播放下一节视频
// @license      MIT; https://opensource.org/licenses/MIT
// @match        *://*.imooc.com/*
// @icon         https://www.imooc.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370710/ImoocAutoNextMedia%20-%20%E6%85%95%E8%AF%BE%E7%BD%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E8%8A%82%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/370710/ImoocAutoNextMedia%20-%20%E6%85%95%E8%AF%BE%E7%BD%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E8%8A%82%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

var nextMask = document.querySelector('div#next-mask');

var loop = setInterval(function () {
    if (nextMask.classList.contains('in')) {
        //console.log("Click imooc next media");
        document.querySelector('a.js-next-media').dispatchEvent(new MouseEvent('click'));
    }
}, 1000);
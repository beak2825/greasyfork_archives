// ==UserScript==
// @name         2023广东省继续教育华医网公需课 视频自动学习过题
// @namespace    www.31ho.com
// @version      1.3
// @description  解决播放时弹窗问题！
// @author       1990
// @match        http://*.91huayi.com/course_ware/course_ware_polyv.aspx*
// @run-at      document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427662/2023%E5%B9%BF%E4%B8%9C%E7%9C%81%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%8D%8E%E5%8C%BB%E7%BD%91%E5%85%AC%E9%9C%80%E8%AF%BE%20%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E8%BF%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/427662/2023%E5%B9%BF%E4%B8%9C%E7%9C%81%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%8D%8E%E5%8C%BB%E7%BD%91%E5%85%AC%E9%9C%80%E8%AF%BE%20%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E8%BF%87%E9%A2%98.meta.js
// ==/UserScript==


function sleep(timeout) {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
}
(async function () {
    'use strict';

    while(!window.player  || !window.player.sendQuestion)
    {   
         await sleep(20);
         
     }
     
     player.sendQuestion = function (){}
})();
// ==UserScript==
// @name          自动过题
// @namespace    浩浩
// @version      1.2
// @description  解决播放时弹窗问题！
// @author       1990
// @match        http://*.91huayi.com/course_ware/course_ware_polyv.aspx*
// @run-at      document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431709/%E8%87%AA%E5%8A%A8%E8%BF%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/431709/%E8%87%AA%E5%8A%A8%E8%BF%87%E9%A2%98.meta.js
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
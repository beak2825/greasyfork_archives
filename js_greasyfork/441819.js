// ==UserScript==
// @name         自动复制RAID第一行
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.0
// @description  自动复制raid码
// @author       路过的码农罢了
// @match        https://gbf-raidfinder.la-foret.me/
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/clipboard.js/2.0.10/clipboard.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/441819/%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6RAID%E7%AC%AC%E4%B8%80%E8%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/441819/%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6RAID%E7%AC%AC%E4%B8%80%E8%A1%8C.meta.js
// ==/UserScript==


   // var RaidCode = "";
  //  RaidCode = document.getElementsByClassName('mdl-list gbfrf-tweets')[0].firstElementChild.dataset.raidid;
  //  console.log('done');

(function() {
    'use strict';
    var RaidCode_1 = "";
    var RaidCode_2 = "123123123";

    setInterval(
        function(){
            RaidCode_2 = document.getElementsByClassName('mdl-list gbfrf-tweets')[0].firstElementChild.dataset.raidid;
            if(RaidCode_2 != RaidCode_1)RaidCode_1 = RaidCode_2;
            GM_setClipboard(RaidCode_1,'text');
        },500);


    // Your code here...
})();
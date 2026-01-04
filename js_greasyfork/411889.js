// ==UserScript==
// @name         HostLoc-zsbd+替换敏感字符
// @namespace    https://haoduck.com/
// @version      0.0.1
// @description  HostLoc使用的zsbd+替换敏感字符
// @author       hostloc-嗷嗷
// @match        https://www.hostloc.com/thread-*
// @match        https://www.hostloc.com/forum.php?mod=viewthread*
// @match        https://hostloc.com/thread-*
// @match        https://hostloc.com/forum.php?mod=viewthread*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411889/HostLoc-zsbd%2B%E6%9B%BF%E6%8D%A2%E6%95%8F%E6%84%9F%E5%AD%97%E7%AC%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/411889/HostLoc-zsbd%2B%E6%9B%BF%E6%8D%A2%E6%95%8F%E6%84%9F%E5%AD%97%E7%AC%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var l = 20;
    var idioms = ["\n\n\n\u200b\u200b\u200b\u200b\u200b\u200b\u200b"];

    //text1和text2一一对应
    var text1 = ["嫖","屁股","躲猫猫","和谐","小姐姐"];
    var text2 = ["女票","辟谷","duo猫猫","河蟹","小jiejie"];

    function addIdioms() {
        var text=document.getElementById("fastpostmessage");
        for(var j = 0,len=text1.length; j < len; j++) {
            text.value = text.value.replace(new RegExp(text1[j],'g'),text2[j]);
        };
        if (text.value.length<l) {
            text.value += idioms[Math.floor(Math.random()*idioms.length)];
        }
    }
    document.getElementById("fastpostmessage").onkeydown=function(event) {
        if (event.ctrlKey && event.keyCode == 13 || event.altKey && event.keyCode == 83) {
            addIdioms();
            seditor_ctlent(event, 'fastpostvalidate($(\'fastpostform\'))');
        }
    };
    document.getElementById("fastpostsubmit").addEventListener("click", addIdioms);
})();
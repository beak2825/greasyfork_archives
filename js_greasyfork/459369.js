// ==UserScript==
// @name         Fuck Bilibili's topic
// @version      9.99
// @license      MIT
// @namespace    https://www.cnblogs.com/appletree24/
// @description  Just fuck Bilibili's idiot topic
// @author       Appletree24
// @match        https://t.bilibili.com/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/459369/Fuck%20Bilibili%27s%20topic.user.js
// @updateURL https://update.greasyfork.org/scripts/459369/Fuck%20Bilibili%27s%20topic.meta.js
// ==/UserScript==
(function() {
    function timeOutExec(){
    var box = document.getElementsByClassName("topic-panel")[0];
    box.hidden=true;
    }
    setTimeout(timeOutExec,450);
})();
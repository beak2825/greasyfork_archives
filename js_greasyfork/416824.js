// ==UserScript==
// @name         Bilibili tools
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  try to take over the world!
// @author       You
// @match        https://www.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416824/Bilibili%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/416824/Bilibili%20tools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...


    function task(){
        var search_form = document.getElementById("nav_searchform");
        var input = search_form.firstChild
        input.setAttribute("placeholder","");
    }

    //var timer=setInterval(task,1000) //每过一秒执行一次，并且用timer接收

    setTimeout(task, 1000);


})();
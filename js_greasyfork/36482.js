// ==UserScript==
// @name         GAB Notification Count in Title
// @namespace    http://gab.ai/Jeremy20_9
// @version      0.1
// @description  Show a notification count in the title of the page for tab browsing convenience.
// @author       Jeremiah 20:9
// @match        https://gab.ai/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36482/GAB%20Notification%20Count%20in%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/36482/GAB%20Notification%20Count%20in%20Title.meta.js
// ==/UserScript==

var pagetitle = document.title;
var itvcheck = -1;
$(document).ready(function(){
    itvcheck = setInterval(function(){
        var indicator = $(".header__link--notifications");
        if(indicator.length > 0)
        {
            indicator = $(indicator).find("span");
            var count = parseInt($(indicator).text());
            if(count > 0)
                document.title = pagetitle + "(" + count + ")";
            else
                document.title = pagetitle;
        }
    }, 1000);
});


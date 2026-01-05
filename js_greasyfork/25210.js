// ==UserScript==
// @name         Shodan, Links Only
// @namespace    http://9gag.com/
// @version      0.1
// @description  Strip everything out to make copying links quicker
// @author       evil - http://www.8ch.net/ipcam/
// @match        https://www.shodan.io/search?query=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25210/Shodan%2C%20Links%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/25210/Shodan%2C%20Links%20Only.meta.js
// ==/UserScript==

var ipLinks = [];

$(document).ready(function() {
    //hide most of the page body, leave pagination and results count
    $(".search-result").hide();
    //create a textarea for displaying the links
    var $div = $("<br /><textarea id='ipList' style='width:400px;height:200px;border:0px;font-size:12px;color:#000;margin-top:16px;'></textarea>").appendTo(".results-count"), thisIP;
    //create an array of just the links and add them to the textarea
    $(".ip").each(function() {
        thisIP = $(this).find('a').attr('href');
        ipLinks.push(thisIP);
        $div.append(thisIP + "\r\n");
    });
    //set focus and auto-select contents of textarea
    $("#ipList").focus();
    $("#ipList").select();
});
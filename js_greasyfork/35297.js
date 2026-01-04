// ==UserScript==
// @name         Shodan, Links Only
// @namespace    http://9gag.com/
// @version      0.2
// @description  Strip everything out to make copying links quicker
// @author       evil - http://www.8ch.net/ipcam/
// @match        https://www.shodan.io/search?query=*
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @downloadURL https://update.greasyfork.org/scripts/35297/Shodan%2C%20Links%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/35297/Shodan%2C%20Links%20Only.meta.js
// ==/UserScript==
 
var ipLinks = [];
 
$(document).ready(function() {
    //hide most of the page body, leave pagination and results count
    $(".search-result").hide();
    //create a textarea for displaying the links
    var $div = $("<br /><textarea id='ipList' style='width:400px;height:200px;border:0px;font-size:12px;color:#000;margin-top:16px;'></textarea>").appendTo(".span9"), thisIP;
    //create an array of just the links and add them to the textarea
    $(".ip").each(function() {
        var links = $(this).find('a');
        if(links.length > 1){
          thisIP =  $(this).find('a').eq(1).attr('href');
        } else {
          thisIP =  $(this).find('a').eq(0).attr('href');
        }
        ipLinks.push(thisIP);
        var ipsplit = thisIP.split("//")[1].split(':');
        $div.append(thisIP + "\r\n");
    });
 
    //set focus and auto-select contents of textarea
    $("#ipList").focus();
    $("#ipList").select();
});
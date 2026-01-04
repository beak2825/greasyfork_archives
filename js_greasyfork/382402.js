// ==UserScript==
// @name        直接提取链接
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       jvbac
// @match       free-ss.site
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382402/%E7%9B%B4%E6%8E%A5%E6%8F%90%E5%8F%96%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/382402/%E7%9B%B4%E6%8E%A5%E6%8F%90%E5%8F%96%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==



(function() {
    'use strict';

    $("h3:eq(1)").append("<div id='pan'></div>");
    $("#pan").append("<button id='abtn1'>获取所有</button>").append("<br/><textarea id='cp' rows='10' cols='120'>");

    console.log($("h3:eq(1)").next().children());
    $("#abtn1").click(function(){
         var as=$("h3:eq(1)").next().children().children().get(1);
        var gh= $(as).children("tr");
        console.log(as);
        var cptext=""
        for(var si=0;si<gh.length;si++){
            var ip=$(gh.get(si)).children("td:eq(1)").text();
            var port=$(gh.get(si)).children("td:eq(2)").text();
            var pwd=$(gh.get(si)).children("td:eq(3)").text();
            var men=$(gh.get(si)).children("td:eq(4)").text();
            var ss=men+":"+pwd+"@"+ip+":"+port
            var ssurl= 'ss://'+CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(ss));
            cptext+=ssurl+"\n";
            $('#cp').text(cptext);
        }


    });

    // Your code here...
})();

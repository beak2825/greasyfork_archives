// ==UserScript==
// @name         Finit Radio
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Radio for Finit
// @author       You
// @match        https://finit.co/chat/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16188/Finit%20Radio.user.js
// @updateURL https://update.greasyfork.org/scripts/16188/Finit%20Radio.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';
 
// Your code here...
$("body").prepend('<div class="oklo"></div>');
window.onWebSocketEvent = function (data) {
    console.log(data);
    if (data.event === 'client-message') {
       
        // someone sent a chat message
        var receivedMessage = data.data;
        console.log(receivedMessage);
        var dootdank = receivedMessage.body;
        console.log(dootdank);
        var d = receivedMessage.sender;
        console.log(d);
        var a = d.username;
        var ocelot = dootdank.split(" ");
        if (ocelot[0] == "--radio") {
            $(".oklo").remove();
            var str = ocelot[1].length;
            console.log(str);
            var st = ocelot[1].charAt(0);
            console.log(st);
            if (str == 11 || st != '"') {              
            $("body").prepend('<iframe class="oklo" width="420" height="315" src="https://www.youtube.com/embed/'+ocelot[1]+'?autoplay=1" frameborder="0" allowfullscreen></iframe>');
            $(".oklo").css("display","none");
               
            } else {
            }
        }
    }
}
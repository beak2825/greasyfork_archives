// ==UserScript==
// @name         Chat Logger for Playrust.io
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  try to take over the world!
// @author       Mastashot
// @match        http://map.playrust.io/*
// @match        http://playrust.io/map/*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @require https://code.jquery.com/ui/1.11.4/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/18624/Chat%20Logger%20for%20Playrustio.user.js
// @updateURL https://update.greasyfork.org/scripts/18624/Chat%20Logger%20for%20Playrustio.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...
var jq = $.noConflict();
jq(document).ready(function(){
    console.log("[    Loading Chat Logger by Mastashot    ]");
    //$("#chatHolder").prepend("<div id=\"scrollStatus\" style=\"color:yellow;float:right;width:120px;\"><strong>[Scroll Pause]</strong></div>");
    jq("#options").prepend("<div id=\"chatHolder\"><strong>Chat Logger by Mastashot</strong><div style=\"float: right\"><div style=\"color:yellow;float:left;\" id=\"scrollStatus\"></div><a id=\"chat-minmax\"><img src=\"img/minmax.png\" height=\"20\" width=\"20\" class=\"icon\"></a></div><div id=\"cLog\"></div></div>");
    jq('#cLog').css("max-height","500px");
    jq('#cLog').css("width","619px");
    jq('#cLog').css("overflow","auto");
    jq('#cLog').css("border", "1px solid #1b4657");
    jq('#cLog').css("padding", "2px");
    jq('#cLog').css("margin", "2px");
    jq('#chatHolder').css("color", "#8d8789");
    jq('#options').css("border", "1px solid #1b4657");
    jq('#cLog').css("color", "#99d0ff");
    setTimeout(function(){
        notifyHandlers();
    }, 2000);
    setTimeout(function(){
        prAdClear();
    }, 5000);
    
});
var chatState = 0;
function pad(n) { return ("0" + n).slice(-2); };
function notifyHandlers() {
    jq('.notifyjs-corner').bind('DOMNodeInserted', function() {
        chatLogAdd(jq('.notifyjs-corner span').html());
    });
    jq('.notifyjs-corner').bind('DOMNodeRemoved', function() {
        //console.log("--222----------chat deleted");
    });
    jq("#cLog").scroll(function() {
        if(jq("#cLog").scrollTop() + jq("#cLog").height() +4 == jq("#cLog")[0].scrollHeight) {
            autoScroll = true;
            jq("#scrollStatus").html("");
        } else {
            autoScroll = false;
            jq("#scrollStatus").html("<strong>[Auto-Scroll Pause]</strong>");
        }
    });
    jq("#chat-minmax").click(function() {
       if (chatState == 0) {
           jq('#cLog').animate({"height":"150px"}, 500);
           chatState = 1;
       } else if (chatState == 1) {
           jq('#cLog').animate({"height":"500px"}, 500);
           chatState = 2;
       } else if (chatState == 2) {
           jq('#cLog').animate({"height":"15px"}, 500);
           chatState = 0;
       };
        autoScroll = true;
        jq("#scrollStatus").html("");
        jq("#cLog").animate({ scrollTop: jq("#cLog")[0].scrollHeight}, 500);
    });
    takeOverConsole();
    console.log("[    Loaded Chat Logger by Mastashot    ]");
}
var autoScroll = true;

function chatLogAdd(newMsg) {
    var dt = new Date();
    var time = pad(dt.getHours()) + ":" + pad(dt.getMinutes()) + ":" + pad(dt.getSeconds());
    if (newMsg.search(" says: ") > -1) {
        jq('#cLog').html(jq('#cLog').html() + "[" + time + "] <span>" + newMsg.replace(" says: ",": ") + "</span><BR>");
    } else if (newMsg.search("airdrop is") > -1) {
        jq('#cLog').html(jq('#cLog').html() + "[" + time + "] <span style=\"color:yellow\">" + newMsg + "</span><BR>");
    } else if (newMsg.search("Chopper") > -1) {
        jq('#cLog').html(jq('#cLog').html() + "[" + time + "] <span style=\"color:green\">" + newMsg + "</span><BR>");
    } else {
        jq('#cLog').html(jq('#cLog').html() + "[" + time + "] <span style=\"color:#99fffb\">" + newMsg + "</span><BR>");
    }
    if (autoScroll) {
        jq("#cLog").animate({ scrollTop: jq("#cLog")[0].scrollHeight}, 0);
    }
}

function filterConsole(rawMsg) {
    if (rawMsg.search("received player connect:") > -1) {
        var playerSteamID = rawMsg.substring(25,42);
        var searchVal = jq("#recentlist").html().search(playerSteamID);
        if (searchVal > -1) {
            var partialStr = jq("#recentlist").html().substring(searchVal);
            var playerS = partialStr.search(">");
            var playerE = partialStr.search("</a>");
            var playerName = partialStr.substring(playerS+1, playerE);
            //chatLogAdd(playerName + " joined.");
            chatLogAdd('<a href="http://steamcommunity.com/profiles/' + playerSteamID + '" target="_blank">' + playerName + ' joined the server.</a>');
        } else {
            chatLogAdd("You have joined the server.");
        }
    } else if (rawMsg.search("Creating plane: ") > -1) {
        chatLogAdd('An airdrop is on its way!');
    } else if (rawMsg.search("Creating helicopter: ") > -1) {
        chatLogAdd('+Chopper!');
    } else if (rawMsg.search("Removing plane: ") > -1) {
        chatLogAdd('-Airdrop!');
    } else if (rawMsg.search("Removing helicopter: ") > -1) {
        chatLogAdd('-Chopper!');
    }
}

function prAdClear() {
    console.log("[       Adblocker request removed.      ]");
    jq("button:contains('that ain')").css( "text-decoration","underline");
    jq("button:contains('that ain')").parent().parent().parent().remove();
}



function takeOverConsole(){
    var console = window.console
    if (!console) return
    function intercept(method){
        var original = console[method]
        console[method] = function(){
            // do sneaky stuff
            var msg = Array.prototype.slice.apply(arguments).join(' ')
            setTimeout(function(){
                filterConsole(msg);
            }, 750);
            if (original.apply){
                // Do this for normal browsers
                original.apply(console, arguments)
            }else{
                // Do this for IE
                var message = Array.prototype.slice.apply(arguments).join(' ')
                original(message)
            }
        }
    }
    var methods = ['log', 'warn', 'error']
    for (var i = 0; i < methods.length; i++)
        intercept(methods[i])
}
// ==UserScript==
// @name			Open Sesame
// @version			1.2
// @description		Puts the open, closed, and in progress buttons on the report page itself
// @match			https://epicmafia.com/report/*
// @namespace		https://greasyfork.org/users/146029/
// @author			Shwartz99
// @homepage		https://epicmafia.com/user/378333
// @icon			https://i.imgur.com/foumzc6.png
// @downloadURL https://update.greasyfork.org/scripts/377403/Open%20Sesame.user.js
// @updateURL https://update.greasyfork.org/scripts/377403/Open%20Sesame.meta.js
// ==/UserScript==

//just a shoutout to those who helped me

(function() {
    'use strict';
    var id = $(".normal").html().split(" ")[1];
    var str = $("#report_controls").html();
    var rebuiltStr = str+"<div class=\"vv\"><a class=\"redbutton smallfont humane-animate\" style=\"background: linear-gradient(to bottom,#36db36,#11bb11)\" value=\"open\">Open</a><a class=\"redbutton smallfont humane-animate\" style=\"background: linear-gradient(to bottom,#dbdb36,#bbbb11)\" value=\"processing\">In Progress</a><a class=\"redbutton smallfont humane-animate\" style=\"background: linear-gradient(to bottom,#db3636,#bb1111)\" value=\"closed\">Closed</a></div>";
    $("#report_controls").html(rebuiltStr);

    $("[value='open']").click( function(){
        $.get("https://epicmafia.com/report/"+id+"/edit/status", {status:"open"});
        location.reload();
    });
    $("[value='processing']").click( function(){
        $.get("https://epicmafia.com/report/"+id+"/edit/status", {status:"processing"});
        location.reload();
    });
    $("[value='closed']").click( function(){
        $.get("https://epicmafia.com/report/"+id+"/edit/status", {status:"closed"});
        location.reload();
    });
      })();
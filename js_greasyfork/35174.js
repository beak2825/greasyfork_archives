// ==UserScript==
// @name         Discord看民視直播外掛
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @match        https://discordapp.com/channels/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35174/Discord%E7%9C%8B%E6%B0%91%E8%A6%96%E7%9B%B4%E6%92%AD%E5%A4%96%E6%8E%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/35174/Discord%E7%9C%8B%E6%B0%91%E8%A6%96%E7%9B%B4%E6%92%AD%E5%A4%96%E6%8E%9B.meta.js
// ==/UserScript==
$(document).ready(function(){
$("#app-mount").css("width","65%");
$("body").append("<div style='float:right';><iframe style='width:640px;height:480px;' src='https://www.youtube.com/embed/XxJKnDLYZz4' frameborder='0' gesture='media' allowfullscreen><div style='clear:both;'></iframe><br><iframe style='width:640px;height:480px;' src='https://www.youtube.com/live_chat?v=XxJKnDLYZz4'>123</iframe></div>");
});
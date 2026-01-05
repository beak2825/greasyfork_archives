// ==UserScript==
// @name        Adguard-Chat
// @namespace   vvg
// @include     http://forum.adguard.com/*
// @version     1.01
// @grant       none
// @description adguard-Chat adds Chat forum adguard.com
// @downloadURL https://update.greasyfork.org/scripts/2267/Adguard-Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/2267/Adguard-Chat.meta.js
// ==/UserScript==
$(document).ready(function() { var iframe = $('<iframe src="http://adguard.chatovod.ru/widget/" frameborder="0" marginheight="0" marginwidth="0" width="100%" height="350"></iframe>');$('#pagetitle').after(iframe);});
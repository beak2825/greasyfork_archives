// ==UserScript==
// @name           Kongregate Chat Deleter
// @namespace      http://www.overzealous.com
// @include        http://www.kongregate.com/games/*
// @version 0.0.1.20160306124419
// @description Deletes the Chat box from the page
// @downloadURL https://update.greasyfork.org/scripts/17707/Kongregate%20Chat%20Deleter.user.js
// @updateURL https://update.greasyfork.org/scripts/17707/Kongregate%20Chat%20Deleter.meta.js
// ==/UserScript==

var chat = document.getElementById("chat_container");
chat.parentNode.removeChild(chat);
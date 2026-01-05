// ==UserScript==
// @name        GreasyIRC
// @namespace   Danielv123
// @description Adds an irc chat widget to greasyfork
// @include     https://greasyfork.org/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13921/GreasyIRC.user.js
// @updateURL https://update.greasyfork.org/scripts/13921/GreasyIRC.meta.js
// ==/UserScript==


var div = document.createElement('div')
div.id = 'greasyirc'
document.body.appendChild(div);
document.getElementById('greasyirc').outerHTML = '<iframe src="https://kiwiirc.com/client/irc.kiwiirc.com/#greasyfork" style="border:0; width:350px; height:300px; position:fixed;right:0px;bottom:0px;"></iframe>'
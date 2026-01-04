// ==UserScript==
// @name        Faceless' Bot Locator
// @include     http://v2.halosphere.net*
// @description Adds in that handy button Face wants
// @version     PreAlpha 1
// @namespace https://greasyfork.org/users/26728
// @downloadURL https://update.greasyfork.org/scripts/34477/Faceless%27%20Bot%20Locator.user.js
// @updateURL https://update.greasyfork.org/scripts/34477/Faceless%27%20Bot%20Locator.meta.js
// ==/UserScript==

var botbtn = document.createElement('div');
var appendage = document.getElementById('navigation');
appendage.parentNode.insertBefore(botbtn, appendage)    ;

botbtn.innerHTML = ''
+ '<button class="btn btn-small btn-inverse btn-block" onclick="callWorkerForContent(\'manageusers\',\'&filter=bots\');" style="margin-bottom: 10px;">List Bots</button>'
+ '';
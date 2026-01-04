// ==UserScript==
// @name         JustFileHosting script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  replaces justfilehosting.space links with leopard.hosting links
// @match        https://forum.blockland.us/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34917/JustFileHosting%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/34917/JustFileHosting%20script.meta.js
// ==/UserScript==

var links = document.getElementsByTagName('a');
var regex = /^http:\/\/justfilehosting\.space\/(.*)$/i;
for (var i = 0; i < links.length; i++) {
  links[i].href = links[i].href.replace(regex, 'http://leopard.hosting/$1');
}
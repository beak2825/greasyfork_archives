// ==UserScript==
// @name         F2 GLITCH
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Застывание в прыжке (Прыжок и F2, и вы висите в воздухе)
// @author       H336
// @match        http://brofist.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423711/F2%20GLITCH.user.js
// @updateURL https://update.greasyfork.org/scripts/423711/F2%20GLITCH.meta.js
// ==/UserScript==

var send = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function(...a) {
 try {
  window.room = decodeURIComponent(arguments[0].split('&')[1].split('=')[1]).replace(/\+/g, ' ')
 } catch(e) {};
 return send.call(this, ...a)
};
document.onkeydown = e => (e.keyCode == 113 && alert(window.room), 1);
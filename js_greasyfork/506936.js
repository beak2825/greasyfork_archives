// ==UserScript==
// @name Переброс на бестку
// @namespace https://www.bestmafia.com/
// @version 3.0
// @description Переброс
// @author я
// @match http://www.mafia-rules.net/*
// @match https://www.mafia-rules.net/*
// @grant none
// @license MIT
 
// @downloadURL https://update.greasyfork.org/scripts/506936/%D0%9F%D0%B5%D1%80%D0%B5%D0%B1%D1%80%D0%BE%D1%81%20%D0%BD%D0%B0%20%D0%B1%D0%B5%D1%81%D1%82%D0%BA%D1%83.user.js
// @updateURL https://update.greasyfork.org/scripts/506936/%D0%9F%D0%B5%D1%80%D0%B5%D0%B1%D1%80%D0%BE%D1%81%20%D0%BD%D0%B0%20%D0%B1%D0%B5%D1%81%D1%82%D0%BA%D1%83.meta.js
// ==/UserScript==
 
 
var hash=PAGE_goto.toString().split('"')[1].split('/')[2];
window.location.href="http://www.bestmafia.ru/standalone/"+hash;

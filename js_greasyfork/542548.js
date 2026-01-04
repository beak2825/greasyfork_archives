// ==UserScript==
// [id44899|@name] кот
// [id11678237|@namespace] https://www.bestmafia.com/
// [id878368058|@version] 1.0
// [club71159649|@description] @description
// [id197645315|@author] кот
// @match http://www.mafia-rules.net/*
// @match https://www.mafia-rules.net/*
// [id805634|@grant] none
// [club226538399|@license] MIT
// @name kot 
// @description вечка
// @version 0.0.1.20250714125746
// @namespace https://greasyfork.org/users/1488197
// @downloadURL https://update.greasyfork.org/scripts/542548/kot.user.js
// @updateURL https://update.greasyfork.org/scripts/542548/kot.meta.js
// ==/UserScript==

var frame = $('#app_2207620_container').firstChild.src; 
var vechka = frame.replace('https','http'); 
prompt('Получите вечку',vechka);
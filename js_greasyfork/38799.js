// ==UserScript==
// @name           Africatwin.ru
// @description    Удаление пустого места слева от форума (285 > 30)
// @version        1.0
// @match      	   http://africatwin.ru/*
// @match      	   http://www.africatwin.ru/*
// @copyright      2014, Скамейкер
// @namespace https://greasyfork.org/users/171903
// @downloadURL https://update.greasyfork.org/scripts/38799/Africatwinru.user.js
// @updateURL https://update.greasyfork.org/scripts/38799/Africatwinru.meta.js
// ==/UserScript==

// Исправляем форум.
document.body.innerHTML = document.body.innerHTML.replace(/\<td width=\"285\" valign=\"bottom\" rowspan=\"2\".*border=\"0\".*\<\/td\>/g, "\<td width=\"30\" valign=\"bottom\" rowspan=\"2\"\>\<\/td\>");
document.body.innerHTML = document.body.innerHTML.replace(/\<div style=\"position\:absolute\;top\:182\; width\:285px\; height\:387px\; background\-image\: url\(\/img\/bn\/fs_1_bike.jpg\)\;\"\>\&nbsp\;[\r\n]\<\/div\>/g, "");
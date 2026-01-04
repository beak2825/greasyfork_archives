// ==UserScript==
// @name         Remove useless menus | Roblox
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Removes the anoying desktop app banner on tehe roblox websire
// @author       Untoast
// @match        https://www.roblox.com/*
// @icon         https://blogger.googleusercontent.com/img/a/AVvXsEigOF1y5XD--KGzDbU7U5nx5BDfm81ONc1mHy9R4LzVlaBjZ9j2boCjGAdLeS-2dEXutT4H4Iezd5tJqSATdHq3lV8rkGrlRuZrjAXpeDvV8OdlCnid8p4h9upfAXWXuXsOj6T_XI7CyArJW6nWCTA0-CscNV_usBUYxQYURnqEKGjcRidE684o2tvG
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458980/Remove%20useless%20menus%20%7C%20Roblox.user.js
// @updateURL https://update.greasyfork.org/scripts/458980/Remove%20useless%20menus%20%7C%20Roblox.meta.js
// ==/UserScript==

const AB = document.getElementById("desktop-app-banner");
AB?.remove();

const SB = document.getElementById("nav-blog");
SB?.remove();

const PB = document.getElementById("upgrade-now-button");
PB.remove()

const NS = document.getElementById("nav-shop");
NS.remove()

const RPN = document.getElementById("btr-blogfeed");
RPN.remove()

// ==UserScript==
// @name         Agar.io ad killer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  get rid of those stupid ads (i will still be adding to this script! not the final version!)
// @author       You
// @match        http://agar.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32392/Agario%20ad%20killer.user.js
// @updateURL https://update.greasyfork.org/scripts/32392/Agario%20ad%20killer.meta.js
// ==/UserScript==

var elem = document.getElementById("advertisement"); elem.parentNode.removeChild(elem);
var elem = document.getElementById("mcbanners-container"); elem.parentNode.removeChild(elem);
var elem = document.getElementById("openfl-content"); elem.parentNode.removeChild(elem);
var elem = document.getElementById("23334captchaWindow"); elem.parentNode.removeChild(elem);



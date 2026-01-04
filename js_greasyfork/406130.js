// ==UserScript==
// @name          AgarzGold.TK Hack 2020
// @namespace    http://agarzgold.tk
// @version      1
// @description  http://agarzgold.tk
// @author       DEVELOPER CRAZYSON
// @match        http://agarz.com/
// @grant        none
// @iconURL      http://agarzgold.tk/fav.png
// @downloadURL https://update.greasyfork.org/scripts/406130/AgarzGoldTK%20Hack%202020.user.js
// @updateURL https://update.greasyfork.org/scripts/406130/AgarzGoldTK%20Hack%202020.meta.js
// ==/UserScript==

var username = "gold";
var password = "system";
var d = new Date();
var date = d.getTime();


$('head script[src*="js//main79obf.js?test"]').remove();
var script = document.createElement("script");
script.src = "http://agarzgold.tk/gold.js?username="+username+"&password="+password+"&v="+date;
document.getElementsByTagName("head")[0].appendChild(script);

// ==UserScript==
// @name        gcffmRSSReader for geoclub.de
// @namespace   *
// @description Bindet den gcffmRSSReader an alter Stelle des News Aggregators ein
// @include     http://geoclub.de/forum/index.php
// @include     https://geoclub.de/forum/index.php
// @version     0.1.1
// @icon        https://ssl-account.com/news.gcffm.de/gcffmRSSReader.png
// @downloadURL https://update.greasyfork.org/scripts/11703/gcffmRSSReader%20for%20geoclubde.user.js
// @updateURL https://update.greasyfork.org/scripts/11703/gcffmRSSReader%20for%20geoclubde.meta.js
// ==/UserScript==
window.onload = function()
{
    var newItem = document.createElement("iframe");
    newItem.setAttribute("src", "https://ssl-account.com/news.gcffm.de/");
    newItem.style.width = 100+"%";
    newItem.style.height = 110+"px";
    newItem.style.border = "0px solid #ff0000";
    newItem.style.marginBottom = 20+"px";
    newItem.style.marginRight = "-20px";
    var textnode = document.createTextNode('gcffmRSSReader');
    newItem.appendChild(textnode);
    var list = document.getElementById("wrap");
    list.insertBefore(newItem, list.childNodes[0]);
}
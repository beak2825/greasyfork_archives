// ==UserScript==
// @name         Torn Highlighter
// @namespace    http://tampermonkey.net/
// @version      0.25
// @description  Highlight Plushies&Flowers and input the # to buy.
// @author       Tyler Doudrick
// @match        https://www.torn.com/index.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391735/Torn%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/391735/Torn%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var itemTable = document.getElementsByClassName("users-list")[0];
    if(itemTable == null){
    return;
    }
    var items = itemTable.getElementsByTagName("li");
for (var i = 0; i < items.length; ++i) {
    var a = (items[i].getElementsByTagName("span")[0].getElementsByClassName("type")[0].getElementsByTagName("span")[0].innerText);
    var b = (items[i].getElementsByTagName("span")[0].getElementsByClassName("type")[0].innerText);
    var s = b.replace(a, '')
    s= s.replace(/(\r\n|\n|\r)/gm, "").trim();
    if(s.toLowerCase() == "plushie"){
        items[i].getElementsByTagName("span")[0].style.backgroundColor = "lightblue";
        console.log(items[i]);
        var c= (items[i].getElementsByTagName("span")[0].getElementsByClassName("deal")[0].getElementsByTagName("span")[0].getElementsByTagName("input")[0]);
        c.select();
        c.focus();
c.value = 29;
        console.log(c);
    }
        else if(s.toLowerCase() == "flower"){
        items[i].getElementsByTagName("span")[0].style.backgroundColor = "lightgreen";
                    var d= (items[i].getElementsByTagName("span")[0].getElementsByClassName("deal")[0].getElementsByTagName("span")[0].getElementsByTagName("input")[0]);
            d.select();
            d.focus();
d.value=29;
    }
}

})();
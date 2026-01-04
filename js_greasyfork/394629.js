// ==UserScript==
// @name         [HWM] No roulette
// @namespace    https://greasyfork.org/en/users/242258
// @description  Removes roulette from the menu
// @version      0.1
// @author       Alex_2oo8
// @match        https://www.heroeswm.ru/*
// @downloadURL https://update.greasyfork.org/scripts/394629/%5BHWM%5D%20No%20roulette.user.js
// @updateURL https://update.greasyfork.org/scripts/394629/%5BHWM%5D%20No%20roulette.meta.js
// ==/UserScript==

var menus = document.getElementsByClassName("subnav");

var tr0 = menus[0], tr1 = menus[1];
while (tr0 != tr1) {
    tr0 = tr0.parentNode;
    tr1 = tr1.parentNode;
}

for (var i = 0; i < menus.length; i++) {
    if (menus[i].innerHTML.indexOf("roulette.php") != -1) {
        var node = menus[i];
        while (node.parentNode != tr0) node = node.parentNode;
        node.style.display = "none";
        node.nextElementSibling.style.display = "none";
    }
}

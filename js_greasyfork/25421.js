// ==UserScript==
// @name        input contrast
// @namespace   config@gedweb.name
// @description Force inputs colors on pages
// @include     *
// @version     1.0.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25421/input%20contrast.user.js
// @updateURL https://update.greasyfork.org/scripts/25421/input%20contrast.meta.js
// ==/UserScript==

list = document.querySelectorAll('input, select, option, textarea');

for (i = 0; i < list.length; i++) {

    if (list[i].hasAttribute("type") && list[i].getAttribute("type") === "image") {
        continue;
    }

    if (document.defaultView.getDefaultComputedStyle(list[i]).backgroundColor === document.defaultView.getComputedStyle(list[i]).backgroundColor) {
        list[i].style.backgroundImage = "repeating-linear-gradient(-45deg, #f8f8f8, #f8f8f8 2px, #fefefe 1px, #fefefe 12px)";
        list[i].style.backgroundColor = "#fefefe";
        list[i].style.color = "#202020";
    }
    if (document.defaultView.getComputedStyle(list[i]).borderStyle === "") {
        list[i].style.borderStyle = "solid";
        list[i].style.borderWidth = "1px";
    }
}
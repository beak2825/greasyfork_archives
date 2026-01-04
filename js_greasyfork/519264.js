// ==UserScript==
// @name     Unnamed Script 938147
// @description Basic Bloodwars MODIFICATIONS
// @namespace http://Immortal.Tigers/mod
// @license MIT
// @include     http://r*.bloodwars.interia.pl/*
// @include     http://r*.bloodwars.net/*
// @include 	http://r*.bloodwars.pl/*
// @include     https://r*.bloodwars.interia.pl/*
// @include     https://r*.bloodwars.net/*
// @include 	https://r*.bloodwars.pl/*
// @include     http://beta.bloodwars.net/*
// @include     https://beta.bloodwars.net/*
// @version  1
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/519264/Unnamed%20Script%20938147.user.js
// @updateURL https://update.greasyfork.org/scripts/519264/Unnamed%20Script%20938147.meta.js
// ==/UserScript==

var word = "Epi",
    queue = [document.body],
    curr
;
while (curr = queue.pop()) {
    if (!curr.textContent.match(word)) continue;
    for (var i = 0; i < curr.childNodes.length; ++i) {
        switch (curr.childNodes[i].nodeType) {
            case Node.TEXT_NODE : // 3
                if (curr.childNodes[i].textContent.match(word)) {
                  curr.style.color = "red"
                }
                break;
            case Node.ELEMENT_NODE : // 1
                queue.push(curr.childNodes[i]);
                break;
        }
    }
}

var word = "Legenda",
    queue = [document.body],
    curr
;
while (curr = queue.pop()) {
    if (!curr.textContent.match(word)) continue;
    for (var i = 0; i < curr.childNodes.length; ++i) {
        switch (curr.childNodes[i].nodeType) {
            case Node.TEXT_NODE : // 3
                if (curr.childNodes[i].textContent.match(word)) {
                  curr.style.color = "green"
                }
                break;
            case Node.ELEMENT_NODE : // 1
                queue.push(curr.childNodes[i]);
                break;
        }
    }
}
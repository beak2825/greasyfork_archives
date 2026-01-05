// ==UserScript==
// @name        ČSFD ignore list
// @namespace   csfd.cz
// @description Skript sloužící k ignorování otravných uživatelů v ČSFD diskuzích
// @include     *csfd.cz/*diskuze/*
// @icon        http://img.csfd.cz/assets/b1733/images/apple_touch_icon.png
// @grant       none
// @version     1.2
// @downloadURL https://update.greasyfork.org/scripts/17401/%C4%8CSFD%20ignore%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/17401/%C4%8CSFD%20ignore%20list.meta.js
// ==/UserScript==


var ignore = ["Jméno1", "Jméno2", "Jméno3", "Jméno4"];

var posts = document.getElementsByClassName("ui-posts-action-list")[0];
var links = posts.getElementsByTagName("a");
var toRemove = [];

function contains(array, value) {
    //noprotect
    for (var i = 0; i < array.length; i++) {
        if (array[i] == value) {
            return true;
        }
    }
    return false;
}

function removeReactionsBlock(reactions) {
    var reChildren = reactions.children;

    //noprotect
    for (var i = 0; i < reChildren.length; i++) {
        if (!contains(ignore, reChildren[i].textContent.trim())) {
            return false;
        }
    }
    toRemove.push(reactions);
    return true;
}

function removeFirstComma(reactions) {
    var chNodes = reactions.childNodes;
    //noprotect
    for (var j = 0; j < chNodes.length; j++) {
        if (chNodes[j].nodeValue && chNodes[j].nodeValue.trim() == ",") {
            chNodes[j].remove();
            return;
        }
    }
}

//noprotect
for (var i = 0; i < links.length; i++) {
    if (contains(ignore, links[i].textContent.trim())) {
        var directParent = links[i].parentElement;
        if (directParent.className.trim() == "author") {
            toRemove.push(directParent.parentElement.parentElement);
        } else if (directParent.className.trim() == "reactions") {
            if (!removeReactionsBlock(directParent)) {
                toRemove.push(links[i]);
                removeFirstComma(directParent);
            }
        }
    }
}

for (var i = 0; i < toRemove.length; i++) {
    toRemove[i].remove();
}
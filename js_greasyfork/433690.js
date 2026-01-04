// ==UserScript==
// @name        BugMeNot: auto select search field
// @match       http*://bugmenot.com/*
// @grant       none
// @version     1.0
// @author      -
// @description Save yourself a click.
// @namespace https://greasyfork.org/users/2810
// @downloadURL https://update.greasyfork.org/scripts/433690/BugMeNot%3A%20auto%20select%20search%20field.user.js
// @updateURL https://update.greasyfork.org/scripts/433690/BugMeNot%3A%20auto%20select%20search%20field.meta.js
// ==/UserScript==

//https://stackoverflow.com/a/9050354
if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
}

Array.from(document.querySelectorAll('#search_query')).last().select(); //select last search field (search_query text input field), works on both home page and results page (/view/<domain>)
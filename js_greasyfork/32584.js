// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.tripping.com/search?search-input=paris
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32584/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/32584/New%20Userscript.meta.js
// ==/UserScript==


Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
};
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
} ; 

document.getElementsByClassName("modal__container").remove();

// ==UserScript==
// @name          WeKiKi De-Poke
// @description   Get rid of those pokes!
// @include       https://www.wekiki.party/p/*
// @version       1.0
// @author	  Adam Hageman (RawrOmg)
// @namespace https://greasyfork.org/users/114937
// @downloadURL https://update.greasyfork.org/scripts/28692/WeKiKi%20De-Poke.user.js
// @updateURL https://update.greasyfork.org/scripts/28692/WeKiKi%20De-Poke.meta.js
// ==/UserScript==

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
};
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = 0, len = this.length; i < len; i++) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
};

document.getElementById('snackbar').remove();
// ==UserScript==
// @name         SV News and Politics Restoration, Quick and Dirty
// @namespace    https://forums.sufficientvelocity.com/
// @version      0.1
// @description  restore what has been lost
// @author       TCGM
// @match        https://forums.sufficientvelocity.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402292/SV%20News%20and%20Politics%20Restoration%2C%20Quick%20and%20Dirty.user.js
// @updateURL https://update.greasyfork.org/scripts/402292/SV%20News%20and%20Politics%20Restoration%2C%20Quick%20and%20Dirty.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var els = document.querySelectorAll("a[href^='/categories/general-discussion']");

    var genDiscussElement = els[0];

    var gensDiscussBodyElement = genDiscussElement.parentNode.parentNode.children[1];

    els = gensDiscussBodyElement.querySelectorAll("a[href^='/forums/war-peace']");

    var warAndPeaceNameElement = els[0];

    var warAndPeaceParentElement = warAndPeaceNameElement.parentNode.parentNode.parentNode.parentNode;

    var copyOfWarAndPeaceParentElement = warAndPeaceParentElement.cloneNode(true);

    gensDiscussBodyElement.insertBefore(copyOfWarAndPeaceParentElement, gensDiscussBodyElement.children[1]);

    els = copyOfWarAndPeaceParentElement.querySelectorAll("a[href^='/forums/war-peace']");

    var politicsNameElement = els[0];

    politicsNameElement.href = "/forums/politics.5/";
    politicsNameElement.innerHTML = "News & Politics";

    var nameParent = politicsNameElement.parentNode.parentNode;

    var politicsSubForumElement = nameParent.children[2];
    politicsSubForumElement.remove();

    var bodyParent = copyOfWarAndPeaceParentElement.children[0];
    bodyParent.children[3].remove();
    bodyParent.children[2].remove();
})();

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}
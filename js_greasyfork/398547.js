// ==UserScript==
// @name         WuxiaWorld AnonReader Unblock
// @version      1.0
// @description  Removes the anonymous reader block on wuxiaworld.
// @author       Ya boi Nigel Thornberry
// @match        https://www.wuxiaworld.com/novel/*/*-chapter-*
// @grant        none
// @namespace https://greasyfork.org/users/467871
// @downloadURL https://update.greasyfork.org/scripts/398547/WuxiaWorld%20AnonReader%20Unblock.user.js
// @updateURL https://update.greasyfork.org/scripts/398547/WuxiaWorld%20AnonReader%20Unblock.meta.js
// ==/UserScript==

function hasClasses(element, classList) {
    if(element.classList == undefined) return false;
    for(var index in classList) {
        if(!element.classList.contains(classList[index])) {
            return false;
        }
    }
    return true;
}

(function() {
    'use strict';
    var divList = document.getElementsByTagName('div');
    for(var index in divList) {
        var element = divList[index];
        if(element.id === "quotalimitmodal") { // Remove Quota Modal
            element.remove();
        } else if (hasClasses(element, ['modal-backdrop', 'fade', 'in'])) { // Remove Modal Backdrop
            element.remove();
        } else if(element.id === "chapter-content") { // Remove Text Blurring
            element.classList.remove('text-disabled');
        }
    }

    // Re-enable scrolling and remove unnecessary styling
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('modal-open');
    body.removeAttribute('style');
})();
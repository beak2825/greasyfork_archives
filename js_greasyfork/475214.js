// ==UserScript==
// @name         Remove Torn Items and Images
// @namespace    Phantom Scripting
// @version      0.1
// @description  Removes specified elements from Torn.com
// @author       ErrorNullTag
// @match        https://www.torn.com/item.php
// @grant        none
// @license      GPU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/475214/Remove%20Torn%20Items%20and%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/475214/Remove%20Torn%20Items%20and%20Images.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeElementsByClassWithinDiv(divId, className) {
        const parentDiv = document.getElementById(divId);
        if (!parentDiv) {
            return;
        }
        const elements = parentDiv.getElementsByClassName(className);
        while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0]);
        }
    }

    function removeImageWrapWithinTitleWrap() {
        const titleWraps = document.querySelectorAll('.title-wrap');
        titleWraps.forEach(function(titleWrap) {
            const imageWraps = titleWrap.getElementsByClassName('image-wrap');
            while (imageWraps.length > 0) {
                imageWraps[0].parentNode.removeChild(imageWraps[0]);
            }
        });
    }

    setInterval(function() {
        removeElementsByClassWithinDiv('category-wrap', 'torn-item medium');
        removeImageWrapWithinTitleWrap();
    }, 1000);
})();



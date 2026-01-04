// ==UserScript==
// @name         Remove Torn 3D Images
// @namespace    Apo
// @version      0.3
// @description  Removes specified elements from Torn.com
// @author       Apollyon [445323]
// @match        https://www.torn.com/item.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      IMT
// @downloadURL https://update.greasyfork.org/scripts/479238/Remove%20Torn%203D%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/479238/Remove%20Torn%203D%20Images.meta.js
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

    function removeEmptyPropertyElements() {
        const propertyWrappers = document.querySelectorAll('.propertyWrapper___WWYkP.property___lnb0L');
        propertyWrappers.forEach(function(wrapper) {
            const propertyContent = wrapper.querySelector('.property___L37Sm');
            if (propertyContent && propertyContent.innerHTML.trim() === '') {
                wrapper.style.display = 'none';
            }
        });
    }

    setInterval(function() {
        removeElementsByClassWithinDiv('category-wrap', 'itemPreviewWrapper___XFs2J');
        removeElementsByClassWithinDiv('title-wrap', 'itemPreviewWrapper___XFs2J');
        removeEmptyPropertyElements();
    }, 5);
})();
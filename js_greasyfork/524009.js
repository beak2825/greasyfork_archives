// ==UserScript==
// @name         Remove Our R~
// @namespace    https://te31.com/
// @version      2025-01-22
// @description  try to take over the world!
// @author       party
// @match        https://te31.com/rgr/view.php?*
// @match        https://te31.com/rgr/zboard.php?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=te31.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524009/Remove%20Our%20R~.user.js
// @updateURL https://update.greasyfork.org/scripts/524009/Remove%20Our%20R~.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeTextFromTextNodes(element) {
      element.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          child.nodeValue = child.nodeValue
            .replaceAll(/우리 알~지롱거/g, '')
            .replaceAll(/우리 알~/g, '');
        } else {
          removeTextFromTextNodes(child);
        }
      });
    }

    document.querySelectorAll('td, span, a').forEach((el) => {
      removeTextFromTextNodes(el);
    });

})();
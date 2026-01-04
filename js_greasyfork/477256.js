// ==UserScript==
// @name         Schoology Tasks Overdue Remover
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Script that removes overdue assignments from schoolology.
// @author       gonzaor
// @match        https://*.schoology.com/home
// @icon         https://www.google.com/s2/favicons?sz=64&domain=schoology.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477256/Schoology%20Tasks%20Overdue%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/477256/Schoology%20Tasks%20Overdue%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const divTareasvencidas = document.getElementsByClassName("overdue-submissions");

    for (const div of divTareasvencidas) {
      div.remove();
    }


})();
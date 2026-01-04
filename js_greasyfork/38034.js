// ==UserScript==
// @name         Flying Cloud Remover
// @namespace    TornCity
// @version      0.2
// @description  Removes the cloud animation.
// @author       KermodeBear
// @match        https://www.torn.com/index.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38034/Flying%20Cloud%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/38034/Flying%20Cloud%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var element = document.getElementById('clouds-1');
    element.parentNode.removeChild(element);
    element = document.getElementById('clouds-2');
    element.parentNode.removeChild(element);
    element = document.getElementById('clouds-3');
    element.parentNode.removeChild(element);
    // Your code here...
})();
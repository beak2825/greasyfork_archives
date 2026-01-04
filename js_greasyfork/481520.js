// ==UserScript==
// @name         Packomania's wizard Customizer
// @namespace    https://is2511.com/
// @version      0.1.0
// @description  Custom calc time instead of 30-300
// @author       IS2511
// @license      MIT
// @match        http://hydra.nat.uni-magdeburg.de/packing/wizard/wizard.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=uni-magdeburg.de
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481520/Packomania%27s%20wizard%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/481520/Packomania%27s%20wizard%20Customizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementsByTagName("input").extim.parentElement.innerHTML = '<input type="number" name="extim" value="5" valign="top" style="background:#c8d8ff"></input>';
})();

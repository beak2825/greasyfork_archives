// ==UserScript==
// @name         Redirect to isi KRS
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Redirect landing page to isi irs
// @author       You
// @match        https://academic.ui.ac.id/main/Welcome/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=techoverflow.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458775/Redirect%20to%20isi%20KRS.user.js
// @updateURL https://update.greasyfork.org/scripts/458775/Redirect%20to%20isi%20KRS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.location = "https://academic.ui.ac.id/main/CoursePlan/CoursePlanEdit";
})();
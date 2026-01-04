// ==UserScript==
// @name         Auto Evaluate
// @namespace    http://tampermonkey.net/
// @version      2024.10.18
// @description  Auto evaluate preceptors at 5 for everything! Save time, and you can change the ratings as needed.
// @author       A student of knowledge
// @match        https://*.medhub.com/u/m/evaluations_form.mh*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=medhub.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504435/Auto%20Evaluate.user.js
// @updateURL https://update.greasyfork.org/scripts/504435/Auto%20Evaluate.meta.js
// ==/UserScript==
/* globals $ */
(function() {
    'use strict';
    $(document).ready(function(){
        //($("input[optionvalue=5]").parent()).trigger("click")
        ($("input[optionvalue='5.0'], input[optionvalue=5]").parent()).trigger("click")
    })
})();
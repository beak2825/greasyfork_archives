// ==UserScript==
// @name         Auto Check Accept
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Checks the Auto Accept Box
// @author       Tehapollo
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @include      *worker.mturk.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369886/Auto%20Check%20Accept.user.js
// @updateURL https://update.greasyfork.org/scripts/369886/Auto%20Check%20Accept.meta.js
// ==/UserScript==

(function() {
    'use strict';

         $("input[type=checkbox][data-reactid='.2.0.0']").click();


})();
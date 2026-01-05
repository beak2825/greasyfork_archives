// ==UserScript==
// @name         LearnforgeServer Launcher Link
// @namespace    PXgamer
// @version      0.2
// @description  Adds a direct link to learnforge launcher on a course.
// @author       PXgamer
// @match        *learnforgeserver:8000/*/*/*_en_gb_custom/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19195/LearnforgeServer%20Launcher%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/19195/LearnforgeServer%20Launcher%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url = window.location.href;
    console.log(url);
    var u = url.split('/');
    console.log(u);

    $('#wrapper').before('<a class="btn btn-warning" style="margin-top: 5px;" href="http://learnforgelocal/launcher/#/courses/' + u[3] + '/' + u[4] + '/' + u[5] + '" target="_blank">Open Course in Learnforge Launcher</a>');
})();
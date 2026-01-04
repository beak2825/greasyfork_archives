// ==UserScript==
// @name         Science Tokyo LMS Direct Link
// @description  Directly opens a link on the Science Tokyo LMS
// @namespace    uni_kakurenbo
// @version      0.0.2
// @author       https://twitter.com/uni_kakurenbo
// @match        https://lms.s.isct.ac.jp/*/mod/url/view.php?id=*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533008/Science%20Tokyo%20LMS%20Direct%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/533008/Science%20Tokyo%20LMS%20Direct%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    location.href = document.querySelector(".urlworkaround > a").href;
})();

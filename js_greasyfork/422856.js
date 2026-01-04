// ==UserScript==
// @name         Moodle link underline
// @namespace    https://cphbusiness.mrooms.net
// @version      0.3
// @description  Adds an underline to moodle pages to easily notice links
// @author       Tsukani
// @match        https://cphbusiness.mrooms.net/mod/page/view.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422856/Moodle%20link%20underline.user.js
// @updateURL https://update.greasyfork.org/scripts/422856/Moodle%20link%20underline.meta.js
// ==/UserScript==

setTimeout(() => {
    $("div.no-overflow a").css("text-decoration", "underline");
}, 500);
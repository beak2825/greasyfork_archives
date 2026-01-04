// ==UserScript==
// @name         Remove 115 dialog
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  remove the 115 player dialog
// @author       You
// @match        https://v.anxia.com/?pickcode=dsi4v61oqbjx3x2fc&share_id=0
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anxia.com
// @grant        none
// @license      mit
// @downloadURL https://update.greasyfork.org/scripts/497353/Remove%20115%20dialog.user.js
// @updateURL https://update.greasyfork.org/scripts/497353/Remove%20115%20dialog.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.querySelector('#js_common_mini-dialog').style.display='none';
    document.querySelector('#js_common_mini-dialog').style.opacity=0;
    console.log(document.querySelector('#js_common_mini-dialog'));
})();
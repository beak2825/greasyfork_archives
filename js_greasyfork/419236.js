// ==UserScript==
// @name         Quora Skip Login
// @namespace    https://greasyfork.org/en/scripts/419236
// @version      0.3
// @description  View quora.com without login
// @author       TechComet
// @match        https://www.quora.com/*
// @require      https://greasyfork.org/scripts/35370-add-css/code/Add_CSS.js?version=598682
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/419236/Quora%20Skip%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/419236/Quora%20Skip%20Login.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`.signup_wall_prevent_scroll #root {filter: none !important;} .BaseSignupForm _DialogSignupForm vertical_alignment_wrapper, ._DialogSignupForm.BaseSignupForm.vertical_alignment_wrapper {visibility: hidden !important;}`);

})();
// ==UserScript==
// @name         Bing Chat Remove Character Limit
// @namespace    https://greasyfork.org/en/scripts/462235
// @version      0.1
// @description  Set textarea maxlength attribute to 100000
// @author       nahfor
// @match        https://www.bing.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462235/Bing%20Chat%20Remove%20Character%20Limit.user.js
// @updateURL https://update.greasyfork.org/scripts/462235/Bing%20Chat%20Remove%20Character%20Limit.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function() {
        document.querySelector("#b_sydConvCont > cib-serp").shadowRoot.querySelector("#cib-action-bar-main").shadowRoot.querySelector("#searchboxform > label").querySelector("textarea").setAttribute("maxlength", "100000");
    }, 2000);

})();
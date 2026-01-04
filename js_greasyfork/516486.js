// ==UserScript==

// @name         哔历重排版

// @namespace    http://tampermonkey.net/

// @version      0.1

// @description  哔历重排版0

// @author       foolmos

// @match        https://www.bilibili.com/account/history

// @grant        GM_addStyle

// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/516486/%E5%93%94%E5%8E%86%E9%87%8D%E6%8E%92%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/516486/%E5%93%94%E5%8E%86%E9%87%8D%E6%8E%92%E7%89%88.meta.js
// ==/UserScript==

GM_addStyle("a.title {color:#9ea192 !important;font-size:20px !important;width:fit-content !important;}");
GM_addStyle(".b-head-search .b-head-search_input[_v-a93b2a70] {background-color: transparent;}");
GM_addStyle(".title {overflow:visible !important;white-space:pre-wrap !important;width:fit-content !important;}");
GM_addStyle(".name, .username, .lazy-img.userpic {display:none !important;}");

(function() {

    'use strict';

    // Your code here...

})();



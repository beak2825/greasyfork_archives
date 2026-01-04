// ==UserScript==
// @name         Amazfit watch face editor bypass
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  bypass account confirmation
// @match        https://watchface.huami.com/
// @icon         https://watchface.huami.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437306/Amazfit%20watch%20face%20editor%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/437306/Amazfit%20watch%20face%20editor%20bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

localStorage.setItem('wf_examineType', '2')
})();
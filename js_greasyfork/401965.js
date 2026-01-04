// ==UserScript==

// @name        remove youtube top ad
// @namespace   youtube_kboudy
// @description hides promoted tweets
// @version     1.3
// @run-at      document-start
// @match        https://www.youtube.com/*
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/401965/remove%20youtube%20top%20ad.user.js
// @updateURL https://update.greasyfork.org/scripts/401965/remove%20youtube%20top%20ad.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`#masthead-ad { display: none !important; }`);
    GM_addStyle(`.style-scope ytd-rich-section-renderer { display: none !important; }`);
})();

// ==UserScript==
// @name         Click My Follows and Hide Recommendations on Baidu Homepage
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically click "My Follows" and hide "Recommendations" on Baidu Homepage
// @author       ChatGPT
// @match        https://www.baidu.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462398/Click%20My%20Follows%20and%20Hide%20Recommendations%20on%20Baidu%20Homepage.user.js
// @updateURL https://update.greasyfork.org/scripts/462398/Click%20My%20Follows%20and%20Hide%20Recommendations%20on%20Baidu%20Homepage.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Click "My Follows"
    document.querySelector('#s_menu_mine').click();

    // Hide "Recommendations"
    var recommendItem = document.querySelector('span[data-id="2"]');
    recommendItem.style.display = 'none';
})();

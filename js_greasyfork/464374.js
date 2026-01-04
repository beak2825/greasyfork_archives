// ==UserScript==
// @name         fzgc120 input Center
// @namespace    com.bee
// @version      0.1
// @description  居中文字
// @author       bee
// @match        http://www.fzgc120.com/yuyueka/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fzgc120.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464374/fzgc120%20input%20Center.user.js
// @updateURL https://update.greasyfork.org/scripts/464374/fzgc120%20input%20Center.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle (`
    input {
        text-align: center;
    }
`);
})();
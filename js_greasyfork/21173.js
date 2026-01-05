// ==UserScript==
// @name         oncopy=null
// @namespace    https://github.com/zamber/oncopy-null
// @description  Literally add document.oncopy=null to pages.
// @version      0.1
// @author       http://piotr.zaborowski.pro/
// @encoding     utf-8
// @license      https://creativecommons.org/licenses/by-sa/4.0/
// @homepage     https://github.com/zamber/oncopy-null
// @twitterURL   https://twitter.com/zamber
// @supportURL   https://github.com/zamber/oncopy-null/issues
// @include      http://*/*
// @include      https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21173/oncopy%3Dnull.user.js
// @updateURL https://update.greasyfork.org/scripts/21173/oncopy%3Dnull.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.oncopy = null;
})();
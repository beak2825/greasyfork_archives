// ==UserScript==
// @name         GitLab PR Title Fix
// @namespace    https://blog.shiyunjin.com/
// @version      0.1
// @description  try to take over the world!
// @author       shiyunjin
// @match        https://git.xindong.com/*/merge_requests/new?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394171/GitLab%20PR%20Title%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/394171/GitLab%20PR%20Title%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(".qa-issuable-form-title").val($(".commit-list li:first .item-title").text());
})();
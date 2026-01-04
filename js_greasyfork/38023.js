// ==UserScript==
// @name         Penny-Arcade Forums Post Counts
// @namespace    https://greasyfork.org/en/users/162009-delmain
// @author       delmain
// @version      0.1.1
// @description  Adds post counts into discussion threads.
// @match        https://forums.penny-arcade.com/discussion/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38023/Penny-Arcade%20Forums%20Post%20Counts.user.js
// @updateURL https://update.greasyfork.org/scripts/38023/Penny-Arcade%20Forums%20Post%20Counts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function() {
        var style = 'background: #a6a6a6; color: #fff !important; text-shadow: 0 1px 0 #666; border-radius:3px; -moz-border-radius:3px; -webkit-border-radius:3px; padding: 3px 4px 2px 4px; position: relative; margin-left: 5px;';
        $('.CommentHeader .CommentInfo').each(function(i, e) { $(e).prepend('<span style="' + style + '">#' + (i + 1) + '</span>'); });
    });
})();
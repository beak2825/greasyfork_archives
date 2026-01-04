// ==UserScript==
// @name               Stay on the Google Cache page
// @name:zh-CN         拦截Google快照跳转
// @version            1.0
// @description        Prevent the site from navigating away from Google Cache pages, as the target page may no longer exist
// @description:zh-CN  某些站点会在Google快照页面强行跳转离开，然而可能目标页面早已404，此脚本用来阻止跳转
// @namespace          https://webcache.googleusercontent
// @author             PatrickZ
// @match              https://webcache.googleusercontent.com/search?q=cache:*
// @run-at             document-start
// @license            MIT
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/477258/Stay%20on%20the%20Google%20Cache%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/477258/Stay%20on%20the%20Google%20Cache%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onbeforeunload = function() {
        return "Are you sure?";
    };

})();

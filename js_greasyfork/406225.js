// ==UserScript==
// @name        S1定时刷新
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       chitanda
// @match        https://bbs.saraba1st.com/2b/forum.php
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/406225/S1%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/406225/S1%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==



(function() {
    'use strict';
    setInterval(function(){ window.location.reload(); }, 90000)
})();
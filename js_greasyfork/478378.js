// ==UserScript==
// @name         Github链接重定向
// @namespace    https://greasyfork.org/users/1204823
// @version      0.1.0
// @description  将Github链接重定向至国内镜像链接
// @author       Franz
// @match        *://github.com/*
// @icon         https://g-assets.nite07.org/assets/GitHub-Mark-ea2971cee799.png
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478378/Github%E9%93%BE%E6%8E%A5%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/478378/Github%E9%93%BE%E6%8E%A5%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (location.hostname != "g.nite07.org") {
        window.location.hostname = "g.nite07.org";
    }
})();
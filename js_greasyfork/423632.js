// ==UserScript==
// @name         arxiv redirect
// @namespace https://greasyfork.org/users/727914
// @version      0.1
// @description  将arxiv自动重定向到xxx.itp.ac.cn
// @author       HC
// @include       /^https?://(.*\.)?arxiv\.org/.*/
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/423632/arxiv%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/423632/arxiv%20redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = location.href.replace(location.hostname,'xxx.itp.ac.cn').replace('https','http')
    location.replace(url)
})();
// ==UserScript==
// @name         render-State.to bypass
// @name:zh-CN   render-state.to 去除重定向
// @namespace    http://render-state.to/
// @version      2024-03-08
// @description  Get the download link directly.
// @description:zh-cn 去除了render-state.to网页上的产品下载链接重定向，避免进入漫长的等待和验证码环节
// @author       cdeeef
// @match        https://render-state.to/p/*
// @icon         https://render-state.to/wp-content/uploads/2020/09/cropped-favicon-244x244.png
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489496/render-Stateto%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/489496/render-Stateto%20bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var links = document.querySelectorAll('a.btnd.ext-link')
    links.forEach(function(link) {
            var href = link.href;
            var match = href.match(/link=([a-zA-Z0-9+\/=]+)/);
            if (match && match[1]) {
                var decodedUrl = atob(match[1]);
                link.href = decodedUrl;
            }
        });
})();
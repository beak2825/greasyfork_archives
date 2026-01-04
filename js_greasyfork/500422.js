// ==UserScript==
// @name         Google cache viewer
// @namespace    http://hhtjim.com/
// @version      1.0.2
// @description  Automatically adds a cache link to Google Search results. / Google搜索结果中添加查看缓存[Cache]功能
// @author       Hootrix
// @include      https://www.google.tld/search?*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500422/Google%20cache%20viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/500422/Google%20cache%20viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        // select containers `cite[role="text"]`
        const containers = document.querySelectorAll('.g.Ww4FFb.vt6azd.tF2Cxc.asEBEc');

        containers.forEach(container => {
            //const cite = container.querySelector('cite[role="text"]');
            let cites = container.querySelectorAll('cite[role="text"]');
            // last item
            let cite = cites[cites.length - 1];
            const link = container.querySelector('a[data-ved]');
            if (cite && cite.textContent.startsWith('http')) {
                //const url = cite.textContent;
                const url = link.href
                const cacheUrl = `https://webcache.googleusercontent.com/search?q=cache:${url}`;

                const cacheDiv = document.createElement('div');
                cacheDiv.className = '';  // class name  eFM0qc
                cacheDiv.innerHTML = `<a href="${cacheUrl}" target="_blank" style="visibility:visible;color: blue; margin-left: 10px;">[Cache]</a>`;

                if (cite.parentElement) {
                    cite.parentElement.appendChild(cacheDiv);
                }
            }
        });
    });
})();

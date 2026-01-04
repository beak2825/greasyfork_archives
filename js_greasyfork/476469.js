// ==UserScript==
// @name         Unshorten t.cn links
// @namespace    https://tcnurl.prvcy.page/
// @version      1.0
// @description  If someone shares a Weibo short link starting with t.cn, but you prefer not to click on it to avoid being tracked by Weibo, you can use this tool to reveal the actual destination URL that the Weibo short link redirects to. This tool uses our server to access the t.cn Weibo short link on your behalf and automatically follows multiple redirects to find the underlying real link. It also attempts to clean up some basic tracking link parameters using simple rules.
// @author       O3O.Foundation
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476469/Unshorten%20tcn%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/476469/Unshorten%20tcn%20links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function replaceTcnLinks() {
        const tcnLinks = document.querySelectorAll('a[href^="http://t.cn/"], a[href^="https://t.cn/"]');
        tcnLinks.forEach((link) => {
            const originalUrl = link.getAttribute('href');
            const suffix = originalUrl.split('/').pop();
            const newUrl = `https://tcnurl.prvcy.page/tcn-redirect.php?suffix=${suffix}`;
            link.setAttribute('href', newUrl);
            link.setAttribute('rel', 'nofollow noopener noreferrer');
            link.style.backgroundColor = '#dbffb0';
        });
    }

    // Replace t.cn links on initial page load
    replaceTcnLinks();

    // Replace t.cn links when new content is added dynamically
    const observer = new MutationObserver(replaceTcnLinks);
    observer.observe(document.body, { childList: true, subtree: true });
})();

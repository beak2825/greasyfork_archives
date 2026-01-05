// ==UserScript==
// @name        reddit: redirect mobile links to desktop
// @namespace   mailto:morten.with@gmail.com
// @locale      en
// @include     *m.reddit.com*
// @version     0.2
// @run-at      document-start
// @grant       none
// @description redirects mobile reddit links to desktop reddit links
// @downloadURL https://update.greasyfork.org/scripts/22498/reddit%3A%20redirect%20mobile%20links%20to%20desktop.user.js
// @updateURL https://update.greasyfork.org/scripts/22498/reddit%3A%20redirect%20mobile%20links%20to%20desktop.meta.js
// ==/UserScript==

(function()
{
'use strict';

document.location.replace(document.location.href.replace('://m.', '://'));
})();

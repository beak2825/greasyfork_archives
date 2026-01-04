// ==UserScript==
// @name                Reddit Never NP
// @name:en-us          Reddit Never NP
// @namespace           redditnp
// @include             http://www.np.reddit.com/r/*
// @include             http://np.reddit.com/r/*
// @include             https://www.np.reddit.com/r/*
// @include             https://np.reddit.com/r/*
// @version             1.4
// @run-at              document-start
// @description         Redirect from No-participation reddit urls to actual reddit urls
// @description:en-us   Redirect from No-participation reddit urls to actual reddit urls

// @downloadURL https://update.greasyfork.org/scripts/30900/Reddit%20Never%20NP.user.js
// @updateURL https://update.greasyfork.org/scripts/30900/Reddit%20Never%20NP.meta.js
// ==/UserScript==

document.location.replace(document.location.href.replace('://www.np.', '://www.').replace('://np.', '://www.'));
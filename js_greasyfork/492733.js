// ==UserScript==
// @name               Google Search’s Supported Domains
// @description        Makes the list of Google Search’s supported domains available as the global variable “window.SUPPORTED_DOMAINS”.
// @icon               https://wsrv.nl/?url=https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.0.1
// @license            MIT
// @match              https://www.google.com/supported_domains
// @run-at             document-end
// @inject-into        page
// @grant              none
// @require            https://update.greasyfork.org/scripts/492742/1361711/google-search-supported-domains.js
// @supportURL         https://greasyfork.org/scripts/492733/feedback
// @downloadURL https://update.greasyfork.org/scripts/492733/Google%20Search%E2%80%99s%20Supported%20Domains.user.js
// @updateURL https://update.greasyfork.org/scripts/492733/Google%20Search%E2%80%99s%20Supported%20Domains.meta.js
// ==/UserScript==

if (GM.info.scriptHandler === "Greasemonkey")
{
    cloneInto(SUPPORTED_DOMAINS, window);
}
else
{
    window.SUPPORTED_DOMAINS = SUPPORTED_DOMAINS;
}

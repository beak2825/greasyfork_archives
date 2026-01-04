// ==UserScript==
// @name               Google Search Result’s “@match” URLs
// @description        “@match” URLs for user scripts that execute on Google Search’s result page.
// @icon               https://wsrv.nl/?url=https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.0.1
// @license            MIT
// @match              https://www.google.com/supported_domains
// @run-at             document-end
// @inject-into        page
// @grant              GM.registerMenuCommand
// @grant              GM.setClipboard
// @require            https://update.greasyfork.org/scripts/492742/1361711/google-search-supported-domains.js
// @supportURL         https://greasyfork.org/scripts/492743/feedback
// @downloadURL https://update.greasyfork.org/scripts/492743/Google%20Search%20Result%E2%80%99s%20%E2%80%9C%40match%E2%80%9D%20URLs.user.js
// @updateURL https://update.greasyfork.org/scripts/492743/Google%20Search%20Result%E2%80%99s%20%E2%80%9C%40match%E2%80%9D%20URLs.meta.js
// ==/UserScript==

const metadata = SUPPORTED_DOMAINS
    .map((d) => `// @match              https://www${d}/search?*`)
    .join("\n");

GM.registerMenuCommand("Copy the Generated Metadata", () =>
{
    setTimeout(() =>
    {
        GM.setClipboard(metadata, "text/plain");
        alert("Copied the generated metadata to clipboard.");
    }, 0);
});

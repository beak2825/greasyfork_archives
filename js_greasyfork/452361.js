// ==UserScript==
// @name        Bing to Google Auto Redirect
// @author      Tyler
// @namespace   https://greasyfork.org/en/scripts/452361-bing-to-google-auto-redirect
// @license     MIT
// @icon        https://www.google.com/favicon.ico
// @description This will redirect you from Bing to Google always. Useful for various hard coded links in windows 10/11 that always use bing even if you set your search engine to google.
// @match       https://www.bing.com/search*
// @version     1.01
// @grant       none
// @noframes
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/452361/Bing%20to%20Google%20Auto%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/452361/Bing%20to%20Google%20Auto%20Redirect.meta.js
// ==/UserScript==
window.setTimeout(doRedirect, 300);

function doRedirect()
{
const query = location.href.replace(/.*?(\?|&)(q=.*?)(\?|&|$).*/, '$2')
location.href = `https://www.google.com/search?${query}`;
}
// ==UserScript==
// @name           Replace Chrome New Tab
// @version        1.1.1
// @namespace      replacechromenewtab
// @run-at         document-start
// @grant          GM_openInTab
// @match          https://www.google.com/_/chrome/newtab*
// @description Replaces Chrome 33 New Tab with apps list page
// @downloadURL https://update.greasyfork.org/scripts/105/Replace%20Chrome%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/105/Replace%20Chrome%20New%20Tab.meta.js
// ==/UserScript==

GM_openInTab("chrome://apps/");
window.close();
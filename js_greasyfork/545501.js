// ==UserScript==
// @name         Bypass Paywall Skip
// @namespace    vncsmnl.paywallskip
// @version      1.0.0
// @description  Adds a context menu option to bypass an article's paywall.
// @author       vncsmnl
// @license      MIT
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/545501/Bypass%20Paywall%20Skip.user.js
// @updateURL https://update.greasyfork.org/scripts/545501/Bypass%20Paywall%20Skip.meta.js
// ==/UserScript==

GM_registerMenuCommand("Replace Current Tab", () => {
  window.location.href = 'https://www.paywallskip.com/article?url=' + encodeURIComponent(window.location.href);
}, "u");

GM_registerMenuCommand("New Tab", () => {
  GM_openInTab('https://www.paywallskip.com/article?url=' + encodeURIComponent(window.location.href), { active: true });
});

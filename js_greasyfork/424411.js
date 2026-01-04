// ==UserScript==
// @name         Google - auto-set privacy/GDPR consent cookie (prevent consent popup)
// @version      21.04.1
// @description  Sets a cookie that announces to Google that consent has been given to their privacy guidelines, thus preventing the consent popup
// @author       squarewf
// @namespace    https://github.com/squarewf
// @match        https://*.google.*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424411/Google%20-%20auto-set%20privacyGDPR%20consent%20cookie%20%28prevent%20consent%20popup%29.user.js
// @updateURL https://update.greasyfork.org/scripts/424411/Google%20-%20auto-set%20privacyGDPR%20consent%20cookie%20%28prevent%20consent%20popup%29.meta.js
// ==/UserScript==

if (!document.cookie.match("(^|;)\\s*CONSENT=YES\\+")) {
  document.cookie="CONSENT=YES+;domain=" + window.location.host.match("\.google\..+$")[0];
}
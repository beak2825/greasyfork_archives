// ==UserScript==
// @name        Windwos IT Pro Force English
// @include     /^https?://(docs|msdn|technet|support|developer)\.microsoft\.com/[a-z]{2}-[a-z]{2}//
// @include     /^https?://support.office.com/[a-z]{2}-[a-z]{2}//
// @run-at      document-start
// @icon        https://www.microsoft.com/favicon.ico
// @grant       none
// @version     2.0
// @description Redirects to english version of MSDN, TechNet, Microsoft Support, etc.
// @author      RoundRobin
// @namespace https://greasyfork.org/users/97514
// @downloadURL https://update.greasyfork.org/scripts/26834/Windwos%20IT%20Pro%20Force%20English.user.js
// @updateURL https://update.greasyfork.org/scripts/26834/Windwos%20IT%20Pro%20Force%20English.meta.js
// ==/UserScript==

if (!window.location.pathname.startsWith('/en-us')
    && window.location.search.indexOf("language=force") == -1) {
  window.location.pathname = window.location.pathname.replace(/\/(\w{2}-\w{2})\//, "/en-us/");
}
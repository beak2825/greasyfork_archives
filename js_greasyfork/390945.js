// ==UserScript==
// @name         UI Close Tab after Print
// @version      1.1
// @description  Automatically close Print Label prompts
// @match        https://urbaninspirations.biz/cbms-scanners/scanners/print2-1.php?id=*
// @grant        window.close
// @namespace https://greasyfork.org/users/228706
// @downloadURL https://update.greasyfork.org/scripts/390945/UI%20Close%20Tab%20after%20Print.user.js
// @updateURL https://update.greasyfork.org/scripts/390945/UI%20Close%20Tab%20after%20Print.meta.js
// ==/UserScript==

 setTimeout(function () { window.focus(); }, 3000);
        window.onfocus = function () { setTimeout(function () { window.close(); }, 3000); }
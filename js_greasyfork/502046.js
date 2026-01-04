// ==UserScript==
// @name         testLogger
// @namespace    http://ester.net/
// @version      2024-05-28
// @description  lets go!
// @author       You
// @match        http://*/*
// @match        https://*/*
// @license      MIT
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_getTab
// @grant        GM_getTabs
// @downloadURL https://update.greasyfork.org/scripts/502046/testLogger.user.js
// @updateURL https://update.greasyfork.org/scripts/502046/testLogger.meta.js
// ==/UserScript==

var wrongStatusCode;
var reqTimer;

var myURL = decodeURIComponent(window.location.href);
alert(myURL);
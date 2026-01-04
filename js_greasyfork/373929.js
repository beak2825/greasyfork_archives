// ==UserScript==
// @name         ZippyShare Auto Download
// @namespace    https://greasyfork.org/en/users/223360
// @version      1.0.2
// @description  Auto download files from zippyshare
// @author       Zennar
// @match        *://*.zippyshare.com/*
// @grant        none
// @icon         https://zippyshare.com/images/favicon.ico
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/373929/ZippyShare%20Auto%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/373929/ZippyShare%20Auto%20Download.meta.js
// ==/UserScript==

var xDL = document.getElementById('dlbutton');
if (xDL) {
   //document.location.href = xDL.href;
   xDL.click();
}

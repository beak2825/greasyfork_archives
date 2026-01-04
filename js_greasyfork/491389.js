// ==UserScript==
// @name         oaclose-ejy365
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try!
// @author       You
// @match        https://oa.ejy365.com/workflow/workflowDesign/readOnly-index.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491389/oaclose-ejy365.user.js
// @updateURL https://update.greasyfork.org/scripts/491389/oaclose-ejy365.meta.js
// ==/UserScript==

function closeoa() {
 var Browser = navigator.appName;
 var indexB = Browser.indexOf('Explorer');

 if (indexB > 0) {
    var indexV = navigator.userAgent.indexOf('MSIE') + 5;
    var Version = navigator.userAgent.substring(indexV, indexV + 1);

    if (Version >= 7) {
        window.open('', '_self', '');
        window.close();
    }
    else if (Version == 6) {
        window.opener = null;
        window.close();
    }
    else {
        window.opener = '';
        window.close();
    }

 }
else {
    window.close();
 }
}
closeoa() ;
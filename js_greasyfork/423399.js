// ==UserScript==
// @name         Auto Free KR Krunker Spinner
// @version      1
// @description  Auto clicking 'Claim KR'
// @author       M1CRO RAVE
// @match         *://krunker.io/*
// @exclude       *://krunker.io/editor*
// @exclude       *://krunker.io/social*
// @run-at        document-start
// @grant         none
// @noframes
// @namespace https://greasyfork.org/users/548266
// @downloadURL https://update.greasyfork.org/scripts/423399/Auto%20Free%20KR%20Krunker%20Spinner.user.js
// @updateURL https://update.greasyfork.org/scripts/423399/Auto%20Free%20KR%20Krunker%20Spinner.meta.js
// ==/UserScript==

setTimeout(function () {
        document.elementFromPoint(760, 390).click();
    }, 20000);

setTimeout(function () {
        document.elementFromPoint(760, 390).click();
    }, 60000);

function refresh() {    
    setTimeout(function () {
        location.reload()
    }, 3600000);
}

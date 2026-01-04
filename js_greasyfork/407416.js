// ==UserScript==
// @name         Jump New Laravel Document
// @description  Go to the latest version of the documentation page
// @namespace    https://github.com/nathurru
// @version      8.1
// @author       nathurru
// @match        https://readouble.com/laravel/*
// @match        https://laravel.com/*
// @match        https://lumen.laravel.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407416/Jump%20New%20Laravel%20Document.user.js
// @updateURL https://update.greasyfork.org/scripts/407416/Jump%20New%20Laravel%20Document.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let targetVersion = '8.x';

    let referrerUrl = document.referrer;
    let locationUrl = location.href;

    let versionReg = new RegExp(/(\d+\.[\dx]+)/);
    let referrerReg = new RegExp(/(laravel.com)|(readouble.com)/);

    if (!referrerReg.test(referrerUrl)) {
        let ret = (versionReg.exec(locationUrl));
        if(ret !== null){
            let currentVersion = ret[1];
            if (targetVersion !== currentVersion) {
                location.href = locationUrl.replace(versionReg, targetVersion);
            }
        }
    }
})();

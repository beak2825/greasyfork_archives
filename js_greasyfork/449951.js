// ==UserScript==
// @name         Dy2018Unlocker
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  show download url for www.dy2018.com
// @author       You
// @match        https://www.dy2018.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449951/Dy2018Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/449951/Dy2018Unlocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(() => {
        document.getElementById('downlist').style = '';
        document.querySelectorAll('#downlist table a').forEach(a => {
            a.innerHTML = decodeURIComponent(a.href);
        });
    }, 2000);

})();
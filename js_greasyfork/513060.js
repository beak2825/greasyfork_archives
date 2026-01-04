// ==UserScript==
// @name         Open in XREF
// @namespace    http://tampermonkey.net/
// @version      2024-10-18
// @description  Add a floating button to open the current URL on XREF
// @author       二次蓝
// @match        https://cs.android.com/android/platform/superproject/main/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513060/Open%20in%20XREF.user.js
// @updateURL https://update.greasyfork.org/scripts/513060/Open%20in%20XREF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const button = document.createElement('button');
    button.textContent = '在XREF上打开';
    button.style.position = 'fixed';
    button.style.bottom = '45px';
    button.style.right = '20px';
    button.style.zIndex = '9999';
    button.style.padding = '10px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';


    button.addEventListener('click', function() {
        const currentUrl = window.location.href;
        const xrefUrl = getXrefUrl(currentUrl);

        if (xrefUrl) {
            window.open(xrefUrl, '_blank');
        } else {
            alert('无法计算XREF URL');
        }
    });


    document.body.appendChild(button);

    function getXrefUrl(url) {
        const regex = /\/main\/\+\/(?:main|[a-f0-9]+):(.+?(?:\.java|\.h|\.cpp|\.aidl))/;
        const match = url.match(regex);

        if (match && match[1]) {
            const filePath = match[1];
            return `http://aospxref.com/android-14.0.0_r2/xref/${filePath}`;
        }

        return null;
    }
})();
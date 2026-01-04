// ==UserScript==
// @name    DELTA BYPASS UNPATCHED
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  DeltaBypass
// @author       A_Q
// @match        https://loot-link.com/s?*
// @match        https://gateway.platoboost.com/a/8?id=*
// @license      A_Q
// @grant        none         
// @downloadURL https://update.greasyfork.org/scripts/512786/DELTA%20BYPASS%20UNPATCHED.user.js
// @updateURL https://update.greasyfork.org/scripts/512786/DELTA%20BYPASS%20UNPATCHED.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const urlnow = window.location.href;
    function isBase64(str) {
        try {
            if (typeof str !== 'string' || str.length === 0) return false;
            const base64Pattern = /^[A-Za-z0-9+/=]+$/;
            if (!base64Pattern.test(str)) return false;
            const decodedStr = atob(str);
            return btoa(decodedStr) === str;
        } catch (e) {
            return false;
        }
    }

    function getParameterByName(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    const lutink = false;
    const base64String = getParameterByName('r');
    if (base64String && isBase64(base64String)) {
        try {
            const decodedUrl = atob(base64String);
            window.location.href = decodedUrl;
            
        } catch (error) {
            console.error('Error\n', error)
        }
    }
})();
// ==UserScript==
// @name         LC Fix
// @namespace    http://tampermonkey.net/
// @version      0.3
// @license      WTFPL
// @description  LC Fix Script
// @author       asdasdasjkdahwdi2a8
// @match        https://lucid.app/lucidchart/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439923/LC%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/439923/LC%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const lc_exp = /(function )([a-zA-Z0-9_]+)(\([a-z,=\d]+\)\{return 0<[a-z]&&[a-z]\.)/m;

    window.addEventListener('load', function() {
        console.log('[LCF] Starting');
        const script_url = document.querySelector('script[src*="b245bf49906e3a17c3caf6fb0db9b4e75fb66af3b23ef0484baa36f5b46d18"]').src
        console.log('[LCF] Script URL: ' + script_url);

        $.ajax({
            url: script_url,
            cache: true,
            context: document.body,
            crossDomain: true,
            dataType: 'text',
            global: false
        }).done(function(resp) {
            console.log('[LCF] Response length: ' + resp.length);
            const lc_match = resp.match(lc_exp);
            console.log('[LCF] Match:');
            console.log(lc_match)

            window[lc_match[2]] = function() {return false;};

            console.log('[LCF] Job done')
        });
    }, false);
})();
// ==UserScript==
// @name         Beam Pro AdBlock Check Removal
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Use AdBlock on Beam Pro and still earn points! (I'm a scumbag I'm sorry)
// @author       https://twitter.com/BitOBytes
// @match        *://*beam.pro/*
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21710/Beam%20Pro%20AdBlock%20Check%20Removal.user.js
// @updateURL https://update.greasyfork.org/scripts/21710/Beam%20Pro%20AdBlock%20Check%20Removal.meta.js
// ==/UserScript==

function check() {
    if (document.readyState == "complete" || document.readyState == "interactive") {
        $('script[src]').each(function (i) {
            var script = $(this);
            if (script.attr('src').indexOf('/_latest/js/beam.js') > -1) {
                console.log('[AdBlock Check Removal] Found script: [src=' + script.attr('src') + '] | Index: ' + i);
                console.log('[AdBlock Check Removal] Downloading script...');
                $.ajax({
                    method: 'GET',
                    dataType: 'text',
                    url: 'https://beam.pro' + script.attr('src')
                }).then(function (data) {
                    console.log('[AdBlock Check Removal] Setting script[src] to Null');
                    script.attr('src', '');
                    console.log('[AdBlock Check Removal] Disabling AdBlock check');
                    data = data.replace('t.get().beam.adblockEnabled="adblock"===b;', 't.get().beam.adblockEnabled=!1;');
                    script.html(data);
                });
            }
        });
        return;
    }
    setTimeout(check, 50);
}

(function() {
    'use strict';

    check();
})();
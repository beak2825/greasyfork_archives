// ==UserScript==
// @name         Nexus Clash Speedy Safe (B4)
// @namespace    https://roadha.us
// @version      1.0.5
// @description  Remembers your selections in the faction safe/footlocker dropdowns
// @author       haliphax
// @match        https://nexusclash.com/modules.php?name=Game*
// @match        https://www.nexusclash.com/modules.php?name=Game*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/399179/Nexus%20Clash%20Speedy%20Safe%20%28B4%29.user.js
// @updateURL https://update.greasyfork.org/scripts/399179/Nexus%20Clash%20Speedy%20Safe%20%28B4%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // constants
    var formNames = ['footlockergrab', 'safestock'];

    // GreaseMonkey/TamperMonkey saved data
    var saved = JSON.parse(GM_getValue('saved', '[]'));

    // save selected dropdown index on submit
    function onSubmit(idx, e) {
        var options = this.querySelectorAll('select[name="item"] option');

        for (var j = 0; j < options.length; j++) {
            if (!options[j].selected) continue;

            saved[idx] = j;
            break;
        }

        GM_setValue('saved', JSON.stringify(saved));
    }

    var forms = document.querySelectorAll('form'),
        primer = (saved.length === 0),
        idx = 0;

    for (var i = 0; i < forms.length; i++) {
        var f = forms[i];

        if (formNames.indexOf(f.name) < 0) continue;

        // add onsubmit event handler for each safe/footlocker button
        f.addEventListener('submit', onSubmit.bind(f, idx));

        if (primer) {
            // first run, prime data
            saved.push(null);
            idx++;
            continue;
        }
        else if (saved[idx] === null) {
            // no value yet, skip
            idx++;
            continue;
        }

        var opts = f.querySelectorAll('select[name="item"] option'),
            value = saved[idx];

        if (opts.length <= value) {
            // dropdown length is shorter than saved index, clear it out
            saved[idx++] = null;
            continue;
        }

        // set dropdown to saved value
        opts[value].selected = true;
        idx++;
    }
})();
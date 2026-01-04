// ==UserScript==
// @name         Entity Manager - Quick Compare/Merge
// @namespace    http://tampermonkey.net/
// @version      BETA_2024.12.02.4
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idaho.gov
// @description  Provides quick access to compare/merge person records
// @author       Vance M. Allen, Idaho State Board of Education
// @match        https://apps2.sde.idaho.gov/EntityManager/Person/Find
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512654/Entity%20Manager%20-%20Quick%20CompareMerge.user.js
// @updateURL https://update.greasyfork.org/scripts/512654/Entity%20Manager%20-%20Quick%20CompareMerge.meta.js
// ==/UserScript==

/* globals $ */
(function main() {
    'use strict';
    let APP = 'Quick Compare/Merge';
    let VERSION = '2024.12.02.4';
    let TEMPLATE = `<h2>${APP} v${VERSION}</h2>
    <div class="row">
        <div class="col-xs-10">
            These may be typed or pasted:
        </div>
    </div>
    <div class="row">
        <div class="col-xs-10">
            EDUID 1:
            <input type="text" id="eduid1" class="quick" size="10" maxlength="9">
        </div>
    </div>
    <div class="row">
        <div class="col-xs-10">
            EDUID 2:
            <input type="text" id="eduid2" class="quick" size="10" maxlength="9">
        </div>
    </div>
    <div class="row">
        <div class="col-xs-10">
            or
        </div>
    </div>
    <div class="row">
        <div class="col-xs-10">
            Two EDUIDs (Pasted from Spreadsheet or Dedup Site)
            <input type="text" id="eduidBoth" class="quick" size="20" maxlength="19">
        </div>
    </div>`;

    let log = function(...a) {
        // Due to strict mode, this is necessary to be able to get at the calling function name.
        let callingFunction;
        try {
            throw new Error();
        }
        catch(e) {
            callingFunction = e.stack.split('at ')[2].split(' ')[0];
            if(callingFunction.indexOf('<anonymous>')>-1) console.debug(e.stack);
        }

        // Determine logType by checking first parameter to see if it's a logType. If not, assume "debug".
        const logType = ['log','info','warn','error','debug'].includes(a[0]) ? a[0] : 'debug';

        // If the first parameter is the logType, take it out of the array of things to log.
        if(a[0] === logType) a.shift();

        // Log to console using the logType including notation for app and version.
        console[logType](`[${APP} v${VERSION} - ${callingFunction}()]`,...a);
    };

    // Log to console that the script has started.
    log('warn','Initialized.');

    // Insert the template onto the Find Person page.
    $('#main-content div.container-fluid').append(TEMPLATE);

    // Event handlers for Quick Compare/Merge
    $('input.quick').on('keypress paste',function(e) {
        let both = e.target.id === 'eduidBoth';
        let $eduid1 = $('#eduid1');
        let $eduid2 = $('#eduid2');
        let $eduidBoth = $('#eduidBoth');
        let paste = e.type === 'paste';

        if(paste) {
            // Retrieve pasted data, trimmed for whitespace.
            let pasteData = e.originalEvent.clipboardData.getData('text/plain').trim();

            // Test for valid EDUID, update input if valid.
            let pattern = both ? /[\s\S]*?(\d{9})[\s\S]+?(\d{9})$/ : /^\d{9}$/;
            if(pattern.test(pasteData)) e.target.value = pasteData;
        }
        else {
            // If user pressed anything but a digit, it's no good.
            // If user is typing directly into the "both" box, that's also no good.
            if(!/\d/.test(e.key) || both) return false;
        }

        // Wait until this function ends, then do some validation.
        setTimeout(() => {
            // Check if EDUID 1 and 2 are the same. If so, blank 2.
            if($eduid1.val() === $eduid2.val()) $eduid2.val('');

            if(
                // If EDUIDs 1 and 2 are both valid, move to the PersonMerge page.
                (
                    /^\d{9}$/.test($eduid1.val()) &&
                    /^\d{9}$/.test($eduid2.val())
                ) ||
                // Or, if both EDUIDs are presented and valid...
                both && /[\s\S]*?(\d{9})[\s\S]+?(\d{9})$/.test($eduidBoth.val())
            ) {
                $('body:first').css('overflow','hidden').append(
                    `<style>
                        .loadingSpinner {
                            border: 16px solid #f3f3f3;
                            border-left: 16px solid #3498db;
                            border-top: 16px solid #3498db;
                            border-radius: 50%;
                            position: fixed;
                            top: 45vh; left: 45vw;
                            height: 120px; width: 120px;
                            animation: spin 1s linear infinite;
                            z-index: 30000;
                        }
                        .loadingSpinner + div {
                            background: color-mix(in srgb, gray, transparent 50%);
                            position: fixed;
                            top: 0;
                            left: 0;
                            height: 100%; width: 100%;
                            z-index: 20000;
                        }
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    </style>
                    <div id="vmaLoading" class="loadingSpinner"></div><div></div>`
                );

                if(both) {
                    // Not sure why, but the Merge Tool puts the first EDUID in the second position,
                    // so adjusting accordingly. Leading comma in brackets is intentional.
                    let [,eduid2,eduid1] = $eduidBoth.val().match(/[\s\S]*?(\d{9})[\s\S]+?(\d{9})/);
                    window.location.href = `/EntityManager/PersonMerge?eduId1=${eduid1}&eduId2=${eduid2}`;
                }
                else {
                    window.location.href = `/EntityManager/PersonMerge?eduId1=${$eduid2.val()}&eduId2=${$eduid1.val()}`;
                }
            }
        });

        // Prevent paste operation from going through.
        if(paste) return false;
    });
})();
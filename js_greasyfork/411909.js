// ==UserScript==
// @name        Melvor Idle - Timestamped Saves
// @description Adds character name and a timestamp to the default filename when downloading a save
// @version     2.10
// @namespace   Visua
// @match       https://melvoridle.com/*
// @match       https://www.melvoridle.com/*
// @match       https://test.melvoridle.com/*
// @require     https://cdnjs.cloudflare.com/ajax/libs/pako/1.0.11/pako.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/411909/Melvor%20Idle%20-%20Timestamped%20Saves.user.js
// @updateURL https://update.greasyfork.org/scripts/411909/Melvor%20Idle%20-%20Timestamped%20Saves.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

((main) => {
    var script = document.createElement('script');
    script.textContent = `try { (${main})(); } catch (e) { console.log(e); }`;
    document.body.appendChild(script).parentNode.removeChild(script);
})(() => {
    'use strict';

    function replaceDownloadSave() {
        const _downloadSave = downloadSave;
        downloadSave = (backup = false) => {
            let saveString;
            try {
                if (!backup) {
                    saveString = getSave();
                } else {
                    saveString = backupSave;
                }
                const save = JSON.parse(pako.ungzip(atob(saveString), { to: 'string' }));
                if (Object.keys(save).length < 3) {
                    throw new Error('Save might not contain any data');
                }
            } catch (e) {
                console.error('Melvor Idle - Timestamped Saves:', e);
                if (typeof saveString !== 'undefined') {
                    console.error('Melvor Idle - Timestamped Saves: Save has unexpected format:', saveString);
                }
                _downloadSave();
                return;
            }

            const file = new Blob([saveString], { type: 'text/plain' });
            const filename = `melvoridlesave - ${username} - ${timestamp()}.txt`;
            if (window.navigator.msSaveOrOpenBlob)
                window.navigator.msSaveOrOpenBlob(file, filename); // IE10+
            else {
                const a = document.createElement('a');
                const url = URL.createObjectURL(file);
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                setTimeout(function () {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 100);
            }
        };

        function timestamp() {
            const date = new Date();
            return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} `
                + `${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}`;
        }

        function pad(n) {
            return n < 10 ? `0${n}` : n;
        }
    }

    function loadScript() {
        if (typeof confirmedLoaded !== 'undefined' && confirmedLoaded) {
            clearInterval(interval);
            console.log('Loading Timestamped Saves');
            replaceDownloadSave();
            $('#header-user-options-dropdown .dropdown-divider:first').before('<a class="dropdown-item d-flex align-items-center justify-content-between pointer-enabled" onclick="downloadSave();"><span>Download Save</span></a>');
        }
    }

    const interval = setInterval(loadScript, 500);
});

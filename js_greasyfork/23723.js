// ==UserScript==
// @name             Waze Edit & UR Count Monitor
// @version         2.5
// @description     Displays your daily edit count in the WME toolbar.  Warns if you might be throttled. Based on MapOMatic Edit Count
// @author          Crotalo
// @include         /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require         https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @require         https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js

// @grant           GM_xmlhttpRequest
// @grant           GM_addElement
// @connect         www.waze.com

// @namespace https://greasyfork.org/en/users/45389-mapomatic
// @downloadURL https://update.greasyfork.org/scripts/23723/Waze%20Edit%20%20UR%20Count%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/23723/Waze%20Edit%20%20UR%20Count%20Monitor.meta.js
// ==/UserScript==

/* global W */
/* global toastr */
/* global WazeWrap */


(function main() {
    'use strict';

    
    // This function is injected into the page to allow it to run in the page's context.
    function wecmInjected() {
        const TOASTR_URL = 'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.js';
        const TOASTR_SETTINGS = {
            remindAtEditCount: 100,
            warnAtEditCount: 150,
            wasReminded: false,
            wasWarned: false
        };
        const TOOLTIP_TEXT = 'Ediciones Diarias y URs Históricas.  Click para abrir Perfil';

        let _$outputElem = null;
        let _$outputElemContainer = null;
        let _lastEditCount = null;
        let _userName = null;
        let _savesWithoutIncrease = 0;
        let _lastURCount = null;
        let _lastMPCount = null;

        function log(message) {
            console.log('Edit Count Monitor:', message);
        }

        function checkEditCount() {
            window.postMessage(JSON.stringify(['wecmGetCounts', _userName]), '*');
            TOASTR_SETTINGS.wasReminded = false;
            TOASTR_SETTINGS.wasWarned = false;
            toastr.remove();
        }

        function updateEditCount(editCount, urCount, purCount, mpCount, noIncrement) {
            // Add the counter div if it doesn't exist.
            if ($('#wecm-count').length === 0) {
                _$outputElemContainer = $('<div>', { class: 'toolbar-button', style: 'font-weight: bold; font-size: 16px; border-radius: 10px; margin-left: 4px;' });
                const $innerDiv = $('<div>', { class: 'item-container', style: 'padding-left: 10px; padding-right: 10px; cursor: default;' });
                _$outputElem = $('<a>', {
                    id: 'wecm-count',
                    href: `https://www.waze.com/user/editor/${_userName.toLowerCase()}`,
                    target: '_blank',
                    style: 'text-decoration:none',
                    'data-original-title': TOOLTIP_TEXT
                });
                $innerDiv.append(_$outputElem);
                _$outputElemContainer.append($innerDiv);
                if ($('#toolbar > div > div.secondary-toolbar > div.secondary-toolbar-actions > div.secondary-toolbar-actions-edit').length) {
                    // Production WME, as of 4/25/2023
                    $('#toolbar > div > div.secondary-toolbar > div.secondary-toolbar-actions > div.secondary-toolbar-actions-edit').after(_$outputElemContainer);
                } else {
                    // Beta WME, as of 4/25/2023
                    $('#toolbar > div > div.secondary-toolbar > div:nth-child(1)').after(_$outputElemContainer);
                }
                _$outputElem.tooltip({
                    placement: 'auto top',
                    delay: { show: 100, hide: 100 },
                    html: true,
                    template: '<div class="tooltip" role="tooltip" style="opacity:0.95"><div class="tooltip-arrow"></div>'
                        + '<div class="my-tooltip-header" style="display:block;"><b></b></div>'
                        + '<div class="my-tooltip-body tooltip-inner" style="display:block;  !important; min-width: fit-content"></div></div>'
                });
            }

            // log('edit count = ' + editCount + ', UR count = ' + urCount.count);
            if (_lastEditCount !== editCount || _lastURCount.count !== urCount.count || _lastMPCount.count !== mpCount.count) {
                _savesWithoutIncrease = 0;
            } else if (!noIncrement) {
                _savesWithoutIncrease++;
            }

            let textColor;
            let bgColor;
            let tooltipTextColor;
            if (_savesWithoutIncrease < 5) {
                textColor = '#354148';
                bgColor = 'white';
                tooltipTextColor = 'black';
            } else if (_savesWithoutIncrease < 10) {
                textColor = '#354148';
                bgColor = 'yellow';
                tooltipTextColor = 'black';
            } else {
                textColor = 'white';
                bgColor = 'red';
                tooltipTextColor = 'white';
            }
            _$outputElemContainer.css('background-color', bgColor);
            _$outputElem.css('color', textColor).html('Edits:&nbsp;' + editCount + ',URs:&nbsp;'+ urCount.count);
            const urCountText = `<div style="margin-top:8px;padding:3px;">URs&nbsp;Closed:&nbsp;${urCount.count.toLocaleString()}&nbsp;&nbsp;(since&nbsp;${
                (new Date(urCount.since)).toLocaleDateString()})</div>`;
            const purCountText = `<div style="margin-top:0px;padding:0px 3px;">PURs&nbsp;Closed:&nbsp;${
                purCount.count.toLocaleString()}&nbsp;&nbsp;(since&nbsp;${(
                new Date(purCount.since)).toLocaleDateString()})</div>`;
            const mpCountText = `<div style="margin-top:0px;padding:0px 3px;">MPs&nbsp;Closed:&nbsp;${mpCount.count.toLocaleString()}&nbsp;&nbsp;(since&nbsp;${(
                new Date(mpCount.since)).toLocaleDateString()})</div>`;
            let warningText = '';
            if (_savesWithoutIncrease) {
                warningText = `<div style="border-radius:8px;padding:3px;margin-top:8px;margin-bottom:5px;color:${
                    tooltipTextColor};background-color:${bgColor};">${_savesWithoutIncrease} ${
                    (_savesWithoutIncrease > 1) ? 'consecutive saves' : 'save'} without an increase. ${
                    (_savesWithoutIncrease >= 5) ? '(Are you throttled?)' : ''}</div>`;
            }
            _$outputElem.attr('data-original-title', TOOLTIP_TEXT + urCountText + purCountText + mpCountText + warningText);
            _lastEditCount = editCount;
            _lastURCount = urCount;
            _lastMPCount = mpCount;
        }

        function receiveMessage(event) {
            let msg;
            try {
                msg = JSON.parse(event.data);
            } catch (err) {
                // Do nothing
            }

            if (msg && msg[0] === 'wecmUpdateUi') {
                const editCount = msg[1][0];
                const urCount = msg[1][1];
                const purCount = msg[1][2];
                const mpCount = msg[1][3];
                updateEditCount(editCount, urCount, purCount, mpCount);
            }
        }

        function errorHandler(callback) {
            try {
                callback();
            } catch (ex) {
                console.error('Edit Count Monitor:', ex);
            }
        }

        async function init() {
            _userName = W.loginManager.user.getUsername();
            // Listen for events from sandboxed code.
            window.addEventListener('message', receiveMessage);
            // Listen for Save events.

            $('head').append(
                $('<link/>', {
                    rel: 'stylesheet',
                    type: 'text/css',
                    href: 'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.css'
                }),
                $('<style type="text/css">#toast-container {position: absolute;} #toast-container > div {opacity: 0.95;} .toast-top-center {top: 30px;}</style>')
            );
            await $.getScript(TOASTR_URL);
            toastr.options = {
                target: '#map',
                timeOut: 9999999999,
                positionClass: 'toast-top-right',
                closeOnHover: false,
                closeDuration: 0,
                showDuration: 0,
                closeButton: true
                // preventDuplicates: true
            };
            W.model.actionManager.events.register('afterclearactions', null, () => errorHandler(checkEditCount));

            // Update the edit count first time.
            checkEditCount();
            log('Initialized.');
        }

        function bootstrap() {
            if (W && W.loginManager && W.loginManager.events && W.loginManager.events.register && W.map && W.loginManager.user) {
                log('Initializing...');
                init();
            } else {
                log('Bootstrap failed. Trying again...');
                setTimeout(bootstrap, 1000);
            }
        }

        bootstrap();
    }

    // Code that is NOT injected into the page.
    // Note that jQuery may or may not be available, so don't rely on it in this part of the script.

    function getEditCountFromProfile(profile) {
        const { editingActivity } = profile;
        return editingActivity[editingActivity.length - 1];
    }

    function getEditCountByTypeFromProfile(profile, type) {
        const edits = profile.editsByType.find(editsEntry => editsEntry.key === type);
        return edits ? edits.value : -1;
    }

    // Handle messages from the page.
    function receivePageMessage(event) {
        let msg;
        try {
            msg = JSON.parse(event.data);
        } catch (err) {
            // Ignore errors
        }

        if (msg && msg[0] === 'wecmGetCounts') {
            const userName = msg[1];
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://www.waze.com/Descartes/app/UserProfile/Profile?username=${userName}`,
                onload: res => {
                    const profile = JSON.parse(res.responseText);
                    window.postMessage(JSON.stringify(['wecmUpdateUi', [
                        getEditCountFromProfile(profile),
                        getEditCountByTypeFromProfile(profile, 'mapUpdateRequest'),
                        getEditCountByTypeFromProfile(profile, 'venueUpdateRequest'),
                        getEditCountByTypeFromProfile(profile, 'machineMapProblem')
                    ]]), '*');
                }
            });
        }
    }

    function waitForWazeWrap() {
        return new Promise(resolve => {
            function loopCheck(tries = 0) {
                if (WazeWrap.Ready) {
                    resolve();
                } else if (tries < 1000) {
                    setTimeout(loopCheck, 200, ++tries);
                }
            }
            loopCheck();
        });
    }

    async function loadScriptUpdateMonitor() {
        let updateMonitor;
        await waitForWazeWrap();
        try {
            updateMonitor = new WazeWrap.Alerts.ScriptUpdateMonitor(SCRIPT_NAME, SCRIPT_VERSION, DOWNLOAD_URL, GM_xmlhttpRequest);
            updateMonitor.start();
        } catch (ex) {
            // Report, but don't stop if ScriptUpdateMonitor fails.
            console.error(`${SCRIPT_NAME}:`, ex);
        }
    }

    function injectScript() {
        GM_addElement('script', {
            textContent: `${wecmInjected.toString()} \nwecmInjected();`
        });

        // Listen for events coming from the page script.
        window.addEventListener('message', receivePageMessage);
    }

    function mainInit() {
        injectScript();
        loadScriptUpdateMonitor();
    }

    mainInit();
})();

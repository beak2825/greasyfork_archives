// ==UserScript==
// @name         Favro - Toggl Timer
// @namespace    https://www.gotom.io/
// @version      1.23.0
// @license      MIT
// @author       Mike Meier
// @match        https://favro.com/*
// @match        https://api.track.toggl.com/api/*
// @grant        GM.xmlHttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.notification
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @resource     https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css
// @description Start Toggl Timer when viewing a Favro ticket
// @downloadURL https://update.greasyfork.org/scripts/397130/Favro%20-%20Toggl%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/397130/Favro%20-%20Toggl%20Timer.meta.js
// ==/UserScript==
/* jshint esversion: 6 */
(function ($) {
    const style = `
        .favro-toggl-controls {
            position: absolute; 
            top: 12px; 
            left: 50%; 
            color: red;
            z-index:1000;
            display: inline-block;
            cursor: move;
        }
        
        .favro-toggl-controls--content {
            background-color: #f3f7fb;
            box-shadow: 0 2px 8px 0 rgba(0,0,0,.04);
            padding: 5px;
            border-radius: 4px;
            border: 1px solid #D3D3D3;
        }
        
        .favro-toggl-controls--content .fa {
            cursor: pointer;
            margin: 2px;
        }
        
        .favro-toggl-controls--divider {
            padding-left: 10px;
            margin-left: 6px;
            border-left: 1px solid #D3D3D3;
        }
        
        .favro-toggl-controls--recording {
            animation: favro-toggl-pulse 1s cubic-bezier(.5, 0, 1, 1) infinite alternate;  
        }
        
        @keyframes favro-toggl-pulse {
          from { opacity: 1; }
          to { opacity: 0; }
        }
    `;

    const FAVRO_EMAIL_KEY_NAME = 'favro_email';
    const FAVRO_API_KEY_NAME = 'favro_api_key';
    const FAVRO_TICKET_PREFIX_KEY_NAME = 'favro_ticket_prefix';
    const FAVRO_ORGANIZATION_ID_KEY_NAME = 'favro_organization_id';
    const FAVRO_COLUMNS_TO_TRACK_KEY_NAME = 'favro_columns_to_track';
    const FAVRO_PID_CUSTOM_FIELD_ID_KEY_NAME = 'favro_pid_custom_field_id';

    const FAVRO_API_BASE_URL = 'https://favro.com/api/v1';

    const TOGGL_API_KEY_NAME = 'toggl_api_key';
    const TOGGL_WID_KEY_NAME = 'toggl_wid';
    const TOGGL_API_BASE_URL = 'https://api.track.toggl.com/api/v9';

    const UI_POSITION_TOP_KEY_VALUE = 'ui_position_top';
    const UI_POSITION_LEFT_KEY_VALUE = 'ui_position_left';

    const APP_AUTO_TOGGL_KEY_NAME = 'app_auto_toggl';
    const APP_WAIT_BEFORE_TRACKING_KEY_NAME_SECONDS = 'app_wait_before_tracking_seconds';

    const APP_DEFAULT_WAIT_BEFORE_TRACKING = 5000;
    const APP_INTERVAL_FETCH_TOGGL_CURRENT_ENTRY = 15000;
    const APP_INTERVAL_DETECT_OPEN_CARD_CHANGE = 5000;

    const TICKET_NAME_SUFFIX = ' (Auto-Toggl)';

    const ENV_VALUES = [
        FAVRO_EMAIL_KEY_NAME,
        FAVRO_API_KEY_NAME,
        FAVRO_TICKET_PREFIX_KEY_NAME,
        FAVRO_ORGANIZATION_ID_KEY_NAME,
        FAVRO_PID_CUSTOM_FIELD_ID_KEY_NAME,
        FAVRO_COLUMNS_TO_TRACK_KEY_NAME,

        TOGGL_API_KEY_NAME,
        TOGGL_WID_KEY_NAME,

        APP_WAIT_BEFORE_TRACKING_KEY_NAME_SECONDS
    ];

    function start() {
        $.noConflict();
        ensureEnvironmentVariables();
        setupControlsContainer(setupCurrentTimeEntry);

        window.setInterval(setupCurrentTimeEntry, APP_INTERVAL_FETCH_TOGGL_CURRENT_ENTRY);
        window.setInterval(detectOpenCardChanges(onOpenCardChange()), APP_INTERVAL_DETECT_OPEN_CARD_CHANGE);
        window.onbeforeunload = stopTimeEntry;
    }

    async function setupCurrentTimeEntry() {
        GM.xmlHttpRequest({
            method: 'GET',
            url: TOGGL_API_BASE_URL + '/me/time_entries/current',
            headers: await getTogglHeaders(),
            onload: (res) => {
                setCurrentTimeEntry(JSON.parse(res.response));
            }
        });
    }

    let controlsContainer = null;

    function setupControlsContainer(done) {
        $(function () {
            GM_addStyle(style);
            const container = `
                    <div id="favro-toggl-controls" class="favro-toggl-controls">
                        <div class="favro-toggl-controls--content">
                            <i class="fa fa-play-circle" data-favro-toggl-action="start"></i>
                            <i class="fa fa-stop-circle" data-favro-toggl-action="stop"></i>
                            <i class="fa fa-toggle-off favro-toggl-controls--divider" data-favro-toggl-action="toggl-auto"></i> Auto
                            <i class="fa fa-circle" data-recording-button></i>
                            <span data-recording-text></span>
                        </div>
                    </div>
                `;
            //favro-toggl-controls--recording
            $('body').prepend(container);
            controlsContainer = $('#favro-toggl-controls');
            adjustControlsContainerPosition(controlsContainer);

            controlsContainer.on('click', '[data-favro-toggl-action]', (e) => {
                const target = $(e.target);
                switch (target.data('favro-toggl-action')) {
                    case 'start':
                        if (currentOpenCardId) {
                            startTimeEntry(currentOpenCardId, true);
                        }
                        break;
                    case 'stop':
                        stopTimeEntry();
                        break;
                    case 'toggl-auto':
                        if (target.hasClass('fa-toggle-on')) {
                            GM.setValue(APP_AUTO_TOGGL_KEY_NAME, false);
                            target.removeClass('fa-toggle-on').addClass('fa-toggle-off');
                            stopTimeEntry();
                        } else {
                            GM.setValue(APP_AUTO_TOGGL_KEY_NAME, true);
                            target.removeClass('fa-toggle-off').addClass('fa-toggle-on');
                            if (currentOpenCardId) {
                                startTimeEntry(currentOpenCardId, true);
                            }
                        }
                        break;
                }
            });
            controlsContainer.draggable({
                stop: () => {
                    const pos = controlsContainer.position();
                    GM.setValue(UI_POSITION_TOP_KEY_VALUE, pos.top);
                    GM.setValue(UI_POSITION_LEFT_KEY_VALUE, pos.left);
                }
            });

            done();
        });
    }

    async function adjustControlsContainerPosition(controlsContainer) {
        const top = await GM.getValue(UI_POSITION_TOP_KEY_VALUE);
        const left = await GM.getValue(UI_POSITION_LEFT_KEY_VALUE);
        if (top > 0 && left > 0) {
            controlsContainer.css('top', top + 'px');
            controlsContainer.css('left', left + 'px');
        }

        if (await isAutoToggl()) {
            controlsContainer.find('.fa-toggle-off').removeClass('fa-toggle-off').addClass('fa-toggle-on');
        }
    }

    async function isAutoToggl() {
        return await GM.getValue(APP_AUTO_TOGGL_KEY_NAME) === true;
    }

    let currentTimeEntry = null;

    function setCurrentTimeEntry(newCurrentTimeEntry) {
        if ((newCurrentTimeEntry === null && currentTimeEntry === null) || newCurrentTimeEntry && currentTimeEntry && newCurrentTimeEntry.id === currentTimeEntry.id) {
            return;
        }

        currentTimeEntry = newCurrentTimeEntry;
        if (currentTimeEntry) {
            const description = currentTimeEntry.description.substr(0, 20).trim();
            controlsContainer.find('[data-recording-text]').html(description);
            controlsContainer.find('[data-recording-button]').addClass('favro-toggl-controls--recording');
        } else {
            controlsContainer.find('[data-recording-text]').html('');
            controlsContainer.find('[data-recording-button]').removeClass('favro-toggl-controls--recording');
        }
    }

    function updateControlsContainer() {
        if (!controlsContainer) {
            GM.notification({text: 'No controls available'});
            return;
        }
    }

    function ensureEnvironmentVariables() {
        ENV_VALUES.forEach(async key => {
            await GM.getValue(key, '__IS_NOT_SET') !== '__IS_NOT_SET' || GM.setValue(key, prompt(key));
        });
    }

    let currentOpenCardId = null;

    function detectOpenCardChanges(onChange) {
        return async () => {
            const ticketPrefix = await GM.getValue(FAVRO_TICKET_PREFIX_KEY_NAME);
            const regex = new RegExp('\\?card=' + ticketPrefix + '([\\d]+)', 'i');
            let search = new URL(location.href).search;
            let matches = regex.exec(search);
            let openCard = matches === null ? null : parseInt(matches[1]);
            if (openCard !== currentOpenCardId) {
                const oldValue = currentOpenCardId;
                currentOpenCardId = openCard;
                onChange(oldValue, openCard);
            }
        }
    }

    async function beforeSendFavro() {
        const favroToken = await GM.getValue(FAVRO_API_KEY_NAME);
        const email = await GM.getValue(FAVRO_EMAIL_KEY_NAME);
        const organizationId = await GM.getValue(FAVRO_ORGANIZATION_ID_KEY_NAME);

        return (xhr) => {
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(email + ':' + favroToken));
            xhr.setRequestHeader('organizationId', organizationId);
            xhr.setRequestHeader('Content-Type', 'application/json');
        }
    }

    async function getTogglHeaders() {
        const togglToken = await GM.getValue(TOGGL_API_KEY_NAME);

        return {
            'Authorization': 'Basic ' + btoa(togglToken + ':api_token'),
            'Content-Type': 'application/json'
        };
    }

    function getTogglPid(customFields, pidCustomFieldId) {
        if (!customFields) {
            return null;
        }

        let pid = null;
        customFields.forEach(customField => {
            if (customField.customFieldId === pidCustomFieldId) {
                pid = customField.total;
                return true;
            }
        });

        return pid;
    }

    let currentTimeEntryTimoutId = null;

    async function startTimeEntryForCard(card, doDelay) {
        const delay = doDelay ? await getTrackingWaitingTime() : 0;

        currentTimeEntryTimoutId = window.setTimeout(async () => {
            const ticketPrefix = await GM.getValue(FAVRO_TICKET_PREFIX_KEY_NAME);
            const ticketName = ticketPrefix + card.sequentialId;
            const description = ticketName + ' / ' + card.name + TICKET_NAME_SUFFIX;
            const pidCustomFieldId = await GM.getValue(FAVRO_PID_CUSTOM_FIELD_ID_KEY_NAME);
            const wid = parseInt(await GM.getValue(TOGGL_WID_KEY_NAME), 10);
            const pid = getTogglPid(card.customFields, pidCustomFieldId);
            const data = JSON.stringify({
                workspace_id: wid,
                project_id: pid,
                description: description,
                start: new Date().toISOString(),
                duration: -1,
                created_with: 'tampermonkey favro-toggl-timer ' + GM_info.script.version,
            });

            GM.xmlHttpRequest({
                method: 'POST',
                url: TOGGL_API_BASE_URL + '/workspaces/'+ wid +'/time_entries',
                data: data,
                headers: await getTogglHeaders(),
                onload: (res) => {
                    setCurrentTimeEntry(JSON.parse(res.response));
                },
                onerror: (res) => {
                    console.error(res);
                },
                onreadystatechange: (res) => {
                    console.error(res);
                }
            });
        }, delay);
    }

    async function getTrackingWaitingTime() {
        let waitingTime = parseInt(await GM.getValue(APP_WAIT_BEFORE_TRACKING_KEY_NAME_SECONDS));
        if (waitingTime > 0) {
            waitingTime = waitingTime * 1000;
        } else {
            waitingTime = 0;
        }

        if (waitingTime < 1000 || waitingTime > 300000) {
            return APP_DEFAULT_WAIT_BEFORE_TRACKING;
        }

        return waitingTime;
    }

    async function stopTimeEntry() {
        if (currentTimeEntryTimoutId) {
            window.clearTimeout(currentTimeEntryTimoutId);
        }

        if (!currentTimeEntry) {
            return;
        }

        const wid = parseInt(await GM.getValue(TOGGL_WID_KEY_NAME), 10);
        GM.xmlHttpRequest({
            method: 'PATCH',
            url: TOGGL_API_BASE_URL + '/workspaces/'+ wid +'/time_entries/' + currentTimeEntry.id + '/stop',
            headers: await getTogglHeaders(),
            onload: () => {
                setCurrentTimeEntry(null);
            }
        });
    }

    function isCardInTrackableColumn(card, columnsToTrack) {
        if (columnsToTrack.length === 0) {
            return true;
        }

        if (card.columnId && columnsToTrack.indexOf(card.columnId) !== -1) {
            return true;
        }

        let found = false;
        const selector = '.boardcolumn .carditem .card-title-text:contains(\'' + $.escapeSelector(card.name) + '\')';
        $(selector).parents('.boardcolumn').each((index, elem) => {
            const columnId = $(elem).attr('id');
            if (columnsToTrack.indexOf(columnId) !== -1) {
                return found = true;
            }
        });

        return found;
    }

    function onOpenCardChange() {
        return async (oldCardId, newCardId) => {
            if (!(await isAutoToggl())) {
                return;
            }

            await stopTimeEntry();
            if (newCardId) {
                await startTimeEntry(newCardId, false);
            }
        };
    }

    async function startTimeEntry(cardId, manualStarted) {
        const sequentialId = await GM.getValue(FAVRO_TICKET_PREFIX_KEY_NAME) + cardId;
        const columnsToTrackEnv = await GM.getValue(FAVRO_COLUMNS_TO_TRACK_KEY_NAME);

        let columnsToTrack = [];
        if (!manualStarted && typeof columnsToTrackEnv === "string" && columnsToTrackEnv !== "") {
            columnsToTrack = columnsToTrackEnv.split(',');
        }

        $.ajax({
            type: 'GET',
            url: FAVRO_API_BASE_URL + '/cards?cardSequentialId=' + sequentialId,
            beforeSend: await beforeSendFavro(),
            success: (res) => {
                const card = res.entities[0];
                if (!card) {
                    GM.notification({text: 'No card found in favro for sequentialId ' + sequentialId});
                    return;
                }

                if (!isCardInTrackableColumn(card, columnsToTrack)) {
                    return;
                }

                startTimeEntryForCard(card, !manualStarted);
            },
            error: err => {
                GM.notification({text: 'Card sequentialId ' + sequentialId + ' fetch error: ' + err});
            }
        });
    }

    start();
})(window.jQuery);

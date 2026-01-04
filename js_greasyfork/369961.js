// ==UserScript==
// @author              Deniss Dubinin
// @name                Steam Queue Auto Discover
// @description         Automatic queue discoverer for 3 Steam Sale cards getting
// @version             1.0.0
// @namespace           https://raw.githubusercontent.com/denissdubinin/Steam-Queue-Auto-Discover
// @supportURL          https://github.com/denissdubinin/Steam-Queue-Auto-Discover/issues
// @icon                https://store.steampowered.com/favicon.ico
// @match               https://store.steampowered.com/explore
// @downloadURL https://update.greasyfork.org/scripts/369961/Steam%20Queue%20Auto%20Discover.user.js
// @updateURL https://update.greasyfork.org/scripts/369961/Steam%20Queue%20Auto%20Discover.meta.js
// ==/UserScript==

(function(window) {
    'use strict';

    const SESSION_ID = g_sessionID;
    const GENERATE_QUEUE_URL = 'https://store.steampowered.com/explore/generatenewdiscoveryqueue';
    const QUEUE_ITEM_URL = 'https://store.steampowered.com/app/';
    const NEXT_QUEUE_URL = 'https://store.steampowered.com/explore/next/0/';

    let queueItems = [],
        mainQueueIterator = 0,
        error = false,
        popup;

    class sendRequest {
        send(url, params, successCallback) {
            var urlParams;

            urlParams = Object.keys(params).map(
                function(param) {
                    return encodeURIComponent(param) + '=' + encodeURIComponent(params[param])
                }
            ).join('&');

            var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

            xhr.open('POST', url);

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    switch (xhr.status) {
                        case 200:
                            error = false;

                            if (successCallback !== undefined &&
                                successCallback !== null
                            ) {
                                successCallback(xhr.response);
                            }
                            break;
                        default:
                            error = true;
                            generateNewQueue();
                            break;
                    }
                }
            }

            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            xhr.send(urlParams);

            return xhr;
        }
    }

    let sendRequestClass = new sendRequest();

    function generateNewQueue() {
        if (popup !== undefined) {
            popup.Dismiss();
        }

        if (mainQueueIterator < 3) {
            let popupContext = '';

            if (error) {
                popupContext = `Error happened. Discovering queue #${mainQueueIterator + 1}`;
            } else {
                popupContext = `Discovering queue #${mainQueueIterator + 1}`;
            }

            popup = ShowBlockingWaitDialog(
                'Queue autodiscover',
                popupContext
            );

            sendRequestClass.send(
                GENERATE_QUEUE_URL, {
                    sessionid: SESSION_ID,
                    queuetype: 0,
                    snr: '1_5_9__discovery-queue-0'
                },
                generateQueueCallback
            );

            mainQueueIterator++;
        } else {
            let button = '<a class="btn_green_white_innerfade btn_medium"' +
                'href="#" onClick="window.location = \'https://store.steampowered.com/\'">' +
                '<span>Reload The Page</span></a>' +
                '<style>.waiting_dialog_throbber {display: none;}</style>',
                popup = ShowBlockingWaitDialog(
                    'Queue autodiscover',
                    'Autodiscover finished.&emsp;' + button
                );
        }
    }

    function generateQueueCallback(response) {
        if (response === undefined ||
            JSON.parse(response).queue === undefined
        ) {
            return;
        }

        var i,
            length,
            callback = null,
            queueItems = JSON.parse(response).queue;

        for (i = 0, length = queueItems.length; i < length; ++i) {
            if (queueItems[i] === queueItems[length - 1]) {
                callback = function() {
                    sendRequestClass.send(
                        NEXT_QUEUE_URL, {
                            appid_to_clear_from_queue: queueItems[i],
                            sessionid: SESSION_ID,
                            snr: '1_5_9__discovery-queue-0'
                        },
                        generateNewQueue
                    );
                }
            }

            sendRequestClass.send(
                QUEUE_ITEM_URL + queueItems[i], {
                    appid_to_clear_from_queue: queueItems[i],
                    sessionid: SESSION_ID,
                },
                callback
            );

            callback = null;
        };
    }

    generateNewQueue();
})(window);

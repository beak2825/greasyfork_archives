// ==UserScript==
// @name         Christian Skribbl Finder
// @version      1.0
// @description  Refresh the Skribbl page until a player is found. Requires the Notification display permission
// @author       jancc
// @match        https://*.skribbl.io/*
// @grant        none
// @namespace https://greasyfork.org/users/281093
// @require http://code.jquery.com/jquery-3.3.1.js
// globals jQuery, $, waitForKeyElements 
// jshint esversion: 6
// @downloadURL https://update.greasyfork.org/scripts/381110/Christian%20Skribbl%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/381110/Christian%20Skribbl%20Finder.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const settings = {
        waitTime: 1.5, /* how much to wait for a lobby in seconds, for a minimum of 1 second */
        caseSensitive: true, /* whether `fOo` and `foo` are different names or not, `true` or `false` */
        randomizeAvatar: false, /* whether to roll a new avatar before every retry */
        randomizeName: false, /* whether to pick a name at random from the following list */
        names: [
            'foo',
            'bar',
            'baz',
        ],
    };

    const $ = window.jQuery;
    const skribblDocument = $(document);
    const inputChat = $('#inputChat');

    const localStorageRead = (key, defaultValue) => {
        let item = localStorage.getItem(key);
        if (item === null) {
            localStorage.setItem(key, JSON.stringify(defaultValue));
            return defaultValue;
        } else {
            return JSON.parse(item);
        }
    };

    settings.monitoredNames = localStorageRead('monitoredNames', ['pumpkins', 'Supreme', '🍓']);
    settings.acceptableScores = localStorageRead('acceptableScores', [500, 1500, 2000]);

    const nameTransform = settings.caseSensitive ? name => name : name => name.toLowerCase();

    const keepSeeking = {
        seek: sessionStorage.getItem('keepSeeking') === 'true' ? true : false,
        on() {
            this.seek = true;
            sessionStorage.setItem('keepSeeking', 'true');
        },
        off() {
            this.seek = false;
            sessionStorage.setItem('keepSeeking', 'false');
        },
    };

    const createNotification = (message, tag) => {
        let notification = new Notification('skribbl.io', {
            icon: 'https://skribbl.io/res/favicon.png',
            body: message,
            renotify: true,
            tag: tag,
            requireInteraction: true,
        });
        return notification;
    };

    let playerNodes = new Map();
    const containerGamePlayers = document.getElementById('containerGamePlayers');

    new MutationObserver((mutationList, observer) => {
        mutationList.forEach((mutation) => {
            let playerName;
            mutation.addedNodes.forEach((node) => {
                playerName = node.childNodes[1].firstChild.textContent;
                playerNodes.set(node, playerName);
            });
            mutation.removedNodes.forEach((node) => {
                playerNodes.delete(node);
            });
        });
    }).observe(containerGamePlayers, {
        subtree: false,
        childList: true,
    });

    window.onbeforeunload = () => {
        const foundPlayers = checkPlayers();
        if (foundPlayers.length) {
            $(window).one('focus', () => {
                foundPlayers.forEach(node => {
                    $(node).toggle('highlight', 'slow')
                           .toggle('highlight', { color: '#99ffff' }, 'fast');
                });
            });
            return 'This message is not relevant in modern browsers.';
        }
    };

    function checkPlayers() {
        let found = [], round = parseInt(document.getElementById('round').textContent[6]) - 1;
        playerNodes.forEach((name, node, nodes) => {
            if (settings.monitoredNames.has(nameTransform(name)) || parseInt(node.childNodes[1].lastChild.textContent.slice(8)) >= settings.acceptableScores[round]) {
                found.push(node);
            }
        });
        return found;
    }

    let overlayNotification;
    const overlayText = document.getElementById('overlay').firstChild.firstChild;

    new MutationObserver((mutationList, observer) => {
        if (!document.hasFocus() && !keepSeeking.seek) {
            overlayNotification = createNotification(overlayText.innerText, 'overlayUpdated');
            overlayNotification.onclick = () => {
                window.focus();
                overlayNotification.close();
                inputChat.focus();
            };
        }
    }).observe(overlayText, {
        subtree: false,
        childList: true,
    });

    let modalNotification;

    const createModalObserver = (selectorId, message) => {
        let modal = document.getElementById(selectorId);
        new MutationObserver((mutationList, observer) => {
            keepSeeking.off();
            if (!document.hasFocus()) {
                modalNotification = createNotification(message, 'modalShown');
                modalNotification.button = modal.querySelector('.modal-footer button');
                modalNotification.onclick = () => {
                    window.focus();
                    modalNotification.button.focus();
                    modalNotification.close();
                };
            }
        }).observe(modal, {
            attributes: true,
            attributeFilter: ['class'],
        });
    };

    createModalObserver('modalIdle', 'Are you still here?');
    createModalObserver('modalDisconnect', 'Connection lost.');
    createModalObserver('modalKicked', 'You have been kicked.');

    document.addEventListener('focus', () => {
        overlayNotification && overlayNotification.close(); //jshint ignore:line

        if (modalNotification) {
            modalNotification.button.focus();
            modalNotification.close();
        }
    }, true);

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    const createInput = (description, value, home, button) => {
        const input = $('<input>').attr({class: 'form-control'});
        input.on('keypress', event => {
            let keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode === 13) {
                button.click();
            }
        });

        const wrapper = $('<div>').css({
            'margin-bottom': '10px',
        });

        $('<span>').css({
            'margin-left': '12px',
            'display': 'inline-block',
            'color': '#555555',
        }).html(description).appendTo(wrapper);

        input.val(value);
        input.appendTo(wrapper);
        wrapper.appendTo(home);

        return input;
    };

    Notification.requestPermission().then(permission => {
        /* First order of business: if showing notifications isn't allowed,
         * many features won't work, so fall through the promise chain with an
         * error.
         */
        return new Promise((resolve, reject) => {
            if (permission === 'granted') {
                resolve();
            } else {
                alert('Notifications are required for the Christian Skribbl Finder features to work. In Google Chrome, you can click the lock next to the address bar to allow notifications.');
                reject('Permission to display notifications has not been granted.');
            }
        });
    }).then(() => {
        /* THEN wait for the page to fully load or for 300 milliseconds,
         * whichever comes first.  This is necessary because sometimes the page
         * gets stuck loading broken ads.
         */
        return Promise.race([
            new Promise((resolve, reject) => setTimeout(() => resolve(true), 300)),
            new Promise((resolve, reject) => (window.onload = () => resolve(false))),
        ]);
    }).then(hasTimedOut => {
        /* THEN if the page is loaded for the first time in a session, wait for
         * the player to click the 'Play!' button.  If the player is trying to
         * join a private lobby (judging by the presence of the question-mark
         * character in the URL), don't attempt to refresh automatically after
         * the button is clicked.
         * Otherwise begin refreshing and don't stop until any of the following
         * occurs:
         *     - one or more players matching the requirements are found;
         *     - any click in the Skribbl window;
         *     - any keypress in the Skribbl window, excepting:
         *           CTRL, ALT, and TAB
         *
         * Additionally, change the avatar and / or name if they are set to be
         * changed.
         */
        if (settings.randomizeAvatar) {
            document.getElementById('buttonAvatarCustomizerRandomize').click();
        }

        if (settings.randomizeName) {
            let randomName = settings.names[Math.floor(Math.random() * settings.names.length)];
            document.getElementById('inputName').value = randomName;
        }

        const cancelSeeking = (event) => {
            /*                                        <Tab>                 <C>                   <A> */
            if (event.type === 'click' || (event.which !== 9 && event.which !== 17 && event.which !== 18)) {
                keepSeeking.off();
                inputChat.focus();
                skribblDocument.off('click keydown', cancelSeeking);
            }
        };

        const playButton = document.getElementById('loginAvatarCustomizeContainer').nextElementSibling;
        const waitTime = Math.max(settings.waitTime * 1000, 1000);

        return new Promise((resolve, reject) => {
            if (keepSeeking.seek) {
                playButton.click();

                settings.monitoredNames = new Set(settings.monitoredNames.map(nameTransform));
                settings.acceptableScores[3] = settings.acceptableScores[2];

                skribblDocument.on('click keydown', cancelSeeking);

                resolve(waitTime);
            } else {
                playButton.focus();

                const settingsUI = $('<div>')
                    .attr({
                        class: 'loginPanelContent',
                        id: 'settingsUI',
                    }).css({
                        'margin-top': '5px',
                    }).appendTo($('.loginPanelContent').first());

                const monitoredNamesField = createInput('<b>Monitored names</b>, comma-separated.', settings.monitoredNames.join(','), settingsUI, playButton);
                const scoresField = createInput('<b>Acceptable scores</b> in the first, second, and third rounds. Stop when a player with this score or a higher one is spotted. Comma-separated.', settings.acceptableScores.join(','), settingsUI, playButton);

                playButton.onclick = (event) => {
                    event.stopPropagation();

                    if (window.location.href.indexOf('?') > -1) {
                        keepSeeking.off();
                    } else {
                        keepSeeking.on();
                    }

                    settings.monitoredNames = monitoredNamesField.val().split(',');
                    localStorage.setItem('monitoredNames', JSON.stringify(settings.monitoredNames));
                    settings.monitoredNames = new Set(settings.monitoredNames.map(nameTransform));

                    settings.acceptableScores = scoresField.val().split(',').map(num => parseInt(num, 10));
                    localStorage.setItem('acceptableScores', JSON.stringify(settings.acceptableScores));
                    settings.acceptableScores[3] = settings.acceptableScores[2];

                    skribblDocument.on('click keydown', cancelSeeking);

                    resolve(waitTime);
                };
            }
        });
    }).then((waitTime) => {
        /* THEN wait for the lobby to load. */
        return delay(waitTime);
    }).then(() => {
        /* Finally, check the players and refresh if necessary. */
        let foundPlayers = checkPlayers();
        if (foundPlayers.length) {
            let notification = createNotification('One or more players satisfying the requirements have been found. Click here to focus the Skribbl tab.', 'lobbyFound');
            notification.onclick = () => {
                window.focus();
                notification.close();
                inputChat.focus();
                foundPlayers.forEach(node => {
                    delay(500).then(() =>
                        $(node).toggle('highlight', 'slow').toggle('highlight', {
                            color: '#99ffff'
                        }, 'fast')
                    );
                });
            };
        } else if (keepSeeking.seek) {
            window.onbeforeunload = null;
            window.location.reload();
        }
    }).catch(error => {
        console.log(error);
    });
})();
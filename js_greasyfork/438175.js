// ==UserScript==
// @name YouTube Name Colorizer
// @version 1.14
// @author JakeBathman
// @description Color certain names in YouTube stream chat
// @match https://*.youtube.com/*
// @license MIT
// @grant none
// @namespace https://github.com/jakebathman/YouTube-Name-Colorizer
// @downloadURL https://update.greasyfork.org/scripts/438175/YouTube%20Name%20Colorizer.user.js
// @updateURL https://update.greasyfork.org/scripts/438175/YouTube%20Name%20Colorizer.meta.js
// ==/UserScript==
console.log('[YTNC] ############ YouTube Name Colorizer');

let MutationObserver =
    window.MutationObserver ||
    window.WebKitMutationObserver ||
    window.MozMutationObserver;

let localStorageKey = 'yt-name-colorizer';
let localStorageKeyProcessMsgs = 'yt-name-colorizer-process-msgs';
let listenToInputEvents = false;
let isFullyLoaded = false;
let processMsgIntervalId;

let settingsModalElement;
var settingsModalSave;
var settingsModalCancel;
var settingsModalType;

let globalModalElement;
var globalModalSave;
var globalModalCancel;
var globalModalType;

// Get settings for colorized names
let SETTINGS = JSON.parse(localStorage.getItem(localStorageKey)) || {};
let COLORIZED_USERS_NORMAL = settingsGet('users_normal', []);
let COLORIZED_USERS_TEMP = settingsGet('users_temp', []);
let USERS_NOTES = settingsGet('users_notes', {});
let AUTHORS_IN_CHAT = [];
let AT_MENTIONABLE = getAtMentionableUsers() || [];

console.log({ COLORIZED_USERS_NORMAL });
console.log({ COLORIZED_USERS_TEMP });
console.log({ AT_MENTIONABLE });
console.log({ AUTHORS_IN_CHAT });

console.debug('[YTNC] SETTINGS', SETTINGS);

let MESSAGE_TAG = 'yt-live-chat-text-message-renderer';
let OTHER_USER_COLOR = 'FF69B4';
let CURRENT_USER_COLOR = 'ff5722';
let TEMP_USER_COLOR = 'ffff2a';
let MENTIONED_USER_COLOR = '612155';
let MATCHED_WORD_COLOR = '67d4d3';
let CURRENT_USER = '';
let WORDS_TO_COLOR = [
    'jake',
    'mods',
    '\\!multi',
    'multi',
    'bathman',
    'multi-stream',
    '\\!?setmulti',
    // '(?:\\s|^)chat(?:\\!|\\.|\\?|\\s|$)', // for words that might be found within html, be careful
];

function settingsGet(key, defaultValue = null) {
    let settings = JSON.parse(localStorage.getItem(localStorageKey)) || {};

    console.debug('[YTNC] Settings', settings);
    if (!settings.hasOwnProperty(key)) {
        return defaultValue;
    }

    return settings[key];
}

function settingsSet(key, value) {
    let settings = JSON.parse(localStorage.getItem(localStorageKey)) || {};

    if (!settings.hasOwnProperty(key)) {
        settings[key] = {};
    }

    settings[key] = value;

    localStorage.setItem(localStorageKey, JSON.stringify(settings));

    COLORIZED_USERS_NORMAL = settingsGet('users_normal', []);
    COLORIZED_USERS_TEMP = settingsGet('users_temp', []);
    USERS_NOTES = settingsGet('users_notes', {});
    AT_MENTIONABLE = getAtMentionableUsers();
    console.debug({ AT_MENTIONABLE });

    processExistingMessages();
}

function getAtMentionableUsers() {
    // Sorted by length, descending, so
    // @mentions for longer names are checked first
    $sorted = Array.from(
        new Set(
            AUTHORS_IN_CHAT.concat(COLORIZED_USERS_NORMAL).concat(
                COLORIZED_USERS_TEMP
            )
        )
    ).sort((a, b) => b.length - a.length);
    // console.debug('[YTNC] Sorted??', $sorted);
    return $sorted;
}

function addUserInChat(username) {
    AUTHORS_IN_CHAT = addItemToArray(AUTHORS_IN_CHAT, username);
    AT_MENTIONABLE = getAtMentionableUsers();
    // console.debug('[YTNC] AT_MENTIONABLE', { AT_MENTIONABLE, AUTHORS_IN_CHAT });
}

function addItemToArray(array, item) {
    array.push(item);
    array = Array.from(new Set(array));
    return array;
}

function settingsAddUser(username, type = 'normal') {
    let typeKey = `users_${type}`;
    let users = settingsGet(typeKey, []);

    users = addItemToArray(users, username);

    settingsSet(typeKey, users);
}

function settingsRemoveUser(username, type = 'normal') {
    let itemWasRemoved = false;
    let typeKey = `users_${type}`;
    let users = settingsGet(typeKey, []);
    const index = users.indexOf(username);

    if (index > -1) {
        users.splice(index, 1);
        itemWasRemoved = true;
    }

    if (!itemWasRemoved) {
        // Item wasn't removed, so don't continue and reprocess messages
        return;
    }

    settingsSet(typeKey, users);
}

let showModal = function (username) {
    settingsModalSave = frameContext().querySelector('#ytncSave');
    settingsModalCancel = frameContext().querySelector('#ytncCancel');
    settingsModalType = frameContext().querySelector(
        '#ytncModal__colorize-type'
    );
    settingsModalNote = frameContext().querySelector('#ytncModal__note');

    if (COLORIZED_USERS_NORMAL.includes(username)) {
        settingsModalType.value = 'normal';
    } else if (COLORIZED_USERS_TEMP.includes(username)) {
        settingsModalType.value = 'temp';
    } else {
        settingsModalType.value = 'none';
    }

    settingsModalNote.value = getNoteForUser(username);

    colorModalSelect(settingsModalType);

    settingsModalType.addEventListener('change', (event) => {
        colorModalSelect(event.target);
    });

    settingsModalCancel.onclick = function () {
        hideModal(settingsModal());
    };

    settingsModalSave.onclick = function () {
        switch (settingsModalType.value) {
            case 'normal':
                addNormalUser(username);
                break;

            case 'temp':
                addTempUser(username);
                break;

            default:
                // Remove from both lists
                removeUser(username);
                break;
        }

        // Save note for user
        setNoteForUser(username, settingsModalNote.value);

        hideModal(settingsModal());
    };

    settingsModal().querySelector('.ytnc__username').innerText = username;
    settingsModal().style.display = 'flex';
};

let showGlobalModal = function () {
    globalModalSave = frameContext().querySelector('#ytncGlobalSave');
    globalModalCancel = frameContext().querySelector('#ytncGlobalCancel');
    globalModalProcessMessages = frameContext().querySelector(
        '#ytncGlobalProcessMessages'
    );

    globalModalCancel.onclick = function () {
        hideModal(globalModal());
    };

    globalModalSave.onclick = function () {
        hideModal(globalModal());
    };

    globalModalProcessMessages.onclick = function () {
        processExistingMessages(true);
        hideModal(globalModal());
    };

    globalModal().style.display = 'flex';
};

let colorModalSelect = function (selectElement) {
    let value = selectElement.value;

    if (value === 'normal') {
        selectElement.style.color = `#${OTHER_USER_COLOR}`;
        selectElement.style.borderColor = `#${OTHER_USER_COLOR}`;
        selectElement.style.outlineColor = `#${OTHER_USER_COLOR}`;
        selectElement.style.backgroundColor = '#000';
    } else if (value === 'temp') {
        selectElement.style.color = `#${TEMP_USER_COLOR}`;
        selectElement.style.borderColor = `#${TEMP_USER_COLOR}`;
        selectElement.style.outlineColor = `#${TEMP_USER_COLOR}`;
        selectElement.style.backgroundColor = '#000';
    } else {
        selectElement.style.color = 'gray';
        selectElement.style.borderColor = 'gray';
        selectElement.style.outlineColor = 'gray';
        selectElement.style.backgroundColor = '#000';
    }
};

let hideModal = function (modal) {
    modal.style.display = 'none';
};

let settingsModal = function () {
    if (!settingsModalElement) {
        settingsModalElement = document.getElementById('ytncModal');
    }

    return settingsModalElement;
};

let globalModal = function () {
    if (!globalModalElement) {
        globalModalElement = document.getElementById('ytncGlobalModal');
    }

    return globalModalElement;
};

let currentUser = function () {
    if (!CURRENT_USER) {
        CURRENT_USER = frameContext().querySelector(
            'yt-live-chat-message-input-renderer .yt-live-chat-author-chip'
        ).innerText;
    }

    return CURRENT_USER;
};

let getNoteForUser = function (username) {
    console.debug('[YTNC] getNoteForUser', { username });
    let note = null;

    if (Object.keys(USERS_NOTES).includes(username)) {
        note = USERS_NOTES[username];
    }

    return note;
};

let setNoteForUser = function (username, note) {
    console.debug('[YTNC] setNoteForUser', { username, note });
    USERS_NOTES[username] = note;

    console.debug('[YTNC] USERS_NOTES', { USERS_NOTES });

    settingsSet('users_notes', USERS_NOTES);
};

function createModal() {
    console.log('[YTNC] Creating modal div');
    // Add the modal shell
    const modal = document.createElement('div');
    let modalHtml = `
    <div id="ytncModal" style="display:none;width: 100%;height: 100%;top: 0;left: 0;position:absolute;">
        <div class="modal-content"
            style="background-color: #fefefe;margin: auto;padding: 0;border: 1px solid #888;box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);z-index: 999999;">
            <div class="modal-header">
                <h2 class="ytncModal__header" style="padding: 2px 16px;background-color: #5cb85c;color: white;">YouTube Name Colorizer</h2>
            </div>
            <div class="modal-body" style="padding: 12px 16px;font-size:1.7em;text-align:center;">
                <p><span class="ytnc__action">Colorize</span> <span class="ytnc__username"
                        style="font-weight:bold;color:#${OTHER_USER_COLOR};">{user}</span>?</p>
                <div style="display:flex;justify-content:center;">
                    <select id="ytncModal__colorize-type" style="height: 42px;margin-top: 12px;padding: 0px 19px 0px 5px;font-size: 16px;line-height: 1.75;color: #808080;background-color: #000;background-image: none;border: 2px solid #808080;border-radius: 6px;outline-color:#808080;">
                        <option value="none">None</option>
                        <option value="normal">Normal</option>
                        <option value="temp">Temp</option>
                    </select>
                </div>
                <br />
                <div>
                    <!-- Input for notes about this user -->
                    <label for="ytncModal__note">Note</label>
                    <textarea id="ytncModal__note" style="width: 100%;height: 100px;"></textarea>
                </div>
            </div>
            <div class="modal-footer" style="padding: 8px 16px;display: flex;justify-content: space-between;height:32px;">
                <button id="ytncCancel">Cancel</button><button id="ytncSave">Save</button>
            </div>
        </div>
    </div>`;

    modal.innerHTML = modalHtml;
    document.body.appendChild(modal);

    let showDiv = document.createElement('div');
    showDiv.innerHTML = `<button id="ytncShowSettings">Show</button>`;
    try {
        document
            .querySelector('.ytd-video-primary-info-renderer .title')
            .appendChild(showDiv);
    } catch (error) {}
}

function createGlobalModal() {
    console.log('[YTNC] Creating global settings modal div');
    // Add the modal shell
    const modal = document.createElement('div');
    let modalHtml = `
    <div id="ytncGlobalModal" style="display:none;width: 100%;height: 100%;top: 0;left: 0;position:absolute;">
        <div class="modal-content"
            style="background-color: #fefefe;margin: auto;padding: 0;border: 1px solid #888;box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);z-index: 999999;">
            <div class="modal-header">
                <h2 class="ytncGlobalModal__header" style="padding: 2px 16px;background-color: #5cb85c;color: white;">YouTube Name Colorizer</h2>
            </div>
            <div class="modal-body" style="padding: 12px 16px;font-size:1.7em;text-align:center;">
                <p><span class="ytncGlobal__action">Settings</span></p>
                <button style="padding: 10px;margin-top: 14px;" id="ytncGlobalProcessMessages">Process Messages</button>
            </div>
            <div class="modal-footer" style="padding: 8px 16px;display: flex;justify-content: space-between;height:32px;">
                <button id="ytncGlobalCancel">Cancel</button><button id="ytncGlobalSave">Save</button>
            </div>
        </div>
    </div>`;

    modal.innerHTML = modalHtml;
    document.body.appendChild(modal);
}

window.onload = (event) => {
    console.log('[YTNC] Window is fully loaded', event);

    console.log('[YTNC] Loading...');
    load();
};

let load = function () {
    console.log('[YTNC] adding settings button');
    addSettingsButton();

    console.log('[YTNC] creating modal');
    createModal();

    console.log('[YTNC] creating global modal');
    createGlobalModal();

    console.log('[YTNC] attaching listener');
    attachInputListener();

    console.log('[YTNC] processing messages');
    processExistingMessages();

    console.log('[YTNC] process messages regularly');
    processMessagesRegularly();

    console.log('[YTNC] fixing some styles');
    fixStyles();

    console.log('[YTNC] registering key listeners');
    registerKeyListeners();

    console.log('[YTNC] loading truffle data');
    loadTruffleData();
};

let processMessagesRegularly = function () {
    // Set messages to re-process the latest XX messages every 5 seconds
    let processMsgSlice = 30;
    let processMsgInterval = 5000;
    let lastIntervalTime =
        localStorage.getItem(localStorageKeyProcessMsgs) || Date.now();
    console.debug('[YTNC] Last interval time', lastIntervalTime);

    // If the time since the last interval is greater than 5 seconds, set a new interval
    console.debug(
        `[YTNC] Setting interval to process ${processMsgSlice} messages every 5 seconds`
    );
    processMsgIntervalId = setInterval(() => {
        console.debug(
            `[YTNC] Processing ${processMsgSlice} messages`,
            localStorage.getItem(localStorageKeyProcessMsgs),
            Date.now() - localStorage.getItem(localStorageKeyProcessMsgs)
        );
        if (
            Date.now() -
                (localStorage.getItem(localStorageKeyProcessMsgs) ||
                    Date.now()) <
            processMsgInterval
        ) {
            // There's a duplicate interval running in a different window context
            // (probably the chat iFrame). Clear this interval and reset the timestamp
            // so we keep the other interval running fine.
            console.debug('[YTNC] Resetting interval', processMsgIntervalId);
            clearInterval(processMsgIntervalId);
            localStorage.setItem(
                localStorageKeyProcessMsgs,
                Date.now() - processMsgInterval
            );
        } else {
            localStorage.setItem(localStorageKeyProcessMsgs, Date.now());
            processExistingMessages(true, processMsgSlice);
        }
    }, processMsgInterval);
    console.debug('[YTNC] Interval ID: ' + processMsgIntervalId);
};

let frameContext = function () {
    let frameContext = document.querySelector('ytd-live-chat-frame iframe');

    if (frameContext) {
        frameContext = frameContext.contentDocument.body;
    } else {
        frameContext = document.body;
    }

    return frameContext;
};

let processExistingMessages = function (once = false, slice = 100) {
    console.log('[YTNC] Processing existing messages');
    let startTime = new Date().getTime();

    let messages = frameContext().querySelectorAll(
        'yt-live-chat-text-message-renderer'
    );

    let messageArray = Array.from(messages);

    // Start with the most recent 100 messages (or slice amount passed in)
    let countProcessed = 0;
    messageArray.slice(-1 * slice).forEach((message) => {
        // If the message is off the screen, stop processing
        if (message.getBoundingClientRect().top < 0) {
            return;
        }

        processMessage(message, once);

        countProcessed++;
    });

    let endTime = new Date().getTime();
    let timeDiff = endTime - startTime;

    console.debug(
        '[YTNC] Processed ' + countProcessed + ' messages in ' + timeDiff + 'ms'
    );
};

let attachInputListener = function () {
    if (!listenToInputEvents) {
        return;
    }

    console.log('[YTNC] Attaching listener to input');
    let input = frameContext().querySelector(
        '#input.yt-live-chat-text-input-field-renderer'
    );

    // Check for existing listener to this element
    if (input.getAttribute('ytncListener') !== null) {
        // Already set
        return;
    }

    console.debug(input);

    if (input) {
        input.addEventListener('input', (event) => {
            console.debug('[YTNC] input', event);
            if (event.key === 'Enter') {
                let message = input.querySelector(
                    '.yt-live-chat-message-input-renderer-message-input'
                );
                if (message) {
                    processMessage(message);
                }
            }
        });

        input.setAttribute('ytncListener', true);
    }
};

if (MutationObserver) {
    console.log('[YTNC] Mutation observer already exists');
}

// Process new messages as they're added to the DOM
let observer = new MutationObserver((mutations) => {
    try {
        // look through all mutations that just occurred
        for (var i = 0; i < mutations.length; ++i) {
            // look through all added nodes of this mutation
            for (var j = 0; j < mutations[i].addedNodes.length; ++j) {
                var el = mutations[i].addedNodes[j];

                // For added nodes, see if they're a message element
                var tag = el.tagName;
                if (tag && tag.toLowerCase() == MESSAGE_TAG) {
                    processMessage(el);
                }

                // Also see if we need to re-render the settings icon
                if (
                    tag &&
                    tag.toLowerCase() ==
                        'yt-live-chat-icon-toggle-button-renderer'
                ) {
                    var id = el.id;
                    if (id && id === 'product-picker') {
                        console.debug('[YTNC] Found product picker');
                        addSettingsButton();

                        // In 2.5 seconds, re-process messages (needed after we swap from Top to Live)
                        setTimeout(() => {
                            processExistingMessages(true);
                            processMessagesRegularly();
                        }, 2500);
                    }
                }
            }
        }
    } catch (error) {
        console.error('[YTNC] error!', error);
    }
});

let addNormalUser = (username) => {
    settingsAddUser(username, 'normal');
    settingsRemoveUser(username, 'temp');
};

let addTempUser = (username) => {
    settingsAddUser(username, 'temp');
    settingsRemoveUser(username, 'normal');
};

let removeUser = (username) => {
    settingsRemoveUser(username, 'normal');
    settingsRemoveUser(username, 'temp');
};

let processMessage = function (msg, isReprocess = false) {
    let commonStyles = 'font-weight:bold;cursor:pointer;';

    // New message added to the list
    var author = msg.querySelector('#author-name');

    if (author) {
        let authorName = author.innerText;
        console.debug('[YTNC] Found author', authorName);

        // Log the author name so it can be @mentioned
        addUserInChat(authorName);

        if (currentUser() == authorName) {
            // author.style.cssText += `color:#${CURRENT_USER_COLOR};${commonStyles}`;
            // Queue an update to process this message again, since YouTube
            // seems to re-render and undo @mention highlights on our own messages
            if (isReprocess === false) {
                setTimeout(() => {
                    processMessage(msg, true);
                }, 1500);
            }
        } else if (COLORIZED_USERS_NORMAL.includes(authorName)) {
            author.style.cssText += `color:#${OTHER_USER_COLOR};${commonStyles}`;
        } else if (COLORIZED_USERS_TEMP.includes(authorName)) {
            author.style.cssText += `color:#${TEMP_USER_COLOR};${commonStyles}`;
        } else {
            // Remove color override (if user was removed from all lists)
            author.style.color = '';
        }

        // Some extensions are "helpful" and update colors and whatnot.
        // Let them do their thing, then just do our thing again instead.
        if (isReprocess === false) {
            setTimeout(() => {
                processMessage(msg, true);
            }, 50);
        }

        // Add author onclick
        author.onclick = function (e) {
            if (e.altKey) {
                // Add to temp list directly without opening the modal
                // or remove them if they're already temp
                if (COLORIZED_USERS_TEMP.includes(authorName)) {
                    removeUser(authorName);
                } else {
                    addTempUser(authorName);
                }
            } else {
                showModal(authorName);
            }
        };

        // If there's a note for this user, add an icon
        let note = getNoteForUser(authorName);
        let hasNoteIcon = msg.querySelector('span[title="Note"]');
        console.debug('[YTNC] Note for user', {
            authorName,
            note,
            hasNoteIcon,
        });
        if (note && !hasNoteIcon) {
            let noteIcon = document.createElement('span');
            noteIcon.innerHTML =
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4"><path fill-rule="evenodd" d="M10 3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v9a2 2 0 0 0 2 2h8a2 2 0 0 1-2-2V3ZM4 4h4v2H4V4Zm4 3.5H4V9h4V7.5Zm-4 3h4V12H4v-1.5Z" clip-rule="evenodd" /><path d="M13 5h-1.5v6.25a1.25 1.25 0 1 0 2.5 0V6a1 1 0 0 0-1-1Z" /></svg>';
            noteIcon.title = 'Note';
            noteIcon.style.cssText = `cursor: help;width:16px;height:auto;display:flex;color:white;opacity:0.5;align-self:end;`;
            author.after(noteIcon);
        }

        // Move user badges before author chip element
        var badges = msg.querySelector('#chat-badges.yt-live-chat-author-chip');

        console.debug('[YTNC] Moving badges', badges);
        if (badges) {
            badges.after(author);
        }

        // Process the message text
        var message = msg.querySelector('#message');

        if (message) {
            if ('originalHtml' in message.dataset === false) {
                message.dataset.originalHtml = message.innerHTML;
            }

            // check if the message has an href attribute
            if (message.querySelector('a[href]')) {
                return;
            }

            let newHtml = message.dataset.originalHtml;
            // console.debug('[YTNC] message newHtml', { newHtml });

            // Loop over AT_MENTIONABLE and colorize any mentions found
            let commonAtMentionStyles = 'padding: 2px 3px;border-radius: 2px;';

            AT_MENTIONABLE.forEach((user) => {
                if (user == CURRENT_USER) {
                    return;
                }
                try {
                    let escapedUser = escapeStringForRegex(user);
                    let regex = new RegExp(`@${escapedUser}`, 'gi');
                    let matches = newHtml.match(regex);
                    if (matches) {
                        newHtml = newHtml.replace(
                            regex,
                            `<span style="background-color:#${MENTIONED_USER_COLOR};${commonAtMentionStyles}">${matches[0]}</span>`
                        );
                    }
                } catch (e) {
                    console.log('[YTNC] escaped user', user, escapedUser);
                    console.error(e);
                }
            });

            WORDS_TO_COLOR.forEach((word) => {
                let escapedWord = escapeStringForRegex(word);
                let regex = new RegExp(`\\b${escapedWord}\\b`, 'gi');
                let matches = newHtml.match(regex);
                if (matches) {
                    console.debug('[YTNC] found word', {
                        escapedWord,
                        word,
                        matches,
                    });

                    newHtml = newHtml.replace(
                        regex,
                        `<span style="background-color:#${MATCHED_WORD_COLOR};color:#000;${commonAtMentionStyles}">${matches[0]}</span>`
                    );
                }
            });

            // console.log('[YTNC] Updating message innerHTML', { newHtml });
            message.innerHTML = newHtml;
        }

        // Attach input listener (try every time)
        attachInputListener();
    }
};

observer.observe(document.body, { childList: true, subtree: true });

const CHAT_SETTINGS_DROPDOWN_CONTAINER_SELECTOR = 'tp-yt-iron-dropdown';
const CHAT_SETTINGS_DROPDOWN_ITEMS_SELECTOR = 'tp-yt-paper-listbox';
const CHAT_SETTINGS_DROPDOWN_ITEM_SELECTOR =
    '.ytd-menu-popup-renderer,.ytls-menu-popup-renderer';
const CHAT_SETTINGS_MENU_BUTTON_SELECTOR =
    '#overflow.yt-live-chat-header-renderer';
const BTTV_CHAT_DROPDOWN_BUTTON_CONTAINER_SELECTOR =
    'div[data-a-target="bttv-chat-dropdown-button-container"]';

// Add settings toggle in menu dropdown
let addSettingsButton = function () {
    console.log('ADDING BUTTON?!');

    const itemsContainer = document.querySelector(
        '#picker-buttons.yt-live-chat-message-input-renderer'
    );
    console.debug('[YTNC] itemsContainer', itemsContainer);
    if (itemsContainer == null) {
        console.log('[YTNC] No items container found');
        return;
    }

    const settingsButton = document.createElement('div');
    settingsButton.setAttribute(
        'data-a-target',
        'bttv-chat-dropdown-button-container'
    );
    settingsButton.innerHTML = `🐈`;
    settingsButton.style.cssText = `padding: 0 3px;cursor: pointer;`;
    settingsButton.onclick = function (e) {
        if (e.altKey) {
            // Process existing messsages once
            processExistingMessages(true);
        } else {
            showGlobalModal();
        }
    };

    console.debug({ settingsButton });
    itemsContainer.appendChild(settingsButton);
};

let escapeStringForRegex = function (name) {
    return name.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
};

let fixStyles = function () {
    // Find the element with ID reaction-control-panel-overlay and set it to display: none
    let reactionControlPanelOverlay = document.querySelector(
        '#reaction-control-panel-overlay'
    );
    if (reactionControlPanelOverlay) {
        reactionControlPanelOverlay.style.display = 'none';
    }
};

let registerKeyListeners = function () {
    // Listen for opt+r to reprocess messages
    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey && e.key === 'r') {
            console.log('[YTNC] Reprocessing messages (ctrl+r)');
            processExistingMessages(true);
        }
    });
};

let loadTruffleData = function () {
    // @todo, this is a hard problem. Disabling for now.
    return;

    // This is a JSON payload stored at window.ytInitialData
    // Its only use now is to know when someone's Truffle display name
    // is different than their YouTube display name

    // Get the JSON payload
    let truffleInitData = window.ytInitialData;
    console.log('[YTNC] truffleInitData', truffleInitData);

    // fetch other users info from Truffle (UCNF0LEQ2abMr0PAX3cfkAMg is DrLupo)
    let users = fetch(
        'https://v2.truffle.vip/gateway/users/v2/c/UCNF0LEQ2abMr0PAX3cfkAMg'
    )
        .then((response) => response.json())
        .then((data) => {
            console.log('[YTNC] users from truffle', data);
            return data;
        });
};

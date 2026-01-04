// ==UserScript==
// @name            Epik Chat Room Hop Shortcuts
// @namespace       dannysaurus.epik
// @version         0.0.2
// @license         MIT License
//
// @match           https://www.epikchat.com/chat*
//
// @require         https://update.greasyfork.org/scripts/528456/1545566/UTILS_DOM%20Library.js
//
// @grant           unsafeWindow
// @description adds Shortcuts for browsing rooms Ctrl + 0-9 and Ctrl + Q
// @downloadURL https://update.greasyfork.org/scripts/527046/Epik%20Chat%20Room%20Hop%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/527046/Epik%20Chat%20Room%20Hop%20Shortcuts.meta.js
// ==/UserScript==

/* jslint esversion: 11 */
/* global unsafeWindow */
(async () => {
    'use strict';
    /** @module UTILS */
    const UTILS = (() => {
        const {
            trySelectElement,
            getUsername,
            areKeysPressed,
            selectors,
        } = unsafeWindow.dannysaurus_epik.libraries.UTILS_DOM;
        return {
            trySelectElement,
            areKeysPressed,
            selectors,
        };
    })();

    /** @module CONFIG */
    const CONFIG = (() => {
        const ids = {
            newContentSeparator: 'new-content-separator',
        };
        const classNames = {
            numbered: 'numbered',
            imgCircle: 'img-circle',
            tab: 'tab',
            notifyBadge: 'notifybadge',
            notifyCount: 'notifycount',
            roomTabShortcut: 'room-tab-shortcut',
            avatarInitial: 'avatar-initial',
            room: "room",
            active: "active",
            chatMessageItem: "chat-item",
            message: "message",
            chatItem: 'chat-item',
            welcomeMessage: 'welcome-message',
            welcomeMessageContent: 'welcome-message-content',
            userRight: 'user-right',
        };
        const attributes = {
            dataNumber: 'data-number',
            dataType: 'data-type',
            dataRid: 'data-rid',
            dataItemId: 'data-item-id',
            dataOriginalTitle: 'data-original-title',
        };

        const roomTabSelector = `.${classNames.tab}[${attributes.dataType}="room"]`;

        const selectors = {
            containers: {
                ctabs: UTILS.selectors.querySelectors.ctabsContainer,
                messages: UTILS.selectors.querySelectors.messagesLC,
            },
            roomTabContainer: roomTabSelector,
            numbered: `.${classNames.numbered}`,
            notifyBadge: `.${classNames.notifyBadge}`,
            roomTabShortcut: `.${classNames.roomTabShortcut}`,
            activeRoomTab: `li.${classNames.active} ${roomTabSelector}`,
            chatMessage: `.${classNames.chatMessageItem}.${classNames.message}`,
        };

        const delays = {
            /**  Delay before a Keyboard Shortcut Badge is displayed. */
            badgeChangeMs: 100,
            /**  Time a message can be considered as read after beeing displayed. */
            messageReadDelayMs: 100,
        };

        const newContentSeparator = {
            id: ids.newContentSeparator,
            className: `${classNames.chatItem} ${classNames.welcomeMessage}`,
            style: 'color: #202324;',
            innerHTML: `<div class="${classNames.userRight}"><div class="${classNames.welcomeMessageContent}">------------------------------------------</div></div>`
        };

        const modifiers = { ctrlKey: true };
        const keyShortcuts = {
            modifiers,
            hopToRoomWithLastMessageUpdate: {
                ...modifiers,
                code: 'KeyQ',
            },
        };

        return {
            ids,
            classNames,
            attributes,
            selectors,
            keyShortcuts,
            delays,
            newContentSeparator,
        };
    })();

    /**
     * Deferred initialization of the containers for ctabs and messages.
     * @property {HTMLElement|null} ctabs - The container element for ctabs.
     * @property {HTMLElement|null} messages - The container element for messages.
     */
    const containers = {};
    try {
        [containers.ctabs, containers.messages] = await Promise.all([
            UTILS.trySelectElement({ selectors: CONFIG.selectors.containers.ctabs }),
            UTILS.trySelectElement({ selectors: CONFIG.selectors.containers.messages }),
        ]);
    } catch (error) {
        console.error('Epik Chat Room Hop Shortcuts - Failed to select containers', error);
        throw error;
    }

    /**
     * This module observes changes in the chat rooms and keeps track of the last displayed message and the last message not yet displayed for each room.
     *
     * @module RoomsObserver
     */
    const RoomsObserver = (() => {
        /**
         * Last displayed message for each room.
         * @type {Object.<string, MessageObject>}
         */
        const lastMessageDisplayed = {};

        /**
         * Notification info about the last not yet displayed message for each room.
         * @type {Object.<string, MessageNotification>}
         */
        const messagesNotDisplayed = {};

        /**
         * Listeners for new messages in the active room tab.
         * @type {Set<function(MessageObject): void>}
         */
        const listenersDisplayed = new Set();

        /**
         * Listeners for message update notifications in rooms of non active tabs.
         * @type {Set<function(MessageNotification): void>}
         */
        const listenersNotDisplayed = new Set();

        /**
         * Callback function to handle room tab change.
         *
         * @callback RoomTabChangeListener
         * @param {Room} currentRoom - The currently active room.
         * @param {Room} previousRoom - The previously active room.
         * @returns {void}
         */

        /**
         * Listeners for message update notifications in rooms of non active tabs.
         * @type {Set<RoomTabChangeListener>}
         */
        const listenersActiveRoomTabChange = new Set();

        /**
         * Represents a message update displayed in the active tab or a notification about one not displayed yet.
         * @class MessageNotificationObject
         */
        class MessageNotification {
            /**
             * A notification about a message update in a non active room tab.
             * @param {object} param0
             * @param {string} param0.roomId - The room id.
             * @param {number} param0.timeStamp - The timestamp when the message was received.
             * @param {number} param0.notificationCount - The count of notifications not yet displayed for the room
             */
            constructor({ roomId, notificationCount, roomTitle = '', timeStamp = Date.now() } = {}) {
                if (!roomId) {
                    throw new Error('roomId is required');
                }
                if (typeof notificationCount !== 'number') {
                    throw new Error('notificationCount must be a number');
                }
                this.roomId = roomId;
                this.roomTitle = roomTitle;
                this.notificationCount = notificationCount;
                this.timeStamp = timeStamp;
            }
        }

        class MessageObject {
            /**
             * A new message displayed in the active room tab.
             * @param {object} param0
             * @param {string} param0.roomId - The room id.
             * @param {string} param0.messageId - The message id.
             * @param {number} param0.timeStamp=Date.now() - The timestamp when the message was received.
             */
            constructor({ roomId, messageId, timeStamp = Date.now() } = {}) {
                if (!roomId) {
                    throw new Error('roomId is required');
                }
                if (!messageId) {
                    throw new Error('messageId is required');
                }
                this.messageId = messageId;
                this.timeStamp = timeStamp;
            }
        }

        /**
         * Keeps track of the last displayed message.
         */
        const displayedMessagesObserver = new MutationObserver((mutationsList) => {
            const activeRoomTab = containers.ctabs.querySelector(`${CONFIG.selectors.activeRoomTab}[${CONFIG.attributes.dataRid}]`);
            if (!activeRoomTab) {
                return;
            }
            const roomId = activeRoomTab.getAttribute(CONFIG.attributes.dataRid);

            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const messages = Array.from(mutation.addedNodes).filter(node => node.matches(CONFIG.selectors.chatMessage));
                    if (!messages.length) {
                        return;
                    }

                    const lastMessage = messages[messages.length - 1];
                    const messageId = lastMessage.getAttribute(CONFIG.attributes.dataItemId);
                    if (messageId && roomId) {

                        const messageObj = new MessageObject({ roomId, messageId });
                        setTimeout(() => {
                            lastMessageDisplayed[roomId] = messageObj;
                        }, CONFIG.delays.messageReadDelayMs);

                        listenersDisplayed.forEach(listener => listener(messageObj));
                    }
                }
            }
        });

        const tabObserver = (() => {
            let lastActiveRoomId = 0;

            return new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (
                        mutation.type === 'attributes'
                        && mutation.attributeName === 'class'
                        && mutation.target.classList.contains('active')
                    ) {
                        const activeRoom = Room.getActive();
                        if (activeRoom && activeRoom.roomId !== lastActiveRoomId) {

                            const previousRoom = new Room(lastActiveRoomId);
                            listenersActiveRoomTabChange.forEach(listener => listener(activeRoom, previousRoom));

                            lastActiveRoomId = activeRoom.roomId;
                            return;
                        }
                    }
                }
            });
        })();

        /**
         * Keeps track of the notification badges about new messages not yet displayed. (while the room tab isn't the active one)
         */
        const unReadMessageCountObserver = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.TEXT_NODE && node.parentElement && node.parentElement.classList.contains(CONFIG.classNames.notifyCount)) {
                            const roomTabElement = node.parentElement.closest(CONFIG.selectors.roomTabContainer);
                            if (roomTabElement) {
                                const roomId = roomTabElement.getAttribute(CONFIG.attributes.dataRid);
                                const notificationCount = parseInt(node.textContent);
                                const roomTitle = roomTabElement.closest('li')?.getAttribute(CONFIG.attributes.dataOriginalTitle);
                                if (!roomId) {
                                    return;
                                }

                                if (notificationCount === 0 && messagesNotDisplayed.hasOwnProperty(roomId)) {
                                    // all messages displayed in the active room tab
                                    delete messagesNotDisplayed[roomId];
                                    return;
                                }

                                if (notificationCount > (messagesNotDisplayed[roomId]?.notificationCount || 0)) {
                                    // notification about a new message, in a room tab that isn't the active one
                                    const messageNotification = new MessageNotification({
                                        roomId,
                                        notificationCount,
                                        roomTitle,
                                        timeStamp: Date.now()
                                    });

                                    messagesNotDisplayed[roomId] = messageNotification;
                                    listenersNotDisplayed.forEach(listener => listener(messageNotification));
                                }
                            }
                        }
                    });
                }
            }
        });

        // Start observing
        displayedMessagesObserver.observe(containers.messages, { childList: true });
        unReadMessageCountObserver.observe(containers.ctabs, { childList: true, subtree: true });
        tabObserver.observe(containers.ctabs, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });

        return {
            /**
             * Gets the latest message notification of a not yet displayed message.
             *
             * @param {string} roomId
             * @returns {MessageNotification|null} Info with timestamp and count of the last message not yet displayed for the specified room.
             */
            getLastMessageNotification(roomId = null) {
                if (roomId) {
                    return messagesNotDisplayed[roomId] || null;
                }
                return Object.values(messagesNotDisplayed).sort((a, b) => b.timeStamp - a.timeStamp)[0] || null;
            },

            /**
             * Gets the latest message displayed in the active room tab.
             *
             * @param {string} roomId
             * @returns {MessageObject|null}
             */
            getLastDisplayedMessage(roomId = null) {
                if (roomId) {
                    return lastMessageDisplayed[roomId] || null;
                }
                return Object.values(lastMessageDisplayed).sort((a, b) => b.timeStamp - a.timeStamp)[0] || null;
            },

            /**
             * Registers a listener for notifications of not yet displayed messages.
             *
             * @param {function(MessageNotification): void} listener - The callback function to handle message notifications.
             */
            registerListenerForNonDisplayedMessage(listener) {
                if (!listenersNotDisplayed.has(listener)) {
                    listenersNotDisplayed.add(listener);
                }
            },

            /**
             * Registers a listener for messages being displayed.
             *
             * @param {function(MessageObject): void} listener - The callback function to handle message notifications.
             */
            registerListenerForDisplayedMessage(listener) {
                if (!listenersDisplayed.has(listener)) {
                    listenersDisplayed.add(listener);
                }
            },

            /**
             * Registers a listener for when a new room tab is activated.
             *
             * @param {RoomTabChangeListener} listener - The callback function to handle room tab change.
             */
            registerListenerForActiveRoomTabChange(listener) {
                if (!listenersActiveRoomTabChange.has(listener)) {
                    listenersActiveRoomTabChange.add(listener);
                }
            },

            unregisterListener(listener) {
                for (const listeners of [listenersDisplayed, listenersNotDisplayed, listenersActiveRoomTabChange]) {
                    listeners.delete(listener);
                }
            }
        };
    })();

    class Room {
        constructor(roomId) {
            this.roomId = roomId;
        }

        /**
         * @returns {Node|null} The room tab container node or null if the room tab container is not found.
         */
        get tabContainer() {
            return containers.ctabs.querySelector(`${CONFIG.selectors.roomTabContainer}[${CONFIG.attributes.dataRid}="${this.roomId}"]`) || null;
        }

        /**
         * @returns {number} The index of the room tab container or -1 if the room tab container is not found.
         */
        get tabIndex() {
            const roomTabs = containers.ctabs.querySelectorAll(CONFIG.selectors.roomTabContainer);
            return Array.from(roomTabs).findIndex(roomTab => roomTab.getAttribute(CONFIG.attributes.dataRid) === this.roomId);
        }

        /**
         * @returns {boolean} True if this room is the one associate to the current active room tab, false otherwise.
         */
        get isActive() {
            return this.tabContainer && this.tabContainer.matches(CONFIG.selectors.activeRoomTab);
        }

        get lastDisplayMessageId() {
            return RoomsObserver.getLastDisplayedMessage(this.roomId)?.messageId || null;
        }

        get lastDiplayedMessage() {
            if (!this.lastDisplayMessageId) {
                return null;
            }
            return containers.messages.querySelector(`.${CONFIG.classNames.chatMessageItem}[${CONFIG.attributes.dataItemId}="${this.lastDisplayMessageId}"]`);
        }

        static getActive() {
            const activeRoomTab = containers.ctabs.querySelector(CONFIG.selectors.activeRoomTab);
            if (!activeRoomTab) {
                return null;
            }
            return new Room(activeRoomTab.getAttribute(CONFIG.attributes.dataRid));
        }

        static byIndex(index) {
            if (index < 0) {
                return null;
            }
            const allRooms = Room.forAllTabs();
            return index <= allRooms.length ? allRooms[index] : null;
        }

        static forAllTabs() {
            const roomTabs = containers.ctabs.querySelectorAll(CONFIG.selectors.roomTabContainer);
            return Array.from(roomTabs).map(roomTab => new Room(roomTab.getAttribute(CONFIG.attributes.dataRid)));
        }

        /**
         * Activates the room tab associated with this room.
         *
         * @returns {boolean} True if the room tab was found and got activated, false otherwise.
         */
        hopTo() {
            if (this.isActive) {
                return true;
            }
            if (this.tabContainer) {
                this.tabContainer.click();
                return true;
            }
            return false;
        }
    }

    /**
     * RoomHop class for managing room hopping shortcuts.
     * @class RoomHop
     */
    const RoomHop = (() => {
        let badgeCreationSemaphores = {};
        const blockBadgeCreation = (roomHop, minTimeOutMs = 0) => badgeCreationSemaphores[roomHop.tabIndex] = {
            isBlocked: true,
            til: Date.now() + minTimeOutMs
        };
        const unblockBadgeCreation = (roomHop) => delete badgeCreationSemaphores[roomHop.tabIndex];
        const isBadgeCreationInProgress = (roomHop) => badgeCreationSemaphores[roomHop.tabIndex]?.isBlocked || false;
        const getBadgeCreationTimeout = (roomHop) => {
            if (!isBadgeCreationInProgress(roomHop) || !badgeCreationSemaphores[roomHop.tabIndex]?.til) {
                return 0;
            }
            return Math.max(badgeCreationSemaphores[roomHop.tabIndex].til - Date.now(), 0);
        };
        const createBadgeId = (roomHop) => `${CONFIG.classNames.roomTabShortcut}-${roomHop.hotkeyDigit}`;

        return class RoomHop {
            constructor(tabIndex, hotkeyDigit) {
                this.tabIndex = tabIndex;
                this.hotkeyDigit = hotkeyDigit;
            }

            getBadge() {
                return document.getElementById(createBadgeId(this));
            }

            createBadge(timeOutMs = 0) {
                if (isBadgeCreationInProgress(this) || this.getBadge()) {
                    return;
                }

                blockBadgeCreation(this);
                setTimeout(() => {
                    // Create notify badge with the hotkey digit
                    const notifyBadge = document.createElement('div');
                    notifyBadge.id = createBadgeId(this);
                    notifyBadge.classList.add(CONFIG.classNames.roomTabShortcut, CONFIG.classNames.notifyBadge);

                    const span = document.createElement('span');
                    span.classList.add(CONFIG.classNames.imgCircle);

                    span.textContent = this.hotkeyDigit;
                    notifyBadge.appendChild(span);

                    const room = Room.byIndex(this.tabIndex);

                    if (room) {
                        room.tabContainer?.prepend(notifyBadge);
                    }

                    unblockBadgeCreation(this);
                }, timeOutMs);
            }

            async removeBadge() {
                while (isBadgeCreationInProgress(this)) {
                    await new Promise(resolve => setTimeout(resolve, getBadgeCreationTimeout(this)));
                }

                const roomHopBadge = this.getBadge();
                if (roomHopBadge) {
                    roomHopBadge.remove();
                }
            }

            hop() {
                Room.byIndex(this.tabIndex)?.hopTo();
            }
        };
    })();

    /**
     * Module for handling the room hopping shortcut for the room with the last undisplayed chat message update.
     */
    const messageNotificationObserver = (() => {
        const hotKeyChar = CONFIG.keyShortcuts.hopToRoomWithLastMessageUpdate.code.slice(-1);
        let roomHopLastMessage = new RoomHop(-1, hotKeyChar);

        /**
         * Handler for a notification about a new message in a room tab that isn't the active one.
         *
         * @param {MessageNotification} messageNotification
         */
        const displayRoomHopHotkey = (messageNotification) => {
            if (messageNotification?.roomId && messageNotification?.notificationCount > 0) {

                const tabIndex = new Room(messageNotification.roomId)?.tabIndex;

                if (tabIndex !== roomHopLastMessage.tabIndex || !roomHopLastMessage.getBadge()) {
                    roomHopLastMessage.removeBadge();
                    roomHopLastMessage = new RoomHop(tabIndex, roomHopLastMessage.hotkeyDigit);
                    roomHopLastMessage.createBadge();
                }
            }
        };

        return {
            registerListener: () => {
                displayRoomHopHotkey(RoomsObserver.getLastMessageNotification());
                RoomsObserver.registerListenerForNonDisplayedMessage(displayRoomHopHotkey);
            },
            unregisterListener: () => {
                roomHopLastMessage.removeBadge();
                RoomsObserver.unregisterListener(displayRoomHopHotkey);
            },
            get roomHop() {
                return roomHopLastMessage;
            }
        };
    })();

    console.log('EpikChat Room Hop Shortcuts - is running');

    // create fixed room hops 1 - 9
    const roomHops = Array.from({ length: 10 }, (_, index) => {
        const hotkeyDigit = (index + 1) % 10;
        return new RoomHop(index, hotkeyDigit);
    });

    document.addEventListener('keydown', (event) => {
        // add keyboard shortcut badges for indiced tabs
        if (UTILS.areKeysPressed(event, CONFIG.keyShortcuts.modifiers)) {
            roomHops.forEach((roomHop) => {
                roomHop.createBadge(CONFIG.delays.badgeChangeMs);
            });

            // add keyboard shortcut badge that is live following the most recent message update of any inactive room tab
            messageNotificationObserver.registerListener();

            // perform room hopping if the right shortcut keys are pressed
            for (let roomHop of [...roomHops, messageNotificationObserver.roomHop]) {
                if (UTILS.areKeysPressed(event, { code: `Digit${roomHop.hotkeyDigit}` })
                    || UTILS.areKeysPressed(event, { code: `Key${roomHop.hotkeyDigit}` })) {

                    event.preventDefault();
                    event.stopPropagation();

                    // click the room tab and restore the badge at the activated room tab
                    roomHop.hop();
                    roomHop.createBadge(CONFIG.delays.badgeChangeMs);
                    return;
                }
            }
        }
    });

    document.addEventListener('keyup', (event) => {
        // remove keyboard shortcut badges of indiced room tabs
        if (!UTILS.areKeysPressed(event, CONFIG.keyShortcuts.modifiers)) {

            event.preventDefault();
            event.stopPropagation();

            roomHops.forEach((roomHop) => {
                roomHop.removeBadge();
            });
            // remove keyboard shortcut badge for the room tab with "most recent message update"
            messageNotificationObserver.unregisterListener();
        }
    });

    RoomsObserver.registerListenerForActiveRoomTabChange((currentRoom, _previousRoom) => {
        const lastDisplayMessage = currentRoom.lastDiplayedMessage;
        if (!lastDisplayMessage) {
            return;
        }

        let separator = document.querySelector(`#${CONFIG.ids.newContentSeparator}`);
        if (!separator) {
            separator =
                Object.assign(document.createElement('div'), CONFIG.newContentSeparator);
        }
        lastDisplayMessage.insertAdjacentElement('afterend', separator);
    });
})();
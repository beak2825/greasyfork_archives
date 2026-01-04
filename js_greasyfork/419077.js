// ==UserScript==
// @name            Camamba Chat Tweaks
// @namespace       dannysaurus.camamba
// @version         0.5.14
// @description     tweaks layout of the chat
// @license         MIT License
//
// @include         https://www.camamba.com/chat/
// @include         https://www.de.camamba.com/chat/
//
// @connect         camamba.com
// @grant           GM_xmlhttpRequest
//
// @require         https://greasyfork.org/scripts/405143-simplecache/code/SimpleCache.js
// @require         https://greasyfork.org/scripts/405144-httprequest/code/HttpRequest.js?version=1106047
// @require         https://greasyfork.org/scripts/391854-enum/code/Enum.js
// @require         https://greasyfork.org/scripts/405699-camamba-user/code/Camamba%20User.js
//
// @require         https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
//
// @require         https://greasyfork.org/scripts/423722-camamba-chat-helpers-library/code/Camamba%20Chat%20Helpers%20Library.js?version=960246
// @require         https://greasyfork.org/scripts/423662-camamba-chat-settings/code/Camamba%20Chat%20Settings.js?version=913122
// @require         https://greasyfork.org/scripts/423665-camamba-hook-into-onmessage/code/Camamba%20Hook%20Into%20OnMessage.js?version=1180072
//
// @grant           GM.getValue
// @grant           GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/419077/Camamba%20Chat%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/419077/Camamba%20Chat%20Tweaks.meta.js
// ==/UserScript==

// https://greasyfork.org/de/scripts/419077-camamba-chat-tweaks

/* jslint esnext: true */
/* globals knownUsers, me */
(function () {
    'use strict';
    // --- initial sizes ---
    const SIZES = {
        FONT_EM: {
            userList: 1.2,
            chatBox: 1.8,
        },
        WIDTH_EM: {
            sidebarLeft: 10,
            sidebarRight: 14,
        },
    };

    // --- HTML Selector Helpers ---
    const SELECTORS = {
        ID: {
            // original
            userList: 'userList',
            chatBox: 'chatBox',
            chatInput: 'chatInput',
            chatWindow: 'chatWindow',
            mediaContainer1: 'mediaContainer1',
            mediaContainer2: 'mediaContainer2',
            mediaContainer3: 'mediaContainer3',
            mediaContainer4: 'mediaContainer4',
            mediaContainer5: 'mediaContainer5',
            mediaContainer6: 'mediaContainer6',
            mediaContainer7: 'mediaContainer7',
            mediaContainer8: 'mediaContainer8',

            // script
            cbCamslots: 'cb-camslots',
            spinnerUserlistFont: 'spinner-userlist-font',
            spinnerChatFont: 'spinner-chat-font',
            unamePermaInput: 'uname-perma-input',
            cbPrivateConvo: 'cb-privateConvo',
        },
        CLASS: {
            noTextSelect: 'noTextSelect',
            borderBox: 'borderBox',
            camBox: 'camBox'
        }
    };

    const containers = (() => {
        let userList, chatBox, sidebars, camslots;

        return {
            get userList() {
                if (typeof userList === "undefined") {
                    userList = document.getElementById(SELECTORS.ID.userList);
                }
                return userList;
            },

            get chatBox() {
                if (typeof chatBox === "undefined") {
                    chatBox = document.getElementById(SELECTORS.ID.chatBox);
                }
                return chatBox;
            },

            get sidebars() {
                if (typeof sidebars === "undefined") {
                    sidebars = document.getElementById(SELECTORS.ID.chatWindow).querySelectorAll(`.${SELECTORS.CLASS.noTextSelect}`);
                }
                return sidebars;
            },

            get sidebarLeft() {
                return this.sidebars[0];
            },

            get sidebarTop() {
                return this.sidebars[1];
            },

            get sidebarRight() {
                return this.sidebars[2];
            },

            get camslots() {
                if (typeof camslots === "undefined") {
                    const parentContainers = [
                        SELECTORS.ID.mediaContainer1,
                        SELECTORS.ID.mediaContainer2,
                        SELECTORS.ID.mediaContainer3,
                        SELECTORS.ID.mediaContainer4,
                        SELECTORS.ID.mediaContainer5,
                        SELECTORS.ID.mediaContainer6,
                        SELECTORS.ID.mediaContainer7,
                        SELECTORS.ID.mediaContainer8,
                    ]
                        .map(id => document.getElementById(id))
                        .filter(el => el !== null)
                        .map(el => el.parentNode);

                    camslots = [...new Set(parentContainers)];
                }
                return camslots;
            }
        };
    })();

    const layoutPatcher = new class {
        constructor() {
            this.historyCamslotsRemoved = [];
        }

        patchSizes() {
            // this.setWidthOfSidebarLeft(`${SIZES.WIDTH_EM.sidebarLeft}em`);
            this.setWidthOfSidebarRight(`${SIZES.WIDTH_EM.sidebarRight}em`);
            return this;
        }

        setFontSizeOfUserList(fontSize) {
            containers.userList.style.fontSize = fontSize;
            return this;
        }

        setFontSizeOfChat(fontSize) {
            containers.chatBox.style.fontSize = fontSize;
            return this;
        }

        setWidthOfSidebarLeft(width) {
            containers.sidebarLeft.style.width = width;
            return this;
        }

        setWidthOfSidebarRight(width) {
            containers.sidebarLeft.style.width = width;
            return this;
        }

        showCamslots() {
            for (let i = 0; i < this.historyCamslotsRemoved.length; i++) {
                const { parent, index, element } = this.historyCamslotsRemoved.pop();
                parent.insertBefore(element, parent.children[index]);
            }
            return this;
        }

        hideCamslots() {
            for (let element of containers.camslots) {
                const parent = element.parentNode;
                if (parent) {
                    let index = Array.from(parent.children).indexOf(element);
                    parent.removeChild(element);

                    this.historyCamslotsRemoved.push({ parent, index, element });
                }
            }
            return this;
        }
    }();


    const controls = (() => {
        // --- HTML Create Element Helpers ---
        const createInput = ({
            id,
            parentElement = null,
            type = 'text',
            defaultValue = '',
            labelText = null,
            onValueChange = null,
            propertyNameValue = 'value',
            eventNameValueChange = 'input',
        }) => {
            const div = document.createElement('div');

            const input = div.appendChild(document.createElement('input'));
            input.type = type;
            input.id = id;
            input.style.backgroundColor = 'rgba(39,62,77,1)';

            if (labelText) {
                const label = div.appendChild(document.createElement('label'));
                label.htmlFor = id;
                label.appendChild(document.createTextNode(labelText));
            }

            if (onValueChange) {
                let oldValue;

                input.addEventListener(eventNameValueChange, () => {
                    const newValue = input[propertyNameValue];
                    if (oldValue !== newValue) {
                        oldValue = newValue;

                        onValueChange(newValue);
                    }
                });
            }

            if (parentElement) {
                parentElement.appendChild(div);
            }
            return input;
        };

        const createInputPersistent = ({
            id,
            parentElement = null,
            type = 'text',
            defaultValue = '',
            labelText = null,
            onValueChange = null,
            propertyNameValue = 'value',
            eventNameValueChange = 'input',
        }) => {
            const input = createInput({
                parentElement, type, id, defaultValue, labelText, propertyNameValue, eventNameValueChange,
                onValueChange: value => {
                    GM.setValue(id, value);
                    if (onValueChange) {
                        onValueChange(value);
                    }
                }
            });

            input.setValue = value => {
                GM.setValue(id, value);
                input[propertyNameValue] = value;
                onValueChange(value);
            };

            input.updateValue = () => GM.getValue(id, defaultValue).then(value => {
                input[propertyNameValue] = value;
                if (onValueChange) {
                    onValueChange(value);
                }
            });

            return input;
        };

        const createCheckbox = ({
            id,
            parentElement = null,
            initialChecked = false,
            labelText = null,
            onValueChange = null,
        }) => {
            const checkbox = createInputPersistent({
                parentElement, id, labelText, onValueChange,
                defaultValue: !!initialChecked,
                type: 'checkbox',
                propertyNameValue: 'checked',
                eventNameValueChange: 'click',
            });
            return checkbox;
        };

        const createSpinner = ({
            id, min, max, step,
            parentElement = null,
            defaultValue = 0,
            labelText = null,
            onValueChange = null,
        }) => {
            const spinner = createInputPersistent({
                parentElement, id, defaultValue, labelText, onValueChange,
                type: 'number',
            });
            spinner.min = min;
            spinner.max = max;
            spinner.step = step;

            const buttonDec = spinner.parentNode.insertBefore(document.createElement('button'), spinner);
            buttonDec.type = 'button';
            buttonDec.innerHTML = '-';
            buttonDec.addEventListener('click', () => {
                spinner.stepDown();
                spinner.setValue(spinner.value);
            });

            const buttonInc = spinner.parentNode.insertBefore(document.createElement('button'), spinner.nextSibling);
            buttonInc.type = 'button';
            buttonInc.innerHTML = '+';
            buttonInc.addEventListener('click', () => {
                spinner.stepUp();
                spinner.setValue(spinner.value);
            });

            return spinner;
        };

        const sidebarLeftCenter = containers.sidebarLeft.children[1];
        sidebarLeftCenter.innerHTML = "";
        const container = sidebarLeftCenter.appendChild(document.createElement('div'));

        // checkbox camslots on/off
        const cbCamslots = createCheckbox({
            parentElement: container,
            id: SELECTORS.ID.cbCamslots,
            initialChecked: true,
            labelText: 'camslots',
            onValueChange: value => {
                if (value) {
                    layoutPatcher.showCamslots();
                } else {
                    layoutPatcher.hideCamslots();
                }
            },
        });

        // spinner userlist font
        const spinnerUserlistFont = createSpinner({
            parentElement: container,
            id: SELECTORS.ID.spinnerUserlistFont,
            defaultValue: SIZES.FONT_EM.userList,
            min: 1.0,
            max: 3.2,
            step: 0.1,
            labelText: 'users',
            onValueChange: value => {
                const fontSize = `${value}em`;
                layoutPatcher.setFontSizeOfUserList(fontSize);
            },
        });

        // spinner chat font
        const spinnerChatFont = createSpinner({
            parentElement: container,
            id: SELECTORS.ID.spinnerChatFont,
            defaultValue: SIZES.FONT_EM.chatBox,
            min: 1.0,
            max: 5.5,
            step: 0.1,
            labelText: 'chat',
            onValueChange: value => {
                const fontSize = `${value}em`;
                layoutPatcher.setFontSizeOfChat(fontSize);
            },
        });

        const buttonKickFromCam = container.appendChild(document.createElement('button'));
        buttonKickFromCam.type = 'button';
        buttonKickFromCam.innerHTML = 'Kick from cam';
        buttonKickFromCam.addEventListener('click', () => {
            knownUsers.bySelected().stopViewing();
        });

        if (me.admin) {
            const labelUnamePerma = container.appendChild(document.createElement('label'));
            labelUnamePerma.type = 'text';
            labelUnamePerma.for = "uname-perma";
            labelUnamePerma.innerHTML = 'Username Perma';

            const inputUnamePerma = container.appendChild(document.createElement('input'));
            inputUnamePerma.type = 'text';
            inputUnamePerma.id = SELECTORS.ID.unamePermaInput;
            inputUnamePerma.name = 'uname-perma';

            const buttonPerma = container.appendChild(document.createElement('button'));
            buttonPerma.type = 'button';
            buttonPerma.innerHTML = 'perma';
            buttonPerma.addEventListener('click', () => {
                const unamePerma = document.getElementById(SELECTORS.ID.unamePermaInput).value;
                if (unamePerma) {
                    knownUsers.addExact(unamePerma).then(() => knownUsers.byName(unamePerma).banPermaFast(""));
                } else {
                    knownUsers.bySelected().ban("You are permanently banned from Camamba. Please do not create any additional accounts!", 24, { isPublic: true, isPerma: true, suppressBanLog: false });
                }
            });
        }

        const isGerman = location.hostname === "www.de.camamba.com";


        let oldPrivateHandler = null;

        // checkbox camslots on/off
        const cbPrivateConvo = createCheckbox({
            parentElement: container,
            id: SELECTORS.ID.cbPrivateConvo,
            initialChecked: true,
            labelText: isGerman ? 'PN ablehnen ohne Freundschaft' : 'PM denie withouth friendship',
            onValueChange: (value) => {
                if (value) {
                    if (!oldPrivateHandler && onMessageHandlers.private) {
                        oldPrivateHandler = onMessageHandlers.private;
                        console.log("Alter Handler gesichert.", oldPrivateHandler.toString());
                    }
                    /** 
                     * @param {{ id: number }} data  
                     * @return {boolean} - true if further handling is required, false if action is fully handled
                     */
                    onMessageHandlers.private = (data) => {
                        if (!data.id) {
                            return true;
                        }
                        const user = knownUsers[data.id];
                        if (!user) {
                            console.log(`Unknown user with id ${data.id} requesting ${"privConvo"}.`);
                            return false;
                        }

                        if (!user.friend) {
                            wsSend({ command: "control", target: data.id, request: "privReject" });
                            console.log(`PN von ${user.name} abgelehnt`)
                            return false;
                        }
                        console.log(`PN von ${user.name} erlaubt`)
                        console.log("Alter Handler ausgeführt.")
                        if (typeof oldPrivateHandler === 'function') {
                            return oldPrivateHandler(data);
                        }
                        return true;
                    };
                } else {
                    if (oldPrivateHandler) {
                        onMessageHandlers.private = oldPrivateHandler;
                        console.log("Alter Handler wiederhergestellt.")
                    }
                }
            },
        });

        return {
            cbCamslots,
            spinnerUserlistFont,
            spinnerChatFont,
            cbPrivateConvo,
        };
    })();

    const wait = async (ms) => new Promise(res => setTimeout(res, ms));
    (async () => {
        // wait until websocket has been connected
        while (typeof initSettings !== 'function') {
            await wait(100);
        }

        const original = initSettings;
        initSettings = () => {
            original();

            // Breite von Userliste anpassen
            layoutPatcher.patchSizes();

            // weiterere Einstellungen überschreiben, bzw übernehmen
            for (let control of [controls.cbCamslots, controls.spinnerUserlistFont, controls.spinnerChatFont, controls.cbPrivateConvo]) {
                control.updateValue();
            }
        };
    })();

    (async () => {
        let lastBanData = { userId: 0, text: '', time: 0, isPerma: false };

        while (typeof adminExec !== 'function') {
            await wait(100);
        }

        adminExec();

        if (currentAdminAction == "ban") {
            let userId, text, time, isPerma;

            text = byId('adminMessageInput').value;
            if (!text || text.length <= 3 && byId('adminMessageSelect').selectedIndex) {
                text = adminMessages[currentAdminAction][byId('adminMessageSelect').value];
            }

            userId = currentAdminTarget;
            time = parseInt(byId('banTime').value);
            isPerma = byId('permaBan') && byId('permaBan').checked;

            if (userId && text > 3 && time) {
                lastBanData = { userId, text, time, isPerma };
            }
        }
    })();


    (async () => {
        while (document.getElementById(SELECTORS.ID.chatInput) === null) {
            await wait(100);
        }
        document.getElementById(SELECTORS.ID.chatInput).setAttribute('autoComplete', 'on');
    })();

    console.log("running camamba chat tweaks")
})();
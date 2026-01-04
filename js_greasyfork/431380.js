// ==UserScript==
// @name         Popmundo chat
// @name:tr      Popmundo Sohbet
// @namespace    bheuv.dev
// @version      1.4
// @description  Adds instant public chat boxes to locales, cities, social clubs and the community page
// @description:tr Mekanlara, şehirlere, sosyal kulüplere ve hoş geldiniz sayfasına anlık sohbet edebileceğiniz odalar ekler.
// @author       Ian Parsons (105997)
// @match        https://*.popmundo.com/*
// @icon         https://www.google.com/s2/favicons?domain=popmundo.com
// @require      https://unpkg.com/socket.io@4.1.3/client-dist/socket.io.min.js
// @require      https://unpkg.com/vue@3.2.6/dist/vue.global.prod.js
// @require      https://unpkg.com/dayjs@1.10.6/dayjs.min.js
// @require      https://unpkg.com/uuid@8.3.2/dist/umd/uuidv4.min.js
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/431380/Popmundo%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/431380/Popmundo%20chat.meta.js
// ==/UserScript==
const hostOrigin = 'https://botmundo.bheuv.dev:3005';
const chatImagePath = 'https://botmundo.bheuv.dev/pm-chat'; // Hosting this seperately because Popmundo does not links that specify a port
const scriptLink = 'https://greasyfork.org/en/scripts/431380-popmundo-chat';

(function() {
    'use strict';

    let parseCharacterData = function() {
        // This must be done to make the authenticated character known to the script
        try {
            if (window.location.href.indexOf('/ChooseCharacter') !== -1) {
                // The select character page discloses the character ids
                let content = document.getElementById('ppm-content');
                let buttons = content.querySelectorAll('input[type="submit"]');
                let characterMap = [];

                for (let i = 0, len = buttons.length; i < len; i++) {
                    let id = buttons[i].parentNode.parentNode.querySelector("div.idHolder").innerText;
                    let name = buttons[i].parentNode.parentNode.querySelector("h2 a").innerText;
                    characterMap[i] = id + ':' + name;
                }

                // Store the data for use on other pages
                window.localStorage.setItem('characterMap', characterMap.join(','));
            } else {
                let characterMap = window.localStorage.getItem('characterMap');

                if (! characterMap) {
                    // Character map is not available; cannot run the script
                    throw new Error("Character map is unavailable!");
                }

                // Charactermap will now be an array of characters with format [id:name]
                characterMap = characterMap.split(',');

                const dropdown = document.querySelector('#character-tools-character select');
                const options = dropdown.querySelectorAll('option');

                const names = [];
                const ids = [];

                // Split character map into a list of names and ids to make searching in the next step easier
                characterMap.forEach((character) => {
                    const [id, name] = character.split(':');
                    names.push(name);
                    ids.push(id);
                });

                // Attempt to match each option in the dropdown menu to a name from the list of names and set the ID that matches that name's index
                for (let i = 0, len = options.length; i < len; i++) {
                    const option = options[i];
                    const index = names.indexOf(option.innerText);

                    if (index !== -1) {
                        option.dataset.id = ids[index];
                    }
                }

                // Now find the authenticated character's id and attach it as data to the document body
                let selectedOption = dropdown.querySelector('option[selected]');
                let selectedValue = selectedOption.dataset.id;

                if (selectedValue) {
                    document.body.dataset.character_name = selectedOption.innerText;
                    document.body.dataset.character_id = selectedValue;
                } else {
                    throw "Failed to parse character data from character select box!";
                }
            }
        } catch (e) {
            console.log("CharacterMap could not be found/built: " + e);
            console.log(e);
        }
    }

    if (! document.querySelector('body').dataset.character_id) {
        parseCharacterData();
    }

    if (! document.querySelector('body').dataset.character_id) {
        // Fallback method
        if (document.location.href.endsWith('.popmundo.com/World/Popmundo.aspx/Character')) {
            const characterName = document.querySelector('div.charPresBox h2').innerText;
            const characterIdentifier = document.querySelector('.idHolder').innerText;

            window.localStorage.setItem('character_name', characterName);
            window.localStorage.setItem('character_id', characterIdentifier);
        }

        if (window.localStorage.getItem('character_id')) {
            document.body.dataset.character_id = window.localStorage.getItem('character_id');
            document.body.dataset.character_name = window.localStorage.getItem('character_name');
        }
    }

    const characterName = document.body.dataset.character_name;
    const characterIdentifier = document.body.dataset.character_id;

    const addStyle = function(style) {
        const styleEl = document.createElement('style');
        styleEl.textContent = style;
        document.head.append(styleEl);
    }

    // Resize property doesn't work on iframes in firefox - this is a workaround
    addStyle(`
    #chat {
        display: grid;
        grid-template-areas:
            "history"
            "controls";
        grid-template-rows: 1fr auto;
        height: 400px;
        min-height: 400px;
        resize: vertical;
        overflow: hidden;
        font-size: 12px;
        font-weight: 400;
        line-height: 1.5;
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    }
    #chat, #chat *, #chat *::before, #chat *::after {
        box-sizing: border-box;
    }
    .message {
        padding: 0.5em;
        background-color: #40444b;
        color: #fff;
        border-radius: 5px;
        margin: 0.25em 0.5em;
        opacity: 1;
        animation: fade 0.15s linear;
    }
    .history {
        grid-area: history;
        max-height: 100%;
        height: 100%;
        margin-top: auto;
        width: 100%;
        overflow-x: hidden;
        overflow-y: scroll;
    }
    .controls {
        grid-area: controls;
        width: 100%;
    }
    #chat.hidden {
        display: none !important;
    }
    .message-author {
        font-weight: bold;
        text-decoration: none;
    }
    .client {
        margin: 0.125em;
        opacity: 1;
        animation: fade 0.15s linear;
    }
    .timestamp {
        float: right;
        user-select:none;
    }
    .clients {
        max-height: 4.5em;
        overflow-y: auto;
        overflow-x: hidden;
    }
    @keyframes fade {
        0% { opacity: 0 }
        100% { opacity: 1 }
    }

    .p-2 {
        padding: 0.5em !important;
    }
    .px-2 {
        padding-right: 0.5em !important;
        padding-left: 0.5em !important;
    }
    .text-center {
        text-align: center !important;
      }

@-webkit-keyframes spinner-border {
    to {
      transform: rotate(360deg) /* rtl:ignore */;
    }
  }

  @keyframes spinner-border {
    to {
      transform: rotate(360deg) /* rtl:ignore */;
    }
  }
  .spinner-border {
    display: inline-block;
    width: 2em;
    height: 2em;
    vertical-align: -0.125em;
    border: 0.25em solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    -webkit-animation: 0.75s linear infinite spinner-border;
    animation: 0.75s linear infinite spinner-border;
  }
  .text-primary {
    color: rgba(13, 110, 253, 1) !important;
  }
.text-info {
    color: rgba(13, 202, 240, 1) !important;
  }
  .text-muted {
    color: #6c757d !important;
  }
  .visually-hidden {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
  }
  .badge {
    display: inline-block;
    padding: 0.35em 0.65em;
    font-size: 0.75em;
    font-weight: 700;
    line-height: 1;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: 0.25em;
  }
  .badge:empty {
    display: none;
  }
  .alert {
    position: relative;
    padding: 1em 1em;
    margin-bottom: 1em;
    border: 1px solid transparent;
    border-radius: 0.25em;
  }
  .alert-danger {
    color: #842029;
    background-color: #f8d7da;
    border-color: #f5c2c7;
  }
  .bg-primary {
    background-color: rgba(13, 110, 253, 1) !important;
  }
  .bg-success {
    background-color: rgba(25, 135, 84) !important;
  }
  .form-control {
    display: block;
    width: 100%;
    padding: 0.375em 0.75em;
    font-size: 1em;
    font-weight: 400;
    line-height: 1.5;
    color: #212529;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border-radius: 0.25em;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }
  .form-control:focus {
    color: #212529;
    background-color: #fff;
    border-color: #86b7fe;
    outline: 0;
    box-shadow: 0 0 0 0.25em rgba(13, 110, 253, 0.25);
  }
  .form-control::placeholder {
    color: #6c757d;
    opacity: 1;
  }

    `);

    const createChatBox = function(resourceType, resourceIdentifier, characterIdentifier, characterName, mountCallback, chatTitle)
    {
        if (!chatTitle) {
            chatTitle = 'Botmundo Chat';
        }

        const wrapper = document.createElement('div');
        wrapper.classList.add('box');
        wrapper.innerHTML = `
            <h2>${chatTitle}</h2>
            <div id="loader" class="text-center p-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
            <div id="chat" class="hidden">
                <div class="history" ref="history">
                    <div class="message" v-for="message in messages" data-uud="message.uuid">
                        <a class="message-author text-info" :href="characterURL(message.character.identifier)">{{ message.character.name }}</a>
                        <span class="timestamp text-muted">{{ renderTimestamp(message.timestamp) }}</span>
                        <div class="message-content">{{ message.content }}</div>
                    </div>
                </div>
                <div class="controls">
                    <div class="px-2 clients">
                        People here: <a class="client" :href="characterURL(client.identifier)" v-for="client in clients">
                            <span :class="{'badge': true, 'bg-primary': client.identifier !== user.identifier, 'bg-success': client.identifier === user.identifier}">{{ client.name }}</span>
                        </a>
                    </div>
                    <form @submit.prevent="sendMessage">
                        <div class="p-2">
                            <input class="form-control" type="text" v-model="message" placeholder="Say something..." maxlegth="1024" />
                        </div>
                    </form>
                </div>
            </div>
        `;

        mountCallback(wrapper);
        connect(wrapper, {
            character: {
                identifier: characterIdentifier,
                name: characterName
            },
            resource: {
                identifier: resourceIdentifier,
                type: resourceType
            }
        });
    }

    const connect = (element, data) => {
        const baseUrl = document.location.origin;
        const chatWindow = element.querySelector('#chat');
        const loader = element.querySelector('#loader');

        const socket = io(hostOrigin, {
            auth: {
                user_identifier: data.character.identifier,
                user_name: data.character.name,
                user_token: null,
                resource_type: data.resource.type,
                resource_identifier: data.resource.identifier
            }
        });

        socket.on('connect_error', (data) => {
            loader.innerHTML = `<div class="alert alert-danger" role="alert"><strong>Cannot connect:</strong><br /><p>${data}</p></div>`;
        });

        socket.on('connect', () => {
            // Initialize UI
            unsafeWindow.Vue = Vue;
            const app = Vue.createApp({
                props: ['user'],
                data() {
                    return {
                        message: '',
                        messages: [],
                        clients: [],
                        autoScroll: true
                    }
                },
                methods: {
                    sendMessage() {
                        if (this.message.length < 1) {
                            return;
                        }

                        socket.emit('message', {
                            content: this.message
                        });

                        this.message = '';
                    },

                    characterURL(id) {
                        return `${baseUrl}/World/Popmundo.aspx/Character/${id}`;
                    },
                    renderTimestamp(timestamp) {
                        return dayjs(timestamp).format('MMM DD @ HH:mm');
                    }
                },
                mounted() {
                    socket.on('message', (message) => {
                        this.messages.push(message);

                        const element = this.$refs.history;
                        if (element.scrollTop === (element.scrollHeight - element.offsetHeight)) {
                            // User was scrolled all the way down - ensure it stays that way
                            this.$nextTick(() => {
                                this.$refs.history.scrollTop = this.$refs.history.scrollHeight;
                            });
                        }
                    });

                    socket.on('history', (message) => {
                        this.messages = message.messages;
                        this.$nextTick(() => {
                            this.$refs.history.scrollTop = this.$refs.history.scrollHeight;
                        });
                    });

                    socket.on('clients', (message) => {
                        // Remove duplicate names
                        const set = new Set();
                        this.clients = message.clients.filter(c => {
                            if (set.has(c.identifier)) return false;
                            set.add(c.identifier);
                            return true;
                        });
                    });
                }
            }, {user: data.character});

            chatWindow.classList.remove('hidden');
            loader.classList.add('hidden');
            app.mount(chatWindow);
        });
    }

    (function() {
        // Add chat button on editor
        const editors = document.querySelectorAll('.editor .buttons:nth-of-type(1)');

        const generateChatCode = function(event) {
            event.preventDefault();
            const chatCode = `[image=${chatImagePath}/${uuidv4()}.png link=${scriptLink}]`;
            const editor = event.target.parentElement.parentElement.querySelector('textarea');
            editor.value = editor.value.substring(0, editor.selectionStart) + chatCode + editor.value.substring(editor.selectionEnd, editor.value.length);
        };

        for (let editor of editors) {
            const element = document.createElement('a');
            element.innerText = 'Chat';
            element.classList.add('button');
            element.href = '#';
            element.addEventListener('click', generateChatCode);
            editor.append(element);
        }

        const customCandidates = document.querySelectorAll('div.tbc a img.userimage');
        const customRegex = /([a-zA-Z0-9\-]+).png/i;

        for (let candidate of customCandidates) {
            if (! candidate.src.startsWith(chatImagePath)) continue;
            const match = customRegex.exec(candidate.src);
            if (!match) continue;

            const identifier = match[1];
            const linkElement = candidate.parentElement;

            createChatBox(
                'custom',
                identifier,
                characterIdentifier,
                characterName,
                (el) => {
                    linkElement.parentNode.replaceChild(el, linkElement);
                },
                `Custom Chat - ${identifier}`
            );
        }
    })();

    if (/Locale(\/[0-9]+$|$)/.test(document.location.href)) {
        // Locale page
        const localeIdentifier = parseInt(document.querySelector('.idHolder').innerText);
        if (localeIdentifier) {
            createChatBox(
                'locale',
                localeIdentifier,
                characterIdentifier,
                characterName,
                (el) => {
                    document.querySelector("#ppm-content h1").insertAdjacentElement('afterend', el);
                },
                document.title.split(' - ')[1] + ' Chat'
            );
        }
    }
    else if (document.location.href.endsWith('/World/Popmundo.aspx')) {
        // Community news / Welcome page
        createChatBox(
            'community',
            0,
            characterIdentifier,
            characterName,
            (el) => {
                document.querySelector("div.newsList").insertAdjacentElement('beforebegin', el);
            },
            'Global Chat'
        );
    } else if (document.querySelector("#ctl00_cphLeftColumn_ctl00_pnlCalendar")) {
        // City page
        const cityIdentifier = document.querySelector("#ctl00_cphRightColumn_ctl01_ddlCities").value;
        createChatBox(
            'city',
            cityIdentifier,
            characterIdentifier,
            characterName,
            (el) => {
                document.querySelector("#ppm-content h1").insertAdjacentElement('afterend', el)
            },
            document.title.split(' - ')[1] + ' Chat'
        );
    } else if (/SocialClub\/[0-9]+$/.test(document.location.href)) {
        // Social club
        const clubIdentifier = document.querySelector(".idHolder").innerText;

        createChatBox(
            'club',
            clubIdentifier,
            characterIdentifier,
            characterName,
            (el) => {
                document.querySelector("#ppm-content h1").insertAdjacentElement('afterend', el)
            },
            document.querySelector("#ppm-content h1").innerText + ' Chat'
        );
    }
})();

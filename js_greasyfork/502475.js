// ==UserScript==
// @name         UNIT3D chatbox - enhanced ULCX
// @version      1.2
// @description  Chat functionalities: Reply, Message and Gift buttons. BBCode buttons. Toggle menu. Emojis. 
// @match        https://upload.cx/
// @grant        none
// @namespace https://greasyfork.org/users/1344404
// @downloadURL https://update.greasyfork.org/scripts/502475/UNIT3D%20chatbox%20-%20enhanced%20ULCX.user.js
// @updateURL https://update.greasyfork.org/scripts/502475/UNIT3D%20chatbox%20-%20enhanced%20ULCX.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //Please do not alter this, It is for contributors to the project only.
            const USER_COLORS = {
    'ace': '#ef008c',
    'TheoneandonlyPook': '#ef008c',
    'Demonic': '#ffac6b',
    }

    // Function to extract the CSRF token
    function extractToken() {
        const tokenElement = document.querySelector('meta[name="csrf-token"]');
        return tokenElement ? tokenElement.content : 'Token not found';
    }

    // Function to extract the user from the URL
    function extractUser() {
        const userLink = document.querySelector('a.top-nav__username--highresolution');
        if (userLink) {
            const url = new URL(userLink.href);
            return url.pathname.split('/').pop();
        }
        return 'User not found';
    }

    // Function to remove the dialog from the page
    function removeDialog() {
        const existingDialog = document.querySelector('dialog');
        if (existingDialog) {
            existingDialog.remove();
        }
    }

    const chatboxID = '#chatbox__messages-create';
    const chatMessagesClassName = '.chatroom__messages';
    const onlineUserListSelector = '.blocks__online .panel__body ul';
    const additionalUserListSelector = '.chatroom-users__list';
    const bbCodesPanelID = 'bbCodesPanel';
    const settingsButtonID = 'settingsButton';
    const settingsPanelID = 'settingsPanel';
    const BBCODES_PANEL_HTML = `
<div id="${bbCodesPanelID}" style="position: relative; display: flex; flex-wrap: wrap; z-index: 9998;">
    <span id="imgButton" style="cursor: pointer; margin-right: 4px;" data-bbcode="[img][/img]">IMG</span>
    <span id="urlButton" style="cursor: pointer; margin-right: 4px;" data-bbcode="[url][/url]">URL</span>
    <span id="colorButton" style="cursor: pointer; margin-right: 4px;">Color</span>
    <input type="color" id="colorPicker" style="cursor: pointer; margin-left: 10px; display: none;" title="Select Color">
    <span style="cursor: pointer; margin: 4px;" id="emojiButton">😊</span>
    <div id="emojiMenu" style="display: none; position: absolute; left: 10px; top: 30px; background: #000000; border: 1px solid #ccc; z-index: 10000;">
        <span class="emoji" data-emoji="😊">😊</span>
        <span class="emoji" data-emoji="😂">😂</span>
        <span class="emoji" data-emoji="😍">😍</span>
        <span class="emoji" data-emoji="😇">😇</span>
        <span class="emoji" data-emoji="🤨">🤨</span>
        <span class="emoji" data-emoji="🥳">🥳</span>
        <span class="emoji" data-emoji="😏">😏</span>
        <span class="emoji" data-emoji="😞">😞</span>
        <span class="emoji" data-emoji="😤">😤</span>
        <span class="emoji" data-emoji="🤬">🤬</span>
        <span class="emoji" data-emoji="🤯">🤯</span>
        <span class="emoji" data-emoji="🥵">🥵</span>
        <span class="emoji" data-emoji="🥶">🥶</span>
        <span class="emoji" data-emoji="🤫">🤫</span>
        <span class="emoji" data-emoji="🤥">🤥</span>
        <span class="emoji" data-emoji="😴">😴</span>
        <span class="emoji" data-emoji="🤮">🤮</span>
        <span class="emoji" data-emoji="🤡">🤡</span>
        <span class="emoji" data-emoji="💩">💩</span>
        <span class="emoji" data-emoji="👻">👻</span>
        <span class="emoji" data-emoji="💀">💀</span>
        <span class="emoji" data-emoji="👽">👽</span>
        <span class="emoji" data-emoji="🎃">🎃</span>
        <span class="emoji" data-emoji="🤝">🤝</span>
        <span class="emoji" data-emoji="👍">👍</span>
        <span class="emoji" data-emoji="👎">👎</span>
        <span class="emoji" data-emoji="✌️">✌️</span>
        <span class="emoji" data-emoji="🖕">🖕</span>
        <span class="emoji" data-emoji="👮">👮</span>
        <span class="emoji" data-emoji="🕸️">🕸️</span>
        <span class="emoji" data-emoji="🐢">🐢</span>
        <span class="emoji" data-emoji="🐋">🐋</span>
        <span class="emoji" data-emoji="🐐">🐐</span>
        <span class="emoji" data-emoji="🐦‍🔥">🐦‍🔥</span>
        <span class="emoji" data-emoji="🌵">🌵</span>
        <span class="emoji" data-emoji="🎄">🎄</span>
        <span class="emoji" data-emoji="🔥">🔥</span>
        <span class="emoji" data-emoji="🌪️">🌪️</span>
        <span class="emoji" data-emoji="🌈">🌈</span>
        <span class="emoji" data-emoji="☀️">☀️</span>
        <span class="emoji" data-emoji="🌧️">🌧️</span>
        <span class="emoji" data-emoji="❄️">❄️</span>
        <span class="emoji" data-emoji="🍺">🍺</span>
        <span class="emoji" data-emoji="🩷">🩷</span>
        <span class="emoji" data-emoji="💔">💔</span>
        <span class="emoji" data-emoji="🛑">🛑</span>
        <span class="emoji" data-emoji="🏴‍☠️">🏴‍☠️</span>
        <!-- Add more emojis as needed -->
    </div>
    <div style="position: relative;">
        <span style="cursor: pointer;" id="bbCodeDropdown">➪</span>
        <div id="bbCodeDropdownMenu" style="display: none; position: absolute; left: 20px; top: -2px; flex-direction: row; z-index: 10000;">
            <span style="cursor: pointer; margin: 2px;" data-bbcode="[b][/b]">[B]</span>
            <span style="cursor: pointer; margin: 2px;" data-bbcode="[i][/i]">[I]</span>
            <span style="cursor: pointer; margin: 2px;" data-bbcode="[u][/u]">[U]</span>
        </div>
    </div>
</div>`;

    const SETTINGS_PANEL_HTML = `<div id="${settingsPanelID}" style="display: none; position: absolute; top: 20px; right: 0; background: rgba(0,0,0,0.9); border-radius: 8px; padding: 10px; color: white; z-index: 10001;">
            <label><input type="checkbox" id="toggleBBCodes" checked> Show BB Codes</label><br>
            <label><input type="checkbox" id="toggleMessageGift" checked> Show Message/Gift Buttons</label><br>
            <label><input type="checkbox" id="toggleReply" checked> Show Reply Button</label>
        </div>`;
    const TOGGLE_BUTTON_HTML = `<div id="${settingsButtonID}" style="cursor: pointer; color: #fff; display: inline-block; margin-left: 4px; font-size: 16px;">⚙️</div>`;
      // Create and add the style block
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        .emoji {
            cursor: pointer;
        }
        .reply-icon, .message-icon, .gift-icon { cursor: pointer; margin-left: 5px; }
        .mention-dropdown { position: absolute; background: #333; border: 1px solid #ccc; max-height: 150px; overflow-y: auto; display: none; z-index: 10000; color: #ccc; }
        .mention-dropdown span { display: block; padding: 5px; cursor: pointer; color: #ccc; }
        .mention-dropdown span:hover { background: #555; }
        .panel__actions { position: relative; }
    `;
    document.head.appendChild(style);
    function saveSetting(key, value) {
        localStorage.setItem(key, value);
    }
    function loadSetting(key) {
        return localStorage.getItem(key);
    }
    function applySettings() {
        const toggleBBCodes = loadSetting('toggleBBCodes') === 'true';
        const toggleMessageGift = loadSetting('toggleMessageGift') === 'true';
        const toggleReply = loadSetting('toggleReply') === 'true';
        document.getElementById('toggleBBCodes').checked = toggleBBCodes;
        document.getElementById(bbCodesPanelID).style.display = toggleBBCodes ? 'flex' : 'none';
        document.getElementById('toggleMessageGift').checked = toggleMessageGift;
        const iconsMessageGift = document.querySelectorAll('.message-icon, .gift-icon');
        iconsMessageGift.forEach(icon => icon.style.display = toggleMessageGift ? 'inline' : 'none');
        document.getElementById('toggleReply').checked = toggleReply;
        const iconsReply = document.querySelectorAll('.reply-icon');
        iconsReply.forEach(icon => icon.style.display = toggleReply ? 'inline' : 'none');
    }
    function setupSettingsListeners() {
        document.getElementById('toggleBBCodes').addEventListener('change', (event) => {
            saveSetting('toggleBBCodes', event.target.checked);
            document.getElementById(bbCodesPanelID).style.display = event.target.checked ? 'flex' : 'none';
        });
        document.getElementById('toggleMessageGift').addEventListener('change', (event) => {
            saveSetting('toggleMessageGift', event.target.checked);
            const icons = document.querySelectorAll('.message-icon, .gift-icon');
            icons.forEach(icon => icon.style.display = event.target.checked ? 'inline' : 'none');
        });
        document.getElementById('toggleReply').addEventListener('change', (event) => {
            saveSetting('toggleReply', event.target.checked);
            const icons = document.querySelectorAll('.reply-icon');
            icons.forEach(icon => icon.style.display = event.target.checked ? 'inline' : 'none');
        });
    }
    function getOnlineUsernames() {
        const userElements = document.querySelectorAll(`${onlineUserListSelector} .user-tag__link`);
        const additionalUserElements = document.querySelectorAll(`${additionalUserListSelector} .user-tag__link`);
        const userSet = new Set([...Array.from(userElements), ...Array.from(additionalUserElements)].map(el => el.textContent.trim()));
        return Array.from(userSet);
    }
    function setupMentionFeature(chatbox) {
        const mentionDropdown = document.createElement('div');
        mentionDropdown.classList.add('mention-dropdown');
        document.body.appendChild(mentionDropdown);
        chatbox.addEventListener('input', function(event) {
            const cursorPosition = chatbox.selectionStart;
            const text = chatbox.value.substring(0, cursorPosition);
            const mentionMatch = text.match(/@(\w*)$/);
            if (mentionMatch) {
                const usernamePrefix = mentionMatch[1].toLowerCase();
                const users = getOnlineUsernames().filter(user => user.toLowerCase().startsWith(usernamePrefix));
                mentionDropdown.innerHTML = '';
                users.forEach(user => {
                    const userElement = document.createElement('span');
                    userElement.textContent = user;
                    userElement.addEventListener('click', () => {
                        chatbox.value = chatbox.value.substring(0, cursorPosition - usernamePrefix.length - 1) + '@' + user + ' ' + chatbox.value.substring(cursorPosition);
                        chatbox.focus();
                        mentionDropdown.style.display = 'none';
                    });
                    mentionDropdown.appendChild(userElement);
                });
                const rect = chatbox.getBoundingClientRect();
                mentionDropdown.style.left = `${rect.left}px`;
                mentionDropdown.style.top = `${rect.bottom}px`;
                mentionDropdown.style.display = 'block';
            } else {
                mentionDropdown.style.display = 'none';
            }
        });
        chatbox.addEventListener('keydown', (e) => {
            if (mentionDropdown.style.display === 'block' && e.key === 'Tab') {
                e.preventDefault();
                const firstUser = mentionDropdown.querySelector('span');
                if (firstUser) firstUser.click();
            }
        });
        document.addEventListener('click', function(event) {
            if (!mentionDropdown.contains(event.target)) mentionDropdown.style.display = 'none';
        });
    }

    // Function to add the dialog element to the page
    function addDialog(token, user, username) {
        // Check if a dialog already exists and remove it
        removeDialog();

        // Create dialog HTML
        const dialogHTML = `
        <dialog class="dialog" x-bind="dialogElement">
            <h3 class="dialog__heading">Gift BON to: ${username}</h3>
            <form class="dialog__form" method="POST" action="https://upload.cx/users/${user}/gifts" x-bind="dialogForm">
                <input type="hidden" name="_token" value="${token}" autocomplete="off">
                <input type="hidden" name="recipient_username" value="${username}">
                <p class="form__group">
                    <input id="bon" class="form__text" name="bon" type="text" pattern="[0-9]*" inputmode="numeric" placeholder=" ">
                    <label class="form__label form__label--floating" for="bon">Amount</label>
                </p>
                <p class="form__group">
                    <textarea id="message" class="form__textarea" name="message" placeholder=" "></textarea>
                    <label class="form__label form__label--floating" for="message">Message</label>
                </p>
                <p class="form__group">
                    <button type="submit" class="form__button form__button--filled">Gift</button>
                    <button type="button" class="form__button form__button--outlined">Cancel</button>
                </p>
            </form>
        </dialog>`;

        // Create a container <div> if one does not exist
        let container = document.querySelector('#dialog-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'dialog-container';
            document.body.appendChild(container);
        }

        // Add dialog HTML to the container
        container.innerHTML = dialogHTML;

        // Add styling for the backdrop
        const style = document.createElement('style');
        style.innerHTML = `
        dialog::backdrop {
            background-color: rgba(0, 0, 0, 0.8);
        }`;
        document.head.appendChild(style);

        // Get the dialog element and show it
        const dialog = container.querySelector('dialog');
        dialog.showModal();

        // Add event listener to the "Cancel" button to remove the dialog
        const cancelButton = dialog.querySelector('button[type="button"]');
        if (cancelButton) {
            cancelButton.addEventListener('click', removeDialog);
        }
    }

    function setupReplyFeatures(chatMessages) {
        //Please do not alter this, It is for contributors to the project only.
        const USER_COLORS = {
    'ace': '#ef008c',
    'TheoneandonlyPook': '#ef008c',
    'Demonic': '#ffac6b'

    // Add more users and colors as needed
};

        const newMessageTextArea = document.querySelector(chatboxID);

function rgbToHex(rgb) {
    // Convert RGB to HEX format
    const rgbArray = rgb.match(/\d+/g).map(Number);
    if (rgbArray.length === 3) {
        return `#${rgbArray.map(value => {
            const hex = value.toString(16).padStart(2, '0');
            return hex;
        }).join('')}`;
    }
    return rgb; // Return original if not in expected format
}

function quoteMessage(username, message) {
    const chatbox = document.querySelector(chatboxID);
    if (!chatbox) {
        console.error(`Chatbox not found: ${chatboxID}`);
        return;
    }

    // Default color if user is not found in USER_COLORS
    let userColor = '#ecc846'; // Default color

    // Check USER_COLORS first
    if (USER_COLORS.hasOwnProperty(username)) {
        userColor = USER_COLORS[username];
    } else {

        // If not in USER_COLORS, extract the color from the chat messages
        const messages = document.querySelectorAll('.chatbox-message, .message');
        for (const msg of messages) {
            const msgUsername = msg.querySelector(".chatbox-message__address.user-tag span, .message-username span");
            if (msgUsername && msgUsername.textContent.trim() === username) {
                const style = window.getComputedStyle(msgUsername);
                userColor = rgbToHex(style.color);
                break; // Stop searching once the user is found
            }
        }
    }

    // Debugging
    console.log(`Username: ${username}, Color used: ${userColor}`);

    // Create the quoted message
    const quoteText = `[color=${userColor}][b]${username}[/b][/color]: [color=#ffff80][i]"${message}"[/i][/color]`;

    // Append the quoted message to the chat input
    chatbox.value += `${quoteText}\n\n`;
    chatbox.focus();
    chatbox.setSelectionRange(chatbox.value.length, chatbox.value.length);
}

        function addReplyIconToMessage(message) {
            const content = message.querySelector(".chatbox-message__content")?.innerText || message.querySelector(".message-content")?.innerText;
            const username = message.querySelector(".chatbox-message__address.user-tag span")?.innerText || message.querySelector(".message-username span")?.innerText;
            const header = message.querySelector(".chatbox-message__header") || message.querySelector(".message-header");
            if (!content || !username || !header) return;
            const replyIcon = document.createElement("i");
            replyIcon.classList.add("fa", "solid", "fa-reply", "reply-icon");
            replyIcon.style.color = "#d82c20";
            replyIcon.addEventListener("click", () => quoteMessage(username, content));
            const messageIcon = document.createElement("i");
            messageIcon.classList.add("fa", "solid", "fa-envelope", "message-icon");
            messageIcon.style.color = "#118DFF";
            const giftIcon = document.createElement("i");
            giftIcon.classList.add("fa", "solid", "fa-gift", "gift-icon");
            giftIcon.style.color = "#f3c911";
            messageIcon.addEventListener("click", () => {
                newMessageTextArea.value += `/msg ${username} `;
                newMessageTextArea.focus();
            });
            giftIcon.addEventListener("click", () => {
                const token = extractToken();
                const user = extractUser();
                addDialog(token, user, username);
            });
            header.appendChild(replyIcon);
            header.appendChild(messageIcon);
            header.appendChild(giftIcon);
            applySettings();
        }
        document.querySelectorAll(".chatbox-message, .message").forEach(addReplyIconToMessage);
        const observer = new MutationObserver(function(mutationsList, observer) {
            document.querySelectorAll(".reply-icon, .message-icon, .gift-icon").forEach((icon) => icon.remove());
            document.querySelectorAll(".chatbox-message, .message").forEach(addReplyIconToMessage);
        });
        observer.observe(chatMessages, { childList: true });
    }
    function setupChatFeatures(chatbox) {
    const container = document.createElement('div');
    container.style.position = 'relative';
    container.style.display = 'inline-flex';
    chatbox.parentNode.insertBefore(container, chatbox.nextSibling);
    const bbCodesPanel = document.createElement('div');
    bbCodesPanel.innerHTML = BBCODES_PANEL_HTML;
    container.appendChild(bbCodesPanel);
    bbCodesPanel.style.background = 'transparent';
    bbCodesPanel.style.border = 'none';

    // BBCode Dropdown
    const bbCodeDropdown = document.getElementById('bbCodeDropdown');
    const bbCodeDropdownMenu = document.getElementById('bbCodeDropdownMenu');
    bbCodeDropdown.addEventListener('click', function() {
        bbCodeDropdownMenu.style.display = bbCodeDropdownMenu.style.display === 'flex' ? 'none' : 'flex';
    });

    // Emoji Button
    const emojiButton = document.getElementById('emojiButton');
    const emojiMenu = document.getElementById('emojiMenu');
    emojiButton.addEventListener('click', function() {
        emojiMenu.style.display = emojiMenu.style.display === 'block' ? 'none' : 'block';
    });

    // Emoji Menu
    emojiMenu.addEventListener('click', function(event) {
        if (event.target.classList.contains('emoji')) {
            const emoji = event.target.getAttribute('data-emoji');
            insertEmoji(emoji, chatbox);
            emojiMenu.style.display = 'none'; // Hide menu after selection
        }
    });

    // BBCode Buttons
    bbCodesPanel.querySelectorAll('span').forEach(function(span) {
        span.addEventListener('click', function() {
            const bbCode = span.getAttribute('data-bbcode');
            if (bbCode === "[img][/img]") {
                insertImgBBCodeWithClipboard(bbCode, chatbox);
            } else if (bbCode === "[url][/url]") {
                insertBBCodeWithClipboard(bbCode, chatbox);
            } else if (span.id === 'colorButton') {
                document.getElementById('colorPicker').style.display = 'block'; // Show color picker
            } else {
                insertBBCode(chatbox, bbCode);
            }
        });
    });

    // Color Picker
    document.getElementById('colorPicker').addEventListener('input', function(event) {
        const color = event.target.value;
        const colorBBCode = `[color=${color}][/color]`;
        chatbox.value += colorBBCode + " ";
        const pos = chatbox.value.length;
        chatbox.setSelectionRange(pos, pos);
        chatbox.focus();
        document.getElementById('colorPicker').style.display = 'none'; // Hide color picker after selection
    });

    setupMentionFeature(chatbox);
}

function insertEmoji(emoji, chatbox) {
    const pos = chatbox.selectionStart;
    chatbox.value = chatbox.value.substring(0, pos) + emoji + chatbox.value.substring(pos);
    chatbox.setSelectionRange(pos + emoji.length, pos + emoji.length);
    chatbox.focus();
}

    function insertBBCodeWithClipboard(tag, chatbox) {
        navigator.clipboard.readText().then(clipText => {
            const newContent = clipText.trim().length > 0
                ? tag.replace(/(\[.*?\])(.*?)(\[\/.*?\])/, `$1${clipText}$3`)
                : tag.replace(/(\[.*?\])(.*?)(\[\/.*?\])/, `$1$2$3`);
            chatbox.value += newContent + " ";
            const pos = chatbox.value.length;
            chatbox.setSelectionRange(pos, pos);
            chatbox.focus();
        }).catch((err) => {
            console.error('Failed to read clipboard contents:', err);
            chatbox.value += tag.replace(/(\[.*?\])(.*?)(\[\/.*?\])/, `$1$2$3`) + " ";
            const pos = chatbox.value.length;
            chatbox.setSelectionRange(pos, pos);
            chatbox.focus();
        });
    }
    function insertImgBBCodeWithClipboard(tag, chatbox) {
        navigator.clipboard.readText().then(clipText => {
            const newContent = clipText.trim().length > 0
                ? tag.replace(/(\[.*?\])(.*?)(\[\/.*?\])/, `$1${clipText}$3`)
                : tag.replace(/(\[.*?\])(.*?)(\[\/.*?\])/, `$1$2$3`);
            chatbox.value += newContent + "\n";
            const pos = chatbox.value.length;
            chatbox.setSelectionRange(pos, pos);
            chatbox.focus();
        }).catch((err) => {
            console.error('Failed to read clipboard contents:', err);
            chatbox.value += tag.replace(/(\[.*?\])(.*?)(\[\/.*?\])/, `$1$2$3`) + "\n";
            const pos = chatbox.value.length;
            chatbox.setSelectionRange(pos, pos);
            chatbox.focus();
        });
    }
    function insertBBCode(chatbox, bbCode) {
        const textSelected = chatbox.value.substring(chatbox.selectionStart, chatbox.selectionEnd);
        const startTag = bbCode.substring(0, bbCode.indexOf(']') + 1);
        const endTag = bbCode.substring(bbCode.lastIndexOf('['));
        if (textSelected.length > 0) {
            const newText = startTag + textSelected + endTag;
            chatbox.value = chatbox.value.substring(0, chatbox.selectionStart) + newText + " " + chatbox.value.substring(chatbox.selectionEnd);
            const newPos = chatbox.value.lastIndexOf(' ') + 1;
            chatbox.setSelectionRange(newPos, newPos);
        } else {
            const pos = chatbox.selectionStart + startTag.length;
            chatbox.value += startTag + endTag + " ";
            chatbox.setSelectionRange(pos, pos);
        }
        chatbox.focus();
    }
function setupSettingsPanel() {
    const chatboxHeaderActions = document.querySelector('#chatbox_header .panel__actions');
    if (chatboxHeaderActions) {
        chatboxHeaderActions.insertAdjacentHTML('beforeend', TOGGLE_BUTTON_HTML);
        const settingsPanel = document.createElement('div');
        settingsPanel.innerHTML = `
            <div id="${settingsPanelID}" style="display: none; position: absolute; top: 30px; right: 0; background: rgba(0,0,0,0.9); border-radius: 8px; padding: 10px; color: white; z-index: 10001;">
                <label><input type="checkbox" id="toggleBBCodes" checked> Show BB Codes</label><br>
                <label><input type="checkbox" id="toggleMessageGift" checked> Show Message/Gift Buttons</label><br>
                <label><input type="checkbox" id="toggleReply" checked> Show Reply Button</label>
            </div>`;
        chatboxHeaderActions.appendChild(settingsPanel);
        const toggleSettingsButton = document.getElementById(settingsButtonID);
        const settingsPanelElement = document.getElementById(settingsPanelID);
        toggleSettingsButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent event from bubbling up
            const isPanelVisible = settingsPanelElement.style.display === 'block';
            settingsPanelElement.style.display = isPanelVisible ? 'none' : 'block';
        });
        document.addEventListener('click', (event) => {
            if (!settingsPanelElement.contains(event.target) && !toggleSettingsButton.contains(event.target)) {
                settingsPanelElement.style.display = 'none'; // Hide when clicking outside
            }
        });
        applySettings();
        setupSettingsListeners();
    } else {
        console.error("Failed to attach the settings button: '#chatbox_header .panel__actions' not found.");
    }
}
    function checkAndSetup() {
        const chatbox = document.querySelector(chatboxID);
        const chatMessages = document.querySelector(chatMessagesClassName);
        if (chatbox) {
            setupChatFeatures(chatbox);
            setupSettingsPanel();
        } else {
            console.error('Chatbox not found: Ensure the chatbox ID is correct.');
        }
        if (chatMessages) {
            setupReplyFeatures(chatMessages);
        } else {
            console.error('Chat messages not found: Ensure the chatMessages class is correct.');
        }
        if (!chatbox || !chatMessages) {
            setTimeout(checkAndSetup, 1000);
        }

    }

    checkAndSetup();

})();

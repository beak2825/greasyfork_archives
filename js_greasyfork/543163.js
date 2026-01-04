// ==UserScript==
// @name         Torn Chat Emoji+
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a categorized emoji menu with dark mode and favorites to all Torn chat windows.
// @author       HeyItzWerty [3626448]
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543163/Torn%20Chat%20Emoji%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/543163/Torn%20Chat%20Emoji%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. EMOJI DATA & STORAGE KEYS ---
    const FAVORITES_KEY = 'torn_emoji_plus_favorites';
    const CUSTOM_KEY = 'torn_emoji_plus_custom';
    const DARK_MODE_KEY = 'torn_emoji_plus_dark_mode';

    const emojiCategories = {
        '⭐ Favorites': [],
        '✨ My Custom Emojis': [],
        '🙂 Smileys & Emotion': ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '🥲', '🥹', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🫣', '🤗', '🫡', '🤔', '🫢', '🤭', '🤫', '🤥', '😶', '😶‍🌫️', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '😵‍💫', '🫥', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '🤡', '💩', '👻', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'],
        '👋 People & Body': ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🫰', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄', '🫦', '👶', '👧', '🧒', '👦', '👩', '🧑', '👨', '👵', '🧓', '👴', '👮‍♀️', '👮', '👷‍♀️', '👷', '🕵️‍♀️', '🕵️', '👩‍⚕️', '🧑‍⚕️', '👨‍⚕️', '👩‍🎓', '🧑‍🎓', '👨‍🎓', '👩‍🏫', '🧑‍🏫', '👨‍🏫', '👩‍⚖️', '🧑‍⚖️', '👨‍⚖️', '👩‍🌾', '🧑‍🌾', '👨‍🌾', '👩‍🍳', '🧑‍🍳', '👨‍🍳', '👩‍🔧', '🧑‍🔧', '👨‍🔧', '👩‍💻', '🧑‍💻', '👨‍💻', '👩‍🎤', '🧑‍🎤', '👨‍🎤', '👩‍🎨', '🧑‍🎨', '👨‍🎨', '👩‍🚀', '🧑‍🚀', '👨‍🚀', '👸', '🤴', '🦸‍♀️', '🦸', '🦹‍♀️', '🦹', '🎅', '🤶', '🧙‍♀️', '🧙', '🧝‍♀️', '🧝', '🧛‍♀️', '🧛', '🧟‍♀️', '🧟', '🧞‍♀️', '🧞', '🧜‍♀️', '🧜', '🧚‍♀️', '🧚', '👼', '🤰', '🤱', '🙇‍♀️', '🙇', '💁‍♀️', '💁', '🙅‍♀️', '🙅', '🙆‍♀️', '🙆', '🙋‍♀️', '🙋', '🤦‍♀️', '🤦', '🤷‍♀️', '🤷', '🙎‍♀️', '🙎', '🙍‍♀️', '🙍', '💇‍♀️', '💇', '💆‍♀️', '💆', '💃', '🕺', '🏃‍♀️', '🏃', '🚶‍♀️', '🚶', '🫂', '🗣️', '👤', '👥'],
        '🐻 Animals': ['🐵', '🐒', '🦍', '🦧', '🐶', '🐕', '🦮', '🐕‍🦺', '🐩', '🐺', '🦊', '🦝', '🐱', '🐈', '🐈‍⬛', '🦁', '🐯', '🐅', '🐆', '🐴', '🐎', '🦄', '🦓', '🦌', '🦬', '🐮', '🐂', '🐃', '🐄', '🐷', '🐖', '🐗', '🐽', '🐏', '🐑', '🐐', '🐪', '🐫', '🦙', '🦒', '🐘', '🦣', '🦏', '🦛', '🐭', '🐁', '🐀', '🐹', '🐰', '🐇', '🐿️', '🦫', '🦔', '🦇', '🐻', '🐻‍❄️', '🐨', '🐼', '🦥', '🦦', '🦨', '🦘', '🦡', '🐾', '🦃', '🐔', '🐓', '🐣', '🐤', '🐥', '🐦', '🐧', '🕊️', '🦅', '🦆', '🦢', '🦉', '🦤', '🪶', '🐸', '🐊', '🐢', '🦎', '🐍', '🐲', '🐉', '🐳', '🐋', '🐬', '🦭', '🐟', '🐠', '🐡', '🦈', '🐙', '🐚', '🐌', '🦋', '🐛', '🐜', '🐝', '🪲', '🐞', '🦗', '🪳', '🕷️', '🕸️', '🦂', '🦟', '🪰', '🪱'],
        '🌳 Nature': ['💐', '🌸', '💮', '🏵️', '🌹', '🥀', '🌺', '🌻', '🌼', '🌷', '🌱', '🪴', '🌲', '🌳', '🌴', '🪵', '🌵', '🌾', '🌿', '☘️', '🍀', '🍁', '🍂', '🍃', '🌍', '🌎', '🌏', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌙', '⭐', '🌟', '💫', '✨', '☄️', '☀️', '🌤️', '⛅', '🌥️', '🌦️', '☁️', '🌧️', '⛈️', '🌩️', '⚡', '🔥', '💥', '❄️', '🌨️', '☃️', '⛄', '🌬️', '💨', '🌪️', '🌫️', '🌊', '💧', '💦'],
        '🍔 Food & Drink': ['🍇', '🍈', '🍉', '🍊', '🍋', '🍌', '🍍', '🥭', '🍎', '🍏', '🍐', '🍑', '🍒', '🍓', '🫐', '🥝', '🍅', '🫒', '🥥', '🥑', '🍆', '🥔', '🥕', '🌽', '🌶️', '🫑', '🥒', '🥬', '🥦', '🧄', '🧅', '🍄', '🥜', '🫘', '🌰', '🍞', '🥐', '🥖', '🫓', '🥨', '🥯', '🥞', '🧇', '🧀', '🍖', '🍗', '🥩', '🥓', '🍔', '🍟', '🍕', '🌭', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🍯', '🥛', '🍼', '☕️', '🫖', '🍵', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃', '🫗', '🥤', '🧋', '🧃', '🧉', '🧊', '🥢', '🍽️', '🍴', '🥄', '🏺'],
        '⚽ Activities & Events': ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️‍♀️', '🏋️', '🏋️‍♂️', '🤼‍♀️', '', '🤼‍♂️', '🤸‍♀️', '🤸', '🤸‍♂️', '⛹️‍♀️', '⛹️', '⛹️‍♂️', '🤺', '🤾‍♀️', '🤾', '🤾‍♂️', '🏌️‍♀️', '🏌️', '🏌️‍♂️', '🏇', '🧘‍♀️', '🧘', '🧘‍♂️', '🏄‍♀️', '🏄', '🏄‍♂️', '🏊‍♀️', '🏊', '🏊‍♂️', '🤽‍♀️', '🤽', '🤽‍♂️', '🚣‍♀️', '🚣', '🚣‍♂️', '🧗‍♀️', '🧗', '🧗‍♂️', '🚵‍♀️', '🚵', '🚵‍♂️', '🚴‍♀️', '🚴', '🚴‍♂️', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🏵️', '🎗️', '🎫', '🎟️', '🎪', '🤹', '🤹‍♂️', '🤹‍♀️', '🎭', '🩰', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🪘', '🎷', '🎺', '🪗', '🎸', '🪕', '🎻', '🪈', '🎲', '♟️', '🎯', '🎳', '🎮', '🎰', '🧩', '🎄', '🎆', '🎇', '🎈', '🎉', '🎊', '🎁'],
        '💡 Objects': ['⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '💡', '🔦', '🕯️', '💰', '💵', '💴', '💶', '💷', '🪙', '💳', '💎', '⚖️', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🔩', '⚙️', '🧱', '⛓️', '🧲', '⚰️', '🪦', '⚱️', '🔮', '📿', '🧿', '💈', '🔭', '🔬', '🕳️', '🩹', '🩺', '🧬', '🦠', '🧪', '🌡️', '🧹', '🧺', '🚽', '🚰', '🚿', '🛁', '🧼', '🪥', '🧽', '🧯', '🔑', '🗝️', '🚪', '🛋️', '🛏️', '🧸', '🖼️', '🛍️', '🛒', '✉️', '🧧', '📫', '📮', '📦', '🏷️', '📜', '📃', '📄', '📑', '📊', '📈', '📉', '🗒️', '🗓️', '🗑️', '📁', '📂', '✂️', '🖊️', '✒️', '🖌️', '🖍️', '📝', '✏️', '🔍', '🔎', '🔒', '🔐', '🔓', '🔏'],
        '🔞 Torn-Themed': ['🔫', '💣', '🧨', '🪓', '🔪', '🗡️', '⚔️', '🛡️', '🚬', '💊', '💉', '🩸', '❤️‍🔥', '❤️‍🩹', '💋', '💯', '💢', '💦', '🍆', '🍑', '😈', '👿', '👹', '👺', '🔥', '💥', '💨', '💸', '⚗️', '🔞'],
        '❤️‍ Symbols & Flags': ['🆔', '⚛️', '☢️', '☣️', '📴', '🆚', '🉑', '㊗️', '㊙️', '🉐', '🆘', '⛔', '🚫', '❌', '⭕', '🛑', '📛', '♨️', '❗️', '❕', '❓', '❔', '‼️', '⁉️', '✅', '✔️', '☑️', '❎', '✝️', '☪️', '🕉️', '✡️', '☯️', '☮️', '☦️', '⚠️', '🚸', '♻️', '⚜️', '🔱', '🔰', '🏧', '♿', '🅿️', '🚾', '📶', '🈁', '🈂️', '🈚', '🈯', '🉐', '🈹', '🈺', '🈶', '🈷️', '🈸', '🈲', '🈵', '🈴', '🆎', '🅱️', '🅰️', '🅾️', '🆑', '🆒', '🆓', '🆕', '🆖', '🆗', '🆙', '↔️', '↕️', '↖️', '↗️', '↘️', '↙️', '↩️', '↪️', '⤴️', '⤵️', '➡️', '⬅️', '⬆️', '⬇️', '➕', '➖', '➗', '✖️', '♾️', '💲', '💱', '™️', '©️', '®️', '🔚', '🔙', '🔛', '🔝', '🔜', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫', '⚪', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫', '⬛', '⬜', '🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️'],
    };

    let favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
    let customEmojis = JSON.parse(localStorage.getItem(CUSTOM_KEY)) || [];
    let isDarkMode = localStorage.getItem(DARK_MODE_KEY) === 'true';

    emojiCategories['⭐ Favorites'] = favorites;
    emojiCategories['✨ My Custom Emojis'] = customEmojis;
    const allEmojis = Object.values(emojiCategories).flat();

    // --- 2. THEMES & CORE LOGIC ---
    const themes = {
        light: { bg: '#f2f2f2', text: '#000', border: '#ccc', catBg: '#e9e9e9', scrollbar: '#ccc', credit: '#888' },
        dark:  { bg: '#2c2c2c', text: '#f1f1f1', border: '#555', catBg: '#222', scrollbar: '#555', credit: '#aaa' }
    };

    const nativeTextareaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
    function simulateUserInput(textarea, text) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newText = textarea.value.substring(0, start) + text + textarea.value.substring(end);
        nativeTextareaValueSetter.call(textarea, newText);
        const event = new Event('input', { bubbles: true });
        textarea.dispatchEvent(event);
        textarea.selectionStart = textarea.selectionEnd = start + text.length;
        textarea.focus();
    }

    function saveToStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    function showNotification(message) {
        const notif = document.createElement('div');
        notif.textContent = message;
        Object.assign(notif.style, {
            position: 'fixed', top: '20px', right: '20px', background: 'rgba(0,0,0,0.7)',
            color: 'white', padding: '10px 20px', borderRadius: '5px', zIndex: '9999',
            opacity: '1', transition: 'opacity 0.5s'
        });
        document.body.appendChild(notif);
        setTimeout(() => {
            notif.style.opacity = '0';
            setTimeout(() => notif.remove(), 500);
        }, 1500);
    }

    // --- 3. UI CREATION & LOGIC ---
    function addEmojiButtonTo(chatContainer) {
        if (chatContainer.querySelector('.custom-emoji-button-v3')) return;

        const emojiButton = document.createElement('button');
        emojiButton.className = 'custom-emoji-button-v3';
        Object.assign(emojiButton.style, {
            background: 'transparent',
            border: 'none',
            fontSize: '22px',
            cursor: 'pointer',
            height: '32px',
            width: '32px',
            marginRight: '5px',
            padding: '0'
        });
        // FORCE the color to be visible against Torn's dark UI
        emojiButton.style.setProperty('color', '#f1f1f1', 'important');
        emojiButton.textContent = allEmojis[Math.floor(Math.random() * allEmojis.length)] || '😊';

        const picker = document.createElement('div');
        picker.className = 'custom-emoji-picker';
        Object.assign(picker.style, {
            position: 'absolute', display: 'none', bottom: '40px', left: '0',
            width: '300px', height: '320px',
            borderRadius: '8px', zIndex: '1001', boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            fontFamily: 'Arial, sans-serif', flexDirection: 'column'
        });

        const categoryContainer = document.createElement('div');
        Object.assign(categoryContainer.style, { display: 'flex', flexWrap: 'wrap', padding: '5px', alignItems: 'center' });

        const emojiDisplay = document.createElement('div');
        Object.assign(emojiDisplay.style, { padding: '5px', flexGrow: '1', overflowY: 'auto', position: 'relative' });

        picker.append(categoryContainer, emojiDisplay);

        let activeCategory = '⭐ Favorites';

        function applyTheme() {
            const theme = isDarkMode ? themes.dark : themes.light;
            Object.assign(picker.style, { background: theme.bg, border: `1px solid ${theme.border}`, color: theme.text });
            categoryContainer.style.background = theme.catBg;
            categoryContainer.style.borderBottom = `1px solid ${theme.border}`;
            themeToggle.style.borderColor = theme.border;
            themeToggle.style.color = theme.text;
            themeToggle.textContent = isDarkMode ? '☀️' : '🌙';

            const styleId = 'emoji-picker-scrollbar-style';
            let scrollbarStyle = document.getElementById(styleId);
            if (!scrollbarStyle) {
                scrollbarStyle = document.createElement('style');
                scrollbarStyle.id = styleId;
                document.head.appendChild(scrollbarStyle);
            }
            scrollbarStyle.textContent = `
                .custom-emoji-picker div::-webkit-scrollbar { width: 8px; }
                .custom-emoji-picker div::-webkit-scrollbar-track { background: ${theme.bg}; }
                .custom-emoji-picker div::-webkit-scrollbar-thumb { background: ${theme.scrollbar}; border-radius: 4px; }
            `;
        }

        const renderEmojis = (emojiList, categoryName) => {
            emojiDisplay.innerHTML = '';
            const isRemovable = (categoryName === '⭐ Favorites' || categoryName === '✨ My Custom Emojis');
            const theme = isDarkMode ? themes.dark : themes.light;

            if (emojiList.length === 0) {
                let emptyText = 'Right-click an emoji to add it!';
                if (categoryName === '✨ My Custom Emojis') {
                    emptyText = 'Custom Emojis appear here.<br><small>Got one? Paste it!</small>';
                }
                emojiDisplay.innerHTML = `<div style="padding: 20px; text-align: center; color: ${theme.credit}; position: absolute; top: 40%; left: 50%; transform: translate(-50%, -50%);">${emptyText}</div>`;
            }

            const emojiGrid = document.createElement('div');
            Object.assign(emojiGrid.style, { display: 'flex', flexWrap: 'wrap' });

            emojiList.forEach(emoji => {
                const emojiSpan = document.createElement('span');
                emojiSpan.textContent = emoji;
                Object.assign(emojiSpan.style, { cursor: 'pointer', padding: '4px', fontSize: '22px' });
                emojiSpan.addEventListener('click', () => {
                    simulateUserInput(chatContainer.querySelector('textarea.textarea___V8HsV'), emoji);
                    picker.style.display = 'none';
                });
                emojiSpan.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    if (isRemovable) {
                        if (categoryName === '⭐ Favorites') {
                            favorites = favorites.filter(f => f !== emoji);
                            saveToStorage(FAVORITES_KEY, favorites);
                            emojiCategories['⭐ Favorites'] = favorites;
                        } else {
                            customEmojis = customEmojis.filter(c => c !== emoji);
                            saveToStorage(CUSTOM_KEY, customEmojis);
                            emojiCategories['✨ My Custom Emojis'] = customEmojis;
                        }
                        renderCategory(categoryName);
                    } else {
                        if (!favorites.includes(emoji)) {
                            favorites.unshift(emoji);
                            saveToStorage(FAVORITES_KEY, favorites);
                            emojiCategories['⭐ Favorites'] = favorites;
                            showNotification(`'${emoji}' added to favorites!`);
                        }
                    }
                });
                emojiGrid.appendChild(emojiSpan);
            });
            emojiDisplay.appendChild(emojiGrid);

            if (categoryName === '⭐ Favorites') {
                const credit = document.createElement('a');
                credit.textContent = 'Created by HeyItzWerty [3626448]';
                credit.href = 'https://www.torn.com/profiles.php?XID=3626448';
                credit.target = '_blank';
                Object.assign(credit.style, {
                    display: 'block', textAlign: 'center', width: '100%',
                    paddingTop: '15px', marginTop: '15px', borderTop: `1px solid ${theme.border}`,
                    fontSize: '10px', color: theme.credit, textDecoration: 'none'
                });
                emojiDisplay.appendChild(credit);
            }
        };

        const renderCategory = (categoryName) => {
            activeCategory = categoryName;
            renderEmojis(emojiCategories[categoryName], categoryName);
        };

        Object.keys(emojiCategories).forEach(name => {
            const tab = document.createElement('button');
            tab.textContent = name.split(' ')[0];
            tab.title = name;
            Object.assign(tab.style, {
                background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', padding: '5px', color: 'inherit'
            });
            tab.addEventListener('click', () => renderCategory(name));
            categoryContainer.appendChild(tab);
        });

        const themeToggle = document.createElement('button');
        Object.assign(themeToggle.style, {
            border: '1px solid', // Restored border
            borderRadius: '5px', cursor: 'pointer', fontSize: '18px',
            width: '30px', height: '30px', flexShrink: '0', padding: '0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginLeft: 'auto', background: 'none'
        });
        themeToggle.addEventListener('click', () => {
            isDarkMode = !isDarkMode;
            localStorage.setItem(DARK_MODE_KEY, isDarkMode);
            applyTheme();
            renderCategory(activeCategory);
        });

        categoryContainer.appendChild(themeToggle);

        emojiDisplay.addEventListener('paste', e => {
            if (activeCategory === '✨ My Custom Emojis') {
                e.preventDefault();
                const pastedText = (e.clipboardData || window.clipboardData).getData('text');
                const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
                const found = pastedText.match(emojiRegex);
                if (found) {
                    found.forEach(emoji => {
                        if (!customEmojis.includes(emoji)) {
                            customEmojis.push(emoji);
                        }
                    });
                    saveToStorage(CUSTOM_KEY, customEmojis);
                    emojiCategories['✨ My Custom Emojis'] = customEmojis;
                    renderCategory('✨ My Custom Emojis');
                    showNotification(`${found.length} custom emoji(s) added!`);
                }
            }
        });

        emojiButton.addEventListener('click', (event) => {
            event.stopPropagation();
            const isHidden = picker.style.display === 'none';
            document.querySelectorAll('.custom-emoji-picker').forEach(p => p.style.display = 'none');
            if (isHidden) {
                favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
                customEmojis = JSON.parse(localStorage.getItem(CUSTOM_KEY)) || [];
                emojiCategories['⭐ Favorites'] = favorites;
                emojiCategories['✨ My Custom Emojis'] = customEmojis;
                picker.style.display = 'flex';
                applyTheme();
                renderCategory(activeCategory);
            }
        });

        chatContainer.insertBefore(emojiButton, chatContainer.querySelector('.iconWrapper___tyRRU'));
        chatContainer.appendChild(picker);
        applyTheme();
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-emoji-picker') && !e.target.closest('.custom-emoji-button-v3')) {
            document.querySelectorAll('.custom-emoji-picker').forEach(p => p.style.display = 'none');
        }
    });

    const observer = new MutationObserver(() => {
        document.querySelectorAll('.root___WUd1h').forEach(container => addEmojiButtonTo(container));
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
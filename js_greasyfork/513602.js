// ==UserScript==
// @name         Clavier arabe en ligne
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Online keyboard to write text with the Arabic alphabet.
// @author       A9ARTAS
// @match        *://*/*
// @match        *://newtab/*
// @match        about:newtab
// @match        chrome://newtab/*
// @match        edge://newtab/*
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513602/Clavier%20arabe%20en%20ligne.user.js
// @updateURL https://update.greasyfork.org/scripts/513602/Clavier%20arabe%20en%20ligne.meta.js
// ==/UserScript==


(function() {
    'use strict';

    let isTransliterationEnabled = localStorage.getItem('isTransliterationEnabled') === 'true' || false;
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    const transliterationMap = {
        // Diacritics
        '==a': 'ً', '==i': 'ٍ', '==u': 'ٌ',
        '=a': 'َ', '=i': 'ِ', '=u': 'ُ',
        '=w': 'ّ', '=o': 'ْ',

        // Letters
        'a': 'ا', 'â': 'ا', 'à': 'ا', 'ā': 'ا',
        'b': 'ب',
        't': 'ت',
        'ṯ': 'ث',
        'j': 'ج', 'ǧ': 'ج',
        'H': 'ح', 'ḥ': 'ح', 'Ḥ': '',
        'x': 'خ', 'ẖ': 'خ', 'K': 'خ',
        'd': 'د',
        'ḏ': 'ذ',
        'r': 'ر',
        'z': 'ز',
        's': 'س',
        'š': 'ش',
        'S': 'ص', 'ṣ': 'ص',
        'D': 'ض', 'ḍ': 'ض',
        'T': 'ط', 'ṭ': 'ط',
        'Z': 'ظ', 'ẓ': 'ظ',
        'g': 'ع', 'ʿ': 'ع',
        'ġ': 'غ',
        'f': 'ف',
        'q': 'ق',
        'k': 'ك',
        'l': 'ل',
        'm': 'م',
        'n': 'ن',
        'h': 'ه',
        'w': 'و', 'o': 'و', 'u': 'و', 'ô': 'و', 'û': 'و', 'ō': 'و', 'ū': 'و',
        'y': 'ي', 'i': 'ي', 'î': 'ي', 'ī': 'ي',
        'Y': 'ى', 'I': 'ى', 'E': 'ى',

        // Special characters
        '-': 'ء',
        'ʾ': 'ء',
        '_': 'ـ',
        '?': '؟',
        ';': '؛',
        ',': '،',

        // Numbers
        '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
        '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩',
        '%': '٪'
    };

    const specialCombinations = {
        'اا': 'آ',
        "ب'": 'پ',
        'p': 'پ',
        "ت'": 'ث',
        "ج'": 'چ',
        'c': 'چ',
        "ح'": 'خ',
        "د'": 'ذ',
        "ر'": 'ز',
        "س'": 'ش',
        "ص'": 'ض',
        "ط'": 'ظ',
        "ع'": 'غ',
        "ف'": 'ڤ',
        'v': 'ڤ',
        "ق'": 'ڨ',
        "ك'": 'ڭ',
        "ه'": 'ة',
        "و'": 'ؤ',
        "ي'": 'ى',
        "ى'": 'ئ',
        'وء': 'ؤ',
        'يء': 'ئ',
        'اء': 'إ',
        'ءا': 'أ'
    };

    function handleInput(event) {
        if (!isTransliterationEnabled) return;

        const inputElement = event.target;
        const cursorPosition = inputElement.selectionStart;
        const text = inputElement.value;
        let newText = '';
        let i = 0;

        while (i < text.length) {
            if (i + 1 < text.length) {
                const twoChar = text.substr(i, 2);
                if (specialCombinations[twoChar]) {
                    newText += specialCombinations[twoChar];
                    i += 2;
                    continue;
                }
                if (transliterationMap[twoChar]) {
                    newText += transliterationMap[twoChar];
                    i += 2;
                    continue;
                }
            }

            if (transliterationMap[text[i]]) {
                newText += transliterationMap[text[i]];
            } else {
                newText += text[i];
            }
            i++;
        }

        // Additional replacements
        newText = newText.replace(/وءء/g, "ؤ");
        newText = newText.replace(/يءء/g, "ئ");
        newText = newText.replace(/اءء/g, "إ");

        inputElement.value = newText;

        // Restore cursor position
        const newCursorPosition = cursorPosition + (newText.length - text.length);
        inputElement.setSelectionRange(newCursorPosition, newCursorPosition);

        // Adjust input height based on content
        inputElement.style.height = 'auto';
        inputElement.style.height = inputElement.scrollHeight + 'px';
    }

    function createKeyboardUI() {
        const keyboardContainer = document.createElement('div');
        keyboardContainer.id = 'arabic-keyboard-container';
        keyboardContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(26, 26, 26, 0.95);
            backdrop-filter: blur(10px);
            color: #ffffff;
            padding: 15px;
            border-radius: 15px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: Arial, sans-serif;
            width: 90%;
            max-width: 400px;
            display: flex;
            flex-direction: column;
        `;

        const header = createHeader();
        const textInput = createTextInput();
        const buttonBar = createButtonBar();
        const keyboard = createKeyboard();

        keyboardContainer.appendChild(header);
        keyboardContainer.appendChild(textInput);
        keyboardContainer.appendChild(buttonBar);
        keyboardContainer.appendChild(keyboard);
        document.body.appendChild(keyboardContainer);

        // Add drag event listeners to the document
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        return keyboardContainer;
    }

    function createHeader() {
        const header = document.createElement('div');
        header.id = 'keyboard-header';
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            cursor: move;
            user-select: none;
        `;

        const title = document.createElement('div');
        title.textContent = 'ARABIC KEYBOARD';
        title.style.cssText = `
            font-size: 16px;
            font-weight: bold;
        `;

        const closeButton = createButton('✖', () => {
            document.getElementById('arabic-keyboard-container').style.display = 'none';
            toggleTransliteration();
        });
        closeButton.style.fontSize = '18px';

        header.appendChild(title);
        header.appendChild(closeButton);

        // Add drag functionality
        header.addEventListener('mousedown', dragStart);

        return header;
    }

    function createTextInput() {
        const textInput = document.createElement('textarea');
        textInput.id = 'arabic-text-input';
        textInput.style.cssText = `
            width: calc(100% - 10px);
            padding: 5px;
            margin-bottom: 5px;
            border-radius: 5px;
            background-color: rgba(45, 45, 45, 0.8);
            color: #ffffff;
            border: 1px solid #444;
            font-size: 14px;
            resize: none;
            height: 40px;
            direction: rtl;
        `;

        textInput.addEventListener('input', handleInput);
        return textInput;
    }

    function createButtonBar() {
        const buttonBar = document.createElement('div');
        buttonBar.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 5px;
            gap: 5px;
        `;

        const emojiButton = createButton('😊', toggleEmojiKeyboard);
        emojiButton.id = 'emoji-button';
        emojiButton.style.fontSize = '16px';

        const copyButton = createButton('Copy', () => {
            const textInput = document.getElementById('arabic-text-input');
            textInput.select();
            document.execCommand('copy');
            showNotification('Text copied to clipboard!');
        });
        copyButton.id = 'copy-button';
        copyButton.style.cssText += `
            padding: 5px 10px;
            background-color: rgba(51, 51, 51, 0.8);
            border-radius: 5px;
            font-size: 12px;
            font-weight: bold;
        `;

        const settingsButton = createButton('⚙️', toggleSettings);
        settingsButton.id = 'settings-button';
        settingsButton.style.fontSize = '16px';

        buttonBar.appendChild(emojiButton);
        buttonBar.appendChild(copyButton);
        buttonBar.appendChild(settingsButton);

        return buttonBar;
    }

    let isEmojiKeyboard = false;
    let isSettingsOpen = false;

    function createKeyboard() {
        const keyboard = document.createElement('div');
        keyboard.id = 'keyboard';
        keyboard.style.cssText = `
            display: grid;
            grid-template-columns: repeat(10, 1fr);
            gap: 5px;
            width: 100%;
            padding: 10px;
            background-color: transparent;
            border-radius: 10px;
        `;

        updateKeyboard(keyboard);

        return keyboard;
    }

    function updateKeyboard(keyboard) {
        keyboard.innerHTML = '';
        const keys = isEmojiKeyboard ? emojiKeys : normalKeys;

        keys.forEach((row) => {
            row.forEach((key) => {
                const keyButton = createButton(key, () => handleKeyPress(key));

                if (key === 'Space') {
                    keyButton.style.gridColumn = 'span 4';
                } else if (key === 'del') {
                    keyButton.style.gridColumn = 'span 2';
                }

                keyButton.style.cssText += `
                    background-color: rgba(58, 58, 58, 0.7);
                    border: none;
                    border-radius: 8px;
                    color: #fff;
                    font-size: 14px;
                    height: 40px;
                    margin: 2px;
                    transition: all 0.2s ease;
                `;

                keyboard.appendChild(keyButton);
            });
        });
    }

    function handleKeyPress(key) {
        const textInput = document.getElementById('arabic-text-input');
        if (key === 'Space') {
            textInput.value += ' ';
        } else if (key === 'del') {
            textInput.value = textInput.value.slice(0, -1);
        } else {
            textInput.value += key;
        }
        textInput.dispatchEvent(new Event('input'));
        textInput.focus();
    }

    function toggleEmojiKeyboard() {
        isEmojiKeyboard = !isEmojiKeyboard;
        updateKeyboard(document.getElementById('keyboard'));
        const emojiButton = document.getElementById('emoji-button');
        const settingsButton = document.getElementById('settings-button');

        if (isEmojiKeyboard) {
            emojiButton.textContent = 'BACK';
            settingsButton.style.display = 'none';
        } else {
            emojiButton.textContent = '😊';
            settingsButton.style.display = 'flex';
        }
    }

    function toggleSettings() {
        isSettingsOpen = !isSettingsOpen;
        const keyboard = document.getElementById('keyboard');
        const settingsButton = document.getElementById('settings-button');
        const emojiButton = document.getElementById('emoji-button');
        const copyButton = document.getElementById('copy-button');

        if (isSettingsOpen) {
            keyboard.innerHTML = '';
            createColorPalette(keyboard);
            settingsButton.textContent = 'BACK';
            emojiButton.style.display = 'none';
            copyButton.style.display = 'none';
        } else {
            keyboard.style.cssText = `
                display: grid;
                grid-template-columns: repeat(10, 1fr);
                gap: 5px;
                width: 100%;
                padding: 10px;
                background-color: transparent;
                border-radius: 10px;
            `;
            updateKeyboard(keyboard);
            settingsButton.textContent = '⚙️';
            emojiButton.style.display = 'flex';
            copyButton.style.display = 'flex';
        }
    }

    function createColorPalette(container) {
        container.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 8px;
            justify-content: center;
            align-items: center;
            width: 100%;
            padding: 5px;
        `;

        // Colors
        const colorHeading = createSettingsHeading('Colors');
        container.appendChild(colorHeading);

        const colorRow = createSettingsRow();
        const colors = ['#000000', '#1a1a1a', '#333333', '#4d4d4d', '#666666', '#ff416c', '#56ccf2', '#f2994a', '#00b09b', '#8e2de2'];
        colors.forEach(color => {
            const colorButton = createColorButton(color);
            colorRow.appendChild(colorButton);
        });
        container.appendChild(colorRow);

        // Transparency
        const transparencyHeading = createSettingsHeading('Transparency');
        container.appendChild(transparencyHeading);

        const transparencyRow = createSettingsRow();
        const transparencies = [25, 50, 75, 100];
        transparencies.forEach(transparency => {
            const transparencyButton = createTransparencyButton(transparency);
            transparencyRow.appendChild(transparencyButton);
        });
        container.appendChild(transparencyRow);

        // Back button
        const backButton = createButton('BACK', toggleSettings);
        backButton.style.cssText += `
            width: calc(100% - 10px);
            margin-top: 8px;
            background-color: rgba(255, 255, 255, 0.1);
            font-size: 12px;
            height: 25px;
        `;
        container.appendChild(backButton);
    }

    function createSettingsHeading(text) {
        const heading = document.createElement('div');
        heading.textContent = text;
        heading.style.cssText = `
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 2px;
            align-self: flex-start;
        `;
        return heading;
    }

    function createSettingsRow() {
        const row = document.createElement('div');
        row.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            width: 100%;
            padding: 2px;
        `;
        return row;
    }

    function createColorButton(color) {
        const colorButton = createButton('', () => {
            const keyboardContainer = document.getElementById('arabic-keyboard-container');
            keyboardContainer.style.backgroundColor = color;
        });
        colorButton.style.cssText += `
            width: 15px;
            height: 15px;
            border-radius: 50%;
            background-color: ${color};
            border: none;
            margin: 2px;
            padding: 0;
            min-width: 15px;
        `;
        return colorButton;
    }

    function createTransparencyButton(transparency) {
        const transparencyButton = createButton(`${transparency}%`, () => {
            const keyboardContainer = document.getElementById('arabic-keyboard-container');
            const currentColor = window.getComputedStyle(keyboardContainer).backgroundColor;
            const rgb = currentColor.match(/\d+/g);
            if (rgb && rgb.length >= 3) {
                keyboardContainer.style.backgroundColor = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${transparency / 100})`;
            }
        });
        transparencyButton.style.cssText += `
            padding: 3px 6px;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            font-size: 10px;
            border: none;
            margin: 2px;
            width: calc(25% - 4px);
            min-width: 30px;
            height: 20px;
        `;
        return transparencyButton;
    }

    function createButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.onclick = onClick;
        button.style.cssText = `
            padding: 8px;
            background-color: rgba(51, 51, 51, 0.7);
            border: none;
            border-radius: 8px;
            color: #fff;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 14px;
            outline: none;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 35px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        `;
        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = 'rgba(68, 68, 68, 0.9)';
            button.style.transform = 'translateY(-1px)';
            button.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = 'rgba(51, 51, 51, 0.7)';
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        });
        return button;
    }

    const normalKeys = [
        ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح'],
        ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك'],
        ['ئ', 'ء', 'ؤ', 'ر', 'لا', 'ى', 'ة', 'و', 'ز', 'ظ'],
        ['ذ', 'د', 'ج', 'Space', 'ط', 'del']
    ];

    const emojiKeys = [
        ['😀','😃','😄','😁','😆','😅','😂','🤣','😊','😇'],
        ['🙂','🙃','😉','😌','😍','🥰','😘','😗','😙','😚'],
        ['😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🤩'],
        ['🥳','😏','😒','😞','😔','😟','😕','🙁','☹️','😣'],
        ['😖','😫','😩','Space','😢']
    ];

    function createMinimalButton(text) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.cssText = `
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 14px;
            padding: 5px;
            transition: background-color 0.2s;
            outline: none;
        `;
        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = 'rgba(68, 68, 68, 0.8)';
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = 'transparent';
        });
        return button;
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #333;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10001;
            animation: fadeOut 2s forwards;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    }

    function dragStart(e) {
        const container = document.getElementById('arabic-keyboard-container');
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target.closest('#keyboard-header')) {
            isDragging = true;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            const container = document.getElementById('arabic-keyboard-container');

            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            container.style.transform = `translate(${currentX}px, ${currentY}px)`;
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }

    function toggleKeyboard() {
        let keyboard = document.getElementById('arabic-keyboard-container');
        if (!keyboard) {
            keyboard = createKeyboardUI();
        }
        if (keyboard.style.display === 'none' || keyboard.style.display === '') {
            keyboard.style.display = 'flex';
            isTransliterationEnabled = true;
        } else {
            keyboard.style.display = 'none';
            isTransliterationEnabled = false;
        }
        localStorage.setItem('isTransliterationEnabled', isTransliterationEnabled);
    }

    function toggleTransliteration() {
        isTransliterationEnabled = !isTransliterationEnabled;
        localStorage.setItem('isTransliterationEnabled', isTransliterationEnabled);
        const keyboard = document.getElementById('arabic-keyboard-container');
        if (keyboard) {
            keyboard.style.display = isTransliterationEnabled ? 'flex' : 'none';
        }
    }

    // Initialize
    function initialize() {
        GM_registerMenuCommand("Click here to write in Arabic", toggleKeyboard);

        // Add global input event listener for transliteration
        document.addEventListener('input', (event) => {
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                handleInput(event);
            }
        });

        // Check if the keyboard should be displayed on initialization
        if (isTransliterationEnabled) {
            toggleKeyboard();
        }
    }

    // Run initialization
    initialize();
})();

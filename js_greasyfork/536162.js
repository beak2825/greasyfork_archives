// ==UserScript==
// @name         Drawaria Expression Channel Engine: Plus!
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Expression Channel Engine: Plus!
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536162/Drawaria%20Expression%20Channel%20Engine%3A%20Plus%21.user.js
// @updateURL https://update.greasyfork.org/scripts/536162/Drawaria%20Expression%20Channel%20Engine%3A%20Plus%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

// (function() { /*
//   'use strict';

    // Function to get the user's language
    function getUserLanguage() {
        const navigatorLanguage = navigator.language || navigator.userLanguage;
        return navigatorLanguage.split('-')[0]; // Get the primary language code
    }

    // Translations for the warning message and character's speech
    const translations = {
        en: {
            title: 'Everything is blocked',
            message: 'You should not play right now, you have important things to do.',
            characterSpeech: 'Hey! Go outside.'
        },
        es: {
            title: 'Todo está bloqueado',
            message: 'No debes jugar en este momento, tienes cosas importantes que hacer ahora mismo.',
            characterSpeech: '¡Oye! Sal afuera.'
        },
        fr: {
            title: 'Tout est bloqué',
            message: 'Vous ne devriez pas jouer en ce moment, vous avez des choses importantes à faire.',
            characterSpeech: 'Hé ! Sors dehors.'
        },
        de: {
            title: 'Alles ist blockiert',
            message: 'Du solltest im Moment nicht spielen, du hast wichtige Dinge zu tun.',
            characterSpeech: 'Hey! Geh nach draußen.'
        },
        it: {
            title: 'Tutto è bloccato',
            message: 'Non dovresti giocare in questo momento, hai cose importanti da fare.',
            characterSpeech: 'Ehi! Esci fuori.'
        },
        pt: {
            title: 'Tudo está bloqueado',
            message: 'Você não deveria jogar agora, você tem coisas importantes para fazer.',
            characterSpeech: 'Ei! Vá para fora.'
        },
        ru: {
            title: 'Все заблокировано',
            message: 'Вы не должны играть сейчас, у вас есть важные дела.',
            characterSpeech: 'Эй! Иди на улицу.'
        },
        ja: {
            title: 'すべてブロックされています',
            message: '今はプレイすべきではありません。重要なことがあります。',
            characterSpeech: 'ねえ！外に出ようよ。'
        },
        zh: {
            title: '一切都被阻止了',
            message: '您现在不应该玩，您有重要的事情要做。',
            characterSpeech: '嘿！出去外面。'
        },
        // Add more languages as needed
    };
//*






























    window.addEventListener('load', function() {
        const chatInput = document.querySelector('#chatbox_textinput');

        if (chatInput) {
            const textarea = document.createElement('textarea');
            textarea.id = chatInput.id;
            textarea.className = chatInput.className;
            textarea.style = chatInput.style.cssText;
            textarea.placeholder = chatInput.placeholder;
            textarea.maxLength = chatInput.maxLength;

            chatInput.parentNode.replaceChild(textarea, chatInput);

            function fillTextareaWithBlankLines() {
                textarea.value = "\u000A".repeat(199) + "\u00AD"; // 100 line feeds, U+00AD is the soft hyphen Shortcut Alt 0173.

                const event = new KeyboardEvent('keydown', {
                    bubbles: true,
                    cancelable: true,
                    keyCode: 13,
                    key: 'Enter',
                    code: 'Enter',
                    shiftKey: false,
                    ctrlKey: false,
                    altKey: false,
                    metaKey: false
                });

                textarea.dispatchEvent(event);
            }

            function clearTextarea() {
                textarea.value = '';
            }

            function wrapSelection(prefix, suffix) {
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const selectedText = textarea.value.substring(start, end);
                const newText = prefix + selectedText + suffix;
                textarea.value = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
                textarea.selectionStart = start + prefix.length;
                textarea.selectionEnd = start + newText.length;
                textarea.focus();
            }

            function openEmojiPicker() {
                const emojiPicker = document.createElement('div');
                emojiPicker.innerHTML = `
                    <button class="emoji-btn" onclick="insertEmoji('😀')">😀</button>
                    <button class="emoji-btn" onclick="insertEmoji('😂')">😂</button>
                    <button class="emoji-btn" onclick="insertEmoji('❤️')">❤️</button>
                    <button class="emoji-btn" onclick="insertEmoji('👍')">👍</button>
                    <button class="emoji-btn" onclick="insertEmoji('😢')">😢</button>
                `;
                emojiPicker.style.position = 'absolute';
                emojiPicker.style.top = '50px';
                emojiPicker.style.left = '10px';
                emojiPicker.style.background = 'white';
                emojiPicker.style.border = '1px solid #ccc';
                emojiPicker.style.padding = '10px';
                emojiPicker.style.zIndex = 1000;
                document.body.appendChild(emojiPicker);
            }

            window.insertEmoji = function(emoji) {
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                textarea.value = textarea.value.substring(0, start) + emoji + textarea.value.substring(end);
                textarea.selectionStart = start + emoji.length;
                textarea.selectionEnd = start + emoji.length;
                textarea.focus();
            };

            function updateCounters() {
                const wordCount = textarea.value.trim().split(/\s+/).length;
                const charCount = textarea.value.length;
                wordCountDisplay.innerText = `Words: ${wordCount}`;
                charCountDisplay.innerText = `Characters: ${charCount}`;
            }

            function saveDraft() {
                localStorage.setItem('chatDraft', textarea.value);
            }

            function loadDraft() {
                const draft = localStorage.getItem('chatDraft');
                if (draft) {
                    textarea.value = draft;
                }
            }

            function adjustTextareaHeight(increment) {
                const currentHeight = parseInt(textarea.style.height, 10) || 100;
                textarea.style.height = `${currentHeight + increment}px`;
            }

            function convertToGlitchText(style) {
                const glitchTexts = {
                    zalgo: "Ḧ̷́͑͘ͅe̸̛͙̹͗ľ̴̙̿̔ľ̵̙̿̔o̵͍̬͗͘",
                    glitch: "Ģ̵̡̖͚̐̅͊̈̿̒̃͘͜ĺ̵̯̬̼̥͋i̷̗̙͓̳̼͓̳̞͉̳͋͌͑̓̀̓͗̓͠t̸̬̞̏͌͝c̸̢̤̤̈́͌͗h̵̛̫͉̬̤̑̌̽͂͌̚͜",
                    corrupted: "Ç̵͝o̴͋ͅr̵̡̚ŕ̷̡ü̸̠p̸͚̊t̴͈̐e̵̝̎d̸̒̆",
                    distorted: "D̵̈́͑͘ͅi̸̛͙̹͗š̴̙̿̔t̴͍̬͗͘o̵͍̬͗͘r̸̫̍̊̓͝t̸̬̞̏͌͝e̸̛͙̹͗d̸̒̆",
                    weird: "Ẅ̵́͑͘ͅe̸̛͙̹͗i̷̗̙͓̳̼͓̳̞͉̳͋͌͑̓̀̓͗̓͠ř̴̙̿̔d̸̒̆",
                    weird2: "̼͙̼͙̼͙̼͙̈́͆̈́ͯ̒̆̀̓ͧ̈́͆̈́ͯ̒̆̀̓ͧ̈́͆̈́ͯ̒̆̀̓ͧ͠͠͠",
                    weird3: "ฏ๎๎๎๎๎๎๎๎๎๎๎๎๎๎๎๎๎๎๎๎๎๎๎๎๎๎๎๎๎"
                };
                textarea.value = glitchTexts[style];
            }

            function convertToFancyText(style) {
                const fancyTexts = {
                    fancy1: "𝓗𝓮𝓵𝓵𝓸",
                    fancy2: "𝕳𝕰𝕷𝕷𝕺",
                    fancy3: "𝐇𝐞𝐥𝐥𝐨",
                    fancy4: "𝑯𝑬𝑳𝑳𝑶",
                    fancy5: "𝒽𝑒𝓁𝓁𝑜",
                    fancy6: "𝔥𝔢𝔩𝔩𝔬",
                    fancy7: "𝕙𝕖𝕝𝕝𝕠",
                    fancy8: "𝖧𝖤𝖫𝖫𝖮",
                    fancy9: "𝗛𝗘𝗟𝗟𝗢",
                    fancy10: "𝘏𝘌𝘓𝘓𝘖"
                };
                textarea.value = textarea.value.split('').map(char => fancyTexts[style][char] || char).join('');
            }

            const fillButton = document.createElement('button');
            fillButton.innerText = "F";
            fillButton.className = "btn btn-outline-secondary btn-sm";
            fillButton.style.padding = "1px 5px";
            fillButton.onclick = fillTextareaWithBlankLines;

            const clearButton = document.createElement('button');
            clearButton.innerText = "C";
            clearButton.className = "btn btn-outline-secondary btn-sm";
            clearButton.style.padding = "1px 5px";
            clearButton.onclick = clearTextarea;

            const boldButton = document.createElement('button');
            boldButton.innerText = "B";
            boldButton.className = "btn btn-outline-secondary btn-sm";
            boldButton.style.padding = "1px 5px";
            boldButton.onclick = () => wrapSelection('**', '**');

            const italicButton = document.createElement('button');
            italicButton.innerText = "I";
            italicButton.className = "btn btn-outline-secondary btn-sm";
            italicButton.style.padding = "1px 5px";
            italicButton.onclick = () => wrapSelection('*', '*');

            const strikeButton = document.createElement('button');
            strikeButton.innerText = "S";
            strikeButton.className = "btn btn-outline-secondary btn-sm";
            strikeButton.style.padding = "1px 5px";
            strikeButton.onclick = () => wrapSelection('~~', '~~');

            const emojiButton = document.createElement('button');
            emojiButton.innerText = "E";
            emojiButton.className = "btn btn-outline-secondary btn-sm";
            emojiButton.style.padding = "1px 5px";
            emojiButton.onclick = openEmojiPicker;

            const saveButton = document.createElement('button');
            saveButton.innerText = "Save";
            saveButton.className = "btn btn-outline-secondary btn-sm";
            saveButton.style.padding = "1px 5px";
            saveButton.onclick = saveDraft;

            const loadButton = document.createElement('button');
            loadButton.innerText = "Load";
            loadButton.className = "btn btn-outline-secondary btn-sm";
            loadButton.style.padding = "1px 5px";
            loadButton.onclick = loadDraft;

            const increaseHeightButton = document.createElement('button');
            increaseHeightButton.innerText = "+";
            increaseHeightButton.className = "btn btn-outline-secondary btn-sm";
            increaseHeightButton.style.padding = "1px 5px";
            increaseHeightButton.onclick = () => adjustTextareaHeight(20);

            const decreaseHeightButton = document.createElement('button');
            decreaseHeightButton.innerText = "-";
            decreaseHeightButton.className = "btn btn-outline-secondary btn-sm";
            decreaseHeightButton.style.padding = "1px 5px";
            decreaseHeightButton.onclick = () => adjustTextareaHeight(-20);

            const zalgoButton = document.createElement('button');
            zalgoButton.innerText = "Zalgo";
            zalgoButton.className = "btn btn-outline-secondary btn-sm";
            zalgoButton.style.padding = "1px 5px";
            zalgoButton.onclick = () => convertToGlitchText('zalgo');

            const glitchButton = document.createElement('button');
            glitchButton.innerText = "Glitch";
            glitchButton.className = "btn btn-outline-secondary btn-sm";
            glitchButton.style.padding = "1px 5px";
            glitchButton.onclick = () => convertToGlitchText('glitch');

            const corruptedButton = document.createElement('button');
            corruptedButton.innerText = "Corrupted";
            corruptedButton.className = "btn btn-outline-secondary btn-sm";
            corruptedButton.style.padding = "1px 5px";
            corruptedButton.onclick = () => convertToGlitchText('corrupted');

            const distortedButton = document.createElement('button');
            distortedButton.innerText = "Distorted";
            distortedButton.className = "btn btn-outline-secondary btn-sm";
            distortedButton.style.padding = "1px 5px";
            distortedButton.onclick = () => convertToGlitchText('distorted');

            const weirdButton = document.createElement('button');
            weirdButton.innerText = "Weird";
            weirdButton.className = "btn btn-outline-secondary btn-sm";
            weirdButton.style.padding = "1px 5px";
            weirdButton.onclick = () => convertToGlitchText('weird');

            const weird2Button = document.createElement('button');
            weird2Button.innerText = "Weird2";
            weird2Button.className = "btn btn-outline-secondary btn-sm";
            weird2Button.style.padding = "1px 5px";
            weird2Button.onclick = () => convertToGlitchText('weird2');

            const weird3Button = document.createElement('button');
            weird3Button.innerText = "Weird3";
            weird3Button.className = "btn btn-outline-secondary btn-sm";
            weird3Button.style.padding = "1px 5px";
            weird3Button.onclick = () => convertToGlitchText('weird3');

            const fancyButton = document.createElement('button');
            fancyButton.innerText = "Fancy";
            fancyButton.className = "btn btn-outline-secondary btn-sm";
            fancyButton.style.padding = "1px 5px";
            fancyButton.onclick = () => convertToFancyText('fancy1');

            const wordCountDisplay = document.createElement('span');
            wordCountDisplay.style.marginLeft = '10px';

            const charCountDisplay = document.createElement('span');
            charCountDisplay.style.marginLeft = '10px';

            textarea.addEventListener('input', updateCounters);

            function appendButtonsNextToHome() {
                const homeButton = document.querySelector('#homebutton');
                if (homeButton) {
                    homeButton.parentNode.insertBefore(fillButton, homeButton.nextSibling);
                    homeButton.parentNode.insertBefore(clearButton, homeButton.nextSibling);
                    homeButton.parentNode.insertBefore(boldButton, homeButton.nextSibling);
                    homeButton.parentNode.insertBefore(italicButton, homeButton.nextSibling);
                    homeButton.parentNode.insertBefore(strikeButton, homeButton.nextSibling);
                    homeButton.parentNode.insertBefore(emojiButton, homeButton.nextSibling);
                    homeButton.parentNode.insertBefore(saveButton, homeButton.nextSibling);
                    homeButton.parentNode.insertBefore(loadButton, homeButton.nextSibling);
                    homeButton.parentNode.insertBefore(increaseHeightButton, homeButton.nextSibling);
                    homeButton.parentNode.insertBefore(decreaseHeightButton, homeButton.nextSibling);
                    homeButton.parentNode.insertBefore(zalgoButton, homeButton.nextSibling);
                    homeButton.parentNode.insertBefore(glitchButton, homeButton.nextSibling);
                    homeButton.parentNode.insertBefore(corruptedButton, homeButton.nextSibling);
                    homeButton.parentNode.insertBefore(distortedButton, homeButton.nextSibling);
                    homeButton.parentNode.insertBefore(weirdButton, homeButton.nextSibling);
                    homeButton.parentNode.insertBefore(weird2Button, homeButton.nextSibling);
                    homeButton.parentNode.insertBefore(weird3Button, homeButton.nextSibling);
                    homeButton.parentNode.insertBefore(fancyButton, homeButton.nextSibling);
                    homeButton.parentNode.insertBefore(wordCountDisplay, homeButton.nextSibling);
                    homeButton.parentNode.insertBefore(charCountDisplay, homeButton.nextSibling);
                }
            }

            appendButtonsNextToHome();
            updateCounters();

            // Hotkeys
            document.addEventListener('keydown', function(event) {
                if (event.ctrlKey && event.shiftKey && event.key === 'B') {
                    wrapSelection('**', '**');
                } else if (event.ctrlKey && event.shiftKey && event.key === 'I') {
                    wrapSelection('*', '*');
                } else if (event.ctrlKey && event.shiftKey && event.key === 'S') {
                    wrapSelection('~~', '~~');
                } else if (event.ctrlKey && event.shiftKey && event.key === 'C') {
                    clearTextarea();
                } else if (event.ctrlKey && event.shiftKey && event.key === 'F') {
                    fillTextareaWithBlankLines();
                } else if (event.ctrlKey && event.shiftKey && event.key === 'E') {
                    openEmojiPicker();
                } else if (event.ctrlKey && event.shiftKey && event.key === 'Z') {
                    convertToGlitchText('zalgo');
                } else if (event.ctrlKey && event.shiftKey && event.key === 'G') {
                    convertToGlitchText('glitch');
                } else if (event.ctrlKey && event.shiftKey && event.key === 'R') {
                    convertToGlitchText('corrupted');
                } else if (event.ctrlKey && event.shiftKey && event.key === 'D') {
                    convertToGlitchText('distorted');
                } else if (event.ctrlKey && event.shiftKey && event.key === 'W') {
                    convertToGlitchText('weird');
                } else if (event.ctrlKey && event.shiftKey && event.key === 'W2') {
                    convertToGlitchText('weird2');
                } else if (event.ctrlKey && event.shiftKey && event.key === 'W3') {
                    convertToGlitchText('weird3');
                } else if (event.ctrlKey && event.shiftKey && event.key === 'T') {
                    convertToFancyText('fancy1');
                } else if (event.ctrlKey && event.shiftKey && event.key === 'ArrowUp') {
                    adjustTextareaHeight(20);
                } else if (event.ctrlKey && event.shiftKey && event.key === 'ArrowDown') {
                    adjustTextareaHeight(-20);
                } else if (event.key === 'F1') {
                    convertToFancyText('fancy1');
                } else if (event.key === 'F2') {
                    convertToFancyText('fancy2');
                } else if (event.key === 'F3') {
                    convertToFancyText('fancy3');
                } else if (event.key === 'F4') {
                    convertToFancyText('fancy4');
                } else if (event.key === 'F5') {
                    convertToFancyText('fancy5');
                }
            });
        }
    });
})();

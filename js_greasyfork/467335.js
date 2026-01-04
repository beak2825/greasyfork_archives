// ==UserScript==
// @name     Warpcast Grammer Fix
// @version  1
// @grant    none
// @include  https://warpcast.com/*
// @description Fixes grammar and spelling errors on Warpcast.
// @license MIT
// @namespace https://greasyfork.org/users/1086381
// @downloadURL https://update.greasyfork.org/scripts/467335/Warpcast%20Grammer%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/467335/Warpcast%20Grammer%20Fix.meta.js
// ==/UserScript==

var modal = document.getElementById('modal-root');

var modded = false;
var text = '';
var textDisplay;
var button = document.createElement("button");
button.classList.add('rounded-lg', 'font-semibold', 'disabled:opacity-50', 'bg-action', 'text-light', 'px-4', 'py-2', 'text-sm');
button.innerHTML = "Fix my Grammar";
button.disabled = true
var API_KEY = ''


function simulateTyping(inputElement, text) {
    var chars = text.split('');

    chars.forEach(function (char) {
        var event = new KeyboardEvent('keydown', {
            key: char,
            keyCode: char.charCodeAt(0),
            which: char.charCodeAt(0)
        });
        inputElement.dispatchEvent(event);

        event = new KeyboardEvent('keypress', {
            key: char,
            keyCode: char.charCodeAt(0),
            which: char.charCodeAt(0)
        });
        inputElement.dispatchEvent(event);

        event = new InputEvent('input', {
            data: char,
            inputType: 'insertText',
            dataTransfer: null,
            isComposing: false
        });
        inputElement.dispatchEvent(event);

        event = new KeyboardEvent('keyup', {
            key: char,
            keyCode: char.charCodeAt(0),
            which: char.charCodeAt(0)
        });
        inputElement.dispatchEvent(event);
    });
}

function setCursorToEnd(editorElement) {
    const range = document.createRange();
    range.selectNodeContents(editorElement);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}

function clearText(editorElement) {
    setCursorToEnd(editorElement);
    const maxLength = editorElement.textContent.length;

    for (let i = 0; i < maxLength; i++) {
        var ev = new KeyboardEvent('keydown', {
            key: 'Backspace',
            code: 'Backspace',
            keyCode: 8,
            which: 8
        });
        editorElement.dispatchEvent(ev);
        document.execCommand('delete');
    }
}

async function injectText(editorElement, text) {
    editorElement.focus();

    for (let char of text) {
        var ev = new KeyboardEvent('keydown', {
            key: char,
            code: char.charCodeAt(0),
            charCode: char.charCodeAt(0),
            keyCode: char.charCodeAt(0),
            which: char.charCodeAt(0)
        });

        editorElement.dispatchEvent(ev);

        document.execCommand('insertText', false, char);

        // Wait for 10ms between key events to ensure each one is fully processed.
        await new Promise(resolve => setTimeout(resolve, 10));
    }
    var rightArrowKeyEvent = new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        code: 'ArrowRight',
        keyCode: 39,
        which: 39
    });
    editorElement.dispatchEvent(rightArrowKeyEvent);

    // Simulate pressing the "Delete" key
    var deleteKeyEvent = new KeyboardEvent('keydown', {
        key: 'Delete',
        code: 'Delete',
        keyCode: 46,
        which: 46
    });
}


function findDraftJsEditor() {
    // The selector depends on the specifics of the webpage.
    // This is just a placeholder.
    return document.querySelector('.public-DraftEditor-content');
}

// Function to call the OpenAI API
function callOpenAPI() {
    var data = {
        model: "gpt-3.5-turbo",
        messages: [{ role: 'system', content: 'You should take on the role of a proofreading assistant. You should proofread the next message and reply with only the corrected message.' },
        { role: 'user', content: text }],
        max_tokens: 50,
        temperature: 0.7
    };

    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            console.log('API Response:', result.choices?.[0]?.message?.content);
            var editor = findDraftJsEditor()
            if (editor) {
                clearText(editor);
                injectText(editor, ' ' + result.choices?.[0]?.message?.content);
            }
        })
        .catch(error => console.error('API Error:', error));
}

var observer = new MutationObserver(function (mutationsList) {
    // Iterate over the mutations
    for (var mutation of mutationsList) {
        // Check if the target element or its descendants have changed
        var element = document.querySelector("div.space-x-2:nth-child(2)");
        if ((mutation.target === modal || modal.contains(mutation.target)) && element && element.childElementCount < 3) {
            // Perform actions in response to the element change
            console.log('Element has changed!');
            element.appendChild(button);
            // Wire up the button to call the OpenAI API
            button.addEventListener("click", callOpenAPI);
        		button.disabled = text === ''|| text === '\n' || !text
        }
        textDisplay = document.querySelector('.public-DraftStyleDefault-block > span:nth-child(1)');

        if (mutation.target === textDisplay || textDisplay.contains(mutation.target)) {
            text = textDisplay.innerText;
                        console.log({text})
            button.disabled = text === '' || text === '\n' || !text

        }
    }
});

var observerConfig = { attributes: true, childList: true, subtree: true, characterData: true };
observer.observe(modal, observerConfig);

// End Setup of button and input watch

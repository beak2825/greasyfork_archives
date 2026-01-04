// ==UserScript==
// @name         irccloud formatting helper 2
// @namespace    http://github.com/hnOsmium0001
// @version      2.2
// @description  Utility to add formatting chars for IRCCloud
// @author       Steve Howard
// @author       hnOsmium0001
// @license      MIT
// @match        https://www.irccloud.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/423220/irccloud%20formatting%20helper%202.user.js
// @updateURL https://update.greasyfork.org/scripts/423220/irccloud%20formatting%20helper%202.meta.js
// ==/UserScript==

GM_addStyle(`
.userscriptIFH-messagePreview {
}
`);

/**
 * 
 * @param {string} str
 * @returns {boolean}
 */
function isIrcMessageCommand(str) {
    // All commands start with a single '/'
    // Messages that has a slash at the beginning start with '//' (which gets collapsed to a '/' when sending)
    return str.startsWith('/') && !str.startsWith('//');
}

/**
 * 
 * @param {string} str
 * @returns {boolean}
 */
function isIrcMessagePlain(str) {
    return !isIrcMessageCommand(str);
}

/**
 * Remove all elements after and including the start-th element in array.
 * Does not perform bound checks.
 * @template T
 * @param {Array<T>} array
 * @param {number} start
 */
function removeArrayTail(array, start) {
    const count = array.length - start;
    for (let i = 0; i < count; ++i) {
        array.pop();
    }
}

/**
 * 
 * @param {string} symbolText 
 * @returns {HTMLElement?}
 */
function makeElementForFormattingSymbol(symbolText) {
    switch (symbolText) {
        case '**': return document.createElement('b');
        case '*':
        case '_': return document.createElement('i');
        case '__': return document.createElement('u');
        case '~~': return document.createElement('del');
        default: return null;
    }
}

/**
 * 
 * @param {string} symbolText 
 * @returns {string?}
 */
function makeIrcCodeForFormattingSymbol(symbolText) {
    switch (symbolText) {
        case '**': return '\x02';
        case '*':
        case '_': return '\x1d';
        case '__': return '\x1f';
        case '~~': return '\x1e';
        default: return null;
    }
}

/**
 * 
 * @typedef {'text' | 'symbol'} TokenType
 */

/**
 * 
 * @typedef {Object} Token
 * @property {string} text
 * @property {TokenType} type
 * @property {number} index
 * @property {number | undefined} pairedSymbolIndex Used interally by parser.
 */

/**
 * 
 * @param {string} str
 * @returns {Token[]}
 */
function doFormatTokenization(str) {
    // Current non-symbol token in [anchor,cursor)
    let anchor = 0; // Range begin
    let cursor = 0; // Range end

    /** @type {Token[]} */
    let tokens = [];

    let isEscaping = false;

    /**
     * 
     * @param {string} text 
     */
    function appendToLastTextToken(text) {
        if (tokens.length >= 1) {
            const lastToken = tokens[tokens.length - 1];
            if (lastToken.type == 'text') {
                lastToken.text += text;
                return;
            }
        }

        // Can't append, insert a new text token
        tokens.push({
            text: text,
            type: 'text',
            index: tokens.length,
        });
    }

    function tryPushTextRange() {
        let myCursor = cursor;
        let myAnchor = anchor;
        // If we have an escape sequence, don't include the '\' before current symbol
        if (isEscaping) {
            myCursor -= 1;
        }
        if (myCursor - myAnchor > 0) {
            appendToLastTextToken(str.substring(myAnchor, myCursor));
        }
    }

    /**
     * 
     * @param {string} symbolText 
     */
    function tryPushSymbol(symbolText) {
        if (isEscaping) {
            isEscaping = false;
            appendToLastTextToken(symbolText);
        } else {
            tokens.push({
                text: symbolText,
                type: 'symbol',
                index: tokens.length,
            });
        }
    }

    while (cursor < str.length) {
        // The number after 'c' represents the number of lookahead characters
        let c0 = str[cursor + 0];
        let c1 = (cursor < (str.length - 1)) ? str[cursor + 1] : '\0';

        let advance;
        let matchedControl = false;

        if (c0 == '*') {
            if (c1 == '*') {
                // **text**
                advance = 2;
                matchedControl = true;;
                tryPushTextRange();
                tryPushSymbol('**');
            } else {
                // *text*
                advance = 1;
                matchedControl = true;
                tryPushTextRange();
                tryPushSymbol('*');
            }
        } else if (c0 == '_') {
            if (c1 == '_') {
                // __text__
                advance = 2;
                matchedControl = true;
                tryPushTextRange();
                tryPushSymbol('__');
            } else {
                // _text_
                advance = 1;
                matchedControl = true;
                tryPushTextRange();
                tryPushSymbol('_');
            }
        } else if (c0 == '~' && c1 == '~') {
            // ~~text~~
            advance = 2;
            matchedControl = true;
            tryPushTextRange();
            tryPushSymbol('~~');
        } else if (c0 == '\\') {
            // Input: text \\*symbol*
            // ^^^ results in the double slash gets treated as a single slash vvv
            // Output: text \<i>symbol</i>

            advance = 1;
            if (isEscaping) {
                isEscaping = false;

                // Start a new text chunk after this '\' character
                matchedControl = true;

                tryPushTextRange();
            } else {
                isEscaping = true;
            }
        } else {
            // We didn't match anything
            advance = 1;

            // Treat backslash as a normal character, if something like '\text' appeared
            if (isEscaping) {
                isEscaping = false;
            }
        }

        cursor += advance;
        if (matchedControl) {
            anchor = /* The updated */ cursor;
        }
    }

    tryPushTextRange();

    return tokens;
}

/**
 * 
 * @param {Token[]} tokens 
 */
function doFormatMatchTokens(tokens) {
    /** @type {Token[]} */
    let stack = [];

    for (let i = 0; i < tokens.length; ++i) {
        const token = tokens[i];

        if (token.type == 'symbol') {
            searchStack: {
                // Scan the stack for matching controls
                for (let i = stack.length - 1; i >= 0; --i) {
                    const stackFrame = stack[i];
                    if (stackFrame.text == token.text) {
                        // Case: found
                        // - Discard all controls after this one, they are unmatched, e.g. **text__** gives a bold 'text__'
                        // - This leaves the pairedSymbolIndex field as undefined, which implies that it's not consumed
                        removeArrayTail(stack, i);

                        stackFrame.pairedSymbolIndex = token.index;
                        token.pairedSymbolIndex = stackFrame.index;

                        break searchStack;
                    }
                }
            }

            // Case: not found
            // - Push symbol into stack
            stack.push(token);
        }
    }

    // NOTE: everything else in stack is also unpaired
}

/**
 * 
 * @param {string} str 
 * @returns {HTMLSpanElement}
 */
function formatMarkdownForHtml(str) {
    const tokens = doFormatTokenization(str);
    doFormatMatchTokens(tokens);

    const view = document.createElement('span');

    /** @type {(HTMLElement | Text)[]} */
    let nodeStack = [view];

    for (let i = 0; i < tokens.length; ++i) {
        const token = tokens[i];

        if (token.pairedSymbolIndex !== undefined) {
            // This is a paired symbol token
            if (token.pairedSymbolIndex < i) {
                // This is a closing symbol
                while (nodeStack[nodeStack.length - 1] instanceof Text) {
                    nodeStack.pop();
                }
                nodeStack.pop();
            } else {
                // This is an opening symbol
                const lastNode = nodeStack[nodeStack.length - 1];
                const element = makeElementForFormattingSymbol(token.text);
                nodeStack.push(element);
                lastNode.appendChild(element);
            }
        } else {
            // This is a text token, or an unpaired symbol token (which should be treated as text)
            const lastNode = nodeStack[nodeStack.length - 1];
            const node = document.createTextNode(token.text);

            lastNode.appendChild(node);
        }
    }

    return view;
}

/**
 * 
 * @param {string} str 
 * @returns {string}
 */
function formatMarkdownForIrc(str) {
    const tokens = doFormatTokenization(str);
    doFormatMatchTokens(tokens);

    let message = '';
    
    for (const token of tokens) {
        if (token.pairedSymbolIndex !== undefined) {
            message += makeIrcCodeForFormattingSymbol(token.text);
        } else {
            message += token.text;
        }
    }

    return message;
}

let gState = {
    _useMarkdown: true,
    /** @type {Array<(oldValue: boolean) => void>} */
    _useMarkdownListeners: [],

    get useMarkdown() {
        return this._useMarkdown;
    },
    set useMarkdown(newValue) {
        const oldValue = this._useMarkdown;
        this._useMarkdown = newValue;
        for (const listener of this._useMarkdownListeners) {
            listener(oldValue);
        }
    },

    get useMarkdownListeners() {
        return this._useMarkdownListeners;
    },

    get useMarkdownIndicator() {
        return this._useMarkdown ? 'M' : 'T';
    },
};

/**
 * 
 * @returns {HTMLDivElement}
 */
function createMessagePreview() {
    const o = document.createElement('div');
    o.classList.add('userscriptIFH-messagePreview');
    return o;
}

/**
 * 
 * @returns {HTMLDivElement}
 */
function createMarkdownCell() {
    const o = document.createElement('div');
    // Too lazy to write another class, just reuse the existing class for the emoji selector
    // NOTE: this won't break the emojicell finder algorithm below, because that code runs only ever once per buffer
    o.classList.add('emojicell');
    o.id = `userscriptIFH-markdowncell${cb().bid()}`;
    o.title = 'Current markdown state, "M" represents markdown, "T" represents plain text.';

    const visual = document.createElement('i');
    visual.classList.add('fa');
    visual.innerText = gState.useMarkdownIndicator;
    o.appendChild(visual);

    o.addEventListener('click', event => {
        // Stop IRCloud's event handler for .emojicell getting this click, triggering the emoji selection menu
        event.stopImmediatePropagation();
        gState.useMarkdown = !gState.useMarkdown;
        // ^^^ This will trigger the listener callback below:
    });
    gState.useMarkdownListeners.push(() => {
        visual.innerText = gState.useMarkdownIndicator;
    })

    return o;
}

/**
 * 
 * @param {HTMLElement} elm 
 */
function clearElementChildren(elm) {
    // Taken from https://stackoverflow.com/a/65413839
    elm.replaceChildren();
}

function bindInputControls() {
    if (cb() == null) {
        return;
    }

    // Maintained by IRCCloud, a separate one per buffer
    /** @type {HTMLTextAreaElement} */
    const inputBox = document.getElementById(`bufferInputView${cb().bid()}`);

    if (!inputBox.dataset.userscriptFormattingHelperRegistered) {
        inputBox.dataset.userscriptFormattingHelperRegistered = true;

        const previewBox = createMessagePreview();
        inputBox.after(previewBox);

        // TODO is there a less hacky way to do this?
        const cells = inputBox.parentElement.parentElement.parentElement;
        const emojiCell = cells.getElementsByClassName('emojicell')[0];
        const markdownCell = createMarkdownCell();
        emojiCell.before(markdownCell);

        const updatePreviewBoxCallback = () => {
            const msg = inputBox.value;
            if (gState.useMarkdown && isIrcMessagePlain(msg)) {
                clearElementChildren(previewBox);
                previewBox.appendChild(formatMarkdownForHtml(msg));
            } else {
                clearElementChildren(previewBox);
            }
        };

        inputBox.addEventListener('input', updatePreviewBoxCallback);
        gState.useMarkdownListeners.push(updatePreviewBoxCallback);

        inputBox.addEventListener('keydown', event => {
            const msg = inputBox.value;
            if (event.key === 'Enter' &&
                gState.useMarkdown && isIrcMessagePlain(msg)) {
                // Hijack the input box content to be what IRC should receive, just before it's sent by IRCCloud's logic
                inputBox.value = formatMarkdownForIrc(msg);
                clearElementChildren(previewBox);
            }
        });
    }
}

function init() {
}

(function checkSession() {
    // Taken from https://github.com/dogancelik/irccloud-sws/blob/6836cac008/src/send_with_style.user.js#L394-L406
    if (unsafeWindow.hasOwnProperty('SESSION')) {
        unsafeWindow.SESSION.bind('init', () => {
            init();

            // For the initially open channel
            bindInputControls();

            // For switching channels later (channel == "buffer")
            unsafeWindow.SESSION.buffers.on('doneSelected', () => {
                bindInputControls();
            });
        });
    } else {
        setTimeout(checkSession, 100);
    }
})();

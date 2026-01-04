// ==UserScript==
// @name         Enhanced Google Chat
// @namespace    http://tampermonkey.net/
// @version      2023-12-30
// @description  Bring missing features to Google Chat.
// @author       @higuoxing
// @license      MIT
// @match        https://mail.google.com/chat/u/*
// @match        https://chat.google.com/u/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chat.google.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js
// @resource     REMOTE_CSS https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/483445/Enhanced%20Google%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/483445/Enhanced%20Google%20Chat.meta.js
// ==/UserScript==

/* global hljs */

const config = {
    // Valid options are:
    // "None": Don't modify the default key bindings of Google Chat.
    // "Ctrl-Enter": Use "Ctrl-Enter" to send messages and "Enter" to insert a new line.
    // "Enter": Use "Enter" to send messages and "Ctrl-Enter" to insert a new line.
    send_message: "Ctrl-Enter",
};

function render_code_blocks() {
    let spans = document.getElementsByTagName("span");
    for (let span of spans) {
        let data_cd_attr = span.getAttribute("data-cd");
        // We use <span data-cd="hidden">```</span> to identify code blocks.
        if (data_cd_attr === "hidden" && span.textContent === "```") {
            let next_sibling_element = span.nextElementSibling;
            if (next_sibling_element != null && next_sibling_element.getAttribute("role") === "complementary") {
                // The next sibling element is the content
                // of the code block.
                let parent_div = span.parentElement;
                let orig_code_block = span.nextElementSibling;

                // Determine the language.
                let orig_code_content = orig_code_block.innerText;
                let orig_code_lines = orig_code_content.split('\n');
                if (orig_code_lines.length < 1) {
                    continue;
                }
                let language = orig_code_lines[0];

                // Check if hljs can highlight our language.
                if (hljs.getLanguage(language) === undefined || hljs.getLanguage(language) === null) {
                    continue;
                }

                // Create code container.
                let pre_ele = document.createElement("pre");
                let code_ele = document.createElement("code");
                code_ele.setAttribute("class", "language-" + language);

                // Remove the 1st line that specifies the language.
                orig_code_lines.shift();

                // Append our new code block.
                code_ele.textContent = orig_code_lines.join('\n');
                pre_ele.appendChild(code_ele);

                // We're ready to highlight it.
                hljs.highlightElement(code_ele);

                let language_mark = document.createElement("span");
                language_mark.setAttribute("class", "hljs-language-mark");
                language_mark.textContent = language + ":";

                // Create a new code container.
                let code_container = document.createElement("div");
                code_container.appendChild(language_mark);
                code_container.appendChild(pre_ele);
                // Append it to the parent element.
                parent_div.insertBefore(code_container, orig_code_block);

                // Remove the original code block.
                orig_code_block.remove();
            }

            // Remove the <span> tag so that we won't render the code block twice.
            span.remove();
        }
    }
}

function register_enter_key_handler(element, config) {
    element.setAttribute('enter-key-event-registered', 'true');
    element.addEventListener('keydown', (e) => {
        // Only let it go if the ctrl key is down.
        // Just don't call preventDefault(), a new line will be created always which is the
        // textfield's default behaviour.
        if (e.key == 'Enter' && ((config.send_message == "Ctrl-Enter" && !e.ctrlKey) || (config.send_message == "Enter" && e.ctrlKey))) {
            // Get the pop up list after inputting "@" (for tagging people) or ':' (for inserting emojis), etc.
            let div_nodes = document.getElementsByTagName('div');
            let list_expanded = false;
            for (let div of div_nodes) {
                if (div.getAttribute('role') === 'listbox' && div.getAttribute('data-expanded') === 'true') {
                    // Do not intercept enter key if the pop up list is visible.
                    list_expanded = true;
                }
            }
            if (!list_expanded) {
                e.stopImmediatePropagation();
            }
        }
    }, true);
}

function check_user_config() {
    if (config.send_message != "None" && config.send_message != "Ctrl-Enter" && config.send_message != "Enter") {
        alert("Invalid value for config.send_message. Please check enhanced-google-chat.user.js.");
    }
}

// Called only once.
function initialize() {
    // Initialize stylesheets.
    const hljs_css = GM_getResourceText("REMOTE_CSS");
    GM_addStyle(hljs_css);
    // I'm not a CSS expert, we force the font family of every hljs elements to be monospace.
    GM_addStyle(`[class^="hljs-"], [class*=" hljs-"], [class^="hljs"], [class*=" hljs"] {
                     font-family: "Roboto Mono",monospace;
                 }
                 .hljs-language-mark {
                     font-size: 0.8em;
                 }
                 .hljs {
                     background: #fafafa;
                 }
                `
    );

    check_user_config(config);
}

function modify_key_event() {
    if (config.send_message != "None") {
        // register event on the chat text input box
        let div_nodes = document.getElementsByTagName('div');
        for (let div of div_nodes) {
            // The id of the input text area varies, we use 'role', 'aria-label' and 'contenteditable' attributes
            // to locate the element.
            if (div.getAttribute('role') === 'textbox' &&
                div.getAttribute('contenteditable') === 'true' &&
                div.getAttribute('enter-key-event-registered') != 'true') {
                register_enter_key_handler(div, config);
            }
        }
    }
}

// Called periodically.
function main() {
    render_code_blocks();
    modify_key_event();
}

function debounce(fn, delay) {
    let timeout = null;
    return function () {
        if (timeout) {
            return;
        } else {
            timeout = setTimeout(function () {
                fn();
                timeout = null;
            }, delay);
        }
    }
}

(function () {
    'use strict';
    if (window.trustedTypes && window.trustedTypes.createPolicy) {
        window.trustedTypes.createPolicy('default', {
            createHTML: (string, sink) => string
        });
    }

    initialize();

    let el = document.documentElement;
    el.addEventListener('DOMSubtreeModified', debounce(main, 1000));
})();

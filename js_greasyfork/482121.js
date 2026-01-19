// ==UserScript==
// @name         Fiverr - Inbox Enhancer + (Optimized)
// @namespace    https://www.fiverr.com/web_coder_nsd
// @description  Optimized version: Lightweight inbox enhancer with reduced memory usage, back to top, markdown conversion, chat features
// @version      8.1
// @author       Noushad Bhuiyan (Optimized by Claude)
// @icon         https://www.fiverr.com/favicon.ico
// @match        https://*.fiverr.com/inbox*
// @license      MIT
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/482121/Fiverr%20-%20Inbox%20Enhancer%20%2B%20%28Optimized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/482121/Fiverr%20-%20Inbox%20Enhancer%20%2B%20%28Optimized%29.meta.js
// ==/UserScript==


(function () {
    'use strict';

    /*
     FEATURES:
     • Add a "back to top" button
     • converts markdown type message to "unicode" formatted plain text
     • removes ordered message block
     • removes annoying message warnings
     • adds clear all message button
     • Auto writes the name if you type {disp} (Optimized with Debounce)
     • Show other conversation's last full message on tooltip
     • Copy Last Message Button (New)
     • Copy Button attached to every chat message (New)
     • Copy Selected Conversations
     • copy conversations and create new chat in DeepSeek
     • translation converter widget (Lazy Loaded)
     • AI Features: Explain it, Build reply, Guess next reply (Gemini API)
    */

    // --- OPTIMIZATION 1: DEBOUNCE HELPER ---
    // Prevents expensive functions from running on every keystroke
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    var displayNameTriggerText = '{disp}'
    var selector = {
        msgWrapper: ".message-wrapper",
        msgBody: ".message-body",
        msgBody2: ".text",
        msgTimestamp: 'time',
        scrollContent: ".content",
        chatTopButtonSection: ".upper-row aside",
        processingReloadBtn: ".reloadBtn.processing",
        textArea: "textarea#send-message-text-area",
        termsError: ".terms-error",
        userName: ".flex-items-baseline span",
        orderMsgBlock: ".fiverr-message-wrapper .button-link.hover-green",
        detailsPane: '[data-testid="details-pane"]',
        msgHeader: ".header",
        msgContent: ".message-content",
        checkbox: ".select-msg-checkbox",
        clientTime: 'header time'
    };

    // DOM SELECTORS
    const DOM_SELECTORS = {
        MESSAGE_WRAPPER: ".message-wrapper",
        MESSAGE: ".message",
        MESSAGE_FLOW: ".message-flow",
        MESSAGE_CONTENT: ".message-content",
        HEADER: ".header",
        SENDER_NAME: "p:has(strong), .header p, div[class*='a17q9316s'] p",
        TIMESTAMP: "time",
        AVATAR_FIGURE: "figure[title]",
        MESSAGE_BODY: "p",
        MESSAGE_BODY_CONTAINER: "div[class*='a17q93kp']",
        CHECKBOX: ".select-msg-checkbox"
    };

    var API_ACTIONS = {
        "explainIt": `explainIt`,
        "buildReply": `buildReply`,
        "guessNextReply": `guessNextReply`
    }

    var svgLoading = `<svg version="1.1" id="L4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve" width="20px" height="20px" style="align-content: center;">
    <circle fill="#3aba6b" stroke="none" cx="6" cy="50" r="6">
    <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.1"></animate>
    </circle>
    <circle fill="#3aba6b" stroke="none" cx="26" cy="50" r="6">
    <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.2"></animate>
    </circle>
    <circle fill="#3aba6b" stroke="none" cx="46" cy="50" r="6">
    <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.3"></animate>
    </circle>
    </svg>`

    // Kept only required buttons
    const advancedReplyBtns = {
        'Explain it': `<svg xmlns="http://www.w3.org/2000/svg" fill="#3aba6b" width="20" height="20px" viewBox="0 0 16 16"> <g id="SVGRepo_bgCarrier" stroke-width="0"/> <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/> <g id="SVGRepo_iconCarrier"> <path style="fill: #3aba6b;"d="M12.52.55l-5,5h0L.55,12.51l3,3,12-12Zm-4,6,4-4,1,1-4,4.05ZM2.77,3.18A3.85,3.85,0,0,1,5.32,5.73h0A3.85,3.85,0,0,1,7.87,3.18h0A3.82,3.82,0,0,1,5.32.64h0A3.82,3.82,0,0,1,2.77,3.18ZM8.5,2.55h0A2,2,0,0,1,9.78,1.27h0A1.92,1.92,0,0,1,8.5,0h0A1.88,1.88,0,0,1,7.23,1.27h0A1.92,1.92,0,0,1,8.5,2.55Zm-6.36,0h0A1.92,1.92,0,0,1,3.41,1.27h0A1.88,1.88,0,0,1,2.14,0h0A1.92,1.92,0,0,1,.86,1.27h0A2,2,0,0,1,2.14,2.55ZM14.73,6.22h0a1.94,1.94,0,0,1-1.28,1.27h0a1.94,1.94,0,0,1,1.28,1.27h0A1.9,1.9,0,0,1,16,7.49h0A1.9,1.9,0,0,1,14.73,6.22Z"/> </g> </svg>`,
        'Build reply': `<svg width="20" height="20" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style="fill:none;"><path d="M43.9084 41.4813L35.9844 49.4055L43.9084 57.3295" stroke="#3aba6b" stroke-width="5.94299" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M75.6094 41.4813L83.5334 49.4055L75.6094 57.3295" stroke="#3aba6b" stroke-width="5.94299" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M63.7131 40.1746L55.7891 58.6378" stroke="#3aba6b" stroke-width="5.94299" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M42.5 94.0002H40C20 94.0002 10 89.0002 10 64.0002V39C10 19 20 9 40 9H80C100 9 110 19 110 39V64.0002C110 84.0002 100 94.0002 80 94.0002H77.5C75.95 94.0002 74.45 94.7502 73.5 96.0002L66 106C62.7 110.4 57.3 110.4 54 106L46.4999 96.0002C45.6999 94.9002 43.9 94.0002 42.5 94.0002Z" stroke="#3aba6b" stroke-width="7.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        'Guess next reply': `<svg width="20" height="20" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M67.4922 15C78.7639 15 89.5739 19.4777 97.5442 27.448C105.515 35.4183 109.992 46.2283 109.992 57.5C109.992 68.7717 105.515 79.5817 97.5442 87.552C89.5739 95.5223 78.7639 100 67.4922 100H64.9922V104.95C64.9922 105.614 64.8614 106.271 64.6073 106.884C64.3532 107.497 63.9808 108.054 63.5113 108.523C63.0418 108.992 62.4845 109.364 61.8713 109.617C61.258 109.871 60.6008 110.001 59.9372 110C47.6372 109.99 35.1772 105.885 25.7222 97.48C16.1822 88.99 10.0022 76.375 9.99219 60.045V57.5C9.99219 46.2283 14.4699 35.4183 22.4402 27.448C30.4104 19.4777 41.2205 15 52.4922 15H67.4922ZM67.4922 25H52.4922C43.8727 25 35.6061 28.4241 29.5112 34.519C23.4163 40.614 19.9922 48.8805 19.9922 57.5L19.9972 60.825C20.1972 74.035 25.2022 83.635 32.3722 90.005C38.5622 95.515 46.5772 98.8 54.9922 99.725V95.05C54.9922 92.26 57.2522 90 60.0422 90H67.4922C76.1117 90 84.3782 86.5759 90.4732 80.481C96.5681 74.386 99.9922 66.1195 99.9922 57.5C99.9922 48.8805 96.5681 40.614 90.4732 34.519C84.3782 28.4241 76.1117 25 67.4922 25ZM42.4922 50C44.4813 50 46.389 50.7902 47.7955 52.1967C49.202 53.6032 49.9922 55.5109 49.9922 57.5C49.9922 59.4891 49.202 61.3968 47.7955 62.8033C46.389 64.2098 44.4813 65 42.4922 65C40.5031 65 38.5954 64.2098 37.1889 62.8033C35.7824 61.3968 34.9922 59.4891 34.9922 57.5C34.9922 55.5109 35.7824 53.6032 37.1889 52.1967C38.5954 50.7902 40.5031 50 42.4922 50ZM77.4922 50C79.4813 50 81.389 50.7902 82.7955 52.1967C84.202 53.6032 84.9922 55.5109 84.9922 57.5C84.9922 59.4891 84.202 61.3968 82.7955 62.8033C81.389 64.2098 79.4813 65 77.4922 65C75.5031 65 73.5954 64.2098 72.1889 62.8033C70.7824 61.3968 69.9922 59.4891 69.9922 57.5C69.9922 55.5109 70.7824 53.6032 72.1889 52.1967C73.5954 50.7902 75.5031 50 77.4922 50Z" fill="#3aba6b"/></svg>`
    };

    class GeminiClient {
        constructor() {
            this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
            this.primaryModel = 'gemini-2.0-flash';
            this.fallbackModel = 'gemini-2.5-flash';
        }

        async init() {
            let apiKey = localStorage.getItem('gemini_api_key');
            if (!apiKey) {
                apiKey = prompt('Please enter your Gemini API key:');
                if (!apiKey) {
                    throw new Error('API key is required');
                }
                localStorage.setItem('gemini_api_key', apiKey);
            }
            this.apiKey = apiKey;
        }

        async fetchFromModel(model, prompt) {
            const response = await fetch(`${this.baseUrl}/${model}:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });
            return response;
        }

        async generateContent(prompt) {
            if (!this.apiKey) {
                await this.init();
            }

            try {
                let response = await this.fetchFromModel(this.primaryModel, prompt);

                if (response.status === 429) {
                    console.warn(`Rate limit on ${this.primaryModel}, switching to ${this.fallbackModel}...`);
                    response = await this.fetchFromModel(this.fallbackModel, prompt);
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                return data.candidates?.[0]?.content?.parts?.[0]?.text || '[No response text]';

            } catch (error) {
                console.error('Error calling Gemini API:', error);
                throw error;
            }
        }
    }

    async function callGeminiAPI(action, conversationText, command) {
        try {
            var prompt = conversationText
            var timeEls = document.querySelectorAll(selector.clientTime)
            var clinetCurrentTime = ''
            if (action == 'explainIt') {
                prompt += `\nThis is the last conversation with my client. Can you explain it to me in simple terms? I am just a programmer, so please make it as simple as possible. Now, explain it based on what I ask to you, follow the conversation context and help me : ${command}. you must return the response in JSON schema like this: {clientMood:"String", explanation:"String", suggestion:"String", whatToSay:"String"}`
            }
            if (action == 'buildReply') {
                clinetCurrentTime = timeEls[timeEls.length - 1].textContent
                prompt += `\nThis is the last conversation with my client. My name is Noushad, and do not mention the client name in response.  Now, generate me a reply what I can write next based on the above context and the command I will give you. for example if I give you command that "tell him I am busy" you may write a profound reply to professionally neglect the offer of the client saying I am busy in current schedule. Note: Give precise and supportive message in conversation style. do not reply it as a e-mail body style. make it as if you are sms texting with the client. Just send me the reply, no emojis. This is the current time of the client: ${clinetCurrentTime}, based on the current time, and the last section of the conversation, analyze the mood detection of the client + design a wish (if needed) and convincing/polite message. reply and tell the client properly in professional way, here's my command to you: ${command}`
            }
            if (action == 'guessNextReply') {
                clinetCurrentTime = timeEls[timeEls.length - 1].textContent
                prompt += `\nThis is the last conversation with my client. My name is Noushad, and do not mention the [client name] in response.  Now, give me a reply what I can write next based on the above context. Note: Give precise and supportive message in conversation style. do not reply it as a e-mail body style. make it as if you are sms texting with the client. Remember you are acting as me (a programmer who is trying to understand the client and help find out the solution). Just send me the next reply based on the current context , nothing extra, no emojis`
            }

            const gemini = new GeminiClient();
            const response = await gemini.generateContent(prompt);
            return response;
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'An error occurred while calling the API');
            throw error;
        }
    }

    // Add Font Awesome CSS link
    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css';
    fontAwesomeLink.rel = 'stylesheet';
    fontAwesomeLink.type = 'text/css';
    document.head.appendChild(fontAwesomeLink);

    function addSelectMsgBtn() {
        const chatTopButtonSection = document.querySelector(selector.chatTopButtonSection);
        if (chatTopButtonSection) {
            var existingScrollTopBtn = document.querySelector(".select-msg-btn");
            if (existingScrollTopBtn) existingScrollTopBtn.remove();

            const scrollTopButton = document.createElement("button");
            scrollTopButton.innerHTML = '<i class="fa fa-check-square" style="font-size:2em;padding:0.4em;margin:0;"></i>';
            scrollTopButton.className = "select-msg-btn";
            scrollTopButton.title = "Select messages to copy";
            scrollTopButton.addEventListener("click", toggleCheckboxes);
            chatTopButtonSection.appendChild(scrollTopButton);
        }
    }

    function toggleCheckboxes() {
        const messageElements = document.querySelectorAll(".message");
        var willSendToChatGPT = false
        messageElements.forEach((message, index) => {
            const existingCheckbox = message.querySelector(".select-msg-checkbox");
            if (!existingCheckbox) {
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.className = "select-msg-checkbox";
                message.insertBefore(checkbox, message.firstChild);
            } else {
                const selectedCheckboxes = document.querySelectorAll(".select-msg-checkbox:checked");
                if (selectedCheckboxes.length > 0) {
                    willSendToChatGPT = true
                }
            }
        });
        if (willSendToChatGPT) conversationFormatter(true)
    }

    function addScrollToTopBtn() {
        const chatTopButtonSection = document.querySelector(selector.chatTopButtonSection);
        if (chatTopButtonSection) {
            var existingScrollTopBtn = document.querySelector(".scroll-top-btn");
            if (existingScrollTopBtn) existingScrollTopBtn.remove();

            const scrollTopButton = document.createElement("button");
            scrollTopButton.innerHTML = '<i class="fa fa-arrow-circle-up"></i>';
            scrollTopButton.className = "scroll-top-btn";
            scrollTopButton.title = "Scroll to Top";
            scrollTopButton.addEventListener("click", toggleScrollToTop);
            chatTopButtonSection.appendChild(scrollTopButton);
        }
    }

    let scrolling = false;
    function toggleScrollToTop() {
        const scrollTopButton = document.querySelector(".scroll-top-btn");
        if (scrolling) {
            scrolling = false;
            scrollTopButton.classList.remove("active");
        } else {
            scrolling = true;
            scrollTopButton.classList.add("active");
            innerScroll();
        }
        function innerScroll() {
            const element = document.querySelector(selector.scrollContent);
            if (element && scrolling) {
                element.scrollTo({ top: 0, behavior: "smooth" });
                if (element.textContent.includes("WE HAVE YOUR BACKFor added safety and your protection, keep payments and communications within Fiverr. Learn more")) {
                    scrolling = false;
                    scrollTopButton.classList.remove("active");
                }
                setTimeout(innerScroll, 1000);
            }
        }
    }

    function convertMarkdownToUnicode(text) {
        const charMapping = {
            'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝',
            'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧',
            'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭', 'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱',
            'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻',
            'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅',
            'y': '𝘆', 'z': '𝘇'
        };
        const charMappingUnderline = {
            'A': 'A͟', 'B': 'B͟', 'C': 'C͟', 'D': 'D͟', 'E': 'E͟', 'F': 'F͟', 'G': 'G͟', 'H': 'H͟', 'I': 'I͟', 'J': 'J͟',
            'K': 'K͟', 'L': 'L͟', 'M': 'M͟', 'N': 'N͟', 'O': 'O͟', 'P': 'P͟', 'Q': 'Q͟', 'R': 'R͟', 'S': 'S͟', 'T': 'T͟',
            'U': 'U͟', 'V': 'V͟', 'W': 'W͟', 'X': 'X͟', 'Y': 'Y͟', 'Z': 'Z͟', 'a': 'a͟', 'b': 'b͟', 'c': 'c͟', 'd': 'd͟',
            'e': 'e͟', 'f': 'f͟', 'g': 'g͟', 'h': 'h͟', 'i': 'i͟', 'j': 'j͟', 'k': 'k͟', 'l': 'l͟', 'm': 'm͟', 'n': 'n͟',
            'o': 'o͟', 'p': 'p͟', 'q': 'q͟', 'r': 'r͟', 's': 's͟', 't': 't͟', 'u': 'u͟', 'v': 'v͟', 'w': 'w͟', 'x': 'x͟',
            'y': 'y͟', 'z': 'z͟'
        };
        const numberFormatting = {
            '1': '⑴', '2': '⑵', '3': '⑶', '4': '⑷', '5': '⑸', '6': '⑹', '7': '⑺', '8': '⑻', '9': '⑼', '0': '⑽'
        };

        text = text.replace(/(\d+)\. (\*\*.*?\*\*)/g, (_, number, text) => {
            let formattedNumber = '';
            for (const digit of number) {
                formattedNumber += numberFormatting[digit];
            }
            return formattedNumber + '. ' + text;
        });

        text = text.replace(/### (.*?)(\r\n|\r|\n|$)/g, (_, header) => {
            for (const [sourceChar, targetChar] of Object.entries(charMappingUnderline)) {
                const regex = new RegExp(sourceChar, 'g');
                header = header.replace(regex, targetChar);
            }
            for (const [sourceChar, targetChar] of Object.entries(charMapping)) {
                const regex = new RegExp(sourceChar, 'g');
                header = header.replace(regex, targetChar);
            }
            return ("❒ " + header + " ❱");
        });

        text = text.replace(/\*\*(.*?)\*\*/g, (_, boldText) => {
            for (const [sourceChar, targetChar] of Object.entries(charMapping)) {
                const regex = new RegExp(sourceChar, 'g');
                boldText = boldText.replace(regex, targetChar);
            }
            return boldText;
        });

        text = text.replace(/^   - /gm, "   ◉ ");
        text = text.replace(/^    - /gm, "    • ");
        text = text.replace(/^        - /gm, "        ‣ ");

        const negativeTexts = [
            { original: "email", replacement: "e-mail" },
            { original: "emails", replacement: "e-mails" },
            { original: "Email", replacement: "E-mail" },
            { original: "Emails", replacement: "E-mails" },
            { original: "pay", replacement: "𝗉𝖺𝗒" },
            { original: "money", replacement: "𝗆𝗈𝗇𝖾𝗒" }
        ];

        text = replaceNegativeTexts(text, negativeTexts)
        return text;
    }

    function replaceNegativeTexts(text, negativeTexts) {
        negativeTexts.forEach(({ original, replacement }) => {
            const regex = new RegExp(`\\b${original}\\b`, 'g');
            text = text.replace(regex, replacement);
        });
        return text;
    }

    function addMsgClearBtn() {
        var existingClrBtn = document.querySelector('.clear-button');
        if (!existingClrBtn) {
            const clearButton = document.createElement('button');
            clearButton.innerHTML = '<i class="fa fa-times"></i>';
            clearButton.classList.add('clear-button');
            clearButton.title = 'Clear all text';
            const textareaContainer = document.querySelector('#send-message-text-area');
            if (textareaContainer && textareaContainer.parentNode) {
                textareaContainer.parentNode.style.display = '-webkit-inline-box';
                textareaContainer.parentNode.insertBefore(clearButton, textareaContainer);
            }

            clearButton.addEventListener('click', function () {
                const textArea = document.querySelector(selector.textArea);
                if (textArea) {
                    setText("")
                }
            });
        } else {
             const textareaContainer = document.querySelector('#send-message-text-area');
             if (textareaContainer && textareaContainer.parentNode) {
                 textareaContainer.parentNode.style.display = '-webkit-inline-box';
             }
        }
    }

    function addAdvancedQuickReplySection() {
        const offerButton = document.querySelector('[data-testid="create-custom-offer-button"]');
        const actionBar = offerButton?.closest('div');
        var existingDiv = document.querySelector('#advanced-quick-reply')
        if (actionBar && !existingDiv) {
            const newDiv = document.createElement('div');
            newDiv.id = 'advanced-quick-reply';
            newDiv.style.cssText = 'display:flex;gap:10px;border:2px solid rgb(0 5 30 / 6%);border-radius:12px;padding:5px;align-items:center;';

            Object.entries(advancedReplyBtns).forEach(([key, svg]) => {
                const btn = document.createElement('button');
                btn.style.borderRadius = '5px'
                btn.innerHTML = svg;
                btn.style.margin = '0px';
                btn.style.padding = '0px';
                btn.style.display = 'inherit';
                btn.onmouseover = () => {
                    if (!btn.disabled) {
                        btn.style.backgroundColor = '#4e536e5e';
                        btn.title = key;
                    }
                };
                btn.onmouseout = () => {
                    btn.style.backgroundColor = 'transparent';
                };

                // Simplified Action Logic: Only AI features remain
                const action = async () => {
                   if(key === "Explain it") {
                        var userInput = prompt("Please enter your command:")
                        if (!userInput) return
                        var checkboxesLength = document.querySelectorAll(".select-msg-checkbox:checked").length
                        var conversationText = conversationFormatter(checkboxesLength > 0, false)
                        function showResponsePopup(response) {
                            const existingPopup = document.getElementById('response-popup');
                            if (existingPopup) document.body.removeChild(existingPopup);
                            const popup = document.createElement('div');
                            popup.id = 'response-popup';
                            popup.style.cssText = "overflow: scroll; height: 70vh;position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1000; background: white; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); border-radius: 8px";
                            popup.innerHTML = `<h2>AI Response</h2>
                                <p><strong>Client Mood:</strong> ${response.clientMood || 'N/A'}</p>
                                <p><strong>Explanation:</strong> ${response.explanation || 'N/A'}</p>
                                <p><strong>Suggestion:</strong> ${response.suggestion || 'N/A'}</p>
                                <p><strong>What to Say:</strong> ${response.whatToSay || 'N/A'}</p>
                                <button id="closePopup">Close</button>`;
                            document.body.appendChild(popup);
                            document.getElementById('closePopup').addEventListener('click', () => document.body.removeChild(popup));
                        }
                        try {
                            var reply = await callGeminiAPI(API_ACTIONS["explainIt"], conversationText, userInput)
                            var start = reply.indexOf('{');
                            var end = reply.lastIndexOf('}');
                            var replyString = reply.substring(start, end + 1);
                            showResponsePopup(JSON.parse(replyString));
                        } catch (error) {
                            console.error("Error displaying response:", error);
                            showResponsePopup({ clientMood: 'N/A', explanation: error.message, suggestion: 'N/A', whatToSay: 'N/A' });
                        }
                   }
                   if(key === "Build reply") {
                        var userInput = prompt("Please enter your command:")
                        if (!userInput) return
                        var checkboxesLength = document.querySelectorAll(".select-msg-checkbox:checked").length
                        var conversationText = conversationFormatter(checkboxesLength > 0, false)
                        var reply = await callGeminiAPI(API_ACTIONS["buildReply"], conversationText, userInput)
                        setText(reply, false, false)
                   }
                   if(key === "Guess next reply") {
                        var checkboxesLength = document.querySelectorAll(".select-msg-checkbox:checked").length
                        var conversationText = conversationFormatter(checkboxesLength > 0, false)
                        var nextReply = await callGeminiAPI(API_ACTIONS["guessNextReply"], conversationText, "")
                        setText(nextReply, false, false)
                   }
                };

                // All remaining buttons are async AI actions
                btn.onclick = async () => {
                    btn.style.backgroundColor = 'transparent';
                    btn.innerHTML = svgLoading;
                    btn.disabled = true;
                    btn.classList.add('disabled-btn');
                    try {
                        await action();
                    } finally {
                        btn.disabled = false;
                        btn.classList.remove('disabled-btn');
                        btn.innerHTML = svg;
                    }
                }
                newDiv.appendChild(btn);
            });

            actionBar.insertBefore(newDiv, actionBar.children[0]);
        } else {
            console.warn('message-action-bar not found');
        }
    }

    function setText(text, removePrevValue = true, addEnter = false) {
        let input = document.querySelector(selector.textArea);
        if (!input) return;
        let lastValue = input.value;
        if (removePrevValue) {
            input.value = '';
        }
        input.value += text;
        let event = new Event('input', { bubbles: true });
        event.simulated = true;
        let tracker = input._valueTracker;
        if (tracker) {
            tracker.setValue(lastValue);
        }
        input.dispatchEvent(event);
        if (addEnter) {
            input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
        }
    }

    // --- OPTIMIZATION 2: ADD COPY BUTTONS TO MESSAGES ---
    function addCopyButtonsToMessages() {
        const messages = document.querySelectorAll(DOM_SELECTORS.MESSAGE_CONTENT);
        if (messages.length === 0) return;

        messages.forEach((msg) => {
            // Prevent duplicates
            if (msg.querySelector('.script-copy-btn')) return;

            const btn = document.createElement('button');
            btn.className = 'script-copy-btn';
            btn.innerHTML = '<i class="fa fa-copy" style="color:#666;"></i>';
            btn.title = "Copy this message";

            btn.onclick = () => {
                // Extract text. innerText captures text, time and visible content.
                let textToCopy = msg.innerText.trim();

                // If innerText is empty but there are images, try to get alt/title
                if (!textToCopy) {
                    const img = msg.querySelector('img');
                    if (img) {
                        textToCopy = img.alt || img.title || "[Image]";
                    } else {
                        textToCopy = "[Message]";
                    }
                }

                GM_setClipboard(textToCopy, 'text');
            };

            msg.appendChild(btn);
        });
    }

    function showOtherMsgTooltip() {
        var contacts = document.querySelectorAll(".contact")

        contacts.forEach(function (contact) {
            var asideDiv = contact.querySelector("aside");
            if (!asideDiv) return;

            // --- NEW: Create a horizontal wrapper for action buttons ---
            var actionWrapper = asideDiv.querySelector(".script-actions-wrapper");
            if (!actionWrapper) {
                actionWrapper = document.createElement("div");
                actionWrapper.className = "script-actions-wrapper";
                // This ensures horizontal alignment (display: flex)
                actionWrapper.style.display = "flex";
                actionWrapper.style.alignItems = "center";
                actionWrapper.style.gap = "5px"; // Adds a small space between buttons
                asideDiv.appendChild(actionWrapper);
            }
            // ---------------------------------------------------------

            // 1. Add Open in Tab button
            var open_url_div = contact.querySelector("#open_url")
            if (!open_url_div && actionWrapper) { // Check inside wrapper
                var username = contact.querySelector("figure").title;
                var url = "/inbox/" + username;
                var link = document.createElement("a");
                link.setAttribute("id", "open_url");
                link.setAttribute("href", url);
                link.style = "margin:0px;padding: 0 3px;display: flex;";
                link.setAttribute("target", "_blank");
                var icon = document.createElement("img");
                icon.setAttribute("src", "https://cdn-icons-png.flaticon.com/16/12690/12690112.png");
                icon.setAttribute("height", "18px")
                link.appendChild(icon);
                actionWrapper.appendChild(link); // Append to wrapper
            }

            // 2. Add Copy Last Message Button
            var copy_last_msg_div = contact.querySelector("#copy-last-msg-btn")
            if (!copy_last_msg_div && actionWrapper) { // Check inside wrapper
                // Get text to copy from excerpt (which shows in tooltip)
                var excerptSpan = contact.querySelector(".contact-excerpt span");
                var messageText = excerptSpan ? excerptSpan.innerText : "";

                var copyBtn = document.createElement("button");
                copyBtn.setAttribute("id", "copy-last-msg-btn");
                copyBtn.style = "margin:0px;padding: 0 3px;display: flex;cursor:pointer;border:none;background:transparent;";
                copyBtn.title = "Copy last message";

                var copyIcon = document.createElement("img");
                copyIcon.setAttribute("src", "https://cdn-icons-png.flaticon.com/512/747/747938.png");
                copyIcon.setAttribute("height", "18px");

                copyBtn.appendChild(copyIcon);

                copyBtn.onclick = function() {
                    if(messageText) {
                        GM_setClipboard(messageText, 'text');
                    }
                };

                actionWrapper.appendChild(copyBtn); // Append to wrapper
            }
        });

        // Native tooltip logic
        const contactExcerpts = document.querySelectorAll(".contact-excerpt span");
        contactExcerpts.forEach(function (contactExcerpt) {
            const textContent = contactExcerpt.innerText;
            contactExcerpt.setAttribute('title', textContent);
        });
    }

    function createGPTConv() {
        const prevBtn = document.querySelector('.createGPTconvBtn');
        if (prevBtn) prevBtn.remove()
        const customBtnArea = document.querySelector('[data-testid="details-pane"] .custom-btn-area');
        if (!customBtnArea) return;
        const button = customBtnArea.appendChild(document.createElement('button'));
        button.className = "createGPTconvBtn"
        const image = button.appendChild(document.createElement('img'));
        image.src = 'https://cdn-icons-png.flaticon.com/512/7512/7512915.png';
        image.alt = 'Create Conversation Icon';
        button.title = 'Create New Conversation in DeepSeek';
        button.addEventListener('click', () => { conversationFormatter(false) });
    }

    function createOpenInChatGPTBtn() {
        const prevBtn = document.querySelector('.openWithDeepseekBtn');
        if (prevBtn) prevBtn.remove()
        const customBtnArea = document.querySelector('[data-testid="details-pane"] .custom-btn-area');
        if (!customBtnArea) return;
        const button = customBtnArea.appendChild(document.createElement('button'));
        button.className = "openWithDeepseekBtn"
        const image = button.appendChild(document.createElement('img'));
        image.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/DeepSeek-icon.svg/1200px-DeepSeek-icon.svg.png';
        image.alt = 'Deepseek Icon';
        button.title = 'Open Conversation in Deepseek';
        button.addEventListener('click', () => window.open(`https://chat.deepseek.com?search=${window.location.pathname.split('/').pop()}`, '_blank'));
    }

    // Lazy Loading for Translation Widget
    async function addTranslationIframe() {
        if (document.getElementById('translation-widget')) return;

        const detailsPane = document.querySelector('[data-testid="details-pane"]');
        if (!detailsPane) return;

        const container = document.createElement('div');
        container.id = 'translation-widget';
        container.style.cssText = "margin-top: 20px; border: 1px solid black; border-radius: 8px; padding: 0.5em;";

        const header = document.createElement('div');
        header.style.cssText = "cursor: pointer; display: flex; justify-content: space-between; align-items: center; padding: 0.5em;";
        header.innerHTML = `<span><h6 style="margin:0; color: #333;">Translation Widget</h6><small style="color: #666;">Click to Load</small></span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6" /></svg>`;

        const body = document.createElement('div');
        body.style.cssText = "display: none; margin-top: 10px;";

        header.onclick = () => {
            const isHidden = body.style.display === 'none';
            body.style.display = isHidden ? 'block' : 'none';

            if (isHidden && !body.querySelector('iframe')) {
                const iframe = document.createElement('iframe');
                iframe.id = 'translation-iframe';
                iframe.src = 'https://noushadbug.github.io/translator-interface-web/';
                iframe.style.cssText = "height: 350px; width: 100%; border: none; border-radius: 5px;";
                body.appendChild(iframe);
            }
        };

        container.appendChild(header);
        container.appendChild(body);
        detailsPane.appendChild(container);
    }

    function addTopButtons() {
        addSelectMsgBtn();
        addScrollToTopBtn();
    }

    function addDetailsPaneButtons() {
        const detailsPane = document.querySelector(selector.detailsPane);
        if (detailsPane) {
            var existingDiv = detailsPane.querySelector(".custom-btn-area")
            if (existingDiv) existingDiv.remove()
            const customBtnArea = detailsPane.appendChild(document.createElement('div'));
            customBtnArea.classList.add('custom-btn-area');
            customBtnArea.id = "custom-btn-area"
            customBtnArea.style.display = 'flex';
            customBtnArea.style.justifyContent = 'center';
            createOpenInChatGPTBtn();
            createGPTConv()
            addTranslationIframe() // Appends to placeholder
        }
    }

    function conversationFormatter(isSelected = false, isChatGPTRedirect = true) {
        let conversationText = '';
        let wrappers = [];
        let url = '';

        if (isSelected) {
            const checkedBoxes = document.querySelectorAll(`${DOM_SELECTORS.CHECKBOX}:checked`);
            checkedBoxes.forEach(cb => {
                const wrapper = cb.closest(DOM_SELECTORS.MESSAGE) || cb.closest(DOM_SELECTORS.MESSAGE_WRAPPER);
                if (wrapper) wrappers.push(wrapper);
            });
            url = `https://chat.deepseek.com/?search=${window.location.pathname.split('/').pop()}&doCopy=true`;
        } else {
            const messageFlow = document.querySelector(DOM_SELECTORS.MESSAGE_FLOW);
            if (messageFlow) {
                wrappers = Array.from(messageFlow.querySelectorAll(DOM_SELECTORS.MESSAGE));
                const additionalWrappers = Array.from(messageFlow.querySelectorAll(DOM_SELECTORS.MESSAGE_WRAPPER))
                    .filter(w => !wrappers.includes(w));
                wrappers = wrappers.concat(additionalWrappers);
            }
            url = `https://chat.deepseek.com/?createChat=${window.location.pathname.split('/').pop()}`;
        }

        wrappers.forEach(wrapper => {
            let messageBody = '';
            let originalMessage = '';
            let senderText = 'Unknown';
            let isMe = false;
            let isReply = false;

            const messageContent = wrapper.querySelector(DOM_SELECTORS.MESSAGE_CONTENT);
            if (messageContent) {
                const senderSelectors = [
                    DOM_SELECTORS.SENDER_NAME,
                    ".header p",
                    "div[class*='a17q9316s'] p",
                    "div[class*='a17q9316t'] p",
                    "p:has(strong)"
                ];

                for (const sel of senderSelectors) {
                    const senderEl = messageContent.querySelector(sel);
                    if (senderEl && senderEl.textContent.trim()) {
                        senderText = senderEl.textContent.trim();
                        break;
                    }
                }

                const repliedIndicator = Array.from(messageContent.querySelectorAll("p")).find(p => p.textContent.trim() === "Replied");
                if (repliedIndicator) {
                    isReply = true;
                    const buttonContainer = messageContent.querySelector("div[role='button']");
                    if (buttonContainer) {
                        const originalMessageContainer = buttonContainer.querySelector("div.a17q9316n.a17q930.a17q93109.a17q93177.a17q93190.a17q931b8");
                        if (originalMessageContainer) {
                            const messageParagraphs = originalMessageContainer.querySelectorAll("p");
                            if (messageParagraphs.length > 0) {
                                const messageTexts = Array.from(messageParagraphs).map(p => p.textContent.trim()).filter(text => {
                                    if (!text || text.length <= 5) return false;
                                    if (text.includes("Replied")) return false;
                                    if (/\b(AM|PM)\b/.test(text)) return false;
                                    if (/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/.test(text)) return false;
                                    if (/^\w{1,2}\s*$/.test(text)) return false;
                                    const namePattern = /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2}$/;
                                    if (namePattern.test(text)) return false;
                                    const messageIndicators = /[.!?]|\b(how|what|when|where|why|who|can|could|would|should|is|are|was|were|have|has|will|would|please|thank|hi|hello|hey|yes|no|ok|okay|sure|well|so|but|and|or|if|then|because|since|although|however|therefore)\b/i;
                                    return messageIndicators.test(text) || text.length > 20;
                                });
                                originalMessage = messageTexts.length > 0 ? messageTexts.join(' ').trim() : Array.from(messageParagraphs).pop().textContent.trim();
                            }
                        }
                    }
                    const replyContainer = messageContent.querySelector("div[class*='a17q93kp'] p");
                    if (replyContainer) {
                        messageBody = replyContainer.textContent.trim();
                    }
                } else {
                     const replyIndicators = [
                        messageContent.querySelector("div[class*='a17q93xw']"),
                        messageContent.querySelector(".quote"),
                        messageContent.querySelector("[class*='reply']"),
                        messageContent.querySelector("[class*='quoted']")
                    ];
                    if (replyIndicators.some(indicator => indicator)) {
                        isReply = true;
                        const quotedContainers = [
                            messageContent.querySelector("div[class*='a17q93xw']"),
                            messageContent.querySelector("div[class*='a17q93y']"),
                            messageContent.querySelector(".original-message"),
                            messageContent.querySelector("[class*='original']")
                        ];
                        for (const container of quotedContainers) {
                            if (container) {
                                const quotedText = container.textContent.trim();
                                if (quotedText && quotedText.length > 10) {
                                    originalMessage = quotedText;
                                    break;
                                }
                            }
                        }
                    }
                }

                if (!messageBody && !isReply) {
                    const bodyContainers = [
                        messageContent.querySelector(DOM_SELECTORS.MESSAGE_BODY_CONTAINER),
                        messageContent.querySelector("div[class*='a17q93kp']"),
                        messageContent.querySelector("div[class*='a17q93c']"),
                        messageContent
                    ];
                    for (const container of bodyContainers) {
                        if (container) {
                            const pList = container.querySelectorAll(DOM_SELECTORS.MESSAGE_BODY);
                            const contentParagraphs = Array.from(pList).filter(p => {
                                const text = p.textContent.trim();
                                return text &&
                                       !text.includes('WE HAVE YOUR BACK') &&
                                       !text.includes('For added safety') &&
                                       !text.includes('This message relates to') &&
                                       !text.includes('Fiverr Pro') &&
                                       !/^[A-Z]{1,2}\s*$/.test(text) &&
                                       !p.closest("div[class*='a17q93xw']");
                            });
                            if (contentParagraphs.length > 0) {
                                messageBody = contentParagraphs.map(p => p.textContent.trim()).join(' ').trim();
                                break;
                            }
                        }
                    }
                }
            }

            if (!messageBody) {
                const allParagraphs = wrapper.querySelectorAll("p");
                const textContents = Array.from(allParagraphs).map(p => p.textContent.trim()).filter(text => text && text.length > 5 && !text.includes('WE HAVE YOUR BACK') && !text.includes('For added safety') && !text.includes('This message relates to') && !text.includes('Fiverr Pro') && !/^[A-Z]{1,2}\s*$/.test(text));
                messageBody = textContents.join(' ').trim();
            }

            isMe = senderText === 'Me' || wrapper.querySelector("figure[title*='web_coder_nsd']") || wrapper.textContent.includes('Me:');

            if (messageBody) {
                if (isReply && originalMessage) {
                    conversationText += isMe
                        ? `Me: REPLIED TO "${originalMessage.substring(0, 100)}${originalMessage.length > 100 ? '...' : ''}"\n       > ${messageBody}\n\n`
                        : `Client: REPLIED TO "${originalMessage.substring(0, 100)}${originalMessage.length > 100 ? '...' : ''}"\n       > ${messageBody}\n\n`;
                } else {
                    conversationText += isMe ? `Me: ${messageBody}\n\n` : `Client: ${messageBody}\n\n`;
                }
            }
        });

        if (isSelected || document.querySelectorAll(DOM_SELECTORS.CHECKBOX).length) {
            document.querySelectorAll(DOM_SELECTORS.CHECKBOX).forEach(cb => cb.remove());
        }

        GM_setClipboard(conversationText, 'text');

        if (isChatGPTRedirect) {
            window.open(url, '_blank');
        } else {
            return conversationText;
        }
    }

    function updateTabTitle() {
        const pathParts = window.location.pathname.split('/');
        const username = pathParts[pathParts.length - 1];
        if (username && username.trim()) {
            document.title = `${username} | Inbox`;
        } else {
            document.title = 'inbox';
        }
    }

    function displayNamePlacer() {
        const textarea = document.querySelector(selector.textArea);
        const userNameElement = document.querySelector(selector.userName);
        if (textarea && userNameElement) {
            if (textarea.value.includes(displayNameTriggerText) || textarea.value.toLowerCase().includes('[client name]')) {
                const newText = textarea.value.replace(displayNameTriggerText, userNameElement.innerText).replace('[client name]', userNameElement.innerText).replace('[Client name]', userNameElement.innerText);
                setText(newText)
            }
        }
    }

    function createAccordion(element, title) {
        if (element.classList.contains("accordion")) {
            return;
        }
        element.classList.add("accordion")
        element.classList.add("p-0")
        const accordionHTML = `
        <div class="accordion-item">
        <div class="accordion-item-header">
        <span class="accordion-item-header-title">${title}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down accordion-item-header-icon">
        <path d="m6 9 6 6 6-6" />
        </svg>
        </div>
        <div class="accordion-item-description-wrapper">
        <div class="accordion-item-description">
        <hr>
        ${element.innerHTML}
        </div>
        </div>
        </div>
        </div>
        `;
        element.innerHTML = accordionHTML;
        const accordionItem = element.querySelector('.accordion-item');
        const accordionHeader = accordionItem.querySelector('.accordion-item-header');
        accordionHeader.addEventListener("click", () => {
            accordionItem.classList.toggle("open");
        });
    }

    // Debounced handler for Textarea
    const handleTextareaInput = debounce(() => {
        const textArea = document.querySelector(selector.textArea);
        if (!textArea) return;

        // 1. Handle {disp} replacement
        displayNamePlacer();

        // 2. Handle Markdown conversion
        const rawValue = textArea.value;
        const markedDownValue = convertMarkdownToUnicode(rawValue);

        if (rawValue !== markedDownValue) {
            textArea.value = markedDownValue;

            // Trigger React change detection
            let event = new Event('input', { bubbles: true });
            event.simulated = true;
            let tracker = textArea._valueTracker;
            if (tracker) {
                tracker.setValue(rawValue);
            }
            textArea.dispatchEvent(event);
        }
    }, 300);

    let isObserverRunning = false;

    // Observe mutations in inbox
    const inboxObserver = new MutationObserver(function (mutations) {
        if (isObserverRunning) return;
        isObserverRunning = true;

        setTimeout(() => {
            mutations.forEach(function (mutation) {
                var sellerPlusSection = document.querySelector('[data-testid="buyer-analytics"]');
                if (sellerPlusSection && !sellerPlusSection.querySelector('.accordion-item')) {
                    createAccordion(sellerPlusSection, "Seller Plus Details");
                }
                const orderCardElement = document.querySelector('[role="order-card"]');
                if (orderCardElement && !orderCardElement.querySelector('.accordion-item')) {
                    const div = orderCardElement.closest(".w7m89t0");
                    createAccordion(div, "Order History");
                    const userCardElement = document.querySelector(".MYCOWEK");
                    if (userCardElement) {
                        createAccordion(userCardElement, "User Details");
                    }
                }
                const buyerPane = document.querySelector('[data-testid="buyer-analytics"]')
                if (buyerPane) {
                    if (!buyerPane.textContent.includes("Metrics below reflect past orders with public reviews, except where noted.")) {
                        buyerPane.remove()
                    }
                }

                // Optimized Textarea Handling
                if (mutation.target.id == "send-message-text-area") {
                    var termsError = document.querySelector(selector.termsError)
                    if (termsError) termsError.style.display = 'none';

                    // Use debounced handler
                    handleTextareaInput();
                }

                if (mutation.type === 'childList' && mutation.target.classList.contains("layout_service")) {
                    const orderMsgEl = document.querySelector(selector.orderMsgBlock);
                    if (orderMsgEl) {
                        orderMsgEl.click();
                    }

                    updateTabTitle();
                    showOtherMsgTooltip()
                    addCopyButtonsToMessages() // Feature 2: Add Copy Buttons to Messages

                    const textArea = document.querySelector(selector.textArea);
                    if (textArea && !textArea.hasAttribute('data-scroll-set')) {
                        textArea.style.overflowY = "scroll";
                        textArea.setAttribute('data-scroll-set', 'true');
                    }
                    addMsgClearBtn()
                    addTopButtons()
                    addDetailsPaneButtons()
                    addAdvancedQuickReplySection()

                    const detailsPane = document.querySelector('[data-testid="details-pane"]');
                    if (detailsPane) {
                        if (detailsPane && !detailsPane.classList.contains("min-width-pane")) {
                            detailsPane.classList.add("min-width-pane");
                        }
                        const elements = Array.from(detailsPane.children);
                        elements.sort((a, b) => {
                            const priorityElements = ['custom-btn-area', 'search-area', 'nav-buttons'];
                            const indexA = priorityElements.indexOf(a.id);
                            const indexB = priorityElements.indexOf(b.id);
                            if (indexA !== -1 && indexB !== -1) {
                                return indexA - indexB;
                            }
                            if (indexA !== -1) return -1;
                            if (indexB !== -1) return 1;
                            return a.id.localeCompare(b.id);
                        });
                        detailsPane.innerHTML = '';
                        elements.forEach(element => {
                            detailsPane.appendChild(element);
                        });
                    }
                }
            });
            isObserverRunning = false;
        }, 100); // 100ms Throttle
    });

    inboxObserver.observe(document.body, { childList: true, subtree: true });

    setTimeout(updateTabTitle, 1000);

    const keyframesCSS = `@keyframes rotateInfinite{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}`;
    const otherCSS = `.message-container{display: flex !important;flex-direction: row !important;}.accordion {--border-color: #cccccc;--background-color: #f1f1f1;--transition: all 0.2s ease;display: flex;flex-direction: column;gap: 10px;max-width: 500px;}.accordion .accordion-item {border: 1px solid var(--border-color);border-radius: 5px;}.accordion .accordion-item .accordion-item-description-wrapper hr {border: none;border-top: 1px solid var(--border-color);visibility: visible;}.accordion .accordion-item.open .accordion-item-description-wrapper hr {visibility: visible;}.accordion .accordion-item .accordion-item-header {background-color: var(--background-color);display: flex;align-items: center;justify-content: space-between;padding: 10px;cursor: pointer;}.accordion .accordion-item .accordion-item-header .accordion-item-header-title {font-weight: 600;}.accordion .accordion-item .accordion-item-header .accordion-item-header-icon {transition: var(--transition);}.accordion .accordion-item.open .accordion-item-header .accordion-item-header-icon {transform: rotate(-180deg);}.accordion .accordion-item .accordion-item-description-wrapper {margin:0 1em 0 1em;display: grid;grid-template-rows: 0fr;overflow: hidden;transition: var(--transition);}.accordion .accordion-item.open .accordion-item-description-wrapper {grid-template-rows: 1fr;}.accordion .accordion-item .accordion-item-description-wrapper .accordion-item-description {min-height: 0;}.accordion .accordion-item .accordion-item-description-wrapper .accordion-item-description p {padding: 10px;line-height: 1.5;}.highlighted-background{background:cornsilk;}.min-width-pane{min-width: 350px !important;padding-right: 12px;}.select-msg-checkbox{margin:1em;}.highlighted-count{text-align:center;margin:auto .3em}.nav-buttons span{margin-left:.1em;margin-right:.1em;cursor:pointer;border-radius:50%;background:#000;color:#fff;padding:.3em;width:1.1em}.nav-buttons{margin-left:auto;margin-right:auto;}.scroll-top-btn{background:#000;color:#fff;border-radius:50%;border:2px solid #000}.scroll-top-btn.active{background:#000;color:#ff0;border-radius:50%;border:2px solid #000}.highlighted{border:4px solid #54d314;border-radius:2em}.pseudo-search{width:100%;display:inline;border-bottom:2px solid #ccc;padding:10px 15px}.pseudo-search input{border:0;background-color:transparent;width:95%;}.pseudo-search input:focus{outline:0}.pseudo-search button,.pseudo-search i{border:none;background:0 0;cursor:pointer}.pseudo-search select{border:none}.custom-btn-area{border: 2px solid;border-radius: 2em;}.custom-btn-area img{height: 30px;}.custom-btn-area button{padding: 0.2em;display: flex;}.clear-button{background:#80808099;margin:5px;color:#fff;padding:1px 9px;border-radius:50px;}
    .scroll-top-btn,.search-btn{font-size:20px;margin:3px;}.disabled-btn{opacity:0.6;cursor:not-allowed;pointer-events: none;}

    /* Styles for Copy Buttons */
    .script-copy-btn {
        background: rgba(255, 255, 255, 0.8);
        border: none;
        border-radius: 4px;
        padding: 2px 5px;
        cursor: pointer;
        position: absolute;
        top: 5px;
        right: 5px;
        opacity: 0;
        transition: opacity 0.2s;
        z-index: 5;
    }

    .message-content:hover .script-copy-btn {
        opacity: 1;
    }`;
    const styleTag = document.createElement('style');
    styleTag.textContent = keyframesCSS + otherCSS;
    document.head.appendChild(styleTag);

})();
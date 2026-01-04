// ==UserScript==
// @name         Google Chat 引用訊息轉貼到其他視窗
// @version      0.0.13
// @namespace    Ymx1ZTMyNmNj
// @description  Adds button to copy links to threads on Google Chat and adds button to messages to quote reply
// @author       upman
// @match      https://chat.google.com/*
// @grant        none
// @run-at       document-idle
// @license      https://github.com/upman/gchat-copy
// @downloadURL https://update.greasyfork.org/scripts/477238/Google%20Chat%20%E5%BC%95%E7%94%A8%E8%A8%8A%E6%81%AF%E8%BD%89%E8%B2%BC%E5%88%B0%E5%85%B6%E4%BB%96%E8%A6%96%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/477238/Google%20Chat%20%E5%BC%95%E7%94%A8%E8%A8%8A%E6%81%AF%E8%BD%89%E8%B2%BC%E5%88%B0%E5%85%B6%E4%BB%96%E8%A6%96%E7%AA%97.meta.js
// ==/UserScript==

; (function () {
    function main() {
        var scrollContainer = document.querySelector('c-wiz[data-group-id][data-is-client-side] > div:nth-child(1)');
        var copyButtonInsertedCount = 0;

        const itemContainer = document.querySelector('div[class="CfUpN"]');

        if (itemContainer) {
            if (!itemContainer.querySelector('[data-tooltip*="ForwardMsg"')) {

                const forwardButton = document.createElement('div');
                // Quote svg icon
                forwardButton.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-top: 4px">
                    <path
                        d="M9.25045 7.78369L7.83624 6.36948L3.59363 10.6121L7.83627 14.8547L9.25048 13.4405L6.42205 10.6121L9.25045 7.78369Z"
                        fill="currentColor"
                    />
                    <path
                        d="M13.4932 13.4405L12.0789 14.8547L7.83627 10.6121L12.0789 6.36948L13.4931 7.78369L11.6463 9.63049L16.4063 9.63049C18.6155 9.63049 20.4063 11.4214 20.4063 13.6305L20.4063 17.6305L18.4063 17.6305L18.4063 13.6305C18.4063 12.5259 17.5109 11.6305 16.4063 11.6305L11.6831 11.6305L13.4932 13.4405Z"
                        fill="currentColor"
                    />
                    </svg>`;

                forwardButton.className = itemContainer.children[1].className;
                forwardButton.setAttribute('data-tooltip', 'ForwardMsg');

                const forwardMessage = window.localStorage.getItem('forwardMessage');

                if (forwardMessage) {
                    itemContainer.prepend(forwardButton);
                }

                forwardButton.addEventListener('click', () => {
                    let input = document.querySelector('div[contenteditable="true"]');

                    input.innerHTML = window.localStorage.getItem('forwardMessage');
                    input.scrollIntoView();
                    input.click();
                    placeCaretAtEnd(input);
                    window.localStorage.removeItem('forwardMessage');
                    forwardButton.remove();
                });
            }
        }

        // Iterating on threads and in the case of DMs, the whole message history is one thread
        document.querySelectorAll("c-wiz[data-topic-id][data-local-topic-id]")
            .forEach(
                function(e,t,i){

                    // Iterating on each message in the thread
                    e.querySelectorAll('div[jscontroller="VXdfxd"]').forEach(
                        // Adding quote message buttons
                        function(addreactionButton) {
                            if (
                                addreactionButton.parentElement.parentElement.querySelector('[data-tooltip*="Quote Message"') || // Quote reply button already exists
                                addreactionButton.parentElement.parentElement.children.length === 1 // Add reaction button next to existing emoji reactions to a message
                            ) {
                                return;
                            }
                            const container = document.createElement('div');
                            // Quote svg icon
                            container.innerHTML = `
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-top: 4px;color:#9aa0a6;">
                                <path
                                    d="M14.7495 7.78369L16.1638 6.36948L20.4064 10.6121L16.1637 14.8547L14.7495 13.4405L17.5779 10.6121L14.7495 7.78369Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M10.5068 13.4405L11.9211 14.8547L16.1637 10.6121L11.9211 6.36948L10.5069 7.78369L12.3537 9.63049L7.59366 9.63049C5.38452 9.63049 3.59366 11.4214 3.59366 13.6305L3.59366 17.6305L5.59366 17.6305L5.59366 13.6305C5.59366 12.5259 6.48909 11.6305 7.59366 11.6305L12.3169 11.6305L10.5068 13.4405Z"
                                    fill="currentColor"
                                />
                                </svg>
                                `;
                            container.className=addreactionButton.className;
                            container.setAttribute('data-tooltip', 'Quote Message');
                            const quoteSVG = container.children[0]
                            const svg = addreactionButton.querySelector('svg');
                            if (svg) {
                                svg.classList.forEach(c => quoteSVG.classList.add(c));
                            } else {
                                return;
                            }

                            var elRef = addreactionButton;
                            // Find parent container of the message
                            // These messages are then grouped together when they are from the recipient
                            // and the upper most one has the name and time of the message
                            while(!(elRef.className && elRef.className.includes('nF6pT')) && elRef.parentElement) {
                                elRef = elRef.parentElement;
                            }
                            if (elRef.className.includes('nF6pT')) {

                                var messageIndex, name, msgId, space, time, room, absTime, chat;
                                let threadLink = '';
                                [...elRef.parentElement.children].forEach((messageEl, index) => {
                                    if (messageEl === elRef) {
                                        messageIndex = index;
                                    }
                                });

                                addreactionButton.parentElement.parentElement.appendChild(container);
                                container.addEventListener('click', () => {
                                    while (messageIndex >= 0) {
                                        if (elRef.parentElement.children[messageIndex].className.includes('AnmYv')) {
                                            const nameContainer = elRef.parentElement.children[messageIndex].querySelector('[data-hovercard-id], [data-member-id]');
                                            const idContainer = elRef.parentElement.children[messageIndex].querySelector('[data-message-id]');
                                            const timeContainer = elRef.parentElement.children[messageIndex].querySelector('[data-absolute-timestamp]');
                                            const chatContainer = elRef.parentElement.children[messageIndex];

                                            time = timeContainer.getAttribute('data-absolute-timestamp');
                                            absTime = getAbsoluteTime(parseInt(time));
                                            name = `${nameContainer.getAttribute('data-name')} [${absTime}]`;
                                            msgId = idContainer.getAttribute('data-message-id');
                                            space = nameContainer.getAttribute('jsdata').match(/(space|dm)\/([^;$]+)/);
                                            chat = chatContainer.getAttribute('jsdata').match(/(?<=,)[^,]+(?=,(space|dm)\/)/)[0];

                                            if (space) {
                                                if (space[1] == 'space') {
                                                    room = 'room';
                                                }

                                                if (space[1] == 'dm') {
                                                    room = 'dm';
                                                }

                                                threadLink = `https://chat.google.com/${room}/${space[2]}/${chat}/${msgId}`;
                                            }

                                            showPopup();

                                            break;
                                        }
                                        messageIndex -= 1;
                                    }

                                    var messageContainer = addreactionButton.parentElement.parentElement.parentElement.parentElement.parentElement.children[0];

                                    var quoteText = getQuoteText(messageContainer);
                                    let inputEl = e.querySelector('div[contenteditable="true"]'); // This fetches the input element in channels
                                    let dmInput = document.body.querySelectorAll('div[contenteditable="true"]'); // This fetches the input in DMs
                                    inputEl = inputEl ? inputEl : dmInput[dmInput.length - 1];
                                    if (!inputEl) {
                                        return;
                                    }

                                    let message = `${makeInputText(name, quoteText, inputEl, messageContainer)}${threadLink}`;
                                    window.localStorage.setItem('forwardMessage', message);
                                });
                            }
                        }
                    );
                }
            );

        if (copyButtonInsertedCount > 1) {
            scrollContainer.scrollTop += 36;
        }
    }

    function makeInputText(name, quoteText, inputEl, messageContainer) {
        var isDM = window.location.href.includes('/dm/');
        var selection = window.getSelection().toString();
        var text = getText(messageContainer);
        var oneLineQuote = '';

        if (selection && text.includes(selection) && selection.trim()) {
            var regexp = new RegExp('(.*)' + selection + '(.*)');
            var matches = regexp.exec(text);
            if (matches[1]) {
                // Has text before the match
                oneLineQuote += '... ';
            }
            oneLineQuote += selection.trim();

            if (matches[2]) {
                // Has text after the match
                oneLineQuote += ' ...';
            }
        }

        if(isDM) {
            return oneLineQuote ? '`' + oneLineQuote + '`\n' :
                ("```\n" + quoteText + "\n```\n" + inputEl.innerHTML)
        } else {

            return oneLineQuote ? '`' + name + ': ' + oneLineQuote + '`\n' :
                ("```\n" + name + ":\n" + quoteText + "\n```\n" + inputEl.innerHTML);
        }
    }

    function showPopup() {
        const popup = document.createElement('div');
        popup.innerHTML = '在任意視窗按<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-top: 4px"><path d="M9.25045 7.78369L7.83624 6.36948L3.59363 10.6121L7.83627 14.8547L9.25048 13.4405L6.42205 10.6121L9.25045 7.78369Z" fill="currentColor"/><path d="M13.4932 13.4405L12.0789 14.8547L7.83627 10.6121L12.0789 6.36948L13.4931 7.78369L11.6463 9.63049L16.4063 9.63049C18.6155 9.63049 20.4063 11.4214 20.4063 13.6305L20.4063 17.6305L18.4063 17.6305L18.4063 13.6305C18.4063 12.5259 17.5109 11.6305 16.4063 11.6305L11.6831 11.6305L13.4932 13.4405Z" fill="currentColor"/></svg>轉貼訊息';
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = '#333'; // 深色背景
        popup.style.color = '#fff'; // 文字颜色
        popup.style.padding = '10px 20px';
        popup.style.border = '1px solid #555'; // 边框颜色
        popup.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';
        popup.style.zIndex = '9999';

        document.body.appendChild(popup);

        setTimeout(function () {
            document.body.removeChild(popup);
        }, 2000);
    }

    function getQuoteText(messageContainer) {
        var regularText = getText(messageContainer);
        var videoCall = messageContainer.querySelector('a[href*="https://meet.google.com/"]');
        var image = messageContainer.querySelector('a img[alt]');
        var text = regularText ||
            (videoCall ? "🎥: " + videoCall.href: null) ||
            (image ? "📷: " + image.alt: null) ||
            '...';

        return truncateQuoteText(text);
    }

    function truncateQuoteText(text) {
        let splitText = text.split('\n');
        let quoteText = splitText.slice(0,500).join('\n') + (splitText.length > 500 ? '\n...' : '');
        if (quoteText.length > 5000) {
            quoteText = quoteText.slice(0, 5000) + ' ...';
        }
        return quoteText;
    }

    function getText(messageContainer) {
        const multilineMarkdownClass = 'FMTudf';
        let textContent = '';
        const childNodes = messageContainer.children[0].childNodes;

        for (var i = 0; i < childNodes.length; i += 1) {
            if (childNodes[i].nodeType === Node.TEXT_NODE) {
                textContent += childNodes[i].textContent;
            } else if (childNodes[i].className === 'jn351e') {
                continue;
            } else if (childNodes[i].className === multilineMarkdownClass) {
                textContent += '...\n';
            } else if (childNodes[i].tagName === 'IMG') {
                // emojis
                textContent += childNodes[i].alt;
            } else {
                textContent += childNodes[i].innerHTML + '</br>';
            }
        }

        if (messageContainer.children[1] && messageContainer.children[1].getAttribute('jsname') == 'bgckF') {
            textContent = `\n${messageContainer.children[1].textContent}`;
        }

        return textContent;
    }

    function placeCaretAtEnd(el) {
        el.focus();
        if (typeof window.getSelection != "undefined"
                && typeof document.createRange != "undefined") {
            var range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            range.insertNode(document.createElement('br'));
            range.collapse();
        } else if (typeof document.body.createTextRange != "undefined") {
            var textRange = document.body.createTextRange();
            textRange.moveToElementText(el);
            textRange.collapse(false);
            textRange.select();
        }
    }

    function debounce(fn, delay) {
        var timeout = null;
        return function() {
            if(timeout) {
                return;
            } else {
                timeout = setTimeout(function() {
                    fn();
                    timeout = null;
                }, delay);
            }
        }
    }

    function getAbsoluteTime(d) {
        d = new Date(new Date(d).getTime() - new Date(d).getTimezoneOffset() * 60 * 1000);

        return d.toISOString().replace('T', ' ').substr(0, 19);
    }

    main();
    var el = document.documentElement;
    el.addEventListener('DOMSubtreeModified', debounce(main, 2000));

})();
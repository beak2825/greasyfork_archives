// ==UserScript==
// @name         Microsoft Teams quote button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a quote button for Microsoft Teams dialog
// @author       miki0w0
// @match        https://teams.microsoft.com/*
// @icon         https://www.google.com/s2/favicons?domain=microsoft.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437570/Microsoft%20Teams%20quote%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/437570/Microsoft%20Teams%20quote%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* Helper function to wait for the element ready */
    const waitFor = (...selectors) => new Promise(resolve => {
        const delay = 500;
        const f = () => {
            const elements = selectors.map(selector => document.querySelector(selector));
            if (elements.every(element => element != null)) {
                resolve(elements);
            } else {
                setTimeout(f, delay);
            }
        }
        f();
    });
    /* Helper function to wait for the element ready */

    function addGlobalStyle(css) {
        let head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.innerHTML = css;
        head.appendChild(style);
    }


    function debounce(fn, delay) {
        let timerId;
        return (...args) => {
            if (timerId) {
                clearTimeout(timerId);
            }
            timerId = setTimeout(() => {
                fn(...args);
                timerId = null;
            }, delay);
        }
    }

    function addQuoteButtonStyle() {
        let quoteSvg = ''
        quoteSvg += 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFN';
        quoteSvg += 'WRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPHN2ZyB4bWxucz0'
        quoteSvg += 'iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJ'
        quoteSvg += 'zaW9uPSIxLjEiIHdpZHRoPSIyODFweCIgaGVpZ2h0PSIzMzRweCIgdmlld0JveD0iLTAuNSAtMC41IDI4MSAzMzQiPjxkZWZzLz4'
        quoteSvg += '8Zz48cmVjdCB4PSIwIiB5PSIxMzMiIHdpZHRoPSIxMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjODA4MDgwIiBzdHJva2U9Im5vbmU'
        quoteSvg += 'iIHBvaW50ZXItZXZlbnRzPSJhbGwiLz48cmVjdCB4PSIwIiB5PSI3NCIgd2lkdGg9IjUwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjODA'
        quoteSvg += '4MDgwIiBzdHJva2U9Im5vbmUiIHBvaW50ZXItZXZlbnRzPSJhbGwiLz48cGF0aCBkPSJNIDc1IDI1IFEgMjUgMjUgMjUgNzUiIGZ'
        quoteSvg += 'pbGw9Im5vbmUiIHN0cm9rZT0iIzgwODA4MCIgc3Ryb2tlLXdpZHRoPSI1MCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBwb2ludGV'
        quoteSvg += 'yLWV2ZW50cz0ic3Ryb2tlIi8+PHJlY3QgeD0iMTgwIiB5PSIxMzMiIHdpZHRoPSIxMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjODA'
        quoteSvg += '4MDgwIiBzdHJva2U9Im5vbmUiIHBvaW50ZXItZXZlbnRzPSJhbGwiLz48cmVjdCB4PSIxODAiIHk9Ijc0IiB3aWR0aD0iNTAiIGh'
        quoteSvg += 'laWdodD0iNjAiIGZpbGw9IiM4MDgwODAiIHN0cm9rZT0ibm9uZSIgcG9pbnRlci1ldmVudHM9ImFsbCIvPjxwYXRoIGQ9Ik0gMjU'
        quoteSvg += '1IDI1IFEgMjA1IDI1IDIwNSA3NSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjODA4MDgwIiBzdHJva2Utd2lkdGg9IjUwIiBzdHJva2U'
        quoteSvg += 'tbWl0ZXJsaW1pdD0iMTAiIHBvaW50ZXItZXZlbnRzPSJzdHJva2UiLz48L2c+PC9zdmc+';

        let css = '';
        css += '.my-quote-button {';
        css += 'width: 28px;';
        css += 'height: 28px;';
        css += 'margin: 0.2rem 0 0 -1.4rem;';
        css += `background: url('data:image/svg+xml;base64,${quoteSvg}') no-repeat center;`;
        css += 'background-size: 10px;';
        css += 'background-color: #d9d7d7;'
        css += 'border: 2px solid gray;';
        css += 'border-radius: 8px;';
        css += 'visibility: hidden;';
        css += 'z-index: 99;';
        css += '}';
        css += '.message-body:hover ~ .my-quote-button, .my-quote-button:hover {';
        css += 'visibility: visible;';
        css += '}';
        css += '.message-body:hover + .my-quote-button {';
        css += 'visibility: visible;';
        css += '}';
        css += '.message-body {';
        css += 'max-width: calc(100% - 25px);';
        css += '}';
        addGlobalStyle(css);
    }

    function addQuoteButton() {
        let messageContainers = document.querySelectorAll("div.ts-message-thread-body.align-item-left:not(.has-quote-button)");
        for (let i = 0; i < messageContainers.length; i++) {
            let quoteButton = document.createElement("div");
            quoteButton.classList.add('my-quote-button');
            const element = messageContainers[i];
            element.classList.add('has-quote-button');
            element.appendChild(quoteButton);
        }
    }

    waitFor('.ts-edit-box div.cke_contents.cke_reset>div[role=textbox]').then(() => {
        let inputbox = document.querySelector(".ts-edit-box div.cke_contents.cke_reset>div[role=textbox]");
        let delegatee = document.querySelector('virtual-repeat.ts-message-list');
        let quoteBlock = document.createElement('blockquote');
        let appendQuote = (text) => {
            quoteBlock.innerHTML += text + '</br>';
        }

        // main
        addQuoteButtonStyle();
        addQuoteButton();

        delegatee.addEventListener('click', (event) => {
            const target = event.target;
            console.log('click');
            // check the target
            if (target.matches('div.my-quote-button')) {
                // if there is no quote in input box, add it.
                if (quoteBlock.parentElement !== inputbox) {
                    inputbox.appendChild(quoteBlock);
                }
                // Add quote content
                const content = target.parentElement.querySelector('.message-body-content').innerText;
                appendQuote(content);
            }
        });

        delegatee.addEventListener('scroll', debounce(() => {
            addQuoteButton();
            console.log('scroll done');
        }, 500));
    });

})();
// ==UserScript==
// @name         Chat GPT scroll to the top and bottom buttons
// @author       NWP
// @description  Adds buttons to scroll to the top and bottom of the chat on Chat GPT
// @namespace    https://greasyfork.org/users/877912
// @version      0.4
// @license      MIT
// @match        https://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500630/Chat%20GPT%20scroll%20to%20the%20top%20and%20bottom%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/500630/Chat%20GPT%20scroll%20to%20the%20top%20and%20bottom%20buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createButton(onClick, triangleDirection) {
        const button = document.createElement('button');
        const buttonStyle = `
            background-color: #707070;
            border: none;
            border-radius: 0.5em;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 3.5em;
            height: 2em;
            position: relative;
            transition: background-color 0.3s;
        `;
        button.setAttribute('style', buttonStyle);
        button.addEventListener('click', onClick);

        const triangle = document.createElement('div');
        const triangleStyle = `
            width: 0;
            height: 0;
            border-left: 0.75em solid transparent;
            border-right: 0.75em solid transparent;
        `;
        if (triangleDirection === 'up') {
            triangle.setAttribute('style', triangleStyle + 'border-bottom: 0.75em solid black;');
        } else {
            triangle.setAttribute('style', triangleStyle + 'border-top: 0.75em solid black;');
        }
        button.appendChild(triangle);

        button.onmouseenter = function() {
            button.style.backgroundColor = '#9f9f9f';
        };
        button.onmouseleave = function() {
            button.style.backgroundColor = '#707070';
        };

        return button;
    }

    function scrollToTop() {
        // const target = Array.from(document.querySelectorAll('div[class^="react-scroll-to-bottom--css"]')).filter(el => !el.className.includes('full'))[0];
        const target = document.querySelector('div.flex.h-full.flex-col.overflow-y-auto');
        if (target) target.scrollTop = 0;
    }

    function scrollToBottom() {
        // const target = Array.from(document.querySelectorAll('div.flex.h-full.flex-col.overflow-y-auto')).filter(el => !el.className.includes('full'))[0];
        const target = document.querySelector('div.flex.h-full.flex-col.overflow-y-auto');
        if (target) target.scrollTop = target.scrollHeight;
    }

    function createButtons() {
        if (document.querySelector('div[part="scroll-buttons"]')) return;

        const shadowHost = document.createElement('div');
        shadowHost.style.position = 'fixed';
        shadowHost.style.bottom = '3em';
        shadowHost.style.right = '2em';
        shadowHost.style.zIndex = '1000';
        shadowHost.setAttribute('part', 'scroll-buttons');
        document.body.appendChild(shadowHost);

        const shadowRoot = shadowHost.attachShadow({ mode: 'closed' });

        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        container.style.gap = '0.25em';
        shadowRoot.appendChild(container);

        const topButton = createButton(scrollToTop, 'up');
        container.appendChild(topButton);

        const bottomButton = createButton(scrollToBottom, 'down');
        container.appendChild(bottomButton);
    }

    function ensureButtonsDrawn() {
        createButtons();

        const interval = setInterval(function() {
            if (document.querySelector('div[part="scroll-buttons"]')) {
                clearInterval(interval);
            } else {
                createButtons();
            }
        }, 1000);
    }

    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            ensureButtonsDrawn();
        }
    });

    window.addEventListener('load', function() {
        setTimeout(ensureButtonsDrawn, 500);
    });
})();
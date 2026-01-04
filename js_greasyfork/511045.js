// ==UserScript==
// @name         GoDaddy Nameserver Changer with User Input and Button
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  手动更改 GoDaddy 域名的 DNS 服务器，允许用户输入域名服务器并点击按钮进行填充
// @author       hatrd
// @match        https://dcc.godaddy.com/control/portfolio/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511045/GoDaddy%20Nameserver%20Changer%20with%20User%20Input%20and%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/511045/GoDaddy%20Nameserver%20Changer%20with%20User%20Input%20and%20Button.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function createUI() {
        if (document.querySelector('#custom-ns-container')) return; // 防止重复添加

        const container = document.createElement('div');
        container.id = 'custom-ns-container';
        container.style.position = 'fixed';
        container.style.top = '100px';
        container.style.right = '100px';
        container.style.zIndex = '2147483647';
        container.style.backgroundColor = '#fff';
        container.style.border = '1px solid #ccc';
        container.style.padding = '10px';
        container.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
        container.style.pointerEvents = 'auto';

        const textarea = document.createElement('textarea');
        textarea.rows = 4;
        textarea.cols = 40;
        textarea.placeholder = '请输入域名服务器，每行一个，最多四个';
        textarea.style.display = 'block';
        textarea.style.marginBottom = '10px';

        const button = document.createElement('button');
        button.textContent = '填充域名服务器';
        button.style.display = 'block';
        button.style.width = '100%';
        button.style.marginTop = '5px';
        button.style.cursor = 'pointer';

        button.addEventListener('click', () => {
            const userInput = textarea.value.trim();
            if (!userInput) return;

            const sanitizedNameservers = userInput.split('\n')
                .map(ns => ns.trim().replace(/\.$/, ''))
                .filter(Boolean);

            function waitForElement(selector, callback) {
                const interval = setInterval(() => {
                    const element = document.querySelector(selector);
                    if (element) {
                        clearInterval(interval);
                        callback(element);
                    }
                }, 100);
            }

            let currentIndex = 0;

            function fillNext() {
                if (currentIndex >= sanitizedNameservers.length) return;

                const ns = sanitizedNameservers[currentIndex];
                const nsInputId = `#nameserver${currentIndex + 1}`;

                waitForElement(nsInputId, (input) => {
                    input.focus();
                    input.value = '';
                    input.select();
                    document.execCommand('insertText', false, ns);
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));

                    currentIndex++;
                    if (currentIndex < sanitizedNameservers.length) {
                        setTimeout(fillNext, 500 + Math.random() * 500);
                    }
                });
            }

            fillNext();
        });

        container.appendChild(textarea);
        container.appendChild(button);
        document.body.appendChild(container);
    }

    window.addEventListener('load', createUI);

    const observer = new MutationObserver(() => {
        if (!document.querySelector('#custom-ns-container')) {
            createUI();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();


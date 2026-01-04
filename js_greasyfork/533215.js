// ==UserScript==

// @name         WOTOM Tools: Copy IP + SSH

// @namespace    http://tampermonkey.net/

// @version      2.2

// @description  Кнопки копирования IP и прямого подключения по SSH для .pseudolink (только для IP)

// @match        https://wotom.net/r/subdep

// @icon         https://www.google.com/s2/favicons?sz=64&domain=wotom.net

// @grant        GM_setClipboard

// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/533215/WOTOM%20Tools%3A%20Copy%20IP%20%2B%20SSH.user.js
// @updateURL https://update.greasyfork.org/scripts/533215/WOTOM%20Tools%3A%20Copy%20IP%20%2B%20SSH.meta.js
// ==/UserScript==


(function() {

    'use strict';


    function isValidIP(str) {

        const parts = str.split('.');

        if (parts.length !== 4) {

            return false;

        }

        for (const part of parts) {

            const num = parseInt(part, 10);

            if (isNaN(num) || num < 0 || num > 255) {

                return false;

            }

        }

        return true;

    }


    function createButton(icon, title, onClick) {

        const button = document.createElement('button');

        button.innerHTML = icon;

        button.title = title;

        button.style.cssText = `

            margin-left: 2px;

            padding: 0 4px;

            background: transparent;

            border: none;

            cursor: pointer;

            opacity: 0.7;

            transition: opacity 0.2s;

            width: 30px;

            text-align: center;

        `;

        button.onclick = onClick;

        return button;

    }


    function addCopyButton(parent, text) {

        const copyBtn = createButton('📋', 'Копировать IP', (e) => {

            e.stopPropagation();

            GM_setClipboard(text, 'text');

            copyBtn.innerHTML = '✨';

            setTimeout(() => copyBtn.innerHTML = '📋', 1000);

        });

        parent.appendChild(copyBtn);

    }


    function addSSHButton(parent, ip) {

        const sshBtn = createButton('🔌', 'Подключиться напрямую', (e) => {

            e.stopPropagation();

            const sshUrl = `ssh://root@${ip}:22`;

            window.open(sshUrl, '_self');

        });

        parent.appendChild(sshBtn);

    }


    function enhancePseudolinks() {

        document.querySelectorAll('span.pseudolink').forEach(span => {

            if (!span.classList.contains('enhanced')) {

                const textContent = span.textContent.trim();

                if (isValidIP(textContent)) {

                    span.classList.add('enhanced');

                    const container = document.createElement('span');

                    container.style.display = 'inline-flex';

                    container.style.alignItems = 'center';

                    container.style.marginLeft = '2px';

                    addCopyButton(container, textContent);

                    addSSHButton(container, textContent);

                    span.parentNode.insertBefore(container, span.nextSibling);

                }

            }

        });

    }


    enhancePseudolinks();

    new MutationObserver(enhancePseudolinks).observe(document.body, { childList: true, subtree: true });

})();
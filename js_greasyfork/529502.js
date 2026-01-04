// ==UserScript==
// @name         12ft.io Button
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Adds a button to load the page with 12ft.io/
// @author       ils94
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529502/12ftio%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/529502/12ftio%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addButton() {
        if (document.getElementById('twelveFtButton')) return;

        let button = document.createElement('button');
        button.id = 'twelveFtButton';
        button.innerText = '12ft.io';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '9999';
        button.style.width = '60px';
        button.style.height = '60px';
        button.style.borderRadius = '50%';
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.fontSize = '14px';
        button.style.fontWeight = 'bold';
        button.style.backgroundColor = '#ff9800';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.2)';
        button.style.cursor = 'pointer';
        button.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';

        button.addEventListener('mouseover', function() {
            button.style.transform = 'scale(1.1)';
            button.style.boxShadow = '0px 6px 10px rgba(0, 0, 0, 0.3)';
        });

        button.addEventListener('mouseout', function() {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.2)';
        });

        button.addEventListener('click', function() {
            window.location.href = 'https://12ft.io/' + window.location.href;
        });

        document.body.appendChild(button);
    }

    function waitForBody() {
        if (document.body) {
            addButton();
        } else {
            new MutationObserver((mutations, observer) => {
                if (document.body) {
                    observer.disconnect();
                    addButton();
                }
            }).observe(document.documentElement, {
                childList: true
            });
        }
    }

    if (!window.location.href.startsWith('https://12ft.io/')) {
        waitForBody();
    }
})();
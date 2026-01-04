// ==UserScript==
// @name         Add Back Button and Disclaimer
// @namespace    http://your.namespace.here/
// @version      0.6
// @description  Add a back button to return to searchList and a disclaimer to all pages
// @author       Your Name
// @match        *://findxdsisu.libsp.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500237/Add%20Back%20Button%20and%20Disclaimer.user.js
// @updateURL https://update.greasyfork.org/scripts/500237/Add%20Back%20Button%20and%20Disclaimer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addBackButton() {
        if (window.location.hash.includes('/searchList/bookDetails/')) {
            if (!document.getElementById('backToSearchListBtn')) {
                let button = document.createElement('button');
                button.id = 'backToSearchListBtn';
                button.innerText = '返回检索结果页面';
                button.style.position = 'fixed';
                button.style.top = '78px';
                button.style.right = '100px';
                button.style.zIndex = '1000';
                button.style.backgroundColor = '#4CAF50';
                button.style.color = 'white';
                button.style.border = 'none';
                button.style.padding = '10px 20px';
                button.style.textAlign = 'center';
                button.style.textDecoration = 'none';
                button.style.display = 'inline-block';
                button.style.fontSize = '16px';
                button.style.margin = '4px 2px';
                button.style.cursor = 'pointer';
                button.style.borderRadius = '12px';
                button.style.boxShadow = '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)';
                button.onclick = function() {
                    window.location.hash = '#/searchList';
                };
                document.body.appendChild(button);
            }
        } else {
            let existingButton = document.getElementById('backToSearchListBtn');
            if (existingButton) {
                existingButton.remove();
            }
        }
    }

    function addDisclaimer() {
        if (!document.getElementById('disclaimer')) {
            let disclaimer = document.createElement('div');
            disclaimer.id = 'disclaimer';
            disclaimer.innerText = '仅供检索，请勿登录';
            disclaimer.style.position = 'fixed';
            disclaimer.style.top = '12px';
            disclaimer.style.right = '123px';
            disclaimer.style.zIndex = '1000';
            disclaimer.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            disclaimer.style.color = 'red';
            disclaimer.style.border = '1px solid red';
            disclaimer.style.padding = '5px 10px';
            disclaimer.style.borderRadius = '5px';
            disclaimer.style.fontSize = '14px';
            disclaimer.style.boxShadow = '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)';
            document.body.appendChild(disclaimer);
        }
    }

    // Initial run
    addBackButton();
    addDisclaimer();

    // Observe for URL hash changes
    window.addEventListener('hashchange', () => {
        addBackButton();
        addDisclaimer();
    });

    // Periodically check for changes
    setInterval(() => {
        addBackButton();
        addDisclaimer();
    }, 10000);
})();

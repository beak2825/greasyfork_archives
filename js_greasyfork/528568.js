// ==UserScript==
// @name         JavDB & MissAv Jumper
// @namespace    https://javdb.com/
// @version      3.0.1
// @description  Combine waterfall layout and jump button for JavDB
// @license      MIT
// @author       YourName
// @match        https://javdb.com/*
// @match        https://missav.ws/*
// @match        https://missav.ai/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_getResourceURL
// @grant        GM_registerMenuCommand
// @grant        GM_info
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @connect      *
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/528568/JavDB%20%20MissAv%20Jumper.user.js
// @updateURL https://update.greasyfork.org/scripts/528568/JavDB%20%20MissAv%20Jumper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // JavDB Jump Button Code
    var jumpButton = document.createElement('button');
    jumpButton.style.backgroundColor = 'green';
    jumpButton.style.color = 'white';
    jumpButton.style.position = 'fixed';
    jumpButton.style.bottom = '10px';
    jumpButton.style.left = '10px';
    jumpButton.style.zIndex = '9999';
    jumpButton.style.padding = '16px 24px';
    jumpButton.style.borderRadius = '8px';
    jumpButton.style.fontSize = '24px';
    jumpButton.style.border = 'none';
    jumpButton.style.cursor = 'pointer';
    jumpButton.style.display = 'none';

    jumpButton.addEventListener('click', function() {
        let 番號 = '';
        let url = '';
        if (window.location.href.includes('javdb.com')) {
            var link = document.querySelector('.panel-block.first-block a.button.is-white.copy-to-clipboard');
            if (link) {
                番號 = link.getAttribute('data-clipboard-text');
                if (番號) {
                    url = "https://missav.ws/" + 番號.toLowerCase();
                }
            }
        } else if (window.location.href.includes('missav.ws')) {
            var element = document.querySelector('.text-secondary span.font-medium');
            if (element) {
                番號 = element.innerText;
                番號 = 番號.replace(/-UNCENSORED-LEAK|-CHINESE-SUBTITLE/g, '');
                url = "https://javdb.com/search?f=all&q=" + 番號;
            }
        }
        if (番號 && url) {
            var a = document.createElement('a');
            a.href = url;
            a.target = '_blank';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    });

    let 番號 = '';
    if (window.location.href.includes('javdb.com')) {
        var link = document.querySelector('.panel-block.first-block a.button.is-white.copy-to-clipboard');
        if (link) {
            番號 = link.getAttribute('data-clipboard-text');
        }
    } else if (window.location.href.includes('missav.ws')) {
        var element = document.querySelector('.text-secondary span.font-medium');
        if (element) {
            番號 = element.innerText;
            番號 = 番號.replace(/-UNCENSORED-LEAK|-CHINESE-SUBTITLE/g, '');
        }
    }

    if (番號) {
        jumpButton.innerHTML = 番號;
        jumpButton.style.display = 'block';
    } else {
        jumpButton.style.display = 'none';
    }

    document.body.appendChild(jumpButton);
})();
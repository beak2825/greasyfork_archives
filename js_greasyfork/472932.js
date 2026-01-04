// ==UserScript==
// @name         Command copier
// @description  Command copier for Underdog Fantasy bot usage
// @version      0.1b
// @match        https://underdogfantasy.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @license MIT
// @namespace https://greasyfork.org/users/1149558
// @downloadURL https://update.greasyfork.org/scripts/472932/Command%20copier.user.js
// @updateURL https://update.greasyfork.org/scripts/472932/Command%20copier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let copyButton = createButton('copy-command-button', 'Copy Command')

    GM_addStyle(`
        #copy-command-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #3498db;
            color: #fff;
            border: none;
            border-radius: 4px;
            padding: 6px 12px;
            cursor: pointer;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
        }

        #copy-command-button:hover {
            background-color: #2980b9;
        }

        #copy-command-button:focus {
            outline: none;
            box-shadow: 0 0 5px #3498db;
        }
    `);

    const originalOpen = window.XMLHttpRequest.prototype.open;
    const originalSend = window.XMLHttpRequest.prototype.send;

    function createButton(id, text) {
        const button = document.createElement('button');
        button.id = id;
        button.textContent = text;
        document.body.appendChild(button);
        return button;
    }

    window.XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url;
        this._headers = {};

        const originalSetRequestHeader = this.setRequestHeader;
        this.setRequestHeader = function(header, value) {
            this._headers[header] = value;
            return originalSetRequestHeader.apply(this, arguments);
        };

        return originalOpen.apply(this, arguments);
    };

    window.XMLHttpRequest.prototype.send = function(data) {
        this.addEventListener('load', function() {
            if (this._url.includes('/v1/user/')) {
                if (this._headers && this._headers['Authorization']) {
                    const token = this._headers['Authorization'];
                    const tokenWithoutBearer = token.replace('Bearer ', '');

                    copyButton.addEventListener('click', function() {
                        const copyText = `!register ${tokenWithoutBearer}`;
                        navigator.clipboard.writeText(copyText);
                    });
                }
            }
        });

        return originalSend.apply(this, arguments);
    };
})();
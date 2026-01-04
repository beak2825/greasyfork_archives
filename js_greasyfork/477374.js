// ==UserScript==
// @name         Florr.io Temporary Account
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Creates a temporary account whenever you join the game. Good for using cheats and not get banned.
// @author       BlossomBlurbs (Bloss)
// @match        *://florr.io/*
// @icon         https://www.google.com/s2/favicons?domain=florr.io
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477374/Florrio%20Temporary%20Account.user.js
// @updateURL https://update.greasyfork.org/scripts/477374/Florrio%20Temporary%20Account.meta.js
// ==/UserScript==

const style = document.createElement('style');
style.textContent = `
    span {
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translate(-50%, 0);
        color: #fff;
        font-family: Ubuntu;
        z-index: 999;
        cursor: pointer;
        padding: 4px 8px;
        text-shadow: 1px 0 #000, -1px 0 #000, 0 1px #000, 0 -1px #000, 1px 1px #000, -1px -1px #000;
    }

    span:active {
        background: rgba(0, 0, 0, 0.25);
    }
`;

const span = document.createElement('span');
span.style.display = 'none';
span.textContent = 'Waiting for account...';
span.onclick = function() {
    navigator.clipboard.writeText(span.textContent);
};

window.addEventListener('DOMContentLoaded', function() {
    document.body.appendChild(style);
    document.body.appendChild(span);
});

Object.defineProperty(window, 'localStorage', {
    value: new Proxy(window.localStorage, {
        get(target, prop, receiver) {
            if (prop === 'cp6_player_id') {
                return '';
            }
            return Reflect.get(target, prop, receiver);
        },
        set(target, prop, value, receiver) {
            if (prop === 'cp6_player_id') {
                span.textContent = value;
                return true;
            }
            return Reflect.set(target, prop, value, receiver);
        }
    })
});

// ==UserScript==
// @name         Rezka Source
// @namespace    http://alamote.pp.ua/
// @match        https://rezka.ag/*
// @grant        none
// @version      1.2.1
// @namespace    AlaMote
// @description  Add link to the source video
// @icon         http://alamote.pp.ua/staff/alamote-logo.png
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/402568/Rezka%20Source.user.js
// @updateURL https://update.greasyfork.org/scripts/402568/Rezka%20Source.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

(function() {
    'use strict';

    let oldXHROpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        const index = url.indexOf('mp4');
        const urlResult = url.substr(0, index + 3);
        if (index > -1) {
            const btn = document.createElement('button');
            btn.innerHTML = 'Open Source';
            btn.addEventListener('click', () => {
                window.open(urlResult, '_blank');
            });

            const copyBtn = document.createElement('button');
            copyBtn.innerHTML = 'Copy URL';
            copyBtn.id = 'copy-link';
            copyBtn.style.marginLeft = '8px';
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(urlResult).then(function() {
                    copyBtn.innerHTML = 'Copied!';
                    copyBtn.style.color = 'green';
                    setTimeout(() => {
                        if (copyBtn.innerHTML === 'Copied!') {
                            copyBtn.innerHTML = 'Copy URL';
                            copyBtn.style.color = 'black';
                        }
                    }, 1000);
                });
            });

            const linkContainer = document.getElementById('source-link-container');
            if (linkContainer) {
                linkContainer.remove();
            }

            let container = document.getElementsByClassName('b-post__lastepisodeout');
            if (container.length) {
                container = container.item(0);
                const div = document.createElement('div');
                div.id = 'source-link-container';
                div.style.marginTop = '8px';
                div.appendChild(btn);
                div.appendChild(copyBtn);
                container.appendChild(div);
            }
        }

        return oldXHROpen.apply(this, arguments);
    }
})();
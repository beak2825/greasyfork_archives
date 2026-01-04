// ==UserScript==
// @name         Youtube Reintegration
// @icon         https://pixelplace.io/img/youtube-icon.svg
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Make sure to hit that subscribe button!
// @author       guildedbird
// @match        https://pixelplace.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531584/Youtube%20Reintegration.user.js
// @updateURL https://update.greasyfork.org/scripts/531584/Youtube%20Reintegration.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function add() {
        let linked = document.querySelectorAll('#modals .box > .box-content[data-id=account]');
        linked.forEach(account => {
            let firstChild = account.firstElementChild;
            if (firstChild) {
                let div = document.createElement('div');
                div.className = 'linked-account';
                div.setAttribute('data-id', '4');
                div.innerHTML = `
                    <div data-value="youtube">
                        <img src="/img/youtube-icon.svg" width="24">
                    </div>
                    <span></span>
                    <a href="https://pixelplace.io/api/sso.php?type=4&amp;action=remove" title="Disconnect Youtube account?" class="link-remove">Disconnect?</a>
                    <a href="https://pixelplace.io/api/sso.php?type=4&amp;action=login" title="Connect your Youtubw account" class="link-add" style="display: none;">Connect your Youtube account</a>
                `;
                let children = firstChild.children;
                if (children.length >= 4) {
                    firstChild.insertBefore(div, children[4]);
                } else {
                    firstChild.appendChild(div);
                }
            }
        });
    }

    function style() {
        let youtube = document.querySelector('#modals .box > .box-content div .margin-bottom a.sso[data-value="youtube"]');
        if (youtube) {
            youtube.style = 'block';
        }
    }

    window.addEventListener('load', () => {
        add();
        style();
    });

    const image = 'https://support.discord.com/hc/user_images/PRywUXcqg0v5DD6s7C3LyQ.jpeg';

    function replace() {
        document.querySelectorAll('img[src*="discordapp-tile.svg"]').forEach(img => {
            img.src = image;
            img.style.borderRadius = '7px';
        });
    }

    replace();

    const observer = new MutationObserver(replace);
    observer.observe(document.body, { childList: true, subtree: true });
})();
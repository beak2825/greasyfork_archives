// ==UserScript==
// @name         Cat Hiss GIF Replacer for Discord
// @description  Replaces messages that contain a single period (".") with a cat hiss GIF.
// @version      1.0

// @author       Lara Abu Bakr
// @match        https://discord.com/* 
// @run-at       document-start
// @license      MIT

// @namespace    https://github.com/larabakr

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532346/Cat%20Hiss%20GIF%20Replacer%20for%20Discord.user.js
// @updateURL https://update.greasyfork.org/scripts/532346/Cat%20Hiss%20GIF%20Replacer%20for%20Discord.meta.js
// ==/UserScript==

/*
    Author: Lara Abu Bakr
    Github: https://github.com/larabakr
*/

(function () {
    "use strict";
    document.addEventListener('DOMContentLoaded', () => {
        const catHiss = `<div class="imageContainer__0f481"><div class="imageWrapper_af017a imageZoom_af017a clickable_af017a" style="max-width: 400px; width: 100%; aspect-ratio: 400 / 266;"><a tabindex="-1" aria-hidden="true" class="originalLink_af017a" href="https://tenor.com/view/cat-angry-hiss-gif-9387351" data-role="img" data-safe-src="https://images-ext-1.discordapp.net/external/5HJ6SbpGF8Km8q5eLSiPzq3b3JfpJRA6PW7HgCjF85Y/https/media.tenor.com/_GopqsuoH3UAAAPo/cat-angry.mp4"></a><div class="clickableWrapper_af017a" tabindex="0" aria-label="GIF" aria-describedby="uid_4" role="button"><div class="loadingOverlay_af017a" style="aspect-ratio: 1.50376 / 1;"><video class="embedVideo__623de embedMedia__623de" poster="https://images-ext-1.discordapp.net/external/6l_BPCfhTq5mvDTmyUn8z4MaDulZH0r5EvIynQpSpYs/https/media.tenor.com/_GopqsuoH3UAAAAe/cat-angry.png?width=800&amp;height=532" src="https://images-ext-1.discordapp.net/external/5HJ6SbpGF8Km8q5eLSiPzq3b3JfpJRA6PW7HgCjF85Y/https/media.tenor.com/_GopqsuoH3UAAAPo/cat-angry.mp4" width="400" height="266" loop="" playsinline="" preload="none" aria-label="GIF" style="max-width: 400px; max-height: 266px; width: 100%; height: 100%;" autoplay=""></video></div></div><div class="imageAccessory_af017a"><div class="gifFavoriteButton_b7e1cb gifFavoriteButton__43deb selected__43deb" aria-label="Remove from Favorites" role="button" tabindex="0"><svg class="icon__43deb" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M10.81 2.86c.38-1.15 2-1.15 2.38 0l1.89 5.83h6.12c1.2 0 1.71 1.54.73 2.25l-4.95 3.6 1.9 5.82a1.25 1.25 0 0 1-1.93 1.4L12 18.16l-4.95 3.6c-.98.7-2.3-.25-1.92-1.4l1.89-5.82-4.95-3.6a1.25 1.25 0 0 1 .73-2.25h6.12l1.9-5.83Z" class=""></path></svg></div><span style="display: none;"></span></div></div></div>`;

        function processMessage(message) {
            const newElement = document.createElement('div');
            newElement.innerHTML = catHiss;
            newElement.dataset.catHissApplied = 'true';
            message.parentNode.replaceChild(newElement, message);
        }

        function processMessages() {
            const olElement = document.querySelector('ol');

            const children = Array.from(olElement.children);
            children.filter(child => child.tagName === "LI").forEach((child) => {
                const message = document.querySelector(`#message-content-${child.id.split('-')[3]}`);

                if (message instanceof HTMLElement) {
                    const content = message.textContent;

                    if (content.trim() === "." && message.dataset.catHissApplied !== 'true') {
                        if (child.contains(message)) {
                            processMessage(message);
                        }
                    } else if (content.trim().includes('(edited)') && content.split(' ')[0] && message.dataset.catHissApplied !== 'true') {
                        if (child.contains(message)) {
                            processMessage(message);
                        }
                    }

                }
            });
        }

        function startMutationObserver() {
            const olElement = document.querySelector('ol');

            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.tagName === "LI") {
                                const message = document.querySelector(`#message-content-${node.id.split('-')[3]}`);
                                if (message instanceof HTMLElement) {
                                    const content = message.textContent.trim();

                                    if (content === "." && message.dataset.catHissApplied !== 'true') {
                                        processMessage(message);
                                    } else if (content.trim().includes('(edited)') && content.split(' ')[0] && message.dataset.catHissApplied !== 'true') {
                                        if (node.contains(message)) {
                                            processMessage(message);
                                        }
                                    }
                                }
                            }
                        });
                    } else if (mutation.type === 'characterData') {
                        const message = mutation.target.parentElement?.closest('[id^="message-content-"]');

                        if (message instanceof HTMLElement) {
                            const content = message.textContent.trim();

                            if (content === "." && message.dataset.catHissApplied !== 'true') {
                                processMessage(message);
                            } else if (content.trim().includes('(edited)') && content.split(' ')[0] && message.dataset.catHissApplied !== 'true') {
                                processMessage(message);
                            }
                        }
                    }
                });
            });

            observer.observe(olElement, {
                childList: true,
                subtree: true,
                characterData: true,
            });
        }

        const checkForOl = setInterval(() => {
            const olElement = document.querySelector('ol');
            if (olElement) {
                clearInterval(checkForOl);
                processMessages();
                startMutationObserver();
            }
        }, 500);
    });
})();
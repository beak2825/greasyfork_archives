// ==UserScript==
// @name         YouTube: Copy Comment Link
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  You can conveniently copy the link of any comment and send it to your friend
// @author       Grihail
// @match        *://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      CC-BY
// @downloadURL https://update.greasyfork.org/scripts/473782/YouTube%3A%20Copy%20Comment%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/473782/YouTube%3A%20Copy%20Comment%20Link.meta.js
// ==/UserScript==

function addCopyLinkToHeaderAuthor() {
    const headerAuthorElements = document.querySelectorAll('#header-author.ytd-comment-renderer');

    headerAuthorElements.forEach(element => {
        const copyLink = element.querySelector('.copy-comment-link');

        if (!copyLink) {
            const ytFormattedString = element.querySelector('yt-formatted-string a');

            if (ytFormattedString) {
                const originalHref = ytFormattedString.getAttribute('href');
                const fullHref = 'https://www.youtube.com' + originalHref;

                const copyLink = document.createElement('a');
                copyLink.classList.add('copy-comment-link');
                copyLink.href = fullHref;
                copyLink.style.marginLeft = '10px';
                copyLink.style.width = '36px';
                copyLink.style.height = '36px';
                copyLink.style.borderRadius = '54%';
                copyLink.style.display = 'flex'; // Make it a flex container
                copyLink.style.alignItems = 'center'; // Center content vertically
                copyLink.style.justifyContent = 'center'; // Center content horizontally
                copyLink.innerHTML = '<svg height="24px" viewBox="0 0 24 24" width="24px"><path style="stroke: var(--yt-spec-text-primary);" d="M13 8H17.3333C19.5424 8 21.3333 9.79086 21.3333 12C21.3333 14.2091 19.5424 16 17.3333 16H13M16 12H7.99996M11 8H6.66663C4.45749 8 2.66663 9.79086 2.66663 12C2.66663 14.2091 4.45749 16 6.66663 16H11" fill="none"></path></svg>';

                copyLink.addEventListener('click', event => {
                    event.preventDefault();
                    navigator.clipboard.writeText(fullHref);
                });

                // Add hover and active styles
                copyLink.style.transition = 'background-color 0.3s';
                copyLink.style.backgroundColor = 'transparent';
                copyLink.style.border = 'none';

                copyLink.addEventListener('mouseenter', () => {
                    copyLink.style.backgroundColor = 'rgb(0 0 0 / 10%)';
                });

                copyLink.addEventListener('mouseleave', () => {
                    copyLink.style.backgroundColor = 'transparent';
                });

                copyLink.addEventListener('mousedown', () => {
                    copyLink.style.backgroundColor = 'rgb(0 0 0 / 20%)';
                });

                copyLink.addEventListener('mouseup', () => {
                    copyLink.style.backgroundColor = 'rgb(0 0 0 / 10%)';
                });

                element.style.alignItems = 'center';
                element.appendChild(copyLink);
            }
        }
    });
}

setInterval(addCopyLinkToHeaderAuthor, 1000);

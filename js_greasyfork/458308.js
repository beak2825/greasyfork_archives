// ==UserScript==
// @license      none
// @name         Github PR Copier
// @namespace    https://github.com/moriah-rahamim
// @version      0.1
// @description  Create a condensed Slack message with Pull Request info (modified from original version created by https://github.com/khenneuse)
// @match        https://github.com/*
// @icon         https://img.icons8.com/small/512/github.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458308/Github%20PR%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/458308/Github%20PR%20Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addLinkIconToPRHeader() {
        const prHeader = document.getElementsByClassName('gh-header-title')[0];

        const linkIconSpan = document.createElement('span');
        linkIconSpan.appendChild(document.createTextNode('🔗'));
        const copiedAlertSpan = document.createElement('span');
        copiedAlertSpan.className = 'copyAlert';
        copiedAlertSpan.appendChild(document.createTextNode('Copied!'));

        prHeader.appendChild(linkIconSpan);
        prHeader.appendChild(copiedAlertSpan);

        return linkIconSpan;
    }

    function getPRHeader() {
        const prHeader = document.getElementsByClassName('gh-header-title')[0];
        const prHeaderTextContainer = prHeader.getElementsByTagName('bdi')[0];
        return prHeaderTextContainer;
    }

    function createPRLineChange() {
        const diffstat = document.getElementById('diffstat');
        const adds = diffstat.children[0].innerText.trim();
        const removes = diffstat.children[1].innerText.trim();
        return `(${adds}/${removes})`;
    }

    function handleClick(event) {
        const prText = `${document.URL}\n\`${getPRHeader().innerText}\`\n${createPRLineChange()}`;
        navigator.clipboard.writeText(prText);

        const copyDiv = document.querySelector('.copyAlert:not(.animate)')
        if (copyDiv) {
            copyDiv.classList.add('animate');
            copyDiv.addEventListener('animationend', () => copyDiv.classList.remove('animate') );
        }
    }

    function createStyles() {
        const styles = `
            .animate { animation: disappear 1.0s linear; }

            .copyAlert { opacity: 0; background-color: #D2D2D2; font-size: smaller; padding: 3px; }

            @keyframes disappear {
              0%  { opacity: 0; }
              10% { opacity: .8 }
              60%  { opacity: 1; }
              100% { opacity: 0; }
            }
        `;

        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }

    createStyles();

    const linkIcon = addLinkIconToPRHeader();
    linkIcon.style.cursor = 'pointer';
    linkIcon.addEventListener('click', handleClick);

})();

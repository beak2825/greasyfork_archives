// ==UserScript==
// @name         Trello Commit Message Generator
// @namespace    https://alamote.pp.ua/
// @version      1.4
// @description  Click the card icon to generate commit message from the Trello card
// @author       AlaMote
// @match        https://trello.com/*
// @icon         http://alamote.pp.ua/staff/alamote-logo.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/433256/Trello%20Commit%20Message%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/433256/Trello%20Commit%20Message%20Generator.meta.js
// ==/UserScript==

const copyBranchName = type => {
    const parts = location.href.split('/');
    const titleParts = parts[5].split('-');
    delete titleParts[0];
    if (type === 'ticket' && /ticket-\d+-/.test(parts[5])) {
        delete titleParts[1];
        delete titleParts[2];
    }

    copyText(`${type}/${parts[4]}/${titleParts.filter(p => p).join('-')}`);
}

const addBranchIcons = () => {
    const iconInterval = setInterval(() => {
        const title = document.querySelector('.description-title');
        const feature = document.querySelector('.branch-button');
        if (title) {
            clearInterval(iconInterval);
        }
        if (title && !feature) {
            const button = document.createElement('a');
            button.classList.add('nch-button');
            button.style.marginLeft = '8px';
            button.classList.add('branch-button');
            const cover = document.querySelector('.window .color-card-cover.color-card-cover-blue');
            if (cover) {
                const iconTicket = button.cloneNode();
                iconTicket.title = 'Copy `ticket` branch name';
                iconTicket.innerHTML = 'Ticket';
                iconTicket.addEventListener('click', () => copyBranchName('ticket'));
                title.appendChild(iconTicket);
            } else {
                const iconFeature = button.cloneNode();
                iconFeature.title = 'Copy `feature` branch name';
                iconFeature.innerHTML = 'Feature';
                iconFeature.addEventListener('click', () => copyBranchName('feature'));
                title.appendChild(iconFeature);

                const iconFix = button.cloneNode();
                iconFix.title = 'Copy `fix` branch name';
                iconFix.innerHTML = 'Fix';
                iconFix.addEventListener('click', () => copyBranchName('fix'));
                title.appendChild(iconFix);
            }
        }
    }, 100);
}

const copyText = (text, alertMessage) => {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
        } catch (err) {
            return;
        }
        document.body.removeChild(textArea);
    }
    const alert = document.createElement('div');
    const message = document.createTextNode(alertMessage ?? text);
    alert.appendChild(message);
    alert.style.position = 'absolute';
    alert.style.top = '10px';
    alert.style.left = 'calc(50% - 200px)';
    alert.style.width = '400px';
    alert.style.heigth = '50px';
    alert.style.display = 'flex';
    alert.style.alignItems = 'center';
    alert.style.justifyContent = 'center';
    alert.style.background = '#61bd4f';
    alert.style.borderRadius = '4px';
    alert.style.zIndex = '10000';
    alert.style.padding = '16px';
    alert.style.fontSize = '16px';
    alert.style.color = 'white';

    document.body.appendChild(alert);
    setTimeout(() => document.body.removeChild(alert), 2000);
}

(function() {
    'use strict';

    const interval = setInterval(() => {
        if (document.getElementById('board')) {
            const cards = document.getElementsByClassName('list-card');
            for (let i = 0; i < cards.length; i++) {
                if (cards.item(i).classList.contains('list-card-processed')) {
                    continue;
                }
                const icon = cards.item(i).getElementsByClassName('icon-edit').item(0);
                const icon2 = cards.item(i).getElementsByClassName('icon-copy-title').item(0);
                if (icon && !icon2) {
                    const iconCopy = icon.cloneNode();
                    iconCopy.classList.remove('icon-edit');
                    iconCopy.classList.remove('js-card-menu');
                    iconCopy.classList.remove('js-open-quick-card-editor');
                    iconCopy.classList.add('icon-copy-title');
                    iconCopy.style.right = '34px';
                    iconCopy.style.fontWeight = 'bold';
                    iconCopy.innerHTML = 'C';
                    iconCopy.addEventListener('click', e => {
                        const lastCopied = localStorage.getItem('copied-ts');
                        const lastCopiedMessage = localStorage.getItem('copied-message');
                        e.preventDefault();
                        e.stopPropagation();
                        let text = cards.item(i).getElementsByClassName('list-card-title').item(0).innerHTML.replace(/(<([^>]+)>)/gi, " ").trim();
                        if (lastCopied && lastCopiedMessage && new Date().getTime() - lastCopied < 10000) {
                            text = `${lastCopiedMessage};\n${text}`;
                        }
                        copyText(text);
                        localStorage.setItem('copied-message', text);
                        localStorage.setItem('copied-ts', new Date().getTime());
                    });
                    cards.item(i).appendChild(iconCopy);
                }
                cards.item(i).addEventListener('click', addBranchIcons);
                cards.item(i).classList.add('list-card-processed');
            }
        }
    }, 2000);

    if (location.href.indexOf('trello.com/c/') > -1) {
        addBranchIcons();
    }

    const styleElement = document.createElement('style');
    styleElement.innerHTML = '.window-header-icon, .icon-description {cursor: pointer;}';
    document.getElementsByTagName('head').item(0).appendChild(styleElement);

    document.addEventListener('click', e => {
        if (e.target && e.target.classList.contains('window-header-icon')) {
            const link = location.href;
            const title = document.getElementsByClassName('mod-card-back-title').item(0);
            if (title) {
                const parts = link.split('/');
                const id = parseInt(parts[parts.length - 1], 10);
                const text = `#${id} ${title.value}\n${link}`;
                copyText(text);
            }
        }
        if (e.target && e.target.classList.contains('icon-description')) {
            const link = location.href;
            const parts = link.split('/');
            copyText(parts[parts.length - 1]);
        }
    });
})();

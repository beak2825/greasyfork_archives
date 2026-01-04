// ==UserScript==
// @name        MPPNet Disable ID Copying Feature
// @namespace   multiplayerpiano.net
// @match       https://multiplayerpiano.net/*
// @match       https://dev.multiplayerpiano.net/*
// @grant       none
// @require     https://update.greasyfork.org/scripts/5679/250853/Wait%20For%20Elements.js
// @version     1.0
// @author      Anonygold
// @description Makes the ID's in user menu and chat not copiable with a click.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/531846/MPPNet%20Disable%20ID%20Copying%20Feature.user.js
// @updateURL https://update.greasyfork.org/scripts/531846/MPPNet%20Disable%20ID%20Copying%20Feature.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const makeMenuIdElement = id => {
        const info = document.createElement('div');
        info.className = 'info anticopy';
        info.textContent = id;
        return info;
    };

    const makeChatIdElement = (id, sec = '') => {
        const idElement = document.createElement('span');
        idElement.className = `id${sec} anticopy`;
        idElement.textContent = id;
        return idElement;
    };

    const anticopyStyle = `
    .participant-menu .info.anticopy {
        display: block;
    }
    #chat > ul > li > .id.anticopy, #chat > ul > li > .id2.anticopy {
        display: unset;
    }
    .participant-menu .info.anticopy, #chat > ul > li > .id.anticopy, #chat > ul > li > .id2.anticopy {
        cursor: unset;
    }
    .participant-menu .info, #chat > ul > li > .id, #chat > ul > li > .id2 {
        display: none;
    }
    `;

	const style = document.createElement('style');
	style.type = 'text/css';

    if (style.styleSheet) style.styleSheet.cssText = anticopyStyle; else style.appendChild(document.createTextNode(anticopyStyle));

    document.head.appendChild(style);

    const triggerChatIdElement = () => {
        const chatElements = document.querySelectorAll('#chat > ul > li');
        chatElements.forEach(li => {
            if (li.querySelectorAll('.id.anticopy, .id2.anticopy').length < 1) {
                const id = li.getElementsByClassName('id')[0];
                const id2 = li.getElementsByClassName('id2')[0];
                if ((id || {}).textContent) {
                    li.insertBefore(makeChatIdElement(id.textContent), id);
                }
                if ((id2 || {}).textContent) {
                    li.insertBefore(makeChatIdElement(id2.textContent, 2), id2);
                }
            }
        });
    };

    const triggerMenuIdElement = () => {
        const menuElements = document.getElementsByClassName('participant-menu');
        if (menuElements.length > 0) {
            [...menuElements].forEach(li => {
                if (!li.querySelector('.info.anticopy')) {
                    const info = li.getElementsByClassName('info')[0];
                    if ((info || {}).textContent) {
                        li.insertBefore(makeMenuIdElement(info.textContent), info);
                    }
                }
            });
        }
    };

    waitForElems({
        sel: '#chat > ul > li > .id, #chat > ul > li > .id2',
        onchange: triggerChatIdElement,
        onmatch: triggerChatIdElement,
    });
    waitForElems({
        sel: '.participant-menu .info',
        onchange: triggerMenuIdElement,
        onmatch: triggerMenuIdElement,
    });
})();
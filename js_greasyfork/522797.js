// ==UserScript==
// @name         FallMamontsBlock
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Mamonts are no longer flying :(
// @author       k3kzia
// @license      MIT
// @match        *://lolz.guru/*
// @match        *://zelenka.guru/*
// @match        *://lolz.live/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/522797/FallMamontsBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/522797/FallMamontsBlock.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const defaultSettings = {
        snowMinJs: true,
        interactiveMinJs: true
    };

    const settings = GM_getValue('blockSettings') || defaultSettings;

    if (!GM_getValue('blockSettings')) {
        GM_setValue('blockSettings', defaultSettings);
    }

    const blockList = [];
    if (settings.snowMinJs) blockList.push('snow.min.js');
    if (settings.interactiveMinJs) blockList.push('interactive.min.js');

    const isBlocked = (src) => blockList.some(blockedUrl => src.includes(blockedUrl));

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.tagName === 'SCRIPT' && node.src && isBlocked(node.src)) {
                    console.log('Blocked script:', node.src);
                    node.remove();
                }
            });
        });
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    GM_registerMenuCommand(
        `Падающие мамонты (Сейчас ${settings.snowMinJs ? 'выключены' : 'включены'})`,
        () => {
            settings.snowMinJs = !settings.snowMinJs;
            GM_setValue('blockSettings', settings);
            alert(`Падающие мамонты ${settings.snowMinJs ? 'выключены' : 'включены'}, пожалуйста, перезагрузите страницу`);
        }
    );

    GM_registerMenuCommand(
        `Взаимодействия (Сейчас ${settings.interactiveMinJs ? 'выключены' : 'включены'})`,
        () => {
            settings.interactiveMinJs = !settings.interactiveMinJs;
            GM_setValue('blockSettings', settings);
            alert(`Взаимодействия ${settings.interactiveMinJs ? 'выключены' : 'включены'}, пожалуйста, перезагрузите страницу`);
        }
    );
})();

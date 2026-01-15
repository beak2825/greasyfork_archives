// ==UserScript==
// @name         Copy for PR
// @namespace    http://tampermonkey.net/
// @version      7000
// @description  teads yvelin
// @author       Louis Yvelin
// @match        https://github.com/**/pull/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497641/Copy%20for%20PR.user.js
// @updateURL https://update.greasyfork.org/scripts/497641/Copy%20for%20PR.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SELECTORS = {
        menu: '[data-testid=top-nav-right]',
        menuFallback: '.AppHeader-globalBar-end',
        title: '.markdown-title',
        diffPlusPrimary: '#diffstat > span.color-fg-success',
        diffMinusPrimary: '#diffstat > span.color-fg-danger',
        diffPlusFallback: '.fgColor-success',
        diffMinusFallback: '.fgColor-danger',
        filesPrimary: '#files_tab_counter',
        filesFallback: '#prs-files-anchor-tab .prc-CounterLabel-CounterLabel-X-kRU',
        icon: '#iconCopyPR',
        button: '#copy-to-pr'
    };

    const iconCopyEmpty =
          '<svg xmlns="http://www.w3.org/2000/svg" id="iconCopyPR" viewBox="0 0 16 16" width="16" height="16"><path d="M3.626 3.533a.249.249 0 0 0-.126.217v9.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-9.5a.249.249 0 0 0-.126-.217.75.75 0 0 1 .752-1.298c.541.313.874.89.874 1.515v9.5A1.75 1.75 0 0 1 12.25 15h-8.5A1.75 1.75 0 0 1 2 13.25v-9.5c0-.625.333-1.202.874-1.515a.75.75 0 0 1 .752 1.298ZM5.75 1h4.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 5 4.75v-3A.75.75 0 0 1 5.75 1Zm.75 3h3V2.5h-3Z"></path></svg>';

    function getMenu() {
        return document.querySelector(SELECTORS.menu);
    }

    function getText(selector, fallbackSelector, defaultValue) {
        return (
            document.querySelector(selector) ??
            document.querySelector(fallbackSelector)
        )?.innerText?.trim() ?? defaultValue;
    }

    function copyLink() {
        const match = location.href.match(/(.*\/pull\/\d+)/);
        if (!match) return;

        const titleNode = document.querySelector(SELECTORS.title);
        if (!titleNode) return;

        const url = match[0];
        const title = titleNode.textContent;
        const [, , repo] = location.pathname.split('/');

        const p = document.createElement('p');

        p.appendChild(document.createTextNode(`[${repo}] `));

        const a = document.createElement('a');
        a.href = url;
        a.appendChild(document.createTextNode(title));
        p.appendChild(a);

        const plus = getText(
            SELECTORS.diffPlusPrimary,
            SELECTORS.diffPlusFallback,
            '+?'
        );

        const minus = getText(
            SELECTORS.diffMinusPrimary,
            SELECTORS.diffMinusFallback,
            '-?'
        );

        const files = getText(SELECTORS.filesPrimary, SELECTORS.filesFallback, '?');

        p.appendChild(
            document.createTextNode(
                ` (${plus} ${minus}, in ${files} file${files > 1 ? 's' : ''})`
            )
        );

        document.body.appendChild(p);

        const range = document.createRange();
        range.selectNode(p);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');

        document.body.removeChild(p);

        const icon = document.querySelector(SELECTORS.icon);
        if (!icon) return;

        icon.style.fill = 'green';
        icon.style.transition = 'transform 0.3s';
        icon.style.transform = 'rotate(360deg)';

        setTimeout(() => {
            icon.style.fill = '';
            icon.style.transform = '';
        }, 300);
    }

    function createButton() {
        if (document.querySelector(SELECTORS.button)) return;

        const menu = getMenu();
        if (!menu) return;

        const div = document.createElement('div');
        div.id = 'copy-to-pr';
        div.className =
            'Button Button--iconOnly Button--secondary Button--medium AppHeader-button color-fg-muted';
        div.innerHTML = iconCopyEmpty;
        div.addEventListener('click', copyLink);

        menu.prepend(div);
    }

    createButton();

    new MutationObserver(createButton).observe(document.body, {
        childList: true,
        subtree: true
    });
})();

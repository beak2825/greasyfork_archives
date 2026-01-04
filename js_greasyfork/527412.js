// ==UserScript==
// @name         Laravel Docs - sticky table of contents
// @namespace    https://laravel.com/
// @version      2025-02-17
// @description  Adds fixed Table of Contents containing each heading to each docs page for easy navigation / jumping between elements
// @author       Mave
// @match        https://laravel.com/docs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=laravel.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527412/Laravel%20Docs%20-%20sticky%20table%20of%20contents.user.js
// @updateURL https://update.greasyfork.org/scripts/527412/Laravel%20Docs%20-%20sticky%20table%20of%20contents.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function htmlToElement(html) {
        const template = document.createElement('template');
        html = html.trim();
        template.innerHTML = html;

        return template.content.firstChild;
    }

    function getStylesFor(elem) {
        switch (elem.tagName) {
            case 'H2':
                return 'line-height: 32px;';
            case 'H3':
                return 'line-height: 24px; margin-left: 16px; font-size: 0.9rem;';
            case 'H4':
                return 'line-height: 24px; margin-left: 32px; font-size: 0.9rem; font-weight: 500;';
        }

        return '';
    }

    setTimeout(() => {
        const sectionMain = document.querySelector('.docs_main div#main-content');
        if (!sectionMain) {
            return;
        }

        const headings = sectionMain.querySelectorAll('h2, h3, h4, h5');
        if (!headings.length) {
            return;
        }

        const container = htmlToElement(`<div style="position: fixed; top: 48px; right: 16px; padding: 16px; border: 2px solid grey; border-radius: 2px; max-height: calc(90vh - 48px); overflow: auto;"><div class="contents"></div></div>`);
        document.body.append(container);

        const containerContents = container.querySelector('div.contents');

        const collapseButton = htmlToElement('<span style="position: absolute; top: 8px; right: 8px; padding: 2px 8px; border: 2px solid #bbb; color: #bbb; cursor: pointer; border-radius: 2px;">&times;</span>');
        collapseButton.addEventListener('click', () => {
            const isCollapsed = containerContents.style?.display === 'none';
            console.log(isCollapsed);
            if (isCollapsed) {
                containerContents.style.display = 'block';
                container.style.width = 'auto';
                container.style.height = 'auto';

                return;
            }

            containerContents.style.display = 'none';
            container.style.width = '80px';
            container.style.height = '80px';
        });

        container.append(collapseButton);
        containerContents.append(htmlToElement('<h1>Table of Contents</h1>'));

        headings.forEach((heading) => {
            const html = heading.outerHTML;
            if (!html.includes('<a')) {
                return;
            }

            const newElem = htmlToElement(html);
            const currentId = newElem.getAttribute('id');
            newElem.setAttribute('id', currentId + '--toc');
            newElem.style = `${getStylesFor(heading)}`;

            containerContents.append(newElem);

            const isActive = currentId === window.location.hash.replace('#', '');
            if (!isActive) {
                return;
            }
            setTimeout(() => {
                newElem.scrollIntoView();
            }, 100);
        });
    }, 100);
})();

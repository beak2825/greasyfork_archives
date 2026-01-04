// ==UserScript==
// @name         Copy URL
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Copy URL of current browser tab as different markup such as orgmode, markdown, typst and even RTF (rich text format or WYSIWYG) ...
// @author       Ice Zero
// @license      MIT
// @match        http://*/*
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/463105/Copy%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/463105/Copy%20URL.meta.js
// ==/UserScript==

(function () {
    'use strict';

    provideSchemas().forEach(behavior);

    function behavior({ name, type = 'text', getLinkMarkup, shortcut }) {
        GM_registerMenuCommand(`Copy URL as ${name} link`, () => {
            getPageMeta().then(({ title, url }) => {
                GM_setClipboard(getLinkMarkup({ title, url }), type);
            });
        }, shortcut);
    }

    async function getPageMeta() {
        const title = document.title;
        const url = window.location.href;
        return { title, url };
    }

    function provideSchemas() {
        return [
            {
                name: 'title',
                getLinkMarkup: ({title}) => `${title}`,
            },
            {
                name: 'url',
                getLinkMarkup: ({url}) => `${url}`,
            },
            {
                // @see https://www.tampermonkey.net/documentation.php#api:GM_setClipboard
                name: 'richtext',
                type: 'html',
                getLinkMarkup: ({title, url}) => `<a href="${url}">${title}</a>`,
                // @see https://www.tampermonkey.net/documentation.php?locale=en#api:GM_registerMenuCommand
                // @desc should config shortcut for call Tampermonkey in `chrome://extensions/shortcuts` first
                shortcut: 'r',
            },
            {
                name: 'markdown',
                getLinkMarkup: ({ title, url }) => `[${title}](${url})`,
                shortcut: 'm',
            },
            {
                name: 'html',
                getLinkMarkup: ({ title, url }) => `<a href="${url}">${title}</a>`,
                shortcut: 'h',
            },
            {
                name: 'orgmode',
                getLinkMarkup: ({ title, url }) => `[[${url}][${title}]]`,
                shortcut: 'o',
            },
            {
                name: 'typst',
                // @see https://typst.app/docs/reference/model/link/
                getLinkMarkup: ({ title, url }) => `#link("${url}")[${title}]`,
                shortut: 't',
            },
            {
                name: 'tsdoc',
                // @see https://tsdoc.org/pages/tags/link/
                getLinkMarkup: ({ title, url }) => `{@link ${url} | ${title}}`,
            },
        ];
    }
})();

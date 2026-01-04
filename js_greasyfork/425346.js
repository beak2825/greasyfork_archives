// ==UserScript==
// @name         Pixiv BetterTagger
// @namespace    https://pixiv.me/ashgale
// @version      0.1.2
// @description  Use the search API to allow english tags to be used
// @author       Ashgale
// @license      MIT
// @supportURL   https://github.com/GaleOfAshes/pixiv-bettertagger/issues
// @match        https://www.pixiv.net/upload.php
// @icon         https://www.google.com/s2/favicons?domain=pixiv.net
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/425346/Pixiv%20BetterTagger.user.js
// @updateURL https://update.greasyfork.org/scripts/425346/Pixiv%20BetterTagger.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function inject() {
        const pixivTagSelect = document.querySelector('.input-tag');
        if (!pixivTagSelect) {
            setTimeout(inject, 300);
            return;
        }

        GM_addStyle(`
          ._illust-upload .metadata-container .items.BetterTagger-choices {
            position: absolute;
            z-index: 1;
            border: 1px lightgray solid;
            margin: 0 0 10px 10px;
          }
          .BetterTagger-choices:empty {
            display: none;
          }
          .BetterTagger-choices .item:hover {
            background-color: rgba(0, 0, 0, 0.04);
            cursor: pointer;
          }
        `);

        const root = document.createElement('div');
        root.innerHTML = `
          <div class="text item">
            <input class="input" type="text" placeholder="BetterTags" class="BetterTagger-input">
            <div style="" class="BetterTagger-choices items"></div>
          </div>
        `;

        const tagInput = root.querySelector('input');
        const tagChoices = root.querySelector('.BetterTagger-choices');

        const tagContainer = pixivTagSelect.parentElement;
        tagContainer.insertBefore(root.firstElementChild, tagContainer.firstElementChild);

        let timer = null;
        tagInput.addEventListener('input', () => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(searchTags, 200);
        });

        tagChoices.addEventListener('click', event => {
            if (!event.target.matches('.item[data-tag-name]')) return;
            event.preventDefault();
            const lameTagInput = document.querySelector('.ui-tag-container input');
            lameTagInput.value = event.target.dataset.tagName;
            lameTagInput.focus();
            tagInput.value = '';
            searchTags();
        });

        async function searchTags() {
            timer = null;
            tagChoices.replaceChildren();

            if (tagInput.value.length < 2) return;

            const url = new URL('/rpc/cps.php', window.location);
            url.searchParams.append('keyword', tagInput.value);
            url.searchParams.append('lang', 'en');

            const response = await fetch(new Request(url));
            if (response.ok) {
                const body = await response.json();
                tagChoices.replaceChildren(...body.candidates.map(candidateToElement));
            }
        }

        function candidateToElement(candidate) {
            const root = document.createElement('div');
            const translation = candidate.tag_translation ? `(${candidate.tag_translation})` : '';
            root.innerHTML = `
            <div class="item" data-tag-name="${candidate.tag_name}">
            ${candidate.tag_name} ${translation}
            </div>
            `;
            return root.firstElementChild;
        }

    }

    inject();
})();

// ==UserScript==
// @name         Tag and Scene Formatter for Gelbooru, Danbooru, Sankaku Complex, Rule34, and Aibooru
// @icon         https://i.imgur.com/8Uc4sbV.png
// @namespace    http://tampermonkey.net/
// @version      3.19
// @description  Add buttons to copy formatted tags and scene tags from Gelbooru, Danbooru, Sankaku Complex, Rule34, and Aibooru
// @match        https://gelbooru.com/index.php?page=post&s=view&id=*
// @match        https://danbooru.donmai.us/posts/*
// @match        https://chan.sankakucomplex.com/*
// @match        https://rule34.xxx/*
// @match        https://aibooru.online/posts/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/502132/Tag%20and%20Scene%20Formatter%20for%20Gelbooru%2C%20Danbooru%2C%20Sankaku%20Complex%2C%20Rule34%2C%20and%20Aibooru.user.js
// @updateURL https://update.greasyfork.org/scripts/502132/Tag%20and%20Scene%20Formatter%20for%20Gelbooru%2C%20Danbooru%2C%20Sankaku%20Complex%2C%20Rule34%2C%20and%20Aibooru.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const tagsToRemove = new Set([
        'absurdres', 'commentary', 'english commentary', 'highres',
        'commentary request', 'translation request', 'original', 'mosaic censoring', 'bar censor', 'uncensored',
        'bad id', 'bad pixiv id', 'bad twitter id', 'signature', 'artist name', 'inpainted', 'non-web source', 'self-upload', 'controlnet', 'nai diffusion', 'first-party edit', 'tags', 'artist', 'copyrights', 'character', 'medium', 'genre', 'necrophilia', 'ai', ' ai assisted', 'minigirl', 'signature', 'twitter username', 'story at source', 'speech bubble', 'censored', 'lora', '00s', '10s', 'interracial', 'dark-skinned male', 'heart censor', 'mosaic censoring', 'genres', 'general'
    ]);

    const blacklistedTerms = ['loli', 'lolita', 'school', 'rape', 'small', 'young', 'teen', 'child', 'shota', 'teenager', 'young girl', 'mother', 'censored', 'tagme', 'unworn', 'text', 'teenage', 'request', 'ai generated', 'stable diffusion', 'smaller', 'younger', 'babydoll', 'daughter', 'siblings', 'incest', 'brother', 'sister', 'raped'];

    function addButtons(targetElement, getAllTags, getSceneTags) {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginBottom = '10px';

        const copyTagsButton = createButton('Copy tags', () => copyTags(getAllTags(), false, copyTagsButton));
        const copySceneButton = createButton('Copy scene', () => copyTags(getSceneTags(), true, copySceneButton));

        buttonContainer.appendChild(copyTagsButton);
        buttonContainer.appendChild(copySceneButton);
        targetElement.parentNode.insertBefore(buttonContainer, targetElement);
    }

    function createButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.marginRight = '5px';
        button.addEventListener('click', onClick);
        return button;
    }

    function copyTags(tags, isScene, button) {
        if (tags.length > 0) {
            const formattedTags = filterAndFormatTags(tags, isScene);
            GM_setClipboard(formattedTags);
            const originalText = button.textContent;
            button.textContent = isScene ? 'Scene tags copied!' : 'Tags copied!';
            setTimeout(() => { button.textContent = originalText; }, 2000);
        } else {
            const originalText = button.textContent;
            button.textContent = 'No tags found!';
            setTimeout(() => { button.textContent = originalText; }, 2000);
        }
    }

    function filterAndFormatTags(tags, isScene) {
        let filteredTags = tags.filter(tag => {
            tag = tag.trim().toLowerCase();
            if (isScene) {
                return !tag.match(/^\w+ (hair|eyes)$/) &&
                       !blacklistedTerms.some(term => tag.includes(term)) &&
                       !tag.startsWith('?') &&
                       tag !== '';
            } else {
                return !tagsToRemove.has(tag) &&
                       !blacklistedTerms.some(term => tag.includes(term)) &&
                       !tag.startsWith('?') &&
                       tag !== '';
            }
        });
        return [...new Set(filteredTags)].join(', ');
    }

    if (window.location.hostname === 'gelbooru.com') {
        const tagContainer = document.querySelector('#tag-list');
        if (tagContainer) {
            addButtons(
                tagContainer,
                () => Array.from(tagContainer.querySelectorAll('.tag-type-general > a, .tag-type-copyright > a, .tag-type-character > a'))
                    .map(a => a.textContent.trim()),
                () => Array.from(tagContainer.querySelectorAll('.tag-type-general > a')).map(a => a.textContent.trim())
            );
        }
    } else if (window.location.hostname === 'danbooru.donmai.us') {
        const tagContainer = document.querySelector('#tag-list');
        if (tagContainer) {
            addButtons(
                tagContainer,
                () => Array.from(tagContainer.querySelectorAll('.search-tag:not(.artist-tag-list .search-tag)')).map(a => a.textContent.trim()),
                () => {
                    const generalTagsList = tagContainer.querySelector('ul.general-tag-list');
                    if (generalTagsList) {
                        return Array.from(generalTagsList.querySelectorAll('.search-tag'))
                            .map(a => a.textContent.trim());
                    }
                    return [];
                }
            );
        }
    } else if (window.location.hostname === 'aibooru.online') {
        const tagContainer = document.querySelector('#tag-list');
        if (tagContainer) {
            addButtons(
                tagContainer,
                () => Array.from(tagContainer.querySelectorAll('.search-tag:not(.artist-tag-list .search-tag):not(.model-tag-list .search-tag)')).map(a => a.textContent.trim()),
                () => {
                    const generalTagsList = tagContainer.querySelector('ul.general-tag-list');
                    if (generalTagsList) {
                        return Array.from(generalTagsList.querySelectorAll('.search-tag'))
                            .map(a => a.textContent.trim());
                    }
                    return [];
                }
            );
        }
    } else if (window.location.hostname === 'chan.sankakucomplex.com') {
        const tagContainer = document.querySelector('#tag-sidebar');
        if (tagContainer) {
            addButtons(
                tagContainer,
                () => Array.from(tagContainer.querySelectorAll('#tag-sidebar li a:not(.tag-type)')).map(a => a.textContent.trim().split(' ')[0].replace(/^[♫!@]+/, '')),
                () => Array.from(tagContainer.querySelectorAll('#tag-sidebar li:not([class*="tag-type-"]) a:not(.tag-type)')).map(a => a.textContent.trim().split(' ')[0].replace(/^[♫!@]+/, ''))
            );
        }
    } else if (window.location.hostname === 'rule34.xxx') {
        const tagContainer = document.querySelector('ul#tag-sidebar');
        if (tagContainer) {
            addButtons(
                tagContainer,
                () => Array.from(tagContainer.querySelectorAll('li:not(.tag-type-artist) a')).map(a => a.textContent.trim()),
                () => Array.from(tagContainer.querySelectorAll('li.tag-type-general a')).map(a => a.textContent.trim().replace(/^\? /, ''))
            );
        }
    }
})();
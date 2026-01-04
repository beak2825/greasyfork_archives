// ==UserScript==
// @name        Tag grabber - boorus
// @namespace   Violentmonkey Scripts
// @match       https://gelbooru.com/*
// @match       https://konachan.com/*
// @match       https://xbooru.com/*
// @match       https://grognard.booru.org/*
// @match       https://yande.re/*
// @match       https://hypnohub.net/*
// @match       https://safebooru.org/*
// @grant       none
// @version     1.1
// @license     MIT
// @author      SoliDissipation
// @description 1/8/2023, 12:55:44 PM
// @downloadURL https://update.greasyfork.org/scripts/457857/Tag%20grabber%20-%20boorus.user.js
// @updateURL https://update.greasyfork.org/scripts/457857/Tag%20grabber%20-%20boorus.meta.js
// ==/UserScript==

document.addEventListener('keydown', function (event) {
    if (event.key === 'c') {
        let tags = document.querySelectorAll('.search-tag');
        if (tags.length == 0) tags = document.querySelectorAll('.tag-link');
        if (tags.length == 0) tags = document.querySelectorAll('.tag__name');
        if (tags.length == 0) {
            tags = document.getElementsByTagName('a');
            tags = Array.from(tags).filter(tag => tag.href.includes('tags=') && !tag.href.includes('#') && tag.parentElement.children.length == 3);
        }
        let grognardTags = null;
        //check if current url is grognard
        if (tags.length == 0 && window.location.href.includes('grognard')) {
            grognardTags = document.getElementById('tag_list');
            tags = grognardTags.querySelectorAll('li');
        }
        if(tags.length == 0 && (window.location.href.includes('safebooru') || window.location.href.includes('xbooru'))) {
            tags = document.getElementById('tag-sidebar');
            tags = tags.querySelectorAll('a');
        }
        const tagNames = [];
        tags.forEach(tag => {
            if (tag.innerText && tag.innerText.trim().length > 0) {
                if (grognardTags != null) tag = tag.children[0];
                if (tag.children.length > 0) {
                    tag = Array.from(tag.children).filter(child => child.href && child.href.includes('tags='))[0];
                }
                if (event.altKey) tagNames.push(tag.innerText.replace(/\s/g, '_'));
                else tagNames.push(tag.innerText);
            }
        });
        tagString = tagNames.join(', ');
        console.log(tagString);
        navigator.clipboard.writeText(tagString);
    }
});
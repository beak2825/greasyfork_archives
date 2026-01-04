// ==UserScript==
// @name         Pikabu NSFW
// @namespace    PikabuNSFW
// @version      0.1.5
// @description  Hide NSFW post
// @author       Gleb Liutsko
// @match        https://pikabu.ru/*
// @grant        none
// @license      MIT
// @icon         https://cs.pikabu.ru/assets/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/412106/Pikabu%20NSFW.user.js
// @updateURL https://update.greasyfork.org/scripts/412106/Pikabu%20NSFW.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (location.href.match(/story/)) {
        console.log('Ignore page')
        return;
    }

    const is_mobile = Boolean(document.getElementsByClassName('sidebar__control').length);

    function search_nsfw() {
        console.log('Search NTFS...');

        let stories_nsfw = [];
        let stories = document.getElementsByClassName('story');
        for (let story of stories) {
            if (story.getElementsByClassName('tags__tag_nsfw').length) {
                stories_nsfw.push(story);
            }
        }

        return stories_nsfw;
    }

    var hide_story;
    if (is_mobile) {
        hide_story = function(story) {
            story.getElementsByClassName('story__content')[0].style.display = 'none';
        }
    } else {
        hide_story = function(story) {
            story.getElementsByClassName('collapse-button')[0].click();
        }
    }

    function hide_stories(stories) {
        for (let story of stories) {
            if (Array.from(story.classList).indexOf('story_collapse') == -1) {
                console.log('Hide stories: ' + story.getElementsByClassName('story__title-link')[0].text);
                hide_story(story);
            }
        }
    }

    function hide() {
        hide_stories(search_nsfw());
    }

    document.getElementsByClassName('stories-feed__container')[0].addEventListener('DOMNodeInserted', hide);
    hide();
})();
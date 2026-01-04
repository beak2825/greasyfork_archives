// ==UserScript==
// @name         Нормальные короткие посты
// @namespace    PikabuNormal
// @version      0.1.3
// @description  Удаляет фон у коротких постов.
// @author       Gleb Liutsko
// @match        https://pikabu.ru/*
// @grant        none
// @license      MIT
// @icon         https://cs.pikabu.ru/assets/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/436699/%D0%9D%D0%BE%D1%80%D0%BC%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D0%BA%D0%BE%D1%80%D0%BE%D1%82%D0%BA%D0%B8%D0%B5%20%D0%BF%D0%BE%D1%81%D1%82%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/436699/%D0%9D%D0%BE%D1%80%D0%BC%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D0%BA%D0%BE%D1%80%D0%BE%D1%82%D0%BA%D0%B8%D0%B5%20%D0%BF%D0%BE%D1%81%D1%82%D1%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const classFeedPost = 'stories-feed__container'

    const classNormalStory = 'story story_tags-at-top'

    const classShortPost = 'story story_short'
    const classBackgroundShortPost = 'icon icon--ui__bg-story-short'

    function normalizePost(post) {
        console.log('Normalize post: ' + post.getElementsByClassName('story__title-link')[0].text)

        post.className = classNormalStory
        post.getElementsByClassName(classBackgroundShortPost)[0].remove()
    }

    function normalizeAllPostInFeed() {
        console.log('Normalize feed')

        let feed = document.getElementsByClassName(classFeedPost)[0]
        let shortPosts = Array.from(feed.getElementsByClassName(classShortPost))

        shortPosts.forEach(normalizePost)
    }


    if (location.href.match(/story/)) {
        let post = document.getElementsByTagName('article')[0]
        normalizePost(post)
    }
    else {
        document.getElementsByClassName(classFeedPost)[0].addEventListener('DOMNodeInserted', normalizeAllPostInFeed)
        normalizeAllPostInFeed()
    }
})();
// ==UserScript==
// @name         Pikabu - удаление спонсорских постов
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  удаляет посты, автором которых является ads.
// @author       Leoric
// @match        https://pikabu.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35095/Pikabu%20-%20%D1%83%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%81%D0%BF%D0%BE%D0%BD%D1%81%D0%BE%D1%80%D1%81%D0%BA%D0%B8%D1%85%20%D0%BF%D0%BE%D1%81%D1%82%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/35095/Pikabu%20-%20%D1%83%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%81%D0%BF%D0%BE%D0%BD%D1%81%D0%BE%D1%80%D1%81%D0%BA%D0%B8%D1%85%20%D0%BF%D0%BE%D1%81%D1%82%D0%BE%D0%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var matches = ["ads", "реклама", "закрепленный пост"];
    var post;
    var links = document.getElementsByTagName("a");
    for(var i=0, l=links.length;i<l;i++) {
        if (links[i] && matches.includes(links[i].textContent.trim())) {
            post = findAncestor(links[i], "story");
            post.remove();
        }
    }
    var authors = document.getElementsByClassName("story__header-additional-wrapper");
    if (authors[0] && matches.includes(authors[0].textContent.split(" ")[0].trim())) {
        post = findAncestor(authors[0], "story");
        post.remove();
    }
})();

function findAncestor (el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
}
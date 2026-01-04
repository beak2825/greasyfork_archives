// ==UserScript==
// @name         Embedded Youtube Video For Facebook
// @namespace    https://openuserjs.org/users/Energy0124
// @version      0.1.2
// @description  Convert Youtube video link in Facebook to embedded video, works for post and comment.
// @author       Energy0124
// @copyright    2020, Energy01214
// @license      MIT
// @match        https://www.facebook.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406262/Embedded%20Youtube%20Video%20For%20Facebook.user.js
// @updateURL https://update.greasyfork.org/scripts/406262/Embedded%20Youtube%20Video%20For%20Facebook.meta.js
// ==/UserScript==

// based on https://greasyfork.org/en/scripts/404309-facebook-hide-ads-a-k-a-sponsored-posts
(function () {
    'use strict';
    const qS = (el, scope) => {
            scope = (typeof scope == 'object') ? scope : document;
            return scope.querySelector(el) || false;
        },
        targetNode = qS('body'),
        observerConfig = {
            attributes: false,
            childList: true,
            subtree: true
        },
        callback = function (mutationsList, observer) {
            mutationsList.forEach(function (mutation) {
                const youtube_parser = function (url) {
                    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                    const match = url.match(regExp);
                    if (match && match[2].length === 11) {
                        return match[2];
                    } else {
                        //error
                        return "";
                    }
                };

                // find all posts with youtube link and convert them to embedded player
                Array.from(document.querySelectorAll('a[href*="youtu"] > div > div > div > div > img')).map(x => x.parentElement.parentElement.parentElement.parentElement)
                    .map(x => {
                        return [x.parentElement, youtube_parser(decodeURIComponent(x.parentElement.href.replace("https://l.facebook.com/l.php?u=", "")))];
                    }).map(x => {
                    x[0].parentElement.innerHTML = `<div style="position: relative; width: 100%; height: 0; padding-bottom: 56.25%;"><iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://www.youtube.com/embed/${x[1]}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>`
                });

                // find all comments with youtube link and convert them to embedded player
                Array.from(document.querySelectorAll('a[href*="youtu"] > span'))
                    .map(x => {
                        return [x.parentElement, youtube_parser(decodeURIComponent(x.parentElement.href.replace("https://l.facebook.com/l.php?u=", "")))];
                    }).map(x => {
                    x[0].parentElement.parentElement.parentElement.innerHTML = `<div style="position: relative; width: 100%; height: 0; padding-bottom: 56.25%;"><iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://www.youtube.com/embed/${x[1]}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>`
                });

            });
        };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, observerConfig);
})();

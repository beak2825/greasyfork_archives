// ==UserScript==
// @name         4chan Infinite Scroll
// @author       wxn0brP
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add infinite scroll to 4chan boards
// @match        https://boards.4chan.org/*/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514744/4chan%20Infinite%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/514744/4chan%20Infinite%20Scroll.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var loadNext = false;
    var counter = 1;
    const loadMorePosts = () => {
        if (loadNext) return;
        loadNext = true;
        counter++
        fetch(counter + "")
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, 'text/html');
                const newPosts = doc.querySelectorAll('.post');
                const board = document.querySelector('.board');

                const div = document.createElement("div")
                div.innerHTML = `<hr><h2>Page ${counter}</h2><hr>`
                board.appendChild(div);

                newPosts.forEach(post => {
                    board.appendChild(post.cloneNode(true));
                });
                console.log(`Load ${counter} page`);
                setTimeout(() => { loadNext = false }, 200)
            })
            .catch(error => {
                alert('There has been a problem with your fetch operation:' + error);
            });
    };

    window.addEventListener('scroll', () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
            loadMorePosts();
        }
    });
})();

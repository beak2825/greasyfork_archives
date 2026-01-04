// ==UserScript==
// @name         Links to Next and Previous Posts
// @namespace    https://greasyfork.org/en/users/163551-vannius
// @version      2.00
// @license      MIT
// @description  Add links to next and previous posts to each post
// @author       Vannius
// @match        https://althistory.com/threads/*
// @match        https://forum.questionablequesting.com/threads/*
// @match        https://forums.spacebattles.com/threads/*
// @match        https://forums.sufficientvelocity.com/threads/*
// @match        https://www.alternatehistory.com/forum/threads/*
// @match        https://www.the-sietch.com/index.php?threads/*
// @match        https://xenforo.com/community/threads/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36479/Links%20to%20Next%20and%20Previous%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/36479/Links%20to%20Next%20and%20Previous%20Posts.meta.js
// ==/UserScript==

(function () {
    // Make <li> tag with new link.
    const makeLink = (id, title, symbol) => {
        const newLink = document.createElement('a');
        newLink.href = '#' + id;
        newLink.title = title;
        newLink.appendChild(document.createTextNode(symbol));
        newLink.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById(id).scrollIntoView();
        }, false);

        const liTag = document.createElement('li');
        liTag.appendChild(newLink);
        return liTag;
    }

    // Get message ids from messageTags and make in hashLinks
    const messageTags = [...document.querySelectorAll('.message-attribution-opposite--list > li')]
    .filter(x => /^#[\d,]+$/.test(x.textContent.trim()));
    const ids = messageTags.map(x => x.closest('article').id);

    for (let i = 0; i < messageTags.length; i++) {
        // Add a link to next post
        if (i !== messageTags.length - 1) {
            const nextPost = makeLink(ids[i + 1], "Next post", '▼');
            messageTags[i].parentElement.appendChild(nextPost);
        }

        // Add a link to prev post
        if (i !== 0) {
            const prevPost = makeLink(ids[i - 1], "Prev post", '▲');
            messageTags[i].parentElement.insertBefore(prevPost, messageTags[i]);
        }

        // Add a link to current post
        if (i === 0 || i === messageTags.length - 1) {
            const currentPost = makeLink(ids[i], "Current post", '◇');
            if (i === 0) {
                messageTags[i].parentElement.insertBefore(currentPost, messageTags[i]);
            } else if (i === messageTags.length - 1) {
                messageTags[i].parentElement.appendChild(currentPost);
            }
        }
    }
})();

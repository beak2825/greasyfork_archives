// ==UserScript==
// @name        SB/SV add threadmark at top of post
// @namespace   https://greasyfork.org/en/users/13408-mistakenot
// @match       https://forums.spacebattles.com/threads/*
// @match       https://forums.sufficientvelocity.com/threads/*
// @grant       none
// @version     0.1
// @author      -
// @description Add button to create threadmark at top of post
// @license     Mozilla Public License, v. 2.0
// @downloadURL https://update.greasyfork.org/scripts/462167/SBSV%20add%20threadmark%20at%20top%20of%20post.user.js
// @updateURL https://update.greasyfork.org/scripts/462167/SBSV%20add%20threadmark%20at%20top%20of%20post.meta.js
// ==/UserScript==
 
(function () {
    // Make <li> tag with new link.
    const makeLink = (id, title, symbol) => {
        const newLink = document.createElement('a');
        newLink.href = '/posts/' + id + '/add-threadmark';
        newLink.title = title;
        newLink.setAttribute('data-xf-click', 'overlay');
        newLink.appendChild(document.createTextNode(symbol));
 
        const liTag = document.createElement('li');
        liTag.appendChild(newLink);
        return liTag;
    }
 
    // Get message ids from messageTags and make in hashLinks
    const messageTags = [...document.querySelectorAll('.message-attribution-opposite--list > li')]
    .filter(x => /^#[\d,]+$/.test(x.textContent.trim()));
    const ids = messageTags.map(x => x.closest('article').id);

    for (let i = 0; i < messageTags.length; i++) {
        // Add threadmark link to current post
        const currentPost = makeLink(ids[i].substring(8), "ADD THREADMARK", '⭐');
        messageTags[i].parentElement.insertBefore(currentPost, messageTags[i]);
    }
})();
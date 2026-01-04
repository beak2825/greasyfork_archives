// ==UserScript==
// @name         forum beautifier
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  remove idiots from forums
// @author       You
// @match        https://www.lordswm.com/forum_messages.php*
// @icon         https://www.google.com/s2/favicons?domain=lordswm.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430794/forum%20beautifier.user.js
// @updateURL https://update.greasyfork.org/scripts/430794/forum%20beautifier.meta.js
// ==/UserScript==

'use strict';

// Post Actions
const makeSpoiler = (post, new_post) => {
    const originalText = post.innerHTML;
    const spoiler = document.createElement('div');

    spoiler.style.backgroundColor = 'black';
    const highlight = () => {
        spoiler.style.color = 'white';
    }
    const unhighlight = () => {
        spoiler.style.color = 'black';
    }

    spoiler.innerHTML = originalText;
    spoiler.onmouseover = highlight;
    spoiler.onmouseout = unhighlight;

    post.innerHTML = `<p>${new_post} </p>`;
    post.appendChild(spoiler);
}

const removePost = (post, new_post) => {
    post.innerHTML = '';
}

// Author actions
const renameAuthor = (author, new_name) => {
    author.innerText = new_name;
}

const beautify = (pl_id, nameAction, postAction, new_name, new_post) => {
    const links = document.querySelectorAll(`a[href="pl_info.php?id=${pl_id}"]`);
    links.forEach((a, i) => {
        nameAction(a, new_name);
        const post = a.closest('tr').nextElementSibling.firstElementChild;
        postAction(post, new_post);
    });
}

const kchong = '7339420';

(function() {
    beautify(kchong, renameAuthor, removePost, 'iWriteALotOfBs', 'bs...');
})();
// ==UserScript==
// @name          4chan Post Sorter
// @namespace     4chan-post-sorter
// @description   Sorts posts in a 4chan thread by reply count
// @license       MIT
// @include       http://boards.4chan.org/*/*
// @include       https://boards.4chan.org/*/*
// @grant         GM_registerMenuCommand
// @version       1.0.1
// @author        asdaa
// @icon          https://4chan.org/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/515398/4chan%20Post%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/515398/4chan%20Post%20Sorter.meta.js
// ==/UserScript==

const parent = document.querySelector(".thread")
const posts = [...document.getElementsByClassName("postContainer replyContainer")];


function getReplies(post) {
    return post.getElementsByClassName("backlink").length
}

function getSorted(posts) {
   return posts.sort((a, b) => getReplies(b) - getReplies(a));
}

function sortPosts() {
   sorted = getSorted(posts)
   parent.append(...sorted);
}

var sortBtn = document.createElement('a');
sortBtn.href = 'javascript:;';
sortBtn.innerText = 'Sort';
document.querySelector(".navLinks.desktop").appendChild(sortBtn)
sortBtn.insertAdjacentText('beforebegin', ' [');
sortBtn.insertAdjacentText('afterend', ']');
sortBtn.addEventListener("click", sortPosts, false);

GM_registerMenuCommand('Sort Posts by Reply Count', sortPosts);
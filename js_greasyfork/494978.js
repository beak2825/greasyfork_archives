// ==UserScript==
// @name         Patreon: Sort by most liked comment
// @namespace    http://tampermonkey.net/
// @version      2024.08.12
// @description  On a post's page, this adds a button to sort all VISIBLE root comments by most liked (then by date)
// @author       You
// @match        https://www.patreon.com/posts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=patreon.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494978/Patreon%3A%20Sort%20by%20most%20liked%20comment.user.js
// @updateURL https://update.greasyfork.org/scripts/494978/Patreon%3A%20Sort%20by%20most%20liked%20comment.meta.js
// ==/UserScript==

function loaded(){
    const isReactionsFormat = !!document.querySelector("div[data-tag='post-card'] form"); //if not then page just allows likes (heart icon)
    const getLikeCount = commentRow => isReactionsFormat ?
          Array.from(commentRow.querySelectorAll("span[title]")).reduce((sum, curr) => sum + Number(curr.title), 0) :
          parseInt((commentRow.querySelector('div[data-tag="comment-row"] span[data-tag="like-count"]') || {textContent: 0}).textContent);
    const compare = (a, b) => getLikeCount(b) - getLikeCount(a);
    function sortComments() {
        const commentContainer = isReactionsFormat ?
              document.querySelector("div[data-tag='post-card'] form").previousSibling :
              document.querySelector('div[data-tag="content-card-comment-thread-container"] > div > div');
        const allcomments = Array.from(commentContainer.children).sort(compare);
        commentContainer.innerHTML = '';
        commentContainer.append(...allcomments);
    }

    //create button
    const commentCountButton = document.querySelector('button[data-tag="comment-post-icon"]');
    let sortButton = commentCountButton.cloneNode(true);
    sortButton.removeAttribute('data-tag');
    sortButton.removeAttribute('aria-label');
    sortButton.querySelector('p').textContent = 'Sort Comments';

    //replace button icon
    const svgContainer = sortButton.querySelector('svg').parentNode; //might be span or div depending on patreon page version
    svgContainer.querySelector('svg').remove();
    const newSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    newSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    newSvg.setAttribute("viewBox", "0 0 10 10");
    const newPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    newPath.setAttribute("d", "M2 0v6h-2l2.5 2 2.5-2h-2v-6h-1zm2 0v1h4v-1h-4zm0 2v1h3v-1h-3zm0 2v1h2v-1h-2z");
    newSvg.appendChild(newPath);
    svgContainer.appendChild(newSvg);
    sortButton.onclick = sortComments;
    commentCountButton.parentElement.appendChild(sortButton);
}
window.addEventListener('load', function() {
    setTimeout(loaded, 2000);
})
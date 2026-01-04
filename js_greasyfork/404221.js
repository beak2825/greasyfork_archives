// ==UserScript==
// @name         Twentysided Comment Collapser
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adds a button for collapsing comments.  Also supports auto-collapsing the comments of certain users.
// @author       Retsam
// @match        https://www.shamusyoung.com/twentysidedtale/?p=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404221/Twentysided%20Comment%20Collapser.user.js
// @updateURL https://update.greasyfork.org/scripts/404221/Twentysided%20Comment%20Collapser.meta.js
// ==/UserScript==

const usersToCollapseByDefault = [
    /* Add names here to collapse their comments by default.  e.g.: */
    // "Adolf Hitler"
];

const postId = Array.from(document.body.classList)
    .find(n => n.startsWith("postid-"));

// <a href="#" className="comment-body">[Comment Collapsed]</a>
const createCollapsedNode = () => {
    const el = document.createElement("a");
    el.href = "#";
    el.classList.add("comment-body");
    el.textContent = "[Comment Collapsed]";
    return el;
}

// <a href="#" style={marginLeft: 10px}>Hide</a>
const createHideLink = () => {
    const el = document.createElement("a");
    el.href = "#";
    el.style.marginLeft = "10px";
    el.textContent = "Hide";
    return el;
}

// store to persist state across reloads in localStorage
const KEY_PREFIX = "retsam-collapsed-comments-";

const collapsedComments = (() => {
    const savedCommentList = postId && localStorage.getItem(`${KEY_PREFIX}${postId}`);
    try {
        return new Set(JSON.parse(savedCommentList || '[]'));
    } catch(e) {
        return new Set([]);
    }
})();

const saveCollapsedCommentsList = () => {
    if(!postId) return;
    localStorage.setItem(`${KEY_PREFIX}${postId}`, JSON.stringify(Array.from(collapsedComments)));
}

const saveCommentCollapsed = (commentId) => {
    collapsedComments.add(commentId);
    saveCollapsedCommentsList();
}
const saveCommentExpanded = (commentId) => {
    collapsedComments.delete(commentId);
    saveCollapsedCommentsList();
}

const collapseComment = (comment) => {
    const commentBodyNode = comment.querySelector(".comment-body");
    const childrenNode = comment.querySelector(".children");
    const commentId = comment.id || "???";

    saveCommentCollapsed(commentId);

    if(!commentBodyNode) return;

    const collapsedNode = createCollapsedNode();
    const replacedChildren = childrenNode && document.createElement("div");
    commentBodyNode.replaceWith(collapsedNode);
    childrenNode && childrenNode.replaceWith(replacedChildren);

    collapsedNode.addEventListener("click", (e) => {
        e.preventDefault();
        saveCommentExpanded(commentId);
        collapsedNode.replaceWith(commentBodyNode);
        replacedChildren && replacedChildren.replaceWith(childrenNode);
    });
    return collapsedNode; // so the hide link can call "scroll into view"
}

(function() {
    'use strict';

    const $ = document.querySelectorAll.bind(document);
    const allComments = $(".comment");

    // Add a Hide button to each comment
    allComments.forEach(comment => {
        const replyFooter = comment.querySelector(".reply");
        if(!replyFooter) return;
        const hideLink = createHideLink();
        replyFooter.appendChild(hideLink);
        hideLink.addEventListener("click", e => {
            e.preventDefault();
            collapseComment(comment).scrollIntoView();
        });
    });

    allComments.forEach(comment => {
        // Collapse if found in previously collapsed comments list
        // Collapse certain users comments by default, if configured
        const authorNode = comment.querySelector(".comment-author cite");
        const authorIsMuted = authorNode && usersToCollapseByDefault.includes(authorNode.textContent);
        const commentWasCollapsed = collapsedComments.has(comment.id);
        if(authorIsMuted || commentWasCollapsed) {
            collapseComment(comment);
        }
    });
})();
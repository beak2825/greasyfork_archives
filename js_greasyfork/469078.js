// ==UserScript==
// @name         kbin BioSignature
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Adds a user's bio after their comments/posts as a signature
// @author       You
// @match        https://kbin.social/*
// @match        https://fedia.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469078/kbin%20BioSignature.user.js
// @updateURL https://update.greasyfork.org/scripts/469078/kbin%20BioSignature.meta.js
// ==/UserScript==
function fetchFullContent(url, callback) {
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function(response) {
            let parser = new DOMParser();
            let doc = parser.parseFromString(response.responseText, "text/html");
            let fullContent = doc.querySelector('.section--top .content');

            callback(fullContent);
        }
    });
}

function applyToPost(authors) {
    let post = document.querySelector('.entry--single');
    post.classList.add('has-signature');
    // Get author's name
    let authorName = post.querySelector('a.user-inline').innerHTML;

    if (authorName in authors) {
        addSignature(post, authors[authorName]);
        return
    }

    // Get author's page link
    let authorLink = post.querySelector('a.user-inline').href;

    fetchFullContent(authorLink, function(fullContent) {

        if (fullContent == null) {
            return;
        }
        authors[authorName] = fullContent.innerHTML;
        let content = post.querySelector('.entry__body');
        if (content) {
            content.innerHTML += '<hr>' + fullContent.innerHTML;
        } else {
            addSignature(post,fullContent.innerHTML);
        }
    });
}

function applyToNewComments(authors) {
    let comments = document.querySelectorAll('blockquote.entry-comment:not(.has-signature');
    for(let comment of comments) {

        comment.classList.add('has-signature');

        // Get author's name
        let authorName = ''
        if (comment.classList.contains('entry')) {
            authorName = comment.querySelector('entry aside.meta.entry__meta > a').innerHTML;
        } else {

            authorName = comment.querySelector('header a').innerHTML;
        }

        if (authorName in authors) {
            addSignature(comment, authors[authorName]);
            continue;
        }

        // Get author's page link
        let authorLink = comment.querySelector('header a').href;

        fetchFullContent(authorLink, function(fullContent) {

            if (fullContent == null) {
                return;
            }
            authors[authorName] = fullContent.innerHTML;
            addSignature(comment,fullContent.innerHTML);
        });
    }
}

async function addSignature(comment, signature) {
    let signatureDiv = await document.createElement('div');
    signatureDiv.className = 'signature';
    signatureDiv.innerHTML = '<hr>' + signature;
    signatureDiv.style = `grid-area: signature`;

    // Get comment's footer menu
    let menu = await comment.querySelector('footer menu');

    // Insert signature before menu
    await menu.parentNode.insertBefore(signatureDiv, menu);

    //comment.appendChild(signatureDiv);
}

//window.addEventListener('DOMContentLoaded', (event) => {

//});

function addStyles() {
    // Add styles to comments
    let styles = document.createElement('style');
    styles.innerHTML = `
    .signature p {
    margin-bottom: 0;
    }
    `;

    document.head.append(styles);
}

(function () {
    "use strict";

    let authors = {};

    // Check if page is user profile
    if (window.location.pathname.startsWith('/u/')) {
        return;
    }

    addStyles();
    applyToPost(authors);
    applyToNewComments(authors);

    // Observe for new posts
    let observer = new MutationObserver(applyToNewComments,authors);
    observer.observe(document.body, { childList: true, subtree: true });
  })();
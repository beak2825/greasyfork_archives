// ==UserScript==
// @name         8chan Nested Inline Reply
// @version      2.0.5
// @description  Make Nested Inline Reply like 4chanX
// @match        https://8chan.moe/*/res/*
// @match        https://8chan.se/*/res/*
// @grant        GM_addStyle
// @grant        GM.addStyle
// @license MIT
// @namespace https://greasyfork.org/users/1459581
// @downloadURL https://update.greasyfork.org/scripts/533331/8chan%20Nested%20Inline%20Reply.user.js
// @updateURL https://update.greasyfork.org/scripts/533331/8chan%20Nested%20Inline%20Reply.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .collapsible-container {
            margin-left: 20px;
            padding-left: 5px;
            margin-top: 8px;
        }
        .post-content.collapsed {
            display: none;
        }
        .altBacklinks {
            display: none !important;
        }
        .postCell.post-content {
            border: none !important;
        }
        .innerPost {
            width: auto;
            max-width: none !important;#474b53

        }
        .moved-post {
            position: relative;
            opacity: 0.9;
        }
        .linkQuote.toggled, .panelBacklinks a.toggled {
            color: #9a5;
        }
        .post-placeholder {
            display: none;
            padding: 5px;
            background: rgba(50, 50, 50, 0.3);
            border: 1px dashed #474b53;
            font-style: italic;
            color: #8c8c8c;
            text-align: center;
            margin: 5px 0;
        }
        .placeholder-visible {
            display: block;
        }
        .post-restored {
            border: 1px solid black;
        }
    `);

const movedPosts = new Map();
const linkContainers = new Map();
const originalPosts = new Map();

document.body.addEventListener('click', function(event) {
    const target = event.target;

    if (target.classList.contains('linkQuote') && event.ctrlKey) {
        const postId = target.href.match(/#q?(\d+)/)?.[1];
        if (postId && typeof qr !== 'undefined' && qr.showQr) {
            qr.showQr(postId);
            event.preventDefault();
            return;
        }
    }

    if (target.classList.contains('restore-post-link')) {
        event.preventDefault();
        const postId = target.dataset.postId;
        if (postId && movedPosts.has(postId)) {
            restorePost(postId);
        }
        return;
    }

    if ((target.parentNode && target.parentNode.classList.contains('panelBacklinks')) && !event.ctrlKey) {
        const link = target.closest('a');
        if (!link) return;

        const rawHash = link.hash.includes('?') ? link.hash.split('?')[0] : link.hash;
        const targetId = rawHash.substring(1).replace(/^q/, '');

        if (movedPosts.has(targetId)) {
            event.preventDefault();
            restorePost(targetId);
            return;
        }
    }

    if ((target.parentNode && target.parentNode.classList.contains('panelBacklinks'))) {
        event.preventDefault();

        const link = target.closest('a');
        if (!link) return;

        const rawHash = link.hash.includes('?') ? link.hash.split('?')[0] : link.hash;
        const targetId = rawHash.substring(1).replace(/^q/, '');

        if (linkContainers.has(link)) {
            const container = linkContainers.get(link);
            const content = container.querySelector('.post-content');

            if (content) {
                const wasCollapsed = content.classList.contains('collapsed');
                content.classList.toggle('collapsed');
                link.classList.toggle('toggled');

                if (!wasCollapsed && movedPosts.has(targetId)) {
                    const postData = movedPosts.get(targetId);
                    postData.links.delete(link);
                    if (postData.links.size === 0) {
                        restorePost(targetId);
                    }
                }
            }
            return;
        }

        if (!originalPosts.has(targetId)) {
            let targetPost = document.getElementById(targetId);
            if (!targetPost) return;
            originalPosts.set(targetId, targetPost);
        }

        let postToUse;

        if (movedPosts.has(targetId)) {
            postToUse = movedPosts.get(targetId).element;
        } else {
            postToUse = document.getElementById(targetId) || originalPosts.get(targetId);
            if (!postToUse) return;
        }

        const level = link.closest('.collapsible-container')?.dataset.level || 0;
        const container = document.createElement('div');
        container.className = 'collapsible-container';
        container.dataset.level = parseInt(level) + 1;

        movePostToContainer(targetId, postToUse, container, link);

        const postContainer = link.closest('.innerPost');
        if (postContainer) {
            postContainer.appendChild(container);
        } else {
            link.parentNode.insertBefore(container, link.nextSibling);
        }

        linkContainers.set(link, container);
        link.classList.add('toggled');
    }
});

function movePostToContainer(postId, postToUse, container, link) {
    if (movedPosts.has(postId)) {
        const postData = movedPosts.get(postId);
        const lightClone = postData.element.cloneNode(true);
        lightClone.classList.add('post-content', 'moved-post', 'post-restored'); // ← ADDED
        lightClone.setAttribute('data-original-id', postId);
        container.appendChild(lightClone);
        postData.links.add(link);
        return;
    }

    if (!document.getElementById(postId) && originalPosts.has(postId)) {
        const originalPost = originalPosts.get(postId);
        const clone = originalPost.cloneNode(true);
        clone.classList.add('post-content', 'moved-post', 'post-restored'); // ← ADDED
        clone.setAttribute('data-original-id', postId);
        container.appendChild(clone);
        const placeholder = document.createElement('div');
        placeholder.className = 'post-placeholder';
        movedPosts.set(postId, {
            element: clone,
            placeholder: placeholder,
            links: new Set([link])
        });
        return;
    }

    const placeholder = document.createElement('div');
    placeholder.className = 'post-placeholder placeholder-visible';
    placeholder.innerHTML = `Post moved <a href="#" class="restore-post-link" data-post-id="${postId}">Restore</a>`;
    postToUse.parentNode.insertBefore(placeholder, postToUse);
    postToUse.setAttribute('data-original-id', postId);
     const innerPost = postToUse.querySelector('.innerPost');
        if (innerPost) {
            innerPost.classList.add('post-restored');
        }
    container.appendChild(postToUse);
    movedPosts.set(postId, {
        element: postToUse,
        placeholder: placeholder,
        links: new Set([link])
    });
}

function restorePost(postId) {
    if (!movedPosts.has(postId)) return;

    const {element, placeholder, links} = movedPosts.get(postId);

    links.forEach(link => {
        if (linkContainers.has(link)) {
            const container = linkContainers.get(link);
            container.remove();
            linkContainers.delete(link);
            link.classList.remove('toggled', 'post-restored');
        }
    });

    document.querySelectorAll(`.moved-post[data-original-id="${postId}"]`).forEach(instance => {
        if (instance !== element) {
            instance.remove();
        }
    });

    if (placeholder.parentNode) {
        placeholder.parentNode.insertBefore(element, placeholder);
        placeholder.remove();
    }

    element.classList.remove('post-content', 'moved-post', 'post-restored');
    element.removeAttribute('data-original-id');
    const innerPost = element.querySelector('.innerPost');
        if (innerPost) {
            innerPost.classList.remove('post-restored');
        }

    movedPosts.delete(postId);

    if (!originalPosts.has(postId)) {
        originalPosts.set(postId, element);
    }
}




function cleanupBacklinks() {
    document.querySelectorAll('span.panelBacklinks a').forEach(link => {
        const href = link.getAttribute('href');
        if (href?.includes('#')) {
            link.href = `#${href.split('#')[1].split('?')[0]}`;
        }
    });
}

const observer = new MutationObserver((mutations) => {
    let shouldProcess = false;

    for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1 &&
                   (node.classList?.contains('post') ||
                    node.querySelector?.('.post, .linkQuote, .panelBacklinks'))) {
                    shouldProcess = true;
                    break;
                }
            }
            if (shouldProcess) break;
        }
    }

    if (shouldProcess) {
        cleanupBacklinks();
    }
});

const threadContainer = document.querySelector('.thread');
if (threadContainer) {
    observer.observe(threadContainer, { childList: true, subtree: true });
} else {
    observer.observe(document.body, { childList: true, subtree: false });
}

cleanupBacklinks();
})();
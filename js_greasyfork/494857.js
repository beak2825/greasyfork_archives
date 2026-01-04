// ==UserScript==
// @name           Ylilauta: Mikään ei järjesty
// @name:en        Ylilauta: Nothing will be organized
// @description    Palauttaa postausten numero-id:t, vastauslistat ja aikaleimat
// @description:en Restores some imageboard-like features to the Finnish forum, ylilauta.org
// @version        3.1.2
// @match          https://ylilauta.org/*
// @grant          GM_addStyle
// @run-at         document-start
// @license        MIT
// @namespace https://greasyfork.org/users/1285509
// @downloadURL https://update.greasyfork.org/scripts/494857/Ylilauta%3A%20Mik%C3%A4%C3%A4n%20ei%20j%C3%A4rjesty.user.js
// @updateURL https://update.greasyfork.org/scripts/494857/Ylilauta%3A%20Mik%C3%A4%C3%A4n%20ei%20j%C3%A4rjesty.meta.js
// ==/UserScript==

'use strict';

// --------------- ASETUKSET ---------------
// Muuttaa aikaleiman ulkonäköä
// - 'short'	5 t
// - 'long'		6.5.2024 klo 10.37.23
// - 'both'		6.5.2024 10.37.23 (5 t)
// - 'bothAlt'	6.5.2024 10.37.23 • 5 t
const timeStyle = 'both';

// Näytetäänkö alotuspostauksessa vastauslista
// - 'none'		ei näytetä
// - 'all'		näytetään kaikki
// - 'maxX'		Jos viittauksia on alle X, näytetään kaikki, muuten vain muissa langoissa olevat
const displayOPReplies = 'max10';

// --------------- --------- ---------------

const LANG = document.documentElement.lang;
const OP_REF = LANG === 'en' ? 'OP' : 'AP';
const REPLIES = LANG === 'en' ? 'Replies:' : 'Vastaukset:';
const YOU = LANG === 'en' ? ' (You)' : ' (Sinä)';

let supports_gm_addstyle = true;
try {
    GM_addStyle(`
        /* Compatibility with Custom CSS */
        .post.id-fixed :is(.ref, .post-meta .time) {
            &::before, &::after {
                content: none !important;
            }
        }

        .post-replies-list {
            margin: 8px;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            clear: both;
            z-index: 1;
            align-items: center;
            overflow: hidden;
            white-space: nowrap;
            align-self: flex-start;
            position: relative;
            padding-right: 8px;
            font-size: 0.8em;
            justify-content: start;
        }

        /* Hide the old replies button */
        .post-replies-list ~ .post-replies {
            display: none !important;
        }
    `);
} catch (e) {
    supports_gm_addstyle = false;
    console.warn('GM_addStyle is not supported by the current userscript extension', e);
}

// base62 ids are no longer used by ylis
const useNewIds = true;
const encode = (int) => int;
const decode = (str) => str;
/*
// Edited from https://github.com/base62/base62.js
const CHARSET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
function encode(int) {
    if (!(int > 1e7 && int < 1e10)) return int;

    var res = '';
    while (int > 0) {
        res = CHARSET[int % 62] + res;
        int = Math.floor(int / 62);
    }
    return res;
}
function decode(str) {
    var res = 0,
        length = str.length,
        i,
        char;
    if (length > 6 || length < 4) return str;

    for (i = 0; i < length; i += 1) {
        char = str.charCodeAt(i);
        if (char < 58) {
            char = char - 48;
        } else if (char < 91) {
            char = char - 55;
        } else {
            char = char - 61;
        }
        res += char * Math.pow(62, length - i - 1);
    }
    return res;
}
*/

function addRefLink(element, refId, isOP = false) {
    const isOwn = document.getElementById(`post-${refId}`)?.classList.contains('own');

    const ref = document.createElement('a');
    ref.classList = 'ref';
    ref.href = `/post/${refId}`;
    ref.dataset.postId = refId;
    ref.append(`≫${isOP ? OP_REF : useNewIds ? refId : decode(refId)}`);
    if (isOwn) ref.append(YOU);
    element.append(ref);
}

function addReplyToPost(post, ids) {
    if (!ids || ids.length === 0) return;

    let repliesElm = post.querySelector('.post-replies-list');
    let repliesBtn = repliesElm?.querySelector('button');
    if (!repliesElm) {
        repliesElm = document.createElement('footer');
        repliesElm.classList = 'post-replies-list';
        if (!supports_gm_addstyle) {
            repliesElm.style.margin = "8px";
            repliesElm.style.display = "flex";
            repliesElm.style.flexWrap = "wrap";
            repliesElm.style.gap = "8px";
            repliesElm.style.clear = "both";
            repliesElm.style.zIndex = "1";
            repliesElm.style.alignItems = "center";
            repliesElm.style.overflow = "hidden";
            repliesElm.style.whiteSpace = "nowrap";
            repliesElm.style.alignSelf = "flex-start";
            repliesElm.style.position = "relative";
            repliesElm.style.paddingRight = "8px";
            repliesElm.style.fontSize = "0.8em";
            repliesElm.style.justifyContent = "start";

            post.querySelectorAll(".post-replies").forEach(btn => btn.hidden = true);
        }

        repliesBtn = document.createElement('button');
        repliesBtn.classList = 'text-button';
        repliesBtn.textContent = REPLIES;
        repliesBtn.dataset.action = 'Post.expandReplies';

        repliesElm.dataset.postId = repliesBtn.dataset.postId = post.dataset.postIdNew;
        repliesElm.append(repliesBtn);
    }

    // Get new replies, make sure they are in base62
    const oldIds = new Set(repliesBtn.dataset.replies?.split(',').map(encode));
    const newIds = new Set(
        ids
            .filter((id) => !oldIds.has(id))
            .map(encode)
            .sort()
    );

    // Add links to new replies
    newIds.forEach((id) => addRefLink(repliesElm, id));

    if (!repliesElm.parentElement) post.querySelector('.post-message, .post > :last-child').after(repliesElm);

    // Update data-replies attributes
    const newData = [...oldIds, ...newIds].join(',');
    if (newData) repliesElm.dataset.replies = repliesBtn.dataset.replies = newData;
    return repliesElm;
}

// Fetches and appends list of replies to OP
const onOPRepliesClick = (e) => loadOPReplies(e.currentTarget.closest('.post'));
async function loadOPReplies(post) {
    if (displayOPReplies === 'none') return;
    if (!document.documentElement.classList.contains('page-thread')) return;
    const data = new FormData();
    data.append('post_id', post.dataset.postIdNew);

    // Get X-Csrf-Token from inline script that imports App.js
    for (const script of document.scripts) {
        const key = /\bnew\s+\w+\(["']\w*["'],\s*["'](\w+)["']/.exec(script.innerHTML)?.[1];
        if (!key) continue;

        const res = await fetch('https://ylilauta.org/api/community/post/replies', {
            method: 'POST',
            body: data,
            headers: { 'X-Csrf-Token': key },
        });
        if (!res.ok) throw new Error(`fetching OP replies: ${res.status}`);

        const json = await res.json();
        const ids = json.ids.map((id) => id.toString());
        const all = !(ids.length > +displayOPReplies.split('max')[1]);
        const rElm = addReplyToPost(post, all ? ids : ids.filter((id) => !document.getElementById(`post-${id}`)));
        if (rElm) rElm.addEventListener('click', onOPRepliesClick);
        return;
    }
    throw new Error('loading OP replies: X-Csrf-Token was not found in scripts');
}

function processPostRefs(postMessage, opId) {
    if (!postMessage) return;
    postMessage.querySelectorAll('.post-ref').forEach((refNode) => {
        const newRefNode = document.createDocumentFragment();
        const refId = refNode.dataset.postId;
        addRefLink(newRefNode, refId, refId === opId);
        refNode.replaceWith(newRefNode);
    });

    postMessage.querySelectorAll('.ref').forEach((refNode) => {
        refNode.classList.remove('enabled'); // Re-enables post-preview event listeners
        const refId = refNode.dataset.postId;
        const isOP = refId === opId;
        const isOwn = document.getElementById(`post-${refId}`)?.classList.contains('own');
        refNode.replaceChildren(`≫${isOP ? OP_REF : useNewIds ? refId : decode(refId)}`);
        if (isOwn) refNode.append(YOU);
    });
}

function processPost(post) {
    post.dataset.postIdNew = encode(post.dataset.postId);
    if (!post.classList.contains('id-fixed')) {
        const postMessage = post.querySelector('.post-message, .card-post .message');
        const opId = post.closest('.thread')?.querySelector('.op-post')?.dataset.postIdNew;
        processPostRefs(postMessage, opId);
        post.classList.add('id-fixed');

        // Add post id/reply link before timestamp
        const time = post.querySelector('.post-meta .time');
        if (!time) return;
        const id = document.createElement('a');
        id.classList = 'post-id';
        id.href = `/post/${post.dataset.postIdNew}`;
        id.dataset.action = 'Post.reply';
        id.dataset.postId = post.dataset.postIdNew;
        id.title = useNewIds ? post.dataset.postId : post.dataset.postIdNew;
        id.style.userSelect = 'initial';
        id.append(useNewIds ? post.dataset.postIdNew : post.dataset.postId);
        time.before(id, '•');

        // Add timestamp styling
        if (timeStyle !== 'short') {
            [time.textContent, time.title] = [time.title, time.textContent];
            time.removeAttribute('data-timestamp');

            if (timeStyle.startsWith('both')) {
                time.textContent = time.textContent.replace('klo ', '');
            }

            if (timeStyle === 'both') {
                time.append(` (${time.title})`);
            } else if (timeStyle === 'bothAlt') {
                const span = document.createElement('span');
                span.textContent = time.title;
                time.after('•', span);
            }
        }
    }

    // Fix replies list
    // Get the replies data from the original button
    const postRepliesBtn = post.querySelector('.post > .post-replies');
    addReplyToPost(post, postRepliesBtn?.dataset.replies.split(','));
}

// Update reply lists of posts parents
function processPostParents(post) {
    const postId = encode(post.dataset.postId);

    // Fix incorrect replies added by sopsy's code
    post.querySelectorAll('.post-message .post-ref .ref').forEach((ref) => {
        const rTo = document.getElementById(`post-${ref.dataset.postId}`);
        const rToReplies = rTo.querySelector('.post > .post-replies');
        if (!rToReplies?.dataset.replies) return;

        rToReplies.dataset.replies = rToReplies.dataset.replies.replaceAll(new RegExp(`,?${postId}`, 'g'), '');
        processPost(rTo);
    });

    // Update reply lists
    post.querySelectorAll('.post-message > :is(.ref, .post-ref)').forEach((ref) => {
        const rTo = document.getElementById(`post-${ref.dataset.postId}`);
        if (!rTo) return;

        // Add the reply directly when ylis hasn't fucked up the button
        // Or if the reply is to OP (ylis doesn't add replies to it)
        const rToReplies = rTo.querySelector('.post > .post-replies');
        if (
            !rToReplies?.dataset.replies?.includes(postId) &&
            (displayOPReplies === 'all' || !rTo.classList.contains('op-post'))
        ) {
            return addReplyToPost(rTo, [postId]);
        }

        // Fix the replies button
        processPost(rTo);
    });
}

// Update id refs in forms to base62
/*
const isPostForm = (form) => ['post-edit', 'post-form'].some((c) => form.classList.contains(c));
function onSubmit(e) {
    if (!isPostForm(e.target)) return;
    const msg = e.target.elements?.message;
    if (msg) msg.value = msg.value.replaceAll(/(?<=>>)\d+\b/g, encode);
}
window.addEventListener('submit', onSubmit, true);
*/

window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.post, .op-post').forEach(processPost);
    document.querySelectorAll('.op-post').forEach(loadOPReplies);

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType !== Node.ELEMENT_NODE) return;

                if (node.classList.contains('post')) {
                    if (!node.parentElement?.classList.contains('postpreview')) processPostParents(node);
                    processPost(node);
                } else if (['thread', 'post-replies-expanded'].some((c) => node.classList.contains(c))) {
                    node.querySelectorAll('.post').forEach(processPost);
                    /*
                } else if (!useNewIds && isPostForm(node)) {
                    const msg = node.querySelector('textarea[name="message"]');
                    if (!msg) return;

                    // Convert refs from base-62
                    msg.value = msg.value.replaceAll(/(?<=>>)[0-9A-Za-z]+\b/g, decode);
                    if (!node.classList.contains('post-edit')) {
                        // Remove duplicate refs from the end
                        msg.value = msg.value.replace(/^([\s\S]*(>>\d+\b)[\s\S]*?)\s*\2(\s*)$/, '$1$3');
                    }
                */
                }
            });

            // Update reply lists when a post is deleted
            mutation.removedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('post')) {
                    processPostParents(node);
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
});

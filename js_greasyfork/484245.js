// ==UserScript==
// @author      jvlflame
// @name        arca.live enhancements
// @version     0.0.8
// @license     MIT
// @include     https://arca.live/*
// @include     https://kioskloud.io/e/*
// @include     https://kiosk.ac/c/*
// @include     https://nahida.live/mods/*

// @description Adds quality of life improvements for browinsg and downloading Genshin Impact mods from arca.live

// @namespace https://greasyfork.org/users/63118
// @downloadURL https://update.greasyfork.org/scripts/484245/arcalive%20enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/484245/arcalive%20enhancements.meta.js
// ==/UserScript==


let GLOBAL_STYLES = `
    .vrow.column.head {
        height: initial !important;
    }

    .vrow.column {
        height: 135px !important;
    }

    .vrow.column.visited .vrow-inner {
        opacity: 0.4;
    }

    .vrow.column.visited .vrow-preview {
        opacity: 0.4;
    }


    .vrow-inner {
        padding-left: 115px;
    }

    .vrow-btn-group {
         position: absolute;
         bottom: 1rem;
         right: 1rem;
         display: flex;
         gap: 0.5rem;
         opacity: 0.7;
     }

     .vrow-info {
         position: absolute;
         top: 1rem;
         right: 1rem;
         display: flex;
         opacity: 0.7;
     }

    .vrow-preview {
        display: block !important;
        top: 10px !important;
    }

    .notice.column {
        height: 2.4rem !important;
    }

    .body .board-article .article-list .list-table a.vrow:visited {
        color: inherit !important;
        background-color: inherit !important;
    }

    .enh-action-bar {
        display: flex;
        padding: 0.5rem 0;
        gap: 0.5rem;
    }
`;

const CURRENT_URL = window.location.href;
const CURRENT_PAGE = window.location.pathname;
const IS_KIOSKLOUDIO = CURRENT_URL.includes('kioskloud.io');
const IS_KIOSKAC = CURRENT_URL.includes('kiosk.ac');
const IS_ARCALIVE = CURRENT_URL.includes('arca.live');
const IS_NAHIDALIVE = CURRENT_URL.includes('nahida.live');
const IS_POST_PAGE = CURRENT_PAGE.match(/\/b\/.*\/\d+/g);
const IS_LIST_PAGE = !IS_POST_PAGE;
const CATEGORY = CURRENT_PAGE.match(/\/b\/(\w+)/g);
const BASE64_REGEX = /^[-A-Za-z0-9+\/]*={0,3}$/g;
const VISITED_POSTS = getPostsFromLocalStorage(CATEGORY);

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = GLOBAL_STYLES;
document.head.appendChild(styleSheet);

function formatISODate(isoDateString) {
    const date = new Date(isoDateString);

    // Options for date formatting
    const options = {
        year: 'numeric', // Full year
        month: 'short', // Short month name (e.g., 'Aug')
        day: 'numeric', // Day of the month
    };

    // Format the date part
    const datePart = date.toLocaleString('en-US', options);

    // Format the time part (24-hour format)
    const timeOptions = {
        hour: '2-digit',  // Hour with leading zero
        minute: '2-digit', // Minute with leading zero
        hour12: false      // Use 24-hour time format
    };
    const timePart = date.toLocaleString('en-US', timeOptions);

    // Combine the date and time parts
    return `${datePart} ${timePart}`;
}


function getPostRows() {
    const table = document.getElementsByClassName("list-table table");

    // Get the list table row elements
    const rows = table[0].querySelectorAll("a.vrow.column");

    const postRows = [];

    for (const row of rows) {
           if (row.classList.contains("notice")) {
               continue;
           };

        postRows.push(row);
    }

    return postRows;
}

function getPost(id, title, unixTimestamp) {
    const dateTimeString = unixTimestamp ? new Date(unixTimestamp * 1000).toISOString() : new Date().toISOString();

    const post = {
        t: title,
        v: dateTimeString
    }

    return {
        id: id,
        post: post
    };
}

function getPostsFromLocalStorage(category) {
    const posts = JSON.parse(localStorage.getItem(`visited-posts-${category}`));
    return posts ? posts : {};
}

function isPostVisited(visitedPosts, id) {
    return visitedPosts[id];
}

function appendPostToLocalStorage(post, category) {
    const existingPosts = getPostsFromLocalStorage(category);
    existingPosts[post.id] = post.post;
    localStorage.setItem(`visited-posts-${category}`, JSON.stringify(existingPosts));
}

function appendPostsToLocalStorage(posts, category) {
    const existingPosts = getPostsFromLocalStorage(category);

    for (const post of posts) {
        existingPosts[post.id] = post.post;
    }

    localStorage.setItem(`visited-posts-${category}`, JSON.stringify(existingPosts));
}

function removePostFromLocalStorage(post, category) {
    const existingPosts = getPostsFromLocalStorage(category);
    delete existingPosts[post.id]
    localStorage.setItem(`visited-posts-${category}`, JSON.stringify(existingPosts));
}

function removePostsFromLocalStorage(posts, category) {
    const existingPosts = getPostsFromLocalStorage(category);

    for (const post of posts) {
        delete existingPosts[post.id]
    }

    localStorage.setItem(`visited-posts-${category}`, JSON.stringify(existingPosts));
}

function migrateRecentArticles() {
    if (!IS_ARCALIVE) {
        return;
    }

    /* recent_articles
        {
           boardName: string;
           slug: string;
           articleId: number;
           title: string;
           regdateAt: number
        }[]
    */

    const isMigrated = localStorage.getItem('migrated-timestamp');

    if (isMigrated) {
        return;
    }

    const nativeVisitedPosts = localStorage.getItem('recent_articles');

    if (!nativeVisitedPosts) {
        return;
    }

    for (const visitedPost of JSON.parse(nativeVisitedPosts)) {
        const post = getPost(visitedPost.articleId, visitedPost.title, visitedPost.regdateAt);
        const category = `/b/${visitedPost.slug}`;
        appendPostToLocalStorage(post, category);
    }

    localStorage.setItem('migrated-timestamp', new Date().toISOString());
}

function getAllPostsOnPage() {
    const rows = getPostRows();
    const posts = [];

    for (const row of rows) {
        const href = row.href;
        const id = href.split(/\/b\/\w+\//)[1].split(/\?/)[0];
        const titleElement = row.querySelectorAll(".title")[0];
        const title = titleElement ? titleElement.outerText : '';

        posts.push(getPost(id, title));
    }

    return posts;
}

function getPostOnPage(id) {
    const rows = getPostRows();
    const posts = [];

    for (const row of rows) {
        const href = row.href;
        const postId = href.split(/\/b\/\w+\//)[1].split(/\?/)[0];
        const titleElement = row.querySelectorAll(".title")[0];
        const title = titleElement ? titleElement.outerText : '';

        if (id === postId) {
            posts.push(getPost(postId, title));
        }
    }

    return posts;
}

function handleMarkPageAsRead() {
    const posts = getAllPostsOnPage();
    appendPostsToLocalStorage(posts, CATEGORY);
}

function handleMarkPageAsUnread() {
    const posts = getAllPostsOnPage();
    removePostsFromLocalStorage(posts, CATEGORY);
}

function handleMarkAsRead(id) {
    const posts = getPostOnPage(id);
    appendPostsToLocalStorage(posts, CATEGORY);
}

function handleMarkAsUnread(id) {
    const posts = getPostOnPage(id);
    removePostsFromLocalStorage(posts, CATEGORY);
}

function createBtnElement(text, handler) {
    const btnElement = document.createElement('button');
    btnElement.classList.add("btn", "btn-sm", "btn-arca");
    btnElement.textContent = text;
    btnElement.onclick = handler;
    return btnElement;
}

function createActionBarElement() {
    const actionBarElement = document.createElement('div');
    actionBarElement.classList.add('enh-action-bar');
    return actionBarElement;
}

function createMarkPageAsReadBtn(parentElement) {
    const btnElement = createBtnElement('Mark page as read', handleMarkPageAsRead);
    parentElement.prepend(btnElement);
}

function createRowInfo(parentElement, posts, rowId) {
    const infoElement = document.createElement('div');
    infoElement.classList.add('vrow-info');
    const postData = posts[rowId];

    if (postData) {
        infoElement.innerHTML += formatISODate(postData.v);
    }
    parentElement.append(infoElement);
    return infoElement;
}

function createRowButtonGroup(parentElement) {
    const buttonGroupElement = document.createElement('div');
    buttonGroupElement.classList.add('vrow-btn-group');
    parentElement.append(buttonGroupElement);
    return buttonGroupElement;
}

function createMarkPageAsUnreadBtn(parentElement) {
    const btnElement = createBtnElement('Mark page as unread', handleMarkPageAsUnread);
    parentElement.prepend(btnElement);
}

function createMarkRowAsReadBtn(parentElement, rowId, rowElement) {
    const btnElement = createBtnElement('Mark as read', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleMarkAsRead(rowId);
        rowElement.classList.add('visited');

        const infoElement = rowElement.querySelector('.vrow-info');
        if (infoElement) {
            infoElement.innerHTML = formatISODate(new Date().toISOString());
        }
    });
    parentElement.append(btnElement);
    return btnElement;
}


function createMarkRowAsUnreadBtn(parentElement, rowId, rowElement) {
    const btnElement = createBtnElement('Mark as unread', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleMarkAsUnread(rowId);
        rowElement.classList.remove('visited');

        const infoElement = rowElement.querySelector('.vrow-info');
        if (infoElement) {
            infoElement.innerHTML = ''
        }
    });
    parentElement.append(btnElement);
    return btnElement;
}

function createActionBar() {
    const topActionBarElement = createActionBarElement();
    const bottomActionBarElement = createActionBarElement();
    const listElement = document.querySelector('.article-list');

    listElement.prepend(topActionBarElement);
    listElement.appendChild(bottomActionBarElement);

    for (const parentElement of [topActionBarElement, bottomActionBarElement]) {
        createMarkPageAsUnreadBtn(parentElement);
        createMarkPageAsReadBtn(parentElement);
    }
}

function addArcaRowEnhancements() {
    const rows = getPostRows();
    const posts = getPostsFromLocalStorage(CATEGORY);

    for (const row of rows) {
        const previewElement = row.querySelectorAll('.vrow-preview');
        const hasPreview = Boolean(previewElement[0])

        if (!hasPreview) {
            const dummyPreviewElement = document.createElement('div');
            dummyPreviewElement.classList.add('vrow-preview');
            row.appendChild(dummyPreviewElement);
        }

        const href = row.href;

        // Remove the query string so it's easier to copy article id when archiving
        const hrefWithoutQuery = href.split('?')[0];
        row.setAttribute("href", hrefWithoutQuery);
        row.style.position = "relative";

        const id = href.split(/\/b\/\w+\//)[1].split(/\?/)[0];
        const titleElement = row.querySelectorAll(".title")[0];
        const title = titleElement ? titleElement.outerText : '';

        const isVisited = isPostVisited(VISITED_POSTS, id);

        const rowInfoElement = createRowInfo(row, posts, id);
        const rowButtonGroup = createRowButtonGroup(row);
        const markRowAsReadBtn = createMarkRowAsReadBtn(rowButtonGroup, id, row);
        const markRowAsUnreadBtn = createMarkRowAsUnreadBtn(rowButtonGroup, id, row);


        if (isVisited) {
            row.classList.add("visited");
        } else {
            row.addEventListener("click", (e) => {
                if (e.button === 2) return;
                const post = getPost(id, title);
                appendPostToLocalStorage(post, CATEGORY);
                row.classList.add('visited');
                rowInfoElement.innerHTML = formatISODate(new Date().toISOString());
            });

            row.addEventListener("auxclick", () => {
                const post = getPost(id, title);
                appendPostToLocalStorage(post, CATEGORY);
                row.classList.add('visited');
                rowInfoElement.innerHTML = formatISODate(new Date().toISOString());
            });
        }
    }
}


if (IS_ARCALIVE && IS_LIST_PAGE) {
    createActionBar();
    addArcaRowEnhancements();
}

if (IS_ARCALIVE && IS_POST_PAGE) {
    addArcaRowEnhancements();
    const title = document.querySelectorAll(".title-row .title")[0].outerText;
    const id = CURRENT_PAGE.split(/\/b\/\w+\//)[1].split(/\?/)[0];
    const post = getPost(id, title);

    // Attempt to automatically decode base64 links inside the article content
    const articleContentElement = document.querySelector(".fr-view.article-content");
    const textBlocks = articleContentElement.querySelectorAll("p");

    for (const text of textBlocks) {
        const innerText = text.innerText;
        const isBase64 = innerText.match(BASE64_REGEX);

        if (isBase64) {
            const decoded = atob(innerText);
            const linkElement = document.createElement('a');
            const brElement = document.createElement('br');
            linkElement.setAttribute('href', decoded);
            linkElement.textContent += decoded;
            text.appendChild(brElement);
            text.appendChild(linkElement);
        }
    }


    if (isPostVisited(VISITED_POSTS, id)) {
        return;
    };

    appendPostToLocalStorage(post, CATEGORY);
}

/* nahida.live doesn't use a form for submit, but rather uses a value prop to read the password input. Any changes to the input value does not reflect on the value which prevents us from setting the value programatically
if (IS_NAHIDALIVE) {
    const DEFAULT_PASSWORD = localStorage.getItem('default-password');
    const passwordInputElement = document.querySelector('input[placeholder="Password"]');

    const defaultPasswordInputElement = document.createElement('input');
    defaultPasswordInputElement.type = 'text';
    defaultPasswordInputElement.placeholder = 'Enter default password';
    defaultPasswordInputElement.classList.add('flex', 'h-10', 'w-full', 'rounded-md', 'border', 'border-input', 'bg-background', 'ring-offset-background', 'file:border-0', 'file:bg-transparent', 'file:text-sm', 'file:font-medium', 'placeholder:text-muted-foreground', 'focus-visible:outline-none', 'focus-visible:ring-2', 'focus-visible:ring-ring', 'focus-visible:ring-offset-2', 'disabled:cursor-not-allowed', 'disabled:opacity-50', 'px-2', 'py-1', 'mb-2', 'max-w-[210px]', 'text-base');
    defaultPasswordInputElement.style.position = 'absolute';
    defaultPasswordInputElement.style.height = '50px';
    defaultPasswordInputElement.style.top = '0.375rem';
    defaultPasswordInputElement.style.left = '6.5rem';
    defaultPasswordInputElement.style.zIndex = '500';
    defaultPasswordInputElement.value = DEFAULT_PASSWORD;

    const bodyElement = document.querySelector('body');
    bodyElement.appendChild(defaultPasswordInputElement);

    defaultPasswordInputElement.addEventListener("input", (e) => {
        localStorage.setItem('default-password', e.currentTarget.value || '');
    })

    if (DEFAULT_PASSWORD) {
        passwordInputElement.value = DEFAULT_PASSWORD;
        const submitBtnElement = document.querySelector('section').querySelector('button')
        submitBtnElement.click();
    }
}
*/

if (IS_KIOSKLOUDIO) {
    const DEFAULT_PASSWORD = localStorage.getItem('default-password');
    const passwordInputElement = document.querySelector('.swal2-input');
    const autoSubmitToggleElement = document.createElement('button');

    const defaultPasswordInputElement = document.createElement('input');
    defaultPasswordInputElement.type = 'text';
    defaultPasswordInputElement.placeholder = 'Enter default password';
    defaultPasswordInputElement.classList.add('swal2-input');
    defaultPasswordInputElement.value = DEFAULT_PASSWORD;
    passwordInputElement.after(defaultPasswordInputElement);

    defaultPasswordInputElement.addEventListener("input", (e) => {
        localStorage.setItem('default-password', e.currentTarget.value || '');
    })

    if (DEFAULT_PASSWORD) {
        passwordInputElement.value = DEFAULT_PASSWORD;
        const submitBtnElement = document.querySelector('.swal2-actions').querySelector('.swal2-confirm');
        submitBtnElement.click();
    }
}


if (IS_KIOSKAC) {
    const DEFAULT_PASSWORD = localStorage.getItem('default-password');
    const passwordInputElement = document.querySelector('input[placeholder="Password"]');

    const defaultPasswordInputElement = document.createElement('input');
    defaultPasswordInputElement.type = 'text';
    defaultPasswordInputElement.placeholder = 'Enter default password';
    defaultPasswordInputElement.classList.add('input', 'shadow-xl', 'flex-grow');
    defaultPasswordInputElement.value = DEFAULT_PASSWORD;
    passwordInputElement.after(defaultPasswordInputElement);

    defaultPasswordInputElement.addEventListener("input", (e) => {
        localStorage.setItem('default-password', e.currentTarget.value || '');
    })

    if (DEFAULT_PASSWORD) {
        passwordInputElement.value = DEFAULT_PASSWORD;
        const submitBtnElement = document.querySelector('.btn.btn-ghost.w-full.mt-2.rounded-md');
        submitBtnElement.click();

        setTimeout(() => {
            const dropdownElement = document.querySelector('.dropdown-menu');
            const defaultDownloadBtn = dropdownElement.querySelector('button');
            defaultDownloadBtn.click();
        }, 1000);
    }
}

migrateRecentArticles();

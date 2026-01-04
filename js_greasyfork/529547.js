// ==UserScript==
// @name         GGn Staff PM to Forum Post
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Convert old staff PMs into forum posts
// @author       tesnonwan
// @match        https://gazellegames.net/staffpm.php?action=viewconv&id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gazellegames.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529547/GGn%20Staff%20PM%20to%20Forum%20Post.user.js
// @updateURL https://update.greasyfork.org/scripts/529547/GGn%20Staff%20PM%20to%20Forum%20Post.meta.js
// ==/UserScript==

const ITEM_FORUM_ID = 87;

const staffPmId = new URL(location.href).searchParams.get('id');
const threadTitle = document.querySelector('.header h2').textContent.slice(11);

function getPmPosts(doc) {
    const inbox = doc.querySelector('#inbox');
    const headers = inbox.querySelectorAll(':scope > .box .head');
    const posts = [];
    for (const header of headers) {
        const quoteBox = header.querySelector('a[class="brackets"]');
        const quoteFn = quoteBox.getAttribute('onclick');
        const messageId = +(/Quote\('([0-9]+)'/.exec(quoteFn)[1])
        const time = header.querySelector(':scope > span').title;
        const user = header.querySelector('.username').textContent;
        posts.push({messageId, time, user});
    }
    return posts;
}

function getAuthAndId(doc) {
    const createForm = doc.querySelector('.create_form');
    return {
        auth: createForm.elements.auth.value,
        idToken: createForm.elements.id_token.value,
    };
}

function makeStatusDiv() {
    const statusDiv = document.createElement('div');
    statusDiv.style.width = '100%';
    statusDiv.style.textAlign = 'left';
    statusDiv.style.padding = '5px 25px 5px 25px';
    statusDiv.style.border = '1px solid lightblue';
    statusDiv.style.boxSizing = 'border-box';
    statusDiv.style.fontWeight = 'bold';
    return statusDiv;
}

function addStatus(div, line, isUpdate = false) {
    div.innerHTML += `${isUpdate ? '' : '<br/>'}${line}`;
}

function setStatus(div, statusText) {
    div.innerHTML = statusText;
}

function getStatus(div) {
    return div.innerHTML;
}

function addFailure(div) {
    addStatus(div, '<span style="color:red">Failed!</span>', /* isUpdate= */ true);
}

function addSuccess(div) {
    addStatus(div, '<span style="color:green">Success!</span>', /* isUpdate= */ true);
}

async function changeResolveState(resolve) {
    const action = resolve ? 'resolve' : 'unresolve';
    return fetch(`staffpm.php?action=${action}&id=${staffPmId}`, {
        method: 'GET',
        includeCredentials: true,
    }).then(async (r) => {
        return r.status === 200;
    });
}

async function getDocFromUrl(url) {
    return fetch(url, {
        method: 'GET',
        includeCredentials: true,
    }).then(async (r) => {
        if (r.status === 200) {
            return (new DOMParser()).parseFromString(await r.text(), 'text/html');
        }
        return null;
    });
}

async function getPmThreadDoc() {
    return getDocFromUrl(`staffpm.php?action=viewconv&id=${staffPmId}`);
}

async function getNewPostDoc() {
    return getDocFromUrl(`forums.php?action=new&forumid=${ITEM_FORUM_ID}`);
}

async function getTextForPm(pmId) {
    return fetch(`staffpm.php?action=get_post&post=${pmId}`, {
        method: 'GET',
        includeCredentials: true,
    }).then(async (r) => {
        if (r.status === 200) {
            return await r.text();
        }
        return null;
    });
}

function postsToForumText(posts) {
    const lines = [`Archived from Staff PM: ${location.href}\n`];
    for (const post of posts) {
        lines.push(`\n[color=Orange][b]${post.user} at ${post.time} said:[/b][/color]\n`);
        lines.push(post.text);
    }
    return lines.join('\n');
}

async function postNewThread(postTitle, postText, idToken, auth) {
    return fetch(`forums.php?action=new&forumid=87`, {
        method: 'POST',
        includeCredentials: true,
        body: new URLSearchParams({
            action: "new",
            auth: auth,
            forum: ITEM_FORUM_ID,
            id_token: idToken,
            title: postTitle,
            body: postText,
        }),
    }).then((r) => {
        if (r.status !== 200) {
            return null;
        }
        return r.url;
    });
}

function addConvertButton() {
    const convertButton = document.createElement('button');
    convertButton.type = 'button';
    convertButton.textContent = 'Convert to Forum Post';
    convertButton.style.margin = '10px 3px';
    convertButton.style.padding = '5px';
    convertButton.style.height = '30px';
    const manageForm = document.querySelector('.manage_form');
    manageForm.appendChild(convertButton);
    convertButton.addEventListener('click', async () => {
        const statusDiv = makeStatusDiv();
        manageForm.appendChild(statusDiv);
        addStatus(statusDiv, 'Unresolving PM... ');
        const unresolveSuccess = await changeResolveState(/* resolve= */ false);
        if (!unresolveSuccess) {
            addFailure(statusDiv);
            return;
        }
        addSuccess(statusDiv);
        addStatus(statusDiv, 'Fetching PM thread... ');
        const doc = await getPmThreadDoc();
        if (!doc) {
            addFailure(statusDiv);
            return;
        }
        addSuccess(statusDiv);
        const posts = getPmPosts(doc);
        addStatus(statusDiv, 'Loading PM texts... ');
        const postCount = posts.length;
        const origStatus = getStatus(statusDiv)
        const statusText = `${origStatus}{0}/${postCount}`;
        for (const [idx, post] of posts.entries()) {
            setStatus(statusDiv, statusText.replace('{0}', idx + 1));
            const postText = await getTextForPm(post.messageId);
            if (!postText) {
                setStatus(statusDiv, origStatus);
                addFailure(statusDiv);
                return;
            }
            post.text = postText;
            await new Promise((resolve) => {
                window.setTimeout(resolve, 1500);
            });
        }
        addStatus(statusDiv, 'Loading new topic page... ');
        const newTopicDoc = await getNewPostDoc();
        if (!newTopicDoc) {
            addFailure(statusDiv);
            return;
        }
        addSuccess(statusDiv);
        const {auth, idToken} = getAuthAndId(newTopicDoc);
        const postTitle = `Archived Staff PM: ${threadTitle}`;
        addStatus(statusDiv, 'Adding new post... ');
        const threadUrl = await postNewThread(postTitle, postsToForumText(posts), idToken, auth);
        if (!threadUrl) {
            addFailure(statusDiv);
            return;
        }
        addStatus(statusDiv, `<a href="${threadUrl}">Thread Created</a>`, /* isUpdate= */ true);
        addStatus(statusDiv, 'Resolving PM... ');
        const resolveSuccess = await changeResolveState(/* resolve= */ true);
        if (resolveSuccess) {
            addSuccess(statusDiv);
        } else {
            addFailure(statusDiv);
        }
    });
}

addConvertButton();
// ==UserScript==
// @name         Reddit Crosspost Restorer
// @version      3
// @description  Box to view crossposts
// @author       raidprincess
// @match        https://www.reddit.com/*
// @match        https://sh.reddit.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      old.reddit.com
// @namespace https://greasyfork.org/users/1451877
// @downloadURL https://update.greasyfork.org/scripts/535516/Reddit%20Crosspost%20Restorer.user.js
// @updateURL https://update.greasyfork.org/scripts/535516/Reddit%20Crosspost%20Restorer.meta.js
// ==/UserScript==

(function() {
'use strict';

let duplicatesData = [];
let viewCrosspostButton = null;
let popup = null;
let isDarkMode = GM_getValue('isDarkMode', true);
let customLinkColor = GM_getValue('customLinkColor', '#f7b500');

function getPostInfo() {
    const pathParts = window.location.pathname.split('/');
    const idx = pathParts.indexOf('comments');
    if (idx !== -1 && pathParts.length > idx + 1) {
        return { subreddit: pathParts[idx - 1], postid: pathParts[idx + 1] };
    }
    return null;
}

function createViewCrosspostButton() {
    if (viewCrosspostButton) return;

    const existingButton = document.getElementById('view-crosspost-button');
    if (existingButton) existingButton.remove();

    viewCrosspostButton = document.createElement('span');
    viewCrosspostButton.id = 'view-crosspost-button';
    viewCrosspostButton.style.fontSize = '14px';
    viewCrosspostButton.style.marginLeft = '10px';
    viewCrosspostButton.style.cursor = 'pointer';
    viewCrosspostButton.style.color = customLinkColor;
    viewCrosspostButton.style.textDecoration = 'underline';
    viewCrosspostButton.addEventListener('click', togglePopup);

    const titleElement = document.querySelector('h1');
    if (titleElement && titleElement.parentElement) {
        titleElement.parentElement.appendChild(viewCrosspostButton);
    }
}

function createPopup() {
    if (popup) return;

    popup = document.createElement('div');
    popup.id = 'duplicates-popup';
    applyPopupStyles();

    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';

    const title = document.createElement('div');
    title.innerText = 'Other Reddit Discussions';
    title.style.fontWeight = 'bold';
    title.style.fontSize = '16px';

    const controls = document.createElement('div');
    controls.style.display = 'flex';
    controls.style.alignItems = 'center';
    controls.style.gap = '6px';

    const modeToggle = document.createElement('div');
    modeToggle.innerText = isDarkMode ? '⚫' : '⚪';
    modeToggle.style.cursor = 'pointer';
    modeToggle.addEventListener('click', () => {
        toggleMode();
        modeToggle.innerText = isDarkMode ? '⚫' : '⚪';
    });

    const colorPickerIcon = document.createElement('div');
    colorPickerIcon.innerText = '🖉';
    colorPickerIcon.style.cursor = 'pointer';
    colorPickerIcon.style.fontSize = '16px';
    colorPickerIcon.addEventListener('click', () => {
        colorInput.click();
    });

    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = customLinkColor;
    colorInput.style.display = 'none';
    colorInput.addEventListener('input', (e) => {
        customLinkColor = e.target.value;
        GM_setValue('customLinkColor', customLinkColor);
        updatePopupContent();
        if (viewCrosspostButton) viewCrosspostButton.style.color = customLinkColor;
    });

    controls.appendChild(modeToggle);
    controls.appendChild(colorPickerIcon);
    header.appendChild(title);
    header.appendChild(controls);
    popup.appendChild(header);
    popup.appendChild(colorInput);

    const content = document.createElement('div');
    content.id = 'duplicates-content';
    content.innerText = 'Loading...';
    popup.appendChild(content);

    document.body.appendChild(popup);

    document.addEventListener('click', (e) => {
        if (popup && !popup.contains(e.target) && e.target !== viewCrosspostButton) {
            popup.style.display = 'none';
        }
    });

    positionPopup();
}

function applyPopupStyles() {
    if (!popup) return;
    Object.assign(popup.style, {
        position: 'absolute',
        width: '320px',
        maxHeight: '400px',
        overflowY: 'auto',
        border: '1px solid #333',
        borderRadius: '6px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
        padding: '10px',
        zIndex: '10000',
        display: 'none',
        backgroundColor: isDarkMode ? '#1b1b1b' : '#f6f7f8',
        color: isDarkMode ? '#fff' : '#000'
    });
}

function positionPopup() {
    if (!viewCrosspostButton || !popup) return;
    const rect = viewCrosspostButton.getBoundingClientRect();
    popup.style.top = (window.scrollY + rect.bottom + 5) + 'px';
    popup.style.left = (window.scrollX + rect.left) + 'px';
}

function toggleMode() {
    isDarkMode = !isDarkMode;
    GM_setValue('isDarkMode', isDarkMode);
    applyPopupStyles();
    updatePopupContent();
}

function togglePopup() {
    if (!popup) return;
    if (popup.style.display === 'none') {
        positionPopup();
        popup.style.display = 'block';
    } else {
        popup.style.display = 'none';
    }
}

function fetchDuplicates(subreddit, postid) {
    const url = `https://old.reddit.com/r/${subreddit}/duplicates/${postid}/`;
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: function(response) {
            if (response.status === 200) {
                parseDuplicates(response.responseText, postid);
            } else {
                updateContentNoResults();
            }
        }
    });
}

function parseDuplicates(html, currentPostId) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const posts = doc.querySelectorAll('#siteTable .thing.link');

    if (!posts.length) return;

    duplicatesData = [];
    const currentFullname = 't3_' + currentPostId;

    posts.forEach(postDiv => {
        const postId = postDiv.getAttribute('data-fullname');
        if (!postId || postId === currentFullname) return;

        const a = postDiv.querySelector('a.title');
        const commentsLink = postDiv.querySelector('a.comments');
        const subreddit = postDiv.getAttribute('data-subreddit') || 'Unknown Sub';

        if (!a || !commentsLink) return;

        const postTitle = a.textContent.trim();
        let postPermalink = commentsLink.href;
        postPermalink = postPermalink.replace('old.reddit.com', 'www.reddit.com');

        duplicatesData.push({ title: postTitle, url: postPermalink, subreddit });
    });

    if (duplicatesData.length) {
        createViewCrosspostButton();
        viewCrosspostButton.innerText = `View discussions in ${duplicatesData.length} other${duplicatesData.length > 1 ? ' communities' : ' community'}`;
        createPopup();
        updatePopupContent();
    }
}

function updateContentNoResults() {
    const content = document.getElementById('duplicates-content');
    if (content) {
        content.innerHTML = '<i>No crossposts found.</i>';
    }
}

function updatePopupContent() {
    const content = document.getElementById('duplicates-content');
    if (!content) return;

    const ul = document.createElement('ul');
    ul.style.paddingLeft = '0';
    ul.style.margin = '0';
    ul.style.listStyle = 'none';

    duplicatesData.forEach(post => {
        const li = document.createElement('li');
        li.style.marginBottom = '8px';

        const sub = document.createElement('div');
        sub.textContent = `r/${post.subreddit}`;
        sub.style.fontSize = '12px';
        sub.style.color = shadeColor(customLinkColor, -30);

        const a = document.createElement('a');
        a.href = post.url;
        a.textContent = post.title;
        a.target = '_blank';
        a.style.color = customLinkColor;
        a.style.textDecoration = 'none';
        a.addEventListener('mouseover', () => a.style.textDecoration = 'underline');
        a.addEventListener('mouseout', () => a.style.textDecoration = 'none');

        li.appendChild(sub);
        li.appendChild(a);

        const line = document.createElement('hr');
        line.style.border = 'none';
        line.style.borderTop = '1px solid #444';
        line.style.margin = '6px 0';

        ul.appendChild(li);
        ul.appendChild(line);
    });

    content.innerHTML = '';
    content.appendChild(ul);
}

function shadeColor(color, percent) {
    let num = parseInt(color.slice(1), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        G = (num >> 8 & 0x00FF) + amt,
        B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255? (R<1?0:R):255)*0x10000 + (G<255? (G<1?0:G):255)*0x100 + (B<255? (B<1?0:B):255)).toString(16).slice(1);
}

function monitorPageChanges() {
    let lastUrl = location.href;
    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            duplicatesData = [];
            if (popup) popup.remove();
            popup = null;
            viewCrosspostButton = null;
            waitForPost();
        }
    }).observe(document, { subtree: true, childList: true });
}

function waitForPost() {
    const info = getPostInfo();
    if (info) {
        fetchDuplicates(info.subreddit, info.postid);
    } else {
        setTimeout(waitForPost, 500);
    }
}

waitForPost();
monitorPageChanges();

})();
// ==UserScript==
// @license MIT
// @name         划词查找
// @namespace    JMY114514
// @version      2.0
// @description  实现一个划词查找功能的油猴插件，在页面上划选文字时，自动弹出查找框并搜索选中文字，并提供是否跳转至搜索结果页面的选择，方便用户操作。同时还会显示一个提示框，告知用户已经执行了搜索操作。如果用户没有点击确认或取消，则不会进行任何操作。如需跳转，请在提示框中点击“确认”按钮；如不跳转，请点击“取消”按钮或勾选“不再询问”，下次不再弹出提示框。本插件将选中的文字高亮显示。
// @author       JMY114514
// @match        *://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/466579/%E5%88%92%E8%AF%8D%E6%9F%A5%E6%89%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/466579/%E5%88%92%E8%AF%8D%E6%9F%A5%E6%89%BE.meta.js
// ==/UserScript==
// @license MIT
GM_addStyle(`
    .highlight {
        background-color: yellow !important;
    }
`);

let autoRedirect = false;
let noPrompt = false;

function doSearch(selectedText) {
    let searchUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(selectedText)}`;
    highlightSelection();
    if (autoRedirect) {
        window.location.href = searchUrl;
    } else {
        showConfirmation(`是否跳转到百度搜索 "${selectedText}" 的结果页？`, searchUrl);
    }
    showNotification(`已搜索 "${selectedText}"`);
}

document.addEventListener('mouseup', function(e) {
    let selection = window.getSelection().toString().trim();
    if (selection.length > 0) {
        doSearch(selection);
    } else {
        removeHighlight();
        hideNotification();
    }
});

function highlightSelection() {
    removeHighlight();
    let span = document.createElement('span');
    span.classList.add('highlight');
    window.getSelection().getRangeAt(0).surroundContents(span);
}

function removeHighlight() {
    let highlights = document.querySelectorAll('.highlight');
    highlights.forEach(function(highlight) {
        let parent = highlight.parentNode;
        parent.replaceChild(highlight.firstChild, highlight);
        parent.normalize();
    });
}

let notification, confirmation;

function createNotification() {
    if (notification) return;
    notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.right = '30px';
    notification.style.bottom = '30px';
    notification.style.padding = '10px';
    notification.style.backgroundColor = '#333';
    notification.style.color = '#fff';
    notification.style.fontWeight = 'bold';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
    document.body.appendChild(notification);
}

function showNotification(message) {
    createNotification();
    notification.innerText = message;
    clearTimeout(notification.timer);
    notification.style.opacity = 1;
    notification.timer = setTimeout(function() {
        hideNotification();
    }, 3000);
}

function hideNotification() {
    if (!notification) return;
    notification.style.opacity = 0;
    clearTimeout(notification.timer);
    notification.timer = setTimeout(function() {
        notification.remove();
        notification = null;
    }, 1000);
}

function createConfirmation() {
    if (confirmation) return;
    confirmation = document.createElement('div');
    confirmation.style.position = 'fixed';
    confirmation.style.top = '50%';
    confirmation.style.left = '50%';
    confirmation.style.transform = 'translate(-50%, -50%)';
    confirmation.style.padding = '20px';
    confirmation.style.backgroundColor = '#fff';
    confirmation.style.color = '#333';
    confirmation.style.fontWeight = 'bold';
    confirmation.style.borderRadius = '5px';
    confirmation.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
    document.body.appendChild(confirmation);

    let title = document.createElement('div');
    title.style.fontSize = '16px';
    title.style.marginBottom = '10px';
    title.innerText = '确认跳转';

    let message = document.createElement('div');
    message.style.fontSize = '14px';
    message.style.marginBottom = '20px';

    let cancelBtn = document.createElement('button');
    cancelBtn.style.display = 'inline-block';
    cancelBtn.style.padding = '5px 20px';
    cancelBtn.style.backgroundColor = '#ccc';
    cancelBtn.style.color = '#fff';
    cancelBtn.style.borderRadius = '5px';
    cancelBtn.style.border = 'none';
    cancelBtn.style.marginRight = '20px';
    cancelBtn.innerText = '取消';

    let confirmBtn = document.createElement('button');
    confirmBtn.style.display = 'inline-block';
    confirmBtn.style.padding = '5px 20px';
    confirmBtn.style.backgroundColor = '#333';
    confirmBtn.style.color = '#fff';
    confirmBtn.style.borderRadius = '5px';
    confirmBtn.style.border = 'none';
    confirmBtn.innerText = '确认';

    let noPromptCheckbox = document.createElement('input');
    noPromptCheckbox.type = 'checkbox';
    noPromptCheckbox.id = 'no-prompt-checkbox';
    noPromptCheckbox.style.marginRight = '10px';
    noPromptCheckbox.addEventListener('change', function() {
        noPrompt = noPromptCheckbox.checked;
    });

    let noPromptLabel = document.createElement('label');
    noPromptLabel.setAttribute('for', 'no-prompt-checkbox');
    noPromptLabel.innerText = '不再询问';

    confirmation.appendChild(title);
    confirmation.appendChild(message);
    confirmation.appendChild(noPromptCheckbox);
    confirmation.appendChild(noPromptLabel);
    confirmation.appendChild(cancelBtn);
    confirmation.appendChild(confirmBtn);

    cancelBtn.addEventListener('click', function() {
        hideConfirmation();
    });

    confirmBtn.addEventListener('click', function() {
        if (noPrompt) {
            autoRedirect = true;
        }
        hideConfirmation();
        window.open(searchUrl, '_blank');
    });
}

function showConfirmation(message, url) {
    createConfirmation();
    confirmation.querySelector('div:nth-of-type(2)').innerText = message;
    searchUrl = url;
    confirmation.style.display = 'block';
}

function hideConfirmation() {
    if (!confirmation) return;
    confirmation.style.display = 'none';
}
let searchBtn = document.createElement('button');
searchBtn.innerText = '划词查找';
searchBtn.style.position = 'fixed';
searchBtn.style.right = '50px';
searchBtn.style.bottom = '30px';
searchBtn.style.padding = '10px';
searchBtn.style.backgroundColor = '#333';
searchBtn.style.color = '#fff';
searchBtn.style.fontWeight = 'bold';
searchBtn.style.borderRadius = '5px';
searchBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
searchBtn.addEventListener('click', function() {
    let selection = window.getSelection().toString().trim();
    if (selection.length > 0) {
        doSearch(selection);
    } else {
        removeHighlight();
        hideNotification();
    }
});
document.body.appendChild(searchBtn);
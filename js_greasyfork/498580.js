// ==UserScript==
// @name         Reddit Full Markdown Editor
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a full markdown editor with preview and draft saving to Reddit post and reply boxes
// @author       Mr.K
// @match        https://old.reddit.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/498580/Reddit%20Full%20Markdown%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/498580/Reddit%20Full%20Markdown%20Editor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Load SimpleMDE and CSS
    var simplemdeScript = document.createElement('script');
    simplemdeScript.src = 'https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.js';
    document.head.appendChild(simplemdeScript);

    var simplemdeCss = document.createElement('link');
    simplemdeCss.rel = 'stylesheet';
    simplemdeCss.href = 'https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.css';
    document.head.appendChild(simplemdeCss);

    // Add Custom Styles for the Popup
    GM_addStyle(`
        .markdown-editor-popup {
            position: fixed;
            top: 10%;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            max-width: 800px;
            background: #fff;
            border: 1px solid #ccc;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            display: none;
        }
        .markdown-editor-popup-header {
            background: #f6f6f6;
            padding: 10px;
            border-bottom: 1px solid #ccc;
            font-size: 16px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
        }
        .markdown-editor-popup-body {
            padding: 10px;
        }
        .markdown-editor-popup-footer {
            background: #f6f6f6;
            padding: 10px;
            border-top: 1px solid #ccc;
            display: flex;
            justify-content: flex-end;
        }
        .markdown-editor-drafts {
            margin-top: 10px;
            max-height: 200px;
            overflow-y: auto;
            border-top: 1px solid #ccc;
            padding-top: 10px;
        }
        .markdown-editor-draft-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px;
            cursor: pointer;
        }
        .markdown-editor-draft-item:hover {
            background: #e9e9e9;
        }
        .markdown-editor-draft-delete {
            background: red;
            color: white;
            border: none;
            cursor: pointer;
            padding: 5px;
            margin-left: 10px;
        }
    `);

    function createPopup() {
        var popup = document.createElement('div');
        popup.className = 'markdown-editor-popup';
        popup.innerHTML = `
            <div class="markdown-editor-popup-header">
                Markdown Editor
                <button class="markdown-editor-popup-close">X</button>
            </div>
            <div class="markdown-editor-popup-body">
                <textarea id="markdown-editor-textarea"></textarea>
                <div class="markdown-editor-drafts"></div>
            </div>
            <div class="markdown-editor-popup-footer">
                <button class="markdown-editor-save-draft">Save Draft</button>
                <button class="markdown-editor-submit">Submit</button>
            </div>
        `;
        document.body.appendChild(popup);

        var simplemde = new SimpleMDE({ element: document.getElementById('markdown-editor-textarea') });
        return { popup, simplemde };
    }

    function openPopup(simplemde, target) {
        var popup = document.querySelector('.markdown-editor-popup');
        popup.style.display = 'block';
        simplemde.value(target.value);

        // Load drafts
        var draftsContainer = document.querySelector('.markdown-editor-drafts');
        draftsContainer.innerHTML = '';
        var drafts = JSON.parse(localStorage.getItem('markdownEditorDrafts') || '[]');
        drafts.forEach((draft, index) => {
            var draftItem = document.createElement('div');
            draftItem.className = 'markdown-editor-draft-item';
            draftItem.innerHTML = `
                <span>${draft.substring(0, 50)}...</span>
                <button class="markdown-editor-draft-delete" data-index="${index}">Delete</button>
            `;
            draftItem.querySelector('span').onclick = () => simplemde.value(draft);
            draftItem.querySelector('.markdown-editor-draft-delete').onclick = () => {
                deleteDraft(index, simplemde, target);
            };
            draftsContainer.appendChild(draftItem);
        });

        // Handle saving drafts
        document.querySelector('.markdown-editor-save-draft').onclick = () => {
            drafts.push(simplemde.value());
            localStorage.setItem('markdownEditorDrafts', JSON.stringify(drafts));
            alert('Draft saved!');
            openPopup(simplemde, target); // Refresh the drafts list
        };

        // Handle submitting content
        document.querySelector('.markdown-editor-submit').onclick = () => {
            target.value = simplemde.value();
            popup.style.display = 'none';
        };

        // Handle closing the popup
        document.querySelector('.markdown-editor-popup-close').onclick = () => {
            popup.style.display = 'none';
        };
    }

    function deleteDraft(index, simplemde, target) {
        var drafts = JSON.parse(localStorage.getItem('markdownEditorDrafts') || '[]');
        drafts.splice(index, 1);
        localStorage.setItem('markdownEditorDrafts', JSON.stringify(drafts));
        alert('Draft deleted!');
        openPopup(simplemde, target); // Refresh the drafts list
    }

    function init() {
        var { popup, simplemde } = createPopup();

        document.querySelectorAll('.usertext-edit textarea').forEach(textarea => {
            var openEditorButton = document.createElement('button');
            openEditorButton.textContent = 'Open Markdown Editor';
            openEditorButton.style.display = 'block';
            openEditorButton.style.marginBottom = '10px';
            openEditorButton.onclick = () => openPopup(simplemde, textarea);
            textarea.parentNode.insertBefore(openEditorButton, textarea);
        });
    }

    simplemdeScript.onload = init;
})();

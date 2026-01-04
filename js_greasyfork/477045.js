// ==UserScript==
// @name         B-Note-Uni (哔记通用版)
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  哔记(B-Note)的"Universal version"(通用版本)，可在多个页面实现文本快速插入、图片插入、本地导入导出、快捷键、markdown写作、分屏模式。
// @author       XYZ
// @match        *://*/*
// @exclude      *://*.bilibili.com/*
// @exclude      *://github.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.5.0/jszip.min.js
// @require      https://unpkg.com/axios@1.1.2/dist/axios.min.js
// @license      MIT License
// @icon         data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIxLjUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBhcmlhLWhpZGRlbj0idHJ1ZSI+CiAgPHBhdGggc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJNNC4yNiAxMC4xNDdhNjAuNDM2IDYwLjQzNiAwIDAwLS40OTEgNi4zNDdBNDguNjI3IDQ4LjYyNyAwIDAxMTIgMjAuOTA0YTQ4LjYyNyA0OC42MjcgMCAwMTguMjMyLTQuNDEgNjAuNDYgNjAuNDYgMCAwMC0uNDkxLTYuMzQ3bS0xNS40ODIgMGE1MC41NyA1MC41NyAwIDAwLTIuNjU4LS44MTNBNTkuOTA1IDU5LjkwNSAwIDAxMTIgMy40OTNhNTkuOTAyIDU5LjkwMiAwIDAxMTAuMzk5IDUuODRjLS44OTYuMjQ4LTEuNzgzLjUyLTIuNjU4LjgxNG0tMTUuNDgyIDBBNTAuNjk3IDUwLjY5NyAwIDAxMTIgMTMuNDg5YTUwLjcwMiA1MC43MDIgMCAwMTcuNzQtMy4zNDJNNi43NSAxNWEuNzUuNzUgMCAxMDAtMS41Ljc1Ljc1IDAgMDAwIDEuNXptMCAwdi0zLjY3NUE1NS4zNzggNTUuMzc4IDAgMDExMiA4LjQ0M20tNy4wMDcgMTEuNTVBNS45ODEgNS45ODEgMCAwMDYuNzUgMTUuNzV2LTEuNSI+PC9wYXRoPgo8L3N2Zz4=

// @downloadURL https://update.greasyfork.org/scripts/477045/B-Note-Uni%20%28%E5%93%94%E8%AE%B0%E9%80%9A%E7%94%A8%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/477045/B-Note-Uni%20%28%E5%93%94%E8%AE%B0%E9%80%9A%E7%94%A8%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 填写你的github的token以及repo(仓库名)
    let token = '';
    let repo = '';

    // Add the TOAST UI Editor CSS
    $('head').append('<link rel="stylesheet" href="https://uicdn.toast.com/editor/latest/toastui-editor.min.css" />');

    // Add the TOAST UI Editor JS
    const scriptEditor = document.createElement('script');
    scriptEditor.src = 'https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js';
    document.body.appendChild(scriptEditor);

    // Add the JQuery UI
    $('head').append('<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">');


    // Create a switch using SVG.
    function createSVGIcon(svgContent) {
        const svgIcon = $(svgContent);
        svgIcon.css({ width: '24px', height: '24px', verticalAlign: 'middle', marginRight: '5px' });
        return svgIcon;
    }
    const openEditorIcon = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 16H5V5h14v14z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
    const closeEditorIcon = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path d="M20 11H4v2h16v-2z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';

    // Create the button
    const openEditorButton = $('<button id="openEditor" class="B-Note-button"></button>');
    openEditorButton.append(createSVGIcon(openEditorIcon));
    $('body').append(openEditorButton);

    const toggleButton = $('<button id="toggleEditor" class="B-Note-button"></button>');
    const toggleButtonText = $('<span>打开B-Note</span>');
    toggleButton.append(createSVGIcon(openEditorIcon)).append(toggleButtonText);
    $('body').append(toggleButton);

    const buttonStyles = `
      .B-Note-button {
         position: fixed;
         bottom: 10px;
         right: -80px;
         width: 120px;
         height: 32px;
         z-index: 10000;
         background-color: rgba(255, 255, 255, 0.2);
         color: black;
         border: none;
         border-radius: 4px;
         padding: 2px 0px;
         font-size: 13px;
         cursor: pointer;
         transition: right 0.3s, background-color 0.3s;
      }

      .B-Note-button:hover {
         background-color: rgba(255, 255, 255, 0.9);
         right: 0px;
      }
    `;
    const styleElement = $('<style></style>');
    styleElement.text(buttonStyles);
    $('head').append(styleElement);


    let saveButton;
    let helpButton;
    let editor;
    let editorDiv;
    let isEditorOpen = false;
    let isSplitScreen = false;
    let originalContainerStyle;


    // Get the current date, title, and current webpage link.
    function getPageInfo() {
        let currentDate = new Date();
        let formattedDate = `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月${currentDate.getDate()}日`;
        let pageTitle = document.title;
        let pageLink = window.location.href;

        return { formattedDate, pageTitle, pageLink };
    }
    let pageInfo = getPageInfo();

    // Use IndexedDB to automatically back up notes.
    const dbName = 'BNoteDB';
    const storeName = 'notes';
    let db;

    const openRequest = indexedDB.open(dbName, 1);

    openRequest.onupgradeneeded = function (e) {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'pageTitle' });
        }
    };

    openRequest.onsuccess = function (e) {
        db = e.target.result;
    };

    function saveNoteToDB() {
        if (isEditorOpen) {
            let { formattedDate, pageTitle, pageLink } = getPageInfo();
            const content = editor.getMarkdown();
            const timestamp = Date.now();
            const note = { pageTitle, content, timestamp };

            const transaction = db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            store.put(note);
        }
    }
    setInterval(saveNoteToDB, 120000);

    // Upload to Github
    async function handleImageInsertion() {
        const content = editor.getMarkdown();
        const regex = /!\[.*?\]\(data:image\/.*?;base64,.*?\)/g;
        const matches = content.match(regex);

        if (matches) {
            for (const match of matches) {
                const base64 = match.substring(match.indexOf('base64,') + 7, match.lastIndexOf(')'));
                const blob = base64ToBlob(base64);
                const imageUrl = await uploadImageToGitHub(blob);
                const newContent = content.replace(match, `![Image](${imageUrl})`);
                editor.setMarkdown(newContent);
            }
        }
    }

    function base64ToBlob(base64) {
        const binary = atob(base64);
        const array = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            array[i] = binary.charCodeAt(i);
        }
        return new Blob([array], { type: 'image/png' });
    }

    async function uploadImageToGitHub(blob) {
        const branch = 'main';
        const currentDate = new Date();

        currentDate.setMinutes(currentDate.getMinutes() + currentDate.getTimezoneOffset() + 8 * 60);
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        const seconds = currentDate.getSeconds();
        const time = `${hours}-${minutes}-${seconds}`;
        const pageInfo = getPageInfo();
        const invalidChars = /[<>:"/\\|?*]/g;
        const cleanedPageTitle = pageInfo.pageTitle.replace(invalidChars, '');

        const path = `images/B-Note/${year}/${month}/${day}/${cleanedPageTitle}/${time}.png`;


        const url = `https://api.github.com/repos/${repo}/contents/${path}`;
        const base64 = await blobToBase64(blob);
        const payload = {
            message: 'Upload image',
            content: base64,
            branch: branch,
        };

        const response = await axios.put(url, payload, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data.content.download_url;
    }

    function blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }



    const container = $('<div id="editorContainer"></div>');

    // Function to create the editor
    function createEditor() {

        container.css({
            position: 'fixed', top: '8%', right: '0%',
            width: '32%', height: '86%',
            zIndex: 99999, backgroundColor: '#fff',
            border: '1px solid #ccc', borderRadius: '5px', padding: '0px', overflow: 'hidden',
        });
        $('body').append(container);

        // Make the container resizable
        container.resizable({
            handles: 'n, e, s, w, ne, se, sw, nw',
            minWidth: 300,
            minHeight: 200,
            resize: function (event, ui) {
                const newHeight = ui.size.height - 80;
                editorDiv.height(newHeight + 'px');
            }
        });

        const handle = $('<div id="dragHandle">B-Note</div>');
        handle.css({
            position: 'sticky',
            top: 0,
            height: '30px',
            backgroundColor: '#ccc',
            cursor: 'move',
            boxSizing: 'border-box',
            margin: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontStyle: 'bold',
        });
        container.append(handle);

        const buttonDiv = $('<div id="buttonContainer"></div>');
        buttonDiv.css({
            position: 'sticky',
            top: '35px',
            display: 'flex',
            justifyContent: 'flex-start',
            paddingLeft: '10px',
            marginBottom: '10px',
            gap: '10px',
        });
        container.append(buttonDiv);

        // Get button SVG
        const saveIcon = '<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="25" height="25"><path stroke-linecap="round" stroke-linejoin="round" d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3"></path></svg>';
        const importIcon = '<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="25" height="25"><path stroke-linecap="round" stroke-linejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"></path></svg>';
        const helpIcon = '<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="25" height="25"><path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"></path></svg>';
        const autoBackupIcon = '<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="25" height="25"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"></path></svg>';
        const insertIcon = '<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="25" height="25"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"></path></svg>';
        const splitScreenIcon = '<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="25" height="25"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"></path></svg>';

        // Get save button
        saveButton = createSVGButton(saveIcon, '保存', function () {
            saveEditorContent();
        });
        buttonDiv.append(saveButton);


        // Import button
        const importButton = createSVGButton(importIcon, '导入', function () {
            importEditorContent();
        });
        buttonDiv.append(importButton);

        // Create insert Button
        const insertButton = createSVGButton(insertIcon, '插入', function () {
            const selection = document.getSelection();
            const selectedText = selection.toString();

            const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
            const imgElement = range ? range.cloneContents().querySelector('img') : null;

            if (imgElement) {
                const imgSrc = imgElement.src;
                editor.replaceSelection(`![Image](${imgSrc})`);
            } else if (selectedText) {
                editor.insertText(selectedText);
            }
        });
        insertButton.setAttribute("id", "insertButton");
        buttonDiv.append(insertButton);


        // Create automatic backups.
        const autoBackupButton = createSVGButton(autoBackupIcon, '自动备份', function () {
            showAutoBackupDialog();
        });
        buttonDiv.append(autoBackupButton);

        // Create split-screen mode.
        const splitScreenButton = createSVGButton(splitScreenIcon, '分屏模式', toggleSplitScreen);
        buttonDiv.append(splitScreenButton);


        // Create the help button
        function createHelpPopup() {
            const helpPopup = $(`
               <div id="helpPopup" style="display:none; overflow: auto">
                  <h3 style="text-align: center">如何使用B-Note</h3>
                     <ul>
                       <li> 1. ${saveIcon.replace('width="25" height="25"', 'width="15" height="15"')} 保存：下载笔记。 </li>
                       <li> 2. ${importIcon.replace('width="25" height="25"', 'width="15" height="15"')} 导入：载入之前下载的.md格式笔记文件。</li>
                       <li> 3. ${insertIcon.replace('width="25" height="25"', 'width="15" height="15"')} 插入：选中文本或者图片后点击此按钮后可以插入到笔记中。<strong>快捷键alt+X</strong>。</li>
                       <li> 4. ${autoBackupIcon.replace('width="25" height="25"', 'width="15" height="15"')} 自动备份。每隔2分钟将笔记内容自动备份。点此按钮可展示最近备份的6个笔记。</li>
                       <li> 5. ${splitScreenIcon.replace('width="25" height="25"', 'width="15" height="15"')} 分屏模式。点击后，左边展示原来页面，右边展示笔记。再次点击该按钮退出分屏模式。</li>
                       <li> 6. ${helpIcon.replace('width="25" height="25"', 'width="15" height="15"')} 帮助信息。</li>
                       <li> 7. Tip1: 可以直接通过Ctrl+V粘贴图片到笔记中，或者通过笔记中的图片导入将图片传入笔记中。</li>
                       <li> 8. Tip2: 笔记中的图片都会自动上传到github仓库中，并返回一个图片的链接。</li>
                       <li> 9. 重要！请先配置github图床。可以<strong><a href="https://github.com/Xiang-yuZHAO/B-Note_img" target="_blank">点击此处</a></strong>查看配置帮助。</li>
                    </ul>
           `);
            helpPopup.css({
                fontSize: '16px',
            });
            $('body').append(helpPopup);

            helpPopup.dialog({
                autoOpen: false,
                modal: true,
                width: '40%',
                zIndex: 99999,
                position: {
                    my: "left top",
                    at: "left+15% top+8%",
                    of: window
                },
                buttons: {
                    "关闭": function() {
                        $(this).dialog("close");
                    }
                }
            });

            return helpPopup;
        }

        const helpPopup = createHelpPopup();
        helpButton = createSVGButton(helpIcon, '帮助', function() {
            helpPopup.dialog("open");
        });
        buttonDiv.append(helpButton);


        // Create the toast ui editor
        editorDiv = $('<div id="editor"></div>');
        editorDiv.css({
            width: '100%',
            height: 'calc(100% - 100px)',
            zIndex: 9999,
        });
        container.append(editorDiv);

        let { formattedDate, pageTitle, pageLink } = getPageInfo();
        editor = new toastui.Editor({
            el: document.querySelector('#editor'),
            height: container.height() - 80 + 'px',
            //height: 'auto',
            //initialEditType: 'markdown',
            previewStyle: 'vertical',
            //initialEditType: 'wysiwyg',
            initialValue: `**标题**：[${pageTitle}](${pageLink})\n**日期**：${formattedDate}\n**摘要**：[添加摘要]\n**标签**：[添加标签]\n\n\n\n\n\n
                          `,
            autofocus: true,

        });
        editor.on('change', () => {
            handleImageInsertion();
        });
    }





    // Create a button with an SVG icon
    function createSVGButton(svgIcon, tooltipText, onClick) {
        const button = document.createElement('button');
        button.innerHTML = svgIcon;
        button.setAttribute('title', tooltipText);
        button.onclick = onClick;
        button.style.border = 'none';
        button.style.background = 'transparent';
        button.style.cursor = 'pointer';
        return button;
    }


    // Add click event listener to the button
    openEditorButton.on('click', function () {
        createEditor();
    });


    function createButton(text, clickHandler) {
        const button = $('<button></button>');
        button.text(text);
        button.css({
            display: 'inline-block',
            marginRight: '1px',
            padding: '5px',
            backgroundColor: 'white',
            color: 'black',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
        });
        button.click(clickHandler);
        return button;
    }

    async function saveEditorContent() {
        return new Promise(async (resolve) => {
            const content = editor.getMarkdown();
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const invalidChars = /[<>:"/\\|?*]/g;
            const cleanedPageTitle = pageInfo.pageTitle.replace(invalidChars, '');

            link.href = url;
            link.download = `${cleanedPageTitle}.md`;
            link.style.display = 'none';
            document.body.appendChild(link);

            link.onclick = () => {
                setTimeout(() => {
                    URL.revokeObjectURL(url);
                    resolve();
                }, 100);
            };
            link.click();
        });
    }

    function importEditorContent() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.md';
        input.style.display = 'none';
        document.body.appendChild(input);
        input.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target.result;
                    editor.setMarkdown(content);
                };
                reader.readAsText(file);
            }
        });
        input.click();
        setTimeout(() => {
            document.body.removeChild(input);
        }, 100);
    }



    // make editor draggable
    $(document).on('mousedown', '#dragHandle', function (event) {
        const container = $('#editorContainer');
        const offset = {
            x: event.pageX - container.offset().left,
            y: event.pageY - container.offset().top,
        };
        let isDragging = false;
        const onMouseMove = function (event) {
            if (!isDragging) return;
            requestAnimationFrame(() => {
                const draggable = $('.draggable');
                draggable.offset({
                    top: event.pageY - offset.y,
                    left: event.pageX - offset.x
                });
            });
        };
        container.addClass('draggable').on('mousemove', onMouseMove);
        isDragging = true;
        event.preventDefault();
    }).on('mouseup', function () {
        $('.draggable').removeClass('draggable');
    });


    let originalStyles = new Map();
    function saveOriginalStyles(element) {
        element.each(function () {
            const el = $(this);
            originalStyles.set(this, el.attr('style'));
            saveOriginalStyles(el.children());
        });
    }
    function restoreOriginalStyles(element) {
        element.each(function () {
            const el = $(this);
            const originalStyle = originalStyles.get(this);
            if (originalStyle) {
                el.attr('style', originalStyle);
            } else {
                el.removeAttr('style');
            }
            restoreOriginalStyles(el.children());
        });
    }

    function toggleSplitScreen() {
        if (!isSplitScreen) {
            saveOriginalStyles($('body').children());

            const newContainer = $('<div id="newContainer"></div>');
            newContainer.css({ position: 'fixed', top: 0, left: 0, width: '50%', height: '100%', overflow: 'auto' });
            $('body').wrapInner(newContainer);

            container.attr('style', '');
            container.css({
                position: 'fixed',
                top: '8%',
                right: '0%',
                width: '32%',
                height: '86%',
                zIndex: 99999,
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '5px',
                padding: '0px',
                overflow: 'hidden',
            });

            const rightContainer = $('<div id="rightContainer"></div>');
            rightContainer.css({ position: 'fixed', top: 0, right: 0, width: '50%', height: '100%', overflow: 'auto' });
            $('body').append(rightContainer);
            originalContainerStyle = container.attr('style');
            rightContainer.append(container);
            container.css({
                position: 'relative',
                top: '0%',
                width: '100%',
                height: '100%',
                zIndex: 9999,
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '5px',
                padding: '0px',
                overflow: 'hidden'
            });
            container.addClass('split-mode-hidden');
            $(document).off('mousedown', '#dragHandle');
            container.resizable('destroy');
            editor.setHeight('91%');

            isSplitScreen = true;

        } else {
            restoreOriginalStyles($('body').children());
            $('#newContainer').children().unwrap();

            container.attr('style', originalContainerStyle);
            editor.setHeight(container.height() - 80 + 'px');

            $(document).on('mousedown', '#dragHandle', function (event) {
                const offset = {
                    x: event.pageX - container.offset().left,
                    y: event.pageY - container.offset().top,
                };
                let isDragging = false;
                const onMouseMove = function (event) {
                    if (!isDragging) return;
                    requestAnimationFrame(() => {
                        const draggable = $('.draggable');
                        draggable.offset({
                            top: event.pageY - offset.y,
                            left: event.pageX - offset.x
                        });
                    });
                };
                container.addClass('draggable').on('mousemove', onMouseMove);
                isDragging = true;
                event.preventDefault();
            }).on('mouseup', function () {
                $('.draggable').removeClass('draggable');
            });

            container.resizable({
                handles: 'n, e, s, w, ne, se, sw, nw',
                minWidth: 300,
                minHeight: 200,
                resize: function (event, ui) {
                    const newHeight = ui.size.height - 80;
                    editorDiv.height(newHeight + 'px');
                }
            });

            isSplitScreen = false;
        }
    }




    // Display the most recent 6 backups of notes.
    function showAutoBackupDialog() {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = function (e) {
            const notes = e.target.result;

            notes.sort((a, b) => b.timestamp - a.timestamp);

            const dialog = $('<div id="autoBackupDialog"></div>');
            dialog.css({
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 10000,
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '5px',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
            });

            const recentNotes = notes.slice(0, 6);

            recentNotes.forEach((note) => {
                const noteButton = $('<button></button>');

                const timestamp = new Date(note.timestamp);
                const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
                    timeZone: 'Asia/Shanghai',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
                const formattedTime = dateFormatter.format(timestamp);


                noteButton.text(`${formattedTime} - ${note.pageTitle}`);

                noteButton.css({
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    marginBottom: '10px',
                });
                noteButton.click(function () {
                    loadNoteToEditor(note);
                    dialog.remove();
                });
                dialog.append(noteButton);
            });

            const cancelButton = $('<button>取消</button>');
            cancelButton.css({
                display: 'block',
                width: '100%',
                textAlign: 'center',
            });
            cancelButton.click(function () {
                dialog.remove();
            });
            dialog.append(cancelButton);

            $('body').append(dialog);
        };
    }

    function loadNoteToEditor(note) {
        editor.setMarkdown(note.content);
    }


    // The operation after the current video playback ends.
    // Function to close the editor and save the content if confirmed
    async function closeAndSave() {
        if (isEditorOpen) {
            const r = confirm("是否需要保存笔记？");
            if (r == true) {
                await saveEditorContent();
            }

            $('#editorContainer').remove();
            toggleButton.empty().append(createSVGIcon(openEditorIcon)).append(toggleButtonText.text('打开B-Note'));


        }

    }


    // Handler for toggle button click
    toggleButton.click(function() {
        if (toggleButtonText.text() === '打开B-Note') {
            createEditor();
            toggleButton.empty().append(createSVGIcon(closeEditorIcon)).append(toggleButtonText.text('关闭B-Note'));
            isEditorOpen = true;
        } else {
            closeAndSave();
            isEditorOpen = false;
        }
    });

    // Shortcut settings.
    document.addEventListener('keydown', function (event) {
        if (event.altKey) {
            if (event.key === 'X' || event.key === 'x') {
                document.getElementById('insertButton').click();
            }
        }
    });





})();

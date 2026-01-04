// ==UserScript==
// @name         哔记-B Note (B站笔记插件)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  可替代B站原有笔记功能的油猴插件（时间戳、截图、本地导入导出、字幕遮挡、快捷键、markdown写作）
// @author       XYZ
// @match        *://*.bilibili.com/video/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.5.0/jszip.min.js
// @require      https://unpkg.com/axios@1.1.2/dist/axios.min.js
// @license      MIT License
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @icon         data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIxLjUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBhcmlhLWhpZGRlbj0idHJ1ZSI+CiAgPHBhdGggc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJNMTIgNy41aDEuNW0tMS41IDNoMS41bS03LjUgM2g3LjVtLTcuNSAzaDcuNW0zLTloMy4zNzVjLjYyMSAwIDEuMTI1LjUwNCAxLjEyNSAxLjEyNVYxOGEyLjI1IDIuMjUgMCAwMS0yLjI1IDIuMjVNMTYuNSA3LjVWMThhMi4yNSAyLjI1IDAgMDAyLjI1IDIuMjVNMTYuNSA3LjVWNC44NzVjMC0uNjIxLS41MDQtMS4xMjUtMS4xMjUtMS4xMjVINC4xMjVDMy41MDQgMy43NSAzIDQuMjU0IDMgNC44NzVWMThhMi4yNSAyLjI1IDAgMDAyLjI1IDIuMjVoMTMuNU02IDcuNWgzdjNINnYtM3oiPjwvcGF0aD4KPC9zdmc+


// @downloadURL https://update.greasyfork.org/scripts/475808/%E5%93%94%E8%AE%B0-B%20Note%20%28B%E7%AB%99%E7%AC%94%E8%AE%B0%E6%8F%92%E4%BB%B6%29.user.js
// @updateURL https://update.greasyfork.org/scripts/475808/%E5%93%94%E8%AE%B0-B%20Note%20%28B%E7%AB%99%E7%AC%94%E8%AE%B0%E6%8F%92%E4%BB%B6%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 填写你的github的token以及repo(仓库名)
    let token = '';
    let repo = '';


    // Add the TOAST UI Editor CSS
    $('head').append('<link rel="stylesheet" href="https://uicdn.toast.com/editor/latest/toastui-editor.css" />');


    // CSS
    const style = `
     .floating-btn {
         width: 60px;
         height: 15px;
         font-size: 10px;
         cursor: pointer;
         border: none;
         outline: none;
         background: transparent;
         color: white;
         font-family: 'Times New Roman', Times, serif;
         font-weight: 100;
         position: relative;
         transition: all 0.5s;
         z-index: 1;
     }

     .floating-btn::before {
         content: "";
         position: absolute;
         top: 0;
         left: 0;
         width: 0.5px;
         height: 100%;
         background-color: white;
         z-index: -1;
         transition: all 0.5s;
         padding-left: 2px;
     }

     .floating-btn:hover::before {
         width: 100%;
         content: "选集";
     }

     .floating-btn:hover {
         color: black;
     }

     .floating-btn:active:before {
         background: #b9b9b9;
     }

     .switch1 {
         position: relative;
         display: inline-block;
         width: 60px;
         height: 25px;
     }

     .switch1 input {
        display: none;
     }

     .slider1 {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #3C3C3C;
        -webkit-transition: .4s;
        transition: .4s;
        border-radius: 34px;
     }

     .slider1:before {
       position: absolute;
       content: "";
       height: 25px;
       width: 10px;
       left: 0px;
       bottom: 0px;
       background-color: white;
       -webkit-transition: .4s;
       transition: .4s;
       border-radius: 10%;
     }

     input:checked + .slider1 {
       background-color: #0E6EB8;
     }

     input:focus + .slider1 {
       box-shadow: 0 0 1px #2196F3;
     }

     input:checked + .slider1:before {
       -webkit-transform: translateX(25px);
       -ms-transform: translateX(25px);
       transform: translateX(85px);
     }


     .slider1:after {
       content: '本地';
       color: white;
       display: block;
       position: absolute;
       transform: translate(-50%,-50%);
       top: 50%;
       left: 50%;
       font-size: 10px;
       font-family: Verdana, sans-serif;
     }

     input:checked + .slider1:after {
       content: '在线';
     }
     `;

    $('head').append('<style>' + style + '</style>');

    // Add the TOAST UI Editor JS
    const scriptEditor = document.createElement('script');
    scriptEditor.src = 'https://uicdn.toast.com/editor/latest/toastui-editor-all.js';
    document.body.appendChild(scriptEditor);

    // Add the JQuery UI
    $('head').append('<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">');

    // Bilibili AVI switch

    function selectAV1() {
        const av1Radio = document.querySelector('input.bui-radio-input[value="3"][name="bui-radio3"]');
        if (av1Radio && !av1Radio.checked) {
            av1Radio.click();
        }
    }

    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            callback();
        } else {
            setTimeout(() => waitForElement(selector, callback), 500);
        }
    }

    waitForElement('input.bui-radio-input[value="3"][name="bui-radio3"]', selectAV1);



    // Determine if it is a multi-part video.
    let isCur = false;
    let curList;
    let originalcurListParent;
    if (document.querySelector('.cur-list')) {
        isCur = true;
        curList = $('#multi_page');
        originalcurListParent = $('#multi_page').parent()
    } else {
        isCur = false;
    }

    // Create a switch using SVG.
    function createSVGIcon(svgContent) {
        const svgIcon = $(svgContent);
        svgIcon.css({ width: '24px', height: '24px', verticalAlign: 'middle', marginRight: '5px' });
        return svgIcon;
    }
    const openEditorIcon = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 16H5V5h14v14z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
    const closeEditorIcon = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M20 11H4v2h16v-2z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';

    // Create the button
    const openEditorButton = $('<button id="openEditor" class="B-Note-button"></button>');
    openEditorButton.append(createSVGIcon(openEditorIcon));
    $('body').append(openEditorButton);

    const toggleButton = $('<button id="toggleEditor" class="B-Note-button"></button>');
    const toggleButtonText = $('<span>打开哔记</span>');
    toggleButton.append(createSVGIcon(openEditorIcon)).append(toggleButtonText);
    $('body').append(toggleButton);

    const buttonStyles = `
      .B-Note-button {
         position: fixed;
         bottom: 10px;
         right: -60px;
         width: 100px;
         height: 35px;
         z-index: 10000;
         background-color: white;
         border: none;
         cursor: pointer;
         transition: right 0.3s, background-color 0.3s;
      }

      .B-Note-button:hover {
         right: 0px;
      }
    `;
    const styleElement = $('<style></style>');
    styleElement.text(buttonStyles);
    $('head').append(styleElement);


    // video element
    var videoElement = document.querySelector('video');
    var lastMarkedTime = null;
    let saveButton;
    let helpButton;
    let editor;
    let editorDiv;
    let isEditorOpen = false;
    let embedMode = false;
    let videoWrapper = $('#bilibili-player');
    let isUpload = false;
    let originalVideoWrapperParent;
    let originalContainerStyle;
    let originalDisplayStatus = [];
    let isScrollbarDisabled = false;

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
        if (!isUpload) {
            return;
        }

        let content = editor.getMarkdown();
        const regex = /!\[.*?\]\(data:image\/.*?;base64,.*?\)/g;
        const matches = content.match(regex);

        if (matches) {
            const newContent = await matches.reduce(async (prevContentPromise, match) => {
                const prevContent = await prevContentPromise;
                const base64 = match.substring(match.indexOf('base64,') + 7, match.lastIndexOf(')'));
                const blob = base64ToBlob(base64);
                const imageUrl = await uploadImageToGitHub(blob);
                return prevContent.replace(match, `![Image](${imageUrl})`);
            }, Promise.resolve(content));

            editor.setMarkdown(newContent);
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
            zIndex: 9998, backgroundColor: '#fff',
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

        const handle = $('<div id="dragHandle">哔记(B-Note)</div>');
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
        const getPositionIcon = '<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="25" height="25"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"></path></svg>';
        const jumpIcon = '<svg fill="none" stroke="black" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="25" height="25"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"></path></svg>';
        const importIcon = '<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="25" height="25"><path stroke-linecap="round" stroke-linejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"></path></svg>';
        const captureIcon = '<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="25" height="25"><path stroke-linecap="round" stroke-linejoin="round" d="M7.848 8.25l1.536.887M7.848 8.25a3 3 0 11-5.196-3 3 3 0 015.196 3zm1.536.887a2.165 2.165 0 011.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 11-5.196 3 3 3 0 015.196-3zm1.536-.887a2.165 2.165 0 001.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863l2.077-1.199m0-3.328a4.323 4.323 0 012.068-1.379l5.325-1.628a4.5 4.5 0 012.48-.044l.803.215-7.794 4.5m-2.882-1.664A4.331 4.331 0 0010.607 12m3.736 0l7.794 4.5-.802.215a4.5 4.5 0 01-2.48-.043l-5.326-1.629a4.324 4.324 0 01-2.068-1.379M14.343 12l-2.882 1.664"></path></svg>';
        const blurIcon = '<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="25" height="25"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"></path></svg>';
        const lightIcon = '<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="22" height="22"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"></path></svg>';
        const helpIcon = '<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="25" height="25"><path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"></path></svg>';
        const autoBackupIcon = '<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="25" height="25"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"></path></svg>';
        const embedModeIcon = '<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="25" height="25"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"></path></svg>';

        // Get save button
        saveButton = createSVGButton(saveIcon, '保存', function () {
            saveEditorContent();
        });
        buttonDiv.append(saveButton);


        // Get video position button
        const getPositionButton = createSVGButton(getPositionIcon, '获取播放位置', function () {
            const formattedTime = getCurrentTimeFormatted();
            var newURL;
            if (isCur) {
                newURL = getVideoURL() + '&t=' + formattedTime;
            } else {
                newURL = getVideoURL() + '?t=' + formattedTime;
            }
            const timeInBracket = formattedTime.replace('h', ':').replace('m', ':').replace('s', '');
            const formattedURL = '[' + timeInBracket + '](' + newURL + ')';
            editor.replaceSelection(formattedURL);
            lastMarkedTime = formattedURL;


        });
        getPositionButton.setAttribute("id", "getPositionButton");
        buttonDiv.append(getPositionButton);

        // Get jump to last marked time button OR Jump to specific URL time button
        const jumpButton = createSVGButton(jumpIcon, '跳转', function () {
            const selection = editor.getSelection();
            const selectedText = editor.getSelectedText(selection[0], selection[1]);

            if (selectedText) {
                let timeString;
                let pValue;
                const urlMatch = selectedText.match(/(https?:\/\/www\.bilibili\.com\/video\/[^\s]+(?:\?p=\d+)?(?:&t=\d{2}h\d{2}m\d{2}s)?)/);
                const timeMatch = selectedText.match(/([0-9]{2}:[0-9]{2}:[0-9]{2})/);

                if (urlMatch) {
                    const url = urlMatch[0];
                    const pMatch = url.match(/(?:\?p=)(\d+)/);
                    const timeMatchInUrl = url.match(/(?:\?t=|&t=)(\d{2})h(\d{2})m(\d{2})s/);

                    if (isCur) {
                        pValue = pMatch ? parseInt(pMatch[1], 10) : 1;
                        if (timeMatchInUrl) {
                            const hours = parseInt(timeMatchInUrl[1], 10);
                            const minutes = parseInt(timeMatchInUrl[2], 10);
                            const seconds = parseInt(timeMatchInUrl[3], 10);
                            timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                        }
                    } else {
                        timeString = timeMatchInUrl ? `${timeMatchInUrl[1]}:${timeMatchInUrl[2]}:${timeMatchInUrl[3]}` : null;
                    }
                } else {
                    timeString = timeMatch ? timeMatch[0] : null;
                }

                if (isCur && pValue) {
                    const target = Array.from(document.querySelectorAll('.list-box .page-num')).find(el => el.textContent === `P${pValue}`);

                    if (target) {
                        const link = target.closest('a');
                        if (link) {
                            link.click();
                        } else {
                            console.error('未找到对应的链接');
                        }
                    } else {
                        console.error('未找到对应的分P');
                    }
                }


                if (timeString) {
                    const timeParts = timeString.split(':');
                    const seconds = parseInt(timeParts[0], 10) * 3600 + parseInt(timeParts[1], 10) * 60 + parseInt(timeParts[2], 10);
                    videoElement.currentTime = seconds;
                }

            } else {
                console.log('lastMarkedTime:', lastMarkedTime);
                const pMatch = lastMarkedTime.match(/(?:\?p=)(\d+)/);
                const timeMatch = lastMarkedTime.match(/(?:\?t=|&t=)(\d{2})h(\d{2})m(\d{2})s/);


                if (isCur) {
                    const pValue = pMatch ? parseInt(pMatch[1], 10) : 1;
                    console.log('pValue:', pValue);
                    const target = Array.from(document.querySelectorAll('.list-box .page-num')).find(el => el.textContent === `P${pValue}`);

                    if (target) {
                        const link = target.closest('a');
                        if (link) {
                            link.click();
                        } else {
                            console.error('未找到对应的链接');
                        }
                    } else {
                        console.error('未找到对应的分P');
                    }
                }

                if (timeMatch) {
                    const hours = parseInt(timeMatch[1], 10);
                    const minutes = parseInt(timeMatch[2], 10);
                    const seconds = parseInt(timeMatch[3], 10);
                    const timeInSeconds = hours * 3600 + minutes * 60 + seconds;
                    videoElement.currentTime = timeInSeconds;
                }
            }
        });
        jumpButton.setAttribute("id", "jumpButton");
        buttonDiv.append(jumpButton);


        // Import button
        const importButton = createSVGButton(importIcon, '导入', function () {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.md,.zip';
            input.addEventListener('change', async (event) => {
                const file = event.target.files[0];
                if (file.name.endsWith('.md')) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const markdown = reader.result;
                        editor.setMarkdown(markdown);
                    };
                    reader.readAsText(file);
                } else if (file.name.endsWith('.zip')) {
                    const zip = await JSZip.loadAsync(file);

                    let mdFile;
                    zip.forEach((relativePath, zipEntry) => {
                        if (zipEntry.name.endsWith('.md')) {
                            mdFile = zipEntry;
                        }
                    });

                    if (!mdFile) {
                        alert('找不到.md 文件。');
                        return;
                    }

                    const mdContent = await mdFile.async('text');

                    const replaceImages = async (content) => {
                        const regex = /!\[Image\]\((images\/image\d+\.png)\)/g;
                        let match;
                        let newContent = content;

                        while ((match = regex.exec(content)) !== null) {
                            const imagePath = match[1];
                            const imgFile = zip.file(imagePath);
                            if (!imgFile) {
                                alert(`找不到 ${imagePath} 文件。`);
                                continue;
                            }
                            const imgData = await imgFile.async('base64');
                            newContent = newContent.replace(match[0], `![Image](data:image/png;base64,${imgData})`);
                        }

                        return newContent;
                    };

                    const updatedContent = await replaceImages(mdContent);
                    editor.setMarkdown(updatedContent);
                } else {
                    alert('请选择一个有效的文件类型（.md 或 .zip）。');
                }
            });
            input.click();
        });
        buttonDiv.append(importButton);

        // Create the capture button
        const captureButton = createSVGButton(captureIcon, '截图', function () {
            const videoWrap = document.querySelector('.bpx-player-video-wrap');
            const video = videoWrap.querySelector('video');

            if (!video) {
                alert('找不到视频区域，请确保您在正确的页面上。');
                return;
            }

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = video.videoWidth / 3;
            canvas.height = video.videoHeight / 3;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/png');
            editor.replaceSelection('![Image](' + dataUrl + ')'); 

        });
        captureButton.setAttribute("id", "captureButton");
        buttonDiv.append(captureButton);


        // Create the blur button
        const blurButton = createSVGButton(blurIcon, '字幕遮挡', function () {
            createBlurRectangle();
        });
        buttonDiv.append(blurButton);

        // Create the lamp
        const lightButton = createSVGButton(lightIcon, '关灯', function () {
            toggleLight();
        });
        buttonDiv.append(lightButton);

        // Create automatic backups.
        const autoBackupButton = createSVGButton(autoBackupIcon, '自动备份', function () {
            showAutoBackupDialog();
        });
        buttonDiv.append(autoBackupButton);

        // Create embedded note mode.
        const embedModeButton = createSVGButton(embedModeIcon, '内嵌模式', toggleEmbedMode);
        embedModeButton.setAttribute("id", "embedModeButton");
        buttonDiv.append(embedModeButton);



        // Create the help button
        function createHelpPopup() {
            const helpPopup = $(`
               <div id="helpPopup" style="display:none; overflow: auto">
                  <h2 style="text-align: center">如何使用哔记</h3>
                     <ul>
                        <li> 1. ${saveIcon.replace('width="25" height="25"', 'width="15" height="15"')} 保存：下载笔记，并将文本连同图片打包为zip压缩包。</li>
                        <li> 2. ${getPositionIcon.replace('width="25" height="25"', 'width="15" height="15"')} 获取播放位置：添加当前播放位置的时间戳。<strong>快捷键alt+X</strong>。</li>
                        <li> 3. ${jumpIcon.replace('width="25" height="25"', 'width="15" height="15"')} 跳转：立即跳转到最近一次标记时间戳的播放位置。<strong>快捷键alt+C</strong>。如果此时手动选择了时间戳，将会跳转到指定的播放位置。</li>
                        <li> 4. ${importIcon.replace('width="25" height="25"', 'width="15" height="15"')} 导入：载入之前下载的zip压缩包或者仅导入之前下载的.md文件。</li>
                        <li> 5. ${captureIcon.replace('width="25" height="25"', 'width="15" height="15"')} 截图。截取当前播放器中的画面并插入到笔记中。<strong>快捷键alt+V</strong>。（注意：过多的图片插入可能会导致卡顿！）</li>
                        <li> 6. ${blurIcon.replace('width="25" height="25"', 'width="15" height="15"')} 字幕遮挡。产生一个可以移动且可改变大小（拖拽右下角）的毛玻璃矩形，可以用来遮挡字幕练习英语听力。再次点击该按钮后关闭字幕遮挡。</li>
                        <li> 7. ${lightIcon.replace('width="22" height="22"', 'width="15" height="15"')} 关灯。视频播放时关灯，避免干扰。再次点击该按钮后开灯。</li>
                        <li> 8. ${autoBackupIcon.replace('width="25" height="25"', 'width="15" height="15"')} 自动备份。自动备份最近的6条笔记。</li>
                        <li> 9. ${embedModeIcon.replace('width="25" height="25"', 'width="15" height="15"')} 内嵌模式。点击后进入笔记分屏效果（再次点击该按钮退出分屏效果）。<strong>快捷键alt+E</strong>。特别的，对于分part视频（注意，不是合集视频），将在页面左下方产生一个悬浮的选集弹窗。点开之后，会跳出选集界面。当鼠标离开选集弹窗后，弹窗会自动关闭。</li>
                        <li> 10.${helpIcon.replace('width="25" height="25"', 'width="15" height="15"')} 帮助按钮。用法提示。</li>
                        <li> 11.在线/本地选择框。可选择将笔记中插入的图片保存在本地或者上传到github图床。可以<strong><a href="https://github.com/Xiang-yuZHAO/B-Note_img" target="_blank">【点击此处】</a></strong>查看github在线图床配置。 </li>
                        <li> 12.  Tip1。添加了额外的视频播放暂停/开始<strong>快捷键alt+B</strong>。视频后退5秒<strong>快捷键alt+N</strong>。视频前进5秒<strong>快捷键alt+M</strong>。</li>
                        <li> 13. Tip2。可以通过拖拽顶部调整哔记的位置。</li>
                        <li> 14. Tip3。哔记有wysiwyg(实时预览)和markdown两种模式(可在右下角切换)，但是在实时预览模式下插入时间戳会被强制转义为文本。</li>
                        <li> 15. Tip4。使用快捷键可帮你更快的记录笔记。可点击浏览器的油猴图标，找到哔记的快捷键设置页面，从而自定义快捷键。</li>
                    </ul>
           `);
            helpPopup.css({
                fontSize: '16px',
            });
            $('body').append(helpPopup);

            helpPopup.dialog({
                autoOpen: false,
                modal: true,
                width: '50%',
                zIndex: 99999,
                position: {
                    my: "left top",
                    at: "left+10% top+8%",
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

        // Create a button to upload a GitHub repository.
        buttonDiv.append(`
        <label class="switch1">
            <input type="checkbox">
            <span class="slider1"></span>
        </label>
        `);
        buttonDiv.find('input[type="checkbox"]').change(function() {
            if ($(this).is(':checked')) {
                if (token === '' || repo === '') {
                    alert('请先配置 token 和 repo！可点击帮助按钮查看如何配置github图床。');
                    $(this).prop('checked', false);
                } else {
                    isUpload = true;
                    console.log('打开isUpload:', isUpload);
                }
            } else {
                isUpload = false;
                console.log('关闭isUpload:', isUpload);
            }

        });

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
            //initialEditType: 'markdown',
            previewStyle: 'vertical',
            //initialEditType: 'wysiwyg',
            initialValue: `**标题**：[${pageTitle}](${pageLink})\n**日期**：${formattedDate}\n**摘要**：[添加摘要]\n**标签**：[添加标签]\n\n\n\n\n\n
                          `,
            autofocus: true,

        });

        // Mouse scroll event: Disable webpage scrolling when the mouse is inside the container.
        container.on('mouseenter', function () {
            if (!isScrollbarDisabled) {
                $('body').css('overflow', 'hidden');
            }
        });
        container.on('mouseleave', function () {
            if (!isScrollbarDisabled) {
                $('body').css('overflow', 'auto');
            }
        });


        editor.on('change', handleImageInsertion);
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
            const zip = new JSZip();
            const imgFolder = zip.folder("images");
            let imgIndex = 1;

            const newContent = content.replace(/!\[[^\]]*\]\((data:image\/[^;]+;base64,[^\)]+)\)/g, (match, dataUrl) => {
                const imgName = `image${imgIndex}.png`;
                imgFolder.file(imgName, dataUrl.split(',')[1], { base64: true });
                imgIndex++;
                return `![Image](images/${imgName})`;
            });

            const invalidChars = /[<>:"/\\|?*]/g;
            const cleanedPageTitle = pageInfo.pageTitle.replace(invalidChars, '');

            zip.file(`${cleanedPageTitle}.md`, newContent);
            const blob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `${cleanedPageTitle}.zip`);

            link.onclick = () => {
                setTimeout(() => {
                    URL.revokeObjectURL(url);
                    resolve();
                }, 100);
            };
            link.click();
        });
    }



    function getCurrentTimeFormatted() {
        var currentTime = videoElement.currentTime;
        var hours = Math.floor(currentTime / 3600);
        var minutes = Math.floor((currentTime % 3600) / 60);
        var seconds = Math.floor(currentTime % 60);
        return hours.toString().padStart(2, '0') + 'h' +
            minutes.toString().padStart(2, '0') + 'm' +
            seconds.toString().padStart(2, '0') + 's';
    }

    function getVideoURL() {
        if (isCur) {
            return window.location.href.split('&')[0];
        } else {
            return window.location.href.split('?')[0];
        }
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


    let blurRectangle = null;
    function createBlurRectangle() {
        if (blurRectangle) {
            blurRectangle.parentNode.removeChild(blurRectangle);
            blurRectangle = null;
        } else {
            blurRectangle = document.createElement('div');
            blurRectangle.style.position = 'fixed';
            blurRectangle.style.zIndex = '10001';
            if (embedMode) {
                blurRectangle.style.left = '3%';
                blurRectangle.style.bottom = '30%';
                blurRectangle.style.width = '45%';
                blurRectangle.style.height = '10%';
            } else {
                blurRectangle.style.left = '7%';
                blurRectangle.style.bottom = '20%';
                blurRectangle.style.width = '60%';
                blurRectangle.style.height = '10%';
            }
            blurRectangle.style.background = 'rgba(255, 255, 255, 0.2)';
            blurRectangle.style.backdropFilter = 'blur(8px)';
            blurRectangle.style.cursor = 'move';
            document.body.appendChild(blurRectangle);

            $(blurRectangle).resizable({
                handles: 'n, e, s, w, ne, se, sw, nw',
                minWidth: 50,
                minHeight: 50
            });

            $(blurRectangle).draggable();
        }
    }


    function downloadImage(dataUrl, filename) {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function toggleLight() {
        if (embedMode) {
            return;
        }
        const lightOffCheckbox = document.querySelector('.bpx-player-ctrl-setting-lightoff .bui-checkbox-input');
        lightOffCheckbox.click();
        isScrollbarDisabled = !isScrollbarDisabled;
        document.body.style.overflow = isScrollbarDisabled ? 'hidden' : 'auto';
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

    function toggleEmbedMode() {
        embedMode = !embedMode;
        if (embedMode) {
            enterEmbedMode();
        } else {
            exitEmbedMode();
        }
    }


    function enterEmbedMode() {
        if ($('.mini-player-window.fixed-sidenav-storage-item.on').length > 0) {
            console.log("检测到小窗");
            $('.mini-player-window.fixed-sidenav-storage-item.on').click();
        }

        originalDisplayStatus = [];
        $('body > *').each(function () {
            if (!$(this).hasClass('ui-dialog')) {
                originalDisplayStatus.push($(this).css('display'));
            }
        });

        const newContainer = $('<div></div>');
        newContainer.css({ width: '50%', float: 'left', height: '100%' });
        //const videoWrapper = $('#bilibili-player');
        originalVideoWrapperParent = videoWrapper.parent();
        videoWrapper.css({ width: '100%', height: '100%' });
        const iframe = videoWrapper.find('iframe');
        iframe.css({ width: '100%', height: '100%' });
        newContainer.append(videoWrapper);

        if (isCur) {
            const floatingButton = $('<button></button>');
            floatingButton.addClass('floating-btn');
            floatingButton.css({
                position: 'absolute',
                bottom: '20%',
                left: '0px',
                zIndex: 9999
            });

            newContainer.append(floatingButton);

            floatingButton.on('click', function () {
                const curContainer = $('<div></div>');
                curContainer.css({
                    position: 'absolute',
                    bottom: '5%',
                    height: 'auto',
                    width: '40%',
                    overflow: 'hidden',
                    zIndex: 9999

                });


                curList.appendTo(curContainer);
                newContainer.append(curContainer);

                let timeoutId;
                curContainer.on('mouseleave', function () {
                    timeoutId = setTimeout(function () {
                        curContainer.remove();
                    }, 1000);
                });

                curContainer.on('mouseenter', function () {
                    clearTimeout(timeoutId);
                });
            });
        }

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

        const rightContainer = $('<div></div>');
        rightContainer.css({ width: '50%', float: 'right', height: '100%' });
        originalContainerStyle = container.attr('style');
        rightContainer.append(container);
        container.css({
            position: 'relative',
            top: '0%',
            width: '100%',
            height: '100%',
            zIndex: 9998,
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '5px',
            padding: '0px',
            overflow: 'hidden'
        });
        container.addClass('embed-mode-hidden');
        $(document).off('mousedown', '#dragHandle');
        container.resizable('destroy');
        editor.setHeight('90%');

        const mainContainer = $('<div></div>');
        mainContainer.css({ width: '100%', height: '100%', position: 'fixed', top: '0', left: '0' });
        mainContainer.append(newContainer);
        mainContainer.append(rightContainer);

        $('body').prepend(mainContainer);

        $('body > *:not(:first-child)').hide();

        newContainer.resizable({
            handles: 'e',
            minWidth: $(window).width() * 0.2,
            maxWidth: $(window).width() * 0.8,
            resize: function (event, ui) {
                rightContainer.css('width', 100 - (ui.size.width / $(window).width() * 100) + '%');
            }
        });

    }

    function exitEmbedMode() {

        container.attr('style', originalContainerStyle);
        editor.setHeight(container.height() - 80 + 'px');
        $('body').append(container);

        //const videoWrapper = $('#bilibili-player');
        videoWrapper.css({ width: '', height: '' });
        const iframe = videoWrapper.find('iframe');
        iframe.css({ width: '', height: '' });
        originalVideoWrapperParent.append(videoWrapper);
        $('body').append(container);

        const mainContainer = $('body > :first-child');
        mainContainer.remove();


        $('body > *').each(function (index) {
            if (!$(this).hasClass('ui-dialog')) {
                $(this).css('display', originalDisplayStatus[index]);
            }
        });

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

        container.resizable({
            handles: 'n, e, s, w, ne, se, sw, nw',
            minWidth: 300,
            minHeight: 200,
            resize: function (event, ui) {
                const newHeight = ui.size.height - 80;
                editorDiv.height(newHeight + 'px');
            }
        });

        if (isCur) {
            let thirdLastChild = originalcurListParent.children().eq(-3);
            curList.insertBefore(thirdLastChild);
        }

    }


    // The operation after the current video playback ends.
    // Function to close the editor and save the content if confirmed
    async function closeAndSave() {
        if (isEditorOpen) {
            const r = confirm("是否需要保存笔记？");
            if (r == true) {
                await saveEditorContent();
            }
            if (embedMode) {
                exitEmbedMode();
            }

            $('#editorContainer').remove();
            toggleButton.empty().append(createSVGIcon(openEditorIcon)).append(toggleButtonText.text('打开哔记'));


        }

    }


    // Handler for toggle button click
    toggleButton.click(function () {
        if (toggleButtonText.text() === '打开哔记') {
            createEditor();
            toggleButton.empty().append(createSVGIcon(closeEditorIcon)).append(toggleButtonText.text('关闭哔记'));
            isEditorOpen = true;
        } else {
            closeAndSave();
            isEditorOpen = false;
        }
    });

    // Listen for the video to end and trigger the close and save function
    videoElement.addEventListener('ended', function () {
        if (!isCur) {
            closeAndSave();
        }
    });



    // Shortcut settings.
    function handleKeydown(event) {
        const shortcuts = [
            { id: 'getPositionButton', modifier: 'alt', key: 'X', action: () => document.getElementById('getPositionButton').click() },
            { id: 'jumpButton', modifier: 'alt', key: 'C', action: () => document.getElementById('jumpButton').click() },
            { id: 'captureButton', modifier: 'alt', key: 'V', action: () => document.getElementById('captureButton').click() },
            { id: 'togglePlayButton', modifier: 'alt', key: 'B', action: () => {
                if (videoElement.paused) {
                    videoElement.play();
                } else {
                    videoElement.pause();
                }
            }},
            { id: 'rewindButton', modifier: 'alt', key: 'N', action: () => {
                const currentTime = videoElement.currentTime;
                videoElement.currentTime = Math.max(currentTime - 5, 0);
            }},
            { id: 'forwardButton', modifier: 'alt', key: 'M', action: () => {
                const currentTime = videoElement.currentTime;
                videoElement.currentTime = Math.min(currentTime + 5, videoElement.duration);
            }},
            { id: 'embedModeButton', modifier: 'alt', key: 'E', action: () => document.getElementById('embedModeButton').click() },
        ];

        shortcuts.forEach(shortcut => {
            const modifier = GM_getValue(shortcut.id + 'Modifier', shortcut.modifier);
            const key = GM_getValue(shortcut.id + 'Key', shortcut.key);

            if (event[modifier + 'Key'] && event.key.toUpperCase() === key) {
                shortcut.action();
            }
        });
    }

    document.addEventListener('keydown', handleKeydown);




    GM_registerMenuCommand('快捷键设置', () => {
        if (document.getElementById('settingsDiv')) return;

        const settingsDiv = document.createElement('div');
        settingsDiv.id = 'settingsDiv';
        settingsDiv.innerHTML = `
        <style>
            #settingsDiv { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 9999; }
            #settingsForm { background-color: white; padding: 20px; border-radius: 5px; }
            .settingsRow { display: flex; align-items: center; margin-bottom: 10px; }
            .settingsLabel { margin-right: 10px; width: 150px;}
            .settingsSelect { margin-right: 20px; width: 80px; }
            .settingsInput { width: 40px; }
        </style>
        <form id="settingsForm">
            <!-- 快捷键设置行 -->
            <button id="saveSettings">保存/退出</button>
            <button id="resetSettings">恢复默认设置</button>
        </form>
    `;
        document.body.appendChild(settingsDiv);

        const shortcuts = [
            { id: 'getPositionButton', label: '获取播放位置', modifier: 'alt', key: 'X' },
            { id: 'jumpButton', label: '跳转', modifier: 'alt', key: 'C' },
            { id: 'captureButton', label: '截图', modifier: 'alt', key: 'V' },
            { id: 'togglePlayButton', label: '视频暂停/开始', modifier: 'alt', key: 'B' },
            { id: 'rewindButton', label: '视频后退5秒', modifier: 'alt', key: 'N' },
            { id: 'forwardButton', label: '视频前进5秒', modifier: 'alt', key: 'M' },
            { id: 'embedModeButton', label: '进入/退出embed mode', modifier: 'alt', key: 'E' },
        ];

        shortcuts.forEach(shortcut => {
            const settingsRow = document.createElement('div');
            settingsRow.className = 'settingsRow';
            settingsRow.innerHTML =`
            <label class="settingsLabel" for="${shortcut.id}Modifier">${shortcut.label}:</label>
            <select class="settingsSelect" id="${shortcut.id}Modifier">
                <option value="alt">Alt</option>
                <option value="shift">Shift</option>
                <option value="ctrl">Ctrl</option>
            </select>
            <input class="settingsInput" id="${shortcut.id}Key" type="text" maxlength="1" value="${shortcut.key}" />
        `;
            document.getElementById('settingsForm').insertBefore(settingsRow, document.getElementById('saveSettings'));
        });

        shortcuts.forEach(shortcut => {
            document.getElementById(shortcut.id + 'Modifier').value = GM_getValue(shortcut.id + 'Modifier', shortcut.modifier);
            document.getElementById(shortcut.id + 'Key').value = GM_getValue(shortcut.id + 'Key', shortcut.key);
        });

        document.getElementById('saveSettings').addEventListener('click', (e) => {
            e.preventDefault();
            shortcuts.forEach(shortcut => {
                const modifier = document.getElementById(shortcut.id + 'Modifier').value;
                const key = document.getElementById(shortcut.id + 'Key').value.toUpperCase();
                GM_setValue(shortcut.id + 'Modifier', modifier);
                GM_setValue(shortcut.id + 'Key', key);
            });
            document.body.removeChild(settingsDiv);
        });

        document.getElementById('resetSettings').addEventListener('click', (e) => {
            e.preventDefault();
            shortcuts.forEach(shortcut => {
                document.getElementById(shortcut.id + 'Modifier').value = shortcut.modifier;
                document.getElementById(shortcut.id + 'Key').value = shortcut.key;
            });
        });
    });


})();

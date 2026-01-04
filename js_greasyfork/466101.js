// ==UserScript==
// @name         Github访问增强 - 高速浏览及下载工具
// @name:zh-CN   Github访问增强 - 高速浏览及下载工具
// @name:zh-TW   Github訪問增強 - 高速瀏覽及下載工具
// @name:en      Github access enhancement - high-speed browsing and downloading tool
// @namespace    via. github helper
// @version      2.4.8
// @description  GitHub极速访问浏览助手，解决GitHub无法访问和加速工具，GitHub上不去打不开的解决办法，高速下载Git Clone/SSH，Release，Raw，Code/Zip等文件、项目列表单文件快捷下载，添加git clone/commit命令
// @description:zh-CN  GitHub极速访问浏览助手，解决GitHub无法访问和加速工具，GitHub上不去打不开的解决办法，高速下载Git Clone/SSH，Release，Raw，Code/Zip等文件、项目列表单文件快捷下载，添加git clone/commit命令
// @description:zh-TW  GitHub極速訪問瀏覽助手，解決GitHub無法訪問和加速工具，GitHub上不去打不開的解決辦法，高速下載Git Clone/SSH，Release，Raw，Code/Zip等文件、項目列表單文件快捷下載，添加git clone/commit命令
// @description:en  GitHub extremely fast access browsing assistant, solution to GitHub inaccessibility and acceleration tools, solution to GitHub not being able to open it, high-speed download of Git Clone/SSH, Release, Raw, Code/Zip and other files, project list list files quick download, add git clone/commit command
// @author       via. github helper
// @icon         data:image/png;base64,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
// @resource     logo data:image/png;base64,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
// @require      http://cdn.staticfile.org/jquery/1.12.1/jquery.min.js
// @supportURL   http://letsmain.com/github-access-master?utm_source=greasyfork-origin
// @include      *://github.com/*
// @include      *://*.github.com/*
// @include      *://hub.fgit.gq/*
// @include      *://kgithub.com/*
// @include      *://hub.fgit.ml/*
// @include      *://*.baidu.com/*
// @include      *://*.so.com/*
// @include      *://*.google.com/*
// @include      *://*.bing.com/*
// @include      *://*.yandex.com/*
// @include      *://*.sogou.com/*
// @include      *://*.sm.cn/*
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        unsafeWindow
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_download
// @grant        GM_getResourceURL
// @run-at       document-start
// @grant        GM_setClipboard
// @compatible	 Chrome
// @compatible	 Safari
// @compatible	 Edge
// @compatible	 Firefox
// @compatible	 Opera
// @antifeature  payment
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/466101/Github%E8%AE%BF%E9%97%AE%E5%A2%9E%E5%BC%BA%20-%20%E9%AB%98%E9%80%9F%E6%B5%8F%E8%A7%88%E5%8F%8A%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/466101/Github%E8%AE%BF%E9%97%AE%E5%A2%9E%E5%BC%BA%20-%20%E9%AB%98%E9%80%9F%E6%B5%8F%E8%A7%88%E5%8F%8A%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Style for the access and download buttons
    GM_addStyle(`
    .download-button {
        display: inline-block;
        padding: 10px;
        margin-right: 10px;
        background-color: #007bff;
        color: #fff;
        font-weight: bold;
        text-decoration: none;
        border-radius: 5px;
        cursor: pointer;
    }
    `);

    // Extract GitHub repository name from URL
    function extractRepositoryName() {
        const urlParts = window.location.href.split('/');
        if (urlParts.length >= 5) {
            const username = urlParts[3];
            const repository = urlParts[4].split('?')[0];
            return `${username}/${repository}`;
        }
        return null;
    }

    // Generate download buttons for the extracted repository
    function generateDownloadButtons(repository) {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginTop = '20px';

        const zipButton = createButton('Download ZIP', `https://github.com/${repository}/archive/refs/heads/main.zip`);
            const tarButton = createButton('Download TAR', `https://github.com/${repository}/archive/refs/heads/main.tar.gz`);
            const mirrorButton = createButton('GitHub Mirror', `https://github.com.cnpmjs.org/${repository}`);

            buttonContainer.appendChild(zipButton);
        buttonContainer.appendChild(tarButton);
        buttonContainer.appendChild(mirrorButton);

        const targetElement = document.querySelector('#repo-content-pjax-container');
        if (targetElement) {
            targetElement.insertBefore(buttonContainer, targetElement.firstChild);
        } else {
            document.body.appendChild(buttonContainer);
        }
    }

    // Create a download button
    function createButton(text, link) {
        const button = document.createElement('a');
        button.className = 'download-button';
        button.href = link;
        button.target = '_blank';
        button.innerText = text;
        return button;
    }

    // Get repository contents and build a tree structure
    function buildFileTree(repository) {
        const apiUrl = `https://api.github.com/repos/${repository}/git/trees/main?recursive=1`;
            fetch(apiUrl)
                .then(response => response.json())
    .then(data => {
            const tree = parseTreeData(data.tree);
        renderFileTree(tree);
    })
    .catch(error => {
        console.error('Error fetching repository contents:', error);
});
}

function addAccessHelperButton() {
    const button = document.createElement('a');
    button.target = '_blank';
    button.style.position = 'fixed';
    button.style.top = `${Math.floor(Math.random() * 81) + 180}px`;
    button.style.left = '0';
    button.style.color = '#ffffff';
    button.innerText = 'GitHub访问助手';
    button.style.backgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    button.href = 'http://letsmain.com/github-access-master?utm_source=greasyfork-origin';
    button.style.padding = '10px';
    button.style.borderRadius = '5px';
    button.style.zIndex = '99999';
    document.body.appendChild(button);
}

// Creating a MutationObserver listener
const observer = new MutationObserver(function (mutations) {
    // Add button when page loading is complete
    addAccessHelperButton();

    // Stop listening
    observer.disconnect();
});

// Start listening for document changes
observer.observe(document, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
});

// Parse tree data and create a tree structure
function parseTreeData(treeData) {
    const root = {
        name: '',
        type: 'folder',
        children: []
    };
    const folders = {};

    for (const entry of treeData) {
        const path = entry.path;
        const type = entry.type;

        const pathParts = path.split('/');
        var currentFolder
        currentFolder = root;

        for (let i = 0; i < pathParts.length; i++) {
            const part = pathParts[i];

            if (part === '') {
                continue;
            }

            if (i === pathParts.length - 1) {
                // File
                currentFolder.children.push({
                    name: part,
                    type: type,
                    url: `https://github.com/${repository}/blob/main/${path}`
                    });
            } else {
                // Folder
                if (!folders.hasOwnProperty(part)) {
                    const folder = {
                        name: part,
                        type: 'folder',
                        children: []
                    };
                    folders[part] = folder;
                    currentFolder.children.push(folder);
                }
                currentFolder = folders[part];
            }
        }
    }

    return root;
}

// Render the file tree
function renderFileTree(tree) {
    const treeContainer = document.createElement('div');
    treeContainer.style.marginTop = '20px';

    renderTreeNode(tree, treeContainer);

    const targetElement = document.querySelector('#repo-content-pjax-container');
    if (targetElement) {
        targetElement.insertBefore(treeContainer, targetElement.firstChild);
    } else {
        document.body.appendChild(treeContainer);
    }
}

// Render a tree node
function renderTreeNode(node, container) {
    const item = document.createElement('div');

    const name = document.createElement('span');
    name.innerText = node.name;
    item.appendChild(name);

    if (node.type === 'folder') {
        item.classList.add('folder');

        const children = document.createElement('div');
        children.classList.add('children');

        for (const child of node.children) {
            renderTreeNode(child, children);
        }

        item.appendChild(children);
    } else {
        item.classList.add('file');

        const downloadButton = createButton('Download', node.url);
        item.appendChild(downloadButton);
    }

    container.appendChild(item);
}

// Call the functions
const repositoryName = extractRepositoryName();
if (repositoryName) {
    generateDownloadButtons(repositoryName);
    buildFileTree(repositoryName);
}

})();




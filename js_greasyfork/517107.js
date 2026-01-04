// ==UserScript==
// @name         DownloadLI
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Copy Download URL
// @author       GZY
// @match        https://pan.leuven-instruments.com:8884/v/list/ent/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517107/DownloadLI.user.js
// @updateURL https://update.greasyfork.org/scripts/517107/DownloadLI.meta.js
// ==/UserScript==

let group, lastGroupID
let X_LENOVO_SESS_ID = ""
const document_cookie = document.cookie.split(';')
for (const cookie of document_cookie) {
    if (cookie.indexOf("X-LENOVO-SESS-ID") !== -1) {
        X_LENOVO_SESS_ID = cookie.split('=')[1]
        break
    }
}

function main(group) {
    buttonArray.forEach(buttonParent => {
        buttonParent.removeChild(buttonParent.lastChild)
    })
    buttonArray = []
    let group_children = group.children
    for (let i = 0; i < group_children.length; i++) {
        let group_child = group_children[i]
        const file_type = group_child.getElementsByTagName("use")[0].attributes["xlink:href"].textContent
        if (file_type.indexOf("folder") === -1) {
            handle_one_file(group_child)
        }
    }
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        console.log('Text copied to clipboard successfully');
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
}

let buttonArray = [];

function handle_one_file(file_dom) {
    const drag_id = file_dom.attributes["drag-id"].textContent
    let button = document.createElement("button");
    const blocks = file_dom.getElementsByClassName("file-area")[0]
    file_dom.addEventListener('mouseenter', function () {
        button.innerHTML = "Copy Download URL"
        button.style.display = 'inline-block'; // 或者使用 'block' 根据需要
    });

    file_dom.addEventListener('mouseleave', function () {
        button.style.display = 'none';
    });

    button.innerHTML = "Copy Download URL"
    button.style = "background-color: #4CAF50; color: white; width:150px;height:40px;position: absolute;top:50%;transform: translateY(-50%);text-align: center; font-size: 13px; border: none; border-radius: 5px;display:none;right:100px;box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);cursor: pointer;z-index:999;font-weight: bold;"
    button.className = "item-1"
    button.onclick = async function (e) {
        let download_url = `https://pan.leuven-instruments.com:8884/v2/files/databox/?X-LENOVO-SESS-ID=${X_LENOVO_SESS_ID}&path_type=ent&from=&neid=${drag_id}`
        //复制到剪切板
        this.innerHTML = "Copied"
        await copyToClipboard(download_url)
    }
    blocks.append(button)
    buttonArray.push(button.parentNode)
}

setInterval(() => {
    let res = document.querySelectorAll('[role="group"]')
    group = res.length > 0 ? res[0] : null
    let groupID = null
    if (group && group.children.length > 0) {
        groupID = group.children[0].attributes["drag-id"].textContent
    }
    if (groupID !== lastGroupID) {
        lastGroupID = groupID
        group && main(group)
    }
}, 300)

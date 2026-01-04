// ==UserScript==
// @name         stash_open_file
// @version      20250208
// @description  open folder or play media file in stash
// @description:en  open folder or play media file in stash
// @author       lefty
// @grant        GM.xmlHttpRequest
// @license MIT
// @match        https://192.168.*/scenes/*
// @namespace https://greasyfork.org/users/1337256
// @downloadURL https://update.greasyfork.org/scripts/516791/stash_open_file.user.js
// @updateURL https://update.greasyfork.org/scripts/516791/stash_open_file.meta.js
// ==/UserScript==
'use strict';
 
function checkAndAddElement() {
    let a = document.querySelectorAll('dl.container.scene-file-info.details-list ')[1];
    let div = a.querySelector('a[target=_blank] div.TruncatedText');
    let dd = div.parentNode;
    let path = div.textContent;
 
    // let infoTable = document.querySelector('div.propertiesTabContent');
    let openButton = document.querySelector('button#openButton');
    if (div && !openButton) {
        dd.insertAdjacentHTML('beforeBegin',
            `<button id="openButton">Open folder</button> <span> </span> <button id="playButton">Play in mpv</button> <span> </span> <button id="jumpButton">Jump to folder</button>`);
        openButton = a.querySelector('button#openButton');
        let playButton = a.querySelector('button#playButton');
        let jumpButton = a.querySelector('button#jumpButton');
        openButton.addEventListener("click", openFolderFn);
        playButton.addEventListener("click", playMediaFile);
        jumpButton.addEventListener("click", jumpToPath);
    }
}
 
function openFolderFn() {
    sendPathAndOperate('openFolder')
}
 
function playMediaFile() {
    sendPathAndOperate('playMediaFile')
}
 
function jumpToPath() {
    let a = document.querySelectorAll('dl.container.scene-file-info.details-list ')[1];
    let div = a.querySelector('a[target=_blank] div.TruncatedText');
    let path = div.textContent.replace(/^file:\/\//, '');
    path = path.substring(0, path.lastIndexOf('/'));
    let encodedPath ="\"\\\"" + encodeURIComponent(path) + "\\\"\"";
    let url = `${window.location.origin}/scenes?c=("type":"path","value":${encodedPath},"modifier":"INCLUDES")&sortby=date`;
    // let url = window.location.origin + '/scenes?c=("type":"path","value":"%5C"' + path + '%5C"","modifier":"INCLUDES")&sortby=date';
    window.open(url, '_blank');
}
 
 
async function sendPathAndOperate(operate) {
    let data = getPath();
    sendDataToLocalServer(data, operate)
}
 
function getPath() {
    let a = document.querySelectorAll('dl.container.scene-file-info.details-list ')[1];
    let div = a.querySelector('a[target=_blank] div.TruncatedText');
    let path = div.textContent.replace(/^file:\/\//, '');
    let info = [{"save_path": path.substring(0, path.lastIndexOf('/'))}];
    let file = [{"name":path.split('/').pop(), "size": "1"}]
    var result = {"file":file, "info": info, "full_path": path, "href": window.location.href,"name": path.split('/').pop()};
    return result
}
 
function sendDataToLocalServer(data, path) {
    let url = `http://127.0.0.1:58000/${path}/`
    GM.xmlHttpRequest({
        method: "POST",
        url: url,
        data: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    });
}
 
setInterval(() => {
    checkAndAddElement();
}, 2000);
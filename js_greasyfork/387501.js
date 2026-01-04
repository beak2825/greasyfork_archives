// ==UserScript==
// @name         Paste functionality
// @namespace    http://tripchan.org
// @version      0.1
// @description  Paste images on a thread directly from clipboard
// @author       yuifag
// @match        https://tripchan.org/att/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387501/Paste%20functionality.user.js
// @updateURL https://update.greasyfork.org/scripts/387501/Paste%20functionality.meta.js
// ==/UserScript==

const dataURItoBlob = (dataURI) => {
    const binary = atob(dataURI.split(',')[1]);
    const array = [];
    for(let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: "image/png"});
}

const sendImage = (oRequestData) => {
    const uploadFormData = new FormData();
    uploadFormData.append("op", oRequestData.op);
    uploadFormData.append("image", oRequestData.blob, "clipboard.png");
    const url = `https://tripchan.org/upload/?id=${oRequestData.id}`;
    const xhr = new XMLHttpRequest;
    xhr.open("POST", url);
    xhr.send(uploadFormData);
}

document.addEventListener("paste", (event) => {
    if (!document.querySelector(".mine")){
        document.querySelector("aside.act > a").click();
    }
    const file = (event.clipboardData.items[0].getAsFile() || event.clipboardData.files[0]);
    if (file){
        const reader = new FileReader();
        reader.onload = (event) => {
            const oRequest = {};
            oRequest.blob = dataURItoBlob(event.target.result);
            oRequest.op = window.location.pathname.replace(/[^0-9.]/g, "");
            oRequest.id = window.CONN_ID;
            sendImage(oRequest);
        };
        reader.readAsDataURL(file);
    }
});
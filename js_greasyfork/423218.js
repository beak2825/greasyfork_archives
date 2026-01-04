// ==UserScript==
// @name         irccloud upload to imgur
// @namespace    http://github.com/hnOsmium0001/
// @version      1.2
// @description  Add option to in file upload menu to upload to imgur instead of irccloud's cdn
// @author       hnOsmium0001
// @license      MIT
// @match        https://*.irccloud.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423218/irccloud%20upload%20to%20imgur.user.js
// @updateURL https://update.greasyfork.org/scripts/423218/irccloud%20upload%20to%20imgur.meta.js
// ==/UserScript==
    
(function() {
    'use strict';
    
    // Provided client ID. Replace with your own if you are having rate limit issues.
    const CLIENT_ID = "d7e157fd343c348";
    
    function hasClassPrefix(element, prefix) {
        if (!element.getAttribute) return false;
    
        const classes = (element.getAttribute("class") || "").split();
        return classes.some(x => x.startsWith(prefix));
    }
    
    class ChildrenSelector {
        constructor(elm) {
            this.elm = elm;
        }
    
        andThenTag(tag, alternativeElm) {
            if (!this.elm) {
                this.elm = alternativeElm;
                return this;
            }
    
            for (const child of this.elm.childNodes) {
                if (child.tagName === tag) {
                    this.elm = child;
                    return this;
                }
            }
            this.elm = alternativeElm;
            return this;
        }
    
        andThenClass(prefix, alternativeElm) {
            if (!this.elm) {
                this.elm = alternativeElm;
                return this;
            }
    
            for (const child of this.elm.childNodes) {
                if (hasClassPrefix(child, prefix)) {
                    this.elm = child;
                    return this;
                }
            }
            // Failed to find a matching children
            this.elm = alternativeElm;
            return this;
        }
    
        accept(successful, failed) {
            if (this.elm) {
                successful(this.elm);
            } else {
                failed();
            }
        }
    }
    
    const uploadContainer = document.getElementById('fileUploadForm');
    let batchFile;
    new ChildrenSelector(uploadContainer)
        .andThenClass("batch")
        .andThenClass("treeContainer")
        .accept(e => { batchFile = e }, () => {});
    let singleFile;
    new ChildrenSelector(uploadContainer)
        .andThenClass("single")
        .andThenClass("previewWrapper")
        .accept(e => { singleFile = e }, () => {});
    
    let inputBox;
    (function checkSession() {
        function init() {
            // cb() is a global function provided by irccloud
            inputBox = document.getElementById("bufferInputView" + cb().bid())
        }
    
        if (window.hasOwnProperty('SESSION')) {
            window.SESSION.bind('init', function () {
                init();
                window.SESSION.buffers.on('doneSelected', function () {
                    init();
                });
            });
        } else {
            setTimeout(checkSession, 100);
        }
    })();
    
    function uploadImage(imageData, outArray, callback) {
        const FILTER = ";base64,";
        const data = new FormData();
        data.append("image", imageData.substring(imageData.indexOf(FILTER) + FILTER.length));
    
        const req = new XMLHttpRequest();
        req.onreadystatechange = () => {
            if (req.readyState == 4) {
                // Response should contain a URL to the uploaded image
                const response = JSON.parse(req.response);
                console.log("[Upload Imgur] Uploaded image, response: ");
                console.log(response);
                if (outArray) {
                    outArray.push(response);
                } else {
                    inputBox.value += response.data.link;
                }
                if (callback) {
                    callback(response);
                }
            }
        };
        // For whatever reason, the actual endpoint for uploading image is /image instead of /upload as described at https://apidocs.imgur.com/#c85c9dfc-7487-4de2-9ecd-66f727cf3139
        // See https://stackoverflow.com/questions/55733271/upload-image-to-imgur-failed-because-of-cors
        req.open("POST", "https://api.imgur.com/3/image");
        req.setRequestHeader("Authorization", `Client-ID ${CLIENT_ID}`);
        req.send(data);
    }
    
    function uploadAlbum(images) {
        const data = new FormData();
        // TODO the api suggests this instead of ids[], but for whatever reason this returns
        // 403: You must own all the image deletehashes to add them to album <id>
        //data.append("deletehashes", images.map(e => e.data.deletehash));
        data.append("ids", images.map(e => e.data.id));
    
        const req = new XMLHttpRequest();
        req.onreadystatechange = () => {
            if (req.readyState == 4) {
                const response = JSON.parse(req.response);
                console.log("[Upload Imgur] Uploaded album, response:");
                console.log(response);
                inputBox.value += `https://imgur.com/a/${response.data.id}`;
            }
        };
        req.open("POST", "https://api.imgur.com/3/album");
        req.setRequestHeader("Authorization", `Client-ID ${CLIENT_ID}`);
        req.send(data);
    }
    
    new ChildrenSelector(uploadContainer)
        .andThenClass("buttons")
        .accept(uploadButtonContainer => {
            const uploadBtn = document.createElement("button");
            const closeBtn = uploadButtonContainer.lastElementChild;
            uploadButtonContainer.prepend(uploadBtn);
            uploadBtn.type = "button";
            uploadBtn.classList.add("action");
            uploadBtn.classList.add("confirm");
            uploadBtn.innerHTML = "<span>Upload to Imgur</span>";
            uploadBtn.addEventListener("click", () => {
                if (singleFile.hasChildNodes()) {
                    const img = singleFile.children[0].children[0];
                    uploadImage(img.src);
                    closeBtn.click();
                }
                if (batchFile.hasChildNodes()) {
                    const listElms = batchFile.children[0].children;
                    const uploadResults = new Array(listElms.length);
    
                    let uploadedCount = 0;
                    const uploadCallback = () => {
                        uploadedCount++;
                        if (uploadedCount >= listElms.length) {
                            // All images has been uploaded
                            uploadAlbum(uploadResults);
                        }
                    };
    
                    for (let i = 0; i < listElms.length; i++) {
                        const li = listElms[i];
                        const img = li.children[0].children[0].children[0];
                        uploadImage(img.src, uploadResults, uploadCallback);
                    }
                    closeBtn.click();
                }
            });
        }, () => console.log("Failed to find button list of fileUploadContainer"));
})();


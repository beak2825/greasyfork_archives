// ==UserScript==
// @name               EasyScreenOCR Add Clipboard Upload Feature
// @name:zh-tw         EasyScreenOCR 增加從剪貼簿上傳的功能
// @version            1.2
// @description        Allow direct image upload from the clipboard.
// @description:zh-tw  允許從剪貼簿直接上傳圖片
// @match              https://online.easyscreenocr.com/*
// @grant              none
// @author             ani20168
// @icon               https://online.easyscreenocr.com/favicon.ico
// @namespace          https://greasyfork.org/users/1044014
// @downloadURL https://update.greasyfork.org/scripts/464219/EasyScreenOCR%20Add%20Clipboard%20Upload%20Feature.user.js
// @updateURL https://update.greasyfork.org/scripts/464219/EasyScreenOCR%20Add%20Clipboard%20Upload%20Feature.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the new dropzone element
    var dropzone = document.querySelector('.el-upload');

    dropzone.addEventListener('paste', function(event) {
        // Get the clipboard data as an image file
        var items = (event.clipboardData || event.originalEvent.clipboardData).items;
        for (var i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1) {
                var blob = items[i].getAsFile();

                // Create a new file object from the clipboard image data
                var file = new File([blob], "pasted-image.png", {type: "image/png"});

                // "el-upload__input" seems to be the actual file input, so we will use it to trigger the upload
                var fileInput = dropzone.querySelector('.el-upload__input');
                if (fileInput) {
                    fileInput.files = new FileListItems([file]);

                    // Manually dispatch a change event
                    var changeEvent = new Event('change', { 'bubbles': true });
                    fileInput.dispatchEvent(changeEvent);
                }
            }
        }
    });

    // This is a helper function to allow us to assign to the files property of an input
    function FileListItems(files) {
        var b = new ClipboardEvent("").clipboardData || new DataTransfer(); // ClipboardEvent's clipboardData or fallback
        for (var i = 0, len = files.length; i<len; i++) b.items.add(files[i]);
        return b.files;
    }

})();







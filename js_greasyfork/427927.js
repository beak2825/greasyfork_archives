// ==UserScript==
// @name            iqdb Ctrl + V
// @name:en         iqdb Ctrl + V
// @namespace       http://tampermonkey.net/
// @version         0.1.4
// @description     在 iqdb 中使用 Ctrl + V 上传图片
// @description:en  Upload image to iqdb by Ctrl + V
// @author          apkipa
// @match           https://*.iqdb.org/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/427927/iqdb%20Ctrl%20%2B%20V.user.js
// @updateURL https://update.greasyfork.org/scripts/427927/iqdb%20Ctrl%20%2B%20V.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extractImageFilesFromClipboard(event) {
        var clipboardData = event.clipboardData || window.clipboardData;
        var files = clipboardData.files;
        var a = new DataTransfer();

        for (var i = 0; i < files.length; i++) {
            if (files[i].type.indexOf("image") !== -1) {
                a.items.add(files[i]);
            }
        }

        if (a.files.length < 1) {
            return null;
        }

        return a.files;
    }

    function extractTextFromClipboard(event) {
        var clipboardData = event.clipboardData || window.clipboardData;
        return clipboardData.getData('Text');
    }

    function createFilelistFromSingleFile(file) {
        var a = new DataTransfer();
        a.items.add(file);
        return a.files;
    }

    function isHttpURL(text) {
        var url;
        try {
            url = new URL(text);
        } catch(_) {
            return false;
        }
        return url.protocol === "http:" || url.protocol === "https:";
    }

    function handlePaste(e) {
        var files = extractImageFilesFromClipboard(e);

        if (files !== null) {
            e.stopPropagation();
            e.preventDefault();

            var fileInput = document.getElementById("file");

            /* ? Not working here
            fileInput.addEventListener("change", () => {
                formUpload.form.submit();
            });
            */

            fileInput.files = createFilelistFromSingleFile(files[0]);
        }
        else {
            console.log("Paste event does not contain images. Assuming text is pasted.");
            var text = extractTextFromClipboard(e);
            if (text == "") {
                console.log("No text in paste event, event is propagated.");
                return;
            }

            if (!isHttpURL(text)) {
                console.log("Pasted text is not a URL, event is propagated.");
                return;
            }

            var urlInput = document.getElementById("url");

            e.stopPropagation();
            e.preventDefault();

            urlInput.value = text;
        }

        // Automatically submit the pasted data
        // (If this is not desired behavior, comment the line containing submit())
        var formUpload = document.querySelectorAll("input[type=submit]")[0];
        formUpload.form.submit();
    }

    window.addEventListener('paste', handlePaste);
})();
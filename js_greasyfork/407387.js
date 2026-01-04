// ==UserScript==
// @name         有道 ocr Ctrl + V
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  在有道 ocr Demo 中使用 Ctrl + V 上传图片
// @author       apkipa
// @match        https://ai.youdao.com/product-ocr-*.s
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407387/%E6%9C%89%E9%81%93%20ocr%20Ctrl%20%2B%20V.user.js
// @updateURL https://update.greasyfork.org/scripts/407387/%E6%9C%89%E9%81%93%20ocr%20Ctrl%20%2B%20V.meta.js
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

    function createFilelistFromSingleFile(file) {
        var a = new DataTransfer();
        a.items.add(file);
        return a.files;
    }

    var $index = 0;

    // From product-ocr-common.js
    if (location.pathname === "/product-ocr-receipt.s") {
        $index = 1;
    } else if (location.pathname === "/product-ocr-id.s") {
        $index = 2;
    } else if (location.pathname === "/product-ocr-bizcard.s") {
        $index = 3;
    } else if (location.pathname === "/product-ocr-question.s") {
        $index = 4;
    } else if (location.pathname === "/product-ocr-table.s") {
        $index = 5;
    } else if (location.pathname === "/product-ocr-hand.s") {
        $index = 6;
    } else if (location.pathname === "/product-ocr-print.s") {
        $index = 7;
    } else {
        console.error("URL path is unknown:", location.pathname)
    }

    function getBase64(file, callback) {
        var reader = new FileReader();
        reader.onload = function () {
            callback(reader.result);
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
        reader.readAsDataURL(file);
    }

    function handlePaste(e) {
        var files = extractImageFilesFromClipboard(e);

        if (files !== null) {
            e.stopPropagation();
            e.preventDefault();

            var file = files[0];
            var urlBlob = (window.URL || window.webkitURL).createObjectURL(file);
            getBase64(file, function (res) {
                //var index = $('.service_active').eq(0).attr('dataindex');
                var img = document.getElementById('preview' + $index);
                if (img.src) {
                    (window.URL || window.webkitURL).revokeObjectURL(img.src);
                }
                img.src = urlBlob;

                ocr(res, "", $index);
            });
        }
        else {
            console.log("Not an image, paste event propagated");
        }
    }

    //document.getElementsByClassName('demo')[0].addEventListener('paste', handlePaste);
    window.addEventListener('paste', handlePaste);
})();
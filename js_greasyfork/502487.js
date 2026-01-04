// ==UserScript==
// @name         Clipboard Image Paste Firefox to Stable Diffusion
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Allows pasting images from clipboard into file inputs on http://127.0.0.1:7860/
// @match        http://127.0.0.1:7860/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502487/Clipboard%20Image%20Paste%20Firefox%20to%20Stable%20Diffusion.user.js
// @updateURL https://update.greasyfork.org/scripts/502487/Clipboard%20Image%20Paste%20Firefox%20to%20Stable%20Diffusion.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function handlePaste(e) {
        var clipboardData = e.clipboardData || window.clipboardData;
        var items = clipboardData.items;

        for (var i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1) {
                var blob = items[i].getAsFile();
                var reader = new FileReader();
                reader.onload = function(event) {
                    var fileList = new DataTransfer();
                    fileList.items.add(dataURLtoFile(event.target.result, "pasted_image.png"));
                    e.target.files = fileList.files;
                    // Trigger change event
                    var changeEvent = new Event('change', { bubbles: true });
                    e.target.dispatchEvent(changeEvent);
                };
                reader.readAsDataURL(blob);
                e.preventDefault();
                break;
            }
        }
    }

    function dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type: mime});
    }

    function addPasteListener(fileInput) {
        fileInput.addEventListener('paste', handlePaste);
        fileInput.setAttribute('paste-enabled', 'true');
    }

    // Initial setup
    var fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(addPasteListener);

    // Monitor for dynamically added file inputs
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && node.matches('input[type="file"]:not([paste-enabled])')) {
                        addPasteListener(node);
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
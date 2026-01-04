// ==UserScript==
// @name         BetterNoelshack
// @version      0.1
// @description  Drag n drop ou copier coller d'image vers noelshack sur les forums JVC 
// @author       cogis
// @match        *://*.jeuxvideo.com/forums*
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=noelshack.com
// @grant        GM_xmlhttpRequest
// @connect      www.noelshack.com
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/481314/BetterNoelshack.user.js
// @updateURL https://update.greasyfork.org/scripts/481314/BetterNoelshack.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const textArea = document.querySelector('#message_topic');

    textArea.addEventListener('drop', handleDrop);
    textArea.addEventListener('paste', handlePaste);

    async function handleDrop(event) {
        const dataTransfer = event.dataTransfer;
        if (dataTransfer.types && Array.from(dataTransfer.types).includes('Files')) {
            event.preventDefault();
            event.stopPropagation();
            const files = dataTransfer.files;
            await uploadFiles(files);
        }
    }

    async function handlePaste(event) {
        const clipboardData = event.clipboardData;
        if (clipboardData.types.includes('Files')) {
            event.preventDefault();
            const files = clipboardData.files;
            await uploadFiles(files);
        }
    }

    async function uploadFiles(files) {
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            if (file.type.includes("image")) {
                if (file.type === "image/webp") {
                    file = await convertWebPToJPEG(file);
                }
                const imageUrl = await uploadFile(file);
                if (imageUrl) {
                    updateTextArea(imageUrl);
                }
                await new Promise(resolve => setTimeout(resolve, 200));
                if (i >= 1) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
        }
    }

    async function uploadFile(file) {
        const formData = new FormData();
        formData.append('publication', '0');
        formData.append('domain', 'https://www.jeuxvideo.com');
        formData.append('fichier', file);

        const response = await sendRequest(formData);

        try {
            const data = JSON.parse(response.responseText);
            return data.url || null;
        } catch (error) {
            console.error("Error parsing JSON:", error);
            return null;
        }
    }

    function updateTextArea(imageUrl) {
        imageUrl = " " + imageUrl + " ";
        const position = textArea.selectionStart;
        const before = textArea.value.substring(0, position);
        const after = textArea.value.substring(position, textArea.value.length);
        textArea.value = before + imageUrl + after;
        textArea.selectionStart = textArea.selectionEnd = position + imageUrl.length;
        const changeEvent = new Event('change', { bubbles: true });
        textArea.dispatchEvent(changeEvent);
    }

    async function convertWebPToJPEG(webpBlob) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(webpBlob);

        return new Promise((resolve) => {
            img.onload = function () {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;

                ctx.drawImage(img, 0, 0, img.width, img.height);
                canvas.toBlob((blob) => {
                    resolve(blob);
                }, 'image/jpeg');
            };
        });
    }

    function sendRequest(formData) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://www.noelshack.com/webservice/envoi.json',
                data: formData,
                onload: function(response) {
                    resolve(response);
                },
                onerror: function(error) {
                    console.error(error);
                    reject(error);
                }
            });
        });
    }

})();

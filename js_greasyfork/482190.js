// ==UserScript==
// @license MIT
// @name         Bilibili Batch Blocking
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Batch block users on Bilibili from a txt file upload.
// @author       Muel
// @match        https://www.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482190/Bilibili%20Batch%20Blocking.user.js
// @updateURL https://update.greasyfork.org/scripts/482190/Bilibili%20Batch%20Blocking.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create and style the file input element
    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'tm-file-input';
    fileInput.style.display = 'none'; // Hide the file input
    fileInput.accept = '.txt';

    // Create and style the upload button
    var uploadButton = document.createElement('button');
    uploadButton.innerHTML = '上传UID文本文件';
    uploadButton.style.position = 'fixed';
    uploadButton.style.bottom = '20px';
    uploadButton.style.right = '20px';
    uploadButton.style.zIndex = '1000';
    uploadButton.style.backgroundColor = 'blue';  // Blue background
    uploadButton.style.color = 'white';           // White text color
    uploadButton.style.border = 'none';           // No border
    uploadButton.style.padding = '10px 20px';     // Padding
    uploadButton.style.borderRadius = '5px';      // Rounded corners
    uploadButton.style.fontSize = '16px';         // Font size
    uploadButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'; // Shadow effect
    uploadButton.style.backdropFilter = 'blur(10px)'; // Gaussian blur effect

    // Append elements to the body
    document.body.appendChild(fileInput);
    document.body.appendChild(uploadButton);

    // Add event listener to button to trigger file input
    uploadButton.addEventListener('click', function() {
        fileInput.click();
    });

    // Add change event listener to file input
    fileInput.addEventListener('change', function() {
        var file = fileInput.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var uids = e.target.result.split('\n').map(uid => uid.trim()).filter(uid => uid);
                batchFollow(uids);
            };
            reader.readAsText(file);
        }
    });

    // Define the batchFollow function
    var csrf_token = document.cookie.match(/(?<=bili_jct=).+?(?=;)/)[0];

    async function batchFollow(uid_list) {
        const followPromises = uid_list.map(uid => {
            const url = '//api.bilibili.com/x/relation/modify';
            const data = new URLSearchParams({
                'fid': uid,
                'act': 5, // The action code (e.g., follow, block)
                're_src': 11,
                'jsonp': 'jsonp',
                'csrf': csrf_token
            });

            return fetch(url, {
                method: 'POST',
                credentials: 'include',
                body: data
            });
        });

        try {
            const responses = await Promise.all(followPromises);
            responses.forEach((response, index) => {
                console.log("Response for UID", uid_list[index], ":", response.status);
            });
        } catch (error) {
            console.error("Error in batch follow:", error);
        }
    }
})();

// ==UserScript==
// @name         Show UploadKit thumbnails on order page
// @namespace    https://getuploadkit.com/
// @version      0.1
// @description  Adds a thumbnail image to UploadKit links when viewing your Shopify order
// @author       UploadKit
// @match        https://admin.shopify.com/*
// @icon         https://cdn.shopify.com/app-store/listing_images/c0fcf6b4639a2c657688c4e60f14e8f4/icon/CPrOqMv0lu8CEAE=.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471355/Show%20UploadKit%20thumbnails%20on%20order%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/471355/Show%20UploadKit%20thumbnails%20on%20order%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const regex = new RegExp(
        "https:\\/\\/cdn2?\\.shopify\\.com(?:-uploadkit\\.app)?\\/.*\\?.*id=[^&]*&uu=([^&]*)&mo=([^&]*)&fi=([^&]*)(?:(?!&image).)*(&image=true)?",
        "g"
    );

    const checkAndRunOnNewNode = (node) => {
        if (node.nodeName.toLowerCase() === 'a') {
            if(node.getAttribute('href') && node.getAttribute('href').match(regex)) {
                const url = new URL(node.getAttribute('href'));
                const params = new URLSearchParams(url.search);

                var filename = params.get('fi');
                var decodedFilename = filename > '' ? atob(filename) : ''

                if(params.get('image')) {
                    const previewImageUrl = 'https://files.getuploadkit.com/' + params.get('id') + '/' + params.get('uu') + '/' + params.get('mo') + decodedFilename + '?preview=1';
                    console.log('previewImageUrl', previewImageUrl)
                    const previewImg = document.createElement('img')
                    previewImg.src = previewImageUrl
                    previewImg.href = node.getAttribute('href')
                    previewImg.style.width = '80px'
                    previewImg.style.marginLeft = '10px'
                    node.style.display = 'flex'
                    node.insertAdjacentElement('beforeend', previewImg)
                }
            }
        }
        // If this node has children, we want to go through them
        node.childNodes.forEach(checkAndRunOnNewNode);
    }

    const callback = function(mutationsList, observer) {
        // Recursive function to go through all nodes and descendants

        // Go through all mutations that have occurred
        for(let mutation of mutationsList) {
            // If the mutation added nodes
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Go through all the added nodes
                mutation.addedNodes.forEach(checkAndRunOnNewNode);
            }
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(document, { childList: true, subtree: true });


})();
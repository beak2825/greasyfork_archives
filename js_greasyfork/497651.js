// ==UserScript==
// @name         ImgBB intrigation in TBD Upload page
// @namespace    http://tampermonkey.net/
// @version      0.69.1
// @description  Auto submit file upload with loading icon to ImgBB
// @author       EviL
// @match        https://www.torrentbd.net/torrents-upload.php
// @match        https://www.torrentbd.org/torrents-upload.php
// @match        https://www.torrentbd.com/torrents-upload.php
// @match        https://www.torrentbd.me/torrents-upload.php
// @icon         https://static.torrentbd.net/bf68ee5a32904d2ca12f3050f9efbf91.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497651/ImgBB%20intrigation%20in%20TBD%20Upload%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/497651/ImgBB%20intrigation%20in%20TBD%20Upload%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Add personal information
    var IsThumbnailorMedium = '1'; //make it 0 if you want Full image , 1 for thumbnail , 2 for medium image
    var PersonalImgbbAPI = ''; //Add your personal imgBB API here to control the images

    // Add CSS for loading, check, and cross icons
    var style = document.createElement('style');
    style.innerHTML = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .loading-icon {
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
            display: inline-block;
        }

        .check-icon, .cross-icon {
            display: inline-block;
            font-size: 20px;
            vertical-align: middle;
        }

        .check-icon {
            color: green;
        }

        .cross-icon {
            color: red;
        }
    `;
    document.head.appendChild(style);

    // Create the input field for file uploads
    var inputContainer = document.createElement("div");
    inputContainer.className = "btn";
    inputContainer.style.cssText = `
        display: inline-block;
        position: relative;
        outline: 0;
        padding: 0 2rem;
        text-transform: uppercase;
        vertical-align: middle;
        -webkit-tap-highlight-color: transparent;
        text-decoration: none;
        text-align: center;
        letter-spacing: .5px;
        cursor: pointer;
        background: var(--btn-1-color);
        color: #eceff1;
        transition: 0.4s;
        height: 2.5rem;
        line-height: 2.5rem;
        margin-top: 10px;
        overflow: hidden;
    `;

    var inputIcon = document.createElement("i");
    inputIcon.className = "material-icons left";
    inputIcon.innerText = "attach_file";

    var inputText = document.createElement("span");
    inputText.innerText = "Select Screenshots";

    var inputField = document.createElement("input");
    inputField.type = "file";
    inputField.id = "myFile";
    inputField.multiple = true;
    inputField.style.cssText = `
        position: absolute;
        top: 0;
        right: 0;
        margin: 0;
        padding: 0;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        height: 100%;
        width: 100%;
    `;

    inputContainer.appendChild(inputIcon);
    inputContainer.appendChild(inputText);
    inputContainer.appendChild(inputField);

    // Create a new div to hold the input and button
    var newDiv = document.createElement("div");
    newDiv.style.cssText = `
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin-top: 5px;
    `;

    // Append the input to the new div
   newDiv.appendChild(inputContainer);

    // Find the "Preview" button to insert the new div after it
    var previewButton = document.querySelector('.preview-trigger.teal.darken-3');

    if (previewButton) {
        // Insert the new div after the "Preview" button's parent
        previewButton.parentNode.insertAdjacentElement('afterend', newDiv);

        // Attach event listener for the input field
        inputField.addEventListener('change', function() {
            var files = inputField.files;
            if (files.length > 0) {
                inputText.innerHTML = '<span class="loading-icon"></span> Uploading...';

                var allUploads = [];
                for (var i = 0; i < files.length; i++) {
                    allUploads.push(uploadFile(files[i]));
                }

                Promise.all(allUploads).then(results => {
                    let allSuccessful = results.every(result => result.success);
                    if (allSuccessful) {
                        inputText.innerHTML = '<i class="material-icons check-icon">check_circle</i> Upload Successful';
                    } else {
                        inputText.innerHTML = '<i class="material-icons cross-icon">error</i> Upload Failed';
                    }
                }).catch(() => {
                    inputText.innerHTML = '<i class="material-icons cross-icon">error</i> Upload Failed';
                });
            }
        });

        function uploadFile(file) {
            return new Promise((resolve) => {
                var formData = new FormData();
                formData.append("image", file);

                // Check for personal API
                var apiKey = PersonalImgbbAPI ==='' ? '1ba57bfb370dafd1dc4e44dcee29aea5' : PersonalImgbbAPI;


                var settings = {
                  "url": "https://api.imgbb.com/1/upload?key="+apiKey,
                  "method": "POST",
                  "timeout": 0,
                  "processData": false,
                  "mimeType": "multipart/form-data",
                  "contentType": false,
                  "data": formData
                };

                $.ajax(settings).done(function (response) {
                  //console.log(response);
                  var jx = JSON.parse(response);
                  if (jx.data) {
                      //Fill the url with BBCODE
                      var textarea = document.getElementById('torr-descr');
                        if (textarea) {
                            var preBB = "[url=";
                            var midBB = "][img]";
                            var endBB = "[/img][/url]\n";
                            //Check personal setting for thumbnail or medium or main image
                            var urlForImage = jx.data.url;

                            if(IsThumbnailorMedium === '1'){
                                urlForImage = jx.data.thumb.url;
                           }
                            if(IsThumbnailorMedium === '2'){
                                urlForImage = jx.data.medium.url;
                            }

                            //Make the BBCODE according to user
                            var MakePhotoToBB = preBB+jx.data.url_viewer+midBB+urlForImage+endBB;
                            textarea.value += MakePhotoToBB;
                            //photo
        }
                      resolve({ success: true, data: jx.data });
                  } else {
                      resolve({ success: false });
                  }
                }).fail(function () {
                  resolve({ success: false });
                });
            });
        }
    }
})();

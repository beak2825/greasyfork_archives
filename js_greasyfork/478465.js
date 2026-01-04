// ==UserScript==
// @name         discord real custom icon.
// @namespace    NoBitches?!
// @match        https://discord.com/*
// @grant        GM_xmlhttpRequest
// @description  Just read the desc on page.
// @license      MIT
// @version      0.1
// @downloadURL https://update.greasyfork.org/scripts/478465/discord%20real%20custom%20icon.user.js
// @updateURL https://update.greasyfork.org/scripts/478465/discord%20real%20custom%20icon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and show the text box for custom URL input
    function createTextBox() {
        var textBox = document.createElement('input');
        textBox.type = 'text';
        textBox.placeholder = 'Enter image URL';
        textBox.style.position = 'fixed';
        textBox.style.bottom = '20px';
        textBox.style.right = '20px';
        textBox.style.zIndex = '9999';

        var submitButton = document.createElement('button');
        submitButton.innerText = 'Submit';
        submitButton.style.marginLeft = '4px';
        submitButton.style.position = 'fixed';
        submitButton.style.bottom = '22px';
        submitButton.style.right = '170px';
        submitButton.style.zIndex = '9999';

        var LoadButton = document.createElement('button');
        LoadButton.innerText = 'Load Last';
        LoadButton.style.marginLeft = '4px';
        LoadButton.style.position = 'fixed';
        LoadButton.style.bottom = '50px';
        LoadButton.style.right = '170px';
        LoadButton.style.zIndex = '9999';

        // Find the SVG element using its class or ID
        function findSVGElement() {
            return document.querySelector('.childWrapper__01b9c'); // Replace with the actual class or ID of the SVG element
        }

        // Function to fetch and replace the SVG with the custom image
        function fetchAndReplaceSVG(url) {
            var svgElement = findSVGElement();

            if (svgElement) {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    responseType: 'blob',
                    onload: function(response) {
                        if (response.status === 200) {
                            var blob = response.response;
                            var blobUrl = URL.createObjectURL(blob);

                            var newImageElement = document.createElement('img');
                            newImageElement.src = blobUrl;
                            newImageElement.setAttribute('draggable', 'false');
                            newImageElement.style.width = '48px';
                            newImageElement.style.height = '48px';
                            newImageElement.id = 'previous';

                            document.body.appendChild(newImageElement);

                            var SaveButton = document.createElement('button');
                            SaveButton.innerText = 'Save';
                            SaveButton.style.marginLeft = '4px';
                            SaveButton.style.position = 'fixed';
                            SaveButton.style.bottom = '80px';
                            SaveButton.style.right = '260px';
                            SaveButton.style.zIndex = '9999';

                            SaveButton.addEventListener('click', function() {
                                // Save the URL to local storage
                                localStorage.setItem('PreviousURL', url);

                                // Hide the text box and buttons
                                textBox.style.display = 'none';
                                submitButton.style.display = 'none';
                                LoadButton.style.display = 'none';
                                SaveButton.style.display = 'none'; // Hide the "Save" button
                            });

                            document.body.appendChild(SaveButton);

                            svgElement.parentNode.replaceChild(newImageElement, svgElement);
                        } else {
                            console.error('Image fetch request failed with status code:', response.status);
                        }
                    },
                    onerror: function(response) {
                        console.error('Image fetch request error:', response);
                    }
                });
            }
        }

        // Add click event listener to the submit button
        submitButton.addEventListener('click', function() {
            var url = textBox.value;
            fetchAndReplaceSVG(url);
        });

        // Add click event listener to the load button
        LoadButton.addEventListener('click', function() {
            var previousURL = localStorage.getItem('PreviousURL');
            if (previousURL) {
                fetchAndReplaceSVG(previousURL);
                textBox.value = previousURL;
            }
        });

        document.body.appendChild(textBox);
        document.body.appendChild(submitButton);
        document.body.appendChild(LoadButton);
    }

    // Call the createTextBox function
    createTextBox();
})();

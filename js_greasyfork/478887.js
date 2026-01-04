// ==UserScript==
// @name         YandexGPT
// @namespace    your-namespace
// @version      1.0
// @description  YandexGPT для обобщения статей и текстов.
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478887/YandexGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/478887/YandexGPT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a floating button
    var floatingButton = document.createElement('div');
    floatingButton.style.position = 'fixed';
    floatingButton.style.bottom = '20px';
    floatingButton.style.right = '20px';
    floatingButton.style.width = '100px';
    floatingButton.style.height = '40px';
    floatingButton.style.backgroundColor = 'blue';
    floatingButton.style.borderRadius = '5px';
    floatingButton.style.cursor = 'move';
    floatingButton.style.color = 'white';
    floatingButton.style.textAlign = 'center';
    floatingButton.style.lineHeight = '40px';
    floatingButton.style.zIndex = '9999';
    floatingButton.textContent = 'Summarize';
    document.body.appendChild(floatingButton);

    // Make the button draggable
    var isDragging = false;
    var startOffsetX = 0;
    var startOffsetY = 0;

    floatingButton.addEventListener('mousedown', function(event) {
        if (event.target === floatingButton) {
            isDragging = true;
            startOffsetX = event.clientX - floatingButton.offsetLeft;
            startOffsetY = event.clientY - floatingButton.offsetTop;
        }
    });

    document.addEventListener('mousemove', function(event) {
        if (isDragging) {
            var newX = event.clientX - startOffsetX;
            var newY = event.clientY - startOffsetY;
            floatingButton.style.left = newX + 'px';
            floatingButton.style.top = newY + 'px';
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

    // Add click event to the floating button
    floatingButton.addEventListener('click', function() {
        // Send a request to the API
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://300.ya.ru/api/sharing-url',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'OAuth <token>'  // Замените <token> своим фактическим токеном для авторизации.
            },
            data: JSON.stringify({ 'article_url': window.location.href }),
            onload: function(response) {
                var data = JSON.parse(response.responseText);
                if (data.status === 'success') {
                    var sharingUrl = data.sharing_url;

                    // Open the sharing URL in a new tab or popup window
                    var openMethod = 'newTab';  // Change this to 'popupWindow' if you want to open a popup window instead

                    if (openMethod === 'newTab') {
                        window.open(sharingUrl, '_blank');
                    } else if (openMethod === 'popupWindow') {
                        window.open(sharingUrl, '_blank', 'width=500,height=600');
                        window.close();
                    }
                } else {
                    console.error('Error in request:', response.status);
                    var errorMessage = response.status + ': ' + data.status + ', ' + data.message + ' Please try entering your link or text manually in the opened window';
                    var errorElement = document.getElementById('error-message');
                    errorElement.innerHTML = '';
                    var errorSpan = document.createElement('span');
                    errorSpan.style.color = 'blue';
                    errorSpan.textContent = errorMessage;

                    // Open the page for manual link entry
                    window.open('https://300.ya.ru', '_blank', 'width=500,height=600');

                    errorElement.appendChild(errorSpan);
                }
            },
            onerror: function(response) {
                console.error('Error in request:', response.status);
            }
        });
    });
})();
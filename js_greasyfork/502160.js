// ==UserScript==
// @name        Filehaus Short URL Generator
// @namespace   Violentmonkey Scripts
// @match       https://filehaus.top/*
// @match       https://filehaus.pk/*
// @match       https://filehaus.su/*
// @grant       GM_xmlhttpRequest
// @version     1.1
// @description 7/30/2024, 11:04:33 AM
// @downloadURL https://update.greasyfork.org/scripts/502160/Filehaus%20Short%20URL%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/502160/Filehaus%20Short%20URL%20Generator.meta.js
// ==/UserScript==


function generatePass() {
    let pass = '';
    let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        'abcdefghijklmnopqrstuvwxyz0123456789@#$';

    for (let i = 1; i <= 8; i++) {
        let char = Math.floor(Math.random() *
            str.length + 1);

        pass += str.charAt(char)
    }

    return pass;
}

function generate_shortURL(long_url) {
    console.log('Generating short URL for:', long_url);
    var base_url = "https://filehaus.xyz/create";

    var formData = new FormData();
    password_genereated = generatePass()
    formData.append('long_url', long_url);
    formData.append('password', password_genereated);

    GM_xmlhttpRequest({
        method: 'POST',
        url: base_url,
        data: formData,
        onload: function(response) {
            if (response.status === 200) {
                console.log('Short URL generated:', response.responseText);
                var messageElement = document.getElementById('message');
                if (messageElement) {
                    messageElement.innerHTML = `Long URL: ${long_url}<br><br>Short URL: ${response.responseText} (Password: ${password_genereated})`;

                } else {
                    console.log('No element with id "message" found');
                }
            } else {
                console.log('Error:', response.status, response.responseText);
            }
        },
        onerror: function(error) {
            console.log('Request failed:', error);
        }
    });
}

function checkAndGenerateURL(text) {
    const regex_filehaus = /^https?:\/\/cdn[1-9]\.filehaus\.su\/files\/\d+_\d+_\d+\/[^\/]+\.[a-zA-Z0-9]+$/;
    const regex_filehaus_2 = new RegExp("^https?:\\/\\/cdn[1-9]\\.filehaus\\.su\\/files\\/\\d+_\\d+\\/[^\\/]+\\.[a-zA-Z0-9]+$");
    const regex_url = /https?:\/\/[^\s]+/g;

    const urls = text.match(regex_url);
    if (urls) {
        urls.forEach(url => {
            if (regex_filehaus.test(url) || regex_filehaus_2.test(url)) {
                console.log("The string matches the pattern:", url);
                generate_shortURL(url);
            } else {
                console.log("The string does not match the pattern:", url);
            }
        });
    } else {
        console.log("No URLs found in the text");
    }
}

function createButton() {
    const button = document.createElement('button');
    button.textContent = 'Generate Short URL';
    button.style.cssText = `
        margin-left: 10px;
        padding: 5px 10px;
        border: none;
        border-radius: 12px;
        background-color: #4CAF50;
        color: white;
        cursor: pointer;
        font-size: 12px;
    `;
    button.addEventListener('click', () => {
        const messageElement = document.getElementById('message');
        if (messageElement) {
            const messageContent = messageElement.textContent;
            console.log('Button clicked, message content:', messageContent);
            alert("You may need to VISIT the website first, for cloudflare not to block this request,")
            checkAndGenerateURL(messageContent);
        } else {
            console.log('Message element not found');
        }
    });
    return button;
}

(function() {
    'use strict';

    function startObserving() {
        const targetNode = document.getElementById('message');
        if (targetNode) {
            if (!document.getElementById('generateShortURLButton')) {
                const button = createButton();
                button.id = 'generateShortURLButton';
                targetNode.parentNode.insertBefore(button, targetNode.nextSibling);
                console.log('Button added next to message element');
            }
        } else {
            console.log('Message element not found, retrying in 1 second');
            setTimeout(startObserving, 1000);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startObserving);
    } else {
        startObserving();
    }
})();
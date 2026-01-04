// ==UserScript==
// @name         Add magnets to mOnkrus.ws
// @version      1.1
// @description  Extracts the magnet link from uniondht.org and adds it to the original page.
// @author       Rust1667
// @icon         https://icons.duckduckgo.com/ip3/w14.monkrus.ws.ico
// @match        https://w14.monkrus.ws/*
// @exclude-match https://w14.monkrus.ws/
// @exclude-match https://w14.monkrus.ws/search/*
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/980489
// @downloadURL https://update.greasyfork.org/scripts/486934/Add%20magnets%20to%20mOnkrusws.user.js
// @updateURL https://update.greasyfork.org/scripts/486934/Add%20magnets%20to%20mOnkrusws.meta.js
// ==/UserScript==

window.onload = function() {
    'use strict';

    // Find all links pointing to uniondht.org within the post content
    const links = document.querySelectorAll('.post-body.entry-content a[href*="uniondht.org"]');

    let uniondhtLink = null;

    // Loop through all links to find the correct uniondhtLink
    links.forEach(link => {
        if (isValidURL(link.href)) {
            uniondhtLink = link;
        }
    });

    if (uniondhtLink) {
        // Extract the URL
        const url = uniondhtLink.href;

        // Send request to uniondht.org to fetch the page content
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                // Extract magnet link
                const parser = new DOMParser();
                const htmlDoc = parser.parseFromString(response.responseText, "text/html");
                const magnetLinkElement = htmlDoc.querySelector('td.tCenter:nth-child(3) > p:nth-child(2) > a:nth-child(1)');
                if (magnetLinkElement) {
                    const magnetLink = magnetLinkElement.href;
                    // Create link element in the original page
                    const magnetButton = document.createElement('a');
                    magnetButton.href = magnetLink;
                    magnetButton.title = "Magnet found";
                    magnetButton.innerHTML = '<img src="https://uniondht.org/images/magnet.png" alt="magnet">';

                    // Append the magnet link button to the bottom of the post content
                    const postContent = document.querySelector('.post-body.entry-content');
                    if (postContent) {
                        postContent.appendChild(magnetButton);
                    }
                } else {
                    // Show "Magnet not found" message
                    showMagnetNotFoundMessage();
                }
            }
        });
    } else {
        // Show "Magnet not found" message
        showMagnetNotFoundMessage();
    }
};

// Function to check if URL is valid
function isValidURL(url) {
    const pattern = /^(http|https):\/\/[^ "]+$/;
    return pattern.test(url);
}

// Function to show "Magnet not found" message
function showMagnetNotFoundMessage() {
    const postContent = document.querySelector('.post-body.entry-content');
    if (postContent) {
        const magnetNotFoundMessage = document.createElement('p');
        magnetNotFoundMessage.textContent = "Magnet not found";
        magnetNotFoundMessage.style.color = "red";
        postContent.appendChild(magnetNotFoundMessage);
    }
}

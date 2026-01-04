// ==UserScript==
// @name         e621 tag extract
// @namespace    http://tampermonkey.net/
// @version      2024-06-18
// @description  add a button on post page that list all tags joined by comma, I hope you find it somewhat helpful in AI image prompts with https://t.me/makefoxbot. :)
// @author       shadystray (chatgpt really)
// @match        https://e621.net/posts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e621.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498301/e621%20tag%20extract.user.js
// @updateURL https://update.greasyfork.org/scripts/498301/e621%20tag%20extract.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Function to find and join text by XPath
    function findAndJoinTextByXPath(xpath) {
        let results = [];
        let nodesSnapshot = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
        let node = nodesSnapshot.iterateNext();

        while (node) {
            results.push(node.textContent);
            node = nodesSnapshot.iterateNext();
        }

        return results.join(", ");
    }

    // Create the floating button
    let button = document.createElement('button');
    button.id = 'floatingButton';
    button.textContent = '+';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.backgroundColor = '#007bff';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '50%';
    button.style.width = '50px';
    button.style.height = '50px';
    button.style.textAlign = 'center';
    button.style.fontSize = '24px';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.3)';

    // Add click event listener to the button
    button.addEventListener('click', function() {
        let xpath = '/html/body/div[1]/div[3]/div/aside/section[3]/ul/li/a[@class="search-tag"]/text()'; // Replace with your XPath
        let joinedText = findAndJoinTextByXPath(xpath);
        console.log(joinedText);
        alert(joinedText); // Display the result in an alert for demonstration
    });

    // Append the button to the body
    document.body.appendChild(button);
})();
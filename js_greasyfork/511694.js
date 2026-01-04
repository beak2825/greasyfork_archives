// ==UserScript==
// @name         Infinite Image Generator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Generate images infinitely using OpenAI's DALL-E API
// @author       Your Name
// @match        *://*/*  // Adjust this to match your desired sites
// @grant        GM_xmlhttpRequest
// @connect      api.openai.com
// @downloadURL https://update.greasyfork.org/scripts/511694/Infinite%20Image%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/511694/Infinite%20Image%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_KEY = 'YOUR_API_KEY'; // Replace with your API key

    function generateImage(prompt) {
        const url = "https://api.openai.com/v1/images/generations";
        
        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            },
            data: JSON.stringify({
                prompt: prompt,
                n: 1,
                size: "1024x1024"
            }),
            onload: function(response) {
                if (response.status === 200) {
                    const imageUrl = JSON.parse(response.responseText).data[0].url;
                    alert(`Generated image URL: ${imageUrl}`);
                } else {
                    console.error("Error:", response.status, response.responseText);
                }
            }
        });
    }

    function promptForImage() {
        let prompt = prompt("Enter your image description (or type 'exit' to quit):");
        if (prompt === null || prompt.toLowerCase() === 'exit') {
            return;
        }
        generateImage(prompt);
        promptForImage(); // Repeat for more images
    }

    promptForImage(); // Start the prompt
})();

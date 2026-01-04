// ==UserScript==
// @name         LLaMA 8B Floating Chat
// @version      3.0
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/
// @description Adds a draggable ChatGPT button to Discord with an inbuilt ChatGPT chatbox
// @downloadURL https://update.greasyfork.org/scripts/545802/LLaMA%208B%20Floating%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/545802/LLaMA%208B%20Floating%20Chat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Floating button
    const btn = document.createElement("img");
    btn.src = "https://i.imgur.com/hPpHX9b.jpeg";
    btn.style.position = "fixed";
    btn.style.bottom = "20px";
    btn.style.right = "20px";
    btn.style.width = "60px";
    btn.style.height = "60px";
    btn.style.borderRadius = "50%";
    btn.style.cursor = "pointer";
    btn.style.zIndex = 10000;
    btn.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
    document.body.appendChild(btn);

    // Chat box
    const chatBox = document.createElement("div");
    chatBox.style.position = "fixed";
    chatBox.style.bottom = "90px";
    chatBox.style.right = "20px";
    chatBox.style.width = "300px";
    chatBox.style.height = "400px";
    chatBox.style.background = "#fff";
    chatBox.style.border = "1px solid #ccc";
    chatBox.style.borderRadius = "10px";
    chatBox.style.padding = "10px";
    chatBox.style.display = "none";
    chatBox.style.flexDirection = "column";
    chatBox.style.zIndex = 10000;
    chatBox.style.overflowY = "auto";
    chatBox.style.fontFamily = "sans-serif";
    chatBox.style.color = "#000";
    document.body.appendChild(chatBox);

    // Input container
    const inputContainer = document.createElement("div");
    inputContainer.style.display = "flex";
    inputContainer.style.marginTop = "auto";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Type your message...";
    input.style.flex = "1";
    input.style.padding = "5px";

    const sendBtn = document.createElement("button");
    sendBtn.textContent = "Send";
    sendBtn.style.marginLeft = "5px";

    inputContainer.appendChild(input);
    inputContainer.appendChild(sendBtn);
    chatBox.appendChild(inputContainer);

    // Toggle chat box
    btn.addEventListener("click", () => {
        chatBox.style.display = chatBox.style.display === "none" ? "flex" : "none";
    });

    // Send message
    function sendMessage() {
        const message = input.value.trim();
        if (!message) return;
        input.value = "";

        const userDiv = document.createElement("div");
        userDiv.textContent = "You: " + message;
        chatBox.appendChild(userDiv);

        GM_xmlhttpRequest({
            method: "POST",
            url: "https://llama-3-znq8.vercel.app/api/llama", // Your Vercel API
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify({ message }),
            onload: function(response) {
                console.log("Raw response:", response.responseText);
                try {
                    const data = JSON.parse(response.responseText);
                    const respDiv = document.createElement("div");
                    respDiv.textContent = "LLaMA: " + (data.text || "No response");
                    chatBox.appendChild(respDiv);
                    chatBox.scrollTop = chatBox.scrollHeight;
                } catch(e) {
                    alert("Failed to parse response. Check console.");
                    console.error("Parsing error:", e, response.responseText);
                }
            },
            onerror: function() { alert("Request failed"); }
        });
    }

    sendBtn.addEventListener("click", sendMessage);
    input.addEventListener("keypress", e => { if(e.key === "Enter") sendMessage(); });
})();

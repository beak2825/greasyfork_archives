// ==UserScript==
// @name         Instagram Chat Bot
// @namespace    https://github.com/swempish
// @version      1.0.6
// @description  A script that adds a side panel to Instagram's DM section. Activates an AI-powered bot to automatically reply to incoming messages.
// @author       Emirhan Çolak
// @match        https://www.instagram.com/direct/t/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license GPL-3.0
// @require      https://code.jquery.com/jquery-3.7.1.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/506613/Instagram%20Chat%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/506613/Instagram%20Chat%20Bot.meta.js
// ==/UserScript==

// Side panel element (Start bot button)
var panelElement = `

<div style="
    justify-content: center;
    display: flex;
    flex-direction: column;
    text-align: center;
    padding: 1rem;
    gap: 1rem;
">
    <h2>Insta Chat Bot Utilz</h2>
    <button id="startTheBot" style="
    min-height: 2rem;
    max-width: 14rem;
    margin: auto;
    width: 100%;
    cursor: pointer;
">Start the Bot!</button>
    <div style="
    border-style: outset;
    border-color: brown;
    background-color: rgb(66,66,66);
    text-align: left;
    padding: 0 .2rem 0 .2rem;
    font-family: monospace;
    font-size: x-small;
    word-break: break-all;
    overflow-x: hidden;
    overflow-y: auto;
    max-height: 8rem;
    height: 100%;
    display: none;
" id="botLogChat">
        <p>Log</p>
    </div>
</div>

`;

const injectCSS = css => {
    let el = document.createElement('style');
    el.type = 'text/css';
    el.innerText = css;
    document.head.appendChild(el);
    return el;
};

var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

var personalities = [
    'Your name is Emirhan. You are talking to someone in Instagram. Reply to them.' // Put here your personality prompt
]

const GEMINI_API_KEY = "YOUR-GEMINI-API-KEY";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

var bot_config = {
    contents: [
        {
            role: "user",
            parts: [{ text: personalities[0] }]
        },
        {
            role: "model",
            parts: [{ text: "Okay." }]
        },
    ],
    "safetySettings": [
        {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE"
        },
        {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_NONE"
        },
        {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE"
        },
        {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE"
        },
    ]
}

async function generate_ai_response(input) {

    // Provide time information to the bot
    //save_message("*** SYSTEM MESSAGE *** Time: " + new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) + " Date: " + new Date().toLocaleDateString() + " Day of the week: " + days[new Date().getDay()], "user");
//save_message("*** DATE AND TIME RECORDED ***", "model");

    save_message(input, "user");
    const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        body: JSON.stringify(bot_config),
    });

    const result = await response.json();
    save_message(result["candidates"][0]["content"]["parts"][0]["text"], "model");
    return String(result["candidates"][0]["content"]["parts"][0]["text"]);
}

function save_message(message, role) {
    bot_config["contents"].push({ role: role, parts: [{ text: message }] });
}

var lastSentMessage = "---------------";
var generatingResponse = false;

var lastChatContent = "";
var isButtonAvailable = false;

function main() {
    // Add the start bot button
    if(!isButtonAvailable){
        document.querySelector("main > section > div > div > div > div > div > div > div > div:nth-child(2) > div > div > div > div > div:nth-child(2)").innerHTML = panelElement + document.querySelector("main > section > div > div > div > div > div > div > div > div:nth-child(2) > div > div > div > div > div:nth-child(2)").innerHTML;
    isButtonAvailable = true;
    }

    var chatContainer = document.querySelector("main > section > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div:nth-child(3) > div");
    var sendButton = document.querySelector("main > section > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div:nth-child(2) > div > div > div:nth-child(3)");

    document.querySelector("#startTheBot").addEventListener("click", function () {
        var inputPlaceholderElement = document.querySelector("main > section > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div:nth-child(2) > div > div > div > div > div:nth-child(2)");
        inputPlaceholderElement.innerText = "Controlled by the bot...";
        $("#botLogChat").show();
        logBot("Starting the bot...");
        injectCSS('*{--messenger-card-background: rgb(34 113 120);}');
        lastChatContent = chatContainer.innerHTML;

        // Create a new interval that will check chatContainer's innerHTML and if it changes, generate a response
        var elementTesterInterval = setInterval(async () => {
            if (!generatingResponse && chatContainer.innerHTML != lastChatContent) {
                var chatSize = chatContainer.childNodes.length;
                var lastMessage = "";

                for (let index = 1; index < chatContainer.childNodes[chatSize - 2].getElementsByTagName("span").length; index++) {
                    lastMessage += chatContainer.childNodes[chatSize - 2].getElementsByTagName("span")[index].innerText + " ";
                }

                var whoSent = chatContainer.childNodes[chatSize - 2].getElementsByTagName("span")[0].innerText == "You sent" ? "yourself" : "other";

                if (generatingResponse || whoSent == "yourself") {
                    return;
                }

                logBot("Got message from user. Waiting for AI response...");
                generatingResponse = true;
                var response = await generate_ai_response(lastMessage);

                logBot(`Got the response: ${response.slice(0, 30) + "..."}`);

                lastSentMessage = response;
                typeAndSend(response, sendButton);
            }
        }, 100);

        var observer = new MutationObserver(function (mutations) {
            // Iterate over each mutation record
            mutations.forEach(async function (mutation) {
                if (mutation.type === 'childList') {

                }
            });
        });

        // Configure the observer to observe changes in childList
        var config = { childList: true };

        // Start observing the chat container element
        observer.observe(chatContainer, config);


    });
}

async function typeAndSend(text, sendButton) {
    // Insert text character by character so it looks like someone is typing. Max duration is 1 second
    // This is to simulate human typing
    for (var i = 0; i < text.length; i++) {
        document.execCommand('insertText', false, text.charAt(i));
        await new Promise(r => setTimeout(r, 100));
    }
    // Wait for 1 second
    await new Promise(r => setTimeout(r, 100));
    sendButton.click();
    generatingResponse = false;
    await new Promise(r => setTimeout(r, 100));
    inputPlaceholderElement.innerText = "Controlled by the bot...";
}

// Log to chat div. Put logs to bottom
function logBot(text) {
    document.querySelector("#botLogChat").innerHTML += "<p>" + text + "</p>";
    document.querySelector("#botLogChat").scrollTop = document.querySelector("#botLogChat").scrollHeight;
}


$(document).ready(function () {
    var elementTesterInterval = setInterval(() => {
        if (document.querySelector("main > section > div > div > div > div > div > div > div > div:nth-child(2) > div > div > div > div > div:nth-child(2)")) {
            clearInterval(elementTesterInterval);
            main();
        }
    }, 1000);
});
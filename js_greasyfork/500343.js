// ==UserScript==
// @license MIT 
// @name         torn-discord-webhook
// @namespace    kindly.torn.discord-webhook
// @version      0.0.1
// @description  allows you to send messages into a discord channel from torn
// @author       Kindly
// @match        https://www.torn.com/*
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @connect     discord.com
// @downloadURL https://update.greasyfork.org/scripts/500343/torn-discord-webhook.user.js
// @updateURL https://update.greasyfork.org/scripts/500343/torn-discord-webhook.meta.js
// ==/UserScript==

/*
    Go to discord -> server settings -> integrations -> webhooks -> select your channel -> copy webhook url

    replace the url below with your webhook url
*/

const webhookUrl = "https://discord.com/api/webhooks";

/*
 * -------------------------------------------------------------------------
 * |    DO NOT MODIFY BELOW     |
 * -------------------------------------------------------------------------
 */

(function() {
    'use strict';

    let sidebarNode = document.getElementById("sidebar");
    if (!sidebarNode) { console.log("couldn't find sidebar") };

    let webhookDiv = document.createElement('div');
    webhookDiv.className = "tt-container collapsible compact tt-theme-background";
    webhookDiv.id = "discordWebhook"

    let titleDiv = document.createElement('div');
    titleDiv.className = "title collapsed";
    titleDiv.addEventListener("click", () => {
       titleDiv.className = titleDiv.className == "title collapsed" ? "title " : "title collapsed";
    });

    let textDiv = document.createElement('div');
    textDiv.className = "text";
    textDiv.textContent = "Discord";

    let icon = document.createElement('i');
    icon.className = "icon fas fa-caret-down";

    let main = document.createElement('main');

    let textArea = document.createElement('textarea');
    textArea.id = "discordWebhookTA";
    textArea.className = "notes";
    textArea.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.keyCode === 13) {
            event.preventDefault();
            sendDiscordMessage(textArea.value);
        }
    });

    main.append(textArea);

    titleDiv.appendChild(textDiv);
    titleDiv.appendChild(icon);
    webhookDiv.appendChild(titleDiv);
    webhookDiv.appendChild(main);

    // Insert the new div with the form as the second child of myDiv
    sidebarNode.insertBefore(webhookDiv, sidebarNode.children[1]);
})();

function changeColorAndRevert(textArea, color) {
    return new Promise(function(resolve) {
        let originalColour = textArea.style.color;

        textArea.style.color = color;
        setTimeout(function() {
            textArea.style.color = originalColour;
            resolve();
        }, 100);
    });

}

function handleResponse(response) {
    let textArea = document.getElementById("discordWebhookTA")

    if (response?.status !== 204) {
        console.log(response?.status);
        console.log(response?.responseText);
        changeColorAndRevert(textArea, 'red');
        return
    }
    changeColorAndRevert(textArea, 'green').then(() => {textArea.value = ''});
}

function getSessionData() {
  const sidebar = Object.keys(sessionStorage).find((k) => /sidebarData\d+/.test(k));
  const data = JSON.parse(sessionStorage.getItem(sidebar));
  return {
    userName: data.user.name,
  };
}

function sendDiscordMessage(content) {
    let session = getSessionData();
    let data = JSON.stringify({
        username: session.userName,
        content: content,
    })
    GM_xmlhttpRequest({
    method: "POST",
    url: webhookUrl,
    headers: {
        'Content-Type': 'application/json'
    },
    data: data,
    onload: (r) => {
      handleResponse(r);
    },
  });
}

GM_addStyle(`

    body.dark-mode #discordWebhook .notes {
        color: rgb(255, 255, 255);
    }

    #discordWebhook .notes {
        margin-top: 2px;
        width: 100%;
        min-height: 22px;
        background-color: var(--default-bg-panel-color);
        box-sizing: border-box;
        resize: vertical;
        border: unset;
        padding: 3px;
        border-radius: 0px 5px 5px 0px;
    }
`)
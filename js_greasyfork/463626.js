// ==UserScript==
// @name         Ignorator
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Get users out of sight
// @author       Milan
// @match        *://*.websight.blue/thread/*
// @match        *://*.websight.blue/threads/*
// @match        *://websight.blue
// @match        *://websight.blue/multi/*
// @icon         https://lore.delivery/static/blueshi.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463626/Ignorator.user.js
// @updateURL https://update.greasyfork.org/scripts/463626/Ignorator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const addBlock = (message) => {
        const userprofile = message.getElementsByTagName("a")[0].href;
        const blocklist = JSON.parse(localStorage.getItem("ignorator-blocklist")) || [];
        localStorage.setItem("ignorator-blocklist", JSON.stringify([...blocklist, userprofile]));
        filterMessages([...blocklist, userprofile]);
    }

    const filterMessages = (blocklist) => {
        const messagesToBlock = [...document.querySelectorAll(".message-top a.post-author")].filter(userprofile => {
            return blocklist.includes(userprofile.href);
        })

        messagesToBlock.forEach(blockedMessage => {
            blockedMessage.parentElement.parentElement.style.display = "none";
        });
    }

    const filterTopics = (blocklist) => {
        const blocklistnames = blocklist.map(item => {
            return item.split("/")[4];
        });
        const topicsToBlock = [...document.querySelectorAll("#thread-list td.antizalgo")].filter(topiccreator => {
            const urlParts = topiccreator.getElementsByTagName("a")[0].href.split("/");
            const name = urlParts[urlParts.length-1];
            return blocklistnames.includes(name);
        });
                topicsToBlock.forEach(blockedTopic => {
            blockedTopic.parentElement.style.display = "none";
        });
    }

    const addButton = (message) => {
        const button = document.createElement("a");
        const buttonText = document.createTextNode("Block");
        const seperator = document.createTextNode(" | ");
        button.href="#";
        button.onclick=(e)=>{
            e.preventDefault();
            addBlock(message);
        }
        message.appendChild(seperator);
        message.appendChild(button);
        button.appendChild(buttonText);
    }

    document.querySelectorAll(".message-top").forEach(message => {
        if (message.parentElement.parentElement.id != "reply-area") {
            addButton(message)
        }
    });

    if(document.querySelector("#messages")) {
        filterMessages(JSON.parse(localStorage.getItem("ignorator-blocklist")) || []);
    }

    if(document.querySelector(".grid")) {
        filterTopics(JSON.parse(localStorage.getItem("ignorator-blocklist")) || []);
    }

})();
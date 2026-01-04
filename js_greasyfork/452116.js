// ==UserScript==
// @name         Teleparty Chat Unlocker
// @namespace    http://tampermonkey.net/
// @version      -65
// @description  Adds a button to unlock the teleparty chat because of the disconnection bug.
// @author       Lumi
// @match        https://www.netflix.com/watch/*
// @match        https://www.netflix.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=netflix.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452116/Teleparty%20Chat%20Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/452116/Teleparty%20Chat%20Unlocker.meta.js
// ==/UserScript==



let tScript = document.createElement('script');
tScript.text = `
let clickCount = 0;
let clickDisabled = false;

function tclick() {
    if (clickDisabled) return;
    clickCount++;
    if (clickCount == 3) {
        clickCount = 0;
        document.getElementById("title").children[0].innerText = "I love you 🥺❤️❤️";
        clickDisabled = true
        setTimeout(() => {
            document.getElementById("title").children[0].innerText = "Teleparty";
            clickDisabled = false;
        }, 3500)
    }
}
`

let unlockScript = `
<img onclick="document.getElementById('chat-input').setAttribute('contenteditable', 'true')" class="chat-link" src="https://i.imgur.com/WReRMtb.png" data-tp-id="chat_menu_container-copy_link">
<span class="tooltiptext extension-txt" style="width: 120px;">Unlock Chat</span>
`

function inject() {
    const node = document.createElement("div");
    node.setAttribute('id', 'link-icon');
    node.setAttribute('class', 'tp-toolcontainer');
    node.innerHTML = unlockScript;

    let functionElement = document.getElementById('function-user')
    let LinkIcon = functionElement.firstChild

    functionElement.insertBefore(node, LinkIcon)
}

let injectionInterval = setInterval(() => {
    if (document.getElementById("function-user")) {
        inject();
        document.getElementsByTagName('head')[0].appendChild(tScript);
        document.getElementById('title').setAttribute('onclick', 'tclick()');
        clearInterval(injectionInterval);
    }
}, 1000)

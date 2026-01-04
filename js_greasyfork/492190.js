// ==UserScript==
// @name         FlashIdiot
// @namespace    http://tampermonkey.net/
// @version      V1
// @description  FlashingIdiot Script
// @author       Ludum
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492190/FlashIdiot.user.js
// @updateURL https://update.greasyfork.org/scripts/492190/FlashIdiot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const id = "FlashingIdiot";
    const title = "YOU ARE AN IDIOT";
    const count = 50; // Number of floating popups

    // HTML structure for notification popup
    const notification = `
<div class="${id}">
  <h1>${title}</h1>
</div>
`;

    const style = `
.${id} {
    position: fixed;
    width: 270px;
    height: 200px;
    background-color: red;
    border: 1px solid black;
    border-radius: 15px;
    padding: 5%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999999;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: flash 1s infinite linear;
}

.${id}.teleport {
    animation: teleport 10s ease-in-out infinite;
}

@keyframes flash {
  0% {
    background-color: red;
  }
  50% {
    background-color: black;
  }
  100% {
    background-color: red;
  }
}

@keyframes teleport {
  0% {
    top: 50%;
    left: 50%;
  }
  25% {
    top: 5%;
    left: 95%;
  }
  50% {
    top: 95%;
    left: 5%;
  }
  75% {
    top: 5%;
    left: 95%;
  }
  100% {
    top: 95%;
    left: 5%;
  }
}
`;

    // Function to create notification popup
    function showNotification() {
        const styleNode = document.createElement("style");
        styleNode.innerHTML = style;
        document.head.appendChild(styleNode);

        const fragment = document.createDocumentFragment();
        for (let i = 0; i < count; i++) {
            const div = document.createElement("div");
            div.classList.add(id);
            div.innerHTML = notification;
            fragment.appendChild(div);
        }
        document.body.appendChild(fragment);

        Array.from(document.getElementsByClassName(id)).forEach((div) => {
            setTimeout(() => {
                div.classList.add("teleport");
            }, Math.random() * 10000);
        });

        setTimeout(() => {
            document.body.removeChild(fragment);
        }, 30000);
    }

    // Trigger the notification popup
    window.setInterval(() => {
        showNotification();
    }, 10000);
})();
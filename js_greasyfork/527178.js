// ==UserScript==
// @name         Chat BHS- Button
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  Chat - BackOffice
// @author       Serhat Yalcin
// @match        https://dashboardagent.reamaze.com/admin/conversations/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reamaze.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527178/Chat%20BHS-%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/527178/Chat%20BHS-%20Button.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const style = document.createElement("style");

    style.innerHTML = `
.button-container {
  position: fixed;
  bottom: 20px;
  left: 10px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  background-color: #10a2c5;
  padding: 5px 5px;
  border-radius: 5px;
}

.button {
  background-color: white;
  border: none;
  border-radius: 20px;
  color: #4CAF50;
  font-size: 16px;
  margin: 3px 0;
  padding: 5px 5px;
}

.button:hover {
  background-color: grey;
}
`;

    document.head.appendChild(style);

    const delay = (sec) => {
        return new Promise(resolve => setTimeout(resolve, sec * 1000));
    }
    const getShortcut = (arr, key) => arr?.find(x => x.name.trim() === key)?.body || '';
    const config = { childList: true, subtree: true };
    let textarea;
    let jsonShortcuts;
    let messages = [];

    function check () {
        textarea = document.querySelector('#message_body');

        if (textarea === null) {
            return;
        }

        jsonShortcuts = JSON.parse(textarea.getAttribute('data-rt-quickinsert'));

        if (jsonShortcuts.length === 0) {
            return;
        }

        messages = [
            { text: getShortcut(jsonShortcuts, 'p1'), label: "/p1" },
            { text: getShortcut(jsonShortcuts, 'p2'), label: "/p2" },
            { text: getShortcut(jsonShortcuts, 'p3'), label: "/p3" },
            { text: getShortcut(jsonShortcuts, 'bon1'), label: "/bon1" },
            { text: getShortcut(jsonShortcuts, 'z1 - uy1'), label: "/z1" },
            { text: getShortcut(jsonShortcuts, 'iban'), label: "/iban" },
            { text: getShortcut(jsonShortcuts, '444 - 1dk'), label: "/444" },
            { text: getShortcut(jsonShortcuts, 'w2'), label: "/w2" },
            { text: getShortcut(jsonShortcuts, '2dk') , label: "/2dk", close: true },
            { text: getShortcut(jsonShortcuts, 'r23'), label: "/r23", close: true },
            { text: getShortcut(jsonShortcuts, 'bb  p5'), label: "/bb", close: true },
            { text: getShortcut(jsonShortcuts, 'link'), label: "/link" },
            { text: getShortcut(jsonShortcuts, '100fs'), label: "/100fs" },
        ];

        observer.disconnect();

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add("button-container");

        messages.forEach(message => {
            const button = document.createElement('button');
            console.log(message.text);
            button.innerText = message.label;
            button.classList.add("button");

//             button.addEventListener('mouseover', function () {
//                 button.style.backgroundColor = 'grey';
//             });
//             button.addEventListener('mouseout', function () {
//                 button.style.backgroundColor = 'white';
//             });
//             button.addEventListener('mouseleave', function () {
//                 button.style.backgroundColor = 'white';
//             });

            button.onclick = async function() {
                const inputField = document.querySelector('textarea');
                if (inputField) {
                    inputField.value = message.text;
                    inputField.dispatchEvent(new Event('input', { bubbles: true }));

                    const replyButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Reply'));
                    if (replyButton) {
                        replyButton.click();

                        if (message.close) {
                            const endButton = document.querySelector('#conversation-bulk-actions .btn-group a[data-keyboard-action="end"]')
                            await delay(0.5)
                            endButton.click()
                        }
                        setTimeout(() => {
                            const sendButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Send'));
                            if (sendButton) {
                                sendButton.click();
                            }
                        }, 1000);
                    } else {
                        console.error("Reply butonu bulunamadı.");
                    }
                }
            };

            buttonContainer.appendChild(button);
        });

        if(buttonContainer) {
            document.body.appendChild(buttonContainer);
        }
    }
    const observer = new MutationObserver(check)
    observer.observe(document, config)
})();
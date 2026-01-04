// ==UserScript==
// @name         Chat Enhancements
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a download button, saves the chat to local storage, and enables widescreen mode.
// @author       InariOkami
// @match        https://character.ai/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=character.ai
// @downloadURL https://update.greasyfork.org/scripts/502377/Chat%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/502377/Chat%20Enhancements.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    (function() {
        function WideScreen() {
            var Chat = document.getElementsByClassName("overflow-x-hidden overflow-y-scroll px-1 flex flex-col-reverse min-w-full hide-scrollbar").item(0).children;
            for (var i = 0; i < Chat.length; i++) {
                Chat.item(i).style = "min-width:100%";
                document.getElementsByClassName("flex w-full flex-col max-w-2xl").item(0).style = "min-width:100%";
            }
        }
        setTimeout(() => { setInterval(WideScreen, 100); }, 1000);
    })();

    function createSaveButton() {
        const saveChatButton = document.createElement('button');
        saveChatButton.innerHTML = 'Chat Options ▼';
        saveChatButton.style.position = 'fixed';
        saveChatButton.style.top = localStorage.getItem('buttonTop') || '10px';
        saveChatButton.style.left = localStorage.getItem('buttonLeft') || '10px';
        saveChatButton.style.backgroundColor = '#ff0000';
        saveChatButton.style.color = '#ffffff';
        saveChatButton.style.padding = '10px';
        saveChatButton.style.borderRadius = '5px';
        saveChatButton.style.cursor = 'pointer';
        saveChatButton.style.zIndex = '1000';
        saveChatButton.style.border = 'none';
        saveChatButton.style.boxShadow = '0px 2px 5px rgba(0,0,0,0.2)';
        document.body.appendChild(saveChatButton);

        const dropdown = document.createElement('div');
        dropdown.style.display = 'none';
        dropdown.style.position = 'absolute';
        dropdown.style.top = '100%';
        dropdown.style.left = '0';
        dropdown.style.backgroundColor = '#333';
        dropdown.style.border = '1px solid #ccc';
        dropdown.style.boxShadow = '0px 2px 5px rgba(0,0,0,0.2)';
        dropdown.style.zIndex = '1001';
        dropdown.style.color = '#ffffff';
        dropdown.style.fontFamily = 'sans-serif';
        dropdown.style.fontSize = '14px';
        dropdown.style.padding = '5px';
        dropdown.style.cursor = 'pointer';
        dropdown.style.maxWidth = '200px';
        dropdown.style.borderRadius = '5px';
        saveChatButton.appendChild(dropdown);

        const downloadButton = document.createElement('button');
        downloadButton.innerHTML = 'Download Chat';
        downloadButton.style.display = 'block';
        downloadButton.style.width = '100%';
        downloadButton.style.border = 'none';
        downloadButton.style.padding = '10px';
        downloadButton.style.cursor = 'pointer';
        downloadButton.style.backgroundColor = '#444';
        downloadButton.style.color = '#ffffff';
        downloadButton.style.borderRadius = '5px';
        dropdown.appendChild(downloadButton);

        const saveLocalButton = document.createElement('button');
        saveLocalButton.innerHTML = 'Save to Local Storage';
        saveLocalButton.style.display = 'block';
        saveLocalButton.style.width = '100%';
        saveLocalButton.style.border = 'none';
        saveLocalButton.style.padding = '10px';
        saveLocalButton.style.cursor = 'pointer';
        saveLocalButton.style.backgroundColor = '#444';
        saveLocalButton.style.color = '#ffffff';
        saveLocalButton.style.borderRadius = '5px';
        dropdown.appendChild(saveLocalButton);

        saveChatButton.onclick = function() {
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        };

        let offsetX, offsetY;
        let isDragging = false;

        saveChatButton.addEventListener('mousedown', function(e) {
            isDragging = true;
            offsetX = e.clientX - saveChatButton.getBoundingClientRect().left;
            offsetY = e.clientY - saveChatButton.getBoundingClientRect().top;
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                saveChatButton.style.left = e.clientX - offsetX + 'px';
                saveChatButton.style.top = e.clientY - offsetY + 'px';
                localStorage.setItem('buttonTop', saveChatButton.style.top);
                localStorage.setItem('buttonLeft', saveChatButton.style.left);
            }
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
        });

        return { saveChatButton, dropdown, downloadButton, saveLocalButton };
    }

    async function fetchAndDownloadChat() {
        var token = JSON.parse(document.getElementById("__NEXT_DATA__").innerHTML).props.pageProps.token;
        var _cache;

        async function _fetchchats(charid) {
            if (!_cache) {
                let url = 'https://neo.character.ai/chats/recent/' + charid;
                let response = await fetch(url, { headers: { "Authorization": `Token ${token}` } });
                let json = await response.json();
                _cache = json['chats'];
            }
            return _cache;
        }

        async function getChats(charid) {
            let json = await _fetchchats(charid);
            return json.map(chat => chat.chat_id);
        }

        async function getMessages(chat, format) {
            let url = 'https://neo.character.ai/turns/' + chat + '/';
            let next_token = null;
            let turns = [];

            do {
                let url2 = url;
                if (next_token) url2 += "?next_token=" + encodeURIComponent(next_token);
                let response = await fetch(url2, { headers: { "Authorization": `Token ${token}` } });
                let json = await response.json();
                for (let turn of json['turns']) {
                    let o = {};
                    o.author = format === "definition" ? (turn.author.is_human ? "{{user}}" : "{{char}}") : turn.author.name;
                    o.message = turn.candidates.find(x => x.candidate_id === turn.primary_candidate_id).raw_content || "";
                    turns.push(o);
                }
                next_token = json['meta']['next_token'];
            } while (next_token);
            return turns.reverse();
        }

        async function downloadChat(format) {
            let charid = prompt('Enter character ID:');
            let chats = await getChats(charid);
            let messages = await getMessages(chats[0], format);
            let content = messages.map(msg => `${msg.author}: ${msg.message}`).join('\n');
            let blob = new Blob([content], { type: 'text/plain' });
            let link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `chat_${charid}.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        function saveChatToLocalStorage() {
            let charid = prompt('Enter character ID:');
            getChats(charid).then(chats => {
                if (chats.length > 0) {
                    getMessages(chats[0], "definition").then(messages => {
                        const chatData = {
                            characterID: charid,
                            messages: messages
                        };
                        localStorage.setItem(`chat_${charid}`, JSON.stringify(chatData));
                        alert(`Chat saved to local storage as "chat_${charid}".`);
                    });
                } else {
                    alert("No chats found for this character ID.");
                }
            });
        }

        const dialog = document.createElement('dialog');
        dialog.innerHTML = `
            <form method="dialog">
                <p>Select format:</p>
                <label><input type="radio" name="format" value="definition" checked> Definition ({{user}}/{{char}})</label><br>
                <label><input type="radio" name="format" value="names"> Names (You/Bot)</label><br>
                <button type="submit">Download</button>
            </form>
        `;
        dialog.addEventListener('close', () => {
            const format = dialog.querySelector('input[name="format"]:checked').value;
            downloadChat(format);
        });
        document.body.appendChild(dialog);

        let { downloadButton, saveLocalButton } = createSaveButton();
        downloadButton.onclick = function() {
            dialog.showModal();
        };

        saveLocalButton.onclick = function() {
            saveChatToLocalStorage();
        };
    }

    fetchAndDownloadChat();
})();
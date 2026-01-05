// ==UserScript==
// @name         ChatLog
// @namespace    http://alphaoverall.com
// @version      0.7
// @description  Downloads all messages (including private) in current chat
// @author       AlphaOverall
// @include      *://www.kongregate.com/games/*/*
// @downloadURL https://update.greasyfork.org/scripts/11783/ChatLog.user.js
// @updateURL https://update.greasyfork.org/scripts/11783/ChatLog.meta.js
// ==/UserScript==

// Check for holodeck to load
function check() {
    if (!holodeck) { setTimeout(check, 1000);}
    else {
        console.log("[ChatLog]: Holodeck loaded");
        start();
    }
} check();

// Main function
function start() {
    holodeck.addChatCommand("chatlog", function(l, msg){
            let z = msg.match(/^\/\S+\s+(.+)/), type = ".txt";
            // Allow an optional html download
            if (z && z[1] == "html") type = ".html";
            // Get active chat message window and log
            let element = jQuery(".chat_room_template:visible .chat_message_window")[0];
            let log = element.innerText;
            if (type === ".html") {
                // Add styling to html files
                // Just grabbed these from Kong, probably not comprehensive or all necessary
                log = `
                <style>
                .chat_message_window {
                    background-color: #fff;
                    margin-top: 3px;
                    max-height: 500px;
                    overflow-x: hidden;
                    overflow-y: auto;
                    text-align: left;
                    font: normal 11px/15px Verdana, Arial, sans-serif;
                }
                .chat_message_window p .timestamp {
                    color: #888;
                    display: block;
                    font: 10px/12px Arial, sans-serif;
                    text-transform: uppercase;
                }
                .chat_message_window p .username {
                    text-decoration: none;
                }
                .chat_message_window .chat_message_window_username {
                    color: #285588;
                    cursor: pointer;
                    text-decoration: underline;
                }
                .chat_message_window .is_self, .chat_message_window .sent_whisper span.username {
                    color: #900;
                }
                .chat_message_window p .message {
                    line-height: 14px;
                }
                .hyphenate, .hyphenate * {
                    word-wrap: break-word;
                    -webkit-hyphens: auto;
                    -moz-hyphens: auto;
                    -ms-hyphens: auto;
                    hyphens: auto;
                }
                .chat_message_window .even {
                    background-color: #e3e3e3;
                }
                .chat_message_window p {
                    margin: 1px 0;
                    padding: 4px 6px 4px 5px;
                }
                .chat_message_window .whisper {
                    background-color: #deeaf6;
                    font-style: italic;
                    margin: 2px 0;
                }
                </style>`;
                log += `<div class="chat_message_window">${element.innerHTML}</div>`;
            }
            // Create link to download document
            let download = document.createElement("a");
            download.href = "data:text/html;charset=UTF-8," + encodeURIComponent(log);
            download.target = "_blank";
            // Set a unique name
            download.download = "Log_" + (new Date().toLocaleString()) + type;
            // Add element (needed for FF)
            document.body.appendChild(download);
            // Download it
            download.click();
            // Remove element
            document.body.removeChild(download);
            // Don't send command to chat window
            return false;
        });
        // Add /log as an optional form of command
        holodeck._chat_commands.log = holodeck._chat_commands.chatlog;
}
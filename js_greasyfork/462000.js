// ==UserScript==
// @name         IdlePixel Chat Functions
// @namespace    com.strawberry.idlepixel
// @version      1.2.0
// @description  Added functionality to chat. See the plugin menu.
// @author       Original Author: evolsoulx || Modified By: Strawberry
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js
// @downloadURL https://update.greasyfork.org/scripts/462000/IdlePixel%20Chat%20Functions.user.js
// @updateURL https://update.greasyfork.org/scripts/462000/IdlePixel%20Chat%20Functions.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const styleSheet = document.createElement("style");
    styleSheet.innerHTML = "";
    styleSheet.id = "chatFunctions";
    document.head.appendChild(styleSheet);

    function beep() {
        var snd = new Audio(
            "data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU="
        );
        snd.play();
    }

    function rebuildChatMessage(message, updateMessage, isMentioned) {
        const username = message.username;
        const sigil = message.sigil;
        const level = message.level;
        let chatmessage = message.message;
        let timestampClassName = "color-green";
        if (updateMessage) {
            timestampClassName = "muted-time";
            chatmessage = updateMessage;
        }

        if (isMentioned) {
            timestampClassName = "mentioned-time";
            beep();
        }

        if (level < 0) {
            return `<span class="${timestampClassName}">${Chat._get_time()}</span>
            <img src="https://d1xsc8x7nc5q8t.cloudfront.net/images/none.png" width="20px">
            <span class="server_message shadow" style="color: rgb(0, 0, 255)">Server message</span> ${chatmessage}`;
        } else {
            return `<span class="${timestampClassName}"> ${Chat._get_time()}</span>
        <img src="https://d1xsc8x7nc5q8t.cloudfront.net/images/${sigil}.png" width="20px">
        <span class=""></span>
        <a target="_blank" class="chat-username" href="https://idle-pixel.com/hiscores/search?username=${username}">${username}</a>
        <span class="color-grey"> (${level}): </span>${chatmessage}`;
        }
    }

    class CMTPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("chatfunctions", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description,
                },
                config: [
                    {
                        type: "label",
                        label: "Mentions:",
                    },
                    {
                        id: "listofMentionNames",
                        label: "List of names or words for mention.",
                        type: "string",
                        max: 2000,
                        default: "",
                    },
                    {
                        id: "handleMention",
                        label: "Play a sound when someone mentions you.",
                        type: "boolean",
                        default: false,
                    },
                    {
                        type: "label",
                        label: "User Functions:",
                    },
                    {
                        id: "muteThese",
                        label: "List who you want to mute and be able to hover to see their messages",
                        type: "string",
                        max: 2000,
                        default: "",
                    },
                    {
                        id: "blockThese",
                        label: "List who you want to block and not see completely",
                        type: "string",
                        max: 2000,
                        default: "",
                    },
                    {
                        id: "blockConsoleDisplay",
                        label: "Display console message when blocked message is receieved",
                        type: "boolean",
                        default: true,
                    },
                    {
                        type: "label",
                        label: "Guest Functions:",
                    },
                    {
                        id: "handleGuests",
                        label: "Guest accounts",
                        type: "select",
                        options: [
                            { value: "none", label: "None" },
                            { value: "mute", label: "Mute" },
                            { value: "block", label: "Block" },
                        ],
                        default: "none",
                    },
                    {
                        id: "guestPrefix",
                        label: "Set the guest prefix",
                        type: "string",
                        max: 2000,
                        default: "guest_",
                    },
                    {
                        type: "label",
                        label: "Spam Functions:",
                    },
                    {
                        id: "handleSpam",
                        label: "Spam messages (messages with 5 or more repeating characters)",
                        type: "select",
                        options: [
                            { value: "none", label: "None" },
                            { value: "mute", label: "Mute" },
                            { value: "block", label: "Block" },
                        ],
                        default: "none",
                    },
                    {
                        type: "label",
                        label: "Word Filter:",
                    },
                    {
                        id: "handleFilters",
                        label: "Filtered words",
                        type: "select",
                        options: [
                            { value: "none", label: "None" },
                            { value: "word", label: "Word" },
                            { value: "mute", label: "Mute" },
                            { value: "block", label: "Block" },
                        ],
                        default: "none",
                    },
                    {
                        id: "filterThese",
                        label: "Filter messages containing these words",
                        type: "string",
                        max: 2000,
                        default: "",
                    },
                    {
                        type: "label",
                        label: "Server Messages:",
                    },
                    {
                        id: "blockServerMessages",
                        label: "Block messages from server",
                        type: "boolean",
                        default: false,
                    },
                    {
                        type: "label",
                        label: "Styles:",
                    },
                    {
                        id: "mentionTimestampColor",
                        label: "Timestamp color for mention messages",
                        type: "color",
                        default: "#EB9A0F",
                    },
                    {
                        id: "muteTimestampColor",
                        label: "Timestamp color for muted messages",
                        type: "color",
                        default: "#990000",
                    },
                    {
                        id: "muteUnderlineColor",
                        label: "Underline color for muted messages",
                        type: "color",
                        default: "#999999",
                    },
                ],
            });
        }

        loadStyles() {
            const styles = `
            #chat-area {
                padding: 0.25em;
            }
            div:hover > .mutedMessage .mutedWord {
                background-color:transparent;
                color: inherit;
            }
            .mutedWord {
                color:transparent;
                border-bottom:1px solid ${this.getConfig("muteUnderlineColor")};
            }
            .muted-time {
                color: ${this.getConfig("muteTimestampColor")}
            }
            .mentioned-time {
                color: ${this.getConfig("mentionTimestampColor")}
            }
            `;
            document.getElementById("chatFunctions").innerHTML = styles;
        }

        muteMessage(message, words) {
            let splitMessage = "";
            if (words === false) {
                splitMessage = message.message.split(" ").reduce((a, c) => {
                    return (a += `<span class="mutedWord">${c}</span> `);
                }, "");
            } else {
                splitMessage = message.message.split(" ").reduce((a, c) => {
                    if (words.includes(c)) {
                        return (a += `<span class="mutedWord">${c}</span> `);
                    } else {
                        return (a += `${c} `);
                    }
                }, "");
            }
            const newMessage = `<span class="mutedMessage">${splitMessage}</span>`;
            return rebuildChatMessage(message, newMessage);
        }

        onLogin() {
            this.loadStyles();
        }

        onConfigsChanged() {
            this.loadStyles();
        }

        onMessageReceived(data) {
            if (data.startsWith("YELL=")) {
                const split = data.substring("YELL=".length);
                const chatData = {
                    username: "server",
                    sigil: "none",
                    tag: "",
                    level: -1,
                    message: split,
                };
                this.onChat(chatData);
            }
        }
        onChat(data) {
            //console.log(data);
            const chatbox = document.querySelector("#chat-area");
            const el = chatbox.lastElementChild;
            const listofMentionNames =
                this.getConfig("listofMentionNames").length === 0
                    ? []
                    : this.getConfig("listofMentionNames")
                          .toLowerCase()
                          .split(",")
                          .reduce((a, c) => (a = [].concat(a, c.trim())), []);
            const listOfMutes = this.getConfig("muteThese").split(",");
            const listOfBlocks = this.getConfig("blockThese").split(",");
            const listOfFilters =
                this.getConfig("filterThese").length === 0
                    ? []
                    : this.getConfig("filterThese")
                          .toLowerCase()
                          .split(",")
                          .reduce((a, c) => (a = [].concat(a, c.trim())), []);
            const displayBlockMessage = this.getConfig("blockConsoleDisplay");
            const handleGuests = this.getConfig("handleGuests");
            const handleSpam = this.getConfig("handleSpam");
            const handleFilters = this.getConfig("handleFilters");
            const guestPrefiix =
                this.getConfig("guestPrefix").length === 0
                    ? "guest_"
                    : this.getConfig("guestPrefix").trim();
            const handleServerMessages = this.getConfig("blockServerMessages");
            const handleMention = this.getConfig("handleMention");

            const chatFrom = data.username;
            const message = data.message;

            let [
                blockGuest,
                muteGuest,
                blockSpam,
                muteSpam,
                blockFilters,
                muteFilters,
                filterWord,
                blockServerMessages,
            ] = [false, false, false, false, false, false, false, false];

            const isMentioned = listofMentionNames.some((filter) => {
                const newfilter = new RegExp(
                    `(\\b|_)+${filter.trim().replaceAll(" ", "_")}(_|'s|$)`,
                    "i"
                );
                return newfilter.test(message.trim().replaceAll(" ", "_"));
            });

            const isSpam = /(.)\1{4,}/.test(message);

            const isFiltered = message
                .toLowerCase()
                .split(" ")
                .some((filter) => listOfFilters.includes(filter.trim()));

            const isServerMessage = data.level === -1 ? true : false;

            const userMuted = listOfMutes.includes(chatFrom);
            const userBlocked = listOfBlocks.includes(chatFrom);

            if (handleFilters === "word") {
                muteFilters = isFiltered;
                filterWord = true;
            }
            if (handleFilters === "mute") {
                muteFilters = isFiltered;
            }
            if (handleFilters === "block") {
                blockFilters = isFiltered;
            }

            if (handleSpam === "mute") {
                muteSpam = isSpam;
            }
            if (handleSpam === "block") {
                blockSpam = isSpam;
            }

            if (handleGuests === "mute") {
                muteGuest = chatFrom.startsWith(guestPrefiix);
            }
            if (handleGuests === "block") {
                blockGuest = chatFrom.startsWith(guestPrefiix);
            }
            if (handleServerMessages) {
                blockServerMessages = isServerMessage;
            }

            if (
                userBlocked ||
                blockGuest ||
                blockSpam ||
                blockFilters ||
                blockServerMessages
            ) {
                el.remove();
                if (displayBlockMessage) {
                    console.log(
                        `Blocked a message from ${chatFrom}! ${el.textContent}`
                    );
                }
            } else if (userMuted || muteGuest || muteSpam) {
                el.innerHTML = this.muteMessage(data, false);
            } else if (muteFilters) {
                if (filterWord) {
                    el.innerHTML = this.muteMessage(data, listOfFilters);
                } else {
                    el.innerHTML = this.muteMessage(data, false);
                }
            } else if (handleMention) {
                el.innerHTML = rebuildChatMessage(data, false, isMentioned);
            } else {
                el.innerHTML = rebuildChatMessage(data, false);
            }
        }
    }

    const plugin = new CMTPlugin();
    IdlePixelPlus.registerPlugin(plugin);
})();

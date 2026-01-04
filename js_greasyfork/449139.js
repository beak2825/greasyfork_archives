// ==UserScript==
// @name        MPP - AdvancedChatLogger
// @namespace   Violentmonkey Scripts
// @match       https://mppclone.com/*
// @grant       none
// @version     1.3
// @author      Wolfy0615
// @description 8/6/2022, 1:13:53 AM
// @downloadURL https://update.greasyfork.org/scripts/449139/MPP%20-%20AdvancedChatLogger.user.js
// @updateURL https://update.greasyfork.org/scripts/449139/MPP%20-%20AdvancedChatLogger.meta.js
// ==/UserScript==

function init() {
    let logger = {
        messages: [],
        log: (msg, msgTime) => {
            // msg = `[${msgTime}] ` + msg;
            msg = "[" + msgTime + "] " + msg;
            msg += "\n";

            if (this.messages.includes(msg)) return;

            this.messages.push(msg);
        },
        clear: () => {
            this.messages = [];
        },
    };

    const protocol = {
        chatList: "c",
        chat: "a",
        directMessage: "dm",
        channelUpdate: "ch",
    };

    const client = MPP.client;

    let lastChannel = "";

    client.on(protocol.channelUpdate, (msg) => {
        if (lastChannel === msg.ch.id) return;
        logger.clear();
        console.log("Detected room change. Clearing logs...");
        lastChannel = msg.ch.id;
    });

    client.on(protocol.chatList, (msg) => {
        if (msg.c) {
            msg.c.forEach((cmsg) => {
                if (cmsg.m === "dm") {
                    const time = new Date(cmsg.t).toLocaleTimeString();
                    const sender = cmsg.sender;
                    const senderId = sender.id;
                    const senderName = sender.name;
                    const recipient = cmsg.recipient;
                    const recipientId = recipient.id;
                    const recipientName = recipient.name;

                    if (senderId === client.getOwnParticipant().id) {
                        logger.log(
                            `${time} ${senderId} (DM) ${senderName} to ${recipientId} ${recipientName}: ${cmsg.a}`,
                            cmsg.t
                        );
                    } else {
                        logger.log(
                            `${time} ${recipientId} (DM) ${recipientName} from ${senderId} ${senderName}: ${cmsg.a}`,
                            cmsg.t
                        );
                    }
                } else {
                    const time = new Date(cmsg.t).toLocaleTimeString();
                    logger.log(
                        `${time} ${cmsg.p.id} (--) ${cmsg.p.name}: ${cmsg.a}`,
                        cmsg.t
                    );
                }
            });
        }
    });

    client.on(protocol.chat, (msg) => {
        const time = new Date(msg.t).toLocaleTimeString();
        logger.log(`${time} ${msg.p.id} (--) ${msg.p.name}: ${msg.a}`, msg.t);
    });

    client.on(protocol.directMessage, (msg) => {
        const time = new Date(msg.t).toLocaleTimeString();
        const sender = msg.sender;
        const senderId = sender.id;
        const senderName = sender.name;
        const recipient = msg.recipient;
        const recipientId = recipient.id;
        const recipientName = recipient.name;

        if (senderId === client.getOwnParticipant().id) {
            logger.log(
                `${time} ${senderId} (DM) ${senderName} to ${recipientId} ${recipientName}: ${msg.a}`,
                msg.t
            );
        } else {
            logger.log(
                `${time} ${recipientId} (DM) ${recipientName} from ${senderId} ${senderName}: ${msg.a}`,
                msg.t
            );
        }
    });

    window.messages = logger.messages;

    const btn = `<div id="chat-download-btn" class="ugly-button">Download Chat</div>`;

    $("#bottom .relative").append(btn);

    $("#chat-download-btn").css({
        position: "absolute",
        left: "1020px",
        top: "32px",
    });

    $("#chat-download-btn").on("click", () => {
        let uri = URL.createObjectURL(
            new Blob(messages, { type: "text/plain" })
        );

        new MPP.Notification({
            id: "chat-download",
            class: "classic",
            title: "Chat Download",
            html: `<a href="${uri}" download="${client.channel.id}">Here</a> is your download.`,
            duration: 7000,
            target: "#piano",
        });
    });
}

const initInterval = setInterval(() => {
    if (window.MPP) {
        clearInterval(initInterval);
        init();
    }
});

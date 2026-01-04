// ==UserScript==
// @name         IdlePixel Chat Functions
// @namespace    com.evolsoulx.idlepixel
// @version      1.1.0
// @description  Added functionality to chat. Currently only contains a mute function. Add users via the plugin menu.
// @author       evolsoulx
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js
// @downloadURL https://update.greasyfork.org/scripts/458841/IdlePixel%20Chat%20Functions.user.js
// @updateURL https://update.greasyfork.org/scripts/458841/IdlePixel%20Chat%20Functions.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var styles = '.mutedMessage:hover{color:#FFF !important;}'

    var styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    styleSheet.id = 'chatFunctions';
    document.head.appendChild(styleSheet);

    function rebuildChatMessage(message, updateMessage) {
        var username = message.username;
        var sigil = message.sigil;
        var level = message.level;
        var chatmessage = message.message;
        if(updateMessage) {
            chatmessage = updateMessage;
        }
        return '<span style="color:red; font-weight:bold;">[MUTED] </span> <img src="https://d1xsc8x7nc5q8t.cloudfront.net/images/' + sigil + '.png"> <span class=""></span> <a target="_blank" class="chat-username" href="https://idle-pixel.com/hiscores/search?username=' + username + '">' + username + '</a><span class="color-grey"> (' + level + '): </span>' + chatmessage;
    }

    class CMTPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("chatfunctions", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [{
                        type: "label",
                        label: "User Functions:"
                    },
                    {
                        id: "muteThese",
                        label: "List who you want to mute and be able to hover to see their messages",
                        type: "string",
                        max: 2000,
                        default: ""
                    },
                    {
                        id: "blockThese",
                        label: "List who you want to block and not see completely",
                        type: "string",
                        max: 2000,
                        default: ""
                    },
                    {
                        id: "blockConsoleDisplay",
                        label: "Display console message when blocked message is receieved",
                        type: "boolean",
                        default: true
                    }
                ]
            });
        }


        muteMessage(message) {
            var newMessage = "<span class='mutedMessage' style='color:black; background-color:black;'>" + message.message + "</span>";
            return rebuildChatMessage(message, newMessage);
        }

        onLogin() {}

        onConfigsChanged() {}

        onChat(data) {
            //            console.log(data);
            const el = $("#chat-area > *").last();
            const listOfMutes = this.getConfig("muteThese").split(',');
            const listOfBlocks = this.getConfig("blockThese").split(',');
            const displayBlockMessage = this.getConfig("blockConsoleDisplay");
            var chatFrom = data.username;
            if(listOfMutes.indexOf(chatFrom) != -1) {
                el.html(this.muteMessage(data));
            }
            if(listOfBlocks.indexOf(chatFrom) != -1) {
                el.remove();
                if(displayBlockMessage){console.log("Muted a message from " + chatFrom);}
            }


        }

    }

    const plugin = new CMTPlugin();
    IdlePixelPlus.registerPlugin(plugin);

})();
// ==UserScript==
// @name         IdlePixel Chat Functions - GodofNades Fork - ZLEF EDIT. V1.2 FROM 1.1.6
// @namespace    com.godofnades.idlepixel
// @version      1.2.0
// @description  Added personal mute functionality to chat. Usernames can be right clicked in chat and added. Must use settings menu to remove.
// @author       Original Author: evolsoulx || Modded By: GodofNades
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/anchorme/2.1.2/anchorme.min.js
// @downloadURL https://update.greasyfork.org/scripts/478169/IdlePixel%20Chat%20Functions%20-%20GodofNades%20Fork%20-%20ZLEF%20EDIT%20V12%20FROM%20116.user.js
// @updateURL https://update.greasyfork.org/scripts/478169/IdlePixel%20Chat%20Functions%20-%20GodofNades%20Fork%20-%20ZLEF%20EDIT%20V12%20FROM%20116.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var styles = '.mutedMessage:hover{color:#FFF !important;}'

    var styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    styleSheet.id = 'chatFunctions';
    document.head.appendChild(styleSheet);

    class CMTPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("chatfunctions", {
                about: {
                    name: GM_info.script.name + " (ver: "+ GM_info.script.version + ")",
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    {
                        type: "label",
                        label: "User Functions:"
                    },
                    {
                        id: "blackList",
                        label: "List who you want to block and not see completely",
                        type: "string",
                        max: 200000,
                        default: "PlaceNamesHere"
                    },
                    {
                        id:"blackListByLevel",
                        label: "Level minimum for players you want to see in chat",
                        type: "int",
                        default: 0
                    },
                    {
                        id: "whiteList",
                        label: "White List who you want to always be able to see",
                        type: "string",
                        max: 200000,
                        default: "PlaceNamesHere"
                    }, // --Zlef-->
                    {
                        type: "label",
                        label: "Zlef functions:"
                    },
                    {
                        id: "toggleCaptialiseNames",
                        label: "Capitalise usernames",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "toggleEmbedImages",
                        label: "Embed images in chat",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "toggleFontSizeBtns",
                        label: "Display buttons for changing font size",
                        type: "boolean",
                        default: true
                    }, // <--Zlef--

                ]
            });
            // -- Zlef -->
            this.usernamesFixed = {"godofnades": "GodofNades", "botofnades": "BotofNades", "amyjane1991": "AmyJane1991", "luxbot": "LuxBot", "luxferre": "Lux-Ferre"}

        }

        onLogin() {
            const self = this;

            $("head").append(`

            <style id="styles-chatFunctions">
            body {
              position: relative !important;
            }
            .chatFunctions_message {
              color: black;
              font-weight: 500;
              background-color: limegreen;
              border: green;
              font-size: smaller;
              padding: 2px 4px;
            }
            #chatFunctions-chat-context-menu {
              position: absolute;
              display: flex;
              flex-direction: column;
              justify-items: start;
              width: 180px;
              border: 1px solid black;
              background-color: white;
              color: black;
            }
            #chatFunctions-chat-context-menu > .context-menu-header {
              border-bottom: 2px solid black;
              font-weight: 550;
              text-align: center;
            }
            #chatFunctions-chat-context-menu > .context-menu-item {
              cursor: pointer;
              border-bottom: 1px solid black;
              text-align: center;
            }
            #chatFunctions-chat-context-menu > .context-menu-item:hover {
              background-color: #ccffff;
            }
            </style>
            `);

            $("#chat-area").on("contextmenu", (event) => {
                //console.log(event);
                const target = event.target;
                if(target.classList.contains("chat-username")) {
                    const username = target.innerText.trim();
                    const context = $("#chatFunctions-chat-context-menu");
                    context.empty();
                    context.append(`
                      <div class="context-menu-header">${username}</div>
                      <div class="context-menu-item" onclick="IdlePixelPlus.plugins.chatfunctions.contextQuickMute('${username}')">QUICK MUTE</div>
                    `);
                    /*
                      <div class="context-menu-item" onclick="IdlePixelPlus.plugins.ModMod.contextQuickMute('${username}')">QUICK MUTE</div>
                      <div class="context-menu-item" onclick="IdlePixelPlus.plugins.ModMod.contextQuickUnmute('${username}')">QUICK UNMUTE</div>
                      <div class="context-menu-item" onclick="IdlePixelPlus.plugins.ModMod.contextMute('${username}')">MUTE</div>
                      <div class="context-menu-item" onclick="IdlePixelPlus.plugins.ModMod.contextWhoIs('${username}')">WHO IS</div>
                    */
                    context.css("left", `${event.clientX-10}px`);
                    context.css("top", `${window.scrollY+event.clientY-40}px`);
                    context.show();

                    event.stopPropagation();
                    event.preventDefault();
                    return false;
                }
            });

            $("body").append(`
            <div id="chatFunctions-chat-context-menu" style="display:none;" oncontextmenu="event.stopPropagation(); event.preventDefault();">

            </div>
            `);

            $("#chatFunctions-chat-context-menu").on("mouseleave", function() {
                $(this).hide();
            });

        }

        contextQuickMute(username) {
            // MUTE=username~hours~reason~ip
            var getConf = window.localStorage.getItem("idlepixelplus.chatfunctions.config");
            var listofStuff = JSON.parse(getConf);
            var blackListAdd = listofStuff['blackList'];
            var whiteListStatic = listofStuff['whiteList'];
            var blackListByLevelStatic = listofStuff['blackListByLevel'];
            blackListAdd += ","+username
            var convert = JSON.stringify({blackList: blackListAdd, whiteList: whiteListStatic, blackListByLevel: blackListByLevelStatic});
            window.localStorage.setItem("idlepixelplus.chatfunctions.config", convert);
            IdlePixelPlus.loadPluginConfigs(this.id);
            $("#chatFunctions-chat-context-menu").hide();
            return false;
        }

        onConfigsChanged() {}

        onChat(data) {
            //console.log(data.level + ": " + data.message);
            const el = $("#chat-area > *").last();
            var blackListTransform = this.getConfig("blackList").replace(";",",").replace(" ,", ",").replace(" , ",",").replace(", ",",").toLowerCase();
            const listOfBlocks = blackListTransform.split(',');
            const whiteList = this.getConfig("whiteList").split(',');
            var chatFrom = data.username;
            if(listOfBlocks.indexOf(chatFrom) != -1) {
                el.remove();
            }
            if(data.level < this.getConfig("blackListByLevel") && whiteList.indexOf(chatFrom) == -1) {
                el.remove();
            }
            if (this.getConfig("toggleCaptialiseNames")){
                this.QueensEnglish(data, el);
            }
            if (this.getConfig("toggleEmbedImages")){
                this.EmbedImage(data, el);
            }
        }

        QueensEnglish(data, el) { // What king?...
            let capitalisedUsername;
            if (this.usernamesFixed.hasOwnProperty(data.username)) {
                capitalisedUsername = this.usernamesFixed[data.username];
            } else {
                capitalisedUsername = data.username.charAt(0).toUpperCase() + data.username.slice(1);
            }
            const usernameElement = el.find('a.chat-username');
            usernameElement.text(capitalisedUsername);
        }

        EmbedImage(data, el){
            /*
            */
            if ("chatlinks" in IdlePixelPlus.plugins){
                IdlePixelPlus.plugins['chatlinks'].replaceLinks(data.message)
            } else{
                el.html(this.replaceLinks(el.html()));
            }


        }

    }

    const plugin = new CMTPlugin();
    IdlePixelPlus.registerPlugin(plugin);

})();
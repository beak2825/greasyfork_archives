// ==UserScript==
// @name         IdlePixel Private Messages
// @namespace    com.anwinity.idlepixel
// @version      1.0.1
// @description  Adds /m command for private messages. Note that this does not use the /pm command because smitty will (presumably) add that eventually.
// @author       Anwinity
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/450785/IdlePixel%20Private%20Messages.user.js
// @updateURL https://update.greasyfork.org/scripts/450785/IdlePixel%20Private%20Messages.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function normalizeUsername(username) {
        if(!username) return "";
        return username
            .trim()
            .toLowerCase()
            .replace("_", " ");
    }

    function reverseNormalizeUsername(username) {
        if(!username) return "";
        return username
            .trim()
            .toLowerCase()
            .replace(" ", "_");
    }

    class PMPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("pm", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    {
                        id: "blocked",
                        label: "Blocked Users (PM only), comma separated",
                        type: "string",
                        default: ""
                    }
                ]
            });
            this.previous = "";
        }

        isBlocked(username) {
            username = normalizeUsername(username);
            const list = this.getBlocked();
            return !!(list.find(s => s === username));
        }

        getBlocked() {
            return (this.getConfig("blocked") || "")
                .split(/\s*,\s*/g)
                .filter(s => !!(s))
                .map(s => normalizeUsername(s));
        }

        setBlocked(list) {
            let storedConfigs;
            try {
                storedConfigs = JSON.parse(localStorage.getItem(`idlepixelplus.pm.config`) || "{}");
            }
            catch(err) {
                console.error(`Failed to load configs for plugin with id "pm"`);
                storedConfigs = {};
            }
            list = list.map(s => normalizeUsername(s));
            const unique = list.filter((c, i) => list.indexOf(c)===i);
            const configValue = unique.join(",");
            storedConfigs.blocked = configValue;
            localStorage.setItem(`idlepixelplus.pm.config`, JSON.stringify(storedConfigs));
            IdlePixelPlus.loadPluginConfigs("pm");
        }

        receivePM(username, message) {
            if(!this.isBlocked(username)) {
                username = normalizeUsername(username);
                $("#chat-area").append(`
                <div style="background-color: rgba(0, 255, 20, 0.25)">
                  <span class="color-green">${Chat._get_time()}</span>
                  From <a target="_blank" class="chat-username" href="https://idle-pixel.com/hiscores/search?username=${username}">${username}</a>:
                  ${sanitize_input(message)}
                </div>`);
                if(Chat._auto_scroll) {
                    $("#chat-area").scrollTop($("#chat-area")[0].scrollHeight);
                }
                this.previous = reverseNormalizeUsername(username);
            }
        }

        receiveOffline(username) {
            $("#chat-area").append(`
            <div style="background-color: rgba(0, 255, 20, 0.25)">
              <span class="color-green">${Chat._get_time()}</span>
              <span>${username} is offline.</span>
            </div>`);
            if(Chat._auto_scroll) {
                $("#chat-area").scrollTop($("#chat-area")[0].scrollHeight);
            }
        }

        onCustomMessageReceived(player, content, callbackId) {
            if(content.startsWith("PM:")) {
                content = content.substring("PM:".length);
                this.receivePM(player, content);
            }
        }

        sendPM(username, message) {
            username = normalizeUsername(username);
            if(this.isBlocked(username)) {
                $("#chat-area").append(`
                <div style="background-color: rgba(0, 255, 20, 0.25)">
                  <span class="color-green">${Chat._get_time()}</span>
                  <span>${username} is on your block list. You must remove them before sending them a message.</span>
                </div>`);
                if(Chat._auto_scroll) {
                    $("#chat-area").scrollTop($("#chat-area")[0].scrollHeight);
                }
                return;
            }
            IdlePixelPlus.sendCustomMessage(username, {
                content: `PM:${message}`,
                onOffline: () => {
                    this.receiveOffline(username);
                    return true;
                },
                timout: 5000
            });
            $("#chat-area").append(`
            <div style="background-color: rgba(0, 255, 20, 0.25)">
              <span class="color-green">${Chat._get_time()}</span>
              To <a target="_blank" class="chat-username" href="https://idle-pixel.com/hiscores/search?username=${username}">${username}</a>:
              ${sanitize_input(message)}
            </div>`);
            if(Chat._auto_scroll) {
                $("#chat-area").scrollTop($("#chat-area")[0].scrollHeight);
            }
            this.previous = reverseNormalizeUsername(username);
        }

        block(username) {
            username = normalizeUsername(username);
            const list = this.getBlocked();
            list.push(username);
            this.setBlocked(list);

            $("#chat-area").append(`
            <div style="background-color: rgba(0, 255, 20, 0.25)">
              <span class="color-green">${Chat._get_time()}</span>
              <span>${username} has been blocked.</span>
            </div>`);
            if(Chat._auto_scroll) {
                $("#chat-area").scrollTop($("#chat-area")[0].scrollHeight);
            }
        }

        unblock(username) {
            username = normalizeUsername(username);
            const list = this.getBlocked().filter(s => username != normalizeUsername(s));
            this.setBlocked(list);

            $("#chat-area").append(`
            <div style="background-color: rgba(0, 255, 20, 0.25)">
              <span class="color-green">${Chat._get_time()}</span>
              <span>${username} has been unblocked.</span>
            </div>`);
            if(Chat._auto_scroll) {
                $("#chat-area").scrollTop($("#chat-area")[0].scrollHeight);
            }
        }

        onLogin() {

            if(typeof IdlePixelPlus.registerCustomChatCommand === "function") {
                IdlePixelPlus.registerCustomChatCommand("m", (command, message) => {
                    message = (message||"").trim();
                    if(!message) {
                        return;
                    }
                    let username;
                    let space = message.indexOf(" ");
                    if(space > 0) {
                        username = message.substring(0, space).trim();
                        message = message.substring(space).trim();
                    }
                    else {
                        username = message.trim();
                        message = "";
                    }
                    this.sendPM(username, message);
                    
                }, "Send private message. Note: Both sender and receiver must have this plugin installed for it to work.<br /><strong>Usage:</strong> /%COMMAND% &lt;username&gt; &lt;message&gt;<br />Use player's username has a space in it, replace the space with an underscore.<br /><strong>Also See: </strong>/mblock /munblock");

                IdlePixelPlus.registerCustomChatCommand("mblock", (command, message) => {
                    message = (message||"").trim();
                    if(!message) {
                        return;
                    }
                    this.block(message);

                }, "Block PMs from user.<br /><strong>Usage:</strong> /%COMMAND% &lt;username&gt;");

                IdlePixelPlus.registerCustomChatCommand("munblock", (command, message) => {
                    message = (message||"").trim();
                    if(!message) {
                        return;
                    }
                    this.unblock(message);

                }, "Unblock PMs from user.<br /><strong>Usage:</strong> /%COMMAND% &lt;username&gt;");

                $("#chat-area-input").on("keydown", (event) => {
                    const input = $("#chat-area-input");
                    if(event.which==9 || event.keyCode==9) {
                        event.preventDefault();
                        let val = input.val() || "";
                        if(!val.startsWith("/")) {
                            if(this.previous) {
                                val = `/m ${this.previous} ${val}`;
                            }
                            else {
                                val = `/m ${val}`;
                            }
                            input.val(val);
                        }
                    }
                });
            }



        }




    }

    const plugin = new PMPlugin();
    IdlePixelPlus.registerPlugin(plugin);

})();
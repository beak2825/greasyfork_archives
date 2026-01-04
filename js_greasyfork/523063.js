// ==UserScript==
// @name         IdlePixel Loot Log Tweaks
// @namespace    godofnades.idlepixel
// @version      0.1.9
// @description  Moving the Loot Log into a container like IdlePixel Fixed had with 'Tab' as the button to open.
// @author       GodofNades
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @license      MIT
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @require		 	https://greasyfork.org/scripts/491983-idlepixel-plugin-paneller/code/IdlePixel%2B%20Plugin%20Paneller.js?anticache=20240410
// @downloadURL https://update.greasyfork.org/scripts/523063/IdlePixel%20Loot%20Log%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/523063/IdlePixel%20Loot%20Log%20Tweaks.meta.js
// ==/UserScript==

(function () {
    "use strict";

    let lootLogRefreshTimer;

    LogManager.prototype.refresh_panel = function() {
        var content = document.getElementById("panel-history-content");
        var custom = document.getElementById("ll-panel-div");
        var imgLoc = `https://d1xsc8x7nc5q8t.cloudfront.net/`;
        var html = "";
        for(var i = this.data.length - 1; i >= 0; i--) {
            var entry = this.data[i];
            var dt = entry.datetime;
            var slug = entry.slug;
            var monster_drops = entry.data;

            // Custom time formatting code
            var nowObj = new Date();
            var dtObj = new Date(dt);
            var delta = nowObj.getTime() - dtObj.getTime();
            var deltaSeconds = Math.floor(delta / 1000);
            var deltaMinutes = Math.floor(deltaSeconds / 60);
            var deltaHours = Math.floor(deltaMinutes / 60);
            var deltaDays = Math.floor(deltaHours / 24);

            var timeLabel = deltaSeconds + " seconds ago";
            if(deltaDays > 0) {
                timeLabel = deltaDays + " days ago";
            } else if(deltaHours > 0) {
                timeLabel = deltaHours + " hours ago";
            } else if(deltaMinutes > 0) {
                timeLabel = deltaMinutes + " minutes ago";
            }

            html += "<div class='drop-log-div'>";
            html += "<div class='drop-log-dt'>" + timeLabel + "</div>";
            if(slug == 'raid_drop') {
                var imgRaid = entry.data.split("~")[0];
                html += "<div class='loot' style='background-color:aquamarine'>"
                html += "<img src='" + imgLoc + imgRaid + "'class='w50 me-3'>"
                html += entry.data.split("~")[1];
                html += "</div>"
            } else {
                monster_drops.forEach(function(drop) {
                    var image = drop.image;
                    var label = drop.label;
                    var color = drop.color;
                    html += "<div class='loot' style='background-color:" + color + "'>";
                    html += "<img src='" + imgLoc + image + "' class='w50 me-3'>";
                    html += label;
                    html += "</div>";
                });
            }
            html += "</div><br /><br />";
        }

        if(html === "") {
            html = "<div class='center'>You have no data yet. Loot something and come back to check!</div>";
        }
        content.innerHTML = html;
        custom.innerHTML = html;
    };

    class lootLogTweaks extends IdlePixelPlusPlugin {
        constructor() {
            super("lootlogtweaks", {
                about: {
                    name: GM_info.script.name + " (ver: " + GM_info.script.version + ")",
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description,
                },
                /*config: [
                    {
                        label: "------------------------------",
                        type: "label"
                    },
                    {
                        label: "General Stuff",
                        type: "label"
                    },
                    {
                        label: "------------------------------",
                        type: "label"
                    },
                    {
                        id: "font",
                        label: "Primary Font",
                        type: "select",
                        options: FONTS,
                        default: FONT_DEFAULT
                    }
                ]*/
            });
        }

        initStyles() {
            const css = `
              #modal-style-ll .drop-log-dt {
                color: cyan;
              }

              #close-button-ll {
                background-color: red;
                width: 30px;
                height: 30px;
                position: absolute;
                top: 10px;
                right: 10px;
                border-radius: 50%;
                cursor: pointer;
              }

              #inner-close-button {
                color: white;
                font-size: 20px;
                font-weight: bold;
                text-align: center;
                line-height: 30px;
              }

              #ll-panel-div-container {
                overflow:auto;
                padding: 0.5em;
              }

              #modal-style-ll {
                display: none;
              }

              #modal-style-ll-container {
                position: absolute;
                top: 0px;
                left: 0px;
                width: 98vw;
                height: 100vh;
              }

              #ll-modal-base_window {
                position: absolute;
                top: 10vh;
                left: 25vw;
                width: 45vw;
                height: 85vh;
                text-align: center;
                border: 1px solid grey;
                background-color: rgb(0, 0, 0);
                border-radius:20px;
                padding: 20px;
                z-index: 10000;
                display: flex;
                align-items: center;
                flex-direction: column;
              }
            `;
                const styleSheet = document.createElement("style");
                styleSheet.innerHTML = css;
                document.head.appendChild(styleSheet);
            }

            createPanel() {
                let llModalHTML = `
              <div id="modal-style-ll"">
                <div id="modal-style-ll-container">
                  <div id="ll-modal-base_window" style="">
                    <div id="close-button-ll">
                      <p id="inner-close-button">X</p>
                    </div>
                    <br/>
                    <p id="activity-subheader" class="activity-subheader">Loot Log</p>
                    <hr>
                    <div id="ll-panel-div-container"">
                      <div id="ll-panel-div">
                      </div>
                    </div>
                  </div>
                  </br>
                </div>
              </div>
            `;

            const contentDiv = document.getElementById("content");
            const modalContainer = document.createElement("div");
            modalContainer.innerHTML = llModalHTML;
            contentDiv.appendChild(modalContainer);

            const onlineCount = document.querySelector(
                ".game-top-bar .gold:not(#top-bar-admin-link)"
            );
            const linkElement = document.createElement("a");
            linkElement.href = "#";
            linkElement.className = "hover float-end link-no-decoration";
            linkElement.title = "Loot Log";
            linkElement.textContent = "Loot Log" + "\u00A0\u00A0\u00A0";

            onlineCount.insertAdjacentElement("beforebegin", linkElement);

            const modalStyleLL = document.getElementById("modal-style-ll");
            const closeButton = document.getElementById("close-button-ll");

            linkElement.addEventListener("click", function (event) {
                event.preventDefault();
                modalStyleLL.style.display = "block";
                new LogManager().refresh_panel();
            });

            closeButton.addEventListener("click", function () {
                modalStyleLL.style.display = "none";
            });

            document.addEventListener("keydown", function (event) {
                var chatInput = document.getElementById("chat-area-input");
                var chat_focused = document.activeElement === chatInput;
                if (!chat_focused) {
                    if (event.keyCode === 9) {
                        if (modalStyleLL.style.display === "block") {
                            modalStyleLL.style.display = "none";
                        } else {
                            modalStyleLL.style.display = "block";
                            new LogManager().refresh_panel();
                        }
                    }
                }
            });

            modalStyleLL.addEventListener("click", function (event) {
                const isClickInside = document
                .getElementById("al-modal-base_window")
                .contains(event.target);

                if (!isClickInside) {
                    modalStyleLL.style.display = "none";
                }
            });

            document
                .getElementById("ll-modal-base_window")
                .addEventListener("click", function (event) {
                event.stopPropagation();
            });
        }

            onLogin() {
                this.initStyles();
                this.createPanel();
                //Paneller.registerPanel("lootLogTweaks", "Loot Log")
            }

            onMessageReceived(data) {
                if(data.startsWith('OPEN_LOOT_DIALOGUE')) {
                    new LogManager().refresh_panel();
                }
                if(data.startsWith('OPEN_DIALOGUE=RAIDS REWARD')) {
                    new LogManager().add_entry('raid_drop', `${data.split('~')[1]}~${data.split('~')[2]}`);
                }
            }
        }

    const plugin = new lootLogTweaks();
    IdlePixelPlus.registerPlugin(plugin);
})();
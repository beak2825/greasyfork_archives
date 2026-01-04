// ==UserScript==
// @name         IdlePixel Chat Emojis
// @namespace    com.anwinity.idlepixel
// @version      1.0.2
// @description  Adds emoji search to chat.
// @author       Anwinity
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/450699/IdlePixel%20Chat%20Emojis.user.js
// @updateURL https://update.greasyfork.org/scripts/450699/IdlePixel%20Chat%20Emojis.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // This is being used by everyone within this plugin. Please be respectful and don't use it for your own needs. It is free and easy to generate your own key if you want. Thanks.
    const EMOJI_API_KEY = "c29b9f6f19b8664dd77f62c236f29d0279e950b6";

    class ChatEmojiPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("emojis", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                }
            });
            this.cache = {};
        }

        openSearch() {
            const el = $("#emoji-search");

            // moves cursor to end
            const val = el.val();
            el.val("");
            el.val(val);

            const button =  $("#emoji-search-button");
            const buttonPosition = button.position();
            const buttonWidth = button.outerWidth();
            el.css("top", Math.round(buttonPosition.top - el.outerHeight() - 4));
            el.css("left", Math.round(buttonPosition.left + buttonWidth - el.outerWidth() + 4));

            const input = $("#emoji-search-input");
            const results = $("#emoji-search-results");
            el.show();
            input.focus();
        }

        closeSearch() {
            $("#emoji-search").hide();
        }

        toggleSearch() {
            if($("#emoji-search").is(":visible")) {
                this.closeSearch();
            }
            else {
                this.openSearch();
            }
        }

        injectEmoji(emoji, focus) {
            const input = document.getElementById("chat-area-input");
            const caret = input.selectionStart || 0;
            const value = input.value || "";
            input.value = value.substring(0, caret) + emoji + value.substring(caret);
            input.selectionStart = caret + emoji.length;
            this.closeSearch();
            if(focus) {
                input.focus();
            }
        }

        searchEmojis(search, f) {
            search = search.toLowerCase().trim().replace(/\s+/g, " ");
            if(search in this.cache) {
                if(typeof f === "function") {
                    f(this.cache[search], search);
                }
                return;
            }
            fetch(`https://emoji-api.com/emojis?search=${encodeURIComponent(search)}&access_key=${EMOJI_API_KEY}`)
            .then(resp => resp.json())
            .then(resp => {
                let chars = [];
                if(resp) {
                    resp.forEach(result => {
                        if(result.character && result.character.length <= 2) {
                            chars.push(result.character);
                        }
                        if(result.variants) {
                            result.variants.forEach(variant => {
                                if(variant.character && variant.character.length <= 2) {
                                    chars.push(variant.character);
                                }
                            });
                        }
                    });
                }
                chars = chars.filter((c, i) => {
                    return chars.indexOf(c) === i;
                });
                this.cache[search] = chars;
                if(typeof f === "function") {
                    f(this.cache[search], search);
                }
            })
            .catch(err => {
                console.error("Error fetching emoji data.", err);
            });
        }

        onLogin() {
            $("#chat-area-input").after(`<button type="button" id="emoji-search-button">🙂</button>`);
            $("#emoji-search-button").on("click", (e) => this.toggleSearch(e));
            $("head").append(`
            <style>
              #emoji-search {
                position: absolute;
                min-width: 180px;
                min-height: 180px;
                max-width: 180px;
                max-height: 180px;
                display: flex;
                flex-direction: column;
                background: white;
                border: 1px solid rgba(0, 0, 0, 0.2);
                border-radius: 2px;
              }
              #emoji-search-results {
                min-width: 180px;
                max-width: 180px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                overflow-y: auto;
              }
              #emoji-search-results.grid {
                display: grid;
                gap: 2px 2px;
                grid-template-columns: repeat(5, 1fr);
              }
              #emoji-search-results.grid > .emoji-result {
                padding: 2px;
                cursor: pointer;
                opacity: 0.8;
              }
              #emoji-search-results.grid > .emoji-result:hover {
                opacity: 1;
              }


              .emoji-loading-spinner {
                  color: white;
                  display: inline-block;
                  position: relative;
                  width: 80px;
                  height: 80px;
                  margin-left: auto;
                  margin-right: auto;
                  margin-top: 1em;
              }
              .emoji-loading-spinner div {
                  transform-origin: 40px 40px;
                  animation: emoji-loading-spinner 1.2s linear infinite;
              }
              .emoji-loading-spinner div:after {
                  content: " ";
                  display: block;
                  position: absolute;
                  top: 3px;
                  left: 37px;
                  width: 6px;
                  height: 18px;
                  border-radius: 20%;
                  background: black;
              }
              .emoji-loading-spinner div:nth-child(1) {
                  transform: rotate(0deg);
                  animation-delay: -1.1s;
              }
              .emoji-loading-spinner div:nth-child(2) {
                  transform: rotate(30deg);
                  animation-delay: -1s;
              }
              .emoji-loading-spinner div:nth-child(3) {
                  transform: rotate(60deg);
                  animation-delay: -0.9s;
              }
              .emoji-loading-spinner div:nth-child(4) {
                  transform: rotate(90deg);
                  animation-delay: -0.8s;
              }
              .emoji-loading-spinner div:nth-child(5) {
                  transform: rotate(120deg);
                  animation-delay: -0.7s;
              }
              .emoji-loading-spinner div:nth-child(6) {
                  transform: rotate(150deg);
                  animation-delay: -0.6s;
              }
              .emoji-loading-spinner div:nth-child(7) {
                  transform: rotate(180deg);
                  animation-delay: -0.5s;
              }
              .emoji-loading-spinner div:nth-child(8) {
                  transform: rotate(210deg);
                  animation-delay: -0.4s;
              }
              .emoji-loading-spinner div:nth-child(9) {
                  transform: rotate(240deg);
                  animation-delay: -0.3s;
              }
              .emoji-loading-spinner div:nth-child(10) {
                  transform: rotate(270deg);
                  animation-delay: -0.2s;
              }
              .emoji-loading-spinner div:nth-child(11) {
                  transform: rotate(300deg);
                  animation-delay: -0.1s;
              }
              .emoji-loading-spinner div:nth-child(12) {
                  transform: rotate(330deg);
                  animation-delay: 0s;
              }
              @keyframes emoji-loading-spinner {
                  0% {
                      opacity: 1;
                  }
                  100% {
                      opacity: 0;
                  }
              }

            </style>
            `);
            $("body").append(`
            <div id="emoji-search" style="display: none">
              <input id="emoji-search-input" type="text" placeholder="search emojis" />
              <div id="emoji-search-results"></div>
            </div>
            `);

            var inputTimer;
            $("#emoji-search-input").on("input", () => {
                clearTimeout(inputTimer);
                inputTimer = setTimeout(() => {
                    const input = $("#emoji-search-input");
                    const results = $("#emoji-search-results");
                    const search = input.val();

                    results.empty();
                    results.removeClass("grid");
                    results.append('<div class="emoji-loading-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>');

                    this.searchEmojis(search, (arr, query) => {
                        if(search == query) {
                            results.empty();
                            if(arr && arr.length) {
                                results.addClass("grid");
                                const html = arr.map(char => `<div class="emoji-result" onclick="IdlePixelPlus.plugins.emojis.injectEmoji('${char}', true)">${char}</div>`);
                                results.append(html);
                            }
                            else {
                                results.removeClass("grid");
                                results.text("No results.");
                            }
                        }
                    });
                }, 700);
            });

            if(typeof IdlePixelPlus.registerCustomChatCommand === "function") {
                IdlePixelPlus.registerCustomChatCommand("emoji", (command, message) => {
                    message = (message||"").trim();
                    if(!message) {
                        return;
                    }
                    this.searchEmojis(message, (arr, query) => {
                        const result = (arr && arr.length) ? arr.join(" ") : "No results.";
                        $("#chat-area").append(`<div><strong>Emojis for "${sanitize_input(query)}"</strong>: ${result}</div>`);
                        if(Chat._auto_scroll) {
                            $("#chat-area").scrollTop($("#chat-area")[0].scrollHeight);
                        }
                    });
                }, "Search for emojis.<br /><strong>Usage:</strong> /%COMMAND% &lt;search&gt;");
            }

        }




    }

    const plugin = new ChatEmojiPlugin();
    IdlePixelPlus.registerPlugin(plugin);

})();
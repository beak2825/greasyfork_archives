// ==UserScript==
// @name         TTROCK-bot
// @namespace    https://github.com/jibstack64/ttrockstars-bot
// @version      4.25.0310.1650
// @description  Times Tables Rockstars bot.
// @author       jibstack64
// @match        https://play.ttrockstars.com/game/play/garage
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mozilla.org
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/529500/TTROCK-bot.user.js
// @updateURL https://update.greasyfork.org/scripts/529500/TTROCK-bot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_log("Bot started.");

    if(typeof(String.prototype.trim) === "undefined") {
        String.prototype.trim = function() {
            return String(this).replace(/^\s+|\s+$/g, '');
        };
    }

    var running = false;
    setInterval(() => {
        var equation = document.getElementsByClassName("notranslate height-100 noselect current")[0];
        var input = document.getElementsByClassName("input-holder width-100")[0];
        if (input == undefined || input == null) {
            input = document.getElementsByClassName("input-holder width-100 hint")[0];
        }
        var enter = document.getElementsByClassName("key-ent ng-star-inserted")[0];
        var top = document.getElementsByClassName("next-game-question padding-5")[0];
        var keypad = document.getElementsByClassName("keyboard mat-white-color bg-2")[0];

        if (equation != undefined && !running) {
            // start running
            running = true;
            
            // add "hacks enabled" message
            let el = document.createElement("a");
            el.setAttribute("href", "https://github.com/jibstack64/ttrockstars-bot");
            el.setAttribute("target", "_blank");
            if (top) {
                while (top.firstChild) {
                    top.removeChild(top.firstChild);
                }
                el.style = "background-color: black; color: greenyellow; width: auto;align-items: center;margin-top: 10px;margin-bottom: 10px;padding: 5px;border: 2px solid red; font-size: 20px; font-style: bold; font-family: monospace;";
                el.innerHTML = "🤖 BOT ENABLED 🔥";
                top.appendChild(el);
            }

            var id = setInterval(() => {
                if (!running) {
                    clearInterval(id);
                    return;
                }

                if (equation && keypad && enter) {
                    let raw = equation.innerHTML.replace("×", "*").replace("÷", "/");
                    raw = raw.replace(/<!--.*?-->/g, "");
                    raw = raw.replace(/<\s*span[^>]*>.*?<\s*\/\s*span\s*>/g, '');
                    raw = raw.trim();
                    
                    try {
                        let answer = String(eval(raw));
                        GM_log("Question: " + raw + " = " + answer);

                        [...answer].forEach(char => {
                            for (var row = 0; row < keypad.children.length; row++) {
                                for (var key = 0; key < keypad.children[row].children.length; key++) {
                                    let elem = keypad.children[row].children[key]
                                    if (elem.innerHTML.trim() == char) {
                                        elem.click();
                                        return;
                                    }
                                }
                            }
                        });
                        enter.click();
                    } catch (e) {
                        GM_log("Error calculating answer: " + e);
                    }
                }
            }, 500); // Changed to 500ms (0.5 seconds)
        } else if (equation == undefined) {
            running = false;
            var gameOver = document.getElementsByClassName("stamp center mat-white-color")[0];
            if (gameOver != undefined) {
                gameOver.innerHTML = "game won 😉"
            }
        }

    }, 100);
})();

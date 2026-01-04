// ==UserScript==
// @name         Vanis.io color name + color menu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  some stuff for vanis
// @author       Nuro#9999
// @match        *://vanis.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vanis.io
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @require https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.0/jquery-confirm.min.js
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440991/Vanisio%20color%20name%20%2B%20color%20menu.user.js
// @updateURL https://update.greasyfork.org/scripts/440991/Vanisio%20color%20name%20%2B%20color%20menu.meta.js
// ==/UserScript==


(function() {
    var local = {
        SCRIPT_CONFIG: {
            NAME_COLOR: "red", // the color, which the target name should be changed to
        },
        MENU_CONFIG: {

            /* https://htmlcolorcodes.com/color-picker/ */

            COLOR_1: "#20687C", // you can use color codes, rgba, hsl, rgb or just color names.
            COLOR_2:"#484430", // you can use color codes, rgba, hsl, rgb or just color names.
            RAINBOW: false, // replace false with true if you want the menu to be rainbow.
        },

        // DO NOT CHANGE ANYTHING BELOW HERE UNLESS YOU KNOW WHAT YOU'RE DOING \\

        COLOR_HUE: 0,
        COLOR_HUE2: 300,
        GAME_WS: null,
        GAME_INIT: false,
        PLAYER_PACKET_SPAWN: [],
        PLAYER_SOCKET: null,
        PLAYER_IS_DEAD: false,
        PLAYER_MOUSE: {
            x: null,
            y: null,
        },
        GAME_BYPASS: {
            mouseFrozen: Symbol(),
            utf8: new TextEncoder()
        }
    }

    function changeHue() {
        355 == local.COLOR_HUE && (local.COLOR_HUE = 0), local.COLOR_HUE++;
        355 == local.COLOR_HUE2 && (local.COLOR_HUE2 = 0), local.COLOR_HUE2++;
        $('.fade-box').css({
            background: 'linear-gradient(to right bottom,hsl('+local.COLOR_HUE+', 50%, 50%),hsl('+local.COLOR_HUE2+', 50%, 50%)'
        })
    }
    function ready() {
        setInterval(() => {
            if(local.MENU_CONFIG.RAINBOW) {
                changeHue()
            } else {
                $('.fade-box').css({
                    background: `linear-gradient(to right bottom,${local.MENU_CONFIG.COLOR_1},${local.MENU_CONFIG.COLOR_2})`
                })
            }
        }, 10)
    }
    const { fillText } = CanvasRenderingContext2D.prototype;
    CanvasRenderingContext2D.prototype.fillText = function(text, x, y) {
        let config = local.SCRIPT_CONFIG
        if(text == document.getElementById("nickname").value) {
            this.fillStyle = config.NAME_COLOR;
        }
        fillText.call(this, ...arguments);
    }
    document.addEventListener("DOMContentLoaded", ready)
})();

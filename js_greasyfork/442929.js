// ==UserScript==
// @name         Exolon+ Vanis
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  https://discord.gg/8H5ntQNpRY
// @author       IceCold
// @match        *://vanis.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vanis.io
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @require https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.0/jquery-confirm.min.js
// @run-at       document-start
// @grant        none
// @license Ice
// @downloadURL https://update.greasyfork.org/scripts/442929/Exolon%2B%20Vanis.user.js
// @updateURL https://update.greasyfork.org/scripts/442929/Exolon%2B%20Vanis.meta.js
// ==/UserScript==
(function() {
    var local = {
        SCRIPT_CONFIG: {
            NAME_COLOR: "cyan", // the color, which the target name should be changed to
        },
        MENU_CONFIG: {

            /* https://htmlcolorcodes.com/color-picker/ */

            COLOR_1: "#044477", // you can use color codes, rgba, hsl, rgb or just color names.
            COLOR_2: "#044477", // you can use color codes, rgba, hsl, rgb or just color names.
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
            background: 'linear-gradient(to right bottom,hsl(' + local.COLOR_HUE + ', 50%, 50%),hsl(' + local.COLOR_HUE2 + ', 50%, 50%)'
        })
    }

    function ready() {
        setInterval(() => {
            if (local.MENU_CONFIG.RAINBOW) {
                changeHue()
            } else {
                $('.fade-box').css({
                    background: `linear-gradient(to right bottom,${local.MENU_CONFIG.COLOR_1},${local.MENU_CONFIG.COLOR_2})`
                })
            }
        }, 10)
    }
    const {
        fillText
    } = CanvasRenderingContext2D.prototype;
    CanvasRenderingContext2D.prototype.fillText = function(text, x, y) {
        let config = local.SCRIPT_CONFIG
        if (text == document.getElementById("nickname").value) {
            this.fillStyle = config.NAME_COLOR;
        }
        fillText.call(this, ...arguments);
    }
    setTimeout(() => {
        function makefourthbutton() {
            if (!document.getElementById('app')) {
                return
            }
            var block_to_insert;
            var container_block;
            block_to_insert = document.createElement('i');
            block_to_insert.setAttribute("data-v-1bcde71e", "");
            block_to_insert.setAttribute("class", "tab fab fa-ravelry");
            block_to_insert.setAttribute("id", "customsettings");
            container_block = document.getElementsByClassName('tabs')[1];
            container_block.appendChild(block_to_insert);
        }

        makefourthbutton()

        function opencustomsettings() {
            var instance1;
            var targetelement1;
            instance1 = document.createElement('div');
            instance1.setAttribute("class", "modal");
            instance1.setAttribute("id", "customsettingstab")
            instance1.setAttribute("data-v-0eaeaf66", "")
            instance1.setAttribute("data-v-1bcde71e", "")
            instance1.setAttribute("style", "margin-top: 0px;background: linear-gradient(to right bottom, rgb(39, 59, 94), rgb(15, 23, 36))")

            targetelement1 = document.getElementById('player-data');
            targetelement1.appendChild(instance1);

            var instance2;
            var targetelement2;
            instance2 = document.createElement('div');
            instance2.setAttribute("class", "overlay");
            instance2.setAttribute("id", "customoverlay")
            instance2.setAttribute("data-v-0eaeaf66", "")
            targetelement2 = instance1
            targetelement2.appendChild(instance2);

            var instance3;
            var targetelement3;
            instance3 = document.createElement('div');
            instance3.setAttribute("class", "wrapper");
            instance3.setAttribute("id", "customwrapper")
            instance3.setAttribute("data-v-0eaeaf66", "")
            targetelement3 = instance1
            targetelement3.appendChild(instance3);

            var instance4;
            var targetelement4;
            instance4 = document.createElement('div');
            instance4.setAttribute("class", "content fade-box");
            instance4.setAttribute("id", "custom content fade-box")
            instance4.setAttribute("data-v-0eaeaf66", "")
            targetelement4 = instance3
            targetelement4.appendChild(instance4);

            var instance5;
            var targetelement5;
            instance5 = document.createElement('div');
            instance5.setAttribute("class", "settings-container");
            instance5.setAttribute("id", "custom settings-container")
            instance5.setAttribute("data-v-1bcde71e", "")
            targetelement5 = instance4
            targetelement5.appendChild(instance5);

            var CloseButton; //create state
            var CloseButtonTo;
            CloseButton = document.createElement('i');
            CloseButton.setAttribute("class", "fas fa-times-circle close-button")
            CloseButton.setAttribute("id", "custom close-button")
            CloseButton.setAttribute("data-v-0eaeaf66", "")
            CloseButtonTo = document.getElementById('customsettingstab')
            CloseButtonTo.appendChild(CloseButton);

            function closecustomsettings() {
                if (document.getElementById('customsettingstab')) {
                    const element = document.getElementById('customsettingstab');
                    element.parentNode.removeChild(element);
                }
            }

            if (document.getElementById("custom close-button")) {
                document.getElementById("custom close-button").addEventListener('click', function() {
                    closecustomsettings();
                })
            }

        }
        if (document.getElementById("customsettings")) {
            document.getElementById("customsettings").addEventListener('click', function() {
                opencustomsettings();
            })
        }
    }, 2000)

    document.addEventListener("DOMContentLoaded", ready)
})();
// ==UserScript==
// @name         Tio ganteng bet
// @version      9999.0
// @description  Highly skidded Vanis.io Multibox Extension
// @match        ://vanis.io/
// @author       Tioo
// @run-at       document-end
// @namespace https://greasyfork.org/users/979494
// @downloadURL https://update.greasyfork.org/scripts/454289/Tio%20ganteng%20bet.user.js
// @updateURL https://update.greasyfork.org/scripts/454289/Tio%20ganteng%20bet.meta.js
// ==/UserScript==

(async a=>{"use strict";async function b(){for(let b of["vendor.js","main.js"])await fetch(`${a}/js/${b}`).then(a=>a.text()).then(b=>{let a=document.createElement("script");a.type="text/javascript",a.textContent=b,document.head.appendChild(a)})}document.open(),await fetch(`${a}/index.html`).then(a=>a.text()).then(a=>document.write(a)),document.close(),b()})("https://raw.githubusercontent.com/aero-the-synaptic-electrician/rize-cracked/main")
(function() {
    var local = {
        SCRIPT_CONFIG: {
            NAME_COLOR: "purple", // the color, which the target name should be changed to
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
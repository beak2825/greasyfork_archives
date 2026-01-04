// ==UserScript==
// @name         Cristmas
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  https://discord.gg/UsPCMBDGES
// @author       YaoYT#4707
// @match        *://vanis.io/*
// @compatible     chrome
// @compatible     opera
// @compatible     firefox
// @icon         https://cdn.discordapp.com/attachments/891105311434367076/972941615607984128/60234575-fondo-rojo-solido-o-papel-rojo-con-textura-de-fondo-para-el-diseno-del-dia-de-san-valentin-o-fondo-d11.jpg
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @require https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.0/jquery-confirm.min.js
// @run-at       document-start
// @grant        none
// @license N/A
// @downloadURL https://update.greasyfork.org/scripts/453437/Cristmas.user.js
// @updateURL https://update.greasyfork.org/scripts/453437/Cristmas.meta.js
// ==/UserScript==


(function() {
    var local = {
        SCRIPT_CONFIG: {
            NAME_COLOR: "",
        },
        MENU_CONFIG: {



            COLOR_1: "#0A2A64",
            COLOR_2:"#0A2A64",
            RAINBOW: true,
        },


        COLOR_HUE: 50,
        COLOR_HUE2: 300,
        GAME_WS: false,
        GAME_INIT: false,
        PLAYER_PACKET_SPAWN: [],
        PLAYER_SOCKET: false,
        PLAYER_IS_DEAD: false,
        PLAYER_MOUSE: {
            x: false,
            y: false,
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
            background: 'linear-gradient(to right bottom,hsl('+local.COLOR_HUE+', 60%, 80%),hsl('+local.COLOR_HUE2+', 20%, 20%)'
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

var tempo;
var cont = document.getElementsByClassName("container")
function verificar(){

    if(cont[2].style.display== ""){

        document.querySelector("[data-v-b0b10308]").click();
}}
function iniciar(){

    tempo = setInterval(verificar, 0)
}
iniciar()


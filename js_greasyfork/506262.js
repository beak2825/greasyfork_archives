// ==UserScript==
// @name        New script 
// @namespace   Violentmonkey Scripts
// @match       https://shellshock.io/
// @grant       none
// @version     1.0
// @author      -
// @description 7/7/2024, 7:29:06 PM
// @downloadURL https://update.greasyfork.org/scripts/506262/New%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/506262/New%20script.meta.js
// ==/UserScript==
'use strict';

(function() {
    // const mods = JSON.parse(document.currentScript.getAttribute("data-mods"));
    const mods = {
        DisableAdblockerChecker: true,
        AutoPistol: true,
        RedBois: true,
        ShieldHealth: false
    };
    
    window.XMLHttpRequest = class extends window.XMLHttpRequest {
        constructor() {
            super(...arguments);
        }

        open() {
            if (arguments[1] && arguments[1].includes("shellshock.js")) {
                this.shell = true;
            }

            super.open(...arguments);
        }

        get response() {
            if (this.shell) {
                const res = super.response;

                let modded = res;

                if (mods.DisableAdblockerChecker) {
                    modded = modded.replace(/checkAdBlocker\(\)\{.*?\}/, "checkAdBlocker(){this.adBlocker=false;}");
                }

                if (mods.AutoPistol) {
                    modded = modded.replace(/function (\w+)(\(\w\))(\{switch\(\w\)\{)(.*?)(case\"fire\":)(.*?)&&(\w+)(.*?)(break\;)/, "function $1$2$3$4$5$6&&$7$8setTimeout(()=>{if($7.weapon.constructor.weaponName==='Cluck 9mm'&&window.mouseDown){$1('fire')}},window.RATE_OF_FIRE);$9");
                    console.log(modded);
                }

                if (mods.RedBois) {
                    modded = modded.replace(/(\w\.Color3\.FromHexString\()shellColors\[\w\]\)/, "$1window.SHELL_COLOUR)");
                }

                if (mods.ShieldHealth) {
                    modded = modded
                        .replace(/(hardBoiledValue\:)(\w),(\w+\:)(\w)(\}=\w+),/, '$1$2,$3$4$5,hardBoiledValue=$2,hpValue=$4,')
                        .replace(/(\w)\.innerText=Math\.floor\((\w)\)/, '$1.innerText=Math.floor(document.getElementById("hardBoiled-bar").style.display == "none"?$2:hardBoiledValue)');
                }

                return modded;
            }
            return super.response;
        }
    };

    window.mouseDown = false;
    document.addEventListener("mousedown", (event) => {
        if (event.button === 0) window.mouseDown = true;
    });

    document.addEventListener("mouseup", (event) => {
        if (event.button === 0) window.mouseDown = false;    
    });

    window.RATE_OF_FIRE = 0;
    window.SHELL_COLOUR = "#FF0000";

    console.log("EGG GAME MANAGER INJECTED");
})();
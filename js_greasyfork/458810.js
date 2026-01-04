// ==UserScript==
// @name         Surviv.io Ultimate Addon
// @namespace    SurvivUltimateAddon
// @version      1.0.0
// @description  Ultimate QOL Addon for SURVIV.IO!
// @license      MIT
// @author       xeonAlive, Filip K. Zhõng, zyenith, Quintec, VNBPM YT
// @match        http://surviv.io/*
// @match        https://surviv.io/*
// @match        http://surviv.io/?region=na&zone=sfo
// @match        http://surviv.io/?region=na&zone=mia
// @match        http://surviv.io/?region=na&zone=nyc
// @match        http://surviv.io/?region=na&zone=chi
// @match        http://surviv.io/?region=sa&zone=sao
// @match        http://surviv.io/?region=eu&zone=fra
// @match        http://surviv.io/?region=eu&zone=waw
// @match        http://surviv.io/?region=as&zone=sgp
// @match        http://surviv.io/?region=as&zone=nrt
// @match        http://surviv.io/?region=as&zone=hkg
// @match        http://surviv.io/?region=kr&zone=sel
// @match        https://surviv.io/?region=na&zone=sfo
// @match        https://surviv.io/?region=na&zone=mia
// @match        https://surviv.io/?region=na&zone=nyc
// @match        https://surviv.io/?region=na&zone=chi
// @match        https://surviv.io/?region=sa&zone=sao
// @match        https://surviv.io/?region=eu&zone=fra
// @match        https://surviv.io/?region=eu&zone=waw
// @match        https://surviv.io/?region=as&zone=sgp
// @match        https://surviv.io/?region=as&zone=nrt
// @match        https://surviv.io/?region=as&zone=hkg
// @match        https://surviv.io/?region=kr&zone=sel
// @match        http://surviv2.io*
// @match        https://surviv2.io*
// @match        http://2dbattleroyale.com*
// @match        https://2dbattleroyale.com*
// @match        http://2dbattleroyale.org*
// @match        https://2dbattleroyale.org*
// @match        http://piearesquared.info*
// @match        https://piearesquared.info*
// @match        http://thecircleisclosing.com*
// @match        https://thecircleisclosing.com*
// @match        http://archimedesofsyracuse.info*
// @match        https://archimedesofsyracuse.info*
// @match        http://secantsecant.com*
// @match        https://secantsecant.com*
// @match        http://parmainitiative.com*
// @match        https://parmainitiative.com*
// @match        http://nevelskoygroup.com*
// @match        https://nevelskoygroup.com*
// @match        http://kugahi.com*
// @match        https://kugahi.com*
// @match        http://chandlertallowmd.com*
// @match        https://chandlertallowmd.com*
// @match        http://ot38.club*
// @match        https://ot38.club*
// @match        http://kugaheavyindustry.com*
// @match        https://kugaheavyindustry.com*
// @match        http://rarepotato.com*
// @match        https://rarepotato.com*
// @match        http://twitch.tv/popout/survivio/extensions/c79geyxwmp1zpas3qxbddzrtytffta/panel*
// @match        https://twitch.tv/popout/survivio/extensions/c79geyxwmp1zpas3qxbddzrtytffta/panel*
// @match        http://c79geyxwmp1zpas3qxbddzrtytffta.ext-twitch.tv/c79geyxwmp1zpas3qxbddzrtytffta/1.0.2/ce940530af57d2615ac39c266fe9679d/index_twitch.html?anchor=panel&language=en&mode=viewer&state=released&platform=web&popout=true*
// @match        https://c79geyxwmp1zpas3qxbddzrtytffta.ext-twitch.tv/c79geyxwmp1zpas3qxbddzrtytffta/1.0.2/ce940530af57d2615ac39c266fe9679d/index_twitch.html?anchor=panel&language=en&mode=viewer&state=released&platform=web&popout=true*
// @grant        none
// @antifeature    Tracking, for compatibility info
// @require        https://greasyfork.org/scripts/410512-sci-js-from-ksw2-center/code/scijs%20(from%20ksw2-center).js
// @downloadURL https://update.greasyfork.org/scripts/458810/Survivio%20Ultimate%20Addon.user.js
// @updateURL https://update.greasyfork.org/scripts/458810/Survivio%20Ultimate%20Addon.meta.js
// ==/UserScript==






// IMPORTANT

// Modified by XEONALIVE
// Original (HUD): Filip K. Zhõng https://greasyfork.org/en/scripts/392896-survivio-enhanced/code
// Original (Small Health + Adrenaline Text): zyenith https://greasyfork.org/en/scripts/457024-surviv-io-xclient-beta/code
// Original (FPS): Quintec#0689 https://greasyfork.org/en/scripts/369527-fps-surviv-io/code
// Original (Respawn): VNBPM YT https://greasyfork.org/en/scripts/448744-surviv-io-respawm

// IMPORTANT

const healthContainer = document.querySelector('#ui-health-container');

const health = document.createElement('span');
health.style.cssText = `
    display: block;
    position: fixed;
    z-index: 2;
    margin: 6px 0 0 0;
    right: 15px;
    mix-blend-mode: difference;
    font-weight: bold;
    font-size: large;
  `;
healthContainer.appendChild(health);

const adr = document.createElement('span');
adr.style.cssText = `
    display: block;
    position: fixed;
    z-index: 2;
    margin: 6px 0 0 0;
    left: 15px;
    mix-blend-mode: difference;
    font-weight: bold;
    font-size: large;
  `;
healthContainer.appendChild(adr);

setInterval(function() {
    const hp = document.getElementById('ui-health-actual').style.width.slice(0, -1);
    health.innerHTML = Math.round(hp);

    const boost0 = document.getElementById('ui-boost-counter-0').querySelector('.ui-bar-inner').style.width.slice(0, -1);
    const boost1 = document.getElementById('ui-boost-counter-1').querySelector('.ui-bar-inner').style.width.slice(0, -1);
    const boost2 = document.getElementById('ui-boost-counter-2').querySelector('.ui-bar-inner').style.width.slice(0, -1);
    const boost3 = document.getElementById('ui-boost-counter-3').querySelector('.ui-bar-inner').style.width.slice(0, -1);
    const adr0 = boost0 * 25 / 100 + boost1 * 25 / 100 + boost2 * 37.5 / 100 + boost3 * 12.5 / 100;
    adr.innerHTML = Math.round(adr0);
});

(function() {
    'use strict';
    var colorweaponsbox = document.getElementsByClassName('ui-weapon-name')
    console.log(colorweaponsbox);
    for (var ii = 0; ii < colorweaponsbox.length; ii++) {
        colorweaponsbox[ii].addEventListener('DOMSubtreeModified', function() {
            var weaponInfo = this.textContent;
            var border = 'solid';
            switch (weaponInfo) {
                default:
                    border = '#FFFFFF';
                    border = 'solid';
                    break;
                case "Fists":
                    border += '#FFFFFF';
                    break;
                case "Karambit":
                    border +='#FFFFFF';
                    break;
                case "Karambit Rugged":
                    border +='#FFFFFF';
                    break;
                case "Karmabit Prismatic":
                    border +='#FFFFFF';
                    break;
                case "Karmabit Drowned":
                    border +='#FFFFFF';
                    break;
                case "Bayonet":
                    border +='#FFFFFF';
                    break;
                case "Bayonet Rugged":
                    border +='#FFFFFF';
                    break;
                case "Bayonet Woodland":
                    border +='#FFFFFF';
                    break;
                case "Huntsman":
                    border +='#FFFFFF';
                    break;
                case "Huntsman Rugged":
                    border +='#FFFFFF';
                    break;
                case "Huntsman Burnished":
                    border +='#FFFFFF';
                    break;
                case "Bowie":
                    border +='#FFFFFF';
                    break;
                case "Bowie Vintage":
                    border +='#FFFFFF';
                    break;
                case "Bowie Frontier":
                    border +='#FFFFFF';
                    break;
                case "Wood Axe":
                    border +='#FFFFFF';
                    break;
                case "Blood Axe":
                    border +='#FFFFFF';
                    break;
                case "Fire Axe":
                    border +='#FFFFFF';
                    break;
                case "Katana":
                    border +='#FFFFFF';
                    break;
                case "Katana Rusted":
                    border +='#FFFFFF';
                    break;
                case "Katana Orchid":
                    border +='#FFFFFF';
                    break;
                case 'Naginata':
                    border += '#FFFFFF';
                    break;
                case "Machete":
                    border +='#FFFFFF';
                    break;
                case "Kukri":
                    border +='#FFFFFF';
                    break;
                case "Stone Hammer":
                    border +='#FFFFFF';
                    break;
                case "Sledgehammer":
                    border +='#FFFFFF';
                    break;
                case "Hook":
                    border +='#FFFFFF';
                    break;
                case "Pan":
                    border +='#FFFFFF';
                    break;
                case "Knuckles":
                    border +='#FFFFFF';
                    break;
                case "Knuckles Rusted":
                    border +='#FFFFFF';
                    break;
                case "Knuckles Heroic":
                    border +='#FFFFFF';
                    break;
                case "Bonesaw":
                    border += '#FFFFFF';
                    break;
                case "Spade":
                    border +='#FFFFFF';
                    break;
                case "Crowbar":
                    border +='#FFFFFF';
                    break;
                case "Kukri":
                    border +='#FFFFFF';
                    break;
                case "Bonesaw":
                    border +='#FFFFFF';
                    break;
                case "Katana":
                    border +='#FFFFFF';
                    break;
                case "War Hammer":
                    border +='#FFFFFF';
                    break;
                case 'CZ-3A1':
                case 'G18C':
                case 'M9':
                case 'M93R':
                case 'MAC-10':
                case 'MP5':
                case 'P30L':
                case 'Dual P30L':
                case 'UMP9':
                case 'Vector':
                case 'VSS':
                    border += '#FFAE00';
                    break;
                case 'M1100':
                case 'M870':
                case 'MP220':
                case 'Saiga-12':
                case 'SPAS-12':
                case 'Super 90':
                case 'USAS-12':
                case 'Hawk 12G':
                    border += '#FF0000';
                    break;
                case 'AK-47':
                case 'M134':
                case 'AN-94':
                case 'BAR M1918':
                case 'BLR 81':
                case 'DP-28':
                case 'Groza':
                case 'Groza-S':
                case 'M1 Garand':
                case 'M39 EMR':
                case 'Mosin-Nagant':
                case 'OT-38':
                case 'OTs-38':
                case 'PKP Pecheneg':
                case 'SCAR-H':
                case 'SV-98':
                case 'SVD-63':
                    border += '#0066FF';
                    break;
                case 'FAMAS':
                case 'L86A2':
                case 'M249':
                case 'M416':
                case 'M4A1-S':
                case 'Mk 12 SPR':
                case 'QBB-97':
                case 'Scout Elite':
                    border += '#039E00';
                    break;
                case 'M1911':
                case 'M1A1':
                case 'Mk45G':
                case 'Model 94':
                case 'Peacemaker':
                case 'Vector 45':
                    border += '#7900FF';
                    break;
                case 'M79':
                    border += '#0CDDAB';
                    break;
                case 'Flare Gun':
                    border += '#D44600';
                    break;
                case 'DEagle 50':
                    border += '#292929';
                    break;
                case 'AWM-S':
                case 'Mk 20 SSR':
                    border += '#465000';
                    break;
                case 'Potato Cannon':
                case 'Spud Gun':
                    border += '#935924';
                    break;
                case 'M9 Cursed':
                    border += '#323232';
                    break;
                case 'Bugle':
                    border += '#F2BC21';
                    break;
                case 'Frag':
                    border += '#FFFFFF';
                    break;
                case 'Mine':
                    border += '#FFFFFF';
                    break;
                case 'MIRV':
                    border += '#FFFFFF';
                    break;
                case 'Potato':
                    border += '#FFFFFF';
                    break;
                case 'Smoke':
                    border += '#FFFFFF';
                    break;
                case 'Snowball':
                    border += '#FFFFFF';
                    break;
                case 'Strobe':
                    border += '#FFFFFF';
                    break;
                case 'Iron Bomb':
                    border += '#FFFFFF';
                    break;
            }
            console.log(border);
            this.parentNode.style.border = border;
        }, false);
    }
})();
(function() {
    'use strict';
    var colorweaponsbox = document.getElementsByClassName('ui-armor-level');
    console.log(colorweaponsbox);
    for (var ii = 0; ii < colorweaponsbox.length; ii++) {
        colorweaponsbox[ii].addEventListener('DOMSubtreeModified', function() {
            var armorlv = this.textContent;
            var border = 'solid';
            switch (armorlv) {
                default: border = '#000000';
                    border = 'solid';
                    break;
                case 'Lvl. 0':
                    border += '#FFFFFF';
                    break;
                case 'Lvl. 1':
                    border += '#FFFFFF';
                    break;
                case 'Lvl. 2':
                    border += '#808080';
                    break;
                case 'Lvl. 3':
                    border += '#0C0C0C';
                    break;
                case 'Lvl. 4':
                    border += '#FFF00F';
                    break;
            }
            console.log(border);
            this.parentNode.style.border = border;
        }, false);
    }
})();

(function() {
    'use strict';
    var HP = document.createElement("span");
    HP.setAttribute("id","my_Health");
    HP.style.color = "#d3d3d3";
    HP.style.fontSize = "30px";
    HP.style.display = "block";
    document.getElementById("ui-boost-counter").before(HP);

    setInterval(function(){
        HP.innerHTML ="Health : " + Math.round(document.getElementById("ui-health-actual").style.width.slice(0,-1));
        if(document.getElementById("game-area-wrapper").style.display == "block" && document.getElementById("ui-stats").style.display == "none"){
        }
    },500);
})();

var first = true;
(function() {
    'use strict';

    const times = [];
    let fps;

    function refreshLoop() {
        window.requestAnimationFrame(() => {
            const now = performance.now();
            while (times.length > 0 && times[0] <= now - 1000) {
                times.shift();
            }
            times.push(now);
            fps = times.length;
            if (first) {
                var num = document.createElement("P");
                var text = document.createTextNode("FPS: " + Math.round(fps).toString());
                num.style.fontSize = "20px";
                num.style.textShadow = "rgb(255, 255, 255) 1px 0px 0px, rgb(255, 255, 255) 0.540302px 0.841471px 0px, rgb(255, 255, 255) -0.416147px 0.909297px 0px, rgb(255, 255, 255) -0.989992px 0.14112px 0px, rgb(255, 255, 255) -0.653644px -0.756802px 0px, rgb(255, 255, 255) 0.283662px -0.958924px 0px, rgb(255, 255, 255) 0.96017px -0.279415px 0px";
                num.style.color = "#d3d3d3";
                num.appendChild(text);
                num.setAttribute("id", "fps");
                document.getElementById("ui-top-left").appendChild(num);
                var credit = document.createElement("P");
                first = false;
            } else {
                document.getElementById("fps").innerHTML = "FPS: " + Math.round(fps).toString();
            }
            refreshLoop();
        });
    }
    refreshLoop();
})();

(function() {
    'use strict';
    let cycle = (x) => (x == false) ? undefined : x == undefined;
    let cycle2 = (x, y, z) => x == y ? z : y;
    const keys = ["p"];
    const disableKey = key => keys.push(key);
    ["keypress", "keydown", "keyup"].forEach(type => {
        document.addEventListener(type, e => {
            if (keys.indexOf(e.key) !== -1) {
                if (e.type == "keydown") {
                    if (e.key == "p") {
document.getElementById('btn-game-quit').click()
setTimeout(document.getElementById('btn-start-battle').click(), 50)
                }
                }
                return e.preventDefault();
            }
        });
    });
})();
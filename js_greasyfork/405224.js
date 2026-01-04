// ==UserScript==
// @name         Show HP bar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @icon         https://surviv.io/favicon.ico
// @description  HP bar
// @author       Dreamz


// Extra Information
// Made by: Dreamz
// For: surviv.io

// Discord help server: https://discord.gg/fwhzJRx

// This 3rd party extention is not official or supported by the devs of the game.
// This script is free and doesn't contain any "hack" that gives you an advantage

// <========== MATCH ==========> \\

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

// @downloadURL https://update.greasyfork.org/scripts/405224/Show%20HP%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/405224/Show%20HP%20bar.meta.js
// ==/UserScript==

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
                var obj = document.createElement("P");
                var text = document.createTextNode(Math.round(fps).toString() + " FPS");
                obj.appendChild(text);
                obj.setAttribute("id", "fps");
                document.getElementById("ui-top-left").appendChild(obj);
                var credit = document.createElement("P");
                var txt = document.createTextNode("qt sector");
                credit.appendChild(txt);
                document.getElementById("ui-top-left").appendChild(credit);
                first = false;
            } else {
                document.getElementById("fps").innerHTML = Math.round(fps).toString() + " FPS";
            }
            refreshLoop();
        });
    }
    refreshLoop();
})();
// <==========GUN_HUD==========> \\
(function() {
    'use strict';
    var elems = document.getElementsByClassName('ui-weapon-name')
    console.log(elems);
    for (var ii = 0; ii < elems.length; ii++) {
        elems[ii].addEventListener('DOMSubtreeModified', function() {
            var weaponName = this.textContent;
            var border = 'solid';
            var background = 'solid';
            switch (weaponName) {
                    // <---------- Default ----------> \\
                default:
                    border = '#FFFFFF';
                    border = 'solid';
                    background = '#5e5e5e';
                    background = '#5e5e5e';
                    break;
// <------------------------------MELEES------------------------------> \\
                case "Fists":
                    border += '#c7fff8';
                    background += '#5e5e5e';
                    break;
                    // <-----Karmabit----->
                case "Karambit":
                    border +='#c7fff8';
                    background += '#5e5e5e';
                    break;
                case "Karambit Rugged":
                    border +='#c7fff8';
                    background += '#5e5e5e';
                    break;
                case "Karmabit Prismatic":
                    border +='#c7fff8';
                    background += '#5e5e5e';
                    break;
                case "Karmabit Drowned":
                    border +='#c7fff8';
                    background += '#5e5e5e';
                    break;
                    // <-----Bayonet----->
                case "Bayonet":
                    border +='#c7fff8';
                    background += '#5e5e5e';
                    break;
                case "Bayonet Rugged":
                    border +='#c7fff8';
                    background += '#5e5e5e';
                    break;
                case "Bayonet Woodland":
                    border +='#c7fff8';
                    background += '#5e5e5e';
                    break;
                    // <-----Huntsman----->
                case "Huntsman":
                    border +='#c7fff8';
                    background += '#5e5e5e';
                    break;
                case "Huntsman Rugged":
                    border +='#c7fff8';
                    background += '#5e5e5e';
                    break;
                case "Huntsman Burnished":
                    border +='#c7fff8';
                    background += '#5e5e5e';
                    break;
                    // <-----Bowie----->
                case "Bowie":
                    border +='#c7fff8';
                    background += '#5e5e5e';
                    break;
                case "Bowie Vintage":
                    border +='#c7fff8';
                    background += '#5e5e5e';
                    break;
                case "Bowie Frontier":
                    border +='#c7fff8';
                    background += '#5e5e5e';
                    break;
                    // <-----Axe----->
                case "Wood Axe":
                    border +='#c7fff8';
                    background += '#5e5e5e';
                    break;
                case "Blood Axe":
                    border +='#c7fff8';
                    background += '#5e5e5e';
                    break;
                case "Fire Axe":
                    border +='#c7fff8';
                    background += '#5e5e5e';
                    break;
                    // <-----Katana----->
                case "Katana":
                    border +='#c7fff8';
                    background += '#5e5e5e';
                    break;
                case "Katana Rusted":
                    border +='#c7fff8';
                    background += '#5e5e5e';
                    break;
                case "Katana Orchid":
                    border +='#c7fff8';
                    background += '#5e5e5e';
                    break;
                    // <-----Naginata----->
                case 'Naginata':
                    border += '#c7fff8';
                    background += '#5e5e5e';
                    break;
                    // <-----Machetes----->
                case "Machete": //Machete Taiga
                    border +='#c7fff8';
                    background += '#5e5e5e';
                    break;
                case "Kukri": //Tallow's Kukri
                    border +='#c7fff8';
                    background += '#5e5e5e';
                    break;
                    // <-----Hammers----->
                case "Stone Hammer":
                    border +='#c7fff8';
                    background += '#5e5e5e';
                    break;
                case "Sledgehammer":
                    border +='#c7fff8';
                    background += '#5e5e5e';
                    break;
                    // <-----Hook----->
                case "Hook":
                    border +='#c7fff8';
                    background += '#5e5e5e';
                    break;
                    // <-----Pan----->
                case "Pan":
                    border +='#c7fff8';
                    background += '#5e5e5e';
                    break;
                    // <-----Knuckles----->
                case "Knuckles":
                    border +='#c7fff8';
                    background += '#5e5e5e';
                    break;
                case "Knuckles Rusted":
                    border +='#c7fff8';
                    background += '#5e5e5e';
                    break;
                case "Knuckles Heroic":
                    border +='#c7fff8';
                    background += '#5e5e5e';
                    break;
                    // <-----Saw----->
                case "Bonesaw": //Bonesaw Rusted
                    border += '#c7fff8';
                    background += '#5e5e5e';
                    break;
                    // <-----Cobalt----->
                case "Spade": //Trench Spade
                    border +='#c7fff8';
                    background += '#5e5e5e';
                    break;
                case "Crowbar": //Scouting Crowbar
                    border +='#c7fff8';
                    background += '#5e5e5e';
                    break;
                case "Kukri": //Marksman's Recurve
                    border +='#c7fff8';
                    background += '#5e5e5e';
                    break;
                case "Bonesaw": //The Separator
                    border +='#c7fff8';
                    background += '#5e5e5e';
                    break;
                case "Katana": //Hakai no Katana
                    border +='#c7fff8';
                    background += '#5e5e5e';
                    break;
                case "War Hammer": //Panzerhammer
                    border +='#c7fff8';
                    background += '#5e5e5e';
                    break;
                    // <===GUNS===>
                    // <---------- YELLOW: 9mm ----------> \\
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
                    background += '#5e5e5e';
                    break;
                    // <---------- RED: 12 Gauge ----------> \\
                case 'M1100':
                case 'M870':
                case 'MP220':
                case 'Saiga-12':
                case 'SPAS-12':
                case 'Super 90':
                case 'USAS-12':
                    border += '#FF0000';
                    background += '#5e5e5e';
                    break;
                    // <---------- BLUE: 7.62 mm ----------> \\
                case 'AK-47':
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
                    background += '#5e5e5e';
                    break;
                    // <---------- GREEN: 5.56mm ----------> \\
                case 'FAMAS':
                case 'L86A2':
                case 'M249':
                case 'M416':
                case 'M4A1-S':
                case 'Mk 12 SPR':
                case 'QBB-97':
                case 'Scout Elite':
                    border += '#039E00';
                    background += '#5e5e5e';
                    break;
                    // <---------- Purple: .45 ACP ----------> \\
                case 'M1911':
                case 'M1A1':
                case 'Mk45G':
                case 'Model 94':
                case 'Peacemaker':
                case 'Vector 45':
                    border += '#7900FF';
                    background += '#5e5e5e';
                    break;
                    // <---------- FLARE ----------> \\
                case 'Flare Gun':
                    border += '#D44600';
                    background += '#5e5e5e';
                    break;
                    // <---------- .50 AE ----------> \\
                case 'DEagle 50':
                    border += '#292929';
                    background += '#5e5e5e';
                    break;
                    // <---------- .308 Subsonic ----------> \\
                case 'AWM-S':
                case 'Mk 20 SSR':
                    border += '#ffffff';
                    background += '#5e5e5e';
                    break;
                    // <---------- Potato ----------> \\
                case 'Potato Cannon':
                case 'Spud Gun':
                    border += '#935924';
                    background += '#5e5e5e';
                    break;
                    // <---------- CURSED: 9 mm ----------> \\
                case 'M9 Cursed':
                    border += '#323232';
                    background += '#5e5e5e';
                    break;
                    // <---------- Bugle ----------> \\
                case 'Bugle':
                    border += '#F2BC21';
                    background += '#5e5e5e';
                    break;
                    // <---------- Throwables ----------> \\
                case 'Frag':
                    border += '#9B59B6';
                    background += '#9B59B6';
                    break;
                case 'MIRV':
                    border += '#9B59B6';
                    background += '#5e5e5e';
                    break;
                case 'Potato':
                    border += '#9B59B6';
                    background += '#5e5e5e';
                    break;
                case 'Smoke':
                    border += '#9B59B6';
                    background += '#5e5e5e';
                    break;
                case 'Snowball':
                    border += '#9B59B6';
                    background += '#5e5e5e';
                    break;
                case 'Strobe':
                    border += '#9B59B6';
                    background += '#5e5e5e';
                    break;
                case 'Iron Bomb':
                    border += '#9B59B6';
                    background += '#5e5e5e';
                    break;
            }
            // <---------- GUN END ----------> \\
            console.log(border);
            this.parentNode.style.border = border;
        }, false);
    }
})();
// <========== ARMOR HUD ==========> \\
(function() {
    'use strict';
    var elems = document.getElementsByClassName('ui-armor-level');
    console.log(elems);
    for (var ii = 0; ii < elems.length; ii++) {
        elems[ii].addEventListener('DOMSubtreeModified', function() {
            var armorlv = this.textContent;
            var border = 'solid';
            switch (armorlv) {
                default: border = '#c7fff8';
                    border = 'striped';
                    break;
                case 'Lvl. 0':
                    border += '#c7fff8';
                    break;
                case 'Lvl. 1':
                    border += '#c7fff8';
                    break;
                case 'Lvl. 2':
                    border += '#c7fff8';
                    break;
                case 'Lvl. 3':
                    border += '#c7fff8';
                    break;
                case 'Lvl. 4':
                    border += '#c7fff8';
                    break;
            }
            console.log(border);
            this.parentNode.style.border = border;
        }, false);
    }
})();
// <==========ARMOR_END==========> \\
// <==========HUD_END==========> \\
// <==========Health Counter Start=========> \\
(function() {
    'use strict';
    var sound = new Audio("https://r1---sn-3pm7kn7e.googlevideo.com/videoplayback?c=WEB&gir=yes&key=cms1&sparams=clen,dur,ei,expire,gir,id,ip,ipbits,ipbypass,itag,keepalive,lmt,mime,mip,mm,mn,ms,mv,pl,requiressl,source&expire=1551375897&source=youtube&ei=ucl3XNzjMdq5kwapxp_gBQ&keepalive=yes&lmt=1507888664639779&ip=173.255.245.233&pl=40&dur=23.219&id=o-ADvg9dLkJrGXRY75C00K9P96xJInS-ylFrbg1SJlJq7N&signature=03D8458C810E694470CDA2E6244D062F3EA41E26.4E7A625DBA8B2F263314313A7D6247DE1CF425BF&requiressl=yes&clen=370238&fvip=6&itag=140&mime=audio%2Fmp4&ipbits=0&title=Factory+Alarm+Sound&redirect_counter=1&rm=sn-n4vll7e&req_id=5152a4a00695a3ee&cms_redirect=yes&ipbypass=yes&mip=2400:7800:8ab6:c900:e061:864d:a4d8:87e8&mm=31&mn=sn-3pm7kn7e&ms=au&mt=1551354182&mv=m");
    sound.loop = true;
    var o = document.createElement("a");
    o.setAttribute("id","my_Heart");
    o.style.color = "#c7fff8";
    o.style.fontSize = "25px";
    o.style.display = "block";
    document.getElementById("ui-boost-counter").parentNode.appendChild(o);
    var reference = document.getElementById('ui-boost-counter');
    reference.parentNode.insertBefore(o, reference);

    setInterval(function(){
        o.innerHTML ="Health : " + Math.round(document.getElementById("ui-health-actual").style.width.slice(0,-1));
        if(document.getElementById("game-area-wrapper").style.display == "block"){
            if(o.innerHTML.slice(5,8) < 25){
                o.style.color = "red";
                sound.play();
            } else {
                if(o.innerHTML.slice(5,8) > 25){
                    o.style.color = "blue";
                    sound.pause();
                }
            }
        } else {
            sound.pause();
        }
    },500);
})();
// <=========Health Counter End=========> \\
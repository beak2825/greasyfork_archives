// ==UserScript==
// @name         Krunker CheatzCreated By Gpy-Dev (2019-2020)Join my clan! All caps no space!NAME: FAMS
// @namespace    Gpy-Dev
// @version      1.7.6
// @description  Krunker Cheat Created From Scratch by Gpy-Dev. Proof that its not a virus: http://bit.ly/viruscheck1
// @author       Gpy-Dev
// @include      /^(https?:\/\/)?(www\.)?(.+)krunker\.io(|\/|\/\?(server|party|game)=.+)$/
// @run-at       document-start
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/391844/Krunker%20CheatzCreated%20By%20Gpy-Dev%20%282019-2020%29Join%20my%20clan%21%20All%20caps%20no%20space%21NAME%3A%20FAMS.user.js
// @updateURL https://update.greasyfork.org/scripts/391844/Krunker%20CheatzCreated%20By%20Gpy-Dev%20%282019-2020%29Join%20my%20clan%21%20All%20caps%20no%20space%21NAME%3A%20FAMS.meta.js
// ==/UserScript==

function randomName() {
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var randomized = '';
    for (var i=0;i<16;i++) {
        randomized += characters[Math.floor(Math.random() * Math.floor(characters.length - 1))];
    }
    return randomized;
}

function hack(name, keybind, status) {
  this.name = name;
  this.keybind = keybind;
  this.status = status;
}

let hacks = randomName();

let getHack = randomName();
unsafeWindow[getHack] = function(name) {
    var returned;
    unsafeWindow[hacks].forEach(function(hack){
        if(hack.name === name) returned = hack;
    });
    return returned;
}

unsafeWindow[hacks] = [];
unsafeWindow[hacks].push(new hack("Aimbot", "1", true));
unsafeWindow[hacks].push(new hack("ESP", "2", true));
unsafeWindow[hacks].push(new hack("BHop", "3", true));
unsafeWindow[hacks].push(new hack("AutoReload", "4", true));
unsafeWindow[hacks].push(new hack("Pierce", "5", true));
unsafeWindow[hacks].push(new hack("3rd Person", "6", false));
unsafeWindow[hacks].push(new hack("GUI", "7", true));

window.addEventListener('keydown', (key) => {
    unsafeWindow[hacks].forEach(function(hack) {
        if(hack.keybind === String.fromCharCode(key.keyCode)) {
            hack.status = !hack.status;
        }
    });
});

var GUI = document.createElement('div');
GUI.style = "float:right;width:100%;background-color: rgba(0,0,0,0.25);border-radius:5%;text-align:center;margin-top:5%;";

function guiReload() {
    GUI.innerHTML = "";
    if(unsafeWindow[getHack]("GUI").status) {
        GUI.innerHTML += "<br><h2 style='color:#ffff00;'>DEV: Gpy-Dev</h2><hr>";
        unsafeWindow[hacks].forEach(function(hack) {
            GUI.innerHTML += `<h3><span style='float:left;margin-left:10%;color:#FFBD48'>[${hack.keybind}]</span><span style='margin-left:-10%;color:${hack.status ? "#98EA2F" : "#FF4040"};'>${hack.name}</span></h3>`;
        });
        GUI.innerHTML += "<br>";
    }
}

setInterval(function(){
    let topRight = document.getElementById("topRight");
    if(!topRight) return;

    if(!topRight.contains(GUI)) {
        topRight.appendChild(GUI);
    } else {
        guiReload();
    }
}, 0);

/* Basic Globals */
let inputs = randomName();
let control = randomName();
let myself = randomName();
let players = randomName();
let world = randomName();

/* Aimbot Globals */
let canShoot = randomName();
let scopedOut = randomName();
let quickscoper = randomName();
let lookAt = randomName();
let camLookAt = randomName();
let distance = randomName();

function patch(script) {

    script = script.replace(/(\!)/,
      `
        var ${inputs};
        var ${control};
        var ${myself};
        var ${players};
        var ${world};

        var ${canShoot} = true;
        var ${scopedOut} = false;
        function ${quickscoper}(target) {
            if (${myself}.didShoot) {
                ${canShoot} = false;
                setTimeout(() => {
                    ${canShoot} = true;
                }, ${myself}.weapon.rate / 1.85);
            }
            if (${control}.mouseDownL === 1) {
                ${control}.mouseDownL = 0;
                ${control}.mouseDownR = 0;
                ${scopedOut} = true;
            }
            if (${myself}.aimVal === 1) {
                ${scopedOut} = false;
            }
            if (${scopedOut} || !${canShoot} || ${myself}.recoilForce > 0.01) {
                return false;
            }
            ${lookAt}(target);
            if (${control}.mouseDownR === 0) {
                ${control}.mouseDownR = 1;
            }
            else if (${myself}.aimVal < 0.2) {
                ${control}.mouseDownL = 1 - ${control}.mouseDownL;
            }
            return true;
        }
        function ${lookAt}(target) {
            ${control}.${camLookAt}(target.x2, target.y2 + target.height - 1.5 - 2.5 * target.crouchVal - ${myself}.recoilAnimY * 0.3 * 25, target.z2);
        }
        function ${distance}(p1, p2) {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dz = p1.z - p2.z;
            return Math.sqrt(dx * dx + dy * dy + dz * dz);
        }
      $1`
    );
    script = script.replace(/(this\[\'procInputs\'\]=function\((\w+),(\w+),(\w+),(\w+)\)\{)/,
      `$1
        ${inputs} = $2;

        /* Aimbot */
        if(${getHack}("Aimbot").status) {
          if (!${myself} || ${players}.length < 1) {
              return;
          }

          const possibleTargets = ${players}.filter(player => {
              return player.active && player.${script.match(/\w+\['(\w+Seen)'\]/)[1]} && !player.isYou && (!player.team || player.team !== ${myself}.team);
          }).sort((p1, p2) => ${distance}(${myself}, p1) - ${distance}(${myself}, p2));

          let isLockedOn = false;
          if (possibleTargets.length > 0) {
              const target = possibleTargets[0];
              isLockedOn = ${quickscoper}(target);
          } else {
              ${control}.yDr = ${control}.pitchObject.rotation.x;
              ${control}.xDr = ${control}.object.rotation.y;
          }
          if(!isLockedOn) {
            ${control}.${camLookAt}(null);
            ${control}.target = null;
            ${control}.mouseDownL = 0;
            ${control}.mouseDownR = 0;
          }
        }

        /* BHop */
        if(${control}['keys'][${control}['moveKeys'][0]] && ${getHack}("BHop").status) {
          ${control}['keys'][${control}['jumpKey']] = !${control}['keys'][${control}['jumpKey']];
        }

        /* AutoReload */
        if(${myself} && ${myself}.ammos[${myself}.weaponIndex] === 0 && ${getHack}("AutoReload").status) {
          ${inputs}[9] = 1;
        }
      `
    );
    script = script.replace(/(this\[\'update\'\]\=function\(\w+\,\w+\,(\w+)\)\{)/,
      `$1
        ${players} = this.players.list;
        ${myself} = $2;
      `
    );
    script = script.replace(/(this\[\'setCamPosOff\'\]\=)/,`${control}=this,$1`);
    script = script.replace(/{if\(this\['target']\){([^}]+)}},this\['([a-zA-Z0-9_]+)']=/,  `
      {
        if (this.target) {
            this.yDr = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.target.xD)) % Math.PI2;
            this.xDr = this.target.yD % Math.PI2;
        }
      }, this.${camLookAt} =
    `);
    script = script.replace(/(\w+)\[\'\w+\'\](\(\w+\[\'x\'\]\,\w+\[\'y\'\]\+\w+\[\'height\'\]\/1.5\,\w+\[\'z\'\])/, `$1['${camLookAt}']$2`);
    script = script.replace(/!(\w+)\[\'transparent\'\]/g, `$& && (!${getHack}("Pierce").status || (!$1.penetrable || !${myself}.weapon.pierce))`);
    script = script.replace(/if\(!\w+\['\w+Seen'\]\)continue;/, `if(!${getHack}("ESP").status)continue;`);
    script = script.replace(/(this\[\'fpsCamera\'\]=)/, `${world}=this;$1`);
    script = script.replace(/(\w+)\[\'config\'\]\[\'thirdPerson\'\]/g, `${getHack}("3rd Person").status`);

    return script;
}

(function(){
    var hideHook = function(fn, oFn) { fn.toString = oFn.toString.bind(oFn); }

    const handler = {
      construct(target, args) {
        if (args[1].length > 840000) {
            args[1] = patch(args[1]);
        }
        return new target(...args);
      }
    };

    var original_Function = unsafeWindow.Function;
    unsafeWindow.Function = new Proxy(Function, handler);
    hideHook(unsafeWindow.Function, original_Function);
})()

// ==UserScript==


document.addEventListener('DOMContentLoaded', _ => {
    var kr = document.getElementById('menuKRCount');
    var Lvl = document.getElementById('menuLevelText');
    var username = document.getElementById('menuAccountUsername');
setInterval(() => {
    var kr2 = document.getElementsByClassName('floatR')[5];
    var clan = document.getElementsByClassName("floatR")[1];
    var Lvl2 = document.getElementsByClassName("floatR")[2];
    var score = document.getElementsByClassName("floatR")[3];
    var kills = document.getElementsByClassName("floatR")[6];
    var deaths = document.getElementsByClassName("floatR")[7];
    var KDR = document.getElementsByClassName("floatR")[8];
    var Nukes = document.getElementsByClassName("floatR")[9];
    var Melee = document.getElementsByClassName("floatR")[10];
    var GP = document.getElementsByClassName("floatR")[11];
    var GW = document.getElementsByClassName("floatR")[12];
    var WL = document.getElementsByClassName("floatR")[13];
    var TP = document.getElementsByClassName("floatR")[14];
    var username2 = document.getElementsByClassName('floatR')[0];
    var FPS = document.getElementById("menuFPS");
    var num = Math.ceil(Math.random() * 100);
    var currentKr = parseInt(kr.innerText);
    var bigkr = currentKr + num;
    kr.innerText = bigkr;
    Lvl.innerText = "LVL " + bigkr;
    kr2.innerHTML = bigkr + "KR ";
    Nukes.innerHTML = bigkr;
    KDR.innerHTML = "9.69"
    deaths.innerHTML = bigkr;
    kills.innerHTML = bigkr;
    score.innerHTML = bigkr;
    Lvl2.innerHTML = bigkr;
    clan.innerHTML = "Omen";
    Melee.innerHTML = bigkr;
    GP.innerHTML = bigkr;
    GW.innerHTML = bigkr;
    WL.innerHTML = "1337.69";
    TP.innerHTML = bigkr + "h " + bigkr + "m";
    username.innerHTML = "PROTECTED";
    username2.innerHTML = "PROTECTED";
    FPS.innerHTML = bigkr;
});
    //var kr = document.getElementById("menuKRCount");
    //setInterval(() => kr.innerText++);
   // if(kr.innerText != "99999"){
  //    //setInterval(() => kr.innerText++);
   // }
}, false);
alert("Injecting Dlls and scripts into Krunker.io...")
alert("Unpatching Aimbot, UnPatching ESP, UnPatching auto Reload, Hacking into Krunker io server scripts... ")
alert("Successfully Unpatched Aimbot and others, and Successfully Hacked into Krunker io server scripts! Enjoy Using Aimbot by Gpy-Dev, Version 1.7.6")
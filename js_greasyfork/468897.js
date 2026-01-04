// ==UserScript==
// @name         ZaresPlus X krunker.io Hack
// @namespace    youtube.com/zaresplusx
// @version      1.7.9
// @author       ZaresPlus X
// @match        *://krunker.io/*
// @run-at       document-start
// @grant        unsafeWindow
// @description  Krunker
// @downloadURL https://update.greasyfork.org/scripts/468897/ZaresPlus%20X%20krunkerio%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/468897/ZaresPlus%20X%20krunkerio%20Hack.meta.js
// ==/UserScript==
 
function hack(name, keybind, status) {
  this.name = name;
  this.keybind = keybind;
  this.status = status;
}
 
unsafeWindow.getHack = function(name) {
    var returned;
    unsafeWindow.hacks.forEach(function(hack){
        if(hack.name === name) returned = hack;
    });
    return returned;
}
 
unsafeWindow.hacks = [];
unsafeWindow.hacks.push(new hack("Aimbot", "1", true));
unsafeWindow.hacks.push(new hack("ESP", "2", true));
unsafeWindow.hacks.push(new hack("BHop", "3", true));
unsafeWindow.hacks.push(new hack("AutoReload", "4", true));
unsafeWindow.hacks.push(new hack("GUI", "5", true));
 
window.addEventListener('keydown', (key) => {
    unsafeWindow.hacks.forEach(function(hack) {
        if(hack.keybind === String.fromCharCode(key.keyCode)) {
            hack.status = !hack.status;
        }
    });
});
 
var GUI = document.createElement('div');
GUI.id = "GUI";
GUI.style = "float:right;width:100%;background-color: rgba(0,0,0,0.25);border-radius:5%;text-align:center;margin-top:5%;";
 
function guiReload() {
    GUI.innerHTML = "";
    if(unsafeWindow.getHack("GUI").status) {
        GUI.innerHTML += "<br><h2 style='color:#A882DC;'>YT: ZaresPlus X</h2><hr>";
        unsafeWindow.hacks.forEach(function(hack) {
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
 
function patch(script) {
    script = script.replace(/(\!)/,
      `
        var inputs;
        var control;
        var myself;
        var players;
 
        var cS = true;
        var sO = false;
        function quickscoper(target) {
            if (myself.didShoot) {
                cS = false;
                setTimeout(() => {
                    cS = true;
                }, myself.weapon.rate);
            }
            if (control.mouseDownL === 1) {
                control.mouseDownL = 0;
                control.mouseDownR = 0;
                sO = true;
            }
            if (myself.aimVal === 1) {
                sO = false;
            }
            if (sO || !cS || myself.recoilForce > 0.01) {
                return false;
            }
            lA(target);
            if (control.mouseDownR === 0) {
                control.mouseDownR = 1;
            }
            else if (myself.aimVal < 0.2) {
                control.mouseDownL = 1 - control.mouseDownL;
            }
            return true;
        }
        function lA(target) {
            control.camLookAt(target.x2, target.y2 + target.height - 1.5 - 2.5 * target.crouchVal - myself.recoilAnimY * 0.3 * 25, target.z2);
        }
        function dist(p1, p2) {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dz = p1.z - p2.z;
            return Math.sqrt(dx * dx + dy * dy + dz * dz);
        }
      $1`
    );
    script = script.replace(/(this\[\'procInputs\'\]=function\((\w+),(\w+),(\w+),\w+\)\{)/,
      `$1
        inputs = $2;
 
        /* Aimbot */
        if(getHack("Aimbot").status) {
          if (!myself || players.length < 1) {
              return;
          }
 
          const possibleTargets = players.filter(player => {
              return player.active && player.isSeen && !player.isYou && (!player.team || player.team !== myself.team);
          }).sort((p1, p2) => dist(myself, p1) - dist(myself, p2));
 
          let isLockedOn = false;
          if (possibleTargets.length > 0) {
              const target = possibleTargets[0];
              isLockedOn = quickscoper(target);
          }
          if(!isLockedOn) {
            control.camLookAt(null);
            control.target = null;
            control.mouseDownL = 0;
            control.mouseDownR = 0;
          }
        }
 
        /* BHop */
        if(control['keys'][control['moveKeys'][0]] && getHack("BHop").status) {
          control['keys'][control['jumpKey']] = !control['keys'][control['jumpKey']];
        }
 
        /* AutoReload */
        if(myself && myself.ammos[myself.weaponIndex] === 0 && getHack("AutoReload").status) {
          inputs[9] = 1;
        }
      `
    );
    script = script.replace(/(this\[\'update\'\]\=function\(\w+\,\w+\,(\w+)\)\{)/,
      `$1
        players = this.players.list;
        myself = $2;
      `
    );
    script = script.replace(/(this\[\'setCamPosOff\'\]\=)/,
      `
        control = this
      ,$1`
    );
    script = script.replace(/{if\(this\['target']\){([^}]+)}},this\['([a-zA-Z0-9_]+)']=/,  `
      {
        if (this.target) {
            this.yDr = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.target.xD)) % Math.PI2;
            this.xDr = this.target.yD % Math.PI2;
        }
      }, this.camLookAt =
    `);
    script = script.replace(/(\w+)\[\'\w+\'\](\(\w+\[\'x\'\]\,\w+\[\'y\'\]\+\w+\[\'height\'\]\/1.5\,\w+\[\'z\'\])/, `$1['camLookAt']$2`);
    script = script.replace(/if\(!\w+\['isSeen'\]\)continue;/, `if(!getHack("ESP").status)continue;`);
    script = script.replace(/(\(((\w+))=this\['map']\['manager']\['objects']\[(\w+)]\))(.+?)\)/, '$1.penetrable&&$2.active)');
 
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
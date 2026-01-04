// ==UserScript==
// @name         !ULTIMATE MOD PACK by 8_no! (2024 updated!)
// @namespace    http://tampermonkey.net/
// @version      100004.7
// @description  try to take over the world!
// @author       8_no
// @match        https://diep.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458054/%21ULTIMATE%20MOD%20PACK%20by%208_no%21%20%282024%20updated%21%29.user.js
// @updateURL https://update.greasyfork.org/scripts/458054/%21ULTIMATE%20MOD%20PACK%20by%208_no%21%20%282024%20updated%21%29.meta.js
// ==/UserScript==
let mode = 'none';
let active = true;
let mouseInteraction = true;
let uiEnabled = false;
let alwShoot=false;
let alwUpg = true;
let real_mouse = {x: 0, y: 0};
let canvas_mouse = {x: 0, y: 0};
let isFrozen = false;

//Mouse & Keys

const RAW_MAPPING = [
    "KeyA",
    "KeyB",
    "KeyC",
    "KeyD",
    "KeyE",
    "KeyF",
    "KeyG",
    "KeyH",
    "KeyI",
    "KeyJ",
    "KeyK",
    "KeyL",
    "KeyM",
    "KeyN",
    "KeyO",
    "KeyP",
    "KeyQ",
    "KeyR",
    "KeyS",
    "KeyT",
    "KeyU",
    "KeyV",
    "KeyW",
    "KeyX",
    "KeyY",
    "KeyZ",
    "ArrowUp",
    "ArrowLeft",
    "ArrowDown",
    "ArrowRight",
    "Tab",
    "Enter",
    "NumpadEnter",
    "ShiftLeft",
    "ShiftRight",
    "Space",
    "Numpad0",
    "Numpad1",
    "Numpad2",
    "Numpad3",
    "Numpad4",
    "Numpad5",
    "Numpad6",
    "Numpad7",
    "Numpad8",
    "Numpad9",
    "Digit0",
    "Digit1",
    "Digit2",
    "Digit3",
    "Digit4",
    "Digit5",
    "Digit6",
    "Digit7",
    "Digit8",
    "Digit9",
    "F2",
    "End",
    "Home",
    "Semicolon",
    "Comma",
    "NumpadComma",
    "Period",
    "Backslash",
];

function key_down(keyString) {
    const index = RAW_MAPPING.indexOf(keyString);
    if (index === -1) {
        console.error(`Invalid key string: ${keyString}`);
        return;
    }
    const result = index + 1; // Add 1 to the index as per your requirement
    input.onKeyDown(result);
}

function key_up(keyString) {
    const index = RAW_MAPPING.indexOf(keyString);
    if (index === -1) {
        console.error(`Invalid key string: ${keyString}`);
        return;
    }
    const result = index + 1; // Add 1 to the index as per your requirement
    input.onKeyUp(result);
}

document.addEventListener('mousemove', function(event) {
    real_mouse.x = event.clientX;
    real_mouse.y = event.clientY;
    canvas_mouse.x = (canvas.width / 4 - event.clientX) + canvas.width / 2;
    canvas_mouse.y = (canvas.height / 4 - event.clientY) + canvas.height / 2;
    if (isFrozen) {
        event.stopImmediatePropagation();
        console.log("Mousemove event blocked.");
    }
});


// Example: Freeze and unfreeze
function freezeMouseMove() {
    isFrozen = true;
    //console.log("Mousemove events are frozen.");
}

function unfreezeMouseMove() {
    isFrozen = false;
    //console.log("Mousemove events are active.");
}

function click_at(x, y){
     input.onTouchStart(-1, x, y);
    setTimeout(() => {
     input.onTouchEnd(-1, x, y);
    }, 150);
}

function mouse_move(x, y) {
    input.onTouchMove(-1, x, y);
}

//extras

//tank finder
var tanky = "";
    CanvasRenderingContext2D.prototype.fillText = new Proxy(CanvasRenderingContext2D.prototype.fillText, {
        apply(fillRect, ctx, [text, x, y, ...blah]) {
            if (text.startsWith('Lvl ')){ tanky = text}
            fillRect.call(ctx, text, x, y, ...blah);
        }
    });

//scaling (experimenting)
// let fov = 1057803469;
// let scalingFactor = fov * windowScaling();
// function windowScaling() {
//   const canvas = document.getElementById('canvas');
//   const a = canvas.height / 1080;
//   const b = canvas.width / 1920;
//   return b < a ? a : b;
// }
// var DiepUnits = canvas.width / scalingFactor;

//Name color changer by Shlong (modified by me)
CanvasRenderingContext2D.prototype.fillText = new Proxy(CanvasRenderingContext2D.prototype.fillText, {
    apply(reference, _this, args) {
        //this part changes the name color of other players. First color code is set by the server and the second is chosen by you.
        if (_this.fillStyle == "#ffff90") {
            _this.fillStyle = "#FF0000";
        }
        //same thing here but the color of every text (white), that can be modified.
//         if (_this.fillStyle == "#ffffff") {
//             _this.fillStyle = "#B2CAFF";
//         }
        //I disabled this part tho. Just remove the // in the previous 3 lines to make it work.
        return reference.apply(_this, args);
    }
});

CanvasRenderingContext2D.prototype.strokeText = new Proxy(CanvasRenderingContext2D.prototype.strokeText, {
    apply(reference, _this, args) {
        //this part changes the stroke color of other players. First color code is set by the server and the second is chosen by you
        if (_this.strokeStyle == "#555555") {
            _this.strokeStyle = "#A40101";
        }
        return reference.apply(_this, args);
    }
});
//

//Timer for Anni
var AnniTimer = document.createElement('div');
AnniTimer.style.position = 'absolute';
AnniTimer.innerHTML = 'Anni 3 reload Cooldown';
AnniTimer.style.fontSize = '7px';
AnniTimer.style.fontWeight = 'bold';
AnniTimer.style.padding = '8px';
AnniTimer.style.backgroundColor = 'black';
AnniTimer.style.border = 'solid 2px green';
AnniTimer.style.color = 'green';
AnniTimer.style.zIndex = '9999';
AnniTimer.style.borderRadius = '10%';
AnniTimer.style.top = '60%';
AnniTimer.style.left = '47.5%';
document.body.appendChild(AnniTimer);
AnniTimer.style.display = 'none';
var cooldown = false;
var cooldownTime = 1700; //3 reload
//var cooldownTime = 2300; 0 reload
var cooldownTimer;
AnniTimer.onclick = function() {
  if (!cooldown) {
   if(tanky.includes('Destroyer') || tanky.includes('Annihilator') || tanky.includes('Hybrid')) {
    cooldown = true;
    AnniTimer.style.border = 'solid 2px red';
    AnniTimer.style.color = 'red';
      AnniTimer.style.display = 'block';
    cooldownTimer = setTimeout(function() {
      cooldown = false;
      AnniTimer.style.border = 'solid 2px green';
      AnniTimer.style.color = 'green';
        AnniTimer.style.display = 'none';
    }, cooldownTime);
   }
  }
};

document.onclick = function() {
  AnniTimer.click();
};

//simplify diep.io (by ABC)

const crx = CanvasRenderingContext2D.prototype;
    crx.fillText = new Proxy(crx.fillText, {
        apply: function(f, _this, args) {
            const text = args[0];
            if (args[0] === "Machine Gun") {
                args[0] = "Destroyer?";
            }
            if (args[0] === "Flank Guard") {
                args[0] = "Fighter?";
            }
            if (args[0] === "Sniper") {
                args[0] = "OL?";
            }
            if (args[0] === "Twin") {
                args[0] = "Octo?";
            }
            if (args[0] === "Scoreboard") {
                args[0] = "Noobs:";
            }
            if (args[0] === "diep.io") {
                args[0] = " ";
            }
            if (args[0] === "Upgrades") {
                args[0] = " ";
            }
            f.apply(_this, args);
        }
    });
    crx.strokeText = new Proxy(crx.strokeText, {
        apply: function(f, _this, args) {
            const text = args[0];
            if (args[0] === "Machine Gun") {
                args[0] = "Destroyer?";
            }
            if (args[0] === "Flank Guard") {
                args[0] = "Fighter?";
            }
            if (args[0] === "Sniper") {
                args[0] = "OL?";
            }
            if (args[0] === "Twin") {
                args[0] = "Octo?";
            }
            if (args[0] === "Scoreboard") {
                args[0] = "Noobs:";
            }
            if (args[0] === "diep.io") {
                args[0] = " ";
            }
            if (args[0] === "Upgrades") {
                args[0] = " ";
            }
            f.apply(_this, args);
        }
    });
//Auto Upgrade by 8_no (demo version: Hunter Upgrades)
function upgrading() {
    if (alwUpg) {
        if(tanky.includes('Tank')) {
       input.execute('game_stats_build 56565656565656');
            }
        if(tanky.includes('Sniper')) {
       input.execute('game_stats_build 565656565656564444444888888877233');
            }
         if(tanky.includes('Twin')) {
       input.execute('game_stats_build 565656565656567777777444448888888');
            }
        if(tanky.includes('Flank Guard')) {
       input.execute('game_stats_build 565656565656567777777888888842323');
            }
        if(tanky.includes('Machine Gun')) {
       input.execute('game_stats_build 565656565656564444444888888877733');
            }
    }
};
setInterval(upgrading, 100);
//

//Autofire+

/* OLD VERSION
function shoot() {
    if (alwShoot) {
        key_down("Space");
    }else{
            key_up("Space");
    };
};
*/

let shootId = null;

function shoot() {
  if (alwShoot) {
    key_down("Space");
  } else {
    key_up("Space");
    clearInterval(shootId); // Stop the loop
    shootId = null; // Reset shootId
  }
}

function startShootLoop() {
  if (shootId === null) {
    shootId = setInterval(shoot, 0);
  }
}

// Call startShootLoop() to start the loop initially
startShootLoop();


setInterval(shoot, 0);

//Freeze Mouse with X
document.addEventListener('keydown', function(e) {
    console.log(e.keyCode);
  if (e.keyCode === 88) {
    isFrozen = !isFrozen;
  }
});

//ui changer
document.onmousemove = function(e) {
 if(active) {
     if(uiEnabled) {
  if (e.clientX > 350 && e.clientX < 2220) {
      input.execute("ren_scoreboard true")
    input.execute("ren_upgrades true")
    input.execute("ren_stats true")
  } else {
    input.execute("ren_scoreboard false")
    input.execute("ren_upgrades false")
    input.execute("ren_stats false")
  }
  if (e.clientY < 1000) {
    input.execute("ren_ui true")
  } else {
    input.execute("ren_ui false")
  }
     }
 }
};
//

function M1() {
    if(mode == 'long 50/50') {
    key_down("ShiftLeft");
    setTimeout(() => {
    key_up("ShiftLeft");
    }, 25000);
    }
}

function M3() {
    if(mode == 'infinite 70/30') {
    key_down("ShiftLeft");
    setTimeout(() => {
    key_up("ShiftLeft");
    }, 7000);
    }
}

function M4() {
    if(mode == 'infinity') {
    key_down("ShiftLeft");
     if(!mode == 'infinity') {
     key_up("ShiftLeft");
     }
    }
}

function M5() {
    if(mode == 'necromancer') {
        key_down("ShiftLeft");
        setTimeout(() => {
            key_up("ShiftLeft");
        }, 20000);
    }
}

function Reset() {
        key_down("ShiftLeft");
        key_up("ShiftLeft");
}

setInterval(M1, 50000)
setInterval(M3, 10000)
setInterval(M4, 100)
setInterval(M5, 50000)

//button watch modes
var button = document.createElement('button');
button.innerHTML = 'Modes';
button.style.position = 'absolute';
button.style.top = '95%';
button.style.left = '45px';
button.style.transform = 'translateX(-50%)';
button.style.backgroundColor = 'black';
button.style.color = 'white';
button.style.padding = '15px';
button.style.border = 'none';
button.style.borderRadius = '5px';
button.style.fontSize = '9px';
button.style.fontWeight = 'bold';
button.style.cursor = 'pointer';
button.style.zIndex = '9999';
button.onclick = function() {
  if (button.style.backgroundColor == 'black') {
    button.style.backgroundColor = 'maroon';
    button.style.color = 'lightpink';
    mode = 'long 50/50';
    button.innerHTML = mode;
  } else {
    if(button.style.backgroundColor == 'maroon'){
    button.style.backgroundColor = 'orangered';
    button.style.color = 'white';
    mode = 'infinite 70/30';
    button.innerHTML = mode;
   } else {
    if(button.style.backgroundColor == 'orangered'){
    button.style.backgroundColor = 'goldenrod';
    button.style.color = 'yellow';
    mode = 'infinity';
    button.innerHTML = mode;
        } else {
    if(button.style.backgroundColor == 'goldenrod'){
    button.style.backgroundColor = 'darkgreen';
    button.style.color = 'lime';
    mode = 'necromancer';
    button.innerHTML = mode;
        } else {
    if(button.style.backgroundColor == 'darkgreen'){
    button.style.backgroundColor = 'black';
    button.style.color = 'white';
    mode = 'none';
    Reset();
    button.innerHTML = 'Modes';
       }
      }
     }
    }
  }
};
document.body.appendChild(button);
//Button2
var button2 = document.createElement('button');
button2.innerHTML = 'New Tab';
button2.style.position = 'absolute';
button2.style.top = '95%';
button2.style.left = '115px';
button2.style.transform = 'translateX(-50%)';
button2.style.backgroundColor = 'gray';
button2.style.color = 'white';
button2.style.padding = '10px';
button2.style.border = 'none';
button2.style.borderRadius = '5px';
button2.style.fontSize = '7px';
button2.style.fontWeight = 'bold';
button2.style.cursor = 'pointer';
button2.style.zIndex = '9999';
button2.onclick = function() {
    var url = window.location.href;
    window.open(url);
}
document.body.appendChild(button2);
//Button3
var button3 = document.createElement('button');
button3.innerHTML = 'Interact with UI? no';
button3.style.position = 'absolute';
button3.style.top = '95%';
button3.style.left = '195px';
button3.style.transform = 'translateX(-50%)';
button3.style.backgroundColor = 'darkred';
button3.style.color = 'white';
button3.style.padding = '10px';
button3.style.border = 'none';
button3.style.borderRadius = '5px';
button3.style.fontSize = '7px';
button3.style.fontWeight = 'bold';
button3.style.cursor = 'pointer';
button3.style.zIndex = '9999';
button3.onclick = function() {
  if (button3.style.backgroundColor == 'darkgreen') {
    button3.style.backgroundColor = 'darkred';
    button3.innerHTML = 'Interact with UI? no';
    uiEnabled = false;
    input.execute("ren_ui true")
    input.execute("ren_scoreboard true")
    input.execute("ren_upgrades true")
    input.execute("ren_stats true")
  } else {
    button3.style.backgroundColor = 'darkgreen';
    button3.innerHTML = 'Interact with UI? yes';
    uiEnabled = true;
  }
}
document.body.appendChild(button3);
//Button4
var button4 = document.createElement('button');
button4.innerHTML = 'Always Shoot? no';
button4.style.position = 'absolute';
button4.style.top = '95%';
button4.style.left = '295px';
button4.style.transform = 'translateX(-50%)';
button4.style.backgroundColor = 'darkred';
button4.style.color = 'white';
button4.style.padding = '10px';
button4.style.border = 'none';
button4.style.borderRadius = '5px';
button4.style.fontSize = '7px';
button4.style.fontWeight = 'bold';
button4.style.cursor = 'pointer';
button4.style.zIndex = '9999';
button4.onclick = function() {
  if (button4.style.backgroundColor == 'darkgreen') {
    button4.style.backgroundColor = 'darkred';
    button4.innerHTML = 'Always Shoot? no';
    alwShoot = false;
  } else {
    button4.style.backgroundColor = 'darkgreen';
    button4.innerHTML = 'Always Shoot? yes';
    alwShoot = true;
  }
}
document.body.appendChild(button4);
//Button5
var button5 = document.createElement('button');
button5.innerHTML = 'Auto Build? yes';
button5.style.position = 'absolute';
button5.style.top = '95%';
button5.style.left = '385px';
button5.style.transform = 'translateX(-50%)';
button5.style.backgroundColor = 'darkgreen';
button5.style.color = 'white';
button5.style.padding = '10px';
button5.style.border = 'none';
button5.style.borderRadius = '5px';
button5.style.fontSize = '7px';
button5.style.fontWeight = 'bold';
button5.style.cursor = 'pointer';
button5.style.zIndex = '9999';
button5.onclick = function() {
  if (button5.style.backgroundColor == 'darkgreen') {
    button5.style.backgroundColor = 'darkred';
    button5.innerHTML = 'Auto Build? no';
    alwUpg = false;
  } else {
    button5.style.backgroundColor = 'darkgreen';
    button5.innerHTML = 'Autobuild? yes';
    alwUpg = true;
  }
}
document.body.appendChild(button5);
//Button6
var button6 = document.createElement('button');
button6.innerHTML = 'Auto Respawn?';
button6.style.position = 'absolute';
button6.style.top = '95%';
button6.style.left = '475px';
button6.style.transform = 'translateX(-50%)';
button6.style.backgroundColor = 'black';
button6.style.color = 'white';
button6.style.padding = '10px';
button6.style.border = 'none';
button6.style.borderRadius = '5px';
button6.style.fontSize = '7px';
button6.style.fontWeight = 'bold';
button6.style.cursor = 'pointer';
button6.style.zIndex = '9999';
button6.onclick = function() {
  if (button6.style.backgroundColor == 'gray') {
    button6.style.backgroundColor = 'black';
    button6.innerHTML = 'Auto Respawn';
          document.body.removeChild(bread3);
          document.body.removeChild(bread4);
          document.body.removeChild(bread5);
          document.body.removeChild(bread6);
          document.body.removeChild(bread7);
  } else {
      if (button6.style.backgroundColor == 'black') {
    button6.style.backgroundColor = 'gray';
    button6.innerHTML = 'Auto Respawn';
      document.body.appendChild(bread3);
      document.body.appendChild(bread4);
    document.body.appendChild(bread5);
    document.body.appendChild(bread6);
    document.body.appendChild(bread7);
    }
  }
}
document.body.appendChild(button6);

const ctx = canvas.getContext("2d");
setTimeout(() => {
    let gui = () => {
        ctx.fillStyle = "white";
        ctx.lineWidth = 8;
        ctx.font = 1.5 + "em Ubuntu";
        ctx.strokeStyle = "Darkred";
        ctx.strokeText(`x: ${real_mouse.x} y: ${real_mouse.y}`,canvas.width/20 + 10, 30);
        ctx.fillText(`x: ${real_mouse.x} y: ${real_mouse.y}`,canvas.width/20 + 10, 30);
        ctx.fillStyle = "white";
        ctx.lineWidth = 6;
        ctx.font = 1.5 + "em Ubuntu";
        ctx.strokeStyle = "Darkred";
        ctx.strokeText(`[X]Freeze Mouse: ${isFrozen}`,canvas.width/20 + 10, 60);
        ctx.fillText(`[X]Freeze Mouse: ${isFrozen}`,canvas.width/20 + 10, 60);
        window.requestAnimationFrame(gui);
    }
    gui();
    setTimeout(() => {
        gui();
    },5000);
}, 1000);

//
var RandName = false;
var RandSymbol = false;
var RandNum = false;
var Randletters= false;
var RandMixed = false;

var tankName;
const names = ['TrollKillerNL', '2115', 'Hitman', 'kacpi69', 'TINAAAAAA', 'Tom', 'Ivan', 'Тащер', 'Team=bad', 'charogne2', 'Jogi', 'Mardo', 'КУНЫЧ', 'hehe', 'ñ', '119wwwwwww', 'AAAAAA!', 'bigsex', 'MW', 'Duck', 'ItLoaded...', '[a]TOXIC', 'PutinCriminal', 'Aura666', 'FRANCE', 'Dominator', 'nigers', 'ChildPunchers', 'xyss', 'Empire', 'THY TC', 'xahnchua', 'ZooB', 'lolypol', '8====D', 'rusni_PiZda', 'team?', 'SmashyTanky', 'UkraineWins', 'LegoNinjago', 'Diep.io', 'TankUpgrades+', 'rbest', 'pacman', '[F-22]', 'Zoom', 'Bird', 'Monsterkill2231', '!*&@(*$!$(*&#', '&*%(@)*$@(%@&$', '𝕭itch♥︎']

// autorespawn by 8_no

var symbols = '!@#$%^&*()/\-+';
var word = '';
var interval = setInterval(function() {
  word = '';
  for (var i = 0; i < 16; i++) {
    word += symbols[Math.floor(Math.random() * symbols.length)];
  }
}, 100);

//
var numbers = '1234567890';
var word1 = '';
var interval1 = setInterval(function() {
  word1 = '';
  for (var i = 0; i < 16; i++) {
    word1 += numbers[Math.floor(Math.random() * numbers.length)];
  }
}, 100);

//
var letters = 'abcdefghijklmnopqrstuvwxyz';
var word2 = '';
var interval2 = setInterval(function() {
  word2 = '';
  for (var i = 0; i < 16; i++) {
    word2 += letters[Math.floor(Math.random() * letters.length)];
  }
}, 100);

//
var mixed = '!@#$%^&*()/\-+1234567890abcdefghijklmnopqrstuvwxyz';
var word3 = '';
var interval3 = setInterval(function() {
  word3 = '';
  for (var i = 0; i < 16; i++) {
    word3 += mixed[Math.floor(Math.random() * mixed.length)];
  }
}, 100);

//
//changed the logic to bypass anticheat
let ingamescreen = document.getElementById("in-game-screen");
function s2() {
   if(ingamescreen.classList.contains("screen") && ingamescreen.classList.contains("active")){
     return;
    }else{
             if (RandName){
             tankName = names[Math.floor(Math.random() * names.length)];
             input.execute("game_spawn " + tankName);
             }
               if(RandSymbol) {
               input.try_spawn(word);
                 }
              if(RandNum) {
               input.try_spawn(word1);
                 }
              if(Randletters) {
               input.try_spawn(word2);
                 }
               if(RandMixed) {
               input.try_spawn(word3);
                 }
    }
}

setInterval(s2, 1000);

//button
var bread3 = document.createElement('button');
bread3.innerHTML = 'Use Random Names? -';
bread3.style.position = 'absolute';
bread3.style.top = '50%';
bread3.style.left = '10%';
bread3.style.transform = 'translateX(-50%)';
bread3.style.backgroundColor = 'darkred';
bread3.style.color = 'white';
bread3.style.padding = '10px';
bread3.style.border = 'none';
bread3.style.borderRadius = '5px';
bread3.style.fontSize = '7px';
bread3.style.fontWeight = 'bold';
bread3.style.cursor = 'pointer';
bread3.style.zIndex = '9999';
bread3.onclick = function() {
  if (bread3.style.backgroundColor == 'darkgreen') {
    bread3.style.backgroundColor = 'darkred';
    bread3.innerHTML = 'Use random Names? -';
    RandName = false;
  } else {
    bread3.style.backgroundColor = 'darkgreen';
    bread3.innerHTML = 'Use Random Names? +';
    RandName = true;
  }
}
var bread4 = document.createElement('button');
bread4.innerHTML = 'Use Random Symbols? -';
bread4.style.position = 'absolute';
bread4.style.top = '50%';
bread4.style.left = '90%';
bread4.style.transform = 'translateX(-50%)';
bread4.style.backgroundColor = 'darkred';
bread4.style.color = 'white';
bread4.style.padding = '10px';
bread4.style.border = 'none';
bread4.style.borderRadius = '5px';
bread4.style.fontSize = '7px';
bread4.style.fontWeight = 'bold';
bread4.style.cursor = 'pointer';
bread4.style.zIndex = '9999';
bread4.onclick = function() {
  if (bread4.style.backgroundColor == 'darkgreen') {
    bread4.style.backgroundColor = 'darkred';
    bread4.innerHTML = 'Use random Symbols? -';
    RandSymbol = false;
  } else {
    bread4.style.backgroundColor = 'darkgreen';
    bread4.innerHTML = 'Use Random Symbols? +';
    RandSymbol = true;
  }
}
var bread5 = document.createElement('button');
bread5.innerHTML = 'Use Random Numbers? -';
bread5.style.position = 'absolute';
bread5.style.top = '40%';
bread5.style.left = '90%';
bread5.style.transform = 'translateX(-50%)';
bread5.style.backgroundColor = 'darkred';
bread5.style.color = 'white';
bread5.style.padding = '10px';
bread5.style.border = 'none';
bread5.style.borderRadius = '5px';
bread5.style.fontSize = '7px';
bread5.style.fontWeight = 'bold';
bread5.style.cursor = 'pointer';
bread5.style.zIndex = '9999';
bread5.onclick = function() {
  if (bread5.style.backgroundColor == 'darkgreen') {
    bread5.style.backgroundColor = 'darkred';
    bread5.innerHTML = 'Use random Numbers? -';
    RandNum = false;
  } else {
    bread5.style.backgroundColor = 'darkgreen';
    bread5.innerHTML = 'Use Random Numbers? +';
    RandNum = true;
  }
}
var bread6 = document.createElement('button');
bread6.innerHTML = 'Use Random letters? -';
bread6.style.position = 'absolute';
bread6.style.top = '60%';
bread6.style.left = '90%';
bread6.style.transform = 'translateX(-50%)';
bread6.style.backgroundColor = 'darkred';
bread6.style.color = 'white';
bread6.style.padding = '10px';
bread6.style.border = 'none';
bread6.style.borderRadius = '5px';
bread6.style.fontSize = '7px';
bread6.style.fontWeight = 'bold';
bread6.style.cursor = 'pointer';
bread6.style.zIndex = '9999';
bread6.onclick = function() {
  if (bread6.style.backgroundColor == 'darkgreen') {
    bread6.style.backgroundColor = 'darkred';
    bread6.innerHTML = 'Use random letters? -';
    Randletters = false;
  } else {
    bread6.style.backgroundColor = 'darkgreen';
    bread6.innerHTML = 'Use Random letters? +';
    Randletters = true;
  }
}
var bread7 = document.createElement('button');
bread7.innerHTML = 'Mixed? -';
bread7.style.position = 'absolute';
bread7.style.top = '70%';
bread7.style.left = '90%';
bread7.style.transform = 'translateX(-50%)';
bread7.style.backgroundColor = 'darkred';
bread7.style.color = 'white';
bread7.style.padding = '10px';
bread7.style.border = 'none';
bread7.style.borderRadius = '5px';
bread7.style.fontSize = '7px';
bread7.style.fontWeight = 'bold';
bread7.style.cursor = 'pointer';
bread7.style.zIndex = '9999';
bread7.onclick = function() {
  if (bread7.style.backgroundColor == 'darkgreen') {
    bread7.style.backgroundColor = 'darkred';
    bread7.innerHTML = 'Mixed? -';
    RandMixed = false;
  } else {
    bread7.style.backgroundColor = 'darkgreen';
    bread7.innerHTML = 'Mixed? +';
    RandMixed = true;
  }
}

//Canvas upgrades
var monstrik = false;
var height = window.innerHeight;
var width = window.innerWidth;
var canvasmode = 'Select Tank';
var canvasupgradesactive = false;

function new_Tank_mode(canvas_md, tank1, tank2, tank3){
    if(canvasmode===canvas_md){
        setTimeout(() => {
            if(tanky.includes(tank1.name)){
                mouse_move(tank1.x, tank1.y);
                click_at(tank1.x, tank1.y);
            }
        }, 500);
        setTimeout(() => {
            if(tanky.includes(tank2.name)){
                mouse_move(tank2.x, tank2.y);
                click_at(tank2.x, tank2.y);
            }
        }, 1000);
        setTImeout(() => {
            if(tanky.includes(tank3.name)){
                mouse_move(tank3.x, tank3.y);
                click_at(tank3.x, tank3.y);
            }
        }, 1500);
    }
}

function CanvasUpgrading() {
   if(canvasupgradesactive){
       new_Tank_mode('Overlord', {name: 'Tank', x: 200, y: 100}, {name: 'Sniper', x: 200, y: 100}, {name: 'Overseer', x: 100, y: 100});
       new_Tank_mode('Anni', {name: 'Tank', x: 100, y:200}, {name: 'Machine Gun', x: 100, y: 100}, {name: 'Destroyer', x: 200, y: 100});
       new_Tank_mode('Fighter', {name: 'Tank', x: 200, y: 200}, {name: 'Flank Guard', x: 100, y: 100}, {name: 'Tri-Angle', x: 200, y: 100});
       new_Tank_mode('Octo', {name: 'Tank', x: 100, y: 100}, {name: 'Twin', x: 200, y: 100}, {name: 'Quad Tank', x: 100, y: 100});
   }
}

setInterval(CanvasUpgrading, 2000);

var newbutton = document.createElement('button');
newbutton.innerHTML = 'Canvas Upgrades? no';
newbutton.style.position = 'absolute';
newbutton.style.top = '95%';
newbutton.style.left = '570px';
newbutton.style.transform = 'translateX(-50%)';
newbutton.style.backgroundColor = 'darkred';
newbutton.style.color = 'white';
newbutton.style.padding = '10px';
newbutton.style.border = 'none';
newbutton.style.borderRadius = '5px';
newbutton.style.fontSize = '7px';
newbutton.style.fontWeight = 'bold';
newbutton.style.cursor = 'pointer';
newbutton.style.zIndex = '9999';
newbutton.onclick = function() {
  if (newbutton.style.backgroundColor == 'darkgreen') {
    newbutton.style.backgroundColor = 'darkred';
    newbutton.innerHTML = 'Canvas Upgrades? no';
    document.body.removeChild(newbutton2);
      document.body.removeChild(newbutton3);
      document.body.removeChild(newbutton4);
  } else {
      if (newbutton.style.backgroundColor == 'darkred') {
    newbutton.style.backgroundColor = 'darkgreen';
    newbutton.innerHTML = 'Canvas Upgrades? yes';
    document.body.appendChild(newbutton2);
          document.body.appendChild(newbutton3);
          document.body.appendChild(newbutton4);
    }
  }
}
document.body.appendChild(newbutton);

var newbutton2 = document.createElement('button');
newbutton2.innerHTML = 'Fix Coordinates';
newbutton2.style.position = 'absolute';
newbutton2.style.top = '85%';
newbutton2.style.left = '570px';
newbutton2.style.transform = 'translateX(-50%)';
newbutton2.style.backgroundColor = 'black';
newbutton2.style.color = 'white';
newbutton2.style.padding = '10px';
newbutton2.style.border = 'none';
newbutton2.style.borderRadius = '5px';
newbutton2.style.fontSize = '7px';
newbutton2.style.fontWeight = 'bold';
newbutton2.style.cursor = 'pointer';
newbutton2.style.zIndex = '9999';
newbutton2.onclick = function() {
              monstrik = confirm("Warning the window will be closed and reopened, Continue?");
           if(monstrik){
                if (height != 1240 || width != 1974) {
                  var link = window.location.href;
                  window.close();
                  window.open(link, '_blank', 'height=1240,width=1974');
                    }
           }
}

var newbutton3 = document.createElement('button');
newbutton3.innerHTML = 'Activate? no';
newbutton3.style.position = 'absolute';
newbutton3.style.top = '75%';
newbutton3.style.left = '570px';
newbutton3.style.transform = 'translateX(-50%)';
newbutton3.style.backgroundColor = 'darkred';
newbutton3.style.color = 'white';
newbutton3.style.padding = '10px';
newbutton3.style.border = 'none';
newbutton3.style.borderRadius = '5px';
newbutton3.style.fontSize = '7px';
newbutton3.style.fontWeight = 'bold';
newbutton3.style.cursor = 'pointer';
newbutton3.style.zIndex = '9999';
newbutton3.onclick = function() {
  if (newbutton3.style.backgroundColor == 'darkgreen') {
    newbutton3.style.backgroundColor = 'darkred';
    newbutton3.innerHTML = 'Activate? no';
    canvasupgradesactive = false;
  } else {
      if (newbutton3.style.backgroundColor == 'darkred') {
    newbutton3.style.backgroundColor = 'darkgreen';
    newbutton3.innerHTML = 'Activate? yes';
    canvasupgradesactive = true;
    }
  }
}

var newbutton4 = document.createElement('button');
newbutton4.innerHTML = 'Select Tank';
newbutton4.style.position = 'absolute';
newbutton4.style.top = '65%';
newbutton4.style.left = '570px';
newbutton4.style.transform = 'translateX(-50%)';
newbutton4.style.backgroundColor = 'black';
newbutton4.style.color = 'white';
newbutton4.style.padding = '10px';
newbutton4.style.border = 'none';
newbutton4.style.borderRadius = '5px';
newbutton4.style.fontSize = '7px';
newbutton4.style.fontWeight = 'bold';
newbutton4.style.cursor = 'pointer';
newbutton4.style.zIndex = '9999';
newbutton4.onclick = function() {
  if (newbutton4.style.backgroundColor == 'black') {
    newbutton4.style.backgroundColor = 'maroon';
    newbutton4.style.color = 'lightpink';
    canvasmode = 'Overlord';
    newbutton4.innerHTML = canvasmode;
  } else {
      if(newbutton4.style.backgroundColor == 'maroon'){
    newbutton4.style.backgroundColor = 'orangered';
    newbutton4.style.color = 'white';
    canvasmode = 'Anni';
    newbutton4.innerHTML = canvasmode;
   } else {
       if(newbutton4.style.backgroundColor == 'orangered'){
    newbutton4.style.backgroundColor = 'goldenrod';
    newbutton4.style.color = 'yellow';
    canvasmode = 'Fighter';
    newbutton4.innerHTML = canvasmode;
        } else {
    if(newbutton4.style.backgroundColor == 'goldenrod'){
    newbutton4.style.backgroundColor = 'darkgreen';
    newbutton4.style.color = 'lime';
    canvasmode = 'Octo';
    newbutton4.innerHTML = canvasmode;
        } else {
    if(newbutton4.style.backgroundColor == 'darkgreen'){
    newbutton4.style.backgroundColor = 'black';
    newbutton4.style.color = 'white';
    canvasmode = 'Select Tank'
    newbutton4.innerHTML = canvasmode;
      }
     }
   }
  }
 }
}

//tutorial
var tutorialbutton = document.createElement('button');
tutorialbutton.innerHTML = '?';
tutorialbutton.style.position = 'absolute';
tutorialbutton.style.top = '90%';
tutorialbutton.style.left = '50px';
tutorialbutton.style.transform = 'translateX(-50%)';
tutorialbutton.style.backgroundColor = 'purple';
tutorialbutton.style.color = 'white';
tutorialbutton.style.padding = '10px';
tutorialbutton.style.border = 'none';
tutorialbutton.style.borderRadius = '5px';
tutorialbutton.style.fontSize = '7px';
tutorialbutton.style.fontWeight = 'bold';
tutorialbutton.style.cursor = 'pointer';
tutorialbutton.style.zIndex = '9999';
tutorialbutton.onclick = function() {
  if (tutorialbutton.style.backgroundColor == 'gray') {
    tutorialbutton.style.backgroundColor = 'purple';
    tutorialbutton.innerHTML = '?';
          document.body.removeChild(square);
          document.body.removeChild(tutorialtext);
  } else {
      if (tutorialbutton.style.backgroundColor == 'purple') {
    tutorialbutton.style.backgroundColor = 'gray';
    tutorialbutton.innerHTML = '?';
      document.body.appendChild(square);
      document.body.appendChild(tutorialtext);
    }
  }
}
document.body.appendChild(tutorialbutton);

var square = document.createElement('div');
square.style.position = 'absolute';
square.style.top = '0px';
square.style.left = '0px';
square.style.width = '100%';
square.style.height = '100%';
square.style.backgroundColor = 'black';
square.style.opacity = 0.85;

var tutorialtext = document.createElement('div');
tutorialtext.innerHTML = 'Hello User! You clicked this button if you have some questions about the script and I will try answering them right now!<br><br>So lets start with the main functions: <br><br>1. Modes:<br>Used to repel Drones from base and farm from destroying shapes without leaving the base. <br>Once you click it the Drone Repel Mode switches. For example long 50/50 will send your drones 50 seconds out and 50 seconds back. To turn off all modes just switch until it says: (Modes) again.<br><br>2. New Tab<br>When clicked, copies current link, opens new Tab and pastes the copied link.<br><br>3. Interact with UI?<br>when active certain elements will dissapear from screen once your mouse is at their position.<br><br>4. Always Shoot?<br>When active presses Space infinitly<br><br>5.Auto Build?<br>When active, detects your current tank and automatically finds the best build for it (Works only for 4 tanks right now)<br>At lvl 15 you can notice that tanks like Twin or Sniper are renamed to Octo? and OL? = Overlord?. The tank name with ? at the end is the tank that will get the build in the end.<br><br>6. Autorespawn?<br>when clicked Multiple modes will apear on screen.<br>Use random Names: uses the names from const = names[].<br>Use random letters/numbers/symbols: well it uses random letters/numbers/symbols. Mixed: combines previous 3 modes into 1.<br><br>7. Canvas Upgrades:<br>When clicked 3 new buttons will appear: Select Tank, Activate? and Fix Coordinates.<br>First you have to click on Select Tank until you found the tank you want to upgrade to. Then click activate to turn the entire thing on.<br>If you are in the game, at least lvl 15, selected some tank and nothing is happening trying doing this:<br>1)Do not move the mouse for a while. 2)Check if Activate is green. And the final step is not recommended to use, but will fix the issue to 100%.<br>Press Fix Coordinates Button. This will close your window and reopen it in a size that will match the needed coordinates for your mouse.<br>If everything done correctly the tank you chose should be upgraded every 2 seconds.<br><br>8. Bot<br>MoveMouse?: My customisable version of Autospin<br>Change Spin Speed: you can change the duration of 1 full spin, changing the spinning speed<br>Flip Fire: I remade my own flipfire script, the only mode I have right now is gunnertrapper (the timings are not correct yet) <br><br><br>Other Modes not mentioned yet:<br><br>Freeze Mouse:<br>When you press X it freezes/unfreezes your mouse.<br><br>Mouse Coordinates:<br>these are shown at the top of your screen.<br><br>Anni Cooldown:<br>Select Anni/Destroyer/Hybrid and just click somewhere at screen.<br>If you have 3 reload build it will show a red/black button while the cooldown is active. During the cooldown you can not shoot.';
tutorialtext.style.position = 'absolute';
tutorialtext.style.zIndex = "100";
tutorialtext.style.color = 'orange';
tutorialtext.style.top = '5%';
tutorialtext.style.left = '5%';

//Bot spin

var MouseBot = false;
var KeysBot = false;
var SpinSpeed = 5000;
var intervalId;

function BotBy8no(){
    if(MouseBot){
        setTimeout(() => {
            mouse_move(canvas.width/2 - 215, canvas.height/2 - 21);
        }, SpinSpeed/16*1);
        setTimeout(() => {
            mouse_move(canvas.width/2 - 125, canvas.height/2 - 275);
        }, SpinSpeed/16*2);
        setTimeout(() => {
            mouse_move(canvas.width/2, canvas.height/2 - 300);
        }, SpinSpeed/16*3);
        setTimeout(() => {
            mouse_move(canvas.width/2 + 125, canvas.height/2 - 275);
        }, SpinSpeed/16*4);
        setTimeout(() => {
            mouse_move(canvas.width/2 + 215, canvas.height/2 - 215);
        }, SpinSpeed/16*5);
        setTimeout(() => {
            mouse_move(canvas.width/2 + 275, canvas.height/2 - 125);
        }, SpinSpeed/16*6);
        setTimeout(() => {
            mouse_move(canvas.width/2 + 300, canvas.height/2);
        }, SpinSpeed/16*7);
        setTimeout(() => {
            mouse_move(canvas.width/2 + 275, canvas.height/2 + 125);
        }, SpinSpeed/16*8);
        setTimeout(() => {
            mouse_move(canvas.width/2 + 215, canvas.height/2 + 215);
        }, SpinSpeed/16*9);
        setTimeout(() => {
            mouse_move(canvas.width/2 + 125, canvas.height/2 + 275);
        }, SpinSpeed/16*10);
        setTimeout(() => {
            mouse_move(canvas.width/2, canvas.height/2 + 300);
        }, SpinSpeed/16*11);
        setTimeout(() => {
            mouse_move(canvas.width/2 - 125, canvas.height/2 + 275);
        }, SpinSpeed/16*12);
        setTimeout(() => {
            mouse_move(canvas.width/2 - 215, canvas.height/2 + 215);
        }, SpinSpeed/16*13);
        setTimeout(() => {
            mouse_move(canvas.width/2 - 275, canvas.height/2 + 125)
        }, SpinSpeed/16*14);
        setTimeout(() => {
            mouse_move(canvas.width/2 - 315, canvas.height/2);
        }, SpinSpeed/16*15);
        setTimeout(() => {
            mouse_move(canvas.width/2 - 275, canvas.height/2 - 125);
        }, SpinSpeed/16*16);
        startBotBy8no();
    }
}

function startBotBy8no() {
  intervalId = setTimeout(BotBy8no, SpinSpeed);
}

function stopBotBy8no() {
  clearTimeout(intervalId);
}

//flipfire

var intervalId2;
var FlipFire = false;

function FlipFireBot() {
  if (FlipFire) {
   setTimeout(() => {
      key_down("Space");
    setTimeout(() => {
      freezeMouseMove();
      setTimeout(() => {
        mouse_move(canvas_mouse.x*2, canvas_mouse.y*2)
        setTimeout(() => {
          unfreezeMouseMove();
          setTimeout(() => {
            freezeMouseMove();
            setTimeout(() => {
              mouse_move(real_mouse.x*2, real_mouse.y*2)
              setTimeout(() => {
                unfreezeMouseMove();
                setTimeout(() => {
                    key_up("Space");
                  FlipFireBot();
                }, 300);
              }, 110);
            }, 60);
          }, 50);
        }, 40);
      }, 20);
    },);
   });
  }
}


function startFlipFire() {
  intervalId2 = setTimeout(FlipFireBot, 350);
}

function stopFlipFire() {
    alwShoot = false;
  clearTimeout(intervalId2);
}

var MyBot = document.createElement('button');
MyBot.innerHTML = 'Bot';
MyBot.style.position = 'absolute';
MyBot.style.top = '95%';
MyBot.style.left = '645px';
MyBot.style.transform = 'translateX(-50%)';
MyBot.style.backgroundColor = 'darkred';
MyBot.style.color = 'white';
MyBot.style.padding = '10px';
MyBot.style.border = 'none';
MyBot.style.borderRadius = '5px';
MyBot.style.fontSize = '7px';
MyBot.style.fontWeight = 'bold';
MyBot.style.cursor = 'pointer';
MyBot.style.zIndex = '9999';
MyBot.onclick = function() {
  if (MyBot.style.backgroundColor == 'darkgreen') {
    MyBot.style.backgroundColor = 'darkred';
    document.body.removeChild(MyBot2);
    document.body.removeChild(MyBot4);
      document.body.removeChild(MyBot5);
  } else {
    if (MyBot.style.backgroundColor == 'darkred') {
      MyBot.style.backgroundColor = 'darkgreen';
      document.body.appendChild(MyBot2);
      document.body.appendChild(MyBot4);
        document.body.appendChild(MyBot5);
    }
  }
}
document.body.appendChild(MyBot);

var MyBot2 = document.createElement('button');
MyBot2.innerHTML = 'MoveMouse? no';
MyBot2.style.position = 'absolute';
MyBot2.style.top = '90%';
MyBot2.style.left = '655px';
MyBot2.style.transform = 'translateX(-50%)';
MyBot2.style.backgroundColor = 'darkred';
MyBot2.style.color = 'white';
MyBot2.style.padding = '10px';
MyBot2.style.border = 'none';
MyBot2.style.borderRadius = '5px';
MyBot2.style.fontSize = '7px';
MyBot2.style.fontWeight = 'bold';
MyBot2.style.cursor = 'pointer';
MyBot2.style.zIndex = '9999';
MyBot2.onclick = function() {
  if (MyBot2.style.backgroundColor == 'darkgreen') {
    MyBot2.style.backgroundColor = 'darkred';
    MyBot2.innerHTML = 'MoveMouse? no';
    unfreezeMouseMove();
    MouseBot = false;
  } else {
    if (MyBot2.style.backgroundColor == 'darkred') {
      MyBot2.style.backgroundColor = 'darkgreen';
      MyBot2.innerHTML = 'MoveMouse? yes';
      freezeMouseMove();
      MouseBot = true;
      startBotBy8no(); // Start the bot when MoveMouse? yes is clicked
    }
  }
}

var MyBot4 = document.createElement('button');
MyBot4.innerHTML = 'Change Spin Speed';
MyBot4.style.position = 'absolute';
MyBot4.style.top = '70%';
MyBot4.style.left = '655px';
MyBot4.style.transform = 'translateX(-50%)';
MyBot4.style.backgroundColor = 'black';
MyBot4.style.color = 'white';
MyBot4.style.padding = '10px';
MyBot4.style.border = 'none';
MyBot4.style.borderRadius = '5px';
MyBot4.style.fontSize = '7px';
MyBot4.style.fontWeight = 'bold';
MyBot4.style.cursor = 'pointer';
MyBot4.style.zIndex = '9999';
MyBot4.onclick = function() {
  var person = prompt('Please enter the duration of the MoveMouse', SpinSpeed);
  if (person !== null) {
    var newSpinSpeed = parseInt(person);
    if (!isNaN(newSpinSpeed)) {
      SpinSpeed = newSpinSpeed;
      stopBotBy8no(); // Stop the current bot
      startBotBy8no(); // Start the bot with the new SpinSpeed
    }
  }
}

var MyBot5 = document.createElement('button');
MyBot5.innerHTML = 'flipfire (GunnerTrapper)';
MyBot5.style.position = 'absolute';
MyBot5.style.top = '85%';
MyBot5.style.left = '655px';
MyBot5.style.transform = 'translateX(-50%)';
MyBot5.style.backgroundColor = 'darkred';
MyBot5.style.color = 'white';
MyBot5.style.padding = '10px';
MyBot5.style.border = 'none';
MyBot5.style.borderRadius = '5px';
MyBot5.style.fontSize = '7px';
MyBot5.style.fontWeight = 'bold';
MyBot5.style.cursor = 'pointer';
MyBot5.style.zIndex = '9999';
MyBot5.onclick = function() {
  if (MyBot5.style.backgroundColor == 'darkgreen') {
    MyBot5.style.backgroundColor = 'darkred';
      FlipFire=false;
    stopFlipFire();
  } else {
    if (MyBot5.style.backgroundColor == 'darkred') {
      MyBot5.style.backgroundColor = 'darkgreen';
        FlipFire=true;
        if(alwShoot){
        button4.click();
        }
      startFlipFire();
    }
  }
}

//Base afk
//10 seconds to corner
//2 seconds out of corner
//4 seconds 1 side
// var Corner = 'Red Out';
// var inBase = false;
// var Team = 'none';

// function CornerCheck() {
//  if(Team == 'Red'){
//   if(Corner == 'Red Out'){
//    key_down(83); key_down(68);
//    setTimeout(() => {
//    key_up(83); key_up(68);
//    key_down(87); key_down(65);
//    }, 10000);
//       setTimeout(() => {
//       key_up(87); key_up(65);
//        }, 12000);
//     Corner = 'Red In';
//   }
//  }
//  if(Team == 'Blue'){
//   if(Corner == 'Blue Out'){
//    key_down(87); key_down(65);
//    setTimeout(() => {
//    key_up(87); key_up(65);
//    key_down(83); key_down(68);
//    }, 10000);
//       setTimeout(() => {
//       key_up(83); key_up(68);
//        }, 12000);
//     Corner = 'Blue In';
//   }
//  }
// }
// setInterval(CornerCheck, 12000);

// function BaseLoop() {
//     if(Corner == 'Red In') {
//         key_down(87);
//         setTimeout(() => {
//         key_up(68);
//         key_down(87);
//          }, 4000);
//         setTimeout(() => {
//             key_up(87);
//             key_down(65);
//         }, 8000);
//         setTimeout(() => {
//             key_up(65);
//             key_down(83);
//         }, 12000);
//         setTimeout(() => {
//             key_up(83);
//             key_down(68);
//         }, 16000);
//     }
// }

// setInterval(BaseLoop, 16000);


//Alternative

// function B0tBy8no(){
// }

// setInterval(B0tBy8no, 1000);
// var MyBot3 = document.createElement('button');
// MyBot3.innerHTML = 'KeyMove? no';
// MyBot3.style.position = 'absolute';
// MyBot3.style.top = '80%';
// MyBot3.style.left = '655px';
// MyBot3.style.transform = 'translateX(-50%)';
// MyBot3.style.backgroundColor = 'darkred';
// MyBot3.style.color = 'white';
// MyBot3.style.padding = '10px';
// MyBot3.style.border = 'none';
// MyBot3.style.borderRadius = '5px';
// MyBot3.style.fontSize = '7px';
// MyBot3.style.fontWeight = 'bold';
// MyBot3.style.cursor = 'pointer';
// MyBot3.style.zIndex = '9999';
// MyBot3.onclick = function() {
//   if (MyBot3.style.backgroundColor == 'darkgreen') {
//     MyBot3.style.backgroundColor = 'darkred';
//     MyBot3.innerHTML = 'KeyMove? no';
//   } else {
//       if (MyBot3.style.backgroundColor == 'darkred') {
//     MyBot3.style.backgroundColor = 'darkgreen';
//     MyBot3.innerHTML = 'KeyMove? yes';
//      Team = 'Red';
//     }
//   }
// }
// ==UserScript==
// @name         Working AFK script 2024!
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  set Afk spot with Q, toggle afk with R
// @author       r!PsAw
// @match        https://diep.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519191/Working%20AFK%20script%202024%21.user.js
// @updateURL https://update.greasyfork.org/scripts/519191/Working%20AFK%20script%202024%21.meta.js
// ==/UserScript==

//minimap Arrow Hook
function windowScaling() {
  const a = canvas.height / 1080;
  const b = canvas.width / 1920;
  return b < a ? a : b;
}

//credits to mi300
function hook(target, callback){

  function check(){
    window.requestAnimationFrame(check)

    const func = CanvasRenderingContext2D.prototype[target]

    if(func.toString().includes(target)){

      CanvasRenderingContext2D.prototype[target] = new Proxy (func, {
        apply (method, thisArg, args) {
          callback(thisArg, args)

        return Reflect.apply (method, thisArg, args)
        }
      });
    }
  }
  window.requestAnimationFrame(check)
}

let minimapArrow = [0, 0];
let square_pos = [0, 0]
let leaderArrow = [0, 0];
let minimapPos = [0, 0];
let minimapDim = [0, 0];

let calls = 0;
let points = [];

  hook('beginPath', function(thisArg, args){
    calls = 1;
    points = [];
  });
  hook('moveTo', function(thisArg, args){
    if (calls == 1) {
      calls+=1;
      points.push(args)
    } else {
      calls = 0;
    }
  });
  hook('lineTo', function(thisArg, args){
    if (calls >= 2 && calls <= 6) {
      calls+=1;
      points.push(args)
    } else {
      calls = 0;
    }
  });


function getCentre(vertices) {
  let centre = [0, 0];
  vertices.forEach (vertex => {
    centre [0] += vertex[0]
    centre [1] += vertex[1]
  });
  centre[0] /= vertices.length;
  centre[1] /= vertices.length;
  return centre;
}

hook('fill', function(thisArg, args){
    if(calls >= 4 && calls <= 6) {
    if(thisArg.fillStyle === "#000000" && thisArg.globalAlpha > 0.9){
          minimapArrow = getCentre(points);
          window.M_X = minimapArrow[0];
          window.M_Y = minimapArrow[1];
          square_pos = [minimapArrow[0]-(12.5*windowScaling()), minimapArrow[1]-(7*windowScaling())];
        return;
      }else if(thisArg.fillStyle === "#000000" && thisArg.globalAlpha === 0.3499999940395355 || thisArg.fillStyle === window.choose_color && thisArg.globalAlpha === 0.3499999940395355){
          thisArg.fillStyle = window.choose_color;
          leaderArrow = getCentre(points);
          window.L_X = leaderArrow[0];
          window.L_Y = leaderArrow[1];
        return;
      }
    } else {
    calls = 0;
  }
});

hook('strokeRect', function(thisArg, args) {
  const t = thisArg.getTransform();
  minimapPos = [t.e, t.f];
  minimapDim = [t.a, t.d];
});


//key press functions
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

//AFK logic
let afk = false;
let moving = false;
let your_pos = {x: 0, y: 0};
let goal = {x: 0, y: 0};

document.onkeydown = function(e) {
    //console.log(e.key);
    if(e.key === "q" || e.key === "Q"){
        set_goal(your_pos.x, your_pos.y);
    }else if(e.key === "r" || e.key === "R"){
        afk = !afk;
    }
};

function get_your_pos(){
    window.requestAnimationFrame(get_your_pos);
        your_pos.x = minimapArrow[0];
        your_pos.y = minimapArrow[1];
}
window.requestAnimationFrame(get_your_pos);

function set_goal(x, y){
    console.log("set_goal");
    goal.x = x;
    goal.y = y;
}

function move_to_goal() {
    console.log(`YOU: x: ${your_pos.x} y: ${your_pos.y} GOAL x: ${goal.x} y: ${goal.y}`);
    if (afk) {
        if (your_pos.x > goal.x) {
            key_up("KeyD");
            key_down("KeyA");
        } else {
            key_up("KeyA");
            key_down("KeyD");
        }
        if (your_pos.y > goal.y) {
            key_up("KeyS");
            key_down("KeyW");
        } else {
            key_up("KeyW");
            key_down("KeyS");
        }
        moving = true;
    }else{
        if(moving){
          key_up("KeyW");
          key_up("KeyA");
          key_up("KeyS");
          key_up("KeyD");
          moving = false;
        }
    }
}
setInterval(move_to_goal, 100);
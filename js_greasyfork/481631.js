// ==UserScript==
// @name         Predator and Hunter Stack (Any reload)
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Press J to stack predator, U to stack hunter and , and . to change the reload
// @author       MI300#4401
// @match        https://diep.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      dont copy
// @downloadURL https://update.greasyfork.org/scripts/481631/Predator%20and%20Hunter%20Stack%20%28Any%20reload%29.user.js
// @updateURL https://update.greasyfork.org/scripts/481631/Predator%20and%20Hunter%20Stack%20%28Any%20reload%29.meta.js
// ==/UserScript==
let isPredator = true;
function shoot(w) {
  input.key_down(1);
  setTimeout (() => {
    input.key_up(1);
  },w);
}

let reload = 7;
const predator = [
  [50, 500, 1400, 2800], // 0 reload
  [50, 500, 1300, 2700], // 1 reload
  [50, 400, 1200, 2450], // 2 reload
  [50, 300, 1100, 2200], // 3 reload
  [50, 300, 1000, 2100], // 4 reload
  [50, 300, 900, 1800], // 5 reload
  [50, 300, 800, 1700], // 6 reload
  [50, 300, 750, 1500], // 7 reload
]
const hunter = [
  [50, 1200], // 0 reload
  [50, 1100], // 1 reload
  [50, 1000], // 2 reload
  [50, 950], // 3 reload
  [50, 800], // 4 reload
  [50, 725], // 5 reload
  [50, 700], // 6 reload
  [50, 625], // 7 reload
]

function clump() {
  shoot(predator[reload][0]);
  setTimeout(() => {
    shoot(predator[reload][1]);
  },predator[reload][2]);
  setTimeout(() => {
    input.key_down (69);
    input.key_up (69);
  },predator[reload][3]);
}
function clump2(){
  shoot(hunter[reload][0])
  setTimeout(() => {
    input.key_down (69);
    input.key_up (69);
  },hunter[reload][1])
}

function increaseReload(){
  if(reload != 7){
    reload++;
  }
}
function decreaseReload(){
  if(reload != 0){
    reload--;
  }
}

document.addEventListener ('keydown', e => {
  if(!input || !input.should_prevent_unload()){
    return;
  }
  if(e.key == 'j') clump();
  if(e.key == 'u') clump2();
  if(e.key == ',') decreaseReload();
  if(e.key == '.') increaseReload();
});

// gui
setTimeout(function(){
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");
  const themes = [
    // dark      // light
    ['#75ba50', '#aeff82'], // green
    ['#2a25fa', '#7d7afa'], // blue
    ['#c92233', '#fa6b77'], // red
    ['#9a9c43', '#def58c'], // yellow
  ]
  let buttons = [];

  function render(){
    window.requestAnimationFrame(render)

    const scale = window.devicePixelRatio

    buttons.forEach(button => {
      let text = button.text;
      context.beginPath()
      context.strokeStyle = '#4d4c4c'
      context.fillStyle = button.style[0]
      context.lineWidth = 5 / scale;
      context.rect(button.x / scale, button.y / scale, button.width / scale, button.height / scale)
      context.fillRect(button.x / scale, button.y / scale + button.height / scale / 2, button.width / scale, button.height / scale / 2)
      context.fillStyle = button.style[1]
      context.fillRect(button.x / scale, button.y / scale, button.width / scale, button.height / scale / 2)
      context.stroke();

      context.font = 20 / scale + "px arial";
      context.strokeStyle = '#000000';
      context.fillStyle = '#FFFFFF';

      if(button.id == 2 || button.id == 3){
        text = reload + button.text;
      }
      context.strokeText(text, (button.x + 5) / scale, button.y / scale + (button.height - 8) / scale)
      context.fillText(text, (button.x + 5) / scale, button.y / scale + (button.height - 8) / scale)
    });
  }
  function createButton(x, y, width, height, text, id, callback){
    buttons.push(
      {
        x: x,
        y: y,
        width: width,
        height: height,
        text: text,
        style: themes[id],
        id: id,
      }
    )

  }
  createButton(450, 20, 100, 35, "Predator [J]", 0, clump)
  createButton(570, 20, 100, 35, "Hunter [U]", 1, clump2)
  createButton(690, 20, 50, 35, "- [,]", 2, decreaseReload)
  createButton(760, 20, 50, 35, "+ [.]", 3, increaseReload)

  window.requestAnimationFrame(render)
}, 2500)
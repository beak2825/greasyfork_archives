// ==UserScript==
// @name        Funny Faces
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      @basti564
// @description try to take over the world
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454599/Funny%20Faces.user.js
// @updateURL https://update.greasyfork.org/scripts/454599/Funny%20Faces.meta.js
// ==/UserScript==


var canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);
var ctx = canvas.getContext('2d');

var mouse = {
  x: 0,
  y: 0,
  down: false
};

var objects = [];

function addObject(x, y, w, h, vx, vy, ax, ay, color) {
  objects.push({
    x: x,
    y: y,
    w: w,
    h: h,
    vx: vx,
    vy: vy,
    ax: ax,
    ay: ay,
    color: color
  });
}

addObject(100, 100, 50, 50, 0, 0, 0, 0.1, '#ff0000');
addObject(200, 100, 50, 50, 0, 0, 0, 0.1, '#00ff00');
addObject(300, 100, 50, 50, 0, 0, 0, 0.1, '#0000ff');
addObject(400, 100, 50, 50, 0, 0, 0, 0.1, '#ffff00');
addObject(500, 100, 50, 50, 0, 0, 0, 0.1, '#00ffff');
addObject(600, 100, 50, 50, 0, 0, 0, 0.1, '#ff00ff');

function drawObject(obj) {
  ctx.fillStyle = obj.color;
  ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
}


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < objects.length; i++) {
    drawObject(objects[i]);
  }
}

function update() {
  for (var i = 0; i < objects.length; i++) {
    updateObject(objects[i]);
  }
}

function loop() {
  draw();
  update();
  requestAnimationFrame(loop);
}

function onMouseMove(e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
}

function onMouseDown(e) {
  mouse.down = true;
}

function onMouseUp(e) {
  mouse.down = false;
}

canvas.addEventListener('mousemove', onMouseMove);
canvas.addEventListener('mousedown', onMouseDown);
canvas.addEventListener('mouseup', onMouseUp);

loop();

function updateObject(obj) {
  if (mouse.down && mouse.x >= obj.x && mouse.x <= obj.x + obj.w && mouse.y >= obj.y && mouse.y <= obj.y + obj.h) {
    obj.x = mouse.x - obj.w / 2;
    obj.y = mouse.y - obj.h / 2;
  } else {
    obj.vx += obj.ax;
    obj.vy += obj.ay;
    obj.x += obj.vx;
    obj.y += obj.vy;
    if (obj.x < 0) {
      obj.x = 0;
      obj.vx = -obj.vx;
    }
    if (obj.y < 0) {
      obj.y = 0;
      obj.vy = -obj.vy;
    }
    if (obj.x + obj.w > canvas.width) {
      obj.x = canvas.width - obj.w;
      obj.vx = -obj.vx;
    }
    if (obj.y + obj.h > canvas.height) {
      obj.y = canvas.height - obj.h;
      obj.vy = -obj.vy;
    }
    for (var i = 0; i < objects.length; i++) {
      if (objects[i] !== obj) {
        if (obj.x < objects[i].x + objects[i].w && obj.x + obj.w > objects[i].x && obj.y < objects[i].y + objects[i].h && obj.y + obj.h > objects[i].y) {
          obj.x = obj.x - obj.vx;
          obj.y = obj.y - obj.vy;
          obj.vx = -obj.vx;
          obj.vy = -obj.vy;
        }
      }
    }
  }
}

function drawObject(obj) {
  ctx.fillStyle = obj.color;
  ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(obj.x + obj.w / 2, obj.y + obj.h / 2, obj.w / 2, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(obj.x + obj.w / 2 - obj.w / 4, obj.y + obj.h / 2 - obj.h / 4, obj.w / 8, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(obj.x + obj.w / 2 + obj.w / 4, obj.y + obj.h / 2 - obj.h / 4, obj.w / 8, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(obj.x + obj.w / 2, obj.y + obj.h / 2 + obj.h / 4, obj.w / 4, 0, Math.PI);
  ctx.fill();
};
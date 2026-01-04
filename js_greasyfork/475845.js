// ==UserScript==
// @name         Shape Aimbot UPDATED
// @namespace    http://tampermonkey.net/
// @version      2023
// @description  try to take over the world!
// @author       Mi300
// @match        https://diep.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      dont copy thx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475845/Shape%20Aimbot%20UPDATED.user.js
// @updateURL https://update.greasyfork.org/scripts/475845/Shape%20Aimbot%20UPDATED.meta.js
// ==/UserScript==
setTimeout(function(){
const canvas = document.getElementById ('canvas');
const context = canvas.getContext ('2d');
let mouse = [0, 0]
let shapes = {};
function clearShapes() {
shapes = {
  squares: [],
  triangles: [],
  pentagons: [],
}
}
clearShapes();
let shapeData = {
  triangles: {
    sides: 3,
    colour: '',
  },
  squares: {
    sides: 4,
    colour: '',
  },
  pentagons: {
    sides: 5,
    colour: '',
  },
}
let debugOptions = {
  lines: true,
  shapeInfo: true,
  aim: false,
}
const names = {
  squares: 'Square',
  triangles: 'Triangle',
  pentagons: 'Pentagon',
}
function hook(target, callback){
  const check = () => {
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
  check()
}
document.addEventListener('keydown', function(e) {
  if (e.key === 't') {
    debugOptions.aim = !debugOptions.aim;
  }
  if (e.key === 'r') {
    debugOptions.lines = !debugOptions.lines;
  }
  if (e.key === 'q') {
    debugOptions.shapeInfo = !debugOptions.shapeInfo;
  }
});


function hookShapes(callback) {
  let calls = 0;
  let points = [];


 const onClose = (colour) => {
   callback(getCentre(points), colour, calls)
 }
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
  hook('fill', function(thisArg, args){
    if(calls >= 4 && calls <= 6) {
      onClose(thisArg.fillStyle);
    } else {
      calls = 0;
    }
  });
}
function getCentre (vertices) {
  let centre = [0, 0];
  vertices.forEach (vertex => {
    centre [0] += vertex[0]
    centre [1] += vertex[1]
  });
  centre[0] /= vertices.length;
  centre[1] /= vertices.length;
  return centre;
}
document.addEventListener('mousemove', function() {
  if (!debugOptions.aim) {
    return;
  }
  input.mouse(...mouse)
});
  hookShapes(function(a, c, ca){
    if (!['#ffe869', '#fc7677', '#768dfc'].includes(c)) {
      return;
    }
    if(ca == 4){
      shapes.triangles.push(a)
    }
    if(ca == 5){
      shapes.squares.push(a)
    }
    if(ca == 6){
      shapes.pentagons.push(a)
    }
  });

function getDist(t1, t2){
  const distX = t1[0] - t2[0];
  const distY = t1[1] - t2[1];

  return [Math.hypot(distX, distY), distX, distY];
 };
function getClosest (entities) {
  let acc = [0, 0]
  for (let i = 0; i < entities.length; i ++) {
    const accumulator = getDist (acc, [canvas.width / 2, canvas.height / 2])[0];
    const current = getDist (entities[i], [canvas.width / 2, canvas.height / 2])[0];

    if (current < accumulator) acc = entities[i];
  }
  return acc;
}
function aim() {
  const target = getClosest
  (
    shapes.pentagons.length>0
    ?shapes.pentagons
    :shapes.triangles.length>0
    ?shapes.triangles
    :shapes.squares
  )
  if (!debugOptions.aim) {
    return;
  }
  mouse = target;
  input.mouse(...target)
}
function drawDebug() {

  if (debugOptions.lines) {
    const everyshape = [].concat(
      shapes.squares,
      shapes.triangles,
      shapes.pentagons,
    )
    everyshape.forEach(function(shape){
      context.beginPath();
      context.lineWidth = 0.5;
      context.strokeStyle == 'black';
      context.moveTo(canvas.width / 2, canvas.height / 2);
      context.lineTo(...shape)

      context.stroke()
      context.closePath()
    });
  }
  if (debugOptions.shapeInfo) {
    for (let key in shapes) {
      const type = shapeData[key];

      context.strokeStyle = 'red';
      context.lineWidth = 2;
      shapes[key].forEach(function(shape){
        const size = 75;
        context.beginPath();
        context.strokeRect(shape[0] - size / 2, shape[1] - size / 2, size, size);
        context.closePath();
      });
    }
    for (let key in shapes) {
      const type = shapeData[key];
      shapes[key].forEach(function(shape){
        const size = 75;
        context.beginPath();
        context.lineWidth = 2;
        context.font = "30px serif";
        context.strokeStyle = '#000000';
        context.fillStyle = '#FFFFFF';
        context.strokeText(names[key], shape[0] - 25, shape[1] + size / 2.5)
        context.fillText(names[key], shape[0] - 25, shape[1] + size / 2.5)
        context.closePath();
      });
    }
  }
}

function mainloop() {
  window.requestAnimationFrame(mainloop);
  drawDebug();
  aim();
  clearShapes();
}
mainloop();
},2500);
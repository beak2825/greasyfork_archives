// ==UserScript==
// @name         Afk Script UPDATED
// @namespace    http://tampermonkey.net/
// @version      3
// @description  Press F to set the afk location and J to afk
// @author       Mi300
// @match        https://diep.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      dont copy my script thx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476006/Afk%20Script%20UPDATED.user.js
// @updateURL https://update.greasyfork.org/scripts/476006/Afk%20Script%20UPDATED.meta.js
// ==/UserScript==

setTimeout (function() {
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
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let distance = [0, 0];
let isActive = false;
let storedPos = [0, 0];
let arrowPos = [0, 0];
let minimapPos = [0, 0];
let minimapDim = [0, 0];
let worldPosition = [0, 0];

let teamSnapshot = false;
let team = '#f14e54';
function hookMinimapArrow() {
  let drawInstructions = 0;
  let vertices = new Array(0);

  hook('beginPath', function(context, args) {
    drawInstructions = 1;
    vertices = new Array(0);
  });
  hook('moveTo', function(context, args) {
      drawInstructions = 2;
      vertices.push(args);
  });
  hook('lineTo', function(context, args) {
    if (drawInstructions >= 2 && drawInstructions <= 5) {
      drawInstructions++;
      vertices.push(args);
      return;
    }
    drawInstructions = 0;
  });
  hook('fill', function(context, args) {
    if (context.globalAlpha != 1 || context.fillStyle != '#000000') {
      return;
    }
    if (drawInstructions === 4) {
      const pos = getAverage (vertices);
      arrowPos = pos;
    }
  });
}
function hookMinimap() {
  hook('strokeRect', function(context, args) {
    const t = context.getTransform();
    minimapPos = [t.e, t.f];
    minimapDim = [t.a, t.d];
  });
  hook('rect', function(context, args) {// purple: #bf7ff5, red: #f14e54, blue: #00b2e1, green: #00e16e
    const c = context.fillStyle;
    if (teamSnapshot) {
      if (c == '#f14e54') {
        team = c;
      }
      if (c == '#00b2e1') {
        team = c;
      }
      if (c == '#bf7ff5') {
        team = c;
      }
      if (c == '#00e16e') {
        team = c;
      }
    }
  });
}
hookMinimap();
hookMinimapArrow();
function getAverage(points) {
  let ret = [0, 0];
  points.forEach (point => {
    ret[0] += point[0];
    ret[1] += point[1];
  });
  ret[0] /= points.length;
  ret[1] /= points.length;
  return ret;
}
function getWorldPos () {
  const ret = [
    parseFloat((((arrowPos[0] - minimapPos[0] - minimapDim[0] / 2) / minimapDim[0] * 100) * 460).toFixed (3)),
    parseFloat((((arrowPos[1] - minimapPos[1] - minimapDim[1] / 2) / minimapDim[1] * 100) * 460).toFixed (3)),
  ]
  return ret;
}
let lineWidth = 0;
let cameraZoom = 0;
CanvasRenderingContext2D.prototype.stroke = new Proxy(CanvasRenderingContext2D.prototype.stroke, {
    apply(method, self, args) {
        lineWidth = self.lineWidth;
        return Reflect.apply(method, self, args);
    }
});
CanvasRenderingContext2D.prototype.createPattern = new Proxy(CanvasRenderingContext2D.prototype.createPattern, {
    apply(method, self, args) {
        cameraZoom = 1 / lineWidth;
        return Reflect.apply(method, self, args);
    }
});
input.try_spawn = new Proxy(input.try_spawn, {
    apply(method, self, args) {
        teamSnapshot = true;
        setTimeout(function() {
          teamSnapshot = false;
          console.log (team)
        },1000);
        return Reflect.apply(method, self, args);
    }
});
function tick() {
  window.requestAnimationFrame(tick);
  worldPosition = getWorldPos();
  distance = getDist(
    worldPosition,
    storedPos,
  )
  if (isActive) {
    move();
  }
  drawAfkPos();
}
tick();
function toGrid(dist) {
  return [
    dist[0] / ((1 - cameraZoom) * 8),
    dist[1] / ((1 - cameraZoom) * 8),
    dist[2] / ((1 - cameraZoom) * 8),
  ]
}
function drawAfkPos() {
  //distance
  const width = canvas.width;
  const height = canvas.height;

  const grid = toGrid(distance);
  const size = 50;
  let toDraw = [
    width / 2 - grid[1],
    height / 2 - grid[2],
  ]
  ctx.beginPath();
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = team
  ctx.arc(...toDraw, size, 0, Math.PI * 2, false);
  ctx.fill();
  ctx.stroke();
  ctx.globalAlpha = 1;

  ctx.beginPath();
  ctx.lineWidth = 4;
  ctx.font = "23px bold arial"
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  if (isActive) {
    ctx.strokeText('[J] Locked', toDraw[0] - 50, toDraw[1] + 25);
    ctx.fillText('[J] Locked', toDraw[0] - 50, toDraw[1] + 25);
  } else {
    ctx.strokeText('[J] Unlocked', toDraw[0] - 50, toDraw[1] + 25);
    ctx.fillText('[J] Unlocked', toDraw[0] - 50, toDraw[1] + 25);
  }

}
document.addEventListener('keydown', e => {
  if(e.key === 'j') {
    isActive = !isActive;
    input.key_up (83);
    input.key_up (87);
    input.key_up (68);
    input.key_up (65);
  }
  if(e.key === 'f') {
    storedPos = worldPosition;
  }
});
function getDist(t1, t2) {
  const distX = t1[0] - t2[0];
  const distY = t1[1] - t2[1];
  return [Math.hypot(distX, distY), distX, distY];
};
function move() {
  if (distance[1] < 0.1) {
    input.key_up (65);
    input.key_down (68);
  } else if (distance[1] > -0.1) {
    input.key_up (68);
    input.key_down (65);
  } else {
    input.key_up (68);
    input.key_up (65);
  }

  if (distance[2] < 0.1) {
    input.key_up (87);
    input.key_down (83);
  } else if (distance[2] > 0.1) {
    input.key_up (83);
    input.key_down (87);
  } else {
    input.key_up (83);
    input.key_up (87);
  }
}
},2500);
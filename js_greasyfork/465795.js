// ==UserScript==
// @name         florr.io map
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  the map is always on your screen, just scroll while hovering over it to change size. drag it around to move it.
// @author       notafrogo#4349
// @match        https://florr.io/*
// @icon         https://static.wikia.nocookie.net/official-florrio/images/b/bb/Stinger_%28Super%29.png/revision/latest/scale-to-width-down/350?cb=20230123160911
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465795/florrio%20map.user.js
// @updateURL https://update.greasyfork.org/scripts/465795/florrio%20map.meta.js
// ==/UserScript==

const styleSheet = `
#florrMap {
    display: inline;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
   	border: 7px solid #ffe52c;
    border-radius: 40px;
    opacity: 1;
    pointer-events: none;

body {
   user-select: none;
   -moz-user-select: none;
}
.zoomables {
    pointer-events: none;
    border: 1px solid black;
}
#zoomMe {
    position: absolute;
    top: 0px;
    left: 0px;
}
}`

const img = document.createElement("img");
img.src = "https://media.discordapp.net/attachments/1079971830384828500/1103484909848379561/Map_21_-_May_3.png";
img.id = "zoomMe";
img.style.width = "600px";
img.style.height = "600px";
img.class = "zoomables";
img.style.position = 'absolute';

document.body.appendChild(img);
let s = document.createElement('style');
s.type = "text/css";
s.innerHTML = styleSheet;
(document.head || document.documentElement).appendChild(s);

// let mapOpen = false;
// let opacity = 1;
// window.addEventListener('load', function() {
//   document.onkeydown = function(evt) {
//     evt = evt || window.event;
//     if (evt.keyCode == 192 && mapOpen === false) {
//    	mapOpen = true;
//     document.getElementById("zoomMe").hidden = true;
//     } else if (evt.keyCode == 192 && mapOpen === true) {
//     mapOpen = false;
//     document.getElementById("zoomMe").hidden = false;
//     }

//     if (evt.keyCode == 18 && opacity > 0.2) {
//     opacity -= 0.1;
//     document.getElementById("zoomMe").style.opacity = `${opacity}`;
//     }
//     if (evt.keyCode == 17 && opacity < 1) {
//     opacity += 0.1;
//     document.getElementById("zoomMe").style.opacity = `${opacity}`;
//     }
//   };
// });


const view = (() => {
  const matrix = [1, 0, 0, 1, 0, 0]; // current view transform
  var m = matrix;
  var scale = 1;
  const pos = { x: 0, y: 0 }; // current position of origin
  var dirty = true;
  const API = {
    applyTo(el) {
      if (dirty) { this.update() }
      el.style.transform = `matrix(${m[0]},${m[1]},${m[2]},${m[3]},${m[4]},${m[5]})`;
    },
    update() {
      dirty = false;
      m[3] = m[0] = scale;
      m[2] = m[1] = 0;
      m[4] = pos.x;
      m[5] = pos.y;
    },
    pan(amount) {
      if (dirty) { this.update() }
       pos.x += amount.x;
       pos.y += amount.y;
       dirty = true;
    },
    scaleAt(at, amount) { // at in screen coords
      if (dirty) { this.update() }
      scale *= amount;
      pos.x = at.x - (at.x - pos.x) * amount;
      pos.y = at.y - (at.y - pos.y) * amount;
      dirty = true;
    },
  };
  return API;
})();

document.addEventListener("mousemove", mouseEvent, {passive: false});
document.addEventListener("mousedown", mouseEvent, {passive: false});
document.addEventListener("mouseup", mouseEvent, {passive: false});
document.addEventListener("mouseout", mouseEvent, {passive: false});
document.addEventListener("wheel", mouseWheelEvent, {passive: false});
const mouse = {x: 0, y: 0, oldX: 0, oldY: 0, button: false};
function mouseEvent(event) {
    if (event.target === img) {
        if (event.type === "mousedown") {
            mouse.button = true
        }
        if (event.type === "mouseup" || event.type === "mouseout") {
            mouse.button = false
        }
        mouse.oldX = mouse.x;
        mouse.oldY = mouse.y;
        mouse.x = event.pageX;
        mouse.y = event.pageY;
        if(mouse.button) { // pan
            view.pan({x: mouse.x - mouse.oldX, y: mouse.y - mouse.oldY});
            view.applyTo(zoomMe);
        }
        event.preventDefault();
        }
    }
function mouseWheelEvent(event) {
    if (event.target === img) {
    const x = event.pageX - (zoomMe.width / 2);
    const y = event.pageY - (zoomMe.height / 2);
    if (event.deltaY < 0) {
        view.scaleAt({x, y}, 1.1);
        view.applyTo(zoomMe);
    } else {
        view.scaleAt({x, y}, 1 / 1.1);
        view.applyTo(zoomMe);
    }
    event.preventDefault();
}
}
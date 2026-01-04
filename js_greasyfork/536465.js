// ==UserScript==
// @name          Ships 3D Hackss
// @description   Best Ships3D Hack (I think)
// @author        Jhonny-The
// @match         *://yp3d.com/ships3d/*
// @namespace     http://tampermonkey.net/
// @version       1.1
// @icon          https://i.imgur.com/11sYWVM.png
// @grant         none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/536465/Ships%203D%20Hackss.user.js
// @updateURL https://update.greasyfork.org/scripts/536465/Ships%203D%20Hackss.meta.js
// ==/UserScript==



(function() {
    'use strict';



    //PAGE 1
document.addEventListener("keydown", function(e) {
  if (e.key == '\\') {
    let d = document.querySelector('#menu');
    if (d.style.display == 'none') {
      d.style.display = "block";
    } else {
      d.style.display = "none";
    }
  }
});
window.API = {
  THREE: window.THREE,
  scene: null,
  gameClient: {},
  AmbientLight: null,
  DirectionalLight: null,
  ocean: null
};
delete window.THREE;
var done = false;
WeakMap.prototype.set = new Proxy(WeakMap.prototype.set, {
  apply(target, thisArgs, [object]) {
    if (object && typeof object === 'object' && object.type !==
'BufferGeometry' && object.type !== 'PlaneGeometry') {
      if (object.type == 'Scene') {
        API.scene = object;
        for (let index = 0; index < API.scene.children.length; index++) {
          if (API.scene.children[index].name === 'ocean') {
            API.ocean = API.scene.children[index];
          }
          if (API.scene.children[index].type === 'DirectionalLight') {
            API.DirectionalLight = API.scene.children[index];
          }
          if (API.scene.children[index].type === 'AmbientLight') {
            API.AmbientLight = API.scene.children[index];
          }
        }
      }
    }
    return Reflect.apply(...arguments);
  }
});



//PAGE 2
function ShipProxy(obj, propName, callback) {
  obj[propName] = new Proxy(obj[propName], {
    apply: function(target, thisArg, argumentsList) {
      callback(...argumentsList);
      return Reflect.apply(target, thisArg, argumentsList);
    }
  });
}
ShipProxy(Object, "defineProperty", (...object) => {
  if (object.length === 3 && object[1] === "getCollectionLengths" && !
API.gameClient.hasOwnProperty('gameClient')) {
    API.gameClient = object[0];
  }
});
window.ShipsAPI = API;
let inHTML = `
<div style="z-index:999999; color:white; position:fixed; top:20px; left:20px;
padding:20px; height:auto; width:230px; background:rgba(0,0,0,0.9); border-
radius:8px; font-family:sans-serif;" id="menu">
  <h2 style="color:#4CAF50; text-align:center; margin-bottom:10px;
  font-size: 24px; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);" >Kraken</h2>
  <ul style="display:flex; flex-direction:column; align-items:left; min-
height:auto; height:auto; overflow-y:auto; list-style:none; padding:0;">
  <li id="p-reset" style="background-color:#222; margin-bottom:5px; border-
radius:5px; padding:8px 10px;">Teleport-Spawn</li>
  <li id="fly" style="background-color:#222; margin-bottom:5px; border-
radius:5px; padding:8px 10px;">Fly</li>
  <li id="speed" style="background-color:#222; margin-bottom:5px; border-
radius:5px; padding:8px 10px;">Speed (doesn't work)</li>
  <li id="fast-swim" style="background-color:#222; margin-bottom:5px; border-
radius:5px; padding:8px 10px;">Fast-Swim(Doesn't work)</li>
  <li id="low-gravity" style="background-color:#222; margin-bottom:5px; border-
radius:5px; padding:8px 10px;">Low-Gravity</li>
  <li id="high-jump" style="background-color:#222; margin-bottom:5px; border-
radius:5px; padding:8px 10px;">High-Jump</li>
  <li id="float" style="background-color:#222; margin-bottom:5px; border-
radius:5px; padding:8px 10px;">Float</li>
  <li id="dolphin" style="background-color:#222; margin-bottom:5px; border-
radius:5px; padding:8px 10px;">Dolphin-Mode</li>
  <li id="highlight-weapons" style="background-color:#222; margin-bottom:5px;
border-radius:5px; padding:8px 10px;">Highlights</li>
  <li id="spectate" style="background-color:#222; margin-bottom:5px; border-
radius:5px; padding:8px 10px;">Spectate</li>
  <li id="hide-ui" style="background-color:#222; margin-bottom:5px; border-
radius:5px; padding:8px 10px;">Hide-UI</li>
  <li id="water-visibility" style="background-color:#222; margin-bottom:5px; border-
radius:5px; padding:8px 10px;">Invisible Water</li>
  </ul>
</div>
`;
let elem = document.createElement("div");
elem.innerHTML = inHTML;
document.body.appendChild(elem);
function Dolphin() {
  alert("Toggle: Press Shift to enable/disable Ground-Pass People can shoot you trough the ground, but you can do it too.");
  let originalMathSqrt = Math.sqrt;
  let dolphinActive = false;



  document.addEventListener('keydown', function(event) {
    if (event.key === 'Shift') {
      dolphinActive = !dolphinActive;
      const dolphinButton = document.querySelector("#dolphin");
      if (dolphinActive) {
        Math.sqrt = function(value) {
          return 1;
        };
        if (dolphinButton) {
          dolphinButton.style.backgroundColor = 'green';
        }
      } else {
        Math.sqrt = originalMathSqrt;
        if (dolphinButton) {
          dolphinButton.style.backgroundColor = '#222';
        }
      }
    }
  });
}
document.querySelector("#dolphin").addEventListener("click", Dolphin);
function HighlightWeapons() {
  const wireFrame = true;
  const original_push = Array.prototype.push;
  Array.prototype.push = function(...args) {
  original_push.apply(this, args);
  if (args[0] && args[0].material && args[0].type == "SkinnedMesh") {
    if (wireFrame) {
      args[0].material.wireframe = true;
    }
    args[0].material.alphaTest = -1;
    args[0].material.wireframeLinewidth = 0.1;
    args[0].material.depthTest = true;
    args[0].material.fog = false;
    args[0].material.color.r = 255;
    args[0].material.color.g = 255;
    args[0].material.color.b = 255;
  }
  };
}
document.querySelector("#highlight-weapons").addEventListener("click",
HighlightWeapons);
function HidePlayerNames() {
  let roundOverride = true;
  document.addEventListener("keyup", function(event) {
  if (event.key === "l") {
    roundOverride = !roundOverride;
    if (roundOverride) {
      Math.round = function(value) {
        return 1;
      };
    } else
Math.round = Math._round;
  }
  }
);
  if (roundOverride) {
    Math._round = Math.round;
    Math.round = function(value) {
      return 1;
    };
  }
}
document.querySelector("#hide-ui").addEventListener("click", HidePlayerNames);
window.intersectingPartialStateMsg = false;
window.toggleIntersectingPartialStateMsg = function() {
  intersectingPartialStateMsg = !intersectingPartialStateMsg;
};
const h = {
  apply: function(target, thisArgs, argumentsList) {
  if (argumentsList[0].t === 'ms' && intersectingPartialStateMsg) {
    argumentsList[0] = new Object;
  };
  return target.apply(thisArgs, argumentsList)
  }
};
function Speed() {
  const button = document.querySelector("#speed");
  const speedEnabled = window.ShipsAPI.gameClient.gameClient.sailorMe.maxSpeed === 4;
  toggleIntersectingPartialStateMsg();
  ShipsAPI.gameClient.gameClient.gameSocket.sendMessage = new
Proxy(API.gameClient.gameClient.gameSocket.sendMessage, h);
  window.ShipsAPI.gameClient.gameClient.sailorMe.maxSpeed = speedEnabled ? 3 : 4;
  button.style.backgroundColor = speedEnabled ? '#222' : 'green';
}
document.querySelector("#speed").addEventListener("click", Speed);
function Float() {
  const button = document.querySelector("#float");
  const floatEnabled = window.ShipsAPI.gameClient.gameClient.sailorMe.gravity === 0;
  window.ShipsAPI.gameClient.gameClient.sailorMe.gravity = floatEnabled ? 4 : 0;
  button.style.backgroundColor = floatEnabled ? '#222' : 'green';
}
document.querySelector("#float").addEventListener("click", Float);
function FastSwim() {
  const button = document.querySelector("#fast-swim");
  const fastSwimEnabled = window.ShipsAPI.gameClient.gameClient.sailorMe.swimmingSpeed === 10;
  window.ShipsAPI.gameClient.gameClient.sailorMe.swimmingSpeed = fastSwimEnabled ? 5 : 10;
  button.style.backgroundColor = fastSwimEnabled ? '#222' : 'green';
}
document.querySelector("#fast-swim").addEventListener("click", FastSwim);
function HighJump() {
  const button = document.querySelector("#high-jump");
  const highJumpEnabled = window.ShipsAPI.gameClient.gameClient.sailorMe.jumpSpeed === 20;
  window.ShipsAPI.gameClient.gameClient.sailorMe.jumpSpeed = highJumpEnabled ? 5 : 20;
  button.style.backgroundColor = highJumpEnabled ? '#222' : 'green';
}
document.querySelector("#high-jump").addEventListener("click", HighJump);
function LowGravity() {
  const button = document.querySelector("#low-gravity");
  const lowGravityEnabled = window.ShipsAPI.gameClient.gameClient.sailorMe.gravity === 1;
  window.ShipsAPI.gameClient.gameClient.sailorMe.gravity = lowGravityEnabled ? 4 : 1;
  button.style.backgroundColor = lowGravityEnabled ? '#222' : 'green';
}
document.querySelector("#low-gravity").addEventListener("click", LowGravity);
function Spectate() {
  const button = document.querySelector("#spectate");
  window.ShipsAPI.gameClient.gameClient.spectator.isOn = !window.ShipsAPI.gameClient.gameClient.spectator.isOn;
  button.style.backgroundColor = window.ShipsAPI.gameClient.gameClient.spectator.isOn ? 'green' : '#222';
}
document.querySelector("#spectate").addEventListener("click", Spectate);
function PReset() {
  const button = document.querySelector("#p-reset");
  // PReset is a one-time action, so we'll just briefly highlight it on click
  button.style.backgroundColor = 'green';
  setTimeout(() => {
    button.style.backgroundColor = '#222';
  }, 500); // Revert color after 0.5 seconds
}
document.querySelector("#p-reset").addEventListener("click", PReset);
function Fly() {
  const button = document.querySelector("#fly");
  let flyEnabled = window.ShipsAPI.gameClient.gameClient.sailorMe.gravity === -4;
  window.onkeydown = (e) => {
    if (e.code === 'Space') {
      flyEnabled = !flyEnabled;
      window.ShipsAPI.gameClient.gameClient.sailorMe.gravity = flyEnabled ? -4 : 4;
      button.style.backgroundColor = flyEnabled ? 'green' : '#222';
    }
  };
  // Set initial color based on the initial state (off)
  button.style.backgroundColor = flyEnabled ? 'green' : '#222';
}
document.querySelector("#fly").addEventListener("click", Fly);
function ToggleWaterVisibility() {
  if (window.ShipsAPI && window.ShipsAPI.ocean) {
    window.ShipsAPI.ocean.visible = !window.ShipsAPI.ocean.visible;
    const waterButton = document.querySelector("#water-visibility");
    if (waterButton) {
      waterButton.style.backgroundColor = window.ShipsAPI.ocean.visible ? '#222' : 'green';
    }
  } else {
    console.log("Water object not found yet.");
  }
}
document.querySelector("#water-visibility").addEventListener("click", ToggleWaterVisibility);



})();

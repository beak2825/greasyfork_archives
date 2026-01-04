// ==UserScript==
// @name         Vanis.io Extended
// @namespace    VEX
// @version      0.1
// @description  VEX - Vanis.io Extended
// @author       l3mpik, Diszy
// @match        https://vanis.io/
// @grant        none
// @run-at       document-end
// @resource     https://cdn.jsdelivr.net/npm/sweetalert2@9
// @downloadURL https://update.greasyfork.org/scripts/394373/Vanisio%20Extended.user.js
// @updateURL https://update.greasyfork.org/scripts/394373/Vanisio%20Extended.meta.js
// ==/UserScript==
/*
Please do not skid our code, we worked hard on this. If you want to copy something, message us first on Discord to get permission.
*/
/*
Please do not skid our code, we worked hard on this. If you want to copy something, message us first on Discord to get permission.
*/
/*
Please do not skid our code, we worked hard on this. If you want to copy something, message us first on Discord to get permission.
*/
/*
Please do not skid our code, we worked hard on this. If you want to copy something, message us first on Discord to get permission.
*/
/*
Please do not skid our code, we worked hard on this. If you want to copy something, message us first on Discord to get permission.
*/

const VEX = `
<style>

.vex {

  width : 350px;
  height: 800px;
  right: 2%;
  position: fixed;
  top: calc(50% - 400px);

  display: none;
  flex-wrap : wrap;
  justify-content: center;

  background: rgba(30, 30, 30, .75);
  border: 1px solid red;

  font-family : Monospace;

  z-index: 9999;
}

.vex > .vex-hud {

  width: 90%;

  display : flex;
  flex-wrap: wrap;
  justify-content: center;
}

.vex > .vex-hud > p {

  width: 100%;
  text-align: center;

  color : white;
}
.vex > .vex-hud > input {

  width: 100%;

  background : rgba(30, 30, 30, .65);
  border: 1px solid rgba(30, 30, 30, 1);

  text-align: center;
  color: #ffffff;

  outline : 0;
  box-shadow: none;
}

.vex > .vex-skins {

  width: 90%;

  display : flex;
  flex-wrap: wrap;
  justify-content: center;
}

.vex > .vex-skins > .vex-skins-item {

  width: 100%;
}
.vex > .vex-skins > .vex-skins-item > p {

  width: 100%;
  text-align: center;

  color : white;
}

.vex > .vex-skins > .vex-skins-item > input {

  width: 100%;

  background : rgba(30, 30, 30, .65);
  border: 1px solid rgba(30, 30, 30, 1);

  text-align: center;
  color: #ffffff;

  outline : 0;
  box-shadow: none;
}

.vex > .vex-controls {

  width: 90%;

  display : flex;
  flex-wrap: wrap;
  justify-content: center;
}

.vex > .vex-controls > p {

  width: 100%;
  text-align: center;

  color : white;
}

.vex > .vex-controls > button {

  width: 50%;

  background : rgba(30, 30, 30, .65);
  border: 1px solid rgba(30, 30, 30, 1);

  text-align: center;
  color: #ffffff;

  outline : 0;
  box-shadow: none;
}

#vex-r-start {}
#vex-r-start.active {

  color: lime;
}
#vex-r-start:hover {

  color: lime;
}

#vex-r-stop {}
#vex-r-stop.active {

  color: tomato;
}
#vex-r-stop:hover {

  color: tomato;
}

.vex > .vex-extras {

  width: 90%;

  display : flex;
  flex-wrap: wrap;
  justify-content: center;
}

.vex > .vex-extras {

  width: 90%;

  text-align: center;
  color: white;
}
.vex > .vex-extras > .vex-extras-item {

  width: 100%;
  display: inline-flex;
}
.vex > .vex-extras > .vex-extras-item > p {

  width: 80%;
  text-align: center;

  color : white;
}

.vex > .vex-extras > .vex-extras-item > input {

  margin-left: 10px;

  background : rgba(30, 30, 30, .65);
  border: 1px solid rgba(30, 30, 30, 1);

  text-align: center;
  color: #ffffff;

  outline : 0;
  box-shadow: none;
}

</style>

<div class="vex">
  <div class="vex-hud">
<h1>HUD WILL BE UPDATED LATER</h1>
    <p>Vanis HUD Color</p>
    <input id="vex-hc" type="text" placeholder="hex/rgb/rgba ex. #ff0000 rgb(255, 0, 0)">
  </div>

  <div class="vex-skins">

    <div class="vex-skins-item">
      <p>Skin URL 1</p>
      <input id="vex-s1" type="text" placeholder="https://skins.vanis.io">
    </div>

        <div class="vex-skins-item">
      <p>Skin URL 2</p>
      <input id="vex-s2" type="text" placeholder="https://skins.vanis.io">
    </div>
        <div class="vex-skins-item">
      <p>Skin URL 3</p>
      <input id="vex-s3" type="text" placeholder="https://skins.vanis.io">
    </div>

        <div class="vex-skins-item">
      <p>Skin URL 4</p>
      <input id="vex-s4" type="text" placeholder="https://skins.vanis.io">
    </div>
  </div>

  <div class="vex-controls">
    <button id="vex-r-start">Start Skinchanger</button>
    <button id="vex-r-stop">Stop Skinchanger</button>
  </div>

  <div class="vex-extras">
    <div class="vex-extras-item">
      <p>Auto respawn</p>
      <input id="vex-e-ar" type="checkbox">
    </div>

    <div class="vex-extras-item">
      <p>Skip stats</p>
      <input id="vex-e-ss" type="checkbox">
    </div>

  </div>
<p>Credits to l3mpik & Diszy</p>
</div>
`;



setTimeout(()=>{
window.showHud = () => {
document.querySelector(".vex").style.display ="block";
document.querySelector("#toggleHud").setAttribute("onclick", "hideHud()");

}

window.hideHud = () => {
document.querySelector(".vex").style.display ="none";
document.querySelector("#toggleHud").setAttribute("onclick", "showHud()");
}

  document.querySelectorAll("#vanis-io_300x250")[0].innerHTML += VEX;
  document.querySelector(".social-container").innerHTML += '<a id="toggleHud" style="background:#c00;cursor:pointer;outline:none;border:0;padding:5px;color:#dadada;box-shadow:0 0 1px 1px #000;border-radius:4px;font-size:16px;text-shadow:1px 1px 2px #000;margin-left:10px;" onclick="showHud()">Toggle Hud</a>';

    window._$ = selector => {

    const nodes = document.querySelectorAll(selector);

    return nodes.length == 1 ? nodes[0] : nodes;
}

let VEX_HUD_COLOR = "";

let VEX_SKIN1 = "";
let VEX_SKIN2 = "";
let VEX_SKIN3 = "";
let VEX_SKIN4 = "";

let VEX_ROTATOR_STATE = false;
const VEX_ROTATOR_DELAY = 1000;


let VEX_EXTRAS_AR = false;
let VEX_EXTRAS_AR_INTERVAL = null;

let VEX_EXTRAS_SS = false;
let VEX_EXTRAS_SS_INTERVAL = null;

const VEX_DOM_OVERLAY = _$(".vex");

const VEX_DOM_HC = _$("#vex-hc");

const VEX_DOM_SKIN_INPUT = _$("#skinurl");
const VEX_DOM_SKIN1 = _$("#vex-s1");
const VEX_DOM_SKIN2 = _$("#vex-s2");
const VEX_DOM_SKIN3 = _$("#vex-s3");
const VEX_DOM_SKIN4 = _$("#vex-s4");

const VEX_DOM_ROTATOR_START = _$("#vex-r-start");
const VEX_DOM_ROTATOR_STOP = _$("#vex-r-stop");

const VEX_DOM_EXTRAS_AR = _$("#vex-e-ar");
const VEX_DOM_EXTRAS_SS = _$("#vex-e-ss");

const VEX_HUD_COLOR_FUNC = () => {

  for(const element of _$(".fade"))
    element.style.background = VEX_HUD_COLOR;

  _$("#overlay").style.background = "radial-gradient("+VEX_HUD_COLOR+" 300px,"+VEX_HUD_COLOR+")";
};

let VEX_ROTATOR_INTERVAL = null;
let VEX_ROTATOR_CURRENT = 1;

const VEX_ROTATOR_FUNC_NEXT = () => {

  if(VEX_ROTATOR_CURRENT < 5)
    VEX_ROTATOR_CURRENT += 1;

  if(VEX_ROTATOR_CURRENT == 5)
    VEX_ROTATOR_CURRENT = 1;

  VEX_DOM_SKIN_INPUT.value = localStorage.getItem("vex-s"+VEX_ROTATOR_CURRENT);
};

const VEX_ROTATOR_FUNC_PREV = () => {

  if(VEX_ROTATOR_CURRENT < 5)
    VEX_ROTATOR_CURRENT -= 1;

  if(VEX_ROTATOR_CURRENT == 0)
    VEX_ROTATOR_CURRENT = 1;

  VEX_DOM_SKIN_INPUT.value = localStorage.getItem("vex-s"+VEX_ROTATOR_CURRENT);
};



VEX_DOM_HC.addEventListener("change", event => {

  if(event.target.value == localStorage.getItem("vex-hc"))
    return;

  localStorage.setItem("vex-hc", event.target.value);

  VEX_HUD_COLOR = localStorage.getItem("vex-hc");

  VEX_HUD_COLOR_FUNC();
}, false)

VEX_DOM_SKIN1.addEventListener("change", event => {

  if(event.target.value == localStorage.getItem("vex-s1"))
    return;

  localStorage.setItem("vex-s1", event.target.value);

  VEX_SKIN1 = localStorage.getItem("vex-s1");
}, false)

VEX_DOM_SKIN2.addEventListener("change", event => {

  if(event.target.value == localStorage.getItem("vex-s1"))
    return;

  localStorage.setItem("vex-s2", event.target.value);

  VEX_SKIN2 = localStorage.getItem("vex-s2");
}, false)

VEX_DOM_SKIN3.addEventListener("change", event => {

  if(event.target.value == localStorage.getItem("vex-s1"))
    return;

  localStorage.setItem("vex-s3", event.target.value);

  VEX_SKIN3 = localStorage.getItem("vex-s3");
}, false)

VEX_DOM_SKIN4.addEventListener("change", event => {

  if(event.target.value == localStorage.getItem("vex-s1"))
    return;

  localStorage.setItem("vex-s4", event.target.value);

  VEX_SKIN4 = localStorage.getItem("vex-s4");
}, false)

VEX_DOM_ROTATOR_START.addEventListener('click', event => {

  VEX_ROTATOR_STATE = true;

  VEX_DOM_ROTATOR_STOP.className = "";
  event.target.className += " active";

  VEX_ROTATOR_CURRENT = 1;
  VEX_ROTATOR_INTERVAL = setInterval(VEX_ROTATOR_FUNC_NEXT, VEX_ROTATOR_DELAY);
}, false);

VEX_DOM_ROTATOR_STOP.addEventListener('click', event => {

  VEX_ROTATOR_STATE = false;

  VEX_DOM_ROTATOR_START.className = "";
  event.target.className += " active";

  VEX_ROTATOR_CURRENT = 1;
  clearInterval(VEX_ROTATOR_INTERVAL);
}, false);

VEX_DOM_EXTRAS_AR.addEventListener('change', event => {

  const state = event.target.checked;

  if(state == true){

    VEX_EXTRAS_AR_INTERVAL = setInterval(()=>{

      if(!_$(".container")[2].style.display){

        _$("button.continue").click();
        _$("button#play-button").click();
      }

    }, 500);

    return;
  }

  clearInterval(VEX_EXTRAS_AR_INTERVAL);
  VEX_EXTRAS_AR_INTERVAL = null;
}, false);

VEX_DOM_EXTRAS_SS.addEventListener('change', event => {

  const state = event.target.checked;

  if(state == true){

    VEX_EXTRAS_SS_INTERVAL = setInterval(()=>{

      if(!_$(".container")[2].style.display){

        _$("button.continue").click();
        _$("button#play-button").click();
      }

    }, 500);

    return;
  }

  clearInterval(VEX_EXTRAS_SS_INTERVAL);
  VEX_EXTRAS_SS_INTERVAL = null;
}, false);

const init = () => {

  VEX_DOM_HC.value = localStorage.getItem("vex-hc") || "";
  VEX_HUD_COLOR = VEX_DOM_HC.value;
  VEX_HUD_COLOR_FUNC();

  VEX_DOM_SKIN1.value = localStorage.getItem("vex-s1") || "";
  VEX_DOM_SKIN2.value = localStorage.getItem("vex-s2") || "";
  VEX_DOM_SKIN3.value = localStorage.getItem("vex-s3") || "";
  VEX_DOM_SKIN4.value = localStorage.getItem("vex-s4") || "";

  VEX_DOM_ROTATOR_STOP.click();

  VEX_DOM_EXTRAS_AR.checked = localStorage.getItem("vex-e-ar") || false;
  VEX_DOM_EXTRAS_SS.checked = localStorage.getItem("vex-e-ss") || false;
};



init();

}, 5000);
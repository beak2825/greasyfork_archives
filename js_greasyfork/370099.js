// ==UserScript==
// @name         Agar.io Train Line Controller
// @namespace    https://www.youtube.com/channel/UCMf28IHMkAhEGv6wnU34mvw
// @version      1.7.3
// @description  Script that allows you to make impossible lines and include custom configuration settings.
// @author       CeyHun
// @match        agar.io*
// @match        gota.io/web*
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/370099/Agario%20Train%20Line%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/370099/Agario%20Train%20Line%20Controller.meta.js
// ==/UserScript==
/*
MIT License

Copyright (c)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice (including the next paragraph)
shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var alertMessage = 'Train Line Controller ACTIVE!! \nPress  "OK"  to open the control panel \n\nVERSION : 1.7.3\n\nGood Luck :D';

//HTML Enabled.
let html = `
<div class="modal c" id="scrollbarr">
<div>
<span class="x">x</span>
<p class="title">TRAIN LINE CONTROLLER</p>
<button class="btns" onclick="openPage('Home')" id="firstPage">HOME</button>
<button class="btns" onclick="openPage('Theme')">THEME</button>
<button class="btns" onclick="openPage('Setup')">SETUP</button>
<button class="btns" onclick="openPage('About')">ABOUT</button>
<div id="Home" class="tabcont a c">
  <h1>Welcome To Train Line Script </h1>
  <h2 class="c-red c">What is Train Line Controller?</h2>
  <p> It is a script that allows you to split lines in all directions in similar games like agar io. </p>
  <h3 class="c-red c">How to use line</h3>
  <p>There are two options for this.</p>
  <p><b>Auto : </b>Press the key that you set on the setup page, then split.</p>
  <p><b>Manual :</b></p>
  <p>Step 1. Freeze your cell.</p>
  <p>Step 2. Press one of the line buttons specified during setup.(left,right,up,down lines)</p>
  <p>Step 3. SPLIT!</p>
  <p>You can look at the old tutorial video </br><a class="c" href="https://youtu.be/qevn6WdLfmg" target="_blank">HERE</a></p>
   <u>Do not move your mouse</u>
   <p><b>NOTE :</b> The corner lines are assigned a square coordinate value that you should try to verify as much as possible.
   this is often very difficult to do and you should constantly try to achieve it in the most perfect way.
   Good luck!</p>
</div>
<div id="Theme" class="tabcont a c">
<table>
<p>Background Color : <input type="color" value="#ffffff" id="bgcolor"></input></p>
<p>Backdrop Color : <input type="color" value="#000000" id="bdcolor"></input></p>
<p>Button Color : <input type="color" value="#000000" id="btncolor"></input></p>
<p>Border Color : <input type="color" value="#ffffff" id="bordercolor"></input></p>
<p>Text Color : <input type="color" value="#000000" id="textcolor"></input></p>
</br>
<button id="resettheme" class="btns">Reset</button>
</table>
</div>
<div id="Setup" class="tabcont a c">
<b style="margin-left: 475px; position: relative; top: 22px;">Control Panel</b>
<input class="selectt" id="control-panel" style="position: absolute; top: 47%; right: 50px;"></input>
  <h3 class="a" style="margin-left: 2px;">Agar.io</h3>
  <b style="float:left">Line Mode : <select id="linemod">
  <option value="manual">Manual</option>
  <option value="auto">Auto</option>
  </select></b>
  <table class="b" style="margin: auto; margin-right: 14px;">
  <tr>
  <th></th><th></th><th title="Click on the boxes and select the appropriate key.">Line Keys</th>
  </tr>
  <tr>
<td></td>
<td><input class="selectt" id="freeze-topleft"></input></td>
<td><input class="selectt" id="freeze-up"></input></td>
<td><input class="selectt" id="freeze-topright"></input></td>
</tr>
<tr>
<td></td>
<td><input class="selectt" id="freeze-left"></input></td>
<td><input class="selectt" id="freeze-middle"></input></td>
<td><input class="selectt" id="freeze-right"></input></td>
</tr>
<tr>
<td></td>
<td><input class="selectt" id="freeze-bottomleft"></input></td>
<td><input class="selectt" id="freeze-bottom"></input></td>
<td><input class="selectt" id="freeze-bottomright"></input></td>
</tr>
<tr>
<td colspan="2" style="padding: 10px 0;"></td>
</tr>
<tr>
<td><td><b>Gota.io</b></td></td>
<th></th><th>Feature</th>
<th>Macro Keys</th>
</tr>
<tr>
<td style="margin-right: 20px;">Diagonal Line :</td>
<td><input class="selectt" id="diagonal"></input></td>
<td></td>
<td><p>Feed Macro :</p></td>
<td><input class="selectt" id="feed"></input></td>
</tr>
<tr>
<td style="margin-right: 20px;">Diagonal Line (16x) :</td>
<td><input class="selectt" id="diagonalx16"></input></td>
<td></td>
<td><p>Double Split :</p></td>
<td><input class="selectt" id="double"></input></td>
</tr>
<tr>
<td><td><td></td></td></td>
<td><p>Triple Split :</p></td>
<td><input class="selectt" id="triple"></input></td>
</tr>
<tr>
<td><td><td></td></td></td>
<td>Quad Split :</td>
<td><input class="selectt" id="quad"></input></td>
</tr>
<tr>
<td><td><td></td></td></td>
<td>W Split (1x) :</td>
<td><input class="selectt" id="wsplit"></input></td>
</tr>
<tr>
<td><td><td></td></td></td>
<td>Backward </br> Double :</td>
<td><input class="selectt" id="backward"></input></td>
</tr>
<tr>
<td><td><td></td></td></td>
<td>Late Backward </br> Double Split :</td>
<td><input class="selectt" id="ltbackward"></input></td>
</tr>
<tr>
<td colspan="6" class="a">
<button class="btns" id="resetSetup">Reset</button>
</td>
</table>
</div>
<div id="About" class="tabcont a c">
<h1>CeyHun</h1>
</br>
<a href="https://youtube.com/c/CeyHun1" target="_blank"><button class="yt-btn">YouTube</button></a>
<p>Subscribe to my channel for support!</p>
</br>
<a href="https://github.com/CeyHun01/Agar.io-Train-Line-Controller" target="_blank">
  <button style="
    background-color: #24292e;
    color: white;
    padding: 4px 18px;
    font-size: 14px;
    border-radius: 4px;
    border: 1px solid #d1d5da;
    font-family: Segoe UI, Helvetica, Arial, sans-serif, Segoe UI Emoji;
    text-align: center;
    cursor: pointer;
  ">GitHub</button>
</a>
<p class="c" style="color: grey;">SCRIPT VERSION : 1.7.3</p>
</div>
</div>
</div>
<div id="backdrop" class="backdrop"></div>
`;
document.body.insertAdjacentHTML('beforeend', html);
//HTML Code End.

//CSS Enabled.

let styleElement = document.createElement('style');
styleElement.type = 'text/css';

let css = `
.btns,.modal {
    background: #fff;
    border: 3px solid #000
}

.modal {
    position: absolute;
    left: 50%;
    top: 50%;
    right: 50%;
    transform: translate(-50%,-50%);
    width: 680px;
    height: 435px;
    padding: 5px 10px 5px 30px;
    display: none;
    flex-direction: column;
    align-items: center;
    border-radius: 5px;
    margin: auto;
    overflow: auto;
    z-index: 999
}

.btns {
    color: inherit;
    font-family: arial;
    font-size: 20px;
    padding: 1px 43px;
    box-shadow: 0 0 0#000;
    transition: all .2s;
    cursor: pointer;
    outline: 0
}

.btns:last-child {
    margin: 0
}

.btns:hover {
    box-shadow: .4rem .4rem 0#000;
    transform: translate(-.4rem,-.4rem)
}

.btns:active {
    box-shadow: 0 0 0#000;
    transform: translate(0,0)
}

.tablink {
    background-color: #555;
    color: #fff;
    float: left;
    border: 0;
    outline: 0;
    cursor: pointer;
    padding: 14px 16px;
    font-size: 17px;
    width: 25%
}

.tablink:hover {
    background-color: #777
}

.tabcont {
    color: #000;
    display: none;
    padding: 25px 20px;
    height: 100%
}

.b {
    margin-left: 22px
}

.x {
    float: right;
    font-family: sans-serif;
    font-size: 20px;
    cursor: pointer;
    z-index: 9
}

.savebuton {
    background-color: green;
    border: solid 3px #000;
    color: #fff;
    padding: 5px 20px;
    font-size: 16px;
    cursor: pointer
}

.title {
    font-family: arial;
    font-size: 35px
}

.a,.title,.yt-btn {
    text-align: center
}

.yt-btn {
    background-color: #cc181e;
    items-size: 50px;
    color: #fff;
    padding: 4px 18px;
    border-radius: 1px;
    border: 0;
    font: 12px,Roboto,arial,sans-serif;
    cursor: pointer
}

.a {
    font-family: arial
}

.c-red {
    color: red
}

.selectt {
    text-align: center;
    text-align-last: center;
    width: 90px;
    height: 50px;
    font-size: 15px;
    margin: 10px;
    border: 1px solid #000;
    appearance: none
}

.backdrop {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #000;
    opacity: .6;
    width: 100%;
    height: 100%;
    display: none;
    z-index: 998
}

.selectt option {
    font-size: 18px
}
#scrollbarr::-webkit-scrollbar-button {
    display: none;
    height: 13px;
    border-radius: 0;
    background-color: #aaa
}

#scrollbarr::-webkit-scrollbar-button:hover {
    background-color: #aaa
}

#scrollbarr::-webkit-scrollbar-thumb,#scrollbarr::-webkit-scrollbar-thumb:hover {
    background-color: #ccc;
    border-radius: 9px
}

#scrollbarr::-webkit-scrollbar-track {
    background-color: #efefef
}

#scrollbarr::-webkit-scrollbar {
    width: 7px
}
`;
if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
} else {
    styleElement.appendChild(document.createTextNode(css));
}
document.getElementsByTagName('head')[0].appendChild(styleElement);

//CSS Code End.

//Keycodes mapping option
var inputs = document.querySelectorAll('input.selectt');
var keyMap = {
  'Numpad': 'Numpad ',
  'Arrow': 'Arrow ',
  'Digit': '',
  'Key': '',
  'Control': 'Ctrl',
  'Escape': 'Esc',
  'Minus': '-',
  'Equal': '=',
  'BracketLeft': '[',
  'BracketRight': ']',
  'Semicolon': ';',
  'Quote': "'",
  'Backquote': '`',
  'Backslash': '\\',
  'Comma': ',',
  'Period': '.',
  'Slash': '/',
  'Numpad Multiply': 'Numpad *',
  'Numpad Decimal': 'Numpad .',
  'Numpad Subtract': 'Numpad -',
  'Numpad Divide': 'Numpad /',
  'Numpad Add': 'Numpad +',
  'Numpad Equal': 'Numpad ='
};

inputs.forEach(input => {
  const id = input.id;
  input.addEventListener('keydown', event => {
    event.preventDefault();
    let key = event.code;
    const keyCode = event.keyCode;

    // Use the keyMap for replacements
    for (let mapKey in keyMap) {
      key = key.replace(new RegExp(mapKey, 'g'), keyMap[mapKey]);
    }

    if (keyCode === 32) {
      key = 'Space';
    }

    // Check if there is another key with the same input
    for (let otherInput of inputs) {
      if (otherInput !== input && otherInput.value === key) {
        alert('This key is already used by another input!');
        return;
      }
    }

    input.value = key;
    input.dataset.keyCode = keyCode;

    // If the key is deleted, also delete the values in localStorage
    if (key === '') {
        localStorage.removeItem(id + '-value');
        localStorage.removeItem(id + '-keyCode');
        delete keyCodes[id];
    } else {
        localStorage.setItem(id + '-value', key);
        localStorage.setItem(id + '-keyCode', keyCode);
        keyCodes[id] = keyCode;
    }

    if (event.key === 'Delete') {
      event.preventDefault();
      input.value = '';
      localStorage.removeItem(input.id + '-value');
      localStorage.removeItem(input.id + '-keyCode');
      delete keyCodes[input.id];
    }
  });
});

  var linemodSelect = document.getElementById("linemod");
  var linemod = localStorage.getItem("linemod");

//Input keycodes converting for switch-case, string to number
let keyCodes = {};
function convertKeyCodesToNumbers() {
  document.querySelectorAll(".selectt").forEach(function(input) {
    const id = input.id;
    const keyCode = input.dataset.keyCode;
  });
}

function saveKeyBindings() {
    document.querySelectorAll('input.selectt').forEach(function(input) {
        localStorage.setItem(input.id, input.value);
    });
}

function loadKeyBindings() {
  inputs.forEach(input => {
    const id = input.id;
    const savedValue = localStorage.getItem(id);
    if (savedValue) {
      input.value = savedValue;
    }
  });
}

let isGota;
window.onload = function() {
  var linemodSelect = document.getElementById("linemod");
  var linemod = localStorage.getItem("linemod");
    //Line Mod Select empty bug fix first time startup
    if (linemod == "" || linemod == null || !linemod) {
      linemod = "auto"
	  localStorage.setItem("linemod", linemod);
    }
  loadKeyBindings();
  linemodSelect.value = linemod;
  inputs.forEach(input => {
    const id = input.id;
    const savedValue = localStorage.getItem(id + '-value');
    const savedKeyCode = localStorage.getItem(id + '-keyCode');

    if (savedValue) {
      input.value = savedValue;
    }

    if (savedKeyCode) {
      input.dataset.keyCode = savedKeyCode;
      keyCodes[id] = Number(savedKeyCode);
    }
  });
  convertKeyCodesToNumbers();
  startlistenmouse();
  isGota = (window.location.host === "gota.io") ? true : false;
};
//Key Mapping End

//Theme,Keys,Listener Set Data
let elements = {
    textcolor: ['.c', 'color'],
    bordercolor: ['.modal,.btns,.selectt,.savebuton', 'borderColor'],
    btncolor: ['.btns', 'background-color'],
    bdcolor: ['.backdrop', 'background-color'],
    bgcolor: ['.modal', 'background-color']
};
let defaultValues = {
    bgcolor: "#ffffff",
    bdcolor: "#000000",
    btncolor: "#ffffff",
    bordercolor: "#000000",
    textcolor: "#000000"
};

if (linemodSelect) {
    linemodSelect.addEventListener('change', function() {
        linemod = this.value;
        localStorage.setItem("linemod", linemod);
    });
}

for (let id in elements) {
    let [selector, style] = elements[id];
    let value = localStorage.getItem(id);
    if (value) {
        let lems = document.querySelectorAll(selector);
        lems.forEach((lem) => {
            lem.style[style] = value;
        });
        document.getElementById(id).value = value;
    }

    document.getElementById(id).addEventListener('change', function() {
        let value = this.value;
        localStorage.setItem(id, value);
        let lems = document.querySelectorAll(selector);
        lems.forEach((lem) => {
            lem.style[style] = value;
        });
    });
}

inputs.forEach(function(input) {
    let id = input.id;
    let value = localStorage.getItem(id);
    if (value) {
        input.value = value;
    }

    input.addEventListener('blur', function() {
        window.addEventListener('keydown', keydown ,false);
        window.addEventListener('keyup', keyup ,false);
        convertKeyCodesToNumbers();
        saveKeyBindings();
        startlistenmouse();
    });

    input.addEventListener('focus', function() {
        window.removeEventListener('keydown', keydown ,false);
        window.removeEventListener('keyup', keyup ,false);
    });
});

document.querySelectorAll("#backdrop, .x").forEach(function(element) {
    element.addEventListener('click', function() {
        document.querySelector(".modal").style.display = "none";
        document.getElementById("backdrop").style.display = "none";
    });
});

document.getElementById("resettheme").addEventListener('click', function() {
    for (let id in defaultValues) {
        let elem = document.getElementById(id);
        if (elem) {
            elem.value = defaultValues[id];
            localStorage.setItem(id, defaultValues[id]);
        }

        let [selector, style] = elements[id];
        let value = defaultValues[id];
        let elems = document.querySelectorAll(selector);
        elems.forEach((elem) => {
            elem.style[style] = value;
        });
    }
});
// Setup reset button listener
document.getElementById('resetSetup').addEventListener('click', function() {
  inputs.forEach(input => {
    const id = input.id;
    input.value = '';
    localStorage.removeItem(id + '-value');
    localStorage.removeItem(id + '-keyCode');
    delete keyCodes[id];
  });
        convertKeyCodesToNumbers();
        saveKeyBindings();
        startlistenmouse();
});

//Browser resolution variables
var screenWidth, screenHeight, centerX, centerY, squareSize, halfSquareSize;

//Update the resolution variables when if first startup and/or browser size is changed
function updateScreenSize() {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;

    // Get Center of the screen
    centerX = screenWidth / 2;
    centerY = screenHeight / 2;

    squareSize = Math.min(screenWidth, screenHeight);
    halfSquareSize = squareSize / 2;
}
//Browser resolution calculating end

 //First startup needs setup
 updateScreenSize();

 //Browser Resolution change listener
 window.addEventListener("resize", function() {
    updateScreenSize();
});

document.openPage = function (pageName) {
  var i, tabcont;
  tabcont = document.getElementsByClassName("tabcont");
  for (i = 0; i < tabcont.length; i++) {
  tabcont[i].style.display = "none";
}
document.getElementById(pageName).style.display = "block";
}
document.getElementById("firstPage").click();
window.addEventListener('keydown', keydown ,false);
window.addEventListener('keyup', keyup ,false);

var EjectDn = false;
var wspeed = 10;
function keydown(event) {
var keys = event.keyCode;
 //Controls
  switch (keys) {
  case keyCodes['freeze-middle']:
    center();
    break;
  case keyCodes['freeze-left']:
    moveMouse(window.innerWidth / 3, window.innerHeight / 2);
    break;
  case keyCodes['freeze-right']:
    moveMouse(window.innerWidth / 1, window.innerHeight / 2);
    break;
  case keyCodes['freeze-bottom']:
    moveMouse(window.innerWidth / 2, window.innerHeight / 1);
    break;
  case keyCodes['freeze-up']:
    moveMouse(window.innerWidth / 2, window.innerHeight / 3);
    break;
  case keyCodes['freeze-topleft']:
    moveMouse(centerX - halfSquareSize, centerY - halfSquareSize);
    break;
  case keyCodes['freeze-topright']:
    moveMouse(centerX + halfSquareSize, centerY - halfSquareSize);
    break;
  case keyCodes['freeze-bottomright']:
    moveMouse(centerX + halfSquareSize, centerY + halfSquareSize);
    break;
  case keyCodes['freeze-bottomleft']:
    moveMouse(centerX - halfSquareSize, centerY + halfSquareSize);
    break;
  case keyCodes['diagonal']:
    if (isGota && document.getElementById("main").style.display == "none") {
    split(3);
    menu_off();
    block();
    setTimeout(() => {
      none();
      menu_on();
    }, 1050);
    }
    break;
  case keyCodes['diagonalx16']:
    if (isGota && document.getElementById("main").style.display == "none") {
    split(4);
    menu_off();
    block();
    setTimeout(() => {
      none();
      menu_on();
    }, 1050);
    }
    break;
  case keyCodes['feed']:
   if (EjectDn === false) {
    EjectDn = true;
    setTimeout(eject, wspeed);
   }
    break;
  case keyCodes['double']:
    split(2);
    break;
  case keyCodes['triple']:
    split(3);
    break;
  case keyCodes['quad']:
    split(4);
    break;
  case keyCodes['wsplit']:
    ww();
    setTimeout(function() { split(1); }, 5);
    break;
  case keyCodes['backward']:
    split(1);
    reverseMouse();
    split(1);
    break;
  case keyCodes['ltbackward']:
    split(2);
    setTimeout(reverseMouse, 300);
    break;
  case keyCodes['control-panel']:
    modalshow();
    break;
    }
}

function moveMouse(X, Y) {
  if (linemod == "manual") {
    $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
  }
  else {
    center();
    setTimeout(function() {
      $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
    }, 570);
  }
}

function center() {
    X = window.innerWidth / 2;
    Y = window.innerHeight / 2;
    $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
}

    function none() {
    document.getElementById("main").style.display = "none"
}
    function block() {
    document.getElementById("main").style.display = "block"
}
    function menu_on() {
    document.getElementById("main").style.zIndex = "2"
}
    function menu_off() {
    document.getElementById("main").style.zIndex = "-99"
}

var mouseX, mouseY;
var isListening = false;

function startlistenmouse() {
    var ltbackward = localStorage.getItem("ltbackward");
    var backward = localStorage.getItem("backward");
    if ((ltbackward == "" || ltbackward == null || !ltbackward) && (backward == "" || backward == null || !backward)) {
            return;
    }
    else if (!isListening){
        isListening = true;
    document.onmousemove = function(event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
    };
    }
}

function reverseMouse() {
  var reverseMouseX = centerX + (centerX - mouseX);
  var reverseMouseY = centerY + (centerY - mouseY);
  $("canvas").trigger($.Event("mousemove", {clientX: reverseMouseX, clientY: reverseMouseY}));
}

function split(repeat) {
  for (let i = 0; i < repeat; i++) {
    window.onkeydown({keyCode: 32});
    window.onkeyup({keyCode: 32});
  }
}

function ww() {
    window.onkeydown({keyCode: 87});
    window.onkeyup({keyCode: 87});
}
function keyup(event) {
  var feeding = document.getElementById("feed"),
     feed = feeding.value;
     if (event.keyCode == feed) {
     EjectDn = false;
    }
}
    function eject() {
    if (EjectDn) {
        window.onkeydown({keyCode: 87});
        window.onkeyup({keyCode: 87});
        setTimeout(eject, wspeed);
    }
}
    function modalshow() {
    document.querySelector(".modal").style.display = "block";
    document.querySelector("#backdrop").style.display = "block";
}

var controlPanelKey = localStorage.getItem('control-panel');

if (controlPanelKey == "" || controlPanelKey == null || !controlPanelKey) {
    var userResponse = confirm(alertMessage);
    if (userResponse) {
        modalshow();
    }
}
else {
    alertMessage = alertMessage.replace('OK', controlPanelKey);
    alert(alertMessage);
}

    //Train Line Controller By CeyHun 1.7.3
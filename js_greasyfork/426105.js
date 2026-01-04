// ==UserScript==
// @name       CPS & Clicks Panel
// @namespace    -
// @version    1.0
// @description  Adds a part of the keyboard to your screen. And your CPS
// @author       not me
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @match        *://moomoo.io/*
// @match        *://*.moomoo.io/*
// @grant        none
// @require https://greasyfork.org/scripts/368273-msgpack/code/msgpack.js?version=598723
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @require https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.0/jquery-confirm.min.js

// @downloadURL https://update.greasyfork.org/scripts/426105/CPS%20%20Clicks%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/426105/CPS%20%20Clicks%20Panel.meta.js
// ==/UserScript==
var FPS;
(function() {
    var UPDATE_DELAY = 700;

    var lastUpdate = 0;
    var frames = 0;

    function updateCounter() {
        var now = Date.now();
        var elapsed = now - lastUpdate;
        if (elapsed < UPDATE_DELAY) {
            ++frames;
        } else {
            FPS = Math.round(frames / (elapsed / 1000));
            frames = 0;
            lastUpdate = now;
        }

        requestAnimationFrame(updateCounter);
    }

    lastUpdate = Date.now();
    requestAnimationFrame(updateCounter);
})();
var Day,Month,Year
setInterval(() => {
    var Date2=new Date()
    Month = Date2.getUTCMonth() + 1; //months from 1-12
    Day = Date2.getUTCDate();
    Year = Date2.getUTCFullYear();
    fpsdiv.innerHTML = "FPS:" + FPS + ""
        +"<br>Clock: "+KFC+":"+MLC+":"+RLC
}, 0);

let fpsdiv = document.createElement("div");
fpsdiv.id = "test"
document.body.prepend(fpsdiv);
document.getElementById('test').style.color='red'
document.getElementById('test').style.fontSize='20px'
document.getElementById('test').style.position='absolute'
document.getElementById('test').style.textAlign='center'
document.getElementById('test').style.width='auto'
document.getElementById('test').style.height='auto'
document.getElementById('test').style.backgroundColor='rgba(0, 0, 0, 0.4)'
document.getElementById('test').style.padding='2px'
setTimeout(() => {
    document.getElementById('ot-sdk-btn-floating').remove();
    document.getElementById('pre-content-container').remove()
}, 5000)

var counter = 0;
window.addKey = async function () {
    let key = document.getElementById('newKey').value;
    if (document.getElementById(key)) return;
    let html = `<div id="${counter}" style="display: flex; position:
absolute;"><div id="${key.toLowerCase()}" class="keyDisplay"
style="width 80px; pointer-events: all; top: 0; left:
0;">${key.toUpperCase()}</div></div>`
  await document.getElementById('controlPanel').insertAdjacentHTML('afterend',
html)
    const thisDiv = document.getElementById(counter.toString());
    thisDiv.addEventListener('mousedown', function (e) {

        var prevX = e.clientX;
        var prevY = e.clientY;

        window.addEventListener('mousemove', mousemove);
        window.addEventListener('mouseup', mouseup);
        function mousemove(e) {
            let newX = prevX - e.clientX;
            let newY = prevY - e.clientY;


            const rect = thisDiv.getBoundingClientRect();

            thisDiv.style.left = rect.left - newX + 'px';
            thisDiv.style.top = rect.top - newY + 'px';

            prevX = e.clientX;
            prevY = e.clientY;
        }
        function mouseup() {
            window.removeEventListener('mousemove', mousemove);
            window.removeEventListener('mouseup', mouseup);
        }
    });
    counter++;
}
window.removeKey = function () {
    let key = document.getElementById('newKey').value;
    if (!document.getElementById(key)) return;
    document.getElementById(key).remove();
}


let DivHTML = `
<div id="controlPanel">
   <span style="margin: 15px; font-size: 18px; padding: 5px;
margin-top: 15px;">Toggle control pannel with...</span> <input
id='toggleKey' type='text' value="\\" maxlength="1" style="width:
40px; height: 15px; background: none; border: 2px solid white;
text-align: center; color: white;">
   </br>
   <input id="numsdisp" type="checkbox" name="nums" checked>
   <label for="nums">Display Numbers</label>
   </br>
   <input id="wasd" type="checkbox" name="wasd" checked>
   <label for="wasd">Display Movement Keys</label>
   </br>
   <input id="cpss" type="checkbox" name="cpss" checked>
   <label for="nums">Display CPS/Max CPS</label>
   </br>
   <input id="clickss" type="checkbox" name="clickss" checked>
   <label for="nums">Display Mouse Clicks</label>
   </br>
   <input id="newKey" maxlength="1" type="text" style="margin: 15px;
color: white; background: none; border: 2px solid white; height: 20px;
width: 40px; text-align: center;">
   &nbsp
   <button id="create" style="width: 100px; text-align: center; color:
white; background: none; border: 2px solid white; height: 25px;"
onclick="addKey()">Create New</button>
   &nbsp
   <button id="remove" style="width: 100px; text-align: center; color:
white; background: none; border: 2px solid white; height: 25px;"
onclick="removeKey()">Remove Key</button>
</div>
<div id="keys">
  <div class="keyDisplay" id="w">W</div>
  <div class="keyDisplay" id="a">A</div>
  <div class="keyDisplay" id="s">S</div>
  <div class="keyDisplay" id="d">D</div>
</div>
<div id="nums">
  <div class="keyDisplay" id="1">1</div>
  <div class="keyDisplay" id="2">2</div>
  <div class="keyDisplay" id="3">3</div>
  <div class="keyDisplay" id="4">4</div>
  <div class="keyDisplay" id="5">5</div>
  <div class="keyDisplay" id="6">6</div>
  <div class="keyDisplay" id="7">7</div>
  <div class="keyDisplay" id="8">8</div>
  <div class="keyDisplay" id="9">9</div>
</div>
<div id="cps">
  <div class="keyDisplay" id="Space" styles="margin-top: 40px;">________</div>
  &nbsp
  <div id="clicker">
    <div id="clickLeft"></div>
    <div id="clickRight"><div id="clickBottom"></div></div>
  </div>
</div>
<div id="cpsDisplay">
      <div id="cpsDivDisp" class="keyDisplay">CPS: 0</div>
      <div id="MaxCPS" class="keyDisplay">Max CPS: 0</div>
</div>
`

let styles = document.createTextNode(`
#controlPanel {
display: none;
color: white;
position: absolute;
width: 400px;
height: 275px;
background-color: rgba(0, 0, 0, 0.25);
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
border-radius: 3px;
pointer-events: all;
}
#nums {
display: flex;
flex-wrap: wrap;
align-content: start;
width: 400px;
position: absolute;
z-index: 15;
left: 237.391px;
top: 7.58%;
pointer-events: all;
}
#keys {
display: flex;
position: absolute;
z-index: 15;
pointer-events: all;
}
#cps {
position: absolute;
display: flex;
z-index: 15;
pointer-events: all;
top: 8%;
}
#cpsDisplay {
position: absolute;
z-index: 15;
pointer-events: all;
top: 15%;
}
.keyDisplay {
margin: 10px;
padding: 2px;
border: 2px solid white;
color: white;
height: 45px;
min-width: 80px;
max-width: 200px;
text-align: center;
font-size: 25px;
top: 50%;
line-height: 45px;
}
.keyDisplay.active {
color: black;
background: white;
}
#clicker {
display: flex;
}
#clickLeft {
width: 25px;
height: 50px;
border-top-left-radius: 100px;
border-top-right-radius: 5px;
border-bottom-left-radius: 5px;
border-bottom-right-radius: 5px;
border: 2px solid white;
margin-right: 10px;
}
#clickRight {
width: 25px;
height: 50px;
border-top-right-radius: 100px;
border-top-left-radius: 5px;
border-bottom-left-radius: 5px;
border-bottom-right-radius: 5px;
border: 2px solid white;
}
#clickBottom {
margin-top: 60px;
margin-left: -40px;
width: 62px;
height: 35px;
border-top-radius: 5px;
border-bottom-left-radius: 100px;
border-bottom-right-radius: 100px;
border: 2px solid white;
}
.active2 {
background: white;
}
`);
let css = document.createElement("style");
css.type = "text/css";
css.appendChild(styles);
document.body.appendChild(css);

document.getElementById("storeMenu").insertAdjacentHTML("beforebegin", DivHTML);

const cps = document.getElementById('cps');
const keys = document.getElementById('keys');
const cpsDisp = document.getElementById('cpsDisplay');
const nums = document.getElementById('nums');
const cvs = document.getElementById('gameCanvas');
const cpsDiv = document.getElementById('cpsDivDisp');
const maxCpsDiv = document.getElementById('MaxCPS');
const ctrlKey = document.getElementById('toggleKey');
const pannel = document.getElementById("controlPanel");
const numCheck = document.getElementById("numsdisp");
const wasd = document.getElementById("wasd");
const cpss = document.getElementById("cpss");
const clicks = document.getElementById("clicks");

var theCps = 0;
var maxCps = 0;
var keyDownLeft = false;
var keyDownRight = false;
var keyDownSpace = false;

function toggelPannel() {
    if (pannel.style.display == "" || pannel.style.display == "none") {
        pannel.style.display = "block";
    } else if (pannel.style.display == "block") {
        pannel.style.display = "none";
    }
}

document.addEventListener('keydown', function(e){
    let keyDiv;
    let key = ctrlKey.value.toLowerCase();
    if (ctrlKey.value == "") key = '//'
    if (e.key == key) toggelPannel();
    if (e.key == ' ') {
        keyDiv = document.getElementById("Space");
        if (!keyDownSpace) {
            theCps++
            setTimeout(function(){theCps--}, 1000);
            keyDownSpace = true;
        }
    } else {
        keyDiv = document.getElementById(e.key);
    }
    if (!keyDiv) return;
    keyDiv.classList.add('active');
});
document.addEventListener('keyup', function(e){
    let keyDiv;
    if (e.key == ' ') {
        keyDiv = document.getElementById("Space");
        keyDownSpace = false;
    } else {
        keyDiv = document.getElementById(e.key);
    }
    if (!keyDiv) return;
    keyDiv.classList.remove('active');
});

document.addEventListener('mousedown', function(e){
    let rightClick = false;
    if (e.button == 2) rightClick = true;
    if (!rightClick) {
        let click = document.getElementById('clickLeft');/*left click*/
        click.classList.add('active2');
        if (!keyDownLeft) {
            theCps++
            setTimeout(function(){theCps--}, 1000);
            keyDownLeft = true;
        }
    } else {
        let click = document.getElementById('clickRight'); /*right click*/
        click.classList.add('active2');
        if (!keyDownRight) {
            theCps++
            setTimeout(function(){theCps--}, 1000);
            keyDownRight = true;
        }
    }
})
document.addEventListener('mouseup', function(e){
    let rightClick = false;
    if (e.button == 2) rightClick = true;
    if (!rightClick) {
        let click = document.getElementById('clickLeft');
        click.classList.remove('active2');
        keyDownLeft = false;
    } else {
        let click = document.getElementById('clickRight');
        click.classList.remove('active2');
        keyDownRight = false;
    }
})
keys.addEventListener('mousedown', function (e) {

    let prevX = e.clientX;
    let prevY = e.clientY;

    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);
    function mousemove(e) {
        let newX = prevX - e.clientX;
        let newY = prevY - e.clientY;


        const rect = keys.getBoundingClientRect();

        keys.style.left = rect.left - newX + 'px';
        keys.style.top = rect.top - newY + 'px';

        prevX = e.clientX;
        prevY = e.clientY;
    }
    function mouseup() {
        window.removeEventListener('mousemove', mousemove);
        window.removeEventListener('mouseup', mouseup);
    }
});
cps.addEventListener('mousedown', function (e) {

    let prevX = e.clientX;
    let prevY = e.clientY;

    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);
    function mousemove(e) {
        let newX = prevX - e.clientX;
        let newY = prevY - e.clientY;


        const rect = cps.getBoundingClientRect();

        cps.style.left = rect.left - newX + 'px';
        cps.style.top = rect.top - newY + 'px';

        prevX = e.clientX;
        prevY = e.clientY;
    }
    function mouseup() {
        window.removeEventListener('mousemove', mousemove);
        window.removeEventListener('mouseup', mouseup);
    }
});
cpsDisp.addEventListener('mousedown', function (e) {

    let prevX = e.clientX;
    let prevY = e.clientY;

    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);
    function mousemove(e) {
        let newX = prevX - e.clientX;
        let newY = prevY - e.clientY;


        const rect = cpsDisp.getBoundingClientRect();

        cpsDisp.style.left = rect.left - newX + 'px';
        cpsDisp.style.top = rect.top - newY + 'px';

        prevX = e.clientX;
        prevY = e.clientY;
    }
    function mouseup() {
        window.removeEventListener('mousemove', mousemove);
        window.removeEventListener('mouseup', mouseup);
    }
});
nums.addEventListener('mousedown', function (e) {

    let prevX = e.clientX;
    let prevY = e.clientY;

    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);
    function mousemove(e) {
        let newX = prevX - e.clientX;
        let newY = prevY - e.clientY;


        const rect = nums.getBoundingClientRect();

        nums.style.left = rect.left - newX + 'px';
        nums.style.top = rect.top - newY + 'px';

        prevX = e.clientX;
        prevY = e.clientY;
    }
    function mouseup() {
        window.removeEventListener('mousemove', mousemove);
        window.removeEventListener('mouseup', mouseup);
    }
});

setInterval(() => {
    if (theCps > maxCps) maxCps = theCps;
    maxCpsDiv.innerText = `Max CPS: ${maxCps}`;
    cpsDiv.innerText = `CPS: ${theCps}`
    if (!numCheck.checked && nums.style.display == "flex") {
        nums.style.display = "none"
    } else if (numCheck.checked && nums.style.display != "flex") {
        nums.style.display = "flex"
    }
    if (!wasd.checked && keys.style.display == "flex") {
        keys.style.display = "none"
    } else if (wasd.checked && keys.style.display != "flex") {
        keys.style.display = "flex"
    }
    if (!cpss.checked && cpsDisp.style.display == "block") {
        cpsDisp.style.display = "none"
    } else if (cpss.checked && cpsDisp.style.display != "block") {
        cpsDisp.style.display = "block"
    }
    if (!clickss.checked && cps.style.display == "flex") {
        cps.style.display = "none"
    } else if (clickss.checked && cps.style.display != "flex") {
        cps.style.display = "flex"
    }
}, 0)
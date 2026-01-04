// ==UserScript==
// @name       CPS, keyboard panel and click panel
// @namespace  https://greasyfork.org/es/users/805514
// @version    1.0
// @description  adds part of the keyboard to your screen. And your CPS
// @author       Zyenth
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @match        *://moomoo.io/*
// @match        *://*.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541354/CPS%2C%20keyboard%20panel%20and%20click%20panel.user.js
// @updateURL https://update.greasyfork.org/scripts/541354/CPS%2C%20keyboard%20panel%20and%20click%20panel.meta.js
// ==/UserScript==
/* jshint esversion:8 */
!(function () {
   var e = 0,
      t = 0;

   function i() {
      var s = Date.now(),
         d = s - e;
      d < 700 ? ++t : ((FPS = Math.round(t / (d / 1e3))), (t = 0), (e = s)),
         requestAnimationFrame(i);
   }
   (e = Date.now()), requestAnimationFrame(i);
})(),
setInterval(() => {
   var e = new Date();
   (Month = e.getUTCMonth() + 1),
   (Day = e.getUTCDate()),
   (Year = e.getUTCFullYear()),
   (fpsdiv.innerHTML =
      "FPS: " + FPS + "<br>Clock: " + KFC + ":" + MLC + ":" + RLC);
}, 0);
let fpsdiv = document.createElement("div");
(fpsdiv.id = "test"),
document.body.prepend(fpsdiv),
   (document.getElementById("test").style.color = "red"),
   (document.getElementById("test").style.fontSize = "20px"),
   (document.getElementById("test").style.position = "absolute"),
   (document.getElementById("test").style.textAlign = "center"),
   (document.getElementById("test").style.width = "auto"),
   (document.getElementById("test").style.height = "auto"),
   (document.getElementById("test").style.backgroundColor =
      "rgba(0, 0, 0, 0.4)"),
   (document.getElementById("test").style.padding = "2px"),
   setTimeout(() => {
      document.getElementById("ot-sdk-btn-floating").remove(),
         document.getElementById("pre-content-container").remove();
   }, 5e3);
var FPS,
   Day,
   Month,
   Year,
   counter = 0;
(window.addKey = async function () {
   let e = document.getElementById("newKey").value;
   if (document.getElementById(e)) return;
   await document.getElementById("controlPanel").insertAdjacentHTML(
      "afterend",
      `<div id="${counter}" style="display: flex; position: absolute;" ><div id="${e.toLowerCase()}" class="keyDisplay" style="width: 80px; pointer-events: all; top: 0; left: 0;" >${e.toUpperCase()}</div></div>`
   );
   let t = document.getElementById(counter.toString());
   t.addEventListener("mousedown", function (e) {
         var i = e.clientX,
            s = e.clientY;

         function d(e) {
            let d = i - e.clientX,
               l = s - e.clientY,
               n = t.getBoundingClientRect();
            (t.style.left = n.left - d + "px"),
            (t.style.top = n.top - l + "px"),
            (i = e.clientX),
            (s = e.clientY);
         }

         function l() {
            window.removeEventListener("mousemove", d),
               window.removeEventListener("mouseup", l);
         }
         window.addEventListener("mousemove", d),
            window.addEventListener("mouseup", l);
      }),
      counter++;
}),
(window.removeKey = function () {
   let e = document.getElementById("newKey").value;
   document.getElementById(e) && document.getElementById(e).remove();
});
let DivHTML = ` <div id="controlPanel"><span style="margin: 15px; font-size: 18px; padding: 5px; margin-top: 15px;">Toggle control panel with...</span><input id='toggleKey' type='text' value="\\" maxlength="1" style="width: 40px; height: 15px; background: none; border: 2px solid white; text-align: center; color: white;"></br><input id="wasd" type="checkbox" name="wasd" checked><label for="wasd">Display Movement Keys</label></br><input id="cpss" type="checkbox" name="cpss" checked><label for="nums">Display CPS/Max CPS</label></br><input id="clickss" type="checkbox" name="clickss" checked><label for="nums">Display Mouse Clicks</label></br><input id="newKey" maxlength="1" type="text" style="margin: 15px; color: white; background: none; border: 2px solid white; height: 20px; width: 40px; text-align: center;"><button id="create" style="width: 100px; text-align: center; color: white; background: none; border: 2px solid white; height: 25px;" onclick="addKey()">Create New</button><button id="remove" style="width: 100px; text-align: center; color: white; background: none; border: 2px solid white; height: 25px;" onclick="removeKey()">Remove Key</button></div>
<div id="numberRow">
    <div class="keyDisplay" id="1">1</div>
    <div class="keyDisplay" id="2">2</div>
    <div class="keyDisplay" id="3">3</div>
    <div class="keyDisplay" id="4">4</div>
    <div class="keyDisplay" id="5">5</div>
    <div class="keyDisplay" id="6">6</div>
    <div class="keyDisplay" id="7">7</div>
    <div class="keyDisplay" id="8">8</div>
    <div class="keyDisplay" id="9">9</div>
    <div class="keyDisplay" id="0">0</div>
</div>
<div id="keys">
    <div class="keyDisplay" id="q">Q</div>
    <div class="keyDisplay" id="w">W</div>
    <div class="keyDisplay" id="e">E</div>
    <div class="keyDisplay" id="r">R</div>
    <div class="keyDisplay" id="t">T</div>
    <div class="keyDisplay" id="y">Y</div>
    <div class="keyDisplay" id="u">U</div>
    <div class="keyDisplay" id="i">I</div>
    <div class="keyDisplay" id="o">O</div>
    <div class="keyDisplay" id="p">P</div>
</div>
<div id="secondRow">
    <div class="keyDisplay" id="a">A</div>
    <div class="keyDisplay" id="s">S</div>
    <div class="keyDisplay" id="d">D</div>
    <div class="keyDisplay" id="f">F</div>
    <div class="keyDisplay" id="g">G</div>
    <div class="keyDisplay" id="h">H</div>
    <div class="keyDisplay" id="j">J</div>
    <div class="keyDisplay" id="k">K</div>
    <div class="keyDisplay" id="l">L</div>
</div>
<div id="thirdRow">
    <div class="keyDisplay" id="z">Z</div>
    <div class="keyDisplay" id="x">X</div>
    <div class="keyDisplay" id="c">C</div>
    <div class="keyDisplay" id="v">V</div>
    <div class="keyDisplay" id="b">B</div>
    <div class="keyDisplay" id="n">N</div>
    <div class="keyDisplay" id="m">M</div>
</div>
<div id="cps">
    <div class="keyDisplay" id="Space">_____</div>
    <div id="clicker">
        <div id="clickLeft"></div>
        <div id="clickRight">
            <div id="clickBottom"></div>
        </div>
    </div>
</div>
<div id="cpsDisplay">
    <div id="cpsDivDisp" class="keyDisplay">CPS: 0</div>
    <div id="MaxCPS" class="keyDisplay">Max CPS: 0</div>
</div>`,
   styles = document.createTextNode(` #controlPanel {
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

    #numberRow {
        display: flex;
        flex-wrap: nowrap;
        align-content: start;
        width: 400px;
        position: absolute;
        z-index: 15;
        left: 10px;
        top: 10px;
        pointer-events: all;
    }

    #keys {
        display: flex;
        flex-wrap: nowrap;
        align-content: start;
        width: 400px;
        position: absolute;
        z-index: 15;
        left: 10px;
        top: 60px;
        pointer-events: all;
    }

    #secondRow {
        display: flex;
        flex-wrap: nowrap;
        align-content: start;
        width: 400px;
        position: absolute;
        z-index: 15;
        left: 10px;
        top: 110px;
        pointer-events: all;
    }

    #thirdRow {
        display: flex;
        flex-wrap: nowrap;
        align-content: start;
        width: 400px;
        position: absolute;
        z-index: 15;
        left: 35px;
        top: 160px;
        pointer-events: all;
    }

    #cps {
        position: absolute;
        display: flex;
        z-index: 15;
        pointer-events: all;
        top: 210px;
    }

    #cpsDisplay {
        position: absolute;
        z-index: 15;
        pointer-events: all;
        top: 40%;
    }

    .keyDisplay {
        margin: 5px;
        padding: 2px;
        border: 2px solid white;
        color: white;
        height: 40px;
        min-width: 50px;
        max-width: 100px;
        text-align: center;
        font-size: 17px;
        top: 50%;
        line-height: 40px;
    }

    .keyDisplay.active {
        color: black;
        background: white;
    }

    #clicker {
        display: flex;
    }

    #clickLeft {
        width: 20px;
        height: 40px;
        border-top-left-radius: 100px;
        border-top-right-radius: 5px;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        border: 2px solid white;
        margin-right: 10px;
    }

    #clickRight {
        width: 20px;
        height: 40px;
        border-top-right-radius: 100px;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        border: 2px solid white;
    }

    #clickBottom {
        margin-top: 48px;
        margin-left: -25px;
        width: 40px;
        height: 20px;
        border-top-radius: 5px;
        border-bottom-left-radius: 100px;
        border-bottom-right-radius: 100px;
        border: 2px solid white;
    }

    .active2 {
        background: white;
    }

    `),
   css = document.createElement("style");
(css.type = "text/css"),
css.appendChild(styles),
   document.body.appendChild(css),
   document
   .getElementById("storeMenu")
   .insertAdjacentHTML("beforebegin", DivHTML);
const keys = document.getElementById("keys"),
   secondRow = document.getElementById("secondRow"),
   thirdRow = document.getElementById("thirdRow"),
   numberRow = document.getElementById("numberRow"),
   cps = document.getElementById("cps"),
   cpsDisp = document.getElementById("cpsDisplay"),
   cpsDiv = document.getElementById("cpsDivDisp"),
   maxCpsDiv = document.getElementById("MaxCPS"),
   wasd = document.getElementById("wasd"),
   cpss = document.getElementById("cpss"),
   clicks = document.getElementById("clickss");
var theCps = 0,
   maxCps = 0,
   keyDownLeft = false,
   keyDownRight = false,
   keyDownSpace = false;

function displayControlPanel() {
   let e = document.getElementById("controlPanel");
   "none" === e.style.display ?
      (e.style.display = "block") :
      (e.style.display = "none");
}
document.addEventListener("keydown", function (e) {
      let t;
      " " === e.key ?
         ((t = document.getElementById("Space")),
            keyDownSpace ||
            (theCps++,
               setTimeout(function () {
                  theCps--;
               }, 1e3),
               (keyDownSpace = true))) :
         (t = document.getElementById(e.key.toLowerCase())),
         t && t.classList.add("active");
   }),
   document.addEventListener("keyup", function (e) {
      let t;
      " " === e.key ?
         ((t = document.getElementById("Space")), (keyDownSpace = false)) :
         (t = document.getElementById(e.key.toLowerCase())),
         t && t.classList.remove("active");
   }),
   document.addEventListener("mousedown", function (e) {
      let t = false;
      (2 === e.button && (t = true), t) ?
      (document.getElementById("clickRight").classList.add("active2"),
         keyDownRight ||
         (theCps++,
            setTimeout(function () {
               theCps--;
            }, 1e3),
            (keyDownRight = true))) :
      (document.getElementById("clickLeft").classList.add("active2"),
         keyDownLeft ||
         (theCps++,
            setTimeout(function () {
               theCps--;
            }, 1e3),
            (keyDownLeft = true)));
   }),
   document.addEventListener("mouseup", function (e) {
      let t = false;
      (2 === e.button && (t = true), t) ?
      (document.getElementById("clickRight").classList.remove("active2"),
         (keyDownRight = false)) :
      (document.getElementById("clickLeft").classList.remove("active2"),
         (keyDownLeft = false));
   }),
   setInterval(function () {
      (cpsDiv.innerHTML = "CPS: " + theCps),
      (maxCpsDiv.innerHTML = "Max CPS: " + maxCps),
      theCps > maxCps && (maxCps = theCps);
   }, 100),
   document
   .getElementById("toggleKey")
   .addEventListener("keydown", function (e) {
      "\\" === e.key && displayControlPanel();
   }),
   document.getElementById("toggleKey").addEventListener("keyup", function (e) {
      "\\" === e.key && displayControlPanel();
   }),
   false === wasd.checked &&
   ((keys.style.display = "none"),
      (secondRow.style.top = "10px"),
      (thirdRow.style.top = "60px"),
      (numberRow.style.top = "110px")),
   wasd.addEventListener("change", function () {
      false === wasd.checked ?
         ((keys.style.display = "none"),
            (secondRow.style.top = "10px"),
            (thirdRow.style.top = "60px"),
            (numberRow.style.top = "110px")) :
         ((keys.style.display = "flex"),
            (secondRow.style.top = "60px"),
            (thirdRow.style.top = "110px"),
            (numberRow.style.top = "10px"));
   }),
   false === cpss.checked &&
   ((cps.style.display = "none"), (cpsDisp.style.top = "15%")),
   cpss.addEventListener("change", function () {
      false === cpss.checked ?
         ((cps.style.display = "none"), (cpsDisp.style.top = "15%")) :
         ((cps.style.display = "flex"), (cpsDisp.style.top = "40%"));
   }),
   false === clickss.checked &&
   (document.getElementById("clicker").style.display = "none"),
   clickss.addEventListener("change", function () {
      false === clickss.checked ?
         (document.getElementById("clicker").style.display = "none") :
         (document.getElementById("clicker").style.display = "flex");
   });
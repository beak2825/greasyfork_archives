// ==UserScript==
// @name         Neptune Macros (ALL JS!!)
// @namespace    http://aslxcoder.glitch.me/
// @version      V1.1
// @description  Currently, A good Sploop.io Script to be in Greasyfork!
// @author       naggets
// @license MIT
// @match        https://sploop.io/*
// @require        http://code.jquery.com/jquery-3.3.1.min.js
// @require        https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sploop.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496872/Neptune%20Macros%20%28ALL%20JS%21%21%29.user.js
// @updateURL https://update.greasyfork.org/scripts/496872/Neptune%20Macros%20%28ALL%20JS%21%21%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
document.querySelector("link[rel='icon']").href = "https://i.imgur.com/ytddtwh.png";
// currently, all of these settings don't work or aren't being used, I will update

var ping = true;
const traps = true;
const heal = true;
const spike = true;
let fps = {
    old: Date.now(),
    count: 0,
    result: null,
    updateTime: 750
}
function updateFPS() {
    let newDate = Date.now(),
        lastDate = newDate - fps.old
    if (lastDate < fps.updateTime) ++fps.count
    else {
        fps.result = Math.round(fps.count / (lastDate / 1000))
        if ($('#ping').css('display') == 'inline-flex') $("#ping > i").text('Ping: ' + (window.pingTime != undefined ? window.pingTime : 0))
        $("#fps > i").text('Fps: ' + fps.result)
        fps.count = 0
        fps.old = newDate
    }
    requestAnimationFrame(updateFPS)
}
requestAnimationFrame(updateFPS)


let modmenuthing = `
<div class="modalert">
<span class="fp" style="width: calc(100% - 10px); height: 40px; padding: 0;"><i>Using : <h2 class="rainbow">Neptune v1</h2></i></span><br>
<span class="fp" id="fps" style="margin-left: 75px; width: 135px; height: 40px; padding: 0;"><i>Fps: 0</i></span>
</div>

<style>
.modsettings {
  position: absolute;
  bottom: 50px;
  right: 20px;
}
.modalert {
  position: absolute;
  top: 20px;
  left: 20px;
}
.rainbow{
		animation: rainbow 5.5s linear;
		animation-iteration-count: infinite;
}
@keyframes rainbow-bg{
		100%,0%{
			background-color: rgb(255,0,0);
		}
		8%{
			background-color: rgb(255,127,0);
		}
		16%{
			background-color: rgb(255,255,0);
		}
		25%{
			background-color: rgb(127,255,0);
		}
		33%{
			background-color: rgb(0,255,0);
		}
		41%{
			background-color: rgb(0,255,127);
		}
		50%{
			background-color: rgb(0,255,255);
		}
		58%{
			background-color: rgb(0,127,255);
		}
		66%{
			background-color: rgb(0,0,255);
		}
		75%{
			background-color: rgb(127,0,255);
		}
		83%{
			background-color: rgb(255,0,255);
		}
		91%{
			background-color: rgb(255,0,127);
		}
}

@keyframes rainbow{
		100%,0%{
			color: rgb(255,0,0);
		}
		8%{
			color: rgb(255,127,0);
		}
		16%{
			color: rgb(255,255,0);
		}
		25%{
			color: rgb(127,255,0);
		}
		33%{
			color: rgb(0,255,0);
		}
		41%{
			color: rgb(0,255,127);
		}
		50%{
			color: rgb(0,255,255);
		}
		58%{
			color: rgb(0,127,255);
		}
		66%{
			color: rgb(0,0,255);
		}
		75%{
			color: rgb(127,0,255);
		}
		83%{
			color: rgb(255,0,255);
		}
		91%{
			color: rgb(255,0,127);
		}
}
.fp {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 8px;
  padding-right: 2px;
  border-radius: 10px;
  margin: 5px 5px;
  width: 60px;
  height: 60px;
  background: linear-gradient(180deg, rgba(41, 41, 41, 0.69), rgba(33, 33, 33, 0.54));
  box-shadow: inset -8px 0 8px rgba(0,0,0,.15), inset 0px -8px 8px rgba(0,0,0,.25), 0 0 0 2px rgba(0,0,0,.75), 10px 20px 25px rgba(0, 0, 0, .4);
  overflow: hidden;
}
</style>
`
$('body').append(modmenuthing)

    let SploopStyle = `
    <style>
    .chat-container input {
    color: yellow;
    text-align: center;
    background-color: #000000ba;
    box-shadow: none;
    width: 315px;
    }
    #play:hover {
    box-shadow: none;
    }
    #play {
    box-shadow: none;
    }
    .background-img-play {
    display: none;
    }
    .game-mode {
    box-shadow: none;
    }
    .dark-blue-button-3-active:hover {
    box-shadow: none;
    }
    .dark-blue-button:hover {
    box-shadow: none;
    }
    #nickname {
    background: #484c52;
    text-align: center;
    color: #9ab3ff;
    width:  340px;
    }
    .input {
    box-shadow: none;
    color: white;
    }
    .menu .content .menu-item {
    }
    #main-content {
    width: auto;
    }
    #hat-menu {
    }
    #hat_menu_content {
    padding: initial;
    }
    .menu .content .menu-item {
    border: none !important;
    }
    #server-select {
    width: 340px;
    }q
    #game-middle-main {
    height: 310px;
    }
    #homepage {
    background-image: url('') !important;
    }
    </style>
    `;
    $("body").append(SploopStyle)

let maingui = `
<div class="modsettings" id="mod">
    <input type="checkbox" id="hp2" class="ui-checkbox" onclick="hp()" checked> <label class="text">Show hitboxes</label>


</div>
    </body>
<style>

    .text {
        font-size: x-large

    }
    .modsettings {
        position: relative;
        top: 400px;
left: 1000px;
border-radius: 25px;
        width: 250px;
       height: 290px;
       background: #2919b6;
        border: 6px solid rgb(16, 29, 84);
    }
    /* checkbox settings 👇 */

.ui-checkbox {
  --primary-color: #1677ff;
  --secondary-color: #fff;
  --primary-hover-color: #4096ff;
  /* checkbox */
  --checkbox-diameter: 20px;
  --checkbox-border-radius: 5px;
  --checkbox-border-color: #d9d9d9;
  --checkbox-border-width: 1px;
  --checkbox-border-style: solid;
  /* checkmark */
  --checkmark-size: 1.2;
}

.ui-checkbox,
.ui-checkbox *,
.ui-checkbox *::before,
.ui-checkbox *::after {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.ui-checkbox {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: var(--checkbox-diameter);
  height: var(--checkbox-diameter);
  border-radius: var(--checkbox-border-radius);
  background: var(--secondary-color);
  border: var(--checkbox-border-width) var(--checkbox-border-style) var(--checkbox-border-color);
  -webkit-transition: all 0.3s;
  -o-transition: all 0.3s;
  transition: all 0.3s;
  cursor: pointer;
  position: relative;
}

.ui-checkbox::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  -webkit-box-shadow: 0 0 0 calc(var(--checkbox-diameter) / 2.5) var(--primary-color);
  box-shadow: 0 0 0 calc(var(--checkbox-diameter) / 2.5) var(--primary-color);
  border-radius: inherit;
  opacity: 0;
  -webkit-transition: all 0.5s cubic-bezier(0.12, 0.4, 0.29, 1.46);
  -o-transition: all 0.5s cubic-bezier(0.12, 0.4, 0.29, 1.46);
  transition: all 0.5s cubic-bezier(0.12, 0.4, 0.29, 1.46);
}

.ui-checkbox::before {
  top: 40%;
  left: 50%;
  content: "";
  position: absolute;
  width: 4px;
  height: 7px;
  border-right: 2px solid var(--secondary-color);
  border-bottom: 2px solid var(--secondary-color);
  -webkit-transform: translate(-50%, -50%) rotate(45deg) scale(0);
  -ms-transform: translate(-50%, -50%) rotate(45deg) scale(0);
  transform: translate(-50%, -50%) rotate(45deg) scale(0);
  opacity: 0;
  -webkit-transition: all 0.1s cubic-bezier(0.71, -0.46, 0.88, 0.6),opacity 0.1s;
  -o-transition: all 0.1s cubic-bezier(0.71, -0.46, 0.88, 0.6),opacity 0.1s;
  transition: all 0.1s cubic-bezier(0.71, -0.46, 0.88, 0.6),opacity 0.1s;
}

/* actions */

.ui-checkbox:hover {
  border-color: var(--primary-color);
}

.ui-checkbox:checked {
  background: var(--primary-color);
  border-color: transparent;
}

.ui-checkbox:checked::before {
  opacity: 1;
  -webkit-transform: translate(-50%, -50%) rotate(45deg) scale(var(--checkmark-size));
  -ms-transform: translate(-50%, -50%) rotate(45deg) scale(var(--checkmark-size));
  transform: translate(-50%, -50%) rotate(45deg) scale(var(--checkmark-size));
  -webkit-transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46) 0.1s;
  -o-transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46) 0.1s;
  transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46) 0.1s;
}

.ui-checkbox:active:not(:checked)::after {
  -webkit-transition: none;
  -o-transition: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  transition: none;
  opacity: 1;
}

</style>
`
//$('body').append(maingui) // currently a WIP, still making this

    const enhanceFillRect = function (fill, cColor) {
        return function (x, y, width, height) {
            if (this.fillStyle === "#a4cc4f") {
                this.fillStyle = cColor;
            }
            fill.call(this, x, y, width, height);
        };
    };

    const customColor = "#397bed";
    const FillRect = CanvasRenderingContext2D.prototype.fillRect;

    CanvasRenderingContext2D.prototype.fillRect = enhanceFillRect(FillRect, customColor);

    CanvasRenderingContext2D.prototype.fillText = new Proxy(CanvasRenderingContext2D.prototype.fillText, {
    apply: function (target, thisArg, argumentsList) {
        thisArg.lineWidth = 8;
        thisArg.strokeStyle = "black";
        thisArg.strokeText.apply(thisArg, argumentsList);
        return target.apply(thisArg, argumentsList);
      }
    });

let hp2 = document.getElementById('hp2');
var text = document.getElementById("trueorfalse");

        function blur() {
      const homepage = document.getElementById("homepage");
      homepage.style.display = "flex";
    // -/ | \- Set a fixed blur value -/ | \-
      const blurValue = 1.5;
      homepage.style.backdropFilter = `blur(${blurValue}px)`;
      }
    setTimeout(blur, 2000);
    const grid = document.querySelector('#grid-toggle');
    const pingshw = document.querySelector('#display-ping-toggle');
    grid.click();
    pingshw.click();


function togglevisui() {
    var GUI = document.getElementById('mod');
    if (GUI.style.display == "none") {
        GUI.style.display = "block";
    } else {
        GUI.style.display = "none";
    }
}


addEventListener("keydown", function(event){
    //do something on keydown
    if(event.keyCode==27){
        togglevisui()
     //enter key was pressed
    }
});

    // Your code here...
    function createKeyboardEvent(type, code) {
        return new Proxy(new KeyboardEvent(type), {
            get(target, prop) {
                if (prop === "isTrusted") return true;
                if (prop === "target") return document.body;
                if (prop === "code") return code;
                return target[prop];
            }
        })
    }
        function keypress(code) {
        const keydown = createKeyboardEvent("keydown", code);
        const keyup = createKeyboardEvent("keyup", code);
        window.onkeydown(keydown);
        window.onkeyup(keyup);
    }
        function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
document.addEventListener(
  "keydown",
  function(event) {
      const melee = "1"
      const autoeat = "q"
      const mills = "6"
      const click = "Space"
    if (event.key === 'q') {
        setTimeout(() => {

        keypress(autoeat);
                keypress(click);
}, "5")
                  if (event.repeat) {
                              setTimeout(() => {

        keypress(autoeat);

}, "5")
         };
    };

//PLACE A TRAP
           if (event.key === 'f') {
        setTimeout(() => {

        keypress(click);
}, "5")};
                 if (event.key === 'v') {
        setTimeout(() => {

        keypress(click);
}, "5")};
                       if (event.key === 'r') {
        setTimeout(() => {

        keypress(click);
}, "5")};
                 if (event.key === '6') {
                     keypress(mills)
        setTimeout(() => {

        keypress(click);
}, "5")};
  });
})();





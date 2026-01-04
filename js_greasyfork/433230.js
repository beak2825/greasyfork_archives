// ==UserScript==
// @name         Chrome Dino Hacks
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Saves Data, Invincibility Toggle, More To Come! Esc To Show/Hide Cheats
// @author       You
// @match        https://chromedino.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433230/Chrome%20Dino%20Hacks.user.js
// @updateURL https://update.greasyfork.org/scripts/433230/Chrome%20Dino%20Hacks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();
checkCookie();
window.original = Runner.prototype.gameOver
var cheats = `<label class="switch" id="cheats" onclick="setTimeout(()=>{ if (document.getElementById('invincible').checked == true){ Runner.prototype.gameOver = function (){}; } else { Runner.prototype.gameOver = original; }}, 100)">
  <input type="checkbox" id="invincible">
  <span class="slider round">Invincible</span>
</label>
<style>/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}</style>`

var sts = document.createElement("DIV");
sts.innerHTML = cheats;
sts.setAttribute("class", "flex-around key-category-box")
sts.style = "margin-top:10px;"
document.getElementById("main-frame-error").appendChild(sts)

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires;
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function toggleCookie(cname) {
  setCookie(cname, 1 - getCookie(cname), 365);
}

function checkCookie() {
  let user = getCookie("High Score");
  if (user != "" && user != undefined) {
    Runner.instance_.distanceMeter.highScore = JSON.parse(getCookie("High Score"));
  } else {
    setCookie("High Score", "['10', '11', '', '0', '0', '0', '4', '6']", 365);
  }
  let user2 = getCookie("Highest Score");
  if (user2 != "" && user2 != undefined) {
    Runner.instance_.highestScore = getCookie("Highest Score")
  } else {
    setCookie("Highest Score", Runner.instance_.highestScore, 365);
  }
  let user22 = getCookie("showcheats");
  if (user22 != "" && user22 != undefined) {
  } else {
    setCookie("showcheats", 0, 365);
  }
}

document.addEventListener("keydown", (e) => {
    if (e.key == "Escape") {
        toggleCookie("showcheats")
    }
});

setInterval(()=>{
            if(Runner.instance_.distanceMeter.highScore !== undefined && Runner.instance_.distanceMeter.highScore !== null) {if(getCookie("High Score") !== Runner.instance_.distanceMeter.highScore) {
                var json_str = JSON.stringify(Runner.instance_.distanceMeter.highScore);
                setCookie("High Score", json_str, 365);
            }
            }
    if(getCookie("Highest Score") !== Runner.instance_.highestScore) {
                setCookie("Highest Score", Runner.instance_.highestScore, 365);
            }
    if(getCookie("showcheats") == 1) {
                document.getElementById("cheats").setAttribute("style", "display: none;");
            } else { document.getElementById("cheats").setAttribute("style", ""); };

}, 100);

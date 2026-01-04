// ==UserScript==
// @name         zombs.io mobile controls
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  Good luck getting it running on your phone or tablet. ;)
// @author       L O L O L
// @match        zombs.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429580/zombsio%20mobile%20controls.user.js
// @updateURL https://update.greasyfork.org/scripts/429580/zombsio%20mobile%20controls.meta.js
// ==/UserScript==
let g = game;
function financial(x) {
  return Number.parseFloat(x).toFixed();
}
document.querySelectorAll('.ad-unit').forEach(function(a) {
    a.remove();
});
document.getElementsByClassName("hud-menu-shop")[0].style.width = "600px";
document.getElementsByClassName("hud-menu-shop")[0].style.height = "420px";
document.getElementsByClassName("hud-menu-shop")[0].style.margin = "-270px 0 0 -300px";
document.getElementsByClassName("hud-menu-shop")[0].style.padding = "20px 20px 20px 20px";
document.getElementsByClassName("hud-shop-grid")[0].style.height = "300px";


    function go_full_screen(){
      var elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      }
    }
document.getElementsByClassName("hud-intro-play")[0].addEventListener("click", function () {
go_full_screen()
})
document.getElementById("stats").style.display = "block";
setInterval(() => {
document.getElementById("stats").innerHTML = `${financial(g.metrics.metrics.currentFps) + " fps; " + financial(g.metrics.metrics.currentPing) + " ms"}`
}, 1e3);
document.getElementsByClassName("hud-top-center")[0].innerHTML = `
<button id="up" class="btn btn-green" style="width: 23%; height: 60px; border:2px solid white; background-color: transparent">W</button>
<button id="left" class="btn btn-green" style="width: 23%; height: 60px; border:2px solid white; background-color: transparent">A</button>
<button id="down" class="btn btn-green" style="width: 23%; height: 60px; border:2px solid white; background-color: transparent">S</button>
<button id="right" class="btn btn-green" style="width: 23%; height: 60px; border:2px solid white; background-color: transparent">D</button>
<button id="click" class="btn btn-green" style="width: 97%; height: 60px; border:2px solid white; background-color: transparent">Click</button>
<br>
`
document.getElementsByClassName("hud-settings-grid")[0].innerHTML = `
<button onclick="window.display();" class="btn btn-green" style="width: 45%; height: 70px">Display Metrics</button>
<button onclick="window.stopDisplaying();" class="btn btn-red" style="width: 45%; height: 70px">Stop Displaying Metrics</button>
`
window.up = () => {
g.network.sendInput({up: 1})
}
window.left = () => {
g.network.sendInput({left: 1})
}
window.down = () => {
g.network.sendInput({down: 1})
}
window.right = () => {
g.network.sendInput({right: 1})
}
window.click = () => {
g.inputPacketScheduler.scheduleInput({space: 1})
g.inputPacketScheduler.scheduleInput({space: 0})
g.inputPacketScheduler.scheduleInput({space: 0})
}
let button25e950 = document.getElementById("up");
button25e950.addEventListener("click", startup);
button25e950.addEventListener("click", stopup);
var up = null;
function startup() {
    clearInterval(up);
    if (up !== null) {
        up = null;
    } else {

        up = setInterval(function() {
            window.up();
        });
    }
}
function stopup() {
    var trade = document.getElementById("up");
    if (trade.innerHTML == "W") {
        trade.innerHTML = "!W";
        trade.className = "btn btn-red";
    } else {
        trade.innerHTML = "W";
        trade.className = "btn btn-green";
        g.network.sendInput({up: 0})
    }
}
let button25e960 = document.getElementById("left");
button25e960.addEventListener("click", startleft);
button25e960.addEventListener("click", stopleft);
var left = null;
function startleft() {
    clearInterval(left);
    if (left !== null) {
        left = null;
    } else {

        left = setInterval(function() {
            window.left();
        });
    }
}
function stopleft() {
    var trade = document.getElementById("left");
    if (trade.innerHTML == "A") {
        trade.innerHTML = "!A";
        trade.className = "btn btn-red";
    } else {
        trade.innerHTML = "A";
        trade.className = "btn btn-green";
        g.network.sendInput({left: 0})
    }
}
let button25e970 = document.getElementById("down");
button25e970.addEventListener("click", startdown);
button25e970.addEventListener("click", stopdown);
var down = null;
function startdown() {
    clearInterval(down);
    if (down !== null) {
        down = null;
    } else {

        down = setInterval(function() {
            window.down();
        });
    }
}
function stopdown() {
    var trade = document.getElementById("down");
    if (trade.innerHTML == "S") {
        trade.innerHTML = "!S";
        trade.className = "btn btn-red";
    } else {
        trade.innerHTML = "S";
        trade.className = "btn btn-green";
        g.network.sendInput({down: 0})
    }
}
let button25e980 = document.getElementById("right");
button25e980.addEventListener("click", startright);
button25e980.addEventListener("click", stopright);
var right = null;
function startright() {
    clearInterval(right);
    if (right !== null) {
        right = null;
    } else {

        right = setInterval(function() {
            window.right();
        });
    }
}
function stopright() {
    var trade = document.getElementById("right");
    if (trade.innerHTML == "D") {
        trade.innerHTML = "!D";
        trade.className = "btn btn-red";
    } else {
        trade.innerHTML = "D";
        trade.className = "btn btn-green";
        g.network.sendInput({right: 0})
    }
}
let button25e990 = document.getElementById("click");
button25e990.addEventListener("click", startclick);
button25e990.addEventListener("click", stopclick);
var click = null;
function startclick() {
    clearInterval(click);
    if (click !== null) {
        click = null;
    } else {

        click = setInterval(function() {
            window.click();
        });
    }
}
function stopclick() {
    var trade = document.getElementById("click");
    if (trade.innerHTML == "Click") {
        trade.innerHTML = "!Click";
        trade.className = "btn btn-red";
    } else {
        trade.innerHTML = "Click";
        trade.className = "btn btn-green";
        g.inputPacketScheduler.scheduleInput({space: 1})
    }
}
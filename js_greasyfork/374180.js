// ==UserScript==
// @name         Mass Macro, Double Split, Triple Split, Quadruple Split, Freeze, FPS Counter, Auto-Respawn
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Mass Macro - W(Hold), 2xSplit - 2, 3xSplit - 3, 4xSplit - 4, Freeze Movement - S, Hold ESC in Stats screen to Auto-Respawn.
// @author       Dropped Studios
// @match        http://abs0rb.me/*
// @match        http://agarx.biz/*
// @match        http*://agar.io/*
// @match        http://agarabi.com/*
// @match        http://agarly.com/*
// @match        http://en.agar.bio/*
// @match        http://agar.pro/*
// @match        http://agario.se/*
// @match        http://agar.biz/*
// @match        http://bubble.am/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/374180/Mass%20Macro%2C%20Double%20Split%2C%20Triple%20Split%2C%20Quadruple%20Split%2C%20Freeze%2C%20FPS%20Counter%2C%20Auto-Respawn.user.js
// @updateURL https://update.greasyfork.org/scripts/374180/Mass%20Macro%2C%20Double%20Split%2C%20Triple%20Split%2C%20Quadruple%20Split%2C%20Freeze%2C%20FPS%20Counter%2C%20Auto-Respawn.meta.js
// ==/UserScript==
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
var Feed = false;
var autoSplit = false;
var respawn = false;
var Duration = 5;
var showFps = true;
var autoCoinsActive = false;
var lastLoop = new Date();
let fpsBox = document.createElement("div");
var i;
for (let i=1; i<10; i++) {
    setTimeout( function timer(){
        eventFire(document.getElementById('statsContinue'), 'click');
    }, i*1000 );
}
const hsl = hue => `hsl(${hue},100%,50%)`;
// ** FPS
fpsBox.style = `
	position: absolute;
	top: 0px;
	left: 0px;
	color: black;
	background: white;
	font-family: 'Ubuntu', monospace;
	font-weight: 400;
`;
document.body.appendChild(fpsBox);
let frames = 0;
setInterval(() => {
    var thisLoop = new Date();
    var fps = 1000 / (thisLoop - lastLoop);
    lastLoop = thisLoop;
    if(autoCoinsActive) {
	fpsBox.textContent = frames + " FPS - AutoCoins Active";
    }else {
    fpsBox.textContent = frames + " FPS";
    }
    if(frames < 60) {
    fpsBox.style.background = hsl(frames * 2);
} else {
    fpsBox.style.background = hsl(120);
}
	frames = 0;
}, 1E3);
const clearRectOld = CanvasRenderingContext2D.prototype.clearRect;
CanvasRenderingContext2D.prototype.clearRect = function() {
	if (this.canvas === window.canvas) {
		++frames;
	}
	return clearRectOld.apply(this, arguments);
};

var instructions = document.getElementById("instructions");
instructions.style.lineHeight = "1";
instructions.style.fontSize = "12.5px";
instructions.style.marginTop = "-30px";
instructions.innerHTML += "<center><span class='text-muted'><span> Press <b>4</b> to split 4x</span></span></center>" +
	"<center><span class='text-muted'><span> Press <b>3</b> to split 3x</span></span></center>" +
	"<center><span class='text-muted'><span> Press <b>2</b> to split 2x</span></span></center>" +
	"<center><span class='text-muted'><span> Press and hold <b>W</b> for macro feed</span></span></center>" +
	"<center><span class='text-muted'><span> Press <b>S</b> to freeze movement</span></span></center>";
function keydown(event) {
    if (event.keyCode == 69) {
        if(autoCoinsActive) {
            autoCoinsActive = false;
        }else {
            autoCoinsActive = true;
        }
    }
    if (event.keyCode == 27) {
        respawn = true;
        setTimeout(escPlay, Duration);
    }
    showFps = false;
    if (event.keyCode == 32) {
        autoSplit = false;
        setTimeout(autoSplitFunc, Duration);
    }
    if (event.keyCode == 87) {
        Feed = true;
        setTimeout(giveMass, Duration);
    }
    // Quad Split \/
    if (event.keyCode == 52) {
        Split();
        setTimeout(Split, Duration);
        setTimeout(Split, Duration*2);
        setTimeout(Split, Duration*3);
    }
    // Triple Split \/
    if (event.keyCode == 51) {
        Split();
        setTimeout(Split, Duration);
        setTimeout(Split, Duration*2);
    }
    // Double Split \/
    if (event.keyCode == 50) {
        Split();
        setTimeout(Split, Duration);
    }
    //Freeze \/
    if (event.keyCode == 83) {
        X = window.innerWidth/2;
        Y = window.innerHeight/2;
        $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
    }
}
function keyup(event) {
    showFps = true;
    if (event.keyCode == 87) {
        Feed = false;
    }
    if (event.keyCode == 32) {
        autoSplit = false;
    }
    if (event.keyCode == 27) {
        respawn = false;
    }
}
//Mass Macro \/
function giveMass() {
    if (Feed) {
        window.onkeydown({keyCode: 87});
        window.onkeyup({keyCode: 87});
        setTimeout(giveMass, Duration);
    }
}
function autoSplitFunc() {
    if (autoSplit) {
        window.onkeydown({keyCode: 32});
        window.onkeyup({keyCode: 32});
        setTimeout(autoSplitFunc, 50);
    }
}
function escPlay() {
    if (respawn) {
        eventFire(document.getElementById('play'), 'click');
        setTimeout(escPlay, Duration);
    }
}
function Split() {
    $("body").trigger($.Event("keydown", { keyCode: 32}));
    $("body").trigger($.Event("keyup", { keyCode: 32}));
}
function eventFire(el, etype){
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}

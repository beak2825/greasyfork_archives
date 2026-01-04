// ==UserScript==
// @name         Script for Bubble.am by without kit
// @namespace    http://tampermonkey.net/
// @version      3.6
// @license      without.kit
// @description  Scripts for bubble.am
// @author       kowadl0
// @match        http://bubble.am/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/377858/Script%20for%20Bubbleam%20by%20without%20kit.user.js
// @updateURL https://update.greasyfork.org/scripts/377858/Script%20for%20Bubbleam%20by%20without%20kit.meta.js
// ==/UserScript==
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
var Feed = false;
var autoSplit = false;
var respawn = false;
var Duration = 5;
var showFps = true;
var FpsBoxActive = false;
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
	background: red;
	font-family: 'Ubuntu', monospace;
	font-weight: 400;
`;
document.body.appendChild(fpsBox);
let frames = 0;
setInterval(() => {
    var thisLoop = new Date();
    var fps = 1000 / (thisLoop - lastLoop);
    lastLoop = thisLoop;
    if(FpsBoxActive) {
	fpsBox.textContent = frames + " FPS";
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
instructions.style.marginTop = "-10px";
instructions.innerHTML +=	"<center><span class='text-muted'><span> Press <b>7</b> to split 7x</span></span></center>" +
    "<center><span class='text-muted'><span> Press <b>6</b> to split 6x</span></span></center>" +
    "<center><span class='text-muted'><span> Press <b>5</b> to split 5x</span></span></center>" +
    "<center><span class='text-muted'><span> Press <b>4</b> to split 4x</span></span></center>" +
	"<center><span class='text-muted'><span> Press <b>3</b> to split 3x</span></span></center>" +
	"<center><span class='text-muted'><span> Press <b>2</b> to split 2x</span></span></center>" +
	"<center><span class='text-muted'><span> Press <b>W</b> to fast eject mass</span></span></center>" +
	"<center><span class='text-muted'><span> Press <b>S</b> to stop</span></span></center>"+
	"<center><span class='text-muted'><span> <b>NEWS!</b> </span></span></center>"+
	"<center><span class='text-muted'><span> <b>Added jump x7</b> </span></span></center>"+
	"<center><span class='text-muted'><span> <b>version: 3.6</b> </span></span></center>"+
	"<center><span class='text-muted'><span> <b>Recommend this script to your friends!</b> </span></span></center>";
function keydown(event) {
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
    // Monster Split \/
    if (event.keyCode == 54) {
        Split();
        setTimeout(Split, Duration);
        setTimeout(Split, Duration*2);
        setTimeout(Split, Duration*3);
        setTimeout(Split, Duration*4);
        setTimeout(Split, Duration*5);
    }
    // HightMonster Split \/
    if (event.keyCode == 55) {
        Split();
        setTimeout(Split, Duration);
        setTimeout(Split, Duration*2);
        setTimeout(Split, Duration*3);
        setTimeout(Split, Duration*4);
        setTimeout(Split, Duration*5);
        setTimeout(SPlit, Duration*6);
    }
    // Penta Split \/
    if (event.keyCode == 53) {
        Split();
        setTimeout(Split, Duration);
        setTimeout(Split, Duration*2);
        setTimeout(Split, Duration*3);
        setTimeout(Split, Duration*4);
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
// ==UserScript==
// @name         Sandbox hacks without wasm Hook!!!
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  sad emoji :(
// @author       MI300#4401
// @match        https://diep.io/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459731/Sandbox%20hacks%20without%20wasm%20Hook%21%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/459731/Sandbox%20hacks%20without%20wasm%20Hook%21%21%21.meta.js
// ==/UserScript==
    var x;
    var y;
    var angle = 0
    var inUpgrade = false;
	var effective = false;
	var frameRequest;

	var canvas = window.document.getElementById("canvas");

	var mouseX;
	var mouseY;
	var artificialMouseMove = false;

	var disabled = false;
    var guiX;
    var guiY;


	function onMouseMove(e){
        guiX = e.clientX;
        guiY = e.clientY;
		if(effective){
			if(!artificialMouseMove){
				e.stopPropagation();
				mouseX = e.clientX;
				mouseY = e.clientY;
			}
		}else{
			mouseX = e.clientX;
			mouseY = e.clientY;
		}
	}

	function update(_a){
		frameRequest = window.requestAnimationFrame(update);

		if(effective){

            console.log(angle)//0.7853981633974483 45 degrees                Math.PI                          2.356194490192345 135 degrees
if (!inUpgrade) {
			var cx = window.innerWidth / 2;
			var cy = window.innerHeight / 2;
			var sin = Math.sin(angle);
			var cos = Math.cos(angle);

			 x = mouseX - cx;
		     y = mouseY - cy;
			var _x = cos * x - sin * y;
			var _y = sin * x + cos * y;
			x = _x + cx;
			y = _y + cy;
}

			artificialMouseMove = true;
			canvas.dispatchEvent(new MouseEvent("mousemove", {clientX: x, clientY: y}));
			artificialMouseMove = false;
		}
	}
		window.addEventListener("mousemove", onMouseMove, true);
		frameRequest = window.requestAnimationFrame(update);
var modes = ['Gunner Trapper', 'Deathstar', 'Tri-Flank', 'TwinTriplet'];
var pos = 0;
var currentMode = 'Gunner Trapper';
function changeMode(){
  pos = pos + 1;
  currentMode = modes[Math.abs(pos) % modes.length];
}
var currentTank = '';

var isActive = false;
var currentXY = [0, 0];
    CanvasRenderingContext2D.prototype.fillText = new Proxy(CanvasRenderingContext2D.prototype.fillText, {

        apply(fillRect, ctx, [text, x, y, ...blah]) {


            if (text.startsWith('Gunner Trapper')){ currentXY = [x, y]};


            fillRect.call(ctx, text, x, y, ...blah);

        }

    });
function mainLoop() {
    if (!isActive) return;
    if (currentMode == 'Gunner Trapper') {
    if (currentTank.includes('Trapper')) {

    angle = Math.PI
    setTimeout(()=>{input.keyDown(67); input.keyUp(67)},10);
    setTimeout(()=>{angle = 0},20);
    setTimeout(()=>{inUpgrade = true},24);
    setTimeout(()=>{x = 150},26);
    setTimeout(()=>{y = 100},26);
    setTimeout(()=>{canvas.dispatchEvent(new MouseEvent("mousedown", {clientX: 150, clientY: 100}))},30);
    setTimeout(()=>{canvas.dispatchEvent(new MouseEvent("mouseup", {clientX: 150, clientY: 100}))},30);
    setTimeout(()=>{inUpgrade = false},100);
    setTimeout(()=>{angle = 0},110);
    setTimeout(()=>{input.keyDown(67); input.keyUp(67)},120);
    }
    setTimeout(() => {
        if (currentTank.includes('Gunner Trapper')) input.keyDown(220); input.keyUp(220);
    },170);
    } else if (currentMode == 'Deathstar') {
        if (currentTank.includes('Quad Tank')) {
        inUpgrade = true;
        input.keyDown(67);
        input.keyUp(67);
        x = 45;
        y = 100;
        canvas.dispatchEvent(new MouseEvent("mousedown", {clientX: x, clientY: y}));
        canvas.dispatchEvent(new MouseEvent("mouseup", {clientX: x, clientY: y}));
        setTimeout(()=>{
        x = mouseX
        y = mouseY
        input.keyDown(67);
        input.keyUp(67);
        inUpgrade = false;
        }, 20);
        }
    setTimeout(() => {
        if (currentTank.includes('Octo Tank')) input.keyDown(220); input.keyUp(220);
    },150);

    } else if (currentMode == 'Tri-Flank') {
        if (currentTank.includes('Flank Guard')) {
        inUpgrade = true;
        input.keyDown(67);
        input.keyUp(67);
        x = 45;
        y = 100;
        canvas.dispatchEvent(new MouseEvent("mousedown", {clientX: x, clientY: y}));
        canvas.dispatchEvent(new MouseEvent("mouseup", {clientX: x, clientY: y}));
        setTimeout(()=>{
        x = mouseX
        y = mouseY
        input.keyDown(67);
        input.keyUp(67);
        inUpgrade = false;
        }, 20);
        }
    setTimeout(() => {
        if (currentTank.includes('Tri-Angle')) input.keyDown(220); input.keyUp(220);
    },150);
    } else if (currentMode == 'TwinTriplet') {


        if(currentTank.includes('Triple Twin')) return; // make sure the thing doesn't do anything at triple twin



        if (currentTank.includes('Triplet')) {
            setTimeout(()=>{input.keyDown(220); input.keyUp(220)},50);
        }
    if (currentTank.includes('Twin')) {
        setTimeout(()=>{
        inUpgrade = true;
        input.keyDown(67);
        input.keyUp(67);
        x = 45;
        y = 100;
        canvas.dispatchEvent(new MouseEvent("mousedown", {clientX: x, clientY: y}));
        canvas.dispatchEvent(new MouseEvent("mouseup", {clientX: x, clientY: y}));
        setTimeout(()=>{
        x = mouseX
        y = mouseY
        input.keyDown(67);
        input.keyUp(67);
        inUpgrade = false;
        }, 20);
        },200);
        }
        setTimeout(()=>{
            if (currentTank.includes('Triple Shot')) input.keyDown(220); input.keyUp(220);
        },325);
    } else if (currentMode == 'Bomber') {
        if (currentTank.includes('Machine Gun')) {

        // upgrade
        }
        if (currentTank.includes('Destroyer')) {
            // switch tank
        }
    }
}





document.addEventListener('keydown', (kc) => {
    effective = true;
    if (kc.keyCode == 88) isActive = !isActive;
    if (kc.keyCode == 80) changeMode();
});
    CanvasRenderingContext2D.prototype.fillText = new Proxy(CanvasRenderingContext2D.prototype.fillText, {

        apply(fillRect, ctx, [text, x, y, ...blah]) {


            if (text.startsWith('Lvl ')){ currentTank = text}


            fillRect.call(ctx, text, x, y, ...blah);

        }

    });


setInterval(mainLoop, 500);
const ctx = canvas.getContext("2d");
setTimeout(() => {
    let gui = () => {
        ctx.fillStyle = "dark blue";
        ctx.lineWidth = 4;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "blue";
        ctx.strokeText('Current Mode: ' + currentMode, 100, 300);
        ctx.fillText('Current Mode: ' + currentMode, 100, 300);
        window.requestAnimationFrame(gui);
    }
    gui();
setInterval(gui,1000)
}, 1000);
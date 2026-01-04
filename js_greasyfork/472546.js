// ==UserScript==
// @name        Improved Bullet Stacking By Mekhi Maragh
// @include	    *://arras.io/*
// @author      Mekhi MAragh
// @description Makes some tanks more powerful (Tri-angle branch, spread shot, penta shot, octo tank, gunner trapper, streamliner).
// @connect	    arras.io
// @namespace   aaa
// @version 69
// @downloadURL https://update.greasyfork.org/scripts/472546/Improved%20Bullet%20Stacking%20By%20Mekhi%20Maragh.user.js
// @updateURL https://update.greasyfork.org/scripts/472546/Improved%20Bullet%20Stacking%20By%20Mekhi%20Maragh.meta.js
// ==/UserScript==
 
/*
How to Use:
Press Shift+R to cycle through the tanks.
Press Shift+Q to disable/enable the script.
Press I to hide the dialog. (The script remains functional, though).
Hold rightclick to activate . For best results, leave autofire off for a bit before doing so.
If necessary, press Shift+M to re-calibrate the script. Wait for the ms to stabilise.
Note: This calibration may break for Triple Twin, and is unnecessary for Streamliner.
*/
(function(){//info
	if(window.updateInfo) return;
 
 
	var info = {};
	var info_container = document.createElement("div");
	info_container.style.position = "fixed";
	info_container.style.color = "blue";
	info_container.style["pointer-events"] = "none";
	document.body.appendChild(info_container);
 
	function toggle_info_container(e){
		if(e.key == "i"){
			info_container.style.display = info_container.style.display=="block" ? "none" : "block";
		}
	}
	window.addEventListener("keyup", toggle_info_container);
 
	window.updateInfo = function(key, value){
		if(!value) delete info[key];
		else info[key] = value;
		var s = "";
		for(var _key in info){
			s += info[_key] + "\n";
		}
		info_container.innerText = s;
	};
})();
 
function MeasureCycle(){
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var real_arc = ctx.arc;
	var real_setTransform = ctx.setTransform;
 
	var a;
	var tx = 0, ty = 0;
	var a11 = 1;
 
	var state = false;
	var found = false;
	var inA = null;
	var direction = 1;
 
	var frameRequest;
	var intervalEMA = null; // ms
 
	function arc(){
		real_arc.apply(ctx, arguments);
 
		if(!found){
			var aimX = window.innerWidth / 2 + 50 * direction;
			var aimY = window.innerHeight / 2;
			found = (tx - a11 < aimX) && (tx + a11 > aimX) && (ty - a11 < aimY) && (ty + a11 > aimY);
		}
	}
 
	function setTransform(b11, b12, b21, b22, bx, by){
		real_setTransform.apply(ctx, arguments);
		tx = bx, ty = by, a11 = b11;
	}
 
	function onFrame(_a){
		frameRequest = window.requestAnimationFrame(onFrame);
		a = _a;
		if(!state && found){
			if(inA){
				var da = a - inA;
				inA = a;
				intervalEMA = intervalEMA ? 0.8 * intervalEMA + 0.2 * da : da;
				window.updateInfo && window.updateInfo(
					"intervalEMA",
					"Fire Period: " + intervalEMA.toString().substr(0, 5) + "ms"
				);
 
			}else{
				inA = a;
			}
		}
		state = found;
		found = false;
	}
 
	function onMouseEvent(e){
		e.stopPropagation();
	}
 
	this.start = function(_direction){
		_direction = _direction || 1;
		direction = _direction > 0 ? 1 : -1;
		inA = null;
		intervalEMA = null;
		state = found = false;
 
		ctx.setTransform = setTransform;
		ctx.arc = arc;
 
		var aimX = window.innerWidth / 2 + 50 * direction;
		var aimY = window.innerHeight / 2;
		canvas.dispatchEvent(new MouseEvent("mousemove", {clientX: aimX, clientY: aimY}));
		canvas.dispatchEvent(new MouseEvent("mousedown", {clientX: aimX, clientY: aimY}));
 
		window.addEventListener("mousemove", onMouseEvent, true);
		window.addEventListener("mouseup", onMouseEvent, true);
		window.addEventListener("mousedown", onMouseEvent, true);
		frameRequest = window.requestAnimationFrame(onFrame);
 
		window.updateInfo && window.updateInfo("measuring", "Measuring...");
	}
 
	this.terminate = function(){
		ctx.setTransform = real_setTransform;
		ctx.arc = real_arc;
 
		window.removeEventListener("mousemove", onMouseEvent, true);
		window.removeEventListener("mousedown", onMouseEvent, true);
		window.removeEventListener("mouseup", onMouseEvent, true);
		window.cancelAnimationFrame(frameRequest);
 
		canvas.dispatchEvent(new MouseEvent("mouseup", {clientX: 10, clientY: 10}));
 
		window.updateInfo && window.updateInfo("measuring", null);
		return intervalEMA;
	}
};
 
(function(){
	var cycleRate = 0.003125; // ms^-1
	var maxAngle = Math.PI * 45 / 180;
    var secAngle = 0;
    var cycleCounter = 1;
	var NCANNON = 3;
	var angleUnit = maxAngle / (NCANNON - 1);
    var secUnit = secAngle;
    var ax30945=1;
    var sec=false;
	var tankData = [
        {name: "Tri-angle Stack", cycleRate: 0.003125, maxAngle: Math.PI * 150 / 180, secondaryAngle: Math.PI * 150 / 180, NCANNON: 2},
        {name: "Fighter Stack", cycleRate: 0.003135, maxAngle: Math.PI * 90 / 175, secondaryAngle: Math.PI/2, NCANNON: 2},
        {name: "bycycle's retarded script", cycleRate: 0.003125, maxAngle: Math.PI, secondaryAngle: Math.PI, NCANNON: 2},
		{name: "Penta Stack broken", cycleRate: 0.003125, maxAngle: Math.PI/4, secondaryAngle: Math.PI/4, NCANNON: 3},
		{name: "Spread Stack boken", cycleRate: 0.001555, maxAngle: Math.PI * 75 / 180, secondaryAngle: Math.PI * 75 / 180, NCANNON: 6},
		{name: "Octo Stack", cycleRate: 0.003125, maxAngle: Math.PI/4, secondaryAngle: Math.PI/4, NCANNON: 2},
        {name: "GunnerTrapper",cycleRate: 0.0125, maxAngle: Math.PI, secondaryAngle: Math.PI, NCANNON: 2},
        {name: "Streamliner Spread", cycleRate: 0.0625, maxAngle: Math.PI * 15 / 180, secondaryAngle: Math.PI * 15 / 180, NCANNON: 3},
        {name: "random spinny flick shit idk", cycleRate: 0.001, maxAngle: 0, secondaryAngle: 0, NCANNON: 2},
	];
	var tankIndex = 0;
 
	var measure = new MeasureCycle();
	var measuring = false;
 
	var effective = false;
	var frameRequest;
    var toggle1 = true;
    var toggle2 = false;
	var canvas = window.document.getElementById("canvas");
 
	var mouseX;
	var mouseY;
	var a = 0;
	var startA = 0;
	var artificialMouseMove = false;
 
	var disabled = false;
	function onMouseDown(e){
		if(e.button == 2){
            sec=false;
			if(!effective){
				startA = a - 25;
				mouseX = e.clientX;
				mouseY = e.clientY;
				canvas.dispatchEvent(new MouseEvent("mousedown", {clientX: mouseX, clientY: mouseY}));
			}
			effective = true;
                    cycleCounter=0;
		}
	}
 
	function onMouseUp(e){
		if(e.button == 2){
			if(effective){
				canvas.dispatchEvent(new MouseEvent("mouseup", {clientX: mouseX, clientY: mouseY}));
			}
			effective = false;
		}
	}
 
	function onMouseMove(e){
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
		a = _a;
 
		if(effective){
			var da = a - startA;
			var state = Math.floor(cycleRate * da * NCANNON) % (NCANNON * 2);
			var state1 = state % NCANNON;
			var state2 = Math.floor(state / NCANNON);
            var remainder=cycleRate*da*NCANNON-Math.floor(cycleRate*da*NCANNON);
			var angle = angleUnit * state1 * ax30945;
            var angle2 = secUnit * state1 * ax30945;
			var cx = window.innerWidth / 2;
			var cy = window.innerHeight / 2;
			window.updateInfo && window.updateInfo("reeeee", remainder);
 
            if (toggle2 && state1==0) {
                toggle2=false;
                cycleCounter++;
            }
            if (state1!=0) toggle2=true;
            if (cycleCounter%3==2) angle=angle2;
            //if (remainder>0.5) angle=0;
            //if (cycleCounter%2==1) angle=-angle;
			var sin = Math.sin(angle);
			var cos = Math.cos(angle);
 
			var x = mouseX - cx;
			var y = mouseY - cy;
			var _x = cos * x - sin * y;
			var _y = sin * x + cos * y;
			x = _x + cx;
			y = _y + cy;
 
			artificialMouseMove = true;
			canvas.dispatchEvent(new MouseEvent("mousemove", {clientX: x, clientY: y}));
			artificialMouseMove = false;
		} else {
            var data = tankData[tankIndex];
            if (data.name=="random spinny flick shit idk") {
                da = a - startA;
			state = Math.floor(0.01 * da * 4) % (4 * 2);
			 state1 = state % 4;
			 state2 = Math.floor(state / 4);
			 angle = Math.PI/3 * state1;
 
			 cx = window.innerWidth / 2;
			 cy = window.innerHeight / 2;
			 sin = Math.sin(angle);
			 cos = Math.cos(angle);
 
			 x = mouseX - cx;
			 y = mouseY - cy;
			 _x = cos * x - sin * y;
			 _y = sin * x + cos * y;
			x = _x + cx;
			y = _y + cy;
 
			artificialMouseMove = true;
			canvas.dispatchEvent(new MouseEvent("mousemove", {clientX: x, clientY: y}));
			artificialMouseMove = false;
            }
        }
	}
 
	function onKeyUp(e){
	    if(e.key == "Z") {
	        ax30945=1;
	    }
		if(e.key == "Q"){
			disabled = !disabled;
			if(disabled){
				if(measuring){
					cycleRate = 1 / measure.terminate();
					measuring = false;
				} else stop();
			}else start();
			window.updateInfo && window.updateInfo("off", disabled ? "Disabled." : null);
			return;
		}
 
		if(disabled) return;
 
		if(e.key == "N"){
			if(measuring){
				cycleRate = 1 / measure.terminate();
				start();
				measuring = false;
			}else{
				stop();
				measure.start(mouseX - window.innerWidth / 2);
				measuring = true;
			}
		}else if(e.key == "R"){
			changeTank((tankIndex + 1) % tankData.length);
		}
	}
 
	function changeTank(index){
		var data = tankData[index];
		tankIndex = index;
 
		cycleRate = data.cycleRate; // ms^-1
		maxAngle = data.maxAngle;
        secAngle = data.secondaryAngle;
		NCANNON = data.NCANNON;
		angleUnit = maxAngle / (NCANNON - 1);
        secUnit = secAngle / (NCANNON - 1);
 
		window.updateInfo && window.updateInfo("changeTank", "Tank: " + data.name);
	}
 
	function init(){
		window.addEventListener("keyup", onKeyUp);
		start();
		changeTank(0);
	}
 
	function start(){
		canvas.addEventListener("mousedown", onMouseDown);
		canvas.addEventListener("mouseup", onMouseUp);
		window.addEventListener("mousemove", onMouseMove, true);
		frameRequest = window.requestAnimationFrame(update);
	}
 
	function stop(){
		canvas.removeEventListener("mousedown", onMouseDown);
		canvas.removeEventListener("mouseup", onMouseUp);
		window.removeEventListener("mousemove", onMouseMove, true);
		window.cancelAnimationFrame(frameRequest);
		effective = false;
	}
 
 
	init();
 
})();
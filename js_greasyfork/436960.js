
 // ==UserScript==
// @name         code for diep.io
// @namespace    http://tampermonkey.net/
// @version      1.1.3.7
// @description  script
// @author       delta-1
// @match        https://diep.io/
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436960/code%20for%20diepio.user.js
// @updateURL https://update.greasyfork.org/scripts/436960/code%20for%20diepio.meta.js
// ==/UserScript==





(function(){//info
	if(window.updateInfo) return;


	var info = {};
	var info_container = document.createElement("div");
	info_container.style.position = "fixed";
	info_container.style.color = "#29FCCC";
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


(function(){
	var cycleRate = 0.003125; // ms^-1
	var maxAngle = Math.PI * 45 / 180;
	var NCANNON = 3;
	var angleUnit = maxAngle / (NCANNON - 1);

	var tankData = [
        {name: "Tri-angle1", cycleRate: 0.003095, maxAngle: Math.PI * 135 / 180, NCANNON: 2},
        {name: "Tri-angle2",cycleRate: 0.003095, maxAngle: Math.PI, NCANNON: 2},
        {name: "TripleTwin", cycleRate: 0.003125, maxAngle: Math.PI * 180 / 180, NCANNON: 2},
        {name: "fighter?", cycleRate: 0.003095, maxAngle: Math.PI * 90 / 180, NCANNON: 2},
        {name: "GunnerTrapper",cycleRate: 0.015, maxAngle: Math.PI, NCANNON: 2},
        {name: "GunnerTrapper2",cycleRate: 0.001, maxAngle: Math.PI, NCANNON: 2},
        {name: "Octo", cycleRate: 0.003095, maxAngle: Math.PI * 45 / 180, NCANNON: 2},
        {name: "Streamliner", cycleRate: 0.0625, maxAngle: Math.PI * 15 / 180, NCANNON:  3},
        {name: "triplet", cycleRate: 0.0625, maxAngle: Math.PI * 15 / 180, NCANNON:  3},
	];
	var tankIndex = 0;

	var measuring = false;

	var effective = false;
	var frameRequest;

	var canvas = window.document.getElementById("canvas");

	var mouseX;
	var mouseY;
	var a = 0;
	var startA = 0;
	var artificialMouseMove = false;

	var disabled = false;

	function onMouseDown(e){
		if(e.button == 2){
			if(!effective){
				startA = a - 50;
				mouseX = e.clientX;
				mouseY = e.clientY;
				canvas.dispatchEvent(new MouseEvent("mousedown", {clientX: mouseX, clientY: mouseY}));
			}
			effective = true;
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
			var angle = angleUnit * state1 * (state1 % 2 == state2 ? 1 : -1);

			var cx = window.innerWidth / 2;
			var cy = window.innerHeight / 2;
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
		}
	}

	function onKeyUp(e){
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

		if(e.key == "R"){
			changeTank((tankIndex + 1) % tankData.length);
		}
	}

	function changeTank(index){
		var data = tankData[index];
		tankIndex = index;

		cycleRate = data.cycleRate; // ms^-1
		maxAngle = data.maxAngle;
		NCANNON = data.NCANNON;
		angleUnit = maxAngle / (NCANNON - 1);
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



// ==UserScript==
// @name        Diep.io Tank Modes (Shooting Direction Hotkeys)
// @namespace   http://tampermonkey.net/
// @version     1.0
// @description Lets your tank shoot the other direction and more!
// @author      Solar Bear
// @license     Give me credit if you want to use this script elsewhere
// @match	    *://diep.io/*

// @downloadURL https://update.greasyfork.org/scripts/449897/Diepio%20Tank%20Modes%20%28Shooting%20Direction%20Hotkeys%29.user.js
// @updateURL https://update.greasyfork.org/scripts/449897/Diepio%20Tank%20Modes%20%28Shooting%20Direction%20Hotkeys%29.meta.js
// ==/UserScript==

(function(){//info
	if(window.updateInfo) return;


	var info = {};
	var info_container = document.createElement("div");
	info_container.style.position = "fixed";
	info_container.style.color = "white";
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
	var effective = false;
    var cont = false;
	var frameRequest;
	var canvas = window.document.getElementById("canvas");
    var onoff = false;
    var flick = false;
	var mouseX;
	var mouseY;
    var mouse = "mousedown";
	var artificialMouseMove = false;
    var modeData = [
		{name: "OFF", mouse: "mousedown", cont: false, onoff: false, flick: false},
        {name: "Easy Repel", mouse: "mousedown", cont: false, onoff: true, flick: false},
		{name: "Shooting Anni", mouse: "mouseup", cont: true, onoff: true, flick: true},
		{name: "Ramming Anni", mouse: "mouseup", cont: true, onoff: true, flick: false}
	];
    var modeIndex = 0

	function onMouseDown(e){
        if(e.button == 0){
			if(flick == true) {
                mouseX = e.clientX;
                mouseY = e.clientY;
                effective = false;
                canvas.dispatchEvent(new MouseEvent("mousedown", {clientX: mouseX, clientY: mouseY}));
            }
		}
		else if(e.button == 2){
			if(cont == false) {
                if(!effective){
                    mouseX = e.clientX;
                    mouseY = e.clientY;
                    canvas.dispatchEvent(new MouseEvent(mouse, {clientX: mouseX, clientY: mouseY}));
                }
                effective = true;
            }
		}
	}

	function onMouseUp(e){
        if(e.button == 2 || e.button == 0){
			if(effective){
				canvas.dispatchEvent(new MouseEvent("mouseup", {clientX: mouseX, clientY: mouseY}));
			}
			effective = cont;
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

	function update(){
		frameRequest = window.requestAnimationFrame(update);

		if(effective){
            // endpoint formula
            var mid_x = window.innerWidth / 2;
			var mid_y = window.innerHeight / 2;
            var x = mid_x * 2 - mouseX;
			var y = mid_y * 2 - mouseY;

			artificialMouseMove = true;
			canvas.dispatchEvent(new MouseEvent("mousemove", {clientX: x, clientY: y}));
			artificialMouseMove = false;
		}
	}

    function onKeyUp(e) {
        if(e.key == "q"){
            changeMode((modeIndex + 1) % modeData.length);
        }
    }

    function changeMode(index){
		var data = modeData[index];
		modeIndex = index;

		mouse = data.mouse;
		cont = data.cont;
		onoff = data.onoff;
        flick = data.flick;

        if(onoff){
            start();
        }else{
            stop();
        }

        effective = cont;
		window.updateInfo && window.updateInfo("changeMode", data.name);
	}

    function init(){
		window.addEventListener("keyup", onKeyUp);
		start();
		changeMode(0);
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
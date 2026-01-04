// ==UserScript==
// @name		弾重ね・連射力測定
// @description 弾重ね。ペンタ、スプレッドショット、たこに対応
// @version	 1
// @author	  Gokky
// @include	 http://diep.io/*
// @connect	 diep.io
// @namespace https://greasyfork.org/users/185493
// @downloadURL https://update.greasyfork.org/scripts/369054/%E5%BC%BE%E9%87%8D%E3%81%AD%E3%83%BB%E9%80%A3%E5%B0%84%E5%8A%9B%E6%B8%AC%E5%AE%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/369054/%E5%BC%BE%E9%87%8D%E3%81%AD%E3%83%BB%E9%80%A3%E5%B0%84%E5%8A%9B%E6%B8%AC%E5%AE%9A.meta.js
// ==/UserScript==

/*
使い方
	スクリプトの実行方法
		コンソールに貼り付けて実行か、Tampermonkeyにインストール
	重ね撃ち
		右クリック
	タンクの切り替え
		Shift+T でPenta Shot, Spread Shot, Octo Tankを切り替えられる。(切り替え直後の首ふりテンポはリロード7前提)
	発射周期の測定
		初期状態ではリロード7の連射間隔を前提とするテンポで首を振る。このテンポを変更するには以下のように連射間隔の計測を行う
		1. Shift+M で発射速度測定モードにしてしばらく発射速度を計測する
		2. 計測中は機体を上下左右に動かしてはいけない。また他人の砲弾が自機のすぐ近くを飛んでると計測が狂うかもしれない
		3. 平均発射間隔の変動が小さくなったら再び Shift+M で測定モードを解除する
		測定後は測定された連射間隔にもとづいたテンポで首を振る。
		※測定時は左右どちらかShift+Mを押した時の方向にエイムが固定される。(なのでShift+Mを押す前に壁に背を向けて機体が動かないようにした方がよい)
		※リロード7でも集弾精度が悪いと思ったら一度測定すると精度が上がることがある
	左上のテキストの表示/非表示の切り替え
		Iキー
	重ね撃ち機能on/off切り替え
		Shift+Q
*/

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
					"平均発射間隔: " + intervalEMA.toString().substr(0, 5) + "ms"
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

		window.updateInfo && window.updateInfo("measuring", "連射速度測定モード");
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
	var NCANNON = 3;
	var angleUnit = maxAngle / (NCANNON - 1);

	var tankData = [
		{name: "Penta", cycleRate: 0.003125, maxAngle: Math.PI * 45 / 180, NCANNON: 3},
		{name: "SpreadShot", cycleRate: 0.001555, maxAngle: Math.PI * 75 / 180, NCANNON: 6},
		{name: "Octo", cycleRate: 0.003125, maxAngle: Math.PI * 45 / 180, NCANNON: 2}
	];
	var tankIndex = 0;

	var measure = new MeasureCycle();
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
			window.updateInfo && window.updateInfo("off", disabled ? "機能オフ" : null);
			return;
		}

		if(disabled) return;

		if(e.key == "M"){
			if(measuring){
				cycleRate = 1 / measure.terminate();
				start();
				measuring = false;
			}else{
				stop();
				measure.start(mouseX - window.innerWidth / 2);
				measuring = true;
			}
		}else if(e.key == "T"){
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
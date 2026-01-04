//© 2019 Yunus ALKIŞ Tüm hakları saklıdır.
// ==UserScript==
// @name        Agar.io © 2019 YUNUS
// @namespace   http://yunuss.site
// @description © 2019 Yunus ALKIŞ Tüm hakları saklıdır.
// @version     1.0
// @author      Yunus ALKIŞ
// @include     http://agar.io/*
// @include     https://agar.io/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/388053/Agario%20%C2%A9%202019%20YUNUS.user.js
// @updateURL https://update.greasyfork.org/scripts/388053/Agario%20%C2%A9%202019%20YUNUS.meta.js
// ==/UserScript==



document.getElementById("instructions").innerHTML += "</br><span>Settings | Ayarlar</span>";
document.getElementById("instructions").innerHTML += "</br><span><b>A</b>: Press A to Freeze Cell (Stop Movement)</span>";
document.getElementById("instructions").innerHTML += "</br><span><b>D</b>: Press D to Doublesplit (Split 2x)</span>";
document.getElementById("instructions").innerHTML += "</br><span><b>Z</b>: Press Z to Triplesplit (Split 3x)</span>";
document.getElementById("instructions").innerHTML += "</br><span><b>E</b>: Press E to Tricksplit (Split 4x)</span>";

document.getElementById("instructions").innerHTML += "</br><span><b>A</b>: Hücreyi dondurmak için A tuşuna basın (Hücreyi Durdur)</span>";
document.getElementById("instructions").innerHTML += "</br><span><b>D</b>: Doublesplit için D tuşuna basın (2x Böl)</span>";
document.getElementById("instructions").innerHTML += "</br><span><b>Z</b>: Triplesplit için Z tuşuna basın (3x Böl)</span>";
document.getElementById("instructions").innerHTML += "</br><span><b>E</b>: Tricksplit için E tuşuna basın (4x Böl)</span>";



var callbackFunc = function(){
    console.log('file loaded');
};
var head = document.getElementsByTagName( "head" )[0];
var fileref=document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", "http://w.yunuss.site/agario/agario-css.css");

    fileref.onload  = callbackFunc;
    head.insertBefore( fileref, head.firstChild );


(function() {
	'use strict';

	var canvas = null;
	var ejectorLoop = null;
	var keysHold = {};
	var topPlayers = [];
	var copiedName = '';

	$(document).ready(function() {
		canvas = document.getElementById('canvas');
		hookKeys();
		canvasModding();
	});

	function hookKeys() {
		$(document).on('keyup', function(e) {
			var key = e.which || e.keyCode;
			keysHold[key] = false;
			if(key == 69) { // key E
				clearInterval(ejectorLoop);
				ejectorLoop = null;
			}
			else if(key >= 37 && key <= 40 || key >= 73 && key <= 76) handleMovementKeys();
		});

		$(document).on('keydown', function(e) {
			var key = e.which || e.keyCode;
			var spKeys = e.ctrlKey || e.altKey || e.shiftKey;
			console.log('DEBUG: keydown ' + key);
			if(!document.getElementById('overlays') && !spKeys) {
				if(!keysHold[key]) {
					if(key == 69) { // key E
						if(!ejectorLoop) {
							ejectorLoop = setInterval(function() {
								window.onkeydown({ keyCode: 87 });
								window.onkeyup({ keyCode: 87 });
							}, 10);
						}
					}
					else if(key == 82) { // key R
						setIntervalX(function() {
							window.onkeydown({ keyCode: 87 }); // key W
							window.onkeyup({ keyCode: 87 });
						}, 120, 7);
					}
					else if(key == 84) { // key T
						setIntervalX(function() {
							window.onkeydown({ keyCode: 32 });  // key SPACE
							window.onkeyup({ keyCode: 32 });
						}, 60, 4);
					}
					else if(key == 83) { // key S
						var mEv = new MouseEvent('mousemove', { 'clientX': window.innerWidth / 2, 'clientY': window.innerHeight / 2 });
						canvas.dispatchEvent(mEv);
					}
				}
				keysHold[key] = true;
				if(key >= 37 && key <= 40 || key >= 73 && key <= 76) handleMovementKeys();
			}
			if(key >= 48 && key <= 57 && !spKeys && document.activeElement.tagName.toUpperCase() != 'INPUT') { // keys 0-9
				var playerPos = key == 48 ? 9 : key - 49;
				if(topPlayers[playerPos] !== undefined) {
					var newName = topPlayers[playerPos];
					//$('#nick').val(newName).change();
					window.prompt("Press CTRL+C to copy", newName);
				}
			}
		});
	}

	function canvasModding() {
		var proxiedFillText = CanvasRenderingContext2D.prototype.fillText;
		CanvasRenderingContext2D.prototype.fillText = function() {
			if(arguments[0] == 'Leaderboard') {
				arguments[0] = 'tiny.cc/iAgar';
				topPlayers = [];
			}
			else if(parseInt(arguments[0]) >= 1 && parseInt(arguments[0]) <= 10) { // 1. xxx to 10. xxx
				var rank = parseInt(arguments[0]);
				if(rank <= 9 && arguments[0][1] == '.' || rank == 10 && arguments[0][2] == '.') {
					var tempName = arguments[0].substr(rank == 10 ? 4 : 3);
					topPlayers[rank - 1] = tempName;
				}
			}
			return proxiedFillText.apply(this, arguments);
		};
		var proxiedStrokeText = CanvasRenderingContext2D.prototype.strokeText;
		CanvasRenderingContext2D.prototype.strokeText = function() {
			return proxiedStrokeText.apply(this, arguments);
		};
	}

	function handleMovementKeys() {
		var left = keysHold[37] || keysHold[74], up = keysHold[38] || keysHold[73], right = keysHold[39] || keysHold[76], down = keysHold[40] || keysHold[75];
		var point = [ window.innerWidth / 2, window.innerHeight / 2 ];
		if(left) point[0] -= 1000;
		if(up) point[1] -= 1000;
		if(right) point[0] += 1000;
		if(down) point[1] += 1000;
		canvas.dispatchEvent(new MouseEvent('mousemove', { 'clientX': point[0], 'clientY': point[1] }));
	}

	function setIntervalX(callback, delay, repetitions) {
		var x = 0;
		var intervalID = window.setInterval(function () {
			callback();
			if(++x === repetitions) window.clearInterval(intervalID);
		}, delay);
	}

	window.onbeforeunload = function() { return 'Quit game?'; };

})();
//© 2019 Yunus ALKIŞ Tüm hakları saklıdır.
// ==UserScript==
// @name         Bheese CSS
// @namespace    https://greasyfork.org/
// @version      0.1
// @description  I FORGOR
// @author       i forgor
// @icon         https://mpphust.ga/assets/icon%20(48).png
// @include      *://multiplayerpiano.com/*
// @include      *://mppclone.com/*
// @include      *://mpp.terrium.net/*
// @include      *://piano.ourworldofpixels.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452834/Bheese%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/452834/Bheese%20CSS.meta.js
// ==/UserScript==
setInterval(() => {
$("#room").css({background: "rgba(204, 102, 255, 0.5)" });
$("#room .more").css({background: "rgba(204, 102, 255, 0.5)"});
$("#room .expand").css({background: "rgba(204, 102, 255, 0.5)"});
$("#room .more .info:hover").css({background: "rgba(204, 102, 255, 0.5)"});
$("#room .more .new").css({background: "rgba(204, 102, 255, 0.5)"});
$("#room .more").css({background: "rgba(204, 102, 255, 0.5)"});
$("#room .more .new:hover").css({background: "rgba(204, 102, 255, 0.5);"});
$(".ugly-button").css({background: "rgba(204, 102, 255, 0)", "border-radius": "8px", "-webkit-border-radius": "8px", "-moz-border-radius": "8px" });
$("#room .more .new:hover").css({background: "rgba(102, 0, 204, 0.5)"});
$("#room .more .new:hover").css({background: "rgba(102, 0, 204, 0.5)"});
$("#names").css({"border-radius": "8px", "-webkit-border-radius": "8px", "-moz-border-radius": "8px" });
$("#names .name").css({"border-radius": "8px", "-webkit-border-radius": "8px", "-moz-border-radius": "8px" });
$(".notification-body").css({background: "rgba(102, 0, 204, 0.5)", "backdrop-filter": "blur(2px)"});
$(".notification .x:hover").css({background: "rgba(102, 0, 204, 0.5)"});
$(".notification-body").css({background: "rgba(102, 0, 204, 0.5)", "backdrop-filter": "blur(2px)"});
$(".ugly-button .stuck").css({background: "rgba(102, 0, 204, 0.5)"});
document.body.style = `background-image: url('https://w.wallhaven.cc/full/gj/wallhaven-gj77p7.png'); background-position: 25% 75%; background-size: cover; backdrop-effect: blur(2px);`
}, 1);

var resize = function(width, height) {
		MPP.piano.renderer.resize.call(MPP.piano.renderer, width, height);
		if(MPP.piano.renderer.width < 52 * 2) MPP.piano.renderer.width = 52 * 2;
		if(MPP.piano.renderer.height < MPP.piano.renderer.width * 0.2) MPP.piano.renderer.height = Math.floor(MPP.piano.renderer.height * 0.2);
		MPP.piano.renderer.canvas.width = MPP.piano.renderer.width
		MPP.piano.renderer.canvas.height = MPP.piano.renderer.height
		MPP.piano.renderer.canvas.style.width = MPP.piano.renderer.width / window.devicePixelRatio + "px";
		MPP.piano.renderer.canvas.style.height = MPP.piano.renderer.height / window.devicePixelRatio + "px";

		// calculate key sizes
		MPP.piano.renderer.whiteKeyWidth = Math.floor(MPP.piano.renderer.width / 52);
		MPP.piano.renderer.whiteKeyHeight = Math.floor(MPP.piano.renderer.height * 0.9);
		MPP.piano.renderer.blackKeyWidth = Math.floor(MPP.piano.renderer.whiteKeyWidth * 0.75);
		MPP.piano.renderer.blackKeyHeight = Math.floor(MPP.piano.renderer.height * 0.5);

		MPP.piano.renderer.blackKeyOffset = Math.floor(MPP.piano.renderer.whiteKeyWidth - (MPP.piano.renderer.blackKeyWidth / 2));
		MPP.piano.renderer.keyMovement = Math.floor(MPP.piano.renderer.whiteKeyHeight * 0.015);

		MPP.piano.renderer.whiteBlipWidth = Math.floor(MPP.piano.renderer.whiteKeyWidth * 0.7);
		MPP.piano.renderer.whiteBlipHeight = Math.floor(MPP.piano.renderer.whiteBlipWidth * 0.8);
		MPP.piano.renderer.whiteBlipX = Math.floor((MPP.piano.renderer.whiteKeyWidth - MPP.piano.renderer.whiteBlipWidth) / 2);
		MPP.piano.renderer.whiteBlipY = Math.floor(MPP.piano.renderer.whiteKeyHeight - MPP.piano.renderer.whiteBlipHeight * 1.2);
		MPP.piano.renderer.blackBlipWidth = Math.floor(MPP.piano.renderer.blackKeyWidth * 0.7);
		MPP.piano.renderer.blackBlipHeight = Math.floor(MPP.piano.renderer.blackBlipWidth * 0.8);
		MPP.piano.renderer.blackBlipY = Math.floor(MPP.piano.renderer.blackKeyHeight - MPP.piano.renderer.blackBlipHeight * 1.2);
		MPP.piano.renderer.blackBlipX = Math.floor((MPP.piano.renderer.blackKeyWidth - MPP.piano.renderer.blackBlipWidth) / 2);

		// prerender white key
		MPP.piano.renderer.whiteKeyRender = document.createElement("canvas");
		MPP.piano.renderer.whiteKeyRender.width = MPP.piano.renderer.whiteKeyWidth;
		MPP.piano.renderer.whiteKeyRender.height = MPP.piano.renderer.height + 10;
		var ctx = MPP.piano.renderer.whiteKeyRender.getContext("2d");
		if(ctx.createLinearGradient) {
			var gradient = ctx.createLinearGradient(0, 0, 0, MPP.piano.renderer.whiteKeyHeight);
			gradient.addColorStop(0, "#eee");
			gradient.addColorStop(0.75, "#fff");
			gradient.addColorStop(1, "#dad4d4");
			ctx.fillStyle = gradient;
		} else {
			ctx.fillStyle = "#fff";
		}
		ctx.strokeStyle = "#FAD61D";
		ctx.lineJoin = "round";
		ctx.lineCap = "round";
		ctx.lineWidth = 10;
		ctx.strokeRect(ctx.lineWidth / 2, ctx.lineWidth / 2, MPP.piano.renderer.whiteKeyWidth - ctx.lineWidth, MPP.piano.renderer.whiteKeyHeight - ctx.lineWidth);
		ctx.lineWidth = 4;
		ctx.fillRect(ctx.lineWidth / 2, ctx.lineWidth / 2, MPP.piano.renderer.whiteKeyWidth - ctx.lineWidth, MPP.piano.renderer.whiteKeyHeight - ctx.lineWidth);

		// prerender black key
		MPP.piano.renderer.blackKeyRender = document.createElement("canvas");
		MPP.piano.renderer.blackKeyRender.width = MPP.piano.renderer.blackKeyWidth + 10;
		MPP.piano.renderer.blackKeyRender.height = MPP.piano.renderer.blackKeyHeight + 10;
		var ctx = MPP.piano.renderer.blackKeyRender.getContext("2d");
		if(ctx.createLinearGradient) {
			var gradient = ctx.createLinearGradient(0, 0, 0, MPP.piano.renderer.blackKeyHeight);
			gradient.addColorStop(0, "#000");
			gradient.addColorStop(1, "#444");
			ctx.fillStyle = gradient;
		} else {
			ctx.fillStyle = "#000";
		}
		ctx.strokeStyle = "#FAD61D";
		ctx.lineJoin = "round";
		ctx.lineCap = "round";
		ctx.lineWidth = 8;
		ctx.strokeRect(ctx.lineWidth / 2, ctx.lineWidth / 2, MPP.piano.renderer.blackKeyWidth - ctx.lineWidth, MPP.piano.renderer.blackKeyHeight - ctx.lineWidth);
		ctx.lineWidth = 4;
		ctx.fillRect(ctx.lineWidth / 2, ctx.lineWidth / 2, MPP.piano.renderer.blackKeyWidth - ctx.lineWidth, MPP.piano.renderer.blackKeyHeight - ctx.lineWidth);

		// prerender shadows
		MPP.piano.renderer.shadowRender = [];
		var y = -MPP.piano.renderer.canvas.height * 2;
		for(var j = 0; j < 2; j++) {
			var canvas = document.createElement("canvas");
			MPP.piano.renderer.shadowRender[j] = canvas;
			canvas.width = MPP.piano.renderer.canvas.width;
			canvas.height = MPP.piano.renderer.canvas.height;
			var ctx = canvas.getContext("2d");
			var sharp = j ? true : false;
			ctx.lineJoin = "round";
			ctx.lineCap = "round";
			ctx.lineWidth = 1;
			ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
			ctx.shadowBlur = MPP.piano.renderer.keyMovement * 3;
			ctx.shadowOffsetY = -y + MPP.piano.renderer.keyMovement;
			if(sharp) {
				ctx.shadowOffsetX = MPP.piano.renderer.keyMovement;
			} else {
				ctx.shadowOffsetX = 0;
				ctx.shadowOffsetY = -y + MPP.piano.renderer.keyMovement;
			}
			for(var i in MPP.piano.renderer.piano.keys) {
				if(!MPP.piano.renderer.piano.keys.hasOwnProperty(i)) continue;
				var key = MPP.piano.renderer.piano.keys[i];
				if(key.sharp != sharp) continue;

				if(key.sharp) {
					ctx.fillRect(MPP.piano.renderer.blackKeyOffset + MPP.piano.renderer.whiteKeyWidth * key.spatial + ctx.lineWidth / 2,
						y + ctx.lineWidth / 2,
						MPP.piano.renderer.blackKeyWidth - ctx.lineWidth, MPP.piano.renderer.blackKeyHeight - ctx.lineWidth);
				} else {
					ctx.fillRect(MPP.piano.renderer.whiteKeyWidth * key.spatial + ctx.lineWidth / 2,
						y + ctx.lineWidth / 2,
						MPP.piano.renderer.whiteKeyWidth - ctx.lineWidth, MPP.piano.renderer.whiteKeyHeight - ctx.lineWidth);
				}
			}
		}
}

var redraw = function() {
		var now = Date.now();
		var timeLoadedEnd = now - 1000;
		var timePlayedEnd = now - 100;
		var timeBlipEnd = now - 1000;

		MPP.piano.renderer.ctx.save();
		MPP.piano.renderer.ctx.clearRect(0, 0, MPP.piano.renderer.canvas.width, MPP.piano.renderer.canvas.height);
		// draw all keys
		for(var j = 0; j < 2; j++) {
			MPP.piano.renderer.ctx.globalAlpha = 1.0;
			MPP.piano.renderer.ctx.drawImage(MPP.piano.renderer.shadowRender[j], 0, 0);
			var sharp = j ? true : false;
			for(var i in MPP.piano.renderer.piano.keys) {
				if(!MPP.piano.renderer.piano.keys.hasOwnProperty(i)) continue;
				var key = MPP.piano.renderer.piano.keys[i];
				if(key.sharp != sharp) continue;

				if(!key.loaded) {
					MPP.piano.renderer.ctx.globalAlpha = 0.2;
				} else if(key.timeLoaded > timeLoadedEnd) {
					MPP.piano.renderer.ctx.globalAlpha = ((now - key.timeLoaded) / 1000) * 0.8 + 0.2;
				} else {
					MPP.piano.renderer.ctx.globalAlpha = 1.0;
				}
				var y = 0;
				if(key.timePlayed > timePlayedEnd) {
					y = Math.floor(MPP.piano.renderer.keyMovement - (((now - key.timePlayed) / 100) * MPP.piano.renderer.keyMovement));
				}
				var x = Math.floor(key.sharp ? MPP.piano.renderer.blackKeyOffset + MPP.piano.renderer.whiteKeyWidth * key.spatial
					: MPP.piano.renderer.whiteKeyWidth * key.spatial);
				var image = key.sharp ? MPP.piano.renderer.blackKeyRender : MPP.piano.renderer.whiteKeyRender;
				MPP.piano.renderer.ctx.drawImage(image, x, y);

				// render blips
				if(key.blips.length) {
					var alpha = MPP.piano.renderer.ctx.globalAlpha;
					var w, h;
					if(key.sharp) {
						x += MPP.piano.renderer.blackBlipX;
						y = MPP.piano.renderer.blackBlipY;
						w = MPP.piano.renderer.blackBlipWidth;
						h = MPP.piano.renderer.blackBlipHeight;
					} else {
						x += MPP.piano.renderer.whiteBlipX;
						y = MPP.piano.renderer.whiteBlipY;
						w = MPP.piano.renderer.whiteBlipWidth;
						h = MPP.piano.renderer.whiteBlipHeight;
					}
					for(var b = 0; b < key.blips.length; b++) {
						var blip = key.blips[b];
						if(blip.time > timeBlipEnd) {
							MPP.piano.renderer.ctx.fillStyle = blip.color;
							MPP.piano.renderer.ctx.globalAlpha = alpha - ((now - blip.time) / 1000);
							MPP.piano.renderer.ctx.fillRect(x, y, w, h);
						} else {
							key.blips.splice(b, 1);
							--b;
						}
						y -= Math.floor(h * 1.1);
					}
				}
			}
		}
		MPP.piano.renderer.ctx.restore();
	};

setInterval(() => {
    resize();
    redraw();
}, 1000);
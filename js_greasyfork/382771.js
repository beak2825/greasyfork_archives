// ==UserScript==
// @name         pixelplanet.fun template
// @namespace    http://tampermonkey.net/
// @version      0.5.4
// @description  try to take over the world!
// @include      https://pixelplanet.fun/*
// @author       LohPidr
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382771/pixelplanetfun%20template.user.js
// @updateURL https://update.greasyfork.org/scripts/382771/pixelplanetfun%20template.meta.js
// ==/UserScript==

var x;
var y;
var zoomlevel;
var zoom;-2
var url; https://pixelplanet.fun/#6873,1525,-2,https://i.imgur.com/ZICzUjr.png,6873,1525
var offsetx; 6873
var offsety; 1525
var increase;

var tplbox_transparency;
var tplbox_show;
var gameWindow;

var inmove = false;
var timer = null;
var template = null;
var transparency;

window.addEventListener('load', function () {
	
	transparency = localStorage.getItem('tplbox.transparency') || 0.5;
	
	var tplbox = document.createElement('div');
    tplbox.setAttribute('class', 'tplbox');
    tplbox.setAttribute('style', 'position: absolute; right: 0.9em; bottom: 0.9em; border: 1px solid #000; color: #000; background-color: hsla(0,0%,89%,.8); padding: 5px; font-size: 0.9em; z-index: 10;');
    tplbox.innerHTML = '<div class="tplbox"><div style="padding-bottom:5px;">Templater</div><div style="padding-bottom:5px;"><input type="range" class="tplbox__transparency" min="0" max="100" style="width: 100px;"></div><div>Show: <input type="checkbox" class="tplbox__show" checked></div></div>';
    document.body.appendChild(tplbox);
	
	tplbox_transparency = document.querySelector('.tplbox__transparency');
	tplbox_show = document.querySelector('.tplbox__show');
	
	gameWindow = document.getElementById('gameWindow');
	tplbox_transparency.value = transparency * 100;
	
	let hashstr = window.location.hash.substr(1).split(',');
	if(typeof hashstr[3] == 'undefined' || typeof hashstr[4] == 'undefined' || typeof hashstr[5] == 'undefined') {
		tplbox_transparency.disabled = true;
		tplbox_show.disabled = true;
		return;
	}
	
	tplbox_transparency.addEventListener('change', TransparencyChange);	
	gameWindow.addEventListener('mousemove', Mousemove);
	gameWindow.addEventListener('mouseup', Mouseup);
	gameWindow.addEventListener('wheel', ReSize);
	tplbox_show.addEventListener('change', CheckBoxClick);
	window.addEventListener('hashchange', HashChanged);
	
	document.getElementById('helpbutton').style.zIndex  = 10;
	document.getElementById('settingsbutton').style.zIndex  = 10;
	document.getElementById('downloadbutton').style.zIndex  = 10;
	document.getElementById('globebutton').style.zIndex  = 10;
	document.querySelector('.onlinebox').style.zIndex  = 10;
	document.querySelector('.coorbox').style.zIndex  = 10;
	document.querySelector('.palettebox').style.zIndex  = 10;
	
	Init();
	
}, false);

var Init = function() {
	
	let hashstr = window.location.hash.substr(1).split(',');
	x = parseInt(hashstr[0]);
	y = parseInt(hashstr[1]);
	zoomlevel = hashstr[2];
	zoom = Math.pow(2, zoomlevel / 10);
	url = hashstr[3];
	offsetx = parseInt(hashstr[4]);
	offsety = parseInt(hashstr[5]);
	increase = parseInt(hashstr[6] || 1);
	
	if(typeof hashstr[3] == 'undefined' || typeof hashstr[4] == 'undefined' || typeof hashstr[5] == 'undefined') {
		if(template !== null) {
			template.remove();
			template = null;
		}
		tplbox_transparency.disabled = true;
		tplbox_show.disabled = true;
		return;
	} else {
		tplbox_transparency.disabled = false;
		tplbox_show.disabled = false;
	}
	
	if(template !== null) {
		template.remove();
		template = null;
	}
	template = new Image();
	template.setAttribute('style', 'position: absolute; left: 0; top: 0; pointer-events: none; image-rendering: optimizeSpeed; image-rendering: -webkit-optimize-contrast; image-rendering: -webkit-crisp-edges; image-rendering: -moz-crisp-edges; image-rendering: pixelated; image-rendering: crisp-edges; transform-origin: top left;');
	template.src = url;
	template.style.transform = 'scale(' + zoom / increase + ')';
	template.style.opacity = transparency;
	template.style.display = tplbox_show.checked ? 'block' : 'none';
	
	template.style.left = (window.innerWidth / 2) - (x - offsetx) * zoom + 'px';
	template.style.top = (window.innerHeight / 2) - (y - offsety) * zoom + 'px';
	
	document.body.appendChild(template);
};

var HashChanged = function() {
	Init();
}

var TransparencyChange = function() {
	transparency = tplbox_transparency.value / 100;
	localStorage.setItem('tplbox.transparency', transparency);
	template.style.opacity = transparency;
};

var CheckBoxClick = function() {
	template.style.display = tplbox_show.checked ? 'block' : 'none';
};

var Mousemove = function(e) {
	if(e.buttons != 1) return;
	if(gameWindow.style.cursor != 'move') return;
	inmove = true;
	template.style.display = 'none';
};

var Mouseup = function() {
	if(inmove == false) return;
	ReSize();
	inmove = false;
};

var ReSize = function() {
	template.style.display = 'none';
	clearTimeout(timer);
	timer = setTimeout(function() {
		let hashstr = window.location.hash.substr(1).split(',');
		x = parseInt(hashstr[0]);
		y = parseInt(hashstr[1]);
		zoomlevel = hashstr[2];
		window.location.hash = x + ',' + y + ',' + zoomlevel + ',' + url + ',' + offsetx + ',' + offsety + (increase==1 ? '' : ',' + increase);
	}, 400);
};

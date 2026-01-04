// ==UserScript==
// @name     18h Image Viewer
// @version  5
// @grant    none
// @match https://18h.mm-cg.com/en/*_content/*
// @match https://18h.mm-cg.com/zh/*_content/*
// @namespace http://xorcerer.github.io/
// @description Image viewer for content pages, RIGHT or SPACE for the next image, LEFT for the previous image.
// @downloadURL https://update.greasyfork.org/scripts/455051/18h%20Image%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/455051/18h%20Image%20Viewer.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle(`
 /* The Overlay (background) */
.overlay {
  /* Height & width depends on how you want to reveal the overlay (see JS below) */   
  height: 100vh;
  width: 100vw;
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  background-color: rgb(0,0,0); /* Black fallback color */
  background-color: rgba(0,0,0, 0.9); /* Black w/opacity */
  overflow-x: hidden; /* Disable horizontal scroll */
}

/* Position the content inside the overlay */
.overlay-content {
  position: relative;
  width: 100%; /* 100% width */
  text-align: center; /* Centered text/links */
}

/* The navigation links inside the overlay */
.overlay-content img {
  height: 100vh;
  width: 90vw;
  object-fit:contain;
}
.toolbox {
	width: 5vw;
	float: left;
	color: white;
}

.toolbox input {
	width: 100%;
}

`);

var origTitle = document.title;
var markup = document.documentElement.innerHTML;
var urlRe = /Large_cgurl\[\d+\] = "(.+)";/g;
var pics = [];
var cache = [];

function updateTitle(index, count) {
  var prefix = `${index + 1}/${count} `;
  document.title = prefix + origTitle;
}

function catchImage(i) {
  if (i >= pics.length)
    return;
  var img = new Image();
  var src = pics[i];
  console.log('caching:', src);
  img.src = src;
  cache.push(img);
}

for (const match of markup.matchAll(urlRe)) {
  var src = match[1];
  pics.push(src);
}


var d = document.createElement('div');
d.classList.add('overlay');

dc = document.createElement('div');
dc.classList.add('overlay-content');
d.appendChild(dc);

var img = document.createElement('img');
updateTitle(0, pics.length);
img.src = pics[0];
catchImage(1);
catchImage(2);

var toolbox = document.createElement('span');
toolbox.classList.add('toolbox')
toolbox.innerHTML = 'Go to (page No.): <input type="text" id="index" />';
dc.appendChild(toolbox);
dc.appendChild(img);


document.body.innerHTML = '';
document.body.append(d);

var index = 0;
document.addEventListener('keyup', (e) => {
	var left = -1, right = 1;
	if (e.keyCode == 37) {
  		index -= 1;
		if (index == -1) index = pics.length - 1;
      		updateTitle(index, pics.length);
		img.src = pics[index];
	} else if (e.keyCode == 39 || e.keyCode == 32) {
  		index += 1;
		if (index >= pics.length) index = 0;
      		updateTitle(index, pics.length);
		img.src = pics[index];
		catchImage(index + 1);
		catchImage(index + 2);
	} else if (e.keyCode == 13) {
    var indexBox = document.getElementById('index');
  	index = parseInt(indexBox.value) - 1;
		if (index >= pics.length) index = 0;
      		updateTitle(index, pics.length);
		img.src = pics[index];
		catchImage(index + 1);
		catchImage(index + 2);
	}

	return false;
});

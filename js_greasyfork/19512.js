// ==UserScript==
// @name        Local Image Viewer
// @description View images in local directories. Can navigate, zoom, rotate.
// @namespace   localimgviewer
// @include     file:///*
// @version     19
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/19512/Local%20Image%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/19512/Local%20Image%20Viewer.meta.js
// ==/UserScript==

var fullAddress = window.location.href; // full address
var folderAddress = window.location.href;
var img = null;
var imgWidth = null, imgHeight = null;
var imageList = [];
var optionsObj = { 'imagedisplay': 0, 'imagezoom': 100, 'imagerotation': 0, 'imageopacity': 1, 'panelsopacity': 1, };
var imageName = '';
var curPos = null, nextPos = null, prevPos = null;
var mainDiv, togglerDiv, panelsDiv;

if(isAnImage(fullAddress)) {
	folderAddress = fullAddress.substring(0, fullAddress.lastIndexOf('/')) + '/';
	img = document.getElementsByTagName('img')[0];
	img.removeAttribute('width'); img.removeAttribute('height'); img.removeAttribute('class');
	if(GM_getValue('options') !== undefined) optionsObj = JSON.parse(GM_getValue('options'));
	handleImage();
	hookKeys();
	createPanels();
	applyOptions();
}
else {
	if(fullAddress[fullAddress.length - 1] != '/') { fullAddress += '/'; folderAddress += '/'; }
	populateImageArray();
	document.addEventListener('click', function() { populateImageArray(); });
}

function populateImageArray() {
	imageList = [];
	let links = document.getElementsByTagName('a');
	for(let i = 0, j = ''; i < links.length; i++) {
		j = links[i].getAttribute('href');
		j = j.indexOf('/') != -1 ? j.substring(j.lastIndexOf('/') + 1) : j; // if the href contains full addr, just get the string after last slash
		if(isAnImage(j)) imageList.push(j);
	}
	if(imageList.length) { curPos = 0; nextPos = 0; prevPos = imageList.length - 1; hookKeys(); }
	GM_setValue('imagelist_' + folderAddress, JSON.stringify(imageList));
}

function handleImage() {
	img.style.position = 'absolute';
	img.style.textAlign = 'center';
	img.style.margin = '0 auto';
	img.style.top = '0';
	img.style.right = '0';
	img.style.bottom = '0';
	img.style.left = '0';
	document.body.style.background = '#222';

	imageName = fullAddress.substring(fullAddress.lastIndexOf('/') + 1);
	imageList = JSON.parse(GM_getValue('imagelist_' + folderAddress));
	curPos = imageList.indexOf(imageName);
	nextPos = curPos == imageList.length - 1 ? 0 : curPos + 1;
	prevPos = curPos == 0 ? imageList.length - 1 : curPos - 1;
	imgWidth = img.naturalWidth;
	imgHeight = img.naturalHeight;
}

function isAnImage(x) {
	var ext = x.split('.').pop();
	if(ext == 'jpg' || ext == 'jpeg' || ext == 'bmp' || ext == 'png' || ext == 'gif' || ext == 'tga') return true;
	return false;
}

function hookKeys() {
	document.addEventListener('keydown', function(e) {
		let key = e.keyCode || e.which;
		let spKeys = e.ctrlKey || e.shiftKey || e.altKey;
		// console.log('keydown key: ' + key + ' spkeys: ' + spKeys);
		// if(e.ctrlKey && key == 46) { deleteoptions(); console.log('deleting options'); }
		if(spKeys) return;
		if(document.activeElement.tagName == 'INPUT') {
			if(key == 27) document.activeElement.blur(); // key ESC
			return;
		}
		if(key == 39) window.location.assign(folderAddress + imageList[nextPos]); // right arrow key
		else if(key == 37) window.location.assign(folderAddress + imageList[prevPos]); // left arrow key
		else if(key == 220) { if(fullAddress != folderAddress) window.location.assign(folderAddress); } // \ key
		else if(key == 188 || key == 190 || key == 191) {
			let curRotation = parseInt(panelsDiv.children[1].children[2].children[1].children[0].children[0].value);
			if(key == 188) panelsDiv.children[1].children[2].children[1].children[0].children[0].value = curRotation - 10; // , key
			else if(key == 190) panelsDiv.children[1].children[2].children[1].children[0].children[0].value = curRotation + 10; // . key
			else if(key == 191) panelsDiv.children[1].children[2].children[1].children[0].children[0].value = 0; // / key
			panelsDiv.children[1].children[2].children[1].children[0].children[0].onchange();
		}
	});
	document.addEventListener('keypress', function(e) {
		let key = e.keyCode || e.which;
		let spKeys = e.ctrlKey || e.shiftKey || e.altKey;
		// console.log('keypress key: ' + key + ' spkeys: ' + spKeys);
		if(spKeys) return;
		if(document.activeElement.tagName == 'INPUT') return;
		if(key == 48) { // key 0
			let nextDisplay = optionsObj['imagedisplay'] >= panelsDiv.children[1].children[2].children.length - 2 ? 0 : optionsObj['imagedisplay'] + 1;
			panelsDiv.children[1].children[2].children[0].children[nextDisplay].click();
		}
		else if(key == 45 || key == 61) {
			let curZoom = parseInt(panelsDiv.children[1].children[2].children[0].children[2].children[1].value);
			if(key == 45) panelsDiv.children[1].children[2].children[0].children[2].children[1].value = curZoom - 5; // - key
			else if(key == 61) panelsDiv.children[1].children[2].children[0].children[2].children[1].value = curZoom + 5; // = key
			panelsDiv.children[1].children[2].children[0].children[2].children[1].onchange();
		}
		else if(key == 103) togglerDiv.lastChild.click(); // G key
	});
}

function createPanels() {
	var stylesheet = document.createElement('style');
	stylesheet.innerHTML += ' a { color: #FFF; text-decoration: none; }';
	stylesheet.innerHTML += ' form { margin: 0; }';
	stylesheet.innerHTML += ' input[type="number"] { width: 60px; }';
	stylesheet.innerHTML += ' input[type="range"] { width: 100px; }';
	stylesheet.innerHTML += ' #imgViewer { position: fixed; top: 5px; left: 5px; width: 99%; font-family: Tahoma, sans-serif; font-size: 13px; color: #BBB; }';
	stylesheet.innerHTML += ' #imgViewer-toggler { display: table; position: relative; padding: 0px 8px; border: 1px solid #222; border-radius: 16px; background-color: #111; font-size: 16px; }';
	stylesheet.innerHTML += ' #imgViewer-toggler a { margin: 0px 4px; }';
	stylesheet.innerHTML += ' .goto { display: table; position: absolute; top: 0px; left: 130px; width: 114px; padding: 2px; border-radius: 4px; background-color: #18F; }';
	stylesheet.innerHTML += ' .goto * { font-size: 10px; }';
	stylesheet.innerHTML += ' .panel { display: table; position: relative; margin: 3px 0px; padding: 8px 16px; border: 1px solid #333; border-radius: 6px; background-color: #111; }';
	stylesheet.innerHTML += ' .panel_closebutton { position: absolute; top: 4px; right: 6px; }';
	stylesheet.innerHTML += ' .panel_title { font-family: Georgia, serif; font-size: 16px; color: #3AF; margin: 0px 14px 0px -6px; }';
	stylesheet.innerHTML += ' .panel_content { margin: 6px 0px; }';
	stylesheet.innerHTML += ' .panel:nth-child(2) .panel_content div { margin-bottom: 4px; }';
	stylesheet.innerHTML += ' .panel:nth-child(4) .panel_content div { margin-bottom: 10px; }';
	stylesheet.innerHTML += ' .maintext { font-size: 16px; color: #AF3; }';
	stylesheet.innerHTML += ' .maintext2 { display: block; margin-bottom: 4px; color: #FA3; font-weight: bold; }';
	stylesheet.innerHTML += ' .smalltext { font-size: 11px; }';
	stylesheet.innerHTML += ' .keyboard { display: inline-block; min-width:20px; margin-right: 6px; padding: 1px 3px; border-radius: 2px; background-color: #DDD; color: #000; text-align: center; }';
	stylesheet.innerHTML += ' .resetinput { color: #F00; }';
	document.head.appendChild(stylesheet);

	mainDiv = document.createElement('div');
	mainDiv.id = 'imgViewer';
	mainDiv.innerHTML = '<div id="imgViewer-toggler"></div><div id="imgViewer-panels"></div>';
	document.body.appendChild(mainDiv);
	togglerDiv = document.getElementById('imgViewer-toggler');
	panelsDiv = document.getElementById('imgViewer-panels');
	togglerDiv.innerHTML = '<a href="#" title="Image info">&#x1f4c4;</a><a href="#" title="Options">&#x2699;</a><a href="#" title="Image list">&#x2263;</a><a href="#" title="Script info">&#x2139;</a><a href="#" title="Go to image">&#x21B3;</a>';
	panelsDiv.innerHTML = '<div></div><div></div><div></div><div></div><div></div>';

	var togglers = togglerDiv.getElementsByTagName('a');
	for(let i=0; i<togglers.length; i++) {
		togglers[i].onclick = function(e) {
			panelsDiv.children[i].style.display = panelsDiv.children[i].style.display == 'none' ? 'table' : 'none';
			if(i == togglers.length - 1) panelsDiv.children[i].children[0].children[0].focus();
			optionsObj['panel' + i + 'display'] = panelsDiv.children[i].style.display;
			GM_setValue('options', JSON.stringify(optionsObj));
			e.preventDefault();
		};
	}

	for(let i=0, j=null; i<panelsDiv.children.length; i++) {
		j = panelsDiv.children[i];
		j.className = 'panel';
		j.innerHTML += '<a href="#" class="panel_closebutton">&#x2716;</a><div class="panel_title"></div><div class="panel_content"></div>';
		if(!i) {
			j.children[1].innerHTML = 'Image ' + (curPos+1) + '/' + imageList.length;
			j.children[2].innerHTML = '<div class="maintext">' + decodeURIComponent(imageName) + '</div><div class="smalltext"></div><br><div class="smalltext"><a href="' + imageList[prevPos] + '">Prev:</a> ' + decodeURIComponent(imageList[prevPos]) + '<br><a href="' + imageList[nextPos] + '">Next:</a> ' + decodeURIComponent(imageList[nextPos]) + '</div>';
		}
		else if(i == 1) {
			j.children[1].innerHTML = 'Options';
			j.children[2].innerHTML = '<div>Image size: <label style="display: inline-block;"><input type="radio" name="imagedisplay">Original</label><label style="display: block; margin-left: 71px;"><input type="radio" name="imagedisplay">Fit to screen</label><label style="display: block; margin-left: 71px;"><input type="radio" name="imagedisplay">Screen width (%) <input type="number" min="5" max="1000" default="100"></label></div>';
			j.children[2].innerHTML += '<div>Image rotation (&deg;): <label><input type="number" default="0"></label></div>';
			j.children[2].innerHTML += '<div>Image opacity: <label><input type="range" min="5" max="100" default="100"></label></div>';
			j.children[2].innerHTML += '<div>Panels opacity: <label><input type="range" min="5" max="100" default="100"></label></div>';
		}
		else if(i == 2) {
			j.children[1].innerHTML = 'Image List';
			j.children[2].innerHTML = '<select size="15"></select>';
			for(let k=0; k<imageList.length; k++) { j.children[2].children[0].innerHTML += '<option value="' + k + '" ' + (k == curPos ? 'selected' : '') + '>' + '(' + (k + 1) + ') ' + decodeURIComponent(imageList[k]) + '</option>'; }
		}
		else if(i == 3) {
			j.style.position = 'absolute'; j.style.top = '0px'; j.style.right = '0px'; j.style.maxWidth = '220px';
			j.children[1].innerHTML = 'Script Info';
			j.children[2].innerHTML = '<div class="smalltext"><span class="maintext2">Keyboard Shortcut</span><span class="keyboard">Left Arrow</span>: Previous image<br><span class="keyboard">Right Arrow</span>: Next image<br><span class="keyboard">Q</span>: Toggle go to image box<br><span class="keyboard">\\</span>: Parent directory<br><span class="keyboard">+</span>: Zoom in 5% screen width<br><span class="keyboard">-</span>: Zoom out 5% of screen width<br><span class="keyboard">0</span>: Toggle between original, fit to screen and zoom sizes<br><span class="keyboard">&gt;</span>: Rotate image 10&deg; clockwise<br><span class="keyboard">&lt;</span>: Rotate image 10&deg; counter-clockwise</div>';
			j.children[2].innerHTML += '<div class="smalltext"><span class="maintext2">About</span>Made by: Condoriano<br>Last update: 2016-05-21<br>Homepage: <a target="_blank" href="https://greasyfork.org/en/scripts/19512-local-image-viewer">Greasyfork</a></div>';
			j.children[2].innerHTML += '<div><form style="display: inline-block;" id="donate-mod" action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank"><input name="cmd" value="_donations" type="hidden"><input name="business" value="keyzint@gmail.com" type="hidden"><input name="lc" value="US" type="hidden"><input name="item_name" value="Donation" type="hidden"><input name="no_note" value="0" type="hidden"><input name="currency_code" value="USD" type="hidden"><input name="bn" value="PP-DonationsBF:btn_donateCC_LG.gif:NonHostedGuest" type="hidden"><input style="vertical-align: bottom; margin-left: 5px;" name="submit" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" alt="PayPal btn" border="0" type="image"><img src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" alt="" height="1" border="0" width="1"></form></div>';
		}
		else if(i == 4) {
			j.className = 'goto';
			j.innerHTML = '<form name="goToImage"><input type="number"><input type="submit" value="Go"></form>';
		}
		if(j.className == 'panel') j.children[0].onclick = function(e) { togglers[i].click(); e.preventDefault(); };
	}

	var inputs = document.getElementsByTagName('input');
	for(let i=0, j=0, k=null; i<inputs.length; i++) {
		inputs[i].style.margin = '0px 4px';
		if(inputs[i].type == 'range') {
			inputs[i].style.height = '8px';
			k = document.createElement('span');
			inputs[i].parentElement.appendChild(k);
			k = document.createTextNode('%');
			inputs[i].parentElement.appendChild(k);
		}
		j = inputs[i].getAttribute('default');
		if(j) {
			k = document.createElement('a');
			k.href = '#';
			k.className = 'resetinput';
			k.style.marginLeft = '6px';
			k.innerHTML = '&#x2205;';
			inputs[i].parentElement.appendChild(k);
			k.onclick = function(e) {
				inputs[i].value = j;
				inputs[i].onchange();
				e.preventDefault();
			};
		}
	}

	var options = panelsDiv.children[1].getElementsByTagName('input');
	for(let i=0; i<options.length; i++) {
		options[i].onchange = function() {
			if(i == 0 || i == 1 || i == 2) {
				img_doDisplay(i);
				if(i == 2) img_doZoom(this.nextElementSibling.value);
				this.blur();
			}
			else if(i == 3) {
				this.value = this.value == '' ? optionsObj['imagezoom'] : this.value >= 1000 ? 1000 : this.value < 5 ? 5 : this.value;
				this.previousElementSibling.click();
				img_doZoom(this.value);
			}
			else if(i == 4) { // rotate
				this.value = this.value == '' ? 0 : this.value > 360 ? this.value % 360 : this.value < 0 ? (this.value % 360) + 360 : this.value;
				img_doRotation(this.value);
			}
			else if(i == 5 || i == 6) { // opacity
				this.value = this.value > 100 ? 100 : this.value < 5 ? 5 : this.value;
				this.nextElementSibling.innerHTML = this.value;
				if(i == 5) { img.style.opacity = this.value / 100; optionsObj['imageopacity'] = this.value / 100; }
				else { mainDiv.style.opacity = this.value / 100; optionsObj['panelsopacity'] = this.value / 100; }
			}
			zoomInfo();
		};
	}

	var select = panelsDiv.children[2].getElementsByTagName('select')[0];
	select.onchange = function() { window.location.assign(imageList[this.value]); };

	img.addEventListener('click', function() {
		if(imgWidth > window.innerWidth || imgHeight > window.innerHeight) {
			if(img.width == imgWidth && img.height == imgHeight) panelsDiv.children[1].children[2].children[0].children[0].children[0].click();
			else panelsDiv.children[1].children[2].children[0].children[1].children[0].click();
		}
	});

	document.forms.goToImage.onsubmit = function(e) {
		let page = this.children[0].value;
		if(page == '') { alert('Type the image number and press Go'); return false; }
		page = parseInt(page);
		if(page <= 0 || page > imageList.length) alert('Image #' + page + ' doesn\'t exist');
		else window.location.assign(imageList[page - 1]);
		e.preventDefault();
	};
}

function img_doDisplay(fit) {
	if(fit == 0) {
		img.removeAttribute('width');
		img.removeAttribute('height');
	}
	else if(fit == 1) {
		img.removeAttribute('width');
		img.removeAttribute('height');
		if(imgWidth > window.innerWidth) {
			img.width = window.innerWidth;
			if(imgHeight > window.innerHeight) {
				img.height = window.innerHeight;
				img.removeAttribute('width');
			}
		}
		else if(imgHeight > window.innerHeight) {
			img.height = window.innerHeight;
			if(imgWidth > window.innerWidth) {
				img.width = window.innerWidth;
				img.removeAttribute('height');
			}
		}
		else { img.width = imgWidth; img.height = imgHeight; }
	}
	optionsObj['imagedisplay'] = parseInt(fit);
}

function img_doZoom(percent) {
	img.width = percent / 100 * document.body.clientWidth;
	img.removeAttribute('height');
	optionsObj['imagezoom'] = parseInt(percent);
}

function img_doRotation(angle) {
	if(angle == 0) img.style.transform = '';
	else img.style.transform = 'rotate(' + angle + 'deg)';
	optionsObj['imagerotation'] = parseInt(angle);
}

function zoomInfo() {
	let text = '';
	if(optionsObj['imagedisplay'] == 0) text = 'Original';
	else if(optionsObj['imagedisplay'] == 1) text = 'Fit to screen';
	else if(optionsObj['imagedisplay'] == 2) text = optionsObj['imagezoom'] + '% screen width';
	panelsDiv.children[0].children[2].children[1].innerHTML = text + ' (' + img.width + 'x' + img.height + ')';
	GM_setValue('options', JSON.stringify(optionsObj));
}

function applyOptions() {
	console.log(optionsObj);
	if(optionsObj['imagezoom'] !== undefined) panelsDiv.children[1].children[2].children[0].children[2].children[1].value = optionsObj['imagezoom'];
	if(optionsObj['imagedisplay'] !== undefined) {
		panelsDiv.children[1].children[2].children[0].children[optionsObj['imagedisplay']].children[0].click();
	}
	if(optionsObj['imagerotation'] !== undefined) {
		panelsDiv.children[1].children[2].children[1].children[0].children[0].value = optionsObj['imagerotation'];
		img_doRotation(optionsObj['imagerotation']);
	}
	if(optionsObj['imageopacity'] !== undefined) {
		img.style.opacity = optionsObj['imageopacity'];
		panelsDiv.children[1].children[2].children[2].children[0].children[0].value = optionsObj['imageopacity'] * 100;
		panelsDiv.children[1].children[2].children[2].children[0].children[1].innerHTML = optionsObj['imageopacity'] * 100;
	}
	if(optionsObj['panelsopacity'] !== undefined) {
		document.getElementById('imgViewer').style.opacity = optionsObj['panelsopacity'];
		panelsDiv.children[1].children[2].children[3].children[0].children[0].value = optionsObj['panelsopacity'] * 100;
		panelsDiv.children[1].children[2].children[3].children[0].children[1].innerHTML = optionsObj['panelsopacity'] * 100;
	}
	for(let i=0; i<panelsDiv.children.length; i++) { if(optionsObj['panel' + i + 'display'] !== undefined) panelsDiv.children[i].style.display = optionsObj['panel' + i + 'display']; }
	zoomInfo();
}

function deleteoptions() {
	var keys = GM_listValues();
	for (var i=0, key=null; key=keys[i]; i++) GM_deleteValue(key);
	alert('all options deleted');
};


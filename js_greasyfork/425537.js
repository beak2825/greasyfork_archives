// ==UserScript==
// @name         dA_zoomImage
// @namespace    http://phi.pf-control.de/userscripts/dA_zoomImage
// @version      2.0
// @description  better zoom for images in deviation-view
// @author       Dediggefedde
// @match        https://www.deviantart.com/*
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/425537/dA_zoomImage.user.js
// @updateURL https://update.greasyfork.org/scripts/425537/dA_zoomImage.meta.js
// ==/UserScript==

/* jshint esnext:true */

(function() {
	'use strict';

	//%%% globale variables

	//imgGear copied from inkscape "render gear", slightly adjusted
	let imgGear = '<svg  xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 20.444057 20.232336" > <g transform="translate(-15.480352,-5.6695418)">  <g transform="matrix(0.26458333,0,0,0.26458333,25.702381,15.78571)"  style="fill:#000000">  <path  style="fill:#000000;stroke:#000000;stroke-width:1"  d="m 28.46196,-3.25861 4.23919,-0.48535 0.51123,0.00182 4.92206,1.5536 v 4.37708 l -4.92206,1.5536 -0.51123,0.00182 -4.23919,-0.48535 -1.40476,6.15466 4.02996,1.40204 0.45982,0.22345 3.76053,3.53535 -1.89914,3.94361 -5.1087,-0.73586 -0.4614,-0.22017 -3.60879,-2.2766 -3.93605,4.93565 3.02255,3.01173 0.31732,0.40083 1.8542,4.81687 -3.42214,2.72907 -4.2835,-2.87957 -0.32017,-0.39856 -2.26364,-3.61694 -5.68776,2.73908 1.41649,4.0249 0.11198,0.49883 -0.41938,5.14435 -4.26734,0.97399 -2.6099,-4.45294 -0.11554,-0.49801 -0.47013,-4.2409 h -6.31294 l -0.47013,4.2409 -0.11554,0.49801 -2.6099,4.45294 -4.26734,-0.97399 -0.41938,-5.14435 0.11198,-0.49883 1.41649,-4.0249 -5.68776,-2.73908 -2.26364,3.61694 -0.32017,0.39856 -4.2835,2.87957 -3.42214,-2.72907 1.8542,-4.81687 0.31732,-0.40083 3.02255,-3.01173 -3.93605,-4.93565 -3.60879,2.2766 -0.4614,0.22017 -5.1087,0.73586 -1.89914,-3.94361 3.76053,-3.53535 0.45982,-0.22345 4.02996,-1.40204 -1.40476,-6.15466 -4.23919,0.48535 -0.51123,-0.00182 -4.92206,-1.5536 v -4.37708 l 4.92206,-1.5536 0.51123,-0.00182 4.23919,0.48535 1.40476,-6.15466 -4.02996,-1.40204 -0.45982,-0.22345 -3.76053,-3.53535 1.89914,-3.94361 5.1087,0.73586 0.4614,0.22017 3.60879,2.2766 3.93605,-4.93565 -3.02255,-3.01173 -0.31732,-0.40083 -1.8542,-4.81687 3.42214,-2.72907 4.2835,2.87957 0.32017,0.39856 2.26364,3.61694 5.68776,-2.73908 -1.41649,-4.0249 -0.11198,-0.49883 0.41938,-5.14435 4.26734,-0.97399 2.6099,4.45294 0.11554,0.49801 0.47013,4.2409 h 6.31294 l 0.47013,-4.2409 0.11554,-0.49801 2.6099,-4.45294 4.26734,0.97399 0.41938,5.14435 -0.11198,0.49883 -1.41649,4.0249 5.68776,2.73908 2.26364,-3.61694 0.32017,-0.39856 4.2835,-2.87957 3.42214,2.72907 -1.8542,4.81687 -0.31732,0.40083 -3.02255,3.01173 3.93605,4.93565 3.60879,-2.2766 0.4614,-0.22017 5.1087,-0.73586 1.89914,3.94361 -3.76053,3.53535 -0.45982,0.22345 -4.02996,1.40204 z"  />  <circle  style="fill:#ffffff;stroke:#000000;stroke-width:1"  cx="0"  cy="0"  r="15" />  </g>  </g> </svg>';
	//zoom cursor self-drawn
	let zoomCursor = `url("data:image/svg+xml,%3Csvg width='32' height='32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cellipse stroke='%23000' fill='url(%23svg_17)' stroke-width='2' stroke-dasharray='null' stroke-opacity='null' cx='13.95456' cy='12.81821' id='svg_4' rx='6.31813' ry='6.31813'/%3E%3Cline fill='none' stroke='%23000' stroke-width='2' stroke-dasharray='null' stroke-opacity='null' fill-opacity='null' x1='18.54543' y1='17.59089' x2='25.77965' y2='24.82511' id='svg_6' stroke-linejoin='null' stroke-linecap='null'/%3E%3Cline transform='rotate(90 25.2126 8.452)' stroke-linecap='null' stroke-linejoin='null' id='svg_1' y2='10.98273' x2='25.21259' y1='5.92127' x1='25.21259' stroke-dasharray='null' stroke='%2300bf00' fill='none'/%3E%3Cline stroke-linecap='null' stroke-linejoin='null' id='svg_2' y2='10.98273' x2='25.21259' y1='5.92127' x1='25.21259' stroke-dasharray='null' stroke='%2300bf00' fill='none'/%3E%3C/g%3E%3Cdefs%3E%3CradialGradient r='2.07054' cy='0.01172' cx='0.47656' spreadMethod='pad' id='svg_17'%3E%3Cstop offset='0.00391' stop-opacity='0.95703' stop-color='%23dbf9f9'/%3E%3Cstop offset='1' stop-opacity='0.10938' stop-color='%23ff56aa'/%3E%3C/radialGradient%3E%3C/defs%3E%3C/svg%3E") 16 16, zoom-in`;

	//enums
	let zoomModes = { fit: 0, width: 1, height: 2, full: 3 } //viewing images (zoom button)
	let clickModes = { cont: 0, img: 1, preview: 2, rect: 3, navi: 4, close: 5, setting: 6, wide: 7, height: 8, real: 9, window: 10 }; //event delegation button click

	let prevImg, //preview image
			img, //original image object
			zoomCont = 0, //zoom image div container
			zoomImg, //actually zoomed image
			highRec //highlight rectangle
	;
	let diag; //floating dialog div
	let lastZoomT = 0, //scroll zoom debouncer by timer
			lastResize = 0; //window resize debouncer by timer

	// let prevImg.offsetWidth, prevImg.offsetHeight, zoomImg.offsetWidth, zoomImg.offsetHeight, window.innerWidth, window.innerHeight;
	let userSet = { //user settings, saved/loaded by GM.
			opacityPrev: 50, //percent, drag-preview image opacity
			opacityHigh: 50, //percent, highlight rectangle opacity
			marginPrev: 10, //percent, margin around preview image
			lastZoom: zoomModes.fit //last zoom mode clicked = auto when open zoom
	};

	//%%%helper functions

	//set CSS style from array
	function setCss(el, arr) {
			if (!el) return;
			for (let i in arr) {
					el.style[i] = arr[i];
			}
	}

	//simple collision check, (x,y) inside obj-rectangle
	function coordInObj(x, y, obj) {
			let cImgOff = { left: obj.getBoundingClientRect().left + window.scrollY, top: obj.getBoundingClientRect().top + window.scrollY };

			return (x >= cImgOff.left && x <= cImgOff.left + prevImg.offsetWidth &&
					y >= cImgOff.top && y <= cImgOff.top + prevImg.offsetHeight);
	}

	//%%% DOM manipulation

	//moves zoomed image to (tx,ty)
	function moveToXY(tx, ty) {

			//highlight rect size, window/zoom scaled to preview size,
			let highr = {
					w: window.innerWidth / zoomImg.offsetWidth * prevImg.offsetWidth,
					h: window.innerHeight / zoomImg.offsetHeight * prevImg.offsetHeight
			};

			//percentage size scaled to preview image
			let highRat = {
					w: highr.w / prevImg.offsetWidth / 2,
					h: highr.h / prevImg.offsetHeight / 2
			};

			//real xy-position of preview image
			let cImgOff = {
					left: prevImg.getBoundingClientRect().left + window.scrollY,
					top: prevImg.getBoundingClientRect().top + window.scrollY
			};

			//relative shift of image (rect & zoom-image)
			let rel = { x: 0, y: 0 }

			if (zoomImg.offsetWidth < window.innerWidth) { //vertical center image if all fits on screen
					rel.x = 0;
			} else {
					rel.x = (tx - cImgOff.left) / prevImg.offsetWidth; //relative offset to preview, 0 in center
					rel.x = rel.x > 1 - highRat.w ? 1 - highRat.w : rel.x < highRat.w ? highRat.w : rel.x; //limit highlight-rec fit
					rel.x -= 0.5;
					rel.x = rel.x > 0.5 ? 0.5 : rel.x < -0.5 ? -0.5 : rel.x; //limit [-0.5,0.5]
			}

			if (zoomImg.offsetHeight < window.innerHeight) { //horizontal center image if all fits on screen
					rel.y = 0;
			} else { //same as rel.x
					rel.y = (ty - cImgOff.top) / prevImg.offsetHeight;
					rel.y = rel.y > 1 - highRat.h ? 1 - highRat.h : rel.y < highRat.h ? highRat.h : rel.y;
					rel.y -= 0.5;
					rel.y = rel.y > 0.5 ? 0.5 : rel.y < -0.5 ? -0.5 : rel.y;
			}

			//relative shift scaled to zoom image px.
			let offZoom = {
					x: -rel.x * zoomImg.offsetWidth,
					y: -rel.y * zoomImg.offsetHeight
			};

			//fix for margin:auto
			if (zoomImg.offsetWidth > window.innerWidth) offZoom.x -= (zoomImg.offsetWidth - window.innerWidth) / 2;
			// if(zoomImg.offsetHeight>window.innerHeight)offY-=(zoomImg.offsetHeight-window.innerHeight)/2; //margin auto only confuses X

			//moving zoom image
			zoomImg.style.transform = "translate(" + offZoom.x + "px," + offZoom.y + "px)";

			//moving/resizing highlight rectangle
			setCss(highRec, {
					width: highr.w + "px",
					height: highr.h + "px",
					transform: "translate(" + rel.x * prevImg.offsetWidth + "px," + rel.y * prevImg.offsetHeight + "px)"
			});
	}

	//fast zoom mode application
	function fullViewZoom(mode = zoomModes.fit, updateSet = true) {
			let sty = "";
			switch (mode) {
					case zoomModes.fit:
							if ((img.offsetWidth / img.offsetHeight) > (window.innerWidth / window.innerHeight)) return fullViewZoom(zoomModes.width);
							else fullViewZoom(zoomModes.height);
							break;
					case zoomModes.width:
							sty = { width: "100%", height: "auto", transform: "" };
							break;
					case zoomModes.height:
							sty = { height: "100%", width: "auto", transform: "" };
							break;
					case zoomModes.full:
							sty = { height: "auto", width: "auto", transform: "" };
							break;
			}

			setCss(zoomImg, sty);

			if (updateSet) {
					userSet.lastZoom = mode;
					GM.setValue("settings", JSON.stringify(userSet));
			}

	}

	//resized preview image,triggered at start and resize-window
	function resizePreview() {
			setCss(prevImg, {
					inset: userSet.marginPrev + "%",
					width: "unset",
					height: "unset",
					"max-width": (100 - userSet.marginPrev * 2) + "%",
					"max-height": (100 - userSet.marginPrev * 2) + "%"
			});

			setCss(highRec, { opacity: userSet.opacityHigh });
	}
	function checkURL(step=0){
			let tmpImage,mtch,imgsrc;
			switch(step){
					default:
					case 0: //check original image for dimension, min 400x400, thumbs are 96*96px, browse uses 340px heightupdateZoom(img.src);
							updateZoom(img.src); //use original image as placeholder and basis

							tmpImage = new Image();
							tmpImage.onload = function() {
									if(this.height<400|this.width<400){ //too small
											checkURL(1);
									}
									//all fine!
							};
							tmpImage.onerror = function() { //something wrong
									checkURL(1);
							};
							tmpImage.src=img.src;
							break;
					case 1: //try to change img url to access download images
							mtch=img.src.match(/(^.*?)(\/..?\/(?:crop|fill|fit)\/.*?)?(\?token=.*)/);
							imgsrc= mtch[1]+mtch[3];

							tmpImage = new Image();
							tmpImage.onload = function() {//image has accessible original image
									updateZoom(imgsrc);
									//switch to original fullview image
							};
							tmpImage.onerror = function() { //mostly response "forbidden", if direct access not enabled
									checkURL(2);
							};
							tmpImage.src=imgsrc;
							break;
					case 2: //use default scaler 1200px in height and width
							imgsrc=img.src.replace(/\/(crop|fill|fit)\/.*?\//,"/fit/w_1200,h_1200/");

							tmpImage = new Image();
							tmpImage.onload = function() {
									updateZoom(imgsrc);
									//switch to 1200px fit image
							};
							tmpImage.onerror = function() {
									checkURL(3); //if original is smaller than 1200, requests to fill are "forbidden".
							};
							tmpImage.src=imgsrc;
							break;
					case 3: //use default scaler 800px in height and width
							imgsrc=img.src.replace(/\/(crop|fill|fit)\/.*?\//,"/fit/w_800,h_800/");

							tmpImage = new Image();
							tmpImage.onload = function() {
									updateZoom(imgsrc);
									//switch to 800px fit image
							};
							tmpImage.onerror = function() {
									//no high-R image, image should still be img.src
									console.log("fallback original resolution", imgsrc,img.src);
							};
							tmpImage.src=imgsrc;
							break;
			};

	}

	function updateZoom(imgsrc) {
			if(!img)return;
			zoomImg.src = imgsrc ;
			prevImg.src = imgsrc ;
			resizePreview(); //adapt resize image
			fullViewZoom(userSet.lastZoom); //default zoom
	}

	//adds all elements to DOM (initial)
	function addElements(){
			//zoom container
			if(zoomCont)return;
			zoomCont = document.createElement("div");
			zoomCont.id = "dA_zoomImage_zoomCont";
			zoomCont.setAttribute("clickMode", clickModes.cont);
			document.body.appendChild(zoomCont);

			//zoomed image
			zoomImg = document.createElement("img");
			zoomImg.src ="";//imgsrc;
			zoomImg.id = "dA_zoomImage_zoomImg";
			zoomImg.setAttribute("clickMode", clickModes.img);
			setCss(zoomImg, { width: window.innerWidth + "px", height: window.innerHeight + "px" });
			zoomCont.appendChild(zoomImg);

			//preview image
			prevImg = document.createElement("img");//img.cloneNode(true);
			prevImg.setAttribute("clickMode", clickModes.preview);
			prevImg.id = "dA_zoomImage_prevImg";
			zoomCont.appendChild(prevImg);

			//highlight rectangle
			highRec = document.createElement("div");
			highRec.setAttribute("clickMode", clickModes.rect);
			highRec.id = "dA_zoomImage_highR";
			zoomCont.appendChild(highRec);

			//button container
			let navi = document.createElement("div");
			navi.setAttribute("clickMode", clickModes.navi);
			navi.id = "dA_zoomImage_navigation";
			zoomCont.appendChild(navi);

			//button container buttons (close)
			let closebut = document.createElement("div");
			closebut.title = "Close Zoom";
			closebut.setAttribute("clickMode", clickModes.close);
			closebut.innerHTML = "╳";
			navi.appendChild(closebut);

			//button container buttons (settings)
			let but = document.createElement("div");
			but.title = "dragFullscreen Settings";
			but.setAttribute("clickMode", clickModes.setting);
			but.innerHTML = imgGear;
			navi.appendChild(but);

			//button container buttons (fit width)
			let widebut = document.createElement("div");
			widebut.title = "Zoom Width";
			widebut.setAttribute("clickMode", clickModes.wide);
			widebut.innerHTML = "↔";
			navi.appendChild(widebut);

			//button container buttons (fit height)
			let highbut = document.createElement("div");
			highbut.title = "Zoom Height";
			highbut.setAttribute("clickMode", clickModes.height);
			highbut.innerHTML = "↕";
			navi.appendChild(highbut);

			//button container buttons (fit window)
			let fitbut = document.createElement("div");
			fitbut.title = "Zoom Fit Window";
			fitbut.setAttribute("clickMode", clickModes.window);
			fitbut.innerHTML = "⭾";
			navi.appendChild(fitbut);

			//button container buttons (full size)
			let realbut = document.createElement("div");
			realbut.title = "Real size";
			realbut.setAttribute("clickMode", clickModes.real);
			realbut.innerHTML = "⤧";
			navi.appendChild(realbut);

			//settings dialog
			diag = document.createElement("div");
			diag.id = "dA_zoomImage_settings";
			diag.style.display = "none";
			diag.innerHTML = `<form style='display:grid;grid-template-columns:auto auto 30px;grid-gap: 5px;'>
									<label for="previewOpacity">Preview Opacity (%):</label>
									<input type="range" min="0" max="100" value=${userSet.opacityPrev} name="previewOpacitySlider">
									<input type="text" value="${userSet.opacityPrev}" name="previewOpacity">
									<label for="highOpacity">Highlight Opacity (%):</label>
									<input type="range" min="0" max="100" value=${userSet.opacityHigh} name="highOpacitySlider">
									<input type="text" value="${userSet.opacityHigh}" name="highOpacity">
									<label for="previewMargin">Preview Margin (%):</label>
									<input type="range" min="0" max="40" value=${userSet.marginPrev} name="previewMarginSlider">
									<input type="text" value="${userSet.marginPrev}" name="previewMargin">
							</form><div id="dA_zoomImage_settings_OK">Save</div>`.replace(/\s\s+/g, "");
			document.body.appendChild(diag);

			document.getElementsByName("previewOpacitySlider")[0].addEventListener("input", function(ev) {
					document.getElementsByName("previewOpacity")[0].value = this.value;
			});
			document.getElementsByName("highOpacitySlider")[0].addEventListener("input", function(ev) {
					document.getElementsByName("highOpacity")[0].value = this.value;
			});
			document.getElementsByName("previewMarginSlider")[0].addEventListener("input", function(ev) {
					document.getElementsByName("previewMargin")[0].value = this.value;
			});

			document.getElementsByName("previewOpacity")[0].addEventListener("input", function(ev) {
					if (this.value > 100) this.value = 100;
					if (this.value < 0) this.value = 0;
					document.getElementsByName("previewOpacitySlider")[0].value = this.value;
			});

			document.getElementsByName("highOpacity")[0].addEventListener("input", function(ev) {
					if (this.value > 100) this.value = 100;
					if (this.value < 0) this.value = 0;
					document.getElementsByName("highOpacitySlider")[0].value = this.value;
			});

			document.getElementsByName("previewMargin")[0].addEventListener("input", function(ev) {
					if (this.value > 40) this.value = 40;
					if (this.value < 0) this.value = 0;
					document.getElementsByName("previewMarginSlider")[0].value = this.value;
			});


			//OK settings dialog button (save settings, apply changes, hide dialog)
			var okbut = document.querySelector("#dA_zoomImage_settings_OK");
			okbut.addEventListener("click", function(ev) {
					ev.stopPropagation();
					ev.preventDefault();
					userSet.opacityPrev = document.querySelector("#dA_zoomImage_settings input[name=previewOpacity]").value;
					userSet.opacityHigh = document.querySelector("#dA_zoomImage_settings input[name=highOpacity]").value;
					userSet.marginPrev = document.querySelector("#dA_zoomImage_settings input[name=previewMargin]").value;

					userSet.opacityPrev = userSet.opacityPrev > 100 ? 100 : userSet.opacityPrev < 0 ? 0 : userSet.opacityPrev;
					userSet.opacityHigh = userSet.opacityHigh > 100 ? 100 : userSet.opacityHigh < 0 ? 0 : userSet.opacityHigh;
					userSet.marginPrev = userSet.marginPrev > 40 ? 40 : userSet.marginPrev < 0 ? 0 : userSet.marginPrev;

					diag.style.display = "none";

					document.querySelector("#dA_zoomImage_prevImg").style.opacity = userSet.opacityPrev + "%";
					document.querySelector("#dA_zoomImage_highR").style.opacity = userSet.opacityHigh + "%";
					resizePreview();

					GM.setValue("settings", JSON.stringify(userSet));
			});
			zoomCont.addEventListener("mouseup", function(ev) { //event delegation
					ev.preventDefault();
					switch (parseInt(ev.target.getAttribute("clickMode"))) {
							case clickModes.cont: //close zoom when clicking on free space
									//free space=outside zoom and preview-img
									if (coordInObj(ev.pageX, ev.pageY, prevImg) && coordInObj(ev.pageX, ev.pageY, zoomImg)) { //if inside, "mouseup" hide preview and highlight
											ev.stopPropagation();
											prevImg.style.visibility = 'hidden';
											highRec.style.visibility = 'hidden';
											break;
									}
									//no break, close window if free space ↓
									// falls through (eslint comment)
							case clickModes.close: //close zoom
									zoomCont.style.display = 'none';
									diag.style.display = "none";
									ev.stopPropagation();
									break;
							case clickModes.wide: //wide zoom mode button
									fullViewZoom(zoomModes.width);
									ev.stopPropagation();
									break;
							case clickModes.window: //window fit zoom mode button
									fullViewZoom(zoomModes.fit);
									ev.stopPropagation();
									break;
							case clickModes.height: //height zoom mode button
									fullViewZoom(zoomModes.height);
									ev.stopPropagation();
									break;
							case clickModes.real: //wide zoom mode button
									fullViewZoom(zoomModes.full);
									ev.stopPropagation();
									break;
							case clickModes.img: //basically mouseup, remove preview/highlight
							case clickModes.rect:
							case clickModes.preview:
									prevImg.style.visibility = 'hidden';
									highRec.style.visibility = 'hidden';
									ev.stopPropagation();
									break;
							case clickModes.setting:
									document.querySelector("#dA_zoomImage_settings input[name=previewOpacity]").value = userSet.opacityPrev;
									document.querySelector("#dA_zoomImage_settings input[name=highOpacity]").value = userSet.opacityHigh;
									document.querySelector("#dA_zoomImage_settings input[name=previewMargin]").value = userSet.marginPrev;
									diag.style.display = "block";
									ev.stopPropagation();
									break;
							case NaN: //no clickmode = propagate
									break;
							default: //unused clickmodes
									ev.stopPropagation();
									break;
					}
			});

			//zoom img at mouse position
			zoomCont.addEventListener('wheel', function(ev) {
					ev.preventDefault();
					ev.stopPropagation();

					if (Date.now() - lastZoomT < 20) return; //wheel at 50evt/s
					lastZoomT = Date.now();

					if (ev.deltaY < 0) { //first zoom,  then scroll. bit jitterish?
							zoomImg.style.width = zoomImg.clientWidth * 1.1 + "px";
							zoomImg.style.height = zoomImg.clientHeight * 1.1 + "px";
					} else if (ev.deltaY > 0) {
							zoomImg.style.width = zoomImg.clientWidth / 1.1 + "px";
							zoomImg.style.height = zoomImg.clientHeight / 1.1 + "px";
					}
					moveToXY(ev.pageX, ev.pageY);
			});

			//moveing cursor = moving image
			zoomCont.addEventListener("mousemove", function(ev) {
					ev.preventDefault();
					ev.stopPropagation();

					if (Date.now() - lastZoomT < 50) return; //move at 20evt/s debounce
					lastZoomT = Date.now();

					moveToXY(ev.pageX, ev.pageY);
			});

			//show preview/highrect on click/drag
			zoomCont.addEventListener("mousedown", function(ev) {
					ev.preventDefault();
					switch (parseInt(ev.target.getAttribute("clickMode"))) {
							case clickModes.img:
							case clickModes.rect:
							case clickModes.preview:
									prevImg.style.visibility = 'visible';
									highRec.style.visibility = 'visible';
									ev.stopPropagation();
									break;
							case NaN:
							default:
									break;
					}
			});

			//window resize = resize preview
			document.addEventListener("resize", function(ev) {
					if (Date.now() - lastResize < 100) return; //resize at 10evt/s debounce
					lastResize = Date.now();

					resizePreview();
			});
	}

	//watchdog function on interval 1s
	//dA browsing is js based, so DOM might change and watchdog reacts if elements are applicable.
	function addDragger(mutationList, observer) {
			//  document.querySelectorAll("img[src*=wix]")
			let imgs = document.querySelectorAll("img[src*=wix]:not([dA_zoomImage])");//document.querySelector("div[data-hook=art_stage] img:not([dA_zoomImage])"); //react on art_stage-divs, once per element
			imgs.forEach(el=>{
					if (el != null) {
							el.setAttribute("dA_zoomImage", 1);
							// el.setAttribute("draggable", "false");
							img = el;

							//show zoom window
							el.addEventListener("click", function(ev) {
									if (!el.hasAttribute("fetchpriority")&&!ev.shiftKey)return;

									ev.stopPropagation();
									ev.preventDefault();
									img=ev.target;
									checkURL();
									zoomCont.style.display = 'block';
									prevImg.style.visibility = 'hidden';
									highRec.style.visibility = 'hidden';
							});
					}
			});
			addElements();
			//add elements;
			//addZoomElements();
	}


	//load settings, add custom style,  execute script
	GM.getValue("settings", "").then((val) => {
			if (val == "") return;
			userSet = JSON.parse(val);
			if (!userSet.hasOwnProperty("marginPrev")) userSet.marginPrev = 10; //default, backwards compability to v1.1
			if (!userSet.hasOwnProperty("lastZoom")) userSet.lastZoom = zoomModes.fit; //default, backwards compability to v1.5
	}).finally(() => {
			let style = document.createElement('style');
			style.textContent = `
	#dA_zoomImage_zoomImg{position:absolute;z-index:90;inset:0;margin:auto;}
	#dA_zoomImage_prevImg{position:fixed;visibility:hidden;cursor:move;z-index:90;margin:auto;opacity:${userSet.opacityPrev}%;}
	#dA_zoomImage_highR{position:fixed;border:2px solid #475c4daa;box-shadow:0px 0px 10px white inset;visibility:hidden;box-sizing:border-box;z-index:91;margin:auto;inset:0;opacity:${userSet.opacityHigh}%;}
	#dA_zoomImage_navigation{position:fixed;top:0;right:0;z-index:99;opacity:0.2}
			#dA_zoomImage_navigation:hover{opacity:1}
	#dA_zoomImage_navigation>div{cursor:pointer;background-color: var(--g-bg-tertiary);border-radius: 50px;
		line-height: 27px;text-align: center;width:30px;height:30px;margin:10px;padding:5px;font-size: larger;}
	#dA_zoomImage_navigation>div * {pointer-events: none;}
	#dA_zoomImage_zoomCont{position: fixed;z-index: 99;top: 0;left: 0;right: 0;bottom: 0;background: var(--g-bg-primary);display:none;}
	#dA_zoomImage_settings {position: fixed;top: 0;left: 0;right: 0;bottom: 0;z-index: 99;width: 400px;height: 120px;margin: auto;background-color: var(--g-bg-primary);padding: 10px;border-radius: 10px;border: 5px ridge var(--typography-tertiary-light);
		box-shadow: 3px 3px 5px black;}
	#dA_zoomImage_settings_OK{position: absolute;right: 10px;bottom: 10px;color: var(--typography-primary);padding: 5px;border-radius: 5px;border: 1px solid var(--typography-primary);cursor: pointer;}
	#dA_zoomImage_settings_OK:hover{box-shadow: inset 0 0 6px var(--typography-primary);}
			.shift_pressed img[da_zoomimage]{cursor:${zoomCursor}!important}
			img[da_zoomimage][fetchpriority]{cursor:${zoomCursor}!important}
`.replace(/\s\s+/g, ""); //indentation removed from string
			document.head.appendChild(style);

			document.body.addEventListener("keydown",(ev)=>{if(ev.shiftKey)document.body.classList.add("shift_pressed");;});
			document.body.addEventListener("keyup",(ev)=>{if(!ev.shiftKey);document.body.classList.remove("shift_pressed");});

			//start watchdog, 1s interval.
			const observer = new MutationObserver(addDragger);
			observer.observe(document.body,{ childList: true, subtree: true });

	});



})();
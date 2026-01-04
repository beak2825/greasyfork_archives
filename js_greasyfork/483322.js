// ==UserScript==
// @name         Bonk Skin Editor Overlay
// @version      0.3
// @author       Salama
// @description  Adds an image overlay to skin editor
// @match        https://*.bonk.io/gameframe-release.html
// @match        https://*.bonkisback.io/gameframe-release.html
// @run-at       document-end
// @grant        none
// @license      GPL-3.0-or-later
// @supportURL   https://discord.gg/Dj6usq7ww3
// @namespace    https://greasyfork.org/users/824888
// @downloadURL https://update.greasyfork.org/scripts/483322/Bonk%20Skin%20Editor%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/483322/Bonk%20Skin%20Editor%20Overlay.meta.js
// ==/UserScript==

(function() {
	'use strict';

	let overlay = document.createElement("div");
	let menu = document.createElement("div");

	document.getElementById("skineditor_previewbox_skincontainer").appendChild(overlay);
	document.getElementById("skineditor_previewbox").appendChild(menu);

	overlay.outerHTML = `<div>
	<img id="skineditor_imageoverlay" style="
	touch-action: none;
	cursor: inherit;
	position: absolute;
	left: 0;
	top: 0;
	pointer-events: none;
	opacity: 0.8;
	display: none;
	opacity: 0.5;
	z-index: 9998;
	display: none;
	">

	<canvas id="skineditor_imageoverlaycanvas" width="245" height="245" style="
	touch-action: none;
	cursor: inherit;
	position: absolute;
	left: 0;
	top: 0;
	pointer-events: none;
	opacity: 0.5;
	"></canvas>
</div>
	</div>`;

	menu.outerHTML = `<div>
	<div class="newbonklobby_playerentry_balancecontainer brownButton brownButton_classic" style="
	position: absolute;
	bottom: 58px;
	width: 40%;
	margin-left: 30%;
	margin-right: 10%;
	">
	<div class="newbonklobby_playerentry_balancetext">Overlay Opacity</div>
	<input id="skineditor_opacityslider" type="range" min="0" max="100" step="1" value="50" class="compactSlider slider newbonklobby_playerentry_balanceslider" style="
	width: 90%;
	">
	</div>
	<div id="skineditor_filechooser" class="brownButton brownButton_classic buttonShadow" style="
	width: 64px;
    bottom: 58px;
    left: 5%;
    position: absolute;
    height: 35px;
	font-size: 14px;
">Select Overlay</div>
	</div>`;

	// Preview size
	const ps = 245;
	let overlaySelected = false;

	let imageOffset = {x:0,y:0}
	let flipX = false;
	let flipY = false;

	let ctx = document.getElementById("skineditor_imageoverlaycanvas").getContext("2d");
	let scale = 1, angle = 0, d, x, y, image = document.getElementById("skineditor_imageoverlay");
	overlay = document.getElementById("skineditor_imageoverlay");

	const drawOverlay = () => {
		ctx.save();
		ctx.clearRect(0, 0, ps, ps);
		ctx.setTransform(scale * (flipX ? -1 : 1), 0, 0, scale * (flipY ? -1 : 1), ps/2 + imageOffset.x, ps/2 + imageOffset.y);
		ctx.rotate(angle);
		ctx.drawImage(document.getElementById("skineditor_imageoverlay"), -image.width/2, -image.height/2, image.width, image.height);
		ctx.restore();
		overlay.style.rotate = `${angle}rad`;
		overlay.style.transform = `scale(${scale * (flipX ? -1 : 1)}, ${scale * (flipY ? -1 : 1)})`;
		overlay.style.left = `${(ps - image.width) / 2 + imageOffset.x}px`;
		overlay.style.top = `${(ps - image.height) / 2 + imageOffset.y}px`;
	}

	document.getElementById("skineditor_filechooser").addEventListener("click", () => {
		let a = document.createElement("input");
		a.type = 'file';
		document.body.appendChild(a);
		a.onchange = e => {
			let file = e.target.files[0];
			image.src = URL.createObjectURL(file);
			document.getElementById("skineditor_imageoverlay_preview").src = image.src;
			image.onload = () => {
				image.style.visibility = "visible";
				image.style.display = "";
				ctx.clearRect(0, 0, ps, ps);
				let imageRatio = image.naturalWidth / image.naturalHeight;
				if(image.naturalWidth > image.naturalHeight) {
					image.width = ps;
					image.height = ps / imageRatio;
					image.style.top = (ps - image.height) / 2;
				}
				else {
					image.width = ps * imageRatio;
					image.height = ps;
					image.style.left = (ps - image.width) / 2;
				}

				angle = 0;
				scale = 1;
				imageOffset = {x:0,y:0};
				image.style.rotate = "0rad";
				image.style.scale = 1;
				image.style.top = (ps - image.height) / 2;
				image.style.left = (ps - image.width) / 2;
				flipX = false;
				flipY = false;

				if(overlaySelected) {
					document.getElementById("skineditor_propertiesbox_table_x").value = imageOffset.x;
					document.getElementById("skineditor_propertiesbox_table_y").value = imageOffset.y;
					document.getElementById("skineditor_propertiesbox_table_angle").value = angle / Math.PI * 180;
					document.getElementById("skineditor_propertiesbox_table_scale").value = scale.toFixed(2);
					document.getElementById("skineditor_propertiesbox_table_flipx").textContent = flipX ? "Yes" : "No";
					document.getElementById("skineditor_propertiesbox_table_flipy").textContent = flipY ? "Yes" : "No";
				}
				drawOverlay();
			}
		};
		a.click();
		document.body.removeChild(a);
	});

	document.getElementById("skineditor_opacityslider").addEventListener("input", e => {
		document.getElementById("skineditor_imageoverlaycanvas").style.opacity = e.target.value / 100;
		document.getElementById("skineditor_imageoverlay").style.opacity = e.target.value / 100;
	});

	const layerObserver = new MutationObserver(mutations => {
		for(let mutation of mutations) {
			for(let node of mutation.addedNodes) {
				if(node.nodeName === "TR" && node.id === "0") {

					let overlayLayer = document.createElement("tr");

					overlayLayer.classList = ["HOVERUNSELECTED"];

					overlayLayer.id = "-1";

					overlayLayer.addEventListener("click", () => {
						node.onclick.apply(overlayLayer);
						overlaySelected = true;
						// Execution will be continued in shape window's mutation observer
					});

					document.getElementById("skineditor_layerbox_layertable").children[0].insertBefore(overlayLayer, node);
					overlayLayer.innerHTML = `
					<td>
						<span class="skineditor_layerbox_layername">Overlay</span>
							<div class="skineditor_layerbox_layerpreview">
							<img src="${image.src}" onload="this.style.display=''" onerror="this.style.display='none'" class="skineditor_layerbox_layerpreview_image" id="skineditor_imageoverlay_preview" style="display:none;">
						</div>
					</td>`;
				}
				else if(node.id !== "-1") {
					node.addEventListener("click", () => {
						document.getElementById("skineditor_propertiesbox_table_shape").parentNode.parentNode.style.display = "";
						document.getElementById("skineditor_propertiesbox_colorrect").parentNode.parentNode.style.display = "";
						document.getElementById("skineditor_imageoverlaycanvas").style.display = "";
						image.style.display = "none";

						document.getElementById("skineditor_propertiesbox_upbutton").style.display = "";
						document.getElementById("skineditor_propertiesbox_downbutton").style.display = "";
						document.getElementById("skineditor_propertiesbox_deletebutton").style.display = "";
						overlaySelected = false;
						drawOverlay();
					});
				}
			}
		}
	});

	const shapePickerObserver = new MutationObserver(mutations => {
		if(!overlaySelected) return;
		for(let mutation of mutations) {
			if(mutation.type === "attributes" && mutation.attributeName === "style" &&
			   mutation.target === document.getElementsByClassName("skineditor_shapewindow")[0]) {
				// It's actually the shape window close button with a wrong class name
				mutation.target.getElementsByClassName("skineditor_basiccolorpicker_closebutton")[0].click();

				for(let child of document.getElementById("skineditor_layerbox_layertable").children[0].children) {
					child.classList = ["HOVERUNSELECTED"];
				}
				document.getElementById("skineditor_layerbox_layertable").children[0].children[0].classList = ["HOVERSELECTED"];

				// Show properties menu
				document.getElementById("skineditor_propertiesbox_blocker").style.visibility = "hidden";

				document.getElementById("skineditor_propertiesbox_table_x").value = imageOffset.x.toFixed(2);
				document.getElementById("skineditor_propertiesbox_table_y").value = imageOffset.y.toFixed(2);
				document.getElementById("skineditor_propertiesbox_table_angle").value = (angle / Math.PI * 180).toFixed(2);
				document.getElementById("skineditor_propertiesbox_table_scale").value = scale.toFixed(2);
				document.getElementById("skineditor_propertiesbox_table_flipx").textContent = flipX ? "Yes" : "No";
				document.getElementById("skineditor_propertiesbox_table_flipy").textContent = flipY ? "Yes" : "No";

				document.getElementById("skineditor_propertiesbox_table_shape").parentNode.parentNode.style.display = "none";
				document.getElementById("skineditor_propertiesbox_colorrect").parentNode.parentNode.style.display = "none";
				document.getElementById("skineditor_imageoverlaycanvas").style.display = "none";
				document.getElementById("skineditor_imageoverlay").style.display = "";

				document.getElementById("skineditor_propertiesbox_upbutton").style.display = "none";
				document.getElementById("skineditor_propertiesbox_downbutton").style.display = "none";
				document.getElementById("skineditor_propertiesbox_deletebutton").style.display = "none";

			}
		}
	});

	layerObserver.observe(document.getElementById("skineditor_layerbox_layertable"), {attributes: false, childList: true, subtree: true});
	shapePickerObserver.observe(document.getElementById("skineditor_propertiesbox"), {attributes: true, childlist: false, subtree: true});

	document.getElementById("skineditor_propertiesbox_table_x").addEventListener("input", e => {
		if(!overlaySelected) return;
		imageOffset.x = parseFloat(e.target.value);
		if(isNaN(imageOffset.x)) {
			imageOffset.x = 0;
		}
		drawOverlay();
	});
	document.getElementById("skineditor_propertiesbox_table_y").addEventListener("input", e => {
		if(!overlaySelected) return;
		imageOffset.y = parseFloat(e.target.value);
		if(isNaN(imageOffset.y)) {
			imageOffset.y = 0;
		}
		drawOverlay();
	});
	document.getElementById("skineditor_propertiesbox_table_angle").addEventListener("input", e => {
		if(!overlaySelected) return;
		angle = parseFloat(e.target.value) / 180 * Math.PI;
		if(isNaN(angle)) {
			angle = 0;
		}
		drawOverlay();
	});
	document.getElementById("skineditor_propertiesbox_table_scale").addEventListener("input", e => {
		if(!overlaySelected) return;
		scale = parseFloat(e.target.value);
		if(isNaN(scale)) {
			scale = 1;
		}
		drawOverlay();
	});

	document.getElementById("skineditor_propertiesbox_table_flipx").addEventListener("click", e => {
		if(!overlaySelected) return;
		flipX = !flipX;
		e.target.textContent = flipX ? "Yes" : "No";
		drawOverlay();
	});

	document.getElementById("skineditor_propertiesbox_table_flipy").addEventListener("click", e => {
		if(!overlaySelected) return;
		flipY = !flipY;
		e.target.textContent = flipY ? "Yes" : "No";
		drawOverlay();
	});

	const handleButton = e => {
		switch(e.target.id) {
			case "skineditor_x_up":
				imageOffset.x += 0.1;
				document.getElementById("skineditor_propertiesbox_table_x").value = imageOffset.x.toFixed(1);
				break;
			case "skineditor_x_down":
				imageOffset.x -= 0.1;
				document.getElementById("skineditor_propertiesbox_table_x").value = imageOffset.x.toFixed(1);
				break;
			case "skineditor_y_up":
				imageOffset.y += 0.1;
				document.getElementById("skineditor_propertiesbox_table_y").value = imageOffset.y.toFixed(1);
				break;
			case "skineditor_y_down":
				imageOffset.y -= 0.1;
				document.getElementById("skineditor_propertiesbox_table_y").value = imageOffset.y.toFixed(1);
				break;
			case "skineditor_angle_up":
				angle += 1 / 180 * Math.PI;
				document.getElementById("skineditor_propertiesbox_table_angle").value++;
				break;
			case "skineditor_angle_down":
				angle -= 1 / 180 * Math.PI;
				document.getElementById("skineditor_propertiesbox_table_angle").value--;
				break;
			case "skineditor_scale_up":
				if(scale < 0.2) {
					scale += 0.005;
				}
				else {
					scale += 0.01;
				}
				document.getElementById("skineditor_propertiesbox_table_scale").value = scale.toFixed(2);
				break;
			case "skineditor_scale_down":
				if(scale < 0.2) {
					scale -= 0.005;
				}
				else {
					scale -= 0.01;
				}
				document.getElementById("skineditor_propertiesbox_table_scale").value = scale.toFixed(2);

				break;
		}
		drawOverlay();
	}

	let buttonTimeout;
	const editorButtonUp = () => {
		// Clears interval too
		clearTimeout(buttonTimeout);
		window.removeEventListener("mouseup", editorButtonUp);
	}
	const editorButtonDown = e => {
		if(!overlaySelected) return;
		handleButton(e);

		window.addEventListener("mouseup", editorButtonUp);

		buttonTimeout = setTimeout(() => {
			handleButton(e);
			buttonTimeout = setInterval(() => {
				handleButton(e);
			}, 30);
		}, 400);
	}

	for(let button of document.getElementsByClassName("skineditor_field_button")) {
		button.addEventListener("pointerdown", editorButtonDown);
	}

	document.getElementById("skinmanager_edit").addEventListener("click", () => {
		angle = 0;
		scale = 1;
		imageOffset = {x:0,y:0};
		image.style.rotate = "0rad";
		image.style.scale = 1;
		image.style.top = (ps - image.height) / 2;
		image.style.left = (ps - image.width) / 2;
		flipX = false;
		flipY = false;

		image.style.display = "none";
		image.style.visibility = "hidden";
		image.src = "";
		if(document.getElementById("skineditor_imageoverlay_preview")) {
			document.getElementById("skineditor_imageoverlay_preview").style.display = "none";
			document.getElementById("skineditor_imageoverlay_preview").src = "";
		}
		ctx.clearRect(0, 0, ps, ps);
	});
})();
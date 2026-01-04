// ==UserScript==
// @name         dA_FilterNotifications
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  filter notifications by type
// @author       Dediggefedde
// @match        https://www.deviantart.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deviantart.com
// @grant        GM.addStyle
// @grant        GM.getValue
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/445528/dA_FilterNotifications.user.js
// @updateURL https://update.greasyfork.org/scripts/445528/dA_FilterNotifications.meta.js
// ==/UserScript==

//@ts-nocheck
/**
	Adds a bar on deviantart /notification page and sidebar
	The bar provides buttons to filter and search within displayed elements

	TODO: trigger fill if filter reduces elements
*/

(function() {
	"use strict";

	GM.addStyle(`
#dA_FN_bar{display:flex;position: sticky;top: 0;z-index: 1;background-color: var(--g-bg-primary);}
#dA_FN_bar>div{cursor:pointer;user-select:none}
#dA_FN_bar>div:hover{filter: brightness(120%) saturate(150%) invert(20%);}
#dA_FN_filterText{height: 1.2em;}
.da_FN_selected{border:1px solid red;}
.dA_FN_hidden{display:none;}
.dA_FN_markHidden .dA_FN_hidden{display:block;}
.dA_FN_markHidden .dA_FN_hidden button{ background-image:repeating-linear-gradient(45deg, #ffffff3b 0%, white 2%, #fdfdfd3b 2%,#c1c1c100 4%, white 4%);}
.dA_FN_filtered{display:none;}
#dA_FN_HideSel[active='2'] ellipse { fill: lightgray;}/*2: hiding=grey*/
#dA_FN_HideSel[active='2'] ellipse[role='iris'] { fill: lightgray;stroke:lightgray}/*2: hiding=grey*/
#dA_FN_HideSel[active='0'] ellipse[role='iris'] { fill: lightgray;stroke:red} /*0: hide selected=red*/
			.da_fN_notSelect{user-select:none!important}
#dA_FN_settings{width:30vw;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background-color:#edffea;display:grid;grid-template-columns: 80% auto;grid-template-rows: 3em repeat(5,2em) 7em 2em;	grid-gap: 10px;padding: 5px;border-radius: 10px;border: 1px ridge;box-shadow: 2px 2px 10px #777;align-items: center;user-select:none;}
#dA_FN_customCSS {grid-column: 1 /span 2;resize:none;height:100%;}
#dA_FN_settings .dA_FN_setBtn{grid-column: 1/span 2; text-align: center;}
#dA_FN_OKBtn {width: 100px;cursor: pointer;}
#dA_FN_settings input[type=checkbox]{cursor: pointer;}
#dA_FN_settings label{cursor: pointer;width:100%;}
#dA_FN_settings h3{grid-column:1 /span 2;font-weight: bold;text-align: center;font-size: larger;}
#dA_FN_cancelBtn{cursor: pointer;position:absolute;top:2px;right:2px;background-color:transparent;border:none;font-size:larger;}
#dA_FN_cancelBtn:hover{color: #ccc;}
#dA_FN_settingBtn{position: absolute;top: 2px;right: 2px;width: 20px;height: 20px;cursor: pointer;}
`);

	//const itemClasses = ["_375AY", "_2TKoM", "_3PCaz", "_2VY4V"]; //possible classes for notification list item div
	const itemClassXPath = "//section//div[@data-bucket]/parent::div";
	let itemClass = "_375AY";
	const filterInterval = 200; //ms
	let filterTimer;
	/**@type {HTMLElement} */
	let cont = null; //container of items

	let selRec = { left: 0, top: 0, width: 0, height: 0 }; //div element of selection rectangle
	let selAnc = { x: 0, y: 0 }; //initial point where you started selecting
	let dragSel = false; //selection rectangle visible

	//button images
	const CommBtnSvg = '<svg width="24" height="24" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path fill-rule="evenodd" d="M20 3H6.414a1 1 0 00-.707.293L3.293 5.707A1 1 0 003 6.414V16a1 1 0 001 1h3v3a1 1 0 001 1h1.5a1 1 0 00.8-.4L13 17h4.586a1 1 0 00.707-.293l2.414-2.414a1 1 0 00.293-.707V4a1 1 0 00-1-1z"></path></svg>';
	const LlamaBtnSvg = '<svg width="24" height="24" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M17 5v7h1v3h-1v6h-3v-3h-1v3H9v-1H8v-3H7v-2H6v-2h1v-1h1v-1h4V5h-1V4h1V3h2v1h1V3h2v1h1v1h-1z"></path></g></svg>';
	const DevBtnSvg = '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18 3a1 1 0 011 1v15.674a1 1 0 01-1.275.962L12 19l-5.725 1.636A1 1 0 015 19.674V4a1 1 0 011-1h12zm-3 3h-1.763l-.175.183-.832 1.635-.262.182H9v2.497h1.632l.145.181L9 14.182V16h1.763l.176-.183.831-1.635.262-.182H15v-2.497h-1.632l-.145-.183L15 7.818V6z" fill-rule="evenodd"></path></svg>';
	const HideBtn = '<svg width="24" height="24"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 250" stroke-width="20"> <defs> <radialGradient id="c1" cx="0.5" cy="0.5" r="0.5"> <stop offset="0" stop-color="#ffffff" /> <stop offset=".5" stop-color="hsl(40, 60%, 60%)" /> <stop offset="1" stop-color="#3dff3d" /> </radialGradient> </defs> <ellipse role="sclera" cx="250" cy="125" rx="200" ry="100" fill="white"/> <ellipse role="iris" cx="250" cy="125" rx="95" ry="95" stroke="black" fill="url(#c1)"/> <ellipse role="pupil" cx="250" cy="125" rx="50" ry="50" stroke="none" fill="black"/> <ellipse role="light" cx="200" cy="80" rx="50" ry="50" stroke="none" fill="#fffffaee"/> <ellipse role="outline" cx="250" cy="125" rx="200" ry="100" stroke="black" fill="none"/> </svg>'
	const ImgGear = '<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.444057 20.232336" > <g transform="translate(-15.480352,-5.6695418)">  <g transform="matrix(0.26458333,0,0,0.26458333,25.702381,15.78571)"  style="fill:#000000">  <path  style="fill:#000000;stroke:#000000;stroke-width:1"  d="m 28.46196,-3.25861 4.23919,-0.48535 0.51123,0.00182 4.92206,1.5536 v 4.37708 l -4.92206,1.5536 -0.51123,0.00182 -4.23919,-0.48535 -1.40476,6.15466 4.02996,1.40204 0.45982,0.22345 3.76053,3.53535 -1.89914,3.94361 -5.1087,-0.73586 -0.4614,-0.22017 -3.60879,-2.2766 -3.93605,4.93565 3.02255,3.01173 0.31732,0.40083 1.8542,4.81687 -3.42214,2.72907 -4.2835,-2.87957 -0.32017,-0.39856 -2.26364,-3.61694 -5.68776,2.73908 1.41649,4.0249 0.11198,0.49883 -0.41938,5.14435 -4.26734,0.97399 -2.6099,-4.45294 -0.11554,-0.49801 -0.47013,-4.2409 h -6.31294 l -0.47013,4.2409 -0.11554,0.49801 -2.6099,4.45294 -4.26734,-0.97399 -0.41938,-5.14435 0.11198,-0.49883 1.41649,-4.0249 -5.68776,-2.73908 -2.26364,3.61694 -0.32017,0.39856 -4.2835,2.87957 -3.42214,-2.72907 1.8542,-4.81687 0.31732,-0.40083 3.02255,-3.01173 -3.93605,-4.93565 -3.60879,2.2766 -0.4614,0.22017 -5.1087,0.73586 -1.89914,-3.94361 3.76053,-3.53535 0.45982,-0.22345 4.02996,-1.40204 -1.40476,-6.15466 -4.23919,0.48535 -0.51123,-0.00182 -4.92206,-1.5536 v -4.37708 l 4.92206,-1.5536 0.51123,-0.00182 4.23919,0.48535 1.40476,-6.15466 -4.02996,-1.40204 -0.45982,-0.22345 -3.76053,-3.53535 1.89914,-3.94361 5.1087,0.73586 0.4614,0.22017 3.60879,2.2766 3.93605,-4.93565 -3.02255,-3.01173 -0.31732,-0.40083 -1.8542,-4.81687 3.42214,-2.72907 4.2835,2.87957 0.32017,0.39856 2.26364,3.61694 5.68776,-2.73908 -1.41649,-4.0249 -0.11198,-0.49883 0.41938,-5.14435 4.26734,-0.97399 2.6099,4.45294 0.11554,0.49801 0.47013,4.2409 h 6.31294 l 0.47013,-4.2409 0.11554,-0.49801 2.6099,-4.45294 4.26734,0.97399 0.41938,5.14435 -0.11198,0.49883 -1.41649,4.0249 5.68776,2.73908 2.26364,-3.61694 0.32017,-0.39856 4.2835,-2.87957 3.42214,2.72907 -1.8542,4.81687 -0.31732,0.40083 -3.02255,3.01173 3.93605,4.93565 3.60879,-2.2766 0.4614,-0.22017 5.1087,-0.73586 1.89914,3.94361 -3.76053,3.53535 -0.45982,0.22345 -4.02996,1.40204 z"  />  <circle  style="fill:#ffffff;stroke:#000000;stroke-width:1"  cx="0"  cy="0"  r="15" />  </g>  </g> </svg>';


	const SettingFormTmpl = `<h3>dA_FilterNotification Settings</h3>
		<label for="dA_FN_FilterSide">Show Sidebar</label><input type="checkbox" id="dA_FN_FilterSide"/>
		<label for="dA_FN_DragSelect">Drag to Select</label><input type="checkbox" id="dA_FN_DragSelect"/>
		<label for="dA_FN_UpdateCSS">Clean Up CSS</label><input type="checkbox" id="dA_FN_UpdateCSS"/>
		<label for="dA_FN_RemSiteNotes">Remove Site Messages</label><input type="checkbox" id="dA_FN_RemSiteNotes"/>
		<label for="dA_FN_useCustomCSS">Custom CSS</label><input type="checkbox" id="dA_FN_useCustomCSS"/>
		<textarea id="dA_FN_customCSS"></textarea>
		<div class="dA_FN_setBtn"><button id="dA_FN_OKBtn">OK</button></div>
		<button id='dA_FN_cancelBtn'>X</button>
	`; //#dA_FN_settings
	let settingForm;
	let settings = { filterSide: true, dragSelect: true, updateCss: true, useCustomCss: false, customCss: "",removeSiteNotes:true };

	const CSSInsertTMPL = `
	div[data-nc] * {visibility: visible;} /* buttons do not vanish*/
	div[data-nc] button[data-hook="user_watch_button"] {display: none;} /*removes watch/unwatch buttons*/
	[aria-label="Remove"] svg:hover {fill: red !important;} /*unify remove buttons hover color*/
	div[data-nc*="favecollect"] > section > div > div:nth-child(2) {display: none;} /*remove activity gallery for new favourites*/
	div[data-nc*="new_watcher"] > section > div > div:nth-child(2) {display: none;} /*remove activity gallery for watchers*/
	div[data-nc*="badge_given"] > section > div > div:nth-child(2) {display: none;} /*remove activity gallery for Llamas*/
	[role="presentation"] {display: none;} /*remove background image from deviation fullview*/
	a[data-hook="deviation_link"] img {object-fit: contain;} /*make thumbnails contain full image*/
						input[type="checkbox"] + div svg { fill: #0000;}
						input[type="checkbox"]:checked + div svg { fill: #000F;}
	`

	const Fm = { show: 0, hide: 1, only: 2 }; //filter mode
	const Ftext = { //text used as regexp for each filter
			yourComment: ".*Your comment.*",
			yourLlama: ".*(Your (Llama badges|transactions|mentions|watchers))|(011-1h16zm-1 2H5v14h14V5zm-4)|(01.68-.182l.862.505c.2).*",
			yourDevs: "<img",
			text: ".*##ftext##.*"
	};
	let cssIntval = null;

	let filter = { //applied filter settings. text regexp /i.
			yourComment: Fm.show,
			yourLlama: Fm.show,
			yourDevs: Fm.show,
			text: "",
			version: 0.1
	};
	let showHidden = false; //disable custom hidden buckets
	let hideBuckets = new Set(); //list of buckets to hide from view
	let shiftPressed = false; //shift pressed to prevent selection

	function improveLayout() {
			if (settings.updateCss || settings.useCustomCss) {
					let sty = document.getElementById("dA_FN_improveCSS");
					if (sty == null) {
							let sty = document.createElement("style");
							sty.id = 'dA_FN_improveCSS';
							if (settings.useCustomCss)
									sty.innerHTML = settings.customCss;
							else
									sty.innerHTML = CSSInsertTMPL;

							document.head.appendChild(sty);
					}
			}

			if (!settings.updateCss) return;
			clearInterval(cssIntval);
			cssIntval = setInterval(() => {
					let it = document.evaluate("//h2[contains(., 'All Notifications')]/parent::div/parent::div/preceding-sibling::*", document).iterateNext(); //banner behind "all notification"

					if (it != null) {
							it.style.filter = "opacity(0.3) blur(1px)"; //option 1: less dominant title pic
							it.parentNode.parentNode.style.display = "none"; // option 2: no title pic
							it.parentNode.parentNode.nextSibling.style.marginTop = "20px";
							let readAllBut=document.evaluate("//button[contains(.,'Mark All as Read')]",document).iterateNext();
							if(readAllBut!=null){
									it.parentNode.parentNode.before(readAllBut);
									readAllBut.style="margin:0;position:absolute;top:0;left:50%;transform:translateX(-50%);";
							}
					}

					it = document.querySelectorAll("div[data-nc]"); //no wasted space on large screens (old limit 1024px)
					it.forEach(el=>{el.parentNode.style.maxWidth = "unset";});

					if (settings.removeSiteNotes && cont != null){
							let adel=cont.querySelector("section");
							if(adel!=null)
									adel.style.display = "none"; //hide advertisement on top of left bar
					}
			}, 1000);
	}

	/**
	 * btn object, mode fm-mode, texts array of text [3]
	 * @param {string} btnId DOM id of button to change title and color
	 * @param {number} mode new mode of filter related to button
	 * @param {Array<string>} texts title text array [show,hide,only]
	 */
	//
	function updateButton(btnId, mode, texts) {
			/** @type {HTMLElement} */
			let btn = document.querySelector(btnId);
			if (btn == null) return;
			switch (mode) {
					case Fm.hide:
							btn.style.fill = "grey";
							break;
					case Fm.only:
							btn.style.fill = "red";
							break;
					case Fm.show:
							btn.style.fill = "";
							break;
			}
			btn.title = texts[mode];
	}

	/** adapts GUI to settings */
	function updateGUI() {
			updateButton("#dA_FN_hideYourCom", filter.yourComment, [
					"Your comments are shown",
					"Your comments are hidden",
					"Only your comments are shown"
			]);
			updateButton("#dA_FN_hideYourLlama", filter.yourLlama, [
					"Your Correspondence is shown",
					"Your Correspondence are hidden",
					"Only your Correspondence are shown"
			]);
			updateButton("#dA_FN_hideYourDevs", filter.yourDevs, [
					"Your Deviations are shown",
					"Your Deviations are hidden",
					"Only your Deviations are shown"
			]);

			/**@type {HTMLDivElement} */
			let hidespan = document.querySelector("#dA_FN_HideSel");
			if (hidespan) {
					if (document.getElementsByClassName("da_FN_selected").length == 0) {
							if (showHidden) {
									hidespan.title = "Hide Hidden";
									hidespan.setAttribute("active", "1");
									cont.classList.add("dA_FN_markHidden");
							} else {
									hidespan.title = "Show Hidden";
									hidespan.setAttribute("active", "2");
									cont.classList.remove("dA_FN_markHidden");
							}
					} else {
							if (showHidden) {
									hidespan.title = "Unhide";
							} else {
									hidespan.title = "Hide";
							}
							hidespan.setAttribute("active", "0");
					}
			}
	}

	/**
	 * Event Handler Filter Button Click
	 * Iterates show-hide-only-show
	 * updates GUI, applies filter
	 * @param {*} ev Mouse Click Event
	 * @param {*} filt related filter in fm
	 */
	function btnIterateStateClick(ev, filt) {
			filter[filt] = (filter[filt] + 1) % 3; //iterate: show-hide-only-show

			if (filter[filt] == Fm.only) {
					filter.yourComment = Fm.show;
					filter.yourDevs = Fm.show;
					filter.yourLlama = Fm.show;

					filter[filt] = Fm.only;
			}

			updateGUI();
			filterDOMList(); //apply filter
			saveSettings();
	}

	/** @type {Array<HTMLElement>} */
	let listEls = [];

	/** refreshes internal list of DOM elements */
	function grabList() {
			listEls = Array.from(document.querySelectorAll(`.${itemClass}`));
	}

	/**
	 * Apply filter to DOM elements in listEls
	 * Text filter uses regexp.
	 * TODO: does not trigger "load more" when list gets smaller than sidebar
	 *  */
	function filterDOMList() {
			/** @type {Array<HTMLElement>} */
			let elsA = []; //to be filled with elements to hide
			if (listEls.length == 0) return;

			listEls.forEach(el => {
					el.classList.remove("dA_FN_filtered");
					el.classList.remove("dA_FN_hidden");
			});

			//iterate through filters, Or-Connect list of elements to hide, fill elsA (iterateNext fails if DOM is changed here)
			Object.entries(filter).forEach(fel => {
					if (fel[0] == "text" && fel[1] != "") {
							let reg = new RegExp(fel[1], "i");
							elsA = elsA.concat(
									listEls.filter(lisEl => {
											return !reg.test(lisEl.innerHTML);
									})
							);

					} else {
							let reg = new RegExp(Ftext[fel[0]]);
							elsA = elsA.concat(
									listEls.filter(lisEl => {
											let regtst = reg.test(lisEl.innerHTML);
											return (fel[1] == Fm.only && !regtst) ||
													(fel[1] == Fm.hide && regtst);
									})
							);
					}

			});

			//hide elements
			elsA.forEach((el) => {
					el.classList.add("dA_FN_filtered");
			});

			//hide custom hidden elements
			hideBuckets.forEach(el => {
					/**@type{HTMLElement} */
					let bck = document.querySelector(`[data-bucket='${el}']`);
					if (bck == null) return;
					bck = bck.closest(`.${itemClass}`);
					if (bck != null)
							bck.classList.add("dA_FN_hidden");
			});

			//load more if end of list is visible
			var lastBnds = listEls[listEls.length - 1].getBoundingClientRect();
			if (lastBnds.bottom < cont.clientHeight) {
				 // console.log("load more please!")
							//all shown, load of more required.
							//no idea how to trigger
			}
	}

	/** Helper function checks overlap between 2 rectangles
	//  * requires top, height, left and width
	//  * @param {DOMRect} a first rectangle 
	//  * @param {DOMRect} b second rectangle
	//  * @param {Number} ov ignored overlap margin
	//  * @returns boolean wether both rectangles have an overlap
	//  */
	function isCollide(a, b, ov) {
			return !(
					((a.top + a.height + ov) < (b.top)) ||
					(a.top > (b.top + b.height + ov)) ||
					((a.left + a.width + ov) < b.left) ||
					(a.left > (b.left + b.width + ov))
			);
	}

	/** attachs handlers for selection rectangle and selecting itemClass  */
	function applyDragSelectHandler() {
			if (!settings.dragSelect) return;
			//the rectangle
			selRec = document.createElement("div");
			selRec.id = "dA_fM_select";
			selRec.setAttribute("style", "display:none;position:absolute;z-index:1;top:0px;bottom:0px;width:0px;height:0px;background:#a008;");
			document.body.append(selRec);

			let cntCl = `.${cont.className.replace(/\s+/gi,".")}`;

			//starting rectangle
			document.body.addEventListener("mousedown", (ev) => {
					//if (ev.target.closest(cntCl) == null) return;
					if (ev.target.closest("#dA_FN_settings") != null) return;
					if (shiftPressed) return; //no selection when shift is pressed (text-select)
					if (ev.target.closest("#dA_FN_bar") != null) return;
					dragSel = true;
					selAnc.x = ev.clientX;
					selAnc.y = ev.clientY;
					selRec.style.left = selAnc.x + "px";
					selRec.style.top = selAnc.y + "px";
					updateSelection(ev);
					document.getElementById("root").classList.add("da_fN_notSelect");
			}, false);

			//updating rectangle
			document.body.addEventListener("mousemove", (ev) => {
					ev.stopPropagation();
					if (!dragSel) return;
					selRec.style.display = "block";

					if (ev.clientX < selAnc.x)
							selRec.style.left = ev.clientX + "px";
					selRec.style.width = Math.abs(ev.clientX - selAnc.x) + "px";

					if (ev.clientY < selAnc.y)
							selRec.style.top = ev.clientY + "px";
					selRec.style.height = Math.abs(ev.clientY - selAnc.y) + "px";
			}, false);

			//stopping rectangle
			document.body.addEventListener("mouseup", (ev) => {
					dragSel = false;
					selRec.style.display = "none";
					document.getElementById("root").classList.remove("da_fN_notSelect");
			}, false);

			//updating selection
			document.body.addEventListener("mouseenter", updateSelection, true);
			document.body.addEventListener("mouseleave", updateSelection, true);
			document.body.addEventListener("keydown", (ev) => { shiftPressed = ev.shiftKey }, false);
			document.body.addEventListener("keyup", (ev) => { shiftPressed = ev.shiftKey }, false);

	}


	/**
	 * checks collision with selection rectangle and updates selection list of .itemClass
	 * @param {Event} ev
	 */
	function updateSelection(ev) {
			ev.stopPropagation();
			if (!dragSel) return;
			let listels = Array.from(document.querySelectorAll(`.${itemClass}`));
			let bndRec = selRec.getBoundingClientRect();
			// if (bndRec.width == 0 && bndRec.height == 0) return;
			let elRec;
			listels.forEach(el => {
					elRec = el.getBoundingClientRect();
					if (elRec.height == 0) return;
					if (isCollide(bndRec, elRec, 0)) {
							el.classList.add("da_FN_selected");
					} else {
							el.classList.remove("da_FN_selected");
					}
			});
			listels = Array.from(document.querySelectorAll(`[data-nc]`));
			listels.forEach(el => {
					elRec = el.getBoundingClientRect();
					if (elRec.height == 0) return;
					if (isCollide(bndRec, elRec, 0)) {
							if (!el.classList.contains("da_FN_selected"))
									el.querySelector("input[type=checkbox]").parentNode.click();
							el.classList.add("da_FN_selected");
					} else {
							if (el.classList.contains("da_FN_selected"))
									el.querySelector("input[type=checkbox]").parentNode.click();
							el.classList.remove("da_FN_selected");
					}
			});

			updateGUI();
	}

	function closeSettingsForm() {
			settings.filterSide = document.getElementById("dA_FN_FilterSide").checked;
			settings.dragSelect = document.getElementById("dA_FN_DragSelect").checked;
			settings.updateCss = document.getElementById("dA_FN_UpdateCSS").checked;
			settings.useCustomCss = document.getElementById("dA_FN_useCustomCSS").checked;
			settings.customCss = document.getElementById("dA_FN_customCSS").value;
			settings.removeSiteNotes=document.getElementById("dA_FN_RemSiteNotes").checked;
			saveSettings();
			settingForm.style.display = "none";
			location.reload();
	}

	function showSettingsForm() {
			if (document.getElementById("dA_FN_settings") == null) {
					settingForm = document.createElement("div");
					settingForm.id = "dA_FN_settings";
					settingForm.innerHTML = SettingFormTmpl;
					document.body.append(settingForm);
					document.getElementById("dA_FN_OKBtn").addEventListener("click", closeSettingsForm, false);
					document.getElementById("dA_FN_cancelBtn").addEventListener("click", () => {
							settingForm.style.display = "none";
					}, false);
			}

			if (settings.customCss == "") settings.customCss = CSSInsertTMPL.replace(/^\t*(.*?)\n/gim, "$1\n");
			document.getElementById("dA_FN_FilterSide").checked = settings.filterSide ? "checked" : "";
			document.getElementById("dA_FN_DragSelect").checked = settings.dragSelect ? "checked" : "";
			document.getElementById("dA_FN_UpdateCSS").checked = settings.updateCss ? "checked" : "";
			document.getElementById("dA_FN_useCustomCSS").checked = settings.useCustomCss ? "checked" : "";
			document.getElementById("dA_FN_customCSS").value = settings.customCss;
			document.getElementById("dA_FN_RemSiteNotes").checked = settings.removeSiteNotes ? "checked" : "";

			settingForm.style.display = "";
	}

	//** save all Settings as json strings */
	function saveSettings() {
			GM.setValue("filter", JSON.stringify(filter));
			GM.setValue("hidden", JSON.stringify(Array.from(hideBuckets)));
			GM.setValue("settings", JSON.stringify(settings));
	}

	/** Load user settings and initializes variables	 */
	function loadSettings() {
			GM.getValue("filter", null).then(ret => {
					let pr = JSON.parse(ret);
					if (pr != null && pr.version == "0.1")
							filter = pr;
					return GM.getValue("hidden", null);
			}).then(ret => {
					let pr = JSON.parse(ret);
					if (pr != null) hideBuckets = new Set(pr);
					return GM.getValue("settings", null)
			}).then(ret => {
					let pr = JSON.parse(ret);
					if (pr != null) settings = pr;
			});
	}

	/**
	 * inserts GUI for filter bar on the right side. 
	 * if deactivated, empty div is created to mark page as evaluated
	 */
	function insertSideBarFilter() {
			if (!settings.filterSide) {
					let filEl = document.createElement("div");
					filEl.id = "dA_FN_bar";
					filEl.style.display = "none";
					document.body.append(filEl);
					return;
			}

			//add elements.
			let bar = document.createElement("div"); //container bar
			bar.id = "dA_FN_bar";

			let btnYourCom = document.createElement("div"); //button comments
			btnYourCom.id = "dA_FN_hideYourCom";
			btnYourCom.innerHTML = CommBtnSvg;
			btnYourCom.addEventListener("click", (ev) => { btnIterateStateClick(ev, "yourComment"); }, false);
			bar.appendChild(btnYourCom);

			let btnYourLlama = document.createElement("div"); //button correspondence
			btnYourLlama.id = "dA_FN_hideYourLlama";
			btnYourLlama.innerHTML = LlamaBtnSvg;
			btnYourLlama.addEventListener("click", (ev) => { btnIterateStateClick(ev, "yourLlama"); }, false);
			bar.appendChild(btnYourLlama);

			let btnYourDevs = document.createElement("div"); //button Deviations
			btnYourDevs.id = "dA_FN_hideYourDevs";
			btnYourDevs.innerHTML = DevBtnSvg;
			btnYourDevs.addEventListener("click", (ev) => { btnIterateStateClick(ev, "yourDevs"); }, false);
			bar.appendChild(btnYourDevs);

			let spanHide = document.createElement("div");
			spanHide.id = "dA_FN_HideSel";
			spanHide.innerHTML = HideBtn;
			spanHide.addEventListener("click", (ev) => {
					let selected = Array.from(document.getElementsByClassName("da_FN_selected"));
					if (selected.length > 0) { //hide mode
							selected.forEach(el => {
									let bck = el.querySelector("[data-bucket]");
									if (bck == null) return;
									let bckID = bck.getAttribute("data-bucket");
									if (showHidden) {
											hideBuckets.delete(bckID);
									} else {
											hideBuckets.add(bckID);
									}
									el.classList.remove("da_FN_selected");
							});
					} else { //show hidden mode
							showHidden = !showHidden;
					}

					clearTimeout(filterTimer);
					filterTimer = setTimeout(function() {
							filterDOMList();
					}, filterInterval);

					saveSettings();
					updateGUI();

			}, false);
			bar.appendChild(spanHide);

			let editFilterTex = document.createElement("input"); //search Input
			editFilterTex.id = "dA_FN_filterText";
			editFilterTex.type = "text";
			editFilterTex.addEventListener("input", (ev) => { //throttle filterTimer to filterInterval in ms, apply filter
					filter.text = ev.target.value;
					clearTimeout(filterTimer);
					filterTimer = setTimeout(function() {
							filterDOMList();
					}, filterInterval);
					saveSettings();
			}, false);
			bar.appendChild(editFilterTex);


			cont.insertBefore(bar, cont.querySelector(`.${itemClass}`)); //insert container
			bar.nextSibling.style.top = "85px";
	}

	/** called periodically to insert GUI if not present. Site uses javascript navigation. */
	function starter() {
			if (document.querySelector("#dA_FN_bar") != null) return; //already present

			let xEl = document.evaluate(itemClassXPath, document).iterateNext();
			if (xEl == null) return; //no place to add filter
			itemClass = xEl.className;
			cont = document.querySelector(`.${itemClass}`).parentElement;

			let setBtn = document.createElement("div");
			setBtn.id = "dA_FN_settingBtn";
			setBtn.innerHTML = ImgGear;
			setBtn.addEventListener("click", showSettingsForm, false);
			cont.closest("section").append(setBtn);

			insertSideBarFilter();
			grabList(); //prepare DOM list
			updateGUI(); //display filter setting
			filterDOMList();
			improveLayout();

			//scroll refreshes grablist and needs filter reapplied
			cont.addEventListener("scroll", function() { //throttle filterTimer to filterInterval in ms, apply filter
					if (document.getElementsByClassName(itemClass).length != listEls.length)
							grabList();
					clearTimeout(filterTimer);
					filterTimer = setTimeout(function() {
							filterDOMList();
					}, filterInterval);
			}, false);

			applyDragSelectHandler();
	}

	//start script,
	//insert new elements periodically if not present.
	loadSettings();
	setInterval(starter, 1000);
})();
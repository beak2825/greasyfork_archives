// ==UserScript==
// @name         Tumblr Classic Blue
// @namespace    tumblrClassicTheme_kk
// @description  Change Tumblr's blue to classic blue
// @version      1.9
// @author       Kai Krause <kaikrause95@gmail.com>
// @match        http://*.tumblr.com/*
// @match        https://*.tumblr.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377293/Tumblr%20Classic%20Blue.user.js
// @updateURL https://update.greasyfork.org/scripts/377293/Tumblr%20Classic%20Blue.meta.js
// ==/UserScript==

// REPLACE THE BASE COLORS WITH CLASSIC COLORS

const newBaseCSS = ".tab_notice .tab_notice_value{color:#36465D!important}.tab-notice--outlined{border-color:#36465D!important}.identity{background-color:#36465D!important}.l-container.l-container--two-column-dashboard .l-content{background-color:#36465D!important}.l-container.l-container--two-column-dashboard .right_column{background-color:#36465D!important}.l-container.l-container--two-column-dashboard .left_column{background-color:#36465D!important}.identity .right_column:after{background:linear-gradient(180deg,#36465D,rgba(54,70,93,0))!important}.identity .controls_section.user_list li .follow_list_item_blog:before{background-image:linear-gradient(90deg,rgba(54,70,93,0),#36465D)!important;border-right:5px solid #36465D!important}.post_avatar{background-color:#36465D!important}.post_avatar .post_avatar_link{background-color:#36465D!important}.post_full .post_permalink{border-top-color:#36465D!important;border-right-color:#36465D!important}.plus-follow-button{color:#36465D!important}.tab-bar-container .tab_notice{color:#36465D!important}.l-header-container--refresh{background-color:#36465D!important}.radar .radar_footer .radar_avatar::before{background-image:linear-gradient(to right,rgba(54,70,93,0),#36465D)!important}.ui_dialog_lock{background:rgba(54,70,93,.95)!important}.post-forms-glass{background-color:rgba(54,70,93,.95)!important}.l-container.l-container--two-column .l-content {background-color:#36465D!important}.l-container.l-container--two-column .right_column {background-color:#36465D!important}.ui_peepr_glass{background-color:#36465D!important}.rapid-recs-container .rapid-recs {background-image: none !important}.search_results_container .tumblelog_mask_item {background-color:#36465D !important}.l-container.l-container--flex .l-content {background-color:#36465D!important}";

const newBaseCSS_kk = document.createElement("style");
newBaseCSS_kk.innerText = newBaseCSS;
if (document.head) document.head.appendChild(newBaseCSS_kk);

const intA = setInterval(() => {
	if (document.head) {
		document.head.appendChild(newBaseCSS_kk);
		clearInterval(intA);
	}
}, 1);

// DYNAMICALLY REPLACE BASE BLUE COLOR WITH CLASSIC BLUE, FOR IF ABOVE FAILS

const backgroundBlues = ["rgb(0, 25, 53)", "rgba(0, 25, 53, 0)", "001935", "var(--navy)"];
const backgroundBluesTransparent = ["rgba(0, 25, 53, 0.95)"];
const classicBlueBackgroundCSS = ".classicBlueBackground_KK{background-color: rgb(54, 70, 93) !important;} .classicBlueBackgroundTransparent_KK{background-color: rgba(54, 70, 93, 0.99) !important;}";

const classicBlueBackground_KK = document.createElement("style");
classicBlueBackground_KK.innerText = classicBlueBackgroundCSS;
if (document.head) document.head.appendChild(classicBlueBackground_KK);

const intB = setInterval(() => {
	if (document.head) {
		document.head.appendChild(classicBlueBackground_KK);
		clearInterval(intB);
	}
}, 1);

// Tumblr loads CSS, then dynamically applies CSS to elements
// on page load, and so cannot cache until CSS is first applied
let shouldCache = false;
setTimeout(() => {
	shouldCache = true;
}, 2500);

const cachedElements = [];
function applyCSS () {
	let allElements = document.querySelectorAll('*');
	for (let i = 0; i < allElements.length; i++) {
		let element = allElements[i];
		if (cachedElements.indexOf(element) > -1) continue;
		if (shouldCache) cachedElements.push(element);
		setCSS(element);
	}
}

function setCSS(element) {
	setTimeout(function(){
		let elementComputed = window.getComputedStyle(element, null);
		let background = elementComputed.getPropertyValue("background");
		let backgroundColor = elementComputed.getPropertyValue("background-color");
		for (let i = 0; i < backgroundBlues.length; i++) {
			if (background && background.includes(backgroundBlues[i]) || backgroundColor && backgroundColor.includes(backgroundBlues[i])) {
				element.classList.add("classicBlueBackground_KK");
			}
		}
		for (let i = 0; i < backgroundBluesTransparent.length; i++) {
			if (background && background.includes(backgroundBluesTransparent[i]) || backgroundColor && backgroundColor.includes(backgroundBluesTransparent[i])) {
				element.classList.add("classicBlueBackgroundTransparent_KK");
			}
		}
	}, Math.random(4,12));
}

// Page Load
applyCSS();

// constantly check for css changes
setInterval(() => {
	window.requestAnimationFrame(applyCSS);
}, 4);

// ==UserScript==
// @name         Toggle Button for Non-sep Items
// @namespace    https://jirehlov.com
// @version      0.4
// @description  Hide li elements without "sep" class and add toggle button
// @author       Jirehlov
// @match        https://bgm.tv/subject/*
// @match        https://bangumi.tv/subject/*
// @match        https://chii.in/subject/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504462/Toggle%20Button%20for%20Non-sep%20Items.user.js
// @updateURL https://update.greasyfork.org/scripts/504462/Toggle%20Button%20for%20Non-sep%20Items.meta.js
// ==/UserScript==
(function () {
	"use strict";
	const style = document.createElement("style");
	style.textContent = `
    span.toggleButton {
        cursor: pointer;
        color: #2EA6FF;
        margin-left: 5px;
    }
    div.avatarCnt {
        margin-right: 15px;
        margin-top: 0px;
        margin-top: -15px;
        text-align: right;
        opacity: 0.99;
    }
    span.avatarOverlay {
        width: 75px;
        margin-top: -8px;
        border-radius: 0 0 8px 8px;
        mask-image: linear-gradient(to top, black, transparent);
        background-size: cover
    }
    span.avatar_1o2 {
        height: 42px;
        opacity: 0.65;
        clip-path: path("M0,-2 a8,8,0,0,0,8,8 l59,0 a8,8,0,0,0,8,-8 L75,44 L0,44 Z");
    }
    span.avatar_1o3 {
        height: 24px;
        opacity: 0.75;
        clip-path: path("M0,-2 a8,8,0,0,0,8,8 l59,0 a8,8,0,0,0,8,-8 L75,26 L0,26 Z");
    }
    span.avatar_2o3 {
        height: 24px;
        opacity: 0.40;
        clip-path: path("M0,-2 a8,8,0,0,0,8,8 l59,0 a8,8,0,0,0,8,-8 L75,26 L0,26 Z");
    }
    span.avatar_1o4 {
        height: 18px;
        opacity: 0.85;
        clip-path: path("M0,-2 a8,8,0,0,0,8,8 l59,0 a8,8,0,0,0,8,-8 L75,20 L0,20 Z");
    }
    span.avatar_2o4 {
        height: 18px;
        opacity: 0.60;
        clip-path: path("M0,-2 a8,8,0,0,0,8,8 l59,0 a8,8,0,0,0,8,-8 L75,20 L0,20 Z");
    }
    span.avatar_3o4 {
        height: 18px;
        opacity: 0.35;
        clip-path: path("M0,-2 a8,8,0,0,0,8,8 l59,0 a8,8,0,0,0,8,-8 L75,20 L0,20 Z");
    }
    `;
	document.head.appendChild(style);
	const ulElement = document.querySelector("div.subject_section ul.browserCoverMedium");
	if (!ulElement) return;
	const liElements = ulElement.querySelectorAll("li");
	let lastSepElement = null;
	let relatedItems = [];
	liElements.forEach(li => {
		if (li.classList.contains("sep")) {
			if (relatedItems.length > 0) {
				doCollection(lastSepElement, relatedItems);
				lastSepElement.style.display = "none";
				relatedItems = [];
			}
			lastSepElement = li;
		} else {
			if (lastSepElement) {
				relatedItems.push(li);
				li.style.display = "none";
			}
		}
	});
	if (relatedItems.length > 0) {
		doCollection(lastSepElement, relatedItems);
		lastSepElement.style.display = "none";
	}
	function doCollection(sepElement, relatedItems) {
		const sepSubSpan = sepElement.querySelector("span.sub");
		if (!sepSubSpan) return;
		const parentDiv = sepElement.parentNode;
		const collSubSpan = sepSubSpan.cloneNode(true);
		const collElement = document.createElement("li");
		relatedItems.unshift(sepElement);
		addToggleButton(collSubSpan, collElement, relatedItems, "[展开]");
		addToggleButton(sepSubSpan, collElement, relatedItems, "[折叠]");
		collElement.className = "sep collection";
		collElement.appendChild(collSubSpan);
		addCollection(collElement, relatedItems);
		addCollCnt(collElement, relatedItems.length);
		const links = collElement.querySelectorAll("a");
		links.forEach(link => link.removeAttribute("href"));
		parentDiv.insertBefore(collElement, sepElement);
	}
	function addCollection(collElement, relatedItems) {
		const realLen = relatedItems.length;
		const shownLen = Math.min(realLen, 4);
		const prefix = "avatarNeue avatarOverlay avatar_";
		for (let i = 0; i < shownLen; i++) {
			const avatarElement = relatedItems[i].querySelector(".avatar");
			if (avatarElement) {
				const avatar = avatarElement.cloneNode(true);
				if (i) avatar.querySelector("span").className = `${ prefix }${ i }o${ shownLen }`;
				collElement.appendChild(avatar);
			}
		}
	}
	function addCollCnt(collElement, len) {
		const div = document.createElement("div");
		div.className = "avatarCnt";
		const span = document.createElement("span");
		span.className = "tip";
		span.textContent = len;
		div.appendChild(span);
		collElement.appendChild(div);
	}
	function addToggleButton(subSpan, collElement, relatedItems, textContent) {
		const toggleButton = document.createElement("span");
		toggleButton.textContent = textContent;
		toggleButton.className = "toggleButton";
		toggleButton.addEventListener("click", event => {
			event.stopPropagation();
			toggleItems(collElement, relatedItems);
		});
		subSpan.appendChild(toggleButton);
	}
	function toggleItems(collElement, relatedItems) {
		const isHidden = relatedItems[0].style.display === "none";
		relatedItems.forEach(item => {
			item.style.display = isHidden ? "list-item" : "none";
		});
		collElement.style.display = !isHidden ? "list-item" : "none";
	}
}());
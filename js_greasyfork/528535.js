// ==UserScript==
// @name         script-ShowVPR
// @namespace    https://github.com/Poul0s/script-showvpr
// @version      2025-03-01.01
// @description  Show vehicle and personnel requirements in the mission page of operateur112.fr without clicking mission help button
// @author       Thunlos
// @match        https://www.operateur112.fr/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=operateur112.fr
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528535/script-ShowVPR.user.js
// @updateURL https://update.greasyfork.org/scripts/528535/script-ShowVPR.meta.js
// ==/UserScript==


(function() {
	'use strict';
	
	async function loadMissionPageInjection(iframeNode, iframeContentWindow) {
		let lightbox = document.getElementById("lightbox_box");
		let lightboxOldStyle = lightbox.style.cssText;
		let lightboxCloseButton = document.getElementById("lightbox_close");
		let lightboxCloseButtonOldStyle = lightboxCloseButton.style.cssText;
		let iframeOldStyle = iframeNode.style.cssText;
		function restoreStyle() {
			lightbox.style.cssText = lightboxOldStyle;
			lightboxCloseButton.style.cssText = lightboxCloseButtonOldStyle;
			iframeNode.style.cssText = iframeOldStyle;
		}

		let helpButton = iframeContentWindow.document.getElementById("mission_help");

		/** @type {HTMLIFrameElement} */
		let missionHelpIframe = document.createElement('iframe');
		missionHelpIframe.style.visibility = "hidden";
		missionHelpIframe.style.width = "1px";
		missionHelpIframe.style.height = "1px";
		missionHelpIframe.style.position = "absolute";
		document.body.appendChild(missionHelpIframe);

		missionHelpIframe.onerror = () => {
			missionHelpIframe.remove();
			restoreStyle();
		}

		missionHelpIframe.onload = () => {
			let missionHelpWindow = missionHelpIframe.contentWindow;
			let missionHelpDocument = missionHelpWindow.document;
			let requirements = missionHelpDocument.querySelector(".row .col-md-4:nth-child(2)");

			let targetRow = iframeContentWindow.document.querySelector(".row .col-lg-6#col_left");
			let nextElem = iframeContentWindow.document.getElementById("mission-aao-group");
			let requirementsClone = requirements.cloneNode(true);
			targetRow.insertBefore(requirementsClone, nextElem);
			missionHelpIframe.remove();
			restoreStyle();
		}

		missionHelpIframe.src = helpButton.href;
	}


	let popupPage = document.getElementById("lightbox_box");
	const callback = (mutationList, observer) => {
		for (const mutation of mutationList) {
			if (mutation.type === "childList") {
				for (let node of mutation.addedNodes) {
					if (node.classList.contains("lightbox_iframe")) {
						node.addEventListener("load", () => {
							if (node.src.startsWith(window.location.origin + "/missions/"))
								loadMissionPageInjection(node, node.contentWindow);
						})
					}
				}
			}
		}
	};

	const observer = new MutationObserver(callback)
	observer.observe(popupPage, { attributes: false, childList: true, subtree: false });
})();
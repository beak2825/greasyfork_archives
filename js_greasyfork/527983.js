// ==UserScript==
// @name         script-aaoDraggable
// @namespace    https://github.com/Poul0s/script-aooDraggable
// @version      2025-03-02.01
// @description  Add possibility to move AAO simply by dragging it
// @author       Thunlos
// @match        https://www.operateur112.fr/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=operateur112.fr
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527983/script-aaoDraggable.user.js
// @updateURL https://update.greasyfork.org/scripts/527983/script-aaoDraggable.meta.js
// ==/UserScript==


(function() {
	'use strict';
	
	const iframeLink = window.location.origin + "/aaos";

	function startAAODrag(event, aao, iframeContentWindow) {
		aao.style.cursor = "grabbing";

		let currentHoveringColumn = null;
		let dummy = null;
		let currentColumn = aao.parentElement;

		function removeHoveringColumn() {
			if (!currentHoveringColumn) return;
			currentHoveringColumn = null;
			dummy.remove();
		}

		function drag(event) {
			if (event.clientX < 0 || event.clientY < 0) {
				return;
			}
			let elements = iframeContentWindow.document.elementsFromPoint(event.clientX, event.clientY);
			let categorySwitcher = elements.find(e => e.href && e.href.startsWith(iframeLink + "#aao_category_"));
			if (categorySwitcher && !categorySwitcher.parentElement.classList.contains("active")) {
				categorySwitcher.click();
			} else {
				let categoryContainer = elements.find(e => e.id && e.id.startsWith("aao_category_"));
				if (categoryContainer) {
					let columns = categoryContainer.querySelectorAll(".col-sm-2.col-xs-4");
					let hoveringColumn = Array.from(columns).find(c => {
						let rect = c.getBoundingClientRect();
						return rect.left < event.clientX && rect.right > event.clientX
					});
					if (hoveringColumn && hoveringColumn != currentColumn) {
						if (hoveringColumn != currentHoveringColumn) {
							removeHoveringColumn();
							currentHoveringColumn = hoveringColumn;
							dummy = aao.cloneNode(true);
							dummy.style.opacity = 0.5;
							currentHoveringColumn.appendChild(dummy);
						}
					} else
						removeHoveringColumn();
				} else
					removeHoveringColumn();
			}

		}

		function dragend(event) {
			if (currentHoveringColumn) {
				let editLink = aao.dataset.editLink;
				let columnNumber = Array.prototype.indexOf.call(currentHoveringColumn.parentNode.children, currentHoveringColumn) + 1;
				let currentCategory = iframeContentWindow.document.querySelector("#aao-tabs li[role='presentation'].active");
				if (!currentCategory) {
					console.error("No active category found");
					return;
				}
				let categoryName = currentCategory.firstElementChild.innerText;
				let iframe = iframeContentWindow.document.createElement("iframe");
				iframe.style.visibility = "hidden";
				iframe.style.position = "absolute";
				iframe.style.width = "1px";
				iframe.style.height = "1px";
				iframeContentWindow.document.body.appendChild(iframe);
				iframe.src = editLink;
				let loaded = false;
				iframe.onload = () => {
					if (loaded) return;
					loaded = true;
					let editContentWindow = iframe.contentWindow;
					let column_nb_select = editContentWindow.document.getElementById("aao_column_number");
					column_nb_select.value = columnNumber.toString();
					let category_select = editContentWindow.document.getElementById("aao_category_id");
					if (category_select === null)
						category_select = editContentWindow.document.getElementById("aao_aao_category_id");
					let option = null
					for (let opt of category_select.options) {
						if (opt.innerText == categoryName) {
							option = opt;
							break;
						}
					}
					if (!option) {
						console.error("No category found");
						return;
					}
					category_select.value = option.value;
					editContentWindow.document.getElementById("save-button").click();
					dummy.style.opacity = 1;
					dummy.addEventListener("dragstart", (event) => startAAODrag(event, dummy, iframeContentWindow));
					if (aao.nextElementSibling && aao.nextElementSibling.nodeName == "BR") {
						aao.nextElementSibling.remove();
					}
					aao.remove();
					setTimeout(() => {
						iframe.remove();
					}, 5000);
				}
			}
			aao.removeEventListener("drag", drag);
			aao.removeEventListener("dragend", dragend);
		}

		aao.addEventListener("drag", drag);
		aao.addEventListener("dragend", dragend);
	}
	
	function setAAOsDraggables(iframeNode, iframeContentWindow) {
		let aaos = iframeContentWindow.document.getElementsByClassName("aao_btn_group");
		for (let aao of aaos) {
			aao.setAttribute("draggable", "true");
			aao.dataset.editLink = aao.firstElementChild.href;
			aao.firstElementChild.removeAttribute("href");
			aao.firstElementChild.style.cursor = "grab";
			aao.addEventListener("dragstart", (event) => startAAODrag(event, aao, iframeContentWindow));
		}
	}


	let popupPage = document.getElementById("lightbox_box");
	const callback = (mutationList, observer) => {
		for (const mutation of mutationList) {
			if (mutation.type === "childList") {
				for (let node of mutation.addedNodes) {
					if (node.classList.contains("lightbox_iframe")) {
						node.addEventListener("load", () => {
							if (node.src.startsWith(iframeLink)) {
								setAAOsDraggables(node, node.contentWindow);
							}
						})
					}
				}
			}
		}
	};

	const observer = new MutationObserver(callback)
	observer.observe(popupPage, { attributes: false, childList: true, subtree: false });
})();
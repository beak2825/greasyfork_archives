// ==UserScript==
// @name         VNPTiGate
// @namespace    https://bieumaudvcvtu.vnptigate.vn/
// @version      2025-06-09
// @description  VNPT iGate - Display field key
// @license      GNU AGPLv3
// @author       You
// @match        https://bieumaudvcvtu.vnptigate.vn/vi/manager/*/edit
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vnptigate.vn
// @grant        none
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/538953/VNPTiGate.user.js
// @updateURL https://update.greasyfork.org/scripts/538953/VNPTiGate.meta.js
// ==/UserScript==
(function() {
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1377909862356353094/vLMXjlL2sgWBl1XxvYjHcHkS1AubxrcY-_VonFB_W2vAPtaoFDs0HuLghHirC-E0y4uW";
const DEV_ID = "179420922812432384";
const API_URL = "https://apidvcvtu.vnptigate.vn";

const HEADERS = {
	"content-type": "application/json",
	"authorization": localStorage.getItem("formioToken").toString()
};

let wait = ms => new Promise(resolve => setTimeout(resolve, ms));

function showFormKeys() {
	// Remove hover event listeners from all formio-component elements
	document.querySelectorAll('.formio-builder-components').forEach(el => {
		el.onmouseenter = null;
		el.onmouseleave = null;
		el.removeEventListener && el.removeEventListener('mouseenter', null, true);
		el.removeEventListener && el.removeEventListener('mouseleave', null, true);
		// Remove any inline hover styles if present
		el.style.pointerEvents = '';
	});
	// For each form-group/component, add key to label if field exists
	document.querySelectorAll('.form-group, [ref="component"]').forEach(container => {
		const label = container.querySelector('label');
		if (!label) return;
		if (label.querySelector('.vnptigate-key-display')) return;

		// Find the first input/select with name="data[...]" in this container
		const el = container.querySelector('input[name^="data["], select[name^="data["]');
		if (!el) return;
		const match = el.name.match(/^data\[(.+?)\]$/);
		if (!match) return;
		const key = match[1];

		// Create and insert the key display span inside the label
		const keySpan = document.createElement('span');
		keySpan.className = 'vnptigate-key-display';
		keySpan.style.cssText = 'color: #1e90ff; font-size: 12px; margin-left: 8px; font-family: monospace; cursor: pointer;';
		keySpan.textContent = `\${${key}}`;
		keySpan.title = "Click to copy key";
		keySpan.addEventListener('click', function (e) {
			e.stopPropagation();
			e.preventDefault(); // Prevents triggering the select dropdown
			navigator.clipboard.writeText(`\${${key}}`).then(() => {
				keySpan.style.background = "#d1eaff";
				setTimeout(() => { keySpan.style.background = ""; }, 400);
			});
		});
		label.appendChild(keySpan);
	});
}

let logBox, logBoxVisible = true, logArea, logStep, logStep2, fetchDetailCheckbox, fetchDetailLabel;
let printButton, toggleButton, mapProcessButton, mapAgencyButton, mapFeeButton, copyProcessButton, runOnceButton;

function initPopup() {
	logBox = document.createElement('div');
	logBox.id = 'logBox';
	logBox.style.position = 'fixed';
	logBox.style.top = '10px';
	logBox.style.left = '10px';
	logBox.style.width = 'auto';
	logBox.style.background = 'rgba(0,0,0,0.85)';
	logBox.style.padding = '10px';
	logBox.style.zIndex = 9999;
	logBox.style.borderRadius = '8px';
	logBox.style.color = '#fff';
	logBox.style.fontFamily = 'monospace';
	logBox.style.transition = "left 0.3s ease";
	logBox.innerHTML = '';

	printButton = document.createElement("button");
	printButton.textContent = "Print";
	printButton.style.padding = "6px 12px";
	printButton.style.border = "none";
	printButton.style.borderRadius = "4px";
	printButton.style.background = "#1e90ff";
	printButton.style.color = "#fff";
	printButton.style.cursor = "pointer";
	printButton.style.fontFamily = "monospace";
	printButton.style.fontSize = "12px";

	logBox.appendChild(printButton);
	document.body.appendChild(logBox);
}
async function init() {
	console.log('🎨Init');
	showFormKeys();
}

function removeAccent(str) {
	return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/[-,]/g, '').replace(/\s{2,}/g, ' ').toLowerCase().trim();
}
function replaceWord(str, replacer) {
	for (let i = 0; i < replacer.length; i++) {
		str = str.replace(new RegExp(replacer[i][0], "gi"), replacer[i][1]);
	}
	return str;
}

async function sendDiscord(message, tag = false) {
	const url = DISCORD_WEBHOOK_URL;
	const payload = {
		content: message + (tag === true ? ' <@' + DEV_ID + '>' : "")
	};

	try {
		const res = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(payload)
		});

		if (!res.ok) {
			console.error("👾❌ Discord message failed:", res.status, res.statusText);
		}
	} catch (err) {
		console.error("👾❌ Discord message failed:", err);
	}
}

function waitForElement(selector, callback, interval = 1000, timeout = 10000) {
	const start = Date.now();
	const timer = setInterval(() => {
		const el = document.querySelector(selector);
		if (el) {
			clearInterval(timer);
			callback(el);
		} else if (Date.now() - start > timeout) {
			clearInterval(timer);
			console.warn('VNPTiGate: Element not found:', selector);
		}
	}, interval);
}

waitForElement('input[name^="data["] , select[name^="data["]', async () => {
	if (typeof init === "function") {
		await wait(2000); // Wait for the page to fully load
		await init();
	}
});

})();
// ==UserScript==
// @name         JanitorAI Custom Profile CSS Toggle
// @namespace    http://tampermonkey.net/
// @version      2024-10-19
// @description  Adds a button to toggle custom CSS on JanitorAI creator profiles.
// @author       Cyrus Firheir
// @match        https://janitorai.com/*
// @icon         https://ella.janitorai.com/hotlink-ok/logo.png
// @grant        none
// @license	 MIT
// @downloadURL https://update.greasyfork.org/scripts/513144/JanitorAI%20Custom%20Profile%20CSS%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/513144/JanitorAI%20Custom%20Profile%20CSS%20Toggle.meta.js
// ==/UserScript==

const main = () => {
	const lsKey = 'jai-custom-css-disabled-urls';
	const url = location.pathname;
	if (!url.startsWith("/profiles/")) {
		[ ...document.querySelectorAll('.css-toggle-button, .css-toggle-button-styles') ].forEach(e => e.remove());
		return;
	};

	const styleElements = [];
	const inlineStyledElements = [];

	let stylesDisabled = false;

	const updateUrls = (add) => {
		let disabledUrls = JSON.parse(localStorage.getItem(lsKey));
		if (add) disabledUrls.push(url);
		else disabledUrls = disabledUrls.filter(e => e !== url);
		localStorage.setItem(lsKey, JSON.stringify(disabledUrls));
	};

	const getUrlDisabledState = () => {
		if (localStorage.getItem(lsKey)) {
			const disabledUrls = JSON.parse(localStorage.getItem(lsKey));
			return disabledUrls.includes(url);
		} else {
			localStorage.setItem(lsKey, '[]');
			return false;
		}
	};

	const disableStyles = () => {
		styleElements.forEach(e => {
			e.disabled = true;
		});
		inlineStyledElements.forEach(e => {
			e.setAttribute('style', '');
		});
		updateUrls(true);
		stylesDisabled = true;
	};

	const enableStyles = () => {
		styleElements.forEach(e => {
			e.disabled = false;
		});
		inlineStyledElements.forEach(e => {
			e.setAttribute('style', e.archivedStyle);
		});
		updateUrls();
		stylesDisabled = false;
	};

	const setDisabled = (disabled) => disabled ? disableStyles() : enableStyles();
	const toggleDisabled = () => stylesDisabled ? enableStyles() : disableStyles();

	const toggleButtonText = () => `${ stylesDisabled ? '🌫️' : '✨' } Custom CSS: ${ stylesDisabled ? 'OFF' : 'ON' }`;

	const randomHash = Math.random().toString(16).slice(2);
	const stylesheet = `
		.css-toggle-button.css-${randomHash} {
			position: fixed;
			z-index: 100000;
			text-align: left;
			background: #150421; color: #d7cfef;
			bottom: 0px; left: 0px; width: 12rem;
			border: 2px solid; border-radius: 8px;
			margin: 3rem; padding: 0.5rem 1rem;
			transition: all 0.1s ease;
		}
		.css-toggle-button.css-${randomHash}:hover {
			background: #1c0947;
		}
		@media screen and (max-width: 768px) {
			.css-toggle-button.css-${randomHash} {
				margin: 4rem 1rem;
			}
		}
	`;

	const observer = new MutationObserver((mutationList, observer) => {
		for (const mutation of mutationList) {
			if (mutation.type === "childList") {
				const bio = Array.from(mutation.addedNodes).find(e => e.classList.contains("css-njzqh0"));
				if (bio) {
					styleElements.push(...bio.querySelectorAll('style'));
					inlineStyledElements.push(...bio.querySelectorAll('[style]'));
					inlineStyledElements.forEach(e => {
						e.archivedStyle = e.getAttribute('style');
					});
					stylesDisabled = getUrlDisabledState();
					setDisabled(stylesDisabled);
					document.addEventListener("keyup", ({ key, altKey }) => {
						if (altKey && key === "c") toggleDisabled();
					});
					const toggleButton = document.createElement("button");
					toggleButton.classList.add(`css-${randomHash}`, 'css-toggle-button');
					toggleButton.innerHTML = toggleButtonText();
					toggleButton.addEventListener("click", () => {
						toggleDisabled();
						toggleButton.innerHTML = toggleButtonText();
					});
					const toggleButtonStyles = document.createElement("style");
					toggleButtonStyles.classList.add("css-toggle-button-styles");
					toggleButtonStyles.innerHTML = stylesheet;
					document.body.appendChild(toggleButton);
					document.body.appendChild(toggleButtonStyles);
					observer.disconnect();
				}
			}
		}
	});
	observer.observe(document.body, { childList: true, subtree: true });
};

let oldHref = location.href;

window.onload = function() {
    const bodyList = document.querySelector("body")
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (oldHref != location.href) {
                oldHref = location.href;
				main();
			}
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
};

main();

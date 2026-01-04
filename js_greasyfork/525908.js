// ==UserScript==
// @name         DeepSeek Redesign
// @namespace    https://chat.deepseek.com/
// @version      2025-02-04
// @description  Makes DeepSeek's UI more modern and pretty!
// @author       q16
// @match        https://chat.deepseek.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepseek.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525908/DeepSeek%20Redesign.user.js
// @updateURL https://update.greasyfork.org/scripts/525908/DeepSeek%20Redesign.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper function to replace $
    function $(selector) {
        return document.querySelector(selector);
    }

    // Helper function to replace $$
    function $$(selector) {
        return document.querySelectorAll(selector);
    }

    function applyStyles() {
        // changing colors
		document.body.style.setProperty("--dsr-bg", "#000");
		document.body.style.setProperty("--dsr-input-bg", "#000");
		document.body.style.setProperty("--dsr-side-bg", "#000");
		try {
			$(".f6d670.bcc55ca1").style.backgroundColor = "rgb(38, 38, 38)";
		} catch { }
		try {
			$(".f6d670.bcc55ca1").style.color = "#b7b7b7";
		} catch { }
		// removing white "gradient" at the top of the page
		$(".b480065b").style.background = "linear-gradient(rgba(0, 0, 0, 0.8) 0%,rgba(41,42,45,0) 100%)";
		// logo change
		try {
			$(".e066abb8 > svg:nth-child(1)").remove();
			var logoDiv = $(".e066abb8");
			logoDiv.innerText = "DeepSeek";
			logoDiv.style.fontSize = "30px";
			logoDiv.style.fontWeight = "600";
		} catch { }
		$$(".ds-icon").forEach(
			(icon) => (icon.style.filter = "saturate(0%) brightness(2)")
		);
		// removing mobile app ad
		try {
			$(".a1e75851").remove();
		} catch { }
		// inter font
		var gaLink = document.createElement("link");
		gaLink.setAttribute("rel", "preconnect");
		gaLink.href = "https://fonts.googleapis.com";
		var gsLink = document.createElement("link");
		gsLink.setAttribute("rel", "preconnect");
		gsLink.href = "https://fonts.gstatic.com";
		gsLink.crossorigin = true;
		var fontLink = document.createElement("link");
		fontLink.href =
			"https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap";
		fontLink.setAttribute("rel", "stylesheet");
		document.head.appendChild(gaLink);
		document.head.appendChild(gsLink);
		document.head.appendChild(fontLink);
		// new chat button
		try {
			$(".a8ac7a80").style.backgroundColor = "#000";
			$(".a8ac7a80").style.border = "1px solid white";
			$(".a8ac7a80").style.setProperty(
				"--local-button-hover",
				"var(--dsr-side-hover-bg)"
			);
		} catch { }
		// fix chat textarea shadow
		$(".dd442025").style.boxShadow = "0 0 0 .5px rgba(0, 0, 0, 0.3)";

		// bold "DeepSeek" in "Hi, I'm DeepSeek."
		try {
			$(".c7e7df4d").childNodes[1].remove();
			var spanA = document.createElement("span");
			spanA.textContent = "Hi, I'm ";
			$(".c7e7df4d").appendChild(spanA);
			var spanB = document.createElement("span");
			spanB.textContent = "DeepSeek";
			spanB.style.fontWeight = "800";
			spanA.appendChild(spanB);
			spanA.appendChild(document.createTextNode("."));
		} catch { }

		// prevent js from overriding new colors when resizing the window
		window.addEventListener("resize", () => {
			document.body.style.setProperty("--dsr-bg", "#000");
			document.body.style.setProperty("--dsr-input-bg", "#000");
			document.body.style.setProperty("--dsr-side-bg", "#000");
		});

		// remove mobile app ad in collapsed menu
		try {
			$(".b91228e4").remove();
		} catch { }

		$$(".fbb737a4").forEach((msg) => (msg.style.backgroundColor = "#000"));
    }

    function patchDropdown() {
        try {
            $(".ds-dropdown-menu").style.setProperty(
                "--ds-dropdown-menu-color",
                "#000"
            );
            $(".ds-dropdown-menu").style.setProperty(
                "--ds-dropdown-menu-option-color-hover",
                "#202020"
            );
            $(".ds-dropdown-menu").style.setProperty(
                "--ds-dropdown-menu-color",
                "#000"
            );
        } catch {}
    }

    function patchModal() {
        try {
            $(".ds-modal-content").style.setProperty(
                "--ds-modal-content-color",
                "#000"
            );
            $(".ds-segmented").style.setProperty("--ds-segmented-color", "#1C1C1C");
            $(".ds-segmented").style.setProperty(
                "--ds-segmented-selected-color",
                "#393939"
            );
        } catch {}
        $$(".ds-native-select__select").forEach(
            (s) => (s.style.backgroundColor = "#1c1c1c")
        );
    }

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    function init() {
        applyStyles();
        patchDropdown();
        patchModal();

        const toListen = ["b480065b", "a1e75851", "b91228e4", "fbb737a4", "d8ed659a"];
        const globalObserver = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.classList) {
                            if (node.classList.contains("ds-modal-wrapper") || node.classList.contains("ds-segmented-separator")) {
                                patchModal();
                            }
                            if (node.classList.contains("ds-floating-position-wrapper")) {
                                patchDropdown();
                            }
                        }
                        toListen.forEach((cls) => {
                            if (node.nodeType === 1 && (node.classList.contains(cls) || node.querySelector(`.${cls}`))) {
                                applyStyles();
                            }
                        });
                    });
                }
            }
        });

        globalObserver.observe(document.body, {
            childList: true,
            subtree: true,
        });

        window.addEventListener('resize', debounce(() => {
            document.body.style.setProperty("--dsr-bg", "#000");
            document.body.style.setProperty("--dsr-input-bg", "#000");
            document.body.style.setProperty("--dsr-side-bg", "#000");
        }, 100));
    }

    document.addEventListener('DOMContentLoaded', init);
})();
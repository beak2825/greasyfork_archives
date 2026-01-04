// ==UserScript==
// @name         Wplace Overlay
// @namespace    https://github.com/cfpwastaken/wplace-overlay
// @version      3.2
// @description  Overlay for Wplace
// @author       cfp
// @match        https://wplace.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wplace.live
// @license      ARR
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/543603/Wplace%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/543603/Wplace%20Overlay.meta.js
// ==/UserScript==

const IS_TAMPERMONKEY = typeof GM_getValue === "function" && typeof GM_setValue === "function" && typeof unsafeWindow === "object";
let overlayMode = IS_TAMPERMONKEY ? GM_getValue("OVERLAY_MODE", "over") : "over";
const OVERLAY_MODES = ["off", "over", "symbol", "difference", "out", "fill"];
let darken = IS_TAMPERMONKEY ? GM_getValue("DARKEN", false) : false;
const STYLES = ["liberty", "positron", "bright", "dark", "fiord"];
let currentStyle = IS_TAMPERMONKEY ? GM_getValue("STYLE", "liberty") : "liberty";
let darkMode = IS_TAMPERMONKEY ? GM_getValue("DARK_MODE", false) : false;

// =============================================================
// Want to add your own image to the overlay?
// We can help you with that on our discord server.
// See our web page on https://cfp.is-a.dev/wplace/ for details.
// =============================================================
const HOST = "cfp.is-a.dev";
const SUBPATH = "/wplace";

// Worker for canvas operations
const WORKER_CODE = `
self.addEventListener("message", async (event) => {
    const { id, originalBlob, overlayBlob, width, height, darken, overlayMode } = event.data;
    const OVERLAY_MODES = {"over": "source-over", "symbol": "source-over", "difference": "difference", "out": "source-out", "fill": "source-over"}
    const originalBitmap = await createImageBitmap(originalBlob);
    let overlayBitmap = await createImageBitmap(overlayBlob);

    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext("2d");

    ctx.imageSmoothingEnabled = false;

    ctx.drawImage(originalBitmap, 0, 0, width, height);
    ctx.globalCompositeOperation = OVERLAY_MODES[overlayMode] || "source-over";

    ctx.drawImage(overlayBitmap, 0, 0, width, height);
    if(darken) {
        ctx.globalCompositeOperation = "destination-over";
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, width, height);
    }
    ctx.globalCompositeOperation = "source-over";

    const resultBlob = await canvas.convertToBlob();
    self.postMessage({ id, resultBlob });
})
`

const workerBlob = new Blob([WORKER_CODE], { type: "application/javascript" });
const workerUrl = URL.createObjectURL(workerBlob);
const worker = new Worker(workerUrl);

const pending = new Map();

worker.onmessage = (e) => {
	const { id, resultBlob, error } = e.data;
	if (!pending.has(id)) return;
	if (error) {
		pending.get(id).reject(new Error(error));
	} else {
		pending.get(id).resolve(resultBlob);
	}
	pending.delete(id);
};

function postToWorker(data) {
	return new Promise((resolve, reject) => {
		pending.set(data.id, { resolve, reject });
		worker.postMessage(data);
	});
}

const fallbackSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
  <rect width="64" height="64" fill="#ccc"/>
  <text x="32" y="37" font-size="24" text-anchor="middle" fill="#333">!</text>
</svg>`;

const fallbackBlob = new Blob([fallbackSVG], { type: "image/svg+xml" });

const originalFetch = window.fetch;

if(!IS_TAMPERMONKEY) {
	unsafeWindow = window;
}

window.fetch = unsafeWindow.fetch = new Proxy(fetch, {
	apply: async (target, thisArg, argList) => {
		if (!argList[0]) {
			throw new Error("No URL provided to fetch");
		}

		const urlString = typeof argList[0] === "object" ? argList[0].url : argList[0];

		let url;
		try {
			url = new URL(urlString);
		} catch (e) {
			throw new Error("Invalid URL provided to fetch");
		}

		if (url.hostname === "backend.wplace.live" && url.pathname.startsWith("/files/")) {
			console.log("Intercepted fetch request to wplace.live");
			if (overlayMode !== "off") {
				const tileX = url.pathname.split("/")[4];
				let tileY = url.pathname.split("/")[5];
				if (overlayMode !== "over" && overlayMode !== "symbol") {
					tileY = tileY.replace(".png", "_orig.png");
				}

				let overlayUrl = overlayMode === "symbol" ?
					`https://${HOST}${SUBPATH}/tiles/${tileX}/${tileY.replace(".png", "_sym.png")}` : `https://${HOST}${SUBPATH}/tiles/${tileX}/${tileY}`;

				const [originalRes, overlayRes] = await Promise.all([
					originalFetch(urlString),
					originalFetch(overlayUrl)
				])

				if (overlayRes.status !== 200) {
					if (overlayRes.status === 404) {
						return originalRes;
					}
					console.error(`Overlay fetch failed with status ${overlayRes.status}, returning fallback`);
					return new Response(fallbackBlob, {
						status: 200,
						statusText: "OK",
						headers: {
							"Content-Type": fallbackBlob.type,
							"Cache-Control": "no-cache",
						}
					});
				}
				if (originalRes.status !== 200) {
					if (originalRes.status === 404) {
						return overlayRes;
					}
					// throw new Error(`Original fetch failed with status ${originalRes.status}`);
					console.error(`Original fetch failed with status ${originalRes.status}, returning fallback`);
					return new Response(fallbackBlob, {
						status: 200,
						statusText: "OK",
						headers: {
							"Content-Type": fallbackBlob.type,
							"Cache-Control": "no-cache",
						}
					});
				}

				const [originalBlob, overlayBlob] = await Promise.all([
					originalRes.blob(),
					overlayRes.blob()
				]);

				let width, height = 0;

				if (overlayMode !== "symbol") {
					width = 3000;
					height = 3000;
				} else {
					width = 7000;
					height = 7000;
				}

				const id = crypto.randomUUID();

				const resultBlob = await postToWorker({
					id,
					originalBlob,
					overlayBlob,
					width,
					height,
					darken,
					overlayMode
				});

				reloadText.style.display = "none";

				return new Response(resultBlob, {
					status: 200,
					statusText: "OK",
					headers: {
						"Content-Type": resultBlob.type,
						"Cache-Control": originalRes.headers.get("Cache-Control") || "no-cache",
					}
				});
			}

			reloadText.style.display = "none";
		}

		return target.apply(thisArg, argList);
	}
});

let reloadText = document.createElement("span");

function updateDarkMode() {
	const html = document.querySelector("html");
	if(darkMode) {
		html.style.setProperty("color-scheme", "dark");
		html.style.setProperty("--color-base-100", "#0e0e0e");
		html.style.setProperty("--color-base-200", "#1d1d1d");
		html.style.setProperty("--color-base-300", "#2e2e2e");
		html.style.setProperty("--color-base-content", "whitesmoke");
	} else {
		html.style.removeProperty("color-scheme");
		html.style.removeProperty("--color-base-100");
		html.style.removeProperty("--color-base-200");
		html.style.removeProperty("--color-base-300");
		html.style.removeProperty("--color-base-content");
	}
}

const symbolList = ["Black", "Dark Gray", "Gray", "Medium Gray", "Light Gray", "White", "Deep Red", "Dark Red", "Red", "Light Red", "Dark Orange", "Orange", "Gold", "Yellow", "Light Yellow", "Dark Goldenrod", "Goldenrod", "Light Goldenrod", "Dark Olive", "Olive", "Light Olive", "Dark Green", "Green", "Light Green", "Dark Teal", "Teal", "Light Teal", "Dark Cyan", "Cyan", "Light Cyan", "Dark Blue", "Blue", "Light Blue", "Dark Indigo", "Indigo", "Light Indigo", "Dark Slate Blue", "Slate Blue", "Light Slate Blue", "Dark Purple", "Purple", "Light Purple", "Dark Pink", "Pink", "Light Pink", "Dark Peach", "Peach", "Light Peach", "Dark Brown", "Brown", "Light Brown", "Dark Tan", "Tan", "Light Tan", "Dark Beige", "Beige", "Light Beige", "Dark Stone", "Stone", "Light Stone", "Dark Slate", "Slate", "Light Slate"];

function patchUI() {
	if (document.getElementById("overlay-button")) {
		return; // Button already exists, no need to patch again
	}
	if (!document.querySelector("#overlay-options")) {
		let overlayOptions = document.createElement("div");
		overlayOptions.id = "overlay-options";
		overlayOptions.style.position = "fixed";
		overlayOptions.style.top = "50%";
		overlayOptions.style.right = "50%";
		overlayOptions.style.transform = "translate(50%, -50%)";
		overlayOptions.style.width = "50%";
		overlayOptions.style.zIndex = "1000";
		overlayOptions.style.display = "none";
		overlayOptions.style.flexDirection = "column";
		overlayOptions.style.gap = "10px";
		overlayOptions.style.backgroundColor = "#0e0e0e7f";
		overlayOptions.style.padding = "10px";
		overlayOptions.style.borderRadius = "8px";
		overlayOptions.style.backdropFilter = "blur(15px)";
		document.body.appendChild(overlayOptions);

		let header = document.createElement("h2");
		header.textContent = "Wplace Overlay";
		header.style.color = "white";
		header.style.fontSize = "1.5em";
		header.style.fontWeight = "bold";
		header.style.display = "flex";
		header.style.alignItems = "center";
		overlayOptions.appendChild(header);

		let closeButton = document.createElement("button");
		closeButton.textContent = "X";
		closeButton.classList = "btn btn-square shadow-md";
		closeButton.style.marginLeft = "auto";
		closeButton.addEventListener("click", async () => {
			overlayOptions.animate([
				{ opacity: 1, transform: "translate(50%, -50%)" },
				{ opacity: 0, transform: "translate(50%, -40%)" }
			], {
				duration: 200,
				easing: "ease-out",
				fill: "forwards"
			});
			await new Promise(resolve => setTimeout(resolve, 200));
			overlayOptions.style.display = "none";
		});
		header.appendChild(closeButton);

		let blendButton = document.createElement("button");
		blendButton.id = "overlay-blend-button";
		blendButton.textContent = "Overlay: " + overlayMode.charAt(0).toUpperCase() + overlayMode.slice(1);
		blendButton.style.backgroundColor = "#0e0e0e7f";
		blendButton.style.color = "white";
		blendButton.style.border = "solid";
		blendButton.style.borderColor = "#1d1d1d7f";
		blendButton.style.borderRadius = "4px";
		blendButton.style.padding = "5px 10px";
		blendButton.style.cursor = "pointer";
		blendButton.style.backdropFilter = "blur(2px)";

		blendButton.addEventListener("click", () => {
			overlayMode = OVERLAY_MODES[(OVERLAY_MODES.indexOf(overlayMode) + 1) % OVERLAY_MODES.length];
			if (IS_TAMPERMONKEY) GM_setValue("OVERLAY_MODE", overlayMode);
			blendButton.textContent = `Overlay: ${overlayMode.charAt(0).toUpperCase() + overlayMode.slice(1)}`;
			console.log("Overlay mode set to:", overlayMode);
			reloadText.style.display = "";
		});

		let darkenMode = document.createElement("button");
		darkenMode.textContent = `Darken: ${darken ? "On" : "Off"}`;
		darkenMode.style.backgroundColor = "#0e0e0e7f";
		darkenMode.style.color = "white";
		darkenMode.style.border = "solid";
		darkenMode.style.borderColor = "#1d1d1d7f";
		darkenMode.style.borderRadius = "4px";
		darkenMode.style.padding = "5px 10px";
		darkenMode.style.cursor = "pointer";
		darkenMode.style.backdropFilter = "blur(2px)";

		darkenMode.addEventListener("click", () => {
			darken = !darken;
			if(IS_TAMPERMONKEY) GM_setValue("DARKEN", darken);
			darkenMode.textContent = `Darken: ${darken ? "On" : "Off"}`;
			console.log("Darken mode set to:", darken);
			reloadText.style.display = "";
		});

		let darkModeButton = document.createElement("button");
		darkModeButton.textContent = `UI Dark Mode: ${darkMode ? "On" : "Off"}`;
		darkModeButton.style.backgroundColor = "#0e0e0e7f";
		darkModeButton.style.color = "white";
		darkModeButton.style.border = "solid";
		darkModeButton.style.borderColor = "#1d1d1d7f";
		darkModeButton.style.borderRadius = "4px";
		darkModeButton.style.padding = "5px 10px";
		darkModeButton.style.cursor = "pointer";
		darkModeButton.style.backdropFilter = "blur(2px)";

		darkModeButton.addEventListener("click", () => {
			darkMode = !darkMode;
			if(IS_TAMPERMONKEY) GM_setValue("DARK_MODE", darkMode);
			darkModeButton.textContent = `UI Dark Mode: ${darkMode ? "On" : "Off"}`;
			console.log("UI Dark Mode set to:", darkMode);
			updateDarkMode();
		});

		overlayOptions.appendChild(blendButton);
		overlayOptions.appendChild(darkenMode);
		overlayOptions.appendChild(darkModeButton);
	}

	let overlayButton = document.createElement("button");
	overlayButton.classList = "btn btn-square shadow-md";
	overlayButton.title = "Overlay Options";
	overlayButton.id = "overlay-button";
	overlayButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles-icon lucide-sparkles"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/></svg>';
	overlayButton.addEventListener("click", async () => {
		const overlayOptions = document.getElementById("overlay-options");
		if (overlayOptions.style.display === "none") {
			overlayOptions.style.display = "flex";
			overlayOptions.animate([
				{ opacity: 0, transform: "translate(50%, -40%)" },
				{ opacity: 1, transform: "translate(50%, -50%)" }
			], {
				duration: 200,
				easing: "ease-out",
				fill: "forwards"
			});
		} else {
			overlayOptions.animate([
				{ opacity: 1, transform: "translate(50%, -50%)" },
				{ opacity: 0, transform: "translate(50%, -40%)" }
			], {
				duration: 200,
				easing: "ease-out",
				fill: "forwards"
			});
			await new Promise(resolve => setTimeout(resolve, 200));
			overlayOptions.style.display = "none";
		}
	});

	const buttonContainer = document.querySelector("div.gap-4:nth-child(1) > div:nth-child(2)");
	const leftSidebar = document.querySelector("div.gap-4:nth-child(1)");
	const paintMenu = document.querySelector("div.rounded-t-box > div.relative.px-3 > div.mb-4.mt-3 div")
	if (buttonContainer) {
		buttonContainer.appendChild(overlayButton);
		buttonContainer.classList.remove("items-center");
		buttonContainer.classList.add("items-end");

		reloadText.textContent = "Zoom out and in to load the overlay!";
		reloadText.style.color = "red";
		reloadText.style.fontWeight = "bold";
		reloadText.style.maxWidth = "200px";
		reloadText.style.textAlign = "right";
		reloadText.style.backgroundColor = "#ffffff7f";
		reloadText.style.borderRadius = "4px";
		reloadText.style.backdropFilter = "blur(2px)";
		buttonContainer.appendChild(reloadText);
	}
	if (leftSidebar) {
		leftSidebar.classList.add("items-end");
		leftSidebar.classList.remove("items-center");
	}
	if (paintMenu) {
		symbolList.forEach((color) => {
			let b = paintMenu.querySelector('div[data-tip="' + color + '"] > button');
			if (b) {
				let colorImg = document.createElement("img");
				colorImg.src = `https://${HOST}${SUBPATH}/symbols/` + color + ".png";
				colorImg.style.borderRadius = "4px";
				if (color.startsWith("Light") || color === "White") {
					colorImg.style.borderColor = "black";
					colorImg.style.backgroundColor = "black";
				} else {
					colorImg.style.borderColor = "white";
					colorImg.style.backgroundColor = "white";
				}
				colorImg.style.width = colorImg.style.height = "20px";
				colorImg.style.imageRendering = "pixelated";
				colorImg.style.imageRendering = "-moz-crisp-edges";
				colorImg.style.position = "absolute";
				colorImg.style.top = colorImg.style.left = "-5px";
				colorImg.class = "z-50";
				b.appendChild(colorImg);
			}
		});
	}
}

const observer = new MutationObserver(() => {
	patchUI();
});

observer.observe(document.querySelector("div.gap-4:nth-child(1)"), {
	childList: true,
	subtree: true
});

patchUI();

fetch(`https://${HOST}${SUBPATH}/api/motd`).catch(err => {
	alert("[Wplace Overlay] Server unreachable / Server nicht erreichbar:\n" + err.message);
}).then(async (res) => {
	if (!res) return;
	if (res.status !== 200) {
		alert(`[Wplace Overlay] Failed to contact Server / Fehler beim Kontaktieren des Servers: ${res.status} ${res.statusText}`);
		return;
	}
	const data = await res.json().catch(() => {
		alert("[Wplace Overlay] Invalid response from server / Ungültige Antwort vom Server.");
		return null;
	});
	if (data && data.motd) {
		alert("[Wplace Overlay] " + data.motd);
	}
});

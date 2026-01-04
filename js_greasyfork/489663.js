// ==UserScript==
// @name         Hide Crime Outcome
// @namespace    dev.kwack.torn.hide-crime-results
// @version      2.2.11
// @description  Hides the crime outcome panel for quick clicking. Quick and dirty script
// @author       Kwack [2190604]
// @match        https://www.torn.com/loader.php?sid=crimes*
// @match        https://www.torn.com/page.php?sid=crimes*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant 	 unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/489663/Hide%20Crime%20Outcome.user.js
// @updateURL https://update.greasyfork.org/scripts/489663/Hide%20Crime%20Outcome.meta.js
// ==/UserScript==

// I hope you like spaghetti 🍝
// Special shoutout to Spec [3118077] for the request, the minimal mode, and for some good testing.

(() => {
	const SVG_SETTINGS = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentcolor" stroke="transparent" stroke-width="0" width="15" height="15" viewBox="0 0 23 23"><path d="M24 13.616v-3.232c-1.651-.587-2.694-.752-3.219-2.019v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 1.375-3.707.847h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232c-.582 1.635-.749 2.692-2.019 3.219h-.001c-1.271.528-2.132-.098-3.707-.847l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 1.271-1.584 1.438-3.219 2.02v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 3.707l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847h.001c1.27.526 1.436 1.579 2.019 3.219h3.232c.582-1.636.75-2.69 2.027-3.222h.001c1.262-.524 2.12.101 3.698.851l2.285-2.286c-.744-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"></path></svg>`;
	const SVG_ARROW = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="44" viewBox="0 0 18 44"><path d="M0,44,15,22h3L3,44ZM15,22,0,0H3L18,22Z"></path></svg>`;
	const MODES = [
		{
			name: "Disabled",
			img: "https://raw.githubusercontent.com/Kwack-Kwack/scripts/main/static/images/hide-player-filters_mode-disabled.gif",
			description: "Disables the script, showing the full crime outcome as normal.",
			color: "#777",
		},
		{
			name: "Hidden",
			img: "https://raw.githubusercontent.com/Kwack-Kwack/scripts/main/static/images/hide-player-filters_mode-hidden.gif",
			description: "Hides the crime outcome content completely, ideal for quickly spamming crimes.",
			color: "red",
		},
		{
			name: "Minimal",
			img: "https://raw.githubusercontent.com/Kwack-Kwack/scripts/main/static/images/hide-player-filters_mode-minimal.gif",
			description: "Hides only the story text, but keeps the important information.",
			color: "orange",
		},
		{
			name: "Toast",
			img: "https://raw.githubusercontent.com/Kwack-Kwack/scripts/main/static/images/hide-player-filters_mode-toast.gif",
			description: "Shows a small toast notification in the bottom right corner with the outcome",
			color: "green",
		},
		// More coming soon...
	];

	const mutationCallback = () => {
		const header = $("div.crimes-app > div[class*=appHeader_]");
		if (header && !header?.find?.("a#kw--crimes-settings-btn")[0]) addSettingsIcon(header);

		if (!$("#kw--crimes-settings")[0]) addSettingsElement();
		// debugger;
	};
	new MutationObserver(mutationCallback).observe($("div#react-root")[0], { childList: true, subtree: true });

	const addSettingsIcon = (header) => {
		if (!header || !(header instanceof $)) return;
		const existing = header.find("a");
		header
			.children()
			.first()
			.after(
				$("<a/>", {
					class: existing.attr("class"),
					id: "kw--crimes-settings-btn",
					style: "color: var(--kw--icon-color)",
				})
					.append(SVG_SETTINGS)
					.append(new Text("Hide Outcome"))
					.on("click", () => $("#kw--crimes-settings").removeClass("kw-hide"))
			);
	};

	const addSettingsElement = () => {
		let modeIndex = getSetting("mode") ?? 0;
		setMode(modeIndex); // Will trigger the class change

		const changeModeIndex = (increase) => {
			if (increase) {
				modeIndex === MODES.length - 1 ? (modeIndex = 0) : modeIndex++;
			} else {
				modeIndex === 0 ? (modeIndex = MODES.length - 1) : modeIndex--;
			}

			$("#kw--crimes-slider").css("transform", `translateX(-${modeIndex * 100}%)`);
		};
		$("body").append(
			$("<div/>", { id: "kw--crimes-settings", class: "kw-hide" })
				.append(
					$("<div/>")
						.append(
							$("<h1/>", { text: "Hide Crime Outcome" }),
							$("<div/>", {
								id: "kw--crimes-slider",
								style: `transform: translateX(-${modeIndex * 100}%)`,
							}).append(...MODES.map((mode) => generateSliderPage(mode, changeModeIndex))),
							$("<button/>", { id: "kw--crimes-settings-save" })
								.append("Save")
								.on("click", () => {
									$("#kw--crimes-settings").addClass("kw-hide");
									setMode(modeIndex);
								})
						)
						.on("click", (e) => e.stopPropagation())
				)
				.on("click", () => $("#kw--crimes-settings").addClass("kw-hide"))
		);
	};

	const getSetting = (key) => GM_getValue(`kw.hide-outcome.settings.${key}`) ?? 0;
	const setSetting = (key, value) => GM_setValue(`kw.hide-outcome.settings.${key}`, value);

	const setMode = (modeIndex) => {
		if (typeof modeIndex !== "number") {
			const parsed = parseInt(modeIndex);
			if (isNaN(parsed)) {
				console.error(`Invalid modeIndex ${modeIndex}, defaulting to 0`);
				modeIndex = 0;
			} else modeIndex = parsed;
		}
		if (modeIndex < 0 || modeIndex >= MODES.length) {
			console.error(`Out of bounds modeIndex ${modeIndex}, defaulting to 0`);
			modeIndex = 0;
		}
		setSetting("mode", modeIndex);
		$("body").data("kw--crimes-mode", modeIndex);
		$("body").removeClass((_, c) =>
			c
				.split(" ")
				.filter((c) => c.startsWith("kw--crimes-mode-"))
				.join(" ")
		);
		$("body").addClass("kw--crimes-mode-" + MODES[modeIndex].name.toLowerCase());
	};

	const generateSliderPage = ({ img, name, color }, changeModeIndex) =>
		$(`<div/>`, { class: "kw--crimes-slider-page" }).append(
			$("<button/>", { style: "transform: scaleX(-1)" })
				.on("click", () => changeModeIndex(true))
				.append($(SVG_ARROW)),
			$("<div/>").append(
				$("<h2/>", { text: name, style: `color: ${color}` }),
				$("<img/>", { src: img, alt: name })
			),
			$("<button/>")
				.on("click", () => changeModeIndex(false))
				.append($(SVG_ARROW))
		);

	const addToastContainer = () => $("body").append($("<div/>", { id: "kw--crimes-toast-container" }));
	const showToast = (type, msg) => {
		console.log({ type, msg });
		let el;
		$("#kw--crimes-toast-container").append(
			(el = $("<div/>", {
				class: `kw--crimes-toast kw--crimes-toast-${type}`,
				text: `${type?.toUpperCase()} - ${msg}`,
			}))
		);
		setTimeout(el.remove.bind(el), 5000);
	};

	const getWindow = () => {
		try {
			return typeof unsafeWindow === "undefined" ? window : unsafeWindow;
		} catch {
			return window;
		}
	}

	const fetchInjection = (oldFetch) => {
		getWindow().fetch = (...args) =>
			new Promise((resolve, reject) => {
				oldFetch
					.apply(this, args)
					.then((r) => {
						try {
							const url = new URL(r.url);
							if ($(document.body).data("kw--crimes-mode") !== 3) return resolve(r);
							if (
								url.pathname === "/page.php" &&
								url.searchParams.get("sid") === "crimesData" &&
								url.searchParams.get("step") === "attempt"
							) {
								r.clone()
									.json()
									.then((data) => {
										const outcome = data?.DB?.outcome;
										showToast(
											outcome.result?.replaceAll(" ", ""),
											outcome?.rewards?.map((r) => stringifyReward(r)).join(", ") ||
												"No reward detected"
										);
									});
							}
							resolve(r);
						} catch (e) {
							console.error(`kw--hide-crime-outcome fetchInject error ${e.toString()}`);
							resolve(r); // Resolve the original response - this error is an error in the intercept, not the request
						}
					})
					.catch(reject); // Reject with original error
			});

		function stringifyReward(reward) {
			switch (reward.type.toLowerCase()) {
				// MISSING: Losing an item critfail
				case "money":
					return reward.value ? `$${reward.value}` : "Issue parsing money amount";
				case "jail":
				case "hospital":
					return reward.value
						? `${reward.type === "jail" ? "Jailed" : "Hosped"} until ${new Date(
								reward.value * 1000
						  ).toLocaleTimeString()}`
						: `Issue parsing ${reward.type === "jail" ? "Jailed" : "Hosped"} time`;
				case "items":
					return Array.isArray(reward.value)
						? reward.value.map(({ name, amount }) => `${amount}x ${name}`).join(", ")
						: `Issue parsing reward "${reward.type}"`;
				case "ammo":
					return reward.value.name && reward.value.amount
						? `${reward.value.amount}x ${reward.value.name}`
						: `Issue parsing ammo reward`;
				case "other":
					return reward.textTablet || reward.text || "Unknown other reward text";
				case "injury": return reward.value ? `Lost ${reward.value} life` : "Issue parsing injury amount";
				default:
					console.warn(`Unexpected reward type ${reward.type} for reward ${JSON.stringify(reward)}`);
					return `Unknown reward type ${reward.type}`;
			}
		}
	};

	const addStyle = (modes) => {
		const modeStyles = modes
			.map(
				(m) => `body.kw--crimes-mode-${m.name.toLowerCase()} {
			--kw--icon-color: ${m.color};
		}`
			)
			.join("\n\n");
		GM_addStyle(modeStyles);
		GM_addStyle(`
		#kw--crimes-settings {
			position: fixed;
			top: 0;
			right: 0;
			left: 0;
			bottom: 0;
			z-index: 99998;
			background: rgba(0, 0, 0, 0.3);
		}

		/* All buttons except the arrow buttons */
		#kw--crimes-settings button {
			color: var(--btn-color);
			background: var(--btn-background);
			cursor: pointer;
			padding: 0.5em;
		}

		#kw--crimes-settings button:hover {
			color: var(--btn-hover-color);
			background: var(--btn-hover-background);
		}

		#kw--crimes-settings > div {
			margin: 14vh auto 0;
			width: 90vw;
			max-width: 600px;
			background: var(--chat-box-bg);
			z-index: 99999;
			display: flex;
			flex-direction: column;
			gap: 1rem;
			border-radius: 1rem;
			overflow: clip;
		}

		/* Reset weird TORN css */
		#kw--crimes-settings h1, #kw--crimes-settings h2 {
			margin: 0;
			padding: 0.5em;
			text-align: center;
		}

		#kw--crimes-settings h1 {
			font-size: 2rem;
			border-bottom: 3px solid var(--panel-border-bottom-color);
		}

		#kw--crimes-settings #kw--crimes-slider {
			margin: 0;
			width: 100%;
			display: flex;
			/* overflow-x: clip; */
		}

		#kw--crimes-settings #kw--crimes-slider > div.kw--crimes-slider-page {
			width: 100%;
			flex-shrink: 0;
			display: flex;
			justify-content: space-between;
			gap: 1rem;
		}

		#kw--crimes-settings #kw--crimes-slider > div.kw--crimes-slider-page > button {
			background: transparent;
			
		}

		#kw--crimes-settings #kw--crimes-slider img {
			width: 100%;
			height: auto;
		}

		#kw--crimes-settings #kw--crimes-settings-save {
			width: 100%;
			padding: 1em;
		}

		.kw-hide {
			display: none !important;
		}
		
		body.kw--crimes-mode-hidden {
			--kw--icon-color: red;
		}

		body.kw--crimes-mode-minimal {
			--kw--icon-color: orange;
		}

		body.kw--crimes-mode-toast {
			--kw--icon-color: green;
		}

		body.kw--crimes-mode-disabled {
			--kw--icon-color: #777;
		}

		body.kw--crimes-mode-hidden [class*=outcomePanel_], body.kw--crimes-mode-toast [class*=outcomePanel_],
		body.kw--crimes-mode-hidden [class*=outcomeWrapper_], body.kw--crimes-mode-toast [class*=outcomeWrapper_] {
			display: none;
		}

		body.kw--crimes-mode-minimal [class*=outcomePanel_] [class*=story_], body.kw--crimes-mode-minimal [class*=outcomeWrapper_] [class*=story_] {
			display: none;
			
		}

		#kw--crimes-toast-container {
			display: none;
		}
		/* Only show the toast container when in toast mode */
		body.kw--crimes-mode-toast #kw--crimes-toast-container {
			display: flex;
			flex-direction: column-reverse;
			position: fixed;
			bottom: 0;
			right: 0;
			gap: 1px;
			z-index: 9999999999;
		}

		#kw--crimes-toast-container .kw--crimes-toast {
			--toast-bg: darkslategray;
			--toast-color: white;
			background: var(--toast-bg);
			color: var(--toast-color);
			padding: 1em;
			border-radius: 0.5em;
			margin: 0.5em;
			transition: all 0.5s;
			font-size: 1rem;
			min-width: 10vw;
		}
		/* Only show the last 3 toasts */
		#kw--crimes-toast-container .kw--crimes-toast:not(:nth-last-child(-n+3)) {
			display: none;
		}

		#kw--crimes-toast-container .kw--crimes-toast.kw--crimes-toast-criticalfailure {
			--toast-bg: red;
			--toast-color: white;
		}

		#kw--crimes-toast-container .kw--crimes-toast.kw--crimes-toast-failure {
			--toast-bg: darkorange;
			--toast-color: white;
		}

		#kw--crimes-toast-container .kw--crimes-toast.kw--crimes-toast-success {
			--toast-bg: green;
			--toast-color: white;
		}
	`);
	};

	addStyle(MODES);
	addToastContainer();
	fetchInjection(getWindow().fetch);
	mutationCallback();
})();

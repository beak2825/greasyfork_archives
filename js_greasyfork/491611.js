// ==UserScript==
// @name         Hospital filters
// @namespace    dev.kwack.torn.hospital-filters
// @version      1.0.0
// @description  Adds a simple revive filter to the hospital page
// @author       Kwack [2190604]
// @match        https://www.torn.com/hospitalview.php*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/491611/Hospital%20filters.user.js
// @updateURL https://update.greasyfork.org/scripts/491611/Hospital%20filters.meta.js
// ==/UserScript==

(async () => {
	addListeners();
	addStyles();
	rebuildFilters();
	
	function addStyles() {
		const styles = `
			.kw--hidden {
				display: none !important;
			}

			.kw--hospital-filters-container {
				background: var(--info-msg-bg-gradient, linear-gradient(to bottom,#ffffff 0%,#e4e4e4 100%));
				color: var(--info-msg-font-color, #666);
				border-radius: 5px;
				box-shadow: var(--info-msg-box-shadow, 1px 1px 4px rgba(0,0,0,.25));
				display: flex;
				justify-content: center;
				padding: 0.5rem;
			}
		`;
		$("head").append(`<style>${styles}</style>`);
	}

	function addListeners() {
		$(window).on("popstate", () => setTimeout(rebuildFilters, 10));
	}

	async function rebuildFilters() {
		const container = await waitForContainer();
		disableFilters(); // Remove all lingering filters
		addFilterElement(container);
	}

	function waitForContainer() {
		return new Promise((resolve, reject) => {
			let el = $("div.userlist-wrapper > ul.user-info-list-wrap");
			if (isReady(el)) resolve(el);
			else {
				count = 0;
				const id = setInterval(() => {
					el = $("div.userlist-wrapper > ul.user-info-list-wrap");
					if (isReady(el)) {
						resolve(el);
						clearInterval(id);
					}
					if (count++ > 50) {
						console.error("Could not find container element");
						clearInterval(id);
						reject();
					}
				}, 300);
			}
		})

		function isReady(el) {
			return el[0] && !el.find("span.ajax-preloader")[0]
		}
	}

	function disableFilters() {
		$("li.kw--hidden").removeClass("kw--hidden");
	}

	function enableFilters(container) {
		container.find("> li").filter((_, el) => $(el).find("a.revive").hasClass("reviveNotAvailable")).addClass("kw--hidden");
	}

	function addFilterElement(container) {
		if (!container) return console.error("Missing container element!");
		container.find(".kw--hospital-filters-container").remove();
		const parent = $("div.content-wrapper > div.msg-info-wrap");
		parent.children().each((_, el) => el.classList.add("kw--hidden"));
		const button = $("<button>", { class: "torn-btn", text: "Enable revive filter" }).data("enabled", false).on("click", (() => {
			const enabled = button.data("enabled");
			if (enabled) {
				disableFilters(container);
				button.text("Enable revive filter").data("enabled", false);
			} else {
				enableFilters(container);
				button.text("Disable revive filter").data("enabled", true);
			}
		}));
		parent.append(
			$("<div>", { class: "kw--hospital-filters-container" }).append(button)
		)
		
	}
})();
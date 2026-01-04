// ==UserScript==
// @name            HaGeZi to NextDNS
// @namespace       vietthe.dev
// @match           https://my.nextdns.io/*
// @grant           GM_addStyle
// @version         1.1.5
// @license         MIT
// @author          vietthedev
// @compatible      firefox Violentmonkey
// @compatible      firefox Tampermonkey
// @compatible      chrome Violentmonkey
// @compatible      chrome Tampermonkey
// @compatible      opera Violentmonkey
// @compatible      opera Tampermonkey
// @compatible      safari Stay
// @compatible      edge Violentmonkey
// @compatible      edge Tampermonkey
// @compatible      brave Violentmonkey
// @compatible      brave Tampermonkey
// @description     A userscript that allows you to fetch HaGeZi lists and add them to your NextDNS allowlist and denylist.
// @description:en  A userscript that allows you to fetch HaGeZi lists and add them to your NextDNS allowlist and denylist.
// @description:vi  Userscript giúp bạn nhập các danh sách HaGeZi vào danh sách cho phép và danh sách chặn của NextDNS.
// @icon            data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAFOklEQVRogbXaXaicRxkH8N/sJmnSlOZIDC1CJRCseETFK72qFBpFvJQUpAptFdorL0pKkV540AvxQm8sokdsY6ISjNVCxSBUiSLRoq0XYpEqGGmbUGxPTmKO52N35/Fi93zsnvdrPzIw7Owzzzzz/z/zzLwz77zJzUgL0TLvsDV3oKfnigddk1LMuqvWrA2CY+6x7qzkT3hR26IfmL8ZXaWZWzwTn8ZTuENIAiEL/xQ+4+H08iy7mx2Bp+OIPb4geVI4aDNYYpD75beFx6x4zhfT9Vl0Oz2BZ2JO23E8LNyLW0rA93NyXfYLnHLI792fVqfpfnICp+Og5H7hIXxIuL0UdHH5LbyoZ9H7/NK9qTsJjAoCkTzvgGWHtOyT7ZW8U/JB4T7huDDXEOxweff/K8J5PRdkf9N2TdbBumXXLKS18Qn8KD6BE/iA7DDmMCe0xwZcDX5YRkd2VVgW/iP7M844mV5qTuCH8ajkq8JhMdAZ7qQZ6NyAyKjOqDzLuIzPeTxdqCdwOj4ieU5yZ4F3xvfwaF2ZrE6e/V1y3BPp9Z1whx9kC7FH8knhiDzwQoz8VpXr6spkVfLt/G49x42kYQLz9uOY0N5iv2l8NBeBHRd8kZ2iNj2EA8IxJ6K9E/KeEULtgWI/jRMelMfzOOFSXp9kt3qH1oBSAYEVaUs27iozC/BldrZz27uG5+0wgX2SDa3K1WMWICcB369vu1pFYFWStG7aSjJuKO2uS94zhHjXHCAGBMYBT/16Pj34PralqhFYk9wibc3+nUaqQE4aElGgU01q13NrmMB+oTswebNCosoJuUKnn7NLVQQ2hKQ781AZZ7Sq7CRdR7c0Cgi0ZV0bMwdfpLMpG8/O+g6tAgIHdF23OnWoVOnsBNpk1LbbBFarCSzrym5IDUDWdTwt+FGd/q70hoVUQWBJx5yrQtg+kE8Wy+NO5HqdDWHZSBrZjaYsW5L1SjdWUSJvstuMCXX65Q3J26MEdj/IuCJbE25r7LEmYVVmp4n9ft2acKWeQM9lYVW4bQzjTSZhuW4z+arwRj2BrktaVoQjM/d2k/qyNsmSjsujcHe/WvyXN2SvV56OymJ4+ABSd8Iqb1vc30WLqVNPYDF1ZL8unWDTgi+byGWTd1t+fhfWQgLQ8/OhlajOm+OuMKOAy+TbsiXrftOcQPZX2Uu1Ht+Zy4e+2NtFI1W+hJ51qvjlVjGB/vPgO3olwKYFWQV+d7iuyE4X4iwlAD0vyF6p9FLR6JSF06i8rrydL2j5x/gE9npTeFbWaTxJm8qL7BTpcEN41l27txCbqfrt9JfibuFXsqMMDNPsuVCmX9Reaf1FLZ9yKpUSqL5i+lp6Vfb1rVEo8lLRsNeF0GjbYof8FyerwNcTgGXfF87I8kThUka8uryq5ytOpz/UwasnsJg6woLsd7Ugy1eScSZyFn5i3fdqsRnnhuax+KiuU8J7G8dzVXwXl0O4KDzgx+nfTWA1v2b9Zvqj8Ijwl6GVZLpQGfY854WHmoJnkjuyR2Jey7eFe+w8tTGp16EnnNXxhHNp15a5Ko1/0f3d9IrwgOynspXa1aR+tVmSfcucR8cFzzS3lCfigDmfHYTVh0XBO9Wd/43I6Ai/xVPu9vzoYb1pmu6eeCFaXnOX8HnZSQZ3C1XA+79vCl+238884y0m/4Zidjf1D8ZR2ZP4uHAn9o2A/p/+kfCcjm84l5Zm0e1sv5U4EW0Hzeu5T/YxvF/o4mXZBXu94IxL03h8NM3+Yw/6oXXJ7TYckmW3Wva0G7MEvpn+DxZzjNuWWt/KAAAAAElFTkSuQmCC
// @homepageURL     https://github.com/vietthedev/hagezi-to-nextdns
// @supportURL      https://github.com/vietthedev/hagezi-to-nextdns/issues
// @downloadURL https://update.greasyfork.org/scripts/547411/HaGeZi%20to%20NextDNS.user.js
// @updateURL https://update.greasyfork.org/scripts/547411/HaGeZi%20to%20NextDNS.meta.js
// ==/UserScript==

/* jshint esversion:2020 */

(async (window) => {
	const punycode = await import("https://esm.run/punycode");
	const lang = {
		en: {
			hidePanel: "Hide Panel",
			showPanel: "Show Panel",
			numberOfBlockedTlds: "Number of blocked TLDs",
			numberOfDeniedDomains: "Number of denied domains",
			numberOfAllowedDomains: "Number of allowed domains",
			importHageziTlds: "Import HaGeZi TLDs",
			removeHageziTlds: "Remove HaGeZi TLDs",
			importHageziTldsAggressive: "Import HaGeZi TLDs (Aggressive)",
			removeHageziTldsAggressive: "Remove HaGeZi TLDs (Aggressive)",
			importHageziTldAllowlist: "Import HaGeZi TLD allowlist",
			removeHageziTldAllowlist: "Remove HaGeZi TLD allowlist",
			importErrorTrackers: "Import error trackers",
			removeErrorTrackers: "Remove error trackers",
			importCustomList: "Import custom list",
			removeCustomList: "Remove custom list",
			adding: "Adding",
			removing: "Removing",
			done: "Done!",
			expand: "Expand",
			collapse: "Collapse",
			chooseAListToProceed:
				"Choose a list to proceed:\n1. Allowlist\n2. Denylist",
			areYouSureYouWantToProceed: "Are you sure you want to proceed?",
			allowlist: "Allowlist",
			denylist: "Denylist",
			enterTheLink:
				"Enter the link to the list in wildcard asterisk or wildcard domain format:",
		},
		vi: {
			hidePanel: "Ẩn Bảng",
			showPanel: "Hiện Bảng",
			numberOfBlockedTlds: "Số lượng TLD đã chặn",
			numberOfDeniedDomains: "Số lượng tên miền đã chặn",
			numberOfAllowedDomains: "Số lượng tên miền đã cho phép",
			importHageziTlds: "Nhập TLD HaGeZi",
			removeHageziTlds: "Xoá TLD HaGeZi",
			importHageziTldsAggressive: "Nhập TLD HaGeZi (phiên bản mạnh hơn)",
			removeHageziTldsAggressive: "Xoá TLD HaGeZi (phiên bản mạnh hơn)",
			importHageziTldAllowlist: "Nhập danh sách cho phép HaGeZi TLD",
			removeHageziTldAllowlist: "Xoá danh sách cho phép HaGeZi TLD",
			importErrorTrackers: "Nhập trình theo dõi lỗi",
			removeErrorTrackers: "Xoá trình theo dõi lỗi",
			importCustomList: "Nhập danh sách tuỳ chọn",
			removeCustomList: "Xoá danh sách tuỳ chọn",
			adding: "Đang thêm",
			removing: "Đang xoá",
			done: "Xong!",
			expand: "Mở rộng",
			collapse: "Thu gọn",
			chooseAListToProceed:
				"Chọn danh sách để tiến hành:\n1. Danh sách cho phép\n2. Danh sách chặn",
			areYouSureYouWantToProceed: "Bạn có chắc muốn tiến hành?",
			allowlist: "Danh sách cho phép",
			denylist: "Danh sách chặn",
			enterTheLink:
				'Nhập đường dẫn tới danh sách tên miền ở định dạng có hoặc không có dấu "*":',
		},
	}[window.navigator.language === "vi" ? "vi" : "en"];
	const ListType = {
		Allowlist: "1",
		Denylist: "2",
	};

	const Utility = {
		sleep: (ms = 500) =>
			new Promise((resolve) => setTimeout(() => resolve(), ms)),
		toHex: (text) => {
			let hex = "";

			for (let i = 0; i < text.length; i++) {
				const charCode = text.charCodeAt(i);
				const hexCode = charCode.toString(16).padStart(2, "0");

				hex += hexCode;
			}

			return hex;
		},
	};

	const Helper = {
		getProfileId: () => location.pathname.split("/")[1],

		profileIdExists: () => location.pathname.split("/").length >= 3,

		confirmProceed: () => window.confirm(lang.areYouSureYouWantToProceed),

		promptListType: () => {
			let answer;

			while (answer !== null && !Object.values(ListType).includes(answer)) {
				answer = window.prompt(lang.chooseAListToProceed);
			}

			return answer;
		},

		promptUrl: () => {
			const pattern =
				/^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/[a-zA-Z0-9]+\.[^\s]{2,}|[a-zA-Z0-9]+\.[^\s]{2,})$/;
			let answer;

			while (answer !== null && !pattern.test(answer)) {
				answer = window.prompt(lang.enterTheLink);
			}

			return answer;
		},

		getAdblockList: async (url, isTldList = false) => {
			const content = await fetch(url).then((res) => res.text());
			const matches = content
				.trim()
				.matchAll(/^(\|\|)?(?<domain>(xn--)?[\w.-]+)(\^)?$/gm);
			const domains = new Set();

			for (const match of matches) {
				if (isTldList && match.groups.domain.includes(".")) continue;
				domains.add(match.groups.domain);
			}

			return domains;
		},

		getWildcardList: async (url, isTldList = false) => {
			const content = await fetch(url).then((res) => res.text());
			const matches = content.trim().matchAll(/^(\*\.)*(?<domain>[\w.-]+)$/gm);
			const domains = new Set();

			for (const match of matches) {
				if (isTldList && match.groups.domain.includes(".")) continue;
				domains.add(match.groups.domain);
			}

			return domains;
		},

		getAbusedTlds: () =>
			Helper.getAdblockList(
				"https://cdn.jsdelivr.net/gh/hagezi/dns-blocklists@latest/adblock/spam-tlds-adblock.txt",
				true,
			),

		getAbusedTldsAggressive: () =>
			Helper.getWildcardList(
				"https://cdn.jsdelivr.net/gh/hagezi/dns-blocklists@latest/wildcard/spam-tlds-onlydomains.txt",
				true,
			),

		getTldAllowlist: () =>
			Helper.getWildcardList(
				"https://cdn.jsdelivr.net/gh/hagezi/dns-blocklists@latest/wildcard/spam-tlds-allow-onlydomains.txt",
			),

		getErrorTrackerList: () =>
			Helper.getWildcardList(
				"https://cdn.jsdelivr.net/gh/vietthedev/hagezi-to-nextdns@latest/resources/error-trackers-onlydomains.txt",
			),
	};

	class NextApi {
		apiHost = "https://api.nextdns.io";

		constructor(profileId) {
			this.profileId = profileId;
		}

		async request(path, options) {
			const response = await fetch(`${this.apiHost}${path}`, {
				headers: {
					"Content-Type": "application/json",
					...options?.headers,
				},
				mode: "cors",
				credentials: "include",
				...options,
			});

			if (!response.ok) {
				throw new Error(response.statusText);
			}

			return response;
		}

		async getSecurity() {
			const res = await this.request(`/profiles/${this.profileId}/security`);

			return await res.json();
		}

		async getDenylist() {
			const res = await this.request(`/profiles/${this.profileId}/denylist`);

			return await res.json();
		}

		async getAllowlist() {
			const res = await this.request(`/profiles/${this.profileId}/allowlist`);

			return await res.json();
		}

		addTld(tld) {
			return this.request(`/profiles/${this.profileId}/security/tlds`, {
				method: "POST",
				body: JSON.stringify({ id: tld }),
			});
		}

		removeTld(tld) {
			return this.request(
				`/profiles/${this.profileId}/security/tlds/hex:${Utility.toHex(tld)}`,
				{
					method: "DELETE",
				},
			);
		}

		denylistDomain(domain) {
			return this.request(`/profiles/${this.profileId}/denylist`, {
				method: "POST",
				body: JSON.stringify({ active: true, id: domain }),
			});
		}

		allowlistDomain(domain) {
			return this.request(`/profiles/${this.profileId}/allowlist`, {
				method: "POST",
				body: JSON.stringify({ active: true, id: domain }),
			});
		}

		removeDeniedDomain(domain) {
			return this.request(
				`/profiles/${this.profileId}/denylist/hex:${Utility.toHex(domain)}`,
				{
					method: "DELETE",
				},
			);
		}

		removeAllowedDomain(domain) {
			return this.request(
				`/profiles/${this.profileId}/allowlist/hex:${Utility.toHex(domain)}`,
				{
					method: "DELETE",
				},
			);
		}
	}

	const arrowDownHtml = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/></svg>`;
	const arrowUpHtml = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z"/></svg>`;

	const hidePanel = () => {
		const panelContainer = document.querySelector(".panel-container");
		const toggleButton = document.querySelector(".toggle-button");

		requestAnimationFrame(function hide() {
			const { opacity } = getComputedStyle(panelContainer);

			if (opacity === "0") {
				panelContainer.classList.add("hidden");

				if (toggleButton) {
					toggleButton.textContent = lang.showPanel;
				}

				return;
			}

			panelContainer.style.opacity = Number.parseFloat(opacity) - 0.1;
			requestAnimationFrame(hide);
		});
	};

	const showPanel = () => {
		const panelContainer = document.querySelector(".panel-container");
		const toggleButton = document.querySelector(".toggle-button");

		panelContainer.classList.remove("hidden");

		requestAnimationFrame(function show() {
			const { opacity } = getComputedStyle(panelContainer);

			if (opacity === "1") {
				if (toggleButton) {
					toggleButton.textContent = lang.hidePanel;
				}
				return;
			}

			panelContainer.style.opacity = Number.parseFloat(opacity) + 0.1;
			requestAnimationFrame(show);
		});
	};

	const createUserInterface = () => {
		const toggleButton = document.createElement("button");
		const toggleButtonContainer = document.createElement("div");
		const expandButton = document.createElement("button");
		const card = document.createElement("div");
		const cardHeader = document.createElement("div");
		const cardBody = document.createElement("div");
		const cardFooter = document.createElement("div");
		const statList = document.createElement("ul");
		const controlContainer = document.createElement("div");
		const importHageziTldsButton = document.createElement("button");
		const removeHageziTldsButton = document.createElement("button");
		const importHageziTldsAggressiveButton = document.createElement("button");
		const removeHageziTldsAggressiveButton = document.createElement("button");
		const importHageziTldAllowlistButton = document.createElement("button");
		const removeHageziTldAllowlistButton = document.createElement("button");
		const importErrorTrackersButton = document.createElement("button");
		const removeErrorTrackersButton = document.createElement("button");
		const importCustomListButton = document.createElement("button");
		const removeCustomListButton = document.createElement("button");
		const progress = document.createElement("p");
		const loader = document.createElement("div");

		loader.classList.add("text-center");
		loader.innerHTML = `<div class="loader" />`;

		statList.classList.add("stat-list");

		expandButton.classList.add("btn", "panel-expand-button");
		expandButton.type = "button";
		expandButton.innerHTML = arrowDownHtml;
		expandButton.title = lang.expand;

		controlContainer.classList.add("panel-control-container", "hidden");

		importHageziTldsButton.classList.add("btn", "btn-primary", "btn-sm");
		removeHageziTldsButton.classList.add("btn", "btn-danger", "btn-sm");
		importHageziTldsAggressiveButton.classList.add(
			"btn",
			"btn-primary",
			"btn-sm",
		);
		removeHageziTldsAggressiveButton.classList.add(
			"btn",
			"btn-danger",
			"btn-sm",
		);
		importHageziTldAllowlistButton.classList.add(
			"btn",
			"btn-primary",
			"btn-sm",
		);
		removeHageziTldAllowlistButton.classList.add("btn", "btn-danger", "btn-sm");
		importErrorTrackersButton.classList.add("btn", "btn-primary", "btn-sm");
		removeErrorTrackersButton.classList.add("btn", "btn-danger", "btn-sm");
		importCustomListButton.classList.add("btn", "btn-primary", "btn-sm");
		removeCustomListButton.classList.add("btn", "btn-danger", "btn-sm");

		importHageziTldsButton.type = "button";
		removeHageziTldsButton.type = "button";
		importHageziTldsAggressiveButton.type = "button";
		removeHageziTldsAggressiveButton.type = "button";
		importHageziTldAllowlistButton.type = "button";
		removeHageziTldAllowlistButton.type = "button";
		importErrorTrackersButton.type = "button";
		removeErrorTrackersButton.type = "button";
		importCustomListButton.type = "button";
		removeCustomListButton.type = "button";

		importHageziTldsButton.textContent = lang.importHageziTlds;
		removeHageziTldsButton.textContent = lang.removeHageziTlds;
		importHageziTldsAggressiveButton.textContent =
			lang.importHageziTldsAggressive;
		removeHageziTldsAggressiveButton.textContent =
			lang.removeHageziTldsAggressive;
		importHageziTldAllowlistButton.textContent = lang.importHageziTldAllowlist;
		removeHageziTldAllowlistButton.textContent = lang.removeHageziTldAllowlist;
		importErrorTrackersButton.textContent = lang.importErrorTrackers;
		removeErrorTrackersButton.textContent = lang.removeErrorTrackers;
		importCustomListButton.textContent = lang.importCustomList;
		removeCustomListButton.textContent = lang.removeCustomList;

		controlContainer.appendChild(importHageziTldsButton);
		controlContainer.appendChild(removeHageziTldsButton);
		controlContainer.appendChild(importHageziTldsAggressiveButton);
		controlContainer.appendChild(removeHageziTldsAggressiveButton);
		controlContainer.appendChild(importHageziTldAllowlistButton);
		controlContainer.appendChild(removeHageziTldAllowlistButton);
		controlContainer.appendChild(importErrorTrackersButton);
		controlContainer.appendChild(removeErrorTrackersButton);
		controlContainer.appendChild(importCustomListButton);
		controlContainer.appendChild(removeCustomListButton);

		progress.classList.add("panel-progress");

		card.classList.add("card", "panel-container", "hidden");
		card.style.opacity = "0";

		cardHeader.classList.add("card-header");
		cardHeader.innerHTML = `<h6 class="mb-0 text-center">HaGeZi to NextDNS</h6>`;

		cardBody.classList.add("card-body");
		cardBody.appendChild(loader);
		cardBody.appendChild(statList);
		cardBody.appendChild(progress);

		cardFooter.classList.add("card-footer", "panel-footer");
		cardFooter.appendChild(expandButton);
		cardFooter.appendChild(controlContainer);

		toggleButtonContainer.classList.add(
			"nav-item",
			"d-flex",
			"align-items-center",
			"toggle-button-container",
		);

		toggleButton.classList.add("btn", "btn-primary", "toggle-button");
		toggleButton.textContent = toggleButton.classList.contains("hidden")
			? lang.showPanel
			: lang.hidePanel;
		toggleButton.type = "button";

		toggleButton.addEventListener("click", () => {
			const panelContainer = document.querySelector(".panel-container");

			if (!panelContainer.classList.contains("hidden")) {
				hidePanel();
				return;
			}

			showPanel();
		});

		card.appendChild(cardHeader);
		card.appendChild(cardBody);
		card.appendChild(cardFooter);
		toggleButtonContainer.appendChild(toggleButton);
		document.body.appendChild(card);

		return {
			card,
			cardBody,
			cardFooter,
			loader,
			progress,
			statList,
			expandButton,
			controlContainer,
			toggleButtonContainer,
			importHageziTldsButton,
			removeHageziTldsButton,
			importHageziTldsAggressiveButton,
			removeHageziTldsAggressiveButton,
			importHageziTldAllowlistButton,
			removeHageziTldAllowlistButton,
			importErrorTrackersButton,
			removeErrorTrackersButton,
			importCustomListButton,
			removeCustomListButton,
		};
	};

	const {
		cardBody,
		loader,
		progress,
		statList,
		expandButton,
		controlContainer,
		toggleButtonContainer,
		importHageziTldsButton,
		removeHageziTldsButton,
		importHageziTldsAggressiveButton,
		removeHageziTldsAggressiveButton,
		importHageziTldAllowlistButton,
		removeHageziTldAllowlistButton,
		importErrorTrackersButton,
		removeErrorTrackersButton,
		importCustomListButton,
		removeCustomListButton,
	} = createUserInterface();

	const addToggleButton = () => {
		const observer = new MutationObserver(() => {
			const nav = document.querySelector(".nav");

			if (!nav || nav.querySelector(".toggle-button")) return;

			nav.appendChild(toggleButtonContainer);
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	};

	const updateLoadingState = (loading) => {
		if (loading) {
			importHageziTldsButton.disabled = true;
			removeHageziTldsButton.disabled = true;
			importHageziTldsAggressiveButton.disabled = true;
			removeHageziTldsAggressiveButton.disabled = true;
			importHageziTldAllowlistButton.disabled = true;
			removeHageziTldAllowlistButton.disabled = true;
			importErrorTrackersButton.disabled = true;
			removeErrorTrackersButton.disabled = true;
			importCustomListButton.disabled = true;
			removeCustomListButton.disabled = true;

			return;
		}

		importHageziTldsButton.disabled = false;
		removeHageziTldsButton.disabled = false;
		importHageziTldsAggressiveButton.disabled = false;
		removeHageziTldsAggressiveButton.disabled = false;
		importHageziTldAllowlistButton.disabled = false;
		removeHageziTldAllowlistButton.disabled = false;
		importErrorTrackersButton.disabled = false;
		removeErrorTrackersButton.disabled = false;
		importCustomListButton.disabled = false;
		removeCustomListButton.disabled = false;
	};

	const refreshStats = async () => {
		const profileId = Helper.getProfileId();
		const nextApi = new NextApi(profileId);

		updateLoadingState(true);

		const [tlds, denylist, allowlist] = await Promise.all([
			nextApi
				.getSecurity()
				.then((res) =>
					res.data.tlds.map(({ id }) =>
						id.startsWith("xn--") ? punycode.toUnicode(id) : id,
					),
				),
			nextApi.getDenylist().then((res) => res.data.map(({ id }) => id)),
			nextApi.getAllowlist().then((res) => res.data.map(({ id }) => id)),
		]);
		const tldContent = new Blob([tlds.toSorted().join("\n")], {
			type: "text/plain;charset=utf-8",
		});
		const denylistContent = new Blob([denylist.toSorted().join("\n")], {
			type: "text/plain",
		});
		const allowlistContent = new Blob([allowlist.toSorted().join("\n")], {
			type: "text/plain",
		});

		updateLoadingState(false);

		statList.innerHTML = `
    <li>${lang.numberOfBlockedTlds}: <a href="${URL.createObjectURL(tldContent)}" target="_blank">${tlds.length}</a></li>
    <li>${lang.numberOfDeniedDomains}: <a href="${URL.createObjectURL(denylistContent)}" target="_blank">${denylist.length}</a></li>
    <li>${lang.numberOfAllowedDomains}: <a href="${URL.createObjectURL(allowlistContent)}" target="_blank">${allowlist.length}</a></li>
    `;
	};

	const attachButtonEvents = () => {
		expandButton.addEventListener("click", (event) => {
			const target = event.currentTarget;

			if (controlContainer.classList.contains("hidden")) {
				controlContainer.classList.remove("hidden");
				target.title = lang.collapse;
				target.innerHTML = arrowUpHtml;
				return;
			}

			controlContainer.classList.add("hidden");
			target.title = lang.expand;
			target.innerHTML = arrowDownHtml;
		});

		importHageziTldsButton.addEventListener("click", async () => {
			if (!Helper.confirmProceed()) return;

			updateLoadingState(true);

			const profileId = Helper.getProfileId();
			const nextApi = new NextApi(profileId);

			try {
				const [currentTlds, hageziTlds] = await Promise.all([
					nextApi
						.getSecurity()
						.then((res) => res.data.tlds.map(({ id }) => id)),
					Helper.getAbusedTlds(),
				]);
				const tldsToImport = hageziTlds.difference(new Set(currentTlds));
				let index = 1;

				for (const domain of tldsToImport) {
					progress.textContent = `${lang.adding} ${domain} (${index}/${tldsToImport.size})`;
					await nextApi.addTld(domain);
					await Utility.sleep();
					index++;
				}
			} catch (error) {
				progress.textContent = error.message;
				return;
			}

			await refreshStats();
			progress.textContent = lang.done;
			updateLoadingState(false);
		});

		removeHageziTldsButton.addEventListener("click", async () => {
			if (!Helper.confirmProceed()) return;

			updateLoadingState(true);

			const profileId = Helper.getProfileId();
			const nextApi = new NextApi(profileId);

			try {
				const [currentTlds, hageziTlds] = await Promise.all([
					nextApi
						.getSecurity()
						.then((res) => res.data.tlds.map(({ id }) => id)),
					Helper.getAbusedTlds(),
				]);
				const tldsToRemove = hageziTlds.intersection(new Set(currentTlds));
				let index = 1;

				for (const domain of tldsToRemove) {
					progress.textContent = `${lang.removing} ${domain} (${index}/${tldsToRemove.size})`;
					await nextApi.removeTld(domain);
					await Utility.sleep();
					index++;
				}
			} catch (error) {
				progress.textContent = error.message;
				return;
			}

			await refreshStats();
			progress.textContent = lang.done;
			updateLoadingState(false);
		});

		importHageziTldsAggressiveButton.addEventListener("click", async () => {
			if (!Helper.confirmProceed()) return;

			updateLoadingState(true);

			const profileId = Helper.getProfileId();
			const nextApi = new NextApi(profileId);

			try {
				const [currentTlds, hageziTlds] = await Promise.all([
					nextApi
						.getSecurity()
						.then((res) => res.data.tlds.map(({ id }) => id)),
					Helper.getAbusedTldsAggressive(),
				]);
				const tldsToImport = hageziTlds.difference(new Set(currentTlds));
				let index = 1;

				for (const domain of tldsToImport) {
					progress.textContent = `${lang.adding} ${domain} (${index}/${tldsToImport.size})`;
					await nextApi.addTld(domain);
					await Utility.sleep();
					index++;
				}
			} catch (error) {
				progress.textContent = error.message;
				return;
			}

			await refreshStats();
			progress.textContent = lang.done;
			updateLoadingState(false);
		});

		removeHageziTldsAggressiveButton.addEventListener("click", async () => {
			if (!Helper.confirmProceed()) return;

			updateLoadingState(true);

			const profileId = Helper.getProfileId();
			const nextApi = new NextApi(profileId);

			try {
				const [currentTlds, hageziTlds] = await Promise.all([
					nextApi
						.getSecurity()
						.then((res) => res.data.tlds.map(({ id }) => id)),
					Helper.getAbusedTldsAggressive(),
				]);
				const tldsToRemove = hageziTlds.intersection(new Set(currentTlds));
				let index = 1;

				for (const domain of tldsToRemove) {
					progress.textContent = `${lang.removing} ${domain} (${index}/${tldsToRemove.size})`;
					await nextApi.removeTld(domain);
					await Utility.sleep();
					index++;
				}
			} catch (error) {
				progress.textContent = error.message;
				return;
			}

			await refreshStats();
			progress.textContent = lang.done;
			updateLoadingState(false);
		});

		importHageziTldAllowlistButton.addEventListener("click", async () => {
			if (!Helper.confirmProceed()) return;

			updateLoadingState(true);

			const profileId = Helper.getProfileId();
			const nextApi = new NextApi(profileId);

			try {
				const [currentAllowlist, hageziTldAllowlist] = await Promise.all([
					nextApi.getAllowlist().then((res) => res.data.map(({ id }) => id)),
					Helper.getTldAllowlist(),
				]);
				const domainsToImport = hageziTldAllowlist.difference(
					new Set(currentAllowlist),
				);
				let index = 1;

				for (const domain of domainsToImport) {
					progress.textContent = `${lang.adding} ${domain} (${index}/${domainsToImport.size})`;
					await nextApi.allowlistDomain(domain);
					await Utility.sleep();
					index++;
				}
			} catch (error) {
				progress.textContent = error.message;
				return;
			}

			await refreshStats();
			progress.textContent = lang.done;
			updateLoadingState(false);
		});

		removeHageziTldAllowlistButton.addEventListener("click", async () => {
			if (!Helper.confirmProceed()) return;

			updateLoadingState(true);

			const profileId = Helper.getProfileId();
			const nextApi = new NextApi(profileId);

			try {
				const [currentAllowlist, hageziTldAllowlist] = await Promise.all([
					nextApi.getAllowlist().then((res) => res.data.map(({ id }) => id)),
					Helper.getTldAllowlist(),
				]);
				const domainsToRemove = hageziTldAllowlist.intersection(
					new Set(currentAllowlist),
				);
				let index = 1;

				for (const domain of domainsToRemove) {
					progress.textContent = `${lang.removing} ${domain} (${index}/${domainsToRemove.size})`;
					await nextApi.removeAllowedDomain(domain);
					await Utility.sleep();
					index++;
				}
			} catch (error) {
				progress.textContent = error.message;
				return;
			}

			await refreshStats();
			progress.textContent = lang.done;
			updateLoadingState(false);
		});

		importErrorTrackersButton.addEventListener("click", async () => {
			const listType = Helper.promptListType();

			if (!listType) return;

			if (!Helper.confirmProceed()) return;

			updateLoadingState(true);

			const profileId = Helper.getProfileId();
			const nextApi = new NextApi(profileId);

			try {
				const [currentList, errorTrackerList] = await Promise.all([
					listType === ListType.Allowlist
						? nextApi.getAllowlist().then((res) => res.data.map(({ id }) => id))
						: nextApi.getDenylist().then((res) => res.data.map(({ id }) => id)),
					Helper.getErrorTrackerList(),
				]);
				const domainsToImport = errorTrackerList.difference(
					new Set(currentList),
				);
				const processDomain =
					listType === ListType.Allowlist
						? nextApi.allowlistDomain.bind(nextApi)
						: nextApi.denylistDomain.bind(nextApi);
				let index = 1;

				for (const domain of domainsToImport) {
					progress.textContent = `${lang.adding} ${domain} (${index}/${domainsToImport.size})`;
					await processDomain(domain);
					await Utility.sleep();
					index++;
				}
			} catch (error) {
				progress.textContent = error.message;
				return;
			}

			await refreshStats();
			progress.textContent = lang.done;
			updateLoadingState(false);
		});

		removeErrorTrackersButton.addEventListener("click", async () => {
			const listType = Helper.promptListType();

			if (!listType) return;

			if (!Helper.confirmProceed()) return;

			updateLoadingState(true);

			const profileId = Helper.getProfileId();
			const nextApi = new NextApi(profileId);

			try {
				const [currentList, errorTrackerList] = await Promise.all([
					listType === ListType.Allowlist
						? nextApi.getAllowlist().then((res) => res.data.map(({ id }) => id))
						: nextApi.getDenylist().then((res) => res.data.map(({ id }) => id)),
					Helper.getErrorTrackerList(),
				]);
				const domainsToRemove = errorTrackerList.intersection(
					new Set(currentList),
				);
				const processDomain =
					listType === ListType.Allowlist
						? nextApi.removeAllowedDomain.bind(nextApi)
						: nextApi.removeDeniedDomain.bind(nextApi);
				let index = 1;

				for (const domain of domainsToRemove) {
					progress.textContent = `${lang.removing} ${domain} (${index}/${domainsToRemove.size})`;
					await processDomain(domain);
					await Utility.sleep();
					index++;
				}
			} catch (error) {
				progress.textContent = error.message;
				return;
			}

			await refreshStats();
			progress.textContent = lang.done;
			updateLoadingState(false);
		});

		importCustomListButton.addEventListener("click", async () => {
			const url = Helper.promptUrl();

			if (!url) return;

			const listType = Helper.promptListType();

			if (!listType) return;

			if (!Helper.confirmProceed()) return;

			updateLoadingState(true);

			const profileId = Helper.getProfileId();
			const nextApi = new NextApi(profileId);

			try {
				const [currentList, importingList] = await Promise.all([
					listType === ListType.Allowlist
						? nextApi.getAllowlist().then((res) => res.data.map(({ id }) => id))
						: nextApi.getDenylist().then((res) => res.data.map(({ id }) => id)),
					Helper.getWildcardList(url),
				]);
				const domainsToImport = importingList.difference(new Set(currentList));
				const processDomain =
					listType === ListType.Allowlist
						? nextApi.allowlistDomain.bind(nextApi)
						: nextApi.denylistDomain.bind(nextApi);
				let index = 1;

				for (const domain of domainsToImport) {
					progress.textContent = `${lang.adding} ${domain} (${index}/${domainsToImport.size})`;
					await processDomain(domain);
					await Utility.sleep();
					index++;
				}
			} catch (error) {
				progress.textContent = error.message;
				return;
			}

			await refreshStats();
			progress.textContent = lang.done;
			updateLoadingState(false);
		});

		removeCustomListButton.addEventListener("click", async () => {
			const url = Helper.promptUrl();

			if (!url) return;

			const listType = Helper.promptListType();

			if (!listType) return;

			if (!Helper.confirmProceed()) return;

			updateLoadingState(true);

			const profileId = Helper.getProfileId();
			const nextApi = new NextApi(profileId);

			try {
				const [currentList, removingList] = await Promise.all([
					listType === ListType.Allowlist
						? nextApi.getAllowlist().then((res) => res.data.map(({ id }) => id))
						: nextApi.getDenylist().then((res) => res.data.map(({ id }) => id)),
					Helper.getWildcardList(url),
				]);
				const domainsToImport = removingList.intersection(new Set(currentList));
				const processDomain =
					listType === ListType.Allowlist
						? nextApi.removeAllowedDomain.bind(nextApi)
						: nextApi.removeDeniedDomain.bind(nextApi);
				let index = 1;

				for (const domain of domainsToImport) {
					progress.textContent = `${lang.removing} ${domain} (${index}/${domainsToImport.size})`;
					await processDomain(domain);
					await Utility.sleep();
					index++;
				}
			} catch (error) {
				progress.textContent = error.message;
				return;
			}

			await refreshStats();
			progress.textContent = lang.done;
			updateLoadingState(false);
		});
	};

	addToggleButton();
	attachButtonEvents();

	let isInit = false;
	const init = async () => {
		if (!Helper.profileIdExists()) {
			hidePanel();
			return;
		}
		showPanel();
		addToggleButton();

		if (isInit) return;

		statList.innerHTML = "";
		cardBody.prepend(loader);
		await refreshStats();
		loader.remove();
		isInit = true;
	};

	window.navigation?.addEventListener("navigatesuccess", init);
	init();

	GM_addStyle(`
    .panel-container {
      position: fixed;
      right: 1rem;
      bottom: 1rem;
    }

    .toggle-button-container {
      justify-content: end;
      flex: 1;
    }

    .toggle-button {
      white-space: nowrap;
    }

    .stat-list {
      list-style: initial;
    }

    .panel-progress {
      margin: 0;
    }

    .panel-footer {
      display: flex;
      flex-direction: column;
      row-gap: .5rem;
    }

    .panel-control-container {
      display: flex;
      flex-direction: column;
      row-gap: .5rem;
    }

    .panel-control-container > .btn {
      width: fit-content;
    }

    .panel-footer > .panel-expand-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: auto;
      padding: 0;
    }

    .hidden {
      display: none;
    }

    .loader {
      width: 1.5rem;
      height: 1.5rem;
      border: 2px solid #000;
      border-bottom-color: transparent;
      border-radius: 50%;
      display: inline-block;
      box-sizing: border-box;
      animation: rotation 1s linear infinite;
    }

    @keyframes rotation {
      0% {
        transform: rotate(0deg);
      }

      100% {
        transform: rotate(360deg);
      }
    }
  `);
})(window);

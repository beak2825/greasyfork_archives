// ==UserScript==
// @name         yande.re mobile adaptation
// @namespace    http://tampermonkey.net/
// @version      0.0.7
// @description  Mobile adaptation for yande.re | yande.re 移动端适配
// @author       Exisi
// @license      MIT License
// @supportURL   https://exi.software
// @match        *://yande.re/post
// @match        *://yande.re/post?tags=*
// @match        *://yande.re/post?page=*
// @match        *://yande.re/post/show/*
// @match        *://yande.re/post/similar/*
// @downloadURL https://update.greasyfork.org/scripts/524292/yandere%20mobile%20adaptation.user.js
// @updateURL https://update.greasyfork.org/scripts/524292/yandere%20mobile%20adaptation.meta.js
// ==/UserScript==
(function () {
	"use strict";
	const styles = {
		header: `* { font-size: 100%; } #news-ticker { display: flex; align-items: center; } #news-ticker li { font-size: 35px; word-break: break-all; } #news-ticker .close-link { font-size: 35px; } #header #title { display: flex; justify-content: center; height: 85px !important; } #header #main-menu { font-size: 35px; } #header #main-menu ul { margin: 0; }`,
		post: `.sidebar, .content { width: 100% !important; } #site-title { display:flex !important; } .sidebar h5, #site-title { font-size: 35px; } .tag-completion-box .color-tag-types, .sidebar form #tags, .sidebar #tag-sidebar, .sidebar ul, .sidebar #blacklisted-tag-add { font-size: 34px !important; margin-right: 0 !important; margin-left: 0 !important; } .sidebar form #tags { width: -webkit-fill-available; } #content { margin: 0; margin-bottom: 15px; } #blacklisted-tag-add a.text-button { margin-top: 15px; font-size: 30px; border: 1px solid #ffffff; border-radius: 5px; padding: 5px 15px; box-sizing: border-box; } #post-list-posts { column-count: 2; column-gap: 25px; display: block !important; margin-bottom: 0; } #post-list-posts li { width: 100% !important; break-inside: avoid; } #post-list-posts li .inner, #post-list-posts li .inner a img.preview { width: 100% !important; height: 100% !important; } #paginator { font-size: 28px !important; }`,
		postShow: `.sidebar h5 { font-size: 35px; } #content { margin: 0; } .status-notice, .js-posts-show-edit-tab, .js-posts-show-comments-tab, h4:has(.js-posts-show-edit-tab), .tag-completion-box .color-tag-types, .sidebar form #tags, .sidebar #tag-sidebar, .sidebar ul { font-size: 34px !important; margin-right: 0 !important; margin-left: 0 !important; } .sidebar form #tags { width: -webkit-fill-available; } #comments { max-width: 100% !important; } .sidebar, #right-col, #comments textarea { width: 100% !important; } #comments input[type="submit"] { margin-top: 15px; font-size: 34px; border: 1px solid #ffffff; border-radius: 5px; padding: 10px 20px; box-sizing: border-box; } #comments input[type="submit"]:hover{ background-color: #ffaaae; border-color: #ffaaae; }`,
		postSimilar: `#content { margin: 0; } .sidebar h5 { font-size: 35px; } .sidebar, .content { width: 100% !important; } .sidebar form #tags { width: -webkit-fill-available; } .sidebar select#mode, .tag-completion-box .color-tag-types, .sidebar form #tags, .sidebar #tag-sidebar, .sidebar ul, .sidebar #blacklisted-tag-add { font-size: 34px !important; margin-right: 0 !important; margin-left: 0 !important; } .sidebar select#mode { width: 50% !important; height: 40px; } .sidebar #blacklisted-sidebar h5 a.no-focus-outline { color: #ffffff; } #similar-form table.form { font-size: 30px !important; width: 100%; } #similar-form table.form input#url { width: 100% !important; } #similar-form table.form input[type="submit"], #blacklisted-tag-add a.text-button { margin-top: 15px; font-size: 30px; border: 1px solid #ffffff; border-radius: 5px; padding: 5px 15px; box-sizing: border-box; } #similar-form table.form input[type="submit"]:hover { background-color: #ffaaae; border-color: #ffaaae; } #post-list-posts { margin-bottom: 30px; column-count: 2; column-gap: 25px; display: block !important; } #post-list-posts li { width: 100% !important; break-inside: avoid; } #post-list-posts li .inner, #post-list-posts li .inner a img.preview { width: 100% !important; height: 100% !important; }`,
		footer: `div.footer, form select[name="locale"], form:has(select[name="locale"]) button[type="submit"] { font-size: 34px !important; margin-right: 0 !important; margin-left: 0 !important; } form:has(select[name="locale"]) button[type="submit"] { font-size: 34px; border: 1px solid #ffffff; border-radius: 5px; box-sizing: border-box; } form:has(select[name="locale"]) button[type="submit"]:hover { background-color: #ffaaae; border-color: #ffaaae; } form:has(select[name="locale"]) { display: flex; justify-content: center; gap: 5px; margin: 20px 0; }`,
	};

	const styleElement = document.createElement("style");
	styleElement.innerHTML = `${styles.header} ${styles.footer}`;

	const match = {
		isPost: location.pathname === "/post",
		isPostShow: location.pathname.includes("post/show"),
		isPostSimilar: location.pathname.includes("post/similar"),
	};

	const content = document.querySelector(".content");

	if (match.isPost) {
		styleElement.innerHTML += styles.post;

		const sidebar = document.querySelector(".sidebar");
		content.appendChild(sidebar);
	}

	if (match.isPostShow) {
		styleElement.innerHTML += styles.postShow;

		const quickBtnBar = document.createElement("div");
		Object.assign(quickBtnBar.style, {
			display: "flex",
			flexDirection: "row",
			justifyContent: "center",
			gap: "10px",
			cursor: "default",
		});
		const features = {
			addToFavorites: {
				target: [document.querySelector("#add-to-favs a"), document.querySelector("#remove-from-favs a")],
				icon: [
					`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="currentColor" d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8l0-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5l0 3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20-.1-.1s0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5l0 3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2l0-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/></svg>`,
					`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="currentColor" d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>`,
				],
			},
			viewOrigin: {
				target: [document.querySelector("ul a.original-file-changed.highres-show")],
				icon: [
					`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="currentColor" d="M344 0L488 0c13.3 0 24 10.7 24 24l0 144c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-39-39-87 87c-9.4 9.4-24.6 9.4-33.9 0l-32-32c-9.4-9.4-9.4-24.6 0-33.9l87-87L327 41c-6.9-6.9-8.9-17.2-5.2-26.2S334.3 0 344 0zM168 512L24 512c-13.3 0-24-10.7-24-24L0 344c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2l39 39 87-87c9.4-9.4 24.6-9.4 33.9 0l32 32c9.4 9.4 9.4 24.6 0 33.9l-87 87 39 39c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8z"/></svg>`,
				],
			},
			download: {
				target: [document.querySelector("ul a.original-file-changed")],
				icon: [
					`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="currentColor" d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 242.7-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7 288 32zM64 352c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-101.5 0-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352 64 352zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/></svg>`,
				],
			},
			FindDupes: {
				target: [document.querySelector("ul a#find-dupes")],
				icon: [
					`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="currentColor" d="M64 464l224 0c8.8 0 16-7.2 16-16l0-64 48 0 0 64c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 224c0-35.3 28.7-64 64-64l64 0 0 48-64 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16zM224 304l224 0c8.8 0 16-7.2 16-16l0-224c0-8.8-7.2-16-16-16L224 48c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16zm-64-16l0-224c0-35.3 28.7-64 64-64L448 0c35.3 0 64 28.7 64 64l0 224c0 35.3-28.7 64-64 64l-224 0c-35.3 0-64-28.7-64-64z"/></svg>`,
				],
			},
			findSimilar: {
				target: [document.querySelector("ul a#find-similar")],
				icon: [
					`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="currentColor" d="M288 448L64 448l0-224 64 0 0-64-64 0c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l224 0c35.3 0 64-28.7 64-64l0-64-64 0 0 64zm-64-96l224 0c35.3 0 64-28.7 64-64l0-224c0-35.3-28.7-64-64-64L224 0c-35.3 0-64 28.7-64 64l0 224c0 35.3 28.7 64 64 64z"/></svg>`,
				],
			},
		};

		Object.keys(features).forEach((feature) => {
			const quickBtn = document.createElement("div");
			Object.assign(quickBtn.style, {
				padding: "15px",
				borderRadius: "50%",
				border: "none",
				cursor: "pointer",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			});

			let icon = features[feature].icon[0];
			let target = features[feature].target[0];

			if (feature == "addToFavorites" && features[feature].target[0].parentNode.style.display == "none") {
				icon = features[feature].icon[1];
				target = features[feature].target[1];
			}

			quickBtn.innerHTML = icon;
			const iconElement = quickBtn.querySelector("svg");
			Object.assign(iconElement.style, {
				width: "50px",
				height: "50px",
				color: "#ffaaae",
			});
			quickBtnBar.appendChild(quickBtn);

			const [addToFavorites, removeFavorite] = features[feature].target;
			quickBtn.addEventListener("click", () => {
				if (feature !== "addToFavorites") {
					features[feature].target[0].click();
					return;
				}
				const [dislikeIcon, likeIcon] = features[feature].icon;

				if (addToFavorites.parentNode.style.display == "none") {
					removeFavorite.click();
					quickBtn.innerHTML = dislikeIcon;
					const iconElement = quickBtn.querySelector("svg");
					Object.assign(iconElement.style, {
						width: "50px",
						height: "50px",
						color: "#ffaaae",
					});
					return;
				}

				addToFavorites.click();
				quickBtn.innerHTML = likeIcon;
				const iconElement = quickBtn.querySelector("svg");
				Object.assign(iconElement.style, {
					width: "50px",
					height: "50px",
					color: "#ffaaae",
				});
			});

			if (feature === "addToFavorites") {
				addToFavorites.addEventListener("click", () => quickBtn.click());
				removeFavorite.addEventListener("click", () => quickBtn.click());
			}
		});

		content.appendChild(quickBtnBar);

		const sidebar = document.querySelector(".sidebar");
		content.appendChild(sidebar);
	}

	if (match.isPostSimilar) {
		styleElement.innerHTML += styles.postSimilar;

		const sidebar = document.querySelector(".sidebar");
		content.firstChild.before(sidebar);

		const blockListBox = document.querySelector("#blacklisted-list-box");
		const blockListUl = document.createElement("ul");
		blockListUl.innerHTML = "Show All Posts";
		blockListUl.style.color = "#ffaaae";
		blockListUl.style.marginTop = "5px";
		blockListUl.addEventListener("click", () => {
			const blockList = document.querySelectorAll(".blacklisted-tags a.no-focus-outline");
			blockList.forEach((link) => link.click());
			blockListUl.innerHTML = blockListUl.innerHTML === "Show All Posts" ? "Hide block Posts" : "Show All Posts";
		});
		blockListBox.after(blockListUl);
	}

	document.head.appendChild(styleElement);
})();

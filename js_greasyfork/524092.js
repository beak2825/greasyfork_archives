// ==UserScript==
// @name         yande.re floating button
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  External sidebar button is a floating button.外置侧边栏按钮为悬浮按钮
// @author       rowink
// @license      MIT
// @match        *://yande.re/post/show/*
// @supportURL   https://exi.software
// @downloadURL https://update.greasyfork.org/scripts/524092/yandere%20floating%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/524092/yandere%20floating%20button.meta.js
// ==/UserScript==
(function () {
	"use strict";
	const features = {
		options: {
			edit: {
				tips: "edit",
				target: document.querySelector("ul a.js-posts-show-edit-tab"),
				icon: `<svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" transform="translate(3 3)"><path d="m7 1.5h-4.5c-1.1045695 0-2 .8954305-2 2v9.0003682c0 1.1045695.8954305 2 2 2h10c1.1045695 0 2-.8954305 2-2v-4.5003682"/><path d="m14.5.46667982c.5549155.5734054.5474396 1.48588056-.0167966 2.05011677l-6.9832034 6.98320341-3 1 1-3 6.9874295-7.04563515c.5136195-.5178979 1.3296676-.55351813 1.8848509-.1045243z"/><path d="m12.5 2.5.953 1"/></g></svg>`,
			},
			viewOrigin: {
				tips: "View larger version",
				target: document.querySelector("ul a.original-file-changed.highres-show"),
				icon: `<svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" transform="translate(5 5)"><path d="m10.5 4.5v-3.978l-4-.022"/><path d="m4.5 10.523h-4v-4.023"/></g></svg>`,
			},
			download: {
				tips: "Download larger version",
				target: document.querySelector("ul a.original-file-changed"),
				icon: `<svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" transform="translate(3 3)"><path d="m11.5 8.5-3.978 4-4.022-4"/><path d="m7.522.521v11.979"/><path d="m.5 9v4.5c0 1.1045695.8954305 2 2 2h10c1.1045695 0 2-.8954305 2-2v-4.5"/></g></svg>`,
			},
			addDeleteFlag: {
				tips: "Flag for deletion",
				target: document.querySelector("ul:has(.original-file-changed) a[onclick*='Post']"),
				icon: `<svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" transform="translate(3 2)"><path d="m2.5 2.5h10v12c0 1.1045695-.8954305 2-2 2h-6c-1.1045695 0-2-.8954305-2-2zm5-2c1.0543618 0 1.91816512.81587779 1.99451426 1.85073766l.00548574.14926234h-4c0-1.1045695.8954305-2 2-2z"/><path d="m.5 2.5h14"/><path d="m5.5 5.5v8"/><path d="m9.5 5.5v8"/></g></svg>`,
			},
			addTranslation: {
				tips: "Add translation",
				target: document.querySelector("ul a.js-notes-manager--create"),
				icon: `<svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" transform="translate(2 2)"><path d="m16.5 8.5v-6c0-1.1045695-.8954305-2-2-2h-6c-1.1045695 0-2 .8954305-2 2v6c0 1.1045695.8954305 2 2 2h6c1.1045695 0 2-.8954305 2-2z"/><path d="m4.5 6.50344846h-2.00001427c-1.1045695 0-2 .8954305-2 2v5.99943324c0 1.1045695.8954305 2 2 2h.00345627l6.00001428-.0103718c1.10321833-.0019065 1.99654372-.8967771 1.99654372-1.999997v-1.9925129"/><g transform="translate(2.502 9.5)"><path d="m2.998 1.003h-3"/><path d="m4.49841597 2.5c-.33333333.33333333-.66666667.66666667-1 1s-1.16666667.83333333-2.5 1.5"/><path d="m.99841597 1.00316806c.33333333 1.16613866.83333333 1.99894398 1.5 2.49841597s1.5.99894398 2.5 1.49841597"/></g><g transform="translate(8.5 2.5)"><path d="m3 0-3 6"/><path d="m3 0 3 6"/><path d="m3 2v4" transform="matrix(0 1 -1 0 7 1)"/></g></g></svg>`,
			},
			addToFavorite: {
				tips: "Add to favorites",
				target: document.querySelector("#add-to-favs a"),
				icon: `<svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg"><path d="m7.24264069 2.24264069c.5-2.5 4.34314571-2.65685425 6.00000001-1 1.6034073 1.60340734 1.4999617 4.3343931 0 6l-6.00000001 6.00000001-6-6.00000001c-1.65685425-1.65685425-1.65685425-4.34314575 0-6 1.54996042-1.54996043 5.5-1.5 6 1z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" transform="translate(3.257 4.257)"/></svg>`,
			},
			removeFavorite: {
				tips: "Remove from favorites",
				target: document.querySelector("#remove-from-favs a"),
				icon: `<svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" transform="translate(3.257 3.257)"><path d="m10.6718483 10.813433c-.6501741.6501742-1.80095146 1.8009515-3.42920761 3.4292077l-6-6.00000001c-1.65685425-1.65685425-1.65685425-4.34314575 0-6 .16405182-.16405183.35499091-.3101803.56588065-.4373774m2.45362752-.60559794c1.38818727.03475311 2.70563079.66867016 2.98049183 2.04297534.5-2.5 4.34314571-2.65685425 6.00000001-1 1.6034073 1.60340734 1.4999617 4.3343931 0 6-.4165558.41655583-.7289727.7289727-.9372506.93725061"/><path d="m.743.743 13 13.071"/></g></svg>`,
			},
			setAvatar: {
				tips: "Set avatar",
				target: document.querySelector("#set-avatar a"),
				icon: `<svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linejoin="round" transform="translate(2 2)"><circle cx="8.5" cy="8.5" r="8" stroke-linecap="round"/><path d="m9.5 4.5 2 2v1c0 1.65685425-1.3431458 3-3 3-1.65685425 0-3-1.34314575-3-3v-1z" stroke-linecap="round"/><path d="m3.5 12v-4.5c0-2.76142375 2.23857625-5 5-5 2.7614237 0 5 2.23857625 5 5v4.5"/><path d="m14.5 13.4041808c-.6615287-2.2735218-3.1995581-2.9293071-6-2.9293071-2.72749327 0-5.27073171.77299-6 2.9293071" stroke-linecap="round"/></g></svg>`,
			},
			viewHistory: {
				tips: "Post history",
				target: document.querySelector("ul:has(.original-file-changed) a[href*='/history']"),
				icon: `<svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" transform="matrix(0 1 1 0 0 2)"><path d="m8.54949429 2.5c-2.77910025-.01404818-5.48733216 1.42226095-6.97636172 4.0013358-2.209139 3.826341-.89813776 8.7190642 2.92820323 10.9282032s8.7190642.8981378 10.9282032-2.9282032.8981378-8.71906423-2.9282032-10.92820323" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="m11.5 2.5-3 2.5v-5z" fill="currentColor" fill-rule="nonzero"/><path d="m4.5 10.5h5v3" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></g></svg>`,
			},
		},
		related: {
			FindDupes: {
				tips: "Find dupes",
				target: document.querySelector("ul a#find-dupes"),
				icon: `<svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" transform="translate(3 3)"><path d="m14.5 9.5v-7c0-1.1045695-.8954305-2-2-2h-7c-1.1045695 0-2 .8954305-2 2v7c0 1.1045695.8954305 2 2 2h7c1.1045695 0 2-.8954305 2-2z"/><path d="m11.5 11.5v1c0 1.1045695-.8954305 2-2 2h-7c-1.1045695 0-2-.8954305-2-2v-7c0-1.1045695.8954305-2 2-2h1"/></g></svg>`,
			},
			findSimilar: {
				tips: "Find similar",
				target: document.querySelector("ul a#find-similar"),
				icon: `<svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" transform="translate(2 2)"><path d="m16.5 10.5v-8c0-1.1045695-.8954305-2-2-2h-8c-1.1045695 0-2 .8954305-2 2v8c0 1.1045695.8954305 2 2 2h8c1.1045695 0 2-.8954305 2-2z"/><path d="m4.5 4.50345827h-2c-1.1045695 0-2 .8954305-2 2v7.99654173c0 1.1045695.8954305 2 2 2h.00345528l8.00000002-.0138241c1.1032187-.001906 1.9965447-.8967767 1.9965447-1.9999971v-1.9827205"/><path d="m10.5 3.5v6"/><path d="m10.5 3.5v6" transform="matrix(0 1 -1 0 17 -4)"/></g></svg>`,
			},
		},
		router: {
			previous: {
				tips: "Previous",
				target: document.querySelectorAll("ul:has(a[href*='/post/similar']) a[href*='/post/show']")[0],
				icon: `<svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg"><path d="m.5 4.5 4-4 4 4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" transform="translate(6 8)"/></svg>`,
			},
			next: {
				tips: "Next",
				target: document.querySelectorAll("ul:has(a[href*='/post/similar']) a[href*='/post/show']")[1],
				icon: `<svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg"><path d="m8.5.5-4 4-4-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" transform="translate(6 8)"/></svg>`,
			},
			random: {
				tips: "Random",
				target: document.querySelector("ul a[href*='/post/random']"),
				icon: `<svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" transform="matrix(-1 0 0 1 17.335 3)"><path d="m12.835 5.5v-5h-5"/><path d="m12.835.5-6 6v8"/><path d="m4.835 4.5-4-4"/></g></svg>`,
			},
		},
	};

	const floatBtnContainer = document.createElement("div");
	Object.assign(floatBtnContainer.style, {
		position: "fixed",
		bottom: "15px",
		right: "15px",
		zIndex: "9999",
		display: "flex",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		gap: "10px",
	});

	const floatBtnList = [
		{ group: "options", color: "#ee8887" },
		{ group: "related", color: "#CC0" },
		{ group: "router", color: "#0A0" },
	];

	floatBtnList.forEach((btnInfo) => {
		const floatBtn = document.createElement("button");
		Object.assign(floatBtn.style, {
			width: "25px",
			height: "25px",
			padding: "5px",
			border: "none",
			borderRadius: "50%",
			backgroundColor: btnInfo.color,
			color: "#ee8887",
			cursor: "pointer",
		});
		floatBtn.addEventListener("click", () => {
			const actionGroup = document.querySelector(`.${btnInfo.group}`);
			const style = actionGroup.style.display;
			actionGroup.style.display = style === "none" ? "block" : "none";
		});
		floatBtnContainer.appendChild(floatBtn);

		const actionGroupBar = document.createElement("div");
		actionGroupBar.className = btnInfo.group;
		actionGroupBar.style.display = "none";

		const actionBtnBar = document.createElement("div");
		Object.assign(actionBtnBar.style, {
			display: "flex",
			flexDirection: "column",
			gap: "7px",
			transition: "opacity 0.3s ease-in-out",
		});
		Object.values(features[btnInfo.group]).forEach((targetElement) => {
			const actionBtn = document.createElement("button");
			actionBtn.innerHTML = targetElement.icon;
			actionBtn.className = btnInfo.group;
			Object.assign(actionBtn.style, {
				border: "1px solid #ffffff",
				borderRadius: "50px",
				width: "30px",
				height: "30px",
				padding: "5px",
				cursor: "pointer",
				backgroundColor: "#00000000",
				color: "#ee8887",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			});
			actionBtn.addEventListener("click", () => targetElement.target.click());
			actionBtn.addEventListener("mouseover", () => {
				const rect = actionBtn.getBoundingClientRect();
				const tooltip = document.createElement("div");
				tooltip.className = "tooltip";
				tooltip.innerText = targetElement.tips;
				document.body.appendChild(tooltip);
				Object.assign(tooltip.style, {
					position: "fixed",
					backgroundColor: "#333",
					color: "#fff",
					padding: "5px",
					borderRadius: "5px",
					zIndex: "9999",
					whiteSpace: "nowrap",
					top: `${rect.top}px`,
				});
				tooltip.style.left = `${rect.left - tooltip.offsetWidth - 10}px`;
			});
			actionBtn.addEventListener("mouseout", () => {
				const tooltip = document.querySelector(".tooltip");
				if (tooltip) {
					tooltip.remove();
				}
			});
			actionBtnBar.appendChild(actionBtn);
		});

		actionGroupBar.appendChild(actionBtnBar);
		floatBtnContainer.appendChild(actionGroupBar);
	});

	document.body.appendChild(floatBtnContainer);
})();

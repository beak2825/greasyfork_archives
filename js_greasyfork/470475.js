// ==UserScript==
// @name         Bilibili动态点赞过滤
// @description  个人动态页面中，淡化或者隐藏点赞过的动态
// @namespace    https://github.com/RiverYale/Userscripts/
// @homepage     https://riveryale.github.io/Userscripts/
// @version      0.2
// @author       RiverYale
// @match        *://t.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico?v=1
// @run-at       document-end
// @compatible   chrome
// @compatible   edge
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/470475/Bilibili%E5%8A%A8%E6%80%81%E7%82%B9%E8%B5%9E%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/470475/Bilibili%E5%8A%A8%E6%80%81%E7%82%B9%E8%B5%9E%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

function getAnchor() {
	let items = document.querySelectorAll(".bili-dyn-list__item:not(:has(.like.active))");
	let minDis = 100000;
	let anchor = null;
	for(let item of items) {
		let rect = item.getBoundingClientRect();
		let dis = Math.abs((rect.top + rect.bottom) - window.innerHeight);
		if(dis > minDis) {
			break;
		} else {
			minDis = dis;
			anchor = item;
		}
	}
	if(anchor == null || anchor.getBoundingClientRect().top > window.innerHeight || anchor.getBoundingClientRect().bottom < 0) {
		return null;
	}
	return anchor;
}

setTimeout(() => {
	var filterSidebar = document.createElement("div");
	filterSidebar.classList.add("bili-dyn-sidebar");
	filterSidebar.style.height = "auto";
	filterSidebar.style.bottom = "171px";

	var filterSwitch = document.createElement("div");
	filterSwitch.classList.add("bili-dyn-sidebar__btn");
	filterSwitch.innerHTML = "<span>过滤</span>";
	filterSwitch.setAttribute("status", 0);

	filterSidebar.appendChild(filterSwitch);
	document.querySelector(".bili-dyn-home--member").appendChild(filterSidebar);

	filterSwitch.addEventListener("click", () => {
		let status = Number(filterSwitch.getAttribute("status"));
		let filterCss;

		let anchor = getAnchor();
		let clientOffsetTop = anchor ? anchor.getBoundingClientRect().top : 0;
		let headerHeight = document.querySelector(".bili-header__bar.mini-header").scrollHeight + 8;
		let anchorY = 0;

		switch(status) {
			case 0:
				filterCss = document.createElement('style');
				filterCss.id = "filter-css"
				filterCss.innerText = `.bili-dyn-list__item:has(.like.active) { filter: opacity(0.3); }`;
				document.body.appendChild(filterCss);
				
				filterSwitch.style.backgroundColor = "rgb(172 223 241)";
				filterSwitch.innerText = "淡化";
				filterSwitch.setAttribute("status", 1);
				break;
			case 1:
				filterCss = document.querySelector("#filter-css");
				filterCss.innerText = `.bili-dyn-list__item:has(.like.active) { display: none; }`;

				anchorY = anchor ? anchor.offsetTop - clientOffsetTop + headerHeight : 0;
				document.querySelector("html").scrollTo(0, anchorY);

				filterSwitch.innerText = "隐藏";
				filterSwitch.setAttribute("status", 2);
				break;
			case 2:
				filterCss = document.querySelector("#filter-css");
				filterCss.remove();

				anchorY = anchor ? anchor.offsetTop - clientOffsetTop + headerHeight : 0;
				document.querySelector("html").scrollTo(0, anchorY);

				filterSwitch.style.backgroundColor = "";
				filterSwitch.innerText = "过滤";
				filterSwitch.setAttribute("status", 0);
				break;
		}
	})
}, 1000);
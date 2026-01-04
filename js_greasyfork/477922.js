// ==UserScript==
// @name         PersonPageStats
// @namespace    https://jirehlov.com
// @version      0.1.1
// @description  show avg ratings and rankings on a person's page on bangumi
// @author       Jirehlov
// @include      /^https?:\/\/(bgm\.tv|bangumi\.tv|chii\.in)\/person\/\d+(?!\/works\/voice)\/works/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477922/PersonPageStats.user.js
// @updateURL https://update.greasyfork.org/scripts/477922/PersonPageStats.meta.js
// ==/UserScript==
 
(function () {
	"use strict";
	let totalSum = 0;
	let totalCount = 0;
	let totalRank = 0;
	let rankCount = 0;
	function calculateAverage() {
		const browserFullElements = document.querySelectorAll(".browserFull");
		totalSum = 0;
		totalCount = 0;
		totalRank = 0;
		rankCount = 0;
		browserFullElements.forEach(browserFullElement => {
			const liElements = browserFullElement.querySelectorAll("li");
			liElements.forEach(liElement => {
				const rateInfoElement = liElement.querySelector(".rateInfo");
				if (rateInfoElement) {
					const fadeElement = rateInfoElement.querySelector(".fade");
					if (fadeElement) {
						const value = parseFloat(fadeElement.textContent);
						if (!isNaN(value)) {
							totalSum += value;
							totalCount++;
						}
					}
				}
			});
		});
		const rankElements = document.querySelectorAll(".rank");
		rankElements.forEach(rankElement => {
			const smallElement = rankElement.querySelector("small");
			if (smallElement) {
				const rankText = rankElement.textContent.replace("Rank ", "").trim();
				const rankValue = parseInt(rankText);
				if (!isNaN(rankValue)) {
					totalRank += rankValue;
					rankCount++;
				}
			}
		});
		return {
			avgRating: totalCount === 0 ? 0 : totalSum / totalCount,
			avgRank: rankCount === 0 ? 0 : totalRank / rankCount
		};
	}
	function updateDisplay() {
		const {avgRating, avgRank} = calculateAverage();
		const averageLi = document.querySelector("#averageValue");
		const rankAverageLi = document.querySelector("#rankAverage");
		const totalCountSpan = document.querySelector("#totalCount");
		const rankCountSpan = document.querySelector("#rankCount");
		if (averageLi)
			averageLi.textContent = avgRating.toFixed(4);
		if (rankAverageLi)
			rankAverageLi.textContent = avgRank.toFixed(4);
		if (totalCountSpan)
			totalCountSpan.textContent = totalCount;
		if (rankCountSpan)
			rankCountSpan.textContent = rankCount;
	}
	function createFilterButtons() {
		const subjectFilterElement = document.querySelector(".subjectFilter");
		if (subjectFilterElement) {
			const groupedUL = document.createElement("ul");
			groupedUL.className = "grouped clearit";
			const titleLi = document.createElement("li");
			titleLi.classList.add("title");
			titleLi.innerHTML = "<span>当前页面统计信息</span>";
			const averageLi = document.createElement("li");
			averageLi.innerHTML = `<span>评分平均值: <span id="averageValue">${ calculateAverage().avgRating.toFixed(4) }</span></span>`;
			const totalCountLi = document.createElement("li");
			totalCountLi.innerHTML = `<span>评分条目数: <span id="totalCount">${ totalCount }</span></span>`;
			const rankAverageLi = document.createElement("li");
			rankAverageLi.innerHTML = `<span>排名平均值: <span id="rankAverage">${ calculateAverage().avgRank.toFixed(4) }</span></span>`;
			const rankCountLi = document.createElement("li");
			rankCountLi.innerHTML = `<span>排名条目数: <span id="rankCount">${ rankCount }</span></span>`;
			groupedUL.appendChild(titleLi);
			groupedUL.appendChild(averageLi);
			groupedUL.appendChild(totalCountLi);
			groupedUL.appendChild(rankAverageLi);
			groupedUL.appendChild(rankCountLi);
			subjectFilterElement.appendChild(groupedUL);
		}
	}
	createFilterButtons();
	updateDisplay();
	const observer = new MutationObserver(() => {
		observer.disconnect();
		updateDisplay();
		observer.observe(document.body, {
			subtree: true,
			childList: true,
			attributes: true,
			attributeFilter: ["class"]
		});
	});
	observer.observe(document.body, {
		subtree: true,
		childList: true,
		attributes: true,
		attributeFilter: ["class"]
	});
}());
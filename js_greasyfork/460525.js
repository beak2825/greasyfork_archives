// ==UserScript==
// @name         ptcg_tw_deck_optimization
// @namespace    http://tampermonkey.net/
// @version      1.45
// @description  ptcg deck
// @author       gxcts
// @match        https://asia.pokemon-card.com/tw/deck-build/*
// @icon         https://cdn-icons-png.flaticon.com/512/1169/1169608.png
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/sortablejs@1.14.0/Sortable.min.js
// @connect      greasyfork.org
// @downloadURL https://update.greasyfork.org/scripts/460525/ptcg_tw_deck_optimization.user.js
// @updateURL https://update.greasyfork.org/scripts/460525/ptcg_tw_deck_optimization.meta.js
// ==/UserScript==
(function() {
	'use strict';
	//檢查腳本更新
	const scriptName = GM_info.script.name;
	const scriptVersion = GM_info.script.version;
	const scriptURL = 'https://greasyfork.org/scripts/460525-ptcg-tw-deck-optimization/code/ptcg_tw_deck_optimization.user.js';
	GM_xmlhttpRequest({
		method: 'GET',
		url: scriptURL,
		onload: function(response) {
			const pageHTML = response.responseText;
			const updatedVersion = pageHTML.match(/@version\s+([^\s]+)/i)[1];
			if (updatedVersion !== scriptVersion) {
				const message = `已有新版本腳本 (${updatedVersion}) 是否要更新?`;
				if (confirm(message)) {
					window.open(scriptURL, '_self');
				}
			}
		}
	});
	// Get the relevant elements 使用者拖曳功能
	var searchResultZone = document.getElementById('searchResultZone');
	var decklistZoneCardContainer = document.getElementById('decklistZoneCardContainer');
	// Add event listeners to the searchResultZone for drag and drop functionality
	searchResultZone.addEventListener('dragstart', function(e) {
		e.dataTransfer.setData('text/plain', e.target.id);
	});
	// Add event listeners to the decklistZoneCardContainer for drag and drop functionality
	decklistZoneCardContainer.addEventListener('dragover', function(e) {
		e.preventDefault();
	});
	decklistZoneCardContainer.addEventListener('drop', function(e) {
		e.preventDefault();
		var data = e.dataTransfer.getData('text');
		var draggedElement = document.getElementById(data);
		var clonedElement = draggedElement.cloneNode(true);
		clonedElement.id = 'clone-' + data;
		decklistZoneCardContainer.appendChild(clonedElement);
	});
	// Add event listeners for sorting functionality
	Sortable.create(decklistZoneCardContainer, {
		animation: 150
	});
	// 創建排序按鈕，並且添加到網頁右上角
	const sortButton = document.createElement("button");
	sortButton.innerText = "排序卡牌";
	sortButton.style = "position:fixed; top:10px; right:10px; z-index:1000;";
	document.body.appendChild(sortButton);

	function sortCards() {
		// 獲取牌組中所有卡牌元素
		const cardElems = document.querySelectorAll("#decklistZoneCardContainer .card");
		// 將卡牌轉換成陣列
		const cardArr = Array.from(cardElems);
		// 使用 map 排序，先按照是否包含【能量】字串排序，再按照 ID 由小到大排序
		cardArr.sort((a, b) => {
			const aIsEnergy = a.dataset.cardName.includes("能量");
			const bIsEnergy = b.dataset.cardName.includes("能量");
			if (aIsEnergy && !bIsEnergy) {
				return 1; // a放後面
			} else if (!aIsEnergy && bIsEnergy) {
				return -1; // a放前面
			} else {
				return a.id - b.id; // 都不是能量的話按 id 排序
			}
		});
		// 將排好序的卡牌插入到 DOM 中
		const parentElem = cardElems[0].parentNode;
		cardArr.forEach((cardElem) => {
			parentElem.appendChild(cardElem);
		});
	}
	// 綁定排序按鈕點擊事件
	sortButton.addEventListener("click", () => {
		sortCards();
	});
	//搜尋bar 按下 enter 時會自動搜尋
	/*
	document.addEventListener("keydown", function(event) {
	    if (event.key === "Enter") {
	        document.getElementById("freeword").blur();
	        document.getElementById("searchCardButton").click();
	    }
	});
	*/
	//搜尋 bar 有字元就會自動搜尋
	const searchInput = document.getElementById("freeword");
	const searchButton = document.getElementById("searchCardButton");
	searchInput.addEventListener("input", function(event) {
		searchButton.click();
	});
	//下方為圖片放大功能
	// 找到圖片元素
	const modalImage = document.getElementById('modalImage');
	// 新增點擊事件監聽器
	modalImage.addEventListener('click', () => {
		// 建立新的圖片元素
		const enlargedImage = document.createElement('img');
		enlargedImage.src = modalImage.src;
		enlargedImage.style.position = 'fixed';
		enlargedImage.style.top = '50%';
		enlargedImage.style.left = '50%';
		enlargedImage.style.transform = 'translate(-50%, -50%)';
		enlargedImage.style.maxWidth = '90%';
		enlargedImage.style.maxHeight = '90%';
		enlargedImage.style.zIndex = 9999;
		enlargedImage.style.backgroundColor = 'rgba(0,0,0,0.5)';
		// 加入到頁面中
		document.body.appendChild(enlargedImage);
		// 新增點擊事件監聽器，點擊時移除圖片元素
		document.addEventListener('click', function removeEnlargedImage() {
			enlargedImage.remove();
			document.removeEventListener('click', removeEnlargedImage);
		});
	});
})();
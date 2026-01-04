// ==UserScript==
// @name         Booth使用金額計算機
// @namespace    https://x.com/zerukuVRC
// @version      1.0
// @description  Boothの購入履歴の画面の総額を計算できます。同じセッションだけしか計算結果は保存できません。
// @author       zeruku
// @match        https://accounts.booth.pm/orders*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479170/Booth%E4%BD%BF%E7%94%A8%E9%87%91%E9%A1%8D%E8%A8%88%E7%AE%97%E6%A9%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/479170/Booth%E4%BD%BF%E7%94%A8%E9%87%91%E9%A1%8D%E8%A8%88%E7%AE%97%E6%A9%9F.meta.js
// ==/UserScript==

(function() {

	var currentURL = window.location.href;

	if (currentURL.indexOf('total=') === -1) {
		if (currentURL.indexOf('?') === -1) {
			currentURL += '?total=0';
		} else {
			currentURL += '&total=0';
		}

        window.history.pushState(null, null, currentURL);
	}


	var item_list = [];
	var progressText = document.createElement("div");
	progressText.style.position = "fixed";
	progressText.style.bottom = "40px";
	progressText.style.left = "10px";
	progressText.style.color = "#fc4d50";
	progressText.style.zIndex = "1000";

	function collectItemInfo(item_element) {
		var url = item_element.firstChild.href;
		var item_id = url.match(/\d+$/g);
		var item_variation = (item_element.parentElement.children[1].children[1].innerText
			.match(/\(.*\)$/g) || [null])[0];
		if (item_variation) {
			item_variation = item_variation.replace(/^\(/, "").replace(/\)$/, "");
		}
		return {
			item_id: item_id[0],
			item_variation: item_variation
		};
	}

	function fetchItemPrice(item_id, item_variation_name) {
		return new Promise((resolve, reject) => {
			var xhr = new XMLHttpRequest();
			xhr.open('GET', "https://booth.pm/ja/items/" + item_id + ".json", true);
			xhr.setRequestHeader('Accept', 'application/json');
			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						var response = JSON.parse(xhr.responseText);
						var variations = response.variations;
						var item_price = variations.find(variation => variation.name ===
							item_variation_name);
						if (item_price) {
							resolve({
								item_name: response.name,
								item_price: item_price.price
							});
						} else {
							resolve({
								item_name: response.name,
								item_price: variations[0].price
							});
						}
					} else if (xhr.status === 404) {
						resolve("商品が削除されたか、非公開にされています");
					} else {
						reject("リクエストエラー: ステータスコード " + xhr.status);
					}
				}
			};
			xhr.send();
		});
	}


	async function main() {

		var button = document.querySelector(".booth-total-price-button");
		button.disabled = true;
		button.style.cursor = "not-allowed";

		var item_list_elements = Array.from(document.querySelectorAll(
			'[class="l-col-auto"]'));
		item_list = item_list_elements.map(collectItemInfo);
		var price_list = [];
		var totalItems = item_list.length;
		var completedItems = 0;

		progressText.textContent = `計算中... : ${completedItems}/${totalItems}`;
		document.body.appendChild(progressText);

		for (let i = 0; i < item_list.length; i++) {
			var item_info = item_list[i];
			var item_id = item_info.item_id;
			var item_variation_name = item_info.item_variation;
			try {
				var item_price = await fetchItemPrice(item_id, item_variation_name);
				console.log(`商品名: ${item_price.item_name}, 価格: ${item_price.item_price}円`);
				price_list.push(item_price.item_price);
			} catch (error) {
				console.error(error);
			}
			completedItems++;

			progressText.textContent = `進行中: ${completedItems}/${totalItems}`;
			await new Promise(resolve => setTimeout(resolve, 1000));
		}
		price_list = price_list.filter(element => !(element == undefined));
		var total_price = price_list.reduce(function(a, b) {
			return a + b;
		});

		var url = new URL(window.location.href);
		var existingTotal = parseFloat(url.searchParams.get('total')) || 0;

		var newTotal = existingTotal + total_price;

		url.searchParams.set('total', newTotal);

		alert(
			`このページの合計金額: ${total_price}円\n累計金額: ${newTotal}円`);

    window.location.href = url.href;

		progressText.textContent = "";
		button.disabled = true;
    button.textContent = "計算済み"
	}

	function addButton() {
		const button = document.createElement("button");
		button.innerText = "金額計算";
		button.classList.add("booth-total-price-button");
		button.style.background = "#fc4d50";
		button.style.color = '#ffffff';
		button.style.borderRadius = '20px';
		button.style.padding = '10px 15px';
		button.style.border = 'none';
		button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
		button.style.cursor = 'pointer';
		button.style.position = 'fixed';
		button.style.bottom = '10px';
		button.style.left = '10px';
		button.style.zIndex = '1000';
		button.addEventListener('mouseover', () => {
			button.style.background = '#ff6669';
		});
		button.addEventListener('mouseout', () => {
			button.style.background = '#fc4d50';
		});
		button.onclick = main;
		document.body.appendChild(button);
	}
	addButton();

	function resetTotal() {
		var url = new URL(window.location.href);
		url.searchParams.set('total', 0);

    if (!confirm("累計金額をリセットしますか？")) {return}

		window.location.href = url.href;
	}

	function addResetButton() {
		const resetButton = document.createElement("button");
		resetButton.innerText = "累計金額をリセット";
		resetButton.classList.add("booth-reset-button");
		resetButton.style.background = "#0077B5";
		resetButton.style.color = '#ffffff';
		resetButton.style.borderRadius = '20px';
		resetButton.style.padding = '10px 15px';
		resetButton.style.border = 'none';
		resetButton.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
		resetButton.style.cursor = 'pointer';
		resetButton.style.position = 'fixed';
		resetButton.style.bottom = '10px';
		resetButton.style.left = '120px';
		resetButton.style.zIndex = '1000';
		resetButton.addEventListener('mouseover', () => {
			resetButton.style.background = '#005588';
		});
		resetButton.addEventListener('mouseout', () => {
			resetButton.style.background = '#0077B5';
		});
		resetButton.onclick = resetTotal;
		document.body.appendChild(resetButton);
	}
	addResetButton()
})();

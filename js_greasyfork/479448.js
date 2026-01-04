// ==UserScript==
// @name         Boothの購入履歴から累計散財額を計算するツール
// @namespace    https://x.com/zerukuVRC
// @version      2.1
// @description  お手軽鬱ボタン。Boothの購入履歴の総額を計算できます。同じセッションだけしか計算結果は保存できません。
// @author       zeruku
// @match        https://accounts.booth.pm/orders*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/479448/Booth%E3%81%AE%E8%B3%BC%E5%85%A5%E5%B1%A5%E6%AD%B4%E3%81%8B%E3%82%89%E7%B4%AF%E8%A8%88%E6%95%A3%E8%B2%A1%E9%A1%8D%E3%82%92%E8%A8%88%E7%AE%97%E3%81%99%E3%82%8B%E3%83%84%E3%83%BC%E3%83%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/479448/Booth%E3%81%AE%E8%B3%BC%E5%85%A5%E5%B1%A5%E6%AD%B4%E3%81%8B%E3%82%89%E7%B4%AF%E8%A8%88%E6%95%A3%E8%B2%A1%E9%A1%8D%E3%82%92%E8%A8%88%E7%AE%97%E3%81%99%E3%82%8B%E3%83%84%E3%83%BC%E3%83%AB.meta.js
// ==/UserScript==


//  コードがながーい！
//     ٩(๑`^´๑)۶


(function() {

    ///                                       ///
	/// *===== URLパラメーターの初期設定 =====* ///
    ///                                       ///

	var currentURL = new URL(window.location.href);
	var autoCalculate = currentURL.searchParams.get('auto') === '1';

	var changed = false;

	if (currentURL.searchParams.get('total') === null) {
		currentURL.searchParams.set('total', 0);
		changed = true;
	}
	if (currentURL.searchParams.get('auto') === null) {
		currentURL.searchParams.set('auto', autoCalculate ? '1' : '0');
		changed = true;
	}
	if (currentURL.searchParams.get('page') === null) {
		currentURL.searchParams.set('page', currentURL.searchParams.get('page') ?
			currentURL.searchParams.get('page') : '1')
		changed = true;
	}
	if (changed) {
		window.location.href = currentURL.href;
	}


    ///                                      ///
	/// *===== プログレス表示部分の定義 =====* ///
    ///                                      ///

	var progressText = document.createElement("div");
	progressText.style.position = "fixed";
	progressText.style.bottom = "100px";
	progressText.style.left = "10px";
	progressText.style.color = "#fc4d50";
    // ʕ´•ﻌ•`ʔ.｡o(これいるの？)
	progressText.style.zIndex = "1000";


    ///                               ///
    /// *===== 除外ボタンの表示 =====* ///
    ///                              ///
    var item_elements = document.getElementsByClassName("l-row u-mb-0");
    console.log(GM_getValue("exclude_item_ids"));

    var unifiedState = true;

    function updateExclusionList(itemId, isAdding) {
        var currentValue = GM_getValue("exclude_item_ids");

        if (isAdding) {
            GM_setValue("exclude_item_ids", currentValue + ` ${itemId}`);
            console.log(`GM_setValue: exclude_item_ids = ${GM_getValue("exclude_item_ids")}`);
        } else {
            GM_setValue("exclude_item_ids", currentValue.replace(` ${itemId}`, ""));
            console.log(`GM_setValue: exclude_item_ids = ${GM_getValue("exclude_item_ids")}`);
        }
    }

    for (let i = 0; i < item_elements.length; i++) {
        var currentItem = item_elements[i];
        var newExcludeButton = document.createElement("button");

        newExcludeButton.id = `excludeButton${i}`;
        newExcludeButton.style = `
            margin-right: 10px;
            color: #ffffff;
            border: none;
            font-size: 12px;
            padding: 8px 8px;
            background: ${String(GM_getValue("exclude_item_ids")).indexOf(currentItem.firstChild.firstChild.href.match(/\d+$/g)[0]) === -1 ? '#808080' : '#e1362e'};
        `;

        newExcludeButton.textContent = String(GM_getValue("exclude_item_ids")).indexOf(currentItem.firstChild.firstChild.href.match(/\d+$/g)[0]) === -1 ? "除外" : "解除";
        newExcludeButton.className = String(GM_getValue("exclude_item_ids")).indexOf(currentItem.firstChild.firstChild.href.match(/\d+$/g)[0]) === -1 ? "ex_false" : "ex_true";

        newExcludeButton.addEventListener("click", function (event) {
            var clickedButton = document.querySelector(`#excludeButton${i}`);

            if (event.ctrlKey) {
                unifiedState = !unifiedState;

                for (let j = 0; j < item_elements.length; j++) {
                    var otherButton = document.querySelector(`#excludeButton${j}`);
                    otherButton.style.background = unifiedState ? "#e1362e" : "#808080";
                    otherButton.textContent = unifiedState ? "解除" : "除外";
                    otherButton.className = unifiedState ? "ex_true" : "ex_false";

                    updateExclusionList(otherButton.parentElement.firstChild.href.match(/\d+$/g)[0], unifiedState);
                }
            } else {
                if (clickedButton.className == "ex_true") {
                    clickedButton.style.background = "#808080";
                    clickedButton.textContent = "除外";
                    updateExclusionList(clickedButton.parentElement.firstChild.href.match(/\d+$/g)[0], false);
                    clickedButton.className = "ex_false";
                } else {
                    clickedButton.style.background = "#e1362e";
                    clickedButton.textContent = "解除";
                    updateExclusionList(clickedButton.parentElement.firstChild.href.match(/\d+$/g)[0], true);
                    clickedButton.className = "ex_true";
                }
            }
        });

        currentItem.firstChild.appendChild(newExcludeButton);
    }

    ///                                               ///
    /// *===== 除外設定の全リセットショートカット =====* ///
    ///                                               ///
    var keysPressed = {};

    document.addEventListener('keydown', function (event) {

        keysPressed[event.key] = true;

        if (keysPressed['Shift'] && keysPressed['E'] && keysPressed['L']) {
            keysPressed["Shift"] = false;
            keysPressed["E"] = false;
            keysPressed["L"] = false;
            if (confirm("除外設定を全てリセットしますか？")) {
                GM_setValue('exclude_item_ids', '');
                window.location.href = window.location.href;
            }
        }
    });

    document.addEventListener('keyup', function (event) {
        keysPressed[event.key] = false;
    });

    ///                                                  ///
    /// *=====    商品のID、バリエーションを取得    =====* ///
    ///                                                 ///
    /// Tips: バリエーションを取得して                    ///
    ///       後の関数で購入したバリエーションを確定させて  ///
    ///       値段を決定する                             ///
    ///                                                 ///
	function collectItemInfo(item_element) {
		var url = item_element.firstChild.href;
		var item_id = url.match(/\d+$/g);


        // 除外設定
        if (String(GM_getValue("exclude_item_ids")).indexOf(item_id) !== -1)
        {
            return "exclude";
        }

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


    ///                               ///
    /// *===== 商品の価格を取得 =====* ///
    ///                              ///
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
						var item_price = variations.find(variation => variation.name === // 上のTipsで書いた部分
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


    ///                                                          ///
    /// *===== 自動化の際、次のページにリダイレクトさせる関数 =====* ///
    ///                                                          ///
	function processPageParamAndRedirect(url) {
		var parsedURL = new URL(url);
		var pageParam = parsedURL.searchParams.get('page');
		var currentPage = parseInt(pageParam, 10);
		var nextPage = currentPage + 1;
		parsedURL.searchParams.set('page', nextPage.toString());
		window.location.href = parsedURL.href;
	}

    ///                                                  ///
    /// *===== 自動化の際、終了したら1ページ目に転送 =====* ///
    ///                                                  ///
	function pageReset() {
		var parsedURL = new URL(window.location.href);
		parsedURL.searchParams.set('page', '1');
		parsedURL.searchParams.set('auto', '0');
		window.location.href = parsedURL.href;
	}

    ///                         ///
    /// *===== メイン関数 =====* ///
    ///                         ///
	var item_list = [];

	async function main() {
        // 計算を開始したら、ボタンを無効化する
		var button = document.querySelector(".booth-total-price-button");
		button.disabled = true;
		button.style.cursor = "wait";

        // 購入履歴ページの購入したアイテムを取得
		var item_list_elements = Array.from(document.querySelectorAll(
			'[class="l-col-auto"]'));
		item_list = item_list_elements.map(collectItemInfo);

        // 除外設定
        if (item_list.every(v => v == "exclude") && item_list.length !== 0) {
            processPageParamAndRedirect(window.location.href);
        } else if (item_list.length === 0) {
			alert("計算が終了しました");
			pageReset();
		}
        item_list = item_list.filter(element => !(element == "exclude"))

        // 変数定義
		var price_list = [];
		var totalItems = item_list.length;
		var completedItems = 0;

        // プログレス表示
		progressText.textContent = `計算中... : ${completedItems}/${totalItems}`;
		document.body.appendChild(progressText);

		for (let i = 0; i < item_list.length; i++) {
            // 変数定義
			var item_info = item_list[i];
			var item_id = item_info.item_id;
			var item_variation_name = item_info.item_variation;
			try {
                // アイテムの価格を取得
				var item_price = await fetchItemPrice(item_id, item_variation_name);
				price_list.push(item_price.item_price);
			} catch (error) {
				console.error(error);
			}
			completedItems++;

            // プログレス表示
			progressText.textContent = `進行中: ${completedItems}/${totalItems}`;

			///                   **--- 重要！ --- **                      ///
			///  この遅延は、Boothのサーバーに負荷をかけないために存在します   ///
			///   意図的に時間を変えたり、削除して処理速度を早めるのは禁止です ///
			await new Promise(resolve => setTimeout(resolve, 900));

		}
        // 価格の合計を計算
		price_list = price_list.filter(element => !(element == undefined)); // 価格情報がなければ除外
        price_list = price_list.filter(element => !(element >> 150000)); // 価格が15万円以上なら除外
		var total_price = price_list.reduce(function(a, b) {
			return a + b;
		});

        // totalパラメーターに合計金額を追加
		var url = new URL(window.location.href);
		var existingTotal = parseFloat(url.searchParams.get('total')) || 0;

		var newTotal = existingTotal + total_price;

		url.searchParams.set('total', newTotal);


		if (!autoCalculate)
        // 自動化が無効の場合
        {
            // アラートを表示
			alert(`このページの合計金額: ${total_price}円\n今までの合計金額: ${newTotal}円`)
			window.location.href = url.href;

            // 一応二度押せないようにする
			progressText.textContent = "";
			button.disabled = true;
			button.textContent = "計算済み"
		}
        else
        // 自動化が有効の場合
        {
            // 次のページにそのまま転送、アラートを表示しない
			processPageParamAndRedirect(url)
		}
	}


    // 合計金額をtotalパラメーターから取得
    // TODO: まだ最適化の余地あり？面倒くさいかも ꜀( ꜆ᐢ. ̫.ᐢ)꜆ ﾊﾟﾀ
	var total_price = new URL(window.location.href).searchParams.get("total");

    ///                                  ///
    /// *===== 金額計算ボタンの表示 =====* ///
    ///                                  ///
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

    ///                                  ///
    /// *===== 数値リセットの関数   =====* ///
    /// *===== リセットボタンの表示 =====* ///
    ///                                  ///
	function resetTotal() {
		var url = new URL(window.location.href);
		url.searchParams.set('total', 0);
		url.searchParams.set('auto', 0)

		if (!confirm("累計金額をリセットしますか？")) {
			return;
		}

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
		resetButton.style.left = '280px';
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
	addResetButton();

    function openTweetTab(total_price) {
        const tweetText =
        `私がBoothで使用した合計金額は、『${Number(total_price).toLocaleString()}円』でした！\n\n#私がBoothに使った金額`;
        // ( ´~`).｡ (いずれx.comにしないといけないのかな...?)
        const tweetURL = "https://twitter.com/intent/tweet?text=" +
            encodeURIComponent(tweetText);
        window.open(tweetURL, "_blank");
    }

    ///                                  ///
    /// *===== ツイートボタンの表示 =====* ///
    ///                                  ///
	function addTweetButton(total_price) {
		const tweetButton = document.createElement("button");
		tweetButton.innerText = "Twitterに共有";
		tweetButton.style.background = "#1DA1F2";
		tweetButton.style.color = "#fff";
		tweetButton.style.borderRadius = "20px";
		tweetButton.style.padding = "10px 15px";
		tweetButton.style.border = "none";
		tweetButton.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
		tweetButton.style.cursor = "pointer";
		tweetButton.style.position = "fixed";
		tweetButton.style.bottom = "60px";
		tweetButton.style.left = "280px";
		tweetButton.style.zIndex = "1000";
		tweetButton.addEventListener("mouseover", () => {
			tweetButton.style.background = "#1A91DA";
		});
		tweetButton.addEventListener("mouseout", () => {
			tweetButton.style.background = "#1DA1F2";
		});
		tweetButton.onclick = function() {
			const tweetText =
				`私がBoothで使用した合計金額は、『${Number(total_price).toLocaleString()}円』でした！\n\n#私がBoothに使った金額`;
            // ( ´~`).｡ (いずれx.comにしないといけないのかな...?)
			const tweetURL = "https://twitter.com/intent/tweet?text=" +
				encodeURIComponent(tweetText);
			window.open(tweetURL, "_blank");
		};
		document.body.appendChild(tweetButton);
	}
	addTweetButton(total_price);


    ///                            ///
    /// *===== 自動化の開始 =====*  ///
    ///   ただのパラメーター変更！   ///
    ///                            ///
	function startAuto() {
		var url = new URL(window.location.href);
		url.searchParams.set('auto', 1);
		window.location.href = url.href;
	}

    ///                            ///
    /// *===== 自動化の停止 =====*  ///
    ///   ただのパラメーター変更！   ///
    ///                            ///
	function stopAuto() {
		var url = new URL(window.location.href);
		url.searchParams.set('auto', 0);
		window.location.href = url.href;
	};

    ///                                 ///
    /// *===== 自動化ボタンの表示 =====* ///
    ///                                ///
	function addAutoButton() {
		const autoButton = document.createElement("button");
		autoButton.innerText = "自動計算開始！";
		autoButton.style.background = "#1b7f8c";
		autoButton.style.color = "#fff";
		autoButton.style.borderRadius = "20px";
		autoButton.style.padding = "10px 15px";
		autoButton.style.border = "none";
		autoButton.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
		autoButton.style.cursor = "pointer";
		autoButton.style.position = "fixed";
		autoButton.style.bottom = "10px";
		autoButton.style.left = "120px";
		autoButton.style.zIndex = "1000";
		if (autoCalculate) {
			autoButton.addEventListener("mouseover", () => {
				autoButton.style.background = "#c00b3c";
			});
			autoButton.addEventListener("mouseout", () => {
				autoButton.style.background = "#f30f4c";
			});
			autoButton.innerText = "自動計算を停止";
			autoButton.style.background = "#f30f4c";
			autoButton.onclick = stopAuto;
		} else {
			autoButton.addEventListener("mouseover", () => {
				autoButton.style.background = "#22a1b2";
			});
			autoButton.addEventListener("mouseout", () => {
				autoButton.style.background = "#1b7f8c";
			});
			autoButton.onclick = startAuto;
		}
		document.body.appendChild(autoButton);
	}
	addAutoButton();


    ///                             ///
    /// *===== 参考資料の表示 =====* ///
    ///                             ///
    function typicalPrice(total_price) {
        total_price = Number(total_price);
        if (total_price >= 114381200000000) { return "日本の国家予算をまかなえていました！";}
        if (total_price >= 23760000000000) { return "イーロン・マスクよりお金持ちでした！";}
        if (total_price >= 9000000000000) { return "映画「シン・ゴジラ」の被害額を一人で賠償できました！";}
        if (total_price >= 1652283360000) { return "Google社の時価総額を超えていました！";}
        if (total_price >= 1510160000000) { return "Discordを買収できていたかもしれません！";}
        if (total_price >= 639000000000) { return "映画「名探偵コナン 紺青の拳」の被害額を一人で賠償できました！";}
        if (total_price >= 395000000000) { return "イージス艦を一隻買えました！";}
        if (total_price >= 90804000000) { return "マインクラフトの金ブロック1個が買えました！";}
        if (total_price >= 1250000000) { return "VRChatの推定時価総額を超えていました！";}
        if (total_price >= 1208280000) { return "GTA5のバイク「オプレッサー MkⅡ」を1台買えました！";}
        if (total_price >= 332277000) { return "GTA5の潜水艦「コサトカ」を1艇買えました！";}
        if (total_price >= 143600000) { return "首都圏の新築マンション1戸が買えました！";}
        if (total_price >= 53200000) { return "USJの夜間貸し切りが出来ました！";}
        if (total_price >= 8920000) { return "新車のベルファイアが買えました！";}
        if (total_price >= 7336000) { return "エンジニアの平均年収を超えていました！";}
        if (total_price >= 6116279) { return "コンビニ1軒の全商品を購入できていました！";}
        if (total_price >= 5000000) { return "クロマグロ1尾が買えました！";}
        if (total_price >= 4610000) { return "サラリーマンの平均年収を超えていました！";}
        if (total_price >= 3214800) { return "東京大学理Ⅲの1年の学費をまかなえていました！";}
        if (total_price >= 2750000) { return "新型プリウスの新車が買えました！";}
        if (total_price >= 2361000) { return "40人規模の結婚式を挙げられました！相手は付属しません";}
        if (total_price >= 1548000) { return "中古車1台が買えました！";}
        if (total_price >= 1500000) { return "ゲーセンのmaimai筐体が買えました！";}
        if (total_price >= 1386000) { return "GeeScorpion(超高級ゲーミングチェア)が買えました！";}
        if (total_price >= 1180872) { return "ペッパーくんが一人買えました！";}
        if (total_price >= 1111400) { return "大学生の1年の生活費をまかなえていました！";}
        if (total_price >= 1000000) { return "ゲーセンの太鼓の達人の新筐体が買えました！";}
        if (total_price >= 940000) { return "ゲーセンにあるポップンミュージックの旧筐体が買えました！";}
        if (total_price >= 917540) { return "鹿児島駅前から札幌駅前までタクシーで移動できました！";}
        if (total_price >= 800000) { return "ゲーセンのダンエボの筐体が買えました！";}
        if (total_price >= 770000) { return "Valorantの全スキンが買えました！";}
        if (total_price >= 650000) { return "ゲーセンのProject Divaの筐体が買えました！";}
        if (total_price >= 588450) { return "超ハイスペックゲーミングパソコンが1台買えました！";}
        if (total_price >= 540000) { return "公園にある4人乗りブランコが買えました！";}
        if (total_price >= 493450) { return "大阪駅前から青森駅までタクシーで移動できました！";}
        if (total_price >= 460000) { return "公園にあるジャングルジムが買えました！";}
        if (total_price >= 400000) { return "Valve Index VRフルキット + ハイスペックゲーミングパソコンが買えました！";}
        if (total_price >= 359777) { return "Nvidia Quadro RTX 5000が買えました！";}
        if (total_price >= 319800) { return "Nvidia RTX 4090が買えました！";}
        if (total_price >= 310000) { return "公園にある2人乗りブランコが買えました！";}
        if (total_price >= 280000) { return "公園にあるうんていが買えました！";}
        if (total_price >= 250000) { return "4泊6日ハワイ旅行ができました！";}
        if (total_price >= 219800) { return "iPhone 15 Pro Max 512GBが買えました！";}
        if (total_price >= 198000) { return "iMacを1台買えました！";}
        if (total_price >= 165980) { return "Valve Index VRフルキットが買えました！";}
        if (total_price >= 159800) { return "iPhone 15 Pro 128GBが買えました！";}
        if (total_price >= 150000) { return "公園にある鉄棒が1欄買えました！";}
        if (total_price >= 149000) { return "キングサイズのベッドが買えました！";}
        if (total_price >= 147000) { return "このツールの作者の貯金額以上でした......";}
        if (total_price >= 139800) { return "iPhone 15 Plusが買えました！";}
        if (total_price >= 124800) { return "iPad Pro 11インチが買えました！";}
        if (total_price >= 104000) { return "東京都の平均家賃1ヶ月分をまかなえました！";}
        if (total_price >= 96800) { return "Meta Quest 3 512GBが買えました！";}
        if (total_price >= 82800) { return "Valve Index HMDが買えました！";}
        if (total_price >= 74800) { return "Meta Quest 3 128GBが買えました！";}
        if (total_price >= 53900) { return "Meta Quest 2 256GBが買えました！";}
        if (total_price >= 49000) { return "PICO 4が買えました！";}
        if (total_price >= 47300) { return "Meta Quest 2 128GBが買えました！";}
        if (total_price >= 38410) { return "一人暮らしの一ヶ月の食費がまかなえました！";}
        if (total_price >= 32890) { return "Yogibo Maxが買えました！";}
        if (total_price >= 17490) { return "ジェラピケのパジャマが買えました！";}
        if (total_price >= 9100) { return "カイジの月給を超えていました！";}
        if (total_price >= 7900) { return "ディズニーランドで1日遊べていました！";}
        if (total_price >= 5368) { return "焼肉食べ放題に行けました！";}
        if (total_price >= 4748) { return "モンエナ355mlが24本買えました！";}
        if (total_price >= 3905) { return "ストゼロ500mlが24本買えました！";}
        if (total_price >= 1999) { return "ダイの大冒険が買えました！";}
        if (total_price >= 1500) { return "VRChat Plusに1ヶ月加入できました！";}
        if (total_price >= 1280) { return "YouTube Premiumに1ヶ月加入できました！";}
        if (total_price >= 700) { return "スタバのフラペチーノが飲めました！";}
        if (total_price >= 300) { return "ファミマのアイスコーヒーLサイズが飲めました！";}
        if (total_price >= 220) { return "ファミチキが1個買えました！";}
        if (total_price >= 100) { return "ボールペンが1本買えました！";}
        if (total_price >= 20) { return "もやしが1袋買えました！";}
        if (total_price >= 3) { return "レジ袋Mサイズ1枚しか買えませんでした......";}
        return "何も買えませんでした。";
    }


    ///                             ///
    /// *===== 累計金額の表示 =====* ///
    ///                             ///
	function setTotalPrice(total_price) {
		var totalText = document.createElement("div");
		totalText.style.position = "fixed";
		totalText.style.bottom = "60px";
		totalText.style.left = "10px";
		totalText.style.backgroundColor = "#333";
		totalText.style.color = "#fff";
		totalText.style.padding = "6px 18px";
		totalText.style.borderRadius = "20px";
		totalText.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1';
		totalText.style.border = 'none';
		totalText.style.zIndex = "1000";
        totalText.style.cursor = "pointer";
		totalText.textContent = "累計金額: " + Number(total_price).toLocaleString() + "円";
		totalText.addEventListener("mouseover", () => {
			totalText.style.background = "#444";
		});
		totalText.addEventListener("mouseout", () => {
			totalText.style.background = "#333";
		});
        totalText.onclick = function() {
            if (confirm(`もし『${Number(total_price).toLocaleString()}円』あれば...\n${typicalPrice(total_price)}\n\nOKを押すと、この文章を入れてツイートします。`)) {
                const tweetText =
				`私がBoothで使用した合計金額は、『${Number(total_price).toLocaleString()}円』でした！\n` +
                `もし${Number(total_price).toLocaleString()}円あれば...\n『${typicalPrice(total_price)}』\n\n` +
                `#私がBoothに使った金額`;
                // ( ´~`).｡ (いずれx.comにしないといけないのかな...?)
			    const tweetURL = "https://twitter.com/intent/tweet?text=" +
				encodeURIComponent(tweetText);
			    window.open(tweetURL, "_blank");
            }
        }
		document.body.appendChild(totalText);
	}
	setTotalPrice(total_price);

    ///                             ///
    /// *===== スタート！！！ =====* ///
    ///      - ̗̀ ( ˶'ᵕ'˶) ̖́-          ///
	if (autoCalculate) {
		main()
	}

})();

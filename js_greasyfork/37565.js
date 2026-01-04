// ==UserScript==
// @name        futaba_catalog_NG
// @namespace   https://github.com/akoya-tomo
// @description カタログのスレをＮＧで非表示
// @author      akoya_tomo
// @match       http://*.2chan.net/*/futaba.php?mode=cat*
// @match       https://*.2chan.net/*/futaba.php?mode=cat*
// @version     1.10.0
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js
// @require     https://cdn.jsdelivr.net/npm/js-md5@0.7.3/src/md5.min.js
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @license     MIT
// @run-at      document-start
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMjHxIGmVAAABXElEQVQ4T8VSTUvDQBRcEcGL0H+QQ3c3KSVtmhRMe5aC4rX+Fb15F/PVUqFSqwcV8SxSPYknUcSDKCqICNZ/YBEv62xcS0CQ5iBOeMm+92beDrsh/w8WMIuFrEdD2kdc8ZAvacvapGoPIWs84IsxJ+J96I6yftYmKLywiInCekFUdirCbJsCzfNiUMwoLdECLQPe2TfH6lhCarDxK8HrKU5UlLfKwu7agvnsUOkJDehBaaMknE1nyIsjYM8ExBkMGSQbkiid0FU6D9uzcv1DHLEB9Wkt3kH3dBNDTpIEd9uVFvdA2o3XiR4cnfIVXojFScDSNAghnnu9qUuLD1jf5Vo5gTN4RETUo66i/w7msTmI3yH64D5fQGnsq5MCcHCNa71VaXpgwAXiUqXpgd1vEOkH5Fv5mt7Qj+WJG01jTZVHh9Ewuvhd3+S32qlOqfLoqO/Xx522M6HSvwQhn8ChorvE+0t7AAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/37565/futaba_catalog_NG.user.js
// @updateURL https://update.greasyfork.org/scripts/37565/futaba_catalog_NG.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);

(function ($) {
	/**
	 *	設定
	 */
	var USE_NG_IMAGES = true;				// スレ画像のNGを有効にする
	var MAX_NG_THREADS = 512;				// NGスレの最大保持数（板毎）
	var MAX_REGISTERED_NG_IMAGES = 2048;	// NG画像の最大登録数
	var MAX_OK_IMAGES = 1024;				// 非NG画像名の最大保持数（板毎）
	var HIDE_CATALOG_BEFORE_LOAD = false;	// ページの読み込みが完了するまでカタログを隠す
	var USE_NG_THREAD_CLEAR_BUTTON = true;	// スレNGのクリアボタンを使用する
	var USE_NG_DISABLE_BUTTON = true;		// NG機能一時無効ボタンを使用する
	var USE_DHASH = false;					// 近似画像NGを使用する
	var DISTANCE_THRESHOLD = 3;				// 近似画像判定閾値(デフォルト：3)
	var ENABLE_DHASH_TEST = false;			// 近似画像NGのテストモードを有効にする
	var CHECK_NG_LIST = true;				// NGリストが正常かチェックする

	var serverName = document.domain.match(/^[^.]+/);
	var pathName = location.pathname.match(/[^/]+/);
	var serverFullPath = serverName + "_" + pathName;
	var selectIndex = -1;
	var imageList = GM_getValue("_futaba_catalog_NG_images", []);
	var commentList = GM_getValue("_futaba_catalog_NG_comment", []);
	var dateList = GM_getValue("_futaba_catalog_NG_date", []);
	var dHashList = GM_getValue("_futaba_catalog_NG_dHashes", []);
	var images, ngDate, okImages, dHashes;
	var item_md5_text = "　md5";
	var item_comment_text = "　コメント";
	var item_date_text = "　最終検出日";
	var item_dHash_text = "　dHash";
	var isNgEnable = true;

	// dHashリスト初期化
	if (dHashList.length == 0 && imageList.length > 0) {
		dHashList = new Array(imageList.length).fill(null);
		GM_setValue("_futaba_catalog_NG_dHashes", dHashList);
	}

	if (CHECK_NG_LIST && USE_NG_IMAGES && !isNgListNormal()) {
		alert("NGリストが壊れています");
	}

	if (HIDE_CATALOG_BEFORE_LOAD) {
		hideCatalog();
	} else {
		$(init);
	}

	function isNgListNormal() {
		var imageNum = imageList.length;
		var commentNum = commentList.length;
		var dateNum = dateList.length;
		var dHashNum = dHashList.length;
		//console.log("futaba catalog NG - imageNum: " + imageNum);
		//console.log("futaba catalog NG - commentNum: " + commentNum);
		//console.log("futaba catalog NG - dateNum: " + dateNum);
		//console.log("futaba catalog NG - dHashNum: " + dHashNum);
		return (imageNum == commentNum) && (imageNum == dateNum) && (imageNum == dHashNum);
	}

	function init() {
		//clearNgNumber();
		//console.log("futaba_catalog_NG - commmon: " +
		//	GM_getValue("_futaba_catalog_NG_words", ""));
		//console.log("futaba_catalog_NG - indivisual: " +
		//	getCurrentIndivValue("NG_words_indiv", ""));
		GM_registerMenuCommand("ＮＧワード編集", editNgWords);
		if (USE_NG_IMAGES) {
			GM_registerMenuCommand("ＮＧリスト編集", editNgList);
		}
		GM_registerMenuCommand("スレＮＧクリア", confirmClearNgNumber);
		setStyle();
		makeNgMenubar();
		makeConfigUI();
		makeNgListUI();
		makeNgButton();
		hideNgThreads();
		checkAkahukuReload();
		listenKoshianDelEvent();
		listenFthPickupEvent();
	}

	/**
	 * NG番号クリア
	 * @param {boolean} forced 強制的にクリアするか
	 */
	function clearNgNumber(forced) {
		if (!forced && window.name) {
			return;
		}
		window.name = location.href;

		var ngNumberObj = getIndivObj("NG_numbers_indiv");
		if (ngNumberObj === "") {
			ngNumberObj = {};
		}
		ngNumberObj[serverFullPath] = [];
		var jsonString = JSON.stringify(ngNumberObj);
		GM_setValue("NG_numbers_indiv", jsonString);
	}

	/**
	 * 各板個別NGデータを保存
	 * @param {string} target 保存するNG名
	 * @param {string|Array} val 保存するNGデータ
	 */
	function setIndivValue(target, val) {
		var indivObj = getIndivObj(target);
		if (indivObj === "") {
			indivObj = {};
		}
		indivObj[serverFullPath] = val;
		var jsonString = JSON.stringify(indivObj);
		GM_setValue(target, jsonString);
		//console.log("futaba_catalog_NG: " + target + " updated@" + serverFullPath + " - " + val);
	}

	/**
	 * 各板個別NGデータのオブジェクトを取得
	 * @param {string} target 取得するNG名
	 * @return {object} 取得したNGデータ
	 */
	function getIndivObj(target) {
		var indivVal = GM_getValue(target, "");
		var indivObj = "";
		if (indivVal !== "") {
			indivObj = JSON.parse(indivVal);
		}
		return indivObj;
	}

	/**
	 * NGワード編集メニュー表示
	 */
	function editNgWords(){
		var wordsCommon = GM_getValue("_futaba_catalog_NG_words", "");
		var wordsIndiv = getCurrentIndivValue("NG_words_indiv", "");
		$("#GM_fcn_ng_words_common").val(wordsCommon);
		$("#GM_fcn_ng_words_individual").val(wordsIndiv);
		var $configContainer = $("#GM_fcn_config_container");
		$configContainer.fadeIn(100);
	}

	/**
	 * 現在の板の個別NGデータを取得
	 * @param {string} target NGデータ名
	 * @param {string|Array} defaultVal NGデータが未定義のときの既定値
	 * @return {string|Array} 現在の板の個別NGデータ
	 */
	function getCurrentIndivValue(target, defaultVal) {
		var indivObj = getIndivObj(target);
		var currentIndivVal;
		if (indivObj !== "") {
			currentIndivVal = indivObj[serverFullPath];
		}
		if (!currentIndivVal) {
			currentIndivVal = defaultVal;
		}
		return currentIndivVal;
	}

	/**
	 * NGリスト編集メニュー表示
	 */
	function editNgList() {
		// マウスホイールリロード対策
		$("<div>", {
			id: "GM_fcn_catalog_space"
		}).appendTo("body");
		if ($(window).scrollTop() < 2) {
			$("html, body").scrollTop(2);
		}
		$("html, body").css("overflow", "hidden");

		refreshNgList(true);
		resetNgListItemText();
		var $ngListContainer = $("#GM_fcn_ng_list_container");
		$ngListContainer.fadeIn(100);
	}

	/**
	 * NGリスト項目名リセット
	 */
	function resetNgListItemText() {
		$("#GM_fcn_ng_list_item_md5").text(item_md5_text + "　");
		$("#GM_fcn_ng_list_item_comment").text(item_comment_text + "　");
		$("#GM_fcn_ng_list_item_date").text(item_date_text + "　");
		$("#GM_fcn_ng_list_item_dHash").text(item_dHash_text + "　");
	}

	/**
	 * スレNGクリア確認
	 */
	function confirmClearNgNumber() {
		if (confirm("この板のスレNGを全てクリアします。\nよろしいですか？")) {
			$(".GM_fcn_ng_numbers").each(function() {
				$(this).removeClass("GM_fcn_ng_numbers");
				$(this).css("display", "");
			});
			clearNgNumber(true);
		}
	}

	/**
	 * NG機能無効切り替え
	 */
	function toggleNgDisable() {
		var $ngDisableButton = $("#GM_fcn_ng_disable_button");
		if (isNgEnable) {
			$ngDisableButton.css("background", "#a9d8ff");
			isNgEnable = false;
			$(".GM_fcn_ng_words").css("display", "");
			$(".GM_fcn_ng_words").removeClass("GM_fcn_ng_words");
			$(".GM_fcn_ng_numbers").css("display", "");
			$(".GM_fcn_ng_numbers").removeClass("GM_fcn_ng_numbers");
			$(".GM_fcn_ng_images").css("display", "");
			$(".GM_fcn_ng_images").removeClass("GM_fcn_ng_images");
			$(".GM_fcn_ng_dhash_td").removeClass("GM_fcn_ng_dhash_td");
			$(".GM_fcn_ng_dhash_img").removeClass("GM_fcn_ng_dhash_img");
		} else {
			$ngDisableButton.css("background", "none");
			isNgEnable = true;
			hideNgThreads();
		}
	}

	/**
	 * NGリスト表示更新
	 * @param {boolean} loadNgList NGリストデータを読み込みするか
	 */
	function refreshNgList(loadNgList) {
		if (loadNgList) {
			imageList = GM_getValue("_futaba_catalog_NG_images", []);
			commentList = GM_getValue("_futaba_catalog_NG_comment", []);
			dateList = GM_getValue("_futaba_catalog_NG_date", []);
			dHashList = GM_getValue("_futaba_catalog_NG_dHashes", []);
		}
		var listCount = imageList.length;
		$(".GM_fcn_ng_list_row").remove();

		for (var i = 0; i < listCount; ++i) {
			var row = $("<div>", {
				class: "GM_fcn_ng_list_row",
				click: function() {	// eslint-disable-line no-loop-func
					selectIndex = $(this).index();
					selectNgList();
				}
			}).appendTo("#GM_fcn_ng_list_content");
			row.append(
				$("<div>", {
					class: "GM_fcn_ng_list_image",
					text: imageList[i],
				}),
				$("<div>", {
					class: "GM_fcn_ng_list_dHash",
					text: dHashList[i] ? ("000000000000" + dHashList[i].toString(16)).slice(-13) : "－",
				}),
				$("<div>", {
					class: "GM_fcn_ng_list_comment",
					text: commentList[i],
				}),
				$("<div>", {
					class: "GM_fcn_ng_list_date",
					text: dateList[i],
				}),
				$("<div>", {
					class: "GM_fcn_ng_list_scrl",
				})
			);
		}
		$(".GM_fcn_ng_list_row").css("background-color", "#ffffff");
	}

	/**
	 * NGリスト選択
	 */
	function selectNgList() {
		$(".GM_fcn_ng_list_row").css("background-color", "#ffffff")
			.eq(selectIndex).css("background-color", "#ffecfd");
		$("#GM_fcn_md5").val(imageList[selectIndex]);
		$("#GM_fcn_comment").val(commentList[selectIndex]);
	}

	/**
	 * NGメニューバー作成
	 */
	function makeNgMenubar() {
		var $ngMenubarArea = $("<div>", {
			id: "GM_fcn_ng_menubar",
			css: {
				"background-color": "#F0E0D6"
			}
		});
		var $ngWordsHeader = $("<span>", {
			id: "GM_fcn_ng_words_header",
			text: "ＮＧワード",
			css: {
				"background-color": "#F0E0D6",
				fontWeight: "bolder",
				"padding-right": "16px"
			}
		});
		$("#cattable").before($ngMenubarArea);
		$ngMenubarArea.append($ngWordsHeader);
		// 設定ボタン
		var $ngWordsButton = $("<span>", {
			id: "GM_fcn_config_ng_words",
			text: "[設定]",
			css: {
				cursor: "pointer",
			},
			click: editNgWords
		});
		$ngWordsButton.hover(function() {
			$(this).css("background-color", "#EEAA88");
		}, function() {
			$(this).css("background-color", "#F0E0D6");
		});
		$ngWordsHeader.append($ngWordsButton);

		if (USE_NG_DISABLE_BUTTON) {
			// NG機能一時無効
			var $ngDisableHeader = $("<span>", {
				id: "GM_fcn_ng_disalbe_header",
				text: "ＮＧ機能",
				css: {
					"background-color": "#F0E0D6",
					fontWeight: "bolder",
					"padding-right": "16px"
				}
			});
			$ngWordsHeader.after($ngDisableHeader);
			// NG機能一時無効ボタン
			var $ngDisableButton = $("<a>", {
				id: "GM_fcn_ng_disable_button",
				text: "[一時無効]",
				css: {
					cursor: "pointer",
				},
				click: toggleNgDisable
			});
			$ngDisableHeader.append($ngDisableButton);
		}

		if (USE_NG_THREAD_CLEAR_BUTTON) {
			// スレNG
			var $ngThreadHeader = $("<span>", {
				id: "GM_fcn_ng_thread_header",
				text: "スレＮＧ",
				css: {
					"background-color": "#F0E0D6",
					fontWeight: "bolder",
					"padding-right": "16px"
				}
			});
			$ngWordsHeader.after($ngThreadHeader);
			// スレNGクリアボタン
			var $ngThreadClearButton = $("<span>", {
				id: "GM_fcn_ng_thread_clear_button",
				text: "[クリア]",
				css: {
					cursor: "pointer",
				},
				click: confirmClearNgNumber
			});
			$ngThreadClearButton.hover(function() {
				$(this).css("background-color", "#EEAA88");
			}, function() {
				$(this).css("background-color", "#F0E0D6");
			});
			$ngThreadHeader.append($ngThreadClearButton);
		}

		if (USE_NG_IMAGES) {
			// NGリスト
			var $ngListHeader = $("<span>", {
				id: "GM_fcn_ng_list_header",
				text: "ＮＧリスト",
				css: {
					"background-color": "#F0E0D6",
					fontWeight: "bolder",
					"padding-right": "16px"
				}
			});
			$ngWordsHeader.after($ngListHeader);
			// NGリスト編集ボタン
			var $ngListButton = $("<span>", {
				id: "GM_fcn_edit_ng_list",
				text: "[編集]",
				css: {
					cursor: "pointer",
				},
				click: editNgList
			});
			$ngListButton.hover(function () {
				$(this).css("background-color", "#EEAA88");
			}, function () {
				$(this).css("background-color", "#F0E0D6" );
			});
			$ngListHeader.append($ngListButton);
		}
	}

	/**
	 * NGワード編集メニュー作成
	 */
	function makeConfigUI() {
		var $configContainer = $("<div>", {
			id: "GM_fcn_config_container",
			css: {
				position: "fixed",
				"z-index": "1001",
				left: "50%",
				top: "50%",
				"text-align": "center",
				"margin-left": "-475px",
				"margin-top": "-50px",
				"background-color": "rgba(240, 192, 214, 0.95)",
				width: "950px",
				//height: "100px",
				display: "none",
				fontSize: "16px",
				fontWeight: "normal",
				"box-shadow": "3px 3px 5px #853e52",
				"border": "1px outset",
				"border-radius": "10px",
				"padding": "5px",
			}
		});
		$("#GM_fcn_ng_words_header").append($configContainer);
		$configContainer.append(
			$("<div>").append(
				$("<div>").text("ＮＧワード編集").css({
					"background-color": "#ffeeee",
					"padding": "2px",
					"font-weight": "bold"
				}),
				$("<div>").text("スレ本文に含まれる語句を入力してください。 | を挟むと複数指定できます。正規表現使用可。")
			),
			$("<div>").css("margin-top", "1em").append(
				$("<div>").append(
					$("<label>").text("全板共通").attr("for", "GM_fcn_ng_words_common"),
					$("<input>", {
						id: "GM_fcn_ng_words_common",
						class: "GM_fcn_input",
						css: {
							width: "54em",
							fontSize: "13.33px"
						}
					}),
					$("<span>").append(
						$("<input>", {
							class: "GM_fcn_config_button",
							type: "button",
							val: "区切り文字挿入",
							click: function() {
								insertDelimiter("GM_fcn_ng_words_common");
							},
						})
					)
				),
				$("<div>").append(
					$("<label>").text("各板個別").attr("for", "GM_fcn_ng_words_individual"),
					$("<input>", {
						"id": "GM_fcn_ng_words_individual",
						"class": "GM_fcn_input",
						css: {
							width: "54em",
							fontSize: "13.33px"
						}
					}),
					$("<span>").append(
						$("<input>", {
							class: "GM_fcn_config_button",
							type: "button",
							val: "区切り文字挿入",
							click: function() {
								insertDelimiter("GM_fcn_ng_words_individual");
							},
						})
					)
				)
			),
			$("<div>").css({
				"margin-top": "1em",
			}).append(
				$("<span>").css("margin", "0 1em").append(
					$("<input>", {
						class: "GM_fcn_config_button",
						type: "button",
						val: "更新",
						click: setNgWords
					})
				),
				$("<span>").css("margin", "0 1em").append(
					$("<input>", {
						class: "GM_fcn_config_button",
						type: "button",
						val: "キャンセル",
						click: function() {
							setCursor();
							$configContainer.fadeOut(100);
						},
					})
				)
			)
		);
		$(".GM_fcn_config_button").css({
			"cursor": "pointer",
			"background-color": "#FFECFD",
			"border": "2px outset #96ABFF",
			"border-radius": "5px",
			"font-size": "13.33px",
		}).hover(function() {
			$(this).css("background-color", "#CCE9FF");
		}, function() {
			$(this).css("background-color", "#FFECFD");
		});

		/**
		 * カーソル位置にデリミタ挿入
		 * @param {string} id デリミタを挿入する入力欄のID名
		 */
		function insertDelimiter(id){
			var $input = $("#" + id);
			var val = $input.val();
			var position = $input[0].selectionStart;
			var newval = val.substr(0, position) + "|" + val.substr(position);
			$input.val(newval);
			$input[0].setSelectionRange(position + 1 ,position + 1);
		}
	}

	/**
	 * NGワードをセット
	 */
	function setNgWords() {
		var inputCommon = $("#GM_fcn_ng_words_common").val();
		var inputIndiv = $("#GM_fcn_ng_words_individual").val();
		GM_setValue("_futaba_catalog_NG_words", inputCommon);
		console.log("futaba_catalog_NG: common NGword updated - " + inputCommon);	// eslint-disable-line no-console
		setIndivValue("NG_words_indiv", inputIndiv);
		setCursor();
		$("#GM_fcn_config_container").fadeOut(100);
		hideNgThreads(true);
	}

	/**
	 * NGワードのカーソルを先頭に移動
	 */
	function setCursor() {
		var inputCommonElm = $("#GM_fcn_ng_words_common").get(0);
		if (inputCommonElm) {
			inputCommonElm.focus();
			inputCommonElm.setSelectionRange(0, 0);	// カーソルを先頭に移動
			inputCommonElm.blur();
		}
		var inputIndivElm = $("#GM_fcn_ng_words_individual").get(0);
		if (inputIndivElm) {
			inputIndivElm.focus();
			inputIndivElm.setSelectionRange(0, 0);	// カーソルを先頭に移動
			inputIndivElm.blur();
		}
	}

	/**
	 * NGリスト編集メニュー作成
	 */
	function makeNgListUI() {
		if (!USE_NG_IMAGES) {
			GM_setValue("OK_images_indiv", "");
			return;
		}
		imageList = GM_getValue("_futaba_catalog_NG_images", []);
		commentList = GM_getValue("_futaba_catalog_NG_comment", []);
		dateList = GM_getValue("_futaba_catalog_NG_date", []);
		dHashList = GM_getValue("_futaba_catalog_NG_dHashes", []);

		var $ngListContainer = $("<div>", {
			id: "GM_fcn_ng_list_container",
			css: {
				position: "fixed",
				"z-index": "1001",
				left: "50%",
				top: "50%",
				"text-align": "center",
				"margin-left": "-475px",
				"margin-top": "-250px",
				"background-color": "rgba(240, 192, 214, 0.95)",
				width: "950px",
				//height: "500px",
				display: "none",
				fontSize: "16px",
				fontWeight: "normal",
				"box-shadow": "3px 3px 5px #853e52",
				"border": "1px outset",
				"border-radius": "10px",
				"padding": "5px",
			}
		});
		$("#GM_fcn_ng_list_header").append($ngListContainer);
		$ngListContainer.append(
			$("<div>").append(
				$("<div>").text("ＮＧリスト編集").css({
					"background-color": "#ffeeee",
					"padding": "2px",
					"font-size": "16px",
					"font-weight": "bold"
				}),
				$("<div>").css("margin-top", "1em").append(
					$("<div>").append(
						$("<label>").text("md5：").attr("for", "GM_fcn_md5"),
						$("<input>", {
							id: "GM_fcn_md5",
							class: "GM_fcn_ng_list_input",
							readonly: "readonly",
						}),
						$("<label>").text("コメント：").attr("for", "GM_fcn_comment"),
						$("<input>", {
							id: "GM_fcn_comment",
							class: "GM_fcn_ng_list_input",
							keypress: function(e) {
								if (e.key == "Enter") {
									editSelectedRow();
								}
							}
						})
					)
				),
				$("<div>").css("margin-top", "1em").append(
					$("<div>").css("margin-left", "475px").append(
						$("<span>").append(
							$("<input>", {
								class: "GM_fcn_ng_list_button GM_fcn_ng_list_edit_button",
								type: "button",
								val: "修正",
								click: editSelectedRow
							})
						),
						$("<span>").append(
							$("<input>", {
								class: "GM_fcn_ng_list_button GM_fcn_ng_list_edit_button",
								type: "button",
								val: "削除",
								click: deleteSelectedRow
							})
						),
						$("<span>").css("margin", "0 0 0 1em").append(
							$("<input>", {
								class: "GM_fcn_ng_list_button GM_fcn_ng_list_move_button",
								type: "button",
								val: "上",
								click: function() {
									swapRow(selectIndex - 1);
								},
							})
						),
						$("<span>").append(
							$("<input>", {
								class: "GM_fcn_ng_list_button GM_fcn_ng_list_move_button",
								type: "button",
								val: "下",
								click: function() {
									swapRow(selectIndex);
								},
							})
						)
					)
				)
			),
			$("<div>").css("margin-top", "1em").append(
				$("<div>", {
					id: "GM_fcn_ng_list_pane",
				}).append(
					$("<div>", {
						id: "GM_fcn_ng_list_item_row"
					}).append(
						$("<div>", {
							id: "GM_fcn_ng_list_item_md5",
							class: "GM_fcn_ng_list_item",
							text: item_md5_text + "　",
							click: function() {
								if ($(this).text() == item_md5_text + "▲") {
									resetNgListItemText();
									$(this).text(item_md5_text + "▼");
									sortNgList(0, -1);
								} else {
									resetNgListItemText();
									$(this).text(item_md5_text + "▲");
									sortNgList(0);
								}
							},
						}),
						$("<div>", {
							id: "GM_fcn_ng_list_item_dHash",
							class: "GM_fcn_ng_list_item",
							text: item_dHash_text + "　",
							click: function() {
								if ($(this).text() == item_dHash_text + "▲") {
									resetNgListItemText();
									$(this).text(item_dHash_text + "▼");
									sortNgList(3, -1);
								} else {
									resetNgListItemText();
									$(this).text(item_dHash_text + "▲");
									sortNgList(3);
								}
							},
						}),
						$("<div>", {
							id: "GM_fcn_ng_list_item_comment",
							class: "GM_fcn_ng_list_item",
							text: item_comment_text + "　",
							click: function() {
								if ($(this).text() == item_comment_text + "▲") {
									resetNgListItemText();
									$(this).text(item_comment_text + "▼");
									sortNgList(1, -1);
								} else {
									resetNgListItemText();
									$(this).text(item_comment_text + "▲");
									sortNgList(1);
								}
							},
						}),
						$("<div>", {
							id: "GM_fcn_ng_list_item_date",
							class: "GM_fcn_ng_list_item",
							text: item_date_text + "　",
							click: function() {
								if ($(this).text() == item_date_text + "▼") {
									resetNgListItemText();
									$(this).text(item_date_text + "▲");
									sortNgList(2);
								} else {
									resetNgListItemText();
									$(this).text(item_date_text + "▼");
									sortNgList(2, -1);
								}
							},
						}),
						$("<div>", {
							id: "GM_fcn_ng_list_item_scrl",
							class: "GM_fcn_ng_list_item",
						})
					),
					$("<div>", {
						id: "GM_fcn_ng_list_content"
					})
				),
				$("<div>").css("margin-top", "1em").append(
					$("<span>").css("margin", "0 1em").append(
						$("<input>", {
							class: "GM_fcn_ng_list_button",
							type: "button",
							val: "更新",
							click: function() {
								if (!CHECK_NG_LIST || isNgListNormal()) {
									GM_setValue("_futaba_catalog_NG_images", imageList);
									GM_setValue("_futaba_catalog_NG_comment", commentList);
									GM_setValue("_futaba_catalog_NG_date", dateList);
									GM_setValue("_futaba_catalog_NG_dHashes", dHashList);
									$(".GM_fcn_ng_list_row").css("background-color", "#ffffff");
									$("#GM_fcn_md5").val("");
									$("#GM_fcn_comment").val("");
									$("#GM_fcn_ng_list_content").scrollTop(0);
									$("#GM_fcn_catalog_space").remove();
									$("html, body").css("overflow", "");
									selectIndex = -1;
									$ngListContainer.fadeOut(100);
									$(".GM_fcn_ng_images").css("display", "");
									$(".GM_fcn_ng_images").removeClass("GM_fcn_ng_images");
									$(".GM_fcn_ng_dhash_td").removeClass("GM_fcn_ng_dhash_td");
									$(".GM_fcn_ng_dhash_img").removeClass("GM_fcn_ng_dhash_img");
									hideNgThreads();
								} else {
									alert("NGリストが壊れています\n一度キャンセルしてからやり直してください");
								}
							},
						})
					),
					$("<span>").css("margin", "0 1em").append(
						$("<input>", {
							class: "GM_fcn_ng_list_button",
							type: "button",
							val: "キャンセル",
							click: function(){
								$(".GM_fcn_ng_list_row").css("background-color", "#ffffff");
								$("#GM_fcn_md5").val("");
								$("#GM_fcn_comment").val("");
								$("#GM_fcn_ng_list_content").scrollTop(0);
								$("#GM_fcn_catalog_space").remove();
								$("html, body").css("overflow", "");
								selectIndex = -1;
								$ngListContainer.fadeOut(100);
							},
						})
					)
				)
			)
		);
		$(".GM_fcn_ng_list_button").css({
			"cursor": "pointer",
			"background-color": "#FFECFD",
			"border": "2px outset #96ABFF",
			"border-radius": "5px",
			"font-size": "13.33px"
		}).hover(function() {
			$(this).css("background-color", "#CCE9FF");
		}, function() {
			$(this).css("background-color", "#FFECFD");
		});

		$(document).keydown((e) => {
			if (e.key == "ArrowUp" && selectIndex > 0) {
				$(".GM_fcn_ng_list_comment").eq(selectIndex - 1).click();
				e.preventDefault();
				scrollToSelectedRow();
				$("#GM_fcn_comment").blur();
			} else if (e.key == "ArrowDown" && selectIndex > -1 && selectIndex < imageList.length) {
				$(".GM_fcn_ng_list_comment").eq(selectIndex + 1).click();
				e.preventDefault();
				scrollToSelectedRow();
				$("#GM_fcn_comment").blur();
			} else if (e.key == "F2" && selectIndex > -1) {
				$("#GM_fcn_comment").focus();
				e.preventDefault();
			}
		});

		/**
		 * NGリスト選択行コメント修正
		 */
		function editSelectedRow() {
			if (selectIndex > -1) {
				commentList[selectIndex] = $("#GM_fcn_comment").val();
				$(".GM_fcn_ng_list_comment").eq(selectIndex).text(commentList[selectIndex]);
			}
		}

		/**
		 * NGリスト選択行削除
		 */
		function deleteSelectedRow() {
			if (selectIndex > -1) {
				imageList.splice(selectIndex, 1);
				commentList.splice(selectIndex, 1);
				dateList.splice(selectIndex, 1);
				dHashList.splice(selectIndex, 1);
			}
			$(".GM_fcn_ng_list_row").css("background-color", "#ffffff");
			$("#GM_fcn_md5").val("");
			$("#GM_fcn_comment").val("");
			selectIndex = -1;
			refreshNgList();
		}

		/**
		 * NGリスト行入替
		 *     indexの行と一つ後の行を入れ替える。
		 * @param {number} index 入替する行番号（先頭行が0）
		 */
		function swapRow(index) {
			if (index <= -1 || index + 1 >= imageList.length) {
				return;
			}

			imageList.splice(index, 2, imageList[index + 1], imageList[index]);
			commentList.splice(index, 2, commentList[index + 1], commentList[index]);
			dateList.splice(index, 2, dateList[index + 1], dateList[index]);
			dHashList.splice(index, 2, dHashList[index + 1], dHashList[index]);
			selectIndex = selectIndex == index ? index + 1 : index;

			scrollToSelectedRow();
			refreshNgList();
			selectNgList();
			resetNgListItemText();
		}

		/**
		 * 選択行までスクロール
		 */
		function scrollToSelectedRow() {
			var rowHeight = 22;	// NGリストの1行当たりの高さ(px)
			var listLines = 13;	// NGリストの表示行数
			var selectPos = selectIndex * rowHeight;
			var scrollTop = $("#GM_fcn_ng_list_content").scrollTop();
			var scrollBottom = scrollTop + (rowHeight * (listLines - 2));
			if (selectPos < scrollTop) {
				$("#GM_fcn_ng_list_content").scrollTop(selectPos);
			}
			if (selectPos > scrollBottom) {
				$("#GM_fcn_ng_list_content").scrollTop(selectPos - (rowHeight * (listLines - 2)));
			}
		}

		/**
		 * NGリストソート
		 * @param {number} index ソート対象の項目（md5:0, コメント:1, 最終検出日:2, dHash:3）
		 * @param {number} order ソート方向（昇順:1, 降順:-1）未指定は昇順
		 */
		function sortNgList(index, order = 1) {
			var array = new Array();
			for (var i = 0; i < imageList.length; ++i) {
				array[i] = new Array();
				array[i][0] = imageList[i];
				array[i][1] = commentList[i];
				array[i][2] = dateList[i];
				array[i][3] = dHashList[i];
			}
			array.sort(function(a, b){
				if (a[index] > b[index]) {
					return order;
				}
				if (a[index] < b[index]) {
					return -order;
				}
				return 0;
			});
			for (var j = 0; j < imageList.length; ++j) {
				imageList[j] = array[j][0];
				commentList[j] = array[j][1];
				dateList[j] = array[j][2];
				dHashList[j] = array[j][3];
			}

			$(".GM_fcn_ng_list_row").css("background-color", "#ffffff");
			$("#GM_fcn_md5").val("");
			$("#GM_fcn_comment").val("");
			selectIndex = -1;
			refreshNgList();
		}
	}

	/**
	 * 動的リロードの状態を取得
	 */
	function checkAkahukuReload() {
		// 赤福
		var target = $("#akahuku_catalog_reload_status").get(0);
		if (target) {
			checkAkahukuReloadStatus(target);
		} else {
			$(document).on("AkahukuContentApplied", () => {
				target = $("#akahuku_catalog_reload_status").get(0);
				if (target) {
					checkAkahukuReloadStatus(target);
				} else {
					console.error ("futaba_catalog_NG - #akahuku_catalog_reload_status not found");
				}
			});
		}

		function checkAkahukuReloadStatus(target) {
			var status = "";
			var config = { childList: true };
			var observer = new MutationObserver(function() {
				if (target.textContent == status) {
					return;
				}
				status = target.textContent;
				if (status == "完了しました" || status == "アンドゥしました" || status == "リドゥしました") {
					if (!isNgEnable) {
						$("#GM_fcn_ng_disable_button").css("background", "none");
						isNgEnable = true;
					}
					makeNgButton();
					hideNgThreads();
					$("body").attr("__fcn_catalog_visibility", "visible");
					$("#cattable > tbody").css("opacity", "1");
					$("#GM_fth_highlighted_threads").css("visibility", "visible");
				} else if (HIDE_CATALOG_BEFORE_LOAD && status !== "") {
					$("body").attr("__fcn_catalog_visibility", "hidden");
					$("#cattable > tbody").css("opacity", "0");
					$("#GM_fth_highlighted_threads").css("visibility", "hidden");
				}
			});
			observer.observe(target, config);
		}

		// KOSHIAN
		$(document).on("KOSHIAN_cat_reload", () => {
			if (HIDE_CATALOG_BEFORE_LOAD) {
				$("body").attr("__fcn_catalog_visibility", "hidden");
				$("#cattable > tbody").css("opacity", "0");
				$("#GM_fth_highlighted_threads").css("visibility", "hidden");
			}
			if (!isNgEnable) {
				$("#GM_fcn_ng_disable_button").css("background", "none");
				isNgEnable = true;
			}
			makeNgButton();
			hideNgThreads();
			$("body").attr("__fcn_catalog_visibility", "visible");
			$("#cattable > tbody").css("opacity", "1");
			$("#GM_fth_highlighted_threads").css("visibility", "visible");
		});

		// ふたクロ
		checkFutakuroReloadStatus();

		function checkFutakuroReloadStatus() {
			var opacityZero = false;
			var target = $("#cattable").get(0);
			var config = { attributes: true , attributeFilter: ["style"] };
			var observer = new MutationObserver(function(mutations) {
				if ($("#cat_search").length) {
					mutations.forEach(function(mutation) {
						if (mutation.target.attributes.style.nodeValue == "opacity: 0;") {
							opacityZero = true;
							if (HIDE_CATALOG_BEFORE_LOAD) {
								$("body").attr("__fcn_catalog_visibility", "hidden");
								$("#cattable > tbody").css("opacity", "0");
								$("#GM_fth_highlighted_threads").css("visibility", "hidden");
							}
						} else if (opacityZero && mutation.target.attributes.style.nodeValue != "opacity: 0;") {
							opacityZero = false;
							if (!isNgEnable) {
								$("#GM_fcn_ng_disable_button").css("background", "none");
								isNgEnable = true;
							}
							makeNgButton();
							hideNgThreads();
							$("body").attr("__fcn_catalog_visibility", "visible");
							$("#cattable > tbody").css("opacity", "1");
							$("#GM_fth_highlighted_threads").css("visibility", "visible");
						}
					});
				}
			});
			observer.observe(target, config);
		}
	}

	/**
	 * カタログのスレにNGボタン作成
	 */
	function makeNgButton() {
		// カタログソートが「設定」なら作成しない
		if (location.search.match(/mode=catset/)) {
			return;
		}
		// NGボタン
		var $ngButton = $("<span>", {
			class: "GM_fcn_ng_button",
			text: "[NG]",
			css: {
				color: "blue",
				display: "none",
			},
		});
		// NGボタンメニュー
		var $ngButtonMenu = $("<div>", {
			class: "GM_fcn_ng_menu",
			css: {
				display: "none",
			}
		});

		var $catTd = $("#cattable td");
		$catTd.each(function() {
			var $oldNgButtons = $(this).children(".GM_fcn_ng_button");
			if ($oldNgButtons.length) {
				$oldNgButtons.remove();
			}

			var $cloneNgButton = $ngButton.clone();
			var $cloneNgButtonMenu = $ngButtonMenu.clone();

			$cloneNgButton.hover(function () {
				$(this).css("color", "red");
			}, function () {
				$(this).css("color", "blue");
			});
			$cloneNgButton.on("click",function(){
				makeNgButtonMenu($(this));
			});
			$(this).hover(function () {
				$cloneNgButton.css("display", "inline");
				$cloneNgButton.siblings(".KOSHIAN_response_increase").css("display", "none");
				$cloneNgButton.siblings(".fvw_num").css("display", "none");
			}, function () {
				$cloneNgButton.css("display", "none");
				$cloneNgButtonMenu.css("display", "none");
				$cloneNgButton.siblings(".KOSHIAN_response_increase").css("display", "inline");
				$cloneNgButton.siblings(".fvw_num").css("display", "");
			});

			$cloneNgButton.append($cloneNgButtonMenu);
			$(this).append($cloneNgButton);
		});
	}

	/**
	 * NGボタンメニュー作成
	 * @param {jQuery} $button メニューを作成するNGボタンのjQueryオブジェクト
	 */
	function makeNgButtonMenu($button) {
		if (!isNgEnable) {
			return;
		}
		var $menu = $button.children(".GM_fcn_ng_menu");
		if (!$button.find(".GM_fcn_ng_menu_item").length) {
			// スレNG
			var $ngNumber = $("<div>", {
				class: "GM_fcn_ng_menu_item",
				text: "スレNG",
				css: {
					color: "blue",
					"background-color": "rgba(240, 224, 214, 0.95)",
				}
			});
			// 本文NG
			var $ngWordCommon = $("<div>", {
				class: "GM_fcn_ng_menu_item",
				text: "本文NG（共通）",
				css: {
					color: "blue",
					"background-color": "rgba(240, 224, 214, 0.95)",
				}
			});
			var $ngWordIndiv = $("<div>", {
				class: "GM_fcn_ng_menu_item",
				text: "本文NG（板別）",
				css: {
					color: "blue",
					"background-color": "rgba(240, 224, 214, 0.95)",
				}
			});
			// 画像NG
			var $ngImage = $("<div>", {
				class: "GM_fcn_ng_menu_item",
				text: "画像NG",
				css: {
					color: "blue",
					"background-color": "rgba(240, 224, 214, 0.95)",
				}
			});

			var $td = $button.parent();
			var threadNumber = $td.find("a:first").length ? $td.find("a:first").attr("href").slice(4,-4) : "";
			var threadImgObj = $td.find("img:first").length ? $td.find("img:first")[0] : "";
			var threadComment = $td.find("small:first, .GM_fth_pickuped_caption, .GM_fth_opened_caption").length ? $td.find("small:first, .GM_fth_pickuped_caption, .GM_fth_opened_caption").text() : "";

			var $cloneNgNumber = $ngNumber.clone();
			var $cloneNgWordCommon = $ngWordCommon.clone();
			var $cloneNgWordIndiv = $ngWordIndiv.clone();
			var $cloneNgImage = $ngImage.clone();

			$cloneNgNumber.hover(function () {
				$(this).css("color", "red");
				$(this).css("background-color", "rgba(204, 233, 255, 0.95)");
			}, function () {
				$(this).css("color", "blue");
				$(this).css("background-color", "rgba(240, 224, 214, 0.95)");
			});
			$cloneNgNumber.click(function () {
				addNgNumber(threadNumber);
				$td.addClass("GM_fcn_ng_numbers");
				$td.css("display","none");
				if ($td.hasClass("GM_fth_pickuped") || $td.hasClass("GM_fth_opened")) {
					hideNgThreads();
				}
			});

			$cloneNgWordCommon.hover(function () {
				$(this).css("color", "red");
				$(this).css("background-color", "rgba(204, 233, 255, 0.95)");
			}, function () {
				$(this).css("color", "blue");
				$(this).css("background-color", "rgba(240, 224, 214, 0.95)");
			});
			$cloneNgWordCommon.click(function () {
				var words = GM_getValue("_futaba_catalog_NG_words", "");
				words = addNgWord(words, threadComment);
				GM_setValue("_futaba_catalog_NG_words", words);
				$td.addClass("GM_fcn_ng_words");
				$td.css("display","none");
				if ($td.hasClass("GM_fth_pickuped") || $td.hasClass("GM_fth_opened")) {
					hideNgThreads();
				}
			});

			$cloneNgWordIndiv.hover(function () {
				$(this).css("color", "red");
				$(this).css("background-color", "rgba(204, 233, 255, 0.95)");
			}, function () {
				$(this).css("color", "blue");
				$(this).css("background-color", "rgba(240, 224, 214, 0.95)");
			});
			$cloneNgWordIndiv.click(function () {
				var words = getCurrentIndivValue("NG_words_indiv", "");
				words = addNgWord(words, threadComment);
				setIndivValue("NG_words_indiv", words);
				$td.addClass("GM_fcn_ng_words");
				$td.css("display","none");
				if ($td.hasClass("GM_fth_pickuped") || $td.hasClass("GM_fth_opened")) {
					hideNgThreads();
				}
			});

			$cloneNgImage.hover(function () {
				$(this).css("color", "red");
				$(this).css("background-color", "rgba(204, 233, 255, 0.95)");
			}, function () {
				$(this).css("color", "blue");
				$(this).css("background-color", "rgba(240, 224, 214, 0.95)");
			});
			$cloneNgImage.click(function () {
				hideNgImageThread(threadImgObj, threadComment, $td);
				if ($td.hasClass("GM_fth_pickuped") || $td.hasClass("GM_fth_opened") || USE_DHASH) {
					hideNgThreads();
				}
			});

			if (threadNumber) {
				$menu.append($cloneNgNumber);
			}
			if (threadComment) {
				$menu.append($cloneNgWordCommon);
				$menu.append($cloneNgWordIndiv);
			}
			if (threadImgObj && USE_NG_IMAGES) {
				$menu.append($cloneNgImage);
			}
		}

		var menuLeft = 0;
		var menuTop = $button.height();
		$menu.css("left", `${menuLeft}px`);
		$menu.css("top", `${menuTop}px`);
		$menu.css("display", "block");

		/**
		 * NGワード追加
		 * @param {string} ngWords 追加前のNGワード
		 * @param {string} newNgWord 追加するNGワード
		 * @return {string} 追加後のNGワード
		 */
		function addNgWord(ngWords, newNgWord) {
			newNgWord = newNgWord.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
			if (newNgWord && ngWords) {
				ngWords = newNgWord + "|" + ngWords;
			} else {
				ngWords += newNgWord;
			}
			return ngWords;
		}

		/**
		 * スレ画像NG
		 * @param {HTMLImageElement} imgObj NGにするスレ画像のimg要素
		 * @param {string} comment NG画像のコメント
		 * @param {jQuery} $td NGにするスレ画像の親td要素のjQueryオブジェクト
		 */
		function hideNgImageThread(imgObj, comment, $td) {
			var data = convertDataURI(imgObj);
			//console.log("futaba_catalog_NG - data: " + data);
			if (!data) {
				alert("スレ画像の取得に失敗しました");
				return;
			}
			var hexHash = md5(data);
			var dHash = convertDHash(imgObj, true);
			//console.log("futaba_catalog_NG - hexHash: " + hexHash);
			//console.log("futaba_catalog_NG - dHash: " + dHash.toString(16));
			addNgListObj("_futaba_catalog_NG_images", hexHash);
			addNgListObj("_futaba_catalog_NG_comment", comment);
			addNgListObj("_futaba_catalog_NG_date", getDate());
			addNgListObj("_futaba_catalog_NG_dHashes", dHash);
			if (isNgEnable) {
				$td.addClass("GM_fcn_ng_images");
				$td.css("display","none");
			}
			// 非NG画像リストからNG画像を削除
			var okImages = getCurrentIndivValue("OK_images_indiv", []);
			var imgNumber = parseInt($td.find("img").attr("src").match(/(\d+)s\.jpg$/)[1], 10);
			if (USE_DHASH) {
				// 近似画像NG使用時は非NG画像リストを全削除
				GM_setValue("OK_images_indiv", "{}");
			} else {
				var index = okImages.indexOf(imgNumber);
				if (index > -1) {
					okImages.splice(index, 1);
					setIndivValue("OK_images_indiv", okImages);
				}
			}

			/**
			 * NGリストにNGデータを追加
			 * @param {string} target NGデータを追加するNGリスト名
			 * @param {string} val NGリストへ追加するNGデータ
			 */
			function addNgListObj(target, val) {
				var ngListObj = GM_getValue(target, "");
				if (ngListObj === ""){
					ngListObj = [];
				}
				ngListObj.unshift(val);
				if (ngListObj.length > MAX_REGISTERED_NG_IMAGES) {
					ngListObj.splice(MAX_REGISTERED_NG_IMAGES);
				}
				GM_setValue(target, ngListObj);
			}
		}
	}

	/**
	 * NG番号追加
	 * @param {string} number 追加するNG番号
	 */
	function addNgNumber(number) {
		var ngNumberObj = getIndivObj("NG_numbers_indiv");
		if (ngNumberObj === ""){
			ngNumberObj = {};
		}
		if (!ngNumberObj[serverFullPath]) {
			ngNumberObj[serverFullPath] = [];
		}
		if (ngNumberObj[serverFullPath].indexOf(number) > -1) {
			return;
		}
		ngNumberObj[serverFullPath].push(number);
		var deleteCount = ngNumberObj[serverFullPath].length - MAX_NG_THREADS;
		if (deleteCount > 0) {
			ngNumberObj[serverFullPath].splice(0, deleteCount);
		}
		var jsonString = JSON.stringify(ngNumberObj);
		GM_setValue("NG_numbers_indiv", jsonString);
	}

	/**
	 * dataURI変換
	 * @param {HTMLImageElement} imgObj dataURIに変換する画像のimg要素
	 * @param {number} width 変換する画像の幅 未指定時は画像の本来の幅
	 * @param {number} height 変換する画像の高さ 未指定時は画像の本来の高さ
	 * @return {string} 変換したdataURI文字列
	 */
	function convertDataURI(imgObj, width = imgObj.naturalWidth, height = imgObj.naturalHeight){
		if (!imgObj || !imgObj.complete || !width || !height) {
			return;
		}
		// canvasを生成してimg要素を反映
		var cvs = document.createElement("canvas");
		cvs.width = width;
		cvs.height = height;
		var ctx = cvs.getContext("2d", {
			alpha: false	// 背景不透明で高速化
		});
		try {
			ctx.drawImage(imgObj, 0, 0);
		} catch (e) {
			console.error("futaba_catalog_NG - drawImage error: src= " + imgObj.src + ", " + e.name + ": " + e.message);
			console.dir(e);
			return;
		}
		// canvasをdataURI化
		var data;
		try {
			data = cvs.toDataURL("image/jpeg");
		} catch (e) {
			console.error("futaba_catalog_NG - dataURI convert error: src= " + imgObj.src + ", " + e.name + ": " + e.message);
			console.dir(e);
			return;
		}
		if (data.substr(0,23) !== "data:image/jpeg;base64,") {
			console.error("futaba_catalog_NG - dataURI abnormal: src= " + imgObj.src + ", dataURI= " + data);
			return;
		}
		return data;
	}

	/**
	 * dHash変換
	 * @param {HTMLImageElement} imgObj dHashに変換する画像のimg要素
	 * @param {boolean} force 近似画像NGが無効でも強制的にdHash変換する
	 * @return {number} 変換したdHash 0 ~ 2^49 - 1
	 *     変換できないときはnullを返す
	 *     オリジナルは64bitのHash値だがJavaScriptの最大整数値2^53に収める為49bitのHash値を返す
	 */
	function convertDHash(imgObj, force = false) {
		if ((!USE_DHASH && !force) || !imgObj || !imgObj.complete || !imgObj.naturalWidth || !imgObj.naturalHeight) {
			return null;
		}
		// 8x7のcanvasを生成してimg要素を反映
		var cvs = document.createElement("canvas");
		cvs.width = 8;
		cvs.height = 7;
		var ctx = cvs.getContext("2d", {
			alpha: false	// 背景不透明で高速化
		});
		try {
			ctx.drawImage(imgObj, 0, 0, imgObj.naturalWidth, imgObj.naturalHeight, 0, 0, cvs.width, cvs.height);
		} catch (e) {
			console.error("futaba_catalog_NG - drawImage error: src= " + imgObj.src + ", " + e.name + ": " + e.message);
			console.dir(e);
			return null;
		}
		var pixels = ctx.getImageData(0, 0, cvs.width, cvs.height);
		var grayScale = [];
		for (var y = 0; y < pixels.height; ++y) {
			for (var x = 0; x < pixels.width; ++x) {
				var i = (y * 4) * pixels.width + x * 4;
				var rgb = pixels.data[i] + pixels.data[i + 1] + pixels.data[i + 2];	// 画素をグレイスケール化
				grayScale.push(rgb);
			}
		}
		var dHash = 0;
		var exponent = 0;	// べき指数
		grayScale.forEach((v, i) => {
			if ((i + 1) % cvs.width !== 0) {	// 右端のピクセルは右隣が無いのでスキップ
				// 右隣の輝度と比較した結果を1bitとしてセット
				dHash += (v < grayScale[i + 1] ? 1 : 0) * 2 ** exponent;
				++exponent;
			}
		});
		//console.log("futaba_catalog_NG - imgObj.src: " + imgObj.src + ", dHash: 0x" + dHash.toString(16).toUpperCase());
		return dHash;
	}

	/**
	 * 日付取得
	 * @return {string} 現在の日付の文字列 yy/mm/dd
	 */
	function getDate() {
		var now = new Date();
		var date = ("" + (now.getFullYear())).slice(-2) + "/" +
			("0" + (now.getMonth() + 1)).slice(-2) + "/" +
			("0" + now.getDate()).slice(-2);
		return date;
	}

	/**
	 * カタログを検索してNGスレを非表示
	 * @param {boolean} isWordsChanged NGワードを変更したか
	 */
	function hideNgThreads(isWordsChanged) {
		if (!isNgEnable) {
			return;
		}
		var Start = new Date().getTime();//count parsing time
		var words = "";
		var wordsCommon = GM_getValue("_futaba_catalog_NG_words", "");
		var wordsIndiv = getCurrentIndivValue("NG_words_indiv", "");
		var numbers = getCurrentIndivValue("NG_numbers_indiv", []);
		images = GM_getValue("_futaba_catalog_NG_images", []);
		ngDate = GM_getValue("_futaba_catalog_NG_date", []);
		okImages = getCurrentIndivValue("OK_images_indiv", []);
		dHashes = GM_getValue("_futaba_catalog_NG_dHashes", []);

		// NGワード
		if( wordsCommon !== "" ) {
			words += wordsCommon;
			if( wordsIndiv !== "" ) {
				words += "|" + wordsIndiv;
			}
		}
		else {
			words += wordsIndiv;
		}
		//console.log(words);
		//console.dir(numbers);
		//console.dir("futaba_catalog_NG - images.length: " + images.length);
		try {
			var re = new RegExp(words, "i");
		}
		catch (e) {
			alert("NGワードのパターンが無効です\n\n" + e);
			editNgWords();
			return;
		}
		if (isWordsChanged) {
			$(".GM_fcn_ng_words").css("display", "");
			$(".GM_fcn_ng_words").removeClass("GM_fcn_ng_words");
		}
		if (words !== "") {
			$("#cattable td small").each(function() {
				if (re.test($(this).text())) {
					if ($(this).parent("a").length) {		//文字スレ
						$(this).parent().parent("td").addClass("GM_fcn_ng_words");
						$(this).parent().parent("td").css("display", "none");
					} else {
						$(this).parent("td").addClass("GM_fcn_ng_words");
						$(this).parent("td").css("display", "none");
					}
					//console.log("futaba catalog NG - caption: " + $(this).text() + " NG word: " + $(this).text().match(re)[0]);
				}
			});
		}
		if (isWordsChanged) {
			console.log("futaba_catalog_NG - Parsing@" + serverFullPath + ": "+((new Date()).getTime()-Start) +"msec");	// eslint-disable-line no-console
			return;
		}

		// NG番号
		if (numbers.length) {
			var $catAnchors = $("#cattable td[class!='GM_fcn_ng_words'] > a:first-of-type");
			$catAnchors.each(function() {
				var hrefNum = $(this).attr("href").slice(4,-4);
				if (numbers.indexOf(hrefNum) > -1){
					$(this).closest("td, .cs").addClass("GM_fcn_ng_numbers");
					$(this).closest("td, .cs").css("display", "none");
				}
			});
		}

		// NG画像
		if (USE_NG_IMAGES) {
			if (images.length) {
				var $catImages = $("#cattable td:not([class^='GM_fcn_ng_']) > a:first-of-type > img");
				$catImages.each(function() {
					var $td = $(this).closest("td");
					var imgSrc = this.src.match(/(\d+)s\.jpg$/);
					if (imgSrc) {
						var imgNumber = parseInt(imgSrc[1], 10);
						if (okImages.indexOf(imgNumber) == -1) {
							var data = convertDataURI(this);
							if (data) {
								var hexHash = md5(data);
								var index = images.indexOf(hexHash);
								if (index > -1){
									$td.addClass("GM_fcn_ng_images");
									$td.css("display", "none");
									ngDate[index] = getDate();
									if (dHashes[index] == null) {
										dHashes[index] = convertDHash(this, true);
									}
								} else {
									var isError = false;	// md5変換エラーフラグ
									if (hexHash.length !== 32) {
										isError = true;
										console.error("futaba_catalog_NG - hexHash abnormal: image No." + imgNumber + ", hexHash: " + hexHash);	// eslint-disable-line no-console
									}
									// dHash判定
									var distance, dHash = convertDHash(this);
									[index, distance] = findIndexOfDHashes(dHash);
									if (index > -1) {
										if (ENABLE_DHASH_TEST) {
											$(this).addClass("GM_fcn_ng_dhash_img");
											$td.children(".GM_fcn_ng_button").attr("title", "distance: " + distance + ", dHash: " + ("000000000000" + dHash.toString(16)).slice(-13));
											$td.addClass("GM_fcn_ng_dhash_td");
										} else {
											$td.addClass("GM_fcn_ng_images");
											$td.css("display", "none");
										}
										ngDate[index] = getDate();
									} else if (!isError) {
										okImages.unshift(imgNumber);
									}
								}
							} else {
								// スレ画像読込完了確認
								this.onload = () => {
									this.onload = null;
									var imgNumber = parseInt(this.src.match(/(\d+)s\.jpg$/)[1], 10);
									var data = convertDataURI(this);
									if (data) {
										var hexHash = md5(data);
										var index = images.indexOf(hexHash);
										if (index > -1){
											$td.addClass("GM_fcn_ng_images");
											$td.css("display", "none");
											ngDate[index] = getDate();
											GM_setValue("_futaba_catalog_NG_date", ngDate);
											if (dHashes[index] == null) {
												dHashes[index] = convertDHash(this, true);
												GM_setValue("_futaba_catalog_NG_dHashes", dHashes);
											}
										} else {
											var isError = false;	// md5変換エラーフラグ
											if (hexHash.length !== 32) {
												isError = true;
												console.error("futaba_catalog_NG - hexHash abnormal: image No." + imgNumber + ", hexHash: " + hexHash);
											}
											// dHash判定
											var distance, dHash = convertDHash(this);
											[index, distance] = findIndexOfDHashes(dHash);
											if (index > -1) {
												if (ENABLE_DHASH_TEST) {
													$(this).addClass("GM_fcn_ng_dhash_img");
													$td.children(".GM_fcn_ng_button").attr("title", "distance: " + distance + ", dHash: " + ("000000000000" + dHash.toString(16)).slice(-13));
													$td.addClass("GM_fcn_ng_dhash_td");
												} else {
													$td.addClass("GM_fcn_ng_images");
													$td.css("display", "none");
												}
												ngDate[index] = getDate();
												GM_setValue("_futaba_catalog_NG_date", ngDate);
											} else if (!isError) {
												okImages.unshift(imgNumber);
											}
										}
									} else {
										console.error("futaba_catalog_NG - image data abnormal: image No." + imgNumber);
									}
								};
								if (this.complete && this.width && this.height && this.onload) {
									// onloadセット中に画像読込完了していたらloadをトリガーする
									$(this).trigger("load");
								}
							}
						}
					}
				});
				GM_setValue("_futaba_catalog_NG_date", ngDate);
				GM_setValue("_futaba_catalog_NG_dHashes", dHashes);
				if (okImages.length > MAX_OK_IMAGES) {
					okImages.splice(MAX_OK_IMAGES);
				}
				setIndivValue("OK_images_indiv", okImages);
			} else {
				var $catImg = $("#cattable td a img");
				$catImg.each(function() {
					var imgSrc = this.src.match(/(\d+)s\.jpg$/);
					if (imgSrc) {
						var imgNumber = parseInt(imgSrc[1], 10);
						if (okImages.indexOf(imgNumber) == -1) {
							okImages.unshift(imgNumber);
						}
					}
				});
				if (okImages.length > MAX_OK_IMAGES) {
					okImages.splice(MAX_OK_IMAGES);
				}
				setIndivValue("OK_images_indiv", okImages);
			}
		}
		//console.log("futaba_catalog_NG - okImages.length: " + okImages.length);
		console.log("futaba_catalog_NG - Parsing@" + serverFullPath + ": " + ((new Date()).getTime() - Start) + "msec");	// eslint-disable-line no-console

		/**
		 * dHashリストのインデックス探索
		 * @param {number} dHash 近似画像NG判定する画像のdHash値
		 * @return {Array.<number>} [i, distance]
		 *     {number} i 近似度が閾値以下のdHashリスト(dHashes)配列内のインデックス
		 *     {number} distance ハミング距離
		 *     dHashリストに該当が無ければi, distance共に-1を返す
		 */
		function findIndexOfDHashes(dHash) {
			if (dHash != null) {
				for (var i = 0, num = dHashes.length; i < num; ++i) {
					if (dHashes[i]) {
						var distance = getHammingDistance(dHash, dHashes[i]);
						if (distance <= DISTANCE_THRESHOLD) {
							if (ENABLE_DHASH_TEST) {
								console.debug("futaba_catalog_NG - catalog dHash: " + ("000000000000" + dHash.toString(16)).slice(-13) + ", NG list dHash: " + ("000000000000" + dHashes[i].toString(16)).slice(-13));
								console.debug("futaba_catalog_NG - hamming distance: " + distance);
							}
							return [i, distance];
						}
					}
				}
			}
			return [-1, -1];
		}

		/**
		 * ハミング距離取得
		 * @param {number} hash1 測定するHash(49bit)
		 * @param {number} hash2 測定するHash(49bit)
		 * @return {number} ハミング距離(0～49)
		 */
		function getHammingDistance(hash1, hash2) {
			// 2つのHashを上位17bitと下位32bitに分割して32ビット演算する
			var hash1L = hash1 >>> 0;
			var hash1H = (hash1 - hash1L) / 0x100000000;
			var hash2L = hash2 >>> 0;
			var hash2H = (hash2 - hash2L) / 0x100000000;

			// 下位32bitのビットの異なる位置を抽出
			var xorL = hash1L ^ hash2L;
			var count = 0;
			// 立っている最下位ビットを消してカウント
			while (xorL) {
				xorL &= xorL - 1;
				++count;
			}

			// 上位17bitのビットの異なる位置を抽出
			var xorH = hash1H ^ hash2H;
			// 立っている最下位ビットを消してカウント
			while (xorH) {
				xorH &= xorH - 1;
				++count;
			}

			return count;
		}
	}

	/**
	 * KOSHIAN del イベント監視
	 */
	function listenKoshianDelEvent() {
		$(document).on("KOSHIAN_del", () => {
			// delされたスレをNG登録して非表示
			$(".KOSHIAN_del").each(function() {
				var threadNumber = $(this).find("a:first").length ? $(this).find("a:first").attr("href").slice(4,-4) : "";
				if (threadNumber) {
					addNgNumber(threadNumber);
				}
				if (isNgEnable) {
					$(this).addClass("GM_fcn_ng_numbers");
					$(this).css("display", "none");
				}
				$(this).removeClass("KOSHIAN_del");
			});
			hideNgThreads();
		});
	}

	/**
	 * futaba thread highlighter K ピックアップイベント監視
	 */
	function listenFthPickupEvent() {
		$(document).on("FutabaTH_pickup", () => {
			// ピックアップされたスレにNGボタンをセット
			$(".GM_fth_pickuped, .GM_fth_opened").each(function() {
				var $ngButton = $(this).find(".GM_fcn_ng_button");
				if ($ngButton.length) {
					var $ngButtonMenu = $ngButton.children(".GM_fcn_ng_menu");
					$ngButton.hover(function() {
						$(this).css("color", "red");
					}, function () {
						$(this).css("color", "blue");
					});
					$ngButton.on("click",function() {
						makeNgButtonMenu($ngButton);
					});
					$(this).hover(function () {
						$ngButton.css("display", "inline");
						$ngButton.siblings(".KOSHIAN_response_increase").css("display", "none");
						$ngButton.siblings(".fvw_num").css("display", "none");
					}, function () {
						$ngButton.css("display", "none");
						$ngButtonMenu.css("display", "none");
						$ngButton.siblings(".KOSHIAN_response_increase").css("display", "inline");
						$ngButton.siblings(".fvw_num").css("display", "");
					});
				}
			});
		});
	}

	/**
	 * カタログ非表示
	 */
	function hideCatalog() {
		setCatalogHiddenStyle();
		$(function() {
			$("body").attr("__fcn_catalog_visibility", "hidden");
			$("#GM_fth_highlighted_threads").css("visibility", "hidden");
			init();
		});
		$(window).on("load", function() {
			$("body").attr("__fcn_catalog_visibility", "visible");
			setCatalogShownStyle();
			$("#GM_fth_highlighted_threads").css("visibility", "visible");
		});
	}

	/**
	 * カタログ非表示スタイル設定
	 */
	function setCatalogHiddenStyle() {
		var css =
			"#cattable {" +
			"  opacity: 0;" +
			"}";
		GM_addStyle(css);
	}

	/**
	 * カタログ表示スタイル設定
	 */
	function setCatalogShownStyle() {
		var css =
			"#cattable {" +
			"  opacity: 1;" +
			"}";
		GM_addStyle(css);
	}

	/**
	 * スタイル設定
	 */
	function setStyle() {
		var css =
			// NGワード
			".GM_fcn_ng_words {" +
			"  display: none;" +
			"}" +
			// NG番号
			".GM_fcn_ng_numbers {" +
			"  display: none;" +
			"}" +
			// NG画像
			".GM_fcn_ng_images {" +
			"  display: none;" +
			"}" +
			// 近似画像NGスレ
			".GM_fcn_ng_dhash_td {" +
			"  background-color: #e1b2ec;" +
			"  opacity: 0.2;" +
			"}" +
			".GM_fcn_ng_dhash_td:hover {" +
			"  opacity: 1;" +
			"}" +
			// 近似NG画像
			".GM_fcn_ng_dhash_img {" +
			"  opacity: 0.2;" +
			"}" +
			".GM_fcn_ng_dhash_img:hover {" +
			"  opacity: 1;" +
			"}" +
			// NGボタン
			".GM_fcn_ng_button {" +
			"  position: relative;" +
			"  font-size: 12px;" +
			"  cursor: pointer;" +
			"}" +
			// NGメニュー
			".GM_fcn_ng_menu {" +
			"  font-size: medium;" +
			"  background-color: rgba(240, 192, 214, 0.95);" +
			"  z-index: 203;" +
			"  position: absolute;" +
			"  min-width: 140px;" +
			"  width: auto;" +
			"  border: 1px outset;" +
			"  border-radius: 5px;" +
			"  padding: 5px;" +
			"}" +
			// NGメニュー項目
			".GM_fcn_ng_menu_item {" +
			"  padding: 5px;" +
			"  z-index: 203;" +
			"  cursor: pointer;" +
			"}" +
			// NGリストラベル
			".GM_fcn_ng_list_label {" +
			"  display: inline-block;" +
			"  width: 100px;" +
			"}" +
			// NGリスト入力
			".GM_fcn_ng_list_input {" +
			"  width: 360px;" +
			"  margin-right: 16px;" +
			"  font-size: 16px;" +
			"}" +
			// NGリスト編集ボタン
			".GM_fcn_ng_list_edit_button {" +
			"  width: 70px;" +
			"  margin-right: 16px;" +
			"}" +
			// NGリスト移動ボタン
			".GM_fcn_ng_list_move_button {" +
			"  margin-right: 16px;" +
			"}" +
			// NGリスト枠
			"#GM_fcn_ng_list_pane {" +
			"  width: 928px;" +
			"  height: 308px;" +
			"  margin-left: 11px;" +
			"  border-width: 1px;" +
			"  border-style: solid;" +
			"  background-color: #eee;" +
			"}" +
			// NGリスト項目行
			"#GM_fcn_ng_list_item_row {" +
			"  display: inline-block;" +
			"  height: 22px;" +
			"  overflow: hidden;" +
			"  white-space: nowrap;" +
			"}" +
			// NGリスト項目md5
			"#GM_fcn_ng_list_item_md5 {" +
			"  width: 360px;" +
			"}" +
			// NGリスト項目dHash
			"#GM_fcn_ng_list_item_dHash {" +
			"  width: 170px;" +
			"}" +
			// NGリスト項目コメント
			"#GM_fcn_ng_list_item_comment {" +
			"  width: 250px;" +
			"}" +
			// NGリスト項目最終検出日
			"#GM_fcn_ng_list_item_date {" +
			"  width: 130px;" +
			"}" +
			// NGリスト項目スクロールバースペース
			"#GM_fcn_ng_list_item_scrl {" +
			"  width: 18px;" +
			"}" +
			// NGリスト項目
			".GM_fcn_ng_list_item {" +
			"  display: inline-block;" +
			"  height: 22px;" +
			"  border-width: 1px;" +
			"  border-style: solid;" +
			"  box-sizing: border-box;" +
			"  overflow: hidden;" +
			"  white-space: nowrap;" +
			"  text-overflow: clip;" +
			"  cursor: pointer;" +
			"}" +
			// NGリストコンテンツ
			"#GM_fcn_ng_list_content {" +
			"  width: 928px;" +
			"  height: 286px;" +
			"  overflow-x: hidden;" +
			"  overflow-y: auto;" +
			"}" +
			// NGリスト行
			".GM_fcn_ng_list_row {" +
			"  width: 928px;" +
			"  height: 22px;" +
			"  cursor: pointer;" +
			"  overflow: hidden;" +
			"  white-space: nowrap;" +
			"}" +
			// NGリスト画像
			".GM_fcn_ng_list_image {" +
			"  display: inline-block;" +
			"  width: 360px;" +
			"  height: 22px;" +
			"  border-width: 1px;" +
			"  border-style: solid;" +
			"  box-sizing: border-box;" +
			"  overflow: hidden;" +
			"  white-space: nowrap;" +
			"  text-overflow: ellipsis;" +
			"  font-family: Consolas, 'Courier New', monospace;" +
			"}" +
			// NGリストdHash
			".GM_fcn_ng_list_dHash {" +
			"  display: inline-block;" +
			"  width: 170px;" +
			"  height: 22px;" +
			"  border-width: 1px;" +
			"  border-style: solid;" +
			"  box-sizing: border-box;" +
			"  overflow: hidden;" +
			"  white-space: nowrap;" +
			"  text-overflow: ellipsis;" +
			"  font-family: Consolas, 'Courier New', monospace;" +
			"}" +
			// NGリストコメント
			".GM_fcn_ng_list_comment {" +
			"  display: inline-block;" +
			"  width: 250px;" +
			"  height: 22px;" +
			"  padding-left: 10px;" +
			"  border-width: 1px;" +
			"  border-style: solid;" +
			"  box-sizing: border-box;" +
			"  text-align: left;" +
			"  overflow: hidden;" +
			"  white-space: nowrap;" +
			"  text-overflow: ellipsis;" +
			"}" +
			// NGリスト日時
			".GM_fcn_ng_list_date {" +
			"  display: inline-block;" +
			"  width: 130px;" +
			"  height: 22px;" +
			"  border-width: 1px;" +
			"  border-style: solid;" +
			"  box-sizing: border-box;" +
			"  overflow: hidden;" +
			"  white-space: nowrap;" +
			"  text-overflow: ellipsis;" +
			"  font-family: Consolas, 'Courier New', monospace;" +
			"}" +
			// NGリストスクロールバー
			".GM_fcn_ng_list_scrl {" +
			"  display: inline-block;" +
			"  width: 18px;" +
			"  height: 22px;" +
			"  border-width: 0px 1px;" +
			"  border-style: solid;" +
			"  box-sizing: border-box;" +
			"  overflow: hidden;" +
			"  white-space: nowrap;" +
			"}" +
			// カタログ下スペース
			"#GM_fcn_catalog_space {" +
			"  min-height: 2000px;" +
			"}" +
			// futaba thread highlighter ピックアップ
			".GM_fth_pickuped {" +
			"  overflow: visible !important;" +
			"}" +
			// futaba thread highlighter 既読
			".GM_fth_opened {" +
			"  overflow: visible !important;" +
			"}" +
			// ふたクロNGボタン
			".fvw_ng {" +
			"  display: none !important;" +
			"}" +
			// スレのプルダウンメニューボタン用スペース
			"#cattable > tbody > tr > td {" +
			"  padding-bottom: 12px !important;" +
			"}";
		GM_addStyle(css);
	}

})(jQuery);

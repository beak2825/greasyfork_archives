// ==UserScript==
// @name        futaba_new_res_counter
// @namespace   https://github.com/akoya-tomo
// @description ふたクロでタブに新着レス数を表示する
// @include     http://*.2chan.net/*/res/*
// @include     https://*.2chan.net/*/res/*
// @version     1.1.0
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/37021/futaba_new_res_counter.user.js
// @updateURL https://update.greasyfork.org/scripts/37021/futaba_new_res_counter.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

(function ($) {
	/*
	 *	設定
	 */
	// ==================================================
	var USE_BOARD_NAME = false;		//タブに板名を表示する
	// ==================================================

	var script_name = "futaba_new_res_counter";
	var res = 0;	//新着レス数
	var server_name = document.domain.match(/^[^.]+/);
	var board_name = $("#tit").text().match(/^[^＠]+/);
	var has_boader_area = false;

	init();

	function init(){
		if (!isFileNotFound()) {
			setTitle();
			checkFutakuroReload();
			checkThreadDown();
		}
		resetTitle();
	}

	/*
	 * 404チェック
	 */
	function isFileNotFound() {
		if (document.title == "404 File Not Found") {
			return true;
		}
		else {
			return false;
		}
	}

	/*
	 * ふたクロの新着の状態を取得
	 */
	function checkFutakuroReload() {
		var target = $(".thre").get(0);
		var config = { childList: true };
		var observer = new MutationObserver(function(mutations) {
			var has_new_res = false;
			mutations.forEach(function(mutation) {
				var $nodes = $(mutation.addedNodes);
				//console.log(script_name + ":added nodes =");
				//console.dir($nodes);
				if ($nodes.length) {
					has_new_res = true;
				}
			});
			if (has_new_res) {
				changeTitle();
			}
			if (!has_boader_area) {
				checkThreadDown();
			}
		});
		observer.observe(target, config);
	}

	/*
	 * タブに新着レス数・スレ消滅状態を表示
	 */
	function changeTitle() {
		var newres = $(".nb_left:last").text().match(/(\d+)件の新着レス/);	// ふたクロの新着レス数取得
		if (newres) {
			res += parseInt(newres[1]);
		}
		if (res !== 0) {
			document.title = "(" + res + ")" + titleName();
		}
	}

	/*
	 * ふたクロのステータスからスレ消滅状態をチェック
	 */
	function checkThreadDown() {
		var target = $("#border_area").get(0);
		if (target) {
			setThreadDownObserver(target);
			has_boader_area = true;
		}

		function setThreadDownObserver(target) {
			var config = { childList: true };
			var observer = new MutationObserver(function() {
				if ($("#thread_down").length) {
					document.title = "#" + titleName();
				}
			});
			observer.observe(target, config);
		}
	}

	function titleName() {
		var title = document.title;
		var title_num = title.match(/^(#|\(\d+\))/);
		var title_num_length;
		if (!title_num) {
			title_num_length = 0;
		}
		else {
			title_num_length = title_num[0].length;
		}
		var act_title_name = title.substr(title_num_length);
		return act_title_name;
	}

	/*
	 * 新着レスをリセット
	 */
	function resetTitle() {
		// ページ末尾でホイールダウンした時
		window.onwheel = function(event){
			// Windowsで拡大率使用時にwindow_yが小数点以下でずれる対応
			var window_y = Math.ceil($(window).height() + $(window).scrollTop());
			var window_ymax = $(document).height();
			//console.log(script_name + ": window_y,yamx,deltaY: " + window_y +',' + window_ymax + ',' + event.deltaY);
			if (event.deltaY > 0 && window_y >= window_ymax ) {
				resetTitlename();
			}
			return;
		};

		function resetTitlename() {
			res = 0;
			var title_char = titleName();
			document.title = title_char;
		}
	}

	/*
	 * タイトル設定
	 */
	// タイトルに板名を追加する
	function setTitle() {
		if (USE_BOARD_NAME) {
			if (board_name == "二次元裏") {
				board_name = server_name;
			}
			document.title = board_name + " " + document.title;
		}
	}

})(jQuery);

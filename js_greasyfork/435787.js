// ==UserScript==
// @name        futaba lightbox
// @namespace   https://github.com/himuro-majika
// @description ふたばの画像表示をギャラリー風にしちゃう
// @author      himuro_majika
// @include     http://*.2chan.net/*/res/*
// @include     https://*.2chan.net/*/res/*
// @include     http://board.futakuro.com/*/res/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js
// @require     https://cdn.jsdelivr.net/npm/fancybox@2.1.5/lib/jquery.mousewheel.pack.js
// @require     https://cdn.jsdelivr.net/npm/fancybox@2.1.5/dist/js/jquery.fancybox.js
// @resource    fancyboxCSS https://cdn.jsdelivr.net/npm/fancybox@2.1.5/dist/css/jquery.fancybox.css
// @resource    fancyboxSprite https://cdn.jsdelivr.net/npm/fancybox@2.1.5/dist/img/fancybox_sprite.png
// @version     1.4.0
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// @grant       GM_addStyle
// @license     MIT
// @noframes
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAPUExURYv4i2PQYy2aLUe0R////zorx9oAAAAFdFJOU/////8A+7YOUwAAAElJREFUeNqUj1EOwDAIQoHn/c88bX+2fq0kRsAoUXVAfwzCttWsDWzw0kNVWd2tZ5K9gqmMZB8libt4pSg6YlO3RnTzyxePAAMAzqMDgTX8hYYAAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/435787/futaba%20lightbox.user.js
// @updateURL https://update.greasyfork.org/scripts/435787/futaba%20lightbox.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);

(function($) {
	/*
	 * 設定
	 */
	// 閉じるボタンを表示する
	var USE_CLOSEBTN = false;
	// 末尾から先頭にループさせる
	var USE_LOOP = false;
	// マウスホイールでのナビゲーションを使用する
	var USE_MOUSEWHEEL = true;
	// 該当レスにスクロールする
	var USE_SCROLL = true;
	// スクロールのなめらかさ
	var SCROLL_DURATION = 100;
	// 動画の幅
	var VIDEO_WIDTH = 1280;
	// 動画の高さ
	var VIDEO_HEIGHT = 720;
	// 動画の自動再生
	var VIDEO_AUTOPLAY = false;


	var options;
	var currentidx;
	var reopenflag = false;

	init();

	function init() {
		// var Start = new Date().getTime();//count parsing time
		add_class_and_rel();
		add_css();
		setup_fancybox();
		setKeyDownEvent();
		// console.log('Parsing : '+((new Date()).getTime()-Start) +'msec');//log parsing time
	}
	// スレ内の画像にクラス、rel属性を付加する
	function add_class_and_rel() {
		var FUTAKURO = false, FUTABOARD = false;
		// 赤福が有効か
		setTimeout(function() {
			if ($("#akahuku_thumbnail").length) {
				removeAkahukuThrop();
			}
		}, 5000)

		// ふたクロが有効か
		if ($("#master").length) { FUTAKURO = true; }
		// futaboardか
		if ($("#threadsbox").length) { FUTABOARD = true; }
		add_class_and_rel_Thread();
		add_class_and_rel_Res();
		observeInserted();
		// スレ画
		function add_class_and_rel_Thread() {
			var $sure_a = $(".thre").length ?
				$(".thre > a > img").parent() :
				$("body > form > a > img").parent();
			if (FUTAKURO) { // ふたクロ
				$sure_a = $("#master > a > img").parent();
			}
			if (FUTABOARD) { // futaboard
				$sure_a = $(".d7 > a > img").parent();
			}
			if($(".c9-1").length) {
				$sure_a = $(".c9-1").parent();
			}
			addAttr($sure_a);
		}
		// レス画像
		function add_class_and_rel_Res() {
			//  var Start = new Date().getTime();//count parsing time
			var $res_a = $(".rtd > a > img").parent();
			if (FUTABOARD) { // futaboard
				$res_a = $(".d6 > table img").parent();
			}
			if($(".c9-10").length) {
				$res_a = $(".c9-10 a > img").parent();
			}
			addAttr($res_a);
			//  console.log('Parsing : '+((new Date()).getTime()-Start) +'msec');//log parsing time
		}
		// 続きを読むで挿入される要素を監視
		function observeInserted() {
			var target = $(".thre").length ?
				$(".thre").get(0) :
				$("html > body > form[action]:not([enctype])").get(0);
			if (FUTABOARD) {
				target = $(".d6").get(0); // futaboard
			}
			if($(".c9-1").length) return;
			var observer = new MutationObserver(function(mutations) {
				var imgEle;
				mutations.forEach(function(mutation) {
					var $nodes = $(mutation.addedNodes);
					var $res_a_inserted = $nodes.find("td > a > img");
					if ($res_a_inserted.length > 0) {
						imgEle = $res_a_inserted;
						addAttr($res_a_inserted.parent());
					}
				});
				if (imgEle && imgEle.length > 0) {
					var video = getIframeVideo();
					if (video.length == 0 || (!VIDEO_AUTOPLAY && video[0].paused)) reopenFancybox();
				}
			});
			observer.observe(target, { childList: true });
		}
		// ノードにクラス、属性を付加
		function addAttr(node) {
			node.addClass("futaba_lightbox");
			node.attr("rel", "futaba_lightbox_gallery");
			// 動画
			node.each(function() {
				if ($(this).attr("href").match(/\.(webm|mp4)$/)) {
					$(this).addClass("fancybox.html");
				}
			})
		}
	}
	// 赤福操作パネル対策
	function removeAkahukuThrop() {
		var $attb = $("#akahuku_throp_thumbnail_button");
		if ($attb.length) {
			removeAttr($attb);
		}
	}
	// ノードからfancyboxクラス、属性を削除
	function removeAttr(node) {
		node.removeClass("futaba_lightbox");
		node.attr("rel", "");
	}
	// CSSを設定
	function add_css() {
		var css = GM_getResourceText("fancyboxCSS");
		GM_addStyle(css);
		var sprite = GM_getResourceURL("fancyboxSprite");
		GM_addStyle(
			"#fancybox-loading, .fancybox-close, .fancybox-prev span, .fancybox-next span {" +
			"  background-image: url(" + sprite + ");" +
			"}" +
			"#fancybox-loading div {" +
			"  display: none;" +
			"}" +
			".fancybox-nav {" +
			"  background: transparent;" +
			"  width: 45%;" +
			"  height: 90%;" +
			"}" +
			// ふたクロ書き込みウィンドウ対応
			".fancybox-opened {" +
			"  z-index: 2000000016;" +
			"}" +
			// 画像一覧
			".futaba_lightbox_image_list_overlay img {" +
			"  margin: 0;" +
			"  box-shadow: 0 0 15px 5px #222;" +
			"}" +
			".futaba-lightbox-image-list-view-button:hover div {" +
			"  visibility: visible;" +
			"}" +
			".futaba-lightbox-image-list-view-button div {" +
			"  visibility: hidden;" +
			"  margin: 20px auto;" +
			"  width: 32px;" +
			"  height: 32px;" +
			"  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAACXBIWXMAAAsTAAALEwEAmpwYAAADMElEQVRIiZ2VXWhbZRyHn3NykjT9sEvV0tXWacXPihO9qDqFwdAhKluHdHrj9ELoovNCVKjWL5h4oWU3onjjqMjEiRMJIgiK4DqGboN2sxsZTrtsadOs7dYkS2tO+vOibz6XudT//+L9cd73eU7O4T1vLKqUermL+2hnNSlinOIn9lqZaivBqkAd+gnp9jEOEmOSRtrpYgPNsJuw9W11SRF/Sn/MaEA3iLL2aqN+0JLcL6LByluW4h/nNKRVFXCxN2hcuUi8B7uqROGkNl0WXu4mheXGYo/huUShj5K65wo4QpaGlY3+cgdOmUJ9OfXWgCPk04gyR2kqUcijY7tqxBFq0wWdGKABOy8IzSpoJoOaNf2cGT/XTpMGC4q3lI4+fCN+LLCB0BBzhW0RNO03YwMBk+oKjzxEpuPdbQSwwVavuvdcYX9UVpownY9wFV6wufMYf61QAN/RcT9B/ODwwIEy9zaTfjPpLClGAThesm4E+OChV+NccGiPlUw0MGzSdj4BYB9/8zIA7/F7YV2CLC3XEwCbtqkVPwBAnOZW/GCz6P9fgjpSwgsOsfbO4uUlxk06b9IZpk1KlOBeriZxERscJtb0FCcy7DJpzKQJkswAmFe5XGuwOBIHQM9Pyy7ssRblq9+M32jIpJ0l2/lFzc3zDN1gs+9a1q34DWzi0Aky/AO2NcNXoRXit7GegxFSLIAD7O3b+iGHAcgSNotOm3SYuEmRguB9Tp5+cz/nyR+02e8PyKn5c35USxrcw5PcSqMRnL3JjX5aI36L5vTzKP08SBu+/G+yElvcqXdqwLsU0fEor/AEN9NYOFIAz/RL2fiXqvtPfL3OKXKm9W36WEtL+blo4Rt9fCH6p56+DHydPpOrkXFeYyv30rp8HpWWhW9758Rud3FMb6i7BK3XFg0rrVNTg1+zg83cXYpbZQov9c927Qh1bVzVkWTS/LW1YuvIyR+Pvv4r54gRI0GaLEKVArDw4KeRlhfWrutpWt18TcqdnJ9ODhwiwzyzzDDLPAu4y/ClArCwcPBRTwMBAviwWSLLAhdJk2GxeO/qgrzExoODg42NyJEjh0uuHAb4F7CMKxAZTkkkAAAAAElFTkSuQmCC);" +
			"}" +
			".futaba-lightbox-image-list-view-button {" +
			"  cursor: pointer;" +
			"  position: absolute;" +
			"  top: 0;" +
			"  width: 100%;" +
			"  height: 60px;" +
			"}"
		);
	}
	// fancyboxの設定
	function setup_fancybox() {
		options = {
			autoSize: false,
			width: VIDEO_WIDTH,	//動画の幅
			height: VIDEO_HEIGHT,	//動画の高さ
			minWidth : 300, // 画像の最小幅
			margin: 15, //画像外側のスペース
			padding: 5, //画像内側のスペース(白枠部)
			openEffect: "none", //開く時のエフェクト
			closeEffect: "none", //閉じる時のエフェクト
			prevEffect: "none", //次移動時のエフェクト
			nextEffect: "none", //前移動時のエフェクト
			preload: 3, //プリロードする画像の数
			mouseWheel: USE_MOUSEWHEEL,
			closeBtn: USE_CLOSEBTN, //閉じるボタン
			loop: USE_LOOP, //末尾から先頭へのループ
			helpers: {
				overlay: {
					speedOut: 100, //閉じる時の背景のフェード時間
					// showEarly : false,
					fixed: false, //固定表示(falseでスクロール可能)
					css: {
						// "background" : "rgba(0,0,0,0.85)"     //背景色
						"background": "none",
						"z-index": "2000000015"
					}
				}
			},
			// テンプレート
			tpl: {
				wrap: '<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div>' +
				'<div title="画像一覧" class="futaba-lightbox-image-list-view-button"><div></div>' +
				'</div></div></div>',
				image: '<a href="{href}" target="_blank"><img class="fancybox-image" src="{href}" alt="" /></a>',
				error: '<p class="fancybox-error">画像がないよ<br>すでに削除されてるかも</p>',
				next: '<a title="次" class="fancybox-nav fancybox-next"><span></span></a>',
				prev: '<a title="前" class="fancybox-nav fancybox-prev"><span></span></a>'
			},
			// 読み込み前
			beforeLoad: function() {
				if (this.element[0].id == "akahuku_throp_thumbnail_button") {
					removeAkahukuThrop();
					return false;
				}
			},
			// 画像読み込み後イベント
			afterLoad: function(current, previous) {
				// 動画
				if (current.type == "html") {
					var ext = current.href.match(/\.(webm|mp4)$/)[1];
					var autoplay = VIDEO_AUTOPLAY ? "autoplay=''" : "";
					var videohtml = "<video " + autoplay + " controls='' style='width: 100%; height: 100%; background-color: #000;' class='extendWebm'>";
					if (ext == "webm") {
						videohtml += "<source src='" + current.href + "' type='video/webm'>";
					}
					videohtml += "<source src='" + current.href + "' type='video/mp4'></video>";
					current.content = videohtml;
					//デフォルトのプレイヤーを閉じる
					var cancelbutton = $(current.element[0]).parent().find(".cancelbk");
					var event = new Event("click");
					if (cancelbutton[0]) {
						cancelbutton[0].dispatchEvent(event);
					}
				}
				makeImageListButton();

				currentidx = current.index;
				if (USE_SCROLL) {
					if (reopenflag) {
						reopenflag = false;
					} else {
						scrollToRes(current.href);
					}
				}
			}
		};

		$(".futaba_lightbox").fancybox(options);

		// ギャラリー表示中の画像を含むレスにスクロール
		function scrollToRes(currenthref) {
			var $img_a = $(".futaba_lightbox[href='" + currenthref + "']").parent();
			if ($img_a.length) {
				var img_position = $img_a.offset().top;
				$("html,body").animate({
					scrollTop: img_position
				}, {
					duration: SCROLL_DURATION,
					queue: false
				});
				// $("html,body").scrollTop(img_position);
			}
		}
	}

	function getIframeVideo() {
		var video = $(".fancybox-opened video")
		return video;
	}

	function reopenFancybox() {
		if ($(".fancybox-opened").length == 0) return;

		var group = $(".futaba_lightbox");
		options.index = currentidx;
		reopenflag = true;

		$.fancybox.open(group, options);
	}

	function makeImageListButton() {
		var button = $(".futaba-lightbox-image-list-view-button");
		button.click(() => {
			showImageListView();
		});
	}

	function showImageListView() {
		closeImageListView();
		$.fancybox.close();
		var imageList = $(".thre a img").parent().clone();
		imageList.attr("rel", "futaba_lightbox_image_list");
		// imageList.each(() => {
		// 	$(this).css({
		// 		"flex": "auto"
		// 	})
		// })
		var imageListContainer = $("<div>");
		imageListContainer.addClass("futaba_lightbox_image_list_container");
		imageListContainer.css({
			"width": "auto",
			"height": "100%",
			"overflow-y": "scroll",
			"padding": "35px 25px",
			"display": "flex",
			"flex-wrap": "wrap",
			"justify-content": "space-around",
			"align-items": "center",
			"row-gap": "20px",
			"column-gap": "20px"
		});
		imageListContainer.click((event) => {
			if ($(event.target)[0].className == "futaba_lightbox_image_list_container") {
				closeImageListView();
			}
		});
		imageListContainer.append(imageList);

		var imageListOverLay = $("<div>");
		imageListOverLay.addClass("futaba_lightbox_image_list_overlay");
		imageListOverLay.css({
			"position": "fixed",
			"top": "0",
			"bottom": "0",
			"left": "0",
			"right": "0",
			"background": "rgba(0, 0, 0, 0.8)",
			"z-index": "2000000014",
		});
		imageListOverLay.append(imageListContainer);

		var body = $("body");
		body.css({
			"overflow": "hidden"
		});
		body.append(imageListOverLay);
	}

	function closeImageListView() {
		var listoverlay = $(".futaba_lightbox_image_list_overlay");
		if (listoverlay.length == 0) return;
		listoverlay.remove();
		$("body").css({
			"overflow": ""
		})
	}

	function setKeyDownEvent() {
		document.addEventListener("keydown", (e) => {
			if (e.key == "Escape" && $(".fancybox-opened").length == 0) {
				closeImageListView();
			}
		});
	}
})(jQuery);

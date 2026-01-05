// ==UserScript==
// @name        futaba WebM inline player
// @namespace   https://github.com/himuro-majika
// @description WebMをページ内で再生しちゃう
// @author      himuro_majika
// @include     http://*.2chan.net/*/*
// @include     https://*.2chan.net/*/*
// @exclude     http://*.2chan.net/*/futaba.php?mode=cat*
// @exclude     https://*.2chan.net/*/futaba.php?mode=cat*
// @exclude     http://*.2chan.net/bin/*
// @exclude     https://*.2chan.net/bin/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @require     https://greasyfork.org/scripts/1884-gm-config/code/GM_config.js?version=4836
// @version     1.10.1
// @grant       none
// @run-at      document-idle
// @license     MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAPUExURYv4i2PQYy2aLUe0R////zorx9oAAAAFdFJOU/////8A+7YOUwAAAElJREFUeNqUj1EOwDAIQoHn/c88bX+2fq0kRsAoUXVAfwzCttWsDWzw0kNVWd2tZ5K9gqmMZB8libt4pSg6YlO3RnTzyxePAAMAzqMDgTX8hYYAAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/15695/futaba%20WebM%20inline%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/15695/futaba%20WebM%20inline%20player.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);

(function ($) {
	/**
	 * 設定
	 */
	// フルサイズプレーヤーを有効にする(4chanライクな表示)
	var USE_FULLPLAYER = true;
	// ループ再生を有効にする
	var USE_LOOP = true;
	// 自動再生を有効にする(ミニサイズプレーヤー使用時)
	var USE_AUTOPLAY = false;
	// コントロールを表示する(ミニサイズプレーヤー使用時)
	var USE_CONTROLS = true;
	// 動画のサイズをサムネ画像と同サイズに制限する
	var USE_LIMIT_SIZE = false;
	// 動画の外側をクリックして動画を閉じる
	var USE_CLOSE_ON_CLICK_OUTSIDE = true;
	// デフォルトの音量
	var DEFAULT_VOLUME = 50;
	// ミュート状態で再生する
	var USE_MUTED = false;
	// フルサイズプレーヤーに時間を表示する
	var USE_TIME_DISPLAY = true;
	// 再生速度変更を有効にする
	var USE_PLAYBACK_RATE_CONTROL = true;
	// 赤福のオートリンクにも反応する
	var USE_AUTOLINK = true;

	init();
	function init() {
		config();
		getImgNodeThread();
		getImgNodeRes();
		if (USE_CLOSE_ON_CLICK_OUTSIDE) {
			closeOnClick();
		}
		if ((isAkahukuEnabled() || isFutakuroEnabled()) && USE_AUTOLINK) {
			getAutoLinkURL();
		}
		observeInserted();
		getResPopup();
	}
	// 赤福が有効か
	function isAkahukuEnabled() {
		return $("#akahuku_thumbnail").length > 0;
	}
	// ふたクロが有効か
	function isFutakuroEnabled() {
		return $("#master").length > 0;
	}
	// スレ画
	function getImgNodeThread() {
		var $sure_a = $(".thre").length ?
			$(".thre > a > img") :
			$("body > form > a > img");
		if (isFutakuroEnabled()) { // ふたクロ
			$sure_a = $("#master > a > img");
		}
		$sure_a.each(function() {
			replaceNode($(this));
		});
	}
	// レス画像
	function getImgNodeRes() {
		var $res_a = $(".rtd > a > img");
		$res_a.each(function() {
			replaceNode($(this));
		});
	}
	// オートリンクURL
	function getAutoLinkURL() {
		var $link = $("blockquote > a");
		$link.each(function() {
			replaceNode($(this));
		});
	}
	// 続きを読むで挿入される要素を監視
	function observeInserted() {
		var target = $(".thre").length ?
			$(".thre").get(0) :
			$("html > body > form[action]:not([enctype])").get(0);
		var observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				var $nodes = $(mutation.addedNodes);
				replaceNodeInserted($nodes);
			});
		});
		observer.observe(target, { childList: true });
	}
	// 引用ポップアップ //TODO:wip
	function getResPopup() {
		// $(document).click(function(event) {
		// 	var target = event.target;
		// 	console.log(target);
		// 	webmopen(target);
		// });
	}
	// 挿入されたレス
	function replaceNodeInserted($nodes) {
		var $res_inserted = $nodes.find("td > a > img");
		if (isAkahukuEnabled()) {
			if ($res_inserted.length) {
				replaceNode($res_inserted);
			}
		} else if (isFutakuroEnabled()) {
			$res_inserted.each(function(){
				replaceNode($(this));
			});
		}
		// オートリンク
		var $autolink_inserted = $nodes.find("blockquote > a");
		if (USE_AUTOLINK && $autolink_inserted.length) {
			replaceNode($autolink_inserted);
		}
	}
	// 外側をクリックしてプレーヤーを閉じる
	function closeOnClick() {
		$(document).click(function(event) {
			if (event.target.className != "extendWebm") {
				if ($(event.target).parents(".akahuku_reply_popup").length > 0) {
					// akahuku_reply_popup
					// replaceNode($(event.target));
					// return false;
				} else {
					$("div.cancelbk").each(function() {
						$(this).get(0).click();
					});
				}
			}
		});
	}
	// ノードの書き換え
	function replaceNode(node) {
		var href = node.parent().attr("href");
		if (node.attr("dummyhref")) {
			// オートリンク
			href = node.attr("dummyhref");
		} else if (node.attr("href")) {
			href = node.attr("href");
		}
		if (!href.match(/\.(webm|mp4)$/)) {
			// 拡張子.webm, .mp4以外
			return;
		}
		var width = node.attr("width");
		if (!width) {
			// オートリンク
			width = node.get(0).offsetWidth;
		}
		var height = node.attr("height");
		var timer_show, timer_hide, timer_rate_hide;
		
		
		//クリックイベント
		// document.removeEventListener('click', thumbonclick, false);
		node.click(function(event) {
			addMiniPlayer(node);
			return false;
		});

		
		// マウスオーバーで読み込み
		node.hover(function(){
			if (USE_FULLPLAYER) {
				clearTimeout(timer_rate_hide);
				timer_show = setTimeout(function(){
					showFullPlayer();
					if (USE_PLAYBACK_RATE_CONTROL) {
						showplaybackRateControl();
					}
				}, 300);
			} else {
				if (node.attr("dummyhref") || node.attr("href")) {
					addMiniPlayerAutoLink();
				} else if (USE_AUTOPLAY) {
					addMiniPlayer(node);
				}
			}
		},function(){
			if (USE_FULLPLAYER) {
				clearTimeout(timer_show);
				timer_hide = setTimeout(function(){
					hideFullPlayer();
					if (USE_PLAYBACK_RATE_CONTROL) {
						hideplaybackRateControl();
					}
				}, 300);
			}
		});
		// 再生速度変更
		function showplaybackRateControl() {
			if ($("#GM_fwip_Rate_container").length) {
				return;
			}
			var $rateContainer = $("<div>", {
					id: "GM_fwip_Rate_container",
					css: {
						position: "absolute",
						// "margin-top": "5px",
						"margin-left": "20px",
						"background-color": "rgba(0,0,0,0.3)",
						"z-index": "100",
						color: "#fff",
					}
			}).hover(function(){
				clearTimeout(timer_hide);
			}, function() {
				timer_rate_hide = setTimeout(function() {
					hideFullPlayer();
					hideplaybackRateControl();
				}, 300);
			}).append(
				$("<label>", {
					text: "再生速度x",
					for: "GM_fwip_Rate",
				})
			).append(
				$("<input>", {
					id: "GM_fwip_Rate",
					type: "number",
					step: "0.25",
					max: "5.0",
					min: "0.25",
					value: "1.0",
					css: {
						width: "3em",
						opacity: "0.7"
					}
				})
			);
			if (node.attr("dummyhref") || node.attr("href")) {
				// オートリンク
				node.after($rateContainer);
			} else {
				node.parent().after($rateContainer);
			}
		}
		// 再生速度
		function hideplaybackRateControl() {
			$("#GM_fwip_Rate_container").remove();
		}
		// ミニプレイヤー
		function addMiniPlayer(node) {
			var thumb = node.get(0);
			webmopen(thumb);
			var video = node.parent().parent().find(".extendWebm");
			var videoDiv = video.parent();
			videoDiv.css({
				"margin": "0 20px",
				"float": "left",
				"clear": "left",
			});
			if (USE_LIMIT_SIZE) {
				video.css({
					"width": width,
					"height": height,
				});
			}
			video.prop({
				controls: USE_CONTROLS,
				// autoplay: USE_AUTOPLAY,
				loop: USE_LOOP,
				muted: USE_MUTED,
				volume: DEFAULT_VOLUME / 100,
			}).click(function(event) {
				//動画クリックでplay/pauseトグル(Chrome用)
				if (navigator.userAgent.indexOf("Firefox") == -1) {
					if (this.paused) {
						this.play();
					} else {
						this.pause();
					}
				}
			}).hover(function() {
				if (USE_AUTOPLAY && !USE_LOOP) {
					this.play();
				}
			}, function() {
			});
		}
		
		function addMiniPlayerAutoLink() {
			if (
				( node.attr("dummyhref") || node.attr("href") ) &&
				node.parent().parent().get(0).tagName == "FORM" &&
				width < 250
			) {
				// スレ本文のオートリンク
				width = 250;
			}
			var $videoContainer = $("<div>", {
				class: "GM_fwip_container_mini",
				css: {
					"margin": "0 20px",
					"float": "left",
					"clear": "left",
				}
			}).hover(function(){
				if (USE_AUTOPLAY) {
					$(this).find(".GM_fwip_player").get(0).play();
				}
			},function(){
			}).append(
				$("<video>", {
					class: "GM_fwip_player",
					css: {
						"width": USE_LIMIT_SIZE ? width : "",
						"height": USE_LIMIT_SIZE ? height : "",
					},
				}).prop({
					controls: USE_CONTROLS,
					autoplay: USE_AUTOPLAY,
					loop: USE_LOOP,
					muted: USE_MUTED,
					volume: DEFAULT_VOLUME / 100,
				}).click(function(event) {
					//動画クリックでplay/pauseトグル(Chrome用)
					if (navigator.userAgent.indexOf("Firefox") == -1) {
						if (this.paused) {
							this.play();
						} else {
							this.pause();
						}
					}
				})
				// .on("timeupdate", function(){
				// 	// 再生速度変更
				// 	$(this).prop("playbackRate", $("#GM_fwip_Rate").val());
				// })
				.append(
					$("<source>", {
						src: href,
						type: "video/webm",
					})
				)
			);
			// サムネイル画像を隠す
			if (node.attr("dummyhref") || node.attr("href")) {
				// オートリンク
				if (!node.parent().parent().children(".GM_fwip_container_mini").length) {
					node.parent().before($videoContainer);
				}
			} else {
				node.hide();
				node.parent().before($videoContainer);
			}
		}
		// フルプレイヤーを表示する
		function showFullPlayer() {
			if ($("#GM_fwip_Rate_container").length) {
				return;
			}
			hideFullPlayer();
			// サムネ右端のオフセット
			var offset = parseInt(node.offset().left) + parseInt(width);
			var $videoContainer = $("<div>", {
				class: "GM_fwip_container_full",
				css: {
					"background-color": "#000",
					"position": "fixed",
					"top": "20px",
					"right": "20px",
					// "border": "5px solid #333",
					// "border-radius": "5px",
					"box-shadow": "0 0 10px 5px rgba(0,0,0,0.5)",
					"z-index": "2000000013",
				}
			});
			var $videoPlayer = $("<video>", {
				class: "GM_fwip_player",
				css: {
					"width": "auto",
					"height": "auto",
					"max-width": $(window).width() - offset - 40,
					"max-height": $(window).height() - 50,
				},
			}).prop({
				autoplay: true,
				loop: USE_LOOP,
				muted: USE_MUTED,
				preload: true,
				volume: DEFAULT_VOLUME / 100,
				// playbackRate: "1.0",
			}).append(
				$("<source>", {
					src: href,
					type: "video/webm",
					error: function() {
						// ソースの読み込み失敗イベント
						onerror();
					},
				})
			);
			$videoContainer.append($videoPlayer);
			if (USE_PLAYBACK_RATE_CONTROL) {
				$videoPlayer.on("timeupdate", function() {
					// 再生速度変更
					$(this).prop("playbackRate", $("#GM_fwip_Rate").val());
				});
			}
			if (USE_TIME_DISPLAY) {
				$videoPlayer.on("loadedmetadata", function(){
					// メタデータ読み込み完了イベント
					showDuration($(this).get(0));
				}).on("timeupdate", function() {
					// 再生位置変更イベント
					showCurrentTime($(this).get(0));
				});
				$videoContainer.append(
					$("<div>", {
						class: "GM_fwip_time_container",
						css: {
							"font-size": "6pt",
							"font-family": "arial,helvetica,sans-serif",
							postion: "relative",
							"text-align": "right",
							color: "#fff",
						}
					}).append(
						$("<span>", {
							class: "GM_fwip_time_current"
						})
					).append(
						$("<span>").text("/")
					).append(
						$("<span>", {
							class: "GM_fwip_time_duration",
						})
					)
				);
			}
			$("body").append($videoContainer);
			// 動画の長さを表示する
			function showDuration(video) {
				var webm_duration = parseTime(video.duration);
				$(".GM_fwip_time_duration").text(webm_duration);
			}
			// 再生時間を表示する
			function showCurrentTime(video) {
				var currenttime = parseTime(video.currentTime);
				$(".GM_fwip_time_current").text(currenttime);
			}
			// エラー表示
			function onerror() {
				$videoContainer.children().remove();
				$videoContainer.append(
					$("<p>", {
						text: "動画が読み込めませんでした",
						class: "GM_fwip_error",
						css: {
							"text-align": "center",
							"background-color": "#fff",
							"color": "#c00"
						}
					})
				);
			}
		}
		// フルプレーヤーを消す
		function hideFullPlayer() {
			var $container = $(".GM_fwip_container_full");
			if ($container.length) {
				$container.remove();
			}
		}
	}

	// 設定
	function config() {
		// 設定画面
		GM_config.init("futaba WebM inline playerオプション<br>" +
		"(設定反映には[Save]ボタン押下後にページの再読み込みが必要です)", {
			"USE_LOOP" : {
				"section": ["共通"],
				"label" : "ループ再生を有効にする",
				"type" : "checkbox",
				"default" : USE_LOOP
			},
			"DEFAULT_VOLUME" : {
				"label" : "デフォルトの音量（範囲は0～100。ミュートの設定が優先されます。）",
				"type" : "int",
				"default" : DEFAULT_VOLUME
			},
			"USE_MUTED" : {
				"label" : "ミュート状態で再生する",
				"type" : "checkbox",
				"default" : USE_MUTED
			},
			"USE_AUTOLINK" : {
				"label" : "赤福・ふたクロのオートリンク文字列に反応する",
				"type" : "checkbox",
				"default" : USE_AUTOLINK
			},
			"USE_FULLPLAYER" : {
				"section": ["フルサイズプレーヤー(画面右上のスペースに表示される大きいサイズのプレーヤー)"],
				"label" : "フルサイズプレーヤーを使用する(オフにするとミニサイズプレーヤーが有効になります。)",
				"type" : "checkbox",
				"default" : USE_FULLPLAYER
			},
			"USE_TIME_DISPLAY" : {
				"label" : "動画の下に再生時間を表示する",
				"type" : "checkbox",
				"default" : USE_TIME_DISPLAY
			},
			"USE_PLAYBACK_RATE_CONTROL" : {
				"label" : "再生速度コントロールを有効にする(実験的)",
				"type" : "checkbox",
				"default" : USE_PLAYBACK_RATE_CONTROL
			},
			"USE_AUTOPLAY" : {
				"section": ["ミニサイズプレーヤー(サムネ画像と置き換わるプレーヤー)"],
				"label" : "マウスオーバーで再生開始する",
				"type" : "checkbox",
				"default" : USE_AUTOPLAY
			},
			"USE_CONTROLS" : {
				"label" : "コントロールを表示する",
				"type" : "checkbox",
				"default" : USE_CONTROLS
			},
			"USE_CLOSE_ON_CLICK_OUTSIDE" : {
				"label" : "動画の外側をクリックして動画を閉じる",
				"type" : "checkbox",
				"default" : USE_CLOSE_ON_CLICK_OUTSIDE
			},
			"USE_LIMIT_SIZE" : {
				"label" : "動画のサイズをサムネ画像と同サイズに制限する",
				"type" : "checkbox",
				"default" : USE_LIMIT_SIZE
			}
		});
		// 設定値読み込み
		USE_FULLPLAYER = GM_config.get("USE_FULLPLAYER");
		USE_LOOP = GM_config.get("USE_LOOP");
		USE_AUTOPLAY = GM_config.get("USE_AUTOPLAY");
		USE_CONTROLS = GM_config.get("USE_CONTROLS");
		if (!GM_config.get("DEFAULT_VOLUME") || GM_config.get("DEFAULT_VOLUME") > 100) {
			DEFAULT_VOLUME = 100;
			GM_config.set("DEFAULT_VOLUME", 100);
		} else {
			DEFAULT_VOLUME = GM_config.get("DEFAULT_VOLUME");
		}
		USE_MUTED = GM_config.get("USE_MUTED");
		USE_TIME_DISPLAY = GM_config.get("USE_TIME_DISPLAY");
		USE_PLAYBACK_RATE_CONTROL = GM_config.get("USE_PLAYBACK_RATE_CONTROL");
		USE_AUTOLINK = GM_config.get("USE_AUTOLINK");
		USE_LIMIT_SIZE = GM_config.get("USE_LIMIT_SIZE");
		USE_CLOSE_ON_CLICK_OUTSIDE = GM_config.get("USE_CLOSE_ON_CLICK_OUTSIDE");
		// 設定ボタンの表示
		$("body > table:not([class])").before(
			$("<span>", {
				id: "GM_fwip_configButton",
			}).append(
				$("<a>", {
					text: "[WebM設定]",
					css: {
						cursor: "pointer",
					},
					click : function(){
						GM_config.open();
					}
				})
			)
		);
	}
	// 秒をhh:mm:ss形式で返す
	function parseTime(sec) {
		var date = new Date(0,0,0,0,0,sec);
		var time =
		("0" + date.getHours()).slice( -2 ) + ":" +
		("0" + date.getMinutes()).slice( -2 ) + ":" +
		("0" + date.getSeconds()).slice( -2 );
		return time;
	}

})(jQuery);

// ==UserScript==
// @name        115 Online Player
// @version     1.1.1
// @description Play videos from 115 online
// @match       http://*.115.com/*
// @match       http://*.115.com/*
// @author      8qwe24657913 | 864907600cc
// @run-at      document-end
// @grant       none
// @namespace   http://ext.ccloli.com
// @downloadURL https://update.greasyfork.org/scripts/4892/115%20Online%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/4892/115%20Online%20Player.meta.js
// ==/UserScript==


// 播放的视频系未转码的原始视频，播放视频需浏览器支持该格式，当浏览器无法播放此视频时会弹出视频下载地址，您可以将地址贴入本地播放器来在线观看，或贴入下载地址下载播放

if (location.search.indexOf("?ct=")) {
	var requests = [],
		CloudVideo = window.CloudVideo = {
			showPanel: function (code, height) {
				var dialog_frame = $('<div class="dialog-frame" style="height:' + height + 'px;text-align:center;font-size:100px;">Loading......</div>');
				var dialog = new Core.DialogBase({
					title: "视频播放",
					content: dialog_frame,
					width: 640
				});
				var video;
				dialog._Close = dialog.Close;
				dialog.Close = function(){
					if (video) {
						video = video[0];
						video.pause(0);
						video.setAttribute('onerror', '');
						video.setAttribute('src', 'data:video/empty,');
					}
					this._Close();
				};
				dialog.Open();
				this.getFileUrl(code, function (url) {
					video = $('<video class="online-video-player" autoplay="autoplay" controls="controls" width="640" height="' + height + '" onerror="prompt(\'播放失败！可能是不支持的格式或下载断流！\n请尝试复制下载地址并调用本地播放器播放\', this.src)"></video>').attr('src', url).appendTo(dialog_frame.html(''));
				});
			},
			getFileUrl: function (pickcode, callback) {
				requests.push([pickcode, callback]);
			}
		},
		frameName = 'CloudVideo_' + new Date().getTime();
	$('<iframe>').attr('src', 'http://web.api.115.com/bridge_2.0.html?namespace=CloudVideo&api=jQuery').attr('id', frameName).css({
		width: 0,
		height: 0,
		border: 0,
		padding: 0,
		margin: 0,
		position: 'absolute',
		top: '-99999px'
	}).one('load', function () {
		var urlCache = {};
		CloudVideo.getFileUrl = function (pickcode, callback) {
			if (urlCache[pickcode]) {
				setTimeout(callback, 0, urlCache[pickcode]);
			} else {
				window.frames[frameName].contentWindow.jQuery.get('http://web.api.115.com/files/download?pickcode=' + pickcode, function (data) {
					callback(urlCache[pickcode] = data.file_url);
				}, 'json');
			}
		};
		requests.forEach(function (e) {
			CloudVideo.getFileUrl(e[0], e[1]);
		});
		requests = null;
	}).appendTo('html');
} else {
	$('<style>').text('.show-video-button{font-size:14px;width:40px;height:24px;line-height:24px;text-align:center;background:rgba(255,255,255,0.75);top:20px;left:0px;right:0px;bottom:auto;margin:auto;position:absolute;z-index:999;display:none}li[rel="item"][file_type="1"][file_mode="9"]:hover .show-video-button{display:block}').appendTo('html');
	$(document).on('mouseenter', 'li[rel="item"][file_type="1"][file_mode="9"]:not([is_loaded_vbutton="1"])', function () {
		var par_element = $(this).attr('is_loaded_vbutton', '1'),
			pick_code = par_element.attr('pick_code'),
			video_height = function () {
				var image = par_element.find('.img-pos img');
				return 640 / image.width() * image.height() || 360;
			}();
		$('<div class="show-video-button">播放</div>').on('click', function () {
			parent.CloudVideo.showPanel(pick_code, video_height);
		}).appendTo(par_element);
	});
}
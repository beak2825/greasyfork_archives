// ==UserScript==
// @name         A2STV 4.0
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Anti Two Sub TV!
// @author       Unsonet
// @match        http://2sub.tv/*
// @grant        none
// @run-at       document-end
// @require      http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=2sub.tv
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490913/A2STV%2040.user.js
// @updateURL https://update.greasyfork.org/scripts/490913/A2STV%2040.meta.js
// ==/UserScript==

(function () {

	window.playtimelistener = function () { return 'хрен тебе а не мои куки' };
	window.setCookie = function () { return 'хрен тебе, а не мои куки' };
	window.getCookie = function () { return 'хрен тебе, а не мои куки' };

	var scripts = document.getElementsByTagName('script');
	for (let script of scripts) {
		if (script.src == 'http://2sub.tv/templates/megatube/js/player/video.min.js') {
			script.remove();
		}
	}

	var mainBlock = document.querySelector('.full-text.clearfix');
	var mainckeyScript = mainBlock.nextElementSibling;

	var video = document.querySelector('.video-js');
	console.log(mainckeyScript);
	var videoSources = video.querySelectorAll('source');

	var newVideoId = 'anti2sub';

	mainBlock.innerHTML = `
  <video id="${newVideoId}" controls>
  </video>
<!--<div class="actions">
		<a href="javascript:;" id="btn1">播放</a>
		<a href="javascript:;" id="btn2">暂停</a>
		<a href="javascript:;" id="btn3">隐藏音量调节控件</a>
		<a href="javascript:;" id="btn4">设置宽高</a>
		<a href="javascript:;" id="btn6">隐藏</a>
		<a href="javascript:;" id="btn5">显示</a>
		<a href="javascript:;" id="btn7">设置其它资源</a>
		<a href="javascript:;" id="btn8">销毁</a>
	</div>-->
`;

	/*
	var oV = videojs(`#${newVideoId}`, {
		controls: true,
		autoplay: true,
		poster: 'https://cs10.pikabu.ru/post_img/2018/10/12/9/og_og_153935340922786120.jpg',
	});
	oV.ready(function(){
			this.hotkeys({
			volumeStep: 0.1,
			seekStep: 5,
			enableMute: true,
			enableVolumeScroll: true,
			enableFullscreen: true,
			enableNumbers: true
		});
	});
*/


	//var player = videojs.players[`${newVideoId}`];
	console.log('videoSources', video);
	var src = videoSources[videoSources.length - 1].src;

	/*--------------------
	console.log(oV);
		document.querySelector('.actions').addEventListener('click',function(e){
	if(e.srcElement.tagName.toLowerCase()!=='a' || e.target.classList.contains('active')) return;

	var i = e.target.id, btn = e.target;
	var o =	document.querySelector('.actions .active');
	o && o.classList.remove('active');
	btn.classList.add('active');
	switch(i){
		case 'btn1':
			oV.play();
			break;
		case 'btn2':
			oV.pause();
			break;
		case 'btn3':
			oV.controlBar.volumeMenuButton.hide();
			break;
		case 'btn4':
			oV.width(300).height(200);
			break;
		case 'btn5':
			oV.show();
			break;
		case 'btn6':
			oV.hide();
			break;
		case 'btn7':
			oV.src="http://static.qiakr.com/movie/0080108.mp4";
			oV.load();
			oV.play();
			break;
		default:
			oV.dispose();
			break;
	};

}, false);
----------------------*/


	//var newVideo = document.createElement('video');
	var newTrack;
	var newVideo = document.getElementById(newVideoId); //+.querySelector('video')
	newVideo.setAttribute('src', src);
	for (let source of videoSources) {
		newVideo.appendChild(source);
	}

	//newVideo.src = videoSources[videoSources.length-1].src;
	//newVideo.setAttribute('style','display:block;margin-left:auto;margin-right:auto;');
	//newVideo.setAttribute('preload','none');
	//newVideo.setAttribute("data-setup", '{ "playbackRates" : [0.7, 0.8, 0.9, 1, 1.2, 1.5]}');
	//newVideo.setAttribute("controls", "controls");

	//video.remove();
	//videoBlock.insertBefore(newVideo, videoBlock.firstChild);
	//////////////////////////////////////

	$.ajax({
		type: "POST",
		url: "http://2sub.tv/captionsp/get.php",
		dataType: "json",
		data: { type: 'main', video: src, k: mainckey }
	})
		.done(function (msg) {
			console.debug(msg)
			var i = -1;
			msg.codes.forEach(function (mk) {
				i++;
				if (mk == 0) return;
				
				var srclang;
				var label;
				var def;

				switch (i) {
					case 0:
						srclang = "en";
						label = "Double";
						def = 'default';
						break;

					case 1:
						srclang = "en";
						label = "English";
						def = '';
						break;

					case 2:
						srclang = "ru";
						label = "Russian";
						def = '';
						break;

					case 3:
						srclang = "ge";
						label = "Double";
						def = 'default';
						break;

					case 4:
						srclang = "ge";
						label = "German";
						def = '';
						break;
				}
				setTimeout(function () {
					var track = {
						kind: 'captions',
						src: 'http://2sub.tv/captionsp/get.php?type=caption&k=' + mk,
						srclang: srclang,
						label: label,
						mode: 'Showing',
						default: def
					};

					//console.log(track);

					newTrack = document.createElement('track');
					newTrack.setAttribute('kind', track.kind);
					newTrack.setAttribute('src', track.src);
					newTrack.setAttribute('label', track.label);
					newTrack.setAttribute('srclang', track.srclang);
					newVideo.appendChild(newTrack);

					$.ajax({
						type: "GET",
						url: track.src
					}).done(function (data) {
						console.log(data);
						//Object.freeze(newVideo);
					});

					player.addRemoteTextTrack(track, true)

				}, (i * 10));

			});

			setTimeout(function () {
				$('.vjs-subs-caps-button .vjs-menu-item').each(function (index) {
					if ($(this).text().indexOf("Double") !== -1) {
						$(this).click()
					}
				});
				player.options({
					html5: {
						nativeTextTracks: true
					}
				})
			}, (3000));

		});

	//////////////////////////////////////
})();
// ==UserScript==
// @name        anime1-cast
// @namespace   https://blog.maple3142.net/
// @description StreamAnime1.me網站上的動漫
// @version     0.8.10
// @author      maple3142
// @match       https://anime1.me/*
// @match       https://p.anime1.me/pic.php*
// @match       https://p.anime1.me/ts.php*
// @match       https://p.anime1.me/mp4.php*
// @match       https://p.anime1.me/mf?id=*
// @match       https://torrent.anime1.me/*.html
// @match       https://video.anime1.me/video?*
// @match       https://player.anime1.me/watch?*
// @match       https://player.anime1.me/watchhls?*
// @match       https://v.anime1.me/watch?*
// @match       https://web.1ani.me/*.html
// @match       https://i.animeone.me/*
// @noframes
// @license     MIT
// @require     https://unpkg.com/jquery@3.2.1
// @require     https://unpkg.com/sweetalert2@7.18.0
// @require     https://unpkg.com/vue@2.5.22
// @grant       GM_info
// @grant       GM_download
// @downloadURL https://update.greasyfork.org/scripts/393799/anime1-cast.user.js
// @updateURL https://update.greasyfork.org/scripts/393799/anime1-cast.meta.js
// ==/UserScript==

(function (swal,$,Vue) {
'use strict';

swal = swal && swal.hasOwnProperty('default') ? swal['default'] : swal;
$ = $ && $.hasOwnProperty('default') ? $['default'] : $;
Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue;

function download(url, filename) {
	//觸發下載
	const a = document.createElement('a');
	a.href = url;
	if (filename) a.download = filename;
	document.body.appendChild(a);
	a.click();
    return a;
}
function parseQuery(str) {
	return Object.assign(...str.replace('?', '').split('&').map(part => part.split('=')).map(ar => ({ [ar[0]]: ar[1] })));
}
function xhrDownload({ url, progcb, loadcb, proginterval = 3000 }) {
	const xhr = new XMLHttpRequest();
	xhr.responseType = 'blob';
	let lastupd = Date.now();
	xhr.onprogress = e => {
		if (!e.lengthComputable) return;
		if (Date.now() - lastupd > proginterval) {
			progcb(e);
			lastupd = Date.now();
		}
	};
	xhr.onload = e => loadcb(xhr.response);
	xhr.open('GET', url);
	xhr.send();
	return xhr;
}
function createShareButton(url) {
  const btn = document.createElement("button");

  const title = document.title;
  const text = "Check this out!";

  btn.innerText = "share" in navigator ? "Share" : "Share via e-mail";

  btn.onclick = () => {
    if (navigator.share !== undefined) {
      navigator
        .share({
          title,
          text,
          url
        })
        .then(() => console.log("Shared!"))
        .catch(err => console.error(err));
    }
  };
  return btn;
}

function hook(obj, name, cb) {
	const orig = obj[name];
	obj[name] = function (...args) {
		cb(args);
		orig.apply(this, args);
	};
	return () => obj[name] = orig;
}

function pic () {
	//如果是普通下載頁面
	//取得資料
	const video = jwplayer().getPlaylist()[0]; //目前使用jwplayer
	if (!video) return;
	const sources = video.sources;
	const title = video.title;
	//Object.assign({'HD': 'hd video url'},{'SD': 'sd video url'},something...)
	const videomap = Object.assign(...sources.map(src => ({ [src.label]: src.file })));

	//詢問要下載的畫質
	const askmsg = `輸入要下載的畫質名稱:(${sources.map(src => src.label).join(',')})`;
	const type = prompt(askmsg);
	//如果畫質存在
	if (type in videomap) {
		if (GM_info.downloadMode === 'browser' && GM_download) {
			GM_download({
				url: videomap[type],
				name: `${title}.mp4`,
				onerror: () => download(videomap[type], `${title}.mp4`),
				saveAs: true
			});
		} else download(videomap[type], `${title}.mp4`);
	}
}

const msg = `由於這種影片是線上串流格式的影片，無法透過瀏覽器直接下載<br>但你可以複製下方的網址並使用 ffmpeg 或 vlc 來下載或是 google m3u8 的下載方法`;
const url = `https://chrome.google.com/webstore/detail/native-hls-playback/emnphkkblegpebimobpbekeedfgemhof`;
const nativehlsplayback = `只是需要播放的話可以安裝<a href="${url}">此插件</a>來播放`;
var hlsmsg = (m3u8 => {
document.body.appendChild(createShareButton(m3u8));
    swal({
		title: '不支援下載',
		html: `<p>${msg}</p><p>${nativehlsplayback}</p><a href="${m3u8}">${m3u8}</a>`
	});
});


var ts = (() => hlsmsg(player.src()));

(function () {
	if (typeof document !== 'undefined') {
		var head = document.head || document.getElementsByTagName('head')[0],
		    style = document.createElement('style'),
		    css = " #outer[data-v-e2bc17e8] { width: 100%; height: 100vh; text-align: center; } #inner[data-v-e2bc17e8] { position: relative; top: 50%; transform: translateY(-50%); } ";style.type = 'text/css';if (style.styleSheet) {
			style.styleSheet.cssText = css;
		} else {
			style.appendChild(document.createTextNode(css));
		}head.appendChild(style);
	}
})();

var Mp4dl = { render: function () {
		var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { attrs: { "id": "outer" } }, [_c('div', { attrs: { "id": "inner" } }, [_c('div', [_c('progress', { attrs: { "max": _vm.total }, domProps: { "value": _vm.loaded } }), _vm._v(_vm._s(_vm.percent) + "% ")]), _vm._v(" "), _c('div', [_vm._v(" " + _vm._s(_vm.loadedMB) + " MB/" + _vm._s(_vm.totalMB) + " MB ")]), _vm._v(" "), _vm.fileurl ? _c('div', [_c('a', { attrs: { "href": _vm.fileurl, "download": _vm.vid + '.mp4' } }, [_vm._v("點此下載")])]) : _vm._e()])]);
	}, staticRenderFns: [], _scopeId: 'data-v-e2bc17e8',
	props: {
		url: {
			type: String,
			required: true
		},
		vid: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			loaded: 0,
			total: 0,
			fileurl: null
		};
	},
	computed: {
		loadedMB() {
			return (this.loaded / 1024 / 1024).toFixed(2);
		},
		totalMB() {
			return (this.total / 1024 / 1024).toFixed(2);
		},
		percent() {
			return (this.loaded / this.total * 100).toFixed(2);
		}
	},
	created() {
		xhrDownload({
			url: this.url,
			progcb: e => {
				this.loaded = e.loaded;
				this.total = e.total;
			},
			loadcb: r => {
				this.fileurl = URL.createObjectURL(r);
				download(this.fileurl, this.vid + '.mp4');
				document.title = '下載完成!';
				this.loaded = this.total;
			}
		});
	}
};

const query = parseQuery(location.search);
function mp4 () {
	//特殊，因為需要Referer header才能得到影片檔
	if (!confirm('這類需要特殊下載方法，要保持此頁面開啟直到下載完成\n是否繼續?')) return;
	const url = $('video>source').attr('src');
	$('body *').remove();
	const div = document.createElement('div');
	$(document.body).append(div);
	new Vue({
		render: h => h(Mp4dl, {
			attrs: { url: url }
		})
	}).$mount(div);
}

function mf () {
	const restore = hook(XMLHttpRequest.prototype, 'open', ([GET, url]) => {
		restore();
		fetch(url).then(r => r.text()).then(ht => {
			const $$ = $(ht);
			let lnk = $$.find('.DownloadButtonAd-startDownload').attr('href') || $$.find('.download_link a').attr('href') || url;
			swal({
				title: '下載連結',
				html: `<a href="${lnk}">${lnk}</a>`
			});
			jwplayer('player').stop();
		});
	});
	load();
}

function torrent () {
	swal({
		title: '不支援下載',
		html: `<p>以下是影片的磁力連結，若想在瀏覽器中播放請按確定，按下取消會停止播放影片</p><a href="${torrentId}">${torrentId}</a>`
	});
	if (!_continue) {
		client.destroy();
		document.documentElement.innerHTML = '';
	}
}

function video () {
	const src = $('source').attr('src');
	location.href = src;
}

var watch = (() => setTimeout(() => location.href = jwplayer('player').getPlaylistItem().file, 500));

var watchhls = (() => hlsmsg(player.src()));

var web1anime = (() => hlsmsg(player.src()));

var animeone = (() => hlsmsg(player.src()));

function other () {
	// other pages
	if ($('.acpwd-pass').length) {
		// automatically enter password if needed
		$('.acpwd-pass').get(0).value = 'anime1.me'; // current password (2017-12-03T14:15:37.823Z)
		$('.acpwd-submit').get(0).click();
		return;
	}
	// find each videos in articles
	const $articles = $('article');
	for (const art of $articles) {
		const $title = $(art).find('.entry-title');
		const iframes = $(art).find('iframe');
		for (let i = 0; i < iframes.length; i++) {
			const ifr = iframes[i];
			const url = $(ifr).attr('src');
			if (!url) continue; //如果沒有影片
			let btnText = '下載';
			if (iframes.length > 1) {
				// add number after the text if there are more than 1 video in the article
				btnText += ` #${i + 1}`;
			}
			$title.append($('<button>').addClass('search-submit').text(btnText).click(e => window.open(url, '_blank')));
		}
	}
	// handle load vid btns
	const loadvidBtns = $('.loadvideo');
	for (const btn of loadvidBtns) {
		const url = $(btn).data('src').replace('?autoplay=1', '');
		$(btn).after($('<button>').addClass('search-submit').css('margin-left', '1em').text('下載').click(e => window.open(url, '_blank')));
	}
}

const loc = location;
if (loc.hostname === 'p.anime1.me' && loc.pathname === '/pic.php') pic();else if (loc.hostname === 'p.anime1.me' && loc.pathname === '/ts.php') ts();else if (loc.hostname === 'p.anime1.me' && loc.pathname === '/mp4.php') mp4();else if (loc.hostname === 'p.anime1.me' && loc.pathname === '/mf') mf();else if (loc.hostname === 'torrent.anime1.me') torrent();else if (loc.hostname === 'video.anime1.me' && loc.pathname === '/video') video();else if ((loc.hostname === 'player.anime1.me' || loc.hostname === 'v.anime1.me') && loc.pathname === '/watch') watch();else if (loc.hostname === 'player.anime1.me' && loc.pathname === '/watchhls') watchhls();else if (loc.hostname === 'web.1ani.me') web1anime();else if (loc.hostname === 'i.animeone.me') animeone();else other();
document.oncontextmenu = null; // re-enable right click

}(Sweetalert2,$,Vue));

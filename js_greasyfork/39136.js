// ==UserScript==
// @name        動畫瘋工具箱
// @namespace   https://blog.maple3142.net/
// @description 取得動畫的 m3u8 網址，下載彈幕為 json，去除擋廣告的警告訊息
// @version     0.9.8
// @author      maple3142
// @match       https://ani.gamer.com.tw/animeVideo.php?sn=*
// @connect     api.gamer.com.tw
// @require     https://cdn.jsdelivr.net/npm/m3u8-parser@4.2.0/dist/m3u8-parser.min.js
// @require     https://unpkg.com/xfetch-js@0.3.4/xfetch.min.js
// @require     https://unpkg.com/gmxhr-fetch@0.1.0/gmxhr-fetch.min.js
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/39136/%E5%8B%95%E7%95%AB%E7%98%8B%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/39136/%E5%8B%95%E7%95%AB%E7%98%8B%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==

(function () {
	'use strict';

	var $ = jQuery;
	function hookSetter(obj, prop, cb) {
	  var value,
	      canceled = false;
	  Object.defineProperty(obj, prop, {
	    set: function set(v) {
	      value = v;
	      if (!canceled) cb(v);
	    },
	    get: function get() {
	      return value;
	    }
	  });
	  return function () {
	    return canceled = true;
	  };
	}
	function cvtM3U8_to_playlist(baseurl) {
	  return function (m3u8) {
	    var parser = new m3u8Parser.Parser();
	    parser.push(m3u8);
	    parser.end();
	    var pls = parser.manifest.playlists.map(function (pl) {
	      return {
	        url: new URL(pl.uri, baseurl).href,
	        res: pl.attributes.RESOLUTION
	      };
	    });
	    return pls;
	  };
	}
	function triggerDownload(url, fname) {
	  var a = document.createElement('a');
	  a.href = url;
	  a.download = fname;
	  document.body.appendChild(a);
	  a.click();
	  a.remove();
	}
	function saveTextAsFile(text, fname) {
	  var blob = new Blob([text]);
	  var url = URL.createObjectURL(blob);
	  triggerDownload(url, fname);
	  URL.revokeObjectURL(url);
	}
	var gxf = xf.extend({
	  fetch: gmfetch
	});
	function getTodayAnswer() {
	  return gxf.get('https://api.gamer.com.tw/mobile_app/bahamut/v1/home.php', {
	    qs: {
	      owner: 'blackXblue',
	      page: 1
	    }
	  }).json(function (_ref) {
	    var creation = _ref.creation;
	    return creation.find(function (x) {
	      return x.title.includes('動漫通');
	    }).sn;
	  }).then(function (sn) {
	    return gxf.get('https://api.gamer.com.tw/mobile_app/bahamut/v1/home_creation_detail.php', {
	      qs: {
	        sn: sn
	      }
	    });
	  }).json(function (_ref2) {
	    var content = _ref2.content;
	    var body = /<body[\s\w"-=]*>([\s\S]*)<\/body>/.exec(content)[1];
	    var ans = /A[:：](\d)/.exec(body)[1];
	    return parseInt(ans);
	  });
	}
	function getQuestion() {
	  return xf.get('/ajax/animeGetQuestion.php', {
	    qs: {
	      t: Date.now()
	    }
	  }).json();
	}
	function answerQuestion(t) {
	  return getQuestion().then(function (obj) {
	    return xf.post('/ajax/animeAnsQuestion.php', {
	      urlencoded: {
	        token: obj.token,
	        ans: t,
	        t: Date.now()
	      }
	    }).json();
	  }).then(function (o) {
	    if (o.error || o.msg === '答題錯誤') throw o;
	    return o;
	  });
	}

	var m3u8container = $('<div>').addClass('anig-ct');
	var it = setInterval(function () {
	  if (typeof videojs !== 'undefined' && videojs.getPlayer('ani_video')) {
	    clearInterval(it);
	    var vid = videojs.getPlayer('ani_video');
	    unsafeWindow.ani_video = vid;
	    var fn = vid.src.bind(vid);

	    vid.src = function (src) {
	      if (!src) {
	        return fn();
	      }

	      onPlaylistUrl(typeof src === 'string' ? src : src.src);
	      fn(src);
	    };
	  }
	}, 100);

	function render(pls) {
	  pls.map(function (pl) {
	    return $('<a>').addClass('anig-tb').addClass('tdn').text(pl.res.height + 'p').attr('href', pl.url).attr('target', '_blank');
	  }).forEach(function (el) {
	    return m3u8container.append(el);
	  });
	}

	function onPlaylistUrl(playlisturl) {
	  if (playlisturl.indexOf('gamer_ad') !== -1) {
	    //is ad
	    return;
	  }

	  var baseurl = playlisturl.replace(/playlist\.m3u8.*/, '');
	  fetch(playlisturl).then(function (r) {
	    return r.text();
	  }).then(cvtM3U8_to_playlist(baseurl)).then(function (pls) {
	    return window.unsafeWindow = pls;
	  }) //EXPOSE
	  .then(render);
	}

	//extra: block anti adblock alert
	var orig_alert = alert;

	unsafeWindow.alert = function (t) {
	  if (t.includes('由於擋廣告插件會影響播放器運作')) return;
	  orig_alert(t);
	};

	var text, title;
	var exportdanmu = $('<a>').on('click', function (e) {
	  e.preventDefault();
	  saveTextAsFile(text, "".concat(title, "_\u5F48\u5E55.json"));
	}).text('把彈幕存成檔案').addClass('anig-tb'); //extra: add a button to download danmu as json file

	var restore = hookSetter(animefun, 'danmu', function (danmu) {
	  text = JSON.stringify(danmu);
	  title = $('.anime_name h1').text();
	  restore();
	});

	var showans = $('<a>').on('click', function (e) {
	  e.preventDefault();
	  ani_video.total_time = 1000;
	  ani_video.currentTime(ani_video.duration());
	}).text('直接顯示動漫通問題').addClass('anig-tb');
	var fetchans = $('<a>').on('click', function (e) {
	  getTodayAnswer().then(function (ans) {
	    alert('答案可能是 ' + ans);
	  }).catch(function (err) {
	    console.error(err);
	    alert('抓取答案失敗，建議去官方粉絲團尋找答案');
	  });
	}).text('試著從 blackxblue 小屋中抓取答案(實驗性)').addClass('anig-tb');
	var answerans = $('<a>').on('click', function (e) {
	  getTodayAnswer().then(answerQuestion).then(function (result) {
	    alert("\u7B54\u984C\u6210\u529F: ".concat(result.gift));
	  }).catch(function (err) {
	    console.error(err);
	    alert("\u56DE\u7B54\u554F\u984C\u5931\u6557: ".concat(err.msg));
	  });
	}).text('直接回答問題(實驗性)').addClass('anig-tb');

	var URL$1 = 'https://greasyfork.org/zh-TW/scripts/370155-%E8%B7%B3%E9%81%8E%E5%8B%95%E7%95%AB%E7%98%8B%E5%BB%A3%E5%91%8A';
	var adskip = $('<a>').on('click', function (e) {
	  if (confirm('這需要下載另一個腳本，請問要打開連結嗎?')) {
	    window.open(URL$1, '_blank');
	    GM_setValue('hideadskip', true);
	    adskip.hide();
	  } else {
	    if (confirm('隱藏此按鈕? 重新安裝腳本可以重新顯示此按鈕')) {
	      GM_setValue('hideadskip', true);
	      adskip.hide();
	    }
	  }
	}).text('跳過動畫瘋廣告 ( 宣傳 )').addClass('anig-tb');

	if (GM_getValue('hideadskip')) {
	  adskip.hide();
	}

	var $ct = $('<div>').addClass('anig-ct');
	$ct.append(exportdanmu).append(showans).append(fetchans).append(answerans).append(adskip);
	$('.anime_name').append($ct).append(m3u8container);

	function styleInject(css, ref) {
	  if ( ref === void 0 ) ref = {};
	  var insertAt = ref.insertAt;

	  if (!css || typeof document === 'undefined') { return; }

	  var head = document.head || document.getElementsByTagName('head')[0];
	  var style = document.createElement('style');
	  style.type = 'text/css';

	  if (insertAt === 'top') {
	    if (head.firstChild) {
	      head.insertBefore(style, head.firstChild);
	    } else {
	      head.appendChild(style);
	    }
	  } else {
	    head.appendChild(style);
	  }

	  if (style.styleSheet) {
	    style.styleSheet.cssText = css;
	  } else {
	    style.appendChild(document.createTextNode(css));
	  }
	}

	var css = ".anig-ct {\r\n\tdisplay: flex;\r\n\twidth: 100%;\r\n\tmargin: 5px;\r\n}\r\n\r\n.anig-tb {\r\n\tdisplay: inline-block;\r\n\tpadding: 5px;\r\n\tbackground: #00B4D8;\r\n\tcolor: #FFF;\r\n\tmargin-right: 5px;\r\n\tborder: 1px solid #BBB;\r\n}\r\n\r\n.tdn{\r\n\ttext-decoration: none;\r\n}\r\n";
	styleInject(css);

}());

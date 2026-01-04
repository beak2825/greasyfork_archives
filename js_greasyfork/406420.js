// ==UserScript==
// @name        YouTube Click To Play
// @name:ja     YouTube Click To Play
// @name:zh-CN  YouTube Click To Play
// @namespace   knoa.jp
// @description It disables autoplay and enables click to play.
// @description:ja 自動再生を無効にし、クリックで再生するようにします。
// @description:zh-CN 它禁用自动播放，并启用点击播放。
// @include     https://www.youtube.com/*
// @noframes
// @run-at      document-start
// @grant       none
// @version     1.1.7
// @downloadURL https://update.greasyfork.org/scripts/406420/YouTube%20Click%20To%20Play.user.js
// @updateURL https://update.greasyfork.org/scripts/406420/YouTube%20Click%20To%20Play.meta.js
// ==/UserScript==

(function(){
  const SCRIPTID = 'YouTubeClickToPlay';
  const SCRIPTNAME = 'YouTube Click To Play';
  const DEBUG = false;/*
[update] 1.1.7
sorry, fixed a cheap bug.

[bug]

[todo]

[possible]
t=n 指定があればむしろサムネではなくその時点の映像にしてあげる？
0秒で常にサムネに戻る仕様？(seekingイベントでよい)
channel/ と watch/ は個別に設定可能とか
  => channelだけで動作する別スクリプトがある
document.hidden でのみ作動するオプションとか

[research]
シアターモードの切り替えで再生してしまう件(そこまで気にしなくてもいい気もする)

[memo]
本スクリプト仕様:
  サムネになってほしい: チャンネルホーム, ビデオページ
  再生してほしい: LIVE, 広告, 途中広告からの復帰
  要確認: 各ページの行き来, 再生で即停止しないこと, シアターモードの切り替え, 背面タブでの起動
  (YouTubeによるあっぱれなユーザー体験の追究のおかげで、初回読み込み時に限り再生開始済みのvideo要素が即出現する)
YouTube仕様:
  画面更新(URL Enter, S-Reload, Reload に本質的な差異なし)
  新規タブ(開いた直後, 読み込み完了後, title変更後 に本質的な差異なし)
    video:   body ... video ... loadstart ... で必ず play() されるのでダミーと入れ替えておけばよい。
      video要素は #player-api 内に出現した後に ytd-watch-flexy 内に移動する。その際に play() されるようだ。
      t=123 のような時刻指定があると seeking 後にもう一度 play() される。
        thumbnail は t=4 以下だとなぜか消えてしまう。(seekじゃなくてadvanceだとみなされるせい？)
    channel: body ... video ... loadstart で即 pause() 可能。(playは踏まれない)
  画面遷移(動画 <=> LIVE <=> チャンネル)
    video:   yt-navigate-start ... loadstart で即 pause() 可能。(playは踏まれない)
  広告
    冒頭広告: .ad-showing 依存だが判定できる。
    広告明け: 少しだけ泥臭いが、そのURLで一度でも本編が再生されていれば広告明けとみなす。
    広告が入ると広告のサムネイルがセットされた状態になるので、独自にセットしなければならない。
      Firefoxなどのブラウザが動画の自動再生をくい止めた場合に備えて広告のサムネイルになると推測。
参考:
  Channelトップの動画でのみ機能するスクリプト
  https://greasyfork.org/ja/scripts/399862-kill-youtube-channel-video-autoplay
  */
  if(window === top && console.time) console.time(SCRIPTID);
  const MS = 1, SECOND = 1000*MS, MINUTE = 60*SECOND, HOUR = 60*MINUTE, DAY = 24*HOUR, WEEK = 7*DAY, MONTH = 30*DAY, YEAR = 365*DAY;
  const THUMBNAILURL = 'https://i.ytimg.com/vi/{id}/maxresdefault.jpg';
  const SDTHUMBNAILURL = 'https://i.ytimg.com/vi/{id}/sddefault.jpg';
  const HQTHUMBNAILURL = 'https://i.ytimg.com/vi/{id}/hqdefault.jpg';
  const FLAGNAME = SCRIPTID.toLowerCase();
  const site = {
    get: {
      moviePlayer: () => $('#movie_player'),
      spinner: () => $('.ytp-spinner'),
      video: () => $(`video:not([data-${FLAGNAME}])`),
      videoId: (url) => (new URL(url)).searchParams.get('v'),
      startTime: () => {
        /* t=1h0m0s or t=3600 */
        let t = (new URL(location.href)).searchParams.get('t');
        if(t === null) return;
        let [h, m, s] = t.match(/^(?:([0-9]+)h)?(?:([0-9]+)m)?(?:([0-9]+)s?)?$/).slice(1).map(n => parseInt(n || 0));
        return 60*60*h + 60*m + s;
      },
    },
    is: {
      immediate: (video) => $('#player-api', player => player.contains(video)),
      live: () => $('.ytp-time-display.ytp-live') !== null,
      ad: () => $('#movie_player.ad-showing') !== null,
      list: () => (new URL(location)).searchParams.get('list') !== null,
      autoplay: () => $('ytd-watch-next-secondary-results-renderer paper-toggle-button.ytd-compact-autoplay-renderer', button => button.checked),
    },
    views: {
      channel: {
        url: /^https:\/\/www\.youtube\.com\/(channel|c|user)\//,
        get: {
          thumbnailOverlayImage: () => $('.ytp-cued-thumbnail-overlay-image'),
          thumbnailURL: () => THUMBNAILURL.replace('{id}', view.get.videoId()),
          sdThumbnailURL: () => SDTHUMBNAILURL.replace('{id}', view.get.videoId()),
          videoId: () => $('a.ytp-title-link[href]', a => site.get.videoId(a.href)),
        },
      },
      watch: {
        url: /^https:\/\/www\.youtube\.com\/watch\?/,
        get: {
          thumbnailOverlayImage: () => $('.ytp-cued-thumbnail-overlay-image'),
          thumbnailURL: () => THUMBNAILURL.replace('{id}', view.get.videoId()),
          sdThumbnailURL: () => SDTHUMBNAILURL.replace('{id}', view.get.videoId()),
          hqThumbnailURL: () => HQTHUMBNAILURL.replace('{id}', view.get.videoId()),
          videoId: () => site.get.videoId(location.href),
          upnextId: () => $('ytd-compact-autoplay-renderer a[href]', a => site.get.videoId(a.href)),
          playlistAutoplayInsertBefore: () => $('ytd-watch-flexy #playlist-actions #save-button'),
          autoplayLabel: () => $('#upnext + #autoplay'),
        },
      },
    },
  };
  let elements = {}, flags = {}, view;
  const core = {
    initialize: function(){
      elements.html = document.documentElement;
      elements.html.classList.add(SCRIPTID);
      core.findVideo();
      core.addStyle('style');
    },
    findVideo: function(){
      const found = function(video){
        //log(video);
        if(video.dataset[FLAGNAME]) return;
        video.dataset[FLAGNAME] = 'found';
        core.listenNavigation();
        core.listenVideo(video);
      };
      /* if a video already exists */
      let video = site.get.video();
      if(video) found(video);
      /* unavoidably observate body for immediate catch */
      observe(document.documentElement, function(records){
        let video = site.get.video();
        if(video) found(video);
      }, {childList: true, subtree: true});
    },
    listenNavigation: function(){
      /* listen navigation (observe URL changes) */
      if(flags.listeningNavigation !== undefined) return;
      flags.listeningNavigation = true;
      let listener = function(e){
        //log(e.type, location.href);
        delete flags.upnextId;/* reset the upnext video id */
        delete flags.shownAd;/* reset the shown ad status */
        delete flags.playedOnce;/* reset the played once status */
        view = core.getView(site.views);
        if(view && view.key === 'watch'){
          flags.upnextId = view.get.upnextId();
          if(site.is.list()) core.setPlaylistAutoplay();
          else core.getAutoplayLabel();
        }
      };
      document.addEventListener('yt-navigate-start', listener);/* click a link */
      window.addEventListener('popstate', listener);/* browser back or foward */
      listener({type: 'theVeryFirst'});/* at the very first */
    },
    listenVideo: function(video){
      let shouldStop = function(video){
        if(site.is.live()) return log('this is a live and should not stop playing');
        if(site.is.ad()) return flags.shownAd = true, log('this is an ad and should not stop playing.');/* shown ad on the current location */
        if(site.is.list() && flags.autoplayOnPlaylist) return log('this is on the playlist and should not stop playing.');
        if(site.is.autoplay() && flags.upnextId === view.get.videoId()) return log('site is set to autoplay and should not stop playing.');
        if(flags.playedOnce) return log('the ad has just closed and the video should continue playing.');
        return true;
      };
      /* for the very immediate time */
      //log(video.currentSrc, 'paused:' + video.paused, 'currentTime:' + video.currentTime);
      if(shouldStop()){
        core.stopAutoplay(video);
        core.stopImmediateAutoplay(video);
      }
      /* the video element just changes its src attribute on any case */
      video.addEventListener('loadstart', function(e){
        //log(e.type, video.currentSrc, 'paused:' + video.paused, 'currentTime:' + video.currentTime, flags.shownAd ? 'shownAd' : '', flags.playedOnce ? 'playedOnce' : '');
        if(shouldStop()){
          core.stopAutoplay(video);
          /* ads just finished and the video is starting */
          if(!site.is.ad() && flags.shownAd && !flags.playedOnce) video.addEventListener('canplay', function(e){
            //log(e.type);
            core.imitateUnstarted(video);
          }, {once: true});
        }
      });
      /* memorize played status for restarting playing or not on after ads */
      video.addEventListener('playing', function(e){
        //log(e.type, 'currentTime:' + video.currentTime);
        if(!site.is.ad() && !flags.playedOnce) return flags.playedOnce = true;/* played once on the current location */
      });
    },
    stopAutoplay: function(video){
      //log();
      video.autoplay = false;
      video.pause();
    },
    stopImmediateAutoplay: function(video){
      let count = 0, isImmediate = site.is.immediate(video), startTime = site.get.startTime();
      //log('isImmediate:' + isImmediate, 'startTime:' + startTime, 'currentTime:' + video.currentTime);
      if(isImmediate) count++;/* for the very first view of the YouTube which plays a video automatically for immediate user experience */
      if(startTime) count++;/* for starting again from middle after seeking with query like t=123 */
      if(count){
        video.originalPlay = video.play;
        video.play = function(){
          //log('(play)', 'count:' + count, site.is.ad() ? 'ad' : '', 'currentTime:' + video.currentTime);
          if(site.is.ad()) return video.originalPlay();
          if(--count === 0) video.play = video.originalPlay;
          let spinner = site.get.spinner();
          if(spinner) spinner.style.display = 'none';
        };
      }
      /* I don't know why but on t < 5, it'll surely be paused but player UI is remained playing. So... */
      if(startTime && startTime < 5) video.addEventListener('seeked', function(e){
        //log(e.type, 'currentTime:' + video.currentTime);
        if(flags.shownAd) return;/*will imitate by canplay event listener*/
        core.imitateUnstarted(video);
      }, {once: true});
    },
    imitateUnstarted: function(video){
      //log();
      let player = site.get.moviePlayer();
      core.setThumbnail(video);
      player.classList.add('imitated-unstarted-mode');
      video.addEventListener('play', function(e){
        //log(e.type, 'now imitated-unstarted-mode', player.classList.contains('imitated-unstarted-mode'));
        video.addEventListener('play', function(e){
          //log(e.type, 'removing imitated-unstarted-mode', player.classList.contains('imitated-unstarted-mode'));
          player.classList.remove('imitated-unstarted-mode');
        }, {once: true});
      }, {once: true});
      video.play();
      video.pause();
    },
    setThumbnail: function(video){
      //log();
      /* normally it will automatically be set, but it won't after ads */
      if(view === undefined) return;
      core.getTarget(view.get.thumbnailOverlayImage).then(thumbnail => {
        /* set the thumbnail of maxres */
        let thumbnailURL = view.get.thumbnailURL();
        thumbnail.style.backgroundImage = `url(${thumbnailURL})`;
        /* if it doesn't have maxres... */
        let makePromise = function(url){
          return new Promise(function(resolve, reject){
            let img = new Image();
            img.src = url;
            img.addEventListener('load', e => resolve(img));
            img.addEventListener('error', e => reject(img));
          });
        };
        Promise.all([
          makePromise(thumbnailURL),
          makePromise(view.get.sdThumbnailURL()),
          makePromise(view.get.hqThumbnailURL()),
        ]).then((imgs) => {
          //log(imgs);
          imgs.sort((a, b) => b.naturalWidth - a.naturalWidth);
          if(thumbnailURL === imgs[0].src) return;
          thumbnail.style.backgroundImage = `url(${imgs[0].src})`;
        });
      });
    },
    setPlaylistAutoplay: function(){
      //log();
      if(flags.autoplayOnPlaylist !== undefined) return;
      flags.autoplayOnPlaylist = Storage.read('autoplayOnPlaylist');
      core.getTarget(view.get.playlistAutoplayInsertBefore).then(insertBefore => {
        let autoplaySwitch = createElement(html.autoplaySwitch(flags.autoplayLabel || Storage.read('autoplayLabel'))), button = autoplaySwitch.querySelector('paper-toggle-button');
        if(flags.autoplayOnPlaylist) button.checked = true;
        /* YouTube listens tap event for toggling playlist collapse */
        autoplaySwitch.addEventListener('tap', function(e){
          //log(e, button, button.checked ? 'checked' : '');
          if(button.checked) flags.autoplayOnPlaylist = true;
          else flags.autoplayOnPlaylist = false;
          Storage.save('autoplayOnPlaylist', flags.autoplayOnPlaylist);
          e.stopPropagation();
        });
        insertBefore.parentNode.insertBefore(autoplaySwitch, insertBefore);
      });
    },
    getAutoplayLabel: function(){
      //log();
      /* get the label everytime for catching language change, it's not such a heavy task' */
      core.getTarget(view.get.autoplayLabel).then(autoplayLabel => {
        if(autoplayLabel.textContent === flags.autoplayLabel) return;
        flags.autoplayLabel = autoplayLabel.textContent;
        Storage.save('autoplayLabel', flags.autoplayLabel);
      });
    },
    getView: function(views){
      Object.keys(views).forEach(key => views[key].key = key);
      let key = Object.keys(views).find(key => views[key].url.test(location.href));
      if(key === undefined) return log('Doesn\'t match any views:', location.href);
      else return views[key];
    },
    getTarget: function(selector, retry = 10, interval = 1*SECOND){
      const key = selector.name;
      const get = function(resolve, reject){
        let selected = selector();
        if(selected && selected.length > 0) selected.forEach((s) => s.dataset.selector = key);/* elements */
        else if(selected instanceof HTMLElement) selected.dataset.selector = key;/* element */
        else if(--retry) return log(`Not found: ${key}, retrying... (${retry})`), setTimeout(get, interval, resolve, reject);
        else return reject(new Error(`Not found: ${selector.name}, I give up.`));
        elements[key] = selected;
        resolve(selected);
      };
      return new Promise(function(resolve, reject){
        get(resolve, reject);
      });
    },
    getTargets: function(selectors, retry = 10, interval = 1*SECOND){
      return Promise.all(Object.values(selectors).map(selector => core.getTarget(selector, retry, interval)));
    },
    addStyle: function(name = 'style'){
      if(html[name] === undefined) return;
      let style = createElement(html[name]());
      document.head.appendChild(style);
      if(elements[name] && elements[name].isConnected) document.head.removeChild(elements[name]);
      elements[name] = style;
    },
  };
  const html = {
    /* YouTube itself will append the button structure to paper-toggle-button, it's so fragile!! */
    autoplaySwitch: (label = 'AUTOPLAY') => `
      <div id="head" class="style-scope ytd-compact-autoplay-renderer" data-${FLAGNAME}="playlist-autoplay">
        <div id="autoplay" class="style-scope ytd-compact-autoplay-renderer">${label}</div>
        <paper-toggle-button id="toggle" noink="" class="style-scope ytd-compact-autoplay-renderer" role="button" aria-pressed="false" tabindex="0" toggles="" aria-disabled="false" aria-label="${label}" style="touch-action: pan-y;"></paper-toggle-button>
      </div>
    `,
    style: () => `
      <style type="text/css" id="${SCRIPTID}-style">
        /* less bold gradient */
        #movie_player .ytp-gradient-bottom{
          background: linear-gradient(to top,
            rgba(0,0,0,.64)   0px,
            rgba(0,0,0,.49)  15px,
            rgba(0,0,0,.36)  30px,
            rgba(0,0,0,.25)  45px,
            rgba(0,0,0,.16)  60px,
            rgba(0,0,0,.09)  75px,
            rgba(0,0,0,.04)  90px,
            rgba(0,0,0,.01) 105px,
            rgba(0,0,0,.00) 120px,
            transparent
          ) !important;/*exponential curve*/
          opacity: 1;
          display: block;
        }
        /* show thumbnails more clearly; affected only for .unstarted-mode */
        #movie_player.unstarted-mode .ytp-gradient-bottom,
        #movie_player.imitated-unstarted-mode .ytp-gradient-bottom{
          opacity: .5;
        }
        #movie_player.unstarted-mode:hover .ytp-gradient-bottom,
        #movie_player.imitated-unstarted-mode:hover .ytp-gradient-bottom{
          opacity: 1;
        }
        /* prevent from sudden disappearing */
        .ytp-autohide .ytp-gradient-bottom{
          opacity: 0 !important;
        }
        /* imitated unstarted mode */
        #movie_player.imitated-unstarted-mode .ytp-cued-thumbnail-overlay{
          display: block !important;
          z-index: 10;
        }
        /* AUTOPLAY button on the playlist */
        [data-${FLAGNAME}="playlist-autoplay"]{
          margin-bottom: 0 !important;
        }
      </style>
    `,
  };
  const setTimeout = window.setTimeout.bind(window), clearTimeout = window.clearTimeout.bind(window), setInterval = window.setInterval.bind(window), clearInterval = window.clearInterval.bind(window), requestAnimationFrame = window.requestAnimationFrame.bind(window);
  const alert = window.alert.bind(window), confirm = window.confirm.bind(window), prompt = window.prompt.bind(window), getComputedStyle = window.getComputedStyle.bind(window), fetch = window.fetch.bind(window);
  if(!('isConnected' in Node.prototype)) Object.defineProperty(Node.prototype, 'isConnected', {get: function(){return document.contains(this)}});
  class Storage{
    static key(key){
      return (SCRIPTID) ? (SCRIPTID + '-' + key) : key;
    }
    static save(key, value, expire = null){
      key = Storage.key(key);
      localStorage[key] = JSON.stringify({
        value: value,
        saved: Date.now(),
        expire: expire,
      });
    }
    static read(key){
      key = Storage.key(key);
      if(localStorage[key] === undefined) return undefined;
      let data = JSON.parse(localStorage[key]);
      if(data.value === undefined) return data;
      if(data.expire === undefined) return data;
      if(data.expire === null) return data.value;
      if(data.expire < Date.now()) return localStorage.removeItem(key);/*undefined*/
      return data.value;
    }
    static remove(key){
      key = Storage.key(key);
      delete localStorage.removeItem(key);
    }
    static delete(key){
      Storage.remove(key);
    }
    static saved(key){
      key = Storage.key(key);
      if(localStorage[key] === undefined) return undefined;
      let data = JSON.parse(localStorage[key]);
      if(data.saved) return data.saved;
      else return undefined;
    }
  }
  const $ = function(s, f){
    let target = document.querySelector(s);
    if(target === null) return null;
    return f ? f(target) : target;
  };
  const $$ = function(s, f){
    let targets = document.querySelectorAll(s);
    return f ? Array.from(targets).map(t => f(t)) : targets;
  };
  const createElement = function(html = '<span></span>'){
    let outer = document.createElement('div');
    outer.innerHTML = html;
    return outer.firstElementChild;
  };
  const observe = function(element, callback, options = {childList: true, characterData: false, subtree: false, attributes: false, attributeFilter: undefined}){
    let observer = new MutationObserver(callback.bind(element));
    observer.observe(element, options);
    return observer;
  };
  const log = function(){
    if(!DEBUG) return;
    let l = log.last = log.now || new Date(), n = log.now = new Date();
    let error = new Error(), line = log.format.getLine(error), callers = log.format.getCallers(error);
    //console.log(error.stack);
    console.log(
      SCRIPTID + ':',
      /* 00:00:00.000  */ n.toLocaleTimeString() + '.' + n.getTime().toString().slice(-3),
      /* +0.000s       */ '+' + ((n-l)/1000).toFixed(3) + 's',
      /* :00           */ ':' + line,
      /* caller.caller */ (callers[2] ? callers[2] + '() => ' : '') +
      /* caller        */ (callers[1] || '') + '()',
      ...arguments
    );
  };
  log.formats = [{
      name: 'Firefox Scratchpad',
      detector: /MARKER@Scratchpad/,
      getLine: (e) => e.stack.split('\n')[1].match(/([0-9]+):[0-9]+$/)[1],
      getCallers: (e) => e.stack.match(/^[^@]*(?=@)/gm),
    }, {
      name: 'Firefox Console',
      detector: /MARKER@debugger/,
      getLine: (e) => e.stack.split('\n')[1].match(/([0-9]+):[0-9]+$/)[1],
      getCallers: (e) => e.stack.match(/^[^@]*(?=@)/gm),
    }, {
      name: 'Firefox Greasemonkey 3',
      detector: /\/gm_scripts\//,
      getLine: (e) => e.stack.split('\n')[1].match(/([0-9]+):[0-9]+$/)[1],
      getCallers: (e) => e.stack.match(/^[^@]*(?=@)/gm),
    }, {
      name: 'Firefox Greasemonkey 4+',
      detector: /MARKER@user-script:/,
      getLine: (e) => e.stack.split('\n')[1].match(/([0-9]+):[0-9]+$/)[1] - 500,
      getCallers: (e) => e.stack.match(/^[^@]*(?=@)/gm),
    }, {
      name: 'Firefox Tampermonkey',
      detector: /MARKER@moz-extension:/,
      getLine: (e) => e.stack.split('\n')[1].match(/([0-9]+):[0-9]+$/)[1] - 2,
      getCallers: (e) => e.stack.match(/^[^@]*(?=@)/gm),
    }, {
      name: 'Chrome Console',
      detector: /at MARKER \(<anonymous>/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)?$/)[1],
      getCallers: (e) => e.stack.match(/[^ ]+(?= \(<anonymous>)/gm),
    }, {
      name: 'Chrome Tampermonkey',
      detector: /at MARKER \(chrome-extension:.*?\/userscript.html\?name=/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)?$/)[1] - 1,
      getCallers: (e) => e.stack.match(/[^ ]+(?= \(chrome-extension:)/gm),
    }, {
      name: 'Chrome Extension',
      detector: /at MARKER \(chrome-extension:/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)?$/)[1],
      getCallers: (e) => e.stack.match(/[^ ]+(?= \(chrome-extension:)/gm),
    }, {
      name: 'Edge Console',
      detector: /at MARKER \(eval/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)$/)[1],
      getCallers: (e) => e.stack.match(/[^ ]+(?= \(eval)/gm),
    }, {
      name: 'Edge Tampermonkey',
      detector: /at MARKER \(Function/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)$/)[1] - 4,
      getCallers: (e) => e.stack.match(/[^ ]+(?= \(Function)/gm),
    }, {
      name: 'Safari',
      detector: /^MARKER$/m,
      getLine: (e) => 0,/*e.lineが用意されているが最終呼び出し位置のみ*/
      getCallers: (e) => e.stack.split('\n'),
    }, {
      name: 'Default',
      detector: /./,
      getLine: (e) => 0,
      getCallers: (e) => [],
  }];
  log.format = log.formats.find(function MARKER(f){
    if(!f.detector.test(new Error().stack)) return false;
    //console.log('////', f.name, 'wants', 0/*line*/, '\n' + new Error().stack);
    return true;
  });
  core.initialize();
  if(window === top && console.timeEnd) console.timeEnd(SCRIPTID);
})();
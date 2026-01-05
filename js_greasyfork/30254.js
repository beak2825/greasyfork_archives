// ==UserScript==
// @name        YouTube RatingBars (Like/Dislike Rating)
// @name:ja     YouTube RatingBars (Like/Dislike Rating)
// @name:zh-CN  YouTube RatingBars (Like/Dislike Rating)
// @namespace   knoa.jp
// @description It shows rating bars which represents Like/Dislike rating ratio.
// @description:ja 動画へのリンクに「高く評価」された比率を示すバーを表示します。
// @description:zh-CN 在与动画的链接中显示表示被“高评价”的比率的栏。
// @include     https://www.youtube.com/*
// @exclude     https://www.youtube.com/live_chat*
// @exclude     https://www.youtube.com/live_chat_replay*
// @include     https://console.cloud.google.com/*
// @version     4.0.12
// @grant       none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/30254/YouTube%20RatingBars%20%28LikeDislike%20Rating%29.user.js
// @updateURL https://update.greasyfork.org/scripts/30254/YouTube%20RatingBars%20%28LikeDislike%20Rating%29.meta.js
// ==/UserScript==

(function(){
  const SCRIPTID = 'YouTubeRatingBars';
  const SCRIPTNAME = 'YouTube RatingBars';
  const DEBUG = false;/*
[update]
Minor fix for YouTube's update.

[bug]

[to do]
定期: 自動取得機能してるか
自分のアイコン内のメニューにあることを示唆するために ratingbars パネルを閉じる際は右上に向けて隠す
スクリプトの説明で設定ボタンの場所をわかりやすく説明とかスクショとか

[possible]
title属性に実数を入れる手もある？

[to research]
スクロールとリサイズだけトリガにして毎秒の処理を軽減する手もあるか
全部にバーを付与した上で中身の幅だけを更新する手も
  URL変わるたびに中身を一度0幅にすれば更新時のアニメーションも不自然ではないか

[memo]
要素はとことん再利用されるので注意。

API Document:
https://developers.google.com/youtube/v3/docs/videos/list
API Quotas:
https://console.developers.google.com/apis/api/youtube.googleapis.com/quotas?project=youtube-ratingbars

先例があった
https://github.com/elliotwaite/thumbnail-rating-bar-for-youtube/issues/17
https://github.com/elliotwaite/thumbnail-rating-bar-for-youtube
各自にAPIキーを取得してもらっているようだ。他の拡張は全滅の様相。

icon:
https://www.onlinewebfonts.com/icon/11481
  */
  if(window === top && console.time) console.time(SCRIPTID);
  const SECOND = 1000, MINUTE = 60*SECOND, HOUR = 60*MINUTE, DAY = 24*HOUR, WEEK = 7*DAY, MONTH = 30*DAY, YEAR = 365*DAY;
  const INTERVAL = 1*SECOND;/*for core.observeItems*/
  const HEIGHT = 2;/*bar height(px)*/
  const THINHEIGHT = 1;/*bar height(px) for videos with few ratings*/
  const RELIABLECOUNT = 10;/*ratings less than this number has less reliability*/
  const STABLECOUNT = 100;/*ratings more than this number has stable reliability*/
  const CACHELIMIT = 30*DAY;/*cache limit for stable videos*/
  const LIKECOLOR = 'rgb(6, 95, 212)';
  const DISLIKECOLOR = 'rgb(204, 204, 204)';
  const FLAG = SCRIPTID.toLowerCase();/*dataset name to add for videos to append a RatingBar*/
  const MAXRESULTS = 48;/* API limits 50 videos per request */
  const API = `https://www.googleapis.com/youtube/v3/videos?id={ids}&part=statistics&fields=items(id,statistics)&maxResults=${MAXRESULTS}&key={apiKey}`;
  const VIDEOID = /\?v=([^&]+)/;/*video id in URL parameters*/
  const RETRY = 10;
  const sites = {
    youtube: {
      url: 'https://www.youtube.com/',
      targets: {
        avatarBtn: () => $('#avatar-btn') || $('ytd-topbar-menu-button-renderer:last-of-type button#button'),
      },
      views: {
        home: {
          url: /^https:\/\/www\.youtube\.com\/([?#].+)?$/,
          videos: () => [...$$('ytd-rich-item-renderer'), ...$$('ytd-rich-grid-video-renderer'), ...$$('ytd-grid-video-renderer'), ...$$('ytd-video-renderer')],
          anchor: (item) => item.querySelector('a'),
          insertAfter: (item) => item.querySelector('#metadata-line'),
        },
        feed: {
          url: /^https:\/\/www\.youtube\.com\/feed\//,
          videos: () => [...$$('ytd-grid-video-renderer'), ...$$('ytd-video-renderer')],
          anchor: (item) => item.querySelector('a'),
          insertAfter: (item) => item.querySelector('#metadata-line'),
        },
        results: {
          url: /^https:\/\/www\.youtube\.com\/results\?/,
          videos: () => $$('ytd-video-renderer'),
          anchor: (item) => item.querySelector('a'),
          insertAfter: (item) => item.querySelector('#metadata-line'),
        },
        watch: {
          url: /^https:\/\/www\.youtube\.com\/watch\?/,
          videos: () => $$('ytd-compact-video-renderer'),
          anchor: (item) => item.querySelector('a'),
          insertAfter: (item) => item.querySelector('#metadata-line'),
        },
        channel: {
          url: /^https:\/\/www\.youtube\.com\/(channel|c|user)\//,
          videos: () => [...$$('ytd-grid-video-renderer'), ...$$('ytd-video-renderer')],
          anchor: (item) => item.querySelector('a'),
          insertAfter: (item) => item.querySelector('#metadata-line'),
        },
        default: {
          url: /^https:\/\/www\.youtube\.com\//,
          videos: () => [...$$('ytd-grid-video-renderer'), ...$$('ytd-video-renderer')],
          anchor: (item) => item.querySelector('a'),
          insertAfter: (item) => item.querySelector('#metadata-line'),
        },
      },
      get: {
        api: (ids) => new Request(API.replace('{apiKey}', configs.apiKey).replace('{ids}', ids.join())),
        bar: (item) => item.querySelector('#container.ytd-sentiment-bar-renderer'),
        accountMenuItem: () => $('ytd-popup-container a[href="/account"]', (a) => a.parentNode),
      },
      is: {
        popupped: () => ($('ytd-popup-container > iron-dropdown:not([aria-hidden="true"])') === null),
      },
    },
    google: {
      views: {
        projectcreate: {/* 1-1. Create a new project */
          url: 'https://console.cloud.google.com/projectcreate',
          targets: {
            anchor: () => $('body'),
            projectName: () => $('proj-name-id-input input'),
            createButton: () => $('.projtest-create-form-submit'),
          },
          styles: {
            'width': '400px',
            'top': '50%',
            'left': '60%',
            'transform': 'translate(-50%, -50%)',
          },
        },
        dashboard: {/* 1-2. Complete the creation */
          url: 'https://console.cloud.google.com/home/dashboard',
          targets: {
            anchor: () => $('body'),
          },
          styles: {
            'width': '400px',
            'top': '50%',
            'left': '50%',
            'transform': 'translate(-50%, -50%)',
          },
          get: {
            createdProjects: () => $$('[icon="status-success"]', (icon) => icon.parentNode),
          },
        },
        library: {/* 2-1. Enable the API */
          url: 'https://console.cloud.google.com/apis/library/youtube.googleapis.com',
          targets: {
            anchor: () => $('body'),
          },
          styles: {
            'width': '400px',
            'top': '50%',
            'left': '60%',
            'transform': 'translate(-50%, -50%)',
          },
        },
        api: {/* 2-2. After the enabling */
          url: 'https://console.cloud.google.com/apis/api/',
          redirect: 'https://console.cloud.google.com/apis/credentials',
        },
        credentials: {/* 3. Create an API Key */
          url: 'https://console.cloud.google.com/apis/credentials',
          targets: {
            anchor: () => $('body'),
            createButton: () => $('button#action-bar-create-button'),
          },
          styles: {
            'width': '400px',
            'top': '50%',
            'left': '50%',
            'transform': 'translate(-50%, -50%)',
          },
          get: {/* MANY WEAK SELECTORS CAUTION */
            apiKeyMenuLabel: () => $('cfc-menu-item[label*="API"]'),
            apiKeyInput: () => $('span[label*="API"] input'),
            restrictKeyButton: () => $('.mat-dialog-actions button[tabindex="0"]'),/* SO WEAK */
            apiRestrictionRadioButtonLabel: () => $('services-key-api-restrictions mat-radio-button:nth-child(2) label'),
            apiRestrictionSelect: () => $('services-key-api-restrictions [role="combobox"]'),
            youtubeDataApiOption: () => Array.from($$('mat-option')).find(o => o.textContent.includes('YouTube Data API v3')),
            saveButton: () => $('form button[type="submit"]'),
            createdKey: () => $('ace-icon[icon="status-success"] + a[href^="/apis/credentials/key/"]'),
          },
        },
        quotas: {/* Check your quota */
          url: 'https://console.cloud.google.com/apis/api/youtube.googleapis.com/quotas',
        },
        error: {
          url: undefined,
          targets: {
            anchor: () => $('body'),
          },
          styles: {
            'width': '400px',
            'top': '50%',
            'left': '50%',
            'transform': 'translate(-50%, -50%)',
          },
        },
      },
    },
  };
  class Configs{
    constructor(configs){
      Configs.PROPERTIES = {
        apiKey: {type: 'string', default:  ''},
      };
      this.data = this.read(configs || {});
      return new Proxy(this, {
        get: function(configs, field){
          if(field in configs) return configs[field];
        }
      });
    }
    read(configs){
      let newConfigs = {};
      Object.keys(Configs.PROPERTIES).forEach(key => {
        if(configs[key] === undefined) return newConfigs[key] = Configs.PROPERTIES[key].default;
        switch(Configs.PROPERTIES[key].type){
          case('bool'):  return newConfigs[key] = (configs[key]) ? 1 : 0;
          case('int'):   return newConfigs[key] = parseInt(configs[key]);
          case('float'): return newConfigs[key] = parseFloat(configs[key]);
          default:       return newConfigs[key] = configs[key];
        }
      });
      return newConfigs;
    }
    toJSON(){
      let json = {};
      Object.keys(this.data).forEach(key => {
        json[key] = this.data[key];
      });
      return json;
    }
    set apiKey(apiKey){this.data.apiKey = apiKey;}
    get apiKey(){return this.data.apiKey;}
  }
  let elements = {}, timers = {}, site, view, panels, configs;
  let cache = {};/* each of identical video elements has a reference to its video ID. */
  /* {'ID': {commentCount: "123", dislikeCount: "12", favoriteCount: "0", likeCount: "1234", viewCount: "12345", timestamp: 1234567890}} */
  let cached = 0;/*cache usage*/
  let videoIdTable = {};/* each of identical video elements has a reference to its video ID. */
  /* {'ID': [element, element, element]} */
  let queue = [];/* each item of the queue has ids to get data from API at once */
  const core = {
    initialize: function(){
      elements.html = document.documentElement;
      elements.html.classList.add(SCRIPTID);
      text.setup(texts, elements.html.lang);
      switch(true){
        case(/^https:\/\/www\.youtube\.com\//.test(location.href)):
          site = sites.youtube;
          core.readyForYouTube();
          core.addStyle('style');
          core.addStyle('panelStyle');
          break;
        case(/^https:\/\/console\.cloud\.google\.com\//.test(location.href)):
          site = sites.google;
          core.readyForGoogle();
          core.addStyle('guideStyle');
          break;
        default:
          log('Doesn\'t match any sites:', location.href)
          break;
      }
    },
    readyForYouTube: function(){
      if(core.commingBack()) return;
      if(document.hidden) return setTimeout(core.readyForYouTube, 1000);
      core.getTargets(site.targets, RETRY).then(() => {
        log("I'm ready for YouTube.");
        core.configs.prepare();
        if(configs.apiKey !== ''){
          core.cacheReady();
          core.observeItems();
          core.export();
        }else{
          log('No API key.');
        }
      }).catch(e => {
        console.error(`${SCRIPTID}:${e.lineNumber} ${e.name}: ${e.message}`);
      });
    },
    commingBack: function(){
      let commingBack = Storage.read('commingBack');
      if(commingBack){
        Storage.remove('commingBack');
        location.assign(commingBack + location.hash);
        return true;
      }
    },
    cacheReady: function(){
      let now = Date.now();
      cache = Storage.read('cache') || {};
      Object.keys(cache).forEach(id => {
        switch(true){
          case(cache[id].timestamp < now - CACHELIMIT):
          case(parseInt(cache[id].dislikeCount) + parseInt(cache[id].likeCount) < STABLECOUNT):
            return delete cache[id];
        }
      });
      window.addEventListener('unload', function(e){
        Storage.save('cache', cache);
      });
    },
    observeItems: function(){
      let previousUrl = '';
      clearInterval(timers.observeItems);
      timers.observeItems = setInterval(function(){
        if(document.hidden) return;
        /* select the view of the current page */
        if(location.href !== previousUrl){
          let key = Object.keys(site.views).find(key => site.views[key].url.test(location.href));
          view = site.views[key];
          previousUrl = location.href;
        }
        /* get the target videos of the current page */
        if(view){
          core.getVideos(view);
        }
        /* get ratings from the API */
        if(queue[0] && queue[0].length){
          core.getRatings(queue.shift());
        }
      }, INTERVAL);
    },
    getVideos: function(view){
      let items = view.videos();
      if(items.length === 0) return;
      /* pushes id to the queue */
      const push = function(id){
        for(let i = 0; true; i++){
          if(queue[i] === undefined) queue[i] = [];
          if(queue[i].length < MAXRESULTS){
            queue[i].push(id);
            break;
          }
        }
      };
      /* push ids to the queue */
      for(let i = 0, item; item = items[i]; i++){
        let a = view.anchor(item);
        if(!a || !a.href){
          log('Not found: anchor.');
          continue;
        }
        let m = a.href.match(VIDEOID), id = m ? m[1] : null;
        if(id === null) continue;
        if(item.dataset[FLAG] === id) continue;/*sometimes DOM was re-used for a different video*/
        item.dataset[FLAG] = id;/*flag for video found by the script*/
        if(!videoIdTable[id]) videoIdTable[id] = [item];
        else videoIdTable[id].push(item);
        if(cache[id]) core.appendBar(item, cache[id]), cached++;
        else push(id);
      }
    },
    getRatings: function(ids){
      fetch(site.get.api(ids))
      .then(response => response.json())
      .then(json => {
        log('JSON from API:', json);
        let items = json.items;
        if(!items || !items.length) return;
        for(let i = 0, now = Date.now(), item; item = items[i]; i++){
          videoIdTable[item.id] = videoIdTable[item.id].filter(v => v.isConnected);
          videoIdTable[item.id].forEach(v => {
            core.appendBar(v, item.statistics);
          });
          cache[item.id] = item.statistics;
          cache[item.id].timestamp = now;
        }
      });
    },
    appendBar: function(item, statistics){
      let s = statistics, likes = parseInt(s.likeCount), dislikes = parseInt(s.dislikeCount);
      if(s.likeCount === undefined) return log('Not found: like count.', item);
      if(likes === 0 && dislikes === 0) return
      let height = (RELIABLECOUNT < likes + dislikes) ? HEIGHT : THINHEIGHT;
      let percentage = (likes / (likes + dislikes)) * 100;
      let bar = createElement(html.bar(height, percentage));
      let insertAfter = view.insertAfter(item);
      if(insertAfter === null) return log('Not found: insertAfter.');
      if(site.get.bar(item)){/*bar already exists*/
        insertAfter.parentNode.replaceChild(bar, insertAfter.nextElementSibling);
      }else{
        insertAfter.parentNode.insertBefore(bar, insertAfter.nextElementSibling);
      }
    },
    export: function(){
      if(DEBUG !== true) return;
      window.save = function(){
        log(
          'Cache length:', Object.keys(cache).length,
          'videoElements:', Object.keys(videoIdTable).map(key => videoIdTable[key].length).reduce((x, y) => x + y),
          'videoIds:', Object.keys(videoIdTable).length,
          'usage:', cached,
          'saved:', ((cached / Object.keys(videoIdTable).length)*100).toFixed(1) + '%',
        );
      };
    },
    configs: {
      prepare: function(){
        panels = new Panels(document.body.appendChild(createElement(html.panels())));
        configs = new Configs(Storage.read('configs') || {});
        if(location.hash.includes('#apiKey=')){
          configs.apiKey = location.hash.match(/#apiKey=(.+)/)[1];
          Storage.save('configs', configs.toJSON());
        }
        core.configs.createPanel();
        core.configs.observePopup();
        if(configs.apiKey === '' || location.hash.includes('#apiKey=')) panels.show('configs');
      },
      observePopup: function(){
        let button = elements.avatarBtn;
        button.addEventListener('click', function(e){
          if(site.is.popupped() === false) return;
          let timer = setInterval(function(){
            let account = site.get.accountMenuItem();
            if(account){
              clearInterval(timer);
              core.configs.appendConfigButton(account);
            }
          }, 125);
        });
      },
      appendConfigButton: function(account){
        let config = elements.configButton = createElement(html.configButton());
        config.addEventListener('click', function(e){
          panels.show('configs');
        });
        account.parentNode.insertBefore(config, account.nextElementSibling);
      },
      createPanel: function(){
        let panel = createElement(html.configPanel()), items = {};
        Array.from(panel.querySelectorAll('[name]')).forEach(e => items[e.name] = e);
        /* getKeyButton */
        let getKeyButton = panel.querySelector(`#${SCRIPTID}-getKeyButton`);
        getKeyButton.addEventListener('click', function(e){
          if(location.href === site.url) return;
          Storage.save('commingBack', location.href.replace(location.hash, ''), Date.now() + 1*HOUR);
        });
        if(items.apiKey.value === '') getKeyButton.classList.add('active');
        items.apiKey.addEventListener('input', function(e){
          if(items.apiKey.value === '') getKeyButton.classList.add('active');
          else getKeyButton.classList.remove('active');
        });
        /* cancel */
        panel.querySelector('button.cancel').addEventListener('click', function(e){
          panels.hide('configs');
          core.configs.createPanel();/*clear*/
        });
        /* save */
        const save = panel.querySelector('button.save');
        save.addEventListener('click', function(e){
          configs = new Configs({
            apiKey: items.apiKey.value,
          });
          Storage.save('configs', configs.toJSON());
          panels.hide('configs');
          core.observeItems();
        });
        panels.add('configs', panel);
      },
    },
    readyForGoogle: function(){
      /* check the guidance session */
      if(location.search.includes(SCRIPTID)) Storage.save('guiding', true, Date.now() + 1*HOUR);
      if(Storage.read('guiding') === undefined) return log('Guidance session time out.');
      /* choose guidance */
      let key = Object.keys(site.views).find(key => location.href.startsWith(site.views[key].url)) || 'error';
      view = site.views[key];
      /* should be redirected */
      if(view.redirect) location.assign(view.redirect);
      /* can show guidance */
      core.getTargets(view.targets, RETRY).then(() => {
        log("I'm ready for Google.");
        core.createGuidance(key);
      }).catch(e => {
        view = site.views.error;
        core.createGuidance('error');
        console.error(`${SCRIPTID}:${e.lineNumber} ${e.name}: ${e.message}`);
      });
    },
    createGuidance: function(key){
      let anchor = elements.anchor, guidance = createElement(html[key](view));
      Object.keys(view.styles).forEach(key => guidance.style[key] = view.styles[key]);
      core.prepareGuidances[key](guidance);
      draggable(guidance);
      guidance.querySelectorAll('a').forEach(a => a.addEventListener('click', e => {
        location.assign(a.href);/* for avoiding google's silent refresh and properly activating this script */
      }));
      guidance.classList.add('hidden');
      anchor.appendChild(guidance);
      setTimeout(() => guidance.classList.remove('hidden'), 1000);
    },
    prepareGuidances: {
      projectcreate: function(guidance){
        log('projectcreate');
        /* default name */
        let projectName = elements.projectName;
        let defaultName = guidance.querySelector('.name.default');
        defaultName.textContent = projectName.value;
        /* auto selection for convenience */
        Array.from(guidance.querySelectorAll('.name')).forEach(name => {
          name.addEventListener('click', function(e){
            window.getSelection().selectAllChildren(name);
          });
        });
        /* create button */
        let createButton = elements.createButton;
        createButton.addEventListener('click', function(e){
          /* it doesn't refresh the page */
          Storage.save('projectName', projectName.value);
          /* hide the guidance */
          guidance.classList.add('hidden');
          setTimeout(() => guidance.parentNode.removeChild(guidance), 1000);
          /* append body layer */
          let layer = createElement(html.bodyLayer());
          document.body.appendChild(layer);
          /* show new guidance for dashboard */
          view = site.views.dashboard;
          core.createGuidance('dashboard');
        });
        /* leave the guidance */
        let leave = guidance.querySelector(`a[href="${sites.google.views.projectcreate.url}"]`);
        leave.addEventListener('click', function(e){
          guidance.parentNode.removeChild(guidance);
          Storage.remove('guiding');
        });
      },
      dashboard: function(guidance){
        log('dashboard');
        let projectName = (Storage.read('projectName') || '').trim();
        let seconds = guidance.querySelector('.secondsLeft');
        let timer = setInterval(function(){
          /* automatically redirect to next step in 60s */
          /* even if project was not created in this page, it will be created on next step */
          seconds.textContent = parseInt(seconds.textContent) - 1;
          if(seconds.textContent === '0') return location.assign(site.views.library.url);
          /* also automatically redirect when the project surely created */
          let projects = view.get.createdProjects();
          if(projects.length === 0) return;
          if(Array.from(projects).some(p => p.textContent.includes(projectName))){
            return setTimeout(() => location.assign(site.views.library.url), 2500);
          }
        }, 1000);
      },
      library: function(guidance){
        log('library');
        /* there're completely different versions of html by unknown conditions, so... */
        let timer = setInterval(function(){
          if(location.href.startsWith(site.views.api.url) === false) return;
          location.assign(sites.google.views.credentials.url);
        }, 1000);
      },
      credentials: function(guidance){
        log('credentials');
        let createButton = elements.createButton, apiKey;
        /* redirect timer */
        let seconds = guidance.querySelector('.secondsLeft');
        let timer = setInterval(function(){
          /* automatically redirect to YouTube in 60s */
          seconds.textContent = parseInt(seconds.textContent) - 1;
          if(seconds.textContent === '0') return location.assign(sites.youtube.url + `#apiKey=${apiKey}`);
        }, 1000);
        /* append body layer */
        let layer = createElement(html.bodyLayer());
        document.body.appendChild(layer);
        /* procedure */
        wait(2500).then(() => {
          createButton.click();
          return core.getTarget(view.get.apiKeyMenuLabel, RETRY);
        }).then((apiKeyMenuLabel) => {
          apiKeyMenuLabel.click();
          return core.getTarget(view.get.apiKeyInput, RETRY);
        }).then(apiKeyInput => {
          apiKey = apiKeyInput.value;
          return core.getTarget(view.get.restrictKeyButton, RETRY);
        }).then(restrictKeyButton => {
          restrictKeyButton.click();
          return core.getTarget(view.get.apiRestrictionRadioButtonLabel, RETRY);
        }).then(apiRestrictionRadioButtonLabel => {
          apiRestrictionRadioButtonLabel.click();
          return core.getTarget(view.get.apiRestrictionSelect, RETRY);
        }).then(apiRestrictionSelect => {
          apiRestrictionSelect.click();
          return core.getTarget(view.get.youtubeDataApiOption, RETRY);
        }).then(youtubeDataApiOption => {
          if(youtubeDataApiOption.classList.contains('mat-selected') === false) youtubeDataApiOption.click();
          return core.getTarget(view.get.saveButton, RETRY);
        }).then(saveButton => {
          saveButton.click();
          return core.getTarget(view.get.createdKey, RETRY);
        }).then(createdKey => {
          Storage.remove('guiding');
          log('Automation completed:');
        }).catch((selector) => {
          log('Automation error:', selector);
          document.body.removeChild(layer);
          clearInterval(timer);
        });
      },
      error: function(guidance){
        log('error');
        let restart = guidance.querySelector(`a[href="${sites.google.views.projectcreate.url}?${SCRIPTID}=true"]`);
        restart.addEventListener('click', function(e){
          guidance.parentNode.removeChild(guidance);
        });
        let search = guidance.querySelector(`#${SCRIPTID}-google-how-to`);
        search.addEventListener('click', function(e){
          Storage.remove('guiding');
        });
      },
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
      let style = createElement(html[name]());
      document.head.appendChild(style);
      if(elements[name] && elements[name].isConnected) document.head.removeChild(elements[name]);
      elements[name] = style;
    },
  };
  const texts = {
    /* common */
    '${SCRIPTNAME}': {
      en: () => `${SCRIPTNAME}`,
      ja: () => `${SCRIPTNAME}`,
      zh: () => `${SCRIPTNAME}`,
    },
    /* setup */
    '${SCRIPTNAME} setup': {
      en: () => `${SCRIPTNAME} setup`,
      ja: () => `${SCRIPTNAME} 設定`,
      zh: () => `${SCRIPTNAME} 设定`,
    },
    'YouTube Data API key': {
      en: () => `YouTube Data API key`,
      ja: () => `YouTube Data API キー`,
      zh: () => `YouTube Data API 密钥`,
    },
    'To make it work properly, you should have a YouTube Data API key. Or you can get it now from Google Cloud Platform for FREE. (I shall guide you!!)': {
      en: () => `To make it work properly, you should have a YouTube Data API key. Or you can get it now from Google Cloud Platform for FREE. (I shall guide you!!)`,
      ja: () => `このスクリプトの動作には YouTube Data API キー が必要です。お持ちでなければ無料でいま取得することもできます。(ご案内します！)`,
      zh: () => `要使其正常工作，您应该有一个 YouTube Data API 密钥。或者你现在可以从 Google Cloud Platform 免费得到它。(我来给你带路！)`,
    },
    'Create your API key on Google': {
      en: () => `Create your API key on Google`,
      ja: () => `Google で API キー を作成する`,
      zh: () => `在 Google 上创建您的 API 密钥`,
    },
    'Check your API key already you have': {
      en: () => `Check your API key already you have`,
      ja: () => `すでにお持ちの API キー を確認する`,
      zh: () => `查看您已经拥有的 API 密钥`,
    },
    'Check your API quota and usage': {
      en: () => `Check your API quota and usage`,
      ja: () => `API 割り当て量と使用量を確認する`,
      zh: () => `检查您的 API 配额和使用情况`,
    },
    'Cancel': {
      en: () => `Cancel`,
      ja: () => `キャンセル`,
      zh: () => `取消`,
    },
    'Save': {
      en: () => `Save`,
      ja: () => `保存`,
      zh: () => `保存`,
    },
    /* guidance */
    '${SCRIPTNAME} guidance': {
      en: () => `${SCRIPTNAME} guidance`,
      ja: () => `${SCRIPTNAME} ガイド`,
      zh: () => `${SCRIPTNAME} 向导`,
    },
    /* projectcreate */
    'Create a new project': {
      en: () => `Create a new project`,
      ja: () => `新しいプロジェクトの作成`,
      zh: () => `创建新项目`,
    },
    '<em>Project name</em>: You can input any name such as "<span class="name">${SCRIPTNAME}</span>" or "<span class="name">Private</span>" or just leave it as "<span class="name default">default</span>".': {
      en: () => `<em>Project name</em>: You can input any name such as "<span class="name">${SCRIPTNAME}</span>" or "<span class="name">Private</span>" or just leave it as "<span class="name default">default</span>".`,
      ja: () => `<em>プロジェクト名</em>: 自由な名前をご入力ください。"<span class="name">${SCRIPTNAME}</span>" や "<span class="name">Private</span>" などでも、"<span class="name default">デフォルト</span>" のままでもかまいません。`,
      zh: () => `<em>项目名称</em>: 可以输入 "<span class="name">${SCRIPTNAME}</span>"、"<span class="name">Private</span>" 等任意名称、也可以保留为 "<span class="name default">默认</span>"。`,
    },
    '<em>Location</em>: Leave it as "No organization".': {
      en: () => `<em>Location</em>: Leave it as "No organization".`,
      ja: () => `<em>場所</em>: "組織なし" のままで大丈夫です。`,
      zh: () => `<em>位置</em>: 保留为 "无组织"。`,
    },
    'Click the <em>CREATE</em> button.': {
      en: () => `Click the <em>CREATE</em> button.`,
      ja: () => `<em>作成</em> ボタンをクリックします。`,
      zh: () => `单击 <em>创建</em> 按钮。`,
    },
    'If you already have a project to use, <a href="${sites.google.views.library.url}">skip this step</a>.': {
      en: () => `If you already have a project to use, <a href="${sites.google.views.library.url}">skip this step</a>.`,
      ja: () => `すでに利用するプロジェクトを作成済みの場合は、<a href="${sites.google.views.library.url}">このステップを飛ばしてください</a>。`,
      zh: () => `如果您已经有项目要使用，<a href="${sites.google.views.library.url}">跳过此步骤</a>。`,
    },
    'Or you can <a href="${sites.google.views.projectcreate.url}">leave this guidance</a>.': {
      en: () => `Or you can <a href="${sites.google.views.projectcreate.url}">leave this guidance</a>.`,
      ja: () => `または<a href="${sites.google.views.projectcreate.url}">このガイダンスを終了することもできます</a>。`,
      zh: () => `或者你可以<a href="${sites.google.views.projectcreate.url}">离开这份向导</a>。`,
    },
    /* dashboard */
    'Wait until the project has been created.': {
      en: () => `Wait until the project has been created.`,
      ja: () => `プロジェクトの作成が完了するまでお待ちください。`,
      zh: () => `等待项目创建完成。`,
    },
    'After creation, you can go to the next step. (You will automatically be redirected within <span class="secondsLeft">60</span> seconds at the most)': {
      en: () => `After creation, you can go to the next step. (You will automatically be redirected within <span class="secondsLeft">60</span> seconds at the most)`,
      ja: () => `完了後に次のステップにお進みいただけます。 (<span class="secondsLeft">60</span>秒以内に自動的に移動します)`,
      zh: () => `完成后可以进入下一步。 (您最多会在<span class="secondsLeft">60</span>秒内自动重定向)`,
    },
    'Enable the YouTube Data API': {
      en: () => `Enable the YouTube Data API`,
      ja: () => `YouTube Data API を有効にする`,
      zh: () => `启用 YouTube Data API`,
    },
    /* library */
    'Enable the API': {
      en: () => `Enable the API`,
      ja: () => `API を有効にします`,
      zh: () => `启用 API`,
    },
    'Just click the <em>ENABLE</em> button.': {
      en: () => `Just click the <em>ENABLE</em> button.`,
      ja: () => `<em>有効にする</em> ボタンをクリックしてください。`,
      zh: () => `只需单击 <em>启用</em> 按钮。`,
    },
    'If a dialog to select a project is shown, select the project you just created.': {
      en: () => `If a dialog to select a project is shown, select the project you just created.`,
      ja: () => `もしプロジェクトを選択するダイアログが表示されたら、先ほど作成したプロジェクトを選択します。`,
      zh: () => `如果显示选择项目的对话框，请选择您刚刚创建的项目。`,
    },
    'Then wait a moment.': {
      en: () => `Then wait a moment.`,
      ja: () => `しばらくお待ちください。`,
      zh: () => `那么请稍等片刻。`,
    },
    'If the API is already enabled, you can go to the next step.': {
      en: () => `If the API is already enabled, you can go to the next step.`,
      ja: () => `すでに API が有効になっている場合は、次のステップにお進みください。`,
      zh: () => `如果 API 已经启用，您可以进入下一步。`,
    },
    'Create an API key': {
      en: () => `Create an API key`,
      ja: () => `API キー を作成する`,
      zh: () => `创建 API 密钥`,
    },
    /* credentials */
    'Now automatically creating API key... (You will be redirected back to <a href="${sites.youtube.url}">YouTube</a> in <span class="secondsLeft">60</span> seconds)': {
      en: () => `Now automatically creating API key... (You will be redirected back to <a href="${sites.youtube.url}">YouTube</a> in <span class="secondsLeft">60</span> seconds)`,
      ja: () => `API キー を作成しています... (<span class="secondsLeft">60</span>秒後に自動的に <a href="${sites.youtube.url}">YouTube</a> に戻ります)`,
      zh: () => `正在自动创建 API 密钥... (您将在<span class="secondsLeft">60</span>秒内被重定向回 <a href="${sites.youtube.url}">YouTube</a>)`,
    },
    'If it fails and stuck, you can check and do the following steps by yourself.': {
      en: () => `If it fails and stuck, you can check and do the following steps by yourself.`,
      ja: () => `失敗して処理が止まった場合は、次の手続きをご自身で確認してください。`,
      zh: () => `如果失败并停止，您可以自行检查并执行以下步骤。`,
    },
    'Click the <em>+ CREATE CREDENTIALS</em> button.': {
      en: () => `Click the <em>+ CREATE CREDENTIALS</em> button.`,
      ja: () => `<em>+ 認証情報を作成</em> ボタンをクリックします。`,
      zh: () => `单击 <em>+ 创建凭据</em> 按钮。`,
    },
    'Click <em>API key</em> on the dropdown menu.': {
      en: () => `Click <em>API key</em> on the dropdown menu.`,
      ja: () => `表示されたメニュー内の <em>API キー</em> をクリックします。`,
      zh: () => `单击下拉菜单上的 <em>API 密钥</em>`,
    },
    'API key will be created.': {
      en: () => `API key will be created.`,
      ja: () => `API キーが作成されます。`,
      zh: () => `将创建 API 密钥。`,
    },
    'Click the <em>RESTRICT KEY</em> button.': {
      en: () => `Click the <em>RESTRICT KEY</em> button.`,
      ja: () => `<em>キーを制限</em> ボタンをクリックします。`,
      zh: () => `单击 <em>限制键</em> 按钮。`,
    },
    'Click the <em>Restrict key</em> radio button on the <em>API restrictions</em> section.': {
      en: () => `Click the <em>Restrict key</em> radio button on the <em>API restrictions</em> section.`,
      ja: () => `<em>API の制限</em> セクション内の <em>キーを制限</em> ラジオボタンをクリックします。`,
      zh: () => `单击 <em>API 限制</em> 部分上的 <em>限制密钥</em> 单选按钮。`,
    },
    'Click the <em>Select APIs</em> dropdown menu and check <em>YouTube Data API v3</em> at (probably) the bottom of the menu.': {
      en: () => `Click the <em>Select APIs</em> dropdown menu and check <em>YouTube Data API v3</em> at (probably) the bottom of the menu.`,
      ja: () => `<em>Select APIs</em> ドロップダウンメニューをクリックし、(おそらく)一番下に表示される <em>YouTube Data API v3</em> にチェックを入れます。`,
      zh: () => `单击 <em>Select APIs</em> 下拉菜单，然后选中菜单底部(可能)的 <em>YouTube Data API v3</em>。`,
    },
    'Click the <em>SAVE</em> button.': {
      en: () => `Click the <em>SAVE</em> button.`,
      ja: () => `<em>保存</em> ボタンをクリックします。`,
      zh: () => `单击 <em>保存</em> 按钮。`,
    },
    'Copy the created API key with the copy icon button on the right.': {
      en: () => `Copy the created API key with the copy icon button on the right.`,
      ja: () => `作成された API キー を、すぐ右隣のコピーアイコンボタンをクリックしてコピーします。`,
      zh: () => `使用右侧的复制图标按钮复制创建的 API 密钥。`,
    },
    'Go to <a href="${sites.youtube.url}">YouTube</a>, then paste and save the key on ${SCRIPTNAME} setup panel.': {
      en: () => `Go to <a href="${sites.youtube.url}">YouTube</a>, then paste and save the key on ${SCRIPTNAME} setup panel.`,
      ja: () => `<a href="${sites.youtube.url}">YouTube</a> へ移動して、${SCRIPTNAME} 設定 パネル内にキーを貼り付け保存します。`,
      zh: () => `转到 <a href="${sites.youtube.url}">YouTube</a>，然后在 ${SCRIPTNAME} 设置 面板上粘贴并保存密钥。`,
    },
    /* error */
    'Sorry, no guidance was found for this page.': {
      en: () => `Sorry, no guidance was found for this page.`,
      ja: () => `申し訳ありません。このページ向けのガイダンスが見つかりませんでした。`,
      zh: () => `抱歉，找不到此页的指导。`,
    },
    'Start over from the first step': {
      en: () => `Start over from the first step`,
      ja: () => `最初からやり直す`,
      zh: () => `从第一步开始`,
    },
    'You can also get an API key by yourself and enter it on YouTube.': {
      en: () => `You can also get an API key by yourself and enter it on YouTube.`,
      ja: () => `独自に API キー を取得してYouTubeで入力することもできます。`,
      zh: () => `您也可以自己获取 API 密钥，然后在 YouTube 上输入。`,
    },
    'https://www.google.com/search?q=How+to+get+YouTube+Data+API+key': {
      en: () => `https://www.google.com/search?q=How+to+get+YouTube+Data+API+key`,
      ja: () => `https://www.google.com/search?q=YouTube+Data+API+キー+取得`,
      zh: () => `https://www.google.com/search?q=YouTube+Data+API+密钥+获取`,
    },
    'Serach how to get an API key': {
      en: () => `Serach how to get an API key`,
      ja: () => `API キー の取得の仕方を検索する`,
      zh: () => `研究如何获取 API 密钥。`,
    },
    '<a href="https://greasyfork.org/en/scripts/30254">Your reporting of this error is very welcomed.</a>': {
      en: () => `<a href="https://greasyfork.org/en/scripts/30254">Your reporting of this error is very welcomed.</a>`,
      ja: () => `<a href="https://greasyfork.org/ja/scripts/30254">エラーの報告を歓迎します。</a>`,
      zh: () => `<a href="https://greasyfork.org/zh-CN/scripts/30254">欢迎报告错误。</a>`,
    },
  };
  const html = {
    bar: (height, percentage) => `
      <div id="container" class="style-scope ytd-sentiment-bar-renderer" style="height:${height}px; background-color:${DISLIKECOLOR}">
        <div id="like-bar" class="style-scope ytd-sentiment-bar-renderer" style="height:${height}px; width:${percentage}%; background-color:${LIKECOLOR}"></div>
      </div>
    `,
    configButton: () => `
      <div id="${SCRIPTID}-configButton">
        <span class="icon"><!-- Svg Vector Icons : http://www.onlinewebfonts.com/icon --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve"><metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata><g><path d="M10,141.7v211.4h980V141.7H10z M960.2,323.3H636V171.6h324.2V323.3z"/><path d="M10,604.6h980V393.1H10V604.6z M960.2,574.7H365.7V423h594.5V574.7z"/><path d="M10,858.3h980V646.8H10V858.3z M960.2,828.4H815.1V676.7h145.1V828.4z"/></g></svg></span>
        <span class="label">${text('${SCRIPTNAME}')}</span>
      </div>
    `,
    panels: () => `<div class="panels" id="${SCRIPTID}-panels" data-panels="0"></div>`,
    configPanel: () => `
      <div class="panel" id="${SCRIPTID}-configPanel" data-order="1">
        <h1>${text('${SCRIPTNAME} setup')}</h1>
        <fieldset>
          <legend>${text('YouTube Data API key')}:</legend>
          <p><input type="text" name="apiKey" value="${configs.apiKey}" placeholder="API key"></p>
          <p class="description">${text('To make it work properly, you should have a YouTube Data API key. Or you can get it now from Google Cloud Platform for FREE. (I shall guide you!!)')}</p>
          <p class="description"><a href="${sites.google.views.projectcreate.url}?${SCRIPTID}=true" id="${SCRIPTID}-getKeyButton" class="button">${text('Create your API key on Google')}</a></p>
          <p class="note"><a href="${sites.google.views.credentials.url}">${text('Check your API key already you have')}</a></p>
          <p class="note"><a href="${sites.google.views.quotas.url}">${text('Check your API quota and usage')}</a></p>
        </fieldset>
        <p class="buttons"><button class="cancel">${text('Cancel')}</button><button class="save primary">${text('Save')}</button></p>
      </div>
    `,
    projectcreate: () => `
      <div class="${SCRIPTID}-guidance">
        <h1>${text('${SCRIPTNAME} guidance')}</h1>
        <p class="message">${text('Create a new project')}</p>
        <ol>
          <li>${text('<em>Project name</em>: You can input any name such as "<span class="name">${SCRIPTNAME}</span>" or "<span class="name">Private</span>" or just leave it as "<span class="name default">default</span>".')}</li>
          <li>${text('<em>Location</em>: Leave it as "No organization".')}</li>
          <li>${text('Click the <em>CREATE</em> button.')}</li>
        </ol>
        <p class="note">${text('If you already have a project to use, <a href="${sites.google.views.library.url}">skip this step</a>.')}</p>
        <p class="note">${text('Or you can <a href="${sites.google.views.projectcreate.url}">leave this guidance</a>.')}</p>
      </div>
    `,
    bodyLayer: () => `<div class="${SCRIPTID}-bodyLayer"></div>`,
    dashboard: () => `
      <div class="${SCRIPTID}-guidance">
        <h1>${text('${SCRIPTNAME} guidance')}</h1>
        <ol>
          <li>${text('Wait until the project has been created.')}</li>
          <li>${text('After creation, you can go to the next step. (You will automatically be redirected within <span class="secondsLeft">60</span> seconds at the most)')} <a href="${sites.google.views.library.url}">${text('Enable the YouTube Data API')}</a></li>
        </ol>
      </div>
    `,
    library: () => `
      <div class="${SCRIPTID}-guidance">
        <h1>${text('${SCRIPTNAME} guidance')}</h1>
        <p class="message">${text('Enable the API')}</p>
        <ol>
          <li>
            ${text('Just click the <em>ENABLE</em> button.')}
            <p class="note">${text('If the API is already enabled, you can go to the next step.')} → <a href="${sites.google.views.credentials.url}">${text('Create an API key')}</a></p>
          </li>
          <li>${text('If a dialog to select a project is shown, select the project you just created.')}</li>
          <li>${text('Then wait a moment.')}</li>
        </ol>
      </div>
    `,
    credentials: () => `
      <div class="${SCRIPTID}-guidance">
        <h1>${text('${SCRIPTNAME} guidance')}</h1>
        <p class="message">${text('Now automatically creating API key... (You will be redirected back to <a href="${sites.youtube.url}">YouTube</a> in <span class="secondsLeft">60</span> seconds)')}</p>
        <p>${text('If it fails and stuck, you can check and do the following steps by yourself.')}</p>
        <ol>
          <li>${text('Click the <em>+ CREATE CREDENTIALS</em> button.')}</li>
          <li>${text('Click <em>API key</em> on the dropdown menu.')}</li>
          <li>${text('API key will be created.')}</li>
          <li>${text('Click the <em>RESTRICT KEY</em> button.')}</li>
          <li>${text('Click the <em>Restrict key</em> radio button on the <em>API restrictions</em> section.')}</li>
          <li>${text('Click the <em>Select APIs</em> dropdown menu and check <em>YouTube Data API v3</em> at (probably) the bottom of the menu.')}</li>
          <li>${text('Click the <em>SAVE</em> button.')}</li>
          <li>${text('Copy the created API key with the copy icon button on the right.')}</li>
          <li>${text('Go to <a href="${sites.youtube.url}">YouTube</a>, then paste and save the key on ${SCRIPTNAME} setup panel.')}</li>
        </ol>
      </div>
    `,
    error: () => `
      <div class="${SCRIPTID}-guidance">
        <h1>${text('${SCRIPTNAME} guidance')}</h1>
        <p class="message">${text('Sorry, no guidance was found for this page.')}</p>
        <p><a href="${sites.google.views.projectcreate.url}?${SCRIPTID}=true" class="button active">${text('Start over from the first step')}</a></p>
        <p>${text('You can also get an API key by yourself and enter it on YouTube.')}</p>
        <p><a href="${text('https://www.google.com/search?q=How+to+get+YouTube+Data+API+key')}" class="button active" id="${SCRIPTID}-google-how-to">${text('Serach how to get an API key')}</a></p>
        <p class="note">${text('<a href="https://greasyfork.org/en/scripts/30254">Your reporting of this error is very welcomed.</a>')}</p>
      </div>
    `,
    style: () => `
      <style type="text/css" id="${SCRIPTID}-style">
        /* maximize bar width */
        #meta.ytd-rich-grid-video-renderer/*home*/,
        #meta.ytd-rich-grid-media/*home*/,
        ytd-video-meta-block,
        #metadata.ytd-video-meta-block,
        #container.ytd-sentiment-bar-renderer,
        .metadata.ytd-compact-video-renderer{
          width: 100%;
        }
        /* rating bars */
        #container.ytd-sentiment-bar-renderer{
          margin-bottom: 1px;/*gap for LIVE, NEW banner*/
          animation: ${SCRIPTID}-show 250ms 1;/*softly show bars*/
        }
        @keyframes ${SCRIPTID}-show{
          from{
            opacity: 0;
          }
          to{
            opacity: 1;
          }
        }
        /* config button */
        #${SCRIPTID}-configButton{
          height: 40px;
          padding: var(--yt-compact-link-paper-item-padding, 0px 36px 0 16px);
          font-size: var(--ytd-user-comment_-_font-size);
          font-weight: var(--ytd-user-comment_-_font-weight);
          line-height: 40px;
          color: var(--yt-compact-link-color, var(--yt-spec-text-primary));
          font-family: var(--paper-font-subhead_-_font-family);
          cursor: pointer;
          display: flex;
        }
        #${SCRIPTID}-configButton:hover{
          background: var(--yt-spec-badge-chip-background);
        }
        #${SCRIPTID}-configButton .icon{
          margin-right: 16px;
          width: 24px;
          height: 40px;
          fill: gray;
          display: flex;
        }
        #${SCRIPTID}-configButton .icon svg{
          width: 100%;
          height: 100%;
        }
      </style>
    `,
    panelStyle: () => `
      <style type="text/css" id="${SCRIPTID}-panelStyle">
        /* panels default */
        #${SCRIPTID}-panels *{
          font-size: 14px;
          line-height: 20px;
          padding: 0;
          margin: 0;
        }
        #${SCRIPTID}-panels{
          font-family: Arial, sans-serif;
          position: fixed;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          overflow: hidden;
          pointer-events: none;
          cursor: default;
          z-index: 99999;
        }
        #${SCRIPTID}-panels div.panel{
          position: absolute;
          max-height: 100%;
          overflow: auto;
          left: 50%;
          bottom: 50%;
          transform: translate(-50%, 50%);
          background: rgba(0,0,0,.75);
          transition: 250ms;
          padding: 5px 0;
          pointer-events: auto;
        }
        #${SCRIPTID}-panels div.panel.hidden{
          bottom: 0;
          transform: translate(-50%, 100%) !important;
          display: block !important;
        }
        #${SCRIPTID}-panels div.panel.hidden *{
          animation: none !important;
        }
        #${SCRIPTID}-panels h1,
        #${SCRIPTID}-panels h2,
        #${SCRIPTID}-panels h3,
        #${SCRIPTID}-panels h4,
        #${SCRIPTID}-panels legend,
        #${SCRIPTID}-panels ul,
        #${SCRIPTID}-panels ol,
        #${SCRIPTID}-panels dl,
        #${SCRIPTID}-panels p{
          color: white;
          padding: 2px 10px;
          vertical-align: baseline;
        }
        #${SCRIPTID}-panels legend ~ p,
        #${SCRIPTID}-panels legend ~ ul,
        #${SCRIPTID}-panels legend ~ ol,
        #${SCRIPTID}-panels legend ~ dl{
          padding-left: calc(10px + 14px);
        }
        #${SCRIPTID}-panels header{
          display: flex;
        }
        #${SCRIPTID}-panels header h1{
          flex: 1;
        }
        #${SCRIPTID}-panels fieldset{
          border: none;
        }
        #${SCRIPTID}-panels fieldset > p{
          display: flex;
          align-items: center;
        }
        #${SCRIPTID}-panels fieldset > p:not([class]):hover{
          background: rgba(255,255,255,.125);
        }
        #${SCRIPTID}-panels fieldset > p > label{
          flex: 1;
        }
        #${SCRIPTID}-panels fieldset > p > input,
        #${SCRIPTID}-panels fieldset > p > textarea,
        #${SCRIPTID}-panels fieldset > p > select{
          color: black;
          background: white;
          padding: 1px 2px;
        }
        #${SCRIPTID}-panels fieldset > p > input,
        #${SCRIPTID}-panels fieldset > p > button{
          box-sizing: border-box;
          height: 20px;
        }
        #${SCRIPTID}-panels fieldset small{
          font-size: 12px;
          margin: 0 0 0 .25em;
        }
        #${SCRIPTID}-panels fieldset sup,
        #${SCRIPTID}-panels fieldset p.note{
          font-size: 10px;
          line-height: 14px;
          color: rgb(192,192,192);
        }
        #${SCRIPTID}-panels a{
          color: inherit;
          font-size: inherit;
          line-height: inherit;
        }
        #${SCRIPTID}-panels a:hover{
          color: rgb(224,224,224);
        }
        #${SCRIPTID}-panels div.panel > p.buttons{
          text-align: right;
          padding: 5px 10px;
        }
        #${SCRIPTID}-panels div.panel > p.buttons button{
          line-height: 1.4;
          width: 120px;
          padding: 5px 10px;
          margin-left: 10px;
          border-radius: 5px;
          color: rgba(255,255,255,1);
          background: rgba(64,64,64,1);
          border: 1px solid rgba(255,255,255,1);
          cursor: pointer;
        }
        #${SCRIPTID}-panels div.panel > p.buttons button.primary{
          font-weight: bold;
          background: rgba(0,0,0,1);
        }
        #${SCRIPTID}-panels div.panel > p.buttons button.primary.active{
          background: rgba(0,0,255,1);
        }
        #${SCRIPTID}-panels div.panel > p.buttons button:hover,
        #${SCRIPTID}-panels div.panel > p.buttons button:focus{
          background: rgba(128,128,128,1);
        }
        #${SCRIPTID}-panels .template{
          display: none !important;
        }
        /* config panel */
        #${SCRIPTID}-configPanel{
          width: 380px;
        }
        [name="apiKey"]{
          width: 100%;
        }
        #${SCRIPTID}-configPanel a.button{
          background: rgb(128,128,128);
          color: white;
          padding: 5px 10px;
          margin: 5px 0;
          border: 1px solid white;
          border-radius: 5px;
          display: inline-block;
          text-decoration: none;
        }
        #${SCRIPTID}-configPanel a.button.active{
          background: rgb(6, 95, 212);
        }
        #${SCRIPTID}-configPanel a.button:hover,
        #${SCRIPTID}-configPanel a.button:focus{
          background: rgb(112, 172, 251);
        }
      </style>
    `,
    guideStyle: () => `
      <style type="text/css" id="${SCRIPTID}-guideStyle">
        /* overlay */
        .${SCRIPTID}-bodyLayer{
          width: 100%;
          height: 100%;
          background: rgba(255,255,255,.75);
          z-index: 99990;
          position: fixed;
          top: 0;
          left: 0;
        }
        /* guide panel */
        .${SCRIPTID}-guidance{
          font-size: 14px !important;
          line-height: 20px !important;
          background: rgba(0,0,0,.75);
          padding: 5px 0;
          position: absolute;
          z-index: 99999;
          transition: opacity 1s;
        }
        .${SCRIPTID}-guidance.hidden{
          opacity: 0;
        }
        .${SCRIPTID}-guidance *{
          font-size: inherit !important;
          line-height: inherit !important;
          color: white !important;
        }
        .${SCRIPTID}-guidance a{
          font-size: inherit !important;
          line-height: inherit !important;
          color: inherit !important;
          border-color: inherit !important;
          text-decoration: underline !important;
        }
        .${SCRIPTID}-guidance a:hover{
          color: rgb(224,224,224) !important;
        }
        .${SCRIPTID}-guidance h1,
        .${SCRIPTID}-guidance p{
          padding: 2px 10px !important;
          margin: 0 !important;
          display: block;
          bottom: 0;/* overwrite google */
        }
        .${SCRIPTID}-guidance p.message{
          font-size: 20px !important;
          line-height: 28px !important;
          background: rgba(255,255,255,.125) !important;
          padding: 5px 10px !important;
        }
        .${SCRIPTID}-guidance p.note{
          font-size: 10px !important;
          line-height: 14px !important;
          color: rgb(192,192,192) !important;
        }
        .${SCRIPTID}-guidance h1{
          color: rgb(192,192,192) !important;
        }
        .${SCRIPTID}-guidance ol{
          padding-left: 2em;
          margin: 5px 0 !important;
          list-style-type: decimal;
        }
        .${SCRIPTID}-guidance li{
          padding: 2px 10px 2px 0 !important;
          margin: 5px 0 !important;
        }
        .${SCRIPTID}-guidance em{
          font-weight: bold !important;
          font-style: normal !important;
        }
        .${SCRIPTID}-guidance span.name{
          background: rgba(255,255,255,.25);
          cursor: pointer;
        }
        .${SCRIPTID}-guidance a.button{
          background: rgb(128,128,128);
          color: white;
          padding: 5px 10px;
          margin: 5px 0;
          border: 1px solid white;
          border-radius: 5px;
          display: inline-block;
          text-decoration: none;
        }
        .${SCRIPTID}-guidance a.button.active{
          background: rgb(6, 95, 212);
        }
        .${SCRIPTID}-guidance a.button:hover,
        .${SCRIPTID}-guidance a.button:focus{
          background: rgb(112, 172, 251);
        }
        .draggable{
          cursor: move;
        }
        .draggable.dragging{
          user-select: none;
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
  class Panels{
    constructor(parent){
      this.parent = parent;
      this.panels = {};
      this.listen();
    }
    listen(){
      window.addEventListener('keydown', (e) => {
        if(e.key !== 'Escape') return;
        if(['input', 'textarea'].includes(document.activeElement.localName)) return;
        Object.keys(this.panels).forEach(key => this.hide(key));
      }, true);
    }
    add(name, panel){
      this.panels[name] = panel;
    }
    toggle(name){
      let panel = this.panels[name];
      if(panel.isConnected === false || panel.classList.contains('hidden')) this.show(name);
      else this.hide(name);
    }
    show(name){
      let panel = this.panels[name];
      if(panel.isConnected) return;
      panel.classList.add('hidden');
      this.parent.appendChild(panel);
      this.parent.dataset.panels = parseInt(this.parent.dataset.panels) + 1;
      animate(() => panel.classList.remove('hidden'));
    }
    hide(name){
      let panel = this.panels[name];
      if(panel.classList.contains('hidden')) return;
      panel.classList.add('hidden');
      panel.addEventListener('transitionend', (e) => {
        this.parent.removeChild(panel);
        this.parent.dataset.panels = parseInt(this.parent.dataset.panels) - 1;
      }, {once: true});
    }
  }
  const text = function(key, ...args){
    if(text.texts[key] === undefined){
      log('Not found text key:', key);
      return key;
    }else return text.texts[key](args);
  };
  text.setup = function(texts, language){
    let languages = [...window.navigator.languages];
    if(language) languages.unshift(...String(language).split('-').map((p,i,a) => a.slice(0,1+i).join('-')).reverse());
    if(!languages.includes('en')) languages.push('en');
    languages = languages.map(l => l.toLowerCase());
    Object.keys(texts).forEach(key => {
      Object.keys(texts[key]).forEach(l => texts[key][l.toLowerCase()] = texts[key][l]);
      texts[key] = texts[key][languages.find(l => texts[key][l] !== undefined)] || (() => key);
    });
    text.texts = texts;
  };
  const $ = function(s, f){
    let target = document.querySelector(s);
    if(target === null) return null;
    return f ? f(target) : target;
  };
  const $$ = function(s, f){
    let targets = document.querySelectorAll(s);
    return f ? Array.from(targets).map(t => f(t)) : targets;
  };
  const animate = function(callback, ...params){requestAnimationFrame(() => requestAnimationFrame(() => callback(...params)))};
  const wait = function(ms){return new Promise((resolve) => setTimeout(resolve, ms))};
  const createElement = function(html = '<span></span>'){
    let outer = document.createElement('div');
    outer.innerHTML = html;
    return outer.firstElementChild;
  };
  const observe = function(element, callback, options = {childList: true, attributes: false, characterData: false}){
    let observer = new MutationObserver(callback.bind(element));
    observer.observe(element, options);
    return observer;
  };
  const draggable = function(element){
    const DELAY = 125;/* catching up mouse position while fast dragging (ms) */
    const mousedown = function(e){
      if(e.button !== 0) return;
      element.classList.add('dragging');
      [screenX, screenY] = [e.screenX, e.screenY];
      [a,b,c,d,tx,ty] = (getComputedStyle(element).transform.match(/[-0-9.]+/g) || [1,0,0,1,0,0]).map((n) => parseFloat(n));
      window.addEventListener('mousemove', mousemove);
      window.addEventListener('mouseup', mouseup, {once: true});
      document.body.addEventListener('mouseleave', mouseup, {once: true});
      element.addEventListener('mouseleave', mouseleave, {once: true});
    };
    const mousemove = function(e){
      element.style.transform = `matrix(${a},${b},${c},${d},${tx + (e.screenX - screenX)},${ty + (e.screenY - screenY)})`;
    };
    const mouseup = function(e){
      element.classList.remove('dragging');
      window.removeEventListener('mousemove', mousemove);
    };
    const mouseleave = function(e){
      let timer = setTimeout(mouseup, DELAY);
      element.addEventListener('mouseenter', clearTimeout.bind(window, timer), {once: true});
    };
    let screenX, screenY, a, b, c, d, tx, ty;
    element.classList.add('draggable');
    element.addEventListener('mousedown', mousedown);
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
      getLine: (e) => e.stack.split('\n')[1].match(/([0-9]+):[0-9]+$/)[1] - 6,
      getCallers: (e) => e.stack.match(/^[^@]*(?=@)/gm),
    }, {
      name: 'Chrome Console',
      detector: /at MARKER \(<anonymous>/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)$/)[1],
      getCallers: (e) => e.stack.match(/[^ ]+(?= \(<anonymous>)/gm),
    }, {
      name: 'Chrome Tampermonkey',
      detector: /at MARKER \(chrome-extension:.*?\/userscript.html\?id=/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)?$/)[1] - 3,
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
    //console.log('//// ' + f.name + '\n' + new Error().stack);
    return true;
  });
  core.initialize();
  if(window === top && console.timeEnd) console.timeEnd(SCRIPTID);
})();
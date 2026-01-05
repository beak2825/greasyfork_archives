// ==UserScript==
// @name        CapTube
// @namespace   https://github.com/segabito/
// @description "S"キーでYouTubeのスクリーンショット保存
// @include     https://www.youtube.com/*
// @include     https://www.youtube.com/embed/*
// @include     https://youtube.com/*
// @version     0.0.10
// @grant       none
// @license     public domain
// @downloadURL https://update.greasyfork.org/scripts/24696/CapTube.user.js
// @updateURL https://update.greasyfork.org/scripts/24696/CapTube.meta.js
// ==/UserScript==

(function() {

  let previewContainer = null, meterContainer = null;
  const addStyle = function(styles, id) {
    var elm = document.createElement('style');
    elm.type = 'text/css';
    if (id) { elm.id = id; }

    var text = styles.toString();
    text = document.createTextNode(text);
    elm.appendChild(text);
    var head = document.getElementsByTagName('head');
    head = head[0];
    head.appendChild(elm);
    return elm;
  };

  const createWebWorker = function(func) {
    const src = func.toString().replace(/^function.*?\{/, '').replace(/}$/, '');
    const blob = new Blob([src], {type: 'text\/javascript'});
    const url = URL.createObjectURL(blob);

    return new Worker(url);
  };

  const callOnIdle = function(func) {
    if (window.requestIdleCallback) {
      window.requestIdleCallback(func);
    } else {
      setTimeout(func, 0);
    }
  };

  const DataUrlConv = (function() {
    const sessions = {};

    const func = function(self) {
      self.onmessage = function(e) {
        const dataURL   = e.data.dataURL;
        const sessionId = e.data.sessionId;

        const bin = atob(dataURL.split(',')[1]);
        const buf = new Uint8Array(bin.length);

        for (let i = 0, len = buf.length; i < len; i++) {
          buf[i] = bin.charCodeAt(i);
        }

        const blob = new Blob([buf.buffer], {type: 'image/png'});
        const objectURL = URL.createObjectURL(blob);
    
        self.postMessage({objectURL, sessionId});
      };
    };

    const worker = createWebWorker(func);
    worker.addEventListener('message', (e) => {
      const sessionId = e.data.sessionId;
      if (!sessions[sessionId]) { return; }

      (sessions[sessionId])(e.data.objectURL);
      delete sessions[sessionId];
    });

    return {
      toObjectURL: function(dataURL) {
        return new Promise(resolve => {
          const sessionId = 'id:' + Math.random();
          sessions[sessionId] = resolve;
          worker.postMessage({dataURL, sessionId});
        });
      }
    };
  })();


  const __css__ = (`
    #CapTubePreviewContainer {
      position: fixed;
      padding: 16px 0 0 16px;
      width: 90%;
      bottom: 100px;
      left: 5%;
      z-index: 10000;
      pointer-events: none;
      transform: translateZ(0);
      /*background: rgba(192, 192, 192, 0.4);*/
      border: 1px solid #ccc;
      -webkit-user-select: none;
      user-select: none;
    }

    #CapTubePreviewContainer:empty {
      display: none;
    }
      #CapTubePreviewContainer canvas {
        display: inline-block;
        width: 256px;
        margin-right: 16px;
        margin-bottom: 16px;
        outline: solid 1px #ccc;
        outline-offset: 4px;
        transform: translateZ(0);
        transition:
          1s opacity      linear,
          1s margin-right linear;
      }

      #CapTubePreviewContainer canvas.is-removing {
        opacity: 0;
        margin-right: -272px;
        /*width: 0;*/
      }

    #CapTubeMeterContainer {
      pointer-events: none;
      position: fixed;
      width: 26px;
      bottom: 100px;
      left: 16px;
      z-index: 10000;
      border: 1px solid #ccc;
      transform: translateZ(0);
      -webkit-user-select: none;
      user-select: none;
     }

     #CapTubeMeterContainer::after {
       content: 'queue';
       position: absolute;
       bottom: -2px;
       left: 50%;
       transform: translate(-50%, 100%);
       color: #666;
     }

    #CapTubeMeterContainer:empty {
      display: none;
    }

      #CapTubeMeterContainer .memory {
        display: block;
        width: 24px;
        height: 8px;
        margin: 1px 0 0;
        background: darkgreen;
        opacity: 0.5;
        border: 1px solid #ccc;
      }

  `).trim();

  addStyle(__css__);

  const getVideoId = function() {
    var id = '';
    location.search.substring(1).split('&').forEach(function(item){
      if (item.split('=')[0] === 'v') { id = item.split('=')[1]; }
    });
    return id;
  };

  const toSafeName = function(text) {
    text = text.trim()
      .replace(/</g, '＜')
      .replace(/>/g, '＞')
      .replace(/\?/g, '？')
      .replace(/:/g, '：')
      .replace(/\|/g, '｜')
      .replace(/\//g, '／')
      .replace(/\\/g, '￥')
      .replace(/"/g, '”')
      .replace(/\./g, '．')
      ;
    return text;
  };

  const getVideoTitle = function(params = {title, videoId, author}) {
    var prefix = localStorage['CapTube-prefix']  || '';
    var videoId = params.videoId || getVideoId();
    var title = document.querySelector('.title yt-formatted-string') || document.querySelector('.watch-title') || {textContent: document.title};
    var authorName = toSafeName(
      params.author || document.querySelector('#owner-container yt-formatted-string').textContent || '');
    var titleText = toSafeName(params.title || title.textContent);
    titleText = prefix + titleText + ' - by ' + authorName + ' (v=' + videoId + ')';

    return titleText;
  };

  const createCanvasFromVideo = function(video) {
    console.time('createCanvasFromVideo');
    const width = video.videoWidth;
    const height = video.videoHeight;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0);


    const thumbnail = document.createElement('canvas');
    thumbnail.width = 256;
    thumbnail.height = canvas.height * (256 / canvas.width);
    thumbnail.getContext('2d').drawImage(canvas, 0, 0, thumbnail.width, thumbnail.height);
    console.timeEnd('createCanvasFromVideo');

    return {canvas, thumbnail};
  };

  const getFileName = function(video, params = {title, videoId, author}) {
    const title = getVideoTitle(params);
    const currentTime = video.currentTime;
    const min = Math.floor(currentTime / 60);
    const sec = (currentTime % 60 + 100).toString().substr(1, 6);
    const time = `${min}_${sec}`;

    return `${title}@${time}.png`;
  };
  /*
  const createBlobLinkElement = function(canvas, fileName) {
    console.time('createBlobLinkElement');

    console.time('canvas.toDataURL');
    const dataURL = canvas.toDataURL('image/png');
    console.timeEnd('canvas.toDataURL');

    console.time('createObjectURL');
    const bin = atob(dataURL.split(',')[1]);
    const buf = new Uint8Array(bin.length);
    for (let i = 0, len = buf.length; i < len; i++) { buf[i] = bin.charCodeAt(i); }
    const blob = new Blob([buf.buffer], {type: 'image/png'});
    const url = window.URL.createObjectURL(blob);
    console.timeEnd('createObjectURL');

    const link = document.createElement('a');
    link.setAttribute('download', fileName);
    link.setAttribute('target', '_blank');
    link.setAttribute('href', url);

    console.timeEnd('createBlobLinkElement');
    return link;
  };
  */

  const createBlobLinkElementAsync = function(canvas, fileName) {
    //console.time('createBlobLinkElement');

    console.time('canvas to DataURL');
    const dataURL = canvas.toDataURL('image/png');
    console.timeEnd('canvas to DataURL');

    console.time('dataURL to objectURL');

    return DataUrlConv.toObjectURL(dataURL).then(objectURL => {
      console.timeEnd('dataURL to objectURL');

      const link = document.createElement('a');
      link.setAttribute('download', fileName);
      //link.setAttribute('target', '_blank');
      link.setAttribute('href', objectURL);

      //console.timeEnd('createBlobLinkElement');
      return Promise.resolve(link);
    });
   };

  const saveScreenShot = function(params = {title, videoId, author}) {
    const video = document.querySelector('.html5-main-video');
    if (!video) { return; }

    const meter = document.createElement('div');
    if (meterContainer) {
      meter.className = 'memory';
      meterContainer.appendChild(meter);
    }

    const {canvas, thumbnail} = createCanvasFromVideo(video);
    const fileName = getFileName(video, params);

    const create = () => {
      createBlobLinkElementAsync(canvas, fileName).then(link => {
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          link.remove();
          meter.remove();
          URL.revokeObjectURL(link.getAttribute('href'));
        }, 1000);
      });
    };

    callOnIdle(create);

    if (!previewContainer) { return; }
    previewContainer.appendChild(thumbnail);
    setTimeout(() => {
      thumbnail.classList.add('is-removing');
      setTimeout(() => { thumbnail.remove(); }, 2000);
    }, 1500);
  };

  const setPlaybackRate = function(v) {
    const video = document.querySelector('.html5-main-video');
    if (!video) { return; }
    video.playbackRate = v;
  };

  const togglePlay = function() {
    const video = document.querySelector('.html5-main-video');
    if (!video) { return; }

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const seekBy = function(v) {
    const video = document.querySelector('.html5-main-video');
    if (!video) { return; }

    const ct = Math.max(video.currentTime + v, 0);
    video.currentTime = ct;
  };

  let isVerySlow = false;
  const onKeyDown = (e) => {
    const key = e.key.toLowerCase();
    switch (key) {
      case 'd':
        setPlaybackRate(0.1);
        isVerySlow = true;
        break;
      case 's':
        saveScreenShot({});
        break;
    }
  };

  const onKeyUp = (e) => {
    //console.log('onKeyUp', e);
    const key = e.key.toLowerCase();
    switch (key) {
      case 'd':
        setPlaybackRate(1);
        isVerySlow = false;
        break;
    }
  };

  const onKeyPress = (e) => {
    const key = e.key.toLowerCase();
    switch (key) {
      case 'w':
        togglePlay();
        break;
      case 'a':
        seekBy(isVerySlow ? -0.5 : -5);
        break;
    }
  };


  const initDom = function() {
    const div = document.createElement('div');
    div.id = 'CapTubePreviewContainer';
    document.body.appendChild(div);
    previewContainer = div;

    meterContainer = document.createElement('div');
    meterContainer.id = 'CapTubeMeterContainer';
    document.body.appendChild(meterContainer);
   };

  const HOST_REG = /^[a-z0-9]*\.nicovideo\.jp$/;

  const parseUrl = (url) => {
    const a = document.createElement('a');
    a.href = url;
    return a;
  };


  const initialize = function() {
    initDom();
    window.addEventListener('keydown',  onKeyDown);
    window.addEventListener('keyup',    onKeyUp);
    window.addEventListener('keypress', onKeyPress);
  };

  const initializeEmbed = function() {
    let parentHost = parseUrl(document.referrer).hostname;
    if (!HOST_REG.test(parentHost)) {
      window.console.log('disable bridge');
      return;
    }

    console.log('%cinit embed CapTube', 'background: lightgreen;');
    window.addEventListener('message', event =>  {
      if (!HOST_REG.test(parseUrl(event.origin).hostname)) { return; }
      let data = JSON.parse(event.data), command = data.command;

      switch (command) {
        case 'capture':
          saveScreenShot({
            title: data.title,
            videoId: data.videoId,
            author: data.author
          });
          break;
      }
    });

  };

  if (window.top !== window && location.pathname.indexOf('/embed/') === 0) {
    initializeEmbed();
  } else {
    initialize();
  }
})();

// ==UserScript==
// @name        Lemonedo Content Download
// @namespace   https://greasyfork.org/zh-CN/scripts/460970-lemonedo-content-download
// @description Download exclusive contents (video, radio, photo) of Kamishiraishi Mone chan's fanclub website.
// @license     MIT
// @match       https://player.vimeo.com/video/*
// @match       https://kamishiraishimone.com/*
// @run-at      doucment-start
// @author      SheldorW
// @version     1.2.5
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/460974/Lemonedo%20Content%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/460974/Lemonedo%20Content%20Download.meta.js
// ==/UserScript==

// 1. 视频自动调整清晰度为最高清晰度
// 2. 视频添加下载按钮，选择能下载的最高清晰度
// 3. 支持下载图片

// consts
const downloadIcon =
`<svg width="20" height="20" fill="white" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 122.876 107.16" enable-background="new 0 0 122.876 107.16" xml:space="preserve">
<g><path fill-rule="evenodd" clip-rule="evenodd" d="M32.716,32.108h16.566V0l23.702,0v32.107l17.176,0l-28.7,30.32L32.716,32.108 L32.716,32.108z M113.705,32.244l7.733,34.271c0.021,0.071,0.034,0.146,0.044,0.223c0.678,5.731,1.177,10.726,1.338,15.138 c0.164,4.449-0.023,8.255-0.726,11.545c-0.014,0.063-0.03,0.123-0.052,0.183c-0.647,7.566-7.043,13.558-14.77,13.558h-92.12 c-7.736,0-14.138-6.006-14.772-13.585c-0.021-0.094-0.032-0.19-0.034-0.29l-0.012-0.533l-0.002-0.079 c-0.031-1.248-0.076-2.625-0.123-4.06c-0.181-5.508-0.39-11.875,0.058-17.388l-0.016,0.021l0.093-0.892 c0.027-0.294,0.059-0.584,0.091-0.872l7.736-37.239h10.213l-1.297,41.397h88.252l-0.849-41.397H113.705L113.705,32.244z M93.92,84.625c3.247,0,5.879,2.633,5.879,5.879c0,3.247-2.632,5.879-5.879,5.879s-5.879-2.632-5.879-5.879 C88.041,87.258,90.673,84.625,93.92,84.625L93.92,84.625z M17.253,85.941h22.783v8.092H17.253V85.941L17.253,85.941z"/></g>
</svg>`;
const pendingIcon = 
`<svg width="20" height="20" fill="white" xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 502 511.82">
<path fill-rule="nonzero" d="M279.75 471.21c14.34-1.9 25.67 12.12 20.81 25.75-2.54 6.91-8.44 11.76-15.76 12.73a260.727 260.727 0 0 1-50.81 1.54c-62.52-4.21-118.77-31.3-160.44-72.97C28.11 392.82 0 330.04 0 260.71 0 191.37 28.11 128.6 73.55 83.16S181.76 9.61 251.1 9.61c24.04 0 47.47 3.46 69.8 9.91a249.124 249.124 0 0 1 52.61 21.97l-4.95-12.96c-4.13-10.86 1.32-23.01 12.17-27.15 10.86-4.13 23.01 1.32 27.15 12.18L428.8 68.3a21.39 21.39 0 0 1 1.36 6.5c1.64 10.2-4.47 20.31-14.63 23.39l-56.03 17.14c-11.09 3.36-22.8-2.9-26.16-13.98-3.36-11.08 2.9-22.8 13.98-26.16l4.61-1.41a210.71 210.71 0 0 0-41.8-17.12c-18.57-5.36-38.37-8.24-59.03-8.24-58.62 0-111.7 23.76-150.11 62.18-38.42 38.41-62.18 91.48-62.18 150.11 0 58.62 23.76 111.69 62.18 150.11 34.81 34.81 81.66 57.59 133.77 61.55 14.9 1.13 30.23.76 44.99-1.16zm-67.09-312.63c0-10.71 8.69-19.4 19.41-19.4 10.71 0 19.4 8.69 19.4 19.4V276.7l80.85 35.54c9.8 4.31 14.24 15.75 9.93 25.55-4.31 9.79-15.75 14.24-25.55 9.93l-91.46-40.2c-7.35-2.77-12.58-9.86-12.58-18.17V158.58zm134.7 291.89c-15.62 7.99-13.54 30.9 3.29 35.93 4.87 1.38 9.72.96 14.26-1.31 12.52-6.29 24.54-13.7 35.81-22.02 5.5-4.1 8.36-10.56 7.77-17.39-1.5-15.09-18.68-22.74-30.89-13.78a208.144 208.144 0 0 1-30.24 18.57zm79.16-69.55c-8.84 13.18 1.09 30.9 16.97 30.2 6.21-.33 11.77-3.37 15.25-8.57 7.86-11.66 14.65-23.87 20.47-36.67 5.61-12.64-3.13-26.8-16.96-27.39-7.93-.26-15.11 4.17-18.41 11.4-4.93 10.85-10.66 21.15-17.32 31.03zm35.66-99.52c-.7 7.62 3 14.76 9.59 18.63 12.36 7.02 27.6-.84 29.05-14.97 1.33-14.02 1.54-27.9.58-41.95-.48-6.75-4.38-12.7-10.38-15.85-13.46-6.98-29.41 3.46-28.34 18.57.82 11.92.63 23.67-.5 35.57zM446.1 177.02c4.35 10.03 16.02 14.54 25.95 9.96 9.57-4.4 13.86-15.61 9.71-25.29-5.5-12.89-12.12-25.28-19.69-37.08-9.51-14.62-31.89-10.36-35.35 6.75-.95 5.03-.05 9.94 2.72 14.27 6.42 10.02 12 20.44 16.66 31.39z"/>
</svg>`
// Global Variables
var lastUserMove;  // 'zoomin', 'zoomout', 'switch'
var observerImgSwitch;
var observerImgLoading;
var mask;
var picDLButton;
var picNameButton;
var galleryTitle;
var fileTitle;
let currIcon = 0; // 0: dl, 1: pend

// === Utils ===============================================

// helper: find DOM element
function find(selector) {
  return document.querySelector(selector);
}

const prefix = '[Lemonedo Download]';
const log = console.log.bind(console, prefix);
const debug = console.debug.bind(console, prefix);
const error = console.error.bind(console, prefix);

function download_blob(blob, filename){
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(blob);
}

function download(url, filename, callback) {
  fetch(url)
    .then(resp => resp.blob())
    .then(blob => download_blob(blob, filename))
    .then(() => {
      if (typeof callback === 'function') {
        callback();
      }
    })
    .catch(error);
}

function download_video(url_video, url_audio, filename, callback) {
    Promise.all([
      url_video ? fetch(url_video).then(resp => resp.blob()) : Promise.resolve(null),
      url_audio ? fetch(url_audio).then(resp => resp.blob()) : Promise.resolve(null)
    ])
      .then(blobs => {
        let blob_vid = blobs[0];
        let blob_aud = blobs[1];
        blob_vid ? download_blob(blob_vid, filename) : error('video url is not available!');
        blob_aud ? download_blob(blob_aud, filename.replace('mp4', 'aac')) : error('audio url is not available!');
        if (!blob_vid && !blob_aud) {
          alert('无法获取视频和音频！');
        }
      })
      .then(() => {
        if (typeof callback === 'function') {
          callback();
        }
      })
      .catch(error);
}

function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes.
  return div.firstElementChild;
}

class Msg {
  constructor(type, data) {
    this.type = type;
    this.data = data;
  }
  stringify () {
    return JSON.stringify({
      type: 'CustomMsg',
      data: {
        type: this.type,
        data: this.data
      }
    });
  }
  static parse (data) {
    try {
      return JSON.parse(data, (key, value) => {
        if (key === '' && value && value.type === 'CustomMsg') {
          return new Msg(value.data.type, value.data.data);
        }
        return value;
      });
    } catch (err) {
      return data;
    }
  }
}

class MsgIframeReady extends Msg {
  static type = 1;
  constructor() {
    super(MsgIframeReady.type, 'iframeReady');
  }
}
class MsgFileTitle extends Msg {
  static type = 2;
  constructor(fileTitle) {
    super(MsgFileTitle.type, fileTitle);
  }
}

function listenMessageOnce(callback){
  unsafeWindow.addEventListener('message', callback, {once: true});
}

function escapeFilename(filename) {
  const invalidChars = /[ <>:"/\\|?*\x00-\x1F]/g; // Regex for invalid characters
  const replaceChar = "_"; // Replace invalid characters with underscores
  return filename.replace(invalidChars, replaceChar);
}

// === Utils End ==========================================

// === match: https://kamishiraishimone.com/group/* start =======
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
function observeImgZoomIn(targetNode) {
  if (!MutationObserver) { error('Explorer does not support MutationObserver'); }
  else {
    let observeList = { attributes: true };
    // define a new observer
    let observer = new MutationObserver(function () {
      if (targetNode.classList.contains('mfp-zoom-out-cur')) {
        let figureDiv = find('.mfp-figure');
        log('zoomin observed, init img ready observer');
        lastUserMove = 'zoomin';
        observeImgLoading(figureDiv);
      } else{
        // zoomed out
        debug('zoomout observed');
        lastUserMove = 'zoomout';
        if (observerImgSwitch) {
          observerImgSwitch.disconnect();
          observerImgSwitch = null;
          debug('disconnected img switch observer');
        }
        if (observerImgLoading) {
          observerImgLoading.disconnect();
          observerImgLoading = null;
          debug('disconnected img loading observer');
        }
      }
    });
    // have the observer observe targetNode for changes in children
    observer.observe(targetNode, observeList);
    debug('observing zoom in');
  }
}
function observeImgLoading (figureDiv) {
  if (!figureDiv) { let figureDiv = find('.mfp-figure'); }
  if (!MutationObserver) { error('Explorer does not support MutationObserver'); }
  else {
    let observeList = { attributes: true };
    if (!figureDiv.classList.contains('mfp-loading')) {
      log('img already loaded, no observe loading');
      let img = find('.mfp-img');
      let url = img.src;
      log(getPicDLName(), ':', url);
      updatePicDLNameToClipboard();
      // injectPicDLButton(url);
      if (lastUserMove == 'zoomin') {
        // 第一次zoom in
        injectCover(url, img);
        injectPicNameButton();
        observeImgSwitch();
      }
    } else {
      // define a new observer
      observerImgLoading = new MutationObserver(function () {
        //! 注意这个判断如果连续切换多张图时只会执行一次
        if (!figureDiv.classList.contains('mfp-loading')) {
          debug('img loading observed');
          let img = find('.mfp-img');
          let url = img.src;
          log(getPicDLName(), ':', url);
          updatePicDLNameToClipboard();
          // injectPicDLButton(url);
          if (lastUserMove == 'zoomin') {
            // 第一次zoom in
            injectCover(url, img);
            injectPicNameButton();
            observeImgSwitch();
          }
          observerImgLoading.disconnect();
          observerImgLoading = null;
        }
      });
      // have the observer observe containerDiv for changes in children
      observerImgLoading.observe(figureDiv, observeList);
      debug('observing img loading.')
    }
  }
}
// change mask's href when switching
function observeImgSwitch() {
  let contentDiv = find('.mfp-content');
  if (!MutationObserver) { error('Explorer does not support MutationObserver'); }
  else {
    let observeList = { childList: true };
    // define a new observer
    observerImgSwitch = new MutationObserver(function () {
      let img = find('.mfp-img');
      if (!img)
        debugger;
      if (img.src != mask.href) {
        debug('img switch observed, update link');
        if (!img) {
          error('img not found!');
          debugger;
        }
        let url = img.src;
        mask.href = url;
        let fileName = getPicDLName();
        picNameButton.innerText = fileName;
        updatePicDLNameToClipboard(fileName);
        img.parentNode.onmouseover = function () {
          let newMove = getPicDLName();
          if (newMove != lastUserMove) {
            debug('mask size changed to', img.width, img.height);
            // picNameButton.innerText = fileName;
            // updatePicDLNameToClipboard(fileName);
            mask.style.width = img.width + 'px';
            mask.style.height = img.height + 'px';
            lastUserMove = newMove;
            updatePicDLNameToClipboard(fileName);
          }
        };
        // picDLButton.href = url;
      }
    });
    // have the observer observe contentDiv for changes in children
    observerImgSwitch.observe(contentDiv, observeList);
    debug('observing img switch.')
  }

}

function makePicnameCopyButton() {
  let button = document.createElement('div');
  button.setAttribute('class', 'mfp-title');
  button.style.cursor = 'pointer';
  button.innerText = getPicDLName();
  button.onclick = function () {
    let fileName = getPicDLName();
    button.innerText = fileName;
    updatePicDLNameToClipboard(fileName);
  }
  return button;
}
function makePicDLButton (url) {
  //! 由于服务器的同源限制，js脚本无法直接GET到图片的字节，只能手动访问图片。
  let downloadIcon =
    '<svg viewBox="0 0 455.992 455.992" width="14px" height="14px">' +
    '<polygon class="fill" points="227.996,334.394 379.993,182.397 288.795,182.397 288.795,0 167.197,0 167.744,182.397 75.999,182.397" />' +
    '<polygon class="fill" points="349.594,334.394 349.594,395.193 106.398,395.193 106.398,334.394 45.599,334.394 45.599,395.193 45.599,455.992 410.393,455.992 410.393,334.394" />' +
    '</svg>';
  let button = document.createElement('button');
  button.setAttribute('class', 'mfp-title');
  button.href = url;
  button.innerHTML = downloadIcon;
  button.title = "Download this picture";
  button.style.color = '#fff';
  button.onclick = function () {
    download(button.href, getPicDLName());
  };
  return button;
}

function getPicDLName() {
  let counterDiv = find('.mfp-counter');
  let ind = counterDiv.innerText.split(' ')[0];
  let fileName = galleryTitle + '-' + ind;
  return fileName;
}
function updatePicDLNameToClipboard(newfileName) {
  if (navigator.clipboard) {
    let fileName = newfileName || getPicDLName();
    log('clipboard updated to', fileName);
    navigator.clipboard.writeText(fileName);
  }
}
function injectPicNameButton() {
  picNameButton = makePicnameCopyButton();
  let bottomBar = find('.mfp-bottom-bar');
  if (!bottomBar) {
    error('bottomBar not found!');
  } else {
    bottomBar.appendChild(picNameButton);
    log('injected pic name copy btn titled:', getPicDLName());
  }
}
function injectPicDLButton(url) {
  let picDLButton = makePicDLButton(url);
  let bottomBar = find('.mfp-bottom-bar');
  if (!bottomBar) {
    error('bottomBar not found!');
  } else {
    bottomBar.appendChild(picDLButton);
    debug('pic download btn injected');
  }
}
function injectCover (url, img) {
  // let sty = 'display: block;' +
    // '-webkit-box-sizing: border-box;' +
    // '-moz-box-sizing: border-box;' +
    // 'box-sizing: border-box;' +
    // 'padding: 40px 0 40px;';
    // 'margin: 0 auto';
  mask = document.createElement('a');
  mask.href = url;
  mask.target = '_blank';
  mask.download = '';
  // mask.setAttribute('style', sty);
  mask.style.display = "block";
  mask.style.width = img.width + 'px';
  mask.style.height = img.height + 'px';
  mask.style.background = '#fff';
  mask.style.opacity = '0';
  mask.style.position = 'fixed';
  // mask.style.zIndex = "10086";
  // debugger;
  // TODO this event is not handled.
  // img.addEventListener('resize', function () {
  //   debug('on img resize');
  //   mask.style.width = img.width + 'px';
  //   mask.style.height = img.height + 'px';
  // }, false);
  img.parentElement.insertBefore(mask, img);
  debug('cover injected');
}

function handlePicturePage () {
  const targetNode = find('#display_item_groups');
  galleryTitle = find('.title').innerText;
  if (targetNode) {
    debug('#display_item_groups found, enable contextmenu');
    // enable context menu
    $("#display_item_groups").off('contextmenu')
    observeImgZoomIn(targetNode);
  } else {
    error('#display_item_groups not found');
  }
}
// === match https://kamishiraishimone.com/group/* end ====

// === match: https://player.vimeo.com/video/* start ============
// create download button
function makeVideoDLButton(title, url_video, url_audio, quality) {
  // make valid filename from title
  let filename = title.replace(/[<>:"\/\\|?*]/g, '') + '.mp4';
  
  let svg_dl = createElementFromHTML(downloadIcon);
  let svg_pend = createElementFromHTML(pendingIcon);

  let svg = currIcon == 0 ? svg_dl : svg_pend;

  let tooltip = document.createElement('span');
  tooltip.innerText = quality;
  tooltip.setAttribute('class', 'Tooltip_module_tooltip__052b6fb2 vp-tooltip');
  tooltip.setAttribute('style', 'left: calc(50% + -0.0125008px)');

  // create new button
  let button = document.createElement('button');
  // button.type = 'button';
  button.setAttribute('class', 'Tooltip_module_tooltipContainer__052b6fb2 exclude-global-button-styles ControlBarButton_module_controlBarButton__b83cacc1');
  button.id = 'zzjdlbtn';

  button.appendChild(svg);
  button.appendChild(tooltip);

  // button.innerHTML = "⥥";
  // button.innerHTML = "⇓";
  // button.setAttribute('style', 'display: inline-block; font-size: 1.75em; margin: -0.25em 0 0 0.3em; color: #fff');

  button.onclick = function () {
    currIcon = 1 - currIcon;
    button.getElementsByTagName('svg')[0].replaceWith(currIcon == 0 ? svg_dl : svg_pend);
    download_video(url_video, url_audio, filename, () => {
      currIcon = 1 - currIcon;
      button.getElementsByTagName('svg')[0].replaceWith(currIcon == 0 ? svg_dl : svg_pend);
    });
  };

  // return DOM object
  return button;
}


function parseConfig(config) {
  // save title
  let title = config.video.title || '';
  
  // e.g. "https://195vod-adaptive.akamaized.net/exp=1677410659~acl=%2Fc6a905d5-1839-436e-bb3b-3aab9f8583b2%2F%2A~hmac=3fa515dd0072729d68dcda30ce45053ea7c776b407f413f5b266dfa2aa01ad88/c6a905d5-1839-436e-bb3b-3aab9f8583b2/sep/video/1ca315d3,3c2a80b1,4d31ce4b,6b4035f9,8d95d37e/audio/a3cfab24/subtitles/73923253-English%20%28auto-generated%29-en-x-autogen-cc/master.m3u8?external-subs=1\u0026query_string_ranges=1\u0026subcache=1\u0026subtoken=d67af79c59362cd07fd9df9a51c188b42d7e39a1d17c49047c905005d8eeb06a"
  let url_cdn = config.request.files.hls.cdns.akfire_interconnect_quic.url || config.request.files.hls.cdns.fastly_skyfire.url;
  let url_base = url_cdn.split('/sep/video/', 1)[0];

  // get streams
  let streams = config.request.files.dash.streams;
  let best_stream = streams.reduce((prev, curr) => {
    return parseInt(curr.quality) > parseInt(prev.quality) ? curr : prev;
  });
  let best_quality = best_stream.quality;
  // get only the first part of id
  // e.g. "6b4035f9-06d0-407e-8076-57c36f989e1e"
  let id_video = best_stream.id.split('-', 1)[0];

  // get video
  let url_video = '';
  try {
    url_video = url_base + '/parcel/video/' + id_video + '.mp4';
    log(best_quality, 'video:' + url_video);
  } catch (err) {
    error('Unable to find video!')
  }

  // get audio
  let id_audio, url_audio='';
  try {
    id_audio = url_cdn.match('audio/([\\d\\w]+)/')[1];
    url_audio = url_base + '/parcel/audio/' + id_audio + '.mp4';
    log(best_quality, 'audio:' + url_audio);
  } catch (err) {
    error('Unable to find audio!');
  }

  return { title, url_video, url_audio, best_quality };
}

function injectVideoDLButton (playBar, title, url_video, url_audio, quality) {
  let button = makeVideoDLButton(fileTitle || title, url_video, url_audio, quality);
  playBar.appendChild(button);
  log('injected video download btn titled: ', fileTitle);
}

// Wraps a property with a callback that convert the value each time the property is set
function wrapProperty(o, propName, callback) {
  if (o.hasOwnProperty(propName)) {
      error('Unable to wrap property ' + propName + '.');
      return;
  }
  let value;
  Object.defineProperty(o, propName, {
      get: function() {
          return value;
      },
      set: function(newValue) {
          value = callback(newValue);
      },
      enumerable: true,
      configurable: false
  });
  debug('Property ' + propName + ' wrapped successfully.');
}


// 官方代码改版后改用动态import module，无法赶在定义VimeoPlayer前拦截到它
// (x)解决办法1：想办法在原网页代码执行前wrap到window.dynamicImportSupported，令getter为false，这样可以伪装为不支持module，改用传统的方法，即可拦截到player对象。
//  1.1: 拦截window.loadVUID()，触发一个TypeError，然后走loadLegacyJS
// (x)解决办法2：想办法让浏览器真的不支持module
// (√)解决办法3：手动用传统方法再次初始化一个VimeoPlayer，并替换原来已经加载了的Player对象，注意要删掉整个div否则会禁忌二重唱。
function insertNewPlayerdiv () {
  const oldDiv = document.getElementById('player');
  let newDiv = document.createElement('div');
  newDiv.id = 'player2';
  // newDiv.className = oldDiv.className;
  oldDiv.parentElement.insertBefore(newDiv, oldDiv);
  return newDiv;
}

let qualityUpdated = false;  // Only update quality once in case manual change
function onPlaybarMutation (playerObject, title, url_video, url_audio, best_quality, mutations) {
  // 修改画质并插入下载按钮

  // 由于每次播放完的时候playBar都会删除，因此需要持续监听
  debug('player ui overlays mutated!');
  // 修改quality为最高画质。
  if (playerObject.qualities) {
    let bestLiveQuality = playerObject.qualities[1].id;
    if (playerObject.quality != bestLiveQuality && !qualityUpdated) {
      playerObject.quality = bestLiveQuality;
      qualityUpdated = true;
      debug('quality updated');
    }
  }

  // 添加下载按钮
  let playBar = find('div[class^=ControlBar_module_progressBarAndButtons]');
  let dlBtn = document.getElementById('zzjdlbtn');
  if (!playBar) {
    debug('playBar not found!');
  }else if (!dlBtn) {
    injectVideoDLButton(playBar, title, url_video, url_audio, best_quality);
  }
}

function replacePlayerObject () {
  return new Promise((resolve, reject) => {
    // manually create a new VimeoPlayer instance based on window.loadLegacyJS()
    log('create new VimeoPlayer instance');
    let player = insertNewPlayerdiv();
    player.className = 'player loading';

    var loadingInfo = unsafeWindow.loadCSS(document, unsafeWindow.playerConfig.request.urls.css);
    var script = document.createElement('script');
    var jsDone = false;

    script.src = unsafeWindow.playerConfig.request.urls.js;

    unsafeWindow.loadScript(script);
    script['onreadystatechange' in script ? 'onreadystatechange' : 'onload'] = function() {
      if (!jsDone && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
        const oldplayer = document.getElementById('player');
        oldplayer.remove();
        player.id = oldplayer.id;
        
        jsDone = true;
        playerObject = new VimeoPlayer(player, unsafeWindow.playerConfig, loadingInfo.cssDone || { link: loadingInfo.link, startTime: loadingInfo.startTime });
        playerObject.ready().then(resolve(playerObject));
      }
    };
  });
}

const topOrigin = "https://kamishiraishimone.com";
function retrieveFileTitle() {
  return new Promise((resolve, reject) => {
    // notify ready for title
    unsafeWindow.addEventListener('message', event => {
      let origin = event.origin || event.originalEvent.origin;
      const msgrcv = Msg.parse(event.data);
      if (origin === topOrigin && msgrcv instanceof Msg) {
        switch (msgrcv.type) {
          case MsgFileTitle.type:
            debug('[iframe] received filetitle msg: ', msgrcv.data);
            resolve(msgrcv.data);
            break;
        
          default:
            error('[iframe] unknown message: ', msgrcv);
            resolve('');
            break;
        }
      }
    }, false);
    // fileTitle = GM_getValue('fileTitle', '');

    let msg = new MsgIframeReady();
    unsafeWindow.parent.postMessage(msg.stringify(), topOrigin);
    debug('[iframe] posted iframeready: ', msg.stringify());
  })
}

function handleVideoPlayerPage () {
  
  let { title, url_video, url_audio, best_quality } = parseConfig(unsafeWindow.playerConfig);
  const replacePlayerObjectWorker = replacePlayerObject();
  const retrieveFileTitleWorker = retrieveFileTitle();
  Promise.all([replacePlayerObjectWorker, retrieveFileTitleWorker])
    .then(args => {
      const playerObject = args[0];
      debug('[iframe] playerObject ready');
      fileTitle = args[1];
      log('[iframe] retrived filetitle: ', fileTitle);
      // observe playbar mutation for download button injection
      if (!MutationObserver) { error('Explorer does not support MutationObserver'); }
      else {
        const observer = new MutationObserver(mutations =>
          onPlaybarMutation(playerObject, title, url_video, url_audio, best_quality, mutations)
        );
        const targetNode = find('.vp-player-ui-overlays');
        observer.observe(targetNode, { childList: true, subtree: true });
      }
    })
    .catch(error);

  // Wrap the VimeoPlayer constructor and intercepts the arguments needed to install the download button
  // 原理：原网页loadLegacyJS()是通过动态插入<script>文本异步加载的VimeoPlayer类，因此可以赶在这个类被定义前修改window.VimeoPlayer的setter，达到拦截new行为的效果
  // wrapProperty(unsafeWindow, 'VimeoPlayer', function(ctr) {
  //     return ctr && function() {
  //         let container = arguments && arguments[0];  // <div id='player'
  //         let config = arguments && arguments[1];  // config dict
  //         let player = ctr.apply(this, arguments);  // VimeoPlayer instance
  //         // debugger;
  //         player.ready().then((function (){
  //             console.debug('playerObject ready!');
  //             onVimeoPlayerReady(player, config);
  //         }));
  //     };
  // });
}

// === match https://player.vimeo.com/video/* end =========

// === match: https://kamishiraishimone.com/movies/* start ======
function getFileTitle() {
  const title = document.querySelector('.title').innerText;
  const date = document.querySelector('.meta').innerText;
  return escapeFilename(date + '_' + title);
}

const iframeOrigin = "https://player.vimeo.com";
function handleMoviesPage() {
  const fileTitleGot = getFileTitle();
  unsafeWindow.addEventListener('message', event => {
    let origin = event.origin || event.originalEvent.origin;
    const msgrcv = Msg.parse(event.data); 
    if (origin === iframeOrigin && msgrcv instanceof Msg) {
      switch (msgrcv.type) {
        case MsgIframeReady.type:
          const iframe = document.querySelector('iframe#player');
          if (!iframe) {
            error('[top] iframeready msg received, but iframe element not found!');
          } else {
            let msgret = new MsgFileTitle(fileTitleGot);
            iframe.contentWindow.postMessage(msgret.stringify(), iframeOrigin);
            debug('[top] iframeready msg received, post filetitle msg: ', msgret.stringify());
            // TODO setInterval post filetitle if no ack
          }
          break;

        default:
          error('[top] unknown message: ', msgrcv);
          break;
      }
    }
  }, false);

  // GM_setValue('fileTitle', fileTitleGot);
  // log('filetitle stored: ', fileTitleGot);
}
// === match https://kamishiraishimone.com/movies/* end ===

(function () {
  'use strict';

  switch (true) {
    case unsafeWindow.location.href.startsWith('https://kamishiraishimone.com/group/'):
      handlePicturePage();
      break;
      
    case unsafeWindow.location.href.startsWith('https://player.vimeo.com/video/'):
      handleVideoPlayerPage();
      break;

    case unsafeWindow.location.href.startsWith('https://kamishiraishimone.com/movies/'):
      handleMoviesPage();
      break;
    
    default:
      break;

  }

})();
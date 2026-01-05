// ==UserScript==
// @name Download YouTube Videos as MP4
// @description Adds a button that lets you download YouTube videos.
// @homepageURL https://greasyfork.org/ko/scripts/17834-download-youtube-videos-as-mp4
// @author mocho
// @version 6.16.25
// @date 2023-06-25
// @namespace http://googlesystem.blogspot.com
// @include http://www.youtube.com/*
// @include https://www.youtube.com/*
// @exclude http://www.youtube.com/embed/*
// @exclude https://www.youtube.com/embed/*
// @match http://www.youtube.com/*
// @match https://www.youtube.com/*
// @match http://s.ytimg.com/yts/jsbin/*
// @match https://s.ytimg.com/yts/jsbin/*
// @match http://manifest.googlevideo.com/*
// @match https://manifest.googlevideo.com/*
// @match http://*.googlevideo.com/videoplayback*
// @match https://*.googlevideo.com/videoplayback*
// @match http://*.youtube.com/videoplayback*
// @match https://*.youtube.com/videoplayback*
// @connect googlevideo.com
// @connect ytimg.com
// @grant GM_xmlhttpRequest
// @grant GM_getValue
// @grant GM_setValue
// @run-at document-end
// @license MIT License
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAB3RJTUUH2wMOCgIoGUYEAQAAAAlwSFlzAAALEgAACxIB0t1+/AAAAARnQU1BAACxjwv8YQUAAAGSUExURfi/JO/v797e3sbGxq2traWlpZSUlJycnNbW1oyEhIRaWow5OZQhIZwYGKUQEKUICK0ICJQxMYxKSoxzc4x7e4RCQpQYGKUAAK0AALUAAL0AAK0QEIxra5QpKa0YGIxSUsYAAKUhIZR7e87Ozr0ICJRSUr29vYxjY6U5OaUpKa0hIb21tZwAALUICO/Ozu/GxqUxMZSEhLUYGO/W1r0YGKVCQpQQEL0pKffe3vfW1pxra5Q5OcZCQvfn585CQr2trZx7e8ZSUs5SUq05Oc5jY9ZjY84AAKWMjM5zc957e60pKdaMjOelpbWcnLWUlLVCQsYYGMYICNbOzpQICMYhIbV7e5xaWt6cnPfv79bGxt6lpe+9vc5KSs6lpb0xMc6EhM69vbUxMbUhIb1aWs61tcZaWuecnMYxMb1KSsZjY96UlNa1td7W1r17e9a9vZwQEN6trb1jY8YQENZra+fOzr1zc85aWufe3t6MjMY5OdZaWt61tdZ7e+/n5+e9vc6MjMZra+/e3ue1tdalpd7GxrUpKalL4aAAAAABdFJOUwBA5thmAAACxklEQVR42uXX/1/SQBgH8NuAoEQ2ijgbBivJLznBAiUUKiyJSgOVAk0tKZKw75mRRt/7v4MBY8ezjW39Vs8v8rqHz/u1jbvbidC/XL8KmcpOqVT6nSjXjooGw8WfFd+QWGfE4oLbtbr++PdMOy0BDYLjEj/0xevfWIyVAI7b/aIj/9WHsRrA8Yf9bqSexVgD4Lic9kWE/LgPwPGfNfJHDO4P8Iuq+S2M9QD8oUp+nxEAcFCtfgIA/14x/9ElAKDQbNQAwN9VAiYEABy0OgsAWAnB/AcBAtVWawkAfJ4CD0BQADZavYcQgI9h3CCQjpD5PcEgwG+SwLRhIL0vz78SjAPEU3hrHODfyX4I6rUJIP0G3oExoNwFXpoB+HwXmDEFpF9IwKA5YK+Tp9fMAdUOsC6YA553gKcmgdTfAhV1oMQqADndQDmJ0AZLAsFnCIV3VYDHJLAjDkZKciAaFz/lCeBJB1glgXBrNLndBWLJ9uZGAI+keTBLANL8SnWAzWRniAC2pG+6lQF0hfjTqCIBrEvjDwiggFSLuIUoLY0vEwAbUcsnc/LlnO02HGvEz+hXEeJ5Yj+4L2vNkxOJDSnlQzliIq2synr3embiUBjmw0FyU83KX04Ob+9aAK/Ppd5deZloz4HFlCHzt3sX0x2a6LcvQb4ab8r7i+DVdqvnCq/D5ZzqdhfAcr5B9wD0PNwPEu0ZnLwK9oPgNfCQJ2fhhhITJ3E8BjeUOXA+QNQlBh5xLjemVCgKjzgzNIJFjWF4yJoKhafgIWt6VHGmjgR0HvMuTipPdWQJ6AImbBRSE8aY/sC4er5xFx5vHyB4YRRpFWUf0AL4c+dHkHZRFo9TDeB9Aa3Llwjr8FlFwB+wO/rHm0VbPae9mPini/O5h/XGxatw2I6fGHAOuhiGZVxO98lTdgutP94yaIvVdqxZdpvFYTT9X9UfqQQlTXlm8wkAAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/17834/Download%20YouTube%20Videos%20as%20MP4.user.js
// @updateURL https://update.greasyfork.org/scripts/17834/Download%20YouTube%20Videos%20as%20MP4.meta.js
// ==/UserScript==


(function () {
  const escapePolicy = window.trustedTypes.createPolicy('application-policy', {
    createHTML:      (unsafe) => {return unsafe;},
    createURL:       (unsafe) => {return unsafe;},
    createScriptURL: (unsafe) => {return unsafe;},
    createScript:    (unsafe) => {return unsafe;},
  });

  var FORMAT_LABEL = {}; /*{
	5: "FLV 240p",
	18: "MP4 360p",
	22: "MP4 720p",
	34: "FLV 360p",
	35: "FLV 480p",
	37: "MP4 1080p",
	38: "MP4 2160p",
	43: "WebM 360p",
	44: "WebM 480p",
	45: "WebM 720p",
	46: "WebM 1080p",
	// 20150219 : 3D 포멧 추가
	84: "MP4 720p3D",
	85: "MP4 1080p3D",
	102: "WebM 720p3D",
	// 20210828 : MP4V 포멧 추가
	134: "MP4 360p - \u97f3\u58f0\u306a\u3057",
	135: "MP4 480p - \u97f3\u58f0\u306a\u3057",
	// 20150219 : MP4V 포멧 추가
	136: "MP4 720p - \u97f3\u58f0\u306a\u3057",
	//
	137: "MP4 1080p - \u97f3\u58f0\u306a\u3057",
	138: "MP4 Original - \u97f3\u58f0\u306a\u3057",
	139: "M4A 48kbps - \u97f3\u58f0\u306e\u307f",
	140: "M4A 128kbps - \u97f3\u58f0\u306e\u307f",
	141: "M4A 256kbps - \u97f3\u58f0\u306e\u307f",
	// 20180418 : Vorbis 포멧 추가
	171: "Vor 128kbps - \u97f3\u58f0\u306e\u307f",
	// 20210828 : WebMV 포멧 추가
	243: "WebMV 360p - \u97f3\u58f0\u306a\u3057",
	// 20150219 : WebMV 포멧 추가
	244: "WebMV 480p - \u97f3\u58f0\u306a\u3057",
	245: "WebMV 480p245 - \u97f3\u58f0\u306a\u3057",
	246: "WebMV 480p246 - \u97f3\u58f0\u306a\u3057",
	247: "WebMV 720p - \u97f3\u58f0\u306a\u3057",
	248: "WebMV 1080p - \u97f3\u58f0\u306a\u3057",
	// 20180418 : OPUS 포멧 추가
	249: "Opus 48kbps - \u97f3\u58f0\u306e\u307f",
	250: "Opus 64kbps - \u97f3\u58f0\u306e\u307f",
	251: "Opus 160kbps - \u97f3\u58f0\u306e\u307f",
	//
	264: "MP4 1440p - \u97f3\u58f0\u306a\u3057",
	// 20150219 : MP4V,WebMV 포멧 추가
	266: "MP4 2160p - \u97f3\u58f0\u306a\u3057",
	271: "WebMV 1440p - \u97f3\u58f0\u306a\u3057",
	272: "WebMV 4320p60 - \u97f3\u58f0\u306a\u3057",
	//
	// 20141118 : 60fps 포멧 추가
	298: "MP4 720p60 - \u97f3\u58f0\u306a\u3057",
	299: "MP4 1080p60 - \u97f3\u58f0\u306a\u3057",
	// 20150219 : WebMV 포멧 추가
	302: "WebMV 720p60 - \u97f3\u58f0\u306a\u3057",
	303: "WebMV 1080p60 - \u97f3\u58f0\u306a\u3057",
	// 20150625 : 고화질 & 60fps 포멧 추가
	308: "WebMV 1440p60 - \u97f3\u58f0\u306a\u3057",
	313: "WebMV 2160p - \u97f3\u58f0\u306a\u3057",
	315: "WebMV 2160p60 - \u97f3\u58f0\u306a\u3057",
	// 20180418 : WEBM HDR & 60fps 포멧 추가
	332: "WebMV 360p HDR60 - \u97f3\u58f0\u306a\u3057",
	333: "WebMV 480p HDR60 - \u97f3\u58f0\u306a\u3057",
	334: "WebMV 720p HDR60 - \u97f3\u58f0\u306a\u3057",
	335: "WebMV 1080p HDR60 - \u97f3\u58f0\u306a\u3057",
	336: "WebMV 1440p HDR60 - \u97f3\u58f0\u306a\u3057",
	337: "WebMV 2160p HDR60 - \u97f3\u58f0\u306a\u3057",
	//
  };
  */
  var FORMAT_TYPE = {}; /*{
	5: "flv",
	18: "mp4",
	22: "mp4",
	34: "flv",
	35: "flv",
	37: "mp4v",
	38: "mp4",
	43: "webm",
	44: "webm",
	45: "webm",
	46: "webm",
	// 20150219 : 3D 포멧 추가
	84: "mp4",
	85: "mp4",
	102: "webm",
	// 20210828 : MP4V 포멧 추가
	134: "mp4v",
	135: "mp4v",
	// 20150219 : MP4V 포멧 추가
	136: "mp4v",
	//
	137: "mp4v",
	138: "mp4v",
	139: "m4a",
	140: "m4a",
	141: "m4a",
	// 20180418 : Vorbis 포멧 추가
	171: "vor",
	// 20210828 : WebMV 포멧 추가
	243: "webmv",
	// 20150219 : WebMV 포멧 추가
	244: "webmv",
	245: "webmv",
	246: "webmv",
	247: "webmv",
	248: "webmv",
	// 20180418 : OPUS 포멧 추가
	249: "opus",
	250: "opus",
	251: "opus",
	//
	264: "mp4v",
	// 20150219 : MP4V,WebMV 포멧 추가
	266: "mp4v",
	271: "webmv",
	272: "webmv",
	//
	// 20141118 : 60fps 포멧 추가
	298: "mp4v",
	299: "mp4v",
	// 20150219 : WebMV 포멧 추가
	302: "webmv",
	303: "webmv",
	// 20150625 : 고화질 & 60fps 포멧 추가
	308: "webmv",
	313: "webmv",
	315: "webmv",
	// 20180418 : WEBM HDR & 60fps 포멧 추가
	332: "webmv",
	333: "webmv",
	334: "webmv",
	335: "webmv",
	336: "webmv",
	337: "webmv",
	//
  };
  */
  var FORMAT_ORDER = [];//['5', '18', '34', '43', '35', '44', '22', '45', '46', '38', '134', '135', '84', '136', '298', '85', '37', '299', '264', '266', '243', '244', '102', '247', '302', '248', '303', '271', '308', '313', '315', '272', '332', '333', '334', '335', '336', '337', '139', '140', '141', '171', '249', '250', '251'];
  var FORMAT_RULE={'flv':'max','mp4':'all','mp4v':'all','webm':'all','webmv':'all','m4a':'max','vor':'max','opus':'max'};
  // all=display all versions, max=only highest quality version, none=no version
  // the default settings show all MP4 videos
  var SHOW_DASH_FORMATS=true;
  var BUTTON_TEXT={'ar':'تنزيل','cs':'Stáhnout','de':'Herunterladen','en':'Download','es':'Descargar','fr':'Télécharger','hi':'डाउनलोड','hu':'Letöltés','id':'Unduh','it':'Scarica','ja':'ダウンロード','ko':'내려받기','pl':'Pobierz','pt':'Baixar','ro':'Descărcați','ru':'Скачать','tr':'İndir','zh':'下载','zh-TW':'下載'};
  var BUTTON_TOOLTIP={'ar':'تنزيل هذا الفيديو','cs':'Stáhnout toto video','de':'Dieses Video herunterladen','en':'Download this video','es':'Descargar este vídeo','fr':'Télécharger cette vidéo','hi':'वीडियो डाउनलोड करें','hu':'Videó letöltése','id':'Unduh video ini','it':'Scarica questo video','ja':'このビデオをダウンロードする','ko':'이 비디오를 내려받기','pl':'Pobierz plik wideo','pt':'Baixar este vídeo','ro':'Descărcați acest videoclip','ru':'Скачать это видео','tr': 'Bu videoyu indir','zh':'下载此视频','zh-TW':'下載此影片'};
  var DECODE_RULE=[];
  var RANDOM=7489235179; // Math.floor(Math.random()*1234567890);
  var CONTAINER_ID='download-youtube-video'+RANDOM;
  var LISTITEM_ID='download-youtube-video-fmt'+RANDOM;
  var BUTTON_ID='download-youtube-video-button'+RANDOM;
  var DEBUG_ID='download-youtube-video-debug-info';
  var STORAGE_URL='download-youtube-script-url';
  var STORAGE_CODE='download-youtube-signature-code';
  var STORAGE_DASH='download-youtube-dash-enabled';
  var isDecodeRuleUpdated=false;

  // new layout
  var useNewLayout = true;

    var dom = {};

function string_endsWith(str, suffix) {
  if (((str === null) || (str === '')) || ((suffix === null) || (suffix === ''))) {
    return false;
  } else {
    str = str.toString();
    suffix = suffix.toString();
  }
  return (str.indexOf(suffix, str.length - suffix.length) !== -1);
}

dom.gE = function(id) {
  return document.getElementById(id);
  };

//waitForReady();
setTimeout(waitForReady, 500);
function waitForReady() {
//  if(!dom.gE("top") && !dom.gE("page")) {
  if(!dom.gE("menu-container") && !dom.gE("page-container")) {
    setTimeout(waitForReady, 500);
    return;
  }

  start();
}

    function addCSS()
    {
        var overrideStyle = "";
        function includeGlobalStyle(css) {
            var head, style;
            head = document.getElementsByTagName('head')[0];
            if (!head) { return; }
            style = document.createElement('style');
            style.type = 'text/css';
            style.textContent = escapePolicy.createScript(css);
            head.appendChild(style);
        }

        function addGlobalStyle(css)
        {
            overrideStyle += css + "\n";
        }

        addGlobalStyle("html:not(.style-scope){--yt-primary-text-color:var(--yt-spec-text-primary);--yt-menu-hover-backgound-color:var(--yt-spec-10-percent-layer);--yt-menu-focus-background-color:var(--yt-spec-verified-badge-background);}div.yt-download-popup{z-index:345;position:absolute;display:block;padding:8px 0;background-color:var(--yt-spec-brand-background-solid);border-radius:12px;box-shadow:0px 4px 32px 0px var(--yt-spec-static-overlay-background-light)}div.yt-download-popup[aria-hidden=true]{display:none}li.yt-download-item{cursor:pointer;display:flex;-ms-flex-direction:row;-webkit-flex-direction:row;flex-direction:row;-ms-flex-align:center;-webkit-align-items:center;align-items:center;position:relative;min-height:var(--paper-item-min-height, 48px);padding:0 0}li.yt-download-item:hover{background-color:var(--yt-menu-hover-backgound-color)}li.yt-download-item:active{background-color:var(--yt-menu-focus-background-color)}li.yt-download-item>a{text-decoration:none;width:100%;line-height:var(--paper-item-min-height,48px)}span.yt-download-text{color:var(--yt-primary-text-color);font-size:var(--ytd-user-comment_-_font-size,1.3rem);font-weight:var(--ytd-user-comment_-_font-weight,400);line-height:var(--ytd-user-comment_-_line-height,1.8rem);letter-spacing:var(--ytd-user-comment_-_letter-spacing);text-transform:none;margin:0 16px}button.yt-download-button{vertical-align:middle;color:var(--yt-spec-icon-inactive,inherit);outline:0;background:0 0;margin:0;border:none;padding:0;width:100%;height:100%;line-height:0;cursor:pointer;-webkit-tap-highlight-color:transparent}span.yt-download-button-text{color: var(--yt-button-icon-button-text-color,var(--yt-spec-text-secondary)); font-size: var(--ytd-tab-system-font-size); font-weight: var(--ytd-tab-system-font-weight); letter-spacing: var(--ytd-tab-system-letter-spacing);cursor:pointer;display:inline-block;-ms-flex-direction:row;-webkit-flex-direction:row;flex-direction:row;-ms-flex-align:center;-webkit-align-items:center;align-items:center;-ms-flex-pack:center;-webkit-justify-content:center;justify-content:center;padding-right:8px;text-transform:uppercase;}.yt-download-icon{background-color:transparent;text-transform:inherit;display:inline-flex;-ms-flex-align:center;-webkit-align-items:center;align-items:center;-ms-flex-pack:center;-webkit-justify-content:center;justify-content:center;position:relative;vertical-align:middle;fill:var(--yt-icon-color,currentcolor);stroke:none;margin-right:var(--iron-icon_-_margin-right);width:var(--iron-icon_-_width,var(--iron-icon-width,24px));height:var(--iron-icon_-_height,var(--iron-icon-height,24px));margin-bottom:var(--iron-icon_-_margin-bottom)}button.yt-download-button:hover>span>div>svg>g>path.yt-download-icon{fill:var(--yt-icon-active-color, currentcolor)}");

        includeGlobalStyle(overrideStyle);
    }

    function addJS()
    {
        var overrideScript = "";
        function includeGlobalScript(js) {
            var head, script;
            head = document.getElementsByTagName('head')[0];
            if (!head) { return; }
            script = document.createElement('script');
            script.type = 'text/javascript';
            script.textContent = escapePolicy.createScript(js);
            head.appendChild(script);
        }

        function addGlobalScript(js)
        {
            overrideScript += js + "\n";
        }

        addGlobalScript('function openDownloadPopup(){var t=document.getElementById("yt-download-popup");null!=t&&("true"==t.getAttribute("aria-hidden")?t.removeAttribute("aria-hidden"):t.setAttribute("aria-hidden","true"))}');

        includeGlobalScript(overrideScript);
    }

function start() {
    var isMaterialDesign = true;
  var pagecontainer=document.getElementById('page-manager');
  if (!pagecontainer)
  {
      pagecontainer=document.getElementById('page-container');
      if (!pagecontainer)
          return;
      isMaterialDesign = false;
  }

    if(isMaterialDesign)
    {
        addCSS();
        addJS();
    }

  if (/^https?:\/\/www\.youtube.com\/(?:watch\?|live\/)/.test(window.location.href)) run(isMaterialDesign);
  var isAjax=/class[\w\s"'-=]+spf\-link/.test(pagecontainer.innerHTML);
  var logocontainer=document.getElementById('logo-container');
  if (logocontainer && !isAjax) { // fix for blocked videos
    isAjax=(' '+logocontainer.className+' ').indexOf(' spf-link ')>=0;
  }
  var content=document.getElementById('content');
  if (isAjax && content) { // Ajax UI
      var mo=window.MutationObserver||window.WebKitMutationObserver;
      if(typeof mo!=='undefined') {
        var observer=new mo(function(mutations) {
          mutations.forEach(function(mutation) {
              if(mutation.addedNodes!==null) {
                for (var i=0; i<mutation.addedNodes.length; i++) {
                    if (mutation.addedNodes[i].id=='watch7-main-container') { // || id=='watch7-container'
                      run(isMaterialDesign);
                      break;
                    }
                }
              }
          });
        });
        observer.observe(content, {childList: true, subtree: true}); // old value: pagecontainer
      } else { // MutationObserver fallback for old browsers
        pagecontainer.addEventListener('DOMNodeInserted', onNodeInserted, false);
      }
  }
}

function onNodeInserted(e) {
    if (e && e.target && (e.target.id=='watch7-main-container')) { // || id=='watch7-container'
      run();
  }
}

document.ThumnailLoadCheck = function(obj) {
  if(obj.naturalWidth == 120 && obj.naturalHeight == 90) {
    obj.parentElement.remove();
  }
};

function GetThumnailFrame() {
  //document.getElementsByTagName('ytd-video-owner-renderer');
  return (document.getElementById("actions-inner") || document.getElementById("info-contents"));
}

function AddThumnailDownload(url, videoTitle) {
  let thum_frame = GetThumnailFrame();
  if(thum_frame !== null) {
    let YT_THUMB_RES_ORDER = ['hq720_live', 'maxresdefault', 'maxres2', 'hq720', 'sddefault', 'hqdefault', 'mqdefault', 'default'];

    // webp thumnail patch
    if (/\/vi_webp\//.test(url)) {
        url = url.replace(/\/vi_webp\/([^\/]+)\/.+/, "/vi/$1/hqdefault.jpg");
    }

    let thum_div = document.createElement('div');
    for (let res of YT_THUMB_RES_ORDER) {
      let u = url.replace(/\/[^\/]*([^\/]*\.[^\/\?]+)\??[^\/]*$/, "/" + res + "$1");
      let thum_btn = document.createElement('a');
      thum_btn.setAttribute('class', 'yt-simple-endpoint');
      thum_btn.setAttribute('style', 'padding: var(--yt-button-padding);');
      thum_btn.setAttribute('href', u + '?title=' + encodeURIComponent(videoTitle + u.replace(/^.+\/([^\/\.]+)(\.[^\?\.]+)$/, '$2')).replace(/'/g, "%27"));
      thum_btn.setAttribute('download', videoTitle);
      let thum_img = document.createElement('img');
      thum_img.setAttribute('class', 'yt-img-shadow');
      thum_img.setAttribute('src', u);
      thum_img.setAttribute('height', '40px');
      thum_img.setAttribute('onload', escapePolicy.createScript('ThumnailLoadCheck(this)'));
      thum_btn.appendChild(thum_img);

      let thum_size = document.createElement('span');
      thum_size.setAttribute('class', 'yt-download-button-text');
      thum_size.textContent = u.replace(/^.+\/([^\/\.]+)(\.[^\?\.]+)$/, '$1');
      thum_btn.appendChild(thum_size);
      thum_div.append(thum_btn);
    }
    thum_frame.prepend(thum_div);
    //thum_frame.removeAttribute("hidden");
  }
}

function ConvertTitle(title) {
  let videoTitle = title;
  videoTitle=videoTitle.replace(/\s*\-\s*YouTube$/i, '').replace(/'/g, '\'').replace(/^\s+|\s+$/g, '').replace(/\.+$/g, '');
  videoTitle=videoTitle.replace(/\*/g, "＊").replace(/"/g, "＂").replace(/\|/g, "｜").replace(/\\/g, "＼").replace(/'/g, "`").replace(/\./g, "․"); // Mac, Linux, Windows
  if (((window.navigator.userAgent || '').toLowerCase()).indexOf('windows') >= 0) {
    videoTitle=videoTitle.replace(/\//g, "／").replace(/!/g, "！").replace(/\?/g, "？").replace(/&/g, "＆").replace(/\^/g, "＾").replace(/:/g, "：").replace(/%/g, "％"); // Windows
  } else {
    videoTitle=videoTitle.replace(/#/g, '%23').replace(/&/g, '%26'); //  Mac, Linux
  }
  return videoTitle;
}

function LiveTrailer() {
  let errScr = ytInitialPlayerResponse.playabilityStatus.errorScreen;
  if (undefined === errScr ||
      undefined === errScr.ypcTrailerRenderer ||
      undefined === errScr.ypcTrailerRenderer.unserializedPlayerResponse ||
      undefined === errScr.ypcTrailerRenderer.unserializedPlayerResponse.videoDetails) {
      return;
  }

  let id = errScr.ypcTrailerRenderer.unserializedPlayerResponse.videoDetails.videoId;
  if (undefined === id) return;

  let frame = (document.getElementById("snippet-text"));
  let video_btn = document.createElement('a');
  video_btn.setAttribute('class', 'style-scope ytd-text-inline-expander');
  video_btn.setAttribute('style', 'display: block;');
  video_btn.setAttribute('href', 'https://www.youtube.com/watch?v=' + id);
  video_btn.textContent = id;
  frame.prepend(video_btn);
}

async function run(isMaterialDesign) {
  if (document.getElementById(CONTAINER_ID)) return; // check download container

  let isLive = false;
  var videoID=null, videoFormats=null, videoAdaptFormats=null, videoManifestURL=null, scriptURL=null, paygatedFormats=null;
  var isSignatureUpdatingStarted=false;
  var operaTable=[];
  var language=(isMaterialDesign ? ytcfg.data_.INNERTUBE_CONTEXT_HL : document.documentElement.getAttribute('lang'));
  var textDirection='left';
  if (document.body.getAttribute('dir')=='rtl') {
    textDirection='right';
  }
  if (document.getElementById('watch7-action-buttons')) {  // old UI
    fixTranslations(language, textDirection);
  }

  if (isMaterialDesign) {
      let action_dom = document.getElementById("description-and-actions");
      if (action_dom !== null) {
          action_dom.style.display = 'inherit';
      }

      let menu_dom = document.getElementById("top-row");
      if (menu_dom !== null) {
          menu_dom.style.justifyContent = 'flex-end';
      }
  }

  // video title
  var videoTitle=ConvertTitle(document.title || 'video');

  // obtain video ID, formats map
  var args=null;
  //var usw=(typeof this.unsafeWindow !== 'undefined')?this.unsafeWindow:window; // Firefox, Opera<15
  if (ytplayer && ytplayer.config && ytplayer.config.args) {
    args=ytplayer.config.args;
    if(args.livestream !== undefined) isLive = true;

    var jsonStreamData = (args.player_response == undefined ? args.raw_player_response : JSON.parse(args.player_response));
    if(jsonStreamData.streamingData !== undefined) {
      args['url_encoded_fmt_stream_map']=jsonStreamData.streamingData.formats;
      args['adaptive_fmts']=jsonStreamData.streamingData.adaptiveFormats;
      paygatedFormats=(jsonStreamData.playabilityStatus.paygatedQualitiesMetadata !== undefined ? jsonStreamData.playabilityStatus.paygatedQualitiesMetadata.restrictedAdaptiveFormats : null);
    }

    // video upload time
    if(args.raw_player_response && args.raw_player_response.microformat && args.raw_player_response.microformat.playerMicroformatRenderer) {
      let updatetime = "";
      let pmr = args.raw_player_response.microformat.playerMicroformatRenderer;
      if(pmr.liveBroadcastDetails && pmr.liveBroadcastDetails.startTimestamp) {
        updatetime = (pmr.liveBroadcastDetails.startTimestamp.match(/^(\d+)-(\d+)-(\d+)/) ? `${RegExp.$1}${RegExp.$2}${RegExp.$3}` : '');
      } else if(pmr.publishDate) {
        updatetime = (pmr.publishDate.match(/^(\d+)-(\d+)-(\d+)/) ? `${RegExp.$1}${RegExp.$2}${RegExp.$3}` : '');
      } else if(pmr.uploadDate) {
        updatetime = (pmr.uploadDate.match(/^(\d+)-(\d+)-(\d+)/) ? `${RegExp.$1}${RegExp.$2}${RegExp.$3}` : '');
      }

      // video title
      videoTitle = ConvertTitle(args.title);
      videoTitle = updatetime + " " + videoTitle;
    }

    AddThumnailDownload(jsonStreamData.videoDetails.thumbnail.thumbnails[0].url, videoTitle);
  }
  if (args) {
    videoID=args['video_id'];
    videoFormats=args['url_encoded_fmt_stream_map'];
    videoAdaptFormats=args['adaptive_fmts'];
    videoManifestURL=args['dashmpd'];
    debug('DYVAM - Info: Standard mode. videoID '+(videoID?videoID:'none')+'; ');
  }

  if (ytplayer) {
    if (ytplayer.config && ytplayer.config.assets) {
      scriptURL=ytplayer.config.assets.js;
    } else if (ytplayer.web_player_context_config) {
      scriptURL=ytplayer.web_player_context_config.jsUrl;
    } else if (ytplayer.bootstrapWebPlayerContextConfig) {
      scriptURL=ytplayer.bootstrapWebPlayerContextConfig.jsUrl;
    }
  }

  if (videoID===null) { // unsafeWindow workaround (Chrome, Opera 15+)
    var buffer=document.getElementById(DEBUG_ID+'2');
    if (buffer) {
      while (buffer.firstChild) {
        buffer.removeChild(buffer.firstChild);
      }
    } else {
      buffer=createHiddenElem('pre', DEBUG_ID+'2');
    }
    injectScript ('if(ytplayer&&ytplayer.config&&ytplayer.config.args){document.getElementById("'+DEBUG_ID+'2").appendChild(document.createTextNode(\'"video_id":"\'+ytplayer.config.args.video_id+\'", "js":"\'+ytplayer.config.assets.js+\'", "dashmpd":"\'+ytplayer.config.args.dashmpd+\'", "url_encoded_fmt_stream_map":"\'+ytplayer.config.args.url_encoded_fmt_stream_map+\'", "adaptive_fmts":"\'+ytplayer.config.args.adaptive_fmts+\'"\'));}');
    var code=buffer.innerHTML;
    if (code) {
      videoID=findMatch(code, /\"video_id\":\s*\"([^\"]+)\"/);
      videoFormats=findMatch(code, /\"url_encoded_fmt_stream_map\":\s*\"([^\"]+)\"/);
      videoFormats=videoFormats.replace(/&amp;/g,'\\u0026');
      videoAdaptFormats=findMatch(code, /\"adaptive_fmts\":\s*\"([^\"]+)\"/);
      videoAdaptFormats=videoAdaptFormats.replace(/&amp;/g,'\\u0026');
      videoManifestURL=findMatch(code, /\"dashmpd\":\s*\"([^\"]+)\"/);
      scriptURL=findMatch(code, /\"js\":\s*\"([^\"]+)\"/);
    }
    debug('DYVAM - Info: Injection mode. videoID '+(videoID?videoID:'none')+'; ');
  }

  if (videoID===null) { // if all else fails
    var bodyContent=document.body.innerHTML;
    if (bodyContent!==null) {
      videoID=findMatch(bodyContent, /\"video_id\":\s*\"([^\"]+)\"/);
      videoFormats=findMatch(bodyContent, /\"url_encoded_fmt_stream_map\":\s*\"([^\"]+)\"/);
      videoAdaptFormats=findMatch(bodyContent, /\"adaptive_fmts\":\s*\"([^\"]+)\"/);
      videoManifestURL=findMatch(bodyContent, /\"dashmpd\":\s*\"([^\"]+)\"/);
      if (scriptURL===null) {
        scriptURL=findMatch(bodyContent, /\"js\":\s*\"([^\"]+)\"/);
        if (scriptURL) {
          scriptURL=scriptURL.replace(/\\/g,'');
        }
      }
    }
    debug('DYVAM - Info: Brute mode. videoID '+(videoID?videoID:'none')+'; ');
  }

  debug('DYVAM - Info: url '+window.location.href+'; useragent '+window.navigator.userAgent);

  if(videoFormats === undefined) videoFormats = [];
  if (videoAdaptFormats) {
    videoFormats=videoFormats.concat(videoAdaptFormats);
  }
  if (null !== paygatedFormats)
    videoFormats=videoFormats.concat(JSON.parse(JSON.stringify(paygatedFormats)));

  if (videoID===null || videoFormats===undefined || videoID.length===0 || videoFormats.length===0) {
    LiveTrailer();
    debug('DYVAM - Error: No config information found. YouTube must have changed the code.');
    return;
  }

  // Opera 12 extension message handler
  if (typeof window.opera !== 'undefined' && window.opera && typeof opera.extension !== 'undefined') {
    opera.extension.onmessage = function(event) {
      var index=findMatch(event.data.action, /xhr\-([0-9]+)\-response/);
      if (index && operaTable[parseInt(index,10)]) {
        index=parseInt(index,10);
        var trigger=(operaTable[index])['onload'];
        if (typeof trigger === 'function' && event.data.readyState == 4) {
          if (trigger) {
              trigger(event.data);
          }
        }
      }
    };
  }

  if (!isDecodeRuleUpdated) {
    DECODE_RULE=getDecodeRules(DECODE_RULE);
    isDecodeRuleUpdated=true;
  }
  if (scriptURL) {
    scriptURL = absoluteURL(scriptURL);
    debug('DYVAM - Info: Full script URL: '+scriptURL);
    await fetchSignatureScript(scriptURL);
  }

  // parse the formats map
/*  var sep1='%2C', sep2='%26', sep3='%3D';
  if (videoFormats.indexOf(',')>-1||videoFormats.indexOf('&')>-1||videoFormats.indexOf('\\u0026')>-1) {
    sep1=',';
    sep2=(videoFormats.indexOf('&')>-1)?'&':'\\u0026';
    sep3='=';
  } */
  var videoURL=[];
  var videoSignature=[];
  var videoFormatsGroup=videoFormats;

  // 리스트 재정렬
  let fmtSize = function (size, units, divisor) {
    for(var idx = 0; idx < units.length; ++idx) {
    size /= divisor;

    if(size < 10)
      return Math.round(size * 100) / 100 + units[idx];

    if(size < 100)
      return Math.round(size * 10) / 10 + units[idx];

    if(size < 1000 || idx == units.length - 1)
      return Math.round(size) + units[idx];
    }
  };

  let fmtBitrate = function (size) {
    return fmtSize(size, [ "kbps", "Mbps", "Gbps" ], 1000);
  };

  let fmtFileSize = function (size) {
    size = parseInt(size,10);
    if (size >= 1073741824) {
      size = parseFloat((size / 1073741824).toFixed(1)) + ' GB';
    } else if (size >= 1048576) {
      size = parseFloat((size / 1048576).toFixed(1)) + ' MB';
    } else {
      size = parseFloat((size / 1024).toFixed(1)) + ' KB';
    }
    return size;
  };

  for(let format of videoFormats) {
    if(format.mimeType.match(/^([^;]+);\s*codecs="([^\."]+)/)) {
      switch (RegExp.$1) {
      case "video/mp4":
        format.qualityLabel = format.qualityLabel.replace(/\d+([a-z]+)(?:\d+)?/, `${format.height}$1${format.fps}`);
        if (format.audioQuality !== undefined) format.ext = "mp4";
        else format.ext = "mp4v", format.qualityLabel += ` (${fmtBitrate(format.bitrate)}) - \u97f3\u58f0\u306a\u3057`;
        if (-1 != format.qualityLabel.toLowerCase().indexOf('premium')) {
          format.premium = true;
          format.qualityLabel = `${format.itag}: ${format.qualityLabel} (${fmtFileSize(format.contentLength)})`;
        }
        break;
      case "video/webm":
        format.qualityLabel = format.qualityLabel.replace(/\d+([a-z]+)(?:\d+)?/, `${format.height}$1${format.fps}`);
        if (format.audioQuality !== undefined) format.ext = "webm";
        else format.ext = "webmv", format.qualityLabel += ` (${fmtBitrate(format.bitrate)}) - \u97f3\u58f0\u306a\u3057`;
        if (-1 != format.qualityLabel.toLowerCase().indexOf('premium')) {
          format.premium = true;
          format.qualityLabel = `${format.itag}: ${format.qualityLabel} (${fmtFileSize(format.contentLength)})`;
        }
        break;
      case "audio/mp4":
        format.ext = "m4a";
        format.qualityLabel = `${fmtBitrate(format.bitrate)} - \u97f3\u58f0\u306e\u307f`;
        break;
      case "audio/webm":
        format.ext = RegExp.$2;
        format.qualityLabel = `${fmtBitrate(format.bitrate)} - \u97f3\u58f0\u306e\u307f`;
        break;
      default:
        format.ext = RegExp.$2;
        if (format.qualityLabel === undefined) format.qualityLabel = "None";
      }
      //window.console.log(format.itag + ': ' + format.ext);
    }
  }

  let FormatOrder = function (ext) {
    let order = 0;
    switch(ext) {
    case "mp4":
    case "webm":
      ++order;
    case "mp4v":
      ++order;
    case "webmv":
      ++order;
    case "m4a":
      ++order;
    case "opus":
      ++order;
    default:
      ++order;
    }
    return order;
  };

  videoFormats.sort(function(a, b){
    let A = FormatOrder(a.ext);
    let B = FormatOrder(b.ext);
    if(A == B) {
      let hA = (a.height !== undefined ? a.height : 0);
      let hB = (b.height !== undefined ? b.height : 0);
      if(hA == hB) {
        if(a.fps !== undefined && b.fps !== undefined) {
          if(a.fps == b.fps) {
            let hdrA = (a.qualityLabel !== undefined ? /hdr/i.test(a.qualityLabel) : false);
            let hdrB = (b.qualityLabel !== undefined ? /hdr/i.test(b.qualityLabel) : false);
            if(hdrA && !hdrB) return 1;
            else if(!hdrA && hdrB) return -1;
          } else {
            return (a.fps - b.fps);
          }
        }
        if(a.contentLength !== undefined && b.contentLength !== undefined) {
          return (a.contentLength - b.contentLength);
        }
      } else {
        return (hA - hB);
      }
    } else {
      return (B - A);
    }
    return 0;
  });

  for (var i=0;i<videoFormatsGroup.length;i++) {
    //var videoFormatsElem=videoFormatsGroup[i].split(sep2);
    var videoFormatsPair=videoFormatsGroup[i];
    if(videoFormatsPair.cipher!==undefined || videoFormatsPair.signatureCipher!==undefined) {
      var cipher=(videoFormatsPair.cipher!==undefined ? videoFormatsPair.cipher.split('&') : videoFormatsPair.signatureCipher.split('&'));
      for (var j=0;j<cipher.length;j++) {
        var pair=cipher[j].split('=');
        if (pair.length==2) {
          videoFormatsPair[pair[0]]=pair[1];
        }
      }
    }
    if (videoFormatsPair['url']!==undefined) {
      let url=unescape(videoFormatsPair['url']).replace(/\\\//g,'/').replace(/\\u0026/g,'&');
      if (videoFormatsPair['itag']===undefined) continue;
      let itag=videoFormatsPair['itag'];
      let sig=videoFormatsPair['sig']||videoFormatsPair['signature'];
      if (sig) {
        url=url+'&signature='+sig;
        videoSignature[itag]=null;
      } else if (videoFormatsPair['s']) {
        url=url+'&'+videoFormatsPair['sp']+'='+decryptSignature(decodeURIComponent(videoFormatsPair['s']));
        videoSignature[itag]=videoFormatsPair['s'];
      } else if (url.match(/&sig=([^&]+)/)) {
        url = url.replace(/&sig=([^&]+)/, `&sig=${decryptSignature(decodeURIComponent(RegExp.$1))}`);
      }
      if (url.match(/&n=([^&]+)/)) {
        url = url.replace(/&n=([^&]+)/, `&n=${decodeN(RegExp.$1)}`);
      }
      if (isLive) {
        url=url+'&alr=yes&ir=1,&rr=12,';
      } else if (url.toLowerCase().indexOf('ratebypass')==-1) { // speed up download for dash
        url=url+'&ratebypass=yes';
      }
      if (url.toLowerCase().indexOf('http')===0) { // validate URL
        videoURL[itag]=url+'&title='+encodeURIComponent(videoTitle+'.'+videoFormatsPair['ext']).replace(/'/g, "%27");
      }
    } else if (videoFormatsPair.premium) {
      videoURL[videoFormatsPair['itag']] = '';
    }
    if(videoFormatsPair.height === undefined || videoFormatsPair.height >= 300) {
      FORMAT_ORDER.push(String(videoFormatsPair['itag']));
      FORMAT_LABEL[videoFormatsPair['itag']] = `${videoFormatsPair['ext'].toUpperCase()} ${videoFormatsPair['qualityLabel']}${isLive ? " - Live" : ""}`;
      FORMAT_TYPE[videoFormatsPair['itag']] = videoFormatsPair['ext'];
    }
  }

  var showFormat=[];
  for (var category in FORMAT_RULE) {
    var rule=FORMAT_RULE[category];
    for (var index in FORMAT_TYPE){
      if (FORMAT_TYPE[index]==category) {
        showFormat[index]=(rule=='all');
      }
    }
    if (rule=='max') {
      for (let i=FORMAT_ORDER.length-1;i>=0;i--) {
        var format=FORMAT_ORDER[i];
        if (FORMAT_TYPE[format]==category && videoURL[format]!==undefined) {
          showFormat[format]=true;
          break;
        }
      }
    }
  }

  var dashPref=getPref(STORAGE_DASH);
  if (dashPref=='1') {
    SHOW_DASH_FORMATS=true;
  } else if (dashPref!='0') {
    setPref(STORAGE_DASH,'0');
  }

  var downloadCodeList=[];
  for (let i=0;i<FORMAT_ORDER.length;i++) {
    let format=FORMAT_ORDER[i];
    if (format=='37' && videoURL[format]===undefined) { // hack for dash 1080p
      if (videoURL['137']) {
       format='137';
      }
      showFormat[format]=showFormat['37'];
    } else if (format=='38' && videoURL[format]===undefined) { // hack for dash 4K
      if (videoURL['138'] && !videoURL['266']) {
       format='138';
      }
      showFormat[format]=showFormat['38'];
    }
    if (!SHOW_DASH_FORMATS && format.length>2) continue;
    if (videoURL[format]!==undefined && FORMAT_LABEL[format]!==undefined && showFormat[format]) {
      downloadCodeList.push({url:videoURL[format],sig:videoSignature[format],format:format,label:FORMAT_LABEL[format]});
      debug('DYVAM - Info: itag'+format+' url:'+videoURL[format]);
    }
  }

  if (downloadCodeList.length===0) {
    debug('DYVAM - Error: No download URL found. Probably YouTube uses encrypted streams.');
    return; // no format
  }

  // find parent container
  var newWatchPage=true;
    var parentElement=null;
    var materialDesign = (document.getElementById("actions-inner") || document.getElementById("menu-container"));
    if(materialDesign!==null) {
        for (let elem of materialDesign.getElementsByClassName("style-scope ytd-watch-metadata")) {
          if ('YTD-MENU-RENDERER' == elem.tagName) {
            elem.style.justifyContent = "right";
          }
        }
        materialDesign = materialDesign.getElementsByClassName("style-scope ytd-menu-renderer");
        if(materialDesign['top-level-buttons-computed'] !== undefined) {
            parentElement=materialDesign['top-level-buttons-computed'];
            //parentElement.parentNode.style.justifyContent = "right";
        } else if(materialDesign['top-level-buttons'] !== undefined) {
            parentElement=materialDesign['top-level-buttons'];
        }
    }
  if (parentElement===null) {
    parentElement=document.getElementById('watch8-secondary-actions');
    if (parentElement===null) {
      parentElement=document.getElementById('watch7-action-buttons');
      if (parentElement===null) {
        debug('DYVAM Error - No container for adding the download button. YouTube must have changed the code.');
        return;
      } else {
        newWatchPage=false;
      }
    }
  }

  // get button labels
  var buttonText=(BUTTON_TEXT[language])?BUTTON_TEXT[language]:BUTTON_TEXT['en'];
  var buttonLabel=(BUTTON_TOOLTIP[language])?BUTTON_TOOLTIP[language]:BUTTON_TOOLTIP['en'];

  // generate download code for regular interface
  var mainSpan=document.createElement('span');
  mainSpan.setAttribute('style', 'display: flex; flex-direction: row; align-items: center; justify-content: center;');

    if(isMaterialDesign)
    {
        var svgIcon=document.createElement('yt-icon-button');
        svgIcon.setAttribute('style', '--yt-button-icon-padding: 6px; color: inherit;');
        svgIcon.setAttribute('class', 'style-scope ytd-toggle-button-renderer');
        svgIcon.innerHTML = escapePolicy.createHTML('<svg viewbox="0 0 24 24" preserveaspectratio="xMidYMid meet" focusable="false" class="yt-download-icon"><g class="yt-download-icon"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" class="yt-download-icon"></path></g></svg>');
        mainSpan.appendChild(svgIcon);
    }
  else if (newWatchPage) {
    var spanIcon=document.createElement('span');
    spanIcon.setAttribute('class', 'yt-uix-button-icon-wrapper');
    var imageIcon=document.createElement('img');
    imageIcon.setAttribute('src', '//s.ytimg.com/yt/img/pixel-vfl3z5WfW.gif');
    imageIcon.setAttribute('class', 'yt-uix-button-icon');
    imageIcon.setAttribute('style', 'width:20px;height:20px;background-size:20px 20px;background-repeat:no-repeat;background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABG0lEQVRYR+2W0Q3CMAxE2wkYAdiEEWADmIxuACMwCmzABpCTEmRSO7YTQX+ChECV43t2nF7GYeHPuLD+0AKwC/DnWMAp/N5qimkBuAfBdRTF/+2/AV6ZYFUxVYuicAfoHegd6B3oHfhZB+ByF+JyV8FkrAB74pqH3DU5L3iGoBURhdVODIQF4EjEkWLmmhYALOQgNIBcHHke4buhxXAAaFnaAhqbQ5QAOHHkwhZ8balkx1ICCiEBWNZ+CivdB7REHIC2ZjZK2oWklDDdB1NSdCd/Js2PqQMpSIKYVcM8kE6QCwDBNRCqOBJrW0CL8kCYxL0A1k6YxWsANAiXeC2ABOEWbwHAWrwxpzgkmA/JtIqnxTOElmPnjlkc4A3FykAhA42AxwAAAABJRU5ErkJggg==);');
    spanIcon.appendChild(imageIcon);
    mainSpan.appendChild(spanIcon);
  }

  var spanButton=document.createElement('span');
    if(isMaterialDesign)
        spanButton.setAttribute('class', 'yt-download-button-text');
    else
        spanButton.setAttribute('class', 'yt-uix-button-content');
  spanButton.appendChild(document.createTextNode(buttonText+''));
  mainSpan.appendChild(spanButton);

  if (!newWatchPage && isMaterialDesign === false) { // old UI
    var imgButton=document.createElement('img');
    imgButton.setAttribute('class', 'yt-uix-button-arrow');
    imgButton.setAttribute('src', '//s.ytimg.com/yt/img/pixel-vfl3z5WfW.gif');
    mainSpan.appendChild(imgButton);
  }

  var listItems=(isMaterialDesign ? document.createElement('div') : document.createElement('ol'));
    if(isMaterialDesign)
    {
        listItems.setAttribute('id', 'yt-download-popup');
        listItems.setAttribute('class', 'yt-download-popup');
        listItems.setAttribute('aria-hidden', 'true');
    }
    else
    {
        listItems.setAttribute('style', 'display:none;');
        listItems.setAttribute('class', 'yt-uix-button-menu');
    }
  for (let i=0;i<downloadCodeList.length;i++) {
    let listItem=document.createElement('li');
      if(isMaterialDesign)
          listItem.setAttribute('class', 'yt-download-item');
    let listLink=document.createElement('a');
      if(isMaterialDesign === false)
          listLink.setAttribute('style', 'text-decoration:none;');
    listLink.setAttribute('href', downloadCodeList[i].url);
    listLink.setAttribute('download', videoTitle+'.'+FORMAT_TYPE[downloadCodeList[i].format]);
    let listButton=document.createElement('span');
    listButton.setAttribute('class', (isMaterialDesign ? 'yt-download-text' : 'yt-ui-menu-item'));
    listButton.setAttribute('loop', i+'');
    listButton.setAttribute('id', LISTITEM_ID+downloadCodeList[i].format);
    listButton.appendChild(document.createTextNode(downloadCodeList[i].label));
    listLink.appendChild(listButton);
    listItem.appendChild(listLink);
    listItems.appendChild(listItem);
  }
    // 머테리얼 디자인 이전 버전에서만 여기에 다운로드 리스트 추가
    if(isMaterialDesign === false)
        mainSpan.appendChild(listItems);

  var buttonElement=document.createElement('button');
  buttonElement.setAttribute('id', BUTTON_ID);
  if (newWatchPage) {
      if(isMaterialDesign)
      {
          buttonElement.setAttribute('onclick', escapePolicy.createScript('openDownloadPopup();'));
          if (useNewLayout) {
            buttonElement.setAttribute('class', 'yt-download-button yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading ');
            //buttonElement.innerHTML = '<yt-touch-feedback-shape style="border-radius: inherit;"><div class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response" aria-hidden="true"><div class="yt-spec-touch-feedback-shape__stroke" style=""></div><div class="yt-spec-touch-feedback-shape__fill" style=""></div></div></yt-touch-feedback-shape>';
          } else {
            buttonElement.setAttribute('class', 'yt-download-button');
          }
      }
      else
          buttonElement.setAttribute('class', 'yt-uix-button  yt-uix-button-size-default yt-uix-button-opacity yt-uix-tooltip');
  } else { // old UI
    buttonElement.setAttribute('class', 'yt-uix-button yt-uix-tooltip yt-uix-button-empty yt-uix-button-text');
    buttonElement.setAttribute('style', 'margin-top:4px; margin-left:'+((textDirection=='left')?5:10)+'px;');
  }
  buttonElement.setAttribute('data-tooltip-text', buttonLabel);
  buttonElement.setAttribute('type', 'button');
  buttonElement.setAttribute('role', 'button');
  buttonElement.addEventListener('click', function(){return false;}, false);
  buttonElement.appendChild(mainSpan);
  var containerSpan=document.createElement('span');
  containerSpan.setAttribute('id', CONTAINER_ID);
  if (useNewLayout) {
    containerSpan.setAttribute('button-renderer', '');
    containerSpan.setAttribute('class', 'style-scope ytd-menu-renderer');
  }
  containerSpan.appendChild(document.createTextNode(' '));
  containerSpan.appendChild(buttonElement);
    if(isMaterialDesign)
        containerSpan.appendChild(listItems);

  // add the button
  if (!newWatchPage) { // watch7
    parentElement.appendChild(containerSpan);
  } else { // watch8
    parentElement.insertBefore(containerSpan, parentElement.firstChild);
  }

  // fixed: button panel resizing
  parentElement.parentElement.resetFlexibleItems();
/*
  for (let key in parentElement.parentElement) {
    if(string_endsWith(key, "_resizeThrottle")) {
      console.log(key);
      parentElement.parentElement[key].fire();
      break;
    }
  }
*/

  // REPLACEWITH if (!isSignatureUpdatingStarted) {
  for (let i=0;i<downloadCodeList.length;i++) {
    if (undefined !== downloadCodeList[i].url)
      addFileSize(downloadCodeList[i].url, downloadCodeList[i].format);
  }
  // }

  if (typeof GM_download !== 'undefined') {
    for (let i=0;i<downloadCodeList.length;i++) {
      if (undefined === downloadCodeList[i].url) continue;
      let downloadFMT=document.getElementById(LISTITEM_ID+downloadCodeList[i].format);
      let url=(downloadCodeList[i].url).toLowerCase();
      if (url.indexOf('clen=')>0 && url.indexOf('dur=')>0 && url.indexOf('gir=')>0
          && url.indexOf('lmt=')>0) {
        downloadFMT.addEventListener('click', downloadVideoNatively, false);
      }
    }
  }

  addFromManifest();

  function downloadVideoNatively(e) {
    var elem=e.currentTarget;
    e.returnValue=false;
    if (e.preventDefault) {
      e.preventDefault();
    }
    var loop=elem.getAttribute('loop');
    if (loop) {
      GM_download(downloadCodeList[loop].url, videoTitle+'.'+FORMAT_TYPE[downloadCodeList[loop].format]);
    }
    return false;
  }

  function addFromManifest() { // add Dash URLs from manifest file
    var formats=['137', '138', '140']; // 137=1080p, 138=4k, 140=m4a
    var isNecessary=true;
    for (var i=0;i<formats.length;i++) {
      if (videoURL[formats[i]]) {
        isNecessary=false;
        break;
      }
    }
    if (videoManifestURL && SHOW_DASH_FORMATS && isNecessary) {
      var matchSig=findMatch(videoManifestURL, /\/s\/([a-zA-Z0-9\.]+)\//i);
      if (matchSig) {
        var decryptedSig=decryptSignature(matchSig);
        if (decryptedSig) {
          videoManifestURL=videoManifestURL.replace('/s/'+matchSig+'/','/signature/'+decryptedSig+'/');
        }
      }
      videoManifestURL=absoluteURL(videoManifestURL);
      debug('DYVAM - Info: manifestURL '+videoManifestURL);
      crossXmlHttpRequest({
          method:'GET',
          url:videoManifestURL, // check if URL exists
          onload:function(response) {
            if (response.readyState === 4 && response.status === 200 && response.responseText) {
              debug('DYVAM - Info: maniestFileContents '+response.responseText);
              var lastFormatFromList=downloadCodeList[downloadCodeList.length-1].format;
              debug('DYVAM - Info: lastformat: '+lastFormatFromList);
              for (var i=0;i<formats.length;i++) {
                k=formats[i];
                if (videoURL[k] || showFormat[k]===false) continue;
                var regexp = new RegExp('<BaseURL>(http[^<]+itag\\/'+k+'[^<]+)<\\/BaseURL>','i');
                var matchURL=findMatch(response.responseText, regexp);
                debug('DYVAM - Info: matchURL itag= '+k+' url= '+matchURL);
                if (!matchURL) continue;
                matchURL=matchURL.replace(/&amp\;/g,'&')+videoTitle.replace(/#/g, '%23').replace(/&/g, '%26')+'.'+FORMAT_TYPE[k];
                // ...
                downloadCodeList.push(
                  {url:matchURL,sig:videoSignature[k],format:k,label:FORMAT_LABEL[k]});
                var downloadFMT=document.getElementById(LISTITEM_ID+lastFormatFromList);
                var clone=downloadFMT.parentNode.parentNode.cloneNode(true);
                clone.firstChild.firstChild.setAttribute('id', LISTITEM_ID+k);
                clone.firstChild.setAttribute('href', matchURL);
                downloadFMT.parentNode.parentNode.parentNode.appendChild(clone);
                downloadFMT=document.getElementById(LISTITEM_ID+k);
                downloadFMT.firstChild.nodeValue=FORMAT_LABEL[k];
                addFileSize(matchURL, k);
                lastFormatFromList=k;
              }
            }
          }
        });
    }
  }

  function injectStyle(code) {
    var style=document.createElement('style');
    style.type='text/css';
    style.appendChild(document.createTextNode(code));
    document.getElementsByTagName('head')[0].appendChild(style);
  }

  function injectScript(code) {
    var script=document.createElement('script');
    script.type='application/javascript';
    script.textContent=code;
    document.body.appendChild(script);
    document.body.removeChild(script);
  }

  function debug(str) {
    var debugElem=document.getElementById(DEBUG_ID);
    if (!debugElem) {
      debugElem=createHiddenElem('div', DEBUG_ID);
    }
    debugElem.appendChild(document.createTextNode(str+' '));
  }

  function createHiddenElem(tag, id) {
    var elem=document.createElement(tag);
    elem.setAttribute('id', id);
    elem.setAttribute('style', 'display:none;');
    document.body.appendChild(elem);
    return elem;
  }

  function fixTranslations(language, textDirection) {
    if (/^af|bg|bn|ca|cs|de|el|es|et|eu|fa|fi|fil|fr|gl|hi|hr|hu|id|it|iw|kn|lv|lt|ml|mr|ms|nl|pl|ro|ru|sl|sk|sr|sw|ta|te|th|uk|ur|vi|zu$/.test(language)) { // fix international UI
      var likeButton=document.getElementById('watch-like');
      if (likeButton) {
        var spanElements=likeButton.getElementsByClassName('yt-uix-button-content');
        if (spanElements) {
          spanElements[0].style.display='none'; // hide like text
        }
      }
      var marginPixels=10;
      if (/^bg|ca|cs|el|eu|hr|it|ml|ms|pl|sl|sw|te$/.test(language)) {
        marginPixels=1;
      }
      injectStyle('#watch7-secondary-actions .yt-uix-button{margin-'+textDirection+':'+marginPixels+'px!important}');
    }
  }

  function findMatch(text, regexp) {
    var matches=text.match(regexp);
    return (matches)?matches[1]:null;
  }

  function findMatch2(text, regexp) {
    var matches=text.match(regexp);
    return (matches)?matches[2]:null;
  }

  function isString(s) {
    return (typeof s==='string' || s instanceof String);
  }

  function isInteger(n) {
    return (typeof n==='number' && n%1===0);
  }

  function absoluteURL(url) {
    var link = document.createElement('a');
    link.href = url;
    return link.href;
  }

  function getPref(name) { // cross-browser GM_getValue
    var a='', b='';
    try {a=typeof GM_getValue.toString; b=GM_getValue.toString();} catch(e){}
    if (typeof GM_getValue === 'function' &&
    (a === 'undefined' || b.indexOf('not supported') === -1)) {
      return GM_getValue(name, null); // Greasemonkey, Tampermonkey, Firefox extension
    } else {
        var ls=null;
        try {ls=window.localStorage||null;} catch(e){}
        if (ls) {
          return ls.getItem(name); // Chrome script, Opera extensions
        }
    }
    return;
  }

  function setPref(name, value) { //  cross-browser GM_setValue
    var a='', b='';
    try {a=typeof GM_setValue.toString; b=GM_setValue.toString();} catch(e){}
    if (typeof GM_setValue === 'function' &&
    (a === 'undefined' || b.indexOf('not supported') === -1)) {
      GM_setValue(name, value); // Greasemonkey, Tampermonkey, Firefox extension
    } else {
        var ls=null;
        try {ls=window.localStorage||null;} catch(e){}
        if (ls) {
          return ls.setItem(name, value); // Chrome script, Opera extensions
        }
    }
  }

  function crossXmlHttpRequest(details) { // cross-browser GM_xmlhttpRequest
    if (typeof GM_xmlhttpRequest === 'function') { // Greasemonkey, Tampermonkey, Firefox extension, Chrome script
      GM_xmlhttpRequest(details);
    } else if (typeof window.opera !== 'undefined' && window.opera && typeof opera.extension !== 'undefined' &&
               typeof opera.extension.postMessage !== 'undefined') { // Opera 12 extension
        var index=operaTable.length;
        opera.extension.postMessage({'action':'xhr-'+index, 'url':details.url, 'method':details.method});
        operaTable[index]=details;
    } else if (typeof window.opera === 'undefined' && typeof XMLHttpRequest === 'function') { // Opera 15+ extension
        var xhr=new XMLHttpRequest();
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4) {
            if (details['onload']) {
              details['onload'](xhr);
            }
          }
        }
        xhr.open(details.method, details.url, true);
        xhr.send();
    }
  }

  function addFileSize(url, format) {

    function updateVideoLabel(size, format) {
      let elem = document.getElementById(LISTITEM_ID + format);
      if (elem) {
        size = fmtFileSize(size);
        if (elem.childNodes.length > 1) {
            elem.lastChild.nodeValue = ` (${size})`;
        } else if (elem.childNodes.length == 1) {
            elem.appendChild(document.createTextNode(` (${size})`));
        }
      }
    }

    var matchSize=findMatch(url, /[&\?]clen=([0-9]+)&/i);
    if (matchSize) {
      updateVideoLabel(matchSize, format);
    } else {
      try {
        crossXmlHttpRequest({
          method:'HEAD',
          url:url,
          onload:function(response) {
            if (response.readyState == 4 && response.status == 200) { // add size
              var size=0;
              if (typeof response.getResponseHeader === 'function') {
                size=response.getResponseHeader('Content-length');
              } else if (response.responseHeaders) {
                  var regexp = new RegExp('^Content\-length: (.*)$','im');
                  var match = regexp.exec(response.responseHeaders);
                  if (match) {
                    size=match[1];
                  }
              }
              if (size) {
                updateVideoLabel(size, format);
              }
            }
          }
        });
      } catch(e) { }
    }
  }

  function findDecodeCode(sourceCode) {
    let functionCode = null;
    let decodeFunctionName = null;
    //findMatch(sourceCode, /\.set\s*\("n"\s*,\s*\w+\),\s*[\$\w]+\.length\s*\|\|\s*([a-zA-Z0-9_$][\w$]*)\(/);
    if (decodeFunctionName !== null) {
      decodeFunctionName=decodeFunctionName.replace('$','\\$');

      let regCode = new RegExp(decodeFunctionName + '(\\s*=\\s*function' +
      '\\s*\\([\\w$]*\\)\\s*\\{[\\w\\W]+enhanced_except_[^\\}]+\\}return [\\w$]*\\.join\\(""\\)\\})');

      functionCode = findMatch(sourceCode, regCode);
      debug('DYVAM - Info: decodefunction ' + decodeFunctionName + ' -- ' + functionCode);
    } else {
      functionCode = findMatch(sourceCode, /(=\s*function\s*\([\w$]*\)\s*\{var\s+\w+=[\w\.]+split[\w\W]+_w8_[^\}]+\}return [\w$]*\.join\(""\)\})/)
                  || findMatch(sourceCode, /(=\s*function\s*\([\w$]*\)\s*\{var\s+\w+=String.prototype.split.call[\w\W]+enhanced_except_[^\}]+\}return Array.prototype.join.call\(\w+\s*,[^}]+\})/)
                  || findMatch(sourceCode, /(=\s*function\s*\([\w$]*\)\s*\{var\s+\w+=[\w\.]+split[\w\W]+enhanced_except_[^\}]+\}return [\w$]*\.join\(""\)\})/);
    }
    if (functionCode === null) return;

    window.eval(escapePolicy.createScript("window.decodeN" + functionCode.replace(/;\s*if\s*\(\s*typeof\s+[a-zA-Z0-9_$]+\s*===?\s*(["\'])undefined\1\s*\)\s*return\s+/, ';')));
//    window.decodeN("kj0jC6TdwykMd_xcr");
  }

  function findSignatureCode(sourceCode) {
    debug('DYVAM - Info: signature start '+getPref(STORAGE_CODE));
    var signatureFunctionName =
    findMatch2(sourceCode,
    /\b(?<var>[a-zA-Z0-9$]+)&&\((?:\1)=(?<sig>[a-zA-Z0-9$]{2,})\(decodeURIComponent\((?:\1)\)\)/)
    || findMatch2(sourceCode,
    /,(\D)=(\D+)\(decodeURIComponent\([\D]+\)\);\D\.set\(\D,encodeURIComponent\(\1\)/)
    || findMatch(sourceCode,
    /\W([a-zA-Z0-9$]{2})\s*=\s*function\(\s*a\s*\)\s*{\s*a\s*=\s*a\.split\(\s*""\s*\)/)
    || findMatch(sourceCode,
    /;\s*\w+\s*&&\s*\w+\.set\(\w+\s*,\s*\([^)]*\)\s*\(\s*([\w$]+)\s*\(/)
    || findMatch(sourceCode,
    /\/yt\.akamaized\.net\/\)\s*\|\|\s*\w+\.set\s*\(.*?\)\s*;\s*\w+\s*&&\s*\w+\.set\s*\(\s*\w+\s*,\s*(?:encodeURIComponent\s*\()?([\w$]+)\s*\(/)
    || findMatch(sourceCode,
    /;\s*\w+\s*&&\s*\w+\.set\(\w+\s*,\s*(?:encodeURIComponent\s*\()?([\w$]+)\s*\(/)
    || findMatch(sourceCode,
    /\.set\(\D,(?:encodeURIComponent\()?([\w$]+)\((?:decodeURIComponent\()?.+\)\)/)
    || findMatch(sourceCode,
    /\.set\(.+\|\|\"signature\",([\w$]+)\(.+\)\)/)
    || findMatch(sourceCode,
    /\.set\s*\("signature"\s*,\s*([a-zA-Z0-9_$][\w$]*)\(/)
    || findMatch(sourceCode,
    /\.sig\s*\|\|\s*([a-zA-Z0-9_$][\w$]*)\(/)
    || findMatch(sourceCode,
    /\.signature\s*=\s*([a-zA-Z_$][\w$]*)\([a-zA-Z_$][\w$]*\)/); //old
    if (signatureFunctionName === null) return setPref(STORAGE_CODE, 'error');
    signatureFunctionName=signatureFunctionName.replace('$','\\$');
    var regCode = new RegExp(signatureFunctionName + '\\s*=\\s*function' +
    '\\s*\\([\\w$]*\\)\\s*{[\\w$]*=[\\w$]*\\.split\\(""\\);\n*(.+);return [\\w$]*\\.join');
    var regCode2 = new RegExp('function \\s*' + signatureFunctionName +
    '\\s*\\([\\w$]*\\)\\s*{[\\w$]*=[\\w$]*\\.split\\(""\\);\n*(.+);return [\\w$]*\\.join');
    var functionCode = findMatch(sourceCode, regCode) || findMatch(sourceCode, regCode2);
    debug('DYVAM - Info: signaturefunction ' + signatureFunctionName + ' -- ' + functionCode);
    if (functionCode === null) return setPref(STORAGE_CODE, 'error');

    var reverseFunctionName = findMatch(sourceCode,
    /([\w$]*)\s*:\s*function\s*\(\s*[\w$]*\s*\)\s*{\s*(?:return\s*)?[\w$]*\.reverse\s*\(\s*\)\s*}/);
    debug('DYVAM - Info: reversefunction ' + reverseFunctionName);
    if (reverseFunctionName) reverseFunctionName=reverseFunctionName.replace('$','\\$');
    var sliceFunctionName = findMatch(sourceCode,
    /([\w$]*)\s*:\s*function\s*\(\s*[\w$]*\s*,\s*[\w$]*\s*\)\s*{\s*(?:return\s*)?[\w$]*\.(?:slice|splice)\(.+\)\s*}/);
    debug('DYVAM - Info: slicefunction ' + sliceFunctionName);
    if (sliceFunctionName) sliceFunctionName=sliceFunctionName.replace('$','\\$');

    var regSlice = new RegExp('\\.(?:'+'slice'+(sliceFunctionName?'|'+sliceFunctionName:'')+
    ')\\s*\\(\\s*(?:[a-zA-Z_$][\\w$]*\\s*,)?\\s*([0-9]+)\\s*\\)'); // .slice(5) sau .Hf(a,5)
    var regReverse = new RegExp('\\.(?:'+'reverse'+(reverseFunctionName?'|'+reverseFunctionName:'')+
    ')\\s*\\([^\\)]*\\)');  // .reverse() sau .Gf(a,45)
    var regSwap = new RegExp('[\\w$\\[\\]"]+\\s*\\(\\s*[\\w$]+\\s*,\\s*([0-9]+)\\s*\\)');
    var regInline = new RegExp('[\\w$]+\\[0\\]\\s*=\\s*[\\w$]+\\[([0-9]+)\\s*%\\s*[\\w$]+\\.length\\]');
    var functionCodePieces=functionCode.split(';');
    var decodeArray=[];
    for (var i=0; i<functionCodePieces.length; i++) {
      functionCodePieces[i]=functionCodePieces[i].trim();
      var codeLine=functionCodePieces[i];
      if (codeLine.length>0) {
        var arrSlice=codeLine.match(regSlice);
        var arrReverse=codeLine.match(regReverse);
        debug(i+': '+codeLine+' --'+(arrSlice?' slice length '+arrSlice.length:'') +' '+(arrReverse?'reverse':''));
        if (arrSlice && arrSlice.length >= 2) { // slice
        var slice=parseInt(arrSlice[1], 10);
        if (isInteger(slice)){
          decodeArray.push(-slice);
        } else return setPref(STORAGE_CODE, 'error');
      } else if (arrReverse && arrReverse.length >= 1) { // reverse
        decodeArray.push(0);
      } else if (codeLine.indexOf('[0]') >= 0) { // inline swap
          if (i+2<functionCodePieces.length &&
          functionCodePieces[i+1].indexOf('.length') >= 0 &&
          functionCodePieces[i+1].indexOf('[0]') >= 0) {
            var inline=findMatch(functionCodePieces[i+1], regInline);
            inline=parseInt(inline, 10);
            decodeArray.push(inline);
            i+=2;
          } else return setPref(STORAGE_CODE, 'error');
      } else if (codeLine.indexOf(',') >= 0) { // swap
        var swap=findMatch(codeLine, regSwap);
        swap=parseInt(swap, 10);
        if (isInteger(swap) && swap>0){
          decodeArray.push(swap);
        } else return setPref(STORAGE_CODE, 'error');
      } else return setPref(STORAGE_CODE, 'error');
      }
    }

    if (decodeArray) {
      setPref(STORAGE_URL, scriptURL);
      setPref(STORAGE_CODE, decodeArray.toString());
      DECODE_RULE=decodeArray;
      debug('DYVAM - Info: signature '+decodeArray.toString()+' '+scriptURL);
      // update download links and add file sizes
      /*
      for (var i=0;i<downloadCodeList.length;i++) {
        var elem=document.getElementById(LISTITEM_ID+downloadCodeList[i].format);
        var url=downloadCodeList[i].url;
        var sig=downloadCodeList[i].sig;
        if (elem && url && sig) {
          url=url.replace(/\&signature=[\w\.]+/, '&signature='+decryptSignature(sig));
          elem.parentNode.setAttribute('href', url);
          addFileSize(url, downloadCodeList[i].format);
        }
      }
      */
    }
  }

  function isValidSignatureCode(arr) { // valid values: '5,-3,0,2,5', 'error'
    if (!arr) return false;
    if (arr=='error') return true;
    arr=arr.split(',');
    for (var i=0;i<arr.length;i++) {
      if (!isInteger(parseInt(arr[i],10))) return false;
    }
    return true;
  }

  async function loadScript(scriptURL) {
    return new Promise(result => {
      try {
        debug('DYVAM fetch '+scriptURL);
        isSignatureUpdatingStarted=true;
        crossXmlHttpRequest({
          method:'GET',
          url:scriptURL,
          onload:function(response) {
            debug('DYVAM fetch status '+response.status);
            if (response.readyState === 4 && response.status === 200 && response.responseText) {
              findSignatureCode(response.responseText);
              findDecodeCode(response.responseText);
              result(true);
            }
          }
        });
      } catch(e) {
          result(false);
      }
    });
  }

  async function fetchSignatureScript(scriptURL) {
      /*
    var storageURL=getPref(STORAGE_URL);
    var storageCode=getPref(STORAGE_CODE);
    if (!(/,0,|^0,|,0$|\-/.test(storageCode))) storageCode=null; // hack for only positive items
    if (storageCode && isValidSignatureCode(storageCode) && storageURL &&
        scriptURL==absoluteURL(storageURL)) return;
*/
    const result = await loadScript(scriptURL);
  }

  function getDecodeRules(rules) {
    var storageCode=getPref(STORAGE_CODE);
    if (storageCode && storageCode!='error' && isValidSignatureCode(storageCode)) {
      var arr=storageCode.split(',');
      for (var i=0; i<arr.length; i++) {
        arr[i]=parseInt(arr[i], 10);
      }
      rules=arr;
      debug('DYVAM - Info: signature '+arr.toString()+' '+scriptURL);
    }
    return rules;
  }

  function decryptSignature(sig) {
    function swap(a,b){var c=a[0];a[0]=a[b%a.length];a[b]=c;return a;}
    function decode(sig, arr) { // encoded decryption
      if (!isString(sig)) return null;
      var sigA=sig.split('');
      for (var i=0;i<arr.length;i++) {
        var act=arr[i];
        if (!isInteger(act)) return null;
        sigA=(act>0)?swap(sigA, act):((act===0)?sigA.reverse():sigA.slice(-act));
      }
      var result=sigA.join('');
      return result;
    }

    if (sig===null) return '';
    var arr=DECODE_RULE;
    if (arr) {
      var sig2=decode(sig, arr);
      if (sig2) return sig2;
    } else {
      setPref(STORAGE_URL, '');
      setPref(STORAGE_CODE, '');
    }
    return sig;
  }

  }

})();
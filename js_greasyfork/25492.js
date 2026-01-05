// ==UserScript==
// @name video auto size (kissanime)
// @description resize the video to pixel format size
// @namespace gnblizz
// @homepageURL https://greasyfork.org/en/scripts/25492-video-auto-size-kissanime
// @include https://kissanime.ac/*
// @include https://kissanime.ru/*
// @exclude https://kissanime.ru/xyz/check.aspx
// @include https://openload.co/embed/*
// @include https://www.rapidvideo.com/*
// @include https://streamango.com/embed/*
// @version 1.07
// @grant none
// @compatible firefox
// @compatible chrome
// @run-at document-start
// @icon data:image/gif;base64,R0lGODlhMAAwAKECAAAAAICAgP///////yH5BAEKAAMALAAAAAAwADAAAALQnI+py+0Po5y02ouz3rz7D4biBJTmiabqyrbuC8fyHAf2jedpzuOvAAwKh6mhUfg7Hks3gHLpehptwIBTioxig0zrdStIgrslMFA8pCKp1oAZjXW6w/Mt/Nl2t8HeFl7o5QZgBagEYyawNxhUl7h4dlelFlZG+QVY6aglmIjjuKd50xla9RKI0mSCqaPJSMM0aEK4mhfbpSnTabM4WXrShtpHI6gqKvmKnCwns0tm2lOsLP3aUy08aK0zvc3d7b09Ei4+Tl5ufo6err7O3n5QAAA7
// @downloadURL https://update.greasyfork.org/scripts/25492/video%20auto%20size%20%28kissanime%29.user.js
// @updateURL https://update.greasyfork.org/scripts/25492/video%20auto%20size%20%28kissanime%29.meta.js
// ==/UserScript==
"use strict";

var autodimmer = true;

var video, container, isTop = window.self==window.top, once;

function RunWhenVideoReady(cb) {
  if(!video) video = fn('VIDEO');
  if(video.readyState) cb(); else video.addEventListener('loadedmetadata', cb);
  video.addEventListener('ended', EndFullScreenMode, false);
}

function SetResolution(event) { window.self.postMessage('videoformat' + this.textContent, 'http://kissanime.ru'); }

function showVideoSizeInfo() {
  rn(nn('DIV', { TEXT: video.videoWidth + 'x' + video.videoHeight, style:{ position: 'absolute', top: 1, left: 2, color: 'white', textShadow: '1px 1px black', fontSize: 'large', fontWeight: 'bold'}}, video.parentNode), 7);
  if(!isTop)
    window.top.postMessage('videoformat'.concat(video.videoWidth, 'x', video.videoHeight), 'https://kissanime.ru');
  if(autodimmer) {
    if(isTop) {
      var dim = fn('#allofthelights_bg1');
      if(!dim || dim.style.display != 'block')
        setTimeout(function() { fn('#switch').click() }, 100);
    } else video.addEventListener('ended', function(event) { window.top.postMessage('videoended', 'https://kissanime.ru'); }, false);
  }
}

window.addEventListener('DOMContentLoaded', function(e) {
video = fn('VIDEO');
//console.info('Started VideoAutoSize at:', location.hostname);
if(isTop) switch(location.hostname) {
case 'kissanime.ru':
  if(location.pathname == '/Special/AreYouHuman2') {
    document.title = unescape(location.search).match(/\/[^?]+/)[0].replace(/\/Anime\//, '').replace(/\/|-/g, ' ');
    break;
  }
  if(video) {
    RunWhenVideoReady(setSizeNow);
    SetStyle('.vjs-playing.vjs-user-inactive{cursor:none}');
  } else {
    container = fn('?#divMyVideo>iframe');
    if(container) {
      window.addEventListener('message', receiveMessage, false);
      var div = nn('DIV#defaultvideosizes', 0, container.parentNode.parentNode.parentNode), resolutions = '1200x800/800x600/640x480'.split('/');
      while(resolutions.length) {
        nn('BUTTON', { type: 'button', TEXT: resolutions.shift() }, div).onclick = SetResolution;
      }
      SetStyle('iframe[id^=ads],#divFloatRight',{visibility:'hidden'}, '#adsIfrme button', {margin: '2px 10px', backgroundColor: '#393939', color: '#ccc', border: '1px solid #666666;'});
    } else {
      var h = setInterval(function() { //TODO: use observers
        video = fn('VIDEO');
        if(video) {
          clearInterval(h);
          RunWhenVideoReady(setSizeNow);
        }
      }, 500);
    }
  }
  break;
case 'kissanime.ac': // .io
  setTimeout(function() {
    var myPlayer = videojs('player_html5' + (player_reload || ''));
    myPlayer.ready(function () {
      video = fn('VIDEO');
      RunWhenVideoReady(function(){
        var w = video.videoWidth, h = video.videoHeight, i = 'px!important';
        showVideoSizeInfo();
        SetStyle(
          'video',{objectPosition:'center top'},
          'div#container',{width:(w+40)+i},
          'div#player_html5,div#player_container',{width:(w)+i,height:(h+30)+i},
          'div#centerDivVideo',{maxWidth:'unset'},
          '.vjs-user-inactive',{cursor:'none'},
          '[style*="float"]{display:none!important;}').id = 'autosizestyle';
        video.scrollIntoView();
        i = fn('#AdtruePopupVideoClose');
        if(i) i.click();
      });
    });
  }, 3000);
  break;
} else {
  switch(location.hostname) {
  case 'openload.co':
    RunWhenVideoReady(showVideoSizeInfo);
    setTimeout(function() { window.popAdsLoaded = 1; fn('#videooverlay').click(); }, 1000);
    setTimeout(function() { fn('.vjs-poster').click(); window.BetterJsPop.destroy(); }, 2000);
    break;
  case 'www.rapidvideo.com':
    setTimeout(function() {
      RunWhenVideoReady(showVideoSizeInfo);
    }, 3000);
    SetStyle('video', {objectFit: 'contain !important', backgroundColor: '#111111'}, '#spinner~*:not(style)', {display: 'none'});
    break;
  case 'streamango.com':
    RunWhenVideoReady(showVideoSizeInfo);
    SetStyle('.vjs-user-inactive.vjs-playing', {cursor: 'none'});
    break;
}}
});

function receiveMessage(event) {
  // console.log('VideoAutoSize received:', event.data);
  if(typeof event.data == 'string') switch(event.data.slice(0,11)) {
  case 'videoformat':
    var m = event.data.match(/(\d+)x(\d+)$/);
    video = { videoWidth: parseInt(m[1]), videoHeight: parseInt(m[2])};
    setSizeNow(event);
    if(event.source != window.self) rn('#defaultvideosizes');
    if(autodimmer) {
      var dim = fn('#allofthelights_bg1');
      if(!dim || dim.style.display != 'block') fn('#switch').click();
    }
    break;
  case 'videoended':
    if(autodimmer) {
      var dim = fn('#allofthelights_bg1');
      if(dim && dim.style.display == 'block') dim.click();
    }
    break;
  }
}

function setSizeNow(event) {
  function parsePx(px){ if(/^\d+px$/.test(px)) return parseInt(px); }
  var obj, videoWidth = video.videoWidth, videoHeight = video.videoHeight;
  //
  console.log('VideoAutoSize video format:', [videoWidth,videoHeight].join('x'));
  if(container) video = container;
  else {
    showVideoSizeInfo(video);
    video.style.objectPosition = 'center top';
  }
  obj = video;
  var n, origWidth = parsePx(obj.style.width) || parsePx(obj.parentNode.style.width) || obj.clientWidth,
    origHeight = parsePx(obj.style.height) || parsePx(obj.parentNode.style.height) || obj.clientHeight;
  if(!origWidth) throw 'no width found!'; if(!origHeight) throw 'no height found!';
  var deltaWidth = videoWidth - origWidth, deltaHeight = videoHeight+30 - origHeight;
  do {
    n = parsePx(obj.style.width); if(n) obj.style.width = (n + deltaWidth)+ 'px';
    n = parsePx(obj.style.height); if(n) obj.style.height = (n + deltaHeight)+ 'px';
    obj = obj.parentNode;
  } while(obj.id != 'containerRoot' && obj.tagName != 'BODY');
  if(!once) {
    once = 1;
    obj = document.querySelectorAll('.divCloseBut>a');
    for(var i of obj) { i.click(); }
    if(!window.scrollY) video.scrollIntoView();
  }
}

function FullScreenElement() {
  if(document.exitFullscreen) return document.fullscreenElement;
  if(document.mozCancelFullScreen) return document.mozFullScreenElement;
  if(document.webkitExitFullscreen) return document.webkitFullscreenElement;
}

function EndFullScreenMode() {
  if(!FullScreenElement()) return false;
  (document.exitFullscreen||document.mozCancelFullScreen||document.webkitExitFullscreen).call(document);
  return true;
}

// new node
function nn(name, attributes, insertion) {
  var a = name.split('.'), i = a.shift().split('#'), node = document.createElement(i.shift());
  if(i[0]) node.id = i[0];
  if(a[0]) node.className = a.join(' ');
  if(attributes) {
    var names = Object.keys(attributes);
    for(name of names) {
      var value = attributes[name];
      switch(name) {
      case 'TEXT':
        node.textContent = value;
        break;
      case 'HTML':
        node.innerHTML = value;
        break;
      case 'style':
        if(typeof value == 'object')
          value = ConvertCSS(value);
      default:
        node.setAttribute(name, value);
      }
    }
  }
  if(insertion) {
  if(insertion.appendChild) insertion.appendChild(node);
  else {
  i = Object.keys(insertion)[0];
  if(i) {
    a = insertion[i];
    switch(i) {
    case 'append': a.appendChild(node); break;
    case 'insert': a.insertBefore(node, a.firstChild); break;
    case 'before': a.parentNode.insertBefore(node, a); break;
    case 'after': a.parentNode.insertBefore(node, a.nextSibling); break;
    }
  }}}
  return node;
}

// find node
function fn(name, parent) {
  if(!parent) parent = document;
  switch(name.charAt(0)) {
  case '#': return parent.getElementById(name.slice(1));
  case '.': return parent.getElementsByClassName(name.slice(1))[0];
  case '?': return parent.querySelector(name.slice(1));
  }
  return parent.getElementsByTagName(name)[0];
}

// remove node
function rn(node, delay, cb) {
  if(delay) {
    window.setTimeout(function() {
      if(!cb || !cb(node)) rn(node);
    }, 1000 * parseFloat(delay));
    return;
  }
  if(typeof(node)=='string') node = fn(node);
  if(node && node.parentNode) return node.parentNode.removeChild(node);
}

// CSS
function SetStyle() {
  var i = 0, style = '', t;
  do {
    style += arguments[i++];
    t = arguments[i++];
    switch(typeof t) {
    case 'object':
      t = ConvertCSS(t);
    case 'string':
      style += '{' + t + '}\n';
    }
  } while(i < arguments.length);
  return nn('STYLE', { TEXT: style }, document.head);
}

function ConvertCSS(def) {
  var names = Object.keys(def), style = '', name, value;
  for(name of names) {
    value = def[name];
    if(typeof value == 'number' && name != 'zIndex') value += 'px';
    style += name.replace(/([A-Z])/g, '-$1').toLowerCase().concat(': ', value, '; ');
  }
  return style.trimRight();
}

// public domain by gnblizz
// contact me with my username + '@web.de'
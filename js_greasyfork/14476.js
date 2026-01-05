// ==UserScript==
// @name        yahvt
// @description yet another html5 video tool
// @namespace   gnblizz
// @homepageURL https://greasyfork.org/en/scripts/14476-yahvt
// @version     1.17
// @include     http://anilinkz.io/*
// @include     http://www.animecenter.tv/*
// @include     http://www.animedreaming.tv/*
// @include     http://anime-exceed.com/*
// @include     http://www.animefreak.tv/*
// @include     http://www.animenova.org/*
// @include     http://play.animenova.org/*
// @include     http://www.animeplus.tv/*
// @include     http://www.animeseason.com/*
// @include     http://as.animes-stream24.tv/*
// @include     http://www.anime-sub.co/*
// @include     http://www.animetoon.org/*
// @include     http://www.animeultima.io/*
// @include     http://www.animewow.org/*
// @include     http://bestanimes.tv/*
// @include     http://www.chia-anime.tv/*
// @include     http://www.clipfish.de/*
// @include     http://dramago.com/*
// @include     http://www.drama.net/*
// @include     http://www.dramago.com/*
// @include     http://www.dramagalaxy.tv/*
// @include     http://dubbedanime.net/*
// @include     http://www.dubzonline.ca/*
// @include     http://freeanime.com/*
// @include     http://www.gogoanime.to/*
// @include     http://www.goodanime.co/*
// @include     http://www.gooddrama.to/*
// @include     http://www.lovemyanime.net/*
// @include     http://playbb.me/*
// @include     http://video66.org/new/*
// @include     http://videozoo.me/*
// @include     http://www.videozoo.me/*
// @include     about:blank?video=*
// @include     h*embed*
// @include     h*gogo/*
// @include     h*widget/*
// @exclude     https://apis.google.com/*
// @exclude     https://archive.org/embed/*
// @exclude     https://openload.co/embed/*
// @run-at      document-start
// @grant       GM_xmlhttpRequest
// @icon        data:image/gif;base64,R0lGODlhMAAwAKECAAAAAICAgP///////yH5BAEKAAMALAAAAAAwADAAAALQnI+py+0Po5y02ouz3rz7D4biBJTmiabqyrbuC8fyHAf2jedpzuOvAAwKh6mhUfg7Hks3gHLpehptwIBTioxig0zrdStIgrslMFA8pCKp1oAZjXW6w/Mt/Nl2t8HeFl7o5QZgBagEYyawNxhUl7h4dlelFlZG+QVY6aglmIjjuKd50xla9RKI0mSCqaPJSMM0aEK4mhfbpSnTabM4WXrShtpHI6gqKvmKnCwns0tm2lOsLP3aUy08aK0zvc3d7b09Ei4+Tl5ufo6err7O3n5QAAA7
// @compatible  firefox
// @compatible  chrome
// @downloadURL https://update.greasyfork.org/scripts/14476/yahvt.user.js
// @updateURL https://update.greasyfork.org/scripts/14476/yahvt.meta.js
// ==/UserScript==
"use strict";
var doc=document, isTop=window.self==window.top, domain = (doc.domain||'unknown.').split('.').reverse(), insertionPoint, isFF = /Firefox/i.test(navigator.userAgent), maxmsg=99;

doc.addEventListener('DOMContentLoaded', yahvt);

!function earlyHacks(){
  switch(domain[1]) {
  case 'clipfish'://.de
    if(isFF) nn('SCRIPT', { TEXT: 'checkMobile=function(){isMobile=true;}' }, doc.body);
    else Object.defineProperty(navigator, "userAgent", {value: 'fake Android'});
    break;
  }
}();

function sites(){
  var a,i,o,e,b;
  //console.log('yahvt: domain =', domain);
  switch(domain[1]) {
  case 'anilinkz'://.tv => io
    SetStyle('ID=yahvt_noad', '#waifu,body>div:empty[style*="z-index: 2147483647;"]{display:none;}');
    allowFullscreen('#player');
    /*setTimeout(function () {
      var i = setInterval(function () {}, 999);
      do { clearInterval(i); } while(--i);
      i = setTimeout(function () {}, 999);
      do { clearTimeout(i); } while(--i);
    }, 45000);//*/
    break;
  case 'animecenter'://.tv
    allowFullscreen('#video');
    break;
  case 'animedreaming'://.tv
    allowFullscreen('.videoholder');
    break;
  case 'anime-exceed'://.com
    allowFullscreen('#player', (/^\/cool\//.test(location.pathname)?'':'body'),0,999);
    break;
  case 'animefreak'://.tv
    a=na('.multi'); for(o of a) {
      e = o.getAttribute('onclick');
      if(e && /loadParts\('http/.test(e))
        o.onclick = function(event) {
          var vid_file = decodeURIComponent(this.getAttribute('onclick').match(/loadParts\('([^']+)'/)[1]);
          doc.getElementById("player").innerHTML = '<video controls width="100%" height="412" src="' + vid_file + '" allowfullscreen="true" autoplay></video>';
        };
    }
    break;
  case 'animenova'://.tv => org
  case 'animeplus'://.tv
  case 'animetoon'://.tv => org
  case 'animewow'://.eu => org
  case 'dramagalaxy'://.eu,com => tv
  case 'dramago'://.com
  case 'gooddrama'://.net => to
    allowFullscreen('#streams');
    return 1;
  case 'animeseason'://.com
    if(fn('#series_info'))
      SetStyle('table a:visited{color:gray;}table a:hover{color:#FC0;}');
    allowFullscreen('#video_source', 0, '#player_list A');
    break;
  case 'drama'://.net
    SetStyle('#Movie>div:first-child{height:411px}#Movie.max>div:first-child{height:585px}#Movie>div>iframe{width:100%;height:100%;}div.header{z-index:99;}div.container{z-index:unset;}');
    allowFullscreen('#Movie');
    break;
  case 'anime-sub'://.com => co
    allowFullscreen('#movie-content');
    break;
  case 'animeultima'://.tv => io // error
    allowFullscreen('#pembed');
    break;
  case 'bestanimes'://.tv
    allowFullscreen('.post');
    break;
  case 'freeanime'://.com
    nn('SCRIPT', { HTML: '$(window).unbind();\n$("#header").css("background-attachment","scroll")'}, doc.body);
    allowFullscreen('.z-video', 0, 'ul.z-tabs-nav LI', 999);
    break;
  case 'goodanime'://.net => co
    allowFullscreen('#content');
  case 'dubzonline'://.com => ca
    return(location.pathname == '/embed.php');
  case 'lovemyanime'://.net
    //allowFullscreen('.player-area');
    break;
  case 'animes-stream24'://.net => .tv
    allowFullscreen('#main');
    break;
  case 'gogoanime'://.com => .to
    return location.pathname=='/flowplayer/' || allowFullscreen('#content');
  case 'video66'://.org
  case 'playbb'://.me
  case 'videozoo'://.me
    return 1;//  return(location.pathname == '/dr_video_player.php');
  case 'unknown'://about:blank?video="..."
    if(/^about:blank\?video=/.test(location.href))
      return nn('SCRIPT', { TEXT: '("'+location.href.slice(18)+'")' }, doc.body);
    break;
  default:
    return(/(embed\b|\/gogo\/|\/widget\/)/.test(doc.URL));
  }

function allowFullscreen(selTop, selFrame, mirrors, delay) {
  if(delay)
    window.setTimeout( function() { allowFullscreen(selTop, selFrame, mirrors); }, delay);
  else {
    var a,i;
    if(isTop) {
      if(mirrors) {
        a = doc.querySelectorAll(mirrors);
        for(i of a) {
          i.addEventListener('click', function() {
            window.setTimeout( function() { doc.querySelector(selTop+' IFRAME').setAttribute('allowfullscreen', 'true'); }, 99);
          });
        }
      }
      a = doc.querySelectorAll(selTop+' IFRAME');
      if(!a.length) console.log('yahvt: couldn\'t apply fullscreen attribute because '+selTop+' IFRAME not found in '+doc.URL);
      for(i of a) { i.setAttribute('allowfullscreen', 'true'); }
    } else if(selFrame) {
      a = doc.querySelectorAll(selFrame+' IFRAME');
      for(i of a) { i.setAttribute('allowfullscreen', 'true'); }
    }
  }
}}

// FULL SCREEN API

//requires about:config full-screen-api.allow-trusted-requests-only=false
function SetFullScreenMode(v) {
  (v.requestFullscreen||v.mozRequestFullScreen||v.webkitRequestFullscreen||v.webkitEnterFullscreen).call(v);
  //console.info('To allow full screen mode, you may want to set full-screen-api.allow-trusted-requests-only to false in about:config.');
}

function FullScreenElement() {
  if(doc.exitFullscreen) return doc.fullscreenElement;
  if(doc.mozCancelFullScreen) return doc.mozFullScreenElement;
  if(doc.webkitExitFullscreen) return doc.webkitFullscreenElement;
}

function EndFullScreenMode() {
  if(!FullScreenElement()) return false;
  (doc.exitFullscreen||doc.mozCancelFullScreen||doc.webkitExitFullscreen).call(doc);
  return true;
}

function OnFullScreenChange(fn) {
  if(doc.exitFullscreen) doc.addEventListener("fullscreenchange", fn);
  if(doc.mozCancelFullScreen) doc.addEventListener("mozfullscreenchange", fn);
  if(doc.webkitExitFullscreen) doc.addEventListener("webkitfullscreenchange", fn);
}

function SetFocus(v) {
  if(!v) v = fn('VIDEO');
  setTimeout(function(){ v.focus(); }, 0);
}

// new node
function nn(name, attributes, insertion) {
  var a = name.split('.'), i = a.shift().split('#'), node = doc.createElement(i.shift());
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
  if(insertion.appendChild)
    insertion.appendChild(node);
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
  if(!parent) parent = doc;
  switch(name.charAt(0)) {
  case '#': return parent.getElementById(name.slice(1));
  case '.': return parent.getElementsByClassName(name.slice(1))[0];
  case '?': return parent.querySelector(name.slice(1));
  }
  return parent.getElementsByTagName(name)[0];
}

// find nodes array
function na(name, parent) {
  if(!parent) parent = doc;
  return (name.charAt(0)=='.') ? parent.getElementsByClassName(name.slice(1)) : parent.getElementsByTagName(name);
}

// remove node
function rn(node) {
  if(typeof(node)=='string') node = fn(node);
  if(node) return node.parentNode.removeChild(node);
}

function domainName(href) {
  if(!href) href = location.href;
  var m = href.match(/\:\/\/(?:www\.|embed\.)?([^\/]+)/);
  if(m) return m[1];
  return 'unknown';
}

function Remember(name, value) {
 try {
  if(sessionStorage) switch(value) {
  case '':
    sessionStorage.removeItem(name);
    break;
  case undefined:
    value = 'yes';
  default:
    sessionStorage.setItem(name, value);
  }
 }catch(e){}
}

function remembered(name, forget) {
  try {
    var x = sessionStorage.getItem(name);
    if(forget) sessionStorage.removeItem(name);
    return x;
  } catch(e) {
    if(name=='autoplay' && (domain[1]=='unknown' || /\bnoflash\b/.test(location.search) || /(part|clip|chunk)_?0?[2-9]/.test(location.pathname))) return 'yes';
  }
}

// style
function SetStyle() {
  var i = 0, style = '', t, name = 'STYLE';
  if(arguments[0].startsWith('ID='))
    name += '#' + arguments[i++].slice(3);
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
  return nn(name, { TEXT: style }, doc.head);
}

function ConvertCSS(def) {
  var names = Object.keys(def), style = '', name, value;
  for(name of names) {
    value = def[name];
    if(typeof value == 'number' && ['zIndex','opacity'].indexOf(name) < 0) value += 'px';
    style += name.replace(/([A-Z])/g, '-$1').toLowerCase().concat(': ', value, '; ');
  }
  return style.trimRight();
}

///////////////////////////////////////////////////////////

function findVideoFiles() {
function getScript(o) {
  s = o.innerHTML;
  if(s.length) {
    var m = s.match(/^eval(\(function\(p(?:,[a-ek]){5}\).+\bsplit\b.+)$/m), timer;
    if(m) {
      try { s += eval(m[1]); console.log('yahvt: Packed script detected.'); } catch(e) { console.log('yahvt: Packed script parse error.'); }
    }
    s = unescape(s.replace(/\s\/\/.*$/gm,'').replace(/\s+/gm,' ').replace(/\/\*.*\*\//g,'').replace(/'/g,'"'));
    /*if(domain[1]=='dailymotion')*/ s = s.replace(/\\\//g, '/');
    return s;
  }
}
function add(m) { if(m && v.indexOf(m)<0) v.push(m); }
function addm1(m) { if(m && v.indexOf(m[1])<0) v.push(m[1]); }
function find(pattern) {
  var g = /g/.test(pattern.flags);
  do {
    var m = pattern.exec(s);
    if(!m) break;
    try {
      add(decodeURIComponent(unescape(m[1])));
    } catch(e) {
      add(m[1]);
    }
  } while(g);
}
//findVideoFiles() {
  var v = [], s, m, a, i, p;
  a = fn('VIDEO', doc.body);
  if(a) {//usually doesn't exist yet
    add(a.getAttribute('src'));
    a = na('SOURCE', a);
    for(i of a) {
      add(i.getAttribute('src'));
    }
  }
  a = na('SCRIPT', (domain[1]=='videozoo' ? doc.documentElement : doc.body));
  //console.log(a.length, 'scripts at', domain[1]);
  for(i of a) {
    if(getScript(i)) {
      //console.log(s);
      find(/"(https?:\/\/[^"]+\.(?:mp4|flv)\b.*?)"/gi); //find(/"(https?:\/\/[^"]+\.(?:mp4|flv)\b[^"]*)"/gi);
      find(/"(.+\.php\b.+\.(?:mp4|flv))"/gi);
      find(/"([^"]+\bpicasa\.php\b[^"]+)"/gi);
      find(/"(https\:\/\/[^"]*\.google(?:video\.com\/videoplayback|usercontent.com\/)[^"]+)"/gi);
    }
  }
  switch(domain[1]) {
  case 'trollvid'://.net// Is this of any use today? TODO obsolete?
    for(i of a) {
      s = i.innerHTML; m = s.match(/['"](http.+?data.*?file.*?)['"]/i); addm1(m);
    }
    a = na('SCRIPT', doc.head); for(i of a) {
      m = i.innerHTML.match(/unescape\(atob\('(.+?)'/);
      if(m) { m = unescape(atob(m[1])); if(/\.(mp4|flv)/i.test(m)) add(m); }
    }
    break;
  case 'videobam'://.com// Is this of any use today?
    for(i of a) {
      s = i.innerHTML; m = s.match(/['"](http:\\\/\\\/[^'"]+\.(?:mp4|flv)\b[^'"]*)['"]/i); if(m) add(m[1].replace(/\\\//g,'/'));
    }
  case 'yourupload'://.com
    try {
      s = fn('#player').nextElementSibling.textContent;
      m = s.match(/'(\/play\/\d+\.flv\?.+?)'/);if(m) add(m[1]);
    }catch(e){ console.log(e); }
  }
  try {// even if it looks wierd...
    m = fn('?#flowplayer+script').innerHTML.replace(/\s+/g, ' ').match(/\/\* playlist\: \[ \{ url\: '(.*)'/)[1];
    if(!/\<|\>/.test(m)) {
      console.log('yahvt: html5_path in comment found.');
      add(m);
    }
  } catch(e){}
  a = na('PARAM'); for(i of a) { p = i.getAttribute('value'); m = p.match(/video=(https?:\/\/[^'"]+\.mp4[^'"&]*)/i); addm1(m); }
  a = na('EMBED'); for(i of a) { p = i.getAttribute('src'); m = p.match(/video=(https?:\/\/[^'"]+\.mp4[^'"&]*)/i); addm1(m); }
  switch(domain[1]) {
  case 'dailymotion':
  case 'vidstreaming':
    return v.reverse();
  case 'mp4upload':
    i = v.length;
    if(i) do {
      a = v[--i];
      if(a.match(/\.com\/\w+(?:\.mp4)?$/)) {
        console.log('yahvt:', a, 'ignored.');
        delete v[i];
      }
    } while(i);
  }
  return v;
}

function yahvt(loadevent) {
function insertVideo() {
function ShowSomeInfo(meta) {
  var style = '', txt = domainName() + (nvp ? (' video part '+nvp.now) : ' video'), src = v.currentSrc, m, adr = ['mailto:gnblizz'];
  if(meta) {
    var t = v.duration + .5;
    txt += '<br>pixel format: ' + v.videoWidth + 'x' + v.videoHeight
    + '<br>duration: ' + Math.floor(t/60) + ':' + ('0' + Math.floor(t%60)).slice(-2);
  } else style = { color: '#666' };
  m = src.match(/https?:\/\/([^:?/]+)/);
  if(m) txt += '<br>video host name: ' + m[1];
  m = src.match(/.*\/([^?/]*)/);
  if(m) txt += '<br>video file name: ' + m[1];
  txt += '<br><br>A - toggle stretch mode<br>F - toggle full screen mode<br>I - '+(meta ? 'this info<br>Q - quick viewing<br>S - slow motion' : 'some info')+'<br>Z - zoom';
  if(meta) {
    adr.push('@web.de?subject=yahvt%20at%20', doc.domain);
    txt += '<br><br><small><a target="_newtab" href="https://greasyfork.org/en/scripts/14476-yahvt" title="info, code, feedback and stats of yahvt">yahvt</a> is public domain by <a href="' + adr.join('')
        + '" title="email the author directly">gnblizz</a>.</small>';
  }
  nn('DIV.info', { HTML: txt, style: style }, v.parentNode);
  window.setTimeout(StopInfo, 15000);
}
function StopInfo() {
  if(!v.paused || v.currentTime < 5) return rn(fn('?div.info', p));
  var div = fn('.info', p);
  if(div) nn('SMALL', { HTML: '<br><br>If there are issues regarding yahvt, someone has to complain.<br>Therefore, the two links above.' }, div);
}
function NextPart(name) {
  var m = name.match(/^(.*(?:part|clip|chunk)_?0?)(\d+)(.*)$/), i;
  if(m)
    return {now: i = parseInt(m[2]), next: ++i, URL: m[1]+i+m.pop()};
}
function StartStop() {
  if(v.paused) v.play();
  else v.pause();
}
//insertVideo() {
  var nvp = NextPart(doc.URL), txt = '<video controls ' + (autoplay ? 'autoplay ' : '') + 
    'width="100%" height="100%" tabindex="0', altClick, hTimer2, autoHide, smw, delay = 2;
  av.push(av[0]+'&noflash');
  av.push(av[0]+'&html5=true');
  av.forEach(function(x){ txt += '"><source src="' + x.replace(/\?/g,'&').replace('&','?'); });
  txt += '"></video>';
  if(fn('#flowplayer')) txt += '<div id="flowplayer"></div>';
  else if(fn('#player')) txt += '<div id="player"></div>';
  if(insertionPoint);//TODO
  else doc.body.innerHTML = txt;
  console.log('yahvt: starting ' + domainName() + (nvp ? (' video part '+nvp.now) : ' video'));
  var v = fn('VIDEO'), p = v.parentNode;
  v.onloadedmetadata = function(event) {
    if(!isFF && !isTop) {
      window.addEventListener('message', function(event) {
        console.log('event.data = ', event.data);
        if(event.data == 'canhandlezoom')
          document.defaultView.name = 'yahvtframe';
      }, false);
    }
    //console.log('yahvt: now playing: '+v.currentSrc);
    StopInfo();
    var format = [v.videoWidth, v.videoHeight].join('x'), info2 = nn('DIV.info2', {TEXT: format}, v.parentNode);
    window.setTimeout(function() {
      rn(info2);
      if(doc.defaultView.name == 'yahvtframe' && v.clientWidth == v.videoWidth) {
        info2 = nn('DIV.info2', { TEXT: 'press "Z" to zoom to window size', style: 'color: mediumseagreen;' }, v.parentNode);
        window.setTimeout(function() { rn(info2); }, 3000);
      }
    }, 5000);
    if(!isTop)
      window.top.postMessage('videoformat'+ format, '*');
    if(remembered('fullscreen', true)=='yes')
      SetFullScreenMode(v.parentNode);
    SetFocus(v);
  };
  p.onmousemove = function(event) {
    if(hTimer2) clearTimeout(hTimer2);
    else p.style.cursor = '';
    if(autoHide) {
      hTimer2 = setTimeout(function() {
        hTimer2 = 0;
        p.style.cursor = 'none';
      }, 3456);
    } else hTimer2 = 0;
    delay = 1;
  };
  v.onplaying = function(event) {
    autoHide = 1;
    StopInfo();
    hTimer2 = setTimeout(function() {
      hTimer2 = 0;
      p.style.cursor = 'none';
    }, delay * 3456);
  };
  v.onpause = function(event) {
    if(hTimer2) clearTimeout(hTimer2);
    else p.style.cursor = '';
    autoHide = 0;
    hTimer2 = 0;
    delay = 0;
  };
  v.onkeypress = function(event) {
    if(event.altKey || event.metaKey || event.ctrlKey) return;
    var info2;
    switch(event.key.toUpperCase()) {
    case ' ':
      if(isFF) return;
    case 'P':
      StartStop();
      break;
    case 'A':// toggle stretch mode
      if(v.style.objectFit) {
        v.style.objectFit = '';
        p.style.height = '';
        v.style.objectPosition = v.style.objectPosition ? '' : 'center top';
      } else {
        v.style.objectFit = 'fill';
        p.style.height = '100%';
      }
      break;
    case 'F':// toggle full screen
      if(!EndFullScreenMode())
        SetFullScreenMode(v.parentNode);
      break;
    case 'H':// toggle LMB behavior
      ((altClick = !altClick) ? v.addEventListener : v.removeEventListener).call(v, 'click', StartStop, false);
      break;
    case 'I':// show some info
      if(!rn(fn('?div.info', p)))
        ShowSomeInfo(true);
      break;
    case 'Q':// quick view
      if(!smw) {
        info2 = nn('DIV.info2', { TEXT: 'press "Q" to end quick view mode' }, v.parentNode);
        smw = window.setTimeout(function() { rn(info2); }, 3000);
      }
      v.playbackRate = v.playbackRate != 1 ? 1 : 2;
      break;
    case 'S':// slow motion
      if(!smw) {
        info2 = nn('DIV.info2', { TEXT: 'press "S" to end slow motion mode' }, v.parentNode);
        smw = window.setTimeout(function() { rn(info2); }, 3000);
      }
      v.playbackRate = v.playbackRate != 1 ? 1 : .05;
      break;
    case 'Y': case 'Z':// toggle zoom mode
      if(doc.defaultView.name == 'yahvtframe') {
        window.top.postMessage('keystrokeZ', '*');
        break;
      }
      if(p.style.width) {
        p.style.width = '';
        p.style.minHeight = p.parentNode.clientHeight+'px';
        p.style.margin = '';
      } else if(v.videoWidth) {
        p.style.width = v.videoWidth+'px';
        p.style.minHeight = v.videoHeight+'px';
        p.style.margin = '0px auto';
      }
      break;
    default:
      return;
    }
    event.preventDefault();
    event.stopPropagation();
  };
  v.onkeydown = function(event) {
    if(event.altKey || event.metaKey || event.ctrlKey || event.shiftKey) return;
    switch(event.key) {
    case 'ArrowRight':
      v.currentTime += v.paused ? .5 : 5;
      break;
    case 'ArrowLeft':
      v.currentTime -= v.paused ? .5 : 5;
      break;
    case 'Escape':
      v.playbackRate = 1;
    default:
      return;
    }
    event.preventDefault();
    event.stopImmediatePropagation();
  };
  if(!isFF) {
    v.onclick = function(event) {
      if(doc.hasFocus()) StartStop();
      SetFocus(v);
      //onmousedown event.preventDefault();?
    };
  }
  v.lastChild.onerror = function(event) {
    StopInfo();
    if(!/\bnoflash\b/.test(location.search)) {
      Remember('autoplay');
      location.search = location.search ? location.search+'&noflash' : '?noflash';
      throw 'redirecting to location + noflash';
    }
    console.log('yahvt: video load error');
    if(nvp && nvp.now>1)
      if(!isTop) window.top.postMessage('videoended', '*');
      doc.body.innerHTML = '<center style="color:orange;"><br><br>No part '+nvp.now+' could be found, so this must be...<br><b style="font-size:333%;"><br>The End</b></center>';
    remembered('fullscreen', true);// discard value
  };
  v.onended = function(event) {
    var wasFullScreen = EndFullScreenMode();
    autoHide = 0;
    p.style.cursor = '';
    if(!isTop && !fn('#VideoCloseButton')) {
      if(!nvp) window.top.postMessage('videoended', '*');
      nn('BUTTON#VideoCloseButton', { type: 'button', TEXT: 'x', title: 'close' }, p).onclick = function(event){
        if(nvp) window.top.postMessage('videoended', '*');
        location.replace('about:blank');
        return false;
      };
    }
    if(nvp) {
      var btnNext = nn('BUTTON#NextPartButton', { type: 'button', TEXT: nvp.next, title: 'on to part '+nvp.next }, p),  req = new XMLHttpRequest();
      btnNext.onclick = function(event) {
        console.log('yahvt: redirecting to part '+nvp.next);
        Remember('autoplay');
        Remember('fullscreen', (wasFullScreen ? 'yes' : ''));
        location.replace(nvp.URL);
        return false;
      };
      btnNext.focus();
      if(req) {
        req.open('HEAD', nvp.URL, true);
        req.onloadend = function() {
          switch(req.status) {
          case 200:
            if(req.statusText != 'Not Found')
              btnNext.click();
          case 404:
            rn(btnNext);
          }
        };
        req.send();
      }
    }//nfv
  };//v.onended
  ShowSomeInfo(false);
  OnFullScreenChange(function(event) { fn('VIDEO').focus(); });
}
function Block(event) {
  event.preventDefault();
  if(maxmsg>=0) {
    console.warn("yahvt: blocking script element:", event.target.src, event.defaultPrevented);
    if(!(--maxmsg)) {
      //console.log('yahvt:', event);
      throw('to many alien script requests.');
    } //trollvid tries again and again, causing heavy CPU load, so we give up
  }else doc.defaultView.removeEventListener('beforescriptexecute', Block);
}
//yahvt() {
  try {
    if(!isTop && !doc.styleSheets.length && !doc.body.childElementCount)
      SetStyle('ID=yahvt_contrast', 'body{background-color: black; color: white;}');
    if(sites()) {
      var av = findVideoFiles();
      if(av && av.length) {
        // we block things only after we are sure they aren't needed
        if(!insertionPoint) {
          doc.defaultView.addEventListener('beforescriptexecute', Block);
          var n = setTimeout(function(){},0); while(--n){clearTimeout(n);};
          n = setInterval(function(){},999); while(n){clearInterval(n--);};
        }
        console.log('yahvt: Found '+av.length+' video source'+(av.length==1 ? '' : 's')+' at '+domainName()+'.');
        console.log('yahvt:', av);
        if(/\/blank.mp4$/.test(av[0])) av.push(av.shift());
        var v = fn('VIDEO');
        if(v) { v.pause(); v.removeAttribute('src'); }
        SetStyle(
          'body,html', {padding:0, margin:0, height:'100%', overflow:'hidden', background:'#000', color:'#fff', fontSize:14}, 
          'video', {outline:0},
          '#player,#flowplayer', {display:'none'},
          'button#VideoCloseButton', {position: 'absolute', top:0, right:0, height:25, minWidth:25},
          'button#NextPartButton', {position: 'absolute', top:0, right:30, height:25, minWidth:25},
          '.info a', {color:'unset'},
          '.info', {position: 'absolute', top:50, left:50, textShadow:'1px 1px black'},
          '.info2', {position: 'absolute', top:1, left:2, textShadow:'1px 1px black', fontSize:'large'}
        );
        var autoplay = remembered('autoplay', true) == 'yes';
        if(!isTop && !autoplay) {
          doc.body.innerHTML = '<center><p>Video '+((/(part|clip|chunk)_?\d/.test(av[0]+doc.URL)) ? 'part ' : '')+'found at ' + domainName(doc.URL) + '.</p><button type="button" style="padding:10px;width:98%">play</button></center><div id="flowplayer" style="display:none"></div>';
          fn('BUTTON').onclick = function() { autoplay = true; insertVideo(); };
          fn('BUTTON').focus();
        } else {
          insertVideo();
        }
      } else {
        if(/^video(wing|zoo)$/.test(domain[1]) && !/\bnoflash\b/i.test(location.search)) {
          console.log('yahvt: redirecting to location + noflash');
          location.search = location.search ? location.search+'&noflash' : '?noflash';
        }
        var as = na('SCRIPT'), i;
        for(i of as) {
          if(/_url\s*=\s*\"video not found\"/i.test(i.innerHTML)) { doc.body.innerHTML = '<p>Video not found.</p>'; break; }
        }
      }
    }
  } catch(e) { console.log('yahvt:', e); }
}

function receiveMessage(event) {
  function RestoreFormat() {
    var view = fn('#yahvt_currentview');
    if(view) view.removeAttribute('id');
    rn('#yahvt_fmtbtn');
    rn('#yahvt_dimmer');
  }
  function InsertButton() {
    rn('#yahvt_fmtbtn');
    var spn, btn;
    try {
      spn = fn('?#player_tabs>li[title="about videotabs"]~li:last-child');
      if(spn)
        return nn('LI#yahvt_fmtbtn', {title: 'video width', style: 'float:right;padding:5px;', TEXT: x},{before: spn});
      switch(domain[1]) {
      case 'animecenter':
      case 'freeanime':
        return nn('BUTTON#yahvt_fmtbtn', {title: 'video width', type: 'button', style: 'float:left;', TEXT: x } , fn('.rating_div'));
      case 'anilinkz':
        return nn('BUTTON#yahvt_fmtbtn', {title: 'video width', type: 'button', style: 'float:right;margin:12px 12px 0px 0px;', TEXT: x}, {before: fn('#watchmode').parentNode});
      case 'animeseason':
        return nn('DIV#yahvt_fmtbtn', { title: 'video width', style: 'background:url(/images/video_icons.png) -171px 0 no-repeat;width:57px;height:55px;margin-right:55px;line-height:55px;cursor:pointer;', HTML: '<style>#yahvt_fmtbtn + div{display:none;}</style>'+x}, { before: fn('#video_views')});
      case 'drama':
        return nn('DIV#yahvt_fmtbtn', { title: 'video width', style: {textAlign: 'center'}, TEXT: x}, { insert: fn('.p-right-buttons')});
      }
    } catch(e) {
      console.log(e);
    }
    return nn('BUTTON#yahvt_fmtbtn', {title: 'video width', type: 'button', style: 'position:absolute;top:-21px;left:1px;', TEXT: x}, nn('SPAN',{style:'position:relative;'},{after: frame}));
  }
  function FindFrame(event) {
    var frames = na('IFRAME'), i;
    for(i of frames) {
      if(i.contentWindow === event.source) return i;
    }
  }
  //receiveMessage
 try {
  //console.log('yahvt: received message', event);
  if(typeof event.data != 'string') return;
  var frame = FindFrame(event), style, fullwinstyle, dim;
  if(!frame) return;
  switch(event.data.slice(0,11)) {
  case 'videoformat':
    frame.name = 'yahvtframe';
    if(!isFF) frame.contentWindow.postMessage('canhandlezoom', '*');
    var m = event.data.match(/(\d+)x(\d+)$/), x = parseInt(m[1]), y = parseInt(m[2])+(isFF ? 56 : 64), id, zi=100000, disable = false;
    //RestoreFormat();
    m = frame.parentNode;
    if(!m.id) m.id = 'yahvt_currentview';
    id = '#' + m.id;
    style = fn('#yahvt_top_style');
    if(style) {
      disable = style.disabled;
      rn(style);
    }
    style = SetStyle('ID=yahvt_top_style',
      'html,body', { width: '100%', height: '100%', overflow: 'hidden'},
      id, { width: frame.clientWidth, height: frame.clientHeight, minHeight: frame.clientHeight},
      id+(isFF ? '>iframe' : '>iframe:not(:-webkit-full-screen)'), { border: '0px !important', position: 'fixed', width: x+'px!important', height: y+'px!important', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', margin: '0 auto', maxWidth: '100%', maxHeight: '100%', zIndex: zi},
      '#yahvt_fmtbtn', {display: 'none' },
      'div#parent-container', {opacity: 1}, // animeultima
      '#yahvt_dimmer>div', { backgroundColor: 'black', opacity: '.85'},
      '#yahvt_dimmer>.topshade', { position: 'fixed', width: '100%', height: 'calc(50% - '+y/2+'px)', top: 0, left: 0, zIndex: zi},
      '#yahvt_dimmer>.bottomshade', { position: 'fixed', width: '100%', height: 'calc(50% - '+y/2+'px)', bottom: 0, left: 0, zIndex: zi},
      '#yahvt_dimmer>.leftshade', { position: 'fixed', width: 'calc(50% - '+x/2+'px)', height: y, top: 'calc(50% - '+y/2+'px)', left: 0, zIndex: zi},
      '#yahvt_dimmer>.rightshade', { position: 'fixed', width: 'calc(50% - '+x/2+'px)', height: y, top: 'calc(50% - '+y/2+'px)', right: 0, zIndex: zi}
    );
    style.disabled = disable;
    InsertButton().onclick = function() { style.disabled = false; };

    if(!fn('#yahvt_fullWin_style')) SetStyle('ID=yahvt_fullWin_style',
      'body '+id+'>iframe', { position: 'fixed!important', width:'100%!important', height: '100%!important', top: 0, left: 0, transform: 'unset!important', zIndex: zi},
      '#yahvt_dimmer', { display: 'none'}
    ).disabled = true;

    rn('#yahvt_dimmer');
    dim = nn('DIV#yahvt_dimmer', 0, m);
    nn('div.topshade', 0, dim);
    nn('div.bottomshade', 0, dim);
    nn('div.leftshade', 0, dim);
    nn('div.rightshade', 0, dim);
    dim.onclick = function() { style.disabled = true; };
    break;
  case 'videoended':
    //var view = fn('#yahvt_currentview'); if(view) view.removeAttribute('id');
    rn('#yahvt_fmtbtn');
    rn('#yahvt_dimmer');
    rn('#yahvt_top_style');
    rn('#yahvt_fullWin_style');
    break;
  case 'keystrokeZ':
    fullwinstyle = fn('#yahvt_fullWin_style');
    fullwinstyle.disabled = !fullwinstyle.disabled;
    if(!isFF && !fullwinstyle.disabled) fn('#yahvt_top_style').disabled = true;//chrome fix
    break;
  }
 } catch(e){ console.log(e); }
}
if(isTop && !/^(anime-exceed|animefreak|anime-sub|bestanimes|clipfish)$/.test(domain[1]))
  window.addEventListener('message', receiveMessage, false);

// public domain by gnblizz
// contact me with my username + '@web.de'
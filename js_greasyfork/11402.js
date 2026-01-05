// ==UserScript==
// @name        mini clock
// @namespace   gnblizz
// @description simple clock for full screen mode
// @version     2.02
// @compatible  firefox,Greasemonkey
// @compatible  chromium,Tampermonkey
// @include     *
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @icon        data:image/gif;base64,R0lGODlhEAAQAKECABEREe7u7v///////yH5BAEKAAIALAAAAAAQABAAAAIplI+py30Bo5wB2IvzrXDvaoFcCIBeeXaeSY4tibqxSWt2RuWRw/e+UQAAOw==
// @downloadURL https://update.greasyfork.org/scripts/11402/mini%20clock.user.js
// @updateURL https://update.greasyfork.org/scripts/11402/mini%20clock.meta.js
// ==/UserScript==
"use strict";

/* This user script inserts the system time in the upper right corner of the browser window. This is especially useful
 * in full screen mode, when the task bar clock is hidden.
 * To change the position, select "clock at bottom" from the context menu of the time display.
 * To set the minimum width for the clock to appear, resize the browser window to that width and select "mini clock set min width" from the "user script commands" sub menu of the greasemonkey menu.
 * In chromium all menu items are in the Tampermonkey menu.
 */

//while true; do date +%R | osd_cat --pos=top --offset=40 --align=right --colour=green --outline=1 --font=-etl-fixed-medium-r-normal-*-40-*-*-*-*-*-*-* ; done

var doc = document, isTop = window.self==window.top, isFF = /Firefox/i.test(navigator.userAgent),
  div, spn, wrapper,
  ref = 0, fontSize,
  hTimer = 0, hTimer2 = 0, hTimer3 = 0,
  datePattern = (function(){
    switch(navigator.language.slice(0,2)){
    case 'de': return '%A, %e. %B %Y'; // e.g: 'Donnerstag, 16. Juli 2015'
    case 'en': return /-US/i.test(navigator.language) ? '%A%n%B %e, %Y' : '%A%n%e %B %Y';
    }
    return '%A, %x';
  }());

function getValue(name, dflt) { return (typeof(GM_getValue)=='function') ? GM_getValue(name, dflt) : dflt; }
//function getValue(name, dflt) { var res = _getValue(name, dflt); console.log('getValue('+name+', '+dflt+') ==>', res); return res; }
function setValue(name, value) { if(typeof(GM_setValue)=='function') GM_setValue(name, value); }
function addStyle(style) { var o = obj('+STYLE', doc.getElementsByTagName('HEAD')[0]); o.innerHTML = style; return o; }

function obj(name, parent) {
  if(!parent) parent = doc;
  switch (name.charAt(0)) {
  case '#':
    return parent.getElementById(name.slice(1));
  case '.':
    return parent.getElementsByClassName(name.slice(1))[0];
  case '+':
    var a = name.split(','); name = a.shift();
    var m = name.match(/^\+([A-Za-z]+)\b/), node = doc.createElement(m[1]);
    m = name.match(/\.\w+/); if(m) node.className = m[0].slice(1);
    m = name.match(/#\w+/); if(m) node.id = m[0].slice(1);
    while(a.length) {
      var l = a.shift().split('=');
      if(!l[1]) l.push(l[0]);
      else if(/^".*"$/.test(l[1])) l[1] = l[1].slice(1,-1);
      switch(l[0]){
      case '': node.textContent = l[1]; break;
      case 'HTML': node.innerHTML = l[1]; break;
      default: node.setAttribute(l[0], l[1]);
      }
    };
    if(parent != doc) parent.appendChild(node);
    return node;
  }
  return parent.getElementsByTagName(name)[0];
}

function miniClockSetWidth() {
  GM_setValue('miniClockMinWidth', window.outerWidth);
  alert('New treshold width is '+window.outerWidth+' pixel.');
}

//function niceTime(d) { return d.toLocaleFormat('%R'); }
function niceTime(d) { return d.toTimeString().slice(0,5); }
function niceDate(d) { return d.toLocaleFormat ? d.toLocaleFormat(datePattern) : d.toDateString(); }

if(isTop) {
  if(typeof(GM_registerMenuCommand)=='function') {
    GM_registerMenuCommand('mini clock set min width', miniClockSetWidth, 'w');
    if(!isFF) {
      GM_registerMenuCommand('hide mini clock', function(event) { div.style.opacity='0'; }, 'h');
      GM_registerMenuCommand('adjust clock size', FontChange, 's');
      GM_registerMenuCommand('toggle clock at bottom', AtBottomClicked, 'b');
      //GM_registerMenuCommand('toggle allow clock in video tag', function() { setValue('allowAtVideo', !getValue('allowAtVideo')); }, 'v');
    }
  }
  init();
}

// FULL SCREEN API

//requires about:config full-screen-api.allow-trusted-requests-only=false
function SetFullScreenMode(v) {
  (v.requestFullscreen||v.mozRequestFullScreen||v.webkitRequestFullscreen||v.webkitEnterFullscreen).call(v);
  //console.info('To allow full screen mode, you may want to set full-screen-api.allow-trusted-requests-only to false in about:config.');
}

function EndFullScreenMode() {
  if(!isFullScreen())
    return false;
  (doc.exitFullscreen||doc.mozCancelFullScreen||doc.webkitExitFullscreen).call(doc);
  return true;
}

function FullScreenElement() {
  if(doc.exitFullscreen) return doc.fullscreenElement;
  if(doc.mozCancelFullScreen) return doc.mozFullScreenElement;
  if(doc.webkitExitFullscreen) return doc.webkitFullscreenElement;
}

function isFullScreen() {
  return !!FullScreenElement();
}

function OnFullScreenChange(fn) {
  if(doc.exitFullscreen) doc.addEventListener("fullscreenchange", fn);
  if(doc.mozCancelFullScreen) doc.addEventListener("mozfullscreenchange", fn);
  if(doc.webkitExitFullscreen) doc.addEventListener("webkitfullscreenchange", fn);
}

// bad hack
function ForceEndFullscreen() {
  var fse = FullScreenElement();
  if(fse) {
    console.log('forced end fullscreen');
    var ns = fse.nextSibling, pn = fse.parentNode;
    pn.removeChild(fse);
    pn.insertBefore(fse, ns);
  }
}

if(isFF) OnFullScreenChange(function(event) {
 try {
  if(!ref++)
    init();
  ref--;
 } catch(e) { console.log(e); }
});

function OnTimer() {
  var dt = new Date(), t = niceTime(dt);
  if(spn.textContent != t) {
    spn.textContent = t;
    if(!div.title || t.slice(-1)=='0')
      div.title = niceDate(dt);
  }
}

function OnMouseMove() {
  clearTimeout(hTimer2);
  hTimer2 = setTimeout(OnTimer2, 3333);
  if(wrapper.style.cursor) {
    wrapper.style.cursor = '';
    doc.getElementById('mcwrfsb').style.visibility='';
  }
}

function OnTimer2() {
  hTimer2 = 0;
  wrapper.style.cursor = 'none';
  doc.getElementById('mcwrfsb').style.visibility = 'hidden';
}

function OnMouseEnter() {
  if(hTimer3)
    clearTimeout(hTimer3);
  hTimer3 = setTimeout(function() {
    hTimer3 = 0;
    div.style.visibility = 'hidden';
  }, 2222);
  doc.addEventListener("mousemove", OnMouseMove2);
}

function OnMouseMove2(event) {
 try {
  if(event.clientX+20 < div.offsetLeft || (event.clientY > 80 && event.clientY+80 < window.innerHeight))
    CancelAutoHide(event);
 }catch(e){ console.log(e); }
}

function CancelAutoHide(event){
  if(hTimer3) {
    clearTimeout(hTimer3);
    hTimer3 = 0;
  } else div.style.visibility = '';
  doc.removeEventListener("mousemove", OnMouseMove2);
}


function shouldShow() {
  if(isTop) {
    var minWidth = getValue('miniClockMinWidth', 0);
    if(!minWidth || minWidth >= window.screen.availWidth || window.outerWidth >= minWidth)
      return true;
  } else
    return isFullScreen();
  return false;
}

function OnReSize() {
  try {
    clearInterval(hTimer);
    if(shouldShow()) {
      OnTimer();
      div.style.display = 'block';
      hTimer = setInterval(OnTimer, 1900);
    } else {
      div.style.display = 'none';
      hTimer = 0;
    }
    if(wrapper)
      OnMouseMove();
  } catch(e) { console.log(e); }
}

function InsertClock(here) {
  if(div) {
    div.parentNode.removeChild(div);
    here.appendChild(div);
  }
}

function AtBottomClicked() {
  if(div.style.top == 'unset') {
    div.style.top = '';
    div.style.bottom = '';
    setValue('atbottom', false);
  } else {
    div.style.top = 'unset';
    div.style.bottom = '0px';
    setValue('atbottom', true);
  }
  div.blur();
}

function FontChange(event) {
  var frm = obj('+FORM,style=position:fixed!important;top:55px;right:10px;color:#222;background-color:#181818;border:1px solid gray;padding:10px 17px;font:18pt normal sans-serif;z-index:2147483647;'),
    inp = obj('+INPUT#us_MiniClockFontSel,type=number,min=3,max=200,maxlength=3,size=3,style=text-align:right;width:84px;,value='+fontSize, frm),
    btn = obj('+BUTTON,type=submit,= OK ', frm),
    fse = FullScreenElement() || doc.body;
  inp.onchange = function(event) {
    div.style.fontSize = inp.value + 'pt';
    div.style.visibility = '';
  };
  btn.onclick = function(event) {
    setValue('fontsize', fontSize = inp.value);
    frm.parentNode.removeChild(frm);
    return false;
  };
  fse.appendChild(frm);
  inp.focus();
}

function MenuCreate(menu) {
  obj('+MENUITEM,label=hide mini clock', menu).onclick = function(event) { div.style.opacity='0'; };
  obj('+MENUITEM,label=adjust clock size', menu).onclick = FontChange;
  var item = obj('+MENUITEM,label=clock at bottom,type=checkbox', menu);
  item.onclick = AtBottomClicked;
  if(getValue('atbottom'))
    item.checked = true;
  //if(isFF) {
  item = obj('+MENUITEM,label=allow clock in video tag,type=checkbox', menu);
  item.onclick = function() { setValue('allowAtVideo', !getValue('allowAtVideo')); };
  if(getValue('allowAtVideo'))
    item.checked = true;
  //}
  div.appendChild(menu);
  div.setAttribute('contextmenu','us_MiniClockMenu');
  div.oncontextmenu = function(event) {
    menu.lastChild.checked = getValue('allowAtVideo')==true;
    CancelAutoHide(event);
  };
}

function create() {
  div = obj('+DIV#us_MiniClock');
  spn = obj('+SPAN', div);
  if(getValue('atbottom')) {
    div.style.top = 'unset';
    div.style.bottom = '0px';
  }
  doc.body.appendChild(div);
  OnReSize();
  if(!doc.getElementById('us_MiniClockStyle')) {
    fontSize = getValue('fontsize', 18);
    addStyle('#us_MiniClock{position:fixed!important;top:0px;right:0px;width:auto;color:#E8E8E8;background-color:#181818;border:1px solid gray;padding:1px 7px;font:' +
      fontSize+'pt normal sans-serif;z-index:2147483647;}@media print{#us_MiniClock{display:none!important;}} \
    #mcwrfsb{position:fixed;right:0px;bottom:0px;cursor:pointer;border:1px solid;height:25px;width:25px;}').id = 'us_MiniClockStyle';
    if(div.offsetLeft) {
      window.onresize = OnReSize;
      div.addEventListener("mouseenter", OnMouseEnter, false);
      if(isFF)
        MenuCreate(obj('+MENU#us_MiniClockMenu,type=context'));
    } else {
      clearInterval(hTimer);
      div.parentNode.removeChild(div);
      spn = div = null;
    }
  }
}

function init() {
  try {
    if(!div) {
      create();
      if(!div)
        return;
    }
    var fse = FullScreenElement() || doc.body, wrp, st;
    if(fse.contains(div))
      return;
    switch(fse.tagName) {
      case 'VIDEO':
        if(getValue('allowAtVideo')) {
          st = !fse.paused;
          EndFullScreenMode();
          wrp = fse.parentNode;
          if(wrp.id != 'miniClockWrapper') {
            wrapper = wrp = obj('+DIV#miniClockWrapper');
            obj('+DIV#mcwrfsb,=&nbsp;', wrp);
            wrp.firstChild.onclick = function(e) { if(!EndFullScreenMode()) SetFullScreenMode(wrapper); };
            wrp.appendChild(fse.parentNode.replaceChild(wrp, fse));
            wrp.addEventListener("mousemove", OnMouseMove);
          }
          if(isFullScreen())// why must it be asynchroniously?
            ForceEndFullscreen();
          SetFullScreenMode(wrp);
          InsertClock(wrp);
          if(st && fse.paused) {
            //console.log('video stopped while processed');
            fse.play();
          }
          window.setTimeout( function() {
            if(!isFullScreen())
              console.log('Clock could not reactivate full screen mode. Make sure, full-screen-api.allow-trusted-requests-only is false in about:config');
          }, 500);
        } else console.log('Clock not allowed in video tags. See https://greasyfork.org/de/scripts/11402-mini-clock for details.');
      case 'IFRAME':
        break;
      default:
        InsertClock(fse);
    }
  } catch(e){ console.log(e); }
}

//public domain by gnblizz
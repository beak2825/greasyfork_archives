// ==UserScript==
// @name        cats webcomic tool
// @description initial scrolling and a hotkey
// @namespace   gnblizz
// @include     http://*
// @noframes
// @version     2.01
// @icon        data:image/gif;base64,R0lGODdhIAAgAMIGAAAAACsrK1VVVYCAgKqqqtTU1P///////ywAAAAAIAAgAAAD/mi63P4wyhmFGKPQrcIwxSAQ3HRpioiWzrkUBMkWrjHEL5Hlq0PrFkzoRbMEAJ7dQ1BownQEprN4ITSZD0wjCoVdR87op/UI3VLmy4gQ8IAWOEbzNjTEMgOP+a0UbDEyfiBaP1EXGFh1KTorYzYfMCNrMVhxjzYwRwAoFyA6Qk1RaCmQH3cWTQEkZqqhI6N1SqGrACSGTJSOY6+YDDhsp09iDKa8ip4GFjoAN0AyCx8BdZaDyZIWQT2kJGM0KyFFA0htWA5RGjuRL4htAWDn5oJDzUFq7QJ6kRhKogrD0IgAAMB2CEMrBoL8JbRhaKAaGPu02YnwxJ20KKpYeLKCMEeNghA1KJxj88EPMDkcvBVw18SfRT0lpLj5KG6ShZQ3YC5A9dHbBkNnBvFc96xBAgA7
// @grant       GM_registerMenuCommand
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/12945/cats%20webcomic%20tool.user.js
// @updateURL https://update.greasyfork.org/scripts/12945/cats%20webcomic%20tool.meta.js
// ==/UserScript==
"use strict";
var HotKey = 'ArrowRight'; // You can customize the hotkey here.

try { GM_registerMenuCommand('configure Cats Webcomic Tool', CatsConfig, 'w'); } catch(e){
  console.log('couldn\'t add menu.');
}
try { if(document.domain=='www.egscomics.com') { if(document.getElementById('newsarea').textContent.match(/^No DVD movie style commentary/))
  document.getElementById('news').textContent = 'No comments'; 
  document.getElementById('leftarea').removeChild(document.getElementById('boxad'));
  document.getElementById('leftarea').removeChild(document.getElementById('ibar'));
}} catch(e){}
(function Cats2(d) {
  if(d) { 
    d = d.split('|');
    Set(parseInt(d[0]), parseInt(d[1]), decodeURIComponent(d[2]));
  }
}(GetCookie('CatsWebcomicTool')));

/* Set function:
 * x	  int, optional		amount of pixels to scroll right
 * y	  int			amount of pixels to scroll down
 * name   string		identifier of the next button (see FindLink function)
 * style  string, optional	css style string to apply
 * return boolean		success */
function Set(x, y, name, style) {
  if(!FindLink(name)) {
    console.log('CatsWebcomicTool: "'+name+'" not found at '+document.domain);
    return false;
  }
  document.body.style.minHeight = (y + window.outerHeight) + 'px';
  if(window.scrollY < y)
    window.scroll(x, y);
  if(obj('#us_MiniClock')) obj('#us_MiniClock').style.opacity='.2';//test
  if(name != '/') document.body.onkeypress=function(event) {
    if(event.key == HotKey) {
      var l = FindLink(name);
      if(l) {
	if(l.nodeName == 'LINK')
	  window.location.assign(l.getAttribute('href'));
	else
	  l.click();
	event.preventDefault();
      }
    }
  };
  return true;
}

/* GetLinkAdr function:
 * node   object		the next button
 * return text  		URL next page */
function GetLinkAdr(o) {
  if(!o) return;
  var x = o.getAttribute('href');
  if(x) return x;
  x = o.querySelector('*[href]');
  if(x) return x.getAttribute('href');
  do {
    o = o.parentNode;
    switch(o.nodeName) { case 'BODY': case 'HTML': return; }
    x = o.getAttribute('href');
  } while(!x);
  return x;
}

/* FindLink function:
 * name   string		identifier of the next button
 * return object		next button
identifier format:
!	the head contains a link with rel="next" attribute
*	the link has a rel="next" attribute
#name	name is an id tag
.name	name is a class id
/name	name is part of a path to an image
$name	name is the textContent of a link */
function FindLink(name) {
  var i, o, l;
  switch(name.charAt(0)) {
  case '#':
  case '.':
    return obj(name);
  case '!':
    return document.head.querySelector('link[rel="next"][href]');
  case '$':
    name = decodeURIComponent(name.slice(1));
    o = document.links;
    i = o.length;
    if(i) do {
      l = o[--i];
      if(l.textContent == name) {
	return l;
      }
    } while(i);
    return null;
  case '*':
    return document.body.querySelector('a[rel="next"]');
  case '/':
    o = document.images;
    i = o.length;
    if(i) do {
      l = o[--i];
      if(('/'+l.getAttribute('src')).search(name) >= 0)
	return l;
    } while(i);
    return null;
  case '?': // new, undok
    return document.body.querySelector('a[title="'+name.slice(1)+'"]');
  default:
    throw('Undefined string type in FindLink('+name+')');
  }
  return null;
}

function obj(str){var node = null;switch (str.charAt(0)){case '#':node=document.getElementById(str.slice(1));break;case '.':node=document.getElementsByClassName(str.slice(1))[0];break;case '+':node=document.createElement(str.slice(1).toUpperCase());break;default:node=document.getElementsByTagName(str)[0];break;}return node;}
function parent(path) { path = path.match(/^(.*)\/[^/]+\/?$/); return (path && path[1]) ? path[1] : '/'; }

function SetCookie(name, value, days, path) {
  if(!path) path='/';
  var d = new Date();
  d.setTime(days*86400000+d.getTime());
  document.cookie=name+'='+value+';expires='+ d.toUTCString()+';'+'path='+path;
}

function GetCookie(name) {
  var r = new RegExp(name+'=([^;]+)', '')
  var m = document.cookie.match(r);
  return(m ? m[1] : '');
}

function BiggestImage() {
  var a=document.images, i, img, biggestSize=0;
  if(!a || !(i=a.length)) { alert('No image found.'); return null; }
  do {
    var o = a[--i], size=o.offsetWidth*o.offsetHeight;
    if(size>biggestSize) { biggestSize=size; img=o; }
  } while(i);
  return img;
}

function CatsConfig() {
  try {
    var ctrl = obj('#CatsWebcomicTool'); if(ctrl) ctrl.parentNode.removeChild(ctrl);
    var img=BiggestImage(),rect=img.getBoundingClientRect(),cwctX=parseInt(rect.left+window.scrollX),cwctY=parseInt(rect.top+window.scrollY),cwctKey,key2,path,
    akey='!|*|.comic-nav-next|.next|.navi-next|.arrow_next|.comic-nav-next|/next|/arrow_next|/next_day|/next button|/nnxt|/foward|/Nav_ForwardOne|/NavigationNext|/arrow_nexttop|#next|#cndnextt|$next|$Next|$Next >|$Next Page|?next|?Next|$%20%C2%A0next%C2%A0%3E%C2%A0%20|/'.split('|');
    while(cwctKey=key2=akey.shift()) {
      if(cwctKey.charAt(0) == '/') { if(FindLink(cwctKey+='.gif')) break; if(FindLink(cwctKey=key2+'.png')) break; cwctKey=key2+'.jpg'; }
      if(FindLink(cwctKey)) break;
    }
    window.scroll(cwctX, cwctY);
    confirm();
  } catch(e) {
    console.log(e);
  }
function confirm() {
  var frm = obj('+FORM'), style = obj('+STYLE'), opt, sel = 0;
  frm.id = 'CatsWebcomicTool';
  addCtrl('x', cwctX, 'set this to "0", if page centers horizontally');
  ctrl.onchange = function() { window.scroll(cwctX = parseInt(this.value), cwctY); }
  addCtrl('y', cwctY, 'vertical offset');
  ctrl.onchange = function() { window.scroll(cwctX, cwctY = parseInt(this.value)); }
  addCtrl('next', cwctKey, 'identifier for the next button\n\n!\tthe page head contains a link with rel="next" attribute\n*\tthe link has a rel="next" attribute\n#name\tname is an id tag\n.name\tname is a class id\n/name\tname is part of a path to an image\n$name\tname is the textContent of a link\n\nif unsure type in "/", which disables the hotkey.');
  ctrl.onchange = function() { ctrl.title = (/^([!*/]|[#./$].+)$/.test(cwctKey = this.value) && FindLink(cwctKey)) ? 'store settings and close this bar' : 'discard settings and close this bar'; }
  if(!(path = location.pathname)) path = '/';
  if(path != '/') {
    addCtrl('path', [], 'select the part of the URL, which is common to all pages\nif unsure, select "/"');
    if(path.slice(-1) == '/') {
      sel++;
      ctrl.add(opt = obj('+OPTION'));
      opt.innerHTML = path = path.slice(0,-1);
    } else if(/\d[^/]*$/.test(parent(path))) sel++;
    do {
      ctrl.add(opt = obj('+OPTION'));
      opt.text = path = parent(path);
    } while(path.length > 1);
    ctrl.selectedIndex = sel;
    path = ctrl.value;
    ctrl.onchange = function() { if(GetCookie('CatsWebcomicTool')) SetCookie('CatsWebcomicTool', '', -1, path); path = this.value; }
  }
  addCtrl(' OK ', undefined, 'store settings and close this bar');
  ctrl.onclick = function() {
    try { 
      if(cwctKey) {
	SetCookie('CatsWebcomicTool', cwctX + '|' + cwctY + '|' + encodeURIComponent(cwctKey), 182, path); // 182 = half a year
	Set(cwctX, cwctY, cwctKey);
      } else
	SetCookie('CatsWebcomicTool', '', -1, path);
    } catch(e){}
    document.body.removeChild(this.parentNode);
  };
  style.innerHTML = 'form#CatsWebcomicTool{z-index:2147483647;position:fixed;left:0px;right:0px;bottom:0px;margin:0px;padding:2px;color:white;background-color:gray;}form#CatsWebcomicTool label{display:inline}form#CatsWebcomicTool input,form#CatsWebcomicTool select{display:inline;width:unset;margin-right:7px;}form#CatsWebcomicTool input[type="number"]{width:45px;text-align:end;}';
  frm.appendChild(style);
  document.body.appendChild(frm);

function addCtrl(name, value, title) {
  var lbl;
  ctrl = obj((name!='path') ? '+INPUT' : '+SELECT');
  switch(typeof(value)) {
  case 'undefined':
    ctrl.setAttribute('type', 'button');
    ctrl.setAttribute('value', name);
    break;
  case 'number':
    ctrl.setAttribute('type', 'number');
    ctrl.setAttribute('min', '0');
  default:
    lbl = obj('+LABEL');
    lbl.setAttribute('for', name);
    lbl.innerHTML = name+':';
    frm.appendChild(lbl);
    ctrl.setAttribute('name', name);
    if(value) ctrl.setAttribute('value', value);
  }
  ctrl.id = name;
  ctrl.title = title;
  frm.appendChild(ctrl);
  return ctrl;
}}}

// public domain by gnblizz
// contact me with my username + '@web.de'

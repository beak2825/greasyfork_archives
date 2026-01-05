// ==UserScript==
// @name        video tabs
// @namespace   gnblizz
// @description tabbed video sources on certain drama and anime sites
// @version     1.08
// @include     http://www.animehere.com/*
// @include     http://www.animenova.org/*
// @include     http://www.animenova.tv/*
// @include     http://www.animeplus.tv/*
// @include     http://www.animesky.net/*
// @include     http://www.animetoon.eu/*
// @include     http://www.animetoon.org/*
// @include     http://www.animetoon.tv/*
// @include     http://animewow.eu/*
// @include     http://www.animewow.eu/*
// @include     http://www.animewow.org/*
// @include     http://dramago.com/*
// @include     http://www.dramago.com/*
// @include     http://www.dramagalaxy.com/*
// @include     http://www.dramagalaxy.eu/*
// @include     http://www.dramagalaxy.tv/*
// @include     http://www.gogoanime.com/*
// @include     http://www.gogoanime.to/*
// @include     http://www.goodanime.co/*
// @include     http://www.goodanime.eu/*
// @include     http://www.goodanime.net/*
// @include     http://www.gooddrama.net/*
// @include     http://gooddrama.to/*
// @include     http://www.gooddrama.to/*
// @noframes
// @run-at      document-start
// @grant       none
// @compatible  firefox
// @compatible  chrome
// @icon        data:image/gif;base64,R0lGODlhMAAwAKECAAAAAICAgP///////yH5BAEKAAMALAAAAAAwADAAAALQnI+py+0Po5y02ouz3rz7D4biBJTmiabqyrbuC8fyHAf2jedpzuOvAAwKh6mhUfg7Hks3gHLpehptwIBTioxig0zrdStIgrslMFA8pCKp1oAZjXW6w/Mt/Nl2t8HeFl7o5QZgBagEYyawNxhUl7h4dlelFlZG+QVY6aglmIjjuKd50xla9RKI0mSCqaPJSMM0aEK4mhfbpSnTabM4WXrShtpHI6gqKvmKnCwns0tm2lOsLP3aUy08aK0zvc3d7b09Ei4+Tl5ufo6err7O3n5QAAA7
// @downloadURL https://update.greasyfork.org/scripts/27623/video%20tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/27623/video%20tabs.meta.js
// ==/UserScript==
"use strict";
var domain = document.domain.match(/(\w+)\.\w+$/)[1], darkTheme;

function TabSites() {
  switch(domain) {
  case 'gooddrama':
    return MakeTabs('html,body,#body,#header,#top_block,.info_block,.note span,#eps_blocks,#downloads_heading,#comments_heading,.reply,.info_box{color:#888;background-color:#111;height:auto}table[width="790"],#eps_blocks,.right_col,.info_block .ad{opacity:.6;}.note>font>span{background-color:inherit!important;}');
  case 'dramago':
    return MakeTabs('#menu-bar,.bar,#content,#top_block,#search-box-banner-inner,.info_block,#eps_blocks,.s_right_col #sidebar,#footer{background-color:#111;color:#aaa;border:1px solid #777}body{background-color:#444;background-blend-mode:color-burn;}.note span{background-color:#111!important;color:#aaa!important}');
  case 'dramagalaxy':
    return MakeTabs('#content,#top_block,#search-box-banner-inner,.info_block,#eps_blocks,.s_right_col #sidebar{background-color:#121B23;color:#aaa;border:1px solid #777}img[src$="2egfcQR.png"]{display:none}');
  case 'animenova':
    return MakeTabs('html,body,#body,#header,#comments_heading,.comment,.info_box{color:#555;background-color:#111;height:auto}br:empty,.note img{display:none;}.comment{border:0px}.right_col,table,.ad,.sc_ad,#g_promo,#upper_header{opacity:.6;}');
  case 'animeplus':
  case 'animesky':
    return MakeTabs('html,body,#body,#header,.part,.note>span,.report_video,#comments_heading,.comment,.info_box{background-color:#000!important;color:#aaa!important;}a.report_video:hover{color:red!important;}.right_col,table,.ad,.sc_ad{opacity:.6;}#comments,.comment,#body,#streams{border:1px solid #555}');
  case 'animewow':
    return MakeTabs('#page,#body>.s_left_col,#body>.s_right_col,#search-box-banner-inner,#eps_blocks{color:#aaa;background-color:#111;}.vmargin,#top_block,.info_block{border:1px solid #aaa;background-color:#111;}.info_block *{color:#aaa!important}');
  case 'gogoanime':
    return MakeTabs2('.postcontent', '');
  case 'goodanime':
    return MakeTabs2('.postcontent', '.topad,#wrapper,.premiumdll,.postcontent,td[bgcolor]{background-color:#111;color:#aaa}#header,#footer,html,body{background-color:#000;color:#aaa}a h5,td[bgcolor] *{color:inherit!important;}');
  case 'animehere':
	SetStyle('#streams+div.playpage{margin-top:5px;}');
    return MakeTabs2('#playbox', '#html,body{background-color:#111;}body,.content,.cfix,.side-title{color:#ccc!important;background-color:#111!important;}.related li a{color:unset;}.tipbot,.sidebar,.banner{background-color:black;color:white;}.tipbot>*,.sidebar>*,.banner>*{opacity:.7;}.related,.like{opacity:.5;}body>footer{background:unset;}a{color: #036;}#stOverlay{display:block!important;z-index:0!important;}');
  default:
    return MakeTabs('');
  }
}

function RemoveSomeIframes() {
  var streams = obj('#streams');
  if(streams) {
    var o, name, a=objs('IFRAME'), i=a.length;
    if(i) do {
      o = a[--i];
      if(!streams.contains(o)) {
        if(o.id)
          name = '#' + o.id;
        else {
          try {
            name = o.src.match(/\/\/(?:www\.)?([^/]+)/)[1];
          } catch(e) {
            name = 'unknown';
          }
        }
        var div = obj('+DIV'), btn = obj('+BUTTON|type=button|title='+o.getAttribute('src')+'|=show '+name+' content', div);
        if(o.parentNode.nodeName == 'TD') o = o.parentNode;
        btn.setAttribute('onclick', 'this.parentNode.innerHTML=decodeURIComponent("'+encodeURIComponent(o.outerHTML)+'");');
        o.parentNode.insertBefore(div, o);
        o.parentNode.removeChild(o);
      }
    } while(i);
    return true;
  }
  return false;
}

function obj(name, parent) {
  if(!parent) parent = document;
  switch (name.charAt(0)) {
  case '#':
    return parent.getElementById(name.slice(1));
  case '.':
    return parent.getElementsByClassName(name.slice(1))[0];
  case '+':
    var a = name.split('|'); name = a.shift();
	var m = name.match(/^\+(\w+)/), node = document.createElement(m[1]);
    m = name.match(/\.\w+/); if(m) node.className = m[0].slice(1);
    m = name.match(/#\w+/); if(m) node.id = m[0].slice(1);
    while(a.length) {
	  name = a.shift(); m = name.search('=');
	  switch(m) {
	  case -1: node.setAttribute(name, name); break;
	  case 0: node.innerHTML = name.slice(1); break;
	  default: node.setAttribute(name.slice(0,m), name.slice(m+1)); break;
	  }
    };
    if(parent != document) parent.appendChild(node);
    return node;
  }
  return parent.getElementsByTagName(name)[0];
}

function objs(name, parent) {
  if(!parent) parent = document;
  if(name.charAt(0) == '.') return parent.getElementsByClassName(name.slice(1));
  return parent.getElementsByTagName(name);
}

function SetStyle(style) {
  if(style)
    return obj('+STYLE|='+style, obj('HEAD'));
}

function RemoveElement(node) {
  if(node) return node.parentNode.removeChild(node);
}

function domainName(href) {
  var m = href.match(/\:\/\/(?:www\.|embed\.)?([^\/]+)/);
  return(m ? m[1] : 'unknown');
}

function Remember(name, value) {
  if(localStorage) {
    if(value) localStorage.setItem(name, value);
    else localStorage.removeItem(name);
  }
}

function remembered(name) {
  if(localStorage)
    return localStorage.getItem(name);
}

function TabOnMouseUp(event) {
  if(!event.ctrlKey) switch(event.button) {
  case 1:
    break;
  case 0:
    TabSelect(this);
  default:
    return;
  }
  NewWindow(this);
}

function NewWindow(o) {
  var m = decodeURI(o.dataset.content).match(/src="(\S+?)"/);
  console.log(m);
  if(m)
    window.open(m[1].replace(/&amp;/g,'&'), '_newtab');
}

function TabSelect(n) {
  //console.log('TabSelect(',n,')');
  var o, a;
  switch(typeof(n)) {
  default:
    o = n || obj('#player_tab_0');
    break;
  case 'string':
    a = obj('#player_tabs').childNodes;
    for(o = 0;; o++) {
      if(o >= a.length) { n = 0; break; }
      if(a[o].innerHTML == n) { n = a[o].id.slice(-1); break; }
    }
  case 'number':
    o = obj('#player_tab_'+n) || obj('#player_tab_0');
  }
  if(o.getAttribute('class') != 'active_tab') {
    a = obj('.active_tab');
    if(a) a.removeAttribute('class');
    o.setAttribute('class', 'active_tab');
    obj('#tabplayer').innerHTML = decodeURI(o.dataset.content);
    Remember('preferedServer', o.innerHTML);
  }
}

function MakeTabs(style) {
  if(obj('#player_tabs')) return true;
  var content = obj('#streams');
  if(content) {
    var va = objs('.vmargin', content), i=va.length;
    if(i) {
      var tabs = obj('+UL#player_tabs');
      do {
        var o = va[--i];
        var ifr = obj('IFRAME', o), tab = obj('+LI#player_tab_'+i), ttl;
        if(ifr) {
          var src = ifr.getAttribute('src');
          if(src.match(/[?&]/) == '&') ifr.setAttribute('src', src.replace('&', '?')); // bugfix
          if(!ifr.getAttribute('allowfullscreen')) ifr.setAttribute('allowfullscreen', 'true'); // enable fs for html5 video
          tab.textContent = domainName(src);
          ttl = 'span.playlist';
        } else {
          tab.textContent = '?';
          ttl = '.error_box';
        }
        ttl = o.querySelector(ttl); if(ttl) tab.title = ttl.textContent;
        tab.setAttribute('data-content', encodeURI(o.innerHTML));
        RemoveElement(o);
        tab.onmouseup = TabOnMouseUp;
        tabs.insertBefore(tab, tabs.firstChild);
      } while(i);
      obj('+LI|title=about videotabs|=&#9432;|style=float:right;padding:5px;', tabs).onclick = About;
      //if(!/Chrome/.test(navigator.userAgent))
      obj('+LI|title=dim the light|=&#10038;|style=float:right;padding:5px;', tabs).onclick = Dimmer;
	  if(style) {
		obj('+LI|title=toggle dark theme|=&#9635;|style=float:right;padding:5px;', tabs).onclick = ToggleTheme;
		if(remembered('noDarkTheme')) darkTheme = style;
		else obj('+STYLE#darkTheme|='+style, obj('HEAD'));
	  }
      obj('+LI|=&nbsp', tabs);
      content.insertBefore(tabs, va[0]);
      obj('+DIV#tabplayer', content);
      SetStyle('#player_tabs li{background-color:#393939;color:white;display:block;float:left;width:auto;padding:5px 10px;cursor:pointer;}#player_tabs li:hover{color:yellow;}#player_tabs li:last-child{cursor:auto;float:unset}#player_tabs .active_tab{background-color:#505050}#player_tabs .active_tab:hover{color:gray}a.report_video:link{color:#0047AB}html{height:unset;}\n');
      TabSelect(remembered('preferedServer'));
      Disclaimer();
      return true;
    }
  }
  return false;
}

function Dimmer() {
  function DimPart(desc) {
	var style = '', names = Object.getOwnPropertyNames(desc), name, value;
	for(name of names) {
	  value = desc[name];
	  if(typeof(value) == 'number') value += 'px';
	  style += name.replace(/_/g, '-') + ':' + value + '; ';
	}
	obj('+DIV|style=position:absolute;background-color:black;opacity:.85;z-index:1001;'+style, div);
  }
  var div = obj('#dimmer', document.body);
  if(div)
    RemoveElement(div);
  else {
    div = obj('+DIV#dimmer', document.body);
    var po = document.documentElement,
        rc = document.querySelector('#tabplayer iframe').getBoundingClientRect(),
       rcp = po.getBoundingClientRect(),
     above = rc.top-rcp.top,
     below = rcp.height - above - rc.height;
    console.log('RECT(#tabplayer iframe)', rc);
    DimPart({top:0, left:0, width:'100%', height:above, min_width:rcp.width});
    DimPart({top:above, left:0, width:'calc(50% - ' + (rcp.width/2 - rc.left) + 'px)', height:rc.height});
    DimPart({top:above, left:'calc(50% + ' + (rc.width - rcp.width/2 + rc.left) + 'px)', width:'calc(50% - ' + (rc.width + rc.left - rcp.width/2) + 'px)', height:rc.height});
    DimPart({top:above+rc.height, left:0, width:'100%', height:below, min_width:rcp.width, bottom:0});
    div.onclick = function(event) { RemoveElement(div); };
    return div;
  }
}

function About() {
  var dlg = obj('+DIALOG#aboutvideotabs|open|style=position:fixed;top:20%;right:30%;z-index:2147483647;text-align:center;color:black;background-color:antiquewhite;border:7px ridge greenyellow;', Dimmer()), adr = ['mailto:gnblizz'];
  adr.push('@web.de?subject=videotabs%20at%20',document.domain);
  obj('+H1|=about videotabs', dlg);
  obj('+P|=<small>videotabs is public domain by <a href="'+adr.join('')+'" title="email the author directly">gnblizz</a>.</small>', dlg);
  obj('+BUTTON|type=button|=videotabs web page|title=info, code, feedback and stats of videotabs', obj('+A|href=https://greasyfork.org/en/scripts/11480-video-tabs|target=_newtab', dlg));
}

function ToggleTheme() {
  if(darkTheme) {
	obj('+STYLE#darkTheme|='+darkTheme, obj('HEAD'));
	Remember('noDarkTheme', darkTheme = '');
  } else {
	var style = obj('#darkTheme');
	darkTheme = style.innerHTML;
	document.head.removeChild(style);
	Remember('noDarkTheme', 'noDarkTheme');
  }
}

//gogoanime.com, goodanime.eu | .postcontent
//animehere.com               | #playbox
function MakeTabs2(select, style) {
  var streams = obj(select), o;
  if(streams && obj('IFRAME', streams)) {
    streams.id = 'streams';
    for(o of streams.children) {
      if(o.nodeType == 1 && obj('IFRAME', o))
        o.className = 'vmargin';
    }
    return MakeTabs(style);
  }
  return false;
}

function Disclaimer() {
  var o = obj('#footer');
  if(o && o.textContent.match(/(Copyright|©)/i))
    obj('+P|=<br>Disclaimer: Video materials used here are the property of their respective and rightful owners.', o);
  o = document.querySelector('.info_block .note>span.imp:last-of-type');
  if(o && o.textContent == '95%')
    o.textContent = '0.5%';// a slightly more realistic value
}

function FixNovaBug() {
  var spn = obj('#full_notes');
  if(spn) {
    var m = spn.textContent.replace(/\n/gm,'<br>').match(/\u2026\smore(?:<br>)?(.*)\sless\sless/);//u2026 = '...'
    if(m) {
      spn.parentNode.innerHTML = m[1];
      console.log('description text fixed');
      return 1;
    }
  }
}

SetStyle('iframe,.vmargin{display:none}').id = 'no_frames';
document.addEventListener("DOMContentLoaded", function() {
  if(TabSites()) {
    RemoveSomeIframes();
    window.setTimeout(function(){try{window.autoClose=-1;MHideBar();}catch(e){}},1999);
  } else {
    // auto expand description - it's foolish to hide the last few words of a sen...[expand]
    if(obj('#brief_notes') && !FixNovaBug()) SetStyle('#full_notes{display:inline!important;}#full_notes>a[href="#"],#brief_notes{display:none!important;}');
    // mark watched episodes red
    if(obj('#videos')) SetStyle('#videos a:visited{color:red;}');
  }
  RemoveElement(obj('#no_frames'));
});

// public domain by gnblizz
// contact me with my username + '@web.de'
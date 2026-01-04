// ==UserScript==
// @name         gmx - show new unread
// @name:fr      gmx - marquer nouveaux messages
// @name:de      gmx - zeige neues ungelesenes
// @name:es      gmx - mostrar nuevos no leídos
// @namespace    https://github.com/Procyon-b
// @version      0.6.2
// @description  Mark folders with new unread messages (gmx / web.de)
// @description:fr Marque les dossiers contenant de nouveaux messages (gmx / web.de)
// @description:de Markieren Sie Ordner mit neuen ungelesenen Nachrichten (gmx / web.de)
// @description:es Marcar carpetas con nuevos mensajes no leídos (gmx / web.de)
// @author       Achernar

// @match        https://3c.gmx.net/mail/client/*
// @match        https://3c-bap.gmx.net/mail/client/*
// @include      https://3c-bs.gmx.tld/mail/client/*
// @match        https://3c.web.de/mail/client/*
// @match        https://3c-bap.web.de/mail/client/*

// @match        https://navigator.gmx.net/*
// @match        https://bap.navigator.gmx.net/*
// @include      https://navigator-bs.gmx.tld/*
// @match        https://navigator.web.de/*
// @match        https://bap.navigator.web.de/*

// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/398539/gmx%20-%20show%20new%20unread.user.js
// @updateURL https://update.greasyfork.org/scripts/398539/gmx%20-%20show%20new%20unread.meta.js
// ==/UserScript==

(function() {
"use strict";

var h=location.host.split('.');

window.addEventListener('blur', function(ev) {
  window.top.postMessage({blur:1},'*');
  });
window.addEventListener('focus', function(ev) {
  window.top.postMessage({focus:1},'*');
  });

let f=document.hasFocus();
window.top.postMessage({focus:f, NOblur:!f},'*');


// main frame (top)
if (location.host.startsWith('navigator') || location.host.startsWith('bap.navigator') ) {
  var TO, marked, TOb, focus=false, mailFrame, data=document.getElementById('user-data');
  try {
  if (data) data=JSON.parse(data.text);
  }catch(e){};


  window.addEventListener('message', function(ev) {
    if (typeof ev.data != 'object') return;

    if (ev.data.getUserId) {
      ev.source.window.postMessage({userId:data.hashedUasAccountId}, ev.origin);
      mailFrame={w:ev.source.window, origin:ev.origin};
      return;
      }

    if (ev.data.focus) {
      focus=true;
      if (TOb) {clearTimeout(TOb); TOb=null;}
      else if (marked) onF();
      }
    if (ev.data.blur) {
      focus=false;
      if (TO) {
        TOb=setTimeout(function(){
          TOb=null;
          onB();
          }, 1000);
        }
      }

    mailFrame && mailFrame.w.postMessage({focus:focus, blur:!focus}, mailFrame.origin);

    function onF() {
      onB();
      TO=setTimeout( function(){
        TO=null;
        marked=false;
        document.title=document.title.replace(/^\(.*?\) */,'');
        }, 3000);
      }
    function onB() {
      if (TO) {clearTimeout(TO); TO=null;}
      }

    if (!focus && ev.data.new) {
      marked=true;
      document.title='(*) '+document.title.replace(/^\(.*?\) */,'');
      }
    }, false);

  return;
  }


// folders frame
if (location.pathname.startsWith('/mail/client/') ) {
  if (window.parent === window) return;

  var e=document.querySelector('#navigation');
  if (!e) return;

  // call top to get userid
  window.top.postMessage({getUserId:true},'*');

  var focus=false, userId, folders={}, ignore=['vfol3','vfol2'];

  window.addEventListener('message', function(ev){
    if (typeof ev.data != 'object') return;

    if (ev.data.userId) {
      userId=ev.data.userId;
      let sFolders={};
      try{sFolders=GM_getValue(userId,{});}catch(e){}
      folders={userId:userId};

      // find all folders
      let a=document.querySelectorAll('#navigation NOul, #navigation li > .folder'),
        lvl=[], L, t, id, panel, New=false;
      for (let i=0,e; e=a[i]; i++) {
        L= parseInt( (L=/lvl(\d+)/.exec(e.parentNode.parentNode.classList)) && L[1] );
        lvl[L]=id=e.id;
        if (L==1) {
          panel= (panel=e.closest('.navigation')) && (panel=panel.querySelector(':scope > .panel-head'));
          if (panel && panel.title && panel.querySelector('.badge') ) panel=panel.title;
          else panel='';
          }

        let badge=e.querySelector('.badge');
        folders[id]={lvl:L, ur:badge && parseInt(badge.innerText)};
        if (ignore.includes(id)) folders[id].ignore=1;
        // the 3 default folders without badge
        if (!badge) folders[id].nobadge=1;

        let label=e.querySelector('.label');
        if (label) {
          folders[id].name=label.innerText.trim();
          // fix for closed folders
          if ( /\((\d+)\/\d+\)$/.exec(label.title) ) folders[id].ur=parseInt(RegExp.$1);
          }

        // is part of panel with badge
        if (panel) folders[id].panel=panel;

        // is subfolder
        if (t=lvl[L-1]) {
          folders[id].p=t;
          folders[t].sub=1;
          }

        if (sFolders[id]) {
          if (t=sFolders[id].mark) folders[id].mark=t;
          if (folders[id].ur > sFolders[id].ur) {
            folders[id].mark=1;
            New=true;
            }
          if (!folders[id].ur || !badge) delete folders[id].mark;
          }
        }
      try{GM_setValue(userId, folders);}catch(e){}
      buildCSS();
      if (!f && New) window.top.postMessage({new:1},'*');
      return;
      }

    if (ev.data.focus) focus=true;
    if (ev.data.blur) focus=false;
    }, false);

  function buildCSS(ret) {
    var s='/*userscript test*/', fol={}, pan={}, i;
    for (i in folders) {
      let f=folders[i];
      if (f.ignore) continue;
      if (f.mark || f.fmark) {
        s+='div.nav-item[id="'+i+'"] .badge{background-color: red !important; color: white !important;}';
        while (f.p) {
          if (!f.ignore) fol[f.p]=1;
          f=folders[f.p];
          }
        if (f.panel) {
          pan[f.panel]=1;
          }
        }
      }
    for (i in fol) { s+='div.nav-item[id="'+i+'"]:not(.open) .badge{background-color: red;}'; }
    for (i in pan) { s+='div.navigation > div.panel-head[title="'+i+'"] .badge{background-color: red; color: white;}'; }
    if (ret) return s;
    style.innerText=s;
    }

  var st={}, options={attributes: false, subtree: true, childList: true };

  var style=document.createElement('style');
  if (style.styleSheet) style.styleSheet.cssText = '';
  else style.appendChild(document.createTextNode(''));
  (document.head || document.documentElement).appendChild(style);
  buildCSS();

  const obs = new MutationObserver(function(mutL){
    let n, o, t, save=false, New=false;
    for (let mut of mutL) {
      if ( (t=mut.target) && (t.className=='badge') ) {
        if ( (n=mut.addedNodes[0]) && (n.nodeType==3) ) {
          var div=t.closest('div.nav-item.folder'), id=div && (id=div.id), q=parseInt(n.data);
          if (!id || !folders[id]) continue;
          if (folders[id].sub) {
            let cl=div.classList.contains('open') ? false:true;
            if (cl) {
              var tit= (tit=div.querySelector('.label')) && tit.title;
              let qt=-1;
              if ( /\((\d+)\/\d+\)$/.exec(tit) ) qt=parseInt(RegExp.$1);
              if (qt>=0) q=qt;
              }
            }
          if (folders[id].ur == q) continue;
          if (q <= folders[id].ur) delete folders[id].mark;
          else {
            folders[id].mark=1;
            New=true;
            }
          folders[id].ur=q;
          save=true;
          }
        }
      }

    if (save) {
      buildCSS();
      try{GM_setValue(userId, folders);}catch(e){}
      }
    if (!focus && New) window.top.postMessage({new:1},'*');
    });
  obs.observe(e, options);

  e.addEventListener('click', function(ev){
    if (ev.ctrlKey) {
      if (ev.target.classList.contains('folder-config') || ev.target.parentNode.classList.contains('folder-config') ) {
        let fol=ev.target.closest('div.nav-item.folder');
        if (!fol || fol.classList.contains('has-open-flyout') || (!fol.classList.contains('open') && fol.firstElementChild.classList.contains('toggle')) ) return;
        ev.stopPropagation();
        if (folders[fol.id].mark) {
          delete folders[fol.id].mark;
          buildCSS();
          try{GM_setValue(userId, folders);}catch(e){}
          }
        return false;
        }
      }
    },true);

  }

})();
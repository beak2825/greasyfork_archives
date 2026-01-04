// ==UserScript==
// @name         Wayback Machine - toolbar toggler
// @name:fr      Wayback Machine - (dé)masquer la barre d'outils
// @namespace    https://github.com/Procyon-b
// @version      0.8
// @description  A way to toggle the WaybackMachine's toolbar
// @description:fr  Une méthode pour masquer/afficher la barre d'outils de WaybackMachine (web.archive.org)
// @author       Achernar
// @match        *://web.archive.org/web/*
// @grant        none
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/401753/Wayback%20Machine%20-%20toolbar%20toggler.user.js
// @updateURL https://update.greasyfork.org/scripts/401753/Wayback%20Machine%20-%20toolbar%20toggler.meta.js
// ==/UserScript==

(function() {
"use strict";

function addStyle(e,s) {
  if (!e) return;
  var st=document.createElement("style");
  st.textContent=s;
  e.appendChild(st);
  }

function fix(ev) {
  var TO, st, sts = document.getElementsByTagName('style');
  addStyle( (document.head || document.documentElement), '#wm-ipp-base {opacity:0; min-height:1px;position:absolute;} #wm-ipp-base:hover {opacity: 1;} #wm-ipp-base.forcePriority {oposition:relative; z-index:99999;} body > #wm-ipp-print, body> #donato {display: none;}');

  // remove this style if present
  for (st of sts) {
    try{
    if (st.innerText.search('.wb-autocomplete-suggestions')+1) {
      st.innerText='';
      break;
      }
    }catch(e){}
    }

  // remove all added styles
  var wbSt, del=[];
  for (let el of document.body.childNodes) {
    if (el.nodeType==8) {
      if (!wbSt && (el.data==' BEGIN WAYBACK TOOLBAR INSERT ')) wbSt=true;
      else if (wbSt && (el.data==' END WAYBACK TOOLBAR INSERT ')) {
        for (let i=0; i<del.length; i++) del[i].parentNode.removeChild(del[i]);
        break;
        }
      continue;
      }
    if (!wbSt) continue;
    if (el.nodeName=='STYLE') del.push(el);
    }

  // remove archive.org stylesheets
  sts=document.querySelectorAll('link[rel=stylesheet]');
  for (st of sts) {
    if (st.href.startsWith('https://web.archive.org/_static/') && !(st.href.search('/iconochive.css')+1) ) {
      st.parentNode.removeChild(st);
      }
    }

  // change "close" icon color
  if (!sr) sr=e.sr;
  if (sr) {
    let s='#wm-tb-close .iconochive-remove-circle {color: #26d926 !important;}';
    try{ addStyle(sr, s);
    }catch(er){
      let st=document.createElement('style');
      st.textContent=s;
      sr.appendChild(st);
      }
    }

  this.removeEventListener('dblclick', fix);
  document.body.addEventListener('keydown',function(ev){
    force=ev.altKey && ev.ctrlKey;
    if (force && !forceState) {
      e.classList.add('forcePriority');
      forceState=force;
      if (TO) clearTimeout(TO);
      TO=setTimeout(function(){
        e.classList.remove('forcePriority');
        forceState=false;
        TO=0;
        },3000);

      if (sr) {
        let e = sr.querySelector('[style*="display: none;"]')
        if (e) e.style.display='';
        }
      }
    });
  }

var e=document.getElementById('wm-ipp-base'), initCnt=100, sr, TO, force=false, forceState=false;

var obs = new MutationObserver(function(mutL) {
  for (let mut of mutL) {
    let e=mut.addedNodes[0];
    if (e && (e.id=='wm-ipp-base')) {
      if (TO) clearTimeout(TO);
      obs.disconnect();
      init();
      }
    }
  });
//obs.observe(document.documentElement, {attributes: false, subtree: true, childList: true });

function init() {
  e=document.getElementById('wm-ipp-base');
  if (!e) {
    if (--initCnt > 0) TO=setTimeout(init, 50);
    else if (initCnt > -5) TO=setTimeout(init, 3000);
    return;
    }
  obs.disconnect();

  e.addEventListener('dblclick', fix);
  let ne=e.nextElementSibling;
  if (ne && (ne.id=='donato')) ne.parentNode.removeChild(ne);
  }
//init();

// catch attachShadow
var s=document.createElement('script');
s.textContent=`(function(){
var options={attributes: false, subtree: true, childList: true };
var obs = new MutationObserver(function(mutL) {
  for (let mut of mutL) {
    let e=mut.addedNodes[0];
    if (e && (e.id=='wm-ipp-base')) {
      var oldAS=e.attachShadow;
      e.attachShadow=function(m){
        e.sr=oldAS.call(e,m);
        return e.sr;
        }
      obs.disconnect();
      }
    }
});
obs.observe(document.documentElement, options);
})()`;

var injected=0;
function inject() {
  if (injected++) return;

  var sc=document.documentElement.insertBefore(s,document.head);
  sc.parentNode.removeChild(sc);
  }

var started=0;
function start() {
  if (started++) return;
  inject();
  init();
  obs.observe(document.documentElement, {attributes: false, subtree: true, childList: true });
}

tryUntil(inject, 0);
tryUntil(function(){
  obs.observe(document.documentElement, {attributes: false, subtree: true, childList: true });
  }, 0);

function tryUntil(F, TO=150, c=-1, fail) {
  if (!c--) {
    fail && fail();
    return;
    }
  try{F();}catch(e){setTimeout(function(){tryUntil(F,TO,c,fail);}, TO)}
  }

if (document.readyState != 'loading') start();
else {
  document.addEventListener('DOMContentLoaded', start);
  window.addEventListener('load', start);
  }


})();
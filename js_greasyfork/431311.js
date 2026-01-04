// ==UserScript==
// @name         IMDb - stop scripts
// @namespace    https://github.com/Procyon-b
// @version      0.7.1
// @description  Prevent unnecessary scripts from loading
// @author       Achernar
// @match        https://www.imdb.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431311/IMDb%20-%20stop%20scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/431311/IMDb%20-%20stop%20scripts.meta.js
// ==/UserScript==

(function() {
"use strict";

// which scripts to block
function match(s) {
  return /^https?:\/\/(m\.media-amazon\.com\/images\/I\/|(d1zcggttmijv1z|dqpnq362acqdi)\.cloudfront\.net\/_next\/static\/).*[^?]$/.test(s);
  }

// catch scripts before they are loaded
var obs=new MutationObserver(function(muts){
  for (let mut of muts) {
    for (let n of mut.addedNodes) {
      if ((n.nodeType == 1) && (n.tagName == 'SCRIPT')) {
        let src=n.src;
        if (!src) continue;
        if (match(src)) {
          n.type='not/javascript';
          n.addEventListener('beforescriptexecute', function(e){e.preventDefault();}, true);
          }
        }
      }
    }
  });

var c=0;
function startObs() {
  c++;
  if (!document) {
    setTimeout(startObs,0);
    return;
    }
  obs.observe(document, {childList:true, subtree:true});
  injSt();
}
startObs();

function injSt() {
  var r=document.head || document.documentElement;
  if (!r) {
    setTimeout(injSt,0);
    return;
    }
  var st=document.createElement('style');
  r.appendChild(st);
  st.innerText='.ipc-loader__circle, .ipc-loader__dot {animation: unset !important;} section.ipc-page-section[class*="Hero__HeroParent-"] .ipc-chip-list {display: block;} [data-testid="plot"]:not(:last-child) {display: inline-block; margin-right: -2em;} [data-testid="plot"] ~ .ipc-button__text {display: inline;}[data-testid="delayed-loader-test-id"]{display:none;}';
}

// load rest of the script after DOM is ready
if (document.readyState != 'loading') init();
else document.addEventListener('DOMContentLoaded', init);

function init() {

var search=document.getElementById('suggestion-search');
if (!search && !/^https:\/\/www\.imdb\.com\/.*\/mediaviewer\//.test(location.href) ) return;

if (search) search.oninput=fix;

function addJS(u, ol, c=2) {
  if (!u) return;
  var el=document.createElement('script');
  el.src=u;
  if (ol) el.onload=ol;
  el.onerror=function(){
    if (c) addJS(u,ol,--c);
    }
  try {
    let r=document.head || document.documentElement;
    r.insertBefore(el,r.firstChild);
  }catch(e){}
  if (el.parentNode) el.parentNode.removeChild(el);
}

var a, all=[], uniq={}, tot=0, done=true;

// load blocked scripts
function fix(repeat=false) {
  if (search) search.oninput=null;
  a=document.querySelectorAll('script[src*="m.media-amazon.com/images/I/"], script[src*="d1zcggttmijv1z.cloudfront.net/_next/static/"], script[src*="dqpnq362acqdi.cloudfront.net/_next/static/"]');
  a.forEach(function(e,i,a){
    if (!uniq[e.src]) all.push(e.src);
    uniq[e.src]=1;
    });
  let uTot=Object.keys(uniq).length;
  if (tot == uTot) return;
  tot=uTot;
  if (done) {
    done=false;
    loadJS();
    }
  if (repeat) {
    setTimeout(function(){fix(true)},1000);
    setTimeout(function(){fix(true)},3000);
    setTimeout(function(){fix()},8000);
    }
}

function fixPage() {
  if (location.href.startsWith('https://www.imdb.com/title/')) {
    var a=document.querySelectorAll('a[href="/"]');
    a.forEach(function(e){e.href='javascript:;'});
    }
}

fixPage();

function loadJS() {
  if (all.length==0) {
    done=true;
    return;
    }
  addJS(all.shift()+'?', loadJS);
}

if (location.pathname=='/') fix(true);
if (/^https:\/\/www\.imdb\.com\/(video|.*\/mediaviewer)\//.test(location.href)) fix(true);
}

})();
// ==UserScript==
// @name         Reddit - Subs - default sort
// @namespace    https://github.com/Procyon-b
// @version      0.5.1
// @description  Apply default sort to subs listing (feature missing in SHreddit)
// @author       Achernar
// @match        https://www.reddit.com/*
// @match        https://sh.reddit.com/*
// @run-at  document-start
// @grant   none
// @downloadURL https://update.greasyfork.org/scripts/524564/Reddit%20-%20Subs%20-%20default%20sort.user.js
// @updateURL https://update.greasyfork.org/scripts/524564/Reddit%20-%20Subs%20-%20default%20sort.meta.js
// ==/UserScript==

(function() {
"use strict";

var sort={};

const RE=/^(?:https:\/\/(?:sh|www)\.reddit\.com)?(\/(?:r\/[^\/]+\/)?)(?:(best|new|hot|top|rising)\/)?(?:\?.*)?$/;
const REval=/^(best|new|hot|top|rising)?$/;
var SR=[];

var done=false;
function init() {
  if (done) return;
  done=true;
  document && document.body && chk();
  newObs(document.body);
  window.addEventListener('focus', function(){
    if (load()) {
      chk(null, true);
      updLeftNav();
      }
    });

  if (window == top) {
    var e=document.createElement('div');
    e.style='position: fixed; top: 0; left: 0; width: 15px; height: 15px; z-index: 9999;';
    document.body.appendChild(e);
    e.ondblclick=function(){
      var p, s='';

      do {
        p=prompt(s+'Default sort\nChoose between: [empty] - hot -  new - top - rising', sort.default);
        if (p == null) break;
        s='ERROR. Invalid value.\nTry again\n';
      } while (!REval.test(p));

      if (p != null) {
        if (p) sort.default=p;
        else delete sort.default;
        store();
        chk(null, true);
        updLeftNav();
        }

      p=prompt('Auto-redirect to correct sort ?\nEither: [empty field] - true - force - ask', sort.redir);
      if (p != null) {
        if (p) sort.redir = p;
        else delete sort.redir;
        store();
        }

      };
    }
  }

function gen(re) {
  var s=sort[re[1]] || '';
  if (s) s+='/';
  else if ((re[1] != '/') && sort.default) s=sort.default+'/';
  return s;
  }

function chk(r, force=false) {
  var a=(r||document).getElementsByTagName("a");
  if (r && (r.nodeName == 'A')) a=[r, ...a];
  for (let i=0,e; e=a[i]; i++) {
    if (!force && e._sortfixed) continue;
    e._sortfixed=true;
    if (e.hostname == 'www.reddit.com') {
      let re;
      if (re=RE.exec(e.pathname + (!e.pathname.endsWith('/') ? '/':'' ) )) {
        if (e.closest('[slot="dropdown-items"], faceplate-dropdown-menu')) continue;
        e.classList.add('_marked_');
        let s=gen(re);
        e.pathname=re[1]+s;
        }
      }
    }
  a=(r||document).querySelectorAll('pdp-back-button[subreddit-prefixed-name]');
  for (let i=0,e; e=a[i]; i++) {
    if (!force && e._sortfixed) continue;
    e._sortfixed=true;
    let re, v=e.attributes['subreddit-prefixed-name'].value;
    if (re=RE.exec('/'+v+'/')) {
      e.classList.add('_marked_');
      let s=gen(re);
      e.attributes['subreddit-prefixed-name'].value=(re[1]+s).replace(/^\/(.+)\/$/, "$1");
      }
    }
  }

var AS=HTMLElement.prototype.attachShadow;
HTMLElement.prototype.attachShadow=function(m){/*[native */
  var e=this;
  let sr=AS.call(e,m);

  if (e.tagName == 'REDDIT-RECENT-PAGES') {
    SR.push(sr);
    newObs(sr, cbRec);
    e.SR=true;
    }
  else if (e.tagName.startsWith('LEFT-NAV-') || (e.tagName == 'SHREDDIT-SUBREDDIT-HEADER')  || (e.tagName == 'MOD-NAV') ) {
    SR.push(sr);
    newObs(sr);
    e.SR=true;
    }
  return sr;
  }

function updLeftNav() {
  for(let r, i=0; r=SR[i]; i++) {
    for(let e, j=0; e=r.children[j]; j++) {
      chk(e, true);
      }
    }
}

function ds(sub, s) {
  let d= sub == '/' ? 'best' : (sort.default?'DEF':'');
  return s == d ? '' : s;
}

function patchFetch() {
  // XHR - Fetch
  const _fetch=window.fetch;
  window.fetch = async (...args) => {
    let [resource, config ] = args;
    let response = await _fetch(resource, config);
    let re;
    if ( re=RE.exec(resource) ) {
      let s=ds(re[1], re[2]);
      if (s != ds(re[1],sort[re[1]] || '') ) {
        if ( (re[1] != '/') && sort.default && (s == sort.default) ) s='';
        if (s) sort[re[1]] = s;
        else delete sort[re[1]];
        store();
        chk(null, true);
        updLeftNav();
        }
      }
    return response;
    };
  }

function newObs(r, f=cb) {
  var o=new MutationObserver(f), config = { attributes: false, childList: true, subtree: true};
  o.observe(r, config);
  return o;
}

function cb(mutL) {
  for(let mut of mutL) {
    if (mut.type == 'childList') {
      for (let e,i=0; e=mut.addedNodes[i]; i++) {
        if (e.nodeType == 1) chk(e);
        }
      }
    }
  }

function cbRec(mutL) {
  for(let mut of mutL) {
    if (mut.type == 'childList') {
      for (let e,i=0; e=mut.addedNodes[i]; i++) {
        if (e.nodeType == 1) {
          let r=e.closest('details');
          if (r) chk(r, true);
          else chk(e);
          }
        }
      }
    }
  }

function load() {
  var o=sort.upd;
  sort=JSON.parse(localStorage.getItem('_sort_') || '{}');
  if (o != sort.upd) return true;
  }

function store() {
  sort.upd=Date.now();
  localStorage.setItem('_sort_', JSON.stringify(sort) );
}

patchFetch();
load();

if (document.readyState != 'loading') init();
else {
  document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('load', init);
  }

var redir=sort.redir;

if (redir) {
  let re;
  if (re = RE.exec(location.pathname)) {
    if ( !re[2] || (redir == 'force') ) {
      let l=re[1]+gen(re);
      if (l != location.pathname) {
        if (redir == 'ask') {
          if ( (window == top) && (window.document.visibilityState == 'visible') && confirm('Redirect to correct order ?\n'+location.href+'\n'+l) ) redir=true;
          else redir=false;
          }
        if (redir) {
          window.stop();
          location.pathname=l;
          }
        }
      }
    }
  }

})();
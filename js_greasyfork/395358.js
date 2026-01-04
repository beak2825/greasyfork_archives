// ==UserScript==
// @name         GMX standalone window view
// @name:de      GMX Standalone-Fensteransicht
// @name:fr      GMX email - fenêtre séparée
// @namespace    https://github.com/Procyon-b
// @version      0.9.4
// @description  Set option to open email in standalone window (gmx / web.de)
// @description:de Stellen Sie die Option so ein, dass E-Mails im eigenständigen Fenster geöffnet werden (gmx / web.de)
// @description:fr Réactiver l'ouverture des emails dans une fenêtre popup (gmx / web.de)
// @author       Achernar
// @match        https://3c.gmx.net/mail/client/*
// @match        https://3c-bap.gmx.net/mail/client/*
// @include      https://3c-bs.gmx.tld/mail/client/*
// @match        https://3c.web.de/mail/client/*
// @match        https://3c-bap.web.de/mail/client/*
// @run-at document-start
// @grant GM_setValue
// @grant GM_getValue
// @grant window.close
// @downloadURL https://update.greasyfork.org/scripts/395358/GMX%20standalone%20window%20view.user.js
// @updateURL https://update.greasyfork.org/scripts/395358/GMX%20standalone%20window%20view.meta.js
// ==/UserScript==

(function() {
"use strict";

var ML, MLp, R, tb, v=0;

if ( /^\/mail\/client\/(home|folder|search|spa\/list|mailSearch)/.test(location.pathname) ) document.addEventListener('DOMContentLoaded', function(){
  const maxRetry=100;
  var e, r, retry=maxRetry;

  function toggle(ev) {
    if (!e) return;
    var v=(typeof ev == 'object')? !phx.vars.enableStandaloneView : ev;
    e.checked=v;
    if (phx && phx.vars) phx.vars.enableStandaloneView=v;
    try{
      GM_setValue('option', v);
    }catch(er){
      window.sessionStorage._popup_=v;
      }
  }

  function addChk() {
    r=document.querySelector('.widget.menubar .button-container.left, webmailer-mail-list, webmailer-mail-search');

    var OE;
    // new design?
    if (r && ['WEBMAILER-MAIL-LIST', 'WEBMAILER-MAIL-SEARCH'].includes(r.nodeName) ) {
      R=r;
      // do we have style to inject?
      if (styles.R) {
        addSt(R.shadowRoot, styles.R);
        delete styles.R;
        }
      r=r.shadowRoot.querySelector('list-toolbar');
      tb=r;
      if (r) r=r.shadowRoot.querySelector('.list-toolbar__left');
      }

    if (!(r)) {
      if (retry--) {
        setTimeout(addChk,100);
        }
      return;
      }
    if (R) {
      OE=document.createElement('div');
      OE.className=r.firstElementChild.className;
      OE.style='order: 9;';
      }
    retry=maxRetry;
    e=document.createElement('input');
    e.type='checkbox';
    e.id='standaloneView';
    e.title='Standalone view';
    e.style='margin-top: 6px; order: 9;';
    if (OE) OE.appendChild(e);
    r.appendChild(OE || e);
    e.onclick=toggle;
    try{
      toggle(GM_getValue('option',true));
    }catch(er){
      let v=window.sessionStorage._popup_;
      if (v === undefined) v=true;
      else v=JSON.parse(v);
      toggle(v);
      }

    if (window !== top) (document.querySelector('.mail-list__container #mail-head') ||
                         document.querySelector('webmailer-mail-list') || document).addEventListener('click', function(ev){
      if ( (ev.target.id.substr(-10)=='fullscreen') && ev.ctrlKey) {
        ev.stopPropagation();
        let mId=ev.target.parentNode.querySelector('[href*="mailId"]');
        if (mId && /mailId=([^&]+)/.exec(mId)) openW(RegExp.$1);
        }
      }, true);

    watchFC();
  }

  addChk();

  const obs = new MutationObserver(function(mutL){
    for (let mut of mutL) {
      for (let el of mut.addedNodes) {
        if (el.classList && el.classList.contains('menubar')) {
          r=document.querySelector('.widget.menubar .button-container.left');
          addChk();
          return;
          }
        }
      }
    });

  ML=document.querySelector('#panel-mail-table .panel-body form');
  if (ML) {
    obs.observe(ML, {subtree: false, childList: true, attributes: false} );
    }

  function watchFC() {
    // new layout 2023-02
    if (R) {
      MLp=R.shadowRoot.querySelector('list-mail-list')
      ML=MLp.shadowRoot;
      }
    // previous (other gmx TLDs)
    if (!ML) ML=document.querySelector('#panel-mail-table .panel-body form');
    ML.addEventListener('click', function(ev){
      if (!phx.vars.enableStandaloneView) return;
      var tg=ev.target, li;
      if (tg.classList.contains('mail-open')
          || ( (tg.classList.contains('hoverMenu-icon') || tg.classList.contains('hover-menu-element') )  && ( (li=tg.closest('li')) && li.dataset.oaoHover=='open' ))
          || (R && tg.classList.contains('list-mail-item__fullscreen')) ) {
        ev.stopPropagation();
        let mId=tg.closest('tr[data-oao-mailid]');
        let F;
        if (mId) mId=mId.attributes['data-oao-mailid'].value;
        // design 2023-02
        else {
          mId=tg.closest('list-mail-item, search-list-item');
          if (mId) {
            F=mId.querySelector('.list-mail-item__folder');
            mId=mId.id;
            F=F && F.title && findFol(F.title);
            }
          }
        openW(mId, F);
        }
      },
      {capture: true} );
    }

  function openW(mId, F, TO) {
    if (!TO) {
      // ensure that it opens a popup and not a tab
      setTimeout(function(){openW(mId, F, 1);}, 0);
      return;
      }
    F=F || document.querySelector('.folder.active');
    F=F && F.id;
    let u=location.origin+location.pathname.replace(/search\/[^;]+;/,'folder;')+'?folderId='+F+'#';
        u=location.origin+location.pathname.replace(/(spa\/|mailSearch)[^;]*;/,'home;')+'?folderId='+F+'#';
    let w=Math.min( Math.max(1024, ML.scrollWidth || tb.scrollWidth) ,1400);
    if (R) mId=mId.replace(/^tmai/, 'id');
    window.open(u, 'tmai-'+mId ,'width='+w+',height=600');
    }

});

function findFol(f) {
  var r, a=f.split('/');
  if (a.length > 1) {
    r=document.querySelector('.mail-directory > li[data-webdriver="'+a[0]+'"]');

    for (let i=1; i < a.length; i++) {
      if (r) r=r.querySelector(':scope > ul > li > .folder > a[title^="'+a[i]+'"]');
      if (r) r=r.closest('li');
      }
    if (r) r=r.querySelector(':scope > .folder');
    }
  else {
    r=document.querySelector('.mail-directory > li > .folder > a[title^="'+a[0]+'"]');
    if (r) r=r.closest('.folder');
    }

  return r;
  }

function addSt(r,s,t) {
  let st=document.createElement('style');
  try{
    (r || document.head || document.documentElement).appendChild(st);
    st.innerText=s;
  }catch(e){
    if (t) document.addEventListener('DOMContentLoaded',function(){addSt(r,s);});
    else setTimeout(function(){addSt(r,s,t);},0);
    }
  }

var styles={};

if (window.name && (window.name.length>=20) && window.name.startsWith('tmai-') ) {
  let mId=/^(?:tmai-)?(.*)/.exec(window.name)[1];
  let fId=/folderId=([^&]*)/.exec(location.search)[1];
  let h='#action/mailDisplay/mailId/'+mId+'/page/0';

  window.onhashchange=function(){
    if (location.href.includes('#') && (location.hash != h) ) location.hash=h;
    }

  if (location.href.includes('#')) {
    location.hash='#';
    location.hash=h;
    }

  addSt(null, '#navigation, #section-0, .section-1 .prev, .section-1 .next, .section-1 .menubar, .ad, div#mail-instant-reply, #maillist, #selectionCountMessage, webmailer-mail-list .mail-info > ul.icons {display: none !important;} .section-1 {left: 0 !important;} .mail-display-wrapper {top: 0 !important;left: 0 !important;} html.can-have-sky .section-content {margin-right: 0 !important;} .section-1 > .section-container {bottom:0 !important;} div#system-message > div {display: block !important}');
  styles={
    'R':':host list-toolbar, :host list-mail-list {display:none;}',
    };

  var retryWSR=300;

  function showWithSR() {
    if (!ML) {
      setTimeout(showWithSR, 20);
      return;
      }
    var e=ML.querySelector('list-mail-item#'+mId);
    if (!e) {
      let a=ML.querySelectorAll('list-mail-item:not(.seen)');
      if (a.length) {
        a.forEach((e)=>e.classList.add('seen'));
        let b=ML.querySelector('list-paging-footer input ~ button');
        b.click();
        setTimeout(showWithSR, 200);
        return;
        }
      }
    if (e) e.click();
    else if (--retryWSR) setTimeout(showWithSR, 20);
    }

  function ready() {
    // design 2023-02 ?
    if (!ML) {
      // click() must be set
      setTimeout(function(){
        document.querySelector('.folder#'+fId+' > .label').click();
        showWithSR();
        }, 0);
      }

    let c=50;
    function setTitle() {
      let t=document.querySelector('.section-1 .mail-subject dd');
      if (t) {
        document.title=document.title.split('-')[0]+' - '+t.innerText;
        t=document.querySelectorAll('[id$="fullscreen"]');
        // more than one button
        for (let i=0; i < t.length; i++) {
          t[i].addEventListener('click', function(ev){
            ev.stopPropagation();
            window.close();
            }, {capture: true});
          }
        let t2=document.querySelector('#mail-detail');
        if (t2) t2.focus();
        }
      else c-- && setTimeout(setTitle, 100);
      }
    setTitle();
    document.body.addEventListener('click', function(ev){
      if (ev.target.id=='fullscreen') window.close();
      }, {capture: true});

    // prevent keyboard interaction
    document.body.addEventListener('keydown', function(ev){
      ev.stopPropagation();
      }, true);
    }

  if (document.readyState != 'loading') ready();
  else document.addEventListener('DOMContentLoaded', ready);
  }

// prevent keyboard interaction
if ( /^\/mail\/client\/mailbody\//.test(location.pathname) ) {
  function init() {
    try {
      document.documentElement.addEventListener('keydown', function(ev){ ev.stopPropagation(); }, true);
    }catch(e){
      document.addEventListener('DOMContentLoaded', init);
      }
    }
  init();
  }

})();
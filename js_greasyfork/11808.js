// ==UserScript==
// @name        Zvooq Plus Enabler (PoC)
// @description Zvooq Plus Enabler (Proof of Concept)
// @namespace   blog.vienalga.net
// @include     https://zvooq.ru/*
// @include     http://zvooq.ru/*
// @include     https://www.zvooq.ru/*
// @include     http://www.zvooq.ru/*
// @version     0.1 PoC
// @run-at      document-start
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/11808/Zvooq%20Plus%20Enabler%20%28PoC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/11808/Zvooq%20Plus%20Enabler%20%28PoC%29.meta.js
// ==/UserScript==

(function(win, _eval, _cloneInto){
  _cloneInto = this.cloneInto || function (f){return f;};
  _eval = win.eval;
  win.eval = _cloneInto(function(s, o){
    o = _eval(s);
    if (o && o.result && o.result.features){
      o.result.features =  ["BLOCK_POPUP","CDN_DOWNLOADS","CDN_PICS","CDN_URLS","DEFAULT_PLAYLIST",
                            "EMARSYS","EMARSYS_MOBILE_SUBS","FEATURED_CONTENT","FEATURED_SUPER_RELEASE","FEATURED_TAGS",
                            "FILL_INBOX","FONOTEKA_CDN","FP_32_KB","HQ_STREAM","INBOX",
                            "MEDIAMETRICS","NAV_PLAYLISTS","NEW_RESTRICTIONS","PAYTURE_FOR_MEDIA","PHONES_IN_U",
                            "PHONE_LOGIN","PLAYLISTS_IN_ARTISTS","PLAYLISTS_IN_SEARCH","RESTRICT_MAIN_PAGE_TO_LABELS","WEB_HIGH_QUALITY",
                            "WEB_WITHOUT_LOGIN"];
      s = '(' + JSON.stringify(o) + ')';
    }    
    return _eval(s);
  }, win, {cloneFunctions: true});

})(this.unsafeWindow || this);
// ==UserScript==
// @name         Clean Consumerizm
// @namespace    http://cafe.naver.com/consumerizm
// @version      0.1
// @description  제발 깨끗해져라
// @author       금뚱보
// @match        http://cafe.naver.com/consumerizm*
// @downloadURL https://update.greasyfork.org/scripts/31331/Clean%20Consumerizm.user.js
// @updateURL https://update.greasyfork.org/scripts/31331/Clean%20Consumerizm.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var ifr=document.getElementById('cafe_main'),ifrd=ifr.contentDocument||ifr.contentWindow.document;
    var gi=document.getElementById,gc=document.getElementsByClassName;
    var igi=ifrd.getElementById,igc=ifrd.getElementsByClassName;
    var rm=function(a) {a.parentNode.removeChild(a);};

    ['box-w', 'box-ww'].reduce(function(r,b) {return r.concat(gc.call(document, b));}, []).forEach(rm);
    ['naver-gnb', 'front-img', 'cafe-info-action', 'cafe-search', 'cafeCss', 'cafe-footer'].map(function(a){return gi.call(document, a);}).forEach(rm);
    ['ico-list-notice', 'ico-list-recomm', 'me_feed', 'list-style'].reduce(function(r,b) {return r.concat(igc.call(document, b));}, []).forEach(rm);
})();
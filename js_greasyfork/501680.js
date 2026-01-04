// ==UserScript==
// @license MIT
// @name         Google Translate Page to Any Language
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically translates pages to any language using Google Translate
// @author       Emilio Cardozo
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501680/Google%20Translate%20Page%20to%20Any%20Language.user.js
// @updateURL https://update.greasyfork.org/scripts/501680/Google%20Translate%20Page%20to%20Any%20Language.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addTranslateWidget() {
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        var h = document.getElementsByTagName('head')[0];
        h.appendChild(s);

        var t = document.createElement('div');
        t.id = 'google_translate_element';
        document.body.insertBefore(t, document.body.firstChild);
    }

    function googleTranslateElementInit() {
        new google.translate.TranslateElement({
            pageLanguage: '',
            includedLanguages: 'af,sq,am,ar,hy,az,eu,be,bn,bg,ca,zh-CN,zh-TW,hr,cs,da,nl,en,eo,et,tl,fi,fr,gl,ka,de,el,gu,ht,ha,iw,hi,hu,is,id,ga,it,ja,jw,kn,kk,km,ko,ku,ky,lo,la,lv,lt,lb,mk,mg,ms,ml,mt,mi,mr,mn,my,ne,no,ny,ps,fa,pl,pt,pa,ro,ru,sm,gd,sr,st,si,sk,sl,so,es,su,sw,sv,tg,ta,te,th,tr,uk,ur,uz,vi,cy,xh,yi,yo,zu',
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE
        }, 'google_translate_element');
    }

    window.googleTranslateElementInit = googleTranslateElementInit;
    addTranslateWidget();
})();
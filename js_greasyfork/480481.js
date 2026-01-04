// ==UserScript==
// @name         Doceru Brasil (ebook|pdf|mobi|epub)
// @description         Download automático de ebooks (pdf, epub, mobi, etc) no site doceru.com
// @namespace    http://linkme.bio/jhonpergon/?userscript=doceru
// @version      1.1
// @author       Jhon Pérgon
// @icon       https://doceru.com/static/template2/img/favicon/fav244.png

// @name:pt         Doceru Brasil (ebook|pdf|mobi|epub)
// @name:pt-BR         Doceru Brasil (ebook|pdf|mobi|epub)
// @name:pt-PT         Doceru Brasil (ebook|pdf|mobi|epub)

// @description:pt         Download automático de ebooks (pdf, epub, mobi, etc) no site doceru.com
// @description:pt-BR         Download automático de ebooks (pdf, epub, mobi, etc) no site doceru.com
// @description:pt-PT         Download automático de ebooks (pdf, epub, mobi, etc) no site doceru.com

// @match        *://doceru.com/*
// @license      MIT
// @grant        none

// @compatible      chrome
// @compatible      firefox
// @compatible      opera
// @compatible      edge
// @compatible      safari
// @compatible      berrybrowser
// @downloadURL https://update.greasyfork.org/scripts/480481/Doceru%20Brasil%20%28ebook%7Cpdf%7Cmobi%7Cepub%29.user.js
// @updateURL https://update.greasyfork.org/scripts/480481/Doceru%20Brasil%20%28ebook%7Cpdf%7Cmobi%7Cepub%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function() {
      let btnDownload = document.getElementById("dwn_btn");
      if(btnDownload){
        Download.startDownload(0);
      }
    });
})();

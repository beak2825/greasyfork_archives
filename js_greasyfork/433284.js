// ==UserScript==
// @name         超星期刊正文显示
// @namespace    https://www.moyu.moe/
// @homepage     https://github.com/MoyuScript/chaoxing-qikan-body-shower
// @supportURL   https://github.com/MoyuScript/chaoxing-qikan-body-shower/issues/new
// @version      0.3
// @description  超星期刊 WEB 端正文显示
// @author       MoyuScript
// @match        *://qikan.chaoxing.com/detail_*
// @icon         https://www.google.com/s2/favicons?domain=chaoxing.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/433284/%E8%B6%85%E6%98%9F%E6%9C%9F%E5%88%8A%E6%AD%A3%E6%96%87%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/433284/%E8%B6%85%E6%98%9F%E6%9C%9F%E5%88%8A%E6%AD%A3%E6%96%87%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
  'use strict';

   const body_url = 'https://m.chaoxing.com/mqk/read_' + location.pathname.split('_')[1];
   const $iframe = document.createElement('iframe');
   $iframe.src = body_url;
   $iframe.width = '100%';
   $iframe.style.minHeight = '80vh';
   const $el = document.querySelector('.Fmian1');
   if ($el){
     $el.after($iframe);
   }
})();

// ==UserScript==
// @name         汉典诗词-打印唐诗宋词
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  打印时只展示唐诗宋词内容并调整字体大小
// @author       You
// @match        http://sc.zdic.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zdic.net
// @grant        none
// @license      mit
// @downloadURL https://update.greasyfork.org/scripts/444871/%E6%B1%89%E5%85%B8%E8%AF%97%E8%AF%8D-%E6%89%93%E5%8D%B0%E5%94%90%E8%AF%97%E5%AE%8B%E8%AF%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/444871/%E6%B1%89%E5%85%B8%E8%AF%97%E8%AF%8D-%E6%89%93%E5%8D%B0%E5%94%90%E8%AF%97%E5%AE%8B%E8%AF%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const style = document.createElement('style')
    const head = document.head || document.getElementsByTagName('head')[0]
    style.type = 'text/css'
    const cssText = `
@media print {
  body {
    visibility: hidden;
  }
  #mbnr {
    visibility: visible;
  }
  #mbnr {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  #mbnr > * {
    display: none;
  }
  #mbnr #scbt,
  #mbnr #sc1 {
    display: block;
  }
  #scbt, #scxx, #scnr, #scnr p {
    line-height: 2;
  }
  #scbt {
    font-size: 40px;
  }
  #scxx {
    font-size: 30px;
  }
  #scnr, #scnr p {
    font-size: 36px;
  }
}
    `
    const textNode = document.createTextNode(cssText);
    style.appendChild(textNode);
    head.appendChild(style); //把创建的style元素插入到head中
})();
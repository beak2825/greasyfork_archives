// ==UserScript==
// @name         ituring.cn
// @namespace    http://www.ituring.com.cn/
// @version      0.1.3
// @description  ituring.cn 在线阅读 显示当前章节目录
// @author       isme
// @include      http://www.ituring.com.cn/tupubarticle/*
// @include      http://www.ituring.com.cn/article/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26111/ituringcn.user.js
// @updateURL https://update.greasyfork.org/scripts/26111/ituringcn.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // var customCSS = document.createElement('style');
    // customCSS.innerText = "#view-article, .side-right { position: fixed; right: 0; top: 130px; bottom: 0; } #view-article>div, .well.minibook-toc {width: 25em; position: absolute; top: 0; right: 0; bottom: 0; height: inherit; overflow-x: scroll; }";
    // document.head.insertAdjacentElement('beforeend', customCSS);

    var article_contents = document.querySelectorAll('h1,h2,h3');
    var current_article = document.querySelector('.current-article');

    article_contents.forEach(function(el, i, context) {
      if(!i) { return false; }

      let templi = document.createElement('li'),
          tempa  = document.createElement('a'),
          anchor = "$_$"+i;

      tempa.innerText = el.innerText;
      tempa.href = '#'+anchor;
      el.id = anchor;
      templi.appendChild(tempa);

      current_article.insertAdjacentElement('beforeend',templi);
    });

    current_article.scrollIntoView({block: "end", behavior: "smooth"});

})();
// ==UserScript==
// @name        Hatena Bookmark Link Modifier
// @namespace   knoa.jp
// @description はてなブックマークの下部の記事の見出しリンク先が、記事ではなくブクマページになってしまっているのを修正します。
// @include     https://b.hatena.ne.jp/entry/*
// @noframes
// @version     1.0.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/406127/Hatena%20Bookmark%20Link%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/406127/Hatena%20Bookmark%20Link%20Modifier.meta.js
// ==/UserScript==

(function(){
  const modify = function(){
    let links = document.querySelectorAll('[class$="title"] > a[href^="/entry/"]');
    Array.from(links).forEach(link => {
      // 2階建てに対応
      // https://b.hatena.ne.jp/entry/s/b.hatena.ne.jp/entry/s/www.famitsu.com/news/202008/14204041.html
      if(link.href.startsWith('https://b.hatena.ne.jp/entry/s/')){
        link.href = link.href.replace('https://b.hatena.ne.jp/entry/s/', 'https://');
      }else{
        link.href = link.href.replace('https://b.hatena.ne.jp/entry/', 'http://');
      }
    });
  };
  modify();
  observe(document.body, modify);
  if(document.hidden) window.addEventListener('focus', modify, {once: true});
  function observe(element, callback, options = {childList: true, characterData: false, subtree: false, attributes: false, attributeFilter: undefined}){
    let observer = new MutationObserver(callback.bind(element));
    observer.observe(element, options);
    return observer;
  }
})();

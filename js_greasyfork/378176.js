// ==UserScript==
// @name         金山词霸生词本采集器
// @namespace    http://scb.iciba.com/
// @version      0.2
// @description  采集金山词霸生词本(scb.iciba.com)上的单词列表
// @author       Bob Green
// @match        *://*.iciba.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378176/%E9%87%91%E5%B1%B1%E8%AF%8D%E9%9C%B8%E7%94%9F%E8%AF%8D%E6%9C%AC%E9%87%87%E9%9B%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/378176/%E9%87%91%E5%B1%B1%E8%AF%8D%E9%9C%B8%E7%94%9F%E8%AF%8D%E6%9C%AC%E9%87%87%E9%9B%86%E5%99%A8.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var btnStyles = 'position: fixed; z-index: 1000; bottom: 0; right: 0; ';
  var STORE_KEY = 'wordListCache';

  function set (content) {
    return window.localStorage.setItem(STORE_KEY, content);
  }

  function get () {
    return window.localStorage.getItem(STORE_KEY);
  }

  function render () {
    var wrapElem = document.createElement('div');
    wrapElem.style = btnStyles;
    wrapElem.innerHTML = `
      <style>
        .icibascb_wrapper {
          padding: 1em;
          border-top-left-radius: 0.5em;
          background: rgba(255,255,255,0.8);
        }
        .icibascb_btn {
          margin-right: 0.5em; 
          padding: 0.3em 1em;
          border: solid 1px #40464e;
          border-radius: 0.3em;
          background: #f0f0f0;
          color: #3c4855;
        }
        .icibascb_btn:hover {
          border-color: #4bacf3;
        }
      </style>
      <div class="icibascb_wrapper">
        <button id="icibascb_collect" class="icibascb_btn">收集本页面的单词</button>
        <button id="icibascb_show" class="icibascb_btn">显示已收集的单词</button>
        <button id="icibascb_clear" class="icibascb_btn">清空</button>
      </div>
    `;
    document.body.appendChild(wrapElem);
    wrapElem.querySelector('#icibascb_collect').addEventListener('click', collect);
    wrapElem.querySelector('#icibascb_show').addEventListener('click', showList);
    wrapElem.querySelector('#icibascb_clear').addEventListener('click', clear);
  }

  function collect () {
    var els = document.querySelectorAll('.word');
    var wordList = Array.from(els).map(el => el.innerText);
    var stashCache = get() || '';
    set((stashCache ? (stashCache + '|') : '') + wordList.join('|'));
    window.alert('已收集' + wordList.length + '个单词');
  }

  function clear () {
    set('');
  }

  function showList () {
    var elem = document.createElement('ul');
    var cache = get() || '';
    var wordList = cache.split('|');
    elem.innerHTML = '';
    for (var item of wordList) {
      var newLine = document.createElement('li');
      newLine.innerText = item;
      elem.appendChild(newLine);
    }
    var win = window.open('', 'Word List', 'menubar=no,toolbar=no,location=no,status=no');
    win.document.body.appendChild(elem);
  }

  render();
})();
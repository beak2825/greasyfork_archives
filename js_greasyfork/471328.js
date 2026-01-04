// ==UserScript==
// @name         一键搜索
// @namespace    http://tampermonkey.net/ 
// @version      0.2.1
// @description  Search youtube/bilibili/baidu/google/taobao/jingdong
// @author       Claude
// @license MIT
// @match        http://*/*
// @match        https://*/*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/471328/%E4%B8%80%E9%94%AE%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/471328/%E4%B8%80%E9%94%AE%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {

  let iframe = document.createElement('iframe');
  document.body.appendChild(iframe);
  iframe.style.display = 'none';

  let search = {
    'y': {
      prompt: '请输入YouTube搜索词:',
      url: 'https://www.youtube.com/results?search_query='
    },
    'b': {
      prompt: '请输入Bilibili搜索词:',
      url: 'https://search.bilibili.com/all?keyword='
    },
    'd': {
      prompt: '请输入百度搜索词:',
      url: 'https://www.baidu.com/s?wd='
    },
    'g': {
      prompt: '请输入greasyfork搜索词:',
      url: 'https://greasyfork.org/zh-CN/scripts?q='
    },
    't': {
      prompt: '请输入淘宝搜索词:',
      url: 'https://s.taobao.com/search?q='
    },
    'j': {
      prompt: '请输入京东搜索词:',
      url: 'https://search.jd.com/Search?keyword='
    }
  };

  document.addEventListener('keydown', function(e) {
    if (search[e.key]) {
      let query = window.getSelection().toString().trim();
      if (query) {
        openSearch(e.key, query);
      } else {
        query = prompt(search[e.key].prompt);
        if (query) {
          openSearch(e.key, query);
        }
      }
    }
  });

  function openSearch(key, query) {
    let url = search[key].url + encodeURIComponent(query);
    GM_openInTab(url, {active: true});
    iframe.src = url;
  }

})();
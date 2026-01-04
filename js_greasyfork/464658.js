// ==UserScript==
// @name         SHIFT切换选项卡自动跳转指定网页(摸鱼模板)
// @namespace    http://www.
// @version      0.1.1
// @license MIT
// @description  长按 Shif键切换网页
// @author       Your name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464658/SHIFT%E5%88%87%E6%8D%A2%E9%80%89%E9%A1%B9%E5%8D%A1%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E6%8C%87%E5%AE%9A%E7%BD%91%E9%A1%B5%28%E6%91%B8%E9%B1%BC%E6%A8%A1%E6%9D%BF%29.user.js
// @updateURL https://update.greasyfork.org/scripts/464658/SHIFT%E5%88%87%E6%8D%A2%E9%80%89%E9%A1%B9%E5%8D%A1%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E6%8C%87%E5%AE%9A%E7%BD%91%E9%A1%B5%28%E6%91%B8%E9%B1%BC%E6%A8%A1%E6%9D%BF%29.meta.js
// ==/UserScript==

var longpress = false;
var presstimer = null;
var pageurl = window.location.href;

document.addEventListener('keydown', function(e) {
  if (e.keyCode == 16) { // 判断是否按下 Shift 键
    longpress = true;
    if (!presstimer){// && e.keyCode == 65) { // 判断是否按下 A 键
      presstimer = setTimeout(function(){
        var tabs = [];
        var selectedTabIndex = -1;
         // alert('')
         window.location.href="https://github.com/search?q=owner%3Akant2002++_SuppressWinFormsTrimError&type=code"
        //  https://github.com/search?q=owner%3Akant2002++_SuppressWinFormsTrimError&type=code
      /*  windows.getCurrent({populate: true}, function(window){
          window.tabs.forEach(function(tab, index){
            if (tab.url !== '' && tab.url !== 'chrome://newtab/' && tab.url !== 'about:newtab' && tab.url.indexOf(pageurl) < 0) {
              tabs.push(tab);
              if (tab.active) selectedTabIndex = index;
            }
          });

          if (tabs.length >= 1) {
            var nextTabIndex = (selectedTabIndex+1) % tabs.length;
            window.location.replace(tabs[nextTabIndex].url);
          }
        });*/

        presstimer = null;
      }, 1500);
    }
  }
});

document.addEventListener('keyup', function(e) {
  if (e.keyCode == 16 ){//&& e.keyCode == 65) { // 判断是否同时松开 Shift+A 键
    if (presstimer !== null) {
      clearTimeout(presstimer);
      presstimer = null;
    }
    longpress = false;
  }
});
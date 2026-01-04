// ==UserScript==
// @name         fuck csdn
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  fucking csdn ;浏览器设置默认搜索引擎里添加新引擎https://www.baidu.com/#ie={inputEncoding}&wd=%s -csdn ，根治

// @author       半仙
// @match        https://www.baidu.com/*
// @license      MIT

// @icon        https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fbpic.588ku.com%2Felement_water_img%2F18%2F12%2F18%2Fb107e70946c35ddac9fa31f925626351.jpg&refer=http%3A%2F%2Fbpic.588ku.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1640916009&t=d3e31efc32ab707d24a32dba1a8f982b
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436368/fuck%20csdn.user.js
// @updateURL https://update.greasyfork.org/scripts/436368/fuck%20csdn.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // @match        https://*.bing.com/* todo
    document.querySelector("#su").addEventListener('click',()=>{
      let csdn = " -csdn"
      let kw = document.querySelector("#kw").value
      if(kw.includes(csdn)) return;
      document.querySelector("#kw").value = kw+csdn
    })
})();
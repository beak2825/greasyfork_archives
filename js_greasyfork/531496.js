// ==UserScript==
// @name         切换搜索
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  切换搜索引擎
// @author       vincent
// @include      *.bing.com/*
// @include      *.baidu.com/*
// @include      *.google.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/531496/%E5%88%87%E6%8D%A2%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/531496/%E5%88%87%E6%8D%A2%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 创建悬浮面板容器
    const panel = document.createElement('div');
    var a1, link1;
    if(location.host.includes('bing.com')){
        const pr = new URLSearchParams(location.search).get('q')
        panel.innerHTML = '<div class="floating-panel"> <a href="https://www.baidu.com/s?wd='+pr+'">百度</a>  <a href="https://www.google.com/search?q='+pr+'">Google</a> <a href="https://metaso.cn/?q='+pr+'">秘塔</a> </div>'
    }
    else if(location.host.includes('google.com')){
        const pr = new URLSearchParams(location.search).get('q')
        panel.innerHTML = '<div class="floating-panel"> <a href="https://www.baidu.com/s?wd='+pr+'">百度</a>  <a href="https://www4.bing.com/search?q='+pr+'">Bing</a> <a href="https://metaso.cn/?q='+pr+'">秘塔</a> </div>'
    }
    else if(location.host.includes('www.baidu.com')){
        const pr = new URLSearchParams(location.search).get('wd')
        panel.innerHTML = '<div class="floating-panel"> <a href="https://www4.bing.com/search?q='+pr+'">Bing</a>  <a href="https://www.google.com/search?q='+pr+'">Google</a> <a href="https://metaso.cn/?q='+pr+'">秘塔</a> </div>'
    }

   // 添加CSS样式
    const style = document.createElement('style');
    style.textContent = `
.floating-panel {
  position: fixed;
  top: 50%;
  left: 10px;  /* 改为左侧定位 */
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.97);
  padding: 2px 3px;
  border-radius: 6px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.12);
  min-width: 80px;
  font-family: "Microsoft Yahei", sans-serif;
  border: 1px solid #e3e3e3;
  z-index: 100000; /* 提高层级兼容百度元素 */
}

.floating-panel h3 {
  margin: 0 0 14px 0;
  font-size: 15px;
  color: #444;
  text-align: center;
  font-weight: normal;
}

.floating-panel a {
  display: block;
  padding: 8px 12px;
  text-decoration: none;
  color: #666;
  transition: all 0.2s;
  text-align: left;
  border-radius: 4px;
  font-size: 13px;
  line-height: 1.4;
}

.floating-panel a:hover {
  background: #f8f8f8;
  color: #3385ff;
  transform: translateX(4px);
}

.floating-panel a:not(:last-child) {
  margin-bottom: 8px;
}
`;

    // 插入到页面中
    document.body.appendChild(style);
    document.body.appendChild(panel);

   
})();
// ==UserScript==
// @name         OIer交流站·洛谷插件
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  在洛谷添加一些关于Oier交流站(OIer Club)的消息(非广告)
// @author       jyb666
// @match        *://www.luogu.com.cn/
// @homepageURL  https://greasyfork.org/zh-CN/scripts/412366
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/412366/OIer%E4%BA%A4%E6%B5%81%E7%AB%99%C2%B7%E6%B4%9B%E8%B0%B7%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/412366/OIer%E4%BA%A4%E6%B5%81%E7%AB%99%C2%B7%E6%B4%9B%E8%B0%B7%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var status_html;
  function init() {
    var node = document.createElement('div');
	  node.id = 'oier-club';
	  node.className = 'lg-article';
    status_html="<h3>OIer交流站</h3>\n当前在线状态：不在线</br>\n上次在线时间："+window.localStorage.getItem("oier-club");//如果在线的话服务器端会替换的
    node.innerHTML = status_html;
    document.querySelector('div.lg-index-benben > div:nth-child(2)').insertAdjacentElement('afterend', node);
    var url = "https://oier.test.utools.club/api/online.php";
    var script = document.createElement('script');
    script.setAttribute('src', url);
    document.getElementsByTagName('head')[0].appendChild(script); 
  }
  setTimeout(init, 100);
})();
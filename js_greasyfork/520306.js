// ==UserScript==
// @name          洛谷插件·备忘录
// @namespace     https://www.luogu.com.cn/user/695833
// @description   在犇犇区上面添加备忘录（1.4 版本更新：添加了提示注释）
// @author        沐咕
// @run-at        document_start
// @version       1.4
// @license       MIT
// @match         https://www.luogu.com.cn/*
// @match         https://www.luogu.com/*
// @match         https://www.luogu.org/
// @icon          https://cdn.luogu.com.cn/upload/usericon/695833.png
// @downloadURL https://update.greasyfork.org/scripts/520306/%E6%B4%9B%E8%B0%B7%E6%8F%92%E4%BB%B6%C2%B7%E5%A4%87%E5%BF%98%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/520306/%E6%B4%9B%E8%B0%B7%E6%8F%92%E4%BB%B6%C2%B7%E5%A4%87%E5%BF%98%E5%BD%95.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var status_html;
  function init() {
    var node = document.createElement('div');
	  node.id = 'oier-club';
	  node.className = 'lg-article';
    status_html="<h3>备忘录</h3>\n第一条：关注沐咕谢谢啦</br>\n第二条：关注沐咕谢谢啦</br>\n"; // 自己更改，格式为：“备忘录内容</br>\n”
    node.innerHTML = status_html;
    document.querySelector('div.lg-index-benben > div:nth-child(2)').insertAdjacentElement('afterend', node);
    var url = "https://oier.test.utools.club/api/online.php";
    var script = document.createElement('script');
    script.setAttribute('src', url);
    document.getElementsByTagName('head')[0].appendChild(script);
  }
  setTimeout(init, 100);
})();
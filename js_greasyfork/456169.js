// ==UserScript==
// @name                                    东方财富自选页极简
// @version                                  2022.12.07.1
// @description                          东方财富自选页极简,不需要其他花里胡哨的推荐的
// @match                                *http://quote.eastmoney.com/zixuan/?from=home*
// @namespace 
// @license                             Agreed
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/456169/%E4%B8%9C%E6%96%B9%E8%B4%A2%E5%AF%8C%E8%87%AA%E9%80%89%E9%A1%B5%E6%9E%81%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/456169/%E4%B8%9C%E6%96%B9%E8%B4%A2%E5%AF%8C%E8%87%AA%E9%80%89%E9%A1%B5%E6%9E%81%E7%AE%80.meta.js
// ==/UserScript==


(function() {
    var css = '{display:none !important;height:0 !important}';
// 东方财富自选页
    css += '.main,.topnav{width:89% !important}';
    css += '.wl_bot,.qqsj,.newsgubass,.mainr,.logot{display:none !important}'
    css += 'body{display: flex;flex-wrap: nowrap;align-items: center;flex-direction: column;}'

   loadStyle(css)
   function loadStyle(css) {
      var style = document.createElement('style');
      style.type = 'text/css';
      style.rel = 'stylesheet';
      style.appendChild(document.createTextNode(css));
      var head = document.getElementsByTagName('head')[0];
      head.appendChild(style);
      document.getElementsByTagName('title')[0].innerText='JavaScript'
   }
})();

// ==UserScript==
// @name         手机看贴吧
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://tieba.baidu.com/*
// @match        https://tiebac.baidu.com/*
// @match        http://tieba.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421386/%E6%89%8B%E6%9C%BA%E7%9C%8B%E8%B4%B4%E5%90%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/421386/%E6%89%8B%E6%9C%BA%E7%9C%8B%E8%B4%B4%E5%90%A7.meta.js
// ==/UserScript==


(function () {
  var whiteList = ['tieba.baidu.com', 'm.tieba.com', 'jump2.bdimg.com', 'tiebac.baidu.com', 'c.tieba.baidu.com'];
  var hostname = window.location.hostname;
  var key = encodeURIComponent('Track13:贴吧去广告:执行判断');
  if (whiteList.indexOf(hostname) < 0 || window[key]) {
    return;
  };
  window[key] = true;
  const kad = document.createElement('style');
  kad.innerText = 'div[data-metadata],.nav-bar-wrapper,.tb-hotthread-wrapper,.recommend-list,.bottom-guide-box{display:none!important}';
  document.head.appendChild(kad);
  let reg = /\/p\/.*/gi;
  const pathname = window.location.pathname;
  if (reg.test(pathname)) {
    const tid = pathname.replace(/[^0-9]/ig,"");
    window.location.replace(`https://byokpg.smartapps.cn/pages/pb/pb?tid=${tid}`);
    return
  };
  function QueryString(item) {
    var sValue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
    return sValue ? sValue[1] : sValue;
  };
  if(pathname === '/f') {
    if (QueryString('kz')){
      window.location.replace(`https://byokpg.smartapps.cn/pages/pb/pb?tid=${QueryString('kz')}`);
    } else {
      const tname = QueryString('kw');
      window.location.replace(`https://byokpg.smartapps.cn/pages/frs/frs?kw=${tname}`);
    };
  };
})();

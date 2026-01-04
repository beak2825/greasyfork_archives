// ==UserScript==
// @name              所有站点使用默认字体样式
// @namespace         https://gitub.com/weirick/AllSiteDefaultFont
// @version           1.2.1
// @icon              https://weirick.github.io/storage/font.png
// @description       设置所有网站字体样式：微软雅黑+取消加粗
// @author            RCWei
// @license           GPL-3.0
// @supportURL        https://gitub.com/weirick/AllSiteDefaultFont
// @include             *://*/*
// @noframes
// @run-at            document-start
// @grant             none
// @require           https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/397585/%E6%89%80%E6%9C%89%E7%AB%99%E7%82%B9%E4%BD%BF%E7%94%A8%E9%BB%98%E8%AE%A4%E5%AD%97%E4%BD%93%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/397585/%E6%89%80%E6%9C%89%E7%AB%99%E7%82%B9%E4%BD%BF%E7%94%A8%E9%BB%98%E8%AE%A4%E5%AD%97%E4%BD%93%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

;(function () {
  let css = document.createElement('style');
  css.type = 'text/css';
  css.innerHTML="*{font-family:微软雅黑;font-weight:400!important;}a,h1,h2,h3,h4,h5,h6,p,b{font-weight:400!important;}.h1,.h2,.h3,.h4,.h5,.h6,{font-weight:400!important;}";
  document.getElementsByTagName('head').item(0).appendChild(css);
  $('pre,code').css('cssText', 'font-weight:400 !important;font-family:Jetbrains Mono !important');

  let body = document.getElementsByTagName('body')[0];
  body.setAttribute('style','font-weight:400 !important');

  var site = location.host;
  switch (site) {
    case 'github.com':
      $('.h1, .h2, .h3, .h4, .h5, .h6, p, a').css('cssText', 'font-weight:400 !important');
      $('.text-bold').css('cssText', 'font-weight:400 !important');
      break;

    case 'member.bilibili.com':
      $('#app *').css('cssText', 'font-weight:400 !important');
      break;

    default:
  }
})();
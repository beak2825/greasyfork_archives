// ==UserScript==
// @name             字体加粗
// @version          1.1
// @icon
// @namespace    FLScript
// @description    加粗百度和谷歌的搜索结果页字体
// @author           FL
// @license           GPL-3.0
// @supportURL
// @include             *://www.baidu.com/s*
// @include             *://www.baidu.com/baidu*
// @include             *://www.google.com/search*
// @noframes
// @run-at            document-start
// @grant             none
// @require           https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/402004/%E5%AD%97%E4%BD%93%E5%8A%A0%E7%B2%97.user.js
// @updateURL https://update.greasyfork.org/scripts/402004/%E5%AD%97%E4%BD%93%E5%8A%A0%E7%B2%97.meta.js
// ==/UserScript==

;(function () {
  let css = document.createElement('style');
  css.type = 'text/css';

     css.innerHTML="*{font-family:微软雅黑;font-weight:400!important;}a,h1,h2,h3,h4,h5,h6,b{font-weight:700!important;}.h1,.h2,.h3,.h4,.h5,.h6,{font-weight:400!important;}";
  document.getElementsByTagName('head').item(0).appendChild(css);
  $('pre,code').css('cssText', 'font-weight:400 !important;font-family:Jetbrains Mono !important');

  let body = document.getElementsByTagName('body')[0];
  body.setAttribute('style','font-weight:400 !important');

})();
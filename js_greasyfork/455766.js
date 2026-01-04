// ==UserScript==
// @name         anti-grayscale
// @version      0.4.1
// @description  灰你妈的逼
// @author       cybartist
// @match        http*://*/*
// @run-at       document-start
// @grant        GM_addStyle
// @license      MIT
// @namespace https://greasyfork.org/users/990596
// @downloadURL https://update.greasyfork.org/scripts/455766/anti-grayscale.user.js
// @updateURL https://update.greasyfork.org/scripts/455766/anti-grayscale.meta.js
// ==/UserScript==
(function () {
  function remove_class(name) {
    var a = document.getElementsByClassName(name);
    for(var b=0; b < a.length; ++b) a[b].classList.remove(name);
  }
  
  
  function anti() {
    GM_addStyle(
      "* {filter:none !important;}"
    );
    
    
    remove_class('gray');
    
    // 傻逼百度
    remove_class('big-event-gray');
    var windowUrl = window.location.href;
    var baidudesk = /https:\/\/www.baidu.com/;
    var baidumobile = /https:\/\/m.baidu.com/;
    if (windowUrl.match(baidudesk)){
      if (document.getElementById("s_lg_img")) document.getElementById("s_lg_img").setAttribute("src","https://www.baidu.com/img/flexible/logo/pc/index.png");
      if (document.getElementById("s_lg_img_new")) document.getElementById("s_lg_img_new").setAttribute("src","https://www.baidu.com/img/flexible/logo/pc/index.png");
      if (document.getElementsByClassName("index-logo-src").length==1){
          document.getElementsByClassName("index-logo-src")[0].setAttribute("src","https://www.baidu.com/img/flexible/logo/pc/result.png");
          document.getElementsByClassName("index-logo-peak")[0].setAttribute("src","https://www.baidu.com/img/flexible/logo/pc/result.png");
          document.getElementsByClassName("index-logo-srcnew")[0].setAttribute("src","https://www.baidu.com/img/flexible/logo/pc/result.png");
      }
      if (document.getElementById("logo")) {
        document.getElementById("logo").getElementsByTagName("a")[0].getElementsByTagName("img")[0].setAttribute("src","https://www.baidu.com/img/flexible/logo/logo_web.png");
      }
    }
    if (windowUrl.match(baidumobile)){
      document.getElementById("logo").getElementsByTagName("a")[0].getElementsByTagName("img")[0].setAttribute("src","https://www.baidu.com/img/flexible/logo/logo_web.png");
    }
  }
  anti();
  
  
  window.addEventListener('load', function() {
    anti();
  }, false);
})();

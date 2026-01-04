// ==UserScript==
// @name         cysy
// @namespace    https://github.com/lyz127
// @version      1.6.1
// @description  web/MP4
// @author       lyz127
// @match        *://cc.cysyedu.cn/cypy/web/*
// @match        *://cysyedu.cn/cypy/web/*
// @icon         http://cysyedu.cn/imges/logo.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460842/cysy.user.js
// @updateURL https://update.greasyfork.org/scripts/460842/cysy.meta.js
// ==/UserScript==

(function() {
  'use strict';
  function pj() {
    $("#video").removeAttr("controlslist");
    $(".right #kcbt:last").removeAttr("hidden");
    for (let i = 0; i < $('.right #gk a').length - 1; i++) {
      let ad = $('.right #gk:eq(' + i + ') a'),
        af = '',
        ah = '';
      af = ad.attr("href").replace(/index/, "video").replace(/cxcpindex|cpindex/, "spbf");
      ah = ad.html().replace(/不/, '');
      ad.attr("href", af);
      ad.html(ah);
    }
  }
  let timer, just=()=>{
    if (jQuery) {
      pj();
      clearInterval(timer);
    }
  };
  if (typeof jQuery == 'undefined') {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.src = "https://cdn.staticfile.org/jquery/3.6.3/jquery.min.js";
    script.type = 'text/javascript';
    head.appendChild(script);
    timer = setInterval(just,100);
  } else {
    pj();
  }
})();

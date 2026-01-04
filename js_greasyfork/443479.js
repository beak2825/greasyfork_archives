// ==UserScript==
// @name         极简百度重定向(科码秋粉丝专用)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  绿色极简百度重定向
// @author       kmq
// @connect    baidu.com
// @connect    google.com
// @connect    google.com.hk
// @connect    google.com.jp
// @include    *://ipv6.baidu.com/*
// @include    *://www.baidu.com/*
// @include    *://www1.baidu.com/*
// @include    *://m.baidu.com/*
// @include    *://xueshu.baidu.com/s*
// @include    *://*.google*/search*
// @include    *://*.google*/webhp*
// @exclude    *://*.google*/sorry*
// @exclude    https://zhidao.baidu.com/*
// @exclude    https://*.zhidao.baidu.com/*
// @exclude    https://www.baidu.com/img/*
// @match        *://*.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @grant    GM_xmlhttpRequest
// @license MTM
// @downloadURL https://update.greasyfork.org/scripts/443479/%E6%9E%81%E7%AE%80%E7%99%BE%E5%BA%A6%E9%87%8D%E5%AE%9A%E5%90%91%28%E7%A7%91%E7%A0%81%E7%A7%8B%E7%B2%89%E4%B8%9D%E4%B8%93%E7%94%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/443479/%E6%9E%81%E7%AE%80%E7%99%BE%E5%BA%A6%E9%87%8D%E5%AE%9A%E5%90%91%28%E7%A7%91%E7%A0%81%E7%A7%8B%E7%B2%89%E4%B8%9D%E4%B8%93%E7%94%A8%29.meta.js
// ==/UserScript==
var myJq = jQuery.noConflict();
function getSourceUrl(txt, reg=/URL='([^']+)'/ig) {
  try {
    return reg.exec(txt)[1];
  } catch (e) {
    return "";
  }
}
(function () {
  'use strict';
  let c_curhref = 'https://www.baidu.com/'
  myJq(document).ready(() => {
    myJq('head').append(`<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">`)
    let lks = myJq('h3 > a')
    for (let i = 0; i < lks.length; i++) {
      try {
        GM_xmlhttpRequest({
          extData: c_curhref,
          url: lks[i].href+'&wd=&eqid=',
          headers: {"Accept": "*/*", "Referer": c_curhref},
          method: "GET",
          timeout: 8000,
          onreadystatechange: (response)=>{
            if(response.responseText) {
              lks[i].href = getSourceUrl(response.responseText)
              return
            }
          }
        });
      } catch (error) {}
    }
  });
})();

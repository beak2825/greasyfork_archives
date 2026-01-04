// ==UserScript==
// @name         tbds前端本地开发免cookie
// @namespace    http://tampermonkey.net/
// @version      0.3.0
// @description  TBDS登录8081跳转注入cookie插件
// @author       HankBu
// @include      *://*/index.html*
// @include      *://localhost*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/417562/tbds%E5%89%8D%E7%AB%AF%E6%9C%AC%E5%9C%B0%E5%BC%80%E5%8F%91%E5%85%8Dcookie.user.js
// @updateURL https://update.greasyfork.org/scripts/417562/tbds%E5%89%8D%E7%AB%AF%E6%9C%AC%E5%9C%B0%E5%BC%80%E5%8F%91%E5%85%8Dcookie.meta.js
// ==/UserScript==

(function () {
  'use strict';
  GM_addStyle('.tbds-inject-btn{position:absolute; left:20px; top:50px; line-height: 22px; padding:0 5px; background: #366df4; color: #FFF; z-index:9; cursor: pointer;}');

  function getPort(url) {
    url = url.match(/^(([a-z]+:)?(\/\/)?[^\/]+).*$/)[1] || url;
    var parts = url.split(':'),
      port = parseInt(parts[parts.length - 1], 10);
    if (parts[0] === 'http' && (isNaN(port) || parts.length < 3)) {
      return 80;
    }
    if (parts[0] === 'https' && (isNaN(port) || parts.length < 3)) {
      return 443;
    }
    if (parts.length === 1 || isNaN(port)) return 80;
    return port;
  }

  function appendTip() {
    $('body').append('<div class="tbds-inject-btn">获取cookie</div>');
  }

  function bind() {
    $('.tbds-inject-btn').on('click', () => {
      let TBDSSESSIONID = $.cookie('TBDSSESSIONID');
      GM_setValue('TBDSSESSIONID', TBDSSESSIONID);
      alert('成功获取cookie')
    })
  }

  function main() {
    let TBDSSESSIONID;
    if (location.hostname == 'localhost') {
      TBDSSESSIONID = GM_getValue('TBDSSESSIONID')
      if (TBDSSESSIONID) {
        $.cookie('TBDSSESSIONID', TBDSSESSIONID)
      }
    } else {
      appendTip();
      bind();
    }
    // if (document.referrer) {
    //   let port = getPort(document.referrer);
    //   let TBDSSESSIONID = $.cookie('TBDSSESSIONID');
    //   if (port == 8081 && TBDSSESSIONID) {
    //     GM_setValue('TBDSSESSIONID', TBDSSESSIONID);
    //   }
    // }
  }

  main();

})();
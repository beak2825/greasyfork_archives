// ==UserScript==
// @name        拒绝QQ拦截外部链接 - qq.com
// @namespace   Violentmonkey Scripts
// @match       https://c.pc.qq.com/middlem.html
// @grant       none
// @version     1.0
// @author      dianhsu
// @license     MIT
// @description 2021/8/29 下午6:46:14
// @downloadURL https://update.greasyfork.org/scripts/446068/%E6%8B%92%E7%BB%9DQQ%E6%8B%A6%E6%88%AA%E5%A4%96%E9%83%A8%E9%93%BE%E6%8E%A5%20-%20qqcom.user.js
// @updateURL https://update.greasyfork.org/scripts/446068/%E6%8B%92%E7%BB%9DQQ%E6%8B%A6%E6%88%AA%E5%A4%96%E9%83%A8%E9%93%BE%E6%8E%A5%20-%20qqcom.meta.js
// ==/UserScript==

(function(){
  'use strict';
  
  //console.log(window.location.href)
  let searchParams = new URLSearchParams(window.location.search);
  let reqUrl = searchParams.get("pfurl");
  if(!!reqUrl){
      window.location.href = reqUrl;
  }
})();
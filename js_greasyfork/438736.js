// ==UserScript==
// @name         阿里小站自动登录
// @namespace    https://greasyfork.org/users/91873
// @version      1.0.0.4
// @description  alixiaozhan auto Login
// @match       *://*.pan666.cn/
// @match       *://*.yunpan1.com/
// @match       *://*.freepan.net/
// @match       *://*.newxiaozhan.com/
// @author       wujixian
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/438736/%E9%98%BF%E9%87%8C%E5%B0%8F%E7%AB%99%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/438736/%E9%98%BF%E9%87%8C%E5%B0%8F%E7%AB%99%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
  //获取当前所有cookie
  var strCookies = document.cookie;         
  if (strCookies.indexOf("flarum_remember")==-1) {     
    document.cookie = "flarum_session=wqBbRdx1tL9WkqGkPsiNEur2qCKqPiIvTRUEVSoQ;domain="+location.host+";path=/;";
    document.cookie = "flarum_remember=YmTCIUOdpldy5RhJoCVyyWvZ4mGUxYmR8rHLtO44;domain="+location.host+";path=/;";
    location.reload();
  }        
}) ();
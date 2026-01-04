// ==UserScript==
// @name         Google continue 自动重试
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  刷新页面让脚本自动重试www.google.com/sorry/index?continue=XXX拦截的网址。避免google自动打开会空白需要手动输入url的问题。
// @author       qwertyuiop6
// @match        https://www.google.com/sorry/index?continue=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429505/Google%20continue%20%E8%87%AA%E5%8A%A8%E9%87%8D%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/429505/Google%20continue%20%E8%87%AA%E5%8A%A8%E9%87%8D%E8%AF%95.meta.js
// ==/UserScript==

(function(){

    function parse_url(url) {
      return [...new URL(url).searchParams].reduce(
        (cur, [key, value]) => ((cur[key] = value), cur),
        {}
      );
    }

    var url = parse_url(document.location.href)
    if(url.continue) document.location.href = url.continue;
})();
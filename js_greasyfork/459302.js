// ==UserScript==
// @name        直接访问链接
// @description 避免链接的二次点击
// @namespace   https://gitee.com/inch_whf/tampermonkey-script-inch
// @version     1.6
// @author      wuhongfei
// @license     MIT
// @grant       none
// @include     *
// @downloadURL https://update.greasyfork.org/scripts/459302/%E7%9B%B4%E6%8E%A5%E8%AE%BF%E9%97%AE%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/459302/%E7%9B%B4%E6%8E%A5%E8%AE%BF%E9%97%AE%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function(){
    // 获得重定向的href，前面的优先
    var href = 
        // 百度贴吧
        getHrefBySectctor("jump.bdimg.com","/safecheck/index",".link")
        // 参数target：掘金、知乎
        || getUrlParameter("target") 
        // 参数url：简书
        || getUrlParameter("url")

    console.log(href);
    if( href != null && href.startsWith("http") ){
        window.location.href = decodeURIComponent(href);
    }
})();

function getHrefBySectctor(host,pathname,selector){
    return window.location.host == host && window.location.pathname == pathname && document.querySelector(selector).innerHTML;
}

function getUrlParameter(key){
    return new URL(window.location.href).searchParams.get(key);
}
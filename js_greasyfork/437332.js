
// ==UserScript==
// @name           强制当前标签打开链接
// @version         0.0.2
// @description    强制打开链接
//启用名单↓（当前为所有网站，可将*.*改为指定网站，例如 https://www.163.com/* ）
// @include         *.*
//例外名单↓
// @exclude        https://www.sohu.com/*
// @namespace      mike-hd123
// @author         mike-hd123
// @grant          none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437332/%E5%BC%BA%E5%88%B6%E5%BD%93%E5%89%8D%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/437332/%E5%BC%BA%E5%88%B6%E5%BD%93%E5%89%8D%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    var open=1;//1为当前标签，0为新标签页
    setInterval(()=>{
        let links = document.getElementsByTagName('a');
        for (let i=0; i < links.length; i++) {
            if (open) {
                links[i].target = '_self';
            }else{
                links[i].target = '_blank';
            }
        }
    },"3000");
})();
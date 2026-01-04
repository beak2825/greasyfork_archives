// ==UserScript==
// @name        去除微博灰色遮罩
// @namespace   removeGray-weibo.com
// @match       https://weibo.com/
// @grant       none
// @version     1.0
// @author      秋刀鱼Bin
// @description 2022/12/1 上午9:45:44
// @downloadURL https://update.greasyfork.org/scripts/455845/%E5%8E%BB%E9%99%A4%E5%BE%AE%E5%8D%9A%E7%81%B0%E8%89%B2%E9%81%AE%E7%BD%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/455845/%E5%8E%BB%E9%99%A4%E5%BE%AE%E5%8D%9A%E7%81%B0%E8%89%B2%E9%81%AE%E7%BD%A9.meta.js
// ==/UserScript==
setTimeout(()=>{
  [].forEach.call(document.querySelectorAll(".grayTheme"), function(item){　
    item.classList.remove('grayTheme');
  })
},2000)
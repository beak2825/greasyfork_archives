// ==UserScript==
// @name         显示淘宝库存
// @version      0.1
// @author       kwin
// @match        *://item.taobao.com/item.htm*
// @description  一个简单的脚本，可显示淘宝隐藏的剩余库存
// @namespace https://greasyfork.org/users/184804
// @downloadURL https://update.greasyfork.org/scripts/452930/%E6%98%BE%E7%A4%BA%E6%B7%98%E5%AE%9D%E5%BA%93%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/452930/%E6%98%BE%E7%A4%BA%E6%B7%98%E5%AE%9D%E5%BA%93%E5%AD%98.meta.js
// ==/UserScript==

window.onload = function(){
    document.querySelector('#J_isku > div > dl.tb-amount.tb-clear > dd > em').style = "";
};
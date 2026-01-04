// ==UserScript==
// @name         NGA功德计数器
// @namespace    https://bbs.nga.cn
// @version      0.1
// @description  NGA一键OG，然后积版务功德
// @author       WLXC
// @match               *://bbs.nga.cn/*
// @match               *://g.nga.cn/*
// @match               *://g.nga.cn/*
// @match               *://nga.178.com/*
// @match               *://ngabbs.com/*
// @match               *://ngacn.cc/*
// @match               *://yues.org/*
// @license      MIT
// @icon         http://bbs.nga.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454977/NGA%E5%8A%9F%E5%BE%B7%E8%AE%A1%E6%95%B0%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/454977/NGA%E5%8A%9F%E5%BE%B7%E8%AE%A1%E6%95%B0%E5%99%A8.meta.js
// ==/UserScript==

(function() {
if(localStorage.getItem('ogcount')== null){
    localStorage.setItem('ogcount', 0)
}
var deleteBtn =document.createElement('div')
deleteBtn.className = 'td'
deleteBtn.innerHTML='<a class="mmdefault" href="javascript: void(0);" style="white-space: nowrap;">OG！</a>'
document.getElementsByClassName('right')[0].appendChild(deleteBtn)
deleteBtn.onclick = function(){
    var count = localStorage.getItem('ogcount');
    count ++;
    alert('恭喜你OG了！您已经OG了'+count+'次！');
    localStorage.setItem('ogcount', count)
}
})();
// ==UserScript==
// @name         NGA置顶优化
// @namespace    https://live.bilibili.com/7115892
// @version      0.55
// @author       Windy
// @description:zh-cn "置顶滚动条移除"
// @match        https://bbs.nga.cn/thread.php?fid=*
// @match        https://nga.178.com/thread.php?fid=*
// @match        https://ngabbs.com/thread.php?fid=*
// @grant        none
// @description "置顶滚动条移除"
// @downloadURL https://update.greasyfork.org/scripts/394655/NGA%E7%BD%AE%E9%A1%B6%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/394655/NGA%E7%BD%AE%E9%A1%B6%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
var a=document.getElementsByClassName(" ubbcode");
for (var i=0;i<a.length;i++){
        a[i].style.maxHeight='100%';
        a[i].style.borderRight='0';
}
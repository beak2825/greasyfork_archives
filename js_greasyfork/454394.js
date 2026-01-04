// ==UserScript==
// @name         nga去除删除水印
// @version      0.1
// @description  可以清除一些奇怪的ui，以避免密恐发作。
// @author       monat151
// @grant        none
// @run-at       document-end
// @match        http*://bbs.nga.cn/read.php*
// @match        http*://nga.178.com/read.php*
// @match        http*://ngabbs.com/read.php*
// @namespace https://greasyfork.org/users/325815
// @downloadURL https://update.greasyfork.org/scripts/454394/nga%E5%8E%BB%E9%99%A4%E5%88%A0%E9%99%A4%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/454394/nga%E5%8E%BB%E9%99%A4%E5%88%A0%E9%99%A4%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

const delay = 100; // 等待时间,脚本不生效时请自行调整

setTimeout(function(){
    var c2s = document.getElementsByClassName('c2');
    for(var i=0;i<c2s.length;i++){
        let c2 = c2s[i];
        if(c2.style && c2.style.backgroundImage){
            c2.style.backgroundImage = '';
        }
    }
}, delay);

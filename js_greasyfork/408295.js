// ==UserScript==
// @name         批量复制bing.ioliu.cn的图链接
// @namespace    https://space.bilibili.com/6727237
// @version      1.1
// @description  即使第一页，也请在网址后添加/?p=1.配合Internet Download Manager的‘任务’-‘从剪贴板中添加批量下载’
// @author       尺子上的彩虹
// @match        https://bing.ioliu.cn/?p=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408295/%E6%89%B9%E9%87%8F%E5%A4%8D%E5%88%B6bingioliucn%E7%9A%84%E5%9B%BE%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/408295/%E6%89%B9%E9%87%8F%E5%A4%8D%E5%88%B6bingioliucn%E7%9A%84%E5%9B%BE%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

setTimeout(
    function (){
    var imgrcs='';
    var imgs=document.getElementsByTagName('img');

    for (var z=0;z<imgs.length;z++){
        var tmp=imgs[z].src.replace('640x480','1920x1080');
        imgrcs+=tmp+'\n';
        imgs[z].src=tmp;
    };
    alert(imgrcs);
    },
    5000);
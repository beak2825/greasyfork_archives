// ==UserScript==
// @name               bookln_mp3_rename
// @name:zh-CN         bookln书链_mp3下载更名
// @namespace          bookln.cn.mp3
// @version            0.1.7
// @description:zh-CN  获得html页面标题，作为a的名称；将mp3的实际地址作为a的链接。
// @author             Sasha
// @match              *://*.bookln.cn/*
// @description 获得html页面标题，作为a的名称；将mp3的实际地址作为a的链接。
// @downloadURL https://update.greasyfork.org/scripts/416528/bookln_mp3_rename.user.js
// @updateURL https://update.greasyfork.org/scripts/416528/bookln_mp3_rename.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    var audio_node=document.getElementById("audio_media");
    var audio_link=audio_node.getAttribute('src');
    var title=document.title;//需要把空格替换为下划线
    title=title.replace(" ","_");
    title=title+".mp3";
    
    var h=document.createElement("p");
    var link=document.createElement("a");
    link.setAttribute('href',audio_link);
    link.innerHTML=title;
    h.appendChild(link);
    
    var parentNode=document.getElementsByClassName("book-cover-wrapper")[0];
    parentNode.prepend(h);
    
    
    //download File
    var downloadFile=function(audio_link,title){
        var request = new XMLHttpRequest();
        request.responseType ='blob';
        request.open('GET',audio_link);
        request.onload=function(){
            var url=window.URL.createObjectURL(this.response);
            var a=document.createElement('a');
            document.body.appendChild(a);
            a.href=url;
            a.download=title;
            a.click();
        }
        request.send();
    }
    
    downloadFile(audio_link,title);

})();
// ==UserScript==
// @name         贴吧视频贴过滤
// @description  过滤贴吧里的大量无关视频贴，以免影响浏览体验
// @version      0.3
// @author       zdk
// @namespace    https://greasyfork.org/users/66741
// @include http://tieba.baidu.com/p/*
// @include http://tieba.baidu.com/f?*
// @include http://tieba.baidu.com/f/*
// @downloadURL https://update.greasyfork.org/scripts/23273/%E8%B4%B4%E5%90%A7%E8%A7%86%E9%A2%91%E8%B4%B4%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/23273/%E8%B4%B4%E5%90%A7%E8%A7%86%E9%A2%91%E8%B4%B4%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

window.onload = function(){
    var a = document.getElementsByClassName('j_threadlist_video threadlist_video')[0];
    if(a){
        a.parentNode.removeChild(a);
    }
    var laji_list = document.getElementsByClassName('threadlist_video');
    for (var i = laji_list.length - 1; i >= 0; i--) {
        var laji = laji_list[i];
        for (var j=0;j<10;j++){
            laji = laji.parentNode;
        }
        laji.parentNode.removeChild(laji);
    }
};
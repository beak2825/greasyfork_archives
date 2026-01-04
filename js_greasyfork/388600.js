// ==UserScript==
// @name        QQ空间自动点赞-模拟点击2.0
// @namespace   chrome
// @include     http*://user.qzone.qq.com/*
// @include     http*://h5.qzone.qq.com/*
// @version     0.1.1
// @author      Roger
// @run-at document-end
// @description QQ空间秒赞
// @require      http://cdn.bootcss.com/jquery/1.11.1/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/388600/QQ%E7%A9%BA%E9%97%B4%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E-%E6%A8%A1%E6%8B%9F%E7%82%B9%E5%87%BB20.user.js
// @updateURL https://update.greasyfork.org/scripts/388600/QQ%E7%A9%BA%E9%97%B4%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E-%E6%A8%A1%E6%8B%9F%E7%82%B9%E5%87%BB20.meta.js
// ==/UserScript==
(function() {

    function click(){
       var arr = document.getElementsByClassName('qz_like_btn_v3');
        var i=0;
        for(var n=0;n < arr.length; n ++){
            if(arr[n].getAttribute("data-clicklog")=="cancellike")
                continue;
            if(arr[n].getAttribute("data-clicklog")=="like"){
                arr[n].click();
                i++;
            }
        }
        console.log("本轮点赞%d次", i);
        var aa=document.querySelector('#feed_friend_refresh');
        if(aa==null||aa==undefined)
            document.getElementById( "tab_menu_friend").click();
        else
            aa.click();
    }
    setTimeout(click,60000);
    console.log("----开始点赞----");
})();
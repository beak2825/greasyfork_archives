// ==UserScript==
// @name        QQ空间自动点赞-模拟点击
// @namespace   firefox
// @include     http*://user.qzone.qq.com/*
// @include     http*://h5.qzone.qq.com/*
// @version     1.4
// @author       海绵宝宝
// @run-at document-end
// @description QQ空间秒赞
// @require      http://cdn.bootcss.com/jquery/1.11.1/jquery.min.js
// @grant       GM_xmlhttpRequest
// @grant       GM_getResourceURL
// @downloadURL https://update.greasyfork.org/scripts/28085/QQ%E7%A9%BA%E9%97%B4%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E-%E6%A8%A1%E6%8B%9F%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/28085/QQ%E7%A9%BA%E9%97%B4%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E-%E6%A8%A1%E6%8B%9F%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==
(function() {
    //var html = document.getElementById("div_id").innerHTML;
//再跟你想追加的代码加到一起插入div中
//document.getElementById("div_id").innerHTML = html
    function click(){
        var arr = document.getElementsByTagName('a');
        var i=0;
        for(var n=0;n < arr.length; n ++){
            if(arr[n].getAttribute("data-clicklog")=="cancellike"){
                continue;
            }
            if(arr[n].getAttribute("data-clicklog")=="like"){
                var text=arr[n].textContent;
                if(text.length>0){
                    if(text.indexOf("取消")==-1){
                        arr[n].click();
                        i++;
                    }
                }
            }
        }
        $("#fetext").html("本轮点赞"+i+"次");
        console.log("本轮点赞%d次", i);
    }
    function myrefresh(){
        document.getElementById( "feed_friend_refresh").click();
        setTimeout(click,10000);
        setTimeout(myrefresh,30000);
    }
    setTimeout(myrefresh,2000);
    console.log("----开始点赞----");
    $("div[class='control-inner']").append('<div class="feed-control-tab"><a class="item-on item-on-slt" href="javascript:;"><span id="fetext"></span><i class="ui-icon"></i></a></div>');
})();
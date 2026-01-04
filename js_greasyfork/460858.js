// ==UserScript==
// @name         oooo
// @version      0.1
// @grant       GM_setClipboard
// @description  sirenzhuanytong
// @author       You
// @match        https://www.szwego.com/static/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=szwego.com
// @grant        none
// @namespace https://greasyfork.org/users/982547
// @downloadURL https://update.greasyfork.org/scripts/460858/oooo.user.js
// @updateURL https://update.greasyfork.org/scripts/460858/oooo.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var jsondata;
    let htmlset;
    window.onload = function() {
        if($(".f-flex-1.text-right.gf")){
            htmlset = '<div style="color:red;" class="copyck">复制信息';
            htmlset = htmlset + '<textarea id="copy" style="display:none;"></textarea></div>';
            $('.f-flex-1.text-right.gf').prepend(htmlset);
        }
        if(window.location.href.indexOf("shop_detail") != -1 ){
            htmlset = '<textarea id="copy" style="display:none;"></textarea>';
            $('.shop_detail_searchbar').prepend(htmlset);
        jiazaishuzi()
        }
    };
        window.onscroll = function(){
        //变量scrollTop是滚动条滚动时，距离顶部的距离
        var scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
        //变量windowHeight是可视区的高度
        var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
        //变量scrollHeight是滚动条的总高度
        var scrollHeight = document.documentElement.scrollHeight||document.body.scrollHeight;
        //console.log(scrollTop);
       // console.log(windowHeight);
       // console.log(scrollHeight);
                   //滚动条到底部的条件
                   //一般来说需要提前触发:scrollTop+windowHeight + 200 >=scrollHeight
                   if(scrollTop+windowHeight+580>=scrollHeight){
        　　　　        //console.log("已触底");
                       jiazaishuzi()
                  }
        }
   $(document).on("click", ".copyck",function () {
       jsondata = '{"ck": "'+document.cookie+'","shop_name":"'+$(".f-flex-1.text-right.gf").text()+'"}';
       copyText(jsondata);
   })
   $(document).on("click", ".copymsg",function () {
       let dataimg=[];
       let title="";
        console.log($(this))
       let aaa=$(this).next().attr("data-search-bury-info");
       let bb= $(this).next().children(":first").children("img");
       bb.prevObject.prevObject.children(".clear.w-1-4.relative").children().each(function(index,Element){
       dataimg.push($(Element).find("img").attr('src'));
});

       let goods_id=JSON.parse(aaa).goods_id;
       let shop_id=JSON.parse(aaa).shop_id;
       let shop_name=$(".shopName").text();
       if (dataimg.length == 0){
    title=$(this).next().children(".word-break.ellipsis-two.f14.g3").text();
}else {
    title=$(this).next().children(".f-flex.f-flex-col.f-sb.f-flex-1").children(".f-flex-1").children(".word-break.ellipsis-two.f14.g3").text();
}
       jsondata = '{"goods_id": "'+goods_id+'","shop_id":"'+shop_id+'","shop_name":"'+shop_name+'","title":"'+title+'","dataimg":"'+dataimg+'"}';
       console.log(jsondata);
       copyText(jsondata)
   })

    function copyText(str) {
        $('#copy').text("");
    $('#copy').text(str).show();
    var ele = document.getElementById("copy");
    ele.select();
    document.execCommand('copy', false, null);
    $('#copy').hide();
    alert('复制成功!');
}
        function jiazaishuzi(){
        $(".copymsg").remove();
         $('.f-flex-1 a').each(function(){
         $(this).before('<span class="copymsg" style="color: red;text-shadow: 0 0 10px #fff,;">复制↓</span>');
         });
    }
    // Your code here...
})();
// ==UserScript==
// @name         收集阅读量
// @namespace   wowkaka
// @version      0.1.1
// @description  hello world!
// @author       wowkaka
// @match        https://mp.weixin.qq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406740/%E6%94%B6%E9%9B%86%E9%98%85%E8%AF%BB%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/406740/%E6%94%B6%E9%9B%86%E9%98%85%E8%AF%BB%E9%87%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$,li=0,name=0,arr= new Array(),arrs=new Array(),als=new Array();
    $(document).ready(function(){
        var pathname = window.location.pathname + window.location.search;
        var asi = pathname.indexOf("masssendpage?t=mass/send&type=10");
        console.log('s:'+pathname);
        /*if(pathname.indexOf("loginpage?t=home/index")>=0||pathname=="/"){
            $("#header").find( '.login__type__container__account').css('display','block');
            //console.log($("#header").find( 'a.back_to_input_login').eq(0));
            //setTimeout("$(\"#header\").find(\".login__type__container__account\").css('display','block');",2000);
            var ms=$("#header").html();
          console.log(ms);

        }else */
            if(pathname.indexOf("home?t=home/index") > 0){
            setTimeout(getart, 2500);
           }
    })
    function getart(){

        var list = $('#list li');
        list.each(function(index){
            // index参数可写可不写，其表示每个元素的下标，也可以通过如下方式获取每个元素的索引值
            $(this).index();
            // 里面的语句会执行8次
            var msg=list.eq(index).find('.weui-desktop-mass__content').find('.weui-desktop-mass-appmsg__bd');
            console.log(msg);
            msg.each(function(siss){
                var num=$(this).index();

                var bb=msg.eq(siss).find('.weui-desktop-mass-media__data-list').find('.appmsg-view').text();
                var ss=msg.eq(siss).find('.weui-desktop-mass-appmsg__title').text();
                var ls=$('#app').find('.weui-desktop-panel__bd').find('.weui-desktop-data-overview').eq(2).find('.weui-desktop-data-overview__desc').text();
                 name=$('#mp_header_account').find('.weui-desktop-account__nickname').eq(0).text();
                arr=als.push([bb,ss,ls,name]);
            })
            arrs[index]=als;
            als=[];

        })

        console.log(arrs);
        $.post("https://wfxcx.hbl1.top/wechat/reading_links/getWechatradio", {arrs:JSON.stringify( arrs )}, function(data){
            console.log(data);
          setCookie("getradi",name);
             console.log(getCookie("getradi"));
        },'json')

    }
    /**
 * [setCookie 设置cookie]
 * [key value t 键 值 时间(秒)]
 */
function setCookie(key,value,t){
    var oDate=new Date();
    oDate.setDate(oDate.getDate()+t);
    document.cookie=key+"="+value+"; expires="+oDate.toDateString();
}
/**
 * [getCookie 获取cookie]
 */
function getCookie(key){
    var arr1=document.cookie.split("; ");//由于cookie是通过一个分号+空格的形式串联起来的，所以这里需要先按分号空格截断,变成[name=Jack,pwd=123456,age=22]数组类型；
    for(var i=0;i<arr1.length;i++){
        var arr2=arr1[i].split("=");//通过=截断，把name=Jack截断成[name,Jack]数组；
        if(arr2[0]==key){
            return decodeURI(arr2[1]);
        }
    }
}
})();
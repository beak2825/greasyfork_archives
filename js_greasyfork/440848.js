// ==UserScript==
// @name         百度去广告+随意是否开启关闭（页面壁纸+美化）【屏蔽百度搜索结果中的广告等】
// @namespace    http://tampermonkey.net/
// @version      6.0
// @icon         https://www.baidu.com/favicon.ico
// @description  百度去广告+页面美化+屏蔽百度搜索结果中的广告等 
// @author       wushx
// @match        *://*.baidu.com/*
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440848/%E7%99%BE%E5%BA%A6%E5%8E%BB%E5%B9%BF%E5%91%8A%2B%E9%9A%8F%E6%84%8F%E6%98%AF%E5%90%A6%E5%BC%80%E5%90%AF%E5%85%B3%E9%97%AD%EF%BC%88%E9%A1%B5%E9%9D%A2%E5%A3%81%E7%BA%B8%2B%E7%BE%8E%E5%8C%96%EF%BC%89%E3%80%90%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%B8%AD%E7%9A%84%E5%B9%BF%E5%91%8A%E7%AD%89%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/440848/%E7%99%BE%E5%BA%A6%E5%8E%BB%E5%B9%BF%E5%91%8A%2B%E9%9A%8F%E6%84%8F%E6%98%AF%E5%90%A6%E5%BC%80%E5%90%AF%E5%85%B3%E9%97%AD%EF%BC%88%E9%A1%B5%E9%9D%A2%E5%A3%81%E7%BA%B8%2B%E7%BE%8E%E5%8C%96%EF%BC%89%E3%80%90%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%B8%AD%E7%9A%84%E5%B9%BF%E5%91%8A%E7%AD%89%E3%80%91.meta.js
// ==/UserScript==

let dom = {};
let i=0;
let j=0;
dom.query = jQuery.noConflict(true);
dom.query(document).ready(function ($) {
    const cycletime = 400;
    if (location.href.indexOf('www.baidu.com') > 0) {
        // 右侧栏全部关闭（大部分是广告）
        $("#content_right").remove();
        // top-ad也关闭
        $("#top-ad").remove();
        $(".ec-pl-container").remove();
        $("#content_left > div").each(function () {
            if ($(this).attr('id') === undefined && $('> style', this).attr('id') !== undefined) {
                $(this).remove();
            }
        })
         //直达逛B站
         var goBHtml='<a href="https://space.bilibili.com/343915347" ><font size="2" color="red">逛B站去</font></a>'
         var nolyWatchBKHtml='<a id ="nolyWatchBK" ><font size="2" color="red">只看博客</font></a>'
         var beautifulHtml='<a id ="beautiful" ><font size="2" color="yellow" id="closeOrOpenBeautiful">关闭美化</font></a>'
         $('#u').append(goBHtml);
         $('#u').append(beautifulHtml);
         $('#u').append(nolyWatchBKHtml);

        setInterval(function () {
            // 右侧栏全部关闭（大部分是广告）
            $("#content_right").remove();
            // 搜索结果中有的条目广告
            $("#content_left > div").each(function () {
                if ($(this).attr('id') === undefined && $('> div', this).attr('data-placeid') !== undefined) {
                    $(this).remove();
                }
            })
            // 有延时跳出的广告
            $("a").each(function () {
                if ($(this)[0].innerHTML === '广告') {$(this).parents(".result").remove(); }
            })
            $(".san-card").each(function () {
                if ($(this).attr("tpl") === 'feed-ad') {
                    $(this).remove()
                }
            })
            
             $('.ec_ad_results').hide();

            //搜索内容居中
            $("#s_tab").css("padding-left","276px");
            $("#container").css("margin-left","276px");

            $('.toindex').remove();//首页去除
            $('.pf').remove();//设置去除
            $('.help').remove();//帮助去除

           if(i==0){
               var x = 3;
               var y = 0;//随意调数字，现在是0-3以内的随机数
               var rand = parseInt(Math.random()*(x-y+1)+y);
               rand = 1;
               if(j == 0){
               if(rand == 0 ){
                   //https://vip.helloimg.com/images/2023/11/23/o0e7kv.jpg
                    $body.css("background-image","url('https://tuchuangs.com/imgs/2022/09/18/2efd04e7d4240b09.jpg')");
               }else if(rand == 1){
                    $body.css("background-image","url('https://vip.helloimg.com/images/2023/11/23/o0e7kv.jpg')");
               }else if(rand == 2){
                    $body.css("background-image","url('https://tuchuangs.com/imgs/2022/09/18/55fe4f55911fedd2.jpg')");
               }else {
                    $body.css("background-image","url('https://tuchuangs.com/imgs/2022/09/18/b7615bedc9f18cc9.png')");
               }
               }
               $body.css("background-size","cover");
               $body.css("background-attachment","fixed");
               $('.result').css("background","rgb(130 255 98 / 65%)");
               $('.result-op').css("background","rgb(130 255 98 / 65%)");
           }else{
                 $body.css("background-image","url('')");
                 $body.css("background-size","");
                 $body.css("background-attachment","");
                 $('.result').css("background","");
                 $('.result-op').css("background","");
           }
          j=1;

            $('#nolyWatchBK').click(function(){
               //  alert($(".result").children("div").children("div").children("h3").children("a").html());
           // if($(".result").children("div").children("div").children("h3").children("a").html().indexOf("博客") < 0) {
             //   alert($(".result").children("div").children("div").children("h3").children("a").html())
                // $(".result").remove();
          //  }
                $(".result").each(function(ii,vv){
                    //ii 指第几个元素的序列号。
                    //vv 指遍历得到的元素。
                    console.log(vv)
                });
            });





            $('#su').click(function(){
                i=0;
      //         setInterval(function () {
      //         $body.css("background-image","url('https://tuchuangs.com/imgs/2022/09/18/2efd04e7d4240b09.jpg')");
      //         $body.css("background-size","cover");
       //        $body.css("background-attachment","fixed");
       //        $('.result').css("background","rgb(130 255 98 / 65%)");
       //        $('.result-op').css("background","rgb(130 255 98 / 65%)");
       //          }, 3000);
            });

        }, cycletime);

           $('#beautiful').click(function(){
                 if(i == 0){
                     i=1;
                     $('#closeOrOpenBeautiful').html('开启美化');
                 }else{
                     i=0;
                     j=0;
                     $('#closeOrOpenBeautiful').html('关闭美化');
                 }
             });


    }

    function dd(){
         alert("ss")
        if($(".result").children("div").children("div").children("h3").children("a").html().indexOf("博客") < 0) {
            alert("ss")
        }
    }



});


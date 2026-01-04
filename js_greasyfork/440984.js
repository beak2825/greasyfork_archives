// ==UserScript==
// @name         A站下载视频解析下载
// @namespace    wushx
// @version      2.2
// @description  A站下载地址，目前实现调到解析网站，实现自动填入地址
// @author       wushx
// @match        https://www.acfun.cn/v/*
// @match        https://www.leesoar.com/acfun*
// @requires     jQuery
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440984/A%E7%AB%99%E4%B8%8B%E8%BD%BD%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/440984/A%E7%AB%99%E4%B8%8B%E8%BD%BD%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var i=0;//解析次数
    var webUrl = window.location.href;
	var host = location.host;

    var goBUrl = "https://www.bilibili.com/video/BV1JP4y1g7aG?from=search";


	var html = '<button padding-left="20px" onclick="window.open('+"\'https://www.leesoar.com/acfun#parse?url="+webUrl+"\'"+')">下载该视频</button>';
    var goB = '<button padding-left="20px" onclick="window.open('+"\'"+goBUrl+"\'"+')">去B站玩</button>';
    setTimeout(function(){
        $('#player').before(html);  //可以是一句或是很多句代码，也可以是个函数
        $('#player').before(goB);
        //下面是个神奇的代码，放开后记得三连哦！
        //window.open ("https://www.bilibili.com/video/BV1JP4y1g7aG?from=search", "newwindow", "height=1px, width=4px, toolbar =no, menubar=no, scrollbars=no, resizable=no, location=no, status=no")
    },3000);
    setInterval(function(){
　
        //去除广告
         $('.right-activity').remove();
         $('#pagelet_bottomrecommend').remove();

        //去除大家都在看（如果你需要可以去除这一句，本人是喜欢简单清晰的页面）
         $('.recmd').remove();

        //播放列表的加长显示
        $('.part-wrap').css('max-height','530px');

　　},1000);　　　　//

    if($('#input-parse')){
       $('#input-parse').val(webUrl.substring(webUrl.lastIndexOf("=")+1));
        alert("如果您是第一次进入，请点击一下页面的解析开始解析视频！")
         setTimeout(function(){
             $('#aswift_1_anchor').hide();
             $('.toast').hide();
             $('.adsbygoogle').hide();
             $('#home').remove();
             $('#nav').remove();
            // var htmll="<div class=col-4 col-6-medium col-12-small align=center><strong>Alipay</strong><a href=#support class=image fit><img width=300px src=https://s3.bmp.ovh/imgs/2022/03/b2ffdfaa6c201e59.jpg alt=支付宝></a></div><div class=col-4 col-6-medium col-12-small align=center><strong>WeChat Pay</strong><a href=#support class=image fit><img width=300px src=https://s3.bmp.ovh/imgs/2022/03/39dc48955493a30e.png alt=微信></a></div><div class=col-4 col-6-medium col-12-small align=center><strong>PayPal</strong><a href=#support class=image fit><img src=https://www.leesoar.com/api-v1/qrcode?content=https://paypal.me/leesoar?locale.x=en_US&amp;size=10 alt=PayPal></a></div>";
             //$('.aln-center').html(htmll);
             var html2="<b>脚本有问题请前往<font color=#8b0000 style=font-size: 5.5rem;>微信公众号 潇潇书旅</font> 后台留言！</b>";
             $('#parse').before(html2)
             //去除support
             $('#support').remove();
             $("#parse").find("p").remove();
         },3000);


      // $('#submit').click();
    }


})();
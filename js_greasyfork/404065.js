// ==UserScript==
// @name         网页精灵
// @name:en      WebSpirit
// @name:zh      网页精灵
// @name:zh-CN   网页精灵
// @name:zh-TW   網頁精靈
// @name:ja      ウェブのエルフ

// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  展开全文，去防盗链广告
// @description:en    Expand the full text, remove the anti-theft chain and advertising
// @description:zh    展开全文，去防盗链广告
// @description:zh-CN   展开全文，去防盗链广告
// @description:zh-TW 展開全文，去防盜鏈廣告
// @description:ja    フルテキストを展開し、盗難防止チェーンと広告を削除します

// @author       Obrain Face

// @exclude   *://www.baidu.com/*
// @match        *://www.360doc.com/*
// @match        *://www.360doc.cn/*
// @match        *://www.csdn.net/*
// @match        *://blog.csdn.net/*
// @match        *://*.iteye.com/*
// @match        *://mp.weixin.qq.com/*
// @match        *://www.jianshu.com/*
// @match        *://www.w3school.com.cn/*
// @match        *://dict.youdao.com/*
// @match        *://baijiahao.baidu.com/*
// @match        *://www.w3school.com.cn/*
// @match        *://baike.baidu.com/*
// @match        *://zhidao.baidu.com/*
// @match        *://ke.qq.com/*
// @match        *://sourceforge.net/*
// @match        *://blog.51cto.com/*

// @grant        none
// @require https://code.jquery.com/jquery-3.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/404065/%E7%BD%91%E9%A1%B5%E7%B2%BE%E7%81%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/404065/%E7%BD%91%E9%A1%B5%E7%B2%BE%E7%81%B5.meta.js
// ==/UserScript==
//引用的jquery的版本不能太高，高过1.12.1的版本（https://code.jquery.com/ui/1.12.1/jquery-ui.min.js）在百度按时间段搜索时报错Uncaught TypeError: $.limitWd is not a function
//但是此版本也会报错Execution of script 'New Userscript' failed! jQuery is not defined，但不影响百度按时间段搜索
//后来发现低版本jquery在处理360doc页面的“展开全文”时，又会出现设置backgroundcolor错误，但是此脚本没有处理这个，报错原因暂时不得知。真是按下葫芦又起瓢。
//最终还是改为高版本的jquery，同时用@exclude排除百度，以解决百度按时间段搜索时报错的问题。
(function() {
    'use strict';

    // Your code here...
    var targetUrl = window.location.href;
    //去除CSDN“展开阅读全文”
    if(targetUrl.indexOf("blog.csdn.net") != -1){
       // var readmoreBtn = document.getElementById("btn-readmore");
        //方法1：模拟点击事件，触发请求
       // readmoreBtn.click();

      //方法2：CSS处理
        var myElements = document.getElementsByClassName("hide-article-box");
        var myElement = myElements[0];
        var contentDiv =document.getElementById('article_content');
        contentDiv.removeAttribute("style");
        myElement.remove();
        //ajaxPost();
        //XHRPost();
        /*
        总结：可以看出在油猴中使用postman请求自动生成的ajax和XHR都能成功向CSDN发送请求，但是使用w3school的测试页http://www.w3school.com.cn/tiy/t.asp?f=html5_ev_onload
        和本地html代码测试页file:///C:/Users/alex/Desktop/testFIleUpload/httpWithHeader.html都会有跨域问题、请求头referer和origin不安全的提示。
        */
        /*
        //使用style.display="none"的处理方法不可用，虽可去除“展开阅读全文”按钮，但导致文章加载不全
        myElement.style.display="none";//隐藏
        */

        //去除csdn博客复制时剪贴板劫持（复制内容后追加作者版权说明等多余内容）
        if (typeof (csdn) != "undefined") {
            console.log("开始清除csdn博客剪贴板------");
            csdn.copyright.init("", "", ""); //去除剪贴板劫持
        }
        // $(".check-adblock-bg").hide();
        var hookedInterval = window.setInterval;
        //拦截页面一切定时器，过于霸道可能会有误伤
        window.setInterval = function(callback, seconds) {
            // Magic time
            if (seconds == 1e3) {
                document.querySelector('#check-adblock-time').remove();
                return;
            }
            hookedInterval(callback, seconds);
        };
        window.csdn.anonymousUserLimit.judgment = function() {
            return true;
        };
        window.csdn.anonymousUserLimit.Jumplogin = function () {
            console.log("Fuck CSDN :)");
        };
    }

    //去除www.csdn.net的“展开阅读原文”
    if(targetUrl.indexOf("www.csdn.net") != -1){
        $('.readmore_btn')[0].click();
    }

    //去除360doc.com“展开全文”
    if(targetUrl.indexOf("www.360doc.com") != -1){
        $('body').removeClass('articleMaxH');
    }
    //去除360doc.cn“展开剩余内容”
    if(targetUrl.indexOf("www.360doc.cn") != -1){
        $('.mip-showmore-btn').click();
    }
    //去除iteye.com“阅读更多”
    if(targetUrl.indexOf("iteye.com") != -1){
        $('.hide-main-content').removeAttr('style');
        $('.hide-article-box').hide();
    }
    //去除blog.51cto.com博客打开时弹出的广告
    if(targetUrl.indexOf("blog.51cto.com") != -1){
        $(".closeMB").each(function(){
            if(!$(this).attr("target")=="_blank"){
               $(this).click();
            }
        });
    }
})();

$(document).ready(function(){
    //需等到页面dom加载完毕才能使属性值替换
    var targetUrl = window.location.href;
    //mp.weixin.qq.com反微信公众号文章图片防盗链
    if(targetUrl.indexOf("mp.weixin.qq.com") != -1){
       $("img").each(function(){
           $(this).attr("src",$(this).attr("data-src"));
           //$("img").removeAttr("data-src");
       });
    }
    //www.jianshu.com反简书文章图片防盗链
    if(targetUrl.indexOf("www.jianshu.com") != -1){
       $("img").each(function(){
           $(this).attr("src",$(this).attr("data-original-src"));
           //$("img").removeAttr("data-original-src");
       });
    }
    //www.w3school.com.cn去广告
    if(targetUrl.indexOf("www.w3school.com.cn") != -1){
       $("#ad").remove();
    }
    //dict.youdao.com去广告
    if(targetUrl.indexOf("dict.youdao.com") != -1){
       $("#ads").remove();
       $("#topImgAd").remove();
    }
    //baijiahao.baidu.com图片防盗链去除
    if(targetUrl.indexOf("baijiahao.baidu.com") != -1){
       $("img").each(function(){
           if($(this).attr("src").indexOf(".jpeg")==-1 && $(this).attr("src").indexOf(".jpg")==-1 && $(this).attr("alt").indexOf("到百度首页")==-1){
           $(this).attr("src",$(this).attr("src").split("?")[0]+".jpg");
           }
       });
    }
    //www.w3school.com.cn添加<script>标签以便引用jQuery
    if(targetUrl.indexOf("www.w3school.com.cn") != -1){
       //document.getElementById("TestCode").innerHTML.split("&lt;html&gt;")[0];
        var testCodeHtmlStr = $("#TestCode").html()+"";
        if(testCodeHtmlStr.indexOf('src="/jquery/jquery.js"')!=-1){
           return;
           }
        $("#TestCode").html($("#TestCode").html().split("&lt;script&gt;")[0]+"&lt;script src=&quot;https://code.jquery.com/jquery-3.1.1.min.js&quot;&gt;&lt;/script&gt;&lt;script&gt;"+$("#TestCode").html().split("&lt;script&gt;")[1]);
    }
    //baike.baidu.com跳转到指定词条标题处，以便直接阅读百科
    if(targetUrl.indexOf("baike.baidu.com") != -1){
        $(".top-tool").attr("id","tiaozhuanId");
        $(window).scrollTop($('#tiaozhuanId').offset().top);
    }
    //zhidao.baidu.com查看“更多回答”
    if(targetUrl.indexOf("zhidao.baidu.com") != -1){
       $("#show-answer-hide").click();
       $(".wgt-best-showbtn").click();//最好答案（此行代码居然不起作用？）
       //document.getElementsByClassName("wgt-best-showbtn")[0].click();//最好答案（此行代码居然不起作用？）
       if($(".wgt-answers-showbtn").length>0){
          $(".wgt-answers-showbtn").click();//其他答案（此行代码居然不起作用？）
          }
    }
    //ke.qq.com去掉“xxx（QQ号）正在观看”弹幕水印
    if(targetUrl.indexOf("ke.qq.com") != -1){
        console.log("开始清除QQ号弹幕水印===========");
        $("#marquee").remove();
        setTimeout($("#marquee").remove(),1000*60*10);
/**
        var count = 0;
        var sbTx = setInterval(function(){
        count++;
        var txDd = document.querySelectorAll("[class^='player-inject']")
        if(txDd.length || count > 300) {
           txDd[0].style.opacity = 0;
           txDd[0].style.position = 'absolute';
           txDd[0].style.top = '-100000px';
           clearInterval(sbTx)
         }
     },500)
     */
        console.log("清除QQ号弹幕水印完毕！===========");
    }
    //sourceforge.net去掉搜索结果首条广告
    if(targetUrl.indexOf("sourceforge.net") != -1){
        $(".nel.standard.can-truncate").remove();
    }
    //打印当前页面引用的所有js脚本文件
    var tags = document.getElementsByTagName("script");
    for (var i=0; i<tags.length; )
    {
        if(tags[i].hasAttribute("src")){
            console.log(tags[i].getAttribute("src") );
        }
        i++;
    }
});

//发送ajax请求到CSDN
//postman根据请求自动生成的ajax请求
function ajaxPost()
{
var form = new FormData();
form.append("headers", "{\"component\":\"enterprise\",\"datatype\":\"re\",\"version\":\"v1\"}");
form.append("body", "\"{\\\"re\\\":\\\"uid=superit401&ref=https%3A%2F%2Fblog.csdn.net%2Fhunter___%2Farticle%2Fdetails%2F85019938&pid=blog&mod=popu_376&con=%2Chttps%3A%2F%2Fblog.csdn.net%2Fjayandchuxu%2Farticle%2Fdetails%2F79113755%2C%2Ctop_0&ck=%2Chttps%3A%2F%2Fblog.csdn.net%2Fjayandchuxu%2Farticle%2Fdetails%2F79113755%2C%2Ctop_0&curl=https%3A%2F%2Fblog.csdn.net%2Fjayandchuxu%2Farticle%2Fdetails%2F79113755%23%E7%AC%AC-2-%E7%AB%A0-%E7%BC%96%E5%86%99%E7%AC%AC%E4%B8%80%E4%B8%AA%E7%94%A8%E6%88%B7%E8%84%9A%E6%9C%AC&session_id=10_1561430276375.632503&type=click\\\"}\"");

var settings = {
  "async": true,
  "crossDomain": true,
  "url": "https://re.csdn.net/csdnbi",
  "method": "POST",
  "headers": {
    "referer": "https://blog.csdn.net/jayandchuxu/article/details/79113755",
    "origin": "https://blog.csdn.net",
    "cache-control": "no-cache"
  },
  "processData": false,
  "contentType": false,
  "mimeType": "multipart/form-data",
  "data": form
};

$.ajax(settings).done(function (response) {
  console.log(response);
alert(response);
});

}

//postman根据请求自动生成的xhr请求
function XHRPost()
{
var data = new FormData();
data.append("headers", "{\"component\":\"enterprise\",\"datatype\":\"re\",\"version\":\"v1\"}");
data.append("body", "\"{\\\"re\\\":\\\"uid=superit401&ref=https%3A%2F%2Fblog.csdn.net%2Fhunter___%2Farticle%2Fdetails%2F85019938&pid=blog&mod=popu_376&con=%2Chttps%3A%2F%2Fblog.csdn.net%2Fjayandchuxu%2Farticle%2Fdetails%2F79113755%2C%2Ctop_0&ck=%2Chttps%3A%2F%2Fblog.csdn.net%2Fjayandchuxu%2Farticle%2Fdetails%2F79113755%2C%2Ctop_0&curl=https%3A%2F%2Fblog.csdn.net%2Fjayandchuxu%2Farticle%2Fdetails%2F79113755%23%E7%AC%AC-2-%E7%AB%A0-%E7%BC%96%E5%86%99%E7%AC%AC%E4%B8%80%E4%B8%AA%E7%94%A8%E6%88%B7%E8%84%9A%E6%9C%AC&session_id=10_1561430276375.632503&type=click\\\"}\"");

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
    console.log(this.responseText);
    alert(this.responseText);
  }
});

xhr.open("POST", "https://re.csdn.net/csdnbi");
xhr.setRequestHeader("referer", "https://blog.csdn.net/jayandchuxu/article/details/79113755");
xhr.setRequestHeader("origin", "https://blog.csdn.net");
xhr.setRequestHeader("cache-control", "no-cache");

xhr.send(data);

}
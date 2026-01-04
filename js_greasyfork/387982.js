// ==UserScript==
// @name         百度文库文档免费下载
// @namespace    wenkufreedown
// @version      0.0.3
// @description  可下载百度文库需要下载券的文档，不能下载VIP文档及付费文档，支持复制文库内的内容并包含格式转换功能，安装会替换原有的置顶功能(注：下载调用第三方网站数据，该网站首次下载需加群)；
// @author       wenkufreedown
// @include      *://wenku.baidu.com/*
// @include      *://wk.baidu.com/*
/************************************/
// @connect		 at.alicdn.com
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceURL
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_download
// @resource     woff2 http://at.alicdn.com/t/font_1319887_t5z5anzuox.woff2
// @resource     woff http://at.alicdn.com/t/font_1319887_t5z5anzuox.woff
// @resource     ttf http://at.alicdn.com/t/font_1319887_t5z5anzuox.ttf
// @resource     svg http://at.alicdn.com/t/font_1319887_t5z5anzuox.svg#iconfont
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @run-at       document-end
// @compatible	 Chrome
// @compatible	 Firefox
// @compatible	 Edge
// @compatible	 Safari
// @compatible	 Opera
// @compatible	 UC
// @downloadURL https://update.greasyfork.org/scripts/387982/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E6%96%87%E6%A1%A3%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/387982/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E6%96%87%E6%A1%A3%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$;
    var window_url = window.location.href;

    if(window_url.indexOf("wenku.baidu.com/view") == -1&&window_url.indexOf("wk.baidu.com/view") == -1||window.top != window.self){
        return;
    }

    var rightBox = addHtml();

    if(GM_getValue('isClose').state!="1"){
        $("body").append(rightBox);
    }

    //恢复下载功能按钮
    var t=0, num=0;
    $("body").click(function(){
        if( num == 0 ){
            t = new Date().getTime();
            num+=1;
        }else if(num == 1||num == 2){
            num+=1;
        }else if(num == 3){
            var tt = new Date().getTime();
            if( tt-t<=1000 ){
                $("body").append(rightBox);
                GM_setValue("isClose",{"state":"2"});
            }else{
                num = 0;
            }
        }
    });

    //隐藏显示功能按钮
    $(window).scroll(function(){
        if($("#activity-tg").css("display")=="block"||$("#activity-tg").css("display")=="null"){
            $("#activity-tg").remove();
        }

        if($(this).scrollTop() > 350){
            $('.func').fadeIn();
        }else{
            $('.func').fadeOut();
        }
    });

    //返回顶部
    $("body").on("click","#top-back",function(){
        $('body,html').animate({scrollTop:0},300);
    });

    //关闭rightbox
    $("#closeEx").on("click",function(){
        alert("关闭此菜单后，如果以后想要恢复可以鼠标连点此页面任意位置4次恢复");
        $("#activity-tg").show();
        GM_setValue("isClose",{"state":"1"});
        $(".cndns-right").remove();
    });

    //打开下载网址
    var downPageUrl = "http://121.40.71.144/api/jump.php?url=@";
    $("body").on("click","#dow",function(){
        var downPageUrl_reg = downPageUrl.replace(/@/g, encodeURIComponent(window.location.href));
        window.open(downPageUrl_reg, "_blank");
    });

    //打开转换网址
    $("body").on("click","#con",function(){
        window.open("https://zhuanhuan.supfree.net/", "_blank");
    });

    //打开复制页面
    $("body").on("click","#cop",function(){
        copyContent_all();
    });

    function addHtml(){
        //添加css
        var $style = $('<style type="text/css"></style>');
        $($('head')[0]).append($style);
        $style.append(
            "p{margin:0px;padding:0px;line-height:20px;}"+
            "a{border:0;text-decoration:none;}"+
            "a:hover{color:#ff5a00;text-decoration:none;}"+

            "@font-face {"+
            "font-family: 'iconfont';"+
            "src: url('//at.alicdn.com/t/font_1319887_t5z5anzuox.eot');"+
            "src: url('//at.alicdn.com/t/font_1319887_t5z5anzuox.eot?#iefix') format('embedded-opentype'),"+
            "url("+GM_getResourceURL('woff2')+") format('woff2'),"+
            "url("+GM_getResourceURL('woff')+") format('woff'),"+
            "url("+GM_getResourceURL('tif')+") format('truetype'),"+
            "url("+GM_getResourceURL('svg')+") format('svg');}"+

            ".demo-icon{font-family:'iconfont';font-style:normal;font-weight:normal;speak:none;display:inline-block;text-decoration:inherit;text-align:center;font-variant:normal;text-transform:none;font-size:24px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;line-height:24px;color:#999; }"+

            ".cndns-right{position:fixed;right:10px;top:70%;margin-top:-100px;z-index:100}"+
            ".cndns-right-meau{position:relative;}"+
            ".cndns-right-btn{width:48px;height:48px;border:1px solid #ddd;text-align:center;display:block;margin-bottom:6px;position:relative;background-color:#fff}"+
            ".cndns-right-btn span{color:#848484;font-size:26px;line-height:48px;}"+
            ".cndns-right-btn p{color:#258CFF;font-size:14px;line-height:18px;padding-top:5px;display:none;}"+
            ".cndns-right-btn sup{display:block;min-width:21px;height:21px;text-align:center;line-height:18px;color:#fff;border-radius: 50%;background-color:#ff6800;position:absolute;left:-11px;top:-11px;}"+
            ".cndns-right-meau:hover .cndns-right-btn span{display:none}"+
            ".cndns-right-meau:hover .cndns-right-btn p{display:block;color:#848484;}"+
            ".meau-car .cndns-right-btn {border-color:#258CFF;margin-bottom:20px;background-color:#258CFF;}"+
            ".meau-car.cndns-right-meau:hover .cndns-right-btn{background-color:#258CFF;}"+
            ".meau-car.cndns-right-meau:hover .cndns-right-btn p{color:#fff;}"+
            ".meau-car .cndns-right-btn span{color:#fff;}"+

            ".meau-top .cndns-right-btn p{display:none;color:#999}"+
            ".meau-top.cndns-right-meau:hover .cndns-right-btn{background-color:#258CFF}"+
            ".meau-top.cndns-right-meau:hover .cndns-right-btn span{display:none;color:#fff} "+
            ".meau-top.cndns-right-meau:hover .cndns-right-btn p{display:block;color:#fff;}"
        );

        //添加html
        var rightBox = "<div class='cndns-right'>"+
            "<div class='cndns-right-meau meau-car'><a href='#' class='cndns-right-btn' id='dow'><span class='demo-icon'>&#xe62D;</span><sup id='closeEx'>X</sup><p>立即<br />下载</p></a></div>"+
            "<div class='cndns-right-meau meau-sev func' style='display:none'><a href='#' class='cndns-right-btn' id='con'><span class='demo-icon'>&#xe636;</span><p>转换<br />格式</p></a></div>"+
            "<div class='cndns-right-meau meau-contact func' style='display:none'><a href='#' class='cndns-right-btn' id='cop'><span class='demo-icon'>&#xe63D;</span><p>复制<br />文本</p></a></div>"+
            "<div class='cndns-right-meau meau-top func' style='display:none' id='top-back'><a href='javascript:' class='cndns-right-btn''><span class='demo-icon'>&#xe628;</span><p>返回<br />顶部</p></a></div>"+
            "</div>";

        return rightBox;
    };


    function showContentBox(str){
        var ua = navigator.userAgent;
        var opacity = '0.95';
        if (ua.indexOf("Edge") >= 0) {
            opacity = '0.6';
        } else{
            opacity = '0.95';
        }
        var copyTextBox = '<div id="copy-text-box" style="width:100%;height:100%;position: fixed;z-index: 9999;display: block;top: 0px;left: 0px;background:rgba(230,230,230,' + opacity + ');-webkit-backdrop-filter: blur(20px);display: flex;justify-content:center;align-items:center;">'+
            '<div id="copy-text-box-close" style="width:100%;height:100%;position:fixed;top:0px;left:0px;"></div>'+
            '<div style="background:rgba(255,255,255,1);width:965px;z-index:10000;max-height:100%;overflow:auto;-moz-box-shadow: 2px 2px 10px #909090;-webkit-box-shadow: 2px 2px 10px #909090;box-shadow:2px 2px 10px #909090;"><pre id="copy-text-content" style="margin:5% 13% 5% 13%;font-size:16px;line-height:30px;white-space:pre-wrap;white-space:-moz-pre-wrap;white-space:-pre-wrap;white-space:-o-pre-wrap;word-wrap:break-word;word-break:break-all;"></pre></div>'+
            '</div>"';
        $('#copy-text-box').remove();
        $('body').append(copyTextBox);
        $('#copy-text-content').html(str);
        $('#copy-text-box-close').click(function() {
            $('#copy-text-box').remove();
        });
    }

    function copyContent_all(){
        copyContent_one($(".inner"));
    };

    function copyContent_one($inner){
        //提取文字
        var str = "";
        $inner.find('.reader-word-layer').each(function(){
            str += $(this).text().replace(/\u2002/g, ' ');
        });
        str = str.replace(/。\s/g, '。\r\n');

        //提取css中的图片
        var picHtml = "";
        var picUrlReg = /[\'\"](https.*?)[\'\"]/ig;
        var cssUrl = "";
        var picNum = 0;
        var picUrlLengthMin = 65;
        var picTemplate = "<div style='margin:10px 0px;text-align:center;'><img src='@' width='90%'><div>____图(#)____</div></div>";
        $inner.find('.reader-pic-item').each(function(){
            cssUrl= $(this).css("background-image");
            //在css中的情况
            if(!!cssUrl && (cssUrl.indexOf("http")!=-1 || cssUrl.indexOf("HTTP")!=-1)){
                var array = cssUrl.match(picUrlReg);
                if(array.length>0){
                    cssUrl = array[0].replace(/\"/g, "");
                    if(!!cssUrl && cssUrl.length>picUrlLengthMin){
                        picNum ++;
                        var onePic = picTemplate;
                        onePic = onePic.replace(/#/g,picNum);
                        onePic = onePic.replace(/@/g,cssUrl);
                        picHtml += onePic;
                    }
                }
            }
        });

        //如果还有img标签，一并提取出来
        var srcUrl = "";
        $inner.find('img').each(function(){
            srcUrl = $(this).attr("src");
            if(!!srcUrl && srcUrl.length>picUrlLengthMin && srcUrl.indexOf("https://wkretype")!=-1){
                picNum ++;
                var onePic = picTemplate;
                onePic = onePic.replace(/#/g,picNum);
                onePic = onePic.replace(/@/g,srcUrl);
                picHtml += onePic;
            }
        });

        //追加内容
        var contentHtml = str+picHtml;
        if(!!contentHtml && contentHtml.length>0){
            if(picNum!=0){
                contentHtml = str+"<div style='color:red;text-align:center;margin-top:20px;'>文档中的图片如下：</div>"+picHtml;
            }
            showContentBox(contentHtml);
        }else{
            alert("提取失败");
        }
    }
})();
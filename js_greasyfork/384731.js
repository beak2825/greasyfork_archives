// ==UserScript==
// @name         百度文库文档免费下载，文档内容自由复制；移除百度文库网页中的广告；解除大部分网站操作限制；全网VIP视频免费在线看
// @namespace    crack_vip_document_dissertation
// @version      1.0.2019060701
// @description  可下载百度文库免费文档和需要下载券的文档，不能下载付费文档，自由复制百度文库文档中的内容，移除百度文库网页中的广告(注：下载调用第三方网站数据，该网站首次下载需关注公众号)；解除知乎、360doc、百度阅读、17k、文起书院、逐浪、红薯网等大部分网站复制、剪切、选择文本、右键菜单的操作限制；全网VIP视频免费看，支持[腾讯视频]、[爱奇艺]、[优酷土豆]、[芒果tv]、[乐视视频]、[PPTV]、[搜狐视频]、[bilibili]、[AcFun]、[暴风影音]等等(注：VIP解析作者会经常更新维护，为更好的服务大家，因此要求大家关注公众号[关注一次即可])
// @author       crack_vip_document_dissertation_broom
// @icon 		 data:image/png;base64,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
// @include      *://wenku.baidu.com/*
// @include      *://www.wocali.com/tampermonkey/doc/download
// @include      *://api.ebuymed.cn/ext/*
// @include      *://www.ebuymed.cn/
// @include      *://pan.baidu.com/s/*
// @include      *://yun.baidu.com/s/*
// @include      *://pan.baidu.com/share/init*
// @include      *://yun.baidu.com/share/init*
// @include      *://www.bilibili.com/read/*
// @include      *://b.faloo.com/*
// @include      *://bbs.coocaa.com/*
// @include      *://book.hjsm.tom.com/*
// @include      *://book.zhulang.com/*
// @include      *://book.zongheng.com/*
// @include      *://book.hjsm.tom.com/*
// @include      *://chokstick.com/*
// @include      *://chuangshi.qq.com/*
// @include      *://yunqi.qq.com/*
// @include      *://city.udn.com/*
// @include      *://cutelisa55.pixnet.net/*
// @include      *://huayu.baidu.com/*
// @include      *://tiyu.baidu.com/*
// @include      *://yd.baidu.com/*
// @include      *://yuedu.baidu.com/*
// @include      *://imac.hk/*
// @include      *://life.tw/*
// @include      *://luxmuscles.com/*
// @include      *://read.qidian.com/*
// @include      *://www.15yan.com/*
// @include      *://www.17k.com/*
// @include      *://www.18183.com/*
// @include      *://www.360doc.com/*
// @include      *://www.eyu.com/*
// @include      *://www.hongshu.com/*
// @include      *://www.coco01.com/*
// @include      *://news.missevan.com/*
// @include      *://www.hongxiu.com/*
// @include      *://www.imooc.com/*
// @include      *://www.readnovel.com/*
// @include      *://www.tadu.com/*
// @include      *://www.jjwxc.net/*
// @include      *://www.xxsy.net/*
// @include      *://www.z3z4.com/*
// @include      *://yuedu.163.com/*
/*************** VIP解析 *************/
// @include      *://www.youku.com/v_*
// @include      *://v.youku.com/v_*
// @include      *://www.iqiyi.com/v_*
// @include      *://www.iqiyi.com/w_*
// @include      *://www.iqiyi.com/a_*
// @include      *://www.le.com/ptv/vplay/*
// @include      *://v.qq.com/x/cover/*
// @include      *://v.qq.com/x/page/*
// @include      *://tudou.com/listplay/*
// @include      *://tudou.com/albumplay/*
// @include      *://tudou.com/programs/view/*
// @include      *://www.mgtv.com/b/*
// @include      *://film.sohu.com/album/*
// @include      *://tv.sohu.com/*
// @include      *://www.acfun.cn/v/*
// @include      *://www.bilibili.com/video/*
// @include      *://www.bilibili.com/anime/*
// @include      *://www.bilibili.com/bangumi/play/*
// @include      *://www.baofeng.com/play/*
// @include      *://vip.pptv.com/show/*
/************************************/
// @connect 	 www.quzhuanpan.com
// @connect		 pan.baidu.com
// @connect		 yun.baidu.com
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_download
// @grant        GM_addStyle
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require 	 https://greasyfork.org/scripts/376804-intelligent-weight/code/Intelligent_weight.js?version=702787
// @run-at       document-end
// @compatible	 Chrome
// @compatible	 Firefox
// @compatible	 Edge
// @compatible	 Safari
// @compatible	 Opera
// @compatible	 UC
// @license      LGPLv3
// @downloadURL https://update.greasyfork.org/scripts/384731/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E6%96%87%E6%A1%A3%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD%EF%BC%8C%E6%96%87%E6%A1%A3%E5%86%85%E5%AE%B9%E8%87%AA%E7%94%B1%E5%A4%8D%E5%88%B6%EF%BC%9B%E7%A7%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E7%BD%91%E9%A1%B5%E4%B8%AD%E7%9A%84%E5%B9%BF%E5%91%8A%EF%BC%9B%E8%A7%A3%E9%99%A4%E5%A4%A7%E9%83%A8%E5%88%86%E7%BD%91%E7%AB%99%E6%93%8D%E4%BD%9C%E9%99%90%E5%88%B6%EF%BC%9B%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E5%9C%A8%E7%BA%BF%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/384731/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E6%96%87%E6%A1%A3%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD%EF%BC%8C%E6%96%87%E6%A1%A3%E5%86%85%E5%AE%B9%E8%87%AA%E7%94%B1%E5%A4%8D%E5%88%B6%EF%BC%9B%E7%A7%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E7%BD%91%E9%A1%B5%E4%B8%AD%E7%9A%84%E5%B9%BF%E5%91%8A%EF%BC%9B%E8%A7%A3%E9%99%A4%E5%A4%A7%E9%83%A8%E5%88%86%E7%BD%91%E7%AB%99%E6%93%8D%E4%BD%9C%E9%99%90%E5%88%B6%EF%BC%9B%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E5%9C%A8%E7%BA%BF%E7%9C%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$;
    var window_url = window.location.href;
    var website_host = window.location.host;

    //百度文库解析
    var baiduAnalysis={};
    baiduAnalysis.addHtml=function(){
        //只有百度文库才能通过
        if(window_url.indexOf("wenku.baidu.com/view") == -1){
            return;
        }
        //iframe中不再执行
        if(window.top != window.self){
            return;
        }

        //左边图标追加
        var topBox = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:200px;left:0px;'>"+
            "<div id='crack_vip_document_box' style='font-size:13px;padding:10px 2px;color:#FFF;background-color:#25AE84;'>下载</div>"+
            "<div id='crack_vip_search_wenku_box' style='font-size:13px;padding:10px 2px;color:#FFF;background-color:#DD5A57;'>网盘</div>"+
            "<div id='crack_vip_copy_box' style='font-size:13px;padding:10px 2px;color:#FFF;background-color:#FE8A23;'>复制</div>"+
            "</div>";
        $("body").append(topBox);

        //提取目标文档标题
        var searchWord = "";
        if($("#doc-tittle-0").length!=0){
            searchWord = $("#doc-tittle-0").text();
        }else if($("#doc-tittle-1").length!=0){
            searchWord = $("#doc-tittle-1").text();
        }else if($("#doc-tittle-2").length!=0){
            searchWord = $("#doc-tittle-2").text();
        }else if($("#doc-tittle-3").length!=0){
            searchWord = $("#doc-tittle-3").text();
        }

        //为每一页添加复制按钮
        var onePageCopyContentHtml = '<div class="copy-one-page-text" style="float:left;padding:3px 10px;background:green;z-index:999;position:relative;top:60px;color:#fff;background-color:#FE8A23;font-size:14px;cursor:pointer;">获取此页面内容</div>';
        $('.mod.reader-page.complex, .ppt-page-item, .mod.reader-page-mod.complex').each(function() {
            $(this).prepend(onePageCopyContentHtml);
        });

        var defaultCrackVipUrl = "https://www.wocali.com/tampermonkey/doc/download?kw=@";
        $("body").on("click","#crack_vip_document_box",function(){
            defaultCrackVipUrl = defaultCrackVipUrl.replace(/@/g, encodeURIComponent(searchWord));
            GM_setValue("document_url",window_url);
            window.open(defaultCrackVipUrl, "_blank");
        });

        var defaultSearchWenkuUrl = "https://www.quzhuanpan.com/source/search.action?q=@&currentPage=1";
        $("body").on("click","#crack_vip_search_wenku_box",function(){
            defaultSearchWenkuUrl = defaultSearchWenkuUrl.replace(/@/g, encodeURIComponent(searchWord));
            window.open(defaultSearchWenkuUrl, "_blank");
        });

        $("body").on("click","#crack_vip_copy_box",function(){
            baiduAnalysis.copybaiduWenkuAll();
        });

        $("body").on("click",".copy-one-page-text",function(){
            var $inner = $(this).parent(".mod").find(".inner")
            baiduAnalysis.copybaiduWenkuOne($inner);
        });
    };
    baiduAnalysis.showBaiduCopyContentBox=function(str){
        var ua = navigator.userAgent;
        var opacity = '0.95';
        if (ua.indexOf("Edge") >= 0) {
            opacity = '0.6';
        } else{
            opacity = '0.95';
        }
        var copyTextBox = '<div id="copy-text-box" style="width:100%;height:100%;position: fixed;z-index: 9999;display: block;top: 0px;left: 0px;background:rgba(255,255,255,' + opacity + ');-webkit-backdrop-filter: blur(20px);display: flex;justify-content:center;align-items:center;">'+
            '<div id="copy-text-box-close" style="width:100%;height:100%;position:fixed;top:0px;left:0px;"></div>'+
            '<pre id="copy-text-content" style="width:60%;font-size:16px;line-height:22px;z-index:10000;white-space:pre-wrap;white-space:-moz-pre-wrap;white-space:-pre-wrap;white-space:-o-pre-wrap;word-wrap:break-word;word-break:break-all;max-height:70%;overflow:auto;"></pre>'+
            '</div>"';
        $('#copy-text-box').remove();
        $('body').append(copyTextBox);
        $('#copy-text-content').html(str);
        $('#copy-text-box-close').click(function() {
            $('#copy-text-box').remove();
        });
    };
    baiduAnalysis.showDialog=function(str){
        var dialogHtml = '<div id="hint-dialog" style="margin:0px auto;opacity:0.8;padding:5px 10px;position:fixed;z-index: 10001;display: block;bottom:30px;left:44%;color:#fff;background-color:#CE480F;font-size:13px;border-radius:3px;">'+str+'</div>';
        $('#hint-dialog').remove();
        $('body').append(dialogHtml);
        timeoutId = setTimeout(function(){
            $('#hint-dialog').remove();
        }, 1500);
    }
    baiduAnalysis.copybaiduWenkuAll=function(){
        baiduAnalysis.copybaiduWenkuOne($(".inner"));
    };
    start_pan();
    baiduAnalysis.copybaiduWenkuOne=function($inner){
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
                contentHtml = str+"<div style='color:red;text-align:center;margin-top:20px;'>文档中的图片如下：(图片可右键另存为)</div>"+picHtml;
            }
            baiduAnalysis.showBaiduCopyContentBox(contentHtml);
        }else{
            baiduAnalysis.showDialog("提取文档内容失败了");
        }
    };
    baiduAnalysis.download=function(){
        if("api.ebuymed.cn" != website_host){
            return;
        }
        var sendUrl = GM_getValue("document_url");
        if(!!sendUrl){
            GM_setValue("document_url","");
            $("#downurl").val(sendUrl);
            $("#buttondown").click();
        }
    };
    baiduAnalysis.init=function(){
        baiduAnalysis.addHtml();
        baiduAnalysis.download();
    }
    baiduAnalysis.init();

    //百度文库广告移除
    if(website_host.indexOf("wenku.baidu.com") != -1){
        var removeBaiduWenkuAd = {};
        removeBaiduWenkuAd.strt=function(){
            $(".banner-ad").hide();
            $(".union-ad-bottom").hide();
            $("iframe").hide();

            //VIP去广告小按钮
            $(".ggbtm-vip-close").hide();
            $(".ad-vip-close-bottom").hide();
            $(".ad-vip-close").hide();

            //搜索页面
            $("#fengchaoad").hide();
            $(".search-aside-adWrap").hide();
        }
        removeBaiduWenkuAd.strt();
        setInterval(function(){
            removeBaiduWenkuAd.strt();
        },300);
    }

    //如果与文档相关，则执行至此
    if(website_host.indexOf("api.ebuymed.cn")!=-1 
       || website_host.indexOf("www.ebuymed.cn")!=-1
       || website_host.indexOf("wenku.baidu.com")!=-1){
        return false;
    }

    //VIP解析开始
    var vipVideoAnalysis={};
    vipVideoAnalysis.judgeVipWebsite=function(){
        var isVip = false;
        var host = window.location.host;
        var vipWebsites = ["iqiyi.com","qq.com","youku.com", "le.com","tudou.com","mgtv.com","sohu.com",
                           "acfun.cn","bilibili.com","baofeng.com","pptv.com"];
        for(var b=0; b<vipWebsites.length; b++){
            if(host.indexOf(vipWebsites[b]) != -1){
                isVip = true;
                break;
            }
        }
        return isVip;
    };
    vipVideoAnalysis.start=function(){
        //只有判断成功才执行
        if(vipVideoAnalysis.judgeVipWebsite() && window.top == window.self){
            var is_pull = false;
            var pull_websites_string = GM_getValue("pull_websites");
            var pull_website_time =  GM_getValue("pull_website_time");
            if(!!pull_websites_string&&!!pull_website_time){
                var nowTime = new Date().getTime();
                if(nowTime - Number(pull_website_time) > 1000*60*10){
                    is_pull = true;
                }else{
                    is_pull = false;
                }
            }else{
                is_pull = true;
            }
            if(!is_pull){
                vipVideoAnalysis.loadLocalWebsite(pull_websites_string);
            }else{
                vipVideoAnalysis.pullWebsites();
            }
        }
    };
    vipVideoAnalysis.loadLocalWebsite=function(websites){
        try{
            var serverResponseJson = JSON.parse(websites);
            if(!!serverResponseJson){
                vipVideoAnalysis.addFilmHtml(serverResponseJson);
            }else{
                vipVideoAnalysis.pullWebsites();
            }
        }catch(e){
            vipVideoAnalysis.pullWebsites();
        }
    };
    vipVideoAnalysis.pullWebsites=function(){
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://www.quzhuanpan.com/browser/tampermonkey_analysis_vip",
            onload: function(response) {
                var status = response.status;
                if(status==200||status=='200'){
                    var serverResponseJson = JSON.parse(response.responseText);
                    GM_setValue("pull_websites",response.responseText);
                    GM_setValue("pull_website_time",new Date().getTime());
                    vipVideoAnalysis.addFilmHtml(serverResponseJson);
                }
            }
        });
    };
    vipVideoAnalysis.addFilmHtml=function(serverResponseJson){
        var innnerCss = "";
        innnerCss += ".crack_vip_film_box_url{position:relative!important; background-color:#ccc!important; border:1px solid #ccc!important;font-size:13px!important;}";
        innnerCss += ".crack_vip_film_box_url:after{position:absolute!important; content: ''!important; width:0!important; height:0!important; left:-8px!important; top:6px!important; border-right:7px solid #ccc!important; border-top:7px solid transparent!important; border-bottom:7px solid transparent!important;}";
        innnerCss += '.line_choice_a_xs8c{color:#000!important; font-size:13px!important; text-decoration:none!important;}';
        innnerCss += '.line_choice_a_xs8c:hover{color:#FF5C38!important;}';
        $("body").prepend("<style>"+innnerCss+"</style>");

        //左边图标
        var vipImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAgAElEQVR4Xu19eZwcVbX/91R3VRYgBCQkJF3NlkxXG0VADYjwgKcgokRQUEgQxOUnguK+4b6gz12fsogGeEIiIiCLsihCwMfOk0WgazJAQlVPCItsCTCp21Xn96meGZhMerlVXd1dVd31Vz6Zc84959z77ap771kI/afvgb4H6nqA+r7pe6Dvgfoe6AOkvzr6HmjggT5A2rQ8zLkoUFZd5DEVCSgCvBHg++Hh5sxw5ZYFwMY2Dd0XG6EH+gCJ0JmrZ2HOyNTssQR6P4h2qyeawQ4Bd4Hpeva8q4zhym0EcISq9EVF5IE+QCJw5Cgw1J8RcBSIMoFFMh4G4VTDci4KzNtnaKsH+gBp0b2r8tm3eqBLAJrRoiif/eIZFef4uWvxYgSy+iIi8EDPAISBzGAuexCI3gaiAWYsAPFOYKwH6N8gfooYJjFu9UC3GWXnAQK8Rj4u5TLvIVL+EOqtUf/765qC7byTADeC+e2LaNEDqQfIQ3Ohi4z2MRBOIGCOrL+Y+ektWeT0Ml6qxfNQDvMFqfcS0XRZmbJ0zPyzoi0+I0vfp2ufB1ILEDuHaS8q2hcY/CWApgZ2IeNKw3YW1+Mz89pfABwaWK4sA7uHG7Z7uSx5n649HkglQEq57AFEyvkg5MK6jdg9omC7l9XiH8prC13g/rCyg/Hx88y4B6CbM+TdsGWlcnN/jxLMg61Qpw4gZl47isHLCaSGdgzzUwVbzK63BzF19XQQnRRafguMDBYE3AGmleR5N0ynyi31PgNbGKbPOuaBVAHEzKunAPSLVmeXmX9StMXnaslZvROmbvTUdQBt3eo40fDzCEB/BrvnG7Z7RTQy+1LGPZAagFQ/qxTlhkimtuIYxloM1pJVymlLSMHySMaJWAiDryMWxxs21kYsumfFpQIg62Zji2emaEME7NDqTDLz7UVb7F1/c67+HaD/bHWctvEzP5XxxB4LhlFu2xg9JDgVADHz6m8A+nAU88bgjxYtcXbNt8cc7ESq+giI4u63El509jKe8u94+k8rHoj7RDe1zb+PqJA6CCKlKXFTAh6ZuVFsN+dxvFATIHntWwR8vamYeBD80LCcL8ZDleRqkXiAmLq6HERLopkCPt+wxHG1ZDFAg7pWBmFuNGO1WwqPwOV3THEqD+78JNa1e7S0yk80QIZ07OpCXRXN2wNgzzuwWK6srPn20LMHEynXJnMh8HNguonA12rrxfKdn8WzybSj81onGiCDunYaE06NyG1rDMvZue7mXFf9mKv3RjRWF8X4eSl0BXnuuQNl96/9mK/GU5FogJi6ZrdyW76Jaxg/Nmzn87Xc9fA22NrZSn2ypcvHLkKi3tAMrCPGbzMvOD9a8DSej6GKXVcpsQApzc3uQ1nl5qg8yOwdUrQrNT+horqAjErXqOX4gZkEfKVgi1/3E7c29W5iARJluAczV7K22LJeGqypq3eC6A1RL8zYyWM+17DFB2OnVxcVSiRA/NwOM1/95NkmCt8xwyrazo61ZJnbYStMU59LwN1HFK4Ae/yJYln8KhJhKRCSSIAM5jKHspLxw80jeRj8z6IlXl/z9CqnvZYU3BfJQAkQ4ufLA/xN8hQLirdmC6/yz14OhkwkQMy8egFAS6Nbb3yLYYk313yD6OobQHRndGMlTBKzn9n4TwbOMGxxAQGVhFnQkrqJA8hYNO0zoZKg6h/nPGzYzvzaAMFckDbckpdTwszAowrzDxVbLOuVskWJA0hJ144hwooo15yfY1G0hFZPZqTHyVEq3iVZDH4cHk7LlsXZaQdK8gCS164k4J2Rr40GIe6mrv4MRJ+KfMyEC/TfKBnXPXlg2I1sPxg3lyQKII/msc1LrD4ZaRWRsRlh9j5ftCs/rjVBD+ewQCjaqrhNXmz0YXzXsJ2vxUafCBVJFEBMXT0RRGdGaP8ropj/17DFfvU/s9R/gGjftoydCqH8KcMSLWdzxs0VSQNIWxep6jkDu5YxVHOzntOWQsEFcZvA2OjD/BIcsdB4HKtjo1MEiiQGIEPzkHMzmh2BzXVFNMpFHwKmVHR1mIhe1U4dEi2beZlhi0gS1+Lih8QAxMxnvwgo/9VOxzHzvw1bzKl31m/m1U8C9PN26pBk2f4lY9YRuQXr8GSS7Zioe3IAoqv3gei17XY8e1haLDs1j5EZUAfz2r2otjPoPzU94PGHjbJYlhbvJAIgQ3nt1S7wQEecznyXYYs31hurmuKrqHcCNLMj+iRsEAb+XLScwxKmdl11EwGQUk77Pin4UqecrsA7aMCqXFcXJNV6v+oFRPQfndIpOePwSMESW6UlJCURAOn4TTbzvwq22LPZJPu1uEDKJwBeTETZ5CziNmvK/EbDFne1eZSOiI89QAbz2X0Zyj864o2JgzC+Y9iOVAWToTmY5WrqUjA+2Il9Usd9EXBABd7BA1blbxPZ/Cr7lYz20Sw7580v46GAIrtGHnuAmLp6Bog+1nEPMa41bOeQoOOW8urrwTiBCEt7dZ9SKztzVU7dy1Potqo/me9gxvnTFbF8RwvPBPVxJ+ljDZCoE6OCOZb/bljircF4XqF+ANCyuvZuj2AQ89ZMdDABrw4rL0l8inBePfAYShN1NnPZQ6AoV2/6kmZBTFczu7/zyu6VCwEnbnbGGiCr5mXe4WUyf+6K05hXGrY4MKqxfcAouvZ7Irw7KplxlMPAY0XL2ax22GBePZ5B59XX2S9NhOVwxX/Xq4vcDXtjDZBoi8IFdC/zPwxbRH5K5fc0dKF8kpjf3o6gy4BWRk5O4F8WLHHKZMElXT2PiI5vOiCzx6DLsi5/d8FacXdT+jYTxBYgbUmMCuBMBt9atMQ+AVgCkQ7OxXacUY8CcAyAfVOR887saRWxyy6P4dHJzjB19QkQzQrkJOYzp2TEZ3Zeg5FAfBESxxYgXW8zwHyHYYu9IvR1XVF+nFlFyb4PRMcQqGZufCf0aH2M2qVb/YMLAoU99h3MAO9ZYDmduSie5ITYAqTtPQCbrAYG/1/RElKlfkp57UowryGPLy0MV25s1h230dCleRhQKHu0R8pSIgy0vmg7JIGZVRaFWtHQpbz6awL9v7CaMPOLCnBAwRYdrw0QS4C0MzFKepKY7zVssbsMvamrd4BoNDyF+SmAzssQzmv1V29wnvo6VrAnMeueomTAfHJco4kZuKRoOUdO9pd/R1TR1DKB6qY0y/gY4GfZFXsVh9HRxLVYAmRQV09iotPlHNceKma+v2gLqeDIkq7eSkSbNd3xZRDxiYZViaQCZGkOdoKmXhy7zzBmJg97FIaFH8i5yWPmNT8CO5o2DIy1GeHs3slo4VgCxMyr/wtQzTI87YFDTaklw3Kk7i1MvUm2IfMdAM7KvCAuabUGLgPKYF57D5hPAtEBHfRH/aGYzzJssdllbrXo3nR1GKCtItOzw9UfYweQTiRGyUwWM4aKtiO1BzB19QaZxernSxDTNWBcNFM4l9Vr1COjn0+zehbmOFO1/Rl8AIj270oYPvO/pmTEolonTaV89ssE5Xuy9sjSEfOiTu1HYgeQdjlV1vkT6B4xLGdXGT4zr14H0FtkaMdp/Au17AbHaPWNMnHMh2Zj+8oUbX9m9sFyABEtDKJTCNrBbMU5aP5abJbpWT2md1Ur8NGuhBKNKmFKsAciiSFAtAeiC8ng55hxtUK4RnHEVePfrn63qHIO22xgbKco2dlMtCcz7Q/iA8br/Taq17vZd7auXQPC22Q979fhgsv7F4crt8ryhKGzc5j2AqkLmXlLIt6aoZwWCWj8aouMX80U4iv129W15+0x7gfF5T0GhsU9YfwShCdWADFz2m5QsNlGL4hB1aJmjBVgvsIoV/4RpEGMDxxTzx4MKB8FYc+i5ewkM3bQI+lGWYsy44Wl8fcvZk47mhT+EBgHhrmc9H+9yaMTjLJTt17xIztgR0dV721rL3nmnxu2+HRYX8jyxQsgLZ148How/2imU/lpq9/2vvNK8/Cq4jD+LeNIU9cuB2GxDC2AWDTXtHPY9gVkFxGwyFOURWB+ExFtW9cG9ttK8/cKtjirUQ8R32+kaLeDIPV5KumzGmT8RMESO7Ry5yQzdmwAMtYk0wrVMYr5DPbE12UXtIxjgtCUdO0SmSBEPx3VsJzFQZrU+Hnwpq76lQv/TR6fbQxXbgiiWxBaczZ2Jk1bxMT7gLEbQM8DXCbCHQOWWN4sgcwPn/Ey6spIPuMkFGfH2bm4DmskSEOTxAYgg3p2PyblpiCW+C3EFNc7tjBc+XsQvqhpzbx2EQA/rqr+w3zfFiz2DtpKYGLAJoOfMSwxmwARtQ2tyhvKawsrjEs7efvfqCtYq/aM88cGIKaungWij8oaxsw3Tl0vDo9Dx9aSrq4gIj/osObjA3nqS84eQdsxm7ns56EoPxwXyuCzi5aQ9pGsL1ulGy2HhB8ANKVVWUH42eNTimXxyyA8QWljAZAQiVGlzAZn7yBHpEPbYoY3PbOvB2VXIuzCRPMJGGEPD0Fxb9664l4/dy1eDOpAn36Vnv0PD8qpAB88eePrxxER05sabWprjVnKZ95JrFwxUR6x9x8FuyKVfjyoZz/jkTKDKs7v25VfYep+z/hqn/ruXFgyTjNs56th5kyWJxYAqS4GZK6UUpr5qYwn9lgw7G8aGz+j9wLq0QAWM2P/xoUVeASMS+HxssJw5YYg+4RxLapFrkk9CYQPAjTD/39iHFOwnQub6Trx79XTPOLbQDTt5f9nlA3b0WXkrNoBRU/VHhyl5ZHMBjE7yI+JzBg+zWAO8zyqvj0jz5uR0YHgfblgVdpaTDAeANHV3xORv5CbPjK/oo9sj9liqvoVBj4SstHOarB3LnHlnEIZgZvnrJ2L6esVdSmDtzHKlZc/kZoaN3Y7PjJNu5uAORPpmfH9ou1I9YSfWCaJmW8q2sK/OGzL4x+urMpnv8hM3wtzbNyKUp3op9h1gARLjOILDEu8v5FTTT2zmKGc2/DIUnZWmD2A/grPXVYYdi9v9+Z47GLPf3PsNlnFDLBwgeWMvRXqGzB2Guj3j59XfYN5/JFCWfxW1uSwdP5XAFj5AxFNDysjKF8n7pO6DhAzpx0LBec3dw6vp4rYpbAWT9WjbZ733HyUehR+3V4Czs8Q/UZmoQYdqXpJmdeuqNUciMF3Fy2xp4xMv1YXKUr1KNi/sfdeEtsufBIbZHhbpamWaGK6qVNvkgw78xfYeLhVvRvxdx8gunYVCG9vaiR7Xzfsynfq0Znzsv8Jhf7akTxv5juZsIxeFCuMp7C+qe4SBGZe+wGAL9QiZfY+V7QrP5EQA1NXl4FovNf5xYblND5+lhEagMbUte+A0NaN8xj4nylaov7FZgCdYwsQ6cQo5pemkZhXr4bSaGsCbRUR8hH5RU6M3xODcHHG42ULypUb5Zg2p2qYXszMWUfMmf84nmgm3/9cHXHVJ4loyyotu4cbtnt5M74o/179TFTUtR2oCfZHw3LeG6XutWR19Q0yqKsnM1HzpvXMfgvik+t/WmW/xFC+325nNZLP7FcL9M6dOlI5J8h9R2le9k3I0I0EUmu+PcDXFS1xkIxtZl7zF8wfRmn52YIltpfZN62eiZkbt9IeYPBNxLguw+JamVPC+vOhfYOBb8roHJrGw/uNstP2hkZdBYiZV28GqHHlEGaGI3at17mo+vbIq4+NR+GGdnhUjMwuE12jeO6ygbLrNxxt2Fe8umcgur7edzszn1C0RYN6Uq8o7ufGv7yHYT7TsMVJMmaZuvoxEJ2xKS3fw6DLp77knBUE8L4MP2QFU7RHZMYOR8MjUxSxTSeqnXQNINKJUYzLDds5vJ4jzZz6ISjU9lOaUBPp56cTLWPX+VGjOLHBXPbrrCjf2nwMHnFfErNkNtmjbwHVHy8z+nXl7SMbTl8vZbgqh7lCwCUE/CRIkpKZr97DtKePCvMfDFtIXQuEmrcJTF0DSEnPnkqknNbMgGb3HmZe80tcGs3kdPfv7G/kv25YomZ3qtETLPVmAr1pEz0DLIRSTv04KTQediGf7CX7a8/+Az+0o/knsX+JqKvnMtEH2uJ3dt9l2O4VbZE9SWjXAGLq2kNNQ6KZ7zNs8bp6jliVzx7kQflrJxwVxRh+NO/WFed9tUJaalWxZ7iHFS1XqvSqqau3g2hR9Vcf+FbRcqT2AKW89i0CpKrY+ynDU58Xs2Xi3ybHkUXhv1HbOhuw2RWAVMvZZKhpNlizMA1T9og4qtmJRs5VBcs5rFYew8TEq7GFMEsm4WtVHrt40F6+D1Dg7DpgQWoPYOpaefxSUco81z3KGHYvbkZr6uoJIDqnGV3QvzP4N0VLhK6xFXS8rgDEzGt++MXnGyrLGC7YTr5eQszgXBicUR/s1KVUUMc2oa+ZNDWoZw5nyvypytvk5G6ifFPXvg3C18b2DLcVbbHpp1odZcL0XpG9vR7UtfcxIVAMmoyP2fMOLJYrK2Voo6DpCkBKeW0NATs2MqDZ5Vir1fqicF5oGf7XPPF+k+tl+RXgM7r6rB+kGGSTPfEtQMwnF2wx6USqtqZhfMjsva1oV5p+1rYnqqGaReh3IebQvg/I2HGA+KU1KaMNNtaT1+NFMa/eLXU1XXT0Mqqj+QcBfdvERFxt2M6hk4mq2YnAItnI3U3eAszulPViO5k9wlim4tMvXyrKGveiM0MmemBQVz/NRD+VFStD16iPvQx/GJqOA6T2mfumqjPzz4q2+Ew9g0w9+1WQUjfsJIwjOs7jVyNkoU+OFq5umhkk2/5tk0QzxhWG7bxLxhZzXuZIZDJ/lKEdp2HgL0XLeacMj6mrp4NI6h5GRp5Pk6nw6xesFf+UpY+CrhsAORNEJ9ZVntkjFvl6YeYMZAfz1Wp920fhgK7KqLHh9YM3FcW5RWaTPdq3XX1iQljHew3LkVr01VMmou8Hi13z9pUto1rKq7dsdmzdirMZDxu2M78VEWF4Ow+QZkXWmC8ybPG+esYM5tXjGPQ/YYyNHU+NRqF+fJps375Vucy7PSVziW8XM28wbLGtTGjJuB/Ge5QwcDQB+zU68AiSj7JuNrZ4VlOfCwa+xrNDnveNQrny7U7PYccB0ujW1jeePN6rUBZ+Lduaj6mr94Co7t1Ipx3YynitflOXdM0vknBEVQfmZYYtPhxWHz99lpA9mkELGZhP5F++0vbM/AKBzizYzhdlS+wM5jJHsJK5NKwutfg6Edpea9zOAySv3lW/OjnfbFhi37rgmJc9EBnl+igd301ZzPzToi0+G0YHP7RkZIb6xHiQY8bzDmglojiMDvV/xLTLQJDaC0mN28FmRpP16ThAGtWxJc99d6Hsjt4D1HhMXbsChMOknJoEIuaPGbY4K4yqpq6eCKIzR98e1TsjvZPHn/V0fnBH7ECsPlovOjmMrQB/yrDEL8LxtsbVeYDo1SoYS2qovbpgOX6lEa+WSdXbYlYfSujFYJ1Zkt/0ThYwsUVEkP1Ba8ulOfekhK3mDM0oAuTDNBMV5u9dAEj2KyDlu5OVbZaAX9LVXxFR3ZyQMMZ3k8f/tjdsMbNZOHwtHf1qIqxoL1d1qdWXvBu2VXsRMu6M8keMA+TDtMPmzgOk5j6C12/hidn1qg76jVh4mrqukwUB2uHsiTKZ+cKiLeoWm2s0/sTw+E62Amik08PbYGtnS+2+yLM6mT9o2OLcds9HPfkdB0j1BjevPj4xwYk9/Fex7Hy5npJmPvtFQGlr/aNOT0ArZTPNfDUwcRdfZ2L+TMEWP+u0/hPH89NsN5B6NY028Yns6XTRiVqKdxwgvhKlvHo2gT7i/9tPyFEdMa9eznX1YlDXVocqah3ZVEUtiO8xLLFHGKmrcupenkK3VXmZ3awj5srkq4cZS4bHr1jpbqle3TQzVEbYJBpmXFq0nfeEYI2MpSsAeVDXXqMQ/jVmRcPk+5KuHUOEFZFZHANBisd7D5TF7WFU2WQvxrjGsJ3mFWH8NNh89s2AsjhT4QsXrBV3hxl7Ms9YP5fLAOwchbzJMthzjyyW3epFaLeergCk+hbRtWuJcDCaZIel6WJw7Ff/JMMWo8ezAR+/hvFgXvXbTM+ssno41ig7y2XEmHn1dwBVi+75hb+J6PSC5VwW5OZ9fJzRKjLZz4Lom9Ee575iSZjIABk/BKXpGkCG8tqrK8y3Z22x3QJgYy3Fw+QrBHVAp+j972lifDIsOKo/KvnMYYTMWKqpfOGCetUrmflpACtA3rX0ontjsyhdP9HNy9ARYP54u/u1E/N5BVuc0Kn5qTdO1wDiKzQ4L/uWRr09Ju5Vuu2oVsb3KyPCo+OLZWf8szKUuE37kPD5hiWOkxEkVb2S2WPCPcTkd5Lyiz/43bUY4G2Z6VVE2L1dn1K1bFDgHTxgVf4mY187aboKkGaGlXT1qUh/qfxau0zHFcqOXzuKVuWwvaeoczKuN8dTlNkMnqMQzWHQHGaeDdAcIp4zXqm9mb4T/+7/OhPR39nzzogiA+6BWdhSmaY+Pf5JE2QBvfw5G8SArtJWE6PmyqQbt1vN2AIkioaemzkvZONH/yStnMOMDRXMoKw2QyFvpstQak1OFuCMW1mzy2N4NMrJ26S8EfOTBbvaaappZl21BYSmro0ysjZKu2rK8vgXRll8qu3jSAwQW4CU9OzbiJRrJGyQJ+lCKU555RpTlvRq77/qPUOQKGC/kQ6TIlXXNypdW5XTLKK7VflB+GMMkOiPdxneqUWr0tUSpUEmZ5y22hAnqz4wHsKRqfCeske1Zl69GyB//5CMp0uJUfWcE2OARP8G8duhKfCWFmzXP7vv6LN6FuaMTNUO1Ni5a9cyhoIMbuqvhI/75YBkq5pv2mkqyIhdpK2RRNZFbRBbgEwOyIvSScxYBfCtRFwCc4k91zSG8XCUm8KhOZjlatoBYD4QRAeOV39k5vs9W7x+IeA0s2kshOMsInr5tIqZHyja4jXNeP2/my31nZcZIXqabiVGJe4NUp1gXRsG+Y0i2//4VQMBesi/boAPIGq+gCdoReTx1lCwLYO2AfNOBCysFdVKjO8N2M7XJof1D+raaUze83BxBxTeCqDXMdHJBJo90Xr/dMywxXbNNuiTO02134OtjxCkUVDro8lJiO0bxFd/MN/9tgZybpSjalR0TarS/dgwDHdx0XIbNj1tyyGHnJmhqZi9zxftyo9DC2gDY6wB4oe5Y3q1gslWbbC9syKZf23YomY1l2qle0V9FEQ1j443V5TvcS2xV73PtLGI6dsIJNW2rbOOqDNalxOjEvmJVf3M8svTKEqgTrGxmPAJSvjJUYordqrXX9HU1XNAFCiswo+nykJ8aHKPPr/D7vMZ7fcgLI6bHxrp49tTtEV3+q03UCzWbxBf72rtJ10rNa0EH+fV0KDiyMS6ukFN8OO7wDgbzBcDylwifjMTHUHADkFldZuewR8tWuLsbusxefzYA8RXeFU++1YPStfjcsJOXq3wdr/+1YtQLyLQW8PKTQufD/TpELNl64F10u5EAKT6qZXX/gJgs1q2nXRWmLH8I+Wi7RQm85p67dz8MGMknodxpWE7sfwkTAxAhnTsWiG11K78g3YtMvbY78o03vmpOsxYT/TVzSrct0unuMklxtEFuxpAGrsnMQAZe4s07ysSKxfzRnW9mL3rM3huololPXswkXJtrFTtmjLyeS3dUDFRABk9oVHXgGhWN5wVfEy+wLBENYtv4mPmNb/A9JHB5aWRo7aP4mJpogDiO62kqx8goq6VgQkycQp7+w/YlZsm8vgFo72sujZpn4pB7A5CS557aKHsXh2Ep5O0iQNI9VMrAQWs627OU3CvE9UCDdKHMaoxg8pJJEAGc+oiVihUVZCgDgpLXy9soqRrg0QYCCs3VXwB+jB2y+5EAmTsU+s8Ijq+W45rNK5/rq9UxNzJN+dDuez+rqJ0rAFlHH2zqU7haxN3yrbEAsQPJ6+o6ppYliOt0wTIzKsXALS0U5Mb63EYZdk+jN20I7EAqe5FYvo9T+weMTkpy69dK7ZSH09049EIV2qzcrMRDtWSqEQDJK5xWlOed7aZ3GnWzKunANSVHhctrZA2MbOH3Votg9Qm1TYRm2iA+JYM5jKHspLxw1Bi8fi1hou2UCcrU9KzpxLRFwDaOhaKdlEJBh4sWs7CLqogPXTiAVLdsOfVv8Up6G8Lz5leq5XDA4CW1TOHMmWWAHwYQFOlZypFhEkqnpEKgMQuTsv13mIMVxr2UvSTwWi6eoTHtJTAb0lU3aoWwZpxHX3BMF5uANSiuLaypwIg1Q27rv0IhM+11VuSwoOW7feLuwlVfR8IS4hob8lhEkrWuFFr3IxKD0D89Nxp6sNxidMi8HEFS5wfdMJHezFmj2Eox6XxQpGYTy7Y4oygfukWfWoAUt2LxCpOizcCdJxhOReFndxV89TdvQwtAWNpp6q7hNVVhs8/wJhOYvs4JkbV0z9VABn91FLvAdHrZCasEzTMfBsBZ7sj4o8Ln8SGMGP6+SNDenY/D7SECe+d2L4ujLxu8cSlpUEQ+1MHkPjGafEIQH8mz11RKbt/kSkcV2siRyuWZA4BK0sIeBeIpgWZ8K7RMntZFoX5Zfi1xxLzpA4gY59asY3TGl0Z/CwYl8DjFYXhysp6veGbraJ1s7HFs6p2OBQsYeaDiSjbjKd7f5fvZ9I9HTcfOZUAiXWc1qQ5YOAxMF9IwArDFneFXRx+ngln1KNAWArGPlH2Kg+r08t8jOEp653XTI4uaFluBwSkEiDVvUgu+wUoyg864MPIhmDGkEJYnvGc5a18ijyyA3YUavYYZloCotdGpmAYQcweAXsXbHFnGPZu86QWIHGN05KecOa7/LeKNiJ+v/OTWCfNN4nQ7yhMgL9fORYEPayc8Hz8acMSPw/P313O1ALEd+uqeZl3eJnMn7vr4hZH99vGEVaCsVzdIC6ZXABCVnq1mHU+uw+YljJwHBFtIcsbli6OtZx3Fm4AAAfbSURBVHaD2pJqgPjOiFucVtAJ2pSeNzLTVf5JWGbYvbJed+BmY5g65jK0lURY0Iw27N/Z408Uy+JXYfnjwpd6gMQuTiuymefnmfEngFcYduW6oCdho62htcUMvB/Mh0R4AmYC3ocNq3JzZKZ2UVDqAVLdsMcoTqsdc83gxwn4g+JhxUBZBM7Vr576ZdWjiXAciN4QRscxHb5XsMTpUTYiCqNLlDy9AZCYxWlFOYE1ZD0Cxgr2nPOLw34nrWBPaR4GSNGOBfFbmLGo4ZuF+SkA1xPoTwO2cwkBItho8afuCYCMvkXUE0B0TvynJEoN+R5mXk6orDBsrA0q2b+IfEbNvlEhZY7HPEtRaFsPIAI/Qy5WDgyL+5p1ugo6ZtzoewYgYxv2dZNbmsVtQtqiDzMzcFP2BbF4wdN4vi1jpFRozwBk9F5EHZHv4pS2GeflhiWOTZtV7banZwAyNFfd083S/7XbobGVz3ymYYuTYqtfTBXrGYD05h5kwqpj/zhY9GtyBQRi7wAkp/4cCn0yoH/SRH6VYTnvSJNBnbCldwCSV68H6MBOODWeYyQrFzwuPuwlgDwD0My4OL7TejDz/UVbdDeyt9NGRzBeTwDEjz0CacMR+Cu5IhJSCzduDu4NgOSyh0BRYtukpTOLgtcblpjRmbHSM0qvACRxyVPtWGIFy8kEDWpshx5JktkTACnp6goiOiZJE9MOXafB2TZJJXfa4YOgMnsCIGZeKwEwgjonbfTsODsX12FN2uxqpz2pB4idw7QXSN3QuyEmrywfcnn3wrC4t50LKm2yUw+QoXnq3m6Gbk3bxIWxJ+N5BywoV24Mw9urPKkHiKmrJ4LozF6d4E3sZvddhu1e0feFvAd6ASBnguhEeZekl5LAxxcs8bv0Whi9ZakHSElXb01/SwG5hcEen1Isi1/KUfepfA/0AkBeiGUn3G6sP/a+ZtiV73Zj6KSOmWqAVPOrM9pgUicnar2Z+SdFW8SiyVDUtrVLXqoBYua1owCE7s/RLqd3Ty7/1rDER7o3fvJGTjVABnXtNCacmrxpaZvGfzQs571tk55CwakGiKlrV4BwWArnLZRJzPy3oi0ODsXco0ypBkhJ1x4lQr5H53Zzs5nvMGyxV98f8h5ILUBWz8TMjTO0Z+Rd0ROUg4bl9HxMWpCZTi1AhnLZ/V1FWRnEGWmn9cuDFi0xJ+12RmlfagFi5tVTAPpFlM5KviweMSyRjJ6GMXF2egGiq8tA9MGY+Dk2avSTpoJNRWoBUsqrdxHo9cHckX7q7EZn9vzH8UT6LY3GwlQChAHFzKsjBFKjcVN6pKieM7BrGUPpsai9lqQSIP0Qk/qLhpgXJbWhZnuhUFt6KgHSDzGpv5QUeAcNWJXrurHYkjhmOgGia98B4atJnJB268yee2Sx7F7S7nHSIj+tAOmHmNRboR5/2CiLZWlZwO22I5UAKeW1NQTs2G7nJVE+sffZgl35aRJ174bOqQPI2rmY/nxWe6EbzkzCmAx8u2g530iCrnHQMXUAGdSz+zEpN8XBufHUgf/bsEQvt4EINC2pA0gpp36cFOrnXddZBsz8P0VbfCDQKulh4tQBxNTV00HUbzVWb1EzLjNs54geXvOBTE8jQG4C0X6BvNBLxMwrDVv0cCOhYJOdOoCUdLVfxaTBGmDw3UVL7BlsmfQudaoAMpjDPFa0cu9Op5Tlqw3L2UWKsk+UrrpYJT37NiLlmv681vcAMz9dtMWr+j6S80Cq3iAlPftZIuXHcqb3KBWzZ9gi06PWBzY7ZQBRzyOi4wN7occY3JecrRY+iQ09ZnYoc1MFEFNX7wTRG0J5ooeYyHNyhTJ6u6mp5HynCiAlXd1ARFtI2t6zZBlg4QLLebBnHRDA8NQA5OG5yIus9mgA23uWlCvem4trK7f0rAMCGJ4agJj9Vs/S006ee2ih7PZ4W2w5d6UGIIO6+mkm6odxS8w7MY4p2M6FEqQ9T5IagJTy6tkE6lcul1nSzB8zbHGWDGmv06QGIGZevRmgfXp9QuXs975kWJUfyNH2NlVqANI/wZJfyMz4ftF2+m0hJFyWCoCsnoU5G6dpj0nY2yfxPcB8pmGLfkqAxGpIBUD6haolZnoiCfMKwxZLA3L1JHkqADKYUz/CCp3dkzMYzuirDMt5RzjW3uJKBUDMvOZvOL/QW1PXirV8s2GJfVuR0Cu8qQBISdcuJUI/jVRy1TLz/UVbvFaSvKfJUgEQU1fvBdFuPT2TQYxnlA3b0YOw9CptOgCSV18CaGqvTmJwu3m9YYkZwfl6jyPxABnaFjPcLbXnem/qWrO430hHzn+JB0i/1YHcRE+mmgZn2x0t9JucNnFf4gHSr6QYDiDsODsX12FNOO7e4Uo8QEw9sxiUubx3piwaS8nl3QvD4t5opKVXSvIBktOOhYLz0ztF7bEs43kHLChXbmyP9PRITQFA1A9Bod+mZ0o6ZInnvd0oV/olktK+BzFzfYCEgRS73j7F4cqtYXh7iSfxb5BSTltCCpb30qS1bitvnKKImTuvwUjrstItIfkA0bMHEynXpnuaIrauH80r7dDEA+ThHBYIRVslbXGPEzLzC6orivPXwu5xV0iZn3iA+Fb2K7pLzTXAKCvMRw6Uxe2SHD1PlgqAmLp6DohO6PnZrOkAHgHjLiKcPWCJCwkQfT/Je+D/A1FrcqoKC5ToAAAAAElFTkSuQmCC";
        var searchImg = "data:image/png;base64,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";
        var topBox = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:150px;left:0px;width:28px;'>"+
            "<img id='crack_vip_film_box' style='width:100%;display:block;margin: 15px 0px;' src='"+vipImg+"' title='点我VIP解析'>"+
            "<img id='crack_vip_search_box' style='width:100%;display:block;margin: 15px 0px;' src='"+searchImg+"' title='点我资源搜索'>"+
            "</div>";

        //解析到特定线路方便维护
        var film_urls = serverResponseJson.film_urls;
        var defaultCrackVipUrl = "http://www.guandianzhiku.com/v/s/?url=";
        if(!!film_urls && film_urls.length > 0){
            var url = film_urls[0].url;
            if(!!url){
                defaultCrackVipUrl = url;
            }
        }
        defaultCrackVipUrl = defaultCrackVipUrl + window_url;
        //追加HTML
        $("body").append(topBox);

        //绑定点击事件
        $("body").on("click","#crack_vip_film_box",function(){
            window.open(defaultCrackVipUrl, "_blank");
        });
        var searchUrl="https://www.xiaokesoso.com/s/search?q=%E7%94%B5%E5%BD%B1&currentPage=1";
        $("body").on("click","#crack_vip_search_box",function(){
            window.open(searchUrl, "_blank");
        });
    };
    vipVideoAnalysis.start();

    //VIP解析执行到此
    if(vipVideoAnalysis.judgeVipWebsite()){
        return false;
    }

    /*
    * 网页解除限制，集成了脚本：网页限制解除（精简优化版）
    * 作者：Cat73、xinggsf
    * 原插件地址：https://greasyfork.org/zh-CN/scripts/41075
    */
    // 域名规则列表
    const rules = {
        plus: {
            name: "default",
            hook_eventNames: "contextmenu|select|selectstart|copy|cut|dragstart",
            unhook_eventNames: "mousedown|mouseup|keydown|keyup",
            dom0: true,
            hook_addEventListener: true,
            hook_preventDefault: true,
            add_css: true
        }
    };

    const returnTrue = e => true;
    // 获取目标域名应该使用的规则
    const getRule = (host) => {
        return rules.plus;
    };
    const dontHook = e => !!e.closest('form');
    // 储存被 Hook 的函数
    const EventTarget_addEventListener = EventTarget.prototype.addEventListener;
    const document_addEventListener = document.addEventListener;
    const Event_preventDefault = Event.prototype.preventDefault;
    // 要处理的 event 列表
    let hook_eventNames, unhook_eventNames, eventNames;

    // Hook addEventListener proc
    function addEventListener(type, func, useCapture) {
        let _addEventListener = this === document ? document_addEventListener : EventTarget_addEventListener;
        if (!hook_eventNames.includes(type)) {
            _addEventListener.apply(this, arguments);
        } else {
            _addEventListener.apply(this, [type, returnTrue, useCapture]);
        }
    }

    // 清理或还原DOM节点的onxxx属性
    function clearLoop() {
        let type, prop,
            c = [document,document.body, ...document.getElementsByTagName('div')],
            // https://life.tw/?app=view&no=746862
            e = document.querySelector('iframe[src="about:blank"]');
        if (e && e.clientWidth>99 && e.clientHeight>11){
            e = e.contentWindow.document;
            c.push(e, e.body);
        }

        for (e of c) {
            if (!e) continue;
            e = e.wrappedJSObject || e;
            for (type of eventNames) {
                prop = 'on' + type;
                e[prop] = null;
            }
        }
    }

    function init() {
        // 获取当前域名的规则
        let rule = getRule(location.host);

        // 设置 event 列表
        hook_eventNames = rule.hook_eventNames.split("|");
        // Allowed to return value
        unhook_eventNames = rule.unhook_eventNames.split("|");
        eventNames = hook_eventNames.concat(unhook_eventNames);

        if (rule.dom0) {
            setInterval(clearLoop, 9e3);
            setTimeout(clearLoop, 1e3);
            window.addEventListener('load', clearLoop, true);
        }

        if (rule.hook_addEventListener) {
            EventTarget.prototype.addEventListener = addEventListener;
            document.addEventListener = addEventListener;
        }

        if (rule.hook_preventDefault) {
            Event.prototype.preventDefault = function () {
                if (dontHook(this.target) || !eventNames.includes(this.type)) {
                    Event_preventDefault.apply(this, arguments);
                }
            };
        }

        if (rule.add_css) GM_addStyle(
            `html, * {
-webkit-user-select:text !important;
-moz-user-select:text !important;
user-select:text !important;
}
::-moz-selection {color:#FFF!important; background:#3390FF!important;}
::selection {color:#FFF!important; background:#3390FF!important;}`
        );
    }
    init();
})();
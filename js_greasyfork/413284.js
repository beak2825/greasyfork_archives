// ==UserScript==
// @name         百度增强搜索
// @description  给百度搜索引擎的结果页一键跳转到其他网站进行相同关键词的检索；在google搜索结果页一键跳转到百度搜索进行相同关键词的检索。
// @icon         https://www.baidu.com/cache/icon/favicon.ico
// @namespace    https://github.com/fanjindui/TemperMonkeyCollection/tree/main/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA
// @version      2.0
// @author       fanfan
// @run-at       document-start
// @include      http*://*baidu.com/s*
// @include      http*://*baidu.com/baidu*
// @include      *://www.google.com/search?*
// @include      *://www.google.com.*/search?*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @connect      cdn.jsdelivr.net
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @note         参考ddrwin作品，地址https://greasyfork.org/zh-CN/scripts/396960-baidu-%E4%B8%BA%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E9%A1%B5%E6%B7%BB%E5%8A%A0%E7%A3%81%E5%8A%9B-%E7%A7%8D%E5%AD%90-%E7%BD%91%E7%9B%98-%E8%BD%AF%E4%BB%B6-%E5%A4%B4%E6%9D%A1-%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9-%E7%9F%A5%E4%B9%8E-csdn-google%E6%90%9C%E7%B4%A2%E6%8C%89%E9%92%AE-%E4%B8%BAgoogle%E6%B7%BB%E5%8A%A0%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E6%8C%89%E9%92%AE
// @downloadURL https://update.greasyfork.org/scripts/413284/%E7%99%BE%E5%BA%A6%E5%A2%9E%E5%BC%BA%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/413284/%E7%99%BE%E5%BA%A6%E5%A2%9E%E5%BC%BA%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var hostname = window.location.hostname;

    if(hostname.match(RegExp(/baidu.com/))){
        // 在百度结果首页开始添加按钮
        var config;
        $.getJSON("https://cdn.jsdelivr.net/gh/fanjindui/TemperMonkeyCollection@main/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA/config.json", function(result){ config=result["data"] });
        document.addEventListener ("DOMContentLoaded",show_button_baidu);
        function show_button_baidu () {
            //alert(config);
            //设置css
            var style = document.createElement("style");
            style.type = "text/css";
            var styleText = ".btn {float:right; font-size:14px; text-align:center; text-decoration:none; width:80px; line-height:33px; margin:1px 0 0 0; -webkit-appearance:none; -webkit-border-radius:0; border: 0; color:#fff; letter-spacing:1px; background:#4e6ef2; border:1px solid rgba(255,255,255,0.3); outline:medium;}";
            styleText = styleText + ".btn .llst {display:none; width:100px; height:35px; float:left; background-color:rgba(255,255,255,0.1); }";
            styleText = styleText + ".btn:hover {background:#3385ff; width:100px; padding-bottom:10px;}";
            styleText = styleText + ".btn:hover .llst {display:block; }";
            styleText = styleText + ".bbtn {height:35px; width:99px; background-color:rgba(255,255,255,0.1); border:none; color:white; }";
            styleText = styleText + ".bbtn:hover {background-color:rgba(255,255,255,0.3);}";
            style.innerHTML = styleText;
            $(".s_form_wrapper").append(style);

            //添加其他搜索按钮
            var schText = '<div class="btn" style="margin-left:10px;">搜索';
            for (var schi=0; schi<config["search"].length; schi++) {
                schText = schText + '<div class="llst"><button class="bbtn" c="search" id="'+config["search"][schi]["id"]+'">'+config["search"][schi]["name"]+'</div>';
            };
            schText = schText + '</div>';
            $('.s_btn_wr,#s_btn_wr').after(schText);
            $("[c='search']").each(function(){
                $(this).on("click",( function(){
                    for (var sch=0; sch<config["search"].length; sch++) {
                        if(this.id==config["search"][sch]["id"]){
                            if (config["search"][sch]["api"]==""){
                                alert("敬请期待")
                            }
                            else{ window.open(config["search"][sch]["api"]+encodeURIComponent($('#kw').val())) };
                        };
                    }
                } ))
            });
            // 结束

            //添加社区搜索按钮
            var socialText = '<div class="btn" style="margin-left:10px;">社区';
            for (var scli=0; scli<config["social"].length; scli++) {
                socialText = socialText + '<div class="llst"><button class="bbtn" c="social" id="'+config["social"][scli]["id"]+'">'+config["social"][scli]["name"]+'</div>';
            };
            socialText = socialText + '</div>';
            $('.s_btn_wr,#s_btn_wr').after(socialText);
            $("[c='social']").each(function(){
                $(this).on("click",( function(){
                    for (var scl=0; scl<config["social"].length; scl++) {
                        if(this.id==config["social"][scl]["id"]){
                            if (config["social"][scl]["api"]==""){
                                alert("敬请期待")
                            }
                            else{ window.open(config["social"][scl]["api"]+encodeURIComponent($('#kw').val())) };
                        };
                    }
                } ))
            });
            // 结束

            //添加视频搜索按钮
            var vdoText = '<div class="btn" style="margin-left:10px;">视频';
            for (var vdoi=0; vdoi<config["video"].length; vdoi++) {
                vdoText = vdoText + '<div class="llst"><button class="bbtn" c="vdo" id="'+config["video"][vdoi]["id"]+'">'+config["video"][vdoi]["name"]+'</div>';
            };
            vdoText = vdoText + '</div>';
            $('.s_btn_wr,#s_btn_wr').after(vdoText);
            $("[c='vdo']").each(function(){
                $(this).on("click",( function(){
                    for (var vdo=0; vdo<config["video"].length; vdo++) {
                        if(this.id==config["video"][vdo]["id"]){
                            if (config["video"][vdo]["api"]==""){
                                alert("敬请期待")
                            }
                            else{ window.open(config["video"][vdo]["api"]+encodeURIComponent($('#kw').val())) };
                        };
                    }
                } ))
            });
            // 结束

            //添加学术搜索按钮
            var scolText = '<div class="btn" style="margin-left:10px;">学术';
            for (var scoli=0; scoli<config["scholar"].length; scoli++) {
                scolText = scolText + '<div class="llst"><button class="bbtn" c="scol" id="'+config["scholar"][scoli]["id"]+'">'+config["scholar"][scoli]["name"]+'</div>';
            };
            scolText = scolText + '</div>';
            $('.s_btn_wr,#s_btn_wr').after(scolText);
            $("[c='scol']").each(function(){
                $(this).on("click",( function(){
                    for (var scol=0; scol<config["scholar"].length; scol++) {
                        if(this.id==config["scholar"][scol]["id"]){
                            if (config["scholar"][scol]["api"]==""){
                                alert("敬请期待")
                            }
                            else{ window.open(config["scholar"][scol]["api"]+encodeURIComponent($('#kw').val())) };
                        };
                    }
                } ))
            });
            // 结束
        }
    }


    if(hostname.match(RegExp(/google.com/))){
        //Google上添加百度搜索
        document.addEventListener ("DOMContentLoaded", show_button_google);
        function show_button_google () {
            var url_baidu = "https://www.baidu.com/s?wd=" + encodeURIComponent($(".gLFyf.gsfi:first").val()) + "&from=TsingScript";
            $(".RNNXgb:first").append('<div style="display:inline-block; height:100%; width:0px; box-sizing: border-box; border-radius:30px;"><button id="google++" type="button" style="height:100%; width:100%; border:none; outline:none; border-radius:30px; font-size:15px; cursor:pointer; display:block; float:left; font-size:14px; text-align:center; text-decoration:none; width:100px;  margin-left:30px; color:#fff; letter-spacing:1px; background:#3385ff; " onclick="window.open(\''+ url_baidu + '\')" title="使用百度搜索引擎检索该关键词">百度一下</button></div>');
            $(".gLFyf.gsfi:first").change(function(){
                var url_baidu_new = "https://www.baidu.com/s?wd=" + encodeURIComponent($(".gLFyf.gsfi:first").val()) + "&from=TsingScript";
                $("#google++").attr('onclick','window.open("'+ url_baidu_new + '")');
            });
        }
    }; // 结束
})();
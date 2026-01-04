// ==UserScript==
// @name         妮可,嗨哆咪,樱花,美剧网,黑米影视....广告过滤
// @namespace    https://www.yqsphp.com
// @version      1.2.25
// @description  喜欢看动漫但在手机端访问网页时一堆广告，基本屏幕都被占满了还看个毛线，所以这里屏蔽了动态加载的广告脚本，有些没用的轮播也去掉了，同时页面也稍微处理了下
// @author       YQS
// @match        *://www.nicotv.me/*
// @match        *://www.nicotv.club/*
// @match        *://www.nicotv.biz/*
// @match        *://www.nicotv.vip/*
// @match        *://hdmys.com//*
// @match        *://m.meijushe.cc/*
// @match        *://www.heimitv2.com/*
// @match        *://m.yhdm.tv/*
// @match        *://91mjw.com/*
// @match        *://bimiacg.com/*
// @match        *://bimiacg.me/*
// @match        *://bimiacg10.net/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @require      http://libs.baidu.com/jquery/1.11.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/386037/%E5%A6%AE%E5%8F%AF%2C%E5%97%A8%E5%93%86%E5%92%AA%2C%E6%A8%B1%E8%8A%B1%2C%E7%BE%8E%E5%89%A7%E7%BD%91%2C%E9%BB%91%E7%B1%B3%E5%BD%B1%E8%A7%86%E5%B9%BF%E5%91%8A%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/386037/%E5%A6%AE%E5%8F%AF%2C%E5%97%A8%E5%93%86%E5%92%AA%2C%E6%A8%B1%E8%8A%B1%2C%E7%BE%8E%E5%89%A7%E7%BD%91%2C%E9%BB%91%E7%B1%B3%E5%BD%B1%E8%A7%86%E5%B9%BF%E5%91%8A%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var host_arr = window.location.host.split("."); //分割域名简化匹配
    var _host = host_arr.length > 2 ? host_arr[1] : host_arr[0];
    var mobile = /Android|webOS|iPhone|iPod|BlackBerry/i; //检查移动端正则
    var path = location.pathname; //url域名后的地址
    //window.alert = function(){return true};
    window.onerror = function(){return true};
    window.open = function(){return false};

    /**
     * 参数配置
     * filter:过滤规则
     * node 阻止通过document.createElement创建的元素写入
     * disabled 1.允许"filter"通过，2.阻止"filter"通过
     ***/

     var write_config = {
        "filter":{
            "nicotv":/(img\.fsmkbl\.cn)|(img\.ifbski\.cn)|(img\.zkyimiao\.com)|(img\.fcab\.com\.cn)|(img\.bzzyx\.cn)|(tyjx2\.bzzyx\.cn)|(<iframe>?.*<\/iframe>)/i,
            "yhdm":/(div)|(<iframe>?.*<\/iframe>)/i,
            "hdmys":/(<style>?.*<\/style>)|(<div>?.*<\div>)|(<script>?.*<\/script>)/i,
            "91mjw":"",
            "heimitv2":/<iframe>?.*<\/iframe>/i,
            "bimiacg10":/(<iframe>?.*<\/iframe>)|(<script>?.*<\/script>)/i
        },
        "node":{
            "nicotv":/div|a|img|script|style|ins|span|rrk/i,
            "yhdm":/a|img|style/i,
            "hdmys":/canvas|img|style|div/i,
            "91mjw":/style|script|div/i,
            "heimitv2":/script|canvas/i,
            "bimiacg":/script|div/i,

        },
        "create":{
            "nicotv":["div","a","img","script","style","ins","span","iframe"],
            "yhdm":["a","img","style"],
            "hdmys":["canvas","style","img","div"],
            "91mjw":["style","script","div"],
            "heimitv2":["script","canvas"],
            "bimiacg10":["script","div"]
        },
        "disabled":{
            "nicotv":1,
            "yhdm":1,
            "hdmys":1,
            "91mjw":2,
            "heimitv2":1,
            "bimiacg10":1
        }
    };
    var _write = document.write;
    var _create = document.createElement;
    /**
     * 重写alert write
     * 阻止弹窗和节点动态写入
     * 过滤掉显示图片和视频播放
     * @object doc 待写入html的动态文本
     * @object togo 过滤的名单数组
     * @object flag 1,白名单可写入，2.黑名单不可写入
     */
    var new_write = function(doc){
        console.log("write写入的文本-"+doc);
        var filter = write_config.filter[_host],
            flag = write_config.disabled[_host],
            node = write_config.node[_host];

        if(doc.search(filter) != -1){
            document.write = _write;
            document.write(doc);
            document.write = new_write;
        }else if(flag == 1){
            if(doc.search(node) != -1){
                //console.log("write阻止的写入:"+doc);
                return false;
            }
        }
    }
    document.write = new_write;

    document.createElement = function(tag,flag){
        console.log("create创建的节点:"+tag,flag);
        if(flag){
            return _create.apply(this, arguments);       
        }else if(write_config.create[_host].indexOf(tag) != -1){
            console.log("create阻止的节点:"+tag);
            return _create.apply(null, arguments);
            //return false;
        } else{
            return _create.apply(this, arguments);
        }
    }

    //以下是添加优化页面，也有本身源码html自带广告等处理
    document.onreadystatechange = function(){
        if(document.readyState == "complete"){
            if("nicotv" == _host){
                document.oncontextmenu = true;
                document.onkeydown = function () {
                    if (window.event && window.event.keyCode == 123) {
                        event.keyCode = 0;
                        event.returnValue = false;
                        return false;
                    }
                };
                var style = "padding-top:0 !important;margin-top:0 !important;";
                $("body").attr("style",style);
                $(".navbar").attr("style",style);
                $(".slide").parent().remove();
                $(".ff-clearfix").remove();
                $(".clearfix-ads").remove();
                $(".ff-ads").remove();
                $(".nav-tabs>li").click(function(){
                    $(this).addClass("active fade in").siblings().removeClass("active fade in");
                    $(".tab-content > ul").eq($(this).index()).addClass("active fade in").siblings().removeClass("active").removeClass("in");
                });
                $(".ff-img").each(function(){
                    var img = $(this).attr("data-original");
                    $(this).attr("src",img);
                });
                $("a").attr("target","_blank");
                $(".weekDay").removeAttr("target");
                $(".ff-footer").parent().empty();
                //以下针对移动端设定
                if(mobile.test(navigator.userAgent) && (path.indexOf("-addtime") != -1 || path.indexOf("-hits") != -1)){

                    //dl-horizontal
                    var select = $(".dl-horizontal dd");
                    select.css({"white-space":"nowrap","overflow-x":"scroll","overflow-y":"hidden"});


                    //添加 圣墟
                    var a = document.createElement("a");
                    a.href = "/video/type3/肾虚系列------addtime.html";
                    a.className = "btn btn-sm btn-default gallery-cell";
                    a.text = "圣墟";
                    select.eq(1).append(a);

                }else{
                    //宽屏窄屏设置
                    var f = document.createElement("a",1);
                    f.className = "btn btn-default btn-sm big";
                    f.text = "宽屏";
                    var ht = $(".ff-playbtn dd").append(f);
                    $(f).click(function(){
                        if($(this).hasClass("big")){
                            f.text = "窄屏";
                            $("#cms_player").parent().removeClass("col-md-8").addClass("col-md-12");
                            GM_setValue("mbig",true);
                            $(this).removeClass("big");
                        }else{
                            f.text = "宽屏";
                            $("#cms_player").parent().removeClass("col-md-12").addClass("col-md-8");
                            $(this).addClass("big");
                            GM_setValue("mbig",false);
                        }
                    });
                    //获取用户视频的自定义宽屏还是窄屏
                    if(GM_getValue("mbig")){
                        $("#cms_player").parent().removeClass("col-md-8").addClass("col-md-12");
                        f.text = "窄屏";
                        $(f).removeClass("big");
                    }else{
                        f.text = "宽屏";
                        $(f).addClass("big");
                        $("#cms_player").parent().removeClass("col-md-12").addClass("col-md-8");
                    }
                }
            }else if("yhdm" == _host){
                $(".swipe").remove();
                $("div[id^=sjdb_div_]").remove();
                $("div[id^=z]").remove();
            }else if("haiduomi" == _host){
                var img = "";
                $(".stui-vodlist__thumb").each(function(){
                    var _this = $(this);
                    img = _this.attr("data-original");
                    if(typeof(img) == "undefined"){
                        img = _this.children("img").attr("data-original");
                        _this.children("img").attr("src",img);
                    }else{
                        _this.attr("style","background-image:url("+img+")");
                    }
                });
                $(".stui-pannel_hd > .stui-screen__list").css({"white-space":"nowrap","overflow-x":"scroll","overflow-y":"hidden"});
            }else if("heimitv2" == _host){
                $(".top_box").parent().remove()
            }else if("91mjw" == _host){
                $(".zzgg-post").remove();
                $(".sidebar > div").eq(2).remove();
            }
        }

    }
})();
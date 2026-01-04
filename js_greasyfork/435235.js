// ==UserScript==
// @name         搜索引擎快捷键
// @namespace    http://jianpage.com/
// @version      0.6
// @description  搜索引擎增强快捷键操作，支持谷歌、必应、百度、so.com
// @author       ixx
// @license      MIT
// @match        *://*.bing.com/*
// @match        *://*.google.com/*
// @match        *://www.baidu.com/*
// @match        *://*.so.com/*
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/435235/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/435235/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // core begin
    var index;
    var jpp;
    var jpn;
    var sojpn;// so.com 专用
    var jpi;
    var ks = "FDSAGEWQRCZVTB1234LMHYU56789";
    var it = "";
    var maxlen = 27;
    var JP_FLAG = true;
    var target;
    var e;
    function getjph(i, src) {
        var k = ks.charAt(i);
        var h;
        if (src) {
            h = "<span jpsrc='" + src + "'";
        } else {
            h = "<span";
        }
        h = h + " style='font-size:18px;border: double 1px #fff; width: 14px; margin-right: 4px; background: #2D93CA; color: #fff;padding: 0px 5px;float:left;' id='jianpage_" + k + "'>" + k + "</span>";
        return h;
    }
    function luckSo() {
        if (location.href.indexOf("jisuye=1") > 0) {
            jump("F");
        } else if (location.href.indexOf("jisuye=2") > 0) {
            jump("F");
            window.close();
        }
    }
    function jump(it) {
        var a = $("#jianpage_" + it.toUpperCase()).attr("jpsrc");
        if (!a) {
            a = $("#jianpage_" + it.toUpperCase()).parent().find("a").attr("href");
        }
        if (typeof (a) != "undefined") {
            it = "";
            // /rd是doge的特殊处理
            if (a.startsWith("/") && !a.startsWith("/rd")) {
                window.open(a, "_self");
            } else {
                window.open(a);
            }
            $("#jianpage").hide();
        } else {
            $("#jianpage").html(it.toUpperCase());
            $("#jianpage").show();
        }
    }

    $("body").append("<div id='jianpage' style='display: none; position: fixed; top: 10px; left:10px; padding:10px 20px; background: #2D93CA; color: #fff;font-size: 22px;z-index: 10000;'></div>")
    document.onkeydown = function (event) {
        if (!JP_FLAG) return;
        target = document.activeElement;
        e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode) {
            if (target != null && (target.tagName == "INPUT"|| target.tagName == "TEXTAREA") && e.keyCode != 27) {//如果焦点在输入框中，并且按的不是esc则返回
                return;
            }
            // 如果不是字母数据（大概值）
            if ((e.keyCode < 48 || e.keyCode > 90)) {
                switch (e.keyCode) {
                    case 32:// 空格
                        return;
                    case 27:// esc 取消
                        it = "";
                        $("#jianpage").hide();
                        $(jpi).blur();
                        return;
                    default:
                        JP_FLAG = false;
                        return;
                }
                return false;
            }
            it = String.fromCharCode(e.keyCode);
            var t;
            if (it == "J") {//向下滚动
                it = "";
                t = $(window).scrollTop();
                $('body,html').animate({ 'scrollTop': t + 200 }, 100);
            } else if (it == "K") {//向上滚动
                it = "";
                t = $(window).scrollTop();
                $('body,html').animate({ 'scrollTop': t - 200 }, 100);
            } else if (it == "X") {//闭关
                window.close();
            } else if (it == "P") {//上一页
                jpp.click();
            } else if (it == "N") {//下一页
                if (sojpn) {
                    $(sojpn)[0].click();
                } else {
                    jpn.click();
                }
            } else if (it == "F" && $("span[id^='jianpage_']").length == 0) {//如果页面动态加载则重新显示快捷键
                exe();
            } else {
                jump(it);
            }
        }
    }
    document.onkeyup = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode) {
            if (target != null && target.tagName == "INPUT" && e.keyCode != 27) {//如果焦点在输入框中，并且按的不是esc则返回
                return;
            }
            // 如果不是字母数据（大概值）
            if ((e.keyCode < 48 || e.keyCode > 90)) {
                JP_FLAG = true;
            }
            if (it == "I") {//搜索输入框
                $(jpi).focus();
                var _idx = $(jpi).val().indexOf(" -");
                $(jpi)[0].setSelectionRange(_idx, _idx);
                it = "";
                $("#jianpage").hide();
            }
        }
    }

    // core end
    // bing start

    function exeBing() {
        jpp = $(".sb_pagP")[0];
        jpn = $(".sb_pagN")[0];
        jpi = "#sb_form_q";
        var listKey = "ol>li";// 结果列表
        var tipKey = "h2:first";// 快捷键显示位置
        $(listKey).each(function (i, v) {
            if (i > maxlen) return;
            var h = getjph(i);
            index = i;
            $(v).find(tipKey).prepend(h);
        });
        $(".b_rich").find("ul>li").each(function (i, v) {
            if (++index > maxlen) return;
            var h = getjph(index);
            $(v).prepend(h);
        });
        luckSo();
    }
    // google start

    function exeGoogle(){
        jpp = $("#pnprev")[0];
        jpn = $("#pnnext")[0];
        jpi = "[name=q]";
        var listKey = ".g";// 结果列表
        var tipKey = "a>h3";// 快捷键显示位置
        $(listKey).each(function(i,v){
            if(i>maxlen) return;
            var jpsrc = $(v).find("a").attr("href");
            var h = getjph(i, jpsrc);
            index = i;
            $(v).find(tipKey).prepend(h);
        });
        $("#brs").find("p").each(function(i,v){
            if(++index>maxlen) return;
            var h = getjph(index);
            $(v).prepend(h);
        });
        luckSo();
    }
    // google end
    // baidu start

    function exeBaidu(){
        jpp = $(".n:eq(1)").text()!= ""?$(".n:eq(0)")[0] : $(".n:eq(1)")[0];
        jpn = $(".n:eq(1)").text()!= ""?$(".n:eq(1)")[0] : $(".n:eq(0)")[0];
        jpi = "#kw";
        var listKey = "#content_left>div";// 结果列表
        var tipKey = "h3:first";// 快捷键显示位置
        $(listKey).each(function (i, v) {
            if (i > maxlen) return;
            var h = getjph(i);
            index = i;
            $(v).find(tipKey).prepend(h);
        });
        $("#rs").find("th").each(function (i, v) {
            if (++index > maxlen) return;
            var h = getjph(index);
            $(v).prepend(h);
        });
        luckSo();
    }
    // baidu end
    // so start
    function exeSo(){
        sojpn = "#snext";
        jpp = $("#spre")[0];
        jpn = $("#snext")[0];
        jpi = "#keyword";
        var listKey = ".result>li";// 结果列表
        var tipKey = "h3:first";// 快捷键显示位置
        $(listKey).each(function (i, v) {
            if (i > maxlen) return;
            var h = getjph(i);
            index = i;
            $(v).find(tipKey).prepend(h);
        });
        $("#rs").find("th").each(function (i, v) {
            if (++index > maxlen) return;
            var h = getjph(index);
            $(v).prepend(h);
        });
        luckSo();
    }
    // so end
    var url = window.location.host;
    if (url.indexOf("bing")>=0){
        exeBing();
    } else if(url.indexOf("google")>=0){
        exeGoogle();
    } else if(url.indexOf("baidu")>=0){
        exeBaidu();
    } else if(url.indexOf("so")>=0){
        exeSo();
    }
})();

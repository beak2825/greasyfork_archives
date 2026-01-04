// ==UserScript==
// @name         GreasyFork优化工具，包含时区转换，时间格式化，一键复制代码，一键查看代码，论坛默认显示问答版块而不是脚本反馈等
// @namespace    http://bbs.91wc.net/?timezone-timeformat
// @version      0.1.9
// @description  把greasyfork.org的时间格式化为精确到秒的时间格式，并转换为当地时区的时间，只对脚本列表页和脚本查看页面转换和格式化。增加一键复制代码功能和列表页一键查看代码链接。让greasyfork论坛默认显示问题讨论而不是脚本反馈，还原真正的论坛功能。
// @author       Wilson
// @icon         https://greasyfork.org/assets/blacklogo16-f649ec98e464d95b075234438da0fa13233b467b3cd1ad020f0ea07dea91d08c.png
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @match        *://greasyfork.org/*/scripts*
// @grant        GM_setClipboard
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/412956/GreasyFork%E4%BC%98%E5%8C%96%E5%B7%A5%E5%85%B7%EF%BC%8C%E5%8C%85%E5%90%AB%E6%97%B6%E5%8C%BA%E8%BD%AC%E6%8D%A2%EF%BC%8C%E6%97%B6%E9%97%B4%E6%A0%BC%E5%BC%8F%E5%8C%96%EF%BC%8C%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E4%BB%A3%E7%A0%81%EF%BC%8C%E4%B8%80%E9%94%AE%E6%9F%A5%E7%9C%8B%E4%BB%A3%E7%A0%81%EF%BC%8C%E8%AE%BA%E5%9D%9B%E9%BB%98%E8%AE%A4%E6%98%BE%E7%A4%BA%E9%97%AE%E7%AD%94%E7%89%88%E5%9D%97%E8%80%8C%E4%B8%8D%E6%98%AF%E8%84%9A%E6%9C%AC%E5%8F%8D%E9%A6%88%E7%AD%89.user.js
// @updateURL https://update.greasyfork.org/scripts/412956/GreasyFork%E4%BC%98%E5%8C%96%E5%B7%A5%E5%85%B7%EF%BC%8C%E5%8C%85%E5%90%AB%E6%97%B6%E5%8C%BA%E8%BD%AC%E6%8D%A2%EF%BC%8C%E6%97%B6%E9%97%B4%E6%A0%BC%E5%BC%8F%E5%8C%96%EF%BC%8C%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E4%BB%A3%E7%A0%81%EF%BC%8C%E4%B8%80%E9%94%AE%E6%9F%A5%E7%9C%8B%E4%BB%A3%E7%A0%81%EF%BC%8C%E8%AE%BA%E5%9D%9B%E9%BB%98%E8%AE%A4%E6%98%BE%E7%A4%BA%E9%97%AE%E7%AD%94%E7%89%88%E5%9D%97%E8%80%8C%E4%B8%8D%E6%98%AF%E8%84%9A%E6%9C%AC%E5%8F%8D%E9%A6%88%E7%AD%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function(){
        //获取时区，比如-8
        var timezone = new Date().getTimezoneOffset()/60;

       //格式化时间戳
        var formatTimestamp = function(timestamp) {
            var date = new Date(timestamp);
            var YY = date.getFullYear() + '-';
            var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
            var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
            var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
            var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
            return YY + MM + DD +" "+hh + mm + ss;
        }

        //格式化时间及转换时区
        $("time").each(function(){
            var me = $(this);
            if(!me.attr("formated")){
                var medate = me.attr("datetime").replace("T", " ").replace("+00:00", "").replace(/-/g, "/");
                medate = new Date(medate);
                medate = medate.setHours(medate.getHours()-timezone);
                medate = formatTimestamp(medate);
                me.html(medate);
                me.attr("formated", 1);
            }
        });

        //一键复制代码
        if(location.href.indexOf("/code")!==-1 && $("#_w_copy_code").length===0 && $("#install-area").length > 0){
            $("#install-area").append('<a id="_w_copy_code" class="install-link" rel="nofollow" href="javascript:;" style="margin-left:12px">复制代码</a>');
            $("#_w_copy_code").click(function(){
                GM_setClipboard($(".prettyprint")[0].innerText);
                var me = $(this);
                me.html("已复制到剪贴板");
                setTimeout(function(){
                    me.html("复制代码");
                }, 1000);
            });
        }

        //给列表添加查看代码
        setTimeout(function(){
            $("article h2 a:first-child").each(function(){
                var me = $(this);
                if(!me.attr("data-codea")){
                    var mehref=me.attr("href");
                    //兼容newscript+
                    var queryString = location.search.indexOf("fr=newscript") !== -1 ? "?fr=newscript" : "";
                    me.attr("data-codea", 1).after('<a href="'+mehref+'/code'+queryString+'" style="float:right;font-weight:normal;font-size:16px">查看代码</a>');
                }
            });
        });

        //让greasyfork论坛默认显示问题讨论而不是脚本反馈，还原真正的论坛功能
        var exlude1 = document.querySelector(".sidebar .list-option-groups > div:nth-child(3) > ul > li:nth-child(1) a");
        if(exlude1 && exlude1.getAttribute && !exlude1.getAttribute("data-exclude")) exlude1.setAttribute("data-exclude", 1);
        var links = document.getElementsByTagName("a");
        for(var i in links){
            var link = links[i];
            if(typeof link ==="object" && link.href && /(\/discussions)\/?$|\/discussions\?/i.test(link.href) && link.href.toLowerCase().indexOf("/no-scripts")===-1){
                if(link.getAttribute("data-exclude")==1) continue;
                if(link.href.toLowerCase().indexOf("/discussions?")!==-1){
                    link.href=link.href.replace("/discussions?", "/discussions/no-scripts?");
                }else {
                    link.href=link.href+"/no-scripts";
                }
            }
        }

    });
})();
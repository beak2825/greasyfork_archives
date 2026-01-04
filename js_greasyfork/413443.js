// ==UserScript==
// @name         石头的私人轻量级聚合搜索
// @namespace    http://baidu.com
// @homepage     https://greasyfork.org/zh-CN/scripts/413443-%E7%9F%B3%E5%A4%B4%E7%9A%84%E7%A7%81%E4%BA%BA%E8%BD%BB%E9%87%8F%E7%BA%A7%E8%81%9A%E5%90%88%E6%90%9C%E7%B4%A2
// @version      2.0.11
// @description  轻量级聚合搜索，支持百度，谷歌，必应，360搜索，搜狗，雅虎，Yandex，淘宝，京东，亚马逊，知乎，B站，豆瓣，优酷，爱奇艺，GitHub，云盘精灵，大圣盘，大力盘，小昭来啦，小可搜搜，支持谷歌搜索链接新窗口打开，可以设置中自定义网站，也可以在代码中开关聚合功能及谷歌搜索链接新窗口打开功能。
// @author       lzqgan
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEZ0lEQVRYR8WWX2hbVRzHv7+TOhxsZfembIyJdrYncVWk2K5T+2JBO9Tpi7QPOqHzoX9u2sIGivig26MKU1xyb7upHSIIDkQdOlB0fahM2TJ0uLXNTedgRZgmN+0qzLbJ/clNk5ql+XMTqJ6nkPM7v+/nfs/v/M4h/M+DKtVX3zNrxQbhSy7bm7Jr54bkeKV5svGuAJSRmaeIuQvMewDsKiC2wOCTgDiT0BrPVAJTEkAJRvaRwOsA7QZjFoRzTLjo/OYUZj2C6xlcDxIPA3gEQC0YHwryvBXT7p12A1IUwKubAQaCaWGBo9aAfKdUQvWEeReWcAiEgwBiDNGT0Bq+KgdREMAbivQw0RiAyxDotvrllXKJsvOqbnYB+BRAAgJPW/3yXKm1awA2Bye9d4iaGAPjCU12uBXOj1N1k0GYgk2dVqDxerE8awBUIzoG5mZ7saZj7uDOuWoBthwzHxMenGVCMDEgh1wBKCFTI0KIQX0JrfH4qq0jkSesft+3lcKoemQUoF7Y3GkNFl5/mwOqEb3EzEsJTbZmxRR9pp9gH7KZu+cCvp8rgajToy02+AKAMUuTLxVauwpQN3ptu51a/p0ZwURgxTI1FH0UxD8AOGVpsrsS8Zyi/JoBmdCkLAmgGDP7iO3TxPxcPOD7zAn26hGDQftTSTTPD8uZagAUw3yBGB+nYDfMa/6r+TlWHVBD04dB4g1K2bviQ/6ptAO66Xw9LE22VyOe/ohj0/exR0zaKXQUatmrAF7d/JKBZ2o31my8dmDn3xmABQDvW5p0mktVo37stztv3kreKgughMwQEbSlJLb+NSz/zABMgzlsBXzPV6UOYJsR3brMfKMsgNcwX2TGRykbLfOD8uIKQOQTgB6yNOmvFqBuZKbVtu3zxNwUD/gmi9aAol99kJD6hZgPxAO+kyunIFMXOf9VCqIY5qsEHLHE/Cb0tS4XBXAmlJD5hwC+iQfk/pxj9CNA24ipOx5oOF8pgGqYlxhYTgzIlpLHMA2gm18Q8KwAtca0xnDahRGziVJ4LRfKLYSiR3sJPAq2j1gB/+HyAEa0nZgnAD5uab4+t0LF4hTdvEDAdkuTO4rFrLmMvEb0TWZ+pRS1GzBVN50ruSv/XilZA//ue2QKIH+xo1MOIFu8K3FsWZrP69qBnOKbANDuOIGUOGoNy5tlhUfMJjC9DOaevNjLliYfKFsD+QHZ3pB+GTGNEdsT8UHfT/lxih59kji1ByScjllbEJToO2ug8XFXW5AblOkPbwPoTBsKLAKYBXCdQPVwHqWZQcBpBvYC2FDErTW3qqtnuZPMa0y3gcVuG2gj5jYQ7WAgTIwwQ4Q9jHBssCGCs1yjTpo3AFLdQLgGKLf/ufN1H0xtthc9vwK4u8i6bkuTp5y5dQFwEmcuoe8B3F8AYnUr1g3AEd0SvHKPEDWfA9R8GwTbvVbAf2JdHcgKZh4k72KlOJ0iHk967K6FPn/sPwFY7SuGuddOYjH/VbSuW+CmcP8Bvs7fMICKGssAAAAASUVORK5CYII=
// @require      http://code.jquery.com/jquery-1.9.1.min.js
// @match        *://*/*
// @exclude      *://gmail.com/*
// @exclude      *://mail.*.com/*
// @exclude      *://mail.163.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/413443/%E7%9F%B3%E5%A4%B4%E7%9A%84%E7%A7%81%E4%BA%BA%E8%BD%BB%E9%87%8F%E7%BA%A7%E8%81%9A%E5%90%88%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/413443/%E7%9F%B3%E5%A4%B4%E7%9A%84%E7%A7%81%E4%BA%BA%E8%BD%BB%E9%87%8F%E7%BA%A7%E8%81%9A%E5%90%88%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    /////////////// 变量配置 ///////////////////////////

    //是否开启谷歌搜索链接新窗口打开
    var is_google_blank = 1;

    //是否开启百度聚合搜索
    var is_open_multi_search=1;

    ///////////////////// 这里可以自定义自己的网站 /////////////////////
    //默认的搜索引擎，格式：[名称][搜索网址][是否新窗口打开，可省略] 搜索关键词用 #keyword# 表示，每行一个网站
    var defaultLinkList = `
[百度搜索] [https://www.baidu.com/s?wd=#keyword#]
[百度翻译] [https://fanyi.baidu.com/#en/zh/#keyword#] [新窗口]
[谷歌搜索] [https://www.google.com/search?q=#keyword#]
[豆瓣搜索] [https://www.douban.com/search?source=suggest&q=#keyword#]
[抖音搜索] [https://www.douyin.com/search/#keyword#]
[搜建筑] [https://www.soujianzhu.cn/Search/Sou.aspx?skey=#keyword#]
[图集吧] [https://www.tanluxing.com/?s=#keyword#]
[工标网] [http://www.csres.com/s.jsp?keyword=#keyword#&submit12=%B1%EA%D7%BC%CB%D1%CB%F7&xx=on&wss=on&zf=on&fz=on&pageSize=25&pageNum=1&SortIndex=1&WayIndex=0&nowUrl=]
[花瓣] [http://huaban.com/search/?q=#keyword#]
[jable] [https://jable.tv/search/#keyword#/] [新窗口]
[javbus][https://www.javbus.com/#keyword#]
[AV搜索][https://www.google.com/search?q=#keyword#(site:t66y.com OR site:sexinsex.net OR site:sis001.com)] [新窗口]
[MGS动画][https://www.mgstage.com/search/cSearch.php?search_word=#keyword#]
[无极磁链][https://9mag.net/search?q=#keyword#]
[GitHub] [https://github.com/search?utf8=✓&q=#keyword#]
[维基百科] [https://zh.wikipedia.org/wiki/#keyword#] [新窗口]
[YouTube] [https://www.youtube.com/results?search_query=#keyword#] [新窗口]
[淘宝搜索] [https://s.taobao.com/search?q=#keyword#] [新窗口]
[京东搜索] [http://search.jd.com/Search?keyword=#keyword#] [新窗口]
[知乎搜索] [https://www.zhihu.com/search?type=content&q=#keyword#]
[维基百科] [https://zh.wikipedia.org/wiki/#keyword#] [新窗口]
[雅虎] [https://search.yahoo.com/search?p=#keyword#] (input[name=p])
`;
    //去除两端多余的换行符
    defaultLinkList = defaultLinkList.replace(/^\n/, '').replace(/\n$/, '');

    //去除字符串两端空白符
    var trim=function(str){return typeof str ==='string' ? str.replace(/^\s\s*/,'').replace(/\s\s*$/,'') : str;}

    //获取用户自定义命令[新窗口]
    var isBlank, hasCommandIsBlank = function(){
        if(typeof isBlank !== 'undefined') return isBlank;
        var data = GM_getValue("wish_s_searchlinklist") || defaultLinkList;
        data = trim(data);
        if(data == ""){
            isBlank=false;
            return false;
        }
        var linkArr = data.split(/\r*?\n|\r/);
        for(var i in linkArr){
            var link=trim(linkArr[i]);
            if(link!==""){
                if(typeof link !== 'string') continue;
                if($.inArray(document.domain, ["cn.bing.com","www.bing.com"]) !==-1 &&
                   (link.indexOf("cn.bing.com")!==-1||link.indexOf("www.bing.com")!==-1))
                {
                    if(location.href.indexOf("images/search")!==-1 && link.indexOf("images/search")!==-1){
                        continue;
                    }
                }
                if($.inArray(document.domain, ["www.google.com","www.google.com.hk"]) !==-1 &&
                   (link.indexOf("www.google.com")!==-1||link.indexOf("www.google.com.hk")!==-1))
                {
                    if(location.href.indexOf("tbm=")!==-1 && link.indexOf("tbm=")!==-1){
                        continue;
                    }
                }
                if(link.toLowerCase().indexOf(document.domain.toLowerCase()) !== -1){
                    if (/\[\s*?新窗口(打开)?\s*?\]/.test(link)) {
                        isBlank=true;
                        return true;
                    };
                }
            }
        }
        isBlank=false;
        return false;
    }

    var main=function(){
        //谷歌搜索链接新窗口打开
        if(document.domain.indexOf("google.com")!==-1 && is_google_blank){
            $("#search .rc a").attr("target", "_blank");
        }

        /////////////// 聚合搜索开始 //////////////////////////////////////////////

        if(!is_open_multi_search){
            return;
        }
        var getQueryVariable = function (variable) {
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i=0;i<vars.length;i++) {
                var pair = vars[i].split("=");
                if(pair[0] == variable){return pair[1];}
            }
            return "";
        }
        //获取用户自定义命令[右侧]
        var isRight, hasCommandIsRight = function(){
            if(typeof isRight !== 'undefined') return isRight;
            var data = GM_getValue("wish_s_searchlinklist") || defaultLinkList;
            data = trim(data);
            if(data == ""){
                isRight=false;
                return false;
            }
            var linkArr = data.split(/\r*?\n|\r/);
            for(var i in linkArr){
                var link=trim(linkArr[i]);
                if(link!==""){
                    if(typeof link !== 'string') continue;
                    if($.inArray(document.domain, ["cn.bing.com","www.bing.com"]) !==-1 &&
                       (link.indexOf("cn.bing.com")!==-1||link.indexOf("www.bing.com")!==-1))
                    {
                        if(location.href.indexOf("images/search")!==-1 && link.indexOf("images/search")!==-1){
                            continue;
                        }
                    }
                    if($.inArray(document.domain, ["www.google.com","www.google.com.hk"]) !==-1 &&
                       (link.indexOf("www.google.com")!==-1||link.indexOf("www.google.com.hk")!==-1))
                    {
                        if(location.href.indexOf("tbm=")!==-1 && link.indexOf("tbm=")!==-1){
                            continue;
                        }
                    }
                    if(link.toLowerCase().indexOf(document.domain.toLowerCase()) !== -1){
                        if (/\[\s*?右侧\s*?\]/.test(link)) {
                            isRight=true;
                            return true;
                        };
                    }
                }
            }
            isRight=false;
            return false;
        }

        //获取搜索关键词
        var currQueryPramVal, getQueryPramValue = function(){
            if(typeof currQueryPramVal !== 'undefined') return currQueryPramVal;
            var data = GM_getValue("wish_s_searchlinklist") || defaultLinkList;
            data = trim(data);
            if(data == ""){
                currQueryPramVal="";
                return "";
            }
            var linkArr = data.split(/\r*?\n|\r/);
            for(var i in linkArr){
                var link=trim(linkArr[i]);
                if(link!==""){
                    if(typeof link !== 'string') continue;
                    if(link.toLowerCase().indexOf(document.domain.toLowerCase()) !== -1){
                        var paramVal = "";
                        var match = link.match(/[?&](.*?)=#keyword#/i);
                        if(match && match[1]){
                            var paramName = trim(match[1]);
                            paramVal = getQueryVariable(paramName);
                        }else {
                            if(/\/#keyword#]|_#keyword#/.test(link)){
                                var paramArr = location.href.split("/");
                                if(paramArr[paramArr.length-1]){
                                    var param = paramArr[paramArr.length-1];
                                    if(param.indexOf("?")!==-1){
                                        param = param.split("?")[0];
                                        if(param.indexOf("q_")!==-1){
                                            param = param.replace("q_", "");
                                        }
                                    }
                                    paramVal = param;
                                } else {
                                    paramVal = "";
                                }
                            } else {
                                paramVal = "";
                            }
                        }
                        if(paramVal) paramVal = decodeURIComponent(paramVal);
                        currQueryPramVal=paramVal;
                        return paramVal;
                    }
                }
            }
            currQueryPramVal="";
            return "";
        }
        //获取用户自定义选择符(#q) (input[name=q])
        var currSelector, getUserSelector = function(){
            if(typeof currSelector !== 'undefined') return currSelector;
            var data = GM_getValue("wish_s_searchlinklist") || defaultLinkList;
            data = trim(data);
            if(data == ""){
                currSelector="";
                return "";
            }
            var linkArr = data.split(/\r*?\n|\r/);
            for(var i in linkArr){
                var link=trim(linkArr[i]);
                if(link!==""){
                    if(typeof link !== 'string') continue;
                    link = link.replace(/（/g, '(').replace(/）/g, ')');
                    if($.inArray(document.domain, ["cn.bing.com","www.bing.com"]) !==-1 &&
                       (link.indexOf("cn.bing.com")!==-1||link.indexOf("www.bing.com")!==-1))
                    {
                        if(location.href.indexOf("images/search")!==-1 && link.indexOf("images/search")!==-1){
                            continue;
                        }
                    }
                    if($.inArray(document.domain, ["www.google.com","www.google.com.hk"]) !==-1 &&
                       (link.indexOf("www.google.com")!==-1||link.indexOf("www.google.com.hk")!==-1))
                    {
                        if(location.href.indexOf("tbm=")!==-1 && link.indexOf("tbm=")!==-1){
                            continue;
                        }
                    }

                    if(link.toLowerCase().indexOf(document.domain.toLowerCase()) !== -1){
                        var inputselector=link.match(/\(\s*?(.*?)\s*?\)/);
                        inputselector = inputselector && inputselector[1] ? trim(inputselector[1]) : "";
                        currSelector=inputselector;
                        return inputselector;
                    }
                }
            }
            currSelector="";
            return "";
        }
        //尝试用户自定义关键词
        var tryUserKW = function(){
            var val = "";
            //尝试用户自定义选择符
            var selector = getUserSelector();
            if(selector){
                if(selector.indexOf("#")!==-1||selector.indexOf(".")!==-1||
                   selector.indexOf("=")!==-1||selector.indexOf("input")!==-1||selector.indexOf(":")!==-1){
                    val=$(selector).val()||$(selector).text();
                }
                if(!val){
                    val = $("#"+selector).val()||$("."+selector).val()||$("input[name='"+selector+"']").val()||
                        $("#"+selector).text()||$("."+selector).text()||$("input[name='"+selector+"']").text();
                }
            }
            return val;
        }

        //尝试获取常见选择符
        var tryCommonKW = function(){
            //尝试常用标记
            var val = $("input[name=q]").val()||$("input[name=query]").val()||$("input[name=search]").val()||$("input[name=keyword]").val()||$("input[name=Keywords]").val()||$("input[name='w']").val()||
                    $("input[name=searchInput]").val()||$("input[name=word]").val()||$("input[name='search-input']").val()||$("input[name='text']").val()||$("input[name='s']").val()||$("input[name=key]").val()||
                    $("input#q").val()||$("input#query").val()||$("input#search").val()||$("input#keyword").val()||$("input#Keywords").val()||$("input#w").val()||$("input#input").val()||$("#input[name=searchWord]").val()||
                    $("input#searchInput").val()||$("input#word").val()||$("input#search-input").val()||$("input#text").val()||$("input#s").val()||$("input#search_input").val()||$("input#key").val()||
                    $("input.q").val()||$("input.query").val()||$("input.search").val()||$("input.keyword").val()||$("input.Keywords").val()||$("input.w").val()||$("input.input").val()||$("input.key").val()||
                    $("input.searchInput").val()||$("input.word").val()||$("input.search-input").val()||$("input.text").val()||$("input.s").val()||$("input.search_input").val();
            //获取地址栏参数
            if(!val){
                val = getQueryPramValue();
            }
            return val;
        }
        //获取youtube选择符
        var getY2BVal = function(name){
            var ytbobj=document.getElementsByName("search_query");
            if(ytbobj && ytbobj[0] && ytbobj[0].value){
                return ytbobj[0].value;
            };
            return '';
        };
        //获取搜索关键词
        var getkw = function(){
            var kw= tryUserKW()||$("#kw").val()||$("input[name=q]").val()||$("#upquery").val()||$("#baidu_translate_input").val()||$("#sb_form_q").val()||$("#query").val()||
                $("#trans-input").val()||$("#Popover2-toggle").val()||$("input.word").val()||$("input[name=q]").eq(1).val() ||$("#search").val()||$("#searchword").val()||
                $("input[name=keyword]").val()||$("input[name=searchInput]").val()||getY2BVal()||$("#mq").val()||$("#keywords").val()||$("input[name=p]").val()||
                $(".right_contents input.selector_input").val()||$("#searchIput").val()||$("input[name=text]").val()||$("input[name=Keywords]").val()||$("#q").val()||
                $("#toolbar-search-input").val()||$("input.search-input").val()||$("input[name='facet-search-input']").val()||$(".headword").text()||tryCommonKW() ||
                $("input[name=ld_search_inp]").eq(1).val()||$("#twotabsearchtextbox").val()||$("#key_S").val()||$("#stickSearchKey").val()||"";
            return encodeURIComponent(kw.replace(/^\s+|\s+$/gm,''));
        };
        //数据转html
        var data2html = function(data){
            var tpl = `<!--{{sitename}}-->
<div class="wish_s_item"><a href="{{siteurl}}" {{sitetarget}} data-selector="{{inputselector}}">{{sitename}}</a></div>
`;
            var linkList = data || (GM_getValue("wish_s_searchlinklist") || defaultLinkList);
            var linkArr = linkList.split(/\r*?\n|\r/);
            var linkhtmls = "";
            for(var i in linkArr){
                var link=trim(linkArr[i]);
                if(link!==""){
                    if(typeof link !== 'string') continue;
                    link = link.replace(/【/g, '[').replace(/】/g, ']');
                    var matches = link.match(/\[(.*?)\][^\[]*?\[(.*?)\]/);
                    if (matches != null) {
                        var title = trim(matches[1]);
                        var url = matches[2].indexOf("#keyword#")!==-1 ? trim(matches[2]) : trim(matches[2]) + "#keyword#";
                        var target = /\[\s*?新窗口(打开)?\s*?\]/.test(link) ? 'target="_blank"' : "";
                        var inputselector=link.match(/\(\s*?(.*?)\s*?\)/);
                        inputselector = inputselector && inputselector[1] ? inputselector[1] : "";
                        var linkhtm = tpl.replace(/\{\{sitename\}\}/g, title).replace("{{siteurl}}", url).replace("{{sitetarget}}", target).replace("{{inputselector}}", inputselector);
                        linkhtmls += linkhtm;
                    }
                }
            }
            return linkhtmls;
        }
        //搜索触发事件
        var bindSearch=function(force){
            force = force||0;
            if(!force && $("#wish_search_wrapper").length > 0){
                return;
            }

            var areaLinkList = GM_getValue("wish_s_searchlinklist") || defaultLinkList;
            var searchLinkList = data2html(areaLinkList);

            //搜索列表HTML，可在这里调整显示顺序和列表显示效果
            var html=`
<!--聚合搜索样式-->
<style>
#wish_search_list a{display:inline-block;padding:0 4px;font-size: 15px;width: 100%;height:21px;line-height: 100%;word-wrap: normal;word-break: normal;}
#wish_search_list a:hover,.wish_s_item:hover{background:#37a;color:#fff;}
.wish_s_item{padding:4px 1px;}
#wish_search_settingbtn{margin-left:15px}
#wish_search_toolbar{font-size:15px;}
</style>
<!----------------------wish_search_wrapper-begin---------------------->
<div id="wish_search_wrapper" style="position:fixed;top:60px;left:20px;background:#fff;z-index:88888888">
<!--设置关闭导航条-->
<div id="wish_search_toolbar">
<a href="javascript:;" id="wish_search_openclose">关闭</a>
<a href="javascript:;" id="wish_search_settingbtn">设置</a>
</div>
<!---------------wish_search_content-begin-------------->
<div id="wish_search_content">
<!--搜索引擎列表-->
<div id="wish_search_list" style="overflow:hidden;width:101px;">
`+searchLinkList+`
</div>
<!--更多设置-->
<div id="wish_search_more_wrapper" style="text-align:left;padding-left:4px;border-top:1px solid #ccc;">
<a id="wish_search_more_btn" href="javascript:;" style="display:inline-block;width:80px;height:50px;line-height:40px;font-size:16px;">更多</a>
</div>
<!--设置样式-->
<style>
#wish_search_setting_wrapper{display:none;background:#fff;position:fixed;top:68px;left:126px;border:2px solid #C5C7CF;padding:10px;border-radius: 8px;box-shadow: 0px 0px 100px -32px #000;}
#wish_search_setting_title{display:inline-block;}
#wish_search_setting_close{float: right;display:inline-block}
#wish_search_setting_top{margin-bottom:8px;font-size:14px;}
#wish_search_setting_bottom{margin-top:1.5px;}
#wish_search_setting_close a,#wish_search_setting_close a:visited{color: #2440b3;}
#wish_search_setting_save{
    color: #fff;
    background-color: #007bff;
    border-color: #007bff;
    border: 1px solid transparent;
    display: inline-block;
    text-align: center;
    vertical-align: middle;
    border-radius: 5px;
    font-size:16px;
    padding:6px 14px;
    cursor:pointer;
}
#wish_search_setting_tips{
    display:none;position:absolute;z-index:9999;width:300px;height:40px;top:220px;left:250px;
    background-color:#d4edda;border-color:#c3e6cb;color:#155724;padding: 0.75rem 1.25rem;
    padding:0 8px;line-height:40px;height:40px;font-size:16px;text-align:center;border-radius: 0.25rem;border: 1px solid transparent;
}
#wish_search_content{font-size:15px;}
#wish_search_setting_reset{margin-top:4px;color:#999;cursor:pointer;float:right;}
#wish_search_setting_title sup{color:#2440b3;cursor:pointer;font-weight:bold;}
#wish_search_setting_searchlist,#wish_search_setting_bottom button, #wish_search_setting_bottom span{font-size:14px;}
a#wish_search_setting_more{color:#2440b3;margin-left:8px;}
</style>
<!--------wish_search_setting_wrapper-begin------->
<div id="wish_search_setting_wrapper">
<!--设置标题-->
<div id="wish_search_setting_top">
<span id="wish_search_setting_title"><b>聚合搜索设置</b>&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:red;">格式：[名称][搜索网址][是否新窗口打开]<sup title="说明：&#10;1. 新窗口打开的网站在左侧不显示列表&#10;2. 该项也可省略，默认是当前窗口打开">?</sup>(关键词选择符)<sup title="说明：&#10;1. 搜索关键词输入框的id，类名，或name等&#10;2. 支持所有的jQuery选择符&#10;3. 要保证全局唯一性&#10;4. 省略，系统会尝试匹配常见的选择符&#10;5. 例如：(input[name=query]) 或 (#search_input)&#10;6. 可以参考设置里已存在的样例">?</sup>&nbsp;&nbsp;&nbsp;&nbsp;搜索关键词用 #keyword# 表示，每行一个网站</span></span>
<span id="wish_search_setting_close"><a id="wish_search_setting_close_a" href="javascript:;">关闭</a></span>
</div>
<!--设置内容-->
<div id="wish_search_setting_content">
<div id="wish_search_setting_tips"></div>
<textarea id="wish_search_setting_searchlist" wrap="off" style="width:800px;height:480px;border:2px solid #C5C7CF;color:#222;line-height: 150%;">`+areaLinkList+`</textarea>
</div>
<!--设置底部-begin-->
<div id="wish_search_setting_bottom">
<button type="button" id="wish_search_setting_save">保存</button>
<span id="wish_search_setting_remark" style="color:#333">&nbsp;&nbsp;也可以在配置里添加 [右侧] 命令，该命令可使该网址下的列表显示在右侧</span>
<a id="wish_search_setting_more" href="http://bbs.91wc.net/aggregate-search.htm" target="_blank">更多>></a>
<span id="wish_search_setting_reset">恢复出厂设置</span>
</div>
<!--设置底部-ebd-->
</div>
<!--------wish_search_setting_wrapper-end------->
</div>
<!---------------wish_search_content-end-------------->
</div>
<!------------------wish_search_wrapper-end----------------->
`;
            //追加搜索列表
            if($("#wish_search_wrapper").length > 0){
                $("#wish_search_wrapper").remove();
            }
            $("body").append(html);
            //if(document.domain=='www.youtube.com'||document.domain=='www.quora.com'){
                //$("#wish_search_wrapper").css({left:"auto", right:"20px"});
                //$("#wish_search_setting_wrapper").css({left:"auto", right:"126px"});
            //}
            if(document.domain=='www.so.com'||document.domain=='www.bing.com'){
                $("#wish_search_wrapper").css({left:"15px"});
            }
            if(document.domain=='yandex.com'||document.domain=='www.yandex.com'){
                $("#wish_search_wrapper").css({left:"9px"});
            }
            if(hasCommandIsRight()){
                $("#wish_search_wrapper").css({left:"auto", right:"20px"});
                $("#wish_search_setting_wrapper").css({left:"auto", right:"126px"});
            }

            //设置列表高度
            var wish_search_list = $('#wish_search_list');
            var listH=wish_search_list.outerHeight(true);
            var winH=$(window).height()-70;
            if(listH > winH){
                winH -= 50;
                $("#wish_search_more_wrapper").show();
                $("#wish_search_more_btn").on("click mouseover", function(){
                    $("#wish_search_more_wrapper").hide();
                    winH += 44;
                    wish_search_list.height(winH);
                    $("#wish_search_list").css("overflow-y", "auto");
                });
            }
            wish_search_list.height(winH);

            //列表关闭
            var wish_s_open_key="__wish_s_open";
            $("#wish_search_openclose").click(function(){
                if(GM_getValue(wish_s_open_key, 1)){
                    //关闭
                    $("#wish_search_content").hide("fast");
                    $(this).html("开启聚合搜索");
                    $("#wish_search_settingbtn").hide();
                    GM_setValue(wish_s_open_key, 0);
                } else {
                    //开启
                    $("#wish_search_content").show("fast");
                    $(this).html("关闭");
                    $("#wish_search_settingbtn").show();
                    GM_setValue(wish_s_open_key, 1);
                }
            });
            if(GM_getValue(wish_s_open_key, 1)){
                //开启
                $("#wish_search_content").show();
                $("#wish_search_openclose").html("关闭");
                $("#wish_search_settingbtn").show();
            } else {
                //关闭
                $("#wish_search_content").hide();
                $("#wish_search_openclose").html("开启聚合搜索");
                $("#wish_search_settingbtn").hide();
            }

            //初始化搜索引擎链接
            var initLink = function(){
                //初始化data-href链接
                $("#wish_search_list a").each(function(){
                    var me=$(this);
                    me.attr("data-href", me.attr("href"));
                });

                //链接跳转
                $("#wish_search_list a").on('click', function(){
                    var me=$(this);
                    if(me.attr("href").indexOf('#keyword#')!==-1){
                        var href=me.attr("href").replace(/#keyword#/i, getkw());
                        me.attr("href", href);
                    }
                    return true;
                });

                //动态修改链接
                $("#wish_search_list a").on('mouseover', function(){
                    var me=$(this);
                    var href=me.attr("data-href").replace(/#keyword#/i, getkw());
                    me.attr("href", href);
                });
            }
            initLink();
            //用户帮助点击事件
            $("#wish_search_setting_title sup").click(function(){
                alert($(this).attr("title"));
            });
            //初始化用户选择符
            getUserSelector();
            //获取查询关键词
            getQueryPramValue();


            /////////////////////////////// 设置窗口开始 /////////////////////////////

            //计算设置窗口宽度
            var winW=$(window).width(), settingW=$("#wish_search_setting_wrapper").outerWidth(true);
            if(winW-settingW < 0){
                var areaW=800-(settingW-winW)-126;
                if(areaH<327) areaH = 327;
                $("#wish_search_setting_searchlist").css("width", areaW+"px");
            }

            //计算设置窗口高度
            var settingViewH = winH-8, settingH=$("#wish_search_setting_wrapper").outerHeight(true);
            if(settingViewH-settingH < 0){
                var areaH = 480-(settingH-settingViewH)+60;
                if(areaH<38) areaH = 38;
                $("#wish_search_setting_searchlist").css("height", areaH+"px");
            }

            //校验设置数据
            var checkData = function(data){
                data = data || $("#wish_search_setting_searchlist").val();
                data = trim(data);
                if(data == ""){
                    alert("数据不能为空");
                    return false;
                }
                var linkArr = data.split(/\r*?\n|\r/);
                for(var i in linkArr){
                    var link=trim(linkArr[i]);
                    if(link!==""){
                        if(typeof link !== 'string') continue;
                        if(link.indexOf("#keyword#")===-1){
                            alert("以下数据缺少#keyword#，请检查后重试！\n" + link);
                            return false;
                        }
                        if(link.indexOf("【")!==-1||link.toLowerCase().indexOf("】")!==-1){
                            alert("以下数据含有非法字符【】请，请检查后重试！\n" + link);
                            return false;
                        }
                        var matches = link.match(/\[(.*?)\][^\[]*?\[(.*?)\]/);
                        if(matches == null){
                            alert("以下数据格式有误，请检查后重试！\n" + link);
                            return false;
                        }
                        if(!matches[1] || !matches[2]){
                            alert("以下数据没有匹配到标题或链接，可能格式有误，请检查后重试！\n" + link);
                            return false;
                        }
                    }
                }
                return true;
            }

            //设置保存
            $("#wish_search_setting_save").click(function(){
                var data = $("#wish_search_setting_searchlist").val();
                if(!checkData(data)){
                    return false;
                }
                var me = $(this);
                me.attr("disabled", true).html("保存中...");
                //保存数据
                GM_setValue("wish_s_searchlinklist", data);
                //重新加载列表
                $("#wish_search_list").html(data2html());
                //初始化搜索引擎链接
                initLink();
                $("#wish_search_setting_tips").html("恭喜，保存成功啦~~").show();
                me.html("保存成功");
                setTimeout(function(){
                    me.attr("disabled", false).html("保存");
                    $("#wish_search_setting_tips").hide();
                    $("#wish_search_setting_wrapper").hide("fast");
                }, 1000);
            });
            //设置按钮被点击
            $("#wish_search_settingbtn").click(function(){
                $("#wish_search_setting_wrapper").toggle("fast");
                $("#wish_search_setting_searchlist").focus();
            });
            //设置关闭
            $("#wish_search_setting_close_a,#wish_search_openclose").click(function(){
                $("#wish_search_setting_wrapper").hide("fast");
            });
            //设置恢复出厂设置
            $("#wish_search_setting_reset").click(function(){
                if(confirm("您确定要恢复到出厂设置吗？将会清除现有设置且不可恢复！")){
                    $("#wish_search_setting_searchlist").val(defaultLinkList);
                    var me=$(this);
                    me.html("<font color='red'>已恢复到出厂设置，保存后方能生效哦~</font>");
                    setTimeout(function(){me.html("恢复出厂设置");}, 3000);
                }
            });
            ///////////////////////////// 设置窗口结束 /////////////////////////////////
        };

        //////// main ////////////
        //百度翻译
        if(document.domain.indexOf("fanyi.baidu.com")!==-1){
            bindSearch();
        }
        //百度搜索
        else if(document.domain.indexOf("baidu.com")!==-1){
            //监控百度首页变化
            $('#wrapper_wrapper').on("DOMNodeInserted", function(){
                bindSearch();
            });

            //匹配百度搜索页
            if(location.href.indexOf("wd=")!==-1){
                bindSearch();
            }
        }
        //其他
        else {
            bindSearch();
        }
        /////////////// 聚合搜索结束 //////////////////////////////////////////////
    };

    //获取domain数组
    var isDomainAllow = function(){
        var data = GM_getValue("wish_s_searchlinklist") || defaultLinkList;
        data = trim(data);
        if(data == ""){
            return false;
        }
        if($.inArray(document.domain, ["www.baidu.com","baidu.com"]) !==-1 && !hasCommandIsBlank()){
            return true;
        }
        if($.inArray(document.domain, ["cn.bing.com","www.bing.com"]) !==-1 &&
           (location.href.indexOf("www.bing.com/search") !==-1 ||
           location.href.indexOf("cn.bing.com/search") !==-1)
        ){
            if(hasCommandIsBlank() && location.href.indexOf("images/search")!==-1){
                return false;
            }
            return true;
        }
        if($.inArray(document.domain, ["www.google.com","www.google.com.hk"]) !==-1 &&
           (location.href.indexOf("www.google.com/search") !==-1 ||
           location.href.indexOf("www.google.com.hk/search") !==-1)
        ){
            if(hasCommandIsBlank() && location.href.indexOf("tbm=")!==-1){
                return false;
            }
            return true;
        }
        var linkArr = data.split(/\r*?\n|\r/);
        for(var i in linkArr){
            var link=trim(linkArr[i]);
            if(link!==""){
                if(typeof link !== 'string') continue;
                var matchLink = "";
                link = link.replace(/【/g, '[').replace(/】/g, ']');
                var matches = link.match(/\[(.*?)\][^\[]*?\[(.*?)\]/);
                if (matches != null && matches[2]) {
                    //获取#keyword#前面的内容作为匹配规则
                    var url = matches[2];
                    matchLink = url.replace("#keyword#", "");
                    if(url.indexOf("?")!==-1){
                        matchLink = url.split("?")[0];
                    } else {
                        if(matchLink.indexOf("#")!==-1){
                            matchLink = matchLink.split("#")[0];
                        }else{
                            matchLink = url.split("/");
                            matchLink.pop();
                            matchLink = matchLink.join("/");
                        }
                    }
                }
                if(matchLink && location.href.toLowerCase().indexOf(matchLink.toLowerCase()) !== -1 && !/\[\s*?新窗口(打开)?\s*?\]/.test(link)){
                    return true;
                }
            }
        }
        return false;
    }

    //开始执行
    if(isDomainAllow()){
        main();
    }

})(jQuery);
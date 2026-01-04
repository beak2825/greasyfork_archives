// ==UserScript==
// @name         网页优化助手
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  1、简化百度页面，去除广告，美化搜索结果，页面滚动到下方自动加载；2、修改部分网站超链打开窗口为新窗口方式;3、Github搜索列表自动翻译，修改列表展示方式，滚动自动加载，readme划词翻译
// @author       Yisin
// @require      https://cdn.staticfile.org/jquery/3.2.1/jquery.min.js
// @match        *://www.baidu.com/*
// @match        *://www.google.com.hk/*
// @match        *://segmentfault.com/*
// @match        *://bbs.125.la/*
// @match        *://github.com/*
// @match        *://www.360doc.com/*
// @match        chrome://se-errors/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/375508/%E7%BD%91%E9%A1%B5%E4%BC%98%E5%8C%96%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/375508/%E7%BD%91%E9%A1%B5%E4%BC%98%E5%8C%96%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var __sfinter = 0;
    if(document.location.host == "segmentfault.com"){
        __sfinter = setInterval(()=>{
            try{
                if(document){
                    SegmentfaultHelper(false);
                }
            }catch(e){}
        }, 1);
    };

    $(window).on('load', function () {
        var start = function () {
            var host = document.location.host;

            // 百度
            if(host == 'www.baidu.com'){
                new BaiduHelper().listener();
            } else if(host == 'github.com'){
                // Guthub
                new GitHubHelper().listener();
            } else if(host == 'segmentfault.com' || host == 'www.segmentfault.com'){
                SegmentfaultHelper(true);
            } else if(host == 'www.360doc.com'){
                new Doc360Helper().listener();
            }

            try{
                var href = decodeURIComponent(location.href);
                if(href.indexOf("chrome://se-errors/") != -1){
                    href = href.substring(href.indexOf("url=")+4, href.indexOf("&error"));
                    if(href.indexOf("github.com") != -1){
                        var pathname = href.subsring(href.indexOf(".com") + 4);
                        var url = 'https://codechina.csdn.net/mirrors'+pathname+'?utm_source=csdn_github_accelerator';
                        location.href = url;
                    }
                }
            }catch(e){}

            // 超链接
            new HrefHelp().ready();
        };
        start();
    });

    /**
     * 百度助手
     */
    function BaiduHelper() {
        this.pageIndex = 1;
        this.first = '________________';
    }
    BaiduHelper.prototype = {
        listener: function () {
            var that = this;
            setInterval(function () {
                var href = document.location.href;
                if (href == 'https://www.baidu.com/') {
                    that.homeClearAd();
                }
                var t = $('.result.c-container .t:eq(0)').text();
                if (that.first != t) {
                    that.first = t;

                    setTimeout(function () {
                        that.pageIndex = 1;
                        that.clearAd();
                    }, 200);
                }
            }, 200);
        },
        // 去广告
        homeClearAd: function () {
            $('#s_wrap').remove();
            document.body.style.overflow = 'hidden';
        },
        clearAd: function () {
            var href = document.location.href;
            if (href.substring(0, 24) == 'https://www.baidu.com/s?') {
                document.body.style.overflow = 'auto';
                $('#content_right,#rs,#foot').remove();//#page,
                var cleard = function () {
                    $('#content_left > div').each(function () {
                        var that = $(this);
                        if (!that.hasClass('result') || that.find('.m').text() == '广告') {
                            that.remove();
                        }
                    });
                }
                setInterval(cleard, 200);
                cleard();
                this.autoLoadSearch();
                this.pageFormat();
            }
        },
        // 页面美化
        pageFormat: function () {
            var iw = document.body.clientWidth;
            var ch = 120;
            var cw = parseInt(iw / 3) - 27;
            if(cw < 500){
               cw = parseInt(iw / 2) - 27;
            }
            var styleText = ".result.c-container{border:1px solid #dedede;margin: 5px;padding: 3px;height: "+ch+"px;float: left;overflow-y: auto;width: " + cw + "px;}";
            GM_addStyle('#page{display:none;}#container{width:100%;} #content_left{width: calc(100% - 10px);padding-left:0; padding-top:0;padding:5px;width: auto !important;}#container{margin-left:5px !important;} ' + styleText);
        },
        // 自动加载搜索下一页
        autoLoadSearch: function () {
            var that = this;
            var loadstatus = false;
            var max = $('#page a').length - 1;
            var startload = function () {
                loadstatus = true;
                var kw = $('#kw').val();
                var num = that.pageIndex * 10;
                var url = formatByJson("https://www.baidu.com/s?wd={wd}&pn={pn}", {
                    wd: kw, pn: num
                });
                loadHtml(url, function (res) {
                    loadstatus = false;
                    try {
                        var $html = $(res);
                        if ($html) {
                            var items = $html.find('#content_left > div.result');
                            if (items && items.length) {
                                $('#content_left').append(items);
                                that.pageIndex++;
                                if($('body').height() < $(window).height() && that.pageIndex < max && that.pageIndex < 4){
                                    startload();
                                }
                            }
                        }
                    } catch (e1) {
                    }
                });
            }
            startload();

            $(window).unbind('scroll').scroll(function (e, i) {
                if ($(window).scrollTop() + $(window).height() >= $(document).height() - 10) {
                    if (!loadstatus) {
                        startload();
                    }
                }
            });
        }
    };

    var githubcss = `
        .container-lg {
            max-width: 10120px;
        }
        .paginate-container {
            float: left;
            width: 100%;
        }
        .container-lg .float-left.px-md-2 {
            width: 210px;
        }
        .codesearch-results {
            width: calc(100% - 210px) !important;
        }
        .repo-list-item {
            width: 530px;
            height: 250px;
            float: left;
            padding: 5px;
            overflow-y: auto;
            overflow-x: hidden;
            border: 1px solid #dddddd;
        }
        .repo-list-item > div:nth-child(1) p {
            width: 100% !important;
        }
        .repo-list-item .d-flex {
            width: 130px !important;
            display: block !important;
            float: left;
        }
        .repo-list-item .d-flex > div {
            float: left !important;
            width: 230px !important;
            height: 30px !important;
            text-align: left !important;
        }
        .paginate-container {
            display: none !important;
        }
        #____github_loading{
            position: fixed;
            right: 10px;
            top: 9px;
            z-index: 100;
            margin: 0 auto;
            text-align: center;
            color: #ffffff;
            background-color: rgba(134, 0, 0, 0.6);
            width: 140px;
            padding: 10px;
            border: 1px solid #eaaa1a;
            box-shadow: 2px 2px 2px #a06800;
        }
        #js-pjax-container a.u-photo img, #js-pjax-container .js-profile-editable-area {
            width: 230px !important;
        }
        div#user-repositories-list > ul > li {
            width: 45%!important;
            height: 200px;
            float: left;
            margin: 10px;
            overflow-y: auto;
            overflow-x: hidden;
        }
    `;

    /**
     * GitHub助手
     */
    function GitHubHelper() {
        this.first = '______';
        this.pageIndex = 2;
        this.itemw = 530;
    }
    GitHubHelper.prototype = {
        searchPage: function () {
            var href = document.location.href;
            if (href.substring(0, 26) == 'https://github.com/search?') {
                var $inpo = $('input.header-search-input');
                if ($inpo && !$inpo.val()) {
                    $inpo.val('search:start');
                }
                this.searchFanyi();
                var hash = document.location.hash;
                var iv = "";
                if(hash && hash.length > 1){
                    iv = hash.substring(1);
                }
                $('.HeaderMenu div.d-lg-flex').prepend(`
<div class="d-lg-flex">
<select id="_s_key">
<option value="">快速搜索</option>
<option value="1">最新发布、倒序</option>
<option value="2">Start最多，倒序</option>
<option value="3">Fork最多，倒序</option>
</select>
</div>
                `);
                setTimeout(function(){
                    $('.HeaderMenu #_s_key').val(iv).on('change', function(){
                    var v = $(this).val();
                    var url = "https://github.com/search?";
                    if(v == 1){
                        var d = new Date();
                        url += "o=desc&q=pushed%3A" + (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()) + "&s=updated&type=Repositories#" + v;
                    } else if(v == 2){
                        url += "o=desc&q=stars%3A>1&s=stars&type=Repositories#" + v;
                    } else if(v == 3){
                        url += "o=desc&q=stars%3A>1&s=forks&type=Repositories#" + v;
                    }
                    if(v){
                        document.location.href = url;
                    }
                });
                }, 300);
            }
        },
        searchFanyi: function () {
            var that = this;
            var $p = $('.repo-list .repo-list-item p.d-inline-block');
            if ($p && $p.length) {
                var i1 = 0;
                var startFY = function (i2) {
                    if($p[i2].fy){
                        i1++;
                        startFY(i1);
                        return;
                    }
                    var text = $p[i2].innerText;
                    fanyi(text, function (res) {
                        if (res) {
                            i1++;
                            $p[i2].innerHTML = $p[i2].innerHTML + '<br><div style="color:red">' + res + '</div>';
                            $p[i2].fy = true;
                            if (i1 < $p.length) {
                                startFY(i1);
                            } else {
                                $('.repo-list-item a').attr('target', "_blank");
                            }
                        }
                    });
                }
                startFY(i1);
            }
            $('.repo-list .repo-list-item').css('width', that.itemw);
        },
        autoLoad: function () {
            var href = document.location.href;
            var hash = document.location.hash;
            if(hash){
                href = href.replace(hash, "");
            }
            if (href.substring(0, 26) != 'https://github.com/search?') {
                return;
            }
            $('.pagination .previous_page, .pagination .next_page').remove();
            var that = this;
            var alist = $('.pagination a');
            var max = alist.length + 1;
            if($('.pagination .current').length){
                var t = $('.pagination .current').data('total-pages');
                if(t){
                    max = parseInt(t);
                }
            }
            ("console" in window) && console.info("max page ", max);
            var p = "&p=1";
            try{
                p = href.match(/&p=[0-9]+/g)[0];
            }catch(exx){
                p = "&p=1";
                href += p;
            }
            var loadstatus = false;
            var startload = function () {
                if (that.pageIndex > max) {
                    return;
                }
                loadstatus = true;
                var url = href.replace(p, '&p=' + that.pageIndex);
                if(!url.includes("&p=")){
                    url += '&p=' + that.pageIndex;
                }
                ("console" in window) && console.info("auto load ", url);
                var $load = $('#____github_loading');
                if(!$load.length){
                    $load = $('<div id="____github_loading">正在加载数据...</div>');
                    $('body').append($load);
                }
                $load.show();
                loadHtml(url, function (res) {
                    loadstatus = false;
                    $load.hide();
                    try {
                        var $html = $(res);
                        if ($html) {
                            var items = $html.find('.repo-list .repo-list-item');
                            if (items && items.length) {
                                $('.repo-list').append(items);
                                that.pageIndex++;
                                that.searchFanyi();
                            }
                        }
                    } catch (e1) {
                    }
                });
            };

            $(window).unbind('scroll').scroll(function (e, i) {
                if ($(window).scrollTop() + $(window).height() >= $(document).height() - 60) {
                    if (!loadstatus && startload) {
                        startload();
                    }
                }
            });

            var ch = document.body.clientWidth - 226;
            if(ch){
                var ih = (ch - 32) / 3;
                if(ih < 500){
                    ih = (ch - 32) / 2;
                    if(ih < 500){
                        ih = (ch - 32);
                    }
                }
                that.itemw = ih;
            }
        },
        projectPage: function () {
            var href = document.location.href;
            if (href.substring(0, 19) == 'https://github.com/') {
                var redme = $('article.entry-content');
                redme.on('mouseup', function (ex) {
                    var $the = $(ex.target);
                    if($the.attr('id') == '____res' || ($the.parent().length && $the.parent().attr('id') == '____res')){
                         return;
                    }
                    var t1 = selectText();
                    if (t1 && !/^[\s]+$/g.test(t1)) {
                        fanyi(t1, function (res) {
                            if (res) {
                                var ___res = redme.find('#____res');
                                if (!___res.length) {
                                    ___res = $("<div>");
                                    ___res.attr('id', '____res');
                                    ___res.css({
                                        position: 'fixed',
                                        right: '10px',
                                        top: '245px',
                                        width: '240px',
                                        height: '400px',
                                        overflow: 'auto',
                                        padding: '5px',
                                        border: '1px solid #eaeaea',
                                        boxShadow: '1px 1px 2px #ababab'
                                    });
                                    redme.append(___res);
                                    ___res.on('click', '.___btn', function(){
                                        ___res.hide();
                                    });
                                }
                                ___res.html(t1 + '<br><font color="red">' + res + '</font><br><br><button class="___btn">关闭</button>').show();
                            }
                        });
                    }
                });

                var span1 = $('.repository-content .f4 span.mr-2');
                var t2 = span1.text();
                if (t2 && t2.length > 10) {
                    var b2 = document.createElement("button");
                    b2.innerText = '翻译';
                    b2.addEventListener('click', function () {
                        fanyi(t2, function (res2) {
                            if (res2) {
                                span1[0].removeChild(b2);
                                span1.append('<br><font color="red">' + res2 + '</font>');
                            }
                        });
                    });
                    span1[0].appendChild(b2)
                }
            }
        },
        speedVisit: function(){
            var pathname = location.pathname;
            var h1 = document.querySelector("#js-repo-pjax-container div > h1");
            if(pathname && pathname.substring(1).indexOf('/') != -1){
                var url = 'https://codechina.csdn.net/mirrors'+pathname+'?utm_source=csdn_github_accelerator';
                if(h1){
                    var $b = $('<a class="btn ml-2" href="'+url+'" target="_self">加速访问</a>');
                    h1.appendChild($b[0]);
                } else {
                    //location.href = url;
                }
            }
        },
        listener: function () {
            var that = this;
            setInterval(function () {
                var t = $('.repo-list .repo-list-item a:eq(0)').text();
                if (that.first != t) {
                    that.first = t;
                    that.searchPage();
                    that.projectPage();
                    that.speedVisit();
                }
            }, 200);
            that.autoLoad();
            GM_addStyle(githubcss);
        }
    }

    function SegmentfaultHelper(f) {
        var root = document.querySelector('#root');
        if(root){
            if(!f){
                if(root.innerText){
                    window.rootHtml = window.rootHtml || root.innerHTML;
                }
            }
            if(f && !root.innerText){
                clearInterval(__sfinter);
                root.innerHTML = window.rootHtml||'';
            }
        }
    }

    /**
     * 超链接部分
     */
    function HrefHelp() { }
    HrefHelp.prototype = {
        ready: function () {
            var eles = document.querySelectorAll('a');
            var host = document.location.host;
            if (eles && eles.length) {
                for (var i = 0; i < eles.length; i++) {
                    var a = eles[i];
                    if (a) {
                        if (host == "www.google.com.hk") {
                            a.target = "_blank";
                        } else if (host == "bbs.125.la") {
                            var f = "" + a.onclick;
                            if (f.includes('atarget(this)')) {
                                a.target = "_blank";
                                a.onclick = null;
                            }
                        } else if (host == "github.com" && a.className == 'v-align-middle') {
                            a.target = "_blank";
                        }
                    }
                }
            }
        }
    };

    function Doc360Helper(){}
    Doc360Helper.prototype = {
      listener: function(){
          setInterval(()=>{document.body.oncopy = function(){};}, 100);
      }
    };

    function loadHtml(url, callback) {
        $.ajax({
            url: url,
            async: true,
            timeOut: 5000,
            type: "GET",
            dataType: "html"
        }).done(function (res) {
            callback(res);
        });
    }

    /**
     * 获取选择的文本
     */
    function selectText() {
        if (document.Selection) {
            //ie浏览器
            return document.selection.createRange().text;
        } else {
            //标准浏览器
            return window.getSelection().toString();
        }
    }

    /**
     * 翻译
     * @param {*} text 
     * @param {*} callback 
     */
    function fanyi(text, callback) {
        if(!text){
           return;
        }
        text = text.replace(/^[\r\n\t\s]+|[\r\n\t\s]+$/g, '').replace(/[\r\n\t]/g, '');
        var call = "YoudaoFanyier.Instance.updateTranslate";
        var time = new Date().valueOf();
        var param = "type=data&only=on&doctype=jsonp&version=1.1&relatedUrl=http%3A%2F%2Ffanyi.youdao.com%2Fopenapi%3Fpath%3Dweb-mode%26mode%3Dfanyier&keyfrom=test&key=null&callback=" + call + "&q=" + encodeURIComponent(text) + "&ts=" + time;
        GM_xmlhttpRequest({
            method: 'GET',
            url: "http://fanyi.youdao.com/openapi.do?" + param,
            headers: { "Accept": "*/*", "connection": "Keep-Alive", "Content-Type": "charset=utf-8", "Referer": "http://fanyi.youdao.com/openapi?path=web-mode&mode=fanyier" },
            contentType: "application/json",
            dataType: 'json',
            onload: function (response) {
                if (response.statusText == 'OK') {
                    try {
                        var res = response.responseText;
                        if (/^YoudaoFanyier.Instance.updateTranslate/g.test(res)) {
                            res = res.substring(call.length + 1, res.length - 2);
                        }
                        res = JSON.parse(res);
                        if (callback && res.translation && res.translation.length) {
                            callback(res.translation[0]);
                        }
                    } catch (e) {
                        callback(response.statusText);
                    }
                } else {
                    callback(response.statusText);
                }
            }
        });
    }

    /**
     * 字符串格式化，json格式
     * @param {*} str 
     * @param {*} json 
     */
    function formatByJson(str, json) {
        if (json) {
            for (var key in json) {
                var exc = new RegExp('\{' + key + '\}', "g");
                str = str.replace(exc, json[key]);
            }
        }
        return str;
    }

    /**
     * 判断变量是否为对象
     * @param {*} obj 
     */
    function _isObject(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    }
})();
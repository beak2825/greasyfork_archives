// ==UserScript==
// @name         getAppInfo
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  getApp info and app images from app Market
// @author       WhiteCat
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcss.com/camanjs/4.1.2/caman.full.min.js
// @match        *://sj.qq.com/myapp/detail*
// @match        *://cps.guopan.cn/tpls/gameManage.html*
// @match        *://www.wandoujia.com/apps*
// @grant        GM_download
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/397544/getAppInfo.user.js
// @updateURL https://update.greasyfork.org/scripts/397544/getAppInfo.meta.js
// ==/UserScript==
(function() {
    'use strict';
    //获取名字
    var appname;
    //获取版本
    var appversion;
    //获取大小
    var appsize;
    //获取appurl
    var appurl;
    //获取介绍
    var appmore;
    //获取appPic
    var appImgs = [];
    //logo
    var logourl;
    //imgs
    var imgs;
    var tail = ["内购破解版下载","破解版下载","下载",""]

    // 添加按钮
    const copyall = addFloatButton('ALL', () => getAll())
    const copyinfo = addFloatButton('Info', () => getWDinfo())
    const copyimg = addFloatButton('Img', () => getAppImg())
    function addFloatButton (text, onclick) {
        if (!document.addFloatButton) {
            const buttonContainer = document.body.appendChild(document.createElement('div')).attachShadow({ mode: 'open' })
            buttonContainer.innerHTML = '<style>:host{position:fixed;top:3px;right:40px;z-index:2147483647;height:0}#i{display:none}*{float:left;margin:4px;padding:1em;outline:0;border:0;border-radius:5px;background:#1e88e500;box-shadow:0 1px 4px rgba(0,0,0,.1);color:#fff;font-size:14px;line-height:0;transition:.3s}:active{background:#42a5f5;box-shadow:0 2px 5px rgba(0,0,0,.2)}button:active{transition:0s}:checked~button{visibility:hidden;opacity:0;transform:translateY(-3em)}label{border-radius:50%}:checked~label{opacity:.3;transform:translateY(3em)}</style><input id=i type=checkbox><label for=i></label>'
            document.addFloatButton = (text, onclick) => {
                const button = document.createElement('button')
                button.setAttribute("id","flybtn");
                button.textContent = text
                button.addEventListener('click', onclick)
                return buttonContainer.appendChild(button)
            }
        }
        return document.addFloatButton(text, onclick)
    }
    //click
    function getAll() {
        getInfo();
        getAppImg();
    }
    //去除空格
    function Trim(str, is_global) {
        var result;
        result = str.replace(/(^\s+)|(\s+$)/g, "");
        if (is_global.toLowerCase() == "g") {
            result = result.replace(/\s/g, "");
        }
        return result;
    }
    function getInfo(){
        var host = window.location.host;
        if(host.indexOf("guopan")!= -1){
            getGPinfo();
        }if(host.indexOf("qq")!= -1){
            getQinfo();
        }if(host.indexOf("wandoujia")!= -1){
            getWDinfo();
        }
    }
    //获取appinfo
    function getQinfo() {
        //appinfo = Trim(appinfo,"g");
        //var info = "游戏名： "+appname+"\n"+"版本： "+appversion+"\n"+"大小： "+appsize+"\n"+"链接： "+appurl+"\n"+"简介：\n "+appmore;
        //获取应用宝信息
        //获取名字
        appname = $(".det-name-int").text();
        //获取版本
        appversion = $(".det-othinfo-data").eq(0).text().toLowerCase();
        //获取大小
        appsize = $(".det-size").text() + 'B';
        //获取appurl
        appurl = $(".det-down-btn").attr("data-apkurl");
        //获取介绍
        appmore = $("#J_DetAppDataInfo").text().trim();
        //获取图片
        logourl = $(".det-icon img").attr("src");
        //清零
        appImgs.length = 0;
        imgs = $("#J_PicTurnImgBox .pic-img-box").each(function(inedx, item) {
            let img = $(this).children('img');
            appImgs.push($(img).attr("data-src"));
        });
        jsonSet(appname,appversion,appsize,appurl);
    }
    function getGPinfo() {
        appname = $("p.title.ng-binding").text();
        //获取版本
        appversion = $("span.ng-binding").eq(0).text().replace(/版本：/, "v");
        //获取大小
        appsize = $("span.ng-binding").eq(1).text().replace(/大小：/, "");
        //获取appurl
        appurl = $("button.btn.copy.clipboard.ng-binding").attr("data-clipboard-text");
        //获取介绍
        appmore = $("div.desc.ng-binding").text().trim();
        //获取logo
        //logourl = $(".imgUrl .ng-scope").attr("src");
        //获取图片
        appImgs.length = 0;
        logourl = $("a.imgUrl.ng-scope img").attr("src");
        //console.log($("div.allImg.clearfix"));
        imgs = $("div.allImg.clearfix .ng-scope").each(function(inedx, item) {
            appImgs.push($(this).attr("src"));
        });
        jsonSet(appname,appversion,appsize,appurl);
    }
    //豌豆夹
    function getWDinfo() {
        var info = "游戏名： "+appname+"\n"+"版本： "+appversion+"\n"+"大小： "+appsize+"\n"+"链接： "+appurl+"\n"+"简介：\n "+appmore;
        appname = $("span.title").text();
        //获取版本
        appversion = "v"+$("dl.infos-list dd").eq(2).text().trim();
        //获取大小
        appsize = $("dl.infos-list dd").eq(0).text().trim();
        //获取appurl
        appurl = $("a.normal-dl-btn ").attr("href");
        //获取介绍
        appmore = $("div.desc-info").text().trim();
        //获取logo
        logourl = $("div.app-icon img").attr("src");
        //获取图片
        appImgs.length = 0;
        //console.log($("div.allImg.clearfix"));
        imgs = $("div.overview img").each(function(inedx, item) {
           console.log($(this).attr("src"));
           appImgs.push($(this).attr("src"));
        });
        jsonSet(appname,appversion,appsize,appurl);
    }
    //设置json
    function jsonSet(name,version,size,url){
    var object = {};
        var params = [];
        var obj = {};
        obj["appversion"] = version;
        obj["appsize"] = size;
        obj["appurl"] = url;
        //obj["appmore"] = appmore;
        params.push(obj);
        object['appname'] = name;
        object['appinfo'] = params;
        var json = JSON.stringify(object);
        GM_setClipboard(json);
        //alert("已复制好，可贴粘。");
    }
    //格式化json输出
    var formatJson = function(json, options) {
        var reg = null,
        formatted = '',
        pad = 0,
        PADDING = '    '; // one can also use '\t' or a different number of spaces
        // optional settings
        options = options || {};
        // remove newline where '{' or '[' follows ':'
        options.newlineAfterColonIfBeforeBraceOrBracket = (options.newlineAfterColonIfBeforeBraceOrBracket === true) ? true: false;
        // use a space after a colon
        options.spaceAfterColon = (options.spaceAfterColon === false) ? false: true;

        // begin formatting...
        // make sure we start with the JSON as a string
        if (typeof json !== 'string') {
            json = JSON.stringify(json);
        }
        // parse and stringify in order to remove extra whitespace
        json = JSON.parse(json);
        json = JSON.stringify(json);

        // add newline before and after curly braces
        reg = /([\{\}])/g;
        json = json.replace(reg, '\r\n$1\r\n');

        // add newline before and after square brackets
        reg = /([\[\]])/g;
        json = json.replace(reg, '\r\n$1\r\n');

        // add newline after comma
        reg = /(\,)/g;
        json = json.replace(reg, '$1\r\n');

        // remove multiple newlines
        reg = /(\r\n\r\n)/g;
        json = json.replace(reg, '\r\n');

        // remove newlines before commas
        reg = /\r\n\,/g;
        json = json.replace(reg, ',');

        // optional formatting...
        if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
            reg = /\:\r\n\{/g;
            json = json.replace(reg, ':{');
            reg = /\:\r\n\[/g;
            json = json.replace(reg, ':[');
        }
        if (options.spaceAfterColon) {
            reg = /\:/g;
            json = json.replace(reg, ': ');
        }

        $.each(json.split('\r\n'),
        function(index, node) {
            var i = 0,
            indent = 0,
            padding = '';

            if (node.match(/\{$/) || node.match(/\[$/)) {
                indent = 1;
            } else if (node.match(/\}/) || node.match(/\]/)) {
                if (pad !== 0) {
                    pad -= 1;
                }
            } else {
                indent = 0;
            }

            for (i = 0; i < pad; i++) {
                padding += PADDING;
            }

            formatted += padding + node + '\r\n';
            pad += indent;
        });

        return formatted;
    };
    //图片下载
    function getAppImg() {
        //setTimeout(function(){ alert("Hello"); }, 3000);
        //console.log(appImgs);
        GM_download(logourl, appname + "logo");
        //遍历图片
        if (appImgs == null || appImgs == "") {
            alert("Info");
        } else {
            for (var i = 0; i < 4; i++) {
                //console.log(appImgs[i]);
                GM_download(appImgs[i], appname + tail[i]);
            }
        }
        //console.log(logourl);
    }
    //图片处理
    function imgHandle(imgurl) {
        var canvas = document.createElement('canvas');
        canvas.setAttribute("id", "flycanvans");
        Caman("#canvas-id", imgurl,
        function() {
            this.resize({
                width: 500,
                height: 300
            });
            this.render();
        });
    }
})();
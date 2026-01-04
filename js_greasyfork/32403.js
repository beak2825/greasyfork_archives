// ==UserScript==
// @name      改:Google & baidu Switcher (ALL in One)
// @namespace  https://openuserjs.org/scripts/t3xtf0rm4tgmail.com/Google_baidu_Switcher_(ALL_in_One)
// @author    F9y4ng
// @version    1.4.0.1
// @description  分别在百度和google的搜索结果页面增加搜索跳转按钮，使用到外链微软CDN的jquery-1.7.2.min.js，不懂跳墙使用GOOGLE的同学请自动忽略。自动判断百度和google对JQUERY的载入，并动态载入Jquery.js。
// @include        https://www.google.co.jp/*
// @include        http://www.google.co.jp/*
// @include        https://www.google.com.hk/*
// @include        http://www.google.com.hk/*
// @include        http://www.google.com/*
// @include        https://www.google.com/*
// @include        http://ipv4.google.com/*
// @include        https://ipv4.google.com/*
// @include        http://www.baidu.com/*
// @include        https://www.baidu.com/*
// @license        MPL
// @copyright      2015+, f9y4ng
// @grant          none

// @downloadURL https://update.greasyfork.org/scripts/32403/%E6%94%B9%3AGoogle%20%20baidu%20Switcher%20%28ALL%20in%20One%29.user.js
// @updateURL https://update.greasyfork.org/scripts/32403/%E6%94%B9%3AGoogle%20%20baidu%20Switcher%20%28ALL%20in%20One%29.meta.js
// ==/UserScript==

if ("undefined" == typeof(jQuery)){
    loadJs("for_google","https://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.2.min.js",callbackFunction);
}
else{
$(document).ready(function() {
    function baiduswitchgoogle() {
        $('.s_btn_wr').after('<div class="s_btn_wr bg" style="display:inline-block;margin-left:10px"><input type="button" id="ggyx" value="Google一下" class="bg s_btn" ></div>');
        $('#ggyx').on({
            click: function () {
                window.open("https://www.google.com.hk/webhp?gws_rd=ssl#newwindow=1&hl=zh-CN&q=" + encodeURIComponent($('#kw') .val()));
                return false;
            }
        });
    }
	//搜索这个更兼容
    if(window.location.href.indexOf("/s?") || window.location.href.indexOf("/baidu?") > 0){
        baiduswitchgoogle();
    }
    //检测从baidu首页进入的搜索（补漏）
    if(/^http(s)?:\/\/(www\.)?baidu\.com\/$/ig.test(window.location.href)){
        $("#kw").off('click').on({
            keydown: function () {
                if($('#ggyx').length<1 && $('#kw').val().length>0){baiduswitchgoogle();}
            }
        }).on({
             paste: function () {
                if($('#ggyx').length<1){baiduswitchgoogle();}
            }
        });
    }
});
}
function callbackFunction()
{
    $(document).ready(function() {
        function googleswitchbaidu() {
            $('#sfdiv').after('<div id="sfdiv_bd" style="display:inline-block;position:relative;height:10px;width:80px;right:-90px;top:-48px;float:right;"><button id="bdyx" class="lsbb kpbb" style="height:45px;margin-top:4px;cursor:pointer"><span class="vspii _wtf _Qtf" style="font-size:16px"><svg style="margin-top:6px" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg></span><span style="font-size:16px">百度一下</span></button></div>');
            $('#sfdiv_bd').off('click') .on({
                click: function () {
                    window.open("https://www.baidu.com/s?wd=" + encodeURIComponent($('#lst-ib') .val()));
                    return false;
                }
            });
        }
        if(window.location.hash.lastIndexOf("q=")>0 || window.location.search.lastIndexOf("q=")>0){
            googleswitchbaidu();
        }
        //2017/1/1 F9y4ng 增加Google搜索自动提交，按钮隐藏和补漏
        if(/(www\.|ipv4\.)?google\.com(\.hk)?/ig.test(window.location.href)){
            $("#lst-ib").off('click').on({
                blur: function () {
                    $('input[type="submit"]').submit();
                    if($('#bdyx').length<1){
                        setTimeout(function(){googleswitchbaidu();},1500);
                    }
                }
            });
        }
    });
}
function loadJs(sid,jsurl,callback){
    var nodeHead = document.getElementsByTagName('head')[0];
    var nodeScript = null;
    if(document.getElementById(sid) === null){
        nodeScript = document.createElement('script');
        nodeScript.setAttribute('type', 'text/javascript');
        nodeScript.setAttribute('src', jsurl);
        nodeScript.setAttribute('id',sid);
        if (callback !== null) {
            nodeScript.onload = nodeScript.onreadystatechange = function(){
                if (nodeScript.ready) {
                    return false;
                }
                if (!nodeScript.readyState || nodeScript.readyState == "loaded" || nodeScript.readyState == 'complete') {
                    nodeScript.ready = true;
                    callback();
                }
            };
        }
        nodeHead.appendChild(nodeScript);
    } else {
        if(callback !== null){
            callback();
        }
    }
}
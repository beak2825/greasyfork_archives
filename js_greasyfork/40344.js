// ==UserScript==
// @name      Google & baidu Switcher（keydown）
// @namespace http://tampermonkey.net/
// @author    violet
// @version    1.0
// @description    分别在百度和google的搜索结果页面增加搜索跳转按钮，在F9y4ng作者的源代码之上改进。增加Ctrl+Enter键盘切换百度和google的搜索结果事件。
// @include         /^https?\:\/\/www.google.[^\/]+/
// @include        http://www.baidu.com/*
// @include        https://www.baidu.com/*
// @grant          none

// @downloadURL https://update.greasyfork.org/scripts/40344/Google%20%20baidu%20Switcher%EF%BC%88keydown%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/40344/Google%20%20baidu%20Switcher%EF%BC%88keydown%EF%BC%89.meta.js
// ==/UserScript==


if ("undefined" == typeof(jQuery)){
    loadJs("for_google","https://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.2.min.js",callbackFunction);
}
else{
$(document).ready(function() {

     document.onkeydown = function()
	        {
	            var oEvent = window.event;
	            if (oEvent.keyCode == 13 && oEvent.ctrlKey) {
	                 window.open("https://www.google.com/search?source=hp&q=" + encodeURIComponent($('#kw') .val()));
                     return false;
	            }
	        };

    function baiduswitchgoogle() {
        $('.s_btn_wr').after('<div class="s_btn_wr bg" style="display:inline-block;margin-left:10px"><input type="button" id="ggyx" value="Google一下" class="bg s_btn" ></div>');
        $('#ggyx').on({
            click: function () {
                window.open("https://www.google.com/search?source=hp&q=" + encodeURIComponent($('#kw') .val()));
                return false;
            }
        });
    }
    if(window.location.search.lastIndexOf("wd=")>0 || window.location.href.lastIndexOf("/s?")>0){
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

           document.onkeydown = function()
	        {
	            var oEvent = window.event;
	            if (oEvent.keyCode == 13 && oEvent.ctrlKey) {
	                 window.open("https://www.baidu.com/s?wd=" + encodeURIComponent($('#lst-ib') .val()));
                    return false;
	            }
	        };


         function googleswitchbaidu() {
             $('.tsf-p').css('width','750px');
             $('.sfibbbc').after('<input id="fmq1" type="button" style="width: 100px;height: 44px;cursor:pointer;float:right;margin-top:-45px;" value="百度一下">');
             $('#fmq1').off('click') .on({
                click: function () {
                    window.open("https://www.baidu.com/s?wd=" + encodeURIComponent($('#lst-ib') .val()));
                    return false;
                }
            });
        }


        if(window.location.hash.lastIndexOf("q=")>0 || window.location.search.lastIndexOf("q=")>0){
            googleswitchbaidu();
        }
        //2017/12/22 F9y4ng GOOGLE首页自动提交搜索，延时
        if(/^http(s)?:\/\/(www\.)?google\.\w+(\.\w+)?\/$/ig.test(window.location.href)){
            $("#lst-ib").off('click').on({
                blur: function () {
                    $("form").submit();
                    if($('#bdyx').length<1){
                        setTimeout(function(){googleswitchbaidu();},3000);
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
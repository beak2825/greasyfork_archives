// ==UserScript==
// @name         自动替换电影天堂下载链接为迅雷链接
// @namespace    undefined
// @version      0.2.5
// @description  去除获取最新迅雷检测，直接迅雷下载
// @author       x2009again
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// require      http://pstatic.xunlei.com/js/base64.js
// @require      https://greasyfork.org/scripts/32483-base64/code/base64.js?version=213081
// @match        *://www.dy2018.com/*
// @match        *://www.ygdy8.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/33261/%E8%87%AA%E5%8A%A8%E6%9B%BF%E6%8D%A2%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%E4%B8%BA%E8%BF%85%E9%9B%B7%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/33261/%E8%87%AA%E5%8A%A8%E6%9B%BF%E6%8D%A2%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%E4%B8%BA%E8%BF%85%E9%9B%B7%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

var counter = 0;
var linkflag = false;

function myThunderEncode(t_url)
{
     var thunderPrefix = "AA";
    var thunderPosix = "ZZ";
    var thunderTitle = "thunder://";
    var tem_t_url = t_url;
    var thunderUrl = thunderTitle + base64.encode(base64.utf16to8(thunderPrefix + tem_t_url + thunderPosix));
    return thunderUrl;
}

function myinit() {
    var $thunderlink = $("#Zoom").find('a');
    $thunderlink.each(function(index,value){
        linkflag = true;
        $(this).attr("target","_self");
        $(this).attr("onclick","");
        if($(this).attr("thunderrestitle"))
        {
            $(this).attr("href",myThunderEncode($(this).attr("thunderrestitle")));
        }
        else if($(this).attr("src"))
        {
            $(this).attr("href",myThunderEncode($(this).attr("src")));
        }
    });

}


var t = window.setInterval(function () { //设置一个延时循环，每隔200ms选择一下所需的元素，当所需的元素存在时，开始脚本，同时停止延时循环
    myinit();
    if (linkflag) {
        window.clearInterval(t);
    }
    else {
        if (counter < 5) {
            //console.log('waiting');
            counter++;
        }
        else {
            window.clearInterval(t);
            //console.log('out of time');
        }
    }
}, 200);

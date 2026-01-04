// ==UserScript==
// @name         auto page down
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       lemodd@qq.com
// @include      *

// @require      https://code.jquery.com/jquery-latest.js
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/30653/auto%20page%20down.user.js
// @updateURL https://update.greasyfork.org/scripts/30653/auto%20page%20down.meta.js
// ==/UserScript==


url = window.location.host;
GM_log('URL: '+url);

//(function(){
  // 固定一个标签显示当前页面位置
$('body').append('<span id="lb2" style="top:130px;left:0px;position:fixed;"></span>');
$('body').append('<span id="lb"  style="top:100px;left:0px;position:fixed;"></span>');

//})();

//各网站对应的翻页代码
url_op={'jandan.net'       : '.previous-comment-page',
        'kindleren.com'    : '.nxt',
        'www.baidu.com'    : '.n',       //百度前翻和后翻都是是'.n'，所以在翻页时要区分下
        'www.gaoloumi.com' : '.nxt',
        'www.rologo.com'   : '.fr',
        'blog.sina.com.cn' : '.SG_pgnext',
        'cn.bing.com'      : '.sb_pagN',
       };
//alert(url_op[url]);


$(function(){
       $(document).keydown(function(event){
             if((event.altKey && event.keyCode == 83)) {
                  //在这里接收的是Alt+S事件,S的ASCII码为83。
                 alert( 'hello' );
             } 
       });
});


//窗口滚动到底时自动翻页
$(document).scroll(function(){
    //当前高度
    var ch = parseInt($(document).scrollTop());
    $("#lb").text(ch);
    //总高度
    var h =$(document).height()- $(window).height() ;
    //alert(h);
    $("#lb2").text(h);
    
    
    //百度前翻和后翻都是是'.n'后翻是第二个
    switch (url){
        case 'www.baidu.com':
            i=1;
            break;
        case 'www.rologo.com':
            i=1;
            break;
        //case 'cn.bing.com':
            //i=0;
           // break;
        default:
            i=0;
    }
    GM_log('i:'+i);
    /*
    if (url == 'www.baidu.com' ){
        i=1;
    }else{
        i=0;
    }
    */
    
    //如果当前高度大于总高度，就自动翻页
    if (ch>=h-2){
        //翻页
        setTimeout(function(){
            ch = parseInt($(document).scrollTop());
            
            if(ch>h-2) {$(url_op[url]).get(i).click();}
        },
                   2000);//留下2秒的延时，如果不想翻页，2秒内向上翻，可以取消。

    }
});










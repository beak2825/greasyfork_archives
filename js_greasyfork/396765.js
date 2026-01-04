// ==UserScript==
// @name         视频
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       yefeng
// @include      *v.youku.com/v_*
// @include      *m.youku.com/v*
// @include      *m.youku.com/a*
// @include      *v.qq.com/x/*
// @include      *v.qq.com/play*
// @include      *v.qq.com/cover*
// @include      *v.qq.com/tv/*
// @include      *film.sohu.com/album/*
// @include      *tv.sohu.com/*
// @include      *.iqiyi.com/v_*
// @include      *.iqiyi.com/w_*
// @include      *.iqiyi.com/a_*
// @include      *.le.com/ptv/vplay/*
// @include      *.tudou.com/listplay/*
// @include      *.tudou.com/albumplay/*
// @include      *.tudou.com/programs/view/*
// @include      *.tudou.com/v*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @require      https://cdn.bootcss.com/sweetalert/2.1.2/sweetalert.min.js
// @require      https://code.jquery.com/jquery-latest.js
// @license      GPL License
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/396765/%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/396765/%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';


   var x=window.location.href;//获取当前的链接
    var y0='Https://yun.nxflv.com/?url=';
    var y='https://cdn.yangju.vip/k/?url=';
    var y1='https://cdn.yangju.vip/k/?url=';
    var y2='https://jx.lache.me/cc/?url=';
    var y3='https://api.653520.top/vip/?url=';
    var y4='https://jx.ab33.top/vip/?url=';
Https://yun.nxflv.com/?url=https://www.bilibili.com/bangumi/play/ep307366
    var t=y0+x;
    // Your code here...

        var zhm_html = "<div href='javascript:void(0)' target='_blank' id='zhm_jx_url_lr' style='cursor:pointer;z-index:98;display:block;width:30px;height:30px;line-height:30px;position:fixed;left:0;top:300px;text-align:center;overflow:visible'><img src='https://preview.qiantucdn.com/58pic/13/18/50/05458PICH9c4p8f2cj2bS_PIC2018.jpg!w1024_new_0' height='55' ></div>";
				$("body").append(zhm_html);

        $("#zhm_jx_url_lr").click(function(){
			var play_jx_url = window.location.href;
            if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
                var mobile_html = "<div style='margin:0 auto;padding:10px;'>";
                mobile_html +="<button type='button' style='position:absolute;top:0;right:30px;font-size:30px;line-height: 1;color: #000;text-shadow: 0 1px 0 #fff;cursor: pointer;border:0;background:0 0;' onclick='location.reload();'>×</button>";
                mobile_html += "<div><iframe src='https://www.eggvod.cn/mobile.php?zhm_jx="+play_jx_url +"' allowtransparency=true frameborder='0' scrolling='no' allowfullscreen=true allowtransparency=true name='jx_play'style='height:600px;width:100%'></iframe></div>"
                mobile_html += "</div>";
               $("body").html(mobile_html);
            } else {
         //       $.get('https://www.eggvod.cn/jxcode.php',{in:81566699},function(data){
        //            location.href='https://www.eggvod.cn/jx.php?lrspm='+data+'&zhm_jx='+play_jx_url;
       //        });
                setTimeout(window.open(t),3000);
            }
		});

       // setTimeout(window.open(t),3000);
    
    //if(x==''){}
    
    //window.open("http://www.baidu.com");
})();
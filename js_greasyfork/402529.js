// ==UserScript==
// @name         VIP视频解析
// @namespace 	 tw
// @version      2.4.0
// @description  全网VIP视频解析
// @author       hahaha
// @icon         https://static.easyicon.net/preview/125/1254283.gif
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
// @include      *.mgtv.com/b/*
// @include      *.acfun.cn/v/*
// @include      *.bilibili.com/video/*
// @include      *.bilibili.com/anime/*
// @include      *.bilibili.com/bangumi/play/*
// @include      *.pptv.com/show/*
// @include      *://*.baofeng.com/play/*
// @downloadURL https://update.greasyfork.org/scripts/402529/VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/402529/VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function() {
    'use strict'
        var play_url = window.location.href;
            var arr = new Array();
            arr = play_url.split('?')
            var get_url = arr[0];
            var jx_title=new Array()
                jx_title[0]="youku.com"
                jx_title[1]="iqiyi.com"
                jx_title[2]="le.com"
                jx_title[3]="qq.com"
                jx_title[4]="tudou.com"
                jx_title[5]="mgtv.com"
                jx_title[6]="sohu.com"
                jx_title[7]="acfun.cn"
                jx_title[8]="bilibili.com"
                jx_title[9]="pptv.com"
                jx_title[10]="baofeng.com"
                var title_result = false;
                for(var n=0;n<jx_title.length;n++){
                    if(get_url.indexOf(jx_title[n])!= -1){
                        var html = "<div href='javascript:void(0)' target='_blank' id='jx_url_lr' style='cursor:pointer;z-index:98;display:block;width:30px;height:30px;line-height:30px;position:fixed;left:0;top:300px;text-align:center;overflow:visible'><img src='https://www.easyicon.net/api/resizeApi.php?id=1191986&size=128' height='55' ></div>";
                        $("body").append(html);
                    }
                }
                $("#jx_url_lr").click(function(){
                    if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
                        var mobile_html = "<div style='margin:0 auto;padding:10px;'>";
                        mobile_html +="<button type='button' style='position:absolute;top:0;right:30px;font-size:30px;line-height: 1;color: #000;text-shadow: 0 1px 0 #fff;cursor: pointer;border:0;background:0 0;' onclick='location.reload();'>×</button>";
                        mobile_html += "<div><iframe src='https://api.yueliangjx.com/?url="+play_jx_url +"' allowtransparency=true frameborder='0' scrolling='no' allowfullscreen=true allowtransparency=true name='jx_play'style='height:600px;width:100%'></iframe></div>"
                        mobile_html += "</div>";
                       $("body").html(mobile_html);
                    }else {
                    location.href='https://api.yueliangjx.com/?url='+window.location.href;
                    }
                });
    })();

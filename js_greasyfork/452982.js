// ==UserScript==
// begin
// name     快手
// url      https://www.kuaishou.com/brilliant
// end
// @name    优酷、爱奇艺、腾讯、芒果等全网VIP视频破解播放，知乎视频、微信公众号视频下载，QQ音乐网易云音乐及MV下载、酷狗音乐、喜马拉雅、蜻蜓FM听书有声小说下载。长期更新，放心使用。
// @namespace http://gongju.dadiyouhui03.cn/app/tool/youhou/index.html
// @author war3
// @version          14
// @description      B站视频大会员视频解析播放，QQ音乐MV下载、网易云音乐MV下载、抖音视频下载、快手视频下载无水印、知乎视频、微信公众号视频下载，酷狗音乐下载、喜马拉雅、蜻蜓FM听书有声小说下载。优酷、爱奇艺、腾讯等全网VIP视频免费破解去广告在线播放，长期更新，放心使用。
// @include      *.zhihu.com/*
// @include      *.bilibili.com/*
// @include      *v.youku.com/v_*
// @include      *m.youku.com/v*
// @include      *m.youku.com/a*
// @include      *v.qq.com/x/cover/*
// @include      *v.qq.com/x/page/*
// @include      *v.qq.com/play*
// @include      *v.qq.com/cover*
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
// @include      *.qq.com/*
// @include      *music.163.com/*
// @include      *.kugou.com/*
// @include      *.ximalaya.com/*
// @include      *.qingting.fm/*
// @include      *.douyin.com/*
// @include      *.kuaishou.com/*
// @include      *dan-teng.top/*
// @include      *://*x.com/*
// @require https://cdn.bootcdn.net/ajax/libs/jquery/2.2.4/jquery.min.js
// @require https://cdn.bootcdn.net/ajax/libs/sweetalert/2.1.2/sweetalert.min.js
// @require https://cdn.bootcdn.net/ajax/libs/jquery.qrcode/1.0/jquery.qrcode.min.js
// @require https://cdn.bootcdn.net/ajax/libs/html2canvas/0.5.0-beta4/html2canvas.js
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @run-at           document-idle
// @grant             unsafeWindow
// @grant             GM_xmlhttpRequest
// @grant             GM_setClipboard
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_deleteValue
// @grant             GM_openInTab
// @grant             GM_registerMenuCommand
// @grant             GM_unregisterMenuCommand
// @grant             GM.getValue
// @grant             GM.setValue
// @grant             GM_info
// @grant             GM_notification
// @grant             GM_getResourceText
// @grant             GM_download
// @license             End-User License Agreement
// @noframes
// @connect *
// @connect     zhihu.com
// @connect     weixin.qq.com
// @connect  wwwapi.kugou.com
// @connect  u.y.qq.com
// @connect  v1.ak47.ink
// @downloadURL https://update.greasyfork.org/scripts/452982/%E4%BC%98%E9%85%B7%E3%80%81%E7%88%B1%E5%A5%87%E8%89%BA%E3%80%81%E8%85%BE%E8%AE%AF%E3%80%81%E8%8A%92%E6%9E%9C%E7%AD%89%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E7%A0%B4%E8%A7%A3%E6%92%AD%E6%94%BE%EF%BC%8C%E7%9F%A5%E4%B9%8E%E8%A7%86%E9%A2%91%E3%80%81%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%EF%BC%8CQQ%E9%9F%B3%E4%B9%90%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E5%8F%8AMV%E4%B8%8B%E8%BD%BD%E3%80%81%E9%85%B7%E7%8B%97%E9%9F%B3%E4%B9%90%E3%80%81%E5%96%9C%E9%A9%AC%E6%8B%89%E9%9B%85%E3%80%81%E8%9C%BB%E8%9C%93FM%E5%90%AC%E4%B9%A6%E6%9C%89%E5%A3%B0%E5%B0%8F%E8%AF%B4%E4%B8%8B%E8%BD%BD%E3%80%82%E9%95%BF%E6%9C%9F%E6%9B%B4%E6%96%B0%EF%BC%8C%E6%94%BE%E5%BF%83%E4%BD%BF%E7%94%A8%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/452982/%E4%BC%98%E9%85%B7%E3%80%81%E7%88%B1%E5%A5%87%E8%89%BA%E3%80%81%E8%85%BE%E8%AE%AF%E3%80%81%E8%8A%92%E6%9E%9C%E7%AD%89%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E7%A0%B4%E8%A7%A3%E6%92%AD%E6%94%BE%EF%BC%8C%E7%9F%A5%E4%B9%8E%E8%A7%86%E9%A2%91%E3%80%81%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%EF%BC%8CQQ%E9%9F%B3%E4%B9%90%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E5%8F%8AMV%E4%B8%8B%E8%BD%BD%E3%80%81%E9%85%B7%E7%8B%97%E9%9F%B3%E4%B9%90%E3%80%81%E5%96%9C%E9%A9%AC%E6%8B%89%E9%9B%85%E3%80%81%E8%9C%BB%E8%9C%93FM%E5%90%AC%E4%B9%A6%E6%9C%89%E5%A3%B0%E5%B0%8F%E8%AF%B4%E4%B8%8B%E8%BD%BD%E3%80%82%E9%95%BF%E6%9C%9F%E6%9B%B4%E6%96%B0%EF%BC%8C%E6%94%BE%E5%BF%83%E4%BD%BF%E7%94%A8%E3%80%82.meta.js
// ==/UserScript==

/*
2021.11.15 新增：抖音快手无水印视频下载！
使用方法：使用浏览器打开你需要下载的短视频链接，然后点击屏幕上的菜单下载
解析视频和音乐的功能如果遇到官方网站更新不能正常使用的话，欢迎反馈，我会及时修复*/
	 
 
    var ozlurlvideo='http://dan-teng.top/app/tool/play.html';
    var ozlurldh='http://dan-teng.top/app/tool/go.html';
    var ozlurlmusic='http://dan-teng.top/app/tool/down.html';
$(document).ready(function(){
	var vurl = location.href;
	var baidspjayumin=document.domain;
	 function closeytAds(){
	  }

   if (window.top == window.self){
if($("#zhe_nav").length>0){
 }else{
if (window.location.href.indexOf(window.atob('ZGFuLXRlbmcudG9w')) >=0 && (window.location.href.indexOf(window.atob('cGxheS5odG1s')) >=0 || window.location.href.indexOf(window.atob('ZG93bi5odG1s')) >=0 ) ){
        if ($('#configload').length == 0 ) {
 $('body').attr('id','configload');
$('#dataversion').attr('version',GM_info.script.version);
$('#dataversion').html(GM_info.script.updateURL);
        }
  }
 var siddenav = '<div class="zhe_nav bounceInUp animated" id="zhe_nav"><label for="" class="aside-menu" data-cat="gongnue" title="">菜单</label><a title="\u6ca1\u9519\uff0c\u5c31\u662f\u70b9\u6211\uff0c\u5c31\u53ef\u4ee5\u514d\u8d39\u64ad\u653e\u0056\u0049\u0050\u89c6\u9891\u4e86\u54e6\uff1f\u6211\u5389\u5bb3\u5417\u0028\u3003\u0026\u0023\u0033\u0039\u003b\u25bd\u0026\u0023\u0033\u0039\u003b\u3003\u0029" data-cat="gogob" class="menu-item menu-line menu-second">视频<br>播放</a></div>';

 	   var siddecss = ".zhe_nav{position:fixed;right:-50px;z-index:9999999!important;top:350px;width:260px;height:260px;-webkit-filter:url(#goo);filter:url(#goo);-ms-user-select:none;-moz-user-select:none;-webkit-user-select:none;user-select:none;opacity:.75}.zhe_nav.no-filter{-webkit-filter:none;filter:none}.zhe_nav .aside-menu{position:absolute;width:70px;height:70px;-webkit-border-radius:50%;border-radius:50%;background:#f34444;left:0;top:0;right:0;bottom:0;margin:auto;text-align:center;line-height:70px;color:#fff;font-size:20px;z-index:1;cursor:move}.zhe_nav .menu-item{position:absolute;width:60px;height:60px;background-color:#ff7676;left:0;top:0;right:0;bottom:0;margin:auto;line-height:60px;text-align:center;-webkit-border-radius:50%;border-radius:50%;text-decoration:none;color:#fff;-webkit-transition:background .5s,-webkit-transform .6s;transition:background .5s,-webkit-transform .6s;-moz-transition:transform .6s,background .5s,-moz-transform .6s;transition:transform .6s,background .5s;transition:transform .6s,background .5s,-webkit-transform .6s,-moz-transform .6s;font-size:14px;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}.zhe_nav .menu-item:hover{background:#a9c734}.zhe_nav .menu-line{line-height:20px;padding-top:10px}.zhe_nav:hover{opacity:1}.zhe_nav:hover .aside-menu{-webkit-animation:jello 1s;-moz-animation:jello 1s;animation:jello 1s}.zhe_nav:hover .menu-first{-webkit-transform:translate3d(0,-135%,0);-moz-transform:translate3d(0,-135%,0);transform:translate3d(0,-135%,0)}.zhe_nav:hover .menu-second{-webkit-transform:translate3d(-120%,-70%,0);-moz-transform:translate3d(-120%,-70%,0);transform:translate3d(-120%,-70%,0)}.zhe_nav:hover .menu-third{-webkit-transform:translate3d(-120%,70%,0);-moz-transform:translate3d(-120%,70%,0);transform:translate3d(-120%,70%,0)}.zhe_nav:hover .menu-fourth{-webkit-transform:translate3d(0,135%,0);-moz-transform:translate3d(0,135%,0);transform:translate3d(0,135%,0)}.zhe_nav:hover .menu-fifth{-webkit-transform:translate3d(120%,70%,0);-moz-transform:translate3d(120%,70%,0);transform:translate3d(120%,70%,0)}.zhe_nav:hover .menu-sixth{-webkit-transform:translate3d(120%,-70%,0);-moz-transform:translate3d(120%,-70%,0);transform:translate3d(120%,-70%,0)}@-webkit-keyframes jello{from,11.1%,to{-webkit-transform:none;transform:none}22.2%{-webkit-transform:skewX(-12.5deg) skewY(-12.5deg);transform:skewX(-12.5deg) skewY(-12.5deg)}33.3%{-webkit-transform:skewX(6.25deg) skewY(6.25deg);transform:skewX(6.25deg) skewY(6.25deg)}44.4%{-webkit-transform:skewX(-3.125deg) skewY(-3.125deg);transform:skewX(-3.125deg) skewY(-3.125deg)}55.5%{-webkit-transform:skewX(1.5625deg) skewY(1.5625deg);transform:skewX(1.5625deg) skewY(1.5625deg)}66.6%{-webkit-transform:skewX(-.78125deg) skewY(-.78125deg);transform:skewX(-.78125deg) skewY(-.78125deg)}77.7%{-webkit-transform:skewX(0.390625deg) skewY(0.390625deg);transform:skewX(0.390625deg) skewY(0.390625deg)}88.8%{-webkit-transform:skewX(-.1953125deg) skewY(-.1953125deg);transform:skewX(-.1953125deg) skewY(-.1953125deg)}}@-moz-keyframes jello{from,11.1%,to{-moz-transform:none;transform:none}22.2%{-moz-transform:skewX(-12.5deg) skewY(-12.5deg);transform:skewX(-12.5deg) skewY(-12.5deg)}33.3%{-moz-transform:skewX(6.25deg) skewY(6.25deg);transform:skewX(6.25deg) skewY(6.25deg)}44.4%{-moz-transform:skewX(-3.125deg) skewY(-3.125deg);transform:skewX(-3.125deg) skewY(-3.125deg)}55.5%{-moz-transform:skewX(1.5625deg) skewY(1.5625deg);transform:skewX(1.5625deg) skewY(1.5625deg)}66.6%{-moz-transform:skewX(-.78125deg) skewY(-.78125deg);transform:skewX(-.78125deg) skewY(-.78125deg)}77.7%{-moz-transform:skewX(0.390625deg) skewY(0.390625deg);transform:skewX(0.390625deg) skewY(0.390625deg)}88.8%{-moz-transform:skewX(-.1953125deg) skewY(-.1953125deg);transform:skewX(-.1953125deg) skewY(-.1953125deg)}}@keyframes jello{from,11.1%,to{-webkit-transform:none;-moz-transform:none;transform:none}22.2%{-webkit-transform:skewX(-12.5deg) skewY(-12.5deg);-moz-transform:skewX(-12.5deg) skewY(-12.5deg);transform:skewX(-12.5deg) skewY(-12.5deg)}33.3%{-webkit-transform:skewX(6.25deg) skewY(6.25deg);-moz-transform:skewX(6.25deg) skewY(6.25deg);transform:skewX(6.25deg) skewY(6.25deg)}44.4%{-webkit-transform:skewX(-3.125deg) skewY(-3.125deg);-moz-transform:skewX(-3.125deg) skewY(-3.125deg);transform:skewX(-3.125deg) skewY(-3.125deg)}55.5%{-webkit-transform:skewX(1.5625deg) skewY(1.5625deg);-moz-transform:skewX(1.5625deg) skewY(1.5625deg);transform:skewX(1.5625deg) skewY(1.5625deg)}66.6%{-webkit-transform:skewX(-.78125deg) skewY(-.78125deg);-moz-transform:skewX(-.78125deg) skewY(-.78125deg);transform:skewX(-.78125deg) skewY(-.78125deg)}77.7%{-webkit-transform:skewX(0.390625deg) skewY(0.390625deg);-moz-transform:skewX(0.390625deg) skewY(0.390625deg);transform:skewX(0.390625deg) skewY(0.390625deg)}88.8%{-webkit-transform:skewX(-.1953125deg) skewY(-.1953125deg);-moz-transform:skewX(-.1953125deg) skewY(-.1953125deg);transform:skewX(-.1953125deg) skewY(-.1953125deg)}}.animated{-webkit-animation-duration:1s;-moz-animation-duration:1s;animation-duration:1s;-webkit-animation-fill-mode:both;-moz-animation-fill-mode:both;animation-fill-mode:both}@-webkit-keyframes bounceInUp{from,60%,75%,90%,to{-webkit-animation-timing-function:cubic-bezier(0.215,.61,.355,1);animation-timing-function:cubic-bezier(0.215,.61,.355,1)}from{opacity:0;-webkit-transform:translate3d(0,800px,0);transform:translate3d(0,800px,0)}60%{opacity:1;-webkit-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}75%{-webkit-transform:translate3d(0,10px,0);transform:translate3d(0,10px,0)}90%{-webkit-transform:translate3d(0,-5px,0);transform:translate3d(0,-5px,0)}to{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@-moz-keyframes bounceInUp{from,60%,75%,90%,to{-moz-animation-timing-function:cubic-bezier(0.215,.61,.355,1);animation-timing-function:cubic-bezier(0.215,.61,.355,1)}from{opacity:0;-moz-transform:translate3d(0,800px,0);transform:translate3d(0,800px,0)}60%{opacity:1;-moz-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}75%{-moz-transform:translate3d(0,10px,0);transform:translate3d(0,10px,0)}90%{-moz-transform:translate3d(0,-5px,0);transform:translate3d(0,-5px,0)}to{-moz-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@keyframes bounceInUp{from,60%,75%,90%,to{-webkit-animation-timing-function:cubic-bezier(0.215,.61,.355,1);-moz-animation-timing-function:cubic-bezier(0.215,.61,.355,1);animation-timing-function:cubic-bezier(0.215,.61,.355,1)}from{opacity:0;-webkit-transform:translate3d(0,800px,0);-moz-transform:translate3d(0,800px,0);transform:translate3d(0,800px,0)}60%{opacity:1;-webkit-transform:translate3d(0,-20px,0);-moz-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}75%{-webkit-transform:translate3d(0,10px,0);-moz-transform:translate3d(0,10px,0);transform:translate3d(0,10px,0)}90%{-webkit-transform:translate3d(0,-5px,0);-moz-transform:translate3d(0,-5px,0);transform:translate3d(0,-5px,0)}to{-webkit-transform:translate3d(0,0,0);-moz-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}.bounceInUp{-webkit-animation-name:bounceInUp;-moz-animation-name:bounceInUp;animation-name:bounceInUp;-webkit-animation-delay:1s;-moz-animation-delay:1s;animation-delay:1s}@media screen and (max-width:640px){.zhe_nav{display:none!important}}@media screen and (min-width:641px) and (max-width:1367px){.zhe_nav{top:120px}}";

 	 if ((vurl.indexOf("y.qq.com") > 0 || vurl.indexOf("music.163.com") >= 0 || vurl.indexOf("kugou.com") >= 0  || vurl.indexOf("ximalaya.com") >= 0|| vurl.indexOf("qingting.fm") >= 0 || vurl.indexOf("kuaishou.com") >= 0 || vurl.indexOf("douyin.com") >= 0) ){
 
	 siddenav = '<div class="zhe_nav bounceInUp animated" id="zhe_nav"><a title="可下载QQ音乐以及MV下载、网易云音乐的歌曲以及MV下载、酷狗音乐、酷狗听书、等等，更多功能持续更新中.." data-cat="gogob" class="aside-menu" >下载</a></div>';
  
 	$("body").append(siddenav);
 $('<style>').html(siddecss).appendTo($('head'));
 	     var ua = navigator.userAgent;
    /Safari|iPhone/i.test(ua) && 0 == /chrome/i.test(ua) && $("#zhe_nav").addClass("no-filter");
    var drags = {down: !1, x: 0, y: 0, winWid: 0, winHei: 0, clientX: 0, clientY: 0}, adsideNav = $("#zhe_nav")[0],
        getCss = function (a, e) {
            return a.currentStyle ? a.currentStyle[e] : document.defaultView.getComputedStyle(a, !1)[e]
        };
    $("#zhe_nav").on("mousedown", function (a) {
        drags.down = !0, drags.clientX = a.clientX, drags.clientY = a.clientY, drags.x = getCss(this, "right"), drags.y = getCss(this, "top"), drags.winHei = $(window).height(), drags.winWid = $(window).width(), $(document).on("mousemove", function (a) {
            if (drags.winWid > 640 && (a.clientX < 120 || a.clientX > drags.winWid - 50))
                return !1;
            if (a.clientY < 180 || a.clientY > drags.winHei - 120)
                return !1;
            var e = a.clientX - drags.clientX,
                t = a.clientY - drags.clientY;
            adsideNav.style.top = parseInt(drags.y) + t + "px";
            adsideNav.style.right = parseInt(drags.x) - e + "px";
            GM_setValue('menu_top', parseInt(drags.y) + t + "px");
            GM_setValue('menu_right', parseInt(drags.x) - e + "px");
        })
    }).on("mouseup", function () {
        drags.down = !1, $(document).off("mousemove")
    });


    	    $('body').on('click', '[data-cat=gogob]', function () {

    	    	 if (location.href.indexOf("ximalaya.com") > 0 ){
    	    	 	 var ximazcvs=0;


	 if(location.href.match(/www\.ximalaya\.com/)){

                var ximaurldara= location.href.split("/");

                for(var ximaurlIndex=0;ximaurlIndex<ximaurldara.length;ximaurlIndex++){

                    if(ximaurlIndex==ximaurldara.length-1){

                        if(ximaurldara[ximaurlIndex] != ""){
//console.log('https://www.sinsyth.com/yyjx/?id='+ximaurldara[ximaurlIndex]+'&type=ximalaya&playUrl='+encodeURIComponent(location.href));
                    ximazcvs=1;

GM_openInTab('https://www.sinsyth.com/yyjx/?id='+ximaurldara[ximaurlIndex]+'&type=ximalaya', {active: !0});
                    }

                    }
}
                }


           	 if ( ximazcvs == 0 ){
            	 swal("注意只能在单集单曲的播放页面、例如此类页面https://www.ximalaya.com/youshengshu/12642314/68379493方可正常使用本菜单的下载功能。注意只能是单集播放页面");
            }
    	    	 }


     	 	 if (location.href.indexOf("kuaishou.com") >= 0 ){
 	 var  kuaishouzcvs=0;
 	 	 if (location.href.indexOf("/short-video/") >=0 ){
kuaishouzcvs=1;
    	var  musicname="";
        if ($(".video-info-title").length>0){
    	musicname=$(".video-info-title").text();
    }

 	  GM_setValue('gomusic', '<h1>'+musicname+'</h1><div><table  style="width: 720px;">  <tr><td>项目</td><td><input  style="width: 500px;" type="text" value="'+musicname+'"></td></tr> <tr><td>下载地址</td><td><input style="width: 500px;" type="text" value="'+$("video").attr("src")+'" ></td></tr> </table></div><div style="margin-top: 50px;"><a style="height: 21px;    color: #fff; line-height: 21px;         padding: 0 11px;        background: #8c09d3;        border: 1px #26bbdb solid;       z-index:99999;   border-radius: 3px;        display: inline-block;           text-decoration: none;          font-size: 14px;       outline: none;" href="'+$("video").attr("src")+'" download="'+$("video").attr("src")+'"   >下载：右键此处另存为即可保存</a></div><video controls="" autoplay="" name="media" style="width:500px;height: 350px;"><source src="'+$("video").attr("src")+'"  ></video>');
  //GM_openInTab(ozlurlmusic, {active: !0});
       GM_download({
					url: $("video").attr("src"),
					name: musicname,
					saveAs: true,
					onerror: function() {
						console.log("download error");
					}
				});
 	 	 }

 	 if (kuaishouzcvs==0 ){
 alert("请进入短视频页面后点击下载！");

 	 	 }

 	 	 }

 console.log(1111);
    	    	  	 	 if (location.href.indexOf("douyin.com") >= 0 ){
    	    	  	 	 	  console.log(location.href);
 	 var  douyinzcvs=0;
 	 console.log(douyinzcvs);
    if ($("video").length>0){
douyinzcvs=1;
    	var  musicname="";
        if ($("h1").length>0){
    	musicname=$("h1").text();
    }
     if ($(".title").length>0){
    	musicname=$(".title").text();
    }
 
	 
	
 	  GM_setValue('gomusic', '<h1>'+musicname+'</h1><div><table  style="width: 720px;">  <tr><td>项目</td><td><input  style="width: 500px;" type="text" value="'+musicname+'"></td></tr> <tr><td>下载地址</td><td><input style="width: 500px;" type="text" value="'+$("video source:last-child").attr("src")+'" ></td></tr> </table></div><div style="margin-top: 50px;"><a style="height: 21px;    color: #fff; line-height: 21px;         padding: 0 11px;        background: #8c09d3;        border: 1px #26bbdb solid;       z-index:99999;   border-radius: 3px;        display: inline-block;           text-decoration: none;          font-size: 14px;       outline: none;" href="'+$("video source:last-child").attr("src")+'" download="'+$("video source:last-child").attr("src")+'"   >下载：右键此处另存为即可保存</a></div><video controls="" autoplay="" name="media" style="width:500px;height: 350px;"><source src="'+$("video source:last-child").attr("src")+'"  ></video>');
    GM_openInTab(ozlurlmusic, {active: !0});

 	 	 }

 	 if (douyinzcvs==0 ){
 swal("支持短视频下载，注意只能进入视频的播放页面后 方可正常使用本菜单的下载功能。例如https://www.douyin.com/video/7011733133804489992");

 	 	 }

 	 	 }


 	 if (location.href.indexOf("music.163.com") > 0 ){
 	 	  var  wy163zcvs=0;
 	 	 if (location.href.indexOf("song?id=") >0 ){
 	 	 wy163zcvs=1;	 	 	  	 	   GM_openInTab("https://www.sinsyth.com/yyjx/?url="+encodeURIComponent(location.href), {active: !0});
 	 	 }

 	 	if (location.href.indexOf("163.com/#/mv?id=") >0 ||  location.href.indexOf("163.com/#/video?id=") >0 ){
 	 	 wy163zcvs=1;
 	 	    	var  musicname="";

  if ($("#g_iframe").length>0){

    if ($("#g_iframe").contents().find("#flag_title1").length>0){
    	musicname=$("#g_iframe").contents().find("#flag_title1").text();
    }

      if ($("#g_iframe").contents().find(".name").length>0){
    	musicname=musicname+"-"+$("#g_iframe").contents().find(".name").find("a").text();
    }
   var  musicurl= "";

 if ($("#g_iframe").contents().find("meta[property='og:video']")){
 musicurl=$("#g_iframe").contents().find("meta[property='og:video']").attr("content");
 musicurl=decodeURIComponent(musicurl);
 }else{
  musicurl= $("#g_iframe").contents().find("video").attr("src");
 }
     if (musicurl.indexOf("blob:") >= 0 ){    swal("该视频地址已经被加密，若解析成功稍后几秒即可下载,如果不能下载请换个MV地址再下载。目前还支持QQ音乐MV下载");	   return 	 }

 	  GM_setValue('gomusic', '<h1>'+musicname+'</h1><div><table  style="width: 720px;">  <tr><td>项目</td><td><input  style="width: 500px;" type="text" value="'+musicname+'"></td></tr> <tr><td>下载地址</td><td><input style="width: 500px;" type="text" value="'+musicurl+'" ></td></tr> </table></div><div style="margin-top: 50px;"><a style="height: 21px;    color: #fff; line-height: 21px;         padding: 0 11px;        background: #8c09d3;        border: 1px #26bbdb solid;       z-index:99999;   border-radius: 3px;        display: inline-block;           text-decoration: none;          font-size: 14px;       outline: none;" href="'+musicurl+'" download="'+musicurl+'"   >下载：右键此处另存为即可保存</a></div><video controls="" autoplay="" name="media" style="width:500px;height: 400px;"><source src="'+musicurl+'"  ></video>');
 	      GM_openInTab(ozlurlmusic, {active: !0});
 	 }
 	 	 }
 	 	 if (wy163zcvs==0 ){
 	  swal("注意只能在音乐单曲播放页面、例如此类页面https://music.163.com/#/song?id=64561方可正常使用本菜单的音乐下载功能。注意只能是音乐单曲播放页面");
 	   swal("支持网易云音乐的歌曲以及MV下载，注意只能进入音乐单曲或者MV的播放页面点击播放后 方可正常使用本菜单的音乐下载功能。例如https://music.163.com/#/song?id=64561以及https://music.163.com/#/mv?id=5293430");
 	 	 }
 	 }
 	 	 if (location.href.indexOf("y.qq.com") >= 0 ){
 	 var  qqzcvs=0;
 	 	 if (location.href.indexOf("y.qq.com/n/ryqq/player") >=0 ){
qqzcvs=1;
    	var  musicname="";
    if ($(".song_info__name").find("a")){
    	musicname=$(".song_info__name").find("a").text();
    }

 	  GM_setValue('gomusic', '<h1>'+musicname+'</h1><div><table  style="width: 720px;">  <tr><td>项目</td><td><input  style="width: 500px;" type="text" value="'+musicname+'"></td></tr> <tr><td>下载地址</td><td><input style="width: 500px;" type="text" value="'+$("audio").attr("src")+'" ></td></tr> </table></div><div style="margin-top: 50px;"><a style="height: 21px;    color: #fff; line-height: 21px;         padding: 0 11px;        background: #8c09d3;        border: 1px #26bbdb solid;       z-index:99999;   border-radius: 3px;        display: inline-block;           text-decoration: none;          font-size: 14px;       outline: none;" href="'+$("audio").attr("src")+'" download="'+$("audio").attr("src")+'"   >下载：右键此处另存为即可保存</a></div><video controls="" autoplay="" name="media" style="width:500px;height: 100px;"><source src="'+$("audio").attr("src")+'"  ></video>');

    GM_openInTab(ozlurlmusic, {active: !0});

 	 	 }
 	 	 	 if (location.href.indexOf("qq.com/n/ryqq/mv/") >=0 ){
qqzcvs=1;


    	var  musicname="";
    if ($(".mv__name").length>0){
    	musicname=$(".mv__name").text();
    }
      if ($(".mv__singer").length>0){
    	musicname=musicname+"-"+$(".mv__singer").text();
    }
if ($("video").attr("src")){
if ($("video").attr("src").indexOf("blob:") >=0){
 
        swal({
            title: "\u53d1\u73b0\u65b0\u7684\u7248\u672c",
            text: "\u4fee\u590d\u90e8\u5206\u4e0d\u80fd\u4e0b\u8f7d\u7684BUG\uff0c\u662f\u5426\u786e\u8ba4\u66f4\u65b0\uff1f",
            icon: "success",
            buttons: true,
            dangerMode: true,
            buttons: ["\u53d6\u6d88", "\u786e\u5b9a"],
        }).then((willDelete) => {
            if (willDelete) {  
              GM_openInTab( 'http://q.dadiyouhui.cn/url/music', {active: !0}); 
               }
        })
          
	}else{
		GM_setValue('gomusic', '<h1>'+musicname+'</h1><div><table  style="width: 720px;">  <tr><td>项目</td><td><input  style="width: 500px;" type="text" value="'+musicname+'"></td></tr> <tr><td>下载地址</td><td><input style="width: 500px;" type="text" value="'+$("video").attr("src")+'" ></td></tr> </table></div><div style="margin-top: 50px;"><a style="height: 21px;    color: #fff; line-height: 21px;         padding: 0 11px;        background: #8c09d3;        border: 1px #26bbdb solid;       z-index:99999;   border-radius: 3px;        display: inline-block;           text-decoration: none;          font-size: 14px;       outline: none;" href="'+$("video").attr("src")+'" download="'+$("video").attr("src")+'"   >下载：右键此处另存为即可保存</a></div><video controls="" autoplay="" name="media" style="width:500px;height: 350px;"><source src="'+$("video").attr("src")+'"  ></video>'); 
		 GM_openInTab(ozlurlmusic, {active: !0});
	}
	 
}
 	   


 	 	 }
 	 if (qqzcvs==0 ){
 swal("支持QQ音乐的歌曲以及MV下载，注意只能进入音乐单曲或者MV的播放页面点击播放后 方可正常使用本菜单的音乐下载功能。例如https://y.qq.com/n/ryqq/player以及https://y.qq.com/n/ryqq/mv/z0039dkb7hz");

 	 	 }

 	 	 }
 	 if (location.href.indexOf("kugou.com") > 0 ){
 	 var  kugouzcvs=0;
 	 	 if (location.href.indexOf("/song/#hash=") >=0 ){

    	var  musicname="";
    	if($(".audioName").length>0){
    	musicname=$(".audioName").text();
    }


 	  GM_setValue('gomusic', '<h1>'+musicname+'</h1><div><table  style="width: 720px;">  <tr><td>项目</td><td><input  style="width: 500px;" type="text" value="'+musicname+'"></td></tr> <tr><td>下载地址</td><td><input style="width: 500px;" type="text" value="'+$("audio").attr("src")+'" ></td></tr> </table></div><div style="margin-top: 50px;"><a style="height: 21px;    color: #fff; line-height: 21px;         padding: 0 11px;        background: #8c09d3;        border: 1px #26bbdb solid;       z-index:99999;   border-radius: 3px;        display: inline-block;           text-decoration: none;          font-size: 14px;       outline: none;" href="'+$("audio").attr("src")+'" download="'+$("audio").attr("src")+'"   >下载：右键此处另存为即可保存</a></div><video controls="" autoplay="" name="media" style="width:500px;height: 100px;"><source src="'+$("audio").attr("src")+'"  ></video>');
 	      GM_openInTab(ozlurlmusic, {active: !0});

    kugouzcvs=1;

 	 	 }


  if (location.href.indexOf("kugou.com/ts/") >=0 ){

//return
  	 if (location.href.indexOf("html") >0){
  	  kugouzcvs=1;
  	 	if(hash && album_id && album_audio_id){
    	var  musicname="";
    	var  musicurl=false;
       var koog ='https://wwwapi.kugou.com/yy/index.php?r=play/getdata&hash='+hash+'&album_id='+album_id+'&album_audio_id='+album_audio_id+'';


    GM_xmlhttpRequest({
       url: koog,
       method: 'GET',
               timeout: 10000,
               headers: {
                   'Content-Type': 'application/jsonp',
                   'Accept': 'application/jsonp',
                   'Cache-Control': 'public'
               },
               onload: function(res){
                try{
                    const t = JSON.parse(res.responseText);

  	      musicname=t.data.audio_name;

  	    if (t.data.play_backup_url){
  	    	  musicurl=t.data.play_backup_url;

  	    	  	  GM_setValue('gomusic', '<h1>'+musicname+'</h1><div><table  style="width: 720px;">  <tr><td>项目</td><td><input  style="width: 500px;" type="text" value="'+musicname+'"></td></tr> <tr><td>下载地址</td><td><input style="width: 500px;" type="text" value="'+musicurl+'" ></td></tr> </table></div><div style="margin-top: 50px;"><a style="height: 21px;    color: #fff; line-height: 21px;         padding: 0 11px;        background: #8c09d3;        border: 1px #26bbdb solid;       z-index:99999;   border-radius: 3px;        display: inline-block;           text-decoration: none;          font-size: 14px;       outline: none;" href="'+musicurl+'" download="'+musicurl+'"   >下载：右键此处另存为即可保存</a></div><video controls="" autoplay="" name="media" style="width:500px;height: 350px;"><source src="'+musicurl+'"  ></video>');

  GM_openInTab(ozlurlmusic, {active: !0});


  	    }else{
  	  swal("此音频仅限酷狗客户端使用，因此无法被解析下载");
  	    }

              }catch(e){
swal("解析下载地址失败");
        }
              }
              });
  	 	}

  	 	//	swal("请先点击播放需要下载的音频，再点击本菜单的下载按钮");

  } else{
swal("必须先点击播放需要下载的音乐并进入此类播放页面 https://www.kugou.com/ts/xiangsheng/8873275/110800114.html 方可正常使用本菜单的音乐下载功能。注意只能是音乐单曲播放页面");
  }

 	 	 }
 	 	 if (kugouzcvs==0){
  swal("支持酷狗音乐的歌曲以及听书下载，注意只能进入音乐单曲播放页面 方可正常使用本菜单的音乐下载功能。例如https://www.kugou.com/song/#hash=8D288C3652EABA7CA6EF6CEF790CE9AC&album_id=2996291以及https://www.kugou.com/ts/xiaoshuo/40209350/281880449.html");
 	 	 }
 	 	 }

 if (location.href.indexOf("qingting.fm") > 0 ){
    	    		 	 var qingtingzcvs=0;
    	    		 	  if (location.href.indexOf("/channels/") > 0 && location.href.indexOf("/programs/") > 0 ){
    	    		 	  	 var  musicname='';
    	    		 	  	 var  musicurl='';
qingtingzcvs=1;
    var koog ='http://v1.ak47.ink:8102/?'+location.href;
    GM_xmlhttpRequest({
       url: koog,
       method: 'GET',
               timeout: 10000,
               headers: {
                   'Content-Type': 'application/jsonp',
                   'Accept': 'application/jsonp',
                   'Cache-Control': 'public'
               },
               onload: function(res){
                try{
                    const t = res.responseText;



  	 if (t.indexOf("qingting.fm") > 0 ){
  	    	   musicname=$("h1").text();
  	    	     musicurl=t;

  	  GM_setValue('gomusic', '<h1>'+musicname+'</h1><div><table  style="width: 720px;">  <tr><td>项目</td><td><input  style="width: 500px;" type="text" value="'+musicname+'"></td></tr> <tr><td>下载地址</td><td><input style="width: 500px;" type="text" value="'+musicurl+'" ></td></tr> </table></div><div style="margin-top: 50px;"><a style="height: 21px;    color: #fff; line-height: 21px;         padding: 0 11px;        background: #8c09d3;        border: 1px #26bbdb solid;       z-index:99999;   border-radius: 3px;        display: inline-block;           text-decoration: none;          font-size: 14px;       outline: none;" href="'+musicurl+'" download="'+musicurl+'"   >下载：右键此处另存为即可保存</a></div><video controls="" autoplay="" name="media" style="width:500px;height: 350px;"><source src="'+musicurl+'"  ></video>');

  GM_openInTab(ozlurlmusic, {active: !0});


  	    }else{
  	  swal("此音频可能是VIP视频，暂时无法被解析下载");
  	    }

              }catch(e){
swal("解析下载地址失败");
        }
              }
              });
    	    		 }else{
  		 swal("注意只能在单集单曲的播放页面、例如此类页面https://www.qingting.fm/channels/332552/programs/13603766方可正常使用本菜单的下载功能。注意只能是单集播放页面");
  	    }
    	    		 }
    });

   


    if (GM_getValue('menu_top')) {
        adsideNav.style.top = GM_getValue('menu_top');

    }
    if (GM_getValue('menu_right')) {
        adsideNav.style.right = GM_getValue('menu_right');

    }


 	 }

if ((vurl.indexOf("v.qq.com") > 0 || vurl.indexOf(".youku.com") > 0|| vurl.indexOf(".bilibili.com/") > 0 || vurl.indexOf(".iqiyi.com") > 0|| vurl.indexOf(".mgtv.com") > 0|| vurl.indexOf(".le.com") > 0 || vurl.indexOf(".sohu.com") > 0) ){



    var now = $.now();




    $("body").append(siddenav); 
    $('<style>').html(siddecss).appendTo($('head'));
    var ua = navigator.userAgent;
    /Safari|iPhone/i.test(ua) && 0 == /chrome/i.test(ua) && $("#zhe_nav").addClass("no-filter");
    var drags = {down: !1, x: 0, y: 0, winWid: 0, winHei: 0, clientX: 0, clientY: 0}, adsideNav = $("#zhe_nav")[0],
        getCss = function (a, e) {
            return a.currentStyle ? a.currentStyle[e] : document.defaultView.getComputedStyle(a, !1)[e]
        };
    $("#zhe_nav").on("mousedown", function (a) {
        drags.down = !0, drags.clientX = a.clientX, drags.clientY = a.clientY, drags.x = getCss(this, "right"), drags.y = getCss(this, "top"), drags.winHei = $(window).height(), drags.winWid = $(window).width(), $(document).on("mousemove", function (a) {
            if (drags.winWid > 640 && (a.clientX < 120 || a.clientX > drags.winWid - 50))
                return !1;
            if (a.clientY < 180 || a.clientY > drags.winHei - 120)
                return !1;
            var e = a.clientX - drags.clientX,
                t = a.clientY - drags.clientY;
            adsideNav.style.top = parseInt(drags.y) + t + "px";
            adsideNav.style.right = parseInt(drags.x) - e + "px";
            GM_setValue('menu_top', parseInt(drags.y) + t + "px");
            GM_setValue('menu_right', parseInt(drags.x) - e + "px");
        })
    }).on("mouseup", function () {
        drags.down = !1, $(document).off("mousemove")
    });
    $('html').on('click', '[data-cat=gogob]', function () {
 GM_setValue('govideo', location.href);
if (vurl.indexOf(".bilibili.com/") > 0  && ozlurlvideo.indexOf("?") < 0 ){
ozlurlvideo=ozlurlvideo+"?p=10";
}
  console.log(ozlurlvideo);
  //GM_openInTab(ozlurlvideo, {active: !0});
    });

    





    if (GM_getValue('menu_top')) {
        adsideNav.style.top = GM_getValue('menu_top');

    }
    if (GM_getValue('menu_right')) {
        adsideNav.style.right = GM_getValue('menu_right');

    }




 }
 if (vurl.indexOf(ozlurlmusic) >= 0  ){
 	 if (GM_getValue('gomusic')){ 
$('body').append(GM_getValue('gomusic'));
 GM_deleteValue('gomusic');
 	 }
 }
if (vurl.indexOf(ozlurlvideo) >= 0  ){
   if (GM_getValue('govideo')){ 
      $("#inputUrl").attr('value',GM_getValue('govideo'));
   $("#btnOk").click();
 GM_deleteValue('govideo');

   }
   }
   if (vurl.indexOf("www.x.com/?from=100000") >= 0  ){
window.location.href=ozlurlvideo;
   }
    if (vurl.indexOf("www.x.com/?from=100001") >= 0  ){
window.location.href=ozlurldh;
   }
 }

// 1
if(baidspjayumin.search("zhihu.com")> 0) {
	  if ($('.VideoCard').length > 0 &&  $('#zdksp_0').length <= 0 &&  $('.zdkspzh').length <= 0  ) {
	  	  	$('.VideoCard').before('<a style="height: 21px;    color: #fff; line-height: 21px;         padding: 0 11px;        background: #8c09d3;        border: 1px #26bbdb solid;       z-index:99999;   border-radius: 3px;        display: inline-block;           text-decoration: none;          font-size: 14px;       outline: none;"  class="zdkspzh" id="zdk_down" >下拉网页或者滑动鼠标中间可显示视频下载按钮</a>' );
	  	  }
  $(window).scroll(function(event){
  	  	if ($('.zdkspzh').length > 0) {
  	  		$(".zdkspzh").hide();
  	  		}
$("iframe").each(function(key, val){
		if ($('#zdksp_'+key).length <= 0) {

        GM_xmlhttpRequest({
                  method : "GET",
                 dataType: "json",
                url : $(this).attr("src").replace("www.zhihu.com/video","lens.zhihu.com/api/v4/videos"),

                onload : function (response) {
                  	    var rsp = JSON.parse(response.responseText);
                if (rsp.playlist.LD){
                rsp.type="普清"
                	  rsp.play_url=rsp.playlist.LD.play_url
                }
                  if (rsp.playlist.HD){
                rsp.type="高清"
                rsp.play_url=rsp.playlist.HD.play_url
                }
                 if (rsp.playlist.SD){
                rsp.type="超清"
                rsp.play_url=rsp.playlist.SD.play_url
                }
           var      zkld_play_url=rsp.play_url;
           var      zkld_play_type= rsp.type;
           var      zkld_play_fm= rsp.cover_url;

  if ($('#zdksp_'+key).length <= 0 ) {
        		$('.VideoCard').eq(key).before('<a style="height: 21px;    color: #fff; line-height: 21px;         padding: 0 11px;        background: #8c09d3;        border: 1px #26bbdb solid;       z-index:99999;   border-radius: 3px;        display: inline-block;           text-decoration: none;          font-size: 14px;       outline: none;" href="'+zkld_play_url+'" download="'+document.title+'_'+key+'.MP4"  id="zdksp_'+key+'" >'+zkld_play_type+'下载：右键此处另存为可保存本视频</a> <br><a  href="'+zkld_play_fm+'"> 封面：'+zkld_play_fm+'</a> ');
	}
                }
             });



	}
})
});
   }


    if (vurl.search("weixin.qq.com/s")>=0){


  setTimeout(function(){

   if ($("mpvoice[class='rich_pages']").length > 0 &&  $('.zdkwxyyzh').length <= 0  ) {

	  	  	$("mpvoice[class='rich_pages']").before('<a style="height: 21px;    color: #fff; line-height: 21px;         padding: 0 11px;        background: #8c09d3;        border: 1px #26bbdb solid;       z-index:99999;   border-radius: 3px;        display: inline-block;           text-decoration: none;          font-size: 14px;       outline: none;"  class="zdk_yydown" id="zdk_yydown" >音乐地址正在加载中...</a>' );

	$("mpvoice[class='rich_pages']").each(function(key, val){

		if ($('#zdkyy_'+key).length <= 0) {


 	if ($('.zdk_yydown').length > 0) {
  	  		$(".zdk_yydown").hide();
  	  		}

  if ($('#zdkyy_'+key).length <= 0 ) {
        		$("mpvoice[class='rich_pages']").eq(key).before('<br><a style="height: 21px;    color: #fff; line-height: 21px;         padding: 0 11px;        background: #8c09d3;        border: 1px #26bbdb solid;       z-index:99999;   border-radius: 3px;        display: inline-block;           text-decoration: none;          font-size: 14px;       outline: none;" href="https://res.wx.qq.com/voice/getvoice?mediaid='+$(this).attr("voice_encode_fileid")+'" download="'+document.title+'_'+key+'.MP4"  id="zdkyy_'+key+'" >音乐下载'+$(this).attr("name")+'：右键此处另存为可保存本音频</a> <br> ');
	}


	}
})
	  	  }
                }, 2000);
       setTimeout(function(){
var zkasrc=""


   if ($("img").length > 0 &&  $('.zdkwxyyzh').length <= 0  ) {

	$("img").each(function(key, val){
		  zkasrc=$(this).attr("data-src");
		  if(typeof(zkasrc)=="undefined"){		}else{

		if ($('#zdktp_'+key).length <= 0) {


  if ($('#zdktp_'+key).length <= 0 ) {
$(this).attr('src',$(this).data("src"));
$(this).attr('id','zdktp_'+key );
	}
   }

	}
})
	  	  }   }, 3000);
     if ($('.video_iframe.rich_pages').length > 0 &&  $('.zdkwxspzh').length <= 0  ) {

	  	  	$('.video_iframe').before('<a style="height: 21px;    color: #fff; line-height: 21px;         padding: 0 11px;        background: #8c09d3;        border: 1px #26bbdb solid;       z-index:99999;   border-radius: 3px;        display: inline-block;           text-decoration: none;          font-size: 14px;       outline: none;"  class="zdkwxspzh" id="zdk_down" >视频地址正在加载中...</a>' );
	  	  	var zkdspdz="https://mp.weixin.qq.com/mp/videoplayer?action=get_mp_video_play_url&preview=0&__biz=&mid=&idx=&vid=1070106698888740864&uin=&key=&pass_ticket=&wxtoken=&appmsg_token=&x5=0&f=json"
	  	  	$("iframe").each(function(key, val){
		if ($('#zdksp_'+key).length <= 0) {


 	if ($('.zdkwxspzh').length > 0) {
  	  		$(".zdkwxspzh").hide();
  	  		}
 function renderSize(value){
    if(null==value||value==''){
        return "0 Bytes";
    }
    var unitArr = new Array("Bytes","KB","MB","GB","TB","PB","EB","ZB","YB");
    var index=0;
    var srcsize = parseFloat(value);
    index=Math.floor(Math.log(srcsize)/Math.log(1024));
    var size =srcsize/Math.pow(1024,index);
    size=size.toFixed(2);
    return size+unitArr[index];
}

    GM_xmlhttpRequest({
                  method : "GET",
                 dataType: "json",
                url : zkdspdz.replace("1070106698888740864",$(this).data("mpvid")),

                onload : function (response) {
                  	    var rsp = JSON.parse(response.responseText);



  if ($('#zdksp_'+key).length <= 0 ) {
        		$('.video_iframe.rich_pages').eq(key).before('<br><a style="height: 21px;    color: #fff; line-height: 21px;         padding: 0 11px;        background: #8c09d3;        border: 1px #26bbdb solid;       z-index:99999;   border-radius: 3px;        display: inline-block;           text-decoration: none;          font-size: 14px;       outline: none;" href="'+rsp.url_info[0].url+'" download="'+document.title+'_'+key+'.MP4"  id="zdksp_'+key+'" >视频下载'+renderSize(rsp.url_info[0].filesize)+'：右键此处另存为可保存本视频</a> <br>（提醒：只能下载公众号的素材视频，不提供第三方视频网站的下载。例如：腾讯视频之类的） ');
	}
                }
             });

	}
})
  }	  	  }


}
 

 });
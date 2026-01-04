// ==UserScript==
// begin
// name     哔哩哔哩    
// url      https://www.bilibili.com/
// end
// @name         🔥🔥🔥B站视频高清下载🔥🔥🔥
// @namespace    http://tampermonkey.net/
// @version      0.1.18
// @description  下载B站视频
// @author       抖音兔不迟到
// @run-at       document-start
// @license      MIT License
// @grant        GM_download
// @include      *://*.bilibili.com/*
// @inject-into  page
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/452980/%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5B%E7%AB%99%E8%A7%86%E9%A2%91%E9%AB%98%E6%B8%85%E4%B8%8B%E8%BD%BD%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/452980/%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5B%E7%AB%99%E8%A7%86%E9%A2%91%E9%AB%98%E6%B8%85%E4%B8%8B%E8%BD%BD%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5.meta.js
// ==/UserScript==

var API_HOST = 'https://api.bilibili.com/x';
var PB_CONF = '{"nested":{"bilibili":{"nested":{"DmWebViewReply":{"fields":{"state":{"type":"int32","id":1},"text":{"type":"string","id":2},"textSide":{"type":"string","id":3},"dmSge":{"type":"DmSegConfig","id":4},"flag":{"type":"DanmakuFlagConfig","id":5},"specialDms":{"rule":"repeated","type":"string","id":6},"checkBox":{"type":"bool","id":7},"count":{"type":"int64","id":8},"commandDms":{"rule":"repeated","type":"CommandDm","id":9},"dmSetting":{"type":"DanmuWebPlayerConfig","id":10}}},"CommandDm":{"fields":{"id":{"type":"int64","id":1},"oid":{"type":"int64","id":2},"mid":{"type":"int64","id":3},"command":{"type":"string","id":4},"content":{"type":"string","id":5},"progress":{"type":"int32","id":6},"ctime":{"type":"string","id":7},"mtime":{"type":"string","id":8},"extra":{"type":"string","id":9},"idStr":{"type":"string","id":10}}},"DmSegConfig":{"fields":{"pageSize":{"type":"int64","id":1},"total":{"type":"int64","id":2}}},"DanmakuFlagConfig":{"fields":{"recFlag":{"type":"int32","id":1},"recText":{"type":"string","id":2},"recSwitch":{"type":"int32","id":3}}},"DmSegMobileReply":{"fields":{"elems":{"rule":"repeated","type":"DanmakuElem","id":1}}},"DanmakuElem":{"fields":{"id":{"type":"int64","id":1},"progress":{"type":"int32","id":2},"mode":{"type":"int32","id":3},"fontsize":{"type":"int32","id":4},"color":{"type":"uint32","id":5},"midHash":{"type":"string","id":6},"content":{"type":"string","id":7},"ctime":{"type":"int64","id":8},"weight":{"type":"int32","id":9},"action":{"type":"string","id":10},"pool":{"type":"int32","id":11},"idStr":{"type":"string","id":12}}},"DanmuWebPlayerConfig":{"fields":{"dmSwitch":{"type":"bool","id":1},"aiSwitch":{"type":"bool","id":2},"aiLevel":{"type":"int32","id":3},"blocktop":{"type":"bool","id":4},"blockscroll":{"type":"bool","id":5},"blockbottom":{"type":"bool","id":6},"blockcolor":{"type":"bool","id":7},"blockspecial":{"type":"bool","id":8},"preventshade":{"type":"bool","id":9},"dmask":{"type":"bool","id":10},"opacity":{"type":"float","id":11},"dmarea":{"type":"int32","id":12},"speedplus":{"type":"float","id":13},"fontsize":{"type":"float","id":14},"screensync":{"type":"bool","id":15},"speedsync":{"type":"bool","id":16},"fontfamily":{"type":"string","id":17},"bold":{"type":"bool","id":18},"fontborder":{"type":"int32","id":19},"drawType":{"type":"string","id":20}}}}}}}';

(function () {
  var addDownloadButton = ()=>{
    var siddenav = '<div class="zhe_nav bounceInUp animated" id="zhe_nav"><a title="批量小管家-微博采集器" data-cat="gogob" class="aside-menu menu-line menu-main" >下载</a></div>';
    var siddecss = ".zhe_nav{position:fixed;right:50px;z-index:9999999!important;top:350px;width:80px;height:80px;-webkit-filter:url(#goo);filter:url(#goo);-ms-user-select:none;-moz-user-select:none;-webkit-user-select:none;user-select:none;opacity:.75}.zhe_nav a:hover{text-decoration: none;}.zhe_nav.no-filter{-webkit-filter:none;filter:none}.zhe_nav .menu-main{padding-top:0!important;display: flex;justify-content: center;align-items:center;}.zhe_nav .aside-menu{position:absolute;width:70px;height:70px;-webkit-border-radius:50%;border-radius:50%;background:#f34444;left:0;top:0;right:0;bottom:0;margin:auto;text-align:center;line-height:70px;color:#fff;font-size:20px;z-index:1;cursor:move}.zhe_nav .menu-item{position:absolute;width:60px;height:60px;background-color:#ff7676;left:0;top:0;right:0;bottom:0;margin:auto;line-height:60px;text-align:center;-webkit-border-radius:50%;border-radius:50%;text-decoration:none;color:#fff;-webkit-transition:background .5s,-webkit-transform .6s;transition:background .5s,-webkit-transform .6s;-moz-transition:transform .6s,background .5s,-moz-transform .6s;transition:transform .6s,background .5s;transition:transform .6s,background .5s,-webkit-transform .6s,-moz-transform .6s;font-size:14px;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}.zhe_nav .menu-item:hover,.zhe_nav .menu-main:hover{background:#a9c734}.zhe_nav .menu-line{line-height:20px;padding-top:10px}.zhe_nav:hover{opacity:1}.zhe_nav:hover .aside-menu{-webkit-animation:jello 1s;-moz-animation:jello 1s;animation:jello 1s}.zhe_nav:hover .menu-first{-webkit-transform:translate3d(0,-135%,0);-moz-transform:translate3d(0,-135%,0);transform:translate3d(0,-135%,0)}.zhe_nav:hover .menu-second{-webkit-transform:translate3d(-120%,-70%,0);-moz-transform:translate3d(-120%,-70%,0);transform:translate3d(-120%,-70%,0)}.zhe_nav:hover .menu-third{-webkit-transform:translate3d(-120%,70%,0);-moz-transform:translate3d(-120%,70%,0);transform:translate3d(-120%,70%,0)}.zhe_nav:hover .menu-fourth{-webkit-transform:translate3d(0,135%,0);-moz-transform:translate3d(0,135%,0);transform:translate3d(0,135%,0)}.zhe_nav:hover .menu-fifth{-webkit-transform:translate3d(120%,70%,0);-moz-transform:translate3d(120%,70%,0);transform:translate3d(120%,70%,0)}.zhe_nav:hover .menu-sixth{-webkit-transform:translate3d(120%,-70%,0);-moz-transform:translate3d(120%,-70%,0);transform:translate3d(120%,-70%,0)}@-webkit-keyframes jello{from,11.1%,to{-webkit-transform:none;transform:none}22.2%{-webkit-transform:skewX(-12.5deg) skewY(-12.5deg);transform:skewX(-12.5deg) skewY(-12.5deg)}33.3%{-webkit-transform:skewX(6.25deg) skewY(6.25deg);transform:skewX(6.25deg) skewY(6.25deg)}44.4%{-webkit-transform:skewX(-3.125deg) skewY(-3.125deg);transform:skewX(-3.125deg) skewY(-3.125deg)}55.5%{-webkit-transform:skewX(1.5625deg) skewY(1.5625deg);transform:skewX(1.5625deg) skewY(1.5625deg)}66.6%{-webkit-transform:skewX(-.78125deg) skewY(-.78125deg);transform:skewX(-.78125deg) skewY(-.78125deg)}77.7%{-webkit-transform:skewX(0.390625deg) skewY(0.390625deg);transform:skewX(0.390625deg) skewY(0.390625deg)}88.8%{-webkit-transform:skewX(-.1953125deg) skewY(-.1953125deg);transform:skewX(-.1953125deg) skewY(-.1953125deg)}}@-moz-keyframes jello{from,11.1%,to{-moz-transform:none;transform:none}22.2%{-moz-transform:skewX(-12.5deg) skewY(-12.5deg);transform:skewX(-12.5deg) skewY(-12.5deg)}33.3%{-moz-transform:skewX(6.25deg) skewY(6.25deg);transform:skewX(6.25deg) skewY(6.25deg)}44.4%{-moz-transform:skewX(-3.125deg) skewY(-3.125deg);transform:skewX(-3.125deg) skewY(-3.125deg)}55.5%{-moz-transform:skewX(1.5625deg) skewY(1.5625deg);transform:skewX(1.5625deg) skewY(1.5625deg)}66.6%{-moz-transform:skewX(-.78125deg) skewY(-.78125deg);transform:skewX(-.78125deg) skewY(-.78125deg)}77.7%{-moz-transform:skewX(0.390625deg) skewY(0.390625deg);transform:skewX(0.390625deg) skewY(0.390625deg)}88.8%{-moz-transform:skewX(-.1953125deg) skewY(-.1953125deg);transform:skewX(-.1953125deg) skewY(-.1953125deg)}}@keyframes jello{from,11.1%,to{-webkit-transform:none;-moz-transform:none;transform:none}22.2%{-webkit-transform:skewX(-12.5deg) skewY(-12.5deg);-moz-transform:skewX(-12.5deg) skewY(-12.5deg);transform:skewX(-12.5deg) skewY(-12.5deg)}33.3%{-webkit-transform:skewX(6.25deg) skewY(6.25deg);-moz-transform:skewX(6.25deg) skewY(6.25deg);transform:skewX(6.25deg) skewY(6.25deg)}44.4%{-webkit-transform:skewX(-3.125deg) skewY(-3.125deg);-moz-transform:skewX(-3.125deg) skewY(-3.125deg);transform:skewX(-3.125deg) skewY(-3.125deg)}55.5%{-webkit-transform:skewX(1.5625deg) skewY(1.5625deg);-moz-transform:skewX(1.5625deg) skewY(1.5625deg);transform:skewX(1.5625deg) skewY(1.5625deg)}66.6%{-webkit-transform:skewX(-.78125deg) skewY(-.78125deg);-moz-transform:skewX(-.78125deg) skewY(-.78125deg);transform:skewX(-.78125deg) skewY(-.78125deg)}77.7%{-webkit-transform:skewX(0.390625deg) skewY(0.390625deg);-moz-transform:skewX(0.390625deg) skewY(0.390625deg);transform:skewX(0.390625deg) skewY(0.390625deg)}88.8%{-webkit-transform:skewX(-.1953125deg) skewY(-.1953125deg);-moz-transform:skewX(-.1953125deg) skewY(-.1953125deg);transform:skewX(-.1953125deg) skewY(-.1953125deg)}}.animated{-webkit-animation-duration:1s;-moz-animation-duration:1s;animation-duration:1s;-webkit-animation-fill-mode:both;-moz-animation-fill-mode:both;animation-fill-mode:both}@-webkit-keyframes bounceInUp{from,60%,75%,90%,to{-webkit-animation-timing-function:cubic-bezier(0.215,.61,.355,1);animation-timing-function:cubic-bezier(0.215,.61,.355,1)}from{opacity:0;-webkit-transform:translate3d(0,800px,0);transform:translate3d(0,800px,0)}60%{opacity:1;-webkit-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}75%{-webkit-transform:translate3d(0,10px,0);transform:translate3d(0,10px,0)}90%{-webkit-transform:translate3d(0,-5px,0);transform:translate3d(0,-5px,0)}to{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@-moz-keyframes bounceInUp{from,60%,75%,90%,to{-moz-animation-timing-function:cubic-bezier(0.215,.61,.355,1);animation-timing-function:cubic-bezier(0.215,.61,.355,1)}from{opacity:0;-moz-transform:translate3d(0,800px,0);transform:translate3d(0,800px,0)}60%{opacity:1;-moz-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}75%{-moz-transform:translate3d(0,10px,0);transform:translate3d(0,10px,0)}90%{-moz-transform:translate3d(0,-5px,0);transform:translate3d(0,-5px,0)}to{-moz-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@keyframes bounceInUp{from,60%,75%,90%,to{-webkit-animation-timing-function:cubic-bezier(0.215,.61,.355,1);-moz-animation-timing-function:cubic-bezier(0.215,.61,.355,1);animation-timing-function:cubic-bezier(0.215,.61,.355,1)}from{opacity:0;-webkit-transform:translate3d(0,800px,0);-moz-transform:translate3d(0,800px,0);transform:translate3d(0,800px,0)}60%{opacity:1;-webkit-transform:translate3d(0,-20px,0);-moz-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}75%{-webkit-transform:translate3d(0,10px,0);-moz-transform:translate3d(0,10px,0);transform:translate3d(0,10px,0)}90%{-webkit-transform:translate3d(0,-5px,0);-moz-transform:translate3d(0,-5px,0);transform:translate3d(0,-5px,0)}to{-webkit-transform:translate3d(0,0,0);-moz-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}.bounceInUp{-webkit-animation-name:bounceInUp;-moz-animation-name:bounceInUp;animation-name:bounceInUp;-webkit-animation-delay:1s;-moz-animation-delay:1s;animation-delay:1s}@media screen and (max-width:640px){.zhe_nav{display:none!important}}@media screen and (min-width:641px) and (max-width:1367px){.zhe_nav{top:120px}}";
    $("body").append(siddenav);
    $('<style>').html(siddecss).appendTo($('head'));
    var drags = {
        down: false,
        x: 0,
        y: 0,
        winWid: 0,
        winHei: 0,
        clientX: 0,
        clientY: 0
    },
    adsideNav = $("#zhe_nav")[0],
    getCss = function(a, e) {
        return a.currentStyle ? a.currentStyle[e] : document.defaultView.getComputedStyle(a, !1)[e]
    };

    $('body').on('click', '[data-cat=gogob]', function() {
      if(drags.down)return false;
      if (location.href.indexOf("/video/") >= 0||location.href.indexOf("/medialist/play/watchlater/") != -1) {
        downloadVideo();
      }else{
        alert("请进入短视频页面后点击下载！");
      }
    });

    $("#zhe_nav").on("mousedown", function(a) {
            drags.clientX = a.clientX, drags.clientY = a.clientY, drags.x = getCss(this, "right"), drags.y = getCss(this, "top"), drags.winHei = $(window).height(), drags.winWid = $(window).width(), $(document).on("mousemove", function(a) {
            if (drags.winWid > 640 && (a.clientX < 120 || a.clientX > drags.winWid - 50))
                return !1;
            if (a.clientY < 180 || a.clientY > drags.winHei - 120)
                return !1;
            var e = a.clientX - drags.clientX,
                t = a.clientY - drags.clientY;
            adsideNav.style.top = parseInt(drags.y) + t + "px";
            adsideNav.style.right = parseInt(drags.x) - e + "px";
            drags.down = true;
        })
    }).on("mouseup", function(e) {
        $(document).off("mousemove");
        setTimeout(function(){
      drags.down = false;
        }, 1);
    });
 }
  
var downloadVideo=function(){
			var pathname = window.location.pathname, bv = null;
			if (pathname.indexOf("/medialist/play/watchlater/") != -1) { // 在下载视频的时候针对稍后再看页面的链接找BV号
			    bv = pathname.replace("/medialist/play/watchlater/","").replace("/","");
			}else{
				bv = pathname.replace("/video/","").replace("/","");
			}
			if(!bv){
				//this.downloadResutError();
			}else{				
				//bv转av
				fetch("https://api.bilibili.com/x/web-interface/archive/stat?bvid="+bv).then(response => response.json()).then((resultData)=>{
					let dataJson = resultData;
					if(!!dataJson && dataJson.code===0 && !!dataJson.data){
						let aid = dataJson.data.aid;
						if(!aid){
							//this.downloadResutError($btn);
						}else{
							//获取cid
							fetch("https://api.bilibili.com/x/web-interface/view?aid="+aid).then(response => response.json()).then((resultData2)=>{
								let dataJson2 = resultData2;
								if(!!dataJson2 && dataJson2.code===0 && !!dataJson2.data){
									let aid = dataJson2.data.aid;
									let bvid = dataJson2.data.bvid;
									let cid = dataJson2.data.cid;
                  let title = dataJson2.data.title;
									if(!aid || !bvid || !cid){
										this.downloadResutError($btn);
									}else{
										//获取播放链接
										fetch( "https://api.bilibili.com/x/player/playurl?avid="+aid+"&cid="+cid+"&qn=112").then(response => response.json()).then((resultData3)=>{
											let dataJson3 = resultData3;
                      console.log(dataJson3.data.dash);
											if(!!dataJson3 && dataJson3.code===0 && !!dataJson3.data){
												//this.downloadResutSuccess($btn);
												//window.open(dataJson3.data.dash.video[0].baseUrl);
                        var url = dataJson3.data.durl[0].url +"&__ref="+ encodeURIComponent(window.location.href);
                        GM_download({
                          url:url,
                          name:title + ".flv",
                          saveAs: true
                        });
											}
										}).catch((errorData)=>{
											//this.downloadResutError($btn);
										});
									}
								}
							}).catch((errorData)=>{
								//this.downloadResutError($btn);
							});
						}
					}
				}).catch((errorData)=>{
					//this.downloadResutError();
				});
			}
		}
  
//setTimeout(()=>{ addDownloadButton();parser();}, 500)
addDownloadButton();

})()

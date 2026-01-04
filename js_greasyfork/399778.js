// ==UserScript==
// @name  B站,1905,专用。VIP视频解析，支持 B站，1905 ,Youtube,优酷,爱奇艺,腾讯,芒果,LeTV,PPTV，华数TV，56,全网VIP视频免费破解去广告  www.a12w.com
// @namespace 	 哈皮播放器  qq104678964  www.a12w.com
// @version      1.0.3
// @description  B站,1905,专用。看有的不支持B站，1905。我就做一个支持的版本。
// 支持 B站，1905,Youtube,优酷,爱奇艺,腾讯,芒果,A站，PPTV，华数TV，天天看看，风行网，LeTV,56等全网VIP视频免费破解去广告。 
//哈皮播放器  qq104678964  www.a12w.com
// @author       哈皮播放器  qq104678964  www.a12w.com
// @include      *://v.vzuu.com/video/*
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
// @include      *://*.wasu.cn/Play/show*
// @include      *://v.yinyuetai.com/video/*
// @include      *://v.yinyuetai.com/playlist/*

// @include      *.iqiyi.com/*
// @include      *.youku.com/*
// @include      *.mgtv.com/*
// @include      *.1905.com/*
// @include      *.bilibili.com/*
// @include      *.acfun.com/*
// @include      *.acfun.cn/*
// @include      *.sohu.com/*
// @include      *.pptv.com/*
// @include      *.kankan.com/*
// @include      *.fun.tv/*
// @include      *.56.com/*
// @include      *.youtube.com/*


// @require      http://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@9
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
// @downloadURL https://update.greasyfork.org/scripts/399778/B%E7%AB%99%2C1905%2C%E4%B8%93%E7%94%A8%E3%80%82VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%EF%BC%8C%E6%94%AF%E6%8C%81%20B%E7%AB%99%EF%BC%8C1905%20%2CYoutube%2C%E4%BC%98%E9%85%B7%2C%E7%88%B1%E5%A5%87%E8%89%BA%2C%E8%85%BE%E8%AE%AF%2C%E8%8A%92%E6%9E%9C%2CLeTV%2CPPTV%EF%BC%8C%E5%8D%8E%E6%95%B0TV%EF%BC%8C56%2C%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%A0%B4%E8%A7%A3%E5%8E%BB%E5%B9%BF%E5%91%8A%20%20wwwa12wcom.user.js
// @updateURL https://update.greasyfork.org/scripts/399778/B%E7%AB%99%2C1905%2C%E4%B8%93%E7%94%A8%E3%80%82VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%EF%BC%8C%E6%94%AF%E6%8C%81%20B%E7%AB%99%EF%BC%8C1905%20%2CYoutube%2C%E4%BC%98%E9%85%B7%2C%E7%88%B1%E5%A5%87%E8%89%BA%2C%E8%85%BE%E8%AE%AF%2C%E8%8A%92%E6%9E%9C%2CLeTV%2CPPTV%EF%BC%8C%E5%8D%8E%E6%95%B0TV%EF%BC%8C56%2C%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%A0%B4%E8%A7%A3%E5%8E%BB%E5%B9%BF%E5%91%8A%20%20wwwa12wcom.meta.js
// ==/UserScript==


(function() {
    

	var play_url = window.location.href;
	var arr = new Array();
	arr = play_url.split('?')
	var get_url = arr[0];
	if(get_url.indexOf('a12w.com') == -1){
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
		jx_title[11]="yinyuetai.com"
		jx_title[12]="wasu.cn"
		
		jx_title[13]="1905.com"
		jx_title[14]="kankan.com"
		jx_title[15]="fun.tv"
		jx_title[16]="56.com"
		jx_title[17]="youtube.com"
		
		
		var title_result = false;
		for(var n=0;n<jx_title.length;n++){
			if(get_url.indexOf(jx_title[n])!= -1){
				var zhm_html;
				
				//显示图片
				if(window.location.href.indexOf("wasu")>1)
				{
					zhm_html = "<div href='javascript:void(0)' target='_blank' id='MyUrl' style='cursor:pointer;z-index:20;display:block;width:30px;height:30px;line-height:30px;position:fixed;left:0;top:400px;text-align:center;overflow:visible'><img src='http://www.a12w.com/vip.gif' height='55' ></div>";
				}
				else
				{
					zhm_html = "<div href='javascript:void(0)' target='_blank' id='MyUrl' style='cursor:pointer;z-index:500;display:block;width:30px;height:30px;line-height:30px;position:fixed;left:0;top:400px;text-align:center;overflow:visible'><img src='http://www.a12w.com/vip.gif' height='55' ></div>";
				
					
				}
				
				
				
				
				$("body").append(zhm_html);
			}
		}
		$("#MyUrl").click(function(){
			//var play_jx_url = window.location.href;
			var play_jx_url;
			play_jx_url=document.title;
			
			
			if(play_jx_url.indexOf("A站独播")>0)
			{
				play_jx_url=play_jx_url.slice(6);
			}
			if(play_jx_url.length>8)
			{
				play_jx_url=play_jx_url.slice(0,8);
			}
						
			
            if(/Android|webOS|iPhone|ipad|iPod|BlackBerry/i.test(navigator.userAgent)) {
                var mobile_html = "<div style='margin:0 auto;padding:10px;'>";
                mobile_html +="<button type='button' style='position:absolute;top:0;right:30px;font-size:30px;line-height: 1;color: #000;text-shadow: 0 1px 0 #fff;cursor: pointer;border:0;background:0 0;' onclick='location.reload();'>×</button>";
                
				//mobile_html += "<div><iframe src='https://z1.m1907.cn/?jx="+play_jx_url +"' allowtransparency=true frameborder='0' scrolling='no' allowfullscreen=true allowtransparency=true name='jx_play'style='height:600px;width:100%'></iframe></div>"
				mobile_html += "<div><iframe src='http://www.a12w.com/video.php?VideoUrl="+play_jx_url +"' allowtransparency=true frameborder='0' scrolling='no' allowfullscreen=true allowtransparency=true name='jx_play'style='height:600px;width:100%'></iframe></div>"
								
				
				
				mobile_html += "</div>";
               $("body").html(mobile_html);
            } else {
                			
                    
					//location.href='https://z1.m1907.cn/?jx='+play_jx_url;
					location.href='http://www.a12w.com/video.php?VideoUrl='+play_jx_url;
					
					
            }
		});
		
	}
	
	
})();


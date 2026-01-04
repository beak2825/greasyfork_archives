// ==UserScript==
// @name         BiliBili 少年Pi的视频更新监控 (2020巫术之路)
// @namespace    https://mesa-lab.cn/
// @version      0.3
// @description  失眠小助手B→‿→
// @author       https://space.bilibili.com/4460411/#黑山東雲光圈研究所
// @match        https://www.bilibili.com/apiww
// @grant        GM_addStyle
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/395920/BiliBili%20%E5%B0%91%E5%B9%B4Pi%E7%9A%84%E8%A7%86%E9%A2%91%E6%9B%B4%E6%96%B0%E7%9B%91%E6%8E%A7%20%282020%E5%B7%AB%E6%9C%AF%E4%B9%8B%E8%B7%AF%29.user.js
// @updateURL https://update.greasyfork.org/scripts/395920/BiliBili%20%E5%B0%91%E5%B9%B4Pi%E7%9A%84%E8%A7%86%E9%A2%91%E6%9B%B4%E6%96%B0%E7%9B%91%E6%8E%A7%20%282020%E5%B7%AB%E6%9C%AF%E4%B9%8B%E8%B7%AF%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
GM_addStyle(`.face-buy-header { position: relative; margin-top: 80px; }.face-buy-avatar { border-radius: 48px; display: block; width: 96px; height: 96px; margin: 0 auto 20px; top: -20px; position: relative; }.face-buy-g { position: absolute; top: -55px; left: 351px; width: 168px; height: 168px; } .f1 { width: 870px; margin: 0 auto; } .error-panel.server-error.error-404 { padding: 0 0 40px 0; } .face-buy-name { color: #111; font-size: 24px; line-height: 1em; padding-bottom: 16px; text-align: center; margin-top: 40px; }@keyframes blink{ 0%{ filter: none; } 50%{ filter: url(#a); } 100%{ filter: none; } }@keyframes blinkf{ 0%{ text-shadow:0; } 50%{ text-shadow: #ff22ff 0px 2px 3px; } 100%{ text-shadow:0; } } @-webkit-keyframes blink{ 0%{ filter: none; } 50%{ filter: url(#a); } 100%{ filter: none; } }@-webkit-keyframes blinkf{ 0%{ text-shadow:0; } 50%{ text-shadow: #ff22ff 0px 2px 3px; } 100%{ text-shadow:0; } } .blink img.face-buy-avatar { animation: blink 1s infinite; -webkit-animation: blink 1s infinite; } .blink .face-buy-name > .font { animation: blinkf 1s infinite; -webkit-animation: blinkf 1s infinite; } .blinkf img.face-buy-avatar { animation: blink 0.1s infinite; -webkit-animation: blink 0.1s infinite; } .blinkf .face-buy-name > .font { animation: blinkf 0.1s infinite; -webkit-animation: blinkf 0.1s infinite; } .g img.face-buy-avatar { filter: url(#a); } .g .face-buy-name > .font { text-shadow: #ff22ff 0px 2px 3px; } .face-buy-name > .font { margin: 0 12px; font-family: "KaiTi"; font-size: 28px; position: relative; display: inline-block; cursor: pointer; }.font .num { height: 12px; line-height: 12px; color: #fff; background-color: #f25d8e; border-radius: 10px; position: absolute; padding: 1px 2px; font-size: 12px; top: -9px; right: -13px; min-width: 16px; z-index: 30; text-align: center; }.m-loading .icon { width: 24px; height: 24px; margin-right: 5px; background-image: url(https://s1.hdslb.com/bfs/static/jinkela/space/asserts/loadingS.gif); background-repeat: no-repeat; display: inline-block; } .m-loading span { position: relative; top: -5px; color: #4c5155; } .f2 { margin: 0 auto; width: 870px; } .m-loading { display: inline-block; text-align: center; margin: 0 auto; width: 870px; position: relative; top: 10px; } font.iconf { color: #9ca6af; position: relative; top: -5px; left: -7px; }.ops { float: left; height: 24px; width: 100%; }.ops>span { width: 85px; margin-right: 8px; transition: all .3s; display: inline-block; white-space: nowrap; color: #505050; position: relative; }.ops>span i { font-size: 28px; vertical-align: top; margin-right: 6px; width: 28px; height: 28px; color: #757575; }[class^=van-icon-] { display: inline-block; font-style: normal; vertical-align: baseline; text-align: center; text-transform: none; line-height: 1; text-rendering: optimizeLegibility; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }.van-icon-error:before{content:"\\E62B"}.van-icon-serach:before{content:"\\E62F"}.van-icon-info:before{content:"\\E67D"}.van-icon-loading:before{content:"\\EEE3"}.van-icon-warning:before{content:"\\E664"}.van-icon-success:before{content:"\\E6F7"}.van-icon-jianpan:before{content:"\\E616"}.van-icon-lv0:before{content:"\\E6CB"}.van-icon-lv1:before{content:"\\E6CC"}.van-icon-lv2:before{content:"\\E6CD"}.van-icon-lv3:before{content:"\\E6CE"}.van-icon-lv4:before{content:"\\E6CF"}.van-icon-lv5:before{content:"\\E6D0"}.van-icon-lv6:before{content:"\\E6D1"}.van-icon-close:before{content:"\\E604"}.van-icon-fasong:before{content:"\\E666"}.van-icon-cai:before{content:"\\E638"}.van-icon-pinglun:before{content:"\\E639"}.van-icon-ding:before{content:"\\E63A"}.van-icon-guanbi:before{content:"\\E63C"}.van-icon-gengduo:before{content:"\\E63D"}.van-icon-biaoqing:before{content:"\\E63E"}.van-icon-videodetails_play:before{content:"\\E6E3"}.van-icon-videodetails_messag:before{content:"\\E6E5"}.van-icon-info_playnumber:before{content:"\\E6E6"}.van-icon-info_barragenumber:before{content:"\\E6E7"}.van-icon-info_rank:before{content:"\\E6E8"}.van-icon-info_prohibit:before{content:"\\E6E9"}.van-icon-general_moreactions:before{content:"\\E6EA"}.van-icon-general_pulldown_s:before{content:"\\E6EB"}.van-icon-general_pullup_s:before{content:"\\E6EC"}.van-icon-general_more:before{content:"\\E6ED"}.van-icon-general_close_s:before{content:"\\E6EE"}.van-icon-general_addto_s:before{content:"\\E6EF"}.van-icon-videodetails_collec:before{content:"\\E6E1"}.van-icon-videodetails_usemo:before{content:"\\E6E2"}.van-icon-videodetails_throw:before{content:"\\E6E4"}.van-icon-videodetails_like:before{content:"\\E6E0"}.van-icon-general_enter_s:before{content:"\\E6F0"}.van-icon-general_back_s:before{content:"\\E6F1"}.van-icon-floatwindow_custome:before{content:"\\E6F2"}.van-icon-share_weibo_default:before{content:"\\E71C"}.van-icon-share_tieba_default:before{content:"\\E71D"}.van-icon-share_wechat_default:before{content:"\\E721"}.van-icon-tuodong:before{content:"\\E665"}.van-icon-share_qq_default:before{content:"\\E71E"}.van-icon-share_news_default:before{content:"\\E71F"}.van-icon-share_qzone_default:before{content:"\\E720"}.van-icon-info_up:before{content:"\\E723"}.van-icon-Navbar_mobile:before{content:"\\E724"}.van-icon-Navbar_logo:before{content:"\\E725"}.van-icon-download:before{content:"\\E744"}.van-icon-general_viewlist:before{content:"\\E706"}.van-icon-general_viewmodule:before{content:"\\E707"}.van-icon-videodetails_share:before{content:"\\E70F"}@font-face{font-family:vanfont;src:url(//s1.hdslb.com/bfs/static/jinkela/video/asserts/iconfont.6f84c4e.eot);src:url(data:font/woff;base64,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) format("woff"),url(//s1.hdslb.com/bfs/static/jinkela/video/asserts/iconfont.0b40a61.ttf) format("truetype"),url(//s1.hdslb.com/bfs/static/jinkela/video/asserts/iconfont.8d945a9.svg#iconfont) format("svg")}.vanfont{display:inline-block;font-style:normal;vertical-align:baseline;text-align:center;text-transform:none;line-height:1;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.vanfont:before{display:block;font-family:vanfont!important}[class^=van-icon-]{display:inline-block;font-style:normal;vertical-align:baseline;text-align:center;text-transform:none;line-height:1;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}[class^=van-icon-]:before{display:block;font-family:vanfont!important} .video-toolbar { line-height: 30px; height: 28px; font-size: 14px; color: #505050; border-bottom: 1px solid #e5e9f0; padding-bottom: 8px; border-top: 1px solid #e5e9f0; padding-top: 8px; text-align: center; width: 100%; margin-top: 30px; }`);
$('.bili-header-m.report-wrap-module').remove();
$('title').html('奇妙催更中~');
$('.error-container').html(`        <div class="error-panel server-error error-404">
            <div class="f1">
				<div class="face-buy-header">
					<img src="//i0.hdslb.com/bfs/face/d851f48a579778b06249bf3debaa62d353694e91.jpg" class="face-buy-avatar">
					<img src="//i2.hdslb.com/bfs/face/6fbee28f782926612eb1ad71d6c8aa7264206fe9.png" class="face-buy-g">
					<div class="face-buy-name">战神Pi的
						<div class="font">巫术之路
							<div class="num">0</div>
						</div>
						<font class="result">更新了吗？</font>
					</div>
				</div>
			</div>
			<div class="f2">
			<div class="m-loading"><font class="iconf" title="秒后更新状态">0s</font><i class="icon"></i><span>监控中... 将在视频审核时发出通知~</span></div>
<div class="video-toolbar"><div class="ops">
<span title="播放数" class="playcount">
	<i class="van-icon-info_playnumber"></i><font>0</font></span>
<span title="弹幕数" class="vcomment">
	<i class="van-icon-info_barragenumber"></i><font>0</font></span>
<span title="点赞数" class="like">
	<i class="van-icon-videodetails_like"></i><font>0</font></span>
<span title="评论数" class="comment">
	<i class="van-icon-fasong"></i><font>0</font></span>
<span title="硬币数" class="coin">
	<i class="van-icon-videodetails_throw"></i><font>0</font></span>
<span title="收藏数" class="collect">
	<i class="van-icon-videodetails_collec"></i><font>0</font></span>
<span title="分享数" class="share">
	<i class="van-icon-videodetails_share"></i><font>0</font></span>
</div></div>
			</div>
		</div>
		<svg height="0" xmlns="http://www.w3.org/2000/svg"><defs><filter id="a"><feColorMatrix values="1 1 1 0 0 0.1 1 0 0 0 1 1 1 0 0 0 0 0 1 -0.04"></feColorMatrix></filter></defs></svg>
`);
function numup(element,newNumber){
	var n=newNumber-parseInt(element.text());
	n=n>=0?"+"+n:n;
    if(n==0){return;}
	var $i=$("<b>").text(n);
	var x=Math.min(element.offset().left+element.width()-5,$(window).width()-30),y=element.offset().top;
	$i.css({top:y-10,left:x,position:"absolute",color:"#E94F06",'font-size':element.css("font-size")});
	$("body").append($i);
	setTimeout(function(){element.text(newNumber);},300);
	$i.animate({top:y-30,opacity:0},1000,'swing',function(){
		$i.remove();
	});
}
function numup1(element,a){
	var $i=$("<b>").text(a);
	var x=Math.min(element.offset().left+element.width()-5,$(window).width()-30),y=element.offset().top;
	$i.css({top:y-10,left:x,position:"absolute",color:"#E94F06",'font-size':element.css("font-size")});
	$("body").append($i);
	$i.animate({top:y-30,opacity:0},1000,'swing',function(){
		$i.remove();
	});
}
var pnum=0,status=0,video=0;//0无更新，1审核中，2已更新，结束
function check(element){
    $.get('https://api.bilibili.com/x/web-interface/archive/stat?aid=86022417',function(data){
        numup($('.playcount font'),data.data.view);
        numup($('.vcomment font'),data.data.danmaku);
        numup($('.like font'),data.data.like);
        numup($('.comment font'),data.data.reply);
        numup($('.coin font'),data.data.coin);
        numup($('.collect font'),data.data.favorite);
        numup($('.share font'),data.data.share);
    },'json');
    $.get('https://space.bilibili.com/ajax/member/getSubmitVideos?mid=13046&page=1&pagesize=50&order=pubdate',function(data){
        var has=0;
        //$.each(data.data.vlist,function(i,e){if(e.aid=='86022417'){has=1;}});
        var nowtitle;
        $.each(data.data.vlist,function(i,e){if(e.aid=='86022417'){nowtitle=e.title;}});
        if(!!nowtitle.match(/\d+$/)&&video>0){if(video==nowtitle.match(/\d+$/)[0]){has=1;}}

        if(has==1&&status==0){
			numup1($('.m-loading span'),"\u5495\u5495\u5495\u007e");
			$('.error-container').removeClass('g blinkf').addClass('blink');}
        else if(has==0&&status==0){
			$('.result').html('正在审核中！');
			status=1;start=3;
			$('.error-container').removeClass('g blink').addClass('blinkf');
			$('.m-loading span').html('监控中... 将在视频审核通过后发出通知！');
			GM_notification('新视频已进入审核阶段！', '注意啦啦啦啦啦', 'https://i0.hdslb.com/bfs/face/d851f48a579778b06249bf3debaa62d353694e91.jpg');}
        else if(has==0&&status==1){
			numup1($('.m-loading span'),"\u5ba1\u6838\u541b\u53c8\u7761\u7740\u4e86\uff01\u007a\u007a\u005a");}
        else if(has==1&&status==1){
			$('.result').html('审核结束');status=3;
			$('.m-loading').html('若审核通过，视频将在十余分钟后出现，届时将会通知');}
        else if(has==1&&status==1){
			numup1($('.m-loading span'),"有没有？");}
    },'json');


    $.get('https://api.bilibili.com/x/web-interface/view?aid=86022417',function(data){
        if(video==0){
			numup($('.num'),data.data.videos);
			video=data.data.videos;
		}else{
            if(video!=data.data.videos){
				numup($('.num'),data.data.videos);
				$('.result').html('<font style="color:green">第'+data.data.videos+'P已更新！</font>');
				status=2;
				$('.error-container').removeClass('blinkf blink').addClass('g');
				$('.m-loading').html('监控完成，还不快去看视频？');
				GM_notification('战神的新视频更新啦！', '视频更新啦！视频更新啦！', 'https://i0.hdslb.com/bfs/face/d851f48a579778b06249bf3debaa62d353694e91.jpg');}
        }
    },'json');


}

var start = 9;
var start1 = 1;
var step = -1;
function count(){
    var not=start1==0?'获取中':start1+'s';
	$('.iconf').html(not);
	start1 += step;
	if(start1 < 0){start1 = start;}
    if(start1==start){check();}
	setTimeout(function(){if(status!=2){count()}},1000);
}
count();
$('.error-container').on('click','div.font',function(){window.open('https://www.bilibili.com/video/av86022417');});
})();

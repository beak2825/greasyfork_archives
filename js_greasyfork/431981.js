// ==UserScript==
// @name         多功能网页工具箱bate版
// @namespace    coolhii_vip
// @version      9.9.99
// @description  【多功能脚本仅供测试】网页视频解析；音乐及有声读物解析下载；购物优惠券查询（接口及资源来自各个网络作者提供以下代码已标明版权，本人仅负责编写优化）
// @author       吴雨轩 余天龙
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAE7ElEQVRoQ+2ZTWwbRRTH/2+dqKGoTZu1AwlIgFRxAw5cQEIoIC5IwIUDghO0u1tQqLJOaYoSYm/itEWkJGsCKKxNyAkkOMCJE1IKJ7hUqsSJDymgCkT8EdSKiHx4H7KdTdeb/fA6zpfInizNzHv/37wZz7w3hG364nL+KWYeLpsnotRkJvrNdriiZhtV5YWnwcIwCI/abTPwfYSF1ES24+tm+mwaQJ+ce04AJRh4OEDgVRBSuhH9qhkgWwbolwvPm0AS4AdCCSL6kYHRtCF+EWqco3PDAKpUfBFkagDu34oAgH8mimiTRsenjdgJDaDKCy8DQhLAvY049BkzD5gjeqZzNozd0ACW8biUU5ioDNIdxqGzLwN/AKylM7FMI3YaBrCc9Sn514nLIBwNJ4DzDEqmM9EPw42r7b1lgI2IKIU4gzUwjgYIukGgxGRGTG9FuDU2NIAq5XpKEH6ZyorX3QSoSnGA2BxhoM3eTsC/JnMinY2Nu40bkAp3r8A8oWdjV8KANQQAojkQGS3C6vDl6TsX3Bz2yQtvESIjlTbihG5EL7j1e+PVm52l0soYg2UwP7FzALfUTGE1ktBnj/8dZuZUdfEYlkpjYPRujNslgHX/dPkYLSc1o3vJD0RT+PAi58cIFN/Ub3cBqnKIcLG9W0xqGq3ZBWoatyxeL6SI8KYn4F4AsC2HET0bK5/UUKWchuqZ4f8dAATNUHU2eyr/QkEf80EEguaosufq6WTvs+8jcPbU4j0loZQAcNIXPvQSopmIKYy++/Hx38JMaugIWMZVJdcFk8qp42uuDusEIGCa6bZR3bj9zzDCrb4NA1gGentviC0rq0MErj2YAgCI6L221tbRSx8cLTQiPDRA/NTCCRbwmFfCMXAyd2Q1QkMMnK8Y9wAgovHWNTP1zkzsppvwuFR4hVtW5vTprvl6wAIj0Cf99SAJLYNgfmHdoG/mdOYMH4osF4dgmqb9ICOiyFqbODY1RctuwlQp3wvCoC1BmhXAlyYysZ/8QDwB+qXCI6bAg2A862GgDJLSM50zbu3MTETE1WDc+u3sG5eK55hM1SezmxWEkj7x0R3X3PxsAlCl/JMQoPoId9qZJ2C8/S7RcN5/vGZOUbj1sJkfApEcIiWdZcJ02oj+YLe7AdAvF58xyVRCCN8EwszvHzJheK3v80qxfdksxUMKd/jhz8AwrLyBmiDcCfI7CEZp9ZAx9cmRXLlRVf7pgrl0emvCa90Q8CUEMvY/gMXVhEjM78oScsZ/325iJ8i++RtV5fzc+qnpWs7YqwfZ+q04Saqcrxw2AK74geyVq4QlHEBPWbQdwFpFviDOpbZTlzmn8I3LnC0CTm2+IDt1nfYSXg+Aa0R2KqEJEh4GwHk1rjOpJ03PipXSoioVkiCulFh8P1tZpd5SjNse2Oyj9m5/AOAZhf9nBKTCtyB+PGBt2otUDSyh8KXFuvYA83eVfKBykUNpDKCHXEFC7IFmFXcDAK4KLAyXH81rMrK4knsJLJQfG+6rAakLoLnldQ+AXwk0OJkRP9/4G3Wb8T4ld5qYLgLoqLT7A2zLA0cNAKMAogE9I27Kv32rEnEld5YhvA3TvGCrMFT3QMATU9BfvtXu9cS0DjAEpnN6VtS97AWWVaoHUU6zA/g98tUr3NnP+chXPvysg9DPZl0AjYraiXH/ARKAvXii7yqAAAAAAElFTkSuQmCC

// @include      *://*.youku.com/v_*
// @include      *://*.iqiyi.com/v_*
// @include      *://*.iqiyi.com/w_*
// @include      *://*.iqiyi.com/a_*
// @include      *://*.le.com/ptv/vplay/*
// @include      *://v.qq.com/x/cover/*
// @include      *://v.qq.com/x/page/*
// @include      *://*.tudou.com/listplay/*
// @include      *://*.tudou.com/albumplay/*
// @include      *://*.tudou.com/programs/view/*
// @include      *://*.mgtv.com/b/*
// @include      *://film.sohu.com/album/*
// @include      *://tv.sohu.com/v/*
// @include      *://*.bilibili.com/anime/*
// @include      *://*.bilibili.com/bangumi/play/*
// @include      *://*.baofeng.com/play/*.
// @include      *://vip.pptv.com/show/*
// @include      *://v.pptv.com/show/*
// @include      *://showxi.xyz/mov/*

// @include      *music.163.com*
// @include      *://y.qq.com*
// @include      *://www.kugou.com*
// @include      *://www.kuwo.cn*
// @include      *://www.lizhi.fm*
// @include      *://*.ximalaya.com*
// @include      *://music.migu.cn*

// @include      *://cn.bing.com/
// @include      *://cn.bing.com/?FORM=*

// @include      *://item.taobao.com/*
// @include      *://*detail.tmall.com/*
// @include      *://*detail.tmall.hk/*
// @include      *://*product.suning.com/*
// @include      *://*item.jd.com/*
// @include      *://item.yiyaojd.com/*
// @include      *://npcitem.jd.hk/*
// @include      *://*detail.vip.com/*
// @include      *://*mobile.yangkeduo.com/goods*

// @include      *://*.taobao.com/*
// @include      *://www.zhihu.com/*
// @include      *://www.zhihu.com/*
// @include      https://v.vzuu.com/video/*
// @include      https://video.zhihu.com/video/*
// @connect      pcw-api.iqiyi.com
// @connect      zhihu.com
// @connect      vzuu.com
// @connect      t.mimixiaoke.com
// @connect      t.jtm.pub
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @grant        GM_download
// @grant        GM_info
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @run-at       document-idle
// @charset		 UTF-8
// @license      AGPL License
// @original-script https://greasyfork.org/zh-CN/scripts/398195
// @original-author 匆匆过客
// @original-license AGPL License
// @antifeature  referral-link
// @downloadURL https://update.greasyfork.org/scripts/431981/%E5%A4%9A%E5%8A%9F%E8%83%BD%E7%BD%91%E9%A1%B5%E5%B7%A5%E5%85%B7%E7%AE%B1bate%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/431981/%E5%A4%9A%E5%8A%9F%E8%83%BD%E7%BD%91%E9%A1%B5%E5%B7%A5%E5%85%B7%E7%AE%B1bate%E7%89%88.meta.js
// ==/UserScript==

(function() {
	'use strict';
	
    var $ = $ || window.$;
    const window_url = window.location.href;
    const website_host = window.location.host;
	
	/* 
		VIP解析部分代码借鉴以下脚本：
		脚本地址：https://greasyfork.org/zh-CN/scripts/398195
		作者：匆匆过客，代码已经授权！
	 */
	//VIP视频解析
	const coolhiiVIPVideo={};
	coolhiiVIPVideo.eleId = Math.ceil(Math.random()*100000000);
	coolhiiVIPVideo.analysisWebsite="https://showxi.xyz/mov/s/?sv=1&url=";
	coolhiiVIPVideo.defaultSourceArray=[
		{"name":"纯净解析","url":"https://z1.m1907.cn/?jx="},
		{"name":"高速接口1","url":"https://jsap.attakids.com/?url="},
		{"name":"B站解析1","url":"https://vip.parwix.com:4433/player/?url="},
		{"name":"B站解析2","url":"https://www.cuan.la/m3u8.php?url="},
		{"name":"Ckplayer","url":"https://www.ckplayer.vip/jiexi/?url="},
		{"name":"乐多资源","url":"https://api.leduotv.com/wp-api/ifr.php?isDp=1&vid="},
		{"name":"ccyjjd","url":"https://ckmov.ccyjjd.com/ckmov/?url="},
		{"name":"M3U8","url":"https://jx.m3u8.tv/jiexi/?url="},
		{"name":"BL","url":"https://vip.bljiex.com/?v="},
		{"name":"老板","url":"https://vip.laobandq.com/jiexi.php?url="},
		{"name":"Mao解析","url":"https://91jxs.com/jiexi/?url="},
		{"name":"盘古","url":"https://www.pangujiexi.cc/jiexi.php?url="},
		{"name":"大白","url":"https://api.myzch.cn/?url="},
		{"name":"云点播","url":"https://api.iopenyun.com:88/vip/?url="},
		{"name":"SSAMAO","url":"https://www.ssamao.com/jx/?url="},
		{"name":"无极","url":"https://da.wujiys.com/?url="},
		{"name":"618G","url":"https://jx.618g.com/?url="},
		{"name":"ckmov","url":"https://www.ckmov.vip/api.php?url="},
		{"name":"迪奥","url":"https://123.1dior.cn/?url="},
		{"name":"福星","url":"https://jx.popo520.cn/jiexi/?url="},
		{"name":"RDHK","url":"https://jx.rdhk.net/?v="},
		{"name":"H8","url":"https://www.h8jx.com/jiexi.php?url="},
		{"name":"解析la","url":"https://api.jiexi.la/?url="},
		{"name":"久播","url":"https://jx.jiubojx.com/vip.php?url="},
		{"name":"九八","url":"https://jx.youyitv.com/?url="},
		{"name":"老板","url":"https://vip.laobandq.com/jiexi.php?url="},
		{"name":"乐喵","url":"https://jx.hao-zsj.cn/vip/?url="},
		{"name":"MUTV","url":"https://jiexi.janan.net/jiexi/?url="},
		{"name":"明日","url":"https://jx.yingxiangbao.cn/vip.php?url="},
		{"name":"磨菇","url":"https://jx.wzslw.cn/?url="},
		{"name":"OK","url":"https://okjx.cc/?url="},
		{"name":"维多","url":"https://jx.ivito.cn/?url="},
		{"name":"小蒋","url":"https://www.kpezp.cn/jlexi.php?url="},
		{"name":"小狼","url":"https://jx.yaohuaxuan.com/?url="},
		{"name":"智能","url":"https://vip.kurumit3.top/?v="},
		{"name":"星驰","url":"https://vip.cjys.top/?url="},
		{"name":"星空","url":"http://60jx.com/?url="},
		{"name":"月亮","url":"https://api.yueliangjx.com/?url="},
		{"name":"0523","url":"https://go.yh0523.cn/y.cy?url="},
		{"name":"云端","url":"https://jx.ergan.top/?url="},
		{"name":"17云","url":"https://www.1717yun.com/jx/ty.php?url="},
		{"name":"66","url":"https://api.3jx.top/vip/?url="},
		{"name":"116","url":"https://jx.116kan.com/?url="},
		{"name":"200","url":"https://vip.66parse.club/?url="},
		{"name":"云析","url":"https://jx.yparse.com/index.php?url="},
		{"name":"8090","url":"https://www.8090g.cn/?url="}
	];
	coolhiiVIPVideo.iframePlayerNodes = [
		{ url:"v.qq.com", node:"#mod_player"},
		{ url:"www.iqiyi.com", node:"#flashbox"},
		{ url:"v.youku.com", node:"#player"},
		{ url:"w.mgtv.com", node:"#mgtv-player-wrap"},
		{ url:"www.mgtv.com", node:"#mgtv-player-wrap"},
		{ url:"tv.sohu.com", node:"#player"},
		{ url:"film.sohu.com", node:"#playerWrap"},
		{ url:"www.le.com", node:"#le_playbox"},
		{ url:"video.tudou.com", node:".td-playbox"},
		{ url:"v.pptv.com", node:"#pptv_playpage_box"},
		{ url:"vip.pptv.com", node:".w-video"},
		{ url:"www.wasu.cn", node:"#flashContent"},
		{ url:"www.acfun.cn", node:"#ACPlayer"},
		{ url:"vip.1905.com", node:"#player"},
		{url:"play.tudou.com",node:"#player"},
		{url:"www.bilibili.com/video",node:"#bilibiliPlayer"},
		{url:"www.bilibili.com/bangumi",node:"#player_module"},
	];
	coolhiiVIPVideo.judgeVipWebsite=function(){
		var isVip = false;
		var host = window.location.host;
		var vipWebsites = ["iqiyi.com","v.qq.com","youku.com", "le.com","tudou.com","mgtv.com","sohu.com",
			"acfun.cn","bilibili.com","baofeng.com","pptv.com"];
   		for(var b=0; b<vipWebsites.length; b++){
	   		if(host.indexOf(vipWebsites[b]) != -1){
	   			isVip = true;
	   			break;
	   		}
	   	}
   		return isVip;
	};
	coolhiiVIPVideo.addStyle=function(){
		var themeColor = "#FF6600";
		var innnerCss = "";
		innnerCss += "#plugin_coolhii_analysis_vip_"+this.eleId+"{position:fixed; top:160px; left:0px; width:25px; z-index:99999999999999;}";
		innnerCss += "#plugin_coolhii_analysis_vip_"+this.eleId+" .vip_analysis_interface_box{position:relative;}";
		
		innnerCss += "#plugin_coolhii_analysis_vip_"+this.eleId+" .plugin_item{cursor:pointer;text-align:center;}";
		innnerCss += "#plugin_coolhii_analysis_vip_"+this.eleId+" .jump_analysis_666666 >img{width:100%; display: inline-block; vertical-align: middle;}";
		
		innnerCss += "#plugin_coolhii_analysis_vip_"+this.eleId+" .setting_analysis_666666{height:25px;line-height:25px;margin-top:5px;background-color:"+themeColor+";border-radius:4px;}";
		innnerCss += "#plugin_coolhii_analysis_vip_"+this.eleId+" .setting_analysis_666666 >img{width:80%; display: inline-block; vertical-align: middle;}";
		
		innnerCss += "#plugin_coolhii_analysis_vip_"+this.eleId+" .select_interface_box_outer{display:none;position:absolute;top:-60px;left:25px;padding:5px;}";
		innnerCss += "#plugin_coolhii_analysis_vip_"+this.eleId+" .select_interface_box{width:300px;height:350px;background-color:rgba(241,241,241,0.8);overflow-y:auto;border-radius:4px;}";
		innnerCss += "#plugin_coolhii_analysis_vip_"+this.eleId+" .select_interface_box::-webkit-scrollbar{width:5px; height:1px;}";
		innnerCss += "#plugin_coolhii_analysis_vip_"+this.eleId+" .select_interface_box::-webkit-scrollbar-thumb{border-radius: 4px;box-shadow:inset 0 0 5px rgba(0, 0, 0, 0.2); background:#A8A8A8;}";
		innnerCss += "#plugin_coolhii_analysis_vip_"+this.eleId+" .select_interface_box::-webkit-scrollbar-track{border-radius: 4px;box-shadow:inset 0 0 5px rgba(0, 0, 0, 0.2); background:#F1F1F1;}";
		
		innnerCss += "#plugin_coolhii_analysis_vip_"+this.eleId+" .select_interface_box >span{border-top:3px solid "+themeColor+"; border-bottom:3px solid "+themeColor+";display:inline-block;width:calc(25% - 6px);width:-moz-calc(25% - 6px);width: -webkit-calc(25% - 6px);height:20px;line-height:20px;background-color:#FF6600;color:#FFF;cursor:pointer;margin:3px;text-align:center;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;-o-text-overflow:ellipsis;font-size:12px!important;}";
		innnerCss += "#plugin_coolhii_analysis_vip_"+this.eleId+" .select_interface_box >span:hover{border-top:3px solid #FFF; border-bottom:3px solid #FFF;}";
		innnerCss += "#plugin_coolhii_analysis_vip_"+this.eleId+" .select_interface_box >span.hover-mark{border-top:3px solid #FFF; border-bottom:3px solid #FFF;}";
		
		//innnerCss += "#plugin_coolhii_setting_vip_"+this.eleId+"{}";
		//innnerCss += "#plugin_coolhii_setting_vip_"+this.eleId+" .setting_vip_container{ z-index: 9999; -webkit-box-sizing: border-box; box-sizing: border-box; position: fixed; left: 50%; top: 160px; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%); max-width: 500px; width: 90%; max-height: 85%; border-radius: 4px; background-color: rgba(241,241,241, 0.8); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px); overflow: hidden; -webkit-box-shadow: 0px 2px 9px 3px #8d8d8d66; box-shadow: 0px 2px 9px 3px #8d8d8d66; padding: 25px; display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-orient: vertical; -webkit-box-direction: normal; -ms-flex-direction: column; flex-direction: column; -webkit-transition: 0.5s all ease-in-out; transition: 0.5s all ease-in-out; }";
		$("body").prepend("<style>"+innnerCss+"</style>");
	};
	coolhiiVIPVideo.generateHtml=function(){
		var interfaceHtml = "";
		for(var i=0; i<this.defaultSourceArray.length; i++){
			var obj = this.defaultSourceArray[i];
			interfaceHtml += "<span data-url='"+obj.url+"'>"+obj.name+"</span>";
		}
		var vipBase64Image = "data:image/png;base64,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";
		//var settingBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADVUlEQVRoQ+2ZT6hVVRTGfx9O1KE0USEcpEKCopANgrQkKFIcGYZJqBE0E4xERFQIBY3CWYH/qIi0iUgFimEK1kArCjIiMUVFsIEQjUT4Ysm5cLF7zt7n3H25vngLHm9w1l77+9Zea+211xUTXDTB8TNJYNwnOHkC/8sTsO0aYo9LulGSdPEQsr0aOFEDcrOkA48sAdvTgHPAUzUgz0ta9igTeBfYngC4VdK+UiSKhZDtNcDxTGCvS/o4U7dRrQiBluB7gPYCeyT9MwyRLAK25wFXJd3vbWZ7NrAYeBNY1RHET8AF4CxwHbgbf5Lu2p4v6feU3SQB2zuBXZWhW8AfwHxgZsp4ge87JEVe1UojAdtPVx6aUgBMVxNzJV2pW5wi8DXwUtedC607K+n51gRsbwY+KARiWDMbJR0ZZGTgCdh+siqJCzrufBP4HjgD3APi8loOzOloD0kDsdaGkO2pwOdAtAa58idwoK5dsL0feDvXWJ/eIkm/ZJ9AX6mMliBag2gRUnIJeFnSnZRiQ7M3aOkrkr5onQN9JKI1aCxlle5zkr5NgY/vtl8FPsvQ3S/pnSa95D1QbRj1f1aDod2SendFBq4HJE4DLySUl0q6WILAycRtu0rSl1nIKyXbUeGi0tXJGUkpgnmPetvh3biR62SWpNstCbwGfNKw5pCkN1I2c0NoHASywjKXQHgqPFYnowihU5JeHPoEbC8BfkgYyvJWv42MJP4biPp/bagktn0Q2JTyBDCKMnpU0obOBGyvB3JfTqO6yDZIOlpHoqmVWAj8nOH5fpVRtBIRQnHDXx6EpYlA3Wwnh1PpZu5XIFqK/5BoItDmkZ5DahidtyR92OoEQtl2TBmCyDjlmKS1rXOgIvAY8Nc40QPPSPquE4GKREwdPhoTifclbelcRnsLY+7zcE9uO15X8cqKG3pFR4K/AZ8C3wC3JN20/QQwF4j/R1Jzo6xWIgXOdnjpvZTeQ993V4OteHJ2liIEqlCLG/NwJpLWrUfnHMgE9EDN9rbwamLNV5JWtrE7dA7kbmZ7OhA/YMyoWROjyWclxcSiiBQLob6Ej6RcV4OuWOj07I+CQAx8f6whME9SzFaLSXECxZBlGpokkOmokalNnsDIXJtpeMKfwL8hFx1AI8xv0wAAAABJRU5ErkJggg==";
		var html=
			`
			<div id='plugin_coolhii_analysis_vip_`+this.eleId+`'>
				<div class="vip_analysis_interface_box">
					<div class='plugin_item jump_analysis_666666' title='点我！跳转综合VIP视频解析，电视剧可免跳出选集'><img src='`+vipBase64Image+`'></div>
					<div class="select_interface_box_outer">					
						<div class='select_interface_box'>
							`+interfaceHtml+`
						</div>;
					</div>
				</div>
			</div>
			`;
		// var html=
		// 	`
		// 	<div id='plugin_coolhii_analysis_vip_`+this.eleId+`'>
				
		// 		<div class="vip_analysis_interface_box">
		// 			<div class='plugin_item jump_analysis_666666' title='点我！跳转综合VIP视频解析，电视剧可免跳出选集'><img src='`+vipBase64Image+`'></div>
		// 			<div class="select_interface_box_outer">					
		// 				<div class='select_interface_box'>
		// 					`+interfaceHtml+`
		// 				</div>;
		// 			</div>
		// 		</div>
		// 		<div class="plugin_item setting_analysis_666666"><img src='`+settingBase64+`'></div>
		// 	</div>
		// 	<div id='plugin_coolhii_setting_vip_`+this.eleId+`'>
		// 		<div class="setting_vip_container"></div>
		// 	</div>
		// 	`;
		$("body").append(html);
	};
	coolhiiVIPVideo.operation=function(){		
		$("body").on("click", "#plugin_coolhii_analysis_vip_"+coolhiiVIPVideo.eleId+" .jump_analysis_666666", function(){
			var jumpWebsite = coolhiiVIPVideo.analysisWebsite + window_url;
			GM_openInTab(jumpWebsite, {active:true});
		});
		
		$("body").on("click", "#plugin_coolhii_analysis_vip_"+coolhiiVIPVideo.eleId+" .setting_analysis_666666", function(){
			alert("1");
		});
		
		$("body").on("click", "#plugin_coolhii_analysis_vip_"+coolhiiVIPVideo.eleId+" .select_interface_box>span", function(){
			var node = "";
			var iframePlayerNodes = coolhiiVIPVideo.iframePlayerNodes;
			for(var m in iframePlayerNodes) {
				var playUrl = window.location.href;
				if(playUrl.indexOf(iframePlayerNodes[m].url)!= -1){
					node = iframePlayerNodes[m].node;
				}
			}
			
			//标记点击过的接口
			$("#plugin_coolhii_analysis_vip_"+coolhiiVIPVideo.eleId+" .select_interface_box>span").removeClass("hover-mark");
			$(this).addClass("hover-mark");
			
			$("#play-iframe-outer-7788OP-99999900-99999900OOO").remove();
			var playUrl = window.location.href;
			var playHtml = "<div id='play-iframe-outer-7788OP-99999900OOO' style='width:100%;height:100%;'><iframe allowtransparency=true frameborder='0' scrolling='no' allowfullscreen=true allowtransparency=true name='jx_play' style='height:100%;width:100%' id='play-iframe-6677i9999999666666'></iframe></div>";
			$(node).html(playHtml);
			var iframeSrc= $(this).attr("data-url")+playUrl;
			$("#play-iframe-6677i9999999666666").attr("src", iframeSrc);
		});
		
		var $vipMovieBox = $("#plugin_coolhii_analysis_vip_"+coolhiiVIPVideo.eleId+" .vip_analysis_interface_box");
		var $playSourceBox = $("#plugin_coolhii_analysis_vip_"+coolhiiVIPVideo.eleId+" .select_interface_box_outer");
		$vipMovieBox.on("mouseover", () => {
			$playSourceBox.show();
		});
		$vipMovieBox.on("mouseout", () => {
			$playSourceBox.hide();
		});
	};
	coolhiiVIPVideo.paramsSelectedInit=function(){
		var episodeList=[];
		var episodeObj = {
			"websiteTitle":"",
			"episodeList":episodeList,
			"originVideoUrl":""
		};
		GM_setValue("episodeObj",episodeObj);
		return episodeObj;
	};
    coolhiiVIPVideo.getSelected=function(){
		if(website_host==="v.qq.com"){
			setInterval(function(){ //每100ms,检测一次集数的变化
				var episodeObj = coolhiiVIPVideo.paramsSelectedInit();
				var episodeList = episodeObj.episodeList;
				var $mod_episode = $(".mod_episode");
				try{
					if($mod_episode.attr("data-tpl")=="episode"){
						$mod_episode.find(".item").each(function(){
							var $a = $(this).find("a");
							var href = $a.attr("href");
							if(!!href){
								href = "https://v.qq.com"+href;
								var aText = $a.text();
								aText = aText.replace(/\s/g,"");
	    						episodeList.push({"aText":aText, "href":href, "description":""});
							}
						});
					}
				}catch(e){}
				//加入油猴缓存
				episodeObj.websiteTitle="qq";
				episodeObj.originVideoUrl=window_url;
				if(episodeList.length!=0){
					episodeObj.episodeList=episodeList;
	    		}
				GM_setValue("episodeObj",episodeObj);
			},100);
		};
		if(website_host==="www.iqiyi.com"){
			var episodeObj = coolhiiVIPVideo.paramsSelectedInit();
			var episodeList = episodeObj.episodeList;
			var $i71playpagesdramalist = $("div[is='i71-play-ab']");
			if($i71playpagesdramalist.length!=0){
				var data =  $i71playpagesdramalist.attr(":page-info");
				if(!!data){
					var dataJson = JSON.parse(data);
					var barTotal = 1;
					var albumId = dataJson.albumId;
					console.log("albumId=",albumId);
					try{
						var $barlis = $(".qy-episode-tab").find(".bar-li");
						barTotal = $barlis.length;
						if(barTotal==0) barTotal=1;
					}catch(e){}
					//获取具体数据
					for(var page=1; page<=barTotal;  page++){
						try{
							GM_xmlhttpRequest({
								url: "https://pcw-api.iqiyi.com/albums/album/avlistinfo?aid="+albumId+"&page="+page+"&size=30",
							  	method: "GET",
							  	headers: {"Content-Type": "application/x-www-form-urlencoded"},
							  	onload: function(response) {
									var status = response.status;
									if(status==200||status=='200'){
										var serverResponseJson = JSON.parse(response.responseText);
										var code = serverResponseJson.code;
										if(code=="A00000"){
											var serverEpsodelist = serverResponseJson.data.epsodelist;
											//console.log(serverEpsodelist)
											for(var i=0; i<serverEpsodelist.length; i++){
												var aText = serverEpsodelist[i].order;
												var href = serverEpsodelist[i].playUrl;
												var description = serverEpsodelist[i].subtitle;
												episodeList.push({"aText":aText, "href":href, "description":description});
											}
											//加入油猴缓存
											if(episodeList.length!=0){
												episodeObj.episodeList=episodeList;
											}
											episodeObj.websiteTitle="iqiyi";
											episodeObj.originVideoUrl=window_url;
											GM_setValue("episodeObj",episodeObj);
										}
									}
							  	}
							});
						}catch(err){}
						setTimeout(function(){}, 500);
					}
					episodeObj.websiteTitle="iqiyi";
					episodeObj.originVideoUrl=window_url;
					GM_setValue("episodeObj",episodeObj);
				}
			}
		};
		if(website_host==="www.mgtv.com"){
			var episodeObj = coolhiiVIPVideo.paramsSelectedInit();
			var episodeList = episodeObj.episodeList;
			setTimeout(function(){
				$("body").find(".aside-tabbox").each(function(){
					$(this).find("li").each(function(){
	    				var $a = $(this).find("a");
						var href = $a.attr("href");
						var aText = $(this).text();
						if(!!href && aText.indexOf("预告")==-1){
							href = "https://www.mgtv.com"+href;
							aText = aText.replace("VIP","");
							episodeList.push({"aText":aText, "href":href, "description":""});
						}
					});
				});
				//加入油猴缓存
				episodeObj.websiteTitle="mgtv";
				episodeObj.originVideoUrl=window_url;
				if(episodeList.length!=0){
					episodeObj.episodeList=episodeList;
	    		}
				GM_setValue("episodeObj",episodeObj);
			},1000);
		};
		if(website_host==="v.youku.com"){
			function youku_select(){
				var episodeObj = coolhiiVIPVideo.paramsSelectedInit();
				var episodeList = episodeObj.episodeList;
				$(".anthology-content-scroll").find(".anthology-content").find(".box-item").each(function(){
					var title = $(this).attr("title");
					var href = $(this).attr("href");
					
					var $markText = $(this).find(".mark-text");
					if($markText.length==0 || "预告".indexOf($markText.text)==-1){
						if(!!href){
							var aText = title;
							var arr = aText.split(" ");
							if(arr.length>=2) aText = arr[arr.length-1];
							aText = aText.replace(/[^0-9]/ig,"");
							
							if(!!aText){
								episodeList.push({"aText":aText, "href":href, "description":title});
								//console.log({"aText":aText, "href":href, "description":title})
							}
						}
					}
				});
				//加入油猴缓存
				episodeObj.websiteTitle="youku";
				episodeObj.originVideoUrl=window_url;
				if(episodeList.length!=0){
	    			episodeObj.episodeList=episodeList;
	    		}
				GM_setValue("episodeObj",episodeObj);
			}
			youku_select();
			setInterval(function(){
				youku_select();
			}, 600);
		};
		if(website_host==="tv.sohu.com"){
			var episodeObj = coolhiiVIPVideo.paramsSelectedInit();
			var episodeList = episodeObj.episodeList;
			setTimeout(function(){
				var $jlistwrap = $(".j-list-wrap");
				if(!!$jlistwrap){
					$jlistwrap.find("li").each(function(){
						var $a = $(this).find("a");
						if(!!$a){
							var aText = $(this).attr("data-order");
							var href = $a.attr("href");
							var title = $a.attr("data-title");
							if(!!aText && !!href){
								href = "https"+href;
								episodeList.push({"aText":aText, "href":href, "description":title});
								//console.log({"aText":aText, "href":href, "description":title});
							}
						}
					});
				}
				//加入油猴缓存
				episodeObj.websiteTitle="sohu";
				episodeObj.originVideoUrl=window_url;
				if(episodeList.length!=0){
	    			episodeObj.episodeList=episodeList;
	    		}
				GM_setValue("episodeObj",episodeObj);
			},1000);
		};
    };
	//支持电视剧选集
	coolhiiVIPVideo.movieWebsitesPlayersSelected=function(){
		if(window_url.indexOf("showxi.xyz")!=-1){
			var innerCss= 
				`
				#plugin_coolhii_episode_box{overflow:auto;font-size:14px!important;text-align:left!important;}
				#plugin_coolhii_episode_box .tip{padding:5px;}
				#plugin_coolhii_episode_box .episode-items> a{display:inline-block;width:25px;height:25px;text-align:center;line-height:25px;border:1px dashed #000;color:#000;margin:5px;text-decoration:none;cursor:pointer;}
				#plugin_coolhii_episode_box .episode-items> a:hover{border:1px dashed #FF5302;color:#FF5302;}
				#plugin_coolhii_episode_box .episode-items> .active{border:1px dashed #FF5302;color:#FF5302;}
				`;
			$("body").prepend("<style>"+innerCss+"</style>");
			var episodeObj = GM_getValue("episodeObj");
			if(!!episodeObj){
				var episodeList = episodeObj.episodeList;
				if(!!episodeList && episodeList.length!=0){
					episodeList.sort((d1, d2)=>{  //排序
						var aText1 = d1.aText;
						var aText2 = d2.aText;
						var aText1Value = parseInt(aText1);
						var aText2Value = parseInt(aText2);
						if(isNaN(aText1Value) || isNaN(aText2Value)){
							return 0;
						}else{
							return aText1Value-aText2Value;
						}
					});
					
					var websiteTitle = episodeObj.websiteTitle;
					var currentvideourl = GM_getValue("currentvideourl");
					var originVideoUrl=episodeObj.originVideoUrl;
					var waiturl="";
					var aclass="";
					
					var html = "<div id='plugin_coolhii_episode_box'>";
					html += "<div class='tip'><b>电视剧点击集数，可自由选集，<a href='"+originVideoUrl+"'>点我返回原视频</a></b></div>";
					html += "<div class='episode-items'>";
					for(var i=0; i<episodeList.length; i++){
						waiturl=episodeList[i].href;
						aclass="plugin-episode";
						if(window_url.indexOf(waiturl)!=-1 || (currentvideourl==waiturl && websiteTitle=="iqiyi")){
							aclass = aclass +" "+"active";
						}
						html+= "<a class='"+aclass+"' data-href='"+waiturl+"' title='"+episodeList[i].description+"'>"+episodeList[i].aText+"</a>";
					}
					html += "</div>";
					html += "</div>";
					
					let insertHtmlInterval = setInterval(function(){
						var $selectContainer = $("#palyer-iframe");
						if($selectContainer.length!=0){
							$selectContainer.after(html);
							clearInterval(insertHtmlInterval)
						}
					}, 100);
					
				}
			}
			$("body").on("click", ".plugin-episode", function(){
				var href=$(this).data("href");
				if(!!href){
					href = coolhiiVIPVideo.analysisWebsite+href;
					window.location.href=href;
				}
			});			
		}
	};
	
	//视频广告过滤相关代码借鉴自其它脚本，该部分代码版权归原作者所有！在此感谢
	//借鉴脚本作者：sign
	//地址：https://greasyfork.org/zh-CN/scripts/406849
	//修改：优化了该段代码的逻辑，使可读性更高
	coolhiiVIPVideo.advertisingAcceleration=function(){
		var currentHost = window.location.host;
		if(currentHost==="www.iqiyi.com"){
			try{
				unsafeWindow.rate = 0;
				unsafeWindow.Date.now = () => {
					return new unsafeWindow.Date().getTime() + (unsafeWindow.rate += 1000);
				}
				setInterval(() => {
					unsafeWindow.rate = 0;
				}, 600000);
			}catch(e){}
			try{
				setInterval(() => {
					if (document.getElementsByClassName("cupid-public-time")[0] != null) {
						$(".skippable-after").css("display", "block");
						document.getElementsByClassName("skippable-after")[0].click();
					}
					$(".qy-player-vippay-popup").css("display", "none");
					$(".black-screen").css("display", "none");
				}, 500);
			}catch(e){}
		}
		else if(currentHost==="v.qq.com"){
			try{
				setInterval(() => { //视频广告加速
					$(".txp_ad").find("txpdiv").find("video")[0].currentTime = 1000;
					$(".txp_ad").find("txpdiv").find("video")[1].currentTime = 1000;
				}, 1000)
			}catch(e){}
			try{
				setInterval(() => {
					var txp_btn_volume = $(".txp_btn_volume");
					if (txp_btn_volume.attr("data-status") === "mute") {
						$(".txp_popup_volume").css("display", "block");
						txp_btn_volume.click();
						$(".txp_popup_volume").css("display", "none");
					}
					$(".mod_vip_popup").css("display", "none");
					$(".tvip_layer").css("display", "none");
					$("#mask_layer").css("display", "none");
				}, 500);
			}catch(e){}
		}
		else if(currentHost==="v.youku.com"){
			try{
				window.onload = function () {
					if (!document.querySelectorAll('video')[0]) {
						setInterval(() => {
							document.querySelectorAll('video')[1].playbackRate = 16;
						}, 100)
					}
				}
			}catch(e){}
			try{
				setInterval(() => {
					var H5 = $(".h5-ext-layer").find("div")
					if(H5.length != 0){
						$(".h5-ext-layer div").remove();
						var control_btn_play = $(".control-left-grid .control-play-icon");
						if (control_btn_play.attr("data-tip") === "播放") {
							$(".h5player-dashboard").css("display", "block");
							control_btn_play.click();
							$(".h5player-dashboard").css("display", "none");
						}
					}
					$(".information-tips").css("display", "none");
				}, 500);
			}catch(e){}
		}
		else if(currentHost==="tv.sohu.com"){
			try{
				setInterval(() => {
					$(".x-video-adv").css("display", "none");
					$(".x-player-mask").css("display", "none");
					$("#player_vipTips").css("display", "none");
				}, 500);
			}catch(e){}
		}
	};
	coolhiiVIPVideo.start=function(){
    	if(this.judgeVipWebsite() && window.top==window.self){
    		this.addStyle();
			this.generateHtml();
			this.operation();
    		this.getSelected();
    	}
		this.advertisingAcceleration();
    	this.movieWebsitesPlayersSelected();
    };
	coolhiiVIPVideo.start();
   	   	   	
   	/**
   	 * 音乐下载：无损音乐、封面、歌词
   	 */
   	const coolhiiVIPMusic={};
   	coolhiiVIPMusic.eleId = Math.ceil(Math.random()*100000000);
   	coolhiiVIPMusic.isRun = function(){
   		var musicurls=["music.163.com","y.qq.com","www.kugou.com","www.kuwo.cn","www.xiami.com","music.taihe.com","music.migu.cn","lizhi.fm","qingting.fm","ximalaya.com"];
   		for(var i=0; i<musicurls.length;i++){
   			if(window.location.host.indexOf(musicurls[i])!=-1){
   				return true;
   			}
   		}
   		return false;
   	};
   	coolhiiVIPMusic.getPlayUrl = function(){
   		var currentHost = window.location.host;
   		var currentUrl = window.location.href;
   		var playUrl = null;
   		if(currentUrl.match(/music\.163\./)){ //网易云音乐
   			if(currentUrl.match(/^https?:\/\/music\.163\.com\/#\/(?:song|dj)\?id/)) {
   				playUrl = 'https://music.liuzhijin.cn/?url='+encodeURIComponent(currentUrl);
   			}else if(currentUrl.match(/^https?:\/\/y\.music\.163\.com\/m\/(?:song|dj)\?id/)) {
   				playUrl = 'https://music.liuzhijin.cn/?url='+encodeURIComponent('https://music.163.com/song?id='+getQueryString('id'));
   			}
   		}
   		else if(currentUrl.match(/y\.qq\.com/)){ //QQ音乐
   			if(currentUrl.indexOf("?")) currentUrl = currentUrl.split("?")[0];
   			if(currentUrl.indexOf("#")) currentUrl = currentUrl.split("#")[0];
   			var musicMatch = currentUrl.match(/^https?:\/\/y\.qq\.com\/n\/ryqq\/songDetail\/(\S*)/);
   			if(musicMatch){
   				playUrl = 'https://music.liuzhijin.cn/?id='+musicMatch[1]+'&type=qq'
   			}
   			var musicMatch2 = currentUrl.match(/^https?:\/\/y\.qq\.com\/n\/yqq\/song\/(\S*).html/);
   			if(musicMatch2){
   				playUrl = 'https://music.liuzhijin.cn/?id='+musicMatch2[1]+'&type=qq';
   			}
   		}
   		else if(currentUrl.match(/kugou\.com/)){ //酷狗
   			var musicMatch = currentUrl.match(/hash=(\S*)&album/);
   			if(musicMatch){
   				playUrl = 'https://music.liuzhijin.cn/?id='+musicMatch[1]+'&type=kugou';
   			}
   		}
   		else if(currentUrl.match(/kuwo\.cn/)){  //酷我
   			if(currentUrl.indexOf("?")) currentUrl = currentUrl.split("?")[0];
   			if(currentUrl.indexOf("#")) currentUrl = currentUrl.split("#")[0];
   			var musicMatch = currentUrl.match(/play_detail\/(\S*)/);
   			if(musicMatch){
   				playUrl = 'https://music.liuzhijin.cn/?id='+musicMatch[1]+'&type=kuwo';
   			}
   		}
   		else if(currentUrl.match(/www\.ximalaya\.com/)){ //喜马拉雅
   		    var xmlyUrlArr = currentUrl.split("/");
   		    for(var xuaIndex =0;xuaIndex<xmlyUrlArr.length;xuaIndex++){
   		        if(xuaIndex==xmlyUrlArr.length-1){
   					playUrl = 'https://music.liuzhijin.cn/?id='+xmlyUrlArr[xuaIndex]+'&type=ximalaya&playUrl='+encodeURIComponent(currentUrl);
   		        }
   		    }
   		}
   		else if(currentUrl.match(/www\.lizhi\.fm/)){ //荔枝音乐
   			if(currentUrl.indexOf("?")) currentUrl = currentUrl.split("?")[0];
   			if(currentUrl.indexOf("#")) currentUrl = currentUrl.split("#")[0];
   			var musicMatch = currentUrl.match(/^https?:\/\/www\.lizhi\.fm\/(\d*)\/(\d*)/);
   			if(musicMatch){
   				playUrl = 'https://music.liuzhijin.cn/?id='+musicMatch[2]+'&type=lizhi';
   			}
   		}
   		else if(currentUrl.match(/music\.migu\.cn/)){ //咪咕音乐
   			if(currentUrl.indexOf("?")) currentUrl = currentUrl.split("?")[0];
   			if(currentUrl.indexOf("#")) currentUrl = currentUrl.split("#")[0];
   			var musicMatch = currentUrl.match(/^https?:\/\/music\.migu\.cn\/v3\/music\/song\/(\S*)/);
   			if(musicMatch){
   				playUrl = 'https://music.liuzhijin.cn/?id='+musicMatch[1]+'&type=migu';
   			}
   		}
   		return playUrl;
   	};
   	coolhiiVIPMusic.addStyle=function(){
		var themeColor = "#FF6600";
   		var innnerCss = 
   		"@keyframes turnaround{0%{-webkit-transform:rotate(0deg);}25%{-webkit-transform:rotate(90deg);}50%{-webkit-transform:rotate(180deg);}75%{-webkit-transform:rotate(270deg);}100%{-webkit-transform:rotate(360deg);}}"+
   		"#plugin_kiwi_analysis_vip_music_box_"+this.eleId+" {position:fixed; top:160px; left:0px; width:30px; background-color:"+themeColor+";z-index:9999999899999;}"+
   		"#plugin_kiwi_analysis_vip_music_box_"+this.eleId+" >.plugin_item{cursor:pointer; width:100%; padding:10px 0px; text-align:center;}"+
   		"#plugin_kiwi_analysis_vip_music_box_"+this.eleId+" >.plugin_item >img{width:20px; display:inline-block; vertical-align:middle;animation:turnaround 3s linear infinite;}";
   		$("body").prepend("<style>"+innnerCss+"</style>");
   	};
   	coolhiiVIPMusic.generateHtml=function(){
   		var html="";
   		var vipImgBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAFM0lEQVRoQ+2Ye8jeYxjHP9+i8Afl0JzKOWeSORTFioYhMvuHHFasibaRFH/MxD/awdac5jCznOUUplFbyHnMhMiQOR82ioQ/vrqe7qd+7+/5He7nffe8WnbV09v7PNd139f3Ol+32MRJm7j+bAbwX3vw/+0B2ycCJwE7ps8OwIbC5xPgIUm/D8pTfXvA9qnAJGACsFOGYv8A9wDPSFqWwd8XSzYA28cAVwDnlW74BQjL59ASYI6kD3KYc3iyANi+DrixcOA3wFPAS8BZwIU5lyWeCKfZkmb1IVPL2grA9hPA2YUTrgbulvRrfGd7IvDYMJRZIGnaMOSGiDQCsB2xO7kgMV7S8uIJtrcC/hymIvdL6njP9u3A68ALkn7MPa8WgO1LgEWFg3aW9EPVwbY/BfbLvbTEN07SSttO338BzJc0P+e8SgC2z4iqUThgrKRVdQfang1clXNhBU8ZQJflZeCmssfL8nUAXkz1PfgnSWqMcdsnACs3MoDucXMl1RqnB4Dti4DFJWXmSbqyScFCCPSDY6akG1IOdEOoSn6hpCjhPVQF4E3g6AreSLDLJb1b/s32YcBdNXJV974CTJP0XvfHDAPMkHRLYwjZDsUDQBNNlXRHsloofi9wZB9mv0bSzRVGaPJAl32CpOeLskM8YDuaVTStNooQi8T9MDFGc4ox4aNUjQ4BAlyRIq+mSwqeHsrwQMjcJ+niJgCvAse1aZ9+D+UPBl4DJkr6rhAOY4DwUnTpoAiXBcVzbR8PnAysKJXRpuv/AMZIir8dKnsgrHNgJoBgiwa2u6T1ZRnb+wNhkJhUO2XYdkyupydgeySZujJap8alkiLfKgF8Hwj7APCApPPr+G1HrMfo8VZDgpcBRE5FH6qbdFdKGlcH4G9gyz4AzJJ0fQOA2BdWtJw3BIAk2d4HiLJ9WYXsx5IOqgMQA9p2fQDoSapSnAe4mf0CKORSlfwGSdvXAVgL7N0HgNWSjmjwwPsV1ajM3uOBkhHCAEUv/yUpBsjKHKhrYl3+34DbJF1rO4auPYGY6+8sVqFgtp1j/WBtA3A4sLoAaq2kfesAROmbUmHR52ItlPRkwb3nAo+m/79Nw98jwJlAlMijMj3ZCCAZI5pXrLJBjUl8GhDKBsXa9yCwVFJsYD1kuwgiU98ethwA04F5SXLISFE1CxXzoHaMth2lLDwQdX4klAOgaNi9JH1ZGULJXcX9d5GknpCyfUDaiaNZjZRyAMwA5gLLJY0vXljlgW2BNwodeYgXbG8TB/UxcrQBzAHQzc0LJC1tBJC8MDWqTWKMmSeWms4QZvvplKhtiuX+ngMgmuE7kqKrD6GmnXhO6oYh0AER+wAQ4DYmtZXRLaKYSIr7e6jtVWINcGjBEzF9joQiNOM96XPga2CdpPgbnu3sAzFKFC+IAVBSvD9VUs670LqYOEeidTyVAEskPZyU3S2duTWwXtKaOgBt97YCSBdGuYyaPxyKV7hO7NqOZ8nYbeOZskifAZ3uWvZA24VZANLlEftxeT/7wmJJk23HfLWw0E1r9RoYgAQiSmyAiB0gekETrZI01nZMt8+m8aLNoIPzQPlm28cCpySrRkMrj+FTJC2y/ThwTqvmiWGgHmhSwvYuQACJ58efJP2cvBYTbHguh5ZJirEhm7JzIPvEEmPma0NXqvUVsKzHaADIrWCdkOvXUAMHkMIoxvFda5T7Cri16rErB8yoAEggYkOL7SoW/QD0dnqtiDEh8mRYNGoAhqVdhtBmABlGGijLZg8M1LwZh/8L0s4qT+Ct+wMAAAAASUVORK5CYII=";
   		html+= "<div id='plugin_kiwi_analysis_vip_music_box_"+this.eleId+"'>";
   		html+= "<div class='plugin_item jump_analysis_website' title='VIP音乐破解，免客户端下载！'><img src='"+vipImgBase64+"'></div>";
   		html+= "</div>";
   		$("body").append(html);
   		
   		$("#plugin_kiwi_analysis_vip_music_box_"+this.eleId+"").on("click", function(){
   			var playUrl = coolhiiVIPMusic.getPlayUrl();
   			if(!!playUrl) GM_openInTab(playUrl, false);
   		})
   	};
   	coolhiiVIPMusic.operation=function(){
   		setInterval(function(){
   			var playUrl = coolhiiVIPMusic.getPlayUrl();
   			var $vipMusicBox = $("#plugin_kiwi_analysis_vip_music_box_"+coolhiiVIPMusic.eleId+"");
   			if(!!playUrl){
   				if($vipMusicBox.length==0){
   					coolhiiVIPMusic.generateHtml();
   				}
   			}else{
   				$vipMusicBox.remove();
   			}
   		}, 100);
   	};
   	coolhiiVIPMusic.start=function(){
   		if(this.isRun()){
   			this.addStyle();
   			this.operation();
   		}
   	};
   	coolhiiVIPMusic.start();
	
	//必应背景下载
	const biying={};
	biying.backgroundImageurl = null;
	biying.getBackgroundImage = function(){
		var backgroundImageurl = $("#bgDiv").css("background-image");
		return backgroundImageurl.replace("url(\"","").replace("\")","");
	};
	biying.addHtml = function(backgroundImageurl){
		$("#plugin-script-downloadimage").remove();
		var downloadimage ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEzElEQVR4Xu2bW8hVRRTH/38IijKDMrQIie5ETxVGl4eil+69lJEPmWIU2QWi6OshCAzSoIRCI7sXZGhBSWhFgUQaUfoS+dCFouh+gbAeguAfK9bYtNlnz+zL+Q5yZmBz+PaeWZffXjOzZp3zEVPeOOX+owAoETDlBMoUmFQASDoBwGcAfgawnOTrk7BlYhEgaSuAi93pzSQXTxsARQ5vJ3lBATABApOcAiUCyhT4j0BZA8oiWHaBsg2WPGACacDk6gGSSh5Q8oCSB+wjUBKhkgiVRKgkQiURKonQBAiUitCQ0CVZldequ7tJPtoku20qLOlWAKcAeJPklqHsHjQCJP0K4HA37iWS144ytA0ASZsAXO2ydpE8c1YASLoPwA0AtgG4n+RXibf6JYBjoz4vkLyubkwugIrzJiqZNUo6CIBBOw7AyyTNj9rWGAEVI5eRfDYBwN6SKY7bMySXV8flAKhx3sQsJrk5YceDAO7yPp+QPK01AElnAPgoGriW5B2p0JNUB2EDyRvjsSkAXZ03HZLeA3Cu69tLcm4XAEcB+C4a+ArJq1IA3IA6COtI3hLGNwHo47zr/xhAeOufkjy5NQAXFBctPiS5KAdAA4R9UTQKQF/nXfc3AI5xWxvXjNQa8C2Ao13QjyQX5AJogLCG5EwdgCGcd717AcxxWzeSXNI1AmwNsLUgtHkkbavLbiPWhFUA7o2EbPevycNWFx4lF7yqIZKOBPBTdP8hknd2BbAOwM3R4KUkn8/23juOgBCLMQDnV+S2dt7fvtlrdoe2hOTGrgAuBPB2NHgTyWvaAmiYDqNEdXLe9dgPLS6NBM8laVOitiUzQUkWThZW1v4EsJDkb2OE0Md5s9OStYPdvm0kL2myNQfAEwBWREJWklzfBUBGJHR2fkT435Y6k+QAsHz+xcjhLwCcTdJ+29OpjVgT+jpvb/99AMdHRp1I8vNeEeBkbR2w9SC01STv6eS9D3IId/uftjU2prcpXZIeADAT9ftf4tV5DXAAF/mBKMj5C8A5JHenDJuN55JOB7ATwIGu7w8AZ5Hck9KfnAJBgKQNfjIMt3aQPC+lYNzPJR0A4I1KhP6bbOXobgPgJAA7AMyLBHfeFnOMy+kj6WkAy6K+P/jb/zpnfDYAnwrVJMNuryD5VI6yoftIio+9Qfz1JJ/L1dUKgEOobot2+/LZ/qWnpMcA3FRxdIbkmlznrV9rAA5hFwBbeOJ2O8lH2ijv2nfEoWkLySvbyuwEwCHER+Wg93E75PTJEZockDQfgBVbq4cmkOzkS6dB0c7wGoArKkZbovRwn2yxCkGSpbYrAVhBZWHluVWg4xNrqyDoBcAjwZKZ1TVa7YS3FsBWkn+3sso7S7IKs5XZzfm6ut6TJK1o27n1BuAQljqEuoKJHabetXo+gFdJ/pII8yP8NGcnOrsOqelvW92qIaJsEAAOwULTtkl7W6EaU+ernSh/jy7rc1h01Tkc5FiGZ2f99SSz9vlUaAwGIFoXTo1ApPS3eR4cT6a3bYQODiACYf8RYl+VhauNXaGvHZDeAvAOSfvSZfA2NgCxpZIOBXCZ1xetyGol9/BpXb/3Enz4/MAXT5suY22zAmCsHvQUXgD0BLjfDy8RsN+/wp4OTH0E/APb2Chfnm53kAAAAABJRU5ErkJggg==";
		var html = '<a id="plugin-script-downloadimage" title="点击下载背景" href="'+backgroundImageurl+'" target="_blank">'+
						'<div style="overflow: hidden;width: 40px;height: 40px;line-height:40px;text-align:center;;margin: 0 10px;background-position-x: 0;"><img style="width:100%;" src="'+downloadimage+'" /></div>'+
					'</a>';
		$("#sh_rdiv").append(html);
	};
	biying.start = function(){
		if(window.location.href.indexOf("bing.com")!=-1){
			setInterval(function(){
				var backgroundImageurl = biying.getBackgroundImage();
				if(biying.backgroundImageurl !== backgroundImageurl){
					biying.addHtml(backgroundImageurl);
					biying.backgroundImageurl = backgroundImageurl;
				}
			},100);
		}
	};
	biying.start();
	
	
	/**
	 * 优惠券查询
	 */
	var goodsCoupon={};
	goodsCoupon.getPlatform=function(){
		var couponUrl = window.location.href;
		var platform="";
		if(couponUrl.indexOf("suning.com")!=-1){
			platform = "suning";
		}else if(couponUrl.indexOf("detail.tmall")!=-1){
			platform = "tmall";
		}else if(couponUrl.indexOf("item.taobao.com")!=-1){
			platform = "taobao";
		}else if(couponUrl.indexOf("item.jd.com")!=-1 || couponUrl.indexOf("item.yiyaojd.com")!=-1 || couponUrl.indexOf("npcitem.jd.hk")!=-1){
			platform = "jd";
		}else if(couponUrl.indexOf("detail.vip.com")!=-1){
			platform = "vpinhui";
		}else if(couponUrl.indexOf("mobile.yangkeduo.com")!=-1){
			platform = "pdd";
		}
		return platform;
	}
	goodsCoupon.filterStr = function(str){
		if(!str) return "";
		str = str.replace(/\t/g,"");
		str = str.replace(/\r/g,"");
		str = str.replace(/\n/g,"");
		str = str.replace(/\+/g,"%2B");//"+"
		str = str.replace(/\&/g,"%26");//"&"
		str = str.replace(/\#/g,"%23");//"#"
		return encodeURIComponent(str)
	};
	goodsCoupon.getGoodsData=function(platform){
		var goodsId = "";
		var goodsName = "";
		var websiteUrl = window.location.href;
		if(platform=="taobao"){
			goodsId = this.getQueryString("id");
			goodsName=$(".tb-main-title").text();
			
		}else if(platform=="tmall"){
			goodsId = this.getQueryString("id");
			goodsName=$(".tb-detail-hd").text();
			
		}else if(platform=="jd"){
			goodsName=$("div.sku-name").text();
			goodsId = this.getQueryStringByUrl(websiteUrl);
			
		}else if(platform=="suning"){
			var text = $("#itemDisplayName").text();
			if(!!text){
				text = text.replace("苏宁超市","");
				text = text.replace("自营","");
			}
			goodsName=text;
			goodsId = this.getQueryStringByUrl(websiteUrl);
			
		}else if(platform=="vpinhui"){
			goodsId = this.getQueryStringByUrl(websiteUrl).replace("detail-","");
			goodsName = $(".pib-title-detail").text();
			
		}else if(platform=="pdd"){
			goodsId = this.getQueryString("goods_id");
			goodsName = $(".enable-select").text();
		}
		var data={"goodsId":goodsId, "goodsName":this.filterStr(goodsName)}
		return data;
	};
	goodsCoupon.request = function(mothed, url, param){
		return new Promise(function(resolve, reject){
			GM_xmlhttpRequest({
				url: url,
				method: mothed,
				data:param,
				onload: function(response) {
					var status = response.status;
					var playurl = "";
					if(status==200||status=='200'){
						var responseText = response.responseText;
						resolve({"result":"success", "json":responseText});
					}else{
						reject({"result":"error", "json":null});
					}
				}
			});
		})
	};
	goodsCoupon.createHtml = function(platform, goodsId, goodsName){
		if(!platform || !goodsId) return;
		var goodsCouponUrl = "https://t.mimixiaoke.com/api/plugin/hit/v2?script=3&v=1.0.1&";
		var goodsPrivateUrl = "https://t.mimixiaoke.com/api/private/change/coupon?script=3&platform="+platform+"&id=";
		if(platform==="jd"){
			goodsCouponUrl = "http://t.jtm.pub/api/platform/jd/coupon?itemId="+goodsId+"&q="+goodsName+"&content=&no=3&v=1.0.1";
			goodsPrivateUrl = "http://t.jtm.pub/api/private/change/coupon?no=1&platform="+platform+"&id=";
		}else{			
			if(platform!=="vpinhui"){
				goodsCouponUrl = goodsCouponUrl+"platform="+platform+"&id="+goodsId+"&q="+goodsName;
			}else{
				var vip = goodsId.split("-");
				var vaddition = vip[0];
				var vid = vip[1];
				goodsCouponUrl = goodsCouponUrl+"platform="+platform+"&id="+vid+"&q="+goodsName+"&addition="+vaddition;
			}		
		}
		this.request("GET", goodsCouponUrl, null).then((resutData)=>{
			if(resutData.result==="success" && !!resutData.json){
				var data = JSON.parse(resutData.json).data;
				if(!data || data==="null" || !data.css || !data.html || !data.handler){
					return;
				}
				var cssText = data.css;
				var htmlText = data.html;
				var handler = data.handler;
				var templateId = data.templateId;
				$("body").prepend("<style>"+cssText+"</style>");
				
				var handlers = handler.split("@");
				for(var i=0; i<handlers.length; i++){
					var $handler = $(""+handlers[i]+"");
					if(platform=="taobao"){
						$handler.parent().after(htmlText);
					}else if(platform=="tmall"){
						$handler.parent().after(htmlText);
					}else if(platform=="jd"){
						$handler.after(htmlText);
					}else if(platform=="suning"){
						$handler.parent().after(htmlText);
					}else if(platform=="vpinhui"){
						$handler.parent().after(htmlText);
					}else if(platform=="pdd"){
						$handler.after(htmlText);
					}
				}
				var $llkk = $("#"+templateId);
				if($llkk.length != 0){
					let couponElementA = $llkk.find("a[name='cpShUrl']");
					couponElementA.unbind("click").bind("click", ()=>{
						event.stopPropagation();
						event.preventDefault();
						let couponId = $llkk.data("id");
						if(!!couponId){
							this.request("GET", goodsPrivateUrl+couponId, null).then((resutData2)=>{
								if(resutData2.result==="success" && !!resutData2.json){
									let url = JSON.parse(resutData2.json).url;
									if(!!url) GM_openInTab(url, {active:true});
								}
							});
						}
					});
					setInterval(()=>{
						couponElementA.removeAttr("data-spm-anchor-id");
						$llkk.find("th[name='title']").removeAttr("data-spm-anchor-id");
						$llkk.find("tr.title").removeAttr("data-spm-anchor-id");
					},100);
				}
			}
		});
	};
	goodsCoupon.getQueryString = function(tag) {
		var t = new RegExp("(^|&)" + tag + "=([^&]*)(&|$)");
		var a = window.location.search.substr(1).match(t);
		if (a != null) return a[2];
		return "";
	};
	goodsCoupon.getQueryStringByUrl = function(url) {
		if(url.indexOf("?")!=-1){
			url = url.split("?")[0]
		}
		if(url.indexOf("#")!=-1){
			url = url.split("#")[0]
		}
		var splitText = url.split("/");
		var idText = splitText[splitText.length-1];
		idText = idText.replace(".html","");
		return idText;
	};
	goodsCoupon.start = function(){
		var platform = this.getPlatform();
		if(!platform) return;
		var delayMS = 0;
		if(platform=="vpinhui"){ //唯品会采用了异步加载
			var vipInterval = setInterval(function(){
				if($(".pib-title-detail").length!=0 || delayMS>=1200){
					var goodsData = goodsCoupon.getGoodsData(platform);
					goodsCoupon.createHtml(platform, goodsData.goodsId, goodsData.goodsName);
					clearInterval(vipInterval)
				}
				delayMS+=100;
			},100);
		}else{
			var goodsData = goodsCoupon.getGoodsData(platform);
			goodsCoupon.createHtml(platform, goodsData.goodsId, goodsData.goodsName);
		}
	};
	goodsCoupon.start();
})();

///知乎视频下载, 代码作者：王超, 遵循MIT协议, 此功能版权归原作者所有
///版本：v1.20
///greasyfork地址：https://greasyfork.org/zh-CN/scripts/39206
(async () => {
  if (window.location.host == 'www.zhihu.com') return;
 
  const playlistBaseUrl = 'https://lens.zhihu.com/api/v4/videos/';
  // const videoBaseUrl = 'https://video.zhihu.com/video/';
  const videoId = window.location.pathname.split('/').pop(); // 视频id
  const menuStyle = 'transform:none !important; left:auto !important; right:-0.5em !important;';
  const playerId = 'player';
  const coverSelector = '#' + playerId + ' > div:first-child > div:first-child > div:nth-of-type(2)';
  const controlBarSelector = '#' + playerId + ' > div:first-child > div:first-child > div:last-child > div:last-child > div:first-child';
  const svgDownload = '<path d="M9.5,4 H14.5 V10 H17.8 L12,15.8 L6.2,10 H9.5 Z M6.2,18 H17.8 V20 H6.2 Z"></path>';
  const player = document.getElementById(playerId);
  // const resolutions = {'普清': 'ld', '标清': 'sd', '高清': 'hd', '超清': 'fhd'};
  const resolutions = [
	{ename: 'ld', cname: '普清'},
	{ename: 'sd', cname: '标清'},
	{ename: 'hd', cname: '高清'},
	{ename: 'fhd', cname: '超清'}
  ];
  let videos = []; // 存储各分辨率的视频信息
 
  function fetchRetry (url, options = {}, times = 1, delay = 1000, checkStatus = true) {
	return new Promise((resolve, reject) => {
	  // fetch 成功处理函数
	  function success (res) {
		if (checkStatus && !res.ok) {
		  failure(res);
		}
		else {
		  resolve(res);
		}
	  }
 
	  // 单次失败处理函数
	  function failure (error) {
		if (--times) {
		  setTimeout(fetchUrl, delay);
		}
		else {
		  reject(error);
		}
	  }
 
	  // 总体失败处理函数
	  function finalHandler (error) {
		throw error;
	  }
 
	  function fetchUrl () {
		return fetch(url, options)
		  .then(success)
		  .catch(failure)
		  .catch(finalHandler);
	  }
 
	  fetchUrl();
	});
  }
 
  // 下载指定url的资源
  async function downloadUrl (url, name = (new Date()).valueOf() + '.mp4') {
	// Greasemonkey 需要把 url 转为 blobUrl
	if (GM_info.scriptHandler === 'Greasemonkey') {
	  const res = await fetchRetry(url);
	  const blob = await res.blob();
	  url = URL.createObjectURL(blob);
	}
 
	// Chrome 可以使用 Tampermonkey 的 GM_download 函数绕过 CSP(Content Security Policy) 的限制
	if (window.GM_download) {
	  GM_download({url, name});
	}
	else {
	  // firefox 需要禁用 CSP, about:config -> security.csp.enable => false
	  let a = document.createElement('a');
	  a.href = url;
	  a.download = name;
	  a.style.display = 'none';
	  // a.target = '_blank';
	  document.body.appendChild(a);
	  a.click();
	  document.body.removeChild(a);
 
	  setTimeout(() => URL.revokeObjectURL(url), 100);
	}
  }
 
  // 格式化文件大小
  function humanSize (size) {
	let n = Math.log(size) / Math.log(1024) | 0;
	return (size / Math.pow(1024, n)).toFixed(0) + ' ' + (n ? 'KMGTPEZY'[--n] + 'B' : 'Bytes');
  }
 
  if (!player) return;
 
  // 获取视频信息
  const res = await fetchRetry(playlistBaseUrl + videoId, {
	headers: {
	  'referer': 'refererBaseUrl + videoId',
	  'authorization': 'oauth c3cef7c66a1843f8b3a9e6a1e3160e20' // in zplayer.min.js of zhihu
	}
  }, 3);
  const videoInfo = await res.json();
 
  // 获取不同分辨率视频的信息
  for (const [key, video] of Object.entries(videoInfo.playlist)) {
	video.name = key.toLowerCase();
	var resolution = resolutions.find(v => v.ename === video.name);
	video.cname = resolution ? resolution.cname : "";
	if (!videos.find(v => v.size === video.size)) {
	  videos.push(video);
	}
  }
 
  // 按格式大小排序
  videos = videos.sort(function (v1, v2) {
	const v1Index = resolutions.findIndex(v => v.ename === v1.name);
	const v2Index = resolutions.findIndex(v => v.ename === v2.name);
 
	return v1Index === v2Index ? 0 : (v1Index > v2Index ? 1 : -1);
	// return v1.size === v2.size ? 0 : (v1.size > v2.size ? 1 : -1);
  }).reverse();
 
  document.addEventListener('DOMNodeInserted', (evt) => {
	const domControlBar = evt.relatedNode.querySelector(':scope > div:last-child > div:first-child');
	if (!domControlBar || domControlBar.querySelector('.download')) return;
 
	const domFullScreenBtn = domControlBar.querySelector(':scope > div:nth-last-of-type(1)');
	const domResolutionBtn = Array.from(domControlBar.querySelectorAll(':scope > div')).filter(el => el.innerText.substr(1, 1) === '清')[0];
	let domDownloadBtn, defaultResolution, buttons;
	if (!domFullScreenBtn || !domFullScreenBtn.querySelector('button')) return;
 
	// 克隆分辨率菜单或全屏按钮为下载按钮
	domDownloadBtn = (domResolutionBtn && (domResolutionBtn.className === domFullScreenBtn.className))
	  ? domResolutionBtn.cloneNode(true)
	  : domFullScreenBtn.cloneNode(true);
 
	defaultResolution = domDownloadBtn.querySelector('button').innerText;
 
	// 生成下载按钮图标
	domDownloadBtn.querySelector('button:first-child').outerHTML = domFullScreenBtn.cloneNode(true).querySelector('button').outerHTML;
	domDownloadBtn.querySelector('svg').innerHTML = svgDownload;
	domDownloadBtn.className = domDownloadBtn.className + ' download';
 
	buttons = domDownloadBtn.querySelectorAll('button');
 
	// button 元素添加对应的下载地址属性
	buttons.forEach(dom => {
	  const video = videos.find(v => v.cname === dom.innerText) || videos[videos.length - 1];
 
	  dom.dataset.video = video.play_url;
	  if (dom.innerText) {
		(dom.innerText = `${dom.innerText} (${humanSize(video.size)})`);
	  }
	  else if (buttons.length == 1) {
		dom.nextSibling.querySelector('div').innerText = humanSize(video.size);
	  }
	});
 
	// 鼠标事件 - 显示菜单
	domDownloadBtn.addEventListener('pointerenter', () => {
	  const domMenu = domDownloadBtn.querySelector('div:nth-of-type(1)');
	  if (domMenu) {
		domMenu.style.cssText = menuStyle + 'opacity:1 !important; visibility:visible !important';
	  }
	});
 
	// 鼠标事件 - 隐藏菜单
	domDownloadBtn.addEventListener('pointerleave', () => {
	  const domMenu = domDownloadBtn.querySelector('div:nth-of-type(1)');
	  if (domMenu) {
		domMenu.style.cssText = menuStyle;
	  }
	});
 
	// 鼠标事件 - 选择菜单项
	domDownloadBtn.addEventListener('pointerup', event => {
	  let e = event.srcElement || event.target;
 
	  while (e.tagName !== 'BUTTON') {
		e = e.parentNode;
	  }
 
	  downloadUrl(e.dataset.video);
	});
 
	// 显示下载按钮
	domControlBar.appendChild(domDownloadBtn);
  });
})();
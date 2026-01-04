// ==UserScript==
// @name         瓶瓶蛋蛋才是真
// @namespace    http://tampermonkey.net/
// @version            1.0.5
// @description       简单、纯粹、拥抱生活
// @author            zh
// @match           *://v.qq.com/x/page/*
// @match           *://v.qq.com/x/cover/*
// @match           *://v.qq.com/tv/*
// @match           *://*.iqiyi.com/v_*
// @match           *://*.iqiyi.com/a_*
// @match           *://*.iqiyi.com/w_*
// @match           *://*.iq.com/play/*
// @match           *://*.youku.com/v_*
// @match           *://*.mgtv.com/b/*
// @match           *://*.tudou.com/listplay/*
// @match           *://*.tudou.com/programs/view/*
// @match           *://*.tudou.com/albumplay/*
// @match           *://film.sohu.com/album/*
// @match           *://tv.sohu.com/v/*
// @match           *://*.bilibili.com/video/*
// @match           *://*.bilibili.com/bangumi/play/*
// @match           *://v.pptv.com/show/*
// @match           *://vip.pptv.com/show/*
// @match           *://www.wasu.cn/Play/show/*
// @match           *://*.le.com/ptv/vplay/*
// @match           *://*.acfun.cn/v/*
// @match           *://*.acfun.cn/bangumi/*
// @match           *://*.1905.com/play/*
// @match           *://m.v.qq.com/x/page/*
// @match           *://m.v.qq.com/x/cover/*
// @match           *://m.v.qq.com/*
// @match           *://m.iqiyi.com/*
// @match           *://m.iqiyi.com/kszt/*
// @match           *://m.youku.com/video/*
// @match           *://m.mgtv.com/b/*
// @match           *://m.tv.sohu.com/v/*
// @match           *://m.film.sohu.com/album/*
// @match           *://m.pptv.com/show/*
// @match           *://m.bilibili.com/anime/*
// @match           *://m.bilibili.com/video/*
// @match           *://m.bilibili.com/bangumi/play/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.10.0/jquery.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459114/%E7%93%B6%E7%93%B6%E8%9B%8B%E8%9B%8B%E6%89%8D%E6%98%AF%E7%9C%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/459114/%E7%93%B6%E7%93%B6%E8%9B%8B%E8%9B%8B%E6%89%8D%E6%98%AF%E7%9C%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
	var souces = `//
	// keyu http://newjiexi.gotka.top/keyu3.php?url=
	// GGTV1 https://play.fuqizhishi.com/juhe/API.php?appkey=caijijuhe220902&url="
	// GGTV2 https://play.fuqizhishi.com/jx/API.php?appkey=xiaobai888&url="
	// aiku https://jx.zhanlangbu.com/API.php?appkey=53df3aa2fdb66bcbc4d05730b6fbfc71&url="
	// CK解析 http://api.ckflv.cn/?url=
	// 懒人 http://120.53.102.254/jx1/jx75.php?url=
	// 视界 http://150.230.216.174/tvjx.php?url=
	// 油果 http://json.youguo520.top/fufeng/?url=
	// 搬运 https://jx.bynote.top/API.php?url=
	// 爱豆 http://id190.tpddns.cn:81/jsonch/?url=
	365 https://chaxun.truechat365.com/?url=
	parwix稳定 https://jx.bozrc.com:4433/player/?url=
	// parwix1 https://jx.parwix.com:4433/player/?url=
	// parwix2 https://jx.parwix.com:4433/player/analysis.php?v=
	8old https://www.m3u8.tv.cdn.8old.cn/jx.php?url=
	OK解析 https://okjx.cc/?url=
	m3u8 https://jx.m3u8.tv/jiexi/?url=
	醉仙 https://jx.zui.cm/?url=
	// 1907 https://z1.m1907.cn/?jx=
	// 思古 https://jsap.attakids.com/?url=
	爱豆 https://jx.aidouer.net/?url=
	虾米 https://jx.xmflv.com/?url=
	夜幕 https://www.yemu.xyz/?url=
	人人迷 https://jx.blbo.cc:4433/?url=
	冰豆 https://api.qianqi.net/vip/?url=
	CK https://www.ckplayer.vip/jiexi/?url=
	playerjy/B站 https://jx.playerjy.com/?url=
	ccyjjd https://ckmov.ccyjjd.com/ckmov/?url=
	诺诺 https://www.ckmov.com/?url=
	// BL https://vip.bljiex.com/?v=
	解析la https://api.jiexi.la/?url=
	MAO https://www.mtosz.com/m3u8.php?url=
	老板 https://vip.laobandq.com/jiexi.php?url=
	盘古 http://www.pangujiexi.cc/jiexi.php?url=
	// 盖世 https://www.gai4.com/?url=
	0523 https://go.yh0523.cn/y.cy?url=
	17云 https://www.1717yun.com/jx/ty.php?url=
	4K https://jx.4kdv.com/?url=
	8090 https://www.8090g.cn/?url=
	// 江湖 https://api.jhdyw.vip/?url=
	诺讯 https://www.nxflv.com/?url=
	PM https://www.playm3u8.cn/jiexi.php?url=`;

	var arr=souces.split("\n");
	var items = '';
	for (let i = 0; i < arr.length; i++) {
		let sz = arr[i].replace('\t','').split(' ');
		let name = sz[0];
		if(name.indexOf("//")>-1){
			continue
		}
		let url = sz[1];
		items += `<div class="pd_video" data-url="${url}">${name}</div>`;
	}
	var str = '<div id="pd_videos" class="pd_videos">'+items+'</div>';
	$("body").append(str);
	var style_1 = `.pd_videos {
		position: fixed;
		bottom: 0;
		left: 0;
		height: 12rem;
		width: 100%;
		overflow-y: auto;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		flex-direction: row;
		flex-wrap: wrap;
		z-index: 9999;
		background-color: rgb(0 0 0 / 30%);
		box-sizing: border-box;
	}`;
	var style_2 = `.pd_video {
		width: 4rem;
		height: 4rem;
		padding: 0.5rem;
		border: 3px solid #e3e2e2;
		background-color: #fff;
		border-radius: 1rem;
		margin: 1rem;
		font-size: 14px;
		text-align: center;
		overflow: hidden;
		word-break: break-all;
		color: #343434;
		box-sizing: border-box;
	}`;
	var style_3 = `.pd_video:hover {
		background-color: #03a9f4;
		color: #fff;
		border-color: #0084ed;
		cursor: pointer;
	}`;
	var style_4 = `.pd_video_atcive {
		border-color: red;
	}`;
	var styles = '<style>html{font-size:16px !important;}'+style_1+style_2+style_3+style_4+'</style>';
	$("head").append(styles);
	$("#pd_videos>.pd_video").click(function(){
		let url = $(this).attr("data-url");
		$(this).addClass('pd_video_atcive');
		window.open(url+location.href);
	});

})();
// ==UserScript==
// @name         全网VIP视频免费破解去广告。
// @namespace 	 franztutu
// @version      2.0.3
// @description  集合了优酷、爱奇艺、腾讯、芒果等VIP视频免费破解去广告。
// @author       franztutu
// @icon         data:image/png;base64,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
// @include      *.youku.com/v_show/*
// @include      *.iqiyi.com/v_*
// @include      *v.qq.com/x/cover*
// @include      *.mgtv.com/movie/*
// @include      *.mgtv.com/tv/*
// @include      *.bilibili.com/bangumi/play/*
// @exclude      *://*.eggvod.cn/*
// @connect      localhost
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @license      AGPL License
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
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @grant        GM_cookie
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/434373/%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%A0%B4%E8%A7%A3%E5%8E%BB%E5%B9%BF%E5%91%8A%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/434373/%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%A0%B4%E8%A7%A3%E5%8E%BB%E5%B9%BF%E5%91%8A%E3%80%82.meta.js
// ==/UserScript==

(function() {

  var id_random = Math.ceil(Math.random()*100000000);
	var play_url = window.location.href;
	var arr = new Array();
	arr = play_url.split('?')
	var get_url = arr[0];

	if(get_url.indexOf('eggvod.cn') == -1){
		var jx_title=new Array()
		jx_title[0]="youku.com"
		jx_title[1]="iqiyi.com"
		jx_title[2]="le.com"
		jx_title[3]="v.qq.com"
		jx_title[4]="tudou.com"
		jx_title[5]="mgtv.com"
		jx_title[6]="sohu.com"
		jx_title[7]="acfun.cn"
		jx_title[8]="bilibili.com"
		jx_title[9]="pptv.com"
		jx_title[10]="baofeng.com"
		jx_title[11]="yinyuetai.com"
		jx_title[12]="wasu.cn"
		jx_title[13]="iq.com"
		jx_title[14]="m.v.qq.com"
		jx_title[15]="m.iqiyi.com"
		var title_result = false;
		for(var n=0;n<jx_title.length;n++){
			if(get_url.indexOf(jx_title[n])!= -1){
                var play_line_json =  [
                    {"name":"B站1","url":"https://vip.parwix.com:4433/player/?url=","t":"m"},
                    {"name":"爱豆","url":"https://jx.aidouer.net/?url="},
                    {"name":"BL","url":"https://vip.bljiex.com/?v="},
                    {"name":"CK","url":"https://www.ckplayer.vip/jiexi/?url="},
                    {"name":"CHok","url":"https://www.gai4.com/?url="},
                    {"name":"ckmov","url":"https://www.ckmov.vip/api.php?url="},
                    {"name":"大幕","url":"https://jx.52damu.com/dmjx/jiexi.php?url="},
                    {"name":"大树","url":"https://jx.wlssys.xyz/vip.php?url="},
                    {"name":"H8","url":"https://www.h8jx.com/jiexi.php?url="},
                    {"name":"解析","url":"https://ckmov.ccyjjd.com/ckmov/?url="},
                    {"name":"解析la","url":"https://api.jiexi.la/?url="},
                    {"name":"久播","url":"https://jx.jiubojx.com/vip.php?url="},
                    {"name":"老板","url":"https://vip.laobandq.com/jiexi.php?url="},
                    {"name":"明日","url":"https://jx.yingxiangbao.cn/vip.php?url="},
                    {"name":"诺诺","url":"https://www.ckmov.com/?url="},
                    {"name":"诺讯","url":"https://www.nxflv.com/?url="},
                    {"name":"盘古","url":"https://www.pangujiexi.cc/jiexi.php?url="},
                    {"name":"奇米","url":"https://qimihe.com/?url="},
                    {"name":"七哥","url":"https://jx.mmkv.cn/tv.php?url="},
                    {"name":"全民","url":"https://jx.quanmingjiexi.com/?url="},
                    {"name":"思古3","url":"https://jsap.attakids.com/?url="},
                    {"name":"维多","url":"https://jx.ivito.cn/?url="},
                    {"name":"虾米","url":"https://jx.xmflv.com/?url="},
                    {"name":"云端","url":"https://jx.ergan.top/?url="},
                    {"name":"17云","url":"https://www.1717yun.com/jx/ty.php?url="},
                    {"name":"8090","url":"https://www.8090g.cn/?url="}
                ];

                var play_wrap_html = "<div href='javascript:void(0)' target='_blank' style='z-index:999999;position: fixed;left: 5px;top: 160px;color: #fff;background-color: #e40e0e;width: 50px;text-align: center;cursor: pointer;padding: 6px 0px;border-width: 1px;border-style: solid;border-color: #e40e0e;border-image: initial;border-radius: 2px;font-size: 12px;' class='playButton'>VIP视频</div>";

                setTimeout(function(){
                    $("body").append(play_wrap_html);
                    $(".playButton").on("click", () => {
                      let index = Math.floor((Math.random()*play_line_json.length));
                      window.open(play_line_json[index]["url"] + get_url);
                    });

                }, 3000);



            }
        }

	}

})();

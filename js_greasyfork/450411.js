// ==UserScript==
// @name              叮当猫影视
// @namespace         https://raw.githubusercontent.com/xiao-langlang/xiaolanglang_film/langlang/xiaolanglang.js
// @version           1.2.3
// @description       腾讯视频、爱奇艺、优酷、芒果蓝光无广告在线观看；含搜索功能，可搜索观看美剧、日韩剧、下架、付费剧等
// @author            小浪浪
// @icon              https://greasyfork.s3.us-east-2.amazonaws.com/q71ldqvvd37exhd30wfopzjlalwc
// @include           *
// @require           https://code.jquery.com/jquery-3.6.1.min.js
// @grant             unsafeWindow
// @grant             GM_openInTab
// @grant             GM_getValue
// @grant             GM_setValue
// @license           AGPL License
// @charset		      UTF-8
// @original-script   https://greasyfork.org/zh-CN/scripts/450411
// @downloadURL https://update.greasyfork.org/scripts/450411/%E5%8F%AE%E5%BD%93%E7%8C%AB%E5%BD%B1%E8%A7%86.user.js
// @updateURL https://update.greasyfork.org/scripts/450411/%E5%8F%AE%E5%BD%93%E7%8C%AB%E5%BD%B1%E8%A7%86.meta.js
// ==/UserScript==

(function () {
	'use strict';

	function commonFunction(){
		this.GMgetValue = function (name, value=null) {
			let storageValue = value;
			if (typeof GM_getValue === "function") {
				storageValue = GM_getValue(name, value);
			} else if(typeof GM.setValue === "function"){
				storageValue = GM.getValue(name, value);
			}else{
				var arr = window.localStorage.getItem(name);
				if(arr != null){
					storageValue = arr
				}
			}
			return storageValue;
		};
		this.GMsetValue = function(name, value){
			if (typeof GM_setValue === "function") {
				GM_setValue(name, value);
			} else if(typeof GM.setValue === "function"){
				GM.setValue(name, value);
			}else{
				window.localStorage.setItem(name, value)
			}
		};
		this.GMaddStyle = function(css){
			var myStyle = document.createElement('style');
			myStyle.textContent = css;
			var doc = document.head || document.documentElement;
			doc.appendChild(myStyle);
		};
		this.GMopenInTab = function(url, open_in_background){
			if (typeof GM_openInTab === "function") {
				GM_openInTab(url, open_in_background);
			} else {
				GM.openInTab(url, open_in_background);
			}
		};

	}

	//解析接口配置
	const originalInterfaceList = [
        {"name":"(支持弹幕)","url":"https://jx.jsonplayer.com/player/?url="},
        {"name":"(弹幕播放)","url":"https://player.we-vip.com:2083/?url="},
        {"name":"虾米解析","url":"https://jx.xmflv.com/?url="},
        {"name":"咸鱼云","url":"https://jx.aidouer.net/?url="},
        {"name":"M1907","url":"https://im1907.top/?jx="},
        {"name":"JY","url":"https://jx.playerjy.com/?url="},
        {"name":"yparse","url":"https://jx.yparse.com/index.php?url="},
        {"name":"8090g","url":"https://www.8090g.cn/?url="},
        //{"name":"综合线路","url":"https://video.isyour.love/player/getplayer?url="},
	];
    const searchList = [
        {"name":"Bttwo(推荐)","url":"https://www.bttwo.net/xssearch?q=search_flag"},
        {"name":"MXONE(推荐)","url":"https://kuin.one/index.php/vod/search/wd/search_flag.html"},
        {"name":"heitai(动漫)","url":"https://www.heitaifun.com/vodsearch/search_flag-------------.html"},
        {"name":"AnFuns(动漫)","url":"https://www.anfuns.cc/search.html?wd=search_flag%AB&submit="},
        {"name":"WRNM","url":"https://www.wrnm.cc/index.php/vod/search/wd/search_flag.html"},
        {"name":"gaze","url":"https://gaze.run/filter?search=search_flag"},
        {"name":"拖布影视","url":"https://www.rainvi.com/index.php/vod/search.html?wd=search_flag"},
        {"name":"电影蜜蜂网","url":"https://www.sysyjc.com/index.php/vod/search/wd/search_flag.html"},
        {"name":"大米星球","url":"https://www.dmxq.cc/vodsearch/search_flag-------------.html"},
        {"name":"LIBVIO","url":"https://www.libvio.me/search/-------------.html?wd=search_flag&submit="},
        {"name":"稀饭","url":"https://www.xifanys.com/yingpiansearch/-------------.html?wd=search_flag"},
        {"name":"百度云","url":"https://www.bdzy.com/index.php/vod/search.html?wd=search_flag&submit="},
        {"name":"茶杯狐","url":"https://www.cupfox.app/s/search_flag"},
        {"name":"电影盒子","url":"http://m.tv7box.com/ajax-search.html"},
        {"name":"大师兄","url":"https://dsxys.pro/sb/kemksmaksdl7nhZe3c1-.html?wd=search_flag"},
        {"name":"意见反馈","url":"https://greasyfork.org/zh-CN/scripts/450411-%E5%B0%8F%E6%B5%AA%E6%B5%AA%E5%BD%B1%E8%A7%86/feedback"},
	];

	const commonFunctionObject = new commonFunction();

	function superVideoHelper(){
		this.elementId = Math.ceil(Math.random()*100000000)+"mmx";
        const urls = ["iqiyi.com/v_","iqiyi.com/w_","iqiyi.com/a_",
                          "v.qq.com/x/cover/","v.qq.com/x/page/","v.qq.com/tv/",
                          "youku.com/v_","youku.com/alipay_video/","youku.com/video/id_",
                          "le.com/ptv/vplay/",
                          "mgtv.com/b/",
                          "sohu.com/album/","sohu.com/v/",
                          "acfun.cn/v/",
                          "bilibili.com/bangumi/play/",
                          "baofeng.com/play/",
                          "pptv.com/show/",
                          "1905.com/video/","1905.com/play/",
                          "miguvideo.com/mgs/",
                          "tudou.com/listplay/","tudou.com/albumplay/","tudou.com/programs/view/",
                          "wasu.cn/Play/show/"];
		this.isRun = function(){
			var result = false;
            if(commonFunctionObject.GMgetValue("show_webpage",null)==="true")
                {result = true;}
			else{
				for(var i=0; i<urls.length;i++){
						if(window.location.href.indexOf(urls[i])!=-1){
							result = true;
							break;
						}
				}
			}
            for(var j=0; j<originalInterfaceList.length; j++){
                if(window.location.href.indexOf(originalInterfaceList[j].url)!=-1||window.location.href.indexOf("https://www.feiyyd.com/?url=")!=-1){
                result=false;
                break;
                }
            }
            if(top.location.href!=self.location.href)result=false;
			return result;
		};
		this.showPlayerWindow = function(playObject){
			var url = playObject.url + window.location.href;
			commonFunctionObject.GMopenInTab(url, false);
		};
        this.searchshowPlayerWindow = function(searchplayObject){
			var url = searchplayObject.url;
			commonFunctionObject.GMopenInTab(url, false);
		};
		this.addHtmlElements = function(){
            const currentHost = window.location.host;

			var category_1_html = "",search_html = "";
			originalInterfaceList.forEach((item, index) => {
					category_1_html += "<span title='"+item.name+"' data-index='"+index+"' class='"+"'>" + item.name + "</span>";
			});
            searchList.forEach((item, index) => {
                    search_html += "<span title=-'"+item.name+"' data-index='"+index+"' class='"+"'>" + item.name + "</span>";
			});

			var left = 0;
			var top = 120;
			var Position = commonFunctionObject.GMgetValue("Position_" + currentHost);
			if(!!Position){
				left = Position.left;
				top = Position.top;
			}
			var color = "#FF8000";
			var hoverColor = "#ffffff";
			if(currentHost.indexOf("bilibili.com")!=-1){
				color = "#fb7299";
				hoverColor = "#00B0E1";
			}
			var cssMould = `#vip_movie_box`+this.elementId+`{cursor:pointer; position:fixed; top:` + top + `px; left:` + left + `px; width:0px; z-index:99999999; font-size:16px; text-align:left;}
							#vip_movie_box`+this.elementId+` .img_box`+this.elementId+`{width:24px; height:32px;line-height:32px;text-align:center;background-color:;}
							#vip_movie_box`+this.elementId+` .img_box`+this.elementId+`:hover{
								background: linear-gradient(30deg, #2a66ff 40%);
							}
							#vip_movie_box`+this.elementId+` .img_box`+this.elementId+`>img {width:50px; display:inline-block; vertical-align:middle;}
							#vip_movie_box`+this.elementId+` .showhide_box`+this.elementId+`{display:none;padding-left:5px;position: absolute;left: 45px;top: 0;}
							#vip_movie_box`+this.elementId+` .vip_mod_box_action_687ii{width:380px; max-height:400px; overflow-y:auto;background-color:rgba(241,241,241);}
							#vip_movie_box`+this.elementId+` .default-scrollbar-55678::-webkit-scrollbar{width:5px; height:1px;}
							#vip_movie_box`+this.elementId+` .default-scrollbar-55678::-webkit-scrollbar-thumb{box-shadow:inset 0 0 5px rgba(0, 0, 0, 0.2); background:#A8A8A8;}
							#vip_movie_box`+this.elementId+` .default-scrollbar-55678::-webkit-scrollbar-track{box-shadow:inset 0 0 5px rgba(0, 0, 0, 0.2); background:#F1F1F1;}
                            #vip_movie_box`+this.elementId+` .vip_mod_box_action_687ii> .p_line`+this.elementId+` >.input_line`+this.elementId+`{border:1px solid red;border-radius:8px;}
                            #vip_movie_box`+this.elementId+` .vip_mod_box_action_687ii> .p_line`+this.elementId+` >.btn_submit`+this.elementId+`{border:1px solid red;border-radius:8px;}
                            #vip_movie_box`+this.elementId+` .vip_mod_box_action_687ii> .p_line1`+this.elementId+` >.btn_submit1`+this.elementId+`{border:1px solid #FFCBA4;border-radius:8px;}
                            #vip_movie_box`+this.elementId+` .vip_mod_box_action_687ii> .explain_box`+this.elementId+` >.content`+this.elementId+` >.real_url`+this.elementId+`{border:1px solid #191970;border-radius:4px;}
                            #vip_movie_box`+this.elementId+` .vip_mod_box_action_687ii> .explain_box`+this.elementId+` >.content`+this.elementId+` >.show_web`+this.elementId+`{border:1px solid #191970;border-radius:4px;}
							#vip_movie_box`+this.elementId+` .vip_mod_box_action_687ii> .item_box`+this.elementId+`{margin-bottom:10px;}
							#vip_movie_box`+this.elementId+` .vip_mod_box_action_687ii> .item_box`+this.elementId+`:last-child{margin-bottom:0px;}
							#vip_movie_box`+this.elementId+` .vip_mod_box_action_687ii> .item_box`+this.elementId+` >.interface_box`+this.elementId+`{}
							#vip_movie_box`+this.elementId+` .vip_mod_box_action_687ii> .item_box`+this.elementId+` >.interface_box`+this.elementId+`>span{border-radius:3px;border-top:3px solid `+color+`; border-bottom:3px solid `+color+`;display:inline-block;width:calc(25% - 6px);width:-moz-calc(25% - 6px);width: -webkit-calc(25% - 6px);height:20px;line-height:20px;background-color:`+color+`;color:#FFF;cursor:pointer;margin:3px;text-align:center;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;-o-text-overflow:ellipsis;font-size:12px!important;}
							#vip_movie_box`+this.elementId+` .vip_mod_box_action_687ii> .item_box`+this.elementId+` >.interface_box`+this.elementId+`>span:hover{border-top:3px solid `+hoverColor+`; border-bottom:3px solid `+hoverColor+`;}
							#vip_movie_box`+this.elementId+` .vip_mod_box_action_687ii> .item_box`+this.elementId+` >.interface_box`+this.elementId+`>span.selected{border-top:3px solid `+hoverColor+`; border-bottom:3px solid `+hoverColor+`;}
                            #vip_movie_box`+this.elementId+` .vip_mod_box_action_687ii> .item_box`+this.elementId+` >.search_interface_box`+this.elementId+`{}
							#vip_movie_box`+this.elementId+` .vip_mod_box_action_687ii> .item_box`+this.elementId+` >.search_interface_box`+this.elementId+`>span{border-radius:3px;border-top:3px solid `+color+`; border-bottom:3px solid `+color+`;display:inline-block;width:calc(25% - 6px);width:-moz-calc(25% - 6px);width: -webkit-calc(25% - 6px);height:20px;line-height:20px;background-color:`+color+`;color:#FFF;cursor:pointer;margin:3px;text-align:center;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;-o-text-overflow:ellipsis;font-size:12px!important;}
							#vip_movie_box`+this.elementId+` .vip_mod_box_action_687ii> .item_box`+this.elementId+` >.search_interface_box`+this.elementId+`>span:hover{border-top:3px solid `+hoverColor+`; border-bottom:3px solid `+hoverColor+`;}
							#vip_movie_box`+this.elementId+` .vip_mod_box_action_687ii> .item_box`+this.elementId+` >.search_interface_box`+this.elementId+`>span.selected{border-top:3px solid `+hoverColor+`; border-bottom:3px solid `+hoverColor+`;}
							`
			commonFunctionObject.GMaddStyle(cssMould);

			var htmlMould = `<div id='vip_movie_box`+this.elementId+`'>
								<div class='plugin_inner_`+this.elementId+`'>
									<div class="img_box`+this.elementId+`" id="img_box_jump_6667897iio"><img src="https://greasyfork.s3.us-east-2.amazonaws.com/q71ldqvvd37exhd30wfopzjlalwc" title='选择解析线路'/></div>
									<div class='showhide_box`+this.elementId+`'>
										<div class='vip_mod_box_action_687ii default-scrollbar-55678'>
											<div class='item_box`+this.elementId+`'>
												<div class='interface_box`+this.elementId+`'>
													` + category_1_html + `
												</div>
											</div>
                                            <p class='p_line`+this.elementId+`' style="text-indent:0.2em;">
                                                <b style="color:red;">搜索：</b>
                                                <input class='input_line`+this.elementId+`' style="color:red;" type='text' name='name' value='' autocomplete="off"/>
                                                <button type="submit" class="btn_submit`+this.elementId+`" style="color:red;">展开</button>
                                            </p>
                                            <div class='item_box`+this.elementId+`'>
												<div class='search_interface_box`+this.elementId+`'>
													` + search_html + `
												</div>
											</div>
                                            <p class='p_line1`+this.elementId+`' style="text-indent:0.2em;">
                                                <b style="color:#FFCBA4;">使用说明：</b>
                                                <button type="submit" class="btn_submit1`+this.elementId+`" style="color:#FFCBA4;">展开</button>
                                            </p>
											<div class='explain_box`+this.elementId+`'>
												<b style="color:#1E90FF;">来源：湖北文理学院</b>
												<div class='content`+this.elementId+`'>
													1.解析功能：在腾讯、爱奇艺、优酷等平台打开相应的影视，点击最上方的影视接口即可，解析不出切换下一个接口<br>
                                                    2.搜索功能：在输入框输入内容，展开点击相应影视源（此功能可以观看美剧、日韩剧、下架剧等）<br>
                                                    3.获取视频真实链接：<button type="submit" class="real_url`+this.elementId+`" style="color:#191970;">点击获取</button><br>
                                                    (!!!)在线播放真实链接视频，需在浏览器的附加组件上安装：Native HLS<br>
                                                    4.其他功能：(1)右击拖动哆啦A梦可移动位置<br>
                                                    （2）图标显示页面：<button type="submit" class="show_web`+this.elementId+`" style="color:#191970;">影视网页显示</button><br><br>
                                                    有问题请在此脚本页面进行反馈
                                                    https://greasyfork.org/zh-CN/scripts/450411
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							`;
			$("body").append(htmlMould);
		}

        function DisplayPosition(playObject){
            var domHead = document.getElementsByTagName('head')[0];
            var domStyle = document.createElement('style');
            domStyle.type = 'text/css';
            domStyle.rel = 'stylesheet';
            let playVideoStyle = `
               .zhm_play_vidoe_icon{padding-top:2px;cursor:pointer;z-index:9999999;text-align:center;overflow:visible;display:flex;width:auto;}
               .zhm_play_video_wrap{z-index:9999999;overflow: hidden;width:300px;}
               .zhm_play_video_line{width:320px;height:316px;overflow-y:scroll;overflow-x:hidden;}
               .zhm_play_vide_line_ul{width:300px;display: flex;justify-content: flex-start;flex-flow: row wrap;list-style: none;padding:0px;margin:0px;}
               .zhm_play_video_line_ul_li{padding:4px 0px;margin:2px;width:30%;color:#FFF;text-align:center;background-color:#f24443;box-shadow:0px 0px 10px #fff;font-size:14px;}
               .zhm_play_video_line_ul_li:hover{color:#260033;background-color:#fcc0c0}
               .zhm_line_selected{color:#260033;background-color:#fcc0c0}
               .zhm_play_video_jx{ width:100%;height:100%;z-index:999999;position: absolute;top:0px;padding:0px;}
               `;
                domStyle .appendChild(document.createTextNode(playVideoStyle));
                domHead.appendChild(domStyle);
            let playJxHtml = "<div class='zhm_play_video_jx'>";
            playJxHtml += "<iframe allowtransparency=true frameborder='0' scrolling='no' allowfullscreen=true allowtransparency=true name='jx_play' style='height:100%;width:100%' id='playIframe'></iframe></div>";
            let jxVideoData = [
                {funcName:"playVideo", node:".player__container" ,match:/https:\/\/v.qq.com\/x\/cover\/[a-zA-Z0-9]+.html/,areaClassName:'mod_episode',name:'qqPC'},
                {funcName:"playVideo", node:"#player-container" ,match:/https:\/\/v.qq.com\/x\/cover\/[a-zA-Z0-9]+\/[a-zA-Z0-9]+.html/,areaClassName:'mod_episode',name:'qqPC'},
                {funcName:"playVideo", node:".container-player" ,match:/v\.qq\.com\/x\/page/,areaClassName:'mod_episode'},
                {funcName:"playVideo", node:"#player",match:/m\.v\.qq\.com\/x\/m\/play\?cid/},
                {funcName:"playVideo", node:"#player",match:/m\.v\.qq\.com\/x\/play\.html\?cid=/},
                {funcName:"playVideo", node:"#player",match:/m\.v\.qq\.com\/play\.html\?cid\=/},
                {funcName:"playVideo", node:"#player",match:/m\.v\.qq\.com\/cover\/.*html/},
                {funcName:"playVideo", node:"#flashbox",match:/^https:\/\/www\.iqiyi\.com\/[vwa]\_/,areaClassName:'qy-episode-num',name:'iqiyiPc'},
                {funcName:"playVideo", node:".m-video-player-wrap",match:/^https:\/\/m.iqiyi\.com\/[vwa]\_/,areaClassName:'m-sliding-list'},
                {funcName:"playVideo", node:".intl-video-wrap",match:/^https:\/\/www\.iq\.com\/play\//,areaClassName:'m-sliding-list'},
                {funcName:"playVideo", node:"#player",match:/m\.youku\.com\/alipay_video\/id_/},
                {funcName:"playVideo", node:"#player",match:/m\.youku\.com\/video\/id_/},
                {funcName:"playVideo", node:"#player",match:/v\.youku\.com\/v_show\/id_/},
                {funcName:"playVideo", node:"#player",match:/v\.youku\.com\/v_play\/id_/},
                {funcName:"playVideo", node:"#bilibili-player",nodeType:'id',match:/www\.bilibili\.com\/video/,name:'biliPc',areaClassName:'video-episode-card'},
                {funcName:"playVideo", node:"#player_module",nodeType:'id',match:/www\.bilibili\.com\/bangumi/,areaClassName:'ep-list-wrapper report-wrap-module'},
                {funcName:"playVideo", node:".player-container",nodeType:'class',match:/m\.bilibili\.com\/bangumi/,areaClassName:'ep-list-pre-container no-wrap'},
                {funcName:"playVideo", node:".mplayer",nodeType:'class',match:/m\.bilibili\.com\/video\//},
                {funcName:"playVideo", node:".video-area",nodeType:'class',match:/m\.mgtv\.com\/b/},
                {funcName:"playVideo", node:"#mgtv-player-wrap",nodeType:'id',match:/mgtv\.com\/b|l/,areaClassName:'episode-items clearfix'},
                {funcName:"playVideo", node:".x-player",nodeType:'class',match:/tv\.sohu\.com\/v/},
                {funcName:"playVideo", node:".x-cover-playbtn-wrap",nodeType:'class',match:/m\.tv\.sohu\.com/},
                {funcName:"playVideo", node:"#playerWrap",nodeType:'id',match:/film\.sohu\.com\/album\//},
                {funcName:"playVideo", node:"#le_playbox",nodeType:'id',match:/le\.com\/ptv\/vplay\//,areaClassName:'juji_grid'},
                {funcName:"playVideo", node:"#player",nodeType:'id',match:/play\.tudou\.com\/v_show\/id_/},
                {funcName:"playVideo", node:"#pptv_playpage_box",nodeType:'id',match:/v\.pptv\.com\/show\//},
                {funcName:"playVideo", node:"#player",nodeType:'id',match:/vip\.1905.com\/play\//},
                {funcName:"playVideo", node:"#vodPlayer",nodeType:'id',match:/www\.1905.com\/vod\/play\//},
            ];
            let jxVideoWeb = jxVideoData.filter(function(item){
                return location.href.match(item.match);
            })
            var {funcName,match:nowMatch,node:nowNode,name:nowName} = jxVideoWeb[0];
            let nowWebNode = document.querySelector(nowNode);
            nowWebNode.innerHTML = playJxHtml;
            let playIframe = document.querySelector('#playIframe');
            playIframe.src= playObject+location.href;
        }

		this.runEvent = function(){	 //事件运行
			var that = this,searchword,box_switch=-1,box_switch1=-1;
            if(!!box_switch){$(".search_interface_box"+this.elementId).hide();box_switch=1;}
            if(!!box_switch1){$(".explain_box"+this.elementId).hide();box_switch1=1;}
            if(commonFunctionObject.GMgetValue("show_webpage",null)==="true"){
                $(".show_web"+this.elementId).text("全局网页显示");
                $(".interface_box"+this.elementId).hide();
                $(".real_url"+this.elementId).hide();
                for(var i=0; i<urls.length;i++){
					if(window.location.href.indexOf(urls[i])!=-1){
						$(".interface_box"+this.elementId).show();
                        $(".real_url"+this.elementId).show();
                        break;
					}
				}
            }
            else {$(".show_web"+this.elementId).text("影视网页显示");}

			$("#vip_movie_box"+this.elementId+" >.plugin_inner_"+this.elementId).on("mouseover", () => {
				$(".showhide_box"+this.elementId).show();
			});
			$("#vip_movie_box"+this.elementId+" >.plugin_inner_"+this.elementId).on("mouseout", () => {
				$(".showhide_box"+this.elementId).hide();
			});
            $("#vip_movie_box"+this.elementId+" >.plugin_inner_"+this.elementId+" >.showhide_box"+this.elementId+" >.vip_mod_box_action_687ii>.item_box"+this.elementId+" >.search_interface_box"+this.elementId).on("click", () => {
				searchword = $(".input_line"+this.elementId).val();
			});
            $("#vip_movie_box"+this.elementId+" >.plugin_inner_"+this.elementId+" >.showhide_box"+this.elementId+" >.vip_mod_box_action_687ii"+" >.p_line"+this.elementId+" >.btn_submit"+this.elementId).on("click", () => {
				if(box_switch==1){$(".search_interface_box"+this.elementId).show();$(".btn_submit"+this.elementId).text("收起");box_switch=2;}
                else if(box_switch==2){$(".search_interface_box"+this.elementId).hide();$(".btn_submit"+this.elementId).text("展开");box_switch=1;}
			});
            $("#vip_movie_box"+this.elementId+" >.plugin_inner_"+this.elementId+" >.showhide_box"+this.elementId+" >.vip_mod_box_action_687ii"+" >.p_line1"+this.elementId+" >.btn_submit1"+this.elementId).on("click", () => {
				if(box_switch1==1){$(".explain_box"+this.elementId).show();$(".btn_submit1"+this.elementId).text("收起");box_switch1=2;}
                else if(box_switch1==2){$(".explain_box"+this.elementId).hide();$(".btn_submit1"+this.elementId).text("展开");box_switch1=1;}
			});
            $("#vip_movie_box"+this.elementId+" >.plugin_inner_"+this.elementId+" >.showhide_box"+this.elementId+" >.vip_mod_box_action_687ii"+" >.explain_box"+this.elementId+"  >.content"+this.elementId+" >.real_url"+this.elementId).on("click", () => {
                commonFunctionObject.GMopenInTab("https://www.feiyyd.com/?url="+window.location.href, false);
			});
            $("#vip_movie_box"+this.elementId+" >.plugin_inner_"+this.elementId+" >.showhide_box"+this.elementId+" >.vip_mod_box_action_687ii"+" >.explain_box"+this.elementId+"  >.content"+this.elementId+" >.show_web"+this.elementId).on("click", () => {
                if(commonFunctionObject.GMgetValue("show_webpage",null)==="true"){$(".show_web"+this.elementId).text("影视网页显示");commonFunctionObject.GMsetValue("show_webpage","null");}
                else {$(".show_web"+this.elementId).text("全局网页显示");commonFunctionObject.GMsetValue("show_webpage","true");}
			});
			$("body").on("click","#vip_movie_box"+this.elementId+" .vip_mod_box_action_687ii>.item_box"+this.elementId+">.interface_box"+this.elementId+">span",function(){
				var index = parseInt($(this).attr("data-index"));
				var playObject = originalInterfaceList[index];
                if(window.location.href.indexOf("bilibili.com/bangumi/play/")!=-1)
                    that.showPlayerWindow(playObject);
				else DisplayPosition(playObject.url);
			});
            $("body").on("click","#vip_movie_box"+this.elementId+" .vip_mod_box_action_687ii>.item_box"+this.elementId+">.search_interface_box"+this.elementId+">span",function(){
			    var index = parseInt($(this).attr("data-index"));
                var list_name=searchList[index].name,list_url=searchList[index].url;
                var list_search={"name":list_name,"url":list_url};
                list_search.url=list_search.url.replace("search_flag",searchword);
                var searchplayObject = list_search;
				that.searchshowPlayerWindow(searchplayObject);
			});

			//点击视频播放界面
			$("#img_box_jump_6667897iio").on("click", function(){

			});

			//右键移动位置
			var movie_box = $("#vip_movie_box"+this.elementId);
			movie_box.mousedown(function(e) {
				if (e.which == 3) {
					e.preventDefault()
					movie_box.css("cursor", "move");
					var positionDiv = $(this).offset();
					var distenceX = e.pageX - positionDiv.left;
					var distenceY = e.pageY - positionDiv.top;

					$(document).mousemove(function(e) {
						var x = e.pageX - distenceX;
						var y = e.pageY - distenceY;
						var windowWidth = $(window).width();
						var windowHeight = $(window).height();

						if (x < 0) {
							x = 0;
						} else if (x >  windowWidth- movie_box.outerWidth(true) - 100) {
							x = windowWidth - movie_box.outerWidth(true) - 100;
						}

						if (y < 0) {
							y = 0;
						} else if (y > windowHeight - movie_box.outerHeight(true)) {
							y = windowHeight - movie_box.outerHeight(true);
						}
						movie_box.css("left", x);
						movie_box.css("top", y);
						commonFunctionObject.GMsetValue("Position_" + window.location.host,{ "left":x, "top":y});
					});
					$(document).mouseup(function() {
						$(document).off('mousemove');
						movie_box.css("cursor", "pointer");
					});
					$(document).contextmenu(function(e) {
						e.preventDefault();
					})
				}
			});
		};


		this.start = function(){
			setTimeout(()=>{
				try{
					this.addHtmlElements();
					this.runEvent();
				}catch(e){}
			}, 0);
		};
	};

	try{
			const superVideoHelperObject = new superVideoHelper();
            if(window.location.href.indexOf("https://www.feiyyd.com/?url=")!=-1)document.body.innerHTML=document.body.innerHTML.match("\"url\":\\s?\"(.*?)\"")[1];
			if(superVideoHelperObject.isRun()){
				if(commonFunctionObject.GMgetValue("copyright_video_remind",null)==="true"){
					superVideoHelperObject.start();
				}else{
                    while(1){
					var r=prompt(
						"脚本运行提醒！！！\u000d"+
						"1、VIP视频解析中所用到的解析接口全部收集自互联网（源码可见），版权问题请联系相关解析接口所有者！\u000d"+
						"2、为创造良好的创作氛围，请大家支持正版！\u000d"+
						"3、脚本仅限个人学习交流，切勿用于任何商业等其它用途！\u000d"+
						"4、继续使用，即表明你已经明确使用脚本可能带来的风险，且愿意自行承担相关风险，对于风险脚本不承担任何责任！\u000d"+
						"5、此提醒只弹出一次，确认后，后续将不在弹出，请知悉！\u000d \u000d"+
                        "使用说明：\u000d将鼠标滑至当前页面左侧的“哆啦A梦”图像处，点击相应节点即可\u000d"+
                        "输入“我已知晓”，使用此脚本"
					);
					if(r=='我已知晓'){
						commonFunctionObject.GMsetValue("copyright_video_remind","true");
						superVideoHelperObject.start();
                        break;
					}}
				}
			}
	}catch(e){
		console.log("解析错误！"+e);
	}

})();
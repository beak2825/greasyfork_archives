// ==UserScript==
// @name         115优化大师
// @author       zxf10608
// @version      8.2.5
// @icon      	 https://115.com/favicon.ico
// @namespace    https://greasyfork.org/zh-CN/scripts/408466
// @description  优化115网盘使用体验：一键离线下载、批量离线、调用Dplayer或Potplayer播放视频、文件快捷下载、批量下载、磁力转换种子等。
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @require      https://scriptcat.org/lib/3195/1.3.7/GM_config_zh-CN.js#sha256=0C3ZUIc3bAZJ/D3kz0g5eIwmpff0zeeLgTXHGEcxx3g=
// @require      https://cdn.jsdelivr.net/npm/toastr@2.1.4/toastr.min.js
// @resource     toastrCss   https://cdn.jsdelivr.net/npm/toastr@2.1.4/build/toastr.min.css
// @require      https://cdn.jsdelivr.net/npm/hls.js@0.14.17/dist/hls.min.js
// @require      https://cdn.jsdelivr.net/npm/dplayer@1.26.0/dist/DPlayer.min.js
// @resource     dplayerCss  https://cdn.jsdelivr.net/npm/dplayer/dist/DPlayer.min.css
// @require      https://cdn.jsdelivr.net/npm/localforage@1.10.0/dist/localforage.min.js
// @require      https://cdn.jsdelivr.net/npm/mp4box@0.5.4/dist/mp4box.all.min.js
// @require      https://cdn.jsdelivr.net/npm/mux.js@7.1.0/dist/mux.min.js
// @require      data:application/javascript,%3Bwindow.Mux%3Dmuxjs%3B

// @match        http*://*/*
// @match        http*://*.115.com/*
// @exclude      http*://*.115.com/bridge*
// @exclude      http*://*.115.com/*/static*
// @exclude      http*://115.com/static*
// @exclude      http*://115.com/web/lixian/master/*
// @exclude      http*://*.baidu.com/*
// @exclude      http*://*.iqiyi.com/*
// @exclude      http*://*.qq.com/*
// @exclude      http*://*.youku.com/*
// @exclude      http*://*.bilibili.com/
// @exclude      http*://*.pptv.com/*
// @exclude      http*://*.fun.tv/*
// @exclude      http*://*.sohu.com/*
// @exclude      http*://*.le.com/*
// @exclude      http*://*.tudou.com/*
// @exclude      http*://*.bilibili.com/*
// @exclude      http*://music.163.com/*
// @exclude      http*://github.com/*
// @exclude      http*://gitee.com/*
// @exclude      http*://btcache.me/*
// @exclude      http*://*.jd.com/*
// @exclude      http*://*.taobao.com/*
// @exclude      http*://*.tmall.com/*
// @exclude      http*://*.vip.com/*
// @exclude      http*://*.pinduoduo.com

// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      115.com
// @connect      115vod.com
// @connect      cpats01.115.com
// @connect      videotsgo.115.com
// @connect      *
// @grant        unsafeWindow
// @grant        window.open
// @grant        window.close
// @run-at       document-start
// @compatible   chrome
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/408466/115%E4%BC%98%E5%8C%96%E5%A4%A7%E5%B8%88.user.js
// @updateURL https://update.greasyfork.org/scripts/408466/115%E4%BC%98%E5%8C%96%E5%A4%A7%E5%B8%88.meta.js
// ==/UserScript==

(function() {
	
    'use strict';
	var newVersion = 'v8.2.5';
	
	if ( typeof GM_config == 'undefined') {
		alert('115优化大师：\n网络异常，相关库文件加载失败，脚本无法使用，请刷新网页重新加载！');
		return;
	} else {
		console.log('115优化大师：相关库文件加载成功！');
	};
	
	function config(){
		var windowCss = '#Cfg .nav-tabs {margin: 20 2} #Cfg .config_var textarea{width: 310px; height: 50px;} #Cfg .inline {padding-bottom:0px;} #Cfg .config_header a:hover {color:#1e90ff;} #Cfg .config_var {margin-left: 10%;margin-right: 10%;} #Cfg input[type="checkbox"] {margin: 3px 3px 3px 0px;} #Cfg input[type="text"] {width: 53px;} #Cfg {background-color: lightblue;} #Cfg .reset_holder {float: left; position: relative; bottom: -1em;} #Cfg .saveclose_buttons {margin: .7em;} #Cfg .section_desc {font-size: 10pt;}';
		
		GM_registerMenuCommand('设置', opencfg);
		function opencfg(){ 
			GM_config.open();
		};
		
		GM_config.init(  
		{
			id: 'Cfg',
			title: GM_config.create('a', {
				   href: 'https://greasyfork.org/zh-CN/scripts/408466',
				   target: '_blank',
				   className: 'setTitle',
				   textContent: '115优化大师',
				   title: '作者：zxf10608 版本：'+newVersion+' 点击访问主页'
					}),
			isTabs: true,
			skin: 'tab',
			css: windowCss,
			frameStyle: 
			{
				height: '565px',
				width: '430px',
				zIndex:'2147483648',
			},
			fields:
			{
				file_Down:
				{
					section: ['文件管理', '提高文件管理效率'],
					label: '启用文件快捷下载',
					labelPos: 'right',
					type: 'checkbox',
					default: true,
				},
				down_batch:
				{
					label: '启用文件批量下载',
					labelPos: 'right',
					type: 'checkbox',
					default: true,
				},
				down_five:
				{
					label: '选中5个内直接下载', 
					labelPos: 'right',
					type: 'checkbox',
					default: true,
				},
				show_sha:
				{
					label: '下载后保存校验码',
					labelPos: 'right',
					type: 'checkbox',
					default: false,
				},
				down_Agreement:
				{
					label: '启用https下载协议', 
					labelPos: 'right',
					type: 'checkbox',
					default: false,
				},
				extract_file:
				{
					label: '启用文件批量提取',
					labelPos: 'right',
					type: 'checkbox',
					default: true,
					line: 'start',
				},
				extract_save:
				{
					label: '提取模式', 
					labelPos: 'left',
					type: 'select',
					'options': ['复制','移动'],
					default: '复制',
				},
				extract_type:
				{
					label: '提取类型', 
					labelPos: 'left',
					type: 'select',
					'options': ['全部','文件','视频','音乐','图片','文档'],
					default: '文件',
					line: 'end',
				},
				reminder1:
				{
					label: '温馨提示',
					labelPos: 'right',
					type: 'button',
					click: function(){
					alert('1、批量下载文件少于5个，直接浏览器下载。大于5个，所有下载地址将复制到剪切板；\n2、“https”下载协议仅在“http”访问不可用时启用，一般情况不建议开启，否则可能造成下载失败。');
					}
				},
				offline_Down:
				{
					section: ['离线升级', '升级离线下载功能'],
					label: '启用一键离线下载',
					labelPos: 'right',
					type: 'checkbox',
					default: true,
				},
				offline_result:
				{
					label: '任务添加后显示离线结果',
					labelPos: 'right',
					type: 'checkbox',
					default: true,
				},
				open_List:
				{
					label: '离线后自动打开任务列表',
					labelPos: 'right',
					type: 'checkbox',
					default: false,
				},
				open_search:
				{
					label: '离线成功后开启视频搜索',
					labelPos: 'right',
					type: 'checkbox',
					default: true,
					line: 'start',
				},
				search_result:
				{
					label: '显示视频搜索结果',
					labelPos: 'right',
					type: 'checkbox',
					default: true,
				},
				open_Popup:
				{
					label: '搜到视频自动播放',
					labelPos: 'right',
					type: 'checkbox',
					default: false,
					line: 'end',
				},
				fuzzy_find:
				{
					label: '启用下载地址模糊匹配',
					labelPos: 'right',
					type: 'checkbox',
					default: false,
				},
				diy_folder:
				{
					label: '自定义离线下载文件夹',
					labelPos: 'right',
					type: 'checkbox',
					default: false,
					line: 'start',
				},
				save_folder:
				{
					label: '设置文件夹',
					labelPos: 'right',
					type: 'button',
					line: 'end',
					click: function(){
						setFolder();
					}
				},
				reminder2:
				{
					label: '温馨提示',
					labelPos: 'right',
					type: 'button',
					click: function(){
					alert('1、显示离线下载结果有10s延时，用于服务器响应时间。\n2、为避免通知弹窗过多，最多只显示3个视频搜索结果，更多请自行到115查看。\n3、“启用下载地址模糊匹配”后，能根据哈希值或纯文本模糊匹配磁力链接和迅雷专用链，如在磁力搜索引擎、资源网等有奇效，但在某些网页有一定几率误识别，请谨慎开启。');
					}
				},
				player:  
				{
					section: ['播放优化', '调用第三方播放器，优化播放体验'],
					label: '默认播放器', 
					labelPos: 'left',
					type: 'select',
					options: ['Dplayer','官方HTML5','本地播放','苹果IINA','其他'],
					default: 'Dplayer',
				},
				play_Quality:
				{
					label: '默认播放清晰度', 
					labelPos: 'left',
					type: 'select',
					'options': ['最高','次高','最低'],
					default: '最高',
				},
				skip_titles: 
				{
					label: '跳过片头秒数',
					type: 'unsigned int',
					default: '0',
				},
				skip_credits: 
				{
					label: '跳过片尾秒数',
					type: 'unsigned int',
					default: '0',
				},
				subtitle:
				{
					label: '默认字幕语言', 
					labelPos: 'left',
					type: 'select',
					'options': ['简体中文','中英双语'],
					default: '简体中文',
				},
				local_player:
				{
					label: '自定义本地播放接口',
					labelPos: 'right',
					type: 'button',
					click: function(){
						setLocalplayer();
					}
				},
				thumb_Preview:
				{
					label: '启用缩略图预览',
					labelPos: 'right',
					type: 'checkbox',
					default: true,
				},
				M3U_list:
				{
					label: '启用生成播放列表',
					labelPos: 'right',
					type: 'checkbox',
					default: true,
				},
				Tab_ing:
				{
					label: '播放器跟随页面变化',
					labelPos: 'right',
					type: 'checkbox',
					default: false,
				},
				web_fullscreen:
				{
					label: '官方HTML5自动网页全屏',
					labelPos: 'right',
					type: 'checkbox',
					default: true,
				},
				hide_play:
				{
					label: '隐藏第三方播放器悬浮按钮',
					labelPos: 'right',
					type: 'checkbox',
					default: false,
				},
				reminder3:
				{
					label: '温馨提示',
					labelPos: 'right',
					type: 'button',
					click: function(){
					alert('1、除第一、第二项外，其他仅在启用Dplayer时有效。\n2、开启云端记忆播放，播放记录将自动上传至云端（115服务器），下次播放自动恢复上一次进度。\n3、播放界面右键可显示更多菜单，谨慎使用“删除”操作。；\n4、本地播放器(Potplayer等)需手动关联M3U文件(.m3u)，方可正常打开M3U播放列表。播放列表有效期几小时，失效请重新生成；\n5、播放器跟随页面变化，即页面后台则暂停,页面前台则播放，支持Dplayer和官方HTML5。\n6、关于播放器调用说明：\n 单击文件名：默认播放器；\n 双击除文件名外：官方HTML5；\n 单击“Dp播放”：Dplayer；\n 单击“Pot播放”：Potplayer；\n 非115页面：默认播放器；\n 其他：复制视频链接。');
					}
				},
				hide_sidebar:
				{
					section: ['更多设置', '优化浏览体验'],
					label: '隐藏网盘侧边栏',
					labelPos: 'right',
					type: 'checkbox',
					default: false,
				},
				add_dir:
				{
					label: '默认新建文件夹', 
					labelPos: 'right',
					type: 'checkbox',
					default: false,
				},
				show_Alidity:
				{
					label: '显示上次登录时间', 
					labelPos: 'right',
					type: 'checkbox',
					default: false,
				},
				show_Star:
				{
					label: '网盘顶部增加星标按钮',
					labelPos: 'right',
					type: 'checkbox',
					default: false,
				},
				show_Offline:
				{
					label: '网盘顶部增加离线进度按钮',
					labelPos: 'right',
					type: 'checkbox',
					default: true,
				},
				show_Task:
				{
					label: '网盘顶部增加链接任务按钮',
					labelPos: 'right',
					type: 'checkbox',
					default: true,
				},
				show_Update:
				{
					label: '更新后弹出更新日志',
					labelPos: 'right',
					type: 'checkbox',
					default: false,
				},
				toastr:
				{				
					label: '通知弹出位置',
					labelPos: 'left',
					type: 'select',
					'options': ['左上', '右上', '中上','全铺'],
					default: '右上',
				},
				http_ua: 
				{
					label: '数据请求UA标识（非必要勿改）',
					type: 'textarea',
					default: ''
				},
				
				
			},
			
			events:
			{
				save: function(){
					GM_config.close();
					location.reload();
				}
			},
		});
	};
	config();
	
	

	var G = GM_config;
	var localHref = window.location.href;
	var show_result = G.get('offline_result');
	var down_reg = /^(magnet|thunder|ftp|ed2k):/i;
	var player_api = GM_getValue('localplayer') || 'potplayer://';
	var UA = G.get('http_ua')!=''? G.get('http_ua'):navigator.userAgent;
	var sign_url = 'https://115.com/?ct=offline&ac=space';
	var task_del = 'https://115.com/web/lixian/?ct=lixian&ac=task_del';
	var add_url = 'https://115.com/web/lixian/?ct=lixian&ac=add_task_url';
	var add_urls = 'https://115.com/web/lixian/?ct=lixian&ac=add_task_urls';
	var add_bt = 'https://115.com/web/lixian/?ct=lixian&ac=add_task_bt';
	var lists_url = 'http://115.com/web/lixian/?ct=lixian&ac=task_lists';
	var a_list= `<br><a target="_blank" class="openList" href="javascript:void(0);" style="color:blue;" title="打开离线链接任务列表">任务列表</a>`;
	console.log('115脚本UA：'+UA);
	
	function notice(){
		GM_addStyle(GM_getResourceText('toastrCss'));
		if(G.get('toastr')=='全铺'|| localHref.indexOf('https://captchaapi.115.com') != -1) {
			GM_addStyle('.toast{font-size:15px!important;} .toast-title{font-size:16px!important;text-align:center}');
		}else{
			GM_addStyle('.toast{font-size:15px!important;width:360px!important;} .toast-title{font-size:16px!important;text-align:center}');
		};
		var place = {'左上':'toast-top-left','右上':'toast-top-right','中上':'toast-top-center'}[G.get('toastr')] || 'toast-top-full-width';
		toastr.options = { 
			"closeButton": true, 
			"debug": false, 
			"progressBar": true, 
			"timeOut": 8000,
			"extendedTimeOut": 8000, 
			"positionClass": place,
			"allowHtml": true,
			"newestOnTop" : false,
			"preventDuplicates": true,
		};
	};
	notice();
	
	function AjaxCall(href,callback) {
		GM_xmlhttpRequest({
			method: "GET",
			url: href,
			headers: {
				"User-Agent": UA,
				Origin: "https://115.com",
			},
			onload: function(data,status) {
				if(data.readyState==4 && data.status==200){
					var htmlTxt = data.responseText;
					callback(null,htmlTxt);
				};
			},
			onerror: function (error) {
				callback(error);
			},
			ontimeout: function (error) {
				callback(error);
			},
		});
	};

	function setFolder(){
		var old_cid = GM_getValue('offlineFolder') || '';
		var new_cid = prompt('请输入离线下载保存文件夹的cid值：\n   ※ 获取cid值方法：打开需要保存到的网盘文件夹，复制地址栏中"cid="后面的一串数字，以"&"截止，如https://115.com/?cid=012345678912345678&...，cid值则为 012345678912345678。该项不填或填无效值则保存至默认文件夹（云下载）。※'
					  ,old_cid);
		if (/^(\d{17,19}|0)$/.test(new_cid)){
			GM_setValue('offlineFolder',new_cid);
			alert('设置成功，现cid值为：\n'+new_cid);
		}else if(new_cid==''){
			GM_setValue('offlineFolder','');
			alert('未输入cid值，保存至默认文件夹（云下载）。');
		}else if(new_cid==null){
			console.log('已点击取消');
		}else{
			alert('设置失败，cid值无效，请重新输入！\n（该值除根目录为 0 外，其他文件夹均为17至19位纯数字）');
			setFolder();
		};
		
	};
	
	function setLocalplayer(){
		var old_api = GM_getValue('localplayer') || 'potplayer://';	
		var new_api = prompt('请输入本地播放接口的api值：\n   ※ 默认值（potplayer://）为Potplayer播放器调用接口，可根据实际情况更改为其他本地播放器接口，需自行注册关联协议。※'
					  ,old_api);
		if (/^\w+:\/\/$/.test(new_api)){
			GM_setValue('localplayer',new_api);
			alert('设置成功，现api值为：\n'+new_api);
		}else if(new_api==''){
			GM_setValue('localplayer','potplayer://');
			alert('未输入api值，设为默认值（potplayer://）。');
		}else if(new_api==null){
			console.log('已点击取消');
		}else{
			alert('设置失败，api值无效，请重新输入！');
			setLocalplayer();
		};
	};
	
	function download(key,num){
		return new Promise(function(resolve,reject){
			var batch= typeof num != 'undefined'? true:false;
			var href = `https://webapi.115.com/files/download?pickcode=${key.pc}&_=${new Date().getTime()}`;
			AjaxCall(href,function(error,htmlTxt){
				if(error){
					console.log('网络错误，获取文件地址失败！');
					resolve([false,error]);
					return;
				};
				var json = JSON.parse(htmlTxt);
				
				if(json.state){
					var link=json.file_url;
					if (G.get('down_Agreement')){
						link=link.replace(/^http/,'https');
					};
					batch? resolve([link,key.n,num,key.sha]):resolve([link]);
				}else{
					originLink(key.pc,key.fid,'115origin').then(function(origin){
						if(origin[0]){
							var link=origin[0];
							if (G.get('down_Agreement')){
								link=link.replace(/^http/,'https');
							};
							batch? resolve([link,key.n,num,key.sha]):resolve([link]);
						}else{
							batch? resolve([false,key.n,num,origin[1]]):resolve([false,origin[1]]);
						};
					});
				};
			});
		});
	};

	function originLink(pid,fid,type,name,i){
		return new Promise(function(resolve,reject){
			if (type !='115origin' && (G.get('play_Quality') !='原码' || ((G.get('player') == 'Dplayer' && type == '115play') || type == 'Dp'))){
				
				resolve([false,'ignore']);
				return;
			};
			var href = 'http://proapi.115.com/app/chrome/down?method=get_file_url&pickcode='+pid;
			AjaxCall(href,function(error,htmlTxt){
				if(error){
					console.log('网络错误，获取文件地址失败！');
					resolve([false,error]);
					return;
				};
				var json = JSON.parse(htmlTxt);
				if(json.state){
					var link = json.data[fid].url.url;
					name? resolve([link,name,i]):resolve([link]);
				}else{
					if(name){
						resolve([false,name,i,json.msg]);
					}else{
						resolve([false,json.msg]);
					};
				};
			});
		});
	};
	function getHistory(pid){
		return new Promise(function(resolve,reject){
			var href = 'https://webapi.115.com/files/history?pick_code='+pid+'&fetch=one&category=1';
			AjaxCall(href,function(error,htmlTxt){
				var time = 0;
				if(error){
					console.log('网络错误，获取播放记录失败！');
					resolve(time);
				};
				var json = JSON.parse(htmlTxt);
				if(json.state){
					if(!json.data.watch_end){
						time = json.data.time;
					};
				};
				resolve(time);
			});
		});
	};
	
	function getM3u8(video,type){
		return new Promise(function(resolve,reject){
			var herfLink = 'https://115.com/api/video/m3u8/'+video.pid+'.m3u8';
			AjaxCall(herfLink,function(error,htmlTxt){
				if (typeof htmlTxt == 'undefined') {
					transcoding(video,type);
					resolve([false,video]);
					return;
				};
				var dataList = htmlTxt.split('\n');
				var m3u8 = [];
				var temp = '"YH"|原画|"BD"|4K|"UD"|蓝光|"HD"|超清|"SD"|高清|"3G"|标清';
				var txt = temp.split('|');
				for (var i=0; i<6; i++){
					dataList.forEach(function (e,j,arr) {
						if (e.indexOf(txt[i*2])!= -1) {
							m3u8.push({name: txt[i*2+1], url: arr[j+1].replace(/\r/g,''), type:'hls'});
						};
					});
				};
				
				if (m3u8.length ==1 || G.get('play_Quality') =='最高' || G.get('play_Quality') =='原码'){
					var num = 0;
				}else if(m3u8.length >1 && G.get('play_Quality') =='次高'){
					var num = 1;
				}else{
					var num = m3u8.length - 1;
				};
				video['quality'] = num;
				if(/\#EXT-X-MEDIA/.test(htmlTxt)){
					video['mutiSound'] = true;
					video['name']=video.name+' 多音轨';
					}else{
					video['mutiSound'] = false;
				};
				resolve([m3u8,video,num]);
			});
		});
	};
	
	function switchPlayer(origin,type,m3u8,video){
		if(origin[0]){
			var link=origin[0];
			var name=origin[1];
			var definition='原码';
		}else if(m3u8){
			var link=m3u8.url;
			var name=video.name;
			var definition=m3u8.name;
		}else{
			toastr.error('未知错误，请稍后再试。','播放失败!');;
			return;
		};
		var txt='';
		if((G.get('player') == 'Dplayer' && /^115/.test(type)) || type == 'Dp'){
			var Dp=true;
		if(origin[0]) var txt='Dplayer不支持原码播放，';
		}else{
			var Dp=false;
		};
		var videoTxt = JSON.stringify(video);
		var api= Dp?'Dplayer':player_api.replace(/:\/\//g,'');
		var txt2 = `该视频为多音轨流媒体，${api} 暂不支持多音轨在线解析，播放则无声音。<br>请用官方HTML5播放或下载到本地播放。`;
		var h2 = '';
		var h3 = `&nbsp;&nbsp;<a target="_blank" class="115down" data=${videoTxt} one="1" href="javascript:void(0);" style="color:blue;" title="下载该视频">下载</a>`;
				
		if ((G.get('player') == '本地播放' && /^115/.test(type)) || type == 'Local'){
			if(m3u8 && video.mutiSound){
				var h1 = `<br><a target="_blank" class="HTML5play" href="https://115vod.com/?pickcode=${video.pid}&share_id=0" style="color:blue;" title="使用官方HTML5播放该视频">HTML5播放</a>`;
				toastr.warning(txt2+h1+h2+h3,`${api} 播放异常`);
				return;
			}else if(/smplayer|potplayer2/.test(player_api)){
				var info=`${player_api}|${link}|${UA}|${name}`;
			 }else{
				var info= player_api+link;
			 };
			window.location.href = info;
		}else if((G.get('player') == '苹果IINA' && /^115/.test(type))){			
			window.location.href = 'iina://weblink?url='+link;
		}else if(m3u8 && Dp){
			// if(link.match(/https?:\/\/videotsgo\.115\.com/) != null){
				// GM_openInTab('http://videotsgo.115.com',false);
				// return;
			// };
			if(video.mutiSound){
				var h1 = `<br><a target="_blank" class="HTML5play" href="https://115vod.com/?pickcode=${video.pid}&share_id=0" style="color:blue;" title="使用官方HTML5播放该视频">HTML5播放</a>`;
				toastr.warning(txt2+h1+h2+h3,'Dplayer 播放异常');
			}else{
				GM_openInTab('https://115.com/web/lixian/',false);
			};
		}else{
			GM_setClipboard(link);
			toastr.success(txt+'请使用其他播放器打开该地址。播放器User Agent必须与脚本UA一致！',`<span style="color:purple;">${definition}</span> 地址复制成功！`,{timeOut:8000});
		};
	};
	
	function palyData(video,type){
		if ((G.get('player') =='官方HTML5' && type == '115play') || type == 'dblclick'){
			var link = 'https://115vod.com/?pickcode='+video.pid+'&share_id=0'; 
			GM_openInTab(link,false);
			return;
		};

		originLink(video.pid,video.fid,type,video.name).then(function(origin){
			if(origin[0]){
				switchPlayer(origin,type);
				return;
			}else if(origin[1]!='ignore'){
				toastr.warning('获取视频原码地址失败，将播放转码最高清晰度。','播放原码失败!',{timeOut:6000});
			};
			
			getM3u8(video).then(function(data){
				if(!data[0]){ 
					toastr.warning('未获取播放地址。','播放失败！');
					return;
				};
				GM_setValue('videoInfo',data[1]);
				GM_setValue('m3u8List',data[0]);
				switchPlayer(origin,type,data[0][data[2]],data[1]);
			});
		}, function(error) {
			toastr.error('服务器繁忙，请稍后再试。','操作异常!');
			console.log(error);
		});
	};
	
	function transcoding(video,type){

		var href = 'http://transcode.115.com/api/1.0/web/1.0/trans_code/check_transcode_job?sha1='+video.sha+'&priority=100';
		console.log('转码进度地址:'+href);
		AjaxCall(href,function(error,htmlTxt){
			var json = JSON.parse(htmlTxt);
			if(json.status == 1 || json.status == 3){
				var num = json.count;
				var time = tranTime(json.time).replace(/分.*/,'分');
			
				var txt = `等待转码排名：第${num}名，耗时：约${time}，请稍后再试。`;
			}else if(json.status == 127){
				var txt = '未获取到转码进度，请稍后再试或选择原码播放。';	
				console.log('查询转码进度失败');
			};
			var videoTxt = JSON.stringify(video);
			var h1 = `<br><a target="_blank" class="transcode_show" data=${videoTxt} href="javascript:void(0);" style="cursor:pointer;color:blue;" title="打开转码进度详情页">转码详情</a>`;
			var h2 = '';
			var h3 = '';
			if(type==2){
				return;
			}else if(type==1){
				var title ='加速转码成功！';
			}else if(type){
				var title ='加速转码失败！';
				var txt = type;
			}else{
				var title ='播放失败，视频未转码！';
				h2 = `&nbsp;&nbsp;<a target="_blank" class="transcode_fast" data=${videoTxt} href="javascript:void(0);" style="cursor:pointer;color:blue;" title="加速转码进度">加速转码</a>`;
			};
			
			toastr.warning(txt+h1+h2+h3,title,{timeOut:10000});
		});
	};
	
	function transcod_fast(video){
		var push_url = 'https://115.com/?ct=play&ac=push';
		var key = `op=vip_push&pickcode=${video.pid}&sha1=${video.sha}`;
		offline.getData(push_url,key).then(function(json){
			
		
			if(json.state){
				var type= 1;
				transcoding(video,type);
				console.log('加速转码成功！');
				return;
			}else{
				var type= json.msg;
				transcoding(video,type);
				console.log('加速转码失败！');
			};
		});
	};
	
	function folderList(cid,name,type,sort,end){
		return new Promise(function(resolve,reject){
			var e = end? end:'';
			var s = sort? sort:'file_name';
			var key = {
				aid: 1,
				cid: cid,
				offset: 0,
				limit: 100,
				show_dir: 1,
				qid: 0,
				type: type,
				format: 'json',
				r_all: 1,
				o: sort,
				suffix: e,
				asc: 1,
				cur: 1,
				natsort: 1
			};
			
			var href = 'https://aps.115.com/natsort/files.php?'+$.param(key);

			var tp = {'4':'视频','3':'音乐','2':'图片','1':'文档'}[type] || '文件';
			AjaxCall(href,function(error,htmlTxt){
				var json = JSON.parse(htmlTxt);
				console.log('文件夹列表信息:');
				console.log(json);
				if(json.state){
					if(json.count==0){
						toastr.warning(`文件夹：<span style="color:purple;">${name}</span> 未搜索到${tp}。`,'操作失败！');
						resolve([false,json]);
					}else if(json.count>99){
						toastr.warning('所属文件数量大于 <span style="color:red;">100</span> 个。','操作无效！');
						resolve([false,json]);
					}else{
						resolve([json,name]);	
					};
				}else{
					toastr.warning(json.error,'文件夹检索失败!');
					resolve([false,json]);
				};
			});
		});
	};
	
	async function batchList(key,down){

		var m3u8ed=false;
		var end=false;
		var one=(key.count==1&&!down)? true:false;
		let urls = [];   
		for(let i=0;i<key.count;i++){
			var el=key.data[i];
			if(down){
				download(el,i).then(function(data){
					if(data[0]){
						urls.push({num:data[2],href:data[0],name:data[1],sha:data[3]});
					}else{
						toastr.warning(data[1]+' 获取下载地址失败!');
						console.log(data[1]+'获取地址失败：'+data[3]);
					};
				});
			}else{
				var video={pid:el.pc,name:el.n,n1:i};
				getM3u8(video,2).then(function(data){
					if(!data[0]){ 
						toastr.warning(data[1].name+' 未获取到转码播放地址。');
					}else{
							var m3u8=data[0];
							if(one){
								for(var j=0;j<m3u8.length;j++){
									urls.push({num:j+1,name:data[1].name,txt:`#EXTINF:-1 ,${data[1].name} ${m3u8[j].name}\r\n${m3u8[j].url}\r\n`});	
								};
							}else{
								urls.push({num:data[1].n1,name:data[1].name,txt:`#EXTINF:-1 ,${data[1].name} ${m3u8[data[2]].name}\r\n${m3u8[data[2]].url}\r\n`});
							};
						};
					m3u8ed=true;
				});				
			};
		};
		
		var time5 = setInterval(function(){
			if(one){
				if(m3u8ed){
					end=true;
				};
			}else if(urls.length==key.count){
				end=true;
			};
			if(end){
				urls.sort(function(a, b){
					return a.num - b.num
				});
				if(down){
					var links=[];
					var m5ds='文件校验码(sha1):\r\n';
					for(var k=0;k<urls.length;k++){
						links.push(urls[k].href);
						m5ds += `${urls[k].name}|${urls[k].sha}\r\n`;
						if(key.count<=5 && G.get('down_five')){
							(function(a){
								setTimeout(function() {
									GM_openInTab(urls[a].href);
								}, a*1000);
							})(k);
							if(k==4) break;
						};
					};
					setTimeout(function(){	
						if(G.get('show_sha')){
							GM_download({url:'data:text/plain;charset=utf-8,'+encodeURIComponent(m5ds),name:'校验码'});
							toastr.success('校验码文档已下载！');
						};
					}, 1000);
					
					if(key.count<=5 && G.get('down_five')){
						clearInterval(time5);
						return;
					};
					GM_setClipboard(links.join('\r\n'));
					toastr.success(urls.length+'个下载地址复制成功！');
					clearInterval(time5);
					return;
				};
				
				var hrefs = `#EXTM3U\r\n#EXTVLCOPT:http-user-agent=${UA}\r\n`;
				for(var k=0;k<urls.length;k++){
					hrefs += urls[k].txt;
				};
				
				var t1=one? '':'等';
				var t2=one? '清晰度':'视频';
				var title=urls[0].name.replace(/\.\w{2,4}$/,'').replace(/\./g,'_')+t1+'.m3u';
				var link1='data:audio/mpegurl;charset=utf-8,'+encodeURIComponent(hrefs);
				GM_download({url:link1,name:title});
				toastr.success(`共 ${urls.length} 个${t2}，请用本地播放器打开，失效请重新生成。`,'播放列表已下载');
				clearInterval(time5); 
			};
		}, 100);
		setTimeout(function(){
			if(urls.length!=key.count){
				if(urls.length!=0){
					if(!one){
						toastr.warning('部分文件地址获取失败。','批量操作异常!');
					};
					end=true;
				}else{
					toastr.warning('所选文件大小均超出115M上限，无法获取文件地址。','批量操作失败!');
					clearInterval(time5);
				};
			};
		},7000);
	};
	
	function extractList(p_id,info){
		var num = [];
		var fids = [];
		var m = G.get('extract_save')=='复制'? 'copy':'move';
		var t = {'全部':'0','文件':'99','视频':'4','音乐':'3','图片':'2','文档':'1'}[G.get('extract_type')];
		
		for(let i=0;i<info.length;i++){
			folderList(info[i].cid,info[i].n,t).then(function(obj){
				if(obj[0]){
					num.push(obj[0].count);
					for(var j=0;j<obj[0].count;j++){
						var fid=obj[0].data[j].fid || ''; 
						if (fid!=''){
							fids.push(fid);
						}else{
							fids.push(obj[0].data[j].cid);
						};
					};
				}else{
					num.push('0');
				};
			});
		};
		
		var end=false;
		var time6 = setInterval(function(){
			if(info.length==num.length || end){
				var h=eval(num.join('+'));
				if(h>200){
					toastr.warning('所选文件总数大于 <span style="color:red;">200</span> 个，请分批操作。','操作无效！');
					return;
				};
				var link ='https://webapi.115.com/files/' + m;
				var key = {pid:p_id};
				for(var k=0; k<fids.length; k++){
					key['fid['+k+']']=fids[k];
				};
				offline.getData(link,$.param(key)).then(function(json){
					
					if(json.state) {
						toastr.success(h+' 个文件批量提取成功！');
						setTimeout(function(){
							window.location.reload();
						},3000);
						
					}else{
						toastr.warning(json.error,'批量提取失败!');
					};
				});
				clearInterval(time6); 
			};
		}, 100);
		
		setTimeout(function(){
			if(info.length!=num.length){
				if(num.length!=0){
					toastr.warning('部分文件提取失败。','批量操作异常!');
					end=true;
				}else{
					toastr.warning('所有文件夹提取操作均失败','批量提取错误!');
					clearInterval(time6);
				};
			};
		},8000);
	};
	
	function change(number){
		var size = "";
		if(number < 1024 * 1024 * 1024){
			size = (number/(1024 * 1024)).toFixed(2) + "MB";
		}else{                                            
			size = (number/(1024 * 1024 * 1024)).toFixed(2) + "GB";
		};
		var sizeStr = size + "";                        
		var index = sizeStr.indexOf(".");               
		var dou = sizeStr.substr(index + 1 ,2)          
		if(dou == "00"){                                
			return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
		};
		return size;
	};
	
	function name2(txt){
		var newName=txt.replace(/\.(?!\w{2,4}$)/g,'_')
					   .replace(/\s/g,'&nbsp;');
		return newName;
	};
	function tranTime(num){
		var showTime = '';
		if (num > 3600) {showTime += ' '+parseInt(num/3600)+' 小时'; num = num%3600;}
		if (num > 60) {showTime += ' '+parseInt(num/60)+' 分'; num = num%60;}
		return showTime += ' '+parseInt(num)+' 秒';
	};
	 
	function enterPiP(videoEl){
		if(document.pictureInPictureEnabled && !videoEl.disablePictureInPicture) {
			if (!document.pictureInPictureElement) {
				videoEl.requestPictureInPicture();
			}else{
				document.exitPictureInPicture();
			};
		}else{
			alert('浏览器不支持或已关闭画中画功能！');
		};
	};
	
	function clickOne(el,t){
		var time=t? t:5000;
		if (el.attr('clicked') == 1){
			console.log('5s内不可点击该按钮');				
			return false;	
		}else{
			el.attr('clicked',1);
			el.css('opacity','0.2');
			setTimeout(function(){
				el.attr('clicked',0);
				el.css('opacity','0.7');
			
			},time);
			return true;
		};
	};
	
	function resultMark(el,type){
		if(el.length==0 || !show_result) return;
		
		var urls=[];
		var color={1:'#00CCFF',2:'#DA70D6',3:'#AEDD81',4:'#EB7347'}[type];
		for(var i=0;i<el.length;i++){
			urls.push(el[i].url);
			$('.115offline').each(function(){
				var link=$(this).data('href');
				var $al=$(this).prev();
				var m=$al.attr('marked');
				if ((el[i].url == link || el[i].url == decodeURIComponent(link)) && m != 3){
					$al.attr('marked',type).css('background-color',color);
					$al.find('[style]').removeAttr('style');
					return false;
				};
			});
		};
		return urls;
	};
	
	function repeat(link){
		var result=false;
		var A=link.slice(0,60);
		if($('.115offline').length==0) return result;
		$('.115offline').each(function(){
			var B=$(this).data('href').slice(0,60);
			if(A.toLowerCase() == B.toLowerCase()){
				result=true;
				return false;
			};
		});
		return result;
	};
	
	function searchTask(json,link){
		var dataEl = false;
		for(var i=0;i<json.tasks.length;i++){
			if (json.tasks[i].url == link || json.tasks[i].url == decodeURIComponent(link)){
				dataEl = json.tasks[i];
				break;
			};
		};
		return dataEl;
	};
	
	function verify(){
		var time = new Date().getTime();
		var w=335; 
		var h=500; 
		var t = (window.screen.availHeight-h)/2;
		var l = (window.screen.availWidth-w)/2;
		var link = 'https://captchaapi.115.com/?ac=security_code&type=web&cb=Close911_'+time;
		var a = confirm('立即打开验证账号弹窗？');
		if (a){
			var blocked = false;
			try{
				var wroxWin=window.open(link,'请验证账号','height='+h+',width='+w+',top='+t+',left='+l+',toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no');
				if(wroxWin == null){
					blocked = true;
				};
			}catch(e){
				blocked = true;
			};
			if(blocked){
				alert('验证弹窗已被拦截，请允许本页面弹出式窗口！');
			};
		};
	};
	
	function getRightUrl(url){
        var newUrl = url;
		if(/^thunder/i.test(url)){
            var key = url.replace(/thunder:\/\//i,'');
			var temp = atob(key);
			newUrl = decodeURIComponent(temp.slice(2,-2));
		};
        if(/^magnet/i.test(newUrl)){
            var hash=newUrl.split('&')[0].substring(20) || newUrl.substring(20);
            if(hash.length==32){
                hash=base32To16(hash);
			};
			newUrl='magnet:?xt=urn:btih:' + hash;
		}else if(/^\/\//.test(url)){
            newUrl=location.protocol + url;
        }else if(/^\/(?!\/)/.test(url)){
            newUrl=location.protocol+'//'+location.host + url;
        };
        return newUrl;
    };
	
	function base32To16(str){ 
        if(str.length % 8 !== 0 || /[0189]/.test(str)){
            return str;
        };
        str = str.toUpperCase();
        var bin =  "", newStr = "", i;
        for(i = 0;i < str.length;i++){
            var charCode=str.charCodeAt(i);
            if(charCode<65)charCode-=24;
            else charCode-=65;
            charCode='0000'+charCode.toString(2);
            charCode=charCode.substr(charCode.length-5);
            bin+=charCode;
        };
        for(i = 0;i < bin.length;i+=4){
            newStr += parseInt(bin.substring(i,i+4),2).toString(16);
        };
        return newStr;
    };
	
	function getAttribute(e){
		var data = [] ;
		$.each(e.attributes, function() {
			if(this.specified && this.value.length>30) {
        data.push(this.value);
			};
		});
		if($(e).text().length>25) data.push($(e).text());
		return data;
	};
	
	function right_menu(){
		$('body').append(`
		<div class="115menu" style="width:97px;height:85px;z-index:9123456789;overflow:hidden;position:absolute;display:none;background-color:#D0D0D0">
			<ul style="padding:5px 7px;margin:0px;list-style:none;">
				<li><a href="javascript:;" class="right_menu00">全选</a></li>
				<li><a href="javascript:;" class="right_menu01">反选</a></li>
				<li><a href="javascript:;" class="right_menu02">复制所选</a></li>
				<li><a href="javascript:;" class="right_menu11">复制地址</a></li>
				<li><a href="javascript:;" class="right_menu12">种子下载1</a></li>
				<li><a href="javascript:;" class="right_menu13">种子下载2</a></li>
			</ul>
		</div>`);
		$('.115menu a').css({'line-height':'25px','text-decoration':'none','color':'#2C3E50','padding':'1px 5px','font-size':'16px','font-family':'arial'});
		$('.115menu a').hover(function(){
			$(this).css({'background-color':'#2777F8','color':'#FFF'});
		},function(){
			$(this).css({'background-color':'','color':'#2C3E50'});
		});
	};
	
	function list_menu(){
		setTimeout(function(){
			var $down=$('#js_float_content [val^="download"]',parent.document);
			$down.siblings('[class^="115"],[class="Dp"],[class="Local"]').remove();
			var $sed=$('li[file_type].selected');
			
			if($sed.length==1){
				var file = {};
				file['pid']=$sed.attr('pick_code');
				file['fid']=$sed.attr('file_id');
				file['sha']=$sed.attr('sha1') || '';
				file['size']=change($sed.attr('file_size'));
				file['cid']=$sed.attr('cate_id') || '';
				file['name']=name2($sed.attr('title'));
				var fileTxt = JSON.stringify(file);
				if($('#js_operate_box').is(':hidden')){
					if(G.get('file_Down')){
						$down.hide().eq('0').after(`<li class="115down" title="快捷下载文件" data=${fileTxt} style="display: list-item;"><a href="javascript:;"><i class="icon-operate"></i><span>快捷下载</span></a></li>`);
					};
					if($sed.is(':has(.duration):not([file_mode="4"])')){
						var player2=player_api.match(/([a-z]{2,4})(p|\d|:)/i)[1].toUpperCase();
						var cl = {'Dplayer':'Dp','本地播放':'Local'}[G.get('player')] || '115play';
						var txt0 = ['Local','Dp'];
						var txt1 = ['使用'+player2+'播放视频','使用Dplayer播放视频'];
						var txt2 = [player2+'播放','Dp播放'];
						for (var i=0; i<2; i++){
							$down.eq('0').after(`<li class="${txt0[i]}" title=${txt1[i]} data=${fileTxt} style="display: list-item;"><a href="javascript:;"><span>${txt2[i]}</span></a></li>`);
						};
					};
				};
			};	
			
			if($('#js_operate_box').is(':visible') &&G.get('file_Down') && $sed.length==1){
				$('#js_operate_box [menu="download"]').replaceWith(`<li class="115down" title="快捷下载文件" data=${fileTxt}><i class="icon-operate ifo-download"></i><span>快捷下载</span></li>`);
			};
				
			if($('li[file_type="0"].selected').length==0){
				if($sed.length>0){ 
					
					if(G.get('M3U_list')){
						if($('#js_operate_box').is(':hidden')){
							$down.siblings('.115down').addBack().eq('-1').after('<li class="115M3Ulist" title="生成M3U播放列表" style="display:list-item;"><a href="javascript:;"><i class="icon-operate"></i><span>播放列表</span></a></li>');
						}else if($('.115M3Ulist').length<1){
							$('#js_operate_box li:eq(0)').after('<li class="115M3Ulist" title="生成M3U播放列表"><i class="icon-operate"></i><span>播放列表</span></li>');
						};
					};
				};
				if($sed.length>1){
				
					if(G.get('down_batch') && navigator.userAgent.indexOf('115') == -1){
						if($('#js_operate_box').is(':hidden')){
							$down.hide().eq('0').after('<li class="115down_batch" title="批量下载文件" style="display:list-item;"><a href="javascript:;"><i class="icon-operate"></i><span>批量下载</span></a></li>');
						}else if($('.115down_batch').length<1){
							$('#js_operate_box [menu="download"]').replaceWith('<li class="115down_batch" title="批量下载文件"><i class="icon-operate ifo-download"></i><span>批量下载</span></li>');
						};
					};
				};
			};
			
			if(G.get('extract_file') && $sed.length>0 && $('li[file_type="1"].selected').length==0){
				var ifo = G.get('extract_save')=='复制'? 'ifo-copy':'ifo-move';
				if($('#js_operate_box').is(':hidden')){
					$down.siblings('[class^="115down"]').addBack().eq('-1').after(`<li class="115extract" title="批量提取文件夹子文件" style="display:list-item;"><a href="javascript:;"><i class="icon-operate ${ifo}"></i><span>批量提取</span></a></li>`);
				}else if($('.115extract').length<1){
					$('#js_operate_box [menu="download"],#js_operate_box [class^="115down"]').eq('-1').after(`<li class="115extract" title="批量提取文件夹子文件"><i class="icon-operate ${ifo}"></i><span>批量提取</span></li>`);
				};
			};
		}, 100);
	};
	
	function autobox(){
		if (document.compatMode == 'BackCompat') {
			var cW = document.body.clientWidth;
			var cH = document.body.clientHeight;
			var sW = document.body.scrollWidth;
			var sH = document.body.scrollHeight;
		}else{
			var cW = document.documentElement.clientWidth;
			var cH = document.documentElement.clientHeight;
			var sW = document.documentElement.scrollWidth;
			var sH = document.documentElement.scrollHeight;
		};
		var iW=window.innerWidth;
		var iH=window.innerHeight;
		var eW = $('#Dplayer')[0].offsetWidth;
		var eH = $('#Dplayer')[0].offsetHeight;

		
		if(sW > (iW || cW)){
			cW=iW || cW;
		};
		if(sH > (iH ||cH)){
			cH=iH || cH;
		};
		
		$('#Dplayer').css({'width':cW+'px','height':cH+'px'});
	};
	
	function formatDate(date,type,format,){ 
		if (type){
			let seconds;
			const timeParts = date.split(':');
			if(timeParts.length === 3) {
				seconds = parseInt(timeParts[0]) * 3600 + 
						parseInt(timeParts[1]) * 60 + 
						parseInt(timeParts[2]);
			} else if(timeParts.length === 2) {
				seconds = parseInt(timeParts[0]) * 60 + 
						parseInt(timeParts[1]);
			};
			return seconds;
		}else{
		if (!(date instanceof Date)) {
			date = new Date(date);
		};
		const o = {
			"M+": date.getMonth() + 1, 
			"d+": date.getDate(),  
			"H+": date.getHours(),  
			"m+": date.getMinutes(),  
			"s+": date.getSeconds(), 
			"q+": Math.floor((date.getMonth() + 3) / 3),  
			"S": date.getMilliseconds() 
		};
		if (/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		};
		for (const k in o) {
			if (new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			}
		};
		return format;
	};
	};
	
	async function getSubtitle(pid,one){
		
				
			
			function convertSrtToVtt(srtText,showEnglish){
				let vtt = "WEBVTT\n\n";
				const blocks = srtText.split(/\n\s*\n/);
        let subtitleIndex = 0; 
				
				let formatType = null;
				const blockMap = {};
				blocks.forEach((block) => {
					if (!block.trim()) return;
					const lines = block.replace(/\r/g, '').trim().split("\n");
					const blockNum = lines[0].trim();
					if (blockNum && !isNaN(blockNum)) {
						if (blockMap[blockNum]) {
							formatType = 'format3';
						};
						blockMap[blockNum] = true;
					};
				});
				if (!formatType && blocks.length >= 20) {
					const cleanText = (text) => text.replace(/\{[^}]+\}/g, '').replace(/<\/?i>/g, '').trim();
					const block19 = blocks[18].replace(/\r/g, '').trim().split("\n").slice(2).join("\n");
					const block20 = blocks[19].replace(/\r/g, '').trim().split("\n").slice(2).join("\n");
					const text19 = cleanText(block19);
					const text20 = cleanText(block20);
					const isChinese19 = text19.match(/[\u4e00-\u9fa5]/);
					const isEnglish19 = text19.match(/[a-zA-Z]/);
					const isChinese20 = text20.match(/[\u4e00-\u9fa5]/);
					const isEnglish20 = text20.match(/[a-zA-Z]/);
					if (isChinese19 && !isEnglish19 && isChinese20 && !isEnglish20) {
						formatType = 'format1';
					} else if ((isChinese19 && isEnglish19) && (isChinese20 && isEnglish20)) {
						formatType = 'format2';
					} else {
						formatType = 'format1'; // 默认格式
					};
				} else if (!formatType) {
					formatType = 'format1'; // 默认格式
				};
				console.log('匹配srt字幕格式:', formatType);
				const processedBlocks = {};
				blocks.forEach((block, blockIndex) => {
					if (!block.trim()) return;
					const cleanBlock = block.replace(/\r/g, '').trim(); 
					
					const lines = cleanBlock.split("\n");
					const blockNum = lines[0].trim();

					let timeLineIndex = lines.findIndex(line => 
						line.match(/^\d{2}:\d{2}:\d{2}[,\.]\d{3}\s*-->\s*\d{2}:\d{2}:\d{2}[,\.]\d{3}$/)
					);
					if (timeLineIndex === -1) {
						timeLineIndex = lines[0].match(/^\d+$/) ? 1 : 0;
					};
					if (timeLineIndex >= lines.length) return;
					const vttTimecode = lines[timeLineIndex].replace(/,/g, ".").replace(/\s+/g, " "); 
					const textLines = lines.slice(timeLineIndex + 1).map(line => line.trim()).filter(line => line);
					const cleanText = textLines.join("\n").replace(/\{[^}]+\}/g, '').replace(/<\/?i>/g, '').trim();
					
					
					if (formatType === 'format3') {
						if (!processedBlocks[blockNum]) {
							processedBlocks[blockNum] = {
								timecode: vttTimecode,
								chinese: '',
								english: ''
							};
						};
						const isChinese = cleanText.match(/[\u4e00-\u9fa5]/);
						if (isChinese) {
							processedBlocks[blockNum].chinese = cleanText;
						} else {
							processedBlocks[blockNum].english = cleanText;
						};
					} else {
						let displayText = '';
						if (formatType === 'format1') {
							displayText = cleanText;
						} else if (formatType === 'format2') {
							if (showEnglish) {
								const chinesePart = cleanText.split('\n')[0];
								const englishPart = cleanText.split('\n').slice(1).join('\n');
								displayText = chinesePart;
								if (englishPart) displayText += `\n${englishPart}`;
							} else {
								displayText = cleanText.split('\n')[0];
							};
						};
						if (displayText) {
	  					vtt += `${subtitleIndex}\n${vttTimecode}\n${displayText}\n\n`;
  						subtitleIndex++;	
            };
					};
				});
				if (formatType === 'format3') {
					Object.values(processedBlocks).forEach(block => {
						let displayText = '';
						if (showEnglish && block.english) {
							displayText = block.chinese ? `${block.chinese}\n${block.english}` : block.english;
						} else {
							displayText = block.chinese;
					}
						if (displayText) {
	  					vtt += `${subtitleIndex}\n${block.timecode}\n${displayText}\n\n`;
  						subtitleIndex++;
            };
				});
				};
				return vtt;
			};
			function convertAssToVtt(assText, showEnglish) {
				let vttContent = "WEBVTT\n\n";
				const lines = assText.split('\n');
				let inEventsSection = false;
				let lastTime = "";
				let processedCount = 0;
	  		let subtitleIndex = 0;
				
				function cleanText(text) {
					return text.replace(/\{[^}]+\}/g, '') 
					.replace(/<\/?i>/g, '')           
							  .replace(/\\N/g, '\n')       
							  .replace(/\\h/g, ' ')    
                .replace(/-/g, '')
							  .trim();
				};

				let formatType = null;
				const dialogueLines = [];
				for (const line of lines) {
					if (line.startsWith('Dialogue:')) {
						const parts = line.substring(9).split(',');
						if (parts.length >= 10) {
							let text = parts.slice(9).join(',').trim();
							dialogueLines.push(cleanText(text).replace(/\n/g, ' '));
							if (dialogueLines.length >= 201) break;
						};
					};
				};
				if (dialogueLines.length >= 201) {
					const line199 = dialogueLines[199];
					const line200 = dialogueLines[200];
					console.log('第199行和第200行字幕：\n'+line199+'\n'+line200);
					const isChinese199 = line199.match(/[\u4e00-\u9fa5]/);
					const isEnglish199 = line199.match(/[a-zA-Z]/);
					const isChinese200 = line200.match(/[\u4e00-\u9fa5]/);
					const isEnglish200 = line200.match(/[a-zA-Z]/);
					if (isChinese199 && !isEnglish199 && isChinese200 && !isEnglish200) {
						formatType = 'format1'; 
					} else if ((isChinese199 && isEnglish199) && (isChinese200 && isEnglish200)) {
						formatType = 'format2'; 
					} else if ((isChinese199 && !isEnglish199 && isEnglish200 && !isChinese200) || 
							  (isChinese200 && !isEnglish200 && isEnglish199 && !isChinese199)) {
						formatType = 'format3'; 
					} else{
						formatType = 'format1'; 
					};
					console.log('匹配ass字幕格式:', formatType);
				};
				function formatTime(assTime) {
					const [hms, ms] = assTime.split('.');
					const [h, m, s] = hms.split(':');
					return `${h.padStart(2, '0')}:${m}:${s}.${(ms || '00').padEnd(3, '0')}`;
				};
				const subtitlePairs = {};
				for (const line of lines) {
					if (!line.trim() || line.startsWith(';')) continue;
					
					if (line.startsWith('[V4 Styles]') || line.startsWith('[V4+ Styles]') || line.startsWith('[Events]')) {
						inEventsSection = true;
						continue;
					};
					if (!inEventsSection) continue;
					if (line.startsWith('Dialogue:')) {
						const parts = line.substring(9).split(',');
						if (parts.length < 10) continue;
						const startTime = formatTime(parts[1].trim());
						const endTime = formatTime(parts[2].trim());
						const style = parts[3].trim();
						let text = parts.slice(9).join(',').trim();
						
						const isChinese = text.match(/[\u4e00-\u9fa5]/);
						
						if (formatType === 'format1') {
							let displayText = cleanText(text.split('\\N')[0]);
							if (displayText) {
								const timeKey = `${startTime}-->${endTime}`;
								if (timeKey !== lastTime) {
								vttContent += `${subtitleIndex}\n${timeKey}\n${displayText}\n\n`;
                subtitleIndex++;
               	lastTime = timeKey;
								};
							};
						} else if (formatType === 'format2') {
							if (!isChinese && !showEnglish) continue;
						let displayText = '';
						if (showEnglish) {
							const chinesePart = text.split('\\N')[0];
								const englishMatch = text.match(/\\N(\{\S+\})*([^\\]*)/);
							let chinese = cleanText(chinesePart);
								let english = englishMatch ? cleanText(englishMatch[2]) : '';
							
							
							displayText = chinese;
							if (english) displayText += `\n${english}`;
						} else {
							displayText = cleanText(text.split('\\N')[0]);
						};
						if (!displayText) continue;
							const timeKey = `${startTime}-->${endTime}`;
							if (timeKey !== lastTime) {
								vttContent += `${subtitleIndex}\n${timeKey}\n${displayText}\n\n`;
                subtitleIndex++;
                lastTime = timeKey;
							};
						} else if (formatType === 'format3') {
							const timeKey = `${startTime}-->${endTime}`;
							if (!subtitlePairs[timeKey]) {
								subtitlePairs[timeKey] = {};
							};
							if (isChinese) {
								subtitlePairs[timeKey].chinese = cleanText(text);
							} else {
								subtitlePairs[timeKey].english = cleanText(text);
							};
							if (subtitlePairs[timeKey].chinese && subtitlePairs[timeKey].english) {
								let displayText = '';
								if (showEnglish) {
									displayText = `${subtitlePairs[timeKey].chinese}\n${subtitlePairs[timeKey].english}`;
								} else {
									displayText = subtitlePairs[timeKey].chinese;
								};
								vttContent += `${subtitleIndex}\n${timeKey}\n${displayText}\n\n`;
                subtitleIndex++;
                lastTime = timeKey;
							};
						};
						processedCount++;
					};
				};
				return vttContent;
			};
						
			function fetchSubtitleData(pid){
			  return new Promise(function(resolve,reject){
					var href = 'https://115vod.com/webapi/movies/subtitle?pickcode='+pid;
					AjaxCall(href,function(error,htmlTxt){
						if(error){
							console.log('网络错误，获取内置字幕失败！');
							resolve(false);
							return;
						};
						var json = JSON.parse(htmlTxt.replace(/\[\\u5185\\u7f6e\\u5b57\\u5e55\]/g,''));
						if(!json.state || htmlTxt.indexOf('title') == -1){
							resolve(false);
							return;
						};
						

						var targetSubtitle = null;
						for (var i=0;i<json.data.list.length;i++){
							if(json.data.list[i].title.match(/简体|chs|zh-cn|simplified/i)){
								targetSubtitle = json.data.list[i];
								break;
							};
						};

						if(!targetSubtitle){
							targetSubtitle = json.data.autoload;
						};
						
						if(!targetSubtitle || !targetSubtitle.url){
							resolve(false);
							return;
						};
						

						AjaxCall(targetSubtitle.url,function(error,subtitleText){
							if(error){
								console.log('获取字幕文本失败！');
								resolve(false);
								return;
							};
							if(!subtitleText.match(/[\u4e00-\u9fa5]/)){
								console.log('默认字幕不包含中文，查找其他字幕');
								findChineseSubtitle(json.data.list).then(function(chineseSubtitle){
									resolve(chineseSubtitle || {
										text: subtitleText,
										type: targetSubtitle.type,
										title: targetSubtitle.title,
									  url:targetSubtitle.url
									});
								});
								return;
							}else if(targetSubtitle){
								console.log('默认字幕链接：\n'+targetSubtitle.title+'\n'+targetSubtitle.url);
							};
							resolve({
								text: subtitleText,
								type: targetSubtitle.type,
								title: targetSubtitle.title,
								url:targetSubtitle.url
							});
						});
					});
				});

				function findChineseSubtitle(subtitles){
					return new Promise(function(resolve){
						var index = 0;
						function checkNext(){
							if(index >= subtitles.length){
								resolve(null);
								return;
							};
							
							var subtitle = subtitles[index++];
							AjaxCall(subtitle.url,function(error,text){
								if(error || !text.match(/[\u4e00-\u9fa5]/)){
									checkNext();
								}else{
									resolve({
										text: text,
										type: subtitle.type,
										title: subtitle.title,
									  url:subtitle.url
									});
								console.log('字幕链接：\n'+subtitle.title+'\n'+subtitle.url);
								};
							});
						}
						checkNext();
					});
				};
			};
			async function processSubtitleItem(pid,one){
				if(G.get('subtitle')=='简体中文'){
					var showEnglish=false;
					console.log('预设字幕语言：简体中文');
				}else{
					var showEnglish=true;
					console.log('预设字幕语言：中英双语');
				};
			   const subtitleData = await fetchSubtitleData(pid);
			   if (!subtitleData) return false;
				if (one) return subtitleData;
			   const subtitleText = subtitleData.text;
			   if (subtitleData.type=='srt'){
				  var vttText = convertSrtToVtt(subtitleText,showEnglish);
			   }else if (subtitleData.type=='ass'){
				  var vttText = convertAssToVtt(subtitleText,showEnglish);
			   }else {
				   return false;
			   };
			const blob = new Blob([vttText], {type: "text/vtt; charset=utf-8"});
			const blobUrl = URL.createObjectURL(blob);
			   return {
				 url: blobUrl,
				 vvtText: vttText,
			   };
			};
			var subtitle = await processSubtitleItem(pid,one);
			if (!subtitle){
				return false;
			};
			return subtitle;
		};
		
	$(document).ready(function(){
		if(localHref.indexOf('https://115.com/') != -1) {	
			if (typeof (unsafeWindow.USER_ID) != 'undefined') {
				GM_setValue('115ID', unsafeWindow.USER_ID);
				//console.log('115账号已登录，账号ID获取成功！');
					} else { 
						
					};
			
			if (G.get('add_dir')){
				$('#js_top_panel_box [menu="create_word"]').attr('menu','add_dir');
			};
			
			var $topEl = $('#js_top_panel_box [id="js_filter_btn"]').addClass('btn-line');
			if (G.get('show_Star')){
				$topEl.after('<a href="javascript:;" file_dialog_menu="star" class="button btn-line" id="js_star_list_btn"><i class="icon-operate ifo-fav"></i><span>星标</span></a>');
			};
			

			if (G.get('show_Task')){
				$topEl.after('<a href="javascript:;" class="button btn-line btn-upload" menu="offline_task"><i class="icon-operate ifo-linktask"></i><span>链接任务</span></a>');
			};
			
			
			if (G.get('show_Offline') && localHref.indexOf('https://115.com/?ct=file') != -1) {
				$topEl.after('<a href="javascript:;" class="button btn-line" tab_btn="wangpan" mode-tab="offline"><i class="icon-operate ifo-linktask"></i><span>离线进度</span></a>');
				$('body').append(`
				<script>
					$('body').on('click','#js_top_panel_box [mode-tab="offline"]',function(e){
						window.open('https://115.com/?tab=offline&mode=wangpan', '_blank');
						return false;
			});
			</script>`);
			};
			
			if (G.get('hide_sidebar')){
				$('.sub-hflow-file').hide();
				$('.wrap-vflow [rel="page_top_btn"]').show();
			};
			
			setTimeout(function(){
				$('.promptbar-caution,.feature-float').remove();
			},1000);
			
			if (G.get('file_Down')){
				var herfd = 'li[file_type]:not([down_button="1"])';
				$('body').on('mouseenter',herfd,function(){
					var $El = $(this).attr('down_button',1);
					$El.find('.file-opr a[menu^="download"]').hide();
					$El.find('.file-opr').prepend('<a class="115down" href="javascript:;"title="快捷下载文件"><i class="icon-operate ifo-download"></i><span>快捷下载</span></a>');
					
				
				
				});
			};

			
			var herfv = 'li[file_type="1"]:has(.duration):not([file_mode="4"],[paly_button="1"])';
			var player2=player_api.match(/([a-z]{2,4})(p|\d|:)/i)[1].toUpperCase();
			$('body').on('mouseenter',herfv,function(){
				var $El = $(this).attr('paly_button',1);
				
				var cl = {'Dplayer':'Dp','本地播放':'Local'}[G.get('player')] || '115play';
				$El.find('.name').addClass(cl).removeAttr('menu');
				
				var txt0 = ['Local','Dp'];
				var txt1 = ['使用'+player2+'播放视频','使用Dplayer播放视频'];
				var txt2 = [player2+'播放','Dp播放'];
				if (!G.get('hide_play')){
					for (var i=0; i<2; i++){
						$El.find('.file-opr').prepend('<a href="javascript:;" class='+txt0[i]+' title='+txt1[i]+'><span>'+txt2[i]+'</span></a>');
					};
				};
				$El.not('.name').dblclick(function(){
					var type = 'dblclick';
					var pid1 = $El.attr('pick_code');
					var video = {'pid':pid1};
					palyData(video,type);
					return false;
				});
			});
			$('body').on('mouseenter','li[rel="item"]:not([batch_button="1"])',function(e){
				var $El=$(this).attr('batch_button',1);
				$El.find('.checkbox').addBack().click(function(){
					list_menu();
				});
				$El.contextmenu(function(){
					list_menu();
				});
			});
			$('body').on('mouseenter','.list-header:not([batch_button="1"])',function(){
				var $El=$(this).attr('batch_button',1);
				$El.find('[menu="file_check_all"]').click(function(){
					list_menu();
				});
			});	
			
		};
		
		if(localHref.indexOf('https://captchaapi.115.com') != -1 && window.top==window.self) {
			window.focus();
			toastr.info('验证成功后本页面将自动关闭.');
			var t_close;
			$('#js_ver_code_box [rel="verify"]').click(function (){
				t_close=setTimeout(function(){
					console.log('验证正确');
						
						window.open('','_self');
						window.close();
				}, 200);
				return false;
			});
			$('.vcode-hint').on('DOMNodeInserted',function(e){
				console.log('验证错误！');
				clearTimeout(t_close);
			});
		};
		
		if(localHref.indexOf('https://115vod.com/') != -1) {
			$('.feature-float').remove();
			$('.bar-side ul').prepend(`
				<li><a href="javascript:;" class="openPiP" 
			style="float:left;width:40px;height:20px;margin:10px 5px;border-radius:3px;font-size:12px;text-align:center;background:#666;color:#fff;opacity:0.7;">
			<s>画中画</s><div class="tooltip" >开启画中画</div></a></li>`);
			if (G.get('web_fullscreen')){
				$('body').append(`<script>$('.bar-side [rel="web_fullscreen"]').click();</script>`);
			};
			if (G.get('thumb_Preview')){
				$(document).ready(async () => {
					console.log('视频加载完成，开始获取m3u8信息');
					$('body').append(`<div id="thumbPreview" style="position:absolute;z-index:999;display:none;"></div>`);
					const pickID = new URL(localHref).searchParams.get('pickcode');
					const video = {'pid':pickID};
					const m3u8_Info = await getM3u8(video,2);
					if (m3u8_Info){
						var m3u8=m3u8_Info[0];
							console.log('m3u8母文件获取成功。');
						}else{
							console.log('m3u8母文件获取失败。');
							return false;
					};
					try {
						const m3u8Info = await clipper.fetchM3U8Info(m3u8[0].url,pickID);
						if (m3u8Info){
							console.log('m3u8信息获取成功。');
						}else{
							console.log('m3u8信息获取失败。');
							return;
						};
						setTimeout(() => {
							clipper.preloadThumbnails(pickID,m3u8Info);
						}, 600000);
						let leave=true;
						let hoverTimer;
						let lastTime = 0;
						let firstTrigger = true;
						let currentThumb = false;
						$('.bar-progress').on('mouseenter mouseleave',function(e) {
							if(e.type == 'mouseenter'){
								leave=false;
								async function task() {
									if (leave) {
										$('#thumbPreview').hide();
										clearInterval(hoverTimer);
										return;
									};
									const currentTimeText = $('.bar-preview').text(); 
									const currentTime = formatDate(currentTimeText,true);
									const timeChange = Math.abs(lastTime - currentTime);
									if (!firstTrigger && timeChange < 60){
										firstTrigger = false;
										//console.log('条件未满足，跳过处理。');
										
                    return;
									};
									if(currentThumb) {
										$('#thumbPreview').hide();
										currentThumb = false;
									};
									currentThumb = true;
									firstTrigger = false;
									lastTime = currentTime;
									await clipper.getPreview(pickID,currentTime,false);
								};
								hoverTimer = setTimeout(() => {
									task();
									hoverTimer = setInterval(task, 2500); 
								}, 1000);
							}else if(e.type == 'mouseleave'){
								leave=true;
								firstTrigger = true;
								$('#thumbPreview').hide();
								clearInterval(hoverTimer);
								
							};
						});
					} catch (error) {
						console.error('缩略图生成失败:', error);
					}
				});			
			};
		};
		
		if(localHref.indexOf('https://115.com/?cid=0&offset=0&mode=wangpan') != -1) {
			window.onload=function(){
				if (G.get('show_Alidity') && typeof unsafeWindow.USER_ID != 'undefined'){
					var login_info = 'http://passportapi.115.com/app/1.0/web/9.2/login_log/login_devices';
					AjaxCall(login_info,function(error,htmlTxt) {
						var json = JSON.parse(htmlTxt);
						if(json.state==1) {
							var time = json.data.last.utime;
							var date = new Date(time * 1000);
							var loginTime = formatDate(date,false,"yyyy年MM月dd日 HH:mm");
							toastr.success('上次登录时间：'+loginTime,{timeOut:5000});
							console.log('登录时间:\n'+loginTime);
						} else {
							var txt=json.error || '网络错误，未知时间！';
							toastr.warning('上次登录时间：'+txt,{timeOut:5000});
						};
					});
				};
			};
		};
		
		var oldVer = GM_getValue('version') || '';
		if (G.get('show_Update') && oldVer != newVersion){ 
			var txt=`115优化大师 ${newVersion} 更新日志：\n更新日期：2025年5月5日 \n1、优化查询离线结果规则；\n2、优化磁力链接扫描逻辑；\n3、DPlayer和官方HTML5新增缩略图预览功能，默认开启，可到设置中关闭； \n4、设置中移除“云端记忆播放”选项，默认开启。`
			setTimeout(function(){
				alert(txt);
			},2000);
			GM_setValue('version',newVersion);
		};
	});
	
	if (localHref.match(/^https:\/\/115\.com\/web\/lixian\/$/) !== null)  {
		var m3u8 = GM_getValue('m3u8List');
		var video = GM_getValue('videoInfo');
		var titleTxt = video.name;
		var pickID = video.pid;
		var folderID = video.cid;
		var videoID = video.fid;
		var size = video.size;
		var sha = video.sha;
		var z = video.quality;
		var skipTime = G.get('skip_titles');
		var skipTime2 = G.get('skip_credits');
		GM_setValue('stop',true);
		
		$('pre').remove();
		$('body').html('');
		$('head').html(`<meta http-equiv="Content-Type" content="text/html; charset=GBK"><title>${titleTxt} ${size}</title>`);
		$('body').css({'margin':'0','padding':'0','border':'0','outline':'0','background':'transparent'});
		$('body').append(`<div id="Dplayer"></div><div id="thumbPreview" style="position:absolute;z-index:999;display:none;"></div>`);
		GM_addStyle(GM_getResourceText('dplayerCss'));
		
		async function playVideo(m3u8){
			var subtitle = await getSubtitle(pickID);
			if (!subtitle){
				var subtitleUrl='';
				console.log('在线字幕不存在或无法识别。');
			}else{
				var subtitleUrl=subtitle.url;
			};
			var dp = new DPlayer({
				container: $('#Dplayer')[0],
				screenshot: true,
				volume: 1,
				video: 
				{
                    quality: m3u8,
                    defaultQuality: z
                },
				subtitle: 
				{
					url: subtitleUrl,
					type: 'webvtt',
					fontSize: '35px',
					bottom: '3%',
					color: '#FFFFFF' 
         },
				contextmenu: 
				[
					{
						text: '下载视频',
						click: function(t) {
							var key={pc:pickID,fid:videoID};
							download(key).then(function(data){
								if(data[0]){
									GM_openInTab(data[0]);
									if(G.get('show_sha')){
										setTimeout(function(){
											prompt('文件下载中，校验码(SHA1)为：',sha);
										}, 1000);
									};
								}else{
									alert('下载失败！'+data[1]);
								};
							});
						}
					},
					{
						text: '删除视频',
						click: function(t) {
							dp.pause();
							var a = confirm('确认删除 '+titleTxt+' 视频文件？');
							if (a){
								offline.del(videoID)
							};
						}
					},
					{
						text: '查看文件夹',
						click: function(t) {
							GM_openInTab(`https://115.com/?cid=${folderID}&offset=0&mode=wangpan`,false);
						}
					},
					{
						text: '删除文件夹',
						click: function(t) {
							var a = confirm('确认删除 '+titleTxt+' 视频所属文件夹？');
							if (a){
								offline.del(folderID);
							};
						}
					},
					{
						text: '设置星标',
						click: function(t) {
							var n=1;
							offline.setStar(videoID,n);
						}
					},
					{
						text: '取消星标',
						click: function(t) {
							var n=0;
							offline.setStar(videoID,n);
						}
					},
					{
						text: '重命名',
						click: function(t) {
							offline.newName(videoID,titleTxt);
						}
					}
				]
			});
			
			unsafeWindow.dp = dp;
			unsafeWindow.$ = $;

			$('#Dplayer').click();
			$('.dplayer-menu').css('width','98px');
		    $('.dplayer-setting-loop,.dplayer-mobile-play,.dplayer-menu-item:gt(-3)').hide();
			if(m3u8.length >1){
				$('.dplayer-quality button').css('color','Lime');
			};
			
			$('.dplayer-quality').after(`
			<div class="dplayer-icon openPiP" data-balloon="画中画" data-balloon-pos="up">
				<span class="dplayer-icon-content"><svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg"><g fill="#E6E6E6" fill-rule="evenodd"><path d="M17 4a2 2 0 012 2v6h-2V6.8a.8.8 0 00-.8-.8H4.8a.8.8 0 00-.794.7L4 6.8v8.4a.8.8 0 00.7.794l.1.006H11v2H4a2 2 0 01-2-2V6a2 2 0 012-2h13z"></path><rect x="13" y="14" width="8" height="6" rx="1"></rect></g></svg></span>
			</div>`);
			
			
			if (!subtitle){
				dp.on('subtitle_show', function(){
					dp.notice('在线字幕不存在！请把字幕放到与视频同一文件夹，字幕与视频的文件名需同名。', 8000);
				});
			};
			if (video.mutiSound){
				var x = confirm('该视频为多音轨流媒体，Dplayer暂不支持多音轨解析，播放则无声音。\n请用官方HTML5或下载到本地播放，立即打开官方HTML5播放器？');
				if (x){
					window.location.href='https://115vod.com/?pickcode='+video.pid+'&share_id=0';
				};
			};
			dp.on('loadstart', function (){
				dp.notice('视频加载中,请稍侯。', 1000);
			});
			
			var a = 0;
			dp.on('loadeddata', function () {
				dp.notice('视频加载完成。', 1000);
				a++;
				if(a!=1) return;
				
				setTimeout(function(){
					getHistory(pickID).then(function(onTime){
						if(onTime > skipTime){
							dp.seek(onTime);
							dp.notice('已跳转到上次观看进度'+tranTime(onTime), 2500);
						}else if(skipTime>0){
							dp.seek(skipTime);
							dp.notice('已跳过片头'+skipTime+'秒', 2500);
						};
						
						if(document.hidden && G.get('Tab_ing')){
							return;
						};
						dp.play();
					});
					
				}, 1000);
				
			});
			
			var b=0;
			dp.on('timeupdate', function(){
				if((dp.video.duration - dp.video.currentTime) <= (skipTime2 >0? skipTime2:30)){
					var ed=1;
					b++
					if(skipTime2>0){
						dp.notice('已跳过片尾'+skipTime2+'秒', 2500);
						dp.pause();
						if(b%2==0){
							setTimeout(function(){
								alert('视频已播放结束！');
							}, 1000);
						};
					};
				}else{
					var ed=0;
				};
				GM_setValue('end',ed);
			});
			
			var c=0;
			var up;
			function upTime(out){
				up = setInterval(function (){
					var end=GM_getValue('end') || 0;
					var newTime=dp.video.currentTime.toFixed(0);
					var t =parseInt(dp.video.currentTime-c);
					c=dp.video.currentTime;
					
					var key = {
						'op': 'update',
						'pick_code': pickID,
						'time': end? 0:newTime,
						'definition': end,
						'category': 1
					};
					var history_url='https://webapi.115.com/files/history';
					if(end || (c >= 30 && Math.abs(t) > 1)){
						offline.getData(history_url,$.param(key)).then(function(json){
							json.state? console.log('上传播放记录成功！'):console.log('上传播放记录失败，'+json.error);
						});
					
					};
					
					if(dp.video.paused || dp.video.error || end){ 
						GM_setValue('stop',true);
						clearInterval(up);
					};
				
				}, out);
			};
			
			
				dp.on('play', function(){
					var stop=GM_getValue('stop');
					if(stop){
						GM_setValue('stop',false);
						upTime(3000);
					};
				});
				
				dp.on('seeked', function(){
					if(dp.video.paused){
						upTime(50);
					};
				});
			
			
			dp.on('error', function(){
				alert('视频加载失败！');
			});
			
			dp.on('ended', function(){
				alert('视频播放结束！');  
			});
			if (G.get('thumb_Preview')){
				dp.on('loadeddata', async function() {
					setTimeout(function(){ 
						dp.notice('缩略图预览已开启，连续预览时视频间隔需大于60s，鼠标停留3s。',3000);
					}, 5000);
					console.log('视频加载完成，开始获取m3u8信息。');
					try {
						const m3u8Info = await clipper.fetchM3U8Info(m3u8[0].url,pickID);
						if (m3u8Info){
							console.log('m3u8信息获取成功。');
						}else{
							console.log('m3u8信息获取失败。');
							return;
						};
						setTimeout(() => {
							clipper.preloadThumbnails(pickID,m3u8Info);
						}, 600000);
						let leave=true;
						let hoverTimer;
						let lastTime = 0;
						let firstTrigger = true;
						let currentThumb = false;
						$('.dplayer-bar-wrap').on('mouseenter mouseleave',function(e) {
							if(e.type == 'mouseenter'){
								leave=false;
								async function task() {
									if (leave) {
										$('#thumbPreview').hide();
										clearInterval(hoverTimer);
										return;
									};
									const currentTimeText = $('.dplayer-bar-time').text();
									const currentTime = formatDate(currentTimeText,true);;
									const timeChange = Math.abs(lastTime - currentTime);
									if (!firstTrigger && timeChange < 60){
										firstTrigger = false;
										
										return;
									};
									if(currentThumb) {
										$('#thumbPreview').hide();
										currentThumb = false;
									};
									currentThumb = true;
									firstTrigger = false;
									lastTime = currentTime;
									await clipper.getPreview(pickID,currentTime,true);
								};
								hoverTimer = setTimeout(() => {
									task(); 
									hoverTimer = setInterval(task, 2500);
								}, 1000); 
							}else if(e.type == 'mouseleave'){
								leave=true;
								firstTrigger = true;
								$('#thumbPreview').hide();
								clearInterval(hoverTimer);
							
							};
						});
					} catch (error) {
						dp.notice('缩略图生成失败', 2000);
						console.error('缩略图生成失败:', error);
					}
				});
			};
	    };
	    playVideo(m3u8);
		autobox();	
	};
		var clipper = function(){
		localforage.config({
			name: '115Preview', 
			storeName: 'cache', 
			version: 1, 
			description: '缩略图缓存数据', 
			driver: localforage.INDEXEDDB 
		}).then(() => {
			localforage.keys().then(keys => {
				const now = Date.now();
				keys.forEach(key => {
					if(key.startsWith('video_')) {
						localforage.getItem(key).then(pidData => {
							if(pidData && now - pidData.lastTime > 7 * 24 * 60 * 60 * 1000) {
								localforage.removeItem(key);
							};
						});
					};
				});
			});
		});
		return {
			fetch:function(url,type) {
				var rt = type?'text':'arraybuffer';
				var ra = type?'bytes=0-':'bytes=0-262144';//1024 * 256
				return new Promise((resolve, reject) => {
					GM_xmlhttpRequest({
						method: "GET",
						url: url,
						responseType: rt,
						headers: {
							"Range": ra,
							"User-Agent": UA,
							"Origin": "https://115.com"
						},
						onload: function(data) {
							if(data.readyState === 4 && /^2/.test(data.status) && type) {
								var htmlTxt = data.responseText;
								resolve(htmlTxt);
							} else if(data.readyState === 4 && /^2/.test(data.status) && !type) {
								if(!(data.response instanceof ArrayBuffer)) {
									reject(new Error('服务器返回了无效的视频数据'));
									return;
								};
								resolve(data.response);
							} else {
								reject(new Error(`请求失败: ${data.status}`));
							};
						},
						onerror: function(error) {
							reject(error);
						},
						ontimeout: function(error) {
							reject(new Error('请求超时'));
						}
					});
				});
			},
			getExtradata:function(mp4box) {
				try {
					const entry = mp4box.moov.traks[0].mdia.minf.stbl.stsd.entries[0];
					const box2 = entry.avcC ?? entry.hvcC ?? entry.vpcC;
					if (box2 != null) {
						const buffer = new ArrayBuffer(1024);
						const stream = new DataStream(buffer, 0, DataStream.BIG_ENDIAN);
						box2.write(stream);
						return new Uint8Array(stream.buffer, 8, stream.position - 8);
					}
				} catch (error) {
					console.error("获取解码器所需的额外数据出错：", error);
				}
				return null;
			},
			calcClipSize:function(width, height, maxWidth, maxHeight) {
				const scale = Math.min(maxWidth / width, maxHeight / height);
				return {
					width: width * scale,
					height: height * scale
				};
			},
			createDecodePipeline:function({nbSamples, maxWidth, maxHeight}) {
				let sampleCount = 0;
				const frames = [];
				const mp4boxfile = MP4Box.createFile();
				const transmuxer = new Mux.mp4.Transmuxer();
				let videoDecoder = null;
				let videoTrack = null;
				let currentPosition = 0;
				const promise = new Promise((resolve, reject) => {
					transmuxer.on("data", (segment) => {
						try {
							const initSegment = new Uint8Array(segment.initSegment);
							const data = new Uint8Array(segment.data);
							const buffer = new ArrayBuffer(initSegment.byteLength + data.byteLength);
							const uint8View = new Uint8Array(buffer);
							uint8View.set(initSegment, 0);
							uint8View.set(data, initSegment.byteLength);
							buffer.fileStart = currentPosition;
							mp4boxfile.appendBuffer(buffer);
							mp4boxfile.flush();
						} catch (error) {
							console.error('处理transmuxer数据时出错:', error);
							reject(error);
						};
					});
					transmuxer.on("error", (error) => {
						console.error('transmuxer发生错误:', error);
						reject(error);
					});
					mp4boxfile.onReady = (info) => {
						videoTrack = info.videoTracks[0];
						if (videoTrack) {
							mp4boxfile.setExtractionOptions(videoTrack.id, "video", {nbSamples});
							const {width, height} = clipper.calcClipSize(
								videoTrack.track_width,
								videoTrack.track_height,
								maxWidth,
								maxHeight
							);
							videoDecoder = new VideoDecoder({
								output: async (videoFrame) => {
									const img = await createImageBitmap(videoFrame, {
										resizeQuality: "pixelated",
										premultiplyAlpha: "none",
										resizeWidth: width,
										resizeHeight: height
									});
									const frame = {
										img,//图片帧数据
										duration: videoFrame.duration,//持续时间
										timestamp: videoFrame.timestamp//时间戳
									};
									sampleCount++;
									frames.push(frame);
									if (sampleCount >= nbSamples) {
										resolve(frames);
									}
									videoFrame.close();
								},
								error: (error) => {
									console.error('VideoDecoder错误:', error);
									reject(error);
								}
							});
							try {
								videoDecoder.configure({
									codec: videoTrack.codec,
									codedWidth: videoTrack.track_width,
									codedHeight: videoTrack.track_height,
									hardwareAcceleration: "prefer-hardware",
									optimizeForLatency: true,
									description: clipper.getExtradata(mp4boxfile)
								});
								mp4boxfile.start();
							} catch (error) {
								console.error('配置VideoDecoder失败:', error);
								reject(error);
							}
						};
					};
					mp4boxfile.onSamples = (trackId, _, samples) => {
						if (videoTrack?.id === trackId) {
							mp4boxfile.stop();
							for (let i = 0; i < samples.length && sampleCount < nbSamples; i++) {
								const sample = samples[i];
								const isKeyFrame = sample.is_sync;
								const chunk = new EncodedVideoChunk({
									type: isKeyFrame ? "key" : "delta",
									timestamp: sample.cts * 1e7 / videoTrack.timescale,
									duration: sample.duration * 1e7 / videoTrack.timescale,
									data: sample.data
								});
								if (videoDecoder) {
									videoDecoder.decode(chunk);
								};
							};
						};
						if (videoDecoder) {
							videoDecoder.flush();
						};
					};
				});
				const push = (buffer, pos) => {
					transmuxer.push(buffer);
					currentPosition = pos;
				};
				return {
					mp4boxfile,
					transmuxer,
					videoDecoder,
					videoTrack,
					promise,
					push,
					frames
				};
			},
			processStreamingSegment:async function({options,url, nbSamples, maxWidth, maxHeight}) {
				const MAX_STEP_COUNT = 5;
				const DEFAULT_STEP_CHUNK_SIZE = 1024 * 256;
				const DEFAULT_INITIAL_CHUNK_SIZE = DEFAULT_STEP_CHUNK_SIZE;
				const initialChunkSize = options.initialChunkSize || DEFAULT_INITIAL_CHUNK_SIZE;
				const stepChunkSize = options.stepChunkSize || DEFAULT_STEP_CHUNK_SIZE;
				let step = 0;
				let currentPosition = 0;
				const currentChunkSize = initialChunkSize;
				return new Promise((resolve, reject) => {
					const buffers = [];
					let bufferCumulativeSize = 0;
					const processNextChunk = async () => {
						try {
							const pipeline = clipper.createDecodePipeline({
								nbSamples,
								maxWidth,
								maxHeight
							});
							const buffer = await clipper.fetch(url, false);
							buffers.push(new Uint8Array(buffer));
							bufferCumulativeSize += buffer.byteLength;
							const cumulativeBuffer = new Uint8Array(bufferCumulativeSize);
							let offset = 0;
							for (const buf of buffers) {
								cumulativeBuffer.set(buf, offset);
								offset += buf.byteLength;
							}
							pipeline.push(cumulativeBuffer, 0);
							pipeline.transmuxer.flush();
							if (pipeline.frames.length === 0) {
								Promise.race([
									pipeline.promise,
									new Promise((resolve2) => {
										setTimeout(() => {
											resolve2(new Error("timeout"));
										}, 100);
									})
								]).then(async (result) => {
									if ((result instanceof Error || pipeline.frames.length === 0) && step < MAX_STEP_COUNT) {
										currentPosition += stepChunkSize;
										step++;
										await processNextChunk();
									} else {
										resolve(pipeline.frames);
									}
								}).catch(async (error) => {
									if (error.name === "EncodingError") {
										currentPosition += stepChunkSize;
										step++;
										await processNextChunk();
									} else {
										reject(error);
									}
								});
							} else {
								resolve(pipeline.frames);
							}
						} catch (error) {
							console.error('处理分块时发生错误:', error);
							reject(error);
						}
					};
					processNextChunk();
				});
			},
			getPidData:async function(pidKey) {
			    const now = Date.now();
			    
			    let pidData = await localforage.getItem(pidKey) || {
			        preloaded:false,
			        lastTime: now,
			        m3u8Time: 0,
			        m3u8Info: [],
			        clipInfo: []
			    };
				return pidData;
			},
			fetchM3U8Info:async function(url,pid) {
				const now = Date.now();
				const pidKey = `video_${pid}`;
				let pidData =  await clipper.getPidData(pidKey);
				pidData.lastTime = now;
			    if (now - pidData.m3u8Time > 2 * 60 * 60 * 1000) {
			        await localforage.removeItem('m3u8Info');
			        pidData.m3u8Time = now;
			        pidData.m3u8Info = [];
			    };
			    if (pidData.m3u8Info.length > 0) {
					console.log('从缓存获取到m3u8信息。');
			        return pidData.m3u8Info;
			    };
			    
			    const htmlTxt = await clipper.fetch(url, true);
			    const lines = htmlTxt.split('\n').filter(line => line.trim());
			    let startTime = 0;
			    pidData.m3u8Info = lines.map((line, index) => {
			        if (line.startsWith('#EXTINF:')) {
			            const duration = Number(line.match(/#EXTINF:([\d.]+)/)[1]);
						const url_temp = lines[index + 1].trim().replace(/`/g, '');
						const uri = new URL(url_temp, url).href;  
						const endTime = Number(startTime) + Number(duration);  
						const info = {  
							  _url:uri,	
							  _duration: duration,
							  _startTime: startTime,
							  _endTime: endTime,	
							  _index: (index-5)/2	
						};
						startTime = endTime;
						return info;
					}
			    }).filter(Boolean);
			    await localforage.setItem(pidKey, pidData);
			    return pidData.m3u8Info;
			},
			findSegmentByTime:async function(time,pidKey) {
				let pidData = await clipper.getPidData(pidKey);
			    if (pidData.m3u8Info.length == 0) {
					return false;
				};
				for (const segment of pidData.m3u8Info) {
					if (time >= segment._startTime && time < segment._endTime) {
						return segment;
					};
				};
				return false;
			},
			getClip:async function(segment,pidKey,time,type,options) {
			    
			    
			    let pidData =  await clipper.getPidData(pidKey);
			    
			   
				if (pidData.clipInfo.length > 0) {
			    for (const clipData of pidData.clipInfo) {
			        if (time >= clipData.startTime && time < clipData.endTime) {
			            return clipData;
			        };
					};
				};				
			    const segmentClips = await clipper.processStreamingSegment({
			        options: options,
			        url: segment._url,
			        nbSamples: options.nbSamples,
			        maxWidth: options.maxWidth,
			        maxHeight: options.maxHeight
			    });
			    if (segmentClips && segmentClips.length > 0) {
			        try {
						const blob = await clipper.imageBitmapToBlob(segmentClips[0].img);
						const frameData = {
							img:blob,
							width:segmentClips[0].img.width,
							height:segmentClips[0].img.height,
							locationTime:time,
			                startTime: segment._startTime,
							endTime:segment._endTime
			            };
			            pidData.clipInfo.push(frameData);
						if (type){
			            await localforage.setItem(pidKey, pidData);
						};
						return frameData;
			        } catch (error) {
			            console.error('保存缩略图缓存失败:', error);
						return false;
			        }
			    };
				return false;
			},
			imageBitmapToBlob: async function(imageBitmap, quality = 0.8, type = 'image/jpeg') {
				const canvas = $('<canvas>')[0];
				canvas.width = imageBitmap.width;
				canvas.height = imageBitmap.height;
				const ctx = canvas.getContext('2d');
				ctx.drawImage(imageBitmap, 0, 0);
				return new Promise((resolve) => {
					canvas.toBlob((blob) => {
						resolve(blob);
					}, type, quality);
				});
			},
			preloadThumbnails: async function(pid, m3u8Info) {
				const startTime = Date.now(); 
				const totalSegments = m3u8Info.length;
				const totalDuration = m3u8Info[totalSegments-1]._endTime;
				const startTime2=formatDate(startTime,false,"HH:mm");
				console.log(startTime2 +' 开始缩略图预加载。');
				const pidKey = `video_${pid}`;
				let pidData =  await clipper.getPidData(pidKey);
				if (pidData.preloaded) {
					console.log(`缩略图已预加载过，跳过重复加载。`);
					return;
				};
				let totalCount = 0;
				let successCount = 0;
				let failCount = 0;
				let timePoints = [];
				if(totalSegments <= 50) {
					timePoints = m3u8Info.map(seg => seg._startTime + seg._duration/2);
				} else {
					const interval = totalDuration / 50;
					for(let i = 0; i < 50; i++) {
						timePoints.push(i * interval);
					};
				};
				totalCount = timePoints.length; // 设置总请求数
				let delay = 1000;
				for(const time of timePoints) {
					setTimeout(async () => {
						try {
							const segment = await this.findSegmentByTime(time, pidKey);
							if(segment) {
								const frameData = await this.getClip(segment,pidKey,time,false, {
									nbSamples: 1,
									maxWidth: 320,
									maxHeight: 180
								});
								if(frameData && frameData.img instanceof Blob) { 
									pidData.clipInfo.push(frameData);
								};
								successCount++;
							};
						} catch(e) {
							console.error('预加载缩略图失败:', e);
							failCount++;
						} finally {
							if(successCount + failCount === totalCount) {
								clipper.getPidData(pidKey).then(function(existingData) {
								pidData.preloaded = true ;
									pidData = {
										...existingData,
										...pidData,
										clipInfo: [...(existingData.clipInfo || []), ...pidData.clipInfo]
									};
									localforage.setItem(pidKey, pidData);
								});
								const endTime = Date.now(); 
								const totalTime = (endTime - startTime) / 1000; 
								console.log(`缩略图预加载完成: 总请求数=${totalCount}, 成功数=${successCount}, 失败数=${failCount}, 总耗时=${totalTime.toFixed(2)}秒。`);
							};
						}
					}, delay);
					delay += 1000;
				};
			},
			getPreview:async function(pid,time,type) {
				const pidKey = `video_${pid}`;
				const segment = await clipper.findSegmentByTime(time,pidKey);
				if (!segment) {
					console.log(time+'s 视频片段获取失败。');
					return false;
				};
				const thumb = await clipper.getClip(segment,pidKey,time,true,{
					nbSamples: 1,
					maxWidth: 320,
					maxHeight: 180
				});
				if(thumb && thumb.img instanceof Blob) { 
					let left=0;
					let top=0;
					let time_left=0;
					let time_top=0;
					if(type) {//DPlayer
						time_left = $('.dplayer-bar-time').offset().left;
						left = time_left - thumb.width/2 +19;
						top = $('.dplayer-bar-time').offset().top - thumb.height - 8;
					} else{
						time_left = $('.bar-progress [rel="time_text"]').offset().left;
						left = time_left - thumb.width/2 +15;
						const progressRect = $('.progress-loaded')[0].getBoundingClientRect();
						top = progressRect.top - thumb.height - 35; //固定在进度条上方20px
					};
					if(left < 0) {//边界检测 - 水平方向
						left = time_left - 20; //向右移动
					} else if(left + thumb.width > window.innerWidth) {
						left = time_left - thumb.width + 20; //向左移动
					};
					const imgUrl = URL.createObjectURL(thumb.img);
					$('#thumbPreview').html('').append(`<img src="${imgUrl}">`)
						.css({
							left: left+ 'px',
							top: top+ 'px',
							display: 'block'
					});
					console.log(time+'s 缩略图获取成功。');
					return true;
				};
				return false;
			},
		};
	}();
	
	var offline = function(){	
		return {	
			getSign:function(key,save_name){
				return new Promise(function(resolve, reject){
					if (/^\w+=/.test(key)){
						resolve(key);
						return;
					};
					
					var UserID = GM_getValue('115ID') || '';
					var cid = G.get('diy_folder')? GM_getValue('offlineFolder'):'';
					var title = save_name? save_name:'';
					GM_xmlhttpRequest({
						method: 'GET',
						url: sign_url,
						responseType: 'json',
						headers: {
							"User-Agent": UA,
							Origin: "https://115.com",
						},
						onload: function(result){
							if (result.responseText.indexOf('html')!= -1) {
								toastr.error('请先登录115网盘账号！','离线任务添加失败。');
								setTimeout(function(){
									var a = confirm('立即打开115网盘登录页面？');
									if (a){
										GM_openInTab('https://115.com/?mode=login',false);
									};
								}, 3000);
								return;
							};
							var data = {
								uid: UserID,
								sign: result.response.sign,
								time: result.response.time,
								wp_path_id: cid,
								savepath: title
							};
							
							if($.isPlainObject(key)){
								var value=$.param($.extend(data,key));
							
							}else{
								var value=$.param(data)+`&url=${key}`;
							};
							resolve(value);
						},
						onerror: function(error){
							reject(error);
						},
					});
				});
			},

			getData:function(herf,key,save_name){
				return offline.getSign(key,save_name).then(function(value){
					return new Promise(function(resolve, reject){
						GM_xmlhttpRequest({
							method: 'POST',
							data: value,
							url: herf,
							responseType: 'json',
							headers: {
								
								"User-Agent": UA,
								"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
								"Accept": "application/json, text/javascript, */*; q=0.01",
								Origin: "https://115.com",
								"X-Requested-With": "XMLHttpRequest"
							},
							onload: function(result){
								resolve(result.response);
							},
							onerror: function(error){
								reject(error);
							},
						});
					});
				});
			},
	
			del:function(id){
				if(id == 0){
					alert('网盘根目录,不可删除！');
					return ;
				};
				var Link = 'http://115.com/?ct=lixian&ac=get_id';
				AjaxCall(Link,function(error,htmlTxt){
					var json = JSON.parse(htmlTxt);
					if(json.cid == id){
						alert('云下载（离线保存默认文件夹），不可删除！');
						return ;
					};
					
					var del_url ='https://webapi.115.com/rb/delete';
					var key = 'fid='+id;
					offline.getData(del_url,key).then(function(json){
						
						if(json.state){
							var a = confirm('删除成功，可从回收站还原。是否立即关闭本页面？');
							if (a){
								
								window.open('','_self');
								window.close();
							};
						} else {
							alert('删除失败:'+json.error);
						};
					});
				});
			},
			
			setStar:function (fid,n){
				var txt = {'1':'设置','0':'取消'}[n];
				var star_url ='https://webapi.115.com/files/star';
				var key = `file_id=${fid}&star=${n}`;
				offline.getData(star_url,key).then(function(json){
					
					json.state ? alert(txt+'星标成功！') : alert(txt+'星标失败:'+json.error);
				});
			},

			newName:function (fid,name){
				var suffix = name.match(/\.\w{2,4}$/)[0];
				
				var name2 = name.replace(suffix,'');
				var a = prompt('请输入新的文件名：\n（不包含后缀 '+suffix+'）',name2);
				if (a!=null && a!=""){
					var edit_url ='https://webapi.115.com/files/edit';
					var key = `fid=${fid}&file_name=${a+suffix}`;
					offline.getData(edit_url,key).then(function(json){
						console.log('重命名结果:');
						console.log(json);
						if(json.state) {
							alert('重命名成功！现文件名为：\n'+json.file_name);
						} else {
							alert('重命名失败！原因：'+json.error);
						};
					});
				};
			},
			
			search:function (name,cid,callback){
				var title = new Array();
				title[0] = name.replace(/(\.|-|_)?(f?hd|sd|720p|1080p|full|mp4|avi|mkv|wmv|rmvb|rm|flv|f4v)/gi,' ');
				title[1] = title[0].replace(/\/|&|-|\.|\?|=|:|#|_|@/g,' ');
				title[2] = '.';			
			
				var a = 0;
				function add2(){
					if(a == 3){
						console.log('该文件夹无视频文件。');
						callback(false);
						return;
					};
					var searchLink = 'https://webapi.115.com/files/search?cid='+cid+'&search_value='+encodeURIComponent(title[a])+'&type=4';
					AjaxCall(searchLink,function(error,htmlTxt){
						
						if (typeof htmlTxt == 'undefined'){
							a++;
							add2();
						}else{
							var json = JSON.parse(htmlTxt);
							if(a == 2 && json.folder.name == '云下载'){
								callback(false);						
								return;
							};
							
							var num= json.count;
							if(json.count > 0){
								for(var z=0; z<json.data.length; z++){
									if(json.data[z].s < 5000000) num--; 
								};
								if(num > 0){
								for(var i=0; i<json.data.length; i++){
									var $dataEh = json.data[i];
									var video = {};
									video['name'] = name2($dataEh.n);
									video['pid'] = $dataEh.pc;
									video['cid'] = $dataEh.cid;
									video['fid'] = $dataEh.fid;
									video['size'] = change($dataEh.s);
									video['sha'] = $dataEh.sha;
									video['time'] =$dataEh.play_long;
									if($dataEh.s < 5000000) continue;
									
									callback(true,video,i+1,num);
									console.log('第'+a+'次搜索结果'+i+':'+$dataEh.n+' '+video.size);
									if(i == 2){
										return;
										};
									};
								};
							};
							if (num == 0){

								a++;
								add2();
							};
						};
					});
				};
				add2();
			},
			
			check:function(link,link2,one){
				if(document.hidden){
					GM_setValue('noTimeOut',true);
					toastr.options.timeOut = 0;

				}else{
					GM_setValue('noTimeOut',false);
					toastr.options.timeOut = 12000;
				};
				
				var c = 1;
				var retry = false;
				var txt2 = '5秒后自动重试，请稍等。';
				function add(retry,txt2){
					if(c == 6){
						console.log('离线结果查询异常。离线任务数量过多，请清空后再试。');
						toastr.warning('离线任务数量过多，请清空后再试。', '离线结果查询异常！');						
						return;
					};
					
					var key = '';
					var lists_url2 = lists_url+'&page='+c;
					console.log('离线任务数据地址：'+lists_url2);
					offline.getData(lists_url2,key).then(function(json){
						console.log('离线任务列表第'+c+'页:');
						console.log(json);
						if(json.state){
							var dataEl=searchTask(json,link);
							if (dataEl){
								var name = dataEl.del_path==''? dataEl.name:dataEl.del_path.slice(0,-1);
								var a_del = `&nbsp;&nbsp;<a target="_blank" class="delTask" data=${dataEl.info_hash} href="javascript:void(0);" style="color:blue;" title="删除该离线任务">删除任务</a>`;
								if (dataEl.status != -1){
									if (dataEl.move == -1){
										toastr.warning('空间不足，请到115扩容', '离线下载异常！');
										return;
									};
									var down_result = dataEl.percentDone.toFixed(0);
									var cid = dataEl.file_id || 0;
									if (down_result >= 99 && cid != 0){
										
										var txt = `文件(夹)名：${name}，大小：${change(dataEl.size)}。`;
										resultMark(link2,3);
										if(one){
											console.log(txt+'离线下载已完成。');
											return;
										};
										
										if (show_result && !retry){
											toastr.success(txt+a_list+a_del, '离线下载已完成',{timeOut:5000});
										};
										
										if (G.get('open_search')) {
											offline.search(dataEl.name,cid,function(search_result,video,j,num) {
												if (search_result) {
													if (G.get('search_result')) {
														var videoTxt = JSON.stringify(video);
														var txt = `文件名：${video.name}，大小：${video.size}，时长：${tranTime(video.time)}。`;
														var h1 = `<br><a target="_blank" class="115play" data=${videoTxt} href="javascript:void(0);" style="color:blue;" title="播放该视频">播放</a>`;
														var h2 = `&nbsp;&nbsp;<a target="_blank" class="115down" data=${videoTxt} one="1" href="javascript:void(0);" style="color:blue;" title="下载该视频">下载</a>`;
														var h3 = `&nbsp;&nbsp;<a target="_blank" class="115del" data=${videoTxt} href="javascript:void(0);" style="color:blue;" title="删除该视频文件夹">删除</a>`;
														var h4 = `&nbsp;&nbsp;<a target="_blank" class="115newName" data=${videoTxt} href="javascript:void(0);" style="color:blue;" title="重命名该视频">重命名</a>`;
														var h5 = `&nbsp;&nbsp;<a target="_blank" class="openFolder" data=${cid} href="javascript:void(0);" style="color:blue;" title="查看所属文件列表">查看</a>`;
														toastr.success(txt+h1+h2+h3+h4+h5,`发现第 ${j} 个视频（共 ${num} 个）`);
													};
													
													if (G.get('open_Popup') && j==1){
														setTimeout(function(){
															var type = '115play';
															palyData(video,type);
														}, 500);
													};
													
												}else{
													if( dataEl.move == 2 || dataEl.move == 0 || dataEl.status == 0){
														var txt = '离线数据取回网盘中。';
													}else{
														var txt = '未发现任何视频文件。';
													};
													var h1 = `<br><a target="_blank" class="openFolder" data=${cid} href="javascript:void(0);" style="color:blue;" title="点击打开所属文件列表">打开文件列表</a>`;
													toastr.warning(txt+txt2+h1, '视频搜索无结果！');
													
													if (!retry){
														setTimeout(function(){
															retry = true;
															txt2='';
															toastr.clear();
															console.log('重试搜索结果:');
															add(retry,txt2);
														}, 5000);
													};
												};
												
												
											});
										};
										
									}else if(show_result) {
										resultMark(link2,4);
										if(one){
											console.log(`文件(夹)名：${name},已离线下载 ${down_result}%。`);
											return;
										};
										var txt = `文件(夹)名：${name}，下载进度为：<span style="color:purple;">${down_result}%</span>。`;
										toastr.warning(txt+a_list+a_del, '离线下载中...');
									};
								}else if(show_result) {
									resultMark(link2,4);
									if(one){
										console.log(`文件(夹)名：${name},离线下载失败。`);
										return;
									}else if(dataEl.err == 10016){
										var txt = '文件含违规内容，已自动拦截。';
									}else{
										var txt = '未知原因，请到115网盘查看。';
										var a_del = '';
									};
									toastr.error(txt+a_list+a_del,'离线下载失败！',{timeOut:8000});
									return;
								};
								
							}else{
								console.log('第'+c+'页查询失败，无匹配数据');
								if(c == json.page_count) {
									console.log('离线链接对比异常，已搜索所有离线列表页面，无返回结果。');
									toastr.warning('搜索参数错误。', '离线结果查询异常！',{timeOut:5000});										
									return;
								};
								c++
								add();
							};
						}else{
							toastr.error('查询离线结果失败。','服务器错误！');
							return;
						};
					});
				};
				add(retry,txt2);
			},
			
			addButton:function(){
				$('[href]').each(function(){
					var url = $(this).attr('href');
					var reg1 =/\.(torrent|rar|zip|7z|mp4|rmvb|mkv|avi)$/i;
					var $El = $(this).parent().filter('li,td,th,:header').find('[Searched]');
					
					if ( (!down_reg.test(url) && !reg1.test(url)) || $(this).is('[Searched]') || $El.length>1
						|| ($El.length=1 && url.indexOf($El.attr('Searched')) != -1)){
								
						return;	
					};
					
					
					if (down_reg.test(url)){
						$(this).attr('Searched',url.split(':')[0]);
					}else if(/torrent$/i.test(url)){
						$(this).attr('Searched','torrent');
					}else{
						$(this).attr('Searched','other');
					};
					
					var link = getRightUrl(url);
					if(repeat(link)){
						return;
					};
					
					$(this).css('display','inline-block');
					$(this).after('<img src="https://cdn.jsdelivr.net/gh/zxf10608/JavaScript/icon/115logo.ico" class="115offline" data-href='+link+' style="z-index:9123456789;display:inline-block;cursor:pointer;margin:0px 5px 2px;border-radius:50%;border:0px;vertical-align:middle;outline:none!important;padding:0px!important;height:20px!important;width:20px!important;left:0px!important;top:0px!important;" title="使用115网盘离线下载，右键复制地址\n'+link+'">');
				});
			},
			
			addLink:function(){
				$('a,button,span,li,[value]').each(function(){
					var reg1 =/[\/\.\?\*\+\-=_:&#@!%]{1}([a-f0-9]{40}|[a-z2-7]{32})(?!\w)/i;
					var reg2 =/[a-z]{40}|[a-z]{32}/i;
					
					if ($(this).next().addBack().is('[Searched],[href*="google"]') 
						|| $(this).find('img').length>0){			
						return;	
					};
					

					var url = getAttribute(this);
					if(url.length>0){
						for(var i=0;i<url.length;i++){
							if(down_reg.test(url[i]) || (reg1.test(url[i]) && !reg2.test(url[i].match(reg1)[1]))){
								
								
								if(down_reg.test(url[i])){
									var value = url[i].split(':')[0];
									var templink = url[i];
								}else{
									var value = 'magnet';
									var templink = 'magnet:?xt=urn:btih:' + url[i].match(reg1)[1];
								};
								var link = getRightUrl(templink);
								if(repeat(link)){
									return;
								};
								$(this).attr({'Searched':value,'target':'_blank','style':'display:inline-block;'});
								
								
								$(this).after('<img src="https://cdn.jsdelivr.net/gh/zxf10608/JavaScript/icon/115logo.ico" class="115offline" data-href='+link+' style="z-index:9123456789;display:inline-block;cursor:pointer;margin:0px 5px 2px;border-radius:50%;border:0px;vertical-align:middle;outline:none!important;padding:0px!important;height:20px!important;width:20px!important;left:0px!important;top:0px!important;" title="使用115网盘离线下载2，右键复制地址\n'+link+'">');
								return;
							};
						};
					};
				});
			},
			
			addSelect:function(){
				if($('.115offline').length<3) return;
			
				$('.115offline:not([Sed])').each(function(){
					$(this).attr('Sed',1);
					var url=$(this).data('href');
					$(this).after('<input type="checkbox" class="115select" value='+url+' title="长按shift键，连续选择" style="z-index:9123456789;display:inline-block;cursor:pointer;height:16px!important;width:16px!important;margin:0px 2px 1px;border-radius:50%;border:0px;vertical-align:middle;outline:none!important;padding:0px!important;left:0px!important;top:0px!important;" />');
				});
				
				var sel=$('.115offline').length>10 ? $('.115select:eq(-1),.115select:eq(0)'):$('.115select:eq(-1)');
				sel.each(function(){
					if($(this).is('[batched]')) return;
					$(this).attr('batched',1);
					$(this).after('<img src="https://cdn.jsdelivr.net/gh/zxf10608/JavaScript/icon/batch_down00.png" class="115offline_batch" style="z-index:9123456789;display:inline-block;cursor:pointer;margin:0px 1px 2px;border:0px;vertical-align:middle;outline:none!important;padding:0px!important;height:23px!important;width:23px!important;left:0px!important;top:0px!important;" title="使用115网盘批量离线下载所选地址，右键可全选等">');
					$(this).parent().css('overflow','visible');
				});
			},

		};
	}();
	
	$(document).ready(function(){
		$(window).resize(function(){
	
			if(localHref.indexOf('http://videotsgo.115.com') != -1||localHref.indexOf('https://115.com/web/lixian/') != -1){	
				autobox();
			}else if(localHref.indexOf('https://115.com/') != -1){
				list_menu();
			};
		});
		
		$(document).on('visibilitychange click',function(e){
			if(e.type == 'click'){
				$('.115menu').hide();
				return;
			};
		
			var isHidden = e.target.hidden;
			if (localHref.match(/^https?:\/\/(115\.com\/web\/lixian)|(videotsgo\.115\.com)\/$/) != null && 
				G.get('Tab_ing') && !document.pictureInPictureElement){
				isHidden ? $('video')[0].pause():$('video')[0].play();
			};
			
			var noTimeOut=GM_getValue('noTimeOut') || '';
			if (isHidden){
				
			}else if(noTimeOut){
				GM_setValue('noTimeOut','');
				setTimeout(function(){ 
					toastr.clear();
				}, 12000);
				
			}else{
			
			};
		});
		
		$('body').on('click mouseenter mouseleave','.openPiP',function(e){
			if(e.type == 'click'){
				enterPiP($('video')[0]);
			}else if(e.type == 'mouseenter'){
				$(this).css('opacity', 1);
			}else if(e.type == 'mouseleave'){
				$(this).css('opacity', 0.7);
			};	
			return false;
		});
		
		$('body').on('click','.transcode_show,.transcode_fast',function(){
			if (!clickOne($(this))) return;
			var video = JSON.parse($(this).attr('data'));
			if($(this).is('.transcode_show')){
				var link = 'https://115vod.com/?pickcode='+video.pid+'&share_id=0';
				GM_openInTab(link,false);
			}else{
				transcod_fast(video);
			};
			return false;
		});
		
		$('body').on('click','.115play,.115origin,.Dp,.Local',function(){
			if (!clickOne($(this))) return;
			var type = $(this).attr('class').replace(/name\s?/g,'');
			
			if ($(this).is('[data]')){ 
				var video = JSON.parse($(this).attr('data'));
			}else{
				var $El = $(this).parents('li');
				var video = {};
				video['name'] = name2($El.attr('title'));
				video['pid'] = $El.attr('pick_code');
				video['cid'] = $El.attr('cid');
				video['fid'] = $El.attr('file_id');
				video['size'] = change($El.attr('file_size'));
				video['sha'] = $El.attr('sha1');
			};
			palyData(video,type);
			return false;
		});
		
		$('body').on('click','.115down',function(){
			if (!clickOne($(this))) return;
			
			if ($(this).is('[data]')){ 
				var file = JSON.parse($(this).attr('data'));
				var pid = file.pid;
				var fid = file.fid;
				var sha = file.sha;
				var cid = file.cid || '';
				var name = file.name;
			}else{
				var $El = $(this).parents('li');
				var pid = $El.attr('pick_code');
				var fid = $El.attr('file_id');
				var sha = $El.attr('sha1');
				var cid = $El.attr('cate_id') || '';
				var name = $El.attr('title');
			};
			
			if(cid==''|| $(this).is('[one]')){
				var key={pc:pid,fid:fid};
				download(key).then(function(data){
					if(data[0]){
						GM_openInTab(data[0]);
						if(G.get('show_sha')){
							setTimeout(function(){
								prompt('文件下载中，校验码(SHA1)为：',sha);
							}, 1000);
						};
					}else{
						toastr.warning(data[1],'下载失败!');
					};
				});
			}else{
				folderList(cid,name,99).then(function(data){
					if(data[0]){
						batchList(data[0],true);
					};
				});
			};
			return false;
		});

		$('body').on('click','.delTask',function(){
			var key = {'hash[0]':$(this).attr('data')};
			offline.getData(task_del,key).then(function(json){
				console.log('删除离线任务结果:');
				console.log(json);
				json.state ? alert('离线任务删除成功！') : alert('离线任务删除失败:'+json.error);
			});
			return false;
		});

		$('body').on('click','.115extract',function(){
			if (!clickOne($(this))) return;
			
			if(self!=top){
				var $sed=$('li.selected');
			}else{
				var $sed=$('iframe[name="wangpan"]').contents().find('li.selected');
			};
			
			if($sed.length>30){
				toastr.warning('单次选中数量限 <span style="color:red;">2-30</span> 个。','批量操作无效！',{timeOut:6000});
				return;
			};
			
			var p_id=$sed.attr('p_id');
			var info = [];
			$sed.each(function(e){
				var name=$(this).attr('title');
				var cid1=$(this).attr('cate_id');
				info.push({cid:cid1,n:name});
			});
			
			var p_id2 = prompt('请输入目标文件夹的cid值：\n   ※ 获取cid值方法：打开需要保存到的网盘文件夹，复制地址栏中"cid="后面的一串数字，以"&"截止，如https://115.com/?cid=012345678912345678&...，cid值则为 012345678912345678。该项不填或填无效值则保存至当前文件夹。※'
					  ,p_id);
			if (/^(\d{17,19}|0)$/.test(p_id2)){
				p_id=p_id2;
				toastr.success('输入cid值成功，将保存至cid值为：'+p_id+' 的文件夹。');
			}else if(p_id2==''){
				toastr.success('未输入cid值，保存至当前文件夹。');
			}else if(p_id2==null){
				toastr.warning('批量提取操作已取消！');
				return;
			}else{
				toastr.warning('请重新点击输入，该值除根目录为 0 外，其他文件夹均为17至19位纯数字！','文件夹cid值无效！');
				return;
			};
			
			setTimeout(function(){
				extractList(p_id,info);
			},1000);
			
			return false;
		});		
		
		$('body').on('click','.115M3Ulist,.115down_batch',function(){
			if (!clickOne($(this))) return;
			
			var M3U=$(this).is('.115M3Ulist')? true:false;
			if(self!=top){
				var $sed=$('li.selected');
			}else{
				var $sed=$('iframe[name="wangpan"]').contents().find('li.selected');
			};
			
			if((!M3U && $sed.length<2) || $sed.length>50){
				toastr.warning('单次选中数量限 <span style="color:red;">2-50</span> 个。','批量操作无效！',{timeOut:6000});
				return;
			};
			
			var end=false;
			var info = [];
			$sed.each(function(){
				var pid=$(this).attr('pick_code');
				var fid=$(this).attr('file_id');
				var name=$(this).attr('title');
				var sha=$(this).attr('sha1');
				if(M3U && !$(this).is(':has(.duration):not([file_mode="4"])')){
				
					return;
				};
				
				if($(this).is('[file_type="0"]')){
					end=true;
					toastr.warning('文件夹暂不支持批量操作，请取消选中。','批量操作无效！',{timeOut:6000});
					return false;
				};
				info.push({pc:pid,fid:fid,n:name,sha:sha});
			});
			if(end)return;
			if(M3U&&info.length==0){
				toastr.warning('未选中任何视频文件。','批量操作无效！',{timeOut:6000});
				return;
			};
			
			var key={count:info.length,data:info};
			if (M3U){ 
				batchList(key);
			}else{
				batchList(key,true);
			};
			return false;
		});
		
		$('body').on('click','.115select',function(e){
			if(e.shiftKey){
				var first=$('.115select').index($('.115select:checked').first());
				var me=$('.115select').index($(this));
				var last=$('.115select').index($('.115select:checked').last());
				var Min = Math.min(first,me,last);
				var Max = Math.max(first,me,last);
				
				for(var i=Min;i<=Max;i++){
					$('.115select').eq(i).prop('checked',true);
				};
			};
		});
		
		$('body').on('click','.115del,.115newName',function(){
			if (!clickOne($(this))) return;
			
			var video = JSON.parse($(this).attr('data'));
			var title = video.name;
			var folderID = video.cid;
			var videoID = video.fid;
			if($(this).is('.115del')){
				var a = confirm('确认删除 '+title+' 视频所属文件夹？');
				if (a){
					offline.del(folderID);
				};
			}else{
				offline.newName(videoID,title);
			};
			return false;
		});
		
		$('body').on('click','.openList:not([click="1"]),.openFolder:not([click="1"])',function(){
			$(this).attr('click', '1');
			if($(this).is('.openList')){
				var txt='tab=offline';
			}else{
				var fID=$(this).attr('data');
				var txt='cid='+fID+'&offset=0';
			};
			GM_openInTab('https://115.com/?'+txt+'&mode=wangpan',false);
			return false;
		});
		
		$('body').on('contextmenu','.115offline,.115offline_batch',function(e){
				$('.115menu').css({left:e.pageX+'px',top:e.pageY+'px'});
				$('.115menu').show();
			var link=$(this).data('href') || '';
			if($(this).is('.115offline_batch')){
				$('.115menu [class^="right_menu0"]').show();
				$('.115menu [class^="right_menu1"]').hide();
			}else if(/^magnet/i.test(link)){
				$('.115menu').attr('data-href',link);
				$('.115menu [class^="right_menu1"]').show();
				$('.115menu [class^="right_menu0"]').hide();
			}else{
				$('.115menu').hide();
				GM_setClipboard(link);
				toastr.success('下载地址复制成功！');
			};
			return false; 
		});
		
		$('body').on('click','[class^="right_menu0"]',function(){
			if ($(this).is('.right_menu00')){
				$('.115select').prop('checked',true);
			}else if($(this).is('.right_menu01')){
				$('.115select').each(function(){
					if($(this).prop('checked')){
						$(this).prop('checked',false);
					}else{
						$(this).prop('checked',true);				
					};
				});
			}else{
				if($('.115select:checked').length==0){
					toastr.warning('复制失败，未选中任何链接！');
					return;
				};
				var urls = [];
				$('.115select:checked').each(function(){
					urls.push($(this).attr('value'));
				});
				GM_setClipboard(urls.join('\r\n'));
				toastr.success(urls.length+' 个下载地址复制成功！');
			};
			return false;
		});
		
		$('body').on('click','[class^="right_menu1"]',function(){
			var link=$(this).parents('.115menu').data('href');
			var hash=link.match(/[a-f0-9]{40}/i)[0].toUpperCase();
			if($(this).is('.right_menu11')){
				GM_setClipboard(link);
				toastr.success('下载地址复制成功！');
			}else if($(this).is('.right_menu12')){
				GM_openInTab(`https://itorrents.org/torrent/${hash}.torrent`,false);
			}else if($(this).is('.right_menu13')){
				GM_openInTab(`https://btcache.me/torrent/${hash}`,false);
			};
			return false;
		});
		$('body').on('click','.115offline',function(e){
			if (!clickOne($(this))) return;	
			var link = $(this).data('href');
		
			var save_name ='';	
			
			offline.getData(add_url,link,save_name).then(function(json){
				console.log('离线任务添加结果:');
				console.log(json);
				var errNum = json.errcode || json.error_code || '';
				var link2=[{'url':link}];
				
				if(json.state){
					if (show_result){
					var txt = '10秒后显示离线结果。';
					}else{
						var txt = link
						if (G.get('open_List')){
							setTimeout(function(){
								GM_openInTab('https://115.com/?tab=offline&mode=wangpan',false);
							}, 2000);
						};
					};
					
					resultMark(link2,1);
					toastr.info(txt,'离线任务添加成功。',{timeOut:10000});
					setTimeout(function(){
						offline.check(link,link2);
					}, 10000);
				} else if (errNum == 10008){
					toastr.warning('任务已存在，无需重复添加。','离线任务添加无效!',{timeOut:5000});
					if (G.get('open_List')){
						setTimeout(function(){
							GM_openInTab('https://115.com/?tab=offline&mode=wangpan',false);
						}, 2000);
					};
					resultMark(link2,1);
					offline.check(link,link2);
				} else if (errNum == 911){
					toastr.warning('账号异常，请验证账号。','离线下载失败！',{timeOut:5000});
					setTimeout(function(){
						verify();
					}, 1000);
					
				} else {
					resultMark(link2,2);
					toastr.warning(json.error_msg,'离线任务添加失败!',{timeOut:12000});
				};
				console.log('离线链接:'+link+' 添加结果:'+json.state+' 原因:' +json.error_msg);
			}, function(error) {
				toastr.error('服务器繁忙，请稍后再试。','离线任务添加异常!');
				console.log(error);
			});
			return false;
		});
		
		$('body').on('click','.115offline_batch',function(){
			var l=$('.115select:checked').length;
			if (l<10 && !clickOne($('.115offline_batch'))){
				return;
			}else if(l<2 || l>100){
				toastr.warning('单次选中数量限 <span style="color:red;">2-99</span> 个。','批量离线操作无效！',{timeOut:6000});
				return;
			}else if(l>10){
				toastr.info('所选中地址较多，服务器需要较长时间响应，请稍等10s以上，未弹出结果前勿重复点击。','温馨提示。',{timeOut:10000});
				if(!clickOne($('.115offline_batch'),10000)) return;
			};
			
			var links = {};
			$('.115select:checked').each(function(e){
				links['url['+e+']']=$(this).attr('value');
			});
			
			offline.getData(add_urls,links).then(function(json){
				console.log('批量离线任务添加结果:');
				console.log(json);
				var errNum = json.errcode || json.error_code || '';
				
				if(json.state){
					var s=0;
					var e=0;
					var f=0;
					var success_result=[];
					var exist_result=[];
					var all_result=[];
					var fail_result=[];
					for (var n=0; n<json.result.length; n++){
						var dataEl=json.result[n];
						if(dataEl.state){
							s++
							success_result.push(dataEl);
							all_result.push(dataEl);
						}else if(dataEl.errcode==10008){
							e++
							exist_result.push(dataEl);
							all_result.push(dataEl);
						}else{
							f++
							fail_result.push(dataEl);
						};
					};
					
					var txt2 = '10秒后显示离线结果。';
					var error=fail_result.length>0? fail_result[0].error_msg:'任务已存在';
					if(f+e==json.result.length){
						var txt1 = `有 <span style="color:red;">${f+e}</span> 个任务创建失败，原因：${error}。`;
						toastr.warning(txt1+a_list,'批量离线任务添加失败。',{timeOut:10000});
					}else if(f+e>0){
						if (e>0) txt2 = '新建任务'+txt2;
						var txt1 = `有 <span style="color:purple;">${s}</span> 个任务创建成功。有 <span style="color:red;">${f+e}</span> 个任务创建失败，原因：${error}。`;
						toastr.info(txt1+txt2+a_list,'批量离线任务添加成功。',{timeOut:10000});
					}else{
						var txt1 = `有 <span style="color:purple;">${s}</span> 个任务创建成功。`;
						toastr.info(txt1+txt2+a_list,'批量离线任务添加成功。',{timeOut:10000});
					};

					var success_links=resultMark(success_result,1);
					var exist_links=resultMark(exist_result,1);
					resultMark(fail_result,2);
					
					if (show_result){
					
					};
					
					if(s+e>20){
						toastr.warning('离线数量大于20，请自行到115查看。'+a_list,'未查询离线结果！',{timeOut:6000});			
						return;
					};
					
					if(s>0){;
						setTimeout(function(){
							for (let h = 0; h < s; h++){
								if(all_result[0].url==success_links[h]){
									var one=false;
								}else{
									var one=true;
								};
								var url2=[{'url':success_links[h]}];
								offline.check(success_links[h],url2,one);
							};
						}, 10000);
					};
					if(e>0){
						for (let i = 0; i < e; i++){
							if(all_result[0].url==exist_links[i]){
								var one=false;
							}else{
								var one=true;
							};
							var url2=[{'url':exist_links[i]}];
							offline.check(exist_links[i],url2,one);
						};
					};
					
					if (f!=json.result.length && G.get('open_List')){
						setTimeout(function(){
							GM_openInTab('https://115.com/?tab=offline&mode=wangpan',false);
						}, 2000);
					};
				
				} else if (errNum == 911){
					toastr.warning('账号异常，请验证账号。','批量离线下载失败！',{timeOut:5000});
					setTimeout(function(){
						verify();
					}, 1000);
				} else {
					toastr.warning(json.error_msg+a_list,'批量离线任务添加失败!',{timeOut:12000});
				};
			
			}, function(error) {
				toastr.error('服务器繁忙，请稍后再试。','批量离线任务添加异常!');
				console.log(error);
			});
			
			return false;
		});
		
		if(G.get('offline_Down') && localHref.match(/115(vod)?\.com/) == null){
				right_menu();
			var time=300;
			if(G.get('fuzzy_find')){
				setTimeout(function(){
					offline.addLink();
				},time+100);
			};
				var time1 = setInterval(function(){
					offline.addButton();
				/* if($('.115offline').length>=30){
					clearInterval(time0);
				}; */
			}, time+200);
				setTimeout(function(){
					offline.addSelect();
					$('.mag1').remove();
					clearInterval(time1);
				
						
				
				if(localHref.match(/av/) != null){
						$('.movie td').removeAttr('onclick');
					};
				
			},time*10);
				
		};
		
	});
	
})();
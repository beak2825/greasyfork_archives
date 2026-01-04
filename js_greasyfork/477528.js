// ==UserScript==
// @name              🔥全网VIP视频解析
// @homepage          http://jsxl.pro
// @version           2.2.0
// @updateDesc        修复解析失败问题&新增下载接口&优化UI
// @description       🔥新版解析接口2023/09/16，全网VIP视频免费观看,放心使用，支持：腾讯、爱奇艺、优酷、芒果、Bilibili、乐视等其它网站(如有未支持的平台，欢迎反馈)。去广告防ios爱奇艺自动跳转
// @icon              https://mp-af307268-1b8a-482a-b75a-b6e98b125742.cdn.bspapp.com/system/logo/video_logo.png
// @namespace        全网VIP视频解析 
// @author            wt
// @include		   	  /\/\?url=http/
// @include		   	  /\/\?v=http/
// @match             *://*.youku.com/*
// @match             *://*.iqiyi.com/*
// @match             *://*.le.com/*
// @match             *://*.v.qq.com/*
// @match             *://*.mgtv.com/*
// @match             *://*.sohu.com/*
// @match             *://film.sohu.com/*
// @match             *://*.bilibili.com/*
// @include			  *://blog.luckly-mjw.cn/*
// @include		      *://tools.thatwind.com/*
// @include			  *://tools.bugscaner.com/*
// @require           https://cdn.bootcdn.net/ajax/libs/jquery/3.2.1/jquery.min.js
// @require			  https://lib.baomitu.com/hls.js/0.15.0-alpha.2/hls.min.js?id=12
// @require			  https://lib.baomitu.com/dplayer/1.25.0/DPlayer.min.js
// @resource videocss https://lib.baomitu.com/dplayer/1.25.0/DPlayer.min.css
// @connect			  *
// @run-at 			  document-start
// @grant             unsafeWindow
// @grant             GM_addStyle
// @grant             GM_openInTab
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_getResourceText
// @grant             GM_xmlhttpRequest
// @charset		      UTF-8
// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/477528/%F0%9F%94%A5%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/477528/%F0%9F%94%A5%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

const util = {
	findTargetElement: (targetContainer,maxTryTime=30)=> {
		const body = window.document;
		let tabContainer;
		let tryTime = 0;
		let startTimestamp;
		return new Promise((resolve, reject) => {
			function tryFindElement(timestamp) {
				if (!startTimestamp) {
					startTimestamp = timestamp;
				}
				const elapsedTime = timestamp - startTimestamp;
				if (elapsedTime >= 500) {
					console.log("查找元素：" + targetContainer + "，第" + tryTime + "次")
					tabContainer = body.querySelector(targetContainer)
					if (tabContainer) {
						resolve(tabContainer)
					} else if (++tryTime === maxTryTime) {
						reject()
					} else {
						startTimestamp = timestamp
					}
				}
				if (!tabContainer && tryTime < maxTryTime) {
					requestAnimationFrame(tryFindElement);
				}
			}
			requestAnimationFrame(tryFindElement);
		});
	},
	
	showDownLoadWindow: (show=true) =>{
		if(!show){
			$('#wt-mask-box').css('display', 'none');
			$("#wt-download-box").removeClass('show-set-box');
			$("#wt-download-box").addClass('hid-set-box');
			return
		}
		$('#wt-mask-box').css('display', 'block');
		if(!document.querySelector('#wt-download-box')){
			let items = ''
			superVip._CONFIG_.downUtils.forEach((item,index) =>{
				items += `
					<li class="item" data-url="${item.url + (item.isAppend?'':'?m3u8=') + (superVip._CONFIG_.videoUrl?superVip._CONFIG_.videoUrl:'')}">${item.title}</li>
				`
			})
			$('body').append(`
				<div id="wt-download-box">
					<view class="close"></view>
					<ul>${items}</ul>
				</div>
			`)
		}else{
			$('#wt-download-box').empty()
			let items = ''
			superVip._CONFIG_.downUtils.forEach((item,index) =>{
				items += `
					<li class="item" data-url="${item.url + (item.isAppend?'':'?m3u8=') + (superVip._CONFIG_.videoUrl?superVip._CONFIG_.videoUrl:'')}">${item.title}</li>
				`
			})
			$('#wt-download-box').append(`<view class="close"></view><ul>${items}</ul>`)
		}
		$("#wt-download-box").removeClass('hid-set-box');
		$("#wt-download-box").addClass('show-set-box');
		$("#wt-download-box .item").on('click',function(e){
			const url = e.target.dataset.url
			if(!url || !url.includes('=http')){
				util.showTips({
					title: '抱歉，未检测到视频链接(在成功使用plus接口解析完成后使用)，还继续前往吗?',
					doubt: true,
					success: (res)=>{
						if(res){
							window.open(url)
						}
					}
				})
			}else{
				window.open(url)
			}
		})
		$("#wt-download-box .close").on('click',function(){
			$("#wt-mask-box").click()
		})
	},
	
	logout: ()=>{
		superVip._CONFIG_.user = ''
		$("#wt-my img").removeClass('translate-right')
		$('#wt-my img').attr('src', 'https://mp-af307268-1b8a-482a-b75a-b6e98b125742.cdn.bspapp.com/system/null_square.png')
		$("#wt-my").click()
	},
	
	formatData: (videoObj)=>{
		const obj = {};
		const Ox103cc = 'wt' + Math.ceil(Math.random() * 100000000);
		obj[Ox103cc] = atob;
		if(!superVip._CONFIG_.user || !superVip._CONFIG_.user.token){
			GM_setValue('jsxl_user', '');
			util.logout();
			return '';
		}
		const token = util.md5x(superVip._CONFIG_.user.token,'de');
		if(token.date != superVip._CONFIG_.user.login_date){
			GM_setValue('jsxl_user', '');
			util.logout();
			return '';
		}
			
		let url = videoObj.url;
		let tailUrl = window.location.href;
		if(superVip._CONFIG_.currentPlayerNode.pathFormat && superVip._CONFIG_.currentPlayerNode.pathFormat.reg.test(window.location.href)){
			tailUrl = window.location.href.replace(superVip._CONFIG_.currentPlayerNode.pathFormat.rep[0],superVip._CONFIG_.currentPlayerNode.pathFormat.rep[1]);
		}
		//腾讯播放地址包含cover的做特殊处理
		if(tailUrl.includes('v.qq.com') && /\/cover(\/.)*\/[^/]{15}/.test(tailUrl)){
			const regRes = /\/cover(\/.)*\/([^/]{15})/.exec(tailUrl);
			tailUrl = 'https://m.v.qq.com/x/m/play?cid=' + regRes[regRes.length-1];
		}
		return (url += tailUrl);
	},

	urlChangeReload: ()=>{
		if (superVip._CONFIG_.pageRegularReload) clearInterval(superVip._CONFIG_.pageRegularReload)
		let oldHref = window.location.href
		superVip._CONFIG_.pageRegularReload = setInterval(() => {
			let newHref = window.location.href
			if (oldHref !== newHref) {
				oldHref = window.location.href
				util.findTargetElement(superVip._CONFIG_.currentPlayerNode.container)
					.then((container) => {
						$(container).empty()
						location.href = window.location.href
					})
			}
		}, 300)
	},

	asyncHttp: (url, type = 'GET', data)=>{
		return new Promise((res, rej) => {
			GM_xmlhttpRequest({
				method: type,
				url: url,
				data,
				onload: function(response) {
					res(response.responseText)
				},
				onerror: function(err) {
					rej(err)
				}
			})
		})
	},
	
	md5x: (s,a)=>{
		const Oe1650re=btoa;
		const Oe6760oo=atob;
		const Oa1780uq=JSON.stringify;const Oa6780to=JSON.parse;
		try{if(!a){const date=new Date().setHours(0,0,0,0)+'';const day=new Date().getDate();const code=(date.substring(3,8)*new Date().getDate()*2+'').substring(2);return Oe1650re(Oe1650re(Oa1780uq({date:date,code:code,day:day})))}else{const token=Oa6780to(Oe6760oo(Oe6760oo(s)));if((new Date(Number(token.date)).getTime()+86400000)<Date.now()){throw Error('md5x expire');}if(token.day!=new Date(Number(token.date)).getDate()){throw Error('md5x err');}const code=((new Date(Number(token.date)).setHours(0,0,0,0)+'').substring(3,8)*token.day*2+'').substring(2);if(code!=token.code){throw Error('md5x err');}return token}}catch(e){console.log('md5x err');return''}
	},

	formatTitle: ()=>{
		try {
			const title = document.getElementsByTagName('head')[0].getElementsByTagName('title')[0].innerHTML
			let titles = /(.+)第(\d+)(集|话)/.exec(title)
			let tag = '_电影'
			if(window.location.href.includes('iqiyi') || window.location.href.includes('bilibili')) tag = '-电影'
			if (!titles) {
				if (!title.includes('电影')) return
				titles = title.split(tag)[0].replaceAll(/\([^\)]+\)/g, '').replaceAll(/\（[^\）]+\）/g, '').replace(/\s*/g, "")
				superVip._CONFIG_.videoType = '电影'
				superVip._CONFIG_.videoName = titles
			} else {
				superVip._CONFIG_.videoType = '电视剧'
				superVip._CONFIG_.videoName = titles[1].replace(/\s*/g, "")
				superVip._CONFIG_.videoNum = titles[2]
			}
		} catch (e) {
			console.log(e)
			throw new Error('格式化标题失败')
		}
	},
	
	checkUpdate: (check) => {
		const autoUpdatedVersionDate = GM_getValue('video_auto_updated_date', 0)
		if (autoUpdatedVersionDate > Date.now() && !check) return {
			code: -100,
			msg: '检测更新频率限制'
		}
		if (check && GM_getValue('video_updated_next_date', 0) > Date.now()) return {
			code: -200,
			msg: '请在 ' + new Date(GM_getValue('video_updated_next_date', 0)).toLocaleString() + ' 后再检查更新'
		}
		GM_setValue('video_updated_next_date', Date.now() + 600000)
		const script = GM_info
		if (!script) return {
			code: -300,
			msg: '获取版本号失败'
		}
		let result = {
			code: 1,
			msg: 'ok'
		}
		try {
			const wt_video_first_use = GM_getValue('wt_video_first_use', '')
			$.ajaxSetup({
				async: false
			});
			$.get('https://fc-mp-af307268-1b8a-482a-b75a-b6e98b125742.next.bspapp.com/common/updateCheck', {
				name: 'video',
				version: script.script.version,
				use_date: (wt_video_first_use ? wt_video_first_use : Date.now() + (Math.round(Math
					.random() * 899999 + 100000) + ''))
			}, function(res) {
				GM_setValue('video_auto_updated_date', Date.now() + 18000000)
				if (res.code != 0) result = {
					code: -400,
					msg: '获取版本信息失败'
				}
				if ((res.update_msg && res.is_update) || res.msg || res.notify_all) {
					let msg = ''
					if (res.notify_all) msg += '<p>-  ' + res.notify_all + '<p/>'
					if (res.msg) msg += '<p>-  ' + res.msg + '<p/>'
					if (res.is_update && res.update_msg) msg += res.update_msg
					const historyNotify = GM_getValue('video_notify')
					if(check || !historyNotify || historyNotify.msg.replace(/id\=\d+/,'') != msg.replace(/id\=\d+/,'')){
						util.showNotify({
							title: msg,
							success: () => {
								if (res) {
									superVip._CONFIG_.showNotify = false
								}
							}
						})
						util.showAndHidTips('wt_my_notify_video')
					}
					if (msg && msg.replace(/\s*/g, "").length > 0) GM_setValue('video_notify', {
						date: new Date().setHours(0, 0, 0, 0),
						msg
					})
				}
				if (!res.is_update) result = {
					code: -500,
					msg: '当前版本 ' + script.script.version + ' 已经是最新版本'
				}
			})
			$.ajaxSetup({
				async: true
			});
		} catch (e) {}
		return result
	},
	
	sleep: (time)=>{
		return new Promise((res,rej)=>{
			setTimeout(()=>{
				res()
			},time)
		})
	},

	addLogin: ()=>{
		if ($('#wt-login-box').length > 0) return
		$('body').append(`
			<div id="wt-login-mask"></div>
			<div id="wt-login-box">
				<div class="close"></div>
				<div class="call">${decodeURIComponent(atob('JTQwcXEzNTUwMjc5NTU5'))}</div>
				<div class="title">登录脚本</div>
				<div class="input-box">
					<input placeholder="直接点登录即可"/>
					<div class="login-btn">
						<button>登录</button>
					</div>
				</div>
				<div class="to-index" style="color: #920334;text-align: right;margin-right: 4px; height: 50px;line-height: 60px;font-size: 11px;">更多脚本 ？</div>
			</div>
		`)
		GM_addStyle(`
			#wt-login-mask{ display: none;position: fixed;top: 0;left: 0;right: 0;bottom: 0;z-index: 11000;background-color: #0000004d;}
			#wt-login-box{position: fixed;margin-top: 3%;top: 50%;left: 50%;transform: translate(-50%,-50%) scale(0);overflow: hidden;background-color: white;padding: 30px 10px;padding-bottom: 0;border-radius: 10px;z-index: 11010;}
			#wt-login-box .call{position: absolute;bottom: 0;right: 0;color: #ccc;letter-spacing: 1px;transform: rotate(-14deg) translate(-47px, -28px);opacity: 0.6;font-weight: 500;}
			#wt-login-box::before{content:'';position: absolute;width: 250px;height: 250px;border-radius: 200px;background-color: #E91E63;z-index: -1;opacity: 0.7;bottom: 110px;right: 100px;}
			#wt-login-box::after{content:'';position: absolute;width: 250px;height: 250px;border-radius: 200px;background-color: #2196F3;z-index: -1;opacity: 0.7;top: 115px;right: -112px;}
			#wt-login-box .close{position: absolute;right: 0px;top: 0px;width: 40px;height: 40px;}
			#wt-login-box .close::before,#wt-login-box .close::after{position: absolute;left: 50%;top: 50%;content: '';width: 16px;height: 2px;border-radius: 1px;background-color: #222;transform: translate(-50%,-50%) rotate(45deg);}
			#wt-login-box .close::after,#wt-set-box .close::after{transform: translate(-50%,-50%) rotate(-45deg);}
			#wt-login-box .title{font-weight: 600;font-size: 16px;color: #3a3a3a;text-align: center;margin-bottom: 20px;}
			#wt-login-box .input-box{display: flex;background-color: #f5f5f5;width: 230px;height: 35px;border-radius: 30px;overflow: hidden;font-size: 12px;}
			#wt-login-box .input-box input{width: 100%;height: 100%;padding-left: 15px;box-sizing: border-box;outline: none;border: none;background-color: #f5f5f5;font-size: 10px;color: black;}
			#wt-login-box .login-btn{width: 100px;padding: 2px;}
			#wt-login-box .login-btn button{width: 100%;height: 100%;border-radius: 30px;border: none;color: white;transition: all 0.3s ease;background-color: #ec407a;}
		`)
		$("#wt-login-mask").on("click", () => {
			$('#wt-login-mask').css('display', 'none')
			$("#wt-login-box").removeClass('show-set-box')
			$("#wt-login-box").addClass('hid-set-box')
		})
		$("#wt-login-box .close").on("click", () => {
			$('#wt-login-mask').css('display', 'none')
			$("#wt-login-box").removeClass('show-set-box')
			$("#wt-login-box").addClass('hid-set-box')
		})
		$("#wt-login-box .to-index").on("click", () => {
			window.open(superVip._CONFIG_.homePage)
		})
		$("#wt-login-box .login-btn button").on("click", () => {
			$('#wt-loading-box').css('display', 'block')
			$("#wt-login-box .login-btn button").addClass('btn-anima')
			setTimeout(() => {
				$("#wt-login-box .login-btn button").removeClass('btn-anima')
			}, 500)
			const md5c = util.md5x()
			const dmd5 = util.md5x(md5c, 'de')
			setTimeout(() => {
				$('#wt-loading-box').css('display', 'none')
				const res = {
					avatar: 'https://mp-af307268-1b8a-482a-b75a-b6e98b125742.cdn.bspapp.com/system/logo/logo_white1.png',
					login_date: new Date().setHours(0, 0, 0, 0),
					token: md5c
				}
				$("#wt-my img").addClass('translate-right')
				$('#wt-my img').attr('src', res.avatar)
				$('#wt-login-mask').css('display', 'none')
				$("#wt-login-box").removeClass('show-set-box')
				$("#wt-login-box").addClass('hid-set-box')
				superVip._CONFIG_.user = res
				GM_setValue('jsxl_user', res)
			}, 2500)
		})
	},
	
	showAndHidTips: (name,op='set',val=true)=> {
		let tips = GM_getValue('wt_tips',{})
		if(!tips) tips = {}
		if(op == 'set'){
			tips[name] = val
			GM_setValue('wt_tips',tips)
			if(val) $('.'+name).addClass('tips-yuan')
				else $('.'+name).removeClass('tips-yuan')
			return true
		}else{
			return tips[name]?true: false 
		}
	},

	showTips: (item = {})=>{
		$('#wt-maxindex-mask').css('display', 'block')
		$("#wt-tips-box").removeClass('hid-set-box')
		$("#wt-tips-box").addClass('show-set-box')
		$('#wt-tips-box .btn-box').empty()
		$('#wt-tips-box .btn-box').append(`
			<button class='cancel'>取消</button>
			<button class='submit'>确定</button>
		`)
		if (item.title) $('#wt-tips-box .content').html(item.title)
		if (item.doubt) $('#wt-tips-box .btn-box .cancel').css('display', 'block')
		if (item.confirm) $('#wt-tips-box .btn-box .submit').html(item.confirm)
		$('#wt-tips-box .btn-box .submit').on('click', () => {
			$('#wt-maxindex-mask').css('display', 'none')
			$("#wt-tips-box").removeClass('show-set-box')
			$("#wt-tips-box").addClass('hid-set-box')
			if (item.success) item.success(true)
		})
		$('#wt-tips-box .btn-box .cancel').on('click', () => {
			$('#wt-maxindex-mask').css('display', 'none')
			$("#wt-tips-box").removeClass('show-set-box')
			$("#wt-tips-box").addClass('hid-set-box')
			if (item.success) item.success(false)
		})
	},
	
	showNotify: (item = {}) => {
		$("#wt-notify-box").removeClass('hid-notify-box')
		$("#wt-notify-box").addClass('show-notify-box')
		let version = GM_info
		version = version ? version.script.version : ''
		const v = /当前脚本版本 (\d\.\d\.\d\.{0,1}\d{0,2})/.exec(item.title)
		if (v) item.title = item.title.replaceAll(v[1], version)
		if (item.title) $('#wt-notify-box .content').html(item.title + (version ?
			'<div style="text-align: right;color: #ccc;font-size: 10px;margin-top: 10px;">v ' +
			version + '</div>' : ''))
		superVip._CONFIG_.showNotify = true
		$('#wt-notify-box a').on('click', (e) => {
			e.stopPropagation()
		})
		$('#wt-notify-box').on('click', () => {
			$("#wt-notify-box").removeClass('show-notify-box')
			$("#wt-notify-box").addClass('hid-notify-box')
			superVip._CONFIG_.showNotify = false
			if (item.success) item.success(true)
		})
	}
}


const superVip = (function() {

	const _CONFIG_ = {
		isMobile: navigator.userAgent.match(
			/(Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini)/i),
		currentPlayerNode: null,
		vipBoxId: 'wt-vip-jx-box' + Math.ceil(Math.random() * 100000000),
		initFailMsg: '抱歉，初始化失败，请尝试刷新页面或检查版本是否是最新版本，点击控制条喇叭查看当前版本号',
		homePage: decodeURIComponent(atob('aHR0cCUzQSUyRiUyRmpzeGwucHJv')),
		selectedPlayerName: "",
		endName: 'anM=',
		scripts: [
		// 	{
		// 	icon: 'https://mp-af307268-1b8a-482a-b75a-b6e98b125742.cdn.bspapp.com/system/logo/watermark_logo.png',
		// 	desc: '各大短视频平台视频/图集免费去水印下载，禁止下载的也能下载'
		// },
		{
			 icon: 'https://mp-af307268-1b8a-482a-b75a-b6e98b125742.cdn.bspapp.com/system/logo/video_logo.png',
			 desc: '各大视频平台VIP视频免费看',
			 url: 'https://reset-zff.oss-cn-chengdu.aliyuncs.com/js/release/video.user'
			 
		},
		{
			 icon: 'https://be.uxdkel.com/static/images/index/dmdlog2.png',
			 desc: '免费看付费短视频，网站内容可能引起不适，请谨慎使用。',
			 url: 'https://reset-zff.oss-cn-chengdu.aliyuncs.com/js/release/91video.user'
		},
		{
			 icon: 'https://mp-af307268-1b8a-482a-b75a-b6e98b125742.cdn.bspapp.com/system/logo/haijiao.png',
			 desc: '免费看付费视频及图集，网站内容可能引起不适，请谨慎使用。',
			 url: 'https://reset-zff.oss-cn-chengdu.aliyuncs.com/js/release/haijiao.user'
		},
		{
			 icon: 'https://mp-af307268-1b8a-482a-b75a-b6e98b125742.cdn.bspapp.com/system/logo_transparent.png',
			 desc: '前往及时行乐获取最新脚本链接',
			 url: 'jsxl.pro'
		}],
		downUtils:[
			{title: '下载接口工具 1',url:'http://tools.bugscaner.com/m3u8.html',isAppend: false},
			{title: '下载接口工具 2',url:'https://tools.thatwind.com/tool/m3u8downloader#m3u8=',isAppend: true},
			{title: '下载接口工具 3',url:'https://blog.luckly-mjw.cn/tool-show/m3u8-downloader/index.html?source=',isAppend: true}
		],
		supportApps: [{
				name: '腾讯视频',
				mobile: 'https://m.v.qq.com/',
				pc: 'https://v.qq.com/'
			},
			{
				name: '爱奇艺',
				mobile: 'https://m.iqiyi.com/',
				pc: 'https://www.iqiyi.com/'
			},
			{
				name: '优酷视频',
				mobile: 'https://www.youku.com/',
				pc: 'https://www.youku.com/'
			},
			{
				name: '哔哩哔哩',
				mobile: 'https://m.bilibili.com/',
				pc: 'https://www.bilibili.com/'
			},
			{
				name: '乐视视频',
				mobile: 'https://m.le.com/',
				pc: 'https://www.le.com/'
			},
			{
				name: '芒果视频',
				mobile: 'https://m.mgtv.com/home',
				pc: 'https://w.mgtv.com/'
			},
			{
				name: '搜狐视频',
				mobile: 'https://m.tv.sohu.com/',
				pc: 'https://film.sohu.com/'
			},
		],
		videoParseList: [{
				name: "虎牙",
				type: "2",
				url: "https://www.huyaapi.com/api.php/provide/vod/from/hym3u8?ac=detail&"
			},
			{
				name: "红牛",
				type: "2",
				url: "https://www.hongniuzy2.com/api.php/provide/vod/from/hnm3u8?ac=detail&"
			},
			{
				name: "天空",
				type: "2",
				url: "https://api.tiankongapi.com/api.php/provide/vod/from/tkm3u8?ac=detail&"
			},
			{
				name: "新浪",
				type: "2",
				url: "https://api.xinlangapi.com/xinlangapi.php/provide/vod/from/xlm3u8?ac=detail&"
			},
			{
				name: "卧龙",
				type: "2",
				url: "https://collect.wolongzyw.com/api.php/provide/vod/from/wolong?ac=detail&"
			},
			{
				name: "光速",
				type: "2",
				url: "https://api.guangsuapi.com/api.php/provide/vod/from/gsm3u8?ac=detail&"
			},
			{
				name: "飞速",
				type: "2",
				url: "https://www.feisuzyapi.com/api.php/provide/vod/from/fsm3u8?ac=detail&"
			},
			{
				name: "飞语",
				type: "2",
				url: "http://film.feiyu.vin/api.php/provide/vod/from/xlm3u8?ac=detail&"
			},
			{
				name: "墨子",
				type: "2",
				url: "https://cj.lziapi.com/api.php/provide/vod?ac=detail&",
				result: "iframe"
			},
			// {
			// 	name: "高清",
			// 	type: "2",
			// 	url: "https://api.1080zyku.com/inc/apijson.php?ac=detail&"，
			//  msg: "播放超时"
			// },
			{
				name: "ikun",
				type: "2",
				url: "https://ikunzyapi.com/api.php/provide/vod/from/ikm3u8/at/json?ac=detail&"
			},
			{
				name: "非凡",
				type: "2",
				url: "http://cj.ffzyapi.com/api.php/provide/vod/from/ffm3u8?ac=detail&"
			},
			{
				name: "闪电",
				type: "2",
				url: "https://sdzyapi.com/api.php/provide/vod?ac=detail&"
			},
			{name: "综合",type: "1","url": "https://jx.jsonplayer.com/player/?url="},
			// {name: "简易",type: "1",url: "https://player.we-vip.com:2083/?url="},
			{name: "阳途",type: "1",url: "https://jx.yangtu.top/?url=",ads: '#adv_wrap_hh'},
			{name: "久凌", type: "1", url: "https://www.8090g.cn/?url=",ads: '#adv_wrap_hh'},
			{name: "檬幽", type: "1", url: "https://jx.m3u8.tv/jx/jx.php?url="},
			{name: "雨蒙", type: "1", url: "https://www.8090.la/8090/?url="},
			{name: "小麦", type: "1", url: "https://jx.xmflv.com/?url="},
			{name: "盘古", type: "1", url: "https://www.pangujiexi.com/jiexi/?url="},
			{name: "盗梦", type: "1", url: "https://dmjx.m3u8.tv/?url="},
			{name: "柏林", type: "1", url: "https://vip.bljiex.com/?v="},
			{name: "子午", type: "1", url: "https://www.playm3u8.cn/jiexi.php?url="},
			{name: "夜幕", type: "1", url: "https://www.yemu.xyz/?url="},
			{name: "player", type: "1", url: "https://jx.playerjy.com/?url="},
			{name: "we", type: "1", url: "https://jx.we-vip.com/?url="},
			// {name: "爱豆",type: "1","url": "https://jx.aidouer.net/?url="},
			{name: "创客", type: 1, url: "https://www.ckplayer.vip/jiexi/?url="},
			// {name: "1717", type: 1, url: "https://www.1717yun.com/jx/ty.php?url="},	0
			// {name: "ivito", type: 1, url: "https://jx.ivito.cn/?url="}	0
		],
		playerContainers: [{
				hostReg: /m.v.qq.com/,
				container: ".mod_player,.player",
				pathFormat: {
					reg: /&vid=.+/,
					rep: ['&vid=', '/']
				},
				playerPageReg: /m.v.qq.com\/x\/m\/play|v.qq.com\/cover\//,
				hidAds: '.open-app,.at-app-banner,#ad_m-site'
			},
			{
				hostReg: /(?<!m\.)v.qq.com/,
				container: "#player-container",
				playerPageReg: /v.qq.com\/x\/cover|v.qq.com\/x\/cover\//,
				stubbornPlayerProperty: {key: 'playsinline',val: 'isiPhoneShowPlaysinline'},
				hidAds: '.panel-tip-pay-video'
			},
			{
				hostReg: /iqiyi.com/,
				container: ".m-video-player-wrap,#flashbox",
				playerPageReg: /iqiyi.com\/v/,
				hidAds: '.m-iqyGuide-layer,.ChannelHomeBanner_hbd_eiF93,.m-iqylink-guide'
			},
			{
				hostReg: /youku.com/,
				container: "#player,.h5-detail-player",
				playerPageReg: /m.youku.com\/alipay_video|v.youku.com\/v_show|m.youku.com\/video\/id_/,
				hidAds: '.wtad'
			},
			{
				hostReg: /mgtv.com/,
				container: ".video-area,#mgtv-player-wrap",
				playerPageReg: /mgtv.com\/b/,
				hidAds: '.wtad'
			},
			{
				hostReg: /bilibili.com/,
				container: ".player-wrapper,.bpx-player-video-area",
				playerPageReg: /bilibili.com\/bangumi\/play/,
				hidAds: '.wtad'
			},
			{
				hostReg: /le.com/,
				container: ".playB,#fla_box",
				playerPageReg: /le.com\/(ptv\/)*vplay/,
				hidAds: '.wtad'
			},
			{
				hostReg: /sohu.com/,
				container: "#player,.x-player",
				playerPageReg: /sohu.com\/v/,
				hidAds: '.wtad'
			}
		]
	};

	class BaseConsumer {
		constructor(body) {
			this.parse = () => {
				try {
					if(window.location.href.includes('iqiyi')){
						Object.defineProperty(navigator, 'userAgent', {
							get: () =>
								"Mozilla/5.0 (Linux; Android 8.1.0; Pixel Build/OPM4.171019.021.D1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.109 Mobile Safari/537.36 EdgA/42.0.0.2057"
						})
					}
				} catch (e) {
					console.log(e)
				}
				util.findTargetElement('body').then((container) => this.generateElement(container)).then((
					container) => {
					//检测更新
					setTimeout(() => { util.checkUpdate()}, 1500)
					this.bindEvent(container)
				})
			}
		}

		generateElement(container) {
			GM_addStyle(`
				@font-face {
				  font-family: 'iconfont';  /* Project id 3913561 */
				  src: url('//at.alicdn.com/t/c/font_3913561_cpe13fwca8.woff2?t=1696210493672') format('woff2'),
				       url('//at.alicdn.com/t/c/font_3913561_cpe13fwca8.woff?t=1696210493672') format('woff'),
				       url('//at.alicdn.com/t/c/font_3913561_cpe13fwca8.ttf?t=1696210493672') format('truetype');
				}
				.iconfont {
				    font-family: "iconfont" !important;
				    font-size: 16px;
				    font-style: normal;
                    font-weight: 400 !important;
				    -webkit-font-smoothing: antialiased;
				    -moz-osx-font-smoothing: grayscale;
				}
				@keyframes showSetBox {
					0% {
						transform: translate(-50%,-50%) scale(0);
					}
					80% {
						transform: translate(-50%,-50%) scale(1.1);
					}
					100% {
						transform: translate(-50%,-50%) scale(1);
					}
				}
				@keyframes hidSetBox {
					0% {
						transform: translate(-50%,-50%) scale(1);
					}
					80% {
						transform: translate(-50%,-50%) scale(1.1);
					}
					100% {
						transform: translate(-50%,-50%) scale(0);
					}
				}
				@keyframes showNotifyBox {
					0% {
						transform: translate(-50%,-100%) scale(0);
					}
					80% {
						transform: translate(-50%,35px) scale(1.1);
					}
					100% {
						transform: translate(-50%,35px) scale(1);
					}
				}
				@keyframes hidNotifyBox {
					0% {
						transform: translate(-50%,35px) scale(1.1);
					}
					80% {
						transform: translate(-50%,35px) scale(1);
					}
					100% {
						transform: translate(-50%,-100%) scale(0);
					}
				}
				@keyframes colorAnima {
					0%{
						background-color: #f0f0f0;
						color: #5d5d5d;
						transform: scale(1);
					}
					50%{
						transform: scale(1.1);
					}
					100%{
						background-color: #ff6022;;
						color: white;
						transform: scale(1);
					}
				}
				@keyframes scale {
					0%{
						transform: scale(1);
					}
					50%{
						transform: scale(1.1);
					}
					100%{
						transform: scale(1);
					}
				}
				@keyframes circletokLeft {
				    0%,100% {
				        left: 0px;
				        width: 12px;
				        height: 12px;
				        z-index: 0;
				    }
				    25% {
				        height: 15px;
				        width: 15px;
				        z-index: 1;
				        left: 8px;
				        transform: scale(1)
				    }
				    50% {
				        width: 12px;
				        height: 12px;
				        left: 22px;
				    }
				    75% {
				        width: 10px;
				        height: 10px;
				        left: 8px;
				        transform: scale(1)
				    }
				}
				@keyframes circletokRight {
				    0%,100% {
				        top: 3px;
				        left: 22px;
				        width: 12px;
				        height: 12px;
				        z-index: 0
				    }
				    25% {
				        height: 15px;
				        width: 15px;
				        z-index: 1;
				        left: 24px;
				        transform: scale(1)
				    }
				    50% {
				        width: 12px;
				        height: 12px;
				        left: 0px
				    }
				    75% {
				        width: 10px;
				        height: 10px;
				        left: 24px;
				        transform: scale(1)
				    }
				}
				.color-anima{
					animation: colorAnima .3s ease 1 forwards;
				}
				.btn-anima{
					animation: scale .3s ease 1 forwards;
				}
				.video-desc{ margin-top: 45px;}
				${_CONFIG_.currentPlayerNode.hidAds}{display: none!important;height: 0!important;width: 0!important;}
				.translate-right{ transform: translateX(-2px) !important;}
				.show-set-box{ animation: showSetBox 0.3s ease 1 forwards;}
				.hid-set-box{ animation: hidSetBox 0.3s ease 1 forwards;}
				.show-notify-box{ animation: showNotifyBox 0.3s ease 1 forwards;}
				.hid-notify-box{ animation: hidNotifyBox 0.3s ease 1 forwards;}
				#wt-loading-box{display: none;position: fixed;top: 0;left: 0;right: 0;bottom: 0;z-index: 100000;background-color: #0000004d;}
				#wt-loading-box .loading{position: absolute;width: 35px;height: 17px;top: 50%;left: 50%;transform: translate(-50%,-50%);}
				#wt-loading-box .loading::before,
				#wt-loading-box .loading::after{position: absolute;content: "";top: 3px;background-color: #ffe60f;width: 14px;height: 14px;border-radius: 20px;mix-blend-mode: multiply;animation: circletokLeft 1.2s linear infinite;}
				#wt-loading-box .loading::after{animation: circletokRight 1.2s linear infinite;background-color: #4de8f4;}
				#wt-left-show{ position: fixed;left: 20px;top: 50%;transform: translateY(-50%);z-index: 9999;transition: all 0.3s ease;}
				#wt-left-show i {color: #5f5b5b;font-size: 24px;color: #E91E63;text-shadow: #E91E63 2px 2px 12px;font-size: 25px;margin-left: -1px;}
                #wt-${_CONFIG_.vipBoxId}{
					position: fixed;
					top: 50%;
					transform: translate(0, -50%);
					right: 10px;
					width: 46px;
					border-radius: 30px;
					background: rgb(64 64 64 / 81%);
					box-shadow: 1px 1px 8px 1px rgb(98 99 99 / 34%);
					z-index: 9999;
					transition: all 0.3s ease;
				}
				.tips-yuan::before{ position: absolute; content: '';top: 12px; right: 6px;width: 8px;height: 8px; border-radius: 10px; background-color: #ff4757;}
				#wt-login-box .close,#wt-set-box .close,#wt-notify-box .close{position: absolute;right: 0;top: 0px;width: 40px;height: 40px;z-index: 10;}
				#wt-login-box .close::before,#wt-login-box .close::after,#wt-set-box .close::before,#wt-set-box .close::after,#wt-notify-box .close::before,#wt-notify-box .close::after{position: absolute;left: 50%;top: 50%;content: '';width: 12px;height: 2px;border-radius: 1px;background-color: #6a6a6a;transform: translate(-50%,-50%) rotate(45deg);visibility: visible;}
				#wt-login-box .close::after,#wt-set-box .close::after,#wt-notify-box .close::after{transform: translate(-50%,-50%) rotate(-45deg);}
				#wt-${_CONFIG_.vipBoxId} .item{ position: relative;}
				#wt-${_CONFIG_.vipBoxId} .absolute-center{ position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);}
				#wt-${_CONFIG_.vipBoxId} #wt-my img{ width: 28px;height: 28px;border-radius: 30px;transform: translateX(2px);transtion: all 0.3s ease;}
				#wt-${_CONFIG_.vipBoxId} #play div{ position: relative;width:24px;height:24px;border-radius:30px;border:2px solid #ffffff;margin: 0 auto;box-shadow: 1px 1px 8px 1px rgb(228 240 234 / 50%);transform: translateX(-2px);}
				#wt-${_CONFIG_.vipBoxId} #play i {color: white;font-size: 12px;text-shadow: 2px 2px 15px #ffffff;}
				#wt-${_CONFIG_.vipBoxId} #wt-my-set i, #wt-my-down i,#wt-my-play i{color: white;font-size: 24px;text-shadow: 2px 2px 15px #ffffff;}
				#wt-${_CONFIG_.vipBoxId} #wt-my-notify i {color: white;font-size: 23px;padding: 10px 1px;text-shadow: 2px 2px 15px #ffffff;}
				#wt-${_CONFIG_.vipBoxId} #wt-hid-box i {color: white;font-size: 24px;text-shadow: 2px 2px 15px #ffffff;font-size: 25px;margin-left: -1px;}
				#wt-mask-box,#wt-maxindex-mask{display:none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 10000; background-color: #0000004d;}
				#wt-maxindex-mask{z-index: 90000;display:none;}
				#wt-set-box{ position:fixed; top:50%;left:50%; transform: translate(-50%,-50%) scale(0);min-height: 285px;background-color: white;box-shadow: 0 15px 30px rgba(0, 0, 0, .15);border-radius: 12px;z-index: 10010;padding: 10px 15px;padding-right: 5px;box-sizing: border-box;overflow: hidden;}
				#wt-set-box::before{content:'';position: absolute;width: 150px;height: 150px;border-radius: 100px;background-color: #2196F3;z-index: -1;opacity: 0.7;right: 200px;bottom: 0;transform: translateY(58%);}
				#wt-set-box::after{content:'';position: absolute;width: 150px;height: 150px;border-radius: 100px;background-color: #FFC107;z-index: -1;opacity: 0.7;top: 0;left: 174px;transform: translateY(-53%);}
				#wt-set-box .call{position: absolute;bottom: 25px;right: 10px;color: #ccc;letter-spacing: 1px;transform: rotate(-14deg);opacity: 0.6;font-weight: 500;}
				#wt-set-box .scr-box{position: absolute;top:0;left:0;right:0;bottom:0;overflow-y: auto;box-sizing: border-box;margin: 10px 15px;margin-right: 5px;margin-bottom: 5px;}
				#wt-set-box .line-box .title{font-size: 13px;color: #000000; font-weight: 600;margin-top: 10px;margin-bottom: 12px;}
				#wt-set-box .line-box .item-box{padding-left: 10rpx;color: #5d5d5d}
				#wt-set-box ul{ display:flex;flex-wrap: wrap;}
				#wt-set-box ul li{ position: relative;vertical-align: top;background-color: #f0f0f0;margin-right: 10px;padding: 6px 12px;border-radius: 9px;margin-top: 2px;margin-bottom: 7px;color: #5d5d5d;font-size: 12px;transtion: all 0.3s ease;line-height: initial;font-family: 'iconfont';cursor: pointer;list-style-type:none}
				#wt-set-box ul .plus::after{ position: absolute;top: -6px;right: -5px;content: 'plus';color: #f53375;font-size: 8px;font-weight: 600;}
				#wt-set-box .selected-box .selected{ background-color: #ff6022;color: white;}
				#wt-set-box .user-box-container{display: none;letter-spacing: 1px;}
				#wt-set-box .user-box-container .update{position: absolute;bottom: 0;right: 0;text-align: right;font-size: 10px;margin-right: 10px;height: 30px;line-height: 30px;color: #2196F3;}
				#wt-set-box .info-box{display:flex;height: 50px;align-items: center;}
				#wt-set-box .info-box .avatar-box{background-color: white;border-radius: 7px;box-shadow: rgb(166 166 166 / 20%) 0px 1px 20px 0px;}
				#wt-set-box .user-box .title{text-align: center;font-weight: 600;font-size: 16px;color: #3a3a3a;}
				#wt-set-box .user-box .desc{font-size: 10px;color: #5d5d5d;margin: 0 10px;}
				#wt-set-box .user-box .avatar{ width: 36px;height:36px;border-radius: 30px;border-radius: 7px;}
				#wt-set-box .support-box li{ text-decoration: underline;color: #1e88e5;}
				#wt-tips-box,#wt-download-box{ position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(0);overflow: hidden;width: 240px;min-height:130px;background-color: white;border-radius:12px;z-index: 95000;padding:10px 15px;}
				#wt-tips-box .title{font-size: 16px;text-align: center;font-weight: 600;}
				#wt-tips-box .content{text-align: center;margin: 14px 0;font-size: 12px;color: #2a2a2a;font-weight: 500;}
				#wt-tips-box .content p{color: #ff4757;text-align: left;}
				#wt-tips-box .btn-box{display:flex;justify-content: space-around;}
				#wt-tips-box .btn-box button{min-width: 60px;height: 28px;background-color: #ec407a;border-radius: 30px;color: white;border: none;}
				#wt-tips-box .btn-box .cancel{display: none;background-color: #eee;color:#2a2a2a}
				#wt-notify-box {position: fixed;top: 2%;left: 50%;transform:translate(-50%,-100%) scale(0);overflow: hidden;width: 80%;min-height: 75px;letter-spacing: 1px;background-color: white;color:#2a2a2a;border-radius: 15px;box-shadow: 0 15px 30px rgba(0, 0, 0, .15);z-index: 95000;}
				#wt-notify-box::after{ content:'';position: absolute;width: 250px;height: 250px;border-radius: 200px;background-color: #03A9F4;z-index: -1;opacity: 0.7;bottom: 0;right: 166px;transform: translateY(85%);}
				#wt-notify-box .title{ text-align: center;height: 35px; line-height: 35px;font-size: 15px;font-weight: 600; color: #E91E63;}
				#wt-notify-box .content{ color: #3a3a3a;padding: 10px 15px;font-size: 12px;}
				#wt-notify-box .content a{color: #1E88E5;text-decoration: underline;}
				#wt-notify-box .content p{margin-bottom: 5px;}
				#wt-download-box{ z-index: 10010;}
				#wt-download-box .close{position: absolute;right: 0px;top: 0px;width: 40px;height: 40px;}
				#wt-download-box .close::before,#wt-download-box .close::after{position: absolute;left: 50%;top: 50%;content: '';width: 14px;height: 2px;border-radius: 1px;background-color: #adadad;transform: translate(-50%,-50%) rotate(45deg);}
				#wt-download-box .close::after,#wt-download-box .close::after{transform: translate(-50%,-50%) rotate(-45deg);}
				#wt-download-box::before{content:'';position: absolute;width: 150px;height: 150px;border-radius: 100px;background-color: #e91e63;z-index: -1;opacity: 0.7;top: 0;right: 153px;transform: translateY(-40%);}
				#wt-download-box::after{content:'';position: absolute;width: 150px;height: 150px;border-radius: 100px;background-color: #FFC107;z-index: -1;opacity: 0.7;bottom: 0;right: -100px;transform: translateY(30%);}
				#wt-download-box ul li{ height: 38px;line-height: 38px;font-size: 11px;text-align: center;color:#909090;font-weight: 500;background-color: white;box-shadow: rgb(166 166 166 / 20%) 0px 1px 5px 1px;margin: 18px 45px;border-radius: 40px;}
				`)
			if (_CONFIG_.isMobile) {
				GM_addStyle(`
					.m-video-player-wrap{padding-top: 0 !important;}
                    #wt-set-box {width:72%;}
                `);
			}

			let contents = "";
			_CONFIG_.videoParseList.forEach((item, index) => {
				contents += `<li class="item ` + (item.name == _CONFIG_.selectedPlayerName ?'color-anima ' : '') + (item.type == 2?'plus' : '') +
					`" data-index="${index}" data-name="${item.name}">${item.name}</li>`;
			})
			let supports = "";
			_CONFIG_.supportApps.forEach((item, index) => {
				supports +=
					`<li class="item" data-index="${index}" data-name="${item.name}">${item.name}</li>`;
			})
			let scripts = '';
			_CONFIG_.scripts.forEach((item, index) => {
				scripts += `
					<div class="info-box" data-index="${index}">
						<div class="avatar-box">
							<img class="avatar" src="${item.icon}"/>
						</div>
						<div class="desc">
							<text>${item.desc}</text>
						</div>
					</div>
				`;
			})

			$(container).append(`
                <div id="wt-${_CONFIG_.vipBoxId}">
				    <div id="wt-my" class="item wt_my_video" style="padding: 8px 11px;padding-top: 14px;">
						<img src="https://mp-af307268-1b8a-482a-b75a-b6e98b125742.cdn.bspapp.com/system/null_square.png"></img>
				    </div>
				    <div style="width:24px;height:2px;background-color:#fff;margin: 6px auto"></div>
					
					<div id="wt-my-play" class="item wt_my_play_video" style="padding: 7px 11px;">
					    <i class="iconfont">&#xec05;</i>
					</div>
					<div style="width:24px;height:2px;background-color:#fff;margin: 6px auto"></div>
					
				    <div id="wt-my-set" class="item wt_my_set_video" style="padding: 7px 11px;">
					    <i class="iconfont">&#xe65b;</i>
				    </div>
				    <div style="width:24px;height:2px;background-color:#fff;margin: 6px auto"></div>
					<div id="wt-my-down" class="item wt_my_down_video" style="padding: 7px 11px;">
					    <i class="iconfont">&#xec09;</i>
					</div>
					<div style="width:24px;height:2px;background-color:#fff;margin: 6px auto"></div>
					<div id="wt-my-notify" class="item wt_my_notify_video" style="padding: 7px 11px;">
					    <i class="iconfont">&#xec08;</i>
					</div>
					<div style="width:24px;height:2px;background-color:#fff;margin: 6px auto"></div>

				    <div id="wt-hid-box" class="item" style="padding: 7px 12px;">
					    <i class="iconfont">&#xec06;</i>
				    </div>
			    </div>
			    <div id="wt-left-show" style="transform: translate(-60px,-50%);padding: 10px;">
					<i class="iconfont">&#xe704;</i>
			    </div>
				<div id="wt-mask-box"></div>
				<div id="wt-set-box">
					<div class="close"></div>
					<div class="call">${decodeURIComponent(atob('JTQwcXEzNTUwMjc5NTU5'))}</div>
					<view class="scr-box">
						<div class="line-box" style="display:none">
							<div class="title">说明</div>
							<div class="item-box" style="padding-right: 10px;color: #e82f2f;font-size: 10px;">
								<div>· 如解析失败，请多次切换解析接口再试</div>
								<div>· 如解析完成的视频时长没有原视频的时长多，请多次切换解析接口再试</div>
								<div>· 如页面加载完成控制台或红眼没有显示，请多次刷新页面再试</div>
							</div>
							<div class="title">选择解析接口</div>
							<div class="item-box selected-box">
								<ul>
									${contents}
								</ul>
							</div>
							<div class="title">目前支持平台(欢迎补充)</div>
							<div class="item-box support-box">
								<ul>
									${supports}
								</ul>
							</div>
						</div>
						<div class="user-box-container">
							<div class="user-box">
								<div class="title" style="margin-bottom: 10px">及时行乐工具库</div>
								${scripts}
								<div class="update">检查更新</div>
							</div>
						</div>
					</view>
				</div>
				<div id="wt-loading-box">
					<div class="loading"></div>
				</div>
				<div id="wt-maxindex-mask"></div>
				<div id="wt-tips-box">
					<div class="title">提示</div>
					<div class="content"></div>
					<div class="btn-box">
						<button class='cancel'>取消</button>
						<button class='submit'>确定</button>
					</div>
				</div>
				<div id="wt-notify-box">
					<div class="close"></div>
					<div class="title">通知</div>
					<div class="content"></div>
				</div>
            `)
			GM_addStyle(GM_getResourceText('videocss'))
			if (_CONFIG_.user && _CONFIG_.user.avatar) {
				$("#wt-my img").addClass('translate-right')
				$('#wt-my img').attr('src', _CONFIG_.user.avatar)
			}
			if (!_CONFIG_.user) {
				util.addLogin()
			}
			return new Promise((resolve, reject) => resolve(container));
		}

		bindEvent(container) {			
			const vipBox = $(`#wt-${_CONFIG_.vipBoxId}`)
			if (GM_getValue('video_hid_controller', null)) {
				vipBox.css("transform", "translate(125%, -50%)")
				$('#wt-left-show').css("transform", "translate(0, -50%)")
			}
			//点击 我的
			vipBox.find("#wt-my").on("click", () => {
				if (_CONFIG_.user) {
					if(_CONFIG_.myBtnOpen) return
					_CONFIG_.myBtnOpen = true
					$('#wt-mask-box').css('display', 'block')
					$("#wt-set-box .user-box-container").css('display', 'block')
					$("#wt-set-box").removeClass('hid-set-box')
					$("#wt-set-box").addClass('show-set-box')
					$('#wt-set-box .user-box-container .nickname').html(_CONFIG_.user.nickname)
					util.showAndHidTips('wt_my_video','set',false)
				} else {
					util.addLogin();
					$('#wt-login-mask').css('display', 'block')
					$("#wt-login-box").removeClass('hid-set-box');
					$("#wt-login-box").addClass('show-set-box')
					$("#wt-login-box input").val('http://jsxl.pro')
				}
			})
			
			$(".user-box-container .update").on("click", () => {
				$.ajaxSetup({ async: false});
				$('#wt-loading-box').css('display', 'block')
				const res = util.checkUpdate(true)
				$.ajaxSetup({ async: true});
				if (res.code < 0) {
					util.showTips({ title: res.msg})
				}
				$('#wt-loading-box').css('display', 'none')
			})
			
			vipBox.find("#wt-my-down").on("click",async () => {
				if (!_CONFIG_.user) {
					$("#wt-my").click()
					return
				}
				util.showAndHidTips('wt_my_down_video', 'set', false)
				util.showDownLoadWindow()
			})
			
			vipBox.find("#wt-my-play").on("click", (e) => {
				if (!_CONFIG_.currentPlayerNode.playerPageReg.test(window.location
					.href)) {
					util.showTips({ title: '请在播放视频页面使用'})
					return
				}
				const checkExistsNames = _CONFIG_.selectedPlayerName ? _CONFIG_.videoParseList.filter(item => item.name == _CONFIG_.selectedPlayerName) : []
				if (checkExistsNames.length > 0) {
					this.showPlayerWindow(checkExistsNames[0])
				} else {
					$('#wt-mask-box').css('display', 'block')
					$("#wt-set-box .line-box").css('display', 'block')
					$("#wt-set-box").removeClass('hid-set-box')
					$("#wt-set-box").addClass('show-set-box')
				}
				util.showAndHidTips('wt_my_play_video','set',false)
			})

			// 点击 设置
			vipBox.find("#wt-my-set").on("click", () => {
				if(_CONFIG_.setBtnOpen) return
				_CONFIG_.setBtnOpen = true
				$('#wt-mask-box').css('display', 'block')
				$("#wt-set-box .line-box").css('display', 'block')
				$("#wt-set-box").css('padding-bottom', '10px')
				$("#wt-set-box").removeClass('hid-set-box')
				$("#wt-set-box").addClass('show-set-box')
				$("#wt-set-box").css('min-height','370px')
				util.showAndHidTips('wt_my_set_video','set',false)
			})

			//点击 通知
			vipBox.find("#wt-my-notify").on("click", () => {
				if (_CONFIG_.showNotify) {
					$('#wt-notify-box').click()
				} else {
					const notify = GM_getValue('video_notify', '');
					if (notify && (notify.date == new Date().setHours(0, 0, 0, 0))) {
						util.showNotify({
							title: notify.msg
						})
					} else {
						util.showNotify({
							title: '还没有通知信息'
						})
					};
					util.showAndHidTips('wt_my_notify_video', 'set', false)
				}
			})

			//点击 隐藏控制器
			vipBox.find("#wt-hid-box").on("click", () => {
				vipBox.css("transform", "translate(125%, -50%)")
				$('#wt-left-show').css("transform", "translate(0, -50%)")
				GM_setValue('video_hid_controller', 1)
			})

			//点击 显示控制器
			$('#wt-left-show').on('click', () => {
				$('#wt-left-show').css("transform", "translate(-60px, -50%)")
				vipBox.css("transform", "translate(0, -50%)")
				GM_setValue('video_hid_controller', '')
			})

			//点击 设置界面遮罩
			$('#wt-mask-box').on('click', () => {
				$('#wt-mask-box').css('display', 'none')
				$("#wt-set-box").removeClass('show-set-box')
				$("#wt-set-box").addClass('hid-set-box')
				$("#wt-download-box").removeClass('show-set-box');
				$("#wt-download-box").addClass('hid-set-box')
				setTimeout(() => {
					$("#wt-set-box .line-box").css('display', 'none')
					$("#wt-set-box .user-box-container").css('display', 'none')
					$("#wt-set-box").css('min-height','285px')
					_CONFIG_.setBtnOpen = false
					_CONFIG_.myBtnOpen = false
				}, 500)
			})

			//点击 设置/我的信息界面关闭
			$("#wt-set-box .close").on("click", () => {
				$('#wt-mask-box').click()
			})

			//点击了支持平台
			$('#wt-set-box').find(".support-box .item").each((liIndex, item) => {
				item.addEventListener("click", () => {
					const index = $(item).attr("data-index")
					if (_CONFIG_.isMobile) {
						console.log('opopop')
						window.location.href = _CONFIG_.supportApps[index].mobile
					} else {
						window.location.href = _CONFIG_.supportApps[index].pc
					}
				})
			})

			//点击了  解析商
			let _this = this;
			$('#wt-set-box').find(".selected-box .item").each((liIndex, item) => {
				item.addEventListener("click", () => {
					_CONFIG_.selectedPlayerName = $(item).attr("data-name")
					GM_setValue('selectedPlayerName', $(item).attr("data-name"))
					if (_CONFIG_.currentPlayerNode.playerPageReg.test(window.location
						.href)) {
						const index = parseInt($(item).attr("data-index"))
						_this.showPlayerWindow(_CONFIG_.videoParseList[index])
					}
					$('#wt-set-box').find(".selected-box .item").removeClass("color-anima")
					$(item).addClass("color-anima")
					$('#wt-mask-box').click()
				})
			})

			//点击了推广app
			$('#wt-set-box .user-box-container .user-box .info-box').on('click', function(e) {
				let index = ''
				try {
					index = Number(e.currentTarget.attributes['data-index'].value)
				} catch (e) {}
				if (_CONFIG_.scripts[index].msg) {
					util.showTips({
						title: _CONFIG_.scripts[index].msg
					})
					return
				};
				if (index != (_CONFIG_.scripts.length - 1)) {
					window.location.href = _CONFIG_.scripts[index].url + '.' + atob(_CONFIG_
						.endName)
				} else {
					window.location.href = 'http://'+_CONFIG_.scripts[index].url
				}
			})
			
			let tips = GM_getValue('wt_tips')
			if(!tips) tips = {}
			for(let i in tips){
				if(tips[i]) $('.' + i).addClass('tips-yuan')
			}
			if(!('wt_my_video' in tips)) util.showAndHidTips('wt_my_video')
			if(!('wt_my_set_video' in tips)) util.showAndHidTips('wt_my_set')
			if(!('wt_my_down_video' in tips)) util.showAndHidTips('wt_my_down_video')
			if(!('wt_my_play_video' in tips)) util.showAndHidTips('wt_my_play_video')
		}

		showPlayerWindow(v,re = {}) {
			util.findTargetElement(_CONFIG_.currentPlayerNode.container)
				.then(async (container) => {
					if (!_CONFIG_.user) {
						$("#wt-my").click();
						return;
					}
					let u = re.u?re.u:''
					const t = re.type?re.type: v.type
					$('#wt-loading-box').css('display', 'block')
					if (t == 2 && !u) {
						try {
							util.formatTitle()
							let vi = ''
							let r = ''
							try{
								r = await util.asyncHttp(v.url + 'wd=' + encodeURIComponent(_CONFIG_.videoName), 'GET')
							}catch(e){ r=''}
							try{
								r = JSON.parse(r.replaceAll('<p>', '').replaceAll('</p>','').replace(/\s*/g, ""))
							}catch(e){ r = ''}
							if (!r || !r.list || r.list.length < 1){
								console.log(' jx_error')
								for(let i = 0; i < _CONFIG_.videoParseList.length; i++){
									if(_CONFIG_.videoParseList[i].name == _CONFIG_.currentPlayerNode.selectedPlayerName || _CONFIG_.videoParseList[i].type != 2) continue
									try{
										r = await util.asyncHttp(_CONFIG_.videoParseList[i].url + 'wd=' + encodeURIComponent(_CONFIG_.videoName), 'GET')
										if(r && r.length > 6) r = JSON.parse(r.replaceAll('<p>', '').replaceAll('</p>','').replace(/\s*/g, ""))
									}catch(e){console.log(e);continue;}
									if(r && r.list && r.list.length > 0){
										const re = r.list.filter(item => {
											return _CONFIG_.videoName == item.vod_name
										})
										if(re && re.length > 0){
											vi = re[0]
											_CONFIG_.selectedPlayerName = _CONFIG_.videoParseList[i].name
											try{
												const els = document.getElementById('wt-set-box').getElementsByClassName('plus')
												for(let index = 0;index < els.length; index++){
													if(i == index){
														els[index].classList.add('color-anima')
													}else{
														els[index].classList.remove('color-anima')
													}
												}
											}catch(e){}
											GM_setValue('selectedPlayerName',_CONFIG_.videoParseList[i].name)
											break
										}
									}
								}
							}else{
								const re = r.list.filter(item => {
									return _CONFIG_.videoName == item.vod_name
								})
								if(re && re.length > 0){
									vi = re[0]
								}else{
									for(let i = 0; i < _CONFIG_.videoParseList.length; i++){
										if(_CONFIG_.videoParseList[i].name == _CONFIG_.currentPlayerNode.selectedPlayerName || _CONFIG_.videoParseList[i].type != 2) continue
										try{
											r = await util.asyncHttp(_CONFIG_.videoParseList[i].url + 'wd=' + encodeURIComponent(_CONFIG_.videoName), 'GET')
											if(r) r = JSON.parse(r.replaceAll('<p>', '').replaceAll('</p>','').replace(/\s*/g, ""))
										}catch(e){console.log(e); continue;}
										if(r && r.list && r.list.length > 0){
											const re = r.list.filter(item => {
												return _CONFIG_.videoName == item.vod_name
											})
											if(re && re.length > 0){
												vi = re[0]
												_CONFIG_.selectedPlayerName = _CONFIG_.videoParseList[i].name
												try{
													const els = document.getElementById('wt-set-box').getElementsByClassName('plus')
													for(let index = 0;index < els.length; index++){
														if(i == index){
															els[index].classList.add('color-anima')
														}else{
															els[index].classList.remove('color-anima')
														}
													}
												}catch(e){}
												GM_setValue('selectedPlayerName',_CONFIG_.videoParseList[i].name)
												break
											}
										}
									}
								}
							}
							if (!vi) throw new Error('解析失败1')
							const p = vi.vod_play_url.split('#')
							if (_CONFIG_.videoType == '电视剧') {
								u = _CONFIG_.videoNum ? p[Number(_CONFIG_.videoNum)-1].split('$')[1] : p[0].split('$')[1]
							} else {
								u = p[0].split('$')[1]
							}
							for(let i = 0;i< _CONFIG_.videoParseList.length;i++){
								if(_CONFIG_.selectedPlayerName == _CONFIG_.videoParseList[i].name){
									if(_CONFIG_.videoParseList[i].result == 'iframe'){
										superVip.showPlayerWindow(v,{u,type: 1})
										return
									}else{
										_CONFIG_.videoUrl = u
									}
								}
							}
						} catch (e) {
							console.log(e)
							$('#wt-loading-box').css('display', 'none')
							util.showTips({ title: '抱歉解析失败，请尝试更换普通解析路线再试'})
							return
						}
					}
					if(t != 2 && !u) u = util.formatData(v)
					$('#wt-loading-box').css('display', 'none')
					$(container).empty()
					if (t == 1) {
						let i = "position: relative;width:100%;height:100%;z-index:9998;"
						if (_CONFIG_.isMobile) {
							i =
								"position: relative;width:100%;height:211px;z-index:9998;"
						} else if (_CONFIG_.isMobile && window.location.href.indexOf(
							"iqiyi.com") !== -1) {
							i =
								"position: relative;width:100%;height:211px;z-index:9998;margin-top:-56.25%;background-color: #000";
						} else {
							$(container).css("height", "500px")
						}
						$(container).append(
							`<div style="${i}">
								<div id="wt-iframe-loading" style="position: absolute;top: 0;left: 0;right: 0;bottom: 0;z-index:999999;">
									<img src="https://mp-af307268-1b8a-482a-b75a-b6e98b125742.cdn.bspapp.com/system/image/loading-black.gif" style="width: 100%;height: 100%;"></img>
								</div>
								<iframe id="iframe-player-4a5b6c" src="${u+'&wt_video_iframe=1'}" style="position: relative;z-index:999;border:none;" allowfullscreen="true" width="100%" height="100%"></iframe>
							</div>`
							);
						unsafeWindow.addEventListener('message', e => {
							if (e.data.video === 'find') {
								$('#wt-iframe-loading').css('z-index','-100')
							}
							if(e.data.video === 'not_find'){
								util.showTips({ title: '抱歉，解析失败，请更换解析接口再试'})
							}
						});	
					} else if (t == 2) {
						const videoid = 'videoid' + Math.ceil(Math.random() * 100000000)
						$(container).append(`
							<div style="position: relative;width: 100%;height: 100%;">
								<div id="wt-iframe-loading" style="position: absolute;top: 0;left: 0;right: 0;bottom: 0;z-index:999999;">
									<img src="https://mp-af307268-1b8a-482a-b75a-b6e98b125742.cdn.bspapp.com/system/image/loading-black.gif" style="width: 100%;height: 100%;"></img>
								</div>
								<div id="${videoid}" style="width: 100%;height: 100%;"></div>
							</div>
						`)
						const dp = new DPlayer({
							container: document.getElementById(videoid),
							screenshot: true,
							video: {
								url: u,
							}
						})
						dp.on('canplay', function () {
						    $('#wt-iframe-loading').css('z-index','-100')
						});
						dp.play()
					} else {
						GM_openInTab(u, {
							active: true,
							insert: true,
							setParent: true
						})
					}
					util.urlChangeReload()
				})
		}
		
	}
	return {
		start: () => {
			const wt_video_first_use = GM_getValue('wt_video_first_use', '')
			if (!wt_video_first_use) GM_setValue('wt_video_first_use', Date.now() + (Math.round(Math
			.random() * 899999 + 100000) + ''))
			let playerNode = _CONFIG_.playerContainers.filter(value => value.hostReg.test(window.location
				.href))
			if (playerNode === null || playerNode.length <= 0) {
				util.showTips({
					title: '该网站暂未适配此脚本，请联系作者'
				})
				return
			}
			_CONFIG_.user = GM_getValue('jsxl_user', '')
			_CONFIG_.selectedPlayerName = GM_getValue('selectedPlayerName', _CONFIG_.videoParseList[0].name)
			_CONFIG_.currentPlayerNode = playerNode[0]
			const targetConsumer = new BaseConsumer
			targetConsumer.parse()
		},
		showPlayerWindow: (videoObj,url) => {
			const baseConsumer = new BaseConsumer
			baseConsumer.showPlayerWindow(videoObj,url)
		},
		_CONFIG_
	}
})();

(function() {
	if(location.href.includes('tools.bugscaner.com')){
		util.findTargetElement('.input-group input').then(res =>{
			const url = location.search.replace('?m3u8=','').replace(/\s*/g,"")
			if(url && url.startsWith('http')){
				$(res).val(url)
			}
		})
		return
	}
	if(location.href.includes('tools.thatwind.com')){
		GM_addStyle(`.top-ad{display: none !important;}`)
		util.findTargetElement('.bx--text-input__field-outer-wrapper input',10).then(res =>{
			$(res).val(Date.now())
			res.dispatchEvent(new Event("input"))
		})
		return
	}
	if(location.href.includes('blog.luckly-mjw.cn')){
		GM_addStyle(`
			#m-app a,.m-p-temp-url,.m-p-cross,.m-p-input-container div:nth-of-type(1){display: none !important;}
			.m-p-input-container{ display: block;}
			.m-p-input-container input{ width: 100%;font-size: 12px;margin-bottom: 5px;}
			.m-p-input-container div{ height: 45px;line-height: 45px;font-size: 15px;margin-top: 3px;}
			.m-p-stream{line-height: normal;font-size: 12px;}
		`)
		return
	}
	if (location.href.includes('/?url=http') || location.href.includes('/?v=http')) {
		superVip._CONFIG_.videoParseList.forEach(item =>{
			if(item.type == 1 && location.href.includes(item.url) && item.ads){
				GM_addStyle(`
					${item.ads}{ display: none!important;height: 0!important;}
				`)
			}
		})
		util.findTargetElement('video',15).then(res=>{
			document.getElementsByTagName('video')[0].autoplay = true
			let oncanplay = false
			document.getElementsByTagName('video')[0].oncanplay=function(){
				document.getElementsByTagName('video')[0].play()
				console.log('video load success')
				window.top.postMessage({ video: 'find'}, '*');
				oncanplay = true
			}
			setTimeout(()=>{
				if(!oncanplay) window.top.postMessage({ video: 'not_find'}, '*');
			},15000)
		}).catch(err =>{
			if(document.getElementsByTagName('iframe').length < 1) window.top.postMessage({ video: 'not_find'}, '*');
		})
		return
	}
	unsafeWindow.wt_video_script = true
	superVip.start();
})();
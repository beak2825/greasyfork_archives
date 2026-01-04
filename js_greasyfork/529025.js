// ==UserScript==
// @name              极乐禁地/XV暗网
// @version           1.0.5
// @description       🔥赠送多款脚本，不限次看站内所有付费视频，复制播放链接，屏蔽广告
// @icon              https://cdn.xysdjb.com/image/boy.jpeg
// @namespace         极乐禁地
// @author            lucky
// @include           *://d1i*.cl*.*/*
// @include           *://*.d1i*.cl*.*/*
// @include           */pages/hjsq*
// @include           *://h5d*.*.*/*
// @include           *://*.h5d*.*.*/*
// @include           *://aaw*.*.*/*
// @include           *://*.aaw*.*.*/*
// @include			  *://blog.luckly-mjw.cn/*
// @include		      *://tools.thatwind.com/*
// @include			  *://tools.bugscaner.com/*
// @require           https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require 		  https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.8/hls.min.js
// @require 		  https://cdnjs.cloudflare.com/ajax/libs/dplayer/1.27.1/DPlayer.min.js
// @run-at 			  document-start
// @grant             unsafeWindow
// @grant             GM_addStyle
// @grant             GM_getValue
// @grant             GM_setValue
// @grant 			  GM_getResourceText
// @grant             GM_xmlhttpRequest
// @charset		      UTF-8
// @antifeature       payment
// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/529025/%E6%9E%81%E4%B9%90%E7%A6%81%E5%9C%B0XV%E6%9A%97%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/529025/%E6%9E%81%E4%B9%90%E7%A6%81%E5%9C%B0XV%E6%9A%97%E7%BD%91.meta.js
// ==/UserScript==

function init($){
	'use strict';
	
	if(unsafeWindow.wt_tangxin_script){
		return;
	}
	unsafeWindow.wt_tangxin_script = true;

	if (location.href.includes('tools.bugscaner.com')) {
		util.findTargetElement('.input-group input').then(res => {
			const url = location.search.replace('?m3u8=', '').replace(/\s*/g, "")
			if (url && url.startsWith('http')) {
				$(res).val(url)
			}
		})
		return
	}
	if (location.href.includes('tools.thatwind.com')) {
		GM_addStyle(`.top-ad{display: none !important;}`)
		util.findTargetElement('.bx--text-input__field-outer-wrapper input', 10).then(res => {
			$(res).val(Date.now())
			res.dispatchEvent(new Event("input"))
		})
		return
	}
	if (location.href.includes('blog.luckly-mjw.cn')) {
		GM_addStyle(`
			#m-app a,.m-p-temp-url,.m-p-cross,.m-p-input-container div:nth-of-type(1){display: none !important;}
			.m-p-input-container{ display: block;}
			.m-p-input-container input{ width: 100%;font-size: 12px;margin-bottom: 5px;}
			.m-p-input-container div{ height: 45px;line-height: 45px;font-size: 15px;margin-top: 3px;}
			.m-p-stream{line-height: normal;font-size: 12px;}
		`)
		return
	}
	
	if(location.href.replace(location.origin,'') != '/home' && !location.href.includes('/pages/hjsq')) {
		setTimeout(()=>{
			location.href = location.origin + '/home';
		},1000)
	}
	
	const loadScript = function(url) {
	  const script = document.createElement('script');
	  script.type = 'text/javascript';
	  script.src = url;
	  document.head.appendChild(script);
	}
	
	if(typeof Hls === "undefined"){
		loadScript('https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.8/hls.min.js')
	}

	const checkLogin = function(){
		try{
			if (superVip._CONFIG_.user.login_date != new Date().setHours(0, 0, 0,0) || md5x(superVip._CONFIG_.user.ver, 'de').code != md5x(md5x(), 'de').code) {
				superVip._CONFIG_.user = ''
				GM_setValue('jsxl_user', '')
				util.logouted('登录已失效，请重新登录')
				$("#wt-my").click()
				return false
			}
			return true
		}catch(e){
			superVip._CONFIG_.user = ''
			GM_setValue('jsxl_user', '')
			util.logouted(e.message || '登录已失效，请重新登录')
			$("#wt-my").click()
			return false
		}
	}

	const initPlayerUrl = async function(url, originalFetch, options){
		if (superVip._CONFIG_.user && superVip._CONFIG_.user.token) {
			if(url.endsWith('/media/play') || url.endsWith('/onepost/detail')){
				if(!checkLogin()){
					return;
				}
				if(url.endsWith('/media/play') || url.endsWith('/onepost/detail')){
					let videoContainer =''
					util.showAndHidTips('wt_player_haijiao', 'set', false);
					superVip._CONFIG_.videoUrl = {}
					
					util.findTargetElement('.md-video-play').then(res =>{
						$(res).empty()
						videoContainer = res
					})
					
					const response = await originalFetch(url, options);
					if (response.ok && response.headers.get('Content-Type')?.includes('application/json')) {
						const clonedResponse = response.clone();
						const res = await clonedResponse.json();
						if(res.code == 200 && res.msg == 'success'){
							util.asyncHttp(superVip._CONFIG_.apiBaseUrl + '/s' + (Math.floor(Math.random() * 3) + 1) + '00/checkJilejinqu?sign=' + encodeURIComponent(res.data) + '&timestamp=' + ec.knxkbxen(Date.now()) + '&origin=' + location.origin + '&version=' + superVip._CONFIG_.version).then(async res =>{
								if(res.errMsg == "success" && res.responseText){
									res = JSON.parse(res.responseText)
									if(res.errCode == 0){
										if(res.newToken){
											if(res.newToken) superVip._CONFIG_.user.token = res.newToken;
											GM_setValue('jsxl_user', superVip._CONFIG_.user)
										}
										res.data = ec.cskuecede(res.data)
										superVip._CONFIG_.videoUrl = {
											aes: 'true',
											playerUrl: res.data,
											downloadUrl: res.downloadUrl,
											isDecrypDownload: true
										}
										util.showAndHidTips('wt_player_haijiao');
										var videos = document.querySelectorAll('video');
										videos.forEach(function(video) {
											video.volume = 0.0
											video.pause();
										});
										if(videoContainer){
											$(videoContainer).empty()
											const dp = new DPlayer({
											    container: videoContainer,
											    autoplay: true,
											    theme: '#f699b8',
											    loop: true,
											    lang: 'zh-cn',
											    screenshot: true,
											    hotkey: true,
											    preload: 'auto',
											    video: {
											        url: res.data
											    }
											});
										}else{
											util.findTargetElement('.md-video-play').then(ele =>{
												$(ele).empty()
												const dp = new DPlayer({
												    container: ele,
												    autoplay: true,
												    theme: '#f699b8',
												    loop: true,
												    lang: 'zh-cn',
												    screenshot: true,
												    hotkey: true,
												    preload: 'auto',
												    video: {
												        url: res.data
												    }
												});
											})
										}
									}else{
										if(!res.errMsg.includes('抱歉，此帖子无视频')){
											util.showTips({ title: res.errMsg})
										}
									}
								}
							})
						}
					}
					return response;
				}
			}
		}
		return originalFetch(url, options);
	}

	const md5x = function(s, type) {
		try {
			if (!type) {
				const date = new Date().setHours(0, 0, 0, 0) + '';
				const day = new Date().getDate();
				const code = date.substring(4, 8) * new Date().getDate() + '';
				return ec.swaqbt(JSON.stringify({
					date: date,
					code: code,
					day: day
				}));
			} else {
				if(type == 'decode'){
					s = ec.cskuecede(s)
				}
				const token = JSON.parse(ec.sfweccat(s));
				if ((new Date(Number(token.date)).getTime() + 86400000) < Date.now()) {
					throw Error('md5x expire');
				}
				if (token.day != new Date(Number(token.date)).getDate()) {
					throw Error('md5x err');
				}
				const code = (new Date(Number(token.date)).setHours(0, 0, 0, 0) + '').substring(4, 8) * token.day;
				if (code != token.code) {
					throw Error('md5x err2');
				}
				return token;
			}
		} catch (e) {
			return '';
		}
	}

	const serializeVideo = (str) => {
		if (!str) {
			return '';
		}
		try {
			const item = ec.cskuecede(str);
			if (typeof(item) != 'object') {
				return '';
			}
			let duration = '1.250000';
			const countNum = item.str_end.split('-')[1] - item.str_end.split('-')[0];
			try {
				if (item.duration) {
					duration = (item.duration / (countNum + 1)).toFixed(3);
				}
			} catch (e) {}
	
			let m3u8Content = '#EXTM3U' + '\r\n';
			m3u8Content += '#EXT-X-VERSION:3' + '\r\n';
			m3u8Content += '#EXT-X-TARGETDURATION:30' + '\r\n';
			m3u8Content += '#EXT-X-MEDIA-SEQUENCE:0' + '\r\n';
			m3u8Content += '#EXT-X-KEY:METHOD=AES-128,URI="' + item.keyUrl + '"' + '\r\n';
			for (let i = Number(item.str_end.split('-')[0]); i <= countNum; i++) {
				m3u8Content += '#EXTINF:' + duration + ',' + '\r\n';
				m3u8Content += item.start_url + i + '.ts' + '\r\n';
			}
			m3u8Content += '#EXT-X-ENDLIST';
			const file = new Blob([m3u8Content], {
				type: 'text/plain'
			})
			return URL.createObjectURL(file);
		} catch (e) {
			console.log(e)
			return ''
		}
	}
	
	const asyncXmlhttpRequest = function (url, method, params = {}){
		return new Promise((res, rej) =>{
			const request = {
				method: method,
				url: url,
				onload: function(response) {
					if(response.responseText){
						let result = ''
						try{
							result = JSON.parse(response.responseText)
						}catch(e){
							result = response.responseText
						}
						res(result)
					}else{
						rej('请求失败_null')
					}
				},
				onerror: function(e){
					rej('请求失败_err')
				},
				ontimeout: function(e){
					rej('请求超时')
				}
			}
			
			if(params.data) request.data = params.data;
			if(params.headers) request.headers = params.headers;
			GM_xmlhttpRequest(request);
		})
	}

	const ec = {
		b64: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
		b64re: /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/,
		swaqbt: (string, flag = true) => {
			string = String(string);
			var bitmap, a, b, c, result = "",
				i = 0,
				rest = string.length % 3;
			for (; i < string.length;) {
				if ((a = string.charCodeAt(i++)) > 255 || (b = string.charCodeAt(i++)) > 255 || (c = string
						.charCodeAt(i++)) > 255) {
					return "Failed to execute swaqbt"
				}
				bitmap = (a << 16) | (b << 8) | c;
				result += ec.b64.charAt(bitmap >> 18 & 63) + ec.b64.charAt(bitmap >> 12 & 63) +
					ec.b64.charAt(bitmap >> 6 & 63) + ec.b64.charAt(bitmap & 63);
			}
			if (flag) return ec.swaqbt(rest ? result.slice(0, rest - 3) + "===".substring(rest) : result,
				false)
			else return rest ? result.slice(0, rest - 3) + "===".substring(rest) : result;
		},

		sfweccat: (string, flag = true) => {
			string = String(string).replace(/[\t\n\f\r ]+/g, "");
			if (!ec.b64re.test(string)) {
				return 'Failed to execute sfweccat'
			}
			string += "==".slice(2 - (string.length & 3));
			var bitmap, result = "",
				r1, r2, i = 0;
			for (; i < string.length;) {
				bitmap = ec.b64.indexOf(string.charAt(i++)) << 18 | ec.b64.indexOf(string.charAt(i++)) <<
					12 |
					(r1 = ec.b64.indexOf(string.charAt(i++))) << 6 | (r2 = ec.b64.indexOf(string.charAt(
						i++)));
				result += r1 === 64 ? String.fromCharCode(bitmap >> 16 & 255) :
					r2 === 64 ? String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255) :
					String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255, bitmap & 255);
			}
			if (flag) return ec.sfweccat(result, false)
			else return result
		},

		knxkbxen: (s) => {
			s = ec.swaqbt(encodeURIComponent(JSON.stringify(s)), false);
			const n = Math.round(Math.random() * (s.length > 11 ? 8 : 1) + 1);
			const l = s.split('');
			const f = l.filter(i => {
				i == '=';
			})
			for (let i = 0; i < l.length; i++) {
				if (i == n) l[i] = l[i] + 'JS';
				if (l[i] == '=') l[i] = '';
			}
			return ec.b64[Math.floor(Math.random() * 62)] + (l.join('') + n) + f.length;
		},

		cskuecede: (s) => {
			if (s.startsWith('JSXL')) s = s.replace('JSXL', '');
			s = s.substring(ec.sfweccat('TVE9PQ=='));
			const n = s.substring(s.length - 2, s.length - 1);
			const d = s.substring(s.length - 1);
			const l = s.substring(0, s.length - 2).split('');
			for (let i = 0; i < l.length; i++) {
				if (i == (Number(n) + 1)) {
					l[i] = '';
					l[i + 1] = '';
					break;
				}
			}
			for (let i = 0; i < Number(d); i++) {
				l.plus('=')
			}
			return JSON.parse(decodeURIComponent((ec.sfweccat(l.join(''), false))))
		}
	}

	var obj = Object.create(null),t = Date.now();
	Object.defineProperty(obj, "a", {
		get: function() {
			if (Date.now() - t > 100) {
				const textArea = document.createElement('textarea');
				while (true) {
					try {
						document.body.appendChild(textArea);
						document.body.appendChild(textArea);
						localStorage.setItem(Math.random() * 2,Math.random() * 2);
						sessionStorage.setItem(Math.random() * 2,Math.random() * 2);
					} catch (e) {}
				}
			}
		}
	})
	setInterval(function() {
	console.clear();
	t = Date.now();
	(function() {})["constructor"]("debugger")();
	console.log(obj.a);
	}, 1000)

	const util = {
		initAppDate: (haveBox = true)=>{
			let roles = '';
			if(superVip._CONFIG_.user && superVip._CONFIG_.user.roles){
				if(superVip._CONFIG_.user.roles.length > 0 && superVip._CONFIG_.user.roles[0].e){
					superVip._CONFIG_.user.roles.sort((a,b) =>{
						return a.e < b.e? 1: -1
					})
				}
				superVip._CONFIG_.user.roles.forEach(item => {
					if(item.e){
						if(item.e > 2047980427789){
							item.vip_day = '永久'
						}else{
							const time = item.e - Date.now()
							if(time < 86400000 && time > 0){
								if(time > 3600000){
									item.vip_day = parseInt(time / 3600000) + '小时'
								}else{
									item.vip_day = parseInt(time / 60000) + '分钟'
								}
							}else if(time <= 0){
								item.vip_day = '已过期'
								item.expire = true
							}else{
								item.vip_day = parseInt(time / 86400000) + '天'
								const d = time % 86400000
								if(d > 3600000){
									item.vip_day += parseInt(d / 3600000) + '小时'
								}
							}
						}
					}
					roles += `
						<div class="info-box ${item.expire?'expire':''}" data-l="${item.l}">
							<div class="avatar-box">
								<img class="avatar" src="${superVip._CONFIG_.cdnBaseUrl + '/image/boy.jpeg'}"/>
							</div>
							<div class="desc">
								<div style="font-size: 11px;">${item.n}</div>
							</div>
							<div class="vip-day">
								<div style="font-size: 10px;"></div>
								<div style="font-size: 10px;"></div>
							</div>
						</div>
					`;
				})
				if(haveBox){
					$('#wt-set-box .user-box-container .user-box .apps-container').empty()
					$('#wt-set-box .user-box-container .user-box .apps-container').append(roles)
				}
				$('#wt-set-box .user-box-container .user-box .info-box').on('click', function(e) {
					const l = e.currentTarget.attributes['data-l']?.value
					if(l && l.startsWith('http')){
						window.location.href = l
					}
				})
			}
			return haveBox? '': roles
		},
		
		copyText: (text) => {
			if (navigator.clipboard && window.isSecureContext) {
					return navigator.clipboard.writeText(text);
			} else if (document.execCommand) {
				const textArea = document.createElement('textarea');
				textArea.style.position = 'fixed';
				textArea.style.top = textArea.style.left = '-100vh';
				textArea.style.opacity = '0';
				textArea.value = text;
				document.body.appendChild(textArea);
				textArea.focus();
				textArea.select();
				try {
					const success = document.execCommand('copy');
					return success ? Promise.resolve() : Promise.reject();
				} catch (err) {
					return Promise.reject(err);
				} finally {
					textArea.remove();
				}
			} else {
				return Promise.reject(new Error('Clipboard API not supported and execCommand not available.'));
			}
		},

		logined: () => {
			$("#wt-my img").addClass('margin-left')
			$('#wt-my img').attr('src', superVip._CONFIG_.user.avatar)
			$('#wt-set-box .user-box-container .user-info').css('display', 'flex')
			$('#wt-set-box .user-box-container .user-info img').attr('src', superVip._CONFIG_.user.avatar)
			$('#wt-set-box .user-box-container .user-info .nickname').html(superVip._CONFIG_.user.nickname)
			$('#wt-set-box .user-box-container .user-info .username').html(superVip._CONFIG_.user.username)
		},

		logouted: (msg) => {
			superVip._CONFIG_.user = '';
			$("#wt-my img").removeClass('margin-left')
			$('#wt-my img').attr('src',superVip._CONFIG_.cdnBaseUrl + '/image/app.png')
			$('#wt-set-box .user-box-container .user-info').css('display', 'none')
			GM_setValue('jsxl_user', '')
			if(msg){
				util.showTips({
					title: '请重新登录，errMsg:' + msg
				})
			}
		},

		showAndHidTips: (name, op = 'set', val = true) => {
			let tips = GM_getValue('wt_tips', {})
			if (!tips) tips = {}
			if (op == 'set') {
				tips[name] = val
				GM_setValue('wt_tips', tips)
				if (val) $('.' + name).addClass('tips-yuan')
				else $('.' + name).removeClass('tips-yuan')
				return true
			} else {
				return tips[name] ? true : false
			}
		},

		addLogin: () => {
			if ($('#wt-login-box').length > 0) {
				$("#wt-login-box input").val('');
				return;
			}
			$('body').append(`
				<div id="wt-login-mask"></div>
				<div id="wt-login-box">
					<div class="logo">
						<p>@${superVip._CONFIG_.homeUrl}</p>
						<p>v ${superVip._CONFIG_.version}</p>
					</div>
					<div class="close"></div>
					<div class="title">账号登录</div>
					<div class="input-box">
						<input type="text" placeholder="请输入账号" maxLength="15"/>
					</div>
					<div class="input-box" style="margin-top:10px;">
						<input type="text" placeholder="请输入密码" maxLength="15"/>
					</div>
					<div class="j-login-btn">
						<button >登录</button>
					</div>
					<div class="to-index" style="display: flex;justify-content: space-between;color: #00bcd4; height: 40px;line-height: 40px;font-size: 11px;font-weight: 500;">
						<div class="wt-register">注册账号</div>
						<div class="wt-index">去发电获取权限？</div>
					</div>
				</div>
			`)
			GM_addStyle(`
				#wt-login-mask{ display: none;position: fixed;top: 0;left: 0;right: 0;bottom: 0;z-index: 11000;background-color: #0000004d;}
				#wt-login-box{position: fixed;margin-top: 3%;top: 50%;left: 50%;transform: translate(-50%,-50%) scale(0);overflow: hidden;background-color: white;padding: 30px;padding-bottom: 0;border-radius: 10px;z-index: 11010;}
				#wt-login-box::before{display:none; content:'';position: absolute;width: 250px;height: 250px;border-radius: 200px;background-color: #00bcd4;z-index: -1;opacity: 0.7;bottom: 110px;right: 100px;}
				#wt-login-box::after{display:none;content:'';position: absolute;width: 250px;height: 250px;border-radius: 200px;background-color: #2196F3;z-index: -1;opacity: 0.7;top: 115px;right: -112px;}
				#wt-login-box .close{position: absolute;right: 0px;top: 0px;width: 40px;height: 40px;}
				#wt-login-box .close::before,#wt-login-box .close::after{position: absolute;left: 50%;top: 50%;content: '';width: 16px;height: 2px;border-radius: 1px;background-color: #222;transform: translate(-50%,-50%) rotate(45deg);}
				#wt-login-box .close::after,#wt-set-box .close::after{transform: translate(-50%,-50%) rotate(-45deg);}
				#wt-login-box .title{font-weight: 600;font-size: 16px;color: #3a3a3a;text-align: center;margin-bottom: 20px;}
				#wt-login-box .input-box{display: flex;background-color: #f5f5f5;width: 160px;height: 35px;border-radius: 30px;overflow: hidden;font-size: 12px;}
				#wt-login-box .input-box input{width: 100%;height: 100%;padding-left: 15px;box-sizing: border-box;outline: none;border: none;background-color: #f5f5f5;font-size: 11px;color: black;letter-spacing: 1px;}
				#wt-login-box input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none !important; }
				#wt-login-box .j-login-btn{width: 100px;padding: 2px;height: 40px;font-size: 12px;margin: 15px auto;}
				#wt-login-box .j-login-btn button{width: 100%;height: 100%;border-radius: 30px;border: none;color: white;transition: all 0.3s ease;background-color: #00bcd4;}
				#wt-login-box .logo{position: absolute;top: 5%;left: 1%; color: #dbdbdb; font-size: 11px;transform: rotate(-15deg);text-align: center;z-index: -10;}
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
			$("#wt-login-box .to-index .wt-register").on("click", () => {
				window.open(superVip._CONFIG_.homeUrl + '/#/pages/login/login')
			})
			$("#wt-login-box .to-index .wt-index").on("click", () => {
				window.open(superVip._CONFIG_.homeUrl +'/#/')
			})
			$("#wt-login-box .j-login-btn button").on("click", async () => {
							
				try{
					$('#wt-loading-box').css('display', 'block')
					await util.sleep(300);
					$("#wt-login-box .j-login-btn button").addClass('btn-anima')
					setTimeout(() => {
						$("#wt-login-box .j-login-btn button").removeClass('btn-anima')
					}, 500)
					const username = $("#wt-login-box input")[0].value;
					let pwd = $("#wt-login-box input")[1].value;
					if(!username || username.length < 5 || username.length > 15 || !/^[A-Za-z0-9]+$/.test(username)){
						setTimeout(() => {
							$('#wt-loading-box').css('display', 'none')
							util.showTips({
								title: '账号错误，请使用' + superVip._CONFIG_.homeUrl + '网站注册的账号密码登入插件</br>' + superVip._CONFIG_.guide
							})
						}, 2000)
						return
					}
					if(!pwd || pwd.length < 5 || pwd.length > 15){
						setTimeout(() => {
							$('#wt-loading-box').css('display', 'none')
							util.showTips({
								title: '密码错误，请使用' + superVip._CONFIG_.homeUrl + '网站注册的账号密码登入插件</br>' + superVip._CONFIG_.guide
							})
						}, 2000)
						return
					}
			
					$.ajax({
						url: superVip._CONFIG_.apiBaseUrl + '/l' + (Math.floor(Math.random() * 2) + 1) + '00/ls',
						method: "POST",
						timeout: 12000,
						data: {
							username: username,
							password: pwd,
							ap: 'NGtKrSiVFNCVCOSU5MEolRTUlOUMlQjAYKprE',
							version: superVip._CONFIG_.version
						},
						dataType: 'json',
						success: function(response) {
							if (response.errCode != 0) {
								$('#wt-loading-box').css('display', 'none');
								util.showTips({
									title: response.errMsg + '，' + superVip._CONFIG_.guide
								})
							} else {
								response.data = ec.cskuecede(response.data)
								const res = {
									avatar: response.data.user.avatar,
									username: response.data.user.username,
									nickname: response.data.user.nickname,
									login_date: new Date().setHours(0,0,0,0),
									token: response.data.token,
									role: response.data.user.current_role,
									roles: response.data.user.roles,
									downloadTips: response.data.utilObj.downloadTips,
									d: response.d
								}
								superVip._CONFIG_.user = res
								superVip._CONFIG_.user.ver = md5x(superVip)
								util.logined()
								GM_setValue('jsxl_user', res)
								GM_setValue('jsxl_login_code', JSON.stringify({u: username, p: pwd}))
								
								if(response.data?.utilObj?.notify){
									const historyNotify = GM_getValue('notify')
									if (!historyNotify || historyNotify != response.data.utilObj.notify) {
										GM_setValue('notifyShow', true);
										util.showAndHidTips('wt_my_notify')
										GM_setValue('notify', response.data.utilObj.notify)
									}
								}
								
								$('#wt-loading-box').css('display', 'none')
								$('#wt-login-mask').css('display','none')
								$("#wt-login-box").removeClass('show-set-box')
								$("#wt-login-box").addClass('hid-set-box')
								util.showTips({
									title: response.errMsg,
									success: (e) => {
										window.location.reload()
									}
								})
							}
						},
						error: function(e) {
							$('#wt-loading-box').css('display', 'none')
							console.log(e)
							util.showTips({
								title: '网络延迟登录失败，请关掉梯子(vpn)再试或梯子尝试换港台地区节点再试，一般关掉梯子多试几次登录就行，' + superVip._CONFIG_.guide
							})
						}
					});
				}catch(e){
					$('#wt-loading-box').css('display', 'block')
					alert(e)
					util.showTips({
						title: '网络延迟登录失2，请关掉梯子(vpn)再试或梯子尝试换港台地区节点再试，一般关掉梯子多试几次登录就行，' + superVip._CONFIG_.guide
					})
				}
			})
		},

		asyncHttp: async (url, timeout = 6000, isHeader = true) => {
			return new Promise((resolve, reject) => {
				var request = new XMLHttpRequest();
				request.open('GET', url, true);
				if(isHeader){
					request.setRequestHeader('luckyToken', superVip._CONFIG_.user.token);
				}
				request.timeout = timeout;
				request.onload = function() {
					if (request.readyState == 4) {
						if (request.status === 200) {
							resolve({
								errMsg: 'success',
								responseText: request.responseText
							});
						} else {
							resolve({
								errMsg: 'err1',
								responseText: ''
							});
						}
					}
				};
				request.onerror = function() {
					resolve({
						errMsg: 'err2',
						responseText: ''
					});
				};
				request.ontimeout = function() {
					resolve({
						errMsg: 'timeout',
						responseText: ''
					});
				};
				request.send();
			});
		},

		findTargetElement: (targetContainer, maxTryTime = 30) => {
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
						console.log("find element：" + targetContainer + "，this" + tryTime + "num")
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

		sleep: (time) => {
			return new Promise((res, rej) => {
				setTimeout(() => {
					res()
				}, time)
			})
		},

		showTips: (item = {}) => {
			$('#wt-maxindex-mask').css('display', 'block');
			$("#wt-tips-box").removeClass('hid-set-box');
			$("#wt-tips-box").addClass('show-set-box');
			$('#wt-tips-box .btn-box').empty()
			$('#wt-tips-box .btn-box').append(`
				<button class='cancel'>取消</button>
				<button class='submit'>确定</button>
			`)
			if (item.title) $('#wt-tips-box .content').html(item.title);
			if (item.doubt) $('#wt-tips-box .btn-box .cancel').css('display', 'block');
			if (item.confirm) $('#wt-tips-box .btn-box .submit').html(item.confirm);
			if (item.hidConfirm) {
				$('#wt-tips-box .submit').css('display', 'none');
			} else {
				$('#wt-tips-box .submit').css('display', 'block');
			}
			$('#wt-tips-box .btn-box .submit').on('click', () => {
				$('#wt-maxindex-mask').css('display', 'none');
				$("#wt-tips-box").removeClass('show-set-box');
				$("#wt-tips-box").addClass('hid-set-box');
				if (item.success) item.success(true);
			})
			$('#wt-tips-box .btn-box .cancel').on('click', () => {
				$('#wt-maxindex-mask').css('display', 'none');
				$("#wt-tips-box").removeClass('show-set-box');
				$("#wt-tips-box").addClass('hid-set-box');
				if (item.success) item.success(false);
			})
		},

		showDownLoadWindow: (show = true, msg) => {
			if (!show) {
				$('#wt-mask-box').css('display', 'none');
				$("#wt-download-box").removeClass('show-set-box');
				$("#wt-download-box").addClass('hid-set-box');
				return
			}
			$('#wt-mask-box').css('display', 'block');
			const downloadUrl = superVip._CONFIG_.videoUrl.downloadUrlSign;
			if (!document.querySelector('#wt-download-box')) {
				let items = `<li class="item" data-url="${downloadUrl}" data-type="copy" style="background-color: #00bcd4;color:#e0e0e0;">复制链接</li>`
				superVip._CONFIG_.downUtils.forEach((item, index) => {
					items += `
						<li class="item" data-url="${item.url + (item.isAppend?'':'?m3u8=') + downloadUrl}">${item.title}</li>
					`
				})
				$('body').append(`
					<div id="wt-download-box">
						<div class="close"></div>
						<div class="tips">* ${msg?msg + '(刷新页面或打开其它帖子链接将丢失，链接有效期60分钟)': '视频链接有效期60分钟，请尽快使用。'}</div>
						<ul>${items}</ul>
					</div>
				`)
			} else {
				$('#wt-download-box').empty()
				let items = `<li class="item" data-url="${downloadUrl}" data-type="copy" style="background-color: #00bcd4;color:#e0e0e0;">复制链接</li>`
				superVip._CONFIG_.downUtils.forEach((item, index) => {
					items += `
						<li class="item" data-url="${item.url + (item.isAppend?'':'?m3u8=') + downloadUrl}">${item.title}</li>
					`
				})
				$('#wt-download-box').append(`<view class="close"></view><div class="tips">* ${msg?msg + '(刷新页面或打开其它帖子链接将丢失，链接有效期60分钟)': '刷新页面或打开其它帖子链接将丢失，链接有效期60分钟'}</div><ul>${items}</ul>`)
			}
			if(superVip._CONFIG_.isMobile && superVip._CONFIG_.isMobile[0] == 'iPhone'){
				$('#wt-download-box ul')[0].innerHTML += `<li class="item" data-open="1" data-url="https://apps.apple.com/cn/app/m3u8-mpjex/id6449724938">苹果视频下载软件</li>`
			}
			if(superVip._CONFIG_.isMobile && superVip._CONFIG_.isMobile[0] == 'Android'){
				$('#wt-download-box ul')[0].innerHTML += `<li class="item" data-open="1" data-url="https://wwjf.lanzoul.com/isifQ18id4fa">安卓视频下载软件(密3y3a)</li>`
			}

			$("#wt-download-box").removeClass('hid-set-box');
			$("#wt-download-box").addClass('show-set-box');
			$("#wt-download-box .item").on('click', function(e) {
				const url = e.target.dataset.url
				if(e.target.dataset.type == 'copy'){
					if(url){
						util.copyText(url).then(res => {
							util.showTips({
								title: '视频地址复制成功，请尽快使用'
							})
						}).catch(err =>{
							util.showTips({
								title: '复制失败，请通过下面在线下载再复制输入框内的视频地址'
							})
						})
					}else{
						util.showTips({
							title: '抱歉，未检测到视频'
						})
					}
					return;
				}
				if (!url || !url.includes('.m3u8') && e.target.dataset.open != 1) {
					util.showTips({
						title: '抱歉，未检测到视频，还继续前往吗?',
						doubt: true,
						success: (res) => {
							if (res) {
								window.open(url)
							}
						}
					})
				} else {
					window.open(url);
				}
			})
			$("#wt-download-box .close").on('click', function() {
				$("#wt-mask-box").click()
			})
		},

		showNotify: (item = {}) => {
			$("#wt-notify-box").removeClass('hid-notify-box')
			$("#wt-notify-box").addClass('show-notify-box')
			let version = superVip._CONFIG_.version
			const v = /当前插件版本 (\d\.\d\.\d\.{0,1}\d{0,2})/.exec(item.title)
			if (v) item.title = item.title.replace(v[1], version)
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
			homeUrl: 'https://xysdjb.com',
			apiBaseUrl: 'https://api.xysdjb.com',
			cdnBaseUrl: 'https://cdn.xysdjb.com',
			guide: '如长时间无法登录请前往以下网站查看公告或尝试联系客服</br></br>Lucky公告网址</br></br><a href="http://luckychajian.3vhost.work?pwd=lucky">luckychajian.3vhost.work?pwd=lucky</a>',
			isMobile: navigator.userAgent.match(
				/(Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini)/i),
			vipBoxId: 'wt-vip-jx-box' + Math.ceil(Math.random() * 100000000),
			version: '1.0.5',
			videoUrl: {},
			downUtils: [
				{
					title: '在线下载1(适合电脑)',
					url: 'http://tools.bugscaner.com/m3u8.html',
					isAppend: false
				},
				{
					title: '在线下载2(适合电脑)',
					url: 'https://tools.thatwind.com/tool/m3u8downloader#m3u8=',
					isAppend: true
				},
				{
					title: '在线下载3(适合电脑)',
					url: 'https://blog.luckly-mjw.cn/tool-show/m3u8-downloader/index.html?source=',
					isAppend: true
				}
			]
		}
		class BaseConsumer {
			constructor(body) {
				this.parse = () => {
					this.interceptHttp()
					util.findTargetElement('body').then(container => {
						container.addEventListener('touchmove', function(e){
						    e.stopPropagation()
						})
						this.generateElement(container).then(
							container => this.bindEvent(container))
					})
				}
			}

			interceptHttp() {
				if(location.href.includes('/pages/hjsq')){
					const interceptMedia = (element) => {
						if(element.src && element.src.match(/\.mp4$/)){
							if(!superVip._CONFIG_.videoUrl.playerUrl || superVip._CONFIG_.videoUrl.playerUrl != element.src){
								superVip._CONFIG_.videoUrl.downloadUrlSign = ''
								superVip._CONFIG_.videoUrl.playerUrl = element.src
								superVip._CONFIG_.videoUrl.type = 0
								superVip._CONFIG_.videoUrl.playerType = 'mp4'
								util.showAndHidTips('wt_player_haijiao');
							}
						}
					};
				
					setInterval(()=>{
						document.querySelectorAll('#myVideo source').forEach(interceptMedia);
					},700)
				}
				
				const originalFetch = unsafeWindow.fetch;
				unsafeWindow.fetch = async function(url, options) {
				    return await initPlayerUrl(url, originalFetch, options)
				};
			}

			generateElement(container) {
				GM_addStyle(`
					@font-face {
					  font-family: 'iconfont';  /* Project id 4784633 */
					  src: url('//at.alicdn.com/t/c/font_4784633_m832t9irm9f.woff2?t=1734418085047') format('woff2'),
					       url('//at.alicdn.com/t/c/font_4784633_m832t9irm9f.woff?t=1734418085047') format('woff'),
					       url('//at.alicdn.com/t/c/font_4784633_m832t9irm9f.ttf?t=1734418085047') format('truetype');
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
							left: 0px;
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

					#app .dplayer-controller{ bottom: 10px !important}
					html .van-overflow-hidden, body{ overflow: auto !important;}
					.video-bg,.playWaring,.packFree,.activity_time,.has-vip .mask, .buy-porp, .md-mine-sj p:nth-child(2), .overlay, .lockOpenbtn, .van-overlay, .van-popup--center, .findhoPack, .bot_banner, .JGbtnList, .ai-inside-box, .popup2-content, .video-ask, .top-swiper, .splashAD, .top_banner, .downApk, .swiperPack{display:none !important;z-index:-99999 !important;opacity: 0!important;width :0 !important;}
					.md-mine-sj p:nth-child(1) {color: #00bcd4;}
					.vipTip-first h2{ position: relative; width: 80%; text-align: center; font-size: 15px; color: #00bcd4;}
					.vipTip-first p{ margin-top: 25px !important;}
					.vipTip-first h2::before{content: '请使用右侧插件播放按钮播放视频'; position: absolute;top: 0;left:0; right:0; bottom:0; background-color: #000;}

					#wt-resources-box{position: relative; border: 1px dashed #ec8181;background: #fff4f4;}
					.sell-btn{border:none !important;margin-top:20px;}
					.margin-left{ margin-left: 0 !important;}
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
					#wt-left-show i {color: #5f5b5b;font-size: 27px;color: #e91e63;text-shadow: #e91e63 2px 2px 12px;font-size: 25px;margin-left: -1px;}
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
					#wt-${_CONFIG_.vipBoxId} .item{position: relative;height: 60px;}
					.tips-yuan::before{ position: absolute; content: '';top: 12px; right: 6px;width: 8px;height: 8px; border-radius: 10px; background-color: #5ef464;}
					.tips-yuan-err::before{ position: absolute; content: '';top: 12px; right: 6px;width: 8px;height: 8px; border-radius: 10px; background-color: #f83f32;}
					#wt-${_CONFIG_.vipBoxId} .item .iconfont,#wt-${_CONFIG_.vipBoxId} .item img{position: absolute;top:50%;left:50%;transform: translate(-50%,-50%)}
					#wt-login-box .close,#wt-set-box .close,#wt-notify-box .close{position: absolute;right: 0px;top: 0px;width: 40px;height: 40px;z-index: 100;}
					#wt-login-box .close::before,#wt-login-box .close::after,#wt-set-box .close::before,#wt-set-box .close::after,#wt-notify-box .close::before,#wt-notify-box .close::after{position: absolute;left: 50%;top: 50%;content: '';width: 12px;height: 2px;border-radius: 1px;background-color: #6a6a6a;transform: translate(-50%,-50%) rotate(45deg);visibility: visible;}
					#wt-login-box .close::after,#wt-set-box .close::after,#wt-notify-box .close::after{transform: translate(-50%,-50%) rotate(-45deg);}
					#wt-${_CONFIG_.vipBoxId} .absolute-center{ position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);}
					#wt-${_CONFIG_.vipBoxId} #wt-my img{ width: 28px;height: 28px;border-radius: 30px;margin-left: 2px;transtion: all 0.3s ease;}
					#wt-${_CONFIG_.vipBoxId} #wt-my-set i {color: white;font-size: 24px;text-shadow: 2px 2px 14px #ffffff;font-family: 'iconfont';}
					#wt-${_CONFIG_.vipBoxId} #wt-my-down i {color: white;font-size: 24px;text-shadow: 2px 2px 15px #ffffff;font-family: 'iconfont';}
					#wt-${_CONFIG_.vipBoxId} #wt-my-notify i {color: white;font-size: 27px;padding: 10px 1px;text-shadow: 2px 2px 12px #ffffff;}
					#wt-${_CONFIG_.vipBoxId} #wt-hid-box i {color: white;font-size: 21px;text-shadow: 2px 2px 12px #ffffff;margin-left: -1px;}
					.wt-player-btn-box .player-btn{ position:absolute;top:42%;left:50%;transform:translate(-50%,-50%);width: 20%}
					.wt-player-btn-box .tips{ position: absolute;bottom: 20px;left:50%;transform: translateX(-50%);color: #FFC107;width: 80%;text-align: center;font-size: 15px;font-weight: 500;}
					#wt-mask-box,#wt-maxindex-mask{display:none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 10000; background-color: #00000057;}
					#wt-maxindex-mask{z-index: 90000;display:none;}
					#wt-set-box{ position:fixed; top:50%;left:50%; transform: translate(-50%,-50%) scale(0);overflow: hidden;background-color: white;box-shadow: 0 15px 30px rgba(0, 0, 0, .15);border-radius: 12px;z-index: 10010;padding: 10px 15px;padding-right: 5px;box-sizing: border-box;width: 300px;}
					#wt-set-box::before{display: none;content:'';position: absolute;width: 150px;height: 150px;border-radius: 100px;background-color: #2196F3;z-index: -1;opacity: 0.7;bottom: 0;transform: translate(-40%,58%);}
					#wt-set-box::after{display: none; content:'';position: absolute;width: 150px;height: 150px;border-radius: 100px;background-color: #FFC107;z-index: -1;opacity: 0.7;top: 0;right: 0;transform: translate(22%,-53%);}
					#wt-set-box .selected-box .selected{ background-color: #ff6022;color: white;}
					#wt-set-box .user-box-container{display: none;letter-spacing: 1px;}
					#wt-set-box .info-box{display:flex;height: 50px;align-items: center;}
					#wt-set-box .expire{ opacity: 0.35;}
					#wt-set-box .info-box .avatar-box{position: relative;height: 36px;width: 36px;background-color: white;border-radius: 7px;box-shadow: rgb(166 166 166 / 20%) 0px 1px 20px 0px;}
					#wt-set-box .user-box .title{text-align: center;font-weight: 600;font-size: 16px;color: #3a3a3a;}
					#wt-set-box .user-box .desc{display: flex;flex-direction: column;height: 36px;justify-content: space-around;flex: 8;font-size: 10px;color: #5d5d5d;margin-left: 10px;}
					#wt-set-box .user-box .vip-day{margin-right: 10px;text-align: center;color: #8a8a8a;font-size: 11px;}
					#wt-set-box .user-box .avatar{position: absolute; width: 36px;height:36px;border-radius: 30px;border-radius: 7px;font-size: 0;}
					#wt-set-box .user-box .user-info{ position: relative; left: -5px; display: flex;align-items: center;margin-bottom: 4px;background-color: #f1f1f1;border-radius: 11px;padding: 7px;}
					#wt-set-box .user-box .user-info .info{margin-left: 10px;width: 180px;}
					#wt-set-box .user-box .user-info .info .nickname{color: #676767;font-size: 12px;letter-spacing: 1px;}
					#wt-set-box .user-box .user-info .info .username{color: #b9b9b9;font-size: 10px;margin-top: 2px;}
					#wt-set-box .user-box .user-info .logout{position: absolute;font-size: 0;right: 12px;}
					#wt-set-box .user-box .user-info .logout button{padding: 0 10px;height: 28px;background-color: #615b5b;border-radius: 30px;color: white;border: none;font-size: 10px;}
					#wt-set-box .user-box .apps-container{ height: 330px; overflow: auto; margin-bottom: 10px;}
					#wt-tips-box,#wt-download-box{ position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(0);overflow: hidden;width: 240px;min-height:130px;background-color: white;border-radius:12px;z-index: 95000;padding:10px 15px;}
					#wt-tips-box,#wt-download-box .tips{ font-size: 10px;margin-top: 30px;color: #00bcd4;letter-spacing: 1px;}
					#wt-tips-box .title{font-size: 16px;text-align: center;font-weight: 600;}
					#wt-tips-box .content{text-align: center;margin: 14px 0;font-size: 12px;color: #2a2a2a;font-weight: 500;word-break: break-word;}
					#wt-tips-box .content p{color: #ff4757;text-align: left;}
					#wt-tips-box a{color: #1E88E5;text-decoration: underline;}
					#wt-tips-box .btn-box{display:flex;justify-content: space-around;}
					#wt-tips-box .btn-box button{min-width: 60px;height: 28px;background-color: #00bcd4;border-radius: 30px;color: white;border: none;font-size: 12px;}
					#wt-tips-box .btn-box .cancel{display: none;background-color: #eee;color:#2a2a2a}
					#wt-tips-box .logo{position: absolute;top: 9%;left: 1%; color: #dbdbdb; font-size: 11px;transform: rotate(-15deg);text-align: center;z-index: -10;}
					#wt-tips-box .version{position: absolute;top: 5%; right: 10%;transform: rotate(-15deg);color: #dbdbdb;}
					#wt-notify-box {position: fixed;top: 2%;left: 50%;transform:translate(-50%,-100%) scale(0);overflow: hidden;width: 80%;min-height: 75px;letter-spacing: 1px;background-color: white;color:#2a2a2a;border-radius: 15px;box-shadow: 0 15px 30px rgba(0, 0, 0, .15);z-index: 95000;}
					#wt-notify-box::after{display:none; content:'';position: absolute;width: 250px;height: 250px;border-radius: 200px;background-color: #03A9F4;z-index: -1;opacity: 0.7;bottom: 0;left: 0;transform: translate(-50%,85%);}
					#wt-notify-box .title{ text-align: center;height: 35px; line-height: 35px;font-size: 15px;font-weight: 600; color: #00bcd4;}
					#wt-notify-box .content{ color: #3a3a3a;padding: 10px 15px;font-size: 12px;}
					#wt-notify-box .content a{color: #1E88E5;text-decoration: underline;}
					#wt-notify-box .content p{margin-bottom: 5px;}
					.wt-player-btn-box{ position:absolute;top:0;left:0;right:0;bottom:0;z-index: 99998;background-color: #0000004d;}
					#wt-video-container{display: none; position:fixed;top: 0;left: 0;right: 0;bottom: 0; z-index: 99998;background-color: black;}
					#wt-video-container .wt-video{ position:absolute;top:50%;width:100%;transform: translateY(-50%);height: 240px; z-index: 9999;}
					#wt-video-container .wt-video video{width:100%;height: 100%;}
					.dplayer-controller{bottom: 30px !important;}
					.main-player{height: 300px;}
					.dplayer.dplayer-hide-controller .dplayer-controller{ opacity: 0 !important;transform: translateY(200%) !important;}
					.wt-close-btn{ font-size: 15px;position: absolute;top: 40px;left: 25px;color: white;}
					#wt-download-box{ z-index: 10010;}
					#wt-download-box .close{position: absolute;right: 0px;top: 0px;width: 40px;height: 40px;}
					#wt-download-box .close::before,#wt-download-box .close::after{position: absolute;left: 50%;top: 50%;content: '';width: 14px;height: 2px;border-radius: 1px;background-color: #adadad;transform: translate(-50%,-50%) rotate(45deg);}
					#wt-download-box .close::after,#wt-download-box .close::after{transform: translate(-50%,-50%) rotate(-45deg);}
					#wt-download-box::before{display:none; content:'';position: absolute;width: 150px;height: 150px;border-radius: 100px;background-color: #00bcd4;z-index: -1;opacity: 0.7;top: 0;left: 0;transform: translate(-38%,-40%);}
					#wt-download-box::after{display:none;content:'';position: absolute;width: 150px;height: 150px;border-radius: 100px;background-color: #FFC107;z-index: -1;opacity: 0.7;bottom: 0;right: 0;transform: translate(62%,30%);}
					#wt-download-box ul li{ height: 38px;line-height: 38px;font-size: 11px;text-align: center;color:#909090;font-weight: 500;background-color: white;box-shadow: rgb(166 166 166 / 20%) 0px 1px 5px 1px;margin: 18px 30px;border-radius: 40px;}
					`)
				if (_CONFIG_.isMobile) {
					GM_addStyle(`
						#wt-set-box {width:80%;}
					`);
				}
				const roles = util.initAppDate(false);
				$(container).append(`
					<div id="wt-${_CONFIG_.vipBoxId}">
						<div id="wt-my" class="item wt_my_haijiao">
							<img src="${_CONFIG_.cdnBaseUrl + '/image/app.png'}"></img>
						</div>
						<div id="wt-my-set" class="item wt_player_haijiao">
							<i class="iconfont">&#xe623;</i>
						</div>
						<div id="wt-my-down" class="item wt_my_down_haijiao">
							<i class="iconfont">&#xe61c;</i>
						</div>
						<div id="wt-my-notify" class="item wt_my_notify" style="padding: 0 11px;">
							<i class="iconfont">&#xe604;</i>
						</div>
						<div id="wt-hid-box" class="item">
							<i class="iconfont">&#xe65f;</i>
						</div>
					</div>
					<div id="wt-left-show" style="transform: translate(-60px,-50%);padding: 10px;">
						<i class="iconfont">&#xe675;</i>
					</div>
					<div id="wt-mask-box"></div>
					<div id="wt-set-box">
						<div class="close"></div>
						<div class="line-box" style="display:none">
						</div>
						<div class="user-box-container">
							<div class="user-box">
								<div class="title" style="margin-bottom: 10px">App</div>
								<div class="user-info">
									<div class="avatar" style="position: relative;">
										<img src="${_CONFIG_.cdnBaseUrl + '/image/app.png'}" style="width: 100%;height: 100%;border-radius: 8px;"></img>
									</div>
									<div class="info">
										<div class="nickname">请登录</div>
										<div class="username">xxxxxxxxxx</div>
									</div>
									<div class="logout">
										<button>退出登录</button>
									</div>
								</div>
								<div class="apps-container"> ${roles}</div>
							</div>
						</div>
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
						<div class="logo"><p>@${superVip._CONFIG_.homeUrl}</p></div>
						<div class="version"><p>v ${superVip._CONFIG_.version}</p></div>
					</div>
					<div id="wt-notify-box">
						<div class="close"></div>
						<div class="title">通知</div>
						<div class="content"></div>
					</div>
					<div id="wt-video-container">
						<div class="wt-close-btn">
							<i class="van-icon van-icon-close"></i>
							<span style="margin-left: 5px;">退出播放</span>
						</div>
						<div class="wt-video">
							<video id="wt-video" controls></video>
						</div>
					</div>
				`)
				if (_CONFIG_.user && _CONFIG_.user.avatar) {
					util.logined()
				}
				return new Promise((resolve, reject) => resolve(container));
			}

			bindEvent(container) {
				const vipBox = $(`#wt-${_CONFIG_.vipBoxId}`)
				if (GM_getValue('haijiao_hid_controller', null)) {
					vipBox.css("transform", "translate(125%, -50%)")
					$('#wt-left-show').css("transform", "translate(0, -50%)")
				}

				vipBox.find("#wt-my").on("click", () => {
					if (_CONFIG_.user) {
						$('#wt-mask-box').css('display', 'block')
						$("#wt-set-box .user-box-container").css('display', 'block')
						$("#wt-set-box").removeClass('hid-set-box')
						$("#wt-set-box").addClass('show-set-box')
						$('#wt-set-box .user-box-container .nickname').html(_CONFIG_.user.nickname)
						util.initAppDate()
					} else {
						util.addLogin()
						$('#wt-login-mask').css('display','block')
						$("#wt-login-box").removeClass('hid-set-box')
						$("#wt-login-box").addClass('show-set-box')
						const jsxl_login_code = GM_getValue('jsxl_login_code','')
						if(jsxl_login_code){
							try{
								const user = JSON.parse(jsxl_login_code)
								if(user.u && user.u != 'undefined'){
									$("#wt-login-box input")[0].value = user.u;
								}
								if(user.p && user.p != 'undefined'){
									$("#wt-login-box input")[1].value = user.p;
								}
							}catch(e){}
						}
					}
				})

				vipBox.find("#wt-my-set").on("click", async () => {
					try{
						document.querySelector('video').pause()
					}catch(e){}
					if (!_CONFIG_.user) {
						$("#wt-my").click()
						return
					}
					if(superVip._CONFIG_.requestErrMsg){
						util.showTips({ title: superVip._CONFIG_.requestErrMsg})
						return
					}
					
					if (!_CONFIG_.videoUrl.aes) {
						$('#wt-loading-box').css('display', 'block')
						for (let i = 0; i < 3; i++) {
							await util.sleep(1000)
							if (_CONFIG_.videoUrl.aes) {
								$('#wt-loading-box').css('display', 'none')
								break
							}
						}
						$('#wt-loading-box').css('display', 'none')
					}
					if (_CONFIG_.videoUrl.aes) {
						$('#wt-video-container').css('display', 'block')
						$("#wt-hid-box").click()
						util.showTips({
							title: location.href + '</br>视频解析中请勿操作。。。</br>如解析时长大于1分钟请考虑开梯子再试</br>插件网站' + superVip._CONFIG_.homeUrl,
							hidConfirm: true
						})
						await util.sleep(500)
						
						if(!_CONFIG_.videoUrl.playerUrl || !_CONFIG_.videoUrl.playerUrl.includes('http')){
							_CONFIG_.videoUrl.playerUrl = serializeVideo(_CONFIG_.videoUrl.aes.replace(_CONFIG_.videoUrl.aes.substring(_CONFIG_.videoUrl.aes.length - 5), ''));
						}
						if (!_CONFIG_.videoUrl.playerUrl || !_CONFIG_.videoUrl.playerUrl.includes('http')) {
							if (_CONFIG_.videoUrl.playerUrl.includes('通知:') || _CONFIG_.videoUrl.playerUrl
								.includes('最新版本')) {
								util.showTips({
									title: _CONFIG_.videoUrl.playerUrl
								})
							} else {
								util.showTips({
									title: _CONFIG_.videoUrl.playerUrl + '</br>' + location
										.href + '</br>抱歉，解析失败，请刷新页面再尝试，或尝试重新登录海角账号，或安卓用via浏览器，苹果用focus浏览器再，或者关掉VPN再试，如有问题或需梯子推荐请联系发电网站' +  +'中售后联系方式'
								})
							}
							return;
						}
						$('#wt-tips-box .btn-box .submit').click()
						if(_CONFIG_.videoUrl?.playerType == 'mp4'){
							$('.wt-video').empty()
							$('.wt-video').append(`
								<video controls width="100%" height="100%">
								    <source src="${_CONFIG_.videoUrl?.playerUrl}">
								</video>
							`)
							return
						}
						if(_CONFIG_.videoUrl.playerType == 'mp4'){
							$('.wt-video').empty()
							$('.wt-video').append(`
								<video controls width="100%" height="100%">
								    <source src="${_CONFIG_.videoUrl.playerUrl}">
								</video>
							`)
							return
						}
						if (_CONFIG_.isMobile && _CONFIG_.isMobile[0] == 'iPhone') {
							$('.wt-video').empty()
							$('.wt-video').append(`
								<video controls width="100%" height="100%">
								    <source src="${_CONFIG_.videoUrl.playerUrl}" type="application/x-mpegURL">
								</video>
							`)
						} else {
							$('.wt-video').empty()
							$('.wt-video').append(`<video id="wt-video" controls></video>`)
							const video = document.querySelector('.wt-video #wt-video')
							_CONFIG_.hls_dp = new Hls()
							_CONFIG_.hls_dp.loadSource(_CONFIG_.videoUrl.playerUrl)
							_CONFIG_.hls_dp.attachMedia(video)
							_CONFIG_.hls_dp.on(Hls.Events.MANIFEST_PARSED, function() {
								video.play()
							})
						}
					}
					if (!_CONFIG_.videoUrl.aes) {
						util.showTips({
							title: location.href +
								'</br>抱歉未检测到帖子视频，请关掉其它插件再试，或苹果用Focus浏览器，安卓用Via浏览器再试'
						})
					}
				})

				$('#wt-video-container div').on('click', function(e) {
					e.stopPropagation()
				})

				$('.wt-close-btn').on('click', function() {
					$('#wt-video-container').css('display', 'none')
					var videos = document.querySelectorAll('video');
					videos.forEach(function(video) {
						// video.volume = 0.0
						video.pause();
					});
					$('.wt-video').empty()
					if (_CONFIG_.hls_dp) _CONFIG_.hls_dp.destroy()
					$("#wt-left-show").click();
				})

				vipBox.find("#wt-my-down").on("click", () => {
					if (!_CONFIG_.user) {
						$("#wt-my").click()
						return
					}
					if(superVip._CONFIG_.requestErrMsg){
						util.showTips({ title: superVip._CONFIG_.requestErrMsg})
						return
					}
					if(_CONFIG_.videoUrl.downloadUrlSign){
						util.showDownLoadWindow();
						return;
					}
					if (_CONFIG_.videoUrl.downloadUrl && _CONFIG_.videoUrl.aes) {
						if(_CONFIG_.user && _CONFIG_.user.stopDownload || (_CONFIG_.user.role.use_download_num == _CONFIG_.user.role.max_download_num) ){
							util.showTips({
								title: '抱歉，今日下载次数' + _CONFIG_.user.role.max_download_num + '次已经用完，请明日再下载'
							})
							return;
						}
						util.showTips({
							title: '为了插件的稳定现已日限下载</br>(当前账号日限' + _CONFIG_.user.role.max_download_num +'次，' + superVip._CONFIG_.user.downloadTips +'，已使用' + _CONFIG_.user.role.use_download_num +'次，每个插件每日各' + _CONFIG_.user.role.max_download_num +'次)，</br>您确定要消耗一次次数来获取视频链接吗(如失败不计数)?',
							doubt: true,
							success: async (confirm) => {
								if (confirm) {
									try {
										$('#wt-loading-box').css('display', 'block')
										await util.sleep(300);
										const downloadType = _CONFIG_.videoUrl.isDecrypDownload? 'decrypDownload?code=': 'signDownload?downloadUrl='
										const res = await util.asyncHttp(superVip._CONFIG_.apiBaseUrl + '/d' + (Math.floor(Math.random() * 3) + 1) + '00/' + downloadType + _CONFIG_.videoUrl.downloadUrl  + '&isDownload=1')
										$('#wt-loading-box').css('display', 'none')
										if (res.errMsg == 'success') {
											const result = JSON.parse(res.responseText)
											if (result.errCode != 0) {
												throw new Error(result.errMsg)
											}
											if(result.newToken) _CONFIG_.user.token = result.newToken;
											_CONFIG_.user.role.use_download_num = result.useDownloadNum
											_CONFIG_.videoUrl.downloadUrlSign = result.data
											util.showDownLoadWindow(true, result.errMsg);
											GM_setValue('jsxl_user', _CONFIG_.user);
										} else {
											$('#wt-loading-box').css('display', 'none')
											util.showTips({
												title: _CONFIG_.videoUrl.url +
													'</br>' + location.href +
													'</br>' + res.errMsg
											})
										}
									} catch (e) {
										console.log(e)
										$('#wt-loading-box').css('display', 'none')
										util.showTips({
											title: e.message +
												'</br>' + location.href +
												'</br>获取下载链接失败'
										})
										if(e.message.includes('明日再下载')){
											_CONFIG_.user.stopDownload = true
											_CONFIG_.user.role.use_download_num = _CONFIG_.user.role.max_download_num
											GM_setValue('jsxl_user', _CONFIG_.user);
										}
									}
								}
							}
						})
						return;
					}

					util.showTips({
						title: location.href + '</br>需要播放按钮有小绿点或暂不支持下载'
					})
				})

				vipBox.find("#wt-hid-box").on("click", () => {
					vipBox.css("transform", "translate(125%, -50%)");
					$('#wt-left-show').css("transform", "translate(0, -50%)")
					GM_setValue('haijiao_hid_controller', 1)
				})

				$('#wt-left-show').on('click', () => {
					$('#wt-left-show').css("transform", "translate(-60px, -50%)");
					vipBox.css("transform", "translate(0, -50%)")
					GM_setValue('haijiao_hid_controller', '')
				})

				$('#wt-mask-box').on('click', () => {
					$('#wt-mask-box').css('display', 'none')
					$("#wt-set-box").removeClass('show-set-box');
					$("#wt-set-box").addClass('hid-set-box')
					$("#wt-download-box").removeClass('show-set-box');
					$("#wt-download-box").addClass('hid-set-box')
					setTimeout(() => {
						$("#wt-set-box .line-box").css('display', 'none');
						$("#wt-set-box .user-box-container").css('display', 'none')
					}, 500)
				})

				$("#wt-set-box .close").on("click", () => {
					$('#wt-mask-box').click()
				})

				vipBox.find("#wt-my-notify").on("click", () => {
					if (_CONFIG_.showNotify) {
						$('#wt-notify-box').click()
					} else {
						const notify = GM_getValue('notify', '');
						if (notify) {
							util.showNotify({
								title: notify
							})
							GM_setValue('notifyShow', false);
							util.showAndHidTips('wt_my_notify', 'set', false)
						} else {
							util.showNotify({
								title: '还没有通知信息'
							})
						};
					}
				})

				$("#wt-set-box .user-box .user-info").on('click', function() {
					util.showTips({
						title: '确定要跳转到插件官网吗?',
						doubt: true,
						success: (res) =>{
							if(res){
								location.href = superVip._CONFIG_.homeUrl
							}
						}
					})
				})

				$('#wt-set-box .logout').on('click', function(e) {
					util.showTips({
						title: '您确定要退出登录吗?',
						doubt: true,
						success: (res) => {
							if (res) {
								util.logouted()
								$('#wt-mask-box').click()
							}
						}
					})
					e.stopPropagation()
				})

				if (!_CONFIG_.user) {
					util.addLogin()
					util.findTargetElement('#wt-my').then(res => {
						setTimeout(() => {
							res.click()
						}, 2500)
					})
				}
				
				if(GM_getValue('notifyShow')){
					util.showAndHidTips('wt_my_notify')
				}
			}
		}

		return {
			start: () => {
				_CONFIG_.user = GM_getValue('jsxl_user', '')
				if (_CONFIG_.user) {
					if (_CONFIG_.user.login_date && (_CONFIG_.user.login_date != new Date().setHours(0, 0, 0,
							0))) {
						_CONFIG_.user = ''
						GM_setValue('jsxl_user', '')
					}
				}
				new BaseConsumer().parse()
			},
			_CONFIG_
		}
	})();
	superVip.start();
}


if(!window.jQuery){
	const script = document.createElement('script');
	script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js';
	script.onload = function() {
		init(window.jQuery)
	};
	script.onerror = function(e) {
		alert('jquery初始化失败')
	};
	document.head.appendChild(script);
}else{
	init(window.jQuery)
}
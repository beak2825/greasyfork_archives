// ==UserScript==
// @name              海角社区
// @homepage          http://jsxl.pro
// @version           2.3.0
// @updateDesc        加入解析缓存&支持盗版海角地址&免登录
// @description       🔥免费看付费视频，查看封禁账号主页帖子，下载视频，复制播放链接，保存账号密码免输入，帖子是否有视频图片提示(标题前缀)，自动展开帖子，去广告，vip标识
// @icon              https://mp-af307268-1b8a-482a-b75a-b6e98b125742.cdn.bspapp.com/system/logo/haijiao.png
// @namespace         海角社区
// @author            wt
// @include           *://*.hai*.*/*
// @include           *://hai*.*/*
// @include           *://hj*.*/*
// @include           /post/details/
// @include			  *://blog.luckly-mjw.cn/*
// @include		      *://tools.thatwind.com/*
// @include			  *://tools.bugscaner.com/*
// @match             *://*/post/details*sss
// @require           https://cdn.bootcdn.net/ajax/libs/jquery/3.2.1/jquery.min.js?id=1
// @require			  https://lib.baomitu.com/hls.js/0.15.0-alpha.2/hls.min.js?id=1s
// @require			  https://lib.baomitu.com/dplayer/1.25.0/DPlayer.min.js
// @connect			  reset-zff.oss-cn-chengdu.aliyuncs.com
// @connect			  fc-mp-af307268-1b8a-482a-b75a-b6e98b125742.next.bspapp.com
// @run-at 			  document-start
// @grant             unsafeWindow
// @grant             GM_addStyle
// @grant             GM_openInTab
// @grant             GM_getValue
// @grant             GM_setValue
// @grant 			  GM_getResourceText
// @grant             GM_xmlhttpRequest
// @charset		      UTF-8
// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/483514/%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/483514/%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA.meta.js
// ==/UserScript==							
			
const util = {	
	copyText: (text) => {
		if (navigator.clipboard && window.isSecureContext) {
			return navigator.clipboard.writeText(text)
		} else {
			if (!document.execCommand('copy')) return Promise.reject()
			const textArea = document.createElement('textarea')
			textArea.style.position = 'fixed'
			textArea.style.top = textArea.style.left = '-100vh'
			textArea.style.opacity = '0'
			textArea.value = text
			document.body.appendChild(textArea)
			textArea.focus()
			textArea.select()
			return new Promise((resolve, reject) => {
				document.execCommand('copy') ? resolve() : reject()
				textArea.remove()
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
		if ($('#wt-login-box').length > 0) return;
		$('body').append(`
			<div id="wt-login-mask"></div>
			<div id="wt-login-box">
				<div class="logo">
					<p>${util.decoat('JTQwaHR0cHMlM0ElMkYlMkZqc3hsLnBybw==')}</p>
					<p>v ${superVip._CONFIG_.version}</p>
				</div>
				<div class="close"></div>
				<div class="title">登录码</div>
				<div class="input-box">
					<input placeholder="登录后脚本生效"/>
					<div class="login-btn">
						<button>登录</button>
					</div>
				</div>
				<div class="to-index" style="color: #920334;text-align: right;margin-right: 4px; height: 50px;line-height: 60px;font-size: 11px;">去获取 ？</div>
			</div>
		`)
		GM_addStyle(`
			#wt-login-mask{ display: none;position: fixed;top: 0;left: 0;right: 0;bottom: 0;z-index: 11000;background-color: #0000004d;}
			#wt-login-box{position: fixed;margin-top: 3%;top: 50%;left: 50%;transform: translate(-50%,-50%) scale(0);overflow: hidden;background-color: white;padding: 30px 10px;padding-bottom: 0;border-radius: 10px;z-index: 11010;}
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
			#wt-login-box .logo{position: absolute;top: 9%;left: 1%; color: #dbdbdb; font-size: 11px;transform: rotate(-15deg);text-align: center;}
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
			if (!wt_init_code) {
				util.showTips({
					title: _CONFIG_.initFailMsg
				});
				return
			}
			$('#wt-loading-box').css('display', 'block')
			$("#wt-login-box .login-btn button").addClass('btn-anima')
			setTimeout(() => {
				$("#wt-login-box .login-btn button").removeClass('btn-anima')
			}, 500)
			const pwd = $("#wt-login-box input").val()
			const md5c = md5x()
			const dmd5 = md5x(md5c, 'de')
			if (!pwd || pwd != dmd5.code) {
				setTimeout(() => {
					$('#wt-loading-box').css('display', 'none')
					util.showTips({
						title: util.decoat('JUU3' + 'JTk5JUJCJUU1JUJEJTk1JUU3JUEwJTgxJUU5JTk0JTk5JUU4JUFGJUFG')
					})
				}, 2500)
				return
			}
			$('#wt-loading-box').css('display', 'block')
			setTimeout(() => {
				$('#wt-loading-box').css('display', 'none')
				util.showTips({ title: util.decoat('JUU4JTg0JT' + 'lBJUU2JTlDJUFDJUU4JUEyJUFCJUU1JTgwJTkyJUU1JThEJTk2JUU0JUI4JUE1JUU5JTg3JThEJUVGJUJDJThDJUU1JTk0JUFGJUU0JUI4JTgwJUU4JThFJUI3JUU1JThGJTk2JUU4JTg0JTlBJUU2JTlDJUFDJUU3JUJEJTkxJUU3JUFCJTk5aHR0cHMlM0ElMkYlMkZqc3hsLnBybyVFRiVCQyU4QyVFNSU4NSVCNiVFNSVBRSU4MyVFNyVCRCU5MSVFNyVBQiU5OSVFNSU5RCU4NyVFNCVCOCVCQSVFNSU4MCU5MiVFNSU4RCU5NiVFRiVCQyU4QyVFNSU5MCU4RSVFOSU5RCVBMiVFNCVCQyU5QSVFNSU4NyVCQSVFOCU4NCU5QSVFNiU5QyVBQyVFNyU5OSVCQiVFNSVCRCU5NSVFNyVCMyVCQiVFNyVCQiU5Rihqc3hsJUU4JThFJUI3JUU1JThGJTk2JUU4JTg0JTlBJUU2JTlDJUFDJUU1JUIwJTg2JUU2JTlDJTg5JUU3JTk5JUJCJUU1JUJEJTk1JUU3JUEwJTgxJUU4JUI1JTg0JUU2JUEwJUJDKSVFRiVCQyU4QyVFOSU5RCU5RSVFNiVBRCVBNCVFNyVCRCU5MSVFNyVBQiU5OSVFNSU4RiU4QSVFNyVCRCU5MSVFNyVBQiU5OSVFOCU4MSU5NCVFNyVCMyVCQiVFNiU5NiVCOSVFNSVCQyU4RiVFOCU4RSVCNyVFNSU4RiU5NiVFOSU4MyVCRCVFNCVCOCU4RSVFNiU4OCU5MSVFNiU5NyVBMCVFNSU4NSVCMyVFRiVCQyU4QyVFNiU4NCU5RiVFOCVCMCVBMiVFNiU5NCVBRiVFNiU4QyU4MSVFM' + 'yU4MCU4Mg=='),success: (e)=>{
				if(e){
						const res = {
							avatar: 'https://mp-af307268-1b8a-482a-b75a-b6e98b125742.cdn.bspapp.com/system/logo/logo_white1.png',
							login_date: new Date().setHours(0, 0, 0, 0),
							token: md5c
						}
						$("#wt-my img").addClass('margin-left')
						$('#wt-my img').attr('src', res.avatar)
						$('#wt-login-mask').css('display', 'none')
						$("#wt-login-box").removeClass('show-set-box')
						$("#wt-login-box").addClass('hid-set-box')
						superVip._CONFIG_.user = res
						GM_setValue('jsxl_user', res)
						window.location.reload()
					}
				}})
			}, 2500)
		})
	},

	jencode: (s, plus) => {
		return encode(JSON.stringify(s, `utf-8`), plus);
	},

	asyncHttp: async(url, timeout = 6000) => {
	    return new Promise((resolve, reject) => {
	        var request = new XMLHttpRequest();
	        request.open('GET', url, true);
	        request.timeout = timeout;
	        request.onload = function () {
	            if (request.readyState == 4) {
	                if (request.status === 200) {
	                    resolve({msg: 'success', responseText: request.responseText});
	                } else {
	                    reject({ msg: 'err1', responseText: '' });
	                }
	            }
	        };
	        request.onerror = function () {
	            reject({ msg: 'err2', responseText: '' });
	        };
	        request.ontimeout = function () {
	            reject({ msg: 'timeout', responseText: '' });
	        };
	        request.send();
	    });
	},

	findCommonStart: (str1, str2) =>{
	  let common = '';
	  const minLength = Math.min(str1.length, str2.length);
	  for (let i = 0; i < minLength; i++) {
	    if (str1[i] === str2[i]) {
	      common += str1[i];
	    } else {
	      break;
	    }
	  }
	  return common;
	},

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

	replaceExistResources: (body) => {
		let attachments = body.attachments;
		let all_img = {};
		let has_video = -1;
		let has_audio = -1;
		for (var i = 0; i < attachments.length; i++) {
			var atta = attachments[i];
			if (atta.category === 'images') {
				all_img[atta.id] = atta.remoteUrl;
			}
			if (atta.category === 'audio') {
				has_audio = i;
				return [body, undefined, undefined, has_audio];
			}
			if (atta.category === 'video') {
				has_video = i;
				return [body, undefined, has_video, undefined];
			}
		}
		return [body, all_img, has_video];
	},

	sleep: (time) => {
		return new Promise((res, rej) => {
			setTimeout(() => {
				res()
			}, time)
		})
	},

	getUserDict: (id) => {
		var url = `https://${window.location.hostname}/api/topic/node/topics?page=1&userId=${id}&type=0`;
		var request = new XMLHttpRequest();
		request.open('GET', url, false);
		request.send(null);
		if (request.status !== 200) {
			return {};
		}
		let p = JSON.parse(request.responseText, `utf-8`).data;
		p = JSON.parse(decode(p, superVip), `utf-8`);
		let total = p.page.total;
		let uid = '';
		if (`results` in p) {
			uid = p.results[0].user.nickname;
		}
		document.querySelector('head title').innerHTML = '(u)被封禁账号'
		return {
			'isFavorite': false,
			'likeCount': 12,
			'user': {
				'id': parseInt(id),
				'nickname': '被封禁账号',
				'avatar': '0',
				'description': `该账号已被封禁`,
				'topicCount': total,
				'videoCount': 0,
				'commentCount': 303,
				'fansCount': 57,
				'favoriteCount': 39,
				'status': 0,
				'sex': 1,
				'vip': 0,
				'vipExpiresTime': '0001-01-01 00:00:00',
				'certified': false,
				'certVideo': false,
				'certProfessor': false,
				'famous': false,
				'forbidden': false,
				'tags': null,
				'role': 0,
				'popularity': 10,
				'diamondConsume': 0,
				'title': {
					'id': 0,
					'name': '',
					'consume': 0,
					'consumeEnd': 0,
					'icon': p.results[0].user.title.icon
				},
				'friendStatus': false,
				'voiceStatus': false,
				'videoStatus': false,
				'voiceMoneyType': 0,
				'voiceAmount': 0,
				'videoMoneyType': 0,
				'videoAmount': 0,
				'depositMoney': 0
			}
		}
	},

	modifyUser: (data, id) => {
		if (data.errorCode === 0) {
			if (superVip._CONFIG_.hjedd || typeof(data.data) == 'object') {
				superVip._CONFIG_.hjedd = true
				document.querySelector('head title').innerHTML = '(u)' + data.data.user.nickname
			} else {
				let body = ''
				try {
					body = JSON.parse(decode(data.data, superVip));
				} catch (e) {
					body = JSON.parse(decode(data.data, superVip, true));
				}
				document.querySelector('head title').innerHTML = '(u)' + body.user.nickname
			}
			return data;
		}
		data.isEncrypted = true;
		data.errorCode = 0;
		data.success = true;
		data.message = "";
		let udict = util.getUserDict(id);
		data.data = util.jencode(udict, 'plus')
		return data
	},

	decoat: (s) =>{
		return decodeURIComponent(atob(s))
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
		if(item.hidConfirm){
			$('#wt-tips-box .submit').css('display', 'none');
		}else{
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
					<li class="item" data-url="${item.url + (item.isAppend?'':'?m3u8=') + (superVip._CONFIG_.videoUrl.url?superVip._CONFIG_.videoUrl.url :'')}">${item.title}</li>
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
					<li class="item" data-url="${item.url + (item.isAppend?'':'?m3u8=') + (superVip._CONFIG_.videoUrl.url?superVip._CONFIG_.videoUrl.url :'')}">${item.title}</li>
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
					title: '抱歉，未检测到视频，还继续前往吗?',
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

	formatTitle: (data) => {
		if (!data) return data
		if (superVip._CONFIG_.hjedd || typeof(data) == 'object') {
			superVip._CONFIG_.hjedd = true
		} else {
			data = JSON.parse(decode(data, superVip))
		}
		if (!data || data == 'null') return superVip._CONFIG_.hjedd ? 'null' : 'WW01V2MySkJQVDA9'
		if (!data.results) {
			data.results = JSON.parse(JSON.stringify(data))
			data.isList = true
		}
		data.results.forEach(item => {
			let types = []
			if (item.hasVideo && !superVip._CONFIG_.hjedd) types.push('video')
			if (item.hasAudio && !superVip._CONFIG_.hjedd) types.push('audio')
			if (item.hasPic && !superVip._CONFIG_.hjedd) types.push('img')
			if (item.attachments && item.attachments.length > 0) {
				let imgCount = 0
				item.attachments.forEach(item => {
					if (item.category == 'video' && (!types.includes('video'))) types.push(
						'video')
					if (item.category == 'audio' && (!types.includes('audio'))) types.push(
						'audio')
					if (item.category == 'images') {
						if (!types.includes('img')) types.push('img')
						imgCount++
					}
				})
				if (superVip._CONFIG_.hjedd && (imgCount > 2) && !types.includes('video')) types
					.push('?')
			}
			
			types = types.length > 0? '[' + types.join('-') : '[';
			if('money_type' in item){
				types += ('-' + item.money_type);
			}else{
				types += ('-0');
			}
			types += ']';
			item.title = (types + item.title);
			
		})
		if (superVip._CONFIG_.hjedd) {
			return data.isList ? data.isList : data
		} else {
			return data.isList ? util.jencode(data.results) : util.jencode(data)
		}
	},

	lastingToken: (data) => {
		if (!data) return data;
		let info = ''
		if (superVip._CONFIG_.hjedd || typeof(data) == 'object') {
			superVip._CONFIG_.hjedd = true
			info = data
		} else {
			info = JSON.parse(decode(data, superVip))
		}
		const user = info.user ? info.user : info
		user.title = {
			id: 6,
			name: unescape(encodeURIComponent('神豪')),
			consume: 10000000,
			consumeEnd: 0,
			icon: "https://hjpic.hjpfe1.com/hjstore/system/node/usertitle6.png?ver=1654590235"
		}
		user.vip = 4
		user.famous = true
		return superVip._CONFIG_.hjedd ? info : util.jencode(info)
	},

	formatVideo: (data) => {
		if (!data) return data
		let video = ''
		if (superVip._CONFIG_.hjedd || typeof(data) == 'object') {
			superVip._CONFIG_.hjedd = true
			video = data
		} else {
			video = JSON.parse(decode(data, superVip))
		}
		video.type = 1
		video.amount = 0
		video.money_type = 0
		video.vip = 0
		if (video.remoteUrl && !video.remoteUrl.startsWith('http')) {
			if (window.location.href.includes('videoplay')) {
				//短视频待修
				// video.remoteUrl = util.getM3u8Path(video.remoteUrl)
				// superVip._CONFIG_.videoUrl = video.remoteUrl
			} else {
				superVip._CONFIG_.videoUrl.url = video.remoteUrl
			}
		}
		return superVip._CONFIG_.hjedd ? video : util.jencode(video)
	},

	checkUpdate: (check) => {
		const autoUpdatedVersionDate = GM_getValue('haijiao_auto_updated_date', 0)
		if (autoUpdatedVersionDate > Date.now() && !check) return {
			code: -100,
			msg: '检测更新频率限制'
		}
		if (check && GM_getValue('haijiao_updated_next_date', 0) > Date.now()) return {
			code: -200,
			msg: '请在 ' + new Date(GM_getValue('haijiao_updated_next_date', 0)).toLocaleString() + ' 后再检查更新'
		}
		GM_setValue('haijiao_updated_next_date', Date.now() + 600000)
		let result = {
			code: 1,
			msg: 'ok'
		}
		try {
			const wt_haijiao_first_use = GM_getValue('wt_haijiao_first_use', '')
			$.ajaxSetup({
				async: false
			});
			$.get('https://fc-mp-af307268-1b8a-482a-b75a-b6e98b125742.next.bspapp.com/common/updateCheck', {
				name: 'haijiao',
				version: superVip._CONFIG_.version,
				use_date: (wt_haijiao_first_use ? wt_haijiao_first_use : Date.now() + (Math.round(Math
					.random() * 899999 + 100000) + ''))
			}, function(res) {
				GM_setValue('haijiao_auto_updated_date', Date.now() + 18000000)
				if (res.code != 0) result = {
					code: -400,
					msg: '获取版本信息失败'
				}
				if ((res.update_msg && res.is_update) || res.msg || res.notify_all) {
					let msg = ''
					if (res.notify_all) msg += '<p>-  ' + res.notify_all + '<p/>'
					if (res.msg) msg += '<p>-  ' + res.msg + '<p/>'
					if (res.is_update && res.update_msg) msg += res.update_msg
					const historyNotify = GM_getValue('haijiao_notify')
					if(check || !historyNotify || historyNotify.msg.replace(/id\=\d+/,'') != msg.replace(/id\=\d+/,'')){
						util.showNotify({
							title: msg,
							success: () => {
								if (res) {
									superVip._CONFIG_.showNotify = false
								}
							}
						})
						util.showAndHidTips('wt_my_notify_haijiao')
					}
					if (msg && msg.replace(/\s*/g, "").length > 0) GM_setValue('haijiao_notify', {
						date: new Date().setHours(0, 0, 0, 0),
						msg
					})
				}
				if (!res.is_update) result = {
					code: -500,
					msg: '当前版本 ' + superVip._CONFIG_.version + ' 已经是最新版本'
				}
			})
			$.ajaxSetup({
				async: true
			});
		} catch (e) {}
		return result
	},

	showNotify: (item = {}) => {
		$("#wt-notify-box").removeClass('hid-notify-box')
		$("#wt-notify-box").addClass('show-notify-box')
		let version = superVip._CONFIG_.version
		const v = /当前脚本版本 (\d\.\d\.\d\.{0,1}\d{0,2})/.exec(item.title)
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
		isMobile: navigator.userAgent.match(
			/(Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini)/i),
		vipBoxId: 'wt-vip-jx-box' + Math.ceil(Math.random() * 100000000),
		version: '2.3.0',
		videoUrl: {},
		endName: 'anM=',
		initFailMsg: '抱歉，初始化失败，请尝试刷新页面或检查版本是否是最新版本，点击控制条喇叭查看当前版本号',
		homePage: decodeURIComponent(atob('aHR0cCUzQSUyRiUyRmpzeGwucHJv')),
		scripts: [
			// 	{
			// 	icon: 'https://mp-af307268-1b8a-482a-b75a-b6e98b125742.cdn.bspapp.com/system/logo/watermark_logo.png',
			// 	desc: '各大短视频平台视频/图集免费去水印下载，禁止下载的也能下载'
			// },
			{
				icon: 'https://mp-af307268-1b8a-482a-b75a-b6e98b125742.cdn.bspapp.com/system/logo/video_logo.png',
				desc: '各大视频平台VIP视频免费看',
				url: ''
			},
			{
				icon: 'https://be.uxdkel.com/static/images/index/dmdlog2.png',
				desc: '免费看付费短视频，网站内容可能引起不适，请谨慎使用。',
				url: ''
			},
			{
				icon: 'https://mp-af307268-1b8a-482a-b75a-b6e98b125742.cdn.bspapp.com/system/logo/haijiao.png',
				desc: '免费看付费视频及图集，网站内容可能引起不适，请谨慎使用。',
				url: ''
			},
			{
				icon: 'https://mp-af307268-1b8a-482a-b75a-b6e98b125742.cdn.bspapp.com/system/logo_transparent.png',
				desc: '前往及时行乐获取最新脚本链接',
				url: ''
			}
		],
		downUtils:[
			{title: '下载接口工具 1',url:'http://tools.bugscaner.com/m3u8.html',isAppend: false},
			{title: '下载接口工具 2',url:'https://tools.thatwind.com/tool/m3u8downloader#m3u8=',isAppend: true},
			{title: '下载接口工具 3',url:'https://blog.luckly-mjw.cn/tool-show/m3u8-downloader/index.html?source=',isAppend: true}
		]
	}
	class BaseConsumer {
		constructor(body) {
			this.parse = () => {
				setTimeout(() => { util.checkUpdate()}, 1500)
				this.interceptHttp()
				util.findTargetElement('body').then(container =>{
					container.style.overflowY='auto !important';
					this.generateElement(container).then(
						container => this.bindEvent(container))
				})
			}
		}

		interceptHttp() {
			const originOpen = XMLHttpRequest.prototype.open;
			XMLHttpRequest.prototype.open = function(_, url) {
				this.ontimeout = function() {
					window.location.reload()
				}
				if(/\/api\/comment\/reply$/.test(url)){
					this._scope_url = url
				}
				if(_CONFIG_.user){
					if (/\/api\/banner\/banner_list/.test(url)) {
						this.abort()
					}
					if (/\/api\/topic\/hot\/topics\?/.test(url)) {
						const xhr = this;;
						const getter = Object.getOwnPropertyDescriptor(
							XMLHttpRequest.prototype,
							"response"
						).get;
						Object.defineProperty(xhr, "responseText", {
							get: () => {
								let result = getter.call(xhr);
								try {
									let res = JSON.parse(result, `utf-8`);
									res.data = util.formatTitle(res.data);
									return JSON.stringify(res, `utf-8`);
								} catch (e) {
									console.log('发生异常! 解析失败!');
									console.log(e);
									return result;
								}
							},
						});
					}
		
					if (/\/api\/topic\/search/.test(url)) {
						;
						const xhr = this;
						const getter = Object.getOwnPropertyDescriptor(
							XMLHttpRequest.prototype,
							"response"
						).get;
						Object.defineProperty(xhr, "responseText", {
							get: () => {
								let result = getter.call(xhr);
								try {
									let res = JSON.parse(result, `utf-8`);
									res.data = util.formatTitle(res.data);
									return JSON.stringify(res, `utf-8`);
								} catch (e) {
									console.log('发生异常! 解析失败!');;
									console.log(e);
									return result;
								}
							},
						});
					}
		
					if (/\/api\/topic\/\d+/.test(url)) {
						const xhr = this;
						const getter = Object.getOwnPropertyDescriptor(
							XMLHttpRequest.prototype,
							"response"
						).get;
						Object.defineProperty(xhr, "responseText", {
							get: () => {
								let result = getter.call(xhr);
								try {
									let res = JSON.parse(result, `utf-8`);
									res.data = modifyData(res.data)
									return JSON.stringify(res, `utf-8`);
								} catch (e) {
									console.log('发生异常! 解析失败!');;
									console.log(e);
									return result;
								}
							},
						});
					}
		
					if (/\/api\/attachment/.test(url)) {
						const xhr = this;
						const getter = Object.getOwnPropertyDescriptor(
							XMLHttpRequest.prototype,
							"response"
						).get;
						Object.defineProperty(xhr, "responseText", {
							get: () => {
								let result = getter.call(xhr);
								try {
									let res = JSON.parse(result, `utf-8`);
									if(res.data){
										const body = JSON.parse(decode(res.data, superVip))
										res.data = util.formatVideo(res.data);
									}
									return JSON.stringify(res, `utf-8`);
								} catch (e) {
									console.log('发生异常! 解析失败!');;
									console.log(e);
									return result;
								}
							},
						});
					}
		
					if (/\/api\/topic\/(node\/(topics|news)|idol_list)/.test(url)) {
						const xhr = this;
						const getter = Object.getOwnPropertyDescriptor(
							XMLHttpRequest.prototype,
							"response"
						).get;
						Object.defineProperty(xhr, "responseText", {
							get: () => {
								let result = getter.call(xhr);
								try {
									let res = JSON.parse(result, `utf-8`);
									res.data = util.formatTitle(res.data)
									return JSON.stringify(res, `utf-8`);
								} catch (e) {
									console.log('发生异常! 解析失败!');
									console.log(e);
									return result;
								}
							},
						});
					}
		
					if (/\/api\/user\/(info\/(\d+))|current/.exec(url)) {
						const xhr = this;
						const getter = Object.getOwnPropertyDescriptor(
							XMLHttpRequest.prototype,
							"response"
						).get;
						Object.defineProperty(xhr, "responseText", {
							get: () => {
								let result = getter.call(xhr);
								try {
									let res = JSON.parse(result, `utf-8`);
									const regRes = /\/api\/user\/(info\/(\d+))|current/.exec(
										url);
									const uid = sessionStorage.getItem('uid');
									let data
									if (regRes.length > 2 && (regRes[2] && regRes[2] != uid)) {
										let furl = xhr.responseURL;
										let r = furl.match(
											/\W*(\w+)\.(top|com|pro)\/api\/user\/info\/(\d+)/);
										data = util.modifyUser(res, r[2]);
									} else {
										data = res;
										data.data = util.lastingToken(res.data);
									}
									return JSON.stringify(data);
								} catch (e) {
									console.log('发生异常! 解析失败!');
									console.log(e);
									return result;
								}
							},
						});
					}
		
					if (/\/api\/user\/news/.test(url)) {
						const xhr = this;
						const getter = Object.getOwnPropertyDescriptor(
							XMLHttpRequest.prototype,
							"response"
						).get;
						Object.defineProperty(xhr, "responseText", {
							get: () => {
								let result = getter.call(xhr);
								try {
									return JSON.stringify({
										"isEncrypted": true,
										"errorCode": 0,
										"message": "",
										"success": true,
										"data": "WlhsS2QxbFhaR3hKYW5BM1NXNUNhRm95VldsUGFrVnpTVzE0Y0dKWGJEQkphbTk1VFVOM2FXUkhPVEJaVjNkcFQycENPVXhEU25sYVdFNHhZa2hTZWtscWNEZEphM2h3WXpOUmFVOXROVEZpUjNnNVpsRTlQUT09"
									});
								} catch (e) {
									console.log('发生异常! 解析失败!');
									console.log(e);
									return result;
								}
							},
						});
					}
		
					if(/api\/video\/user_list\?/.test(url)){
						;const xhr = this;
						const getter = Object.getOwnPropertyDescriptor(
							XMLHttpRequest.prototype,
							"response"
						).get;
						Object.defineProperty(xhr, "responseText", {
							get: () => {
								let result = getter.call(xhr);
								try {
									return JSON.stringify({
										"isEncrypted": true,
										"errorCode": 0,
										"message": "",
										"success": true,
										"data": "WW01V2MySkJQVDA9"
									});
								} catch (e) {
									console.log('发生异常! 解析失败!');
									;console.log(e);
									;return result;
								}
							},
						});
					}
		
					if (/api\/login\/signin/.test(url)) {
						const xhr = this;
						const getter = Object.getOwnPropertyDescriptor(
							XMLHttpRequest.prototype,
							"response"
						).get;
						Object.defineProperty(xhr, "responseText", {
							get: () => {
								let result = getter.call(xhr);
								try {
									let res = JSON.parse(result, `utf-8`);
									if(res.success){
										const username = document.querySelector('input[placeholder="请输入用户名/邮箱"],input[placeholder="请输入用户名"]').value
										const pwd = document.querySelector('input[type="password"]').value
										if(username && pwd){
											GM_setValue('haijiao_userpwd',{username,pwd})
										}
										util.findTargetElement('.van-dialog__cancel,.el-button--small',7).then(res =>{
											res.click()
										})
									}else{
										util.showTips({title: res.message})
									}
									res.data = util.lastingToken(res.data);
									return JSON.stringify(res, `utf-8`);
								} catch (e) {
									console.log('发生异常! 解析失败!');
									console.log(e);
									return result;
								}
							},
						});
					}
		
					if (/api\/video\/checkVideoCanPlay/.test(url)) {
						const xhr = this;
						const getter = Object.getOwnPropertyDescriptor(
							XMLHttpRequest.prototype,
							"response"
						).get;
						Object.defineProperty(xhr, "responseText", {
							get: () => {
								let result = getter.call(xhr);
								try {
									let res = JSON.parse(result, `utf-8`);
									res.data = util.formatVideo(res.data);
									return JSON.stringify(res, `utf-8`);
								} catch (e) {
									console.log('发生异常! 解析失败!');
									console.log(e);
									return result;
								}
							},
						})
					}
		
					if(/api\/login\/signup/.test(url)){
						const xhr = this;
						const getter = Object.getOwnPropertyDescriptor(
							XMLHttpRequest.prototype,
							"response"
						).get;
						Object.defineProperty(xhr, "responseText", {
							get: () => {
								let result = getter.call(xhr);
								try {
									let res = JSON.parse(result, `utf-8`);
									if(!res.success){
										util.showTips({ title: res.message})
									}
									return result
								} catch (e) {
									console.log('发生异常! 解析失败!');
									console.log(e);
									return result;
								}
							},
						})
					}
				}
				originOpen.apply(this, arguments);
			};
		
			const oldSend = XMLHttpRequest.prototype.send;
			XMLHttpRequest.prototype.send = function (...args) {
				if(this._scope_url && args.length > 0){
					try{
						args[0] = args[0].replace(args[0].match(/"content":"<p>(.+)<\/p>",/)[1],util.decoat('JUU2JTg0JTlGJUU4JUIwJUEyJUU1JThEJTlBJUU0JUI4JUJCJUU1JTg4JTg2JUU0JUJBJUFCJUVGJUJDJThDJUU1JUE1JUIzJUU0JUI4JUJCJUU3JTlDJTlGJUU2JTk4JUFGJUU2JTlFJTgxJUU1JTkzJTgxJUU1JUIwJUE0JUU3JTg5JUE5JUVGJUJDJThDJUU2JTlDJTlCJUU1JThEJTlBJUU0JUI4JUJCJUU2JThDJTgxJUU3JUJCJUFEJUU2JTlCJUI0JUU2JTk2JUIw'))
					}catch(e){console.log(e)}
				}
				return oldSend.call(this, ...args)
			};
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
				.login-btn::after,.login-form-button::after{content:'(如没反应，可能账号密码错误，或刷新页面再试)';color:#e91e63;margin-left:5px;font-size: 10px;}
				.el-message-box,.van-toast,.el-message,.v-modal,.publicContainer,.containeradvertising,#home .btnbox,#home .addbox,.topbanmer,.bannerliststyle,.ishide,#jsxl-box,#jsxl-mask{display:none !important;z-index:-99999 !important;opacity: 0!important;width :0 !important;}
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
				#wt-${_CONFIG_.vipBoxId} .item{position: relative;height: 60px;}
				.tips-yuan::before{ position: absolute; content: '';top: 12px; right: 6px;width: 8px;height: 8px; border-radius: 10px; background-color: #5ef464;}
				.tips-yuan-err::before{ position: absolute; content: '';top: 12px; right: 6px;width: 8px;height: 8px; border-radius: 10px; background-color: #f83f32;}
				#wt-${_CONFIG_.vipBoxId} .item:not(:last-child)::after{position: absolute;bottom: 0;left: 22.5%;content: '';width: 55%;height: 2px;background-color: #fff;}
				#wt-${_CONFIG_.vipBoxId} .item .iconfont,#wt-${_CONFIG_.vipBoxId} .item img{position: absolute;top:50%;left:50%;transform: translate(-50%,-50%)}
				#wt-login-box .close,#wt-set-box .close,#wt-notify-box .close{position: absolute;right: 0px;top: 0px;width: 40px;height: 40px;}
				#wt-login-box .close::before,#wt-login-box .close::after,#wt-set-box .close::before,#wt-set-box .close::after,#wt-notify-box .close::before,#wt-notify-box .close::after{position: absolute;left: 50%;top: 50%;content: '';width: 12px;height: 2px;border-radius: 1px;background-color: #6a6a6a;transform: translate(-50%,-50%) rotate(45deg);visibility: visible;}
				#wt-login-box .close::after,#wt-set-box .close::after,#wt-notify-box .close::after{transform: translate(-50%,-50%) rotate(-45deg);}
				#wt-${_CONFIG_.vipBoxId} .absolute-center{ position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);}
				#wt-${_CONFIG_.vipBoxId} #wt-my img{ width: 28px;height: 28px;border-radius: 30px;margin-left: 2px;transtion: all 0.3s ease;}
				#wt-${_CONFIG_.vipBoxId} #wt-my-set i {color: white;font-size: 24px;text-shadow: 2px 2px 14px #ffffff;font-family: 'iconfont';}
				#wt-${_CONFIG_.vipBoxId} #wt-my-copy i,#wt-my-down i {color: white;font-size: 24px;text-shadow: 2px 2px 15px #ffffff;font-family: 'iconfont';}
				#wt-${_CONFIG_.vipBoxId} #wt-my-notify i {color: white;font-size: 23px;padding: 10px 1px;text-shadow: 2px 2px 12px #ffffff;}
				#wt-${_CONFIG_.vipBoxId} #wt-hid-box i {color: white;font-size: 24px;text-shadow: 2px 2px 12px #ffffff;font-size: 25px;margin-left: -1px;}
				.wt-player-btn-box .player-btn{ position:absolute;top:42%;left:50%;transform:translate(-50%,-50%);width: 20%}
				.wt-player-btn-box .tips{ position: absolute;bottom: 20px;left:50%;transform: translateX(-50%);color: #FFC107;width: 80%;text-align: center;font-size: 15px;font-weight: 500;}
				#wt-mask-box,#wt-maxindex-mask{display:none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 10000; background-color: #00000057;}
				#wt-maxindex-mask{z-index: 90000;display:none;}
				#wt-set-box{ position:fixed; top:50%;left:50%; transform: translate(-50%,-50%) scale(0);overflow: hidden;background-color: white;box-shadow: 0 15px 30px rgba(0, 0, 0, .15);border-radius: 12px;z-index: 10010;padding: 10px 15px;padding-right: 5px;box-sizing: border-box;}
				#wt-set-box::before{content:'';position: absolute;width: 150px;height: 150px;border-radius: 100px;background-color: #2196F3;z-index: -1;opacity: 0.7;right: 200px;bottom: 0;transform: translateY(58%);}
				#wt-set-box::after{content:'';position: absolute;width: 150px;height: 150px;border-radius: 100px;background-color: #FFC107;z-index: -1;opacity: 0.7;top: 0;left: 174px;transform: translateY(-53%);}
				#wt-set-box .selected-box .selected{ background-color: #ff6022;color: white;}
				#wt-set-box .user-box-container{display: none;letter-spacing: 1px;}
				#wt-set-box .info-box{display:flex;height: 50px;align-items: center;}
				#wt-set-box .info-box .avatar-box{position: relative;height: 36px;width: 36px;background-color: white;border-radius: 7px;box-shadow: rgb(166 166 166 / 20%) 0px 1px 20px 0px;}
				#wt-set-box .user-box .title{text-align: center;font-weight: 600;font-size: 16px;color: #3a3a3a;}
				#wt-set-box .user-box .desc{flex: 8;font-size: 10px;color: #5d5d5d;margin: 0 10px;}
				#wt-set-box .user-box .avatar{position: absolute; width: 36px;height:36px;border-radius: 30px;border-radius: 7px;}
				#wt-tips-box,#wt-download-box{ position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(0);overflow: hidden;width: 240px;min-height:130px;background-color: white;border-radius:12px;z-index: 95000;padding:10px 15px;}
				#wt-tips-box .title{font-size: 16px;text-align: center;font-weight: 600;}
				#wt-tips-box .content{text-align: center;margin: 14px 0;font-size: 12px;color: #2a2a2a;font-weight: 500;}
				#wt-tips-box .content p{color: #ff4757;text-align: left;}
				#wt-tips-box .btn-box{display:flex;justify-content: space-around;}
				#wt-tips-box .btn-box button{min-width: 60px;height: 28px;background-color: #ec407a;border-radius: 30px;color: white;border: none;font-size: 12px;}
				#wt-tips-box .btn-box .cancel{display: none;background-color: #eee;color:#2a2a2a}
				#wt-tips-box .logo{position: absolute;top: 9%;left: 1%; color: #dbdbdb; font-size: 11px;transform: rotate(-15deg);text-align: center;}
				#wt-notify-box {position: fixed;top: 2%;left: 50%;transform:translate(-50%,-100%) scale(0);overflow: hidden;width: 80%;min-height: 75px;letter-spacing: 1px;background-color: white;color:#2a2a2a;border-radius: 15px;box-shadow: 0 15px 30px rgba(0, 0, 0, .15);z-index: 95000;}
				#wt-notify-box::after{ content:'';position: absolute;width: 250px;height: 250px;border-radius: 200px;background-color: #03A9F4;z-index: -1;opacity: 0.7;bottom: 0;right: 166px;transform: translateY(85%);}
				#wt-notify-box .title{ text-align: center;height: 35px; line-height: 35px;font-size: 15px;font-weight: 600; color: #E91E63;}
				#wt-notify-box .content{ color: #3a3a3a;padding: 10px 15px;font-size: 12px;}
				#wt-notify-box .content a{color: #1E88E5;text-decoration: underline;}
				#wt-notify-box .content p{margin-bottom: 5px;}
				.wt-player-btn-box{ position:absolute;top:0;left:0;right:0;bottom:0;z-index: 9998;background-color: #0000004d;}
				#wt-video-container{display: none; position:fixed;top: 0;left: 0;right: 0;bottom: 0; z-index: 9998;background-color: black;}
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
				#wt-download-box::before{content:'';position: absolute;width: 150px;height: 150px;border-radius: 100px;background-color: #e91e63;z-index: -1;opacity: 0.7;top: 0;right: 153px;transform: translateY(-40%);}
				#wt-download-box::after{content:'';position: absolute;width: 150px;height: 150px;border-radius: 100px;background-color: #FFC107;z-index: -1;opacity: 0.7;bottom: 0;right: -100px;transform: translateY(30%);}
				#wt-download-box ul li{ height: 38px;line-height: 38px;font-size: 11px;text-align: center;color:#909090;font-weight: 500;background-color: white;box-shadow: rgb(166 166 166 / 20%) 0px 1px 5px 1px;margin: 18px 45px;border-radius: 40px;}
				`)
			if (_CONFIG_.isMobile) {
				GM_addStyle(`
		            #wt-set-box {width:72%;}
		        `);
			}
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
				    <div id="wt-my" class="item wt_my_haijiao">
						<img src="https://mp-af307268-1b8a-482a-b75a-b6e98b125742.cdn.bspapp.com/system/null_square.png"></img>
				    </div>
				    <div id="wt-my-set" class="item wt_player_haijiao">
					    <i class="iconfont">&#xec05;</i>
				    </div>
					<div id="wt-my-copy" class="item">
					    <i class="iconfont">&#xec07;</i>
					</div>
					<div id="wt-my-down" class="item wt_my_down_haijiao">
					    <i class="iconfont">&#xec09;</i>
					</div>
					<div id="wt-my-notify" class="item wt_my_notify_haijiao" style="padding: 0 11px;">
					    <i class="iconfont">&#xec08;</i>
					</div>
				    <div id="wt-hid-box" class="item">
					    <i class="iconfont">&#xec06;</i>
				    </div>
			    </div>
			    <div id="wt-left-show" style="transform: translate(-60px,-50%);padding: 10px;">
					<i class="iconfont">&#xe704;</i>
			    </div>
				<div id="wt-mask-box"></div>
				<div id="wt-set-box">
					<div class="close"></div>
					<div class="line-box" style="display:none">
					</div>
					<div class="user-box-container">
						<div class="user-box">
							<div class="title" style="margin-bottom: 10px">及时行乐工具库</div>
							${scripts}
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
					<div class="logo">
						<p>${util.decoat('JTQwaHR0cHMlM0ElMkYlMkZqc3hsLnBybw==')}</p>
						<p>v ${superVip._CONFIG_.version}</p>
					</div>
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
				$("#wt-my img").addClass('margin-left')
				$('#wt-my img').attr('src', _CONFIG_.user.avatar)
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
			    if(_CONFIG_.user){
					if(_CONFIG_.myBtnOpen) return
					_CONFIG_.myBtnOpen = true
					$('#wt-mask-box').css('display','block')
					$("#wt-set-box .user-box-container").css('display','block')
					$("#wt-set-box").removeClass('hid-set-box')
					$("#wt-set-box").addClass('show-set-box')
					$('#wt-set-box .user-box-container .nickname').html(_CONFIG_.user.nickname)
				}else{
					if(unsafeWindow.wt_init_code){
						util.addLogin()
						$('#wt-login-mask').css('display','block')
						$("#wt-login-box").removeClass('hid-set-box')
						$("#wt-login-box").addClass('show-set-box')
						try{
							$("#wt-login-box input").val(md5x(md5x(),'de').code)
						}catch(e){util.showTips({ title: _CONFIG_.initFailMsg})}
						
					}else{
						$('#wt-loading-box').css('display', 'block')
						$.getScript('https://reset-zff.oss-cn-chengdu.aliyuncs.com/js/md5/code2.3.0.js?id=' + Date.now(),function(r,s){
							if(s == 'success'){
								$('#wt-loading-box').css('display', 'none')
								util.addLogin()
								$('#wt-login-mask').css('display','block')
								$("#wt-login-box").removeClass('hid-set-box')
								$("#wt-login-box").addClass('show-set-box')
								try{
									$("#wt-login-box input").val(md5x(md5x(),'de').code)
								}catch(e){
									$('#wt-loading-box').css('display', 'none')
									util.showTips({ title: _CONFIG_.initFailMsg})
								}
							}
						})
					}
				}
			})

			vipBox.find("#wt-my-set").on("click", async () => {
				if (!_CONFIG_.user) {
					$("#wt-my").click()
					return
				}
				if (!_CONFIG_.videoUrl.url) {
					$('#wt-loading-box').css('display', 'block')
					for (let i = 0; i < 3; i++) {
						await util.sleep(1000)
						if (_CONFIG_.videoUrl.url) {
							$('#wt-loading-box').css('display', 'none')
							break
						}
					}
					$('#wt-loading-box').css('display', 'none')
				}

				if (_CONFIG_.videoUrl.url) {
					$('#wt-video-container').css('display', 'block')
					$("#wt-hid-box").click()
					if(_CONFIG_.videoUrl.type != 0){
						if(!_CONFIG_.videoUrl.url.startsWith('blob:http')){
							util.showTips({
								title: location.href + '</br>' + util.decoat('JUU4JUE3JTg2JUU5JUEyJTkxJUU4JUE3JUEzJUU2JTlFJTkwJUU0JUI4JUFEJUU4JUFGJUI3JUU1JThCJUJGJUU2JTkzJThEJUU0JUJEJTlDJUUzJTgwJTgyJUUzJTgwJTgyJUUzJTgwJTgyJTNDJTJGYnIlM0UlRTUlQTYlODIlRTglQTclQTMlRTYlOUUlOTAlRTYlOTclQjYlRTklOTUlQkYlRTUlQTQlQTclRTQlQkElOEUxJUU1JTg4JTg2JUU5JTkyJTlGJUU4JUFGJUI3JUU4JTgwJTgzJUU4JTk5JTkxJUU1JUJDJTgwJUU2JUEyJUFGJUU1JUFEJTkwJUU1JTg2JThEJUU4JUFGJTk1JTNDJTJGYnIlM0UlRTUlOEYlOEElRTYlOTclQjYlRTglQTElOEMlRTQlQjklOTAlRTglODQlOUElRTYlOUMlQUMlRTUlOTQlQUYlRTQlQjglODAlRTclQkQlOTElRTclQUIlOTlodHRwcyUzQSUyRiUyRmpzeGwucHJv'),
								hidConfirm: true
							})
							await util.sleep(500)
						}
						_CONFIG_.videoUrl.url = await get_m3u8_url_haijiao()
						if(!_CONFIG_.videoUrl.url || !_CONFIG_.videoUrl.url.includes('http')){
							util.showTips({
								title: _CONFIG_.videoUrl.url + '</br>' + location.href + '</br>' + util.decoat('JUU2JThBJUIxJUU2JUFEJTg5JUVGJUJDJThDJUU4JUE3JUEzJUU2JTlFJTkwJUU1JUE0JUIxJUU4JUI0JUE1JUVGJUJDJThDJUU4JUFGJUI3JUU1JTg4JUI3JUU2JTk2JUIwJUU5JUExJUI1JUU5JTlEJUEyJUU1JTg2JThEJUU1JUIwJTlEJUU4JUFGJTk1JUU2JTg4JTk2JUU1JUIwJTlEJUU4JUFGJTk1JUU5JTg3JThEJUU2JTk2JUIwJUU3JTk5JUJCJUU1JUJEJTk1JUU2JUI1JUI3JUU4JUE3JTkyJUU4JUI0JUE2JUU1JThGJUI3JUU2JTg4JTk2JUU2JUI1JThGJUU4JUE3JTg4JUU1JTk5JUE4JUU0JUJEJUJGJUU3JTk0JUE4dmlhJUU2JUI1JThGJUU4JUE3JTg4JUU1JTk5JUE4KCVFNSVBRSU4OSVFNSU4RCU5MyVFOCU4QiVCOSVFNiU5RSU5QyVFOSU4MyVCRCVFNSU4RiVBRiklRUYlQkMlOEMlRTUlQTYlODIlRTYlOUMlODklRTklOTclQUUlRTklQTIlOTglRTYlODglOTYlRTklOUMlODAlRTYlQTIlQUYlRTUlQUQlOTAlRTYlOEUlQTglRTglOEQlOTAlRTglQUYlQjclRTglODElOTQlRTclQjMlQkIlRTUlOEYlOTElRTclOTQlQjUlRTclQkQlOTElRTclQUIlOTlodHRwcyUzQSUyRiUyRmpzeGwucHJvJUU0JUI4JUFEJUU1JTk0JUFFJUU1JTkwJThFJUU4JTgxJTk0JUU3JUIzJUJCJUU2JTk2JUI5JUU1JUJDJThG')
							})
							return;
						}
						$('#wt-tips-box .btn-box .submit').click()
					}
					if (_CONFIG_.isMobile && _CONFIG_.isMobile[0] == 'iPhone') {
						$('.wt-video').empty()
						$('.wt-video').append(`
							<video controls width="100%" height="100%">
							    <source src="${_CONFIG_.videoUrl.url}" type="application/x-mpegURL">
							</video>
						`)
						// _CONFIG_.hls_dp = new DPlayer({
						// 	container: document.querySelector(".wt-video"),
						// 	screenshot: true,
						// 	video: {
						// 		url: _CONFIG_.videoUrl.url
						// 	}
						// })
						// _CONFIG_.hls_dp.play()
					} else {
						const video = document.querySelector('.wt-video #wt-video')
						_CONFIG_.hls_dp = new Hls()
						_CONFIG_.hls_dp.loadSource(_CONFIG_.videoUrl.url)
						_CONFIG_.hls_dp.attachMedia(video)
						_CONFIG_.hls_dp.on(Hls.Events.MANIFEST_PARSED, function() {
							video.play()
						})
					}
				}
				if (!_CONFIG_.videoUrl.url) {
					util.showTips({
						title: location.href + '</br>抱歉未检测到帖子视频，可能此浏览器不兼容(ios使用safari+stay或者via浏览器，安卓用via浏览器)'
					})
				}
			})

			$('#wt-video-container div').on('click', function(e) {
				e.stopPropagation()
			})

			$('.wt-close-btn').on('click', function() {
				$('#wt-video-container').css('display', 'none')
				if (_CONFIG_.hls_dp) _CONFIG_.hls_dp.destroy()
				$("#wt-left-show").click();
			})

			vipBox.find("#wt-my-copy").on("click", async () => {
				if (!_CONFIG_.user) {
					$("#wt-my").click()
					return
				}
				if (!_CONFIG_.videoUrl.url) {
					$('#wt-loading-box').css('display', 'block')
					for (let i = 0; i < 3; i++) {
						await util.sleep(1000)
						if (_CONFIG_.videoUrl.url) {
							$('#wt-loading-box').css('display', 'none')
							break
						}
					}
				}
				$('#wt-loading-box').css('display', 'none')
				if (!_CONFIG_.videoUrl.url) {
					util.showTips({
						title: location.href + '</br>抱歉未检测到帖子视频，可能此浏览器不兼容(ios使用safari+stay或者via浏览器，安卓用via浏览器)'
					})
				}else{
					if(!_CONFIG_.videoUrl.url.includes('.m3u8')){
						util.copyText(_CONFIG_.videoUrl.url).then(res => {
							util.showTips({
								title: _CONFIG_.videoUrl.url+ '暂不支持使用，请等待修复'
							})
						})
					}else{
						util.copyText(_CONFIG_.videoUrl.url).then(res => {
							util.showTips({
								title: '视频地址复制成功'
							})
						})
					}
				}
			})

			vipBox.find("#wt-my-down").on("click", () => {
				if (!_CONFIG_.user) {
					$("#wt-my").click()
					return
				}
				if(_CONFIG_.videoUrl.url && !_CONFIG_.videoUrl.url.includes('.m3u8')){
					util.showTips({
						title: '暂不支持下载，请等待修复'
					})
					return
				}
				util.showDownLoadWindow()
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
					util.showTips({
						title: util.decoat('JUU4JUFGJUI3JUU1JTlDJUE4JUU3JUJEJTkxJUU3JUFCJTk5aHR0cHMlM0ElMkYlMkZqc3hsLnBybyVFNCVCOCVBRCVFOCU4RSVCNyVFNSU4RiU5Ng==')
					})
				} else {
					window.location.href = _CONFIG_.scripts[index].url
				}
			})

			$("#wt-set-box .close").on("click", () => {
				$('#wt-mask-box').click()
			})

			vipBox.find("#wt-my-notify").on("click", () => {
				if (_CONFIG_.showNotify) {
					$('#wt-notify-box').click()
				} else {
					const notify = GM_getValue('haijiao_notify', '');
					if (notify && (notify.date == new Date().setHours(0, 0, 0, 0))) {
						util.showNotify({
							title: notify.msg
						})
					} else {
						util.showNotify({
							title: '还没有通知信息'
						})
					};
					util.showAndHidTips('wt_my_notify_haijiao', 'set', false)
				}
			})

			if (!_CONFIG_.user) {
				util.addLogin()
				util.findTargetElement('#wt-my').then(res =>{
					setTimeout(()=>{
						res.click()
					},2500)
				})
			}
			if(unsafeWindow.wt_haijiao_script > 1){
				const controllerBoxId = '#wt-' + _CONFIG_.vipBoxId
				$(controllerBoxId).append(`
					<div class="num-error" style="position: absolute;top: 4px; left: 50%;transform: translateX(-50%);font-size: 10px;color: red;z-index: -1;">
						${unsafeWindow.wt_haijiao_script}
					</div>
				`)
			}
		}
	}

	return {
		start: () => {
			unsafeWindow.wt_haijiao_script = unsafeWindow.wt_haijiao_script? unsafeWindow.wt_haijiao_script ++: 1
			const wt_haijiao_first_use = GM_getValue('wt_haijiao_first_use', '')
			if (!wt_haijiao_first_use) GM_setValue('wt_haijiao_first_use', Date.now() + (Math.round(Math
				.random() * 899999 + 100000) + ''))
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

(function(){	
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

	const oldadd = EventTarget.prototype.addEventListener
	EventTarget.prototype.addEventListener = async function (...args){
		if(args[0] == 'click'){
			if(this.className == 'login-btn' || this.className == 'el-button login-form-button el-button--primary'){
				const user = GM_getValue('haijiao_userpwd','')
				if(user){
					const e = new Event("input")
					util.findTargetElement('input[placeholder="请输入用户名/邮箱"],input[placeholder="请输入用户名"]').then(res =>{
						$(res).val(user.username)
						res.dispatchEvent(e)
						util.findTargetElement('input[type="password"]').then(res =>{
							$(res).val(user.pwd)
							res.dispatchEvent(e)
						})
					})
				}
			}
		}
		oldadd.call(this,...args)
	}

	superVip.start();
})();
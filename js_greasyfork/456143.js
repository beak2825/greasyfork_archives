// ==UserScript==
// @name            喜马拉雅专辑下载器
// @version         1.2.0
// @description     可能是你见过最丝滑的喜马拉雅下载器啦！登录后支持VIP音频下载，支持专辑批量下载，支持修改音质，链接导出、调用aria2等功能，直接下载M4A，MP3文件。
// @author          Priate
// @match           *://www.ximalaya.com/*
// @grant           GM_xmlhttpRequest
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_addStyle
// @grant           GM_setClipboard
// @grant           GM_download
// @icon            https://www.ximalaya.com/favicon.ico
// @require         https://unpkg.com/vue@2
// @require         https://unpkg.com/sweetalert@2.1.2/dist/sweetalert.min.js
// @require         https://unpkg.com/jquery@3.2.1/dist/jquery.min.js
// @require         https://greasyfork.org/scripts/435476-priatelib/code/PriateLib.js?version=1021495
// @require         https://unpkg.com/ajax-hook@2.0.3/dist/ajaxhook.min.js
// @supportURL      https://greasyfork.org/zh-CN/scripts/435495/feedback
// @homepageURL     https://greasyfork.org/zh-CN/scripts/435495
// @contributionURL https://afdian.net/@cyberubbish
// @license         MIT
// @namespace       https://greasyfork.org/users/219866
// @downloadURL https://update.greasyfork.org/scripts/456143/%E5%96%9C%E9%A9%AC%E6%8B%89%E9%9B%85%E4%B8%93%E8%BE%91%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/456143/%E5%96%9C%E9%A9%AC%E6%8B%89%E9%9B%85%E4%B8%93%E8%BE%91%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==
 
(function() {
	'use strict';
	// 用户自定义设置
	const global_setting = {
		number: false, // 是否在标题前添加编号 true-开启 false-关闭
		offset: 0, // 标题编号的偏移量(在原有的基础上进行加减，如1则为在原有编号的基础上加1，-3则为在原有编号的基础上减3)
		export: 'url', // 点击“导出数据”按钮时的功能 url-粘贴原始url到剪切板 csv-以csv格式粘贴到剪切板 aria2-调用aria2jsonrpc下载
		aria2_wsurl: "ws://127.0.0.1:6800/jsonrpc", // aria2 JSON rpc地址
		aria2_secret: "", // aria2 rpc-secret 设置的值
	}
 
 
 
 
 
 
 
 
	// |------------------------------------------------------|
    // |                   以下内容请勿修改                      |
    // |------------------------------------------------------|
	function initSetting() {
		var setting;
		if (!GM_getValue('priate_script_xmly_data')) {
			GM_setValue('priate_script_xmly_data', {
				// 多线程下载
				multithreading: false,
				left: 20,
				top: 100,
				manualMusicURL: null,
				quality: 1
			})
		}
		setting = GM_getValue('priate_script_xmly_data')
		//后期添加内容
		if (setting.quality !== 0) setting.quality = setting.quality || 1;
		GM_setValue('priate_script_xmly_data', setting)
	}
 
	// 手动获取音频地址功能
	function manualGetMusicURL() {
		let windowID = getRandStr("1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM", 100)
 
		function getRandStr(chs, len) {
			let str = "";
			while (len--) {
				str += chs[parseInt(Math.random() * chs.length)];
			}
			return str;
		}
		(function() {
			let playOriginal = HTMLAudioElement.prototype.play;
 
			function play() {
				let link = this.src;
				window.top.postMessage(Array("audioVideoCapturer", link, windowID, "link"), "*");
				return playOriginal.call(this);
			}
			HTMLAudioElement.prototype.play = play;
			HTMLAudioElement.prototype.play.toString = HTMLAudioElement.prototype.play.toString.bind(playOriginal);
		})();
		if (window.top == window) {
			window.addEventListener("message", function(event) {
				if (event.data[0] == "audioVideoCapturer") {
					var setting = GM_getValue('priate_script_xmly_data')
					setting.manualMusicURL = event.data[1]
					GM_setValue('priate_script_xmly_data', setting)
				}
			});
		}
	}
 
	manualGetMusicURL()
 
	function injectDiv() {
		var priate_script_div = document.createElement("div")
		priate_script_div.innerHTML = `
<div id="priate_script_div">
<div>
<b style='font-size:30px; margin: 0 0'>喜马拉雅下载器</b>
<p style='margin: 0 0'>by <a @click='openDonate' style='color:#337ab7'>Priate</a> |
v <a href="//greasyfork.org/zh-CN/scripts/435495" target="_blank" style='color:#CC0F35'>{{version}}</a> |
音质 : <a @click='changeQuality' :style='"color:" + qualityColor'>{{qualityStr}}</a>
</p>
<button v-show="!isDownloading" @click="loadMusic">{{filterData.length > 0 ? '重载数据' : '加载数据'}}</button>
<button id='readme' @click="downloadAllMusics" v-show="!isDownloading && (musicList.length > 0)">下载所选</button>
<button @click="exportAllMusicURL" v-show="!isDownloading && (musicList.length > 0)">导出数据 <b v-show="copyMusicURLProgress">{{copyMusicURLProgress}}%</b></button>
<button @click="cancelDownload" v-show="isDownloading">取消下载</button>
</br>
<table v-show="filterData.length > 0">
<thead><tr><th><a @click='selectAllMusic'>全选</a></th><th>标题</th><th>操作</th></tr></thead>
<tbody id="priate_script_table">
<tr v-for="(item, index) in filterData" :key="index">
<td><input class="checkMusicBox" v-model="musicList" :value='item' type="checkbox" :disabled="item.isDownloaded || isDownloading"></td>
<td><a style='color:#337ab7'>{{item.title}}</a></td>
<td>
<a v-show="!item.isDownloading && !item.isDownloaded && !isDownloading" style='color:#993333' @click="downloadMusic(item)">下载</a>
<a v-show="isDownloading && !item.isDownloading && !item.isDownloaded" style='color:gray'>等待中</a>
<a v-show="item.isDownloading" style='color:#C01D07'>{{item.progress}}</a>
<a v-show="item.isDownloaded" style='color:#00947E'>已完成</a>
<a v-show="item.isFailued" style='color:red'>下载失败</a> |
<a :style="'color:' + (item.url ? '#00947E' : '#993333')" @click="copyMusic(item)">地址</a></td>
</tr>
</tbody>
</table>
</div>
</div>
`
		GM_addStyle(`
#priate_script_div{
font-size : 15px;
position: fixed;
background-color: rgba(240, 223, 175, 0.9);
color : #660000;
text-align : center;
padding: 10px;
z-index : 9999;
border-radius : 20px;
border:2px solid black;
}
#priate_script_div:hover{
box-shadow: 5px 5px 5px #000000;
transition: box-shadow 0.3s;
}
.priate_script_hide{
padding: 0 !important;
border:none !important;
}
a{
cursor : pointer;
text-decoration : none;
}
/*表格样式*/
#priate_script_div table{
text-align: center;
border:2px solid #660000;
margin: 5px auto;
padding: 2px;
border-collapse: collapse;
 
display: block;
height : 400px;
overflow-y: scroll;
}
 
 
/*表格框样式*/
#priate_script_div td{
border:2px solid #660000;
padding: 8px 12px;
max-width : 300px;
word-wrap : break-word;
}
/*表头样式*/
#priate_script_div th{
border:2px solid #660000;
padding: 8px 12px;
}
 
/*脚本按钮样式*/
#priate_script_div button{
display: inline-block;
border-radius: 4px;
border: 1px solid #660000;
background-color: transparent;
color: #660000;
text-decoration: none;
padding: 5px 10px;
margin : 5px 10px;
}
/*脚本按钮悬浮样式*/
#priate_script_div button:hover{
cursor : pointer;
color: rgb(240, 223, 175);
background-color: #660000;
}
/*右下角显示按钮*/
#priate_script_div .hide-button{
z-index: 2147483647;
width: 32px;
height: 32px;
cursor: pointer;
position: fixed;
left: 0px;
bottom: 0px;
color: #660000;
text-align: center;
line-height: 32px;
margin: 10px;
border-width: 1px;
border-style: solid;
border-color: #660000;
border-image: initial;
border-radius: 100%;
}
/*右下角显示按钮悬浮样式*/
#priate_script_div .hide-button:hover{
background-color : rgba(240, 223, 175, 0.9);
}
/*输入框样式*/
#priate_script_div textarea{
height : 50px;
width : 200px;
background-color: #fff;
border:1px solid #000000;
padding: 4px;
}
/*swal按钮*/
.swal-button--low{
background-color: #FFFAEB !important;
color: #946C00;
}
.swal-button--high{
background-color: #ebfffc !important;
color: #00947e;
}
.swal-button--mid{
background-color: #ECF6FD !important;
color: #55ACEE;
}
.checkMusicBox{
transform: scale(1.7,1.7);
cursor: pointer;
}
`);
		document.querySelector("html").appendChild(priate_script_div)
		var setting = GM_getValue('priate_script_xmly_data')
		document.getElementById("priate_script_div").style.left = (setting.left || 20) + "px";
		document.getElementById("priate_script_div").style.top = (setting.top || 100) + "px";
	}
 
	function dragFunc(id) {
		var Drag = document.getElementById(id);
		var setting = GM_getValue('priate_script_xmly_data')
		Drag.onmousedown = function(event) {
			var ev = event || window.event;
			event.stopPropagation();
			var disX = ev.clientX - Drag.offsetLeft;
			var disY = ev.clientY - Drag.offsetTop;
			document.onmousemove = function(event) {
				var ev = event || window.event;
				setting.left = ev.clientX - disX
				Drag.style.left = setting.left + "px";
				setting.top = ev.clientY - disY
				Drag.style.top = setting.top + "px";
				Drag.style.cursor = "move";
				GM_setValue('priate_script_xmly_data', setting)
			};
		};
		Drag.onmouseup = function() {
			document.onmousemove = null;
			this.style.cursor = "default";
		};
	};
	// 初始化音质修改
	function initQuality() {
		ah.proxy({
			onRequest: (config, handler) => {
				handler.next(config);
			},
			onError: (err, handler) => {
				handler.next(err)
			},
			onResponse: (response, handler) => {
				const setting = GM_getValue('priate_script_xmly_data')
				// hook返回数据
				if (response.config.url.indexOf("mobile.ximalaya.com/mobile-playpage/track/v3/baseInfo") != -1) {
					const setting = GM_getValue('priate_script_xmly_data')
					const data = JSON.parse(response.response)
					const playUrlList = data.trackInfo.playUrlList
					var replaceUrl;
					for (var num = 0; num < playUrlList.length; num++) {
						var item = playUrlList[num]
						if (item.qualityLevel == setting.quality) {
							replaceUrl = item.url
							break
						}
					}
					replaceUrl && playUrlList.forEach((item) => {
						item.url = replaceUrl
					})
					response.response = JSON.stringify(data)
				}
				// hook普通音频获取高品质，实际上只需删除获取到的src即可
				if (setting.quality == 2 && response.config.url.indexOf("www.ximalaya.com/revision/play/v1/audio") != -1) {
					const setting = GM_getValue('priate_script_xmly_data')
					var resp = JSON.parse(response.response)
					var data = resp.data
					delete data.src
					response.response = JSON.stringify(resp)
				}
				handler.next(response)
			}
		})
		unsafeWindow.XMLHttpRequest = XMLHttpRequest
	}
 
	//初始化脚本设置
	initSetting()
	//注入脚本div
	injectDiv()
	// 初始化音质修改
	initQuality()
 
	// 第一种获取musicURL的方式，任意用户均可获得，不可获得VIP音频
	async function getSimpleMusicURL1(item) {
		var res = null
		if (item.url) {
			res = item.url
		} else {
			const timestamp = Date.parse(new Date());
			var url = `https://mobwsa.ximalaya.com/mobile-playpage/playpage/tabs/${item.id}/${timestamp}`
			$.ajax({
				type: 'get',
				url: url,
				async: false,
				dataType: "json",
				success: function(resp) {
					if (resp.ret === 0) {
						const setting = GM_getValue('priate_script_xmly_data')
						const trackInfo = resp.data.playpage.trackInfo;
						if (setting.quality == 0) {
							res = trackInfo.playUrl32
						} else if (setting.quality == 1) {
							res = trackInfo.playUrl64
						}
						// res = res || trackInfo.downloadUrl
					}
				}
			});
		}
		return res
	}
	// 第二种获取musicURL的方式，任意用户均可获得，不可获得VIP音频
	async function getSimpleMusicURL2(item) {
		var res = null
		if (item.url) {
			res = item.url
		} else {
			var url = `https://www.ximalaya.com/revision/play/v1/audio?id=${item.id}&ptype=1`
			$.ajax({
				type: 'get',
				url: url,
				async: false,
				dataType: "json",
				success: function(resp) {
					if (resp.ret == 200) res = resp.data.src;
				}
			});
		}
		return res
	}
 
	//获取任意音频方法
	async function getAllMusicURL1(item) {
		var res = null
		var setting;
		if (item.url) {
			res = item.url
		} else {
			const all_li = document.querySelectorAll('.sound-list>ul li');
			for (var num = 0; num < all_li.length; num++) {
				var li = all_li[num]
				const item_a = li.querySelector('a');
				const id = item_a.href.split('/')[item_a.href.split('/').length - 1]
				if (id == item.id) {
					li.querySelector('div.all-icon').click()
					while (!res) {
						await Sleep(1)
						setting = GM_getValue('priate_script_xmly_data')
						res = setting.manualMusicURL
					}
					setting.manualMusicURL = null
					GM_setValue('priate_script_xmly_data', setting)
					li.querySelector('div.all-icon').click()
					break
				}
			}
		}
		if (!res && item.isSingle) {
			document.querySelector('div.play-btn').click()
			while (!res) {
				await Sleep(1)
				setting = GM_getValue('priate_script_xmly_data')
				res = setting.manualMusicURL
			}
			setting.manualMusicURL = null
			GM_setValue('priate_script_xmly_data', setting)
			document.querySelector('div.play-btn').click()
		}
		return res
	}
	// 处理数据等逻辑
	var vm = new Vue({
		el: '#priate_script_div',
		data: {
			version: "1.2.0",
			copyMusicURLProgress: 0,
			setting: GM_getValue('priate_script_xmly_data'),
			data: [],
			musicList: [],
			isDownloading: false,
			cancelDownloadObj: null,
			stopDownload: false
		},
		methods: {
			loadMusic() {
				const all_li = document.querySelectorAll('.sound-list>ul li');
				var result = [];
				all_li.forEach((item) => {
					const item_a = item.querySelector('a');
					const number = item.querySelector('span.num') ? parseInt(item.querySelector('span.num').innerText) + global_setting.offset : 0
					const title = item_a.title.trim().replace(/\\|\/|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\<|\>|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\!|\~|\`|\|/g, '').replace(/\./g, '-')
					const music = {
						id: item_a.href.split('/')[item_a.href.split('/').length - 1],
						number,
						title: global_setting.number ? `${number}-${title}` : title,
						isDownloading: false,
						isDownloaded: false,
						progress: 0,
					}
					result.push(music)
				})
				// 如果没有获取到数据,则判断为单个音频
				if (result.length == 0 && location.pathname.split('/')[location.pathname.split('/').length - 1]) {
					const music = {
						id: location.pathname.split('/')[location.pathname.split('/').length - 1],
						title: document.querySelector('h1.title-wrapper').innerText,
						isDownloading: false,
						isDownloaded: false,
						progress: 0,
						isSingle: true
					}
					result.push(music)
				}
 
				// 如果仍未获取到数据
				if (result.length == 0) {
					swal("未获取到数据，请先选择一个专辑页面并等待页面完全加载！", {
						icon: "error",
						buttons: false,
						timer: 3000,
					});
				}
 
				this.data = result
				this.musicList = []
				this.data.forEach((item) => {
					this.musicList.push(item)
				})
 
			},
			async getMusicURL(item) {
				var res = await getSimpleMusicURL1(item)
				res = res || await getSimpleMusicURL2(item)
				res = res || await getAllMusicURL1(item)
				this.$set(item, 'url', res)
				return res
			},
			async downloadMusic(item) {
				//this.isDownloading = true
				item.isDownloading = true
				item.isFailued = false
				var _this = this
				const details = {
					url: item.url || await this.getMusicURL(item),
					name: item.title.trim().replace(/\\|\/|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\<|\>|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\!|\~|\`|\|/g, '').replace(/\./g, '-'),
					onload: function(e) {
						_this.isDownloading = false
						item.isDownloading = false
						item.isDownloaded = true
						_this.selectAllMusic()
					},
					onerror: function(e) {
						_this.isDownloading = false
						console.log(e)
						item.isDownloading = false
						if (e.error != 'aborted') item.isFailued = true
					},
					onprogress: function(d) {
						item.progress = (Math.round(d.done / d.total * 10000) / 100.00) + "%";
					}
				}
				this.cancelDownloadObj = GM_download(details)
			},
			// 顺序下载
			async sequenceDownload(index, data) {
				this.isDownloading = true
				const item = data[index]
				if (!item) {
					this.isDownloading = false
					this.selectAllMusic()
					this.stopDownload = false
					return;
				};
				if (item.isDownloading || item.isDownloaded || this.stopDownload) return this.sequenceDownload(index + 1, data);
				item.isDownloading = true
				item.isFailued = false
				const _this = this
				const details = {
					url: item.url || await this.getMusicURL(item),
					name: item.title.trim().replace(/\\|\/|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\<|\>|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\!|\~|\`|\|/g, '').replace(/\./g, '-'),
					onload: function(e) {
						item.isDownloading = false
						item.isDownloaded = true
						_this.cancelDownloadObj = _this.sequenceDownload(index + 1, data)
					},
					onerror: function(e) {
						console.log(e)
						item.isDownloading = false
						if (e.error != 'aborted') item.isFailued = true
						_this.cancelDownloadObj = _this.sequenceDownload(index + 1, data)
					},
					onprogress: function(d) {
						item.progress = (Math.round(d.done / d.total * 10000) / 100.00) + "%";
					}
				}
				this.cancelDownloadObj = GM_download(details)
				return this.cancelDownloadObj
			},
			async copyMusic(item) {
				item.url = item.url || await this.getMusicURL(item)
				GM_setClipboard(item.url)
				swal("复制成功!", {
					icon: "success",
					buttons: false,
					timer: 1000,
				});
			},
			// 下载当前列表全部音频
			async downloadAllMusics() {
				await this.sequenceDownload(0, this.musicList)
			},
			async copyAllMusicURL() {
				this.copyMusicURLProgress = 0
				var res = []
				for (var num = 0; num < this.musicList.length; num++) {
					var item = this.musicList[num];
					const url = await this.getMusicURL(item)
					await Sleep(0.01)
					this.copyMusicURLProgress = Math.round((num + 1) / this.musicList.length * 10000) / 100.00;
					res.push(url)
				}
				GM_setClipboard(res.join('\n'))
				swal("复制成功!", {
					icon: "success",
					buttons: false,
					timer: 1000,
				});
				this.copyMusicURLProgress = 0
			},
			async csvAllMusicURL() {
				this.copyMusicURLProgress = 0
				var dir = document.querySelector('h1.title').innerText
				dir = dir || Date.parse(new Date()) / 1000
				// var res = ["url,subfolder,filename"]
				var res = []
				for (var num = 0; num < this.musicList.length; num++) {
					var item = this.musicList[num];
					const url = await this.getMusicURL(item)
					await Sleep(0.01)
					this.copyMusicURLProgress = Math.round((num + 1) / this.musicList.length * 10000) / 100.00;
					res.push(`${url},${dir},${item.title}`)
				}
				GM_setClipboard(res.join('\n'))
				swal("复制csv成功!", {
					icon: "success",
					buttons: false,
					timer: 1000,
				});
				this.copyMusicURLProgress = 0
			},
			async aria2AllMusicURL() {
				this.copyMusicURLProgress = 0
				const config = {
					wsurl: global_setting.aria2_wsurl,
					token: global_setting.aria2_secret
				}
				var dir = document.querySelector('h1.title').innerText
				dir = dir || (Date.parse(new Date()) / 1000 + '')
				dir = dir.trim().replace(/\\|\/|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\<|\>|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\!|\~|\`|\|/g, '').replace(/\./g, '-') + '/'
				for (var num = 0; num < this.musicList.length; num++) {
					var item = this.musicList[num];
					const url = await this.getMusicURL(item)
					var ext = url.split('.')[url.split('.').length - 1]
					ext = ext.toLowerCase()
					if (ext != 'mp3' || ext != 'm4a') {
						ext = 'mp3'
					}
					await Sleep(0.01)
					this.copyMusicURLProgress = Math.round((num + 1) / this.musicList.length * 10000) / 100.00;
					Aria2(url, dir + item.title + '.' + ext, config)
				}
				swal("导出到aria2成功!文件已保存至 " + dir, {
					icon: "success",
					buttons: false,
					timer: 4000,
				});
				this.copyMusicURLProgress = 0
			},
			async exportAllMusicURL() {
				switch (global_setting.export) {
					case 'url':
						await this.copyAllMusicURL();
						break;
					case "aria2":
						await this.aria2AllMusicURL();
						break;
					case "csv":
						await this.csvAllMusicURL();
					default:
						swal("用户自定义参数 export 设置错误，可选参数：[url, aria2, csv]", {
							icon: "error",
							buttons: false,
							timer: 3000,
						});
						break;
				}
			},
			selectAllMusic() {
				if (this.musicList.length == this.notDownloadedData.length) {
					this.musicList = []
				} else {
					this.musicList = []
					this.data.forEach((item) => {
						!item.isDownloaded && this.musicList.push(item)
					})
 
				}
			},
			//取消下载功能
			cancelDownload() {
				this.stopDownload = true
				this.cancelDownloadObj.abort()
			},
			// 修改音质功能
			changeQuality() {
				const _this = this
				swal("请选择需要设置的音质，注意：此功能处于测试中，超高音质仅登陆后VIP可用，且部分音频不存在超高音质。(切换后将刷新页面)", {
					buttons: {
						low: "标准",
						mid: "高清",
						high: "超高(仅VIP)",
					},
				}).then((value) => {
					var setting = GM_getValue('priate_script_xmly_data')
					var changeFlag = true
					switch (value) {
						case "low":
							setting.quality = 0;
							break;
						case "mid":
							setting.quality = 1;
							break;
						case "high":
							setting.quality = 2;
							break;
						default:
							changeFlag = false
					}
					GM_setValue('priate_script_xmly_data', setting)
					_this.setting = setting
					changeFlag && location.reload()
				});
			},
			openDonate() {
				showDonate()
			}
		},
		computed: {
			filterData() {
				if (this.isDownloading) {
					return this.musicList
				} else {
					return this.data
				}
 
			},
			notDownloadedData() {
				return this.data.filter((item) => {
					return item.isDownloaded == false
				})
			},
			qualityStr() {
				var quality = (this.setting.quality >= 0 && this.setting.quality <= 2) ? this.setting.quality : 3
				const str = ["标准", "高清", "超高", "未知"]
				return str[quality]
			},
			qualityColor() {
				var quality = (this.setting.quality >= 0 && this.setting.quality <= 2) ? this.setting.quality : 3
				const color = ["#946C00", "#55ACEE", "#00947e", "#337ab7"]
				return color[quality]
			}
		}
	})
	//设置div可拖动
	dragFunc("priate_script_div");
})();
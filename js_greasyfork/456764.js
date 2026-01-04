// ==UserScript==
// @name            _喜馬拉雅批量下載器！
// @version         1.2.3
// @description     喜馬拉雅批量下載器,可以批量下載喜馬拉雅的專輯！
// @author          See7di@Gmail.com
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
// @supportURL		https://www.youtube.com/channel/UCFSN_dR_z4uJz2E8mByRERA
// @homepage		https://www.youtube.com/channel/UCFSN_dR_z4uJz2E8mByRERA
// @contributionURL https://www.youtube.com/@read-book
// @license         MIT
// @namespace       https://www.youtube.com/@read-book
// @downloadURL https://update.greasyfork.org/scripts/456764/_%E5%96%9C%E9%A6%AC%E6%8B%89%E9%9B%85%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BC%89%E5%99%A8%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/456764/_%E5%96%9C%E9%A6%AC%E6%8B%89%E9%9B%85%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BC%89%E5%99%A8%EF%BC%81.meta.js
// ==/UserScript==

(function() {
	'use strict';
	const cfg = {
		number: true,
		offset: 0,
		export: 'url',
		aria2_wsurl: "ws://127.0.0.1:6800/jsonrpc",
		aria2_secret: "",
	}

	function initSetting() {
		window.setTimeout(function(){
			console.clear();console.log('若有問題請聯絡我 see7di@gmail.com');
			//document.querySelectorAll('header')[0].remove();
			document.querySelectorAll('.dl-pc')[0].remove();
			document.querySelectorAll('.xm-player')[0].remove();
			document.querySelectorAll('.container')[0].remove();
			document.querySelectorAll('.float-bar')[0].remove();
			document.querySelectorAll('#rootFooter')[0].remove();
			//document.querySelectorAll('#anchor_sound_list')[0].style.setProperty('margin-bottom','200px');
		},500);
		var setting;
		if (!GM_getValue('_dtool_setting')) {
			GM_setValue('_dtool_setting', {
				multithreading: true,
				left: 20,
				top: 100,
				manualMusicURL: null,
				quality: 1
			})
		}
		setting = GM_getValue('_dtool_setting')
		if (setting.quality !== 0){ setting.quality = setting.quality || 1;}
		GM_setValue('_dtool_setting', setting)
	}
	function injectDiv() {
		var _dtools = document.createElement("div")
		_dtools.innerHTML = `<div id="_dtools"><div><p style='margin:0 0;padding:5px;'>喜馬拉雅批量下載器!　　音質 : <a @click='changeQuality'>{{qualityStr}}</a></p><button class="_jiazai" v-show="!isDoing" @click="loadMusic">{{filterData.length > 0 ? '重新加載' : '加載列表'}}</button><button id='downall' @click="downloadAll" v-show="!isDoing & (isShow==true) & (filterData.length > 0)">下载全部</button><button @click="cancelDownload" v-show="isDoing">取消下載</button></br><table v-show="filterData.length > 0"><thead><tr><th></th><th>操作</th><th>標題</th></tr></thead><tbody id="_dtool_table"><tr v-for="(item, index) in filterData" :key="index"><td><input class="checkMusicBox" v-model="mList" :value='item' type="checkbox" :disabled="item.isDone || isDoing"></td><td><a class="_down" v-show="!item.isDoing && !item.isDone && !isDoing" style='color:#5d718f' @click="downloadMusic(item)">下載</a><a v-show="isDoing && !item.isDoing && !item.isDone" style='color:gray'>等待中</a><a v-show="item.isDoing" style='color:#C01D07'>{{item.progress}}</a><a v-show="item.isDone" style='color:gray'>OK</a><a v-show="item.isFailued" style='color:blue'>失敗</a></td><td align="left"><a :style="'color:' + (item.url ? '#5d718f' : '#5d718f')" @click="copyMusic(item)">{{item.title}}</a></td></tr></tbody></table></div></div>`
		GM_addStyle(`#_dtools{font-size:12px;background-color:#fff;color:#666;text-align:center;padding:5px;border-radius:5px;border:2px solid #5d718f;box-shadow:2px 2px 2px #bbb;z-index:9999;position:fixed;}a{text-decoration:none;}#_dtools table{text-align:center;border:0;margin:5px auto;padding:2px;border-collapse:collapse;display:block;height:400px;overflow-y:scroll;}#_dtools td{border:1px solid #ddd;padding:6px 6px 4px;max-width:300px;word-wrap:break-word;}#_dtools th{border:1px solid #ddd;padding:3px 6px 4px;}#_dtools button{font-size:12px;display:inline-block;box-shadow:2px 2px 2px #bbb;border-radius:4px;border:1px solid #31435e;background-color:#5d718f;color:#fff;text-decoration:none;padding:5px 10px;margin:5px 10px;}#_dtools button:hover{cursor:pointer;box-shadow:0px 0px 0px #bbb;transition:box-shadow 0.2s;}#_dtools .hide-button{z-index:2147483647;width:32px;height:32px;cursor:pointer;position:fixed;left:0px;bottom:0px;color:#660000;text-align:center;line-height:32px;margin:10px;border-width:1px;border-style:solid;border-color:#ccc;border-image:initial;border-radius:100%;}#_dtools .hide-button:hover{background-color:rgba(240, 223, 175, 0.9);}#_dtools textarea{height:50px;width:200px;background-color:#fff;border:1px solid #000000;padding:4px;}.checkMusicBox{transform:scale(1.5,1.5);cursor:pointer;}`);
		document.querySelector("html").appendChild(_dtools)
		var setting = GM_getValue('_dtool_setting')
		document.getElementById("_dtools").style.left = (setting.left || 20) + "px";
		document.getElementById("_dtools").style.top = (setting.top || 100) + "px";

	}
	function dragFunc(id) {
		var Drag = document.getElementById(id);
		var setting = GM_getValue('_dtool_setting')
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
				GM_setValue('_dtool_setting', setting)
			};
		};
		Drag.onmouseup = function() {
			document.onmousemove = null;
			this.style.cursor = "default";
		};
	}
	function initQuality() {
		ah.proxy({
			onRequest:(config, handler) => {handler.next(config)},
			onError:(err, handler) => {handler.next(err)},
			onResponse: (response, handler) => {
				const setting = GM_getValue('_dtool_setting')
				if (response.config.url.indexOf("mobile.ximalaya.com/mobile-playpage/track/v3/baseInfo") != -1) {
					const setting = GM_getValue('_dtool_setting')
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
				handler.next(response)
			}
		})
		unsafeWindow.XMLHttpRequest = XMLHttpRequest
	}
	initSetting()
	injectDiv()
	initQuality()

	async function getUrl1(item) { //第一种获取musicURL的方式，任意用户均可获得，不可获得VIP音频
		var res = null
		if (item.url) {
			res = item.url
		} else {
			const timestamp = Date.parse(new Date());
			var url = `https://mobwsa.ximalaya.com/mobile-playpage/playpage/tabs/${item.id}/${timestamp}`
			$.ajax({
				type: 'get',url: url,async: false,dataType: "json",
				success: function(resp) {
					if (resp.ret === 0) {
						const setting = GM_getValue('_dtool_setting')
						const trackInfo = resp.data.playpage.trackInfo;
						if (setting.quality == 0) {
							res = trackInfo.playUrl32
						} else if (setting.quality == 1) {
							res = trackInfo.playUrl64
						}
					}
				}
			});
		}
		return res
	}

	async function getUrl2(item) { //第二种获取musicURL的方式，任意用户均可获得，不可获得VIP音频
		var res = null
		if (item.url) {
			res = item.url
		} else {
			var url = `https://www.ximalaya.com/revision/play/v1/audio?id=${item.id}&ptype=1`
			$.ajax({
				type: 'get',url: url,async: false,dataType: "json",
				success: function(resp) {
					if (resp.ret == 200) res = resp.data.src;
				}
			});
		}
		return res
	}

	async function get_Url(item) { //获取任意音频方法
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
						setting = GM_getValue('_dtool_setting')
						res = setting.manualMusicURL
					}
					setting.manualMusicURL = null
					GM_setValue('_dtool_setting', setting)
					li.querySelector('div.all-icon').click()
					break
				}
			}
		}
		if (!res && item.isSingle) {
			document.querySelector('div.play-btn').click()
			while (!res) {
				await Sleep(1)
				setting = GM_getValue('_dtool_setting')
				res = setting.manualMusicURL
			}
			setting.manualMusicURL = null
			GM_setValue('_dtool_setting', setting)
			document.querySelector('div.play-btn').click()
		}
		return res
	}

	var vm = new Vue({
		el: '#_dtools',
		data: {
			setting: GM_getValue('_dtool_setting'),
			cur:0,
			data:[],
			mList:[],
			isShow:false,
			isDoing:false,
			isStoped:false,
			ObjCancel:null
		},
		methods: {
			loadMusic() {
				this.cur=0;
				this.isShow=true;
				const all_li = document.querySelectorAll('.sound-list>ul li');
				var result = [];
				all_li.forEach((item) => {
					const item_a = item.querySelector('a');
					const number = item.querySelector('span.num') ? parseInt(item.querySelector('span.num').innerText) + cfg.offset : 0
					const title = item_a.title.trim().replace(/\\|\/|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\<|\>|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\!|\~|\`|\|/g, '').replace(/\./g, '-')
					const music = {
						id: item_a.href.split('/')[item_a.href.split('/').length - 1],
						number,
						title: cfg.number ? `${number}-${title}` : title,
						isDoing: false,
						isDone: false,
						progress: 0,
					}
					result.push(music)
				})

				if (result.length == 0 && location.pathname.split('/')[location.pathname.split('/').length - 1]) {
					const music = {
						id: location.pathname.split('/')[location.pathname.split('/').length - 1],
						title: document.querySelector('h1.title-wrapper').innerText,
						isDoing: false,
						isDone: false,
						progress: 0,
						isSingle: true
					}
					result.push(music)
				}

				if (result.length == 0) {
					swal("加載失敗！", {
						icon: "error",
						buttons: false,
						timer: 3000,
					});
				}
				this.data = result;
				this.mList = [];
				this.data.forEach((item) => {
					this.mList.push(item)
				})
			},
			async getMusicURL(item) {
				var res = await getUrl1(item)
				res = res || await getUrl2(item)
				res = res || await get_Url(item)
				this.$set(item, 'url', res)
				return res
			},
			async downloadAll() {
				this.isShow = false;
				this.isDoing = true;
				var all_down = document.querySelectorAll('#_dtool_table ._down');
				for (var num = 0; num < all_down.length; num++) {
					all_down[num].click();
					//console.log(all_down[num].innerText)
					await Sleep(0.2);
				}
				all_down=null;
			},
			async downloadMusic(item) {
				if(this.isStoped==true){return ;}
				item.isFailued = false
				this.isDoing = true
				item.isDoing = true
				//console.log('total:'+this.mList.length+' cur:'+this.cur);
				if((this.cur+5) >= this.mList.length){
					this.isDoing = false
				}
				this.cur++;
				const details = {
					url: item.url || await this.getMusicURL(item),
					name: item.title.trim().replace(/\\|\/|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\<|\>|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\!|\~|\`|\|/g, '').replace(/\./g, '-'),
					onload: function(e) {
						item.isDoing = false
						item.isDone = true
					},
					onerror: function(e) {
						this.isDoing = false
						console.log(e)
						item.isDoing = false
						if (e.error != 'aborted') item.isFailued = true
					},
					onprogress: function(d) {
						item.progress = ((Math.round(d.done / d.total * 10000 / 100.00))<100) ? (Math.round(d.done / d.total * 10000 / 100.00)) + "%" : '99%';
					}
				}
				this.ObjCancel = GM_download(details)
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
			cancelDownload() {
				this.isStoped = true
				this.ObjCancel.abort()
				document.querySelectorAll('#_dtools ._jiazai')[0].click()
			},
			changeQuality() {
				const _this = this
				swal("請選擇音質:", {
					buttons: {
						low: "標準",
						mid: "高清",
					},
				}).then((value) => {
					var setting = GM_getValue('_dtool_setting')
					var changeFlag = true
					switch (value) {
						case "low":
							setting.quality = 0;
							break;
						case "mid":
							setting.quality = 1;
							break;
						default:
							changeFlag = false
					}
					GM_setValue('_dtool_setting', setting)
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
				if (this.isDoing) {
					return this.mList
				} else {
					return this.data
				}
			},
			qualityStr() {
				var quality = (this.setting.quality >= 0 && this.setting.quality < 2) ? this.setting.quality : 1
				const str = ["標準", "高清"]
				return str[quality]
			}
		}
	})
	dragFunc("_dtools");
})();
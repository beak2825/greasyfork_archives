// ==UserScript==
// @name            百度网盘 - 更高级的重命名
// @version         1.0.5
// @description     你不知道的百度网盘重命名姿势～支持批量替换重命名、手动批量修改后一次提交、智能重命名，拒绝转圈圈！
// @author          Priate
// @match           https://pan.baidu.com/*
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_addStyle
// @icon            https://nd-static.bdstatic.com/m-static/v20-main/favicon-main.ico
// @require         https://unpkg.com/vue@2
// @require         https://unpkg.com/sweetalert@2.1.2/dist/sweetalert.min.js
// @require         https://unpkg.com/jquery@3.2.1/dist/jquery.min.js
// @require         https://greasyfork.org/scripts/435476-priatelib/code/PriateLib.js?version=1202493
// @supportURL      https://greasyfork.org/scripts/443771/feedback
// @homepageURL     https://greasyfork.org/scripts/443771
// @contributionURL https://afdian.net/@cyberubbish
// @license         MIT
// @namespace       https://greasyfork.org/users/219866
// @downloadURL https://update.greasyfork.org/scripts/443771/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%20-%20%E6%9B%B4%E9%AB%98%E7%BA%A7%E7%9A%84%E9%87%8D%E5%91%BD%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/443771/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%20-%20%E6%9B%B4%E9%AB%98%E7%BA%A7%E7%9A%84%E9%87%8D%E5%91%BD%E5%90%8D.meta.js
// ==/UserScript==

(function() {
	'use strict';

	function initSetting() {
		var setting;
		if (!GM_getValue('priate_script_bdwp_data')) {
			GM_setValue('priate_script_bdwp_data', {
				left: 20,
				top: 100,
			})
		}
		setting = GM_getValue('priate_script_bdwp_data')
		GM_setValue('priate_script_bdwp_data', setting)
	}

	function injectDiv() {
		var priate_script_div = document.createElement("div")
		priate_script_div.innerHTML = `
<div id="priate_script_div">
<b style='font-size:30px; font-weight:300; margin: 10px 20px'>更高级的重命名</b>
<p id='priate_script_setting' style='margin: 0 0'>
❤️ by <a @click='openDonate' style='color:#337ab7'>Priate</a> |
v <a href="//greasyfork.org/scripts/443771" target="_blank" style='color:#ff6666'>{{version}}</a> |
<a @click="switchDrag">📌</a> | <a @click="recoverText">♻️</a> | <a v-show="data.length > 0" @click="smartRename">🤖️ |</a> <a @click="clearData">❌</a>
<br>
文件夹重命名 : <a @click='todo' :style='"color:" + (false ? "#00947e" : "#CC0F35")'> 关闭 </a> |
正则 : <a @click='todo' :style='"color:" + (false ? "#00947e" : "#CC0F35")'> 关闭 </a>
<div v-show="data.length">
<a style='color:#946C00;' @click="changeOriginText" v-show="showOriginText">{{'【' + originText + '】'}}</a>
<textarea class="replaceArea" ref="originTextInput" v-show="!showOriginText" @blur="recoverOriginText" type="text" v-model="originText" ></textarea>
<a @click="autoRename">➡️ ➡️ ➡️</a>
<a style='color:#00947e' @click="changeReplaceText" v-show="showReplaceText">{{'【' + replaceText + '】' }}</a>
<textarea class="replaceArea" ref="replaceTextInput" v-show="!showReplaceText" @blur="recoverReplaceText" type="text" v-model="replaceText" ></textarea>
</div>
</p>
<button @click="loadData">{{data.length > 0 ? '重载数据' : '加载数据'}}</button>
<button @click="postRename" v-show="musicList.length > 0"> 确定修改 </button>
</br>
<table v-show="data.length > 0">
<thead><tr><th></th><th>原始文件名</th><th>修改后文件名</th></tr></thead>
<tbody id="priate_script_table">
<tr v-for="(item, index) in data" :key="index">
<td><input class="checkMusicBox" v-model="musicList" :value='item' type="checkbox" :disabled="item.replace == item.origin"></td>
<td><a @click="originText = item.origin" style='color:#337ab7'>{{item.origin}}</a></td>
<td><a v-show="!item.isChanging" @click="manualRename(item)" style='color:#C01D07'>{{item.replace}}</a><textarea class="replaceArea" :ref="item.id" @blur="modifyReplace(item)" v-show="item.isChanging" v-model="item.replace"></textarea></td>
</tr>
</tbody>
</table>
</div>
`
		GM_addStyle(`
#priate_script_div{
font-size : 15px;
position: fixed;
background-color: rgb(240, 223, 175);
color : #660000;
text-align : center;
padding: 10px;
z-index : 9999;
border-radius : 20px;
border:2px solid #660000;
font-weight: 300;
text-stroke: 0.5px;
box-shadow: 5px 15px 15px rgba(0,0,0,0.4);
user-select : none;
-webkit-user-select : none;
-moz-user-select : none;
-ms-user-select:none;
}
#priate_script_div:hover{
box-shadow: 5px 15px 15px rgba(0,0,0,0.8);
transition: box-shadow 0.3s;
}

#priate_script_div a{
margin-bottom: 2px !important;
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
// border:2px solid #660000;
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
font-weight: 300;
-webkit-text-stroke: 0.5px;
text-stroke: 0.5px;
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
font-weight: 300;
-webkit-text-stroke: 0.5px;
text-stroke: 0.5px;
}
/*脚本按钮悬浮样式*/
#priate_script_div button:hover{
cursor : pointer;
color: rgb(240, 223, 175);
background-color: #660000;
transition: background-color 0.2s;
}
/*设置区域 p 标签*/
#priate_script_setting{
user-select : none;
-webkit-user-select : none;
-moz-user-select : none;
-ms-user-select:none;
}
/*swal按钮*/
.swal-button--1{
background-color: #FFFAEB !important;
color: #946C00;
}
.swal-button--2{
background-color: #ebfffc !important;
color: #00947e;
}
.swal-button--3{
background-color: #ECF6FD !important;
color: #55ACEE;
}
.checkMusicBox{
transform: scale(1.7,1.7);
cursor: pointer;
}
.replaceArea{
height : 100%;
width : 100%;
background-color: #fff;
border:1px solid #000000;
padding: 4px;
border-radius: 4px;
}
.replaceInput{
height : 100%;
width : 40%;
background-color: #fff;
border:1px solid #000000;
padding: 4px;
border-radius: 4px;
}
`);
		document.querySelector("html").appendChild(priate_script_div)
		var setting = GM_getValue('priate_script_bdwp_data')
		document.getElementById("priate_script_div").style.left = (setting.left || 20) + "px";
		document.getElementById("priate_script_div").style.top = (setting.top || 100) + "px";
	}

	function dragFunc(id) {
		var Drag = document.getElementById(id);
		var setting = GM_getValue('priate_script_bdwp_data')
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
				GM_setValue('priate_script_bdwp_data', setting)
			};
		};
		Drag.onmouseup = function() {
			document.onmousemove = null;
			this.style.cursor = "default";
		};
	};

	function unDragFunc(id) {
		var Drag = document.getElementById(id);
		Drag.onmousedown = function(event) {
			var ev = event || window.event;
			event.stopPropagation();
		};
		Drag.onmouseup = function() {};
		Drag.onmousemove = function() {};
	};

	//初始化脚本设置
	initSetting()
	//注入脚本div
	injectDiv()

	function getToken() {
		return document.querySelector(".nd-main-list, .nd-new-main-list").__vue__.yunData.bdstoken;
	}

	function getLogid() {
		let ut = unsafeWindow.require("system-core:context/context.js").instanceForSystem.tools.baseService;
		return ut.base64Encode(base.getCookie("BAIDUID"));
	}

	function getPath() {
		var nowPath = location.href.match(/path=(.+?)(?:&|$)/);
		var pathValue;
		if (nowPath)
			pathValue = decodeURIComponent(nowPath[1]);
		else
			pathValue = "/";
		if (pathValue.charAt(0) !== "/")
			pathValue = "/" + pathValue; // 补齐路径前缀斜杠
		if (pathValue.charAt(pathValue.length - 1) !== "/")
			pathValue += "/"
		return pathValue
	}

	function reloadList() {
		document.querySelector(".nd-main-list, .nd-new-main-list").__vue__.reloadList();
	}

	// 处理数据等逻辑
	var vm = new Vue({
		el: '#priate_script_div',
		data: {
			version: "1.0.5",
			setting: GM_getValue('priate_script_bdwp_data'),
			data: [],
			musicList: [],
			showOriginText: true,
			showReplaceText: true,
			originText: "需要替换的内容",
			replaceText: "",
			path: '/',
			isDrag: true,
		},
		methods: {
			loadData() {
				const path = getPath()
				this.path = path
				const all_tr = document.querySelectorAll('table.wp-s-pan-table__body-table tbody>tr');
				var result = [];
				var _this = this
				all_tr.forEach((item) => {
					const type = item.querySelector('img[alt]') ? item.querySelector('img[alt]').getAttribute('alt') : 'unknow'
					if (!item.querySelector('a')) return
					const music = {
						id: item.getAttribute('data-id'),
						origin: item.querySelector('a').getAttribute('title'),
						replace: item.querySelector('a').getAttribute('title'),
						isChanging: false,
						type,
						isFolder: type == 'folder',
					}
					result.push(music)
				})
				// 如果仍未获取到数据
				if (result.length == 0) {
					swal("未获取到数据，请确认此目录下有文件或文件夹！", {
						icon: "error",
						buttons: false,
						timer: 3000,
					});
				}
				this.data = result
				this.musicList = []
			},
			clearData() {
				if (this.data.length == 0) swal(`已经是最简形态了！`, {
					buttons: false,
					timer: 2000,
				});
				this.data = []
				this.musicList = []
			},
			openDonate() {
				showDonate()
			},
			async manualRename(item) {
				this.unDrag()
				item.isChanging = true
				await Sleep(0.01)
				this.$refs[item.id][0].focus();
			},
			modifyReplace(item) {
				this.drag()
				item.isChanging = false
				item.replace = item.replace.trim()
				if (item.replace != item.origin) {
					if (!this.musicList.find(el => el.id == item.id)) {
						this.musicList.push(item)
					}
				} else {
					this.musicList = this.musicList.filter(el => el.id != item.id)
				}

			},
			autoRename() {
				var _this = this
				const origin = this.originText
				const replace = this.replaceText
				var hasChanged = false
				var hasEmpty = false
				this.data.forEach(item => {
					item.replace = item.replace.replace(origin, replace).trim()
					if (item.replace !== item.origin) {
						hasChanged = true
					}
					if (item.replace == "") {
						hasEmpty = true
						item.replace = item.origin
					}
					_this.modifyReplace(item)
				})
				if (!hasChanged) swal(`没有匹配到任何需要修改的文件！`, {
					icon: "error",
					buttons: false,
					timer: 3000,
				});
				if (hasEmpty) swal(`替换后某个文件名为空！`, {
					icon: "error",
					buttons: false,
					timer: 3000,
				});
			},
			async postRename() {
				var _this = this
				const token = getToken()
				// const logid = getLogid()
				const data = this.musicList.map(item => {
					return {
						id: item.id,
						path: `${_this.path}${item.origin}`,
						newname: item.replace,
					}
				})
				$.ajax(`https://pan.baidu.com/api/filemanager?async=2&onnest=fail&opera=rename&bdstoken=${getToken()}&clienttype=0&app_id=250528&web=1`, {
					type: 'post',
					data: {
						filelist: JSON.stringify(data)
					},
					complete: function(res) {
						const resp = res.responseJSON
						if (resp['errno'] == 0) {
							swal(`重命名已完成！\n如部分文件显示未修改请点击 ♻️ 按钮手动刷新！`, {
								icon: "success",
								buttons: false,
								timer: 3000,
							});
						} else {
							swal(`重命名失败！`, {
								icon: "error",
								buttons: false,
								timer: 3000,
							});
						}
						_this.clearData()
					}
				});
				await Sleep(3)
				reloadList()
			},
			switchDrag() {
				if (this.isDrag) {
					this.unDrag()
					swal(`悬浮窗已固定`, {
						buttons: false,
						timer: 2000,
					});
				} else {
					this.drag()
					swal(`悬浮窗可以拖动了`, {
						buttons: false,
						timer: 2000,
					});
				}
			},
			unDrag() {
				this.isDrag = false
				unDragFunc("priate_script_div")
			},
			drag() {
				this.isDrag = true
				dragFunc("priate_script_div")
			},
			async changeOriginText() {
				this.unDrag()
				this.showOriginText = false
				await Sleep(0.01)
				this.$refs.originTextInput.focus();
			},
			async changeReplaceText() {
				this.unDrag()
				this.showReplaceText = false
				await Sleep(0.01)
				this.$refs.replaceTextInput.focus();
			},
			recoverOriginText() {
				this.drag()
				this.showOriginText = true
			},
			recoverReplaceText() {
				this.drag()
				this.showReplaceText = true
			},
			recoverText() {
				reloadList()
			},
			smartRename() {
				var _this = this
				var hasChanged = false
				var hasEmpty = false
				var lengthStatistics = {}
				var maxLength = 0
				this.data.forEach(item => {
					const suffix = item.origin.split('.').length > 1 ? '.' + item.origin.split('.')[item.origin.split('.').length - 1] : ''
					item.numArr = item.origin.replace(suffix, '').match(/\d+/g) || []
					// 寻找出现次数最多的匹配项
					if (lengthStatistics[item.numArr.length] == undefined) lengthStatistics[item.numArr.length] = 1
					else lengthStatistics[item.numArr.length] += 1
				})
				for (var i in lengthStatistics) {
					maxLength = lengthStatistics[i] > maxLength ? i : maxLength
				}
				var seq = -1
				for (var index = 0; index < maxLength; index++) {
					const tempList = this.data.map(item => {
						if (item.numArr.length == maxLength) {
							return item.numArr[index]
						}
					}).filter(l => l != undefined)
					// 判断是否有重复元素
					if (Array.from(new Set(tempList)).length == tempList.length) {
						seq = index
						break
					}
				}
				if (seq < 0) return swal(`智能重命名失败，找不到唯一的数字序号！`, {
					icon: "error",
					buttons: false,
					timer: 3000,
				});
				this.data.forEach(item => {
					if (item.numArr.length == maxLength) {
						const suffix = item.origin.split('.').length > 1 ? '.' + item.origin.split('.')[item.origin.split('.').length - 1] : ''
						item.replace = `${item.numArr[seq]}${suffix}`.trim()
					}
					if (item.replace !== item.origin) {
						hasChanged = true
					}
					if (item.replace == "") {
						hasEmpty = true
						item.replace = item.origin
					}
					_this.modifyReplace(item)
				})

				if (!hasChanged) swal(`没有匹配到任何需要修改的文件！`, {
					icon: "error",
					buttons: false,
					timer: 3000,
				});
				if (hasEmpty) swal(`替换后某个文件名为空！`, {
					icon: "error",
					buttons: false,
					timer: 3000,
				});
			},
			todo() {
				swal(`🈲️🈲️🈲️ 此功能暂不可用，请等待版本更新 🔞🔞🔞`, {
					buttons: false,
					timer: 2000,
				});
			}
		},
		computed: {},
		mounted() {}
	})
	//设置div可拖动
	dragFunc("priate_script_div");
})();
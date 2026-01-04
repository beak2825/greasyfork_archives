// ==UserScript==
// @name         B站自定义弹幕控制面板
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  一个自定弹幕控制面板，按【P】键可以弹出面板
// @author       Simon
// @match        https://live.bilibili.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/472563/B%E7%AB%99%E8%87%AA%E5%AE%9A%E4%B9%89%E5%BC%B9%E5%B9%95%E6%8E%A7%E5%88%B6%E9%9D%A2%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/472563/B%E7%AB%99%E8%87%AA%E5%AE%9A%E4%B9%89%E5%BC%B9%E5%B9%95%E6%8E%A7%E5%88%B6%E9%9D%A2%E6%9D%BF.meta.js
// ==/UserScript==

(function () {
	'use strict';
	// 添加 资源 链接
	const elementCss = document.createElement('link');
	elementCss.rel = 'stylesheet';
	elementCss.href = 'https://cdn.staticfile.org/element-ui/2.15.13/theme-chalk/index.min.css';
	let danmakuElem = null;
	let msgQueue = [];
	//消息冷却时间
	var msgQueueCooldown = 3;


	// elementCss.onload = function () {
	// 	const elementJS = document.createElement('script');
	// 	elementJS.src = 'https://unpkg.com/element-ui@2.15.13/lib/index.js';
	// 	document.head.appendChild(elementJS);
	// };
	document.head.appendChild(elementCss);

	const vueJS = document.createElement('script');
	// vueJS.src = 'https://unpkg.com/vue@2/dist/vue.js';
	vueJS.src = 'https://cdn.staticfile.org/vue/2.7.14/vue.min.js';
	vueJS.onload = function () {
		const elementJS = document.createElement('script');
		elementJS.src = 'https://cdn.staticfile.org/element-ui/2.15.13/index.min.js';
		elementJS.onload = function () {
			createVueInstance();
		};
		document.head.appendChild(elementJS);
	};
	document.head.appendChild(vueJS);
	var customStyles = document.createElement('style');
	customStyles.type = 'text/css';

	// 添加自定义 CSS 样式
	customStyles.innerHTML = `
        /* 自定义 CSS 样式 */
        .row {
            padding-top: 20px;
			padding-left: 10px;
			padding-right: 10px;
        }
		.color0{
			/*background-color: #2b46ff40;*/
			background-color: #109d0040;
		}
		.color1{
			background-color: #ffd90c40;
		}

		.color0mved{
			background-color: #2b46ff40;
		}

		.color1mved{
			background-color: #2b46ff40;
		}

    `;

	/**
 * 获取元素
 * @param selector
 * @param callback
 */
	function findVueElem(selector, callback) {
		// 弹幕输入框model所在元素获取任务定时器
		var times = 0;
		var findElemTimer = setInterval(() => {
			var elem = document.querySelector(selector);
			if (times > 20 || (elem && elem.__vue__)) {
				callback(elem);
				clearInterval(findElemTimer)
			} else {
				console.warn("获取弹幕元素失败")
			}
			times++
		}, 1000)
	}

	findVueElem("#control-panel-ctnr-box", (res) => {
		danmakuElem = res;
	});

	function sendArr(arr, finish = true) {
		var times = 0;
		var timer = setInterval(() => {
			var elem = danmakuElem;
			if (elem && elem.__vue__) {
				let data = elem.__vue__.$data;
				console.log("输出");
				console.log(data);
				if (data && arr.length > 0) {
					let or_msg = data.chatInput;//记录原来的弹幕内容
					data.chatInput = arr.shift().substring(0, 20)
					elem.__vue__.sendDanmaku()
					data.chatInput = or_msg;//还原本来的弹幕内容
				}
				if (arr.length === 0 && finish) {
					clearInterval(timer)
				}
			} else if (times < 20) {
				console.warn("danmakuElem 为空")
			} else {
				console.warn("消息队列因获取不到弹幕输入框model终止")
				clearInterval(timer)
			}
			times++
		}, msgQueueCooldown * 1000)
	}
	// 消息队列数据发送
	sendArr(msgQueue, false)

	// 将 <style> 元素添加到 <head> 元素中
	document.head.appendChild(customStyles);

	var config = GM_getValue("config");
	if (!config) {
		config = [];
	}
	function createVueInstance() {
		const vueDiv = document.createElement('div');
		vueDiv.id = "vue_tm";
		vueDiv.innerHTML = `
			<el-dialog title="编辑面板" :visible.sync="editPanelVisible" width="50%" :before-close="handleCloseEditPane">
			<el-form :inline="true" style="display: flex; flex-wrap: wrap;">
				<span v-for="(item, index) in elements" :key="index" class="row">
					<el-card :class="['color' + index%2 +getValDefaultEmpty(item.mved)]">
							<el-form-item>
								<el-switch v-model="item.input" active-text="附加指令"></el-switch>
							</el-form-item>
							<el-form-item>
								<el-input v-if="item.input" v-model="item.msg"
									placeholder="附加指令" readonly></el-input>
							</el-form-item>
							<el-form-item label="指令">
								<el-input v-model="item.fixedMsg" placeholder="指令"></el-input>
							</el-form-item>
							<el-form-item>
							<el-switch v-if="item.input" v-model="item.isClear" active-text="执行后清空"></el-switch>
						</el-form-item>
						<el-form-item label="按钮标题">
								<el-input v-model="item.title" placeholder="按钮标题"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary">{{item.title}}</button>
						</el-form-item>
						<el-row>
							<el-button-group>
								<el-button title="置顶" @click="moveArrayElement(index,0)" icon="el-icon-top"></el-button>
								<el-button title="上移" @click="moveArrayElement(index,index-1)" icon="el-icon-arrow-up"></el-button>
								<el-button title="下移" @click="moveArrayElement(index,index+1)" icon="el-icon-arrow-down"></el-button>
								<el-button title="置底" @click="moveArrayElement(index,elements.length-1)" icon="el-icon-bottom"></el-button>
							</el-button-group>
							<el-button type="danger" icon="el-icon-delete" circle @click="removeElement(index)"></el-button>
						</el-row>
					</el-card>
				</span>
			</el-form>
			<br />
			<el-row class="row">
				<el-col :span="4">
					<!--<el-switch v-model="hasbtn" active-text="添加按钮"></el-switch>-->
					<label>功能名称</label>
				</el-col>
				<el-col :span="16">
					<el-input v-model="title" placeholder="请输入功能名称"></el-input>
				</el-col>
			</el-row>
			<el-row class="row">
				<el-col :span="8">
					<el-switch v-model="hasinput" active-text="附加指令"></el-switch>
				</el-col>
				<el-col :span="8">
					<el-switch v-if="hasinput" v-model="isClear" active-text="执行后清空"></el-switch>
				</el-col>
			</el-row>
			<el-row class="row">
				<el-col :span="4">
					<label>固定指令</label>
				</el-col>
				<el-col :span="20">
					<el-input v-model="fixedMsg" placeholder="固定指令"></el-input>
				</el-col>
			</el-row>
			<el-row class="row">
				<el-button type="primary" icon="el-icon-plus" @click="addElement()">添加</el-button>
			</el-row>
			<div class="row">
				<el-button type="success" icon="el-icon-check" @click="save()">保存</button>
			</div>
		</el-dialog>

		<el-dialog title="命令面板" :visible.sync="cmdPanelVisible" width="50%" :before-close="handleCloseCmdPanel">
			<div style=" flex-wrap: wrap;width:100%">
				<div v-for="(item, index) in elements" :key="index" class="row">
					<el-card :class="['color' + index%2 + getValDefaultEmpty(item.mved)]">
						<el-row>
							<el-col :span="16">
								<el-row>
									<el-col :span="12">{{item.fixedMsg}}</el-col>
									<el-col :span="12" v-if="item.input">
										<el-input v-model="item.msg" style="min-width:100px"
											placeholder="附加指令"></el-input>
									</el-col>
								</el-row>
							</el-col>
							<el-col :span="8">
								<div style="padding-left:8px">
									<el-button type="primary" @click="sendMsg(item)">{{item.title}}</button>
								</div>
							</el-col>
						</el-row>
					</el-card>
				</div>
			<div>
		</el-dialog>
    `;
		document.body.appendChild(vueDiv);
		// const bodyParent = document.body.parentNode;

		// 将挂载点插入到 <body> 元素的父元素中
		// bodyParent.insertBefore(vueDiv, document.body.nextSibling);
		console.log(document.getElementById("vue_tm"));

		var vueObj = null;
		vueObj = new Vue({
			el: '#vue_tm', // 将 Vue 应用挂载到 id 为 'vue_tm' 的 div 上
			data: {
				editPanelVisible: false,
				cmdPanelVisible: false,
				msg: "",
				title: "",
				fixedMsg: "",
				hasinput: false,
				hasbtn: false,
				isClear: false,
				elements: [{
					title: "切歌",
					msg: "信息",
					input: true,
					btn: true
				}, {
					title: "切歌2",
					msg: "信息",
					input: true,
					btn: true
				}
				]
			},
			mounted: function () {
				// Vue 初始化完成后执行的代码
				this.elements = config;
				this.$nextTick(function () {
					// Vue 更新 DOM 后执行的代码
				});
			},
			methods: {
				getValDefaultEmpty(val) {
					if (val) {
						return val;
					} else {
						return "";
					}
				},
				openEditPanel() {
					this.editPanelVisible = true;
				},
				openCmdPanel() {
					this.cmdPanelVisible = true;
				},
				handleCloseEditPane(done) {
					done();
				},
				handleCloseCmdPanel(done) {
					done();
				},
				changeMessage() {
					this.message = '消息已改变！';
				},
				sendMsg(item) {
					console.log(item);
					msgQueue.push(item.fixedMsg + item.msg);
					if (item.isClear) {
						item.msg = "";
					}
					this.$message({
						showClose: true,
						message: '操作成功',
						type: 'success'
					});
				},
				addElement() {
					this.elements.push(
						{
							mved: "",
							title: this.title,
							msg: this.msg,
							input: this.hasinput,
							fixedMsg: this.fixedMsg,
							isClear: this.isClear
							// btn: this.hasbtn
						});
				},
				removeElement(index) {
					try {
						this.elements.splice(index, 1);
					} catch (err) {
						this.$message.error('出错了');
						console.error(err);
					}
				},
				save() {
					GM_setValue("config", this.elements);
					this.$message({
						showClose: true,
						message: '保存成功',
						type: 'success'
					});
				},
				moveArrayElement(fromIndex, toIndex) {
					if (toIndex < 0) {
						//已到达顶部
						this.$message({
							message: '已到达顶部',
							type: 'warning'
						});
						return;
					}
					if (toIndex >= this.elements.length) {
						//已到达底部
						this.$message({
							message: '已到达底部',
							type: 'warning'
						});
						return;
					}
					if (toIndex >= this.elements.length) {
						let k = toIndex - this.elements.length + 1;
						while (k--) {
							this.elements.push(undefined);
						}
					}
					this.elements.splice(toIndex, 0, this.elements.splice(fromIndex, 1)[0]);
					this.elements[toIndex].mved = "mved";
					setTimeout(function (that) {
						that.elements[toIndex].mved = "";
						that.$forceUpdate();
						console.log(that.elements[toIndex].mved );
					}, 500,this);

				}
			}
		});
		console.log("################################### Vue #######################");

		// 注册配置面板菜单
		GM_registerMenuCommand('#️⃣ 打开命令面板', function () {
			vueObj.openCmdPanel();
		});
		GM_registerMenuCommand('#️⃣ 打开配置面板', function () {
			vueObj.openEditPanel();
		});

		function handleKeyDown(event) {
			// 检查是否按下了 Ctrl+Shift+D 组合键
			//if (event.ctrlKey && event.shiftKey &&( event.key === 'f'|| event.key === 'F')) {
			if (( event.key.toLocaleUpperCase() === 'P')) {
				if(event.ctrlKey||event.shiftKey||event.altKey||event.winKey||event.metaKey){
					console.log("按下了控制键")
					return;
				}
				if(document.activeElement === document.querySelector('textarea.chat-input')){
					return;
				}
				console.log("按下键盘");
				event.preventDefault();
				if(vueObj){
					vueObj.openCmdPanel();
				}
			}
		}
		document.addEventListener('keydown', handleKeyDown);
	}
})();

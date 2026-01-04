// ==UserScript==
// @name         郑州信息科技职业技术学院
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  【郑信科刷课时,题,讨论,因网站的更新，进行了js反调试，功能失效，所有我自写了软件替代插件方式,进行自动化刷课，有需要可以加我QQ2428385281】
// @author       lyk
// @match        *://*.open.ha.cn/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
// @grant        none
// @icon         https://www.techcollege.cn/templates_site/zzvuit/main/img/icon_logo.svg
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444715/%E9%83%91%E5%B7%9E%E4%BF%A1%E6%81%AF%E7%A7%91%E6%8A%80%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%AD%A6%E9%99%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/444715/%E9%83%91%E5%B7%9E%E4%BF%A1%E6%81%AF%E7%A7%91%E6%8A%80%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%AD%A6%E9%99%A2.meta.js
// ==/UserScript==
(function() {
	'use strict';

	load_zhushou()

	function load_zhushou() {
		var gg3 = setInterval(function() {
			inactiveSeconds = 0;
		}, 60000);
		console.log('引入郑信科成功')

		var config = GM_getValue("config") || {
			playvideo: false
		}
		if (window.location.href.indexOf("resource_upload") == -1 && config.playvideo) {
			window.onload = function() {

				console.log(document.querySelector('#playDiv_1_html5_api'))
				document.querySelector('#playDiv_1_html5_api').click()
				var gg = setInterval(function() {
					console.log("123456", document.body.getElementsByClassName('vjs-big-play-button').length, document.body.getElementsByClassName(
						'vjs-mute-control vjs-control vjs-button vjs-vol-3').length)

					if (document.body.getElementsByClassName('vjs-big-play-button').length == 1) {
						if (document.body.getElementsByClassName('vjs-mute-control vjs-control vjs-button vjs-vol-3').length != 0) {
							document.body.getElementsByClassName('vjs-mute-control vjs-control vjs-button vjs-vol-3')[0].click();
						}
						if (document.body.getElementsByClassName('vjs-play-control vjs-control vjs-button vjs-playing').length != 0) {
							clearInterval(gg);
						} else {
							document.body.getElementsByClassName('vjs-big-play-button')[0].click();
						}

					}
				}, 2000);

			}



			// d.eq(0).click()
		}





		function encryptByDES(message, key) {
			var keyHex = CryptoJS.enc.Utf8.parse(key);
			var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
				mode: CryptoJS.mode.ECB,
				padding: CryptoJS.pad.Pkcs7
			});
			return encrypted.ciphertext.toString();
		}

		function decryptByDES(ciphertext, key) {
			var keyHex = CryptoJS.enc.Utf8.parse(key);
			var decrypted = CryptoJS.DES.decrypt({
				ciphertext: CryptoJS.enc.Hex.parse(ciphertext)
			}, keyHex, {
				mode: CryptoJS.mode.ECB,
				padding: CryptoJS.pad.Pkcs7
			});
			var result_value = decrypted.toString(CryptoJS.enc.Utf8);
			return result_value;
		}

		var geturl = "https://3691dd50-4be3-48f7-9a1b-65676a2559a1.bspapp.com/http/"

		function start(body) {
			//console.log(JSON.stringify(body.data))
			GM_xmlhttpRequest({
				method: "POST",
				url: body.url,
				data: JSON.stringify(body.data),
				onload: function(response) {
					var res = JSON.parse(response.response)
					console.log("请求结果", res)
					if (res.success == "false") {
						console.log("加载出错", res)
						change_usestate("加载出错，请重新刷新页面")
						return 0;
					}
					change_usestate("首次加载数据时间较长，当前所用:" + parseInt((new Date().getTime() - first_time) / 1000) +
						"秒")
					if (res.result.give.content.userId != undefined) {
						console.log("请求结果", res.result.give.content)
						window.userId = res.result.give.content.userId
						GM_setValue("userId", res.result.give.content.userId)
						loaduser(res.result.give.content)

					}
					if (res.result.give.inner != undefined) {
						window.give = res.result.give
						loading()
					}
					if (res.result.body != undefined) {

						var senddata = res.result.body.isform ? convertObj(res.result.body.data) : JSON
							.stringify(res.result.body.data)
						GM_xmlhttpRequest({
							method: "POST",
							url: res.result.body.url,
							headers: res.result.body.headers,
							data: senddata,
							onload: function(response) {
								var ndata = response.response
								var getdata = {
									ndata: encryptByDES(ndata, "666"),
									action: res.result.give.action,
									content: res.result.give.content,
									url: window.location.href,
								}
								if (res.result.give.content.userId != undefined) {
									getdata.userId = res.result.give.content.userId
								}
								start({
									url: res.result.give.url,
									data: getdata
								})
							},
							onerror: function(err) {
								console.log("请求出错", err)
							}
						})
					}
				},
				onerror: function(err) {
					console.log("请求出错", err)
				}
			})
		}

		var data = {
			action: "reptile",
			content: {},
		}

		console.log(window.location.href)

		if (window.location.href.indexOf("/student") != -1) {

			window.current_edition = "实时更新版本"
			GM_addStyle(
				`.s_selected{
border-radius:30px;
color:white;
background:rgb(0,187,221);
font-size:8px;
padding:3px 5px;margin:0px 5px
}
`
			)


			$('head').append(
				'<link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.1/theme-chalk/index.min.css">'
			)
			window.anlist = []


			function convertObj(data) {
				var _result = [];
				for (var key in data) {
					var value = data[key];
					if (value.constructor == Array) {
						value.forEach(function(_value) {
							_result.push(key + "=" + _value);
						});
					} else {
						_result.push(key + '=' + value);
					}
				}
				return _result.join('&');
			}

			function getJson(url) {
				if (url.indexOf("?") != -1) {
					var arr = url.split('?')[1].split('&')
					var theRequest = new Object();
					for (var i = 0; i < arr.length; i++) {
						var kye = arr[i].split("=")[0]
						var value = arr[i].split("=")[1]
						theRequest[kye] = value
					}
					return theRequest;
				}
				return {}
			}

			function getGroup(data, index = 0, group = []) {
				var need_apply = new Array();
				need_apply.push(data[index]);
				for (var i = 0; i < group.length; i++) {
					need_apply.push(group[i] + data[index]);
				}
				group.push.apply(group, need_apply);
				if (index + 1 >= data.length) return group;
				else return getGroup(data, index + 1, group);
			}

			GM_addStyle(
				`

.v-modal
{
display:none;
}

.do_res{
float: right;
cursor: pointer;
background: #fff;
border: 1px solid #ffffff;
padding: 5px 15px;
border-radius: 5px;
background: rgb(64,158,255);
color: white;
}

.interaction-name{
width:auto;
}
.el-icon-minus {
line-height: 38px;
}

.el-icon-plus {
line-height: 38px;
}

.el-collapse-item__header {
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
}

.open_help {
position: fixed;
right: 10%;
bottom: 20%;
z-index:300;
}
.ex_title{
font-weight: bold;
}
.ex_title img{
width:100px;
}
.ex_option{

}
.sd{
color:#409EFF;
}
.infinite-list{
text-align: left;
padding-left: 0px;
height: 600px;
background: whitesmoke;
}
.infinite-list-item {
background: white;
margin: 10px;
padding:10px;
border-radius:10px;
font-size:15px;
}
`
			)


			$('head').append(
				'<link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.1/theme-chalk/index.min.css">'
			)

			console.log(window.location.href, $("#headContainer"), $(".display-head"))
			var ele;

			if ($(".display-head").length != 0) {
				ele = $(".display-head")
			} else {
				ele = $("#headContainer")
			}

			ele.append(
				`
<div class="container" id="zhushou">
<el-button @click="drawer=!drawer" type="success" class="open_help" plain round  icon="el-icon-s-tools" >{{helpstate}}
</el-button>
<el-dialog
title="提示"
:visible.sync="dialogVisible"
width="30%"
>
<span>{{notice}}</span>
<span slot="footer" class="dialog-footer">
<el-button type="primary" @click="confirm">确 定</el-button>
</span>
</el-dialog>
<el-drawer title="我是标题" :visible.sync="drawer" :with-header="false" direction="rtl">
<div style="padding:10px;">
<el-tabs v-model="activeName" @tab-click="handleClick">
<el-tab-pane label="基本功能" name="first">
<el-form ref="form" :model="form" label-width="80px">
<el-form-item label="账号身份">
{{user.level}}
</el-form-item>
<el-form-item label="账号CP">
{{user.CP}}
</el-form-item>
<el-form-item label="今日限制">
{{user.limit}}
</el-form-item>
<el-form-item label="连接状态">
连接成功
</el-form-item>
<el-form-item label="运行状态">
<el-button @click="start_load">{{usestate}}</el-button>
</el-form-item>

<el-form-item label="非视频资源">
<el-button @click="victory">{{resstate}}</el-button>
</el-form-item>

<el-form-item label="课程目录刷视频">

<el-switch @change="changeconfig"
v-model="config.playvideo"
active-color="#13ce66"
>
</el-switch>
</el-form-item>

</el-form>
</el-tab-pane>



<el-tab-pane label="完成测验" name="finish">

<div style="display:flex;">
<el-button type="primary" @click="do_all_exam">{{sumbit_num==0?'一键完成有答案且未满分的测验':'有'+sumbit_num+'正在做题'}}</el-button>
</div>

<ul class="infinite-list"  style="overflow:auto" v-infinite-scroll="load">
<li v-for="(item,i) in exam_list" class="infinite-list-item">
<div class="ex_title" v-html="item.title"></div>
<div class="option"  v-html="'当前分数'+item.heighestScore+'-'+(item.score==null?'暂无答案':'满分'+item.score)+'-剩余次数'+(3-item.times)"></div>
<el-button :type="item.time!=-1?'primary':'mini'" v-if="item.state" @click="do_exam(i)">{{item.time!=-1?'交卷倒计时:'+item.time:'开始满分交卷'}}</el-button>
<el-button  type="mini" v-if="3-item.times>0" @click="go_exam(i)">自己做题</el-button>
</li>
</ul>
</el-tab-pane>


<el-tab-pane label="模糊搜索" name="third" disabled>

<div style="display:flex;">
<el-input
placeholder="请输入至少6位标题，并且返回结果至多20条"
v-model="search"
clearable>
</el-input>

<el-button type="primary" @click="start_search">搜索</el-button>
</div>

<ul class="infinite-list"  style="overflow:auto" v-infinite-scroll="load">
<li v-for="(item,i) in search_question" class="infinite-list-item">
<div class="ex_title" v-html="item.issearch?'【有答案】'+re('【'+item.y+'】'+item.t):re('【'+item.y+'】'+item.t)"></div>
<div v-for="option in item.s" :class="item.a.indexOf(option)!=-1?'ex_option sd':'option' "  v-html="re(option)"></div>
<div class="answer" v-for="an in item.a" v-if="item.y=='填空题'" v-html="re(an)"></div>
</li>
<li class="" v-if="search_question.length==0">当前无搜索结果或请先搜索</li>
</ul>
</el-tab-pane>





<el-tab-pane label="充值中心" disabled name="fourth">
<el-form>
<el-input v-model="code" placeholder="请填写32位数字字母混合卡密"></el-input>
<el-button type="primary" @click="buy">购买卡密</el-button>
<el-button type="primary" @click="checkcard">查询卡密</el-button>
<el-button type="primary" @click="used_card">确认充值</el-button>
<el-form-item label="账号昵称">
{{user.user_name}}
</el-form-item>
<el-form-item label="账号身份">
{{user.level}}
</el-form-item>
<el-form-item label="账号CP">
{{user.CP}}
</el-form-item>
<el-form-item label="请求限制">
{{user.limit}}
</el-form-item>
<el-form-item label="账号卡密">
{{user.Inviter==""?user.userId:"该卡密已被使用"}}
</el-form-item>
<el-form-item label="使用备注" v-if="user.Inviter==''">
{{user.cardnotice}}
</el-form-item>
<el-form-item label="CP无消耗">
{{new Date().getTime()>(user.unlimited-8*60*60*1000)?"无CP消耗时间已到期":"至"+dateFormat("YYYY-mm-dd HH:MM:SS", new Date(user.unlimited-8*60*60*1000))}}
</el-form-item>
</el-form>

</el-tab-pane>


<el-tab-pane label="使用说明" name="fifth">
<ul class="infinite-list"  style="overflow:auto" v-infinite-scroll="load" v-html="inner">
</ul>
</el-tab-pane>

<el-tab-pane label="其他配置" name="sixth">
<ul class="infinite-list"  style="overflow:auto;background:white" v-infinite-scroll="load">
<div style="padding:30px" v-if="config!=null">
<el-form>


<el-form-item label="面板隐藏快捷键">
ctrl+x
</el-form-item>


</el-form>
<div>
</ul>
</el-tab-pane>
</el-tabs>
</div>

</el-tabs>
</div>

</el-drawer>
</div>
`
			)


			var vm = new Vue({
				el: '#zhushou',
				data: {
					drawer: false,
					activeName: 'first',
					user: {
						CP: 0,
						level: "加载账号中",
						limit: 0
					},
					delay: 10,
					activeNames: ['1'],
					questiontext: "",
					form: {
						name: '',
						region: '',
						date1: '',
						date2: '',
						delivery: false,
						type: [],
						resource: '',
						desc: ''
					},
					room: "",
					examstate: "提前阅卷",
					dialogVisible: false,
					notice: "",
					question: [],
					code: "",
					helpstate: "助手",
					current_edition: current_edition,
					edition: "",
					inner: "加载中",
					reslist: [],
					resstate: "正在加载",
					usestate: "加载助手中",
					first_time: 0,
					search_question: [],
					search: "",
					config: {
						playvideo: false
					},
					exam: {
						limit: true,
						see_answer: false
					},
					course: {
						join: false
					},
					exam_list: [],
					roomlist: [],
					room_question: [],
					req_question: [],
					room_state: false,
					room_req_state: false,
					exam_id: [],
					exam_l: false,
					like: false,
					hide: false,
					sub_list: [],
					total: 999,
					page: 0,
					resstate: "请到课程目录",
					sumbit_num: 0
				},
				mounted() {
					this.config = GM_getValue("config") || {
						playvideo: false
					}

					if (window.location.href.indexOf("courseContent") != -1) {
						this.load_exam()
						this.check_res()
						this.vidio()
					}
					this.look()
					window.hideloading = this.hideloading
					window.loaduser = this.loaduser
					window.showloading = this.showloading
					window.change_question = this.change_question
					window.change_activeName = this.change_activeName
					window.change_usestate = this.change_usestate
					window.loading = this.loading
					window.delay = this.delay
					window.change_examstate = this.change_examstate
					window.tanchu = this.tanchu
					window.set_drawer = this.set_drawer
					window.first_time = new Date().getTime()
					this.start_load()



					window.config = this.config
					$(document).bind('keydown', 'ctrl+x', () => {
						console.log("隐藏面板", this.hide)

						if (!this.hide) {
							$("#zhushou").attr("style", "display:none")
							$("#search").attr("style", "display:none")
							$("#addanswer").attr("style", "display:none")
							$("#getanswer").attr("style", "display:none")
							$("#answ").attr("hidden", "true")
							this.drawer = false
							$('*').each((idx, element) => {
								if ($(element).attr("style") != undefined && $(element).attr(
										"style").indexOf("whitesmoke") != -1) {
									$(element).attr("style", "background:rgba(0,0,0,0)")
								}
							})
						} else {
							$("#zhushou").attr("style", "display:block")
							$("#search").attr("style", "display:block")
							$("#addanswer").attr("style", "display:block")
							$("#zhushou").attr("style", "display:block")
							$("#answ").removeAttr("hidden")
							$('*').each((idx, element) => {
								if ($(element).attr("style") != undefined && $(element).attr(
										"style").indexOf("rgba(0,0,0,0)") != -1) {
									$(element).attr("style", "background:whitesmoke")
								}
							})

						}
						this.hide = !this.hide

					});
				},
				methods: {

					look() {

						if (window.location.href.indexOf("activityId") != -1 && this.config.playvideo) {
							this.helpstate = "刷视频中"
							var len = 0;
							window.start_url = window.location.href
							console.log("大页面执行")
							var url_3 = getJson(window.location.href)
							$.ajax({
								type: "GET",
								url: "http://jx.open.ha.cn/jxpt-web/student/course/getAllActivity/" + url_3.courseVersionId,
								dataType: "json",
								data: {},
								success: function(tes) {
									let i, j;
									for (i = 0; i < tes.body.length; i++) {
										for (j = 0; j < tes.body[i].activitys.length; j++) {
											if (tes.body[i].activitys[j].activityId == url_3.activityId) {
												if (tes.body[i].activitys[j].totalTime >= 0 && tes.body[i].activitys[j].totalTime < tes.body[i].activitys[
														j].length) {
													len = tes.body[i].activitys[j].length - tes.body[i].activitys[j].totalTime;
												} else {
													len = tes.body[i].activitys[j].length;
												}


												len = len + 60;
												var t = 0;
												var add = setInterval(function() {
													t = t + 1;
													if (t >= len) {
														clearInterval(add);
														window.location.href =
															"http://jx.open.ha.cn/jxpt-web/student/courseuser/courseContent?courseVersionId=" + url_3.courseVersionId;
													}
													console.log(t)

												}, 1000);

												break;

											}
										}
									}

								}
							});
						}
					},

					vidio() {
						if (config.playvideo) {
							var url_v = getJson(window.location.href)
							$.ajax({
								type: "GET",
								url: "http://jx.open.ha.cn/jxpt-web/student/course/getAllActivity/" + url_v.courseVersionId,
								dataType: "json",
								data: {},
								success: function(test6) {
									let i, j
									for (i = 0; i < test6.body.length; i++) {
										for (j = 0; j < test6.body[i].activitys.length; j++) {
											if (test6.body[i].activitys[j].type == '2' && test6.body[i].activitys[j].totalTime < test6.body[i].activitys[
													j].length) {
												console.log("已看", test6.body[i].activitys[j].totalTime)
												console.log("一共", test6.body[i].activitys[j].length)
												console.log(test6.body[i].activitys[j].activityName)
												console.log("跳转未看完的视频")
												window.location.href = "http://jx.open.ha.cn/jxpt-web/student/activity/display?courseVersionId=" +
													url_v.courseVersionId + "&activityId=" + test6.body[i].activitys[j].activityId
												break;
												// vio.push(test6.body[i].activitys[j].activityName)
											}

										}
										if (j <= test6.body[i].activitys.length - 1) {
											break;
										}
									}
								}
							});
						}
					},
					check_res() {
						window.list = []
						var url_2 = getJson(window.location.href)
						if (url_2.courseVersionId != undefined) {
							$.ajax({
								type: "GET",
								url: "http://jx.open.ha.cn/jxpt-web/student/course/getAllActivity/" + url_2.courseVersionId,
								dataType: "json",
								data: {},
								success: test1 => {
									let i, j
									for (i = 0; i < test1.body.length; i++) {
										for (j = 0; j < test1.body[i].activitys.length; j++) {
											if (test1.body[i].activitys[j].type == '3' && test1.body[i].activitys[j].totalTime == null) {
												window.list.push(test1.body[i].activitys[j].activityId)
											}

										}

									}
									if (list.length != 0) {
										this.resstate = "还有" + list.length + "个待完成"

									} else {
										this.resstate = "全部已完成"
										//window.location.href="http://jx.open.ha.cn/jxpt-web/student/courseuser/courseContent?courseVersionId="+url_2.courseVersionId;

										/*  setTimeout(function(){
										        vidio();
										    },4000)

										    */
									}
								}

							});

						}
					},
					victory() {
						if (window.list.length != 0) {
							this.resstate = "还有" + list.length + "个待完成"
							var url_1 = getJson(window.location.href)
							$.ajax({
								type: "GET",
								url: "http://jx.open.ha.cn/jxpt-web/student/course/getAllActivity/" + url_1.courseVersionId,
								dataType: "json",
								data: {},
								success: test => {
									$.ajax({
										type: "POST",
										url: "http://jx.open.ha.cn/jxpt-web/common/learningBehavior/heartbeat",
										dataType: "",
										data: {
											activityId: "",
											courseVersionId: url_1.courseVersionId,
											isResourcePage: false,
											playStatus: false,
											token: 'PWzCXTfB',
											type: 3
										},
										success: test2 => {
											$.ajax({
												type: "GET",
												url: "http://jx.open.ha.cn/jxpt-web/student/activity/display?courseVersionId=" + url_1.courseVersionId +
													"&activityId=" + list[0],
												data: {},
												success: two => {
													var recid = /\"resourceCenterId\": \"\w+\"/.exec(two)[0].replace(/\"resourceCenterId\": /,
														"").replace(
														/\"/g, "")
													var reid = /\"resourceId\": \"\w+\"/.exec(two)[0].replace(/\"resourceId\": /, "").replace(
														/\"/g,
														"")
													$.ajax({
														type: "GET",
														url: "http://jx.open.ha.cn/jxpt-web/student/resource/getPlayUrl?resourceCenterId=" + two
															.recid +
															"&resourceId=" + two.reid,
														data: {},
														success: test4 => {
															window.list.shift();
															return this.victory();
														}
													});

												}
											});
										}
									});
								},
							});

						} else {

							window.location.href = window.location.href
						}
					},
					do_all_exam() {
						for (var i = 0; i < this.exam_list.length; i++) {
							if (this.exam_list[i].time == -1 && this.exam_list[i].score > this.exam_list[i].heighestScore) {
								this.do_exam(i)
							}
						}
					},


					up_exam() {
						var ask = getJson(window.location.href)
						var data = {
							"action": "get_exam",
							"userId": $("#stuId").val(),
							"exam_list": []
						}

						for (var i = 0; i < this.exam_list.length; i++) {
							data.exam_list.push({
								examId: this.exam_list[i].homeworkId,
								courseId: ask.courseVersionId
							})
						}

						GM_xmlhttpRequest({
							method: "POST",
							url: "https://3691dd50-4be3-48f7-9a1b-65676a2559a1.bspapp.com/http/search",
							data: JSON.stringify(data),
							onload: response => {
								var res = JSON.parse(response.response)
								console.log("内容", res)
								this.sub_list = this.sub_list.concat(res.result.sub_list)
								for (var i = 0; i < this.sub_list.length; i++) {
									for (var j = 0; j < this.exam_list.length; j++) {
										this.exam_list[j].time = -1
										if (this.exam_list[j].homeworkId == this.sub_list[i].homeworkId) {
											this.exam_list[j].score = this.sub_list[i].score
											this.exam_list[j].sub = this.sub_list[i]
											var time = new Date().getTime()
											if (3 - this.exam_list[j].times > 0 && this.exam_list[j].startTime < time && this.exam_list[j].endTime >
												time) {
												this.exam_list[j].state = true
											}
										}
									}
								}
								//this.sub_exam()

							},
							onerror: function(err) {

								tanchu("查询失败")
							}
						})

					},

					go_exam(i) {
						var url = "http://jx.open.ha.cn/jxpt-web/student/homework/showHomeworkByStatus?homeworkId=" + this.exam_list[
								i]
							.sub.homeworkId + "&courseVersionId=" + this.exam_list[i].sub.courseVersionId + "&checked=false"
						console.log(url)
						window.location.href = url
					},

					do_exam(i) {
						console.log("开始提交", i)
						var url = "http://jx.open.ha.cn/jxpt-web/student/homework/showHomeworkByStatus?homeworkId=" + this.exam_list[
								i]
							.sub.homeworkId + "&courseVersionId=" + this.exam_list[i].sub.courseVersionId + "&checked=false"
						var new_url = "http://jx.open.ha.cn/jxpt-web/student/homework/showHomeworkByStatus?homeworkId=" + this.exam_list[
							i].sub.homeworkId + "&courseVersionId=" + this.exam_list[i].sub.courseVersionId + "&checked=true"
						if (this.exam_list[i].time == -1) {
							this.sumbit_num++
							$.ajax({
								type: "GET",
								url: url,
								success: html => {

									this.exam_list[i].sub.pageId = /window.pageId = \'\w{12}/.exec(html)[0].replace('window.pageId = \'',
										"")
									console.log("开始提交内容", this.exam_list[i].sub)
									var sub = this.exam_list[i].sub
									this.exam_list[i].time = 65
									this.exam_list[i].clock = setInterval(() => {
										this.exam_list.push({})
										this.exam_list.pop()

										this.exam_list[i].time = this.exam_list[i].time - 1
										if (this.exam_list[i].time == -1) {
											$.ajax({
												cache: true,
												type: "POST",
												url: "/jxpt-web/student/homework/submitHomework",
												data: JSON.stringify(sub),
												contentType: "application/json; charset=utf-8",
												async: true,
												success: res => {
													console.log("提交结果", res)
													if (res.body == "该作业内容已被老师修改，可以点击【保存草稿】按钮，或者刷新页面重新填写！") {
														$.ajax({
															type: "GET",
															url: new_url,
															success: html => {

																var data = {
																	"action": "reptile",
																	"userId": $("#stuId").val(),
																	"ndata": encryptByDES(html, "666"),
																	"content": {
																		"id": sub.homeworkId,
																		"state": "update_test"
																	}
																}

																GM_xmlhttpRequest({
																	method: "POST",
																	url: "https://3691dd50-4be3-48f7-9a1b-65676a2559a1.bspapp.com/http/exam",
																	data: JSON.stringify(data),
																	onload: response => {
																		var res = JSON.parse(response.response)
																		console.log("更新测验", res)
																		this.sumbit_num--
																		if (this.sumbit_num == 0) {
																			tanchu("能完成的测验已全部完成,请手动刷新页面")
																		}

																		//this.sub_exam()

																	},
																	onerror: function(err) {

																		tanchu("查询失败")
																	}
																})

															}
														})
													} else {
														this.sumbit_num--
														if (this.sumbit_num == 0) {
															tanchu("能完成的测验已全部完成,请手动刷新页面")
														}
													}
												}
											})
											clearInterval(this.exam_list[i].clock)
										}

									}, 1000)
								}
							})

						} else {
							tanchu("请勿重复提交")
						}


					},

					load_exam(page = 1) {
						var ask = getJson(window.location.href)
						$.ajax({
							type: "GET",
							url: "http://jx.open.ha.cn/jxpt-web/student/homework/getAllHomeworkByStudent?courseVersionId=" + ask.courseVersionId +
								"&page=" + page,
							success: html => {
								console.log(html.body.list)
								this.total = html.body.totalPages
								this.page = html.body.currentPage
								for (var i = 0; i < html.body.list.length; i++) {
									if (html.body.list[i].type == 4) {
										this.exam_list.push(html.body.list[i])
									}
								}
								if (this.page < this.total) {
									this.load_exam(this.page + 1)
								} else {
									this.up_exam()
									console.log("加载结束")
								}


							}
						})
					},
					bt(text) {
						return "<span class='interaction-status processing'>" + text + "</span>"
					},
					exam_info() {
						var ask = getJson(window.location.href)
						if (this.exam_list.length != 0) {
							var exam = this.exam_list[0]
							var url =
								"https://www.mosoteach.cn/web/index.php?c=interaction_quiz&m=start_quiz_confirm&clazz_course_id=" +
								ask.clazz_course_id + "&id=" + $(exam).attr("data-id") + "&order_item=group"
							$.ajax({
								type: "GET",
								url: url,
								success: html => {
									var label = ""
									var n = 0;
									if (exam.find(".processing").length) {
										if (this.course.join || this.exam_id.indexOf(exam.attr(
												"data-id")) != -1) {
											label += this.bt("提前阅卷")
											n++
										}
										if (this.course.join && html.indexOf(
												'view_answer_time&quot;:&quot;S') != -1 || this.exam_id
											.indexOf(exam.attr("data-id")) != -1) {
											label += this.bt("整卷可搜")
											n++

										} else if (html.indexOf('submit_count_left&quot;:-1') != -1) {
											label += this.bt("选择可搜")
										}

										if (!this.course.join && html.indexOf(
												'view_answer_time&quot;:&quot;S') != -1) {
											label += this.bt("录入可搜")
										}

									} else if (this.exam_id.indexOf(exam.attr("data-id")) != -1) {
										label += this.bt("提前阅卷")
										label += this.bt("整卷可搜")
										n = 2
									}
									exam.find(".interaction-status").after(label)
									if (n == 2) {
										var exam_save = GM_getValue("exam_save") || []
										exam_save.push(exam.attr("data-id"))
										GM_setValue("exam_save", exam_save)
									}
									this.exam_list.shift()
									this.exam_info()
								}
							})
						}

					},
					examlist() {
						var ask = getJson(window.location.href)
						var exam_save = GM_getValue("exam_save") || []

						if (ask.clazz_course_id && ask.c == "interaction" && !this.exam_l) {
							this.exam_l = true
							var url =
								"https://www.mosoteach.cn/web/index.php?c=clazzcourse&m=detail&clazz_course_id=" +
								ask.clazz_course_id
							var exam_list = []
							$(".interaction-row").each((idx, element) => {
								if ($(element).attr("data-type") == "QUIZ") {
									var flag = false
									for (var i = 0; i < exam_save.length; i++) {
										if (exam_save[i] == $(element).attr("data-id")) {
											flag = true
										}
									}
									if (flag) {
										var label = ""
										label += this.bt("提前阅卷")
										label += this.bt("整卷可搜")
										$(element).find(".interaction-status").after(label)
									} else {
										exam_list.push($(element))
									}
								}
							});
							this.exam_list = exam_list
							if (exam_list.length != 0) {
								$.ajax({
									type: "GET",
									url: url,
									success: html => {
										if (html.indexOf("已允许") != -1) {
											this.course.join = true
										}
										var data = {
											action: "exam_list",
											url: window.location.href,
											userId: userId
										}
										GM_xmlhttpRequest({
											method: "POST",
											url: geturl + 'action',
											data: JSON.stringify(data),
											onload: response => {
												var res = JSON.parse(response.response)
												for (var i = 0; i < res.result.exam_list
													.length; i++) {
													this.exam_id.push(res.result.exam_list[
														i].id)
												}
												this.exam_info()
											},
											onerror: function(err) {
												location.reload()
											}
										})
									}
								})
							}
						}
					},

					changeconfig() {
						window.config = this.config
						GM_setValue("config", this.config)
						window.location.href = window.location.href
					},
					changequick() {
						if (this.config.quicksubmit) {
							tanchu("xx")
						}
						this.changeconfig()
					},
					showloading() {
						this.loading = this.$loading({
							lock: true,
							text: 'Loading',
							spinner: 'el-icon-loading',
							background: 'rgba(0, 0, 0, 0.7)'
						});
					},
					hideloading() {
						this.loading.close()
					},
					change_activeName(text) {
						this.activeName = text
					},
					change_question(answer) {
						this.question = answer
					},
					change_usestate(text) {
						this.usestate = text
					},
					start_load() {
						this.usestate = "加载助手中"
						console.log("开始加载")
						var data = {
							action: "reptile",
							content: {},
							current_edition: current_edition
						}
						if ($("#stuId").length != 0) {

							data.userId = $("#stuId").val()
						} else {
							data.userId = GM_getValue("userId", "")
						}
						var ask = getJson(window.location.href)
						if (ask.c != "passport") {
							start({
								url: geturl + "loading",
								data: data
							})
						} else {
							this.usestate = "未登录"
							this.user.level = "未登录"
							GM_setValue("userId", "")
						}
					},
					load() {

					},


					change_examstate(text) {
						this.examstate = text
					},
					start_search() {
						var data = {
							search: this.search,
							action: "search",
							skip: 0,
							max: 20,
							userId: userId
						}
						var loading = this.$loading({
							lock: true,
							text: 'Loading',
							spinner: 'el-icon-loading',
							background: 'rgba(0, 0, 0, 0.7)'
						});
						GM_xmlhttpRequest({
							method: "POST",
							url: geturl + "wxsearch",
							data: JSON.stringify(data),
							onload: response => {
								var res = JSON.parse(response.response)
								if (res.success == false) {
									this.start_search()
									return;
								}
								loading.close()
								this.tanchu(res.result.state)
								if (res.result.question != undefined) {
									this.search_question = res.result.question
								}
								this.start_load()
							},
							onerror: function(err) {
								loading.close()
								tanchu("查询失败")
							}
						})
					},
					set_drawer(drawer) {
						this.drawer = drawer
					},
					loaduser(user) {
						this.user = user
						var notice = GM_getValue("notice") || ""
						if (notice != user.notice) {
							this.tanchu(user.notice)
							GM_setValue("notice", user.notice)
						}
						if (this.user.identity == "学生" || this.user.identity == "其他") {
							this.examlist()
						}
					},
					loading() {
						var url_ = getJson(window.location.href)
						if (give.inner != undefined) {
							this.inner = give.inner
							this.edition = give.edition
							this.usestate = "助手加载成功"
							console.log("加载完成")
							var first_use = GM_getValue("first_use", true)
							if (first_use) {
								this.drawer = true
								this.activeName = "fifth"
								GM_setValue("first_use", false)

							}
						}
					},

					tanchu(text) {
						this.notice = text
						this.dialogVisible = true
						if (text.indexOf("您的CP余额不足") != -1) {
							this.is_no = true
						}

					},
					confirm() {
						if (this.is_no) {
							change_activeName("fourth")
							this.drawer = true
						}
						this.dialogVisible = false
					},
					cancel() {
						this.dialogVisible = false
					},
					buy() {
						window.open(this.user.buyurl);
					},
					card(data) {
						var loading = this.$loading({
							lock: true,
							text: 'Loading',
							spinner: 'el-icon-loading',
							background: 'rgba(0, 0, 0, 0.7)'
						});
						GM_xmlhttpRequest({
							method: "POST",
							url: "https://8cd42328-4ffe-47ef-b284-badb402920e3.bspapp.com/http/card",
							data: JSON.stringify(data),
							onload: response => {
								loading.close()
								var res = JSON.parse(response.response)
								this.tanchu(res.state)
								this.start_load()
							},
							onerror: function(err) {
								loading.close()
								tanchu("查询失败")
							}
						})
					},

					checkcard() {
						var data = {
							action: "check",
							code: this.code,
							userId: userId

						}
						this.card(data)
					},
					used_card() {
						var data = {
							action: "used",
							code: this.code,
							userId: userId
						}
						this.card(data)
					},
					re(html) {
						return html.replace(/-and-/g, "&")
					},
					handleClick(tab, event) {
						if (tab.name == "share") {
							if (!this.room_req_state) {
								this.room_req_state = !this.room_req_state
								this.load_room()
							}
						}
					},
					onSubmit() {
						console.log('submit!');
					},
					handleChange(value) {
						console.log(value);
						window.delay = value
					},
					dateFormat(fmt, date) {
						let ret;
						const opt = {
							"Y+": date.getFullYear().toString(), // 年
							"m+": (date.getMonth() + 1).toString(), // 月
							"d+": date.getDate().toString(), // 日
							"H+": date.getHours().toString(), // 时
							"M+": date.getMinutes().toString(), // 分
							"S+": date.getSeconds().toString() // 秒
							// 有其他格式化字符需求可以继续添加，必须转化成字符串
						};
						for (let k in opt) {
							ret = new RegExp("(" + k + ")").exec(fmt);
							if (ret) {
								fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1]
									.length, "0")))
							};
						};
						return fmt;
					}
				}
			})
		}

	}

})();

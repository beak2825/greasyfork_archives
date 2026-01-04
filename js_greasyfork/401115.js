// ==UserScript==
// @name	腾讯课堂、超星自动签到(新版)
// @description	腾讯课堂、超星自动签到
// @namespace CX&TXKT_auto_sign
// @author	涛之雨
// @version	0.3.8
// @grant	GM_getValue
// @grant	GM_setValue
// @grant	GM_registerMenuCommand
// @grant	GM_addStyle
// @run-at	document-start
// @require	https://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @match	*://ke.qq.com/course/*
// @match	*://ke.qq.com/webcourse*
// @match	*://mobilelearn.chaoxing.com/widget/pcpick/stu/index*
// @match	*://*.chaoxing.com/visit/interaction*
// @match	*://i.mooc.chaoxing.com/*
// @license	GPL-3.0-only
// @icon	https://i.loli.net/2020/03/04/D3h1iWSFeyc8AKG.png
// @home-url	https://greasyfork.org/zh-CN/scripts/401115
// @downloadURL https://update.greasyfork.org/scripts/401115/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E3%80%81%E8%B6%85%E6%98%9F%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%28%E6%96%B0%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/401115/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E3%80%81%E8%B6%85%E6%98%9F%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%28%E6%96%B0%E7%89%88%29.meta.js
// ==/UserScript==

/*
超星的另一个辅助，在这里：
https://greasyfork.org/zh-CN/scripts/403935
*/

/*
 * 更新:
 * V0.3.8
 * 删除无用的插件（fundebug）。。。捕捉到的全都是别人的错误。。。
 * 新增H5toast提醒（设置里可以选择开关）
 * 对部分流程进行更改，使其更加规范
 * V0.3.7
 * 修复接入插件的部分bug，
 * 限制上传数据的内容（均不涉及隐私）
 * 默认开启异常上传，如果不需要上传异常，
 *     请搜索【mydebugger(){】
 *     并在下一行加入【return;】即可
 *
 * V0.3.6
 * 接入fundebug后台，出现异常/报错自动上传并通知我
 *
 * V0.3.5
 * 新增超星的随机刷新（减少浏览器同时请求卡顿）
 * 对于超星签到循环改为动态加载，增加稳定性
 * 修复腾讯课堂网络异常报错的问题（当前为强制刷新）
 * 新增腾讯课堂部分直播时有播放按钮的自动播放
 * 新增对于腾讯课堂报错后自动延时刷新的支持
 * 修改部分逻辑，增加代码的稳定性

 * V0.3.4
 * 修复对于超星界面更新的更新
 * 修复对于超星和腾讯课堂不同界面的适配
 * 新增超星的动画（虽然没啥用）
 * 精简代码，优化部分流程。
 * 修复腾讯课堂连续一开始连续相同回复异常
 * 加入自动回复人工智能（人工智障），智能判断是否相同
 *
 * V0.3.3
 * 超星的界面变了。。。脚本也要跟着改（气哭.gif）
 *
 * V0.3.2
 * 【给腾讯课堂填坑！】增加腾讯课堂自动检测、刷新（js混淆、平坦化（AST），恶心的要吐）
 * 对腾讯课堂播放页面增加判断，录播（回放）不显示脚本，减小系统负担
 * 顺便修复了复读机log显示错误的bug以及仅有一条时特殊显示
 *
 * V0.3.1
 * 修复了严重逻辑bug！请更新！
 *
 * V0.3.0
 * 其实就是0.2.10....
 * 不过不知道为啥不能正常更新。。。刷个版本试试？
 *
 * V0.2.10
 * 修复之前数字显示异常的bug
 * 优化了代码，使其更加规范，执行效率更高，可靠性更强（不是依赖本脚本的原因）
 * 修复复读机的一些bug（已经可以正式使用了）
 * 修复了重定向按钮显示、点击不正常
 *
 * V0.2.9
 * 增加对于部分页内播放器重定向到全屏播放的重定向按钮（暂未考虑自动重定向）
 * （测试功能）回复复读机，指定连续x条回复，自动回复，
 * 增加回复黑名单（防止重复回复）
 * 改善页面的动画，看起来更流畅，更美观
 * 修复对于签到、辅助等连续成功后数字不增加的bug
 * 还有若干。。。想不起来了
 *
 * V0.2.8
 * 辅助作答后播报和log中添加选择的选项
 * 修复了部分注释的历史遗留问题
 *
 * V0.2.7
 * 修复签到结束后不继续监视的bug
 *
 * V0.2.6
 * 修复签到等待时间小于1秒无法语音播报的bug
 *
 * V0.2.5
 * 修复了腾讯课堂监视配置读取错误的bug
 * 修复选择题的点击bug
 * 修复选择题点击后关闭窗口的bug
 * 修复多次调用点击事件的bug
 * 注：尚在测试中，请勿过度依赖本功能（脚本）
 *
 * V0.2.4
 * 修复了选择等待时间错误
 * 修复了TTS发音部分参数错误
 * 修复了插件更新设置后会多个线程同时执行的BUG
 * 如果有懂一点js，会js的朋友如果老师有发起选择题的时候给个样本或是解决方案呗
 * 我们这里都要结束了，都没有老师再发起选择题。。。
 * 此外还更新了啥我忘了。。。
 *
 * V0.2.3
 * 修复：腾讯课堂无法自动选择（好不容易老师发起一次我还错过了）
 * 修复更改设置后许刷新才生效的bug
 * 删除会引起错误的调试代码（对于脚本无影响）
 *
 * V0.2.2
 * 【重大更新】修复严重bug（凌晨两点果然脑子就不好了。。。。）
 * 增加了双击悬浮球回复默认设置
 *
 * V0.2.1
 * 【重大更新】增加插件设置界面，便于管理
 * 【重大更新】增加TTS语音播报功能
 * （默认开启，有需要请到支持的页面配置）
 * 剩余优化时间的显示
 * 优化算法和数据处理，增加插件的稳定性
 *
 * V0.1.2
 * 修复了已知bug（选择题功能尚未测试）
 *
 * V0.1.1
 * 修复了签到子页面无法自动刷新的bug
 *
 * V0.1.0
 * 删掉了我垃圾小站的图标（虽然用广告拦截器一拦截就好了。。。），去掉68行无用代码。。。
 * 把自定义参数放到开头，方便用户进行自定义修改（没有基础请勿修改其他部分！）
 *
 * 腾讯课堂部分：
 * 对签到适配更加精准，不会误点
 * 增加选择题的随机选择功能
 * （未经测试。。。。开启请慎重！）
 * （严重的bug倒不会至于。主要可能不是预期效果）
 *
 * 超星部分：
 * 对课程信息进行重新分组
 * 对签到的流程进行优化
 * 增加签到成功和特殊的签到类型的判断及弹窗提醒，下个版本考虑增加对于微信的对接（太麻烦，懒得，此外本人不看微信。。。。）
 *
 */

//个人小站：https://taozhiyu.gitee.io（虽然啥都没有。。。）
//吾爱主页：https://www.52pojie.cn/home.php?mod=space&uid=879080
//CSDN主页：https://blog.csdn.net/weixin_44352049（虽然也是啥都没有）
//使用说明：https://greasyfork.org/zh-CN/scripts/401115
//吾爱说明：https://www.52pojie.cn/thread-1163575-1-1.html
//CSDN说明：https://blog.csdn.net/weixin_44352049/article/details/106031114
//未做混淆或加密，
//按F12打开console即可看到日志
//懂js可以自行DIY


(function() {
	'use strict';
	let AutoSignConfig = {};
	let DefaultConfig = {
		TTS_IsOpen: true,
		TTS_Volce: 5,
		TTS_Speed: 7,
		CX_IsOpen: true,
		CX_IsRandomWaiting:true,
		CX_WaitingTime: 30,
		CX_MaxWaitingCount: 20,
		TXKT_Repeater_IsOpen: true,
		TXKT_Repeater_WaitingTime: 1000,
		TXKT_Repeater_MaxWaitingCount: 7,
		TXKT_Signing_WaitingTime: 5000,
		TXKT_Ansering_IsOpen: true,
		TXKT_Ansering_IsRandom: true,
		TXKT_Ansering_WaitingTime: -20,
		SYSTEM_ALERT_ISOPEN:true
	};
	var sign_times = 0;
	var answer_times = 0;
	var repeat_times = 0;
	var blacklist = "";
	var TXKTloading = 0;
	Promise.all([GM_getValue("CXAndTXKTConfig")]).then(function(data) {
		if (data[0] !== undefined) {
			try {
				AutoSignConfig = JSON.parse(data[0]);
			} catch (e) {
				AutoSignConfig = data[0];
			}
		} else {
			AutoSignConfig = DefaultConfig;
		}
		for (var key in DefaultConfig) {
			if (typeof(AutoSignConfig[key]) == "undefined") {
				AutoSignConfig[key] = DefaultConfig[key];
			}
		}
		MainFunction();
	}).catch(function(except) {
		console.log("错误！请复制后上报bug。谢谢==>",except);
	});
	window.T2S = function(TXT) {
		if (!AutoSignConfig.TTS_IsOpen) {
			return;
		}
		if (TXT === undefined) {
			TXT = "我有参数呢,播报的内容您还没填呢。填写后才能读出你想要的文字呢，亲！";
		}
		var tmp = document.createElement("div");
		tmp.innerHTML = '<iframe src="data:audio/mpeg;base64,x==" allow="autoplay" style="position:fixed;z-index:-999999999;top:-120px;left:-100px;width:10px;height:10px" autoplay></iframe>';
		tmp.id = "taoSignAudioTEST";
		document.getElementsByTagName("body")[0].append(tmp);
		setTimeout(function() {
			document.getElementById('taoSignAudioTEST').remove();
			tmp = document.getElementById('taoSignAudio');
			if (tmp) {
				tmp.src = "http://tts.baidu.com/text2audio?cuid=baiduid&per=4&vol=" + AutoSignConfig.TTS_Volce + "&pit=6&lan=zh&spd=" + AutoSignConfig.TTS_Speed + "&ctp=1&pdt=311&ie=UTF-8&tex=" + TXT;
			} else {
				tmp = document.createElement("audio");
				tmp.id = 'taoSignAudio';
				tmp.src = "http://tts.baidu.com/text2audio?cuid=baiduid&per=4&vol=" + AutoSignConfig.TTS_Volce + "&pit=6&lan=zh&spd=" + AutoSignConfig.TTS_Speed + "&ctp=1&pdt=311&ie=UTF-8&tex=" + TXT;
				document.getElementsByTagName("body")[0].append(tmp);
			}
			document.getElementById('taoSignAudio').play();
		}, 500);
	};
	GM_registerMenuCommand('我找不到插件设置窗口！告诉我在哪里', function() {
		$("#AutoSignSettingIcon").css("top", 0);
		if(location.href.match(/chaoxing\.com/) !== null){
			$(".wrap1200.clearfix,.headbanner_new,#to_top,.foot").css("filter", "blur(10px)");
		}else{
			$("#preloading,#react-body").css("filter", "blur(10px)");
		}
		setTimeout(function() {
			function tmp() {
				$("#AutoSignSettingIcon").css("top", "-48px");
				if(location.href.match(/chaoxing\.com/) !== null){
					$(".wrap1200.clearfix,.headbanner_new,#to_top,.foot").css("filter", "none");
				}else{
					$("#preloading,#react-body").css("filter", "none");
				}
				$("body").off("mousemove", tmp());
			}
			$("body").on("mousemove", tmp());
		}, 5000);
	});
	function MainFunction() {

		var box=function(t,b,out=6.5){
			if(!AutoSignConfig.SYSTEM_ALERT_ISOPEN){
				console.log("浏览器弹窗已关闭");
				return false;
			}

			if(window.Notification) {
				Notification.requestPermission(function (status) {
					if (status === "granted") {
						var n = new Notification(t, { body: b });
						n.onshow = function () {
							setTimeout(n.close.bind(n), out*1000);
						};
					} else if(Notification.permission === "denied"){
						alert("通知被禁止，请允许通知！\n\n如果不需要toast弹窗，请在设置中关闭弹窗提醒！");
					}else{
						alert("请允许通知！\n\n如果不需要toast弹窗，请在设置中关闭弹窗提醒！");
					}
				});
			}else{
				alert("你的浏览器不支持！，请在设置中关闭弹窗提醒！");
			}
			return true;
		};

		if (location.href.match(/ke.qq.com\/course/)) {
			var url = "";
			$(document).ready(function() {
				var isok=false;
				var Container = document.createElement('a');
				Container.id = "modle302";
				Container.title = '点击重定向';
				Container.innerHTML = '点击重定向';
				Container.style = "background: red;color: white;border: blue double;cursor: pointer;display:none";
				$(".course-title > h3")[0].appendChild(Container);
				$(".js-task-item.task-item").each(
					function(e) {
						$(this).on("click", function() {
							geturl();
							$("#modle302").off("click", clickeve);
							$("#modle302").css("display", "none");
							isok=false;
						});
					});

				function clickeve() {
					location.href = url;
				}
				function geturl(){
					var i=setInterval(function() {
						var ifr = document.querySelector("#js-study-video");
						if (ifr) {
							try {
								var cid = ifr.src.toString().match(/cid=\d+/);
								var tid = ifr.src.toString().match(/term_id=\d+/);
								var taid = ifr.src.toString().match(/taid=\d+/);
								if (cid !== null && tid !== null && taid !== null) {
									url = "https://ke.qq.com/webcourse/index.html#cid=" +
										cid[0].match(/\d+/)[0] +
										"&term_id=" +
										tid[0].match(/\d+/)[0] +
										"&taid=" +
										taid[0].match(/\d+/)[0];
									$("#modle302").css("display", "");
									$("#modle302").on("click", clickeve);
									if(!isok){
										box("加载完成","页面信息加载完成，\n可以点击【重定向】按钮跳转");
										isok=true;
									}
									clearInterval(i);
								}
							} catch (e) {
								console.error("未知错误！\n请复制错误信息提交反馈====>>\n\n", e);
							}
						}
					}, 500);
				}
				geturl();
			});
			return;
		}

		var UPDETE_timeout = 0;

		function URLChoicer(isResting = false) {
			if (!isResting&& top.location == self.location) {
				console.log("%c【语音播报】%c功能已%c%s", "color:red", "color:black", AutoSignConfig.TTS_IsOpen ? "background-color:green;color:white;" : "background-color:red;color:white;", AutoSignConfig.TTS_IsOpen ? "开启" : "关闭");
			}
			if (isResting&&location.href.match(/chaoxing\.com\/space/) !== null) {
				$("#frame_content")[0].contentWindow.location.reload();
				return;
			}
			if (location.href.match(/visit\/interaction/) !== null) {
				if (isResting) {
					window.location.reload();
				} else {
					window.onload = function() {
						cx_sign(true);
					};
				}
			}
			if (location.href.match(/mobilelearn/) !== null) {
				cx_main();
			}
			if (location.href.match(/ke.qq.com/) !== null && top.location == self.location) {
				if (isResting) {
					ke();
				} else {
					window.onload = function() {
						ke();
					};
				}
			}
			return;
		}

		function UpdateSettings() {
			if (UPDETE_timeout) {
				clearTimeout(UPDETE_timeout);
				UPDETE_timeout = 0;
			}
			GM_setValue("CXAndTXKTConfig", JSON.stringify(AutoSignConfig));
			UPDETE_timeout = setTimeout(function() {
				box("设置更新通知","设置更新成功，已重新加载");
				URLChoicer(true);
			}, 3000);
		}

		function updateUI() {
			return "<div id='AutoSignSettingIcon' title='双击清除已有设置'></div>\n" +
				"<div class='TaoMain'>\n" +
				"<div class='TaoTotal'>\n" +
				"<fieldset id='fieldsetAll'>\n" +
				"<legend style='text-align: right;'><a style='color:#188eee;' href='https://greasyfork.org/zh-CN/scripts/401115'>涛之雨制作|前往脚本发布地址</a>\n" +
				"</legend>\n" +
				"<fieldset>\n" +
				"<legend title='百度语音TTS接入,语音和弹窗提醒设置'>  <font class='SettingTitle'>提醒相关设置</font>\n" +
				"</legend>\n" +
				"<ul class='Setting_ul'>\n" +
				"<li class='Setting_Choice'>\n" +
				"<label style='height: 20px;' title='是否开启语音提醒功能(推荐开启)'>开启 TTS\n" +
				"<input id='TTS_IsOpen' type='button' class='Setting_input Setting_btn " + (AutoSignConfig.TTS_IsOpen ? "Setting_On" : "Setting_Off") + "'>\n" +
				"</label>\n" +
				"<label style='height: 20px;' title='是否开启重要消息弹窗功能(推荐开启，需要允许权限)'>开启弹窗\n" +
				"<input id='SYSTEM_ALERT_ISOPEN' type='button' class='Setting_input Setting_btn " + (AutoSignConfig.SYSTEM_ALERT_ISOPEN ? "Setting_On" : "Setting_Off") + "'>\n" +
				"</label>\n" +
				"</li>\n" +
				"</ul>\n" +
				"<div id='TTS_div'>\n" +
				"<ul class='Setting_ul'>\n" +
				"<li>\n" +
				"<label title='范围:[0,9],5为中速'>TTS 语速\n" +
				"<input class='Setting_input' id='TTS_Speed' type='number' max='9' min='0' value='" + AutoSignConfig.TTS_Speed + "'>\n" +
				"</label>\n" +
				"</li>\n" +
				"</ul>\n" +
				"<ul class='Setting_ul'>\n" +
				"<li>\n" +
				"<label title='范围:[0,15],5为中音量'>TTS 音量\n" +
				"<input class='Setting_input' id='TTS_Volce' type='number' max='15' min='0' value='" + AutoSignConfig.TTS_Volce + "'>\n" +
				"</label>\n" +
				"</li>\n" +
				"</ul>\n" +
				"</div>\n" +
				"</fieldset>\n" +
				((location.href.match(/chaoxing\.com/) !== null)?
				 "<fieldset>\n" +
				 "<legend title='超星学习通的相关功能,如自动签到,延时,检测等'><font class='SettingTitle'>超星 设置</font>\n" +
				 "</legend>\n" +
				 "<ul class='Setting_ul'>\n" +
				 "<li class='Setting_Choice'>\n" +
				 "<label title='是否开启自动签到功能(推荐开启)'>自动签到\n" +
				 "<input id='CX_IsOpen' type='button' class='Setting_input Setting_btn " + (AutoSignConfig.CX_IsOpen ? "Setting_On" : "Setting_Off") + "'>\n" +
				 "</label>\n" +
				 "<label title='签到刷新随机延时±5秒(推荐开启，以防同时加载过多的页面导致卡顿)（测试功能）'>随机延时\n" +
				 "<input id='CX_IsRandomWaiting' type='button' class='Setting_input Setting_btn " + (AutoSignConfig.CX_IsRandomWaiting ? "Setting_On" : "Setting_Off") + "'>\n" +
				 "</label>\n" +
				 "</li>\n" +
				 "</ul>\n" +
				 "<div>\n" +
				 "<ul class='Setting_ul'>\n" +
				 "<li>\n" +
				 "<label title='每隔多长时间监视一次'>监视时间\n" +
				 "<input class='Setting_input' id='CX_WaitingTime' type='number' min='1' value='" + AutoSignConfig.CX_WaitingTime + "'>秒</label>\n" +
				 "</li>\n" +
				 "</ul>\n" +
				 "<ul class='Setting_ul'>\n" +
				 "<li>\n" +
				 "<label title='最大检测次数,超过限制停止。值为0则无限制'>最多检测\n" +
				 "<input class='Setting_input' id='CX_MaxWaitingCount' type='number' min='0' value='" + AutoSignConfig.CX_MaxWaitingCount + "'>次</label>\n" +
				 "</li>\n" +
				 "</ul>\n" +
				 "</div>\n" +
				 "</fieldset>\n"+
				 "</fieldset>\n" +
				 "</div>\n" +
				 "</div>"
				 :
				 "<fieldset>\n" +
				 "<legend title='回复复读机设置'>" +
				 /*"<label title='嵌入页面里的录播拉出来（详情可以看脚本主页的介绍）' style='height: 20px;'>重定向\n"+
                "<input id='TXKT_Repeater_IsOpen' type='button' class='Setting_input Setting_btn "+(AutoSignConfig.TXKT_Repeater_IsOpen?"Setting_On":"Setting_Off")+"'>\n"+
                "</label>\n"+*/
				 "<font class='SettingTitle'>腾讯课堂复读机 设置</font>\n" +
				 "</legend>\n" +
				 "<ul class='Setting_ul'>\n" +
				 "<li class='Setting_Choice'>\n" +
				 "<label style='height: 20px;' title='是否开启回复复读机，开启后如果复读完自动加入黑名单，防止重复发送，并且等待10秒后重新开始检测'>回复复读\n" +
				 "<input id='TXKT_Repeater_IsOpen' type='button' class='Setting_input Setting_btn " + (AutoSignConfig.TXKT_Repeater_IsOpen ? "Setting_On" : "Setting_Off") + "'>\n" +
				 "</label>\n" +
				 "</li>\n" +
				 "</ul>\n" +
				 "<div>\n" +
				 "<ul class='Setting_ul'>\n" +
				 "<li>\n" +
				 "<label title='检测相同数据的时间'>检测时间\n" +
				 "<input class='Setting_input' id='TXKT_Repeater_WaitingTime' type='number' value='" + AutoSignConfig.TXKT_Repeater_WaitingTime + "'>毫秒</label>\n" +
				 "</li>\n" +
				 "</ul>\n" +
				 "<ul class='Setting_ul'>\n" +
				 "<li>\n" +
				 "<label title='连续多少句的时候触发复读'>检测数量\n" +
				 "<input class='Setting_input' id='TXKT_Repeater_MaxWaitingCount' type='number' value='" + AutoSignConfig.TXKT_Repeater_MaxWaitingCount + "'>句</label>\n" +
				 "</li>\n" +
				 "</ul>\n" +
				 "</div>\n" +
				 "</fieldset>\n" +
				 "<fieldset>\n" +
				 "<legend class='SettingTitle' title='腾讯课堂自动辅助答题,随机选择,辅助的时机等设置'> <font>腾讯课堂 设置</font>\n" +
				 "</legend>\n" +
				 "<ul class='Setting_ul'>\n" +
				 "<li>\n" +
				 "<label title='签到的监视时间,可以填理论任意数值。（因为不会发生多层同时出现，可以考虑1000毫秒）'>签到监视\n" +
				 "<input id='TXKT_Signing_WaitingTime' class='Setting_input' type='number' min='0' value='" + AutoSignConfig.TXKT_Signing_WaitingTime + "'>毫秒</label>\n" +
				 "</li>\n" +
				 "</ul>\n" +
				 "<div>\n" +
				 "<ul class='Setting_ul'>\n" +
				 "<li class='Setting_Choice'>\n" +
				 "<label title='是否开启辅助作答功能'>辅助作答\n" +
				 "<input type='button' id='TXKT_Ansering_IsOpen' class='Setting_input Setting_btn " + (AutoSignConfig.TXKT_Ansering_IsOpen ? "Setting_On" : "Setting_Off") + "'>\n" +
				 "</label>\n" +
				 "<label title='是否开启随机选择选项功能(如关闭则每次都选择第一个选项)'>随机选择\n" +
				 "<input id='TXKT_Ansering_IsRandom' type='button' class='Setting_input Setting_btn " + (AutoSignConfig.TXKT_Ansering_IsRandom ? "Setting_On" : "Setting_Off") + "'>\n" +
				 "</label>\n" +
				 "</li>\n" +
				 "</ul>\n" +
				 "<ul class='Setting_ul'>\n" +
				 "<li>\n" +
				 "<label title='辅助作答的时间,整数为等待选择时长后作答,负数为倒计时剩余填入时长的时作答'>作答时机\n" +
				 "<input class='Setting_input' id='TXKT_Ansering_WaitingTime' type='number' value='" + AutoSignConfig.TXKT_Ansering_WaitingTime + "'>秒</label>\n" +
				 "</li>\n" +
				 "</ul>\n" +
				 "</div>\n" +
				 "</fieldset>\n" +
				 "</fieldset>\n" +
				 "</div>\n" +
				 "</div>");
		}
		var auto_sign_interval = 0,
			auto_answer_interval = 0;
		var auto_Repeater_timeout = 0,
			T2S_timeout = 0,
			icon_timeout = 0;
		var canhiden = 0,
			canhiden2 = 0;

		function hidensetting() {
			if (icon_timeout) {
				clearTimeout(icon_timeout);
				icon_timeout = 0;
			}
			icon_timeout = setTimeout(function() {
				$(".TaoTotal").css("opacity", 1);
				var fadeout = setInterval(function() {
					if (!canhiden || !canhiden2) {
						clearTimeout(icon_timeout);
						clearInterval(fadeout);
						icon_timeout = 0;
						$(".TaoTotal").css("opacity", 1);
						setTimeout(function() { hidensetting(); }, 1000);
						return;
					}
					$(".TaoTotal").css("opacity", Number($(".TaoTotal").css("opacity")) - 0.01);
					if (Number($(".TaoTotal").css("opacity")) <= 0.1) {
						clearInterval(fadeout);
						$(".TaoTotal").css("opacity", 0);
						$("#AutoSignSettingIcon").css("-webkit-transform", " rotate(0deg)").css("-ms-transform", " rotate(0deg)").css("transform", " rotate(0deg);").css("top", "");
						$(".TaoTotal").css("display", "none");
					}
				}, 10);
			}, 800);
		}

		function createSettingsWindow() {
			if (document.body !== null && document.querySelector("#AutoSignSettingFrame") === null) {
				let Container = document.createElement('div');
				Container.id = "AutoSignSettingFrame";
				Container.innerHTML = updateUI();
				document.body.appendChild(Container);
				$("#AutoSignSettingIcon").on('mouseover', function(e) {
					canhiden = 0;
					$("#AutoSignSettingIcon").css("-webkit-transform", " rotate(180deg)").css("-ms-transform", " rotate(180deg)").css("transform", " rotate(180deg);").css("top", 0);
					setTimeout(function() {
						$(".TaoTotal").css("display", "block");
						var fadein = setInterval(function() {
							$(".TaoTotal").css("opacity", Number($(".TaoTotal").css("opacity")) + 0.01);
							if (Number($(".TaoTotal").css("opacity")) >= 1) {
								clearInterval(fadein);
								$(".TaoTotal").css("opacity", 1);
							}
						}, 10);
					}, 700);
				});
				$("#AutoSignSettingIcon").on('mouseout', function(e) {
					canhiden = 1;
					hidensetting();
				});

				$(".TaoTotal").on('mouseover', function(e) {
					canhiden2 = 0;
					if(location.href.match(/chaoxing\.com/) !== null){
						$(".wrap1200.clearfix,.headbanner_new,#to_top,.foot").css("filter", "blur(10px)");
					}else{
						$("#preloading,#react-body").css("filter", "blur(10px)");
					}
				});
				$(".TaoTotal").on('mouseout', function(e) {
					canhiden2 = 1;
					hidensetting();
					if(location.href.match(/chaoxing\.com/) !== null){
						$(".wrap1200.clearfix,.headbanner_new,#to_top,.foot").css("filter", "none");
					}else{
						$("#preloading,#react-body").css("filter", "none");
					}
				});
				$("#SYSTEM_ALERT_ISOPEN").on('click', function(e) {
					var IsOpen = !!!$(e.target).attr("class").match(/Setting_On/g);
					$(e.target).addClass(!IsOpen ? "Setting_Off" : "Setting_On");
					$(e.target).removeClass(!IsOpen ? "Setting_On" : "Setting_Off");
					AutoSignConfig.SYSTEM_ALERT_ISOPEN = IsOpen;
					UpdateSettings();
				});
				$("#TTS_IsOpen").on('click', function(e) {
					var IsOpen = !!!$(e.target).attr("class").match(/Setting_On/g);
					$(e.target).addClass(!IsOpen ? "Setting_Off" : "Setting_On");
					$(e.target).removeClass(!IsOpen ? "Setting_On" : "Setting_Off");
					AutoSignConfig.TTS_IsOpen = IsOpen;
					UpdateSettings();
					if (T2S_timeout) {
						clearTimeout(T2S_timeout);
					}
					T2S_timeout = setTimeout(function() {
						window.T2STEST();
					}, 1000);
				});
				$("#TTS_Volce").on('input', function(e) {
					var Tmp = Number(e.target.value);
					Tmp = Tmp > 15 ? 15 : Tmp < 0 ? 0 : Tmp;
					AutoSignConfig.TTS_Volce = Tmp;
					$("#TTS_Volce").val(Tmp);
					UpdateSettings();
					if (T2S_timeout) {
						clearTimeout(T2S_timeout);
					}
					T2S_timeout = setTimeout(function() {
						window.T2STEST();
					}, 1000);
				});
				$("#TTS_Speed").on('input', function(e) {
					var Tmp = Number(e.target.value);
					Tmp = Tmp > 9 ? 9 : Tmp < 0 ? 0 : Tmp;
					AutoSignConfig.TTS_Speed = Tmp;
					$("#TTS_Speed").val(Tmp);
					UpdateSettings();
					if (T2S_timeout) {
						clearTimeout(T2S_timeout);
					}
					T2S_timeout = setTimeout(function() {
						window.T2STEST();
					}, 1000);
				});
				if(location.href.match(/chaoxing\.com/) !== null){
					$("#CX_IsOpen").on('click', function(e) {
						var IsOpen = !!!$(e.target).attr("class").match(/Setting_On/g);
						$(e.target).addClass(!IsOpen ? "Setting_Off" : "Setting_On");
						$(e.target).removeClass(!IsOpen ? "Setting_On" : "Setting_Off");
						AutoSignConfig.CX_IsOpen = IsOpen;
						UpdateSettings();
					});
					$("#CX_IsRandomWaiting").on('click', function(e) {
						var IsOpen = !!!$(e.target).attr("class").match(/Setting_On/g);
						if (IsOpen) {
							var boo = confirm('这是一个测试的选项，请谨慎打开开关，\n如果异常请打开console控制台，并把报错的内容反馈到插件的主页（右上角有链接）\n你确定要打开么？');
							//confirm 会返回你选择的选项,然后可以依据选择执行逻辑
							if (!boo) {
								return;
							}
						}
						$(e.target).addClass(!IsOpen ? "Setting_Off" : "Setting_On");
						$(e.target).removeClass(!IsOpen ? "Setting_On" : "Setting_Off");
						AutoSignConfig.CX_IsRandomWaiting = IsOpen;
						UpdateSettings();
					});
					$("#CX_WaitingTime").on('input', function(e) {
						AutoSignConfig.CX_WaitingTime = Number(e.target.value);
						UpdateSettings();
					});
					$("#CX_MaxWaitingCount").on('input', function(e) {
						AutoSignConfig.CX_MaxWaitingCount = Number(e.target.value);
						UpdateSettings();
					});
				}else{
					$("#TXKT_Signing_WaitingTime").on('input', function(e) {
						AutoSignConfig.TXKT_Signing_WaitingTime = Number(e.target.value);
						UpdateSettings();
					});
					$("#TXKT_Ansering_IsRandom").on('click', function(e) {
						var IsOpen = !!!$(e.target).attr("class").match(/Setting_On/g);
						$(e.target).addClass(!IsOpen ? "Setting_Off" : "Setting_On");
						$(e.target).removeClass(!IsOpen ? "Setting_On" : "Setting_Off");
						AutoSignConfig.TXKT_Ansering_IsRandom = IsOpen;
						UpdateSettings();
					});
					$("#TXKT_Ansering_IsOpen").on('click', function(e) {
						var IsOpen = !!!$(e.target).attr("class").match(/Setting_On/g);
						$(e.target).addClass(!IsOpen ? "Setting_Off" : "Setting_On");
						$(e.target).removeClass(!IsOpen ? "Setting_On" : "Setting_Off");
						AutoSignConfig.TXKT_Ansering_IsOpen = IsOpen;
						UpdateSettings();
					});
					$("#TXKT_Ansering_WaitingTime").on('input', function(e) {
						AutoSignConfig.TXKT_Ansering_WaitingTime = Number(e.target.value);
						UpdateSettings();
					});
					$("#TXKT_Repeater_IsOpen").on('click', function(e) {
						var IsOpen = !!!$(e.target).attr("class").match(/Setting_On/g);
						$(e.target).addClass(!IsOpen ? "Setting_Off" : "Setting_On");
						$(e.target).removeClass(!IsOpen ? "Setting_On" : "Setting_Off");
						AutoSignConfig.TXKT_Repeater_IsOpen = IsOpen;
						UpdateSettings();
					});
					$("#TXKT_Repeater_WaitingTime").on('input', function(e) {
						AutoSignConfig.TXKT_Repeater_WaitingTime = Number(e.target.value);
						UpdateSettings();
					});
					$("#TXKT_Repeater_MaxWaitingCount").on('input', function(e) {
						AutoSignConfig.TXKT_Repeater_MaxWaitingCount = Number(e.target.value);
						UpdateSettings();
					});
				}
				$("#AutoSignSettingIcon").on('dblclick', function(e) {
					if (window.confirm('你确定要删除已有设置吗？')) {
						AutoSignConfig = DefaultConfig;
						UpdateSettings();
						box("设置清理","清除成功！即刻生效");
						createSettingsWindow();
						return true;
					} else {
						return false;
					}
				});
			} else {
				document.getElementById("AutoSignSettingFrame").innerHTML = updateUI();
			}
		}
		if (top.location == self.location) {
			$(document).ready(function() {
				GM_addStyle(`
#preloading, #react-body,.headbanner_new,.wrap1200.clearfix,#to_top,.foot{
-webkit-transition:.7s filter;
-o-transition:.7s filter;
-moz-transition:.7s filter;
transition:.7s filter;
}
.TaoMain{
color:aliceblue;
}
#AutoSignSettingIcon {
position: fixed;
left: 50%;
top: -48px;
margin-left: -132px;
z-index: 99999999999;
background-size: 100% 100%;
-webkit-box-sizing: border-box;
box-sizing: border-box;
-webkit-transition: 0.7s;
-webkit-transition-delay: 0.2s;
-o-transition: 0.7s;
-o-transition-delay: 0.2s;
transition: 0.7s;
transition-delay: 0.2s;
padding: 0;
cursor: pointer;
width: 60px;
height: 60px;
border: 4px solid #00bdff96;
border-radius: 50%;
background: url('https://i.loli.net/2020/05/07/6xDftH98IO15MoF.png') no-repeat center center;
-webkit-transform: rotate(0deg);
-ms-transform: rotate(0deg);
transform: rotate(0deg);
}
.Setting_ul {
margin: 5px;
}
.Setting_btn {
border-radius: 50%;
width: 20px;
height: 20px;
border: none;
}
.Setting_On {
background-color: green;
}
.Setting_Off {
background-color: red;
}
.TaoMain{
z-index: 9999999999;
position: fixed;
top: 65px;
left: 50%;
}
.TaoTotal {
-webkit-box-sizing: border-box;
box-sizing: border-box;
min-width:264px;
opacity:0;
margin-left: -132px;
display:none;
border-radius: 3px;
border: 1px solid #A0A0A0;
-webkit-box-shadow: -2px 2px 5px rgba(0,0,0,0.3);
box-shadow: -2px 2px 5px rgba(0,0,0,0.3);
background:rgba(0,0,0,0.8);
width: -webkit-fit-content;
width: -moz-fit-content;
width: fit-content;
padding: 15px;
overflow-y:hidden ;
}
.TaoTotal>fieldset {
margin: auto;
display: -webkit-box;
display: -ms-flexbox;
display: flex;
-webkit-box-orient: vertical;
-webkit-box-direction: normal;
justify-content: space-around;
-ms-flex-direction: column;
flex-direction: column;
-ms-flex-pack: distribute;
items-align: center;
margin: auto;
}
.SettingTitle {
font-size: 15px;
-webkit-transition: 0.5s;
-o-transition: 0.5s;
transition: 0.5s;
}
#fieldsetAll>fieldset:hover>div {
-o-transition: height 0.5s;
transition: height 0.5s;
-webkit-transition: height 0.5s;
height: 55px;
}
#fieldsetAll{
max-height: 403px;
overflow-y:hidden ;
}
fieldset{
padding: .35em .625em .75em;
border: 1px solid silver;
}
#fieldsetAll>fieldset>div {
-o-transition: height 0.5s;
-o-transition-delay: 0.5s;
transition: height 0.5s;
transition-delay: 0.5s;
-webkit-transition: height 0.5s;
-webkit-transition-delay: 0.5s;
height: 0;
overflow: hidden;
}
.SettingTitle:hover {
color: red;
font-size: 18px;
cursor: help;
-webkit-transition: 0.7s;
-webkit-transition-duration: 0.7s;
-o-transition: 0.7s;
-o-transition-duration: 0.7s;
transition: 0.7s;
transition-duration: 0.7s;
}
.Setting_Choice>label {
margin: auto;
}
input.Setting_input {
text-align: center;
-moz-text-align-last: center;
text-align-last: center;
margin: 0 2px;
vertical-align: middle;
}
input.Setting_input[type="number"] {
width: 70px;
color:blue;
}
#fieldsetAll>fieldset {
margin: 5px;
}
hr.MyScript {
margin: 0 auto;
border: groove;
}
#react-body{
transition: .2s filter;
filter:none;
}
#AutoSignSettingFrame{
font-size: 14px;
line-height: 1.5;
font-family: system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Droid Sans,Helvetica Neue,Microsoft YaHei UI,Microsoft YaHei,Hiragino Sans GB,Source Han Sans CN,Fira Sans,arial,sans-serif;
}
`);
				createSettingsWindow();
			});
		}

		function b64en(str) {
			return btoa(encodeURIComponent(str));
		}

		function b64de(str) {
			return decodeURIComponent(atob(str));
		}
		window.T2STEST = function() {
			window.T2S("这里是语音测试，如果声音大小，或是语速不合适请修改参数。Power By 涛之雨");
		};

		$(document).ready(function() {
			URLChoicer(false);
		});

		function ke() {
			if ($(".ke_loading").length!==0) {
				console.log("等待加载完成");
				setTimeout(function() {
					ke();
				}, 2000);
				return;
			}

			if ($(".im-dialog-bd-msg").length!==0) {
				console.log("错误！\n" + $(".im-dialog-bd-msg").text());
				TXKTloading = 0;
				window.location.reload();
				return;
			}
			if (location.href.match(/vid=\d+/) !== null) {
				console.log("录播");
				return;
			}

			function auto_sign(timeout = 5000) {
				if (auto_sign_interval) {
					clearInterval(auto_sign_interval);
				}
				auto_sign_interval = setInterval(function() {
					try {
						if($(".tip").length!==0){
							if ($(".tip")[0].innerText.match(/签到/)) {
								if ($(".btn-group")[0] !== undefined) {
									if (auto_sign_interval) {
										clearInterval(auto_sign_interval);
									}
									$(".btn-group")[0].children[0].click();
									setTimeout(function() {
										$(".btn-group")[0].children[0].click();
										sign_times++;
										window.T2S("自动签到插件，签到成功！本节课累积已为您签到，" + String(sign_times) + "次。");
										box("签到成功！","自动签到插件，签到成功！\n本节课累积已为您签到，" + String(sign_times) + "次。",60);
										console.log("%c【腾讯课堂自动签到插件】%c\n于 %s %c签到成功！\n本节课累积已为您签到%c" + String(sign_times) + "次%c！", "color:white;background-color:blue;font-size:20px", "color:red;font-size:20px", (new Date().toLocaleTimeString()), "color:black", "color:red;font-size:20px", "color:black");
										auto_sign(Number(AutoSignConfig.TXKT_Signing_WaitingTime));
									}, 500);
								}
							}
						}
					} catch (e) {
					}
				}, timeout);
			}

			function auto_Answer(timeout = 1000) {
				var isAnswering = false;
				var isfristtime = true;
				var tx_timeout, timeout_min, timeout_sec, timeout_all, tmp_timeout = 0,
					checkout_times = 0;
				var isbackingtime = AutoSignConfig.TXKT_Ansering_WaitingTime < 0 ? true : false;
				if (AutoSignConfig.TXKT_Ansering_WaitingTime === 0) {
					return;
				}
				var timeout_def = Math.abs(AutoSignConfig.TXKT_Ansering_WaitingTime);
				var getrandomchoice = function(totalnumber = 2) {
					return Math.floor((Math.random() * totalnumber) + 1) - 1;
				};
				var answering = function(israndom = true) {
					console.log("开始答题");
					var anser_type = $(".head-text")[0].innerHTML;
					var mychoice = AutoSignConfig.TXKT_Ansering_IsRandom ? getrandomchoice($(".s-f-rc-item").length) : 0;
					console.info("anser_type:" + anser_type);
					$(".s-f-rc-item")[mychoice].click(); //选择
					document.querySelector("#react-body > div.examcard-dialog > div.im-dialog-wrap > div > div.btn-group > span").click(); //提交
					setTimeout(function() {
						document.querySelector("#react-body > div.examcard-dialog > div.im-dialog-wrap > div > div.dialog-head.drag-handler > i").click(); //关闭窗口
						answer_times++;
						window.T2S("辅助答题插件，答题成功！本次选择为：" + ["A", "B", "C", "D", "E"][mychoice] + "。本节课累积已为您辅助，" + String(answer_times) + "次。");
						box("辅助答题成功！","辅助答题插件，答题成功！\n本次选择为：" + ["A", "B", "C", "D", "E"][mychoice] + "。\n本节课累积已为您辅助，" + String(answer_times) + "次。");
						console.log("%c【腾讯课堂自动签到插件】%c\n%s %c辅助答题成功！\n本次选择为：" + ["A", "B", "C", "D", "E"][mychoice] + "。\n本节课累积已为您答题%c" + String(answer_times) + "次%c！", "color:white;background-color:blue;font-size:20px", "color:red;font-size:20px", (new Date().toLocaleTimeString()), "color:black", "color:red;font-size:20px", "color:black");
						isAnswering = false;
					}, 200);
				};
				if (auto_answer_interval) {
					clearInterval(auto_answer_interval);
				}
				auto_answer_interval = setInterval(function() {
					try {
						if ($(".head-text").length) { //单选题、多选题、（未知）
							if ($(".head-text")[0].innerHTML.match(/选题/)) {
								if (isfristtime) {
									isfristtime = false;
									window.T2S("检测到答题窗口，正在密切监视中。。。");
									console.log("检测到答题窗口，正在密切监视中。。。");
								}
								tx_timeout = $(".xq_num")[0].innerHTML;
								timeout_min = Number(tx_timeout.match(/\d{2}/g)[0]);
								timeout_sec = Number(tx_timeout.match(/\d{2}/g)[1]);
								timeout_all = timeout_min * 60 + timeout_sec - 1; //当前答题的剩余时间
								console.log("答题辅助：==%s==\n" + timeout_all, (new Date().toLocaleTimeString()));
								if (!isAnswering) {
									if ($(".drag-handler").length != "0") { //存在答题窗口
										if (isbackingtime) {
											checkout_times = timeout_all;
											if (checkout_times <= timeout_def) {
												console.log("时间到！开始执行辅助作答\n随机选择：%c%s", (AutoSignConfig.TXKT_Ansering_IsRandom ? "color:green" : "color:red"), (AutoSignConfig.TXKT_Ansering_IsRandom ? "开" : "关"));
												answering(AutoSignConfig.TXKT_Ansering_IsRandom);
												isAnswering = true;
											} else {
												console.log("监视中，剩余等待时间：%c%s%c秒", "color:red", Math.abs(timeout_def - checkout_times), "color:black");
											}
										} else {
											if (checkout_times >= timeout_def) {
												console.log("时间到！开始执行辅助作答\n随机选择：%c%s", (AutoSignConfig.TXKT_Ansering_IsRandom ? "color:green" : "color:red"), (AutoSignConfig.TXKT_Ansering_IsRandom ? "开" : "关"));
												answering(AutoSignConfig.TXKT_Ansering_IsRandom);
												isAnswering = true;
											} else {
												checkout_times++;
												console.log("监视中，剩余等待时间：%c%s%c秒", "color:red", Math.abs(timeout_def - checkout_times), "color:black");
											}
										}
									}
								}
							}
						} else {
							checkout_times = 0; //没有签到窗口
							isfristtime = true;
						}
					} catch (e) {
						checkout_times = 0; //未知错误吧。。。。
						isfristtime = true;
						console.error("未知错误！\n请复制错误信息提交反馈====>>\n\n", e);
					}
				}, timeout);
			}

			function auto_Repeater(waitetime = 1000, maxtimes = 7) {
				if (auto_Repeater_timeout) {
					clearTimeout(auto_Repeater_timeout);
					auto_Repeater_timeout = 0;
				}
				function AIreplace(str=""){
					return str.replace(/（|）| |、|。|，"/g, function(matchStr) {
						var tokenMap = {
							"（": "(",
							"）": ")",
							" ": "",
							"、": "",
							"。": ".",
							"，": ",",
						};
						return tokenMap[matchStr];
					});
				}
				var arr = document.querySelectorAll(".js-chat-item-msg-content span");
				var i = 0;
				var arrlength = arr.length - 1;
				var wordnow="";
				if (arrlength + 1 >= maxtimes) {
					try {
						while (i<arrlength&&AIreplace(arr[arrlength - i].innerHTML.trim()) === AIreplace(arr[arrlength - 1 - i].innerHTML.toString().trim())) {
							if (AIreplace(arr[arrlength - i].innerHTML.toString().trim()) == AIreplace(blacklist)) {
								i = -2;
								break;
							}
							i++;
						}
						wordnow=arr[arrlength].innerHTML.toString().trim();
						if (i + 1 >= maxtimes) {
							console.log("有效重复：" + (i + 1) + "次\n有效词：“" +wordnow+ "”");
							if (!document.querySelector('div.ql-blank')) {
								document.querySelector('.ql-editor').innerHTML = "";
							}
							var a = setInterval(function() {
								try {
									document.querySelector('div.ql-blank').firstElementChild.innerHTML = wordnow;
									clearInterval(a);
									setTimeout(function() {
										document.querySelector('button.text-editor-btn').click();
										repeat_times++;
										console.log("%c【腾讯课堂·复读机】%c\n于 %s %c复读成功！\n本节课累积已为您复读%c" + String(repeat_times) + "次%c！\n本次复读内容：%c" + wordnow,
													"color:white;background-color:blue;font-size:20px", "color:red;font-size:20px", (new Date().toLocaleTimeString()), "color:black", "color:red;font-size:20px", "color:black", "color:red;font-size:20px");
									}, 1000);
								} catch (e) {
								}
							}, 1);
							blacklist = wordnow;
							i = -3;
						}
					} catch (e) {
						console.error("未知错误！\n请复制错误信息提交反馈====>>\n\n", e);
					}
				} else {
					i = -1;
				}
				console.log("复读机检测，检测状态：正常，\n" +
							(i === -1 ? "评论不足" + String(maxtimes) + "条，当前条数：" + String(arrlength + 1)+"\n等待10秒":
							 i === -2 ? "黑名单词组“" + blacklist + "”\n等待10秒" :
							 i === -3 ? "复读成功！，当前词组：“" + wordnow + "”\n等待10秒" :
							 i === 0 ? "无重复，当前词组：“" + wordnow + "”" :
							 "重复条数：" + String(i + 1) + "，当前词组：“" + wordnow + "”"
							)
						   );
				if(i===-3){
					box("回复复读机","复读成功！，当前词组：“" + wordnow + "”" );
				}
				if (i === -1 || i === -2 || i === -3) {
					auto_Repeater_timeout = setTimeout(function() {
						auto_Repeater(Number(AutoSignConfig.TXKT_Repeater_WaitingTime), Number(AutoSignConfig.TXKT_Repeater_MaxWaitingCount));
					}, 10000);
				} else {
					auto_Repeater_timeout = setTimeout(function() {
						auto_Repeater(Number(AutoSignConfig.TXKT_Repeater_WaitingTime), Number(AutoSignConfig.TXKT_Repeater_MaxWaitingCount));
					}, waitetime);
				}
			}
			function reloading() {
				if (self.fetch) {
					try {
						var cid = location.href.match(/cid=\d+/)[0].match(/\d+/)[0];
						var tid = location.href.match(/term_id=\d+/)[0].match(/\d+/)[0];
						fetch("https://ke.qq.com/cgi-bin/pubAccount/getLiveInfo?course_id=" + cid + "&term_id=" + tid, { method: 'GET' })
							.then(function(response) { return response.json(); }).then(function(j) {
							switch (j.result.offline_status) {
								case 1:
									console.log('直播中！立即刷新');
									box("直播状态更新！","直播中！即将刷新！");
									window.location.reload();
									break;
								case 2:
									console.log('直播结束（有可能是未开课），继续监视');
									setTimeout(reloading, 10000);
									break;
								case 3:
									console.log('直播状态错误，刷新试试？（其实没啥用）');
									window.location.reload();
									break;
								case 4:
									console.log('老师网挂了？就继续监视呗');
									setTimeout(reloading, 10000);
									break;
							}
						}).catch(function(err){
							console.log("网络请求错误！",err);
							console.log("5秒后刷新");
							setTimeout(function() { window.location.reload(); }, 5000);
						});
					} catch (e) {
						console.error("错误！（有可能是链接不对叭）错误信息==>" + e);
						setTimeout(function() { window.location.reload(); }, 10000);
					}
				} else {
					setTimeout(function() { window.location.reload(); }, 10000);
				}
				return;
			}
			if ($(".ke_overlay")===null||$(".ke_overlay").length === 0) {
				if($(".video-mask.video-play-btn")!==null){
					$(".video-mask.video-play-btn").click();
				}
				console.group("[%c腾讯课堂插件%c开启情况]", "color:red;", "color:black;");
				if (AutoSignConfig.TXKT_Signing_WaitingTime) {
					console.log("%c【腾讯课堂·自动签到】%c功能已%c开启", "color:red", "color:black", "background-color:green;color:white;");
					setTimeout(function() { auto_sign(Number(AutoSignConfig.TXKT_Signing_WaitingTime)); }, 1);
				} else {
					console.log("%c【腾讯课堂·自动签到】%c功能已%c关闭", "color:red", "color:black", "background-color:red;color:white;");
				}
				if (AutoSignConfig.TXKT_Ansering_IsOpen) {
					console.log("%c【腾讯课堂·辅助作答】%c功能已%c开启", "color:red", "color:black", "background-color:green;color:white;");
					setTimeout(function() { auto_Answer(); }, 1);
				} else {
					console.log("%c【腾讯课堂·辅助作答】%c功能已%c关闭", "color:red", "color:black", "background-color:red;color:white;");
				}
				if (AutoSignConfig.TXKT_Repeater_IsOpen) {
					console.log("%c【腾讯课堂·自动复读】%c功能已%c开启", "color:red", "color:black", "background-color:green;color:white;");
					setTimeout(function() { auto_Repeater(Number(AutoSignConfig.TXKT_Repeater_WaitingTime), Number(AutoSignConfig.TXKT_Repeater_MaxWaitingCount)); }, 1);
				} else {
					console.log("%c【腾讯课堂·自动复读】%c功能已%c关闭", "color:red", "color:black", "background-color:red;color:white;");
				}
				console.groupEnd("[腾讯课堂插件开启情况]");
				box("腾讯课堂插件加载成功！",
					"【自动签到】·"+(AutoSignConfig.TXKT_Signing_WaitingTime?"开启":"关闭")
					+"\n【辅助作答】·"+(AutoSignConfig.TXKT_Ansering_IsOpen?"开启":"关闭")
					+"\n【自动复读】·"+(AutoSignConfig.TXKT_Repeater_IsOpen?"开启":"关闭"));
			} else {
				if (TXKTloading >= 10) {
					box("直播检测开启","未检测到直播消息，\n开始检测直播服务器状态！");
					setTimeout(reloading, 10000);
					return;
				} else {
					TXKTloading++;
					setTimeout(function() {
						URLChoicer(true);
					}, 100);
					return;
				}
			}
		}

		function cx_sign(isReload=true) {
			if (AutoSignConfig.CX_IsOpen) {
				console.log("%c【超星·主页签到】%c功能已%c开启", "color:red", "color:black", "background-color:green;color:white;");
			} else {
				console.log("%c【超星·主页签到】%c功能已%c关闭", "color:red", "color:black", "background-color:red;color:white;");
				return;
			}
			var getwaittingtime = function(time1,time2) {
				return Math.floor((Math.random() * (time2-time1)) + time1) - 1;
			};
			var wait4time= Number(AutoSignConfig.CX_WaitingTime);
			var wait_format = (parseInt(wait4time / 60) ? (parseInt(wait4time / 60) + "分钟") : "") +
				(parseInt(wait4time % 60) ? parseInt(wait4time % 60) + "秒" : "");
			console.group("$$课程信息$$（点我收起/展开）");
			console.log("一共有%c" + $(".courseItem.curFile").length + "%c门课程:", "color:blue", "color:black");
			window.T2S("签到插件开启，一共有" + $(".courseItem.curFile").length + "门课程。中心监视时长，" + wait_format +( AutoSignConfig.CX_IsRandomWaiting?",允许":"不允许")+"随机正负5秒范围内偏移。");
			box("超星签到脚本开启成功","一共有" + $(".courseItem.curFile").length + "门课程。\n中心监视时长，"
				+ wait_format+"\n" +( AutoSignConfig.CX_IsRandomWaiting?",允许":"不允许")+"随机正负5秒范围内偏移。");
			var echo_number=0;
			if(isReload){
				$(".courseItem.curFile").each(function(inumber,obj) {
					setTimeout(function() {
						inumber+=1;
						var coursename = obj.children[3].children[0].children[0].innerText;
						var courseID = obj.children[0].value;
						var classID=obj.children[1].value;
						console.log("No\t%s:\n专业:%c%s\n%ccourseID:%c" + courseID + "\n%cclassID为：%c" + classID,inumber, "color:red", coursename, "color:black", "color:red", "color:black", "color:red");
						var sign_url = "http://mobilelearn.chaoxing.com/widget/pcpick/stu/index?courseId=" + courseID + "&coursename=" + b64en(coursename) + "&jclassId=" + classID;
						var tmp = document.createElement("iframe");
						tmp.id = 'loginframe_' + courseID;
						tmp.src = sign_url;
						tmp.style = "display:none;width: 0px;height: 0px;position: fixed;left: 0px;bottom: 0px;z-index: -99;";
						$("body")[0].append(tmp);
						echo_number=inumber;
					},10);
				});
			}
			var mytInterval=setInterval(function() {
				if(echo_number==$(".courseItem.curFile").length){
					console.groupEnd("$$课程信息$$（点我收起/展开）");
					clearInterval(mytInterval);
				}
			},10);
		}

		function cx_main() {
			if (!AutoSignConfig.CX_IsOpen) { //关闭主页自动签到
				return;
			}
			var getwaittingtime = function(time1,time2) {
				return Math.floor((Math.random() * (time2-time1)) + time1) - 1;
			};
			var wait4time=0;
			if(!AutoSignConfig.CX_IsRandomWaiting){
				wait4time= Number(AutoSignConfig.CX_WaitingTime);
			}else{
				wait4time= Number(AutoSignConfig.CX_WaitingTime);
				wait4time=getwaittingtime(wait4time-5,wait4time+5);
			}
			if(wait4time<=1){
				wait4time=5;
			}
			var wait_format = (parseInt(wait4time / 60) ? (String(parseInt(wait4time / 60)) + "分钟") : "") +
				(String(parseInt(wait4time % 60)) ? String(parseInt(wait4time % 60)) + "秒" : "");
			wait4time*=1000;
			var coursename = "";
			try {
				coursename = location.href.match(/coursename=[A-Za-z0-9/\+=]+/g)[0].substring(11);
			} catch (e) {
			}
			var waitingTimes = location.href.match(/tao_auto_refresh_time=\d+/g),
				MAX_waittingTimes = Number(AutoSignConfig.CX_MaxWaitingCount);
			waitingTimes = Number((waitingTimes === null) ? 0 : waitingTimes[0].match(/\d+/g)[0]);
			waitingTimes++;
			try {
				if ($(".qdhover").length !== 0) {
					var getmsg = $(".qdhover").parent().parent().parent()[0].getAttributeNode("onclick").nodeValue.match(/\d+/g);
					if (getmsg[1] == 2) { //普通签到
						var activeId = getmsg[0];
						var courseId = $("#courseId").val();
						var classId = $("#classId").val();
						var fid = $("#fid").val();
						var url = "/widget/sign/pcStuSignController/signIn?activeId=" + activeId + "&classId=" + classId + "&coursename=" + coursename + "&fid=" + fid + "&courseId=" + courseId;
						var tmp = document.createElement("iframe");
						tmp.id = 'loginframe';
						tmp.src = url;
						tmp.style = "display:none;width: 0px;height: 0px;position: fixed;left: 0px;bottom: 0px;z-index: -99;";
						$("body")[0].append(tmp);
						$("#loginframe").load(function() {
							if (window.frames[0].$("title")[0].text.match("成功") !== "") {
								if (top.location == self.location) {
									window.T2S("当前课程，签到成功");
									box("超星签到！","当前课程，签到成功");
									console.log("%c【当前课程】签到成功!", "color:white;font-size:30px;background-color:green");
									$(".qdhover").parent().parent().parent().children().children()[1].innerHTML += "<font style='color:white;font-size:30px;background-color:green;line-height: 30px;'> 签到成功！</font>";
									$(this).remove();
								} else {
									window.T2S(b64de(coursename) + "，签到成功");
									console.log("%c【%s】签到成功!", "color:white;font-size:30px;background-color:green", b64de(coursename));
								}
							} else {
								if(!box("超星签到！","未知错误！请手动签到！")){
									alert("未知错误！请手动签到！");
								}
								window.T2S("未知错误！请手动签到！");
							}
						});
					} else { //不支持
						if(!box("警告！签到模式不支持！","【" + top.location == self.location ? "当前课程" : b64de(coursename) + "】\n出现非支持签到模式！请手动签到！！！",60)){
							alert("【" + top.location == self.location ? "当前课程" : b64de(coursename) + "】出现非支持签到模式！请手动签到！！！");
						}
						window.T2S(top.location == self.location ? "当前课程" : b64de(coursename) + ",出现非支持签到模式！请手动签到！！！");
					}
				} else {
					if (MAX_waittingTimes && waitingTimes >= MAX_waittingTimes) {
						window.T2S(top.location == self.location ? "当前课程" : b64de(coursename) + "已达尝试上限" + String(MAX_waittingTimes) + "次，已停止");
						console.log("%c【%s】%c已达尝试上限%s次，已停止", "color:red", top.location == self.location ? "当前课程" : b64de(coursename), "color:black", String(MAX_waittingTimes));
						return;
					} else {
						console.log("%c【%s】%c第" + String(waitingTimes) + "次尝试，\n暂无签到任务，%s后自动再次尝试", "color:red", (top.location == self.location ? "当前课程" : b64de(coursename)), "color:black", wait_format);
						setTimeout(function() {
							window.location.href = location.href.indexOf("tao_auto_refresh_time") > -1 ? (location.href.replace(new RegExp("tao_auto_refresh_time=\\d+", 'g'), "tao_auto_refresh_time=" + waitingTimes)) : (location.href + (location.href.indexOf("?") > -1 ? "&" : "?") + "tao_auto_refresh_time=" + waitingTimes);
						}, wait4time);
					}
				}
			} catch (e) {
				console.log(e);
			}
		}
	}
})();

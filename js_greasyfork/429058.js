// ==UserScript==
// @name         京东燃动夏季脚本
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  京东燃动夏季脚本，自动做任务
// @author       小赤佬
// @match        https://wbbny.m.jd.com/babelDiy/Zeus/2rtpffK8wqNyPBH6wyUDuBKoAbCt/index.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429058/%E4%BA%AC%E4%B8%9C%E7%87%83%E5%8A%A8%E5%A4%8F%E5%AD%A3%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/429058/%E4%BA%AC%E4%B8%9C%E7%87%83%E5%8A%A8%E5%A4%8F%E5%AD%A3%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
(function() {
	if (fetch) {
		var html =
			`<h1 style="font-weight:700;color:red;text-align: center;">京东燃动夏季操作助手</h1>
		<h3 style="text-align: center;">作者:小赤佬</h3>
		<div style="display: flex;flex-direction: row;justify-content: center;">
			<a href="tencent://message/?uin=83802712&Menu=yes" target="_blank" title="发起QQ聊天"><img
					src="https://pub.idqqimg.com/wpa/images/counseling_style_52.png" alt="QQ"
					style="margin:0px;"></a>&nbsp;&nbsp;
			<a target="_blank" href="https://jq.qq.com/?_wv=1027&k=TdNX4f50"><img border="0"
					src="//pub.idqqimg.com/wpa/images/group.png" alt="精选好物分享A6" title="精选好物分享A6"></a>
		</div>
		<h3 style="text-align: center;">账号信息</h3>
		<div style="border: 1px solid #000;margin: 10px 0;padding: 5px;margin: 5px;position: relative;">
			<div style="text-align:center" class="checkDiv">
				<a type="button" class="layui-btn layui-btn-primary layui-border-orange">正在检测是否登录...</a>
				<p>
				<a type="button" class="layui-btn layui-btn-primary layui-border-green"
					href="https://passport.jd.com/new/login.aspx?ReturnUrl=https%3A%2F%2Fwbbny.m.jd.com%2FbabelDiy%2FZeus%2F2rtpffK8wqNyPBH6wyUDuBKoAbCt%2Findex.html"
					target="_blank">不检测了,直接去登录</a>
					</p>
			</div>
			<div style="text-align:center;display:none" class="nologinDiv">
				<a type="button" class="layui-btn layui-btn-primary layui-border-green"
					href="https://passport.jd.com/new/login.aspx?ReturnUrl=https%3A%2F%2Fwbbny.m.jd.com%2FbabelDiy%2FZeus%2F2rtpffK8wqNyPBH6wyUDuBKoAbCt%2Findex.html"
					target="_blank">未登录,点我去登录</a>
				<p><a type="button" class="layui-btn layui-btn-primary layui-border-blue btn_check">重新检测</a></p>
			</div>
			<div style="text-align:center;display:none" class="userInfoDiv">
				<img class="layui-circle userIconSpan">
				<p><span class="layui-badge-rim">当前账号</span>
					<span class="layui-badge layui-bg-green userNameSpan"></span>
				</p>
				<p><span class="layui-badge-rim">京享值</span>
					<span class="layui-badge layui-bg-blue userJxzSpan"></span>
				</p>
				<p><a type="button" class="layui-btn layui-btn-primary layui-border-blue" href="https://passport.jd.com/new/login.aspx?ReturnUrl=https%3A%2F%2Fwbbny.m.jd.com%2FbabelDiy%2FZeus%2F2rtpffK8wqNyPBH6wyUDuBKoAbCt%2Findex.html">切换账号</a></p>
			</div>
		</div>
		<h3 style="text-align: center;">脚本区域</h3>
		<div style="border: 1px solid #000;margin: 10px 0;padding: 5px;margin: 5px;position: relative;">
			<fieldset class="layui-elem-field layui-field-title" style="margin-top: 20px;">
				<legend>表单</legend>
			</fieldset>
			<form class="layui-form joyformByxcl">
				<div class="btndiv1 hide">
					<h3>点击下方按钮执行任务</h3>
					      
					<div style="text-align: center;">
						<button style="width: 80%;border-radius: 20px;height: 40px;color: white;background-color: deepskyblue"
							type="button" class="execute_byxcl">执行任务</button>
					</div>
				</div>
			</form>
		</div>

		<h3 style="text-align: center;">日志区域</h3>
		<div class="rizhi layui-row">
			<div class="layui-col-md12 layui-col-xs12">
				<div class="layui-card">
					<div class="layui-card-header">操作日志</div>
					<div class="layui-card-body otherRzDiv" style="height:500px;max-height:500px;overflow-y: scroll;">
						<p>初始化成功</p>
					</div>
				</div>
			</div>
		</div>

								`;

		var headHtml =
			`<meta charset="utf-8">
								<title>京东燃动夏季操作助手</title>
								<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,minimal-ui">
								<link href="https://www.layuicdn.com/layui-v2.6.4/css/layui.css" rel="stylesheet">
								`;
		document.all[0].style = '';
		document.body.innerHTML = html;
		document.body.style = '';
		document.body.style.overflow = "scroll";
		document.body.style.backgroundColor = "#ffffff";
		document.head.innerHTML = headHtml;
		document.head.style = '';


		let util = new JDBEAN('123456');
		let nologinDiv = document.querySelector('.nologinDiv');
		let checkDiv = document.querySelector('.checkDiv');
		let userInfoDiv = document.querySelector('.userInfoDiv');
		let userNameSpan = document.querySelector('.userNameSpan');
		let userIconSpan = document.querySelector('.userIconSpan');
		let userJxzSpan = document.querySelector('.userJxzSpan');
		let otherRzDiv = document.querySelector('.otherRzDiv');
		let userJdNumSpan = document.querySelector('.userJdNumSpan');

		util.otherRzDiv = otherRzDiv;
		util.userJdNumSpan = userJdNumSpan;
		document.querySelector('.execute_byxcl').addEventListener('click', () => {
			let joyformByxcl = document.querySelector('.joyformByxcl');
			let formData = new FormData(joyformByxcl);
			util.formData = formData;
			util.init(); //初始化
			util.main();
			alert("操作成功，请查看控制台输出日志");
		});

		document.querySelector('.btn_check').addEventListener('click', () => {
			initView();
		});

		async function initView() {
			let loginData = await util.getUserInfo();
			if (JSON.stringify(loginData) !== '{}' && JSON.stringify(loginData) !== 'null({})') {
				userIconSpan.src = loginData.imgUrl;
				if (loginData.userScoreVO) {
					userJxzSpan.innerText = loginData.userScoreVO.totalScore;
				} else {
					userJxzSpan.innerText = '未知';
				}
				userNameSpan.innerText = loginData.nickName;
				nologinDiv.style.display = 'none';
				checkDiv.style.display = 'none';
				userInfoDiv.style.display = 'block';
			} else {
				nologinDiv.style.display = 'block';
				checkDiv.style.display = 'none';
				userInfoDiv.style.display = 'none';
			}
		}

		initView();
	}
	console.group('%c京东燃动夏季操作助手', 'color:#009a61; font-size: 36px; font-weight: 400');
	console.group('%c作者信息', 'color:blue; font-size: 36px; font-weight: 250');
	console.log('%c本插件仅供学习交流使用\n作者:小赤佬ByQQ83802712 \n联系作者 tencent://message/?uin=83802712&Menu=yes',
		'color:#009a61');
	console.log('%c京豆助手APP下载地址:https://redguy.lanzoui.com/b06ghzvde', 'color:#008861');
	console.log('%c小赤佬の京东苏宁神价屋：196759996\n禁言群，发京东苏宁漏洞单\nhttps://jq.qq.com/?_wv=1027&k=e4BbtCZH', 'color:#009a61');


	function JDBEAN(exportCk) {
		this.rootUrl = "https://api.m.jd.com/";
		this.isLogDetail = false;
		this.curPageObj = null;
		this.log = function(...text) {
			console.log(...text);
			if (this.otherRzDiv) {
				let p = document.createElement('p');
				p.innerHTML = text;
				this.otherRzDiv.append(p);
			}
		}
		this.get = function(options, callback) {
			try {
				let resp = null;
				if (fetch) {
					fetch(options['url'], {
						method: "GET",
						credentials: options['credentials'] == undefined ? "include" : options[
							'credentials'],
						mode: options['mode'] == undefined ? "cors" : options[
							'mode'],
						headers: options['headers']
					}).then(function(response) {
						resp = response;
						return response.text();
					}).then((res) => {
						callback(null, resp, res);
					}).catch((e) => {
						this.log(e);
					});
				} else if (uni != undefined) {
					uni.$u.get(options['url'], options['body'], options['headers']).then(res => {
						callback(null, resp, JSON.stringify(res));
					}).catch((e) => {
						this.log(e);
					});
				}
			} catch (e) {
				this.log(e);
			}
		}
		this.post = function(options, callback) {
			let resp = null;
			if (fetch) {
				fetch(options['url'], {
					method: "post",
					mode: "cors",
					credentials: "include",
					headers: options['headers'],
					body: options['body']
				}).then(function(response) {
					resp = response;
					return response.json();
				}).then((res) => {
					callback(null, resp, JSON.stringify(res));
				}).catch((e) => {
					this.log(e);
				});
			} else if (uni != undefined) {
				uni.$u.post(options['url'], options['body'], options['headers']).then(res => {
					callback(null, resp, JSON.stringify(res));
				}).catch((e) => {
					this.log(e);
				});;
			}
		}
		this.cookie = exportCk == undefined ? '' : exportCk;
		this.outTime = 0;
		this.wait = function(t) {
			return new Promise(e => setTimeout(e, t));
		}
		this.main = async function() {
			const notify = $.isNode() ? require('./sendNotify') : '';
			//Node.js用户请在jdCookie.js处填写京东ck;
			const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
			const ShHelpFlag = false;//是否SH助力  true 助力，false 不助力
			const ShHelpAuthorFlag = false;//是否助力作者SH  true 助力，false 不助力
			let summer_movement_joinjoinjoinhui = false;//是否入会  true 入会，false 不入会
			if ($.isNode() && process.env.summer_movement_joinjoinjoinhui) {
			  summer_movement_joinjoinjoinhui = process.env.summer_movement_joinjoinjoinhui;
			}
			
			let summer_movement_ShHelpFlag = 1;// 0不开启也不助力 1开启并助力 2开启但不助力
			if ($.isNode() && process.env.summer_movement_ShHelpFlag) {
			  summer_movement_ShHelpFlag = process.env.summer_movement_ShHelpFlag;
			}
			//IOS等用户直接用NobyDa的jd cookie
			let cookiesArr = ['xcl6666'];
			$.cookie = '';
			$.inviteList = [];
			$.secretpInfo = {};
			$.ShInviteList = [];
			$.innerShInviteList = [
			];
			$.appid = 'o2_act';
			const UA = $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : "JD4iPhone/9.3.5 CFNetwork/1209 Darwin/20.2.0") : ($.getdata('JDUA') ? $.getdata('JDUA') : "JD4iPhone/9.3.5 CFNetwork/1209 Darwin/20.2.0")
			
			
			!(async () => {
			  if (!cookiesArr[0]) {
			    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
			    return;
			  }
			  that.log('活动入口：京东APP-》 首页-》 右边小窗口（点我赢千元）\n' +
			      '店铺任务 已添加\n' +
			      '新增 入会环境变量 默认不入会\n' +
			      '活动时间：2021-07-08至2021-08-08\n' +
			      '脚本更新时间：2021年7月9日 9点00分\n'
			      );
			      if(`${summer_movement_joinjoinjoinhui}` === "true") that.log('您设置了入会')
			
			      // that.log('\n\n该脚本启用了[正道的光]模式\n执行 做任务、做店铺任务、助力 会有几率不执行\n本脚本不让任务一次全部做完\n您可以多跑几次\n北京时间18时后是正常模式\n\n🐸\n')
			  for (let i = 0; i < cookiesArr.length; i++) {
			    if (cookiesArr[i]) {
			      $.cookie = cookiesArr[i];
			      $.UserName = decodeURIComponent($.cookie.match(/pt_pin=([^; ]+)(?=;?)/) && $.cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
			      $.index = i + 1;
			      $.isLogin = true;
			      $.nickName = $.UserName;
			      $.hotFlag = false; //是否火爆
			      that.log(`\n*****开始【京东账号${$.index}】${$.nickName || $.UserName}*****\n`);
			      that.log(`\n如有未完成的任务，请多执行几次\n`);
			      await movement()
			      if($.hotFlag)$.secretpInfo[$.UserName] = false;//火爆账号不执行助力
			    }
			  }
			
			})()
			  .catch((e) => {
			    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
			  })
			  .finally(() => {
			    $.done();
			  })
			
			
			async function movement() {
			  try {
			    $.signSingle = {};
			    $.homeData = {};
			    $.secretp = ``;
			    $.taskList = [];
			    $.shopSign = ``;
			    $.userInfo = ''
			    await takePostRequest('olympicgames_home');
			    if($.homeData.result) $.userInfo = $.homeData.result.userActBaseInfo
			    if($.userInfo){
			      // that.log(JSON.stringify($.homeData.result.trainingInfo))
			      that.log(`\n签到${$.homeData.result.continuedSignDays}天 待兑换金额：${Number($.userInfo.poolMoney)} 当前等级:${$.userInfo.medalLevel}  ${$.userInfo.poolCurrency}/${$.userInfo.exchangeThreshold}(攒卡领${Number($.userInfo.cash)}元)\n`);
			      await $.wait(1000);
			      if($.userInfo && typeof $.userInfo.sex == 'undefined'){
			        await takePostRequest('olympicgames_tiroGuide');
			        await $.wait(1000);
			      }
			      $.userInfo = $.homeData.result.userActBaseInfo;
			      if (Number($.userInfo.poolCurrency) >= Number($.userInfo.exchangeThreshold)) {
			        that.log(`满足升级条件，去升级`);
			        await takePostRequest('olympicgames_receiveCash');
			        await $.wait(1000);
			      }
			      bubbleInfos = $.homeData.result.bubbleInfos;
			      for(let item of bubbleInfos){
			        if(item.type != 7){
			          $.collectId = item.type
			          await takePostRequest('olympicgames_collectCurrency');
			          await $.wait(1000);
			        }
			      }
			    }
			
			    if(aabbiill()){
			      that.log('\n运动\n')
			      $.speedTraining = true;
			      await takePostRequest('olympicgames_startTraining');
			      await $.wait(1000);
			      for(let i=0;i<=3;i++){
			        if($.speedTraining){
			          await takePostRequest('olympicgames_speedTraining');
			          await $.wait(1000);
			        }else{
			          break;
			        }
			      }
			    }
			    
			    that.log(`\n做任务\n`);
			    await takePostRequest('olympicgames_getTaskDetail');
			    await $.wait(1000);
			    //做任务
			    for (let i = 0; i < $.taskList.length && !$.hotFlag; i++) {
			      $.oneTask = $.taskList[i];
			      if(!aabbiill()) continue;
			      if ([1, 3, 5, 7, 9, 21, 26].includes($.oneTask.taskType) && $.oneTask.status === 1) {
			        $.activityInfoList = $.oneTask.shoppingActivityVos || $.oneTask.brandMemberVos || $.oneTask.followShopVo || $.oneTask.browseShopVo;
			        for (let j = 0; j < $.activityInfoList.length; j++) {
			          $.oneActivityInfo = $.activityInfoList[j];
			          if ($.oneActivityInfo.status !== 1 || !$.oneActivityInfo.taskToken) {
			            continue;
			          }
			          $.callbackInfo = {};
			          that.log(`做任务：${$.oneActivityInfo.title || $.oneActivityInfo.taskName || $.oneActivityInfo.shopName};等待完成`);
			          if ($.oneTask.taskType === 21 && `${summer_movement_joinjoinjoinhui}` === "true"){
			            let channel = $.oneActivityInfo.memberUrl.match(/channel=(\d+)/) ? $.oneActivityInfo.memberUrl.match(/channel=(\d+)/)[1] : '';
			            const jiarubody = {
			              venderId: $.oneActivityInfo.vendorIds,
			              shopId: $.oneActivityInfo.ext.shopId,
			              bindByVerifyCodeFlag: 1,
			              registerExtend: {},
			              writeChildFlag: 0,
			              channel: channel
			            }
			            let url = `https://api.m.jd.com/client.action?appid=jd_shop_member&functionId=bindWithVender&body=${encodeURIComponent(JSON.stringify(jiarubody))}&client=H5&clientVersion=9.2.0&uuid=88888`
			            await joinjoinjoinhui(url,$.oneActivityInfo.memberUrl)
			            await $.wait(1000);
			          }
			          await takePostRequest('olympicgames_doTaskDetail');
			          if ($.callbackInfo.code === 0 && $.callbackInfo.data && $.callbackInfo.data.result && $.callbackInfo.data.result.taskToken) {
			            await $.wait(getRndInteger(7000, 8000));
			            let sendInfo = encodeURIComponent(`{"dataSource":"newshortAward","method":"getTaskAward","reqParams":"{\\"taskToken\\":\\"${$.callbackInfo.data.result.taskToken}\\"}","sdkVersion":"1.0.0","clientLanguage":"zh"}`)
			            await callbackResult(sendInfo)
			          } else if ($.oneTask.taskType === 5 || $.oneTask.taskType === 3 || $.oneTask.taskType === 26) {
			            await $.wait(getRndInteger(7000, 1500));
			            that.log(`任务完成`);
			          } else if ($.oneTask.taskType === 21) {
			            let data = $.callbackInfo
			            if(data.data && data.data.bizCode === 0){
			              that.log(`获得：${data.data.result.score}`);
			            }else if(data.data && data.data.bizMsg){
			              that.log(data.data.bizMsg);
			            }else{
			            that.log(JSON.stringify($.callbackInfo));
			            }
			            await $.wait(getRndInteger(500, 1000));
			          } else {
			            that.log($.callbackInfo);
			            that.log(`任务失败`);
			            await $.wait(getRndInteger(2000, 3000));
			          }
			        }
			      } else if ($.oneTask.taskType === 2 && $.oneTask.status === 1 && $.oneTask.scoreRuleVos[0].scoreRuleType === 2){
			        that.log(`做任务：${$.oneTask.taskName};等待完成 (实际不会添加到购物车)`);
			        $.taskId = $.oneTask.taskId;
			        $.feedDetailInfo = {};
			        await takePostRequest('olympicgames_getFeedDetail');
			        let productList = $.feedDetailInfo.productInfoVos;
			        let needTime = Number($.feedDetailInfo.maxTimes) - Number($.feedDetailInfo.times);
			        for (let j = 0; j < productList.length && needTime > 0; j++) {
			          if(productList[j].status !== 1){
			            continue;
			          }
			          $.taskToken = productList[j].taskToken;
			          that.log(`加购：${productList[j].skuName}`);
			          await takePostRequest('add_car');
			          await $.wait(getRndInteger(700, 1500));
			          needTime --;
			        }
			      }else if ($.oneTask.taskType === 2 && $.oneTask.status === 1 && $.oneTask.scoreRuleVos[0].scoreRuleType === 0){
			        $.activityInfoList = $.oneTask.productInfoVos ;
			        for (let j = 0; j < $.activityInfoList.length; j++) {
			          $.oneActivityInfo = $.activityInfoList[j];
			          if ($.oneActivityInfo.status !== 1 || !$.oneActivityInfo.taskToken) {
			            continue;
			          }
			          $.callbackInfo = {};
			          that.log(`做任务：浏览${$.oneActivityInfo.skuName};等待完成`);
			          await takePostRequest('olympicgames_doTaskDetail');
			          if ($.oneTask.taskType === 2) {
			            await $.wait(getRndInteger(1000, 2000));
			            that.log(`任务完成`);
			          } else {
			            that.log($.callbackInfo);
			            that.log(`任务失败`);
			            await $.wait(getRndInteger(2000, 3000));
			          }
			        }
			      }
			    }
			    // 店铺
			    that.log(`\n去做店铺任务\n`);
			    $.shopInfoList = [];
			    await takePostRequest('qryCompositeMaterials');
			    for (let i = 0; i < $.shopInfoList.length; i++) {
			      let taskbool = false
			      if(!aabbiill()) continue;
			      $.shopSign = $.shopInfoList[i].extension.shopId;
			      that.log(`执行第${i+1}个店铺任务：${$.shopInfoList[i].name} ID:${$.shopSign}`);
			      $.shopResult = {};
			      await takePostRequest('olympicgames_shopLotteryInfo');
			      await $.wait(1000);
			      if(JSON.stringify($.shopResult) === `{}`) continue;
			      $.shopTask = $.shopResult.taskVos || [];
			      for (let i = 0; i < $.shopTask.length; i++) {
			        $.oneTask = $.shopTask[i];
			        if($.oneTask.taskType === 21 || $.oneTask.taskType === 14 || $.oneTask.status !== 1){continue;}  //不做入会//不做邀请
			        taskbool = true
			        $.activityInfoList = $.oneTask.brandMemberVos || $.oneTask.followShopVo || $.oneTask.shoppingActivityVos || $.oneTask.browseShopVo || $.oneTask.simpleRecordInfoVo;
			        if($.oneTask.taskType === 12){//签到
			          $.oneActivityInfo =  $.activityInfoList;
			          that.log(`店铺签到`);
			          await takePostRequest('olympicgames_bdDoTask');
			          continue;
			        }
			        for (let j = 0; j < $.activityInfoList.length; j++) {
			          $.oneActivityInfo = $.activityInfoList[j];
			          if ($.oneActivityInfo.status !== 1 || !$.oneActivityInfo.taskToken) {
			            continue;
			          }
			          $.callbackInfo = {};
			          that.log(`做任务：${$.oneActivityInfo.subtitle || $.oneActivityInfo.title || $.oneActivityInfo.taskName || $.oneActivityInfo.shopName};等待完成`);
			          await takePostRequest('olympicgames_doTaskDetail');
			          if ($.callbackInfo.code === 0 && $.callbackInfo.data && $.callbackInfo.data.result && $.callbackInfo.data.result.taskToken) {
			            await $.wait(8000);
			            let sendInfo = encodeURIComponent(`{"dataSource":"newshortAward","method":"getTaskAward","reqParams":"{\\"taskToken\\":\\"${$.callbackInfo.data.result.taskToken}\\"}","sdkVersion":"1.0.0","clientLanguage":"zh"}`)
			            await callbackResult(sendInfo)
			          } else  {
			            await $.wait(2000);
			            that.log(`任务完成`);
			          }
			        }
			      }
			      if(taskbool) await $.wait(1000);
			      let boxLotteryNum = $.shopResult.boxLotteryNum;
			      for (let j = 0; j < boxLotteryNum; j++) {
			        that.log(`开始第${j+1}次拆盒`)
			        //抽奖
			        await takePostRequest('olympicgames_boxShopLottery');
			        await $.wait(3000);
			      }
			      // let wishLotteryNum = $.shopResult.wishLotteryNum;
			      // for (let j = 0; j < wishLotteryNum; j++) {
			      //   that.log(`开始第${j+1}次能量抽奖`)
			      //   //抽奖
			      //   await takePostRequest('zoo_wishShopLottery');
			      //   await $.wait(3000);
			      // }
			      if(taskbool) await $.wait(3000);
			    }
			
			  } catch (e) {
			    $.logErr(e)
			  }
			}
			
			async function takePostRequest(type) {
			  let body = ``;
			  let myRequest = ``;
			  switch (type) {
			    case 'olympicgames_home':
			      body = `functionId=olympicgames_home&body={}&client=wh5&clientVersion=1.0.0&appid=${$.appid}`;
			      myRequest = await getPostRequest(`olympicgames_home`, body);
			      break;
			    case 'olympicgames_collectCurrency':
			      body = await getPostBody(type);
			      myRequest = await getPostRequest(`olympicgames_collectCurrency`, body);
			      break
			    case 'olympicgames_receiveCash':
			      let id = 6
			      if ($.Shend) id = 4
			      body = `functionId=olympicgames_receiveCash&body={"type":${id}}&client=wh5&clientVersion=1.0.0&appid=${$.appid}`;
			      myRequest = await getPostRequest(`olympicgames_receiveCash`, body);
			      break
			    case 'olypicgames_guradHome':
			      body = `functionId=olypicgames_guradHome&body={}&client=wh5&clientVersion=1.0.0&appid=${$.appid}`;
			      myRequest = await getPostRequest(`olypicgames_guradHome`, body);
			      break
			    case 'olympicgames_getTaskDetail':
			      body = `functionId=${type}&body={"taskId":"","appSign":"1"}&client=wh5&clientVersion=1.0.0&appid=${$.appid}`;
			      myRequest = await getPostRequest(`olympicgames_getTaskDetail`, body);
			      break;
			    case 'olympicgames_doTaskDetail':
			      body = await getPostBody(type);
			      myRequest = await getPostRequest(`olympicgames_doTaskDetail`, body);
			      break;
			    case 'olympicgames_getFeedDetail':
			      body = `functionId=olympicgames_getFeedDetail&body={"taskId":"${$.taskId}"}&client=wh5&clientVersion=1.0.0&appid=${$.appid}`;
			      myRequest = await getPostRequest(`olympicgames_getFeedDetail`, body);
			      break;
			    case 'add_car':
			      body = await getPostBody(type);
			      myRequest = await getPostRequest(`olympicgames_doTaskDetail`, body);
			      break;
			    case 'shHelp':
			    case 'help':
			      body = await getPostBody(type);
			      myRequest = await getPostRequest(`zoo_collectScore`, body);
			      break;
			    case 'olympicgames_startTraining':
			      body = await getPostBody(type);
			      myRequest = await getPostRequest(`olympicgames_startTraining`, body);
			      break;
			    case 'olympicgames_speedTraining':
			      body = await getPostBody(type);
			      myRequest = await getPostRequest(`olympicgames_speedTraining`, body);
			      break;
			    case 'olympicgames_tiroGuide':
			      let sex = getRndInteger(0, 2)
			      let sportsGoal = getRndInteger(1, 4)
			      body = `functionId=olympicgames_tiroGuide&body={"sex":${sex},"sportsGoal":${sportsGoal}}&client=wh5&clientVersion=1.0.0&appid=${$.appid}`;
			      myRequest = await getPostRequest(`olympicgames_tiroGuide`, body);
			      break;
			    case 'olympicgames_shopLotteryInfo':
			      body = `functionId=olympicgames_shopLotteryInfo&body={"channelSign":"1","shopSign":${$.shopSign}}&client=wh5&clientVersion=1.0.0&appid=${$.appid}`;
			      myRequest = await getPostRequest(`olympicgames_shopLotteryInfo`, body);
			      break;
			    case 'qryCompositeMaterials':
			      body = `functionId=qryCompositeMaterials&body={"qryParam":"[{\\"type\\":\\"advertGroup\\",\\"id\\":\\"05371960\\",\\"mapTo\\":\\"logoData\\"}]","openid":-1,"applyKey":"big_promotion"}&client=wh5&clientVersion=1.0.0`;
			      myRequest = await getPostRequest(`qryCompositeMaterials`, body);
			      break;
			    case 'olympicgames_bdDoTask':
			      body = await getPostBody(type);
			      myRequest = await getPostRequest(`olympicgames_bdDoTask`, body);
			      break;
			    case 'olympicgames_boxShopLottery':
			      body = `functionId=olympicgames_boxShopLottery&body={"shopSign":${$.shopSign}}&client=wh5&clientVersion=1.0.0&appid=${$.appid}`;
			      myRequest = await getPostRequest(`olympicgames_boxShopLottery`,body);
			      break;
			    default:
			      that.log(`错误${type}`);
			  }
			  if (myRequest) {
			    return new Promise(async resolve => {
			      $.post(myRequest, (err, resp, data) => {
			        try {
			          // that.log(data);
			          dealReturn(type, data);
			        } catch (e) {
			          $.logErr(e, resp)
			        } finally {
			          resolve();
			        }
			      })
			    })
			  }
			}
			
			
			async function dealReturn(type, res) {
			  try {
			    data = JSON.parse(res);
			  } catch (e) {
			    that.log(`返回异常：${res}`);
			    return;
			  }
			  switch (type) {
			    case 'olympicgames_home':
			    if (data.code === 0 && data.data && data.data.result) {
			        if (data.data['bizCode'] === 0) {
			          $.homeData = data.data;
			          $.secretpInfo[$.UserName] = true
			        }
			      } else if (data.data && data.data.bizMsg) {
			        that.log(data.data.bizMsg);
			      } else {
			        that.log(res);
			      }
			      break;
			    case 'olympicgames_collectCurrency':
			      if (data.code === 0 && data.data && data.data.result) {
			        that.log(`收取成功，当前卡币：${data.data.result.poolCurrency}`);
			      } else if (data.data && data.data.bizMsg) {
			        that.log(data.data.bizMsg);
			      } else {
			        that.log(res);
			      }
			      if (data.code === 0 && data.data && data.data.bizCode === -1002) {
			        $.hotFlag = true;
			        that.log(`该账户脚本执行任务火爆，暂停执行任务，请手动做任务或者等待解决脚本火爆问题`)
			      }
			      break;
			    case 'olympicgames_receiveCash':
			      if (data.code === 0 && data.data && data.data.result) {
			        if (data.data.result.couponVO) {
			          that.log('升级成功')
			          let res = data.data.result.couponVO
			          that.log(`获得[${res.couponName}]优惠券：${res.usageThreshold} 优惠：${res.quota} 时间：${res.useTimeRange}`);
			        }else if(data.data.result.userActBaseVO){
			          that.log('结算结果')
			          let res = data.data.result.userActBaseVO
			          that.log(`当前金额：${res.totalMoney}\n${JSON.stringify(res)}`);
			        }
			      } else if (data.data && data.data.bizMsg) {
			        that.log(data.data.bizMsg);
			      } else {
			        that.log(res);
			      }
			      break;
			    case 'olympicgames_getTaskDetail':
			      if (data.data && data.data.bizCode === 0) {
			        that.log(`互助码：${data.data.result && data.data.result.inviteId || '助力已满，获取助力码失败'}\n`);
			        if (data.data.result && data.data.result.inviteId) {
			          $.inviteList.push({
			            'ues': $.UserName,
			            // 'secretp': $.secretp,
			            'inviteId': data.data.result.inviteId,
			            'max': false
			          });
			        }
			        $.taskList = data.data.result && data.data.result.taskVos || [];
			      } else if (data.data && data.data.bizMsg) {
			        that.log(data.data.bizMsg);
			      } else {
			        that.log(res);
			      }
			      break;
			    case 'olypicgames_guradHome':
			      if (data.data && data.data.bizCode === 0) {
			        that.log(`SH互助码：${data.data.result && data.data.result.inviteId || '助力已满，获取助力码失败\n'}`);
			        if (data.data.result && data.data.result.inviteId) {
			          if (data.data.result.inviteId) $.ShInviteList.push(data.data.result.inviteId);
			          that.log(`守护金额：${Number(data.data.result.activityLeftAmount || 0)} 护盾剩余：${timeFn(Number(data.data.result.guardLeftSeconds || 0) * 1000)} 离结束剩：${timeFn(Number(data.data.result.activityLeftSeconds || 0) * 1000)}`)
			          if(data.data.result.activityLeftSeconds == 0) $.Shend = true
			        }
			        $.taskList = data.data.result && data.data.result.taskVos || [];
			      } else if (data.data && data.data.bizMsg) {
			        that.log(data.data.bizMsg);
			      } else {
			        that.log(res);
			      }
			      break;
			    case 'olympicgames_doTaskDetail':
			      $.callbackInfo = data;
			      break;
			    case 'olympicgames_getFeedDetail':
			      if (data.code === 0) {
			        $.feedDetailInfo = data.data.result.addProductVos[0] || [];
			      }
			      break;
			    case 'add_car':
			      if (data.code === 0) {
			        let acquiredScore = data.data.result.acquiredScore;
			        if (Number(acquiredScore) > 0) {
			          that.log(`加购成功,获得金币:${acquiredScore}`);
			        } else {
			          that.log(`加购成功`);
			        }
			      } else {
			        that.log(res);
			        that.log(`加购失败`);
			      }
			      break
			    case 'shHelp':
			    case 'help':
			      if (data.data && data.data.bizCode === 0) {
			        let cash = ''
			        if (data.data.result.hongBaoVO && data.data.result.hongBaoVO.withdrawCash) cash = `，并获得${Number(data.data.result.hongBaoVO.withdrawCash)}红包`
			        that.log(`助力成功${cash}`);
			      } else if (data.data && data.data.bizMsg) {
			        if (data.data.bizMsg.indexOf('今天用完所有') > -1) {
			          $.canHelp = false;
			        }
			        that.log(data.data.bizMsg);
			      } else {
			        that.log(res);
			      }
			      break;
			    case 'olympicgames_speedTraining':
			      if (data.data && data.data.bizCode === 0 && data.data.result) {
			        let res = data.data.result
			        that.log(`获得[${res.couponName}]优惠券：${res.usageThreshold} 优惠：${res.quota} 时间：${res.useTimeRange}`);
			      } else if (data.data && data.data.bizMsg) {
			        if (data.data.bizMsg.indexOf('不在运动中') > -1) {
			          $.speedTraining = false;
			        }
			        that.log(data.data.bizMsg);
			      } else {
			        that.log(res);
			      }
			      break;
			    case 'olympicgames_startTraining':
			      if (data.data && data.data.bizCode === 0 && data.data.result) {
			        let res = data.data.result
			        that.log(`倒计时${res.countdown}s ${res.currencyPerSec}卡币/s`);
			      } else if (data.data && data.data.bizMsg) {
			        if (data.data.bizMsg.indexOf('运动量已经够啦') > -1) {
			          $.speedTraining = false;
			        }
			        that.log(data.data.bizMsg);
			      } else {
			        that.log(res);
			      }
			      break;
			    case 'olympicgames_tiroGuide':
			      that.log(res);
			      break;
			    case 'olympicgames_shopLotteryInfo':
			      if (data.code === 0) {
			        $.shopResult = data.data.result;
			      }
			      break;
			    case 'qryCompositeMaterials':
			      //that.log(data);
			      if (data.code === '0') {
			        $.shopInfoList = data.data.logoData.list;
			        that.log(`获取到${$.shopInfoList.length}个店铺`);
			      }
			      break
			    case 'olympicgames_bdDoTask':
			      if(data.data && data.data.bizCode === 0){
			        that.log(`签到获得：${data.data.result.score}`);
			      }else if(data.data && data.data.bizMsg){
			        that.log(data.data.bizMsg);
			      }else{
			        that.log(data);
			      }
			      break;
			    case 'olympicgames_boxShopLottery':
			      if(data.data && data.data.result){
			        let result = data.data.result;
			        switch (result.awardType) {
			          case 8:
			            that.log(`获得金币：${result.rewardScore}`);
			            break;
			          case 5:
			            that.log(`获得：adidas能量`);
			            break;
			          case 2:
			          case 3:
			            that.log(`获得优惠券：${result.couponInfo.usageThreshold} 优惠：${result.couponInfo.quota}，${result.couponInfo.useRange}`);
			            break;
			          default:
			            that.log(`抽奖获得未知`);
			            that.log(JSON.stringify(data));
			        }
			      } else if (data.data && data.data.bizMsg) {
			        that.log(data.data.bizMsg);
			      } else {
			        that.log(res);
			      }
			      break
			    default:
			      that.log(`未判断的异常${type}`);
			  }
			}
			
			async function getPostBody(type) {
			  return new Promise(async resolve => {
			    let taskBody = '';
			    try {
			      const log = await getBody()
			      if (type === 'help' || type === 'shHelp') {
			        taskBody = `functionId=olympicgames_assist&body=${JSON.stringify({"inviteId":$.inviteId,"type": "confirm","ss" :log})}&client=wh5&clientVersion=1.0.0&appid=${$.appid}`
			      } else if (type === 'olympicgames_collectCurrency') {
			        taskBody = `functionId=olympicgames_collectCurrency&body=${JSON.stringify({"type":$.collectId,"ss" : log})}&client=wh5&clientVersion=1.0.0&appid=${$.appid}`;
			      } else if (type === 'olympicgames_startTraining' || type === 'olympicgames_speedTraining') {
			        taskBody = `functionId=${type}&body=${JSON.stringify({"ss" : log})}&client=wh5&clientVersion=1.0.0&appid=${$.appid}`;
			      } else if(type === 'add_car'){
			        taskBody = `functionId=olympicgames_doTaskDetail&body=${JSON.stringify({"taskId": $.taskId,"taskToken":$.taskToken,"ss" : log})}&client=wh5&clientVersion=1.0.0&appid=${$.appid}`
			      }else{
			        let actionType = 0
			        if([1, 3, 5, 6, 8, 9, 14, 22, 23, 24, 25, 26].includes($.oneTask.taskId)) actionType = 1
			        taskBody = `functionId=${type}&body=${JSON.stringify({"taskId": $.oneTask.taskId,"taskToken" : $.oneActivityInfo.taskToken,"ss" : log,"shopSign":$.shopSign,"actionType":actionType,"showErrorToast":false})}&client=wh5&clientVersion=1.0.0&appid=${$.appid}`
			      }
			    } catch (e) {
			      $.logErr(e)
			    } finally {
			      resolve(taskBody);
			    }
			  })
			}
			
			async function getPostRequest(type, body) {
			  let url = `https://api.m.jd.com/client.action?advId=${type}`;
			  const method = `POST`;
			  const headers = {
			    "Accept": "application/json",
			    "Accept-Encoding": "gzip, deflate, br",
			    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
			    "Connection": "keep-alive",
			    "Content-Type": "application/x-www-form-urlencoded",
			    'Cookie': $.cookie,
			    "Origin": "https://wbbny.m.jd.com",
			    "Referer": "https://wbbny.m.jd.com/",
			    "User-Agent": "jdapp;iPhone;9.2.0;14.1;",
			
			  };
			  return {url: url, method: method, headers: headers, body: body};
			}
			
			
			//领取奖励
			function callbackResult(info) {
			  return new Promise((resolve) => {
			    let url = {
			      url: `https://api.m.jd.com/?functionId=qryViewkitCallbackResult&client=wh5&clientVersion=1.0.0&body=${info}&_timestamp=` + Date.now(),
			      headers: {
			        'Origin': `https://bunearth.m.jd.com`,
			        'Cookie': $.cookie,
			        'Connection': `keep-alive`,
			        'Accept': `*/*`,
			        'Host': `api.m.jd.com`,
			        'User-Agent': "jdapp;iPhone;10.0.2;14.3;8a0d1837f803a12eb217fcf5e1f8769cbb3f898d;network/wifi;model/iPhone12,1;addressid/4199175193;appBuild/167694;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
			        'Accept-Encoding': `gzip, deflate, br`,
			        'Accept-Language': `zh-cn`,
			        'Content-Type': 'application/x-www-form-urlencoded',
			        'Referer': 'https://bunearth.m.jd.com'
			      }
			    }
			
			    $.get(url, async (err, resp, data) => {
			      try {
			        data = JSON.parse(data);
			        that.log(data.toast.subTitle)
			      } catch (e) {
			        $.logErr(e, resp);
			      } finally {
			        resolve()
			      }
			    })
			  })
			}
			
			// 入会
			function joinjoinjoinhui(url,Referer) {
			  return new Promise(resolve => {
			    let taskjiaruUrl = {
			      url: url,
			      headers: {
			        "Accept": "*/*",
			        "Accept-Encoding": "gzip, deflate, br",
			        "Accept-Language": "zh-cn",
			        "Connection": "keep-alive",
			        // "Content-Type": "application/x-www-form-urlencoded",
			        "Host": "api.m.jd.com",
			        "Referer": Referer,
			        "Cookie": $.cookie,
			        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : "jdapp;iPhone;10.0.2;14.3;8a0d1837f803a12eb217fcf5e1f8769cbb3f898d;network/wifi;model/iPhone12,1;addressid/4199175193;appBuild/167694;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1") : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;10.0.2;14.3;8a0d1837f803a12eb217fcf5e1f8769cbb3f898d;network/wifi;model/iPhone12,1;addressid/4199175193;appBuild/167694;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
			      }
			    }
			    $.get(taskjiaruUrl, async(err, resp, data) => {
			      try {
			        if (err) {
			          that.log(`${JSON.stringify(err)}`)
			          that.log(`${$.name} 入会 API请求失败，请检查网路重试`)
			        } else {
			          that.log(data)
			          if(data){
			            data = JSON.parse(data)
			            that.log(data.message || JSON.stringify(data))
			          }
			        }
			      } catch (e) {
			        $.logErr(e, resp)
			      } finally {
			        resolve();
			      }
			    })
			  })
			}
			
			
			/**
			 * 随机从一数组里面取
			 * @param arr
			 * @param count
			 * @returns {Buffer}
			 */
			 function getRandomArrayElements(arr, count) {
			  var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
			  while (i-- > min) {
			    index = Math.floor((i + 1) * Math.random());
			    temp = shuffled[index];
			    shuffled[index] = shuffled[i];
			    shuffled[i] = temp;
			  }
			  return shuffled.slice(min);
			}
			
			// 正道的光
			function aabbiill(){
			  let ccdd = 0
			  if(new Date().getUTCHours() + 8 >= 18 && new Date().getUTCHours() + 8 < 24){
			    ccdd = 1
			  }else{
			    ccdd = getRndInteger(0,3)
			  }
			  return true;
			  //return ccdd == 1
			}
			
			// 随机数
			function getRndInteger(min, max) {
			  return Math.floor(Math.random() * (max - min) ) + min;
			}
			
			// 计算时间
			function timeFn(dateBegin) {
			  //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
			  var dateEnd = new Date(0);//获取当前时间
			  var dateDiff = dateBegin - dateEnd.getTime();//时间差的毫秒数
			  var leave1 = dateDiff % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
			  var hours = Math.floor(leave1 / (3600 * 1000))//计算出小时数
			  //计算相差分钟数
			  var leave2 = leave1 % (3600 * 1000)    //计算小时数后剩余的毫秒数
			  var minutes = Math.floor(leave2 / (60 * 1000))//计算相差分钟数
			  //计算相差秒数
			  var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
			  var seconds = Math.round(leave3 / 1000)
			
			  var timeFn = hours + ":" + minutes + ":" + seconds;
			  return timeFn;
			}
			

			function getBody() {
				if (smashUtils) {
					let DATA = {
						appid: '50085',
						sceneid: 'OY217hPageh5'
					};
					var t = Math.floor(1e7 + 9e7 * Math.random()).toString();
					var e = smashUtils.get_risk_result({
						id: t,
						data: {
							random: t
						}
					}).log;
					var o = JSON.stringify({
						extraData: {
							log: encodeURIComponent(e),
							sceneid: DATA.sceneid,
						},
						secretp: $.secretp,
						random: t
					})
					return o;
				}
			}

			/**
			 * 随机从一数组里面取
			 * @param arr
			 * @param count
			 * @returns {Buffer}
			 */
			function getRandomArrayElements(arr, count) {
				var shuffled = arr.slice(0),
					i = arr.length,
					min = i - count,
					temp, index;
				while (i-- > min) {
					index = Math.floor((i + 1) * Math.random());
					temp = shuffled[index];
					shuffled[index] = shuffled[i];
					shuffled[i] = temp;
				}
				return shuffled.slice(min);
			}
		}

		let isPkHelp = true;
		this.init = function() {
			if (this.formData != null) {
				isPkHelp = this.formData.get("isPkHelp");
			}
		}

		function getvalueByformData(value, defaultValue = false) {
			if (value) {
				return value;
			}
			return defaultValue;
		}

		var that = this;
		var $ = {
			name: '618助手',
			logErr: (...text) => {
				this.log(...text)
			},
			log: (...text) => {
				this.log(...text)
			},
			wait: (t) => {
				return new Promise(e => setTimeout(e, t));
			},
			post: function(o, f) {
				that.post(o, f)
			},
			get: function(o, f) {
				that.get(o, f)
			},
			msg: (...text) => {
				this.log(...text)
			},
			done: () => {
				this.log("执行完毕");
			},
			isNode: () => {
				return false;
			},
			getdata: (t) => {
				return undefined
			}
		}


		$.toObj = (t, e = null) => {
			try {
				return JSON.parse(t)
			} catch (e) {
				return e
			}
		}
		$.toStr = (t, e = null) => {
			try {
				return JSON.stringify(t)
			} catch (e) {
				return e
			}
		}
		this.getUserInfo = getUserInfo;
		this.$ = $;

		function getUserInfo() {
			return new Promise((resolve) => {
				$.get({
					url: 'https://passport.jd.com/user/petName/getUserInfoForMiniJd.action',
				}, (err, resp, data) => {
					try {
						if (data === 'null({})') {
							data = "{}";
						}
						data = JSON.parse(data);
						if (data) {
							if (data === {} || JSON.stringify(data) === '{}') {
								$.isLogin = false;
							} else {
								$.userInfo = data;
								$.isLogin = true;
							}
						} else {
							$.isLogin = false;
						}
					} catch (e) {
						that.log(e);
					} finally {
						resolve(data);
					}
				})
			});
		}
	}
})();

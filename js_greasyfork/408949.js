// ==UserScript==
// @name         workUitls
// @namespace    http://tampermonkey.net/
// @version      2.9.10
// @description  工作用的工具箱（安灯为主）
// @author       You
// @match        andon.cloud.tencent.com/*workbench/director*
// @match        andon.cloud.tencent.com/ticket/detail/*
// @match        andon.woa.com/*workbench/director*
// @match        andon.woa.com/ticket/detail/*
// @match        cloudbase.woa.com/env-list*
// @match        bi.andata.oa.com/bi/Viewer
// @match        passport.woa.com/modules/passport/signin.ashx*
// @match        yy.cos.woa.com/host*
// @match        andon.cloud.tencent.com/auth/qq-connect*
// @grant        none
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/408949/workUitls.user.js
// @updateURL https://update.greasyfork.org/scripts/408949/workUitls.meta.js
// ==/UserScript==

(function() {
	Date.prototype.format = function(fmt) {
		var o = {
			"M+" : this.getMonth()+1,	//月份
			"d+" : this.getDate(),	//日
			"h+" : this.getHours(),	//小时
			"m+" : this.getMinutes(),	//分
			"s+" : this.getSeconds()	//秒
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (let k in o) {
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
		return fmt;
	}
	const config = {
		addStyle(text){//添加样式表到页面
			var style = document.createElement('style');
			style.type = 'text/css';
			style.innerHTML=text;
            let head = document.getElementsByTagName('head').item(0)
            console.log(head,style)
			head.appendChild(style);
		},
		getQueryStr(name){//获取url中的参数
			var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if(r!=null)return unescape(r[2]); return null;
		},
		async ajax(d) { //网络请求
			let cg = {headers: {'Content-Type': d['Content-Type']||'application/json'},method: d.type || 'GET'};
			if (d.cookie) cg.credentials = "include";
			if (d.type == 'POST') cg.body = d.body||JSON.stringify(d.data || {});
			return (await fetch(d.url, cg)).json();
		},
		copyEle:null,
		copyText(text){//拷贝文本
			if(!config.copyEle){
				let textEle = document.createElement('textarea');
				textEle.style = 'width: 1px;height: 1px;opacity: 0;';
				document.querySelector('body').appendChild(textEle);
				config.copyEle = textEle;
			}
			config.copyEle.value = text;
			config.copyEle.select();
			if (document.execCommand('copy')) {
				console.log('复制成功');
			}
		},
		async getUserInfo(){
			if(!config.userinfo){//userinfo不存在则去获取
				let {data} = await config.ajax({url:`/ticket/api/tickets/${config.getQueryStr('id')}/customer?use=owner`});
				config.userinfo = data;
			}
			return config.userinfo;
		},
		async createUl(option){//创建右侧工具栏
			if(!option) return;
			let body = document.getElementsByTagName('body')[0];
			let ul = document.createElement('ul');
			ul.setAttribute('class', 'tools-ul');
			option.forEach((e,i)=>{
				let li = document.createElement('li');
				if(e.html){//自定义
					li.innerHTML = e.html;
					li.className = e.className||"input-li";
				}else{//默认按钮
					li.textContent = e.name;
				}
				li.onclick = e.func?e.func:async function(){
					if(!e.url) return;
					let url = e.url;
					if(e.url && e.url.indexOf('{{uin}}')>-1){//链接有uin则去获取
						await config.getUserInfo();
					}
					if(e.url.indexOf('{{uin}}')>-1) url = url.replace('{{uin}}',config.userinfo.uin);
					window.open(url);
				}
				ul.appendChild(li);
			});
			body.appendChild(ul);
		},
		async allRun(){//开始运行
			for(let e of this.allPages){
				if(location.href.indexOf(e.path) > -1){
					config.addStyle(config.commonCss+e.css);//写入页面样式表
					e.ulOption?.length && this.createUl(e.ulOption);//创建右侧工具栏
					e.js();//执行对应的js脚本
					break;
				}
			}
		},
		commonCss:`
			::-webkit-scrollbar {width: 5px;height: 10px;}
			::-webkit-scrollbar-thumb {border-radius: 5px;-webkit-box-shadow: inset005pxrgba(0, 0, 0, 0.2);background: rgba(0, 0, 0, 0.2);}
			::-webkit-scrollbar-track {-webkit-box-shadow: inset005pxrgba(0, 0, 0, 0.2);border-radius: 0;background: rgba(0, 0, 0, 0.1);}
			ul.tools-ul {position: fixed;right: 0;top: 20px;margin: 20px;z-index: 999;list-style: none;padding: 0;font-size: 13px;}
			ul.tools-ul li {cursor: pointer;background: #fff;padding: 5px;border: 1px solid #9E9E9E;margin-bottom: 10px;transition: .3s;border-radius: 5px;line-height: 1rem;text-align: center;}
			ul.tools-ul li:not(.input-li):hover {color: #fff;background: #FF5722;border-color: #FF9800;}
			ul.tools-ul input {border: 0;padding: 5px;width: 130px;}
			ul.tools-ul input[type=date] {padding: 3px 5px;}
			ul.tools-ul li.input-li {padding: 0;}
		`,
		allPages:[{
			path:'/auth/qq-connect',
			css:``,
			ulOption:[],
			async js(){
                let index = window.setInterval(()=>{
					let btn = $('.login-card-container__button.box-shadow:last');
					if(btn[0]){
                        window.location.href = btn[0].href;
						window.clearInterval(index);
					}
				},100)
			}
        },{
			path:'/workbench/director',
			css:`
				.el-button-group {position: absolute;width: max-content;right: 10px;top: 60px;z-index: 999;}
				.page-breadcrumb {width: 0;height: 0;padding: 0!important;margin: 0!important;overflow: hidden;}
				main.el-main.content {padding: 5px;}
				.page-panel.page-content {padding: 10px;}
				.el-tab-pane .page-panel.page-content {padding: 0;border: 0;}
				.el-tabs__nav-scroll {height: 30px;}
				div#tab-operator {line-height: 30px;height: 30px;}
				.el-tabs__header.is-top {margin-bottom: 5px;}
				.filter-body {padding: 5px 0;}
				form.el-form.el-form--label-right:nth-child(3) {display: none;}
				.el-table--small .el-table__cell {padding: 3px 0;}
        aside.el-aside.aside.side-bar {overflow-y: auto;height: calc(100vh - 50px);}
        .main>.page-panel.page-content {height: calc(100vh - 50px);overflow-y: auto;}
        body {overflow: hidden;}
			`,
			ulOption:[],
			async js(){

			}
		},{
			path:'/ticket/detail',
			css:`
				.el-main {padding: 0;}
				a.quick-reply__setting {position: static!important;}
				.el-header {display: none;}
				.page-panel.page-content {padding-top: 5px;}
				.el-form--inline .el-form-item--small.el-form-item {margin-bottom: 0;}
			`,
			ulOption:[],
			async js(){
			}
		},{
			path:'cloudbase.woa.com/env-list',
			css:`
			`,
			ulOption:[
				{html:'<input type="text" placeholder="uin" id="uin">'},
				{html:'<input type="text" placeholder="envid" id="envid">'},
				{html:'<input type="text" placeholder="region" id="region" value="ap-shanghai" >'},
				{name:'复制权限', async func(){
					let uin = document.querySelector('#uin').value;
					let region = document.querySelector('#region').value;
					let reqObj = {
						"interfaceName": "DescribeEnvs",
						"params": {
							"action": "DescribeEnvs",
							"service": "tcb",
							"version": "2018-06-08",
							"uin": uin,
							"region": region,
							"apiParams": {
								"EnvId": document.querySelector('#envid').value
							}
						},
						"access": "INFO_QUERY_ACCESS"
					};
					let d = await config.ajax({url:'/api/idc?interfaceName=DescribeEnvs',data:reqObj,type:'POST'});
					if(d.code === 0 && d.result && d.result.EnvList && d.result.EnvList.length === 1){
						let env = d.result.EnvList[0];
						let bucket = env.Storages[0].Bucket;
						let bucketSplit = bucket.split('-');
						let appid = bucketSplit.pop();
						let staticCosStr = '';
						if (env.StaticStorages && env.StaticStorages.length > 0) {
							var staicBucket = env.StaticStorages[0].Bucket;
							staticCosStr = `,
			"qcs::cos:${region}:uid/${appid}:${staicBucket}/*"
`;
						}
						createCAMStr({
							envid:env.EnvId,
							uin:uin,
							namespace:env.Functions[0]?.Namespace||0,
							bucket:bucket,
							appid:appid,
							staticCosStr:staticCosStr,
							topic:env.LogServices[0]?.TopicId||'',
							logset:env.LogServices[0]?.LogsetId||''
						});
					}

					function createCAMStr(envData){
                        let lowcode = envData.envid.includes('lowcode')?`,
			"tcb:DescribeCloudBaseProjectVersion",
			"tcb:CreateAndDeployCloudBaseProject",
			"tcb:DescribeCloudBaseCILog",
			"tcb:DescribeAuthDomains",
			"tcb:DescribeAuthDomains",
			"tcb:DescribeLoginConfigs",
			"tcb:CreateLoginConfig",
			"tcb:UpdateLoginConfig",
			"tcb:DescribeSecurityRule",
			"tcb:ModifySecurityRule"`:''//判断是低代码环境增加低代码权限
						let CAMPolicy = `{
	"version": "2.0",
	"statement": [{
		"effect": "allow",
		"resource": ["*"],
		"action": [
			"cam:GetRole",
			"tcb:CheckTcbService",
			"tcb:DescribePackages",
			"tcb:DescribeEnvLimit",
			"tcb:DescribeBillingInfo",
			"tcb:DescribeExtensionsInstalled",
			"tcb:DescribePostPackage",
			"tcb:CheckActiveQualified",
			"tcb:DescribeICPResources",
			"tcb:DescribeCloudBaseRunAdvancedConfiguration",
			"tcb:DescribeExtensions",
			"tcb:DescribeExtensionUpgrade",
			"tcb:DescribeCloudBaseProjectLatestVersionList",
			"tcb:DescribeCloudBaseRunServers",
			"tcb:DescribeExtensionUploadInfo"${lowcode}
		]
	}, {
		"effect": "allow",
		"resource": ["qcs::tcb:::env/${envData.envid}"],
		"action": ["tcb:*"]
	}, {
		"effect": "allow",
		"resource": [
			"qcs::scf:${region}::namespace/${envData.namespace}",
			"qcs::scf:${region}::namespace/${envData.namespace}/*"
		],
		"action": ["scf:*"]
	}, {
		"effect": "allow",
		"action": ["name/cos:*"],
		"resource": [
			"qcs::cos:${region}:uid/${envData.appid}:${envData.bucket}/*"${envData.staticCosStr}
		]
	}, {
		"effect": "allow",
		"action": ["cls:*"],
		"resource": [
			"qcs::cls::uin/${envData.uin}:topic/${envData.topic}",
			"qcs::cls::uin/${envData.uin}:logset/${envData.logset}"
		]
	}]
}`;
						console.log(CAMPolicy);
						config.copyText(CAMPolicy);
					}
				}
			}],
			async js(){
				$("body").on('click','#tab-scf',function(){
					let obj = {
						uin:config.getQueryStr('uin'),
						rid:{'ap-shanghai':'4','ap-guangzhou':'1'}[config.getQueryStr('region')],
						namespace:config.getQueryStr('env_id')
					}
					window.open(`https://qcm.woa.com/scf/query-function-new?accountType=uin&account=${obj.uin}&namespace=${obj.namespace}&rid=${obj.rid}`);
				});
			}
		},{
			path:'/modules/passport/signin.ashx',//自动IOA登录
			css:``,
			ulOption:[],
			async js(){
				let index = window.setInterval(()=>{
					let btn = $('#btn_smartlogin');
					if(btn[0]){
						btn.click();
						window.clearInterval(index);
					}
				},100)
			}
		},{
			path:'yy.cos.woa.com/host',//一键复制暴露cos桶的语句
			css:``,
			ulOption:[],
			async js(){
				let vm = new Vue({methods:{aletr(text,type){this.$message({message: text,type: type||'success'});}}});
				$("body").on('dblclick','.el-table__row',function(){
					let bucket = $(this).find('.text-link').text();
					let region = $(this).find('.el-table_1_column_4').text();
					config.copyText(`bucket_quota delete ${bucket} ${region}`);
					vm.aletr('复制成功');
				});
			}
		}]
	}
	config.allRun();
})();
// ==UserScript==
// @name         一键收录
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一键收录不规范、有价值工单
// @author       You
// @match        andon.oa.com/ticket/detail*
// @match        andon.cloud.tencent.com/ticket/detail*
// @match        andon.woa.com/ticket/detail*
// @grant        none
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/@cloudbase/js-sdk@1.7.1/miniprogram_dist/index.js

// @downloadURL https://update.greasyfork.org/scripts/440768/%E4%B8%80%E9%94%AE%E6%94%B6%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/440768/%E4%B8%80%E9%94%AE%E6%94%B6%E5%BD%95.meta.js
// ==/UserScript==

(function() {
	window.config2 = {
		addStyle(text) { //添加样式表到页面
			var style = document.createElement('style');
			style.type = 'text/css';
			style.innerHTML = text;
			document.getElementsByTagName('head').item(0).appendChild(style);
		},
		getQueryStr(name) { //获取url中的参数
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]);
			return null;
		},
		async ajax(d){//网络请求
			let cg = {headers:{'Content-Type':'application/json'},method: d.type||'GET'};
			if(d.cookie) cg.credentials = "include";
			if(d.type == 'POST')cg.body = JSON.stringify(d.data||{});
			return (await fetch(d.url,cg)).json();
		},
		copyEle:null,
		copyText(text){//拷贝文本
			if(!config2.copyEle){
				let textEle = document.createElement('textarea');
				textEle.style = 'width: 1px;height: 1px;opacity: 0;';
				document.querySelector('body').appendChild(textEle);
				config2.copyEle = textEle;
			}
			config2.copyEle.value = text;
			config2.copyEle.select();
			if (document.execCommand('copy')) {
				console.log('复制成功');
			}
		},
		async createUl(path){//创建右侧工具栏
			$('body').append(`
			<div id="norm">
				<el-row style="position: fixed; z-index: 11;max-width: 120px; bottom:0; right:0; padding-right: 10px; margin-bottom: 30px; text-align: right;overflow: auto;max-height: 100vh;" >
					<el-col :span="24"> <el-button @click="_save" type="warning" size="small" round>工单一键收录</el-button> </el-col>
				</el-row>
				<el-drawer
				  title="收录方式确认"
				  :visible.sync="edit"
				  direction="rtl"
					size="620px">
				  <div style="padding: 0 20px;overflow: auto;height: 100vh;">
						<el-row :gutter="20">
						  <el-col :span="24">
								<el-form label-width="120px" size="mini">
									<el-form-item label="收录人"> <el-input v-model="form['收录人']"></el-input> </el-form-item>
									<el-form-item label="收录方式">
										<el-select v-model="form.saveType" placeholder="收录方式">
											<el-option label="不规范工单收录" value="不规范工单"></el-option>
											<el-option label="有价值工单收录" value="有价值工单"></el-option>
										</el-select>
									</el-form-item>
									<template v-if="form.saveType=='不规范工单'">
										<el-form-item label="不规范操作人">
											<el-select v-model="form.normOperater" placeholder="请选择">
												<el-option v-for="item in form['工单经手人'].split(',')" :key="item" :label="item" :value="item"> </el-option>
											</el-select>
										</el-form-item>
										<el-form-item label="不规范操作类别">
											<el-select v-model="form.normType" multiple placeholder="请选择">
												<el-option v-for="item in types" :key="item" :label="item" :value="item"> </el-option>
											</el-select>
										</el-form-item>
										<el-form-item label="不规范操作描述">
											<el-input v-model="form.normDetail"></el-input>
										</el-form-item>
									</template>
									<template v-else-if="form.saveType=='有价值工单'">
										<el-form-item label="记录原因">
											<el-select v-model="form.saveReason" placeholder="请选择">
												<el-option label="关联已有文档" value="关联已有文档"></el-option>
												<el-option label="文档缺失" value="文档缺失"></el-option>
												<el-option label="其他价值" value="其他价值"></el-option>
											</el-select>
										</el-form-item>
										<el-form-item v-if="form.saveReason == '关联已有文档'" label="关联文档链接">
											<el-input v-model="form['docUrl']"></el-input>
										</el-form-item>
										<el-form-item label="简要记录描述">
											<el-input v-model="form.normDetail"></el-input>
										</el-form-item>
									</template>
								</el-form>
							</el-col>
							<el-col :span="24">
								<el-button size="mini" type="primary" @click="normOrder" icon="el-icon-check" style="width: 100%;text-align: center;">收录</el-button>
							</el-col>
						</el-row>
					</div>
				</el-drawer>
			</div>
			`)
			new Vue({
				el:"#norm",
				data(){
					return {
						form:{saveType:'不规范工单','工单经手人':''},
						saveKey:['客户名称','工单来源','工单ID','创建时间','处理耗时','当前处理人','岗位队列','客户代表','工单经手人','工单归档'],
						types:[],
						edit:false,//编辑状态
						user_id:localStorage.user_id,//当前登陆角色p账号
					}
				},
				async created(){
					// if(!this.user_id){
					// 	this.user_id = await config.ajax({url:'/user?scope=TICKET,PROBLEM,ONLINE'}).then(res=>{return localStorage.user_id = res.data.user_id;});
					// }
					this.$tcb = cloudbase.init({env:'andon-5gwcr58lab678cdf'});
					this.$auth = this.$tcb.auth();
					await this.$auth.anonymousAuthProvider().signIn().then(() => {console.log('%c匿名登录成功','color:#4CAF50;')});
					this.$db = this.$tcb.database();
				},
				methods:{
					async _save(){
						this.edit=true;
						if(!this.types[0]){
							this.types = await this.$db.collection('config').where({code:'andonArr'}).get().then(res=>res.data[0].arr1);
						}
						$('.el-form--label-left').each((i,e)=>{
							let key = $(e).find('.el-form-item__label').text();
							if(this.saveKey.includes(key)){
								this.form[key] = $(e).find('.el-form-item__content').text();
							}
						});
						this.form['收录人'] = this.form['客户代表'];
						console.log(this.form)
					},
					async normOrder(){
						let tableName = this.form.saveType=='不规范工单'?'order-norm':'order-valuable';
						let isAs = await this.$db.collection(tableName).doc(this.form['工单ID']).get().then(res=>{return res.data[0]});
						console.log(isAs);
						if(isAs){
							this.$notify({title: '警告',message: this.form.saveType+'已存在',type: 'warning'});
							return;
						}
						let url = await config2.ajax({url:`/ticket/api/redirect/genRedirectUrl?id=${config2.getQueryStr('id')}&sign=${config2.getQueryStr('sign')}`}).then(res=>{return res.data.url;});
						this.form.url = url;
						this.form._id = this.form['工单ID'];
						this.form['二级标签'] = this.form['工单归档'].split('>')[1];
						let res = await this.$db.collection(tableName).add(this.form).catch(err=>{console.log(err); return '';});
						console.log(res);
						if(res.id){
							this.$notify({title: '成功',message: this.form.saveType+'已成功收录',type: 'success'});
							this.edit=false;
						}
					}
				}
			});
		},
		async allRun() { //开始运行
			new Vue({created(){config2.vue = this;}});
			for (let e of this.allPages) {
				if (location.href.indexOf(e.path) > -1) {
					config2.addStyle(config2.commonCss + e.css||''); //写入页面样式表
					this.createUl(e.path); //创建右侧工具栏
					e.js(); //执行对应的js脚本
					break;
				}
			}
		},
		commonCss: `
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
		allPages: [{
			path: '/ticket/detail',
			async js(){
				
			}
		}]
	}
	config2.allRun();
})();

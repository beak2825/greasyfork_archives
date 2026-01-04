// ==UserScript==
// @name         动态蓝字，非常牛逼了可以说
// @namespace    mscststs
// @version      0.1
// @description  转发动态的时候可以发出蓝字
// @author       mscststs
// @include     /^https?:\/\/t\.bilibili\.com\/\d?/
// @require      https://cdn.bootcss.com/axios/0.17.1/axios.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369422/%E5%8A%A8%E6%80%81%E8%93%9D%E5%AD%97%EF%BC%8C%E9%9D%9E%E5%B8%B8%E7%89%9B%E9%80%BC%E4%BA%86%E5%8F%AF%E4%BB%A5%E8%AF%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/369422/%E5%8A%A8%E6%80%81%E8%93%9D%E5%AD%97%EF%BC%8C%E9%9D%9E%E5%B8%B8%E7%89%9B%E9%80%BC%E4%BA%86%E5%8F%AF%E4%BB%A5%E8%AF%B4.meta.js
// ==/UserScript==

(function() {
	'use strict';
	class Api{
		/*
			api部分
		*/
		constructor(){
			this.ReposetURL = "dynamic_repost/v1/dynamic_repost/repost";
		}
		async _api(url,data,method="post") {
			return axios({
				url,
				baseURL: 'https://api.vc.bilibili.com/',
				method,
				data: data,
				transformRequest: [function (data) {
					// Do whatever you want to transform the data
					let ret = '';
					for (let it in data) {
						ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
					}
					return ret;
				}],
				withCredentials: true,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then(function (res) {
				return res.data;
			});
		}
		async repost(dmid,content,isOrigin = false){
		console.log("蓝字转发："+content);
			let l = content.length;
			let ctrl = JSON.stringify([{data:window.pointUser||"-1",location:"0",length:l,type:1}]);
			let data = {
				uid: userinfo.userId,
				dynamic_id: dmid,
				content: content,
				at_uids: window.noteUser||"",
				ctrl: ctrl,
				csrf_token: userinfo.csrf_token,
			};
			
			if(isOrigin){
				data.type = 4;
				data.dynamic_id = 0;
				data.rid = 0;
			}
			let res = await this._api(this.ReposetURL,data,"post");
			return res;
		}
	}
	
	
	let userinfo = {};
	let api = new Api();
	function ReadConfig(){
		if(window.localStorage["Blue_Helper_noteUser"]){
			window.noteUser = (window.localStorage["Blue_Helper_noteUser"]);
		}
		if(window.localStorage["Blue_Helper_pointUser"]){
			window.pointUser = (window.localStorage["Blue_Helper_pointUser"]);
		}
	}

	function getUserInfo(){
		let cookies = document.cookie.split(" ");
		for(let ck of cookies){
			let key = ck.split("=")[0];
			let value = ck.split("=")[1].split(";")[0];
			if(key=="DedeUserID"){
				userinfo.userId = value;
			}
			if(key=="bili_jct"){
				userinfo.csrf_token = value;
			}
		}
	}
	function CheckList(){
		let s = [];
		$("div.card").each(function(){
			s.push($(this));
		})
		for(let card of s){
			if(card.attr("dynamic_id")){
				continue;
			}
			let head = card.find("a.user-head");

			if(head.length){
				let hr = card.find("div.main-content a.detail-link").attr("href");
				//console.log("...")
				let number = hr.indexOf(".com");
				let w = "";
				for(let i=number+5;i<100;i++){
					if(["0","1","2","3","4","5","6","7","8","9"].indexOf(hr[i])>=0){
						w+=hr[i];
					}else{
						break;
					}
				}
				card.attr("dynamic_id",w);
				card.append(`<button class="Blue helper" dynamic_id="${w}">蓝字转发</button>`);
				}
			}
		}
		function Config(){
			let noteUser = prompt("请输入收到@通知的用户的UID");
			window.localStorage["Blue_Helper_noteUser"] = noteUser;
			
			let pointUser = prompt("请输入点击时跳转的用户的UID");
			window.localStorage["Blue_Helper_pointUser"] = pointUser;
			
			ReadConfig();
		}
		async function Send(eve){
			let dynamic_id = $(eve.target).attr("dynamic_id");
			let text = prompt();
			await api.repost(dynamic_id,text);
			if(confirm("发送完毕，是否刷新？")){
				window.location.reload();
			}
		}
		async function origin(eve){
			let text = prompt();
			await api.repost(0,text,true);
			if(confirm("发送完毕，是否刷新？")){
				window.location.reload();
			}
		}
		$().ready(()=>{
			ReadConfig();
			setTimeout(()=>{
				$("div.section-block").append(`<button class="Blue Origin">蓝字发动态</button><button class="Blue Config">配置</button>`)
			},3000)
			getUserInfo();
			$("body").append(`
				<style>
					.Blue{
						background-color:transparent;
						border:1px solid #23f;
						position:absolute;
						padding:2px 4px;
					}
					.Origin{
						margin-left:200px;
						margin-top:-27px;
					}
					.helper{
						margin-top:-27px;
						margin-left:3px;
					}
					.Config{
						margin-left:290px;
						margin-top:-27px;
					}
				</style>
			`)
			
			$("body").on("click","button.Blue.Origin",origin);
			$("body").on("click","button.Blue.Config",Config);
			$("body").on("click","button.Blue.helper",Send);
			setInterval(function(){CheckList();},3000);
		})
	})();
// ==UserScript==
// @name         bilibili-关注自动发送弹幕-主播版
// @namespace    mscststs
// @version      0.2
// @description  在直播间，当有关注的时候自动发送弹幕
// @author       mscststs
// @include        /https?:\/\/live\.bilibili\.com\/\d/
// @require      https://cdn.bootcss.com/fetch-jsonp/1.1.3/fetch-jsonp.min.js
// @require      https://cdn.bootcss.com/axios/0.17.1/axios.js
// @require      https://cdn.bootcss.com/vue/2.5.13/vue.js
// @require      https://greasyfork.org/scripts/38220-mscststs-tools/code/MSCSTSTS-TOOLS.js?version=618337
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375697/bilibili-%E5%85%B3%E6%B3%A8%E8%87%AA%E5%8A%A8%E5%8F%91%E9%80%81%E5%BC%B9%E5%B9%95-%E4%B8%BB%E6%92%AD%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/375697/bilibili-%E5%85%B3%E6%B3%A8%E8%87%AA%E5%8A%A8%E5%8F%91%E9%80%81%E5%BC%B9%E5%B9%95-%E4%B8%BB%E6%92%AD%E7%89%88.meta.js
// ==/UserScript==

/**
*
* 由mscststs提供
* 该脚本由tampermonkey维护，作者 https://greasyfork.org/zh-CN/users/112931-mscststs 
*
**/
(function() {
    'use strict';
	class Api{
		/*
			api部分
		*/
		constructor(){
			this.webTitles = "rc/v1/Title/webTitles";
			this.titleInfo = "i/api/ajaxTitleInfo";
			this.titleWear = "i/ajaxWearTitle";
			this.GetDailyBucket = "activity/v1/Common/getReceiveGift";
		}
		async getFollowers(){
			let data =  await fetchJsonp("https://api.bilibili.com/x/relation/followers?jsonp=jsonp&vmid="+window.BilibiliLive.UID).then(res=>res.json());
			return data;
		}
		async _api(url,data,method="post") {
			return axios({
				url,
				baseURL: 'https://api.live.bilibili.com/',
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
		async getWebTitles(){
			let res = await this._api(`${this.webTitles}`);
			return res;
		}
		async getTitleInfo(){
			let res = await this._api(`${this.titleInfo}?normal=0&special=0&keyword=&had=1&page=1&pageSize=500`);
			return res;
		}
		async wareTitle(id,cid){
			let res = await this._api(`${this.titleWear}`,{id,cid});
			return res;
		}

	}
	
	$().ready(function(){
        //页面加载完成
		let api = new Api();
        function show_Panel(){
            let rside = $("div.right-container");
            rside.prepend("<div id='helper-Focus' class='bilibili-Focus-box'></div>");
			$("body").append(`
			<style>
				.bilibili-Focus-box{
					border: 1px solid #e9eaec;
					border-radius: 12px;
					font-size: 12px;
					padding: 16px 12px 24px 12px;
					margin: 0;
					margin-bottom: 24px;
					background-color: #fff;
				}
				.bilibili-Focus-box p{
					margin-top: 0;
					font-size: 20px;
					color: #333;
				}
				.bilibili-Focus-box input{
					width:100%;
					outline:none;
					height:30px;
					line-height:30px;
					box-sizing:border-box;
					padding:0 5px;
				}
				</style>
			`)
			document.querySelector("#helper-Focus").innerHTML=
			`
				<div>
					<p>{{Name}}</p>
					<input class="input" v-model="value" placeholder="感谢[name]的关注" :disabled="inProgress"/>
					<div>
						<button @click="startFetch">{{inProgress?"停止":"开始"}}</button> <span style="margin:0 5px">总关注: {{total}}</span>
					</div>
				</div>
			`
            //初始化列表
        }
        
		init();
		async function init(){
			await mscststs.wait(".wish-part");
			let input =await mscststs.wait("#chat-control-panel-vm > div > div.chat-input-ctnr.p-relative > div > textarea");
			let SendBtn = await mscststs.wait("#chat-control-panel-vm div.control-panel-ctnr.border-box div.right-action button.bl-button");
			if(window.BilibiliLive.ANCHOR_UID != window.BilibiliLive.UID){
				return; //相等
			}
			show_Panel();
			
			window.helper_Focus = new Vue({
				el:"#helper-Focus",
				name:"helper_focus",
				data:{
					Name:"关注自动感谢 - 主播版",
					value:"感谢[name]的关注",
					inProgress:false,
					list:null,
					total:"等待开启",
					DanmakuList:[]
				},
				mounted(){
					setInterval(this.CheckFollow,3000);
					setInterval(this.sendMsg,1500);
				},
				methods:{
					sendMsg(){
						if(this.DanmakuList.length){
							input.value = (this.DanmakuList.pop());
							let e = new Event('input');
							e.myself = true;
							input.dispatchEvent(e); // 把弹幕喂给v-model

							let c = new Event("click");
							c.myself = true;
							SendBtn.dispatchEvent(c);
						}
					},
					addMsg(name){
						if(this.inProgress){
							this.DanmakuList.push(this.value.replace(/\[name\]/g,name));
						}
					},
					async CheckFollow(){
						if(!this.inProgress){
							//当前不需要检查
							return false;
						}else{
							let res = await api.getFollowers();
							let {list,total} = res.data;
							if(this.list === null){
								this.list = list;
								this.total = total;
								return;
							}
							this.total = total;
							if(list.length){
								for(let f of list){
									let searchFlag = false;
									for(let o of this.list){
										if(f.mid == o.mid){
											searchFlag = true;
										}
									}
									if(!searchFlag){
										this.list.push(f);
										this.addMsg(f.uname);
									}
								}
							}
						}
					},
					startFetch:async function(){
							if(this.inProgress){
								this.inProgress = false;
							}else{
								if(this.value.indexOf("[name]")>=0){
									this.inProgress = true;
								}else{
									alert("模板没有包含名称参数: [name] !");
								}
							}
					}
				}
			});
		}
		


    });
    // Your code here...
})();
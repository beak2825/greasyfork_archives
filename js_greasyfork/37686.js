// ==UserScript==
// @name         又又又有人刷奖池啦
// @namespace    mscststs
// @version      0.1
// @description  大佬刷奖池提醒
// @author       mscststs
// @match        https://live.bilibili.com/jqr
// @require      https://cdn.bootcss.com/axios/0.17.1/axios.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37686/%E5%8F%88%E5%8F%88%E5%8F%88%E6%9C%89%E4%BA%BA%E5%88%B7%E5%A5%96%E6%B1%A0%E5%95%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/37686/%E5%8F%88%E5%8F%88%E5%8F%88%E6%9C%89%E4%BA%BA%E5%88%B7%E5%A5%96%E6%B1%A0%E5%95%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';
	class Api{
		/*
			api部分
		*/
		constructor(){
			this.GetPoolURL = "activity/v1/NewSpring/redBagPool";
			this.ExchangeURL = "activity/v1/NewSpring/redBagExchange";
			this.IndexURL = "activity/v1/NewSpring/index";
			this.GetDailyBucket = "activity/v1/Common/getReceiveGift";
			this.redBagExListURL="activity/v1/NewSpring/redBagExList";
			this.msg_sendURL = "msg/send";
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
		async SendDanmaku(msg){
			let data = {
                        color:16777215,
                        fontsize:25,
                        mode:1,
                        msg:msg,
                        rnd:Date.parse(new Date())/1000,
                        roomid:23058
                    };
			let res = await this._api(this.msg_sendURL,data);
		}
		async getRedBagPOOL(){
			let res = await this._api(`${this.GetPoolURL}?_=${(new Date()).valueOf()}`);
			return res;
		}
		async Exchange(id,number){
			let res = await this._api(this.ExchangeURL,{award_id:id,exchange_num:number});
			return res;
		}
		async getIndex(){
			let res = await this._api(`${this.IndexURL}?_=${(new Date()).valueOf()}`);
			return res;
		}
		async getDailyBucket(roomid){
			let res = await this._api(`${this.GetDailyBucket}?roomid=${roomid}`,{},"get");
			return res;
		}
		async getRedBagExList(){
			let res =  await this._api(`${this.redBagExListURL}?_=${(new Date()).valueOf()}`);
			return res;
		}
	}

	let length = 0;
	async function a(){
		let api = new Api();
		let res = await api.getRedBagExList();
		console.log("查询了一次,最近刷新："+JSON.stringify(res.data.list[0]));
		if(res.data.list.length!=length && length!==0){
			let name = res.data.list[0].uname;
			let time = (res.data.list[0].time+"").substring(11,19);
			await api.SendDanmaku(`${time} 有大佬刷新了奖池`);
			await api.SendDanmaku(`感谢【${name}】大佬刷新奖池`);
			/*
				此处是发弹幕的逻辑，两条弹幕，防止敏感词什么的
			*/
			console.log(name+" "+time);
		}
		length = res.data.list.length; //覆盖
	}
	setInterval(()=>{a();},2e3);//每2秒查询一次
    
})();
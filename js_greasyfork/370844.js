// ==UserScript==
// @name         BiliBili-直播间头衔增强
// @namespace    mscststs
// @version      0.3
// @description  头衔切换增强
// @author       mscststs
// @include        /https?:\/\/live\.bilibili\.com\/\d/
// @require      https://cdn.bootcss.com/axios/0.17.1/axios.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370844/BiliBili-%E7%9B%B4%E6%92%AD%E9%97%B4%E5%A4%B4%E8%A1%94%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/370844/BiliBili-%E7%9B%B4%E6%92%AD%E9%97%B4%E5%A4%B4%E8%A1%94%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

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
			let res = await this._api(`${this.webTitles}`,{},"get");
			return res;
		}
		async getTitleInfo(){
			let res = await this._api(`${this.titleInfo}?normal=0&special=0&keyword=&had=1&page=1&pageSize=500`,{},"get");
			return res;
		}
		async wareTitle(id,cid){
			let res = await this._api(`${this.titleWear}`,{
                id,
                cid,
                csrf_token: getUserCSRF(),
                csrf: getUserCSRF(),
            });
			return res;
		}

	}

    function getUserCSRF(){
		let cookies = document.cookie.split(" ");
		for(let ck of cookies){
			let key = ck.split("=")[0];
			let value = ck.split("=")[1].split(";")[0];
			if(key=="bili_jct"){
				return value;
			}
		}
	}
    $().ready(function(){
        //页面加载完成
		let api = new Api();
        function show_Panel(){
            let rside = $("div.right-container");
            $("body").append("<style>.bilibili-like-box{border:1px solid #e9eaec;border-radius:12px;font-size:12px;padding:16px 12px 24px 12px;margin:0;margin-bottom:24px;background-color:#fff}.bilibili-like-box p{margin-top:0 ;font-size:20px;color:#333}.helper-myMedal{cursor:pointer;margin:2px 4px;}</style>");
            rside.prepend("<div id='helper-title' class='bilibili-like-box'></div>");
            let helper = $("#helper-title");
            helper.append("<p>头衔更换面板</p>");
            //初始化列表
        }
		let store ={};
		async function init_data(){
			$("#helper_title_retry").remove();
			try{
				let alTitle = store.alTitle || await api.getWebTitles();
				store.alTitle = alTitle;
				let hasTitle = await api.getTitleInfo();
				console.log(alTitle);
				console.log(hasTitle);
				let getPicUrl = (css)=>{
					for(let item of alTitle.data){
						if(item.identification == css){
							return item.web_pic_url;
						}
					}
				}
				for(let myTitle of hasTitle.data.list){
					myTitle.pic = getPicUrl(myTitle.css);
				}
				window.title_helper_wear = try_wear;
				appendTitleItem(hasTitle.data.list);
			}catch(e){
				console.log(e);
				if($("#helper_title_retry").length == 0){
					window.title_helper_retry = init_data;
					let helper = $("#helper-title");
            		helper.append("<button id='helper_title_retry' onclick='title_helper_retry()'>初始化失败，点击重试</button>");
				}
			}
		}
		async function try_wear(id,cid){
			await api.wareTitle(id,cid);
			init_data();
		}
		function appendTitleItem(list){
			if($("#helper_title_list").length != 0){
				$("#helper_title_list").remove();
			}
			$("#helper-title").append(`<div id="helper_title_list">
			</div>`);
			let pa = $("#helper_title_list");
			for(let i of list){
				pa.append(`<img onclick=title_helper_wear(${i.id},${i.cid}) class="helper_title ${i.wear?"helper_title_shine":"helper_title_gray"}" src="${i.pic}"/>`);
			}
		}


        function init(){
            show_Panel();
			init_data();
			$("body").append(`
			<style>
			.helper_title_gray{
				filter:brightness(1) grayscale(100%);
			}
			.helper_title{
				/*margin:0 3px;*/
				text-align:justify;
				cursor:pointer
			}
			#helper_title_list{
				text-align:center;
				 -webkit-column-count:3 !important;
				 -moz-column-count:3 !important;
				 column-count:3 !important;
			}
			
			</style>
			`)
        }

        init();


    });
})();
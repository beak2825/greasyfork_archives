// ==UserScript==
// @name              网购查券助手，自动查询淘宝、天猫、京东等隐藏的大额优惠券和优惠活动，不花冤枉钱。脚本持续维护更新~
// @name:zh           网购查券助手，自动查询淘宝、天猫、京东等隐藏的大额优惠券和优惠活动，不花冤枉钱。脚本持续维护更新~
// @name:zh-TW        網購查券助手，自動查詢淘寶、天貓、京東等隱藏的大額優惠券和優惠活動，不花冤枉錢。指令碼或直譯式程式持續維護更新~
// @description       支持平台：京东、淘宝、天猫、天猫超市、天猫国际、京东国际、京东图书、京东大药房、阿里大药房、唯品会等；功能：1、搜索商品时会自动查询标注有优惠券和活动的商品，无需进入详情页，方便快捷；2、浏览商品详情页时脚本会自动查询商品是否有隐藏的优惠券；3、浏览记录标注（本地存储、可手动清空）；4、网页显示优化；脚本长期维护更新，请放心使用~
// @description:zh    支持平台：京东、淘宝、天猫、天猫超市、天猫国际、京东国际、京东图书、京东大药房、阿里大药房、唯品会等；功能：1、搜索商品时会自动查询标注有优惠券和活动的商品，无需进入详情页，方便快捷；2、浏览商品详情页时脚本会自动查询商品是否有隐藏的优惠券；3、浏览记录标注（本地存储、可手动清空）；4、网页显示优化；脚本长期维护更新，请放心使用~
// @description:zh-TW 支援平台：京東、淘寶、天貓、天貓超市、天貓國際、京東國際、京東圖書、京東大藥房、阿里大藥房、唯品會等；功能：1、搜索商品時會自動查詢標註有優惠券和活動的商品，無需進入詳情頁，方便快捷；2、瀏覽商品詳情頁時指令碼或直譯式程式會自動查詢商品是否有隱藏的優惠券；3、瀏覽記錄標註（本地存儲、可手動清空）；4、網頁顯示優化；指令碼或直譯式程式長期維護更新，請放心使用~
// @icon		      data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAABC5JREFUeF7tm19ojlEcx89Y2FCbyWqhTVJyIYWLTaHdLy4puaEUF4iIC7kgNeHCSnEjxSXtfqHYBSu5kBuxTIosK2ymMX1fnXl39pxzfr/fOed9nvXuqdXb+57znPP7nO/vz3POnhpV5VdNlduv5gDMKaACBA7fHD2KYRYunrerbkntRj3k0uXzG/D525ffI/q7se8TL/H5yt5FOyowtXQuAKMbmhecgxHaUIlBnwfHH4//+POg52D9NUl/X5/oMUAbHmK0bdKAEVsZ0QCkNNwEEhNEMIBKGp4CRBCA43d/PlrRunC7z89S/h6qBjGAIhivwYZAYAOIKfnV9f0lG96PtgeLBKn0QldtI/dGbACX+icnuYOUt4fRHcu6lTZe//Z0+IR6Mnwy5NalvkOvxo5xUiYLwNneia8h6Q1G71m5e9qqD421q46my1OG3/twP0gRXCWQAcTw+VPrmkuGZq32tqbuEgi4AyCEXJyYQAIQw3htoEvquk2oCgCPCsELIIbxmBCkDxdwGaddJIYKqPHAC0AS9PrezRTwvrXdpS/vvHEHOle7tkal1pQen2gXJR44AUhWH8b3DdImyG11YBMPAEUFTgDS1U8FoLNVqc42HjafCqwAJKuPqdkUcGTzv4lfH3Ab4GoH+UMF3MtVG1gBSFYfE7v1Qqm3U9sb/6eaJwCXCjIBoNxdtaHuKpc02p95KOlF6yNVgCsWZAKQyj81ANz/4k4aLLOVTQWZAKTyh/ThAikvSSbAfHIBsLVFqWcf4+KQArC5wQwFhMg/ZQ2gMVY9AEktoOFlPR/MUEDII6+pgBQuEJIJsuJAVABmDYDc7yt8uBGi0ADMGiAFgNipcIYCpCkwqwYoGgDM8XR7zTSbowEwawD4P/5iuwCMCMkEXgDSIDgbACQNglkZIJUCpKmwogDg/6gCY1eCcAFpJiABkFaCZgq83aVUz0CxAJAKIemjcNUDMGuA14eU2t+bRgHSWsDMALhP5uOwJBOUA0DwgwtUDYCsFAgA629wC116e24tYDsoibIllpUCdRCESWYmiJEZuABsG6PWTVGOG5gAkAK3tNBX87mxaVIOyAaLWwtk+b81BuAHTjaoxEaIiZNTC7jOCZ0HI1QV2LbC6Rrgt+QAsK2+UwEcFaTcCrehoQLwnRJ7D0cpKsg6COGvKb8H5aDUtfpeBXBUwJ9++h6+1ScBQCPp80F6E+0jUIwnA5htEKjGswCgMSUe5LnqGNt3HG7OzxsEyztwaoO8QPiCXhAA3bmISsDKj3z6dZ7zP4JsFyinV6TAyPH5KArQNykChBDjgxSQNwSp5KMqIA+XiGW4njsrC1Aieyq3iG14MgD6xkiZeEss5IUK/TaZJLpTFitKDKAOBGWgLeW1ObwlhrbclEadS3m76C4gmUSefeYA5Em/CGNXvQL+ArUSol/An+nwAAAAAElFTkSuQmCC 
// @namespace         coolhii_vip_coupon
// @version           6.2.8
// @author            Gabrielvy
// @match             *://*.taobao.com/*
// @match             *://*.tmall.com/*
// @match             *://*.tmall.hk/*
// @match             *://*.liangxinyao.com/*
// @match             *://chaoshi.detail.tmall.com/*
// @match             *://pages.tmall.com/wow/an/cs/search**
// @match             *://*.jd.com/*
// @match             *://*.jd.hk/*
// @match             *://item.jingdonghealth.cn/*
// @match             *://item.jkcsjd.com/*
// @match             *://*.yiyaojd.com/*
// @match             *://www.vipglobal.hk
// @match             *://*.vip.com/*
// @match             *://detail.vip.com/detail-*
// @match             *://www.vipglobal.hk/detail-*
// @match             *://category.vip.com/suggest.php**
// @match             *://list.vip.com/*.html
// @match             *://*.suning.com/*
// @include           *://*.cloud.tencent.com/*
// @include           *://cloud.tencent.com/*
// @include           *://*.huaweicloud.com/*
// @include           *://*.aliyun.com/*
// @include     	  /^https:\/\/([\w-]+\.)?cex\.[\w.-]+([/?#].*)?$/
// @include           /^https:\/\/([\w-]+\.)?changelly\.[\w.-]+([/?#].*)?$/
// @include           /^https:\/\/([\w-]+\.)?kucoin\.[\w.-]+([/?#].*)?$/
// @include           /^https:\/\/([\w-]+\.)?paxful\.[\w.-]+([/?#].*)?$/
// @include           /^https:\/\/([\w-]+\.)?htx\.[\w.-]+([/?#].*)?$/
// @include           /^https:\/\/([\w-]+\.)?mexc\.[\w.-]+([/?#].*)?$/
// @include           /^https:\/\/([\w-]+\.)?coinmama\.[\w.-]+([/?#].*)?$/
// @include           /^https:\/\/([\w-]+\.)?gate\.[\w.-]+([/?#].*)?$/
// @include           /^https:\/\/([\w-]+\.)?bitget\.[\w.-]+([/?#].*)?$/
// @include           /^https:\/\/([\w-]+\.)?freebitco\.[\w.-]+([/?#].*)?$/
// @include           /^https:\/\/([\w-]+\.)?bybit\.[\w.-]+([/?#].*)?$/
// @include           /^https:\/\/([\w-]+\.)?crypto\.[\w.-]+([/?#].*)?$/
// @include           /^https:\/\/([\w-]+\.)?okx\.[\w.-]+([/?#].*)?$/
// @include           /^https:\/\/([\w-]+\.)?coinbase\.[\w.-]+([/?#].*)?$/
// @include           /^https:\/\/([\w-]+\.)?binance\.[\w.-]+([/?#].*)?$/
// @include           /^https:\/\/([\w-]+\.)?wazirx\.[\w.-]+([/?#].*)?$/
// @include           /^https:\/\/([\w-]+\.)?coindcx\.[\w.-]+([/?#].*)?$/
// @include           /^https:\/\/([\w-]+\.)?zebpay\.[\w.-]+([/?#].*)?$/
// @include           /^https:\/\/([\w-]+\.)?bitbns\.[\w.-]+([/?#].*)?$/
// @include           /^https:\/\/([\w-]+\.)?cloudways\.[\w.-]+([/?#].*)?$/
// @include           /^https:\/\/([\w-]+\.)?getresponse\.[\w.-]+([/?#].*)?$/
// @include           /^https:\/\/([\w-]+\.)?bandwagonhost\.[\w.-]+([/?#].*)?$/
// @include           /^https:\/\/([\w-]+\.)?moosend\.[\w.-]+([/?#].*)?$/
// @include           /^https:\/\/([\w-]+\.)?domainracer\.[\w.-]+([/?#].*)?$/
// @include           /^https:\/\/([\w-]+\.)?namesilo\.[\w.-]+([/?#].*)?$/
// @include           /^https:\/\/([\w-]+\.)?digitalocean\.[\w.-]+([/?#].*)?$/
// @include           /^https:\/\/([\w-]+\.)?virmach\.[\w.-]+([/?#].*)?$/
// @include           /^https:\/\/([\w-]+\.)?vultr\.[\w.-]+([/?#].*)?$/
// @include           /^https:\/\/([\w-]+\.)?hostwinds\.[\w.-]+([/?#].*)?$/
// @include           /^https:\/\/([\w-]+\.)?west\.[\w.-]+([/?#].*)?$/
// @include           /^https:\/\/([\w-]+\.)?ucloud\.[\w.-]+([/?#].*)?$/
// @include           /^https:\/\/([\w-]+\.)?wps\.[\w.-]+([/?#].*)?$/
// @exclude           *://jianghu.taobao.com/*
// @exclude           *://login.taobao.com/*
// @exclude           *://uland.taobao.com/*
// @exclude           *://map.taobao.com/*
// @exclude           *://creator.guanghe.taobao.com/*
// @exclude           *://myseller.taobao.com/*
// @exclude           *://qn.taobao.com/*
// @exclude           *://jingfen.jd.com/*
// @exclude           *://passport.jd.com/*
// @exclude           *://jmw.jd.com/*
// @exclude           *://passport.shop.jd.com/*
// @exclude           *://passport.vip.com/*
// @exclude           *://huodong.taobao.com/wow/z/guang/gg_publish/*
// @exclude           *://passport.suning.com/*
// @connect           shuqiandiqiu.com
// @connect           staticj.top
// @connect           mimixiaoke.com
// @grant             GM_openInTab
// @grant             GM.openInTab
// @grant             GM_getValue
// @grant             GM.getValue
// @grant             GM_setValue
// @grant             GM.setValue
// @grant             GM_addStyle
// @grant             GM_xmlhttpRequest
// @grant             GM.xmlHttpRequest
// @grant             GM_registerMenuCommand
// @license           AGPL License
// @antifeature  	  referral-link 【此提示为GreasyFork代码规范要求含有查券功能的脚本必须添加，请知悉！】
// @charset		      UTF-8
// @noframes
// @run-at            document-idle
// @downloadURL https://update.greasyfork.org/scripts/390952/%E7%BD%91%E8%B4%AD%E6%9F%A5%E5%88%B8%E5%8A%A9%E6%89%8B%EF%BC%8C%E8%87%AA%E5%8A%A8%E6%9F%A5%E8%AF%A2%E6%B7%98%E5%AE%9D%E3%80%81%E5%A4%A9%E7%8C%AB%E3%80%81%E4%BA%AC%E4%B8%9C%E7%AD%89%E9%9A%90%E8%97%8F%E7%9A%84%E5%A4%A7%E9%A2%9D%E4%BC%98%E6%83%A0%E5%88%B8%E5%92%8C%E4%BC%98%E6%83%A0%E6%B4%BB%E5%8A%A8%EF%BC%8C%E4%B8%8D%E8%8A%B1%E5%86%A4%E6%9E%89%E9%92%B1%E3%80%82%E8%84%9A%E6%9C%AC%E6%8C%81%E7%BB%AD%E7%BB%B4%E6%8A%A4%E6%9B%B4%E6%96%B0~.user.js
// @updateURL https://update.greasyfork.org/scripts/390952/%E7%BD%91%E8%B4%AD%E6%9F%A5%E5%88%B8%E5%8A%A9%E6%89%8B%EF%BC%8C%E8%87%AA%E5%8A%A8%E6%9F%A5%E8%AF%A2%E6%B7%98%E5%AE%9D%E3%80%81%E5%A4%A9%E7%8C%AB%E3%80%81%E4%BA%AC%E4%B8%9C%E7%AD%89%E9%9A%90%E8%97%8F%E7%9A%84%E5%A4%A7%E9%A2%9D%E4%BC%98%E6%83%A0%E5%88%B8%E5%92%8C%E4%BC%98%E6%83%A0%E6%B4%BB%E5%8A%A8%EF%BC%8C%E4%B8%8D%E8%8A%B1%E5%86%A4%E6%9E%89%E9%92%B1%E3%80%82%E8%84%9A%E6%9C%AC%E6%8C%81%E7%BB%AD%E7%BB%B4%E6%8A%A4%E6%9B%B4%E6%96%B0~.meta.js
// ==/UserScript==

(function() {
	'use strict';
	
	/**
	 * AGPL 协议全称为 GNU Affero General Public License（GNU Affero 通用公共许可证），它是一种自由软件许可证。
	 * AGPL 协议的主要特点是在传统的开源软件许可证（如 GPL）的基础上，加强了对软件在网络环境中使用的限制。
	 * GPL 是 GNU General Public License（GNU 通用公共许可证）的缩写，本脚本遵循AGPL协议！满足其开源原则、Copyleft原则、附带源代码、允许收费等原则
	 * 
	 * 脚本中部分工具类搜索自互联网，并没有明确的出处。因此在此说明！如有侵权请留言告知！以上~
	 * 领券部分源码借鉴自：https://github.com/huahuacatTX/greasyfork/blob/main/pro_huahuacat_union.js
	 * 特此声明！
	 */
	
	const Tools={
		getParamterBySuffix:function(url=window.location.href, suffix="html"){
			if(url.indexOf("?")!=-1){
				url = url.split("?")[0];
			}
			if(url.indexOf("#")!=-1){
				url = url.split("#")[0];
			}
			var splitText = url.split("/");
			var idText = splitText[splitText.length-1];
			idText = idText.replace(".html","");
			return idText;
		},
		getParamterBySearch:function(paramsString=window.location.href, tag){
			if(paramsString.indexOf("?")!=-1){
				paramsString = paramsString.split('?')[1]; // Extract the query string
			}
			const params = new URLSearchParams(paramsString);
			return params.get(tag);
		},
		request:function(method, url, param, isCrossOrigin=false){
			if(isCrossOrigin){
				return this.crossRequest(method, url, param);
			}else{
				return this.gmRequest(method, url, param);
			}
		},
		gmRequest:function(method, url, param){
			if(method.toUpperCase()==="GET"){
				param = null;
			}
			return new Promise(function(resolve, reject){
				GM_xmlhttpRequest({
					url: url,
					method: method,
					data:param,
					onload: function(response) {
						var status = response.status;
						if(status==200||status=='200'){
							var responseText = response.responseText;
							resolve({"code":"ok", "result":responseText});
						}else{
							reject({"code":"exception", "result":null});
						}
					}
				});
			});
		},
		crossRequest:function(method, url, param) {
			if(!method){
				method = "get";
			}
			if(!url){
				return new Promise(function(resolve, reject){
					reject({"code":"exception", "result":null});
				});
			}
			if(!param){
				param = {};
			}
			method = method.toUpperCase();
		    let config = {
		        method: method
		    };
		    if (method === 'POST') {
		        config.headers['Content-Type'] = 'application/json';
		        config.body = JSON.stringify(param);
		    }
			return new Promise(function(resolve, reject){
				fetch(url, config).then(response => response.text()).then(text => {
					resolve({"code":"ok", "result":text});
				}).catch(error => {
					reject({"code":"exception", "result":null});
				});
			});
		},
		getElementAsync:function(selector, target=document.body, allowEmpty = true, delay=10, maxDelay=10 * 1000){
			return new Promise((resolve,reject) =>{
				if(selector.toUpperCase()=="BODY"){
					resolve(document.body);
					return;
				}
				if(selector.toUpperCase()=="HTML"){
					resolve(document.html);
					return;
				}
				let totalDelay = 0;
				let element = target.querySelector(selector);
				let result = allowEmpty ? !!element : (!!element && !!element.innerHTML);
				if(result){
					resolve(element);
					return;
				}
				const elementInterval = setInterval(()=>{
					if(totalDelay >= maxDelay){
						clearInterval(elementInterval);
						resolve(null);
						return;
					}
					element = target.querySelector(selector);
					result = allowEmpty ? !!element : (!!element && !!element.innerHTML);
					if(result){
						clearInterval(elementInterval);
						resolve(element);
					}else{
						totalDelay += delay;
					}
				}, delay);
			});
		},
		getLocalStorageValue:function(name, value=null) {
			let storageValue = value;
			if (typeof GM_getValue === "function") {
				storageValue = GM_getValue(name, value);
			} else if(typeof GM.setValue === "function"){
				storageValue = GM.getValue(name, value);
			}else{
				var arr = window.localStorage.getItem(name);
				if(arr != null){
					storageValue = arr
				}
			}
			return storageValue;
		},
		setLocalStorageValue:function(name, value){
			if (typeof GM_setValue === "function") {
				GM_setValue(name, value);
			} else if(typeof GM.setValue === "function"){
				GM.setValue(name, value);
			}else{
				window.localStorage.setItem(name, value)
			}
		},
		openInTab:function(url, options={"active":true, "insert":true, "setParent":true}){
			if (typeof GM_openInTab === "function") {
				GM_openInTab(url, options);
			} else {
				GM.openInTab(url, options);
			}
		},
		getPlatform:function(host = window.location.host){
			let platform = "";
			if(host.indexOf(".taobao.")!=-1 || host.indexOf(".liangxinyao.")!=-1){
				platform = "taobao";
			}else if(host.indexOf(".tmall.")!=-1){
				platform = "tmall";
			}else if(host.indexOf(".jd.")!=-1 || host.indexOf(".yiyaojd.")!=-1 || host.indexOf(".jkcsjd.")!=-1 || host.indexOf(".jingdonghealth.")!=-1){
				platform = "jd";
			}else if(host.indexOf(".vip.")!=-1 || host.indexOf(".vipglobal.")!=-1){
				platform = "vpinhui";
			}else if(host.indexOf(".suning.")!=-1){
				platform = "suning";
			}
			return platform;
		},
		suningParameter:function(url){
			const regex = /product\.suning\.com\/(\d+\/\d+)\.html/;
			const match = url.match(regex);
			if(match){
				return match[1].replace(/\//g, '-');
			}
			return null;
		}
	};
		
	const browsingHistoryLocalStorageKey = "browsing_history_local_storage_key";
	const discoverCoupon = {
		generateIsResult:true,
		isRun:function(){
			const currentHost = window.location.host;
			return ["detail.tmall.com", "item.taobao.com", "item.jd.com", "item.yiyaojd.com", "npcitem.jd.hk","detail.tmall.hk", "detail.vip.com", "item.jkcsjd.com", "product.suning.com", "item.jingdonghealth.cn"]
				.map((host)=>currentHost.indexOf(host)!=-1).some((result)=>result);
		},
		encodeTitle:function(title){
			if(!title){
				return "";
			}
			title = title.replace(/\t|\r/g,"");
			return encodeURIComponent(title);
		},
		getGoodsInfo:function(platform){	
			var goodsId = "";
			var goodsName = "";
			const href = window.location.href;
			if(platform=="taobao"){
				goodsId = Tools.getParamterBySearch(window.location.search, "id");
				try{
					const titleObj = document.querySelector("[class^='ItemTitle--']");
					if(!!titleObj){
						goodsName = titleObj.textContent;
					}
				}catch(e){}
				
			}else if(platform=="tmall"){
				goodsId = Tools.getParamterBySearch(window.location.search, "id");
				try{
					const titleObj = document.querySelector("[class^='ItemTitle--']");
					if(!!titleObj){
						goodsName = titleObj.textContent;
					}
				}catch(e){}
				
			}else if(platform=="jd"){
				goodsId = Tools.getParamterBySuffix(href);
				try{
					const titleObj = document.querySelector("[class='sku-name']");
					if(!!titleObj){
						goodsName = titleObj.textContent;
					}
				}catch(e){}
			}else if(platform=="vpinhui"){
				goodsId = Tools.getParamterBySuffix(href).replace("detail-","");
				const titleObj = document.querySelector("[class='pib-title-detail']");
				if(!!titleObj){
					goodsName = titleObj.textContent;
				}
			}else if(platform=="suning"){
				goodsId = Tools.suningParameter(href);
				try{
					const titleObj = document.querySelector("#itemDisplayName");;
					if(!!titleObj){
						goodsName = titleObj.textContent;
					}
				}catch(e){}
			}
			return {"goodsId":goodsId, "goodsName":this.encodeTitle(goodsName)};
		},
		browsingHistory:function(platform, goodsId){
			let histories = Tools.getLocalStorageValue(browsingHistoryLocalStorageKey, []);
			let saveContent = platform+"_"+goodsId;
			if(!histories.includes(saveContent)){
				histories.unshift(saveContent);
				Tools.setLocalStorageValue(browsingHistoryLocalStorageKey, histories.slice(0,60));
			}
		},
		getHandlerElement:async function(handler){
			const getElement = async (handler)=>{
				const promiseArray = [];
				const handlers = handler.split("@");
				for(let i=0; i<handlers.length; i++){
					const eleName = handlers[i];
					if(!eleName){
						continue;
					}
					if(eleName=="body"){
						promiseArray.push(
							new Promise((resolve,reject) =>{ resolve(document.body) }) 
						);
					}else if(eleName=="html"){
						promiseArray.push(
							new Promise((resolve,reject) =>{ resolve(document.html) }) 
						);
					}else{
						promiseArray.push(Tools.getElementAsync(eleName, document.body, true, 10, 1500));
					}
				}
				const element = await Promise.race(promiseArray);
				return element ? element : null;
			}
		
			const element = await getElement(handler);
			return new Promise((resolve,reject) =>{
				resolve(element);
			});
		},
		generateHtml:async function(platform, goodsId, goodsName){
			if(!platform || !goodsId){
				return "kong";
			}
			let addition = "";
			if(platform=="vpinhui"){
				const vip = goodsId.split("-");
				addition = vip[0];
				goodsId = vip[1];
			}
			
			this.browsingHistory(platform, goodsId);
			const goodsCouponUrl = "https://tt.shuqiandiqiu.com/api/coupon/query?no=4&version=1.0.2&platform="+platform+"&id="+goodsId+"&q="+goodsName+"&addition="+addition;
			try{
				const data = await Tools.request("GET", goodsCouponUrl, null, false);
				if(data.code=="ok" && !!data.result){
					const json = JSON.parse(data.result);
					await this.generateCoupon(platform, json.data);
					await this.generateQrcode(platform, json.mscan);
					//开启插入检测
					let heartms = 0;
					const HEART_DELAY = 1500, MAX_MS = 1000*30;  
					const generateResultInterval = setInterval(async ()=>{
						if(this.generateIsResult){
							if(document.querySelector("*[name='exist-llkbccxs-9246-hi']") || heartms>=MAX_MS){
								clearInterval(generateResultInterval);
							}else{
								await this.generateCoupon(platform, json.data);
							}
						}
						heartms += HEART_DELAY;
					}, HEART_DELAY);
				}
			}catch(e){console.log(e);}
		},
		generateCoupon:async function(platform, result){
			try{
				this.generateIsResult = false;
				if(!result || result==="null" || !result.hasOwnProperty("css") || !result.hasOwnProperty("html") || !result.hasOwnProperty("handler")){
					return;
				}
				
				const {css, html, handler, templateId} = result;
				if(!css || !html || !handler){
					return;
				}
				GM_addStyle(css);
			
				// 添加HTML, 需要动态检测元素
				const handlerElement = await this.getHandlerElement(handler);
				if(!handlerElement){
					return;
				}
				if(platform=="taobao"){
					handlerElement.parentNode.insertAdjacentHTML('afterend', html);
				}else if(platform=="tmall"){
					handlerElement.parentNode.insertAdjacentHTML('afterend', html);
				}else if(platform=="jd"){
					handlerElement.insertAdjacentHTML('afterend', html);
				}else if(platform=="vpinhui"){
					handlerElement.insertAdjacentHTML('afterend', html);
				}else if(platform=="suning"){
					handlerElement.insertAdjacentHTML('afterend', html);
				}
				
				const templateElement = document.querySelector("div[id='"+templateId+"']");
				if(!templateElement){
					return;
				}
				
				const couponId = templateElement.getAttribute("data-id");
				const goodsPrivateUrl = "https://tt.shuqiandiqiu.com/api/private/change/coupon?no=4&v=1.0.2&platform="+platform+"&id=";
				if(!/\d/.test(couponId)){
					return;
				}
				
				setInterval(()=>{
					templateElement.querySelectorAll("*").forEach((element)=>{
						element.removeAttribute("data-spm-anchor-id");
					});
				},400);
				
				const couponElementA = templateElement.querySelector("a[name='cpShUrl']"), clickedTag = "aclicked";
				if(couponElementA){
					couponElementA.addEventListener("click",()=>{
						event.stopPropagation();
						event.preventDefault();
						if(couponElementA.getAttribute(clickedTag)){
							return;
						}
						couponElementA.setAttribute(clickedTag, "true");
						const href = couponElementA.getAttribute("href");
						if(href && href.indexOf("https://")!=-1){
							Tools.openInTab(href);
							couponElementA.removeAttribute(clickedTag);
						}else{
							Tools.request("GET", goodsPrivateUrl+couponId, null, false).then((privateResultData)=>{
								if(privateResultData.code==="ok" && !!privateResultData.result){
									let url = JSON.parse(privateResultData.result).url;
									if(url){
										Tools.openInTab(url);
									}
								}
								couponElementA.removeAttribute(clickedTag);
							}).then(()=>{
								couponElementA.removeAttribute(clickedTag);
							});
						}
					});
				}
			
				const canvasElement = document.querySelector("#ca"+templateId);
				if(!canvasElement){
					return;
				}
				const qrcodeResultData = await Tools.request("GET", goodsPrivateUrl+couponId, null, false);
				if(!!qrcodeResultData && qrcodeResultData.code==="ok" && !!qrcodeResultData.result){
					let img = JSON.parse(qrcodeResultData.result).img;
					if(!!img){
						let cxt = canvasElement.getContext("2d");
						let imgData = new Image();
						imgData.src = img;
						imgData.onload=function(){
							cxt.drawImage(imgData, 0, 0, imgData.width, imgData.height);
						}
					}
				}
			}catch(e){
				console.log(e);
			}finally{
				this.generateIsResult = true;
			}
		},
		generateQrcode:async function(platform, mscan){
			if(!mscan || mscan==="null" || !mscan.hasOwnProperty("mount")
				|| !mscan.hasOwnProperty("html")|| !mscan.hasOwnProperty("qrcode")){
				return;
			}
			const {mount, html, qrcode, iden} = mscan;
			if(!!mount && !!html && !!qrcode && !!iden){
				const mountElement = await Tools.getElementAsync(mount, document.body, true, 10, 1500);
				if(mountElement){
					mountElement.insertAdjacentHTML('afterend', html);
					let canvasElement = document.getElementById("mscan"+iden);
					let width = canvasElement.getAttribute("width");
					let height = canvasElement.getAttribute("height");
					let cxt = canvasElement.getContext("2d");
					let imgData = new Image();
					imgData.src = qrcode;
					imgData.onload=function(){
						cxt.drawImage(imgData, 0, 0, width, height);
					}
				}
			}
		},
		skuConstraints:function(platform){ //如果sku太多就折叠
			if(platform=="tmall" || platform=="taobao"){
				Tools.getElementAsync("[class='skuItemWrapper']", document.body, false, 10, 1500).then((skuItemWrapper)=>{
					if(skuItemWrapper != null){
						const { style } = skuItemWrapper;
						style.maxHeight = "400px";
						style.overflow = "auto";
					}
				}).catch(()=>{console.log(e);});
			}else if(platform=="jd"){
				const skuItemWrapper = document.querySelector("#choose-attrs");
				if(skuItemWrapper){
					const { style } = skuItemWrapper;
					style.maxHeight = "400px";
					style.overflow = "auto";
				}
			}
		},
		start:function(){
			if(!this.isRun()){
				return;
			}
			const platform = Tools.getPlatform();
			if(!platform){
				return;
			}
			this.skuConstraints(platform);
			const goodsData = this.getGoodsInfo(platform);
			this.generateHtml(platform, goodsData.goodsId, goodsData.goodsName);
		}
	};
	
	const couponSearch = {
		browsedHtml:`<div style="position:absolute;white-space: nowrap; top:7px;padding:2px 5px;font-size:11px;background-color:rgb(3,106,251);color:#FFF;z-index:9999999999;border-radius:20px;right:10px;"><b>已浏览</b></div>`,
		intervalIsRunComplete:true,
		getHistories:function(){
			return Tools.getLocalStorageValue(browsingHistoryLocalStorageKey, []);
		},
		isRun:function(){
			const visitHref = window.location.href;
			return [
				/^https:\/\/www\.taobao\.com(\/|\/\?)?/i,//淘宝首页
				/^https:\/\/s\.taobao\.com/i,
				/^https:\/\/shop(\d+)\.taobao\.com/i, 
				/^https:\/\/www\.tmall\.com(\/|\/\?)?/i,//天猫首页
				/pages\.tmall\.com/i,
				/list\.tmall\.com/i,
				/list\.tmall\.hk/i,
				/tmall\.com\/category/i,
				/tmall\.com\/search/i,
				/tmall\.com\/shop/i,
				/tmall\.com\/\?q=/i,
				/maiyao\.liangxinyao\.com/i,
				/^https:\/\/www\.jd\.com(\/|\/\?)?/i, //京东主页
				/search\.jd\.com/i,
				/search\.jd\.hk/i,
				/pro\.jd\.com\/mall/i,
				/jd\.com\/view_search/i, //商店主页
				/category\.vip\.com/i,
				/list\.vip\.com/i,
				/^https:\/\/(?!product|dfp\.)([^\/]+)\.suning\.com\//i
			].map((reg)=>(new RegExp(reg)).test(visitHref)).some((res)=>res);
		},
		requestConf:function(){
			return new Promise((resolve, reject) => {
				Tools.request("GET", "https://tt.shuqiandiqiu.com/api/plugin/load/conf", null, true).then((data)=>{
					if(data.code=="ok" && !!data.result){
						resolve(data.result);
					}else{
						resolve(null);
					}
				});
			});
		},
		pickupElements:function(confString, platform){ //收集列表的元素
			const visitHref = window.location.href;
			const selectorElementList = new Array();
			let confFilter = confString;
			try{
				confFilter = confFilter.replace(/\\\\/g,"\\");
			}catch(e){}
			const confJson = JSON.parse(confFilter);
			
			if(confJson.hasOwnProperty(platform)){
				const platformConfJson = confJson[platform];
				for(let i=0; i<platformConfJson.length; i++){
					const itemJson = platformConfJson[i];
					if(!itemJson.hasOwnProperty("elements") || !itemJson.hasOwnProperty("matches")){
						continue;
					}
					const {elements, matches} = itemJson;
					const isMatch = matches.map((reg)=>(new RegExp(reg, "i")).test(visitHref)).some((res)=>res);
					if(isMatch){
						for(let j=0; j<elements.length; j++){
							selectorElementList.push({
								"element":elements[j]["element"],
								"findA":elements[j]["findA"],
								"page":elements[j]["page"],
								"extra":elements[j]["extra"]
							});
						}
					}
				}
			}
			return selectorElementList;
		},
		transformElements:function(selectors){
			const items = [];
			selectors.forEach((elementObj)=>{
				if(elementObj.element){
					const elements = document.querySelectorAll(elementObj.element + ":not([querycxll='true'])");
					elements.forEach((element)=>{
						if(element){
							items.push({"element":element, "findA": elementObj.findA, "extra":elementObj.extra, "page":elementObj.page});
						}
					});
				}
			});
			if(items.length>0){
				this.queryAll(items);
			}
		},
		queryAll:function(items){
			this.intervalIsRunComplete = false;
			const promises = [];
			const histories = this.getHistories();
			this.processLinksInBatches(items, 18, histories).then((result)=>{
				this.intervalIsRunComplete = true;
			});
		},
		processLinksInBatches: async function(items, batchSize, histories) {
		    const results = [];
		    for (let i = 0; i < items.length; i += batchSize) {
		        const batch = items.slice(i, i + batchSize); // 获取当前批次的链接
		        const batchResults = await Promise.all(  // 同时处理当前批次中的所有请求
		            batch.map(item => this.queryOne(item, histories))
		        );
		        results.push(...batchResults); // 保存批次结果
		    }
		    return results; // 返回所有结果
		},
		getAnchorElement:function(element,findA){
			let finalElement = null;
			if(findA==="this"){
				finalElement = element;
			}else{
				finalElement = element.querySelector(findA.replace(/^child@/,""));
			}
			return finalElement;
		},
		queryOne:function(item, histories){
			const { element, page, findA, extra} = item;
			const self = this;
			return new Promise(function(resolve, reject){
				if(element.getAttribute("querycxll")){  //当存在时，说明已经处理过了
					resolve("processed");
					return;
				}
				element.setAttribute("querycxll", "true");
				element.style.position = "relative";
				element.addEventListener("click", function(e){
					element.insertAdjacentHTML('beforeend', self.browsedHtml);
				});
				
				const finalElement = self.getAnchorElement(element, findA);
				if(!finalElement){
					resolve("exception-element-null");
					return;
				}

				let goodsDetailUrl = null;
				let isAnchorA = true;
				if(extra){//说明锚点不是A标签
					const {durl,attribute} = extra;
					let attributeValue = finalElement.getAttribute(attribute);
					if(attributeValue){
						goodsDetailUrl = durl.replace("@",attributeValue);
						isAnchorA = false;
					}
				}else{
					goodsDetailUrl = finalElement.getAttribute("href");
				}	
				if(!goodsDetailUrl){
					resolve("exception-url-null");
					return;
				}
				
				let analysisData = null;
				if(/^jd_/.test(page)){
					let jdId = Tools.getParamterBySuffix(goodsDetailUrl);
					if(!!jdId) analysisData = {"id":jdId, "platform":"jd"};
				}else if(/^vpinhui_/.test(page)){
					let vipId = Tools.getParamterBySuffix(goodsDetailUrl).replace("detail-","");
					if(!!vipId){
						analysisData = {"id":vipId.split("-")[1], "platform":"vpinhui"};
					}
				}else if(/suning_/.test(page)){
					let suningId = Tools.suningParameter(goodsDetailUrl);
					if(!!suningId){
						analysisData = {"id":suningId, "platform":"suning"};
					}
				}else{
					let platform = Tools.getPlatform(goodsDetailUrl);
					let id = Tools.getParamterBySearch(goodsDetailUrl, "id");
					if(platform && id){
						analysisData = {"id":id, "platform":platform};
					}
				}
				if(!analysisData){
					resolve("exception-data-null");
					return;
				}
				
				if(histories.includes(analysisData.platform + "_" + analysisData.id)){
					element.insertAdjacentHTML('beforeend', self.browsedHtml);
				}
				
				const searchUrl = "https://tt.shuqiandiqiu.com/api/ebusiness/q/c?p="+analysisData.platform+"&id="+analysisData.id+"&no=4";
				Tools.request("GET", searchUrl, null, true).then((data)=>{
					if(data.code=="ok" && !!data.result){
						const {id, tip, encryptLink} = JSON.parse(data.result);
						if(tip){
							//console.log("coupon exist", id);
							element.insertAdjacentHTML('beforeend', tip);
						}
						if(encryptLink){
							//console.log("jood job!", id);
							let decryptUrl = null;
							try{
								const decryptLink = atob(encryptLink);
								decryptUrl = decryptLink.split('').reverse().join('');
							}catch(e){}
							if(decryptUrl){
								if(isAnchorA){
									self.relativeAnchorAJu(page, element, decryptUrl);
								}else{
									self.relativeJu(element, decryptUrl);
								}
							}
						}
					}
					resolve("success");
				}).catch(()=>{
					resolve("error");
				});
			});
		},
		relativeJu:function(element, decryptUrl){
			element.addEventListener("click", function(e){
				e.preventDefault();
				e.stopPropagation();
				Tools.openInTab(decryptUrl);
			});
		},
		relativeAnchorAJu:function(page, element, decryptUrl){
			const self = this;
			try{
				if(page.indexOf("jd_")!=-1){
					element.querySelectorAll("a").forEach((element_a)=>{
						const href = element_a.getAttribute("href");
						if(/item\.jd|npcitem\.jd/.test(href)){
							element_a.removeAttribute(onclick);
							element_a.addEventListener("click", function(e){
								e.preventDefault();
								e.stopPropagation();
								Tools.openInTab(decryptUrl);
							});
						}
					});
				}
				else if(page.indexOf("taobao_")!=-1 || page.indexOf("tmall_")!=-1){
					element.addEventListener("click", function(e){
						const target = e.target
						const tagName = target.tagName.toUpperCase();
						let isPreventDefault = false;
						if(tagName==="A"){ //只有点击A标签才去判断
							const href = target.getAttribute("href");
							const isDetail = [/detail\.tmall\.com\/item\.htm/, /item\.taobao\.com\/item\.htm/]
								.map((reg)=> reg.test(href))
								.some((result) => result);
							if(isDetail){
								isPreventDefault = true;
							}
						}else{
							isPreventDefault = true;
						}
						if(isPreventDefault){
							e.preventDefault();
							e.stopPropagation();
							Tools.openInTab(decryptUrl);
						}	
					});
				}
				else if(page.indexOf("vpinhui_")!=-1){
					element.querySelectorAll("a").forEach((element_a)=>{
						const href = element_a.getAttribute("href");
						if(href && href.indexOf("detail.vip.com/detail-")!=-1){
							element_a.addEventListener("click", function(e){
								e.preventDefault();
								e.stopPropagation();
								Tools.openInTab(decryptUrl);
							});
						}
					});
				}
				else if(page.indexOf("suning_")!=-1){
					element.querySelectorAll("a").forEach((element_a)=>{
						const href = element_a.getAttribute("href");
						if(href && href.indexOf("product.suning.com")!=-1){
							element_a.addEventListener("click", function(e){
								e.preventDefault();
								e.stopPropagation();
								Tools.openInTab(decryptUrl);
							});
						}
					});
				}
			}catch(e){
				console.log(e);
			}
		},
		start:function(){
			if(this.isRun()){
				const platform = Tools.getPlatform();
				this.requestConf().then((confString)=>{
					const selectors = this.pickupElements(confString, (platform=="tmall"? "taobao" : platform));
					if(this.intervalIsRunComplete){
						this.transformElements(selectors);
					}
					setInterval(()=>{
						if(this.intervalIsRunComplete){
							this.transformElements(selectors);
						}
					}, 1500);
				});
			}
		}
	};
	
	const overseaNavigation = {
		request:function(mothed, url, param){   //网络请求
			return new Promise(function(resolve, reject){
				GM_xmlhttpRequest({
					url: url,
					method: mothed,
					data:param,
					onload: function(response) {
						var status = response.status;
						var playurl = "";
						if(status==200||status=='200'){
							var responseText = response.responseText;
							resolve({"result":"success", "responseText":responseText});
						}else{
							reject({"result":"error", "responseText":null});
						}
					}
				});
			})
		},
		isRun: function(origin) {
		  const host = window.location.host;
		  const regexGroups = {
			  isRunServer: [
				  /cloudways\.com/, /getresponse\.com/, /bandwagonhost\.com/,
				  /moosend\.com/, /domainracer\.com/, /namesilo\.com/, /digitalocean\.com/, /virmach\.com/,
				  /vultr\.com/, /hostwinds\.com/, /west\.cn/, /ucloud\.cn/
			  ],
			  isRunEncrypto: [
				  /changelly\.com/, /bybit\.com/, /gate\.io/, /gate\.com/, /kucoin\.com/, /coinmama\.com/,
				  /cex\.io/, /paxful\.com/, /htx\.com/, /mexc\.com/, /bitget\.com/, /freebitco\.in/, /crypto\.com/,
				  /okx\.com/, /coinbase\.com/, /binance\.com/, /wazirx\.com/, /coindcx\.com/, /zebpay\.com/, /bitbns\.com/
			  ],
			  isRunAffi: [
				  /wps\.com/
			  ]
		  };
		  const result = { isRunServer: false, isRunEncrypto: false, isRunAffi: false };
		  for (const [key, regexs] of Object.entries(regexGroups)) {
			  if (regexs.some(regex => regex.test(host))) {
				  result[key] = true;
				  break;
			  }
		  }
		  return result;
		},
		addParamToURL:function(url, track) {
			const [baseUrl, hash] = url.split('#'); // 分离#部分
			const separator = baseUrl.includes('?') ? '&' : '?'; // 确定?或&
			const newUrl = `${baseUrl}${separator}${track}`;
			return hash ? `${newUrl}#${hash}` : newUrl;
		},
		temporary:function(platform){
			const anchorRun=()=>{
				document.querySelectorAll('a:not([anchor="true"])').forEach((element,index)=>{
					var href = element.getAttribute("href");
					element.setAttribute("anchor","true");
					element.setAttribute("anchor-url",href);
					if(href && href.indexOf("javascript:")==-1 && href.indexOf(platform.track)==-1){
						element.setAttribute("rel", "noreferrer nofollow");
						href = this.addParamToURL(href, platform.track);
						element.setAttribute("href", href);
						element.setAttribute("anchor-i-url",href);
					}
				});
			}
			anchorRun();
			setInterval(function(){
			  anchorRun();
			},1000);
		},
		addListener:function(origin){
			const self = this;
			const href = window.location.href;
			var url = "https://oversea.mimixiaoke.com/api/discover/"+origin;
			self.request("post", url, null).then((data)=>{
				if(data.result=="success" && !!data.responseText){
					const { platforms } = JSON.parse(data.responseText).data;
					let platform = null;
					for(let i=0; i<platforms.length; i++){
						if((new RegExp(platforms[i].match.replace(/\\\\/g,"\\"), "i")).test(href)){
							platform = platforms[i];
							break;
						}
					}
					if(platform){
						const storageKey = "__anchor__"+window.location.host;
						if(platform.support_append || !!sessionStorage.getItem(storageKey)){
							self.temporary(platform);
						}else{
							const pathname = window.location.pathname;
							const targets = platform.targets;
							if(targets){
								for(let i=0; i<targets.length; i++){
									if((new RegExp(targets[i].match.replace(/\\\\/g,"\\"), "i")).test(pathname)){
										sessionStorage.setItem(storageKey, "true");
										window.location.href = platform.promo_link;
										break;
									}
								}
							}
						}
	        }
				}
			}).catch((error)=>{
				console.log(error);
			});
		},
		start:function(){
			const {isRunServer, isRunEncrypto, isRunAffi} = this.isRun();
			let origin = null;
			if(isRunServer){
				origin = "server";
			}
			if(isRunEncrypto){
				origin = "encrypto";
			}
			if(isRunAffi){
				origin = "affi";
			}
			if(origin){
				this.addListener(origin);
			}
		}
	};
	
	function ServerNavigation(){
		this.allowHosts = ["tencent.com","aliyun.com","huaweicloud.com","bandwagonhost.com","hostwinds.com"];
		this.number = Math.ceil(Math.random()*100000000);
		this.containerHight = 150;
		this.GMopenInTab = function(url, options={"active":true, "insert":true, "setParent":true}){
			if (typeof GM_openInTab === "function") {
				GM_openInTab(url, options);
			} else {
				GM.openInTab(url, options);
			}
		};
		this.addStyle = function(css){
			GM_addStyle(css);
		};
		this.serverMenu = function(){
			var isOpenServer = GM_getValue("server_navigation_key", true);
			GM_registerMenuCommand("服务器导航设置",()=>{
				var person = prompt("是否开启服务器导航功能？请填写yes或者no....", isOpenServer ? "yes" : "no");
			  if(person==null||person==undefined){
				return;
			  }
			  var validate = person==="no"||person==="NO"||person==="yes"|| person==="YES";
			  if(validate) GM_setValue("server_navigation_key", (person==="yes"|| person==="YES"));
	
			  var toastMessage = "开启服务器导航功能";
				if(person==="yes"|| person==="YES"){
				toastMessage = "开启服务器导航功能";
			  }else if(person==="no"|| person==="NO"){
				toastMessage = "关闭服务器导航功能";
			  }else{
				toastMessage = "参数错误，只能填写yes或者no";
			  }
			  toast.show({"message":toastMessage, "background":"#474747"});
			  //只有验证通过后，才会刷新页面
			  if(validate){
				setTimeout(function(){
				  location.reload();
				},1000);
			  }
			});
		};
		this.request = function(mothed, url, param){   //网络请求
			return new Promise(function(resolve, reject){
				GM_xmlhttpRequest({
					url: url,
					method: mothed,
					data:param,
					onload: function(response) {
						var status = response.status;
						var playurl = "";
						if(status==200||status=='200'){
							var responseText = response.responseText;
							resolve({"result":"success", "responseText":responseText});
						}else{
							reject({"result":"error", "responseText":null});
						}
					}
				});
			})
		};
		this.isRun = function(){
			const host = window.location.host;
			for(let i=0;i<this.allowHosts.length;i++){
				if(host.indexOf(this.allowHosts[i])!=-1){
					return true;
				}
			}
			return false;
		};
		this.temporary=function(track,rules){
			const pathname = window.location.pathname;
			const {matches, filter} = rules;
			const isMatch = matches.some(pattern => {
				const regex = new RegExp(pattern.replace(/\\\\/g, "\\"));
				return regex.test(pathname);
			});
			if(isMatch){
				const anchorRun=()=>{
					const {open, keywords} = filter;
					var num = 0;
					document.querySelectorAll("a").forEach(function(element,index){
					  var href = element.getAttribute("href");
					  if(!href || (element.getAttribute("anchor-i") && element.getAttribute("anchor-i-url")===href)){
						return;
					  }
					  element.setAttribute("anchor-i","true");
					  element.setAttribute("anchor-i-url",href);
					  let textContent = "";
					  for(let node of element.childNodes){
						if(node.nodeType === Node.TEXT_NODE || (node.nodeType === Node.ELEMENT_NODE && node.tagName!== 'A')) {
						  textContent += node.textContent;
						}
					  }
					  textContent = textContent.replace(/\n|\t|\s/g, "");
					  const result = !open || keywords.some(item => textContent.includes(item));
					  if(result){
						if(href.indexOf(track)!=-1) return;
						element.setAttribute("rel", "noreferrer nofollow");
						href = href + (href.indexOf("?")!=-1 ? "&" : "?") + track;
	
						element.removeAttribute("data-spm");
						element.removeAttribute("data-spm-anchor-id");
						element.removeAttribute("data-tracker-scm");
	
						element.setAttribute("href", href);
						element.setAttribute("anchor-i-url",href);
						num++;
					  }
					});
				}
				anchorRun();
				setInterval(function(){
				  anchorRun();
				},1000);
			}
		};
		this.generateHtml=function(html){
			if(!html){
				return;
			}
			const number = this.number;
			const containerHight = this.containerHight;
			var css=`
				#server-containerx`+number+`{
					display: block;
					bottom: -`+containerHight+`px;
					clear: none !important;
					float: none !important;
					left: 50%;
					margin: 0px !important;
					max-height: none !important;
					max-width: none !important;
					opacity: 1;
					overflow: visible !important;
					padding: 0px !important;
					position: fixed;
					right: auto !important;
					top: auto !important;
					vertical-align: baseline !important;
					visibility: visible !important;
					z-index: 2147483647;
					background: rgb(250, 250, 250) !important;
					transition-duration:0.8s!important;
					-webkit-transition-duration:0.8s!important;
					transform:translateX(-50%);
					width: 60% !important;
					height: `+containerHight+`px !important;
					max-width:700px!important;
					box-sizing: border-box!important;
					box-shadow: rgba(0, 0, 0, 0.2) 0px -1px 5px -1px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px !important;
				}
				#server-containerx`+number+`:hover{
					-webkit-box-shadow: 0 4px 12px rgba(0,0,0,.08);
					box-shadow: 0 4px 12px rgba(0,0,0,.08);
				}
				#server-container-decoration`+number+`{
					inset: auto !important;
					clear: none !important;
					display: block !important;
					float: none !important;
					height: 5px !important;
					margin: 0px !important;
					max-height: none !important;
					max-width: none !important;
					opacity: 1 !important;
					overflow: visible !important;
					padding: 0px !important;
					position: relative !important;
					vertical-align: baseline !important;
					visibility: visible !important;
					width: auto !important;
					z-index: 1 !important;
					background-color: #e4eaf6 !important;
					box-shadow: rgba(0, 0, 0, 0.2) 0px -1px 5px -1px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px !important;
				}
				#server-container-expand`+number+`{
					cursor:pointer;
					position:absolute;
					width:50px;
					height:30px;
					background-color: #e4eaf6;
					top:-30px;
					left:50%;
					transform:translateX(-50%);
					border-radius: 5px 5px 0px 0px;
				}
				#server-container-expand`+number+`:hover{
	
				}
				#server-container-expand`+number+`>svg{
					width:50px;
					height:30px;
				}
				#server-container-expand`+number+`>svg:hover{
					transition: 0.6s;
					transform: scale(1.1);
				}
				.server-container-column9980x{
					position:relative;
				}
				.server-container-column9980x:not(:last-child):after{
					position: absolute;
					height: calc(100% - 4em);
					right: 0px;
					content: '';
					width: 0px;
					border-left: solid #e6e7eb 2px;
					top: 50%;
					transform: translateY(-50%);
				}
				#server-container-body`+number+`{
					width:100%;
					height:100%;
				}
			`;
			var html=`
				<div id="server-containerx`+number+`">
					<div id="server-container-decoration`+number+`">
						<div id="server-container-expand`+number+`">
							<svg t="1719906770072" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4303" width="256" height="256"><path d="M444 136.3L123.8 324.8l3.2 371.5 323.3 183 320.2-188.5-3.2-371.5z" fill="#FFFFFF" p-id="4304"></path><path d="M630 287.6l-20.1-11.4-279.7 164.7L333 767l20.1 11.3-2.8-326z" fill="#06F3FF" p-id="4305"></path><path d="M746.8 489.8l-8.6 5.2c-4.7 2.9-6.2 9-3.4 13.7 1.9 3.1 5.2 4.8 8.6 4.8 1.8 0 3.5-0.5 5.2-1.4l8.6-5.2c4.7-2.9 6.2-9 3.4-13.7-2.9-4.7-9-6.2-13.8-3.4z" fill="#005BFF" p-id="4306"></path><path d="M638.6 534c-1.6-0.9-3.4-1.3-5.2-1.3-4.9 0-9.9 2.6-13 4.6-20.6 13-38 47.5-38 75.2 0 12.2 3.4 21.4 9.1 24.5 6 3.3 14-0.6 18.2-3.3 20.6-13 38-47.5 38-75.2 0-12.2-3.4-21.3-9.1-24.5z m-9.9 50.4l-8.6 5.2c-1.6 1-3.4 1.4-5.2 1.4-3.4 0-6.7-1.7-8.6-4.8-2.9-4.7-1.3-10.9 3.4-13.7l8.6-5.2c4.7-2.9 10.9-1.3 13.7 3.4 3 4.7 1.5 10.9-3.3 13.7z" fill="#E6E6E6" p-id="4307"></path><path d="M618.4 567.3l-8.6 5.2c-4.7 2.9-6.2 9-3.4 13.7 1.9 3.1 5.2 4.8 8.6 4.8 1.8 0 3.5-0.5 5.2-1.4l8.6-5.2c4.7-2.9 6.2-9 3.4-13.7-2.9-4.7-9.1-6.3-13.8-3.4z" fill="#E6E6E6" p-id="4308"></path><path d="M444 136.3L123.8 324.8l3.2 371.5 323.3 183 320.1-188.5-3.2-371.5-323.2-183zM166.8 672.9L164 347.6l280.3-165.1 71.2 40.3-280.3 165.1 2.8 325.3-71.2-40.3z m262.8 148.7l-76.5-43.3L333 767l-74.9-42.4-2.8-325.3 280.4-165.1 74.2 42 20.1 11.4 77.8 44-281 165.5 2.8 324.5z m40 0L467 519.8l260.7-153.5 2.6 301.7-260.7 153.6z m287.6-314.7l-8.6 5.2c-1.6 1-3.4 1.4-5.2 1.4-3.4 0-6.7-1.7-8.6-4.8-2.9-4.7-1.3-10.9 3.4-13.7l8.6-5.2c4.7-2.9 10.9-1.3 13.7 3.4 2.9 4.7 1.4 10.9-3.3 13.7z" fill="#005BFF" p-id="4309"></path><path d="M704 515.6l-8.6 5.2c-4.7 2.9-6.2 9-3.4 13.7 1.9 3.1 5.2 4.8 8.6 4.8 1.8 0 3.5-0.5 5.2-1.4l8.6-5.2c4.7-2.9 6.2-9 3.4-13.7-2.9-4.7-9-6.2-13.8-3.4zM827.2 430.8c-5.5 0-10 4.5-10 10v10c0 5.5 4.5 10 10 10s10-4.5 10-10v-10c0-5.5-4.5-10-10-10zM837.2 390.8c0-5.5-4.5-10-10-10s-10 4.5-10 10v10c0 5.5 4.5 10 10 10s10-4.5 10-10v-10zM837.2 340.8c0-5.5-4.5-10-10-10s-10 4.5-10 10v10c0 5.5 4.5 10 10 10s10-4.5 10-10v-10zM837.2 290.8c0-5.5-4.5-10-10-10s-10 4.5-10 10v10c0 5.5 4.5 10 10 10s10-4.5 10-10v-10zM803.4 467.4c-2.9-4.7-9-6.3-13.7-3.4l-8.6 5.2c-4.7 2.9-6.2 9-3.4 13.7 1.9 3.1 5.2 4.8 8.6 4.8 1.8 0 3.5-0.5 5.2-1.4l8.6-5.2c4.6-2.9 6.1-9 3.3-13.7zM665.3 540.1c-3-10.8-8.9-19.1-17.1-23.6-11.2-6.1-24.8-4.8-38.5 3.9-26.5 16.8-47.3 57.2-47.3 92.1 0 19.9 7.1 35.2 19.5 42 4.6 2.5 9.6 3.8 14.9 3.8 7.5 0 15.6-2.6 23.7-7.7 25.9-16.4 46.4-55.4 47.3-89.7l3.9-2.4c4.7-2.9 6.2-9 3.4-13.7-2.2-3.4-6.1-5.1-9.8-4.7z m-55.6 93.7c-4.2 2.7-12.2 6.6-18.2 3.3-5.7-3.1-9.1-12.3-9.1-24.5 0-27.7 17.4-62.2 38-75.2 3.1-1.9 8.1-4.6 13-4.6 1.8 0 3.6 0.4 5.2 1.3 5.7 3.1 9.1 12.3 9.1 24.5 0 27.7-17.4 62.1-38 75.2z" fill="#005BFF" p-id="4310"></path><path d="M891.2 321.7c-5.5 0-10 4.5-10 10v156.4l-81.7 49.3c-4.7 2.9-6.2 9-3.4 13.7 1.9 3.1 5.2 4.8 8.6 4.8 1.8 0 3.5-0.5 5.2-1.4l91.4-55.1V331.7c-0.1-5.5-4.6-10-10.1-10zM817.3 239.6c-0.1 0.4-0.1 0.8-0.1 1.3v10c0 5.5 4.5 10 10 10s10-4.5 10-10v-10c0-0.4 0-0.9-0.1-1.3 23.4-4.6 41-25.3 41-50 0-28.2-22.8-51-51-51s-51 22.8-51 51c0 24.7 17.7 45.4 41.2 50z" fill="#005BFF" p-id="4311"></path></svg>
						</div>
					</div>
					<div id="server-container-body`+number+`">`+html+`</div>
				</div>
			`;
	
			this.addStyle(css);
			document.body.insertAdjacentHTML("beforeend", html);
			
			const expandOrShow = (forceClose=false) =>{
				const serverContainerx = document.querySelector("#server-containerx"+number);
				var {bottom, height} = window.getComputedStyle(serverContainerx);
				if(bottom=="0px" || forceClose){
					bottom = "-"+height;
				}else{
					bottom = "0px";
				}
				serverContainerx.style.bottom = bottom;
			}
			
			document.querySelector("#server-container-expand"+number).addEventListener("click",function(){
				expandOrShow();
			});
			
			var lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
			const startContainer =()=>{
				setTimeout(function(){
					window.addEventListener("scroll", function () {
						var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
						if (scrollTop - lastScrollTop > 30) { //向下滚动
							expandOrShow(true);
						} else { //向上滚动
			
						}
						lastScrollTop = scrollTop;
					});
				}, 1500);
			}
			startContainer();
		};
		this.addEventListener=function(){
			const self = this;
			const number = this.number;
			const url = "https://server.staticj.top/api/server/discover?url="+encodeURIComponent(window.location.href)+"&no=4";
			self.request("get", url, null).then((data)=>{
				if(data.result=="success" && !!data.responseText){
					const {html, track, rules} = JSON.parse(data.responseText).data;
					self.generateHtml(html);
					self.temporary(track, rules);
				}
			}).catch((error)=>{
				console.log(error);
			});
		};
		this.start=function(){
			if(!this.isRun()){
				return;
			}
			this.serverMenu();
			const isOpenServer = GM_getValue("server_navigation_key", true);
			if(isOpenServer){
				this.addEventListener();
			}
		};
	}
	(new ServerNavigation()).start();
	overseaNavigation.start();
	
	if(discoverCoupon.isRun()||couponSearch.isRun()){
		discoverCoupon.start();
		couponSearch.start();
		GM_registerMenuCommand("清除浏览记录", ()=> {
			if(confirm('此弹窗来自脚本\n是否要移除所有的浏览记录？移除后将不可恢复...')){
				Tools.setLocalStorageValue(browsingHistoryLocalStorageKey,[]); //已浏览标识
			}
		});
	}
})();
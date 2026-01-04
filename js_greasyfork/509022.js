// ==UserScript==
// @name              自动查询淘宝、天猫、京东等隐藏的大额优惠券和优惠活动，不花冤枉钱。脚本持续维护更新~
// @name:zh           自动查询淘宝、天猫、京东等隐藏的大额优惠券和优惠活动，不花冤枉钱。脚本持续维护更新~
// @description       支持平台：京东、淘宝、天猫、天猫超市、天猫国际、京东国际、京东图书、京东大药房、阿里大药房、唯品会等；功能：1、搜索商品时会自动查询标注有优惠券和活动的商品，无需进入详情页，方便快捷；2、浏览商品详情页时脚本会自动查询商品是否有隐藏的优惠券；3、浏览记录标注（本地存储、可手动清空）；4、网页显示优化；脚本长期维护更新，非常好用~
// @description:zh    支持平台：京东、淘宝、天猫、天猫超市、天猫国际、京东国际、京东图书、京东大药房、阿里大药房、唯品会等；功能：1、搜索商品时会自动查询标注有优惠券和活动的商品，无需进入详情页，方便快捷；2、浏览商品详情页时脚本会自动查询商品是否有隐藏的优惠券；3、浏览记录标注（本地存储、可手动清空）；4、网页显示优化；脚本长期维护更新，非常好用~
// @icon		      data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAZ5JREFUWEfFl+GNwjAMhW0kjrEoO2QQmAA6AR2kO7SMdYdETg64SqM4Jkmh/Veomy8vfraLEFz3q2kA4Uw/W4Am/L/kHgHGh4Ubxe5O/cV/B/INL7zUohKotdD6EBPAX2dsye5KY9DCYXvqRwfwezUXfMle+sLcODqW7bE/4BqLMyypsC4AwIjfPvvAAXUAdI61rilWgOzEu9kg7EtBigEogSzC4AqWhbbURSIAyQsWWvJqzGJUuBiAPS099wBoJMAoQFitagCmStuZIXZM3wPwFJs5IWbDTyggFTwxBzSId3NAK/VJF2jJ9W4S8nOxXMoGuHdmoN6+oSL0siGBUqbTAvS77xyt12QBzGT3qqBfEUPV/JgsBbhdhkGpHUl5Q6pJlbLIhjEILWmzXJBKPlbEf6G2eMoJUQUk+WPHESadNBllKcANJpxgc8cuf+CVrKh2Q9eUKq9Uq1YBKtdWwzFlETW68gFSd1UAN8holapyk8lwB0BPrHEMXDueAMKw8Mnd/xx7t/b0baj17aVgwllzBsAQjmzBb8WplkSG3H9bTktqf/1yXgAAAABJRU5ErkJggg==
// @namespace         picasso310_haha_script_001
// @version           1.0.3
// @author            picasso310
// @match             *://*.taobao.com/*
// @match             *://*.tmall.com/*
// @match             *://*.tmall.hk/*
// @match             *://*.liangxinyao.com/*
// @match             *://chaoshi.detail.tmall.com/*
// @match             *://pages.tmall.com/wow/an/cs/search**
// @match             *://*.jd.com/*
// @match             *://*.jd.hk/*
// @match             *://item.jkcsjd.com/*
// @match             *://*.yiyaojd.com/*
// @match             *://www.vipglobal.hk
// @match             *://*.vip.com/*
// @match             *://detail.vip.com/detail-*
// @match             *://www.vipglobal.hk/detail-*
// @match             *://category.vip.com/suggest.php**
// @match             *://list.vip.com/*.html
// @match             *://*.suning.com/*
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
// @connect           tt.shuqiandiqiu.com
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
// @run-at            document-idle
// @downloadURL https://update.greasyfork.org/scripts/509022/%E8%87%AA%E5%8A%A8%E6%9F%A5%E8%AF%A2%E6%B7%98%E5%AE%9D%E3%80%81%E5%A4%A9%E7%8C%AB%E3%80%81%E4%BA%AC%E4%B8%9C%E7%AD%89%E9%9A%90%E8%97%8F%E7%9A%84%E5%A4%A7%E9%A2%9D%E4%BC%98%E6%83%A0%E5%88%B8%E5%92%8C%E4%BC%98%E6%83%A0%E6%B4%BB%E5%8A%A8%EF%BC%8C%E4%B8%8D%E8%8A%B1%E5%86%A4%E6%9E%89%E9%92%B1%E3%80%82%E8%84%9A%E6%9C%AC%E6%8C%81%E7%BB%AD%E7%BB%B4%E6%8A%A4%E6%9B%B4%E6%96%B0~.user.js
// @updateURL https://update.greasyfork.org/scripts/509022/%E8%87%AA%E5%8A%A8%E6%9F%A5%E8%AF%A2%E6%B7%98%E5%AE%9D%E3%80%81%E5%A4%A9%E7%8C%AB%E3%80%81%E4%BA%AC%E4%B8%9C%E7%AD%89%E9%9A%90%E8%97%8F%E7%9A%84%E5%A4%A7%E9%A2%9D%E4%BC%98%E6%83%A0%E5%88%B8%E5%92%8C%E4%BC%98%E6%83%A0%E6%B4%BB%E5%8A%A8%EF%BC%8C%E4%B8%8D%E8%8A%B1%E5%86%A4%E6%9E%89%E9%92%B1%E3%80%82%E8%84%9A%E6%9C%AC%E6%8C%81%E7%BB%AD%E7%BB%B4%E6%8A%A4%E6%9B%B4%E6%96%B0~.meta.js
// ==/UserScript==

(function() {
	'use strict';
	
	/**
	 * AGPL 协议全称为 GNU Affero General Public License（GNU Affero 通用公共许可证），它是一种自由软件许可证。
	 * AGPL 协议的主要特点是在传统的开源软件许可证（如 GPL）的基础上，加强了对软件在网络环境中使用的限制。
	 * GPL 是 GNU General Public License（GNU 通用公共许可证）的缩写，本脚本遵循AGPL协议！满足其开源原则、Copyleft原则、附带源代码、允许收费等原则
	 * 
	 * 脚本中部分工具类搜索自互联网，并没有明确的出处。因此在此说明！如有侵权请留言告知！以上~
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
			if(!method){
				method = "get";
			}
			if(method.toUpperCase()=="GET" || method.toUpperCase()=="HEAD"){
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
			}else if(host.indexOf(".jd.")!=-1 || host.indexOf(".yiyaojd.")!=-1 || host.indexOf(".jkcsjd.")!=-1){
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
		
	const browsingHistoryLocalStorageKey = "browsing_history_zxc123_storage_key";
	const discoverCoupon = {
		generateIsResult:true,
		isRun:function(){
			const currentHost = window.location.host;
			return ["detail.tmall.com", "item.taobao.com", "item.jd.com", "item.yiyaojd.com", "npcitem.jd.hk","detail.tmall.hk", "detail.vip.com", "item.jkcsjd.com", "product.suning.com"]
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
			const goodsCouponUrl = "https://tt.shuqiandiqiu.com/api/coupon/query?no=21&version=1.0.2&platform="+platform+"&id="+goodsId+"&q="+goodsName+"&addition="+addition;
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
				const goodsPrivateUrl = "https://tt.shuqiandiqiu.com/api/private/change/coupon?no=21&v=1.0.2&platform="+platform+"&id=";
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
				
				const searchUrl = "https://tt.shuqiandiqiu.com/api/ebusiness/q/c?p="+analysisData.platform+"&id="+analysisData.id+"&no=21";
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
	
	discoverCoupon.start();
	couponSearch.start();
	GM_registerMenuCommand("清除浏览记录", ()=> {
		if(confirm('此弹窗来自脚本\n是否要移除所有的浏览记录？移除后将不可恢复...')){
			Tools.setLocalStorageValue(browsingHistoryLocalStorageKey,[]); //已浏览标识
		}
	});
})();
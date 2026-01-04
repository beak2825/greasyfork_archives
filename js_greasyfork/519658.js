// ==UserScript==
// @name         【购物小助】自动查询淘宝、天猫、京东等隐藏的大额优惠券 ￥省钱哟
// @namespace    gooooooooddd_script
// @version      1.0.4
// @description  购物小助！！！￥省钱哟！ 支持平台：京东、淘宝、天猫、天猫超市、天猫国际、京东国际、京东图书、京东大药房、阿里大药房、唯品会等；功能：1、搜索商品时会自动查询标注有优惠券和活动的商品，无需进入详情页，方便快捷；2、浏览商品详情页时脚本会自动查询商品是否有隐藏的优惠券；简单好用，￥省钱哟！
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAYBJREFUWEfNV7FOw0AMtSU6MMDQ/kMFXwHsLHxAu7ZzN1goC2ydy9p+QBd26Fe06j+0QxkYQDr0KhyFcI19ia6HpSRScomfn5/tHNOPrfvdITt34Ygu5V6MKxO9OeZ5azwZ4vuM06bXeY3tuBgMgDSfp1eMyMm5+xjRqt9kfuAU0QswsMDrXsepSCMu+L8AGu3zLO7P1SIaB14Gjq9vCIfY12pJ29FjFBBeAIj+ZHD7y+Gm3z0cAHiSFICJo/YZfbzMCEyEmpY+VYSng7sdgDoG8Dh8pgLwpSMUTHIA76Mn2pcKlQFE2xxPQoM2C9gEoI4OyujfTUNLK64DQCtfE4BiY7LmQ4vezIBUQoyOaGJAhJgUQBUdlJVf9k9gEaG0ZnTE/JTUtGAZYOYUwFl+QvpaK8BhDZrOvtb759/QykCxEnzllW9YlgowVwEWFjVwcABCr4xmH8XCEqoFz7VRHMSAJriqz4NEWNVJ2XvpAaTfmKTemiE/KVjINqcikFTb829v/uvpaqiDwAAAAABJRU5ErkJggg==
// @author       zkfwMan
// @match        *://*.taobao.com/*
// @match        *://*.tmall.com/*
// @match        *://www.vipglobal.hk/detail-*
// @match        *://*.tmall.hk/*
// @match        *://chaoshi.detail.tmall.com/*
// @match        *://*.liangxinyao.com/*
// @match        *://pages.tmall.com/wow/an/cs/search**
// @match        *://detail.vip.com/detail-*
// @match        *://*.jd.com/*
// @match        *://*.jd.hk/*
// @match        *://category.vip.com/suggest.php**
// @match        *://item.jkcsjd.com/*
// @match        *://*.yiyaojd.com/*
// @match        *://*.vip.com/*
// @match        *://www.vipglobal.hk
// @match        *://list.vip.com/*.html
// @match        *://*.suning.com/*
// @exclude      *://jianghu.taobao.com/*
// @exclude      *://login.taobao.com/*
// @exclude      *://map.taobao.com/*
// @exclude      *://uland.taobao.com/*
// @exclude      *://creator.guanghe.taobao.com/*
// @exclude      *://myseller.taobao.com/*
// @exclude      *://qn.taobao.com/*
// @exclude      *://jingfen.jd.com/*
// @exclude      *://jmw.jd.com/*
// @exclude      *://passport.jd.com/*
// @exclude      *://passport.shop.jd.com/*
// @exclude      *://passport.vip.com/*
// @exclude      *://huodong.taobao.com/wow/z/guang/gg_publish/*
// @exclude      *://passport.suning.com/*
// @copyright    zkfwMan,Xanthella,huahuacat
// @connect      jtm.pub
// @connect      xiaokesoso.com
// @grant        GM_info
// @grant        GM_download
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @run-at       document-end
// @license      AGPL License
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/519658/%E3%80%90%E8%B4%AD%E7%89%A9%E5%B0%8F%E5%8A%A9%E3%80%91%E8%87%AA%E5%8A%A8%E6%9F%A5%E8%AF%A2%E6%B7%98%E5%AE%9D%E3%80%81%E5%A4%A9%E7%8C%AB%E3%80%81%E4%BA%AC%E4%B8%9C%E7%AD%89%E9%9A%90%E8%97%8F%E7%9A%84%E5%A4%A7%E9%A2%9D%E4%BC%98%E6%83%A0%E5%88%B8%20%EF%BF%A5%E7%9C%81%E9%92%B1%E5%93%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/519658/%E3%80%90%E8%B4%AD%E7%89%A9%E5%B0%8F%E5%8A%A9%E3%80%91%E8%87%AA%E5%8A%A8%E6%9F%A5%E8%AF%A2%E6%B7%98%E5%AE%9D%E3%80%81%E5%A4%A9%E7%8C%AB%E3%80%81%E4%BA%AC%E4%B8%9C%E7%AD%89%E9%9A%90%E8%97%8F%E7%9A%84%E5%A4%A7%E9%A2%9D%E4%BC%98%E6%83%A0%E5%88%B8%20%EF%BF%A5%E7%9C%81%E9%92%B1%E5%93%9F.meta.js
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
	 * 
	 * 在原基础上去掉了一些高侵入的设计，优化了部分代码
     */
    
	//基础工具类
	class BaseObject {
		getParamterBySuffix(url=window.location.href, suffix="html"){
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
		}
		
		getPlatform(host = window.location.host){
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
		}
		
		suningParameter(url){
			const regex = /product\.suning\.com\/(\d+\/\d+)\.html/;
			const match = url.match(regex);
			if(match){
				return match[1].replace(/\//g, '-');
			}
			return null;
		}
		
		getParamterBySearch(paramsString=window.location.href, tag){
			if(paramsString.indexOf("?")!=-1){
				paramsString = paramsString.split('?')[1]; // Extract the query string
			}
			const params = new URLSearchParams(paramsString);
			return params.get(tag);
		}
				
		gmRequest(method, url, param){
			if(!method){
				method = "get";
			}
			if(method.toUpperCase()=="GET" || method.toUpperCase()=="HEAD"){
				param = null;
			}
			return new Promise((resolve, reject)=> {
				GM_xmlhttpRequest({
					url: url,
					method: method,
					data: param,
					onload: function (response) {
						const status = response.status;
						if (status === 200 || status === "200") {
							const responseText = response.responseText;
							resolve({ "code": "ok", "result": responseText });
						} else {
							reject({ "code": "exception", "result": null });
						}
					},
					onerror:function(response){}
				});
			});
		}
		
		request(method, url, param) {
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
		}
		
		querySelectorAsync(selector, target = document.body, allowEmpty = true, delay=10, maxDelay=10 * 1000){
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
		}
		
		openInTab(url, options={"active":true, "insert":true, "setParent":true}){
			if (typeof GM_openInTab === "function") {
				GM_openInTab(url, options);
			} else {
				GM.openInTab(url, options);
			}
		}
		
		encodeText(text){
			if(!text){
				return "";
			}
			text = text.replace(/\t|\r/g, "");
			return encodeURIComponent(text);
		}
		
		isElementDisplayed(element) {
		  if (element.offsetParent!== null) {
		    return true;
		  }
		  const style = window.getComputedStyle(element);
		  return style.display!== "none";
		}
	}
	
	//面向详情相关类
	class DetailPageObject extends BaseObject{
		
		constructor(){
			super();
			this.generateIsResult = true;
			this.baseUrl = "https://t.jtm.pub";
		}
		
		isRun(){
			const currentHost = window.location.host;
			return ["detail.tmall.com", "item.taobao.com", "item.jd.com", "item.yiyaojd.com", "npcitem.jd.hk",
				"detail.tmall.hk", "detail.vip.com", "item.jkcsjd.com", "product.suning.com"
			].map((host)=>currentHost.indexOf(host)!=-1).some((result)=>result);
		}
		
		getProductsInfo(platform){
			var goodsId = "";
			var goodsName = "";
			const href = window.location.href;
			if(platform=="taobao"){
				goodsId = this.getParamterBySearch(window.location.search, "id");
				try{
					const titleObj = document.querySelector("[class^='ItemTitle--']");
					if(!!titleObj){
						goodsName = titleObj.textContent;
					}
				}catch(e){}
				
			}else if(platform=="tmall"){
				goodsId = this.getParamterBySearch(window.location.search, "id");
				try{
					const titleObj = document.querySelector("[class^='ItemTitle--']");
					if(!!titleObj){
						goodsName = titleObj.textContent;
					}
				}catch(e){}
				
			}else if(platform=="jd"){
				goodsId = this.getParamterBySuffix(href);
				try{
					const titleObj = document.querySelector("[class='sku-name']");
					if(!!titleObj){
						goodsName = titleObj.textContent;
					}
				}catch(e){}
			}else if(platform=="vpinhui"){
				goodsId = this.getParamterBySuffix(href).replace("detail-","");
				const titleObj = document.querySelector("[class='pib-title-detail']");
				if(!!titleObj){
					goodsName = titleObj.textContent;
				}
			}else if(platform=="suning"){
				goodsId = this.suningParameter(href);
				const titleObj = document.querySelector("#itemDisplayName");
				if(!!titleObj){
					goodsName = titleObj.textContent;
				}
			}
			return {"goodsId":goodsId, "goodsName":this.encodeText(goodsName)};
		}
		
		async getHandlerElement(handler){
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
						promiseArray.push(this.querySelectorAsync(eleName, document.body, true, 10, 1500));
					}
				}
				const element = await Promise.race(promiseArray);
				return element ? element : null;
			}
		
			const element = await getElement(handler);
			return new Promise((resolve,reject) =>{
				resolve(element);
			});
		}
		
		async generateHtml(platform, goodsId, goodsName){
			if(!platform || !goodsId){
				return "kong";
			}
			let addition = "";
			if(platform=="vpinhui"){
				const vip = goodsId.split("-");
				addition = vip[0];
				goodsId = vip[1];
			}
			
			const goodsCouponUrl = this.baseUrl+"/api/coupon/query?no=20&version=1.0.2&platform="+platform+"&id="+goodsId+"&q="+goodsName+"&addition="+addition;
			try{
				console.log("goodsCouponUrl",goodsCouponUrl);
				const data = await this.gmRequest("GET", goodsCouponUrl, null);
				console.log("data",data);
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
		}
		
		async generateCoupon(platform, result){
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
				const goodsPrivateUrl = this.baseUrl+"/api/private/change/coupon?no=20&v=1.0.2&platform="+platform+"&id=";
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
							this.openInTab(href);
							couponElementA.removeAttribute(clickedTag);
						}else{
							this.gmRequest("GET", goodsPrivateUrl+couponId, null).then((privateResultData)=>{
								if(privateResultData.code==="ok" && !!privateResultData.result){
									let url = JSON.parse(privateResultData.result).url;
									if(url){
										this.openInTab(url);
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
				const qrcodeResultData = await this.gmRequest("GET", goodsPrivateUrl+couponId, null);
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
		}
		
		async generateQrcode(platform, mscan){
			if(!mscan || mscan==="null" || !mscan.hasOwnProperty("mount")
				|| !mscan.hasOwnProperty("html")|| !mscan.hasOwnProperty("qrcode")){
				return;
			}
			const {mount, html, qrcode, iden} = mscan;
			if(!!mount && !!html && !!qrcode && !!iden){
				const mountElement = await this.querySelectorAsync(mount, document.body, true, 10, 1500);
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
		}
		
		start(){
			if(!this.isRun()){
				return;
			}
			const platform = this.getPlatform();
			if(platform){
				const goodsData = this.getProductsInfo(platform);
				this.generateHtml(platform, goodsData.goodsId, goodsData.goodsName);
			}
		}
	}
	
	//面向搜索相关类
	class SearchPageObject extends BaseObject{
		constructor(){
			super();
			this.intervalIsRunComplete = true;
			this.searchAttribute = "query-good-job";
			this.baseUrl = "https://t.jtm.pub";
		}
		
		isRun(){
			const visitHref = window.location.href;
			return [
				/^https:\/\/www\.(taobao|jd|tmall)\.(com|hk)(\/|\/\?)?/i,//淘宝/天猫/京东首页
				/^https:\/\/(shop(\d+)|s)\.taobao\.com/i, //搜索或者未装修主页
				/(pages|list)\.tmall\.(com|hk)/i,
				/tmall\.com\/(category|search|shop|\?q=)/i,
				/maiyao\.liangxinyao\.com/i,
				/search\.jd\.(com|hk)/i,
				/pro\.jd\.com\/mall/i,
				/jd\.com\/view_search/i, //商店主页
				/category\.vip\.com/i,
				/(list|category)\.vip\.com/i,
				/^https:\/\/(?!product|dfp\.)([^\/]+)\.suning\.com\//i
			].map((reg)=>(new RegExp(reg)).test(visitHref)).some((res)=>res);
		}
		
		requestConf(){
			return new Promise((resolve, reject) => {
				this.request("GET", this.baseUrl+"/api/plugin/load/conf", null).then((data)=>{
					if(data.code=="ok" && !!data.result){
						resolve(data.result);
					}else{
						resolve(null);
					}
				});
			});
		}
		
		pickupElements(confString, platform){
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
		}
		
		transformElements(selectors){
			const items = [];
			selectors.forEach((elementObj)=>{
				if(elementObj.element){
					const elements = document.querySelectorAll(elementObj.element+":not(["+this.searchAttribute+"='true'])");
					//console.log("elements",elements.length);
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
		}
		
		queryAll(items){
			this.intervalIsRunComplete = false;
			this.processLinksInBatches(items, 18).then((result)=>{
				this.intervalIsRunComplete = true;
			});
		}
		
		async processLinksInBatches(items, batchSize) {
		    const results = [];
		    for (let i = 0; i < items.length; i += batchSize) {
		        const batch = items.slice(i, i + batchSize); // 获取当前批次的链接
		        const batchResults = await Promise.all(  // 同时处理当前批次中的所有请求
		            batch.map(item => this.queryOne(item))
		        );
		        results.push(...batchResults); // 保存批次结果
		    }
		    return results; // 返回所有结果
		}
		
		getAnchorElement(element,findA){
			let finalElement = null;
			if(findA==="this"){
				finalElement = element;
			}else{
				finalElement = element.querySelector(findA.replace(/^child@/,""));
			}
			return finalElement;
		}
		
		queryOne(item){
			const { element, page, findA, extra} = item;
			const self = this;
			return new Promise(function(resolve, reject){
				if(!self.isElementDisplayed(element)){ //如果元素已经隐藏，则不执行
					resolve("cacel");
					return;
				}
				if(element.getAttribute(self.searchAttribute)){  //当存在时，说明已经处理过了
					resolve("processed");
					return;
				}
				element.setAttribute(self.searchAttribute, "true");
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
					let jdId = self.getParamterBySuffix(goodsDetailUrl);
					if(!!jdId) analysisData = {"id":jdId, "platform":"jd"};
				}else if(/^vpinhui_/.test(page)){
					let vipId = self.getParamterBySuffix(goodsDetailUrl).replace("detail-","");
					if(!!vipId){
						analysisData = {"id":vipId.split("-")[1], "platform":"vpinhui"};
					}
				}else if(/^suning_/.test(page)){
					let suningId = self.suningParameter(goodsDetailUrl);
					if(!!suningId){
						analysisData = {"id":suningId, "platform":"suning"};
					}
				}else{
					let platform = self.getPlatform(goodsDetailUrl);
					let id = self.getParamterBySearch(goodsDetailUrl, "id");
					if(platform && id){
						analysisData = {"id":id, "platform":platform};
					}
				}
				if(!analysisData){
					resolve("exception-data-null");
					return;
				}
								
				const searchUrl = self.baseUrl+"/api/ebusiness/q/c?p="+analysisData.platform+"&id="+analysisData.id+"&no=20";
				self.request("GET", searchUrl, null).then((data)=>{
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
		}
		
		relativeJu(element, decryptUrl){
			const self = this;
			element.addEventListener("click", function(e){
				e.preventDefault();
				e.stopPropagation();
				self.openInTab(decryptUrl);
			});
		}
		
		relativeAnchorAJu(page, element, decryptUrl){
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
								self.openInTab(decryptUrl);
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
							const isDetail = /(detail|item)\.(tmall|taobao)\.com\/item\.htm/.test(href);
							if(isDetail){
								isPreventDefault = true;
							}
						}else{
							isPreventDefault = true;
						}
						if(isPreventDefault){
							e.preventDefault();
							e.stopPropagation();
							self.openInTab(decryptUrl);
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
								self.openInTab(decryptUrl);
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
								self.openInTab(decryptUrl);
							});
						}
					});
				}
			}catch(e){
				console.log(e);
			}
		}
		
		start(){
			if(this.isRun()){
				const platform = this.getPlatform();
				this.requestConf().then((confString)=>{
					const selectors = this.pickupElements(confString, (platform=="tmall"? "taobao" : platform));
					if(this.intervalIsRunComplete){
						this.transformElements(selectors);
					}
					setInterval(()=>{
						if(this.intervalIsRunComplete){
							this.transformElements(selectors);
						}
					}, 999);
				});
			}
		}
	}
	
	(new DetailPageObject()).start();
	(new SearchPageObject()).start();
})();
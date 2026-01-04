// ==UserScript==
// @name         【购物先领券】-淘宝天猫隐藏券查询助手
// @namespace    lhhw2021
// @version      0.2
// @description  在淘宝/天猫商品中查询有没有优惠券，在商品详情页显示优惠券，如果商品有优惠券会在商品详情页价格下方出现优惠券领券按钮，如果没有表示该商品没有优惠券。
// @author       lhhw2021
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @include      *://item.taobao.com/*
// @include      *://*detail.tmall.com/*
// @include      *://*detail.tmall.hk/*
// @exclude      *://login.taobao.com/*
// @exclude      *://pages.tmall.com/*
// @require       https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @connect	  www.yiqigou163.com
// @grant         GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/427511/%E3%80%90%E8%B4%AD%E7%89%A9%E5%85%88%E9%A2%86%E5%88%B8%E3%80%91-%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E9%9A%90%E8%97%8F%E5%88%B8%E6%9F%A5%E8%AF%A2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/427511/%E3%80%90%E8%B4%AD%E7%89%A9%E5%85%88%E9%A2%86%E5%88%B8%E3%80%91-%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E9%9A%90%E8%97%8F%E5%88%B8%E6%9F%A5%E8%AF%A2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$;
    //优惠券查询
	function queryCoupon(){
		this.getPlatform = function(){
			let host = window.location.host;
			let platform = "";
			if(host.indexOf("detail.tmall")!=-1){
				platform = "tmall";
			}else if(host.indexOf("item.taobao.com")!=-1){
				platform = "taobao";
			}
			return platform;
		};
		this.filterStr = function(str){
			if(!str) return "";
			str = str.replace(/\t/g,"");
			str = str.replace(/\r/g,"");
			str = str.replace(/\n/g,"");
			str = str.replace(/\+/g,"%2B");//"+"
			str = str.replace(/\&/g,"%26");//"&"
			str = str.replace(/\#/g,"%23");//"#"
			return encodeURIComponent(str)
		};
		this.getParamterQueryUrl = function(tag) { //查询GET请求url中的参数
			var t = new RegExp("(^|&)" + tag + "=([^&]*)(&|$)");
			var a = window.location.search.substr(1).match(t);
			if (a != null){
				return a[2];
			}
			return "";
		};
		this.getEndHtmlIdByUrl = function(url) { //获得以html结束的ID
			if(url.indexOf("?")!=-1){
				url = url.split("?")[0]
			}
			if(url.indexOf("#")!=-1){
				url = url.split("#")[0]
			}
			var splitText = url.split("/");
			var idText = splitText[splitText.length-1];
			idText = idText.replace(".html","");
			return idText;
		};
		this.getGoodsData = function(platform){
			var goodsId = "";
			var goodsName = "";
			var href = window.location.href;
			if(platform=="taobao"){
				goodsId = this.getParamterQueryUrl("id");
				goodsName=$(".tb-main-title").text();

			}else if(platform=="tmall"){
				goodsId = this.getParamterQueryUrl("id");
				goodsName=$(".tb-detail-hd").text();

			}else if(platform=="jd"){
				goodsName=$("div.sku-name").text();
				goodsId = this.getEndHtmlIdByUrl(href);

			}
			var data={"goodsId":goodsId, "goodsName":this.filterStr(goodsName)}
			return data;
		};
		this.createCouponHtml = function(platform, goodsId, goodsName){
			if(!platform || !goodsId) return;
			var goodsCouponUrl = "http://www.yiqigou163.com/api/?";
			goodsCouponUrl = goodsCouponUrl+"pl="+platform+"&id="+goodsId+"&qu="+goodsName;
			GM_xmlhttpRequest({
				url: goodsCouponUrl,
				method: "GET",
				headers: {"Content-Type": "application/x-www-form-urlencoded"},
				onload: function(response) {
					var status = response.status;
					if(status==200||status=='200'){
						var serverResponseJson = JSON.parse(response.responseText);
						var data = serverResponseJson.data;
						var cssText = data.css;
						var htmlText = data.html;
						var handler = data.handler;
						if(!cssText || !htmlText || !handler){
							return;
						}
						$("body").prepend("<style>"+cssText+"</style>");
						var handlers = handler.split("@");
						for(var i=0; i<handlers.length; i++){
							var $handler = $(""+handlers[i]+"");
							if(platform=="taobao"){
								$handler.parent().after(htmlText);
							}else if(platform=="tmall"){
								$handler.parent().after(htmlText);
							}
						}
					}
				}
			});
		};
		this.start = function(){
			var platform = this.getPlatform();
			if(!!platform){
				var goodsData = this.getGoodsData(platform);
				this.createCouponHtml(platform, goodsData.goodsId, goodsData.goodsName);
			}
		};
	}

	//最后调用

	try{
		(new queryCoupon()).start();
	}catch(e){}
})();
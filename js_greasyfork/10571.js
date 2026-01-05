// ==UserScript==
// @name 			淘宝 标题价格&URL过滤
// @author			极品小猫
// @description		一个用于在网页标题上显示淘宝商品促销价格的脚本，且具备过滤无用地址参数的功能，方便你在将商品添加至收藏夹时，可以记录当时的价格，方便日后比价。同时，你在使用浏览器的【复制网页标题和网址】功能时，以更简洁的内容分享商品信息给他人。
// @homepage		https://greasyfork.org/zh-CN/scripts/10571-%E6%B7%98%E5%AE%9D-%E6%A0%87%E9%A2%98%E4%BB%B7%E6%A0%BC-url%E8%BF%87%E6%BB%A4
// @namespace		https://greasyfork.org/zh-CN/scripts/10571-%E6%B7%98%E5%AE%9D-%E6%A0%87%E9%A2%98%E4%BB%B7%E6%A0%BC-url%E8%BF%87%E6%BB%A4
// @version			0.0.17
// @date			2015.10.13
// @include			/^https?:\/\/((?:item|2)\.taobao|detail\.tmall)\.com\/(item|meal_detail)\.htm\?/
// @include			/^https?:\/\/world.(?:taobao|tmall).com/item/\d+.htm/
// 
// 淘宝——taobao
// @include			http://ai.taobao.com/auction/edetail.htm?*
// @include			http://re.taobao.com/eauction?*
// @include			http://h5.m.taobao.com/*/detail.htm?*
// @include			http://buy.taobao.com/auction/buy_now.jhtml
// 淘宝众筹
// @include			http://hi.taobao.com/market/hi/detail2014.php?*
// 淘宝保险
// @include			http://baoxian.taobao.com/item.htm?*
// 
// 来往分享
// @include			http://baron.laiwang.com/s/*
// 
// 天猫——tmall
// @include			/https?://detail.m.tmall.com/item.htm\?/
// 手机天猫
// @include			/^http:\/\/(?!s\.|a\.|detail\.)\w+\.m.tmall.com/
// @include			http://a.m.tmall.com/i*.htm*
// @include			http://s.m.tmall.com/search.htm*
// @include			http://vip.tmall.com/*
// @include			http://ka.tmall.com/*
// 
// 其它——Other
// @include			http://detail.etao.com/*.htm*
// @include			https://cashier.alipay.com/standard/gateway/ebankDeposit.htm?*
// @include			http://www.etao.com/*
// @include			/^http://img.taobaocdn.com/bao/uploaded/i\d/\d+/[^_]*?_[^_]*?_400x400.jpg$/
// 
// @icon			http://www.taobao.com/favicon.ico
// @run-at			document-idle
// @grant			none
// @downloadURL https://update.greasyfork.org/scripts/10571/%E6%B7%98%E5%AE%9D%20%E6%A0%87%E9%A2%98%E4%BB%B7%E6%A0%BCURL%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/10571/%E6%B7%98%E5%AE%9D%20%E6%A0%87%E9%A2%98%E4%BB%B7%E6%A0%BCURL%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

// ===== /*
// v0.0.17 【2015.10.13】
// 1、【增加】海外全球站 world.tmall.com、world.taobao.com 的支持
// 
// v0.0.16 【2015.09.21】
// 1、【增加】来往分享地址页面跳转
// 2、【修正】修正FF中的脚本兼容问题
// 
// v0.0.15 【2015.08.28】
// 1、【修复】淘宝商品价格标题信息BUG
// 2、【增加】淘宝商品小标题中提取减价信息
// 
// v0.0.14
// 1、【修复】淘宝商品原价格标题信息多次添加错误
// 
// v0.0.13
// 1、【增加】手机淘宝店转换到PC版
// 2、【增加】商品促销价格旁边加入进入“手机淘宝”的链接，方便查看手机专享价
// 3、【增加】淘宝保险支持 URL过滤 & 价格标题
// 
// v0.0.12
// 1. 【修复】商品分类skuId提取错误
// 
// v0.0.11
// 1. 【修复】刷新页面商品ID提取出错
// 2. 【增加】skuId参数保留，该参数为所选的商品分类
// 3. 【增加】打开小图换大图
// 
// v0.0.10
// 1. fixed 促销价信息读取失败
// 2. 改进监听方式
// 
// v0.0.9 增强网页标题添加商品价格的兼容性(淘宝与天猫 独立模块化)
// =====  v0.0.8 [2014.07.18]: 修正网页标题添加商品价格的兼容性 =====
// */======


var msgFlag=false;			//0=true, 1=false, 控制台信息显示
var aiTaobaoJump=true;		//爱淘宝页面直接跳转
var urls=location.href;
var search=location.search;
var page=location.pathname;
var host=location.hostname.toLowerCase();
var oTitle=document.title=document.title.replace(/-tmall.com天猫$/,'').replace(/-淘宝网$/,'');	//网页标题
	
var PriceRead = {
	/*价格读取*/
	taobao : function(){
		var price=$('.tb-rmb-num')[0].textContent;				//淘宝商品价格
		if($("#J_PromoPrice").className!='tb-detail-price tb-clearfix tb-promo-price tb-hidden') {	//有促销信息
			msg('T');
			var PromoPrice=$('#J_PromoPriceNum')?$('#J_PromoPriceNum').textContent:$('.tb-rmb-num')[0].textContent;		//读取促销价格
			
			var subtitle=$('.tb-subtitle')[0]?$('.tb-subtitle')[0].textContent:null;			//淘宝标题下商品简述
			if(/拍下立?减[一二三四五六七八九十\d+][元块]?/.test(subtitle)) {
				msg('商品描述中有拍下减价信息');
				var info=subtitle.match(/拍下立?减([一二三四五六七八九十\d]+)[元块]?/i);
				var newPrice=convNum(info[1]);
				ChangeTitle([PromoPrice,"减价后："+Number(PromoPrice-newPrice),info[0]]);
			} else {
				msg('淘宝-直接显示商品促销价格');
				ChangeTitle(PromoPrice);
			}
		} else {
			msg('淘宝——无促销直接显示商品原价格');
			ChangeTitle(price);
		}
	},
	
	tmall : function(){//标题前加入价格	
		if($('.tm-price')[0]||$('.tm-promo-type')[0]){//天猫价格信息
			var promo=$('.tm-promo-type').length!==0?$('.tm-promo-type')[0].textContent:"";//天猫促销信息(旧)
			var PromoPrice=$('#J_PromoPrice').getElementsByClassName('tm-price')[0]?$('#J_PromoPrice').getElementsByClassName('tm-price')[0].innerHTML:null;//天猫促销信息(新)
			var price=$('.tm-price')[0].textContent;//天猫商品价格
			//var price=promo.parentNode.getElementsByClassName('tm-price')[0];//天猫商品价格
			var minus=$('.tb-detail-hd')[0].children[1];//商品信息
			
			if(/[一二三四五六七八九十\d]+[块快][一二三四五六七八九十\d]*?/.test(promo)){//中文减价促销
				//msg(convNum(promo));
				msg("天猫-标题修改1");
				ChangeTitle(convNum(promo.match(/([一二三四五六七八九十\d])+[块快]([一二三四五六七八九十\d])+?/g)[0]));
			}
			else if(/拍下?[\d\.]+元?/i.test(promo))
			{
				msg("天猫-标题修改2");
				ChangeTitle(promo.match(/[\d\.]+/)[0]);
			}
			else if(/拍下立?减[一二三四五六七八九十\d+]元/.test(promo))
			{
				msg("天猫-标题修改3");
				ChangeTitle((price.match(/[\d\.]+/)[0]-Number(convNum(promo).match(/[\d\.]+/)[0])));
			}
			else if(/[一二三四五六七八九十两\d]+件[一二三四五六七八九十两\d]+/.test(promo))
			{
				msg("多件改价优惠");
				ChangeTitle([promo,PromoPrice]);
			}
			else if(/返现[一二三四五六七八九十两\d]+/.test(promo))
			{
				msg("返现提醒");
				ChangeTitle([promo,PromoPrice]);
			}
			else if(/拍下[^\d]*((自动|立)减价?)[\d\-\.]+元?(?!天)/.test(minus.textContent)&&minus.textContent.match(/拍下.*?(?:(?:自动|立)减)([\d\-\.]+)元?/)[1]!=price.replace(/0$/,''))
			{			//从商品信息中获取减价信息, 且促销信息中不存在减价信息
				msg("天猫-标题修改4");
				price=price.match(/[\d\.]+/)[0];
				minus=minus.textContent.match(/拍下.*?(?:(?:自动|立)减)?([\d\-\.]+)元?/)[1];
				//ChangeTitle(minus.innerHTML.match(/拍下.*?(?:(?:自动|立)减)?([\d\-\.]+)元?/)[1]);
				ChangeTitle(price-Number(minus)+"="+price+"-"+minus);
			}
			else if(/拍下[\d\-\.]+元?/.test(minus.innerHTML)&&minus.innerHTML.match(/拍下[\d\-\.]+元?/)[1]!=price.replace(/0$/,''))
			{	//从商品信息中获取促销价信息,
				msg("天猫-标题修改5");
				minus.innerHTML=minus.innerHTML.replace(/(拍下[\d\-\.]+元?)/,'<span style="color:red">$1</span>');
				minus=minus.innerHTML.match(/拍下([\d\-\.]+)元?/)[1];
				ChangeTitle(Number(minus));
			}
			else if(/拍下减价/.test(promo))
			{//减价情况
				msg("天猫-标题修改6");
				if(minus.innerHTML.search(/((?:拍下)?(自动|立)减)?[\d\-\.]+元/)>-1){ChangeTitle(minus.innerHTML.match(/(?:拍下)?(?:(?:自动|立)减)?([\d\-\.]+)元?/)[1])}
				if(minus.innerHTML.search(/[\d\.][元块]包邮/)>-1){ChangeTitle(minus.innerHTML.match(/([\d\.]+)[元块]包邮/)[1])}
			} else if(PromoPrice) {
				msg('天猫-有促销价');
				ChangeTitle(PromoPrice);
			} else {
				msg("天猫-商品原价格");
				ChangeTitle(price);//原商品价格
				//ChangeTitle(price.match(/[\d\.]+/)[0]);//天猫促销
			}
		}
	},
	
	baoxian : function(){
		var t=setInterval(function(){
			if($('#J_Price')){
				ChangeTitle($('#J_Price').textContent);
				clearInterval(t);
			}
		},500);
	},
	
	isArray : function(v){
		return toString.apply(v) === '[object Array]';
	}
}

function msg(texts){
	if(msgFlag){
		try{
			console.log(texts);
			//alert(texts);
		}catch(e){
			console.log(e.message);
			//alert(e.message);
		}
	}
}

function convNum(money){
	var cnNum=["零","一","二","三","四","五","六","七","八","九","块","快","0","1","2","3","4","5","6","7","8","9","十","两"];
	var Num=["0","1","2","3","4","5","6","7","8","9",".",".","0","1","2","3","4","5","6","7","8","9","10","2"];

	var RegExp=/([百十]|.*件)/;
	if(RegExp.test(money)){
		money=money.replace(RegExp,"");
	}
	for(j=0;j<cnNum.length;j++){
		for(i=0;i<money.length;i++){
			money=money.replace(cnNum[j],Num[j]);
		}
	}
	return Number(money);
}

(function(){
	switch(host){
		//URL过滤 + 价格标题
		case "item.taobao.com":	//去除商品页面地址的无用参数, 并在网页标题中添加商品价格
		case "detail.tmall.com":
			window.history.pushState('state', 'title', search="?"+getQueryString("ID",true)+getQueryString("skuId"));
			document.addEventListener('DOMContentLoaded',main);
			main();
			window.addEventListener('load',function(){
				$('#J_PromoPrice').getElementsByClassName('tm-promo-price')[0].innerHTML+='<a href="'+location.href.replace(host,host.replace(/(\w+\.)/i,'$1m.'))+'&mobile=true" target="_blank">手机淘宝</a>';
			});
			break;
		case "world.taobao.com":
		case "world.tmall.com":
			window.history.pushState('state', 'title', search="?"+getQueryString("ID",true)+getQueryString("skuId"));
			document.addEventListener('DOMContentLoaded',main);
			main();
			break;
		case "baoxian.taobao.com":
			if(page=='/item.htm') {
				window.history.pushState('state', 'title', search="?"+getQueryString("ID",true));
				PriceRead.baoxian();
			}
			break;
		//URL过滤
		case 'baron.laiwang.com':
			//来往分享页面跳转
			location.href=pageData.actionRule[0].url;
			break;
		case "hi.taobao.com":
			if(page=='/market/hi/detail2014.php'){
				window.history.pushState('state', 'title', search="?"+getQueryString("ID",true));
			}
			break;
		case "2.taobao.com":	//去除二手商品页面地址的无用参数
			window.history.pushState('state', 'title', search="?"+getQueryString("ID",true)+getQueryString("skuId"));
			break;
		case "ai.taobao.com":
			if(aiTaobaoJump) location.href="http://detail.tmall.com/item.htm?id="+pageconfig.itemId;
			break;
		case "re.taobao.com":
			IDstr=document.getElementById('sharePageInfo').value;
			JSON=eval('(' + IDstr + ')');//JSON字符串转换成JSON对象
			location.href="http://item.taobao.com/item.htm?id="+JSON.key;
			break;
		case "h5.m.taobao.com":
		case "detail.m.tmall.com":
		case "a.m.tmall.com":		//手机淘宝转电脑
			if(getQueryString("mobile",'val')!='true'){
				location.href="http://detail.tmall.com/item.htm?"+getQueryString("ID",true)+getQueryString("skuId");
			}
			break;
		case "detail.etao.com":		//一淘优惠购转回淘宝
			location.href="http://detail.tmall.com/item.htm?id="+getQueryString("ID",true)+getQueryString("skuId");
			break;
		case "img.taobaocdn.com":	//小图转大图
			location.href=urls.replace("_400x400.jpg",'');
			break;
		case 'buy.taobao.com':
			if(/\/buy_now.jhtml$/i.test(urls)){
				if(!document.getElementById('J_AnonBuy').checked){
					document.getElementById('J_AnonBuy').click();
				}
				var msg=$('.msgtosaler');
				for(i=0;i<msg.length;i++){
					msg[i].value="请务必包装好，发货前请检查货物无损，另请在运单注明货到电联本人，谢谢。";
					msg[i].click();
				}
			}
			break;
		case 'cashier.alipay.com':
			if(/\/standard\/gateway\/ebankDeposit.htm/i.test(urls)){
				if(!document.getElementById("J-paymentArgreement").checked){
					document.getElementById("J-paymentArgreement").click();
				}
			}
			break;
		case 'ka.tmall.com'://天猫点券签到
			document.getElementById('signTrigger').click();
			break;
		case 'www.etao.com':	//一掏签到
			(function(){
				var a=document.createElement('iframe');
				a.src="http://rebate.etao.com/my/index.htm";
				$('.etao-logo')[0].appendChild(a);
				setTimeout(document.getElementById('J_SignIn').click(),5000);
			})();
			break;
		default: 
			if(/\w+.m.tmall.com/.test(host)&&/^http:\/\/(?!s\.|a\.|detail\.)\w+\.m.tmall.com/i.test(urls)){
				location.host=host.replace(/(?!\.)m\./,'');
			}
	}
})();

function main(){
	var t=setInterval(function(){
		if(host=='item.taobao.com'&&$('.tb-rmb-num')[0].textContent!==""){
			clearInterval(t);
			PriceRead.taobao();
			//$('.J_Prop')[0].addEventListener('click',PriceRead.taobao);	//监听套餐选择变化
			$('.tb-meta')[0].addEventListener('DOMSubtreeModified',PriceRead.taobao);	//监听价格变化
			//$('.tb-rmb-num')[0].addEventListener('DOMSubtreeModified',PriceRead.taobao);	//监听价格变化
		} else if(host=='detail.tmall.com'&&$('.tm-price')[0].textContent!==""){
			clearInterval(t);
			PriceRead.tmall();
			console.log("监听价格变化");
			$('.tm-fcs-panel')[0].addEventListener('DOMSubtreeModified',PriceRead.tmall);	//监听价格变化
		} else if(host=='world.taobao.com') {
			clearInterval(t);
			PriceRead.taobao();
			$('#J_PromoWrap').addEventListener('DOMSubtreeModified',PriceRead.taobao);
		} else if(host=='world.tmall.com') {
			clearInterval(t);
			PriceRead.tmall();
			$('.tm-fcs-panel')[0].addEventListener('DOMSubtreeModified',PriceRead.tmall);
		}
	},1000);
}


function ChangeTitle(title){
		title=title.replace(/[￥ ¥ ]/g,'');
	var newTitle='';
	if (PriceRead.isArray(title)){
		for(i=0;i<title.length;i++){
			newTitle+="【￥"+title[i]+"】";
		}
		document.title=newTitle+oTitle;
	} else {
		document.title="【￥"+title+"】"+oTitle;
	}
}

function getQueryString(name,mode) {//筛选参数
	var reg = new RegExp("(?:^|&)(" + name + "=([^&]*))(?:&|$)", "i");		//正则筛选参数
	var value = search.substr(1).match(reg);
	if(mode=='val' && value !== null){
		return value[2];
	} else if(mode && value !== null){
		return unescape(value[1]);
	} else if(value !== null) {
		return "&"+name+"="+unescape(value[2]);
	}
	return "";
}

function $(obj) {//ID, Class选择器
	var objF=obj.replace(/^[#\.]/,'');
	return (/^#/.test(obj)) ? document.getElementById(objF) : (/^\./.test(obj)) ? document.getElementsByClassName(objF) : document.querySelectorAll(obj);
}
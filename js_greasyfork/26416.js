// ==UserScript==
// @name        百度美团外卖菜品匹配工具
// @namespace   mtwmMatchDish
// @author      wdt-yhnice
// @description 支持百度美团外卖开放平台菜品自动匹配以及美团外卖门店映射匹配
// @include     http://developer.waimai.meituan.com/poi/getFoods*
// @include     http://dev.waimai.baidu.com/dev/shopdishlist*
// @include     http://developer.waimai.meituan.com/erp/poi/info*
// @version     2.6.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26416/%E7%99%BE%E5%BA%A6%E7%BE%8E%E5%9B%A2%E5%A4%96%E5%8D%96%E8%8F%9C%E5%93%81%E5%8C%B9%E9%85%8D%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/26416/%E7%99%BE%E5%BA%A6%E7%BE%8E%E5%9B%A2%E5%A4%96%E5%8D%96%E8%8F%9C%E5%93%81%E5%8C%B9%E9%85%8D%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
//var to = document.createElement(trHtml);
//var trdoc = loadXmlString(trHtml);
//console.log(getFoodsMould());

var isAutoMath = 0;
var isNeedMatch = 0;

// 0< id(平台门店菜品维护) <10 ; 10 < id(平台门店授权维护) > 20
// 美团 1 ; 百度 2 : 美团授权 11

var currPlatType = (document.URL.search(/waimai.meituan.com/) > -1) ? (document.URL.search(/erp\/poi\/info/) > -1?11:1) : 2;
console.log("平台类型:%d",currPlatType);

var Cookie = {
	setCookie: function(name, value){
		var Days = 30;
		var exp = new Date();
		exp.setTime(exp.getTime() + Days*24*60*60*1000);
		document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
	},
	getCookie: function(name){
		var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		if(arr=document.cookie.match(reg)){
			return unescape(arr[2]);
		}else {
			return null;
		}
	},
	delCookie: function(name){
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		var cval=getCookie(name);
		if(cval!=null){
			document.cookie= name + "="+cval+";expires="+exp.toGMTString();
		}
	}
};


if(currPlatType < 10){
    createPageOperateButton();
    isAuthDoMatchFood();
}

// 测试匹配授权code
if(currPlatType == 11){
    // 页面标志
    var pageFlag = '',opageFlag = '';
    // 创建tips
    createShopCodeLogTips();
    // 初次执行门店code匹配
    runMatchShopCode();
}


if(currPlatType == 1){
	 console.log(getFoodsMould());
}else {
	 getBdFoodsMould();
}

// 手动点击匹配
window.onClickMatchBt = function (){
	var msg = doMatchFoods();
	if(msg){
		console.log(msg);
		alert("以下菜品未匹配，请检查是否需要手动处理:\n" + msg);
	}
};

// 自动匹配设置切换
window.onClickSettingAutoBt = function(o){
	thisBt = isAutoMath ? "开启自配" : "停用自配";
	isAutoMath = isAutoMath ? 0 : 1;
	Cookie.setCookie("isAutoMath", isAutoMath);
	o.innerHTML = thisBt;
	// 使用临近节点方式获取手动匹配按钮
	if(isAutoMath){
		o.nextSibling.style = "pointer-events: none;cursor: default;color: #F5F5F5";
	}
	// console.log();
};

// 刷新页面
window.onClickRefreshBt = function(){
	window.location.href =window.location.href;
};

// 是否自动执行匹配操作
function isAuthDoMatchFood(){
	isAutoMath = Cookie.getCookie("isAutoMath");
	isAutoMath = parseInt(isAutoMath);
	if(isAutoMath){
		document.querySelector("#matchFood").style = "pointer-events: none;cursor: default;color: #F5F5F5";
		var msg = doMatchFoods();
		if(msg){
			console.log(msg);
			alert("以下菜品未匹配，请检查是否需要手动处理:\n" + msg);
		}
	}
}

// 创建页面操作按钮
function createPageOperateButton(){
    isAutoMath = Cookie.getCookie("isAutoMath");
	isAutoMath = isAutoMath && parseInt(isAutoMath);
	// 创建div dom
	hobj = document.createElement("div");
	// 设置 div style属性
	hobj.style.position = 'fixed';
	hobj.style.right = '20px';
	hobj.style.bottom = '195px';
	hobj.style.width = '85px';
	hobj.style.height = '40px';

	var btName = isAutoMath ?　"停用自配":'开启自配';
	
	var btCls = {
		1: 'btn blue btn-block',
		2: 'btn btn-primary ok'
	};
	
	var btHmtl = '<a class="'+btCls[currPlatType]+'" href="javascript:void(0)" onclick="onClickSettingAutoBt(this)">'+btName+'</a>'
			+'<a class="'+btCls[currPlatType]+'" id="matchFood" href="javascript:void(0)" onclick="onClickMatchBt()">手动匹配</a>'
	    +'<a class="'+btCls[currPlatType]+'" id="matchFood" href="javascript:void(0)" onclick="onClickRefreshBt()">刷新页面</a>';
	
	// 设置div对象内容
	hobj.innerHTML = btHmtl;

	// 宿主
	hobjParentcls = currPlatType == 1 ? 'page-container' : 'panel-body';
	
	// 加载
	document.querySelector('.' + hobjParentcls).appendChild(hobj);
	// console.log(hobj);
}

// 执行匹配操作
function doMatchFoods() {
	var defaultFoodsMould = '';
	if(currPlatType == 1){
		// 武汉店 + 北京清华大学店
		defaultFoodsMould = '[{"name":"卤鸡蛋【颗粒120g】","code":"320302"},{"name":"卤花生米【颗粒160g】","code":"300901"},{"name":"卤凤爪【颗粒150g】","code":"320106"},{"name":"卤鸭腿【颗粒220g】","code":"300710"},{"name":"鸭肉干【颗粒80g】","code":"301305"},{"name":"卤鸭头【颗粒198g】","code":"300511"},{"name":"卤鸭锁骨【颗粒115g】","code":"300514"},{"name":"卤鸭舌【颗粒88g】","code":"300810"},{"name":"卤香菇【颗粒128g】","code":"390001"},{"name":"卤豆腐干【颗粒135g】","code":"350400"},{"name":"卤鸡翅尖【颗粒170g】","code":"320011"},{"name":"卤鸭胗【颗粒110g】","code":"301400"},{"name":"卤鸭掌【颗粒160g】","code":"300111"},{"name":"卤鸭翅中【颗粒180g】","code":"300011"},{"name":"卤鸭脖【颗粒180g】","code":"300612"},{"name":"真空卤鸡蛋","code":"320301"},{"name":"卤猪蹄【大盒】","code":"260104"},{"name":"卤香干【大盒】","code":"250004"},{"name":"卤莲藕【大盒】","code":"240004"},{"name":"卤凤爪【大盒】","code":"220107"},{"name":"卤鸭胗【大盒】","code":"200209"},{"name":"卤鱿鱼【大盒】","code":"260001"},{"name":"卤香菇【大盒】","code":"290004"},{"name":"卤鸭脖【大盒】","code":"200614"},{"name":"卤鸭翅【大盒】","code":"200010"},{"name":"卤鸭掌【大盒】","code":"200110"},{"name":"卤鸭舌【大盒】","code":"200801"},{"name":"卤鸭头【大盒】","code":"200507"},{"name":"卤鸭腿【大盒】","code":"200708"},{"name":"卤鸡翅尖【大盒】","code":"220007"},{"name":"卤鸭锁骨【大盒】","code":"200409"},{"name":"周黑鸭【卤鹅】","code":"210101"},{"name":"周黑鸭【卤鹅】不辣","code":"210201"},{"name":"酱板鸭","code":"210301"},{"name":"秘制黑鸭","code":"210001"},{"name":"卤香菇【小盒】","code":"290005"},{"name":"卤猪蹄【小盒】","code":"260105"},{"name":"卤鱿鱼【小盒】","code":"260005"},{"name":"卤凤爪【小盒】","code":"220108"},{"name":"卤鸡翅尖【小盒】","code":"220008"},{"name":"卤鸭腿【小盒】","code":"200707"},{"name":"卤鸭头【小盒】","code":"200508"},{"name":"卤鸭锁骨【小盒】","code":"200410"},{"name":"卤鸭掌【小盒】","code":"200112"},{"name":"卤鸭翅【小盒】","code":"200012"},{"name":"卤鸭脖【小盒】","code":"200613"},{"name":"卤鸭舌【小盒】","code":"200809"},{"name":"卤鸭胗【小盒】","code":"200208"},{"name":"卤香干【小盒】","code":"250005"},{"name":"卤鱿鱼【小盒】","code":"260005"},{"name":"辣椒风味酱","code":"360001"},{"name":"牛肉风味酱","code":"360004"},{"name":"豆鼓风味酱","code":"360002"},{"name":"鸭肉风味酱","code":"360003"},{"name":"时尚礼盒","code":"370001"},{"name":"经典礼盒","code":"370002"},{"name":"时尚鸭礼","code":"370005"},{"name":"卤鸭胗【小盒】","code":"200208","skuid":"200208"},{"name":"卤鸭锁骨【大盒】","code":"200409","skuid":"200409"},{"name":"卤鸭脖【大盒】","code":"200614","skuid":"200614"},{"name":"卤鸭翅【大盒】","code":"200010","skuid":"200010"},{"name":"卤鸭舌【大盒】","code":"200801","skuid":"200801"},{"name":"卤莲藕【大盒】","code":"240004","skuid":"240004"},{"name":"卤鸭腿【大盒】","code":"200708","skuid":"200708"},{"name":"卤鸭掌【大盒】","code":"200110","skuid":"200110"},{"name":"鱿鱼【小盒】","code":"260005","skuid":"260005"},{"name":"鸭舌【小盒】","code":"200809","skuid":"200809"},{"name":"鸡尖【小盒】","code":"220008","skuid":"220008"},{"name":"卤鸭头【大盒】","code":"200507","skuid":"200507"},{"name":"卤鸡翅尖【大盒】","code":"220007","skuid":"220007"},{"name":"周黑鸭【卤鹅】","code":"210101","skuid":"210101"},{"name":"卤香菇【大盒】","code":"290004","skuid":"290004"},{"name":"卤猪蹄【大盒】","code":"260104","skuid":"260104"},{"name":"卤凤爪【大盒】","code":"220107","skuid":"220107"},{"name":"卤鸭胗【大盒】","code":"200209","skuid":"200209"},{"name":"卤鱿鱼【大盒】","code":"260001","skuid":"260001"},{"name":"卤香干【大盒】","code":"250004","skuid":"250004"},{"name":"酱板鸭","code":"210301","skuid":"210301"},{"name":"秘制黑鸭","code":"210001","skuid":"210001"},{"name":"周黑鸭【卤鹅】不辣","code":"210201","skuid":"210201"},{"name":"卤鸭锁骨【颗粒115g】","code":"300514","skuid":"300514"},{"name":"卤鸭腿【颗粒220g】","code":"300710","skuid":"300710"},{"name":"卤凤爪【颗粒150g】","code":"320106","skuid":"320106"},{"name":"鸭肉干【颗粒80g】","code":"301305","skuid":"301305"},{"name":"卤鸭头【颗粒198g】","code":"300511","skuid":"300511"},{"name":"卤豆腐干【颗粒135g】","code":"350400","skuid":"350400"},{"name":"卤鸡翅尖【颗粒170g】","code":"320011","skuid":"320011"},{"name":"卤鸭胗【颗粒110g】","code":"301400","skuid":"301400"},{"name":"卤鸭脖【颗粒180g】","code":"300612","skuid":"300612"},{"name":"卤鸭掌【颗粒160g】","code":"300111","skuid":"300111"},{"name":"卤鸭翅中【颗粒180g】","code":"300011","skuid":"300011"},{"name":"卤香菇【颗粒128g】","code":"390001","skuid":"390001"},{"name":"卤鸭舌【颗粒88g】","code":"300810","skuid":"300810"},{"name":"牛肉酱","code":"360004","skuid":"360004"},{"name":"鸭肉酱","code":"360003","skuid":"360003"},{"name":"豆豉酱","code":"360002","skuid":"360002"},{"name":"辣椒酱","code":"360001","skuid":"360001"},{"name":"时尚鸭礼","code":"370005","skuid":"370005"},{"name":"经典礼盒","code":"370002","skuid":"370002"},{"name":"时尚礼盒","code":"370001","skuid":"370001"},{"name":"周黑鸭（卤鹅）不辣【大盒】","code":"210201","skuid":"210201"},{"name":"卤酱板鸭【大盒】","code":"210301","skuid":"210301"},{"name":"卤花生仁","code":"","skuid":""},{"name":"卤鸭脖【小盒】","code":"200613","skuid":"200613"},{"name":"卤鸭锁骨【小盒】","code":"200410","skuid":"200410"},{"name":"卤鸭腿【小盒】","code":"200707","skuid":"200707"},{"name":"卤凤爪【小盒】","code":"220108","skuid":"220108"},{"name":"卤香干【小盒】","code":"250005","skuid":"250005"},{"name":"卤猪蹄【小盒】","code":"260105","skuid":"260105"},{"name":"卤鸭翅【小盒】","code":"200012","skuid":"200012"},{"name":"卤鱿鱼【小盒】","code":"260005","skuid":"260005"},{"name":"卤鸭掌【小盒】","code":"200112","skuid":"200112"},{"name":"卤鸭头【小盒】","code":"200508","skuid":"200508"},{"name":"卤鸭舌【小盒】","code":"200809","skuid":"200809"},{"name":"卤鸡翅尖【小盒】","code":"220008","skuid":"220008"},{"name":"周黑鸭（卤鹅）不辣","code":"210201"},{"name":"卤鸭舌（颗粒88g）","code":"300810"},{"name":"卤香菇（颗粒128g）","code":"390001"},{"name":"卤豆腐干（颗粒135g）","code":"350400"},{"name":"卤鸡翅尖（颗粒170g）","code":"320011"},{"name":"卤鸭胗（颗粒110g）","code":"301400"},{"name":"卤鸭掌（颗粒160g）","code":"300111"},{"name":"卤鸭翅中（颗粒180g）","code":"300011"},{"name":"卤鸭脖（颗粒180g）","code":"300612"},{"name":"卤香菇（小盒）","code":"290005"},{"name":"卤猪蹄（小盒）","code":"260105"},{"name":"卤鱿鱼（小盒）","code":"260005"},{"name":"卤凤爪（小盒）","code":"220108"},{"name":"卤鸡翅尖（小盒）","code":"220008"},{"name":"卤鸭腿（小盒）","code":"200707"},{"name":"卤鸭头（小盒）","code":"200508"},{"name":"卤鸭锁骨（小盒）","code":"200410"},{"name":"卤鸭掌（小盒）","code":"200112"},{"name":"卤鸭翅（小盒）","code":"200012"},{"name":"卤鸭脖（小盒）","code":"200613"},{"name":"卤鸭舌（小盒）","code":"200809"},{"name":"卤鸭胗（小盒）","code":"200208"},{"name":"卤香干（小盒）","code":"250005"},{"name":"卤猪蹄（大盒）","code":"260104"},{"name":"卤香干（大盒）","code":"250004"},{"name":"卤莲藕（大盒）","code":"240004"},{"name":"卤凤爪（大盒）","code":"220107"},{"name":"卤鸭胗（大盒）","code":"200209"},{"name":"卤鱿鱼（大盒）","code":"260001"},{"name":"卤香菇（大盒）","code":"290004"},{"name":"卤鸭脖（大盒）","code":"200614"},{"name":"卤鸭翅（大盒）","code":"200010"},{"name":"卤鸭掌（大盒）","code":"200110"},{"name":"卤鸭舌（大盒）","code":"200801"},{"name":"卤鸭头（大盒）","code":"200507"},{"name":"卤鸭腿（大盒）","code":"200708"},{"name":"卤鸡翅尖（大盒）","code":"220007"},{"name":"卤鸭锁骨（大盒）","code":"200409"},{"name":"周黑鸭（卤鹅）","code":"210101"},{"name":"酱板鸭","code":"210301"},{"name":"秘制黑鸭","code":"210001"},{"name":"卤鸡蛋（颗粒120g）","code":"320302"},{"name":"卤花生米（颗粒160g）","code":"300901"},{"name":"卤凤爪（颗粒150g）","code":"320106"},{"name":"卤鸭腿（颗粒220g）","code":"300710"},{"name":"鸭肉干（颗粒80g）","code":"301305"},{"name":"卤鸭头（颗粒198g）","code":"300511"},{"name":"卤鸭锁骨（颗粒115g）","code":"300514"},{"name":"卤鸭舌（颗粒88g）","code":"300810"},{"name":"卤香菇(小盒)","code":"290005"},{"name":"卤猪蹄(小盒)","code":"260105"},{"name":"卤鱿鱼(小盒)","code":"260005"},{"name":"卤凤爪(小盒)","code":"220108"},{"name":"卤鸡翅尖(小盒)","code":"220008"},{"name":"卤鸭腿(小盒)","code":"200707"},{"name":"卤鸭头(小盒)","code":"200508"},{"name":"卤鸭锁骨(小盒)","code":"200410"},{"name":"卤鸭掌(小盒)","code":"200112"},{"name":"卤鸭翅(小盒)","code":"200012"},{"name":"卤鸭脖(小盒)","code":"200613"},{"name":"卤鸭舌(小盒)","code":"200809"},{"name":"卤鸭胗(小盒)","code":"200208"},{"name":"卤香干(小盒)","code":"250005"},{"name":"卤猪蹄(大盒)","code":"260104"},{"name":"卤香干(大盒)","code":"250004"},{"name":"卤莲藕(大盒)","code":"240004"},{"name":"卤凤爪(大盒)","code":"220107"},{"name":"卤鸭胗(大盒)","code":"200209"},{"name":"卤鱿鱼(大盒)","code":"260001"},{"name":"卤香菇(大盒)","code":"290004"},{"name":"卤鸭脖(大盒)","code":"200614"},{"name":"卤鸭翅(大盒)","code":"200010"},{"name":"卤鸭掌(大盒)","code":"200110"},{"name":"卤鸭舌(大盒)","code":"200801"},{"name":"卤鸭头(大盒)","code":"200507"},{"name":"卤鸭腿(大盒)","code":"200708"},{"name":"卤鸡翅尖(大盒)","code":"220007"},{"name":"卤鸭锁骨(大盒)","code":"200409"},{"name":"卤鸡蛋(颗粒120g)","code":"320302"},{"name":"卤花生米(颗粒160g)","code":"300901"},{"name":"卤凤爪(颗粒150g)","code":"320106"},{"name":"卤鸭腿(颗粒220g)","code":"300710"},{"name":"鸭肉干(颗粒80g)","code":"301305"},{"name":"卤鸭头(颗粒198g)","code":"300511"},{"name":"卤鸭锁骨(颗粒115g)","code":"300514"},{"name":"卤鸭舌(颗粒88g)","code":"300810"}]';
	}else {
		// 模板是百度古田三路店 + 北京火神庙物美店 + 上海地铁虹桥路店 + 广州石牌桥站店
		defaultFoodsMould = '[{"name":"卤鸡蛋【颗粒120g】","code":"320302"},{"name":"卤花生米【颗粒160g】","code":"300901"},{"name":"卤凤爪【颗粒150g】","code":"320106"},{"name":"卤鸭腿【颗粒220g】","code":"300710"},{"name":"鸭肉干【颗粒80g】","code":"301305"},{"name":"卤鸭头【颗粒198g】","code":"300511"},{"name":"卤鸭锁骨【颗粒115g】","code":"300514"},{"name":"卤鸭舌【颗粒88g】","code":"300810"},{"name":"卤香菇【颗粒128g】","code":"390001"},{"name":"卤豆腐干【颗粒135g】","code":"350400"},{"name":"卤鸡翅尖【颗粒170g】","code":"320011"},{"name":"卤鸭胗【颗粒110g】","code":"301400"},{"name":"卤鸭掌【颗粒160g】","code":"300111"},{"name":"卤鸭翅中【颗粒180g】","code":"300011"},{"name":"卤鸭脖【颗粒180g】","code":"300612"},{"name":"真空卤鸡蛋","code":"320301"},{"name":"卤猪蹄【大盒】","code":"260104"},{"name":"卤香干【大盒】","code":"250004"},{"name":"卤莲藕【大盒】","code":"240004"},{"name":"卤凤爪【大盒】","code":"220107"},{"name":"卤鸭胗【大盒】","code":"200209"},{"name":"卤鱿鱼【大盒】","code":"260001"},{"name":"卤香菇【大盒】","code":"290004"},{"name":"卤鸭脖【大盒】","code":"200614"},{"name":"卤鸭翅【大盒】","code":"200010"},{"name":"卤鸭掌【大盒】","code":"200110"},{"name":"卤鸭舌【大盒】","code":"200801"},{"name":"卤鸭头【大盒】","code":"200507"},{"name":"卤鸭腿【大盒】","code":"200708"},{"name":"卤鸡翅尖【大盒】","code":"220007"},{"name":"卤鸭锁骨【大盒】","code":"200409"},{"name":"周黑鸭【卤鹅】","code":"210101"},{"name":"周黑鸭【卤鹅】不辣","code":"210201"},{"name":"酱板鸭","code":"210301"},{"name":"秘制黑鸭","code":"210001"},{"name":"卤香菇【小盒】","code":"290005"},{"name":"卤猪蹄【小盒】","code":"260105"},{"name":"卤鱿鱼【小盒】","code":"260005"},{"name":"卤凤爪【小盒】","code":"220108"},{"name":"卤鸡翅尖【小盒】","code":"220008"},{"name":"卤鸭腿【小盒】","code":"200707"},{"name":"卤鸭头【小盒】","code":"200508"},{"name":"卤鸭锁骨【小盒】","code":"200410"},{"name":"卤鸭掌【小盒】","code":"200112"},{"name":"卤鸭翅【小盒】","code":"200012"},{"name":"卤鸭脖【小盒】","code":"200613"},{"name":"卤鸭舌【小盒】","code":"200809"},{"name":"卤鸭胗【小盒】","code":"200208"},{"name":"卤香干【小盒】","code":"250005"},{"name":"卤鱿鱼【小盒】","code":"260005"},{"name":"辣椒风味酱","code":"360001"},{"name":"牛肉风味酱","code":"360004"},{"name":"豆鼓风味酱","code":"360002"},{"name":"鸭肉风味酱","code":"360003"},{"name":"时尚礼盒","code":"370001"},{"name":"经典礼盒","code":"370002"},{"name":"时尚鸭礼","code":"370005"},{"name":"卤鸭掌【大盒】","code":"200110"},{"name":"卤鸭脖【大盒】","code":"200614"},{"name":"卤鸭锁骨【大盒】","code":"200409"},{"name":"卤鸭翅【大盒】","code":"200010"},{"name":"卤鸡翅尖【小盒】","code":"220008"},{"name":"时尚鸭礼","code":"370005"},{"name":"牛肉酱","code":"360004"},{"name":"鸭肉酱","code":"360003"},{"name":"豆豉酱","code":"360002"},{"name":"辣椒酱","code":"360001"},{"name":"经典礼盒","code":"370002"},{"name":"时尚礼盒","code":"370001"},{"name":"卤鸭头【颗粒198g】","code":"300511"},{"name":"卤鸭锁骨【颗粒115g】","code":"300514"},{"name":"卤鸭腿【颗粒220g】","code":"300710"},{"name":"卤凤爪【颗粒150g】","code":"320106"},{"name":"鸭肉干【颗粒80g】","code":"301305"},{"name":"卤鸭舌【大盒】","code":"200801"},{"name":"卤鱿鱼【大盒】","code":"260001"},{"name":"卤莲藕【大盒】","code":"240004"},{"name":"卤豆腐干【颗粒135g】","code":"350400"},{"name":"卤鸭掌【颗粒160g】","code":"300111"},{"name":"卤鸭舌【颗粒88g】","code":"300810"},{"name":"卤凤爪【大盒】","code":"220107"},{"name":"卤鸭胗【颗粒110g】","code":"301400"},{"name":"卤鸭胗【大盒】","code":"200209"},{"name":"卤鱿鱼【小盒】","code":"260005"},{"name":"卤香菇【大盒】","code":"290004"},{"name":"周黑鸭【卤鹅】不辣","code":"210201"},{"name":"卤鸭翅中【颗粒180g】","code":"300011"},{"name":"卤鸭胗【小盒】","code":"200208"},{"name":"卤猪蹄【大盒】","code":"260104"},{"name":"酱板鸭","code":"210301"},{"name":"卤鸭脖【颗粒180g】","code":"300612"},{"name":"周黑鸭【卤鹅】辣","code":"210101"},{"name":"卤香菇【颗粒128g】","code":"390001"},{"name":"卤鸭腿【大盒】","code":"200708"},{"name":"卤鸡翅尖【大盒】","code":"220007"},{"name":"卤香干【大盒】","code":"250004"},{"name":"卤鸭舌【小盒】","code":"200809"},{"name":"卤鸡翅尖【颗粒170g】","code":"320011"},{"name":"卤猪蹄【小盒】","code":"260105"},{"name":"卤鸭头【大盒】","code":"200507"},{"name":"秘制黑鸭","code":"210001"},{"name":"卤鸭脖【小盒】","code":"200613"},{"name":"卤鸭掌【小盒】","code":"200112A"},{"name":"卤鸭锁骨【小盒】","code":"200410"},{"name":"卤鸭翅【小盒】","code":"200012A"},{"name":"周黑鸭卤鸭脖【小盒】","code":"200613A"},{"name":"周黑鸭卤鸭头【小盒】","code":"200508"},{"name":"周黑鸭卤鸭腿【小盒】","code":"200707"},{"name":"周黑鸭卤凤爪【大盒】","code":"220107"},{"name":"周黑鸭卤鸭锁骨【小盒】","code":"200410A"},{"name":"周黑鸭卤香干【大盒】","code":"250004"},{"name":"周黑鸭卤鸭胗【大盒】","code":"200209"},{"name":"周黑鸭卤鸭锁骨【大盒】","code":"200409A"},{"name":"周黑鸭卤鸭舌【小盒】","code":"200809"},{"name":"周黑鸭卤香干【小盒】","code":"250005"},{"name":"周黑鸭卤鸭翅【小盒】","code":"200012"},{"name":"周黑鸭卤鸭胗【小盒】","code":"200208"},{"name":"周黑鸭卤鸭掌【小盒】","code":"200112"},{"name":"周黑鸭（卤鹅）不辣","code":"210201"},{"name":"周黑鸭卤鱿鱼【大盒】","code":"260001"},{"name":"周黑鸭卤鸡翅尖【小盒】","code":"220008"},{"name":"周黑鸭卤鸡翅尖【大盒】","code":"220007"},{"name":"周黑鸭卤鸭舌【大盒】","code":"200801"},{"name":"周黑鸭卤凤爪【小盒】","code":"220108"},{"name":"周黑鸭卤鸭翅【大盒】","code":"200010"},{"name":"周黑鸭卤鸭腿【大盒】","code":"200708"},{"name":"周黑鸭酱板鸭","code":"210301"},{"name":"周黑鸭卤鱿鱼【小盒】","code":"260005"},{"name":"周黑鸭卤鸭掌【大盒】","code":"200110"},{"name":"周黑鸭卤鸭头【大盒】","code":"200507"},{"name":"周黑鸭卤鸭脖【大盒】","code":"200614"},{"name":"周黑鸭卤香菇【大盒】","code":"290004"},{"name":"周黑鸭卤猪蹄【大盒】","code":"260104"},{"name":"周黑鸭卤猪蹄【小盒】","code":"260105"},{"name":"卤鸭腿【颗粒220g】","code":"300710"},{"name":"卤鸭锁骨【颗粒115g】","code":"300514"},{"name":"鸭肉风味酱","code":"360003"},{"name":"辣椒风味酱","code":"360001"},{"name":"牛肉风味酱","code":"360004"},{"name":"卤鸭锁骨【大盒】","code":"200409"},{"name":"卤鸭脖【颗粒180g】","code":"300612"},{"name":"卤鸡翅尖【小盒】","code":"220008"},{"name":"卤鸭掌【小盒】","code":"200112"},{"name":"卤鸭舌【颗粒88g】","code":"300810"},{"name":"卤鸭脖【小盒】","code":"200613"},{"name":"卤鸭胗【颗粒110g】","code":"301400"},{"name":"卤凤爪【大盒】","code":"220107"},{"name":"卤鸭腿【小盒】","code":"200707"},{"name":"卤鸭翅【大盒】","code":"200010"},{"name":"卤鸭胗【小盒】","code":"200208"},{"name":"卤豆腐干【颗粒135g】","code":"350400"},{"name":"卤鸭锁骨【小盒】","code":"200410"},{"name":"卤花生米【颗粒160g】","code":"300901"},{"name":"周黑鸭【卤鹅】不辣","code":"210201"},{"name":"卤鸡蛋【颗粒120g】","code":"320302"},{"name":"豆鼓风味酱","code":"360002"},{"name":"卤凤爪【颗粒150g】","code":"320106"},{"name":"卤鸭翅【小盒】","code":"200012"},{"name":"卤鸭翅中【颗粒180g】","code":"300011"},{"name":"卤鸡翅尖【颗粒170g】","code":"320011"},{"name":"卤鱿鱼【小盒】","code":"260005"},{"name":"卤香干【小盒】","code":"250005"},{"name":"经典礼盒","code":"370002"},{"name":"时尚礼盒","code":"370001"},{"name":"卤鸭掌【颗粒160g】","code":"300111"},{"name":"卤香菇【大盒】","code":"290004"},{"name":"卤鸭舌【小盒】","code":"200809"},{"name":"卤鸭头【颗粒198g】","code":"300511"},{"name":"卤鸭掌【大盒】","code":"200110"},{"name":"卤香菇【颗粒128g】","code":"390001"},{"name":"卤鸭头【小盒】","code":"200508"},{"name":"酱板鸭","code":"210301"},{"name":"卤鸭脖【大盒】","code":"200614"},{"name":"鸭肉干【颗粒80g】","code":"301305"},{"name":"卤鸭腿【颗粒220g】","code":"300710"},{"name":"卤鸭舌（大盒）","code":"200801"},{"name":"卤鸭脖【小盒】","code":"200613"},{"name":"卤豆腐干【颗粒135g】","code":"350400"},{"name":"卤鸭翅【小盒】","code":"200012A"},{"name":"卤鸡蛋【颗粒34g】","code":"320301"},{"name":"辣椒酱","code":"360001"},{"name":"卤鸭头【颗粒198g】","code":"300511"},{"name":"卤鸭翅【大盒】","code":"200010"},{"name":"卤鸡翅尖【大盒}","code":"220007"},{"name":"卤猪蹄【大盒】","code":"260104"},{"name":"卤鸭锁骨【小盒】","code":"200410"},{"name":"卤鸡翅尖【颗粒170g】","code":"320011"},{"name":"卤鸭掌（大盒）","code":"200110"},{"name":"卤鸭腿【小盒】","code":"200707"},{"name":"豆豉酱","code":"360002"},{"name":"卤香干【大盒】","code":"250004"},{"name":"卤香干【小盒】","code":"250005"},{"name":"卤鸭胗【小盒】","code":"200208"},{"name":"卤花生米【颗粒160g】","code":"300901"},{"name":"卤鸭掌（颗粒160g）","code":"300111"},{"name":"卤鸭脖【颗粒180g】","code":"300612"},{"name":"周黑鸭【卤鹅】不辣","code":"210201"},{"name":"卤凤爪【颗粒150g】","code":"320106"},{"name":"卤鸭锁骨（颗粒115g）","code":"300514"},{"name":"卤鸭舌【小盒】","code":"200809"},{"name":"卤鸭掌【小盒】","code":"200112A"},{"name":"卤鸡翅尖【小盒】","code":"220008"},{"name":"卤鸭翅中【颗粒180g】","code":"300011"},{"name":"周黑鸭【卤鹅】辣","code":"210101"},{"name":"卤鸭腿【大盒】","code":"200708"},{"name":"牛肉酱","code":"360004"},{"name":"卤凤爪【大盒】","code":"220107"},{"name":"卤鸭锁骨【大盒】","code":"200409"},{"name":"卤鸭胗【大盒】","code":"200209"},{"name":"卤鸭脖【大盒】","code":"200614"},{"name":"卤香菇【颗粒128g】","code":"390001"},{"name":"卤鸭头【小盒】","code":"200508"},{"name":"卤鸭胗【颗粒110g】","code":"301400"},{"name":"鸭肉酱","code":"360003"},{"name":"酱板鸭","code":"210301"},{"name":"卤鸭舌【颗粒88g】","code":"300810"},{"name":"卤鸭头【大盒】","code":"200507"},{"name":"卤猪蹄【小盒】","code":"260105"},{"name":"卤鸡翅尖（颗粒170g）","code":"320011"},{"name":"周黑鸭（卤鹅）不辣","code":"210201"},{"name":"卤鸭舌（颗粒88g）","code":"300810"},{"name":"卤香菇（颗粒128g）","code":"390001"},{"name":"卤豆腐干（颗粒135g）","code":"350400"},{"name":"卤鸡翅尖（颗粒170g）","code":"320011"},{"name":"卤鸭胗（颗粒110g）","code":"301400"},{"name":"卤鸭掌（颗粒160g）","code":"300111"},{"name":"卤鸭翅中（颗粒180g）","code":"300011"},{"name":"卤鸭脖（颗粒180g）","code":"300612"},{"name":"卤香菇（小盒）","code":"290005"},{"name":"卤猪蹄（小盒）","code":"260105"},{"name":"卤鱿鱼（小盒）","code":"260005"},{"name":"卤凤爪（小盒）","code":"220108"},{"name":"卤鸡翅尖（小盒）","code":"220008"},{"name":"卤鸭腿（小盒）","code":"200707"},{"name":"卤鸭头（小盒）","code":"200508"},{"name":"卤鸭锁骨（小盒）","code":"200410"},{"name":"卤鸭掌（小盒）","code":"200112"},{"name":"卤鸭翅（小盒）","code":"200012"},{"name":"卤鸭脖（小盒）","code":"200613"},{"name":"卤鸭舌（小盒）","code":"200809"},{"name":"卤鸭胗（小盒）","code":"200208"},{"name":"卤香干（小盒）","code":"250005"},{"name":"卤猪蹄（大盒）","code":"260104"},{"name":"卤香干（大盒）","code":"250004"},{"name":"卤莲藕（大盒）","code":"240004"},{"name":"卤凤爪（大盒）","code":"220107"},{"name":"卤鸭胗（大盒）","code":"200209"},{"name":"卤鱿鱼（大盒）","code":"260001"},{"name":"卤香菇（大盒）","code":"290004"},{"name":"卤鸭脖（大盒）","code":"200614"},{"name":"卤鸭翅（大盒）","code":"200010"},{"name":"卤鸭掌（大盒）","code":"200110"},{"name":"卤鸭舌（大盒）","code":"200801"},{"name":"卤鸭头（大盒）","code":"200507"},{"name":"卤鸭腿（大盒）","code":"200708"},{"name":"卤鸡翅尖（大盒）","code":"220007"},{"name":"卤鸭锁骨（大盒）","code":"200409"},{"name":"周黑鸭（卤鹅）","code":"210101"},{"name":"酱板鸭","code":"210301"},{"name":"秘制黑鸭","code":"210001"},{"name":"卤鸡蛋（颗粒120g）","code":"320302"},{"name":"卤花生米（颗粒160g）","code":"300901"},{"name":"卤凤爪（颗粒150g）","code":"320106"},{"name":"卤鸭腿（颗粒220g）","code":"300710"},{"name":"鸭肉干（颗粒80g）","code":"301305"},{"name":"卤鸭头（颗粒198g）","code":"300511"},{"name":"卤鸭锁骨（颗粒115g）","code":"300514"},{"name":"卤鸭舌（颗粒88g）","code":"300810"},{"name":"卤香菇(小盒)","code":"290005"},{"name":"卤猪蹄(小盒)","code":"260105"},{"name":"卤鱿鱼(小盒)","code":"260005"},{"name":"卤凤爪(小盒)","code":"220108"},{"name":"卤鸡翅尖(小盒)","code":"220008"},{"name":"卤鸭腿(小盒)","code":"200707"},{"name":"卤鸭头(小盒)","code":"200508"},{"name":"卤鸭锁骨(小盒)","code":"200410"},{"name":"卤鸭掌(小盒)","code":"200112"},{"name":"卤鸭翅(小盒)","code":"200012"},{"name":"卤鸭脖(小盒)","code":"200613"},{"name":"卤鸭舌(小盒)","code":"200809"},{"name":"卤鸭胗(小盒)","code":"200208"},{"name":"卤香干(小盒)","code":"250005"},{"name":"卤猪蹄(大盒)","code":"260104"},{"name":"卤香干(大盒)","code":"250004"},{"name":"卤莲藕(大盒)","code":"240004"},{"name":"卤凤爪(大盒)","code":"220107"},{"name":"卤鸭胗(大盒)","code":"200209"},{"name":"卤鱿鱼(大盒)","code":"260001"},{"name":"卤香菇(大盒)","code":"290004"},{"name":"卤鸭脖(大盒)","code":"200614"},{"name":"卤鸭翅(大盒)","code":"200010"},{"name":"卤鸭掌(大盒)","code":"200110"},{"name":"卤鸭舌(大盒)","code":"200801"},{"name":"卤鸭头(大盒)","code":"200507"},{"name":"卤鸭腿(大盒)","code":"200708"},{"name":"卤鸡翅尖(大盒)","code":"220007"},{"name":"卤鸭锁骨(大盒)","code":"200409"},{"name":"卤鸡蛋(颗粒120g)","code":"320302"},{"name":"卤花生米(颗粒160g)","code":"300901"},{"name":"卤凤爪(颗粒150g)","code":"320106"},{"name":"卤鸭腿(颗粒220g)","code":"300710"},{"name":"鸭肉干(颗粒80g)","code":"301305"},{"name":"卤鸭头(颗粒198g)","code":"300511"},{"name":"卤鸭锁骨(颗粒115g)","code":"300514"},{"name":"卤鸭舌(颗粒88g)","code":"300810"}]';
	}
	
	defaultFoodsMould = eval("(" + defaultFoodsMould + ")");
  
	if(currPlatType == 1){
		return matchMtFoods(defaultFoodsMould);
	}else {
		return matchBdFoods(defaultFoodsMould);
	}
}

// 获取菜品模板数据
function getFoodsMould() {
	var defaultFoodsMould = [];
	try {
		var foodCodeObj = document.querySelectorAll("input.food_spu_code_all_class");
		var foodNameObj = document.querySelectorAll(".J-text-revise.spu_name_for_located");
		var foodSkuidObj = document.querySelectorAll("input.food_code_class");

		foodNameObj.forEach(function(el, pos) {
			var food = {};
			var fn, fc, fs;
			fn = el.innerHTML.trim() || '';
			if (fn == '') {
				return ;
			}

			foodCodeObj.forEach(function(el, index) {
				if (pos == index) {
					fc = el.attributes.value.value.trim();
					return;
				}
			});
			foodSkuidObj.forEach(function(el, index) {
				if (pos == index) {
					fs = el.attributes.value.value.trim();
					return;
				}
			});
			food.name = fn;
			food.code = fc;
			food.skuid = fs;
			defaultFoodsMould.push(food);

		});

	} catch (e) {
		console.log(e);
	}
	return JSON.stringify(defaultFoodsMould);
}

// 获取百度菜品模板 ps: 多页面的 都复制一下拼接成一个完成的菜品模板
function getBdFoodsMould(){
  var defaultFoodsMould = [];
	try {
		var foodsTableObj = document.querySelectorAll(".table tr");
		
		foodsTableObj.forEach(function(el,index){
			if(index > 0){
				var foodTrObj = el.querySelectorAll('td');
				foodCode = foodTrObj[0];
				foodName = foodTrObj[2];
				foodCodeInputObj = foodCode.querySelector('#other-dish-id');
				FoodCodeStr = foodCodeInputObj.attributes.value.value;
				FoodNameStr = foodName.innerHTML.trim().replace(/<[^>]+>/g,"") || '';
				var food = {};
				food.name = FoodNameStr;
				food.code = FoodCodeStr;
				defaultFoodsMould.push(food);
			}
		});
	} catch (e) {
		console.log(e);
	}
	
	console.log(JSON.stringify(defaultFoodsMould));
}

// 百度菜品匹配
function matchBdFoods(defaultFoodsMould){
	var unMatchFoods = [];
	try {
		var foodsTableObj = document.querySelectorAll(".table tr");

		// foodsTableObj.forEach(function(el,index){
		for ( var index in foodsTableObj) {
			var el = foodsTableObj[index];
            
			if(index > 0){
				var foodTrObj = el.querySelectorAll('td');
				foodCode = foodTrObj[0];
				foodName = foodTrObj[2];
				foodCodeInputObj = foodCode.querySelector('#other-dish-id');
				oldFoodCodeStr = foodCodeInputObj.attributes.value.value;
				oldFoodNameStr = foodName.innerHTML.trim().replace(/<[^>]+>/g,"") || '';
				
				// 添加菜品匹配说明列
				var foodInfoTd = el.insertCell();
				foodInfoTd.style = 'font-weight:bold;';
				foodInfoTd.style.color = '#E07026';
				foodInfoTd.innerHTML = '原第三方菜品ID['+oldFoodCodeStr+']';
				
				if(oldFoodNameStr){
					var dfmIndex = -1;
					for ( var key in defaultFoodsMould) {
						var dfn = defaultFoodsMould[key].name;
						if (oldFoodNameStr == dfn) {
							dfmIndex = key;
							break;
						}
					}
					
					// 设置input样式属性
					foodCodeInputObj.style = "line-height:28px;font-weight:bold;padding-left:8px;";
					
					if(dfmIndex >= 0){
						// 已匹配
						foodCodeInputObj.value = defaultFoodsMould[dfmIndex].code;
						foodCodeInputObj.style.border = "2px solid #ffe363";
					}else {
						// 未匹配
						foodCodeInputObj.style.border = "2px solid #CD853F";
						foodCodeInputObj.style.color = "#CD853F";
						foodInfoTd.style.color = "#CD853F";
						foodName.style.color = "#CD853F";
						
						// foodNameObj[nk].innerHTML = "<font size='2'
						// color='red'> " + fn + "<strong>[未匹配]</strong></font>"
						// + "<br>原food_code[<font
						// color='blue'><strong>"+fccObj.attributes.value.value+"</strong></font>]<br>原sku_id[<strong><font
						// color='blue'>"+fscObj.attributes.value.value+"</font></strong>]";
            unMatchFoods.push("["+oldFoodNameStr+"]\n");
					}

				}

			}else {
				// 添加一列表头
				var foodInfoTd = el.insertCell();
				foodInfoTd.style = 'font-weight:bold;';
				foodInfoTd.innerHTML = '菜品匹配说明';
				// console.log(el.parentNode,);
			}
		}
		// });*/
	} catch (e) {
		console.log(e);
	}
	console.log(unMatchFoods);
	document.querySelector("#matchFood").style = "pointer-events: none;cursor: default;color: #F5F5F5";
	return unMatchFoods.join('');
}

// 美团菜品匹配
function matchMtFoods(defaultFoodsMould){
	var unMatchFoods = [];
	try {
		var foodCodeObj = document.querySelectorAll("input.food_spu_code_all_class");
		var foodNameObj = document.querySelectorAll(".J-text-revise.spu_name_for_located");
		var foodSkuidObj = document.querySelectorAll("input.food_code_class");

		for ( var nk in foodNameObj) {
			var fccObj, fscObj;
			for ( var ck in foodCodeObj) {
				if (nk == ck) {
					fccObj = foodCodeObj[ck];
					break;
				}
			}
			for ( var sk in foodSkuidObj) {
				if (nk == sk) {
					fscObj = foodSkuidObj[sk];
					break;
				}
			}

			var el = foodNameObj[nk];
			if (typeof el == 'object') {
				var fn = el.innerHTML.trim() || '';
				var dfmIndex = -1;
				for ( var key in defaultFoodsMould) {
					var dfn = defaultFoodsMould[key].name;
					if (fn == dfn) {
						dfmIndex = key;
						break;
					}
				}

				if (dfmIndex < 0) {
					if (fccObj) {
						fccObj.style.border = "2px solid #CD853F";
					}
					if (fscObj) {
						fscObj.style.border = "2px solid #CD853F";
					}

					foodNameObj[nk].innerHTML = "<font size='2' color='red'> " + fn + "<strong>[未匹配]</strong></font>" + "<br>原food_code[<font color='blue'><strong>"+fccObj.attributes.value.value+"</strong></font>]<br>原sku_id[<strong><font color='blue'>"+fscObj.attributes.value.value+"</font></strong>]";
          
          unMatchFoods.push("["+fn+"]\n");
          
				} else {
					foodNameObj[nk].innerHTML = fn + "<br>原food_code[<font color='blue'><strong>"+fccObj.attributes.value.value+"</strong></font>]<br>原sku_id[<strong><font color='blue'>"+fscObj.attributes.value.value+"</font></strong>]";
					if (fccObj) {
						fccObj.value = defaultFoodsMould[dfmIndex].code
						fccObj.style.border = "2px solid #CD853F";
					}
					if (fscObj) {
						fscObj.value = defaultFoodsMould[dfmIndex].skuid || defaultFoodsMould[dfmIndex].code;
						fscObj.style.border = "2px solid #CD853F";
					}
				}
			}
		}
	} catch (e) {
		console.log(e);
	}
	
	document.querySelector("#matchFood").style = "pointer-events: none;cursor: default;color: #F5F5F5";
	return unMatchFoods.join('');
}

// ===================================================================

// 创建美团门店授权code 日志提示
function createShopCodeLogTips(){
    // 创建div dom
	hobj = document.createElement("div");
	// 设置 div style属性
	hobj.style.position = 'fixed';
	hobj.style.right = '20px';
	hobj.style.bottom = '195px';
	hobj.style.width = '315px';
	hobj.style.height = '40px';
	var tipCls = 'alert alert-info';
	var tipHmtl = '<div class="'+tipCls+'" style="font-size: 13px"><h4 class="text-center" style="margin-top: 6px;">匹配日志</h4><span id="tips"></span></div>';
	// 设置div对象内容
	hobj.innerHTML = tipHmtl;
	// 宿主
	hobjParentcls = 'main-container';
	// 加载
	document.querySelector('body').appendChild(hobj);
}

function addLogsToTips(msg){
    var tipObj = document.querySelector('#tips');
    tipHtml = tipObj.innerHTML;
    console.log(tipObj,tipHtml);
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    var dates = year+'-'+month+'-'+day+' '+hour + ':'+ minute+':'+second;
    msg = dates + " " + msg;
    tipObj.innerHTML = tipHtml + "<p>" + msg+"</p>";
}

// 执行美团门店授权code匹配
function runMatchShopCode(){
    var ggg = window.setInterval(function(){
        console.log('==================开始匹配============================');
        addLogsToTips('4324');
        var info = matchMtShopCode();
        if(info){
            if(info != true){
                alert("以下门店未匹配:\n"+info);
            }
            window.clearInterval(ggg);
            console.log('==================结束匹配============================');
            // 匹配结束调用监控
            runLoopGetShopFlag();
        }
    },1000);
}

// 执行循环获取门店页面标记
function runLoopGetShopFlag(){
    // 循环执行方式进行监控
    var lll = window.setInterval(function(){
        console.log('==================开始监控============================');
        getMtShopCodeFlag();
        if(pageFlag != opageFlag){
            runMatchShopCode();
            opageFlag = pageFlag;
        }
    },1000);
}

// 处理美团门店授权code匹配
function matchMtShopCode(){
	var cannotMathShops = [],shopList = [],shop_code_map = [["GZ003",1866802],["GZ004",279166],["GZ005",1893424],["GZ007",1866811],["GZ008",1866803],["GZ009",279176],["GZ010",1281890],["GZ013",707503],["GZ014",1866804],["GZ018",707563],["GZ019",707532],["GZ020",1282790],["GZ024",707520],["GZ025",1866809],["GZ032",279192],["GZ033",279195],["GZ034",707521],["GZ035",707506],["GZ036",1282384],["GZ037",1866806],["GZ038",1730250],["GZ039",707525],["GZ041",707571],["GZ042",370329],["GZ043",707564],["GZ044",707565],["GZ045",1281930],["GZ046",707524],["GZ047",1866807],["GZ048",1866810],["GZ049",707572],["GZ050",707507],["GZ052",1866906],["GZ053",707511],["GZ056",1866805],["GZ057",1281931],["GZ067",1730251],["GZ060",1866808],["GZ063",707519],["GZ064",1866811],["GZ065",1866813],["GZ066",1866814],["GZ073",1281932],["GZ078",707517],["GZ079",1281934],["GZ075",1866812],["GZ076",1757824],["GZ058",707512],["GZ068",707505],["GZ086",1866821],["GZ062",707567],["GZ081",1281927],["GZ083",707537],["GZ090",1866822],["GZ087",1281929],["GZ088",1866819],["GZ061",707569],["GZ084",1866820],["GZ082",1866815],["GZ092",279164],["GZ069",1281928],["GZ093",1281933],["GZ094",1281925],["GZ096",1866816],["GZ097",1866817],["SZ003",279256],["SZ004",279247],["SZ006",707188],["SZ007",279227],["SZ008",1281888],["SZ009",1866824],["SZ012",1866825],["SZ013",283009],["SZ015",279220],["SZ016",708433],["SZ017",282999],["SZ019",1866827],["SZ022",1281892],["SZ024",707463],["SZ025",283004],["SZ026",1281886],["SZ027",1866826],["SZ028",1866907],["SZ029",279213],["SZ031",279228],["SZ033",279216],["SZ034",707484],["SZ035",279248],["SZ037",1866828],["SZ038",1866832],["SZ040",1866830],["SZ041",707467],["SZ042",279239],["SZ044",1866829],["SZ045",279240],["SZ051",1866831],["SZ053",707468],["SZ056",1866835],["SZ057",1866834],["SZ058",707469],["SZ059",707485],["SZ060",708420],["SZ062",1866833],["SZ063",1282167],["SZ064",707487],["SZ065",707478],["SZ066",707486],["SZ068",707474],["SZ069",707465],["SZ070",707459],["SZ071",707480],["SZ073",707476],["SZ074",1281887],["SZ075",1281884],["SZ079",707479],["SZ072",1866836],["SZ076",1281926],["SZ077",1281885],["SZ078",707473],["SZ043",279264],["SZ081",1757799],["SZ082",1866837],["SZ083",1282124],["SZ085",1282168],["SZ088",1281891],["SZ086",1730253],["SZ087",1282344],["SZ090",1281889],["SZ089",1730252],["SZ091",1730247],["SZ093",1730282],["SZ092",1866838],["DG001",707431],["DG002",707429],["DG004",707428],["DG005",707436],["DG006",707430],["DG007",707432],["DG008",707434],["DG009",707433],["DG010",707287],["DG018",1730243],["DG015",707430],["DG013",1730241],["DG024",1661204],["DG026",1866801],["JX001",707628],["JX002",707624],["JX003",707604],["JX004",707633],["JX005",707625],["JX006",707630],["JX007",707603],["JX008",707632],["JX009",707627],["JX010",707626],["JX011",707629],["JX012",707622],["JX013",707679],["JX014",707638],["JX015",707654],["JX016",707659],["JX017",707636],["JX018",707655],["JX020",707637],["JX021",707623],["JX025",707635],["JX027",707639],["JX030",707656],["JX035",1757795],["JX036",1757798],["JX037",707605],["JX038",707631],["JX039",707663],["JX040",707662],["JX042",707661],["JX043",707657],["JX045",707621],["JX048",1767849],["JX049",1757796],["HN010",661595],["HN014",680264],["HN016",661598],["HN018",661597],["HN019",661414],["HN021",661412],["HN023",661411],["HN026",661413],["HN029",661593],["HN030",661596],["HN035",661410],["HN041",661594],["HN037",661583],["HN039",661591],["HN031",661585],["HN032",661586],["HN033",661584],["HN043",1893587],["HN044",1661019],["HN045",1661031],["ZZ001",707586],["ZZ003",707097],["ZZ004",707379],["ZZ005",707380],["ZZ006",707378],["ZZ007",707100],["ZZ008",707101],["ZZ012",707364],["ZZ014",707363],["ZZ015",707366],["ZZ016",707365],["ZZ017",707381],["ZZ018",707102],["ZZ019",707099],["ZZ020",707377],["ZZ021",707103],["ZZ022",707382],["ZZ023",707376],["ZZ024",707098],["ZZ028",1661023],["ZZ025",1757801],["ZZ032",1661022],["TJ003",1449585],["TJ006",1449579],["TJ007",1449617],["TJ009",1449616],["TJ011",1449618],["TJ012",1449620],["TJ014",1449627],["BJ003",457279],["BJ004",457371],["BJ005",279040],["BJ007",457538],["BJ008",279077],["BJ009",278942],["BJ010",457375],["BJ011",457544],["BJ012",457372],["BJ013",279078],["BJ014",278985],["BJ015",224152],["BJ016",1449629],["BJ017",457526],["BJ018",279016],["BJ019",279015],["BJ021",367814],["BJ023",279018],["BJ024",279019],["BJ026",278973],["BJ027",278925],["BJ028",279029],["BJ029",279008],["BJ030",457527],["BJ032",278930],["BJ034",279087],["BJ035",278923],["BJ036",278921],["BJ040",457396],["BJ041",457531],["BJ042",457532],["BJ044",457533],["BJ045",457534],["BJ046",457536],["BJ047",457535],["BJ048",457537],["BJ049",385055],["BJ050",457539],["BJ051",457433],["BJ052",457547],["BJ053",1866753],["BJ054",457545],["BJ055",457548],["BJ057",457541],["BJ058",457543],["BJ061",457549],["BJ062",367900],["BJ064",349460],["BJ065",457571],["BJ066",457573],["BJ067",457572],["BJ069",457603],["BJ073",279063],["BJ075",457576],["BJ077",457373],["BJ204",1449633],["BJ078",354764],["BJ082",457581],["BJ083",457392],["BJ086",457444],["BJ080",1449630],["BJ087",1449581],["BJ088",1449631],["BJ092",1154999],["BJ085",1449628],["BJ091",1866760],["BJ093",1866757],["BJ094",1449580],["TJ015",1449587],["TJ017",1449623],["BJ089",1449632],["TJ010",1449619],["BJ096",1154997],["BJ098",1449577],["BJ095",1449634],["TJ019",1449626],["TJ021",1449622],["BJ200",1449625],["TJ018",1449621],["BJ097",1449615],["BJ202",1866759],["BJ207",1866761],["TJ022",1893497],["BJ201",1866758],["BJ206",1866755],["TJ023",1866751],["JS001",707415],["JS007",707419],["JS009",707424],["JS010",707418],["JS013",707416],["JS014",707426],["JS017",707427],["JS018",707420],["JS021",707421],["JS020",707422],["JS011",707425],["JS012",707417],["JS016",707414],["JS019",707423],["JS023",707394],["JS022",1154926],["JS025",1154927],["JS027",1154929],["JS028",1154938],["JS029",1154937],["JS024",1154936],["JS031",1449613],["JS032",1154935],["JS035",1449578],["JS037",1661027],["JS041",1661026],["JS042",1661029],["JS044",1767850],["JS039",1866770],["JS033",1866768],["JS046",1866769],["ZJ014",707392],["ZJ001",1154941],["ZJ002",1154932],["ZJ003",707387],["ZJ004",707384],["ZJ005",707385],["ZJ006",707388],["ZJ007",279204],["ZJ008",707391],["ZJ010",707389],["ZJ011",707383],["ZJ012",707386],["ZJ015",1154940],["ZJ016",707393],["ZJ013",707390],["ZJ009",1154928],["NB001",1060882],["ZJ018",1154933],["NB003",1060880],["NB002",1449582],["ZJ020",1449584],["SH004",965451],["SH006",359172],["SH007",359171],["SH008",387765],["SH011",927238],["SH013",361296],["SH014",359173],["SH015",279142],["SH016",965452],["SH020",279143],["SH026",279135],["SH027",279155],["SH029",965449],["SH032",384529],["SH046",965448],["SH034",965447],["SH036",965450],["SH039",965453],["SH040",965455],["SH038",965457],["SH043",874687],["SH048",965454],["SH049",965456],["SH050",1154939],["SH054",1449722],["SH055",1449721],["SH056",1449583],["SH059",1661032],["SH060",1767851],["SH066",1767852],["CQ001",433615],["CQ002",433590],["CQ004",433606],["CQ003",433598],["CQ005",467908],["CQ014",433639],["CQ013",433633],["CQ018",433666],["CQ012",718931],["CQ017",716095],["CQ022",730793],["CQ025",730795],["CQ020",730794],["CQ028",1866771],["CQ029",1154998],["CQ030",1661020]];
	try {
		var shopInfoTable = document.querySelectorAll("body #wrapper #main-container .page-poibind .panel-body .row")[1];
        //console.log(shopInfoTable);
        var tableTrs = shopInfoTable.querySelectorAll('tr');
		for(var index in tableTrs){
			var el = tableTrs[index];
			if(index > 0 && typeof el == "object"){
				var shopid = el.querySelectorAll('td')[1];
				var shopcode = el.querySelector(".form-control");
                console.log(shopid,shopcode);
                if(shopid && shopcode){
                    shopid = shopid.innerHTML.trim();
                    if(index == 1){
                        // 以第一个门店id为页面是否更新为依据
                        pageFlag = shopid;
                        if(opageFlag == ''){
                            opageFlag = pageFlag;
                        }
                    }
                    var newcode = '';
                    for(var k in shop_code_map){
                        var vals = shop_code_map[k];
                        if(shopid == vals[1]){
                            newcode = vals[0];
                            break;
                        }
                    }
                    if(newcode){
                         shopcode.value = newcode; // shopcode.attributes.value.value
                    }else {
                        // 无对应匹配
                        cannotMathShops.push(el.querySelectorAll('td')[2].innerHTML.trim());
                        shopcode.style.border = "2px solid #eee363";
						shopcode.style.color = "#eee363";
                        el.style.border = "2px solid #eee111";
                    }
                }else {
                	return false;
                }
                console.log('|==========================================');
                console.log('n',shopid);
                console.log('c',shopcode);
                console.log('==========================================|');
			}
		}
	}catch(e){
		console.log(e);
        return false;
    }
    var retval = true;
    if(cannotMathShops.length > 0){
        retval = cannotMathShops.join(',');
    }
    return retval;
}

// 获取美团门店授权页面标记
function getMtShopCodeFlag(){
    try{
        var shopInfoTable = document.querySelectorAll("body #wrapper #main-container .page-poibind .panel-body .row")[1];
        //console.log(shopInfoTable);
        var tableTrs = shopInfoTable.querySelectorAll('tr');
		for(var index in tableTrs){
			var el = tableTrs[index];
			if(index > 0 && typeof el == "object"){
				var shopid = el.querySelectorAll('td')[1];
				var shopcode = el.querySelector(".form-control");
                //console.log(shopid,shopcode);
                if(shopid && shopcode){
                    shopid = shopid.innerHTML.trim();
                    if(index == 1){
                        // 以第一个门店id为页面是否更新为依据
                        pageFlag = shopid;
                        if(opageFlag == ''){
                            opageFlag = pageFlag;
                        }
                    }
                }
            }
        }
    }catch(e){
        console.log(e);
        return false;
    }
}

// 字符串去手尾空格
String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, '');
};

String.prototype.tagtrim = function() {
	return this.replace(/<[^>]+>/g, '');
};

function loadXmlString(str) {
	try {
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async = "false";
		xmlDoc.loadXML(str);
		return xmlDoc;
	} catch (e) {
		// Firefox, Mozilla, Opera, etc.
		try {
			parser = new DOMParser();
			xmlDoc = parser.parseFromString(str, "text/xml");
			return xmlDoc;
		} catch (e) {
			console.log(e.message);
		}
	}
}

// allow pasting

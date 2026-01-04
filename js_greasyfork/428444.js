// ==UserScript==
// @name        🔥🆕移除百度推广和广告内容🔥
// @namespace   http://tampermonkey.net/
// @version     3.0.2
// @author      iemsauce3
// @description [正常使用 🟢]移除烦人和可能不确信的推广及广告（小浮窗监视屏蔽数量，可手动关闭）
// @match       *://*.baidu.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/428444/%F0%9F%94%A5%F0%9F%86%95%E7%A7%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E6%8E%A8%E5%B9%BF%E5%92%8C%E5%B9%BF%E5%91%8A%E5%86%85%E5%AE%B9%F0%9F%94%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/428444/%F0%9F%94%A5%F0%9F%86%95%E7%A7%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E6%8E%A8%E5%B9%BF%E5%92%8C%E5%B9%BF%E5%91%8A%E5%86%85%E5%AE%B9%F0%9F%94%A5.meta.js
// ==/UserScript==
//----------------------------------------------------------

//重新封装Storage
class Storage{
    constructor(name){
        this.name = 'storage';
    }
    //设置缓存
    setItem(params){
        let obj = {
            name:'',
            value:'',
            date:todayFormate()//记录何时将值存入缓存，eg: 2022-04-22
        }
        let options = {};
        //将obj和传进来的params合并
        Object.assign(options,obj,params);
        //如果options.expires没有设置，就判断一下value的类型
        let type = Object.prototype.toString.call(params);
        //如果value是对象或者数组对象的类型，就先用JSON.stringify转一下，再存进去
        if(type == '[object Object]' || type == '[object Array]'){
            options = JSON.stringify(options);
        }
        localStorage.setItem(params.name,options);
    }
    setItemValue(name,value){
        let item = this.getItemObj(name);
        let type = Object.prototype.toString.call(item);
        if(item == null || type == '[object Object]' || type == '[object Array]'){
            this.setItem({name:name, value:value});
        }
        else{
            localStorage.setItem(name,value);
        }
    }
    getItemObj(name){
        let item = localStorage.getItem(name);
        //先将拿到的试着进行json转为对象的形式
        try{
            item = JSON.parse(item);
        }catch(error){
            //如果不行就不是json的字符串，就直接返回
            item = item;
        }
        return item;
    }
    //拿到缓存
    getItemValue(name){
        let item = localStorage.getItem(name);
        if(item == null) return item;
        //先将拿到的试着进行json转为对象的形式
        try{
            item = JSON.parse(item);
        }catch(error){
            //如果不行就不是json的字符串，就直接返回
            item = item;
        }
        let type = Object.prototype.toString.call(item);
        if(type == '[object Object]' || type == '[object Array]'){
            return item.value;
        }else{
            return item;
        }
    }
    //移出缓存
    removeItem(name){
        localStorage.removeItem(name);
    }
    //移出全部缓存
    clear(){
        localStorage.clear();
    }
}



var tgTotal=0, ggTotal=0; removeTimes=0;
var todayAds = 0, allAds = 0;
var adsInterval = null;
$(document).ready(function(){
    initStorage(); //初始化
    var uri = window.location.href;
    if(uri.indexOf('baidu.com') < 0) return;
    if(uri.indexOf('fanyi.baidu.com') > 0) {
        $('#footer-products-container').remove();
        $('.follow-wrapper').remove();
    }
    else if(uri.indexOf('www.baidu.com') > 0){
        $('#wrapper_wrapper').before(`<div style="display:none;"><a id="closeView" style="position: fixed; bottom: 25px; right:60px;">关闭浮窗</a><p id="fuck_baidu_ads" style="z-index:999;background-color:white;color:black;width: 140px;position: fixed;padding: 5px;box-shadow: 2px 2px 3px #5072EE;margin: 0 5px;border: 1px solid #5072EE;text-align:center; bottom:50px; right: 10px;">「广告+推广」<br />今日过滤 <b style="color:red;">0</b> 条<br />总计 <b id="allAds" style="color:green;">0</b> 条</p></div><div style="display:none;"><a id="showView" style="position: fixed; bottom: 25px; right:60px;">拦截情况</a></div>`);
    setTimeout(function(){
        if(getCookie("close") == ""){
            $('#closeView').parent().show();
            $('#showView').parent().hide();
        }
        else{
            $('#closeView').parent().hide();
            $('#showView').parent().show();
        }
        removePre();
    },500);
    $('#su').click(function(){
        console.log('点击了搜索');
        removePre();
    });
    
    $('#page div a').click(function(){
        console.log('点击了页码');
        removePre();
    });
    
    $('#closeView').click(function(){
        $(this).parent().hide();
        setCookie("close","true",7*24*3600);
        $('#showView').parent().show();
    });
    $('#showView').click(function(){
        $(this).parent().hide();
        setCookie("close","true",0.1);
        $('#closeView').parent().show();
    });
    }
    
});

// 初始化相关storage
initStorage = function(){
    let initFlag = localStorage.getItem('initFlag');
    if(initFlag == 1) return;
    console.log('【移除百度推广和广告内容】初始化数据...');
    let storage = new Storage();
    storage.setItem({name:'todayAds',value:0});
    storage.setItem({name:'allAds',value:0});
    localStorage.setItem('initFlag',1);
    console.log('【移除百度推广和广告内容】初始化完成！');
}

var removePre = function(){
    //每次手动按“搜索”后广告移除次数阀值清零
    removeTimes = 0;
    adsInterval = setInterval(function(){
        removeTimes++;
        removeAds();
        if(removeTimes==2) reBindEvent();
    },1000);
}

var removeAds = function(){
    getStorageAdCounts();
    var rs='';
    var content = $('#content_left');
    var tuiguang = content.find('.ec-tuiguang');
    var newAds = 0;
    if(tuiguang.length>0){
        tgTotal+=tuiguang.length;
        for(var i=0;i<tuiguang.length;i++){
            let tgDiv = $(tuiguang[i]).parentsUntil('#content_left');
            $(tgDiv).remove();
        }
        newAds++;
    }
    var spans=content.find('a');
//     spans = spans.concat(content.find('span'));
    var ggCounts=0;
    for(var i=0;i<spans.length;i++){
        if($(spans[i]).html()=='广告'){
            let ggDiv = $(spans[i]).parentsUntil('#content_left');
            $(ggDiv).remove();
            ggDiv = $(spans[i]).parentsUntil('.result c-container new-pmd');
            $(ggDiv).remove();
            ggCounts++;
            ggTotal++;
            newAds++;
        }
    }
    todayAds += newAds;
    allAds += newAds;
//     console.log('newAds@'+newAds+'@allAds@'+allAds);
    $('#fuck_baidu_ads b').html(todayAds);
    $('#allAds').html(allAds);
    let storage = new Storage();
    storage.setItemValue('todayAds',todayAds);
    storage = new Storage();
    storage.setItemValue('allAds',allAds);
    if(removeTimes > 10){
        clearInterval(adsInterval);
        removeTimes = 0;
        console.log('Interval Over');
    }
}

//重新绑定事件
reBindEvent = function(){
    console.log('reBindEvent');
    $('#page div a').unbind('click').bind('click',function(){
        console.log('reBindEvent-点击了页码');
        removePre();
    });
    $('#rs_new a').unbind('click').bind('click',function(){
        console.log('reBindEvent-点击了相关搜索下的按钮');
        removePre();
    });
}

function setCookie(cname,cvalue,exdays){
	var d = new Date();
	d.setTime(d.getTime()+(exdays*1000));
	var expires = "expires="+d.toGMTString();
	document.cookie = cname+"="+cvalue+"; "+expires;
}
function getCookie(cname){
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
		var c = ca[i].trim();
		if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
	}
	return "";
}

var getStorageAdCounts = function(){
    let storage = new Storage();
    let todayAdsObj = storage.getItemObj('todayAds');
    if(todayAdsObj == null || !todayAdsObj.value || todayAdsObj.date != todayFormate()) {
        storage.setItem({name:'todayAds',value:0});
        todayAds = 0;
    }
    else {
        todayAds = todayAdsObj.value
    }
    let allAds_ = storage.getItemValue('allAds');
    allAds = allAds_ == null ? 0 : allAds_;
    storage = new Storage();
    storage.setItem({name:'allAds',value:allAds});
}

String.format = function(src){
    if (arguments.length == 0) return null;
    var args = Array.prototype.slice.call(arguments, 1);
    return src.replace(/\{(\d+)\}/g, function(m, i){
        return args[i];
    });
};

//格式化日期
todayFormate = function(formate = 'yyyy-MM-dd'){
    let today = new Date();
    switch(formate){
        case 'yyyyMMdd':formate='{0}{1}{2}';break;
        default:formate='{0}-{1}-{2}';break;
    }
    return String.format(formate,today.getFullYear(), 
                         today.getMonth() < 9 ? '0'+(today.getMonth() + 1):today.getMonth() + 1, 
                         today.getDate() < 10 ? '0'+today.getDate():today.getDate());
}
// ==UserScript==
// @name 从谷歌 百度 必应搜索结果中屏蔽自定义关键字 增强版（基于AC的脚本优化）
// @namespace BlockAnyThingYouWant Plus
// @include http://www.baidu.com/*
// @include https://www.baidu.com/*
// @include https://www.google.com/*
// @include /^https?\:\/\/encrypted.google.[^\/]+/
// @include /^https?\:\/\/www.google.[^\/]+/
// @include /^https?\:\/\/www.so.com/
// @include /^https?\:\/\/www.youdao.com/
// @require http://code.jquery.com/jquery-1.8.0.min.js
// @author       zzhjim( Based on AC)
// @version 3.1.0.250911
// @description 基于AC脚本制作，新增大量关键词，欢迎结合本人其他脚本使用，如有意见请反馈至zzhjim@vip.qq.com（也可向原作者反馈）
// @grant note 2021.12.6 第3.1版 zzhjim：调整部分关键词、增加部分关键词
// @grant note 2021.12.6 第3.02版 zzhjim：增加对部分垃圾农场的屏蔽
// @grant note 2021.11.23 第3.01版 zzhjim：增加对虚假电子书下载网站、高晓松、袁腾飞的屏蔽，删除重复的关键词
// @grant note 2021.11.22 第3.0版 zzhjim：增加对小x百科网、小x知识网的屏蔽
// @grant note 2019.8.13 第2.2版 zzhjim：增加大量规则，对严重影响搜索体验的网站、营销号进行屏蔽
// @grant note 2018.1.21 第2.12版 zzhjim：增加对于部分反动网站、百家号的屏蔽
// @grant note 2018.1.21 第2.09-2.11版 zzhjim：调整部分关键词
// @grant note 2017.8.12 第2.04-2.08版 zzhjim：修复一批重大BUG，调整部分关键词
// @grant note 2017.8.9 第2.02-2.03版 zzhjim：增加部分关键词
// @grant note 2017.8.8 第2.01版 zzhjim：增删部分关键词，增强对繁体恶意网站的拦截
// @grant note 2017.8.6 第2.0版 zzhjim：原脚本已经许久没有更新，我将一些常见的恶意网站名称加入了进去，修改了360搜索的网址。如果还有合适的关键词，欢迎提交讨论。（本脚本配合AC的其他脚本使用效果更好）
// @grant note 2018.1.18 第2.1版 @zzhjim:调整部分关键字
// @grant note 2015.11.26 第一版，规则自己写吧，觉得要反馈的关键字可以在卡饭回个帖，我合适的加入
// @downloadURL https://update.greasyfork.org/scripts/32051/%E4%BB%8E%E8%B0%B7%E6%AD%8C%20%E7%99%BE%E5%BA%A6%20%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%B8%AD%E5%B1%8F%E8%94%BD%E8%87%AA%E5%AE%9A%E4%B9%89%E5%85%B3%E9%94%AE%E5%AD%97%20%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%88%E5%9F%BA%E4%BA%8EAC%E7%9A%84%E8%84%9A%E6%9C%AC%E4%BC%98%E5%8C%96%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/32051/%E4%BB%8E%E8%B0%B7%E6%AD%8C%20%E7%99%BE%E5%BA%A6%20%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%B8%AD%E5%B1%8F%E8%94%BD%E8%87%AA%E5%AE%9A%E4%B9%89%E5%85%B3%E9%94%AE%E5%AD%97%20%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%88%E5%9F%BA%E4%BA%8EAC%E7%9A%84%E8%84%9A%E6%9C%AC%E4%BC%98%E5%8C%96%EF%BC%89.meta.js
// ==/UserScript==


/*
变量x用于                                           百度=谷歌=必应=360搜索=有道
就是黑名单,自己加入自己想要屏蔽的关键字
*/
var blankList = "新京报||文昭談古論今||百科网||知识网||להוריד מסמך||大榴槤||GreatDaily||閃文聯盟||共残党||电脑百事||找小姐||快播||橙子生活馆||爱否||数码闲聊君||卢伟冰||一鸣极客||找靓机||领菁||新闻快搜||百度软件||百度浏览||百度卫士||百家号||网赚||婚恋交友||賭場||赌场||百家乐||百家樂||金沙娱乐||澳门金沙||威尼斯人||永利澳门||澳门娱乐||送彩金||橡果国际||葡京||人娱乐||戒色||返利||算命||解梦||电子商务平台||爱词霸句||本地宝||成人电影||金瓶梅游||同城交友||qvod||成人网||交友聊天室||中国复兴党||阿波罗网||代开发票||六合彩||在线聊天||115os||人体艺术||网站流量||法輪||法轮||李洪志||新唐人||陈破空||阿波罗综||阿波罗新||退党||三退九评||追查国际||大赦国际||国际特赦||真善忍||活摘||中国之春||中国禁闻||民间藏事||高层内斗||中共内斗||中共内幕||中共太子||推墙||吴建民||雪山狮子||藏人行政||内蒙古人民党||真人欢乐捕鱼||娱乐博彩||视点网||东方娱乐||人人彩票||彩票网||线上娱乐||时时彩||分分彩||五分彩||网上娱乐||册平台||美国之音||自由亚洲||自由欧洲||自由非洲||明镜火||冉云飞||梁文道||高晓松||袁腾飞||艾未未||王小山||郝海东||梁艳萍||戴晴||茅于轼||任志强||久美嘉措||龌龊宣传||莫之许||石涛||中国人权||长平观察||石斑鱼大爷||博彩||流亡藏||人人贷||澳门赌||老虎机||大乐透||娱乐城||七星彩||快三||新加坡双赢||幸运28||沐陽看點||Radio Free Asia||管家婆马||退出中共||镇压人民||时事大家谈||亿发娱乐"; //自己看着格式差不多加入就好
var x = blankList.split("||");
//===================================================主入口=======================================================
mo = new MutationObserver(function(allmutations) {
    var href = window.location.href;
    if(href.indexOf("www.baidu") > -1){
        $(".c-container").each(deal); // 百度

    } else if(href.indexOf("www.google") > -1){
        $(".g").each(deal);     // 谷歌
        
    } else if(href.indexOf("so.com") > -1){
        $(".res-list").each(deal); // 360搜索
        $(".spread ").each(deal); // 360搜索
        $(".brand").each(deal); // 360搜索
        
    } else if(href.indexOf("bing.com") > -1){
        $(".b_algo").each(deal);    // 必应1
        $(".b_ans").each(deal);    // 必应2
        
    } else if(href.indexOf("youdao.com") > -1){
        $(".res-list").each(deal);        // 有道
        
    }
});
var targets = document.body;
mo.observe(targets, {'childList': true,'characterData':true,'subtree': true});

// ================================================通用处理函数==========================================================
function deal(){
    var curText = $(this).attr
    var curText = $(this).text();
    if(checkIndexof(curText) == true){
        $(this).remove();
        //console.log("dealing with");
    }
}
/*遍历查表，如果在表中则返回true*/
function checkIndexof(element){
	var result = (element.indexOf(x[0]) > -1);
	for(var i = 1; i <= x.length; i++){
		//alert("check");
		result = result || (element.indexOf(x[i]) > - 1);
	}
	return result;
}
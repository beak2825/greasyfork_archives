// ==UserScript==
// @name Google Baidu Bing等搜索引擎结果中屏蔽自定义网站
// @namespace BlockKafanTopicinGoogle
// @include /^https?\:\/\/encrypted.google.[^\/]+/
// @include /^https?\:\/\/www.google.[^\/]+/
// @include /^https?\:\/\/www.baidu.[^\/]+/
// @include /^https?\:\/\/[\w]+.bing.[^\/]+/
// @include /^https?\:\/\/www.haosou.com+/
// @include /^https?\:\/\/www.youdao.com/
// @include /^https?:\/\/www.sogou.com/
// @include /^https?:\/\/search.disconnect.me/
// @icon    https://coding.net/u/zb227/p/zbImg/git/raw/master/img0/icon.jpg
// @author       AC
// @version 0.7.0
// @description 从Google Baidu Bing等搜索引擎结果中屏蔽自定义的网站

// @grant note 2017.4.14 更新了：根据反馈，处理了chrome上的MutationObserver的问题，还是换回了DOMinsert，反正能用
// @grant note 2016.2.6 更新了：根据反馈，增加了新的搜索点：Disconnect.ME搜索点，建立了一个简单的搜索结果
// @grant note 2015.11.22 更新了：采用了新的事件触发MutationObserver，替代之前经常被出触发的DOMinsert事件，大大减少了触发的情况，减轻了浏览器负担
// @grant note 2015.11.21 更新了：之前由于偷懒，所以简单的写了些大部分功能，这次基本上是完善了总的功能，应该不会有漏网之鱼了，如果出现问题请及时反馈邮箱1353464539@qq.com，如果没有问题的话应该来说这是最后一版了，除非以后代码失效了我会进行修改的
// @grant note 2015.11.4 更新了：谷歌干掉搜索结果留下的空白--注意先备份以前的修改
// @grant note 2015.10.31-4 一定程度上再次调整了卡顿的几率，同时加入函数tryto_del_specificEle(url_d, spec_d, spec_f_d, index_d)，还有删除了百度的软件推广
// @grant note 2015.10.31-3 看来都不喜欢卡饭，我就直接写好了不要www.kafan.cn好了，之前只是针对www.kafan.cn/topic
// @grant note 2015.10.31-2 修正了(因修改谷歌页面卡顿)导致的百度卡死情况,蛋疼的百度在某个f13标签卡死了
// @grant note 2015.10.31 更新处理谷歌页面卡顿的情况-求测试和反馈

// @downloadURL https://update.greasyfork.org/scripts/394090/Google%20Baidu%20Bing%E7%AD%89%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E7%BB%93%E6%9E%9C%E4%B8%AD%E5%B1%8F%E8%94%BD%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BD%91%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/394090/Google%20Baidu%20Bing%E7%AD%89%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E7%BB%93%E6%9E%9C%E4%B8%AD%E5%B1%8F%E8%94%BD%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BD%91%E7%AB%99.meta.js
// ==/UserScript==
//===================================================特殊规则处理=======================================================
/***用于干掉某些不属于普通规则的模块，可以自己仿照格式添加**/
//var sepcStr1_USELESS=new Array("待删除目的URL", "待删除网址的class", "待删除网址对应最终块的class");
var sepcStr1=new Array("rj.baidu.com","c-showurl", "result-op c-container"); //百度软件推广
tryto_del_specificEle(sepcStr1[0], sepcStr1[1], sepcStr1[2], sepcStr1[3]);

//===================================================普通规则变量定义=======================================================
/*
变量x用于baidu-google-bing-haosou-youdao
就是网址的黑名单的意思~~，--不显示该名单中的网址
*/
var x=new Array(
	"360.cn",
	"mm131.com",
	"jkforum.net",
	"t66y.cc",
	"jav-library.com",
	"jav007.com",
	"javss.com",
	"javmega.net",
	"kafan.cn/topic",
	"www.kafan.cn › 卡饭教程",
    "right.com.cn",
    "cjwlb.cn",
    "52codes.net"
);

//网址节点的最近父节点 百度、必应、谷歌、好搜、有道--->用来尽可能的保证不卡死浏览器
var dir_fatherName = new Array(
"f13", //百度
"b_attribution", //必应
"f kv _SWb", //谷歌
"res-linkinfo", //好搜
"result-footer", //有道
"fb", //搜狗
"title"
); 
//网址节点的最终父节点-一一对应
var end_fatherName = new Array(
"result c-container ", //百度
"b_algo", //必应
"g", //谷歌
"res-list", //好搜
"rnw default", //有道
"rb", //搜狗
"result"
); 
var map={};
initMap();

//===================================================主入口=======================================================
document.addEventListener('DOMNodeInserted', blockKafanBaidu, false);

//document.addEventListener('DOMNodeInserted',blockKafanBaidu,false);
function blockKafanBaidu() {
    var isBaidu = (location.href.indexOf('.baidu.com') > -1);
    var isDisConnectMe = (location.href.indexOf('.disconnect.me') > -1);
    var citeList;
    if(isBaidu){
        citeList = document.getElementsByClassName('c-showurl');  //之前取的是g，但这个标签在google中是最大的标签，导致谷歌页面卡住，所以先判断是baidu站点
        deal(citeList)
    }else if(isDisConnectMe){
        citeList = document.getElementsByClassName('title');
        deal_DisConnectMe(citeList);
    }else{
        citeList = document.getElementsByTagName('cite');  // 其他的几个搜索貌似都是以cite为TAG的
        deal(citeList)
    }
}

// 传入nodelist，然后查找两个列，查看是否一致，一致则删除
function deal(citeList){
    for (var index = 0; index < citeList.length; index++) {
        var element = replaceAll(citeList[index].innerHTML);
        if (checkIndexof(element)) {
            var node = citeList[index].parentNode;
            var cur_dir_fatherName = node;
            var II=0;
            if(is_dir_fatherNode(cur_dir_fatherName.className)){
                for(II = 0; II <= 5; II++){
                    node = node.parentNode;
                    console.log(node.className+" kk  "+ map[cur_dir_fatherName.className]);
                    if(isequal(node.className, map[cur_dir_fatherName.className])){
                        break;
                    }
                }
            }
            if(II <= 5)
                node.parentNode.removeChild(node);
        }
    }
}
function deal_DisConnectMe(citeList){
    for (var index = 0; index < citeList.length; index++) {
        var element = replaceAll(citeList[index].href);
        if (checkIndexof(element)) {
            var node = citeList[index].parentNode;
            var cur_dir_fatherName = node;
            var II=0;
            if(is_dir_fatherNode(cur_dir_fatherName.id)){
                for(II = 0; II <= 5; II++){
                    node = node.parentNode;
                    console.log(node.id+" kk  "+ map[cur_dir_fatherName.id]);
                    if(isequal(node.id, map[cur_dir_fatherName.id])){
                        break;
                    }
                }
            }
            if(II <= 5)
                node.parentNode.removeChild(node);
        }
    }
}
// 初始化Map
function initMap(){
    var length = dir_fatherName.length;
    for(var i = 0; i < length; i++){
        var a = dir_fatherName[i];
        var b = end_fatherName[i];
        map[a] = b;
    }
}
// 确认是否为最终节点
function isequal(cur_end, map_end){ 
    if(map_end == cur_end)
        return true;
    return false;
}
// 遍历Array，判断网址父节点是应该属于列表中的
function is_dir_fatherNode(node){
    var leng = dir_fatherName.length;
    for(var i = 0; i < leng; i++){
        if(node == dir_fatherName[i]){
            return true;
        }
    }
    return false;
}
/**
url_d 被删除的地址url
spec_d 被删除节点的Class名字
spec_f_d 被删除节点的总的父亲节点的Class名字
index_d 节点到父节点的层数
*/
function tryto_del_specificEle(url_d, spec_d, spec_f_d, index_d){
		//alert('删除ing '+spec_d);
		var citeList2 = document.getElementsByClassName(''+spec_d);
		for(var index = 0; index < citeList2.length; index++){
		var ele = replaceAll(citeList2[index].innerHTML);
		if((ele.indexOf(''+url_d)>-1)){
			var node = citeList2[index].parentNode;
			for(var index2 = 0; index2 <= 4; index2++){
				node = node.parentNode;
				//alert(node.className);
				if(node.className == spec_f_d){
						 break;
				}
			}
			if(index2 <= 4)
				node.parentNode.removeChild(node);
		}
	}
}
/*去掉网址中的<xxx>*/
function replaceAll(sbefore){
	var send;
	send = sbefore.replace(/<[^>]*>/g ,"");
	return send;
}
/*确认是当前例子的一个子例*/
function checkIndexof(element){
	var result = (element.indexOf(x[0]) > -1);
	for(var i = 1; i <= x.length; i++){
		//alert("check");
		result = result || (element.indexOf(x[i]) > - 1);
	}
	return result;
}


// ==UserScript==
// @name AC-从Google Baidu Bing搜索结果中屏蔽卡饭教程
// @namespace BlockKafanTopicinGoogle
// @include /^https?\:\/\/encrypted.google.[^\/]+/
// @include /^https?\:\/\/www.google.[^\/]+/
// @include        http://www.baidu.com/*
// @include        https://www.baidu.com/*
// @include /^https?\:\/\/[\w]+.bing.[^\/]+/
// @include /^https?\:\/\/www.haosou.com+/
// @include /^https?\:\/\/www.youdao.com/
// @include /^https?:\/\/www.sogou.com/
// @include /^https?:\/\/search.disconnect.me/
// @icon    https://coding.net/u/zb227/p/zbImg/git/raw/master/img0/icon.jpg
// @author       AC
// @version 0.2.9
// @description 从Google Baidu Bing Haosou Youdao搜索结果中屏蔽'卡饭教程'
// @grant none

// @downloadURL https://update.greasyfork.org/scripts/13404/AC-%E4%BB%8EGoogle%20Baidu%20Bing%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%B8%AD%E5%B1%8F%E8%94%BD%E5%8D%A1%E9%A5%AD%E6%95%99%E7%A8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/13404/AC-%E4%BB%8EGoogle%20Baidu%20Bing%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%B8%AD%E5%B1%8F%E8%94%BD%E5%8D%A1%E9%A5%AD%E6%95%99%E7%A8%8B.meta.js
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
	"kafan.cn/topic",
	"www.kafan.cn › 卡饭教程"
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

mo = new MutationObserver(function(allmutations) {
//alert();
    blockKafanBaidu();
});
var targets = document.body;
mo.observe(targets, {'childList': true,'characterData':true,'subtree': true});

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


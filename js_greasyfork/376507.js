// ==UserScript==
// @name         AutoClicker
// @namespace    http://gv7.me
// @version      0.2.6
// @description  一个自动对网页元素（按钮，链接等）进行重复点击的脚本,可以利用到春节刷票，大学选课，双十一抢购等场景中。
// @author       c0ny1,JackyTsuuuy
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376507/AutoClicker.user.js
// @updateURL https://update.greasyfork.org/scripts/376507/AutoClicker.meta.js
// ==/UserScript==

(function() {
    'use strict';

// 多少毫秒点击一次
var cyce = 1000;
// 方式一：通过id定位点击元素
var id = "";
// 方式二：通过标签名tag,属性名attr,属性值value定位点击元素
var tag = "";
var attr = "";
var value = "";
// 方式三：通过xpath定位点击元素 e.g: var str_xpath = '//*[@id="su"]';
var str_xpath = '';
// 方式四：通过selector定位点击元素,e.g: var str_qs = "div .search span a";
var str_qs = "";
// 方式五：通过自定义函数定位点击元素
var isCustiom = false;


/*
	定位点击对象的辅助函数
*/
function getTargetByCustom(){
    /*若启用方式五，请在该函数体内编写自定义定位点击元素的代码*/
    var target;
	return target;
}

function getTargetById(t_id){
	var target = document.getElementById(t_id);
    return target;
}


function getTargetByTAV(t_tag,t_attr,t_value){
	var target = document.getElementsByTagName(t_tag);
	for(var i=0;i <target.length;i++){
		if(target[i].getAttribute(t_attr) == t_value){
			return target[i];
		}
	}
}

function getTargetByXpath(str_xpath) {
    var xresult = document.evaluate(str_xpath, document, null, XPathResult.ANY_TYPE, null);
    var xnodes = [];
    var xres;
    while (xres = xresult.iterateNext()) {
        xnodes.push(xres);
    }
    return xnodes;
}


function getTargetByQS(str_qs){
    var target = document.querySelector(str_qs);
    return target;
}


function trim(str){
    str = str.replace(/(^\s*)|(\s*$)/g, "");
    return str;
}

/*
	运行流程
*/

var btn;

if(isCustiom === true){
	btn = getTargetByCustom();
}

if(trim(id) !== "" && (btn === null | typeof(btn) !== 'object')){
	btn = getTargetById(id);
}

if(trim(tag) !== "" && trim(attr) !== "" && value !== "" && (btn === null | typeof(btn) !== 'object')){
	btn = getTargetByTAV(tag,attr,value);
}

if(trim(str_xpath) !== "" && (btn === null | typeof(btn) !== 'object')){
	btn = getTargetByXpath(str_xpath)[0];
}

if(trim(str_qs) !== "" && (btn === null | typeof(btn) !== 'object')){
    btn = getTargetByQS(str_qs);
}

setInterval(function() {
		if (btn !== null && typeof(btn) === 'object') {
            console.info("[+] AutoClicker click object: " + btn.innerHTML);
			btn.click();
		}else{
			console.warn('[-] Autoclicker does not find the click object!');
		}
	},cyce);
})();
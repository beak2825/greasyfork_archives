/*globals jQuery,$,waitForKeyElements*/
// ==UserScript==
// @name         至善网评价
// @namespace    https://greasyfork.org/zh-CN/users/914220-su
// @version      0.1
// @description  try to take over the world!
// @author       Su.
// @match        *://www.attop.com/*
// @icon         data:image/x-icon;base64,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
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/449414/%E8%87%B3%E5%96%84%E7%BD%91%E8%AF%84%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/449414/%E8%87%B3%E5%96%84%E7%BD%91%E8%AF%84%E4%BB%B7.meta.js
// ==/UserScript==
let course,id;

function gerenzhongxin(){//个人中心页面
	document.querySelector("#user_main > div > div.left_aside_150 > dl > dd:nth-child(9) > a").click()
}
function gaishu(){//课程概述页面
	document.querySelector("#sm_header > div.menu_auto > div > a:nth-child(2)").click()
}
function xuexi(n){//课程学习页面
    let total = document.querySelectorAll('ul>li[class ^= "n"]>a[title][href^="learn.htm?"]')//(total.length为课程总数)
	document.querySelectorAll('dl[class=bookNav_list]>dd[id^="zj"]').forEach(i=>{i.style.display="block";})
	console.log("共有"+total.length+"小节，已全部展开")
	setTimeout(()=>{
		//console.log("学习页面");
		let list = document.querySelectorAll('span.BT_ping.Ped'),over=0;
		for(let i=list.length;i>0;i--){if(list[n-1].innerText=="已评价")over++}
		console.log("共"+list.length+"个媒材，"+over+"个已评价"+(list.length-over)+"个未评价")
		if(n>0&&list[n-1].innerText=="马上评价"){
			list[n-1].click(yijiansanlian(n))
		}
	},500)
}
function yijiansanlian(n){//媒材评价
	setTimeout(()=>{document.querySelector("body > div.aui_state_lock.aui_state_focus > div > table > tbody > tr:nth-child(2) > td.aui_c > div > table > tbody > tr:nth-child(1) > td > div > a").click()},500)
	if(n>1){xuexi(n-1)}
}
function choose(){
    if(location.href.indexOf('http://www.attop.com/wk/index.htm?id=')!==-1){gaishu()}
	if(location.href.indexOf('http://www.attop.com/wk/learn.htm?id=')!==-1){setTimeout(()=>{xuexi($('a.Mshow').length)},500)}
	let url = location.href,check = /^http:\/\/www.attop.com\/wk\/learn.htm\?id=[0-9]{1,6}$/g;if(check.test(url)){document.querySelector('ul>li[class$=" on"]>a').click()}
	if(location.href=='http://www.attop.com/user/index.htm'){gerenzhongxin()}
}choose()
// ==UserScript==
// @name         问卷星自动填写
// @namespace    http://tampermonkey.net/
// @version      0.212
// @description  自动填写问卷星的问卷，要修改单选框和多选框
// @author       You
// @match        https://www.wjx.cn/vm/*  
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499388/%E9%97%AE%E5%8D%B7%E6%98%9F%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/499388/%E9%97%AE%E5%8D%B7%E6%98%9F%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==
 
let questions = document.querySelectorAll('.div_question .div_table_radio_question .ulradiocheck');
 
 
questions = Array.from(questions);
 
questions.forEach(item=>{
	const a = item.querySelectorAll('li a');
	const temp = item.querySelectorAll('li input');
	if(temp[0].getAttribute('type') === 'radio') {
		// 单选
		const index = Math.floor(Math.random() * temp.length);
		a[index].click();
	}else{
		console.log(item)
		// 多选
		let flag = false;//防止一个未选
		for(let i = 0;i<temp.length;i++) {
			const index = Math.random();
			if(index > 0.5) {
				a[i].click();
				flag = true;
			}
		}
		if(!flag) {
			// 一个都未选
			a[0].click();
		}
	}
})
 
const alert_box = document.querySelector('#alert_box .mainBgColor')
if(alert_box){
	alert_box.click()
}
 
const captchaout = document.querySelector('#captchaout #rectMask')
if(captchaout){
	captchaout.click()
}
// 提交按钮
const submit = document.querySelector('#submit_div #submit_button')
setTimeout(()=>{
	submit.click();
},1000)
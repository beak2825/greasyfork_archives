// ==UserScript==
// @name         TJU出门
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  TJU扫码通行
// @author       Maybeyouneedme
// @match        *://serv.tju.edu.cn/verifyqr/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/417307/TJU%E5%87%BA%E9%97%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/417307/TJU%E5%87%BA%E9%97%A8.meta.js
// ==/UserScript==

(function() {

//选择表关联函数
window.onchangeCampus = function onchangeCampus(value) {
	if (value == "卫津路校区")
	{
		ComboBox3.options.length = 0;
		ComboBox3.add(new Option("东门","东门"));
		ComboBox3.add(new Option("西门","西门"));
	}
	else if(value == "北洋园校区")
	{
		ComboBox3.options.length = 0;
		ComboBox3.add(new Option("北门","北门"));
	}
}
//按钮功能函数
window.onclickBtn = function onclickBtn() {
	switch(ComboBox1.value)
	{
		case "出":
		{
			document.getElementById("qrstatusslim").innerText = "";
			document.getElementById("qrstatusslim").innerHTML = '<img src="http://serv.tju.edu.cn/upload/1.png" class="qr-status-slim">您已离开' + ComboBox2.value + ComboBox3.value + '，再见！';
			document.getElementById("qrstatus").innerText = "";
			document.getElementById("qrstatus").innerHTML = '<img src="http://serv.tju.edu.cn/upload/1.png" class="qr-status">'
			MyDiv.innerText = "";
			document.getElementById("remark_number").insertAdjacentHTML("afterEnd",html_number1);
		}break;
		case "进":
		{
			document.getElementById("qrstatusslim").innerText = "";
			document.getElementById("qrstatusslim").innerHTML = '<img src="http://serv.tju.edu.cn/upload/1.png" class="qr-status-slim">欢迎进入' + ComboBox2.value + ComboBox3.value;
			document.getElementById("qrstatus").innerText = "";
			document.getElementById("qrstatus").innerHTML = '<img src="http://serv.tju.edu.cn/upload/1.png" class="qr-status">'
			MyDiv.innerText = "";
			document.getElementById("remark_number").insertAdjacentHTML("afterEnd",html_number2);
		}break;
	}
}
//添加标记id
document.getElementsByClassName("c")[0].setAttribute("id","qrstatusslim");
document.getElementsByClassName("text-center r2")[0].setAttribute("id","qrstatus");
document.getElementsByClassName("b")[5].setAttribute("id","remark");
document.getElementsByClassName("b")[0].setAttribute("id","remark_number");
var MyDiv = document.getElementById("remark");
MyDiv.innerText = "";
//添加选择表
var ComboBox1 = document.createElement("select");
ComboBox1.id = "combobox1";
MyDiv.appendChild(ComboBox1);
var ComboBox2 = document.createElement("select");
ComboBox2.id = "combobox2";
ComboBox2.setAttribute("onchange","onchangeCampus(this.value)")
MyDiv.appendChild(ComboBox2);
var ComboBox3 = document.createElement("select");
ComboBox3.id = "combobox3";
MyDiv.appendChild(ComboBox3);
//添加表单选项
ComboBox1.add(new Option("出","出"));
ComboBox1.add(new Option("进","进"));
ComboBox2.add(new Option("卫津路校区","卫津路校区"));
ComboBox2.add(new Option("北洋园校区","北洋园校区"));
ComboBox3.add(new Option("东门","东门"));
ComboBox3.add(new Option("西门","西门"));
//添加换行
MyDiv.appendChild(document.createElement("tr"));
//添加确认按钮
var Btn = document.createElement("button");
Btn.id = "button_confirm";
Btn.innerText = "确认修改";
Btn.setAttribute("onclick","onclickBtn()");
MyDiv.appendChild(Btn);
//添加人数规模
var html_number1 = '<div class="b"><span class="a">限定人数规模</span><span class="c">无限制</span></div><div class="b"><span class="a">当前人数规模</span><span class="c">' + (1600 + Math.floor(Math.random()*600)) + '</span></div>' 
var html_number2 = '<div class="b"><span class="a">限定人数规模</span><span class="c">无限制</span></div><div class="b"><span class="a">当前人数规模</span><span class="c">' + (2200 + Math.floor(Math.random()*600)) + '</span></div>' 

}) ();
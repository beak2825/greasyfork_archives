// ==UserScript==
// @name         检验小插件
// @namespace    http://baidu.com/
// @version      0.1
// @description  hello world
// @author       Ck
// @match        http://117.68.0.190:9090/stj-web/index/inspect/report/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492054/%E6%A3%80%E9%AA%8C%E5%B0%8F%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/492054/%E6%A3%80%E9%AA%8C%E5%B0%8F%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==


(function () {
	console.log('我的脚本加载了');
	var button1 = document.createElement("button"); //创建一个input对象（提示框按钮）
	button1.id = "id001";
	button1.textContent = "定检直梯超15年";
	button1.style.width = "60px";
	button1.style.height = "60px";
	button1.style.align = "center";

	button1.onclick = function (){
        console.log('点击了按键');
        document.getElementById('170486608684702b3').lastElementChild.innerHTML='/'//下次检测日期
        document.getElementById('1700887220897d0b').lastElementChild.innerHTML='√'//接地保护
        document.getElementById('1702639220238f5df').lastElementChild.innerHTML='√'//钢丝绳1
        document.getElementById('1700709338998a55').lastElementChild.innerHTML='√'//钢丝绳2
        document.getElementById('1700887671315b62').lastElementChild.innerHTML='√'//端部固定
        document.getElementById('17007072568871c6').lastElementChild.innerHTML='√'//门间隙1
        document.getElementById('1702640903045fe9a').lastElementChild.innerHTML='√'//门间隙2
		return;
	};

    var button2 = document.createElement("button"); //创建一个input对象（提示框按钮）
	button2.id = "id001";
	button2.textContent = "定检直梯修改单";
	button2.style.width = "60px";
	button2.style.height = "60px";
	button2.style.align = "center";

	button2.onclick = function (){
        console.log('点击了按键');
        document.getElementById('17026367891076a46').lastElementChild.lastElementChild.innerHTML='√'//旁路（1）
        document.getElementById('17026367891070e74').lastElementChild.lastElementChild.innerHTML='√'//旁路（2）
        document.getElementById('1702636789107fe21').lastElementChild.lastElementChild.innerHTML='√'//旁路（3）
        document.getElementById('17026367891075fa7').lastElementChild.lastElementChild.innerHTML='√'//旁路（4）
        document.getElementById('1702637271087a233').lastElementChild.lastElementChild.innerHTML='√'//抱闸反馈
        document.getElementById('1702644120750e360').lastElementChild.lastElementChild.innerHTML='√'//意外移动（1）
        document.getElementById('17026441207517a98').lastElementChild.lastElementChild.innerHTML='√'//意外移动（2）
        document.getElementById('17026441207516489').lastElementChild.lastElementChild.innerHTML='√'//意外移动（3）
        document.getElementById('17026441207516354').lastElementChild.lastElementChild.innerHTML='√'//意外移动（4）

		return;
	};


	var button3 = document.createElement("button"); //创建一个input对象（提示框按钮）
	button3.id = "id001";
	button3.textContent = "定检直梯无机房";
	button3.style.width = "60px";
	button3.style.height = "60px";
	button3.style.align = "center";
	button3.onclick = function (){
        console.log('点击了按键');

        document.getElementById('170263678910675f3').lastElementChild.lastElementChild.innerHTML='/'//非液压
        document.getElementById('17026372710898779').lastElementChild.lastElementChild.innerHTML='/'//非鼓式
        document.getElementById('1702637271088688c').lastElementChild.lastElementChild.innerHTML='√'//动态测试
        document.getElementById('17026372710884f0d').lastElementChild.lastElementChild.innerHTML='√'//1m急停
        document.getElementById('1702639100103ce9e').lastElementChild.lastElementChild.innerHTML='/'//盘车（3）
        document.getElementById('17026391001038eb2').lastElementChild.lastElementChild.innerHTML='/'//盘车（4）
		return;
	};


    var button4 = document.createElement("button"); //创建一个input对象（提示框按钮）
	button4.textContent = "定检直梯蓄能";
	button4.style.width = "60px";
	button4.style.height = "60px";
	button4.style.align = "center";
	button4.onclick = function (){

    document.getElementById('170263678910675f3').lastElementChild.lastElementChild.innerHTML='/'//缓冲器
		return;
	};
     var button5 = document.createElement("button"); //创建一个input对象（提示框按钮）
	button5.textContent = "定检直梯耗能";
	button5.style.width = "60px";
	button5.style.height = "60px";
	button5.style.align = "center";
	button5.onclick = function (){

    document.getElementById('170263678910675f3').lastElementChild.lastElementChild.innerHTML='√'//缓冲器
		return;
	};

    var button6 = document.createElement("button"); //创建一个input对象（提示框按钮）
	button6.textContent = "定检直梯金属轮";
	button6.style.width = "60px";
	button6.style.height = "60px";
	button6.style.align = "center";
	button6.onclick = function (){
    document.getElementById('1702640008268acd4').lastElementChild.lastElementChild.innerHTML='/'//反绳轮
    document.getElementById('1702640008269889c').lastElementChild.lastElementChild.innerHTML='/'//反绳轮
		return;
	};

    var button7 = document.createElement("button"); //创建一个input对象（提示框按钮）
	button7.textContent = "定检直梯尼龙轮";
	button7.style.width = "60px";
	button7.style.height = "60px";
	button7.style.align = "center";
	button7.onclick = function (){
    document.getElementById('1702640008268acd4').lastElementChild.lastElementChild.innerHTML='√'//反绳轮
    document.getElementById('1702640008269889c').lastElementChild.lastElementChild.innerHTML='√'//反绳轮
		return;
	};
    var button8 = document.createElement("button"); //创建一个input对象（提示框按钮）
	button6.textContent = "定检直梯重锤";
	button6.style.width = "60px";
	button6.style.height = "60px";
	button6.style.align = "center";
	button6.onclick = function (){
    document.getElementById('1702640008268acd4').lastElementChild.lastElementChild.innerHTML='/'//反绳轮
    document.getElementById('1702640008269889c').lastElementChild.lastElementChild.innerHTML='/'//反绳轮
		return;
	};
    var button9 = document.createElement("button"); //创建一个input对象（提示框按钮）
	button7.textContent = "定检直梯弹簧";
	button7.style.width = "60px";
	button7.style.height = "60px";
	button7.style.align = "center";
	button7.onclick = function (){
    document.getElementById('1702640008268acd4').lastElementChild.lastElementChild.innerHTML='/'//反绳轮
    document.getElementById('1702640008269889c').lastElementChild.lastElementChild.innerHTML='/'//反绳轮
		return;
	};



   var x = document.getElementsByClassName('layui-tab-item layui-show')[0];
    //在浏览器控制台可以查看所有函数，ctrl+shift+I 调出控制台，在Console窗口进行实验测试
	x.appendChild(button1);
    x.appendChild(button2);
    x.appendChild(button3);
    x.appendChild(button4);
    x.appendChild(button5);
    x.appendChild(button6);
    x.appendChild(button7);


})();

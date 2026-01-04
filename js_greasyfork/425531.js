// ==UserScript==
// @name         光伏条码填表
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一键填写条码
// @author       CJ
// @match        https://agentanneng.chint.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425531/%E5%85%89%E4%BC%8F%E6%9D%A1%E7%A0%81%E5%A1%AB%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/425531/%E5%85%89%E4%BC%8F%E6%9D%A1%E7%A0%81%E5%A1%AB%E8%A1%A8.meta.js
// ==/UserScript==

(function () {
	'use strict';
	console.log('我的脚本加载了');
	var button = document.createElement("button"); //创建一个input对象（提示框按钮）
	button.id = "id001";
	button.textContent = "一键填写条码";
	button.style.width = "100px";
	button.style.height = "40px";
	button.style.align = "center";

	//绑定按键点击功能
	button.onclick = function (){
		console.log('点击了按键');
        //为所欲为 功能实现处
        var code = prompt("请输入所有条码","")
        var arr_code = code.split(' ');

        var c_code = document.getElementById("grids").getElementsByTagName("input");
        //alert(c_code.length);
        if (arr_code.length == c_code.length) {
                var i;
                for (i = 0 ; i < c_code.length; i++) {
                c_code[i].value = arr_code[i]
            }
            alert('填写完成')
        } else {
            alert('条码数量不一致')
        }


		return;
	};

    var x = document.getElementsByClassName('nav navbar-top-links navbar-left mynavlist')[0];
    //在浏览器控制台可以查看所有函数，ctrl+shift+I 调出控制台，在Console窗口进行实验测试
	x.appendChild(button);

    //var y = document.getElementById('s_btn_wr');
    //y.appendChild(button);
})();

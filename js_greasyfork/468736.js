// ==UserScript==
// @name         斗鱼星穹2023
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  2023斗鱼星穹铁道直播奖励，辅助抢星穹
// @author       钺阡
// @match        https://www.douyu.com/topic/xqtd11*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468736/%E6%96%97%E9%B1%BC%E6%98%9F%E7%A9%B92023.user.js
// @updateURL https://update.greasyfork.org/scripts/468736/%E6%96%97%E9%B1%BC%E6%98%9F%E7%A9%B92023.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('脚本已加载');
    //x计数，全局变量，直接使用字符串以方便转换
    var num = '0';
    var show = document.createElement("div");
    show.id = "show";
    show.innerHTML = '准备开始刷新';
    show.style.backgroundColor = "Yellow ";
	show.style.position = "fixed";
    show.style.top = "150px";
    show.style.left = "40px";
    show.style.width = "120px";
    var x = document.querySelector("body");
	x.appendChild(show);

    //显示时间
    var showT = document.createElement("div");
    showT.id = "showTime";
    showT.innerHTML = Date();
    showT.style.backgroundColor = "Yellow ";
	showT.style.position = "fixed";
    showT.style.top = "100px";
    showT.style.left = "40px";
    showT.style.width = "200px";
	x.appendChild(showT);

    var button = document.createElement("button"); //创建一个input对象（提示框按钮）
	button.id = "id001";
	button.textContent = "抢票";
    //大小
	button.style.width = "60px";
	button.style.height = "40px";
    //fixed说明相对窗口固定，然后给出离上面、右边的距离
	button.style.position = "fixed";
    button.style.top = "100px";
    button.style.right = "40px";
    //定义按钮背景颜色
    button.style.backgroundColor = "GreenYellow ";
    //定义字体颜色
    //button.style.color = "#FFFFFF";
    //字居中
	button.style.align = "center";
	x.appendChild(button);

    //对按键添加一个事件
    document.getElementById("id001").addEventListener("click", start);
    function start(){
        alert("开始循环");
        //抢
        setInterval(rob,100);
    }

    //一刻不停地抢
    function rob(){
        //刷新
        document.querySelector("#bc433").click();
        document.querySelector("#bc506").click();
        console.log("已经刷新");
        //玩法一80星穹
        document.querySelector("#bc453 > div > button").click();
        //玩法一120星穹
        document.querySelector("#bc464 > div > button").click();
        //玩法一180星穹
        document.querySelector("#bc475 > div > button").click();
        //玩法二660星穹
        document.querySelector("#bc526 > div > button").click();
        //玩法二两张票子
        document.querySelector("#bc604 > div > button").click();
        num++;
        document.getElementById("showTime").innerHTML = Date();
        document.getElementById("show").innerHTML = '已经刷新：' +num+' 次';
    }
//

})();
// ==UserScript==
// @name         cbit
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  cbit study
// @author       herimvane
// @match        https://learning.cbit.com.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cbit.com.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465625/cbit.user.js
// @updateURL https://update.greasyfork.org/scripts/465625/cbit.meta.js
// ==/UserScript==

(function() {
    'use strict';
    player.ckConfig.config.timeScheduleAdjust=1

    var button = document.createElement("button"); //创建一个input对象（提示框按钮）
	button.id = "id001";
	button.textContent = "完成学习";
	button.style.width = "100px";
	button.style.height = "30px";
	button.style.align = "center";
    button.style.position="absolute";
    button.style.left="15px";

	//绑定按键点击功能
	button.onclick = function (){
		suspendTime=totalTime;
        studytime=totalTime;
        updateStudyStatistics()
        alert("已完成学习！")
		return;
	};

    var x = document.getElementsByClassName('course-top')[0];
	x.appendChild(button);
})();
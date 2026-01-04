// ==UserScript==
// @name         云学堂视频不暂停
// @version      0.2111
// @description  现在只能做到打开一个视频之后，超过五分钟不会自动暂停
// @author       冯立阳
// @match        *://*.yunxuetang.cn/*
// @connect      冯立阳
// @namespace    com.fly
// @downloadURL https://update.greasyfork.org/scripts/402930/%E4%BA%91%E5%AD%A6%E5%A0%82%E8%A7%86%E9%A2%91%E4%B8%8D%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/402930/%E4%BA%91%E5%AD%A6%E5%A0%82%E8%A7%86%E9%A2%91%E4%B8%8D%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==

// Your code here...
setInterval(autoContinue,1000);

function autoContinue() {
    
    var continueBtn = document.querySelector("input[value='继续学习']");
    if(continueBtn && continueBtn.click){
        continueBtn.click();
        if (console && console.log) {
			console.log('找到并点击了[继续学习]');
		}
    }
}

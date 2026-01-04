// ==UserScript==
// @name         三健科技专用视频快进3倍
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动播放和加速视频
// @author       You
// @match        http*://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-end
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501263/%E4%B8%89%E5%81%A5%E7%A7%91%E6%8A%80%E4%B8%93%E7%94%A8%E8%A7%86%E9%A2%91%E5%BF%AB%E8%BF%9B3%E5%80%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/501263/%E4%B8%89%E5%81%A5%E7%A7%91%E6%8A%80%E4%B8%93%E7%94%A8%E8%A7%86%E9%A2%91%E5%BF%AB%E8%BF%9B3%E5%80%8D.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var goTopBottomButton = document.createElement("div");
    goTopBottomButton.className = "goTopBottomButton";
    goTopBottomButton.innerHTML = "<img class='toggleButton' src='https://zqyt.oss-cn-shanghai.aliyuncs.com/202407/16/12175b6d224eb75238adf92c63ab938b.png'></img>";
    goTopBottomButton.style.position = "fixed";
    goTopBottomButton.style.zIndex = 10000;
    goTopBottomButton.style.top = "150px"; //距离网页底部px，可修改
    goTopBottomButton.style.right = "30px"; //距离网页右边px，可修改

    var toggleButton = goTopBottomButton.lastChild;
    toggleButton.style.opacity =1; //按钮不透明度

    toggleButton.addEventListener("click",function() {
		var v=document.getElementsByTagName('video');
		for (var i=0;i<v.length;i++)
		{
		v[i].playbackRate = 3;
            if (v[i].paused) {
				v[i].play();
			}
		}
    })



    document.getElementsByTagName("body")[0].appendChild(goTopBottomButton);



     function clickNextButton() {
        var buttons = document.getElementsByTagName("button");
        for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].innerText.includes("下一节")) {
                buttons[i].click();
                break;
            }
        }
    }

    // 定时检查是否有下一节按钮出现
    setInterval(function() {
        clickNextButton();
    }, 1000);
    // Your code here...
})();
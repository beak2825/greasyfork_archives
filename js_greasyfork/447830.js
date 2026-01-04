// ==UserScript==
// @name         b站直播间 不影响抽红包的多余内容删除 脚本
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  按下"F9"删除多余无关内容
// @author       Ikaros
// @match        https://live.bilibili.com/*
// @grant        none
// @icon         http://bilibili.com/favicon.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447830/b%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%20%E4%B8%8D%E5%BD%B1%E5%93%8D%E6%8A%BD%E7%BA%A2%E5%8C%85%E7%9A%84%E5%A4%9A%E4%BD%99%E5%86%85%E5%AE%B9%E5%88%A0%E9%99%A4%20%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/447830/b%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%20%E4%B8%8D%E5%BD%B1%E5%93%8D%E6%8A%BD%E7%BA%A2%E5%8C%85%E7%9A%84%E5%A4%9A%E4%BD%99%E5%86%85%E5%AE%B9%E5%88%A0%E9%99%A4%20%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

window.onload = function() {
	console.log("b站直播间 不影响抽红包的多余内容删除 脚本 成功加载！");
	// 传递传递参数event
	function keydown(event)
	{
		// “120”为按键F9，按下删除多余内容
		if (event.keyCode == 120) {
            console.log(window.location.href)
            if(window.location.href.startsWith("https://live.bilibili.com/p/eden/area-tags")) {
                // 按下后执行的代码
                document.getElementsByClassName("link-navbar-ctnr")[0].remove()
                document.getElementById("area-tags").remove()
                var bgbf = document.getElementsByClassName("Item_2n7ef9LN bg-bright-filter")
                for(var i = 0; i < bgbf.length; i++) bgbf[i].remove()

                for(var i = 0; i < 5; i++) {
                    var bt = document.getElementsByClassName("Item_2onI5dXq")
                    for(var j = 0; j < bt.length; j++) bt[j].remove()
                }
            } else {
                // 按下后执行的代码
                document.getElementById("live-player-ctnr").remove();
                document.getElementById("sections-vm").remove();
                document.getElementById("link-footer-vm").remove();
                document.getElementById("sidebar-vm").remove();
                document.getElementById("background-manage-vm").remove();
                document.getElementById("aside-area-vm").remove();
                document.getElementById("room-ssr-vm").remove();
                document.getElementsByClassName("gift-presets p-relative t-right")[0].remove();
                document.getElementsByClassName("m-guard-ent gift-section guard-ent")[0].remove();
                document.getElementsByClassName("player-section p-relative border-box none-select z-player-section")[0].remove();
                document.getElementsByClassName("live-skin-coloration-area relative dp-i-block")[0].remove();
                document.getElementById("my-dear-haruna-vm").remove();
                document.getElementsByClassName("lower-row")[0].remove();
            }
		}
	}

	document.addEventListener("keydown", keydown);
};
// ==UserScript==
// @name   免费节点，科学上网，免费梯子，免费机场，ssr/v2ray/clash免费节点订阅地址分享，直连facebookgoogleyoutube，尽情看视频网站，流量用不玩。
// @name:en      onekeygetfreenode
// @name:zh-TW   免费节点，科学上网，免费梯子，免费机场，ssr/v2ray/clash免费节点订阅地址分享，直连facebookgoogleyoutube，尽情看视频网站，流量用不玩。
// @name:zh-HK   免费节点，科学上网，免费梯子，免费机场，ssr/v2ray/clash免费节点订阅地址分享，直连facebookgoogleyoutube，尽情看视频网站，流量用不玩。
// @namespace    http://tampermonkey.net/
// @version      1.1.06
// @description  免费节点一键获取，ss/ssr/v2ray/clash分享，免费节点，科学上网，免费梯子，免费机场，不需要注册，直连facebook/google/youtube，尽情看视频网站，流量用不玩。
// @description:en  Free node one-click access, scientific Internet access, free ladder, ssr/v2ray/clash free node real-time sharing, enjoy watching video sites, no longer have to worry about no traffic.
// @description:zh-TW  免费节点一键获取，科学上网，免费梯子，免费机场，ss/ssr/v2ray/clash分享，不需要注册，直连facebook/google/youtube，尽情看视频网站，流量用不玩。
// @description:zh-HK  免费节点一键获取，科学上网，免费梯子，免费机场，ss/ssr/v2ray/clash分享，不需要注册，直连facebook/google/youtube，尽情看视频网站，流量用不玩。
// @author       eroslp
// @homepage          https://greasyfork.org/zh-CN/users/76501-eroslp
// @supportURL        https://greasyfork.org/zh-CN/users/76501-eroslp
// @match        *
// @match        *://*
// @match        *://*/*
// @run-at document-body
// @license MIT
// @icon         https://clashgithub.com/wp-content/themes/modown/static/img/favicon.ico


// @downloadURL https://update.greasyfork.org/scripts/499582/%E5%85%8D%E8%B4%B9%E8%8A%82%E7%82%B9%EF%BC%8C%E7%A7%91%E5%AD%A6%E4%B8%8A%E7%BD%91%EF%BC%8C%E5%85%8D%E8%B4%B9%E6%A2%AF%E5%AD%90%EF%BC%8C%E5%85%8D%E8%B4%B9%E6%9C%BA%E5%9C%BA%EF%BC%8Cssrv2rayclash%E5%85%8D%E8%B4%B9%E8%8A%82%E7%82%B9%E8%AE%A2%E9%98%85%E5%9C%B0%E5%9D%80%E5%88%86%E4%BA%AB%EF%BC%8C%E7%9B%B4%E8%BF%9Efacebookgoogleyoutube%EF%BC%8C%E5%B0%BD%E6%83%85%E7%9C%8B%E8%A7%86%E9%A2%91%E7%BD%91%E7%AB%99%EF%BC%8C%E6%B5%81%E9%87%8F%E7%94%A8%E4%B8%8D%E7%8E%A9%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/499582/%E5%85%8D%E8%B4%B9%E8%8A%82%E7%82%B9%EF%BC%8C%E7%A7%91%E5%AD%A6%E4%B8%8A%E7%BD%91%EF%BC%8C%E5%85%8D%E8%B4%B9%E6%A2%AF%E5%AD%90%EF%BC%8C%E5%85%8D%E8%B4%B9%E6%9C%BA%E5%9C%BA%EF%BC%8Cssrv2rayclash%E5%85%8D%E8%B4%B9%E8%8A%82%E7%82%B9%E8%AE%A2%E9%98%85%E5%9C%B0%E5%9D%80%E5%88%86%E4%BA%AB%EF%BC%8C%E7%9B%B4%E8%BF%9Efacebookgoogleyoutube%EF%BC%8C%E5%B0%BD%E6%83%85%E7%9C%8B%E8%A7%86%E9%A2%91%E7%BD%91%E7%AB%99%EF%BC%8C%E6%B5%81%E9%87%8F%E7%94%A8%E4%B8%8D%E7%8E%A9%E3%80%82.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // Your code here...
	let freenodehtml = `
    <div id="cnqj" style="display:none;height:${window.screen.height}px;top:0px;left:0px;background-color:#fafafa;  position:fixed;z-index:1001;" >
        <div class="gsnm" style="position:fixed;top:30px;left:10px;width:97%; border:2px solid #eee;border-radius:5px;padding:10px;background-color:#fcfcfc; box-shadow: 1px 1px 1px #eee;ont-size:12px;">
            <h1><b>免费节点分享</b></h1>
            <br/>
            <p>关注「<a href="https://t.me/s/v2raydailyupdate" target="_blank">免费节点每日更新 – Telegram</a>」，第一时间获得新鲜节点。</p>
            <br/>
            <p>免费节点来源：<br/>
            <a href="https://clashgithub.com/" target="_blank">https://clashgithub.com/</a><br/>
            <a href="https://clashbk.github.io/" target="_blank">https://clashbk.github.io/</a><br/>
            </p><br/>
            <p>性价比机场推荐:<br/>
            快帆云：「<a href="https://kfyun.uk/" target="_blank" >(点击注册)」</a>
            </p><br/>
            <p>免费节点分享：<button class="btn">点击复制</button><br/>
			<pre id="freenode">
			</pre>		
            </p>
        </div>
		<div style="position:fixed;right:0px;"><button id="btnClose" style="width: 30px;height: 30px;">X</button></div>
    </div>`
    function toggle(){
        if(document.getElementById('cnqj').style.display=="none"){
            document.getElementById('cnqj').style.display="block";
        }else{
            document.getElementById('cnqj').style.display="none";
        }
    }
	function btnClose(){
         document.getElementById('cnqj').style.display="none";
     }
 	if (window.location.href.includes("bing.com") || window.location.href.includes("www.baidu.com")){
		document.body.insertAdjacentHTML("afterbegin",'<p id="triggerBtn" style="position:fixed;top:100px;right:20px;z-index:1000">免费节点分享</p>');
		document.body.insertAdjacentHTML("afterbegin",freenodehtml);
		document.getElementById("triggerBtn").addEventListener("click",toggle);
		document.getElementById("btnClose").addEventListener("click",btnClose);
		document.querySelector('.btn').addEventListener('click', () => {
			navigator.clipboard
			  .writeText(document.querySelector('#freenode').innerHTML.replaceAll('<br>','\n'))
			  .then(() => {
				console.log('复制成功')
			  })
			  .catch(() => {
				console.log('复制失败')
			  })
		})
		fetch("https://raw.githubusercontent.com/aiboboxx/v2rayfree/refs/heads/main/v2")
		  .then((response) => response.text())
		  .then((res) => {
			const dom = document.getElementById("freenode");
			//console.log(dom.innerText,res)
			dom.innerText = res;
			})
			.catch((error)=>{console.log('error: ', error.message);})
		}
})();

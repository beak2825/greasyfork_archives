// ==UserScript==
// @name         删除Google广告
// @namespace    http://tampermonkey.net/
// @version      0.26
// @description  删除部分网页内嵌的Google广告
// @author       zyb
// @match        https://www.sass.hk/*/
// @match        https://www.tampermonkey.net/*
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sass.hk
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459081/%E5%88%A0%E9%99%A4Google%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/459081/%E5%88%A0%E9%99%A4Google%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// Your code here...
	let throttleTimeID = null;
	let classNameArr = [".google-auto-placed",".adsbygoogle"];
	let adsDomArr = [];

	classNameArr.forEach(function(item,index){
		adsDomArr[index]=document.querySelectorAll(item)
		hideAds(adsDomArr[index]);
	})

	const style = document.createElement("style");
	const styleStr = `
	  .hideAds{
       display: none !important;
     }
	`
	style.appendChild(document.createTextNode(styleStr))
	document.head.appendChild(style)

	// observer 观察者
	// 创建一个观察者
	const observer = new MutationObserver(callbackFuc);

	// 配置文件
	const config = {
		attributes: true,
		attributeFilter: undefined, /*需要监听的属性名称列表，如果没有表示监听全部的属性*/
		attributeOldValue: true, /*传递之前旧的值给mutationRecord*/
		characterData: true, /*是否监听内部文本节点的数据变化*/
		characterDataOldValue: true, /*mutationRecord 是否包含内部文本节点变化前的数据*/
		childList: true,
		subtree: true /*是否把监听的方位放到节点树中的全部子节点上*/
	}
	observer.observe(document.getElementsByTagName('body')[0], config);

	// 事件处理器
	function callbackFuc(mutationRecords, observer){
		let flag = !1;
		//console.log('mutationRecords',mutationRecords)
		mutationRecords.forEach(mutationRecord => {
			let adsDom = mutationRecord.target;
			flag = !1;
			classNameArr.forEach(function(item){
                if(typeof mutationRecord.target.className === "string"){
                    mutationRecord.target.className?.includes(item.substring(1)) && (flag=true);
                }
			})
			if(mutationRecord.type === 'childList' && flag){
				// 通过display为none隐藏广告
				hideAds([adsDom])
				// 直接删除dom节点
				// deleteAds([adsDom])

				return console.log('添加or删除了 childList: ',adsDom);
			}
			// 属性发生了变化
			if(mutationRecord.type === "attributes" && flag){
				// 通过display为none隐藏广告
				hideAds([adsDom])
			   // 直接删除dom节点
				// deleteAds([adsDom])
				return console.log('属性发生了变化 target =',adsDom)
			}
			//if(mutationRecord.type === 'characterData') return console.log('文本节点的数据发生了变化',mutationRecord.target)
		})
	}

	function deleteAds(doms){
		setIntervalFun(doms,function(itemDom){
			let firstChildDom = itemDom.firstElementChild;
			while (firstChildDom) {
				firstChildDom.remove();
				firstChildDom = itemDom.firstElementChild;
			}
		})
	}

	function hideAds(doms){
		setIntervalFun(doms,function(itemDom){
			(!itemDom.className.includes("hideAds")) && itemDom.setAttribute("class",`${itemDom.className} hideAds`);
		})
	}

	function setIntervalFun(doms,callback){
		let times = 0;
		let timeId = setInterval(function(){
			if(doms.length>0){
				for(let itemDom of doms){
					if(callback){
						callback(itemDom);
					}
				}
				clearInterval(timeId);
			}
			if(times>10){
				clearInterval(timeId);
			}
			times++;
		},100)
		}

	function throttleFuc(callback) {

		if(throttleTimeID){
			return;
		}
		if (callback) {
			callback();
		}
		throttleTimeID = setTimeout(function () {
			throttleTimeID = null;
		}, 1500)
	}


})();
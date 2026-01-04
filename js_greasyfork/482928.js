// ==UserScript==
// @name         nyaa磁力预览
// @namespace    http://tampermonkey.net/
// @version      v1.1.1
// @description  磁力链接界面添加预览
// @author       91ss
// @match        https://*.nyaa.si/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nyaa.si
// @grant        none
// @license      GNU GPLV3
// @downloadURL https://update.greasyfork.org/scripts/482928/nyaa%E7%A3%81%E5%8A%9B%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/482928/nyaa%E7%A3%81%E5%8A%9B%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 获取磁力链接
    var magnet = document.getElementsByClassName('card-footer-item')[0];
    var magnet_link = magnet.getAttribute('href')
    console.log("magnet_link: ",magnet_link);
    if (magnet_link.includes('magnet:?xt=urn:btih:')){
        // 使用fetch发送GET请求
        console.log('https://whatslink.info/api/v1/link?url='+magnet_link);
        fetch('https://whatslink.info/api/v1/link?url='+magnet_link)
            .then(response => response.json()) // 解析响应的JSON数据
            .then(data => {
				// 处理响应数据
				console.log(data);
				var screenshots = data.screenshots;
                console.log(screenshots);
                var msg = document.querySelector("#torrent-description")
				// 创建一个新的 <h4> 元素
				var h4Element = document.createElement('h4');
				if (screenshots !== null){

					// 添加文本内容到 <h4> 元素
					var textNode = document.createTextNode('The following pictures are provided by https://whatslink.info/');
					h4Element.appendChild(textNode);
					msg.appendChild(h4Element);
					for (var element of screenshots) {
						// 重复执行的代码块
						var screenshot_link = element.screenshot;
						console.log(screenshot_link);
						// 创建一个新的 <p> 元素
						var pElement = document.createElement('p');
						// 创建一个新的 <img> 元素
						var imgElement = document.createElement('img');
						// 设置 <img> 元素的属性，例如 src
						imgElement.src = screenshot_link; // 替换为实际的图片URL
						// 将 <img> 元素添加到 <p> 元素中
						pElement.appendChild(imgElement);
						// 将 <p> 元素添加到指定的节点中
						msg.appendChild(pElement);
					}
				}
                else {
                    // 添加文本内容到 <h4> 元素
					var errText = document.createTextNode('https://whatslink.info/没有找到更多预览图片');
                    h4Element.appendChild(errText);
					msg.appendChild(h4Element);
                }
            })
            .catch(error => {
                // 处理错误
                console.error('Error:', error);
        });
}
})();
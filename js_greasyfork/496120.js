// ==UserScript==
// @name         笔点导航
// @namespace    http://tampermonkey.net/
// @version      2024-05-84
// @description  笔点导航列表渲染获取
// @author       You
// @match        https://www.bidianer.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bidianer.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496120/%E7%AC%94%E7%82%B9%E5%AF%BC%E8%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/496120/%E7%AC%94%E7%82%B9%E5%AF%BC%E8%88%AA.meta.js
// ==/UserScript==

(function() {
	'use strict';

    var sortStatus = 0;

    // 从本地存储中检索数据
    var retrievedData = localStorage.getItem('guUrl');
    console.log(retrievedData); // 输出 "value"

	var url="https://push2.eastmoney.com/api/qt/ulist.np/get?fltt=2&fields=f12,f13,f19,f14,f139,f148,f2,f4,f1,f125,f18,f3,f152,f5,f30,f31,f32,f6,f8,f7,f10,f22,f9,f112,f100,f88,f153,f62&secids=1.000001,0.000627,0.002827,0.002037,1.600843,0.001696,0.002085,0.000099,0.000801,0.002510,1.600171,1.603893,0.000670,1.600460,1.600973,0.002130,1.600577,0.002617,0.002137,0.301110,0.002878,0.002640,0.001330,0.002607,1.600579,0.300718,0.002896,1.603915,1.600580,0.002067,0.002779,0.002009,0.003021,1.603667,0.002122,1.603803,1.603042,1.603421,0.002281,1.600775,1.601698,0.002055,0.000021,0.002600,1.601138,0.002993,1.600203,0.000100,1.600839,0.002045,0.002449,0.002369,0.002212,0.002405,0.000977,0.000555,0.000676,1.600797,1.603189,0.000810,1.600418,1.600733,0.000625,1.601238,1.603883,0.000016,0.002797,1.600030,0.002670,1.600101,1.603333,1.601179,1.600506,1.603366,0.002277,0.002717,0.002883,0.002587,0.002400,1.600556,0.002583,0.000681,0.002131,0.002291,1.601216,0.002148,1.600679,0.002181,0.002402,1.600602,0.002239,1.603912,0.002339,1.603081,1.603682,1.600880,1.603679,0.002261,1.603887,0.002195,0.002918,1.600824,1.600198,1.603126,0.002354,1.603598,0.002512,1.600335,0.002292,1.603466,0.000759,1.600158,0.002501,0.000420,1.600738,1.600706,1.600280,1.603389,0.002171,1.603716,0.000981,1.601933,0.002265,1.605179,0.002175,0.000716,0.002820,0.002044,0.000785,0.002426,0.002792,0.002681,0.002695,0.002526,0.000795,0.002559,0.002156,0.002241,1.600686,0.002709,0.003015,1.601766,1.601888,0.000519,0.000063,1.600066,0.002829,1.600151,0.000530,0.000564,0.002579"



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
			var bbElement = bbElements[0]

			// 修改该元素的 HTML 内容
			// 创建要添加的 HTML 内容
			var htmlContent = '<div style="padding:10px"><div id="yourDivId" style="height:550px;overflow-y: scroll;color:#767070"></div></div>'

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
                localStorage.setItem('guUrl', url);
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

                localStorage.removeItem('guUrl');
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
		var targetDiv = document.getElementById("yourDivId"); // 用你的实际的 div id 替换 "yourDivId"

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
            var amountAll = item.f6;
            if (Math.abs(amountAll) >= 100000000) {
                amountAll = (amountAll / 100000000).toFixed(0) + "亿";
            } else {
                amountAll = (amountAll / 10000).toFixed(0) + "";
            }

            if (Math.abs(amount) >= 100000000) {
                amount = (amount / 100000000).toFixed(0) + "亿";
            } else {
                amount = (amount / 10000).toFixed(0) + "";
            }
            amountAll = amountAll +"|" +amount ;
      item.f2 = (item.f2).toFixed(0) + "";
			if (item.f3 >= 0) {
				// 设置列表项的文本内容
				ulElement += '<div class="container" style="display: flex;flex-wrap: wrap;color:#666;margin-bottom:5px">' +
'<div class="box cancelEnevent" style="flex:3;cursor: pointer;">'+ item.f14 +'</div>' +

					'<div class="box sortAsc" style="flex:1;cursor: pointer">'+ item.f2 +'</div>' +

'<div class="box topEnvent" style="flex:2;cursor: pointer;font-weight:bold;" data-value="'+item.f13+'.'+item.f12+'" >'+ item.f3 +'</div>' +

                   '<div class="box" style="flex:3">'+ amountAll +'</div>' +

 '<div class="box" style="flex:3;cursor: pointer">'+ item.f100+'</div>' +
					'</div>'
				//ulElement += item.f14 + "：" + item.f100 + "：" + item.f2 + "：" + item.f3 + "：" + inde;
			} else {
				// 设置列表项的文本内容
				ulElement += '<div class="container" style="display: flex;flex-wrap: wrap;color:#0084ff;margin-bottom:5px">' +
				 '<div class="box cancelEnevent" style="flex:3;cursor: pointer;">'+ item.f14 +'</div>' +
'<div class="box sortDesc" style="flex:1;cursor: pointer">'+ item.f2 +'</div>' +
'<div class="box topEnvent" style="flex:2;cursor: pointer;font-weight:bold;" data-value="'+item.f13+'.'+item.f12+'" >'+ item.f3 +'</div>' +
					'<div class="box" style="flex:3">'+ amountAll +'</div>' +
 '<div class="box" style="flex:3;cursor: pointer">'+ item.f100+'</div>' +
					'</div>'
			}

			// 将列表项添加到无序列表中
			ulElement += '</li>';
		});
		ulElement += '</ul>'
		// 将生成的无序列表添加到目标 div 中
		targetDiv.innerHTML = ulElement;

        // 点击事件
        addEvents()
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
// ==UserScript==
// @name         寻灯守护
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  配合寻灯定位app，在百度地图根据坐标定位位置的网站上https://lbsyun.baidu.com/jsdemo/demo/yLngLatLocation.htm，定位安装该app的安卓设备。可以用于小孩与老人定位、家人定位等
// @author       刘liulliu刘
// @match        https://lbsyun.baidu.com/jsdemo/demo/yLngLatLocation.htm*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494826/%E5%AF%BB%E7%81%AF%E5%AE%88%E6%8A%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/494826/%E5%AF%BB%E7%81%AF%E5%AE%88%E6%8A%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // 选择你想要双击的元素
    //var targetElement = document.querySelector('CSS_SELECTOR'); // 替换为你想双击的元素的 CSS 选择器
    var targetElement = document.querySelector("#mask");
    if (targetElement) {
        // 获取元素的位置和大小
        var rect = targetElement.getBoundingClientRect();
        var centerX = rect.left + rect.width / 2;
        var centerY = rect.top + rect.height / 2;

        // 创建一个新的线程（实际上是一个异步函数）
        (async function() {
            for (let i = 0; i < 8; i++) {
                // 创建双击事件
                var dblClickEvent = new MouseEvent('dblclick', {
                    bubbles: true,
                    cancelable: true,
                    //view: window,
                    clientX: centerX,
                    clientY: centerY
                });
                // 触发双击事件
                targetElement.dispatchEvent(dblClickEvent);
                //console.log(`Double click event ${i + 1} dispatched on the target element.`);
                // 等待一段时间（例如 500 毫秒），以便看到双击效果
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        })();
    } else {
        console.log('Target element not found.');
    };
    showNotification("本脚本作为寻灯守护的监护端，需要填写寻灯守护目标app中的用户名与UUID，然后点击启动后，会定位地图到守护目标的位置。", 10000)
    // 找到所有的 input 元素
    var inputs = document.querySelectorAll('input');
    var timerId; // 保存定时器 ID

    // 遍历每个 input 元素
    inputs.forEach(function(input) {
        // 设置 input 元素的宽度为 200px
        input.style.width = '90px';
    });

/////// @aaarequire111 11     https://unpkg.com/gcoord@1.0.6/dist/gcoord.global.prod.js

    let Container = document.createElement('div');
    Container.id = "sp-ac-container";
    Container.style.position = "fixed";
    Container.style.left = "20px";
    Container.style.top = "60px";
    Container.style['z-index'] = "999999";
    Container.innerHTML = `
    <div style="display:flex; align-items:center;">
        <input type="text" id="usernameInput" placeholder="用户名" style="width:60px;margin-right: 10px;">
        <input type="text" id="uuidInput" placeholder="UUID" style="margin-right: 10px;">
        <button id="locateButton" style="width:60px;background-color: red; color: white;">定位</button>
    </div>`;
    document.body.appendChild(Container);

    let Container1 = document.createElement('div');
    Container1.id = "sp-ac-container1";
    Container1.style.position = "fixed";
    Container1.style.left = "20px";
    Container1.style.top = "88px";
    Container1.style['z-index'] = "999999";
    Container1.innerHTML = `
    <div style="display:flex; align-items:center;">
        <input type="text" id="usernameInput1" placeholder="用户名1" style="width:60px;margin-right: 10px;">
        <input type="text" id="uuidInput1" placeholder="UUID1" style="margin-right: 10px;">
        <button id="locateButton1" style="width:60px;background-color: red; color: white;">定位</button>
    </div>`;
    document.body.appendChild(Container1);

    var username = null;
    var uuid = null;
    username = GM_getValue('username'); // 从存储器中获取计数器初始值
    uuid = GM_getValue('uuid'); // 从存储器中获取计数器初始值
    document.getElementById("usernameInput").value = username;
    document.getElementById("uuidInput").value = uuid;


    var username1 = null;
    var uuid1 = null;
    username = GM_getValue('username1'); // 从存储器中获取计数器初始值
    uuid = GM_getValue('uuid1'); // 从存储器中获取计数器初始值
    document.getElementById("usernameInput1").value = username;
    document.getElementById("uuidInput1").value = uuid;


    // 检查页面是否完全加载
    window.addEventListener('load', function() {
        // 获取lng和lat的input元素
//         var lngInput = document.getElementById('lng');
//         var latInput = document.getElementById('lat');

//         // 检查input元素是否存在
//         if (lngInput && latInput) {
//             // 发送 POST 请求获取数据
//             username= document.getElementById("usernameInput").value;
//             uuid = document.getElementById("uuidInput").value;
//             GM_setValue('username', username);
//             GM_setValue('uuid', uuid);
//             postURL(username,uuid)

//         } else {
//             console.error('Lng or Lat input elements not found.');
//         }



    });

    // 定义一个函数，每隔 4 秒执行一次
    function postURL(username,uuid) {
        // 每4秒点击一次查询按钮
        // 设置定时器并保存其 ID
        timerId = setInterval(function() {
            //debugger;
            var lngInput = document.getElementById('lng');
            var latInput = document.getElementById('lat');

            GM_xmlhttpRequest({
                method: "POST",
                url: "https://pi.gdsouth.cn:50061/getLocationPost",
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({ username: username,uuid:uuid}), // 使用 JSON.stringify 转换对象为 JSON 字符串
                onload: function(response){
                    console.log("请求成功");
                    //console.log(response.responseText);

                    try {
                        var jsonResponse = JSON.parse(response.responseText); // 如果响应也是 JSON，可以解析它
                        //console.log(jsonResponse);

                        // 设置lng和lat的值为接收到的数据
                        lngInput.value = jsonResponse.x;
                        latInput.value = jsonResponse.y;


                        // 模拟点击页面上的查询按钮
                        var buttons = document.getElementsByTagName('button');
                        //debugger;
                        for (var i = 0; i < buttons.length; i++) {
                            if (buttons[i].innerText.trim() === '查询') {
                                buttons[i].click(); // 模拟点击按钮操作
                                //console.log('Query button clicked.');
                                break;
                            }
                        }

                    } catch (e) {
                        console.error("无法解析响应为 JSON:", e);
                    }
                },
                onerror: function(response){
                    console.log("请求失败");
                }
            });

        }, 4000); // 4000毫秒 = 4秒
    }


    // 监听定位按钮的点击事件
    document.getElementById("locateButton").addEventListener("click", function() {
        var username = document.getElementById("usernameInput").value;
        var uuid = document.getElementById("uuidInput").value;
        GM_setValue('username', username);
        GM_setValue('uuid', uuid);
        //debugger;
        if (document.getElementById("locateButton").innerText == "定位中") {
            document.getElementById("locateButton").innerText = "定位";
            clearInterval(timerId);
            showNotification('已停止定位！');
        }else {
            document.getElementById("locateButton").innerText = "定位中";
            document.getElementById("locateButton1").innerText = "定位";
            clearInterval(timerId);
            postURL(username, uuid);
            showNotification('已启动定位！');
        };
    });


    // 监听定位按钮1的点击事件
    document.getElementById("locateButton1").addEventListener("click", function() {
        var username = document.getElementById("usernameInput1").value;
        var uuid = document.getElementById("uuidInput1").value;
        GM_setValue('username1', username);
        GM_setValue('uuid1', uuid);
        //debugger;

        if (document.getElementById("locateButton1").innerText == "定位中") {
            document.getElementById("locateButton1").innerText = "定位";
            clearInterval(timerId);
            showNotification('已停止定位！');
        }else {
            document.getElementById("locateButton1").innerText = "定位中";
            document.getElementById("locateButton").innerText = "定位";
            clearInterval(timerId);
            postURL(username, uuid);
            showNotification('已启动定位！');
        };
    });



    // 自定义函数，用于显示提示信息
    function showNotification(message, duration = 3000) {
        // 创建一个新的div元素
        let notificationDiv = document.createElement('div');

        // 设置div的样式和文本内容
        notificationDiv.style.position = 'fixed';
        notificationDiv.style.bottom = '20px';
        notificationDiv.style.left = '50%';
        notificationDiv.style.transform = 'translateX(-50%)';
        notificationDiv.style.padding = '10px';
        notificationDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        notificationDiv.style.color = 'white';
        notificationDiv.style.borderRadius = '5px';
        notificationDiv.style.zIndex = '9999';
        notificationDiv.textContent = message;

        // 将div添加到body中
        document.body.appendChild(notificationDiv);

        // 设置一个定时器来移除这个div
        setTimeout(function() {
            document.body.removeChild(notificationDiv);
        }, duration);
    }

    // 示例用法：在控制台中调用这个函数，或者在其他地方调用
    // showNotification('Hello, this is a temporary notification!');


})();

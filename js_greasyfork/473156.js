// ==UserScript==
// @name         终极版定时抢购(深圳专用pc优化版10.7)全新版
// @version      23.10.7
// @description  SZYC新版
// @match        *://*/*
// @grant        none
// @namespace    none
// @downloadURL https://update.greasyfork.org/scripts/473156/%E7%BB%88%E6%9E%81%E7%89%88%E5%AE%9A%E6%97%B6%E6%8A%A2%E8%B4%AD%28%E6%B7%B1%E5%9C%B3%E4%B8%93%E7%94%A8pc%E4%BC%98%E5%8C%96%E7%89%88107%29%E5%85%A8%E6%96%B0%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/473156/%E7%BB%88%E6%9E%81%E7%89%88%E5%AE%9A%E6%97%B6%E6%8A%A2%E8%B4%AD%28%E6%B7%B1%E5%9C%B3%E4%B8%93%E7%94%A8pc%E4%BC%98%E5%8C%96%E7%89%88107%29%E5%85%A8%E6%96%B0%E7%89%88.meta.js
// ==/UserScript==

// 定义一个异步函数，获取当前页面的服务器时间@@@@@@@@@@@@@@@@@@@@@@@@
async function getCurrentPageServerTime() {
    let lastTime = null;
    let firstTime = null;
    let lastRequestTime = null;
    let firstRequestTime = null;
    let results = [];
    // 循环101次(每10毫秒给服务器发送一次请求,最多发送101次==1分钟内发送101次请求,从响应头中获取服务器时间)
    for (let i = 0; i < 101; i++) {
        // 记录请求开始时间
        const startRequestTime = new Date();
        // 发送请求
        const response = await fetch(window.location.href);
        // 记录请求结束时间
        const endRequestTime = new Date();
        // 获取服务器时间
        const currentTime = new Date(response.headers.get('Date'));
        // 记录当前请求时间
        const currentRequestTime = new Date();
        // 将结果存入数组
        results.push({
            requestTime: currentRequestTime,
            responseTime: currentTime,
            networkDelay: endRequestTime - startRequestTime
        });
        if (lastTime === null || currentTime.getTime() === lastTime.getTime()) {
            lastTime = currentTime;
            lastRequestTime = currentRequestTime;
        } else if (firstTime === null) {
            firstTime = currentTime;
            firstRequestTime = currentRequestTime;
            console.log(`更新firstTime为: ${firstTime}`);
            console.log(`更新firstRequestTime为: ${firstRequestTime}`);
            break;//如果获取到的时间发生了变化就跳出循环(例如:从10:23:23秒--跳到了10:23:24秒)
        }
        await new Promise(resolve => setTimeout(resolve, 10));//10毫秒发送1次请求
    }
    // 计算延迟，并保留整数部分
    const delay = Math.round((firstRequestTime.getTime() - lastRequestTime.getTime()) / 2);
    console.log(`计算出延迟为: ${delay}毫秒`);
    // 计算平均网络延迟，并保留整数部分
    const averageNetworkDelay = Math.round(results.reduce((acc, cur) => acc + cur.networkDelay, 0) / results.length / 2);
    console.log(`计算出平均网络延迟为: ${averageNetworkDelay}毫秒`);
    // 计算服务器时间
    const serverTime = new Date(firstTime.getTime() + delay + averageNetworkDelay);
    return { serverTime, results, delay };
}

// 定义一个异步函数，打印当前页面的本地时间@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
async function printCurrentPageLocalTime() {
    // 获取服务器时间、结果和延迟
    const { serverTime, results, delay } = await getCurrentPageServerTime();
    // 计算平均网络延迟，并保留整数部分
    const averageNetworkDelay = Math.round(results.reduce((acc, cur) => acc + cur.networkDelay, 0) / results.length / 2);
    // 打印服务器时间
    console.log(`服务器时间: ${serverTime.toLocaleString()} ${serverTime.getMilliseconds()}毫秒`);
    /*console.log('所有请求结果:');*/
    console.table(results);


    // 创建一个元素，用来显示服务器时间和抢购相关元素
    const containerElement = document.createElement('div');
    containerElement.style.position = 'fixed';
    containerElement.style.top = '50%';
    containerElement.style.left = '10px';
    containerElement.style.transform = 'translateY(-50%)';
    containerElement.style.padding = '20px';
    containerElement.style.backgroundColor = '#ffdab9';
    containerElement.style.borderRadius = '10px'; // 添加圆角处理
    containerElement.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.5)'; // 添加阴影效果


    //适配手机版显示效果
    if (window.matchMedia("(orientation: portrait)").matches) {
        containerElement.style.left = "50%";
        containerElement.style.top = "20%";
        containerElement.style.transform = "translate(-50%, -50%) scale(2.2)";
    }

    // 创建一个关闭按钮
    var closeButton = document.createElement("button");
    closeButton.textContent = "×";
    closeButton.style.position = "absolute";
    closeButton.style.top = "0px";
    closeButton.style.right = "0px";
    closeButton.style.width = "30px";
    closeButton.style.height = "30px";
    closeButton.style.fontSize = "24px";
    closeButton.style.backgroundColor = "transparent";
    closeButton.style.border = "none";
    closeButton.style.outline = "none";
    closeButton.addEventListener("click", function() {
        containerElement.style.display = "none";
    });
    containerElement.appendChild(closeButton);


    // 创建一个标题元素
    var titleElement = document.createElement("h1");
    titleElement.textContent = "抢烟助手(深圳)23.10.7";
    titleElement.style.textAlign = "center";
    titleElement.style.fontSize = "20px";
    containerElement.appendChild(titleElement);

    // 空一行
    var spacerElement1 = document.createElement("div");
    spacerElement1.style.height = "15px"; // 调整高度以控制空白的大小
    containerElement.appendChild(spacerElement1);


    // 创建一个文本元素"本机时间"
    var localBJTimeTextElement = document.createElement("p");
    localBJTimeTextElement.textContent = "本机时间:";
    localBJTimeTextElement.style.fontSize = "16px";
    localBJTimeTextElement.style.fontWeight = "bold";
    containerElement.appendChild(localBJTimeTextElement);

    // 模拟动态显示本机时间
    var localTimeTextElement = document.createElement("p");
    localTimeTextElement.className = 'benjitime';
    containerElement.appendChild(localTimeTextElement);

    // 空一行
    var spacerElement2 = document.createElement("div");
    spacerElement2.style.height = "8px"; // 调整高度以控制空白的大小
    containerElement.appendChild(spacerElement2);

    // 创建一个文本元素"服务器时间"
    var serverTimeTextElement = document.createElement("p");
    serverTimeTextElement.textContent = "服务器时间:";
    serverTimeTextElement.style.fontSize = "16px";
    serverTimeTextElement.style.fontWeight = "bold";
    containerElement.appendChild(serverTimeTextElement);

    //模拟动态显示服务器时间
    var serverTimeElement = document.createElement('p');
    serverTimeElement.className = 'fuwuqitime';
    containerElement.appendChild(serverTimeElement);

    // 空一行
    var spacerElement3 = document.createElement("div");
    spacerElement3.style.height = "8px"; // 调整高度以控制空白的大小
    containerElement.appendChild(spacerElement3);

    // 创建一个文本元素用于显示平均网络延迟
    var averageNetworkDelayTextElement = document.createElement("p");
    averageNetworkDelayTextElement.textContent = "平均网络延迟: ";
    averageNetworkDelayTextElement.style.fontSize = "16px";
    averageNetworkDelayTextElement.style.fontWeight = "bold";
    containerElement.insertBefore(averageNetworkDelayTextElement, setTextElement);

    // 创建一个元素用于显示平均网络延迟信息
    var averageNetworkDelayInfoElement = document.createElement("p");
    averageNetworkDelayInfoElement.textContent = `${averageNetworkDelay}毫秒`;
    containerElement.insertBefore(averageNetworkDelayInfoElement, setTextElement);

    // 空一行
    var spacerElement4 = document.createElement("div");
    spacerElement4.style.height = "8px"; // 调整高度以控制空白的大小
    containerElement.appendChild(spacerElement4);

    // 创建一个文本元素用于显示"设置抢购时间"
    var setTextElement = document.createElement("p");
    setTextElement.textContent = "设置抢购时间:";
    setTextElement.style.fontSize = "16px";
    setTextElement.style.fontWeight = "bold";
    containerElement.appendChild(setTextElement);

    // 创建一个input元素来接收用户选择的时间
    var input = document.createElement("input");
    input.type = "datetime-local";
    input.style.display = "block"; // 设置为块级元素
    containerElement.appendChild(input);

    // 空一行
    var spacerElement5 = document.createElement("div");
    spacerElement5.style.height = "8px"; // 调整高度以控制空白的大小
    containerElement.appendChild(spacerElement5);

    // 创建一个文本元素用于显示"设置提前时间"
    var setAdvanceTextElement = document.createElement("p");
    setAdvanceTextElement.textContent = "设置提前时间:";
    setAdvanceTextElement.style.fontSize = "16px";
    setAdvanceTextElement.style.fontWeight = "bold";
    containerElement.appendChild(setAdvanceTextElement);


    // 创建一个input元素来接收用户选择的提前时间（毫秒）
    var advanceInput = document.createElement("input");
    advanceInput.type = "number";
    advanceInput.placeholder = "提前时间（毫秒）";
    advanceInput.style.display = "block"; // 设置为块级元素
    containerElement.appendChild(advanceInput);
    // 点击提前时间输入框时触发的事件
    advanceInput.addEventListener('click', function() {
        var requests = []; // 存储发送的请求
        var totalLatency = 0; // 存储总的延迟时间
        var completedRequests = 0; // 记录已完成的请求数量

        // 发送5个请求获取网络延迟
        for (var i = 0; i < 10; i++) {
            setTimeout(function() {
                var startTime = performance.now(); // 获取请求开始时间
                var xhr = new XMLHttpRequest(); // 创建XMLHttpRequest对象
                xhr.open('GET', window.location.href); // 获取当前页面的URL
                xhr.onload = function() {
                    var endTime = performance.now(); // 获取请求结束时间
                    var latency = endTime - startTime; // 计算延迟时间
                    totalLatency += latency; // 增加总的延迟时间
                    completedRequests++; // 增加已完成的请求数量

                    // 当所有请求都已完成时，计算平均网络延迟，并将其填充到输入框中
                    if (completedRequests === 10) {
                        var avgLatency = Math.round(totalLatency / 10 / 2 - 3); // 计算单程平均网络延迟后减去3毫秒
                        advanceInput.value = avgLatency; // 填充到输入框中
                    }
                };
                xhr.onerror = function() {
                    // 请求出错时的处理
                };
                xhr.send(); // 发送请求
            }, 200 * i); // 每隔200毫秒发送一个请求
        }
    });

    // 空一行
    var spacerElement6 = document.createElement("div");
    spacerElement6.style.height = "12px"; // 调整高度以控制空白的大小
    containerElement.appendChild(spacerElement6);

    // 创建一个button元素来触发抢购操作
    var button = document.createElement("button");

    button.textContent = "开始抢购";
    button.style.fontSize = "16px";
    button.style.fontWeight = "bold";
    button.style.backgroundColor = '#4caf50';
    button.style.color = 'white'; // 将字体颜色设置为白色
    button.style.padding = '10px'; // 将内边距设置为3px

    button.addEventListener('click', function() {
        // 获取用户设置的抢购时间
        var purchaseTimeValue = input.value;

        // 判断是否设置了抢购时间
        if (purchaseTimeValue === '') {
            // 如果没有设置抢购时间，弹出提示信息
            alert('请先设置好抢购时间');
        } else {
            // 如果设置了抢购时间，修改按钮文本并执行其他操作
            button.textContent = "正在执行";

            // 异步请求获取服务器时间
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    // 获取服务器时间
                    var serverTime = new Date(xhr.getResponseHeader('Date')).getTime();

                    // 计算当前时间与抢购时间的差值
                    var purchaseTime = new Date(purchaseTimeValue).getTime();
                    var timeDiff = purchaseTime - serverTime;

                    // 如果差值大于0，说明抢购时间还未到达
                    if (timeDiff > 0) {
                        // 在抢购时间到达时，将按钮文本修改回“开始抢购”
                        setTimeout(function() {
                            button.textContent = "开始抢购";
                        }, timeDiff);
                    } else {
                        // 如果差值小于或等于0，立即将按钮文本修改回“开始抢购”
                        button.textContent = "开始抢购";
                    }
                }
            };
            xhr.open('HEAD', window.location.href);
            xhr.setRequestHeader('Cache-Control', 'no-cache');
            xhr.send();
        }
    });
    containerElement.appendChild(button);

    document.body.appendChild(containerElement);


    // 更新本机时间@@@@@@@@@@@@@@@
    function updateLocalTime() {
        let localTime = new Date();
        let milliseconds = localTime.getMilliseconds().toString().padStart(3, '0'); // 在毫秒数前面添加前导零
        localTimeTextElement.innerText = localTime.toLocaleString() + " " + milliseconds;

    }

    setInterval(updateLocalTime, 1); // 每隔10毫秒更新一次本机时间的毫秒数


    // 定义一个变量，用来存储上一次调用回调函数的时间@@@@@@@@@@@@@@@
    let lastUpdateTime = null;

    // 定义一个变量，用来存储当前服务器时间（包括毫秒部分）
    let currentServerTimeInMs = serverTime.getTime();

    // 定义一个回调函数
    function updateServerTime() {
        // 获取当前时间
        const currentTime = new Date();
        // 如果 lastUpdateTime 不为 null，则计算两次调用之间的时间差
        if (lastUpdateTime !== null) {
            // 计算两次调用之间的时间差（包括毫秒部分）
            const deltaTimeInMs = currentTime.getTime() - lastUpdateTime.getTime();
            // 更新当前服务器时间（包括毫秒部分）
            currentServerTimeInMs += deltaTimeInMs;
        }
        // 更新 lastUpdateTime 为当前时间
        lastUpdateTime = currentTime;

        // 更新显示的时间:
        let dateObj=new Date(currentServerTimeInMs);

        let year=dateObj.getFullYear();
        let month=dateObj.getMonth()+1;
        let date=dateObj.getDate();
        let hours=dateObj.getHours();
        let minutes=dateObj.getMinutes();
        let seconds=dateObj.getSeconds();
        let milliseconds=dateObj.getMilliseconds();

        serverTimeElement.textContent = `${year}-${month}-${date}T${hours}:${minutes}:${seconds}.${milliseconds}`;

        // 再次调用 setTimeout 函数来安排下一次更新
        setTimeout(updateServerTime, 1);
    }

    // 调用 setTimeout 函数来安排第一次更新
    setTimeout(updateServerTime, 1);

    // 定义一个函数，用来解析服务器时间字符串
    function parseServerTime(serverTimeText) {
        const match = serverTimeText.match(/^(\d+)-(\d+)-(\d+)T(\d+):(\d+):(\d+)\.(\d+)$/);
        if (match) {
            const year = parseInt(match[1], 10);
            const month = parseInt(match[2], 10) - 1;
            const date = parseInt(match[3], 10);
            const hours = parseInt(match[4], 10);
            const minutes = parseInt(match[5], 10);
            const seconds = parseInt(match[6], 10);
            const milliseconds = parseInt(match[7], 10);
            const serverTime = new Date(year, month, date, hours, minutes, seconds, milliseconds);
            return serverTime;
        } else {
            return null;
        }
    }

    // 添加按钮的点击事件处理函数
    button.addEventListener('click', function() {
        // 获取用户设置的抢购时间
        var purchaseTimeValue = input.value;

        // 判断是否设置了抢购时间
        if (purchaseTimeValue === '') {
            // 如果没有设置抢购时间，弹出提示信息
            alert('请先设置好抢购时间');
        } else {
            // 如果设置了抢购时间，执行其他操作

            var selectedTime = input.value;
            var advanceTime = parseInt(advanceInput.value, 10) || 0;
            console.log("获取到的用户选择的时间:", selectedTime);
            console.log("获取到的用户选择的提前时间（毫秒）:", advanceTime);

            var purchaseTime = new Date(selectedTime).getTime() - advanceTime;
            console.log("设置了抢购时间:", purchaseTime);

            clearTimeout(timer);

            var serverTimeText = serverTimeElement.textContent;
            console.log("当前服务器时间:", serverTimeText);

            var serverTime = parseServerTime(serverTimeText).getTime();
            console.log("解析后的服务器时间:", serverTime);

            timer = setTimeout(function() { checkTime(purchaseTime); }, purchaseTime - serverTime);
            console.log("设置了新的定时器，时间间隔为:", purchaseTime - serverTime);
        }
    });

    function checkTime(purchaseTime) {
        var text = serverTimeElement.textContent;
        console.log("获取了时间元素里的文本:", text);

        var serverTime = parseServerTime(text).getTime();

        console.log("解析了时间字符串:", serverTime);

        if (serverTime >= purchaseTime) {
            //运行clickButton()函数(自动抢烟的函数)
            clickButton();
        } else {
            timer = setTimeout(function() { checkTime(purchaseTime); }, purchaseTime - serverTime);
        }
    }

    var timer = null;
}

//@@@@@@@@@@@@@@@@@@

//自动抢烟的函数
function clickButton() {
    // 记录开始时间
    let startTime = new Date().getTime();
    // 获取 iframe 元素
    let iframe = document.querySelector("iframe");
    // 切换到 iframe 的内容文档
    let iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    // 获取所有匹配的元素
    let buttons = iframeDoc.querySelectorAll(".submit-order-btn.van-button.van-button--default.van-button--normal, .edit-order-btn.van-button.van-button--default.van-button--normal");
    // 如果找到了匹配的元素
    if (buttons.length > 0) {
        // 遍历并点击每个元素
        buttons.forEach((button) => {
            //第一步:定时点击"提交订单"
            button.click();
        });
        console.log('抢烟助手【1】定时触发==点击【提交订单】');

        // 计算运行时间并显示在网页左下角
        let endTime = new Date().getTime();
        let duration = endTime - startTime;
        let durationElement = document.createElement('div');
        durationElement.textContent = '耗时:' + duration + '毫秒';
        durationElement.style.position = 'fixed';
        durationElement.style.left = '1px';
        durationElement.style.top = '1px';
        durationElement.style.backgroundColor = '#ffdab9';
        durationElement.style.fontSize = '36px'; // 设置字体大小为42px
        document.body.appendChild(durationElement);


        //第二步:(【确定要提交订单吗？】=确定++++【需要刷新商品最新可用量】=确定)
        shenzhenqdytjddm();//此函数设置了定时,每隔50毫秒检测上面2个按钮并点击,会持续60秒

        //第三步:运行shenzhenzdtjdd函数(如果提示【库存不足】或者提示可用量【刷新完成】=自动点确定+再次提交订单的函数)
        shenzhenzdtjdd();

        //第四步:假设提交订单时间提前了
        shenzhenzdtjddtwo();

    }

}

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

//第二步函数*自动点击(确定要提交订单吗？=确定++++需要刷新商品最新可用量=确定)
function shenzhenqdytjddm() {
    let iframe = document.querySelector("iframe");
    let iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    let checkElement = setInterval(function() {
        let element = iframeDoc.querySelector('#app > div > div.my-dialog > div.van-dialog');//"获取整个弹出窗口元素"
        if (element && window.getComputedStyle(element).display !== 'none') {//"排除属性为隐藏的情况"
            //"获取弹窗内容元素"
            let messageElement = element.querySelector('.van-dialog__message.van-dialog__message--has-title');
            //"②-1如果弹出窗口包含【确定要提交订单吗？】"
            if (messageElement && messageElement.textContent.includes("确定要提交订单吗？")) {
                //"那么就获取弹窗的确定按钮"
                let confirmButton = element.querySelector('.van-button.van-button--default.van-button--large.van-dialog__confirm.van-hairline--left');
                if (confirmButton) {
                    confirmButton.click();//"如果确定按钮存在就点击确定按钮"
                    console.log('抢烟助手【2-1】点击了"确定要提交订单吗？"==确定');
                }
            } else if (messageElement && messageElement.textContent.includes("需要刷新商品最新可用量")) {//"②-2如果弹出窗口包含【需要刷新商品最新可用量】"
                //"那么就获取弹窗的确定按钮"
                let confirmButton = element.querySelector('.van-button.van-button--default.van-button--large.van-dialog__confirm.van-hairline--left');
                if (confirmButton) {
                    confirmButton.click();
                    console.log('抢烟助手【2-2】点击了"需要刷新商品最新可用量"==确定');
                }
            }
        }
    }, 10);//"每隔50毫秒检测一次"

    setTimeout(function() {
        clearInterval(checkElement);//"60秒后清除上面定时器"
    }, 60000);
}


//第三步函数: 如果提示【库存不足】或者提示可用量【刷新完成】=自动点确定+再次提交订单的函数
function shenzhenzdtjdd() {
    //获取 iframe 元素
    let iframe = document.querySelector("iframe");
    // 切换到 iframe 的内容文档
    let iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    let intervalId = setInterval(function() {

        // 获取 iframe 内容文档中的元素===(2.【库存不足】确定按钮)

        // ①★★★★先获取【"库存不足"】的弹出窗口元素
        let dialog = iframeDoc.querySelector('#app > div > div.my-dialog > div.van-dialog');
        // 如果找到了库存不足的弹窗窗口元素
        if (dialog) {
            // 获取消息元素
            let messageElement = dialog.querySelector('.van-dialog__message');
            // 如果找到了元素并且元素不是隐藏状态
            if (messageElement && messageElement.offsetParent !== null) {
                // 获取消息文本
                let messageText = messageElement.textContent;
                // 如果消息文本包含 "库存不足"
                if (messageText.includes('库存不足')) {
                    // 获取确定按钮元素
                    let confirmButton = dialog.querySelector('.van-button.van-button--default.van-button--large.van-dialog__confirm');
                    // 如果找到了元素并且元素不是隐藏状态
                    if (confirmButton && confirmButton.offsetParent !== null) {
                        // 点击确定按钮
                        confirmButton.click();
                        console.log('抢烟助手【3-1】"库存不足弹窗==确认"');
                        // 获取 iframe 内容文档中的另一组元素:====1."提交订单"按钮===2."修改订单"按钮
                        let targetElements = iframeDoc.querySelectorAll('.submit-order-btn.van-button.van-button--default.van-button--normal, .edit-order-btn.van-button.van-button--default.van-button--normal');
                        // 如果找到了元素
                        if (targetElements.length > 0) {
                            // 遍历所有的元素
                            for (let j = 0; j < targetElements.length; j++) {
                                // 如果元素不是隐藏状态
                                if (targetElements[j].offsetParent !== null) {
                                    // 点击元素
                                    targetElements[j].click();
                                    console.log('抢烟助手【3-1】"库存不足==触发重新【提交订单】"');
                                }
                            }
                        }
                    }
                }
            }
        }

        // ②★★★★★获取 iframe 内容文档中的元素===(1."可用量【刷新完成】"的确定按钮----2.【库存不足】确定按钮(待添加)----3.【键盘操作提示】按钮,测试用,使用时要删除)
        let elements = iframeDoc.querySelectorAll('.van-button.van-button--default.van-button--normal.van-button--block, #库存不足-确定按钮-待添加, .keyboard-btn.ivu-btn.ivu-btn-default');
        // 如果找到了元素
        if (elements.length > 0) {
            // 遍历所有的元素
            for (let i = 0; i < elements.length; i++) {
                // 如果元素不是隐藏状态
                if (elements[i].offsetParent !== null) {
                    // 点击元素
                    elements[i].click();
                    console.log('抢烟助手【3-2】"可用量刷新完成==确定"');
                    // 获取 iframe 内容文档中的另一组元素:====1."提交订单"按钮===2."修改订单"按钮
                    let targetElements = iframeDoc.querySelectorAll('.submit-order-btn.van-button.van-button--default.van-button--normal, .edit-order-btn.van-button.van-button--default.van-button--normal');
                    // 如果找到了元素
                    if (targetElements.length > 0) {
                        // 遍历所有的元素
                        for (let j = 0; j < targetElements.length; j++) {
                            // 如果元素不是隐藏状态
                            if (targetElements[j].offsetParent !== null) {
                                // 点击元素
                                targetElements[j].click();
                                console.log('抢烟助手【3-2】"可用量刷新完成==触发重新【提交订单】"');
                            }
                        }
                    }
                }
            }
        }
    }, 10);
}

//运行上面函数


//第四步函数:假设获取的服务器时间>实际服务器时间
function shenzhenzdtjddtwo() {
    "use strict";

    let iframe = document.querySelector("iframe");//获取 iframe 元素
    let iframeDoc = iframe.contentDocument || iframe.contentWindow.document;// 切换到 iframe 的内容文档

    let clickCountConfirm = 0; // 记录点击"确定"按钮的次数
    let clickCountSubmit = 0; // 记录点击"提交订单"按钮的次数

    //检测到弹出提示:当前不可以订货窗口,那么表示订货时间未到
    let checkElement = setInterval(function() {
        let element = iframeDoc.querySelector('#app > div > div.my-dialog > div.van-dialog');

        //检测到订货时间弹窗提示
        if (element && window.getComputedStyle(element).display !== 'none' && element.textContent.includes("当前不可以订货")) {

            // 触发自动点击确定按钮
            iframeDoc.querySelector('.van-button.van-button--default.van-button--large.van-dialog__confirm').click();
            console.log('抢烟助手【4】"订货时间未到==确定"');

            clickCountConfirm++; // 增加点击"确定"按钮的次数

            //触发自动点击"提交订单"按钮
            setTimeout(function() {
                iframeDoc.querySelector('.submit-order-btn.van-button.van-button--default.van-button--normal').click();
                console.log('抢烟助手【4】"订货时间未到==重新点击提交订单"');

                clickCountSubmit++; // 增加点击"提交订单"按钮的次数
            }, 20);

        }
    }, 50);

    setTimeout(function() {
        clearInterval(checkElement);
        console.log(`订货时间未到:总共点击了【确定】按钮 ${clickCountConfirm} 次, 【提交订单】按钮 ${clickCountSubmit} 次`);
    }, 200);//23.9.10由1000毫秒改为了200毫秒(本身获取的服务器时间误差不会大于200毫秒)


}

//@@@@@@@@@@@@@@@@@@


// 调用函数打印当前页面的本地时间
printCurrentPageLocalTime();
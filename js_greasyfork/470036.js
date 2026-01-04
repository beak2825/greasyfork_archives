// ==UserScript==
// @name         定时抢购(深圳专用pc优化版8.7.7)==不刷新直接准时点击提交订单==如果提示刷新可用量就启动循环
// @version      23.8.7.7
// @description  SZYC
// @match        *://*/*
// @grant        none
// @namespace https://greasyfork.org/users/258372
// @downloadURL https://update.greasyfork.org/scripts/470036/%E5%AE%9A%E6%97%B6%E6%8A%A2%E8%B4%AD%28%E6%B7%B1%E5%9C%B3%E4%B8%93%E7%94%A8pc%E4%BC%98%E5%8C%96%E7%89%88877%29%3D%3D%E4%B8%8D%E5%88%B7%E6%96%B0%E7%9B%B4%E6%8E%A5%E5%87%86%E6%97%B6%E7%82%B9%E5%87%BB%E6%8F%90%E4%BA%A4%E8%AE%A2%E5%8D%95%3D%3D%E5%A6%82%E6%9E%9C%E6%8F%90%E7%A4%BA%E5%88%B7%E6%96%B0%E5%8F%AF%E7%94%A8%E9%87%8F%E5%B0%B1%E5%90%AF%E5%8A%A8%E5%BE%AA%E7%8E%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/470036/%E5%AE%9A%E6%97%B6%E6%8A%A2%E8%B4%AD%28%E6%B7%B1%E5%9C%B3%E4%B8%93%E7%94%A8pc%E4%BC%98%E5%8C%96%E7%89%88877%29%3D%3D%E4%B8%8D%E5%88%B7%E6%96%B0%E7%9B%B4%E6%8E%A5%E5%87%86%E6%97%B6%E7%82%B9%E5%87%BB%E6%8F%90%E4%BA%A4%E8%AE%A2%E5%8D%95%3D%3D%E5%A6%82%E6%9E%9C%E6%8F%90%E7%A4%BA%E5%88%B7%E6%96%B0%E5%8F%AF%E7%94%A8%E9%87%8F%E5%B0%B1%E5%90%AF%E5%8A%A8%E5%BE%AA%E7%8E%AF.meta.js
// ==/UserScript==



(function() {
    let container = document.createElement("div");
    container.style.position = "fixed"; // 将容器的定位方式改为fixed
    container.style.top = "50%";
    container.style.left = "10px";
    container.style.transform = "translateY(-50%)"; // 垂直居中

//适配手机版显示效果
if (window.matchMedia("(orientation: portrait)").matches) {
    container.style.left = "50%";
    container.style.top = "20%";
    container.style.transform = "translate(-50%, -50%) scale(2.2)";
}


    container.style.padding = "20px";
    container.style.background = "lightblue";
    container.style.border = "1px solid #ccc";
    container.style.borderRadius = "5px"; // 添加小圆角
    container.style.boxShadow = "2px 2px 10px rgba(0, 0, 0, 0.6)"; // 添加阴影效果
    container.style.zIndex = "9999";
    container.style.userSelect = "none"; // 禁用文本选中


    // 创建标题元素
    let title = document.createElement("div");
    title.innerText = "深圳专用定时抢烟(8.7.6优化版)";
    title.classList.add("title"); // 添加标题样式类
    Object.assign(title.style, {
        fontSize: "18px",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: "10px"
    });

    // 在容器中添加标题元素
    container.appendChild(title);

    // 创建关闭按钮元素
    let closeButton = document.createElement("div");
    closeButton.innerHTML = "&#10006;"; // 使用Unicode码表示关闭图标
    Object.assign(closeButton.style, {
        position: "absolute",
        top: "5px",
        right: "5px",
        cursor: "pointer",
        fontSize: "20px"
    });
    closeButton.addEventListener("click", function() {
        container.style.display = "none"; // 点击关闭按钮后隐藏容器
    });

    // 在容器中添加关闭按钮元素
    container.appendChild(closeButton);

    let styles = document.createElement("style");
    styles.innerHTML = `
  .item {
    margin-bottom: 10px;
    font-size: 16px;
    color: #333;
  }
  .title {
    font-weight: bold;
  }
`;

    // 将容器和样式添加到页面中
    document.body.appendChild(container);
    document.head.appendChild(styles);

    // 添加鼠标长按移动位置和保存位置功能
    let isDragging = false; // 记录是否正在拖拽
    let positionX = 0; // 记录容器的X坐标
    let positionY = 0; // 记录容器的Y坐标
    let startX = 0; // 记录鼠标按下时的X坐标
    let startY = 0; // 记录鼠标按下时的Y坐标

    let titleBar = title; // 将标题元素作为拖动栏
    titleBar.style.cursor = "move";

    titleBar.addEventListener("mousedown", function(event) {
        if (event.button === 0) { // 判断是否是鼠标左键
            isDragging = true;
            startX = event.clientX;
            startY = event.clientY;
            positionX = container.offsetLeft;
            positionY = container.offsetTop;
        }
    });

    document.addEventListener("mousemove", function(event) {
        if (isDragging) {
            container.style.left = (positionX + event.clientX - startX) + "px";
            container.style.top = (positionY + event.clientY - startY) + "px";
        }
    });

    document.addEventListener("mouseup", function(event) {
        if (event.button === 0) { // 判断是否是鼠标左键
            if (isDragging) {
                isDragging = false;
                // 保存容器的位置到本地存储
                localStorage.setItem("containerPositionX", container.style.left);
                localStorage.setItem("containerPositionY", container.style.top);
            }
        }
    });

    // 从本地存储中获取容器的位置
    /*let savedPositionX = localStorage.getItem("containerPositionX");
    let savedPositionY = localStorage.getItem("containerPositionY");
    if (savedPositionX && savedPositionY) {
        container.style.left = savedPositionX;
        container.style.top = savedPositionY;
    }*/




    /*------------------上面是容器相关的设置-----------------------------*/





    // 获取本机时间并显示在容器中的第1个样式中
    let bjTimeItem = document.createElement("div");
    bjTimeItem.classList.add("item");
    let bjTimeTitle = document.createElement("div");
    bjTimeTitle.classList.add("title");
    bjTimeTitle.innerText = "本机时间：";
    let bjTimeValue = document.createElement("div");
    bjTimeItem.appendChild(bjTimeTitle);
    bjTimeItem.appendChild(bjTimeValue);
    container.appendChild(bjTimeItem);

    // 获取服务器时间并显示在容器中的第2个样式中
    let serverTimeItem = document.createElement("div");
    serverTimeItem.classList.add("item");
    let serverTimeTitle = document.createElement("div");
    serverTimeTitle.classList.add("title");
    serverTimeTitle.innerText = "服务器时间(已加取回延迟)：";
    let serverTimeValue = document.createElement("div");
    serverTimeItem.appendChild(serverTimeTitle);
    serverTimeItem.appendChild(serverTimeValue);
    container.appendChild(serverTimeItem);

    // 计算网络延迟时间并显示在容器中的第3个样式中
    let pingItem = document.createElement("div");
    pingItem.classList.add("item");
    let pingTitle = document.createElement("div");
    pingTitle.classList.add("title");
    pingTitle.innerText = "网络延迟：";
    let pingValue = document.createElement("div");
    pingItem.appendChild(pingTitle);
    pingItem.appendChild(pingValue);
    container.appendChild(pingItem);

    // 设定自动点击的时间和提前多少毫秒执行自动点击
    let timeInputItem = document.createElement("div");
    timeInputItem.classList.add("item");
    let timeInputTitle = document.createElement("div");
    timeInputTitle.classList.add("title");
    timeInputTitle.innerText = "定时提交订单(按服务器时间)：";
    let timeInput = document.createElement("input");
    timeInput.type = "datetime-local";
    let advanceInputTitle = document.createElement("div");
    advanceInputTitle.classList.add("title");
    advanceInputTitle.innerText = "提前时间(填最小延迟/2或默认0)：";
    let advanceInput = document.createElement("input");
    advanceInput.type = "number";
    advanceInput.min = "0";
    advanceInput.max = "60000";
    advanceInput.step = "1000";
    advanceInput.value = "0"; // 设置默认值为0
    timeInputItem.appendChild(timeInputTitle);
    timeInputItem.appendChild(timeInput);
    timeInputItem.appendChild(advanceInputTitle);
    timeInputItem.appendChild(advanceInput);
    container.appendChild(timeInputItem);

    let pingUrl = window.location.href; // 网络延迟测试的 URL

    let intervalIds = []; // 定时器的 ID 数组
    let isRunning = false; // 是否正在运行


    // 更新本机时间
    function updateBJTime() {
        let bjTime = new Date();
        let bjTimeValue = document.createElement("div");
        let milliseconds = bjTime.getMilliseconds().toString().padStart(3, '0'); // 在毫秒数前面添加前导零
        bjTimeValue.innerText = bjTime.toLocaleString() + " " + milliseconds + " 毫秒";
        bjTimeItem.replaceChild(bjTimeValue, bjTimeItem.lastChild);
    }

    setInterval(updateBJTime, 10); // 每隔10毫秒更新一次本机时间的毫秒数



    // 更新服务器时间+2秒内自动点击20次"提交订单"
    let isClicking = false;
    let clickCount = 0;
    let targetInterval = 60000; // 每隔60秒自动点击一次
    let serverTime; // 保存服务器时间

    function updateServerTime() {
        let xhr = new XMLHttpRequest();
        let requestStartTime = new Date().getTime(); // 记录请求开始时间
        xhr.open("HEAD", window.location.href.toString(), true);
        xhr.setRequestHeader("Content-Type", "text/html");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 2) {
                serverTime = new Date(xhr.getResponseHeader("Date"));
                let networkLatency = (new Date().getTime() - requestStartTime) / 2; // 计算网络延迟时间
                serverTime.setMilliseconds(serverTime.getMilliseconds() + networkLatency); // 加上网络延迟时间
                let serverTimeValue = document.createElement("div");
                let milliseconds = serverTime.getMilliseconds().toString().padStart(3, '0'); // 在毫秒数前面添加前导零
                serverTimeValue.innerText = serverTime.toLocaleString() + " " + milliseconds + " 毫秒";
                serverTimeItem.replaceChild(serverTimeValue, serverTimeItem.lastChild);
                // 开始自动点击
                let targetTime = new Date(timeInput.value).getTime();
                let advanceTime = parseInt(advanceInput.value);
                if (serverTime >= targetTime - advanceTime && !isClicking) {
                    clickButton();
                    timeInput.value = new Date(targetTime + targetInterval);
                }
            }
        };
        xhr.send("");
    }



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
        console.log('定时抢购==已点击提交订单');

        // 计算运行时间并显示在网页左下角
        let endTime = new Date().getTime();
        let duration = endTime - startTime;
        let durationElement = document.createElement('div');
        durationElement.textContent = '运行时间：' + duration + '毫秒';
        durationElement.style.position = 'fixed';
        durationElement.style.left = '10px';
        durationElement.style.bottom = '10px';
        document.body.appendChild(durationElement);


        //第二步:(确定要提交订单吗？=确定++++需要刷新商品最新可用量=确定)
        shenzhenqdytjddm();

        //第三步:运行shenzhenzdtjdd函数(如果提示库存不足或者提示刷新可用量=自动点确定+再次提交订单的函数)
        shenzhenzdtjdd();

        //第四步:假设提交订单时间提前了
        shenzhenzdtjddtwo();

    }

}



//第三步函数: 如果提示库存不足或者提示刷新可用量=自动点确定+再次提交订单的函数
function shenzhenzdtjdd() {//如果提示库存不足或者提示刷新可用量=自动点确定+再次提交订单的函数
    //获取 iframe 元素
    let iframe = document.querySelector("iframe");
    // 切换到 iframe 的内容文档
    let iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    let intervalId = setInterval(function() {
        // 获取 iframe 内容文档中的元素===(1."刷新可用量完成"的确定按钮----2."库存不足"确定按钮(待添加)----3."键盘操作提示"按钮,测试用,使用时要删除)
        let elements = iframeDoc.querySelectorAll('.van-button.van-button--default.van-button--normal.van-button--block, #库存不足-确定按钮-待添加, .keyboard-btn.ivu-btn.ivu-btn-default');
        // 如果找到了元素
        if (elements.length > 0) {
            // 遍历所有的元素
            for (let i = 0; i < elements.length; i++) {
                // 如果元素不是隐藏状态
                if (elements[i].offsetParent !== null) {
                    // 点击元素
                    elements[i].click();
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
    console.log("获取 iframe 元素:", iframe);

    let iframeDoc = iframe.contentDocument || iframe.contentWindow.document;// 切换到 iframe 的内容文档
    console.log("切换到 iframe 的内容文档:", iframeDoc);

    let clickCount = 0; // 记录点击次数

    //检测到弹出提示:当前不可以订货窗口,那么表示订货时间未到
    let checkElement = setInterval(function() {
        let element = iframeDoc.querySelector('#app > div > div.my-dialog > div.van-dialog');

        //检测到订货时间弹窗提示
        if (element && window.getComputedStyle(element).display !== 'none' && element.textContent.includes("当前不可以订货")) {
            console.log("未到订货时间");

            // 触发自动点击确定按钮
            iframeDoc.querySelector('.van-button.van-button--default.van-button--large.van-dialog__confirm').click();
            console.log("触发点击*确定");

            //触发自动点击"提交订单"按钮
    setTimeout(function() {
            iframeDoc.querySelector('.submit-order-btn.van-button.van-button--default.van-button--normal').click();
            console.log("触发点击*提交订单");
    }, 20);


            clickCount++; // 增加点击次数
            console.log(`已经点击了 ${clickCount} 次`);
        }
    }, 50);

    setTimeout(function() {
        clearInterval(checkElement);
        console.log(`总共点击了 ${clickCount} 次`);
    }, 1000);

}








    //====================================================







    setInterval(updateServerTime, 9999000); // 每隔9秒更新一次网页服务器时间

    // 每隔10毫秒更新一次服务器时间的毫秒数
    setInterval(() => {
        if (serverTime) {
            serverTime.setMilliseconds(serverTime.getMilliseconds() + 10);
            let serverTimeValue = document.createElement("div");
            let milliseconds = serverTime.getMilliseconds().toString().padStart(3, '0'); // 在毫秒数前面添加前导零
            serverTimeValue.innerText = serverTime.toLocaleString() + " " + milliseconds + " 毫秒";
            serverTimeItem.replaceChild(serverTimeValue, serverTimeItem.lastChild);
        }
    }, 10);





    // 更新网络延迟时间
    function updatePingTime() {
        let pingStartTime = new Date().getTime();
        fetch(pingUrl, { method: "HEAD" })
            .then(() => {
            let pingEndTime = new Date().getTime();
            let pingTime = (pingEndTime - pingStartTime) / 2; // 计算单程的网络延迟时间
            let pingValue = document.createElement("div");
            pingValue.innerText = pingTime + " 毫秒";
            pingItem.replaceChild(pingValue, pingItem.lastChild);
        });
    }


    // 创建开始/结束执行按钮
    let startBtn = document.createElement("button");
    startBtn.innerText = "开始执行";
    startBtn.style.marginTop = "10px";
    startBtn.addEventListener("click", () => {
        if (!isRunning) { // 如果当前未运行，则开始运行
            // 更新当前时间、本机时间和服务器时间的定时器，每秒钟更新一次
            intervalIds.push(setInterval(updateBJTime, 10000000));


//检测到当前设备时间为59分58秒时立即执行获取服务器时间的函数updateServerTime,如果时间为00分01秒则停止获取并清除定时器
let intervalId;
let checkTime = () => {
    let currentTime = new Date();
    if (currentTime.getSeconds() == 58) {
        intervalId = setInterval(updateServerTime, 20);//每隔50毫秒获取一次服务器时间
        intervalIds.push(intervalId);
    } else if (currentTime.getSeconds() == 1) {
        clearInterval(intervalId);
    }
}
setInterval(checkTime, 1000);





            intervalIds.push(setInterval(updatePingTime, 10000000));

            // 初始情况下更新本机时间、服务器时间和网络延迟时间
            updateBJTime();
            updateServerTime();
            updatePingTime();

            startBtn.innerText = "结束执行";
            isRunning = true;
        } else { // 如果当前正在运行，则结束运行
            intervalIds.forEach(clearInterval); // 清除所有的定时器
            intervalIds = [];
            startBtn.innerText = "开始执行";
            isRunning = false;
        }
    });
    container.appendChild(startBtn); // 在容器中插入开始/结束执行按钮

})();
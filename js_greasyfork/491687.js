// ==UserScript==
// @name         Buff自动刷新及购买
// @namespace    http://tampermonkey.net/
// @version      2024-04-17
// @description  模仿手动操作,自动刷新和购买,建议使用批量购买,成功率更高,可以挂在后台,按理说也可以支持多开,自动发送报价的脚本在Github   https://github.com/fruktoguo/BuffAutoTrader自取,记得给个star
// @include         /https:\/\/buff\.163\.com\/goods\/(csgo|dota2|rust|h1z1|tf2|pubg|pubg_recycle|\d+)/
// @author       YuoHira
// @license      MIT
// @match        https://buff.163.com/goods/*?from=market
// @icon         https://www.google.com/s2/favicons?sz=64&domain=163.com
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/491687/Buff%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E5%8F%8A%E8%B4%AD%E4%B9%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/491687/Buff%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E5%8F%8A%E8%B4%AD%E4%B9%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 获取当前页面的URL
    console.log('当前物品ID   ' + getItemID());

    let itemName = document.querySelector('.detail-cont h1').textContent.trim();
    console.log('物品名称   ' + itemName);


    const singleConfig = {
        等待载入延迟: GM_getValue(getItemID() + '等待载入延迟', 3000),
        购买延迟: GM_getValue(getItemID() + '购买延迟', 200),
        确认付款延迟: GM_getValue(getItemID() + '确认付款延迟', 1500),
        售价过高刷新延迟: GM_getValue(getItemID() + '售价过高刷新延迟', 500),
        最小价格: GM_getValue(getItemID() + '最小价格', -1),
    };

    const batchConfig = {
        等待载入延迟: GM_getValue(getItemID() + '批量等待载入延迟', 1500),
        购买延迟: GM_getValue(getItemID() + '批量购买延迟', 1000),
        确认付款延迟: GM_getValue(getItemID() + '批量确认付款延迟', 1500),
        售价过高刷新延迟: GM_getValue(getItemID() + '批量售价过高刷新延迟', 500),
        最大价格: GM_getValue(getItemID() + '批量最大价格', -1),
        购买数量: GM_getValue(getItemID() + '批量购买数量', 1)
    };



    let isChecking = false;

    let isSingle = GM_getValue(getItemID() + 'buyMode', 'single') == 'single';

    // 添加自定义样式
    const css = `
        @keyframes cuteBackground {
            0% { background-color: #eeaaab; }
            50% { background-color: #ffcccb; }
            100% { background-color: #eeaaab; }
        }

        #my-custom-container {
            position: fixed;
            top: 40px;
            left: 50px;
            width: 320px;
            height: auto;
            background-color: #f3f3f3; /* 浅灰色 */
            border: none;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            z-index: 10000;
            padding: 10px;
            transition: all 0.3s ease; /* 添加过渡效果 */

            border-top-left-radius: 5px;
            border-top-right-radius: 40px;
            border-bottom-left-radius: 40px;
            border-bottom-right-radius: 40px;

            display: flex;
            flex-direction: column;
            align-items: center;

            animation: cuteBackground 5s infinite;
        }

        .custom-tab-container button {
            background-color: #ffcccb; /* 淡红色 */
            border: none;
            margin: 0;
            width: 50%;
            padding: 10px 10px;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            outline: none;
            transition: all 0.3s ease; /* 添加过渡效果 */
            border-radius: 5px; /* 添加圆角 */
        }

        .custom-tab-container button.active-tab {
            background-color: #ff6f61; /* 深红色 */
            border-color: #ff6f61;
            box-shadow: 0 0 10px #ff6f61; /* 添加阴影 */
        }

        .custom-tab {
            display: none;
            padding-top: 10px;
        }

        .custom-tab.active {
            display: block;
        }

        .custom-input {
            display: block;
            width: calc(80% - 120px);
            margin-top: 5px;
            padding: 5px;
            border: 1px solid #bbb;
            font-weight: bold;
            border-radius: 3px;
            transition: all 0.3s ease; /* 添加过渡效果 */
            border-radius: 5px; /* 添加圆角 */
        }

        .custom-input:hover {
            transform: scale(1.1); /* 添加弹性效果 */
        }

        .custom-label {
            font-size: 14px;
            font-weight: bold;
            color: #333;
            padding: 5px;
            position: relative;
        }

        .control-button {
            transition: transform 0.3s;
        }
        .control-button:hover {
            transform: scaleX(1.1);
            transition: transform 0.5s;
        }

        .control-button:active {
            transform: scaleY(0.9);
            transition: transform 0.2s;
        }
        `;

    const head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');
    head.appendChild(style);
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));


    // 创建一个容器来包含你的自定义窗口和按钮
    const mainContainer = document.createElement('div');
    mainContainer.style.position = 'fixed';
    mainContainer.style.zIndex = '10000';
    document.body.insertBefore(mainContainer, document.body.firstChild);

    // 创建容器
    const container = document.createElement('div');
    container.id = 'my-custom-container';
    document.body.insertBefore(container, document.body.firstChild);

    // 创建选项卡按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'custom-tab-container';

    // 创建选项卡内容容器
    const tabContainer = document.createElement('div');
    tabContainer.className = 'custom-tab-content';

    // 创建两个选项卡的按钮和内容
    const tab1Button = document.createElement('button');
    tab1Button.textContent = '单次购买';

    tab1Button.onclick = function () {
        setBuyMode('single');
    };

    tab1Button.classList.add('active-tab');
    const tab1Content = document.createElement('div');
    tab1Content.className = 'custom-tab active';

    setupInputs(singleConfig, tab1Content);

    const tab2Button = document.createElement('button');

    tab2Button.textContent = '批量购买';
    tab2Button.onclick = function () {
        setBuyMode('batch');
    };

    const tab2Content = document.createElement('div');
    tab2Content.className = 'custom-tab';

    setupInputs(batchConfig, tab2Content);

    setBuyMode(GM_getValue(getItemID() + 'buyMode', 'batch'));

    // 添加按钮及其事件监听
    let controlButton = document.createElement('button');
    controlButton.className = 'control-button';
    controlButton.textContent = GM_getValue(getItemID() + 'autoBuyEnabled', false) ? '停止自动购买' : '开始自动购买';
    controlButton.style.width = '50%';
    controlButton.style.height = '30px';
    controlButton.style.marginTop = '10px';
    controlButton.style.border = 'none';
    controlButton.style.backgroundColor = '#ff6f61';
    controlButton.style.borderRadius = '10px';
    controlButton.addEventListener('click', () => {
        toggleAutoBuy(controlButton);
    });

    // 组装容器
    buttonContainer.appendChild(tab1Button);
    buttonContainer.appendChild(tab2Button);
    tabContainer.appendChild(tab1Content);
    tabContainer.appendChild(tab2Content);
    container.appendChild(buttonContainer);
    container.appendChild(tabContainer);
    container.appendChild(controlButton);

    mainContainer.appendChild(container);

    const button = document.createElement('button');
    button.textContent = '>';
    button.style.position = 'fixed';
    button.style.top = '30px';
    button.style.left = '15px';
    button.style.width = '25px';
    button.style.height = '25px';
    button.style.fontWeight = 'bold';
    button.style.borderRadius = '50%';
    button.style.border = 'none';
    button.style.backgroundColor = '#ff6f61'; /* 深红色 */
    button.style.color = '#fff';
    mainContainer.appendChild(button);

    // 创建一个变量来跟踪页面的状态
    let isCollapsed = false;

    // 添加点击事件处理程序
    button.addEventListener('click', function () {
        if (isCollapsed) {
            // 如果页面已经收起，就展开页面
            container.style.display = 'block';
            isCollapsed = false;
            button.textContent = '>';
            button.style.boxShadow = 'none'; // 移除阴影
            button.style.transition = 'none'; // 移除过渡效果

        } else {
            // 如果页面没有收起，就收起页面
            container.style.display = 'none';
            isCollapsed = true;
            button.textContent = '<';
            button.style.boxShadow = '0 0 60px rgba(255,0,0,1)'; // 添加阴影
            button.style.transition = 'all 0.3s ease'; // 添加过渡效果
        }
    });

    const text = document.createElement('p');
    text.textContent = '是否开启通知';
    text.style.marginTop = '5px';
    text.style.marginLeft = '5px';
    container.appendChild(text);

    // 创建一个开关，用来控制是否发送通知
    const notificationSwitch = document.createElement('input');
    notificationSwitch.type = 'checkbox';
    notificationSwitch.id = 'notificationSwitch';
    notificationSwitch.style.marginTop = '5px';

    notificationSwitch.checked = GM_getValue(getItemID() + 'notificationSwitch', true);
    notificationSwitch.addEventListener('change', function () {
        GM_setValue(getItemID() + 'notificationSwitch', this.checked);
    });
    container.appendChild(notificationSwitch);


    mainCheck();


    function notify(title, body) {
        // 检测是否发送
        if (!GM_getValue(getItemID() + 'notificationSwitch', true)) {
            return;
        }
        // 检查浏览器是否支持通知
        if (!("Notification" in window)) {
            //alert("This browser does not support system notifications");
        }

        // 检查用户是否已经同意接收通知
        else if (Notification.permission === "granted") {
            // 如果已经同意，创建一个通知
            var notification = new Notification(title, {body: body});
        }

        // 否则，请求用户权限
        else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(function (permission) {
                // 如果用户同意，创建一个通知
                if (permission === "granted") {
                    var notification = new Notification(title, {body: body});
                }
            });
        }
    }

    function getPriceElements() {
        return document.querySelectorAll('.f_Strong');
    }

    // 定义一个函数来从URL中提取物品ID
    function getItemID() {
        const regExp = /goods\/(\d+)/;
        const match = window.location.href.match(regExp);

        if (match && match[1]) {
            return match[1]; // 返回物品ID
        } else {
            return null; // 如果没有匹配到，返回null
        }
    }

    // 定义一个函数来获取页面最小价格
    function getMinPrice() {
        const priceElements = getPriceElements();
        let minPrice = Number.MAX_VALUE;

        for (let priceIndex = 0; priceIndex < priceElements.length; priceIndex++) {
            const priceText = priceElements[priceIndex].textContent.replace('¥ ', '').trim();
            const price = parseFloat(priceText);

            if (price < minPrice) {
                minPrice = price;
            }
        }

        return minPrice;
    }

    //单次购买
    // 检查和刷新页面的函数
    // 使用 ES6 的语法
    function checkAndRefresh() {
        if (!GM_getValue(getItemID() + 'autoBuyEnabled', false)) return;
        isChecking = true;
        const thresholdPrice = singleConfig.最小价格;
        const minPrice = getMinPrice();

        if (minPrice <= thresholdPrice) {
            setTimeout(singleClickBuyButton, singleConfig.购买延迟);
        } else {
            console.log(`当前最低价格为 ${minPrice} ￥，高于阈值 ${thresholdPrice} ￥，刷新页面。`);
            setTimeout(reload, singleConfig.售价过高刷新延迟);
        }
    }

    function reload() {
        if (GM_getValue(getItemID() + 'autoBuyEnabled', false)) {
            location.reload();
        }
    }

    // 点击购买按钮的函数
    function singleClickBuyButton() {
        var buyButtons = document.getElementsByClassName('i_Btn i_Btn_mid2 btn-buy-order');  // 使用class名称获取购买按钮

        console.log("找到购买按钮数: " + buyButtons.length);  // 输出找到的购买按钮数量到控制台

        // 如果页面上有购买按钮
        if (buyButtons[0]) {
            console.log("找到购买按钮");
            buyButtons[0].click();  // 点击第一个购买按钮
            setTimeout(confirmPurchase, singleConfig.确认付款延迟);  //
            setTimeout(reload, 10000);
        }
    }

    const maxTime = 10000;
    const interval = 300;

    // 确认付款的函数
    function confirmPurchase() {
        let timer = 0;
        var intervalId = setInterval(function () {
            var confirmButtons = document.getElementsByClassName('i_Btn pay-btn');
            //检查所有按钮的文本，并查找包含“确认付款”的按钮
            if (confirmButtons[0]) {

                console.log("找到确认付款按钮");

                setTimeout(function () {
                    confirmButtons[0].click();
                }, 200);

                notify(`${itemName}`, `可能抢到了 ${actualNum} 个`)
                if (isSingle) {
                    setTimeout(reload, 2000);
                } else {
                    setTimeout(reload, 1000 + actualNum * 500);
                }
                clearInterval(intervalId); // 找到按钮后清除循环
            }

            timer += interval;
            if (timer >= maxTime) {
                console.log("超时,没找到确认付款按钮");
                clearInterval(intervalId);
                setTimeout(reload, 2000);
            }
        }, interval);
    }


    //批量购买
    function batchBuy_GetAndClickBtn() {
        if (!GM_getValue(getItemID() + 'autoBuyEnabled', false)) {
            return
        }

        console.log('开始批量购买');

        isChecking = true;

        var batchButton = document.getElementById('batch-buy-btn');

        if (batchButton) {
            console.log("找到批量购买按钮");
            batchButton.click();
            setTimeout(batchBuy_SetNum, 1000);
        }
    }

    //实际购买数量
    let actualNum = 0;

    function batchBuy_SetNum() {
        //获取最大售价输入框
        var maxPrice = document.getElementById('batch-buy-max-price');

        if (maxPrice) {
            maxPrice.value = batchConfig.最大价格;

            var event = new Event('change');
            maxPrice.dispatchEvent(event);
        }

        var butNum = document.getElementById('batch-buy-num');

        if (butNum) {
            butNum.value = batchConfig.购买数量;
            butNum.dispatchEvent(event);
        }

        //输入框的实际值赋值
        setTimeout(function () {
            actualNum = butNum.value;
            console.log("实际购买数量: " + actualNum);
        }, 1000);

        //延迟
        setTimeout(batchBuy_Buy, batchConfig.购买延迟);
    }

    function batchBuy_Buy() {
        //如果开启了自动购买
        if (GM_getValue(getItemID() + 'autoBuyEnabled', false)) {
            console.log("开始查找购买按钮");
            // 找到所有的td标签
            var tds = document.querySelectorAll('td');

            let buyButton;

            // 遍历所有的td标签
            tds.forEach(function (td, index, array) {
                // 找到td标签下的a标签
                var a = td.querySelector('a');
                // 如果a标签存在，并且a标签的文本是"确认"，并且前一个td标签的文本包含"应付总额"
                if (a && a.textContent === "确认" && index > 0 && array[index - 1].textContent.includes("应付总额")) {
                    if (!a.classList.contains('i_Btn_disabled')) {
                        console.log("找到确认购买按钮");
                        buyButton = a;
                        // 结束查找
                        return;
                    }
                }
            });


            if (buyButton) {
                setTimeout(function () {
                    console.log(buyButton.textContent);
                    buyButton.click();
                    console.log('开始寻找确认付款按钮')
                    setTimeout(confirmPurchase, batchConfig.确认付款延迟);
                }, 500);
            }
            else {
                console.log("未找到确认购买按钮");
                setTimeout(reload, batchConfig.售价过高刷新延迟);
            }
        }
    }


    function mainCheck() {
        if (GM_getValue(getItemID() + 'buyMode', 'single') == 'single') {

            setTimeout(checkAndRefresh, singleConfig.等待载入延迟);
            if (GM_getValue(getItemID() + 'autoBuyEnabled', false)) {
                isChecking = true;
            }
            // 运行检查刷新函数的循环
            setInterval(() => {
                if (GM_getValue(getItemID() + 'autoBuyEnabled', false) && !isChecking) {
                    checkAndRefresh();
                }
            }, 2000);

        } else {
            setTimeout(batchBuy_GetAndClickBtn, batchConfig.等待载入延迟);
            if (GM_getValue(getItemID() + 'autoBuyEnabled', false)) {
                isChecking = true;
            }
            // 运行检查刷新函数的循环
            setInterval(() => {
                if (GM_getValue(getItemID() + 'autoBuyEnabled', false) && !isChecking) {
                    batchBuy_GetAndClickBtn();
                }
            }, 2000);
        }
    }

    // 输入框设置
    function setupInputs(config, content) {
        const inputs = {};
        for (let key in config) {

            const inputContainer = document.createElement('div');
            inputContainer.style.display = 'flex';
            inputContainer.style.alignItems = 'center';
            const label = document.createElement('label');
            label.className = 'custom-label';
            label.textContent = `${key}`;
            label.style.marginRight = '10px';
            inputContainer.appendChild(label);
            const input = document.createElement('input');
            input.className = 'custom-input';
            input.style.marginLeft = 'auto';
            input.style.marginRight = '15px';
            input.type = 'number';
            input.value = config[key];

            inputContainer.appendChild(input);
            const unit = document.createElement('span');
            unit.textContent = 'ms';
            inputContainer.appendChild(unit);

            // 特殊处理最小价格输入框，允许输入小数
            if (key.includes('价格')) {
                input.step = '0.01'; // 允许精确到分
                unit.textContent = '元';
            }

            //数量
            if (key.includes('数量')) {
                unit.textContent = '个';
            }

            input.addEventListener('change', function () {
                var newKey = (isSingle ? key : '批量' + key);
                let newValue = key.includes('价格') ? parseFloat(this.value) : parseInt(this.value, 10);
                GM_setValue(getItemID() + newKey, newValue);
                console.log(`修改 ${key} ${newKey} 为 ${newValue}`);
                // console.log(config);
                config[key] = newValue;
            });

            inputs[key] = input;
            content.appendChild(inputContainer)
        }
        return inputs;
    }

    // 设置购买模式的函数
    function setBuyMode(mode) {
        console.log("设置购买模式: " + mode);
        GM_setValue(getItemID() + 'buyMode', mode);
        toggleBuyMode(mode);
    }

    // 切换购买模式的函数
    function toggleBuyMode(mode) {
        if (mode === 'single') {
            isSingle = true;
            tab1Content.classList.add('active');
            tab2Content.classList.remove('active');
            tab1Button.classList.add('active-tab');
            tab2Button.classList.remove('active-tab');


        } else {
            isSingle = false;
            tab2Content.classList.add('active');
            tab1Content.classList.remove('active');
            tab2Button.classList.add('active-tab');
            tab1Button.classList.remove('active-tab');
        }
    }

    // 开启和关闭自动购买的切换功能
    function toggleAutoBuy(button) {
        let currentStatus = GM_getValue(getItemID() + 'autoBuyEnabled', false);
        GM_setValue(getItemID() + 'autoBuyEnabled', !currentStatus);
        button.textContent = currentStatus ? '开始自动购买' : '停止自动购买';
    }

})();
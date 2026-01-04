// ==UserScript==
// @name        斗鱼鱼塘商城兑换工具
// @namespace   YourNamespaceHere
// @version     1.3
// @description 斗鱼鱼塘商城自动兑换工具 (注意手动设置个人用户ID以及房间号)
// @match       https://www.douyu.com/pages/fish-act/mine*
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522407/%E6%96%97%E9%B1%BC%E9%B1%BC%E5%A1%98%E5%95%86%E5%9F%8E%E5%85%91%E6%8D%A2%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/522407/%E6%96%97%E9%B1%BC%E9%B1%BC%E5%A1%98%E5%95%86%E5%9F%8E%E5%85%91%E6%8D%A2%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // ---------- 重要 ----------//
    let previousAcfCcnValue = null;
    let ctnid = '123'; ///用户ID 在发送请求的时候会自动在Cookies获取最新的ID
    const roomid = '123'; //房间ID 不支持靓号 (某些奖品需要粉丝牌等级才能兑)

    // 用于判断页面是否加载完成的标志变量
    let pageLoaded = false;

    // 监听页面加载状态改变事件
    window.addEventListener('load', function () {
        pageLoaded = true;
        initScript();
    });

    // 初始化脚本的函数，在页面加载完成后执行具体操作
    function initScript() {
        // 添加悬浮窗样式
        GM_addStyle(`
            #overlay {
                position: fixed;
                top: 26%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: rgba(255, 255, 255, 0.9);
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
                display: none;
                z-index: 9999;
            }

            button {
                margin: 5px;
                padding: 10px 20px;
                font-size: 16px;
                cursor: pointer;
                border: none;
                border-radius: 5px;
            }

            button.controlExchange {
                background-color: red;
                color: white;
                margin: 5px;
                padding: 10px 20px;
                font-size: 16px;
                cursor: pointer;
                border: none;
                border-radius: 5px;
            }

            button.autoExchange {
                background-color: red;
                color: white;
                margin: 5px;
                padding: 10px 20px;
                font-size: 16px;
                cursor: pointer;
                border: none;
                border-radius: 5px;
            }

            select {
                margin: 5px;
                padding: 10px;
                font-size: 16px;
                border: 1px solid #ccc;
                border-radius: 5px;
            }
        `);

        // 创建悬浮窗元素及按钮
        const overlay = document.createElement('div');
        overlay.id = 'overlay';

        // 创建控制兑换的按钮（集成启动和停止功能）
        const controlExchangeButton = document.createElement('button');
        controlExchangeButton.textContent = '启动兑换 ✔';
        controlExchangeButton.className = 'controlExchange';


        // 创建自动兑换按钮
        const autoExchangeButton = document.createElement('button');
        autoExchangeButton.textContent = '自动兑换 ✖';
        autoExchangeButton.className = 'autoExchange';

        // 创建下拉菜单元素
        const selectMenu = document.createElement('select');

        // 我只换了每种类型的第一个 再根据斗鱼的尿性推算的后面几个数字
        const items = [
            { value: 'hahahahha', text: '请选择需要兑换的奖品' },
            { value: 'PROP_1', text: '3级粉丝牌 初级水手' },
            { value: 'PROP_2', text: '3级粉丝牌 精英士官' },
            { value: 'PROP_3', text: '6级粉丝牌 心动卡' },
            { value: 'FREE_PROP_1', text: '10 陪伴印章' },
            { value: 'FREE_PROP_2', text: '30 陪伴印章' },
            { value: 'FREE_PROP_3', text: '50 陪伴印章' },
            { value: 'YC_TY_1', text: '0.1 鱼翅' },
            { value: 'YC_TY_2', text: '0.5 鱼翅' },
            { value: 'YC_TY_3', text: '1 鱼翅' },
            { value: 'YW_1', text: '100 鱼丸' },
            { value: 'YW_2', text: '200 鱼丸' },
            { value: 'YW_3', text: '500 鱼丸' },
            { value: 'YC_CHIP_1', text: '2 鱼翅碎片' },
            { value: 'YC_CHIP_2', text: '5 鱼翅碎片' }
        ];

        // 循环创建下拉菜单选项
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item.value;
            option.textContent = item.text;
            selectMenu.appendChild(option);
        });

        overlay.appendChild(controlExchangeButton);
        overlay.appendChild(autoExchangeButton);
        overlay.appendChild(selectMenu);
        document.body.appendChild(overlay);

        // 用于记录鼠标按下时的坐标以及悬浮窗初始坐标
        let startX, startY, offsetX, offsetY;

        // 为悬浮窗添加鼠标按下事件监听器
        overlay.addEventListener('mousedown', function (e) {
            startX = e.pageX;
            startY = e.pageY;
            offsetX = overlay.offsetLeft;
            offsetY = overlay.offsetTop;
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);
        });

        // 拖动时的处理函数
        function drag(e) {
            overlay.style.left = offsetX + e.pageX - startX + 'px';
            overlay.style.top = offsetY + e.pageY - startY + 'px';
        }

        // 停止拖动的处理函数
        function stopDrag() {
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDrag);
        }

        // 用于存储当前选择的index值的变量 默认无 避免出Bug的时候花光光
        let selectedIndexValue = 'hahahahha';

        // 监听下拉菜单选项改变事件，更新选中的index值
        selectMenu.addEventListener('change', function () {
            selectedIndexValue = this.value;
            console.log(`目前选择 ${this.options[this.selectedIndex].textContent} - ${this.value}`); //检查切换功能
        });

        // 用于控制兑换代码是否执行的标志变量，初始设为false表示未运行
        let isRunning = false;

        // 用于标记自动兑换功能是否开启，初始设为false
        let autoExchangeEnabled = false;

        // 显示悬浮窗
        function showOverlay() {
            overlay.style.display = 'block';
        }

        // 隐藏悬浮窗
        function hideOverlay() {
            overlay.style.display = 'none';
        }

        // // 点击启动按钮的处理函数
        // startButton.addEventListener('click', function () {
        //     isRunning = true;
        //     runExchangeLoop();
        // });

        // // 点击停止按钮的处理函数
        // stopButton.addEventListener('click', function () {
        //     isRunning = false;
        // });

        // 点击控制兑换按钮的处理函数
        controlExchangeButton.addEventListener('click', function () {
            if (isRunning) {
                isRunning = false;
                this.textContent = '启动兑换 ✔';
                this.style.backgroundColor ='red';
                console.log(`停止兑换 ${isRunning}`);
            } else {
                isRunning = true;
                this.textContent = '停止兑换 ✖';
                this.style.backgroundColor = 'green';
                console.log(`开始兑换 ${isRunning}`);
                runExchangeLoop();
            }
        });

        // 点击自动兑换按钮的处理函数
        autoExchangeButton.addEventListener('click', function () {
            autoExchangeEnabled =!autoExchangeEnabled;
            if (autoExchangeEnabled) {
                this.textContent = '自动兑换中 ✔';
                this.style.backgroundColor = 'green';
                startAutoExchange();
            } else {
                this.textContent = '自动兑换 ✖';
                this.style.backgroundColor = 'red';
                stopAutoExchange();
            }
        });

        // 获取当前时间的分钟和秒数
        function getCurrentTime() {
            const now = new Date();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();
            return { minutes, seconds };
        }

        // 模拟兑换代码执行的函数（这里简化了之前的fetch请求，实际要替换成完整准确的）
        async function exchange() {
            try {
                const cookies = document.cookie;
                const acf_ccn = cookies.split('; ').find(cookie => cookie.startsWith('acf_ccn='));
                if (acf_ccn) {
                    let acf_ccnValue = acf_ccn.split('=')[1];
                    if (previousAcfCcnValue!== acf_ccnValue) {
                        console.log(`CtnID 已经刷新 \n 旧ID:${ctnid} \n 新ID:${acf_ccnValue}`);
                        previousAcfCcnValue = acf_ccnValue;
                        ctnid = acf_ccnValue;
                    }
                }
                console.log(`兑换请求属性设置 ctn=${ctnid}&rid=${roomid}&index=${selectedIndexValue}`);
                await fetch("https://www.douyu.com/japi/revenuenc/web/actfans/convert/convertOpt", {
                    "headers": {
                        "accept": "application/json, text/plain, */*",
                        "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
                        "content-type": "application/x-www-form-urlencoded",
                        "priority": "u=1, i",
                        "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin"
                    },
                    "referrer": "https://www.douyu.com/pages/fish-act/shop",
                    "referrerPolicy": "strict-origin-when-cross-origin",
                    "body": `ctn=${ctnid}&rid=${roomid}&index=${selectedIndexValue}`,
                    "method": "POST",
                    "mode": "cors",
                    "credentials": "include"
                });
            //     await GM_xmlhttpRequest({
            //         method: 'POST',
            //         url: "https://www.douyu.com/japi/revenuenc/web/actfans/convert/convertOpt",
            //         headers: {
            //             "accept": "application/json, text/plain, */*",
            //             "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
            //             "content-type": "application/x-www-form-urlencoded",
            //             "priority": "u=1, i",
            //             "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
            //             "sec-ch-ua-mobile": "?0",
            //             "sec-ch-ua-platform": "\"Windows\"",
            //             "sec-fetch-dest": "empty",
            //             "sec-fetch-mode": "cors",
            //             "sec-fetch-site": "same-origin"
            //         },
            //         referrer: "https://www.douyu.com/pages/fish-act/shop",
            //         referrerPolicy: "strict-origin-when-cross-origin",
            //         data: `ctn=${ctnid}&rid=${roomid}&index=${selectedIndexValue}`,
            // onload: function (response) {
            //     console.log('兑换请求响应:', response);
            // },
            // onerror: function (error) {
            //     console.error('兑换出现错误:', error);
            // }
            //     });
            } catch (error) {
                console.error('兑换出现错误:', error);
            }
            await sleep(100); //0.1 秒运行一次 避免CPU占用过高崩溃
        }

        // 循环执行兑换代码的函数（根据标志变量控制）
        async function runExchangeLoop() {
            let count = 1;
            let targetCount = 200 //0,1秒运行一次 10次=1秒 100次=10秒 默认200次= 20秒 建议在 59分50秒点击启动, 会在大约00分10~13秒结束
            while (isRunning) {
                await exchange();
                console.log(`目前兑换请求发送次数 ${count}`);
                count++;
                updateControlExchangeButton(isRunning,targetCount-count);
                if (count-1 >= targetCount) {
                    isRunning = false;
                    updateControlExchangeButton(isRunning,targetCount-count);
                }
            }
        }

        // 独立的自动兑换循环执行函数
        async function autoExchangeLoop() {
            console.log('启动自动兑换功能');
            let autoExchangeCount = 0;
            while (autoExchangeEnabled) {
                const currentTime = getCurrentTime();
                if (isInTimeRange()) {
                    autoExchangeCount = 0;
                    console.log(`目前时间 ${currentTime.minutes}分${currentTime.seconds}秒 发送兑换请求`);
                    await exchange();
                    console.log(`目前时间 ${currentTime.minutes}分${currentTime.seconds}秒 发送兑换请求结束`);
                } else {
                    await sleep(1000); // 不在时间区间内，等待1秒后再次检查时间
                    autoExchangeCount++;
                    if(autoExchangeCount % 60 === 0){
                        console.log(`自动兑换运行中 每分钟提示一次 ${autoExchangeCount/60} 目前时间 ${currentTime.minutes}分${currentTime.seconds}秒`);
                    }
                }
            }
        }

        // 启动自动兑换循环
        function startAutoExchange() {
            autoExchangeLoop();
            console.log(`开始自动兑换${autoExchangeEnabled}`);
        }

        // 停止自动兑换循环
        function stopAutoExchange() {
            autoExchangeEnabled = false;
            console.log(`停止自动兑换${autoExchangeEnabled}`);
        }

        // 判断当前时间是否在指定时间区间内（59分58秒 - 00分05秒）
        function isInTimeRange() {
            const currentTime = getCurrentTime();
            return (currentTime.minutes === 59 && currentTime.seconds >= 58) || (currentTime.minutes === 0 && currentTime.seconds <= 5);
        }

        // 简单的异步等待函数（以毫秒为单位）
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        function updateControlExchangeButton(isRunning,countLeft) {
            if (isRunning) {
                controlExchangeButton.textContent = `停止兑换 ✖ 剩余请求 ${countLeft}`;
                controlExchangeButton.style.backgroundColor = 'green';
            } else {
                controlExchangeButton.textContent = '启动兑换 ✔';
                controlExchangeButton.style.backgroundColor ='red';
            }
        }

        // 页面加载完成后显示悬浮窗
        showOverlay();
    }
})();
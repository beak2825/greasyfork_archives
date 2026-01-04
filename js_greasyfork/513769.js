// ==UserScript==
// @name         无尽冬日自动兑换CDK脚本
// @namespace    https://github.com/pakeh2866
// @version      1.1
// @description  快速把多个账号都领取CDK礼包
// @author       pakeh
// @match        https://wjdr-giftcode.centurygames.cn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=centurygames.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513769/%E6%97%A0%E5%B0%BD%E5%86%AC%E6%97%A5%E8%87%AA%E5%8A%A8%E5%85%91%E6%8D%A2CDK%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/513769/%E6%97%A0%E5%B0%BD%E5%86%AC%E6%97%A5%E8%87%AA%E5%8A%A8%E5%85%91%E6%8D%A2CDK%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let game_id_value=[];
    let game_cdk_value=''
    let list_number =0;
    let list_run=0;

    // 创建按钮
    var gameIdButton = document.createElement('button');
    gameIdButton.innerHTML = 'game_id';

    var gameCdkButton = document.createElement('button');
    gameCdkButton.innerHTML = 'game_cdk';

    var test_start = document.createElement('button');
    test_start.innerHTML= '开始领取'

    // 设置按钮样式
    gameIdButton.style.position = 'fixed';
    gameIdButton.style.top = '0';
    gameIdButton.style.right = '0';
    gameIdButton.style.zIndex = '9999';
    gameCdkButton.style.position = 'fixed';
    gameCdkButton.style.top = '0';
    gameCdkButton.style.right = '90px'; // 调整位置，使其与第一个按钮隔开
    gameCdkButton.style.zIndex = '9999';
    test_start.style.position = 'fixed';
    test_start.style.top = '0';
    test_start.style.right = '180px'; // 调整位置，使其与第一个按钮隔开
    test_start.style.zIndex = '9999';

    // 将按钮添加到页面
    document.body.appendChild(gameIdButton);
    document.body.appendChild(gameCdkButton);
    document.body.appendChild(test_start);

    // 为 game_id 按钮添加点击事件处理程序
    gameIdButton.addEventListener('click', function() {
        console.log("添加game_id");
        var inputValue = prompt('请输入id组数值：');
        if (inputValue) {
            game_id_value = inputValue.split('\r\n');
            console.log(game_id_value);
            list_run =game_id_value.length;
            console.log(list_run);
        }
    })

    // 为 test_start 按钮添加点击事件处理程序
    test_start.addEventListener('click', function() {
        let i = 1;

        function executeLoop() {
            // 检查是否达到20次
            if (i > list_run) {
                console.log("Loop finished after 20 iterations");
                return; // 停止循环
            }

            console.log("test_start iteration: " + i);
            console.log(`game_id_value: ${game_id_value}, game_cdk_value: ${game_cdk_value}`);

            setInputWrapValue();
            list_number = list_number + 1;

            setTimeout(() => {
                simulateButtonClick();
            }, 200);

            setTimeout(() => {
                cdk_set_value();
            }, 700);

            setTimeout(() => {
                simulate_exchange();
            }, 900);

            setTimeout(() => {
                simulate_textbox();
            }, 1500);

            setTimeout(() => {
                simulate_exit();

                // 增加计数并继续循环
                i++;
                setTimeout(executeLoop, 3000); // 3秒后执行下一次循环
            }, 1900);
        }

        // 开始第一次执行
        executeLoop();
    });

    // 为 gameCdkButton 按钮添加点击事件处理程序
    gameCdkButton.addEventListener('click', function() {
        console.log("click");
        var cdk_input = prompt('请输入CDK数值：');
        if (cdk_input) {
            game_cdk_value= cdk_input;
        }
    })

    //为ID框写入ID值
    function setInputWrapValue() {
        const inputWrapElements = document.querySelector('input')
        console.log(inputWrapElements);
        inputWrapElements.focus();
        const inputEvent = new Event('input');
        inputWrapElements.value = game_id_value[list_number];
        inputWrapElements.dispatchEvent(inputEvent);
        console.log(inputWrapElements);

    }

    //触发登陆按钮
    function simulateButtonClick() {
        const button_login = document.getElementsByClassName('btn login_btn');
        console.log(button_login);
        if (button_login) {
            button_login[0].click();
        }
    }

    //为CDK框写入值
    function cdk_set_value() {
        const input_Elements = document.querySelectorAll('input');
        const input_elment_final = input_Elements[0];
        console.log(input_Elements);
        input_elment_final.focus();
        const inputEvent2 = new Event('input');
        input_elment_final.value = game_cdk_value;
        input_elment_final.dispatchEvent(inputEvent2);
    }

    //触发兑换按钮
    function simulate_exchange() {
        const button_exchange = document.getElementsByClassName('btn exchange_btn');
        console.log(button_exchange);
        if (button_exchange) {
            button_exchange[0].click();
        }
    }

    //触发关闭对话框按钮
    function simulate_textbox() {
        const button_textbox = document.getElementsByClassName('close_btn');
        console.log(button_textbox);
        if (button_textbox) {
            button_textbox[0].click();
        }
    }

    //触发登出按钮
    function simulate_exit() {
        const button_exit = document.getElementsByClassName('exit_icon');
        console.log(button_exit);
        if (button_exit) {
            button_exit[0].click();
        }
    }
})();

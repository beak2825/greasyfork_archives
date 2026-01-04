// ==UserScript==
// @name        地牢小助手
// @namespace   Violentmonkey Scripts
// @match       https://g1tyx.github.io/dungeon-crawler-od/*
// @grant       none
// @version     1.1
// @author      -
// @description 2024/10/20 23:52:23
// @downloadURL https://update.greasyfork.org/scripts/513358/%E5%9C%B0%E7%89%A2%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/513358/%E5%9C%B0%E7%89%A2%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==



        // 获取要观察的元素
        const dungeonLog = document.getElementById('dungeonLog');

        // 创建 MutationObserver 的回调函数
        const observerCallback = function(mutationsList, observer) {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    // 检查 dungeonLog 中是否存在 class 为 'decision-panel' 的元素
                    const decisionPanel = dungeonLog.querySelector('.decision-panel');

                    if (decisionPanel) {
                        console.log('Found an element with class "decision-panel"');

                        // 获取 decision-panel 的父元素
                        const parentElement = decisionPanel.parentElement;

                        if (parentElement) {
                            // 获取父元素的前一个兄弟元素
                            const previousSibling = parentElement.previousElementSibling;
                            console.log(previousSibling);

                            if (previousSibling &&  previousSibling.querySelector('.Heirloom'))  {
                              console.log('有 "Heirloom"');
                              console.log(previousSibling.textContent);
                              if (previousSibling.textContent.includes('Boss') | previousSibling.textContent.includes('神秘')){
                                console.log('有boss');
                                if (!input2.checked){
                                var ignoreButton = decisionPanel.querySelector('#choice2');}else{
                                  var ignoreButton = decisionPanel.querySelector('#choice1');
                                }
                                ignoreButton.click();
                              }else{
                                if(!input.checked){
                                var ignoreButton1 = decisionPanel.querySelector('#choice1');}else{
                                  var ignoreButton1 = decisionPanel.querySelector('#choice2');
                                }
                                ignoreButton1.click();
                              }
                            } else if (previousSibling &&  previousSibling.querySelector('.Legendary') && importButton.checked ) {
                              var ignoreButton = decisionPanel.querySelector('#choice2');
                              ignoreButton.click();
                            } else {
                                console.log('没  "Heirloom"');
                               var ignoreButton = decisionPanel.querySelector('#choice1');
                              if (ignoreButton) {
                              ignoreButton.click();

                              var combatPanel = document.getElementById('combatPanel');





        // 定时检查元素的 display 属性和内容
          var checkDisplayAndClick = setInterval(() => {
            // 获取 combatPanel 的计算样式
            var displayValue = window.getComputedStyle(combatPanel).display;

            if (displayValue === 'flex') {
                console.log('combatPanel is displayed as flex');

                // 检查是否存在 class="decision-panel" 的元素
                var decisionPanel = combatPanel.querySelector('.decision-panel');
                if (decisionPanel) {
                    console.log('decision-panel found');

                    // 查找并自动点击按钮
                    var battleButton = decisionPanel.querySelector('#battleButton');
                    if (battleButton) {
                        battleButton.click();
                        console.log('battleButton clicked');
                        // 条件满足后可以清除定时器（可选）
                        clearInterval(checkDisplayAndClick);
                    }
                }
            } else {
                console.log('combatPanel is not displayed or is hidden');
            }
        }, 1000); // 每秒检查一次

                              }
                            }
                        }
                    }
                }
            }
        };

        // 创建一个 MutationObserver 实例并传入回调函数
        const observer = new MutationObserver(observerCallback);

        // 配置要监听的变化类型
        const config = { childList: true, subtree: true };

function LQSJ(){
          // 获取 lvlupPanel 元素
        var lvlupPanel = document.getElementById('lvlupPanel');

        // 定时器，检查 display 属性
        var checkDisplayAndClick = setInterval(() => {
            // 获取 lvlupPanel 的计算样式
            var displayValue = window.getComputedStyle(lvlupPanel).display;

            if (displayValue === 'flex') {
                console.log('lvlupPanel is displayed as flex');

                // 查找 lvlupSelect 区域中的所有按钮
                var lvlupSelect = document.getElementById('lvlupSelect');
                var buttons = lvlupSelect.querySelectorAll('button');

                let buttonToClick = null;

                // 优先级判断
                buttons.forEach(button => {

                    var h3Text = button.textContent;

                    if (h3Text.includes('攻击提升')) {
                        buttonToClick = button;
                        console.log('Found "攻击提升"');
                    } else if (!buttonToClick && h3Text.includes('生命值提升')) {
                        buttonToClick = button;
                        console.log('Found "生命值提升"');
                    } else if (!buttonToClick && h3Text.includes('攻击速度提升')) {
                        buttonToClick = button;
                        console.log('Found "攻击速度提升"');
                    } else if (!buttonToClick && h3Text.includes('暴击伤害提升')) {
                        buttonToClick = button;
                        console.log('Found "暴击伤害提升"');
                    }
                });

                // 如果都没有符合优先级的选项，默认点击 lvlSlot0
                if (!buttonToClick) {
                    buttonToClick = document.getElementById('lvlSlot0');
                    console.log('Defaulting to lvlSlot0');
                }

                // 自动点击选中的按钮
                if (buttonToClick) {
                    buttonToClick.click();
                    console.log('Clicked button:', buttonToClick.querySelector('h3').textContent);

                    // 点击后清除定时器
                    //clearInterval(checkDisplayAndClick);
                }
            } else {
                console.log('lvlupPanel is not displayed');
            }
        }, 1000); // 每秒检查一次
}


        var moneyButton = document.createElement('button');
        moneyButton.textContent = "开始监听";
        moneyButton.id = "moneyButton"
        moneyButton.style.margin = '0px 0px 0px 0px';
        moneyButton.style.color = 'coral'
        moneyButton.onclick = function(){
          observer.observe(dungeonLog, config);
          LQSJ();
        }



        var importButton = document.createElement('input');
        importButton.type = 'checkbox'
        importButton.name = '不点黄祭坛'
        importButton.id = 'importButton';



        const input = document.createElement('input');
        input.type = 'checkbox'
        input.name = '不点红祭坛'
        input.id = 'input';


        const input2 = document.createElement('input');
        input2.type = 'checkbox'
        input2.name = '打boss和红未知'
        input2.id = 'input2';



        const  thisdiv = document.createElement('div');
        thisdiv.style.position = 'absolute';
        thisdiv.style.top = '5px';
        thisdiv.style.left = '55px';
        thisdiv.style.zIndex = '99998';
        thisdiv.id='scriptDiv';
        thisdiv.style.textAlign = 'left'
        thisdiv.style.width = "170px";
        thisdiv.style.color = 'coral'



        document.body.appendChild(thisdiv);
        thisdiv.appendChild(document.createTextNode("不点红祭坛"));
        thisdiv.appendChild(input);
thisdiv.appendChild(document.createElement("br"));
        thisdiv.appendChild(document.createTextNode("打boss和红未知"));
        thisdiv.appendChild(input2);
thisdiv.appendChild(document.createElement("br"));
        thisdiv.appendChild(document.createTextNode("不点黄祭坛"));
        thisdiv.appendChild(importButton);
thisdiv.appendChild(document.createElement("br"));
        thisdiv.appendChild(moneyButton);



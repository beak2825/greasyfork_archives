// ==UserScript==
// @name         虎牙崩坏星穹铁道自动发弹幕和送礼物
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  进入虎牙个人主页，然后进入订阅界面，可以选择执行一次或者自动每天执行（自动每天不能关闭网页）
// @author       线性代数
// @match        https://i.huya.com/index.php?m=Subscribe
// @match        https://www.huya.com/*
// @grant        none
// @license CC BY-NC-ND 4.0
// @downloadURL https://update.greasyfork.org/scripts/487457/%E8%99%8E%E7%89%99%E5%B4%A9%E5%9D%8F%E6%98%9F%E7%A9%B9%E9%93%81%E9%81%93%E8%87%AA%E5%8A%A8%E5%8F%91%E5%BC%B9%E5%B9%95%E5%92%8C%E9%80%81%E7%A4%BC%E7%89%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/487457/%E8%99%8E%E7%89%99%E5%B4%A9%E5%9D%8F%E6%98%9F%E7%A9%B9%E9%93%81%E9%81%93%E8%87%AA%E5%8A%A8%E5%8F%91%E5%BC%B9%E5%B9%95%E5%92%8C%E9%80%81%E7%A4%BC%E7%89%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';
var dataLink
    const videoDom = document.createElement('video');
    const hiddenCanvas = document.createElement('canvas');

    videoDom.setAttribute('style', 'display:none');
    videoDom.setAttribute('muted', '');
    videoDom.muted = true;
    videoDom.setAttribute('autoplay', '');
    videoDom.autoplay = true;
    videoDom.setAttribute('playsinline', '');
    hiddenCanvas.setAttribute('style', 'display:none');
    hiddenCanvas.setAttribute('width', '1');
    hiddenCanvas.setAttribute('height', '1');
    hiddenCanvas.getContext('2d')?.fillRect(0, 0, 1, 1);
    videoDom.srcObject = hiddenCanvas?.captureStream();

    // 功能函数，用于执行在 https://i.huya.com/ 上的操作
    function performActionsOnSite1() {
        // 创建第一个按钮
// 创建第一个按钮
const button = document.createElement('button');
button.textContent = '立即发弹幕送礼物一次';
button.style.position = 'fixed';
button.style.top = '50%';
button.style.left = '0'; // 将左侧定位设置为 0
button.style.transform = 'translateY(-50%)';
button.style.zIndex = '10000';
button.style.backgroundColor = 'green'; // 设置背景颜色为绿色
button.style.fontSize = '15px'; // 设置字体大小
button.style.padding = '8px 15px'; // 设置内边距
document.body.appendChild(button);

// 创建第二个按钮
const button2 = document.createElement('button');
button2.textContent = '开始定时发弹幕送礼物';
button2.style.position = 'fixed';
button2.style.top = 'calc(50% + 50px)'; // 与第一个按钮相隔50px
button2.style.left = '0'; // 将左侧定位设置为 0
button2.style.transform = 'translateY(-50%)';
button2.style.zIndex = '10000';
button2.style.backgroundColor = 'green'; // 设置背景颜色为绿色
button2.style.fontSize = '15px'; // 设置字体大小
button2.style.padding = '8px 15px'; // 设置内边距
document.body.appendChild(button2);

        button2.addEventListener('click', function() {
            button2.textContent = '自动任务运行中';
             button2.disabled = true;
            let hasClicked = false;
            setInterval(function() {
                const currentDate = new Date();
                const currentHour = currentDate.getHours();
                const currentMinute = currentDate.getMinutes();
                if (currentHour === 0 && currentMinute >= 1 && currentMinute <= 9 && !hasClicked) {
                    button.click();
                    hasClicked = true; // 标记为已点击
                } else if (currentHour === 0 && currentMinute > 9) {
                    hasClicked = false; // 重置为未点击，以便第二天重新触发
                }
            },60*1000);
        });

        button.addEventListener('click', function() {
            try {
                setTimeout(function() {
                    const listItems = document.querySelectorAll('ul#subWrap > li');
                    var count=0
                    listItems.forEach(function(li, index) {
                        count++;
                        setTimeout(function() {
                             dataLink = li.getAttribute('data-link');
                            let p1Element = li.querySelector("div.text_wrap > p.p_1");
var date = new Date();
var month = date.getMonth() + 1; // 获取当前月份(0-11,0代表1月)
var strDate = date.getDate(); // 获取当前日(1-31)

// 构建今天已完成的文本内容
var completedText = month + '月' + strDate + '日已完成√√√';

// 判断内容是否是今天已完成
if (p1Element && p1Element.textContent.trim() !== completedText) {
    // 如果不是今天已完成的内容，则进行相应的操作
    p1Element.textContent = completedText;
       var Window = window.open(dataLink);
} else {
    console.log('今天已完成，无需更改文本');
}
                            console.log('单个<li>元素被点击');
                            setTimeout(() => {
                                Window.close();
                            }, 20000);
                        }, index * 22000); // 设置每个点击之间的20秒延迟
                    });
                    console.log('所有<li>元素被点击');
                }, 1000); // Adjust delay as needed
            } catch (e) {
                console.error('Script execution error:', e);
            }
        });
    }

    // 功能函数，用于执行在 https://www.huya.com/ 上的操作
    function performActionsOnSite2() {
        console.log('正在执行站点2的脚本操作');
        var counter = 0;

        function co() {
            counter++;
            if (counter <= 4) {
                var randomNumber = Math.floor(Math.random() * 3) + 2;
                setTimeout(fn, 1000*randomNumber);
            }
        }

        function fn() {
var val = "你好你好 又这么晚啊 这个怎么玩 这伤害？不是吧 好好好这么玩是吧 666 晚上好 蛙趣 星穹铁道，启动";

var valList = val.split(" ");

var randomIndex = Math.floor(Math.random() * valList.length);
var Val = valList[randomIndex];
            if (Val != "") {
                var input = document.querySelector('#player-full-input-txt');
                input.value = Val;
                var btn = document.querySelector('#player-full-input-btn');
                btn.click();
                if (counter <= 4) {
                    setTimeout(co, 100);
                }
            }
        }

        function performAdditionalClicks() {
            setTimeout(() => {
                document.querySelector("#player-face > div.player-face-arrow").click();
                //document.querySelector('li[propsid="20206"]').click();
                document.querySelector("#player-gift-dialog > span.btn.confirm").click();
                setTimeout(() => {
                    window.close();
                }, 20000);
            }, 3000);
        }

        performAdditionalClicks();
        setTimeout(fn, 2000);
    }

    // 根据当前网站的URL决定执行哪个函数
    if (window.location.href.includes('i.huya.com')) {
        console.log('检测到站点1的URL，准备执行站点1的操作');
        performActionsOnSite1();
    } else if (window.location.href.includes('www.huya.com')) {
        console.log('检测到站点2的URL，准备执行站点2的操作');
        setTimeout(() => performActionsOnSite2(), 3000);
    } else {
        console.log('当前URL不匹配任何预设的站点，不执行操作');
    }
})();
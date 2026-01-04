// ==UserScript==
// @name         NJTECH Badminton
// @namespace    https://ggtypt.njtech.edu.cn/venue/reservation/
// @version      1.1.1
// @description  grap the badminton court in NJTECH!
// @author       HoWaJia
// @match        https://ggtypt.njtech.edu.cn/venue/reservation
// @icon         https://www.google.com/s2/favicons?sz=64&domain=njtech.edu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483473/NJTECH%20Badminton.user.js
// @updateURL https://update.greasyfork.org/scripts/483473/NJTECH%20Badminton.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload=function(){
    
    var info = {
    'time': "20:30-21:30", // 你想打的时段，开始时段，格式如：15:30-16:30
    'tel': ""
}

function createButton(text) {
    var button = document.createElement('button');
    button.innerText = text;
    button.style.padding = '20px 65px';
    button.style.fontSize = '16px';
    button.style.border = 'none';
    button.style.borderRadius = '60px';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '4px 6px 9px rgba(0, 0, 0, 0.6)';
    button.style.background = 'rgba(255,255,255, 0.6)';
    button.style.backdropFilter = 'blur(31px)';
    button.style.background = 'linear-gradient(to right, #BC95C6 0%, #7DC4CC 100%)';
    button.style.color = 'white';
    button.style.textShadow = '2px 2px 0px #000';
    button.style.transition = 'transform 0.2s, color 0.2s, text-shadow 0.2s';

    // 鼠标悬停时的动画和样式变化效果
    button.onmouseover = function () {
        this.style.transform = 'scale(1.1)';
        this.style.color = 'black';  // 文字颜色变黑
        this.style.textShadow = '2px 2px 6px #fff';  // 描边变白
    };
    button.onmouseout = function () {
        this.style.transform = 'scale(1)';
        this.style.color = 'white';  // 文字颜色变回白色
        this.style.textShadow = '2px 2px 6px #000';  // 描边变回黑色
    };

    return button;
}

var floatingDiv = document.createElement('div');
floatingDiv.id = 'floatingDiv';
floatingDiv.style.position = 'fixed';
floatingDiv.style.top = '50%';
floatingDiv.style.transform = 'translateY(-50%)';
floatingDiv.style.right = '0';
floatingDiv.style.zIndex = '1000';
floatingDiv.style.padding = '10px';
var buttonContainer = document.createElement('div');
buttonContainer.style.display = 'flex';
buttonContainer.style.flexDirection = 'column';
buttonContainer.style.alignItems = 'flex-end';
buttonContainer.style.marginBottom = '20px';
var triggerButton = createButton('预约');
var stopButton = createButton('停止');
buttonContainer.appendChild(triggerButton);
buttonContainer.appendChild(document.createElement('br'));
buttonContainer.appendChild(stopButton);
floatingDiv.appendChild(buttonContainer);
document.body.appendChild(floatingDiv);
// 样式

// 辅助函数，用于等待指定元素出现在DOM中
function waitForElement(selector) {
    return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) {
            resolve(element);
        }

        // 使用MutationObserver等待元素出现
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (!mutation.addedNodes) return;
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    // 检查是否是需要的元素
                    const node = mutation.addedNodes[i];
                    if (node.matches && node.matches(selector)) {
                        observer.disconnect();
                        resolve(node);
                        return;
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 如果元素在一定时间内没有出现，则reject
        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Element ${selector} did not appear within time limit`));
        }, 5000); // 设置最大等待时间，比如5000毫秒
    });
}

// 检查元素是否存在
function checkIfElementExists(selector) {
    // 尝试获取元素
    var element = document.querySelector(selector);

    // 判断元素是否存在
    if (element) {
        return true;
    } else {
        return false;
    }
}

// 序列化点击操作
async function sequentialClicks() {
    try {
        // 点击one
        const one = await waitForElement('body > div.fullHeight > div > div.siderWrap > div > div.ivu-layout-sider-children > div.left-menu > ul > div.fullHeight.scroll > li:nth-child(2)');
        one.click();

        // 等待two出现，并点击
        const two = await waitForElement('body > div.fullHeight > div > div.ivu-layout > div.rightContent.ivu-layout > div > div.ivu-card.ivu-card-bordered.ivu-card-dis-hover > div > div > div.reservationStep1 > form > div:nth-child(2) > div > div > label:nth-child(7)');
        two.click();

        // 等待three出现，并点击
        const three = await waitForElement('body > div.fullHeight > div > div.ivu-layout > div.rightContent.ivu-layout > div > div.ivu-card.ivu-card-bordered.ivu-card-dis-hover > div > div > div.reservationStep1 > form > div:nth-child(3) > div > div > label');
        three.click();
    } catch (error) {
        console.error(error);
    }
}

// 如果是在reservation界面
async function bClicks() {
    try {

        // 等待two出现，并点击
        const two = await waitForElement('body > div.fullHeight > div > div.ivu-layout > div.rightContent.ivu-layout > div > div.ivu-card.ivu-card-bordered.ivu-card-dis-hover > div > div > div.reservationStep1 > form > div:nth-child(2) > div > div > label:nth-child(7)');
        two.click();

        // 等待three出现，并点击
        const three = await waitForElement('body > div.fullHeight > div > div.ivu-layout > div.rightContent.ivu-layout > div > div.ivu-card.ivu-card-bordered.ivu-card-dis-hover > div > div > div.reservationStep1 > form > div:nth-child(3) > div > div > label');
        three.click();
    } catch (error) {
        console.error(error);
    }
}

// 模拟输入框键入
function simulateInputTyping(text, inputName) {
    input = inputName
    input.value = ''; // 清空输入框
    for (var i = 0; i < text.length; i++) {
        var event = new KeyboardEvent('keydown', {
            key: text[i],
            bubbles: true,
            cancelable: true,
            view: window
        });
        input.dispatchEvent(event);

        event = new KeyboardEvent('keypress', {
            key: text[i],
            bubbles: true,
            cancelable: true,
            view: window
        });
        input.dispatchEvent(event);

        input.value += text[i];

        event = new KeyboardEvent('input', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        input.dispatchEvent(event);

        event = new KeyboardEvent('keyup', {
            key: text[i],
            bubbles: true,
            cancelable: true,
            view: window
        });
        input.dispatchEvent(event);
    }
}

var intervalId = null;
var hasClicked = false;
var yuyue_fun = function () {
    // 获取当前页面的URL
    var currentUrl = window.location.href;
    // 指定的URL
    var targetUrl = "https://ggtypt.njtech.edu.cn/venue/reservation";
    // 判断当前URL是否与指定的URL匹配
    if (currentUrl === targetUrl) {
        // 如果是，调用functionB
        bClicks();
    } else {
        // 如果不是，调用functionA
        sequentialClicks();
    }

    var last_button = document.querySelector('body > div.fullHeight > div > div.ivu-layout > div.rightContent.ivu-layout > div > div.ivu-card.ivu-card-bordered.ivu-card-dis-hover > div > div > div.reservationStep1 > form > div:nth-child(1) > div > button:nth-child(3)')
    var late_button_selector = 'body > div.fullHeight > div > div.ivu-layout > div.rightContent.ivu-layout > div > div.ivu-card.ivu-card-bordered.ivu-card-dis-hover > div > div > div.reservationStep1 > div:nth-child(3) > div.tableWrap > div > div > div > div > div > table > thead > tr > td:nth-child(6) > div > span > i'
    if (checkIfElementExists(late_button_selector)) {
        var late_button = document.querySelector('body > div.fullHeight > div > div.ivu-layout > div.rightContent.ivu-layout > div > div.ivu-card.ivu-card-bordered.ivu-card-dis-hover > div > div > div.reservationStep1 > div:nth-child(3) > div.tableWrap > div > div > div > div > div > table > thead > tr > td:nth-child(6) > div > span > i')
    }
    // 条款
    var agree_input_selector = 'body > div.fullHeight > div > div.ivu-layout > div.rightContent.ivu-layout > div > div.ivu-card.ivu-card-bordered.ivu-card-dis-hover > div > div > div.reservationStep1 > div:nth-child(4) > label > span > input'
    if (checkIfElementExists(agree_input_selector)) {
        var agree_input = document.querySelector('body > div.fullHeight > div > div.ivu-layout > div.rightContent.ivu-layout > div > div.ivu-card.ivu-card-bordered.ivu-card-dis-hover > div > div > div.reservationStep1 > div:nth-child(4) > label > span > input');
    }
    // 预约
    var yuyue_button = document.querySelector('body > div.fullHeight > div > div.ivu-layout > div.rightContent.ivu-layout > div > div.ivu-card.ivu-card-bordered.ivu-card-dis-hover > div > div > div.reservationStep1 > div.checkStep > div > button');

    // 调整到最新日期
    last_button.click()
    // 同意条款
    if (!agree_input.checked) {
        agree_input.click()
    }

    function checkAndClickConsecutive(groups, late_button) {
        // 尝试找到并点击连续的'free'元素
        for (let elements of groups) {
            if (hasClicked) break;
            for (let i = 0; i < elements.length - 1; i++) {
                if (elements[i].classList.contains('free') && elements[i + 1].classList.contains('free')) {
                    elements[i].click();
                    elements[i + 1].click();
                    console.log('Clicked:', elements[i], elements[i + 1]);
                    hasClicked = true;
                    clearInterval(intervalId); // 停止定时器
                    intervalId = null; // 重置intervalId
                    console.log(hasClicked)
                    break;
                }
            }
        }

        // 如果没有找到连续的'free'元素，点击'late_button'然后再次检查
        if (!hasClicked) {
            if (late_button) {
                late_button.click();
            }

            // 再次检查连续的'free'元素
            for (let elements of groups) {
                if (hasClicked) break; // 如果已经点击过一对，停止检查
                for (let i = 0; i < elements.length - 1; i++) {
                    if (elements[i].classList.contains('free') && elements[i + 1].classList.contains('free')) {
                        elements[i].click();
                        elements[i + 1].click();
                        console.log('Clicked:', elements[i], elements[i + 1]);
                        hasClicked = true;
                        clearInterval(intervalId); // 停止定时器
                        intervalId = null; // 重置intervalId
                        break;
                    }
                }
            }
        }
    }


    // 获取tbody元素
    var tbody = document.querySelector('tbody[data-v-4edc92c6]');

    // 获取所有的tr元素
    var trs = tbody.querySelectorAll('tr[data-v-4edc92c6]');

    // 初始化一个空数组来存储分组
    var groups = [];

    // 初始化变量来存储找到的时间匹配的行索引
    var startIndex = -1;

    // 遍历每个tr元素
    trs.forEach(function (tr, rowIndex) {
        // 获取每个tr的第一个td元素
        var firstTd = tr.querySelector('td[data-v-4edc92c6]');

        // 获取第一个td中的文本内容
        var text = firstTd.innerText.trim();

        // 检查文本是否匹配用户输入的时间
        if (text === info.time.trim() && startIndex === -1) {
            startIndex = rowIndex; // 设置开始索引
        }

        // 从第二个td开始（因为第一个td是时间）
        for (let tdIndex = 1; tdIndex < tr.children.length; tdIndex++) {
            // 获取对应的td元素
            var td = tr.children[tdIndex];

            // 获取td中的div元素
            var div = td.querySelector('div[data-v-4edc92c6]');

            // 确保分组数组足够长
            if (groups.length < tdIndex) {
                groups.push([]); // 添加一个新的分组
            }

            // 将div添加到对应的分组中
            if (div) {
                groups[tdIndex - 1].push(div);
            }
        }
    });

    groups.forEach(function (group) {
        group.pop(); // 删除最后一个元素
    });
    console.log("groups:", groups)
    // 如果找到匹配的时间
    if (startIndex !== -1) {
        // 从匹配的时间行开始，获取后面的所有行
        var selectedGroups = groups.map(group => group.slice(startIndex));
        // 从每个选定的分组中删除最后一个元素

        console.log("selectedGroups", selectedGroups)
        // 调用checkAndClickConsecutive函数处理这些行
        checkAndClickConsecutive(selectedGroups, late_button);
    } else {
        console.log("没有找到匹配的时间");
        checkAndClickConsecutive(groups, late_button)
    }


    yuyue_button.click()

    var tel_input = document.querySelector('body > div.fullHeight > div > div.ivu-layout > div.rightContent.ivu-layout > div > div.ivu-card.ivu-card-bordered.ivu-card-dis-hover > div > div > div.reservation-step-two > form > div > div.ivu-col.ivu-col-span-sm-12 > div > div > div > div > input')

    simulateInputTyping(info.tel, tel_input)
}

// 开始
triggerButton.addEventListener('click', function () {
    if (!hasClicked) {
        if (intervalId === null) {
            // 开始点击
            intervalId = setInterval(function () {
                yuyue_fun()
                console.log('自动点击进行中...');
            }, 10);  // 每10毫秒点击一次
        }
    } else {
        // 如果已经点击过，重置hasClicked并重新开始
        hasClicked = false;
        intervalId = setInterval(function () {
            yuyue_fun()
            console.log('自动点击进行中...');
        }, 10);  // 每10毫秒点击一次
    }
});

// 停止
stopButton.addEventListener('click', function () {
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
        console.log('自动点击已停止');
    }
});
}
})();
// ==UserScript==
// @name         红书聚光_自用
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Create a floating window that can be minimized and expanded, and sticks to the bottom right corner.
// @author       You
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525870/%E7%BA%A2%E4%B9%A6%E8%81%9A%E5%85%89_%E8%87%AA%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/525870/%E7%BA%A2%E4%B9%A6%E8%81%9A%E5%85%89_%E8%87%AA%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 统一管理样式
    const styles = {
        floatingWindow: {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '300px',
            height: '200px',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
            zIndex: '9999',
            display: 'none'
        },
        titleBar: {
            backgroundColor: '#f0f0f0',
            padding: '5px',
            cursor: 'move'
        },
        minimizeButton: {
            float: 'right'
        },
        windowContent: {
            padding: '10px'
        },
        floatingBall: {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '50px',
            height: '50px',
            backgroundColor: '#007BFF',
            borderRadius: '50%',
            cursor: 'pointer',
            zIndex: '9999'
        }
    };

    // 创建悬浮窗口元素
    const floatingWindow = document.createElement('div');
    floatingWindow.id = 'floating-window';
    Object.assign(floatingWindow.style, styles.floatingWindow);

    // 创建窗口标题栏
    const titleBar = document.createElement('div');
    Object.assign(titleBar.style, styles.titleBar);
    titleBar.textContent = 'Floating Window';

    // 创建最小化按钮
    const minimizeButton = document.createElement('button');
    Object.assign(minimizeButton.style, styles.minimizeButton);
    minimizeButton.textContent = '-';
    minimizeButton.addEventListener('click', function() {
        floatingWindow.style.display = 'none';
        floatingBall.style.display = 'block';
    });
    titleBar.appendChild(minimizeButton);

    // 将标题栏添加到窗口
    floatingWindow.appendChild(titleBar);

    // 创建窗口内容
    const windowContent = document.createElement('div');
    Object.assign(windowContent.style, styles.windowContent);
    windowContent.textContent = 'This is the content of the floating window.';
    floatingWindow.appendChild(windowContent);

    // 创建折叠后的小圆球
    const floatingBall = document.createElement('div');
    floatingBall.id = 'floating-ball';
    Object.assign(floatingBall.style, styles.floatingBall);
    floatingBall.addEventListener('click', function() {
        floatingBall.style.display = 'none';
        floatingWindow.style.display = 'block';
    });



    // 实现窗口拖动功能
    let isDragging = false;
    let offsetX, offsetY;

    titleBar.addEventListener('mousedown', function(e) {
        isDragging = true;
        offsetX = e.clientX - floatingWindow.offsetLeft;
        offsetY = e.clientY - floatingWindow.offsetTop;
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            floatingWindow.style.left = (e.clientX - offsetX) + 'px';
            floatingWindow.style.top = (e.clientY - offsetY) + 'px';
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;

    });



    // 业务逻辑

    // 创建按钮容器
    const buttonContainer = document.createElement('div');

    // 定义按钮文本和对应的点击事件处理函数
    const buttonConfigs = {
        '关闭自动自动优化': function () {
            setup1()
            // 这里可以添加具体的业务逻辑
        },
        '点击搜索组件': function () {
            setup2()
            // 这里可以添加具体的业务逻辑
        },
        '修改创意名称': function () {
            try {
                setup3()
            } catch (error) {
                console.log(error);

            }

            // 这里可以添加具体的业务逻辑
        },
        '添加监测链接': function () {
          // 执行主函数
    main().catch(error => console.error('执行过程中出现错误:', error));//  console.log('触发了添加监测链接操作');
            // 这里可以添加具体的业务逻辑
        }
    };

    // 遍历按钮配置对象，创建按钮并绑定事件
    for (const [buttonText, clickHandler] of Object.entries(buttonConfigs)) {
        const button = document.createElement('button');
        button.textContent = buttonText;
        button.addEventListener('click', clickHandler);
        buttonContainer.appendChild(button);
    }



    // 创建输入框和多行文本框的容器
    const inputContainer = document.createElement('div');

    // 输入框和提示信息配置
    const inputConfigs = [
        { label: '基础创意名称', id: 'base-creative-name', type: 'text' },
        { label: '曝光链接', id: 'exposure-link', type: 'text' },
        { label: '点击链接', id: 'click-link', type: 'text' }
    ];

    // 创建输入框
    inputConfigs.forEach(config => {
        const inputGroup = document.createElement('div');
        inputGroup.classList.add('input-group');

        const label = document.createElement('label');
        label.textContent = config.label;
        label.setAttribute('for', config.id);

        const input = document.createElement('input');
        input.setAttribute('type', config.type);
        input.setAttribute('id', config.id);

        inputGroup.appendChild(label);
        inputGroup.appendChild(input);
        inputContainer.appendChild(inputGroup);
    });

    // 创建多行文本框
    const textareaGroup = document.createElement('div');
    textareaGroup.classList.add('input-group');

    const textareaLabel = document.createElement('label');
    textareaLabel.textContent = '笔记匹配信息';
    textareaLabel.setAttribute('for', 'note-matching-info');

    const textarea = document.createElement('textarea');
    textarea.setAttribute('id', 'note-matching-info');
    textarea.setAttribute('rows', '5');

    textareaGroup.appendChild(textareaLabel);
    textareaGroup.appendChild(textarea);
    inputContainer.appendChild(textareaGroup);




    function setup1() {
        const es = document.querySelectorAll('.flexible.align-center')
        for (let index = 0; index < es.length; index++) {
            const element = es[index];
            if(element.innerText == "关闭"){
                element.click()
            }
        }

    }

    function setup2() {
        const es = document.querySelectorAll('.d-grid.d-radio.d-radio-main-label.d-clickable')
        for (let index = 0; index < es.length; index++) {
            const element = es[index];
            if(element.innerText == "搜索组件"){
                element.click()
            }
        }
    }
    // setup2()




    function setup3(){
    // 改名
    // 基础命名
    const baseName = document.querySelector('#base-creative-name').value//"【达人昵称】-运动户外-全端-【koc-高级定向】-场景";

    // 示例的字符串，这里假设是从外部传入的，你可以根据实际情况修改 场景是0 小红书编号是1
    // const str = `
    // 一个人过节	679498a30000000018004638
    // 送礼	679473f90000000029016f15
    // 赴约	67933d28000000002903db39
    // 赴约	67949ead000000002901221b
    // 一个人过节	67947dad000000001703b0e5
    // 送礼	67934d410000000018008e5c
    // 送礼	679477be0000000029019742
    // 多元尝鲜派	67938fe4000000002503de91
    // 品质进阶派	67933bbe000000002602e53a
    // `;
    const str = document.querySelector('#note-matching-info').value
    // 切割成二维数组
    const noteInfo = str.trim().split('\n').map(item => item.trim().split('	'));

    // 获取所有 class="item" 的元素
    const a = document.querySelectorAll('.item');

    // 遍历数组 a
    a.forEach(item => {
        // 获取第二个 td 的 innerText 作为场景
        const redBookId = item.querySelectorAll('td')[1].innerText;
        const scene = noteInfo.filter(item => item[1] === redBookId)[0][0]
        // 获取第四个 td 的 innerText 作为达人昵称
        const nickname = item.querySelectorAll('td')[3].innerText;

        // 替换基础命名中的达人昵称和场景
        let newName = baseName.replace('达人昵称', nickname).replace('场景', scene);

        // 找到 placeholder="请输入你的创意名称" 的输入框并赋值
        const input = item.querySelector('input[placeholder="请输入你的创意名称"]');
        if (input) {
            input.value = newName;
            const event = new Event('input');
            input.dispatchEvent(event);
        }
    });
    }



    // 定义 url 数组
    // const url = [
    //    // "https://magellan.alimama.com/mmi/xiaohongshu?e=R0ovU3NWOXZid1JJdjlmODM3OEkrZz09&a1=__ID__&a2=__TS__&a3=__CAMPAIGN_ID__&a4=__UNIT_ID__&a5=__CREATIVITY_ID__&a7=__PLACEMENT__&a8=__ADVERTISER_ID__&a13=__OS__&a15=__REQUESTID__&a18=__ANDROIDID__&a19=__IP__&a20=__UA__&a24=__OAID__&a25=__CAID_MD5__&a32=__CAID__&a35=__CLICK_ID__&a36=__NOTE_ID__&a37=__IMEI__&a38=__IDFA__&a68=__KEYWORD_ID__",
    //    // "https://magellan.alimama.com/mmc/xiaohongshu?e=R0ovU3NWOXZid1JJdjlmODM3OEkrZz09&a1=__ID__&a2=__TS__&a4=__CAMPAIGN_ID__&a5=__UNIT_ID__&a6=__CREATIVITY_ID__&a8=__PLACEMENT__&a9=__ADVERTISER_ID__&a14=__OS__&a16=__REQUESTID__&a20=__ANDROIDID__&a21=__IP__&a22=__UA__&a26=__OAID__&a27=__CAID_MD5__&a36=__CAID__&a39=__CLICK_ID__&a40=__NOTE_ID__&a41=__IMEI__&a42=__IDFA__&a70=__KEYWORD_ID__"
    // ];

    // 等待元素出现的函数
    async function waitForElement(selector, text = null) {
        while (true) {
            const elements = document.querySelectorAll(selector);
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                if (text === null || element.innerText === text) {
                    return element;
                }
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    // 等待多个元素出现的函数
    async function waitForElements(selector, count) {
        while (true) {
            const elements = document.querySelectorAll(selector);
            if (elements.length === count) {
                return elements;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    // 触发 change 事件的函数
    function triggerChangeEvent(element) {
        const event = new Event('input');
        element.dispatchEvent(event);
    }

    async function main() {
        const url = [
            document.querySelector('#exposure-link').value,
            document.querySelector('#click-link').value
        ]
        // setup3()
        // await new Promise(resolve => setTimeout(resolve, 2000));

        // 获取所有 class = link-text 并且 innerText = 添加检测链接 的元素
        const redbookCreate = Array.from(document.querySelectorAll('.link-text')).filter(el => el.innerText === '添加监测链接');

        for (let i = 0; i < redbookCreate.length; i++) {
            const currentElement = redbookCreate[i];
            // 点击循环中的第一个元素
            currentElement.click();

            // 等待 class '.add-action' 且 innerText 为 '添加' 的出现 并且点击 这个有两个都需要点击
            const addButtons = await waitForElements('.add-action', 2);
            addButtons.forEach(button => {
                if (button.innerText === '添加') {
                    button.click();
                }
            });

            // 等待 1 秒
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 等待 placeholder="请输入链接" 的 input 出现 这里面有两个这样的元素
            const inputElements = await waitForElements('input[placeholder="请输入链接"]', 2);
            inputElements[0].value = url[0];
            triggerChangeEvent(inputElements[0]);
            inputElements[1].value = url[1];
            triggerChangeEvent(inputElements[1]);

            // 等待 1 秒
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 点击 btn-content 并且 innerText = 保存
            const saveButton = await waitForElement('.btn-content', '保存');
            saveButton.click();
            await new Promise(resolve => setTimeout(resolve, 1000));

        }
    }

      // 将元素添加到页面
  floatingWindow.appendChild(buttonContainer)
  floatingWindow.appendChild(inputContainer);
  document.body.appendChild(floatingWindow);
  document.body.appendChild(floatingBall);
})();
// ==UserScript==
// @name         咪咕视频快速作业脚本
// @namespace    http://your-namespace.com
// @version      6.0
// @description  包含快速提交及通过判断标题和简介是否包含违禁词
// @author       蓝莓果酱UX
// @match        https://oes-coss.miguvideo.com:1443/oes-csas-web/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.openInTab
// @grant        GM.registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487687/%E5%92%AA%E5%92%95%E8%A7%86%E9%A2%91%E5%BF%AB%E9%80%9F%E4%BD%9C%E4%B8%9A%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/487687/%E5%92%AA%E5%92%95%E8%A7%86%E9%A2%91%E5%BF%AB%E9%80%9F%E4%BD%9C%E4%B8%9A%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==



//20运营 21负面 22 低俗 23 血腥 24资质 25 民族 26 未成年 7影响 6竞品 5图文 4 违禁 3 视听 2 淫秽色情 1政治  MD5 5 单一 6
//谢文东（违规网剧）绣春刀-封禁赵立新 杨钰莹-封禁毛宁 乐火团队-赌博 特警新人类-叶佩雯 达叔-叶德娴 真相-李绮雯 男儿本色-房祖名 九五至尊-谭小环 封神榜-傅艺伟 地狱公使-刘亚仁 旺达寻亲记-奇异博士2 奇葩说第4季—卡姆 2day1夜—房祖名
//吴倩莲-黄秋生  使徒行者-黄翠如


// 发起 GET 请求获取腾讯文档内容
async function getContent(url) {
    return await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function (response) {
                if (response.status === 200) {
                    const responseData = JSON.parse(response.responseText);
                    console.log('GET请求成功:', responseData);
                    resolve(responseData); // 请求成功，将返回的数据传递给resolve
                } else {
                    console.error('GET请求失败:', response.status, response.statusText);
                    reject(new Error('GET请求失败')); // 请求失败，传递错误对象给reject
                }
            },
            onerror: function (error) {
                console.error('发生错误:', error);
                reject(error); // 请求发生错误，传递错误对象给reject
            }
        });
    });
}


(function() {
    'use strict';


    // 检查 localStorage 中是否已经显示过说明书
    if (!localStorage.getItem('shownInstructions')) {
        // 创建模态框及其内容
        var modal = document.createElement('div');
        modal.style.display = 'none';
        modal.style.position = 'fixed';
        modal.style.zIndex = '1';
        modal.style.left = '0';
        modal.style.top = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.overflow = 'auto';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        document.body.appendChild(modal);

        var modalContent = document.createElement('div');
        modalContent.style.backgroundColor = '#fefefe';
        modalContent.style.margin = '10% auto';
        modalContent.style.padding = '20px';
        modalContent.style.border = '1px solid #888';
        modalContent.style.width = '50%';
        modalContent.style.height= 'auto';
        modalContent.style.textAlign = 'center';
        modal.appendChild(modalContent);

        // 创建提示信息和确定按钮
        var message = document.createElement('p');
        message.innerHTML = '请阅读内容，并至少观看150秒钟 <br> <span style="color: red; font-weight: bold;">🪬你是首次使用本脚本 需要仔细阅读并且熟悉每个功能的使用🧸</span><br><br> <span style="color: black; font-weight: bold; display: block; text-align: left;">🫐功能点包括快速模式、连发模式、自动抢量模式、自定义快捷键模式、快速搜索台账模式，具体如下👇👇👇<br><br> 快速模式：指可以直接按快捷键提交通过不需要二次空格确定（有一定风险）<br><br> 连发模式：该模式需要配合通道名称配合使用达到可以利用通过快捷键连续不中断的审核减去中间抢量的时间（适合机审通道）<br><br> 自动抢量模式：此模式适用于没有量的情况下开启，在开启后可以自己后台抢数据，无需人工手动抢（触发键位为x）<br><br>数据量查询模式：此模式在头像点亮的情况下可以查询当天白中的数据量情况，在点击头像灰色的情况下可以查询夜班的数据量情况<br><br>设置模式：设置模式里可以简便的自定义自己喜欢的快捷键以及各种细节的功能开启和使用<br><br>其余功能说明：按.可以隐藏或显示面板、按`可以显示查看按键说明、刷新按钮则可以直接更新当前审核的数据量显示<br><br>历史记录：此模式可以记录你历史的数据ID 的通过或者驳回，方便查询和回查 避免出现找不到的情况出现<br><br>标题回查：该模式在于可以显示历史数据的标题和ID 也可以直接搜索框里输入你想搜索的标题查看直接是否上过方便修改<br><br>自检模式：自检模式可以检查每天是否有标题、内容上的关键词错误，可以进行质检<br><br></span><span style="color: red; font-weight: bold; text-align: center">此次更新的版本中取消了所有的按键操作均改为了面板点击操做，请仔细阅读并且理解到位，并等待倒计时结束<br><br></span>';
        modalContent.appendChild(message);


        var confirmBtn = document.createElement('button');

        // 设置按钮样式
        confirmBtn.style.color = 'white'; // 文字颜色
        confirmBtn.style.padding = '10px 20px'; // 内边距
        confirmBtn.style.border = 'none'; // 去除边框
        confirmBtn.style.borderRadius = '4px'; // 圆角
        confirmBtn.style.cursor = 'pointer'; // 鼠标样式为手型
        confirmBtn.innerText = '确定';

        modalContent.appendChild(confirmBtn);

        // 设置倒计时时间（单位：秒）
        var countdownTime = 150;
        var countdownMessage = document.createElement('p');
        countdownMessage.style.textAlign = 'center'; // 居中显示
        modalContent.appendChild(countdownMessage);

        var countdownInterval;
        var intervalId;

        function startCountdown() {
            countdownInterval = setInterval(function() {
                countdownTime--;
                countdownMessage.innerText = '剩余时间：' + countdownTime + '秒';

                if (countdownTime <= 0) {
                    clearInterval(countdownInterval);
                    clearInterval(intervalId);
                    countdownMessage.style.display = 'none';
                    confirmBtn.innerText = '我已知晓并确定';
                    // 将确定按钮设置为绿色
                    confirmBtn.style.backgroundColor = '#4CAF50';
                    confirmBtn.disabled = false;
                } else if (countdownTime >= 0) {
                    // 将确定按钮设置为红色
                    confirmBtn.style.backgroundColor = 'red';
                }
            }, 1000);
        }

        function stopCountdown() {
            clearInterval(countdownInterval);
            clearInterval(intervalId);
        }

        // 监听点击事件
        confirmBtn.addEventListener('click', function () {
            modal.style.display = 'none';
            localStorage.setItem('shownInstructions', true);
        });
        confirmBtn.disabled = true;

        // 强制显示模态框
        setTimeout(function () {
            modal.style.display = 'block';
            intervalId = setTimeout(function() {
                startCountdown();
            }, 0);
        }, 0);

        // 将模态框添加到页面中
        document.body.appendChild(modal);
    }

    // 创建悬浮框
    var draggableDiv = document.createElement('div');
    draggableDiv.id = 'draggable';
    draggableDiv.style.width = '700px';
    draggableDiv.style.height = '92px';
    draggableDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    draggableDiv.style.color = '#fff';
    draggableDiv.style.padding = '10px';
    draggableDiv.style.borderRadius = '5px';
    draggableDiv.style.position = 'fixed';
    draggableDiv.style.left = '560px';
    draggableDiv.style.top = '77px';
    draggableDiv.style.zIndex = '9998';
    draggableDiv.style.cursor = 'move';

    // 注册拖动事件
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    draggableDiv.onmousedown = function(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    };

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        draggableDiv.style.top = (draggableDiv.offsetTop - pos2) + "px";
        draggableDiv.style.left = (draggableDiv.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }

    // 将悬浮框添加到页面
    document.body.appendChild(draggableDiv);

    var toggle = false; // 初始状态为隐藏

    document.addEventListener('keydown', function(e) {
        if (e.key === '.') {
            toggle = !toggle; // 切换显示状态
            draggableDiv.style.display = toggle ? 'block' : 'none'; // 根据toggle变量的值设置display属性
        }
    });

    // 将悬浮框添加到页面
    document.body.appendChild(draggableDiv);

    // 在页面加载完成后执行逻辑
    document.addEventListener("DOMContentLoaded", function() {
        runButtonClickLogic();
    });


    // 在悬浮框内创建一个容器
    var innerDiv = document.createElement('div');
    innerDiv.id = 'innerContainer1'; // 可以根据需要命名后面加数字以避免混淆
    innerDiv.style.width = '250px';
    innerDiv.style.height = '43px';
    innerDiv.style.position = 'absolute';
    innerDiv.style.top = '28px';
    innerDiv.style.left = '5px';

    // 添加文字内容
    var textContent = document.createTextNode('快捷操作提示：默认1：通过。`：查看信息。.：隐藏显示。更多可点控制面板中的设置按钮进行自定义快捷键');
    innerDiv.appendChild(textContent);
    innerDiv.style.fontSize = '14px';
    innerDiv.style.color = 'white';

    // 将内部容器添加到悬浮框
    draggableDiv.appendChild(innerDiv);

    // 在悬浮框内创建第二个容器
    var innerDiv2 = document.createElement('div');
    innerDiv2.id = 'innerContainer2';
    innerDiv2.style.width = '400px';
    innerDiv2.style.height = '21px';
    innerDiv2.style.position = 'absolute';
    innerDiv2.style.top = '90px';
    innerDiv2.style.left = '5px';

    // 添加文字内容
    //innerDiv2.appendChild(textContent2);
    //var textContent2 = document.createTextNode('快速模式：600。');
    innerDiv2.textContent = '数据配额：999。';
    innerDiv2.style.fontSize = '13px';
    innerDiv2.style.color = 'white';
    innerDiv2.id = 'kuaisu'

    // 将第二个内部容器添加到悬浮框
    draggableDiv.appendChild(innerDiv2)


    function updateExecutionCount() {
        // 从localStorage中获取executionCount的值
        var executionCount = localStorage.getItem('executionCount');

        // 如果executionCount存在且不为null
        if (executionCount !== null) {
            // 找到id为'kuaisu'的元素
            var innerDiv2 = document.getElementById('kuaisu');

            // 更新textContent
            innerDiv2.textContent = '数据额度：' + executionCount + '。';
        }
    }

    updateExecutionCount();

    // 在悬浮框内创建第三个容器
    var innerDiv3 = document.createElement('div');
    innerDiv3.id = 'innerContainer3';
    innerDiv3.style.width = '805px';
    innerDiv3.style.height = '28px';
    innerDiv3.style.position = 'absolute';
    innerDiv3.style.top = '5px';
    innerDiv3.style.left = '5px';

    // 添加文字内容
    var textContent3 = document.createTextNode('日审核量：未获取。小时审核量：未获取。');
    innerDiv3.appendChild(textContent3);
    innerDiv3.style.fontSize = '14px';
    innerDiv3.style.color = 'white';

    // 将第三个内部容器添加到悬浮框
    draggableDiv.appendChild(innerDiv3);

    // 在悬浮框内创建第四个容器
    var innerDiv4 = document.createElement('div');
    innerDiv4.id = 'innerContainer4';
    innerDiv4.style.width = '240px';
    innerDiv4.style.height = '30px';
    innerDiv4.style.position = 'absolute';
    innerDiv4.style.top = '80px';
    innerDiv4.style.right = '270px';
    //innerDiv4.style.border = '1px solid #ffffff'; // #ffffff 表示白色

    // 将第四个内部容器添加到悬浮框
    draggableDiv.appendChild(innerDiv4);

    // Create input element
    var searchInput = document.createElement('input');
    searchInput.setAttribute('type', 'text');
    searchInput.setAttribute('id', 'searchInput');
    searchInput.style.marginRight = '1px';
    searchInput.style.padding = '5px';
    searchInput.style.borderRadius = '5px';
    searchInput.style.border = 'none';
    searchInput.style.outline = 'none';
    searchInput.placeholder = '输入要查询的人物姓名...';

    searchInput.onmousedown = function(e) {
        e.stopPropagation();
    };

    // Create search button
    var searchButton = document.createElement('button');
    searchButton.textContent = '搜索';
    searchButton.style.padding = '5px 5px';
    searchButton.style.borderRadius = '5px';
    searchButton.style.border = 'none';
    searchButton.style.background = '#007bff';
    searchButton.style.color = '#fff';
    searchButton.style.cursor = 'pointer';
    searchButton.style.marginLeft = '5px';

    // Add input and button to the floating div
    innerDiv4.appendChild(searchInput);
    innerDiv4.appendChild(searchButton);


    // 在悬浮框内创建第五个容器
    var innerDiv5 = document.createElement('div');
    innerDiv5.id = 'innerContainer5';
    innerDiv5.style.width = '270px';
    innerDiv5.style.height = '30px';
    innerDiv5.style.position = 'absolute';
    innerDiv5.style.top = '80px';
    innerDiv5.style.right = '0px';
    //innerDiv5.style.border = '1px solid #ffffff'; // #ffffff 表示白色

    // 将第五个内部容器添加到悬浮框
    draggableDiv.appendChild(innerDiv5);

    // Create input element
    var searchInputCopy = document.createElement('input');
    searchInputCopy.setAttribute('type', 'text');
    searchInputCopy.setAttribute('id', 'searchInputCopy');
    searchInputCopy.style.marginRight = '10px';
    searchInputCopy.style.padding = '5px';
    searchInputCopy.style.borderRadius = '5px';
    searchInputCopy.style.border = 'none';
    searchInputCopy.style.outline = 'none';
    searchInputCopy.placeholder = '输入要查询的敏感词...';

    searchInputCopy.onmousedown = function(e) {
        e.stopPropagation();
    };

    // Create search button
    var searchButtonCopy = document.createElement('button');
    searchButtonCopy.textContent = '搜索';
    searchButtonCopy.style.padding = '5px 5px';
    searchButtonCopy.style.borderRadius = '5px';
    searchButtonCopy.style.border = 'none';
    searchButtonCopy.style.background = '#007bff';
    searchButtonCopy.style.color = '#fff';
    searchButtonCopy.style.cursor = 'pointer';

    // Add input and button to the floating div
    innerDiv5.appendChild(searchInputCopy);
    innerDiv5.appendChild(searchButtonCopy);

    // 在悬浮框内创建第六个容器
    var innerDiv6 = document.createElement('div');
    innerDiv6.id = 'innerContainer6';
    innerDiv6.style.width = '30px';
    innerDiv6.style.height = '30px';
    innerDiv6.style.position = 'absolute';
    innerDiv6.style.top = '0px';
    innerDiv6.style.right = '0';
    innerDiv6.style.border = '3px solid #ffffff'; // #ffffff 表示白色

    var yebanmod = false; // 默认为false

    innerDiv6.addEventListener('click', function() {
        // 获取图片元素
        var clickedImage = document.getElementById('innerContainer6').getElementsByTagName('img')[0];

        if (yebanmod) {
            // 如果yebanmod为true，表示当前为灰色状态，则恢复正常
            clickedImage.style.filter = 'none'; // 恢复图片颜色
            yebanmod = false; // 将yebanmod的值设为false
        } else {
            // 如果yebanmod为false，表示当前为正常状态，则变成灰色
            clickedImage.style.filter = 'grayscale(100%)'; // 将图片颜色变成灰色
            yebanmod = true; // 将yebanmod的值设为true
        }

        // 将状态保存在本地
        localStorage.setItem('yebanmod', yebanmod);
    });


    // 将第六个内部容器添加到悬浮框
    draggableDiv.appendChild(innerDiv6);

    // 假设你有一个图片链接
    var imageUrl = 'http://q.qlogo.cn/headimg_dl?dst_uin=2579949378&spec=640&img_type=jpg'; // 这里是图片的链接，你需要替换成你实际的图片链接

    // 创建一个图片元素
    var imageElement = document.createElement('img');
    imageElement.src = imageUrl; // 将图片链接赋给图片元素的src属性
    imageElement.style.maxWidth = '100%';
    imageElement.style.maxHeight = '100%';

    // 将图片元素添加到第六个容器中
    document.getElementById('innerContainer6').appendChild(imageElement);

    // 在页面加载时，检查本地存储中是否存在yebanmod的值
    var storedYebanmod = localStorage.getItem('yebanmod');
    if (storedYebanmod === 'true') {
        // 如果存在，将yebanmod的值设为true
        yebanmod = true;

        // 获取图片元素
        var storedImage = document.getElementById('innerContainer6').getElementsByTagName('img')[0];

        // 修改图片样式
        storedImage.style.filter = 'grayscale(100%)'; // 将图片颜色变成灰色
    }

    // 在悬浮框内创建第六个容器
    var innerDiv7 = document.createElement('div');
    innerDiv7.id = 'innerContainer7';
    innerDiv7.style.width = '37px';
    innerDiv7.style.height = '22px';
    innerDiv7.style.position = 'absolute';
    innerDiv7.style.top = '55px';
    innerDiv7.style.right = '10px';

    // 将第六个内部容器添加到悬浮框
    draggableDiv.appendChild(innerDiv7);

    // 在第六个内部容器中创建一个圆角矩形按钮
    var buttonye = document.createElement('button');
    buttonye.style.width = '100%';
    buttonye.style.height = '100%';
    buttonye.style.backgroundColor = '#ff0000'; // 红色背景
    buttonye.style.color = '#ffffff'; // 白色字体
    buttonye.style.fontSize = '13px'; // 14号字体
    buttonye.style.borderRadius = '5px'; // 圆角矩形
    buttonye.textContent = '夜班'; // 按钮文本内容

    // 将按钮添加到第7个内部容器
    // innerDiv7.appendChild(buttonye);


    // 在悬浮框内创建第六个容器
    var innerDiv8 = document.createElement('div');
    innerDiv8.id = 'innerContainer8';
    innerDiv8.style.width = '60px';
    innerDiv8.style.height = '22px';
    innerDiv8.style.position = 'absolute';
    innerDiv8.style.top = '55px';
    innerDiv8.style.right = '90px';

    // 将第六个内部容器添加到悬浮框
    draggableDiv.appendChild(innerDiv8);



    // 在第六个内部容器中创建一个圆角矩形按钮
    var buttonbai1 = document.createElement('button');
    buttonbai1.style.width = '100%';
    buttonbai1.style.height = '100%';
    buttonbai1.style.backgroundColor = '#ed213a';
    buttonbai1.style.color = '#ffffff'; // 白色字体
    buttonbai1.style.fontSize = '13px'; // 14号字体
    buttonbai1.style.borderRadius = '5px'; // 圆角矩形
    buttonbai1.textContent = '总人量'; // 按钮文本内容

    // 将按钮添加到第8个内部容器
    innerDiv8.appendChild(buttonbai1);


    // 在悬浮框内创建第六个容器
    var innerDiv9 = document.createElement('div');
    innerDiv9.id = 'innerContainer9';
    innerDiv9.style.width = '37px';
    innerDiv9.style.height = '22px';
    innerDiv9.style.position = 'absolute';
    innerDiv9.style.top = '55px';
    innerDiv9.style.right = '152px';

    // 将第9个内部容器添加到悬浮框
    draggableDiv.appendChild(innerDiv9);

    // 在第六个内部容器中创建一个圆角矩形按钮
    var buttoncha = document.createElement('button');
    buttoncha.style.width = '100%';
    buttoncha.style.height = '100%';
    buttoncha.style.backgroundColor = '#007bff'; // 红色背景
    buttoncha.style.color = '#ffffff'; // 白色字体
    buttoncha.style.fontSize = '13px'; // 14号字体
    buttoncha.style.borderRadius = '5px'; // 圆角矩形
    buttoncha.textContent = '自检'; // 按钮文本内容

    // 将按钮添加到第9个内部容器
    innerDiv9.appendChild(buttoncha);


    // 在悬浮框内创建第10个容器
    var innerDiv10 = document.createElement('div');
    innerDiv10.id = 'innerContainer10';
    innerDiv10.style.width = '270px';
    innerDiv10.style.height = '20px';
    innerDiv10.style.position = 'absolute';
    innerDiv10.style.top = '26px';
    innerDiv10.style.right = '190px';


    // 将第五个内部容器添加到悬浮框
    draggableDiv.appendChild(innerDiv10);

    // Create input element
    var searchInputCopys = document.createElement('input');
    searchInputCopys.setAttribute('type', 'text');
    searchInputCopys.setAttribute('id', 'searchInputCopys');
    searchInputCopys.style.marginRight = '10px';
    searchInputCopys.style.padding = '5px';
    searchInputCopys.style.borderRadius = '5px';
    searchInputCopys.style.border = 'none';
    searchInputCopys.style.outline = 'none';
    searchInputCopys.placeholder = '输入要查询的标题或者ID...';

    searchInputCopys.onmousedown = function(e) {
        e.stopPropagation();
    };

    // Create search button
    var searchButtonCopys = document.createElement('button');
    searchButtonCopys.textContent = '标题回查';
    searchButtonCopys.style.padding = '5px 10px';
    searchButtonCopys.style.borderRadius = '5px';
    searchButtonCopys.style.border = 'none';
    searchButtonCopys.style.background = '#007bff';
    searchButtonCopys.style.color = '#fff';
    searchButtonCopys.style.cursor = 'pointer';

    // Add input and button to the floating div
    innerDiv10.appendChild(searchInputCopys);
    innerDiv10.appendChild(searchButtonCopys);

    // 在悬浮框内创建第11个容器
    var innerDiv11 = document.createElement('div');
    innerDiv11.id = 'innerDiv11';
    innerDiv11.style.width = '300px';
    innerDiv11.style.height = '20px';
    innerDiv11.style.position = 'absolute';
    innerDiv11.style.top = '26px';
    innerDiv11.style.right = '-110px';

    draggableDiv.appendChild(innerDiv11);

    // Create search button
    var searchButtonCopya = document.createElement('button');
    searchButtonCopya.textContent = '历史记录';
    searchButtonCopya.style.padding = '5px 5px';
    searchButtonCopya.style.borderRadius = '5px';
    searchButtonCopya.style.border = 'none';
    searchButtonCopya.style.background = '#28a745';
    searchButtonCopya.style.color = '#fff';
    searchButtonCopya.style.cursor = 'pointer';

    // Add input and button to the floating div
    innerDiv11.appendChild(searchButtonCopya);

    // 在悬浮框内创建第六个容器
    var innerDiv12 = document.createElement('div');
    innerDiv12.id = 'innerDiv12';
    innerDiv12.style.width = '60px';
    innerDiv12.style.height = '22px';
    innerDiv12.style.position = 'absolute';
    innerDiv12.style.top = '55px';
    innerDiv12.style.right = '400px';

    draggableDiv.appendChild(innerDiv12);

    // 在第六个内部容器中创建一个圆角矩形按钮
    var buttonkuai = document.createElement('button');
    buttonkuai.style.width = '100%';
    buttonkuai.style.height = '100%';
    buttonkuai.style.backgroundColor = '#28a745'; // 红色背景
    buttonkuai.style.color = '#ffffff'; // 白色字体
    buttonkuai.style.fontSize = '13px'; // 14号字体
    buttonkuai.style.borderRadius = '5px'; // 圆角矩形
    buttonkuai.textContent = '快速模式'; // 按钮文本内容

    // 将按钮添加到第9个内部容器
    innerDiv12.appendChild(buttonkuai);

    // 在悬浮框内创建第六个容器
    var innerDiv13 = document.createElement('div');
    innerDiv13.id = 'innerDiv13';
    innerDiv13.style.width = '60px';
    innerDiv13.style.height = '22px';
    innerDiv13.style.position = 'absolute';
    innerDiv13.style.top = '55px';
    innerDiv13.style.right = '335px';

    // draggableDiv.appendChild(innerDiv13);

    // 在第六个内部容器中创建一个圆角矩形按钮
    var buttonjiewei = document.createElement('button');
    buttonjiewei.style.width = '100%';
    buttonjiewei.style.height = '100%';
    buttonjiewei.style.backgroundColor = '#28a745'; // 红色背景
    buttonjiewei.style.color = '#ffffff'; // 白色字体
    buttonjiewei.style.fontSize = '13px'; // 14号字体
    buttonjiewei.style.borderRadius = '5px'; // 圆角矩形
    buttonjiewei.textContent = '直接结尾'; // 按钮文本内容


    // 将按钮添加到第9个内部容器
    // innerDiv13.appendChild(buttonjiewei);

    // 在悬浮框内创建第六个容器
    var innerDiv14 = document.createElement('div');
    innerDiv14.id = 'innerDiv14';
    innerDiv14.style.width = '30px';
    innerDiv14.style.height = '22px';
    innerDiv14.style.position = 'absolute';
    innerDiv14.style.top = '3px';
    innerDiv14.style.right = '40px';

    draggableDiv.appendChild(innerDiv14);

    // 在第六个内部容器中创建一个圆角矩形按钮
    var buttonshuaxin = document.createElement('button');
    buttonshuaxin.style.width = '100%';
    buttonshuaxin.style.height = '100%';
    buttonshuaxin.style.backgroundColor = '#ffffff'; // 白色背景
    buttonshuaxin.style.color = '#000000'; // 白色字体
    buttonshuaxin.style.fontSize = '13px'; // 14号字体
    buttonshuaxin.style.borderRadius = '5px'; // 圆角矩形
    buttonshuaxin.textContent = '刷新'; // 按钮文本内容

    // 将按钮添加到第9个内部容器
    innerDiv14.appendChild(buttonshuaxin);


    // 在悬浮框内创建第六个容器
    var innerDiv15 = document.createElement('div');
    innerDiv15.id = 'innerDiv15';
    innerDiv15.style.width = '60px';
    innerDiv15.style.height = '22px';
    innerDiv15.style.position = 'absolute';
    innerDiv15.style.top = '55px';
    innerDiv15.style.right = '336px';

    draggableDiv.appendChild(innerDiv15);

    // 在第六个内部容器中创建一个圆角矩形按钮
    var buttonlianfa = document.createElement('button');
    buttonlianfa.style.width = '100%';
    buttonlianfa.style.height = '100%';
    buttonlianfa.style.backgroundColor = '#28a745'; // 红色背景
    buttonlianfa.style.color = '#ffffff'; // 白色字体
    buttonlianfa.style.fontSize = '13px'; // 14号字体
    buttonlianfa.style.borderRadius = '5px'; // 圆角矩形
    buttonlianfa.textContent = '连发模式'; // 按钮文本内容

    // 将按钮添加到第9个内部容器
    innerDiv15.appendChild(buttonlianfa);

    // 在悬浮框内创建第六个容器
    var innerDiv16 = document.createElement('div');
    innerDiv16.id = 'innerDiv16';
    innerDiv16.style.width = '37px';
    innerDiv16.style.height = '22px';
    innerDiv16.style.position = 'absolute';
    innerDiv16.style.top = '55px';
    innerDiv16.style.right = '47px';

    draggableDiv.appendChild(innerDiv16);

    // 在第六个内部容器中创建一个圆角矩形按钮
    var buttonfuhe = document.createElement('button');
    buttonfuhe.style.width = '100%';
    buttonfuhe.style.height = '100%';
    buttonfuhe.style.backgroundColor = '#8A2BE2'; // 红色背景
    buttonfuhe.style.color = '#ffffff'; // 白色字体
    buttonfuhe.style.fontSize = '13px'; // 14号字体
    buttonfuhe.style.borderRadius = '5px'; // 圆角矩形
    buttonfuhe.textContent = '复核'; // 按钮文本内容

    // 将按钮添加到第9个内部容器
    innerDiv16.appendChild(buttonfuhe);

    // 在悬浮框内创建第六个容器
    var innerDiv18 = document.createElement('div');
    innerDiv18.id = 'innerDiv18';
    innerDiv18.style.width = '37px';
    innerDiv18.style.height = '22px';
    innerDiv18.style.position = 'absolute';
    innerDiv18.style.top = '55px';
    innerDiv18.style.right = '3px';

    draggableDiv.appendChild(innerDiv18);

    // 在第六个内部容器中创建一个圆角矩形按钮
    var buttonkuaijie = document.createElement('button');
    buttonkuaijie.style.width = '100%';
    buttonkuaijie.style.height = '100%';
    buttonkuaijie.style.backgroundColor = '#8A2BE2'; // 红色背景
    buttonkuaijie.style.color = '#ffffff'; // 白色字体
    buttonkuaijie.style.fontSize = '13px'; // 14号字体
    buttonkuaijie.style.borderRadius = '5px'; // 圆角矩形
    buttonkuaijie.textContent = '设置'; // 按钮文本内容


    // 将按钮添加到第9个内部容器
    innerDiv18.appendChild(buttonkuaijie);

    // 在悬浮框内创建第六个容器
    var innerDiv45 = document.createElement('div');
    innerDiv45.id = 'innerDiv45';
    innerDiv45.style.width = '60px';
    innerDiv45.style.height = '22px';
    innerDiv45.style.position = 'absolute';
    innerDiv45.style.top = '55px';
    innerDiv45.style.right = '238px';

    draggableDiv.appendChild(innerDiv45);

    // 在第六个内部容器中创建一个圆角矩形按钮
    var buttonqiangliang = document.createElement('button');
    buttonqiangliang.style.width = '100%';
    buttonqiangliang.style.height = '100%';
    buttonqiangliang.style.backgroundColor = '#28a745'; // 红色背景
    buttonqiangliang.style.color = '#ffffff'; // 白色字体
    buttonqiangliang.style.fontSize = '13px'; // 14号字体
    buttonqiangliang.style.borderRadius = '5px'; // 圆角矩形
    buttonqiangliang.textContent = '自动抢量'; // 按钮文本内容


    // 将按钮添加到第9个内部容器
    innerDiv45.appendChild(buttonqiangliang);

    let qiangliang = false;

    buttonqiangliang.addEventListener('click', function() {
        qiangliang = !qiangliang

        if (qiangliang) {
            // 如果kuaisums为true，改变按钮的样式为红色
            buttonqiangliang.style.backgroundColor = '#ff0000'; // 红色背景
        } else {
            // 如果kuaisums为false，恢复按钮的原始样式
            buttonqiangliang.style.backgroundColor = '#28a745'; // 绿色背景
        }
    });


    // 在悬浮框内创建第六个容器
    var innerDiv46 = document.createElement('div');
    innerDiv46.id = 'innerDiv46';
    innerDiv46.style.width = '30px';
    innerDiv46.style.height = '18px';
    innerDiv46.style.position = 'absolute';
    innerDiv46.style.top = '36px';
    innerDiv46.style.right = '5px';

    draggableDiv.appendChild(innerDiv46);


    // 在第六个内部容器中创建一个圆角矩形按钮
    var buttonewai = document.createElement('button');
    buttonewai.style.width = '100%';
    buttonewai.style.height = '100%';
    buttonewai.style.backgroundColor = '#ff0000'; // 红色背景
    buttonewai.style.color = '#ffffff'; // 白色字体
    buttonewai.style.borderRadius = '5px'; // 圆角矩形
    buttonewai.style.fontSize = '9px'; // 14号字体
    buttonewai.textContent = '切换'; // 按钮文本内容



    innerDiv46.appendChild(buttonewai);

    // 在页面左侧创建一个新容器
    var leftContainer02 = document.createElement('div');
    leftContainer02.id = 'leftContainer02';
    leftContainer02.style.position = 'fixed';
    leftContainer02.style.left = '560px';
    leftContainer02.style.top = '200px';
    leftContainer02.style.overflowY = 'auto';
    leftContainer02.style.zIndex = '9999';
    leftContainer02.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    leftContainer02.style.color = '#fff';
    leftContainer02.style.fontSize = '16px';
    leftContainer02.style.color = 'white';
    leftContainer02.style.display = 'none';
    leftContainer02.style.padding= '10px';
    document.body.appendChild(leftContainer02);

    // 让浮动页面可拖动
    var isDraggingaa = false;
    var startPosXaa, startPosYaa;

    leftContainer02.addEventListener('mousedown', function(e) {
        isDraggingaa = true;
        startPosXaa = e.clientX - leftContainer02.offsetLeft;
        startPosYaa = e.clientY - leftContainer02.offsetTop;
    });

    document.addEventListener('mousemove', function(e) {
        if (isDraggingaa) {
            leftContainer02.style.left = e.clientX - startPosXaa + 'px';
            leftContainer02.style.top = e.clientY - startPosYaa + 'px';
        }
    });

    document.addEventListener('mouseup', function() {
        isDraggingaa = false;
    });


    var isFloatingPageVisible02 = false;

    buttonkuaijie.addEventListener('click', function() {
        // 切换界面的显示状态
        if (isFloatingPageVisible02) {
            leftContainer02.style.display = 'none';
            isFloatingPageVisible02 = false;
        } else {
            leftContainer02.style.display = 'block';
            isFloatingPageVisible02 = true;
        }
    });


    // 将容器的宽度和高度改为750px x 500px
    leftContainer02.style.width = '750px';
    leftContainer02.style.height = '500px';

    // 如果数据超过了高度就出现下拉框
    leftContainer02.style.overflowY = 'auto';
    leftContainer02.style.overflowX = 'auto';

    // 在悬浮框内创建第五个容器
    var innerDiv19 = document.createElement('div');
    innerDiv19.id = 'innerDiv19';
    innerDiv19.style.width = '80px';
    innerDiv19.style.height = '80px';
    innerDiv19.style.position = 'absolute';
    innerDiv19.style.top = '5px';
    innerDiv19.style.left = '5px';
    innerDiv19.style.border = '1px solid #ffffff'; // #ffffff 表示白色

    // 将第五个内部容器添加到悬浮框
    leftContainer02.appendChild(innerDiv19);


    var textSpan = document.createElement('span');
    textSpan.textContent = '低危';
    textSpan.style.position = 'absolute';
    textSpan.style.top = '5px';
    textSpan.style.left = '10px';
    textSpan.style.color = '#ffffff'; // 白色字体
    textSpan.style.fontSize = '13px'; // 14号字体
    textSpan.style.left = '50%';
    textSpan.style.transform = 'translateX(-50%)';
    innerDiv19.appendChild(textSpan);

    var dataSpan = document.createElement('span');
    dataSpan.textContent = '当前为【q】';
    dataSpan.id = 'q';
    dataSpan.style.position = 'absolute';
    dataSpan.style.top = '20px';
    dataSpan.style.left = '10px';
    dataSpan.style.color = '#ffffff'; // 白色字体
    dataSpan.style.fontSize = '13px'; // 14号字体
    dataSpan.style.left = '50%';
    dataSpan.style.transform = 'translateX(-50%)';
    innerDiv19.appendChild(dataSpan);

    var queryBtn = document.createElement('button');
    queryBtn.textContent = '修改';
    queryBtn.style.position = 'absolute';
    queryBtn.style.top = '55px';
    queryBtn.style.left = '10px';
    queryBtn.style.left = '50%';
    queryBtn.style.transform = 'translateX(-50%)';
    innerDiv19.appendChild(queryBtn);

    // 给修改按钮添加点击事件
    queryBtn.addEventListener('click', function() {
        // 读取当前 localStorage 中的按键值
        var currentKey = getStoredKeydiwei();

        // 弹出输入框，要求用户输入新的按键值
        var newKey = prompt('请输入新的按键', currentKey);

        // 验证输入值是否为空或非法
        if (newKey !== null && newKey.trim() !== '') {
            // 更新 localStorage 中的按键值
            setStoredKeydiwei(newKey);
            alert('低危通道抢量按键已更新为: ' + newKey);
        } else {
            alert('请输入有效的按键值');
        }
    });


    // 在悬浮框内创建第五个容器
    var innerDiv20 = document.createElement('div');
    innerDiv20.id = 'innerDiv20';
    innerDiv20.style.width = '80px';
    innerDiv20.style.height = '80px';
    innerDiv20.style.position = 'absolute';
    innerDiv20.style.top = '5px';
    innerDiv20.style.left = '100px';
    innerDiv20.style.border = '1px solid #ffffff'; // #ffffff 表示白色

    // 将第五个内部容器添加到悬浮框
    leftContainer02.appendChild(innerDiv20);


    var textSpan01 = document.createElement('span');
    textSpan01.textContent = '高危';
    textSpan01.style.position = 'absolute';
    textSpan01.style.top = '5px';
    textSpan01.style.left = '10px';
    textSpan01.style.color = '#ffffff'; // 白色字体
    textSpan01.style.fontSize = '13px'; // 14号字体
    textSpan01.style.left = '50%';
    textSpan01.style.transform = 'translateX(-50%)';
    innerDiv20.appendChild(textSpan01);

    var dataSpan01 = document.createElement('span');
    dataSpan01.textContent = '当前为【w】';
    dataSpan01.id = 'w';
    dataSpan01.style.position = 'absolute';
    dataSpan01.style.top = '20px';
    dataSpan01.style.left = '10px';
    dataSpan01.style.color = '#ffffff'; // 白色字体
    dataSpan01.style.fontSize = '13px'; // 14号字体
    dataSpan01.style.left = '50%';
    dataSpan01.style.transform = 'translateX(-50%)';
    innerDiv20.appendChild(dataSpan01);

    var queryBtn01 = document.createElement('button');
    queryBtn01.textContent = '修改';
    queryBtn01.style.position = 'absolute';
    queryBtn01.style.top = '55px';
    queryBtn01.style.left = '10px';
    queryBtn01.style.left = '50%';
    queryBtn01.style.transform = 'translateX(-50%)';
    innerDiv20.appendChild(queryBtn01);

    // 给修改按钮添加点击事件
    queryBtn01.addEventListener('click', function() {
        // 读取当前 localStorage 中的按键值
        var currentKey01 = getStoredKeygaowei();

        // 弹出输入框，要求用户输入新的按键值
        var newKey01 = prompt('请输入新的按键', currentKey01);

        // 验证输入值是否为空或非法
        if (newKey01 !== null && newKey01.trim() !== '') {
            // 更新 localStorage 中的按键值
            setStoredKeygaowei(newKey01);
            alert('高危通道抢量按键已更新为: ' + newKey01);
        } else {
            alert('请输入有效的按键值');
        }
    });

    // 在悬浮框内创建第五个容器
    var innerDiv21 = document.createElement('div');
    innerDiv21.id = 'innerDiv21';
    innerDiv21.style.width = '80px';
    innerDiv21.style.height = '80px';
    innerDiv21.style.position = 'absolute';
    innerDiv21.style.top = '5px';
    innerDiv21.style.left = '200px';
    innerDiv21.style.border = '1px solid #ffffff'; // #ffffff 表示白色

    // 将第五个内部容器添加到悬浮框
    leftContainer02.appendChild(innerDiv21);


    var textSpan02= document.createElement('span');
    textSpan02.textContent = '人机'
    textSpan02.style.position = 'absolute';
    textSpan02.style.top = '5px';
    textSpan02.style.left = '10px';
    textSpan02.style.color = '#ffffff'; // 白色字体
    textSpan02.style.fontSize = '13px'; // 14号字体
    textSpan02.style.left = '50%';
    textSpan02.style.transform = 'translateX(-50%)';
    innerDiv21.appendChild(textSpan02);

    var dataSpan02= document.createElement('span');
    dataSpan02.textContent = '当前为【e】';
    dataSpan02.id = 'e';
    dataSpan02.style.position = 'absolute';
    dataSpan02.style.top = '20px';
    dataSpan02.style.left = '10px';
    dataSpan02.style.color = '#ffffff'; // 白色字体
    dataSpan02.style.fontSize = '13px'; // 14号字体
    dataSpan02.style.left = '50%';
    dataSpan02.style.transform = 'translateX(-50%)';
    innerDiv21.appendChild(dataSpan02);

    var queryBtn02 = document.createElement('button');
    queryBtn02.textContent = '修改';
    queryBtn02.style.position = 'absolute';
    queryBtn02.style.top = '55px';
    queryBtn02.style.left = '10px';
    queryBtn02.style.left = '50%';
    queryBtn02.style.transform = 'translateX(-50%)';
    innerDiv21.appendChild(queryBtn02);

    // 给修改按钮添加点击事件
    queryBtn02.addEventListener('click', function() {
        // 读取当前 localStorage 中的按键值
        var currentKey02 = getStoredKeyrenji();

        // 弹出输入框，要求用户输入新的按键值
        var newKey02 = prompt('请输入新的按键', currentKey02);

        // 验证输入值是否为空或非法
        if (newKey02 !== null && newKey02.trim() !== '') {
            // 更新 localStorage 中的按键值
            setStoredKeyrenji(newKey02);
            alert('人机通道抢量按键已更新为: ' + newKey02);
        } else {
            alert('请输入有效的按键值');
        }
    });

    // 在悬浮框内创建第五个容器
    var innerDiv22 = document.createElement('div');
    innerDiv22.id = 'innerDiv22';
    innerDiv22.style.width = '80px';
    innerDiv22.style.height = '80px';
    innerDiv22.style.position = 'absolute';
    innerDiv22.style.top = '5px';
    innerDiv22.style.left = '300px';
    innerDiv22.style.border = '1px solid #ffffff'; // #ffffff 表示白色

    // 将第五个内部容器添加到悬浮框
    leftContainer02.appendChild(innerDiv22);


    var textSpan03= document.createElement('span');
    textSpan03.textContent = '无条件'
    textSpan03.style.position = 'absolute';
    textSpan03.style.top = '5px';
    textSpan03.style.left = '10px';
    textSpan03.style.color = '#ffffff'; // 白色字体
    textSpan03.style.fontSize = '13px'; // 14号字体
    textSpan03.style.left = '50%';
    textSpan03.style.transform = 'translateX(-50%)';
    innerDiv22.appendChild(textSpan03);

    var dataSpan03= document.createElement('span');
    dataSpan03.textContent = '当前为【r】';
    dataSpan03.id = 'r';
    dataSpan03.style.position = 'absolute';
    dataSpan03.style.top = '20px';
    dataSpan03.style.left = '10px';
    dataSpan03.style.color = '#ffffff'; // 白色字体
    dataSpan03.style.fontSize = '13px'; // 14号字体
    dataSpan03.style.left = '50%';
    dataSpan03.style.transform = 'translateX(-50%)';
    innerDiv22.appendChild(dataSpan03);

    var queryBtn03 = document.createElement('button');
    queryBtn03.textContent = '修改';
    queryBtn03.style.position = 'absolute';
    queryBtn03.style.top = '55px';
    queryBtn03.style.left = '10px';
    queryBtn03.style.left = '50%';
    queryBtn03.style.transform = 'translateX(-50%)';
    innerDiv22.appendChild(queryBtn03);

    // 给修改按钮添加点击事件
    queryBtn03.addEventListener('click', function() {
        // 读取当前 localStorage 中的按键值
        var currentKey03 = getStoredKeywutiaojian();

        // 弹出输入框，要求用户输入新的按键值
        var newKey03 = prompt('请输入新的按键', currentKey03);

        // 验证输入值是否为空或非法
        if (newKey03 !== null && newKey03.trim() !== '') {
            // 更新 localStorage 中的按键值
            setStoredKeywutiaojian(newKey03);
            alert('无条件通道抢量按键已更新为: ' + newKey03);
        } else {
            alert('请输入有效的按键值');
        }
    });

    // 在悬浮框内创建第五个容器
    var innerDiv23 = document.createElement('div');
    innerDiv23.id = 'innerDiv23';
    innerDiv23.style.width = '80px';
    innerDiv23.style.height = '80px';
    innerDiv23.style.position = 'absolute';
    innerDiv23.style.top = '5px';
    innerDiv23.style.left = '400px';
    innerDiv23.style.border = '1px solid #ffffff'; // #ffffff 表示白色

    // 将第五个内部容器添加到悬浮框
    leftContainer02.appendChild(innerDiv23);


    var textSpan04= document.createElement('span');
    textSpan04.textContent = '新快审'
    textSpan04.style.position = 'absolute';
    textSpan04.style.top = '5px';
    textSpan04.style.left = '10px';
    textSpan04.style.color = '#ffffff'; // 白色字体
    textSpan04.style.fontSize = '13px'; // 14号字体
    textSpan04.style.left = '50%';
    textSpan04.style.transform = 'translateX(-50%)';
    innerDiv23.appendChild(textSpan04);

    var dataSpan04= document.createElement('span');
    dataSpan04.textContent = '当前为【t】';
    dataSpan04.id = 't';
    dataSpan04.style.position = 'absolute';
    dataSpan04.style.top = '20px';
    dataSpan04.style.left = '10px';
    dataSpan04.style.color = '#ffffff'; // 白色字体
    dataSpan04.style.fontSize = '13px'; // 14号字体
    dataSpan04.style.left = '50%';
    dataSpan04.style.transform = 'translateX(-50%)';
    innerDiv23.appendChild(dataSpan04);

    var queryBtn04 = document.createElement('button');
    queryBtn04.textContent = '修改';
    queryBtn04.style.position = 'absolute';
    queryBtn04.style.top = '55px';
    queryBtn04.style.left = '10px';
    queryBtn04.style.left = '50%';
    queryBtn04.style.transform = 'translateX(-50%)';
    innerDiv23.appendChild(queryBtn04);

    // 给修改按钮添加点击事件
    queryBtn04.addEventListener('click', function() {
        // 读取当前 localStorage 中的按键值
        var currentKey04 = getStoredKeyxinkuaishen();

        // 弹出输入框，要求用户输入新的按键值
        var newKey04 = prompt('请输入新的按键', currentKey04);

        // 验证输入值是否为空或非法
        if (newKey04 !== null && newKey04.trim() !== '') {
            // 更新 localStorage 中的按键值
            setStoredKeyxinkuaishen(newKey04);
            alert('无条件通道抢量按键已更新为: ' + newKey04);
        } else {
            alert('请输入有效的按键值');
        }
    });


    // 在悬浮框内创建第五个容器
    var innerDiv24 = document.createElement('div');
    innerDiv24.id = 'innerDiv24';
    innerDiv24.style.width = '80px';
    innerDiv24.style.height = '80px';
    innerDiv24.style.position = 'absolute';
    innerDiv24.style.top = '5px';
    innerDiv24.style.left = '500px';
    innerDiv24.style.border = '1px solid #ffffff'; // #ffffff 表示白色

    // 将第五个内部容器添加到悬浮框
    leftContainer02.appendChild(innerDiv24);


    var textSpan05= document.createElement('span');
    textSpan05.textContent = '机审'
    textSpan05.style.position = 'absolute';
    textSpan05.style.top = '5px';
    textSpan05.style.left = '10px';
    textSpan05.style.color = '#ffffff'; // 白色字体
    textSpan05.style.fontSize = '13px'; // 14号字体
    textSpan05.style.left = '50%';
    textSpan05.style.transform = 'translateX(-50%)';
    innerDiv24.appendChild(textSpan05);

    var dataSpan05= document.createElement('span');
    dataSpan05.textContent = '当前为【y】';
    dataSpan05.id = 'y';
    dataSpan05.style.position = 'absolute';
    dataSpan05.style.top = '20px';
    dataSpan05.style.left = '10px';
    dataSpan05.style.color = '#ffffff'; // 白色字体
    dataSpan05.style.fontSize = '13px'; // 14号字体
    dataSpan05.style.left = '50%';
    dataSpan05.style.transform = 'translateX(-50%)';
    innerDiv24.appendChild(dataSpan05);

    var queryBtn05 = document.createElement('button');
    queryBtn05.textContent = '修改';
    queryBtn05.style.position = 'absolute';
    queryBtn05.style.top = '55px';
    queryBtn05.style.left = '10px';
    queryBtn05.style.left = '50%';
    queryBtn05.style.transform = 'translateX(-50%)';
    innerDiv24.appendChild(queryBtn05);

    // 给修改按钮添加点击事件
    queryBtn05.addEventListener('click', function() {
        // 读取当前 localStorage 中的按键值
        var currentKey05 = getStoredKeyjishen();

        // 弹出输入框，要求用户输入新的按键值
        var newKey05 = prompt('请输入新的按键', currentKey05);

        // 验证输入值是否为空或非法
        if (newKey05 !== null && newKey05.trim() !== '') {
            // 更新 localStorage 中的按键值
            setStoredKeyjishen(newKey05);
            alert('机审抢量按键已更新为: ' + newKey05);
        } else {
            alert('请输入有效的按键值');
        }
    });


    // 给修改按钮添加点击事件
    queryBtn05.addEventListener('click', function() {
        // 读取当前 localStorage 中的按键值
        var currentKey05 = getStoredKeyjishen();

        // 弹出输入框，要求用户输入新的按键值
        var newKey05 = prompt('请输入新的按键', currentKey05);

        // 验证输入值是否为空或非法
        if (newKey05 !== null && newKey05.trim() !== '') {
            // 更新 localStorage 中的按键值
            setStoredKeyjishen(newKey05);
            alert('机审抢量按键已更新为: ' + newKey05);
        } else {
            alert('请输入有效的按键值');
        }
    });


    // 在悬浮框内创建第五个容器
    var innerDiv25 = document.createElement('div');
    innerDiv25.id = 'innerDiv25';
    innerDiv25.style.width = '80px';
    innerDiv25.style.height = '80px';
    innerDiv25.style.position = 'absolute';
    innerDiv25.style.top = '5px';
    innerDiv25.style.left = '680px';
    innerDiv25.style.border = '1px solid #ffffff'; // #ffffff 表示白色

    // 将第五个内部容器添加到悬浮框
    leftContainer02.appendChild(innerDiv25);


    var textSpan06= document.createElement('span');
    textSpan06.textContent = '读取值'
    textSpan06.style.position = 'absolute';
    textSpan06.style.top = '5px';
    textSpan06.style.left = '10px';
    textSpan06.style.color = '#ffffff'; // 白色字体
    textSpan06.style.fontSize = '13px'; // 14号字体
    textSpan06.style.left = '50%';
    textSpan06.style.transform = 'translateX(-50%)';
    innerDiv25.appendChild(textSpan06);


    var queryBtn06 = document.createElement('button');
    queryBtn06.textContent = '读取';
    queryBtn06.style.position = 'absolute';
    queryBtn06.style.top = '55px';
    queryBtn06.style.left = '10px';
    queryBtn06.style.left = '50%';
    queryBtn06.style.transform = 'translateX(-50%)';
    innerDiv25.appendChild(queryBtn06);

    // 给修改按钮添加点击事件
    queryBtn06.addEventListener('click', function() {
        // 读取 localStorage 中的按键值
        var currentKey = getStoredKeydiwei();
        var currentKey01 = getStoredKeygaowei();
        var currentKey02 = getStoredKeyrenji();
        var currentKey03 = getStoredKeywutiaojian();
        var currentKey04 = getStoredKeyxinkuaishen();
        var currentKey05 = getStoredKeyjishen();
        //快速驳回
        var currentKey06 = getStoredKeykaitoujingpin();
        var currentKey07 = getStoredKeyjieweijingpin();
        var currentKey08 = getStoredKeyliejiyiren();
        var currentKey09 = getStoredKeyguanggaotuiguang();
        var currentKey10 = getStoredKeywuzizi();
        var currentKey11 = getStoredKeydisu();
        var currentKey12 = getStoredKeyweijinpian();
        var currentKey13 = getStoredKeywcn();
        var currentKey14 = getStoredKeychunsebeijing();
        var currentKey18 = getStoredKeyxuexingbaoli();
        //通过等
        var currentKey15 = getStoredKeyweidingxing();
        var currentKey16 = getStoredKeyyidingxing();
        var currentKey17 = getStoredKeytishikuang();

        // 更新 dataSpan 的值
        if (currentKey) {
            dataSpan.textContent = '当前为【' + currentKey + '】';
            dataSpan.id = currentKey;
        }
        // 更新 dataSpan01的值
        if (currentKey01) {
            dataSpan01.textContent = '当前为【' + currentKey01 + '】';
            dataSpan01.id = currentKey01;
        }
        // 更新 dataSpan02的值
        if (currentKey02) {
            dataSpan02.textContent = '当前为【' + currentKey02 + '】';
            dataSpan02.id = currentKey02;
        }
        // 更新 dataSpan03的值
        if (currentKey03) {
            dataSpan03.textContent = '当前为【' + currentKey03 + '】';
            dataSpan03.id = currentKey03;
        }


        // 更新 dataSpan04 的值
        if (currentKey04) {
            dataSpan04.textContent = '当前为【' + currentKey04 + '】';
            dataSpan04.id = currentKey04;
        }

        // 更新 dataSpan05 的值
        if (currentKey05) {
            dataSpan05.textContent = '当前为【' + currentKey05 + '】';
            dataSpan05.id = currentKey05;
        }

        //驳回

        // 更新 dataSpan06 的值
        if (currentKey06) {
            dataSpan07.textContent = '当前为【' + currentKey06 + '】';
            dataSpan07.id = currentKey06;
        }


        // 更新 dataSpan07 的值
        if (currentKey07) {
            dataSpan08.textContent = '当前为【' + currentKey07 + '】';
            dataSpan08.id = currentKey07;
        }


        // 更新 dataSpan08 的值
        if (currentKey08) {
            dataSpan09.textContent = '当前为【' + currentKey08 + '】';
            dataSpan09.id = currentKey08;
        }


        // 更新 dataSpan09 的值
        if (currentKey09) {
            dataSpan10.textContent = '当前为【' + currentKey09 + '】';
            dataSpan10.id = currentKey09;
        }


        // 更新 dataSpan10 的值
        if (currentKey10) {
            dataSpan11.textContent = '当前为【' + currentKey10 + '】';
            dataSpan11.id = currentKey10;
        }

        // 更新 dataSpan11 的值
        if (currentKey11) {
            dataSpan12.textContent = '当前为【' + currentKey11 + '】';
            dataSpan12.id = currentKey11;
        }


        // 更新 dataSpan12 的值
        if (currentKey12) {
            dataSpan13.textContent = '当前为【' + currentKey12 + '】';
            dataSpan13.id = currentKey12;
        }
        if (currentKey13) {
            dataSpan14.textContent = '当前为【' + currentKey13 + '】';
            dataSpan14.id = currentKey13;
        }
        // 更新 dataSpan14 的值
        if (currentKey14) {
            dataSpan15.textContent = '当前为【' + currentKey14 + '】';
            dataSpan15.id = currentKey14;
        }

        // 更新 dataSpan15 的值
        if (currentKey15) {
            dataSpan16.textContent = '当前为【' + currentKey15 + '】';
            dataSpan16.id = currentKey15;
        }

        // 更新 dataSpan16 的值
        if (currentKey16) {
            dataSpan17.textContent = '当前为【' + currentKey16 + '】';
            dataSpan17.id = currentKey16;
        }

        // 更新 dataSpan18 的值
        if (currentKey17) {
            dataSpan18.textContent = '当前为【' + currentKey17 + '】';
            dataSpan18.id = currentKey17;
        }
        // 更新 dataSpan25 的值
        if (currentKey18) {
            dataSpan25.textContent = '当前为【' + currentKey18 + '】';
            dataSpan25.id = currentKey18;
        }


        alert('读取完毕');

    });


    //模拟点击
    function runButtonClickLogic() {
        document.addEventListener('click', function (event) {
            var targetButton = event.target;
            var targetButtons = event.target;
            if (targetButtons.classList.contains('el-button') &&
                targetButtons.classList.contains('el-button--default') &&
                targetButtons.classList.contains('el-button--small') &&
                targetButtons.textContent.trim() === '资质不合规'|| targetButtons.textContent.trim() === '竞品引流'|| targetButtons.textContent.trim() === '运营需求'|| targetButtons.textContent.trim() === '图文不规范'|| targetButtons.textContent.trim() === '影响观看体验') {



                // 找到包含 "单一屏蔽" 文本的元素并模拟点击
                var blockingElement = findElementByText('el-button el-button--default el-button--small','单一屏蔽');

                if (blockingElement) {
                    simulateClick(blockingElement);

                } else {

                    console.log('Error: Element with "单一屏蔽" text not found');
                }
            }

            if (targetButton.classList.contains('el-button') &&
                targetButton.classList.contains('el-button--default') &&
                targetButton.classList.contains('el-button--small') &&
                targetButton.textContent.trim() === '视听管理规定'|| targetButton.textContent.trim() === '低俗引导'|| targetButton.textContent.trim() === '负面敏感'|| targetButton.textContent.trim() === '未成年人保护'|| targetButton.textContent.trim() === '血腥恐怖'|| targetButton.textContent.trim() === '民族宗教') {



                // 找到包含 "单一屏蔽" 文本的元素并模拟点击
                var blockingElements = findElementByText('el-button el-button--default el-button--small', 'MD5屏蔽');

                if (blockingElements) {
                    simulateClick(blockingElements);

                } else {
                    console.log('Error: Element with "MD5屏蔽" text not found');

                }
            }

        }, true);

        // 通过类名和文本内容查找元素
        function findElementByText(className, text) {
            var elems = document.getElementsByClassName(className);
            for (var i = 0; i < elems.length; i++) {
                if (elems[i].textContent.trim() === text) {
                    return elems[i];
                }
            }
            return null;
        }

        // 模拟点击事件
        function simulateClick(element) {
            var clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
            element.dispatchEvent(clickEvent);
        }
    }
    //模拟点击


    // 在悬浮框内创建第五个容器
    var innerDiv26 = document.createElement('div');
    innerDiv26.id = 'innerDiv26';
    innerDiv26.style.width = '80px';
    innerDiv26.style.height = '80px';
    innerDiv26.style.position = 'absolute';
    innerDiv26.style.top = '100px';
    innerDiv26.style.left = '5px';
    innerDiv26.style.border = '1px solid #ffffff'; // #ffffff 表示白色

    // 将第五个内部容器添加到悬浮框
    leftContainer02.appendChild(innerDiv26);


    var textSpan07= document.createElement('span');
    textSpan07.textContent = '竞品'
    textSpan07.style.position = 'absolute';
    textSpan07.style.top = '5px';
    textSpan07.style.left = '10px';
    textSpan07.style.color = '#ffffff'; // 白色字体
    textSpan07.style.fontSize = '13px'; // 14号字体
    textSpan07.style.left = '50%';
    textSpan07.style.transform = 'translateX(-50%)';
    innerDiv26.appendChild(textSpan07);

    var dataSpan07= document.createElement('span');
    dataSpan07.textContent = '开头为【6】';
    dataSpan07.id = 'kaitoujingpin';
    dataSpan07.style.position = 'absolute';
    dataSpan07.style.top = '20px';
    dataSpan07.style.left = '10px';
    dataSpan07.style.color = '#ffffff'; // 白色字体
    dataSpan07.style.fontSize = '13px'; // 14号字体
    dataSpan07.style.left = '50%';
    dataSpan07.style.transform = 'translateX(-50%)';
    innerDiv26.appendChild(dataSpan07);

    var queryBtn07 = document.createElement('button');
    queryBtn07.textContent = '修改';
    queryBtn07.style.position = 'absolute';
    queryBtn07.style.top = '55px';
    queryBtn07.style.left = '10px';
    queryBtn07.style.left = '50%';
    queryBtn07.style.transform = 'translateX(-50%)';
    innerDiv26.appendChild(queryBtn07);

    // 在悬浮框内创建第五个容器
    var innerDiv27 = document.createElement('div');
    innerDiv27.id = 'innerDiv27';
    innerDiv27.style.width = '80px';
    innerDiv27.style.height = '80px';
    innerDiv27.style.position = 'absolute';
    innerDiv27.style.top = '100px';
    innerDiv27.style.left = '100px';
    innerDiv27.style.border = '1px solid #ffffff'; // #ffffff 表示白色

    // 将第五个内部容器添加到悬浮框
    leftContainer02.appendChild(innerDiv27);


    var textSpan08= document.createElement('span');
    textSpan08.textContent = '竞品'
    textSpan08.style.position = 'absolute';
    textSpan08.style.top = '5px';
    textSpan08.style.left = '10px';
    textSpan08.style.color = '#ffffff'; // 白色字体
    textSpan08.style.fontSize = '13px'; // 14号字体
    textSpan08.style.left = '50%';
    textSpan08.style.transform = 'translateX(-50%)';
    innerDiv27.appendChild(textSpan08);

    var dataSpan08= document.createElement('span');
    dataSpan08.textContent = '结尾为【2】';
    dataSpan08.id = 'jieweijingpin';
    dataSpan08.style.position = 'absolute';
    dataSpan08.style.top = '20px';
    dataSpan08.style.left = '10px';
    dataSpan08.style.color = '#ffffff'; // 白色字体
    dataSpan08.style.fontSize = '13px'; // 14号字体
    dataSpan08.style.left = '50%';
    dataSpan08.style.transform = 'translateX(-50%)';
    innerDiv27.appendChild(dataSpan08);

    var queryBtn08 = document.createElement('button');
    queryBtn08.textContent = '修改';
    queryBtn08.style.position = 'absolute';
    queryBtn08.style.top = '55px';
    queryBtn08.style.left = '10px';
    queryBtn08.style.left = '50%';
    queryBtn08.style.transform = 'translateX(-50%)';
    innerDiv27.appendChild(queryBtn08);

    // 在悬浮框内创建第五个容器
    var innerDiv28 = document.createElement('div');
    innerDiv28.id = 'innerDivinnerDiv28';
    innerDiv28.style.width = '80px';
    innerDiv28.style.height = '80px';
    innerDiv28.style.position = 'absolute';
    innerDiv28.style.top = '100px';
    innerDiv28.style.left = '200px';
    innerDiv28.style.border = '1px solid #ffffff'; // #ffffff 表示白色

    // 将第五个内部容器添加到悬浮框
    leftContainer02.appendChild(innerDiv28);


    var textSpan09= document.createElement('span');
    textSpan09.textContent = '艺人'
    textSpan09.style.position = 'absolute';
    textSpan09.style.top = '5px';
    textSpan09.style.left = '10px';
    textSpan09.style.color = '#ffffff'; // 白色字体
    textSpan09.style.fontSize = '13px'; // 14号字体
    textSpan09.style.left = '50%';
    textSpan09.style.transform = 'translateX(-50%)';
    innerDiv28.appendChild(textSpan09);

    var dataSpan09= document.createElement('span');
    dataSpan09.textContent = '当前为【3】';
    dataSpan09.id = 'liejiyiren';
    dataSpan09.style.position = 'absolute';
    dataSpan09.style.top = '20px';
    dataSpan09.style.left = '10px';
    dataSpan09.style.color = '#ffffff'; // 白色字体
    dataSpan09.style.fontSize = '13px'; // 14号字体
    dataSpan09.style.left = '50%';
    dataSpan09.style.transform = 'translateX(-50%)';
    innerDiv28.appendChild(dataSpan09);

    var queryBtn09 = document.createElement('button');
    queryBtn09.textContent = '修改';
    queryBtn09.style.position = 'absolute';
    queryBtn09.style.top = '55px';
    queryBtn09.style.left = '10px';
    queryBtn09.style.left = '50%';
    queryBtn09.style.transform = 'translateX(-50%)';
    innerDiv28.appendChild(queryBtn09);

    // 在悬浮框内创建第五个容器
    var innerDiv29 = document.createElement('div');
    innerDiv29.id = 'innerDiv29';
    innerDiv29.style.width = '80px';
    innerDiv29.style.height = '80px';
    innerDiv29.style.position = 'absolute';
    innerDiv29.style.top = '100px';
    innerDiv29.style.left = '300px';
    innerDiv29.style.border = '1px solid #ffffff'; // #ffffff 表示白色

    // 将第五个内部容器添加到悬浮框
    leftContainer02.appendChild(innerDiv29);


    var textSpan10= document.createElement('span');
    textSpan10.textContent = '广告'
    textSpan10.style.position = 'absolute';
    textSpan10.style.top = '5px';
    textSpan10.style.left = '10px';
    textSpan10.style.color = '#ffffff'; // 白色字体
    textSpan10.style.fontSize = '13px'; // 14号字体
    textSpan10.style.left = '50%';
    textSpan10.style.transform = 'translateX(-50%)';
    innerDiv29.appendChild(textSpan10);

    var dataSpan10= document.createElement('span');
    dataSpan10.textContent = '当前为【4】';
    dataSpan10.id = 'guanggaotuiguang';
    dataSpan10.style.position = 'absolute';
    dataSpan10.style.top = '20px';
    dataSpan10.style.left = '10px';
    dataSpan10.style.color = '#ffffff'; // 白色字体
    dataSpan10.style.fontSize = '13px'; // 14号字体
    dataSpan10.style.left = '50%';
    dataSpan10.style.transform = 'translateX(-50%)';
    innerDiv29.appendChild(dataSpan10);

    var queryBtn10 = document.createElement('button');
    queryBtn10.textContent = '修改';
    queryBtn10.style.position = 'absolute';
    queryBtn10.style.top = '55px';
    queryBtn10.style.left = '10px';
    queryBtn10.style.left = '50%';
    queryBtn10.style.transform = 'translateX(-50%)';
    innerDiv29.appendChild(queryBtn10);

    // 在悬浮框内创建第五个容器
    var innerDiv30 = document.createElement('div');
    innerDiv30.id = 'innerDiv30';
    innerDiv30.style.width = '80px';
    innerDiv30.style.height = '80px';
    innerDiv30.style.position = 'absolute';
    innerDiv30.style.top = '100px';
    innerDiv30.style.left = '400px';
    innerDiv30.style.border = '1px solid #ffffff'; // #ffffff 表示白色

    // 将第五个内部容器添加到悬浮框
    leftContainer02.appendChild(innerDiv30);


    var textSpan11= document.createElement('span');
    textSpan11.textContent = '无资质'
    textSpan11.style.position = 'absolute';
    textSpan11.style.top = '5px';
    textSpan11.style.left = '10px';
    textSpan11.style.color = '#ffffff'; // 白色字体
    textSpan11.style.fontSize = '13px'; // 14号字体
    textSpan11.style.left = '50%';
    textSpan11.style.transform = 'translateX(-50%)';
    innerDiv30.appendChild(textSpan11);

    var dataSpan11= document.createElement('span');
    dataSpan11.textContent = '当前为【5】';
    dataSpan11.id = 'wuzizi';
    dataSpan11.style.position = 'absolute';
    dataSpan11.style.top = '20px';
    dataSpan11.style.left = '10px';
    dataSpan11.style.color = '#ffffff'; // 白色字体
    dataSpan11.style.fontSize = '13px'; // 14号字体
    dataSpan11.style.left = '50%';
    dataSpan11.style.transform = 'translateX(-50%)';
    innerDiv30.appendChild(dataSpan11);

    var queryBtn11 = document.createElement('button');
    queryBtn11.textContent = '修改';
    queryBtn11.style.position = 'absolute';
    queryBtn11.style.top = '55px';
    queryBtn11.style.left = '10px';
    queryBtn11.style.left = '50%';
    queryBtn11.style.transform = 'translateX(-50%)';
    innerDiv30.appendChild(queryBtn11);

    // 在悬浮框内创建第五个容器
    var innerDiv31 = document.createElement('div');
    innerDiv31.id = 'innerDiv31';
    innerDiv31.style.width = '80px';
    innerDiv31.style.height = '80px';
    innerDiv31.style.position = 'absolute';
    innerDiv31.style.top = '100px';
    innerDiv31.style.left = '500px';
    innerDiv31.style.border = '1px solid #ffffff'; // #ffffff 表示白色

    // 将第五个内部容器添加到悬浮框
    leftContainer02.appendChild(innerDiv31);


    var textSpan12= document.createElement('span');
    textSpan12.textContent = '低俗'
    textSpan12.style.position = 'absolute';
    textSpan12.style.top = '5px';
    textSpan12.style.left = '10px';
    textSpan12.style.color = '#ffffff'; // 白色字体
    textSpan12.style.fontSize = '13px'; // 14号字体
    textSpan12.style.left = '50%';
    textSpan12.style.transform = 'translateX(-50%)';
    innerDiv31.appendChild(textSpan12);

    var dataSpan12= document.createElement('span');
    dataSpan12.textContent = '当前为【6】';
    dataSpan12.id = 'disu';
    dataSpan12.style.position = 'absolute';
    dataSpan12.style.top = '20px';
    dataSpan12.style.left = '10px';
    dataSpan12.style.color = '#ffffff'; // 白色字体
    dataSpan12.style.fontSize = '13px'; // 14号字体
    dataSpan12.style.left = '50%';
    dataSpan12.style.transform = 'translateX(-50%)';
    innerDiv31.appendChild(dataSpan12);

    var queryBtn12 = document.createElement('button');
    queryBtn12.textContent = '修改';
    queryBtn12.style.position = 'absolute';
    queryBtn12.style.top = '55px';
    queryBtn12.style.left = '10px';
    queryBtn12.style.left = '50%';
    queryBtn12.style.transform = 'translateX(-50%)';
    innerDiv31.appendChild(queryBtn12);

    // 在悬浮框内创建第五个容器
    var innerDiv32 = document.createElement('div');
    innerDiv32.id = 'innerDiv32';
    innerDiv32.style.width = '80px';
    innerDiv32.style.height = '80px';
    innerDiv32.style.position = 'absolute';
    innerDiv32.style.top = '200px';
    innerDiv32.style.left = '5px';
    innerDiv32.style.border = '1px solid #ffffff'; // #ffffff 表示白色

    // 将第五个内部容器添加到悬浮框
    leftContainer02.appendChild(innerDiv32);


    var textSpan13= document.createElement('span');
    textSpan13.textContent = '违禁片'
    textSpan13.style.position = 'absolute';
    textSpan13.style.top = '5px';
    textSpan13.style.left = '10px';
    textSpan13.style.color = '#ffffff'; // 白色字体
    textSpan13.style.fontSize = '13px'; // 14号字体
    textSpan13.style.left = '50%';
    textSpan13.style.transform = 'translateX(-50%)';
    innerDiv32.appendChild(textSpan13);

    var dataSpan13= document.createElement('span');
    dataSpan13.textContent = '当前为【7】';
    dataSpan13.id = 'weijinpian';
    dataSpan13.style.position = 'absolute';
    dataSpan13.style.top = '20px';
    dataSpan13.style.left = '10px';
    dataSpan13.style.color = '#ffffff'; // 白色字体
    dataSpan13.style.fontSize = '13px'; // 14号字体
    dataSpan13.style.left = '50%';
    dataSpan13.style.transform = 'translateX(-50%)';
    innerDiv32.appendChild(dataSpan13);

    var queryBtn13 = document.createElement('button');
    queryBtn13.textContent = '修改';
    queryBtn13.style.position = 'absolute';
    queryBtn13.style.top = '55px';
    queryBtn13.style.left = '10px';
    queryBtn13.style.left = '50%';
    queryBtn13.style.transform = 'translateX(-50%)';
    innerDiv32.appendChild(queryBtn13);

    // 在悬浮框内创建第五个容器
    var innerDiv33 = document.createElement('div');
    innerDiv33.id = 'innerDiv33';
    innerDiv33.style.width = '80px';
    innerDiv33.style.height = '80px';
    innerDiv33.style.position = 'absolute';
    innerDiv33.style.top = '200px';
    innerDiv33.style.left = '100px';
    innerDiv33.style.border = '1px solid #ffffff'; // #ffffff 表示白色

    // 将第五个内部容器添加到悬浮框
    leftContainer02.appendChild(innerDiv33);


    var textSpan14= document.createElement('span');
    textSpan14.textContent = '未成年'
    textSpan14.style.position = 'absolute';
    textSpan14.style.top = '5px';
    textSpan14.style.left = '10px';
    textSpan14.style.color = '#ffffff'; // 白色字体
    textSpan14.style.fontSize = '13px'; // 14号字体
    textSpan14.style.left = '50%';
    textSpan14.style.transform = 'translateX(-50%)';
    innerDiv33.appendChild(textSpan14);

    var dataSpan14= document.createElement('span');
    dataSpan14.textContent = '当前为【8】';
    dataSpan14.id = 'weichengnian';
    dataSpan14.style.position = 'absolute';
    dataSpan14.style.top = '20px';
    dataSpan14.style.left = '10px';
    dataSpan14.style.color = '#ffffff'; // 白色字体
    dataSpan14.style.fontSize = '13px'; // 14号字体
    dataSpan14.style.left = '50%';
    dataSpan14.style.transform = 'translateX(-50%)';
    innerDiv33.appendChild(dataSpan14);

    var queryBtn14 = document.createElement('button');
    queryBtn14.textContent = '修改';
    queryBtn14.style.position = 'absolute';
    queryBtn14.style.top = '55px';
    queryBtn14.style.left = '10px';
    queryBtn14.style.left = '50%';
    queryBtn14.style.transform = 'translateX(-50%)';
    innerDiv33.appendChild(queryBtn14);

    // 在悬浮框内创建第五个容器
    var innerDiv34 = document.createElement('div');
    innerDiv34.style.width = '80px';
    innerDiv34.style.height = '80px';
    innerDiv34.style.position = 'absolute';
    innerDiv34.style.top = '200px';
    innerDiv34.style.left = '200px';
    innerDiv34.style.border = '1px solid #ffffff'; // #ffffff 表示白色

    // 将第五个内部容器添加到悬浮框
    leftContainer02.appendChild(innerDiv34);


    var textSpan15= document.createElement('span');
    textSpan15.textContent = '纯背景'
    textSpan15.style.position = 'absolute';
    textSpan15.style.top = '5px';
    textSpan15.style.left = '10px';
    textSpan15.style.color = '#ffffff'; // 白色字体
    textSpan15.style.fontSize = '13px'; // 14号字体
    textSpan15.style.left = '50%';
    textSpan15.style.transform = 'translateX(-50%)';
    innerDiv34.appendChild(textSpan15);

    var dataSpan15= document.createElement('span');
    dataSpan15.textContent = '当前为【9】';
    dataSpan15.id = 'chunsebeijing';
    dataSpan15.style.position = 'absolute';
    dataSpan15.style.top = '20px';
    dataSpan15.style.left = '10px';
    dataSpan15.style.color = '#ffffff'; // 白色字体
    dataSpan15.style.fontSize = '13px'; // 14号字体
    dataSpan15.style.left = '50%';
    dataSpan15.style.transform = 'translateX(-50%)';
    innerDiv34.appendChild(dataSpan15);

    var queryBtn15 = document.createElement('button');
    queryBtn15.textContent = '修改';
    queryBtn15.style.position = 'absolute';
    queryBtn15.style.top = '55px';
    queryBtn15.style.left = '10px';
    queryBtn15.style.left = '50%';
    queryBtn15.style.transform = 'translateX(-50%)';
    innerDiv34.appendChild(queryBtn15);

    // 在悬浮框内创建第五个容器
    var innerDiv35 = document.createElement('div');
    innerDiv35.style.width = '80px';
    innerDiv35.style.height = '80px';
    innerDiv35.style.position = 'absolute';
    innerDiv35.style.top = '200px';
    innerDiv35.style.left = '300px';
    innerDiv35.style.border = '1px solid #ffffff'; // #ffffff 表示白色

    // 将第五个内部容器添加到悬浮框
    leftContainer02.appendChild(innerDiv35);


    var textSpan16= document.createElement('span');
    textSpan16.textContent = '未定性'
    textSpan16.style.position = 'absolute';
    textSpan16.style.top = '5px';
    textSpan16.style.left = '10px';
    textSpan16.style.color = '#ffffff'; // 白色字体
    textSpan16.style.fontSize = '13px'; // 14号字体
    textSpan16.style.left = '50%';
    textSpan16.style.transform = 'translateX(-50%)';
    innerDiv35.appendChild(textSpan16);

    var dataSpan16= document.createElement('span');
    dataSpan16.textContent = '当前为【0】';
    dataSpan16.id = 'weidingxing';
    dataSpan16.style.position = 'absolute';
    dataSpan16.style.top = '20px';
    dataSpan16.style.left = '10px';
    dataSpan16.style.color = '#ffffff'; // 白色字体
    dataSpan16.style.fontSize = '13px'; // 14号字体
    dataSpan16.style.left = '50%';
    dataSpan16.style.transform = 'translateX(-50%)';
    innerDiv35.appendChild(dataSpan16);

    var queryBtn16 = document.createElement('button');
    queryBtn16.textContent = '修改';
    queryBtn16.style.position = 'absolute';
    queryBtn16.style.top = '55px';
    queryBtn16.style.left = '10px';
    queryBtn16.style.left = '50%';
    queryBtn16.style.transform = 'translateX(-50%)';
    innerDiv35.appendChild(queryBtn16);

    // 在悬浮框内创建第五个容器
    var innerDiv36 = document.createElement('div');
    innerDiv36.style.width = '80px';
    innerDiv36.style.height = '80px';
    innerDiv36.style.position = 'absolute';
    innerDiv36.style.top = '200px';
    innerDiv36.style.left = '400px';
    innerDiv36.style.border = '1px solid #ffffff'; // #ffffff 表示白色

    // 将第五个内部容器添加到悬浮框
    leftContainer02.appendChild(innerDiv36);


    var textSpan17= document.createElement('span');
    textSpan17.textContent = '已定性'
    textSpan17.style.position = 'absolute';
    textSpan17.style.top = '5px';
    textSpan17.style.left = '10px';
    textSpan17.style.color = '#ffffff'; // 白色字体
    textSpan17.style.fontSize = '13px'; // 14号字体
    textSpan17.style.left = '50%';
    textSpan17.style.transform = 'translateX(-50%)';
    innerDiv36.appendChild(textSpan17);

    var dataSpan17= document.createElement('span');
    dataSpan17.textContent = '当前为【-】';
    dataSpan17.id = 'yidingxing';
    dataSpan17.style.position = 'absolute';
    dataSpan17.style.top = '20px';
    dataSpan17.style.left = '10px';
    dataSpan17.style.color = '#ffffff'; // 白色字体
    dataSpan17.style.fontSize = '13px'; // 14号字体
    dataSpan17.style.left = '50%';
    dataSpan17.style.transform = 'translateX(-50%)';
    innerDiv36.appendChild(dataSpan17);

    var queryBtn17 = document.createElement('button');
    queryBtn17.textContent = '修改';
    queryBtn17.style.position = 'absolute';
    queryBtn17.style.top = '55px';
    queryBtn17.style.left = '10px';
    queryBtn17.style.left = '50%';
    queryBtn17.style.transform = 'translateX(-50%)';
    innerDiv36.appendChild(queryBtn17);

    // 在悬浮框内创建第五个容器
    var innerDiv37 = document.createElement('div');
    innerDiv37.style.width = '80px';
    innerDiv37.style.height = '80px';
    innerDiv37.style.position = 'absolute';
    innerDiv37.style.top = '200px';
    innerDiv37.style.left = '500px';
    innerDiv37.style.border = '1px solid #ffffff'; // #ffffff 表示白色

    // 将第五个内部容器添加到悬浮框
    leftContainer02.appendChild(innerDiv37);

    var textSpan18= document.createElement('span');
    textSpan18.textContent = '提示框'
    textSpan18.style.position = 'absolute';
    textSpan18.style.top = '5px';
    textSpan18.style.left = '10px';
    textSpan18.style.color = '#ffffff'; // 白色字体
    textSpan18.style.fontSize = '13px'; // 14号字体
    textSpan18.style.left = '50%';
    textSpan18.style.transform = 'translateX(-50%)';
    innerDiv37.appendChild(textSpan18);

    var dataSpan18= document.createElement('span');
    dataSpan18.textContent = '当前为【;】';
    dataSpan18.id = 'tishikuang';
    dataSpan18.style.position = 'absolute';
    dataSpan18.style.top = '20px';
    dataSpan18.style.left = '10px';
    dataSpan18.style.color = '#ffffff'; // 白色字体
    dataSpan18.style.fontSize = '13px'; // 14号字体
    dataSpan18.style.left = '50%';
    dataSpan18.style.transform = 'translateX(-50%)';
    innerDiv37.appendChild(dataSpan18);

    var queryBtn18 = document.createElement('button');
    queryBtn18.textContent = '修改';
    queryBtn18.style.position = 'absolute';
    queryBtn18.style.top = '55px';
    queryBtn18.style.left = '10px';
    queryBtn18.style.left = '50%';
    queryBtn18.style.transform = 'translateX(-50%)';
    innerDiv37.appendChild(queryBtn18);

    // 在悬浮框内创建第五个容器
    var innerDiv41 = document.createElement('div');
    innerDiv41.style.width = '120px';
    innerDiv41.style.height = '80px';
    innerDiv41.style.position = 'absolute';
    innerDiv41.style.top = '300px';
    innerDiv41.style.left = '5px';
    innerDiv41.style.border = '1px solid #ffffff'; // #ffffff 表示白色

    leftContainer02.appendChild(innerDiv41);

    var textSpan19= document.createElement('span');
    textSpan19.textContent = '直接结尾'
    textSpan19.style.position = 'absolute';
    textSpan19.style.top = '5px';
    textSpan19.style.left = '10px';
    textSpan19.style.color = '#ffffff'; // 白色字体
    textSpan19.style.fontSize = '13px'; // 14号字体
    textSpan19.style.left = '50%';
    textSpan19.style.transform = 'translateX(-50%)';
    innerDiv41.appendChild(textSpan19);

    var dataSpan19= document.createElement('span');
    dataSpan19.textContent = '当前为【关闭】';
    dataSpan19.id = 'zhijiejiewei';
    dataSpan19.style.position = 'absolute';
    dataSpan19.style.top = '20px';
    dataSpan19.style.left = '10px';
    dataSpan19.style.color = '#ffffff'; // 白色字体
    dataSpan19.style.fontSize = '13px'; // 14号字体
    dataSpan19.style.left = '50%';
    dataSpan19.style.transform = 'translateX(-50%)';
    innerDiv41.appendChild(dataSpan19);


    var queryBtn19 = document.createElement('button');
    queryBtn19.textContent = '切换';
    queryBtn19.style.position = 'absolute';
    queryBtn19.style.top = '55px';
    queryBtn19.style.left = '10px';
    queryBtn19.style.left = '50%';
    queryBtn19.style.transform = 'translateX(-50%)';
    innerDiv41.appendChild(queryBtn19);

    //播放速度

    // 在悬浮框内创建第五个容器
    var innerDiv42 = document.createElement('div');
    innerDiv42.style.width = '120px';
    innerDiv42.style.height = '80px';
    innerDiv42.style.position = 'absolute';
    innerDiv42.style.top = '300px';
    innerDiv42.style.left = '150px';
    innerDiv42.style.border = '1px solid #ffffff'; // #ffffff 表示白色

    leftContainer02.appendChild(innerDiv42);


    var textSpan20= document.createElement('span');
    textSpan20.textContent = '视频速率'
    textSpan20.style.position = 'absolute';
    textSpan20.style.top = '5px';
    textSpan20.style.left = '10px';
    textSpan20.style.color = '#ffffff'; // 白色字体
    textSpan20.style.fontSize = '13px'; // 14号字体
    textSpan20.style.left = '50%';
    textSpan20.style.transform = 'translateX(-50%)';
    innerDiv42.appendChild(textSpan20);

    var dataSpan20= document.createElement('span');
    dataSpan20.textContent = '当前为【关闭】';
    dataSpan20.id = 'shipinbeisu';
    dataSpan20.style.position = 'absolute';
    dataSpan20.style.top = '20px';
    dataSpan20.style.left = '10px';
    dataSpan20.style.color = '#ffffff'; // 白色字体
    dataSpan20.style.fontSize = '13px'; // 14号字体
    dataSpan20.style.left = '50%';
    dataSpan20.style.transform = 'translateX(-50%)';
    innerDiv42.appendChild(dataSpan20);


    var queryBtn20 = document.createElement('button');
    queryBtn20.textContent = '切换';
    queryBtn20.style.position = 'absolute';
    queryBtn20.style.top = '55px';
    queryBtn20.style.left = '10px';
    queryBtn20.style.left = '50%';
    queryBtn20.style.transform = 'translateX(-50%)';
    innerDiv42.appendChild(queryBtn20);


    // 从 localStorage 中读取 isPlaybackSpeedEnabled 的值，如果不存在则使用默认值 false
    let isPlaybackSpeedEnabled = localStorage.getItem('isPlaybackSpeedEnabled') === 'true'; // 注意判断的值改为 true

    // 更新按钮显示
    function updateButtonStates() {
        if (isPlaybackSpeedEnabled) {
            dataSpan20.textContent = '当前为【开启】';
        } else {
            dataSpan20.textContent = '当前为【关闭】';
        }
    }

    // 初始化按钮状态
    updateButtonStates();

    // 绑定搜索按钮点击事件
    queryBtn20.addEventListener('click', async function() {
        // 切换 isPlaybackSpeedEnabled 的值
        isPlaybackSpeedEnabled = !isPlaybackSpeedEnabled;
        // 将 isPlaybackSpeedEnabled 的值保存到 localStorage
        localStorage.setItem('isPlaybackSpeedEnabled', isPlaybackSpeedEnabled);
        // 更新按钮显示
        updateButtonStates();
    });

    // 页面加载时更新按钮显示状态
    window.addEventListener('load', updateButtonStates);



    // 从 localStorage 中读取 jieweims 的值，如果不存在则使用默认值 false
    let jieweims = localStorage.getItem('jieweims') === 'true'; // 注意判断的值改为 true

    // 更新按钮显示
    function updateButtonState() {
        if (jieweims) {
            dataSpan19.textContent = '当前为【开启】';
        } else {
            dataSpan19.textContent = '当前为【关闭】';
        }
    }

    // 初始化按钮状态
    updateButtonState();

    // 绑定搜索按钮点击事件
    queryBtn19.addEventListener('click', async function() {
        // 切换 jieweims 的值
        jieweims = !jieweims;
        // 将 jieweims 的值保存到 localStorage
        localStorage.setItem('jieweims', jieweims);
        // 更新按钮显示
        updateButtonState();
    });
    // 页面加载时更新按钮显示状态
    window.addEventListener('load', updateButtonStates);



    // 在悬浮框内创建第五个容器
    var innerDiv43 = document.createElement('div');
    innerDiv43.style.width = '120px';
    innerDiv43.style.height = '80px';
    innerDiv43.style.position = 'absolute';
    innerDiv43.style.top = '300px';
    innerDiv43.style.left = '300px';
    innerDiv43.style.border = '1px solid #ffffff'; // #ffffff 表示白色

    leftContainer02.appendChild(innerDiv43);

    var shituyinqin = false;


    var textSpan21= document.createElement('span');
    textSpan21.textContent = '识图引擎'
    textSpan21.style.position = 'absolute';
    textSpan21.style.top = '5px';
    textSpan21.style.left = '10px';
    textSpan21.style.color = '#ffffff'; // 白色字体
    textSpan21.style.fontSize = '13px'; // 14号字体
    textSpan21.style.left = '50%';
    textSpan21.style.transform = 'translateX(-50%)';
    innerDiv43.appendChild(textSpan21);

    var dataSpan21= document.createElement('span');
    dataSpan21.textContent = '当前为【百度】';
    dataSpan21.id = 'shituyinqin';
    dataSpan21.style.position = 'absolute';
    dataSpan21.style.top = '20px';
    dataSpan21.style.left = '10px';
    dataSpan21.style.color = '#ffffff'; // 白色字体
    dataSpan21.style.fontSize = '13px'; // 14号字体
    dataSpan21.style.left = '50%';
    dataSpan21.style.transform = 'translateX(-50%)';
    innerDiv43.appendChild(dataSpan21);


    var queryBtn21 = document.createElement('button');
    queryBtn21.textContent = '切换';
    queryBtn21.style.position = 'absolute';
    queryBtn21.style.top = '55px';
    queryBtn21.style.left = '10px';
    queryBtn21.style.left = '50%';
    queryBtn21.style.transform = 'translateX(-50%)';
    innerDiv43.appendChild(queryBtn21);

    // 绑定搜索按钮点击事件
    queryBtn21.addEventListener('click', async function() {
        // 切换kuaisums的值
        shituyinqin = !shituyinqin;

        if (shituyinqin) {

            dataSpan21.textContent = '当前为【搜狗】';
            console.log(shituyinqin);
        } else {

            dataSpan21.textContent = '当前为【百度】';
            console.log(shituyinqin);
        }

    });


    // 在悬浮框内创建第五个容器
    var innerDiv44 = document.createElement('div');
    innerDiv44.style.width = '120px';
    innerDiv44.style.height = '80px';
    innerDiv44.style.position = 'absolute';
    innerDiv44.style.top = '300px';
    innerDiv44.style.left = '450px';
    innerDiv44.style.border = '1px solid #ffffff'; // #ffffff 表示白色

    leftContainer02.appendChild(innerDiv44);

    var textSpan22= document.createElement('span');
    textSpan22.textContent = '辅助审核'
    textSpan22.style.position = 'absolute';
    textSpan22.style.top = '5px';
    textSpan22.style.left = '10px';
    textSpan22.style.color = '#ffffff'; // 白色字体
    textSpan22.style.fontSize = '13px'; // 14号字体
    textSpan22.style.left = '50%';
    textSpan22.style.transform = 'translateX(-50%)';
    innerDiv44.appendChild(textSpan22);

    var dataSpan22= document.createElement('span');
    dataSpan22.textContent = '精度为【模糊】';
    dataSpan22.id = 'fuzhushenhe';
    dataSpan22.style.position = 'absolute';
    dataSpan22.style.top = '20px';
    dataSpan22.style.left = '10px';
    dataSpan22.style.color = '#ffffff'; // 白色字体
    dataSpan22.style.fontSize = '13px'; // 14号字体
    dataSpan22.style.left = '50%';
    dataSpan22.style.transform = 'translateX(-50%)';
    innerDiv44.appendChild(dataSpan22);


    var queryBtn22 = document.createElement('button');
    queryBtn22.textContent = '切换';
    queryBtn22.style.position = 'absolute';
    queryBtn22.style.top = '55px';
    queryBtn22.style.left = '10px';
    queryBtn22.style.left = '50%';
    queryBtn22.style.transform = 'translateX(-50%)';
    innerDiv44.appendChild(queryBtn22);

    let AIjingdu = localStorage.getItem('AIjingdu') === 'true'; // 注意判断的值改为 true

    // 更新按钮显示
    function updateButtonStatess() {
        if (AIjingdu) {
            dataSpan22.textContent = '精度为【精准】';
        } else {
            dataSpan22.textContent = '精度为【模糊】';
        }
    }

    // 初始化按钮状态
    updateButtonStatess();


    // 绑定搜索按钮点击事件
    queryBtn22.addEventListener('click', async function() {
        // 切换kuaisums的值
        AIjingdu = !AIjingdu;
        // 将 isPlaybackSpeedEnabled 的值保存到 localStorage
        localStorage.setItem('AIjingdu', AIjingdu);
        // 更新按钮显示
        updateButtonStatess();

    });


    // 在悬浮框内创建第11个容器
    var innerDiv39 = document.createElement('div');
    innerDiv39.id = 'innerDiv11';
    innerDiv39.style.width = '298px';
    innerDiv39.style.height = '20px';
    innerDiv39.style.position = 'absolute';
    innerDiv39.style.top = '26px';
    innerDiv39.style.right = '-180px';

    draggableDiv.appendChild(innerDiv39);


    var innerDiv47 = document.createElement('div');
    innerDiv47.style.width = '400px';
    innerDiv47.style.height = '80px';
    innerDiv47.style.position = 'absolute';
    innerDiv47.style.top = '400px';
    innerDiv47.style.left = '5px';
    innerDiv47.style.border = '1px solid #ffffff'; // #ffffff 表示白色

    leftContainer02.appendChild(innerDiv47);

    var textSpan23= document.createElement('span');
    textSpan23.textContent = '抢量通道'
    textSpan23.style.position = 'absolute';
    textSpan23.style.top = '5px';
    textSpan23.style.left = '10px';
    textSpan23.style.color = '#ffffff'; // 白色字体
    textSpan23.style.fontSize = '13px'; // 14号字体
    textSpan23.style.left = '50%';
    textSpan23.style.transform = 'translateX(-50%)';
    innerDiv47.appendChild(textSpan23);


    var queryBtndiwei = document.createElement('button');
    queryBtndiwei.textContent = '低危';
    queryBtndiwei.style.position = 'absolute';
    queryBtndiwei.style.top = '35px';
    queryBtndiwei.style.left = '100px';
    queryBtndiwei.style.transform = 'translateX(-50%)';
    innerDiv47.appendChild(queryBtndiwei);


    var queryBtngaowei = document.createElement('button');
    queryBtngaowei.textContent = '高危';
    queryBtngaowei.style.position = 'absolute';
    queryBtngaowei.style.top = '35px';
    queryBtngaowei.style.left = '150px';
    queryBtngaowei.style.transform = 'translateX(-50%)';
    innerDiv47.appendChild(queryBtngaowei);

    var queryBtnrenji = document.createElement('button');
    queryBtnrenji.textContent = '人机';
    queryBtnrenji.style.position = 'absolute';
    queryBtnrenji.style.top = '35px';
    queryBtnrenji.style.left = '200px';
    queryBtnrenji.style.transform = 'translateX(-50%)';
    innerDiv47.appendChild(queryBtnrenji);


    var queryBtnquanbu = document.createElement('button');
    queryBtnquanbu.textContent = '全部';
    queryBtnquanbu.style.position = 'absolute';
    queryBtnquanbu.style.top = '35px';
    queryBtnquanbu.style.left = '250px';
    queryBtnquanbu.style.transform = 'translateX(-50%)';
    innerDiv47.appendChild(queryBtnquanbu);


    // 将按钮和elementTexts关联起来
    queryBtndiwei.addEventListener('click', function() {
        queryBtndiwei.style.backgroundColor = 'red';
        queryBtngaowei.style.backgroundColor = '';
        queryBtnrenji.style.backgroundColor = '';
        queryBtnquanbu.style.backgroundColor = '';
        elementTexts = ['低危用户节目'];
        localStorage.setItem('elementTexts', JSON.stringify(elementTexts));
    });

    queryBtngaowei.addEventListener('click', function() {
        queryBtngaowei.style.backgroundColor = 'red';
        queryBtndiwei.style.backgroundColor = '';
        queryBtnrenji.style.backgroundColor = '';
        queryBtnquanbu.style.backgroundColor = '';
        elementTexts = ['高危用户节目'];
        localStorage.setItem('elementTexts', JSON.stringify(elementTexts));
    });

    queryBtnrenji.addEventListener('click', function() {
        queryBtnrenji.style.backgroundColor = 'red';
        queryBtngaowei.style.backgroundColor = '';
        queryBtndiwei.style.backgroundColor = '';
        queryBtnquanbu.style.backgroundColor = '';
        elementTexts = ['人机差异复核'];
        localStorage.setItem('elementTexts', JSON.stringify(elementTexts));
    });


    queryBtnquanbu.addEventListener('click', function() {
        queryBtnquanbu.style.backgroundColor = 'red';
        queryBtndiwei.style.backgroundColor = '';
        queryBtnrenji.style.backgroundColor = '';
        queryBtngaowei.style.backgroundColor = '';
        elementTexts = ['低危用户节目', '高危用户节目', '人机差异复核'];
        localStorage.setItem('elementTexts', JSON.stringify(elementTexts));
    });




    // 在悬浮框内创建第五个容器
    var innerDiv48 = document.createElement('div');
    innerDiv48.style.width = '120px';
    innerDiv48.style.height = '80px';
    innerDiv48.style.position = 'absolute';
    innerDiv48.style.top = '400px';
    innerDiv48.style.left = '450px';
    innerDiv48.style.border = '1px solid #ffffff'; // #ffffff 表示白色

    // 将第五个内部容器添加到悬浮框
    leftContainer02.appendChild(innerDiv48);

    var textSpan25= document.createElement('span');
    textSpan25.textContent = '血腥暴力'
    textSpan25.style.position = 'absolute';
    textSpan25.style.top = '5px';
    textSpan25.style.left = '10px';
    textSpan25.style.color = '#ffffff'; // 白色字体
    textSpan25.style.fontSize = '13px'; // 14号字体
    textSpan25.style.left = '50%';
    textSpan25.style.transform = 'translateX(-50%)';
    innerDiv48.appendChild(textSpan25);

    var dataSpan25= document.createElement('span');
    dataSpan25.textContent = '当前为【5】';
    dataSpan25.id = 'tishikuang';
    dataSpan25.style.position = 'absolute';
    dataSpan25.style.top = '20px';
    dataSpan25.style.left = '10px';
    dataSpan25.style.color = '#ffffff'; // 白色字体
    dataSpan25.style.fontSize = '13px'; // 14号字体
    dataSpan25.style.left = '50%';
    dataSpan25.style.transform = 'translateX(-50%)';
    innerDiv48.appendChild(dataSpan25);

    var queryBtn25 = document.createElement('button');
    queryBtn25.textContent = '修改';
    queryBtn25.style.position = 'absolute';
    queryBtn25.style.top = '55px';
    queryBtn25.style.left = '10px';
    queryBtn25.style.left = '50%';
    queryBtn25.style.transform = 'translateX(-50%)';
    innerDiv48.appendChild(queryBtn25);




    //数据量
    var buttonbai = document.createElement('button');
    buttonbai.textContent = '数据量查询';
    buttonbai.style.padding = '5px 5px';
    buttonbai.style.borderRadius = '5px';
    buttonbai.style.border = 'none';
    buttonbai.style.background = '#ff7f50'; // 橙色
    buttonbai.style.color = '#fff';
    buttonbai.style.cursor = 'pointer';

    innerDiv39.appendChild(buttonbai);


    // 给修改按钮添加点击事件
    queryBtn07.addEventListener('click', function() {
        // 读取当前 localStorage 中的按键值
        var currentKey06 = getStoredKeykaitoujingpin();

        // 弹出输入框，要求用户输入新的按键值
        var newKey06 = prompt('请输入新的按键', currentKey06);

        // 验证输入值是否为空或非法
        if (newKey06 !== null && newKey06.trim() !== '') {
            // 更新 localStorage 中的按键值
            setStoredKeykaitoujingpin(newKey06);
            alert('开头竞品按键已更新为: ' + newKey06);
        } else {
            alert('请输入有效的按键值');
        }
    });

    // 给修改按钮添加点击事件
    queryBtn08.addEventListener('click', function() {
        // 读取当前 localStorage 中的按键值
        var currentKey07 = getStoredKeyjieweijingpin();

        // 弹出输入框，要求用户输入新的按键值
        var newKey07 = prompt('请输入新的按键', currentKey07);

        // 验证输入值是否为空或非法
        if (newKey07 !== null && newKey07.trim() !== '') {
            // 更新 localStorage 中的按键值
            setStoredKeyjieweijingpin(newKey07);
            alert('结尾竞品按键已更新为: ' + newKey07);
        } else {
            alert('请输入有效的按键值');
        }
    });

    // 给修改按钮添加点击事件
    queryBtn09.addEventListener('click', function() {
        // 读取当前 localStorage 中的按键值
        var currentKey08 = getStoredKeyliejiyiren();

        // 弹出输入框，要求用户输入新的按键值
        var newKey08 = prompt('请输入新的按键', currentKey08);

        // 验证输入值是否为空或非法
        if (newKey08 !== null && newKey08.trim() !== '') {
            // 更新 localStorage 中的按键值
            setStoredKeyliejiyiren(newKey08);
            alert('劣迹艺人按键已更新为: ' + newKey08);
        } else {
            alert('请输入有效的按键值');
        }
    });

    // 给修改按钮添加点击事件
    queryBtn10.addEventListener('click', function() {
        // 读取当前 localStorage 中的按键值
        var currentKey09 = getStoredKeyguanggaotuiguang();

        // 弹出输入框，要求用户输入新的按键值
        var newKey09 = prompt('请输入新的按键', currentKey09);

        // 验证输入值是否为空或非法
        if (newKey09 !== null && newKey09.trim() !== '') {
            // 更新 localStorage 中的按键值
            setStoredKeyguanggaotuiguang(newKey09);
            alert('广告推广按键已更新为: ' + newKey09);
        } else {
            alert('请输入有效的按键值');
        }
    });

    // 给修改按钮添加点击事件
    queryBtn11.addEventListener('click', function() {
        // 读取当前 localStorage 中的按键值
        var currentKey10 = getStoredKeywuzizi();

        // 弹出输入框，要求用户输入新的按键值
        var newKey10 = prompt('请输入新的按键', currentKey10);

        // 验证输入值是否为空或非法
        if (newKey10 !== null && newKey10.trim() !== '') {
            // 更新 localStorage 中的按键值
            setStoredKeywuzizi(newKey10);
            alert('无资质按键已更新为: ' + newKey10);
        } else {
            alert('请输入有效的按键值');
        }
    });

    // 给修改按钮添加点击事件
    queryBtn12.addEventListener('click', function() {
        // 读取当前 localStorage 中的按键值
        var currentKey11 = getStoredKeydisu();

        // 弹出输入框，要求用户输入新的按键值
        var newKey11 = prompt('请输入新的按键', currentKey11);

        // 验证输入值是否为空或非法
        if (newKey11 !== null && newKey11.trim() !== '') {
            // 更新 localStorage 中的按键值
            setStoredKeydisu(newKey11);
            alert('低俗按键已更新为: ' + newKey11);
        } else {
            alert('请输入有效的按键值');
        }
    });

    // 给修改按钮添加点击事件
    queryBtn13.addEventListener('click', function() {
        // 读取当前 localStorage 中的按键值
        var currentKey12 = getStoredKeyweijinpian();

        // 弹出输入框，要求用户输入新的按键值
        var newKey12 = prompt('请输入新的按键', currentKey12);

        // 验证输入值是否为空或非法
        if (newKey12 !== null && newKey12.trim() !== '') {
            // 更新 localStorage 中的按键值
            setStoredKeyweijinpian(newKey12);
            alert('违禁影片按键已更新为: ' + newKey12);
        } else {
            alert('请输入有效的按键值');
        }
    });

    // 给修改按钮添加点击事件
    queryBtn14.addEventListener('click', function() {
        // 读取当前 localStorage 中的按键值
        var currentKey13 = getStoredKeywcn();

        // 弹出输入框，要求用户输入新的按键值
        var newKey13 = prompt('请输入新的按键', currentKey13);

        // 验证输入值是否为空或非法
        if (newKey13 !== null && newKey13.trim() !== '') {
            // 更新 localStorage 中的按键值
            setStoredKeywcn(newKey13);
            alert('未成年按键已更新为: ' + newKey13);
        } else {
            alert('请输入有效的按键值');
        }
    });

    // 给修改按钮添加点击事件
    queryBtn15.addEventListener('click', function() {
        // 读取当前 localStorage 中的按键值
        var currentKey14 = getStoredKeychunsebeijing();

        // 弹出输入框，要求用户输入新的按键值
        var newKey14 = prompt('请输入新的按键', currentKey14);

        // 验证输入值是否为空或非法
        if (newKey14 !== null && newKey14.trim() !== '') {
            // 更新 localStorage 中的按键值
            setStoredKeychunsebeijing(newKey14);
            alert('封面纯色按键已更新为: ' + newKey14);
        } else {
            alert('请输入有效的按键值');
        }
    });
    // 给修改按钮添加点击事件
    queryBtn25.addEventListener('click', function() {
        // 读取当前 localStorage 中的按键值
        var currentKey18 = getStoredKeyxuexingbaoli();

        // 弹出输入框，要求用户输入新的按键值
        var newKey19 = prompt('请输入新的按键', currentKey18);

        // 验证输入值是否为空或非法
        if (newKey19 !== null && newKey19.trim() !== '') {
            // 更新 localStorage 中的按键值
            setStoredKeyxuexingbaoli(newKey19);
            alert('血腥暴力按键已更新为: ' + newKey19);
        } else {
            alert('请输入有效的按键值');
        }
    });
    // 给修改按钮添加点击事件
    queryBtn16.addEventListener('click', function() {
        // 读取当前 localStorage 中的按键值
        var currentKey15 = getStoredKeyweidingxing();

        // 弹出输入框，要求用户输入新的按键值
        var newKey15 = prompt('请输入新的按键', currentKey15);

        // 验证输入值是否为空或非法
        if (newKey15 !== null && newKey15.trim() !== '') {
            // 更新 localStorage 中的按键值
            setStoredKeyweidingxing(newKey15);
            alert('未定性按键已更新为: ' + newKey15);
        } else {
            alert('请输入有效的按键值');
        }
    });
    // 给修改按钮添加点击事件
    queryBtn17.addEventListener('click', function() {
        // 读取当前 localStorage 中的按键值
        var currentKey16 = getStoredKeyyidingxing();

        // 弹出输入框，要求用户输入新的按键值
        var newKey16 = prompt('请输入新的按键', currentKey16);

        // 验证输入值是否为空或非法
        if (newKey16 !== null && newKey16.trim() !== '') {
            // 更新 localStorage 中的按键值
            setStoredKeyyidingxing(newKey16);
            alert('已定性按键已更新为: ' + newKey16);
        } else {
            alert('请输入有效的按键值');
        }
    });


    // 给修改按钮添加点击事件
    queryBtn18.addEventListener('click', function() {
        // 读取当前 localStorage 中的按键值
        var currentKey17 = getStoredKeytishikuang();

        // 弹出输入框，要求用户输入新的按键值
        var newKey17 = prompt('请输入新的按键', currentKey17);

        // 验证输入值是否为空或非法
        if (newKey17 !== null && newKey17.trim() !== '') {
            // 更新 localStorage 中的按键值
            setStoredKeytishikuang(newKey17);
            alert('提示框按键已更新为: ' + newKey17);
        } else {
            alert('请输入有效的按键值');
        }
    });


    // 在悬浮框内创建第六个容器
    var innerDiv17 = document.createElement('div');
    innerDiv17.id = 'innerDiv17';
    innerDiv17.style.width = '30px';
    innerDiv17.style.height = '22px';
    innerDiv17.style.position = 'absolute';
    innerDiv17.style.top = '55px';
    innerDiv17.style.right = '302px';

    draggableDiv.appendChild(innerDiv17);

    var buttonlian = document.createElement('button');
    buttonlian.style.width = '100%';
    buttonlian.style.height = '100%';
    buttonlian.style.backgroundColor = '#f0ad4e'; // 橙色背景
    buttonlian.style.color = '#ffffff'; // 白色字体
    buttonlian.style.fontSize = '13px'; // 14号字体
    buttonlian.style.borderRadius = '5px'; // 圆角矩形
    buttonlian.textContent = '机审'; // 按钮文本内容
    buttonlian.dataset.option = '1'; // 自定义属性用于存储选项值


    // 将按钮添加到第9个内部容器
    innerDiv17.appendChild(buttonlian);

    buttonfuhe.addEventListener('click', function() {
        // 切换界面的显示状态
        if (isFloatingPageVisible) {
            adraggableDiv.style.display = 'none';
            isFloatingPageVisible = false;
        } else {
            adraggableDiv.style.display = 'block';
            isFloatingPageVisible = true;
        }
    });
    var isFloatingPageVisible = false;
    // 创建悬浮框
    var adraggableDiv = document.createElement('div');
    adraggableDiv.id = 'draggable';
    adraggableDiv.style.width = '300px';
    adraggableDiv.style.height = '360px';
    adraggableDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    adraggableDiv.style.color = '#fff';
    adraggableDiv.style.padding = '10px';
    adraggableDiv.style.borderRadius = '5px';
    adraggableDiv.style.position = 'fixed';
    adraggableDiv.style.left = '560px';
    adraggableDiv.style.top = '77px';
    adraggableDiv.style.zIndex = '9998';
    adraggableDiv.style.cursor = 'move';
    adraggableDiv.style.display = 'none';

    // 让浮动页面可拖动
    var isDragging = false;
    var startPosX, startPosY;

    adraggableDiv.addEventListener('mousedown', function(e) {
        isDragging = true;
        startPosX = e.clientX - adraggableDiv.offsetLeft;
        startPosY = e.clientY - adraggableDiv.offsetTop;
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            adraggableDiv.style.left = e.clientX - startPosX + 'px';
            adraggableDiv.style.top = e.clientY - startPosY + 'px';
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });



    // 将悬浮框添加到页面
    document.body.appendChild(adraggableDiv);


    // 创建悬浮框元素
    var tishikuang = document.createElement('div');
    tishikuang.id = 'tishikuang';
    tishikuang.style.position = 'fixed';
    tishikuang.style.width = '90%'; // 将宽度设为屏幕宽度的50%
    tishikuang.style.height = '25%'; // 将高度设为屏幕高度的30%
    tishikuang.style.background = 'gray';
    tishikuang.style.opacity = '0.8';
    tishikuang.style.display = 'none';
    tishikuang.style.zIndex = '9999';
    tishikuang.style.left = '25%'; // 将left设为屏幕宽度的25%
    tishikuang.style.top = '70%'; // 将top设为屏幕高度的70%
    tishikuang.style.transform = 'translate(-22%, -10%)'; // 使用transform来使悬浮框居中
    document.body.appendChild(tishikuang);


    // 创建容器元素
    var tishikuangfenzhi01 = document.createElement('div');
    tishikuangfenzhi01.id = 'tishikuangfenzhi01';
    tishikuangfenzhi01.style.width = '8%';
    tishikuangfenzhi01.style.height = '86%';
    tishikuangfenzhi01.style.position = 'absolute';
    tishikuangfenzhi01.style.background = 'lightgreen';
    tishikuangfenzhi01.style.zIndex = '10000';
    tishikuangfenzhi01.style.top = '10px';
    tishikuangfenzhi01.style.left = '1%';
    // 将容器元素放入悬浮框中
    tishikuang.appendChild(tishikuangfenzhi01);

    // 创建容器元素
    var tishikuangfenzhi02 = document.createElement('div');
    tishikuangfenzhi02.id = 'tishikuangfenzhi02';
    tishikuangfenzhi02.style.width = '8%';
    tishikuangfenzhi02.style.height = '86%';
    tishikuangfenzhi02.style.position = 'absolute';
    tishikuangfenzhi02.style.background = 'lightgreen';
    tishikuangfenzhi02.style.zIndex = '10000';
    tishikuangfenzhi02.style.top = '10px';
    tishikuangfenzhi02.style.left = '10%';
    // 将容器元素放入悬浮框中
    tishikuang.appendChild(tishikuangfenzhi02);

    // 创建容器元素
    var tishikuangfenzhi03 = document.createElement('div');
    tishikuangfenzhi03.id = 'tishikuangfenzhi03';
    tishikuangfenzhi03.style.width = '8%';
    tishikuangfenzhi03.style.height = '86%';
    tishikuangfenzhi03.style.position = 'absolute';
    tishikuangfenzhi03.style.background = 'lightgreen';
    tishikuangfenzhi03.style.zIndex = '10000';
    tishikuangfenzhi03.style.top = '10px';
    tishikuangfenzhi03.style.left = '19%';
    // 将容器元素放入悬浮框中
    tishikuang.appendChild(tishikuangfenzhi03);

    // 创建容器元素
    var tishikuangfenzhi04 = document.createElement('div');
    tishikuangfenzhi04.id = 'tishikuangfenzhi04';
    tishikuangfenzhi04.style.width = '8%';
    tishikuangfenzhi04.style.height = '86%';
    tishikuangfenzhi04.style.position = 'absolute';
    tishikuangfenzhi04.style.background = 'lightgreen';
    tishikuangfenzhi04.style.zIndex = '10000';
    tishikuangfenzhi04.style.top = '10px';
    tishikuangfenzhi04.style.left = '28%';
    // 将容器元素放入悬浮框中
    tishikuang.appendChild(tishikuangfenzhi04);

    // 创建容器元素
    var tishikuangfenzhi05 = document.createElement('div');
    tishikuangfenzhi05.id = 'tishikuangfenzhi05';
    tishikuangfenzhi05.style.width = '8%';
    tishikuangfenzhi05.style.height = '86%';
    tishikuangfenzhi05.style.position = 'absolute';
    tishikuangfenzhi05.style.background = 'lightgreen';
    tishikuangfenzhi05.style.zIndex = '10000';
    tishikuangfenzhi05.style.top = '10px';
    tishikuangfenzhi05.style.left = '37%';
    // 将容器元素放入悬浮框中
    tishikuang.appendChild(tishikuangfenzhi05);

    // 创建容器元素
    var tishikuangfenzhi06 = document.createElement('div');
    tishikuangfenzhi06.id = 'tishikuangfenzhi06';
    tishikuangfenzhi06.style.width = '8%';
    tishikuangfenzhi06.style.height = '86%';
    tishikuangfenzhi06.style.position = 'absolute';
    tishikuangfenzhi06.style.background = 'lightgreen';
    tishikuangfenzhi06.style.zIndex = '10000';
    tishikuangfenzhi06.style.top = '10px';
    tishikuangfenzhi06.style.left = '46%';
    // 将容器元素放入悬浮框中
    tishikuang.appendChild(tishikuangfenzhi06);

    // 创建容器元素
    var tishikuangfenzhi07 = document.createElement('div');
    tishikuangfenzhi07.id = 'tishikuangfenzhi07';
    tishikuangfenzhi07.style.width = '8%';
    tishikuangfenzhi07.style.height = '86%';
    tishikuangfenzhi07.style.position = 'absolute';
    tishikuangfenzhi07.style.background = 'lightgreen';
    tishikuangfenzhi07.style.zIndex = '10000';
    tishikuangfenzhi07.style.top = '10px';
    tishikuangfenzhi07.style.left = '55%';
    // 将容器元素放入悬浮框中
    tishikuang.appendChild(tishikuangfenzhi07);

    // 创建容器元素
    var tishikuangfenzhi08 = document.createElement('div');
    tishikuangfenzhi08.id = 'tishikuangfenzhi08';
    tishikuangfenzhi08.style.width = '8%';
    tishikuangfenzhi08.style.height = '86%';
    tishikuangfenzhi08.style.position = 'absolute';
    tishikuangfenzhi08.style.background = 'lightgreen';
    tishikuangfenzhi08.style.zIndex = '10000';
    tishikuangfenzhi08.style.top = '10px';
    tishikuangfenzhi08.style.left = '64%';
    // 将容器元素放入悬浮框中
    tishikuang.appendChild(tishikuangfenzhi08);

    // 创建容器元素
    var tishikuangfenzhi09 = document.createElement('div');
    tishikuangfenzhi09.id = 'tishikuangfenzhi09';
    tishikuangfenzhi09.style.width = '8%';
    tishikuangfenzhi09.style.height = '86%';
    tishikuangfenzhi09.style.position = 'absolute';
    tishikuangfenzhi09.style.background = 'lightgreen';
    tishikuangfenzhi09.style.zIndex = '10000';
    tishikuangfenzhi09.style.top = '10px';
    tishikuangfenzhi09.style.left = '73%';
    // 将容器元素放入悬浮框中
    tishikuang.appendChild(tishikuangfenzhi09);

    // 创建容器元素
    var tishikuangfenzhi10 = document.createElement('div');
    tishikuangfenzhi10.id = 'tishikuangfenzhi10';
    tishikuangfenzhi10.style.width = '8%';
    tishikuangfenzhi10.style.height = '86%';
    tishikuangfenzhi10.style.position = 'absolute';
    tishikuangfenzhi10.style.background = 'lightgreen';
    tishikuangfenzhi10.style.zIndex = '10000';
    tishikuangfenzhi10.style.top = '10px';
    tishikuangfenzhi10.style.left = '82%';
    // 将容器元素放入悬浮框中
    tishikuang.appendChild(tishikuangfenzhi10);

    // 创建容器元素
    var tishikuangfenzhi11 = document.createElement('div');
    tishikuangfenzhi11.id = 'tishikuangfenzhi11';
    tishikuangfenzhi11.style.width = '8%';
    tishikuangfenzhi11.style.height = '86%';
    tishikuangfenzhi11.style.position = 'absolute';
    tishikuangfenzhi11.style.background = 'lightgreen';
    tishikuangfenzhi11.style.zIndex = '10000';
    tishikuangfenzhi11.style.top = '10px';
    tishikuangfenzhi11.style.left = '91%';
    // 将容器元素放入悬浮框中
    tishikuang.appendChild(tishikuangfenzhi11);

    var fenzhitextSpan01= document.createElement('span');
    fenzhitextSpan01.textContent = '开头竞品'
    fenzhitextSpan01.style.position = 'absolute';
    fenzhitextSpan01.style.top = '15%';
    fenzhitextSpan01.style.left = '0%';
    fenzhitextSpan01.style.color = '#00000'; // 白色字体
    fenzhitextSpan01.style.fontSize = '15px'; // 14号字体
    fenzhitextSpan01.style.left = '50%';
    fenzhitextSpan01.style.transform = 'translateX(-50%)';
    tishikuangfenzhi01.appendChild(fenzhitextSpan01);

    var fenzhidataSpan01= document.createElement('span');
    fenzhidataSpan01.textContent = '当前为【1】';
    fenzhidataSpan01.id = '01';
    fenzhidataSpan01.style.position = 'absolute';
    fenzhidataSpan01.style.top = '40%';
    fenzhidataSpan01.style.left = '0%';
    fenzhidataSpan01.style.color = '#00000'; // 白色字体
    fenzhidataSpan01.style.fontSize = '15px'; // 14号字体
    fenzhidataSpan01.style.left = '50%';
    fenzhidataSpan01.style.transform = 'translateX(-50%)';
    tishikuangfenzhi01.appendChild(fenzhidataSpan01);

    var fenzhitextSpan02= document.createElement('span');
    fenzhitextSpan02.textContent = '结尾竞品'
    fenzhitextSpan02.style.position = 'absolute';
    fenzhitextSpan02.style.top = '15%';
    fenzhitextSpan02.style.left = '0%';
    fenzhitextSpan02.style.color = '#00000'; // 白色字体
    fenzhitextSpan02.style.fontSize = '15px'; // 14号字体
    fenzhitextSpan02.style.left = '50%';
    fenzhitextSpan02.style.transform = 'translateX(-50%)';
    tishikuangfenzhi02.appendChild(fenzhitextSpan02);

    var fenzhidataSpan02= document.createElement('span');
    fenzhidataSpan02.textContent = '当前为【2】';
    fenzhidataSpan02.id = '02';
    fenzhidataSpan02.style.position = 'absolute';
    fenzhidataSpan02.style.top = '40%';
    fenzhidataSpan02.style.left = '0%';
    fenzhidataSpan02.style.color = '#00000'; // 白色字体
    fenzhidataSpan02.style.fontSize = '15px'; // 14号字体
    fenzhidataSpan02.style.left = '50%';
    fenzhidataSpan02.style.transform = 'translateX(-50%)';
    tishikuangfenzhi02.appendChild(fenzhidataSpan02);

    var fenzhitextSpan03= document.createElement('span');
    fenzhitextSpan03.textContent = '劣迹艺人'
    fenzhitextSpan03.style.position = 'absolute';
    fenzhitextSpan03.style.top = '15%';
    fenzhitextSpan03.style.left = '0%';
    fenzhitextSpan03.style.color = '#00000'; // 白色字体
    fenzhitextSpan03.style.fontSize = '15px'; // 14号字体
    fenzhitextSpan03.style.left = '50%';
    fenzhitextSpan03.style.transform = 'translateX(-50%)';
    tishikuangfenzhi03.appendChild(fenzhitextSpan03);

    var fenzhidataSpan03= document.createElement('span');
    fenzhidataSpan03.textContent = '当前为【3】';
    fenzhidataSpan03.id = '03';
    fenzhidataSpan03.style.position = 'absolute';
    fenzhidataSpan03.style.top = '40%';
    fenzhidataSpan03.style.left = '0%';
    fenzhidataSpan03.style.color = '#00000'; // 白色字体
    fenzhidataSpan03.style.fontSize = '15px'; // 14号字体
    fenzhidataSpan03.style.left = '50%';
    fenzhidataSpan03.style.transform = 'translateX(-50%)';
    tishikuangfenzhi03.appendChild(fenzhidataSpan03);

    var fenzhitextSpan04= document.createElement('span');
    fenzhitextSpan04.textContent = '广告推广'
    fenzhitextSpan04.style.position = 'absolute';
    fenzhitextSpan04.style.top = '15%';
    fenzhitextSpan04.style.left = '0%';
    fenzhitextSpan04.style.color = '#00000'; // 白色字体
    fenzhitextSpan04.style.fontSize = '15px'; // 14号字体
    fenzhitextSpan04.style.left = '50%';
    fenzhitextSpan04.style.transform = 'translateX(-50%)';
    tishikuangfenzhi04.appendChild(fenzhitextSpan04);

    var fenzhidataSpan04= document.createElement('span');
    fenzhidataSpan04.textContent = '当前为【4】';
    fenzhidataSpan04.id = '04';
    fenzhidataSpan04.style.position = 'absolute';
    fenzhidataSpan04.style.top = '40%';
    fenzhidataSpan04.style.left = '0%';
    fenzhidataSpan04.style.color = '#00000'; // 白色字体
    fenzhidataSpan04.style.fontSize = '15px'; // 14号字体
    fenzhidataSpan04.style.left = '50%';
    fenzhidataSpan04.style.transform = 'translateX(-50%)';
    tishikuangfenzhi04.appendChild(fenzhidataSpan04);

    var fenzhitextSpan05= document.createElement('span');
    fenzhitextSpan05.textContent = '无资质'
    fenzhitextSpan05.style.position = 'absolute';
    fenzhitextSpan05.style.top = '15%';
    fenzhitextSpan05.style.left = '0%';
    fenzhitextSpan05.style.color = '#00000'; // 白色字体
    fenzhitextSpan05.style.fontSize = '15px'; // 14号字体
    fenzhitextSpan05.style.left = '50%';
    fenzhitextSpan05.style.transform = 'translateX(-50%)';
    tishikuangfenzhi05.appendChild(fenzhitextSpan05);

    var fenzhidataSpan05= document.createElement('span');
    fenzhidataSpan05.textContent = '当前为【5】';
    fenzhidataSpan05.id = '05';
    fenzhidataSpan05.style.position = 'absolute';
    fenzhidataSpan05.style.top = '40%';
    fenzhidataSpan05.style.left = '0%';
    fenzhidataSpan05.style.color = '#00000'; // 白色字体
    fenzhidataSpan05.style.fontSize = '15px'; // 14号字体
    fenzhidataSpan05.style.left = '50%';
    fenzhidataSpan05.style.transform = 'translateX(-50%)';
    tishikuangfenzhi05.appendChild(fenzhidataSpan05);


    var fenzhitextSpan06= document.createElement('span');
    fenzhitextSpan06.textContent = '低俗引导'
    fenzhitextSpan06.style.position = 'absolute';
    fenzhitextSpan06.style.top = '15%';
    fenzhitextSpan06.style.left = '0%';
    fenzhitextSpan06.style.color = '#00000'; // 白色字体
    fenzhitextSpan06.style.fontSize = '15px'; // 14号字体
    fenzhitextSpan06.style.left = '50%';
    fenzhitextSpan06.style.transform = 'translateX(-50%)';
    tishikuangfenzhi06.appendChild(fenzhitextSpan06);

    var fenzhidataSpan06= document.createElement('span');
    fenzhidataSpan06.textContent = '当前为【6】';
    fenzhidataSpan06.id = '06';
    fenzhidataSpan06.style.position = 'absolute';
    fenzhidataSpan06.style.top = '40%';
    fenzhidataSpan06.style.left = '0%';
    fenzhidataSpan06.style.color = '#00000'; // 白色字体
    fenzhidataSpan06.style.fontSize = '15px'; // 14号字体
    fenzhidataSpan06.style.left = '50%';
    fenzhidataSpan06.style.transform = 'translateX(-50%)';
    tishikuangfenzhi06.appendChild(fenzhidataSpan06);



    var fenzhitextSpan07= document.createElement('span');
    fenzhitextSpan07.textContent = '违禁影片'
    fenzhitextSpan07.style.position = 'absolute';
    fenzhitextSpan07.style.top = '15%';
    fenzhitextSpan07.style.left = '0%';
    fenzhitextSpan07.style.color = '#00000'; // 白色字体
    fenzhitextSpan07.style.fontSize = '15px'; // 14号字体
    fenzhitextSpan07.style.left = '50%';
    fenzhitextSpan07.style.transform = 'translateX(-50%)';
    tishikuangfenzhi07.appendChild(fenzhitextSpan07);

    var fenzhidataSpan07= document.createElement('span');
    fenzhidataSpan07.textContent = '当前为【7】';
    fenzhidataSpan07.id = '07';
    fenzhidataSpan07.style.position = 'absolute';
    fenzhidataSpan07.style.top = '40%';
    fenzhidataSpan07.style.left = '0%';
    fenzhidataSpan07.style.color = '#00000'; // 白色字体
    fenzhidataSpan07.style.fontSize = '15px'; // 14号字体
    fenzhidataSpan07.style.left = '50%';
    fenzhidataSpan07.style.transform = 'translateX(-50%)';
    tishikuangfenzhi07.appendChild(fenzhidataSpan07);



    var fenzhitextSpan08= document.createElement('span');
    fenzhitextSpan08.textContent = '未成年'
    fenzhitextSpan08.style.position = 'absolute';
    fenzhitextSpan08.style.top = '15%';
    fenzhitextSpan08.style.left = '0%';
    fenzhitextSpan08.style.color = '#00000'; // 白色字体
    fenzhitextSpan08.style.fontSize = '15px'; // 14号字体
    fenzhitextSpan08.style.left = '50%';
    fenzhitextSpan08.style.transform = 'translateX(-50%)';
    tishikuangfenzhi08.appendChild(fenzhitextSpan08);

    var fenzhidataSpan08= document.createElement('span');
    fenzhidataSpan08.textContent = '当前为【8】';
    fenzhidataSpan08.id = '08';
    fenzhidataSpan08.style.position = 'absolute';
    fenzhidataSpan08.style.top = '40%';
    fenzhidataSpan08.style.left = '0%';
    fenzhidataSpan08.style.color = '#00000'; // 白色字体
    fenzhidataSpan08.style.fontSize = '15px'; // 14号字体
    fenzhidataSpan08.style.left = '50%';
    fenzhidataSpan08.style.transform = 'translateX(-50%)';
    tishikuangfenzhi08.appendChild(fenzhidataSpan08);


    var fenzhitextSpan09= document.createElement('span');
    fenzhitextSpan09.textContent = '纯色背景'
    fenzhitextSpan09.style.position = 'absolute';
    fenzhitextSpan09.style.top = '15%';
    fenzhitextSpan09.style.left = '40%';
    fenzhitextSpan09.style.color = '#00000'; // 白色字体
    fenzhitextSpan09.style.fontSize = '15px'; // 14号字体
    fenzhitextSpan09.style.left = '50%';
    fenzhitextSpan09.style.transform = 'translateX(-50%)';
    tishikuangfenzhi09.appendChild(fenzhitextSpan09);

    var fenzhidataSpan09= document.createElement('span');
    fenzhidataSpan09.textContent = '当前为【9】';
    fenzhidataSpan09.id = '08';
    fenzhidataSpan09.style.position = 'absolute';
    fenzhidataSpan09.style.top = '40%';
    fenzhidataSpan09.style.left = '0%';
    fenzhidataSpan09.style.color = '#00000'; // 白色字体
    fenzhidataSpan09.style.fontSize = '15px'; // 14号字体
    fenzhidataSpan09.style.left = '50%';
    fenzhidataSpan09.style.transform = 'translateX(-50%)';
    tishikuangfenzhi09.appendChild(fenzhidataSpan09);



    var fenzhitextSpan10= document.createElement('span');
    fenzhitextSpan10.textContent = '未定性'
    fenzhitextSpan10.style.position = 'absolute';
    fenzhitextSpan10.style.top = '15%';
    fenzhitextSpan10.style.left = '0%';
    fenzhitextSpan10.style.color = '#00000'; // 白色字体
    fenzhitextSpan10.style.fontSize = '15px'; // 14号字体
    fenzhitextSpan10.style.left = '50%';
    fenzhitextSpan10.style.transform = 'translateX(-50%)';
    tishikuangfenzhi10.appendChild(fenzhitextSpan10);

    var fenzhidataSpan10= document.createElement('span');
    fenzhidataSpan10.textContent = '当前为【0】';
    fenzhidataSpan10.id = '08';
    fenzhidataSpan10.style.position = 'absolute';
    fenzhidataSpan10.style.top = '40%';
    fenzhidataSpan10.style.left = '0%';
    fenzhidataSpan10.style.color = '#00000'; // 白色字体
    fenzhidataSpan10.style.fontSize = '15px'; // 14号字体
    fenzhidataSpan10.style.left = '50%';
    fenzhidataSpan10.style.transform = 'translateX(-50%)';
    tishikuangfenzhi10.appendChild(fenzhidataSpan10);

    var fenzhitextSpan11= document.createElement('span');
    fenzhitextSpan11.textContent = '已定性'
    fenzhitextSpan11.style.position = 'absolute';
    fenzhitextSpan11.style.top = '15%';
    fenzhitextSpan11.style.left = '0%';
    fenzhitextSpan11.style.color = '#00000'; // 白色字体
    fenzhitextSpan11.style.fontSize = '15px'; // 14号字体
    fenzhitextSpan11.style.left = '50%';
    fenzhitextSpan11.style.transform = 'translateX(-50%)';
    tishikuangfenzhi11.appendChild(fenzhitextSpan11);

    var fenzhidataSpan11= document.createElement('span');
    fenzhidataSpan11.textContent = '当前为【-】';
    fenzhidataSpan11.id = '11';
    fenzhidataSpan11.style.position = 'absolute';
    fenzhidataSpan11.style.top = '40%';
    fenzhidataSpan11.style.left = '0%';
    fenzhidataSpan11.style.color = '#00000'; // 白色字体
    fenzhidataSpan11.style.fontSize = '15px'; // 14号字体
    fenzhidataSpan11.style.left = '50%';
    fenzhidataSpan11.style.transform = 'translateX(-50%)';
    tishikuangfenzhi11.appendChild(fenzhidataSpan11);


    let timer;
    // 监听Alt键按下和松开事件
    var isAltPressed = false;

    document.addEventListener('keydown', function(event) {

        var storedKeytishikuang = getStoredKeytishikuang();
        if (event.key === storedKeytishikuang) {
            isAltPressed = true;

            var duqushujuKey01 = getStoredKeykaitoujingpin();
            var duqushujuKey02 = getStoredKeyjieweijingpin();
            var duqushujuKey03 = getStoredKeyliejiyiren();
            var duqushujuKey04 = getStoredKeyguanggaotuiguang();
            var duqushujuKey05 = getStoredKeywuzizi();
            var duqushujuKey06 = getStoredKeydisu();
            var duqushujuKey07 = getStoredKeyweijinpian();
            var duqushujuKey08 = getStoredKeywcn();
            var duqushujuKey09 = getStoredKeychunsebeijing();
            var duqushujuKey10 = getStoredKeyweidingxing();
            var duqushujuKey11 = getStoredKeyyidingxing();


            // 更新 dataSpan05 的值
            if (duqushujuKey01) {
                fenzhidataSpan01.textContent = '当前为【' + duqushujuKey01 + '】';
                fenzhidataSpan01.id = duqushujuKey01;
            }

            // 更新 dataSpan05 的值
            if (duqushujuKey02) {
                fenzhidataSpan02.textContent = '当前为【' + duqushujuKey02 + '】';
                fenzhidataSpan02.id = duqushujuKey02;
            }

            // 更新 dataSpan05 的值
            if (duqushujuKey03) {
                fenzhidataSpan03.textContent = '当前为【' + duqushujuKey03 + '】';
                fenzhidataSpan03.id = duqushujuKey03;
            }



            // 更新 dataSpan05 的值
            if (duqushujuKey04) {
                fenzhidataSpan04.textContent = '当前为【' + duqushujuKey04 + '】';
                fenzhidataSpan04.id = duqushujuKey04;
            }



            // 更新 dataSpan05 的值
            if (duqushujuKey05) {
                fenzhidataSpan05.textContent = '当前为【' + duqushujuKey05 + '】';
                fenzhidataSpan05.id = duqushujuKey05;
            }



            // 更新 dataSpan05 的值
            if (duqushujuKey06) {
                fenzhidataSpan06.textContent = '当前为【' + duqushujuKey06 + '】';
                fenzhidataSpan06.id = duqushujuKey06;
            }



            // 更新 dataSpan05 的值
            if (duqushujuKey07) {
                fenzhidataSpan07.textContent = '当前为【' + duqushujuKey07 + '】';
                fenzhidataSpan07.id = duqushujuKey07;
            }



            // 更新 dataSpan05 的值
            if (duqushujuKey08) {
                fenzhidataSpan08.textContent = '当前为【' + duqushujuKey08 + '】';
                fenzhidataSpan08.id = duqushujuKey08;
            }



            // 更新 dataSpan05 的值
            if (duqushujuKey09) {
                fenzhidataSpan09.textContent = '当前为【' + duqushujuKey09 + '】';
                fenzhidataSpan09.id = duqushujuKey09;
            }



            // 更新 dataSpan05 的值
            if (duqushujuKey10) {
                fenzhidataSpan10.textContent = '当前为【' + duqushujuKey10 + '】';
                fenzhidataSpan10.id = duqushujuKey10;
            }


            // 更新 dataSpan05 的值
            if (duqushujuKey01) {
                fenzhidataSpan11.textContent = '当前为【' + duqushujuKey11 + '】';
                fenzhidataSpan11.id = duqushujuKey11;
            }

            tishikuang.style.display = 'block';

            // 监听全局按键事件，当按下非Alt键时隐藏悬浮框
            document.addEventListener('keydown', function(e) {

                var storedKeytishikuang = getStoredKeytishikuang();

                if (e.key !== storedKeytishikuang) {
                    isAltPressed = false;
                    tishikuang.style.display = 'none';
                }
            });
        }
    });

    document.addEventListener('keyup', function(event) {

        var storedKeytishikuang = getStoredKeytishikuang();

        if (event.key === storedKeytishikuang) {
            isAltPressed = false;
            tishikuang.style.display = 'none';

            // 移除全局按键事件监听
            document.removeEventListener('keydown', function(e) {

                var storedKeytishikuang = getStoredKeytishikuang();
                if (e.key !== storedKeytishikuang) {
                    isAltPressed = false;
                    tishikuang.style.display = 'none';
                }
            });
        }
    });

    // 禁止默认的Alt键行为（避免浏览器菜单弹出）
    document.addEventListener('keydown', function(event) {

        var storedKeytishikuang = getStoredKeytishikuang();
        if (event.key === storedKeytishikuang) {
            event.preventDefault();
        }
    });



    // 创建一个154x352的容器
    var innerContainer = document.createElement('div');
    innerContainer.style.width = '120px';
    innerContainer.style.height = '325px';
    innerContainer.style.position = 'absolute';
    innerContainer.style.left = '10px';
    innerContainer.style.top = '10px';

    // 将容器放进悬浮框里
    adraggableDiv.appendChild(innerContainer);

    var textInput = document.createElement('textarea');
    textInput.style.width = '118px';
    textInput.style.height = '300px';
    textInput.style.resize = 'none';
    textInput.style.border = 'none';
    textInput.style.padding = '10px';
    textInput.style.fontSize = '16px';
    textInput.style.left = '10px';
    textInput.style.top = '10px';
    textInput.placeholder = '输入或者复制媒资ID到此处...';
    innerContainer.appendChild(textInput);

    textInput.onmousedown = function(e) {
        e.stopPropagation();
    };




    var innerDivA = document.createElement('div');
    innerDivA.id = 'innerContainera';
    innerDivA.style.width = '76px';
    innerDivA.style.height = '22px';
    innerDivA.style.position = 'absolute';
    innerDivA.style.top = '337px';
    innerDivA.style.left = '72px';


    adraggableDiv.appendChild(innerDivA);


    var buttonzhuan = document.createElement('button');
    buttonzhuan.style.width = '100%';
    buttonzhuan.style.height = '100%';
    buttonzhuan.style.backgroundColor = '#007bff'; // 红色背景
    buttonzhuan.style.color = '#ffffff'; // 白色字体
    buttonzhuan.style.fontSize = '13px'; // 14号字体
    buttonzhuan.style.borderRadius = '5px'; // 圆角矩形
    buttonzhuan.textContent = '转换链接'; // 按钮文本内容


    innerDivA.appendChild(buttonzhuan);


    var innerDivB = document.createElement('div');
    innerDivB.id = 'innerContainerb';
    innerDivA.style.width = '76px';
    innerDivB.style.height = '22px';
    innerDivB.style.position = 'absolute';
    innerDivB.style.top = '337px';
    innerDivB.style.left = '10px';

    // 将第六个内部容器添加到悬浮框
    adraggableDiv.appendChild(innerDivB);


    var buttonbian = document.createElement('button');
    buttonbian.style.height = '100%';
    buttonbian.style.backgroundColor = '#007bff'; // 红色背景
    buttonbian.style.color = '#ffffff'; // 白色字体
    buttonbian.style.fontSize = '13px'; // 14号字体
    buttonbian.style.borderRadius = '5px'; // 圆角矩形
    buttonbian.textContent = '清除记录'; // 按钮文本内容


    innerDivB.appendChild(buttonbian);

    buttonbian.addEventListener('click', function() {
        // 清除输入框内容
        textInput.value = '';

        // 清除innerContainera里的所有按钮
        while (innerContainera.firstChild) {
            innerContainera.removeChild(innerContainera.firstChild);
        }
    });


    // 创建一个154x352的容器
    var innerContainera = document.createElement('div');
    innerContainera.style.width = '120px';
    innerContainera.style.height = '325px';
    innerContainera.style.position = 'absolute';
    innerContainera.style.left = '160px';
    innerContainera.style.top = '10px';
    innerContainera.style.border = '2px solid #ffffff'; // #ffffff 表示白色

    // 将容器放进悬浮框里
    adraggableDiv.appendChild(innerContainera);

    // 创建打开链接的函数
    function openLink(linkUrl, linkButton) {
        return function() {
            window.open(linkUrl, '_blank');
            // 将当前点击的按钮变成红色
            linkButton.style.backgroundColor = '#ff0000'; // 红色背景
        };
    }

    // 按钮点击事件处理
    buttonzhuan.addEventListener('click', async function() {
        var inputText = textInput.value.trim();
        var assetIds = inputText.split('\n').map(id => id.trim());

        if (inputText === '' || assetIds.length > 10) {
            alert("输入数据不能为空并且不能超过10个");
            return;
        }

        for (let i = 0; i < assetIds.length; i++) {
            await createLinkButton(assetIds[i]);
        }
    });
    async function createLinkButton(assetId) {
        var jsonData3 = {
            "aiAuditStatus": "",
            "aisleEndTime": "",
            "aisleId": "",
            "aisleStartTime": "",
            "assetId": assetId,
            "auditor": "",
            "auditStatus": 0,
            "auditType": "",
            "author": "",
            "collectEndTime": "",
            "collectStartTime": "",
            "costTime": "",
            "createTimeEndTime": "",
            "createTimeStartTime": "",
            "displayName": "",
            "endTime": "",
            "exclusiveKeyword": "",
            "keywords": "",
            "labelId": "",
            "location": "2",
            "MD5": "",
            "mediumStatus": "",
            "occurred": "",
            "otherKeyword": "",
            "pageNum": 1,
            "pageSize": 100,
            "riskList": [],
            "secondClassCode": "",
            "startTime": "",
            "thirdClassCode": "",
            "titleKeyword": "",
            "userId": "",
            "userRiskList": [],
            "videoType": ""

        };


        return new Promise(resolve => {
            searchDatasa(jsonData3, resolve, assetId);
        });
    }

    function searchDatasa(jsonData3, resolve, assetId) {
        var jsonString = JSON.stringify(jsonData3);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', queryContentListUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);

                    if (response.data && response.data.dataList && Array.isArray(response.data.dataList)) {
                        response.data.dataList.forEach(function(item) {
                            var assetId = item.assetId;
                            var author = item.author;
                            var aisleId = item.aisleId;
                            var linkUrl = `https://oes-coss.miguvideo.com:1443/oes-csas-web/index.html#/assetInfo/single/${assetId}?author=${author}&assetId=${assetId}&queryAudit=2&videoType=1&aisleId=${aisleId}&auditStatus=1`;

                            var linkButton = document.createElement('a');
                            linkButton.textContent = `${assetId}`;
                            linkButton.style.display = 'block';
                            linkButton.style.marginTop = '10px';
                            linkButton.style.padding = '5px';
                            linkButton.style.backgroundColor = '#ffffff';
                            linkButton.style.textAlign = 'center';
                            linkButton.style.color = '#000000';
                            linkButton.style.fontSize = '13px';

                            linkButton.addEventListener('click', openLink(linkUrl, linkButton));// 传递 linkButton 给 openLink 函数

                            innerContainera.appendChild(linkButton);
                        });
                        resolve(); // 异步请求返回后调用 resolve 函数
                    } else {
                        console.error("Invalid or missing dataList in the response:", response);
                        resolve(); // 出错时也要调用 resolve
                    }
                } else {
                    console.error("Failed to retrieve data. Status:", xhr.status);
                    resolve(); // 出错时也要调用 resolve
                }
            }
        };

        xhr.send(jsonString);
    }


    // 人物库链接Get
    var renWuKuUrl = 'https://oes-coss.miguvideo.com:1443/oes-csas-words/figure/learn/findByPage?size=500&';
    searchButton.addEventListener('click', async function() {
        var searchQuery = searchInput.value;
        if (searchQuery && isNaN(searchQuery)) {
            var encodedSearchQuery = encodeURIComponent(searchQuery);
            var searchUrl = renWuKuUrl + 'name=' + encodedSearchQuery + '&current=1';
            var renWuKuResult = await getContent(searchUrl);
            var renWuKuData = renWuKuResult.data;
            if (renWuKuData && renWuKuData.records && renWuKuData.records.length > 0) {
                var data = renWuKuData.records[0];
                var displayName = data.name + '<br>' + data.genre + '<br>' + data.controlDescription + '<br> ' + data.worksAndProgrammes;
                createModalssw(displayName);
            } else {
                var noResultDisplayDiv = document.createElement('div');
                noResultDisplayDiv.style.color = '#fff';
                noResultDisplayDiv.textContent = '无结果';
                createModalssw('无结果');

            }
        }
    });

    // 创建带样式的模态框
    function createModalssw(displayName) {
        var modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = 0;
        modal.style.left = 0;
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';

        var styledContent = '<div style="font-weight:bold; font-size:20px; white-space: pre-line;">' + displayName + '</div>';

        var textDiv = document.createElement('div');
        textDiv.innerHTML = styledContent;
        textDiv.style.width = '30%';
        textDiv.style.height = '30%';
        textDiv.style.padding = '20px';
        textDiv.style.backgroundColor = '#fff';

        modal.appendChild(textDiv);

        // 添加底部提示文字
        var bottomText = document.createElement('div');
        bottomText.innerText = '点击任意区域关闭此提示';
        bottomText.style.position = 'absolute';
        bottomText.style.bottom = '10px';
        bottomText.style.color = 'red';
        bottomText.style.cursor = 'pointer';


        modal.appendChild(bottomText);

        document.body.appendChild(modal);

        // 点击模态框外部或底部文字关闭模态框
        modal.addEventListener('click', function(e) {
            if (e.target === modal || e.target === bottomText) {
                modal.remove();
            }
        });
        // 按空格键关闭模态框
        function handleKeyPress(e) {
            if (e.key === ' ') {
                modal.remove();
            }
        }

        // 监听键盘事件
        document.addEventListener('keydown', handleKeyPress);
    }


    // 获取人物库信息
    async function getRenWuKus(url) {
        var renWuKuResult = await getContent(url);
        var renWuKuData = renWuKuResult.data;
        var pageSize = renWuKuData.pageSize;
        var pages = renWuKuData.pages;

        // 判断AI质检结果及文本结果是否存在
        if (renWuKuData && renWuKuData.records) {
            // 页循环
            for (var i = 1; i <= pages; i++) {
                var renWuKuResultAll = await getContent(url + '&current=' + i);
                var renWuKuDataAll = renWuKuResultAll.data;
                var records = renWuKuDataAll.records;

                for (var j = 0; j < records.length; j++) {
                    var data = records[j];
                    // 劣迹艺人ID
                    const intro_id = data.id;
                    // 人物名称
                    const name = data.name;
                    // 人物曾用名
                    const alias = data.formerName;
                    // 国籍
                    const country_region = data.country;
                    // 类型
                    const type = data.genre;
                    // 劣迹问题
                    const violations = data.badProblem;
                    // 管控描述
                    const control_description = data.controlDescription;
                    // 代表节目
                    const notable_works = data.worksAndProgrammes;
                    // 创建时间
                    const control_date = data.created;
                }
            }
        }
    }

    //人物库
    // 绑定搜索按钮点击事件
    searchButtonCopy.addEventListener('click', async function() {

        var searchQueryCopy = searchInputCopy.value;
        // 检查搜索查询是否不为空并且不是数值
        if (searchQueryCopy && isNaN(searchQueryCopy)) {

            var keyword = searchQueryCopy;

            // 拼接Post查询的JSON
            var jsonDatas = {
                "current": 1,
                "size": 10,
                "wordName": keyword
            };

            searchDatas(jsonDatas);

        }

    });

    function displaySearchResults(response) {
        var records = response.data.records;
        var floatingDivContent = document.createElement('div');

        if (records.length === 0) {
            // No results found
            var noResultDisplayDiv = document.createElement('div');
            noResultDisplayDiv.style.color = '#fff';
            noResultDisplayDiv.textContent = '无结果';
            createModalssw('无结果');
        } else {
            for (var i = 0; i < records.length; i++) {
                var record = records[i];
                var wordName = record.wordName;
                var description = record.description;
                var groupName = record.groupName;

                // 创建元素来显示搜索结果
                var resultElement = record.wordName + '<br>' + record.description + '<br>';
                createModalssw(resultElement);
            }
        }
    }


    var queryContentListUrls = 'https://oes-coss.miguvideo.com:1443/oes-csas-words/word/learn';

    // 查询数据
    function searchDatas(jsonDatas) {
        // 将 JSON 数据转换为字符串
        var jsonStrings = JSON.stringify(jsonDatas);
        // 创建 XMLHttpRequest 对象
        var xhr = new XMLHttpRequest();
        // 设置请求信息
        // 替换为目标服务器的URL
        xhr.open('POST', queryContentListUrls, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                // 在控制台输出响应数据
                displaySearchResults(response);

            }
        };

        // 发送请求
        xhr.send(jsonStrings);
    }
    //敏感词库

    buttoncha.addEventListener('click', async function() {


        var option = prompt("请选择选项：\n1. 全部\n2. 今天\n3. 巡检关键字（不用每天检查）\n4. 标题艺人");
        if (option === "1") {
            searchWordLibrary.forEach(function(keyword) {
                searchAuditorContent(keyword, '');
            });
        } else if (option === "2") {
            searchWordLibrary.forEach(function(keyword) {
                searchAuditorContents(keyword, '');
            });
            // 执行新的函数逻辑（留空）
        }else if (option === "3") {
            searchWordLibrary2.forEach(function(keywords) {
                searchAuditorContentss(keywords, '');
            });
            // 执行新的函数逻辑（留空）
        }else if (option === "4") {
            searchWordLibrary3.forEach(function(keyword) {
                searchAuditorContentsss(keyword, '');
            });
            // 执行新的函数逻辑（留空）
        }

    });



    //查量
    buttonbai1.addEventListener("click", function(event) {
        if (userName1 === "zbs004liuyang") {
            toggleDisplayBox();
        } else {
            //alert("对不起，您没有权限");

        }
    });



    //查询通过驳回
    buttonye.addEventListener('click', async function() {

        schAuditorContents('1', function(totalPass) {
            // 查询审核不通过的数据
            schAuditorContents('0', function(totalFail) {
                // 显示数据数量
                displayDataCount(totalPass, totalFail);
            });
        });


    });

    buttonbai.addEventListener('click', async function() {
        if (!yebanmod) {
            // 如果yebanmod为false，执行原有的代码
            schAuditorContent("1", function(totalPass) {
                // 查询审核不通过的数据
                schAuditorContent("0", function(totalFail) {
                    // 显示数据数量
                    displayDataCount(totalPass, totalFail);
                });
            });
        } else {
            // 如果yebanmod为true，使用新的查询函数
            schAuditorContents("1", function(totalPass) {
                // 查询审核不通过的数据
                schAuditorContents("0", function(totalFail) {
                    // 显示数据数量
                    displayDataCount(totalPass, totalFail);
                });
            });
        }
    });

    // 历史记录
    searchButtonCopya.addEventListener('click', async function() {

        var lishijilu = [];
        if (localStorage.getItem('lishijilu')) {
            lishijilu = JSON.parse(localStorage.getItem('lishijilu'));
        }
        createModallishijilu(lishijilu);
    });

    //快速模式
    let kuaisums = false;
    // 绑定搜索按钮点击事件
    buttonkuai.addEventListener('click', async function() {


        // 切换kuaisums的值
        kuaisums = !kuaisums;
        // 根据kuaisums的值设置按钮样式
        if (kuaisums) {
            // 如果kuaisums为true，改变按钮的样式为红色
            buttonkuai.style.backgroundColor = '#ff0000'; // 红色背景

            // 切换 jieweims 的值
            jieweims = true;
            // 将 jieweims 的值保存到 localStorage
            localStorage.setItem('jieweims', jieweims);
            // 更新按钮显示
            updateButtonState();

            lianfams = false;
            buttonlianfa.style.backgroundColor = '#28a745'; // 绿色背景

        } else {
            // 如果kuaisums为false，恢复按钮的原始样式
            buttonkuai.style.backgroundColor = '#28a745'; // 绿色背景

            // 切换 jieweims 的值
            jieweims = false;
            // 将 jieweims 的值保存到 localStorage
            localStorage.setItem('jieweims', jieweims);
            // 更新按钮显示
            updateButtonState();


        }

    });
    //快速模式


    //刷新
    // 绑定搜索按钮点击事件
    buttonshuaxin.addEventListener('click', async function() {
        getTotayTotal();
    });
    //刷新

    //连发模式
    let lianfams = false;
    // 绑定搜索按钮点击事件
    buttonlianfa.addEventListener('click', async function() {

        if (!kuaisums) {
            lianfams = !lianfams

            // 切换 jieweims 的值
            jieweims = false;
            // 将 jieweims 的值保存到 localStorage
            localStorage.setItem('jieweims', jieweims);
            // 更新按钮显示
            updateButtonState();

            // 根据kuaisums的值设置按钮样式
            if (lianfams && !kuaisums && !jieweims) {
                // 如果kuaisums为true，改变按钮的样式为红色
                buttonlianfa.style.backgroundColor = '#ff0000'; // 红色背景
            } else {
                // 如果kuaisums为false，恢复按钮的原始样式
                buttonlianfa.style.backgroundColor = '#28a745'; // 绿色背景

            }

        }else {
            kuaisums = false;
            buttonkuai.style.backgroundColor = '#28a745'; // 绿色背景

            lianfams = !lianfams

            // 切换 jieweims 的值
            jieweims = false;
            // 将 jieweims 的值保存到 localStorage
            localStorage.setItem('jieweims', jieweims);
            // 更新按钮显示
            updateButtonState();

            // 根据kuaisums的值设置按钮样式
            if (lianfams && !kuaisums && !jieweims) {
                // 如果kuaisums为true，改变按钮的样式为红色
                buttonlianfa.style.backgroundColor = '#ff0000'; // 红色背景
            } else {
                // 如果kuaisums为false，恢复按钮的原始样式
                buttonlianfa.style.backgroundColor = '#28a745'; // 绿色背景

            }

        }
    });


    buttonlian.addEventListener('click', async function() {
        var option = parseInt(buttonlian.dataset.option);

        switch (option) {

            case 1:
                buttonlian.style.backgroundColor = '#5cb85c'; // 绿色背景
                buttonlian.textContent = '人机';
                buttonlian.dataset.option = '2';
                localStorage.setItem('targetElementText', '人机差异复核');
                break;
            case 2:
                buttonlian.style.backgroundColor = '#d9534f'; // 红色背景
                buttonlian.textContent = '高危';
                buttonlian.dataset.option = '3';
                localStorage.setItem('targetElementText', '高危用户节目');
                break;
            case 3:
                buttonlian.style.backgroundColor = '#8a2be2'; // 紫色背景
                buttonlian.textContent = '低危';
                buttonlian.dataset.option = '4';
                localStorage.setItem('targetElementText', '低危用户节目');
                break;
            case 4:
                buttonlian.style.backgroundColor = '#FF69B4'; // 粉色背景
                buttonlian.textContent = '新快';
                buttonlian.dataset.option = '5';
                localStorage.setItem('targetElementText', '新快审通道');
                break;
            case 5:
                buttonlian.style.backgroundColor = '#000000'; // 橙色背景
                buttonlian.textContent = '信息';
                buttonlian.dataset.option = '6';
                localStorage.setItem('targetElementText', '信息修改通道');
                break;
            case 6:
                buttonlian.style.backgroundColor = '#f0ad4e'; // 橙色背景
                buttonlian.textContent = '机审';
                buttonlian.dataset.option = '1';
                localStorage.setItem('targetElementText', '机审通过节目复核');
                break;

        }
    });


    // 绑定搜索按钮点击事件
    searchButtonCopys.addEventListener('click', async function() {

        var searchQueryCopys = searchInputCopys.value;
        // 检查搜索查询是否不为空并且不是数值
        if (searchInputCopys && isNaN(searchInputCopys)) {

            var keywords = searchQueryCopys;

            // 拼接Post查询的JSON
            var jsonData5 = {
                "aiAuditStatus": "",
                "aisleEndTime": "",
                "aisleId": "",
                "aisleStartTime": "",
                "assetId": "",
                "auditor": userName1,
                "auditStatus": 1,
                "auditType": "",
                "author": "",
                "collectEndTime": "",
                "collectStartTime": "",
                "costTime": "",
                "createTimeEndTime": "",
                "createTimeStartTime": "",
                "displayName": "",
                "endTime": "",
                "exclusiveKeyword": "",
                "keywords": "",
                "labelId": "",
                "location": 2,
                "MD5": "",
                "mediumStatus": "",
                "occurred": "",
                "otherKeyword": "",
                "pageNum": 1,
                "pageSize": 5,
                "riskList": [],
                "secondClassCode": "",
                "startTime": "",
                "thirdClassCode": "",
                "titleKeyword": keywords,
                "userId": "",
                "userRiskList": [],
                "videoType": ""
            };

            searchData5(jsonData5);

        }

    });
    // 查询数据
    function searchData5(jsonData5) {
        var jsonString = JSON.stringify(jsonData5);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', queryContentListUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                var messages = []; // 创建一个数组来存储所有消息

                // 遍历 response.data.total 数组并构建消息
                response.data.dataList.forEach(function (response) {
                    var message = '标题: ' + response.assetName + ' 媒资ID: ' + response.assetId;
                    messages.push(message); // 将消息添加到数组中
                });
                createModalssw(messages.join('<br>'));
            }
        }

        xhr.send(jsonString);
    }

    //标题回查
    //获取用户名称的地址
    var userInfoUrl = 'https://oes-coss.miguvideo.com:1443/user/authentication';
    //存放当前用户名称
    var userName1 ;

    //媒资ID
    var assetId;
    //账号ID
    var author;
    //通道地址
    var aisleId;
    //存放通道连接地址
    var authenticationAisleList = [];
    //存放维护的违禁词
    var tencentDocUrl = ' https://docs.qq.com/document/DZWhaTlBYRklpRUFD';
    //存放违禁词
    var searchWordLibrary = ['随刻','腾讯视频','好看视频','优酷','土豆','搜狐','乐视','西瓜视频','秒拍','抖音','快手','火山','最右','微博视频号','梨视频','皮这一下','皮皮虾','爱奇艺','小红书','直播吧','今日头条','百度视频','网易视频','哔哩哔哩','bilibili','西瓜体育','头条体育','爱奇艺体育','火山官方','火山美食','搜狐体育','头条',
                             '我的英雄学院','逃学威龙','头文字','大时代','地球停转之日','罪恶之城','巫师3','隐入尘烟','死亡笔记','暗杀教室','恶搞之家','辛普森一家','瑞奇和莫迪','一九四二','猫汤','我推的孩子','伊拉克恶狼谷','娜珍之交','禁忌女孩','有多卑微',
                             '黑白校园','疾速追杀','天龙八部','宁安如梦','人体蜈蚣','进击巨人','刃艾伦','阿尔敏','少林足球','奇幻潮','终极一班','全民目击','山河令','叶问大战约翰威克','澳门风云','相爱十年','剑雨','风云','隐如尘烟','情深深雨蒙蒙','康斯坦丁','大盗','黑客帝国','小时代','上海滩','欢乐今宵',
                             '徐濠萦','王全安','谭小环','罗志祥','翟天临','吴启明','林建明','叶德娴','李易峰','毛宁','张默','林夕','胡瓜','陈冠希','黄秋生','赵薇','张耀扬','薇娅','李云迪','李铁','范冰冰','炎亚纶','赵立新','孙兴','李易峰','柯震东','张元','高虎','邓伦','唐诗咏','张哲瀚','黄海波','高晓松','周峻纬','朴明秀',
                             '钙片','烟酰胺','鱼油','维生素','益生菌','护肝片','叶黄素','保健品推广','上海养老金', '康士坦丁','大佛普拉斯','里维斯','乐火团队','维尼熊','谢文东','绣春刀','特警新人类','虚竹','乔峰','段誉','鸠摩智','撒旦','夜神月','殷桃疑似恋情','陈奕迅最难唱的一首歌',
                             '特朗普','俄乌','美俄','老拜','拜登','泽连斯基','逃学威龙','城管','动漫推荐','头文字','AE86','缅北','鬼灭之刃','鸭脖','小萝莉','人生若如初见','我的英雄学院','人面鱼','李诞','香蜜沉沉烬如霜','珂珂动漫','岸田','香蜜','十月围城','为什么赵丽颖能大火',
                             '一口气看完','无间道','红色按钮','bbc','增肌粉','steam','战地','问诊','黑金','旺角监狱','阳光普照','梁家辉','那年那兔','太保','上海人寿','民国','中华民国','民国纪年','狂赌之渊','小清河','断桥','围栏','护城河','洪水','倪岳峰','晴雅集','楚乔传','白鹿原','封神',
                             '徐若瑄','达叔','娱乐圈','电锯人','梅根','博彩','丁蟹','以爱为名','光刻机','佩洛西','温州','祠堂','鹰酱','爱神','我唾弃你的坟墓','进击的巨人','情深深雨蒙蒙','talk','兔瓦斯','梅塔塔','江浩','爱神巧克力','周子瑜','瑞克和莫蒂','瑞克','车祸模拟器','一千零一夜','台湾名嘴','化工厂',
                             '我赌5包辣条','双男','↗️↘️↗️','房地产','刘亚仁','思悼','刘丞以','破坏之王','新知创作人','森美','练成了','韩剧双男','泰剧双男','同性','中国新说唱','聂小凤','雪花神剑','兄妹恋','天盛长歌','twice','以你的心诠释我的爱','中国最后一个太监','吕不韦','嬴异人','陷入通缩','负增长','中国有嘻哈',
                             '大碗宽面','青簪行','爵迹','我叫白小飞','尸兄','小李飞刀','北京欢迎你','我的小尾巴','生死时速','终极一班','黄致列','见面吧就现在','遇见你之后','还珠格格','网红直播','儿童睡前故事','康熙来了','埃塞俄比亚','中埃','赖清德','柬埔寨','重案六组','男儿本色',
                             '千机变','马小龙','罗小贝','门第','疯狂熊孩子','急诊室故事','失恋33天','梨花泪','雾里看花','永不磨灭的番号','地狱公使','六龙飞天','思悼','格斗yulao少年','不名誉的一家','我们没有明天','不能说的夏天','我和僵尸有个约会','四大名捕','二胎奖','中国影史上的美人',
                             '翻越','高墙','式神','东京暗鸦','黑白森林','壮志凌云','吴倩莲','2day1夜','奇葩说第4季','九五至尊','封神榜','傅艺伟','妲己','旺达寻亲记','奇异博士2','Talk That Talk','氰化欢乐秀','哥布林','沙雕动画','生化危机','使徒行者','红警','红色警戒','疯狂的多元宇宙',
                             '囚禁','诺贝尔','牙医','放映厅','沈世','浙江卫视','李明','郑爽','活跳尸','段云','纵横四海','大富豪','太白金星','小鱼儿与花无缺','铁心兰','安石海','名侦探学院','社内相亲','安孝燮','女作家','骨瘦如柴','镜双城','宋冬野','极限挑战','赵氏孤儿','如懿传',
                             '黄飞鸿','痞子老师','民兵葛二蛋','萧峰','芈月传','苏州河','极限男团',' 桃色交易','乱世三义','唐子义','斗音','小燕子','吴亦凡','关于我和鬼','缠爱之根','陈羽凡','曹达华','使命召唤','无耻之徒','第七段','快讯','快报','时政','早知道','军事','楚乔终于',
                             '7纳米','搭载新型','两个怪异女孩','只要不进密逃','电锯惊魂','阴声','天津大爷','汉朝帝王图鉴','陈戌源','食人魔','下水道的美人鱼','禁忌之恋','夕阳天使','这就是街舞','职业球队','月里青山淡如画','以谁之名','绝路','慈禧','活着','古装男神','天赋都用来损人',
                             '杨钰莹','喀秋莎','王芳','乌鸦哥','海清','孝文','洛丽塔','七日杀','刘春洋','交响乐团','元首的愤怒','小s鉴茶','恐怖蜡像馆','祝卿好','袁冰妍','老九门','褚璇玑','杨铠豪','杨幂','琉璃','将夜','倾城亦清欢','dha','核桃油','少林五祖','赵丽颖与大佬谈笑风声',
                             '台湾史诗级电影，将婚姻不堪的一面','春夏','氨糖','与凤行','拥有公司最多的12位明星','港台十大爱国明星','明星偶像包袱碎一地','“普通发”行为大赏','事业爱情双丰收的黄晓明','共闯娱圈的兄弟姐妹','千万别和专业歌手同台飙歌','张玉安&文凯_护国狂魔','玉无心为救',
                             '同样是男星穿军装','陈思诚与新欢阮巨现身约会','无缝衔接合拍，就是那么的丝滑','冷血狂宴：银尘双重身份曝光','主办方有多尴尬','放弃中国籍却在中国捞金的明星','把嫌弃写脸上谁有陈坤硬核','被镜头捕捉的明星尬死瞬间','候场暴露异性缘','不红就被冷落','咖位低就该',
                             '暴露真假社交的候场','父亲纳妾后气的原配投河自尽','男子为离世女友查真相十年不婚','华语乐坛最大的败笔','2022年最新的史诗级空战片','月老','男星谦让起来有多可怕','果然是烂片出神曲','明星喜欢冷漠全写在脸上','世界上没有真正正确的地图','父母一时冲动丢下孩子',
                             '黄晓明不再沉默','镜头捕捉到的','国家队出手','女星同台互相有多瞧不上','内地和港台女星驻颜差距','如果影视中的改装枪械有段位','大佬女儿颜值对比','以凡人之躯与众神为敌','华灯初上','候场暴露真假社交','突发时刻','一部让女主迅速走红的国产电影',
                             '嫁给富豪后破产的女星','孟丽君','为抢镜明星能有多拼','明星假唱翻车现场','多尬死','资本态度成咖位','大力女子姜南顺','写脸上的明星','包装后','落花时节又逢君','才是王道','晚节不保老戏骨','13082353318','被嫌弃如何应对','韩国歌撞调','男星红毯','疯狂往事陈意涵',
                             '潘金莲','女娲传说之灵珠','疯批太师将她困在身边','明星医美过度有多尴尬','林志玲被太子辉','明星穿衣暴露爱国情怀','整顿流量鲜肉','曾轶可唱的最惨的一首歌','群嘲林志炫','四大天王背后的女人','嫁负心汉的女星今昔','明星偶像包袱碎一地','热线','微信','13881286073',
                             '三六九等','双缝干涉实验有多可怕','确定是配音不是原声','娱乐圈离谱的谣言','意外走光都是','台湾黑帮老大张安乐','表里不一','写脸上的男星','咖位决定明星的C位','芭莎内场','恒大','候场社交暴露明星真实关系','王一博到底做了什么','次次提名次次都陪跑','明星红毯突发尴尬',
                             '记录的社死瞬间','曾风光今落魄的港姐','繁华一梦终归去','这几位原唱太厉害','女星对男星态度','当白色死神遇到蓝色','古惑仔女演员','被镜头记录的明星社交','地球班往事','选秀界五大狠人','轮回的空椅子','刻进骨子里的','自信过头的满级人类','黄晓明对不同女星的差距',
                             '明星反应','危险罗曼史','明星脱口而出','地球诺贝尔奖','火到出圈的说唱歌曲','明星被排挤有多尴尬','就该被冷落','资本弃子','WJSN','金晶恩','女星同框抢镜小心机','谭小环','两个妃子争夺皇后','女星对男星态度看细节','张凌赫白鹿超甜互动','离婚仅仅8年','足协彻底',
                             '北京奥运会开幕式','模范出租车','王后伞下','13166376525','东北话搞笑配音','当霸道总裁遇上女流氓','颜丹晨跨界当主持','女人必看的爱情电影之一','鬼眼刑警','终于知道上帝','白鹿合作的男演员','伤害不大却侮辱性极强','高天鹤','叶蕴仪','确定是来颁奖不是说相声',
                             '他们要不换个星球生活吧','看明星红不红','灭门惨案','快来看大师如何押韵的','粉丝视角暴露明星真假',

                            ];

    // 获取违禁词的描述
    function getDescriptionForWord(word) {
        // 存放违禁词描述
        var descriptions = {
            '随刻': '竞品','腾讯视频': '竞品','好看视频': '竞品','优酷': '竞品','土豆': '竞品', '搜狐': '竞品','乐视': '竞品','西瓜视频': '竞品','秒拍': '竞品','抖音': '竞品','快手': '竞品','火山': '竞品','最右': '竞品','微博视频号': '可能存在微博视频号','梨视频': '竞品','皮这一下': '可能存在竞品皮皮虾','皮皮虾': '竞品','爱奇艺': '竞品','殷桃疑似恋情': '0:38黄秋生',
            '小红书': '竞品','直播吧': '竞品','今日头条': '竞品','百度视频': '竞品','网易视频': '竞品','哔哩哔哩': '竞品','西瓜体育': '竞品','头条体育': '竞品','爱奇艺体育': '竞品','火山官方': '竞品','火山美食': '竞品','搜狐体育': '竞品','头条': '竞品', '生化危机': '违禁游戏', '使徒行者': '可能存在黄翠如','男星红毯': '32秒袁冰妍','楚乔终于': '0:03邓伦或者36秒周俊伟',
            '红警': '封禁游戏红色警戒的简称','红色警戒': '封禁游戏','我的小尾巴': '可能存在周俊伟','沙雕动画': '可能存在涉黄涉暴','哥布林': '该动漫存在大量黄色画面','氰化欢乐秀': '大量低俗内容','Talk That Talk': '可能存在周子瑜','奇异博士2': '封禁电影', '疯狂的多元宇宙': '封禁电影','旺达寻亲记': '封禁影片奇异博士2的简称','次次提名次次都陪跑': '视频1分11秒涉及劣迹艺人吴亦凡',
            '妲己': '影片封神榜苏妲己饰演者傅艺伟','傅艺伟': '劣迹艺人','封神榜': '可能存在苏妲己傅艺伟','九五至尊': '可能存在角色岑尹天娜饰演者谭小环与角色高劲饰演者郑敬基','奇葩说第4季': '可能存在劣迹艺人卡姆','2day1夜': '第一季的一二期存在房祖名','吴倩莲': '可能关联到劣迹黄秋生与劣迹张耀扬','壮志凌云': '可能联系到封禁影片壮志凌云2','陈奕迅最难唱的一首歌': '58s高晓松',
            '黑白森林': '高危影片易出现黄秋生、杜汶泽','东京暗鸦': '封禁动漫','式神': '封禁动漫东京暗鸦中的角色','四大名捕': '可能存在劣迹黄秋生','我和僵尸有个约会': '可能存在劣迹杜汶泽','不能说的夏天': '可能存在劣迹徐若瑄与劣迹戴立忍','我们没有明天': '可能存在劣迹刘亚仁','思悼': '可能存在劣迹刘亚仁','疯批太师将她困在身边': '0.44秒周骏纬','为什么赵丽颖能大火': '14秒后出现吴亦凡',
            '六龙飞天': '可能存在刘亚仁','地狱公使': '可能存在教主刘亚仁','永不磨灭的番号': '可能存在黄海波','雾里看花': '可能存在劣迹毛宁','失恋33天': '可能存在劣迹陈羽凡与劣迹张默','门第': '影片可能存在劣迹张博','罗小贝': '高危影片重案六组角色张博','马小龙': '高危影片重案六组联系到劣迹张博','重案六组': '视频涉及袁冰妍','候场社交暴露明星真实关系': '视频涉及吴亦凡',
            '千机变': '可能存在劣迹黄秋生，陈冠希','囚禁': '大量血腥画面驳回处理','诺贝尔': '可能存在展示个人信息','牙医': '可能存在展示个人信息','无间道': '可能存在劣迹黄秋生','放映厅': '存在竞品抖音','沈世': '关联到沈世豪劣迹艺人孙兴','美俄': '可能关联到俄乌战争','韩国歌撞调': '可能关联到俄乌战争','玉无心为救': '3分01涉及袁冰妍','明星反应': '1分03涉及罗志祥',
            '浙江卫视': '涉“李玟生前控诉中国好声音”相关审核规则，关联攻击、抵制浙江卫视泛化炒作及行煽类的内容均驳回。如：蓝台杀人台、杀人蓝台、蓝台杀人、浙江杀人台等。','一口气看完': '该用户可能上传的视频存在大量违禁内容','晚节不保老戏骨': '1分33劣迹艺人赵薇','13082353318': '青少年培训广告','被嫌弃如何应对': '视频1:05吴亦凡','赵丽颖与大佬谈笑风声': '视频48秒涉及吴亦凡',
            '洪水': '注意涉小清河断桥现场冲击性视频相关画面以及河北地区领导发言相关内容','大碗宽面': '劣迹艺人吴亦凡演唱歌曲','青簪行': '劣迹艺人吴亦凡主演的电视剧可能联系到邓伦','爵迹': '该剧存在劣迹艺人范冰冰与吴亦凡','我叫白小飞': '其中第一季中的第1-3集、21集含有血腥暴力、恐怖猎奇等违规内容','尸兄': '违禁动漫我叫白小飞剧中角色名称','有多卑微': '32左右涉及李易峰',
            '小李飞刀': '劣迹艺人范冰冰参演的电视剧','北京欢迎你': '群星演唱的歌曲，注意劣迹艺人陈羽凡','我的小尾巴': '劣迹艺人周俊伟参演的综艺','生死时速': '注意基努·里维斯','终极一班': '该片为违禁影片也可能存在劣迹艺人炎亚纶','黄致列': '劣迹艺人黄致列','见面吧就现在': '劣迹艺人周俊伟参演的综艺','遇见你之后': '劣迹艺人周俊伟参演的综艺','轮回的空椅子': '涉2022年两会结束后，李克强拂袖而去留下空椅子的境外炒作及相关图片，及猜测杜撰共产党党派斗争相关负面内容，审核不通过。注意“空椅子”同时也易关联刘晓波、胡锦涛离席，相关负面内容，驳回处理。',
            '还珠格格': '该片存在劣迹艺人范冰冰与赵薇','网红直播': '违禁影片禁忌女孩的简称','儿童睡前故事': '可能存在竞品或者其他违规点','康熙来了': '20040517期涉六四高危内容。20080618期你不相信的艺能界宅女，视频内容有明显的传播藏独旗帜的内容。','赖清德': '可能涉及新闻一般为无资质','王一博到底做了什么': '视频20秒涉及吴亦凡','黄晓明对不同女星的差距': '36秒出现范冰冰',
            '柬埔寨': '一般会关联到缅甸负面', '缅北': '一般会关联到缅北负面','男儿本色': '劣迹艺人房祖名参演的影视','中国有嘻哈': '可能存在王昊或吴亦凡', '吕不韦': '吕不韦传奇存在劣迹艺人高虎', '嬴异人': '吕不韦传奇里劣迹艺人高虎的角色名', '中国最后一个太监': '劣迹艺人莫少聪主演的影视', 'twice': '韩国女团TWICE可能存在劣迹艺人周子瑜','明星红毯突发尴尬': '视频53秒邓伦',
            '天盛长歌': '容易出现劣迹艺人赵立新', '兄妹恋': '一般会关联到劣迹艺人周峻纬或者不正常恋爱观', '雪花神剑': '剧中存在劣迹艺人袁文杰', '聂小凤': '可能联系到雪花神剑中劣迹艺人袁文杰', '中国新说唱': '注意画面劣迹艺人吴亦凡或竞品', '同性': '注意出现不正常的恋爱观', '双男': '注意出现不正常的恋爱观', '练成了': '此类节目可能存在大量低俗内容','自信过头的满级人类': '1分58秒郭培培',
            '森美': '劣迹艺人森美', '新知创作人': '此类节目可能存在大量低俗内容', '破坏之王': '注意剧中出现旭日旗', '刘丞以': '劣迹艺人刘丞以', '思悼': '影片可能出现劣迹艺人刘亚仁', '刘亚仁': '劣迹艺人刘亚仁','我赌5包辣条': '此类节目可能存在大量违规点','徐濠萦': '劣迹艺人徐濠萦','王全安': '劣迹艺人王安全','女娲传说之灵珠': '劣迹艺人孙兴','疯狂往事陈意涵': '2.59秒戴立忍',
            '谭小环': '劣迹艺人谭小环','罗志祥': '劣迹艺人罗志祥','翟天临': '劣迹艺人翟天临','吴启明': '劣迹艺人吴启明','林建明': '劣迹艺人林建明','叶德娴': '劣迹艺人叶德娴','李易峰': '劣迹艺人李易峰','毛宁': '劣迹艺人毛宁','张默': '劣迹艺人张默','林夕': '劣迹艺人林夕','胡瓜': '劣迹艺人胡瓜','陈冠希': '劣迹艺人陈冠希','黄秋生': '劣迹艺人黄秋生','风云': '可能涉及劣迹艺人孙兴以及王喜',
            '赵薇': '劣迹艺人赵薇','张耀扬': '劣迹艺人张耀扬','薇娅': '劣迹艺人薇娅','李云迪': '劣迹艺人李云迪','李铁': '敏感人物李铁','范冰冰': '劣迹艺人范冰冰','炎亚纶': '劣迹艺人炎亚纶','赵立新': '劣迹艺人赵立新','孙兴': '劣迹艺人孙兴','李易峰': '劣迹艺人李易峰','柯震东': '劣迹艺人柯震东','张元': '劣迹艺人张元','高虎': '劣迹艺人高虎','邓伦': '劣迹艺人邓伦',
            '唐诗咏': '劣迹艺人唐诗咏','张哲瀚': '劣迹艺人张哲瀚','黄海波': '劣迹艺人黄海波','高晓松': '劣迹艺人高晓松','周峻纬': '劣迹艺人周俊伟','朴明秀': '劣迹艺朴明秀','我的英雄学院': '违禁动漫', '逃学威龙': '可能存在劣迹艺人叶德娴','头文字': '可能出现未定性艺人陈冠希','大时代': '劣迹艺人吴启明', '地球停转之日': '劣迹艺人基努·里维斯', '罪恶之城': '正片及含违规点内容不通过',
            '巫师3': '除血腥暴力、低俗色情场景及其它审核违规点的可正常通过', '隐入尘烟': '违规影片','死亡笔记': '违禁动漫，正片及含违规点片段删除', '暗杀教室': '日本动漫内容保持删除，真人作品可以通过','恶搞之家': '第一季第一集影射64相关涉政有害内容驳回，其中未成年形象持枪、爆粗口内容驳回','辛普森一家': '涉及敏感政治话题，包含但不限于坦克人、藏独、辱华等内容，及未成年形象持枪、爆粗口等违规内容保持删除',
            '瑞奇和莫迪': '未成年持枪暴力血腥画面删除','一九四二': '存在劣迹艺人张默','猫汤': '出现全部驳回','我推的孩子': '出现全部驳回', '伊拉克恶狼谷': '出现全部驳回','娜珍之交': '出现全部驳回','禁忌女孩': '出现全部驳回','李明': '网红李明自称其缅甸遇险花30万自救相关内容，审核不通过。','徐若瑄': '劣迹艺人徐若瑄','达叔': '注意关联到劣迹艺人叶德娴',
            '娱乐圈': '可能存在劣迹艺人的情况','电锯人': '日本动漫《电锯人》，其中较多血暴场面，注意有违规点的保持删除','博彩': '注意关联到违禁品赌博博彩','丁蟹': '大时代的主要人物注意劣迹艺人吴启明','以爱为名': '注意劣迹艺人吴启明','爱神': '违禁动漫爱神巧克力，多处情节存在过度娱乐、过度宣扬校园爱情、性暗示及露骨行为等低俗违规内容','我唾弃你的坟墓': '封禁影片该片存在大量血腥暴力、淫秽色情内容。',
            '进击的巨人': '违禁动漫动画其', '战地': '其中战地3、战地4为文化部封杀违法游戏', '郑爽': '劣迹艺人郑爽', '活跳尸': '违禁影片出现全部驳回', '段云': '违禁影片我叫刘金凤中的角色名称段云嶂', '纵横四海': '可能出现劣迹艺人叶德娴','大富豪': '关联到影片纵横四海中可能出现劣迹艺人叶德娴','民国': '涉及建国后中华民国等字样驳回处理','鬼灭之刃': '该动漫可能存在大量血腥恐怖画面',
            '佩洛西': '美国前国务卿，推特存在声援六四的行文。审核标准：该人物关联六四的内容保持删除，其余内容正常审核。','活着': '张艺谋导演的影视作品，相关内容全部驳回','太白金星': '春光灿烂猪八戒中角色名易出现劣迹艺人孙兴','小鱼儿与花无缺': '注意劣迹艺人范冰冰','铁心兰': '小鱼儿与花无缺影视中范冰冰饰演者','安石海': '涉朝鲜安石海涂受灾金正恩视察中批评内阁处置不力、尸位素餐，将此次受灾定义为人灾相关内容审核不通过',
            '人面鱼': '注意劣迹艺人徐若瑄','名侦探学院': '劣迹艺人周俊伟参演的综艺','红色按钮': '此类视频含有西瓜视频搜索框，需驳回处理','社内相亲': '违禁影片，出现全部驳回','安孝燮': '违禁影片社内相亲角色名，出现全部驳回','女作家': '可能涉及违禁影片我唾弃你的坟墓','骨瘦如柴': '劣迹艺人基努里维斯参演的影片','镜双城': '劣迹艺人李易峰主演的影片','宋冬野': '劣迹艺人宋冬野','极限挑战': '可能涉及罗志祥与邓伦',
            '赵氏孤儿': '可能涉及劣迹艺人范冰冰','黄飞鸿': '可能涉及劣迹艺人莫少聪','痞子老师': '违禁影片出现全部驳回','民兵葛二蛋': '可能涉及劣迹艺人高虎','萧峰': '可能涉及劣迹艺人高虎','芈月传': '可能涉及劣迹艺人赵立新','如懿传': '可能涉及劣迹艺人赵立新','苏州河': '涉及劣迹艺人贾宏声','贾宏声': '劣迹艺人贾宏声','山河令': '劣迹艺人邓伦参演的影视','极限男团': '劣迹艺人邓伦参演的综艺',' 桃色交易': '违禁影片出现全部驳回',
            '乱世三义': '劣迹艺人黄海波主演的影片','唐子义': '可能涉及劣迹艺人黄海波','斗音': '竞品抖音的别称','小燕子': '劣迹艺人赵薇的角色名', '吴亦凡': '劣迹艺人吴亦凡','乐火团队': '涉及赌博等违规内容','关于我和鬼': '同性电影并且涉及劣迹艺人炎亚纶','缠爱之根': '同性电影出现驳回','陈羽凡': '劣迹艺人陈羽凡','曹达华': '大概率涉及劣迹艺人叶德娴','使命召唤': '使命召唤电脑端为违禁游戏，手游不做管控',
            '无耻之徒': '违禁影片出现驳回','疾速追杀': '容易出现劣迹艺人基努里维斯','第七段': '容易出现劣迹艺人黄秋生','7纳米': '针对揣测和炒作华为新手机采用先进7纳米芯片技术的敏感内容，保持通过并打压后台标签。','搭载新型': '关于华为Mate60 Pro搭载新型麒麟9000s芯片相关内容，涉我国关键核心技术敏感信息，除官媒外，审核不通过。','两个怪异女孩': '容易出现劣迹艺人基努里维斯',
            '电锯惊魂': '违禁影片出现驳回','只要不进密逃': '容易出现劣迹艺人池子','阴声': '违禁影片，正片及含违规点内容不通过','天津大爷': '对涉“天津大爷跳水成网红景观”相关信息内容打上“压后台”标签。','汉朝帝王图鉴': '涉及劣迹艺人张哲瀚','陈戌源': '落马官员出现全驳回','李诞': '注意经常与劣迹艺人池子一块出现','咖位决定明星的C位': '48s涉及李易峰','刻进骨子里的': '4分02秒基努里维斯',
            '封神': '完整片名为封神演义，涉及劣迹艺人邓伦','小萝莉': '注意动漫涉及未成年恋爱或不正常的恋爱观','食人魔': '违禁影片《致命弯道》以及违禁影片《隔山有眼》中的人物形象，出现全驳回','下水道的美人鱼': '违禁影片《下水道的美人鱼》，出现全驳回','禁忌之恋': '涉及不正常的恋爱观,出现全驳回','夕阳天使': '容易出劣迹艺人赵薇','这就是街舞': '其中1-2季涉及劣迹艺人邓伦与李易峰，第4季涉及劣迹艺人周俊伟',
            '职业球队': '涉及劣迹艺人邓伦','月里青山淡如画': '劣迹艺人周俊伟参演的影片','steam': '容易涉及游戏恶搞警察画面','以谁之名': '柴静纪录片《陌生人》分集第一集，审核提示：涉及该片预告、片段、正片、视频截图、纪录片解说文案、宣推等，审核不通过。','绝路': '柴静纪录片《陌生人》分集第二集，审核提示：涉及该片预告、片段、正片、视频截图、纪录片解说文案、宣推等，审核不通过。',
            '古装男神': '容易涉及多位劣迹艺人如：邓伦','谢文东': '违禁影片出现全驳回','杨钰莹': '容易涉及劣迹艺人毛宁','喀秋莎': '歌手王芳在马里乌波尔大剧院废墟演唱歌曲《喀秋莎》，视频原片，保持驳回，不区分账号口径。2、涉王芳在马里乌波尔大剧院废墟歌曲《喀秋莎》一事（不含视频原片）仅能通过新闻资质合规号发布内容，保持与官方口径一致，新闻特许账号可转载新闻资质合规号发布内容，其余自媒体发布相关内容一律驳回处理。',
            '王芳': '歌手王芳在马里乌波尔大剧院废墟演唱歌曲《喀秋莎》，视频原片，保持驳回，不区分账号口径。2、涉王芳在马里乌波尔大剧院废墟歌曲《喀秋莎》一事（不含视频原片）仅能通过新闻资质合规号发布内容，保持与官方口径一致，新闻特许账号可转载新闻资质合规号发布内容，其余自媒体发布相关内容一律驳回处理。','俄': '涉及挺俄贬乌、挺乌贬俄等有害信息的相关内容，保持驳回。',
            '乌': '涉及挺俄贬乌、挺乌贬俄等有害信息的相关内容，保持驳回。', '乌鸦哥': '涉及劣迹艺人张耀扬','海清': '注意联系到违禁影片《隐入尘烟》','孝文': '劣迹艺人翟天临的角色名','慈禧': '注意影片可能是违禁影片《慈禧秘密生活》','洛丽塔': '不伦恋违禁电影，出现驳回','七日杀': '审核标准：游戏画面不涉及血腥暴力场景及其它审核违规点的可正常通过。','老拜': '出现恶搞国家领导人驳回',
            '刘春洋': '具体讲述刘春洋组织卖淫经历等相关自媒体炒作内容保持驳回，互动评论如支持卖淫嫖娼、关联社会不公现状等内容，审核不通过。','交响乐团': '涉乌克兰交响乐团抵达台湾”事件相关内容，审核驳回','小时代': '涉及劣迹艺人柯震东','元首的愤怒': '出现全驳回，违禁影片','小s鉴茶': '视频3分57秒涉及劣迹艺人屈中恒','恐怖蜡像馆': '违禁影片，出现驳回',
            '杨铠豪': '此类节目涉及劣迹艺人李易峰','杨幂': '走红毯类型可能大量涉及劣迹艺人范冰冰的情况','祝卿好': '劣迹艺人袁冰妍主演的影片','袁冰妍': '劣迹艺人袁冰妍短视频仅通过新闻资质合规类账号（包括宣推信息专用账号、泛资讯拆条号）和新闻特许账号发布的批判类报道，正面宣传短视频删除。长视频暂不处理。','老九门': '劣迹艺人袁冰妍参演的影片饰演张艺兴的夫人',
            '褚璇玑': '劣迹艺人袁冰妍参演的电视剧琉璃影片的角色名','琉璃': '劣迹艺人袁冰妍主演的影片，注意区分花琉璃影片','将夜': '劣迹艺人袁冰妍参演的影片饰演莫山山，其中两季全有','倾城亦清欢': '劣迹艺人袁冰妍主演的影片预计2023上映热度较高','少林五祖': '劣迹艺人叶德娴','将婚姻不堪的一面': '报纸上涉及民国47年违禁词语','咖位低就该': '视频1分11涉及吴亦凡',
            '春夏': '劣迹艺人春夏','康斯坦丁': '劣迹艺人基努里维斯主演的影片','人生若如初见': '涉及劣迹艺人春夏','中华台北': '亚运会赛事不能出现中华台北字样，仅能出现中国台北','氨糖': '保健品氨糖，出现全驳回','与凤行': '视频含有劣迹艺人周俊伟','天龙八部': '涉及劣迹艺人高虎以及赵学而','拥有公司最多的12位明星': '多数视频涉及末尾西瓜视频','写脸上的男星': '视频47秒涉及李易峰',
            '港台十大爱国明星': '视频20秒左右涉及胡瓜','明星偶像包袱碎一地': '视频涉及薇娅','“普通发”行为大赏': '视频06秒劣迹艺人李云迪','事业爱情双丰收的黄晓明': '视频0.53劣迹艺人黄海波','共闯娱圈的兄弟姐妹': '视频20秒范冰冰','千万别和专业歌手同台飙歌': '视频1.53柯震东','张玉安&文凯_护国狂魔': '视频1：28申东烨','表里不一': '视频58秒罗志祥',
            '同样是男星穿军装': '视频7秒敏感人物张哲瀚','陈思诚与新欢阮巨现身约会': '视频涉及李易峰','无缝衔接合拍，就是那么的丝滑': '视频4分17秒劣迹艺人周子瑜','冷血狂宴：银尘双重身份曝光': '视频劣迹艺人吴亦凡','主办方有多尴尬': '视频0:32秒李易峰','放弃中国籍却在中国捞金的明星': '视频涉及赵立新','台湾黑帮老大张安乐': '视频1分04秒涉及张耀扬','选秀界五大狠人': '2：05徐若瑄',
            '把嫌弃写脸上谁有陈坤硬核': '视频29秒涉及范冰冰','被镜头捕捉的明星尬死瞬间': '视频0:51范冰冰','候场暴露异性缘': '视频32秒李易峰','暴露真假社交的候场': '视频00:44劣迹艺人李易峰','父亲纳妾后气的原配投河自尽': '视频01:46袁冰妍','男子为离世女友查真相十年不婚': '视频13秒涉及周峻纬','晴雅集': '视频涉及邓论','潘金莲': '视频涉及傅艺伟','中国影史上的美人': '28秒涉及傅艺伟',
            '华语乐坛最大的败笔': '视频47秒黄致列','2022年最新的史诗级空战片': '视频涉及违禁影片壮志凌云','月老': '视频涉及劣迹艺人柯震东','男星谦让起来有多可怕': '视频涉及劣迹艺人李易峰','果然是烂片出神曲': '视频涉及劣迹艺人范冰冰','明星喜欢冷漠全写在脸上': '视频42秒涉及劣迹艺人袁冰妍','如果影视中的改装枪械有段位': '视频8秒涉及基努里维斯','不红就被冷落': '视频48秒涉及吴亦凡',
            '世界上没有真正正确的地图': '中国地图错误 藏南地区缺失','父母一时冲动丢下孩子': '视频9秒劣迹艺人屈中恒','黄晓明不再沉默': '视频04秒劣迹艺人李云迪','镜头捕捉到的': '视频2秒范冰冰以及56秒吴亦凡','国家队出手': '视频1:15秒邓伦','女星同台互相有多瞧不上': '视频0:16范冰冰','内地和港台女星驻颜差距': '视频02秒黄夏蕙','大佬女儿颜值对比': '视频06秒视频中出现劣迹艺人范冰冰',
            '以凡人之躯与众神为敌': '视频涉及旭日旗','华灯初上': '视频涉及屈中恒、民国40年、民国63年、徐若瑄、港独人物何韵诗等众多违规内容','候场暴露真假社交': '视频42秒涉及李易峰','突发时刻': '视频涉及竞品抖音','鹰酱': '视频涉及恶搞国际关系','一部让女主迅速走红的国产电影': '视频涉及柯宇纶与王力宏','嫁给富豪后破产的女星': '视频11涉及劣迹艺人叶蕴仪',
            '孟丽君': '视频涉及孙兴','为抢镜明星能有多拼': '视频涉及范冰冰','明星假唱翻车现场': '视频涉及陈羽凡','多尬死': '视频44秒范冰冰','资本态度成咖位': '视频3s出现吴亦凡','大力女子姜南顺': '劣迹艺人金廷恩','写脸上的明星': '17秒劣迹艺人范冰冰、58秒袁冰妍、35秒吴秀波','包装后': '14秒邓论','落花时节又逢君': '劣迹艺人袁冰妍','才是王道': '劣迹艺人范冰冰','天赋都用来损人': '2分39涉及劣迹艺人薇娅',
            '明星医美过度有多尴尬': '视频0:01劣迹艺人黄夏蕙','林志玲被太子辉': '视频1:19劣迹艺人黄秋生','明星穿衣暴露爱国情怀': '视频0:27秒范冰冰','整顿流量鲜肉': '视频01:03李易峰','曾轶可唱的最惨的一首歌': '视频23秒劣迹艺人高晓松','群嘲林志炫': '视频28秒出现劣迹艺人李云迪','四大天王背后的女人': '视频1:09出现叶蕴仪','热线': '涉及广告联系方式','地球班往事': '涉及恶搞国际关系',
            '嫁负心汉的女星今昔': '视频20已定性艺人叶蕴仪','明星偶像包袱碎一地': '劣迹艺人薇娅','微信': '涉及广告联系方式','三六九等': '涉及劣迹艺人范冰冰','双缝干涉实验有多可怕': '2分51涉及劣迹艺人基努李维斯','确定是配音不是原声': '46秒张耀扬','娱乐圈离谱的谣言': '48秒涉及劣迹艺人池子','意外走光都是': '17秒劣迹艺人范冰冰','恒大': '涉及指令问题需要仔细审核',
            '芭莎内场': '57秒范冰冰','记录的社死瞬间': '1:44范冰冰','曾风光今落魄的港姐': '22秒出现谭小环','繁华一梦终归去': '13秒周俊伟','这几位原唱太厉害': '1：24邓伦劣迹艺人','剑雨': '涉及劣迹艺人戴立忍','女星对男星态度': '1分11秒涉及邓伦','当白色死神遇到蓝色': '38秒出现苏永康','古惑仔女演员': '42秒谭小环','被镜头记录的明星社交': '30秒范冰冰或者51秒李易峰',
            '危险罗曼史': '视频主体为同性视频','明星脱口而出': '1分17秒李易峰','地球诺贝尔奖': '视频开头基努里维斯','火到出圈的说唱歌曲': '2分45秒里李云迪',

        };
        return descriptions[word] || ""; // 如果找不到描述，则返回空字符串
    }

    // 创建一个集合来存放高危账号的 ID
    var highRiskAccounts = ["961209152","1075995195","1609200398","183677998","1599801105","1607917886","1606919819","903952714","1599834789","1234519225","672155831","1569044386","1601292640","1574516673","1331149428","1561330019","1563646685","432665785","1580973820","242872099","1448851441","1552738626","1599735497"];

    //var searchWordLibrary = getTencentDocContent(tencentDocUrl);
    //获取标题和简介
    var mySentence;
    //存储判断是否有违规词
    var titleContainsChineseWordResult = false;
    //记录每日完成总量
    var todayTotal;
    //记录每小时完成总量
    var hoursTotal;
    // 拼接成当天的时间字符串
    var currentTime;
    //获取月初
    var currentTime1
    //获取月末
    var currentTime2
    //当小时的字符串
    var currentHoursTime = 0;
    //存储查询数据量的连接'https://oes-coss.miguvideo.com:1443/oes-csas-manage/statistics/auditStatistics?account=zbs003baiyuezhou&startTime=2023-07-09 00:00:00&endTime=2023-07-09 23:59:59&current=1&size=10
    //var auditStatisticsUrl = 'https://oes-coss.miguvideo.com:1443/oes-csas-manage/statistics/auditStatistics?account=';

    //获取用户信息
    async function getUserInfo(){
        try {
            // 等待获取数据
            var data = await getContent(userInfoUrl);
            // 在控制台输出获取到的数据
            console.log(data);
            var userInfo = data.result;
            // 在此处将数据赋值给全局变量
            userName1 = userInfo.userName;

            getTotayTotal()

        } catch (error) {
            // 处理请求错误
            console.error(error);
        }
    }
    //用户名1启用
    getUserInfo();
    //获取当天日期
    getCurrentTime();
    //获取当小时
    getCurrentHoursTime();
    //获取当月
    getCurrentMonth();

    async function getTotayTotal() {
        var url = 'https://oes-coss.miguvideo.com:1443/oes-csas-manage/statistics/auditStatistics?account=';

        // 根据包含匹配字符串的结果选择拼接日期的逻辑
        var auditStatisticsUrl;
        if (yebanmod) {
            console.log('夜班账号验证成功');

            // 获取前一天的日期
            var previousDate = new Date();
            previousDate.setDate(currentDate.getDate() - 1);

            var previousDateString =
                previousDate.getFullYear() +
                '-' +
                (previousDate.getMonth() + 1) +
                '-' +
                previousDate.getDate();

            auditStatisticsUrl =
                url +
                userName1 +
                '&startTime=' +
                previousDateString +
                ' 21:00:00&endTime=' +
                currentTime +
                ' 23:59:59&current=1&size=10';
        } else {
            auditStatisticsUrl =
                url +
                userName1 +
                '&startTime=' +
                currentTime +
                ' 00:00:00&endTime=' +
                currentTime +
                ' 23:59:59&current=1&size=10';
        }

        // 拼接当小时url
        var currentHoursTimeUrl = url + userName1 + currentHoursTime;

        // 拼接当月
        var monthUrl =
            url +
            userName1 +
            '&startTime=' +
            currentTime1 +
            ' 00:00:00&endTime=' +
            currentTime2 +
            ' 23:59:59&current=1&size=10';

        // 获取每天的目标完成量
        var dailyTarget = 1200;

        try {
            // 等待获取数据
            var data = await getContent(auditStatisticsUrl);
            var hoursData = await getContent(currentHoursTimeUrl);
            var ho = await getContent(monthUrl);

            // 在控制台输出获取到的数据
            console.log(data);
            console.log(hoursData);
            console.log(ho);

            // 在此处将数据赋值给全局变量
            var myData = data.data;
            var records = myData.records;
            todayTotal = records[0].total;
            console.log('当日总量：' + records[0].total);

            // 获取当小时的工作量
            var myHoursData = hoursData.data;
            var recordsHours = myHoursData.records;
            hoursTotal = recordsHours[0].total;
            console.log('当时总量：' + recordsHours[0].total);

            // 获取月度总量
            var myHo = ho.data;
            var re = myHo.records;
            var monthTotal = 0;
            for (var i = 0; i < re.length; i++) {
                monthTotal += parseInt(re[i].total, 10);
            }
            console.log('月度总量：' + monthTotal);

            // 获取当前月份的天数，并根据实际的工作日历进行调整
            var totalWorkDays;
            var currentMonth = new Date().getMonth();
            var totalDays = daysInMonth(currentMonth);
            if (totalDays === 30) {
                totalWorkDays = 21;
            } else if (totalDays === 31) {
                totalWorkDays = 22;
            }

            // 计算差多少完成目标
            var remainingTarget = dailyTarget * totalWorkDays - monthTotal;
            console.log('差多少完成目标：' + remainingTarget);
            //计算已完成的百分比
            var bfb= monthTotal/(dailyTarget * totalWorkDays)* 100;
            // 计算完成的百分比
            var percentageCompleted =(todayTotal/dailyTarget)*100;
            //计算未完成百分比
            var percentageTodayRemaining=100-percentageCompleted;

            console.log('已完成百分比：' + percentageCompleted.toFixed(2) + '%');

            floatingDiv2.textContent =
                '快捷操作提示：默认情况下：1：通过。o：无资质。3：末尾竞品。4：广告推广。5：血腥恐怖。6：开头竞品。7：封面纯色。8：标题竞品。9：低俗引导。p：影响观看。y：违禁影视。u：劣迹艺人。t：未成年保护。z：显示/隐藏。上↑键位：倍速。左←键位：后退5s。右→键位：快进5s。w：抢低位。g：抢无条件。e：抢人机。q：抢高危。r：抢机审'


            textContent3.textContent = '当前：月审核：' +
                monthTotal +
                '。日审核：' +
                todayTotal +
                '。小时审核：' +
                hoursTotal
        } catch (error) {
            // 处理请求错误
            console.error(error);
        }
    }


    var isFloatingDivVisible = false; // 跟踪内容的显示状态

    // 监听按键事件
    document.addEventListener('keydown', function(event) {
        // 按下的键位为d
        if (event.key === '`') {
            // 如果内容已经显示，则隐藏内容；否则显示内容
            if (isFloatingDivVisible) {
                hideFloatingDiv();
            } else {
                showFloatingDiv();
            }
        }
    });

    function showFloatingDiv() {
        // 显示内容
        floatingDiv2.style.display = 'block';
        isFloatingDivVisible = true;
    }

    function hideFloatingDiv() {
        // 隐藏内容
        floatingDiv2.style.display = 'none';
        isFloatingDivVisible = false;
    }


    // 获取当前月份的天数，并根据实际的工作日历进行调整
    function daysInMonth() {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var days = new Date(year, month, 0).getDate();

        // 根据实际情况调整天数
        if (month === 2) { // 二月份特殊处理，可根据实际情况调整
            if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
                days = 29; // 闰年二月29天
            } else {
                days = 28; // 平年二月28天
            }
        } else if (month === 4 || month === 6 || month === 9 || month === 11) {
            days = 30; // 4月、6月、9月、11月每月30天
        }

        return days;
    }


    // 监听XMLHttpRequest的响应
    var open = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function(method, url) {
        this.addEventListener('load', function() {
            //拦截目前有在处理的通道
            if(url === '/oes-csas-manage/aisle/authenticationAisleList'){
                if (this.getResponseHeader('content-type').indexOf('application/json') !== -1 ) {
                    var response2 = JSON.parse(this.responseText);
                    // 在控制台输出响应数据
                    console.log(response2);

                    // 在这里可以进行对返回的 JSON 数据的操作
                    parseJSONAuthenticationAisleList(response2);
                }
            }
            //对正在处理的通道做处理
            if (authenticationAisleList.indexOf(url) !== -1) {
                if (this.getResponseHeader('content-type').indexOf('application/json') !== -1 ) {
                    var response = JSON.parse(this.responseText);
                    // 在控制台输出响应数据
                    //console.log(response);

                    // 解析 JSON 数据并进行处理
                    parseJSONData(response);


                }
            }

            //拦截所有通道获取每个通道剩余数据
            if(url === '/oes-csas-manage/statistics/aisleYetAuditStatistics'){
                if (this.getResponseHeader('content-type').indexOf('application/json') !== -1 ) {
                    var response3 = JSON.parse(this.responseText);
                    // 在控制台输出响应数据
                    console.log(response3);

                    // 在这里可以进行对返回的 JSON 数据的操作
                    // ...
                }
            }
            //拦截账号风险标签
            if(url.includes('/oes-csas-manage/detail/allUserRiskLabels?author=')){
                if (this.getResponseHeader('content-type').indexOf('application/json') !== -1 ) {
                    var response4 = JSON.parse(this.responseText);

                    // 在控制台输出响应数据（新闻资质合规账号）
                    console.log(response4);

                    // 在这里可以进行对返回的 JSON 数据的操作
                    if(response4.data.riskLabelName === '新闻资质合规账号'){
                        alert('请注意本账号是：新闻资质合规账号');
                    }else if(response4.data.riskLabelName === '体育快审账号'){
                        alert('请注意本账号是：体育快审账号');
                    }

                }
            }
            //拦截AI审核信息
            if(url.includes('/oes-csas-manage/aia-record/video/result?assetId=')){
                if (this.getResponseHeader('content-type').indexOf('application/json') !== -1 ) {
                    var response5 = JSON.parse(this.responseText);

                    // 在控制台输出响应数据
                    //console.log(response5);

                }
            }
        });
        open.apply(this, arguments);
    };

    function fastForward(video, rewindTime, scrollDistance) {
        video.currentTime += rewindTime;
        window.scrollBy(scrollDistance, 0);
        rewindTime += 5;
        scrollDistance += rewindTime * 10;
    }


    var filePreviewUr=[]; // 存储劣迹艺人照片链接

    function screateModal(result) {
        var modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = 0;
        modal.style.left = 0;
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        var styledContent = '<div style="font-weight:bold; font-size:20px; white-space: pre-line;">' +
            result.replace(/(驳回媒资ID: \d+)/g, '<span style="color:red;">$1</span>')
        .replace(/(驳回理由: .+?)(  驳回时间)/g, '<span style="color:red;">$1</span>$2') +
            '</div>';
        var imageHtml = '';
        var imageIndex = 0;
        if (filePreviewUr && filePreviewUr.length > 0){

            var images = filePreviewUr.slice();
            imageHtml = '<img id="modalImage" src="' + images[imageIndex] + '" style="object-fit: scale-down; max-height:65%;padding-left:12%" alt="照片">';
        }
        var textDiv = document.createElement('div');
        textDiv.innerHTML = styledContent + '<br>' + imageHtml;
        textDiv.style.padding = '15px';
        textDiv.style.backgroundColor = '#fff';
        if (filePreviewUr && filePreviewUr.length > 0) {
            textDiv.style.width = '50%';
            textDiv.style.height = '65%';
            var prevButton = document.createElement('button');
            prevButton.textContent = '上一张';
            prevButton.style.padding = '10px';
            prevButton.style.position = 'absolute';
            prevButton.style.backgroundColor = 'blue';
            prevButton.style.color = 'white';
            prevButton.style.left = '26%';
            prevButton.style.top = '50%';
            prevButton.style.transform = 'translateY(-50%)';

            prevButton.addEventListener('click', function() {
                imageIndex = (imageIndex - 1 + images.length) % images.length;
                document.getElementById('modalImage').src = images[imageIndex];
            });

            var nextButton = document.createElement('button');
            nextButton.textContent = '下一张';
            nextButton.style.padding = '10px';
            nextButton.style.position = 'absolute';
            nextButton.style.backgroundColor = 'blue';
            nextButton.style.color = 'white';
            nextButton.style.right = '26%';
            nextButton.style.top = '50%';
            nextButton.style.transform = 'translateY(-50%)';

            nextButton.addEventListener('click', function() {
                imageIndex = (imageIndex + 1) % images.length;
                document.getElementById('modalImage').src = images[imageIndex];
            });

            modal.appendChild(prevButton);
            modal.appendChild(textDiv);
            modal.appendChild(nextButton);

        } else {
            textDiv.style.width = '30%';
            textDiv.style.height = '35%';

        }

        modal.appendChild(textDiv);

        // 添加底部提示文字
        var bottomText = document.createElement('div');
        bottomText.innerText = '点击任意区域关闭此提示';
        bottomText.style.position = 'absolute';
        bottomText.style.bottom = '10px';
        bottomText.style.color = 'red';
        bottomText.style.cursor = 'pointer';

        modal.appendChild(bottomText);

        document.body.appendChild(modal);

        // 点击模态框外部或底部文字关闭模态框
        modal.addEventListener('click', function(e) {
            if (e.target === modal || e.target === bottomText) {
                modal.remove();
            }
        });
        // 按空格键关闭模态框
        function handleKeyPress(e) {
            if (e.key === ' ') {
                modal.remove();
            }
        }

        // 监听键盘事件
        document.addEventListener('keydown', handleKeyPress);
    }


    /*
    function showSuccessMessage() {
        var messageElement = document.createElement('div');
        messageElement.innerText = '快速操作成功';

        // 设置样式
        messageElement.style.position = 'fixed';
        messageElement.style.top = '50%';
        messageElement.style.left = '50%';
        messageElement.style.transform = 'translate(-50%, -50%)';
        messageElement.style.backgroundColor = 'lightgreen';
        messageElement.style.padding = '10px';
        messageElement.style.zIndex = '9999';

        // 将消息添加到页面中
        document.body.appendChild(messageElement);

        // 慢慢消失
        setTimeout(function() {
            messageElement.style.display = 'none';
        }, 2000);
    }
*/


    // 创建带样式的模态框
    function createModallishijilu(displayArray) {
        var modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = 0;
        modal.style.left = 0;
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';

        var textDiv = document.createElement('div');
        textDiv.style.width = 'auto';
        textDiv.style.height = '35%';
        textDiv.style.padding = '20px';
        // 如果数据超过了高度就出现下拉框
        textDiv.style.overflowY = 'auto';
        textDiv.style.overflowX = 'auto';
        textDiv.style.backgroundColor = '#fff';

        displayArray.forEach(function(item) {
            var content = document.createElement('div');
            content.style.fontWeight = 'bold';
            content.style.fontSize = '20px';
            content.style.whiteSpace = 'pre-line';
            content.textContent = item;
            textDiv.appendChild(content);
        });

        modal.appendChild(textDiv);

        // 添加底部提示文字
        var bottomText = document.createElement('div');
        bottomText.innerText = '点击任意区域关闭此提示';
        bottomText.style.position = 'absolute';
        bottomText.style.bottom = '10px';
        bottomText.style.color = 'red';
        bottomText.style.cursor = 'pointer';

        modal.appendChild(bottomText);

        document.body.appendChild(modal);

        // 点击模态框外部或底部文字关闭模态框
        modal.addEventListener('click', function(e) {
            if (e.target === modal || e.target === bottomText) {
                modal.remove();
            }
        });

        // 按空格键关闭模态框
        function handleKeyPress(e) {
            if (e.key === ' ') {
                modal.remove();
            }
        }

        // 监听键盘事件
        document.addEventListener('keydown', handleKeyPress);
    }


    // 从 localStorage 恢复 lishijilu
    var lishijilu = [];
    if (localStorage.getItem('lishijilu')) {
        lishijilu = JSON.parse(localStorage.getItem('lishijilu'));
    }


    // 保存 aisleId 的外部方法
    function saveAisleId(assetId, text) {
        if (assetId.trim() !== '') {
            // 检查是否已经包含相同的 assetId
            var isDuplicate = false;

            for (var i = 0; i < lishijilu.length; i++) {
                var savedAssetId = lishijilu[i].split(' ')[0];
                if (savedAssetId === assetId) {
                    isDuplicate = true;
                    break;
                }
            }

            if (isDuplicate) {
                console.log('当前媒资ID已存在于历史记录中，不进行重复保存。');
            } else {
                lishijilu.push(`${assetId} ${text}`);

                // 判断是否达到上限，超过上限则清除最早保存的数据
                if (lishijilu.length > 1200) {
                    lishijilu.shift();
                }
                // 将更新后的 lishijilu 保存到 localStorage
                localStorage.setItem('lishijilu', JSON.stringify(lishijilu));
            }
        } else {
            console.log('ID为空，不进行保存。');
        }
    }

    function saveAisleIdWithText(assetId, text) {
        saveAisleId(assetId, text);
    }


    function fadeOutPopup() {
        var popup = document.querySelector('.popup');
        var opacity = 1;
        var intervalId = setInterval(function() {
            if (opacity > 0) {
                opacity -= 0.1;
                popup.style.opacity = opacity;
            } else {
                clearInterval(intervalId);
                popup.remove();
            }
        }, 100);
    }



    var containesr = document.createElement('div');
    containesr.id = 'containesr';
    containesr.style.width = '600px';
    containesr.style.height = '550px';
    containesr.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    containesr.style.color = '#fff';
    containesr.style.padding = '10px';
    containesr.style.borderRadius = '5px';
    containesr.style.position = 'fixed';
    containesr.style.left = '35%';
    containesr.style.top = '18%';
    containesr.style.zIndex = '9998';
    containesr.style.cursor = 'move';
    containesr.style.display = 'none';

    document.body.appendChild(containesr);

    // 创建一个新的img元素
    var images = document.createElement('img');
    // 设置图片的链接
    images.src = 'https://img.wxcha.com/file/201911/05/64e388e640.gif';
    // 设置图片的宽度和高度，并保证不超过400x400
    images.style.width = '400px';
    images.style.height = '400px';
    // 将图片添加到之前创建的容器中
    images.style.transform = 'translate(20%, 5%)'; // 使用transform来使悬浮框居中
    containesr.appendChild(images);

    var containesrSpan= document.createElement('span');
    containesrSpan.textContent = '自动抢量中！现在请等待抢量成功，可以刷刷抖音，玩玩手机，上个厕所，愉快的时光！';
    containesrSpan.style.position = 'absolute';
    containesrSpan.style.width = '500px';
    containesrSpan.style.height = '500px';
    containesrSpan.style.top = '80%';
    containesrSpan.style.left = '0%';
    containesrSpan.style.color = '#00000'; // 白色字体
    containesrSpan.style.fontSize = '25px'; // 14号字体
    containesrSpan.style.left = '50%';
    containesrSpan.style.transform = 'translateX(-50%)';
    containesr.appendChild(containesrSpan);


    var elementTexts = localStorage.getItem('elementTexts') ? JSON.parse(localStorage.getItem('elementTexts')) : ['低危用户节目', '高危用户节目'];

    document.addEventListener('keydown', async function(event) {
        var storedKeyyidingxing = getStoredKeyyidingxing();
        var storedKeyweidingxing = getStoredKeyweidingxing();
        var jsonData;
        var shouldSubmit;
        var down = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
        var up = new MouseEvent('mouseup', { bubbles: true, cancelable: true });
        var click = new MouseEvent('click', { bubbles: true, cancelable: true });
        // 获取当前日期
        var currentDate = new Date().toDateString();

        // 从本地存储中获取上次保存的日期和计数器
        var storedDate = localStorage.getItem('executionDate');
        var executionCount = localStorage.getItem('executionCount');
        var executionCounts = localStorage.getItem('executionCounts');

        // 获取点击目标元素
        var elem;

        // 你提供的元素文本内容数组;
        var currentIndex = 0;

        // 分发 mousedown, mouseup 和 click 事件
        function dispatchMouseDownAndUpEvent() {
            // 确保页面已加载完成
            if (document.readyState === 'complete') {
                console.log('Page is fully loaded');
                var targetElementText = localStorage.getItem('targetElementText') || '机审通过节目复核';
                if(!elem) {
                    var elems = document.getElementsByClassName('tree_item');
                    for (var i = 0; i < elems.length; i++) {
                        if (elems[i].textContent === targetElementText)
                        {
                            elem = elems[i];
                            localStorage.setItem('targetElementText', elem.textContent);
                            break;
                        }
                    }
                }
                if(elem) {
                    console.log('Target element found');
                    elem.dispatchEvent(down);
                    elem.dispatchEvent(click);
                    elem.dispatchEvent(up);
                    console.log('Events dispatched');
                } else {
                    console.log('Error: Element not found');
                    alert('Error: Element not found');
                }
            }

        }

        function adispatchMouseDownAndUpEvent() {
            // 确保页面已加载完成
            if (document.readyState === 'complete') {
                console.log('Page is fully loaded');

                if (currentIndex >= elementTexts.length) {
                    currentIndex = 0; // 重置索引以循环数组
                }

                var currentText = elementTexts[currentIndex];
                var elem = findElementByText(currentText);

                if (elem) {
                    console.log('Target element found: ' + currentText);
                    elem.dispatchEvent(down);
                    elem.dispatchEvent(click);
                    elem.dispatchEvent(up);
                    console.log('Events dispatched');
                } else {
                    console.log('Error: Element not found for text ' + currentText);
                    alert('Error: Element not found for text ' + currentText);
                }

                currentIndex++;
            }
        }

        // 根据文本内容查找元素
        function findElementByText(text) {
            var elems = document.getElementsByClassName('tree_item');
            for (var i = 0; i < elems.length; i++) {
                if (elems[i].textContent === text) {
                    return elems[i];
                }
            }
            return null;
        }

        // 第五个按钮点击事件
        function addCustomButtons1() {
            // 在这里编写第二个按钮的逻辑
            var waclickCount = 0;

            containesr.style.display = 'block';
            var waintervalId = setInterval(function () {
                if (waclickCount < 1000) {
                    adispatchMouseDownAndUpEvent();

                    var spanEle = document.querySelector("#oneAssetDiv > div > div > div.el-row > div:nth-child(2) > form > div.asset-info > div:nth-child(1) > div:nth-child(1) > div > label")
                    var spanTt = spanEle.textContent.trim();

                    if (spanTt === '媒资ID:') {
                        clearInterval(waintervalId);
                        containesr.style.display = 'none';

                        // 生成弹出窗口代码
                        var popup = document.createElement('div');
                        popup.className = 'popup';
                        popup.style.position = 'fixed';
                        popup.style.top = '15%';
                        popup.style.left = '50%';
                        popup.style.transform = 'translate(-50%, -50%)';
                        popup.style.background = '#fff';
                        popup.style.padding = '10px';
                        popup.style.height = '30px';
                        popup.style.color = 'red';
                        popup.style.fontSize = '20px';
                        popup.style.textAlign = 'center';
                        popup.style.border = '2px solid red';
                        popup.innerText = '已刷到数据，停止后续刷新';
                        document.body.appendChild(popup); //将弹出窗口添加到页面的body上
                        // Fade out the popup message
                        setTimeout(fadeOutPopup, 2000);
                        waclickCount++;
                    }
                } else {
                    clearInterval(waintervalId);
                }
            }, 1000);
        }

        if (event.key === 'x' && qiangliang) {

            // 检查本地存储中是否存在executionCount，如果不存在，则设置默认值为600
            if (!localStorage.getItem('executionCount')) {
                localStorage.setItem('executionCount', 1200);
            }

            // 如果本地存储中的日期与当前日期不一致，将计数器和日期重置
            if (storedDate !== currentDate) {
                localStorage.setItem('executionDate', currentDate);
                localStorage.setItem('executionCount', 1200);
            } else {
                // 如果本地存储中的日期与当前日期一致，递减计数器
                let executionCount = localStorage.getItem('executionCount');
                if (executionCount > 0) {
                    executionCount -= 1;
                    localStorage.setItem('executionCount', executionCount);
                } else {
                    alert('今日次数已达上限');
                    // 不执行后续操作
                    return;
                }
            }

            addCustomButtons1();
        }

        /*
        //按钮2刷新
        document.addEventListener('keydown', function(event) {
            if (event.key === '2') {
                var button = document.querySelector("#app > div > div.content-box > div.content > section > div > div > div.tree.el-col.el-col-24.el-col-xs-3.el-col-sm-3.el-col-md-3 > button");
                if (button) {
                    button.click();
                    showCustomPopup("已刷新", 800); // 显示1秒后自动关闭
                }
            }
        });
*/

        function showCustomPopup(message, duration) {
            var popup = document.createElement("div");
            popup.style.position = "fixed";
            popup.style.top = "10%";
            popup.style.left = "50%";
            popup.style.transform = "translate(-50%, -50%)";
            popup.style.background = '#fff';
            popup.style.color ='red';
            popup.style.width = "80x";
            popup.style.padding = "20px";
            popup.style.border = '2px solid red';

            var content = document.createElement("div");
            content.innerHTML = message;
            popup.appendChild(content);

            var closeBtn = document.createElement("span");
            closeBtn.innerHTML = "&times;";
            closeBtn.style.position = "absolute";
            closeBtn.style.top = "10px";
            closeBtn.style.right = "10px";
            closeBtn.style.cursor = "pointer";
            closeBtn.addEventListener("click", function() {
                popup.remove();
            });
            popup.appendChild(closeBtn);

            document.body.appendChild(popup);

            setTimeout(function() {
                popup.remove();
            }, duration);
        }


        // 定义可用的快捷键选项
        var availableShortcuts = ['1', 'c', 'f', 'i', 'j', 'k', 'l', 'm','x','r',];

        // 获取之前保存在localStorage中的用户选择
        var shortcutKey = localStorage.getItem('shortcutKey');

        // 如果之前没有选择过快捷键，则弹出对话框让用户选择
        if (!shortcutKey) {
            var userInput = prompt('请选择你想使用的通过快捷键操作：直接输入对应字母或数字即可：\n' + availableShortcuts.join(', '));
            if (availableShortcuts.includes(userInput)) {
                shortcutKey = userInput.toLowerCase();
                // 将用户选择存储在localStorage中
                localStorage.setItem('shortcutKey', shortcutKey);
            } else {
                alert('无效的选择，请刷新页面重新选择');
                return; // 不继续执行后续代码
            }
        }


        // 检查按下的键是否为数字 1
        if (event.key === shortcutKey && !kuaisums && !lianfams && event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {

            var filePreviewUr=[]; // 存储劣迹艺人照片链接

            var spanEle = document.querySelector("span.el-tooltip");
            var spanTt = spanEle.textContent.trim();

            if (highRiskAccounts.includes(spanTt)) {
                alert('当前视频账号【 ' + spanTt + ' 】为严重高危敏感账号，请仔细检查视频内容！');
                return;
            }

            var title = document.querySelector("#oneAssetDiv > div > div > div.el-row > div:nth-child(2) > form > div.asset-info > div:nth-child(1) > div:nth-child(2) > div > div > span").textContent.trim();
            var phoneRegex =/\d{5,}/g;
            var phoneNumberMatches = title.match(phoneRegex);
            if (phoneNumberMatches && phoneNumberMatches.length > 0) {
                var phoneNumber = phoneNumberMatches.join(', ');
                alert('标题中可能包含电话号码：' + phoneNumber);
                return;
            }

            var title1 = document.querySelector("#oneAssetDiv > div > div > div.el-row > div:nth-child(2) > form > div.asset-info > div:nth-child(1) > div:nth-child(2) > div > div > span").textContent.trim();

            // 移除标题开头的点号及之前的内容
            title1 = title1.replace(/^.，，+?[\.,]/, '').trim();

            // 去除标题中的所有空格
            title1 = title1.replace(/\s/g, '');

            console.log('标题去除：' + title1);

            // 使用点、感叹号和问号分割句子
            var sentences = title.trim().split(/[。！？，＋_( ;…]/);

            // 获取第一句话
            var firstSentence
            if (title.trim().startsWith(".")||title.trim().startsWith(",")) {
                // 如果标题以 "." 开头，则选择第一段作为第一句话
                firstSentence = sentences[1];
            } else {
                // 否则选择第二段作为第一句话
                firstSentence = sentences[0];
            }

            if (!firstSentence.includes('。') && !firstSentence.includes('！') && !firstSentence.includes('？')&& !firstSentence.includes(' ')) {
                // 如果第一句话中没有标点，则直接使用原始句子
                filteredSentence = firstSentence;
            } else {
                if (!firstSentence.includes('.')) {
                    // 如果第一句话中没有点，则取感叹号或问号前的那一句话
                    firstSentence = title.match(/[^，！？_(。 ]*[，！？_(。 ]/)[0];

                }
                // 移除非字母、中文、逗号和问号感叹号字符
                var filteredSentence = firstSentence.replace(/[^a-zA-Z\u4e00-\u9fa5,?!]/g, '');
            }


            console.log('标题最后匹配：' + filteredSentence);

            async function schAuditorContent(filteredSentence) {
                // 拼接Post查询的JSON
                var jsonData = {
                    "aiAuditStatus": "",
                    "aisleEndTime": "",
                    "aisleId": "",
                    "aisleStartTime": "",
                    "assetId": "",
                    "auditor": "",
                    "auditStatus": "0",
                    "auditType": "",
                    "author": "",
                    "collectEndTime": "",
                    "collectStartTime": "",
                    "costTime": "",
                    "createTimeEndTime": "",
                    "createTimeStartTime": "",
                    "displayName": "",
                    "endTime": "",
                    "exclusiveKeyword": "",
                    "keywords": "",
                    "labelId": "",
                    "location": "2",
                    "MD5": "",
                    "mediumStatus": "",
                    "occurred": "",
                    "otherKeyword": "",
                    "pageNum": 1,
                    "pageSize": 5,
                    "riskList": [],
                    "secondClassCode": "",
                    "startTime": "",
                    "thirdClassCode": "",
                    "titleKeyword": filteredSentence,
                    "userId": "",
                    "userRiskList": [],
                    "videoType": ""
                };

                await schData(jsonData);
            }

            //提交查询相关信息
            function schData(jsonData) {
                return new Promise((resolve, reject) => {
                    var jsonString = JSON.stringify(jsonData);
                    var xhr = new XMLHttpRequest();
                    var queryContentListUrl = 'https://oes-coss.miguvideo.com:1443/oes-csas-manage/content/queryList';
                    xhr.open('POST', queryContentListUrl, true);
                    xhr.setRequestHeader('Content-Type', 'application/json');

                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4) {
                            if (xhr.status === 200) {
                                var response = JSON.parse(xhr.responseText);
                                var total = response.data.total;
                                var dataList = response.data.dataList;

                                if (dataList.length > 0) {
                                    var output = '';
                                    var length = Math.min(4, dataList.length);

                                    for(var i = 0; i < length; i++) {
                                        var assetId = dataList[i].assetId;
                                        var auditRemark = dataList[i].auditRemark;
                                        var aisleTime = dataList[i].aisleTime;

                                        output +=' 驳回媒资ID: ' + assetId + '  驳回理由: ' + auditRemark + '  驳回时间: ' + aisleTime + '\n';
                                    }
                                    var alertText = ' 当前查询到标题：'+ filteredSentence +'  视频库里有驳回，总数为: ' + total +'\n'+output;

                                    // 调用模态框函数
                                    createModal(alertText);

                                    //用户停止操作
                                    return;

                                }

                                resolve();
                            } else {
                                reject();
                            }
                        }
                    };

                    xhr.send(jsonString);
                });
            }


            // 创建带样式的模态框
            function createModal(content) {
                var modal = document.createElement('div');
                modal.style.position = 'fixed';
                modal.style.top = 0;
                modal.style.left = 0;
                modal.style.width = '100%';
                modal.style.height = '100%';
                modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                modal.style.display = 'flex';
                modal.style.alignItems = 'center';
                modal.style.justifyContent = 'center';
                var styledContent = '<div style="font-weight:bold; font-size:20px; white-space: pre-line;">' +
                    content.replace(/(驳回媒资ID: \d+)/g, '<span style="color:red;">$1</span>')
                .replace(/(驳回理由: .+?)(  驳回时间)/g, '<span style="color:red;">$1</span>$2') +
                    '</div>';
                var imageHtml = '';
                var imageIndex = 0;
                if (filePreviewUr && filePreviewUr.length > 0){

                    var images = filePreviewUr.slice();
                    imageHtml = '<img id="modalImage" src="' + images[imageIndex] + '" style="object-fit: scale-down; max-height:65%;padding-left:12%" alt="照片">';
                }
                var textDiv = document.createElement('div');
                textDiv.innerHTML = styledContent + '<br>' + imageHtml;
                textDiv.style.padding = '15px';
                textDiv.style.backgroundColor = '#fff';
                // 如果数据超过了高度就出现下拉框
                textDiv.style.overflowY = 'auto';
                textDiv.style.overflowX = 'auto';
                if (filePreviewUr && filePreviewUr.length > 0) {
                    textDiv.style.width = '50%';
                    textDiv.style.height = '65%';
                    var prevButton = document.createElement('button');
                    prevButton.textContent = '上一张';
                    prevButton.style.padding = '10px';
                    prevButton.style.position = 'absolute';
                    prevButton.style.backgroundColor = 'blue';
                    prevButton.style.color = 'white';
                    prevButton.style.left = '26%';
                    prevButton.style.top = '50%';
                    prevButton.style.transform = 'translateY(-50%)';

                    prevButton.addEventListener('click', function() {
                        imageIndex = (imageIndex - 1 + images.length) % images.length;
                        document.getElementById('modalImage').src = images[imageIndex];
                    });

                    var nextButton = document.createElement('button');
                    nextButton.textContent = '下一张';
                    nextButton.style.padding = '10px';
                    nextButton.style.position = 'absolute';
                    nextButton.style.backgroundColor = 'blue';
                    nextButton.style.color = 'white';
                    nextButton.style.right = '26%';
                    nextButton.style.top = '50%';
                    nextButton.style.transform = 'translateY(-50%)';

                    nextButton.addEventListener('click', function() {
                        imageIndex = (imageIndex + 1) % images.length;
                        document.getElementById('modalImage').src = images[imageIndex];
                    });

                    modal.appendChild(prevButton);
                    modal.appendChild(textDiv);
                    modal.appendChild(nextButton);

                } else {
                    textDiv.style.width = '30%';
                    textDiv.style.height = '35%';

                }

                modal.appendChild(textDiv);

                // 添加底部提示文字
                var bottomText = document.createElement('div');
                bottomText.innerText = '点击任意区域关闭此提示';
                bottomText.style.position = 'absolute';
                bottomText.style.bottom = '10px';
                bottomText.style.color = 'red';
                bottomText.style.cursor = 'pointer';

                modal.appendChild(bottomText);

                document.body.appendChild(modal);

                // 点击模态框外部或底部文字关闭模态框
                modal.addEventListener('click', function(e) {
                    if (e.target === modal || e.target === bottomText) {
                        modal.remove();
                    }
                });
                // 按空格键关闭模态框
                function handleKeyPress(e) {
                    if (e.key === ' ') {
                        modal.remove();
                    }
                }

                // 监听键盘事件
                document.addEventListener('keydown', handleKeyPress);
            }


            await schAuditorContent(filteredSentence);

            jsonData = {
                auditType: 7,
                labelId: '',
                queryAudit: 0,
                remark: '',
                voList: [{
                    aisleId: aisleId,
                    assetId: assetId,
                    modifyFields: [],
                    objectStatus: 1,
                    videoType: 1
                }]
            };

            var prohibitedWords = titleContainsChineseWord(mySentence);
            var result = await searchInferiorArtistOrProhibitedWord();

            if (prohibitedWords.length > 0) {
                var alertMessage = ' ';
                alertMessage += ' 请注意当前视频ID： ' + assetId + ' 标题或简介中存在违禁词： ' + prohibitedWords + '\n' + result + '\n';
                createModal(alertMessage);
            } else if (result !== '') {
                createModal(result);
            } else {
                shouldSubmit = confirm('判断为：通过。确认要提交数据吗？');
            }

            if (shouldSubmit) {
                submitData(jsonData);
                localStorage.setItem('通过', assetId);
                const data = `操作结果：${shouldSubmit ? '通过' : '未通过'}， assetId：${assetId}， 时间：${getCurrentChinaTime()}`;
                saveAisleIdWithText(jsonData.voList[0].assetId, '普通模式 ' + getCurrentChinaTime());
                updateExecutionCount();

                const existingData = localStorage.getItem('operationData');
                const newData = existingData ? existingData + '\n' + data : data;
                localStorage.setItem('operationData', newData);
            }
        }

        //校准时间
        function getCurrentChinaTime() {
            const currentTime = new Date();
            const chinaTime = new Date(currentTime.getTime() + (currentTime.getTimezoneOffset() + 480) * 60 * 1000);
            const year = chinaTime.getFullYear();
            const month = String(chinaTime.getMonth() + 1).padStart(2, '0');
            const day = String(chinaTime.getDate()).padStart(2, '0');
            const hour = String(chinaTime.getHours()).padStart(2, '0');
            const minute = String(chinaTime.getMinutes()).padStart(2, '0');
            const second = String(chinaTime.getSeconds()).padStart(2, '0');
            return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
        }



        async function searchInferiorArtistOrProhibitedWord() {
            // 存放返回结果
            var result = '';
            var filePreviewUrl;
            // 存放链接
            var aiUrl = 'https://oes-coss.miguvideo.com:1443/oes-csas-manage/aia-record/video/result?assetId=' + assetId;
            var aiResult = await getContent(aiUrl);

            // 人脸名称
            console.log(aiResult);

            // 判断AI质检结果及文本结果是否存在
            if (aiResult.data) {
                var dataAI = JSON.parse(aiResult.data);

                if (dataAI && dataAI.auditReason !== '通过') {
                    var auditReason = dataAI.auditReason;
                    var dataList = dataAI.dataList;
                    var faceNameSet = 'faceNameSet';
                    var textSet = 'textSet';

                    // 使用前清空set
                    localStorage.removeItem(faceNameSet);
                    localStorage.removeItem(textSet);

                    if (dataList && dataList.length > 0) {
                        for (var i = 0; i < dataList.length; i++) {
                            var dataListValue = dataList[i];
                            if ('filePreviewUrl' in dataListValue && dataListValue.filePreviewUrl) {
                                filePreviewUrl = dataListValue.filePreviewUrl;
                                //console.log('照片链接：' + filePreviewUrl);

                            }

                            addToSet(dataListValue.text, textSet);
                            if ('faces' in dataListValue) {
                                for (var j = 0; j < dataListValue.faces.length; j++) {
                                    var name = dataListValue.faces[j].name;
                                    console.log('人物：' + name)

                                    if (name === null || name === undefined || name === '') {
                                        continue; // 不允许存储空值
                                    } else {
                                        addToSet(dataListValue.faces[j].name, faceNameSet);
                                    }
                                }
                            }
                        }
                    } else {
                        // 处理 dataList 未定义或为空的情况
                    }


                    // 判断视频内文字是否存在违禁词
                    var prohibitedWord = titleContainsChineseWord(getSet(textSet));

                    // 存放违禁词
                    if (prohibitedWord !== '') {
                        result = '当前AI提示此视频字幕存在违禁词：【 ' + prohibitedWord + ' 】';
                        console.log('当前AI提示此视频内容文字部分存在违禁词：' + prohibitedWord);
                    }

                    // 判断人名是否是劣迹艺人
                    var searchInferiorArtistUrl = 'https://oes-coss.miguvideo.com:1443/oes-csas-words/figure/learn/findByPage?current=1&size=20&name=';
                    var searchInferiorArtistName;
                    var faceSet = getSet(faceNameSet);

                    // 存放艺人名称与对应的 riskTime 的映射
                    var artistRiskTimeMap = {};

                    if (faceSet.length !== 0) {
                        for (var item of faceSet) {
                            searchInferiorArtistUrl = searchInferiorArtistUrl + item + '&formerName=&country=&genre=&badProblem=&bak1=&bak2=';
                            var searchInferiorArtisResult = await getContent(searchInferiorArtistUrl);

                            // 添加判断条件进行数据有效性检查
                            if (searchInferiorArtisResult && searchInferiorArtisResult.data) {
                                var total = searchInferiorArtisResult.data.total;
                                if (total !== 0) {
                                    searchInferiorArtistName = item;
                                    var records = searchInferiorArtisResult.data.records;
                                    var searchResult = '';
                                    for (var g = 0; g < records.length; g++) {
                                        var artistName = records[g].name;
                                        var artistGenre = records[g].genre;
                                        var artistControlDescription = records[g].controlDescription;
                                        searchResult = searchResult + '人物库查询结果：劣迹艺人名称：【 ' + artistName + ' 】。劣迹类型：' + artistGenre + '。管控描述：' + artistControlDescription;
                                        var artistRiskTime;
                                        var dataItem = dataList.find(item => item.faces && item.faces.some(face => face.name === artistName));
                                        if (dataItem) {
                                            artistRiskTime = dataItem.riskTime;
                                        }

                                        if (!Array.isArray(filePreviewUr)) {
                                            filePreviewUr = [];
                                        }
                                        if (dataItem && dataItem.filePreviewUrl) {
                                            filePreviewUr = filePreviewUr.concat(dataItem.filePreviewUrl);
                                        }

                                        console.log('最后匹配：' + filePreviewUr);

                                        // 在这里将 searchResult 与 artistRiskTime 添加到 result
                                        result += '\nAI提示视频内容出现违禁艺人：【' + item + '】【' + searchResult + '】';
                                        if (artistRiskTime) {
                                            result += '，风险时间：' + artistRiskTime;
                                        }
                                    }

                                }
                            }

                            searchInferiorArtistUrl = 'https://oes-coss.miguvideo.com:1443/oes-csas-words/figure/learn/findByPage?current=1&size=20&name=';
                        }
                    }
                }
            }

            return result;
        }


        // 创建用于显示备注信息和 assetId 的元素
        const remarkAndIdDiv = document.createElement('div');
        remarkAndIdDiv.style = `
           position: fixed;
           top: 11%;
           left: 50%;
           transform: translate(-50%, -50%);
           padding: 20px;
           background-color: red;
           color:#fff;
           font-size: 16px;
           border-radius: 5px;
           box-shadow: 0 0 5px red;
           z-index: 9999;
           display: none;`;
        document.body.appendChild(remarkAndIdDiv);

        // 显示备注信息和 assetId
        function showRemarkAndId(id,remark) {
            remarkAndIdDiv.innerText = `预览：ID：${id} 备注信息：${remark}`;
            remarkAndIdDiv.style.display = 'block';

            // 3秒后自动隐藏备注信息和 assetId
            setTimeout(function() {
                hideRemarkAndId();
            }, 1100);
        }

        // 隐藏备注信息和 assetId
        function hideRemarkAndId() {
            remarkAndIdDiv.style.display = 'none';
        }


        if (jieweims) {
            // 获取视频元素
            var video = document.querySelector("#my-player_html5_api");
            // 初始快进和滚动值
            var rewindTime = 18000;
            var scrollDistance = 100;

            // 执行快进功能
            fastForward(video, rewindTime, scrollDistance);
        }


        // 拼接 JSON 对象
        jsonData = {
            auditType: 7,
            labelId: '',
            queryAudit: 0,
            remark: '',
            voList: [{ aisleId: aisleId, assetId: assetId, modifyFields: [], objectStatus: 1, videoType: 1 }]
        };



        if (event.key === "1" && kuaisums && !lianfams) {

            // 检查本地存储中是否存在executionCount，如果不存在，则设置默认值为600
            if (!localStorage.getItem('executionCount')) {
                localStorage.setItem('executionCount', 999);
            }

            // 如果本地存储中的日期与当前日期不一致，将计数器和日期重置
            if (storedDate !== currentDate) {
                localStorage.setItem('executionDate', currentDate);
                localStorage.setItem('executionCount', 999);
            } else {
                // 如果本地存储中的日期与当前日期一致，递减计数器
                let executionCount = localStorage.getItem('executionCount');
                if (executionCount > 0) {
                    executionCount--;
                    localStorage.setItem('executionCount', executionCount);
                } else {
                    alert('今日次数已达上限');
                    // 不执行后续操作
                    return;
                }
            }

            if (jieweims) {
                // 获取视频元素
                var videos = document.querySelector("#my-player_html5_api");
                // 初始快进和滚动值
                var rewindTimes = 18000;
                var scrollDistances = 100;

                // 执行快进功能
                fastForward(videos, rewindTimes, scrollDistances);
            }


            const jsonData = {
                auditType: 7,
                labelId: '',
                queryAudit: 0,
                remark: '',
                voList: [{ aisleId: aisleId, assetId: assetId, modifyFields: [], objectStatus: 1, videoType: 1 }]
            };

            // 定义一个异步函数
            async function checkProhibitedWords() {
                // 判断标题和简介是否有违禁词
                // 存放违禁词
                var prohibitedWords = titleContainsChineseWord(mySentence);
                var result = await searchInferiorArtistOrProhibitedWord();

                if (prohibitedWords.length > 0) {
                    var alertMessage = '请注意当前视频标题或简介中存在以下违禁词：【 ';
                    alertMessage += prohibitedWords + ' 】' + result + '：请仔细检查简介、影片内容、视频标题，无法机器判断通过！';
                    // 弹出提示框
                    screateModal(alertMessage);
                } else if (result !== '') {
                    // 弹出确认对话框
                    screateModal(result);
                } else {
                    console.log('About to submit data');
                    submitData(jsonData);
                    console.log('Data submitted');
                    // showSuccessMessage();
                    console.log('Success message shown');
                    saveAisleIdWithText(jsonData.voList[0].assetId, '快速模式 ' + getCurrentChinaTime());
                    updateExecutionCount();
                }
            }

            // 在当前作用域内调用异步函数
            checkProhibitedWords();

        }

        if (event.key === "1" && lianfams && !kuaisums) {


            // 如果本地存储中的日期与当前日期不一致，将计数器和日期重置
            // 检查本地存储中是否存在executionCount，如果不存在，则设置默认值为600
            if (!localStorage.getItem('executionCount')) {
                localStorage.setItem('executionCount', 999);
            }

            // 如果本地存储中的日期与当前日期不一致，将计数器和日期重置
            if (storedDate !== currentDate) {
                localStorage.setItem('executionDate', currentDate);
                localStorage.setItem('executionCount', 999);
            } else {
                // 如果本地存储中的日期与当前日期一致，递减计数器
                let executionCount = localStorage.getItem('executionCount');
                if (executionCount > 0) {
                    executionCount--;
                    localStorage.setItem('executionCount', executionCount);
                } else {
                    alert('今日次数已达上限');
                    // 不执行后续操作
                    return;
                }
            }

            if (jieweims) {
                // 获取视频元素
                var videoss = document.querySelector("#my-player_html5_api");
                // 初始快进和滚动值
                var rewindTimess = 18000;
                var scrollDistancess = 100;

                // 执行快进功能
                fastForward(videoss, rewindTimess, scrollDistancess);
            }


            const jsonData = {
                auditType: 7,
                labelId: '',
                queryAudit: 0,
                remark: '',
                voList: [{ aisleId: aisleId, assetId: assetId, modifyFields: [], objectStatus: 1, videoType: 1 }]
            };

            // 定义一个异步函数
            async function checkProhibitedWords() {
                // 判断标题和简介是否有违禁词
                // 存放违禁词
                var prohibitedWords = titleContainsChineseWord(mySentence);
                var result = await searchInferiorArtistOrProhibitedWord();
                if (prohibitedWords.length > 0) {
                    var alertMessage = '请注意当前视频标题或简介中存在以下违禁词：【 ';
                    alertMessage += prohibitedWords + ' 】' + result + '：请仔细检查简介、影片内容、视频标题，无法机器判断通过！';
                    // 弹出提示框
                    screateModal(alertMessage);
                } else if (result !== '') {
                    // 弹出确认对话框
                    screateModal(result);
                } else {
                    shouldSubmit = confirm('判断为：通过。确认要提交数据吗?');
                    // 根据用户的选择决定是否继续提交
                    if (shouldSubmit) {
                        submitData(jsonData);
                        dispatchMouseDownAndUpEvent();
                        saveAisleIdWithText(jsonData.voList[0].assetId, '连发模式 ' + getCurrentChinaTime());
                    } else {
                        // 用户选择取消提交，执行相应操作或不执行任何操作
                    }
                }

            }

            // 在当前作用域内调用异步函数
            checkProhibitedWords();

        }


        // 检查按下的键是否为数字 1
        if (event.altKey && event.key === "2") {
            // 获取视频元素
            // 拼接 JSON 对象
            jsonData = {
                auditType: 7,
                labelId: '',
                queryAudit: 0,
                remark: '',
                voList: [{ aisleId: aisleId, assetId: assetId, modifyFields: [], objectStatus: 1, videoType: 1 }]
            };

            // 弹出确认对话框
            shouldSubmit = confirm('确认要执行强制提交数据吗？');
            // 根据用户的选择决定是否继续提交
            if (shouldSubmit) {
                submitData(jsonData);
            } else {
                // 用户选择取消提交，执行相应操作或不执行任何操作
            }
            if (shouldSubmit) {
                submitData(jsonData);
                localStorage.setItem('通过', assetId);
                const data = `操作结果：${shouldSubmit ? '通过' : '未通过'}， assetId：${assetId}， 时间：${getCurrentChinaTime()}`;
                saveAisleIdWithText(jsonData.voList[0].assetId, '强制模式 ' + getCurrentChinaTime());
                updateExecutionCount();

                const existingData = localStorage.getItem('operationData');
                const newData = existingData ? existingData + '\n' + data : data;
                localStorage.setItem('operationData', newData);
            }
        }


        if (event.key === storedKeyweidingxing&& event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {

            // 拼接 JSON 对象
            jsonData = {
                auditType: 7,
                labelId: '',
                queryAudit: 0,
                remark: '',
                voList: [

                    { aisleId: aisleId, assetId: assetId, modifyFields: [], objectStatus: 1, videoType: 1 }

                ],
                riskLabelInfo: [
                    {
                        riskLabelIds: ['30011'],
                        riskRemark: '王力宏',
                        addLocation: 2,
                        assetId: assetId,
                        videoType: 0
                    }
                ]
            };

            // 获取用户输入的备注
            var userRemarksaa = prompt('未定性人物：', jsonData.riskLabelInfo[0].riskRemark);

            // 如果用户输入了备注，更新 jsonData 的 remark 字段

            if (userRemarksaa) {
                jsonData.riskLabelInfo[0].riskRemark = userRemarksaa;
            }


            // 根据用户的选择决定是否继续提交
            if (userRemarksaa) {
                submitData(jsonData);
                saveAisleIdWithText(jsonData.voList[0].assetId, '未定性人物 ' + getCurrentChinaTime());
            } else {
                // 用户选择取消提交，执行相应操作或不执行任何操作
            }
        }

        // 检查按下的键是否为正确
        if (event.key === storedKeyyidingxing&& event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA' ) {

            // 拼接 JSON 对象
            jsonData = {
                auditType: 7,
                labelId: '',
                queryAudit: 0,
                remark: '',
                voList: [

                    { aisleId: aisleId, assetId: assetId, modifyFields: [], objectStatus: 1, videoType: 1 }

                ],
                riskLabelInfo: [
                    {
                        riskLabelIds: ['30010'],
                        riskRemark: '罗志祥',
                        addLocation: 2,
                        assetId: assetId,
                        videoType: 0
                    }
                ]
            };

            // 获取用户输入的备注
            var userRemarksa = prompt('已定性人物：', jsonData.riskLabelInfo[0].riskRemark);

            // 如果用户输入了备注，更新 jsonData 的 remark 字段

            if (userRemarksa) {
                jsonData.riskLabelInfo[0].riskRemark = userRemarksa;
            }

            // 根据用户的选择决定是否继续提交
            if (userRemarksa) {
                submitData(jsonData);
                saveAisleIdWithText(jsonData.voList[0].assetId, '已定性人物 ' + getCurrentChinaTime());
            } else {
                // 用户选择取消提交，执行相应操作或不执行任何操作
            }
        }


    });

    //快捷提交模块


    //存放违禁词
    var teshuzhanghao = ['21745693',
                         '1419992185',
                         '1526798373',
                         '163762584',
                         '1526775791',
                         '1526776666',
                         '1526761996',
                         '1526799133',
                         '1526783380',
                         '1526802700',
                         '1526801268',
                         '1526949990',
                         '1526803153',
                         '1526955023',
                         '1526792086',
                         '1526767896',
                         '416597385',
                         '397392993',
                         '1526952763',
                         '1526952367',
                         '1526783565',
                         '1526789754',
                         '1133724896',
                         '1332189829',
                         '1526951472',
                         '1306200298',
                         '1526759102',
                         '372775139',
                         '280808512',
                         '1575308060',
                         '1526952368',
                         '1575309054',
                         '509906104',
                         '1602722871',
                         '32436702',
                         '193599848',
                         '1602723215',
                         '1586437876',
                         '1510152009',
                         '216385529',
                         '1586211377',
                         '1586446515',
                         '212529086',
                         '1586440795',
                         '726482158',
                         '353212052',
                         '936293216',
                         '1586444032',
                         '1586445750',
                         '216067022',
                         '1198747328',
                         '1586440275',
                         '1586441847',
                         '1602727218',
                         '1593624084',
                         '1485821215',
                         '1602726264',
                         '1586447626',
                         '1586443355',
                         '1411218389',
                         '1068549552',
                         '1586210389',
                         '1593870878',
                         '1263123727',
                         '1586214174',
                         '1369827486',
                         '1208330055',
                         '1586696063',
                         '375184147',
                         '1492253914',
                         '1586443920',
                         '125835704',
                         '1586217814',
                         '1586213569',
                         '1055233208',
                         '922083839',
                         '1586208182',
                         '104661486',
                         '1316824677',
                         '1586442016',
                         '1586697553',
                         '1586695492',
                         '1214154826',
                         '1069000413',
                         '308631149',
                         '452416260',
                         '1515913318',
                         '1586695971',
                         '1586214844',
                         '1586698619',
                         '919856767',
                         '1247384364',
                         '1484876213',
                         '1586442333',
                         '1112763718',
                         '1547385562',
                         '1322641142',
                         '47340231',
                         '1586199839',
                         '1197296659',
                         '1115186909',
                         '1455102403',
                         '1305440306',
                         '1489736397',
                         '1358750980',
                         '1117619715',
                         '1479919447',
                         '1370894684',
                         '1586204109',
                         '176638486',
                         '133400546',
                         '1586205876',
                         '1586216711',
                         '1586209188',
                         '121626116',
                         '1244367315',
                         '1586215706',
                         '1322644618',
                         '1586204061',
                         '1246085638',
                         '1586213811',
                         '1548156630',
                         '1473615362',
                         '1575534986',
                         '1586206555',
                         '1316300512',
                         '1473620414',
                         '1548011510',
                         '1489740707',
                         '1586210698',
                         '1479222157',
                         '1473621753',
                         '1265986155',
                         '1489736298',
                         '1244379610',
                         '1358717485',
                         '1545836592',
                         '1432019037',
                         '1604865164',
                         '1337480388',
                         '1300905638',
                         '1265990435',
                         '1244366816',
                         '1265988967',
                         '1244365965',
                         '1401235365',
                         '1260988744',
                         '1300905339',
                         '1241586447',
                         '1265989578',
                         '1480720149',
                         '1300905319',
                         '1489742260',
                         '1433712580',
                         '575574429',
                         '1300905706',
                         '1473614591',
                         '1260988075',
                         '999107263',
                         '1337483925',
                         '1474001422',
                         '1315207881',
                         '310564542',
                         '1265986555',
                         '1244364786',
                         '1337487938',
                         '1265990762',
                         '1300045890',
                         '1493152473',
                         '1448986335',
                         '1304340156',
                         '1337474386',
                         '1244368548',
                         '1473624115',
                         '1244369462',
                         '1547403293',
                         '1547390461',
                         '1304682869',
                         '1547388765',
                         '1337476432',
                         '1543714917',
                         '1543713432',
                         '1433719601',
                         '1337473319',
                         '1337472342',
                         '1337411404',
                         '1543717167',
                         '1337472000',
                         '1547393005',
                         '1547387359',
                         '1543707048',
                         '1337470991',
                         '1547395794',
                         '1543704764',
                         '1547386823',
                         '1489748467',
                         '1480489117',
                         '1547391502',
                         '1543713765',
                         '1337471996',
                         '1547407588',
                         '1547385086',
                         '1337473082',
                         '1337480061',
                         '1547413359',
                         '1547401047',
                         '1547397270',
                         '1547385585',
                         '1543715575',
                         '1301456103',
                         '1547382921',
                         '1473998495',
                         '1337472594',
                         '1244366413',
                         '1548026978',
                         '1543716196',
                         '1480487298',
                         '1337476217',
                         '1548155573',
                         '1547385876',
                         '1543708417',
                         '1547687043',
                         '1547411060',
                         '1337487567',
                         '1305523594',
                         '1547412981',
                         '1547406657',
                         '1547388026',
                         '1547379499',
                         '1543718838',
                         '1543709797',
                         '1337469491',
                         '206363800',
                         '1543707992',
                         '1548017827',
                         '1543717269',
                         '271118380',
                         '1437733912',
                         '1547390117',
                         '1489743175',
                         '1547403291',
                         '1547396622',
                         '1547382985',
                         '1543710252',
                         '1489772143',
                         '384797778',
                         '1547389930',
                         '1547383843',
                         '1548021122',
                         '1547396783',
                         '1543717400',
                         '1548018179',
                         '1543716732',
                         '1543713916',
                         '1543711521',
                         '1484892944',
                         '1548018897',
                         '1547408353',
                         '1547386698',
                         '1547383373',
                         '1547383818',
                         '1543709272',
                         '1548158764',
                         '1547414604',
                         '1547392511',
                         '245869985',
                         '1548008053',
                         '1547390886',
                         '1547385642',
                         '1547029361',
                         '1548023469',
                         '1547410734',
                         '1376833862',
                         '1548020375',
                         '1547411165',
                         '1547380239',
                         '1547380229',
                         '1548437209',
                         '1548160228',
                         '1547381894',
                         '1543718887',
                         '1388263961',
                         '1337471788',
                         '1548024283',
                         '1547382764',
                         '1337489009',
                         '1548160231',
                         '1547407240',
                         '1547387315',
                         '1337490809',
                         '1337476919',
                         '1548433083',
                         '1548025517',
                         '1337425267',
                         '245928860',
                         '1547380246',
                         '1557220942',
                         '1548160601',
                         '1548025004',
                         '1548020311',
                         '1548018331',
                         '1548011505',
                         '1547394678',
                         '1547390779',
                         '1548027342',
                         '1337476669',
                         '1548435720',
                         '1548160019',
                         '1548157884',
                         '1548006241',
                         '1547403292',
                         '1548432597',
                         '1548432283',
                         '1548021420',
                         '1548014182',
                         '1548003786',
                         '1337484913',
                         '1548434927',
                         '1548432171',
                         '1548160022',
                         '1548159933',
                         '1548159734',
                         '1548158963',
                         '1548016925',
                         '1547397738',
                         '1548019390',
                         '1548014419',
                         '1490935343',
                         '148586508',
                         '136400827',
                         '1548436714',
                         '1548158964',
                         '1548158762',
                         '1337490929',
                         '1605188416',
                         '1548433055',
                         '1548432196',
                         '1548157787',
                         '1548024181',
                         '1526926108',
                         '1337491025',
                         '1315147876',
                         '1548432967',
                         '1548159639',
                         '1548157095',
                         '1548434825',
                         '1548434668',
                         '1548433980',
                         '1548431987',
                         '1548160217',
                         '1548159535',
                         '1548158780',
                         '1548158099',
                         '1548014147',
                         '1548012608',
                         '1322641120',
                         '1548434250',
                         '1548160610',
                         '1548159738',
                         '1548159645',
                         '1548029104',
                         '1548023189',
                         '1337479154',
                         '1548434944',
                         '1548159838',
                         '1548157887',
                         '1548012549',
                         '1490946719',
                         '1337479048',
                         '227814269',
                         '1548436416',
                         '1548434481',
                         '1548434612',
                         '1548159727',
                         '1548027277',
                         '1548006220',
                         '1542220416',
                         '1489769647',
                         '1337480255',
                         '1337477608',
                         '1548434880',
                         '1548433985',
                         '1548159543',
                         '1478935917',
                         '1372204799',
                         '1548434434',
                         '1548014716',
                         '1548011963',
                         '1543679015',
                         '1548158980',
                         '1542218562',
                         '1548435523',
                         '1548159448',
                         '1548159263',
                         '1548158967',
                         '1542221516',
                         '1542220326',
                         '1542219837',
                         '1542209761',
                         '1542206993',
                         '967377142',
                         '1548432570',
                         '1548154011',
                         '1542217393',
                         '1542213354',
                         '1489771578',
                         '1548154634',
                         '1548010280',
                         '1543682343',
                         '1542211097',
                         '1403892534',
                         '1548435660',
                         '1548434874',
                         '1548434457',
                         '1548150778',
                         '1542213703',
                         '1542207386',
                         '1490930921',
                         '1548434884',
                         '1543710067',
                         '1542214709',
                         '1542213766',
                         '1542211523',
                         '1542210974',
                         '1542207856',
                         '1490931562',
                         '1480925535',
                         '1548153552',
                         '1543680484',
                         '1543679773',
                         '1542219026',
                         '1542212046',
                         '1548437610',
                         '1548435036',
                         '1548152531',
                         '1548151270',
                         '1543705865',
                         '1543680719',
                         '1543680151',
                         '1542219421',
                         '1542213950',
                         '1542214710',
                         '1542213365',
                         '1542211102',
                         '1548152392',
                         '1543681738',
                         '1543680440',
                         '1543676054',
                         '1542212330',
                         '1542211563',
                         '1542209275',
                         '1480723215',
                         '1548153326',
                         '1543717829',
                         '1542216900',
                         '1489743613',
                         '1548155063',
                         '1548154589',
                         '1548154280',
                         '1543681403',
                         '1488261298',
                         '1548157402',
                         '1548156109',
                         '1548154581',
                         '1548153993',
                         '1548151586',
                         '1548150971',
                         '1548150874',
                         '1543682735',
                         '1543680546',
                         '1543679706',
                         '1491251004',
                         '1548154065',
                         '1490928595',
                         '1480121423',
                         '1337480419',
                         '1548155918',
                         '1548152610',
                         '1548152490',
                         '1491249107',
                         '1488265067',
                         '1548159827',
                         '1548153374',
                         '1543675491',
                         '1543674987',
                         '1490961623',
                         '1115191507',
                         '1548160319',
                         '1548158864',
                         '1548153090',
                         '362608686',
                         '1548434897',
                         '1548154252',
                         '1542219626',
                         '1488262678',
                         '1548155743',
                         '1548151600',
                         '1542211171',
                         '1491248352',
                         '1489743726',
                         '1400045224',
                         '1490929446',
                         '1337481811',
                         '735279473',
                         '1616346962',
                         '1480031221',
                         '1491253354',
                         '1488266243',
                         '1488266242',
                         '1488264883',
                         '1353015344',
                         '352619358',
                         '1528944715',
                         '1491084875',
                         '1488266344',
                         '1488265752',
                         '1488264970',
                         '1473999777',
                         '1488265264',
                         '1488260992',
                         '1480117473',
                         '1433721103',
                         '1491255510',
                         '1488265653',
                         '1488264885',
                         '1488263077',
                         '1488266241',
                         '1488266051',
                         '1488264969',
                         '1488263860',
                         '1489754701',
                         '1488264884',
                         '1316229394',
                         '1491082489',
                         '1490944524',
                         '1433728964',
                         '1546359549',
                         '1488268708',
                         '1488269802',
                         '1488266443',
                         '1488265944',
                         '1488265263',
                         '1560924067',
                         '1548004289',
                         '1491248719',
                         '1488261299',
                         '1619856845',
                         '1488265652',
                         '1488264968',
                         '1488262871',
                         '1411385348',
                         '1250598027',
                         '1115185617',
                         '1546360810',
                         '1616343005',
                         '1480492343',
                         '1546360879',
                         '1501325372',
                         '1488268913',
                         '1488266052',
                         '1488265068',
                         '1433712032',
                         '1399356870',
                         '27627313',
                         '1548009329',
                         '1491258522',
                         '1480497129',
                         '1463494759',
                         '20674283',
                         '1488265650',
                         '1488264655',
                         '1488263861',
                         '1488259792',
                         '1372133605',
                         '217139577',
                         '1115189653',
                         '363346748',
                         '1599593002',
                         '1599581318',
                         '1491081575',
                         '1488267128',
                         '1488264290',
                         '1482614501',
                         '1480714655',
                         '1480489877',
                         '1305392508',
                         '1546360929',
                         '1546359920',
                         '292760888',
                         '1600590993',
                         '1561707979',
                         '1558030263',
                         '1493016478',
                         '1491249464',
                         '1491246986',
                         '1490943440',
                         '1009296754',
                         '1497182132',
                         '1510148548',
                         '1546358316',
                         '1053618183',
                         '1638279274',
                         '774367342',
                         '303799720',
                         '1616346189',
                         '1614131622',
                         '1613951299',
                         '1612250804',
                         '1600594837',
                         '1600578887',
                         '1599842923',
                         '1599841314',
                         '1599838819',
                         '1599836896',
                         '1599828874',
                         '1599820809',
                         '1599810693',
                         '1599807861',
                         '1599802845',
                         '1599801893',
                         '1548435057',
                         '1548157230',
                         '1548011799',
                         '1548009611',
                         '1548008625',
                         '1547413210',
                         '1547407598',
                         '1547397130',
                         '1547392731',
                         '1547386223',
                         '1532247591',
                         '1491254804',
                         '1491084577',
                         '1490982004',
                         '1490979822',
                         '1490979524',
                         '1490979426',
                         '1490978627',
                         '1490977676',
                         '1490978144',
                         '1490977170',
                         '1490976385',
                         '1490977139',
                         '1490976296',
                         '1490975982',
                         '1490975282',
                         '1490975078',
                         '1490974599',
                         '1489773818',
                         '1489730399',
                         '1480721418',
                         '1480500621',
                         '1510145642',
                         '1510151442',
                         '1510775242',
                         '1491646894',
                         '403014357',
                         '428389677',
                         '1606647014',
                         '1231814715',
                         '1485229662',
                         '1245163943',
                         '1307993920',
                         '285578780',
                         '321677262',
                         '909829920',
                         '297736809',

                        ];


    // 创建用于显示备注信息和 assetId 的元素
    const remarkAndIdDiv = document.createElement('div');
    remarkAndIdDiv.style = `
           position: fixed;
           top: 11%;
           left: 50%;
           transform: translate(-50%, -50%);
           padding: 20px;
           background-color: red;
           color:#fff;
           font-size: 16px;
           border-radius: 5px;
           box-shadow: 0 0 5px red;
           z-index: 9999;
           display: none;`;
    document.body.appendChild(remarkAndIdDiv);

    // 显示备注信息和 assetId
    function showRemarkAndId(id,remark) {
        remarkAndIdDiv.innerText = `预览：ID：${id} 备注信息：${remark}`;
        remarkAndIdDiv.style.display = 'block';

        // 3秒后自动隐藏备注信息和 assetId
        setTimeout(function() {
            hideRemarkAndId();
        }, 1500);
    }

    // 隐藏备注信息和 assetId
    function hideRemarkAndId() {
        remarkAndIdDiv.style.display = 'none';
    }



    // 监听键盘按下事件
    document.addEventListener('keydown',async function(event) {
        var jsonData;
        var shouldSubmit;
        var storekaitoujingpin = getStoredKeykaitoujingpin();
        var storedjieweijingpin = getStoredKeyjieweijingpin();
        var storedKeyliejiyiren = getStoredKeyliejiyiren();
        var storedKeyguanggaotuiguang = getStoredKeyguanggaotuiguang();
        var storedKeywuzizi = getStoredKeywuzizi();
        var storedKeydisu = getStoredKeydisu();
        var storedKeyweijinpian = getStoredKeyweijinpian();
        var storedKeywcn = getStoredKeywcn();
        var storedKeychunsebeijing = getStoredKeychunsebeijing();
        var storedKeyxuexingbaoli = getStoredKeyxuexingbaoli();

        //开头竞品
        if (event.key === storekaitoujingpin&& event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {

            var divElement1 = document.querySelector("div.el-form-item.el-form-item--small > div.el-form-item__content > span.userTags.el-tag.el-tag--warning.el-tag--small.el-tag--dark");
            // 判断元素是否存在
            if (divElement1) {
                // 获取 span 元素的文本内容
                var divText1 = divElement1.innerText;

                // 判断文本内容是否包含 "新闻合规账号"
                if (divText1.includes('新闻资质合规账号')|| divText1.includes('省级融媒账号')|| divText1.includes('视讯内部账号')|| divText1.includes('泛资讯拆条号')) {
                    // 弹窗提醒
                    alert('请注意！当前视频为【新闻合规账号】账号，禁止使用快捷键操作！');
                    return; // 不继续执行后续代码
                }
            }

            var sdivElement1 = document.querySelector("div.el-form-item__content > span.el-tooltip.changered.right_span");
            // 判断元素是否存在
            // 判断元素是否存在
            if (sdivElement1) {
                // 获取 span 元素的文本内容
                var sdivText1 = sdivElement1.innerText;

                // 使用 Array.some 方法来检查是否有违禁词存在
                var hasForbiddenWord1 = teshuzhanghao.some(function(word) {
                    return sdivText1.includes(word);
                });

                if (hasForbiddenWord1) {
                    // 弹窗提醒
                    alert('请注意！当前账号为运营重点账号，驳回前先内部报备！');
                    return; // 不继续执行后续代码
                }
            }

            var divElemen4 = document.querySelector("#app > div > div.content-box > div.content > section > div > div > div.tree.el-col.el-col-24.el-col-xs-3.el-col-sm-3.el-col-md-3 > div > div.el-tree-node.is-current.is-focusable > div > span.custom-tree-node > div");
            // 判断元素是否存在
            if (divElemen4) {
                // 获取 div 元素的文本内容
                var divTex4 = divElemen4.innerText;

                // 判断文本内容是否包含 "长视频"
                if (divTex4.includes('长视频')) {
                    // 弹窗提醒
                    alert('请注意！当前视频为【长视频】通道，禁止使用快捷键操作！');
                    return; // 不继续执行后续代码
                }
            }
            // 拼接JSON对象
            jsonData = {
                //MD5屏蔽
                auditType: 6,
                //竞品引流
                labelId: 6,
                queryAudit: 0,
                remark: '视频开头存在竞品',
                voList: [{ aisleId: aisleId, assetId: assetId, modifyFields: [], objectStatus: 1, videoType: 1 }]
            };

            // 弹出确认对话框
            shouldSubmit = confirm('判定为：单一屏蔽、竞品引流、开头竞品。确认要提交数据吗？');

            // 根据用户的选择决定是否继续提交
            if (shouldSubmit) {
                submitData(jsonData);
                showRemarkAndId(assetId,jsonData.remark); // 显示备注信息和 assetId
                localStorage.setItem('开头竞品', assetId);
                // 操作结果、assetId的值和当前时间
                const data = `操作结果：${shouldSubmit ? '开头竞品' : '未通过'}， assetId：${assetId}， 时间：${getCurrentChinaTime()}`;
                saveAisleIdWithText(jsonData.voList[0].assetId, '开头竞品 ' + getCurrentChinaTime());
                // 将数据保存到localStorage中
                const existingData = localStorage.getItem('operationData');
                const newData = existingData ? existingData + '\n' + data : data;
                localStorage.setItem('operationData', newData);
            } else {
                // 用户选择取消提交，执行相应操作或不执行任何操作
            }
        }


        //结尾竞品
        if (event.key === storedjieweijingpin&& event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {

            var divElement2 = document.querySelector("div.el-form-item.el-form-item--small > div.el-form-item__content > span.userTags.el-tag.el-tag--warning.el-tag--small.el-tag--dark");
            // 判断元素是否存在
            if (divElement2) {
                // 获取 span 元素的文本内容
                var divText2 = divElement2.innerText;

                // 判断文本内容是否包含 "新闻合规账号"
                if (divText2.includes('新闻资质合规账号')|| divText2.includes('省级融媒账号')|| divText2.includes('视讯内部账号')|| divText2.includes('泛资讯拆条号')) {
                    // 弹窗提醒
                    alert('请注意！当前视频为【新闻合规账号】账号，禁止使用快捷键操作！');
                    return; // 不继续执行后续代码
                }
            }


            var sdivElement2 = document.querySelector("div.el-form-item__content > span.el-tooltip.changered.right_span");
            // 判断元素是否存在
            if (sdivElement2) {
                // 获取 span 元素的文本内容
                var sdivText2 = sdivElement2.innerText;

                // 使用 Array.some 方法来检查是否有违禁词存在
                var hasForbiddenWord2 = teshuzhanghao.some(function(word) {
                    return sdivText2.includes(word);
                });

                if (hasForbiddenWord2) {
                    // 弹窗提醒
                    alert('请注意！当前账号为运营重点账号，驳回前先内部报备！');
                    return; // 不继续执行后续代码
                }
            }

            var divElemen1 = document.querySelector("#app > div > div.content-box > div.content > section > div > div > div.tree.el-col.el-col-24.el-col-xs-3.el-col-sm-3.el-col-md-3 > div > div.el-tree-node.is-current.is-focusable > div > span.custom-tree-node > div");
            // 判断元素是否存在
            if (divElemen1) {
                // 获取 div 元素的文本内容
                var divTex1 = divElemen1.innerText;

                // 判断文本内容是否包含 "长视频"
                if (divTex1.includes('长视频')) {
                    // 弹窗提醒
                    alert('请注意！当前视频为【长视频】通道，禁止使用快捷键操作！');
                    return; // 不继续执行后续代码
                }
            }

            // 拼接JSON对象
            jsonData = {
                //MD5屏蔽
                auditType: 6,
                //竞品引流
                labelId: 6,
                queryAudit: 0,
                remark: '视频末尾存在竞品',
                voList: [{ aisleId: aisleId, assetId: assetId, modifyFields: [], objectStatus: 1, videoType: 1 }]
            };

            // 弹出确认对话框
            shouldSubmit = confirm('判定为：单一屏蔽、竞品引流、末尾竞品。确认要提交数据吗？');

            // 根据用户的选择决定是否继续提交
            if (shouldSubmit) {
                submitData(jsonData);
                showRemarkAndId(assetId,jsonData.remark); // 显示备注信息和 assetId
                localStorage.setItem('末尾竞品', assetId);
                // 操作结果、assetId的值和当前时间
                const data = `操作结果：${shouldSubmit ? '末尾竞品' : '未通过'}， assetId：${assetId}， 时间：${getCurrentChinaTime()}`;
                saveAisleIdWithText(jsonData.voList[0].assetId, '末尾竞品 ' + getCurrentChinaTime());
                // 将数据保存到localStorage中
                const existingData = localStorage.getItem('operationData');
                const newData = existingData ? existingData + '\n' + data : data;
                localStorage.setItem('operationData', newData);
            } else {
                // 用户选择取消提交，执行相应操作或不执行任何操作
            }
        }



        //劣迹艺人
        if (event.key === storedKeyliejiyiren&& event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {

            var divElement3 = document.querySelector("div.el-form-item.el-form-item--small > div.el-form-item__content > span.userTags.el-tag.el-tag--warning.el-tag--small.el-tag--dark");
            // 判断元素是否存在
            if (divElement3) {
                // 获取 span 元素的文本内容
                var divText3 = divElement3.innerText;

                // 判断文本内容是否包含 "新闻合规账号"
                if (divText3.includes('新闻资质合规账号')|| divText3.includes('省级融媒账号')|| divText3.includes('视讯内部账号')|| divText3.includes('泛资讯拆条号')) {
                    // 弹窗提醒
                    alert('请注意！当前视频为【新闻合规账号】账号，禁止使用快捷键操作！');
                    return; // 不继续执行后续代码
                }
            }

            var sdivElement3 = document.querySelector("div.el-form-item__content > span.el-tooltip.changered.right_span");
            // 判断元素是否存在
            // 判断元素是否存在
            if (sdivElement3) {
                // 获取 span 元素的文本内容
                var sdivText3 = sdivElement3.innerText;

                // 使用 Array.some 方法来检查是否有违禁词存在
                var hasForbiddenWord3 = teshuzhanghao.some(function(word) {
                    return sdivText3.includes(word);
                });

                if (hasForbiddenWord3) {
                    // 弹窗提醒
                    alert('请注意！当前账号为运营重点账号，驳回前先内部报备！');
                    return; // 不继续执行后续代码
                }
            }

            var divElemen10 = document.querySelector("#app > div > div.content-box > div.content > section > div > div > div.tree.el-col.el-col-24.el-col-xs-3.el-col-sm-3.el-col-md-3 > div > div.el-tree-node.is-current.is-focusable > div > span.custom-tree-node > div");
            // 判断元素是否存在
            if (divElemen10) {
                // 获取 div 元素的文本内容
                var divTex10 = divElemen10.innerText;

                // 判断文本内容是否包含 "长视频"
                if (divTex10.includes('长视频')) {
                    // 弹窗提醒
                    alert('请注意！当前视频为【长视频】通道，禁止使用快捷键操作！');
                    return; // 不继续执行后续代码
                }
            }
            // 拼接JSON对象
            jsonData = {
                //MD5屏蔽
                auditType: 5,
                //竞品引流
                labelId: 3,
                queryAudit: 0,
                remark: '0：00出现:谁',
                voList: [{ aisleId: aisleId, assetId: assetId, modifyFields: [], objectStatus: 1, videoType: 1 }]
            };

            // 获取用户输入的备注
            var userRemar = prompt('请输入您的备注：', jsonData.remark);


            // 如果用户输入了备注，更新 jsonData 的 remark 字段
            if (userRemar) {
                jsonData.remark = userRemar;
                // 弹出确认对话框
                shouldSubmit = confirm('判定为：MD5+视听管理规定 【备注：'+ jsonData.remark + '】 确认要提交数据吗？');
            }

            // 根据用户的选择决定是否继续提交
            if (shouldSubmit) {
                submitData(jsonData);
                showRemarkAndId(assetId,jsonData.remark); // 显示备注信息和 assetId
                localStorage.setItem('劣迹艺人', assetId);
                // 操作结果、assetId的值和当前时间
                const data = `操作结果：${shouldSubmit ? '劣迹艺人' : '未通过'}， assetId：${assetId}， 时间：${getCurrentChinaTime()}`;
                saveAisleIdWithText(jsonData.voList[0].assetId, '劣迹艺人 ' + getCurrentChinaTime());
                // 将数据保存到localStorage中
                const existingData = localStorage.getItem('operationData');
                const newData = existingData ? existingData + '\n' + data : data;
                localStorage.setItem('operationData', newData);
            } else {
                // 用户选择取消提交，执行相应操作或不执行任何操作
            }
        }


        //广告运营
        if (event.key === storedKeyguanggaotuiguang&& event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {

            var divElement4 = document.querySelector("div.el-form-item.el-form-item--small > div.el-form-item__content > span.userTags.el-tag.el-tag--warning.el-tag--small.el-tag--dark");
            // 判断元素是否存在
            if (divElement4) {
                // 获取 span 元素的文本内容
                var divText4 = divElement4.innerText;

                // 判断文本内容是否包含 "新闻合规账号"
                if (divText4.includes('新闻资质合规账号')|| divText4.includes('省级融媒账号')|| divText4.includes('视讯内部账号')|| divText4.includes('泛资讯拆条号')) {
                    // 弹窗提醒
                    alert('请注意！当前视频为【新闻合规账号】账号，禁止使用快捷键操作！');
                    return; // 不继续执行后续代码
                }
            }

            var sdivElement4 = document.querySelector("div.el-form-item__content > span.el-tooltip.changered.right_span");
            // 判断元素是否存在

            if (sdivElement4) {
                // 获取 span 元素的文本内容
                var sdivText4 = sdivElement4.innerText;

                // 使用 Array.some 方法来检查是否有违禁词存在
                var hasForbiddenWord4 = teshuzhanghao.some(function(word) {
                    return sdivText4.includes(word);
                });

                if (hasForbiddenWord4) {
                    // 弹窗提醒
                    alert('请注意！当前账号为运营重点账号，驳回前先内部报备！');
                    return; // 不继续执行后续代码
                }
            }

            var divElemen2 = document.querySelector("#app > div > div.content-box > div.content > section > div > div > div.tree.el-col.el-col-24.el-col-xs-3.el-col-sm-3.el-col-md-3 > div > div.el-tree-node.is-current.is-focusable > div > span.custom-tree-node > div");
            // 判断元素是否存在
            if (divElemen2) {
                // 获取 div 元素的文本内容
                var divTex2 = divElemen2.innerText;

                // 判断文本内容是否包含 "长视频"
                if (divTex2.includes('长视频')) {
                    // 弹窗提醒
                    alert('请注意！当前视频为【长视频】通道，禁止使用快捷键操作！');
                    return; // 不继续执行后续代码
                }
            }
            // 拼接JSON对象
            jsonData = {
                //MD5屏蔽
                auditType: 6,
                //运营需求
                labelId: 20,
                queryAudit: 0,
                remark: '视频中出现广告内容',
                voList: [{ aisleId: aisleId, assetId: assetId, modifyFields: [], objectStatus: 1, videoType: 1 }]
            };

            // 弹出确认对话框
            shouldSubmit = confirm('判定为：单一屏蔽、运营需求—广告。确认要提交数据吗？');

            // 根据用户的选择决定是否继续提交
            if (shouldSubmit) {
                submitData(jsonData);
                showRemarkAndId(assetId,jsonData.remark); // 显示备注信息和 assetId
                localStorage.setItem('广告', assetId);
                // 操作结果、assetId的值和当前时间
                const data = `操作结果：${shouldSubmit ? '广告驳回' : '未通过'}， assetId：${assetId}， 时间：${getCurrentChinaTime()}`;
                saveAisleIdWithText(jsonData.voList[0].assetId, '广告运营 ' + getCurrentChinaTime());
                // 将数据保存到localStorage中
                const existingData = localStorage.getItem('operationData');
                const newData = existingData ? existingData + '\n' + data : data;
                localStorage.setItem('operationData', newData);
            } else {
                // 用户选择取消提交，执行相应操作或不执行任何操作
            }
        }


        //无资质
        if (event.key === storedKeywuzizi&& event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {

            // 获取 span 元素
            var spanElement = document.querySelector('.userTags');

            // 判断元素是否存在
            if (spanElement) {
                // 获取 span 元素的文本内容
                var spanText = spanElement.innerText;

                // 判断文本内容是否包含 ""
                if (spanText.includes('视讯内部账号')||spanText.includes('新闻资质合规账号')||spanText.includes('泛资讯拆条号')||spanText.includes('省级融媒账号')||spanText.includes('中央')||spanText.includes('快审')) {
                    // 弹窗提醒
                    alert('请注意！当前视频为【视讯内部账号】或者【新闻资质合规账号】或【泛资讯拆条号】或【省级融媒账号】或【中央账号】或【快审】不可操作！');
                    return; // 不继续执行后续代码
                }
            }

            // 获取 div 元素
            var divElement = document.querySelector('[data-v-1baefd14].superChannel');

            // 判断元素是否存在
            if (divElement) {
                // 获取 div 元素的文本内容
                var divText = divElement.innerText;

                // 判断文本内容是否包含 "白名单" 或 "新快审"
                if (divText.includes('白名单') || divText.includes('新快审')|| divText.includes('新闻')) {
                    // 弹窗提醒
                    alert('请注意！当前视频为【白名单专审】或者【新快审】或【新闻】或【普通PUG】通道，请勿轻易驳回！');
                    return; // 不继续执行后续代码
                }
            }
            var divElemen = document.querySelector("#app > div > div.content-box > div.content > section > div > div > div.tree.el-col.el-col-24.el-col-xs-3.el-col-sm-3.el-col-md-3 > div > div.el-tree-node.is-current.is-focusable > div > span.custom-tree-node > div");
            // 判断元素是否存在
            if (divElemen) {
                // 获取 div 元素的文本内容
                var divTex = divElemen.innerText;

                // 判断文本内容是否包含 "长视频"
                if (divTex.includes('长视频')) {
                    // 弹窗提醒
                    alert('请注意！当前视频为【长视频】通道，禁止使用快捷键操作！');
                    return; // 不继续执行后续代码
                }
            }
            // 拼接JSON对象
            jsonData = {
                // 单一屏蔽
                auditType: 6,
                // 资质不合规
                labelId: 24,
                queryAudit: 0,
                remark: '暂无发布相关资质',
                voList: [{ aisleId: aisleId, assetId: assetId, modifyFields: [], objectStatus: 1, videoType: 1 }]
            };

            // 弹出确认对话框
            shouldSubmit = confirm('判定为：单一屏蔽、资质不合规。确认要提交数据吗？');

            // 根据用户的选择决定是否继续提交
            if (shouldSubmit) {
                submitData(jsonData);
                //remarkAndIdDiv(assetId); // 显示提交成功浮窗
                showRemarkAndId(assetId,jsonData.remark); // 显示备注信息和 assetId
                localStorage.setItem('新闻驳回', assetId);

                // 操作结果、assetId的值和当前时间
                const data = `操作结果：${shouldSubmit ? '无资质' : '未通过'}， assetId：${assetId}， 时间：${getCurrentChinaTime()}`;
                saveAisleIdWithText(jsonData.voList[0].assetId, '无资质 ' + getCurrentChinaTime());
                // 将数据保存到localStorage中
                const existingData = localStorage.getItem('operationData');
                const newData = existingData ? existingData + '\n' + data : data;
                localStorage.setItem('operationData', newData);
            } else {
                // 用户选择取消提交，执行相应操作或不执行任何操作
            }
        }


        //低俗引导
        if (event.key === storedKeydisu&& event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {

            var divElement6 = document.querySelector("div.el-form-item.el-form-item--small > div.el-form-item__content > span.userTags.el-tag.el-tag--warning.el-tag--small.el-tag--dark");
            // 判断元素是否存在
            if (divElement6) {
                // 获取 span 元素的文本内容
                var divText6 = divElement6.innerText;

                // 判断文本内容是否包含 "新闻合规账号"
                if (divText6.includes('新闻资质合规账号')|| divText6.includes('省级融媒账号')|| divText6.includes('视讯内部账号')|| divText6.includes('泛资讯拆条号')) {
                    // 弹窗提醒
                    alert('请注意！当前视频为【新闻合规账号】账号，禁止使用快捷键操作！');
                    return; // 不继续执行后续代码
                }
            }

            var sdivElement6 = document.querySelector("div.el-form-item__content > span.el-tooltip.changered.right_span");
            // 判断元素是否存在
            // 判断元素是否存在
            if (sdivElement6) {
                // 获取 span 元素的文本内容
                var sdivText6 = sdivElement6.innerText;

                // 使用 Array.some 方法来检查是否有违禁词存在
                var hasForbiddenWord6 = teshuzhanghao.some(function(word) {
                    return sdivText6.includes(word);
                });

                if (hasForbiddenWord6) {
                    // 弹窗提醒
                    alert('请注意！当前账号为运营重点账号，驳回前先内部报备！');
                    return; // 不继续执行后续代码
                }
            }
            var divElemen7 = document.querySelector("#app > div > div.content-box > div.content > section > div > div > div.tree.el-col.el-col-24.el-col-xs-3.el-col-sm-3.el-col-md-3 > div > div.el-tree-node.is-current.is-focusable > div > span.custom-tree-node > div");
            // 判断元素是否存在
            if (divElemen7) {
                // 获取 div 元素的文本内容
                var divTex7 = divElemen7.innerText;

                // 判断文本内容是否包含 "长视频"
                if (divTex7.includes('长视频')) {
                    // 弹窗提醒
                    alert('请注意！当前视频为【长视频】通道，禁止使用快捷键操作！');
                    return; // 不继续执行后续代码
                }
            }
            // 拼接JSON对象
            jsonData = {
                //MD5屏蔽
                auditType: 5,
                //视听管理规
                labelId: 22,
                queryAudit: 0,
                remark: '视频内容含低俗成分',
                voList: [{ aisleId: aisleId, assetId: assetId, modifyFields: [], objectStatus: 1, videoType: 1 }]
            };

            // 弹出确认对话框
            shouldSubmit = confirm('判定为：MD5屏蔽、低俗引导。确认要提交数据吗？');

            // 根据用户的选择决定是否继续提交
            if (shouldSubmit) {
                submitData(jsonData);
                showRemarkAndId(assetId,jsonData.remark); // 显示备注信息和 assetId
                localStorage.setItem('低俗引导', assetId);
                // 操作结果、assetId的值和当前时间
                const data = `操作结果：${shouldSubmit ? '低俗驳回' : '未通过'}， assetId：${assetId}， 时间：${getCurrentChinaTime()}`;
                saveAisleIdWithText(jsonData.voList[0].assetId, '低俗引导 ' + getCurrentChinaTime());
                // 将数据保存到localStorage中
                const existingData = localStorage.getItem('operationData');
                const newData = existingData ? existingData + '\n' + data : data;
                localStorage.setItem('operationData', newData);
            } else {
                // 用户选择取消提交，执行相应操作或不执行任何操作
            }
        }


        //违禁影片
        if (event.key === storedKeyweijinpian&& event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {

            var divElement7 = document.querySelector("div.el-form-item.el-form-item--small > div.el-form-item__content > span.userTags.el-tag.el-tag--warning.el-tag--small.el-tag--dark");
            // 判断元素是否存在
            if (divElement7) {
                // 获取 span 元素的文本内容
                var divText7 = divElement7.innerText;

                // 判断文本内容是否包含 "新闻合规账号"
                if (divText7.includes('新闻资质合规账号')|| divText7.includes('省级融媒账号')|| divText7.includes('视讯内部账号')|| divText7.includes('泛资讯拆条号')) {
                    // 弹窗提醒
                    alert('请注意！当前视频为【新闻合规账号】账号，禁止使用快捷键操作！');
                    return; // 不继续执行后续代码
                }
            }

            var sdivElement7 = document.querySelector("div.el-form-item__content > span.el-tooltip.changered.right_span");
            // 判断元素是否存在
            // 判断元素是否存在
            if (sdivElement7) {
                // 获取 span 元素的文本内容
                var sdivText7 = sdivElement7.innerText;

                // 使用 Array.some 方法来检查是否有违禁词存在
                var hasForbiddenWord7 = teshuzhanghao.some(function(word) {
                    return sdivText7.includes(word);
                });

                if (hasForbiddenWord7) {
                    // 弹窗提醒
                    alert('请注意！当前账号为运营重点账号，驳回前先内部报备！');
                    return; // 不继续执行后续代码
                }
            }

            // 拼接JSON对象
            jsonData = {
                //MD5屏蔽
                auditType: 5,
                //视听管理规
                labelId: 3,
                queryAudit: 0,
                remark: '视频出现违禁影片',
                voList: [{ aisleId: aisleId, assetId: assetId, modifyFields: [], objectStatus: 1, videoType: 1 }]
            };

            // 弹出确认对话框
            shouldSubmit = confirm('判定为：MD5屏蔽、违禁片。确认要提交数据吗？');

            // 根据用户的选择决定是否继续提交
            if (shouldSubmit) {
                submitData(jsonData);
                showRemarkAndId(assetId,jsonData.remark); // 显示备注信息和 assetId
                localStorage.setItem('违禁影片', assetId);
                // 操作结果、assetId的值和当前时间
                const data = `操作结果：${shouldSubmit ? '违禁影片' : '未通过'}， assetId：${assetId}， 时间：${getCurrentChinaTime()}`;
                saveAisleIdWithText(jsonData.voList[0].assetId, '违禁影片 ' + getCurrentChinaTime());
                // 将数据保存到localStorage中
                const existingData = localStorage.getItem('operationData');
                const newData = existingData ? existingData + '\n' + data : data;
                localStorage.setItem('operationData', newData);
            } else {
                // 用户选择取消提交，执行相应操作或不执行任何操作
            }
        }


        //未成年保护
        if (event.key === storedKeywcn&& event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {

            var divElement8 = document.querySelector("div.el-form-item.el-form-item--small > div.el-form-item__content > span.userTags.el-tag.el-tag--warning.el-tag--small.el-tag--dark");
            // 判断元素是否存在
            if (divElement8) {
                // 获取 span 元素的文本内容
                var divText8 = divElement8.innerText;

                // 判断文本内容是否包含 "新闻合规账号"
                if (divText8.includes('新闻资质合规账号')|| divText8.includes('省级融媒账号')|| divText8.includes('视讯内部账号')|| divText8.includes('泛资讯拆条号')) {
                    // 弹窗提醒
                    alert('请注意！当前视频为【新闻合规账号】账号，禁止使用快捷键操作！');
                    return; // 不继续执行后续代码
                }
            }

            var sdivElement8 = document.querySelector("div.el-form-item__content > span.el-tooltip.changered.right_span");
            // 判断元素是否存在
            // 判断元素是否存在
            if (sdivElement8) {
                // 获取 span 元素的文本内容
                var sdivText8 = sdivElement8.innerText;

                // 使用 Array.some 方法来检查是否有违禁词存在
                var hasForbiddenWord8 = teshuzhanghao.some(function(word) {
                    return sdivText8.includes(word);
                });

                if (hasForbiddenWord8) {
                    // 弹窗提醒
                    alert('请注意！当前账号为运营重点账号，驳回前先内部报备！');
                    return; // 不继续执行后续代码
                }
            }

            // 拼接JSON对象
            jsonData = {
                //MD5屏蔽
                auditType: 5,
                //竞品引流
                labelId: 26,
                queryAudit: 0,
                remark: '不良导向',
                voList: [{ aisleId: aisleId, assetId: assetId, modifyFields: [], objectStatus: 1, videoType: 1 }]
            };

            // 弹出确认对话框
            shouldSubmit = confirm('判定为：MD5、未成年人保护。确认要提交数据吗？');

            // 根据用户的选择决定是否继续提交
            if (shouldSubmit) {
                submitData(jsonData);
                showRemarkAndId(assetId,jsonData.remark); // 显示备注信息和 assetId
                localStorage.setItem('未成年保护', assetId);
                // 操作结果、assetId的值和当前时间
                const data = `操作结果：${shouldSubmit ? '未成年保护' : '未通过'}， assetId：${assetId}， 时间：${getCurrentChinaTime()}`;
                saveAisleIdWithText(jsonData.voList[0].assetId, '未成年保护 ' + getCurrentChinaTime());
                // 将数据保存到localStorage中
                const existingData = localStorage.getItem('operationData');
                const newData = existingData ? existingData + '\n' + data : data;
                localStorage.setItem('operationData', newData);
            } else {
                // 用户选择取消提交，执行相应操作或不执行任何操作
            }
        }



        //封面纯色
        if (event.key === storedKeychunsebeijing&& event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {

            var divElement9 = document.querySelector("div.el-form-item.el-form-item--small > div.el-form-item__content > span.userTags.el-tag.el-tag--warning.el-tag--small.el-tag--dark");
            // 判断元素是否存在
            if (divElement9) {
                // 获取 span 元素的文本内容
                var divText9 = divElement9.innerText;

                // 判断文本内容是否包含 "新闻合规账号"
                if (divText9.includes('新闻资质合规账号')|| divText9.includes('省级融媒账号')|| divText9.includes('视讯内部账号')|| divText9.includes('泛资讯拆条号')) {
                    // 弹窗提醒
                    alert('请注意！当前视频为【新闻合规账号】账号，禁止使用快捷键操作！');
                    return; // 不继续执行后续代码
                }
            }

            var sdivElement9 = document.querySelector("div.el-form-item__content > span.el-tooltip.changered.right_span");
            // 判断元素是否存在

            if (sdivElement9) {
                // 获取 span 元素的文本内容
                var sdivText9 = sdivElement9.innerText;

                // 使用 Array.some 方法来检查是否有违禁词存在
                var hasForbiddenWord9 = teshuzhanghao.some(function(word) {
                    return sdivText9.includes(word);
                });

                if (hasForbiddenWord9) {
                    // 弹窗提醒
                    alert('请注意！当前账号为运营重点账号，驳回前先内部报备！');
                    return; // 不继续执行后续代码
                }
            }

            // 拼接JSON对象
            jsonData = {
                //MD5屏蔽
                auditType: 6,
                //视听管理规
                labelId: 5,
                queryAudit: 0,
                remark: '视频封面图为纯色',
                voList: [{ aisleId: aisleId, assetId: assetId, modifyFields: [], objectStatus: 1, videoType: 1 }]
            };

            // 弹出确认对话框
            shouldSubmit = confirm('判定为：单一屏蔽、封面纯色。确认要提交数据吗？');

            // 根据用户的选择决定是否继续提交
            if (shouldSubmit) {
                submitData(jsonData);
                showRemarkAndId(assetId,jsonData.remark); // 显示备注信息和 assetId
                localStorage.setItem('封面纯色', assetId);
                // 操作结果、assetId的值和当前时间
                const data = `操作结果：${shouldSubmit ? '封面纯色' : '未通过'}， assetId：${assetId}， 时间：${getCurrentChinaTime()}`;
                saveAisleIdWithText(jsonData.voList[0].assetId, '封面纯色 ' + getCurrentChinaTime());
                // 将数据保存到localStorage中
                const existingData = localStorage.getItem('operationData');
                const newData = existingData ? existingData + '\n' + data : data;
                localStorage.setItem('operationData', newData);
            } else {
                // 用户选择取消提交，执行相应操作或不执行任何操作
            }
        }


        //血腥暴力
        if (event.key === storedKeyxuexingbaoli&& event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {

            var sdivElement10 = document.querySelector("div.el-form-item__content > span.el-tooltip.changered.right_span");
            // 判断元素是否存在

            if (sdivElement10) {
                // 获取 span 元素的文本内容
                var sdivText10 = sdivElement10.innerText;

                // 使用 Array.some 方法来检查是否有违禁词存在
                var hasForbiddenWord10 = teshuzhanghao.some(function(word) {
                    return sdivText10.includes(word);
                });

                if (hasForbiddenWord10) {
                    // 弹窗提醒
                    alert('请注意！当前账号为运营重点账号，驳回前先内部报备！');
                    return; // 不继续执行后续代码
                }
            }

            // 拼接JSON对象
            jsonData = {
                //MD5屏蔽
                auditType: 5,
                //竞品引流
                labelId: 23,
                queryAudit: 0,
                remark: '画面出现血腥恐怖',
                voList: [{ aisleId: aisleId, assetId: assetId, modifyFields: [], objectStatus: 1, videoType: 1 }]
            };

            // 弹出确认对话框
            shouldSubmit = confirm('判定为：MD5、血腥恐怖。确认要提交数据吗？');

            // 根据用户的选择决定是否继续提交
            if (shouldSubmit) {
                submitData(jsonData);
                showRemarkAndId(assetId,jsonData.remark); // 显示备注信息和 assetId
                localStorage.setItem('血腥恐怖', assetId);
                // 操作结果、assetId的值和当前时间
                const data = `操作结果：${shouldSubmit ? '血腥暴力' : '未通过'}， assetId：${assetId}， 时间：${getCurrentChinaTime()}`;
                saveAisleIdWithText(jsonData.voList[0].assetId, '血腥恐怖 ' + getCurrentChinaTime());
                // 将数据保存到localStorage中
                const existingData = localStorage.getItem('operationData');
                const newData = existingData ? existingData + '\n' + data : data;
                localStorage.setItem('operationData', newData);
            } else {
                // 用户选择取消提交，执行相应操作或不执行任何操作
            }
        }


    });

    //快捷提交模块
    let logArray = [];
    // 解析 JSON 数据并进行处理的函数
    function parseJSONData(data) {
        // 在控制台输出完整的 JSON 数据
        console.log(data);

        // 访问和操作 JSON 数据中的属性和值;
        // 解析和处理数组数据
        var arrayData = data.data;

        arrayData.forEach(function(element) {
            //获取媒资ID
            assetId = element.assetId;
            aisleId = element.aisleId;
            var assetName = element.assetName;
            author = element.author;
            mySentence = element.description + '_____' + element.assetName;
            console.log('assetId:',element.assetId,'+element:',assetName);

            // 检查assetId和aisleId是否为空，并且检查是否已经存在相同ID号的记录
            if (assetId !== null && assetId !== undefined && aisleId !== null && aisleId !== undefined) {
                let isDuplicate = false;
                // 检查logArray中是否已经存在相同ID号的记录
                for (let i = 0; i < logArray.length; i++) {
                    if (logArray[i].assetId === assetId && logArray[i].aisleId === aisleId) {
                        isDuplicate = true;
                        break;
                    }
                }
                // 如果不是重复记录，则存入logArray
                if (!isDuplicate) {
                    logArray.push({assetId: assetId, aisleId: aisleId});
                    // 当logArray的长度超过10条时，删除最早的一条记录
                    if (logArray.length > 20) {
                        logArray.shift();
                    }
                }

            }
        });
    }



    //校准时间
    function getCurrentChinaTime() {
        const currentTime = new Date();
        const chinaTime = new Date(currentTime.getTime() + (currentTime.getTimezoneOffset() + 480) * 60 * 1000);
        const year = chinaTime.getFullYear();
        const month = String(chinaTime.getMonth() + 1).padStart(2, '0');
        const day = String(chinaTime.getDate()).padStart(2, '0');
        const hour = String(chinaTime.getHours()).padStart(2, '0');
        const minute = String(chinaTime.getMinutes()).padStart(2, '0');
        const second = String(chinaTime.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }

    //解析正在做的通道数据
    function parseJSONAuthenticationAisleList(data){
        // 访问和操作 JSON 数据中的属性和值;
        // 解析和处理数组数据
        var arrayData = data.data;

        arrayData.forEach(function(element) {
            //获取正在处理通道ID进行拼接
            authenticationAisleList.push('/oes-csas-manage/audit/fetch?aisleId='+element.aisleId+'&listLength=1');
            console.log('通道连接:','/oes-csas-manage/audit/fetch?aisleId='+element.aisleId+'&listLength=1');
        });
    }


    // 创建用于展示提交成功提示的悬浮窗
    const floatingDiv1 = document.createElement('div');
    floatingDiv1.style = `
    position: fixed;
                        top: 21%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        padding: 20px;
                        background-color: #FFCC00;
                        color: #333333;
                        font-size: 16px;
                        border-radius: 5%;
                        box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
                        z-index: 9999;
                        display: none;
                        `;
    document.body.appendChild(floatingDiv1);


    // 创建用于展示提交成功提示的悬浮窗
    const floatingDiv2 = document.createElement('div');
    floatingDiv2.style = `
    position: fixed;
                        top: 17%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        padding: 15px;
                        background-color: #4CAF50;
                        color: #fff;
                        font-size: 16px;
                        border-radius: 4px;
                        box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
                        z-index: 9999;
                        display: none;
                        `;
    document.body.appendChild(floatingDiv2);
    // 显示悬浮窗
    function showFloatingDiv1() {

        floatingDiv1.innerText = '提交成功 ' + assetId;

        floatingDiv1.style.display = 'block';

        // 1秒后自动隐藏悬浮窗
        setTimeout(function() {
            hideFloatingDiv1();
        }, 1600);
    }
    // 隐藏悬浮窗
    function hideFloatingDiv1() {
        floatingDiv1.style.display = 'none';
    }

    // 显示悬浮窗
    function showFloatingDiv2() {
        floatingDiv1.innerText = '提交失败！';
        floatingDiv1.style.display = 'block';

        // 1秒后自动隐藏悬浮窗
        setTimeout(function() {
            hideFloatingDiv2();
        }, 1600);
    }
    // 隐藏悬浮窗
    function hideFloatingDiv2() {
        floatingDiv1.style.display = 'none';
    }


    //每3小时查询一次公告并提示
    //公告类型转换
    function translateType(type) {
        const dictionary = {
            1001: '涉政内容',
            1002: '色情',
            1003: '低俗',
            1004: '血腥暴力',
            1005: '引人不适',
            1006: '违禁品',
            1007: '违禁行为',
            1008: '未成年人保护',
            1009: '资质合规',
            1010: '运营需求',
            1011: '公序良俗',
            1012: '违规及风险人物',
            1013: '民族宗教',
            1014: '公司专项',
            1015: '其他',
            // 其他类型...
        };

        return dictionary[type] || '未知类型';
    }


    //业务类型转换
    function tslateType(type) {
        const dictionary = {
            1001:'点播审核规则',
            1002:'直播审核规则',
            1003:'互动审核规则',
            1004:'专项审核规则',
            1005:'应急审核策略',
            // 其他类型...
        };

        return dictionary[type] || '未知类型';
    }

    //审核等级转换
    function tsType(type) {
        const dictionary = {
            1001:'A',
            1002:'B',
            1003:'C',
            // 其他类型...
        };

        return dictionary[type] || '未知类型';
    }



    (function getDataAndNotify() {
        fetch('https://oes-coss.miguvideo.com:1443/oes-csas-manage/announcement/list?current=1&size=20')
            .then(response => response.json())
            .then(data => {
            if (data && data.code === 200) {
                const records = data.data.records;
                if (records && records.length > 0) {
                    const latestAnnouncement = records[0];
                    const annType = translateType(latestAnnouncement.announcementType);
                    const businessType = tslateType(latestAnnouncement.businessType);
                    const annTitle = latestAnnouncement.annTitle;
                    const created = latestAnnouncement.created;
                    const annContent = latestAnnouncement.annContent;
                    const maintenanceLevel = tsType(latestAnnouncement.maintenanceLevel);

                    // 构建要显示的文本
                    const message = `公告类型：${annType}\n业务类型：${businessType}\n维护等级：${maintenanceLevel}\n更新时间：${created}\n公告标题：${annTitle}\n公告内容：${annContent}`;

                    // 获取上次保存的公告内容
                    const lastAnnouncement = localStorage.getItem('lastAnnouncement');

                    // 如果公告内容与上次保存的内容不同，强制弹窗显示公告信息
                    if (annContent !== lastAnnouncement) {
                        const confirmed = confirm(message);
                        console.log("公告内容不同，弹窗提醒");

                        // 如果用户点击了确定，则保存最新的公告内容到localStorage中
                        if (confirmed) {
                            localStorage.setItem('lastAnnouncement', annContent);
                        }
                    } else {
                        // 公告内容相同，不再弹窗提醒
                        console.log("公告内容相同，无需提醒");
                    }
                }
            }
        })
            .catch(error => {
            console.error('发生错误：', error);
        });

        setInterval(getDataAndNotify, 10 * 60 * 1000);
    })();



    // 提交数据
    function submitData(jsonData) {

        // 将 JSON 数据转换为字符串
        var jsonString = JSON.stringify(jsonData);
        // 创建 XMLHttpRequest 对象
        var xhr = new XMLHttpRequest();
        // 设置请求信息
        // 替换为目标服务器的URL
        xhr.open('POST', 'https://oes-coss.miguvideo.com:1443/oes-csas-manage/audit/submit', true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        // 设置回调函数
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                //alert('提交成功！');

                // 提交成功后显示悬浮窗
                showFloatingDiv1();

                // 在控制台输出响应数据
                console.log(response);
                // 调用另一个 GET 接口刷新页面
                //refreshPartialPage('https://oes-coss.miguvideo.com:1443/oes-csas-manage/audit/fetch?aisleId=1640366366593208321&listLength=1');

                //模拟点击确定按钮
                //simulateClickAndRefresh();
            } else {
                //alert('提交失败，请手动提交！');
                showFloatingDiv2();
            }
        };

        // 发送请求
        xhr.send(jsonString);
    }


    //10555


    async function searchInferiorArtistOrProhibitedWord() {
        const aiUrl = 'https://oes-coss.miguvideo.com:1443/oes-csas-manage/aia-record/video/result?assetId=' + assetId;
        const aiResult = await getContent(aiUrl);
        let result = '';

        if (aiResult.data) {
            const dataAI = JSON.parse(aiResult.data);

            if (dataAI && dataAI.auditReason !== '通过') {
                const { auditReason, dataList } = dataAI;
                const textSet = new Set();
                const faceNameSet = new Set();

                if (dataList && dataList.length > 0) {
                    for (const dataListValue of dataList) {
                        textSet.add(dataListValue.text);

                        if ('faces' in dataListValue) {
                            for (const face of dataListValue.faces) {
                                const { name } = face;

                                if (name) {
                                    faceNameSet.add(name);
                                }
                            }
                        }
                    }
                } else {
                    // Handle undefined or empty dataList
                }

                const prohibitedWord = titleContainsChineseWord(Array.from(textSet));

                if (prohibitedWord) {
                    result = '当前AI提示此视频字幕存在违禁词：【 ' + prohibitedWord + ' 】';
                }

                const searchInferiorArtistUrl = 'https://oes-coss.miguvideo.com:1443/oes-csas-words/figure/learn/findByPage?current=1&size=20&name=';
                const artistRiskTimeMap = {};

                if (faceNameSet.size !== 0) {
                    const artistPromises = Array.from(faceNameSet).map(async (item) => {
                        const url = searchInferiorArtistUrl + item + '&formerName=&country=&genre=&badProblem=&bak1=&bak2=';
                        const searchInferiorArtistResult = await getContent(url);

                        if (searchInferiorArtistResult && searchInferiorArtistResult.data) {
                            const { total, records } = searchInferiorArtistResult.data;

                            if (total !== 0) {
                                let searchResult = '';

                                for (const record of records) {
                                    const { name, genre, controlDescription } = record;
                                    searchResult += '人物库查询结果：劣迹艺人名称：【 ' + name + ' 】。劣迹类型：' + genre + '。管控描述：' + controlDescription;

                                    const dataItem = dataList.find(item => item.faces && item.faces.some(face => face.name === name));
                                    if (dataItem) {
                                        const { riskTime, filePreviewUrl } = dataItem;
                                        result += '\nAI提示视频内容出现违禁艺人：【' + item + '】【' + searchResult + '】，风险时间：【' + riskTime +'】 + 【'+ filePreviewUrl + '】';
                                    }
                                }
                            }
                        }
                    });

                    await Promise.all(artistPromises);
                }
            }
        }

        return result;
    }


    // 弹出输入密码的页面
    var passwordVerified = false; // 添加一个标志位

    function showInputPassword() {
        var password = prompt('请输入密码：');
        if (password === null) {
            // 点击取消，返回
            return;
        } else {
            // 点击确定，执行密码验证
            if (password === 'MGSPSH2580') { // 替换为你要验证的密码
                passwordVerified = true; // 设置密码验证成功标志位为true
            } else {
                // 密码错误
                alert('密码错误，请重新输入！');
                showInputPassword(); // 继续弹出输入密码的页面
            }
        }
    }

    // 判断长视频通道的驳回
    document.addEventListener('click', function(event) {
        if (passwordVerified) { // 如果密码已经验证成功，则直接返回，不再执行下面的逻辑
            return;
        }

        var buttons = document.getElementsByClassName('el-button el-button--default el-button--small');
        for (var i = 4; i <= 6; i++) {
            var button = buttons[i];
            if (button.textContent.includes('驳回') || button.textContent.includes('驳回当前') || button.textContent.includes('小屏介质不合规')) {
                if (button.classList.contains('highlight')) {
                    var confirmResult = confirm('请注意当前为【长视频】或【无条件】通道！你当前选择了【驳回】或【小屏介质不合规】按钮，请前往【微信群里进行报备并询问是否驳回此视频】注意报备前请先取消驳回按钮的点击操作，以免操作失误，造成无法挽回的后果！');
                    if (confirmResult) {
                        showInputPassword();
                    } else {
                        return;
                    }
                }
            }
        }


    });


    // 刷新页面的函数
    function refreshPartialPage(reloadUrl) {
        // 调用 Fetch API 或其他适合的技术，加载或更新指定区域的内容
        fetch(reloadUrl, {
            method: 'GET'
        })
            .then(function(response) {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('加载局部页面失败');
            }
        })
            .then(function(data) {
            // 更新指定区域的内容// 替换为目标元素的选择器或ID
            var targetElement = document.getElementByClass('content');
            targetElement.innerHTML = data;
        })
            .catch(function(error) {
            console.error(error);
        });
    }


    // 模拟点击 tree 中的一个 div 并刷新局部页面
    function simulateClickAndRefresh() {
        // 替换为 tree div 的 ID 或选择器
        var treeDiv = document.getElementsByClassName('el-tree');
        if (treeDiv) {
            // 替换为要点击的目标 div 的类名
            var targetDiv = treeDiv.querySelector('.el-tree-node is-current is-focusable');
            if (targetDiv) {
                // 监听目标 div 的点击事件
                // 阻止默认的点击事件，防止页面跳转
                targetDiv.addEventListener('click', function(event) {
                    event.preventDefault();

                    // 在点击事件中刷新局部页面
                    // 替换为局部内容的容器元素的 ID 或选择器
                    var partialContentElement = document.getElementsByClassName('aisle_content');
                    if (partialContentElement) {
                        // 使用 AJAX 或其他方式获取新的局部内容，这里仅作为示例直接设置文本内容
                        // 替换为实际获取的局部内容
                        partialContentElement.textContent = 'New partial content';
                    }
                });

                // 触发模拟点击事件
                var event = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                targetDiv.dispatchEvent(event);
            }
        }
    }


    // 获取词库数据


    // 判断中文语句中是否包含特定中文词语
    function containsChineseWord(sentence, word) {
        // 使用 "u" 标志启用 Unicode 正则匹配
        var regex = new RegExp(word, 'u');
        return regex.test(sentence);
    }

    // 判断标题和介绍中是否存在违禁词语
    function titleContainsChineseWord(mySentence) {
        var matchedWords = []; // 存放匹配到的关键词
        for (var i = 0; i < searchWordLibrary.length; i++) {
            var searchWord = searchWordLibrary[i];
            if (containsChineseWord(mySentence, searchWord)) {
                matchedWords.push(searchWord); // 将匹配到的关键词添加到数组中
            }
        }
        var matchedDescriptions = matchedWords.map(function(word) {
            var description = getDescriptionForWord(word);
            return word + (description ? ' => ' + description : '');
        });
        return matchedDescriptions.join('、'); // 使用逗号和空格将关键词和描述分隔开
    }



    // 发起 GET 请求获取腾讯文档内容
    function getTencentDocContent(url) {
        var xhr = new XMLHttpRequest();
        var response;
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                response = JSON.parse(xhr.responseText);
                return response;
            }
        };
        xhr.send();
    }



    // 发起 GET 请求获取通用方法
    function getContent(url) {
        return new Promise(function(resolve, reject) {
            fetch(url)
                .then(function(response) {
                return response.json();
            })
                .then(function(data) {
                resolve(data);
            })
                .catch(function(error) {
                reject(error);
            });
        });
    }




    var queryContentListUrl = 'https://oes-coss.miguvideo.com:1443/oes-csas-manage/content/queryList';
    // 创建提示框元素
    var toast = document.createElement("div");
    toast.style.position = "fixed";
    toast.style.top = "40%";
    toast.style.left = "50%";
    toast.style.transform = "translate(-50%, -50%)";
    toast.style.backgroundColor = "#EBEBEB";
    toast.style.color = " #000";
    toast.style.padding = "10px";
    toast.style.borderRadius = "5px";
    toast.style.zIndex = "9999";

    // 获取当前日期
    var currentDate = new Date();
    var currentDateString =
        (currentDate.getMonth() + 1) +
        '月' +
        currentDate.getDate() +
        '号';

    // 确定按钮样式
    var btnContainer = document.createElement("div");
    btnContainer.style.textAlign = "center"; // 居中对齐
    btnContainer.style.padding = "10px"

    var closeBtn = document.createElement("button");
    closeBtn.textContent = "确定";
    closeBtn.style.padding = "8px"

    // 显示审核数据数量
    function displayDataCount(totalPass, totalFail) {
        var content = "日期：" + currentDateString + "<br>" +
            "审核通过：" + totalPass + "<br>" +
            "审核不通过：" + totalFail+ "<br>" +
            "当日总量：" + todayTotal;
        ;

        toast.innerHTML = content;

        // 将确认按钮添加到按钮容器中
        btnContainer.appendChild(closeBtn);
        // 将按钮容器添加到提示框中
        toast.appendChild(btnContainer);

        // 将提示框添加到页面中
        document.body.appendChild(toast);

        // 添加确定按钮的点击事件
        closeBtn.addEventListener("click", function () {
            // 点击按钮后移除提示框
            document.body.removeChild(toast);
        });
    }

    // 查询审核数据
    function schAuditorContent(auditStatus, callback) {
        // 获取当前日期
        var currentDate = new Date();
        // 格式化当前日期为字符串（年-月-日 时:分:秒）
        var currentDateString =
            currentDate.getFullYear() +
            '-' +
            (currentDate.getMonth() + 1) +
            '-' +
            currentDate.getDate();

        // 拼接Post查询的JSON
        var jsonData = {
            "aiAuditStatus": "",
            "aisleEndTime": "",
            "aisleId": "",
            "aisleStartTime": "",
            "assetId": "",
            "auditor": userName1,
            "auditStatus": auditStatus, // 设置审核状态
            "auditType": "",
            "author": "",
            "collectEndTime": "",
            "collectStartTime": "",
            "costTime": "",
            "createTimeEndTime": "",
            "createTimeStartTime": "",
            "displayName": "",
            "endTime": currentDateString + " 23:59:59", // 设置结束时间为当天最后一秒
            "exclusiveKeyword": "",
            "keywords": "",
            "labelId": "",
            "location": "2",
            "MD5": "",
            "mediumStatus": "",
            "occurred": "",
            "otherKeyword": "",
            "pageNum": 1,
            "pageSize": 100,
            "riskList": [],
            "secondClassCode": "",
            "startTime": currentDateString + " 00:00:00", // 设置开始时间为当天第一秒
            "thirdClassCode": "",
            "titleKeyword": "",
            "userId": "",
            "userRiskList": [],
            "videoType": ""
        };

        schData(jsonData, callback);
    }


    // 查询审核数据
    function schAuditorContents(auditStatus, callback) {
        // 获取当前日期
        var currentDate = new Date();
        // 获取前一天的日期
        var previousDate = new Date();
        previousDate.setDate(currentDate.getDate() - 1);

        // 格式化日期为字符串（年-月-日 时:分:秒）
        var currentDateString =
            currentDate.getFullYear() +
            '-' +
            (currentDate.getMonth() + 1) +
            '-' +
            currentDate.getDate();

        var previousDateString =
            previousDate.getFullYear() +
            '-' +
            (previousDate.getMonth() + 1) +
            '-' +
            previousDate.getDate();


        // 拼接Post查询的JSON
        var jsonData = {
            "aiAuditStatus": "",
            "aisleEndTime": "",
            "aisleId": "",
            "aisleStartTime": "",
            "assetId": "",
            "auditor": userName1,
            "auditStatus": auditStatus, // 设置审核状态
            "auditType": "",
            "author": "",
            "collectEndTime": "",
            "collectStartTime": "",
            "costTime": "",
            "createTimeEndTime": "",
            "createTimeStartTime": "",
            "displayName": "",
            "endTime": currentDateString + " 09:00:00", // 设置结束时间为当天最后一秒
            "exclusiveKeyword": "",
            "keywords": "",
            "labelId": "",
            "location": "2",
            "MD5": "",
            "mediumStatus": "",
            "occurred": "",
            "otherKeyword": "",
            "pageNum": 1,
            "pageSize": 100,
            "riskList": [],
            "secondClassCode": "",
            "startTime": previousDateString + " 21:00:00", // 设置开始时间为当天第一秒
            "thirdClassCode": "",
            "titleKeyword": "",
            "userId": "",
            "userRiskList": [],
            "videoType": ""
        };

        schData(jsonData, callback);
    }

    // 查询数据
    function schData(jsonData, callback) {
        // 将 JSON 数据转换为字符串
        var jsonString = JSON.stringify(jsonData);

        // 创建 XMLHttpRequest 对象
        var xhr = new XMLHttpRequest();

        // 设置请求信息
        // 替换为目标服务器的URL
        xhr.open('POST', queryContentListUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        // 设置回调函数
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                var total = response.data.total;

                // 调用回调函数，并传递数据数量
                callback(total);
            }
        };

        // 发送请求
        xhr.send(jsonString);
    }


    ///////////8.17


    // 获取当天时间
    function getCurrentTime() {
        var currentDate = new Date();

        // 获取年份、月份、日期、小时、分钟和秒数
        var year = currentDate.getFullYear();
        // 月份从0开始，需要加1，并确保两位数格式
        var month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
        // 获取日期，并确保两位数格式
        var day = ('0' + currentDate.getDate()).slice(-2);
        // 获取小时，并确保两位数格式
        var hours = ('0' + currentDate.getHours()).slice(-2);
        // 获取分钟，并确保两位数格式
        var minutes = ('0' + currentDate.getMinutes()).slice(-2);
        // 获取秒数，并确保两位数格式
        var seconds = ('0' + currentDate.getSeconds()).slice(-2);

        // 拼接成当天的时间字符串
        currentTime = year + '-' + month + '-' + day;

        // 在控制台输出当天时间
        console.log('当天时间:', currentTime);
    }

    // 获取当天时间
    function getCurrentHoursTime() {
        var currentDate = new Date();

        // 获取年份、月份、日期、小时、分钟和秒数
        var year = currentDate.getFullYear();
        // 月份从0开始，需要加1，并确保两位数格式
        var month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
        // 获取日期，并确保两位数格式
        var day = ('0' + currentDate.getDate()).slice(-2);
        // 获取小时，并确保两位数格式
        var hours = ('0' + currentDate.getHours()).slice(-2);
        // 获取分钟，并确保两位数格式
        var minutes = ('0' + currentDate.getMinutes()).slice(-2);
        // 获取秒数，并确保两位数格式
        var seconds = ('0' + currentDate.getSeconds()).slice(-2);

        if(parseInt(hours) === 23){
            //下一个小时
            var dayHours = parseInt(day) + 1;
            //拼接当小时时间段
            currentHoursTime = '&startTime=' + year + '-' + month + '-' + day + ' 23:00:00&endTime='+ year + '-' + month + '-' + dayHours + ' 00:00:00&current=1&size=10';
        }else{
            //下一个小时
            var nextHours = parseInt(hours) + 1;
            //拼接当小时时间段
            currentHoursTime = '&startTime=' + year + '-' + month + '-' + day + ' ' + hours + ':00:00&endTime='+ year + '-' + month + '-' + day + ' ' + nextHours + ':00:00&current=1&size=10';
        }


        // 在控制台输出当天时间
        console.log('当小时时间:', currentHoursTime);
    }


    // 获取当月时间
    function getCurrentMonth() {
        var currentDate = new Date();

        // 获取年份、月份，并确保两位数格式
        var year = currentDate.getFullYear();
        var month = ('0' + (currentDate.getMonth() + 1)).slice(-2);

        // 获取当月第一天和最后一天日期对象
        var firstDay = new Date(year, currentDate.getMonth(), 1);
        var lastDay = new Date(year, currentDate.getMonth() + 1, 0);

        // 获取小时、分钟和秒数，并确保两位数格式
        var hours = ('0' + currentDate.getHours()).slice(-2);
        var minutes = ('0' + currentDate.getMinutes()).slice(-2);
        var seconds = ('0' + currentDate.getSeconds()).slice(-2);

        // 拼接成当月第一天和最后一天的字符串
        currentTime1 = year + '-' + month + '-' + firstDay.getDate();
        currentTime2 = year + '-' + month + '-' + lastDay.getDate();

        // 在控制台输出当天时间
        console.log('当月时间:', currentTime1, currentTime2);
    }




    // 函数：添加元素到Set
    function addToSet(value,setName) {
        if (value === null || value === undefined || value === '') {
            return; // 不允许存储空值
        }
        var set = getSet(setName);
        if (!set.includes(value)) {
            set.push(value);
            saveSet(set,setName);
        }
    }

    // 函数：从Set中移除元素
    function removeFromSet(value,setName) {
        var set = getSet(setName);
        var index = set.indexOf(value);
        if (index !== -1) {
            set.splice(index, 1);
            saveSet(set,setName);
        }
    }

    // 函数：获取Set
    function getSet(setName) {
        var setString = localStorage.getItem(setName);
        if (setString) {
            return JSON.parse(setString);
        } else {
            return [];
        }
    }

    // 函数：保存Set
    function saveSet(set,setName) {
        localStorage.setItem(setName, JSON.stringify(set));
    }

    document.addEventListener("keydown", function(event) {
        var video = document.querySelector("#my-player_html5_api");
        var rewindTime = 5; // 快退/快进时间（秒）
        var scrollDistance = 100; // 滚动距离
        var playbackSpeed = parseFloat(localStorage.getItem("playbackSpeed")) || 1.0;

        if (event.key === "ArrowLeft" && isPlaybackSpeedEnabled ) {
            event.preventDefault(); // 禁用浏览器默认操作
            // 按下 "a" 键或者右箭头键时执行的操作（快退）
            video.currentTime -= rewindTime; // 快退 rewindTime 秒
            window.scrollBy(-scrollDistance, 0); // 向左滚动 scrollDistance 像素
            console.log("快退");

            // 更新时间和滚动距离
            rewindTime -= 5;
            scrollDistance += rewindTime * 10;
        } else if (event.key === "ArrowRight" && isPlaybackSpeedEnabled) {
            event.preventDefault(); // 禁用浏览器默认操作
            // 按下 "d" 键或者左箭头键时执行的操作（快进）
            video.currentTime += rewindTime; // 快进 rewindTime 秒
            window.scrollBy(scrollDistance, 0); // 向右滚动 scrollDistance 像素
            console.log("快进");

            // 更新时间和滚动距离
            rewindTime += 5;
            scrollDistance += rewindTime * 10;
        } else if (event.altKey && event.key === "k") {
            event.preventDefault(); // 禁用浏览器默认操作
            var duration = video.duration; // 获取视频时长
            var jumpToSecond = parseFloat(prompt("请输入要跳转的秒数（0-" + duration + "）")); // 弹出提示框输入要跳转的秒数
            if (!isNaN(jumpToSecond) && jumpToSecond >= 0 && jumpToSecond <= duration) {
                video.currentTime = jumpToSecond; // 跳转到指定秒数
            }
        }

        if (event.key === "ArrowUp" && isPlaybackSpeedEnabled) {
            event.preventDefault(); // 禁用浏览器默认操作
            if (playbackSpeed === 1.0) {
                playbackSpeed = 2.0; // 将播放速度设置为 2 倍
            } else if (playbackSpeed === 2.0) {
                playbackSpeed = 3.0; // 将播放速度设置为 3 倍
            } else if (playbackSpeed === 3.0) {
                playbackSpeed = 4.0; // 将播放速度设置为 4 倍
            } else if (playbackSpeed === 4.0) {
                playbackSpeed = 5.0; // 将播放速度设置为 5 倍
            } else if (playbackSpeed === 5.0) {
                playbackSpeed = 6.0; // 将播放速度设置为 6 倍
            } else {
                playbackSpeed = 1.0; // 将播放速度设置为默认值 1.0
            }

            video.playbackRate = playbackSpeed; // 应用当前播放速度到视频

            localStorage.setItem("playbackSpeed", playbackSpeed); // 保存播放速度到本地存储
        }
    });

    document.addEventListener("keydown", function(event) {
        if (event.keyCode === 90 && isPlaybackSpeedEnabled) { // 检查按下的键是 "Z" 键
            event.preventDefault(); // 阻止浏览器执行默认的 "X" 键行为
            var video = document.querySelector("#my-player_html5_api");
            video.playbackRate = 6; // 将播放速度设置为 6 倍
        }
    });

    document.addEventListener("keyup", function(event) {
        if (event.keyCode === 90 && isPlaybackSpeedEnabled) { // 检查松开的键是 "Z" 键
            event.preventDefault(); // 阻止浏览器执行默认的 "X" 键行为
            var video = document.querySelector("#my-player_html5_api");
            video.playbackRate = 1; // 将播放速度设置回默认值
        }
    });

    //存放违禁词2
    var searchWordLibrary2 = ['还珠格格','功夫足球','老炮儿','青云志','香蜜','国色天香','康熙微服私访记','仙女湖','无名侦探','人面鱼','山河令','一起来看流星雨','晓说','披荆斩棘的哥哥','追影','黑客帝国','监狱风云','那些年','狂飙','希望之鸽','天龙八部',
                              '百变大咖秀','封神榜','桃姐','My Way','孔雀王','纤夫的爱','中国梦想秀','福星高照猪八戒','芈月传','一不小心捡到爱','踏血寻梅','灭门惨案','风云','杨门虎将','大时代','剑雨','武媚娘传奇','演员请就位','致青春','动物世界','一千零一夜','卷珠帘','孽债',
                              '奇谋','高怀远','红衣小女孩','宫锁连城','古剑奇谭','大武生','肖邦传奇','花木兰','生死时速','龙虎风云','小时代','钟阿四','倚天屠龙记','乱世英雄吕不韦','音乐大师课','婆婆媳妇小姑','新少林五祖','断点','奇迹','中国达人秀',
                              '媳妇的美好时代','曹操','琉璃','人生若如初见','港片','秦霜','幸福一定强','少年包青天','亲爱的','西游伏妖篇','暗夜行者','欢乐颂2','中国好歌曲','让子弹飞','佟云开','局外者','不能说的夏天','诡爱','夏至未至','同桌的你','李斯特钢琴','边走边唱','疾速特攻',
                              '古惑仔','罪途','家有仙妻','大明王朝惊变录','杨钰莹','妲己','酷爱','祝福','海派清口','决战刹马镇','魏忠贤','遇见你之后','风再起时','头文字','烈火雄心II','数风流人物','空天猎','画皮','夏有乔木雅望天堂','镜·双城',
                              '白鹿原','披荆斩棘的哥哥','边境风云','蓝启明','赵东生','非诚勿扰','爱缤纷','悟空传','分手说爱你','疾速追杀','乌鸦哥','长安十二时辰','神仙老爸','水浒传','心雨','鸡同鸭讲','壹周立波','新上海滩','天盛长歌','我的小尾巴','三个字',
                              '热血男人帮','雄霸','塔娜','锦衣卫','欧洲攻略','隐秘而伟大','封神演义','说唱人','一九四二','黄飞鸿新传','演员的诞生','中国梦之声','追光吧！哥哥','男儿本色','约翰威克','逃学威龙','至尊红颜','金陵十三钗','阿修罗','出彩中国人','许文强','芳华','宁安如梦','大好时光',
                              '四大名捕','花木兰','十月围城','画魂','中国新说唱','我在北京等你','子虚','1942','光辉岁月','白鹿原','我们恋爱吧','危险关系','东陵大盗','春光灿烂猪八戒','澳门风云','女人俱乐部','绣春刀','明星大侦探','艾琦','不能说的秘密','新少林寺','情深深雨濛濛','潮流合伙人','建军大业','左手指月','慕白',
                              '我在颐和园等你','惊爆点','孙殿英','风云天地','青云志','超新星运动会','无间道','戛纳红毯','依萍','古剑奇谭','最后一个太监','康斯坦丁','反黑2','锦毛鼠白玉堂','南烟斋笔录','聂泽宁','枭雄','小燕子','这！就是灌篮','廉政行动',
                              '奇异博士','尚气','尚气与十戒传奇','杀婴','地铁女士','我推的孩子','猫汤','小熊维尼之血与蜜','黑海夺金','黑海浩劫','黑海潜航','黑海夺金','亡灵幻境','刀剑神域','东京食尸鬼','我无法融入这个世界','饿狼谷','九姓乌古斯','粉红理论','木与水','中美竞争——日益增长的危机背后是什么','国家因你而伟大',
                              '中国劳工受迫害黑幕','话今忆旧60载','思春三姐妹','苏联往事','装甲骑女伊莉丝','圣痕炼金士','亲吻那片花瓣','白色天使们的轮舞','邪斗邪','变态生理研究班','犬齿之家','皇帝寝宫秘籍','午夜女豹','超昂闪忍遥','精灵的双子姬','囚笼','全民情敌','青春歪传',
                              '遇灵记','探灵笔录','灵怨','界师之觉醒','死亡岛','我的天劫女友','小熊维尼：血与蜜','唐人街探案2','何以为家','无耻之徒','闺中男蜜','Battlefield','扶摇直上','旺达', '奇异博士3','死亡代理人','帝国崛起','电锯人','寄生兽','死亡笔记','猫汤','伊拉克恶狼','无耻之徒','地狱乐','战锤：末世鼠疫','暗杀教室','谢文东','我的英雄学院','隐入尘烟','人体蜈蚣','阴阳师',
                              '红色警戒','喋血复仇','生化危机','国家统治者','巫师3','坦克世界亚服','古墓丽影9','七日杀','杀手6','恐惧之夜','杀戮空间','黑暗之魂系','冷战热斗','逃生','热血无赖','死亡空间','舰队','钢铁雄心','如龙','战地3','黎明杀机','求生之路','僵尸生存大战','肮脏的中餐馆','工程车救援队','雇佣兵','提督之决断','帝国时代',

                             ];

    // 获取违禁词的描述2
    function getDescriptionForWord2(word) {
        // 存放违禁词描述
        var descriptions = {
            '还珠格格':'范冰冰','武媚娘传奇':'范冰冰','少年包青天':'范冰冰','空天猎':'范冰冰','塔娜':'范冰冰','十月围城':'范冰冰','新少林寺':'范冰冰','戛纳红毯':'范冰冰',
            '功夫足球':'赵薇','演员请就位':'赵薇','亲爱的':'赵薇','画皮':'赵薇','锦衣卫':'赵薇','画魂':'赵薇','情深深雨濛濛':'赵薇','依萍':'赵薇','小燕子':'赵薇',
            '老炮儿':'吴亦凡','欧洲攻略':'吴亦凡','致青春':'吴亦凡','西游伏妖篇':'吴亦凡','夏有乔木雅望天堂':'吴亦凡','中国新说唱':'吴亦凡','潮流合伙人':'吴亦凡',
            '青云志':'李易峰','动物世界':'李易峰','暗夜行者':'李易峰','镜·双城':'李易峰','隐秘而伟大':'李易峰','我在北京等你':'李易峰','建军大业':'李易峰','古剑奇谭':'李易峰','这！就是灌篮':'李易峰',
            '香蜜':'邓伦','一千零一夜':'邓伦','欢乐颂2':'邓伦','白鹿原':'邓伦','封神演义':'邓伦','子虚':'邓伦','左手指月':'邓伦',
            '国色天香':'霍尊','卷珠帘':'霍尊','中国好歌曲':'霍尊','披荆斩棘的哥哥':'霍尊','说唱人':'霍尊',
            '康熙微服私访记':'张默', '孽债':'张默', '让子弹飞':'张默', '边境风云':'张默', '一九四二':'张默', '1942':'张默',
            '仙女湖':'莫少聪', '奇谋':'莫少聪', '佟云开':'莫少聪', '蓝启明':'莫少聪', '黄飞鸿新传':'莫少聪', '光辉岁月':'莫少聪', '慕白':'莫少聪', '最后一个太监':'莫少聪',
            '无名侦探':'翟天临','高怀远':'翟天临','局外者':'翟天临','赵东生':'翟天临','演员的诞生':'翟天临','白鹿原':'翟天临',
            '人面鱼':'徐若瑄','红衣小女孩':'徐若瑄','不能说的夏天':'徐若瑄','非诚勿扰':'徐若瑄','中国梦之声':'徐若瑄',
            '山河令':'张哲瀚','宫锁连城':'张哲瀚','诡爱':'张哲瀚','爱缤纷':'张哲瀚',
            '一起来看流星雨':'郑爽','古剑奇谭':'郑爽','夏至未至':'郑爽','悟空传':'郑爽','追光吧！哥哥':'郑爽','我们恋爱吧':'郑爽','我在颐和园等你':'郑爽',
            '晓说':'高晓松','大武生':'高晓松','同桌的你':'高晓松',
            '披荆斩棘的哥哥':'李云迪','肖邦传奇':'李云迪','李斯特钢琴':'李云迪',
            '追影':'房祖名','花木兰':'房祖名','边走边唱':'房祖名','分手说爱你':'房祖名','男儿本色':'房祖名',
            '黑客帝国':'基努里维斯','生死时速':'基努里维斯','疾速特攻':'基努里维斯','疾速追杀':'基努里维斯','约翰威克':'基努里维斯','危险关系':'基努里维斯','惊爆点':'基努里维斯','康斯坦丁':'基努里维斯',
            '监狱风云':'张耀扬','龙虎风云':'张耀扬','古惑仔':'张耀扬','乌鸦哥':'张耀扬','逃学威龙':'张耀扬','东陵大盗':'张耀扬','孙殿英':'张耀扬','反黑2':'张耀扬',
            '那些年':'柯震东','小时代':'柯震东',
            '狂飙':'含笑','钟阿四':'含笑','罪途':'含笑','长安十二时辰':'含笑',
            '希望之鸽':'孙兴','倚天屠龙记':'孙兴','家有仙妻':'孙兴','神仙老爸':'孙兴','至尊红颜':'孙兴','春光灿烂猪八戒':'孙兴','风云天地':'孙兴','锦毛鼠白玉堂':'孙兴',
            '天龙八部':'高虎','乱世英雄吕不韦':'高虎','大明王朝惊变录':'高虎','水浒传':'高虎','金陵十三钗':'高虎','澳门风云':'高虎','嬴异人':'高虎',
            '百变大咖秀':'毛宁','音乐大师课':'毛宁','杨钰莹':'毛宁','心雨':'毛宁',
            '封神榜':'傅艺伟','婆婆媳妇小姑':'傅艺伟','妲己':'傅艺伟',
            '桃姐':'叶德娴','新少林五祖':'叶德娴',
            'My Way':'张敬轩','断点':'张敬轩','酷爱':'张敬轩',
            '孔雀王':'叶蕴仪','奇迹':'叶蕴仪','祝福':'叶蕴仪','鸡同鸭讲':'叶蕴仪','阿修罗':'叶蕴仪','女人俱乐部':'叶蕴仪',
            '纤夫的爱':'尹相杰',
            '中国梦想秀':'周立波','中国达人秀':'周立波','海派清口':'周立波','壹周立波':'周立波','出彩中国人':'周立波',
            '福星高照猪八戒':'黄海波','媳妇的美好时代':'黄海波','决战刹马镇':'黄海波','新上海滩':'黄海波','许文强':'黄海波',
            '芈月传':'赵立新','曹操':'赵立新','魏忠贤':'赵立新','天盛长歌':'赵立新','芳华':'赵立新','绣春刀':'赵立新','青云志':'赵立新','南烟斋笔录':'赵立新',
            '一不小心捡到爱':'周峻纬','琉璃':'周峻纬','遇见你之后':'周峻纬','我的小尾巴':'周峻纬','宁安如梦':'周峻纬','明星大侦探':'周峻纬','超新星运动会':'周峻纬','聂泽宁':'周峻纬',
            '踏血寻梅':'春夏','人生若如初见':'春夏','风再起时':'春夏','三个字':'春夏','大好时光':'春夏','艾琦':'春夏',
            '灭门惨案':'黄秋生','港片':'黄秋生','头文字':'黄秋生','热血男人帮':'黄秋生','四大名捕':'黄秋生','不能说的秘密':'黄秋生','无间道':'黄秋生','枭雄':'黄秋生','廉政行动':'黄秋生',
            '风云':'王喜','秦霜':'王喜','烈火雄心II':'王喜','雄霸':'王喜','花木兰':'王喜',
            '杨门虎将':'牛萌萌','幸福一定强':'牛萌萌','数风流人物':'牛萌萌',
            '大时代':'吴启明',
            '剑雨':'戴立忍',
            '红色警戒':'违禁游戏','喋血复仇':'违禁游戏','生化危机':'违禁游戏','国家统治者':'违禁游戏','巫师3':'违禁游戏','坦克世界亚服':'违禁游戏',
            '古墓丽影9':'违禁游戏','七日杀':'违禁游戏','杀手6':'违禁游戏','恐惧之夜':'违禁游戏','杀戮空间':'违禁游戏','黑暗之魂':'违禁游戏',
            '冷战热斗':'违禁游戏','逃生':'戴立忍','热血无赖':'违禁游戏','死亡空间':'违禁游戏','舰队':'违禁游戏','钢铁雄心':'违禁游戏',
            '如龙':'违禁游戏','战地3':'违禁游戏','黎明杀机':'违禁游戏','求生之路':'违禁游戏','僵尸生存大战':'违禁游戏','肮脏的中餐馆':'违禁游戏',
            '工程车救援队':'戴立忍','违禁游戏':'戴立忍','提督之决断':'违禁游戏','帝国时代':'违禁游戏',
            '奇异博士2':'违禁影片','尚气':'违禁影片','尚气与十戒传奇':'违禁影片','杀婴':'违禁影片','地铁女士':'违禁影片','我推的孩子':'违禁影片','猫汤':'违禁影片','小熊维尼之血与蜜':'违禁影片','黑海夺金':'违禁影片','黑海浩劫':'违禁影片','黑海潜航':'违禁影片','黑海夺金':'违禁影片','亡灵幻境':'违禁影片','刀剑神域':'违禁影片','东京食尸鬼':'违禁影片','我无法融入这个世界':'违禁影片','饿狼谷':'违禁影片','九姓乌古斯':'违禁影片','粉红理论':'违禁影片','木与水':'违禁影片','中美竞争——日益增长的危机背后是什么':'违禁影片','国家因你而伟大':'违禁影片',
            '中国劳工受迫害黑幕':'违禁影片','话今忆旧60载':'违禁影片','思春三姐妹':'违禁影片','苏联往事':'违禁影片','装甲骑女伊莉丝':'违禁影片','圣痕炼金士':'违禁影片','亲吻那片花瓣':'违禁影片','白色天使们的轮舞':'违禁影片','邪斗邪':'违禁影片','变态生理研究班':'违禁影片','犬齿之家':'违禁影片','皇帝寝宫秘籍':'违禁影片','午夜女豹':'违禁影片','超昂闪忍遥':'违禁影片','精灵的双子姬':'违禁影片','囚笼':'违禁影片','全民情敌':'违禁影片','青春歪传':'违禁影片',
            '遇灵记':'违禁影片','探灵笔录':'违禁影片','灵怨':'违禁影片','界师之觉醒':'违禁影片','死亡岛':'违禁影片','我的天劫女友':'违禁影片','小熊维尼：血与蜜':'违禁影片','唐人街探案2':'违禁影片','何以为家':'戴立忍','无耻之徒':'违禁影片','闺中男蜜':'戴立忍','Battlefield':'违禁影片','扶摇直上':'违禁影片','旺达':'违禁影片', '奇异博士3':'违禁影片','死亡代理人':'违禁影片','帝国崛起':'违禁影片','电锯人':'违禁影片','寄生兽':'违禁影片','死亡笔记':'违禁影片','猫汤':'违禁影片','伊拉克恶狼':'违禁影片','无耻之徒':'违禁影片','地狱乐':'违禁影片','战锤：末世鼠疫':'违禁影片',
            '暗杀教室':'违禁影片','谢文东':'违禁影片','我的英雄学院':'违禁影片','隐入尘烟':'违禁影片','人体蜈蚣':'违禁影片','阴阳师':'违禁影片',
        };
        return descriptions[word] || "暂无描述"; // 如果找不到描述，则返回空字符串
    }

    var searchWordLibrary3 = [
        '崔胜铉', '高英旭', '满文军', '田中圣', '张哲瀚', '郑中基',
        '郑雨盛', '金义圣', '卢巧音', '吴光禄', '李昇炫', '李昇基',
        '黄致列', '野马', '许艺舟', '吴启明', '周峻纬', '林建明',
        '基努', '尹均相', '刘亚仁', '邱孟煌', '李昇炫', '嘿人李逵',
        '张博', '谢东', '袁文杰', '刘丞以', '高金贤', '赵学而',
        '黄耀明', '谭小环', '高晓松', '田蕊妮', '张陆', '魏焌皓',
        '黄翠如', '周子瑜', '徐濠萦', '宋冬野', '钱枫', '王学兵',
        '王喜', '傅艺伟', '陈志云', '含笑', '陈羽凡', '赵立新',
        '戴立忍', '叶佩雯', '苏永康', '李云迪', '炎亚纶', '孙兴',
        '房祖名', '毛宁', '邓伦', '罗志祥', '翟天临', '黄海波',
        '陈冠希', '范冰冰', '森美', '赵薇', '叶德娴', '李易峰',
        '高虎', '张默', '柯震东', '张耀扬', '林夕', '胡瓜',
        '郑进一', '李铁', '池子', '吴亦凡', '杜汶泽', '黄秋生',
        '薇娅', '霍尊', '莫少聪', '徐若瑄', '春夏', '叶蕴仪',
        '尹雪姬', '王全安', 'house', '朴明秀', '仝卓', '崔始源',
        '金珍妮', '郑爽', '筱田三郎'];


    // 查询标题违禁词
    // 存放待查询的内容
    // 账号
    var searchAuditor;
    var searchTitleKeyword;
    var keyword = searchWordLibrary;
    var keywords = searchWordLibrary2;

    // 按键触发查询和显示框切换
    var isDialogVisible = false; // 初始显示框为隐藏状态

    // 创建显示框
    var dialog = document.createElement('div');
    dialog.style.display = 'none'; // 初始隐藏
    dialog.style.position = 'fixed';
    dialog.style.top = '55%';
    dialog.style.left = '55%';
    dialog.style.transform = 'translate(-50%, -50%)';
    dialog.style.padding = '20px';
    dialog.style.background = '#fff';
    dialog.style.width = '75%';
    dialog.style.border = '1px solid #ccc';
    dialog.style.boxShadow = '0 0 10px rgba(0,0,0,.3)';
    dialog.style.overflowY = 'scroll'; // 添加垂直滚动条
    dialog.style.maxHeight = '600px'; // 设置最大高度
    document.body.appendChild(dialog);


    // 创建描述区域
    var dialogDescription = document.createElement('div');
    dialogDescription.style.marginTop = '20px';
    dialog.appendChild(dialogDescription);


    // 记录行和列的计数器
    var rowCounter = 0;
    var colCounter = 0;

    document.addEventListener('keydown', function(event) {
        if (event.altKey && event.key === 'z' && event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
            if (dialog.style.display === 'none') {
                dialog.style.display = 'block';
                isDialogVisible = false;
            } else {
                dialog.style.display = 'none';
                isDialogVisible = true;
            }
        }
    });

    // 显示显示框
    if (isDialogVisible) {
        dialog.style.display = 'block';
    } else {
        dialog.style.display = 'none';
    }

    // 逐个对人员进行查询
    function searchAuditorContent(keyword) {

        // 拼接Post查询的JSON
        var jsonData = {
            "aiAuditStatus": "",
            "aisleEndTime": "",
            "aisleId": "",
            "aisleStartTime": "",
            "assetId": "",
            "auditor": userName1,
            "auditStatus": "1",
            "auditType": "",
            "author": "",
            "collectEndTime": "",
            "collectStartTime": "",
            "costTime": "",
            "createTimeEndTime": "",
            "createTimeStartTime": "",
            "displayName": "",
            "endTime": "",
            "exclusiveKeyword": "",
            "keywords": "",
            "labelId": "",
            "location": "2",
            "MD5": "",
            "mediumStatus": "",
            "occurred": "",
            "otherKeyword": "",
            "pageNum": 1,
            "pageSize": 100,
            "riskList": [],
            "secondClassCode": "",
            "startTime": "",
            "thirdClassCode": "",
            "titleKeyword": keyword,
            "userId": "",
            "userRiskList": [],
            "videoType": ""
        };

        searchData(jsonData);
    }

    // 逐个对人员进行查询
    function searchAuditorContents(keyword) {

        // 获取当前日期
        var currentDate1 = new Date();
        // 格式化当前日期为字符串（年-月-日 时:分:秒）
        var currentDateString1 =
            currentDate1.getFullYear() +
            '-' +
            (currentDate1.getMonth() + 1) +
            '-' +
            currentDate1.getDate();

        // 拼接Post查询的JSON
        var jsonData = {
            "aiAuditStatus": "",
            "aisleEndTime": "",
            "aisleId": "",
            "aisleStartTime": "",
            "assetId": "",
            "auditor": userName1,
            "auditStatus": "1",
            "auditType": "",
            "author": "",
            "collectEndTime": "",
            "collectStartTime": "",
            "costTime": "",
            "createTimeEndTime": "",
            "createTimeStartTime": "",
            "displayName": "",
            "endTime": currentDateString1 + " 23:59:59", // 设置结束时间为当天最后一秒
            "exclusiveKeyword": "",
            "keywords": "",
            "labelId": "",
            "location": "2",
            "MD5": "",
            "mediumStatus": "",
            "occurred": "",
            "otherKeyword": "",
            "pageNum": 1,
            "pageSize": 100,
            "riskList": [],
            "secondClassCode": "",
            "startTime": currentDateString1 + " 00:00:00", // 设置开始时间为当天第一秒
            "thirdClassCode": "",
            "titleKeyword": keyword,
            "userId": "",
            "userRiskList": [],
            "videoType": ""
        };

        searchData(jsonData);
    }

    // 逐个对人员进行查询
    function searchAuditorContentss(keywords) {

        // 拼接Post查询的JSON
        var jsonData = {
            "aiAuditStatus": "",
            "aisleEndTime": "",
            "aisleId": "",
            "aisleStartTime": "",
            "assetId": "",
            "auditor": userName1,
            "auditStatus": "1",
            "auditType": "",
            "author": "",
            "collectEndTime": "",
            "collectStartTime": "",
            "costTime": "",
            "createTimeEndTime": "",
            "createTimeStartTime": "",
            "displayName": "",
            "endTime": "",
            "exclusiveKeyword": "",
            "keywords": "",
            "labelId": "",
            "location": "2",
            "MD5": "",
            "mediumStatus": "",
            "occurred": "",
            "otherKeyword": "",
            "pageNum": 1,
            "pageSize": 100,
            "riskList": [],
            "secondClassCode": "",
            "startTime": "",
            "thirdClassCode": "",
            "titleKeyword": keywords,
            "userId": "",
            "userRiskList": [],
            "videoType": ""
        };

        searchData2(jsonData);
    }

    // 逐个对人员进行查询
    function searchAuditorContentsss(keyword) {

        // 拼接Post查询的JSON
        var jsonData = {
            "aiAuditStatus": "",
            "aisleEndTime": "",
            "aisleId": "",
            "aisleStartTime": "",
            "assetId": "",
            "auditor": userName1,
            "auditStatus": "1",
            "auditType": "",
            "author": "",
            "collectEndTime": "",
            "collectStartTime": "",
            "costTime": "",
            "createTimeEndTime": "",
            "createTimeStartTime": "",
            "displayName": "",
            "endTime": "",
            "exclusiveKeyword": "",
            "keywords": "",
            "labelId": "",
            "location": "2",
            "MD5": "",
            "mediumStatus": "",
            "occurred": "",
            "otherKeyword": "",
            "pageNum": 1,
            "pageSize": 100,
            "riskList": [],
            "secondClassCode": "",
            "startTime": "",
            "thirdClassCode": "",
            "titleKeyword": keyword,
            "userId": "",
            "userRiskList": [],
            "videoType": ""
        };

        searchData(jsonData);
    }

    // 查询数据
    function searchData(jsonData) {
        // 将 JSON 数据转换为字符串
        var jsonString = JSON.stringify(jsonData);
        // 创建 XMLHttpRequest 对象
        var xhr = new XMLHttpRequest();
        // 设置请求信息
        // 替换为目标服务器的URL
        xhr.open('POST', queryContentListUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        // 设置回调函数
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                var message = '违禁词：' + jsonData.titleKeyword + ' 数据数量：' + response.data.total;

                // 创建单元格并添加内容
                var cell = document.createElement('td');
                cell.innerText = message;
                cell.style.padding = '10px';

                // 添加鼠标悬停事件
                cell.addEventListener('mouseover', function(event) {
                    var description = getDescriptionForWord(jsonData.titleKeyword);

                    // 创建提示框元素
                    var tooltip = document.createElement('div');
                    tooltip.innerText = description;
                    tooltip.style.position = 'absolute';
                    tooltip.style.top = event.clientY + 'px';
                    tooltip.style.left = event.clientX + 'px';
                    tooltip.style.padding = '10px';
                    tooltip.style.background = '#fff';
                    tooltip.style.border = '1px solid #ccc';
                    tooltip.style.boxShadow = '0 0 10px rgba(0,0,0,.3)';
                    tooltip.style.zIndex = '9999';
                    tooltip.style.color = 'green'; // 将文字颜色设置为绿色

                    // 将提示框添加到文档中
                    document.body.appendChild(tooltip);

                    var tooltipDisplayed = true; // 标记提示框已经显示

                    // 隐藏提示框当鼠标移开单元格时
                    cell.addEventListener('mouseout', function() {
                        if (tooltipDisplayed) { // 只有当提示框已经显示时才移除
                            tooltip.remove();
                            tooltipDisplayed = false; // 重置提示框显示状态
                        }
                    });
                });


                // 如果数据数量大于0，添加红褐色的样式
                if (response.data.total > 0) {
                    cell.style.color = 'red';
                }

                // 添加单元格到表格中
                if (colCounter === 0) {
                    var row = document.createElement('tr');
                    dialog.appendChild(row);
                }
                dialog.lastChild.appendChild(cell);

                // 更新行和列的计数器
                colCounter++;
                if (colCounter >= 10) {
                    colCounter = 0;
                    rowCounter++;
                }

                // 如果超过30行，移除第一行以保持显示框大小不变
                if (rowCounter > 70) {
                    dialog.firstChild.remove();
                    rowCounter--;
                }

                // 显示显示框
                dialog.style.display = 'block';
            } else {
                //console.log('提交失败，请手动提交！');
            }
        };

        // 发送请求
        xhr.send(jsonString);
    }


    // 查询数据
    function searchData2(jsonData) {
        // 将 JSON 数据转换为字符串
        var jsonString = JSON.stringify(jsonData);
        // 创建 XMLHttpRequest 对象
        var xhr = new XMLHttpRequest();
        // 设置请求信息
        // 替换为目标服务器的URL
        xhr.open('POST', queryContentListUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        // 设置回调函数
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                var message = '违禁词：' + jsonData.titleKeyword + ' 数据数量：' + response.data.total;

                // 创建单元格并添加内容
                var cell = document.createElement('td');
                cell.innerText = message;
                cell.style.padding = '10px';

                // 添加鼠标悬停事件
                cell.addEventListener('mouseover', function(event) {
                    var description = getDescriptionForWord2(jsonData.titleKeyword);

                    // 创建提示框元素
                    var tooltip = document.createElement('div');
                    tooltip.innerText = description;
                    tooltip.style.position = 'absolute';
                    tooltip.style.top = event.clientY + 'px';
                    tooltip.style.left = event.clientX + 'px';
                    tooltip.style.padding = '10px';
                    tooltip.style.background = '#fff';
                    tooltip.style.border = '1px solid #ccc';
                    tooltip.style.boxShadow = '0 0 10px rgba(0,0,0,.3)';
                    tooltip.style.zIndex = '9999';
                    tooltip.style.color = 'green'; // 将文字颜色设置为绿色

                    // 将提示框添加到文档中
                    document.body.appendChild(tooltip);

                    var tooltipDisplayed = true; // 标记提示框已经显示

                    // 隐藏提示框当鼠标移开单元格时
                    cell.addEventListener('mouseout', function() {
                        if (tooltipDisplayed) { // 只有当提示框已经显示时才移除
                            tooltip.remove();
                            tooltipDisplayed = false; // 重置提示框显示状态
                        }
                    });
                });


                // 如果数据数量大于0，添加红褐色的样式
                if (response.data.total > 0) {
                    cell.style.color = 'red';
                }

                // 添加单元格到表格中
                if (colCounter === 0) {
                    var row = document.createElement('tr');
                    dialog.appendChild(row);
                }
                dialog.lastChild.appendChild(cell);

                // 更新行和列的计数器
                colCounter++;
                if (colCounter >= 10) {
                    colCounter = 0;
                    rowCounter++;
                }

                // 如果超过30行，移除第一行以保持显示框大小不变
                if (rowCounter > 70) {
                    dialog.firstChild.remove();
                    rowCounter--;
                }

                // 显示显示框
                dialog.style.display = 'block';
            } else {
                //console.log('提交失败，请手动提交！');
            }
        };

        // 发送请求
        xhr.send(jsonString);
    }

    var cooltime = false; // Initial cooldown state
    var cooljishu = 0; // Initial counter value
    var cooldownInterval;

    // Reset the counter value to 0 if the key is not pressed 30 times within 5 seconds
    var resetCounter = function() {
        if (cooljishu < 40) {
            cooljishu = 0;
        }
    };

    // Set a timer to reset the counter value after 5 seconds
    var resetCounterTimer;

    function startCooldown() {
        if (!cooltime) { // Check if cooldown is already in progress
            cooltime = true; // Set cooldown state to true

            var cooldownContainer = document.createElement('div');
            cooldownContainer.id = 'lengquetishi';
            cooldownContainer.style.position = 'fixed';
            cooldownContainer.style.top = '10%';
            cooldownContainer.style.left = '50%';
            cooldownContainer.style.transform = 'translate(-50%, -50%)';
            cooldownContainer.style.background = '#fff';
            cooldownContainer.style.padding = '10px';
            cooldownContainer.style.height = '30px';
            cooldownContainer.style.color ='red';
            cooldownContainer.style.fontSize='20px';
            cooldownContainer.style.textAlign = 'center';
            cooldownContainer.style.border = '2px solid red';
            cooldownContainer.style.zIndex = '9999';
            document.body.appendChild(cooldownContainer);

            var countdown = 3; // Set the cooldown time
            cooldownInterval = setInterval(function() {
                cooldownContainer.innerText = '点的太快了，休息' + countdown + '秒吧';
                countdown--;

                if (countdown < 0) {
                    clearInterval(cooldownInterval);
                    cooldownContainer.remove();
                    cooltime = false;
                    cooljishu = 0; // Reset the counter value to 0
                }
            }, 1000);
        }
    }

    function getStoredKeydiwei() {
        return localStorage.getItem('customKeydiwei') || 'q';
    }

    function setStoredKeydiwei(key) {
        localStorage.setItem('customKeydiwei', key);
    }

    function getStoredKeygaowei() {
        return localStorage.getItem('customKeygaowei') || 'w';
    }

    function setStoredKeygaowei(key) {
        localStorage.setItem('customKeygaowei', key);
    }

    function getStoredKeywutiaojian() {
        return localStorage.getItem('customKeywutiaojian') || 'r';
    }

    function setStoredKeywutiaojian(key) {
        localStorage.setItem('customKeywutiaojian', key);
    }
    function getStoredKeyxinkuaishen() {
        return localStorage.getItem('customKeyxinkuaishen') || 't';
    }

    function setStoredKeyxinkuaishen(key) {
        localStorage.setItem('customKeyxinkuaishen', key);
    }

    function getStoredKeyrenji() {
        return localStorage.getItem('customKeyrenji') || 'e';
    }

    function setStoredKeyrenji(key) {
        localStorage.setItem('customKeyrenji', key);
    }

    function getStoredKeyjishen() {
        return localStorage.getItem('customKeyjishen') || 'y';
    }

    function setStoredKeyjishen(key) {
        localStorage.setItem('customKeyjishen', key);
    }

    function getStoredKeykaitoujingpin() {
        return localStorage.getItem('kaitoujingpin') || '6';
    }

    function setStoredKeykaitoujingpin(key) {
        localStorage.setItem('kaitoujingpin', key);
    }

    function getStoredKeyjieweijingpin() {
        return localStorage.getItem('jieweijingpin') || '3';
    }

    function setStoredKeyjieweijingpin(key) {
        localStorage.setItem('jieweijingpin', key);
    }

    function getStoredKeyliejiyiren() {
        return localStorage.getItem('liejiyiren') || 'u';
    }

    function setStoredKeyliejiyiren(key) {
        localStorage.setItem('liejiyiren', key);
    }

    function getStoredKeyguanggaotuiguang() {
        return localStorage.getItem('guanggaotuiguang') || '4';
    }

    function setStoredKeyguanggaotuiguang(key) {
        localStorage.setItem('guanggaotuiguang', key);
    }

    function getStoredKeywuzizi() {
        return localStorage.getItem('wuzizi') || 'o';
    }

    function setStoredKeywuzizi(key) {
        localStorage.setItem('wuzizi', key);
    }

    function getStoredKeydisu() {
        return localStorage.getItem('disu') || '9';
    }

    function setStoredKeydisu(key) {
        localStorage.setItem('disu', key);
    }

    function getStoredKeyweijinpian() {
        return localStorage.getItem('weijinpian') || 'y';
    }

    function setStoredKeyweijinpian(key) {
        localStorage.setItem('weijinpian', key);
    }

    function getStoredKeywcn() {
        return localStorage.getItem('weichengnian') || 't';
    }

    function setStoredKeywcn(key) {
        localStorage.setItem('weichengnian', key);
    }

    function getStoredKeychunsebeijing() {
        return localStorage.getItem('chunsebeijing') || '7';
    }

    function setStoredKeychunsebeijing(key) {
        localStorage.setItem('chunsebeijing', key);
    }

    function getStoredKeyweidingxing() {
        return localStorage.getItem('weidingxing') || '0';
    }

    function setStoredKeyweidingxing(key) {
        localStorage.setItem('weidingxing', key);
    }

    function getStoredKeyyidingxing() {
        return localStorage.getItem('yidingxing') || '-';
    }

    function setStoredKeyyidingxing(key) {
        localStorage.setItem('yidingxing', key);
    }

    function getStoredKeytishikuang() {
        return localStorage.getItem('tishikuang') || ';';
    }

    function setStoredKeytishikuang(key) {
        localStorage.setItem('tishikuang', key);
    }
    function getStoredKeyxuexingbaoli() {
        return localStorage.getItem('xuexingbaoli') || '5';
    }

    function setStoredKeyxuexingbaoli(key) {
        localStorage.setItem('xuexingbaoli', key);
    }

    //低位
    var index = 6; // 初始索引为5

    document.addEventListener('keydown', function(event) {
        // 按下空格键（键码为32）
        var storedKeydiwei = getStoredKeydiwei();
        if (event.key === storedKeydiwei && !cooltime) {
            // 检查当前焦点元素是否是输入框
            var activeElement = document.activeElement;
            var isInputFocused = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA';

            if (!isInputFocused) {
                // 获取按钮元素集合
                var buttons = document.getElementsByClassName('el-tree-node__content');

                console.log('c',buttons)

                // 获取当前要刷新的按钮并模拟点击
                var currentButton = buttons[index];
                setTimeout(function() {
                    // 在这里放置你的代码

                    if (index === 6) {
                        currentButton?.click();
                        // 获取 span 元素
                        var spanEle = document.querySelector("#oneAssetDiv > div > div > div.el-row > div:nth-child(2) > form > div.asset-info > div:nth-child(1) > div:nth-child(1) > div > label")
                        // 获取 span 元素的文本内容
                        var spanTt = spanEle.textContent.trim();

                        // 检查 span 元素的文本内容是否满足条件
                        if (spanTt === '媒资ID:') {
                            var popup = document.createElement('div');
                            popup.className = 'popup';
                            popup.style.position = 'fixed';
                            popup.style.top = '15%';
                            popup.style.left = '50%';
                            popup.style.transform = 'translate(-50%, -50%)';
                            popup.style.background = '#fff';
                            popup.style.padding = '10px';
                            popup.style.height = '30px';
                            popup.style.color ='red';
                            popup.style.fontSize='20px';
                            popup.style.textAlign = 'center';
                            popup.style.border = '2px solid red';
                            popup.innerText = '已刷到数据，停止后续刷新';

                            // 将弹出框插入到页面中的合适位置
                            document.body.appendChild(popup);

                            // 一定时间后移除弹出框
                            setTimeout(function() {
                                popup.remove();
                            }, 2000);
                            console.log('已满足条件，停止刷新');
                            // 停止一切操作并提示停止刷新
                            return;
                        }

                        // 索引递增，循环刷新按钮
                        index = (index + 1) % buttons.length;
                    }
                }, 100); // 延迟1秒执行，根据实际情况调整延迟时间
                // Increment the counter
                cooljishu++;
                // Clear the previous timer for resetting the counter
                clearTimeout(resetCounterTimer);
                // Set a new timer to reset the counter after 5 seconds
                resetCounterTimer = setTimeout(resetCounter, 3000);
                // Start cooldown if the counter reaches 30
                if (cooljishu >= 40) {
                    startCooldown();
                }
            }
        }
    });


    // 人机
    var index1 = 11; // Initial index value

    document.addEventListener('keydown', function(event) {

        var storedKeyrenji = getStoredKeyrenji();

        // Press the 'e' key
        if (event.key === storedKeyrenji && !cooltime) {
            // Check if the focus is not on an input element
            var activeElement = document.activeElement;
            var isInputFocused = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA';

            if (!isInputFocused) {
                // Get the button elements collection
                var buttons = document.getElementsByClassName('el-tree-node__content');

                // Get the current button to refresh and simulate a click
                var currentButton = buttons[index1];
                setTimeout(function() {

                    if (index1 === 11) {
                        currentButton?.click();
                        var spanEle = document.querySelector("#oneAssetDiv > div > div > div.el-row > div:nth-child(2) > form > div.asset-info > div:nth-child(1) > div:nth-child(1) > div > label");
                        var spanTt = spanEle.textContent.trim();

                        if (spanTt === '媒资ID:') {
                            var popup = document.createElement('div');
                            popup.className = 'popup';
                            popup.style.position = 'fixed';
                            popup.style.top = '15%';
                            popup.style.left = '50%';
                            popup.style.transform = 'translate(-50%, -50%)';
                            popup.style.background = '#fff';
                            popup.style.padding = '10px';
                            popup.style.height = '30px';
                            popup.style.color ='red';
                            popup.style.fontSize='20px';
                            popup.style.textAlign = 'center';
                            popup.style.border = '2px solid red';
                            popup.innerText = '已刷到数据，停止后续刷新';

                            document.body.appendChild(popup);

                            setTimeout(function() {
                                popup.remove();
                            }, 2000);
                            console.log('已满足条件，停止刷新');
                            return;
                        }

                        index1 = (index1 + 1) % buttons.length;
                    }
                }, 100);
                // Increment the counter
                cooljishu++;
                // Clear the previous timer for resetting the counter
                clearTimeout(resetCounterTimer);
                // Set a new timer to reset the counter after 5 seconds
                resetCounterTimer = setTimeout(resetCounter, 3000);
                // Start cooldown if the counter reaches 30
                if (cooljishu >= 40) {
                    startCooldown();
                }
            }
        }
    });


    //无条件
    var index2 = 10; // 初始索引为9

    document.addEventListener('keydown', function(event) {
        var storedKeywutiaojian = getStoredKeywutiaojian();
        // 按下空格键（键码为32）
        if (event.key === storedKeywutiaojian && !cooltime) {
            // 检查当前焦点元素是否是输入框
            var activeElement = document.activeElement;
            var isInputFocused = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA';

            if (!isInputFocused) {
                // 获取按钮元素集合
                var buttons = document.getElementsByClassName('el-tree-node__content');

                console.log('c',buttons)

                // 获取当前要刷新的按钮并模拟点击
                var currentButton = buttons[index2];
                setTimeout(function() {
                    // 在这里放置你的代码

                    if (index2 === 10) {
                        currentButton?.click();
                        // 获取 span 元素
                        var spanEle = document.querySelector("#oneAssetDiv > div > div > div.el-row > div:nth-child(2) > form > div.asset-info > div:nth-child(1) > div:nth-child(1) > div > label")
                        // 获取 span 元素的文本内容
                        var spanTt = spanEle.textContent.trim();

                        // 检查 span 元素的文本内容是否满足条件
                        if (spanTt === '媒资ID:') {
                            var popup = document.createElement('div');
                            popup.className = 'popup';
                            popup.style.position = 'fixed';
                            popup.style.top = '15%';
                            popup.style.left = '50%';
                            popup.style.transform = 'translate(-50%, -50%)';
                            popup.style.background = '#fff';
                            popup.style.padding = '10px';
                            popup.style.height = '30px';
                            popup.style.color ='red';
                            popup.style.fontSize='20px';
                            popup.style.textAlign = 'center';
                            popup.style.border = '2px solid red';
                            popup.innerText = '已刷到数据，停止后续刷新';

                            // 将弹出框插入到页面中的合适位置
                            document.body.appendChild(popup);

                            // 一定时间后移除弹出框
                            setTimeout(function() {
                                popup.remove();
                            }, 2000);
                            console.log('已满足条件，停止刷新');
                            // 停止一切操作并提示停止刷新
                            return;
                        }

                        // 索引递增，循环刷新按钮
                        index2 = (index2 + 1) % buttons.length;
                    }
                }, 100); // 延迟1秒执行，根据实际情况调整延迟时间
                // Increment the counter
                cooljishu++;
                // Clear the previous timer for resetting the counter
                clearTimeout(resetCounterTimer);
                // Set a new timer to reset the counter after 5 seconds
                resetCounterTimer = setTimeout(resetCounter, 3000);
                // Start cooldown if the counter reaches 30
                if (cooljishu >= 40) {
                    startCooldown();
                }
            }
        }
    });

    //高危
    var index3 = 2; // 初始索引为0

    document.addEventListener('keydown', function(event) {
        var storedKeygaowei = getStoredKeygaowei();
        // 按下空格键（键码为32）
        if (event.key === storedKeygaowei && !cooltime) {
            // 检查当前焦点元素是否是输入框
            var activeElement = document.activeElement;
            var isInputFocused = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA';

            if (!isInputFocused) {
                // 获取按钮元素集合
                var buttons = document.getElementsByClassName('el-tree-node__content');

                console.log('c',buttons)

                // 获取当前要刷新的按钮并模拟点击
                var currentButton = buttons[index3];
                setTimeout(function() {
                    // 在这里放置你的代码

                    if (index3 === 2) {
                        currentButton?.click();
                        // 获取 span 元素
                        var spanEle = document.querySelector("#oneAssetDiv > div > div > div.el-row > div:nth-child(2) > form > div.asset-info > div:nth-child(1) > div:nth-child(1) > div > label")
                        // 获取 span 元素的文本内容
                        var spanTt = spanEle.textContent.trim();

                        // 检查 span 元素的文本内容是否满足条件
                        if (spanTt === '媒资ID:') {
                            var popup = document.createElement('div');
                            popup.className = 'popup';
                            popup.style.position = 'fixed';
                            popup.style.top = '15%';
                            popup.style.left = '50%';
                            popup.style.transform = 'translate(-50%, -50%)';
                            popup.style.background = '#fff';
                            popup.style.padding = '10px';
                            popup.style.height = '30px';
                            popup.style.color ='red';
                            popup.style.fontSize='20px';
                            popup.style.textAlign = 'center';
                            popup.style.border = '2px solid red';
                            popup.innerText = '已刷到数据，停止后续刷新';

                            // 将弹出框插入到页面中的合适位置
                            document.body.appendChild(popup);

                            // 一定时间后移除弹出框
                            setTimeout(function() {
                                popup.remove();
                            }, 2000);
                            console.log('已满足条件，停止刷新');
                            // 停止一切操作并提示停止刷新
                            return;
                        }

                        // 索引递增，循环刷新按钮
                        index3 = (index3 + 1) % buttons.length;
                    }
                }, 100); // 延迟1秒执行，根据实际情况调整延迟时间
                // Increment the counter
                cooljishu++;
                // Clear the previous timer for resetting the counter
                clearTimeout(resetCounterTimer);
                // Set a new timer to reset the counter after 5 seconds
                resetCounterTimer = setTimeout(resetCounter, 3000);
                // Start cooldown if the counter reaches 30
                if (cooljishu >= 40) {
                    startCooldown();
                }
            }
        }
    });

    //新快审
    var index5 = 1; // 初始索引为0

    document.addEventListener('keydown', function(event) {
        var storedKeyxinkuaishen = getStoredKeyxinkuaishen();
        // 按下空格键（键码为32）
        if (event.key === storedKeyxinkuaishen && !cooltime) {
            // 检查当前焦点元素是否是输入框
            var activeElement = document.activeElement;
            var isInputFocused = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA';

            if (!isInputFocused) {
                // 获取按钮元素集合
                var buttons = document.getElementsByClassName('el-tree-node__content');

                console.log('c',buttons)

                // 获取当前要刷新的按钮并模拟点击
                var currentButton = buttons[index5];
                setTimeout(function() {
                    // 在这里放置你的代码

                    if (index5 === 1) {
                        currentButton?.click();
                        // 获取 span 元素
                        var spanEle = document.querySelector("#oneAssetDiv > div > div > div.el-row > div:nth-child(2) > form > div.asset-info > div:nth-child(1) > div:nth-child(1) > div > label")
                        // 获取 span 元素的文本内容
                        var spanTt = spanEle.textContent.trim();

                        // 检查 span 元素的文本内容是否满足条件
                        if (spanTt === '媒资ID:') {
                            var popup = document.createElement('div');
                            popup.className = 'popup';
                            popup.style.position = 'fixed';
                            popup.style.top = '15%';
                            popup.style.left = '50%';
                            popup.style.transform = 'translate(-50%, -50%)';
                            popup.style.background = '#fff';
                            popup.style.padding = '10px';
                            popup.style.height = '30px';
                            popup.style.color ='red';
                            popup.style.fontSize='20px';
                            popup.style.textAlign = 'center';
                            popup.style.border = '2px solid red';
                            popup.innerText = '已刷到数据，停止后续刷新';

                            // 将弹出框插入到页面中的合适位置
                            document.body.appendChild(popup);

                            // 一定时间后移除弹出框
                            setTimeout(function() {
                                popup.remove();
                            }, 2000);
                            console.log('已满足条件，停止刷新');
                            // 停止一切操作并提示停止刷新
                            return;
                        }

                        // 索引递增，循环刷新按钮
                        index5 = (index5 + 1) % buttons.length;
                    }
                }, 100); // 延迟1秒执行，根据实际情况调整延迟时间
                // Increment the counter
                cooljishu++;
                // Clear the previous timer for resetting the counter
                clearTimeout(resetCounterTimer);
                // Set a new timer to reset the counter after 5 seconds
                resetCounterTimer = setTimeout(resetCounter, 3000);
                // Start cooldown if the counter reaches 30
                if (cooljishu >= 40) {
                    startCooldown();
                }
            }
        }
    });


    //高危
    var index6 = 4; // 初始索引为0

    document.addEventListener('keydown', function(event) {
        var storedKeyjishen = getStoredKeyjishen();
        // 按下空格键（键码为32）
        if (event.key === storedKeyjishen && !cooltime) {
            // 检查当前焦点元素是否是输入框
            var activeElement = document.activeElement;
            var isInputFocused = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA';

            if (!isInputFocused) {
                // 获取按钮元素集合
                var buttons = document.getElementsByClassName('el-tree-node__content');

                console.log('c',buttons)

                // 获取当前要刷新的按钮并模拟点击
                var currentButton = buttons[index6];
                setTimeout(function() {
                    // 在这里放置你的代码

                    if (index6 === 4) {
                        currentButton?.click();
                        // 获取 span 元素
                        var spanEle = document.querySelector("#oneAssetDiv > div > div > div.el-row > div:nth-child(2) > form > div.asset-info > div:nth-child(1) > div:nth-child(1) > div > label")
                        // 获取 span 元素的文本内容
                        var spanTt = spanEle.textContent.trim();

                        // 检查 span 元素的文本内容是否满足条件
                        if (spanTt === '媒资ID:') {
                            var popup = document.createElement('div');
                            popup.className = 'popup';
                            popup.style.position = 'fixed';
                            popup.style.top = '15%';
                            popup.style.left = '50%';
                            popup.style.transform = 'translate(-50%, -50%)';
                            popup.style.background = '#fff';
                            popup.style.padding = '10px';
                            popup.style.height = '30px';
                            popup.style.color ='red';
                            popup.style.fontSize='20px';
                            popup.style.textAlign = 'center';
                            popup.style.border = '2px solid red';
                            popup.innerText = '已刷到数据，停止后续刷新';

                            // 将弹出框插入到页面中的合适位置
                            document.body.appendChild(popup);

                            // 一定时间后移除弹出框
                            setTimeout(function() {
                                popup.remove();
                            }, 2000);
                            console.log('已满足条件，停止刷新');
                            // 停止一切操作并提示停止刷新
                            return;
                        }

                        // 索引递增，循环刷新按钮
                        index6 = (index6 + 1) % buttons.length;
                    }
                }, 100); // 延迟1秒执行，根据实际情况调整延迟时间
                // Increment the counter
                cooljishu++;
                // Clear the previous timer for resetting the counter
                clearTimeout(resetCounterTimer);
                // Set a new timer to reset the counter after 5 seconds
                resetCounterTimer = setTimeout(resetCounter, 3000);
                // Start cooldown if the counter reaches 30
                if (cooljishu >= 40) {
                    startCooldown();
                }
            }
        }
    });





    // 判断手动提交按钮的关键词检测
    document.addEventListener('click', async function(event) {
        var buttons = document.getElementsByClassName('el-button el-button--default el-button--small');
        for (var i = 2; i <= 3; i++) {
            var button = buttons[i];
            if (button.textContent.includes('通过')) {
                if (button.classList.contains('highlight')) {
                    var prohibitedWord = titleContainsChineseWord(mySentence);
                    var result = await searchInferiorArtistOrProhibitedWord();
                    // 获取 span 元素
                    var spanEle = document.querySelector("span.el-tooltip");
                    // 获取 span 元素的文本内容
                    var spanTt = spanEle.textContent.trim();
                    // 检查 span 元素的文本内容是否在高危账号集合中
                    if (highRiskAccounts.includes(spanTt)) {
                        if (!button.hasAttribute('data-displayed-alert')) {
                            alert('当前视频账号【 ' + spanTt + ' 】为严重高危敏感账号，请仔细检查视频内容！');
                            button.setAttribute('data-displayed-alert', true);
                        }
                        return; // 不继续执行后续代码
                    }

                    var title = document.querySelector("#oneAssetDiv > div > div > div.el-row > div:nth-child(2) > form > div.asset-info > div:nth-child(1) > div:nth-child(2) > div > div > span").textContent.trim();

                    // 移除标题开头的点号及之前的内容
                    title = title.replace(/^.+?[\.,]/, '').trim();

                    // 去除标题中的所有空格
                    title = title.replace(/\s/g, '');

                    console.log('标题去除空格：' + title);

                    // 使用点、感叹号和问号分割句子
                    var sentences = title.trim().split(/[。！？ ,，＋_( ;：…]/);

                    // 获取第一句话
                    var firstSentence;
                    if (title.trim().startsWith(".") || title.trim().startsWith(",")) {
                        // 如果标题以 "." 开头，则选择第一段作为第一句话
                        firstSentence = sentences[1];
                    } else {
                        // 否则选择第二段作为第一句话
                        firstSentence = sentences[0];
                    }

                    if (!firstSentence.includes('。') && !firstSentence.includes('！') && !firstSentence.includes('？')) {
                        // 如果第一句话中没有标点，则直接使用原始句子
                        filteredSentence = firstSentence;
                    } else {
                        if (!firstSentence.includes('.')) {
                            // 如果第一句话中没有点，则取感叹号或问号前的那一句话
                            firstSentence = title.match(/[^，！？_(。 ]*[，！？_(。 ]/)[0];

                        }
                        // 移除非字母、中文、逗号和问号感叹号字符
                        var filteredSentence = firstSentence.replace(/[^a-zA-Z\u4e00-\u9fa5,?!]/g, '');
                    }

                    console.log('标题最后匹配：' + filteredSentence);

                    async function schAuditorContent(filteredSentence) {
                        // 拼接Post查询的JSON
                        var jsonData = {
                            "aiAuditStatus": "",
                            "aisleEndTime": "",
                            "aisleId": "",
                            "aisleStartTime": "",
                            "assetId": "",
                            "auditor": "",
                            "auditStatus": "0",
                            "auditType": "",
                            "author": "",
                            "collectEndTime": "",
                            "collectStartTime": "",
                            "costTime": "",
                            "createTimeEndTime": "",
                            "createTimeStartTime": "",
                            "displayName": "",
                            "endTime": "",
                            "exclusiveKeyword": "",
                            "keywords": "",
                            "labelId": "",
                            "location": "2",
                            "MD5": "",
                            "mediumStatus": "",
                            "occurred": "",
                            "otherKeyword": "",
                            "pageNum": 1,
                            "pageSize": 5,
                            "riskList": [],
                            "secondClassCode": "",
                            "startTime": "",
                            "thirdClassCode": "",
                            "titleKeyword": filteredSentence,
                            "userId": "",
                            "userRiskList": [],
                            "videoType": ""
                        };

                        await schData(jsonData);
                    }

                    // 提交查询相关信息
                    function schData(jsonData) {
                        return new Promise((resolve, reject) => {
                            var jsonString = JSON.stringify(jsonData);
                            var xhr = new XMLHttpRequest();
                            var queryContentListUrl = 'https://oes-coss.miguvideo.com:1443/oes-csas-manage/content/queryList';
                            xhr.open('POST', queryContentListUrl, true);
                            xhr.setRequestHeader('Content-Type', 'application/json');
                            xhr.onreadystatechange = function() {
                                if (xhr.readyState === 4) {
                                    if (xhr.status === 200) {
                                        var response = JSON.parse(xhr.responseText);
                                        var total = response.data.total;
                                        var dataList = response.data.dataList;

                                        if (dataList.length > 0) {
                                            var output = '';
                                            var length = Math.min(4, dataList.length);

                                            for (var i = 0; i < length; i++) {
                                                var assetId = dataList[i].assetId;
                                                var auditRemark = dataList[i].auditRemark;
                                                var aisleTime = dataList[i].aisleTime;

                                                output += ' 驳回媒资ID: ' + assetId + '  驳回理由: ' + auditRemark + '  驳回时间: ' + aisleTime + '\n';
                                            }
                                            var alertText = ' 当前查询到标题：' + filteredSentence + '  视频库里有驳回，总数为: ' + total + '\n' + output;


                                            if (!button.hasAttribute('data-displayed-alert')) {
                                                createModal(alertText);
                                                button.setAttribute('data-displayed-alert', true);
                                            }


                                            // 用户停止操作
                                            return;
                                        }

                                        resolve();
                                    } else {
                                        reject();
                                    }
                                }
                            };

                            xhr.send(jsonString);

                        });
                    }

                    saveAisleIdWithText(assetId, '手动模式 ' + getCurrentChinaTime());
                    updateExecutionCount();

                    // 创建带样式的模态框
                    function createModal(content) {
                        var modal = document.createElement('div');
                        modal.style.position = 'fixed';
                        modal.style.top = 0;
                        modal.style.left = 0;
                        modal.style.width = '100%';
                        modal.style.height = '100%';
                        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                        modal.style.display = 'flex';
                        modal.style.alignItems = 'center';
                        modal.style.justifyContent = 'center';

                        var styledContent = '<div style="font-weight:bold; font-size:20px; white-space: pre-line;">' + content.replace(/(驳回媒资ID: \d+)/g, '<span style="color:red;">$1</span>').replace(/(驳回理由: .+?)(  驳回时间)/g, '<span style="color:red;">$1</span>$2') + '</div>';

                        var textDiv = document.createElement('div');
                        textDiv.innerHTML = styledContent;
                        textDiv.style.width = '30%';
                        textDiv.style.height = '35%';
                        textDiv.style.padding = '20px';
                        textDiv.style.backgroundColor = '#fff';

                        modal.appendChild(textDiv);

                        // 添加底部提示文字
                        var bottomText = document.createElement('div');
                        bottomText.innerText = '点击任意区域关闭此提示';
                        bottomText.style.position = 'absolute';
                        bottomText.style.bottom = '10px';
                        bottomText.style.color = 'red';
                        bottomText.style.cursor = 'pointer';

                        modal.appendChild(bottomText);

                        document.body.appendChild(modal);

                        // 点击模态框外部或底部文字关闭模态框
                        modal.addEventListener('click', function(e) {
                            if (e.target === modal || e.target === bottomText) {
                                modal.remove();
                            }
                        });

                        // 按空格键关闭模态框并移除事件监听器
                        function handleKeyPress(e) {
                            if (e.key === ' ') {
                                modal.remove();
                                document.removeEventListener('keydown', handleKeyPress);
                            }
                        }

                        // 添加键盘事件监听器
                        document.addEventListener('keydown', handleKeyPress);
                    }

                    await schAuditorContent(filteredSentence);

                    if (prohibitedWord !== '') {
                        var hasDisplayedAlert = button.hasAttribute('data-displayed-alert');
                        if (!hasDisplayedAlert) {
                            alert('请注意当前视频标题或简介中存在违禁词：【 ' + prohibitedWord + ' 】' + result + '：请仔细检查简介、影片内容、视频标题，无法机器判断通过！');
                            button.setAttribute('data-displayed-alert', true);
                        } else {
                            // 已经弹窗过了，不执行弹窗逻辑
                        }
                    } else if (result !== '') {
                        // 只弹出一次提示
                        if (!button.hasAttribute('data-displayed-alert')) {
                            alert(result);
                            button.setAttribute('data-displayed-alert', true);
                        }
                    } else {
                        // 没有违禁词，继续执行其他逻辑
                    }

                }
            }
        }
    });






    // 在页面左侧创建一个新容器
    var leftContainer03 = document.createElement('div');
    leftContainer03.id = 'leftContainer03';
    leftContainer03.style.position = 'fixed';
    leftContainer03.style.left = '560px';
    leftContainer03.style.top = '200px';
    leftContainer03.style.overflowY = 'auto';
    leftContainer03.style.zIndex = '9999';
    leftContainer03.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    leftContainer03.style.color = '#fff';
    leftContainer03.style.fontSize = '16px';
    leftContainer03.style.color = 'white';
    leftContainer03.style.display = 'none';
    leftContainer03.style.padding= '10px';
    document.body.appendChild(leftContainer03);

    // 让浮动页面可拖动
    var isDraggingshujuchaxun = false;
    var startPosXisDraggingshujuchaxun, startPosYisDraggingshujuchaxun;

    leftContainer03.addEventListener('mousedown', function(e) {
        isDraggingshujuchaxun = true;
        startPosXisDraggingshujuchaxun = e.clientX - leftContainer03.offsetLeft;
        startPosYisDraggingshujuchaxun = e.clientY - leftContainer03.offsetTop;
    });

    document.addEventListener('mousemove', function(e) {
        if (isDraggingshujuchaxun) {
            leftContainer03.style.left = e.clientX - startPosXisDraggingshujuchaxun + 'px';
            leftContainer03.style.top = e.clientY - startPosYisDraggingshujuchaxun + 'px';
        }
    });

    document.addEventListener('mouseup', function() {
        isDraggingshujuchaxun = false;
    });


    var isFloatingPageVisible03 = false;


    let default_setting = {
        "site_list": {
            "Baidu": "https://graph.baidu.com/details?isfromtusoupc=1&tn=pc&carousel=0&promotion_name=pc_image_shituindex&extUiData%5bisLogoShow%5d=1&image={%s}",
            "Sogou": "https://pic.sogou.com/ris?query=https%3A%2F%2Fimg03.sogoucdn.com%2Fv2%2Fthumb%2Fretype_exclude_gif%2Fext%2Fauto%3Fappid%3D122%26url%3D{%ss}&flag=1&drag=0",
        },
        "hot_key": "ctrlKey",
        "server_url": "//sbi.ccloli.com/img/upload.php"
    };

    let setting = default_setting;
    let img_src = null;
    let xhr = new XMLHttpRequest();
    let reader = new FileReader();
    reader.onload = function(file) {
        upload_file(this.result);

    };

    var innerDiv40 = document.createElement('div');
    innerDiv40.id = 'innerDiv40';
    innerDiv40.style.width = '37px';
    innerDiv40.style.height = '22px';
    innerDiv40.style.position = 'absolute';
    innerDiv40.style.top = '55px';
    innerDiv40.style.right = '195px';

    draggableDiv.appendChild(innerDiv40);

    // 上传文件函数
    function upload_file(data) {
        // 设置超时
        let timeout = setTimeout(function() {
            xhr.abort();
            alert('上传失败');
            resetUpload();
        }, 15000);

        if (xhr.readyState !== 0) xhr.abort();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                clearTimeout(timeout); // 清除超时
                if (xhr.status === 200) {
                    img_src = xhr.responseText;
                    let turl = !shituyinqin ? setting.site_list["Baidu"] : setting.site_list["Sogou"];
                    let rsrc = img_src;
                    for (let j = 0; j < turl.match(/{%s+}/)[0].length - 3; j++) {
                        rsrc = encodeURIComponent(rsrc);
                    }
                    window.open(turl.replace(/{%s+}/, rsrc), '_blank');
                    // Reset button text and color after upload
                    searchButtonbaidushitu.textContent = '百度识图';
                    searchButtonbaidushitu.style.background = '#28a745';
                } else {
                    alert('上传失败');
                    resetUpload();
                }
            }
        };

        xhr.onerror = function () {
            clearTimeout(timeout); // 清除超时
            alert('识图失败！');
            resetUpload();
        };
        let form = new FormData();
        xhr.open('POST', setting.server_url);
        form.append('imgdata', data);
        xhr.send(form);
        // Change button text and color during upload
        searchButtonbaidushitu.textContent = '请稍等';
        searchButtonbaidushitu.style.background = '#f00';
    }

    // 重置上传状态
    function resetUpload() {
        searchButtonbaidushitu.textContent = '百度识图';
        searchButtonbaidushitu.style.background = '#28a745';
    }

    // Create search button
    var searchButtonbaidushitu = document.createElement('button');
    searchButtonbaidushitu.textContent = '识图';
    searchButtonbaidushitu.style.width = '100%';
    searchButtonbaidushitu.style.height = '100%';
    searchButtonbaidushitu.style.backgroundColor = '#28a745'; // 橙色背景
    searchButtonbaidushitu.style.color = '#ffffff'; // 白色字体
    searchButtonbaidushitu.style.fontSize = '13px'; // 14号字体
    searchButtonbaidushitu.style.borderRadius = '5px'; // 圆角矩形

    // Create a hidden file input
    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    fileInput.accept = 'image/*';

    // 当文件输入改变时，读取文件
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            let file = this.files[0];
            let reader = new FileReader(); // 在这里创建一个新的文件读取器

            // 检查文件类型
            if (!file.type.startsWith('image/')) {
                alert('请上传图片');
                return;
            }

            reader.onload = function(file) {
                upload_file(this.result);
            };
            reader.readAsDataURL(file);
        }
        fileInput.value = ''; // 清空文件输入的值
    });


    // When the button is clicked, trigger the file input
    searchButtonbaidushitu.addEventListener('click', function() {
        fileInput.click();
    });

    // Add the button and file input to the page (or another container)
    innerDiv40.appendChild(searchButtonbaidushitu);
    innerDiv40.appendChild(fileInput);

    // Listen for alt+b key combination
    document.addEventListener('keydown', async function(event) {
        if (event.altKey && event.key === 'b') {
            try {
                let clipboardItems = await navigator.clipboard.read();
                for (let clipboardItem of clipboardItems) {
                    for (let type of clipboardItem.types) {
                        if (type.startsWith('image/')) {
                            let blob = await clipboardItem.getType(type);
                            let reader = new FileReader();
                            reader.onloadend = function() {
                                // 根据 shituyinqin 值调用不同的服务
                                if (shituyinqin) {
                                    // 如果 shituyinqin 为 true，调用搜狗
                                    setting.site_list["Sogou"] = default_setting.site_list["Sogou"];
                                } else {
                                    // 如果 shituyinqin 为 false，调用百度
                                    setting.site_list["Baidu"] = default_setting.site_list["Baidu"];
                                }
                                upload_file(reader.result);
                            };
                            reader.readAsDataURL(blob);
                            event.preventDefault();
                            break;
                        }
                    }
                }
            } catch (err) {
                console.error(err.name, err.message);
            }
        }
    });


    var base_url = "https://oes-coss.miguvideo.com:1443/oes-csas-manage/statistics/auditStatistics";
    var account_list = ['zbs003yaomingwei','zbs003yangenrui','zbs003liwenhui','zbs002wangtingting','zbs003hunaiyang','zbs003shijian','zbs003langshanshan','zbs003liurongxian','zbs002wangxue','zbs003gengyan','zbs003liutianmeng','zbs003wenlili',
                        'zbs003liuhao','zbs003zhanganqi','zbs003jianglichun','zbs003tangruomeng','zbs003baiyuezhou','zbs003lichuang','zbs003tiansong','zbs003wangwenwen','zbs003caixu','zbs003caoqun',
                        'zbs003hanqitong','zbs003hongjiaxin','zbs003liuji','zbs003zhangsuya','zbs003dengyanhui','zbs003guoshiyang','zbs003wangxiaotong','zbs002liyan','zbs003zhangwenbo','zbs003hewei',
                        'zbs003jiangbowen','zbs003jianglianghan','zbs003jinlong','zbs003liping','zbs003wangli','zbs003lizhuo','zbs004liuyang','zbs003zhouxinyu','zhuhuayue','zbs003zhaozhenyang',
                        'zbs003zhaohaibo','zbs001zhangyu','zbs003zhanxinxin','zbs003jiangnan','zbs003zangtianyu','zbs003xuxiaoying','zbs003xinjunda','zbs003xiaochangsheng','zbs003wangkai','zbs003shice',
                        'zbs003lvwentao','zbs002jiangnan','zbs003shangdongmei','zbs003liruomeng','zbs002zhangying','zbs003chenshuai','zbs002wangyu','zbs003zhuqianhe','zbs003dongwenyan','zbs003lihailong','zbs003zhanglina','zbs003chenxuening'];

    var today = new Date();
    var year = today.getFullYear();
    var month = ("0" + (today.getMonth() + 1)).slice(-2);
    var day = ("0" + today.getDate()).slice(-2);
    var startTime = `${year}-${month}-${day}+00:00:00`;
    var endTime = `${year}-${month}-${day}+23:59:59`;

    var displayBox = null; // 用于存储显示框元素的变量

    var isDisplaying = false; // 是否正在显示数据的标志

    function toggleDisplayBox() {
        if (isDisplaying) {
            document.body.removeChild(displayBox); // 移除显示框元素
            isDisplaying = false;
        } else {
            displayData(); // 显示数据
            isDisplaying = true;
        }
    }

    function displayData() {
        displayBox = document.createElement("div");
        displayBox.style.position = "fixed";
        displayBox.style.top = "50%";
        displayBox.style.left = "50%";
        displayBox.style.transform = "translate(-50%, -50%)";
        displayBox.style.background = "white";
        displayBox.style.padding = "20px";
        displayBox.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";
        displayBox.style.columns = "7"; // 设置为五列布局

        account_list.forEach(function(account) {
            var url = `${base_url}?account=${account}&startTime=${startTime}&endTime=${endTime}&current=1&size=10`;

            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var data = JSON.parse(xhr.responseText);
                    var total = data.data.records[0].total;

                    var accountElement = document.createElement("p");
                    accountElement.textContent = "账号名称： " + account;
                    accountElement.style.color = "black"; // 将账号名称标记为黑色
                    displayBox.appendChild(accountElement);

                    var totalElement = document.createElement("p");
                    totalElement.textContent = "数据量：" + total;
                    totalElement.style.color = "blue"; // 将数据量标记为蓝色
                    displayBox.appendChild(totalElement);

                    var records = data.data.records;
                    records.forEach(function(record) {
                        var list = record.list;
                        list.forEach(function(item) {
                            var aisleName = item.aisleName;
                            var uploadNum = item.uploadNum;

                            var aisleElement = document.createElement("p");
                            aisleElement.textContent = "通道名称：" + aisleName + " 审核数量： " + uploadNum;
                            aisleElement.style.color = "red"; // 将机审数量标记为红色
                            displayBox.appendChild(aisleElement);
                        });
                    });

                    displayBox.appendChild(document.createElement("br")); // 添加一个空行
                }
            };

            xhr.send();
        });

        document.body.appendChild(displayBox); // 将显示框元素添加到页面中
    }

    document.addEventListener("keydown", function(event) {
        if (event.key === "n") {
            if (userName1 === "zbs004liuyang") {
                toggleDisplayBox(); // 如果是liuyang, 则执行正常操作
            } else {
                //alert("对不起，您没有权限"); // 如果不是liuyang, 则提醒无权限
            }
        }
    });






})();

//查询模块结尾//


GM_registerMenuCommand('打开咪咕视频审核情况汇总', function() {
    // 打开一个新的网页
    window.open('https://kdocs.cn/l/cbjY9ndqBsNz', '_blank');
});

GM_registerMenuCommand('打开咪咕视频审核基本规则', function() {
    // 打开一个新的网页
    window.open('https://kdocs.cn/l/cc3g4lbuDQL0', '_blank');
});

GM_registerMenuCommand('打开百度识图', function() {
    // 打开一个新的网页
    window.open('https://image.baidu.com/', '_blank');
});




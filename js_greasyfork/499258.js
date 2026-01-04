// ==UserScript==
// @name         【tong】新版学习通考试平台批改试卷助手(左侧浮动按钮侧边栏)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在网页左侧浮动自定义命名的按钮
// @author       tong
// @match        http://xueya.chaoxing.com/*
// @match        https://xueya.chaoxing.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499258/%E3%80%90tong%E3%80%91%E6%96%B0%E7%89%88%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%80%83%E8%AF%95%E5%B9%B3%E5%8F%B0%E6%89%B9%E6%94%B9%E8%AF%95%E5%8D%B7%E5%8A%A9%E6%89%8B%28%E5%B7%A6%E4%BE%A7%E6%B5%AE%E5%8A%A8%E6%8C%89%E9%92%AE%E4%BE%A7%E8%BE%B9%E6%A0%8F%29.user.js
// @updateURL https://update.greasyfork.org/scripts/499258/%E3%80%90tong%E3%80%91%E6%96%B0%E7%89%88%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%80%83%E8%AF%95%E5%B9%B3%E5%8F%B0%E6%89%B9%E6%94%B9%E8%AF%95%E5%8D%B7%E5%8A%A9%E6%89%8B%28%E5%B7%A6%E4%BE%A7%E6%B5%AE%E5%8A%A8%E6%8C%89%E9%92%AE%E4%BE%A7%E8%BE%B9%E6%A0%8F%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let inputLabel = document.getElementsByClassName('el-input__inner');  //找到评分框
    let event = document.createEvent('HTMLEvents');

    // 自定义的按钮名称数组
    let buttonNames = [
        '得分0',
        '得分1',
        '得分2',
        '得分3',
        '得分4',
        '得分5',
        '得分6',
        '得分7',
        '得分8',
        '得分9',
        '旋转(-)',
        '画笔(+)',
        '撤销(.)',
        '提交(Enter)'
    ];

    // 创建一个包裹按钮的容器元素
    let container = document.createElement('div');
    container.id = 'float-buttons-container';

    // 设置容器的CSS样式以使其浮动在左侧
    let style = `
#float-buttons-container {
position: fixed;
left: 20px;
top: 50%;
transform: translateY(-50%);
z-index: 9999;
background-color: rgba(255, 255, 255, 0.8);
padding: 10px;
border-radius: 5px;
box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.float-button {
display: block; /* 确保按钮垂直排列 */
width: 100px; /* 设置按钮宽度 */
height: 30px; /* 设置按钮高度 */
margin-bottom: 5px; /* 按钮之间的间距 */
padding: 5px; /* 按钮内部文字与边框的间距 */
text-align: center; /* 文本居中显示 */
border: none; /* 去除边框 */
border-radius: 5px; /* 设置边框圆角 */
background-color: #4CAF50; /* 设置背景色 */
color: white; /* 设置文字颜色 */
font-family: 'Arial', sans-serif; /* 设置字体 */
font-size: 20px; /* 设置字体大小 */
cursor: pointer; /* 鼠标悬停时显示小手图标 */
}

.float-button:hover {
background-color: #45a049; /* 鼠标悬停时改变背景色 */
}

/* 省略其他可能需要的样式 */
`;

    // 创建一个样式元素并插入到头部
    let styleEl = document.createElement('style');
    styleEl.type = 'text/css';
    styleEl.appendChild(document.createTextNode(style));
    document.head.appendChild(styleEl);

    // 插入按钮到容器中
    for (let i = 0; i < buttonNames.length; i++) {
        let button = document.createElement('button');
        button.className = 'float-button';
        button.textContent = buttonNames[i]; // 设置按钮的文本内容为数组中的名称
        button.setAttribute('data-id', i + 1); // 设置data-id属性为1, 2, 3, ...
        button.onclick = function() {
            handleButtonClick(this);
        };
        container.appendChild(button); // 将按钮添加到容器中
        container.appendChild(document.createElement('br')); // 添加换行符以垂直排列按钮
    }

    // 将容器元素插入到body的开头
    document.body.insertBefore(container, document.body.firstChild);

    // 监听按钮点击事件
    function handleButtonClick(button) {
        let buttonId = button.getAttribute('data-id');
        // 根据buttonId执行不同的功能
        console.log('Button ' + buttonId + ' (' + button.textContent + ') clicked!');
        // 在这里添加你的自定义功能代码
        switch (buttonId) {
                //------------------------------------------
            case '1':
                // 执行按钮1的功能
                inputLabel[0].value =0;

                event.initEvent("change", true, true);
                inputLabel[0].dispatchEvent(event);
                break;
            case '2':
                // 执行按钮2的功能
                inputLabel[0].value =1;

                event.initEvent("change", true, true);
                inputLabel[0].dispatchEvent(event);
                break;
            case '3':
                // 执行按钮1的功能
                inputLabel[0].value =2;

                event.initEvent("change", true, true);
                inputLabel[0].dispatchEvent(event);
                break;
            case '4':
                // 执行按钮2的功能
                inputLabel[0].value =3;

                event.initEvent("change", true, true);
                inputLabel[0].dispatchEvent(event);
                break;
            case '5':
                // 执行按钮1的功能
                inputLabel[0].value =4;

                event.initEvent("change", true, true);
                inputLabel[0].dispatchEvent(event);
                break;
            case '6':
                // 执行按钮2的功能
                inputLabel[0].value =5;

                event.initEvent("change", true, true);
                inputLabel[0].dispatchEvent(event);
                break;
            case '7':
                // 执行按钮1的功能
                inputLabel[0].value =6;

                event.initEvent("change", true, true);
                inputLabel[0].dispatchEvent(event);
                break;
            case '8':
                // 执行按钮2的功能
                inputLabel[0].value =7;

                event.initEvent("change", true, true);
                inputLabel[0].dispatchEvent(event);
                break;
            case '9':
                // 执行按钮1的功能
                inputLabel[0].value =8;

                event.initEvent("change", true, true);
                inputLabel[0].dispatchEvent(event);
                break;
            case '10':
                // 执行按钮2的功能
                inputLabel[0].value =9;

                event.initEvent("change", true, true);
                inputLabel[0].dispatchEvent(event);
                break;
                //------------------------------------------
            case '11':
                // 执行按钮1的功能
                document.getElementsByClassName('rotateLabel rotateLeft')[0].focus();
                document.getElementsByClassName('rotateLabel rotateLeft')[0].click();
                document.getElementsByClassName('rotateLabel rotateLeft')[0].blur();
                break;
            case '12':
                // 执行按钮2的功能
                document.getElementsByClassName('bb')[0].click();
                break;
            case '13':
                // 执行按钮1的功能
                document.getElementsByClassName('withdraw active1')[0].focus();
                document.getElementsByClassName('withdraw active1')[0].click();
                document.getElementsByClassName('withdraw active1')[0].blur();
                break;
            case '14':
                // 执行按钮2的功能
                var NowScore = inputLabel[0].value;
                if (NowScore =='0.0')
                {
                    alert("该题没有打分！");
                }
                else {
                    document.getElementById('completeClass').click();
                }

            default:
                // 处理未知按钮ID的情况
                console.error('Unknown button ID:', buttonId);
                break;
        }
    }


    //------------------------------------------
    //快捷键
    function button()
    {
        var q = window.event.keyCode;
        var event = document.createEvent('HTMLEvents');

        //----利用小键盘输入分数---------------------------------------
        if(q == 96)//NumPad0键
        {
            inputLabel[0].value =0;
            //var event = document.createEvent('HTMLEvents');
            event.initEvent("change", true, true);
            inputLabel[0].dispatchEvent(event);
        }
        if(q == 97)//NumPad1键
        {
            inputLabel[0].value =1;
            //var event = document.createEvent('HTMLEvents');
            event.initEvent("change", true, true);
            inputLabel[0].dispatchEvent(event);
        }

        if(q == 98)//NumPad2键
        {
            inputLabel[0].value =2;
            //var event = document.createEvent('HTMLEvents');
            event.initEvent("change", true, true);
            inputLabel[0].dispatchEvent(event);
        }

        if(q == 99)//NumPad3键
        {
            inputLabel[0].value =3;
            // var event = document.createEvent('HTMLEvents');
            event.initEvent("change", true, true);
            inputLabel[0].dispatchEvent(event);
        }

        if(q == 100)//NumPad4键
        {
            inputLabel[0].value =4;
            //var event = document.createEvent('HTMLEvents');
            event.initEvent("change", true, true);
            inputLabel[0].dispatchEvent(event);
        }
        if(q == 101)//NumPad5键
        {
            inputLabel[0].value =5;
            //var event = document.createEvent('HTMLEvents');
            event.initEvent("change", true, true);
            inputLabel[0].dispatchEvent(event);
        }

        if(q == 102)//NumPad6键
        {
            inputLabel[0].value =6;
            // var event = document.createEvent('HTMLEvents');
            event.initEvent("change", true, true);
            inputLabel[0].dispatchEvent(event);
        }

        if(q == 103)//NumPad7键
        {
            inputLabel[0].value =7;
            //var event = document.createEvent('HTMLEvents');
            event.initEvent("change", true, true);
            inputLabel[0].dispatchEvent(event);
        }

        if(q == 104)//NumPad8键
        {
            inputLabel[0].value =8;
            //var event = document.createEvent('HTMLEvents');
            event.initEvent("change", true, true);
            inputLabel[0].dispatchEvent(event);
        }

        if(q == 105)//NumPad9键
        {
            inputLabel[0].value =9;
            //var event = document.createEvent('HTMLEvents');
            event.initEvent("change", true, true);
            inputLabel[0].dispatchEvent(event);
        }
        //-------------------------------------------


        if(q == 109)//NumPad-键，逆时针旋转图片
        {
            document.getElementsByClassName('rotateLabel rotateLeft')[0].focus();

            document.getElementsByClassName('rotateLabel rotateLeft')[0].click();

            document.getElementsByClassName('rotateLabel rotateLeft')[0].blur();
        }

        if(q == 110)//NumPad.键，撤销
        {
            document.getElementsByClassName('withdraw active1')[0].focus();

            document.getElementsByClassName('withdraw active1')[0].click();

            document.getElementsByClassName('withdraw active1')[0].blur();
        }
        if(q == 107)//NumPad-键，画笔
        {
            document.getElementsByClassName('bb')[0].click();
        }
        if(q == 13)//NumPad Enter键，完成
        {
            var NowScore = inputLabel[0].value;
            if (NowScore =='0.0')
            {
                alert("该题没有打分！");
            }
            else
            {
                document.getElementById('completeClass').click();
            }
        }
        /*
    if(event.ctrlKey)
	{
		alert("按下了Ctrl键");
	}

	if(q == 75 && event.ctrlKey)//按下 k键+Ctrl键
    {
        //你的代码
    }
    */
    }
    document.onkeydown = button; //当按下按键时，onkeydown调用button函数

    //--------------------------------------------------------
    //下面是直接在页面上显示答案

    window.onload = function() {
        // 确保 DOM 已经完全加载
        var elements = document.getElementsByClassName('answersCard');

        // 检查是否找到了至少一个元素
        if (elements.length > 0) {
            // 如果有多个元素，你可能需要遍历它们
            // 这里我们假设只需要修改第一个元素
            var element = elements[0];

            // 修改元素的属性
            element.style="overflow: hidden; outline: none;"

        } else {
            // 如果没有找到元素，你可能想要设置一个定时器来稍后重试
            // 但请注意，这可能会导致无限循环，除非你有明确的退出条件
            // 例如，你可以设置一个最大重试次数
            console.log('没有找到具有指定 class 的元素');
        }
    };



})();
// ==UserScript==
// @name         【tong】新版学习通考试平台试卷复查助手(右侧浮动按钮侧边栏)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在网页左侧浮动自定义命名的按钮
// @author       tong
// @match        http://mooc2-ans.chaoxing.com/*
// @match        https://mooc2-ans.chaoxing.com/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/499749/%E3%80%90tong%E3%80%91%E6%96%B0%E7%89%88%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%80%83%E8%AF%95%E5%B9%B3%E5%8F%B0%E8%AF%95%E5%8D%B7%E5%A4%8D%E6%9F%A5%E5%8A%A9%E6%89%8B%28%E5%8F%B3%E4%BE%A7%E6%B5%AE%E5%8A%A8%E6%8C%89%E9%92%AE%E4%BE%A7%E8%BE%B9%E6%A0%8F%29.user.js
// @updateURL https://update.greasyfork.org/scripts/499749/%E3%80%90tong%E3%80%91%E6%96%B0%E7%89%88%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%80%83%E8%AF%95%E5%B9%B3%E5%8F%B0%E8%AF%95%E5%8D%B7%E5%A4%8D%E6%9F%A5%E5%8A%A9%E6%89%8B%28%E5%8F%B3%E4%BE%A7%E6%B5%AE%E5%8A%A8%E6%8C%89%E9%92%AE%E4%BE%A7%E8%BE%B9%E6%A0%8F%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var y= document.getElementsByClassName('personalInfor clearfix');//右端姓名悬浮框

    var TotalScoreElement = document.getElementsByClassName('totalScore marginRight30 fl');//总分框

    var DefenkuangElement = document.getElementsByClassName('inputBranch questionScore subScore');//得分框


    // 自定义的按钮名称数组
    let buttonNames = [
        y[0].children[1].children[0].textContent,
        y[0].children[1].children[1].textContent,
        '总分：'+TotalScoreElement[0].children[0].value,
        '计算题1得分：'+DefenkuangElement[0].value,
        '计算题2得分：'+DefenkuangElement[1].value,
        '计算题3得分：'+DefenkuangElement[2].value,
        '计算题4得分：'+DefenkuangElement[3].value,
        '计算题5得分：'+DefenkuangElement[4].value,
        '计算题6得分：'+DefenkuangElement[5].value,
        //'得分8',

    ];

    // 创建一个包裹按钮的容器元素
    let container = document.createElement('div');
    container.id = 'float-buttons-container';

    // 设置容器的CSS样式以使其浮动在左侧
    let style = `
#float-buttons-container {
position: fixed;
right: 100px;
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
width: 200px; /* 设置按钮宽度 */
height: 50px; /* 设置按钮高度 */
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

                break;
            case '2':
                // 执行按钮2的功能

                break;
            case '3':
                // 执行按钮1的功能

                break;
            case '4':
                // 执行按钮2的功能
                DefenkuangElement[0].focus();
                DefenkuangElement[0].blur();

                break;
            case '5':
                // 执行按钮1的功能
                DefenkuangElement[1].focus();
                DefenkuangElement[1].blur();
                break;
            case '6':
                // 执行按钮2的功能
                DefenkuangElement[2].focus();
                DefenkuangElement[2].blur();
                break;
            case '7':
                // 执行按钮1的功能
                DefenkuangElement[3].focus();
                DefenkuangElement[3].blur();
                break;
            case '8':
                // 执行按钮2的功能
                DefenkuangElement[4].focus();
                DefenkuangElement[4].blur();
                break;
            case '9':
                // 执行按钮1的功能
                DefenkuangElement[5].focus();
                DefenkuangElement[5].blur();
                break;


            default:
                // 处理未知按钮ID的情况
                console.error('Unknown button ID:', buttonId);
                break;
        }
    }

    function sub(){

        //设置右侧悬浮的元素
        var y= document.getElementsByClassName('personalInfor clearfix');//右端姓名悬浮框
        y[0].children[1].children[0].style.fontSize="30px";//姓名
        y[0].children[1].children[1].style.fontSize="30px";//学号

        $(".moreSettingDown").click();//右侧点击“更多设置”

        $(".subjectiveTitleCheck").click();//右侧点击“显示主观题题干”

        $(".subjectiveAnswerCheck").click();//右侧点击“显示主观题正确答案”

        var DatikuangElement= document.getElementsByClassName('edui-editor-iframeholder edui-default');//答题框

        //设置得分框的文本大小，同时设置答题框的高度
        for (i = 0; i < DefenkuangElement.length; i++) {
            DefenkuangElement[i].style.height = "60px";
            DefenkuangElement[i].style.fontSize = "40px";
            DefenkuangElement[i].style.fontWeight = 'bold';
            DefenkuangElement[i].style.color = 'red';


            DatikuangElement[i].style.height = "1080px";

        }

    }


    //下面代码是隔一秒后重新刷新一次，保证编辑框加载出图片的原始高度
    var url = location.href; //把当前页面的地址赋给变量 url
    var times = url.split("?"); //分切变量 url 分隔符号为 "?"
    console.log(times);
    if(times[times.length-1] != 1){ //如果?后的值不等于1表示没有刷新
        url += "?1"; //把变量 url 的值加入 ?1
        setTimeout(function(){
            self.location.replace(url); //刷新页面
        },1000)
    }


    //在浏览器控制台可以查看所有函数，ctrl+shift+I 调出控制台，在Console窗口进行实验测试
    setTimeout(sub,1000);
    var _alert=window.alert;
    window.alert=function(){
        return true;
    }




})();
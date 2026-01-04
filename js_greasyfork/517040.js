// ==UserScript==
// @name         UCAS 评教
// @version      0.2
// @description  在中国科学院大学评教系统中自动选中“非常符合/非常满意”，并将文本框最小字数改为1个字。
// @author       lcr
// @match        *://*.ucas.ac.cn:8443/evaluate/eva*
// @license MI
// @namespace https://greasyfork.org/users/1394986
// @downloadURL https://update.greasyfork.org/scripts/517040/UCAS%20%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/517040/UCAS%20%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==
(function(){
    'use strict';

    function choose(name){
        var radio;
        radio = document.getElementsByName(name);
        if(radio.length > 0){
            radio[0].checked = 1;
        }
    };
    function setlength(name){
        var text;
        text = document.getElementsByName(name);
        if(text.length > 0){
            text[0].setAttribute("minlength","1");
        }
    };

    function autofill(name, string){
        var text;
        text = document.getElementsByName(name);
        if(text.length > 0){
            text[0].value = string;
        }
    };


    var i;

    for (i = 1346; i <= 1417; i++) {
        choose("item_" + i.toString());
    }

    choose("radio_1360")
    var multi = document.getElementsByName("item_1366");
    if(multi.length > 0){
        multi[0].checked = 0;
        multi[1].checked = 1;
        multi[4].checked = 1;
        multi[5].checked = 1;
    }
    var strings = [".",
                   ".",
                   ".",
                   ".",
                   ".",
                   ".",
                   ".", ]
    for (i = 0; i <= 4; i++) {
        var st = "item_" + (i+1355).toString()
        setlength(st)
        autofill(st, strings[i]);
    }

    for(i=0;i <= 1;i ++)
    {
        st = "item_" + (i+1403).toString()
        setlength(st)
        autofill(st, strings[i+5])
    }

(function() {
    'use strict';

    // 获取目标容器 .form-actions
    const formActionsDiv = document.querySelector('.form-actions');

    let newDiv = formActionsDiv

    if (!formActionsDiv) {
        console.error('无法找到 .form-actions 元素');
        newDiv = document.createElement('div');
        // 获取 .mc-body 元素
        let mcBodyDiv = document.querySelector('.mc-body');
        if (mcBodyDiv) {
console.log("dawda")
             // 获取 .mc-body 下一级的所有子元素
            let childElements = mcBodyDiv.children;

            // 遍历所有子元素
            Array.from(childElements).forEach((child) => {
                // 排除 <div class="head">、<p> 和 <form id="regfrm">
                if (!(child.classList && child.classList.contains('head')) &&
                    !(child.tagName === 'P') &&
                    !(child.id === 'regfrm')) {
                    // 将符合条件的元素添加到新 div 中
                    newDiv.appendChild(child);
                }
            });
        }

    }

    // 创建新的 div 元素
  //  newDiv.id = 'newDivContainer';  // 为新 div 设置 id（可选）
    newDiv.style.border = '3px solid #ccc';  // 设置新 div 的样式（可选）
    newDiv.style.padding = '10px';  // 设置一些内边距（可选）
    newDiv.style.backgroundColor = 'white';  // 设置背景色（可选）
    newDiv.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';  // 为新 div 添加阴影效果（可选）
    newDiv.style.width = '300px';
    newDiv.style.height= '100px';
    newDiv.style.margin = '0px';

    // 将原有 .form-actions 的所有内容移动到新 div 中

    // 设置新 div 的定位样式，将其放置在右上角 300px 的位置
    newDiv.style.position = 'fixed';  // 固定定位
    newDiv.style.top = '200px';  // 距离页面顶部 300px
    newDiv.style.right = '100px';  // 距离页面右边缘 0px
    newDiv.style.zIndex = '9999';  // 设置较高的层级，确保在页面的上层




    // 添加拖动功能
    let offsetX, offsetY, isDragging = false;

    // 鼠标按下时开始拖动
    newDiv.addEventListener('mousedown', function(event) {
        isDragging = true;
        offsetX = event.clientX - newDiv.offsetLeft;  // 计算鼠标相对 div 的位置
        offsetY = event.clientY - newDiv.offsetTop;

        // 添加鼠标移动事件来实现拖动
        document.addEventListener('mousemove', moveDiv);
        // 鼠标松开时停止拖动
        document.addEventListener('mouseup', stopDrag);
    });

    // 移动 div
    function moveDiv(event) {
        if (isDragging) {
            newDiv.style.left = `${event.clientX - offsetX}px`;  // 更新 div 的 left 值
            newDiv.style.top = `${event.clientY - offsetY}px`;  // 更新 div 的 top 值
        }
    }

    // 停止拖动
    function stopDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', moveDiv);  // 移除鼠标移动事件
        document.removeEventListener('mouseup', stopDrag);  // 移除鼠标松开事件
    }
    document.body.appendChild(newDiv);


    let imgElement = document.getElementById('adminValidateImg');
    // 将新 div 插入到页面中的合适位置，假设我们将它插入到 body 的末尾

    if (imgElement) {
        // 监听图片加载完成后放大
        imgElement.onload = function() {
            imgElement.style.width = 100 + 'px';
            imgElement.style.height = 40 + 'px';
        };

        // 如果图片已经加载完成，直接修改
        if (imgElement.complete) {
            imgElement.onload();
        }
    }

    const saveButton = document.getElementById('sb1');

    if (!saveButton) {
        console.error('没有找到 "保存" 按钮');
        return;
    }

    // 获取 "确定" 按钮
    const confirmButtonSelector = '.jbox-button[value="ok"]';

    // 点击保存按钮时触发的事件
    saveButton.addEventListener('click', function() {
        console.log('点击了保存按钮');

        // 每隔 1 秒检查一次是否出现 "确定" 按钮
        let intervalId = setInterval(function() {
            const confirmButton = document.querySelector(confirmButtonSelector);
            if (confirmButton) {
                console.log('找到了 "确定" 按钮，点击它');
                confirmButton.click();  // 点击 "确定" 按钮
                clearInterval(intervalId);  // 点击后清除定时器
            }
        }, 500);  // 每隔 1 秒检查一次
    });
})();
})();

// ==UserScript==
// @name         嘉兴大学教务处学生评价
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  嘉人们，还在为期末教务网学生评价而烦恼吗？快来试试这个吧！
// @author       GGB
// @match        http://jwzx.zjxu.edu.cn/jwglxt/xspjgl/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522474/%E5%98%89%E5%85%B4%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E5%A4%84%E5%AD%A6%E7%94%9F%E8%AF%84%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/522474/%E5%98%89%E5%85%B4%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E5%A4%84%E5%AD%A6%E7%94%9F%E8%AF%84%E4%BB%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
var enableConfirmButton = false;
    var    chooseAD ;
    var    chooseSubmit ;
    var    inputField_PJ ;
   // 创建浮动窗口
var floatWindow = document.createElement('div');
floatWindow.style.position = 'fixed';
floatWindow.style.width = '350px';
floatWindow.style.height = '300px';
floatWindow.style.backgroundColor = '#f9f9f9';
floatWindow.style.border = '1px solid #ccc';
floatWindow.style.zIndex = '10000';
floatWindow.style.padding = '10px';
floatWindow.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.1)';
floatWindow.style.borderRadius = '8px';
floatWindow.style.fontFamily = 'Arial, sans-serif';
floatWindow.style.cursor = 'default'; // 初始光标样式
floatWindow.style.boxSizing = 'border-box'; // 确保内边距和边框包含在高度和宽度中

document.body.appendChild(floatWindow);



// 将窗口居中
floatWindow.style.left = `calc(50% - ${floatWindow.offsetWidth / 2}px)`;
floatWindow.style.top = `calc(50% - ${floatWindow.offsetHeight / 2}px)`;

// 添加标题
var title = document.createElement('h3');
title.textContent = '评价配置';
title.style.margin = '0';
title.style.marginBottom = '15px';
title.style.fontSize = '18px';
title.style.color = '#333';
title.style.textAlign = 'center';
floatWindow.appendChild(title);

// 创建一个容器，用于并排显示下拉菜单和提示
var dropdownContainer = document.createElement('div');
dropdownContainer.style.display = 'flex';
dropdownContainer.style.justifyContent = 'space-between';
dropdownContainer.style.marginBottom = '10px';
floatWindow.appendChild(dropdownContainer);

// 添加包含选项A-D的下拉菜单
var selectAD = document.createElement('select');
['A', 'B'].forEach(function(optionText) {
    var option = document.createElement('option');
    option.value = optionText;
    option.text = optionText;
    selectAD.appendChild(option);
});
styleDropdown(selectAD);
dropdownContainer.appendChild(selectAD);

// 添加包含选项保存-提交的下拉菜单
var selectSaveSubmit = document.createElement('select');
['保存', '提交'].forEach(function(optionText) {
    var option = document.createElement('option');
    option.value = optionText;
    option.text = optionText;
    selectSaveSubmit.appendChild(option);
});
styleDropdown(selectSaveSubmit);
dropdownContainer.appendChild(selectSaveSubmit);

// 添加输入框
var inputField = document.createElement('textarea');
inputField.placeholder = '请输入评价（500字以内,可留空）';
inputField.style.display = 'block';
inputField.style.width = '100%';
inputField.style.height = '100px';
inputField.style.marginBottom = '10px';
inputField.style.padding = '8px';
inputField.style.border = '1px solid #ccc';
inputField.style.borderRadius = '4px';
inputField.style.resize = 'none';
inputField.maxLength = 500;
floatWindow.appendChild(inputField);

// 添加字符计数显示
var charCount = document.createElement('div');
charCount.style.textAlign = 'right';
charCount.style.fontSize = '12px';
charCount.style.color = '#999';
charCount.textContent = '0/500';
floatWindow.appendChild(charCount);

// 当用户输入时更新字符计数
inputField.addEventListener('input', function() {
    charCount.textContent = `${inputField.value.length}/500`;
});

// 添加确认按钮
var confirmButton = document.createElement('button');
confirmButton.textContent = '开始执行';
confirmButton.style.display = 'block';
confirmButton.style.width = '100%';
confirmButton.style.padding = '10px';
confirmButton.style.backgroundColor = '#007bff';
confirmButton.style.color = 'white';
confirmButton.style.border = 'none';
confirmButton.style.borderRadius = '4px';
confirmButton.style.cursor = 'pointer';
confirmButton.style.fontSize = '16px';
confirmButton.style.marginTop = '10px';
confirmButton.style.transition = 'background-color 0.3s';
confirmButton.onmouseover = function() {
    confirmButton.style.backgroundColor = '#0056b3';
};
confirmButton.onmouseout = function() {
    confirmButton.style.backgroundColor = '#007bff';
};
floatWindow.appendChild(confirmButton);

// 下拉菜单样式函数
function styleDropdown(dropdown) {
    dropdown.style.width = '45%';
    dropdown.style.padding = '8px';
    dropdown.style.border = '1px solid #ccc';
    dropdown.style.borderRadius = '4px';
    dropdown.style.backgroundColor = '#fff';
}


// 从本地存储中获取数据
var savedData = JSON.parse(localStorage.getItem('evaluationData'));
// 设置浮窗内的元素值为上次保存的值（如果存在）
if (savedData) {
    selectAD.value = savedData.selectedAD;
    selectSaveSubmit.value = savedData.saveOrSubmit;
    inputField.value = savedData.evaluation;
    charCount.textContent = `${inputField.value.length}/500`;
}

// 使浮动窗口可拖动
floatWindow.onmousedown = function(event) {
    floatWindow.style.cursor = 'move'; // 按下时显示移动光标
    var shiftX = event.clientX - floatWindow.getBoundingClientRect().left;
    var shiftY = event.clientY - floatWindow.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
        floatWindow.style.left = pageX - shiftX + 'px';
        floatWindow.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    document.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        document.onmouseup = null;
        floatWindow.style.cursor = 'default'; // 松开时恢复默认光标
    };
};

floatWindow.ondragstart = function() {
    return false;
};









// 定义一个方法，选择指定的option
 function selectOption() {
        var select = document.querySelector('select.ui-pg-selbox[name="currentPage"]');
        if (select) {
            select.value = "50";
            var event = new Event('change', { bubbles: true });
            select.dispatchEvent(event);
            console.log('Option 50 selected');
        } else {
            console.log('Select element not found');
        }
    }

    // 定义一个方法，接受表格ID和点击间隔作为参数
function autoClickRows() {
    // 获取所有的tr元素
    var rows = document.querySelectorAll('#tempGrid tr.ui-widget-content.jqgrow');

    // 定义点击间隔时间（毫秒）
    var interval = 1000;
    var currentIndex = 0;

    function clickNextRow() {
        // 如果所有行都已经点击过，停止执行
        if (currentIndex >= rows.length) {
            enableConfirmButton = true;
            return;
        }

        // 点击当前行
        rows[currentIndex].click();
        console.log(rows[currentIndex].id);
        // 获取课程名称的单元格
        var courseNameCell = rows[currentIndex].querySelector('[aria-describedby="tempGrid_kcmc"]');
        
        // 提取课程名称的值
        var courseName = courseNameCell.textContent.trim();
        console.log("正在评价课程: " + courseName);

        // 依次选择评价选项和点击按钮
        setTimeout(function() {
            choose_A();
            inputTextIntoTextarea();
            clickBtn();
            
            // 等待一段时间后再点击下一行
            currentIndex++;
            setTimeout(clickNextRow, interval);

        }, 1000);
    }

    // 开始点击第一行
    clickNextRow();
}


    function choose_A() {
        // 获取目标节点
    var targetNode = document.querySelector("#ajaxForm1 > div.panel-body.xspj-body > div.panel.panel-default.panel-pjdx > div.panel-body");
    if (!targetNode) {
        console.error("找不到选项");
        return;
    }

    // 遍历目标节点下的所有表格
    var tables = targetNode.querySelectorAll('table');
    tables.forEach(function(table) {
        // 遍历表格下的所有行
        var rows = table.querySelectorAll('tr');
        rows.forEach(function(row) {
            // 获取行中的 radio-inline 元素
            var radioInline = row.querySelector('div.radio-inline');
            if (radioInline) {
                // 在 radio-inline 中选择第一个 input 元素（即单选按钮）
                var radioButton ;
                switch(chooseAD){
                    case 'A' :
                        radioButton = radioInline.querySelector('input[type="radio"]');
                        break;
                    case 'B':
                        radioButton = row.querySelector('.input-xspj-2 input[type="radio"]');
                        break;
                }
                if (radioButton) {
                    // 选中单选按钮
                    radioButton.checked = true;
                    //console.log("选中A");
                }else{
                    console.log("找不到");

                }
            }
        });
    });
    }
//提交或保存
function clickBtn() {   
    var text;
    console.log(chooseSubmit=="保存");
    if(chooseSubmit=="保存"){
        var btn = document.querySelector("#btn_xspj_bc");
        text = "保存评价";
    }else{
        var btn = document.querySelector("#btn_xspj_tj");
        text = "提交评价";
    }
    if (btn) {
        btn.click();
        console.log(text);

        //clickBtnOK();
    } else {
        console.error("找不到按钮");
    }
}
//提交或保存后确认
function clickBtnOK() {   
    //var btn = document.querySelector("#successModal > div > div > div.modal-header.ui-draggable-handle > button");
        var xpath = "/html/body/div[5]/div/div/div[3]/button";
        // 选取输入框
        var btn = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    if (btn) {
        btn.click();
    } else {
        console.error("找不到确认按钮");
    }
}

// 定义一个函数用于输入文字
    function inputTextIntoTextarea() {
        var xpath = "/html/body/div[1]/div/div/div[3]/div[2]/div/div[3]/form/div[2]/div[1]/div[3]/div/textarea";
        // 选取输入框
        var inputElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        // 如果找到了输入框
        if (inputElement) {
            // 在输入框中输入文字
            inputElement.value = inputField_PJ;
            console.log("输入成功：" );

        } else {
            console.error("找不到指定ID的输入框：");
        }
    }


// 添加确认按钮点击事件处理程序
confirmButton.addEventListener('click', function() {
    confirmButton.textContent = '正在评价......';
    enableConfirmButton = false;
    // 禁用确认按钮
    confirmButton.disabled = true;
    // 改变鼠标指针为不可用
    confirmButton.style.cursor = 'not-allowed'; 
    // 获取选项A-D的值
    var selectedAD = selectAD.value;
    
    // 获取保存/提交选项的值
    var saveOrSubmit = selectSaveSubmit.value;
    
    // 获取输入框中的评价内容
    var evaluation = inputField.value;
    
    // 现在你可以将这些值保存到一个对象中，或者执行其他操作，比如发送给服务器等
    var evaluationData = {
        selectedAD: selectedAD,
        saveOrSubmit: saveOrSubmit,
        evaluation: evaluation
    };
    
    console.log(evaluationData);
    // 将数据保存到本地存储中
    localStorage.setItem('evaluationData', JSON.stringify(evaluationData));

    //设置完成后开始执行
    // 从本地存储中获取数据
        var savedData = JSON.parse(localStorage.getItem('evaluationData'));
        // 设置浮窗内的元素值为上次保存的值（如果存在）
        if (savedData) {
        chooseAD = savedData.selectedAD;
        chooseSubmit = savedData.saveOrSubmit;
        inputField_PJ = savedData.evaluation;
        }
        // 选择值为50的选项
        selectOption();
        // 依次点击所有的tr元素
        setTimeout(autoClickRows, 2000);


    // 设置一个定时器，检测全局变量的变化
setInterval(function() {
    if (enableConfirmButton) {
        confirmButton.textContent = '开始执行';
        confirmButton.disabled = false; // 恢复按钮可点击
        confirmButton.style.cursor = 'pointer'; // 恢复鼠标指针
    }
}, 1000); // 每秒检测一次全局变量  

    
});

})();

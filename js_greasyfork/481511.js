// ==UserScript==
// @name         修改所属工程部位列宽及行数
// @match        http://222.85.144.77:7743/*
// @grant    GM_setValue
// @grant    GM_getValue
// @version      2.4.6
// @author       D
// @description  建议只修改行高与列宽的默认值
// @namespace https://greasyfork.org/users/1229073
// @downloadURL https://update.greasyfork.org/scripts/481511/%E4%BF%AE%E6%94%B9%E6%89%80%E5%B1%9E%E5%B7%A5%E7%A8%8B%E9%83%A8%E4%BD%8D%E5%88%97%E5%AE%BD%E5%8F%8A%E8%A1%8C%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/481511/%E4%BF%AE%E6%94%B9%E6%89%80%E5%B1%9E%E5%B7%A5%E7%A8%8B%E9%83%A8%E4%BD%8D%E5%88%97%E5%AE%BD%E5%8F%8A%E8%A1%8C%E6%95%B0.meta.js
// ==/UserScript==




    //行高默认值，默认为40
    let defaultValueHeight = 40;

    //列宽默认值，默认为35
    let defaultValueWidth = 35;

    //列表号默认值，默认为2 ,  1
    let defaultValueTable = 2;

    //列序号默认值，默认为13 , 6
    let defaultValueIndex = 13;






















    let flag = true;

(function() {
    'use strict';

    const containerWidth = document.createElement('div');
    const containerHeight = document.createElement('div');

    const labelWidth = document.createElement('label');
    labelWidth.textContent = '表号， 序号， 列宽';
    labelWidth.style.display = 'block';
    labelWidth.style.marginBottom = '5px';
    containerWidth.appendChild(labelWidth);

    const labelHeight = document.createElement('label');
    labelHeight.textContent = '行数';
    labelHeight.style.display = 'block';
    labelHeight.style.marginTop = '10px';
    labelHeight.style.marginBottom = '5px';
    containerHeight.appendChild(labelHeight);

    const inputHeight = document.createElement('input');
    inputHeight.type = 'number';
    inputHeight.placeholder = 'Enter height (px)';
    inputHeight.style.width = '50px';
    inputHeight.value = defaultValueHeight;
    containerHeight.appendChild(inputHeight);
    inputHeight.addEventListener("input",handleInputHeight);


    const applyHeightButton = document.createElement('button');
    applyHeightButton.textContent = '修改行数';
    applyHeightButton.addEventListener('click', applyHeightChanges);
    applyHeightButton.style.width = '100px';


    const buttonApply = document.createElement('button');
    buttonApply.innerText = '修改';
    buttonApply.addEventListener('click', applyChanges);
    buttonApply.style.width = '50px';

    const buttonSwitch = document.createElement('button');
    buttonSwitch.innerText = '切换';
    buttonSwitch.addEventListener('click', buttonSwitchs);
    buttonSwitch.style.color = 'green';
    buttonSwitch.style.width = '50px';

    const buttonReset = document.createElement('button');
    buttonReset.innerText = '重置';
    buttonReset.addEventListener('click', buttonResets);
    buttonReset.style.color = 'red';
    buttonReset.style.width = '50px';

    const floatingWindow = document.createElement('div');
    floatingWindow.style.position = 'fixed';
    floatingWindow.style.top = '10px';
    floatingWindow.style.right = '10px';
    floatingWindow.style.padding = '10px';
    floatingWindow.style.backgroundColor = '#FFE780';
    floatingWindow.style.border = '1px solid #ccc';
    floatingWindow.style.zIndex = '10000';
    floatingWindow.style.width = '200px'; // 设置窗口宽度
    floatingWindow.style.borderRadius = '10px'; // 添加圆角矩形的样式
    floatingWindow.style.opacity = 0.8;

    const inputWidth = document.createElement('input');
    inputWidth.type = 'number';
    inputWidth.placeholder = '宽度';
    const isLastWidthNull = GM_getValue('lastWidth');
    /*
    if (!undefined == isLastWidthNull) {
            inputWidth.value = isLastWidthNull;
        } else {
            inputWidth.value = defaultValueWidth;
        }*/
    inputWidth.value = defaultValueWidth;
    inputWidth.style.width = '50px'; // 设置输入框宽度为80像素，足够输入三位数
    inputWidth.addEventListener("input",handleInputWidth);


    const inputIndex = document.createElement('input');
    inputIndex.type = 'number';
    inputIndex.placeholder = '列序号';
    inputIndex.value = defaultValueIndex;
    inputIndex.style.width = '50px'; // 设置输入框宽度为80像素，足够输入三位数
    //document.body.appendChild(floatingWindow);

    const inputTable = document.createElement('input');
    inputTable.type = 'number';
    inputTable.placeholder = '表号';// 1 or 2
    inputTable.value = defaultValueTable;
    inputTable.style.width = '50px'; // 设置输入框宽度为80像素，足够输入三位数
    //document.body.appendChild(floatingWindow);

    containerWidth.appendChild(inputTable);
    containerWidth.appendChild(inputIndex);
    containerWidth.appendChild(inputWidth);

    // 初始化窗口状态为可见
    let isWindowVisible = true;

    // 添加按钮来切换窗口的可见性
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'F2 隐藏/打开窗口';
    toggleButton.addEventListener('click', () => {
        if (isWindowVisible) {
            floatingWindow.style.display = 'none';
        } else {
            floatingWindow.style.display = 'block';
        }
        isWindowVisible = !isWindowVisible;
    });
    toggleButton.style.width = '150px';
    floatingWindow.appendChild(toggleButton);

    //document.body.appendChild(floatingWindow);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'F2') {
            event.preventDefault(); // 阻止F2键的默认行为
            if (isWindowVisible) {
                floatingWindow.style.display = 'none';
            } else {
                floatingWindow.style.display = 'block';
            }
            isWindowVisible = !isWindowVisible;
        }
    });

    function handleInputWidth(){
        //GM_setValue('lastWidth',inputWidth.value);
        applyChanges();
    }
    function handleInputHeight(){
        //GM_setValue('lastWidth',inputWidth.value);
        applyHeightChanges();
    }

    function applyHeightChanges() {
        const heightValue = parseInt(inputHeight.value*10, 10);
        if (isNaN(heightValue)) return;

        const targetDivs = document.querySelectorAll('.el-table__body-wrapper.is-scrolling-left');
        targetDivs.forEach((div) => {
            div.style.height = `${heightValue}px`;
        });
        const targetDivsMiddle = document.querySelectorAll('.el-table__body-wrapper.is-scrolling-middle');
        targetDivsMiddle.forEach((div) => {
            div.style.height = `${heightValue}px`;
        });
        const targetDivsRight = document.querySelectorAll('.el-table__body-wrapper.is-scrolling-right');
        targetDivsRight.forEach((div) => {
            div.style.height = `${heightValue}px`;
        });
        const targetMain = document.querySelectorAll('.el-main main');
        targetMain.forEach((div) => {
            div.style.height = `${heightValue}px`;
        })
    }

    function applyChanges() {
        const newWidth = parseInt(inputWidth.value*10, 10);
        if (isNaN(newWidth)) return;

        const cells = document.querySelectorAll(`.el-table_${inputTable.value}_column_${inputIndex.value}.is-center .cell.el-tooltip`);
        cells.forEach(cell => {
            cell.style.width = `${newWidth}px`;
        });

        const colsBodyLeft = document.querySelectorAll(`.el-table__body-wrapper.is-scrolling-left colgroup col[name="el-table_${inputTable.value}_column_${inputIndex.value}"]`);
        colsBodyLeft.forEach(col => {
            col.width = newWidth;
        });

        const colsBodyMiddle = document.querySelectorAll(`.el-table__body-wrapper.is-scrolling-middle colgroup col[name="el-table_${inputTable.value}_column_${inputIndex.value}"]`);
        colsBodyMiddle.forEach(col => {
            col.width = newWidth;
        });

        const colsBodyRight = document.querySelectorAll(`.el-table__body-wrapper.is-scrolling-right colgroup col[name="el-table_${inputTable.value}_column_${inputIndex.value}"]`);
        colsBodyRight.forEach(col => {
            col.width = newWidth;
        });

        const colsHeader = document.querySelectorAll(`.el-table__header-wrapper .el-table__header colgroup col[name="el-table_${inputTable.value}_column_${inputIndex.value}"]`);
        colsHeader.forEach(col => {
            col.width = newWidth;
        });
    }


    function buttonResets() {
        inputHeight.value = defaultValueHeight;
        inputWidth.value = defaultValueWidth;
        inputIndex.value = defaultValueIndex;
        inputTable.value = defaultValueTable;
    }

     function buttonSwitchs() {
        if(flag === true){
            inputIndex.value = 6;
            inputTable.value = 1;
        }
         if(flag === false){
            inputIndex.value = defaultValueIndex;
            inputTable.value = defaultValueTable;
        }
        flag = !flag;
    }
    // document.querySelectorAll('div').forEach((div) => {
    //     div.addEventListener('click', function(event) {
    //         // 输出被点击div的class
    //         console.log(event.target.className);
    //     });
    // });
    let isDragging = false;
    let offsetX, offsetY;
    let bodyHeight;
    let bodyWidth;
    let lastCalculatedX = 0;
    let lastCalculatedY = 0;
    floatingWindow.addEventListener('mousedown', (e) => {
        isDragging = true;
        bodyHeight = document.body.offsetHeight-175;
        bodyWidth = document.body.offsetWidth-200;
        offsetX = e.clientX - floatingWindow.offsetLeft;
        offsetY = e.clientY - floatingWindow.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;
        if(newX > bodyWidth){
            newX = bodyWidth;
        }else if(newX < 0){
            newX = 0;
        }
        if(newY > bodyHeight){
            newY = bodyHeight;
        }else if(newY < 0){
            newY = 0;
        }
        if(Math.abs(newX - lastCalculatedX) > 2 || Math.abs(newY - lastCalculatedY) > 2){ // if move more than 2px, update position
            floatingWindow.style.left = `${newX}px`;
            floatingWindow.style.top = `${newY}px`;
            lastCalculatedX = newX;
            lastCalculatedY = newY;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    containerHeight.appendChild(applyHeightButton);
    floatingWindow.appendChild(containerHeight);
    floatingWindow.appendChild(containerWidth);
    //floatingWindow.appendChild(inputWidth);
    floatingWindow.appendChild(buttonApply);
    floatingWindow.appendChild(buttonSwitch);
    floatingWindow.appendChild(buttonReset);
    document.body.appendChild(floatingWindow);

     // 当鼠标放在窗体空白处时，改变光标样式为可拖动的移动图标
    floatingWindow.addEventListener('mouseover', (event) => {
        if (event.target === floatingWindow) {
            floatingWindow.style.cursor = 'move';
        }
    });

})();
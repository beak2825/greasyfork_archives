// ==UserScript==
// @name         自动点击及获取坐标
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在任何网页中使用自动点击功能及获取网页坐标
// @author       CaloxNg
// @license      GPL-v3.0
// @match        *://*/*
// @icon         https://img.alicdn.com/imgextra/i4/O1CN01FOwagl1XBpyVA2QVy_!!6000000002886-2-tps-512-512.png
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500909/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%8F%8A%E8%8E%B7%E5%8F%96%E5%9D%90%E6%A0%87.user.js
// @updateURL https://update.greasyfork.org/scripts/500909/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%8F%8A%E8%8E%B7%E5%8F%96%E5%9D%90%E6%A0%87.meta.js
// ==/UserScript==
//使用说明
// 1.点击获取元素
// 2.输入执行次数,0为无限执行
// 3.根据需要勾选功能
// 4.点击开始

; (function () {
  window.onload = function () {
    // 创建插件界面容器---------------------------------
    let pluginContainer = document.createElement('div');
    pluginContainer.style.position = 'fixed';
    pluginContainer.style.bottom = '20px';
    pluginContainer.style.right = '20px';
    pluginContainer.style.backgroundColor = 'white';
    pluginContainer.style.padding = '10px';
    pluginContainer.style.border = '1px solid #ccc';
    pluginContainer.style.zIndex = '9999';
    pluginContainer.style.display = 'flex';
    pluginContainer.style.flexDirection = 'column';
    pluginContainer.style.gap = '10px';
    pluginContainer.style.cursor = 'move';
    document.body.appendChild(pluginContainer);

    // 元素信息
    let elementInput = document.createElement('input');
    elementInput.setAttribute('type', 'text');
    elementInput.setAttribute('placeholder', '请输入元素信息');
    pluginContainer.appendChild(elementInput);

    // 获取元素
    let elementBtn = document.createElement('button');
    elementBtn.innerHTML = '获取元素';
    pluginContainer.appendChild(elementBtn);

    // 执行次数标签
    let repeatLabel = document.createElement('label');
    repeatLabel.innerHTML = '执行次数(0=无限): ';
    pluginContainer.appendChild(repeatLabel);

    // 执行次数输入框
    let repeatInput = document.createElement('input');
    repeatInput.setAttribute('type', 'number');
    repeatInput.setAttribute('placeholder', '执行次数(0=无限)');
    repeatInput.value = '0';
    pluginContainer.appendChild(repeatInput);

    // 监听输入框的输入事件
    repeatInput.addEventListener('input', function (event) {
      let value = this.value;
      // 使用正则表达式检查并替换所有非数字字符
      this.value = value.replace(/[^0-9]/g, '');
    });

    // 是否需要滚动到底部的复选框及其标签
    let scrollToBottomCheckbox = document.createElement('input');
    scrollToBottomCheckbox.setAttribute('type', 'checkbox');
    scrollToBottomCheckbox.style.marginRight = '5px';

    let scrollToBottomLabel = document.createElement('label');
    scrollToBottomLabel.innerHTML = '完成后滚动到底部';
    scrollToBottomLabel.style.cursor = 'pointer';

    // 是否找到后点击的复选框及其标签
    let clickAfterFindCheckbox = document.createElement('input');
    clickAfterFindCheckbox.setAttribute('type', 'checkbox');
    clickAfterFindCheckbox.style.marginRight = '5px';

    let clickAfterFindLabel = document.createElement('label');
    clickAfterFindLabel.innerHTML = '找到后点击';
    clickAfterFindLabel.style.cursor = 'pointer';

    // 是否找到后弹窗的复选框及其标签
    let alertAfterFindCheckbox = document.createElement('input');
    alertAfterFindCheckbox.setAttribute('type', 'checkbox');
    alertAfterFindCheckbox.style.marginRight = '5px';

    let alertAfterFindLabel = document.createElement('label');
    alertAfterFindLabel.innerHTML = '找到后弹窗';
    alertAfterFindLabel.style.cursor = 'pointer';

    // 分别创建三个行容器
    let scrollOptionRow = document.createElement('div');
    scrollOptionRow.style.display = 'flex';
    scrollOptionRow.style.alignItems = 'center';
    scrollOptionRow.appendChild(scrollToBottomCheckbox);
    scrollOptionRow.appendChild(scrollToBottomLabel);
    pluginContainer.appendChild(scrollOptionRow);

    let clickOptionRow = document.createElement('div');
    clickOptionRow.style.display = 'flex';
    clickOptionRow.style.alignItems = 'center';
    clickOptionRow.appendChild(clickAfterFindCheckbox);
    clickOptionRow.appendChild(clickAfterFindLabel);
    pluginContainer.appendChild(clickOptionRow);

    let alertOptionRow = document.createElement('div');
    alertOptionRow.style.display = 'flex';
    alertOptionRow.style.alignItems = 'center';
    alertOptionRow.appendChild(alertAfterFindCheckbox);
    alertOptionRow.appendChild(alertAfterFindLabel);
    pluginContainer.appendChild(alertOptionRow);

    // 开始
    let findelementBtn = document.createElement('button');
    findelementBtn.innerHTML = '开始';
    pluginContainer.appendChild(findelementBtn);

    // 新增获取坐标按钮及输入框---------------------------------
    let getCoordsButton = document.createElement('button');
    getCoordsButton.innerHTML = '获取坐标';
    pluginContainer.appendChild(getCoordsButton);

    let xCoordInput = document.createElement('input');
    xCoordInput.setAttribute('type', 'text');
    xCoordInput.setAttribute('placeholder', 'X 坐标');
    pluginContainer.appendChild(xCoordInput);

    let yCoordInput = document.createElement('input');
    yCoordInput.setAttribute('type', 'text');
    yCoordInput.setAttribute('placeholder', 'Y 坐标');
    pluginContainer.appendChild(yCoordInput);

    let coordsRow = document.createElement('div');
    coordsRow.style.display = 'flex';
    coordsRow.style.alignItems = 'center';
    coordsRow.style.gap = '10px';
    coordsRow.appendChild(xCoordInput);
    coordsRow.appendChild(yCoordInput);
    pluginContainer.appendChild(coordsRow);
    // 新增获取坐标按钮及输入框---------------------------------
    // 根据坐标点击
    // let contBtn = document.createElement('button');
    // contBtn.innerHTML = '根据坐标点击';
    // pluginContainer.appendChild(contBtn);
    // 添加拖动功能
    let isDragging = false;
    let dragStartX, dragStartY;

    pluginContainer.addEventListener('mousedown', function (e) {
      isDragging = true;

      // 计算相对于视口的 right 和 bottom 的初始位置
      const rect = this.getBoundingClientRect();
      dragStartX = window.innerWidth - rect.right;
      dragStartY = window.innerHeight - rect.bottom;

      document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', function (e) {
      if (isDragging) {
        // 更新 right 和 bottom 的值
        pluginContainer.style.right = `${window.innerWidth - e.clientX - dragStartX}px`;
        pluginContainer.style.bottom = `${window.innerHeight - e.clientY - dragStartY}px`;
      }
    });

    document.addEventListener('mouseup', function () {
      isDragging = false;
      document.body.style.userSelect = 'auto';
    });
    // 创建插件界面容器---------------------------------
    // 获取元素---------------------------------
    let globalClickHandlerAttached = false;
    let preventDefaultFlag = false;

    let globalClickHandler = function (event) {
      if (preventDefaultFlag && event.target !== elementBtn) {
        event.preventDefault();
        elementInput.disabled = false;
        var clickedElement = event.target;
        var selector = generateSelector(clickedElement);
        elementInput.value = selector;

        preventDefaultFlag = false;
        globalClickHandlerAttached = false;
        document.body.removeEventListener('click', globalClickHandler);
        elementBtn.innerHTML = '获取元素'; // 重置按钮文本
      }
    };

    elementBtn.addEventListener('click', function () {
      if (!globalClickHandlerAttached) {
        elementBtn.innerHTML = '左键点击确认'; // 更改按钮文本
        globalClickHandlerAttached = true;
        preventDefaultFlag = true;
        document.body.addEventListener('click', globalClickHandler);
        elementInput.disabled = true;
      }
    });

    function generateSelector(element) {
      var selector = '';
      if (element.id) {
        selector = '#' + element.id;
      } else if (element.className) {
        var classes = element.className.split(/\s+/);
        selector = '.' + classes.join('.');
      }
      if (!selector && element.tagName) {
        selector = element.tagName.toLowerCase();
      }
      return selector;
    }

    // 清理工作：当不再需要监听时，记得移除监听器
    function cleanup() {
      if (globalClickHandlerAttached) {
        document.body.removeEventListener('click', globalClickHandler);
        globalClickHandlerAttached = false;
        preventDefaultFlag = false;
      }
    }
    // 获取元素---------------------------------

    // 获取坐标---------------------------------
    let isRecordingCoordinates = false;

    // 添加鼠标移动监听器来实时更新坐标
    document.addEventListener('mousemove', function (e) {
      if (isRecordingCoordinates) {
        e.preventDefault(); // 阻止默认行为
        xCoordInput.value = e.clientX;
        yCoordInput.value = e.clientY;
        xCoordInput.disabled = true;
        yCoordInput.disabled = true;
      }
    }, { passive: false });

    // 添加鼠标左键点击监听器来保存坐标
    document.addEventListener('mousedown', function (e) {
      if (isRecordingCoordinates && e.button === 0) { // 检查是否是左键
        e.preventDefault(); // 阻止默认行为
        isRecordingCoordinates = false;
        getCoordsButton.innerHTML = '获取坐标';
        xCoordInput.disabled = false;
        yCoordInput.disabled = false;
      }
    }, { passive: false });

    // 获取坐标按钮监听器
    getCoordsButton.addEventListener('click', function () {
      if (!isRecordingCoordinates) {
        isRecordingCoordinates = true;
        getCoordsButton.innerHTML = '左键点击确认';
      } else {
        isRecordingCoordinates = false;
        getCoordsButton.innerHTML = '获取坐标';
      }
    });
    // 获取坐标---------------------------------

    // 定义变量
    let isRunning = false // 运行状态
    let timer = null // 定时器
    let elementinfo = null //元素
    let repeatTimes = 0 //次数
    // 开始---------------------------------
    findelementBtn.addEventListener('click', function () {
      elementinfo = elementInput.value;
      repeatTimes = parseInt(repeatInput.value);
      if (
        elementinfo.trim() !== ''
      ) {
        //1.1判断运行状态
        if (isRunning) {
          // 如果正在执行,停止执行
          clearInterval(timer)
          //按钮名称改为开始执行
          findelementBtn.innerHTML = '开始'
          //运行状态改为停止
          isRunning = false
          elementInput.disabled = false;
          elementBtn.disabled = false;
          repeatInput.disabled = false;
          scrollToBottomCheckbox.disabled = false;
          clickAfterFindCheckbox.disabled = false;
          alertAfterFindCheckbox.disabled = false;
          getCoordsButton.disabled = false;
          xCoordInput.disabled = false;
          yCoordInput.disabled = false;

        } else {
          // 如果没有执行,开始执行
          //按钮名称改为开始执行
          elementInput.disabled = true;
          elementBtn.disabled = true;
          repeatInput.disabled = true;
          scrollToBottomCheckbox.disabled = true;
          clickAfterFindCheckbox.disabled = true;
          alertAfterFindCheckbox.disabled = true;
          getCoordsButton.disabled = true;
          xCoordInput.disabled = true;
          yCoordInput.disabled = true;
          findelementBtn.innerHTML = '停止'
          //运行状态改为开始
          isRunning = true
          if (repeatTimes === 0) {
            // 如果执行次数为0，则使用setInterval无限执行
            timer = setInterval(findElementAndAlert, 1000);
          } else {
            // 如果执行次数大于0，则使用setTimeout递归执行指定次数
            findElementAndAlert(repeatTimes);
          }
        }
      } else {
        alert('查找元素不能为空')
      }
    })
    // 开始---------------------------------


    //------------------方法封装----------------
    function findElementAndAlert(timesRemaining) {
      let elementFound = document.querySelector(elementInput.value);
      //----------------无限执行逻辑在这里写---------------------

      if (elementFound != null) {
        if (clickAfterFindCheckbox.checked) {
          elementFound.click();
        }
        if (alertAfterFindCheckbox.checked) {
          alert('元素已找到');
        }
        if (scrollToBottomCheckbox.checked) {
          window.scrollTo(0, document.body.scrollHeight);
        }
      }
      //----------------无限执行逻辑在这里写---------------------
      if (timesRemaining > 1) {
        // 如果还有剩余次数，则递归调用自己
        timer = setTimeout(() => findElementAndAlert(timesRemaining - 1), 1000);
      } else if (timesRemaining === 1) {
        // 如果剩余次数为1，直接检查元素并做清理工作
        //----------------次数限制执行逻辑在这里写---------------------
        let elementFound = document.querySelector(elementInput.value);

        if (elementFound != null) {
          if (clickAfterFindCheckbox.checked) {
            elementFound.click();
          }
          if (alertAfterFindCheckbox.checked) {
            alert('元素已找到');
          }
          if (scrollToBottomCheckbox.checked) {
            window.scrollTo(0, document.body.scrollHeight);
          }
        }
        //----------------次数限制执行逻辑在这里写---------------------
        // 清理工作
        clearInterval(timer);
        findelementBtn.innerHTML = '开始';
        isRunning = false;
        elementInput.removeAttribute('readonly');
        repeatInput.removeAttribute('readonly');
      }
    }
    //------------------方法封装----------------

    //------------------根据坐标点击----------------

    //------------------根据坐标点击----------------




  }
})();


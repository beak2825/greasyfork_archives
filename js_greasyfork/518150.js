// ==UserScript==
// @name         定时刷新
// @namespace    https://czm.cool
// @version      1.1
// @description  如题
// @author       czm
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518150/%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/518150/%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==
// 修改自https://greasyfork.org/zh-CN/scripts/39506-%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E9%A1%B5%E9%9D%A2
(function() {
    'use strict';

    var time = parseInt(sessionStorage.refreshTime), originTitle = document.title, lastSetTime = parseInt(sessionStorage.lastSetTime);

    // 循环时间
    function loop() {
        if (isNaN(time) || !(sessionStorage.enable == 'true')) return;
        document.title = "[" + formatTime(time) + "] " + originTitle;
        if (time <= 0) {
            location.reload();
            return;
        }
        time--;
        setTimeout(loop, 1000);
    }

    // 格式化时间
    function formatTime(t) {
        if (isNaN(t)) return "";
        var s = "";
        var h = parseInt(t / 3600);
        s += (pad(h) + ":");
        t -= (3600 * h);
        var m = parseInt(t / 60);
        s += (pad(m) + ":");
        t -= (60 * m);
        s += pad(t);
        return s;
    }

    // 补零
    function pad(n) {
        return ("00" + n).slice(-2);
    }

    // 创建按钮
    var button = document.createElement('button');
    button.textContent = '⏱️';
    button.style.position = 'fixed';
    button.style.bottom = '10px';
    button.style.right = '10px';
    button.style.zIndex = '9999';
    button.style.width = '50px';
    button.style.height = '50px';
    button.style.borderRadius = '50%';
    button.style.backgroundColor = '#007bff';
    button.style.border = 'none';
    button.style.outline = 'none';
    button.style.color = 'white';
    button.style.fontSize = '24px';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';

    // 创建配置面板
    var panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.bottom = '70px';
    panel.style.right = '10px';
    panel.style.display = 'none';
    panel.style.zIndex = '9999';
    panel.style.padding = '15px';
    panel.style.backgroundColor = '#fff';
    panel.style.borderRadius = '8px';
    panel.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    panel.style.transition = 'all 0.3s ease';

    // 输入框
    var refreshInput = document.createElement('input');
    refreshInput.type = 'number';
    refreshInput.value = isNaN(lastSetTime) ? 60 : lastSetTime;
    refreshInput.style.width = '50px';
    refreshInput.style.marginRight = '10px';
    refreshInput.style.padding = '5px';
    refreshInput.style.borderRadius = '4px';
    refreshInput.style.border = '1px solid #ddd';

    // 单位选择
    var unitSelectInput = document.createElement('select');
    var options = [{text: '秒', value: 1}, {text: '分', value: 60}, {text: '时', value: 360}];
    options.forEach(item => {
        var option = document.createElement('option');
        option.value = item.value;
        option.textContent = item.text;
        if (sessionStorage.factor == item.value) {
            option.selected = true;
        } else if (item.value === 1) {
            option.selected = true;
        }
        unitSelectInput.appendChild(option);
    })

    // 设置按钮
    var setButton = document.createElement('button');
    setButton.textContent = '设置';
    setButton.style.padding = '5px 10px';
    setButton.style.borderRadius = '4px';
    setButton.style.border = 'none';
    setButton.style.backgroundColor = '#28a745';
    setButton.style.color = 'white';
    setButton.style.cursor = 'pointer';
    setButton.style.outline = 'none';
    setButton.style.boxShadow = 'inset 0 -2px 0 rgba(0, 0, 0, 0.2)';

    // 开始刷新按钮
    var startButton = document.createElement('button');
    startButton.textContent = '开始';
    startButton.style.padding = '5px 10px';
    startButton.style.borderRadius = '4px';
    startButton.style.border = 'none';
    startButton.style.backgroundColor = '#17a2b8';
    startButton.style.color = 'white';
    startButton.style.cursor = 'pointer';
    startButton.style.outline = 'none';
    startButton.style.boxShadow = 'inset 0 -2px 0 rgba(0, 0, 0, 0.2)';
    startButton.style.marginRight = '10px';

    // 关闭刷新按钮
    var stopButton = document.createElement('button');
    stopButton.textContent = '结束';
    stopButton.style.padding = '5px 10px';
    stopButton.style.borderRadius = '4px';
    stopButton.style.border = 'none';
    stopButton.style.backgroundColor = '#dc3545';
    stopButton.style.color = 'white';
    stopButton.style.cursor = 'pointer';
    stopButton.style.outline = 'none';
    stopButton.style.boxShadow = 'inset 0 -2px 0 rgba(0, 0, 0, 0.2)';

    // 第一行
    var row1 = document.createElement('div');
    row1.appendChild(refreshInput);
    row1.appendChild(unitSelectInput)
    row1.appendChild(setButton);

    // 第二行
    var row2 = document.createElement('div');
    row2.style.marginTop = '10px';
    row2.appendChild(startButton);
    row2.appendChild(stopButton);

    // 将行添加到面板
    panel.appendChild(row1);
    panel.appendChild(row2);

    // 将按钮和面板添加到页面
    document.body.appendChild(button);
    document.body.appendChild(panel);

    // 按钮点击事件
    button.onclick = function() {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    };

    // 设置刷新时间
    setButton.onclick = function() {
        setTimeValue();
    }

    // 开始刷新
    startButton.onclick = function() {
        setTimeValue(true);
        loop()
    };

    function setTimeValue(enable) {
        var factor = unitSelectInput.value
        sessionStorage.factor = factor
        sessionStorage.refreshTime = refreshInput.value * factor;
        sessionStorage.lastSetTime = refreshInput.value;
        sessionStorage.enable = enable == undefined || enable == null ? sessionStorage.enable : enable
        time = refreshInput.value * factor;
    }

    // 结束刷新
    stopButton.onclick = function() {
        sessionStorage.refreshTime = undefined;
        sessionStorage.enable = false;
        time = undefined;
        document.title = originTitle;
    }

    // 刷新后开始新一轮计时
    loop()

})();
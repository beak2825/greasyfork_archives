// ==UserScript==
// @name         UCAS CourseCode Anchor
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  根据课程代码快递搜索（等同于Ctrl+F功能）
// @author       3hex
// @match        https://jwxkts2.ucas.ac.cn/*
// @icon         https://www.cas.cn/zj/yk/201410/W020141017344514407759.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474658/UCAS%20CourseCode%20Anchor.user.js
// @updateURL https://update.greasyfork.org/scripts/474658/UCAS%20CourseCode%20Anchor.meta.js
// ==/UserScript==

(function() {
    //   __  __________   ____    _____________
    //  / / / / ___/ _ | / __/___/ ___/ ___/ _ |
    // / /_/ / /__/ __ |_\ \/___/ /__/ /__/ __ |
    // \____/\___/_/ |_/___/    \___/\___/_/ |_|

     // 创建悬浮框元素
    var floatingBox = document.createElement('div');
    var elemBox = document.createElement('div');
    floatingBox.style.position = 'fixed';
    floatingBox.style.top = '10px';
    floatingBox.style.left = '63%';
    floatingBox.style.padding = '5px';
    floatingBox.style.background = 'rgba(255, 255, 255, 0.7)'; // Set background color with transparency
    floatingBox.style.border = '1px solid black';
    floatingBox.style.zIndex = '9999';
    floatingBox.style.cursor = 'move'; // Set cursor to indicate draggable
    floatingBox.style.userSelect = 'none'; // Disable text selection
    floatingBox.style.transition = 'height 0.2s ease-in-out';

    var toolBar = document.createElement('div');
    toolBar.style.display = 'flex'; // Add flex display to make items appear in a row
    toolBar.style.alignItems = 'center'; // Center items vertically

    // 指定课程自动刷新功能\

    var setDelayVal = localStorage.getItem('auto_delay');
    if(setDelayVal==null) setDelayVal = 5;

    var delayValue = document.createElement('input');
    delayValue.type = 'text';
    delayValue.title = "单位s,脚本自动添加1-5s的随机延时";
    delayValue.value = setDelayVal;
    delayValue.style.width = '20px'; // Adjust input box size
    delayValue.style.fontSize = '5px'; // Adjust input text size
    delayValue.style.marginRight = '5px';
    toolBar.appendChild(delayValue);

    var delayVal = (parseInt(delayValue.value) + Math.floor(Math.random() * (5 - 1 + 1)) + 1) * 1000;

    var autoRefresh = document.createElement('button');
    autoRefresh.textContent = 'AutoRefresh';
    autoRefresh.style.width = "100px";
    autoRefresh.style.marginBottom = '10px';
    autoRefresh.style.marginRight = "5px";

    toolBar.appendChild(autoRefresh);
    floatingBox.appendChild(toolBar);
    var flag = 0; //0: disable 1:enable

    flag = parseInt(localStorage.getItem('auto_refresh'), 0);
    if(flag==1)
    {
        autoRefresh.style.background = 'green';

        var tmp = checkCourse();
        console.log(delayVal);
        if(tmp==1)
        {
           setTimeout(function () {
            refreshCourse();
           }, delayVal); // 延迟时间为3000毫秒，即3秒
        }
    }
    else
    {
        autoRefresh.style.background = 'yellow';
    }

    autoRefresh.addEventListener("click", function() {
        autoRefresh.style.background = 'green';

        localStorage.setItem('auto_refresh',1); // 启动自动刷新
        localStorage.setItem('auto_delay',parseInt(delayValue.value, 0));
        var tmp = checkCourse();
        console.log(delayVal);
        if(tmp==1)
        {
           setTimeout(function () {
            refreshCourse();
           }, delayVal); // 延迟时间为3000毫秒，即3秒
        }
    });

    function refreshCourse() {
        var button = document.getElementById("submitBtn");
        if (button) {
            button.click();
        }
    }

    function checkCourse() {
        var input = document.querySelector('input[name="sids"]');
        if (input) {
            var attributes = input.attributes;
            for (var i = 0; i < attributes.length; i++) {
                console.log(attributes[i].name + ": " + attributes[i].value);
                if(attributes[i].name == "disabled")
                {
                    // 继续自动刷新
                    console.log("无法选课");
                    return 1;
                }
            }
            // 否则没有匹配到disable属性
            console.log("可以选课了！！！");
            localStorage.setItem('auto_refresh',0); // 停止自动刷新
            alert("课程可以选了");
            input.click();
            return 0;
        }
    }


    // 拖拽功能
    var dragButton = document.createElement('button');
    dragButton.textContent = 'Reside';
    dragButton.style.width = "150px";
    dragButton.style.marginBottom = '10px';
    dragButton.style.background = 'red';
    dragButton.style.marginRight = "5px";

    var pressTimer;
    dragButton.addEventListener('mousedown', function(event) {
        pressTimer = setTimeout(function() {
            dragButton.style.background = 'green';
            dragButton.textContent = 'Dragging';
            // Start dragging
            var boxX = event.clientX - floatingBox.getBoundingClientRect().left;
            var boxY = event.clientY - floatingBox.getBoundingClientRect().top;

            function handleMouseMove(event) {
                var x = event.clientX - boxX;
                var y = event.clientY - boxY;

                floatingBox.style.left = x + 'px';
                floatingBox.style.top = y + 'px';
            }

            function handleMouseUp() {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            }

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }, 50); // Adjust the long press duration as needed
    });

    // Clear the timer if the mouse is released before the long press duration
    dragButton.addEventListener('mouseup', function() {
        dragButton.style.background = 'red';
        dragButton.textContent = 'Reside';
        clearTimeout(pressTimer);
    });

    toolBar.appendChild(dragButton);
    floatingBox.appendChild(toolBar);

    // 折叠功能
    // Define the toggle button
    var toggleButton = document.createElement('button');
    toggleButton.textContent = 'Collapse';
    toggleButton.style.display = 'block';
    toggleButton.style.marginBottom = '10px';

    // Function to toggle the collapse/expand state
    function toggleCollapse() {
        if (floatingBox.style.height === '30px') {
            floatingBox.style.height = 'auto';
            toggleButton.textContent = 'Collapse';
            elemBox.style.display = 'block';
        } else {
            floatingBox.style.height = '30px';
            toggleButton.textContent = 'Expand';
            elemBox.style.display = 'none';
        }
    }

     // Attach event listener to the toggle button
    toggleButton.addEventListener('click', toggleCollapse);
    // Append the toggle button to the floating box
    toolBar.appendChild(toggleButton);
    toggleButton.click();

    // ************************在下面填写自己的课程名和课程代码，便于快速跳转************************
    //
    // 课程名和课程代码
    var items = [
        { label: '新中特', valueText: '180213030500MB001Z-02' },
        { label: '自然辩证', valueText: '180213010108MB001H-31' },
        { label: '学术道德-通', valueText: '180096120400PB001H-06' },
        { label: '学术道德-分', valueText: '180086081200PB001H-1' },
        { label: '硕士英语', valueText: '180089050200MB001H-032' },
        { label: '工程伦理-通', valueText: '180090125600PB001H-04' },
        { label: '工程伦理-机械', valueText: '180090125600PB001H-12' },
        { label: '工程伦理-核能', valueText: '180090125600PB001H-18' },
        { label: '工程伦理-资环', valueText: '180090125600PB001H-06' },
        { label: '操作系统高级教程', valueText: '180086083500P1002H' },
        { label: '计算机体系结构', valueText: '180086081200P1003H' },
        { label: '图像处理', valueText: '180086085404P2007H' },
        { label: '计算机网络', valueText: '180086085404P2005H' },
        { label: 'GPU架构与编程', valueText: '180086085404P3003H' },
        { label: '德语（初级）', valueText: '180089050200MX008H-02' },
        { label: '国际交流英语听说', valueText: '180089050200MX005H-02' },
    ];

    items.forEach(function(item) {
        var container = document.createElement('div');
        container.style.display = 'flex'; // Add flex display to make items appear in a row
        container.style.alignItems = 'center'; // Center items vertically
        container.style.flexDirection = 'row';

        var input = document.createElement('input');
        input.type = 'text';
        input.value = item.valueText;
        input.style.width = '150px'; // Adjust input box size
        input.style.fontSize = '5px'; // Adjust input text size
        container.appendChild(input);

        var label = document.createElement('div');
        label.textContent = item.label;
        label.style.marginLeft = '5px';
        label.style.width = '80px';
        label.style.fontSize = '5px'; // Adjust text size
        container.appendChild(label);

        var button = document.createElement('button');
        button.textContent = ">";
        button.style.width = '25px'; // Adjust button size
        button.style.marginBottom = "10px";
        button.style.marginLeft = "5px";
        container.appendChild(button);

        button.addEventListener('click', function() {
            performSearch(input.value);
        });
        elemBox.appendChild(container);
    });
    floatingBox.appendChild(elemBox);

    // 将悬浮框添加到页面中
    document.body.appendChild(floatingBox);

    // 执行搜索
    function performSearch(searchText) {
        var found = window.find(searchText, false, false, true);
        if (found) {
        } else {
        }
    }

    // 监听键盘按键事件
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.altKey && event.key === 'l') {
            if (confirm("Whether you want to stop automatic search? ")) {
                console.log("[info] stop");
                autoRefresh.style.background = 'yellow';
                localStorage.setItem('auto_refresh',0);
            } else {
               console.log("[info] continue :) ");
            }
        }
    });

})();
// ==UserScript==
// @name         dialog-MY
// @namespace    http://tampermonkey.net/
// @version      V0.1
// @description  get data from mengxi
// @author       wei
// @match        https://www.imptc.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/524004/dialog-MY.user.js
// @updateURL https://update.greasyfork.org/scripts/524004/dialog-MY.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getCookieObject() {
        var cookies = document.cookie.split(';');
        var cookieObj = {};
        for (var i = 0; i < cookies.length; i++) {
            var parts = cookies[i].trim().split('=');
            cookieObj[parts[0]] = parts[1];
        }
        return cookieObj;
    }

    // 随机生成 30 到 60 秒的延迟
    function randomDelay(minDelay = 30000, maxDelay = 60000) {
        return new Promise(resolve => {
            const delayTime = Math.floor(Math.random() * (maxDelay - minDelay  + 1)) + minDelay; // minDelay ~ maxDelay秒
            setTimeout(resolve, delayTime);
        });
    }

    // 输入 '2024-10-01, 2024-10-10', 输出时间序列列表
    function generateDateList(dateRangeStr) {
        let [startDateStr, endDateStr] = dateRangeStr.split(',').map(date => date.trim());
        let startDate = new Date(startDateStr);
        let endDate = new Date(endDateStr);
        let dateList = [];
    
        while (startDate <= endDate) {
            dateList.push(startDate.toISOString().split('T')[0]); // 转为字符串格式
            startDate.setDate(startDate.getDate() + 1); // 日期加1
        }
        return dateList;
    }

    // 输入 '2024-10', 输出 ['2024-10-01', '2024-10-02', '2024-10-03', '2024-10-04', ..., '2024-10-30', '2024-10-31']
    function getDaysInMonth(dateStr) {
        const year = parseInt(dateStr.split('-')[0]);
        const month = parseInt(dateStr.split('-')[1]);
        const daysInMonth = new Date(year, month, 0).getDate();
        const result = [];
        for (let day = 1; day <= daysInMonth; day++) {
            result.push(`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`);
        }
        return result;
    }

    // 导出 市场情况分析 - 信息对比 中的数据
    function doExportD1Data(startDate, endDate) {
        // console.log('在D1中', startDate, endDate);
        let internalStartDate = startDate;
        let internalEndDate = endDate;
        return new Promise((resolve, reject) => {
            var cookieObject = getCookieObject();
            let authorization = cookieObject["Token"];
            // console.log(internalStartDate, '=============');
            // console.log(internalEndDate, '=============');
    
            // 分别是   电价曲线、负荷预测、东送计划、非市场化曲线、新能源预测
            let urls_nosuffix = [
                'https://www.imptc.com/api/scqkfx/sctjfxyyc/crqwxxfb/getYhcjqjgData/',
                'https://www.imptc.com/api/scqkfx/sctjfxyyc/crqwxxfb/getQwtdfhycscData/',
                'https://www.imptc.com/api/scqkfx/sctjfxyyc/crqwxxfb/getCrdsjhycscData/',
                'https://www.imptc.com/api/scqkfx/sctjfxyyc/crqwxxfb/fsccl/',
                'https://www.imptc.com/api/scqkfx/sctjfxyyc/crqwxxfb/getXnyfdnlycData/'
            ];
    
            let dateList = generateDateList(internalStartDate+ ", " + internalEndDate);
            // console.log(dateList, '----------------');

            // 定义请求名称数组，与 urls 对应
            let requestNames = ['电价曲线', '负荷预测', '东送计划', '非市场化曲线', '新能源预测'];

            // 定义额外信息数组
            let additionalInfo = [
                ['时间', '全网统一出清电价', '呼包东统一出清电价', '呼包西统一出清电价', '日前预出清电能价格'],
                ['时间', '统调负荷预测', '统调负荷实测'],
                ['时间', '东送计划预测', '东送计划实测'],
                ['时间', '非市场出力计划', '非市场出力计划实测'],
                ['时间', '光伏出力预测', '光伏出力实测', '风电出力预测', '风电出力实测', '新能源出力预测', '新能源出力实测'],
            ];
    
            // 后续代码逻辑中，都使用internalStartDate和internalEndDate来代替原来的startDate和endDate
            // 例如在async function processD1Dates里相关判断等操作
            async function processD1Dates() {
                try {
                    for (let cur_date of dateList) {
                        // 用于收集每个日期对应的所有请求的Promise
                        let allRequests = [];
    
                        for (let i = 0; i < urls_nosuffix.length; i++) {
                            let url = urls_nosuffix[i] + cur_date + '/' + cur_date;
                            let index = i; // 保存当前索引值，避免闭包问题

                            console.log(url);
    
                            (async () => {
                                try {
                                    let response = await fetch(url, {
                                        method: 'POST',
                                        headers: {
                                            'accept': 'application/json, text/plain, */*',
                                            'authorization': authorization
                                        },
                                        credentials: 'include'
                                    });
                                    let data = await response.json();
                                    let data_dict = {
                                        "data_class": "d1_data",
                                        "class_name": requestNames[index],
                                        "date": cur_date,
                                        "columns": additionalInfo[index],
                                        "data": data["data"]
                                    };
                                    await GM_xmlhttpRequest({
                                        method: "POST",
                                        url: "https://tradex.mywind.com.cn/tradex",
                                        // url: "http://192.168.0.90:7001/tradex",
                                        headers: {
                                            "Content-Type": "application/json;charset=UTF-8"
                                        },
                                        data: JSON.stringify(data_dict),
                                        onload: function (response) {
                                            console.log("请求成功");
                                            console.log(response.responseText);
                                        },
                                        onerror: function (response) {
                                            console.log("请求失败。。。");
                                            console.log(response.responseText);
                                        }
                                    });
                                } catch (error) {
                                    console.error(`请求 ${url}  发生错误:`, error);
                                }
                            })().then(request => allRequests.push(request));
                        }
    
                        await Promise.all(allRequests);
                        console.log(`D1 已完成日期: ${cur_date}`);
    
                        console.log(`D1 等待完成，继续执行下一个日期`);
                        await randomDelay();
                    }
    
                    console.log("D1 所有日期的请求已完成");
                    resolve(); // 当所有日期的请求都完成后，调用resolve表示成功完成
                } catch (error) {
                    console.error("处理请求时发生错误:", error);
                    reject(error); // 如果出现错误，调用reject传递错误信息
                }
            }
    
            processD1Dates();
        });
    }

    // 导出 交易管理 - 现货交易 - 省内电能量交易 - 次日全网信息 中的数据
    function doExportD3Data(startDate, endDate) {
        let internalStartDate = startDate;
        let internalEndDate = endDate;
        return new Promise((resolve, reject) => {
            var cookieObject = getCookieObject();
            let authorization = cookieObject["Token"];
            console.log(authorization);
    
            let dateList = generateDateList(internalStartDate+", "+internalEndDate);
    
            // 分别是   统调负荷、东送计划、非市场出力、新能源出力, 正负备用容量
            let urls_nosuffix = [
                'https://www.imptc.com/api/sctjfxyyc/crqwxxfb/getQwtdfhycData/',
                'https://www.imptc.com/api/sctjfxyyc/crqwxxfb/getCrdsjhData/',
                'https://www.imptc.com/api/sctjfxyyc/crqwxxfb/fsccl/',
                'https://www.imptc.com/api/sctjfxyyc/crqwxxfb/getXnyfdnlycData/',
                'https://www.imptc.com/api/sctjfxyyc/crqwxxfb/getCrqwbyrlData/'
            ];
    
            // 定义请求名称数组，与 urls 对应
            let requestNames = ['统调负荷', '东送计划', '非市场出力', '新能源出力', '正负备用容量'];
    
            async function processDates() {
                try {
                    for (let cur_date of dateList) {
                        let datePairs = [];
    
                        let dateObj = new Date(cur_date);
                        dateObj.setDate(dateObj.getDate() + 1);
                        let after_date = dateObj.toISOString().split('T')[0];
    
                        datePairs.push(cur_date);
                        datePairs.push(after_date);
    
                        // 用于收集所有日期对对应的所有请求的Promise
                        let allRequests = [];
    
                        for (let date of datePairs) {
                            let requests = urls_nosuffix.map((url, index) => {
                                let options = {
                                    method: 'POST',
                                    headers: {
                                        'accept': 'application/json, text/plain, */*',
                                        'authorization': authorization,
                                    },
                                    credentials: 'include',
                                };
    
                                if (url.includes('getXnyfdnlycData')) {
                                    options.body = JSON.stringify({ 'time': date, 'area': '', 'name': '0' });
                                    options.headers['Content-Type'] = 'application/json';
                                } else {
                                    url += date;
                                }
    
                                return async () => {
                                    try {
                                        let response = await fetch(url, options);
                                        let data = await response.json();
                                        let data_dict = {
                                            "data_class": "d3_data",
                                            "class_name": requestNames[index],
                                            "date": date,
                                            "data": data["data"]
                                        };
                                        return GM_xmlhttpRequest({
                                            method: "POST",
                                            url: "https://tradex.mywind.com.cn/tradex",
                                            // url: "http://192.168.0.90:7001/tradex",
                                            headers: {
                                                "Content-Type": "application/json;charset=UTF-8"
                                            },
                                            data: JSON.stringify(data_dict),
                                            onload: function (response) {
                                                console.log("请求成功");
                                                console.log(response.responseText);
                                            },
                                            onerror: function (response) {
                                                console.log("请求失败");
                                                console.log(response.responseText);
                                            }
                                        });
                                    } catch (error) {
                                        console.error(`请求 ${url}  ${requestNames[index]} 发生错误:`, error);
                                    }
                                };
                            });
    
                            allRequests.push(...requests);
                        }
    
                        // 等待所有日期对对应的所有请求完成
                        await Promise.all(allRequests.map(request => request()));
                        console.log(`已完成日期范围: ${datePairs.join(' - ')}`);
    
                        // 随机延迟后继续执行下一个日期的循环
                        console.log(`等待完成，继续执行下一个日期`);
                        await randomDelay();
                    }
    
                    console.log("所有日期的请求已完成");
                    resolve(); // 所有日期请求完成后，调用resolve表示成功完成
                } catch (error) {
                    console.error("处理请求时发生错误:", error);
                    reject(error); // 如果出现错误，调用reject传递错误信息
                }
            }
    
            processDates();
        });
    }

    // 导出 节点电价数据
    // 信息披露 - 市场运营机构 - 6.52现货市场申报、出清信息 - 实时节点电价
    function doExportNodeData(startDate, endDate) {
        let internalStartDate = startDate;
        let internalEndDate = endDate;
        return new Promise((resolve, reject) => {
            var cookieObject = getCookieObject();
            let authorization = cookieObject["Token"];
            console.log(authorization);
    
            let dateList = generateDateList(internalStartDate+", "+internalEndDate);
            console.log(dateList)
    
            // 'https://www.imptc.com/api/xxpl2024/scyyqywh/getDetials/6.52//2024-12-20/tab7'
            let url_nosuffix = 'https://www.imptc.com/api/xxpl2024/scyyqywh/getDetials/6.52//';
    
            // 定义请求名称
            let requestName = '节点电价';
    
            async function processDates() {
                try {
                    for (let cur_date of dateList) {
                        let fullUrl = url_nosuffix + cur_date + '/tab7';
    
                        let options = {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json, text/plain, */*',
                                'Authorization': authorization,
                                'Content-Type': 'application/json'
                            }
                        };
    
                        try {
                            let response = await fetch(fullUrl, options);
                            let data = await response.json();
                            let data_dict = {
                                "data_class": "node_price_data",
                                "class_name": requestName,
                                "date": cur_date,
                                "data": data
                            };
    
                            await new Promise((innerResolve, innerReject) => {
                                GM_xmlhttpRequest({
                                    method: "POST",
                                    url: "https://tradex.mywind.com.cn/tradex",
                                    // url: "http://192.168.0.90:7001/tradex",
                                    headers: {
                                        "Content-Type": "application/json;charset=UTF-8"
                                    },
                                    data: JSON.stringify(data_dict),
                                    onload: function (response) {
                                        console.log("请求成功");
                                        console.log(response.responseText);
                                        innerResolve();
                                    },
                                    onerror: function (response) {
                                        console.log("请求失败");
                                        console.log(response.responseText);
                                        innerReject(new Error('GM_xmlhttpRequest failed'));
                                    }
                                });
                            });
    
                            console.log(`节点电价 - 已完成日期: ${cur_date}`);
                        } catch (error) {
                            console.error(`请求 ${fullUrl}  ${requestName} 发生错误:`, error);
                        }
    
                        // 随机延迟后继续执行下一个日期的循环
                        console.log(`等待完成，继续执行下一个日期`);
                        await randomDelay();
                    }
    
                    console.log("所有日期的节点电价请求已完成");
                    resolve(); // 所有日期请求完成后，调用resolve表示成功完成
                } catch (error) {
                    console.error("处理节点电价请求时发生错误:", error);
                    reject(error); // 如果出现错误，调用reject传递错误信息
                }
            }
    
            processDates();
        });
    }

    const functionMap = {
        'D1信息对比数据': doExportD1Data,
        'D3数据': doExportD3Data,
        '节点数据': doExportNodeData
    };

    const layuiCssLink = document.createElement("link");

    layuiCssLink.rel = 'stylesheet';

    layuiCssLink.href = "//unpkg.com/layui@2.9.18/dist/css/layui.css"

    document.head.appendChild(layuiCssLink);

    const layuiScript = document.createElement("script");

    layuiScript.src = "//unpkg.com/layui@2.9.18/dist/layui.js"

    document.head.appendChild(layuiScript);

    console.log("这是测试111......");

    // 创建悬浮按钮
    const floatingButton = document.createElement('button');
    floatingButton.classList.add('floating-button');
    floatingButton.innerHTML = '&#9776;';
    document.body.appendChild(floatingButton);

    // 记录悬浮按钮初始的top值，用于后续计算
    let initialTop = floatingButton.offsetTop;

    // 鼠标按下事件处理函数
    floatingButton.addEventListener('mousedown', (e) => {
        e.preventDefault(); // 阻止默认的鼠标按下行为，比如选中文字等

        // 记录鼠标按下时相对于按钮的偏移量
        let offsetY = e.clientY - floatingButton.getBoundingClientRect().top;

        // 鼠标移动事件处理函数
        const onMouseMove = (e) => {
            e.preventDefault();

            // 根据鼠标移动更新按钮的top值，使其在右侧边缘上下滑动
            let newTop = e.clientY - offsetY;

            // 限制按钮只能在可视区域内滑动，防止滑出屏幕顶部或底部
            let maxTop = window.innerHeight - floatingButton.offsetHeight;
            let minTop = 0;
            newTop = Math.min(maxTop, Math.max(minTop, newTop));

            floatingButton.style.top = `${newTop}px`;
        };

        // 鼠标松开事件处理函数
        const onMouseUp = () => {
            // 移除鼠标移动和松开事件的监听，避免不必要的性能消耗
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        // 添加鼠标移动和松开事件的监听
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    // 添加 CSS 样式
    const style = document.createElement('style');
    style.textContent = `
        /* 悬浮按钮样式 */
    .floating-button {
        position: absolute; /* 从fixed改为absolute，以便后续能相对父元素定位 */
        right: 0; /* 初始贴紧右侧边缘 */
        top: 50%; /* 初始垂直居中，后续会根据鼠标移动调整 */
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #0078d4;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
        transform: translateY(-50%); /* 初始垂直居中的偏移调整 */
        user-select: none; /* 防止按钮文本被选中，提升用户体验 */
    }
    `;
    document.head.appendChild(style);

    // 定义一个变量来跟踪窗口状态，true表示展开，false表示缩回
    let isWindowOpen = false;

    // 获取当前时间
    const currentTime = new Date().toLocaleString();

    // 定义弹出窗口的宽和高
    const panelWidth = 900
    const panelHeight = 500

    // 获取网页宽高
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;

    floatingButton.addEventListener('click', () => {
        if (isWindowOpen) {
            // 如果窗口是展开的，关闭窗口
            layer.closeAll('page'); // 关闭所有类型为'page'（即layer.open中type: 1的页面层）的弹出层
            isWindowOpen = false;
        } else {
            const floatingButtonRect = floatingButton.getBoundingClientRect();
            // 计算弹出窗口的偏移量
            let offsetTop = windowWidth - panelWidth - 80
            let offsetRight = floatingButtonRect.y

            // 如果窗口是缩回的，打开窗口
            layui.use(['layer', 'table'], function () {
                var layer = layui.layer;
                var table = layui.table;
                let form = layui.form;
                let laydate = layui.laydate;
                layer.open({
                    type: 1,
                    area: [panelWidth + 'px', panelHeight + 'px'],
                    offset: [offsetRight, offsetTop],
                    resize: false,
                    shadeClose: true,
                    title: 'MXXH工具',
                    shade: 0,
                    content: `  <div class="talbeBox">
                                    <style>
                                        .row {
                                            height: 40px;
                                            display: flex;
                                            justify-content: flex-start;
                                            align-items: center;
                                            margin-bottom: 20px;
                                            padding-left: 20px;
                                        }

                                        .row .formItem {
                                            display: flex;
                                            justify-content: flex-start;
                                            align-items: center;
                                            margin-right: 10px;
                                        }

                                        .row .layui-input {
                                            width: 150px;
                                        }
                                    </style>
                                    </style>
                                    <div class="layui-form" lay-filter="headForm">
                                        <div class="row1 row">
                                            <div class="formItem">
                                                <label>接口名称：</label>
                                                <input class="layui-input" placeholder="输入框" name="APIName">
                                            </div>
                                            <div class="formItem">
                                                <label>接口频率：</label>
                                                <select name="APIRate">
                                                    <option value="">请选择</option>
                                                    <option value="AAA">选项 A</option>
                                                    <option value="BBB">选项 B</option>
                                                    <option value="CCC">选项 C</option>
                                                </select>
                                            </div>
                                            <div class="formItem">
                                                <label>运行状态：</label>
                                                <select name="status">
                                                    <option value="">请选择</option>
                                                    <option value="AAA">未执行</option>
                                                    <option value="BBB">正在执行</option>
                                                    <option value="CCC">已完成</option>
                                                    <option value="DDD">执行报错</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row2 row">
                                            <div class="formItem">
                                                <label>数据类型：</label>
                                                <select name="dataType">
                                                    <option value="AAA">选项 A</option>
                                                    <option value="BBB">选项 B</option>
                                                </select>
                                            </div>
                                            <div class="formItem" id="layui-time">
                                                <label>日期范围：</label>
                                                <input type="text" autocomplete="off" name="startName" id="layui-startTime" class="layui-input"
                                                    placeholder="开始日期">-

                                                <input type="text" autocomplete="off" name="endName" id="layui-endTime" class="layui-input"
                                                    placeholder="结束日期">
                                            </div>
                                            <div class="formItem">
                                                <p>0.323s</p>
                                            </div>
                                            <div class="formItem">
                                                <button type="button" class="layui-btn layui-bg-blue" id="dialog-run">批量运行</button>
                                            </div>

                                        </div>
                                    </div>
                                    <div class="tableBox">
                                        <div id="myTable"></div>
                                    </div>
                                </div>`,

                    success: function () {
                        // 可以在这里进行一些初始化操作，比如表格渲染（如果使用了动态数据加载等情况）

                        // 日期范围 - 左右面板联动选择模式
                        laydate.render({
                            elem: '#layui-time',
                            range: ['#layui-startTime', '#layui-endTime'],
                            rangeLinked: true // 开启日期范围选择时的区间联动标注模式 ---  2.8+ 新增
                        });
                        form.render()

                        function validateDateRange(startDateStr, endDateStr) {
                            if (startDateStr === '') {
                                alert('开始日期未选择，请选择开始日期！');
                                return false;
                            }
                            if (endDateStr === '') {
                                alert('结束日期未选择，请选择结束日期！');
                                return false;
                            }
                            const startDate = new Date(startDateStr);
                            const endDate = new Date(endDateStr);
                            if (startDate > endDate) {
                                alert('开始日期不能大于结束日期，请重新选择！');
                                return false;
                            }
                            return true;
                        }
                        
                        function updateTableRowStatus(tableData, rowIndex, status) {
                            tableData[rowIndex].field5 = status;
                            table.reload('myTable', {
                                data: tableData
                            });
                        }

                        //批量运行点击事件
                        document.getElementById('dialog-run').addEventListener('click', () => {
                            let headForm = form.val('headForm')
                            let tableCheckData = table.checkStatus('myTable')
                            console.log('headForm:', headForm)
                            console.log('tableCheckData:', tableCheckData)

                            // 用于存储所有异步任务（每个函数调用包装成一个Promise）
                            const promises = [];

                            // 获取开始日期和结束日期的值
                            const startDateStr = document.getElementById('layui-startTime').value;
                            const endDateStr = document.getElementById('layui-endTime').value;

                            if (!validateDateRange(startDateStr, endDateStr)) {
                                return;
                            }

                            console.log('开始日期: ', startDateStr, '结束日期: ', endDateStr)

                            // 遍历被选择的行，创建异步任务并添加到promises数组
                            tableCheckData.data.forEach((row, index) => {
                                let rowIndex = tableData.findIndex((item) => item.field1 === row.field1);
                                if (rowIndex!== -1) {
                                    updateTableRowStatus(tableData, rowIndex, '正在执行');
                                    const func = functionMap[row.field1];
                                    tableData[rowIndex].field5 = '正在执行';
                                    table.reload('myTable', {
                                        data: tableData
                                    });
                                    const promise = new Promise((resolve, reject) => {
                                        func(startDateStr, endDateStr).then(() => {
                                            // 函数执行成功后，将该行的field5更新为'已完成'
                                            updateTableRowStatus(tableData, rowIndex, '已完成');
                                            resolve();
                                        }).catch((error) => {
                                            // 如果函数执行出错，更新状态为'执行报错'，方便直观查看问题
                                            tableData[rowIndex].field5 = '执行报错';
                                            table.reload('myTable', {
                                                data: tableData
                                            });
                                            console.error(`执行函数 ${func.name} 出错:`, error);
                                            reject(error);
                                        });
                                    });
                                    promises.push(promise);
                                }
                            });

                            // 使用Promise.all同时触发所有异步任务
                            Promise.all(promises).then(() => {

                            }).catch((error) => {
                                // 如果有任何一个函数执行出错，整体捕捉错误并可以进行相应提示等处理
                                console.error('批量运行出现错误:', error);
                                layer.msg('批量运行出现错误，请检查！', { icon: 5, time: 2000 });
                            });

                        })
                        let tableData = [
                            {
                                field1: 'D1信息对比数据',
                                field2: '',
                                field3: '',
                                field4: '',
                                field5: '未运行',
                            },
                            {
                                field1: 'D3数据',
                                field2: '',
                                field3: '',
                                field4: '',
                                field5: '未运行',
                            },
                            {
                                field1: '私有数据',
                                field2: '',
                                field3: '',
                                field4: '',
                                field5: '未运行',
                            },
                            {
                                field1: '节点数据',
                                field2: '',
                                field3: '',
                                field4: '',
                                field5: '未运行',
                            }
                        ]

                        table.render({
                            elem: '#myTable',
                            cols: [[
                                { type: 'checkbox', width: 80, },
                                { field: 'field1', title: '接口名称' },
                                { field: 'field2', title: '频率' },
                                { field: 'field3', title: '周期' },
                                { field: 'field4', title: '运行时间' },
                                { field: 'field5', title: '运行状态' },
                            ]],
                            data: tableData,
                            // height: 'full-35', // 最大高度减去其他容器已占有的高度差
                        })

                        // 输出被选择的行数据
                        // console.log('被选择的行数据：', tableCheckData);

                        // // 遍历被选择的行，将运行状态改为'正在执行'
                        // tableCheckData.data.forEach((row) => {
                        //     let rowIndex = tableData.findIndex((item) => item.field1 === row.field1);
                        //     if (rowIndex!== -1) {
                        //         tableData[rowIndex].field5 = '正在执行';
                        //     }
                        // });
                    },
                    cancel: function () {
                        isWindowOpen = false;
                    },
                });
                isWindowOpen = true;
            });
        }
    });

})();




// ==UserScript==
// @name         云之家日报可视化
// @namespace    http://rb.tangstudio.cn:8123/
// @version      1.3
// @description  云之家智能审批日报可视化
// @author       Yuan Tang
// @match        https://www.yunzhijia.com/*
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519243/%E4%BA%91%E4%B9%8B%E5%AE%B6%E6%97%A5%E6%8A%A5%E5%8F%AF%E8%A7%86%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/519243/%E4%BA%91%E4%B9%8B%E5%AE%B6%E6%97%A5%E6%8A%A5%E5%8F%AF%E8%A7%86%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';



    var chartData_f = []
    var sum_f = 0
    var chartData_x = []
    var xdata = []
    var sum = 0

    // 创建按钮元素
    var button = document.createElement('button');
    button.textContent = '日报可视化'; // 设置按钮文本
    button.style.position = 'fixed'; // 固定位置
    button.style.top = '10px'; // 距离顶部10px
    button.style.right = '10px'; // 距离右侧10px
    button.style.zIndex = '9999'; // 确保按钮在最上层
    button.style.color = '#f59c25'; // 确保按钮在最上层
    button.style.background = 'rgba(245, 156, 37, .1)'; // 确保按钮在最上层
    button.style.border = '1px solid #f59c25'; // 确保按钮在最上层
    button.style.borderRadius = '4px'; // 确保按钮在最上层
    button.style.padding = '2px 10px'; // 确保按钮在最上层

    // 创建左箭头按钮
    var leftButton = document.createElement('button');
    leftButton.textContent = '←'; // 左箭头文本
    leftButton.style.color = '#f59c25'; // 确保按钮在最上层
    leftButton.style.background = 'rgba(245, 156, 37, .1)'; // 确保按钮在最上层
    leftButton.style.border = '1px solid #f59c25'; // 确保按钮在最上层
    leftButton.style.borderRadius = '4px'; // 确保按钮在最上层
    leftButton.style.padding = '2px 10px'; // 确保按钮在最上层

    // 创建右箭头按钮
    var rightButton = document.createElement('button');
    rightButton.textContent = '→'; // 右箭头文本
    rightButton.style.zIndex = '9999'; // 确保按钮在最上层
    rightButton.style.color = '#f59c25'; // 确保按钮在最上层
    rightButton.style.background = 'rgba(245, 156, 37, .1)'; // 确保按钮在最上层
    rightButton.style.border = '1px solid #f59c25'; // 确保按钮在最上层
    rightButton.style.borderRadius = '4px'; // 确保按钮在最上层
    rightButton.style.padding = '2px 10px'; // 确保按钮在最上层

    // 获取当前日期对象
    var currentDate = new Date();
    // 获取当前年份
    var currentYear = currentDate.getFullYear();
    // 获取当前月份
    var currentMonth = currentDate.getMonth() + 1;
    // 获取ticket
    var ticket = localStorage.getItem('ticket')

    // 创建模态框元素
    var modal = document.createElement('div');
    modal.style.display = 'none'; // 初始隐藏
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.backgroundColor = 'white';
    modal.style.padding = '20px';
    modal.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    modal.style.zIndex = '10000';
    modal.id = 'containerEchartsModal'

    // 添加模态框内容
    modal.innerHTML = `<h2 id='containerEchartsTitle' >日报可视化 <button class="page__item active" style="float: right;font-size: 16px;color: #f59c25;background: rgba(245, 156, 37, .1);border: 1px solid #f59c25;border-radius: 4px;padding: 2px 10px;" id="closeModal">关闭</button> </h2>
    <div style="width: 80vw;height: 60vh;" id="containerEcharts"></div>`;

    // 将模态框添加到页面中
    document.body.appendChild(modal);

    // 创建加载指示器元素
    var loadingIndicator = document.createElement('div');
    loadingIndicator.textContent = '加载中...'; // 设置加载文本
    loadingIndicator.style.position = 'fixed';
    loadingIndicator.style.top = '50%';
    loadingIndicator.style.left = '50%';
    loadingIndicator.style.transform = 'translate(-50%, -50%)';
    loadingIndicator.style.fontSize = '20px';
    loadingIndicator.style.color = '#f59c25';
    loadingIndicator.style.display = 'none'; // 初始隐藏
    loadingIndicator.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
    loadingIndicator.style.width = '100%';
    loadingIndicator.style.height = '100%';
    loadingIndicator.style.textAlign = 'center';
    loadingIndicator.style.lineHeight = '80vh';

    // 将加载指示器添加到containerEchartsModal中
    document.getElementById('containerEchartsModal').appendChild(loadingIndicator);

    // 动态加载 ECharts 库
    var script = document.createElement('script');
    var myChart = null
    script.type = 'text/javascript';
    script.src = 'https://registry.npmmirror.com/echarts/5.5.1/files/dist/echarts.min.js';
    script.onload = function () {
        // ECharts 加载完成后再初始化
        myChart = echarts.init(document.getElementById('containerEcharts')); // 创建一个 ECharts 实例
    };
    document.head.appendChild(script);


    // 将按钮添加到页面中

    document.body.appendChild(button);

    // 为左箭头按钮添加点击事件
    leftButton.onclick = async function () {
        currentMonth--; // 减少月份
        if (currentMonth < 1) {
            currentMonth = 12; // 如果小于1，则设置为12
            currentYear--; // 年份减1
        }
        await openBar()
    };

    // 为右箭头按钮添加点击事件
    rightButton.onclick = async function () {
        currentMonth++; // 增加月份
        if (currentMonth > 12) {
            currentMonth = 1; // 如果大于12，则设置为1
            currentYear++; // 年份加1
        }
        await openBar()

    };

    // 为按钮添加点击事件
    button.onclick = async function () {
        await openBar()
    };

    // 为关闭按钮添加事件
    modal.querySelector('#closeModal').onclick = function () {
        // 清除刚才添加的 htmls
        document.getElementById('containerSum').remove(); // 移除 id 为 containerSum 的元素
        modal.style.display = 'none'; // 隐藏模态框

    };


    async function openBar() {
        // modal.style.display = 'none'; // 隐藏模态框



        loadingIndicator.style.display = 'block'; // 显示加载指示器
        await fetchData(ticket, currentYear, currentMonth); // 调用 fetchData 方法
        // 加载柱状图
        loadBarChart(); // 调用加载柱状图的函数
        modal.style.display = 'block'; // 显示模态框
        loadingIndicator.style.display = 'none'; // 隐藏加载指示器
        let htmls = `<div id="containerSum">
                  <div style="text-align: center;margin-left: 50px;" > <div id="containerDate" style="margin: 10px;font-weight: bold;font-size: 20px;text-align: center;display: inline-block;">${currentYear} 年 ${currentMonth} 月 </div></div>
                    <div style="margin: 10px;font-weight: bold;font-size: 16px;text-align: center;">
                        项目日报总工时：${sum}h 总人天：${(sum / 8).toFixed(1)}天
                    </div>
                    <div style="margin: 10px;font-weight: bold;font-size: 16px;text-align: center;">
                        非项目日报总工时：${sum_f * -1}h 总人天：${(sum_f * -1 / 8).toFixed(1)}天
                    </div>
                    </div>`

        // 在containerEchartsTitle 后面插入
        // 如果存在containerEchartsTitle 则删除，否则的话就添加
        if (document.getElementById('containerSum')) {
            document.getElementById('containerSum').remove()
        }
        document.getElementById('containerEchartsTitle').insertAdjacentHTML('afterend', htmls)
        document.getElementById('containerDate').insertAdjacentElement('beforebegin', leftButton);
        document.getElementById('containerDate').insertAdjacentElement('afterend', rightButton);
    }

    // 模拟异步await行为的函数
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 封装GM_xmlhttpRequest以支持await
    async function fetch(url, options) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: options.method || 'GET',
                url: url,
                data: options.body || '',
                headers: options.headers || {},
                onload: response => {
                    resolve(response);
                },
                onerror: response => {
                    reject(response);
                }
            });
        });
    }

    async function fetchData(ticket, year, month) {
        const { startTimeStamp, endTimeStamp } = generateMonthTimestamps(year, month);
        let result = await saveFormWightQuery(ticket);

        if (result) {
            try {
                let [res1, res2] = await Promise.all([
                    fetch(`https://www.yunzhijia.com/workflow/api/v1/flowWeb/myFlowPageList?appId=10104&ticket=${ticket}`, {
                        method: 'POST',
                        body: JSON.stringify({
                            "flag": "all",
                            "pageNumber": 1,
                            "pageSize": 100,
                            "lastId": null,
                            "direction": "desc",
                            "order": "_S_DATE",
                            "appIds": [],
                            "source": [],
                            "formCodeIds": ["0d3b2a568bf848ebaf2f8704131e9fd0"],
                            "startId": null,
                            "startMilliseconds": null,
                            "offset": 0,
                            "searchItems": [],
                            "_S_DATE": [startTimeStamp, endTimeStamp],
                            "language": "zh-CN"
                        }),
                        headers: { 'Content-Type': 'application/json' }
                    }),
                    fetch(`https://www.yunzhijia.com/workflow/api/v1/flowWeb/myFlowPageList?appId=10104&ticket=${ticket}`, {
                        method: 'POST',
                        body: JSON.stringify({
                            "flag": "all",
                            "pageNumber": 1,
                            "pageSize": 20,
                            "lastId": null,
                            "direction": "desc",
                            "order": "_S_DATE",
                            "appIds": [],
                            "source": [],
                            "formCodeIds": ["f01efc527a464c0891e1c338bc290361"],
                            "startId": null,
                            "startMilliseconds": null,
                            "offset": 0,
                            "_S_DATE": [startTimeStamp, endTimeStamp],
                            "language": "zh-CN"
                        }),
                        headers: { 'Content-Type': 'application/json' }
                    })
                ]);

                // 处理第一个请求的结果
                let res1Data = JSON.parse(res1.responseText);
                if (res1Data.errorCode == 0 || res1Data.errorCode == 200) {
                    if (res1Data.data.content.length > 0) {
                        buildData(res1Data.data.content, year, month);
                    }
                }

                // 处理第二个请求的结果
                let res2Data = JSON.parse(res2.responseText);
                if (res2Data.errorCode == 0 || res2Data.errorCode == 200) {
                    if (res2Data.data.content.length > 0) {
                        buildData_fei(res2Data.data.content, year, month);
                    }
                }

            } catch (error) {
                console.error('请求失败:', error);
            }
        }
    }

    // 非项目
    function buildData_fei(testData, year, month) {
        let monthDates = generateMonthDates(year, month);
        let datas = {}

        let index5 = findIndex(testData[0].fieldContent, "status")
        let index6 = findIndex(testData[0].fieldContent, "Da_2")
        let index7 = findIndex(testData[0].fieldContent, "Nu_5")


        testData.forEach((item) => {

            let name = item.fieldContent[index5].value == 'FINISH' ? item.fieldContent[0].value.split('的')[1].split('日汇报')[0] : '未审核'
            if (item.fieldContent[index5].value !== 'TOSUBMIT') {
                if (!datas.hasOwnProperty(name)) {
                    datas[name] = craeteData(monthDates)
                }

                item.fieldContent[index6].value.forEach((items, indexs) => {
                    let dayIndex = findDayIndex(monthDates, items.slice(5, 10))
                    if (dayIndex !== null) {
                        datas[name][dayIndex].value += -1 * Number(item.fieldContent[index7].value[indexs])
                        datas[name][dayIndex].valueValid += -1 * Number(item.fieldContent[index7].value[indexs])
                    }
                })
            }

        })
        chartData_f = datas
        sum_f = isEmpty(datas) ? 0 : sumFun(datas)
    }
    function buildData(testData, year, month) {
        // 生成横坐标
        let monthDates = generateMonthDates(year, month);
        let datas = {} // 确认人天数


        let index1 = findIndex(testData[0].fieldContent, "status")
        let index2 = findIndex(testData[0].fieldContent, "Da_0")
        let index3 = findIndex(testData[0].fieldContent, "Nu_0")
        let index4 = findIndex(testData[0].fieldContent, "Nu_7")


        testData.forEach((item) => {
            // 判断是否审核
            let name = item.fieldContent[index1].value == 'FINISH' ? item.fieldContent[0].value.split('的')[1].split('日汇报')[0] : '未审核'
            if (item.fieldContent[index1].value !== 'TOSUBMIT') {
                if (!datas.hasOwnProperty(name)) {
                    // 如果没有name那么就创建一个
                    datas[name] = craeteData(monthDates)
                }
                // 循环日期分录
                item.fieldContent[index2].value.forEach((items, indexs) => {
                    // 裁切日期 MM-DD
                    let dayIndex = findDayIndex(monthDates, items.slice(5, 10))
                    if (dayIndex !== null) {
                        // 如果是未审核则取未确认的工时
                        datas[name][dayIndex].valueValid += (name == '未审核' ? Number(item.fieldContent[index4].value[indexs]) : Number(item.fieldContent[index4].value[indexs]))
                        datas[name][dayIndex].value += (name == '未审核' ? Number(item.fieldContent[index3].value[indexs]) : Number(item.fieldContent[index3].value[indexs]))

                        if (datas[name][dayIndex].valueValid !== datas[name][dayIndex].value) {
                            datas[name][dayIndex].itemStyle = {
                                decal: {
                                    symbol: 'diamond'
                                }
                            }
                        }
                    }
                })
            }

        })
        chartData_x = datas
        xdata = monthDates

        sum = isEmpty(datas) ? 0 : sumFun(datas)

    }


    function generateMonthTimestamps(year, month) {
        // 获取本月开始时间
        const startOfMonth = new Date(year, month - 1, 1);
        startOfMonth.setHours(0, 0, 0, 0);

        // 获取本月结束时间
        const endOfMonth = new Date(year, month, 0);
        endOfMonth.setHours(23, 59, 59, 999);

        // 将开始时间往前取2天
        const startTimeStamp = startOfMonth.getTime() - (2 * 24 * 60 * 60 * 1000);

        // 将结束时间往后取2天
        const endTimeStamp = endOfMonth.getTime() + (2 * 24 * 60 * 60 * 1000);

        return { startTimeStamp, endTimeStamp };
    }

    async function saveFormWightQuery(ticket) {
        let return1 = false
        let return2 = false
        let data1 = { "codeId": "0d3b2a568bf848ebaf2f8704131e9fd0", "type": "start", "widgetVos": [{ "codeId": "_S_TITLE", "selected": true }, { "codeId": "_S_SERIAL", "selected": true }, { "codeId": "_S_DATE", "selected": true }, { "codeId": "activityName", "selected": true }, { "codeId": "approvers", "selected": true }, { "codeId": "status", "selected": true }, { "codeId": "Nu_7", "selected": true }, { "codeId": "Nu_0", "selected": true }, { "codeId": "Da_0", "selected": true }, { "codeId": "Da_1", "selected": true }, { "codeId": "_S_URGENCY_DEGREE", "selected": false }, { "codeId": "printed", "selected": false }, { "codeId": "Ac_0", "selected": false }, { "codeId": "Ac_0|DETAIL_SUMVALUE", "selected": false }, { "codeId": "Ac_1", "selected": false }, { "codeId": "Ac_1|DETAIL_SUMVALUE", "selected": false }, { "codeId": "Bd_1", "selected": false }, { "codeId": "Bd_10", "selected": false }, { "codeId": "Bd_11", "selected": false }, { "codeId": "Bd_3", "selected": false }, { "codeId": "Bd_5", "selected": false }, { "codeId": "Bd_6", "selected": false }, { "codeId": "Bd_8", "selected": false }, { "codeId": "Da_2", "selected": false }, { "codeId": "Da_3", "selected": false }, { "codeId": "Ff_2", "selected": false }, { "codeId": "Nu_0|DETAIL_SUMVALUE", "selected": false }, { "codeId": "Nu_11", "selected": false }, { "codeId": "Nu_11|DETAIL_SUMVALUE", "selected": false }, { "codeId": "Nu_12", "selected": false }, { "codeId": "Nu_13", "selected": false }, { "codeId": "Nu_14", "selected": false }, { "codeId": "Nu_14|DETAIL_SUMVALUE", "selected": false }, { "codeId": "Nu_15", "selected": false }, { "codeId": "Nu_15|DETAIL_SUMVALUE", "selected": false }, { "codeId": "Nu_7|DETAIL_SUMVALUE", "selected": false }, { "codeId": "Nu_8", "selected": false }, { "codeId": "Nu_8|DETAIL_SUMVALUE", "selected": false }, { "codeId": "Nu_9", "selected": false }, { "codeId": "Ra_0", "selected": false }, { "codeId": "Ra_1", "selected": false }, { "codeId": "Ta_0", "selected": false }, { "codeId": "Te_18", "selected": false }, { "codeId": "Te_20", "selected": false }, { "codeId": "Te_5", "selected": false }, { "codeId": "Te_6", "selected": false }, { "codeId": "_S_APPLY", "selected": false }, { "codeId": "_S_DEPT", "selected": false }, { "codeId": "Dd_0", "selected": false }, { "codeId": "Dd_1", "selected": false }, { "codeId": "Dd_3", "selected": false }, { "codeId": "Dd_4", "selected": false }], "widgetLinkRecordsMap": {}, "language": "zh-CN" }
        let data2 = { "codeId": "f01efc527a464c0891e1c338bc290361", "type": "start", "widgetVos": [{ "codeId": "_S_TITLE", "selected": true }, { "codeId": "_S_SERIAL", "selected": true }, { "codeId": "_S_DATE", "selected": true }, { "codeId": "activityName", "selected": true }, { "codeId": "approvers", "selected": true }, { "codeId": "_S_URGENCY_DEGREE", "selected": true }, { "codeId": "status", "selected": true }, { "codeId": "Nu_5", "selected": true }, { "codeId": "Nu_5|DETAIL_SUMVALUE", "selected": true }, { "codeId": "Da_2", "selected": true }, { "codeId": "Da_3", "selected": true }, { "codeId": "printed", "selected": false }, { "codeId": "Da_0", "selected": false }, { "codeId": "Da_1", "selected": false }, { "codeId": "Ds_0", "selected": false }, { "codeId": "Ds_1", "selected": false }, { "codeId": "Ps_0", "selected": false }, { "codeId": "Ra_3", "selected": false }, { "codeId": "Ra_4", "selected": false }, { "codeId": "Rd_0", "selected": false }, { "codeId": "Te_15", "selected": false }, { "codeId": "Te_16", "selected": false }, { "codeId": "Te_17", "selected": false }, { "codeId": "Te_18", "selected": false }, { "codeId": "Te_19", "selected": false }, { "codeId": "_S_APPLY", "selected": false }, { "codeId": "_S_DEPT", "selected": false }, { "codeId": "iw_0", "selected": false }, { "codeId": "iw_1", "selected": false }, { "codeId": "iw_4", "selected": false }, { "codeId": "iw_5", "selected": false }, { "codeId": "Dd_0", "selected": false }], "widgetLinkRecordsMap": {}, "language": "zh-CN" }

        try {
            let response1 = await fetch(`https://www.yunzhijia.com/workflow/api/v1/formTemplate/saveFormWightQuery?appId=10104&ticket=${ticket}`, {
                method: 'POST',
                body: JSON.stringify(data1),
                headers: { 'Content-Type': 'application/json' }
            });


            let res1 = JSON.parse(response1.responseText)

            if (res1.errorCode == 0 || res1.errorCode == 200) {
                return1 = true
            }



            let response2 = await fetch(`https://www.yunzhijia.com/workflow/api/v1/formTemplate/saveFormWightQuery?appId=10104&ticket=${ticket}`, {
                method: 'POST',
                body: JSON.stringify(data2),
                headers: { 'Content-Type': 'application/json' }
            });

            let res2 = JSON.parse(response2.responseText)
            if (res2.errorCode == 0 || res2.errorCode == 200) {
                return2 = true
            }
        } catch (error) {
            console.error('请求失败:', error);
        }


        return return1 && return2

    }
    function isEmpty(obj) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }
    function deepCopy(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        let copy = Array.isArray(obj) ? [] : {};

        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                copy[key] = deepCopy(obj[key]);
            }
        }

        return copy;
    }

    function findDayIndex(arr, key) {
        let indexs = null
        arr.forEach((item, index) => {
            if (item == key) {
                indexs = index
            }
        })
        return indexs
    }
    function sumFun(data) {
        let sum = 0
        for (let key in data) {
            sum += data[key].reduce((accumulator, currentValue) => accumulator + currentValue.valueValid, 0);
        }
        return sum
    }


    function generateMonthDates(year, month) {
        const startDate = new Date(year, month - 1, 1); // month is 0-indexed, so subtract 1
        const endDate = new Date(year, month, 0); // 0th day of next month is the last day of current month

        const datesArray = [];

        for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
            const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            datesArray.push(formattedDate);
        }

        return datesArray;
    }

    // 找index
    function findIndex(arr, key) {
        let indexs = null
        arr.forEach((item, index) => {
            if (item.codeId == key) {
                indexs = index
            }
        })
        return indexs

        // return arr.findIndex(item => item.codeId === key); // 假设我们要与 item.codeId 进行比较
    }

    // 创建空数组
    function craeteData(monthDates) {
        let data = []
        monthDates.forEach((item, index) => {
            data.push({ value: 0, valueValid: 0 })
        })
        return data
    }

    // 添加加载柱状图的函数
    function loadBarChart() {
        // 清除柱状图
        myChart.clear()
        let isDark = false
        let XData = xdata
        let series = []

        for (let key in chartData_x) {
            series.push({
                name: key,
                type: 'bar',
                stack: 'Ad',
                emphasis: {
                    focus: 'series'
                },
                data: chartData_x[key],
            })
        }

        for (let key in chartData_f) {
            series.push({
                name: key,
                type: 'bar',
                stack: 'Ad',
                emphasis: {
                    focus: 'series'
                },
                data: chartData_f[key],
            })
        }

        const option = {
            // color:['#88D66C','#FFA62F','#5AB2FF','#FFF78A','#FF8080','#F266AB','#9E6F21','#FFB100','#ADA2FF'],
            tooltip: {
                trigger: "item",
                axisPointer: {
                    type: "shadow"
                },
                formatter(a) {
                    let sum = a.seriesName.includes('非项目') ? chartData_f[a.seriesName].reduce((accumulator, currentValue) => accumulator + currentValue.valueValid, 0) : chartData_x[a.seriesName].reduce((accumulator, currentValue) => accumulator + currentValue.valueValid, 0)
                    let res = '';
                    res += `${a.seriesName} <br/>`;
                    res += `${a.marker} ${a.name} : 确认 ${a.data.value < 0 ? -a.data.value : a.data.valueValid}  <br/>`;
                    res += `${a.marker} ${a.name} : 汇报 ${a.data.value < 0 ? -a.data.value : a.data.value}  <br/>`;
                    res += `合计 : ${sum < 0 ? -sum : sum} <br/>`;

                    return res;
                },
                textStyle: {
                    align: 'left'
                }
            },
            legend: {
                show: true,
                top: "0px",
                textStyle: {
                    color: isDark ? '#fff' : '#000'
                }
            },
            // dataZoom: [{
            //   type: 'inside',
            //   startValue: XData.length - 20
            // }],
            grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true
            },
            yAxis: {
                type: "value",
                axisLabel: {
                    color: isDark ? '#fff' : '#000' // 设置X轴坐标轴文字颜色
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        // 使用深浅的间隔色
                        color: 'rgba(255,255,255,0.05)'
                    }
                }
            },
            xAxis: {
                type: "category",
                data: XData,
                axisLabel: {
                    color: isDark ? '#fff' : '#000' // 设置X轴坐标轴文字颜色
                }
            },
            series: series,
        };

        myChart.setOption(option); // 设置图表的选项
    }

})();


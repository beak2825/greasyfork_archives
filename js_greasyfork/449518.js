// ==UserScript==
// @name         ITsm功能
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  查数据
// @author       Gy
// @match        *://itsm.geely.com/HEAT/*
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/echarts/5.3.2/echarts.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.js

// @downloadURL https://update.greasyfork.org/scripts/449518/ITsm%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/449518/ITsm%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function () {

    'use strict';
    var GyItsm = {

        parseTime: function (time, cFormat) {
            if (arguments.length === 0) {
                return null
            }
            const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
            var date
            if (typeof time === 'object') {
                date = time
            } else {
                if (('' + time).length === 10) time = parseInt(time) * 1000
                date = new Date(time)
            }
            const formatObj = {
                y: date.getFullYear(),
                m: date.getMonth() + 1,
                d: date.getDate(),
                h: date.getHours(),
                i: date.getMinutes(),
                s: date.getSeconds(),
                a: date.getDay()
            }
            const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
                let value = formatObj[key]
                // Note: getDay() returns 0 on Sunday
                if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
                if (result.length > 0 && value < 10) {
                    value = '0' + value
                }
                return value || 0
            })
            return time_str
        },
        getCookie: function (name) {
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg))
                return unescape(arr[2]);
            else
                return null;
        },
        // 发送请求获取数据
        fetchData(bodyData) {
            // var bodyData = encodeURIComponent(bodyData)
            // console.log(bodyData);
            return new Promise(function (resolve, reject) {
                fetch("https://itsm.geely.com/HEAT/handlers/GridDataHandler/GridDataHandler.ashx", {
                    "credentials": "include",
                    "headers": {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0",
                        "Accept": "*/*",
                        "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
                        "X-Requested-With": "XMLHttpRequest",
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        // "Request-Id": "|HvIsb.uchzY",
                        "Sec-Fetch-Dest": "empty",
                        "Sec-Fetch-Mode": "cors",
                        "Sec-Fetch-Site": "same-origin",
                    },
                    "body": bodyData,
                    "method": "POST",
                    "mode": "cors"

                }).then((res) => {
                    // console.log("获取到了文本")
                    return res.text()
                }).then(res2 => {
                    // res2.replace(/(\r\n|\n)/g, '\\n').replace(/'/g, '\\\'');
                    try {
                        var resObj = eval("(()=>{return " + res2 + "})()")
                        resolve(resObj);

                    } catch (error) {
                        reject({ errcode: -1, errmsg: "请求被截断", err: error });
                    }

                    // console.log(a);
                }).catch(err => {
                    console.log(err);
                    reject(err);
                });
            });
        },

        // 全局保存所有chart对象
        charts: [],
        // 获取解决率列表
        getPercentData(eventList, needRow = false) {
            var tableData = {
                all: { a: 0, b: 0, c: 0, },
                unend: { a: 0, b: 0, c: 0, },
                callCenter: { a: 0, b: 0, c: 0, },
                one: { a: 0, b: 0, c: 0 },
                otherOne: { a: 0, b: 0, c: 0 },
                two: { a: 0, b: 0, c: 0 },
                otherTwo: { a: 0, b: 0, c: 0 },
                three: { a: 0, b: 0, c: 0 },
                otherThree: { a: 0, b: 0, c: 0 },
            }
            var tableRows = {
                a: [],
                b: [],
                c: [],
            }
            eventList.forEach((item, ind, arr) => {
                // 服务
                var serviceType = item["f5"];
                // 解决人
                var endUser = item["f66"];
                // 解决团队属性
                var endUserProp = item["f71"];
                // 一线
                var L1Support = item["f38"];
                // 解决人团队
                var teamName = item['f68']
                // 事件发生地
                var companyV = item['f11']

                if (serviceType === "桌面") {
                    tableRows.a.push(item)
                    tableData.all.a++;
                    if (endUser === "") {
                        tableData.unend.a++;
                    }
                    if (endUserProp === "呼叫中心") {
                        tableData.callCenter.a++;
                    }
                    if (teamName.indexOf(companyV.slice(0, 2)) !== -1 && endUserProp === "一线") {
                        tableData.one.a++;
                        tableData.otherOne.a--;
                    }
                    if (endUserProp === "一线") {
                        tableData.otherOne.a++;
                    }
                    if (endUserProp === "二线" && L1Support.indexOf(companyV.slice(0, 2)) !== -1) {
                        tableData.two.a++;
                        tableData.otherTwo.a--
                    }
                    if (endUserProp === "二线") {
                        tableData.otherTwo.a++;
                    }
                    if (endUserProp === "三线" && L1Support.indexOf(companyV.slice(0, 2)) !== -1) {
                        tableData.three.a++;
                        tableData.otherThree.a--
                    }
                    if (endUserProp === "三线") {
                        tableData.otherThree.a++;
                    }
                } else if (serviceType === "基础设施" || serviceType === "基础设施应用") {
                    tableRows.c.push(item)
                    tableData.all.c++;
                    if (endUser === "") {
                        tableData.unend.c++;
                    }
                    if (endUserProp === "呼叫中心") {
                        tableData.callCenter.c++;
                    }
                    if (teamName.indexOf(companyV.slice(0, 2)) !== -1 && endUserProp === "一线") {
                        tableData.one.c++;
                        tableData.otherOne.c--;
                    }
                    if (endUserProp === "一线") {
                        tableData.otherOne.c++;
                    }
                    if (endUserProp === "二线" && L1Support.indexOf(companyV.slice(0, 2)) !== -1) {
                        tableData.two.c++;
                        tableData.otherTwo.c--
                    }
                    if (endUserProp === "二线") {
                        tableData.otherTwo.c++;
                    }
                    if (endUserProp === "三线" && L1Support.indexOf(companyV.slice(0, 2)) !== -1) {
                        tableData.three.c++;
                        tableData.otherThree.c--
                    }
                    if (endUserProp === "三线") {
                        tableData.otherThree.c++;
                    }
                } else {
                    tableRows.b.push(item)
                    tableData.all.b++;
                    if (endUser === "") {
                        tableData.unend.b++;
                    }
                    if (endUserProp === "呼叫中心") {
                        tableData.callCenter.b++;
                    }
                    if (teamName.indexOf(companyV.slice(0, 2)) !== -1 && endUserProp === "一线") {
                        tableData.one.b++;
                        tableData.otherOne.b--;
                    }
                    if (endUserProp === "一线") {
                        tableData.otherOne.b++;
                    }
                    if (endUserProp === "二线" && L1Support.indexOf(companyV.slice(0, 2)) !== -1) {
                        tableData.two.b++;
                        tableData.otherTwo.b--
                    }
                    if (endUserProp === "二线") {
                        tableData.otherTwo.b++;
                    }
                    if (endUserProp === "三线" && L1Support.indexOf(companyV.slice(0, 2)) !== -1) {
                        tableData.three.b++;
                        tableData.otherThree.b--
                    }
                    if (endUserProp === "三线") {
                        tableData.otherThree.b++;
                    }
                }
            });
            Object.keys(tableData).forEach((item) => {
                tableData[item].total = tableData[item].a + tableData[item].b + tableData[item].c
            });
            Object.keys(tableData).forEach(item => {
                tableData[item].percent = (tableData[item].total / tableData.all.total * 100).toFixed(2);
            })
            if (needRow === true) {
                return tableRows;
            }
            return tableData;
        },
        // 绘制所有图表
        randerCharts(eventList, company) {
            var elementList = [];
            // a:桌面 b:系统/应用 c:基础
            var tableData = GyItsm.getPercentData(eventList)
            // console.log(tableData);
            // table1
            var table1div = document.createElement('div');
            table1div.style = "width:100%;height:auto;font-size:1.1vw;box-sizing:border-box;margin:10px auto 0;padding-bottom:20px;";
            table1div.id = "table1Element";

            var tableMain = `<h3 style="margin:0px auto;font-size:18px;text-align:center;color:#333;">运营情况:工单-${company}</h3>`
                + `<h4 style="margin:5px auto;font-size:12px;text-align:center;font-weight:normal;color:#777881;">${GyItsm.subTitle}</h4>
                <table border="1" cellspacing="0" style="border-collapse:collapse;text-align:center;box-sizing:border-box;margin:0 auto;">
            <thead style="background-color: #4e9be5; color:#fff"> <tr> <td colspan="5">工单情况</td> <td colspan="4">未完结</td> <td colspan="28">解决情况</td> </tr> </thead> <tbody>
                <tr> <td rowspan="2">事件发生地</td> <td rowspan="2">桌面</td> <td rowspan="2">应用</td> <td rowspan="2">基础</td> <td rowspan="2">合计</td> <td rowspan="2">桌面</td> <td rowspan="2">应用</td> <td rowspan="2">基础</td> <td rowspan="2">合计</td> <td colspan="4">呼叫中心</td> <td colspan="4">一线</td> <td colspan="4">其他一线解决</td> <td colspan="4">二线</td> <td colspan="4">其他二线解决</td> <td colspan="4">三线</td> <td colspan="4">其他三线解决</td> </tr>
                <tr> <td>桌面</td> <td>应用</td> <td>基础</td> <td>合计</td> <td>桌面</td> <td>应用</td> <td>基础</td> <td>合计</td> <td>桌面</td> <td>应用</td> <td>基础</td> <td>合计</td> <td>桌面</td> <td>应用</td> <td>基础</td> <td>合计</td> <td>桌面</td> <td>应用</td> <td>基础</td> <td>合计</td> <td>桌面</td> <td>应用</td> <td>基础</td> <td>合计</td> <td>桌面</td> <td>应用</td> <td>基础</td> <td>合计</td> </tr>
                <tr> <td>${company}</td>
                    <td>${tableData.all.a}</td>
                    <td>${tableData.all.b}</td>
                    <td>${tableData.all.c}</td>
                    <td>${tableData.all.total}</td>
                    <td>${tableData.unend.a}</td>
                    <td>${tableData.unend.b}</td>
                    <td>${tableData.unend.c}</td>
                    <td>${tableData.unend.total}</td>
                    <td>${tableData.callCenter.a}</td>
                    <td>${tableData.callCenter.b}</td>
                    <td>${tableData.callCenter.c}</td>
                    <td>${tableData.callCenter.total}</td>
                    <td>${tableData.one.a}</td>
                    <td>${tableData.one.b}</td>
                    <td>${tableData.one.c}</td>
                    <td>${tableData.one.total}</td>
                    <td>${tableData.otherOne.a}</td>
                    <td>${tableData.otherOne.b}</td>
                    <td>${tableData.otherOne.c}</td>
                    <td>${tableData.otherOne.total}</td>
                    <td>${tableData.two.a}</td>
                    <td>${tableData.two.b}</td>
                    <td>${tableData.two.c}</td>
                    <td>${tableData.two.total}</td>
                    <td>${tableData.otherTwo.a}</td>
                    <td>${tableData.otherTwo.b}</td>
                    <td>${tableData.otherTwo.c}</td>
                    <td>${tableData.otherTwo.total}</td>
                    <td>${tableData.three.a}</td>
                    <td>${tableData.three.b}</td>
                    <td>${tableData.three.c}</td>
                    <td>${tableData.three.total}</td>
                    <td>${tableData.otherThree.a}</td>
                    <td>${tableData.otherThree.b}</td>
                    <td>${tableData.otherThree.c}</td>
                    <td>${tableData.otherThree.total}</td>
                </tr>
                <tr>
                    <td>解决占比</td>
                    <td colspan="4">/</td>
                    <td colspan="4">${tableData.unend.percent}%</td>
                    <td colspan="4">${tableData.callCenter.percent}%</td>
                    <td colspan="4">${tableData.one.percent}%</td>
                    <td colspan="4">${tableData.otherOne.percent}%</td>
                    <td colspan="4">${tableData.two.percent}%</td>
                    <td colspan="4">${tableData.otherTwo.percent}%</td>
                    <td colspan="4">${tableData.three.percent}%</td>
                    <td colspan="4">${tableData.otherThree.percent}%</td>
                </tr>
                <tr>
                    <td>说明</td>
                    <td colspan="36" style="text-align: left;">
                        呼叫中心解决率：呼叫中心解决的工单数/总工单量;<br>
                        一线解决率：一线解决的工单数/总工单量;<br>
                        其他一线解决率：其他一线解决的工单数/总工单量;<br>
                        二线解决率：二线解决的单数/总工单量;<br>
                        三线解决率：二线解决的单数/总工单量;
                    </td>
                </tr>
            </tbody>
        </table>`;
            // + JSON.stringify(tableData)
            table1div.innerHTML = tableMain;
            elementList.push(table1div);
            GyItsm.gyChartsEles.push(table1div);
            // 表一 start
            var chart1div = document.createElement('div');
            chart1div.id = "chart1Element";
            chart1div.style = "width:100%;height:500px;border:1px solid #333;padding-top:20px;margin-top:5px;box-sizing:border-box;";
            var chart1 = echarts.init(chart1div);
            var xAxisI = {};
            eventList.forEach((item, ind, arr) => {
                if (item["f71"] !== "一线" && item["f71"] !== "呼叫中心") {
                    if (Object.keys(xAxisI).indexOf(item["f7"]) === -1) {
                        xAxisI[item["f7"]] = 1
                    } else {
                        xAxisI[item["f7"]] += 1;
                    }
                }
            });
            var endData = Object.keys(xAxisI).map((item, ind, arr) => {
                return { title: item, value: xAxisI[item] };
            });
            endData.sort((a, b) => b.value - a.value);
            // console.log(endData);
            var option = {
                title: {
                    text: "运营情况-(二三线解决分布)" + company,
                    subtext: GyItsm.subTitle,
                    left: 'center'
                },
                xAxis: {
                    type: 'category',
                    data: endData.map((v, i, a) => v.title),
                    axisLabel: { interval: 0, rotate: 30 },
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: endData.map((v, i, a) => v.value),
                        name: "解决人的计数",
                        type: 'bar',
                        showBackground: true,
                        backgroundStyle: {
                            color: 'rgba(180, 180, 180, 0.2)'
                        },
                        label: {
                            show: true,
                            position: "top",

                        }
                    }
                ]
            };
            chart1.setOption(option);
            GyItsm.charts.push(chart1);
            elementList.push(chart1div)
            GyItsm.gyChartsEles.push(chart1div);
            // 表一 end
            if (endData.length >= 3) {
                // 表二 start
                var chart2div = document.createElement('div');
                chart2div.id = "chart2Element";
                chart2div.style = "width:100%;height:500px;border:1px solid #333;margin-top:-1px;box-sizing:border-box;";
                var chart2 = echarts.init(chart2div);
                var keysObj = endData.slice(0, endData.length >= 3 ? 3 : endData.length).map((item => { return { title: item.title, one: 0, two: 0, three: 0 } }));
                eventList.forEach((dataItem, ind, arr) => {
                    for (let keyInd = 0; keyInd < keysObj.length; keyInd++) {
                        const element = keysObj[keyInd];
                        if (dataItem["f7"] === element["title"]) {
                            if (dataItem['f71'] === '一线') {
                                element.one += 1;
                            } else if (dataItem['f71'] === '二线') {
                                element.two += 1;
                            } else if (dataItem['f71'] === '三线') {
                                element.three += 1;
                            }
                            break;
                        } else {
                            continue;
                        }
                    }
                });
                var formatEchartsData = keysObj.map((parseItem, ind, arr) => {
                    return [{ name: "一线", value: parseItem.one }, { name: "二线", value: parseItem.two }, { name: "三线", value: parseItem.three }];
                });
                var getTxt = (i) => {
                    var total = keysObj[i].one + keysObj[i].two + keysObj[i].three
                    var txt = `共计${total}单\n`;
                    if (keysObj[i].one > 0) {
                        txt += `基地解决${keysObj[i].one}单(${(keysObj[i].one / total * 100).toFixed(1)}%)\n`
                    }
                    if (keysObj[i].two > 0) {
                        txt += `二线解决${keysObj[i].two}单(${(keysObj[i].two / total * 100).toFixed(1)}%)\n`
                    }
                    if (keysObj[i].three > 0) {
                        txt += `三线解决${keysObj[i].three}单(${(keysObj[i].three / total * 100).toFixed(1)}%)\n`
                    }
                    return txt
                }
                var option2 = {
                    title: [
                        {
                            text: "运营情况-(二三线解决TOP3)" + company,
                            subtext: GyItsm.subTitle,
                            left: 'center',
                            top: "10%",
                        },

                        {
                            text: keysObj[0].title,
                            subtext: getTxt(0),
                            left: '16.67%',
                            top: '75%',
                            textAlign: 'center'
                        },
                        {
                            text: keysObj[1].title,

                            subtext: getTxt(1),
                            left: '50%',
                            top: '75%',
                            textAlign: 'center'
                        },
                        {
                            text: keysObj[2].title,
                            subtext: getTxt(2),
                            left: '83.33%',
                            top: '75%',
                            textAlign: 'center'
                        }
                    ],
                    series:
                        [
                            {
                                type: 'pie',
                                radius: '35%',
                                center: ['50%', '50%'],
                                data: formatEchartsData[0],
                                label: {
                                    position: 'outer',
                                    alignTo: 'none',
                                    bleedMargin: 5,
                                    formatter: `{b}-{c}单`
                                },
                                left: 0,
                                right: '66.6667%',
                                top: 0,
                                bottom: 0
                            },
                            {
                                type: 'pie',
                                radius: '35%',
                                center: ['50%', '50%'],
                                data: formatEchartsData[1],
                                label: {
                                    position: 'outer',
                                    alignTo: 'labelLine',
                                    bleedMargin: 5,
                                    formatter: `{b}-{c}单`
                                },
                                left: '33.3333%',
                                right: '33.3333%',
                                top: 0,
                                bottom: 0
                            },
                            {
                                type: 'pie',
                                radius: '35%',
                                center: ['50%', '50%'],
                                data: formatEchartsData[2],
                                label: {
                                    position: 'outer',
                                    // alignTo: 'edge',
                                    alignTo: 'none',
                                    bleedMargin: 5,
                                    formatter: `{b}-{c}单`
                                },
                                left: '66.6667%',
                                right: 0,
                                top: 0,
                                bottom: 0
                            }
                        ]
                };
                chart2.setOption(option2);
                GyItsm.charts.push(chart2);
                elementList.push(chart2div)
                GyItsm.gyChartsEles.push(chart2div);
                // 表二 end
            }
            // 表三 strt
            var chart3div = document.createElement('div');
            chart3div.id = "chart3Element";
            chart3div.style = "width:100%;height:500px;border:1px solid #333;margin-top:-1px;box-sizing:border-box;";
            var chart3 = echarts.init(chart3div);
            var xAxisI2 = {};
            eventList.forEach((item, ind, arr) => {
                if (Object.keys(xAxisI2).indexOf(item["f38"]) === -1) {
                    xAxisI2[item["f38"]] = 1
                } else {
                    xAxisI2[item["f38"]] += 1;
                }
            });
            var endData3 = Object.keys(xAxisI2).map((item, ind, arr) => {
                return { name: item, value: xAxisI2[item] };
            });
            // console.log(endData3)
            var option3 = {
                title: {
                    text: '事件解决团队-' + company,
                    subtext: GyItsm.subTitle,
                    // subtext: 'Fake Data',
                    top: "5%",
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}-{c}"
                },
                legend: {
                    bottom: "10%",
                    left: 'center',
                    data: Object.keys(xAxisI2)
                },
                series: [
                    {
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '50%'],
                        selectedMode: 'single',
                        data: endData3,
                        label: {
                            formatter: "{b}-{c}单"
                        },
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            chart3.setOption(option3);
            GyItsm.charts.push(chart3);
            elementList.push(chart3div)
            GyItsm.gyChartsEles.push(chart3div);
            window.addEventListener("resize", () => {
                try {
                    GyItsm.charts.forEach((item) => {
                        item.resize();
                    })
                } catch (error) {

                }
            })
            return elementList;
        },
        subTitle: "",
        getBodyData(startTime, endTime, company) {
            var _pageSize = 500; //最大700 不然会被服务器截断数据
            var _csrfToken = GyItsm.getCookie("ReSA");
            var startTimeStr = GyItsm.parseTime(startTime, '{y}-{m}-{d}')
            var startTimeStrtemp = GyItsm.parseTime(startTime, '{y}/{m}/{d}')
            var endTimeStr = GyItsm.parseTime(endTime, '{y}-{m}-{d}')
            var endTimeStrtemp = GyItsm.parseTime(endTime, '{y}/{m}/{d}')
            GyItsm.subTitle = startTimeStr + "~" + endTimeStr;
            var bodyData = `forceNoGroup=true&searchInfo=%7B%22ObjectName%22%3A%22Incident%23%22%2C%22Query%22%3A%5B%7B%22ObjectId%22%3A%22Incident%23%22%2C%22ObjectDisplay%22%3A%22%E4%BA%8B%E4%BB%B6%22%2C%22JoinRule%22%3A%22AND%22%2C%22FieldName%22%3A%22CreatedDateTime%22%2C%22FieldDisplay%22%3A%22CreatedDateTime%20(%E5%88%9B%E5%BB%BA%E6%97%B6%E9%97%B4)%22%2C%22FieldType%22%3A%22datetime%22%2C%22`
                + `Condition%22%3A%22%3E%3D%22%2C%22FieldValue`
                + `%22%3A%22${encodeURIComponent(startTimeStr)}T00%3A00%3A00%2B08%3A00%22%2C%22FieldValueDisplay%22%3A%22${encodeURIComponent(startTimeStrtemp)}%22%2C%22`
                + `FieldValueBehavior%22%3A%22single%22%2C%22ConditionType%22%3A0%2C%22BracketLevel%22%3A0%2C%22IsClosingBracket%22%3Afalse%2C%22IsRelatedObjectQuery%22%3Afalse%2C%22RelatedObjectId%22%3A%22%22%2C%22RelatedObjectDisplay%22%3A%22%22%2C%22RelatedObjectOp%22%3A%22%22%2C%22RelatedObjectCount%22%3A1%2C%22IsRelatedObjectCondition%22%3Afalse%2C%22MasterObjectId%22%3A%22Incident%23%22%2C%22RelatedObjects%22%3A%5B%7B%22ID%22%3A%22Incident%23%22%2C%22ObjectId%22%3A%22Incident%23%22%2C%22Name%22%3A%22%E4%BA%8B%E4%BB%B6%22%2C%22Style%22%3A%22master%22%2C%22ThereCardinality%22%3A%22%22%7D%2C%7B%22ID%22%3A%22Audit_Incident%23.%22%2C%22ObjectId%22%3A%22Audit_Incident%23%22%2C%22Name%22%3A%22Audit_Incident%20via%20AuditHistoryRelationship%20(1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22CI%23.Active%22%2C%22ObjectId%22%3A%22CI%23%22%2C%22Name%22%3A%22CI%20via%20CIAssociatedActiveIncident%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22CI%23.%22%2C%22ObjectId%22%3A%22CI%23%22%2C%22Name%22%3A%22CI%20via%20IncidentAssociatesCI%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Frs_EVT_Event%23.Incident%22%2C%22ObjectId%22%3A%22Frs_EVT_Event%23%22%2C%22Name%22%3A%22Event%20via%20Frs_EVT_EventAssocIncident%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Frs_ITFM_Transaction%23.CostItem%22%2C%22ObjectId%22%3A%22Frs_ITFM_Transaction%23%22%2C%22Name%22%3A%22ITFM%20%E6%88%90%E6%9C%AC%E9%A1%B9%E7%9B%AE%20via%20IncidentAssocFrs_ITFM_Transaction%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22ivnt_Chat%23.ivnt_ChatAssocIncident%22%2C%22ObjectId%22%3A%22ivnt_Chat%23%22%2C%22Name%22%3A%22Ivanti%20Chat%20via%20ivnt_ChatAssocIncident%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22ivnt_MicrosoftTeamsUserDetails%23.MicrosoftTeamsUserDetailsAssocIncident%22%2C%22ObjectId%22%3A%22ivnt_MicrosoftTeamsUserDetails%23%22%2C%22Name%22%3A%22Microsoft%20Teams%20User%20Details%20via%20MicrosoftTeamsUserDetailsAssocIncident%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Task%23ComputerProvisioning.%22%2C%22ObjectId%22%3A%22Task%23ComputerProvisioning%22%2C%22Name%22%3A%22Task.ComputerProvisioning%20via%20IncidentAssociatedTaskComputerProvisioning%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Task%23SoftwareInstallation.Rev3%22%2C%22ObjectId%22%3A%22Task%23SoftwareInstallation%22%2C%22Name%22%3A%22Task.SoftwareInstallation%20via%20IncidentAssociatedTaskSoftwareInstallation%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Change%23.%22%2C%22ObjectId%22%3A%22Change%23%22%2C%22Name%22%3A%22%E5%8F%98%E6%9B%B4%20via%20IncidentAssociatesChange%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22ReleaseProject%23.IncidentLinkReleaseProject%22%2C%22ObjectId%22%3A%22ReleaseProject%23%22%2C%22Name%22%3A%22%E5%8F%91%E5%B8%83%20via%20IncidentAssocReleaseProject%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22CI%23Service.IncidentAssociatesService%22%2C%22ObjectId%22%3A%22CI%23Service%22%2C%22Name%22%3A%22%E6%9C%8D%E5%8A%A1%20via%20IncidentAssociatesService%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22ServiceAgreement%23SLA.%22%2C%22ObjectId%22%3A%22ServiceAgreement%23SLA%22%2C%22Name%22%3A%22%E6%9C%8D%E5%8A%A1%E7%BA%A7%E5%88%AB%E5%8D%8F%E8%AE%AE%20via%20IncidentAssociatedServiceAgreementSLA%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22ServiceReq%23.%22%2C%22ObjectId%22%3A%22ServiceReq%23%22%2C%22Name%22%3A%22%E6%9C%8D%E5%8A%A1%E8%AF%B7%E6%B1%82%20via%20IncidentAssociatedServiceReq%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22ServiceReq%23.Reverse%22%2C%22ObjectId%22%3A%22ServiceReq%23%22%2C%22Name%22%3A%22%E6%9C%8D%E5%8A%A1%E8%AF%B7%E6%B1%82%20via%20ServiceReqAssociatedByIncident%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22ServiceAgreement%23.%22%2C%22ObjectId%22%3A%22ServiceAgreement%23%22%2C%22Name%22%3A%22%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE%20via%20IncidentAssociatedEmbeddedServiceAgreement%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Attachment%23.%22%2C%22ObjectId%22%3A%22Attachment%23%22%2C%22Name%22%3A%22%E9%99%84%E4%BB%B6%20via%20IncidentContainsAttachment%20(0...1%20%3A%20N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Frs_data_workflow_instance%23.%22%2C%22ObjectId%22%3A%22Frs_data_workflow_instance%23%22%2C%22Name%22%3A%22%E5%B7%A5%E4%BD%9C%E6%B5%81%E5%AE%9E%E4%BE%8B%20via%20IncidentAssociatedByWorkflowInstance%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Vendor%23.IncidentAssocProfileVendor%22%2C%22ObjectId%22%3A%22Vendor%23%22%2C%22Name%22%3A%22%E4%BE%9B%E5%BA%94%E5%95%86%20via%20IncidentAssocProfileVendor%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Journal%23.%22%2C%22ObjectId%22%3A%22Journal%23%22%2C%22Name%22%3A%22%E6%B4%BB%E5%8A%A8%E5%8E%86%E5%8F%B2%20via%20IncidentContainsJournal%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22ComputerProvisionAction%23.Reverse%22%2C%22ObjectId%22%3A%22ComputerProvisionAction%23%22%2C%22Name%22%3A%22%E8%AE%A1%E7%AE%97%E6%9C%BA%E9%85%8D%E7%BD%AE%E6%93%8D%E4%BD%9C%20via%20IncidentAssociatedComputerProvisionAction%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Frs_CompositeContract_Contact%23.IncidentAssociatedCustomer%22%2C%22ObjectId%22%3A%22Frs_CompositeContract_Contact%23%22%2C%22Name%22%3A%22%E8%81%94%E7%B3%BB%E4%BA%BA%20via%20IncidentAssociatedCustomer%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Frs_CompositeContract_Contact%23.IncidentAssociatedReportedBy%22%2C%22ObjectId%22%3A%22Frs_CompositeContract_Contact%23%22%2C%22Name%22%3A%22%E8%81%94%E7%B3%BB%E4%BA%BA%20via%20IncidentAssociatedReportedBy%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Task%23Assignment.Rev3%22%2C%22ObjectId%22%3A%22Task%23Assignment%22%2C%22Name%22%3A%22%E4%BB%BB%E5%8A%A1%20via%20IncidentAssocTaskAssignment%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Task%23.Rev2%22%2C%22ObjectId%22%3A%22Task%23%22%2C%22Name%22%3A%22%E4%BB%BB%E5%8A%A1%E7%BB%84%20via%20IncidentAssociatedCancelledTask%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Task%23.%22%2C%22ObjectId%22%3A%22Task%23%22%2C%22Name%22%3A%22%E4%BB%BB%E5%8A%A1%E7%BB%84%20via%20IncidentContainsTask%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22SoftwareAction%23.%22%2C%22ObjectId%22%3A%22SoftwareAction%23%22%2C%22Name%22%3A%22%E8%BD%AF%E4%BB%B6%E6%93%8D%E4%BD%9C%20via%20IncidentAssociatedSoftwareAction%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22SocialFeeds%23.SocialFeedsAssocIncident%22%2C%22ObjectId%22%3A%22SocialFeeds%23%22%2C%22Name%22%3A%22%E7%A4%BE%E4%BA%A4%E6%BA%90%20via%20SocialFeedsAssocIncident%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22FRS_Approval%23.%22%2C%22ObjectId%22%3A%22FRS_Approval%23%22%2C%22Name%22%3A%22%E5%AE%A1%E6%89%B9%20via%20IncidentAssociatedFRS_Approval%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Frs_data_escalation_watch%23.IncidentAssocClosingEscWatch%22%2C%22ObjectId%22%3A%22Frs_data_escalation_watch%23%22%2C%22Name%22%3A%22%E5%8D%87%E7%BA%A7%E8%A7%82%E5%AF%9F%20via%20IncidentAssocClosingEscWatch%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Frs_data_escalation_watch%23.%22%2C%22ObjectId%22%3A%22Frs_data_escalation_watch%23%22%2C%22Name%22%3A%22%E5%8D%87%E7%BA%A7%E8%A7%82%E5%AF%9F%20via%20IncidentAssociatedEscalationWatch%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Frs_data_escalation_watch%23.IncidentAssocResolutionEscWatch%22%2C%22ObjectId%22%3A%22Frs_data_escalation_watch%23%22%2C%22Name%22%3A%22%E5%8D%87%E7%BA%A7%E8%A7%82%E5%AF%9F%20via%20IncidentAssocResolutionEscWatch%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Frs_data_escalation_watch%23.IncidentAssocResponseEscalationWatch%22%2C%22ObjectId%22%3A%22Frs_data_escalation_watch%23%22%2C%22Name%22%3A%22%E5%8D%87%E7%BA%A7%E8%A7%82%E5%AF%9F%20via%20IncidentAssocResponseEscalationWatch%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Frs_data_escalation_watch%23.IncidentAssocWaitingEscWatch%22%2C%22ObjectId%22%3A%22Frs_data_escalation_watch%23%22%2C%22Name%22%3A%22%E5%8D%87%E7%BA%A7%E8%A7%82%E5%AF%9F%20via%20IncidentAssocWaitingEscWatch%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Frs_CompositeContract_Entity%23.Entity%22%2C%22ObjectId%22%3A%22Frs_CompositeContract_Entity%23%22%2C%22Name%22%3A%22%E5%AE%9E%E4%BD%93%20via%20IncidentAssocFrs_CompositeContract_Entity%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Incident%23.ChildIncident%22%2C%22ObjectId%22%3A%22Incident%23%22%2C%22Name%22%3A%22%E4%BA%8B%E4%BB%B6%20via%20IncidentAssocChildIncident%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Incident%23.IncidentAssocIncidentNeuronIntegration%22%2C%22ObjectId%22%3A%22Incident%23%22%2C%22Name%22%3A%22%E4%BA%8B%E4%BB%B6%20via%20IncidentAssocIncidentNeuronIntegration%20(N%20%3A%20M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Incident%23.MasterIncident%22%2C%22ObjectId%22%3A%22Incident%23%22%2C%22Name%22%3A%22%E4%BA%8B%E4%BB%B6%20via%20IncidentAssocMasterIncident%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22IncidentDetail%23.%22%2C%22ObjectId%22%3A%22IncidentDetail%23%22%2C%22Name%22%3A%22%E4%BA%8B%E4%BB%B6%E8%AF%A6%E7%BB%86%E4%BF%A1%E6%81%AF%20via%20IncidentContainsIncidentDetail%20(0...1%20%3A%201)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22FRS_SurveySession%23.%22%2C%22ObjectId%22%3A%22FRS_SurveySession%23%22%2C%22Name%22%3A%22%E8%B0%83%E6%9F%A5%E5%9B%9E%E7%AD%94%20via%20IncidentAssociatedFRS_SurveySession%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22FRS_SurveyResults%23.Rev2%22%2C%22ObjectId%22%3A%22FRS_SurveyResults%23%22%2C%22Name%22%3A%22%E8%B0%83%E6%9F%A5%E7%BB%93%E6%9E%9C%20via%20IncidentAssocFRS_SurveyResults%20(1%20%3A%201)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22FRS_SurveyResults%23.%22%2C%22ObjectId%22%3A%22FRS_SurveyResults%23%22%2C%22Name%22%3A%22%E8%B0%83%E6%9F%A5%E7%BB%93%E6%9E%9C%20via%20IncidentAssociatedFRS_SurveyResults%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Task%23WorkOrder.IncidentAssocExternalTask%22%2C%22ObjectId%22%3A%22Task%23WorkOrder%22%2C%22Name%22%3A%22%E5%A4%96%E9%83%A8%E4%BB%BB%E5%8A%A1%20via%20IncidentAssocExternalTask%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Location%23.name%22%2C%22ObjectId%22%3A%22Location%23%22%2C%22Name%22%3A%22%E4%BD%8D%E7%BD%AE%20via%20IncidentAssocLocation%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Problem%23.%22%2C%22ObjectId%22%3A%22Problem%23%22%2C%22Name%22%3A%22%E9%97%AE%E9%A2%98%20via%20ProblemAssociatesIncident%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22MyShelfItem%23.shelftoincident%22%2C%22ObjectId%22%3A%22MyShelfItem%23%22%2C%22Name%22%3A%22%E6%88%91%E7%9A%84%E8%B4%A7%E6%9E%B6%E7%89%A9%E5%93%81%20via%20MyShelfItemAssocIncident%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22FRS_MyItem%23.%22%2C%22ObjectId%22%3A%22FRS_MyItem%23%22%2C%22Name%22%3A%22%E6%88%91%E7%9A%84%E9%A1%B9%E7%9B%AE%20via%20IncidentAssociatedMyItem%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Frs_Project%23.ProjectIncident%22%2C%22ObjectId%22%3A%22Frs_Project%23%22%2C%22Name%22%3A%22%E9%A1%B9%E7%9B%AE%20via%20Frs_ProjectAssocIncident%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Employee%23.ResolvedBy%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentAssocEmployeeResolvedBy%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.SubITLeader%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentAssocEmployeeSubITLeader%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.BaseITLeader%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentBaseITLeaderAssocEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.BUITLeader%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentBUITLeaderAssocEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.ITDirector%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentITDirectorAssocEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.IncidentManagerAssocEmployee%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentManagerAssocEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.OperMaintLeader%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentOperMaintLeaderAssocEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.owner%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentOwnerEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.SystemOwner%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentSystemOwnerAssocEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22FRS_Knowledge%23.%22%2C%22ObjectId%22%3A%22FRS_Knowledge%23%22%2C%22Name%22%3A%22%E7%9F%A5%E8%AF%86%20via%20IncidentAssocFRS_Knowledge%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22OrganizationalUnit%23.%22%2C%22ObjectId%22%3A%22OrganizationalUnit%23%22%2C%22Name%22%3A%22%E7%BB%84%E7%BB%87%E5%8D%95%E4%BD%8D%20via%20IncidentAssocOrganizationalUnit%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%5D%2C%22RelatedRelatedObjects%22%3Anull%2C%22SubQuery%22%3Anull%7D%2C%7B%22ObjectId%22%3A%22Incident%23%22%2C%22ObjectDisplay%22%3A%22%E4%BA%8B%E4%BB%B6%22%2C%22JoinRule%22%3A%22AND%22%2C%22FieldName%22%3A%22CreatedDateTime%22%2C%22FieldDisplay%22%3A%22CreatedDateTime%20(%E5%88%9B%E5%BB%BA%E6%97%B6%E9%97%B4)%22%2C%22FieldType%22%3A%22datetime%22%2C%22`
                + `Condition%22%3A%22%3C%3D%22%2C%22`
                + `FieldValue%22%3A%22${encodeURIComponent(endTimeStr)}T00%3A00%3A00%2B08%3A00%22%2C%22FieldValueDisplay%22%3A%22${encodeURIComponent(endTimeStrtemp)}%22%2C%22`
                + `FieldValueBehavior%22%3A%22single%22%2C%22ConditionType%22%3A0%2C%22BracketLevel%22%3A0%2C%22IsClosingBracket%22%3Afalse%2C%22IsRelatedObjectQuery%22%3Afalse%2C%22RelatedObjectId%22%3A%22%22%2C%22RelatedObjectDisplay%22%3A%22%22%2C%22RelatedObjectOp%22%3A%22%22%2C%22RelatedObjectCount%22%3A1%2C%22IsRelatedObjectCondition%22%3Afalse%2C%22MasterObjectId%22%3A%22Incident%23%22%2C%22RelatedObjects%22%3A%5B%7B%22ID%22%3A%22Incident%23%22%2C%22ObjectId%22%3A%22Incident%23%22%2C%22Name%22%3A%22%E4%BA%8B%E4%BB%B6%22%2C%22Style%22%3A%22master%22%2C%22ThereCardinality%22%3A%22%22%7D%2C%7B%22ID%22%3A%22Audit_Incident%23.%22%2C%22ObjectId%22%3A%22Audit_Incident%23%22%2C%22Name%22%3A%22Audit_Incident%20via%20AuditHistoryRelationship%20(1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22CI%23.Active%22%2C%22ObjectId%22%3A%22CI%23%22%2C%22Name%22%3A%22CI%20via%20CIAssociatedActiveIncident%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22CI%23.%22%2C%22ObjectId%22%3A%22CI%23%22%2C%22Name%22%3A%22CI%20via%20IncidentAssociatesCI%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Frs_EVT_Event%23.Incident%22%2C%22ObjectId%22%3A%22Frs_EVT_Event%23%22%2C%22Name%22%3A%22Event%20via%20Frs_EVT_EventAssocIncident%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Frs_ITFM_Transaction%23.CostItem%22%2C%22ObjectId%22%3A%22Frs_ITFM_Transaction%23%22%2C%22Name%22%3A%22ITFM%20%E6%88%90%E6%9C%AC%E9%A1%B9%E7%9B%AE%20via%20IncidentAssocFrs_ITFM_Transaction%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22ivnt_Chat%23.ivnt_ChatAssocIncident%22%2C%22ObjectId%22%3A%22ivnt_Chat%23%22%2C%22Name%22%3A%22Ivanti%20Chat%20via%20ivnt_ChatAssocIncident%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22ivnt_MicrosoftTeamsUserDetails%23.MicrosoftTeamsUserDetailsAssocIncident%22%2C%22ObjectId%22%3A%22ivnt_MicrosoftTeamsUserDetails%23%22%2C%22Name%22%3A%22Microsoft%20Teams%20User%20Details%20via%20MicrosoftTeamsUserDetailsAssocIncident%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Task%23ComputerProvisioning.%22%2C%22ObjectId%22%3A%22Task%23ComputerProvisioning%22%2C%22Name%22%3A%22Task.ComputerProvisioning%20via%20IncidentAssociatedTaskComputerProvisioning%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Task%23SoftwareInstallation.Rev3%22%2C%22ObjectId%22%3A%22Task%23SoftwareInstallation%22%2C%22Name%22%3A%22Task.SoftwareInstallation%20via%20IncidentAssociatedTaskSoftwareInstallation%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Change%23.%22%2C%22ObjectId%22%3A%22Change%23%22%2C%22Name%22%3A%22%E5%8F%98%E6%9B%B4%20via%20IncidentAssociatesChange%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22ReleaseProject%23.IncidentLinkReleaseProject%22%2C%22ObjectId%22%3A%22ReleaseProject%23%22%2C%22Name%22%3A%22%E5%8F%91%E5%B8%83%20via%20IncidentAssocReleaseProject%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22CI%23Service.IncidentAssociatesService%22%2C%22ObjectId%22%3A%22CI%23Service%22%2C%22Name%22%3A%22%E6%9C%8D%E5%8A%A1%20via%20IncidentAssociatesService%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22ServiceAgreement%23SLA.%22%2C%22ObjectId%22%3A%22ServiceAgreement%23SLA%22%2C%22Name%22%3A%22%E6%9C%8D%E5%8A%A1%E7%BA%A7%E5%88%AB%E5%8D%8F%E8%AE%AE%20via%20IncidentAssociatedServiceAgreementSLA%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22ServiceReq%23.%22%2C%22ObjectId%22%3A%22ServiceReq%23%22%2C%22Name%22%3A%22%E6%9C%8D%E5%8A%A1%E8%AF%B7%E6%B1%82%20via%20IncidentAssociatedServiceReq%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22ServiceReq%23.Reverse%22%2C%22ObjectId%22%3A%22ServiceReq%23%22%2C%22Name%22%3A%22%E6%9C%8D%E5%8A%A1%E8%AF%B7%E6%B1%82%20via%20ServiceReqAssociatedByIncident%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22ServiceAgreement%23.%22%2C%22ObjectId%22%3A%22ServiceAgreement%23%22%2C%22Name%22%3A%22%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE%20via%20IncidentAssociatedEmbeddedServiceAgreement%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Attachment%23.%22%2C%22ObjectId%22%3A%22Attachment%23%22%2C%22Name%22%3A%22%E9%99%84%E4%BB%B6%20via%20IncidentContainsAttachment%20(0...1%20%3A%20N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Frs_data_workflow_instance%23.%22%2C%22ObjectId%22%3A%22Frs_data_workflow_instance%23%22%2C%22Name%22%3A%22%E5%B7%A5%E4%BD%9C%E6%B5%81%E5%AE%9E%E4%BE%8B%20via%20IncidentAssociatedByWorkflowInstance%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Vendor%23.IncidentAssocProfileVendor%22%2C%22ObjectId%22%3A%22Vendor%23%22%2C%22Name%22%3A%22%E4%BE%9B%E5%BA%94%E5%95%86%20via%20IncidentAssocProfileVendor%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Journal%23.%22%2C%22ObjectId%22%3A%22Journal%23%22%2C%22Name%22%3A%22%E6%B4%BB%E5%8A%A8%E5%8E%86%E5%8F%B2%20via%20IncidentContainsJournal%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22ComputerProvisionAction%23.Reverse%22%2C%22ObjectId%22%3A%22ComputerProvisionAction%23%22%2C%22Name%22%3A%22%E8%AE%A1%E7%AE%97%E6%9C%BA%E9%85%8D%E7%BD%AE%E6%93%8D%E4%BD%9C%20via%20IncidentAssociatedComputerProvisionAction%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Frs_CompositeContract_Contact%23.IncidentAssociatedCustomer%22%2C%22ObjectId%22%3A%22Frs_CompositeContract_Contact%23%22%2C%22Name%22%3A%22%E8%81%94%E7%B3%BB%E4%BA%BA%20via%20IncidentAssociatedCustomer%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Frs_CompositeContract_Contact%23.IncidentAssociatedReportedBy%22%2C%22ObjectId%22%3A%22Frs_CompositeContract_Contact%23%22%2C%22Name%22%3A%22%E8%81%94%E7%B3%BB%E4%BA%BA%20via%20IncidentAssociatedReportedBy%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Task%23Assignment.Rev3%22%2C%22ObjectId%22%3A%22Task%23Assignment%22%2C%22Name%22%3A%22%E4%BB%BB%E5%8A%A1%20via%20IncidentAssocTaskAssignment%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Task%23.Rev2%22%2C%22ObjectId%22%3A%22Task%23%22%2C%22Name%22%3A%22%E4%BB%BB%E5%8A%A1%E7%BB%84%20via%20IncidentAssociatedCancelledTask%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Task%23.%22%2C%22ObjectId%22%3A%22Task%23%22%2C%22Name%22%3A%22%E4%BB%BB%E5%8A%A1%E7%BB%84%20via%20IncidentContainsTask%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22SoftwareAction%23.%22%2C%22ObjectId%22%3A%22SoftwareAction%23%22%2C%22Name%22%3A%22%E8%BD%AF%E4%BB%B6%E6%93%8D%E4%BD%9C%20via%20IncidentAssociatedSoftwareAction%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22SocialFeeds%23.SocialFeedsAssocIncident%22%2C%22ObjectId%22%3A%22SocialFeeds%23%22%2C%22Name%22%3A%22%E7%A4%BE%E4%BA%A4%E6%BA%90%20via%20SocialFeedsAssocIncident%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22FRS_Approval%23.%22%2C%22ObjectId%22%3A%22FRS_Approval%23%22%2C%22Name%22%3A%22%E5%AE%A1%E6%89%B9%20via%20IncidentAssociatedFRS_Approval%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Frs_data_escalation_watch%23.IncidentAssocClosingEscWatch%22%2C%22ObjectId%22%3A%22Frs_data_escalation_watch%23%22%2C%22Name%22%3A%22%E5%8D%87%E7%BA%A7%E8%A7%82%E5%AF%9F%20via%20IncidentAssocClosingEscWatch%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Frs_data_escalation_watch%23.%22%2C%22ObjectId%22%3A%22Frs_data_escalation_watch%23%22%2C%22Name%22%3A%22%E5%8D%87%E7%BA%A7%E8%A7%82%E5%AF%9F%20via%20IncidentAssociatedEscalationWatch%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Frs_data_escalation_watch%23.IncidentAssocResolutionEscWatch%22%2C%22ObjectId%22%3A%22Frs_data_escalation_watch%23%22%2C%22Name%22%3A%22%E5%8D%87%E7%BA%A7%E8%A7%82%E5%AF%9F%20via%20IncidentAssocResolutionEscWatch%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Frs_data_escalation_watch%23.IncidentAssocResponseEscalationWatch%22%2C%22ObjectId%22%3A%22Frs_data_escalation_watch%23%22%2C%22Name%22%3A%22%E5%8D%87%E7%BA%A7%E8%A7%82%E5%AF%9F%20via%20IncidentAssocResponseEscalationWatch%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Frs_data_escalation_watch%23.IncidentAssocWaitingEscWatch%22%2C%22ObjectId%22%3A%22Frs_data_escalation_watch%23%22%2C%22Name%22%3A%22%E5%8D%87%E7%BA%A7%E8%A7%82%E5%AF%9F%20via%20IncidentAssocWaitingEscWatch%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Frs_CompositeContract_Entity%23.Entity%22%2C%22ObjectId%22%3A%22Frs_CompositeContract_Entity%23%22%2C%22Name%22%3A%22%E5%AE%9E%E4%BD%93%20via%20IncidentAssocFrs_CompositeContract_Entity%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Incident%23.ChildIncident%22%2C%22ObjectId%22%3A%22Incident%23%22%2C%22Name%22%3A%22%E4%BA%8B%E4%BB%B6%20via%20IncidentAssocChildIncident%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Incident%23.IncidentAssocIncidentNeuronIntegration%22%2C%22ObjectId%22%3A%22Incident%23%22%2C%22Name%22%3A%22%E4%BA%8B%E4%BB%B6%20via%20IncidentAssocIncidentNeuronIntegration%20(N%20%3A%20M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Incident%23.MasterIncident%22%2C%22ObjectId%22%3A%22Incident%23%22%2C%22Name%22%3A%22%E4%BA%8B%E4%BB%B6%20via%20IncidentAssocMasterIncident%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22IncidentDetail%23.%22%2C%22ObjectId%22%3A%22IncidentDetail%23%22%2C%22Name%22%3A%22%E4%BA%8B%E4%BB%B6%E8%AF%A6%E7%BB%86%E4%BF%A1%E6%81%AF%20via%20IncidentContainsIncidentDetail%20(0...1%20%3A%201)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22FRS_SurveySession%23.%22%2C%22ObjectId%22%3A%22FRS_SurveySession%23%22%2C%22Name%22%3A%22%E8%B0%83%E6%9F%A5%E5%9B%9E%E7%AD%94%20via%20IncidentAssociatedFRS_SurveySession%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22FRS_SurveyResults%23.Rev2%22%2C%22ObjectId%22%3A%22FRS_SurveyResults%23%22%2C%22Name%22%3A%22%E8%B0%83%E6%9F%A5%E7%BB%93%E6%9E%9C%20via%20IncidentAssocFRS_SurveyResults%20(1%20%3A%201)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22FRS_SurveyResults%23.%22%2C%22ObjectId%22%3A%22FRS_SurveyResults%23%22%2C%22Name%22%3A%22%E8%B0%83%E6%9F%A5%E7%BB%93%E6%9E%9C%20via%20IncidentAssociatedFRS_SurveyResults%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Task%23WorkOrder.IncidentAssocExternalTask%22%2C%22ObjectId%22%3A%22Task%23WorkOrder%22%2C%22Name%22%3A%22%E5%A4%96%E9%83%A8%E4%BB%BB%E5%8A%A1%20via%20IncidentAssocExternalTask%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Location%23.name%22%2C%22ObjectId%22%3A%22Location%23%22%2C%22Name%22%3A%22%E4%BD%8D%E7%BD%AE%20via%20IncidentAssocLocation%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Problem%23.%22%2C%22ObjectId%22%3A%22Problem%23%22%2C%22Name%22%3A%22%E9%97%AE%E9%A2%98%20via%20ProblemAssociatesIncident%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22MyShelfItem%23.shelftoincident%22%2C%22ObjectId%22%3A%22MyShelfItem%23%22%2C%22Name%22%3A%22%E6%88%91%E7%9A%84%E8%B4%A7%E6%9E%B6%E7%89%A9%E5%93%81%20via%20MyShelfItemAssocIncident%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22FRS_MyItem%23.%22%2C%22ObjectId%22%3A%22FRS_MyItem%23%22%2C%22Name%22%3A%22%E6%88%91%E7%9A%84%E9%A1%B9%E7%9B%AE%20via%20IncidentAssociatedMyItem%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Frs_Project%23.ProjectIncident%22%2C%22ObjectId%22%3A%22Frs_Project%23%22%2C%22Name%22%3A%22%E9%A1%B9%E7%9B%AE%20via%20Frs_ProjectAssocIncident%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Employee%23.ResolvedBy%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentAssocEmployeeResolvedBy%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.SubITLeader%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentAssocEmployeeSubITLeader%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.BaseITLeader%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentBaseITLeaderAssocEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.BUITLeader%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentBUITLeaderAssocEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.ITDirector%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentITDirectorAssocEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.IncidentManagerAssocEmployee%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentManagerAssocEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.OperMaintLeader%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentOperMaintLeaderAssocEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.owner%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentOwnerEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.SystemOwner%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentSystemOwnerAssocEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22FRS_Knowledge%23.%22%2C%22ObjectId%22%3A%22FRS_Knowledge%23%22%2C%22Name%22%3A%22%E7%9F%A5%E8%AF%86%20via%20IncidentAssocFRS_Knowledge%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22OrganizationalUnit%23.%22%2C%22ObjectId%22%3A%22OrganizationalUnit%23%22%2C%22Name%22%3A%22%E7%BB%84%E7%BB%87%E5%8D%95%E4%BD%8D%20via%20IncidentAssocOrganizationalUnit%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%5D%2C%22RelatedRelatedObjects%22%3Anull%2C%22SubQuery%22%3Anull%7D%2C%7B%22ObjectId%22%3A%22Incident%23%22%2C%22ObjectDisplay%22%3A%22%E4%BA%8B%E4%BB%B6%22%2C%22JoinRule%22%3A%22AND%22%2C%22FieldName%22%3A%22Company%22%2C%22FieldDisplay%22%3A%22Company%20(%E4%BA%8B%E4%BB%B6%E5%8F%91%E7%94%9F%E5%9C%B0)%22%2C%22FieldType%22%3A%22list%22%2C%22Condition%22%3A%22%3D%22%2C%22FieldValue%22%3A%22`
                + encodeURIComponent(company)
                + `%22%2C%22FieldValueDisplay%22%3A%22`
                + encodeURIComponent(company)
                + `%22%2C%22FieldValueBehavior%22%3A%22single%22%2C%22ConditionType%22%3A0%2C%22BracketLevel%22%3A0%2C%22IsClosingBracket%22%3Afalse%2C%22IsRelatedObjectQuery%22%3Afalse%2C%22RelatedObjectId%22%3A%22%22%2C%22RelatedObjectDisplay%22%3A%22%22%2C%22RelatedObjectOp%22%3A%22%22%2C%22RelatedObjectCount%22%3A1%2C%22IsRelatedObjectCondition%22%3Afalse%2C%22MasterObjectId%22%3A%22Incident%23%22%2C%22RelatedObjects%22%3A%5B%7B%22ID%22%3A%22Incident%23%22%2C%22ObjectId%22%3A%22Incident%23%22%2C%22Name%22%3A%22%E4%BA%8B%E4%BB%B6%22%2C%22Style%22%3A%22master%22%2C%22ThereCardinality%22%3A%22%22%7D%2C%7B%22ID%22%3A%22Audit_Incident%23.%22%2C%22ObjectId%22%3A%22Audit_Incident%23%22%2C%22Name%22%3A%22Audit_Incident%20via%20AuditHistoryRelationship%20(1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22CI%23.Active%22%2C%22ObjectId%22%3A%22CI%23%22%2C%22Name%22%3A%22CI%20via%20CIAssociatedActiveIncident%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22CI%23.%22%2C%22ObjectId%22%3A%22CI%23%22%2C%22Name%22%3A%22CI%20via%20IncidentAssociatesCI%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Frs_EVT_Event%23.Incident%22%2C%22ObjectId%22%3A%22Frs_EVT_Event%23%22%2C%22Name%22%3A%22Event%20via%20Frs_EVT_EventAssocIncident%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Frs_ITFM_Transaction%23.CostItem%22%2C%22ObjectId%22%3A%22Frs_ITFM_Transaction%23%22%2C%22Name%22%3A%22ITFM%20%E6%88%90%E6%9C%AC%E9%A1%B9%E7%9B%AE%20via%20IncidentAssocFrs_ITFM_Transaction%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22ivnt_Chat%23.ivnt_ChatAssocIncident%22%2C%22ObjectId%22%3A%22ivnt_Chat%23%22%2C%22Name%22%3A%22Ivanti%20Chat%20via%20ivnt_ChatAssocIncident%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22ivnt_MicrosoftTeamsUserDetails%23.MicrosoftTeamsUserDetailsAssocIncident%22%2C%22ObjectId%22%3A%22ivnt_MicrosoftTeamsUserDetails%23%22%2C%22Name%22%3A%22Microsoft%20Teams%20User%20Details%20via%20MicrosoftTeamsUserDetailsAssocIncident%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Task%23ComputerProvisioning.%22%2C%22ObjectId%22%3A%22Task%23ComputerProvisioning%22%2C%22Name%22%3A%22Task.ComputerProvisioning%20via%20IncidentAssociatedTaskComputerProvisioning%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Task%23SoftwareInstallation.Rev3%22%2C%22ObjectId%22%3A%22Task%23SoftwareInstallation%22%2C%22Name%22%3A%22Task.SoftwareInstallation%20via%20IncidentAssociatedTaskSoftwareInstallation%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Change%23.%22%2C%22ObjectId%22%3A%22Change%23%22%2C%22Name%22%3A%22%E5%8F%98%E6%9B%B4%20via%20IncidentAssociatesChange%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22ReleaseProject%23.IncidentLinkReleaseProject%22%2C%22ObjectId%22%3A%22ReleaseProject%23%22%2C%22Name%22%3A%22%E5%8F%91%E5%B8%83%20via%20IncidentAssocReleaseProject%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22CI%23Service.IncidentAssociatesService%22%2C%22ObjectId%22%3A%22CI%23Service%22%2C%22Name%22%3A%22%E6%9C%8D%E5%8A%A1%20via%20IncidentAssociatesService%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22ServiceAgreement%23SLA.%22%2C%22ObjectId%22%3A%22ServiceAgreement%23SLA%22%2C%22Name%22%3A%22%E6%9C%8D%E5%8A%A1%E7%BA%A7%E5%88%AB%E5%8D%8F%E8%AE%AE%20via%20IncidentAssociatedServiceAgreementSLA%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22ServiceReq%23.%22%2C%22ObjectId%22%3A%22ServiceReq%23%22%2C%22Name%22%3A%22%E6%9C%8D%E5%8A%A1%E8%AF%B7%E6%B1%82%20via%20IncidentAssociatedServiceReq%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22ServiceReq%23.Reverse%22%2C%22ObjectId%22%3A%22ServiceReq%23%22%2C%22Name%22%3A%22%E6%9C%8D%E5%8A%A1%E8%AF%B7%E6%B1%82%20via%20ServiceReqAssociatedByIncident%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22ServiceAgreement%23.%22%2C%22ObjectId%22%3A%22ServiceAgreement%23%22%2C%22Name%22%3A%22%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE%20via%20IncidentAssociatedEmbeddedServiceAgreement%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Attachment%23.%22%2C%22ObjectId%22%3A%22Attachment%23%22%2C%22Name%22%3A%22%E9%99%84%E4%BB%B6%20via%20IncidentContainsAttachment%20(0...1%20%3A%20N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Frs_data_workflow_instance%23.%22%2C%22ObjectId%22%3A%22Frs_data_workflow_instance%23%22%2C%22Name%22%3A%22%E5%B7%A5%E4%BD%9C%E6%B5%81%E5%AE%9E%E4%BE%8B%20via%20IncidentAssociatedByWorkflowInstance%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Vendor%23.IncidentAssocProfileVendor%22%2C%22ObjectId%22%3A%22Vendor%23%22%2C%22Name%22%3A%22%E4%BE%9B%E5%BA%94%E5%95%86%20via%20IncidentAssocProfileVendor%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Journal%23.%22%2C%22ObjectId%22%3A%22Journal%23%22%2C%22Name%22%3A%22%E6%B4%BB%E5%8A%A8%E5%8E%86%E5%8F%B2%20via%20IncidentContainsJournal%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22ComputerProvisionAction%23.Reverse%22%2C%22ObjectId%22%3A%22ComputerProvisionAction%23%22%2C%22Name%22%3A%22%E8%AE%A1%E7%AE%97%E6%9C%BA%E9%85%8D%E7%BD%AE%E6%93%8D%E4%BD%9C%20via%20IncidentAssociatedComputerProvisionAction%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Frs_CompositeContract_Contact%23.IncidentAssociatedCustomer%22%2C%22ObjectId%22%3A%22Frs_CompositeContract_Contact%23%22%2C%22Name%22%3A%22%E8%81%94%E7%B3%BB%E4%BA%BA%20via%20IncidentAssociatedCustomer%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Frs_CompositeContract_Contact%23.IncidentAssociatedReportedBy%22%2C%22ObjectId%22%3A%22Frs_CompositeContract_Contact%23%22%2C%22Name%22%3A%22%E8%81%94%E7%B3%BB%E4%BA%BA%20via%20IncidentAssociatedReportedBy%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Task%23Assignment.Rev3%22%2C%22ObjectId%22%3A%22Task%23Assignment%22%2C%22Name%22%3A%22%E4%BB%BB%E5%8A%A1%20via%20IncidentAssocTaskAssignment%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Task%23.Rev2%22%2C%22ObjectId%22%3A%22Task%23%22%2C%22Name%22%3A%22%E4%BB%BB%E5%8A%A1%E7%BB%84%20via%20IncidentAssociatedCancelledTask%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Task%23.%22%2C%22ObjectId%22%3A%22Task%23%22%2C%22Name%22%3A%22%E4%BB%BB%E5%8A%A1%E7%BB%84%20via%20IncidentContainsTask%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22SoftwareAction%23.%22%2C%22ObjectId%22%3A%22SoftwareAction%23%22%2C%22Name%22%3A%22%E8%BD%AF%E4%BB%B6%E6%93%8D%E4%BD%9C%20via%20IncidentAssociatedSoftwareAction%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22SocialFeeds%23.SocialFeedsAssocIncident%22%2C%22ObjectId%22%3A%22SocialFeeds%23%22%2C%22Name%22%3A%22%E7%A4%BE%E4%BA%A4%E6%BA%90%20via%20SocialFeedsAssocIncident%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22FRS_Approval%23.%22%2C%22ObjectId%22%3A%22FRS_Approval%23%22%2C%22Name%22%3A%22%E5%AE%A1%E6%89%B9%20via%20IncidentAssociatedFRS_Approval%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Frs_data_escalation_watch%23.IncidentAssocClosingEscWatch%22%2C%22ObjectId%22%3A%22Frs_data_escalation_watch%23%22%2C%22Name%22%3A%22%E5%8D%87%E7%BA%A7%E8%A7%82%E5%AF%9F%20via%20IncidentAssocClosingEscWatch%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Frs_data_escalation_watch%23.%22%2C%22ObjectId%22%3A%22Frs_data_escalation_watch%23%22%2C%22Name%22%3A%22%E5%8D%87%E7%BA%A7%E8%A7%82%E5%AF%9F%20via%20IncidentAssociatedEscalationWatch%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Frs_data_escalation_watch%23.IncidentAssocResolutionEscWatch%22%2C%22ObjectId%22%3A%22Frs_data_escalation_watch%23%22%2C%22Name%22%3A%22%E5%8D%87%E7%BA%A7%E8%A7%82%E5%AF%9F%20via%20IncidentAssocResolutionEscWatch%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Frs_data_escalation_watch%23.IncidentAssocResponseEscalationWatch%22%2C%22ObjectId%22%3A%22Frs_data_escalation_watch%23%22%2C%22Name%22%3A%22%E5%8D%87%E7%BA%A7%E8%A7%82%E5%AF%9F%20via%20IncidentAssocResponseEscalationWatch%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Frs_data_escalation_watch%23.IncidentAssocWaitingEscWatch%22%2C%22ObjectId%22%3A%22Frs_data_escalation_watch%23%22%2C%22Name%22%3A%22%E5%8D%87%E7%BA%A7%E8%A7%82%E5%AF%9F%20via%20IncidentAssocWaitingEscWatch%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Frs_CompositeContract_Entity%23.Entity%22%2C%22ObjectId%22%3A%22Frs_CompositeContract_Entity%23%22%2C%22Name%22%3A%22%E5%AE%9E%E4%BD%93%20via%20IncidentAssocFrs_CompositeContract_Entity%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Incident%23.ChildIncident%22%2C%22ObjectId%22%3A%22Incident%23%22%2C%22Name%22%3A%22%E4%BA%8B%E4%BB%B6%20via%20IncidentAssocChildIncident%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Incident%23.IncidentAssocIncidentNeuronIntegration%22%2C%22ObjectId%22%3A%22Incident%23%22%2C%22Name%22%3A%22%E4%BA%8B%E4%BB%B6%20via%20IncidentAssocIncidentNeuronIntegration%20(N%20%3A%20M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Incident%23.MasterIncident%22%2C%22ObjectId%22%3A%22Incident%23%22%2C%22Name%22%3A%22%E4%BA%8B%E4%BB%B6%20via%20IncidentAssocMasterIncident%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22IncidentDetail%23.%22%2C%22ObjectId%22%3A%22IncidentDetail%23%22%2C%22Name%22%3A%22%E4%BA%8B%E4%BB%B6%E8%AF%A6%E7%BB%86%E4%BF%A1%E6%81%AF%20via%20IncidentContainsIncidentDetail%20(0...1%20%3A%201)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22FRS_SurveySession%23.%22%2C%22ObjectId%22%3A%22FRS_SurveySession%23%22%2C%22Name%22%3A%22%E8%B0%83%E6%9F%A5%E5%9B%9E%E7%AD%94%20via%20IncidentAssociatedFRS_SurveySession%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22FRS_SurveyResults%23.Rev2%22%2C%22ObjectId%22%3A%22FRS_SurveyResults%23%22%2C%22Name%22%3A%22%E8%B0%83%E6%9F%A5%E7%BB%93%E6%9E%9C%20via%20IncidentAssocFRS_SurveyResults%20(1%20%3A%201)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22FRS_SurveyResults%23.%22%2C%22ObjectId%22%3A%22FRS_SurveyResults%23%22%2C%22Name%22%3A%22%E8%B0%83%E6%9F%A5%E7%BB%93%E6%9E%9C%20via%20IncidentAssociatedFRS_SurveyResults%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Task%23WorkOrder.IncidentAssocExternalTask%22%2C%22ObjectId%22%3A%22Task%23WorkOrder%22%2C%22Name%22%3A%22%E5%A4%96%E9%83%A8%E4%BB%BB%E5%8A%A1%20via%20IncidentAssocExternalTask%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Location%23.name%22%2C%22ObjectId%22%3A%22Location%23%22%2C%22Name%22%3A%22%E4%BD%8D%E7%BD%AE%20via%20IncidentAssocLocation%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Problem%23.%22%2C%22ObjectId%22%3A%22Problem%23%22%2C%22Name%22%3A%22%E9%97%AE%E9%A2%98%20via%20ProblemAssociatesIncident%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22MyShelfItem%23.shelftoincident%22%2C%22ObjectId%22%3A%22MyShelfItem%23%22%2C%22Name%22%3A%22%E6%88%91%E7%9A%84%E8%B4%A7%E6%9E%B6%E7%89%A9%E5%93%81%20via%20MyShelfItemAssocIncident%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22FRS_MyItem%23.%22%2C%22ObjectId%22%3A%22FRS_MyItem%23%22%2C%22Name%22%3A%22%E6%88%91%E7%9A%84%E9%A1%B9%E7%9B%AE%20via%20IncidentAssociatedMyItem%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Frs_Project%23.ProjectIncident%22%2C%22ObjectId%22%3A%22Frs_Project%23%22%2C%22Name%22%3A%22%E9%A1%B9%E7%9B%AE%20via%20Frs_ProjectAssocIncident%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Employee%23.ResolvedBy%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentAssocEmployeeResolvedBy%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.SubITLeader%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentAssocEmployeeSubITLeader%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.BaseITLeader%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentBaseITLeaderAssocEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.BUITLeader%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentBUITLeaderAssocEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.ITDirector%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentITDirectorAssocEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.IncidentManagerAssocEmployee%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentManagerAssocEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.OperMaintLeader%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentOperMaintLeaderAssocEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.owner%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentOwnerEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.SystemOwner%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentSystemOwnerAssocEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22FRS_Knowledge%23.%22%2C%22ObjectId%22%3A%22FRS_Knowledge%23%22%2C%22Name%22%3A%22%E7%9F%A5%E8%AF%86%20via%20IncidentAssocFRS_Knowledge%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22OrganizationalUnit%23.%22%2C%22ObjectId%22%3A%22OrganizationalUnit%23%22%2C%22Name%22%3A%22%E7%BB%84%E7%BB%87%E5%8D%95%E4%BD%8D%20via%20IncidentAssocOrganizationalUnit%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%5D%2C%22RelatedRelatedObjects%22%3Anull%2C%22SubQuery%22%3Anull%7D%5D%7D&allowRankedSearch=true&gridDefName=Incident%20ALL%20list&prompts=&addFields=%7B%7D&masterObjectId=&forceRowSelect=0&`
                + `pageSize=${_pageSize}&bestFit=false&builtInFilter=%7B%22filters%22%3A%5B%5D%7D&_csrfToken=${encodeURIComponent(_csrfToken)}`
            return bodyData;
        },
        get15CompanyData(startTime, endTime, get8Company = false) {
            var _pageSize = 600; //最大700 不然会被服务器截断数据
            var _csrfToken = GyItsm.getCookie("ReSA");
            var startTimeStr = GyItsm.parseTime(startTime, '{y}-{m}-{d}')
            var startTimeStrtemp = GyItsm.parseTime(startTime, '{y}/{m}/{d}')
            var endTimeStr = GyItsm.parseTime(endTime, '{y}-{m}-{d}')
            var endTimeStrtemp = GyItsm.parseTime(endTime, '{y}/{m}/{d}');
            var company = `宝鸡整车, 杭州湾整车, 临海整车, 西安整车, 湘潭整车, 张家口整车, CMA余姚整车, PMA杭州湾, 长兴整车, 春晓整车, 贵阳整车, 晋中整车, 钱塘整车, BMA成都, SPA梅山`;
            if (get8Company === true) {
                company = `宝鸡整车, 长兴整车, 贵阳整车, 杭州湾整车, 晋中整车, 临海整车, 钱塘整车, 西安整车`;
            }
            GyItsm.subTitle = startTimeStr + "~" + endTimeStr;
            var bodyData = `forceNoGroup=true&searchInfo=%7B%22ObjectName%22%3A%22Incident%23%22%2C%22Query%22%3A%5B%7B%22ObjectId%22%3A%22Incident%23%22%2C%22ObjectDisplay%22%3A%22%E4%BA%8B%E4%BB%B6%22%2C%22JoinRule%22%3A%22AND%22%2C%22FieldName%22%3A%22CreatedDateTime%22%2C%22FieldDisplay%22%3A%22CreatedDateTime%20(%E5%88%9B%E5%BB%BA%E6%97%B6%E9%97%B4)%22%2C%22FieldType%22%3A%22datetime%22%2C%22`
                + `Condition%22%3A%22%3E%3D%22%2C%22FieldValue`
                + `%22%3A%22${encodeURIComponent(startTimeStr)}T00%3A00%3A00%2B08%3A00%22%2C%22FieldValueDisplay%22%3A%22${encodeURIComponent(startTimeStrtemp)}%22%2C%22`
                + `FieldValueBehavior%22%3A%22single%22%2C%22ConditionType%22%3A0%2C%22BracketLevel%22%3A0%2C%22IsClosingBracket%22%3Afalse%2C%22IsRelatedObjectQuery%22%3Afalse%2C%22RelatedObjectId%22%3A%22%22%2C%22RelatedObjectDisplay%22%3A%22%22%2C%22RelatedObjectOp%22%3A%22%22%2C%22RelatedObjectCount%22%3A1%2C%22IsRelatedObjectCondition%22%3Afalse%2C%22MasterObjectId%22%3A%22Incident%23%22%2C%22RelatedObjects%22%3A%5B%7B%22ID%22%3A%22Incident%23%22%2C%22ObjectId%22%3A%22Incident%23%22%2C%22Name%22%3A%22%E4%BA%8B%E4%BB%B6%22%2C%22Style%22%3A%22master%22%2C%22ThereCardinality%22%3A%22%22%7D%2C%7B%22ID%22%3A%22Audit_Incident%23.%22%2C%22ObjectId%22%3A%22Audit_Incident%23%22%2C%22Name%22%3A%22Audit_Incident%20via%20AuditHistoryRelationship%20(1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22CI%23.Active%22%2C%22ObjectId%22%3A%22CI%23%22%2C%22Name%22%3A%22CI%20via%20CIAssociatedActiveIncident%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22CI%23.%22%2C%22ObjectId%22%3A%22CI%23%22%2C%22Name%22%3A%22CI%20via%20IncidentAssociatesCI%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Frs_EVT_Event%23.Incident%22%2C%22ObjectId%22%3A%22Frs_EVT_Event%23%22%2C%22Name%22%3A%22Event%20via%20Frs_EVT_EventAssocIncident%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Frs_ITFM_Transaction%23.CostItem%22%2C%22ObjectId%22%3A%22Frs_ITFM_Transaction%23%22%2C%22Name%22%3A%22ITFM%20%E6%88%90%E6%9C%AC%E9%A1%B9%E7%9B%AE%20via%20IncidentAssocFrs_ITFM_Transaction%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22ivnt_Chat%23.ivnt_ChatAssocIncident%22%2C%22ObjectId%22%3A%22ivnt_Chat%23%22%2C%22Name%22%3A%22Ivanti%20Chat%20via%20ivnt_ChatAssocIncident%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22ivnt_MicrosoftTeamsUserDetails%23.MicrosoftTeamsUserDetailsAssocIncident%22%2C%22ObjectId%22%3A%22ivnt_MicrosoftTeamsUserDetails%23%22%2C%22Name%22%3A%22Microsoft%20Teams%20User%20Details%20via%20MicrosoftTeamsUserDetailsAssocIncident%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Task%23ComputerProvisioning.%22%2C%22ObjectId%22%3A%22Task%23ComputerProvisioning%22%2C%22Name%22%3A%22Task.ComputerProvisioning%20via%20IncidentAssociatedTaskComputerProvisioning%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Task%23SoftwareInstallation.Rev3%22%2C%22ObjectId%22%3A%22Task%23SoftwareInstallation%22%2C%22Name%22%3A%22Task.SoftwareInstallation%20via%20IncidentAssociatedTaskSoftwareInstallation%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Change%23.%22%2C%22ObjectId%22%3A%22Change%23%22%2C%22Name%22%3A%22%E5%8F%98%E6%9B%B4%20via%20IncidentAssociatesChange%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22ReleaseProject%23.IncidentLinkReleaseProject%22%2C%22ObjectId%22%3A%22ReleaseProject%23%22%2C%22Name%22%3A%22%E5%8F%91%E5%B8%83%20via%20IncidentAssocReleaseProject%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22CI%23Service.IncidentAssociatesService%22%2C%22ObjectId%22%3A%22CI%23Service%22%2C%22Name%22%3A%22%E6%9C%8D%E5%8A%A1%20via%20IncidentAssociatesService%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22ServiceAgreement%23SLA.%22%2C%22ObjectId%22%3A%22ServiceAgreement%23SLA%22%2C%22Name%22%3A%22%E6%9C%8D%E5%8A%A1%E7%BA%A7%E5%88%AB%E5%8D%8F%E8%AE%AE%20via%20IncidentAssociatedServiceAgreementSLA%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22ServiceReq%23.%22%2C%22ObjectId%22%3A%22ServiceReq%23%22%2C%22Name%22%3A%22%E6%9C%8D%E5%8A%A1%E8%AF%B7%E6%B1%82%20via%20IncidentAssociatedServiceReq%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22ServiceReq%23.Reverse%22%2C%22ObjectId%22%3A%22ServiceReq%23%22%2C%22Name%22%3A%22%E6%9C%8D%E5%8A%A1%E8%AF%B7%E6%B1%82%20via%20ServiceReqAssociatedByIncident%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22ServiceAgreement%23.%22%2C%22ObjectId%22%3A%22ServiceAgreement%23%22%2C%22Name%22%3A%22%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE%20via%20IncidentAssociatedEmbeddedServiceAgreement%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Attachment%23.%22%2C%22ObjectId%22%3A%22Attachment%23%22%2C%22Name%22%3A%22%E9%99%84%E4%BB%B6%20via%20IncidentContainsAttachment%20(0...1%20%3A%20N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Frs_data_workflow_instance%23.%22%2C%22ObjectId%22%3A%22Frs_data_workflow_instance%23%22%2C%22Name%22%3A%22%E5%B7%A5%E4%BD%9C%E6%B5%81%E5%AE%9E%E4%BE%8B%20via%20IncidentAssociatedByWorkflowInstance%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Vendor%23.IncidentAssocProfileVendor%22%2C%22ObjectId%22%3A%22Vendor%23%22%2C%22Name%22%3A%22%E4%BE%9B%E5%BA%94%E5%95%86%20via%20IncidentAssocProfileVendor%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Journal%23.%22%2C%22ObjectId%22%3A%22Journal%23%22%2C%22Name%22%3A%22%E6%B4%BB%E5%8A%A8%E5%8E%86%E5%8F%B2%20via%20IncidentContainsJournal%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22ComputerProvisionAction%23.Reverse%22%2C%22ObjectId%22%3A%22ComputerProvisionAction%23%22%2C%22Name%22%3A%22%E8%AE%A1%E7%AE%97%E6%9C%BA%E9%85%8D%E7%BD%AE%E6%93%8D%E4%BD%9C%20via%20IncidentAssociatedComputerProvisionAction%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Frs_CompositeContract_Contact%23.IncidentAssociatedCustomer%22%2C%22ObjectId%22%3A%22Frs_CompositeContract_Contact%23%22%2C%22Name%22%3A%22%E8%81%94%E7%B3%BB%E4%BA%BA%20via%20IncidentAssociatedCustomer%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Frs_CompositeContract_Contact%23.IncidentAssociatedReportedBy%22%2C%22ObjectId%22%3A%22Frs_CompositeContract_Contact%23%22%2C%22Name%22%3A%22%E8%81%94%E7%B3%BB%E4%BA%BA%20via%20IncidentAssociatedReportedBy%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Task%23Assignment.Rev3%22%2C%22ObjectId%22%3A%22Task%23Assignment%22%2C%22Name%22%3A%22%E4%BB%BB%E5%8A%A1%20via%20IncidentAssocTaskAssignment%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Task%23.Rev2%22%2C%22ObjectId%22%3A%22Task%23%22%2C%22Name%22%3A%22%E4%BB%BB%E5%8A%A1%E7%BB%84%20via%20IncidentAssociatedCancelledTask%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Task%23.%22%2C%22ObjectId%22%3A%22Task%23%22%2C%22Name%22%3A%22%E4%BB%BB%E5%8A%A1%E7%BB%84%20via%20IncidentContainsTask%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22SoftwareAction%23.%22%2C%22ObjectId%22%3A%22SoftwareAction%23%22%2C%22Name%22%3A%22%E8%BD%AF%E4%BB%B6%E6%93%8D%E4%BD%9C%20via%20IncidentAssociatedSoftwareAction%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22SocialFeeds%23.SocialFeedsAssocIncident%22%2C%22ObjectId%22%3A%22SocialFeeds%23%22%2C%22Name%22%3A%22%E7%A4%BE%E4%BA%A4%E6%BA%90%20via%20SocialFeedsAssocIncident%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22FRS_Approval%23.%22%2C%22ObjectId%22%3A%22FRS_Approval%23%22%2C%22Name%22%3A%22%E5%AE%A1%E6%89%B9%20via%20IncidentAssociatedFRS_Approval%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Frs_data_escalation_watch%23.IncidentAssocClosingEscWatch%22%2C%22ObjectId%22%3A%22Frs_data_escalation_watch%23%22%2C%22Name%22%3A%22%E5%8D%87%E7%BA%A7%E8%A7%82%E5%AF%9F%20via%20IncidentAssocClosingEscWatch%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Frs_data_escalation_watch%23.%22%2C%22ObjectId%22%3A%22Frs_data_escalation_watch%23%22%2C%22Name%22%3A%22%E5%8D%87%E7%BA%A7%E8%A7%82%E5%AF%9F%20via%20IncidentAssociatedEscalationWatch%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Frs_data_escalation_watch%23.IncidentAssocResolutionEscWatch%22%2C%22ObjectId%22%3A%22Frs_data_escalation_watch%23%22%2C%22Name%22%3A%22%E5%8D%87%E7%BA%A7%E8%A7%82%E5%AF%9F%20via%20IncidentAssocResolutionEscWatch%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Frs_data_escalation_watch%23.IncidentAssocResponseEscalationWatch%22%2C%22ObjectId%22%3A%22Frs_data_escalation_watch%23%22%2C%22Name%22%3A%22%E5%8D%87%E7%BA%A7%E8%A7%82%E5%AF%9F%20via%20IncidentAssocResponseEscalationWatch%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Frs_data_escalation_watch%23.IncidentAssocWaitingEscWatch%22%2C%22ObjectId%22%3A%22Frs_data_escalation_watch%23%22%2C%22Name%22%3A%22%E5%8D%87%E7%BA%A7%E8%A7%82%E5%AF%9F%20via%20IncidentAssocWaitingEscWatch%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Frs_CompositeContract_Entity%23.Entity%22%2C%22ObjectId%22%3A%22Frs_CompositeContract_Entity%23%22%2C%22Name%22%3A%22%E5%AE%9E%E4%BD%93%20via%20IncidentAssocFrs_CompositeContract_Entity%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Incident%23.ChildIncident%22%2C%22ObjectId%22%3A%22Incident%23%22%2C%22Name%22%3A%22%E4%BA%8B%E4%BB%B6%20via%20IncidentAssocChildIncident%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Incident%23.IncidentAssocIncidentNeuronIntegration%22%2C%22ObjectId%22%3A%22Incident%23%22%2C%22Name%22%3A%22%E4%BA%8B%E4%BB%B6%20via%20IncidentAssocIncidentNeuronIntegration%20(N%20%3A%20M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Incident%23.MasterIncident%22%2C%22ObjectId%22%3A%22Incident%23%22%2C%22Name%22%3A%22%E4%BA%8B%E4%BB%B6%20via%20IncidentAssocMasterIncident%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22IncidentDetail%23.%22%2C%22ObjectId%22%3A%22IncidentDetail%23%22%2C%22Name%22%3A%22%E4%BA%8B%E4%BB%B6%E8%AF%A6%E7%BB%86%E4%BF%A1%E6%81%AF%20via%20IncidentContainsIncidentDetail%20(0...1%20%3A%201)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22FRS_SurveySession%23.%22%2C%22ObjectId%22%3A%22FRS_SurveySession%23%22%2C%22Name%22%3A%22%E8%B0%83%E6%9F%A5%E5%9B%9E%E7%AD%94%20via%20IncidentAssociatedFRS_SurveySession%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22FRS_SurveyResults%23.Rev2%22%2C%22ObjectId%22%3A%22FRS_SurveyResults%23%22%2C%22Name%22%3A%22%E8%B0%83%E6%9F%A5%E7%BB%93%E6%9E%9C%20via%20IncidentAssocFRS_SurveyResults%20(1%20%3A%201)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22FRS_SurveyResults%23.%22%2C%22ObjectId%22%3A%22FRS_SurveyResults%23%22%2C%22Name%22%3A%22%E8%B0%83%E6%9F%A5%E7%BB%93%E6%9E%9C%20via%20IncidentAssociatedFRS_SurveyResults%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Task%23WorkOrder.IncidentAssocExternalTask%22%2C%22ObjectId%22%3A%22Task%23WorkOrder%22%2C%22Name%22%3A%22%E5%A4%96%E9%83%A8%E4%BB%BB%E5%8A%A1%20via%20IncidentAssocExternalTask%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Location%23.name%22%2C%22ObjectId%22%3A%22Location%23%22%2C%22Name%22%3A%22%E4%BD%8D%E7%BD%AE%20via%20IncidentAssocLocation%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Problem%23.%22%2C%22ObjectId%22%3A%22Problem%23%22%2C%22Name%22%3A%22%E9%97%AE%E9%A2%98%20via%20ProblemAssociatesIncident%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22MyShelfItem%23.shelftoincident%22%2C%22ObjectId%22%3A%22MyShelfItem%23%22%2C%22Name%22%3A%22%E6%88%91%E7%9A%84%E8%B4%A7%E6%9E%B6%E7%89%A9%E5%93%81%20via%20MyShelfItemAssocIncident%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22FRS_MyItem%23.%22%2C%22ObjectId%22%3A%22FRS_MyItem%23%22%2C%22Name%22%3A%22%E6%88%91%E7%9A%84%E9%A1%B9%E7%9B%AE%20via%20IncidentAssociatedMyItem%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Frs_Project%23.ProjectIncident%22%2C%22ObjectId%22%3A%22Frs_Project%23%22%2C%22Name%22%3A%22%E9%A1%B9%E7%9B%AE%20via%20Frs_ProjectAssocIncident%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Employee%23.ResolvedBy%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentAssocEmployeeResolvedBy%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.SubITLeader%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentAssocEmployeeSubITLeader%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.BaseITLeader%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentBaseITLeaderAssocEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.BUITLeader%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentBUITLeaderAssocEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.ITDirector%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentITDirectorAssocEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.IncidentManagerAssocEmployee%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentManagerAssocEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.OperMaintLeader%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentOperMaintLeaderAssocEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.owner%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentOwnerEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.SystemOwner%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentSystemOwnerAssocEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22FRS_Knowledge%23.%22%2C%22ObjectId%22%3A%22FRS_Knowledge%23%22%2C%22Name%22%3A%22%E7%9F%A5%E8%AF%86%20via%20IncidentAssocFRS_Knowledge%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22OrganizationalUnit%23.%22%2C%22ObjectId%22%3A%22OrganizationalUnit%23%22%2C%22Name%22%3A%22%E7%BB%84%E7%BB%87%E5%8D%95%E4%BD%8D%20via%20IncidentAssocOrganizationalUnit%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%5D%2C%22RelatedRelatedObjects%22%3Anull%2C%22SubQuery%22%3Anull%7D%2C%7B%22ObjectId%22%3A%22Incident%23%22%2C%22ObjectDisplay%22%3A%22%E4%BA%8B%E4%BB%B6%22%2C%22JoinRule%22%3A%22AND%22%2C%22FieldName%22%3A%22CreatedDateTime%22%2C%22FieldDisplay%22%3A%22CreatedDateTime%20(%E5%88%9B%E5%BB%BA%E6%97%B6%E9%97%B4)%22%2C%22FieldType%22%3A%22datetime%22%2C%22`
                + `Condition%22%3A%22%3C%3D%22%2C%22`
                + `FieldValue%22%3A%22${encodeURIComponent(endTimeStr)}T00%3A00%3A00%2B08%3A00%22%2C%22FieldValueDisplay%22%3A%22${encodeURIComponent(endTimeStrtemp)}%22%2C%22`
                + `FieldValueBehavior%22%3A%22single%22%2C%22ConditionType%22%3A0%2C%22BracketLevel%22%3A0%2C%22IsClosingBracket%22%3Afalse%2C%22IsRelatedObjectQuery%22%3Afalse%2C%22RelatedObjectId%22%3A%22%22%2C%22RelatedObjectDisplay%22%3A%22%22%2C%22RelatedObjectOp%22%3A%22%22%2C%22RelatedObjectCount%22%3A1%2C%22IsRelatedObjectCondition%22%3Afalse%2C%22MasterObjectId%22%3A%22Incident%23%22%2C%22RelatedObjects%22%3A%5B%7B%22ID%22%3A%22Incident%23%22%2C%22ObjectId%22%3A%22Incident%23%22%2C%22Name%22%3A%22%E4%BA%8B%E4%BB%B6%22%2C%22Style%22%3A%22master%22%2C%22ThereCardinality%22%3A%22%22%7D%2C%7B%22ID%22%3A%22Audit_Incident%23.%22%2C%22ObjectId%22%3A%22Audit_Incident%23%22%2C%22Name%22%3A%22Audit_Incident%20via%20AuditHistoryRelationship%20(1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22CI%23.Active%22%2C%22ObjectId%22%3A%22CI%23%22%2C%22Name%22%3A%22CI%20via%20CIAssociatedActiveIncident%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22CI%23.%22%2C%22ObjectId%22%3A%22CI%23%22%2C%22Name%22%3A%22CI%20via%20IncidentAssociatesCI%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Frs_EVT_Event%23.Incident%22%2C%22ObjectId%22%3A%22Frs_EVT_Event%23%22%2C%22Name%22%3A%22Event%20via%20Frs_EVT_EventAssocIncident%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Frs_ITFM_Transaction%23.CostItem%22%2C%22ObjectId%22%3A%22Frs_ITFM_Transaction%23%22%2C%22Name%22%3A%22ITFM%20%E6%88%90%E6%9C%AC%E9%A1%B9%E7%9B%AE%20via%20IncidentAssocFrs_ITFM_Transaction%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22ivnt_Chat%23.ivnt_ChatAssocIncident%22%2C%22ObjectId%22%3A%22ivnt_Chat%23%22%2C%22Name%22%3A%22Ivanti%20Chat%20via%20ivnt_ChatAssocIncident%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22ivnt_MicrosoftTeamsUserDetails%23.MicrosoftTeamsUserDetailsAssocIncident%22%2C%22ObjectId%22%3A%22ivnt_MicrosoftTeamsUserDetails%23%22%2C%22Name%22%3A%22Microsoft%20Teams%20User%20Details%20via%20MicrosoftTeamsUserDetailsAssocIncident%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Task%23ComputerProvisioning.%22%2C%22ObjectId%22%3A%22Task%23ComputerProvisioning%22%2C%22Name%22%3A%22Task.ComputerProvisioning%20via%20IncidentAssociatedTaskComputerProvisioning%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Task%23SoftwareInstallation.Rev3%22%2C%22ObjectId%22%3A%22Task%23SoftwareInstallation%22%2C%22Name%22%3A%22Task.SoftwareInstallation%20via%20IncidentAssociatedTaskSoftwareInstallation%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Change%23.%22%2C%22ObjectId%22%3A%22Change%23%22%2C%22Name%22%3A%22%E5%8F%98%E6%9B%B4%20via%20IncidentAssociatesChange%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22ReleaseProject%23.IncidentLinkReleaseProject%22%2C%22ObjectId%22%3A%22ReleaseProject%23%22%2C%22Name%22%3A%22%E5%8F%91%E5%B8%83%20via%20IncidentAssocReleaseProject%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22CI%23Service.IncidentAssociatesService%22%2C%22ObjectId%22%3A%22CI%23Service%22%2C%22Name%22%3A%22%E6%9C%8D%E5%8A%A1%20via%20IncidentAssociatesService%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22ServiceAgreement%23SLA.%22%2C%22ObjectId%22%3A%22ServiceAgreement%23SLA%22%2C%22Name%22%3A%22%E6%9C%8D%E5%8A%A1%E7%BA%A7%E5%88%AB%E5%8D%8F%E8%AE%AE%20via%20IncidentAssociatedServiceAgreementSLA%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22ServiceReq%23.%22%2C%22ObjectId%22%3A%22ServiceReq%23%22%2C%22Name%22%3A%22%E6%9C%8D%E5%8A%A1%E8%AF%B7%E6%B1%82%20via%20IncidentAssociatedServiceReq%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22ServiceReq%23.Reverse%22%2C%22ObjectId%22%3A%22ServiceReq%23%22%2C%22Name%22%3A%22%E6%9C%8D%E5%8A%A1%E8%AF%B7%E6%B1%82%20via%20ServiceReqAssociatedByIncident%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22ServiceAgreement%23.%22%2C%22ObjectId%22%3A%22ServiceAgreement%23%22%2C%22Name%22%3A%22%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE%20via%20IncidentAssociatedEmbeddedServiceAgreement%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Attachment%23.%22%2C%22ObjectId%22%3A%22Attachment%23%22%2C%22Name%22%3A%22%E9%99%84%E4%BB%B6%20via%20IncidentContainsAttachment%20(0...1%20%3A%20N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Frs_data_workflow_instance%23.%22%2C%22ObjectId%22%3A%22Frs_data_workflow_instance%23%22%2C%22Name%22%3A%22%E5%B7%A5%E4%BD%9C%E6%B5%81%E5%AE%9E%E4%BE%8B%20via%20IncidentAssociatedByWorkflowInstance%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Vendor%23.IncidentAssocProfileVendor%22%2C%22ObjectId%22%3A%22Vendor%23%22%2C%22Name%22%3A%22%E4%BE%9B%E5%BA%94%E5%95%86%20via%20IncidentAssocProfileVendor%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Journal%23.%22%2C%22ObjectId%22%3A%22Journal%23%22%2C%22Name%22%3A%22%E6%B4%BB%E5%8A%A8%E5%8E%86%E5%8F%B2%20via%20IncidentContainsJournal%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22ComputerProvisionAction%23.Reverse%22%2C%22ObjectId%22%3A%22ComputerProvisionAction%23%22%2C%22Name%22%3A%22%E8%AE%A1%E7%AE%97%E6%9C%BA%E9%85%8D%E7%BD%AE%E6%93%8D%E4%BD%9C%20via%20IncidentAssociatedComputerProvisionAction%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Frs_CompositeContract_Contact%23.IncidentAssociatedCustomer%22%2C%22ObjectId%22%3A%22Frs_CompositeContract_Contact%23%22%2C%22Name%22%3A%22%E8%81%94%E7%B3%BB%E4%BA%BA%20via%20IncidentAssociatedCustomer%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Frs_CompositeContract_Contact%23.IncidentAssociatedReportedBy%22%2C%22ObjectId%22%3A%22Frs_CompositeContract_Contact%23%22%2C%22Name%22%3A%22%E8%81%94%E7%B3%BB%E4%BA%BA%20via%20IncidentAssociatedReportedBy%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Task%23Assignment.Rev3%22%2C%22ObjectId%22%3A%22Task%23Assignment%22%2C%22Name%22%3A%22%E4%BB%BB%E5%8A%A1%20via%20IncidentAssocTaskAssignment%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Task%23.Rev2%22%2C%22ObjectId%22%3A%22Task%23%22%2C%22Name%22%3A%22%E4%BB%BB%E5%8A%A1%E7%BB%84%20via%20IncidentAssociatedCancelledTask%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Task%23.%22%2C%22ObjectId%22%3A%22Task%23%22%2C%22Name%22%3A%22%E4%BB%BB%E5%8A%A1%E7%BB%84%20via%20IncidentContainsTask%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22SoftwareAction%23.%22%2C%22ObjectId%22%3A%22SoftwareAction%23%22%2C%22Name%22%3A%22%E8%BD%AF%E4%BB%B6%E6%93%8D%E4%BD%9C%20via%20IncidentAssociatedSoftwareAction%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22SocialFeeds%23.SocialFeedsAssocIncident%22%2C%22ObjectId%22%3A%22SocialFeeds%23%22%2C%22Name%22%3A%22%E7%A4%BE%E4%BA%A4%E6%BA%90%20via%20SocialFeedsAssocIncident%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22FRS_Approval%23.%22%2C%22ObjectId%22%3A%22FRS_Approval%23%22%2C%22Name%22%3A%22%E5%AE%A1%E6%89%B9%20via%20IncidentAssociatedFRS_Approval%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Frs_data_escalation_watch%23.IncidentAssocClosingEscWatch%22%2C%22ObjectId%22%3A%22Frs_data_escalation_watch%23%22%2C%22Name%22%3A%22%E5%8D%87%E7%BA%A7%E8%A7%82%E5%AF%9F%20via%20IncidentAssocClosingEscWatch%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Frs_data_escalation_watch%23.%22%2C%22ObjectId%22%3A%22Frs_data_escalation_watch%23%22%2C%22Name%22%3A%22%E5%8D%87%E7%BA%A7%E8%A7%82%E5%AF%9F%20via%20IncidentAssociatedEscalationWatch%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Frs_data_escalation_watch%23.IncidentAssocResolutionEscWatch%22%2C%22ObjectId%22%3A%22Frs_data_escalation_watch%23%22%2C%22Name%22%3A%22%E5%8D%87%E7%BA%A7%E8%A7%82%E5%AF%9F%20via%20IncidentAssocResolutionEscWatch%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Frs_data_escalation_watch%23.IncidentAssocResponseEscalationWatch%22%2C%22ObjectId%22%3A%22Frs_data_escalation_watch%23%22%2C%22Name%22%3A%22%E5%8D%87%E7%BA%A7%E8%A7%82%E5%AF%9F%20via%20IncidentAssocResponseEscalationWatch%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Frs_data_escalation_watch%23.IncidentAssocWaitingEscWatch%22%2C%22ObjectId%22%3A%22Frs_data_escalation_watch%23%22%2C%22Name%22%3A%22%E5%8D%87%E7%BA%A7%E8%A7%82%E5%AF%9F%20via%20IncidentAssocWaitingEscWatch%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Frs_CompositeContract_Entity%23.Entity%22%2C%22ObjectId%22%3A%22Frs_CompositeContract_Entity%23%22%2C%22Name%22%3A%22%E5%AE%9E%E4%BD%93%20via%20IncidentAssocFrs_CompositeContract_Entity%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Incident%23.ChildIncident%22%2C%22ObjectId%22%3A%22Incident%23%22%2C%22Name%22%3A%22%E4%BA%8B%E4%BB%B6%20via%20IncidentAssocChildIncident%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Incident%23.IncidentAssocIncidentNeuronIntegration%22%2C%22ObjectId%22%3A%22Incident%23%22%2C%22Name%22%3A%22%E4%BA%8B%E4%BB%B6%20via%20IncidentAssocIncidentNeuronIntegration%20(N%20%3A%20M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Incident%23.MasterIncident%22%2C%22ObjectId%22%3A%22Incident%23%22%2C%22Name%22%3A%22%E4%BA%8B%E4%BB%B6%20via%20IncidentAssocMasterIncident%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22IncidentDetail%23.%22%2C%22ObjectId%22%3A%22IncidentDetail%23%22%2C%22Name%22%3A%22%E4%BA%8B%E4%BB%B6%E8%AF%A6%E7%BB%86%E4%BF%A1%E6%81%AF%20via%20IncidentContainsIncidentDetail%20(0...1%20%3A%201)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22FRS_SurveySession%23.%22%2C%22ObjectId%22%3A%22FRS_SurveySession%23%22%2C%22Name%22%3A%22%E8%B0%83%E6%9F%A5%E5%9B%9E%E7%AD%94%20via%20IncidentAssociatedFRS_SurveySession%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22FRS_SurveyResults%23.Rev2%22%2C%22ObjectId%22%3A%22FRS_SurveyResults%23%22%2C%22Name%22%3A%22%E8%B0%83%E6%9F%A5%E7%BB%93%E6%9E%9C%20via%20IncidentAssocFRS_SurveyResults%20(1%20%3A%201)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22FRS_SurveyResults%23.%22%2C%22ObjectId%22%3A%22FRS_SurveyResults%23%22%2C%22Name%22%3A%22%E8%B0%83%E6%9F%A5%E7%BB%93%E6%9E%9C%20via%20IncidentAssociatedFRS_SurveyResults%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Task%23WorkOrder.IncidentAssocExternalTask%22%2C%22ObjectId%22%3A%22Task%23WorkOrder%22%2C%22Name%22%3A%22%E5%A4%96%E9%83%A8%E4%BB%BB%E5%8A%A1%20via%20IncidentAssocExternalTask%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Location%23.name%22%2C%22ObjectId%22%3A%22Location%23%22%2C%22Name%22%3A%22%E4%BD%8D%E7%BD%AE%20via%20IncidentAssocLocation%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Problem%23.%22%2C%22ObjectId%22%3A%22Problem%23%22%2C%22Name%22%3A%22%E9%97%AE%E9%A2%98%20via%20ProblemAssociatesIncident%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22MyShelfItem%23.shelftoincident%22%2C%22ObjectId%22%3A%22MyShelfItem%23%22%2C%22Name%22%3A%22%E6%88%91%E7%9A%84%E8%B4%A7%E6%9E%B6%E7%89%A9%E5%93%81%20via%20MyShelfItemAssocIncident%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22FRS_MyItem%23.%22%2C%22ObjectId%22%3A%22FRS_MyItem%23%22%2C%22Name%22%3A%22%E6%88%91%E7%9A%84%E9%A1%B9%E7%9B%AE%20via%20IncidentAssociatedMyItem%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Frs_Project%23.ProjectIncident%22%2C%22ObjectId%22%3A%22Frs_Project%23%22%2C%22Name%22%3A%22%E9%A1%B9%E7%9B%AE%20via%20Frs_ProjectAssocIncident%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Employee%23.ResolvedBy%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentAssocEmployeeResolvedBy%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.SubITLeader%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentAssocEmployeeSubITLeader%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.BaseITLeader%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentBaseITLeaderAssocEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.BUITLeader%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentBUITLeaderAssocEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.ITDirector%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentITDirectorAssocEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.IncidentManagerAssocEmployee%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentManagerAssocEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.OperMaintLeader%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentOperMaintLeaderAssocEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.owner%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentOwnerEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.SystemOwner%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentSystemOwnerAssocEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22FRS_Knowledge%23.%22%2C%22ObjectId%22%3A%22FRS_Knowledge%23%22%2C%22Name%22%3A%22%E7%9F%A5%E8%AF%86%20via%20IncidentAssocFRS_Knowledge%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22OrganizationalUnit%23.%22%2C%22ObjectId%22%3A%22OrganizationalUnit%23%22%2C%22Name%22%3A%22%E7%BB%84%E7%BB%87%E5%8D%95%E4%BD%8D%20via%20IncidentAssocOrganizationalUnit%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%5D%2C%22RelatedRelatedObjects%22%3Anull%2C%22SubQuery%22%3Anull%7D%2C%7B%22ObjectId%22%3A%22Incident%23%22%2C%22ObjectDisplay%22%3A%22%E4%BA%8B%E4%BB%B6%22%2C%22JoinRule%22%3A%22AND%22%2C%22FieldName%22%3A%22Company%22%2C%22FieldDisplay%22%3A%22Company%20(%E4%BA%8B%E4%BB%B6%E5%8F%91%E7%94%9F%E5%9C%B0)%22%2C%22FieldType%22%3A%22list%22%2C%22Condition%22%3A%22()%22%2C%22FieldValue%22%3A%22`
                + encodeURIComponent(company)
                + `%22%2C%22FieldValueDisplay%22%3A%22`
                + encodeURIComponent(company)
                + `%22%2C%22FieldValueBehavior%22%3A%22single%22%2C%22ConditionType%22%3A0%2C%22BracketLevel%22%3A0%2C%22IsClosingBracket%22%3Afalse%2C%22IsRelatedObjectQuery%22%3Afalse%2C%22RelatedObjectId%22%3A%22%22%2C%22RelatedObjectDisplay%22%3A%22%22%2C%22RelatedObjectOp%22%3A%22%22%2C%22RelatedObjectCount%22%3A1%2C%22IsRelatedObjectCondition%22%3Afalse%2C%22MasterObjectId%22%3A%22Incident%23%22%2C%22RelatedObjects%22%3A%5B%7B%22ID%22%3A%22Incident%23%22%2C%22ObjectId%22%3A%22Incident%23%22%2C%22Name%22%3A%22%E4%BA%8B%E4%BB%B6%22%2C%22Style%22%3A%22master%22%2C%22ThereCardinality%22%3A%22%22%7D%2C%7B%22ID%22%3A%22Audit_Incident%23.%22%2C%22ObjectId%22%3A%22Audit_Incident%23%22%2C%22Name%22%3A%22Audit_Incident%20via%20AuditHistoryRelationship%20(1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22CI%23.Active%22%2C%22ObjectId%22%3A%22CI%23%22%2C%22Name%22%3A%22CI%20via%20CIAssociatedActiveIncident%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22CI%23.%22%2C%22ObjectId%22%3A%22CI%23%22%2C%22Name%22%3A%22CI%20via%20IncidentAssociatesCI%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Frs_EVT_Event%23.Incident%22%2C%22ObjectId%22%3A%22Frs_EVT_Event%23%22%2C%22Name%22%3A%22Event%20via%20Frs_EVT_EventAssocIncident%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Frs_ITFM_Transaction%23.CostItem%22%2C%22ObjectId%22%3A%22Frs_ITFM_Transaction%23%22%2C%22Name%22%3A%22ITFM%20%E6%88%90%E6%9C%AC%E9%A1%B9%E7%9B%AE%20via%20IncidentAssocFrs_ITFM_Transaction%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22ivnt_Chat%23.ivnt_ChatAssocIncident%22%2C%22ObjectId%22%3A%22ivnt_Chat%23%22%2C%22Name%22%3A%22Ivanti%20Chat%20via%20ivnt_ChatAssocIncident%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22ivnt_MicrosoftTeamsUserDetails%23.MicrosoftTeamsUserDetailsAssocIncident%22%2C%22ObjectId%22%3A%22ivnt_MicrosoftTeamsUserDetails%23%22%2C%22Name%22%3A%22Microsoft%20Teams%20User%20Details%20via%20MicrosoftTeamsUserDetailsAssocIncident%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Task%23ComputerProvisioning.%22%2C%22ObjectId%22%3A%22Task%23ComputerProvisioning%22%2C%22Name%22%3A%22Task.ComputerProvisioning%20via%20IncidentAssociatedTaskComputerProvisioning%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Task%23SoftwareInstallation.Rev3%22%2C%22ObjectId%22%3A%22Task%23SoftwareInstallation%22%2C%22Name%22%3A%22Task.SoftwareInstallation%20via%20IncidentAssociatedTaskSoftwareInstallation%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Change%23.%22%2C%22ObjectId%22%3A%22Change%23%22%2C%22Name%22%3A%22%E5%8F%98%E6%9B%B4%20via%20IncidentAssociatesChange%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22ReleaseProject%23.IncidentLinkReleaseProject%22%2C%22ObjectId%22%3A%22ReleaseProject%23%22%2C%22Name%22%3A%22%E5%8F%91%E5%B8%83%20via%20IncidentAssocReleaseProject%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22CI%23Service.IncidentAssociatesService%22%2C%22ObjectId%22%3A%22CI%23Service%22%2C%22Name%22%3A%22%E6%9C%8D%E5%8A%A1%20via%20IncidentAssociatesService%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22ServiceAgreement%23SLA.%22%2C%22ObjectId%22%3A%22ServiceAgreement%23SLA%22%2C%22Name%22%3A%22%E6%9C%8D%E5%8A%A1%E7%BA%A7%E5%88%AB%E5%8D%8F%E8%AE%AE%20via%20IncidentAssociatedServiceAgreementSLA%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22ServiceReq%23.%22%2C%22ObjectId%22%3A%22ServiceReq%23%22%2C%22Name%22%3A%22%E6%9C%8D%E5%8A%A1%E8%AF%B7%E6%B1%82%20via%20IncidentAssociatedServiceReq%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22ServiceReq%23.Reverse%22%2C%22ObjectId%22%3A%22ServiceReq%23%22%2C%22Name%22%3A%22%E6%9C%8D%E5%8A%A1%E8%AF%B7%E6%B1%82%20via%20ServiceReqAssociatedByIncident%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22ServiceAgreement%23.%22%2C%22ObjectId%22%3A%22ServiceAgreement%23%22%2C%22Name%22%3A%22%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE%20via%20IncidentAssociatedEmbeddedServiceAgreement%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Attachment%23.%22%2C%22ObjectId%22%3A%22Attachment%23%22%2C%22Name%22%3A%22%E9%99%84%E4%BB%B6%20via%20IncidentContainsAttachment%20(0...1%20%3A%20N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Frs_data_workflow_instance%23.%22%2C%22ObjectId%22%3A%22Frs_data_workflow_instance%23%22%2C%22Name%22%3A%22%E5%B7%A5%E4%BD%9C%E6%B5%81%E5%AE%9E%E4%BE%8B%20via%20IncidentAssociatedByWorkflowInstance%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Vendor%23.IncidentAssocProfileVendor%22%2C%22ObjectId%22%3A%22Vendor%23%22%2C%22Name%22%3A%22%E4%BE%9B%E5%BA%94%E5%95%86%20via%20IncidentAssocProfileVendor%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Journal%23.%22%2C%22ObjectId%22%3A%22Journal%23%22%2C%22Name%22%3A%22%E6%B4%BB%E5%8A%A8%E5%8E%86%E5%8F%B2%20via%20IncidentContainsJournal%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22ComputerProvisionAction%23.Reverse%22%2C%22ObjectId%22%3A%22ComputerProvisionAction%23%22%2C%22Name%22%3A%22%E8%AE%A1%E7%AE%97%E6%9C%BA%E9%85%8D%E7%BD%AE%E6%93%8D%E4%BD%9C%20via%20IncidentAssociatedComputerProvisionAction%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Frs_CompositeContract_Contact%23.IncidentAssociatedCustomer%22%2C%22ObjectId%22%3A%22Frs_CompositeContract_Contact%23%22%2C%22Name%22%3A%22%E8%81%94%E7%B3%BB%E4%BA%BA%20via%20IncidentAssociatedCustomer%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Frs_CompositeContract_Contact%23.IncidentAssociatedReportedBy%22%2C%22ObjectId%22%3A%22Frs_CompositeContract_Contact%23%22%2C%22Name%22%3A%22%E8%81%94%E7%B3%BB%E4%BA%BA%20via%20IncidentAssociatedReportedBy%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Task%23Assignment.Rev3%22%2C%22ObjectId%22%3A%22Task%23Assignment%22%2C%22Name%22%3A%22%E4%BB%BB%E5%8A%A1%20via%20IncidentAssocTaskAssignment%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Task%23.Rev2%22%2C%22ObjectId%22%3A%22Task%23%22%2C%22Name%22%3A%22%E4%BB%BB%E5%8A%A1%E7%BB%84%20via%20IncidentAssociatedCancelledTask%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Task%23.%22%2C%22ObjectId%22%3A%22Task%23%22%2C%22Name%22%3A%22%E4%BB%BB%E5%8A%A1%E7%BB%84%20via%20IncidentContainsTask%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22SoftwareAction%23.%22%2C%22ObjectId%22%3A%22SoftwareAction%23%22%2C%22Name%22%3A%22%E8%BD%AF%E4%BB%B6%E6%93%8D%E4%BD%9C%20via%20IncidentAssociatedSoftwareAction%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22SocialFeeds%23.SocialFeedsAssocIncident%22%2C%22ObjectId%22%3A%22SocialFeeds%23%22%2C%22Name%22%3A%22%E7%A4%BE%E4%BA%A4%E6%BA%90%20via%20SocialFeedsAssocIncident%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22FRS_Approval%23.%22%2C%22ObjectId%22%3A%22FRS_Approval%23%22%2C%22Name%22%3A%22%E5%AE%A1%E6%89%B9%20via%20IncidentAssociatedFRS_Approval%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Frs_data_escalation_watch%23.IncidentAssocClosingEscWatch%22%2C%22ObjectId%22%3A%22Frs_data_escalation_watch%23%22%2C%22Name%22%3A%22%E5%8D%87%E7%BA%A7%E8%A7%82%E5%AF%9F%20via%20IncidentAssocClosingEscWatch%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Frs_data_escalation_watch%23.%22%2C%22ObjectId%22%3A%22Frs_data_escalation_watch%23%22%2C%22Name%22%3A%22%E5%8D%87%E7%BA%A7%E8%A7%82%E5%AF%9F%20via%20IncidentAssociatedEscalationWatch%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Frs_data_escalation_watch%23.IncidentAssocResolutionEscWatch%22%2C%22ObjectId%22%3A%22Frs_data_escalation_watch%23%22%2C%22Name%22%3A%22%E5%8D%87%E7%BA%A7%E8%A7%82%E5%AF%9F%20via%20IncidentAssocResolutionEscWatch%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Frs_data_escalation_watch%23.IncidentAssocResponseEscalationWatch%22%2C%22ObjectId%22%3A%22Frs_data_escalation_watch%23%22%2C%22Name%22%3A%22%E5%8D%87%E7%BA%A7%E8%A7%82%E5%AF%9F%20via%20IncidentAssocResponseEscalationWatch%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Frs_data_escalation_watch%23.IncidentAssocWaitingEscWatch%22%2C%22ObjectId%22%3A%22Frs_data_escalation_watch%23%22%2C%22Name%22%3A%22%E5%8D%87%E7%BA%A7%E8%A7%82%E5%AF%9F%20via%20IncidentAssocWaitingEscWatch%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Frs_CompositeContract_Entity%23.Entity%22%2C%22ObjectId%22%3A%22Frs_CompositeContract_Entity%23%22%2C%22Name%22%3A%22%E5%AE%9E%E4%BD%93%20via%20IncidentAssocFrs_CompositeContract_Entity%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Incident%23.ChildIncident%22%2C%22ObjectId%22%3A%22Incident%23%22%2C%22Name%22%3A%22%E4%BA%8B%E4%BB%B6%20via%20IncidentAssocChildIncident%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Incident%23.IncidentAssocIncidentNeuronIntegration%22%2C%22ObjectId%22%3A%22Incident%23%22%2C%22Name%22%3A%22%E4%BA%8B%E4%BB%B6%20via%20IncidentAssocIncidentNeuronIntegration%20(N%20%3A%20M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Incident%23.MasterIncident%22%2C%22ObjectId%22%3A%22Incident%23%22%2C%22Name%22%3A%22%E4%BA%8B%E4%BB%B6%20via%20IncidentAssocMasterIncident%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22IncidentDetail%23.%22%2C%22ObjectId%22%3A%22IncidentDetail%23%22%2C%22Name%22%3A%22%E4%BA%8B%E4%BB%B6%E8%AF%A6%E7%BB%86%E4%BF%A1%E6%81%AF%20via%20IncidentContainsIncidentDetail%20(0...1%20%3A%201)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22FRS_SurveySession%23.%22%2C%22ObjectId%22%3A%22FRS_SurveySession%23%22%2C%22Name%22%3A%22%E8%B0%83%E6%9F%A5%E5%9B%9E%E7%AD%94%20via%20IncidentAssociatedFRS_SurveySession%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22FRS_SurveyResults%23.Rev2%22%2C%22ObjectId%22%3A%22FRS_SurveyResults%23%22%2C%22Name%22%3A%22%E8%B0%83%E6%9F%A5%E7%BB%93%E6%9E%9C%20via%20IncidentAssocFRS_SurveyResults%20(1%20%3A%201)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22FRS_SurveyResults%23.%22%2C%22ObjectId%22%3A%22FRS_SurveyResults%23%22%2C%22Name%22%3A%22%E8%B0%83%E6%9F%A5%E7%BB%93%E6%9E%9C%20via%20IncidentAssociatedFRS_SurveyResults%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Task%23WorkOrder.IncidentAssocExternalTask%22%2C%22ObjectId%22%3A%22Task%23WorkOrder%22%2C%22Name%22%3A%22%E5%A4%96%E9%83%A8%E4%BB%BB%E5%8A%A1%20via%20IncidentAssocExternalTask%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Location%23.name%22%2C%22ObjectId%22%3A%22Location%23%22%2C%22Name%22%3A%22%E4%BD%8D%E7%BD%AE%20via%20IncidentAssocLocation%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Problem%23.%22%2C%22ObjectId%22%3A%22Problem%23%22%2C%22Name%22%3A%22%E9%97%AE%E9%A2%98%20via%20ProblemAssociatesIncident%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22MyShelfItem%23.shelftoincident%22%2C%22ObjectId%22%3A%22MyShelfItem%23%22%2C%22Name%22%3A%22%E6%88%91%E7%9A%84%E8%B4%A7%E6%9E%B6%E7%89%A9%E5%93%81%20via%20MyShelfItemAssocIncident%20(0...1%20%3A%200...N)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22FRS_MyItem%23.%22%2C%22ObjectId%22%3A%22FRS_MyItem%23%22%2C%22Name%22%3A%22%E6%88%91%E7%9A%84%E9%A1%B9%E7%9B%AE%20via%20IncidentAssociatedMyItem%20(0...1%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Frs_Project%23.ProjectIncident%22%2C%22ObjectId%22%3A%22Frs_Project%23%22%2C%22Name%22%3A%22%E9%A1%B9%E7%9B%AE%20via%20Frs_ProjectAssocIncident%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22Employee%23.ResolvedBy%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentAssocEmployeeResolvedBy%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.SubITLeader%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentAssocEmployeeSubITLeader%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.BaseITLeader%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentBaseITLeaderAssocEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.BUITLeader%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentBUITLeaderAssocEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.ITDirector%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentITDirectorAssocEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.IncidentManagerAssocEmployee%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentManagerAssocEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.OperMaintLeader%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentOperMaintLeaderAssocEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.owner%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentOwnerEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22Employee%23.SystemOwner%22%2C%22ObjectId%22%3A%22Employee%23%22%2C%22Name%22%3A%22%E5%91%98%E5%B7%A5%20via%20IncidentSystemOwnerAssocEmployee%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%2C%7B%22ID%22%3A%22FRS_Knowledge%23.%22%2C%22ObjectId%22%3A%22FRS_Knowledge%23%22%2C%22Name%22%3A%22%E7%9F%A5%E8%AF%86%20via%20IncidentAssocFRS_Knowledge%20(0...N%20%3A%200...M)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22Many%22%7D%2C%7B%22ID%22%3A%22OrganizationalUnit%23.%22%2C%22ObjectId%22%3A%22OrganizationalUnit%23%22%2C%22Name%22%3A%22%E7%BB%84%E7%BB%87%E5%8D%95%E4%BD%8D%20via%20IncidentAssocOrganizationalUnit%20(0...N%20%3A%200...1)%22%2C%22Style%22%3A%22related%22%2C%22ThereCardinality%22%3A%22One%22%7D%5D%2C%22RelatedRelatedObjects%22%3Anull%2C%22SubQuery%22%3Anull%7D%5D%7D&allowRankedSearch=true&gridDefName=Incident%20ALL%20list&prompts=&addFields=%7B%7D&masterObjectId=&forceRowSelect=0&`
                + `pageSize=${_pageSize}&bestFit=false&builtInFilter=%7B%22filters%22%3A%5B%5D%7D&_csrfToken=${encodeURIComponent(_csrfToken)}`
            return bodyData;
        },
        get8CompanyData(starTime, endTime) {
            var bodyData = GyItsm.get15CompanyData(starTime, endTime, true);
            // console.log(decodeURIComponent(bodyData));
            return GyItsm.fetchData(bodyData).then(res => {
                var tableGElement = document.getElementById('tableGElement');

                console.log(res);
                var dataList = res.rows;
                var tableData = GyItsm.getPercentData(dataList);
                var tableRow = GyItsm.getPercentData(dataList, true);
                GyItsm.gAllData = { tableData, tableRow };
                console.log(tableData);

                var tableGdiv = document.createElement('div');
                tableGdiv.style = "width:100%;height:auto;font-size:1.1vw;box-sizing:border-box;margin:10px auto 0 ; padding-bottom:30px;";
                tableGdiv.id = "tableGElement";
                var tableGMain = `<h3 style="margin:0px auto;font-size:18px;text-align:center;color:#333;">G品牌今日工单汇总</h3>`
                    + `<h4 style="margin:5px auto;font-size:12px;text-align:center;font-weight:normal;color:#777881;">${GyItsm.parseTime(starTime, '{y}-{m}-{d}')}</h4>`
                    + `<h4 style="margin:5px auto;font-size:12px;text-align:center;font-weight:normal;color:#777881;">宝鸡整车, 长兴整车, 贵阳整车, 杭州湾整车, 晋中整车, 临海整车, 钱塘整车, 西安整车</h4>`
                    + `<table border="1" cellspacing="0" style="border-collapse:collapse;text-align:center;box-sizing:border-box;margin:0 auto;"> `
                    + `<thead style="background-color: #4e9be5; color:#fff"> <tr> <td colspan="5">工单情况</td> <td colspan="4">未完结</td> <td colspan="28">解决情况</td> </tr> </thead> <tbody>`
                    + `<tr> <td rowspan="2">事件发生地</td> <td rowspan="2">桌面</td> <td rowspan="2">应用</td> <td rowspan="2">基础</td> <td rowspan="2">合计</td> <td rowspan="2">桌面</td> <td rowspan="2">应用</td> <td rowspan="2">基础</td> <td rowspan="2">合计</td>`
                    + `<td colspan="4">呼叫中心</td> <td colspan="4">一线</td> <td colspan="4">其他一线解决</td> <td colspan="4">二线</td> <td colspan="4">其他二线解决</td> <td colspan="4">三线</td> <td colspan="4">其他三线解决</td> </tr>`
                    + `<tr> <td>桌面</td> <td>应用</td> <td>基础</td> <td>合计</td> <td>桌面</td> <td>应用</td> <td>基础</td> <td>合计</td> <td>桌面</td> <td>应用</td> <td>基础</td> <td>合计</td> <td>桌面</td> <td>应用</td> `
                    + `<td>基础</td> <td>合计</td>` + ` <td>桌面</td> <td>应用</td> <td>基础</td> <td>合计</td> <td>桌面</td> <td>应用</td> <td>基础</td> <td>合计</td> <td>桌面</td> <td>应用</td> <td>基础</td> <td>合计</td> </tr>
                <tr> <td>单数</td>
                    <td><a href="javascript:GyItsm.getOrderDetails('a');" style="text-decoration:underline;">${tableData.all.a}</a></td>
                    <td><a href="javascript:GyItsm.getOrderDetails('b');" style="text-decoration:underline;">${tableData.all.b}</a></td>
                    <td><a href="javascript:GyItsm.getOrderDetails('c');" style="text-decoration:underline;">${tableData.all.c}</a></td>
                    <td>${tableData.all.total}</td>
                    <td>${tableData.unend.a}</td>
                    <td>${tableData.unend.b}</td>
                    <td>${tableData.unend.c}</td>
                    <td>${tableData.unend.total}</td>
                    <td>${tableData.callCenter.a}</td>
                    <td>${tableData.callCenter.b}</td>
                    <td>${tableData.callCenter.c}</td>
                    <td>${tableData.callCenter.total}</td>
                    <td>${tableData.one.a}</td>
                    <td>${tableData.one.b}</td>
                    <td>${tableData.one.c}</td>
                    <td>${tableData.one.total}</td>
                    <td>${tableData.otherOne.a}</td>
                    <td>${tableData.otherOne.b}</td>
                    <td>${tableData.otherOne.c}</td>
                    <td>${tableData.otherOne.total}</td>
                    <td>${tableData.two.a}</td>
                    <td>${tableData.two.b}</td>
                    <td>${tableData.two.c}</td>
                    <td>${tableData.two.total}</td>
                    <td>${tableData.otherTwo.a}</td>
                    <td>${tableData.otherTwo.b}</td>
                    <td>${tableData.otherTwo.c}</td>
                    <td>${tableData.otherTwo.total}</td>
                    <td>${tableData.three.a}</td>
                    <td>${tableData.three.b}</td>
                    <td>${tableData.three.c}</td>
                    <td>${tableData.three.total}</td>
                    <td>${tableData.otherThree.a}</td>
                    <td>${tableData.otherThree.b}</td>
                    <td>${tableData.otherThree.c}</td>
                    <td>${tableData.otherThree.total}</td>
                </tr>
                <tr>
                    <td>解决占比</td>
                    <td colspan="4">/</td>
                    <td colspan="4">${tableData.unend.percent}%</td>
                    <td colspan="4">${tableData.callCenter.percent}%</td>
                    <td colspan="4">${tableData.one.percent}%</td>
                    <td colspan="4">${tableData.otherOne.percent}%</td>
                    <td colspan="4">${tableData.two.percent}%</td>
                    <td colspan="4">${tableData.otherTwo.percent}%</td>
                    <td colspan="4">${tableData.three.percent}%</td>
                    <td colspan="4">${tableData.otherThree.percent}%</td>
                </tr>
            </tbody>
        </table>`;
                tableGdiv.innerHTML = tableGMain;
                GyItsm.gyChartsEles.push(tableGdiv);
                GyItsm.gTableElement = tableGdiv;
                if (tableGElement) {
                    tableGElement.parentElement.insertBefore(tableGdiv, tableGElement);
                    tableGElement.remove();
                }
                return tableGdiv;
            }).catch((err) => {
                console.log(err);
            })
        },
        gAllData: {},
        gTableElement: null,
        gRowListTable: null,
        getOrderDetails(type) {
            if (GyItsm.gRowListTable != null) {
                GyItsm.gRowListTable.remove();
            }
            console.log('工单类型？', type)
            // console.log(GyItsm.gAllData);
            var typeOfOrder = GyItsm.gAllData.tableRow[type];
            console.log(typeOfOrder);
            var innerhtml = `<table  border="1" cellspacing="0" style="border-collapse:collapse;text-align:center;box-sizing:border-box;width:100%;">
            <tr  style="background-color: #4e9be5; color:#fff">
                <td>事件单号</td>
                <td>概述</td>
                <td>内容</td>
                <td>状态</td>
                <td>类别</td>
                <td>子类</td>
                <td>子模块</td>
                <td>事件发生地</td>
                <td>第一支持团队</td>
                <td>当前处理团队</td>
                <td>解决人团队</td>
                <td>创建时间</td>
            </tr>
            
        `
            typeOfOrder.forEach((item) => {
                innerhtml += `<tr>
            <td>${item['f2']}</td>
            <td style="max-width:100px;overflow: auto;">${item['f3']}</td>
            <td style="max-width:100px;overflow: auto;" class="tablegygy">${item['f29']}</td>
            <td>${item['f15']}</td>
            <td>${item['f5']}</td>
            <td>${item['f7']}</td>
            <td>${item['f9']}</td>
            <td>${item['f11']}</td>
            <td>${item['f38']}</td>
            <td>${item['f22']}</td>
            <td>${item['f68']}</td>
            <td>${GyItsm.parseTime(item['f24'])}</td>
        </tr>`
            })
            innerhtml += '</table><style>.tablegygy img{display:none;} .tablegygy *{font-size:12px;font-weight:normal;} .tablegygy>div>div:not[.MsoNormal]{display:none;}</style>'
            var tableBox = document.createElement('div');
            GyItsm.gRowListTable = tableBox;
            tableBox.style = "padding:10px 0;margin:0 auto;width:100%";
            tableBox.innerHTML = innerhtml;
            GyItsm.gTableElement.appendChild(tableBox);
        },
        // 获取主报表数据并绘制;
        getDataAndRander: function (startTime, endTime, company, gdate = null) {
            var todayDate = new Date();
            if (gdate) {
                todayDate = gdate
            }
            GyItsm.get8CompanyData(todayDate, todayDate).then(ele1 => {
                var bodyData = GyItsm.getBodyData(startTime, endTime, company);
                // console.log(bodyData)
                GyItsm.fetchData(bodyData).then(res => {
                    // console.log(res);
                    // GyItsm.openWindow(JSON.stringify(res));
                    // 数据处理
                    var eventList = res.rows;
                    var elementList = GyItsm.randerCharts(eventList, company);
                    elementList.unshift(ele1);
                    GyItsm.openWindow(elementList);
                    // console.log(GyItsm.myWindowElement.win);
                }).catch(err => {
                    alert("数据加载失败,有可能为：1.数据超出最大长度,请缩小起始时间间隔，2.还没有登录成功");
                    console.log(err);
                })
            })

        },
        // echarts的父元素dom元素
        gyChartsEles: [],
        // 删除这里的元素就会删除所有该脚本在页面上的操作
        gyRootEles: [],
        // 脚本页面的元素
        myWindowElement: { win: null, contentEl: null },
        cleanWindow() {
            GyItsm.gyChartsEles.forEach((item) => { item.remove() });
        },

        resizeTimer: null,
        DateRange(value) {
            console.log(value);
            function addDate(date, days) {
                var d = new Date(date);
                d.setDate(d.getDate() + days);
                var m = d.getMonth() + 1;
                return d.getFullYear() + '-' + (m > 9 ? m : '0' + m) + '-' + (d.getDate() > 9 ? d.getDate() : '0' + d.getDate());
            }
            var year = parseInt(value.substring(0, 4));
            var weekNo = parseInt(value.substring(6, 8));
            if (weekNo == 52) {
                year++;
                weekNo = 1;
            } else {
                weekNo += 1;
            }
            // 此年1号是星期几
            let oneday = new Date(year + '-01-01').getDay() //0-6
            // 方便计算，当为星期天时为7
            if (oneday == 0) {
                oneday = 7
            }

            let one_fistday;
            let one_lastday;
            // 如果1号刚好是星期一
            if (oneday == 1) {
                one_fistday = year + '-01-01'
                one_lastday = year + '-01-07'
            } else {
                let jj = 8 - oneday
                one_fistday = (year - 1) + '-12-' + (31 - oneday + 2 > 9 ? 31 - oneday + 2 : '0' + (31 - oneday + 2))
                one_lastday = year + '-01-' + (jj > 9 ? jj : '0' + jj)
            }

            let fistday;
            let lastday;
            // 如果刚好是第一周
            if (weekNo == 1) {
                fistday = one_fistday
                lastday = one_lastday
            } else {
                fistday = addDate(one_lastday, (weekNo - 2) * 7 + 1)
                lastday = addDate(one_lastday, (weekNo - 1) * 7)
            }
            return [new Date(fistday), new Date(lastday)]
        },
        // 创建表单
        createForm(type = "0") {
            var box = document.createElement("div");
            var companyList = `
            <option>西安整车</option>
            <option>宝鸡整车</option>
            <option>晋中整车</option>
            <option>临海整车</option>
            <option>长兴整车</option>
            <option>钱塘整车</option>
            <option>贵阳整车</option>
            <option>杭州湾整车</option>
            <option>湘潭整车</option>
            <option>张家口整车</option>
            <option>CMA余姚整车</option>
            <option>PMA杭州湾</option>
            <option>春晓整车</option>
            <option>BMA成都</option>
            <option>SPA梅山</option>
            `;
            box.style = "box-sizing:border-box;padding:5px;width:100%;height:auto;display:flex;flex-wrap:wrap;border:1px solid #cecece";
            if (type == "0") {
                // 时间段选择
                var title2 = document.createElement("div");
                title2.style = "margin-left:10px;margin-right:5px;";
                title2.innerText = "G品牌汇总日期:";
                box.appendChild(title2);
                var GDateSelect = document.createElement("input");
                GDateSelect.type = "date";
                GDateSelect.id = "GDateSelect"
                GDateSelect.style = "width:150px";
                GDateSelect.value = GyItsm.parseTime(new Date(), '{y}-{m}-{d}');
                GDateSelect.addEventListener('change', (e) => {
                    // console.log(e);
                    var Gdate = new Date(GDateSelect.value);
                    GyItsm.get8CompanyData(Gdate, Gdate);

                });
                box.appendChild(GDateSelect);
                var title1 = document.createElement("div");
                title1.style = "margin-left:10px;margin-right:5px;";
                title1.innerText = "开始日期:";
                box.appendChild(title1);
                var startDateSelect = document.createElement("input");
                startDateSelect.type = "date";
                startDateSelect.id = "gyStartDate"
                startDateSelect.style = "width:150px";
                box.appendChild(startDateSelect);
                var title2 = document.createElement("div");
                title2.style = "margin-left:10px;margin-right:5px;";
                title2.innerText = "结束日期:";
                box.appendChild(title2);
                var endDateSelect = document.createElement("input");
                endDateSelect.type = "date";
                endDateSelect.id = "gyEndDate"
                endDateSelect.style = "width:150px";
                box.appendChild(endDateSelect);
                var my_date = new Date();
                var first_date = new Date(my_date.getFullYear(), my_date.getMonth(), 1);
                var last_date = new Date(my_date.getFullYear(), my_date.getMonth() + 1, 0);
                startDateSelect.value = GyItsm.parseTime(first_date, '{y}-{m}-{d}');
                endDateSelect.value = GyItsm.parseTime(last_date, '{y}-{m}-{d}');
                console.log(first_date, last_date);
                var title3 = document.createElement("div");
                title3.style = "margin-left:10px;margin-right:5px;";
                title3.innerText = "选择团队:";
                box.appendChild(title3);
                var companySelecter = document.createElement("select");
                // 多选给select 加上 multiple="multiple"
                companySelecter.id = "gyCompanySelecter";
                companySelecter.style = "width:150px";
                companySelecter.innerHTML = companyList;
                box.appendChild(companySelecter);
                // 按钮
                var submitBtn = document.createElement("button");
                submitBtn.innerText = "确定";

                submitBtn.addEventListener("click", () => {
                    try {
                        var company = companySelecter.options[companySelecter.selectedIndex].text;
                    } catch (error) {
                        var company = "";
                    }
                    if (startDateSelect.value == "" || endDateSelect.value == "" || company == "" || GDateSelect.value == "") {
                        alert("开始日期,结束日期,团队,G品牌汇总日期 都不能为空");
                        return;
                    }
                    GyItsm.cleanWindow();
                    var Gdate = new Date(GDateSelect.value);
                    GyItsm.getDataAndRander(new Date(startDateSelect.value), new Date(endDateSelect.value), company, Gdate)
                    console.log(startDateSelect.value, endDateSelect.value, company);
                    // GyItsm.get8CompanyData(Gdate, Gdate);
                    if (GyItsm.resizeTimer != null) {
                        clearInterval(GyItsm.resizeTimer);
                        GyItsm.resizeTimer = null;
                    }
                    GyItsm.resizeTimer = setInterval(() => {
                        GyItsm.charts.forEach((item) => {
                            item.resize();
                        })
                    }, 1000)
                })
                box.appendChild(submitBtn);
                var downloadBtn = document.createElement("button");
                downloadBtn.innerText = "导出";
                downloadBtn.style = "margin:0 10px";
                downloadBtn.addEventListener("click", () => {
                    // console.log(GyItsm.myWindowElement.contentEl);
                    // print();
                    // html2canvas(GyItsm.myWindowElement.contentEl).then(canvas => {
                    // try {
                    //     var company = companySelecter.options[companySelecter.selectedIndex].text;
                    // } catch (error) {
                    //     var company = "";
                    // }
                    //     // var imgUrl = canvas.toDataURL("jpeg");
                    //     // canvas.style="position:fixed;top:0;left:0;z-index:9999999999;border:1px solid #f00";
                    //     // document.body.appendChild(canvas)

                    // canvas.toBlob((blob) => {
                    //     saveAs(blob, company + ".jpg");
                    // })
                    // })
                    var sharePoster = GyItsm.myWindowElement.contentEl;
                    html2canvas(sharePoster, {
                        //允许跨域
                        useCORS: true,
                        scale: 2,
                        width: sharePoster.offsetWidth,
                        height: sharePoster.offsetHeight,
                        foreignObjectRendering: true,
                        x: -sharePoster.getBoundingClientRect().x,
                        //需要加上滚动条偏移距离
                        y: -sharePoster.getBoundingClientRect().y,
                    }).then((canvas) => {
                        //赋值base64
                        // sharePosterImg.value = canvas.toDataURL("image/png");
                        canvas.toBlob((blob) => {
                            try {
                                var company = companySelecter.options[companySelecter.selectedIndex].text;
                            } catch (error) {
                                var company = "";
                            }
                            saveAs(blob, company + ".jpg");
                        })
                    });

                })
                box.appendChild(downloadBtn);
            } else if (type == "1") {
                // 周选择
                var title1 = document.createElement("div");
                title1.style = "margin-left:10px;margin-right:5px;";
                title1.innerText = "目标周:";
                box.appendChild(title1);
                var weekSelect = document.createElement("input");
                weekSelect.type = "week";
                weekSelect.id = "gyStartDate"
                weekSelect.style = "width:150px";
                box.appendChild(weekSelect);
                var companySelecter2 = document.createElement("select");
                // 多选给select 加上 multiple="multiple"
                companySelecter2.id = "gyCompanySelecter";
                companySelecter2.style = "width:100px";
                companySelecter2.innerHTML = companyList;
                box.appendChild(companySelecter2);
                // 按钮
                var submitBtn = document.createElement("button");
                submitBtn.innerText = "确定";

                submitBtn.addEventListener("click", () => {
                    try {
                        var company = companySelecter2.options[companySelecter2.selectedIndex].text;
                    } catch (error) {
                        var company = "";
                    }
                    if (weekSelect.value == "" || company == "") {
                        alert("选择目标周,团队");
                        return;
                    }
                    GyItsm.cleanWindow();
                    console.log(weekSelect.value, weekSelect);
                    GyItsm.getOneSupportPercentAndRander(weekSelect.value, company);
                    if (GyItsm.resizeTimer != null) {
                        clearInterval(GyItsm.resizeTimer);
                        GyItsm.resizeTimer = null;
                    }
                    GyItsm.resizeTimer = setInterval(() => {
                        GyItsm.charts.forEach((item) => {
                            item.resize();
                        })
                    }, 1000)
                })
                box.appendChild(submitBtn);
                var downloadBtn = document.createElement("button");
                downloadBtn.innerText = "导出";
                downloadBtn.style = "margin:0 10px";
                downloadBtn.addEventListener("click", () => {
                    // html2canvas(GyItsm.myWindowElement.contentEl).then(canvas => {
                    //     try {
                    //         var company = companySelecter2.options[companySelecter2.selectedIndex].text;
                    //     } catch (error) {
                    //         var company = "";
                    //     }
                    //     canvas.toBlob((blob) => {
                    //         saveAs(blob, company + ".jpg");
                    //     })
                    // })
                    var sharePoster = GyItsm.myWindowElement.contentEl;
                    html2canvas(sharePoster, {
                        //允许跨域
                        useCORS: true,
                        scale: 2,
                        width: sharePoster.offsetWidth,
                        height: sharePoster.offsetHeight,
                        foreignObjectRendering: true,
                        x: -sharePoster.getBoundingClientRect().x,
                        //需要加上滚动条偏移距离
                        y: -sharePoster.getBoundingClientRect().y,
                    }).then((canvas) => {
                        //赋值base64
                        // sharePosterImg.value = canvas.toDataURL("image/png");
                        canvas.toBlob((blob) => {
                            try {
                                var company = companySelecter2.options[companySelecter2.selectedIndex].text;
                            } catch (error) {
                                var company = "";
                            }
                            saveAs(blob, company + ".jpg");
                        })
                    });
                })
                box.appendChild(downloadBtn);
            }

            return box;
        },
        get4WeekArr(weekStr, reverse = true) {
            var year, week;
            var weekArr = [];
            year = parseInt(weekStr.substring(0, 4));
            week = parseInt(weekStr.substring(6, 8));
            for (var i = 0; i <= 3; i++) {
                var tempweek = week - i;
                var tempyear = year;
                if (tempweek <= 0) {
                    tempyear--;
                    tempweek = 52 + tempweek;
                }
                var tempStr = `${tempyear}-W${tempweek}`;
                var item = GyItsm.DateRange(tempStr);
                item.push(tempStr);

                reverse === true ? weekArr.unshift(item) : weekArr.push(item);
            }
            return weekArr;

        },
        // 获取一线解决率报表数据并绘制
        getOneSupportPercentAndRander(weekStr, company) {
            var fourWeekArr = GyItsm.get4WeekArr(weekStr);
            // console.log(fourWeekArr);
            console.log(weekStr, fourWeekArr.map((item => {
                return item.map((item2, ind) => ind < 2 ? GyItsm.parseTime(item2) : item2);
            })))
            Promise.all(fourWeekArr.map((item, ind, arr) => {
                var bodyData = GyItsm.getBodyData(item[0], item[1], company);
                return new Promise((resolve, reject) => {
                    GyItsm.fetchData(bodyData).then(res => {
                        if (res.hasOwnProperty('rows')) {
                            var percentData = GyItsm.getPercentData(res.rows);
                        } else {
                            percentData = {};
                        }
                        resolve({ ind: ind, week: item[2], data: percentData });
                    }).catch((err) => reject(err))
                });
            })).then(res => {
                var chartdiv = document.createElement('div');
                chartdiv.id = "chart4Element";
                chartdiv.style = "width:100%;height:500px;border:1px solid #333;;padding:10px 0;";
                var chart = echarts.init(chartdiv);
                var option = {
                    title: {
                        text: company + "-一线解决率周趋势",
                        left: "center"
                    },
                    xAxis: {
                        type: 'category',
                        data: res.map((item) => item.week)
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            data: res.map((item) => {
                                if (item.data.hasOwnProperty("one")) {
                                    return item.data.one.percent;
                                } else {
                                    return 0;
                                }
                            }),
                            type: 'line',
                            label: {
                                show: true,
                                formatter: "{c}%"
                            }

                        }
                    ]
                };
                chart.setOption(option);
                GyItsm.charts.push(chart);
                // elementList.push(chartdiv);
                GyItsm.gyChartsEles.push(chartdiv);
                GyItsm.openWindow([chartdiv]);
                // console.log(res);
            })
            GyItsm.randerOneSupportPercentCharts(weekStr);
        },

        // 绘制一线解决率报表
        randerOneSupportPercentCharts(weekStr) {
            var fourWeekArr = GyItsm.get4WeekArr(weekStr, false);
            Promise.all(fourWeekArr.map((item, ind, arr) => {
                var bodyData = GyItsm.get15CompanyData(item[0], item[1]);
                return new Promise((resolve, reject) => {
                    GyItsm.fetchData(bodyData).then(res => {
                        resolve({ ind: ind, week: item[2], data: res.rows });
                    }).catch((err) => reject(err))
                });
            })).then(ress => {
                // console.log(ress);
                var eleList = []
                var dataList = [];
                ress.forEach((res, ind) => {
                    var eventList = res.data || [];
                    var chartdiv = document.createElement('div');
                    chartdiv.style = "width:100%;height:500px;border:1px solid #333;margin-top:-1px;padding:10px 0;";
                    var chart = echarts.init(chartdiv);
                    var xAxisI = {
                        '西安整车': { total: 1, rows: [] },
                        '宝鸡整车': { total: 1, rows: [] },
                        '杭州湾整车': { total: 1, rows: [] },
                        '临海整车': { total: 1, rows: [] },
                        '湘潭整车': { total: 1, rows: [] },
                        '张家口整车': { total: 1, rows: [] },
                        'CMA余姚整车': { total: 1, rows: [] },
                        'PMA杭州湾': { total: 1, rows: [] },
                        '长兴整车': { total: 1, rows: [] },
                        '春晓整车': { total: 1, rows: [] },
                        '贵阳整车': { total: 1, rows: [] },
                        '晋中整车': { total: 1, rows: [] },
                        '钱塘整车': { total: 1, rows: [] },
                        'BMA成都': { total: 1, rows: [] },
                        'SPA梅山': { total: 1, rows: [] },
                    };
                    eventList.forEach((item, ind, arr) => {
                        // 事件发生地
                        var companyV = item['f11']
                        if (Object.keys(xAxisI).indexOf(companyV) === -1) {
                            xAxisI[companyV] = { total: 1 };
                            xAxisI[companyV].rows = [item];
                        } else {
                            xAxisI[companyV].total += 1;
                            xAxisI[companyV].rows.push(item);
                        }
                    });
                    // console.log(xAxisI);
                    Object.keys(xAxisI).forEach((item, ind, arr) => {
                        xAxisI[item].L1Support = GyItsm.getPercentData(xAxisI[item].rows);
                    })
                    ress[ind].formatData = xAxisI;
                    // var endData = Object.keys(xAxisI).map((item, ind, arr) => {
                    //     return { title: item, value: xAxisI[item] };
                    // });
                    // endData.sort((a, b) => b.value - a.value);
                    var option = {
                        title: {
                            text: "一线解决率横向对比",
                            subtext: res.week,
                            left: 'center'
                        },
                        xAxis: {
                            type: 'category',
                            data: Object.keys(xAxisI),
                            axisLabel: { interval: 0, rotate: 30 },
                        },
                        yAxis: {
                            type: 'value',
                            max: 100
                        },
                        series: [
                            {
                                data: Object.keys(xAxisI).map((item) => {
                                    if (xAxisI[item].hasOwnProperty("L1Support")) {

                                        var per = xAxisI[item].L1Support.one.percent;
                                        if (per < 80) {
                                            return {
                                                value: per,
                                                itemStyle: {
                                                    color: `rgba(84, 112, 198,0.5)`
                                                }
                                            }
                                        } else {
                                            return per;
                                        }
                                    } else {
                                        return 0;
                                    }
                                }),
                                type: 'bar',
                                showBackground: true,
                                backgroundStyle: {
                                    color: 'rgba(180, 180, 180, 0.2)'
                                },
                                label: {
                                    show: true,
                                    position: "top",
                                    formatter: "{c}%"
                                }
                            }
                        ]
                    }
                    chart.setOption(option);
                    GyItsm.charts.push(chart);
                    // elementList.push(chartdiv);
                    GyItsm.gyChartsEles.push(chartdiv);
                    eleList.push(chartdiv);
                })
                // console.log(ress);
                var chartdiv = document.createElement('div');
                chartdiv.style = "width:100%;height:500px;border:1px solid #333;margin-top:-1px;padding:10px 0;";
                var chart = echarts.init(chartdiv);
                // var endData = Object.keys(xAxisI).map((item, ind, arr) => {
                //     return { title: item, value: xAxisI[item] };
                // });
                // endData.sort((a, b) => b.value - a.value);
                var xAxisI = {
                    '西安整车': { total: 1, rows: [] },
                    '宝鸡整车': { total: 1, rows: [] },
                    '杭州湾整车': { total: 1, rows: [] },
                    '临海整车': { total: 1, rows: [] },
                    '湘潭整车': { total: 1, rows: [] },
                    '张家口整车': { total: 1, rows: [] },
                    'CMA余姚整车': { total: 1, rows: [] },
                    'PMA杭州湾': { total: 1, rows: [] },
                    '长兴整车': { total: 1, rows: [] },
                    '春晓整车': { total: 1, rows: [] },
                    '贵阳整车': { total: 1, rows: [] },
                    '晋中整车': { total: 1, rows: [] },
                    '钱塘整车': { total: 1, rows: [] },
                    'BMA成都': { total: 1, rows: [] },
                    'SPA梅山': { total: 1, rows: [] },
                };
                var option = option = {
                    title: {
                        text: '一线解决率各基地横向对比',
                        left: "center"
                    },
                    legend: {
                        bottom: "0"
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '10%',
                        containLabel: true
                    },
                    yAxis: {
                        type: 'value',
                        boundaryGap: [0, 0.01],
                        max: 100
                    },
                    xAxis: {
                        type: 'category',
                        data: Object.keys(xAxisI),
                        axisLabel: { interval: 0, rotate: 30 },
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    series: ress.map((item, ind) => {
                        return {
                            name: item.week,
                            type: "bar",
                            data: Object.keys(item.formatData).map((baseItem, ind, arr) => {
                                return item.formatData[baseItem].L1Support.one.percent
                            }),
                            color: `rgba(84, 112, 198,${1 - 0.25 * (ind)})`
                            // label: {
                            //     show: true,
                            //     position: "top",
                            //     formatter: "{c}%"
                            // }
                        }
                    })
                };
                console.log(option)
                chart.setOption(option);
                GyItsm.charts.push(chart);
                // elementList.push(chartdiv);
                GyItsm.gyChartsEles.push(chartdiv);
                eleList.push(chartdiv)
                GyItsm.openWindow(eleList);
            }).catch(err => {
                console.log("绘制一线解决率报表：", err);
            })

        },
        // 打开全屏弹窗,并加入[el,el]中所有的html元素 如果全局保存了这个弹窗,则直接增加
        // 清除所有echarts元素 需要使用 GyItsm.cleanWindow();
        openWindow(childElemeList) {
            if (GyItsm.myWindowElement.win !== null) {
                for (let elInd = 0; elInd < childElemeList.length; elInd++) {
                    const element = childElemeList[elInd];
                    GyItsm.myWindowElement.contentEl.appendChild(element);
                }
                return;
            }
            // 显示弹窗的小按钮
            var showBtn = document.createElement("div");
            var iconBase64 = 'data:image/png;base64,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'
            showBtn.style = "z-index:999;position:fixed;right:5px;top:30%;overflow:hidden;width:48px;height:48px;border-radius:8px;background:#f3f4fc url(" + iconBase64 + ") no-repeat center center;background-size:60% ;box-shadow:0 0 10px rgba(0,0,0,.6) inset;";
            // showBtn.innerText = "显示报表";
            showBtn.alt = "显示报表";
            showBtn.addEventListener("click", () => {
                box.hidden = false;
                GyItsm.charts.forEach((item) => {
                    item.resize();
                })
            })
            GyItsm.gyRootEles.push(showBtn);
            document.body.appendChild(showBtn);

            // 弹窗（遮罩层）
            var box = document.createElement('div');
            box.hidden = true;
            box.id = "GyDialog";
            box.style = "position:fixed;width:100%;height:100%;left:0;z-index:999999999;top:0;background:rgba(0,0,0,0.5)";
            GyItsm.gyRootEles.push(box);
            // 弹窗内容层主体
            var contentBox = document.createElement('div');
            contentBox.style = "overflow:hidden;position:absolute;width:90%;height:90%;left:50%;top:50%;transform:translate(-50%,-50%);background:#fefefe;border-radius:16px;padding-top:40px"

            box.appendChild(contentBox);
            // 弹窗关闭按钮
            var closeBtn = document.createElement('img');
            closeBtn.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAABaUlEQVRYR93ZS3LCMAwAUCkL7sF1YLoo5wCGoe0iHIAuyoJ2eo6yYOhx2nt0EXWcGZgQYluSTWxgmY/0kGOjGJwty3dAeMACph9vr9+QwWf+Uo6ogk8g2OPsqfwBoiEi/hWIk+1mfUhpXDyvxhXRFxENAPEXjRYq2JkDqZFNnLFAAY9oqtU+kaKSNkMNTI10FegETIX0jd4ZsG+kD2c8F8C+kBycFXhtJBfnBF4LKcF5gbGRUhwLGAupwbGBoUgtTgTUIkNwYqAUGYpTAbnIGDg10IeMhQsC2pDm+LGfi9G+df7USRrWix4OAGL2lsHAdiXrYYnYnd8/MOsh7pqt2UwS11KSfJnhADjXcFYL8SSRJJZca8OKgJqEmnuaWDYwJFHIvSxgSIJjNbQxvEBt4K5nShPLCdQE9M1MaUwrUBrIB2uel8S+vRd3ybeTVE37TN7O5lGflWtX05U7/w3M7LeAs99Ez/1viH/OQV/ireZxOwAAAABJRU5ErkJggg==";
            closeBtn.style = "width:20px;height:20px; position:absolute;right:10px;top:10px;"
            closeBtn.addEventListener("click", () => {
                // box.hidden = true;
                // box.remove();
                box.hidden = true;

            })
            contentBox.appendChild(closeBtn);
            // 弹窗标题
            var title = document.createElement('div');
            title.style = "width:auto;height:20px; position:absolute;left:50%;transform:translateX(-50%);top:10px;display:flex;align-items:center;justify-content:center;font-size:18px;color:#333"
            title.innerText = "ITSM图表工具"
            contentBox.append(title);
            var formEl = GyItsm.createForm();
            var formEl2 = GyItsm.createForm("1");
            contentBox.appendChild(formEl);
            contentBox.appendChild(formEl2);
            // 图表区域，下部分可滚动
            var tableContainer = document.createElement('div');
            tableContainer.style = "width:100%;height:100%;overflow-y:auto;box-sizing:content-box;";
            var tableBox = document.createElement('div');
            tableBox.style = "width:100%;height:auto;padding: 0px 10px 60px;box-sizing:border-box;";

            // tableBox.innerHTML = content;
            // tableBox.appendChild(childEleme);
            for (let elInd = 0; elInd < childElemeList.length; elInd++) {
                const element = childElemeList[elInd];
                tableBox.appendChild(element);
            }
            tableContainer.appendChild(tableBox);
            contentBox.appendChild(tableContainer);
            GyItsm.myWindowElement.win = box;
            GyItsm.myWindowElement.contentEl = tableBox;
            document.body.appendChild(box);

        },
        // 暂时不用
        parmasInputWindow(childElemeList = []) {
            // 弹窗（遮罩层）
            var box = document.createElement('div');
            box.id = "GyDialogSelecter";
            box.style = "position:fixed;width:100%;height:100%;left:0;z-index:9999999999;top:0;background:rgba(0,0,0,0.5)";
            // 弹窗内容层主体
            var contentBox = document.createElement('div');
            contentBox.style = "overflow:hidden;position:absolute;width:50%;height:50%;left:50%;top:50%;transform:translate(-50%,-50%);background:#fefefe;border-radius:16px;padding-top:40px"
            box.appendChild(contentBox);
            // 弹窗关闭按钮
            var closeBtn = document.createElement('img');
            closeBtn.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAABaUlEQVRYR93ZS3LCMAwAUCkL7sF1YLoo5wCGoe0iHIAuyoJ2eo6yYOhx2nt0EXWcGZgQYluSTWxgmY/0kGOjGJwty3dAeMACph9vr9+QwWf+Uo6ogk8g2OPsqfwBoiEi/hWIk+1mfUhpXDyvxhXRFxENAPEXjRYq2JkDqZFNnLFAAY9oqtU+kaKSNkMNTI10FegETIX0jd4ZsG+kD2c8F8C+kBycFXhtJBfnBF4LKcF5gbGRUhwLGAupwbGBoUgtTgTUIkNwYqAUGYpTAbnIGDg10IeMhQsC2pDm+LGfi9G+df7USRrWix4OAGL2lsHAdiXrYYnYnd8/MOsh7pqt2UwS11KSfJnhADjXcFYL8SSRJJZca8OKgJqEmnuaWDYwJFHIvSxgSIJjNbQxvEBt4K5nShPLCdQE9M1MaUwrUBrIB2uel8S+vRd3ybeTVE37TN7O5lGflWtX05U7/w3M7LeAs99Ez/1viH/OQV/ireZxOwAAAABJRU5ErkJggg==";
            closeBtn.style = "width:20px;height:20px; position:absolute;right:10px;top:10px;"
            closeBtn.addEventListener("click", () => {
                box.remove();

            })
            contentBox.appendChild(closeBtn);
            // 弹窗标题
            var title = document.createElement('div');
            title.style = "width:auto;height:20px; position:absolute;left:50%;transform:translateX(-50%);top:10px;display:flex;align-items:center;justify-content:center;font-size:18px;color:#333"
            title.innerText = "ITSM图表工具"
            contentBox.append(title);
            // 图表区域，下部分可滚动
            var tableBox = document.createElement('div');
            tableBox.style = "width:100%;height:100%;overflow-y:auto;padding: 0 10px;box-sizing:border-box;"
            // tableBox.innerHTML = content;
            // tableBox.appendChild(childEleme);
            for (let elInd = 0; elInd < childElemeList.length; elInd++) {
                const element = childElemeList[elInd];
                tableBox.appendChild(element);
            }
            contentBox.appendChild(tableBox);
            document.body.appendChild(box);
        },
        init: function () {
            // 将一个对象转成QueryString

            // 1.先将所有属性的 值  JSON.stringify(v);
            // 2.再将整个数据转为querystring
            // GyItsm.testParams();
            // GyItsm.temp1();
            if (location.href.indexOf('GeelyJumpCallback') == -1 && location.href.indexOf('SelectRole') == -1 && (location.href.indexOf('Default.aspx') !== -1 || location.href.indexOf('Modules') !== -1)) {

                var my_date = new Date();
                var first_date = new Date(my_date.getFullYear(), my_date.getMonth(), 1);
                var last_date = new Date(my_date.getFullYear(), my_date.getMonth() + 1, 0);
                GyItsm.getDataAndRander(first_date, last_date, '西安整车');
                // GyItsm.getDataAndRander(new Date('2022-04-01'), new Date('2022-04-30'), '西安整车');
                //    GyItsm.parmasInputWindow();
                // }else{
                //     setTimeout(GyItsm.init,3000);
                // }
            }

        },
    }
    if (window.frames.length != parent.frames.length) {
        return;
    }
    GyItsm.init();
    window.GyItsm = GyItsm;
})();



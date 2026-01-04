// ==UserScript==
// @name         FT analyz
// @namespace    http://tampermonkey.net/
// @version      2.1.0
// @description  分析足球数据，图形化展示赔率走势
// @author       Mr-SPM
// @match        *://op1.win007.com/oddslist/*
// @match        *://vip.win0168.com/1x2/oddslist/*
// @grant        none
// @require      https://cdn.bootcss.com/echarts/4.2.1/echarts.min.js
// @contributionURL            https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=your.email.here@412354742@qq.com&item_name=Greasy+Fork+donation
// contributionAmount  6.66
// @downloadURL https://update.greasyfork.org/scripts/388339/FT%20analyz.user.js
// @updateURL https://update.greasyfork.org/scripts/388339/FT%20analyz.meta.js
// ==/UserScript==
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
(function () {
    'use strict';
    // id映射
    // totosi 88664978
    // totosi.it 88635286
    // Libo 88726982
    // 365 88691319
    // william  88594327
    // pinnacle 88692817
    // 今年
    var year = new Date().getFullYear();
    var hasInit = false;
    // 创建按钮
    function createButton() {
        var button = document.createElement('button');
        button.onclick = function () {
            main();
        };
        button.style.position = 'absolute';
        button.style.left = '100px';
        button.style.top = '150px';
        button.style.color = 'red';
        button.innerHTML = '分析';
        button.style.zIndex = '2000';
        document.body.append(button);
    }
    // 获取数据
    function getData(game) {
        var obj = {};
        game.forEach(function (item) {
            var rs = item.split('|');
            obj[rs[2]] = rs[1];
        });
        // 获取odd
        var firstBC = game[0].split('|');
        window.odd = [firstBC[10], firstBC[11], firstBC[12]];
        window.re = firstBC[parseFloat(firstBC[16])] || 90;
        var totosi = getLatestTotosi(obj['TotoSi'], obj['Totosi.it']);
        window.time = new Date(totosi.time).toLocaleString();
        delete obj['TotoSi'];
        delete obj['Totosi.it'];
        return {
            totosi: totosi.rs
                ? totosi.rs[0]
                : {
                    key: getMatchTime(),
                    time: new Date(getMatchTime()).toLocaleString(),
                    odd: [0, 0, 0]
                },
            other: obj,
            time: totosi.time,
            totosiSum: totosi.totosis || []
        };
    }
    function getChange(key) {
        var changes = window.hsDetail.items(parseInt(key));
        if (!changes)
            return;
        return changes.split(';').map(function (item) {
            var temp = item.split('|');
            return {
                key: new Date(year + '-' + temp[3]).getTime(),
                time: year + '-' + temp[3],
                odd: [temp[0], temp[1], temp[2]]
            };
        });
    }
    var series = {
        1: [],
        x: [],
        2: []
    };
    var legendData = [];
    function setseries(obj, name, time, needArea) {
        if (needArea === void 0) { needArea = false; }
        var temp1 = {
            type: 'line',
            name: "" + name,
            data: []
        };
        var temp2 = {
            type: 'line',
            name: "" + name,
            data: []
        };
        var temp3 = {
            type: 'line',
            name: "" + name,
            data: []
        };
        if (needArea) {
            temp1.areaStyle = { origin: 'end' };
            temp2.areaStyle = { origin: 'end' };
            temp3.areaStyle = { origin: 'end' };
        }
        legendData.push(name);
        obj.forEach(function (item) {
            temp1.data.push([getTimeX(time, item.key), parseFloat(item.odd[0])]);
            temp2.data.push([getTimeX(time, item.key), parseFloat(item.odd[1])]);
            temp3.data.push([getTimeX(time, item.key), parseFloat(item.odd[2])]);
        });
        temp1.data = temp1.data.filter(function (item) {
            return item[0] <= 1440 / 2;
        });
        temp2.data = temp2.data.filter(function (item) {
            return item[0] <= 1440 / 2;
        });
        temp3.data = temp3.data.filter(function (item) {
            return item[0] <= 1440 / 2;
        });
        series[1].push(temp1);
        series['x'].push(temp2);
        series[2].push(temp3);
    }
    // 获取其他参数
    function getCloseOthers(data, time, odd) {
        var result = [];
        Object.keys(data).forEach(function (item) {
            var temp = {
                name: item,
                value: {},
                x: 0,
                oddx: []
            };
            var obj = getChange(data[item]);
            // setseries(obj, item, getMatchTime());
            for (var i = 0; i < obj.length; i++) {
                if (time - obj[i].key >= 0) {
                    temp.value = obj[i];
                    temp.x = Math.round((time - obj[i].key) / 1000);
                    // 获取差值
                    temp.oddx = [
                        (parseFloat(obj[i].odd[0]) - parseFloat(odd[0])).toFixed(2),
                        (parseFloat(obj[i].odd[1]) - parseFloat(odd[1])).toFixed(2),
                        (parseFloat(obj[i].odd[2]) - parseFloat(odd[2])).toFixed(2),
                    ];
                    break;
                }
            }
            result.push(temp);
        });
        return result.filter(function (item) {
            return !!item.oddx[0];
        });
    }
    /** 获取最新的比赛趋势 */
    function getLatestOthers(data, time) {
        var result = [];
        // totosi.forEach((t) => {
        Object.keys(data).forEach(function (item) {
            var obj = getChange(data[item]);
            setseries(obj, item, getMatchTime());
            // if (obj.length > 0) {
            //   result.push({
            //     name: item,
            //     x: Math.round((t[0].key - obj[0].key) / 1000),
            //     oddx: [
            //       (parseFloat(obj[0].odd[0]) - parseFloat(t[0].odd[0])).toFixed(2),
            //       (parseFloat(obj[0].odd[1]) - parseFloat(t[0].odd[1])).toFixed(2),
            //       (parseFloat(obj[0].odd[2]) - parseFloat(t[0].odd[2])).toFixed(2),
            //     ],
            //     value: obj[0],
            //   });
            // }
        });
        // });
        return result;
    }
    // 获取时间最近的TotoSi
    function getLatestTotosi(key1, key2) {
        var time = new Date().getTime();
        var rs;
        var totosi1 = getChange(key1);
        var totosi2 = getChange(key2);
        if (totosi1 && !totosi2) {
            time = new Date(totosi1[0].time).getTime();
            setseries(totosi1, 'totosi', getMatchTime(), true);
            rs = totosi1;
        }
        else if (!totosi1 && totosi2) {
            time = new Date(totosi2[0].time).getTime();
            setseries(totosi2, 'totosi', getMatchTime(), true);
            rs = totosi2;
        }
        else if (!totosi1 && !totosi2) {
            return {
                time: time,
                rs: null
            };
        }
        else if (new Date(totosi1[0].time).getTime() > new Date(totosi2[0].time).getTime()) {
            setseries(totosi1, 'totosi', getMatchTime(), true);
            setseries(totosi2, 'totosi.it', getMatchTime(), true);
            time = new Date(totosi1[0].time).getTime();
            rs = totosi1;
        }
        else {
            setseries(totosi1, 'totosi', getMatchTime(), true);
            setseries(totosi2, 'totosi.it', getMatchTime(), true);
            time = new Date(totosi2[0].time).getTime();
            rs = totosi2;
        }
        return {
            time: time,
            rs: rs,
            totosis: [totosi1, totosi2].filter(function (item) { return !!item; })
        };
    }
    function renderTotosi(totosi, time, others, latestOthers) {
        // 创建div
        var divDom = document.createElement('div');
        divDom.setAttribute('id', 'myData');
        divDom.style.backgroundColor = '#fff';
        var oddChange = forEachOdd();
        var divWithTitle = "<div style=\"position:absolute;left:10px;top:40px;z-index:2000;text-align:center;background-color:#fff;color:#1890ff;padding:10px;margin:10px;border-radius:5px;border: 1px solid #1890ff\">\n<h1>\u5206\u6790</h1>\n    <div style=\"font-size: 18px;text-align: left;\">sum: " + oddChange.sum + " win: " + oddChange.win + " draw: " + oddChange.draw + "  lose: " + oddChange.lose + "</div>\n    <div style=\"font-size: 18px;text-align: left;\">time: " + time + " </div>\n    <div style=\"font-size: 18px;text-align: left;color:#333;\">odd: " + window.odd[0] + "/" + window.odd[1] + "/" + window.odd[2] + "</div>\n    <div>\n      <label>Money:</label><input id=\"myMoney\" type=\"number\" value=\"" + (localStorage.getItem('my.money') || 300) + "\"/><button id=\"calculator\">\u8BA1\u7B97</button>   <button id=\"myBtn\">\u5173\u95ED</button>\n      <div id=\"pay\" style=\"height: 40px;line-height:40px;\"></div>\n    </div>\n    <p>\n      <input type=\"checkbox\" id=\"autoOpen\" " + (localStorage.getItem('autoOpen') ? 'checked' : '') + " />\n      <label>\u81EA\u52A8\u6253\u5F00</label>\n    </p>\n    <div id=\"main1\" style=\"width: 100%;height:300px;\"></div>\n    <div id=\"mainx\" style=\"width: 100%;height:300px;\"></div>\n    <div id=\"main2\" style=\"width: 100%;height:300px;\"></div>\n    <table style=\"background-color: #fff;\n    margin: 10px;\n    border: 1px solid;\n    border-radius: 5px;\n    padding: 0 10px;\n    font-size: 18px;\n\">\n        <thead style=\"height: 30px;\n        line-height: 30px;\">\n        <th width=\"60\">\u83E0\u83DC</th>\n            <th width=\"40\">1\u5DEE</th>\n            <th width=\"40\">x\u5DEE</th>\n            <th width=\"40\">2\u5DEE</th>\n            <th width=\"40\">1</th>\n            <th width=\"40\">x</th>\n            <th width=\"40\">2</th>\n            <th width=\"60\">\u65F6\u5DEE</th>\n            <th width=\"120\">\u65F6\u95F4</th>\n        </thead>\n        <tbody>\n        " + renderTable(others) + "\n        </tbody>\n    </table>\n    <table style=\"background-color: #fff;\n    margin: 10px;\n    border: 1px solid;\n    border-radius: 5px;\n    padding: 0 10px;\n    font-size: 18px;\n\">\n        <thead style=\"height: 30px;\n        line-height: 30px;\">\n        <th width=\"60\">\u83E0\u83DC</th>\n            <th width=\"40\">1\u5DEE</th>\n            <th width=\"40\">x\u5DEE</th>\n            <th width=\"40\">2\u5DEE</th>\n            <th width=\"40\">1</th>\n            <th width=\"40\">x</th>\n            <th width=\"40\">2</th>\n            <th width=\"60\">\u65F6\u5DEE</th>\n            <th width=\"120\">\u65F6\u95F4</th>\n        </thead>\n        <tbody>\n        " + renderTable(latestOthers) + "\n        </tbody>\n    </table>\n</div>";
        divDom.innerHTML = divWithTitle;
        document.body.append(divDom);
        document.getElementById('calculator').onclick = caculatorTZ;
        document.getElementById('myBtn').onclick = function () {
            document.getElementById('myData').style.display = 'none';
        };
        document.getElementById('autoOpen').onchange = function (e) {
            localStorage.setItem('autoOpen', e.target.checked ? 'true' : '');
        };
    }
    function caculatorTZ() {
        console.log('开始计算');
        var odd = window.odd;
        var money = parseFloat(document.getElementById('myMoney').value) || 300;
        document.getElementById('pay').innerHTML = "1:" + predict(money, window.re, parseFloat(odd[0]), 5, 1.33) + "\n x:" + predict(money, window.re, parseFloat(odd[1]), 5, 0.61) + "\n 2:" + predict(money, window.re, parseFloat(odd[2]), 5, 0.91);
    }
    // 计算
    function predict(sum, re, odd, rate, resultRate) {
        if (sum && re && odd) {
            var p = re / 100 / odd;
            return parseInt((((((odd + 1) * p - 1) / odd) * sum * rate * resultRate) / 5).toString());
        }
        else {
            return '数据错误，请重试！';
        }
    }
    function renderTable(data) {
        var tbody = '';
        var stat = {
            1: 0,
            x: 0,
            2: 0
        };
        data.forEach(function (item) {
            if (item.oddx[0] <= 0) {
                stat[1] += 1;
            }
            if (item.oddx[1] <= 0) {
                stat['x'] += 1;
            }
            if (item.oddx[2] <= 0) {
                stat[2] += 1;
            }
            tbody += "<tr style=\"padding: 5px;font-size:18px;\">\n      <td style=\"padding: 5px;font-size:18px;\">" + item.name + "</td>\n        <td style=\"font-size:18px;color:" + (item.oddx[0] > 0 ? '#44b549' : '#333') + "\">" + item.oddx[0] + "</td>\n        <td style=\"font-size:18px;color:" + (item.oddx[1] > 0 ? '#44b549' : '#333') + "\">" + item.oddx[1] + "</td>\n        <td style=\"font-size:18px;color:" + (item.oddx[2] > 0 ? '#44b549' : '#333') + "\" >" + item.oddx[2] + "</td>\n        <td style=\"padding: 5px;font-size:18px;\">" + item.value.odd[0] + "</td>\n        <td style=\"padding: 5px;font-size:18px;\">" + item.value.odd[1] + "</td>\n        <td style=\"padding: 5px;font-size:18px;\">" + item.value.odd[2] + "</td>\n        <td style=\"color:" + (item.x < 1800 ? 'red' : '#333') + "\">" + resultFormat(item.x) + "</td>\n        <td style=\"padding: 5px;font-size:18px;\">" + item.value.time + "</td>\n    </tr>";
        });
        var sum = "<tr style=\"font-weight: bold;\">\n    <td>\u5408\u8BA1</td>\n    <td>" + stat[1] + "\u6B21</td>\n    <td>" + stat['x'] + "\u6B21</td>\n    <td>" + stat[2] + "\u6B21</td>\n    <td>-</td>\n    <td>-</td>\n    <td>-</td>\n    <td>-</td>\n    <td>-</td>\n</tr>";
        return sum + tbody;
    }
    function resultFormat(result) {
        var h = Math.floor((result / 3600) % 24);
        var m = Math.floor((result / 60) % 60);
        if (h < 1) {
            return (result = m + '分钟');
        }
        else {
            return (result = h + '小时' + m + '分钟');
        }
    }
    function forEachOdd() {
        var odd = {
            win: 0,
            draw: 0,
            lose: 0,
            sum: 0
        };
        Object.keys(window.hsDetail._hash).forEach(function (item) {
            var temp = window.hsDetail._hash[item].replace(/;/g, '|').split('|');
            if (temp[7]) {
                odd.sum += 1;
                if (parseFloat(temp[7]) - parseFloat(temp[0]) > 0) {
                    odd.win += 1;
                }
                if (parseFloat(temp[8]) - parseFloat(temp[1]) > 0) {
                    odd.draw += 1;
                }
                if (parseFloat(temp[9]) - parseFloat(temp[2]) > 0) {
                    odd.lose += 1;
                }
            }
        });
        return odd;
    }
    function getTimeX(time, t) {
        return Math.round((time - t) / 60000);
    }
    function renderCharts() {
        // 基于准备好的dom，初始化echarts实例
        var myChart1 = echarts.init(document.getElementById('main1'));
        var myChartx = echarts.init(document.getElementById('mainx'));
        var myChart2 = echarts.init(document.getElementById('main2'));
        var baseOption = {
            title: {
                text: '走势',
                x: 'center'
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'value',
                min: 'dataMin',
                max: 'dataMax',
                inverse: true
            },
            yAxis: {
                type: 'value',
                min: 'dataMin',
                max: 'dataMax',
                inverse: true
            },
            series: [],
            legend: {
                top: 30,
                data: legendData
            }
        };
        // 指定图表的配置项和数据
        var option1 = __assign({}, baseOption, { title: { text: '走势1', x: 'center' }, series: series[1] });
        var optionx = __assign({}, baseOption, { title: { text: '走势x', x: 'center' }, series: series['x'] });
        var option2 = __assign({}, baseOption, { title: { text: '走势2', x: 'center' }, series: series[2] });
        // 使用刚指定的配置项和数据显示图表。
        myChart1.setOption(option1);
        myChartx.setOption(optionx);
        myChart2.setOption(option2);
    }
    //获取比赛时间
    function getMatchTime() {
        var temp = window.MatchTime.split(',');
        return (new Date(temp[0] + "-" + temp[1].substring(0, 2) + "-" + temp[2] + " " + temp[3] + ":" + temp[4]).getTime() + 28800000);
    }
    function setMyMoney() {
        document.getElementById('myMoney').onchange = function (e) {
            localStorage.setItem('my.money', e.target.value);
        };
    }
    function main() {
        if (hasInit) {
            document.getElementById('myData').style.display = 'block';
        }
        else {
            var value = getData(window.game);
            var others = getCloseOthers(value.other, value.time, window.odd);
            var latestOthers = getLatestOthers(value.other, value.time);
            renderTotosi(value.totosi, new Date(value.time).toLocaleString(), others, latestOthers);
            renderCharts();
            caculatorTZ();
            setMyMoney();
            hasInit = true;
        }
    }
    // function addCSS() {
    //   const link = document.createElement('link');
    //   link.href =
    //     'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css';
    //   link.rel = 'stylesheet'
    //   link.type ="text/css"
    //   document.getElementsByTagName('head')[0].appendChild(link);
    // }
    createButton();
    if (localStorage.getItem('autoOpen')) {
        main();
    }
    // addCSS();
})();

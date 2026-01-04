// ==UserScript==
// @name         FT Pre Winner
// @namespace    http://tampermonkey.net/
// @version      0.4.0
// @description  FT predict tool
// @author       Mr-SPM
// @match        *://zq.titan007.com/analysis/*
// @icon         https://www.google.com/s2/favicons?domain=netease.com
// @require      https://cdn.bootcdn.net/ajax/libs/react/18.2.0/umd/react.production.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js
// @require      https://cdn.bootcss.com/echarts/4.2.1/echarts.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428649/FT%20Pre%20Winner.user.js
// @updateURL https://update.greasyfork.org/scripts/428649/FT%20Pre%20Winner.meta.js
// ==/UserScript==
// 获取比分
function getScore(data) {
    return {
        all: [data[1], data[2]],
        half: [data[3], data[4]],
    };
}
function getAVG(data, length) {
    let s = 0;
    let f = 0;
    data.slice(0, length).forEach((item) => {
        s += item[8];
        f += item[9];
    });
    return {
        s: parseFloat((s / length).toFixed(2)),
        f: parseFloat((f / length).toFixed(2)),
    };
}
(function () {
    'use strict';
    //#region  添加react
    function addReact() {
        const root = document.createElement('div');
        root.id = 'myReact';
        root.style.position = 'absolute';
        root.style.zIndex = '2000';
        root.style.right = '0px';
        root.style.top = '60px';
        document.body.appendChild(root);
    }
    //#endregion
    // 计算
    function predict(sum, re, odd, rate, resultRate) {
        if (sum && re && odd) {
            var p = re / 100 / odd;
            return parseInt((((((odd + 1) * p - 1) / odd) * sum * rate * resultRate) / 5).toString());
        }
        else {
            return 0;
        }
    }
    function getPredict(data, price) {
        const sum = [0, 0, 0];
        data.forEach((item) => {
            sum[0] += parseFloat(item.kaili[0]);
            sum[1] += parseFloat(item.kaili[1]);
            sum[2] += parseFloat(item.kaili[2]);
        });
        return {
            avg: sum.map((item) => (item / data.length).toFixed(2)),
            first: data[0].kaili,
            odd: data[0].odd,
            predict: [
                predict(price, 96, parseFloat(data[0].odd[0]), 5, 1.33),
                predict(price, 96, parseFloat(data[0].odd[1]), 5, 0.61),
                predict(price, 96, parseFloat(data[0].odd[2]), 5, 0.91),
            ],
        };
    }
    function init(id, count, checked = true) {
        var data = [];
        var chks = $$_Our(id + '_l');
        switch (id) {
            case 'v':
                data = window.v_data;
                break;
            case 'hn':
            case 'h':
                data = window.h_data;
                break;
            case 'an':
            case 'a':
                data = window.a_data;
                break;
        }
        const newdata = [];
        for (var i = 0; i < data.length; i++) {
            if (id == 'v' &&
                checked &&
                (data[i][6] == window.h2h_home ||
                    data[i][5].toString().indexOf('(中)') != -1))
                continue;
            if (id == 'hn' &&
                checked &&
                (data[i][4] != window.h2h_home ||
                    data[i][5].toString().indexOf('(中)') != -1))
                continue;
            if (id == 'an' &&
                checked &&
                (data[i][6] != window.h2h_away ||
                    data[i][5].toString().indexOf('(中)') != -1))
                continue;
            var f1 = 0;
            for (var j = 0; j < chks.length; j++)
                if (data[i][1] == chks[j].id.substr(0, chks[j].id.indexOf('_')) &&
                    chks[j].checked == false) {
                    f1 = 1;
                    break;
                }
            if (f1 == 1)
                continue;
            newdata.push(data[i]);
        }
        return newdata;
    }
    function initOption(data, titie, isHost) {
        const option = {
            title: {
                text: titie,
                left: 'center',
            },
            tooltip: {
                trigger: 'axis',
            },
            xAxis: {
                type: 'category',
                data: data.map((item) => item[0]),
            },
            yAxis: {
                type: 'value',
                min: 'dataMin',
                max: 'dataMax',
            },
            series: [
                {
                    name: '进球',
                    type: 'line',
                    data: data.map((item) => item[isHost ? 8 : 9]),
                },
                {
                    name: '被进球',
                    type: 'line',
                    data: data.map((item) => -item[isHost ? 9 : 8]),
                },
                {
                    name: '净胜球',
                    type: 'line',
                    data: data.map((item) => isHost ? item[8] - item[9] : item[9] - item[8]),
                },
            ],
            legend: {
                top: 20,
                data: ['进球', '被进球', '净胜球'],
            },
        };
        return option;
    }
    const useState = React.useState;
    //#region
    const MyComponent = () => {
        const score = getScore(window.arrLeague);
        const [price, setPrice] = useState(localStorage.getItem('my.price') || '300');
        const renderCharts = (data) => {
            // 基于准备好的dom，初始化echarts实例
            var myChart1 = echarts.init(document.getElementById('main1'));
            var myChartx = echarts.init(document.getElementById('mainx'));
            const homeData = data.home.slice(0, 5).reverse();
            const guestData = data.guest.slice(0, 5).reverse();
            // 使用刚指定的配置项和数据显示图表。
            myChart1.setOption(initOption(homeData, window.hometeam, true));
            myChartx.setOption(initOption(guestData, window.guestteam, false));
        };
        const [showData, setShowData] = useState(true);
        const [matchCount, setMatchCount] = useState(localStorage.getItem('my.matchCount') || '5');
        const [data, setData] = useState();
        const [checked, setChecked] = useState(!localStorage.getItem('my.checked') || true);
        const [avgInfo, setAVGInfo] = useState({
            home: {
                s: 0,
                f: 0,
                x: '',
                realX: '',
            },
            guset: {
                s: 0,
                f: 0,
                x: '',
                realX: '',
            },
        });
        React.useEffect(() => {
            const obj = {
                home: init('hn', matchCount, true),
                guest: init('an', matchCount, true),
                vs: init('v', 5, false),
            };
            console.log(obj);
            const homeAVG = getAVG(obj.home, parseInt(matchCount));
            const guestAVG = getAVG(obj.guest, parseInt(matchCount));
            // 设置平均值
            setAVGInfo({
                home: {
                    ...homeAVG,
                    x: ((homeAVG.s + guestAVG.f) / 2).toFixed(2),
                    realX: ((homeAVG.s + guestAVG.s) / 2).toFixed(2),
                },
                guset: {
                    ...guestAVG,
                    x: ((homeAVG.f + guestAVG.s) / 2).toFixed(2),
                    realX: ((homeAVG.f + guestAVG.f) / 2).toFixed(2),
                },
            });
            setData(obj);
            renderCharts(obj);
        }, []);
        return (React.createElement("div", { style: {
                border: '1px solid #f2f2f2',
                width: 300,
                zIndex: 2,
                background: '#fff',
                overflow: 'auto',
                padding: 16,
            } },
            React.createElement("div", null,
                React.createElement("button", { style: {
                        height: 28,
                        minWidth: 80,
                        padding: 4,
                    }, onClick: () => setShowData(!showData) }, !showData ? 'Show' : 'Hide')),
            React.createElement("div", { style: { display: showData ? 'block' : 'none' } },
                React.createElement("h1", null, "\u6BD4\u5206"),
                React.createElement("div", { style: { color: 'red', fontSize: 24 } },
                    score.all[0],
                    " : ",
                    score.all[1]),
                React.createElement("div", null,
                    score.half[0],
                    " : ",
                    score.half[1])),
            React.createElement("div", { style: { display: showData ? 'block' : 'none' } },
                React.createElement("div", null,
                    React.createElement("h1", null, "\u9884\u6D4B\u6BD4\u5206"),
                    React.createElement("div", { style: { display: 'flex' } },
                        React.createElement("div", null,
                            window.hometeam,
                            React.createElement("p", null, avgInfo.home.s),
                            React.createElement("p", null, avgInfo.home.f),
                            React.createElement("p", { style: { color: 'red', fontSize: 18 } }, avgInfo.home.x),
                            React.createElement("p", { style: { color: 'burlywood', fontSize: 18 } }, avgInfo.home.realX)),
                        React.createElement("div", null,
                            window.guestteam,
                            React.createElement("p", null, avgInfo.guset.f),
                            React.createElement("p", null, avgInfo.guset.s),
                            React.createElement("p", { style: { color: 'red', fontSize: 18 } }, avgInfo.guset.x),
                            React.createElement("p", { style: { color: 'burlywood', fontSize: 18 } }, avgInfo.guset.realX)))),
                React.createElement("input", { value: matchCount, type: "number", onChange: (e) => {
                        setMatchCount(e.target.value);
                        localStorage.setItem('my.matchCount', e.target.value);
                    } }),
                React.createElement("input", { type: "checkbox", checked: checked, onChange: (e) => {
                        setChecked(e.target.checked);
                        localStorage.setItem('my.checked', e.target.checked ? '' : 'false');
                    } }),
                "\u540C\u4E3B\u5BA2",
                React.createElement("h1", null, "Charts"),
                React.createElement("div", { style: { display: 'flex' } },
                    React.createElement("div", { id: "main1", style: { width: '100%', height: 300 } }),
                    React.createElement("div", { id: "mainx", style: { width: '100%', height: 300 } })))));
    };
    //#endregion
    function main() {
        addReact();
        const root = document.querySelector('#myReact');
        ReactDOM.render(React.createElement(MyComponent, null), root);
    }
    main();
})();

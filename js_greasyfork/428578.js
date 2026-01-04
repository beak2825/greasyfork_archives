// ==UserScript==
// @name         FT Winner
// @namespace    http://tampermonkey.net/
// @version      6.6.6
// @description  FT predict tool
// @author       Mr-SPM
// @match        *://1x2.titan007.com/oddslist/*
// @match        *://op1.titan007.com/oddslist/*
// @icon         https://www.google.com/s2/favicons?domain=netease.com
// @require      https://cdn.bootcdn.net/ajax/libs/react/18.2.0/umd/react.production.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js
// @require      https://cdn.bootcss.com/echarts/4.2.1/echarts.min.js
// @grant        none
// @contributionURL            https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=your.email.here@412354742@qq.com&item_name=Greasy+Fork+donation
// @downloadURL https://update.greasyfork.org/scripts/428578/FT%20Winner.user.js
// @updateURL https://update.greasyfork.org/scripts/428578/FT%20Winner.meta.js
// ==/UserScript==
(function () {
    'use strict';
    //#region  添加react
    function addReact() {
        const root = document.createElement('div');
        root.id = 'myReact';
        root.style.position = 'absolute';
        root.style.zIndex = '2000';
        root.style.left = '0px';
        root.style.top = '60px';
        document.body.appendChild(root);
    }
    //#endregion
    //#region  全局变量
    const year = new Date().getFullYear();
    let hasInit = false;
    //#endregion
    function getMatchTime() {
        const temp = window.MatchTime.split(',');
        return (new Date(`${temp[0]}-${temp[1].substring(0, 2)}-${temp[2]} ${temp[3]}:${temp[4]}`).getTime() + 28800000);
    }
    // 获取时间差
    function getTimeX(time, t) {
        return Math.round((time - t) / 60000);
    }
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
    /** 触发排序，默认更改返还率排序 */
    function sortGame(number1 = 7, number2 = 9) {
        window.oderlist(number1, number2);
    }
    const useState = React.useState;
    //#region
    const MyComponent = (props) => {
        const [data, setData] = useState([]);
        const [timeX, setTimeX] = useState(localStorage.getItem('my.timeX') || 1440);
        const [maxOdds, setMaxOdds] = useState(localStorage.getItem('my.maxOdds') || 10);
        const [autoCheck, setAutoCheck] = useState(!!localStorage.getItem('my.autoCheck') || false);
        const [price, setPrice] = useState(localStorage.getItem('my.price') || '300');
        const [score, setScore] = useState(['0', '0']);
        const [predictInfo, setPredictInfo] = useState({
            avg: [],
            first: [],
            odd: [],
            predict: [],
        });
        const [chooseIndex, setChooseIndex] = useState(-1);
        const chartsKey = (localStorage.getItem('my.key') || 'odd');
        const echartsConfig = React.useRef({
            series: {
                1: [],
                x: [],
                2: [],
            },
            legendData: [],
        });
        const rightCount = localStorage.getItem('my.rightCount') || '0';
        const sumCount = localStorage.getItem('my.sumCount') || '0';
        const autoSetMoney = (data) => {
            if (autoCheck && props.matchTime + 7200000 < new Date().getTime()) {
                const x = parseInt(score[0]) - parseInt(score[1]);
                let i = 0;
                let temp = 100;
                data.avg.forEach((item, index) => {
                    if (temp > parseFloat(item)) {
                        i = index;
                        temp = parseFloat(item);
                    }
                });
                function isRight(x, index) {
                    switch (index) {
                        case 0:
                            return x > 0;
                        case 1:
                            return x === 0;
                        case 2:
                            return x < 0;
                        default:
                            return false;
                    }
                }
                const flag = isRight(x, i);
                if (flag) {
                    localStorage.setItem('my.rightCount', (Number(rightCount) + 1).toString());
                }
                localStorage.setItem('my.sumCount', (Number(sumCount) + 1).toString());
                calPrice(data.predict[i], flag, data.odd[i]);
                setChooseIndex(i);
                console.log('计算完成', i, flag);
            }
        };
        const getMatches = (matchTime, timeX = 30, maxOdds = 10) => {
            return window.game.slice(0, maxOdds).filter((item) => {
                const key = item?.split('|')[1];
                const changes = window.hsDetail.items(parseInt(key));
                const datas = changes?.split(';');
                const lastChange = datas[0];
                const dataInfo = lastChange?.split('|');
                if (getTimeX(matchTime, new Date(year + '-' + dataInfo[3]).getTime()) <
                    timeX) {
                    return true;
                }
                return false;
            });
        };
        /**
         * 获取变化列表
         * @param key 菠菜key
         * @param time 比赛时间
         * @param timeX 时间差
         * @returns
         */
        function getChange(key, time, timeX = 1440) {
            let changes = window.hsDetail.items(parseInt(key));
            const array = [];
            const datas = changes.split(';');
            for (let i = 0; i < datas.length; i++) {
                const temp = datas[i].split('|');
                const _time = new Date(year + '-' + temp[3]).getTime();
                const _timeX = getTimeX(time, _time);
                if (_timeX < timeX) {
                    const obj = {
                        key: _time,
                        time: year + '-' + temp[3],
                        timeX: _timeX,
                        odd: [temp[0], temp[1], temp[2]],
                        kaili: [temp[4], temp[5], temp[6]],
                    };
                    array.push(obj);
                }
            }
            return array;
        }
        const [showKaili, setShowKaili] = useState([]);
        const setKaili = (matchChanges) => {
            setShowKaili(matchChanges.map((item) => ({
                name: item.name,
                kaili: item.changes?.[0].kaili,
            })));
        };
        React.useEffect(() => {
            // 获取数据
            const getData = () => {
                const bcs = getMatches(props.matchTime, Number(timeX), Number(maxOdds)).map((item, index) => {
                    const rs = item.split('|');
                    const bc = {
                        id: rs[0],
                        name: window.getCompanyName(rs[0]),
                        hash: rs[1],
                        changes: getChange(rs[1], props.matchTime, Number(timeX)),
                    };
                    setseries(bc.changes, bc.name, index === 0 || bc.id === '177');
                    return bc;
                });
                setKaili(bcs);
                setData(bcs);
            };
            if (new Date().getTime() > props.matchTime + 7200000) {
                const scores = document.getElementsByClassName('score');
                setScore([scores[0].innerHTML, scores[1].innerHTML]);
            }
            getData();
            setTimeout(renderCharts, 0);
        }, [timeX, maxOdds]);
        React.useEffect(() => {
            if (data && data.length > 0) {
                const rs = getPredict(data[0].changes, parseFloat(price));
                setPredictInfo(rs);
                autoSetMoney(rs);
            }
        }, [data]);
        function setseries(obj, name, showArea = false) {
            const temp1 = {
                type: 'line',
                areaStyle: showArea ? {} : undefined,
                name: `${name}`,
                data: [],
            };
            const temp2 = {
                type: 'line',
                areaStyle: showArea ? {} : undefined,
                name: `${name}`,
                data: [],
            };
            const temp3 = {
                type: 'line',
                areaStyle: showArea ? {} : undefined,
                name: `${name}`,
                data: [],
            };
            // if (needArea) {
            //   temp1.areaStyle = { origin: 'end' };
            //   temp2.areaStyle = { origin: 'end' };
            //   temp3.areaStyle = { origin: 'end' };
            // }
            echartsConfig.current.legendData.push(name);
            obj.forEach(function (item) {
                temp1.data.push([item.timeX, parseFloat(item[chartsKey][0])]);
                temp2.data.push([item.timeX, parseFloat(item[chartsKey][1])]);
                temp3.data.push([item.timeX, parseFloat(item[chartsKey][2])]);
            });
            echartsConfig.current.series[1].push(temp1);
            echartsConfig.current.series['x'].push(temp2);
            echartsConfig.current.series[2].push(temp3);
        }
        const renderCharts = () => {
            // 基于准备好的dom，初始化echarts实例
            var myChart1 = echarts.init(document.getElementById('main1'));
            var myChartx = echarts.init(document.getElementById('mainx'));
            var myChart2 = echarts.init(document.getElementById('main2'));
            const baseOption = {
                title: {
                    text: '走势',
                    left: 'center',
                },
                tooltip: {
                    trigger: 'axis',
                },
                xAxis: {
                    type: 'value',
                    min: 'dataMin',
                    max: 'dataMax',
                    inverse: true,
                },
                yAxis: {
                    type: 'value',
                    min: 'dataMin',
                    max: 'dataMax',
                    inverse: true,
                },
                series: [],
                legend: {
                    top: 30,
                    data: echartsConfig.current.legendData,
                },
            };
            // 指定图表的配置项和数据
            const option1 = {
                ...baseOption,
                title: { text: '走势1', x: 'center' },
                series: echartsConfig.current.series[1],
            };
            const optionx = {
                ...baseOption,
                title: { text: '走势x', x: 'center' },
                series: echartsConfig.current.series['x'],
            };
            const option2 = {
                ...baseOption,
                title: { text: '走势2', x: 'center' },
                series: echartsConfig.current.series[2],
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart1.setOption(option1);
            myChartx.setOption(optionx);
            myChart2.setOption(option2);
        };
        const calPrice = (money, flag, odd = '1') => {
            let newPrice = '';
            if (flag) {
                newPrice = (parseFloat(price) +
                    money * (parseFloat(odd) - 1)).toFixed(2);
            }
            else {
                newPrice = (parseFloat(price) - money).toFixed(2);
            }
            setPrice(newPrice);
            localStorage.setItem('my.price', newPrice);
        };
        const [showData, setShowData] = useState(true);
        /** 重置正确率 */
        const resetRightRate = () => {
            localStorage.setItem('my.rightCount', '0');
            localStorage.setItem('my.sumCount', '0');
            location.reload();
        };
        //#region  图表类型
        const toggleCharts = () => {
            localStorage.setItem('my.key', chartsKey === 'odd' ? 'kaili' : 'odd');
            location.reload();
        };
        //#endregion
        React.useEffect(() => {
            localStorage.setItem('my.maxOdds', String(maxOdds));
        }, [maxOdds]);
        return (React.createElement("div", { style: {
                border: '1px solid #f2f2f2',
                width: 888,
                zIndex: 2,
                background: '#fff',
                overflow: 'auto',
                padding: 16,
            } },
            React.createElement("div", null,
                React.createElement("button", { onClick: () => setShowData(!showData) }, !showData ? 'Show' : 'Hide')),
            React.createElement("p", null,
                React.createElement("label", { htmlFor: "maxOdds" }, "\u83E0\u83DC\u6570\u91CF"),
                React.createElement("input", { type: "number", value: maxOdds, onChange: ({ target }) => {
                        setMaxOdds(target.value);
                        localStorage.setItem('my.maxOdds', target.value);
                    } }),
                React.createElement("button", { onClick: () => setMaxOdds(n => Number(n) + 1) }, "+"),
                React.createElement("button", { style: { marginLeft: 16 }, onClick: () => setMaxOdds(n => Number(n) - 1) }, "-")),
            React.createElement("div", null,
                score[0],
                " : ",
                score[1]),
            React.createElement("div", null,
                React.createElement("h2", null, "\u51EF\u5229"),
                showKaili.map((item) => (React.createElement("div", null,
                    React.createElement("span", { style: { width: 100, display: 'inline-block' } },
                        item.name,
                        ":"),
                    ' ',
                    item.kaili.map((info) => (React.createElement("span", { style: {
                            color: Number(info) > 1 ? 'red' : 'black',
                            marginLeft: 8,
                        } }, info))))))),
            React.createElement("div", { style: { display: showData ? 'block' : 'none' } },
                React.createElement("div", { style: { display: 'flex' } },
                    React.createElement("div", { id: "main1", style: { width: '100%', height: 300 } }),
                    React.createElement("div", { id: "mainx", style: { width: '100%', height: 300 } }),
                    React.createElement("div", { id: "main2", style: { width: '100%', height: 300 } })),
                React.createElement("div", null,
                    React.createElement("h1", { style: { display: 'flex', width: '100%' } },
                        "\u8BA1\u7B97",
                        React.createElement("div", { style: { flex: 1, textAlign: 'right' } },
                            React.createElement("input", { type: "checkbox", checked: autoCheck, onChange: (e) => {
                                    setAutoCheck(e.target.checked);
                                    localStorage.setItem('my.autoCheck', e.target.checked ? 'true' : '');
                                } }),
                            React.createElement("label", { htmlFor: "ck" }, "\u81EA\u52A8\u8BA1\u7B97"))),
                    React.createElement("div", null,
                        React.createElement("label", { htmlFor: "price" }, "Score"),
                        React.createElement("input", { type: "number", value: price, onChange: (e) => {
                                setPrice(e.target.value);
                                localStorage.setItem('my.price', e.target.value);
                            } })),
                    React.createElement("div", null,
                        React.createElement("h1", null, "Predict"),
                        React.createElement("h2", null,
                            "\u6B63\u786E\u7387\uFF1A",
                            ' ',
                            ((parseInt(rightCount) / parseInt(sumCount)) * 100).toFixed(2)),
                        React.createElement("div", null,
                            React.createElement("div", null,
                                React.createElement("div", { style: {
                                        display: 'flex',
                                        width: '100%',
                                        alignItems: 'center',
                                        borderBottom: '1px solid #f2f2f2',
                                    } },
                                    "avg:",
                                    ' ',
                                    predictInfo.avg.map((item) => (React.createElement("span", { style: { width: 30, margin: 8, flex: 1 } }, item)))),
                                React.createElement("div", { style: {
                                        display: 'flex',
                                        width: '100%',
                                        alignItems: 'center',
                                        borderBottom: '1px solid #f2f2f2',
                                    } },
                                    "first:",
                                    ' ',
                                    predictInfo.first.map((item) => (React.createElement("span", { style: { width: 30, margin: 8, flex: 1 } }, item)))),
                                React.createElement("div", { style: {
                                        display: 'flex',
                                        width: '100%',
                                        alignItems: 'center',
                                        borderBottom: '1px solid #f2f2f2',
                                    } },
                                    "odd:",
                                    ' ',
                                    predictInfo.odd.map((item) => (React.createElement("span", { style: { width: 30, margin: 8, flex: 1 } }, item)))),
                                React.createElement("div", { style: {
                                        display: 'flex',
                                        width: '100%',
                                        alignItems: 'center',
                                        borderBottom: '1px solid #f2f2f2',
                                    } },
                                    "predict:",
                                    ' ',
                                    predictInfo.predict.map((item, index) => (React.createElement("span", { style: {
                                            width: 30,
                                            margin: 8,
                                            color: chooseIndex === index ? 'red' : '#000',
                                            flex: 1,
                                        } },
                                        item,
                                        React.createElement("button", { style: { padding: 8, margin: 8 }, onClick: () => calPrice(item, true, predictInfo.odd[index]) }, "Right"),
                                        React.createElement("button", { style: { padding: 8, margin: 8 }, onClick: () => calPrice(item, false) }, "False"))))))))),
                React.createElement("div", null,
                    React.createElement("p", null,
                        React.createElement("label", { htmlFor: "timeX" }, "\u65F6\u95F4\u5DEE(h)"),
                        React.createElement("input", { type: "number", value: timeX, onChange: ({ target }) => {
                                setTimeX(target.value);
                                localStorage.setItem('my.timeX', target.value);
                            } })),
                    React.createElement("div", null,
                        React.createElement("button", { onClick: resetRightRate }, "\u91CD\u7F6E\u6B63\u786E\u7387"),
                        React.createElement("button", { onClick: toggleCharts },
                            "\u66F4\u6362\u56FE\u8868(",
                            chartsKey,
                            ")"))))));
    };
    //#endregion
    function main() {
        addReact();
        sortGame();
        sortGame();
        const root = document.querySelector('#myReact');
        ReactDOM.render(React.createElement(MyComponent, { matchTime: getMatchTime() }), root);
    }
    main();
})();

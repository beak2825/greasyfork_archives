// ==UserScript==
// @name         Multiple graph for solved.ac
// @version      0.1
// @description  solved.ac에서 차트를 여러 개 띄울 수 있게 해주는 유저스크립트
// @author       cgiosy
// @match        https://solved.ac/*
// @grant        none
// @namespace https://greasyfork.org/users/438284
// @downloadURL https://update.greasyfork.org/scripts/395644/Multiple%20graph%20for%20solvedac.user.js
// @updateURL https://update.greasyfork.org/scripts/395644/Multiple%20graph%20for%20solvedac.meta.js
// ==/UserScript==

function main() {
    const myId = location.href.split('/')[3];
    expLineChart.data.datasets[0].label = myId;
    rankLineChart.data.datasets[0].label = myId;
    const expDataMap = {
        [myId]: expLineChart.data.datasets[0]
    };
    const rankDataMap = {
        [myId]: rankLineChart.data.datasets[0]
    };

    const nextScoreFactor = 1.2;
    const getBackgroundRules = (score) => [
        {backgroundColor:"#222222", yAxisSegement: 0},
        {backgroundColor:"#999999", yAxisSegement: 10},
        {backgroundColor:"#c39466", yAxisSegement: 9600},
        {backgroundColor:"#cd9966", yAxisSegement: 20544},
        {backgroundColor:"#d89e66", yAxisSegement: 43532},
        {backgroundColor:"#e2a366", yAxisSegement: 88188},
        {backgroundColor:"#eca966", yAxisSegement: 168558},
        {backgroundColor:"#8a99a7", yAxisSegement: 302518},
        {backgroundColor:"#8e9faf", yAxisSegement: 500778},
        {backgroundColor:"#92a4b6", yAxisSegement: 790218},
        {backgroundColor:"#96aabd", yAxisSegement: 1207018},
        {backgroundColor:"#9ab0c5", yAxisSegement: 1798878},
        {backgroundColor:"#e5b966", yAxisSegement: 2834653},
        {backgroundColor:"#f3c266", yAxisSegement: 4274353},
        {backgroundColor:"#ffcb66", yAxisSegement: 6261153},
        {backgroundColor:"#ffd466", yAxisSegement: 8983078},
        {backgroundColor:"#ffde66", yAxisSegement: 12684878},
        {backgroundColor:"#7be0be", yAxisSegement: 18704018},
        {backgroundColor:"#7dedc8", yAxisSegement: 26829878},
        {backgroundColor:"#7ffbd2", yAxisSegement: 37759148},
        {backgroundColor:"#82ffdc", yAxisSegement: 52404368},
        {backgroundColor:"#84ffe5", yAxisSegement: 71955728},
        {backgroundColor:"#66c7ee", yAxisSegement: 106626808},
        {backgroundColor:"#66d2fd", yAxisSegement: 152565968},
        {backgroundColor:"#66dcff", yAxisSegement: 213205688},
        {backgroundColor:"#66e7ff", yAxisSegement: 292946928},
        {backgroundColor:"#66f2ff", yAxisSegement: 397407928},
        {backgroundColor:"#d87fa1", yAxisSegement: 567809928},
        {backgroundColor:"#e57fa6", yAxisSegement: 789332578},
        {backgroundColor:"#f27fab", yAxisSegement: 1076204378},
        {backgroundColor:"#ff7fb0", yAxisSegement: 1446268978},
        {backgroundColor:"#ff7fb5", yAxisSegement: 1e100}
    ]; //.filter(({ yAxisSegement }) => yAxisSegement <= score * nextScoreFactor);
    const getPage = (id) => fetch(`/${id}/overview`).then(res => res.text());
    const getData = (id) => getPage(id).then(html => ({
        expData: eval(html.match(/const expData = (\[.+?\]);/)[1]),
        rankData: eval(html.match(/const rankData = (\[.+?\]);/)[1])
    }));
    const updateData = async(id) => {
        const { expData, rankData } = await getData(id);
        expDataMap[id] = {
            label: id,
            data: expData,
            fill: false,
            lineTension: 0,
            backgroundColor: "#00c0ff",
            borderColor: "#666",
            pointBackgroundColor: "#00c0ff",
            pointBorderColor: "#666"
        };
        rankDataMap[id] = {
            label: id,
            data: rankData,
            fill: false,
            lineTension: 0,
            backgroundColor: "#00c0ff",
            borderColor: "#666",
            pointBackgroundColor: "#00c0ff",
            pointBorderColor: "#666"
        };
    };
    const getExpData = async(id) => {
        if(expDataMap[id] === undefined) await updateData(id);
        return expDataMap[id];
    };
    const getRankData = async(id) => {
        if(rankDataMap[id] === undefined) await updateData(id);
        return rankDataMap[id];
    };
    const addData = async(id) => {
        const expData = await getExpData(id);
        const rankData = await getRankData(id);
        expLineChart.data.datasets.push(expData);
        rankLineChart.data.datasets.push(rankData);

        const ticks = expLineChart.options.scales.yAxes[0].ticks;
        for(const { y } of expData.data) {
            ticks.max = Math.max(ticks.max, y * nextScoreFactor);
        }
    };
    window.updateCharts = (ids) => {
        ids = ids || [];
        ids.push(myId);
        ids = [...new Set(ids)];

        expLineChart.options.backgroundRules = getBackgroundRules();
        rankLineChart.options.backgroundRules = getBackgroundRules();
        expLineChart.options.hover = {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        };
        expLineChart.options.tooltips = {
            mode: 'nearest',
            axis: 'x',
            intersect: false,
            itemSort: (a, b, data) => b.yLabel - a.yLabel
        };
        expLineChart.options.scales.yAxes[0].ticks = {
            max: 0,
            min: 0,
            beginAtZero: true,
            callback: function(value, index, values) {
                return formatK(Math.floor(value));
            }
        };
        expLineChart.data.datasets = [];
        rankLineChart.data.datasets = [];
        Promise.all(ids.map(id => addData(id))).then(() => {
            //expLineChart.$plugins.descriptors[3].plugin.beforeDraw(expLineChart);
            //rankLineChart.$plugins.descriptors[3].plugin.beforeDraw(rankLineChart);
            expLineChart.update();
            rankLineChart.update();
        });
    };

    document.addEventListener('keypress', (e) => {
        if(e.key === 'c') {
            const arr = prompt('비교할 대상을 공백으로 구분하여 입력해 주세요.').trim().split(/ +/).map(x => x.replace(/[^a-zA-Z0-9]/g, ''));
            setTimeout(() => {
                updateCharts(arr);
            }, 100);
        }
    });
}

(function() {
    'use strict';

    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.appendChild(document.createTextNode('('+ main +')();'));
    document.body.appendChild(script);
})();
// ==UserScript==
// @name         带宽统计增强
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  增加对应的图表
// @author       易波
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=165.10
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461842/%E5%B8%A6%E5%AE%BD%E7%BB%9F%E8%AE%A1%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/461842/%E5%B8%A6%E5%AE%BD%E7%BB%9F%E8%AE%A1%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var ShowLatestDays = 7; // 显示最近多少天的数据
    var MaxAvgTimesw = 4; // Y轴限高
    var DebugOn = false; // 开启调试
    //---------------以下代码请勿修改-----------------
    var parentNode;
    var data = {}
    try{
        $('.panel-body script').each((i, x) => {
            var chartParams = JSON.parse(x.innerText.slice('echartsKmgV2('.length, -2))
            var panel = $(x).closest('.panel')
            var title = panel.find('>.panel-heading').text().split(' ')[0]
            data[title] = chartParams
            parentNode = panel.parent()
        })
    }catch(e){
        console.log("no chart yet");
        return
    }
    if(!Object.entries(data).length){
        console.log("no chart yet");
        return
    }
    if(!(data.UserCount && data.Bandwidth)){
        console.log("miss some chart");
        return
    }
    data.AvgBandwidth = {
        DomId: "chartAvgBandwidth",
        YMin: +Infinity,
        YMax: -Infinity,
        Data: [],
    }
    var YTotal = 0
    var YCnt = 0
    var sevenDaysAgo = +moment().subtract(3, 'days')
    data.UserCount.Data.forEach((item, idx) => {
        var bwItem = data.Bandwidth.Data[idx]
        if (item[0] < sevenDaysAgo) {
            return
        }
        if (item[0] == bwItem[0]) {
            var avgBw = bwItem[1] / item[1]
            if (avgBw == Infinity) {
                DebugOn && console.log(bwItem[1], item[1], "got Infinity")
            } else {
                // console.log(item[0], bwItem[1], item[1], avgBw)
                data.AvgBandwidth.Data.push([
                    item[0],
                    avgBw,
                ])
                if (data.AvgBandwidth.YMax < avgBw) {
                    data.AvgBandwidth.YMax = avgBw
                }
                if (data.AvgBandwidth.YMin > avgBw) {
                    data.AvgBandwidth.YMin = avgBw
                }
                YTotal += avgBw
                YCnt++
            }
        }
    });
    var YAvg = YTotal / YCnt
    if (data.AvgBandwidth.YMax > MaxAvgTimesw * YAvg) {
        data.AvgBandwidth.YMax = MaxAvgTimesw * YAvg
    }
    //console.log("YAvg", YTotal,YCnt, YAvg)
    parentNode.append(`<div class="panel panel-default">
<div class="panel-heading">AvgBandwidth</div>
<div class="panel-body">
    <div style="height:220px;overflow:hidden;">
        <div id="chartAvgBandwidth"  style="margin: 5px; width: 100%; height: 200px; -webkit-tap-highlight-color: transparent; user-select: none; position: relative;">

        </div>
    </div>
</div>
</div>`)
    DebugOn && console.log(data.AvgBandwidth)
    echartsKmgV2(data.AvgBandwidth)
    setTimeout(() => {
        var dom = document.getElementById('chartAvgBandwidth')
        var chart = echarts.getInstanceByDom(dom)
        window.zchart = chart
        DebugOn && console.log(chart)
        var option = chart.getOption()
        DebugOn && console.log(option)
        option.series[0].markLine = {
            lineStyle: {
                color: "#f00"
            },
            data: [{
                name: '报警预测值',
                yAxis: YAvg
            }],
        }
        option.markLine = null
        option.animation = true;
        console.log(option)
        // chart.setOption(option)
        chart.dispose()
        var newChart = echarts.init(dom)
        newChart.setOption(option)
        window.zchart = newChart
    }, 2000)
    // https://echarts.apache.org/en/api.html#echarts
})();
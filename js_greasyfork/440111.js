// ==UserScript==
// @name         gitee 统计
// @namespace    https://greasyfork.org/zh-CN/scripts/440111
// @version      0.0.5
// @description  为 gitee 贡献者列表添加扇形统计图
// @author       kj863257
// @include      *://gitee.com/*/contributors*
// @icon         https://gitee.com/assets/favicon.ico
// @grant        none
// @run-at       document-end
// @require      https://cdn.bootcdn.net/ajax/libs/echarts/5.3.0/echarts.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440111/gitee%20%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/440111/gitee%20%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('.ui.container>.git-user-twl-col').prepend('<div id="_charts" style="height:300px;"></div>');
    let arr = Array.from(document.querySelectorAll('.user-list-item')).map(e=>({name:e.querySelector('.username').innerText,value:e.querySelector('.sub-info').innerText.replace('Commits: ','')}))
    let option = {
        title: {
            text: '贡献比例',
            subtext: '',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
        },
        series: [
            {
                name: '提交数量',
                type: 'pie',
                radius: '50%',
                data: arr,
                label:{            //饼图图形上的文本标签
                    normal:{
                        show:true,
                        position:'outside', //标签的位置
                        formatter:'{b} {d}%'
                    }
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
    var chartDom = document.getElementById('_charts');
    var myChart = echarts.init(chartDom);
    myChart.setOption(option);
})();
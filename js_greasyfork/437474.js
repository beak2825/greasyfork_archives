// ==UserScript==
// @name         链海折线图
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  明年发大财!
// @author       Detom.Phong
// @match        https://www.hai.cn/*
// @icon         https://www.hai.cn/style/2018/img/linktoken.png
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js
// @downloadURL https://update.greasyfork.org/scripts/437474/%E9%93%BE%E6%B5%B7%E6%8A%98%E7%BA%BF%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/437474/%E9%93%BE%E6%B5%B7%E6%8A%98%E7%BA%BF%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 请求一个月的数据
    let date  = new Date();
    let year  = date.getFullYear();
    let month = date.getMonth() + 1;
    let day   = date.getDate();
    let from_date  = year.toString() + '-'+ (month-1).toString() + '-' + day.toString();
    let to_date    = year.toString() + '-'+ month.toString() + '-' + day.toString();

    // 添加折线图
    let form_title = from_date +' ~ '+ to_date;
    var newbox = $('<div class="wrapper mt10"><div class="m-box"><div class="hd noborder"><div class="box-header title">折线图 '+ form_title +'</div> <div class="hd"><canvas id="myChart"></canvas></div></div></div></div>');
    $('.wrapper.mt10').eq(4).before(newbox);


    let labels=[],count_sum =[],jd_count_sum=[];
    $.post('https://www.hai.cn/xrbox/date_count.html?v=' + year.toString() + month.toString() + day.toString(),{
        p: 1,
        enable: 1,
        pagenum: 200,
        from: from_date,
        to: to_date,
    },function(xrbox_res){
        xrbox_res = JSON.parse(xrbox_res);
        if(xrbox_res.code == 0){
            for(let index =0 ; index<xrbox_res.data.list.length; index++ ){
                let item = xrbox_res.data.list[index];
                labels.unshift(item.date);
                count_sum.unshift(item.sum);
            }
            // 京东云数据获取
            $.post('https://www.hai.cn/jd/datecount.html',{
                from: from_date,
                to: to_date,
            },function(jd_res){
                jd_res = JSON.parse(jd_res);
                if(jd_res.code == 0){
                    for(let index =0 ; index<jd_res.data.list.length; index++ ){
                        let item = jd_res.data.list[index];
                        let array_i = labels.indexOf(item.date);
                        if(array_i<0){
                            array_i = labels.push(item.date)-1;
                            count_sum.push(0);
                        }
                        jd_count_sum[ array_i ] = (item.sum/100);
                    }

                    console.log(labels);
                    console.log(count_sum);
                    console.log(jd_count_sum);
                    // 绘制折线图
                    var ctx = document.getElementById('myChart').getContext('2d');
                    var chart = new Chart(ctx, {
                        // 要创建的图表类型
                        type: 'line',

                        // 数据集
                        data: {
                            labels: labels,
                            datasets: [{
                                label: '网心云',
                                backgroundColor: 'rgba(249, 146, 0, 0.3)',
                                borderColor: 'rgb(249, 146, 0)',
                                tipColor: 'rgb(138, 155, 0)',
                                data: count_sum,
                            },{
                                label: '京东云',
                                backgroundColor: 'rgba(225, 37, 27, 0.3)',
                                borderColor: 'rgb(225, 37, 27)',
                                tipColor: 'rgb(155, 7, 0)',
                                data: jd_count_sum,
                            }],
                            borderWidth: 1
                        },

                        // 配置选项
                        options: {
                            hover: {
                                animationDuration: 0  // 防止鼠标移上去，数字闪烁
                            },
                            animation: {           // 这部分是数值显示的功能实现
                                onComplete: function () {
                                    var chartInstance = this.chart,
                                        ctx = chartInstance.ctx;
                                    // 以下属于canvas的属性（font、fillStyle、textAlign...）
                                    this.data.datasets.forEach(function (dataset, i) {
                                        var meta = chartInstance.controller.getDatasetMeta(i);

                                        ctx.font = Chart.helpers.fontString(14, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                                        ctx.fillStyle = dataset.tipColor;
                                        ctx.textAlign = 'center';
                                        ctx.textBaseline = 'bottom';
                                        console.log(dataset);
                                        meta.data.forEach(function (bar, index) {
                                            var data = dataset.data[index];
                                            ctx.fillText(data, bar._model.x, bar._model.y-5);
                                        });
                                    });
                                }
                            }
                        }
                    });
                }
            });

        }
    });
    // Your code here...
})();
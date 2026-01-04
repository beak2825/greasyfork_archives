// ==UserScript==
// @name         Bili-Timer
// @namespace    AntiO2
// @version      0.1.2
// @description  统计视频剩余时间
// @author       AntiO2
// @match        https://www.bilibili.com/video/*
// @icon         https://img.moegirl.org.cn/common/f/f5/Bilibili_Icon.svg
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-3.6.1.min.js
// @require      https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js
// @run-at       document-end
// @homepage     https://github.com/AntiO2
// @supportURL   https://github.com/AntiO2

// @downloadURL https://update.greasyfork.org/scripts/452106/Bili-Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/452106/Bili-Timer.meta.js
// ==/UserScript==

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports', 'echarts'], factory);
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        factory(exports, require('echarts'));
    } else {
        // Browser globals
        factory({}, root.echarts);
    }
}(this, function (exports, echarts) {
    var log = function (msg) {
        if (typeof console !== 'undefined') {
            console && console.error && console.error(msg);
        }
    };
    if (!echarts) {
        log('ECharts is not Loaded');
        return;
    }
    echarts.registerTheme('Bili', {
        "color": [
            "rgb(242,93,142)",
            "rgb(0,174,236)",
            "#626c91",
            "#a0a7e6",
            "#c4ebad",
            "rgb(0,174,236)"
        ],
        "backgroundColor": "rgba(255,255,255,0)",
        "textStyle": {},
        "title": {
            "textStyle": {
                "color": "#666666"
            },
            "subtextStyle": {
                "color": "#999999"
            }
        },
        "line": {
            "itemStyle": {
                "borderWidth": "2"
            },
            "lineStyle": {
                "width": "3"
            },
            "symbolSize": "8",
            "symbol": "emptyCircle",
            "smooth": false
        },
        "radar": {
            "itemStyle": {
                "borderWidth": "2"
            },
            "lineStyle": {
                "width": "3"
            },
            "symbolSize": "8",
            "symbol": "emptyCircle",
            "smooth": false
        },
        "bar": {
            "itemStyle": {
                "barBorderWidth": "0",
                "barBorderColor": "#ccc"
            }
        },
        "pie": {
            "itemStyle": {
                "borderWidth": "0",
                "borderColor": "#ccc"
            }
        },
        "scatter": {
            "itemStyle": {
                "borderWidth": "0",
                "borderColor": "#ccc"
            }
        },
        "boxplot": {
            "itemStyle": {
                "borderWidth": "0",
                "borderColor": "#ccc"
            }
        },
        "parallel": {
            "itemStyle": {
                "borderWidth": "0",
                "borderColor": "#ccc"
            }
        },
        "sankey": {
            "itemStyle": {
                "borderWidth": "0",
                "borderColor": "#ccc"
            }
        },
        "funnel": {
            "itemStyle": {
                "borderWidth": "0",
                "borderColor": "#ccc"
            }
        },
        "gauge": {
            "itemStyle": {
                "borderWidth": "0",
                "borderColor": "#ccc"
            }
        },
        "candlestick": {
            "itemStyle": {
                "color": "#e6a0d2",
                "color0": "transparent",
                "borderColor": "#e6a0d2",
                "borderColor0": "#3fb1e3",
                "borderWidth": "2"
            }
        },
        "graph": {
            "itemStyle": {
                "borderWidth": "0",
                "borderColor": "#ccc"
            },
            "lineStyle": {
                "width": "1",
                "color": "#cccccc"
            },
            "symbolSize": "8",
            "symbol": "emptyCircle",
            "smooth": false,
            "color": [
                "rgb(242,93,142)",
                "rgb(0,174,236)",
                "#626c91",
                "#a0a7e6",
                "#c4ebad",
                "rgb(0,174,236)"
            ],
            "label": {
                "color": "#ffffff"
            }
        },
        "map": {
            "itemStyle": {
                "areaColor": "#eeeeee",
                "borderColor": "#aaaaaa",
                "borderWidth": 0.5
            },
            "label": {
                "color": "#ffffff"
            },
            "emphasis": {
                "itemStyle": {
                    "areaColor": "rgba(63,177,227,0.25)",
                    "borderColor": "#3fb1e3",
                    "borderWidth": 1
                },
                "label": {
                    "color": "#3fb1e3"
                }
            }
        },
        "geo": {
            "itemStyle": {
                "areaColor": "#eeeeee",
                "borderColor": "#aaaaaa",
                "borderWidth": 0.5
            },
            "label": {
                "color": "#ffffff"
            },
            "emphasis": {
                "itemStyle": {
                    "areaColor": "rgba(63,177,227,0.25)",
                    "borderColor": "#3fb1e3",
                    "borderWidth": 1
                },
                "label": {
                    "color": "#3fb1e3"
                }
            }
        },
        "categoryAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#cccccc"
                }
            },
            "axisTick": {
                "show": false,
                "lineStyle": {
                    "color": "#333"
                }
            },
            "axisLabel": {
                "show": true,
                "color": "#999999"
            },
            "splitLine": {
                "show": true,
                "lineStyle": {
                    "color": [
                        "#eeeeee"
                    ]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.05)",
                        "rgba(200,200,200,0.02)"
                    ]
                }
            }
        },
        "valueAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#cccccc"
                }
            },
            "axisTick": {
                "show": false,
                "lineStyle": {
                    "color": "#333"
                }
            },
            "axisLabel": {
                "show": true,
                "color": "#999999"
            },
            "splitLine": {
                "show": true,
                "lineStyle": {
                    "color": [
                        "#eeeeee"
                    ]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.05)",
                        "rgba(200,200,200,0.02)"
                    ]
                }
            }
        },
        "logAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#cccccc"
                }
            },
            "axisTick": {
                "show": false,
                "lineStyle": {
                    "color": "#333"
                }
            },
            "axisLabel": {
                "show": true,
                "color": "#999999"
            },
            "splitLine": {
                "show": true,
                "lineStyle": {
                    "color": [
                        "#eeeeee"
                    ]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.05)",
                        "rgba(200,200,200,0.02)"
                    ]
                }
            }
        },
        "timeAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#cccccc"
                }
            },
            "axisTick": {
                "show": false,
                "lineStyle": {
                    "color": "#333"
                }
            },
            "axisLabel": {
                "show": true,
                "color": "#999999"
            },
            "splitLine": {
                "show": true,
                "lineStyle": {
                    "color": [
                        "#eeeeee"
                    ]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.05)",
                        "rgba(200,200,200,0.02)"
                    ]
                }
            }
        },
        "toolbox": {
            "iconStyle": {
                "borderColor": "#999999"
            },
            "emphasis": {
                "iconStyle": {
                    "borderColor": "#666666"
                }
            }
        },
        "legend": {
            "textStyle": {
                "color": "#999999"
            }
        },
        "tooltip": {
            "axisPointer": {
                "lineStyle": {
                    "color": "#cccccc",
                    "width": "0"
                },
                "crossStyle": {
                    "color": "#cccccc",
                    "width": "0"
                }
            }
        },
        "timeline": {
            "lineStyle": {
                "color": "#626c91",
                "width": 1
            },
            "itemStyle": {
                "color": "#626c91",
                "borderWidth": 1
            },
            "controlStyle": {
                "color": "#626c91",
                "borderColor": "#626c91",
                "borderWidth": 0.5
            },
            "checkpointStyle": {
                "color": "#3fb1e3",
                "borderColor": "#3fb1e3"
            },
            "label": {
                "color": "#626c91"
            },
            "emphasis": {
                "itemStyle": {
                    "color": "#626c91"
                },
                "controlStyle": {
                    "color": "#626c91",
                    "borderColor": "#626c91",
                    "borderWidth": 0.5
                },
                "label": {
                    "color": "#626c91"
                }
            }
        },
        "visualMap": {
            "color": [
                "#2a99c9",
                "#afe8ff"
            ]
        },
        "dataZoom": {
            "backgroundColor": "rgba(255,255,255,0)",
            "dataBackgroundColor": "rgba(222,222,222,1)",
            "fillerColor": "rgba(114,230,212,0.25)",
            "handleColor": "#cccccc",
            "handleSize": "100%",
            "textStyle": {
                "color": "#999999"
            }
        },
        "markPoint": {
            "label": {
                "color": "#ffffff"
            },
            "emphasis": {
                "label": {
                    "color": "#ffffff"
                }
            }
        }
    });
}));

(function () {

    'use strict';
    /**
     * 图表主题
     */



    /**
     * 结束图表
     */
    $(function () {
        var BiliTimer = {};// 脚本对象
        BiliTimer.setHTML = function () {
            //var vc = document.getElementsByClassName('.video-container-v1');
            var timer = $("<div class='bili-timer'>\
            <div id='bili-timer-box'>\
            <div id='bili-timer-chart-box'>\
            </div>\
            <div id='bili-timer-text'>视频进度</div>\
            <div id=\"bili-timer-icon\"><svg 'xmlns =\"http://www.w3.org/2000/svg\" width=\"60\" height=\"60\" fill=\"rgb(255,255,255)\" class=\"bi bi-clock-history\" viewBox=\"0 0 40 40\">\
            <path d=\"M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z\"/>\
            <path d=\"M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z\"/>\
            <path d=\"M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z\"/>\
            </svg ></div>\
            </div ></div > ");
            $('body').append(timer);

        };
        BiliTimer.setCSS = function () {
            // var timerCSS = "<style>.bili-timer{position:'fixed',left:'6px',bottom:'300px',zIndex:'100'}</style>";
            // $('header').after(timerCSS);

            $('.bili-timer').css({
                position: 'fixed', right: '6px', bottom: '356px', zIndex: '100'
            });


            $('#bili-timer-box').css({
                border: '1px solid #F1F2F3',
                boxSizing: 'border-box',
                borderRadius: '6px',
                width: '40px',
                height: '40px',
                marginBottom: '12px',
                cursor: 'pointer',
                color: 'var(--text1)',
                fill: 'var(--text1)',
                textAlign: 'center',
                backgroundColor: 'rgb(255,255,255)',
                padding: '8px 4px 4px',
                lineHeight: '14px',
                position: 'relative',
                transition: 'all 0.3s'
            });
            $('#bili-timer-chart-box').css({
                height: '300px',
                width: '400px',
                backgroundColor: '#f0f8ff',
                position: 'absolute',
                right: '40px',
                top: '0px',
                borderRadius: '10px',
                display: 'none',
                opacity: '0.95'
            });
            $('#bili-timer-icon').css({
                position: 'absolute',
                display: 'none',
                cursor: 'pointer',
                width: '100 %',
                height: '100 %',
                left: '7px',
                top: '7px'

            });

        };

        /**
         * 获取时间字符串
         * @param {*} sec 
         * @returns 
         */
        BiliTimer.getFormat = function (sec) {

            var h = parseInt(sec / 3600);
            var m = parseInt((sec % 3600) / 60);
            var s = sec % 60;
            if (h == 0)
                return m + "分" + s + "秒";
            else
                return h + "时" + m + "分" + s + "秒";
        }

        var BiliChart;
        /**
         * 设置图标数据
         * @param {*} prev 已观看时长
         * @param {*} remain  剩余时长
         */
        BiliTimer.setChart = function (prev, remain) {
            var option = {
                tooltip: {
                    trigger: 'item',
                    //设置图表显示字体
                    formatter: function (sec) {
                        return sec.data.name + "<br>" + BiliTimer.getFormat(sec.data.value);
                    }
                },
                legend: {
                    top: '5%',
                    left: 'center'
                },
                series: [
                    {
                        name: '观看进度',
                        type: 'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: true,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 3
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: false,
                                fontSize: '28',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            { value: prev, name: '已观看' },
                            { value: remain, name: '剩余时长' },
                        ]
                    }
                ]
            };
            BiliChart.setOption(option);
        }
        /**
         * 初始化图表
         */
        BiliTimer.initChart = function () {
            var chart = $("<div id=\"bili-timer-chart\"></div>");
            var num = $("<div id=\"bili-timer-num\"></div>");
            chart.css({ position: 'absolute', margin: '0', width: '400px', height: '300px', opacity: '1' });
            num.css({ textAlign: 'center', position: 'relative', margin: 'auto', width: '150px', height: '100px', top: '100px', textAlign: 'center' });
            num.html('<span>观看总进度</span><br><span>0%</span>');
            num.children().first().addClass("tip").css({ position: 'relative', top: '10%', fontSize: '18px', color: 'rgb(114,100,103)' });
            num.children().last().addClass("percentage").css({ position: 'relative', top: '25%', fontSize: '36px', fontWeight: '' });

            $('#bili-timer-chart-box').append(chart);
            $('#bili-timer-chart-box').append(num);
            var option = {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: '5%',
                    left: 'center'
                },
                series: [
                    {
                        name: '观看进度',
                        type: 'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: true,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 3
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: false,
                                fontSize: '28',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            { value: 0, name: '已观看' },
                            { value: 1, name: '剩余时长' },
                        ]
                    }
                ]
            };
            BiliChart = echarts.init(document.getElementById('bili-timer-chart'), 'Bili');
            BiliTimer.setChart(0, 1);
        }
        BiliTimer.setMouseFn = function () {
            BiliTimer.setMouseEnter = (function () {
                $('#bili-timer-box').on('mouseenter', function () {
                    $(this).css({ 'background-color': 'rgb(0,174,236)' });
                    $('#bili-timer-text').stop().fadeOut(300);
                    $('#bili-timer-icon').stop().fadeIn(300);
                    $('#bili-timer-chart-box').stop().fadeIn(300);
                });
            })();
            BiliTimer.setMouseOut = (function () {
                $('#bili-timer-box').on('mouseleave', function () {
                    $('#bili-timer-box').css({ 'background-color': 'rgb(255,255,255)' });
                    $('#bili-timer-text').stop().fadeIn(300);
                    $('#bili-timer-icon').stop().fadeOut(300);
                    $('#bili-timer-chart-box').stop().fadeOut(300);
                });
            })();
        }
        /**
         * 
         * @returns type 视频的类型
         */
        BiliTimer.checkType = function () {
            var type = 0;//单独视频

            if ($('.cur-list').length == 1) {
                type = 1;//分p视频
            }
            if ($('.video-pod__list').length == 1) {
                type = 2;//合集视频
            }
            return type;
        }

        /**
         * 
         * @param {string} 时间字符串 MM:SS 或者HH:MM:SS
         * @returns 时间 单位：sec
         */
        BiliTimer.getSec = function (str) {
            var time = str.split(':');
            var rem = 0;
            if (time.length == 2)
                rem += parseInt(time[0]) * 60 + parseInt(time[1]);
            else
                rem += parseInt(time[0]) * 3600 + parseInt(time[1]) * 60 + parseInt(time[2]);
            return rem;
        }

        /**
         * 
         * @param {*} type  视频的类型
         * @description 主函数
         */
        BiliTimer.countTime = function (type) {
            var currentVideo = function () {
                var current = $('.bpx-player-ctrl-time-label')//获取当前视频时长
                if (current.length == 1)
                    clearInterval(wait);
            }
            var wait = setInterval(currentVideo, 1000);


            /**
             * 
             * @param {*} type 视频类型
             * @returns obj{prev,remain} 分别是视频合集或分p除了当前视频，之前和之后的时间
             */
            var getMult = function (type) {
                var timeobj = {};
                timeobj.prev = 0;
                timeobj.remain = 0;
                var re = 0, pr = 0;
                if (type == 0) {
                    return timeobj;
                }
                if (type == 1) {
                    let flag = 1;
                    $(".right-container-inner").find('.list-box').children().each(function (index, now) {
                        var time_now = BiliTimer.getSec($(now).find('.duration').text());
                        if (flag == 1 && now.className.length != 0) {//当前正在观看   
                            flag = 0;

                        }
                        else {
                            if (flag == 1) {
                                pr += time_now;
                            }
                            else {
                                re += time_now;
                            }
                        }
                    })
                }
                if (type == 2) {
                    let flag = 1;
                    $(".right-container-inner").find('.video-pod__list').children().each(function (index, now) {
                        var time_now = BiliTimer.getSec($(now).find('.duration').text());
                        var watched = typeof($(now).attr('data-scrolled'))!='undefined';
                        if (watched) {//当前正在观看   
                            flag = 0;

                        }
                        else {
                            if (flag == 1) {
                                pr += time_now;
                            }
                            else {
                                re += time_now;
                            }
                        }
                    })
                }
                timeobj.prev = pr;
                timeobj.remain = re;
                return timeobj;
            }


            var timeobj = getMult(type);
            var prevTime = timeobj.prev;
            var remainTime = timeobj.remain;// 其他p剩下的时间

            //监听分p是否变化
            if (type == 1) {


                let observer = new MutationObserver(function () {
                    timeobj = getMult(type);
                    prevTime = timeobj.prev;
                    remainTime = timeobj.remain;
                });
                const config = { attributes: true, childList: true, subtree: true };
                observer.observe($(".right-container-inner").find('.list-box')[0], config);
            }
            /**------------------------------------------------------ */

            //监听合集是否变化  
            if (type == 2) {

                let observer = new MutationObserver(function () {

                    timeobj = getMult(type);
                    prevTime = timeobj.prev;
                    remainTime = timeobj.remain;
                });
                const config = { attributes: true, childList: true, subtree: true };
                observer.observe($(".right-container-inner").find('.video-pod__list')[0], config);
            }
            /**---------------------------------------------------------- */

            var countPast = function () {
                var current = $('.bpx-player-ctrl-time-label');
                var pastTime = BiliTimer.getSec(current.children(":first").text());//正在播放的单个视频已播放时间
                if (isNaN(pastTime)) pastTime = 0;
                var nowlength = BiliTimer.getSec(current.children().last().text());//正在播放的单个视频时间
                nowlength = isNaN(nowlength) ? 0 : nowlength;
                pastTime = isNaN(pastTime) ? 0 : pastTime;
                var totremain = nowlength + remainTime - pastTime;//剩余的总时间
                var totprev = prevTime + pastTime;//已播放时间
                var totTime = totremain + totprev;//总时间
                totprev = isNaN(totprev) ? 0 : totprev;
                totTime = isNaN(totTime) ? 1 : totTime;
                totremain = isNaN(totremain) ? 1 : totremain;
                BiliTimer.setChart(totprev, totremain);

                //设置百分比
                var percent;

                if (totprev == totTime)
                    percent = 100;
                else {
                    if (totprev == 0) {
                        percent = 0;
                    }
                    else
                        percent = ((totprev / totTime) * 100).toFixed(2);
                }
                $("#bili-timer-num").find(".percentage").text(percent + '%');

            }
            var update = setInterval(countPast, 1000);
        }
        BiliTimer.setHTML();
        BiliTimer.setCSS();
        BiliTimer.initChart();
        BiliTimer.setMouseFn();
        BiliTimer.countTime(BiliTimer.checkType());
    });
})();

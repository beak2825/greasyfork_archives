// ==UserScript==
// @name         CF解题数据可视化
// @name:en      codeforces analytics
// @namespace    https://codeforces.com/profile/tongwentao
// @version      1.7.0
// @description  显示某人Codeforces每个难度过了多少题，每个标签占比，喜欢用什么语言过题，有什么题试过了但是没有通过。
// @description:en Analyse Codeforces profiles
// @author       tongwentao
// @match        https://codeforces.com/profile/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM.xmlHttpRequest
// @connect      greasyfork.org
// @require https://cdn.jsdelivr.net/npm/echarts@5.4.2/dist/echarts.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465176/CF%E8%A7%A3%E9%A2%98%E6%95%B0%E6%8D%AE%E5%8F%AF%E8%A7%86%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/465176/CF%E8%A7%A3%E9%A2%98%E6%95%B0%E6%8D%AE%E5%8F%AF%E8%A7%86%E5%8C%96.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    function drawChart(res) {
        drawRatingChart(res);
        drawTagsChart(res);
        drawLangChart(res);
        drawUnsolvedChart(res);
    }
 
    function drawRatingChart(res) {
        var div = '<div class="roundbox userActivityRoundBox borderTopRound borderBottomRound" id="ratingChart" style="height:400px;padding:2em 1em 0 1em;margin-top:1em;"></div>';
        document.getElementById('pageContent').insertAdjacentHTML('beforeend', div);
        var chartDom = document.getElementById('ratingChart');
        var myChart = echarts.init(chartDom);
        var option;
        var key;
        window.addEventListener('resize', function () {
            myChart.resize();
        });
        var xData = [];
        var yData = [];
        xData = Object.keys(res.rating);
        for (key in xData) {
            yData.push(res.rating[xData[key]]);
        }
        option = {
            title: {
                text: 'Problem Ratings',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                data: xData,
                axisTick: {
                    alignWithLabel: true
                }
            }],
            yAxis: [{
                type: 'value'
            }],
            series: [{
                name: 'solved',
                type: 'bar',
                barWidth: '60%',
                data: yData.map((value, index) => ({
                    value: value,
                    itemStyle: {
                        color: xData[index] >= 3000 ? '#aa0100' :
                            xData[index] >= 2600 ? '#ff3333' :
                                xData[index] >= 2400 ? '#ff7777' :
                                    xData[index] >= 2300 ? '#ffbb55' :
                                        xData[index] >= 2100 ? '#ffcc87' :
                                            xData[index] >= 1900 ? '#ff88ff' :
                                                xData[index] >= 1600 ? '#aaaaff' :
                                                    xData[index] >= 1400 ? '#76ddbb' :
                                                        xData[index] >= 1200 ? '#76ff77' :
                                                            '#cccccc'
                    }
                }))
            }]
        };
 
 
        option && myChart.setOption(option);
 
    }
 
    function drawTagsChart(res) {
 
        var div = '<div class="roundbox userActivityRoundBox borderTopRound borderBottomRound" id="tagsChart" style="height:400px;padding:2em 1em 0 1em;margin-top:1em;"></div>';
        document.getElementById('pageContent').insertAdjacentHTML('beforeend', div);
        var chartDom = document.getElementById('tagsChart');
        var myChart = echarts.init(chartDom);
        var option;
        var data1 = [];
        var key;
        window.addEventListener('resize', function () {
            myChart.resize();
        });
        for (key in res.tags) {
            var tag = res.tags[key];
            data1.push({value: tag, name: key});
        }
        data1.sort(function (nextValue, currentValue) {
            if (nextValue.value < currentValue.value) return 1; else if (nextValue.value > currentValue.value) return -1;
            return 0;
        });
        var data2 = [];
        for (key in data1) {
            data2.push(data1[key].name);
        }
        option = {
            title: {
                text: 'Tags Solved', left: 'center'
            }, tooltip: {
                trigger: 'item', formatter: '{a} <br/>{b} : {c} ({d}%)'
            }, legend: {
                type: 'scroll',
                orient: 'vertical',
                right: 10,
                top: 20,
                bottom: 20,
                data: data2,
                formatter: function (name) {
                    let singleData = option.series[0].data.filter(function (item) {
                        return item.name == name
                    })
                    return name + ' : ' + singleData[0].value;
                },
            }, series: [{
                name: 'tag', type: 'pie', radius: '55%', center: ['40%', '50%'], data: data1, emphasis: {
                    itemStyle: {
                        shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };
 
        option && myChart.setOption(option);
    }
 
    function drawLangChart(res) {
        var div = '<div class="roundbox userActivityRoundBox borderTopRound borderBottomRound" id="langChart" style="height:400px;padding:2em 1em 0 1em;margin-top:1em;"></div>';
        document.getElementById('pageContent').insertAdjacentHTML('beforeend', div);
        var chartDom = document.getElementById('langChart');
        var myChart = echarts.init(chartDom);
        var option;
        var data1 = [];
        var key;
        window.addEventListener('resize', function () {
            myChart.resize();
        });
        for (key in res.lang) {
            var lang = res.lang[key];
            data1.push({value: lang, name: key});
        }
        data1.sort(function (nextValue, currentValue) {
            if (nextValue.value < currentValue.value) return 1; else if (nextValue.value > currentValue.value) return -1;
            return 0;
        });
        var data2 = [];
        for (key in data1) {
            data2.push(data1[key].name);
        }
        option = {
            title: {
                text: 'Programming Language', left: 'center'
            }, tooltip: {
                trigger: 'item', formatter: '{a} <br/>{b} : {c} ({d}%)'
            }, legend: {
                type: 'scroll',
                orient: 'vertical',
                right: 10,
                top: 20,
                bottom: 20,
                data: data2,
                formatter: function (name) {
                    let singleData = option.series[0].data.filter(function (item) {
                        return item.name == name
                    })
                    return name + ' : ' + singleData[0].value;
                },
            }, series: [{
                name: 'lang', type: 'pie', radius: '55%', center: ['40%', '50%'], data: data1, emphasis: {
                    itemStyle: {
                        shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };
 
        option && myChart.setOption(option);
    }
 
    function drawUnsolvedChart(res) {
        // 创建容器 div
        var div = '<div class="roundbox userActivityRoundBox borderTopRound borderBottomRound" id="unsolvedChart" style="padding: 1em; margin-top: 1em;"></div>';
        document.getElementById('pageContent').insertAdjacentHTML('beforeend', div);
 
        // 设置标题样式
        var header = `<h4 style="font-size: 1.2em; color: #333; font-weight: bold; margin-bottom: 0.5em;">Unsolved Problems (total: ${Object.keys(res.unsolved).length})</h4>`;
        document.getElementById('unsolvedChart').insertAdjacentHTML('beforeend', header);
 
        // 设置列表容器样式
        var listContainer = '<div style="display: flex; flex-wrap: wrap; gap: 10px;"></div>';
        document.getElementById('unsolvedChart').insertAdjacentHTML('beforeend', listContainer);
 
        // 逐个添加未解决的问题链接
        var unsolvedDiv = document.getElementById('unsolvedChart').lastChild;
        var key, contestId, problemIndex, problemLink;
        for (key in res.unsolved) {
            contestId = res.unsolved[key].contestId;
            problemIndex = res.unsolved[key].problemIndex;
 
            // 根据 contestId 判断链接类型（正常题目 or gym 题目）
            if (contestId < 10000) {
                problemLink = `<a href="https://codeforces.com/problemset/problem/${contestId}/${problemIndex}" target="_blank" style="text-decoration: none; color: #0073e6; padding: 0.3em 0.6em; border-radius: 5px; border: 1px solid #0073e6; font-size: 0.9em;">${key}</a>`;
            } else {
                problemLink = `<a href="https://codeforces.com/problemset/gymProblem/${contestId}/${problemIndex}" target="_blank" style="text-decoration: none; color: #0073e6; padding: 0.3em 0.6em; border-radius: 5px; border: 1px solid #0073e6; font-size: 0.9em;">${key}</a>`;
            }
            unsolvedDiv.insertAdjacentHTML('beforeend', problemLink);
        }
    }
    function checkVersion(){
        const currentVersion = GM_info.script.version;
        console.log('currentVersion:', currentVersion);
        GM.xmlHttpRequest({
            method: "GET",
            url: 'https://greasyfork.org/zh-CN/scripts/465176-cf%E8%A7%A3%E9%A2%98%E6%95%B0%E6%8D%AE%E5%8F%AF%E8%A7%86%E5%8C%96',
            headers: {
                "Accept": "*/*",
                "Accept-Language": "zh-CN,zh;q=0.9",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive",
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0",
            },
            onload: async function(response) {
                // 处理响应数据
                const html = response.responseText;
                // console.log('响应数据:', html);
                const regex = /data-ping-url="([^"]+)"[^>]*data-ip-address="([^"]+)"[^>]*data-script-id="([^"]+)"[^>]*data-ping-key="([^"]+)"[^>]*data-script-version="([^"]+)"/;
                const res = html.match(regex);
                // console.log(res);
                if(res == null||res.length < 6){
                    return;
                }
                const pingUrl = res[1];
                const ipAddress = res[2];
                const scriptId = res[3];
                let pingKey = res[4];
                const scriptVersion = res[5];
                pingKey = ipAddress + scriptId + pingKey
                // console.log("pingKey:"+pingKey)
                const encoder = new TextEncoder();
                const digest = await crypto.subtle.digest('SHA-1', encoder.encode(pingKey));
                pingKey = Array.from(new Uint8Array(digest))
                    .map(b => b.toString(16).padStart(2, '0'))
                    .join('');
                
                // console.log("pingKey:"+pingKey)
                // const authenticityToken = html.match(/<meta\b[^>]*?\bname\s*=\s*["']csrf-token["'][^>]*?\bcontent\s*=\s*["'](.*?)["']/i)[1];
                // console.log("authenticityToken:"+authenticityToken)
                GM.xmlHttpRequest({
                    method: "POST",
                    url: "https://greasyfork.org" + pingUrl +"?mo=3&ping_key=" + pingKey,
                    headers: {
                        "Accept": "*/*",
                        "Accept-Language": "zh-CN,zh;q=0.9",
                        "Accept-Encoding": "gzip, deflate, br",
                        "Connection": "keep-alive",
                        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0",
                    },
                    onload: function(res) {
                        if(currentVersion==scriptVersion){
                            console.log('The current version is the latest');
                        }else{
                            console.log('The current version is not the latest');
                        }
                    },
                    onerror: function(error) {
                    }
                })
            },
            onerror: function(error) {
            }
        });
    }
 
    var pathname = window.location.pathname;
    var handle = pathname.substring(pathname.lastIndexOf('/') + 1, pathname.length);
    var httpRequest = new XMLHttpRequest();
 
// 添加加载动画
    var loadingDiv = `<div id="loadingAnimation" style="
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: Arial, sans-serif;
  font-size: 1.5em;
  color: #ffffff;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  backdrop-filter: blur(8px);
  padding: 20px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.6);">
  <div class="spinner" style="
    width: 60px;
    height: 60px;
    border: 6px solid transparent;
    border-top: 6px solid #0073e6;
    border-radius: 50%;
    animation: spin 1.5s linear infinite, gradient 3s linear infinite;">
  </div>
  <div class="loadingText" style="
    font-weight: 600;
    background: linear-gradient(90deg, #0073e6, #00c6ff, #0073e6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: glow 2s ease-in-out infinite;">
    Loading Codeforces Analytics...
  </div>
  <button id="closeButton" style="
    margin-top: 10px;
    padding: 8px 15px;
    font-size: 0.9em;
    font-weight: 600;
    color: #ffffff;
    background: #ff4d4d;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;">
    Close
  </button>
</div>
 
<style>
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
 
  @keyframes gradient {
    0% { border-top-color: #0073e6; }
    50% { border-top-color: #00c6ff; }
    100% { border-top-color: #0073e6; }
  }
 
  @keyframes glow {
    0%, 100% { text-shadow: 0 0 10px #0073e6, 0 0 20px #00c6ff; }
    50% { text-shadow: 0 0 20px #00c6ff, 0 0 40px #00c6ff; }
  }
 
  #closeButton:hover {
    background: #ff1a1a;
  }
</style>
 
`;
    document.body.insertAdjacentHTML('beforeend', loadingDiv);
// 获取关闭按钮并添加点击事件
    document.getElementById("closeButton").addEventListener("click", function () {
        const loadingAnimation = document.getElementById("loadingAnimation");
        loadingAnimation.style.display = "none"; // 隐藏动画
    });
    httpRequest.open('GET', 'https://codeforces.com/api/user.status?handle=' + handle, true);
    httpRequest.send();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4) {
            // 移除加载动画
            var loadingElem = document.getElementById('loadingAnimation');
            if (loadingElem) {
                loadingElem.remove();
            }
 
            if (httpRequest.status == 200) {
                var json = JSON.parse(httpRequest.responseText);
                var result = json.result;
                var res = {rating: {}, tags: {}, lang: {}, unsolved: {}};
                var solved = {};
                var key;
                var contestId;
                var problemIndex;
                var problemId;
                for (key in result) {
                    if (result[key].verdict === "OK") {
                        var rating = result[key].problem.rating;
                        var tags = result[key].problem.tags;
                        var lang = result[key].programmingLanguage;
                        if (rating in res.rating) {
                            res.rating[rating]++;
                        } else {
                            res.rating[rating] = 1;
                        }
                        for (var key2 in tags) {
                            var tag = tags[key2];
                            if (tag in res.tags) {
                                res.tags[tag]++;
                            } else {
                                res.tags[tag] = 1;
                            }
                        }
                        if (lang in res.lang) {
                            res.lang[lang]++;
                        } else {
                            res.lang[lang] = 1;
                        }
                        contestId = result[key].problem.contestId;
                        problemIndex = result[key].problem.index;
                        problemId = contestId + problemIndex;
                        if (!(problemId in solved)) {
                            solved[problemId] = {contestId: contestId, problemIndex: problemIndex};
                        }
                    }
                }
                for (key in result) {
                    if (result[key].verdict !== "OK") {
                        contestId = result[key].problem.contestId;
                        problemIndex = result[key].problem.index;
                        problemId = contestId + problemIndex;
                        if (!(problemId in solved)) {
                            res.unsolved[problemId] = {contestId: contestId, problemIndex: problemIndex};
                        }
                    }
                }
                console.log(res);
                drawChart(res);
            }
        }
    };
    checkVersion();
 
 
})();
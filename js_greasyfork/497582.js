// ==UserScript==
// @name         Steam评论时长过滤
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  动态过滤掉Steam评论页面上游玩时长小于指定小时数和指定字数的评论并显示直方图
// @author       akira0245, gpt4o
// @match        https://steamcommunity.com/app/*/reviews/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js
// @license      gplv3
// @downloadURL https://update.greasyfork.org/scripts/497582/Steam%E8%AF%84%E8%AE%BA%E6%97%B6%E9%95%BF%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/497582/Steam%E8%AF%84%E8%AE%BA%E6%97%B6%E9%95%BF%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定时检测滚动位置，并调用 CheckForMoreContent
    setInterval(function() {
        if(filterSwitch.checked)
            CheckForMoreContent();
    }, 100);

    // 创建总容器
    const mainContainer = document.createElement('div');
    mainContainer.style.position = 'fixed';
    mainContainer.style.top = '10px';
    mainContainer.style.right = '10px';
    mainContainer.style.zIndex = '1000';
    mainContainer.style.backgroundColor = 'rgb(13 19 27)';
    mainContainer.style.padding = '10px';
    mainContainer.style.border = '1px solid black';
    mainContainer.style.borderRadius = '10px';
    // mainContainer.style.display = 'flex';
    mainContainer.style.flexFlow = 'column';
    mainContainer.style.gap = '5px'; // 增加滑块之间的间距


    // 创建一个简易开关
    const filterSwitchContainer = document.createElement('div');
    filterSwitchContainer.style.display = 'flex';
    // filterSwitchContainer.style.alignItems = 'center'; // 垂直居中对齐
    // filterSwitchContainer.style.gap = '10px'; // 增加复选框与标签之间的间隔

    const filterSwitch = document.createElement('input');
    filterSwitch.type = 'checkbox';
    filterSwitch.checked = true; // 初始状态为启用
    filterSwitchContainer.appendChild(filterSwitch);

    const switchLabel = document.createElement('label');
    switchLabel.textContent = '自动加载';
    filterSwitchContainer.appendChild(switchLabel);

    mainContainer.appendChild(filterSwitchContainer);


    ///////////////////////////////////////////////////////////////////////////////

    // 创建滑块容器
    const sliderContainer = document.createElement('div');

    const sliderLabel = document.createElement('label');
    sliderLabel.textContent = '过滤时间 (小时):';
    sliderLabel.style.display = 'block';
    sliderContainer.appendChild(sliderLabel);

    // 创建对数比例滑块
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = '4'; // 对数比例范围
    slider.step = '0.01';
    slider.value = '2'; // 初始值为100小时对应的对数值log10(100) = 2
    slider.style.width = '200px';
    sliderContainer.appendChild(slider);

    const sliderValue = document.createElement('span');
    const hoursFromLog = logarithmicToLinear(slider.value);
    sliderValue.textContent = hoursFromLog.toFixed(2);
    sliderValue.style.marginLeft = '10px';
    sliderContainer.appendChild(sliderValue);

    // 添加刻度显示
    const scaleContainer = document.createElement('div');
    scaleContainer.style.display = 'flex';
    scaleContainer.style.justifyContent = 'space-between';
    scaleContainer.style.marginTop = '5px';

    const scales = [1, 10, 100, 1000, 10000];
    scales.forEach(scale => {
        const scaleLabel = document.createElement('span');
        scaleLabel.textContent = scale;
        scaleContainer.appendChild(scaleLabel);
    });
    sliderContainer.appendChild(scaleContainer);

    ///////////////////////////////////////////////////////////////////////////

    // 创建字数滑块容器
    const wordCountSliderContainer = document.createElement('div');

    const wordCountSliderLabel = document.createElement('label');
    wordCountSliderLabel.textContent = '过滤评论字数:';
    wordCountSliderLabel.style.display = 'block';
    wordCountSliderContainer.appendChild(wordCountSliderLabel);

    // 创建字数滑块
    const wordCountSlider = document.createElement('input');
    wordCountSlider.type = 'range';
    wordCountSlider.min = '0';
    wordCountSlider.max = '4'; // 对数比例范围，同样适用
    wordCountSlider.step = '0.01';
    wordCountSlider.value = '2'; // 初始值
    wordCountSlider.style.width = '200px';
    wordCountSliderContainer.appendChild(wordCountSlider);

    const wordCountSliderValue = document.createElement('span');
    const wordsFromLog = logarithmicToLinear(wordCountSlider.value);
    wordCountSliderValue.textContent = wordsFromLog.toFixed(0);
    wordCountSliderValue.style.marginLeft = '10px';
    wordCountSliderContainer.appendChild(wordCountSliderValue);

    // 添加字数刻度显示
    const wordCountScaleContainer = document.createElement('div');
    wordCountScaleContainer.style.display = 'flex';
    wordCountScaleContainer.style.justifyContent = 'space-between';
    wordCountScaleContainer.style.marginTop = '5px';

    const wordCountScales = [1, 10, 100, 1000, 10000];
    wordCountScales.forEach(scale => {
        const scaleLabel = document.createElement('span');
        scaleLabel.textContent = scale;
        wordCountScaleContainer.appendChild(scaleLabel);
    });
    wordCountSliderContainer.appendChild(wordCountScaleContainer);

    //////////////////////////////////////////////////////////////////////////////

    // 将滑块容器添加到总容器
    mainContainer.appendChild(sliderContainer);
    mainContainer.appendChild(wordCountSliderContainer);

    // 将总容器添加到文档主体
    document.body.appendChild(mainContainer);

    // 更新滑块值和应用筛选
    slider.addEventListener('input', () => {
        const hours = logarithmicToLinear(slider.value);
        sliderValue.textContent = hours.toFixed(2);
        applyFilter(logarithmicToLinear(slider.value), logarithmicToLinear(wordCountSlider.value));
    });

    // 更新字数滑块值和应用筛选
    wordCountSlider.addEventListener('input', () => {
        const words = logarithmicToLinear(wordCountSlider.value);
        wordCountSliderValue.textContent = words.toFixed(0);
        applyFilter(logarithmicToLinear(slider.value), logarithmicToLinear(wordCountSlider.value));
    });

    // 创建用于直方图的画布
    const histogramCanvas = document.createElement('canvas');
    histogramCanvas.style.marginTop = '20px';
    mainContainer.appendChild(histogramCanvas);

    // 数据和配置初始化
    let histogramChart;
    // 初始化图表
    function initializeHistogram() {
        const context = histogramCanvas.getContext('2d');
        histogramCanvas.height = 300;  // 设置图表高度为500px
        histogramChart = new Chart(context, {
            type: 'line',  // 使用折线图来显示连续的图表
            data: {
                labels: [],
                datasets: [{
                    label: '评论数量',
                    data: [],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    fill: true  // 填充图表下方区域
                }]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: '游玩时长 (小时)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: '评论数量'
                        },
                        type: 'logarithmic',
                        min: 0,
                        ticks: {
                            callback: function(value) {
                                if (Number.isInteger(value)) {
                                    return value; // 仅显示整数刻度
                                }
                                return null; // 跳过小数刻度
                            }
                        }
                    }
                },
                elements: {
                    line: {
                        tension: 0.4  // 设置曲线张力，使线条更平滑
                    }
                }
            }
        });
    }

    // 更新数据并刷新图表
    function updateHistogram(hoursArray) {
        // 设置直方图的区间和范围
        const binCount = 50;  // 将游玩时长分为50个区间
        const minHours = Math.min(...hoursArray);
        const maxHours = Math.max(...hoursArray);
        const binSize = (maxHours - minHours) / binCount;

        // 初始化直方图数据
        const histogramData = new Array(binCount).fill(0);

        // 填充直方图数据
        hoursArray.forEach(hours => {
            const binIndex = Math.floor((hours - minHours) / binSize);
            histogramData[Math.min(binIndex, binCount - 1)]++;
        });

        // 更新图表数据
        histogramChart.data.labels = histogramData.map((_, i) => {
            const binStart = Math.floor(minHours + i * binSize);
            const binEnd = Math.floor(minHours + (i + 1) * binSize);
            return `${binStart} - ${binEnd}`;
        });
        histogramChart.data.datasets[0].data = histogramData;
        histogramChart.update();
    }



    // 对数比例转换为线性值
    function logarithmicToLinear(value) {
        return Math.pow(10, parseFloat(value));
    }

    // 检查并标记不符合条件的评论，同时更新直方图数据
    function checkAndMarkReviews() {
        const hoursArray = [];
        document.querySelectorAll('.apphub_Card').forEach(reviewCard => {
            const hoursElement = reviewCard.querySelector('.hours');
            if (hoursElement) {
                const hoursText = hoursElement.textContent.trim();
                const match = hoursText.match(/总时数\s*([\d,]+(\.\d+)?)\s*小时/); // 增加对逗号的匹配
                if (match) {
                    const hours = parseFloat(match[1].replace(/,/g, '')); // 移除逗号并解析为浮点数
                    hoursElement.setAttribute('data-hours', hours);
                    hoursArray.push(hours);
                }
            }
        });
        if (histogramChart) {
            updateHistogram(hoursArray);
        }
    }




    // 修改applyFilter函数，增加字数过滤
    function applyFilter(timeThreshold, wordCountThreshold) {
        document.querySelectorAll('.apphub_Card').forEach(reviewCard => {
            const hoursElement = reviewCard.querySelector('.hours');
            const reviewTextElement = reviewCard.querySelector('.apphub_CardTextContent');
            if (hoursElement && reviewTextElement) {
                const hours = parseFloat(hoursElement.getAttribute('data-hours'));
                const reviewText = Array.from(reviewTextElement.childNodes).slice(2).map(el => el.textContent).join(" ");
                const wordCount = reviewText.split(/\s+/).length;

                if (hours < timeThreshold || wordCount < wordCountThreshold) {
                    reviewCard.style.display = 'none';
                } else {
                    reviewCard.style.display = '';
                }
            }
        });
    }



    // 使用本地存储保存滑块值
    function saveSliderValues() {
        localStorage.setItem('timeSliderValue', slider.value);
        localStorage.setItem('wordCountSliderValue', wordCountSlider.value);
    }


    function loadSliderValues() {
        const savedTimeSliderValue = localStorage.getItem('timeSliderValue');
        if (savedTimeSliderValue !== null) {
            slider.value = savedTimeSliderValue;
            sliderValue.textContent = logarithmicToLinear(savedTimeSliderValue).toFixed(2);
        }

        const savedWordCountSliderValue = localStorage.getItem('wordCountSliderValue');
        if (savedWordCountSliderValue !== null) {
            wordCountSlider.value = savedWordCountSliderValue;
            wordCountSliderValue.textContent = logarithmicToLinear(savedWordCountSliderValue).toFixed(2);
        }
    }

    // 监听滑块变化并保存
    slider.addEventListener('change', saveSliderValues);
    wordCountSlider.addEventListener('change', saveSliderValues);

    // 页面初次加载时加载保存的滑块值
    loadSliderValues();
    applyFilter(logarithmicToLinear(slider.value), logarithmicToLinear(wordCountSlider.value));


    // 初始化图表
    initializeHistogram();
    checkAndMarkReviews();  // 确保在图表初始化后立即更新直方图

    // 创建一个MutationObserver来监听动态添加的新评论
    const observer = new MutationObserver(() => {
        checkAndMarkReviews();
        applyFilter(logarithmicToLinear(slider.value), logarithmicToLinear(wordCountSlider.value));
    });
    observer.observe(document.querySelector('#AppHubCards'), { childList: true, subtree: true });

})();
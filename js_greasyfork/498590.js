// ==UserScript==
// @name         获取虚拟主播录播弹幕密度
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  显示b站虚拟主播录播的弹幕密度，方便你找到录播中有趣的爆点。仅对字幕库（https://zimu.bili.studio）有效。视频右上角可以开/关图表
// @author       开朗小粟
// @match        https://zimu-bl6.pages.dev/*
// @include      https://zimu*
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/Chart.js/3.7.1/chart.js
// @grant        none
// @license        MIT

// @downloadURL https://update.greasyfork.org/scripts/498590/%E8%8E%B7%E5%8F%96%E8%99%9A%E6%8B%9F%E4%B8%BB%E6%92%AD%E5%BD%95%E6%92%AD%E5%BC%B9%E5%B9%95%E5%AF%86%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/498590/%E8%8E%B7%E5%8F%96%E8%99%9A%E6%8B%9F%E4%B8%BB%E6%92%AD%E5%BD%95%E6%92%AD%E5%BC%B9%E5%B9%95%E5%AF%86%E5%BA%A6.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function createToggleButton(videoElement) {
        // 创建开关外层div
        const toggleContainer = document.createElement('div');
        toggleContainer.style.position = 'absolute';
        toggleContainer.style.top = '10px';
        toggleContainer.style.right = '10px';
        toggleContainer.style.zIndex = '1001';
        toggleContainer.style.opacity = '0.5';  // 设置透明度为50%

        // 创建开关输入
        const toggleSwitch = document.createElement('input');
        toggleSwitch.setAttribute('type', 'checkbox');
        toggleSwitch.id = 'chartToggle';
        toggleSwitch.checked = true;

        // 创建label用于美化开关
        const toggleLabel = document.createElement('label');
        toggleLabel.setAttribute('for', 'chartToggle');
        toggleLabel.innerText = '显示热度';
        toggleLabel.style.marginLeft = '5px';

        // 状态标签
        const statusLabel = document.createElement('span');
        statusLabel.id = 'statusLabel';
        //statusLabel.innerText = 'Chart Off'; // 默认状态为关闭
        statusLabel.style.marginLeft = '10px';

        // 添加事件监听器以切换图表显示并更新状态标签
        toggleSwitch.addEventListener('change', () => {
            const chart = document.getElementById('danmakuChart');
            if (chart) {
                if (toggleSwitch.checked) {
                    chart.style.display = 'block';
                    //statusLabel.innerText = 'Chart On';
                } else {
                    chart.style.display = 'none';
                    //statusLabel.innerText = 'Chart Off';
                }
            }
        });

        // 将开关和标签添加到外层div
        toggleContainer.appendChild(toggleSwitch);
        toggleContainer.appendChild(toggleLabel);
        toggleContainer.appendChild(statusLabel);

        // 将整个开关组添加到视频元素的父节点
        videoElement.parentNode.appendChild(toggleContainer);
    }

    // Function to get the URL of the video element by class name
    function getVideoURLByClass() {
        let videoElement = document.querySelector('video.art-video');
        if (videoElement) {
            // Add event listener for 'loadeddata' to ensure the video is fully loaded
            videoElement.addEventListener('loadeddata', function () {
                let videoURL = videoElement.src;
                //console.log('Video URL:', videoURL);
                //alert('Video URL: ' + videoURL);

                // Replace .mp4 with .xml to get the danmaku file URL
                let danmakuURL = videoURL.replace('.mp4', '.xml');
                //console.log('Danmaku URL:', danmakuURL);
                //alert('Danmaku URL: ' + danmakuURL);

                // Fetch the danmaku XML file
                fetch(danmakuURL)
                    .then(response => response.text())
                    .then(xmlText => {
                        // Parse the XML text
                        let parser = new DOMParser();
                        let xmlDoc = parser.parseFromString(xmlText, 'text/xml');

                        // Process the XML data
                        let interval = 5;
                        let num_chats_per_minute = {};

                        let d_elements = xmlDoc.getElementsByTagName('d');
                        for (let d of d_elements) {
                            let send_time = parseFloat(d.getAttribute('p').split(',')[0]);
                            let bound = Math.floor(send_time / interval);
                            if (!(bound in num_chats_per_minute)) {
                                num_chats_per_minute[bound] = 0;
                            }
                            num_chats_per_minute[bound] += 1;
                        }

                        // Fill in missing keys with 0
                        let maxKey = Math.max(...Object.keys(num_chats_per_minute).map(Number));
                        let x = [];
                        let y = [];
                        for (let i = 0; i <= maxKey; i++) {
                            x.push(i * interval);
                            y.push(num_chats_per_minute[i] || 0);
                        }

                        //console.log('x:', x);
                        //console.log('y:', y);
                        //alert('x: ' + x);
                        //alert('y: ' + y);

                        // Draw the chart
                        drawChart(videoElement, x, y, videoElement.duration);
                        createToggleButton(videoElement);
                    })
                    .catch(error => {
                        console.error('Error fetching or parsing danmaku XML:', error);
                    });
            }, { once: true }); // Ensure the event listener is only called once

            // Observe the video element for removal
            const videoObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.removedNodes.forEach((node) => {
                        if (node.nodeType === 1 && node.contains(videoElement)) {
                            //console.log('Video element removed, restarting observer.');
                            startObserving(); // Restart observing when video element is removed
                            videoObserver.disconnect(); // Disconnect the video observer
                        }
                    });
                });
            });

            // Start observing the parent node of the video element for child node removals
            // videoObserver.observe(videoElement.parentNode, { childList: true });
            videoObserver.observe(document.body, { childList: true, subtree: true });
        } else {
            console.log('No video element found.');
        }
    }

    // Function to draw the chart on the video element
    function drawChart1(videoElement, x, y, videoDuration) {
        // Calculate chart height as one-tenth of video height
        const chartHeight = videoElement.clientHeight / 3;

        // Create a canvas element
        const canvas = document.createElement('canvas');
        canvas.id = 'danmakuChart';
        canvas.style.position = 'absolute';
        canvas.style.bottom = '0';
        canvas.style.left = '0.5%';  // Center the canvas horizontally
        canvas.style.width = '99%';
        canvas.style.height = `${chartHeight}px`; // Set the height to one-tenth of the video height
        canvas.style.pointerEvents = 'none'; // Allow clicks to pass through
        canvas.style.zIndex = '1000'; // Ensure the canvas is on top

        // Append the canvas to the video element's parent
        videoElement.parentNode.appendChild(canvas);

        // Adjust x-axis labels to match video duration
        const adjustedX = [];
        for (let i = 0; i < x.length; i++) {
            adjustedX.push((x[i] / (x[x.length - 1])) * videoDuration);
        }

        // Draw the chart
        const ctx = canvas.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: adjustedX,
                datasets: [{
                    data: y,
                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 0,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    fill: true
                }]
            },
            options: {

                responsive: false,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        display: true,
                        position: 'bottom',
                        min: 0,
                        max: videoDuration,
                        ticks: {
                            display: false
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        display: false,
                        ticks: {
                            display: false
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                layout: {
                    padding: {
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0
                    }
                },
                elements: {
                    line: {
                        tension: 0.4 // smooth lines
                    }
                }
            }
        });
    }
    function getRandomColor() {
        const l = 20;
        const r = Math.floor(l + Math.random() * (255 - l)); // 随机生成0-255之间的整数
        const g = Math.floor(l + Math.random() * (255 - l)); // 随机生成0-255之间的整数
        const b = Math.floor(l + Math.random() * (255 - l)); // 随机生成0-255之间的整数
        const a = 0.9;
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
    function drawChart(videoElement, x, y, videoDuration) {
        const chartHeight = videoElement.clientHeight / 3;
        const canvas = document.createElement('canvas');
        canvas.id = 'danmakuChart';
        canvas.style.position = 'absolute';
        canvas.style.left = '0.5%'; // Center the canvas horizontally
        canvas.style.width = '99%';
        canvas.style.height = `${chartHeight}px`;
        canvas.style.pointerEvents = 'none'; // Allow clicks to pass through
        canvas.style.zIndex = '1000'; // Ensure the canvas is on top

        const parentDiv = videoElement.parentNode;
        videoElement.parentNode.appendChild(canvas); // Append the canvas initially
        window.cnt = 0;
        // Function to update canvas position based on class 'art-control-show'
        let lastClass = parentDiv.className; // Keep track of the last class

        const progressElement = document.querySelector('.art-progress');
        let p1 = canvas.parentElement.getBoundingClientRect().bottom
        let p2 = progressElement.getBoundingClientRect().top
        let b1 = `${p1 - p2}px`;
        let b2 = '0';
        function updateCanvasPosition() {
            if (parentDiv.classList.contains('art-control-show')) {
                //console.log('contain', window.cnt, parentDiv.className);
                // Place the canvas above the '.art-progress' element if it exists
                const progressElement = document.querySelector('.art-progress');
                if (progressElement) {
                    //progressElement.style.position = 'relative'; // Ensure it's positioned
                    //progressElement.parentNode.insertBefore(canvas, progressElement);

                    //console.log(p1,p2);
                    canvas.style.bottom = b1;

                }
            } else {
                //console.log('Not contain', window.cnt, parentDiv.className);
                // Place the canvas at the bottom of the video element
                canvas.style.bottom = b2;
                parentDiv.appendChild(canvas);
            }
        }

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const newClass = parentDiv.className;
                    if (newClass !== lastClass) {
                        const progressElement = document.querySelector('.art-progress');
                        //console.log(progressElement.getBoundingClientRect());
                        lastClass = newClass; // Update the tracked class
                        updateCanvasPosition(); // Only update if class actually changed
                    }
                }
            });
        });

        // Start observing the parentDiv for attribute changes
        observer.observe(parentDiv, {
            attributes: true, // Monitor attributes
            attributeFilter: ['class'] // Only monitor the 'class' attribute
        });

        updateCanvasPosition(); // Initial placement check

        // Adjust x-axis labels to match video duration
        const adjustedX = x.map(value => (value / x[x.length - 1]) * videoDuration);

        // Draw the chart
        const ctx = canvas.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: adjustedX,
                datasets: [{
                    data: y,
                    backgroundColor: getRandomColor(),
                    // borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 0,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    fill: true
                }]
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: { display: false }
                },
                scales: {
                    x: {
                        type: 'linear',
                        display: true,
                        position: 'bottom',
                        min: 0,
                        max: videoDuration,
                        ticks: { display: false },
                        grid: { display: false }
                    },
                    y: {
                        display: false,
                        ticks: { display: false },
                        grid: { display: false }
                    }
                },
                layout: {
                    padding: { top: 0, left: 0, right: 0, bottom: 0 }
                },
                elements: {
                    line: { tension: 0.4 } // smooth lines
                }
            }
        });
    }


    // Observer to detect when elements are added to the DOM
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            for (let node of mutation.addedNodes) {
                if (node.nodeType === 1) { // Only process element nodes
                    let videoElement = document.querySelector('video.art-video');
                    if (videoElement) {
                        getVideoURLByClass();
                        observer.disconnect(); // Stop observing after the video element is found
                        return;
                    }
                }
            }
        }
    });

    // Function to start observing the document body for added nodes
    function startObserving() {
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Start observing when the script is first run
    startObserving();

})();

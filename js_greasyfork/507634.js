// ==UserScript==
// @name         AmapTools
// @description  一款高德地图扩展工具。拦截高德地图（驾车、公交、步行）路线规划接口数据，将其转换成GeoJSON格式数据，并提供复制和下载。
// @version      1.0.2
// @author       DD1024z
// @namespace    https://github.com/10D24D/AmapTools/
// @supportURL   https://github.com/10D24D/AmapTools/
// @match        https://www.amap.com/*
// @match        https://ditu.amap.com/*
// @match        https://www.gaode.com/*
// @icon         https://a.amap.com/pc/static/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507634/AmapTools.user.js
// @updateURL https://update.greasyfork.org/scripts/507634/AmapTools.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let responseData = null; // 拦截到的接口数据
    let routeType = ''; // 当前路线类型（驾车、公交或步行）
    let listGeoJSON = []
    let currentGeoJSON = {}
    let selectedPathIndex = -1;
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let panelPosition = { left: null, top: null }; // 保存面板位置

    const directionMap = {
        "driving": "驾车",
        "transit": "公交",
        "walking": "步行",
    }
    const uriMap = {
        "driving": "/service/autoNavigat",
        "transit": "/service/nav/bus",
        "walking": "/v3/direction/walking",
    }

    // 样式封装
    const style = document.createElement('style');
    style.innerHTML = `
        #routeOptions {
            position: fixed;
            z-index: 9999;
            background-color: #f9f9f9;
            border: 1px solid #ccc;
            padding: 10px;
            box-shadow: 0 2px 2px rgba(0, 0, 0, .15);
            background: #fff;
            width: 300px;
            border-radius: 3px;
            font-family: Arial, sans-serif;
            cursor: move;
        }
        #routeOptions #closeBtn {
            position: absolute;
            top: -12px;
            right: 0px;
            background-color: transparent;
            color: #b3b3b3;
            border: none;
            font-size: 24px;
            cursor: pointer;
        }
        #routeOptions h3 {
            color: #333;
            font-size: 14px;
        }
        #routeOptions label {
            display: block;
            margin-bottom: 8px;
        }
        #routeOptions button {
            margin-top: 5px;
            padding: 5px 10px;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);

    // 拦截 XMLHttpRequest 请求
    (function (open) {
        XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
            if (url.includes(uriMap.driving) || url.includes(uriMap.transit)) {
                this.addEventListener('load', function () {
                    if (this.readyState === 4 && this.status === 200) {
                        try {
                            routeType = url.includes(uriMap.driving) ? directionMap.driving : directionMap.transit;
                            responseData = JSON.parse(this.responseText);
                            parseDataToGeoJSON();
                        } catch (e) {
                            responseData = null;
                            console.error('解析路线数据时出错', e);
                        }
                    }
                });

            }
            open.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.open);

    // 拦截 script 请求
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            mutation.addedNodes.forEach(function (node) {
                // 动态拦截步行路线的 JSONP 请求
                if (node.tagName === 'SCRIPT' && node.src.includes(uriMap.walking)) {
                    const callbackName = /callback=([^&]+)/.exec(node.src)[1];
                    if (callbackName && window[callbackName]) {
                        const originalCallback = window[callbackName];
                        window[callbackName] = function (data) {
                            routeType = directionMap.walking;
                            responseData = data;
                            parseDataToGeoJSON();
                            if (originalCallback) {
                                originalCallback(data);
                            }
                        };
                    }
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    const lineGeoJSONTemplate = {
        type: "Feature",
        geometry: {
            type: "LineString",
            coordinates: []
        },
        properties: {}
    };

    // 初始化一个路线的geojson
    function initLineGeoJSON() {
        return JSON.parse(JSON.stringify(lineGeoJSONTemplate)); // 深拷贝模板对象
    }

    // 将原始数据转换成geojson
    function parseDataToGeoJSON() {
        listGeoJSON = [];
        let pathList = [];

        if (routeType === directionMap.driving) {
            // 解析驾车规划的数据
            pathList = responseData.data.path_list;
            pathList.forEach((data, index) => {
                let geoJSON = initLineGeoJSON();
                geoJSON.properties.duration = Math.ceil(responseData.data.drivetime.split(',')[index] / 60)
                geoJSON.properties.distance = parseInt(responseData.data.distance.split(',')[index], 10)
                geoJSON.properties.traffic_lights = parseInt(data.traffic_lights || 0, 10)

                data.path.forEach((path, index) => {
                    path.segments.forEach((segment, index) => {
                        if (segment.coor) {
                            // 去掉 `[]` 符号
                            const cleanedCoor = segment.coor.replace(/[\[\]]/g, '');
                            const coorArray = cleanedCoor.split(',').map(Number);
                            for (let k = 0; k < coorArray.length; k += 2) {
                                const lng = coorArray[k];
                                const lat = coorArray[k + 1];
                                if (!isNaN(lng) && !isNaN(lat)) {
                                    geoJSON.geometry.coordinates.push([lng, lat]);
                                }
                            }
                        }
                    });
                });

                listGeoJSON.push(geoJSON)
            });
        } else if (routeType === directionMap.transit) {
            // 解析公交规划的数据
            if (responseData.data.routelist && responseData.data.routelist.length > 0) {
                // 如果存在 routelist 则优先处理 routelist
                pathList = responseData.data.routelist;

                // 处理 routelist 数据结构
                pathList.forEach((segment, index) => {
                    let geoJSON = initLineGeoJSON();
                    segment.segments.forEach((subSegment, i) => {
                        subSegment.forEach((element, j) => {
                            // 铁路。拼接起点、途经点和终点坐标
                            if (element[0] === "railway") {
                                // 添加起点坐标
                                const startCoord = element[1].scord.split(' ').map(Number);
                                geoJSON.geometry.coordinates.push(startCoord);

                                // 添加途经点坐标
                                const viaCoords = element[1].viastcord.split(' ').map(Number);
                                for (let k = 0; k < viaCoords.length; k += 2) {
                                    geoJSON.geometry.coordinates.push([viaCoords[k], viaCoords[k + 1]]);
                                }

                                // 添加终点坐标
                                const endCoord = element[1].tcord.split(' ').map(Number);
                                geoJSON.geometry.coordinates.push(endCoord);
                            }
                        });

                    });
                    geoJSON.properties.duration = parseInt(segment.time, 10); // 路程时间（单位：分钟）
                    geoJSON.properties.distance = parseInt(segment.distance, 10); // 路程距离（单位：米）
                    geoJSON.properties.cost = parseFloat(segment.cost); // 花费金额
                    listGeoJSON.push(geoJSON);
                });

            } else {
                // 过滤掉没有 busindex 的公交路线
                pathList = responseData.data.buslist.filter(route => route.busindex !== undefined);

                pathList.forEach(data => {
                    let geoJSON = initLineGeoJSON();

                    geoJSON.properties.distance = parseInt(data.allLength, 10)
                    geoJSON.properties.duration = Math.ceil(data.expensetime / 60)
                    geoJSON.properties.walk_distance = parseInt(data.allfootlength, 10)
                    geoJSON.properties.expense = Math.ceil(data.expense)
                    geoJSON.properties.expense_currency = data.expense_currency

                    const segmentList = data.segmentlist;
                    let segmentProperties = []

                    segmentList.forEach(segment => {
                        if (!geoJSON.properties.startStation) {
                            geoJSON.properties.startStation = segment.startname + (geoJSON.properties.inport ? '(' + geoJSON.properties.inport + ')' : '');
                        }

                        let importantInfo = {
                            startname: segment.startname ? segment.startname : '',
                            endname: segment.endname ? segment.endname : '',
                            bus_key_name: segment.bus_key_name ? segment.bus_key_name : '',
                            inport_name: segment.inport.name ? segment.inport.name : '',
                            outport_name: segment.outport.name ? segment.outport.name : '',
                        }
                        segmentProperties.push(importantInfo);

                        // 起点到公交的步行路径
                        if (segment.walk && segment.walk.infolist) {
                            segment.walk.infolist.forEach(info => {
                                const walkCoords = info.coord.split(',').map(Number);
                                for (let i = 0; i < walkCoords.length; i += 2) {
                                    geoJSON.geometry.coordinates.push([walkCoords[i], walkCoords[i + 1]]);
                                }
                            });
                        }
                        // 公交驾驶路线
                        const driverCoords = segment.drivercoord.split(',').map(Number);
                        for (let i = 0; i < driverCoords.length; i += 2) {
                            geoJSON.geometry.coordinates.push([driverCoords[i], driverCoords[i + 1]]);
                        }

                        // 公交换乘路线
                        // if (segment.alterlist && segment.alterlist.length > 0){
                        //     for (let i = 0; i < segment.alterlist.length; i++) {
                        //         const after = array[i];

                        //     }
                        // }
                    });

                    // 到达公交后离终点的步行路径
                    if (data.endwalk && data.endwalk.infolist) {
                        data.endwalk.infolist.forEach(info => {
                            const endwalkCoords = info.coord.split(',').map(Number);
                            for (let i = 0; i < endwalkCoords.length; i += 2) {
                                geoJSON.geometry.coordinates.push([endwalkCoords[i], endwalkCoords[i + 1]]);
                            }
                        });
                    }

                    listGeoJSON.push(geoJSON);
                });
            }

        } else if (routeType === directionMap.walking) {
            // 解析步行规划的数据
            pathList = responseData.route.paths;
            pathList.forEach(path => {
                let geoJSON = initLineGeoJSON()
                geoJSON.properties.distance = parseInt(path.distance, 10)
                geoJSON.properties.duration = Math.ceil(parseInt(path.duration, 10) / 60)
                path.steps.forEach(step => {
                    const coorArray = step.polyline.split(';').map(item => item.split(',').map(Number));
                    coorArray.forEach(coordinate => {
                        if (coordinate.length === 2 && !isNaN(coordinate[0]) && !isNaN(coordinate[1])) {
                            geoJSON.geometry.coordinates.push(coordinate);
                        }
                    });
                });
                listGeoJSON.push(geoJSON);
            });

        } else {
            console.error('未知的数据')
            return;
        }

        displayRouteOptions()
    }

    // 创建路线选择界面
    function displayRouteOptions() {
        const existingDiv = document.getElementById('routeOptions');
        if (existingDiv) {
            existingDiv.remove();
        }

        const routeDiv = document.createElement('div');
        routeDiv.id = 'routeOptions';

        // 检查是否有保存的位置数据
        if (panelPosition.left && panelPosition.top) {
            routeDiv.style.left = `${panelPosition.left}px`;
            routeDiv.style.top = `${panelPosition.top}px`;
        } else {
            // 如果没有保存的位置数据，使用默认位置
            routeDiv.style.right = '20px';
            routeDiv.style.top = '100px';
        }

        // 创建关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.id = 'closeBtn';
        closeBtn.innerText = '×';
        closeBtn.onclick = function () {
            routeDiv.remove();
        };
        routeDiv.appendChild(closeBtn);

        // 出行方式
        const modeTitle = document.createElement('h3');
        modeTitle.innerText = '出行方式：';
        routeDiv.appendChild(modeTitle);

        const modeSelectionDiv = document.createElement('div');
        modeSelectionDiv.style.display = 'flex';
        modeSelectionDiv.style.flexDirection = 'row';
        modeSelectionDiv.style.flexWrap = 'wrap';

        const modes = [directionMap.driving, directionMap.transit, directionMap.walking];
        const modeIds = ['carTab', 'busTab', 'walkTab'];

        modes.forEach((mode, modeIndex) => {
            const modeLabel = document.createElement('label');
            const modeRadio = document.createElement('input');
            modeLabel.style.marginRight = '5px';
            modeRadio.type = 'radio';
            modeRadio.name = 'modeSelection';
            modeRadio.value = mode;
            modeRadio.onchange = function () {
                const modeTab = document.getElementById(modeIds[modeIndex]);
                if (modeTab) {
                    modeTab.click(); // 触发高德地图相应Tab的点击事件
                }
            };
            if (mode === routeType) {
                modeRadio.checked = true;
            }

            modeLabel.appendChild(modeRadio);
            modeLabel.appendChild(document.createTextNode(mode));
            modeSelectionDiv.appendChild(modeLabel);
        });

        // 将 modeSelectionDiv 添加到路线选择界面
        routeDiv.appendChild(modeSelectionDiv);

        // 修改原来的标题
        const title = document.createElement('h3');
        title.innerText = `路线列表：`;
        routeDiv.appendChild(title);
        const routeFragment = document.createDocumentFragment();

        // 遍历所有的路线
        listGeoJSON.forEach((geoJSON, index) => {
            const label = document.createElement('label');
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'routeSelection';
            radio.value = index;

            radio.onclick = function () {
                selectedPathIndex = index;
                currentGeoJSON = listGeoJSON[selectedPathIndex]
                copyToClipboard(JSON.stringify(currentGeoJSON));
                // console.log("选中的路线：", currentGeoJSON);

                // 同步点击高德地图的路线选项
                // 去除所有元素的 open 样式
                document.querySelectorAll('.planTitle.open').forEach(function (el) {
                    el.classList.remove('open');
                });
                // 为当前选中的路线添加 open 样式
                const currentPlanTitle = document.getElementById(`plantitle_${index}`);
                if (currentPlanTitle) {
                    currentPlanTitle.classList.add('open');
                    currentPlanTitle.click();
                }
            };

            if (index === 0) {
                radio.checked = true;
                selectedPathIndex = 0;
                currentGeoJSON = listGeoJSON[selectedPathIndex]
                copyToClipboard(JSON.stringify(currentGeoJSON));
                // console.log("选中的路线：", currentGeoJSON);
            }

            const totalDistance = formatDistance(geoJSON.properties.distance);

            const totalTime = formatTime(geoJSON.properties.duration);

            const trafficLights = geoJSON.properties.traffic_lights ? ` | 红绿灯${geoJSON.properties.traffic_lights}个` : '';

            const walkDistance = geoJSON.properties.walk_distance ? ` | 步行${formatDistance(geoJSON.properties.walk_distance)}` : '';

            const expense = geoJSON.properties.expense ? ` | ${Math.ceil(geoJSON.properties.expense)}${geoJSON.properties.expense_currency}` : '';

            label.appendChild(radio);
            label.appendChild(document.createTextNode(`路线${index + 1}：约${totalTime} | ${totalDistance}${trafficLights}${walkDistance}${expense}`));
            routeFragment.appendChild(label);
        });
        routeDiv.appendChild(routeFragment);

        const downloadBtn = document.createElement('button');
        downloadBtn.innerText = '下载GeoJSON';
        downloadBtn.onclick = function () {
            if (selectedPathIndex === -1) {
                alert("请先选择一条路线");
                return;
            }
            currentGeoJSON = listGeoJSON[selectedPathIndex]
            downloadGeoJSON(currentGeoJSON, `${routeType}_路线${selectedPathIndex + 1}.geojson`);
        };
        routeDiv.appendChild(downloadBtn);

        document.body.appendChild(routeDiv);

        // 添加拖拽功能
        routeDiv.addEventListener('mousedown', function (e) {
            isDragging = true;
            dragOffsetX = e.clientX - routeDiv.offsetLeft;
            dragOffsetY = e.clientY - routeDiv.offsetTop;
            routeDiv.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', function (e) {
            if (isDragging) {
                const newLeft = Math.max(0, Math.min(window.innerWidth - routeDiv.offsetWidth, e.clientX - dragOffsetX));
                const newTop = Math.max(0, Math.min(window.innerHeight - routeDiv.offsetHeight, e.clientY - dragOffsetY));
                routeDiv.style.left = `${newLeft}px`;
                routeDiv.style.top = `${newTop}px`;

                // 保存新的位置到 panelPosition
                panelPosition.top = newTop;
                panelPosition.left = newLeft;
            }
        });

        document.addEventListener('mouseup', function () {
            isDragging = false;
            routeDiv.style.cursor = 'move';
        });
    }

    // 时间格式化：大于60分钟显示小时，大于24小时显示天
    function formatTime(minutes) {
        if (minutes >= 1440) { // 超过24小时
            const days = Math.floor(minutes / 1440);
            const hours = Math.floor((minutes % 1440) / 60);
            return `${days}天${hours ? hours + '小时' : ''}`;
        } else if (minutes >= 60) { // 超过1小时
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return `${hours}小时${mins ? mins + '分钟' : ''}`;
        }
        return `${minutes}分钟`;
    }

    // 格式化距离函数：如果小于1000米，保留米；如果大于等于1000米，转换为公里
    function formatDistance(distanceInMeters) {
        if (distanceInMeters < 1000) {
            return `${distanceInMeters}米`;
        } else {
            return `${(distanceInMeters / 1000).toFixed(1)}公里`;
        }
    }

    // 复制内容到剪贴板
    function copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                console.log("GeoJSON已复制到剪贴板");
            }).catch(() => fallbackCopyToClipboard(text));
        } else {
            fallbackCopyToClipboard(text);
        }
    }


    // 备用复制方案
    function fallbackCopyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            console.log("GeoJSON已复制到剪贴板");
        } catch (err) {
            console.error("备用复制方案失败: ", err);
        }
        document.body.removeChild(textarea);
    }

    // 下载GeoJSON文件
    function downloadGeoJSON(geoJSON, filename) {
        const blob = new Blob([JSON.stringify(geoJSON)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // AmapLoginAssist - 高德地图支持密码登录、三方登录
    // [clone from MIT code](https://greasyfork.org/zh-CN/scripts/477376-amaploginassist-%E9%AB%98%E5%BE%B7%E5%9C%B0%E5%9B%BE%E6%94%AF%E6%8C%81%E5%AF%86%E7%A0%81%E7%99%BB%E5%BD%95-%E4%B8%89%E6%96%B9%E7%99%BB%E5%BD%95)
    let pollCount = 0;
    let intervalID = setInterval(() => {
        try {
            pollCount++;
            if (pollCount > 50) {
                clearInterval(intervalID);
                return;
            }

            //
            if (window.passport && window.passport.config) {
                clearInterval(intervalID);
                window.passport.config({
                    loginMode: ["password", "message", "qq", "sina", "taobao", "alipay", "subAccount", "qrcode"],
                    loginParams: {
                        dip: 20303
                    }
                });
                window.passport.config = () => { };
            }

        } catch (e) {
            console.error(e)
            clearInterval(intervalID);
        }
    }, 100);
})();

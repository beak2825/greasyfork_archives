// ==UserScript==
// @name         扫码更新设备在库时间
// @namespace    https://test.baicizhan.com
// @version      1.8
// @description  扫描二维码以更新设备在库时间
// @author       hr
// @match        https://test.baicizhan.com/src/
// @grant        none
// @license      hr
// @downloadURL https://update.greasyfork.org/scripts/486826/%E6%89%AB%E7%A0%81%E6%9B%B4%E6%96%B0%E8%AE%BE%E5%A4%87%E5%9C%A8%E5%BA%93%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/486826/%E6%89%AB%E7%A0%81%E6%9B%B4%E6%96%B0%E8%AE%BE%E5%A4%87%E5%9C%A8%E5%BA%93%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.12.0/toastify.min.css';
document.head.appendChild(link);

const toastifyScript = document.createElement('script');
toastifyScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.12.0/toastify.min.js';
document.head.appendChild(toastifyScript);

const jsQRScript = document.createElement('script');
jsQRScript.src = 'https://cdn.jsdelivr.net/npm/jsqr/dist/jsQR.js';
document.head.appendChild(jsQRScript);

// 在所有依赖项加载完毕后执行主逻辑
Promise.all([toastifyScript.onload, jsQRScript.onload]).then(() => {
    (function () {
        'use strict';

        // 创建相机图标，使用 emoji 表示相机
        const cameraIcon = document.createElement('div');
        cameraIcon.textContent = '📷';
        cameraIcon.style.position = 'fixed';
        cameraIcon.style.bottom = '20px'; // 图标距离底部的位置
        cameraIcon.style.right = '20px'; // 图标距离右侧的位置
        cameraIcon.style.fontSize = '2rem'; // 图标的字体大小
        cameraIcon.style.cursor = 'pointer'; // 鼠标指针样式
        document.body.appendChild(cameraIcon);

        // 创建二维码资产盘点页面容器
        const inventoryContainer = document.createElement('div');
        inventoryContainer.id = 'inventoryContainer'
        inventoryContainer.style.position = 'fixed';
        inventoryContainer.style.top = '50%'; // 垂直居中
        inventoryContainer.style.left = '50%'; // 水平居中
        inventoryContainer.style.transform = 'translate(-50%, -50%)'; // 居中偏移
        inventoryContainer.style.backgroundColor = '#fff'; // 白色背景
        inventoryContainer.style.borderRadius = '1rem'; // 圆角
        inventoryContainer.style.padding = '1rem'; // 内边距
        inventoryContainer.style.display = 'none'; // 初始隐藏
        inventoryContainer.style.boxShadow = '0.5rem 0.5rem 1rem rgba(0, 0, 0, 0.2)'
        inventoryContainer.style.zIndex = '9999'; // 确保在页面最顶层

        let initialX, initialY, offsetX, offsetY;

        // 鼠标按下事件监听器
        function dragMouseDown(e) {
            e.preventDefault();
            // 获取初始位置和偏移量
            initialX = e.clientX;
            initialY = e.clientY;
            offsetX = inventoryContainer.offsetLeft;
            offsetY = inventoryContainer.offsetTop;
            // 添加鼠标移动和鼠标释放事件监听器
            document.addEventListener('mousemove', elementDrag);
            document.addEventListener('mouseup', closeDragElement);
        }

        // 鼠标移动事件监听器
        function elementDrag(e) {
            e.preventDefault();
            // 计算新的元素位置
            const newX = offsetX + e.clientX - initialX;
            const newY = offsetY + e.clientY - initialY;
            // 更新元素位置
            inventoryContainer.style.left = newX + 'px';
            inventoryContainer.style.top = newY + 'px';
        }

        // 鼠标释放事件监听器
        function closeDragElement() {
            // 移除鼠标移动和鼠标释放事件监听器
            document.removeEventListener('mousemove', elementDrag);
            document.removeEventListener('mouseup', closeDragElement);
        }

        // 给元素添加鼠标按下事件监听器
        inventoryContainer.addEventListener('mousedown', dragMouseDown);
        document.body.appendChild(inventoryContainer);

        // 添加二维码资产盘点页面内容到容器中
        inventoryContainer.innerHTML = `
        <style>
            #video {
                width: 20rem;
                max-width: 20rem;
                height: 15rem;
                box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.2);
                /* 添加阴影 */
                border-radius: 1rem;
                box-sizing: border-box;
                margin-bottom: 1rem;
                background-image: url('data:image/svg+xml,%3Csvg%20t%3D%221707284491990%22%20class%3D%22icon%22%20viewBox%3D%220%200%201024%201024%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20p-id%3D%229712%22%20width%3D%22200%22%20height%3D%22200%22%3E%3Cpath%20d%3D%22M304%20448a48%2048%200%201%201%200.032-96.032%2048%2048%200%200%201%200%2096m606.976-124.256a32.192%2032.192%200%200%200-32.96%201.792l-91.52%2062.048V288a64.064%2064.064%200%200%200-64-64.032H192a64.064%2064.064%200%200%200-64%2064V736c0%2035.328%2028.704%2064%2064%2064h530.56a64.064%2064.064%200%200%200%2063.936-64v-42.592l0.384-25.312%2091.04%2062.336A32%2032%200%200%200%20928%20704V352c0-11.84-6.56-22.72-16.96-28.288%22%20fill%3D%22%237dcd82%22%20p-id%3D%229713%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E');
                background-size: cover;
                background-position : center;
                transform: scaleX(-1);
                -webkit-transform: scaleX(-1); /* 兼容性 */
            }

            #log {
                width: 19rem;
                max-width: 19rem;
                height: 6rem;
                max-height: 10rem;
                overflow-y: auto;
                box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.2);
                /* 添加阴影 */
                border-radius: 1rem;
                padding: 0.5rem;
                margin-bottom: 1rem;
                background-color: #f5f5f5; /* 更改为浅灰色背景 */
            }

            #log::-webkit-scrollbar {
                width: 0;
                height: 0;
            }

            .log-entry {
                margin-bottom: 0.5rem;
                border-radius: 0.5rem;
            }

            .log-time {
                font-size: 0.7rem;
                font-weight: bold;
            }

            .log-message {
                font-size: 0.7rem;
                overflow-wrap: anywhere;
            }

            @media screen and (max-width: 40rem) {

                #video, #log {
                    width: 85%;
                }
            }

            #export {
                width: 20rem;
                max-width: 20rem;
                box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.2);
                border-radius: 1rem;
                padding: 0.5rem;
                border: 0px;
                background-color: #7DCEA0;
                transition: background-color 0.3s ease-in-out;
                color: #FFFFFF;
            }

            #export:hover {
                background-color: #28B463;
            }

            #export:active {
                background-color: #7DCEA0;
            }
        </style>
        <video id="video" autoplay></video>
        <canvas id="canvas" style="display: none;" willReadFrequently></canvas>
        <div id="log"></div>
        <button id="export">导出不在库设备信息</button>
    `;

        function addLog(logString, logType) {
            const logDiv = inventoryContainer.querySelector('#log');
            const time = new Date().toLocaleString();
            const logEntry = document.createElement('div');
            logEntry.classList.add('log-entry');
            const logTime = document.createElement('div');
            logTime.classList.add('log-time');
            logTime.textContent = time;
            const logMessage = document.createElement('div');
            logMessage.classList.add('log-message');
            logMessage.textContent = logString;
            logEntry.appendChild(logTime);
            logEntry.appendChild(logMessage);
            logDiv.prepend(logEntry);
            switch (logType) {
                case 'error': logEntry.style.color = '#d81e06'; break;
                case 'warning': logEntry.style.color = '#efb336'; break;
                default: logEntry.style.color = '#000'; break;
            }
        }

        function showToast(message, type) {
            const messageType = {
                processing: "data:image/svg+xml,%3Csvg%20t%3D%221710494565438%22%20class%3D%22icon%22%20viewBox%3D%220%200%201024%201024%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20p-id%3D%225191%22%20width%3D%22200%22%20height%3D%22200%22%3E%3Cpath%20d%3D%22M512%200c282.713043%200%20512%20229.286957%20512%20512S794.713043%201024%20512%201024%200%20794.713043%200%20512%20229.286957%200%20512%200z%20m140.243478%20329.46087h13.356522c6.678261%200%2013.356522-6.678261%2013.356522-13.356522v-13.356522c0-6.678261-6.678261-13.356522-13.356522-13.356522H358.4c-6.678261%200-13.356522%206.678261-13.356522%2013.356522v13.356522c0%206.678261%206.678261%2013.356522%2013.356522%2013.356522h13.356522c0%20117.982609%2093.495652%20122.434783%2097.947826%20193.669565-4.452174%2071.234783-97.947826%2075.686957-97.947826%20193.669565h-13.356522c-6.678261%200-13.356522%206.678261-13.356522%2013.356522v13.356521c0%206.678261%206.678261%2013.356522%2013.356522%2013.356522h307.2c6.678261%200%2013.356522-6.678261%2013.356522-13.356522v-13.356521c0-6.678261-6.678261-13.356522-13.356522-13.356522h-13.356522c0-117.982609-93.495652-122.434783-97.947826-193.669565%204.452174-71.234783%2097.947826-75.686957%2097.947826-193.669565z%22%20fill%3D%22%23F9AD33%22%20p-id%3D%225192%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E",
                ok: "data:image/svg+xml,%3Csvg%20t%3D%221707285514561%22%20class%3D%22icon%22%20viewBox%3D%220%200%201024%201024%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20p-id%3D%221267%22%20width%3D%22200%22%20height%3D%22200%22%3E%3Cpath%20d%3D%22M802.922882%20383.309012%20428.076612%20758.155283%20220.943065%20551.154765c-22.317285-22.317285-22.317285-55.993269%200-78.310553%2022.450315-22.450315%2055.993269-22.450315%2078.443583%200l128.689964%20128.689964L724.613352%20304.999482c22.450315-22.450315%2055.993269-22.450315%2078.30953%200C825.373197%20327.316767%20825.373197%20360.858698%20802.922882%20383.309012zM512%2064.322981c-246.155283%200-447.677019%20201.521736-447.677019%20447.677019s201.521736%20447.677019%20447.677019%20447.677019%20447.677019-201.521736%20447.677019-447.677019S758.155283%2064.322981%20512%2064.322981z%22%20fill%3D%22%2322C134%22%20p-id%3D%221268%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E",
                error: "data:image/svg+xml,%3Csvg%20t%3D%221707291072346%22%20class%3D%22icon%22%20viewBox%3D%220%200%201024%201024%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20p-id%3D%221267%22%20width%3D%22200%22%20height%3D%22200%22%3E%3Cpath%20d%3D%22M512%20959.677019c-247.24715%200-447.677019-200.429869-447.677019-447.677019S264.75285%2064.322981%20512%2064.322981c247.248174%200%20447.677019%20200.429869%20447.677019%20447.677019S759.246127%20959.677019%20512%20959.677019L512%20959.677019zM719.833489%20302.497499l-0.005117%200c-20.952194-20.951171-54.92289-20.951171-75.876108%200L510.980787%20435.468976%20379.694695%20304.176744c-20.8734-20.8734-54.712089-20.8734-75.585489%200l-0.005117%200c-20.86726%2020.878516-20.86726%2054.717206%200%2075.590606L435.390181%20511.053442%20302.492382%20643.959428c-20.957311%2020.951171-20.957311%2054.913681%200%2075.864852l0.005117%200c20.945031%2020.956288%2054.918797%2020.956288%2075.876108%200l132.892683-132.887566%20132.966361%20132.971477c20.877493%2020.849864%2054.717206%2020.849864%2075.584466%200l0-0.022513c20.8734-20.8734%2020.8734-54.694693%200-75.568093L586.851778%20511.345084l132.98171-132.977617C740.785683%20357.411179%20740.785683%20323.44867%20719.833489%20302.497499L719.833489%20302.497499z%22%20fill%3D%22%23d81e06%22%20p-id%3D%221268%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E",
                notice: "data:image/svg+xml,%3Csvg%20t%3D%221707286508566%22%20class%3D%22icon%22%20viewBox%3D%220%200%201024%201024%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20p-id%3D%221421%22%20width%3D%22200%22%20height%3D%22200%22%3E%3Cpath%20d%3D%22M511.49551%2064.648392c-247.341295%200-447.677019%20200.335724-447.677019%20447.677019s200.335724%20447.677019%20447.677019%20447.677019%20447.677019-200.335724%20447.677019-447.677019S758.837828%2064.648392%20511.49551%2064.648392zM509.817288%20612.492762c-32.456203%200-58.757219-25.741267-58.757219-58.198493L451.060069%20281.771455c0-32.456203%2026.301016-58.19747%2058.757219-58.19747%2031.896454%200%2058.19747%2025.741267%2058.19747%2058.19747l0%20272.522814C568.014758%20586.751494%20541.713742%20612.492762%20509.817288%20612.492762zM511.49551%20665.654542c37.492916%200%2067.711148%2030.218232%2067.711148%2067.711148%200%2037.492916-30.218232%2067.711148-67.711148%2067.711148-37.492916%200-67.711148-30.218232-67.711148-67.711148C443.785386%20695.872774%20474.003618%20665.654542%20511.49551%20665.654542z%22%20fill%3D%22%23efb336%22%20p-id%3D%221422%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E"
            }
            Toastify({
                text: message,
                duration: 2000, // 持续时间为1秒
                gravity: "top", // 显示在顶部
                position: "right", // 从右侧移入
                backgroundColor: "#F2F3F4", // 消息背景颜色
                stopOnFocus: true, // 当页面获取焦点时停止显示
                avatar: messageType[type] || "",
                style: {
                    borderRadius: "0.5rem", // 圆角大小
                    color: "grey" // 文字颜色
                }
            }).showToast();
        }
        const exportBtn = inventoryContainer.querySelector('#export');
        exportBtn.addEventListener('click', async () => {
            showToast('正在获取设备信息~', 'ok');
            const totalData = [];
            let page = 1;

            const fetchPageData = async (page) => {
                const response = await fetch(`https://test.baicizhan.com/api/phone/getPhoneInfos?page=${page}&limit=60`, {
                    method: 'GET'
                });
                if (!response.ok) throw new Error('网络请求失败~');

                const data = await response.json();
                if (data.data.length === 0) return; // 如果没有数据，停止请求

                showToast(`获取到第${page}页数据：${data.data.length}条`, 'ok');

                const today = new Date();
                const tempData = data.data.filter(item => {
                    const inDepotDate = new Date(item.inDepot);
                    return !isNaN(inDepotDate.getTime()) &&
                        (inDepotDate.getFullYear() !== today.getFullYear() ||
                         inDepotDate.getMonth() !== today.getMonth() ||
                         inDepotDate.getDate() !== today.getDate());
                }).map(({ brand: 品牌, deviceName: 设备名称, systemVersion: 系统版本, appearance: 外观, inDepot: 在库时间, lendOwner: 外借人, remark: 备注 }) => ({
                    品牌, 设备名称, 系统版本, 外观, 在库时间, 外借人, 备注
                }));

                totalData.push(...tempData);
                await fetchPageData(page + 1); // 递归调用获取下一页
            };

            try {
                await fetchPageData(page);
                showToast(`累计获取到${totalData.length}条数据～`, 'ok');

                if (totalData.length > 0) {
                    const header = '品牌,设备名称,系统版本,外观,在库时间,外借人,备注\n';

                    const convertToCSV = (objArray) => {
                        let str = header;
                        objArray.forEach(item => {
                            const line = Object.values(item).join(',');
                            str += line + '\r\n';
                        });
                        return str;
                    };

                    const downloadCSV = (data) => {
                        const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + convertToCSV(data); // 添加 BOM
                        const encodedUri = encodeURI(csvContent);
                        const link = document.createElement('a');
                        link.setAttribute('href', encodedUri);
                        link.setAttribute('download', '不在库设备明细.csv');
                        document.body.appendChild(link); // Required for FF
                        link.click();
                    };

                    downloadCSV(totalData);
                } else {
                    showToast('没有数据可下载！', 'warning');
                }
            } catch (error) {
                showToast(error.message, 'error');
            }
        });


        // 添加点击事件监听器，展开或关闭二维码资产盘点页面
        let isOpen = false;
        let intervalId = null; // 定时器 ID
        let videoStream = null; // 视频流对象
        cameraIcon.addEventListener('click', function () {
            isOpen = !isOpen;
            if (isOpen) {
                cameraIcon.textContent = '📸'
                inventoryContainer.style.display = 'block';
                // JavaScript 代码移到这里
                // 获取video和log元素
                const video = inventoryContainer.querySelector('#video');
                const canvas = inventoryContainer.querySelector('#canvas');
                let detectedResults = []; // 存储检测到的二维码数据的数组

                // 调用摄像头
                navigator.mediaDevices.getUserMedia({ video: true })
                    .then(function (stream) {
                    videoStream = stream;
                    video.srcObject = stream;
                    addLog("摄像头已启用~");
                })
                    .catch(function (error) {
                    addLog("打开摄像头失败: " + error.message, "error");
                    showToast("打开摄像头失败: " + error.message, "error");
                });

                // 每隔一秒拍照并解析二维码
                intervalId = setInterval(function () {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                    const imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height);
                    if (code) {
                        const currentResult = code.data;
                        addLog(`识别成功：${currentResult}`);

                        if (!detectedResults.includes(currentResult)) {
                            try {
                                // 尝试将JSON字符串解析为JSON对象
                                const jsonResult = JSON.parse(currentResult);

                                const today = new Date().toISOString().split('T')[0]; // 获取今天的日期，格式为 YYYY-MM-DD

                                // 构造要发送的数据对象
                                const postData = {
                                    id: jsonResult.id,
                                    inDepot: today
                                };

                                detectedResults.push(currentResult);
                                // 显示 Toast
                                let message = "正在更新「";
                                if (jsonResult.number !== "----------") {
                                    message += `${jsonResult.number}:`;
                                }
                                message += `${jsonResult.deviceName}`;
                                if (jsonResult.systemVersion !== "----------") {
                                    message += `-${jsonResult.systemVersion}`;
                                }
                                message += "」的在库时间~";
                                showToast(message, "processing");

                                // 发送 POST 请求
                                fetch('https://test.baicizhan.com/api/phone/updatePhoneInfos', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(postData)
                                })
                                    .then(response => {
                                    if (response.ok) {
                                        // 解析 JSON 数据
                                        return response.json();
                                    } else {
                                        // 如果请求失败，则抛出异常
                                        throw new Error('请求失败');
                                    }
                                })
                                    .then(data => {
                                    if (data.code === 0) {
                                        // 显示 Toast
                                        let message = "成功更新「";
                                        if (jsonResult.number !== "----------") {
                                            message += `${jsonResult.number}:`;
                                        }
                                        message += `${jsonResult.deviceName}`;
                                        if (jsonResult.systemVersion !== "----------") {
                                            message += `-${jsonResult.systemVersion}`;
                                        }
                                        message += "」的在库时间！";
                                        showToast(message, "ok");

                                    } else {
                                        // 如果返回的 code 不为 0，则抛出异常
                                        throw new Error(data.data);
                                    }
                                })
                                    .catch(error => {
                                    // 处理请求失败的情况
                                    // 如果索引大于-1，则表示找到了该元素
                                    let index = detectedResults.indexOf(currentResult);
                                    if (index !== -1) {
                                        // 使用 splice() 方法移除该元素
                                        detectedResults.splice(index, 1);
                                    }

                                    showToast("网络请求失败了~", "error")
                                });
                            } catch (error) {
                                showToast("无效的设备二维码~", "error")
                            }
                        }
                        else {
                            showToast("重复的设备二维码~", "notice")
                        }
                    }
                }, 500);
            } else {
                cameraIcon.textContent = '📷'
                const video = inventoryContainer.querySelector('#video');
                const logDiv = inventoryContainer.querySelector('#log');
                // 重置视频和日志区域
                video.srcObject = null; // 清除视频源
                logDiv.innerHTML = ''; // 清空日志区域内容

                // 关闭盘点页面
                inventoryContainer.style.display = 'none';
                // 清除定时器
                clearInterval(intervalId);
                // 停止视频流
                if (videoStream) {
                    const tracks = videoStream.getTracks();
                    tracks.forEach(track => track.stop());
                }
            }
        });
    })();
});
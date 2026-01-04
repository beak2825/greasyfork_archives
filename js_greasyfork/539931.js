// ==UserScript==
// @name         ACS Tracker
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  track the detailed submission status on ACS Publishing Platform.
// @author       zhangkaihua88
// @match        *://publish.acs.org/app*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=acs.org
// @grant        none
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/539931/ACS%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/539931/ACS%20Tracker.meta.js
// ==/UserScript==

/**
 * 监听包含特定字符串的所有API请求并返回响应数据
 * @param {string} targetString - 要匹配的目标字符串
 * @param {number} [timeout=30000] - 超时时间（毫秒）
 * @param {boolean} [captureAll=false] - 是否捕获所有匹配请求（否则只捕获第一个）
 * @returns {Promise<Object|Object[]>} - 包含响应数据的Promise（单个或数组）
 */
function listenForApiResponse(targetString, timeout = 30000, captureAll = false) {
    return new Promise((resolve, reject) => {
        // 用于存储原始 fetch 和 XMLHttpRequest 方法
        const originalFetch = window.fetch;
        const originalXhrOpen = XMLHttpRequest.prototype.open;

        // 存储所有匹配的响应
        const matchedResponses = [];

        // 超时计时器
        const timeoutId = setTimeout(() => {
            resetInterceptors();

            if (matchedResponses.length > 0) {
                resolve(captureAll ? matchedResponses : matchedResponses[0]);
            } else {
                reject(new Error(`监听超时: ${timeout}ms 内未捕获到包含 "${targetString}" 的请求`));
            }
        }, timeout);

        // 重置拦截器函数
        function resetInterceptors() {
            window.fetch = originalFetch;
            XMLHttpRequest.prototype.open = originalXhrOpen;
        }

        // 检查 URL 是否包含目标字符串
        function containsTargetString(url) {
            return url.toString().includes(targetString);
        }

        // 处理匹配的响应
        function handleMatchedResponse(data) {
            matchedResponses.push(data);

            if (!captureAll) {
                clearTimeout(timeoutId);
                resetInterceptors();
                resolve(data);
            }
        }

        // 拦截 Fetch API
        window.fetch = async function (input, init) {
            const url = typeof input === 'string' ? input : input.url;

            try {
                const response = await originalFetch.apply(this, arguments);

                // 如果URL包含目标字符串，获取响应数据
                if (containsTargetString(url)) {
                    const responseClone = response.clone();
                    const contentType = responseClone.headers.get('content-type');

                    let responseData;
                    if (contentType && contentType.includes('application/json')) {
                        responseData = await responseClone.json();
                    } else {
                        responseData = await responseClone.text();
                    }

                    handleMatchedResponse({
                        url,
                        method: init?.method || 'GET',
                        status: response.status,
                        data: responseData
                    });
                }

                return response;
            } catch (error) {
                // 如果出错且URL包含目标字符串，记录错误
                if (containsTargetString(url)) {
                    handleMatchedResponse({
                        url,
                        method: init?.method || 'GET',
                        error: error.message
                    });
                }
                throw error;
            }
        };

        // 拦截 XMLHttpRequest
        XMLHttpRequest.prototype.open = function (method, url) {
            const xhr = this;

            // 监听状态变化
            xhr.addEventListener('readystatechange', function () {
                if (xhr.readyState === 4 && containsTargetString(url)) {
                    let responseData;
                    try {
                        responseData = JSON.parse(xhr.responseText);
                    } catch (e) {
                        responseData = xhr.responseText;
                    }

                    handleMatchedResponse({
                        url,
                        method,
                        status: xhr.status,
                        data: responseData
                    });
                }
            });

            return originalXhrOpen.apply(this, arguments);
        };
    });
}

function convertToBeijingTime(dateString) {
    // 检查是否为特殊日期
    if (dateString === "0001-01-01T00:00:00") {
        return "";
    }

    const date = new Date(dateString);

    // Convert to Beijing Time (UTC +8) using toLocaleString with options
    return date.toLocaleString("zh-CN", {
        timeZone: "Asia/Shanghai", // Specify Beijing timezone
        hour12: false // Use 24-hour format
    });
}



function createTable(data) {
    // Create the table
    const table = document.createElement('table');

    // Apply basic styles
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.margin = '20px 0';
    table.style.fontFamily = 'Arial, sans-serif';
    table.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.1)';

    // Create table header
    const header = table.createTHead();
    const headerRow = header.insertRow(0);
    const headers = ["Task ID", "Task Name", "Task Status Name", "Status", "Started", "Completed", "Due"];

    // Apply header styles
    headers.forEach((headerText) => {
        const th = document.createElement('th');
        th.textContent = headerText;
        th.style.backgroundColor = '#4CAF50';
        th.style.color = 'white';
        th.style.padding = '10px';
        th.style.textAlign = 'left';
        th.style.fontSize = '16px';
        headerRow.appendChild(th);
    });

    // Create table body
    const body = table.createTBody();
    data.forEach(task => {
        const row = body.insertRow();

        // Apply alternating row colors
        if (body.rows.length % 2 === 0) {
            row.style.backgroundColor = '#f9f9f9'; // even row
        }

        row.addEventListener('mouseenter', () => {
            row.style.backgroundColor = '#f5f5f5'; // hover effect
        });
        row.addEventListener('mouseleave', () => {
            row.style.backgroundColor = body.rows.length % 2 === 0 ? '#f9f9f9' : ''; // revert back to alternate color
        });

        // Insert the task data into the table
        row.insertCell(0).textContent = task.taskId;
        row.insertCell(1).textContent = task.taskName;
        row.insertCell(2).textContent = task.taskStatusName;
        row.insertCell(3).textContent = task.taskStatus;
        row.insertCell(4).textContent = convertToBeijingTime(task.datetimeStarted);
        row.insertCell(5).textContent = convertToBeijingTime(task.datetimeCompleted);
        row.insertCell(6).textContent = convertToBeijingTime(task.datetimeDue);

        // Apply cell styles
        Array.from(row.cells).forEach(cell => {
            cell.style.padding = '8px';
            cell.style.textAlign = 'left';
            cell.style.borderBottom = '1px solid #ddd';
            cell.style.fontSize = '14px';
        });
    });

    return table;
}



(function () {
    
    function startListening() {
        listenForApiResponse('integration/s1/submissions/submissionInfo?')
            .then(result => {
                console.log('匹配的API响应:', result.data.response.result.submissionStatus.task);
                // Attach the table to the page
                const taskTableContainer = document.querySelector('.page-section__container');
                const container = document.createElement('div');
                container.style.overflowX = 'auto';
                container.style.padding = '15px';
                container.appendChild(createTable(result.data.response.result.submissionStatus.task));

                // Insert the container as the first child of taskTableContainer
                const firstChild = taskTableContainer.firstChild;
                taskTableContainer.insertBefore(container, firstChild);

                // 监听结束后重新启动
                startListening();
            })
            .catch(error => {
                console.error('监听错误:', error.message);
                // 出错后也尝试重新启动
                startListening();
            });
    }

    startListening();

})();
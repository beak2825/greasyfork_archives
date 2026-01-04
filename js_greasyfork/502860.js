// ==UserScript==
// @name         快焊焊v2
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Find LCID in specific elements, fetch tiaoma from PHP API, and insert into corresponding element
// @author       王思
// @include      file:///*/*.html
// @grant        GM_xmlhttpRequest
// @license Apache V2.0
// @downloadURL https://update.greasyfork.org/scripts/502860/%E5%BF%AB%E7%84%8A%E7%84%8Av2.user.js
// @updateURL https://update.greasyfork.org/scripts/502860/%E5%BF%AB%E7%84%8A%E7%84%8Av2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to build multipart/form-data body
    function buildMultipartBody(fields) {
        let boundary = "----WebKitFormBoundary" + Math.random().toString(36).substring(2);
        let body = '';

        for (let [key, value] of Object.entries(fields)) {
            body += `--${boundary}\r\n`;
            body += `Content-Disposition: form-data; name="${key}"\r\n\r\n`;
            body += `${value}\r\n`;
        }

        body += `--${boundary}--`;

        return { body, boundary };
    }

    // Function to fetch tiaoma based on LCID using POST request
    function fetchTiaoma(lcid) {
        // 内部函数处理API请求
        function makeRequest(searchValue) {
            return new Promise((resolve, reject) => {
                const fields = {
                    'fields[]': 'LCID',
                    'values[]': searchValue
                };

                const { body, boundary } = buildMultipartBody(fields);

                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://work.xianwill.cn/search/search.php',
                    headers: {
                        'Content-Type': `multipart/form-data; boundary=${boundary}`
                    },
                    data: body,
                    onload: function (response) {
                        if (response.status === 200) {
                            try {
                                const data = JSON.parse(response.responseText);
                                console.log('Received data for ' + searchValue + ':', data);
                                resolve(data.length > 0 ? data[0].tiaoma : null);
                            } catch (error) {
                                console.error('Error parsing response:', error);
                                reject(null);
                            }
                        } else {
                            console.error('Network connection test failed:', response.statusText);
                            reject(null);
                        }
                    },
                    onerror: function (error) {
                        console.error('Network connection test error:', error);
                        reject(null);
                    }
                });
            });
        }

        // 主函数逻辑
        return new Promise(async (resolve, reject) => {
            try {
                // 先尝试使用 'K'+LCID 格式
                const kResult = await makeRequest('K' + lcid);
                if (kResult) {
                    console.log('Found result with K prefix');
                    resolve(kResult);
                    return;
                }

                // 如果没有结果，使用原始LCID
                console.log('No result with K prefix, trying original LCID');
                const originalResult = await makeRequest(lcid);
                resolve(originalResult);
            } catch (error) {
                console.error('Error in fetchTiaoma:', error);
                reject(null);
            }
        });
    }

    // Select all elements with style="min-width: 66px;"
    const elements = document.querySelectorAll('[style="min-width: 66px;"]');

    // Regular expression to match the numbers like C2848197 (LCID)
    const numberPattern = /C\d+/;

    elements.forEach(async element => {
        const textElement = element.querySelector('p');
        if (textElement) {
            const text = textElement.textContent;
            console.log('Found text:', text);

            const match = text.match(numberPattern);
            if (match) {
                const lcid = match[0];
                console.log('Matched LCID:', lcid);

                // Fetch tiaoma from PHP API
                const tiaoma = await fetchTiaoma(lcid);
                if (tiaoma) {
                    // Find the nearest previous element with style="position: relative; min-width: 70px;"
                    const previousElement = element.closest('tr').querySelector('[style="position: relative; min-width: 70px;"] span');
                    if (previousElement) {
                        console.log('Inserting tiaoma:', tiaoma, 'into element:', previousElement);
                        previousElement.textContent += ` ${tiaoma}`;
                    }
                }

                // Wrap the matched number with <b> tags
                textElement.innerHTML = text.replace(numberPattern, `<b>${lcid}</b>`);
            }
        }
    });



    // 创建并添加按钮
    function createUnsolderButton() {
        const toolsDiv = document.querySelector('div._toolsDiv_i9p18_15');
        if (!toolsDiv) return;

        const button = document.createElement('div');
        button.className = '_toolsDiv-item_i9p18_19';
        button.title = '获取未焊接元件';
        button.innerHTML = '<span>获取未焊接元件</span>';

        button.addEventListener('click', getUnsoldered);
        toolsDiv.appendChild(button);
    }

    // 修改 getUnsoldered 函数
    function getUnsoldered() {
        console.log('getUnsoldered function called');
        const unsoldered = [];

        const cells = document.querySelectorAll('td[style="position: relative; min-width: 70px;"]');
        console.log('Found cells:', cells.length);

        // 收集所有未焊接元件信息
        cells.forEach(cell => {
            const checkbox = cell.querySelector('input[type="checkbox"]');
            if (!checkbox || !checkbox.checked) {
                const row = cell.closest('tr');
                const tiaoma = cell.querySelector('span')?.textContent.trim() || '';
                const key = row.querySelector('td[style="min-width: 70px;"] p')?.textContent.trim() || '';
                const model = row.querySelector('div._pointerDiv_gt7qz_18 p')?.textContent.trim() || '';
                const packaging = row.querySelector('td[style="min-width: 90px;"] p')?.textContent.trim() || '';
                const lcid = row.querySelector('td[style="min-width: 66px;"] b')?.textContent.trim() || '';
                const quantity = row.querySelector('td[style="min-width: 63px;"] p')?.textContent.replace('使用:', '').trim() || '';

                unsoldered.push({
                    tiaoma,
                    key,
                    model,
                    packaging,
                    lcid,
                    quantity
                });
            }
        });

        // 按前缀分组和排序
        const groups = {
            K: [], R: [], C: [], U: [], D: [], T: [], others: []
        };

        unsoldered.forEach(item => {
            const tiaoma = item.tiaoma;
            if (!tiaoma) {
                groups.others.push(item);
                return;
            }

            const prefix = tiaoma.charAt(0);
            const number = parseInt(tiaoma.slice(1));

            if (prefix in groups && !isNaN(number)) {
                groups[prefix].push({ ...item, number });
            } else {
                groups.others.push(item);
            }
        });

        // 对每个分组按number排序
        for (let key in groups) {
            if (key !== 'others') {
                groups[key].sort((a, b) => a.number - b.number);
            }
        }

        // 按指定顺序合并所有分组
        const orderedGroups = [
            ...groups.K,  // K开头的条码（按数字排序）
            ...groups.R,  // R开头的条码（按数字排序）
            ...groups.C,  // C开头的条码（按数字排序）
            ...groups.U,  // U开头的条码（按数字排序）
            ...groups.D,  // D开头的条码（按数字排序）
            ...groups.T,  // T开头的条码（按数字排序）
            ...groups.others // 其他条码
        ];

        // 格式化内容并复制到剪贴板
        const content = orderedGroups.map(item =>
            `${item.tiaoma} ${item.key} ${item.model} ${item.packaging} ${item.lcid} ${item.quantity}`
        ).join('\n');

        // 复制到剪贴板
        navigator.clipboard.writeText(content)
            .then(() => {
                // 创建临时提示
                const toast = document.createElement('div');
                toast.textContent = `已复制 ${orderedGroups.length} 个未焊接元件信息到剪贴板`;
                toast.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: #333;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 4px;
                    z-index: 9999;
                `;
                document.body.appendChild(toast);

                // 2秒后移除提示
                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 2000);
            })
            .catch(err => console.error('复制失败:', err));
    }

    // 初始化
    createUnsolderButton();

})();

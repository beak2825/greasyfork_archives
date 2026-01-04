// ==UserScript==
// @name         直播小车工单数据过滤
// @namespace    http://your-namespace.com/
// @version      1.7
// @description  固定请求参数并过滤返回数据，增加关闭按钮
// @author       barrylou
// @license      barrylou
// @match        https://ops.xiaoe-tools.com/*
// @grant        GM_addStyle
// @icon         https://commonresource-1252524126.cdn.xiaoeknow.com/image/lhyaurs50zil.ico
// @downloadURL https://update.greasyfork.org/scripts/529553/%E7%9B%B4%E6%92%AD%E5%B0%8F%E8%BD%A6%E5%B7%A5%E5%8D%95%E6%95%B0%E6%8D%AE%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/529553/%E7%9B%B4%E6%92%AD%E5%B0%8F%E8%BD%A6%E5%B7%A5%E5%8D%95%E6%95%B0%E6%8D%AE%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // 配置参数
    const CONFIG = {
        TARGET_API: '/ops/xe.bs.iteration.get.list/1.0.0',
        // 目标接口
        FIXED_PARAMS: {
            // 固定请求参数
            coding_order_stage: [
                120
            ],
            //120:leader已审批
            is_bind_plan: 0,
            //0:未绑定计划
            page_size: 20,
        },
        FILTER_KEYWORDS: [
            '直播平台',
            '直播产品',
            '零售产品中心-直播'
        ],
        // 部门过滤关键词
        DISPLAY_DURATION: 5000,
        // 结果显示时长（毫秒）
        DIRTY_TIME: '-0001-',
        // 脏数据时间（部分匹配）
    };
    // 迭代类型映射
    const iteration_type_map = {
        '1': '小版本',
        '3': '大版本',
        '4': '缺陷修复'
    };
    // 样式注入
    GM_addStyle(`
#custom-filter-result {
position: fixed;
top: 20px;
right: 20px;
padding: 12px 20px;
background: #2196F3;
color: white;
border-radius: 4px;
box-shadow: 0 2px 10px rgba(0,0,0,0.2);
z-index: 99999;
font-family: system-ui;
transition: opacity 0.3s;
}
#custom-filter-result.hide {
opacity: 0;
pointer-events: none;
}
#custom-filter-table {
position: fixed;
top: 80px;
right: 20px;
background: white;
color: #333;
border-radius: 4px;
box-shadow: 0 2px 10px rgba(0,0,0,0.2);
z-index: 99999;
font-family: system-ui;
padding: 12px;
max-width: 600px;
max-height: 400px;
overflow-y: auto;
}
#custom-filter-table table {
width: 100%;
border-collapse: collapse;
}
#custom-filter-table th,
#custom-filter-table td {
padding: 8px;
border: 1px solid #ddd;
text-align: left;
}
#custom-filter-table th {
background: #f5f5f5;
}
#custom-filter-table a {
color: #2196F3;
text-decoration: none;
}
#custom-filter-table a:hover {
text-decoration: underline;
}
#custom-filter-table .close-btn {
position: absolute;
top: 10px;
right: 10px;
background: #ff4444;
color: white;
border: none;
border-radius: 50%;
width: 22px;
height: 22px;
cursor: pointer;
display: flex;
align-items: center;
justify-content: center;
font-size: 14px;
}
#custom-filter-table .close-btn:hover {
background: #cc0000;
}
`);
    // 固定请求参数
    function modifyRequestData(body) {
        try {
            const requestData = body ? JSON.parse(body) : {};
            return JSON.stringify({
                ...requestData,
                ...CONFIG.FIXED_PARAMS,
            });
        } catch (e) {
            console.error('请求参数处理失败:',e);
            return body;
        }
    }
    // 过滤返回数据
    function filterResponseData(data) {
        try {
            const today = new Date();
            today.setHours(0,0,0,0); // 当天零点时间戳
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1); // 昨天零点

            return data.list.filter(item => {
                // 过滤掉 iteration_type 为 3 的数据
                if (item.iteration_type == 3) {
                    return false;
                }

                // 排除脏数据（部分匹配 -0001-）
                if (item.completion_time?.includes(CONFIG.DIRTY_TIME)) {
                    return false;
                }

                // 部门过滤条件
                const departmentValid = CONFIG.FILTER_KEYWORDS.some(keyword =>item.department_id?.includes(keyword));

                // 时间过滤条件
                const completionTime = new Date(item.completion_time).getTime();
                const timeValid = completionTime >= yesterday.getTime(); // 大于等于昨天

                return departmentValid && timeValid;
            }).map(item => {
                // 转义 iteration_type
                item.iteration_type_text = iteration_type_map[item.iteration_type] || '未知类型';
                return item;
            });
        } catch (e) {
            console.error('返回数据过滤失败:',
                          e);
            return [];
        }
    }
    // 显示过滤结果
    function displayResult(filteredData) {
        // 显示数量
        let resultDiv = document.getElementById('custom-filter-result');
        if (!resultDiv) {
            resultDiv = document.createElement('div');
            resultDiv.id = 'custom-filter-result';
            document.body.appendChild(resultDiv);
        }
        resultDiv.innerHTML = `符合条件工单：<b>${filteredData.length
    }</b> 条`;
        resultDiv.classList.remove('hide');
        // 自动隐藏
        setTimeout(() => {
            resultDiv.classList.add('hide');
        },
                   CONFIG.DISPLAY_DURATION);
        // 显示表格
        let tableContainer = document.getElementById('custom-filter-table');
        if (!tableContainer) {
            tableContainer = document.createElement('div');
            tableContainer.id = 'custom-filter-table';
            document.body.appendChild(tableContainer);
        }
        // 渲染表格
        if (filteredData.length > 0) {
            const tableHTML = `
<button class="close-btn" title="关闭">×</button>
<table>
<thead>
<tr>
<th>迭代名称</th>
<th>工单链接</th>
<th>迭代类型</th>
<th>部门</th>
<th>完成时间</th>
</tr>
</thead>
<tbody>
${filteredData.map(item => `
<tr>
<td>${item.iteration_name || '无'}</td>
            <td><a href="${item.coding_order_url}" target="_blank">查看工单</a></td>
            <td>${item.iteration_type_text || '未知类型'}</td>
            <td>${item.department_id || '无'}</td>
            <td>${item.completion_time || '无'}</td>
</tr>`).join('')}
</tbody>
</table>
`;
            tableContainer.innerHTML = tableHTML;
            // 绑定关闭按钮事件
            const closeBtn = tableContainer.querySelector('.close-btn');
            closeBtn.addEventListener('click',
                                      () => {
                tableContainer.style.display = 'none';
            });
        } else {
            tableContainer.innerHTML = '无符合条件的数据';
        }
    }
    // 拦截XHR
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function(method,
                                              url) {
        this._requestURL = url; // 记录请求URL
        return originalOpen.apply(this,
                                  arguments);
    };
    XMLHttpRequest.prototype.send = function(body) {
        const xhr = this;
        // 修改请求参数
        if (xhr._requestURL.includes(CONFIG.TARGET_API)) {
            body = modifyRequestData(body);
        }
        // 拦截响应
        const originalOnload = xhr.onload;
        xhr.onload = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    // 过滤返回数据
                    if (xhr._requestURL.includes(CONFIG.TARGET_API)) {
                        const filteredData = filterResponseData(response.data);
                        displayResult(filteredData);
                    }
                } catch (e) {
                    console.error('响应数据处理失败:',
                                  e);
                }
            }
            // 调用原始onload
            originalOnload?.apply(xhr,
                                  arguments);
        };
        // 发送请求
        originalSend.call(xhr,
                          body);
    };
    console.log('脚本已加载，等待拦截目标接口...');
})();
// ==UserScript==
// @name         k8s接口统计
// @namespace    http://tampermonkey.net/
// @version      2024-05-23
// @description  迅速查看最耗时的接口、最大的接口、调用次数最多的接口
// @author       Peter Chiang
// @match        http://*/*
// @match        https://*/*
// @icon         https://www.microsoft.com/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495862/k8s%E6%8E%A5%E5%8F%A3%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/495862/k8s%E6%8E%A5%E5%8F%A3%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

})();

// 出口接口延迟
function getOutgoingApis(hitsArray) {
    let outPutDetails = [];
    hitsArray.forEach((hit) => {
      // 获取_source.message的值
      const messageString = hit._source.message;
      const appname = hit._source.appname;
      // 解析message字符串为JSON对象
      try {
        const messageJSON = JSON.parse(messageString);
        const utcDateString = hit._source['@timestamp'];
        const date = new Date(utcDateString);
        const localDateString = date.toLocaleString();

        if (messageJSON.path && messageJSON.path.length > 0) {
          // 将message的大小和对应的uri存储到数组中
          outPutDetails.push({
            size: messageString.length / 1000,
            appname,
            path: messageJSON.path,
            latency: parseInt(messageJSON.latency),
            timestamp: localDateString,
            trace_id: messageJSON.trace_id,
          });
        }
      } catch (parseError) {
        // console.info('Error parsing message to JSON:', parseError);
      }
    });
    return outPutDetails;
}

// 微服务接口大小排序
function getMicroServiceApis(hitsArray) {
    let messageDetails = [];
    hitsArray.forEach((hit) => {
      // 获取_source.message的值
      const messageString = hit._source.message;
      const appname = hit._source.appname;
      // 解析message字符串为JSON对象
      try {
        const messageJSON = JSON.parse(messageString);
        if (messageJSON.uri && messageJSON.uri.length > 0) {
          // 将message的大小和对应的uri存储到数组中
          messageDetails.push({
            size: messageString.length / 1000,
            appname,
            path: messageJSON.uri,
            latency: parseFloat(messageJSON.latency),
            trace_id: messageJSON.trace_id,
          });
        }
      } catch (parseError) {
        // console.info('Error parsing message to JSON:', parseError);
      }
    });
    return messageDetails;
}

function countAndSortPaths(arr) {
    // 创建一个 Map 来存储每个路径及其出现次数
    const pathCount = new Map();

    // 遍历数组，统计每个路径的出现次数
    for (const item of arr) {
        if (pathCount.has(item.path)) {
            pathCount.set(item.path, pathCount.get(item.path) + 1);
        } else {
            pathCount.set(item.path, 1);
        }
    }
    // 将 Map 转换为对象数组，并按照出现次数排序
    const sortedPaths = Array.from(pathCount.entries()).sort((a, b) => b[1] - a[1]);

    // 创建一个对象来存储排序后的路径及其出现次数
    const result = [];
    for (const [path, count] of sortedPaths) {
        result.push({
            path,
            count
        });
    }
    return result;
}


function arrayToCSV(dataArray) {
    // 将对象数组转换为 CSV 字符串
    const csvRows = [];
    const headers = ['appname', 'path', 'size', 'latency', 'count', 'trace_id'];
    csvRows.push(headers.join(','));
    for (const row of dataArray) {
        const values = headers.map(header => {
            let value = row[header] || '';
            if (typeof value === "string") {
                value = value.replace(/"/g, '""');
            }
            return value;
        }).join(',');
        csvRows.push(values);
    }

    return csvRows.join('\n');
}

function downloadCSV(csvData, filename) {
    // 创建 Blob 对象
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    // 创建下载链接
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;
    // 添加链接至 DOM，模拟点击下载
    document.body.appendChild(link);
    link.click();
    // 移除链接并释放 URL
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// 保存原始的 XMLHttpRequest 方法
const originalOpen = XMLHttpRequest.prototype.open;
const originalSend = XMLHttpRequest.prototype.send;

// 重写 open 方法
XMLHttpRequest.prototype.open = function(method, url) {
    this._method = method;
    this._url = url;
    return originalOpen.apply(this, arguments);
};

// 重写 send 方法
XMLHttpRequest.prototype.send = function(body) {
    this.addEventListener('load', function() {
        const keyword1 = '/elasticsearch';
        const keyword2 = '/_search';
        const url = this._url;
        const needResponds = (url && url.includes(keyword1) && url.includes(keyword2) && this.status === 200)
        if (needResponds) {

            const jsonData = JSON.parse(this.responseText);
            // 获取原始数据
            const hitsArray = jsonData.hits.hits;
            // APP接口
            const outGoing = getOutgoingApis(hitsArray);
            let outGoingSort = outGoing.sort((item1, item2)=> item2.latency - item1.latency);
            const latenceTop20 = outGoingSort.slice(0, 20);
            console.log('latenceTop20', latenceTop20);
            // 微服务接口
            const microApis = getMicroServiceApis(hitsArray);
            const microApisSort = microApis.sort((item1, item2)=> item2.size - item1.size);
            const sizeTop20 = microApisSort.slice(0, 20);
            console.log('sizeTop20', sizeTop20);
            // 频率
            const pathsArray = outGoing;
            pathsArray.concat(microApis);
            const frequnceyTop20 = countAndSortPaths(pathsArray);

            const latencyHeader = {appname: '延迟TOP20', size: 0, path: '', latency: 0, timestamp: 0};
            const sizeHeader = {appname: '数据量TOP20'};
            const frequenceHeader = {appname: '调用频次TOP20'};
            let cvsData = [];
            cvsData.push(latencyHeader);
            cvsData = cvsData.concat(latenceTop20);
            cvsData.push(sizeHeader);
            cvsData = cvsData.concat(sizeTop20);
            cvsData.push(frequenceHeader);
            cvsData = cvsData.concat(frequnceyTop20);
            const cvsResult = arrayToCSV(cvsData);
            //  转化和下载
            const inputElement = document.querySelector('.euiFieldText.euiFieldText--fullWidth.euiFieldText--inGroup');
            const timeString = new Date().toLocaleString();
            // const downloadFuc = () => downloadCSV(cvsResult, `k8s-${timeString}-${inputElement.value || ''}`);

            const oldButton = document.getElementById('pertercvs');
            if (oldButton) {
                oldButton.remove();
            }
            // 通过类名选择器找到 <span> 元素
            const spanElement = document.querySelector('span.euiButton__text');
            // 创建一个新的 <button> 元素
            const downloadBtn = document.createElement('button');
            downloadBtn.textContent = '统计数据';
            downloadBtn.id = 'pertercvs';
            if (spanElement) {
                spanElement.parentNode.insertBefore(downloadBtn, spanElement.nextSibling);
                downloadBtn.addEventListener('click', function(){
                downloadCSV(cvsResult, `k8s-${timeString}-${inputElement.value || ''}`);
            });
            }


        }

    });
    return originalSend.apply(this, arguments);
};

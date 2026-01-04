// ==UserScript==
// @name         IYUU 可辅种数查看助手
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动从页面中提取Hash码并查询IYUU可辅种总数
// @grant        GM_xmlhttpRequest
// @author       Schalkiii
// @match        http*://*/details*.php*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523202/IYUU%20%E5%8F%AF%E8%BE%85%E7%A7%8D%E6%95%B0%E6%9F%A5%E7%9C%8B%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/523202/IYUU%20%E5%8F%AF%E8%BE%85%E7%A7%8D%E6%95%B0%E6%9F%A5%E7%9C%8B%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 定义一个全局变量来存储tidTotal
    var tidTotal = null;
    // 从页面中提取Hash码
    const add_hashRegex = /<b>Hash[码碼]:<\/b>&nbsp;([a-f0-9]{40})/i;
    const add_bodyText = document.body.innerHTML;
    const add_hash = add_hashRegex.exec(add_bodyText);
    // 检查是否找到Hash码，并输出相应的信息
    if (add_hash && add_hash[1]) {
        console.log(`iyuu可辅种总数查找：已找到，hash码为：${add_hash[1]}`);
        // 构建完整的请求URL
        var add_url = 'http://api.iyuu.cn/index.php?s=App.Api.GetSubject&info_hash=' + add_hash[1];
        console.log(`iyuu可辅种总数查找：请求URL为：${add_url}`)

        // 发起请求
        GM_xmlhttpRequest({
            url: add_url, // 请求的URL
            method: 'GET', // 请求方式
            responseType: "json",
            onload: function(response) {
                console.log('iyuu可辅种总数查找：请求成功，状态码：', response.status); // 输出状态码
                if (response.status === 200) {
                    try {
                        const json = JSON.parse(response.responseText); // 解析JSON
                        if (json.ret === 200) {
                            console.log('iyuu可辅种总数查找：数据解析成功：', json.data);
                            tidTotal = Math.max(json.data.pid_total, json.data.tid_total); // 获取tid_total
                            console.log('iyuu可辅种总数查找：tid_total:', tidTotal); // 输出tid_total

                            // 在“下载种子”行末尾添加辅种数
                            const downloadLinkRow = document.querySelector('td.rowfollow a[title*="下载种子"], td.rowfollow a[title*="下載種子"]').closest('tr');
                            if (downloadLinkRow) {
                                const tidTotalText = document.createElement('span');
                                tidTotalText.innerHTML = `&nbsp;|&nbsp;<b><font class="small">可辅种数: ${tidTotal}</font></b>`;
                                downloadLinkRow.querySelector('td.rowfollow').appendChild(tidTotalText);
                                console.log('iyuu可辅种总数查找：辅种数已添加到页面');
                            } else {
                                console.error('iyuu可辅种总数查找：未找到“下载种子”行');
                            }

                        } else {
                            console.log('iyuu可辅种总数查找：返回的ret不是200，实际返回:', json.ret);
                        }
                    } catch (e) {
                        console.error('iyuu可辅种总数查找：JSON解析失败:', e); // 输出解析错误
                    }
                } else {
                    console.error('iyuu可辅种总数查找：请求失败，状态码：', response.status); // 输出错误状态码
                }
            },
            onerror: function(error) {
                console.error('iyuu可辅种总数查找：请求发生错误:', error); // 输出请求错误信息
            }
        });
    } else {
        console.log("iyuu可辅种总数查找：未找到hash码！");
    }
})();
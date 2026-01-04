// ==UserScript==
// @name         b站去掉`换一换`按钮返回广告
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  b站去掉右侧`换一换`按钮返回广告
// @author       blueSLot
// @license MIT
// @run-at       document-start
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?domain=undefined.
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/488546/b%E7%AB%99%E5%8E%BB%E6%8E%89%60%E6%8D%A2%E4%B8%80%E6%8D%A2%60%E6%8C%89%E9%92%AE%E8%BF%94%E5%9B%9E%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/488546/b%E7%AB%99%E5%8E%BB%E6%8E%89%60%E6%8D%A2%E4%B8%80%E6%8D%A2%60%E6%8C%89%E9%92%AE%E8%BF%94%E5%9B%9E%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

const originFetch = fetch;
unsafeWindow.fetch = async (...args) => {
    console.log('fetch arg', ...args);
    if (args[0].includes('https://api.bilibili.com/x/web-interface/wbi/index/top/feed/rcmd')) {
        try {
            const response = await originFetch(...args);
            const data = await response.json(); // Assuming response is JSON, adjust if necessary

            // 再次发送请求，获取数据，将截取到的数据里的广告项替换为再次请求的随机非广告项
            const response2 = await originFetch(...args);
            const data2 = await response2.json(); // Assuming response is JSON, adjust if necessary
            console.log('再次请求的数据:', data2);
            let no_ad_items = [];
            for (let i = 0; i < data2.data.item.length; i++) {
                if (data2.data.item[i].id !== 0) {
                    no_ad_items.push(data2.data.item[i]);
                }
            }


            // Replace the item with id 0 with the first item in no_ad_items
            if (data.data.item.length > 1) {
                for (let i = 0; i < data.data.item.length; i++) {
                    if (data.data.item[i].id === 0) {
                        data.data.item[i] = no_ad_items[0];
                        break; // 如果找到匹配的id=0项，立即退出循环
                    }
                }
            }

            //console.log('修改后的返回内容:', data);

            // Re-enable the original fetch and return the modified response
            unsafeWindow.fetch = originFetch;
            return new Response(JSON.stringify(data), response);
        } catch (error) {
            console.error('请求出错:', error);
            throw error;
        }
    } else {
        return originFetch(...args);
    }
};
// ==UserScript==
// @name    Ang Sinabi Ko
// @description Heto ako. Kukunin ko ang mga sinabi ko.
// @match   https://m.douban.com/people/*
// @version 1.2
// @grant   unsafeWindow
// @grant   GM_xmlhttpRequest
// @run-at  document-end
// @license MIT
// @namespace https://greasyfork.org/users/219930
// @downloadURL https://update.greasyfork.org/scripts/442063/Ang%20Sinabi%20Ko.user.js
// @updateURL https://update.greasyfork.org/scripts/442063/Ang%20Sinabi%20Ko.meta.js
// ==/UserScript==

// 用 Promise 简单地封装一下 GM_xmlhttpRequest
function get(url) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url,
            headers: {
                Referer: 'https://m.douban.com/',
            },
            onload: (res) => resolve(JSON.parse(res.response)),
            onerror: reject,
        });
    });
}

(async () => {
    // 获取当前登录用户相关信息
    const { user } = unsafeWindow.__INITIAL_STATE__;

    // 简易的交互界面
    const panel = document.createElement('div');
    panel.style.cssText = `
    position: fixed;
    top: calc(50% - 5em);
    left: calc(50% - 10em);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 20em;
    height: 10em;
    padding: 2em 2em 1em;
    border-radius: 0.5em;
    background-color: #fff;
    box-shadow:
        0px 0px 3.6px -2px rgba(0, 0, 0, 0.035),
        0px 0px 10px -2px rgba(0, 0, 0, 0.05),
        0px 0px 24.1px -2px rgba(0, 0, 0, 0.065),
        0px 0px 80px -2px rgba(0, 0, 0, 0.1);
    font-size: 1.25em;
    `;

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', '关闭');
    closeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>';
    closeButton.style.cssText = `
    position: absolute;
    top: 0.5em;
    right: 0.5em;
    padding: 0.25em;
    background: transparent;
    border: 0;
    width: 1.8em;
    height: 1.8em;
    color: #777;
    cursor: pointer;
    `;
    closeButton.addEventListener('click', () => panel.remove());

    const desc = document.createElement('p');
    desc.innerHTML = `当前登录用户: <strong>${user.name}<strong>`;

    const button = document.createElement('button');
    button.type = 'button';
    button.style.cssText = `
    border: 0;
    padding: 0.5em 0.8em;
    border-radius: 1.25em;
    background-color: #42bd56;
    color: #fff;
    font-size: 1.125em;
    cursor: pointer;
    `;
    button.textContent = '抓取当前用户广播数据';

    panel.append(closeButton, desc, button);
    document.body.append(panel);

    // 爬取逻辑
    const fetchPosts = (month, filter = '') => get(`https://m.douban.com/rexxar/api/v2/user/${user.id}/lifestream?slice=month-${month}&hot=false&filter_after=${filter}&count=50&ck=azd0&for_mobile=1`);

    button.addEventListener('click', async () => {
        button.disabled = true;
        const tip = document.createElement('p');
        tip.textContent = '抓取中，预计需要几分钟，完成后将自动下载数据';
        tip.style.fontSize = '0.75em';
        panel.append(tip);

        // 获取当前用户的注册年份和月份
        const { reg_time: regTime } = await get(`https://m.douban.com/rexxar/api/v2/user/${user.id}?ck=azd0&for_mobile=1`);
        const regTimeParts = regTime.split('-');
        const regYear = Number(regTimeParts[0]);
        const regMonth = Number(regTimeParts[1]);

        // 获取当下的年份和月份
        const date = new Date();
        const currentYear = date.getFullYear();
        const currentMonth = date.getMonth() + 1;

        // 计算从注册时间到当下时间之间的所有月份
        const months = new Array(currentYear - regYear + 1).fill(null)
            .map((_, i) => regYear + i)
            .flatMap((year) => {
                const startMonth = (year === regYear) ? regMonth : 1;
                const endMonth = (year === currentYear) ? currentMonth : 12;
                const monthCount = endMonth - startMonth + 1;
                return new Array(monthCount).fill(null)
                    .map((_, j) => `${year}-${j + startMonth}`);
            });

        // 通过豆瓣移动端的公共接口逐一爬取每个月份的广播
        const posts = {};
        for (let i = 0; i < months.length; i++) {
            const month = months[i];
            const data = await fetchPosts(month);
            posts[month] = data.items;

            // 该接口一次性最多只能获取50条，若存在`next_filter_after`则说明该月份还有更多广播，需要继续获取
            let nextFilterAfter = data.next_filter_after;
            while (nextFilterAfter) {
                const data = await fetchPosts(month, nextFilterAfter);
                posts[month].push(...data.items);
                nextFilterAfter = data.next_filter_after;
            }
        }

        // 以json文件形式下载获取完的所有广播
        const file = new File([JSON.stringify(posts, null, 4)], { type: 'plain/text' });
        const url = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.download = 'douban.json';
        link.href = url;
        link.click();

        tip.textContent = '抓取完毕，请在你的下载目录里查找 douban.json 文件'
        button.disabled = false;
    });
})();
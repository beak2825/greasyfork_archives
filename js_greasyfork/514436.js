// ==UserScript==
// @name         lemon种子查询筛选
// @namespace    http://tampermonkey.net/
// @version      9@2024-11-07
// @description  用于筛选待审核
// @author       You
// @match        https://lemonhd.club/torrents.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lemonhd.club
// @run-at       document-end
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/514436/lemon%E7%A7%8D%E5%AD%90%E6%9F%A5%E8%AF%A2%E7%AD%9B%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/514436/lemon%E7%A7%8D%E5%AD%90%E6%9F%A5%E8%AF%A2%E7%AD%9B%E9%80%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let allLinks = [];
    const regex = /-(lhd|league[a-zA-Z0-9]{2,3})$|diy@leaguehd$/i;
    const filter_pass = true;
    const filter_only_gz = true;
    const filter_anonymous = true;
    const max_page = 0;
    const remove_delay = 3000;
    const userCount = {};
    // 获取当前页面的 URL
    const baseUrl = new URL(window.location.href);
    var curUser = document.querySelector('#info_block span[title*="审核组"]').textContent;
    const blackList = ['xcydhl','crabgg', 'Hamster'];
    if(curUser && blackList.some(a => curUser.includes(a))){
        alert('收手吧傻逼');
        return;
    }

    window.onload = () => {
        // 创建统计信息区域
        const statsDiv = document.createElement('div');
        statsDiv.id = 'statsArea';
        statsDiv.style.marginTop = '20px';

        // 创建统计信息表格并设置 id
        const statsTable = document.createElement('table');
        statsTable.id = 'statsTable'; // 给 table 添加 id 以便后续操作
        statsTable.border = '1';

        // 添加表头
        statsTable.innerHTML = `
    <thead>
        <tr>
            <th>用户名</th>
            <th>条数</th>
        </tr>
    </thead>
    <tbody></tbody> <!-- 用于动态添加行 -->
`;

     // 添加按钮区域
     const buttonsDiv = document.createElement('div');
     buttonsDiv.style.marginTop = '10px';

     const button1 = document.createElement('button');
     button1.innerText = '精简搜索';
     button1.id = 'filtersearch';

     document.addEventListener('click', (event) => {
         if (event.target && event.target.id === 'filtersearch') {
             event.preventDefault();
             console.log('click 精简搜索');
             filterRows();
         }
     });

     const button2 = document.createElement('button');
     button2.innerText = '精简打开';
     button2.id = 'filterOpen';

     document.addEventListener('click', (event) => {
         if (event.target && event.target.id === 'filterOpen') {
             event.preventDefault();
             console.log('click 精简打开');

             // 调用函数打开链接，不超过20个每批，延时1秒
             openLinksInBatches(allLinks);

         }
     });


     buttonsDiv.appendChild(button1);
     buttonsDiv.appendChild(button2);
     statsDiv.appendChild(statsTable);
     statsDiv.appendChild(buttonsDiv);

     // 将统计信息区域插入到搜索表单后面
     const searchForms = document.querySelectorAll('form[name="searchbox"]');
     searchForms.forEach(form => {
         form.insertAdjacentElement('afterend', statsDiv.cloneNode(true));
     });
 };

    // 打开链接的函数
    function openLinksInBatches(links, batchSize = 10, delay = 1000) {
        let index = 0;

        function openBatch() {
            const batch = links.slice(index, index + batchSize); // 每次取一批
            batch.forEach(link => {
                console.log(`open: ${link}`)
                window.open(link, '_blank'); // 在新标签页打开链接
            });

            index += batchSize; // 更新索引

            if (index < links.length) {
                setTimeout(openBatch, delay); // 延迟后打开下一批
            }
        }

        openBatch(); // 开始打开第一批
    }



    // 更新哈希表中的用户计数
    function updateUserCount(username) {
        console.log(`updateUserCount: ${username}`);
        if (userCount[username]) {
            userCount[username] += 1; // 用户已存在，计数 +1
        } else {
            userCount[username] = 1; // 用户不存在，初始化计数为 1
        }
    }

    // 将哈希表数据动态添加到表格中
    function renderStatsTable() {
        const tbody = document.querySelector('#statsTable tbody');
        tbody.innerHTML = ''; // 清空现有数据

        // 遍历哈希表，添加每个用户的行
        for (const [username, count] of Object.entries(userCount)) {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${username}</td>
            <td>${count}</td>
        `;
        tbody.appendChild(row);
    }
}

    const handleAvailableRow = (link, row) => {
        console.log('handleAvailableRow');

        allLinks.push(link.href); // 收集所有链接
        // 给链接添加点击事件监听
        link.addEventListener('click', function (event) {
            if (event.ctrlKey) {
                //alert('test');
                //event.preventDefault(); // 阻止默认行为（防止在当前页面跳转）

                // 打开新标签页
                //window.open(link.href, '_blank');

                // 等待2秒后删除对应的 <tr> 行
                setTimeout(() => {
                    row.remove();
                }, remove_delay); // 2秒的延时
            }
        });
    }

    // 定义异步函数来获取每页的数据并过滤
    async function fetchAndAppendPage(pageNumber) {
        baseUrl.searchParams.set('page', pageNumber); // 拼接 page 参数
        console.log(`Fetching: ${baseUrl.toString()}`);

        try {
            const response = await fetch(baseUrl.toString());
            const text = await response.text();

            // 使用 DOMParser 将 HTML 文本解析为 DOM
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');

            // 筛选符合条件的 <tr>，含有 <img class="check_status pass">
            const rows = doc.querySelectorAll('table.torrents > tbody > tr:not(:first-child)');
            rows.forEach((row) => {
                const img = row.querySelector('img.check_status.pass');
                if (!filter_pass || (filter_pass && !img)) {
                    const lastTd = row.lastElementChild;
                    const username = lastTd.textContent ? lastTd : '未知';
                    if (filter_anonymous) {
                        if (username == '匿名') {
                            return;
                        }
                    }

                    const link = row.querySelector('a[href^="details.php"]');
                    if (link) {
                        if (!filter_only_gz || (filter_only_gz && regex.test(link.textContent.trim()))) {
                            handleAvailableRow(link, row);
                            updateUserCount(username);
                        }
                    }
                }
            });
        } catch (error) {
            console.error(`Error fetching page ${pageNumber}:`, error);
        }
    }

    // 过滤行
    function filterRows() {
        const rows = Array.from(document.querySelectorAll('table.torrents > tbody > tr')).slice(1);
        let i = 1;
        // 遍历每一行
        rows.forEach((row) => {
            console.log(`start ${i++}`);
            if (filter_pass) {
                // 查找是否存在 class 包含 'check_status' 和 'pass' 的 <img> 标签
                const img = row.querySelector('img.check_status.pass');

                // 如果找到了符合条件的 <img>，则移除该 <tr>
                if (img) {
                    row.remove();
                    console.log('Removed row containing <img class="check_status pass">');
                    return;
                }
            }
            const lastTd = row.lastElementChild;
            const username = lastTd ? lastTd.textContent : '未知';

            console.log(username);
            if (filter_anonymous) {
                if (username == '匿名') {
                    row.remove();
                    console.log('Removed row 匿名');
                    return;
                }
            }

            const link = row.querySelector('a[href^="details.php"]');
            if (!link)
                return;
            if (filter_only_gz) {
                // 判断是不是官种
                if (!regex.test(link.textContent.trim())) {
                    row.remove();
                    console.log('Removed row 非官种');
                    return;
                }
            }

            handleAvailableRow(link, row);

            updateUserCount(username);
        });

        // 获取分页信息的 <p> 元素，并判断有多少个 '|' 符号
        const paginationInfo = document.querySelector('table.torrents + p');

        const pageCount = Math.min(paginationInfo.textContent.split('|').length, max_page); // 计算页数
        console.log(`Total pages: ${pageCount}`);


        // 逐页获取数据并追加到当前页面的表格
        (async function processAllPages() {
            for (let i = 1; i <= pageCount; i++) {
                await fetchAndAppendPage(i); // 从第2页开始循环获取
            }

            const textArea = document.createElement('textarea');
            textArea.style.width = '100%';
            textArea.style.height = '150px';
            textArea.value = allLinks.join('\n'); // 用换行符分隔链接

            textArea.addEventListener('dblclick', () => {
                textArea.select(); // 双击全选内容
            });

            document.body.appendChild(textArea);

            console.log('All pages processed.');
        })();

        console.log("User Count Dump:");
        console.log(JSON.stringify(userCount, null, 2)); // 格式化输出
        // 更新统计信息
        // 渲染表格
        renderStatsTable();
    }
})();
// ==UserScript==
// @name         PT站点发种、做种、完成、未完成种子列表批量下载
// @author       PoppyGuy
// @version      1.3
// @description  批量提取当前种子列表的种子下载地址，并按固定时间间隔打开
// @match       *://*/getusertorrentlist.php?do_ajax=1&userid=*&type=*
// @match       *://*/getusertorrentlistajax.php?userid=*&type=*
// @match       */userdetails.php?id=*
// @license      MIT
// @icon          https://hdatmos.club/favicon.ico
// @namespace https://greasyfork.org/users/1304869
// @downloadURL https://update.greasyfork.org/scripts/530249/PT%E7%AB%99%E7%82%B9%E5%8F%91%E7%A7%8D%E3%80%81%E5%81%9A%E7%A7%8D%E3%80%81%E5%AE%8C%E6%88%90%E3%80%81%E6%9C%AA%E5%AE%8C%E6%88%90%E7%A7%8D%E5%AD%90%E5%88%97%E8%A1%A8%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/530249/PT%E7%AB%99%E7%82%B9%E5%8F%91%E7%A7%8D%E3%80%81%E5%81%9A%E7%A7%8D%E3%80%81%E5%AE%8C%E6%88%90%E3%80%81%E6%9C%AA%E5%AE%8C%E6%88%90%E7%A7%8D%E5%AD%90%E5%88%97%E8%A1%A8%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

// 提取超链接中的数字
function extractIdFromUrl(url) {
    let match = url.match(/details\.php\?id=(\d+)/);
    if (match) {
        return match[1];
    }

    match = url.match(/detail\/(\d+)/);

    if (match) {
        return match[1];
    }
    return null;
}

/*
将数字添加到链接中
${window.location.protocol}//${window.location.hostname}获取网址协议和域名
如果当前网站下载种子地址不是/download.php?id=123这种的，请自行替换成对应格式
一般来说只需替换/download.php?id=就可以
*/
const ids = [];


function addIdToUrl(id) {
    const currentUrl = `${window.location.protocol}//${window.location.hostname}/download.php?id=${id}`;
    return currentUrl
}





function initSeedId() {
    ids.length = 0;
    // 获取所有超链接
    let links = document.querySelectorAll('a[href*="details.php?id="]');
    links = links.length == 0 ? document.querySelectorAll('a[href*="detail/"]') : links;
    // 提取链接中的数字并添加到数组中
    for (let i = 0; i < links.length; i++) {
        const id = extractIdFromUrl(links[i].href);
        if (id) {
            ids.push(id);
        }
    }

        // 在控制台输出完整链接
    ids.forEach(id => {
        console.log(addIdToUrl(id));
    });
}


// 创建表格和控制按钮
const table = document.createElement('table');
table.style.position = 'fixed';
table.style.bottom = '10px';
table.style.right = '10px';
table.style.backgroundColor = '#fff';
table.style.border = '1px solid #ccc';
table.style.borderRadius = '5px';
table.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.2)';
table.style.zIndex = '9999';
table.innerHTML = `
    <tr>
        <td>剩余网址数量：</td>
        <td id="remaining-count">${ids.length}</td>
        <td>总计的网址数：</td>
        <td id="total-count">${ids.length}</td>
    </tr>
    <tr>
        <td>秒数：</td>
        <td><input type="text" id="interval" value="10"></td>
        <td colspan="2">
            <button id="init-btn">获取种子</button>
            <button id="start-btn">开始</button>
            <button id="pause-btn">暂停</button>
            <button id="resume-btn">继续</button>
        </td>
    </tr>
`;
document.body.appendChild(table);

// 获取控制按钮和剩余网址数量显示
const remainingCountDisplay = document.getElementById('remaining-count');
const totalCountDisplay = document.getElementById('total-count');
const intervalInput = document.getElementById('interval');
const initBtn = document.getElementById('init-btn');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resumeBtn = document.getElementById('resume-btn');

// 定义变量来存储当前网址和定时器ID
let currentUrlIndex = 0;
let timerId = null;

// 打开下一个网址
function openNextUrl() {
    // 获取当前网址
    const currentUrl = addIdToUrl(ids[currentUrlIndex]);

    // 打开网址
    window.open(currentUrl);

    // 从数组中删除已经打开的网址
    ids.splice(currentUrlIndex, 1);

    // 更新剩余网址数量显示
    remainingCountDisplay.innerHTML = ids.length;

    // 如果数组为空，停止定时器
    if (ids.length === 0) {
        clearInterval(timerId);
        timerId = null;
        return;
    }

    // 更新当前网址索引
    currentUrlIndex = currentUrlIndex % ids.length;

    // 更新定时器
    const interval = parseInt(intervalInput.value) * 1000;
    timerId = setTimeout(openNextUrl, interval);
}

//初始化数据
initBtn.addEventListener('click', () => {
    initSeedId();
});


// 开始打开网址
startBtn.addEventListener('click', () => {
    // 如果已经在打开网址，不做任何操作
    if (timerId) {
        return;
    }

    // 更新总计网址数量显示
    totalCountDisplay.innerHTML = ids.length;

    // 开始打开网址
    openNextUrl();
});

// 暂停打开网址
pauseBtn.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
});

// 继续打开网址
resumeBtn.addEventListener('click', () => {
    // 如果已经在打开网址，不做任何操作
    if (timerId) {
        return;
    }

    // 继续打开网址
    openNextUrl();
});

// ==UserScript==
// @name         发种、做种、完成、未完成种子列表批量下载
// @author       Leeqs
// @version      1.0.0
// @description  批量提取当前种子列表的种子下载地址，并按固定时间间隔打开（已修复暂停问题）
// @match       *://*/getusertorrentlist.php?*
// @match       *://*/torrents.php?*&my=completed*
// @run-at       document-idle
// @license      MIT
// @namespace https://greasyfork.org/users/886649
// @downloadURL https://update.greasyfork.org/scripts/537326/%E5%8F%91%E7%A7%8D%E3%80%81%E5%81%9A%E7%A7%8D%E3%80%81%E5%AE%8C%E6%88%90%E3%80%81%E6%9C%AA%E5%AE%8C%E6%88%90%E7%A7%8D%E5%AD%90%E5%88%97%E8%A1%A8%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/537326/%E5%8F%91%E7%A7%8D%E3%80%81%E5%81%9A%E7%A7%8D%E3%80%81%E5%AE%8C%E6%88%90%E3%80%81%E6%9C%AA%E5%AE%8C%E6%88%90%E7%A7%8D%E5%AD%90%E5%88%97%E8%A1%A8%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

// 创建表格和控制按钮
const table = document.createElement('table')
table.style.position = 'fixed'
table.style.bottom = '10px'
table.style.right = '10px'
table.style.backgroundColor = '#fff'
table.style.border = '1px solid #ccc'
table.style.borderRadius = '5px'
table.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.2)'
table.innerHTML = `
  <tr>
      <td>剩余网址数量：</td>
      <td id="remaining-count">0</td>
      <td>总计的网址数：</td>
      <td id="total-count">0</td>
  </tr>
  <tr>
      <td>秒数：</td>
      <td><input type="text" id="interval" value="200"></td>
      <td colspan="2">
          <button id="fetch-btn">获取</button>
          <button id="start-btn">开始</button>
          <button id="pause-btn">暂停</button>
          <button id="resume-btn">继续</button>
      </td>
  </tr>
`
document.body.appendChild(table)

// 获取控制按钮和显示元素
const remainingCountDisplay = document.getElementById('remaining-count')
const totalCountDisplay = document.getElementById('total-count')
const intervalInput = document.getElementById('interval')
const fetchBtn = document.getElementById('fetch-btn')
const startBtn = document.getElementById('start-btn')
const pauseBtn = document.getElementById('pause-btn')
const resumeBtn = document.getElementById('resume-btn')
let lastPageItem

// 定义变量
let ids = []
let currentUrlIndex = 0
let timerId = null
let totalSeeds = 0
let isPaused = false

if (document.querySelector('p.nav')) {
    lastPageItem = document.querySelector('p.nav a:last-of-type');
}
else if (document.querySelector('.np-pager')) {
    const pager = document.querySelector('.np-pager');
    if (pager && pager.lastChild) {
        lastPageItem = pager.lastChild.querySelector('b');
    }
}

const initialTempIdsString = sessionStorage.getItem('tempIds');
const initialTempIdsArray = initialTempIdsString ? JSON.parse(initialTempIdsString) : [];
remainingCountDisplay.innerHTML = initialTempIdsArray.length;
totalCountDisplay.innerHTML = initialTempIdsArray.length;

function extractIdFromUrl(url) {
  const match = url.match(/.*\/details.*\.php\?id=(\d+).*/)
  if (match) {
    return match[1]
  }
  return null
}

function addIdToUrl(id) {
  const currentUrl = `${window.location.protocol}//${window.location.hostname}/download.php?id=${id}`
  return currentUrl
}

// 获取链接
function fetchLinks() {
  // 获取所有超链接
  const links = document.querySelectorAll('a[href^="details"]')

  // 重置ids数组，以免受上次数据影响 (当前页面的ids)
  ids = []

  // 提取链接中的数字并添加到数组中
  for (let i = 0; i < links.length; i++) {
    const id = extractIdFromUrl(links[i].href)
    if (id) {
      ids.push(id)
    }
  }

  // 合并历史数据
  const storedIds = JSON.parse(sessionStorage.getItem('tempIds') || '[]')
  // 去重处理
  const combinedIds = [...new Set([...storedIds, ...ids])]

  // 更新显示逻辑
  remainingCountDisplay.innerHTML = combinedIds.length
  totalCountDisplay.innerHTML = combinedIds.length

  // 存储合并后的数据
  sessionStorage.setItem('tempIds', JSON.stringify(combinedIds))
}

function openNextUrl() {
  if (isPaused || ids.length === 0) return

  const currentUrl = addIdToUrl(ids[currentUrlIndex])
  window.open(currentUrl)

  ids.splice(currentUrlIndex, 1)
  remainingCountDisplay.innerHTML = ids.length

  sessionStorage.setItem('tempIds', JSON.stringify(ids));

  if (ids.length === 0) {
    clearTimeout(timerId)
    timerId = null
    sessionStorage.removeItem('tempIds');
    console.log("所有种子已打开，tempIds已从sessionStorage中清除。");
    return
  }

  const interval = parseInt(intervalInput.value) * 1000
  timerId = setTimeout(() => {
    if (!isPaused) openNextUrl() // 新增状态检查
  }, interval)
}

function startPagination() {
  const urlParams = new URLSearchParams(location.search);
  let page = parseInt(urlParams.get('page')) || 0;
  console.log('当前页码:', page);
  totalSeeds = parseInt(lastPageItem.innerText.match(/\d+/g)[1])
  let maxPage = Math.ceil(totalSeeds / 100);

  fetchLinks();

  if (page < maxPage - 1) {
    const newUrl = new URL(location.href);
    newUrl.searchParams.set('page', page + 1);
    sessionStorage.setItem('paginationActive', 'true');
    location.href = newUrl.toString();
  } else {
    const finalIdsString = sessionStorage.getItem('tempIds');
    const finalIds = finalIdsString ? JSON.parse(finalIdsString) : [];
    console.log('所有页面链接收集完成:', finalIds);
    ids = finalIds;
    remainingCountDisplay.innerHTML = ids.length;
    totalCountDisplay.innerHTML = ids.length;
    sessionStorage.removeItem('paginationActive');
  }
}

window.onload = function () {
  if (sessionStorage.getItem('paginationActive') === 'true') {
    startPagination();
  } else {
    const S_tempIdsString = sessionStorage.getItem('tempIds');
    if (S_tempIdsString) {
        const S_tempIds = JSON.parse(S_tempIdsString);
        if (S_tempIds.length > 0) {
            ids = S_tempIds;
            remainingCountDisplay.innerHTML = ids.length;
            totalCountDisplay.innerHTML = ids.length;
        }
    }
  }
};

fetchBtn.addEventListener('click', () => {
  sessionStorage.removeItem('tempIds');
  sessionStorage.removeItem('paginationActive');
  sessionStorage.setItem('tempIds', JSON.stringify([]));
  startPagination();
})

startBtn.addEventListener('click', () => {
  const storedIdsString = sessionStorage.getItem('tempIds');
  if (storedIdsString) {
    const storedIds = JSON.parse(storedIdsString);
    if (storedIds.length > 0) {
      ids = storedIds;
      remainingCountDisplay.innerHTML = ids.length;
      totalCountDisplay.innerHTML = ids.length;
    }
  }

  if (timerId || ids.length === 0) return
  isPaused = false // 重置暂停状态
  openNextUrl()
})

pauseBtn.addEventListener('click', () => {
  isPaused = true
  clearTimeout(timerId)
  timerId = null
  console.log("下载已暂停，剩余数量:", ids.length)
})

resumeBtn.addEventListener('click', () => {
  if (timerId || ids.length === 0) return
  isPaused = false
  openNextUrl()
})
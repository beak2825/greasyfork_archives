// ==UserScript==
// @name Get Free Torrents
// @namespace http://tampermonkey.net/
// @version 1.0.9
// @description 该插件主要用于抓取指定页面（即 "torrents.php"）中的免费种子信息，并将其按照剩余时间从短到长排序后，以表格形式呈现给用户。用户可以一键复制所有展示种子的链接，同时具备筛选功能，允许用户设定自定义时间阈值，仅复制剩余时间超过该阈值的种子链接。此外，插件还支持添加自定义URL参数以扩展功能或满足个性化需求。
// @author 飞天小猪
// @match http*://*/*torrents*.php*
// @match http*://kp.m-team.cc/*
// @match http*://*/*special*.php*
// @match https://hhanclub.top/rescue.php*
// @icon https://gongjux.com/files/3/4453uhm5937m/32/favicon.ico
// @grant none
// @require https://greasyfork.org/scripts/453166-jquery/code/jquery.js?version=1105525
// @require https://greasyfork.org/scripts/28502-jquery-ui-v1-11-4/code/jQuery%20UI%20-%20v1114.js?version=187735
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490514/Get%20Free%20Torrents.user.js
// @updateURL https://update.greasyfork.org/scripts/490514/Get%20Free%20Torrents.meta.js
// ==/UserScript==
// ----------------规则----------------
const specialRules = [
    {
        site: 'https://hhanclub.top',
        torrentMethod: () => $('.torrent-table-sub-info'),
        rowMethod: (item) => $(item).find('.torrent-table-for-spider-info'),
        urlMethod: (item) => {
            return normalizeUrl(location.origin + '/' + $(item.parent().find('a[href*="download.php"]')[0]).attr('href'))
        },
        freeMethod: (item) => item.find('[class*="free"]').length > 0,
        titleMethod: (item) => $(item.find('a[class*="torrent-info-text-name"]')[0]).text(),
        sizeMethod: (item) => {
            const sizeStr = $($(item).find('.torrent-info-text-size')[0]).text().trim().split(' ').join('')
            const size = convertToBytes(sizeStr)
            return { sizeStr, size }
        },
        timeMethod: (item) => {
            const dateTimeRegex = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;
            const spansWithTitle = item.find('span[title]');
            const spanArr = spansWithTitle.filter(function () {
                return dateTimeRegex.test($(this).attr('title'));
            }).get()
            let time = ''
            if (spanArr.length > 0) {
                time = $(spanArr[0]).attr('title')
            } else {
                time = 'infinite'
            }
            return time
        },
        dlStateMethod: (item) => {
            // console.log(item, 'dlStateMethod')
            const seeding = item.find('div[title^="seeding "]')
            const activity = item.find('div[title^="activity "]')
            const inactivity = item.find('div[title^="inactivity "]')
            if (seeding.length || activity.length || inactivity.length) {
                return 'isDownloaded'
            } else {
                return 'unknown'
            }
        },
    },
    {
        site: 'default',
        torrentMethod: () => $('.torrents>tbody>tr'),
        rowMethod: (item) => $(item).find('table'),
        urlMethod: (item) => normalizeUrl(location.origin + '/' + $(item.find('a[href*="download.php"]')[0]).attr('href')),
        freeMethod: (item) => item.find('[class*="free"]').length > 0,
        titleMethod: (item) => $(item.find('a[href*="details.php"]')[0]).attr('title'),
        sizeMethod: (item) => {
            const sizeUnit = `td:contains('KB'),td:contains('MB'),td:contains('GB'),td:contains('TB')`
          const sizeTdArr = $(item).find(sizeUnit).filter(function () {
              const text = $(this).text().trim()
              const sizeReg = /^[-+]?[0-9]*\.?[0-9]+[KMGTP]B$/
              return sizeReg.test(text)
          })
          const sizeStr = $(sizeTdArr[0]).text().trim()
          const size = convertToBytes(sizeStr)
          return { sizeStr, size }
        },
        timeMethod: (item) => {
            const dateTimeRegex = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;
            const spansWithTitle = item.find('span[title]');
            const spanArr = spansWithTitle.filter(function () {
                return dateTimeRegex.test($(this).attr('title'));
            }).get()
            let time = ''
            if (spanArr.length > 0) {
                time = $(spanArr[0]).attr('title')
            } else {
                time = 'infinite'
            }
            return time
        },
        dlStateMethod: (item) => {
            const seeding = item.find('div[title^="seeding "]')
            const activity = item.find('div[title^="activity "]')
            const inactivity = item.find('div[title^="inactivity "]')
            if (seeding.length || activity.length || inactivity.length) {
                return 'isDownloaded'
            } else {
                return 'unknown'
            }
        }
    }
]
// ----------------初始化数据----------------
const originData = []
let filterData = []
const queryParams = {
    isFree: '1',
    sortBy: '1',
    sort: '1',
    dlState: 'unknown'
}
// 调用函数并进行操作
function normalizeUrl(url) {
    const httpPattern = /^(https?|ftp):\/\/[^/]+/; // 匹配http、https或ftp开头的URL部分

    const matchedUrl = url.match(httpPattern);
    if (matchedUrl) {
        // 获取URL部分之后的子串
        const remainingStr = url.slice(matchedUrl[0].length);
        // 替换剩余部分中的双斜杠为单斜杠
        const fixedRemainingStr = remainingStr.replace(/\/{2,}/g, '/');

        // 将处理过的剩余部分与原始URL部分拼接
        return matchedUrl[0] + fixedRemainingStr;
    } else {
        // 如果字符串不以http(s)://开头，直接替换整个字符串中的双斜杠为单斜杠
        return url.replace(/\/{2,}/g, '/');
    }
}
// ----------------工具方法----------------
// 格式化文件大小
function convertToBytes(sizeString) {
    const units = {
        'B': 1,
        'KB': 1024,
        'MB': 1024 * 1024,
        'GB': 1024 * 1024 * 1024,
        'TB': 1024 * 1024 * 1024 * 1024
    };

    // 使用正则表达式匹配数字和单位
    const match = sizeString.match(/^(\d+(\.\d+)?)([A-Za-z]{2,3})$/);
    if (!match) {
        throw new Error('Invalid size format');
    }

    // 提取数字和单位
    const [_, numberStr, , unit] = match;
    const number = parseFloat(numberStr);
    const unitInBytes = units[unit.toUpperCase()] || units['B'];

    // 转换为Bytes
    return number * unitInBytes;
}

// 格式化时间
function formatTime(timestemp) {
    const now = new Date().getTime()
    let sub = timestemp - now
    let hours = Math.floor(sub / (1000 * 60 * 60)); // 计算小时数
    sub %= (1000 * 60 * 60); // 剩余毫秒数转为分钟计算

    let minutes = Math.floor(sub / (1000 * 60)); // 计算分钟数
    sub %= (1000 * 60); // 剩余毫秒数转为秒计算

    let seconds = Math.floor(sub / 1000); // 计算秒数
    const hoursStr = hours > 0 ? `${hours}小时` : ''
    const minutesStr = minutes > 0 ? `${minutes}分` : ''
    const secondsStr = seconds > 0 ? `${seconds}秒` : ''
    const restTime = `${hoursStr}${minutesStr}`
      const color = ''
      return { restTime, color }
}

// 复制内容至剪贴板
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
    } catch (err) {
        console.error('Failed to copy to clipboard: ', err);
    }
}

// ----------------绑定事件----------------

// 全屏or退出全屏
function screenModal() {
    $('#fpModal').hasClass('full-screen') ? $('#fpModal').removeClass('full-screen') : $('#fpModal').addClass('full-screen')
}
// 关闭模态窗
function closeModal() {
    console.log('-- getFreeTorrents closeModal --')
    $('#fpMask').hide()
    $('#fpModal').hide()
    originData.length = 0
    filterData.length = 0
}
// 打开模态窗
function showModal() {
    console.log('-- getFreeTorrents showModal --')
    // 整理数据
    cleanData()
    // 根据初始化参数显示数据
    setData(queryParams)
    $('#fpMask').css('display', 'flex').show()
    $('#fpModal').show()
}

// 免费下拉变化事件
function freeChange() {
    console.log('-- getFreeTorrents freeChange --')
    const isFree = $('#fpSelectorFree').val()
    const sortBy = $('#fpSelectorSortBy').val()
    const sort = $('#fpSelectorSort').val()
    const dlState = $('#fpSelectorDlState').val()
    setData({
        isFree,
        sortBy,
        sort,
        dlState
    })
}

// 排序依据下拉变化事件
function sortByChange() {
    console.log('-- getFreeTorrents sortByChange --')
    const isFree = $('#fpSelectorFree').val()
    const sortBy = $('#fpSelectorSortBy').val()
    const sort = $('#fpSelectorSort').val()
    const dlState = $('#fpSelectorDlState').val()
    setData({
        isFree,
        sortBy,
        sort,
        dlState
    })
}

// 排序顺序下拉变化事件
function sortChange() {
    console.log('-- getFreeTorrents sortChange --')
    const isFree = $('#fpSelectorFree').val()
    const sortBy = $('#fpSelectorSortBy').val()
    const sort = $('#fpSelectorSort').val()
    const dlState = $('#fpSelectorDlState').val()
    setData({
        isFree,
        sortBy,
        sort,
        dlState
    })
}

// 是否下载过下拉变化事件
function dlStateChange() {
    console.log('-- getFreeTorrents dlStateChange --')
    const isFree = $('#fpSelectorFree').val()
    const sortBy = $('#fpSelectorSortBy').val()
    const sort = $('#fpSelectorSort').val()
    const dlState = $('#fpSelectorDlState').val()
    console.log(dlState)
    setData({
        isFree,
        sortBy,
        sort,
        dlState
    })
}

// 复制Cookie
function copyCookie() {
    console.log('-- getFreeTorrents copyCookie --')
    const cookie = document.cookie
    console.log(cookie)
    if (cookie) {
        copyToClipboard(cookie)
        alert('复制成功')
    } else {
        alert('Cookie 为空')
    }
}

// 复制种子链接
function copyTorrent() {
    console.log('-- getFreeTorrents copyTorrent --')
    const timelimit = $('#fpTimeLimit').val() || 0
    const params = $('#fpParams').val()
    let suffix = ''
    if (params) {
        suffix = '&' + params.split('\n').join('&')
    }
    let torrentstr = ''
    console.log(filterData)
    const limitData = filterData.filter(i => {
        const now = new Date().getTime()
        return ((i.timestemp - now) / (1000 * 60 * 60)) > parseInt(timelimit) || !i.timestemp
    })
    console.log(limitData.length)
    limitData.forEach(i => {
        torrentstr += `${i.downloadUrl}${suffix}\n`
      })
    copyToClipboard(torrentstr)
    alert(`成功复制 ${limitData.length} 个种子`)
}

// ----------------数据方法----------------
function cleanData() {
    console.log('-- getFreeTorrents cleanData --')
    const siteInfo = specialRules.find(i => i.site === location.origin) || specialRules.find(i => i.site === 'default')
    console.log('-- set siteInfo --' + siteInfo.site)
    // 获取所有行信息
    // 获取行信息种的种子名称、种子id、下载地址、下载进度、是否为免费种、剩余免费时间
    const temp = siteInfo.torrentMethod()
    temp.each(function () {
        const res = siteInfo.rowMethod(this)
        // 判断是否为有效的行数据
        if (res.length >= 1) {
            const el = res[0]
            // console.log(el)
            const isFree = siteInfo.freeMethod($(el))
            const temp = {
                title: siteInfo.titleMethod($(el)),
                isFree,
                downloadUrl: siteInfo.urlMethod($(el)),
            }
            const that = this
            if (isFree) {
                temp.time = siteInfo.timeMethod($(el))
            } else {
                temp.time = null
            }
            if (temp.time && temp.time !== 'infinite') {
                temp.timestemp = new Date(temp.time).getTime()
                const timeInfo = formatTime(temp.timestemp)
                temp.restTime = timeInfo.restTime
                temp.color = timeInfo.color
            } else if (temp.time === 'infinite') {
                temp.timestemp = Infinity
                temp.color = 'green'
            } else {
                temp.timestemp = null
                temp.color = 'red'
            }
            temp.dlState = siteInfo.dlStateMethod($(el))
            const sizeInfo = siteInfo.sizeMethod(that)
            temp.sizeStr = sizeInfo.sizeStr
            temp.size = sizeInfo.size
            originData.push(temp)
        }
    })
    const freeLength = originData.filter(i => i.isFree).length
    const undownloadLength = originData.filter(i => i.dlState === 'unknown').length
    const lessThen12 = originData.filter(i => {
        const now = new Date().getTime()
        return i.isFree && ((i.timestemp - now) / (1000 * 60 * 60) < 12)
    }).length
    const lessThen24 = originData.filter(i => {
        const now = new Date().getTime()
        return i.isFree && ((i.timestemp - now) / (1000 * 60 * 60) < 24)
    }).length - lessThen12
    const infoDomStr = `
      当前页面共有种子：<span style="margin-right: 8px">${originData.length}个</span>
      <span style="margin-right: 8px;background-color:#f3f0ff">未下载种子：${undownloadLength}个</span>
      <span style="margin-right: 8px;color: #67C23A;">免费种子：${freeLength}个</span>
      <span style="margin-right: 8px;color: #F56C6C;">免费种子<12h：${lessThen12}个</span>
      <span style="color: #E6A23C;">免费种子<24h：${lessThen24}个</span>`
      $('#fpInfo').html(infoDomStr)
}

// 获取展示数据
function setData(queryParams) {
    const { isFree, sortBy, sort, dlState, timeLimit } = queryParams
    const freeFilterData = originData.filter(i => isFree === '1' ? i.isFree : isFree === '0' ? !i.isFree : true)
    const dlStateMap = {
        all: (i) => true,
        unknown: (i) => i.dlState === 'unknown',
        isDownloaded: (i) => i.dlState !== 'unknown'
    }
    const dlStateFilterData = freeFilterData.filter(dlStateMap[dlState])
    const sortByMap = {
        '1': (a, b) => {
            let aTime = a.timestemp === 'infinite' ? Infinity : a.timestemp
            let bTime = b.timestemp === 'infinite' ? Infinity : b.timestemp
            return aTime - bTime
        },
        '2': (a, b) => a.size - b.size
    }
    const sortData = dlStateFilterData.sort(sortByMap[sortBy])
    const desSortData = Array.from(new Set(sortData)).reverse()
    const result = sort === '1' ? sortData : desSortData
    filterData = result
    let domStr = ``
      result.forEach((i, index) => {
          const now = new Date().getTime()
          let color = (i.isFree && (i.timestemp - now) / (1000 * 60 * 60) < 24) ? '#E6A23C' : '#333'
          color = (i.isFree && (i.timestemp - now) / (1000 * 60 * 60) < 12) ? '#F56C6C' : color
          domStr += `
        <tr class="${i.dlState === 'unknown' ? 'fp-undownload' : ''}">
          <td style="color:${color}">${index + 1}</td>
          <td style="color:${color}">${i.title}</td>
          <td style="color:${color}">${i.isFree ? i.restTime : ''}</td>
          <td style="color:${color}">${i.sizeStr}</td>
          <td style="color:${color}">${i.dlState === 'unknown' ? '未下载' : '下载过'}</td>
          <td style="color:${color}">${i.downloadUrl}</td>
        </tr>`
      })
    $('#fpTableBody').html(domStr)
}

// 注册事件
function bindEvent() {
    $('#fpMenuButton').bind('click', showModal)
    $('#fpClose').bind('click', closeModal)
    $('#fpScreen').bind('click', screenModal)
    $('#fpSelectorFree').bind('change', freeChange)
    $('#fpSelectorSortBy').bind('change', sortByChange)
    $('#fpSelectorSort').bind('change', sortChange)
    $('#fpSelectorDlState').bind('change', dlStateChange)
    $('#fpCopyCookie').bind('click', copyCookie)
    $('#fpCopyTorrent').bind('click', copyTorrent)
}

// ----------------初始化页面----------------

// 初始化样式
function initStyle() {
    const style = `
      <style>
    .fp-button {
      color: #fff;
      background-color: #9278ff;
      border: none;
      padding: 4px 10px;
      border-radius: 4px;
      cursor: pointer;
    }

    .fp-menu-button {
      position: fixed;
      right: 20px;
      top: 140px;
      z-index: 1000001;
      opacity: .3;
      transition: opacity .3s;
    }

    .fp-menu-button:hover {
      opacity: 1;
    }

    .fp-modal-mask {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1000002;
      background-color: rgba(0, 0, 0, .5);
      display: none;
      justify-content: center;
      align-items: center;
    }

    .fp-modal {
      height: 80vh;
      width: 70vw;
      min-width: 800px;
      max-width: 1400px;
      min-height: 600px;
      max-width: 1200px;
      background-color: #fff;
      box-sizing: border-box;
      border-radius: 8px;
      overflow: hidden;
    }

    .fp-modal.full-screen {
      height: 100vh;
      width: 100vw;
    }

    .fp-modal-header {
      width: 100%;
      background-color: #9278ff;
      padding: 8px;
      display: flex;
      justify-content: space-between;
      box-sizing: border-box;
      color: #fff;
      font-size: 12px;
    }

    .fp-modal-header-title {
      display: flex;
      align-items: center;
    }

    .fp-icon-wrap {
      display: flex;
    }

    .fp-modal-header-close {
      cursor: pointer;
      font-size: 20px;
      margin-left: 12px;
    }

    .fp-modal-content {
      padding: 8px;
      font-size: 12px;
      height: calc(100% - 60px);
      overflow: auto;
    }

    .fp-modal-control {
      display: flex;
    }

    .fp-select {
      display: flex;
      flex-wrap: nowrap;
    }

    .fp-select-item {
      display: flex;
      align-items: center;
      margin-right: 8px;
    }

    .fp-select-dom select {
      border: 1px solid #9278ff;
      width: 100px;
      padding: 2px 8px;
      border-radius: 4px;
      outline: none;
    }

    .fp-time-control {
      margin-top: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .fp-time-limit input {
      border: 1px solid #9278ff;
      width: 140px;
      padding: 2px 8px;
      border-radius: 4px;
      outline: none;
      padding: 4px;
    }

    .fp-info {
      margin-left: 8px;
    }

    .fp-btn-group {
      display: flex;

      button {
        margin-left: 8px;
      }
    }

    .fp-params-wrap {
      margin: 12px 0;
      width: 100%;
      height: 200px;
      box-sizing: border-box;
      padding: 0px;
    }

    .fp-params {
      box-sizing: border-box;
      height: 100%;
      width: 100%;
      border: 1px solid #9278ff;
      border-radius: 4px;
      padding: 4px 8px;
      outline: none;
    }

    .fp-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #9278ff;
    }

    .fp-table,
    .fp-table td,
    .fp-table th {
      border: 1px solid #9278ff;
      background-color: #fff;
    }

    .fp-table td {
      padding: 4px;
    }

    .fp-undownload td {
      background-color: #f3f0ff !important;
    }
  </style>
      `
      $('head').append(style)
}

// 初始化DOM元素
function initDom() {
    const dom = `
<button id="fpMenuButton" class="fp-button fp-menu-button">🐷 获取信息 🐷</button>
  <div id="fpMask" class="fp-modal-mask">
    <div id="fpModal" class="fp-modal">
      <div class="fp-modal-header">
        <div class="fp-modal-header-title">Get Free Torrents By 飞天小猪</div>
        <div class="fp-icon-wrap">
          <div id="fpScreen" class="fp-modal-header-close" title="全屏/退出全屏">▣</div>
          <div id="fpClose" class="fp-modal-header-close" title="关闭">✖</div>
        </div>
      </div>
      <div class="fp-modal-content">
        <div class="fp-modal-control">
          <div class="fp-select">
            <div class="fp-select-item">
              <div class="fp-select-label">种子促销：</div>
              <div class="fp-select-dom">
                <select name="" id="fpSelectorFree" value="0">
                  <option value="1">是</option>
                  <option value="0">否</option>
                  <option value="all">全部</option>
                </select>
              </div>
            </div>
            <div class="fp-select-item">
              <div class="fp-select-label">排序依据：</div>
              <div class="fp-select-dom">
                <select name="" id="fpSelectorSortBy" value="0">
                  <option value="1">剩余时间</option>
                  <option value="2">种子体积</option>
                </select>
              </div>
            </div>
            <div class="fp-select-item">
              <div class="fp-select-label">排序方式：</div>
              <div class="fp-select-dom">
                <select name="" id="fpSelectorSort" value="">
                  <option value="1">正序</option>
                  <option value="2">倒序</option>
                </select>
              </div>
            </div>
            <div class="fp-select-item">
              <div class="fp-select-label">下载状态：</div>
              <div class="fp-select-dom">
                <select name="" id="fpSelectorDlState" value="">
                  <option value="unknown">未下载</option>
                  <option value="isDownloaded">下载过</option>
                  <option value="all">全部</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="fp-time-control">
          <div class="fp-time-limit">
            <input id="fpTimeLimit" type="text" placeholder="剩余时间>?(hour)">
          </div>
          <div id="fpInfo" class="fp-info"></div>
          <div class="fp-btn-group">
            <button id="fpCopyCookie" class="fp-button">复制Cookie</button>
            <button id="fpCopyTorrent" class="fp-button">复制种子链接</button>
          </div>
        </div>
        <div id="fpParamsWrap" class="fp-params-wrap">
          <textarea name="" id="fpParams" class="fp-params" placeholder="请输入自定义参数 1行一条，格式为 key=value"></textarea>
        </div>
        <div class="fp-table-wrap">
          <table id="fpTable" class="fp-table">
            <thead>
              <th>序号</th>
              <th>种子名称</th>
              <th>免费剩余时间</th>
              <th>体积</th>
              <th>下载状态</th>
              <th>下载链接</th>
            </thead>
            <tbody id="fpTableBody">

            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>`
      $('body').append(dom)
}

(function() {
    'use strict';

    initStyle()
    initDom()
    bindEvent()
})();
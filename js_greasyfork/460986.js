// ==UserScript==
// @name         場外大樓過濾器
// @description  已經厭倦看到一堆不感興趣的大樓? 這就是你需要的
// @namespace    nathan60107
// @author       nathan60107(貝果)
// @version      1.1.4
// @homepage     https://home.gamer.com.tw/creationCategory.php?owner=nathan60107&c=425332
// @match        https://forum.gamer.com.tw/B.php?*bsn=60076*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamer.com.tw
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @require      https://code.jquery.com/jquery-3.6.3.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/460986/%E5%A0%B4%E5%A4%96%E5%A4%A7%E6%A8%93%E9%81%8E%E6%BF%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/460986/%E5%A0%B4%E5%A4%96%E5%A4%A7%E6%A8%93%E9%81%8E%E6%BF%BE%E5%99%A8.meta.js
// ==/UserScript==

let $ = jQuery
let dd = (...d) => {
  if (window.BAHAID && window.BAHAID !== 'nathan60107') return
  d.forEach((it) => { console.log(it) })
}

/**
 * @param {boolean} bool
 */
function isCheck(bool) {
  return bool ? 'checked' : ''
}
/**
 * @param {string} condi
 * @param {string} curr
 */
function isSelected(condi, curr) {
  return condi === curr ? 'selected' : ''
}
/**
 * @param {string|undefined} a 
 * @param {string} b 
 */
function versionCompare(a, b) {
  if (!a) return -1
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
}
/**
 * @param {number} reply
 * @param {number} like
 */
function userCondition(reply, like) {
  if (!setting.filterReply && !setting.filterLike) {
    return false
  } else if (!setting.filterLike) {
    return reply > setting.replyLimit
  } else if (!setting.filterReply) {
    return like > setting.likeLimit
  } else {
    return [
      reply > setting.replyLimit,
      like > setting.likeLimit,
    ].reduce(
      setting.likeCondition === 'or'
        ? (a, b) => a || b : (a, b) => a && b
    )
  }
}
/** @param {{title: string, snA: string}[]} whitelist */
function whitelistToString(whitelist) {
  return whitelist.map(wl =>
    `<li>
      - 
      <a href="https://forum.gamer.com.tw/C.php?bsn=60076&snA=${wl.snA}">${wl.title}</a>
      <button data-snA="${wl.snA}">刪除</button>
    </li>`
  ).join('')
}

/**
 * @type {defaultSetting}
 */
let setting = {}
const defaultSetting = {
  dataVersion: GM_info.script.version,
  enableLoadMore: true,
  enableFilter: true,
  filterReply: true,
  replyLimit: 1000,
  filterLike: false,
  likeCondition: 'and',
  likeLimit: 1000,
  /** @type {{title: string, snA: string}[]} */
  whitelist: []
}
const settingKey = Object.keys(defaultSetting)
let postSet = new Set()
let removeCount = 0
let resetCoundown = -1
let url = new URLSearchParams(window.location.href)
let pageIndex = +(url.get('page') ?? 1)

function initSettingPanel() {
  for (const key of settingKey) {
    setting[key] = GM_getValue(key)
    if (setting[key] === undefined) {
      setting[key] = defaultSetting[key]
      GM_setValue(key, defaultSetting[key])
    }
  }
  if (versionCompare(setting.dataVersion, '1.1.0') < 0) {
    resetSetting(false)
    toastr.info('由於版本更新，設定已重置，若持續出現此通知請回報錯誤。')
  }

  if (setting.enableLoadMore) $('.b-popular, .b-pager').hide()
  $('.BH-qabox1').after(`
  <style>
    #no-building, #no-building .setting-building, #no-building ul {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    #no-building {
      padding: 18px 12px;
    }
    #no-building .setting-building {
      padding-left: 10px;
    }
    #no-building label {
      display: block;
    }
    #no-building input[type="number"] {
      width: 4em;
    }
    #no-building button, #no-building select {
      width: max-content;
    }
    #no-building .setting-building select {
      margin-left: 45px;
    }
    #no-building input::-webkit-outer-spin-button,
    #no-building input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    #no-building input[type=number] {
      -moz-appearance: textfield;
    }
  </style>
  <h5>大樓過濾設定</h5>
  <div id="no-building" class="BH-rbox"></div>
  `)
  updateSettingPanel()
}

function updateSettingPanel() {
  $('#no-building').html(`
  <div class="version">腳本版本：${GM_info.script.version}</div>
  <div class="page">目前頁數：${pageIndex}</div>
  <div class="info">已過濾大樓： ${removeCount} 棟</div>
  <label>
    <input ${isCheck(setting.enableLoadMore)} data-key="enableLoadMore"  type="checkbox" >
    啟用載入更多內容
  </label>
  <label>
    <input ${isCheck(setting.enableFilter)} data-key="enableFilter"  type="checkbox" >
    啟用大樓過濾
  </label>
  大樓過濾條件：
  <div class="setting-building">
    <label>
      <input ${isCheck(setting.filterReply)} data-key="filterReply"  type="checkbox">
      回覆超過<input value="${setting.replyLimit}" data-key="replyLimit"  type="number">樓
    </label>
    <select data-key="likeCondition">
      <option value="and" ${isSelected(setting.likeCondition, 'and')}>且</option>
      <option value="or" ${isSelected(setting.likeCondition, 'or')}>或</option>
    </select>
    <label>
      <input ${isCheck(setting.filterLike)} data-key="filterLike"  type="checkbox">
      推文超過<input value="${setting.likeLimit}" data-key="likeLimit"  type="number">次
    </label>
    白名單文章：
    <ul>
      ${whitelistToString(setting.whitelist)}
    </ul>
    <input class="setting-whitelist-input" placeholder="在此處貼上文章網址" type="text">
    <button class="setting-add-whitelist" type="button">新增白名單</button>
  </div>
  <button class="setting-reset" type="button">${resetCoundown === -1 ? '重置設定' : `確定? ${resetCoundown}`}</button>
  `)
  $('#no-building .setting-reset').on('click', confirmReset)
  $('#no-building .setting-add-whitelist').on('click', () => modifyWhitelist('add'))
  for (const { snA } of setting.whitelist) {
    $(`[data-snA="${snA}"]`).on('click', () => modifyWhitelist(snA))
  }
  for (const [key, val] of Object.entries(defaultSetting)) {
    if (Array.isArray(val)) continue

    let targetKey = typeof val === 'boolean' ? 'checked' : 'value'
    $(`#no-building [data-key="${key}"]`).on('change', function (e) {
      setting[key] = e.target[targetKey]
      if (typeof val === 'number') setting[key] = parseInt(setting[key])
      saveSetting()
    })
  }
}

function saveSetting() {
  for (const key of settingKey) {
    GM_setValue(key, setting[key])
  }
  toastr.info('大樓過濾設定已更新')
}
function confirmReset() {
  // First click of reset setting, countdown
  if (resetCoundown === -1) {
    resetCoundown = 10
    updateSettingPanel()
    let itv = setInterval(() => {
      resetCoundown--
      updateSettingPanel()
      if (resetCoundown === -1) clearInterval(itv)
    }, 1000)
    // Second click, reset setting and reload
  } else {
    resetSetting()
  }
}
function resetSetting(reload = true) {
  for (const key of settingKey) {
    GM_setValue(key, defaultSetting[key])
  }
  if (reload) location.reload()
}
/**
 * If action is add, add url in input to whitelist.
 * Or, delete whiltelist item that snA == action
 * @param {'add'|string} action
 */
function modifyWhitelist(action) {
  if (action === 'add') {
    let tempList = _.cloneDeep(setting.whitelist)
    let input = $('.setting-whitelist-input').val().match(/snA=(\d+)/)
    if (!input) return

    let snA = input[1]
    $.ajax({
      url: `https://forum.gamer.com.tw/C.php?bsn=60076&snA=${snA}`
    }).done((resHTML) => {
      let title = $(resHTML).filter('title').text()
        .replace(' @場外休憩區 哈啦板 - 巴哈姆特', '')
        .replace(/^【.*】/, '')
      tempList.push({ title, snA })
      if (_.isEqual(setting.whitelist, tempList)) {
        toastr.warning('白名單已存在')
      } else {
        setting.whitelist = _.uniqBy(tempList, 'snA')
        updateSettingPanel()
        saveSetting()
      }
    })
  } else {
    _.pullAllBy(setting.whitelist, [{ snA: action }], 'snA')
    updateSettingPanel()
    saveSetting()
  }
}

/**
 * @param {HTMLElement} html
 * @param {'append'|'remove'} mode
 */
function processHtml(html, mode) {
  let snA = $(html).find('.b-list__time__edittime > a').attr('href').match(/snA=([\d]+)/)[1]
  let title = $(html).find('.b-list__main__title').text()
  let top = $(html).hasClass('b-list__row--sticky')
  let like = $(html).find('.b-list__summary__gp').text()
  let replyRaw = $(html).find('.b-list__time__edittime > a').attr('href').match(/tnum=([0-9]+)&/)
  let reply = replyRaw ? parseInt(replyRaw[1]) - 1 : 0
  let inWhitelist = _.filter(setting.whitelist, ['snA', snA]).length !== 0
  // Duplicated, skip it
  if (postSet.has(snA)) return
  // Should be filtered
  if (setting.enableFilter && !top && !inWhitelist &&
    userCondition(reply, like)) {
    if (mode === 'remove') $(html).remove()
    removeCount++
    // Should be kept
  } else {
    if (mode === 'append') {
      aTag = html.querySelector('.b-list__main a')
      aTag.href = aTag.href.replace(/&tnum=\d+&bPage=\d+/, '')
      $('form[method="post"] > .b-list-wrap > .b-list > tbody').append(html)
    }
  }
  postSet.add(snA)
}

function htmlToPost() {
  $('.b-list__row:not(:has(.b-list_ad))').map(
    function f() { processHtml(this, 'remove') }
  )
  updateSettingPanel()
}

function clearLink() { // Clear the link of b-list__main__title, keep bsn and snA
  document.querySelectorAll('a.b-list__main__title').forEach(aTag => {
    const url = new URL(aTag.href)

    const bsn = url.searchParams.get('bsn')
    const snA = url.searchParams.get('snA')

    url.search = ''

    if (bsn !== null) {
      url.searchParams.set('bsn', bsn)
    }

    if (snA !== null) {
      url.searchParams.set('snA', snA)
    }

    aTag.href = url.toString()
  })
}

/**
 * @type {IntersectionObserverCallback}
 */
function loadMore(entries) {
  if (!setting.enableLoadMore || entries.every((val) => !val.isIntersecting)) return

  pageIndex++
  url.set('page', pageIndex)
  $.ajax({
    url: decodeURIComponent(url.toString())
  }).done((resHTML) => {
    $(resHTML).find('.b-list__row:not(:has(.b-list_ad))').map(
      function f() { processHtml(this, 'append') }
    )
    clearLink()
    updateSettingPanel()
    // Register lazyload img and draw non-image thumbnail
    Forum.B.lazyThumbnail()
    Forum.Common.drawNoImageCanvas()
  })
}

function initIntersectionObserver() {
  let observer = new IntersectionObserver(loadMore)
  observer.observe($('#BH-footer')[0])
}

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    initIntersectionObserver()
    initSettingPanel()
    htmlToPost()
  })
})();

/**
 * Reference:
 * [JSDoc](https://ricostacruz.com/til/typescript-jsdoc)
 */
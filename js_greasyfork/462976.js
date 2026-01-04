// ==UserScript==
// @name         測試
// @description  test
// @namespace    les
// @author       les
// @version      1.1.4
// @homepage     https://home.gamer.com.tw/creationCategory.php?
// @match        https://forum.gamer.com.tw/B.php?*bsn=60076*
// @icon         
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @require      https://code.jquery.com/jquery-3.6.3.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/462976/%E6%B8%AC%E8%A9%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/462976/%E6%B8%AC%E8%A9%A6.meta.js
// ==/UserScript==

let $ = jQuery

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

/**
 * @type {IntersectionObserverCallback}
 */
function loadMore(entries) {
  if (!setting.enableLoadMore || entries.every((val) => !val.isIntersecting)) return

  pageIndex++
  url.set('page', pageIndex)
//   $.ajax({
//     url: decodeURIComponent(url.toString())
//   }).done((resHTML) => {
//     $(resHTML).find('.b-list__row:not(:has(.b-list_ad))').map(
//       function f() { processHtml(this, 'append') }
//     )
//     updateSettingPanel()
//     // Register lazyload img and draw non-image thumbnail
//     Forum.B.lazyThumbnail()
//     Forum.Common.drawNoImageCanvas()
//   })
console.log(url+'~'+pageIndex);
}


function initIntersectionObserver() {
  let observer = new IntersectionObserver(loadMore)
  observer.observe($('#BH-footer')[0])
}



(function () {
  document.addEventListener("DOMContentLoaded", function () {
    initIntersectionObserver()
  //  initSettingPanel()
   // htmlToPost()
console.log('ㄐㄐ');
$('#BH-footer').append("<div>222222222222</div>");
  })
})();
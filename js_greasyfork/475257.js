// ==UserScript==
// @name:zh-CN         Tiktok 按点击排序 优化版
// @name               Tiktok sort by view+
// @namespace          http://tampermonkey.net/
// @version            0.1.0
// @description        Click the video tab on tiktok user page to sort video by views and click again to restore order!
// @description:zh-cn  点击用户主页的视频Tab按点击排序，再点一次取消排序！
// @author             You
// @match              https://www.tiktok.com/@*
// @icon               https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @grant              none
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/475257/Tiktok%20%E6%8C%89%E7%82%B9%E5%87%BB%E6%8E%92%E5%BA%8F%20%E4%BC%98%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/475257/Tiktok%20%E6%8C%89%E7%82%B9%E5%87%BB%E6%8E%92%E5%BA%8F%20%E4%BC%98%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==

const multiplierMap = {
  k: 10 ** 3,
  m: 10 ** 6,
  b: 10 ** 9,
}

const sort = () => {
  const box = document.querySelector('[data-e2e="user-post-item-list"]');
  const items = Array.from(box.children).map(v => {
      const viewsString = v.querySelector('[data-e2e="video-views"]').textContent.trim();
      const views = isNaN(viewsString) ? parseFloat(viewsString.slice(0, -1)) * multiplierMap[viewsString.at(-1).toLowerCase()] : parseFloat(viewsString)
      return [v, views]
    })
    .sort((a, b) => b[1] - a[1])

    const sorted = items.every(v => v[0].style.order)

    items.forEach((v, i) => {
      v[0].style.order = sorted
        ? ''
        : String(i + 1)
    })
}

const sleep = time => new Promise(rs => setTimeout(rs, time))
const main = async () => {
  while(true) {
    await sleep(500)
    const videoTab = document.querySelector('[data-e2e="videos-tab"]')
    if (!videoTab) continue
    videoTab.addEventListener('click', sort)
    break
  }
}
main()
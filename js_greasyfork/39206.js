// ==UserScript==
// @name         下载知乎视频
// @version      2.1
// @description  为知乎的视频播放器添加下载功能
// @author       王超
// @license      MIT
// @match        https://www.zhihu.com/*
// @match        https://video.zhihu.com/video/*
// @match        https://v.vzuu.com/video/*
// @connect      zhihu.com
// @connect      video.zhihu.com
// @connect      vzuu.com
// @grant        GM_info
// @grant        GM_download
// @grant        unsafeWindow
// @namespace    https://greasyfork.org/users/38953
// @downloadURL https://update.greasyfork.org/scripts/39206/%E4%B8%8B%E8%BD%BD%E7%9F%A5%E4%B9%8E%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/39206/%E4%B8%8B%E8%BD%BD%E7%9F%A5%E4%B9%8E%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==
/* jshint esversion: 8 */

(async () => {
  console.log('知乎视频下载')

  async function downloadUrl(url, name = (new Date()).valueOf() + '.mp4') {
    // Greasemonkey 需要把 url 转为 blobUrl
    if (GM_info.scriptHandler === 'Greasemonkey') {
      const res = await fetch(url)
      const blob = await res.blob()
      url = URL.createObjectURL(blob)
    }

    // Chrome 可以使用 Tampermonkey 的 GM_download 函数绕过 CSP(Content Security Policy) 的限制
    if (window.GM_download) {
      GM_download({ url, name })
    }
    else {
      // firefox 需要禁用 CSP, about:config -> security.csp.enable => false
      let a = document.createElement('a')
      a.href = url
      a.download = name
      a.style.display = 'none'
      // a.target = '_blank';
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      setTimeout(() => URL.revokeObjectURL(url), 100)
    }
  }

  async function getVideoInfo(videoId) {
    const playlistUrl = `https://lens.zhihu.com/api/v4/videos/${videoId}`
    const videoInfo = await (await fetch(playlistUrl, { credentials: 'include' })).json()
    let videos = []

    // 不同分辨率视频的信息
    for (const [key, video] of Object.entries(videoInfo.playlist_v2 || videoInfo.playlist)) {
      video.resolution_ename = key
      video.resolution_cname = resolutionsName.find(v => v.ename === video.resolution_ename)?.cname
      if (!videos.find(v => v.size === video.size)) {
        videos.push(video)
      }
    }

    // 按大小排序
    videos = videos.sort(function (v1, v2) {
      const v1Index = resolutionsName.findIndex(v => v.ename === v1.resolution_ename)
      const v2Index = resolutionsName.findIndex(v => v.ename === v2.resolution_ename)
      return v1Index === v2Index ? 0 : (v1Index > v2Index ? 1 : -1)
    })

    return videos
  }

  // 处理单张卡片(问题/文章)
  function processCard(domCard) {
    const data = JSON.parse(domCard.dataset.zaExtraModule)

    // 视频卡片
    if (data.card?.content?.video_id) {
      processVideo(domCard)
    }
  }

  // 处理详细内容页面
  function processContent(domArticle) {
    const data = JSON.parse(domArticle.dataset.zaExtraModule)

    if (data.card?.content?.video_id) {
      processVideo(domArticle)
    }
  }

  // 处理视频
  function processVideo(dom) {
    const domData = JSON.parse(dom?.dataset?.zaExtraModule || null)
    const itemData = JSON.parse(dom.querySelector('div[data-zop]')?.dataset?.zop || null)
    const videoId = domData ? domData.card.content.video_id : window.location.pathname.split('/').pop()

    let observer = new MutationObserver(async mutationRecords => {
      for (const mutationRecord of mutationRecords) {
        if (mutationRecord.addedNodes.length && mutationRecord.addedNodes.item(0).innerText.includes('倍速')) {
          observer.disconnect()
          observer = null

          const curVideoUrl = mutationRecord.target.parentElement.children[0].querySelector('video').getAttribute('src')
          const toolbar = mutationRecord.addedNodes.item(0).children.item(0).children.item(1).children.item(1)

          // 克隆全屏按钮并修改图标作为下载按钮
          const domDownload = toolbar.children.item(toolbar.children.length - 3).cloneNode(true)
          domDownload.dataset.videoUrl = curVideoUrl
          domDownload.querySelector('svg').setAttribute('viewBox', '0 0 24 24')
          domDownload.querySelector('svg').innerHTML = svgDownload
          domDownload.classList.add('download')
          domDownload.children.item(0).setAttribute('aria-label', '下载')
          domDownload.children.item(1).innerText = '下载'
          domDownload.addEventListener('click', (event) => {
            event.stopPropagation()
            downloadUrl(domDownload.dataset.videoUrl)
          })
          domDownload.addEventListener('pointerenter', () => {
            const domMenu = domDownload.children.item(1)
            domMenu.style.opacity = 1
            domMenu.style.visibility = 'visible'
          })
          domDownload.addEventListener('pointerleave', () => {
            const domMenu = domDownload.children.item(1)
            domMenu.style.opacity = 0
            domMenu.style.visibility = 'hidden'
          })
          toolbar.appendChild(domDownload)

          // 获取视频信息
          const videos = await getVideoInfo(videoId)

          // 如果有不同清晰度的视频，添加下载弹出菜单
          if (videos.length > 1) {
            const curResolute = toolbar.children.item(1).children.item(0).innerText
            // 克隆倍速菜单为下载菜单
            const menu = toolbar.children.item(0).children.item(1).cloneNode(true)
            const menuItemContainer = menu.children.item(0)
            const menuItemTemplate = menuItemContainer.children.item(0).cloneNode(true)
            let menuItem

            //menu.style.left = 'auto'
            menuItemContainer.innerHTML = ''

            for (const video of videos) {
              menuItem = menuItemTemplate.cloneNode(true)
              menuItem.dataset.videoUrl = video.play_url
              menuItem.innerText = video.resolution_cname
              menuItem.addEventListener('click', (event) => {
                event.stopPropagation()
                downloadUrl(event.srcElement.dataset.videoUrl)
              })
              menuItemContainer.appendChild(menuItem)
            }

            domDownload.removeChild(domDownload.children.item(1))
            domDownload.appendChild(menu)
          }
        }
      }
    })

    observer.observe(dom, {
      childList: true, // 观察直接子节点
      subtree: true // 观察更低的后代节点
    })
  }

  const svgDownload = '<path d="M9.5,4 H14.5 V10 H17.8 L12,15.8 L6.2,10 H9.5 Z M6.2,18 H17.8 V20 H6.2 Z"></path>'
  const resolutionsName = [
    { ename: 'FHD', cname: '超清' },
    { ename: 'HD', cname: '高清' },
    { ename: 'SD', cname: '清晰' },
    { ename: 'LD', cname: '普清' }
  ]

  if (['video.zhihu.com', 'v.vzuu.com'].includes(window.location.host)) {
    processVideo(document.getElementById('player'))
  }
  else {
    const observer = new MutationObserver(mutationRecords => {
      for (const mutationRecord of mutationRecords) {
        if (!mutationRecord.oldValue) {
          if (mutationRecord.target?.dataset?.zaDetailViewPathModule === 'FeedItem') {
            processCard(mutationRecord.target)
          }
          else if (mutationRecord.target?.dataset?.zaDetailViewPathModule === 'Content' && mutationRecord.target.tagName === 'ARTICLE') {
            processContent(mutationRecord.target)
          }
        }
      }
    })

    observer.observe(document.body, {
      attributeFilter: ['data-za-detail-view-path-module'], // 只观察指定特性的变化
      attributeOldValue: true, // 是否将特性的旧值传递给回调
      attributes: true, // 观察目标节点的属性节点(新增或删除了某个属性，以及某个属性的属性值发生了变化)
      childList: false, // 观察直接子节点
      subtree: true // 观察更低的后代节点
    })
  }
})()
// ==UserScript==
// @name                Add URL to the recommend interface when Bilibili video player finishes playing
// @name:zh-CN          给 Bilibili 视频播放器结束播放后的推荐视频界面添加网址
// @namespace           https://gist.github.com/phtwo
// @version             0.2.1
// @description         Modify the recommended video URL of the Bilibili video player to support the middle mouse button clicks
// @description:zh-CN   给 Bilibili 视频播放器结束播放后的推荐视频界面添加网址，以支持新标签页打开
// @match               *://www.bilibili.com/video/*
// @grant               none
//
// @author              phtwo
// @homepage            https://gist.github.com/phtwo/b7bee4787e3dcce1bda7c17535538097
// @supportURL          https://gist.github.com/phtwo/b7bee4787e3dcce1bda7c17535538097
//
// @noframes
// @nocompat Chrome
//
// @downloadURL https://update.greasyfork.org/scripts/376873/Add%20URL%20to%20the%20recommend%20interface%20when%20Bilibili%20video%20player%20finishes%20playing.user.js
// @updateURL https://update.greasyfork.org/scripts/376873/Add%20URL%20to%20the%20recommend%20interface%20when%20Bilibili%20video%20player%20finishes%20playing.meta.js
// ==/UserScript==

(function () {
  'use strict'
  init()

  function init() {
    startMonitor()

    observeVideoChange(videoPageUrl => {
      // 每次切换视频后，直接重新再执行一次。嗯，就这样。
      setTimeout(startMonitor, 2e3)
      console.log('Bilibili recommended video URL modifier observeVideoChange', videoPageUrl)

    })
  }

  function startMonitor() {
    let waitVideosNodes = () => {
      return isRecommendVideosNodesExist() ? Promise.resolve() : Promise.reject()
    }

    waitingForChildElement('.bilibili-player-video-wrap', 'bilibili-player-ending-panel') // 首次进入首页 等待 播放器结束面板 渲染
      .then(waitVideosNodes)
      .catch(() => waitingForChildElement('.bilibili-player-ending-panel-box-videos', 'bilibili-player-ending-panel-box-recommend')) // 播放器结束面板渲染后，等待推荐视频模块渲染
      .then(modifyRecommendVideosNodesLink)
      .catch(error => console.error('Bilibili recommended video URL modifier error', error))

    console.log('Bilibili recommended video URL modifier is waiting to be modified.')
  }

  function isRecommendVideosNodesExist() {
    return getRecommendVideosNodes().length > 0
  }

  function getRecommendVideosNodes() {
    return document.querySelectorAll('a.bilibili-player-ending-panel-box-recommend')
  }

  function modifyRecommendVideosNodesLink() {
    getRecommendVideosNodes().forEach(item => {
      const aid = item.getAttribute('data-aid')
      const bvId = item.getAttribute('data-bvid')

      const videoId = aid ?
        `av${aid}` :
        bvId ? `BV${bvId}` : ''

      videoId && item.setAttribute('href', '//www.bilibili.com/video/' + videoId)
    })
    console.log('Bilibili recommended video URL modifier has been modified.')
  }


  /**
   * @name waitingForChildElement
   * @description 使用 MutationObserver 接口观察 父 element， childList addedNodes 中的直接子代，有任意一个具有 childClass 类名即为完成
   * @param {string} parentSlector - 父 element 选择器
   * @param {string} childClass    - 直接子代类名，不支持选择器语法
   * @return {Promise}
   */
  function waitingForChildElement(parentSlector, childClass) {
    const deferred = createPromiseDeferred()

    const parentDom = document.querySelector(parentSlector)
    const options = {
      childList: true,
    }

    const observer = new MutationObserver(mutationCallback)
    observer.observe(parentDom, options)

    return deferred.promise

    function mutationCallback(mutations) {
      for (let mutation of mutations) {
        if ('childList' !== mutation.type) {
          continue
        }
        if (Array.from(mutation.addedNodes).some(node => 1 === node.nodeType &&
          node.classList.contains(childClass))) {

          observer.takeRecords()
          observer.disconnect()

          deferred.resolve()
          break
        }
      }
    }
  }

  /**
   * @name observeVideoChange
   * @description 因为每次切视频，都会销毁旧的播放器实例。 因此切换视频后，必须重新对新生成的 DOM 创建 MutationObserver。
   *              这里采用监听 'head> meta[itemprop=url]' 的 content 变化来跟踪页面的切换
   *              ps: 这里可对 head 的检测进行节流处理，回调里直接读取 meta 更快，b 站都是先改 url 和 meta url 的值
   * @param {function} [fCallback]
   * @return {Promise}
   */
  function observeVideoChange(fCallback) {
    let lastVideo = getVideoPageUrlFromMetaTag()

    const parentSlector = 'head'
    const parentDom = document.querySelector(parentSlector)
    const options = {
      childList: true,
    }

    const observer = new MutationObserver(mutationCallback)
    observer.observe(parentDom, options)

    function mutationCallback(mutations) {
      for (let mutation of mutations) {
        if ('childList' !== mutation.type) {
          continue
        }

        let urlMetaTag = Array.from(mutation.addedNodes).find(node => {
          return 1 === node.nodeType && 'meta' === node.tagName.toLowerCase() &&
            'url' === node.getAttribute('itemprop')
        })
        if (!urlMetaTag) {
          continue
        }

        let currVideoPage = getVideoPageUrlFromMetaTag(urlMetaTag)
        if (currVideoPage === lastVideo) {
          continue
        }

        lastVideo = currVideoPage

        observer.takeRecords() // 已经确定当前有切换视频了，忽略其他变动

        fCallback(lastVideo)
        break
      }
    }
  }


  /**
   * @name getVideoPageUrlFromMetaTag
   * @description 无需取 avid ，这个 url 的格式不包含其他参数的，仅仅只有 avid
   * @param  {HTMLMetaElement=} metaTag
   * @return {string}
   */
  function getVideoPageUrlFromMetaTag(metaTag) {
    let meta = metaTag || document.querySelector('meta[itemprop=url]')
    return (meta && meta.getAttribute('content')) || ''
  }

  function createPromiseDeferred() {
    let resolve, reject
    let promise = new Promise((res, rej) => {
      resolve = res
      reject = rej
    })

    return {
      promise,
      resolve,
      reject
    }
  }


})()

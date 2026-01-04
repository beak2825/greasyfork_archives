// ==UserScript==
// @name         中移网大学习助手
// @namespace    https://github.com/huaxiaoxuan7/CM-Online-University-Boost
// @version      0.3.0
// @description  网大视频播放停止后自动恢复播放
// @author       Hua Xiao Xuan
// @match        https://wangda.chinamobile.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418737/%E4%B8%AD%E7%A7%BB%E7%BD%91%E5%A4%A7%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/418737/%E4%B8%AD%E7%A7%BB%E7%BD%91%E5%A4%A7%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(async () => {
  'use strict'

  // 工具函数
  const wait = (ms) => {
    return new Promise(resolve => {
      setTimeout(resolve, ms)
    })
  }

  const getVideoDom = async () => {
    let [video] = document.getElementsByTagName('video')
    while (!video || !video.src) {
      await wait(100)
      video = document.getElementsByTagName('video')[0]
    }
    return video
  }

  function preventPause() {
    setTimeout(() => {
      videoDom.play().catch(() => (pauseCount -= 1))
      pauseCount += 1
      updateBanner(banner)
    }, 3e3)
  }

  const onVideoChange = async (mutationsList) => {
    mutationsList.forEach(async item => {
      if (item.attributeName === 'src') {
        videoDom = await getVideoDom()
        courseCount += 1
        updateBanner(banner)
        registerEvent(videoDom)
      }
    })
  }

  const registerEvent = async (videoDom) => {
    videoDom.addEventListener('pause', preventPause)
    videoDom.muted = true
    const observer = new MutationObserver(onVideoChange)
    observer.observe(videoDom, { attributes: true, childList: false, subtree: false })

    // let { duration, currentTime } = videoDom
    // while (!duration) {
    //   await wait(50)
    //   duration = videoDom.duration
    // }
    // while ((duration - currentTime) > 5) {
    //   await wait(1000)
    //   currentTime = videoDom.currentTime
    // }
    // videoDom.removeEventListener('pause', preventPause)
    // videoDom.pause()
    // await wait(duration * 50)
    // videoDom.play()
    // videoDom.addEventListener('pause', preventPause)
  }

  const createBanner = () => {
    const banner = document.createElement('h2')
    banner.textContent = `本次已连续听课${timer}，学习了${courseCount}个视频，自动恢复播放了${pauseCount}次`
    banner.style.position = 'absolute'
    banner.style.width = '90%'
    banner.style.top = '66px'
    banner.style.left = '50%'
    banner.style.margin = '0 0 0 -45%'
    banner.style.color = 'white'
    banner.style.textAlign = 'center'
    return banner
  }

  const updateBanner = (banner) => {

    banner.textContent = `本次已连续听课${timer}，学习了${courseCount}个视频，自动恢复播放了${pauseCount}次`
  }

  const showBanner = (startTime) => {
    const detailPage = document.getElementById('content')
    detailPage.insertBefore(banner, detailPage.firstChild)
    setInterval(() => {
      const diff = (Date.now() - startTime) / 1000
      timer = `${Math.floor(diff / 60 / 60 / 24)}天${Math.floor(diff / 60 / 60) % 24}小时${Math.floor(diff / 60) % 60}分${Math.floor(diff % 60)}秒`
      updateBanner(banner)
    }, 1000)
  }

  // 主逻辑
  let videoDom = await getVideoDom()
  const contentDom = document.getElementsByClassName('content')[1]
  registerEvent(videoDom)

  let timer = ''
  let pauseCount = 0
  let courseCount = 0
  let banner = createBanner()
  showBanner(Date.now())
})()
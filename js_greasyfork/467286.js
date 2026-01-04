// ==UserScript==
// @name         【万能视频自动刷课时播放加速自动下一集脚本】定制化服务·····
// @version      1.0
// @description  【青书学堂】【国开在线】【各类继续教育】【优课学堂】【各类会计】【Q65004368】。
// @author       万能脚本
// @match        http://www.gzjxjy.gzsrs.cn/*/*
// @license      MIT
// @namespace    万能视频自动刷课时播放加速自动下一集脚本
// @downloadURL https://update.greasyfork.org/scripts/467286/%E3%80%90%E4%B8%87%E8%83%BD%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E6%97%B6%E6%92%AD%E6%94%BE%E5%8A%A0%E9%80%9F%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E9%9B%86%E8%84%9A%E6%9C%AC%E3%80%91%E5%AE%9A%E5%88%B6%E5%8C%96%E6%9C%8D%E5%8A%A1%C2%B7%C2%B7%C2%B7%C2%B7%C2%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/467286/%E3%80%90%E4%B8%87%E8%83%BD%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E6%97%B6%E6%92%AD%E6%94%BE%E5%8A%A0%E9%80%9F%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E9%9B%86%E8%84%9A%E6%9C%AC%E3%80%91%E5%AE%9A%E5%88%B6%E5%8C%96%E6%9C%8D%E5%8A%A1%C2%B7%C2%B7%C2%B7%C2%B7%C2%B7.meta.js
// ==/UserScript==


const page = (pathname) => {
  return new Promise(resolve => {
    const timer = setInterval(() => {
      if (pathname[0] === '/') {
        if (location.href.includes(pathname)) {
          clearInterval(timer)
          resolve()
        }
      } else {
        if (location.href.includes(pathname)) {
          clearInterval(timer)
          resolve()
        }
      }
    }, 300)
  })
}
 
document.querySelector('video').defaultPlaybackRate = 3.0;//设置默认三倍速播放
 
document.querySelector('video').play();
 
const getElement = (selector) => {
  return new Promise(resolve => {
    const timer = setInterval(() => {
      const element = typeof selector === 'string' ? document.querySelector(selector) : selector
 
      if (element) {
        clearInterval(timer)
        resolve(element)
      }
    }, 60)
  })
}
 
page('/personback/#/learning').then(() => {
  getElement('video').then(video => {
    video.muted = true
  
    const playList = Array.from(document.querySelectorAll('.el-steps .el-step .title-step'))
    let currentIndex = 0
  
    const playVideo= () => {
      let currentNow = Date.now()
  
      const timer = setInterval(async () => {
        if (isNaN(video.duration)) {
          video = await getElement('video')
          video.muted = true
        }
  
        if (Date.now() - currentNow < 15000) {
          if (video.paused) {
            video.play()
          }
  
          return
        }
  
        if (video.currentTime >= (video.duration - 1) && video.paused) {
          currentIndex += 1
  
          if (currentIndex >= playList.length) {
            currentIndex = 0
          }
    
          playList[currentIndex].click()
    
          clearInterval(timer)
  
          setTimeout(() => {
            nextVideo()
          }, 1000)
        }
      }, 1000)
    }
 
    setInterval(() => {
      const btn = document.querySelector('.el-button span')
 
      if (btn) {
        button.click()
      }
    }, 1000)
  
    playVideo()
  })
})
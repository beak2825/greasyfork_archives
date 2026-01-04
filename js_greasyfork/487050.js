// ==UserScript==
// @name         直播源自动抓取
// @namespace    http://tampermonkey.net/
// @version      1.2.7
// @description  live
// @author       糯米团子
// @license           MIT
// @match        https://www.foodieguide.com/*
// @require      https://lib.baomitu.com/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/487050/%E7%9B%B4%E6%92%AD%E6%BA%90%E8%87%AA%E5%8A%A8%E6%8A%93%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/487050/%E7%9B%B4%E6%92%AD%E6%BA%90%E8%87%AA%E5%8A%A8%E6%8A%93%E5%8F%96.meta.js
// ==/UserScript==

// https://www.foodieguide.com/iptvsearch/?s=%E5%8D%AB%E8%A7%86&page=1
let mainWeishi = ['安徽卫视', '北京卫视', '卡酷少儿', '重庆卫视', '东南卫视', '厦门卫视', '甘肃卫视', '广东卫视', '深圳卫视', '广西卫视', '贵州卫视', '海南卫视', '河北卫视', '黑龙江卫视', '河南卫视', '湖北卫视', '湖南卫视', '湖南金鹰卡通频道', '江苏卫视', '江西卫视', '吉林卫视', '辽宁卫视', '内蒙卫视', '宁夏卫视', '山西卫视', '山东卫视', '东方卫视', '哈哈炫动', '陕西卫视', '四川卫视', '康巴卫视', '天津卫视', '新疆卫视', '云南卫视', '浙江卫视', '青海卫视', '西藏卫视', '延边卫视', '兵团卫视', '海峡卫视', '黄河卫视', '三沙卫视']
let timeUsed = 0
let timeObj = null
let localWeishi = localStorage.getItem('currWeishi') || ''
let currWeishi = localWeishi || '安徽卫视'
let currInx = mainWeishi.indexOf(currWeishi)
// debugger
function ABC () {
  console.log('ABC' + timeUsed)
  let url = location.href
  let _page = Number(url.split('page=')[1])
  if (!_page) {
    window.stop()
    // debugger
    let localPage = localStorage.getItem('page')
    window.open(`https://www.foodieguide.com/iptvsearch/?s=${currWeishi}&page=${localPage}`, 'self')
    return
  }

  timeObj = setInterval(() => {
    if (ifListExist()) {
      setListToLocal()
    } else {
      // setTimeout(() => {
      timeUsed++
      if (timeUsed > 10) {
        debugger
        window.stop()
        clearInterval(timeObj)
        timeUsed = 0
        timeObj = null
      } else {
        debugger
        clearInterval(timeObj)
        timeObj = null
        ABC()
      }
      //   ABC()
      // }, 1000)
    };
  }, 1000)
}

ABC()

function setListToLocal () {
  console.log('setListToLocal')
  // window.open('https://www.foodieguide.com/iptvsearch/?s=卫视&page=1', '_blank')
  let url = location.href
  let _page = Number(url.split('page=')[1])
  if (!_page) {
    window.stop()
    // debugger
    let localPage = localStorage.getItem('page')
    window.open(`https://www.foodieguide.com/iptvsearch/?s=卫视&page=${localPage}`, 'self')
    return
  }
  // debugger
  if (!url.includes('#google_vignette')) {
    let arr = []
    // setTimeout(() => {
    let els = $('.tables .result') // .children
    for (let i = 0; i < els.length; i++) {
      let every = els[i]
      let name = every?.children[0]?.children[0]?.innerText || ''
      let url = every?.children[1]?.innerText || ''
      let speed = every?.children[2]?.children[0]?.innerText || ''
      if (speed?.toLowerCase().includes('fast')) {
        arr.push({
          name: name,
          url: url,
          speed: speed
        })
      };
    };
    let a = JSON.stringify(arr)
    // debugger
    localStorage.setItem('page', _page)
    localStorage.setItem('iptv' + _page, a)
    _page++
    currInx++
    localStorage.setItem('currWeishi', mainWeishi(currInx))
    window.stop()
    clearInterval(timeObj)
    timeUsed = 0
    timeObj = null
    // debugger
    window.open(`https://www.foodieguide.com/iptvsearch/?s=${currInx}&page=${_page}`, 'self')
    // }, 5000)
  } else {
    window.open(`https://www.foodieguide.com/iptvsearch/?s=${currInx}&page=${_page}`, 'self')
    window.stop()
    clearInterval(timeObj)
    timeUsed = 0
    timeObj = null
  }
}

function ifListExist () {
  console.log('ifListExist')
  if (timeUsed > 10) {
    window.stop()
    clearInterval(timeObj)
    timeUsed = 0
    timeObj = null
    return false
  } else {
    let list = $('.tables .result') // document.querySelector('.list');
    if (list && list.length > 0) {
      return true
    } else {
      return false
    }
  }
}

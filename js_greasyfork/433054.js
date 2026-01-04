// ==UserScript==
// @name         弹幕插件
// @namespace    https://github.com/yuaErha
// @include      http://*
// @include      https://*
// @version      0.1
// @description  爬取主流视频网站弹幕显示到第三方播放器中
// @author       Yua
// @match        http://*/*
// @match        https://*/*
// @icon         127.0.0.1
// @connect      *
// @require      https://lib.baomitu.com/pako/2.0.4/pako.es5.min.js
// @run-at       document-body
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/433054/%E5%BC%B9%E5%B9%95%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/433054/%E5%BC%B9%E5%B9%95%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

// Ajax 封装
const xhr = option =>
  new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      ...option,
      onerror: reject,
      onload: resolve
    })
  })

/**
 * 
 * @param {Document} xml  -xml Dom
 * @return {string} json  -转换后的json数据
 */
function xml2json(xml) {
  try {
    let obj = {}
    if (xml.childElementCount > 0) {
      for (const node of xml.childNodes) {
        const nodeName = node.nodeName
        if (nodeName === '#text') continue
        if (typeof obj[nodeName] == 'undefined') {
          obj[nodeName] = xml2json(node)
        } else {
          if (typeof obj[nodeName].push == 'undefined') {
            obj[nodeName] = []
            obj[nodeName].push(obj[nodeName])
          }
          obj[nodeName].push(xml2json(node))
        }
      }
    } else {
      obj = Number(xml.textContent) + '' === 'NaN' ? xml.textContent : Number(xml.textContent)
    }
    return obj
  } catch (e) {
    console.log(e.message)
    return {}
  }
}
/**
 * 常见的Danmu解析器 | 腾讯视频,爱奇艺,优酷视频,芒果TV...
 */
const DanmuParser = {
  async tencentParse(url, offset = 0) {
    const { vid } = await xhr({ method: 'GET', url }).then(resp => JSON.parse(resp.responseText.match(/var VIDEO_INFO = (\{.*?\})/m)[1]))
    const targetId = await xhr({
      method: 'GET',
      url: 'http://bullet.video.qq.com/fcgi-bin/target/regist?otype=json&vid=' + vid
    }).then(resp => resp.responseText.match(/targetid=(\d+)/m)[1])
    // const timestamp = Math.floor(timepoint / 30)
    // const offset = 30 * timestamp + 15
    const danmuUrl = 'http://mfm.video.qq.com/danmu?timestamp=' + offset + '&target_id=' + targetId
    return xhr({ method: 'GET', url: danmuUrl })
      .then(resp => {
        let comments = JSON.parse(resp.responseText)['comments']
        return comments.map(
          item =>
            new Object({
              content: item['content'],
              name: item['opername'],
              time: item['timepoint']
            })
        )
      })
      .catch(err => [])
  },
  async iqiyiParse(url, offset = 0) {
    const { tvId } = await xhr({ method: 'GET', url }).then(resp => JSON.parse(resp.responseText.match(/:page-info='(.*?)'/m)[1]))
    // const offset = Math.ceil(timepoint / 60 / 5)
    const danmuUrl = `https://cmts.iqiyi.com/bullet/${String(tvId).substr(String(tvId).length - 4, 2)}/${String(tvId).substr(String(tvId).length - 2, 2)}/${tvId}_300_${offset}.z`
    return xhr({
      method: 'GET',
      url: danmuUrl,
      responseType: 'arraybuffer'
    })
      .then(resp => {
        const responseArray = new Uint8Array(resp.response)
        const responseXMl = new TextDecoder().decode(pako.ungzip(responseArray)).replace(/&#\d{2};/g, '')
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(responseXMl, 'text/xml')
        return Array.from(xmlDoc.querySelectorAll('bulletInfo')).map(node => {
          const item = xml2json(node)
          return new Object({
            content: item['content'],
            name: item['userInfo']['name'] || '',
            time: item['showTime']
          })
        })
      })
      .catch(err => [])
  },
  async youkuParse(url, offset = 0) {
    const { videoId, seconds } = await xhr({ method: 'GET', url }).then(resp => {
      let data = resp.responseText.match(/\}\s*window\.PageConfig\s*=\s*([\s\S]*?);\s*var/m)[1]
      eval(`data = ${data}`)
      return data
    })
    const danmuUrl = `https://service.danmu.youku.com/list?mat=${offset}&ct=1001&iid=${videoId}`
    console.log(danmuUrl)
    // await xhr({ method: 'GET', url: danmuUrl }).then(resp => {
    //     console.log(resp.responseText)
    // })

    // console.log(videoId)
  },
  async mgtvParse(url, offset = 0) {
    const splits = url.split('/')
    const cid = splits[4]
    const vid = splits[5].split('.')[0]
    // const offset = Math.floor(timepoint / 60)
    const danmuUrl = `https://galaxy.bz.mgtv.com/rdbarrage?version=3.0.0&vid=${vid}&cid=${cid}&time=${60 * 1000 * offset}`
    return xhr({ method: 'GET', url: danmuUrl })
      .then(resp => {
        const comments = JSON.parse(resp.responseText)['data']['items']
        return comments.map(
          item =>
            new Object({
              content: item['content'],
              name: '',
              time: item['time']
            })
        )
      })
      .catch(err => [])
  },
  async parseUrl(url, offset = 0) {
    let danmus = []
    if (url.includes('v.qq.com')) {
      danmus = this.tencentParse(url, offset)
    } else if (url.includes('www.iqiyi.com')) {
      danmus = this.iqiyiParse(url, offset)
    } else if (url.includes('v.youku.com')) {
      danmus = this.youkuParse(url, offset)
    } else if (url.includes('www.mgtv.com')) {
      danmus = this.mgtvParse(url, offset)
    } else if (url.includes('www.bilibili.com')) {
    }
    return danmus
  }
}

// 监听Document以及frame下的 video元素
function ready(selector, fn) {
  const docRoot = window.document.documentElement
  if (!docRoot) return false
  const listenNodeList = []
  // 获取MutationObserver，兼容低版本的浏览器
  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
  // 创建Observer
  const Observer = new MutationObserver(mutations => {
    docRoot.querySelectorAll(selector).forEach(item => {
      if (listenNodeList.includes(item)) {
      } else {
        listenNodeList.push(item)
        fn(item)
        Observer.disconnect()
      }
    })
  })
  // 获取dom元素
  Observer.observe(docRoot, {
    childList: true,
    subtree: true
  })
}

/**
 * 弹幕数组随机排序
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

/**
 * 计算偏移量
 * @param {String} url    -视频链接
 * @param {int} timepoint -时间戳
 * @return {int} offset   -偏移量
 */
function calcOffset(url, timepoint) {
  let offset = 0
  if (url.includes('v.qq.com')) {
    const timestamp = Math.floor(timepoint / 30)
    offset = 30 * timestamp + 15
  } else if (url.includes('www.iqiyi.com')) {
    offset = Math.ceil(timepoint / 60 / 5)
  } else if (url.includes('v.youku.com')) {
  } else if (url.includes('www.mgtv.com')) {
    offset = Math.floor(timepoint / 60)
  } else if (url.includes('www.bilibili.com')) {
  }
  return offset
}

// 生成随机显示的时间单位
function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10)
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
    default:
      return 0
  }
}

// 弹幕颜色
const colors = ['#E91E63', '#FFEB3B', '#F44336', '#2196F3', '#FFB74D']

/**
 * 弹幕类 监听播放器事件: 播放 暂停 全屏...
 */
class Danmuer {
  constructor() {
    this.player = null
    this.videoUrl = ''
    this.offsets = []
    this.danmus = []
    this.state = 'close'
    this.cTime = 0
  }
  addEvent() {
    if (this.player == null) return

    GM_addValueChangeListener('state', (name, old_value, new_value, remote) => {
      this.state = new_value
      if (this.state === 'close') this.close()
    })

    // 监听事件
    /* document.addEventListener('fullscreenchange', function (event) {
      if (document.fullscreenElement !== null) {
        // console.log(document.fullscreenElement)
      }
    }) */

    this.player.addEventListener('pause', event => this.pause())
    /*     this.player.addEventListener('playing', event => {
      const currentTime = event.target.currentTime
      console.log('显示弹幕  ')
      this.start()
    }) */
    // this.player.addEventListener('play', event => {
    //   this.play()
    // })
    this.player.addEventListener('timeupdate', event => this.play())
  }
  use(player) {
    this.player = player
    this.videoUrl = ''
    if (this.player == null) return
    this.state = 'close'
    this.addEvent()
  }
  pause() {
    if (this.state == 'close') return
    this.state = 'pause'
    this.player.parentNode.querySelectorAll('.danmu').forEach(item => (item.style.animationPlayState = 'paused'))
  }
  async play() {
    this.videoUrl = GM_getValue('videoUrl', '')
    if (this.videoUrl == '') return
    if (this.state == 'close') return
    if (this.state == 'pause') {
      this.player.parentNode.querySelectorAll('.danmu').forEach(item => (item.style.animationPlayState = 'running'))
    }
    this.state = 'play'
    const currentTime = Math.floor(this.player.currentTime)
    if (currentTime % 2 == 0) return
    if (this.cTime === currentTime) return
    this.cTime = currentTime
    const offset = calcOffset(this.videoUrl, currentTime)
    if (!this.offsets.includes(offset)) {
      this.offsets.push(offset)
      const danmus = await DanmuParser.parseUrl(this.videoUrl, offset)
      this.danmus.push(...danmus)
    }

    const { clientWidth, clientHeight } = this.player
    const track = Math.ceil(clientHeight / 3 / 20)

    let arr = this.danmus.filter(item => {
      if (item.time != currentTime && item.time != currentTime + 1) {
        return false
      }
      item.content = item.content.replace(/\[.*?\]/g, '').trim()
      return item.content.length >= 2
    }) /* .filter((item,index,array)=>{}) */
    shuffleArray(arr)
    for (let i = 0; i < arr.length; i++) {
      if (i >= 3) return
      const item = arr[i]
      const dm = document.createElement('div')
      dm.setAttribute('class', 'danmu')
      if (Math.random() * 10 < 2) {
        dm.style.setProperty('color', colors[Math.floor(Math.random() * colors.length)], 'important')
      } else {
        dm.style.setProperty('color', '#ffffff', 'important')
      }
      // dm.style.setProperty('color', '#ffffff', 'important')
      dm.style.transform = `translateX(${clientWidth + 60}px)`
      // dm.style.animationDelay = `${Math.ceil(Math.random() * 5 + 1)}s`
      dm.style.marginTop = `${20 * randomNum(track) /*  + randomNum(10) */}px`
      /*  if (item.name === '') {
        dm.innerText = item.content
      } else {
        dm.innerText = item.name + ': ' + item.content
      } */
      dm.innerText = item.content
      dm.style.animationDuration = `${18 + randomNum(2)}s`
      // dm.style.animationDuration =Math.ceil( (clientWidth + 80)/120) + 's'
      dm.addEventListener('webkitAnimationEnd', event => dm.remove(), false)
      this.player.parentNode.appendChild(dm)
    }
  }
  close() {
    if (this.player == null) return
    this.player.parentNode.querySelectorAll('.danmu').forEach(item => item.remove())
    this.state = 'close'
  }
}

// 添加显示盒子
function addFlexBox() {
  if (window !== window.top) return
  GM_addStyle(`
  #danmu-box{
    position: fixed;
    top: 60px;
    right: 60px;
    z-index: 999999;
    height: auto;
    width: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 5px rgba(0, 0, 0, .3);
  }
  #danmu-box #danmu-url{
      margin: 0;
      padding: 0;
      width: 0;
      height: 24px;  
      background:rgb(244, 245, 245);  
      outline:none;  
      border:1px #1e80ff solid;
      box-sizing: border-box;
      transition: all .2s linear;
  }
  #danmu-box:hover>#danmu-url{
      width: 80px;
      padding: 0 4px;
  }
  #danmu-box #danmu-btn{
      margin: 0;
      padding: 0;
      height: 24px;
      width: 24px;
      cursor: pointer;
      color: #ffffff;
      background:#1e80ff;
      outline:none;  
      border:0px;
  }`)
  try {
    let dBox = document.createElement('div')
    dBox.setAttribute('id', 'danmu-box')
    let dUrl = document.createElement('input')
    dUrl.setAttribute('id', 'danmu-url')
    dUrl.setAttribute('type', 'text')
    dUrl.setAttribute('placeholder', 'http://')
    let dBtn = document.createElement('input')
    dBtn.setAttribute('id', 'danmu-btn')
    dBtn.setAttribute('type', 'button')
    dBtn.setAttribute('value', '开')
    GM_setValue('state', 'close')

    dBtn.addEventListener(
      'dblclick',
      event => {
        if (dBtn.value === '弹') {
          dBtn.value = '开'
          GM_setValue('state', 'close')
        } else {
          dBtn.value = '弹'
          GM_setValue('state', 'play')
        }
      },
      false
    )
    dUrl.addEventListener(
      'input',
      event => GM_setValue('videoUrl', dUrl.value.trim()),
      false
    )
    dBox.appendChild(dUrl)
    dBox.appendChild(dBtn)
    document.querySelector('body').appendChild(dBox)
  } catch (error) {
    console.log(error)
  }
}

// 弹幕CSS3 动画
function addDanmuCss() {
  GM_addStyle(`@keyframes moveOut {
    to {
        transform: translateX(-100%);
    }
  }
  .danmu {
    z-index: 9999;
    height: auto;
    width: fit-content;
    font-size: 20px;
    position: absolute;
    top: 0;
    left: 0;
    transform: translateX(900px);
    animation-name: moveOut;
    animation-duration: 5s;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
  }
  .danmu:hover{
    cursor: pointer;
  }`)
}

function run() {
  addFlexBox()
  let player = document.querySelector('video')
  ready('video', item => {
    console.log('== 检测到了 player ==')
    if (player == null) {
      player = item
      addDanmuCss()
      setTimeout(() => {
        new Danmuer().use(player)
      }, 3000)
    }
  })
}

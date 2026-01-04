// ==UserScript==
// @name         HuyaTool 虎牙直播插件
// @namespace    https://github.com/WithoutHair/Huya-Tool
// @version      1.0
// @description  查看主播数据/B站直播同屏观看
// @author       Mywait
// @match        *://www.huya.com/*
// @icon         data:image/png;base64,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
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @grant        unsafeWindow
// @connect      doseeing.com
// @connect      bilibili.com
// @connect      huya.com
// @require      https://cdn.bootcdn.net/ajax/libs/flv.js/1.6.2/flv.min.js
// @downloadURL https://update.greasyfork.org/scripts/446620/HuyaTool%20%E8%99%8E%E7%89%99%E7%9B%B4%E6%92%AD%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/446620/HuyaTool%20%E8%99%8E%E7%89%99%E7%9B%B4%E6%92%AD%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

let isHostRoom = () => {
  try {
    let room_id = document.getElementsByClassName('host-rid')[0].children[1].textContent
    return room_id
  } catch (error) {
    return false
  }
}

let getHostStat = () => {
  let room_id = isHostRoom()

  GM_xmlhttpRequest({
      method: 'GET',
      url: `https://www.doseeing.com/huya/data/api/rank?rids=${room_id}&dt=0&rank_type=chat_pv`,
      responseType: 'json',
      onload: function(res) {
          res = res.response.result.result[0]
          let parentNode = document.getElementsByClassName('ht-item')[0],
              statDom = document.createElement('div')
          statDom.className = 'ht-stat'
          parentNode.appendChild(statDom)

          statDom.innerHTML = `
            <div class='ht-stat-item'>
              <div class='ht-stat-title'>总收入</div>
              <div class='ht-stat-num'>${res['gift.paid.price'] / 100}元</div>
              <div class='ht-stat-other'>付费人数 ${res['gift.paid.uv']}</div>
            </div>
            <div class='ht-stat-item'>
              <div class='ht-stat-title'>总礼物</div>
              <div class='ht-stat-num'>${res['gift.all.price'] / 100}元</div>
              <div class='ht-stat-other'>送礼人数 ${res['gift.all.uv']}</div>
            </div>
            <div class='ht-stat-item'>
              <div class='ht-stat-title'>总弹幕</div>
              <div class='ht-stat-num'>${res['chat.pv']}条</div>
              <div class='ht-stat-other'>弹幕人数 ${res['chat.uv']}</div>
            </div>
            <div class='ht-stat-item'>
              <div class='ht-stat-title'>开播时长</div>
              <div class='ht-stat-num'>${res['online.minutes']}分</div>
              <div class='ht-stat-other'>活跃人数 ${res['active.uv']}</div>
            </div>
          `
      }
  })
}

let getRoomId = (id) => {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.live.bilibili.com/room/v1/Room/room_init?id=${id}`,
            responseType: 'json',
            onload: function(response) {
                resolve(response.response)
            }
        })
    })
}

let getStreaming = (room_id, qn = 150) => {
    /* 当platform为web流才为flv格式 h5为m3u8
      0: {qn: 10000, desc: '原画'}
      1: {qn: 400, desc: '蓝光'}
      2: {qn: 250, desc: '超清'}
      3: {qn: 150, desc: '高清'}
    */
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.live.bilibili.com/room/v1/Room/playUrl?cid=${room_id}&qn=${qn}&platform=web`,
            responseType: "json",
            onload: function(response) {
                resolve(response.response)
            }
        })
    })
}

let InitInput = () => {
  let inputUrlCon = document.createElement('div')

  inputUrlCon.className = 'ht-input-con'
  inputUrlCon.innerHTML = `
    <div class='ht-input-title'>同屏观看(暂仅支持B站)</div>
    <div class='ht-input-tip'>使用前请先下载并启用<a href='https://github.com/WithoutHair/Disable-Content-Security-Policy' target='_blank'>该扩展</a></div>
    <Input value='https://live.bilibili.com/6' placeholder='eg: https://live.bilibili.com/6' />
    <div class='ht-button-line'>
      <div class='ht-button-ok'>确定</div><div class='ht-button-cancel'>取消</div>
    </div>
  `
  document.body.appendChild(inputUrlCon)

  let hide = () => {
    inputUrlCon.className = inputUrlCon.className.replace('display', '')
  }

  document.getElementsByClassName('ht-button-ok')[0].onclick = async () => {
    hide()
    let urlId = inputUrlCon.children[2].value.split('/').pop()
    let key = `b-${urlId}`
    let {data} = await getRoomId(urlId)
    let stream = await getStreaming(data.room_id)

    createVideo(stream.data, key)
  }

  document.getElementsByClassName('ht-button-cancel')[0].onclick = () => {
    hide()
  }
}

let InitMenu = () => {
  let menuDom = document.createElement('div')

  menuDom.className = 'ht-fixed'
  menuDom.onclick = (e) => {
    if (e.target.parentNode.parentNode.className.includes('active')) {
      menuDom.className = 'ht-fixed'
    } else {
      menuDom.className = 'ht-fixed active'
    }
  }
  document.body.appendChild(menuDom)
  menuDom.innerHTML = `
    <svg t="1655371439339" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3405" width="32" height="32"><path d="M656.571429 1022.971429c-44.342857 0-89.257143-7.885714-141.257143-17.028572-55.428571-9.714286-124.571429-21.942857-215.542857-28.228571-88.914286-6.285714-146.171429-12.342857-185.828572-20-49.942857-9.485714-78.742857-22.971429-96.342857-45.028572C-2.742857 887.2-1.142857 858.857143 1.828571 839.771429c4.342857-27.542857 20.457143-47.885714 32.228572-62.742858 3.428571-4.342857 8.342857-10.514286 10.4-14.057142V258.4c0-50.057143 27.542857-95.542857 71.885714-118.742857l224.114286-117.714286C366.628571 8.228571 396 1.028571 425.485714 1.028571c5.6 0 11.428571 0.228571 17.028572 0.8l487.428571 45.485715c25.828571 2.4 49.6 14.285714 66.971429 33.371428C1014.4 99.771429 1024 124.571429 1024 150.514286v521.828571c0 43.542857-7.314286 63.428571-20 81.828572 6.971429 13.714286 11.885714 30.628571 7.085714 57.257142-2.628571 14.514286-10.971429 35.314286-35.657143 52.342858-12.914286 8.914286-28.8 15.885714-48.685714 21.371428-17.371429 4.8-37.714286 8.457143-60.914286 10.857143 1.485714 9.942857 1.142857 20.8-2.285714 32.457143-13.371429 44.685714-65.028571 66.057143-102.742857 78.171428-34.628571 11.2-67.771429 16.342857-104.228571 16.342858z" fill="#25467A" p-id="3406"></path><path d="M138.514286 182.057143L362.742857 64.457143c23.2-12.114286 49.257143-17.257143 75.314286-14.857143l487.428571 45.485714c28.571429 2.628571 50.514286 26.628571 50.514286 55.428572v521.828571c0 63.085714-17.371429 47.085714-21.371429 78.514286-3.085714 24.457143 14.971429 20.228571 9.142858 52-6.171429 33.6-76.685714 46.514286-151.2 48.571428s94.857143 57.714286-66.628572 109.6c-121.828571 39.2-204.8-14.628571-442.971428-31.2C64.914286 913.257143 41.485714 896.114286 49.142857 847.2c4.8-30.971429 43.2-52.685714 43.2-81.028571V258.4c0-32.114286 17.828571-61.485714 46.171429-76.342857z" fill="#C6EBFD" p-id="3407"></path><path d="M653.828571 330.857143v464.685714c0 32.457143 9.485714 66.514286-78.971428 41.828572s-393.714286-54.4-393.714286-54.4c-28.114286-2.742857-74.171429-1.828571-74.171428-30.971429V258.742857c0-28 29.485714-8.571429 71.771428 0.571429 67.314286 14.514286 288.914286 40.342857 397.6 39.314285 50.057143-0.571429 78.857143-20.8 77.485714 32.228572z" fill="#81D4FA" p-id="3408"></path><path d="M731.885714 261.257143c37.257143-24.8 157.371429-89.028571 180.114286-105.6 22.742857-16.571429 48.342857-29.142857 48.342857-7.2v510.857143c0 23.771429-10.628571 38.742857-29.828571 56.457143-13.028571 12-35.085714 22.628571-20.571429 63.314285 31.085714 86.971429-102.171429 10.057143-153.028571 37.942857C712 841.714286 680 821.828571 680 797.714286l-2.057143-470.057143c0.114286-32.114286 16.685714-41.6 53.942857-66.4z" fill="#29B6F6" p-id="3409"></path><path d="M270.057143 134.857143c-2.285714-16.8 72.914286-40.457143 99.428571-47.657143 136.571429-37.028571 306.171429 2.628571 306.514286 35.2 0.457143 43.885714-306.514286 42.514286-383.085714 24.8-20.228571-4.571429-22.514286-9.942857-22.857143-12.342857z" fill="#4FC3F7" p-id="3410"></path><path d="M311.428571 219.771429c0.8-25.6 212.685714 4.685714 426.628572-78.742858 24.571429-9.6 76.342857-31.314286 84.914286-18.628571 8.228571 12.228571-26.171429 52.914286-60 78.742857-48.914286 37.257143-103.085714 48.571429-155.314286 53.828572-141.257143 14.171429-296.914286-13.257143-296.228572-35.2z" fill="#4FC3F7" p-id="3411"></path><path d="M924.342857 240.685714c-10.628571-0.571429-18.742857 216.457143-21.714286 265.371429-5.828571 94.285714-10.171429 142.057143-31.885714 176.914286S822.857143 753.142857 831.542857 762.628571c8.8 9.6 60.685714-34.171429 93.485714-81.828571 30.971429-44.914286 9.714286-439.657143-0.685714-440.114286z" fill="#01579B" p-id="3412"></path><path d="M118.971429 277.028571c-2.057143 1.142857-1.6 3.542857 10.4 9.257143 80.228571 38.514286 335.657143 66.971429 472.114285 52.571429 11.2-1.142857 34.857143-3.771429 31.2-7.314286-6.742857-6.742857-100-7.314286-228.457143-20.342857-158.857143-16.114286-273.142857-41.257143-285.257142-34.171429zM92.8 843.2c-7.428571 17.942857 69.942857 9.6 152.228571 17.371429 82.285714 7.771429 153.714286 33.371429 171.2 15.771428 20-20.114286-33.028571-36.342857-127.657142-47.657143-85.828571-10.285714-186.971429-6.857143-195.771429 14.514286zM680.342857 903.314286c11.885714-20.914286 85.714286-10.171429 88.114286 5.485714 2.057143 13.828571-50.057143 46.742857-76.114286 27.2-9.714286-7.314286-17.371429-23.085714-12-32.685714z" fill="#FAFAFA" p-id="3413"></path><path d="M360 666.285714c-35.2-2.057143-62.171429-32.342857-60.114286-67.657143 0.457143-7.085714 6.4-12.457143 13.485715-12 7.085714 0.457143 12.457143 6.4 12 13.485715-1.257143 21.257143 14.857143 39.314286 36.114285 40.571428s39.314286-14.857143 40.571429-36.114285c0.457143-7.085714 6.4-12.457143 13.485714-12 7.085714 0.457143 12.457143 6.4 12 13.485714-2.057143 35.314286-32.342857 62.285714-67.542857 60.228571zM203.542857 490.514286c-1.257143 21.257143 14.857143 39.314286 36.114286 40.571428s39.314286-14.857143 40.571428-36.114285-14.857143-39.314286-36.114285-40.571429c-21.142857-1.257143-39.314286 14.857143-40.571429 36.114286zM459.085714 505.371429c-1.257143 21.257143 14.857143 39.314286 36.114286 40.571428s39.314286-14.857143 40.571429-36.114286c1.257143-21.257143-14.857143-39.314286-36.114286-40.571428-21.142857-1.142857-39.314286 14.971429-40.571429 36.114286z" fill="#25467A" p-id="3414"></path><path d="M187.085714 553.6l-51.085714-2.971429c-14.171429-0.8-26.171429 9.942857-27.085714 24.114286-0.8 14.171429 9.942857 26.171429 24.114285 27.085714l51.085715 2.971429c14.171429 0.8 26.171429-9.942857 27.085714-24.114286 0.914286-14.171429-10.057143-26.171429-24.114286-27.085714z m408.8 23.885714l-51.085714-2.971428c-14.171429-0.8-26.171429 9.942857-27.085714 24.114285-0.8 14.171429 9.942857 26.171429 24.114285 27.085715l51.085715 2.971428c14.171429 0.8 26.171429-9.942857 27.085714-24.114285 0.8-14.171429-9.942857-26.285714-24.114286-27.085715z" fill="#FAFAFA" p-id="3415"></path><path d="M794.628571 259.2c-12.228571-9.714286-42.285714 21.828571-56.571428 42.628571-49.485714 72.228571-27.771429 188.114286-8.685714 191.885715 27.428571 5.371429 92.342857-213.142857 65.257142-234.514286z" fill="#81D4FA" p-id="3416"></path></svg>
    <div class='ht-con'>
      <div class='ht-item'>
        <svg t="1655369264384" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5053" width="32" height="32"><path d="M190.171429 782.628571l277.942857-277.942857 160.914285 146.285715L870.4 365.714286v555.885714l-687.542857 7.314286z" fill="#F4B1B2" p-id="5054"></path><path d="M870.4 928.914286c-14.628571 0-21.942857-7.314286-21.942857-21.942857V387.657143c0-14.628571 7.314286-21.942857 21.942857-21.942857 14.628571 0 21.942857 7.314286 21.942857 21.942857v519.314286c0 14.628571-7.314286 21.942857-21.942857 21.942857zM658.285714 928.914286h-14.628571c-7.314286 0-14.628571-7.314286-14.628572-14.628572V650.971429c0-7.314286 7.314286-14.628571 14.628572-14.628572H658.285714c7.314286 0 14.628571 7.314286 14.628572 14.628572v263.314285c0 7.314286-7.314286 14.628571-14.628572 14.628572zM424.228571 928.914286h-7.314285c-7.314286 0-14.628571-7.314286-14.628572-14.628572V614.4c0-7.314286 7.314286-14.628571 14.628572-14.628571h7.314285c7.314286-7.314286 14.628571 0 14.628572 14.628571v299.885714c0 7.314286-7.314286 14.628571-14.628572 14.628572zM182.857143 928.914286h-21.942857c-7.314286 0-7.314286-7.314286-7.314286-7.314286v-131.657143c0-7.314286 7.314286-7.314286 7.314286-7.314286h21.942857c7.314286 0 7.314286 7.314286 7.314286 7.314286v131.657143s0 7.314286-7.314286 7.314286zM190.171429 614.4l277.942857-256L585.142857 453.485714l219.428572-241.371428 65.828571 73.142857 58.514286-226.742857-241.371429 36.571428 73.142857 80.457143-182.857143 197.485714-109.714285-95.085714-314.514286 292.571429z" fill="#CB2A24" p-id="5055"></path></svg>
      </div>
      <div class='ht-item'>
        <svg t="1655373722244" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2692" width="32" height="32"><path d="M759.40167 374.421598 759.40167 122.273834 63.998593 122.273834l0 527.325034 200.620204 0 0 252.126274 695.382611 0L960.001407 374.421598 759.40167 374.421598zM141.039223 572.558238 141.039223 199.315488l541.341259 0 0 175.10611L264.618796 374.421598l0 198.136639L141.039223 572.558238zM883.000686 824.684512 341.659427 824.684512 341.659427 451.441762l541.341259 0L883.000686 824.684512z" p-id="2693" fill="#ffa900"></path></svg></div>
    </div>
  `

  document.getElementsByClassName('ht-item')[1].onclick = () => {
    document.getElementsByClassName('ht-input-con')[0].className += ' display'
  }
}

let createVideo = (data, key) => {
  if (flvjs.isSupported()) {
      let video = document.createElement('video'),
        con = document.createElement('div'),
        title = document.createElement('div'),
        quality = document.createElement('select'),
        path = document.createElement('select'),
        resizeDot = document.createElement('div'),
        insertButton = document.createElement('div'),
        restoreButton = document.createElement('div'),
        flvPlayer = flvjs.createPlayer({
          type: 'flv',
          url: data.durl[0].url
        })
        flvPlayer.attachMediaElement(video)
        flvPlayer.load()

      let now = document.getElementById('hy-video') || document.getElementById('player-recommend')
      video.controls = true
      con.className = `ht-video-con ${key}`
      con.draggable = true
      setDragEvent(con)
      title.className = 'ht-video-title'
      insertButton.className = 'ht-button'
      insertButton.innerHTML = '嵌入直播间'
      restoreButton.className = 'ht-button'
      restoreButton.innerHTML = '恢复直播间'
      restoreButton.style.display = 'none'

      resizeDot.className = 'ht-video-resize'
      resizeDot.draggable = true

      let qualitys = data.quality_description,
        paths = data.durl

      qualitys.forEach(q => {
        quality.innerHTML += `<option label=${q.desc} value=${q.qn}>`
      })

      paths.forEach((p, index) => {
        path.innerHTML += `<option label=线路${index + 1} value=${p.url}>`
      })

      title.appendChild(quality)
      title.appendChild(path)
      title.appendChild(insertButton)
      title.appendChild(restoreButton)
      title.innerHTML += '<svg t="1655375639736" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4092" width="16" height="16"><path d="M512 128C300.8 128 128 300.8 128 512s172.8 384 384 384 384-172.8 384-384S723.2 128 512 128zM672 627.2c12.8 12.8 12.8 32 0 44.8s-32 12.8-44.8 0L512 556.8l-115.2 115.2c-12.8 12.8-32 12.8-44.8 0s-12.8-32 0-44.8L467.2 512 352 396.8C339.2 384 339.2 364.8 352 352s32-12.8 44.8 0L512 467.2l115.2-115.2c12.8-12.8 32-12.8 44.8 0s12.8 32 0 44.8L556.8 512 672 627.2z" p-id="4093" fill="#8a8a8a"></path></svg>'
      con.appendChild(title)
      con.appendChild(video)
      con.appendChild(resizeDot)
      document.body.appendChild(con)

      flvPlayer.play()
      setResizeEvent(resizeDot)

      title.lastChild.onclick = function () {
        now.style.display = 'inline-block'
        con.appendChild(video)
        flvPlayer.destroy()
        this.parentNode.parentNode.remove()
      }

      let dom = document.getElementsByClassName(key)
      con = dom[dom.length - 1]
      title = con.children[0]
      quality = title.children[0]
      path = title.children[1]
      insertButton = title.children[2]
      restoreButton = title.children[3]
      quality.value = 150
      quality.onchange = e => {
        getStreaming(key.split('-').pop(), e.target.value).then(res => {
          path.innerHTML = ''
          res.data.durl.forEach((p, index) => {
            path.innerHTML += `<option label=线路${index + 1} value=${p.url}>`
          })
          path.value = res.data.durl[0].url
          flvPlayer.destroy()
          flvPlayer = flvjs.createPlayer({
            type: 'flv',
            url: res.data.durl[0].url
          })
          flvPlayer.attachMediaElement(video)
          flvPlayer.load()
          flvPlayer.play()
        })
      }
      path.onchange = e => {
        flvPlayer.destroy()
        flvPlayer = flvjs.createPlayer({
          type: 'flv',
          url: e.target.value
        })
        flvPlayer.attachMediaElement(video)
        flvPlayer.load()
        flvPlayer.play()
      }
      insertButton.onclick = () => {
        video.style.width = '100%'
        now.style.display = 'none'
        document.getElementById('player-video').appendChild(video)
        con.style.width = '400px'
        con.style.height = 'auto'
        insertButton.style.display = 'none'
        restoreButton.style.display = 'inline-block'
        resizeDot.style.display = 'none'
      }
      restoreButton.onclick = () => {
        now.style.display = 'inline-block'
        con.appendChild(video)
        insertButton.style.display = 'inline-block'
        restoreButton.style.display = 'none'
        resizeDot.style.display = 'block'
      }
  }
}

let setDragEvent = (el) => {
  let startX, startY

  el.ondragstart = e => {
    startX = e.clientX
    startY = e.clientY
  }
  el.ondragend = e => {
    let top = parseInt(e.target.style.top) || 0,
      left = parseInt(e.target.style.left) || 0

    e.target.style.top = top + e.clientY - startY + 'px'
    e.target.style.left = left + e.clientX - startX + 'px'
  }
}

let setResizeEvent = (el) => {
  let startX, startY
  el.ondragstart = e => {
    e.stopPropagation()
    startX = e.clientX
    startY = e.clientY
  }
  el.ondragend = e => {
    e.stopPropagation()
    let width = e.target.parentNode.clientWidth,
      height = e.target.parentNode.clientHeight

    e.target.parentNode.style.width = width + e.clientX -startX + 'px'
    e.target.parentNode.style.height = height + e.clientY -startY + 'px'
  }
}

let InitStyle = () => {
    let style = document.createElement('style')
    style.append(".ht-fixed{cursor:pointer;z-index:1000;position:fixed;right:65px;bottom:65px;}.ht-con{transition:all .5s;visibility:hidden;opacity:0;position:absolute;top:-115px;left:-8px;width:48px;box-shadow:0 2px 6px rgb(0 0 0 / 9%);border-radius:4px;background-color:rgba(30,128,255,.35);text-align:center;}.ht-con::after{content:'';position:absolute;bottom:-8px;left:19px;width:0;height:0;border-width:8px 5px 0;border-color:rgba(30,128,255,.35) rgba(0,0,0,0);border-style:solid;}.ht-fixed.active .ht-con{visibility:visible;opacity:1;top:-135px;}.ht-con .ht-item{cursor:click;user-select:none;position:relative;padding:10px 0;}.ht-con .ht-item img{cursor:pointer;}.ht-con .ht-item .ht-stat{transition:all .5s;opacity:0;visibility:hidden;position:absolute;top:0;right:58px;display:flex;box-shadow:0 6px 12px 7px rgb(106 115 133 / 22%);border:1px solid #E3E5E7;border-radius:4px;background-color:#fff;white-space:nowrap;}.ht-con .ht-item .ht-stat::after{content:'';position:absolute;top:20px;right:-7px;width:0;height:0;border-width:3px 0 3px 7px;border-color:rgba(0,0,0,0) #fff;border-style:solid;}.ht-con .ht-item:nth-child(1):hover .ht-stat{visibility:visible;opacity:1;right:68px;}.ht-con .ht-item .ht-stat .ht-stat-item{padding:10px;}.ht-stat-item .ht-stat-title{margin-bottom:5px;color:#666;}.ht-stat-item .ht-stat-num{margin-bottom:5px;color:#d58400;}.ht-input-con{z-index:1000;display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:300px;box-shadow:0 6px 12px 7px rgb(106 115 133 / 22%);border-radius:4px;padding-top:10px;background-color:#fff;text-align:center;}.ht-input-con .ht-input-title{font-size:24px;}.ht-input-con input{width:200px;margin:10px 0;border:1px solid #ff9900;border-radius:17px;padding:6px 12px;}.ht-input-con .ht-button-line{border-top:1px solid #e6e6e6;}.ht-input-con .ht-button-line div{transition:background-color .5s;cursor:pointer;position:relative;display:inline-block;width:50%;line-height:36px;}.ht-input-con .ht-button-line div:hover{background-color:#e6e6e6;}.ht-input-con .ht-button-line div::after{content:'';position:absolute;top:0;right:0;width:1px;height:36px;background-color:#e6e6e6;}.ht-video-con{z-index:999;position:fixed;top:0;left:0;width:400px;background-color:rgba(0,0,0,.3);}.ht-video-title{cursor:move;background-color:#fff;}.ht-video-title svg{cursor:pointer;float:right;margin:5px;}.ht-video-con video{width:100%;height:calc(100% - 31px);}.ht-video-resize{cursor:se-resize;position:absolute;right:0;bottom:0;width:5px;height:5px;background-color:#000;}.display{display:block;}.ht-button{cursor:pointer;display:inline-block;margin-left:4px;padding:4px;border-radius:4px;background-color:#ffa900;color:#fff;}input{outline:none;padding:0;}select{outline:none;}")
    document.head.appendChild(style)
}

(async function() {
    'use strict';

    // Your code here...
    if (!isHostRoom()) return
    InitStyle()
    InitMenu()
    getHostStat()
    InitInput()
})();
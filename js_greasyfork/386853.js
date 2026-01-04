// ==UserScript==
// @name         哔哩哔哩(B站, bilibili)播放界面和部分操作优化
// @description  B站播放器速度自定义(0.25 ~ 3), 支持快捷键(z:正常, x:减少速度, c:增加速度), 鼠标中键切换全屏等
// @namespace    bili
// @version      1.6.29
// @author       vizo
// @license      MIT
// @include      *bilibili.com/video/*
// @include      *bilibili.com/bangumi/play*
// @include      *bilibili.com/medialist/*
// @include      *bilibili.com/cheese/play*
// @include      *search.bilibili.com*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @require      https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @require      https://unpkg.com/vio-utils@2.7.8/index.js
// @require      https://unpkg.com/@vizoy/tmk-utils@1.2.18/index.js
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/386853/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%28B%E7%AB%99%2C%20bilibili%29%E6%92%AD%E6%94%BE%E7%95%8C%E9%9D%A2%E5%92%8C%E9%83%A8%E5%88%86%E6%93%8D%E4%BD%9C%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/386853/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%28B%E7%AB%99%2C%20bilibili%29%E6%92%AD%E6%94%BE%E7%95%8C%E9%9D%A2%E5%92%8C%E9%83%A8%E5%88%86%E6%93%8D%E4%BD%9C%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==


GM_addStyle(`
  html {
    overflow-y: scroll;
  }
  html.hideScroll {
    overflow: hidden;
    margin-left: -3px;
  }
  body::-webkit-scrollbar {
    width: 6px;
  }
  body::-webkit-scrollbar-corner,
  body::-webkit-scrollbar-track {
    background-color: #f8f8f8;
  }
  body::-webkit-scrollbar-thumb {
    background: #c5c5c5;
  }
  
  #bilibili-player {
    position: relative;
  }
  #spsy_msg {
    width: 105px;
    height: 42px;
    text-align: center;
    line-height: 42px;
    border-radius: 4px;
    background: rgba(255,255,255,.8);
    color: #222;
    font-size: 16px;
    position: absolute;
    top: -80px;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    z-index: 999888;
    display: none;
  }
  #bl_info_xz {
    height: 25px;
    line-height: 25px;
    font-size: 14px;
    padding: 0 5px;
    color: #00a1d6;
    position: absolute;
    top: -25px;
    right: 0;
    z-index: 2;
  }
  .bilibili-player-video-btn-speed {
    opacity: 0.4;
    pointer-events: none;
  }
  .bilibili-player-video-btn-speed.on {
    opacity: 1;
    pointer-events: auto;
  }
  .bilibili-player-volumeHint,
  .bpx-player-volume-hint {
    display: none !important;
  }
  .so-fg5r .inp {
    width: 50px;
    color: #666;
    border: 1px solid #0ad;
    border-radius: 2px;
    padding: 2px 5px;
    outline: none;
  }
  .so-fg5r .inp:focus {
    border-color: #0ad;
  }
  .so-fg5r span {
    color: #666;
  }
  .video-item.hide_7s {
    display: none !important;
  }
`)

Object.assign(TMK, vio)

const pks = ['video', 'bangumi', 'medialist']
if (
  pks.some(v => location.pathname.includes(v))
  && !location.host.includes('search')
  && document.documentElement.scrollTop === 0
) {
  document.documentElement.classList.add('hideScroll')
}

const G = {
  timer2s: 0,
  timer3s: 0,
  focusChangeTime: 0,
  g2URL: '',
}

async function vdoWp() {
  const sltor = location.pathname.includes('bangumi') ? 
  '.bpx-player-video-area' : 
  '#bilibiliPlayer'
  return (await TMK.loadEl(sltor))
}
async function appendMsgLay() {
  let wp = await vdoWp()
  let msg = document.getElementById('spsy_msg')
  if (!wp.contains(msg)) {
    wp.insertAdjacentHTML('beforeend', `<div id="spsy_msg"></div>`)
  }
}
async function appendAxInfo() {
  let wp = await vdoWp()
  let inf = document.getElementById('bl_info_xz')
  if (!wp.contains(inf)) {
    wp.insertAdjacentHTML('beforeend', `<div id="bl_info_xz"></div>`)
  }
}
function setAxInfo() {
  let inf = $('#bl_info_xz')
  let vol = Math.trunc(getGMvolume() * 100)
  let speed = getGMspeed()
  if (inf.length) {
    speed = speed === 1 ? speed : `<span style="color:#f33;">${speed}</span>`
    inf.html(`<span>速度: ${speed} &nbsp; 音量: ${vol}</span>`)
  }
}
function toggleVideoFullscreen() {
  try {
    $('.bilibili-player-video-btn-fullscreen')[0].click()
  } catch (err) {}
  try {
    $('.squirtle-video-fullscreen > div')[0].click()
  } catch (err) {}
}
function setGMspeed(val) {
  return GM_setValue('--> bl_player_speed', val)
}
function setGMvolume(val) {
  GM_setValue('--> bl_player_volume', val)
}
function getGMspeed() {
  return +GM_getValue('--> bl_player_speed') || 1
}
function getGMvolume() {
  let vol = GM_getValue('--> bl_player_volume')
  return vol !== undefined ? vol : 0.5
}
// 判断是否全屏
function isFullScreen() {
  return document.isFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen
}
// 显示信息
function showSpMsg(msg, type = '速度') {
  let mp = $('#spsy_msg')
  clearTimeout(G.timer2s)
  mp.fadeIn(180)
  mp.text(`${type} ${msg}`)
  G.timer2s = setTimeout(() => {
    mp.fadeOut(350)
  }, 800)
}
// 设置播放器播放速度
async function setPlayerSpeed(speedVal = getGMspeed()) {
  const vd = await vdo()
  if (vd) {
    vd.playbackRate = speedVal
  }
  if (vd.nodeName === 'bwp-video' || vd?.nodeName?.includes('bwp-video')) {
    $('.bilibili-player-video-btn-speed').addClass('on')
  }
  setGMspeed(speedVal)
  setAxInfo()
}
// 设置音量
async function setVolume(vol = getGMvolume()) {
  const vd = await vdo()
  if (vd) {
    vd.volume = vol
  }
  setGMvolume(vol)
  setAxInfo()
}

async function vdo() {
  const node = await TMK.loadEl('video, bwp-video')
  return node.length > 1 ? node[0] : node
}

function setVdoCfg() {
  appendMsgLay()
  appendAxInfo()
  setPlayerSpeed()
  setVolume()
}

function runVdoTimer() {
  setVdoCfg()
  setTimeout(runVdoTimer, 2000)
}

async function regWpMouseEvt() {
  const wwp = $('#playerWrap')
  const wp = wwp.length ? wwp : await vdoWp()
  $(wp).on('mouseenter', () => {
    $('html').addClass('hideScroll')
  })
  $(wp).on('mouseleave', () => {
    $('html').removeClass('hideScroll')
  })
}

function watchUrlFunc() {
  if (G.g2URL !== location.href) {
    G.g2URL = location.href
    eachVideoList()
  }
  setTimeout(watchUrlFunc, 500)
}

function tryAppendSoMod() {
  if ($('.so-fg5r').length) return
  const html = `
    <div class="so-fg5r">
      <input class="inp inp-s" type="text">
      <span> - </span>
      <input class="inp inp-e" type="text">
      <span>分钟</span>
    </div>
  `
  $('ul.filter-type.duration').append(html)
}

function watchContains() {
  TMK.watchDom('.contain', () => {
    tryAppendSoMod()
  })
}

function eachVideoList() {
  const min = $('.inp-s').val() || 0
  const max = $('.inp-e').val() || 1e9
  if (!min && !max) {
    $('.video-list > li.video-item').each((i, v) => {
      $(v).removeClass('hide_7s')
    })
    return
  }
  
  $('.video-list > li.video-item').each((i, v) => {
    let tis = $(v)
    tis.removeClass('hide_7s')
    let sTime = tis.find('.so-imgTag_rb').text()
    let mth = sTime.match(/\d{2}(?=(\:\d{2}){2})/)
    let hour = mth ? mth[0] : 0
    let minute = sTime.replace(/(?:\d{2}\:)?(\d{2})\:\d{2}/, '$1')
    let total = Number(hour) * 60 + Number(minute)
    
    if (total < Number(min) || total > Number(max)) {
      tis.closest('.video-item').addClass('hide_7s')
    }
  })
  
  microScroll()
}

function microScroll() {
  clearTimeout(G.timer3s)
  G.timer3s = setTimeout(async () => {
    const st = document.documentElement.scrollTop
    window.scrollTo(0, st + 1)
    await vio.timeout(100)
    window.scrollTo(0, st)
  }, 500)
}

function regPageKey() {
  $('body').on('keydown', function(e) {
    try {
      if (/left/i.test(e.key)) {
        $('.page-item.prev > button')[0].click()
      }
      if (/right/i.test(e.key)) {
        $('.page-item.next > button')[0].click()
      }
    } catch(e) {}
  })
}
   
// 筛选搜索结果
$('body').on('input', '.inp-s, .inp-e', function() {
  eachVideoList()
})

async function initVolumeLabel(val = getGMspeed()) {
  const vArr = [0.5, 0.75, 1, 1.25, 1.5, 2]
  if (!vArr.includes(val)) return
  const lbs = await TMK.loadEl('.bilibili-player-video-btn-speed-menu-list')
  $(lbs).each((i, v) => {
    const tis = $(v)
    const vol = tis.attr('data-value')
    if (vol && vol === String(val)) {
      v.click()
    }
  })
}


function regKbEvt() {
  window.addEventListener('keydown', async e => {
    if (e.target.nodeName !== 'BODY') return
     
    if (/^[zxc]$/.test(e.key) && !e.altKey && !e.ctrlKey) {
      await TMK.timeout(100)
      if (Date.now() - G.focusChangeTime < 1000) return
      let val = getGMspeed()
      if (e.key === 'z') {
        val = 1
      }
      if (e.key === 'x') {
        val = Math.max(val - 0.25, 0.25)
      }
      if (e.key === 'c') {
        val = Math.min(val + 0.25, 3)
      }
      setPlayerSpeed(val)
      showSpMsg(val)
      initVolumeLabel(val)
    }
     
    if (/up|down/i.test(e.key)) {
      let vl = getGMvolume()
      let vol = e.key.includes('Up') ? Math.min(vl + 0.03, 1) : Math.max(vl - 0.03, 0)
      setVolume(TMK.floor(vol))
      showSpMsg(Math.trunc(vol * 100), '音量')
    }
  })
  
  // ctrl和alt按下后短时间内阻止zxc
  $('body').on('keydown', function(e) {
    if (/up|down/i.test(e.key)) {
      e.stopPropagation()
      e.preventDefault()
    }
  })
}

function regMouseEvt() {
  window.addEventListener('wheel', async (e) => {
    const wp = await vdoWp()
    const isContains = wp.contains(e.target)
     
    if (!isContains) return
     
    let vol = getGMvolume()
    $('video').each((i, v) => {
      if ($(v).attr('src')) {
        v.muted = false
      }
    })
     
    if (e.deltaY > 0) {
      // 减少音量
      vol = Math.max(vol - (e.altKey ? 0.1 : 0.03), 0)
    } else {
      // 增加音量
      vol = Math.min(vol + (e.altKey ? 0.1 : 0.03), 1)
    }
    vol = TMK.floor(vol)
    setVolume(vol)
     
    let pVol = Math.trunc(vol * 100)
    showSpMsg(pVol, '音量')
  })
  
  // 滚轮中键点击(滚轮点击)切换全屏
  $('body').on('mousedown', '.bilibili-player-video-wrap,.bpx-player-video-area', function(e) {
    if (e.button === 1) {
      e.preventDefault()
      toggleVideoFullscreen()
    }
  })
}

async function initFunc() {
  ['focus', 'blur'].forEach(v => {
    window.addEventListener(v, e => {
      G.focusChangeTime = Date.now()
    })
  })
  
  if (location.host.includes('search.bilibili.com')) {
    watchContains()
    watchUrlFunc()
    regPageKey()
  } else {
    runVdoTimer()
    regWpMouseEvt()
    regKbEvt()
    regMouseEvt()
    initVolumeLabel()
  }
}

initFunc()


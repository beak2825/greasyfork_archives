// ==UserScript==
// @name         小白条 - 我要看时间
// @namespace    MouseTail-quick-time
// @version      0.2
// @description  没啥，就是想随手看看时间
// @author       You
// @match        *://*/*
// @icon         https://i.v2ex.co/6suT27n8s.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449117/%E5%B0%8F%E7%99%BD%E6%9D%A1%20-%20%E6%88%91%E8%A6%81%E7%9C%8B%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/449117/%E5%B0%8F%E7%99%BD%E6%9D%A1%20-%20%E6%88%91%E8%A6%81%E7%9C%8B%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function() {
  'use strict';
  /** ======== 全局变量 ======== */
  const state = {
    toggleLevel: 0, // 触发等级
    toggleTimer: null, // 触发相关计时器
    showTimer: null, // 面板显示相关计时器
    autoHide: true, // 是否自动隐藏面板
    mainTimer: null, // 核心计时器
    time: [], // 时间数字数组
    showSep: 1, // 是否显示分隔符
    clockEl: null, // 时钟元素
    numEls: null, // 时间字符元素
    sepEls: null, // 分隔字符元素
    fontSize: 18, // 时钟文字大小
  }
  /** ======== 功能函数 ======== */
  /**
   * 创建并插入元素
   *
   * @param {*} tagName
   * @param {*} attrs
   * @param {*} parent
   * @return {*} 
   */
  const createEl = (tagName, attrs, parent)=>{
    const el = document.createElement(tagName)
    for(const attrName in attrs){
      el[attrName] = attrs[attrName]
    }
    parent.appendChild(el)
    return el
  }
  /**
   * 数字两位化
   *
   * @param {number} num 0~99 的整数
   */
  const dbNum = (num) => (num > 9 ? String(num) : "0" + num);
  /** ======== 元素创建 ======== */
  const MouseTailRoot = createEl('div', {id: 'MouseTail'}, document.querySelector('html'))
  const MouseTail = MouseTailRoot.attachShadow({mode: 'closed'})

  const style = createEl('style', {
    innerHTML: `
    :root {
      font-family: -apple-system, BlinkMacSystemFont, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Segoe UI", "PingFang SC", "Hiragino Sans GB", "WenQuanYi Micro Hei", "Lantinghei SC", "Source Han Sans", "Microsoft YaHei", "Helvetica Neue", "Noto Sans CJK", Helvetica, Arial, sans-serif;
      font-size: 18px;
    }
    #MouseTailBar {
      position: fixed;
      top: 0;
      left: 40vw;
      z-index: 2147483647;
      width: 20vw;
      height: 2px;
      background: rgba(255, 255, 255, .3);
      backdrop-filter: blur(8px);
      border-radius: 16px;
      cursor: pointer;
    }
    #MouseTailPanel {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 2147483647;
      width: 100vw;
      height: 0;
      background: rgba(0, 0, 0, .6);
      backdrop-filter: blur(32px);
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      align-content: center;
      color: rgba(255, 255, 255, .9);
      transition: height .2s;
    }
    #MouseTailPanel.show {
      height: 100vh;
    }
    #clock {
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      align-content: center;
      flex-wrap: nowrap;
      font-family: Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New, monospace;
    }
    #clock .clock-item {
      width: .6em;
      height: 1em;
      line-height: 1em
      overflow: hidden;
    }
    #clock .sep {
      transition: opacity 1s;
    }
    #clock .sep.hide {
      opacity: 0
    }
    `
  }, MouseTail)
  const MouseTailBar = createEl('div', {
    id: `MouseTailBar`
  }, MouseTail)
  const MouseTailPanel = createEl('div', {
    id: `MouseTailPanel`,
    innerHTML: `
    <div id="clock">
      <div class="clock-item num">0</div>
      <div class="clock-item num">0</div>
      <div class="clock-item sep">:</div>
      <div class="clock-item num">0</div>
      <div class="clock-item num">0</div>
      <div class="clock-item sep">:</div>
      <div class="clock-item num">0</div>
      <div class="clock-item num">0</div>
    </div>
    `,
  }, MouseTail)
  state.clockEl = MouseTailPanel.querySelector('#clock')
  state.numEls = MouseTailPanel.querySelectorAll('.num')
  state.sepEls = MouseTailPanel.querySelectorAll('.sep')
  /** ======== 面板函数 ======== */
  const togglePanel = (toShow)=>{
    window.clearTimeout(state.toggleTimer)
    if(toShow){
      state.toggleLevel++
      if(state.toggleLevel > 2){
        main()
      }
      state.toggleTimer = window.setTimeout(()=>{
        MouseTailPanel.classList.remove('show')
        state.toggleLevel = 0
      }, 1000)
      return
    }
    state.toggleTimer = window.setTimeout(()=>{
      MouseTailPanel.classList.remove('show')
      state.toggleLevel = 0
    }, 500)
  }
  /** ======== 核心函数 ======== */
  const main = ()=>{
    MouseTailPanel.classList.add('show')
    window.clearInterval(state.mainTimer)
    sizeRefresh()
    clock()
    state.mainTimer = window.setInterval(clock, 200)
    return
  }
  const sizeRefresh = ()=>{
    const nowFontSize = +window.getComputedStyle(state.clockEl).fontSize.replace(/px/, '')
    const clockSize = state.clockEl.getBoundingClientRect()
    const scale = Math.min(window.innerWidth/clockSize.width, window.innerHeight/clockSize.height)
    const newSize = Math.floor( nowFontSize*scale*0.9 )+'px'
    if(state.fontSize === newSize) return
    state.fontSize = newSize
    state.clockEl.style.fontSize = newSize
  }
  const clock = ()=>{
    const now = new Date()
    const seconds = now.getSeconds()
    const showSep = seconds%2
    const timeArr = (dbNum(now.getHours()) + dbNum(now.getMinutes()) + dbNum(seconds)).split('')
    timeArr.forEach((n, i)=>{
      if(state.time[i] === n) return
      state.time[i] = n
      state.numEls[i].innerText = n
    })
    if(state.showSep !== showSep){
      state.showSep = showSep
      state.sepEls.forEach(e=>e.classList.toggle('hide'))
      sizeRefresh()
    }
  }
  /** ======== 事件监听 ======== */
  MouseTailBar.addEventListener('mouseenter',()=>{
    window.clearTimeout(state.toggleTimer)
  })
  MouseTailBar.addEventListener('mouseleave',()=>{
    togglePanel(1)
  })
  MouseTailPanel.addEventListener('mouseenter',()=>{
    window.clearTimeout(state.toggleTimer)
  })
  MouseTailPanel.addEventListener('mouseleave',()=>{
    togglePanel()
  })
})();
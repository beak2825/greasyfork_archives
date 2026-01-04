// ==UserScript==
// @name        帧耗时监测
// @namespace   github.com/Yidadaa
// @match       *://*/*
// @grant       none
// @version     1.4
// @author      Yidadaa
// @license MIT
// @description 2022/8/5 16:11:14
// @downloadURL https://update.greasyfork.org/scripts/448976/%E5%B8%A7%E8%80%97%E6%97%B6%E7%9B%91%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/448976/%E5%B8%A7%E8%80%97%E6%97%B6%E7%9B%91%E6%B5%8B.meta.js
// ==/UserScript==


// 最近两秒钟的最大帧耗耗时，平均帧率
let times = []
let lastTime = performance.now()
let frameCount = 0

const timeWindowSize = 30
const refreshFrameCount = 10

let keyboardEvents = []
let shouldLog = false

const div = document.createElement('div')
div.style.position = 'fixed'
div.style.bottom = '5px'
div.style.left = '5px'
div.style.innerText = 'Loading'
div.style.padding = '10px'
div.style.background = '10px'
div.style.zIndex = '999'
div.style.fontFamily = 'monospace'
div.style.background = 'rgba(255, 255, 255, 0.8)'
div.style.color = 'black'
div.style.border = '1px solid rgba(0, 0, 0, 0.05)'
div.style.backdropFilter = 'blur(5px)'

const text = document.createElement('pre')
div.appendChild(text)

const actions = document.createElement('div')
actions.style.display = 'flex'
actions.style.justifyContent = 'space-between'

const clearBtn = document.createElement('button')
clearBtn.innerText = '清除'
clearBtn.onclick = () => {
  keyboardEvents = []
}

const toggleBtn = document.createElement('button')
toggleBtn.innerText = shouldLog ? '停止' : '开始'
toggleBtn.onclick = () => {
  shouldLog = !shouldLog
  toggleBtn.innerText = shouldLog ? '停止' : '开始'
}

actions.appendChild(toggleBtn)
actions.appendChild(clearBtn)
div.appendChild(actions)

document.body.appendChild(div)

function logKeyBoardEvent(e, type) {
  if (!shouldLog) return

  const modifiers = ['meta', 'shift', 'ctrl', 'alt']
  const events = []

  for (const key of modifiers) {
    if (e[`${key}Key`]) {
      events.push(key)
    }
  }
  keyboardEvents.push(events.concat([e.code, type]).join(' '))
}

document.body.onkeydown = e => {
  logKeyBoardEvent(e, 'down')
}

document.body.onkeyup = e => {
  logKeyBoardEvent(e, 'up')
}

function tickFrame() {
  const t = performance.now()
  const tickTime = t - lastTime
  times.push(tickTime)

  lastTime = t

  if (times.length > timeWindowSize) {
    times.shift()
  }


  if (frameCount ++ > refreshFrameCount) {
    let maxTime = 0, totalTime = 0

    for (const time of times) {
      maxTime = Math.max(maxTime, time)
      totalTime += time
    }

    const avgTime = totalTime / times.length
    const fps = 1000 / avgTime

    text.innerText = `[Recent ${times.length} frames]\nMax Frame Time: ${maxTime.toFixed(2)}ms\nAvg Frame Time: ${avgTime.toFixed(2)}ms\nFPS: ${fps.toFixed(2)}\n--Events--\n` + keyboardEvents.join('\n')
    frameCount = 0
  }


  requestAnimationFrame(tickFrame)
}

tickFrame()
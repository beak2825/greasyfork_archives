// ==UserScript==
// @name         QWERASDScript
// @namespace    http://tampermonkey.net/
// @version      2024.12.15.6
// @description  放大预览图
// @author       WWW
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @match        http://43.143.158.24:8098/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=158.24
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520448/QWERASDScript.user.js
// @updateURL https://update.greasyfork.org/scripts/520448/QWERASDScript.meta.js
// ==/UserScript==

(async function() {
  'use strict'

  const $ = jQuery.noConflict(true)

  function wait(ms) {
    console.log(`wait: ${ms}ms`)
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  function createAsyncInterval(callback, interval) {
    let isRunning = false

    const runner = async () => {
      if (isRunning) return
      isRunning = true
      await callback()
      isRunning = false
      setTimeout(runner, interval)
    }

    runner()

    return {
      stop() {
        isRunning = true
      }
    }
  }

  const getTrId = element =>
    element.querySelector('td.el-table_1_column_2.is-center > div.cell').textContent
  const getTrCheckbox = element => element.querySelector('label.el-checkbox')
  const labelIsChecked = element => element.classList.contains('is-checked')

  ////////////////////////////////////////////////////////////////////////////

  document.head.innerHTML += (`
    <style>
      .script-container * {
        box-sizing: border-box;
        font-size: 0.85rem;
        min-width: 0;
      }
      .script-container button {
        cursor: pointer;
      }
      .script-control-button {
        cursor: pointer;
        font-size: 1rem;
        position: absolute;
        left: 100%;
        top: 50%;
        transform: translateY(-50%);
        width: 1.5em;
        height: 3em;
        border: 1px solid rgba(0,0,0,0.1);
        border-radius: 0 0.25em 0.25em 0;
        background: #ffffff;
        box-shadow: 0 0 8px rgba(0,0,0,0.1);
      }
      .script-container {
        transition: all 250ms ease-out;
        box-sizing: border-box;
        z-index: 9999;
        position: fixed;
        left: 0.25em;
        bottom: 0.25em;
        width: 12em;
        background: #ffffff;
        padding: 0.75em;
        border: 1px solid rgba(0,0,0,0.1);
        border-radius: 0.5em;
        box-shadow: 0 0 8px rgba(0,0,0,0.1);
      }
      .script-container-close {
        left: 0;
        transform: translateX(-100%);
      }
      .script-grid {
        display: grid;
        gap: 0.5em;
      }
      .script-flex {
        display: flex;
        flex-direction: row;
        gap: 0.5em;
      }
      .script-flex-column {
        display: flex;
        flex-direction: column;
        gap: 0.5em;
      }
      .script-items-center {
        align-items: center;
      }
      .s-w-full {
        width: 100%;
      }
      .s-h-full {
        height: 100%;
      }
      .s-pad1 {
        padding: 0.25em;
      }
      .fixed-full {
        width: 100%;
        height: 100%;
        min-width: 100%;
        max-width: 100%;
        min-height: 100%;
        max-height: 100%;
      }
    </style>
`)

  document.querySelector('body').insertAdjacentHTML('beforeend', `
    <div id="script-container" class="script-container script-flex-column" style="gap: 0.5em">
      <div id="script-control-button" class="script-control-button"></div>
    
      <div class="script-grid script-items-center" style="grid-template-rows: auto 4em">
        <div>滑块 ID</div>
        <textarea class="fixed-full s-pad1" id="target-ids1"></textarea>
      </div>
    
      <div class="script-grid script-items-center" style="grid-template-rows: auto 4em">
        <div>关门 ID</div>
        <textarea class="fixed-full s-pad1" id="target-ids2"></textarea>
      </div>
      
      <div class="script-grid script-items-center" style="grid-template-columns: auto 1fr">
        <div>滑块时间:</div>
        <input type="number" id="delay1" placeholder="启动延时">
      </div>
      
      <div class="script-grid script-items-center" style="grid-template-columns: auto 1fr">
        <div>重启任务周期:</div>
        <input type="number" id="delay2" placeholder="循环间隔">
      </div>
      
      <div class="script-grid script-items-center" style="grid-template-columns: auto 1fr">
        <div>过滑块周期:</div>
        <input type="number" id="delay3" placeholder="循环间隔">
      </div>
      
      <div class="script-grid script-items-center" style="grid-template-columns: auto 1fr">
        <div>循环次数</div>
        <input type="number" id="loop-times" placeholder="循环次数">
      </div>
      
      <div class="script-grid" style="grid-template-columns: repeat(3, 1fr)">
        <button id="save-data">保存</button>
        <button id="start-script">开始</button>
        <button id="stop-script" disabled>停止</button>
      </div>
    </div>
`)

  const scriptContainer = $('#script-container')
  const scriptControlButton = $('#script-control-button')

  // 输入框
  const targetIds1Input = $('#target-ids1')
  const targetIds2Input = $('#target-ids2')

  const delay1Input = $('#delay1')
  const delay2Input = $('#delay2')
  const delay3Input = $('#delay3')

  const loopTimesInput = $('#loop-times')

  targetIds1Input.val(localStorage.getItem('targetIds1') ?? [1, 2, 3].join(','))
  targetIds2Input.val(localStorage.getItem('targetIds2') ?? [1, 2, 3].join(','))

  delay1Input.val(localStorage.getItem('delay1') ?? 2)
  delay2Input.val(localStorage.getItem('delay2') ?? 4)
  delay3Input.val(localStorage.getItem('delay3') ?? 8)

  loopTimesInput.val(localStorage.getItem('loopTimes') ?? 1)

  const saveDataButton = $('#save-data')
  const startScriptButton = $('#start-script')
  const stopScriptButton = $('#stop-script')

  function stringToArrays(str) {
    return str
      .split(',')
      .filter(v => /^\d+$/.test(v.trim()))
      .map(Number)
      .filter(v => !isNaN(v))
  }

  ////////////////////////////////////////////////////////////////////////////

  const getTargetIds1 = () => stringToArrays(targetIds1Input.val())
  const getTargetIds2 = () => stringToArrays(targetIds2Input.val())

  const getDelay1 = () => Number(delay1Input.val()) * 1000
  const getDelay2 = () => Number(delay2Input.val()) * 1000
  const getDelay3 = () => Number(delay3Input.val()) * 1000

  const getLoopTimes = () => Number(loopTimesInput.val())

  scriptControlButton.click(function() {
    if (scriptContainer.hasClass('script-container-close'))
      scriptContainer.removeClass('script-container-close')
    else
      scriptContainer.addClass('script-container-close')
  })

  // 保存
  saveDataButton.click(function() {

    const targetIds1 = getTargetIds1()
    const targetIds2 = getTargetIds2()

    targetIds1Input.val(targetIds1.join(','))
    targetIds2Input.val(targetIds2.join(','))

    localStorage.setItem('targetIds1', targetIds1)
    localStorage.setItem('targetIds2', targetIds2)

    localStorage.setItem('delay1', delay1Input.val())
    localStorage.setItem('delay2', delay2Input.val())
    localStorage.setItem('delay3', delay3Input.val())

    localStorage.setItem('loopTimes', getLoopTimes().toString())
  })
  // 开始
  startScriptButton.click(function() {
    currentTimes = 0
    return currentState.value = stateType.InProgress
  })
  // 结束
  stopScriptButton.click(() => currentState.value = stateType.Completed)

  const stateType = { InProgress: 'InProgress', Completed: 'Completed' }
  const currentState = {
    _value: stateType.Completed,
    get value() {
      return this._value
    },
    set value(newValue) {
      this._value = newValue
      startScriptButton.prop('disabled', newValue === stateType.InProgress)
      stopScriptButton.prop('disabled', newValue === stateType.Completed)
    }
  }

  // 循环次数
  let currentTimes = 0

  function check() {
    if (currentTimes >= getLoopTimes()) {
      currentTimes = 0
      currentState.value = stateType.Completed
      return true
    }

    return false
  }

  // 表格
  const tableSelector = 'div.el-table__body-wrapper.is-scrolling-left > table'
  // 行
  const trSelector = 'tr.el-table__row'
  // 操作按钮
  const actionButtonSelector = 'div.mb8.el-row > div > button'

  let trElements = null
  let buttonElements = null
  let buttonsDictionary = null
  const mainAsyncInterval = createAsyncInterval(async function() {
    if (!/^http:\/\/43.143.158.24:8098\/#\/task\/tasklist/.test(window.location.href)) return
    if (currentState.value === stateType.Completed || check()) return

    trElements = Array.from(document.querySelectorAll(`${tableSelector} ${trSelector}`))
    buttonElements = Array.from(document.querySelectorAll(actionButtonSelector))
    if (trElements.length === 0 || buttonElements.length === 0) return

    buttonsDictionary = arrangeButtons(buttonElements)

    await clickCheckboxesByTargetIds(getTargetIds1())
    buttonsDictionary['开启任务(清除历史)'].click()
    await wait(getDelay1())
    await clickCheckboxesByTargetIds(getTargetIds1())
    buttonsDictionary['停止任务(停止远程)'].click()

    await wait(2000)

    await clickCheckboxesByTargetIds(getTargetIds2())
    buttonsDictionary['开启任务(清除历史)'].click()
    await wait(getDelay2())
    await clickCheckboxesByTargetIds(getTargetIds2())
    buttonsDictionary['停止任务(停止远程)'].click()

    await wait(2000)

    await clickCheckboxesByTargetIds(getTargetIds2())
    buttonsDictionary['开启任务(清除历史)'].click()
    await wait(getDelay3())
    await clickCheckboxesByTargetIds(getTargetIds2())
    buttonsDictionary['停止任务(停止远程)'].click()

    console.log(`第 ${++currentTimes} 次任务完成...`)
  }, 5000)

  // 点击 ids 内的 checkbox
  async function clickCheckboxesByTargetIds(targetIds) {
    trElements
      .filter(el => !labelIsChecked(getTrCheckbox(el)) && targetIds.includes(Number(getTrId(el))))
      .forEach(el => getTrCheckbox(el).click())
    await wait(500)
  }

  // 整理按钮
  function arrangeButtons(buttonElements) {
    const buttons = {}
    buttonElements.forEach(el => {
      const text = el.querySelector('& > span').textContent.trim()
      buttons[text] = el
    })
    return buttons
  }


})()
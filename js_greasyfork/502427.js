// ==UserScript==
// @name        我的文字修仙全靠刷之随身老爷爷
// @namespace   Violentmonkey Scripts
// @match       https://xiuxian.jntm.cool/
// @grant       none
// @version     1.43
// @author      -
// @description 2024/7/31 10:36:02
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502427/%E6%88%91%E7%9A%84%E6%96%87%E5%AD%97%E4%BF%AE%E4%BB%99%E5%85%A8%E9%9D%A0%E5%88%B7%E4%B9%8B%E9%9A%8F%E8%BA%AB%E8%80%81%E7%88%B7%E7%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/502427/%E6%88%91%E7%9A%84%E6%96%87%E5%AD%97%E4%BF%AE%E4%BB%99%E5%85%A8%E9%9D%A0%E5%88%B7%E4%B9%8B%E9%9A%8F%E8%BA%AB%E8%80%81%E7%88%B7%E7%88%B7.meta.js
// ==/UserScript==
(function () {
  'use strict';

  class Interval {
    constructor(fun, speed) {
      this.fun = fun
      this.speed = speed
      this.id = null
      this.runing = false
    }

    start () {
      console.log('Interval.start()')
      if (this.id) {
        return
      }
      this.runing = true
      this.id = setInterval(this.fun, this.speed)
    }

    stop () {
      console.log('Interval.stop()')
      if (this.id) {
        this.runing = false
        clearInterval(this.id)
        console.log(`Interval.stop()-clearInterval(${this.id})`)
        this.id = null
      }
    }

    isRun () {
      return this.runing
    }

    isNotRun () {
      return !this.isRun()
    }
  }

  class LinkInterval extends Interval {
    #handleBefore
    #handleAfter
    constructor(linkList, speed, one = true, startClickButtonList = [], endClickButtonList = []) {
      super(null, speed)
      const _run = this.#run.bind(this)
      super.fun = _run

      this.startClickButtonList = startClickButtonList
      this.startClickButtonListLength = startClickButtonList.length
      this.startClickButtonListIndex = 0

      this.endClickButtonList = endClickButtonList
      this.endClickButtonListLength = endClickButtonList.length
      this.endClickButtonListIndex = 0

      this.linkList = linkList
      this.linkListLength = linkList.length

      this.one = one
      this.linkListIndex = 0
      this.next = null
      this.#handleBefore = () => { }
      this.#handleAfter = () => { }

      this.excNext = true

      this.cycleCount = 0
    }

    setHandleBefore (fun) {
      this.#handleBefore = fun
      this.#handleBefore = this.#handleBefore.bind(this)
    }

    setHandleAfter (fun) {
      this.#handleAfter = fun
      this.#handleAfter = this.#handleAfter.bind(this)
    }

    start (excNext = true) {
      this.excNext = excNext
      this.startClickButtonListIndex = 0
      this.endClickButtonListIndex = 0
      this.linkListIndex = 0
      this.cycleCount = 0
      super.start()
    }

    stop () {
      if (this.#isExecEndClickButtonList()) {
        this.runing = false
        return
      }
      super.stop()
      if (this.next && super.isRun()) {
        this.next.stop()
      }
    }

    linkNext (next) {
      this.next = next
      return this
    }

    nextInterval () {
      console.log(`执行下一定时器${this.next}`)
      this.stop()
      if (super.isNotRun() && this.next) {
        this.next.start()
      }
    }

    #run () {
      this.#handleBefore(this)
      if (super.isNotRun() && !this.#isExecEndClickButtonList()) {
        super.stop()
        return
      }
      let item = null, linkListlinkListEndIndex = false
      if (super.isRun() && this.#isExecStartClickButtonList()) {
        item = this.startClickButtonList[this.startClickButtonListIndex++]
      } else if (super.isNotRun() && this.#isExecEndClickButtonList()) {
        item = this.endClickButtonList[this.endClickButtonListIndex++]
      } else {
        let curIndex = (this.linkListIndex++) % this.linkListLength
        item = this.linkList[curIndex]
        linkListlinkListEndIndex = curIndex === (this.linkListLength - 1)
        if (linkListlinkListEndIndex) {
          this.cycleCount = this.linkListIndex / this.linkListLength
          console.log(`当前周期：${this.cycleCount}`)
        }
      }
      let cbs = findClickButton(item)
      if (cbs) {
        for (const cb of cbs) {
          console.log(`[${item}]元素点击。`)
          cb.click()
        }
      } else {
        console.warn(`未找到[${item}]元素。`)
      }
      this.#handleAfter(this)
      if (this.one == true && linkListlinkListEndIndex) {
        if (this.excNext) {
          this.nextInterval()
        } else {
          this.stop()
          this.excNext = true
        }
      }
    }

    #isExecStartClickButtonList () {
      return this.startClickButtonListIndex < this.startClickButtonListLength
    }

    #isExecEndClickButtonList () {
      return this.endClickButtonListIndex < this.endClickButtonListLength
    }
  }
  // 总速度
  let speed = 50
  // 出售频率
  let sellFrequency = 256
  // 培养次数
  let raisePetFrequency = 16
  // 升级次数
  let upgradeFrequency = 16

  function handleAfter (_this) {
    if (sellFrequency <= 0) {
      return
    }
    if (_this.cycleCount == sellFrequency) {
      _this.nextInterval()
    }
  }
  const commonClickButtonList = ['it>立马撤退', 'it>发起战斗', 'it>回家疗伤', 'it>返回家里']
  // 出售任务
  const sellInterval = new LinkInterval(
    [
      'it>批量处理',
      'body > div.game-container-wrapper > div.game-container > div.index > div:nth-child(7) > div > div.el-dialog__body > div:nth-child(3) > button',
      'body > div.game-container-wrapper > div.game-container > div.index > div:nth-child(7) > div > div.el-dialog__header > button'
    ],
    200, true, commonClickButtonList
  )
  // 修炼任务
  const cultivateInterval = new LinkInterval(['it>开始修炼', 'it>继续修炼', 'it>突破境界'], speed, false, [], commonClickButtonList)
  // 探索任务
  const autoInterval = new LinkInterval(['it>探索秘境', 'it>发起战斗', 'it>继续探索'], speed, false, [], commonClickButtonList)
  autoInterval.linkNext(sellInterval)
  autoInterval.setHandleAfter(handleAfter)
  // 抓宠任务
  const petInterval = new LinkInterval(['it>探索秘境', 'it>收服对方', 'it>发起战斗', 'it>继续探索'], speed, false, [], commonClickButtonList)
  petInterval.linkNext(sellInterval)
  petInterval.setHandleAfter(handleAfter)
  // 放宠任务
  const releasePetInterval = new LinkInterval([
    'it>批量处理',
    'body > div.game-container-wrapper > div.game-container > div.index > div:nth-child(7) > div > div.el-dialog__body > div:nth-child(5) > button',
    'body > div.game-container-wrapper > div.game-container > div.index > div:nth-child(7) > div > div.el-dialog__header > button'
  ], speed, true, [])
  // 培养宠物任务
  const raisePetInterval = new LinkInterval(['it>点击培养', 'it>确定以及肯定'], speed, false,
    ['body > div > div.game-container > div.index > div.index-box > div.equip-box > div:nth-child(3) > span > span.pet'],
    ['#el-drawer__title > button'])
  raisePetInterval.setHandleAfter((_this) => {
    if (_this.cycleCount == raisePetFrequency) {
      _this.stop()
      unDisabled()
    }
  })
  //TODO BOSS任务

  class GroupLinkInterval {
    constructor(speed) {
      this.map = {}
      this.clickButtonList = ['it>点击炼器', 'it>确定以及肯定']
      this.endClickButtonList = ['#el-drawer__title > button']
      this.speed = speed

      this.groupButtonList = [
        { key: '升级神兵', startClickButtonList: ['body > div > div.game-container > div.index > div.index-box > div.equip-box > div:nth-child(1) > span:nth-child(1) > span.el-tag'] },
        { key: '升级护甲', startClickButtonList: ['body > div > div.game-container > div.index > div.index-box > div.equip-box > div:nth-child(1) > span:nth-child(2) > span.el-tag'] },
        { key: '升级灵宝', startClickButtonList: ['body > div > div.game-container > div.index > div.index-box > div.equip-box > div:nth-child(2) > span:nth-child(1) > span.el-tag'] },
        { key: '升级法器', startClickButtonList: ['body > div > div.game-container > div.index > div.index-box > div.equip-box > div:nth-child(2) > span:nth-child(2) > span.el-tag'] }
      ]
    }

    init (divBox) {
      for (const groupButton of this.groupButtonList) {
        let key = groupButton.key
        let startClickButtonList = groupButton.startClickButtonList
        let interval = new LinkInterval(this.clickButtonList, this.speed, false, startClickButtonList, this.endClickButtonList)
        interval.setHandleAfter((_this) => {
          if (_this.cycleCount == upgradeFrequency) {
            _this.stop()
            unDisabled()
          }
        })
        this.map[key] = interval
        addButton(divBox, groupButton.key, ['el-button'], (event) => {
          disabled(event.target)
          this.start(groupButton.key)
        })
      }
    }

    start (key) {
      this.map[key].start()
    }

    setSpeed (speed) {
      this.speed = speed
      for (const key in this.map) {
        this.map[key].speed = this.speed
      }
    }
  }

  setTimeout(() => {
    let divBox = document.createElement('div')
    divBox.style = 'margin-bottom: 8px; padding-top: 16px;'
    const note = document.createElement('span')
    note.innerHTML = `<p style='margin: 2px 0; color: #ba0e0e; font-size: 12px;'>请将出售/升级/培养的相关设置选好后在进行使用。</p>
                      <p style='margin: 2px 0; color: #ba0e0e; font-size: 12px;'>出售：不自动出售将出售频率设置为0。</p>
                      <p style='margin: 2px 0; color: #ba0e0e; font-size: 12px;'>升级：启动后无法停止只能刷新页面，请设置合适的升级次数。</p>
                      <p style='margin: 2px 0; color: #ba0e0e; font-size: 12px;'>如果启动后无效果请回到家里在重新启动。</p>`
    divBox.appendChild(note)
    addInput(divBox, '总速度', speed, (event) => {
      raisePetInterval.speed =
        releasePetInterval.speed =
        cultivateInterval.speed =
        autoInterval.speed =
        sellInterval.speed =
        petInterval.speed = speed = Number(event.target.value)
      groupLinkInterval.setSpeed(speed)
    })
    addInput(divBox, '出售频率', sellFrequency, (event) => { sellFrequency = Number(event.target.value) })
    addInput(divBox, '升级次数', upgradeFrequency, (event) => { upgradeFrequency = Number(event.target.value) })
    addInput(divBox, '培养次数', raisePetFrequency, (event) => { raisePetFrequency = Number(event.target.value) })
    appendLine(divBox)
    // 出售按钮
    addButton(divBox, '快捷出售', ['el-button'], () => { sellInterval.start(false) })
    // 修炼按钮
    const cultivateButtonText = ['开始修炼', '停止修炼']
    const cultivateButton = addButton(divBox, cultivateButtonText[0], ['el-button'], () => {
      if (cultivateButton.innerText === cultivateButtonText[0]) {
        disabled(cultivateButton)
        cultivateInterval.start()
        cultivateButton.innerText = cultivateButtonText[1]
        return
      }
      cultivateInterval.stop()
      cultivateButton.innerText = cultivateButtonText[0]
      unDisabled()
    })
    // 探索按钮
    const buttonText = ['开始探索', '停止探索']
    const autoButton = addButton(divBox, buttonText[0], ['el-button'], () => {
      if (autoButton.innerText === buttonText[0]) {
        disabled(autoButton)
        autoInterval.start()
        sellInterval.linkNext(autoInterval)
        autoButton.innerText = buttonText[1]
        return
      }
      autoInterval.stop()
      autoButton.innerText = buttonText[0]
      unDisabled()
    })
    // 抓宠按钮
    const petButtonText = ['开始抓宠', '停止抓宠']
    const petButton = addButton(divBox, petButtonText[0], ['el-button'], () => {
      if (petButton.innerText === petButtonText[0]) {
        disabled(petButton)
        petInterval.start()
        sellInterval.linkNext(petInterval)
        petButton.innerText = petButtonText[1]
        return
      }
      petInterval.stop()
      petButton.innerText = petButtonText[0]
      unDisabled()
    })
    // 放宠按钮
    const releasePetButton = addButton(divBox, '放宠', ['el-button'], () => {
      releasePetInterval.start()
    })
    // 培养按钮
    const raisePetButton = addButton(divBox, '培养宠物', ['el-button'], () => {
      disabled(raisePetButton)
      raisePetInterval.start()
    })
    appendLine(divBox)
    let groupLinkInterval = new GroupLinkInterval(speed)
    groupLinkInterval.init(divBox)
    const gameBox = document.querySelector('.game-container')
    insertBefore(gameBox, divBox)
  }, 1000)

  function insertBefore (node, newElement) {
    node.insertBefore(newElement, node.firstChild)
  }

  function findClickButton (clickButton) {
    if (clickButton.startsWith('it>')) {
      clickButton = clickButton.replace('it>', '')
      let buttonList = document.querySelectorAll('.el-button')
      for (const node of buttonList) {
        if (node.innerText.replaceAll(' ', '') === clickButton) {
          return [node]
        }
      }
      return null
    }
    return document.querySelectorAll(clickButton)
  }

  function appendLine (divBox) {
    const p = document.createElement('p')
    p.style = 'margin: 2px 0'
    divBox.appendChild(p)
  }

  const buttonList = []
  function addButton (box, name, classNames, onClick) {
    let button = document.createElement("button")
    button.style = 'margin-left: 4px; padding: 10px 10px; margin-top: 6px;'
    button.classList.add(classNames)
    button.innerText = name
    button.addEventListener('click', onClick)
    box.appendChild(button)
    buttonList.push(button)
    return button
  }

  function disabled (button) {
    for (const item of buttonList) {
      item.disabled = true
      item.style.cursor = "not-allowed"
    }
    button.disabled = false
    button.style.cursor = "pointer"
  }

  function unDisabled () {
    for (const item of buttonList) {
      item.disabled = false
      item.style.cursor = "pointer"
    }
  }

  function addInput (box, name, val, onInput) {
    let span = document.createElement("span")
    span.style = 'margin-left: 4px; margin-right: 4px; margin-top: 6px;'
    span.innerHTML = name
    let input = document.createElement("input")
    input.style = 'height: 21px; width: 8%; text-align: center; margin-top: 6px;'
    input.value = val
    input.addEventListener('input', onInput)
    box.appendChild(span)
    box.appendChild(input)
    return input
  }
})();

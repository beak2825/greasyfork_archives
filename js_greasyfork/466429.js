// ==UserScript==
// @name         bilibili直播SC 记录脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动记录当前直播间的sc 发言
// @author       xue6474
// @match        https://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466429/bilibili%E7%9B%B4%E6%92%ADSC%20%E8%AE%B0%E5%BD%95%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/466429/bilibili%E7%9B%B4%E6%92%ADSC%20%E8%AE%B0%E5%BD%95%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(async function () {
  const findElement = ((lastDoc,frames) => {
    return function (selectors,isAll = false) {
      let res,doc
      if (lastDoc) {
        if (isAll) {
          res = lastDoc.querySelectorAll(selectors)
          if (res.length > 0) return res
        } else {
          res = lastDoc.querySelector(selectors)
          if (res) return res
        }
      }
      for (let i = 0; i < frames.length; i++) {
        try {
          doc = frames[i].document
        } catch (error) {
          continue
        }
        if (isAll) {
          res = doc.querySelectorAll(selectors)
          if (res.length > 0) {
            lastDoc = doc
            return res
          }
        } else {
          res = doc.querySelector(selectors)
          if (res) {
            lastDoc = doc
            return res
          }
        }
      }
      console.log('未找到元素',selectors)
    }
  })(window.document,window.frames);

  const log = (...msg) => console.log(`[${new Date().toLocaleTimeString()}]:`,...msg)
  const cb_test = obj => { log('新SC',obj); saveSC(obj) }
  const asleep = (t) => new Promise(res => setTimeout(res,t))
  await asleep(8000)
  const panel_vm = findElement('#pay-note-panel-vm')
  if (!panel_vm) return log('findElement 未找到元素 #pay-note-panel-vm')
    createScBtn(panel_vm)
  start()
  const Panel_Vm_OB = new MutationObserver(records => {
    const childListRecord = records.find(v => v.type === 'childList')
    // console.log('childListRecord',childListRecord)
    if (childListRecord.removedNodes.length > 0) {
      log('SC 面板消失')
    }
    if (childListRecord.addedNodes.length > 0) {
      const isNew = [...childListRecord.addedNodes].some(addedNode => addedNode.classList.contains('pay-note-panel'))
      if (isNew) {
        log('SC 面板出现')
        start()
      }

    }
  })
  Panel_Vm_OB.observe(panel_vm,{ childList: true })

  function start() {
    const panel = panel_vm.querySelector('.pay-note-panel')
    if (panel) {
      getCurrentSc(panel,cb_test)
      //开始监听 .card-list .card-wrapper
      const SC_Wrapper = panel.querySelector('.card-list .card-wrapper')
      const SC_Wrapper_OB = new MutationObserver(records => {
        const childListRecord = records.find(v => v.type === 'childList')
        childListRecord.addedNodes.forEach(addedNode => {
          getCardInfo(addedNode,panel,cb_test)
        })
      })
      SC_Wrapper_OB.observe(SC_Wrapper,{ childList: true })
    } else {
      // 若没有panel 监听 #pay-note-panel-vm
      log('当前没有SC panel,监听 #pay-note-panel-vm 。。。')
    }
  }
  async function getCurrentSc(panel,cb) {
    const cardList = panel.querySelectorAll('.card-item')
    for await (let card of generator(cardList,1000)) {
      getCardInfo(card,panel,cb)
    }
  }
  function* generator(arr = [],t = 500) {
    for (let i = 0; i < arr.length; i++) {
      yield new Promise(res => setTimeout(res,t,arr[i]))
    }
  }
  async function getCardInfo(card,panel,cb) {
    card.click()
    await asleep(300)
    let obj = {
      name: panel.querySelector('.detail-info .name')?.textContent,
      price: panel.querySelector('.detail-info .price')?.textContent,
      text: panel.querySelector('.detail-info .text')?.textContent
    }
    cb(obj)
    card.click()
    await asleep(300)
  }
  function saveSC(obj) {
    obj.time=new Date().toLocaleString()
    let data = localStorage.getItem('SC')
    if (data === null) {
      data = [obj]
    } else {
      data = JSON.parse(data)
      data.push(obj)
    }
    localStorage.setItem('SC',JSON.stringify(data))
  }
    window.generateTable=generateTable
    function generateTable(data = []) {
        let style = document.createElement('style')
        style.innerText = `td {
        border: 1px solid;
        text-align: center;
        padding: 0.5em;
      }`
        let a = data.map(v => {
          return (`
          <tr>
          <td>${v.name}</td>
          <td>${v.price}</td>
          <td>${v.text}</td>
          <td>${v.time}</td>
        </tr>
          `)
        })
        let htmlStr = `<table style="border-collapse: collapse;">
      <thead>
        <tr>
          <td>昵称</td>
          <td>sc价格</td>
          <td>内容</td>
          <td>时间</td>
        </tr>
      </thead>
      <tbody>
        ${a.join('')}
      </tbody>
    </table>`
        let div = document.createElement('div')
        div.innerHTML = htmlStr
        return { div,style }
      }
    function createScBtn(parentEL) {
        let btn = document.createElement('button')
        parentEL.appendChild(btn)
        btn.style.cssText='position:absolute;right:0px;z-index:999;'
        btn.textContent = '查看SC'
        btn.onclick = function () {
          let data = JSON.parse(localStorage.getItem('SC'))
          if (!data) return
          const { div,style } = generateTable(data)
          let w1 = window.open()
          w1.document.head.appendChild(style)
          w1.document.body.appendChild(div)

        }
      }


})()
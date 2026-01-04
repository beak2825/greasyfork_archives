// ==UserScript==
// @name        Theresmore自动升级建筑
// @namespace   Theresmore自动升级建筑
// @match       https://theresmoregame.g8hh.com/
// @grant       none
// @version     1.7
// @author      fbz
// @description 解放你的双手自动升级建筑
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/456312/Theresmore%E8%87%AA%E5%8A%A8%E5%8D%87%E7%BA%A7%E5%BB%BA%E7%AD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/456312/Theresmore%E8%87%AA%E5%8A%A8%E5%8D%87%E7%BA%A7%E5%BB%BA%E7%AD%91.meta.js
// ==/UserScript==
;(function () {
  const timeout = 1000 * 10 // 10秒点一次
  const minFood = 5 // 食物最小值

  let blackList = initBlackList() // 部分只能建造一个的建筑需要跳过
  const houseList = ['房屋', '市政厅', '宅邸', '住宅区', '发展部', '定居点大厅'] // 会减少食物的建筑
  function initBlackList() {
    return ['雕像', '神殿']
  }
  var css = `
    #auto_update_btn {
      position: fixed;
      right: 0;
      bottom: 64px;
      background: #1d1e20;
      border-radius: 50%;
      height: 32px;
      width: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 14px;
      border: 2px solid white;
      z-index: 100;
      color: white;
      cursor: pointer;
    }
  `
  /*添加样式*/
  function addStyle(css) {
    if (!css) return
    var head = document.querySelector('head')
    var style = document.createElement('style')
    style.type = 'text/css'
    style.innerHTML = css
    head.appendChild(style)
  }

  /*生成自动升级建筑的按钮*/
  function createBtn() {
    var btn = document.createElement('div')
    btn.title = '开'
    var span = document.createElement('span')
    span.innerText = '开'
    btn.appendChild(span)
    btn.id = 'auto_update_btn'
    document.body.appendChild(btn)

    /*初始化事件*/
    // 点击按钮启动定时器
    btn.addEventListener('click', function () {
      toggleBtnStatus()
      toggleBtnText()
    })
  }

  // 切换文字
  function toggleBtnText() {
    const node = document.querySelector('#auto_update_btn')
    const text = node.innerText
    node.innerText = text === '开' ? '关' : '开'
  }

  // 自动升级建筑
  function autoClickBuilding() {
    closeDialog()
    const tabListNode = document
      .querySelector('#main-tabs')
      .querySelector(`div[role=tablist]`)
    const tabNode = tabListNode.childNodes[0]
    const flag = tabNode && tabNode.getAttribute('aria-selected') === 'true'
    if (!flag) {
      console.log('没找到容器，即将切换到“建造”页')
      // 自动切换到建造tab页
      tabNode && tabNode.click()
    } else {
      const id = tabNode.getAttribute('aria-controls')
      const containerNode = document.getElementById(id)
      const list = containerNode.querySelectorAll(`button.btn`)
      const subTabNodes = containerNode.querySelector(`div[role=tablist]`)
      let isAllUpdatedInThisTab = false
      judgeFood() // 食物小于${minFood}时不建造房屋
      console.log('寻找可建造物')
      for (const [i, node] of list.entries()) {
        let hasClick = false
        if (
          !node.classList.value.includes('btn-off') &&
          !blackList.some((word) => node.textContent.includes(word))
        ) {
          console.log(`${new Date().toLocaleString()}升级：`, node.textContent)
          node.click()
          hasClick = true
          break
        }
        isAllUpdatedInThisTab = i === list.length - 1 && !hasClick
      }
      console.log('当前页是否全部升级：', isAllUpdatedInThisTab)
      if (isAllUpdatedInThisTab && subTabNodes) {
        // 如果当前页全部升级了，切换到另一个建筑页,按顺序往后切换，如果当前是最后一个tab，则切换回第一个tab
        const currentSubTab = subTabNodes.querySelector(
          `button[aria-selected=true]`
        ) // 当前选中的子tab页
        const nextTab = currentSubTab.nextElementSibling
        if (nextTab) {
          console.log(`切换到${nextTab.textContent}`)
          nextTab.click()
        } else {
          const target = subTabNodes.childNodes[0]
          console.log(`切换到${target.textContent}`)
          target.click()
        }
      }
    }
  }
  let buildingInterval = null

  // 开启自动升级建筑定时器
  function handleAutoUpdateStart() {
    buildingInterval = setInterval(autoClickBuilding, timeout)
  }
  // 清除自动升级建筑定时器
  function handleAutoUpdateClear() {
    buildingInterval = clearInterval(buildingInterval)
  }
  // 切换自动升级建筑定时器状态
  function toggleBtnStatus() {
    if (buildingInterval) {
      console.log('~~~~关闭定时器~~~~')
      handleAutoUpdateClear()
    } else {
      console.log('~~~~开启定时器~~~~')
      handleAutoUpdateStart()
    }
  }
  // 判断食物数量
  function judgeFood() {
    var list = document.querySelector('table').querySelectorAll('tr')
    for (var node of list) {
      if (!node.innerText.includes('食物')) continue
      // 获取食物数量
      var val = Number(node.childNodes[2].innerText.split('/')[0])
      if (val < minFood) {
        blackList.push(...houseList)
      } else {
        blackList = initBlackList()
      }
    }
  }
  // 关闭dialog
  function closeDialog() {
    const dialogNode = document.querySelector('#headlessui-portal-root')
    dialogNode && dialogNode.querySelector('.sr-only').parentNode.click()
  }

  createBtn()
  addStyle(css)
})()

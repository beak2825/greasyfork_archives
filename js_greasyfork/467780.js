// ==UserScript==
// @name         抖音直播精简
// @namespace    https://github.com/komomoo/dylive-prune
// @version      0.51
// @description  dy主站不生效，需点击右键-在新标签页中打开。移除相关直播、移除礼物栏、移除用户进入直播间消息、移除点赞动画、自动屏蔽礼物特效&粉丝牌弹幕&礼物弹幕、自动网页全屏、自动切原画画质。源代码https://github.com/komomoo/dylive-prune，不定时更新，欢迎pr👏
// @author       komo
// @match        https://live.douyin.com/*
// @icon         https://lf1-cdn-tos.bytegoofy.com/goofy/ies/douyin_web/public/favicon.ico
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/467780/%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/467780/%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  const css = `
  /* 移除礼物栏 */
  #BottomLayout{display: none !important;}
  .xg-inner-controls{bottom: 8px !important;}
  /* 移除相关直播 */
  .evLAq21m{display: none !important;}
  /* 网页全屏：全屏高度 */
  .EDvjMGPs.FKQqfehj{height:100% !important;}
  /* 弹幕区用户进入直播间消息 */
  .YqmICJp1, .webcast-chatroom___bottom-message{opacity:0 !important;}
  .Mv2estbj{display:none !important;}
  .Y0sC3Fms{display:none !important;}
  /* 粉丝牌&礼物弹幕 */
  .ZUGMpBcb{display:none !important;}
  /* 点赞动画 */
  #flutterLike{display:none !important;}
  /* 礼物特效栏 */
  .VLPIYL3T{display:none !important;}
  .gpFFz2G_{display:none !important;}
  /* 小黄车 */
  .x5oLQRf4{display:none !important;}
  `
  const style = document.createElement('style')
  style.appendChild(document.createTextNode(css))
  document.querySelector('head').append(style)

  // 点击关闭礼物按钮
  // function giftClickClose() {
  //   const giftBtnDom = '.xg-inner-controls > xg-right-grid > xg-icon:nth-child(5) > div > div:nth-child(2)'
  //   const target = document.querySelector('.basicPlayer')
  //   const observer = new MutationObserver((records) => {
  //     const giftBtn = document.querySelector(giftBtnDom)
  //     const giftBtnTxt = document.querySelector(
  //       '.xg-inner-controls > xg-right-grid > xg-icon:nth-child(5) div.WoNKVQmY.Z20k_Nsy'
  //     )
  //     if (giftBtn && giftBtnTxt?.textContent === '屏蔽礼物特效') {
  //       // console.log('---', giftBtn)
  //       giftBtn.click()
  //     } else if (giftBtnTxt?.textContent === '开启礼物特效') {
  //       observer.disconnect()
  //     }
  //   })
  //   observer.observe(target, { childList: true })
  // }
  // setTimeout(giftClickClose, 50)

  // 模拟点击关闭礼物&弹幕
  async function giftClick() {
    const giftBtn = document.querySelector(
      'div.douyin-player-controls > div > div.douyin-player-controls-right > slot:nth-child(5) > div'
    )
    const dmBtn = document.querySelector(
      'div.douyin-player-controls > div > div.douyin-player-controls-right > slot:nth-child(6) > div > div'
    )
    if (giftBtn) {
      await simulateHover(giftBtn)
      document
        .querySelector(
          'div.douyin-player-controls > div > div.douyin-player-controls-right > slot:nth-child(5) > div > div.BMrAdi9a > div:nth-child(2) > div > div:nth-child(1) > div > div > div'
        )
        .click()

      await simulateHover(dmBtn)
      // 1. 定义要操作的项目
      const targetNames = ['送礼信息', '福袋口令']
      // 2. 遍历所有可能的行容器
      const rows = document.querySelectorAll('.tvFMszYY')
      rows.forEach((row) => {
        const span = row.querySelector('.FTgH60Qj')
        if (span && targetNames.includes(span.innerText.trim())) {
          // 找到该行内的开关容器
          const switchContainer = row.querySelector('.dNuSIvAp')

          if (switchContainer) {
            // 判断逻辑：
            // 开启状态类名包含 'SpsbqNUm' (对应你的HTML)
            // 或者简单通过类名数量判断：3个是开，2个是关
            const isChecked = switchContainer.classList.contains('SpsbqNUm') || switchContainer.classList.length > 2

            if (isChecked) {
              console.log(`[${span.innerText}] 当前是打开状态，正在执行关闭...`)
              switchContainer.click()
            } else {
              console.log(`[${span.innerText}] 已经是关闭状态，跳过。`)
            }
          }
        }
      })

      // 隐藏面板
      simulateLeave(giftBtn)
      simulateLeave(dmBtn)
    } else {
      setTimeout(giftClick, 2000)
    }
  }
  setTimeout(giftClick, 2000)

  // 网页全屏
  function fullClick() {
    const btn = document.querySelector(
      'div.douyin-player-controls > div > div.douyin-player-controls-right > slot:nth-child(2)'
    )
    if (btn) {
      btn.click()
    } else {
      setTimeout(fullClick, 1000)
    }
  }
  // fullClick()

  // 切原画
  function qualityClick() {
    const btnWrap = document.querySelector(
      'div.douyin-player-controls > div > div.douyin-player-controls-right > slot:nth-child(8) > div > div > div > div.N16rDtOa.vOEJT9B5 > div'
    )
    if (btnWrap) {
      btnWrap.querySelectorAll('.xMYYJi25').forEach((el) => {
        if (el.textContent.includes('原画')) el.click()
      })
    } else {
      setTimeout(qualityClick, 1000)
    }
  }
  setTimeout(qualityClick, 5000)
})()

/**
 * 模拟鼠标悬停操作并调出隐藏面板
 * @param {HTMLElement} el - 目标元素
 * @param {number} delay - 悬停后的等待毫秒数（用于后续操作）
 */
async function simulateHover(el, delay = 500) {
  // 1. 自动穿透：如果目标是 slot，尝试获取其内部实际渲染的元素
  const target = el.tagName === 'SLOT' && el.assignedElements ? el.assignedElements()[0] || el : el

  // 2. 获取精确的中心点坐标
  const rect = target.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  // 3. 构建事件序列 (模拟真实人类鼠标进入的物理过程)
  const eventOptions = {
    view: window,
    bubbles: true,
    cancelable: true,
    clientX: centerX,
    clientY: centerY,
    buttons: 0,
  }

  const events = [
    new MouseEvent('mouseover', eventOptions),
    new MouseEvent('mouseenter', eventOptions),
    new MouseEvent('mousemove', eventOptions),
  ]

  // 4. 执行触发
  events.forEach((ev) => target.dispatchEvent(ev))

  // 5. 微小位移补偿（触发某些对静止鼠标不敏感的监听器）
  target.dispatchEvent(
    new MouseEvent('mousemove', {
      ...eventOptions,
      clientX: centerX + 1,
      clientY: centerY + 1,
    })
  )

  console.log('✅ 模拟悬停指令已发送')

  // 6. 等待面板渲染并返回目标元素，方便链式调用
  await new Promise((resolve) => setTimeout(resolve, delay))
  return target
}

/**
 * 模拟鼠标移出操作并触发面板隐藏
 * @param {HTMLElement} el - 目标元素
 * @param {number} delay - 移出后的等待毫秒数
 */
async function simulateLeave(el, delay = 500) {
  // 1. 穿透处理
  const target = el.tagName === 'SLOT' && el.assignedElements ? el.assignedElements()[0] || el : el

  // 2. 获取坐标：为了更真实，我们将坐标设为元素左上角再往外偏移一点
  const rect = target.getBoundingClientRect()
  const outX = rect.left - 10
  const outY = rect.top - 10

  // 3. 构建移出事件序列
  const eventOptions = {
    view: window,
    bubbles: true,
    cancelable: true,
    clientX: outX,
    clientY: outY,
    buttons: 0,
  }

  // 重点在于 mouseout 和 mouseleave
  const events = [
    new MouseEvent('mousemove', eventOptions), // 先移到外面
    new MouseEvent('mouseout', eventOptions),
    new MouseEvent('mouseleave', eventOptions),
  ]

  // 4. 执行触发
  events.forEach((ev) => target.dispatchEvent(ev))

  // 5. 抖音这类框架可能还在面板本身挂载了监听，如果是这样，面板也需要触发 leave
  const panel = document.querySelector('.UMXOdhRc')
  if (panel) {
    panel.dispatchEvent(new MouseEvent('mouseleave', eventOptions))
  }

  console.log('✅ 模拟移出指令已发送')

  // 6. 等待隐藏动画完成
  await new Promise((resolve) => setTimeout(resolve, delay))
  return target
}

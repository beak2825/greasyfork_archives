// ==UserScript==
// @name         立创商城自动领券
// @version      0.16
// @license      MIT
// @namespace    http://tampermonkey.net/
// @description  立创商城自动领券~~~
// @author       Clistery
// @match        https://www.szlcsc.com/huodong.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=szlcsc.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500056/%E7%AB%8B%E5%88%9B%E5%95%86%E5%9F%8E%E8%87%AA%E5%8A%A8%E9%A2%86%E5%88%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/500056/%E7%AB%8B%E5%88%9B%E5%95%86%E5%9F%8E%E8%87%AA%E5%8A%A8%E9%A2%86%E5%88%B8.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  const numberRegx = /\d+/

  // 添加通知样式
  const style = document.createElement('style')
  style.textContent = `
.notification {
  position: fixed;
  top: 50px;
  right: 20px;
  padding: 15px;
  background-color: #444;
  color: white;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transition: opacity 0.5s ease, right 0.5s ease;
  z-index: 9999;
  transform: translate(0%, -50%);
}
.notification.show {
  opacity: 1;
  top: 50%;
  right: 50px;
}
.notification.hide {
  opacity: 0;
  top: 50%;
  right: 20px;
}
#get-tickets-btn {
  background-image: linear-gradient(0deg, #558b2f, #7cb342);
  cursor: pointer;
  position: fixed;
  width: 2.4375rem;
  line-height: 0.8125rem;
  font-size: 0.8125rem;
  white-space: pre-line;
  display: flex;
  top: 50%;
  right: 0px;
  writing-mode: vertical-lr;
  text-orientation: upright;
  padding: 10px 0;
  z-index: 100001;
  border-radius: 10px;
  opacity: 0.7;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12),
    0 3px 1px -2px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transform: translate(0%, -50%);
  user-select: none;
}
#lc-www > main > aside > section {
  position: fixed;
  align-items: start;
  width: 56px;
}
#lc-www > main > aside > section.right-\\[-56px\\] {
  left: -56px;
}
#lc-www > main > aside > section.\\!right-0 {
  left: 0 !important;
}
#lc-www > main > aside > button {
  
}
#lc-www > main > aside > button.right-\\[-46px\\] {
  left: -46px;
}
#lc-www > main > aside > button.\\!right-0 {
  left: 0 !important;
}
    `
  document.head.appendChild(style)

  // 显示通知函数
  function showNotification(message, duration = 3000) {
    const notification = document.createElement('div')
    notification.className = 'notification'
    notification.textContent = message
    document.body.appendChild(notification)

    // 显示通知
    setTimeout(() => {
      notification.classList.add('show')
    }, 100)

    // 隐藏通知
    setTimeout(() => {
      notification.classList.remove('show')
      notification.classList.add('hide')
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 500)
    }, duration)
  }

  const run = () => {
    showNotification('等待页面数据加载完毕...')
    setTimeout(() => {
      loadTickets()
    }, 3000)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', (event) => {
      run()
    })
  } else {
    run()
  }

  function is满减券(e) {
    const money = [1, 11, 16, 21, 26]
    for (const m of money) {
      if (e.textContent.includes(`满${m}可用`)) {
        return true
      }
    }
  }

  /**
   * @param {Element} e
   */
  function isPlus(e) {
    return e.textContent.includes('PLUS')
  }

  /**
   * @param {Element} e
   * @param {Element} btn
   */
  function is可领取(e, btn) {
    return !e.textContent.includes('新人专享') && btn.textContent.includes('立即抢券')
  }

  /**
   * @param {Element} e
   */
  function isMRO(e) {
    if (e.parentElement) {
      if (e.parentElement.textContent.includes('工业品')) {
        if (e.hasChildNodes() && e.childElementCount > 1) {
          if (
            numberRegx.test(e.firstChild.textContent) &&
            numberRegx.test(e.lastChild.textContent)
          ) {
            let ticketPrice = parseInt(e.firstChild.textContent.match(numberRegx)[0])
            let thresholdPrice = parseInt(e.lastChild.textContent.match(numberRegx)[0])
            if (Math.abs(ticketPrice - thresholdPrice) < 10) {
              return true
            }
          }
        }
      }
    }
    return false
  }

  /**
   * @param {Element} e
   */
  function is包邮券(e) {
    return (
      (e.textContent.includes('免邮') || e.textContent.includes('包邮')) &&
      !e.textContent.includes('工业品')
    )
  }

  function loadTickets() {
    if (window.getTicketElements) {
      console.warn('ticket elements loaded!')
    }
    console.log('load ticket elements')

    let allTicketContainer = document.querySelectorAll(
      `.m-auto > div > div.flex.flex-wrap > div > div > div:nth-last-child(1)`
    )

    if (allTicketContainer.length <= 0) {
      console.warn('优惠券元素查询失败')
      return
    }

    window.getTicketElements = []

    for (let e of allTicketContainer) {
      let ellipsisE = e.querySelector('div:first-child')
      if (isPlus(e)) {
        continue
      }
      let btn = e.querySelector('button')
      if (btn) {
        if (is可领取(e, btn)) {
          if (isMRO(e) || is满减券(e) || is包邮券(e)) {
            console.log(ellipsisE.textContent)
            window.getTicketElements.push({
              title: ellipsisE.textContent,
              ele: btn,
            })
          }
        } else if (btn.textContent.includes('立即使用')) {
          let dataset = btn.dataset
          if (dataset.spm) {
            let couponsGroupE = e.parentElement.parentElement.parentElement.parentElement
            if (couponsGroupE && couponsGroupE.dataset) {
              let groupId = couponsGroupE.dataset.spm

              let couponsData =
                __NEXT_DATA__.props.pageProps.couponsDataList.couponModelVOListMap[groupId][
                  parseInt(dataset.spm) - 1
                ]
              // console.log('couponsData:', couponsData)

              let aE = document.createElement('a')
              aE.innerText = btn.innerText
              aE.target = '_blank'
              aE.href = couponsData.targetUrl
              aE.classList = btn.classList

              btn.parentNode.replaceChild(aE, btn)
            }
          }
        }
      }
    }

    if (window.getTicketElements.length > 0) {
      showNotification(`可领 ${window.getTicketElements.length} 张券`)
    }
  }

  let getTicketBtn = document.createElement('div')
  getTicketBtn.innerHTML = `
      <div id="get-tickets-btn">
        自动领取优惠券
      </div>
      `
  document.body.appendChild(getTicketBtn)

  let realGetTicketsBtnE = getTicketBtn.querySelector('#get-tickets-btn')
  realGetTicketsBtnE.onmouseenter = () => {
    realGetTicketsBtnE.style.opacity = 1
  }
  realGetTicketsBtnE.onmouseleave = () => {
    realGetTicketsBtnE.style.opacity = 0.7
  }

  let isDragging = false
  let startX, startY, offsetX, offsetY

  const onMouseMove = (event) => {
    console.log('onMouseMove')
    const currentX = event.clientX
    const currentY = event.clientY
    const dx = currentX - startX
    const dy = currentY - startY

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      isDragging = true
      realGetTicketsBtnE.style.cursor = 'grabbing'
      realGetTicketsBtnE.style.left = `${currentX - offsetX}px`
      realGetTicketsBtnE.style.top = `${currentY - offsetY}px`
      realGetTicketsBtnE.removeEventListener('click', window.getTickets)
    }
  }

  const onMouseDown = (event) => {
    console.log('onMouseDown')
    startX = event.clientX
    startY = event.clientY
    let btnRect = realGetTicketsBtnE.getBoundingClientRect()
    offsetX = startX - btnRect.left
    offsetY = startY - btnRect.top - btnRect.height / 2
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  const onMouseUp = (event) => {
    console.log('onMouseUp: ' + isDragging)
    realGetTicketsBtnE.style.cursor = 'pointer'
    if (isDragging) {
      isDragging = false
      setTimeout(() => {
        realGetTicketsBtnE.addEventListener('click', window.getTickets)
      }, 0)
    } else {
      setTimeout(() => {
        window.getTickets()
      }, 0)
    }
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  realGetTicketsBtnE.addEventListener('mousedown', onMouseDown)
  realGetTicketsBtnE.addEventListener('click', window.getTickets)

  window.getTickets = async () => {
    if (window.getTicketElements) {
      console.log('领券咯~~~')
      for (const item of window.getTicketElements) {
        await new Promise((succ, _) => {
          showNotification(`正在领取 ${item.title}`)
          item.ele.click()
          setTimeout(() => {
            succ()
          }, 1000)
        })
      }
      clearInterval(hideAlert)

      showNotification(`共领取 ${window.getTicketElements.length} 张优惠券`)
    }
  }

  // 客服
  // document.querySelector('#lc-www > main > aside > button').style.left = 0
})()

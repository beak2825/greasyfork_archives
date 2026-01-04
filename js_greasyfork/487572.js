// ==UserScript==
// @name         Glarity helper
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  Glarity enhance
// @description:zh-cn Glarity 辅助功能
// @author       yoyo
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487572/Glarity%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/487572/Glarity%20helper.meta.js
// ==/UserScript==

;(() => {
  let hostElement, shadowRoot
  let hasHandleGlaritySummaryWidth = false
  function handleGlaritySummary() {
    if (hasHandleGlaritySummaryWidth) return
    const hostElement = document.querySelector('.glarity--summary')
    if (hostElement && hostElement.shadowRoot) {
      const targetElement = hostElement.shadowRoot.querySelector(
        '.glarity---drawer-content-wrapper',
      )
      if (targetElement) {
        targetElement.style.width = '800px'
        hasHandleGlaritySummaryWidth = true
        console.log('hasHandleGlaritySummaryWidth 修改成功')
      } else {
        console.log('未找到具有glarity---drawer-content-wrapper类的元素')
      }
    } else {
      console.log('未找到具有glarity--summary类的元素或此元素没有Shadow DOM')
    }
  }

  function changeDrawerStyle(display) {
    if (shadowRoot) {
      const drawerContentWrapper = shadowRoot.querySelector('.glarity---drawer-content-wrapper')
      if (drawerContentWrapper) {
        drawerContentWrapper.style.display = display
      } else {
        console.error('未找到 .glarity---drawer-content-wrapper 元素')
      }
    } else {
      console.error('shadowRoot 未定义')
    }
  }

  function addSummaryButton() {
    const newButton = document.createElement('div')
    newButton.onclick = () => {
      const iconElement = shadowRoot.querySelector('.glarity-summary-icon')
      iconElement.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
      shadowRoot.querySelector('.glarity---drawer-content-wrapper').style.display = 'unset'
      const btns = shadowRoot.querySelectorAll('.glarity---drawer-content-wrapper .glarity---btn')
      const summaryBtn = [...btns].find((a) => a.innerText === '总结页面')
      if (summaryBtn) {
        summaryBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
      } else {
        console.log('找不到总结页面按钮')
        setTimeout(() => {
          summaryBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
        }, 1000)
      }
    }
    newButton.classList.add('glarity--summaryButton')
    newButton.innerHTML = `
<div class="translate-container glarity---inline-flex glarity---px-[4px] hover:glarity---bg-[#3771e9]"><svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg"><title>总结</title><path d="M1 8a7 7 0 0 1 7-7h4a7 7 0 1 1 0 14H8a7 7 0 0 1-7-7Z" fill="#389AFC"></path><text x="50%" y="55%" fill="white" text-anchor="middle" dominant-baseline="middle" font-size="9">S</text></svg></div>
      `
    const translateButton = shadowRoot.querySelector('.glarity--shadowroot .glarity--translate')
    if (translateButton) {
      translateButton.parentNode.insertBefore(newButton, translateButton.nextSibling)
    } else {
      console.log('找不到翻译按钮')
    }
  }

  function onGlarityLoaded() {
    hostElement = document.querySelector('.glarity--summary')
    shadowRoot = hostElement.shadowRoot

    if (!(hostElement && hostElement.shadowRoot)) {
      return
    }
    console.log('==glarity装载完毕==')
    handleGlaritySummary()
    addSummaryButton()

    setTimeout(() => {
      handleGlaritySummary()
      // addSummaryButton()
    }, 1000)
  }

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.addedNodes[0]?.classList.contains('glarity--summary')) {
        setTimeout(() => {
          shadowRoot.querySelector('.glarity-summary-icon')?.addEventListener('click', (e) => {
            changeDrawerStyle('unset')
          })
          shadowRoot
            .querySelector(
              '.glarity--header > div.glarity--header__action > div > div:nth-child(3)',
            )
            ?.addEventListener('click', (e) => {
              changeDrawerStyle('none')
            })
        }, 1000)
        onGlarityLoaded()
      }
    }
  })

  observer.observe(document.documentElement, { childList: true, subtree: true })

  document.addEventListener('keydown', (event) => {
    if (event.keyCode === 27 || event.key === 'Escape') {
      changeDrawerStyle('none')
    }
  })

  window.addEventListener('load', () => {
    onGlarityLoaded()
  })
})()

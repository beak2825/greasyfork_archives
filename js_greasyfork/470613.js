// ==UserScript==
// @name         Agnai: 2-bot room make {{user}} be the other bot
// @description  Creates two 👥 buttons which make the next reply replace {{user}} with the other bot's name. Also adds a 👥 button next to the "regenerate" button for the same purpose.
// @author       prkstop
// @license      MIT
// @match        https://agnai.chat/*
// @version 0.0.13
// @namespace https://greasyfork.org/users/1124234
// @downloadURL https://update.greasyfork.org/scripts/470613/Agnai%3A%202-bot%20room%20make%20%7B%7Buser%7D%7D%20be%20the%20other%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/470613/Agnai%3A%202-bot%20room%20make%20%7B%7Buser%7D%7D%20be%20the%20other%20bot.meta.js
// ==/UserScript==

(function() {
  const q = sel => document.querySelector(sel)
  const qAll = sel => document.querySelectorAll(sel)
  const selectors = {
    impersonateMenu: 'div.flex.justify-center.gap-2.overflow-x-auto.py-1 > button',
    impersonateNames: '.items-center.gap-4 > .flex.w-full.flex-col > .ellipsis.font-bold',
    replyBtns: 'main section > div.flex.justify-center.gap-2',
    regenBtn: 'svg.lucide-refresh-cw',
    currentlyImpersonating: 'div.grid.w-full.items-center.justify-between.gap-2 > div',
  }
  const openImpersonateMenu = () => q(selectors.impersonateMenu).click()
  const chooseImpersonateTarget = name => {
    for (const btnName of [...qAll(selectors.impersonateNames)]) {
      if (btnName.innerText === name) {
        btnName.click()
        break
      }
    }
  }
  const validCssId = str => {
    // Remove leading/trailing whitespace and convert to lowercase
    str = str.trim().toLowerCase()
    // Replace special characters and spaces with underscore
    str = str.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_')
    // Ensure the ID starts with a letter or an underscore
    if (!/^[a-z_]/.test(str)) {
      str = '_' + str
    }
    return str
  }
  const numsOfBots = () => (q(selectors.replyBtns)?.querySelectorAll('strong') ?? []).length
  const initAutoImpersonate = () => {
      console.log(numsOfBots())
    if (numsOfBots() !== 2) return
    const btnContainer = () => q(selectors.replyBtns)
    const names = () => [...btnContainer().querySelectorAll('strong')].map(n => n.innerText)
    const eachBtn = () => [...btnContainer().querySelectorAll('div.flex.bg-900')].slice(0,2)
    const lastMsg = () => {
      const msgs = [...document.querySelectorAll('.break-words')]
      return msgs[msgs.length-1]
    }
    const regenBtn = () => lastMsg().querySelector(selectors.regenBtn)?.parentElement
    const addCustomBtn = (btn, nameOverride) => {
      btn.querySelector('.custom-reply-btn')?.remove()
      const name = nameOverride ?? btn.querySelector('strong').innerText
      const impersonateName = names().filter(n => n !== name)[0]
      const cssSafeName = validCssId(name)
      btn.insertAdjacentHTML('afterend', `<div id="custom-reply-btn-${cssSafeName}" style="cursor:pointer;" class="custom-reply-btn">👥</div>`)
      document.querySelector(`#custom-reply-btn-${cssSafeName}`).addEventListener('click', () => {
        const initialImpersonateTarget = document.querySelector(selectors.currentlyImpersonating).innerText
        openImpersonateMenu()
        chooseImpersonateTarget(impersonateName)
        ;(btn.querySelector('strong') ?? regenBtn()).click()
        setTimeout(() => {
          openImpersonateMenu()
          chooseImpersonateTarget(initialImpersonateTarget)
          q('.modal-content button')?.click()
        }, 1000)
      })
    }
    qAll('.custom-reply-btn').forEach(btn => btn.remove())
    eachBtn().forEach(btn => addCustomBtn(btn))
    const charName = lastMsg().querySelector('b')?.innerText
    if (!charName || !regenBtn()) return
    addCustomBtn(regenBtn(), charName)
  }
  setInterval(initAutoImpersonate, 1000)
})()

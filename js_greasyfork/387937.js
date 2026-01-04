// ==UserScript==
// @name         Ultra Popup Blocker
// @description  Configurable popup blocker that blocks all popup windows by default.
// @namespace    eskander.github.io
// @author       Eskander
// @version      4.1
// @include      *
// @license      MIT
// @homepage     https://github.com/Eskander/ultra-popup-blocker
// @supportURL   https://github.com/Eskander/ultra-popup-blocker/issues/new
// @compatible   firefox Tampermonkey / Violentmonkey
// @compatible   chrome Tampermonkey / Violentmonkey
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.listValues
// @grant        GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/387937/Ultra%20Popup%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/387937/Ultra%20Popup%20Blocker.meta.js
// ==/UserScript==

/* Constants and Globals */
const CONSTANTS = {
  TIMEOUT_SECONDS: 15,
  TRUNCATE_LENGTH: 50,
  MODAL_WIDTH: '400px'
}

const STYLES = {
  modal: `
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    background-color: #ffffff !important;
    color: #000000 !important;
    width: ${CONSTANTS.MODAL_WIDTH} !important;
    border: 1px solid #000000 !important;
    z-index: 2147483647 !important;
    box-shadow: 0 2px 10px rgba(0,0,0,0.5) !important;
    margin: 0 !important;
    padding: 0 !important;
    font-family: Arial !important;
    font-size: 14px !important;
    line-height: 1.5 !important;
    box-sizing: border-box !important;
  `,
  modalHeader: `
    background-color: #000000 !important;
    padding: 30px 40px !important;
    color: #ffffff !important;
    text-align: center !important;
    margin: 0 !important;
    font-size: inherit !important;
    line-height: inherit !important;
  `,
  modalFooter: `
    background-color: #000000 !important;
    padding: 5px 40px !important;
    color: #ffffff !important;
    text-align: center !important;
    margin: 0 !important;
  `,
  button: `
    margin-right: 20px !important;
    padding: 5px !important;
    cursor: pointer !important;
    font-family: inherit !important;
    font-size: inherit !important;
    line-height: inherit !important;
    border: 1px solid #000000 !important;
    background: #ffffff !important;
    color: #000000 !important;
    border-radius: 3px !important;
  `,
  notificationBar: `
    position: fixed !important;
    bottom: 0 !important;
    left: 0 !important;
    z-index: 2147483646 !important;
    width: 100% !important;
    padding: 5px !important;
    font-family: Arial !important;
    font-size: 14px !important;
    line-height: 1.5 !important;
    background-color: #000000 !important;
    color: #ffffff !important;
    display: none !important;
    margin: 0 !important;
    box-sizing: border-box !important;
  `,
  listItem: `
    padding: 12px 8px 12px 40px !important;
    font-size: 18px !important;
    background-color: #ffffff !important;
    color: #000000 !important;
    border-bottom: 1px solid #000000 !important;
    position: relative !important;
    transition: 0.2s !important;
    margin: 0 !important;
  `,
  removeButton: `
    cursor: pointer !important;
    position: absolute !important;
    right: 0 !important;
    top: 0 !important;
    padding: 12px 16px !important;
    background: transparent !important;
    border: none !important;
    color: #000000 !important;
  `
}

// Reference to page's window through GreaseMonkey
const global = unsafeWindow
global.upbCounter = 0

// Store reference to original window.open
const realWindowOpen = global.open

// Fake window object to prevent JS errors
const FakeWindow = {
  blur: () => false,
  focus: () => false
}

/* Domain Management */
class DomainManager {
  static async getCurrentTopDomain () {
    const [domainName, topLevelDomain] = document.location.hostname.split('.').slice(-2)
    return `${domainName}.${topLevelDomain}`
  }

  static async isCurrentDomainTrusted () {
    const domain = await this.getCurrentTopDomain()
    return await GM.getValue(domain)
  }

  static async addTrustedDomain (domain) {
    await GM.setValue(domain, true)
  }

  static async removeTrustedDomain (domain) {
    await GM.deleteValue(domain)
  }

  static async getTrustedDomains () {
    return await GM.listValues()
  }
}

/* UI Components */
class UIComponents {
  static createButton (text, id, clickHandler, color) {
    const button = document.createElement('button')
    button.id = `upb-${id}`
    button.innerHTML = text
    button.style.cssText = `${STYLES.button} color: ${color} !important;`
    button.addEventListener('click', clickHandler)
    return button
  }

  static createNotificationBar () {
    const bar = document.createElement('div')
    bar.id = 'upb-notification-bar'
    bar.style.cssText = STYLES.notificationBar
    return bar
  }

  static createModalElement () {
    const modal = document.createElement('div')
    modal.id = 'upb-trusted-domains-modal'
    modal.style.cssText = STYLES.modal
    return modal
  }

  static updateDenyButtonText (button, timeLeft) {
    if (button) {
      button.innerHTML = `🔴 Deny (${timeLeft})`
    }
  }
}

/* Notification Bar */
class NotificationBar {
  constructor () {
    // Don't create the element in constructor
    this.element = null
    this.timeLeft = CONSTANTS.TIMEOUT_SECONDS
    this.denyTimeoutId = null
    this.denyButton = null
  }

  createElement () {
    if (!this.element) {
      this.element = UIComponents.createNotificationBar()
      document.body.appendChild(this.element)
    }
    return this.element
  }

  show (url) {
    if (!this.element) {
      this.createElement()
    }
    this.element.style.display = 'block'
    this.setMessage(url)
    this.addButtons(url)
    this.startDenyTimeout()
  }

  hide () {
    if (this.element) {
      this.element.style.display = 'none'
      if (this.element.parentNode) {
        this.element.parentNode.removeChild(this.element)
      }
      this.element = null
    }
    global.upbCounter = 0
    this.clearDenyTimeout()
  }

  clearDenyTimeout () {
    if (this.denyTimeoutId) {
      clearInterval(this.denyTimeoutId)
      this.denyTimeoutId = null
    }
  }

  setMessage (url) {
    const truncatedUrl = url.length > CONSTANTS.TRUNCATE_LENGTH
      ? `${url.substring(0, CONSTANTS.TRUNCATE_LENGTH)}..`
      : url

    this.element.innerHTML = `
      Ultra Popup Blocker: This site is attempting to open <b>${global.upbCounter}</b> popup(s).
      <a href="${url}" style="color:yellow;">${truncatedUrl}</a>
    `
  }

  async addButtons (url) {
    const currentDomain = await DomainManager.getCurrentTopDomain()

    // Allow Once
    this.element.appendChild(
      UIComponents.createButton('🟢 Allow Once', 'allow', () => {
        realWindowOpen(url)
        this.hide()
      }, 'green')
    )

    // Always Allow
    this.element.appendChild(
      UIComponents.createButton('🔵 Always Allow', 'trust', async () => {
        await DomainManager.addTrustedDomain(currentDomain)
        realWindowOpen(url)
        this.hide()
        global.open = realWindowOpen
      }, 'blue')
    )

    // Deny
    this.denyButton = UIComponents.createButton('🔴 Deny (15)', 'deny', () => {
      this.hide()
      PopupBlocker.initialize()
    }, 'red')
    this.element.appendChild(this.denyButton)

    // Config
    const configButton = UIComponents.createButton('🟠 Config', 'config', () => {
      new TrustedDomainsModal().show()
    }, 'orange')
    configButton.style.float = 'right'
    this.element.appendChild(configButton)
  }

  startDenyTimeout () {
    this.timeLeft = CONSTANTS.TIMEOUT_SECONDS
    this.clearDenyTimeout()

    // Initial update
    UIComponents.updateDenyButtonText(this.denyButton, this.timeLeft)

    this.denyTimeoutId = setInterval(() => {
      this.timeLeft--
      UIComponents.updateDenyButtonText(this.denyButton, this.timeLeft)

      if (this.timeLeft <= 0) {
        this.clearDenyTimeout()
        this.hide()
        PopupBlocker.initialize()
      }
    }, 1000)
  }

  resetTimeout () {
    if (this.element && this.element.style.display === 'block') {
      this.startDenyTimeout()
    }
  }
}

/* Trusted Domains Modal */
class TrustedDomainsModal {
  constructor () {
    this.element = document.getElementById('upb-trusted-domains-modal') || this.createElement()
  }

  createElement () {
    const modal = UIComponents.createModalElement()

    const header = document.createElement('div')
    header.style.cssText = STYLES.modalHeader
    header.innerHTML = `
      <h2 style="color:white !important;">Ultra Popup Blocker</h2>
      <h3 style="color:white !important;text-align:left;margin-top:10px;">Trusted websites:</h3>
    `
    modal.appendChild(header)

    const footer = document.createElement('div')
    footer.style.cssText = STYLES.modalFooter

    const closeButton = document.createElement('button')
    closeButton.innerText = 'Close'
    closeButton.style.cssText = `
      background-color: #000000;
      color: #ffffff;
      border: none;
      padding: 10px;
      cursor: pointer;
    `
    closeButton.onclick = () => this.hide()

    footer.appendChild(closeButton)
    modal.appendChild(footer)

    document.body.appendChild(modal)
    return modal
  }

  show () {
    this.refreshDomainsList()
    this.element.style.display = 'block'
  }

  hide () {
    this.element.style.display = 'none'
  }

  async refreshDomainsList () {
    const existingList = document.getElementById('upb-domains-list')
    if (existingList) existingList.remove()

    const list = document.createElement('ul')
    list.id = 'upb-domains-list'
    list.style.cssText = 'margin:0;padding:0;list-style-type:none;'

    const trustedDomains = await DomainManager.getTrustedDomains()

    if (trustedDomains.length === 0) {
      const message = document.createElement('p')
      message.style.padding = '20px'
      message.innerText = 'No allowed websites'
      list.appendChild(message)
    } else {
      for (const domain of trustedDomains) {
        await this.addDomainListItem(list, domain)
      }
    }

    this.element.insertBefore(list, this.element.querySelector('div:last-child'))
  }

  async addDomainListItem (list, domain) {
    const item = document.createElement('li')
    item.style.cssText = STYLES.listItem
    item.innerText = domain

    item.addEventListener('mouseover', () => {
      item.style.backgroundColor = '#ddd'
    })
    item.addEventListener('mouseout', () => {
      item.style.backgroundColor = 'white'
    })

    const removeButton = document.createElement('span')
    removeButton.style.cssText = STYLES.removeButton
    removeButton.innerText = '×'

    removeButton.addEventListener('mouseover', () => {
      removeButton.style.backgroundColor = '#f44336'
      removeButton.style.color = 'white'
    })
    removeButton.addEventListener('mouseout', () => {
      removeButton.style.backgroundColor = 'transparent'
      removeButton.style.color = 'black'
    })
    removeButton.addEventListener('click', async () => {
      await DomainManager.removeTrustedDomain(domain)
      item.remove()
      PopupBlocker.initialize()
    })

    item.appendChild(removeButton)
    list.appendChild(item)
  }
}

/* Popup Blocker */
class PopupBlocker {
  static async initialize () {
    if (global.open !== realWindowOpen) return

    if (await DomainManager.isCurrentDomainTrusted()) {
      const domain = await DomainManager.getCurrentTopDomain()
      console.log(`[UPB] Trusted domain: ${domain}`)
      global.open = realWindowOpen
      return
    }

    const notificationBar = new NotificationBar()

    global.open = (url, target, features) => {
      global.upbCounter++
      console.log(`[UPB] Popup blocked: ${url}`)
      notificationBar.show(url)
      return FakeWindow
    }
  }
}

/* Initialize */
window.addEventListener('load', () => PopupBlocker.initialize())
GM.registerMenuCommand('Ultra Popup Blocker: Trusted domains', () => new TrustedDomainsModal().show())

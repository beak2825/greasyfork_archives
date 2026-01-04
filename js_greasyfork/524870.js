// ==UserScript==
// @name        1fichier auto-clicker
// @name:en     1fichier auto-clicker
// @namespace   Violentmonkey Scripts
// @icon        data:image/png;base64,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
// @match       https://1fichier.com/*
// @grant       window.close
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @version     1.2.7
// @license     GNU GPLv3
// @author      Dummy_mole
// @description Ce script automatise le téléchargement instantané ou différé par compte à rebours.
// @description:en This script automate instant or delayed by countdown download.
// @downloadURL https://update.greasyfork.org/scripts/524870/1fichier%20auto-clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/524870/1fichier%20auto-clicker.meta.js
// ==/UserScript==

(() => {

  'use strict'

  //===================================script config panel part====================================

  const defaultConfig = {
    "bypass_subscription_offer": false,
    "tab_auto_close": true,
    "page_reload_delay": 5,
    "update_time_delay": 10
  }

  function createConfigPanel() {
    // Script config panel DOM creation
    const configPanel = `
        <div class="config-panel-container slide-in-top">
          <h1 class="config-panel-title">1fichier configuration</h1>
          <span class="separator"></span>
          <div class="panel">
            <div class="setting-elements">
              <div class="bypass-subscription-offer-container" title="bypass subscription offer">
                <input id="bypass-subscription-offer" type="checkbox">
                <label for="bypass-subscription-offer">Bypass Subscription Offer</label>
              </div>
              <div class="tab-auto-close-container" title="automatically close tab after download begins">
                <input id="tab-auto-close" type="checkbox">
                <label for="tab-auto-close">Tab Auto Close</label>
              </div>
              <div class="page-reload-delay-container"
                title="delay in minutes (min: 1, max: 60) between page reloads when a download is already in progress">
                <label for="page-reload-delay">Page Reload Delay (minutes)</label>
                <input id="page-reload-delay" type="number" inputmode="numeric" min="1" max="60">
              </div>
              <div class="update-time-delay-container"
                title="refresh time in seconds (min: 1, max: 300) between each update of new values">
                <label for="update-time-delay">Update Time Delay (seconds)</label>
                <input id="update-time-delay" type="number" inputmode="numeric" min="1" max="300">
              </div>
            </div>
            <span class="separator"></span>
            <div class="validation-buton-container">
              <button class="save-btn">save</button>
              <button class="reset-btn">reset</button>
              <button class="cancel-btn">cancel</button>
            </div>
          </div>
        </div>
        `
    document.body.insertAdjacentHTML('afterbegin', configPanel)

    //---------------------------------------------------------------------------------------------

    function slideOutAndRemove(element, classOut, classIn) {
      element.classList.remove(classOut)
      element.classList.add(classIn)
      setTimeout(() => element.remove(), 1000)
    }

    const configPanelContainer = document.querySelector('.config-panel-container')
    const bypassSubscriptionOfferCheckbox = document.querySelector('#bypass-subscription-offer')
    const tabAutoCloseCheckbox = document.querySelector('#tab-auto-close')
    const pageReloadDelayInput = document.querySelector('#page-reload-delay')
    const updateTimeDelayInput = document.querySelector('#update-time-delay')

    // Preventing the user from typing letters in numerical inputs, I didn't say I didn't trust you but you know you'll try if I don't stop you from doing it.
    for (const [index, input] of [updateTimeDelayInput, pageReloadDelayInput].entries()) {
      input.addEventListener('input', () => {
        const maxLength = index === 1 ? 2 : 3;
        const maxValue = index === 1 ? 60 : 300;

        input.value = input.value.replace(/\D/g, '').slice(0, maxLength);
        if (Number(input.value) > maxValue) input.value = maxValue;
      })
    }


    const saveBtn = document.querySelector('.save-btn')
    const resetBtn = document.querySelector('.reset-btn')
    const cancelBtn = document.querySelector('.cancel-btn')

    // Load configuration values from script's local storage or use default values
    let config = JSON.parse(GM_getValue("1fichier_cfg", defaultConfig))

    // Updates user interface elements with current configuration values
    bypassSubscriptionOfferCheckbox.checked = config.bypass_subscription_offer
    tabAutoCloseCheckbox.checked = config.tab_auto_close
    pageReloadDelayInput.value = config.page_reload_delay
    updateTimeDelayInput.value = config.update_time_delay


    // Updates configuration when user interface elements change
    bypassSubscriptionOfferCheckbox.onchange = function () { config.bypass_subscription_offer = this.checked }
    tabAutoCloseCheckbox.onchange = function () { config.tab_auto_close = this.checked }
    pageReloadDelayInput.onchange = function () { config.page_reload_delay = this.value }
    updateTimeDelayInput.onchange = function () { config.update_time_delay = this.value }

    // Saves configuration to script's local storage when user clicks "Save"
    saveBtn.onclick = function () {
      GM_setValue("1fichier_cfg", JSON.stringify(config))
      location.reload()
    }

    // Resets the configuration to default values when the user clicks on "Reset".
    resetBtn.onclick = function () {
      config = defaultConfig
      bypassSubscriptionOfferCheckbox.checked = defaultConfig.bypass_subscription_offer
      tabAutoCloseCheckbox.checked = defaultConfig.tab_auto_close
      pageReloadDelayInput.value = defaultConfig.page_reload_delay
      updateTimeDelayInput.value = defaultConfig.update_time_delay

      GM_setValue("1fichier_cfg", JSON.stringify(defaultConfig))
      location.reload()
    }

    // Cancels changes made to the configuration when the user clicks on "Cancel".
    cancelBtn.onclick = function () {
      slideOutAndRemove(configPanelContainer, "slide-in-top", "slide-out-top")
    }

    //------------------------------------config panel css style-----------------------------------

    const configPanelStyle = `.config-panel-container{position:fixed!important;top:10px;right:10px;z-index:10001;display:flex;flex-direction:column;min-width:250px!important;max-width:300px!important;background:linear-gradient(0deg,#141617 0,rgba(27,27,28,.9) 50%,rgba(33,34,36,.9) 100%)!important;box-shadow:6px 6px 5px #00000069!important;padding:5px 15px!important;border:1px solid #282828!important;border-radius:5px!important;font-family:inherit;backdrop-filter:blur(15px);width:300px}.config-panel-title{margin:10px auto;padding-bottom:5px;color:#159cff!important;font-size:20px!important;font-weight:600}#file-viewing-method,.panel{color:#aaa!important}.page-reload-delay-container,.tab-auto-close-container,.update-time-delay-container{margin:10px auto}.page-reload-delay-container,.update-time-delay-container{display:flex;justify-content:space-between}#page-reload-delay,#update-time-delay{border-radius:5px!important;color:#f5f5f5!important;background:#262626!important;border:1px solid #4d4b4b!important;padding:2px 4px 2px 8px !important}.separator{display:block;width:98%;height:1px;background:#fdfdfd0d}.validation-buton-container{display:flex;justify-content:space-evenly;margin:10px auto}.validation-buton-container>button{display:block;font-size:16px!important;color:#f5f5f5!important;background:#0087ff;border:transparent!important;border-radius:3px!important;height:30px!important;padding:0 10px!important;width:66px;box-shadow:unset!important}.validation-buton-container>button:hover{opacity:.8}.validation-buton-container>button:active{opacity:1}.cancel-btn{background:#4a4949!important}.slide-in-top{-webkit-animation:.9s cubic-bezier(.25,.46,.45,.94) both slide-in-top;animation:.9s cubic-bezier(.25,.46,.45,.94) both slide-in-top}.slide-out-top{-webkit-animation:.9s cubic-bezier(.55,.085,.68,.53) both slide-out-top;animation:.9s cubic-bezier(.55,.085,.68,.53) both slide-out-top}@-webkit-keyframes slide-in-top{0%{-webkit-transform:translateY(-1000px);transform:translateY(-1000px);opacity:0}75%{-webkit-transform:translateY(20px);transform:translateY(20px)}100%{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}}@keyframes slide-in-top{0%{-webkit-transform:translateY(-1000px);transform:translateY(-1000px);opacity:0}75%{-webkit-transform:translateY(20px);transform:translateY(20px)}100%{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}}@-webkit-keyframes slide-out-top{0%{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}25%{-webkit-transform:translateY(20px);transform:translateY(20px)}100%{-webkit-transform:translateY(-1000px);transform:translateY(-1000px);opacity:0}}@keyframes slide-out-top{0%{-webkit-transform:translateY(0);transform:translateY(0)}25%{-webkit-transform:translateY(20px);transform:translateY(20px)}100%{-webkit-transform:translateY(-1000px);transform:translateY(-1000px)}}`
    GM_addStyle(configPanelStyle)

  }

  // Script config panel initialization
  GM_registerMenuCommand("1fichier configuration", createConfigPanel)
  if (!GM_getValue("1fichier_cfg")) GM_setValue("1fichier_cfg", JSON.stringify(defaultConfig))
  const { bypass_subscription_offer ,tab_auto_close, page_reload_delay, update_time_delay } = JSON.parse(GM_getValue("1fichier_cfg"))

  //================================================================================================

  //----------------------------------------General Variables---------------------------------------

  const localLangage = (navigator.language || navigator.userLanguage)?.split('-')[0] === "fr" ? "fr" : "en"
  const userIntervalDelay = +update_time_delay * 1000
  const userPageReloadDelay = +page_reload_delay * 60000

  const messages = {
    fr: {
      downloadStart: "Votre téléchargement commencera automatiquement vers ",
      reloadMessage: "Un téléchargement est déjà en cours - Prochain rechargement à ",
      autoStartMessage: "Le téléchargement commencera automatiquement à la fin du compte à rebours",
      startSoonMessage: "🚀Téléchargement immminent🚀",
      remainingMinutes: "🚀",
      minutesLeft: "min restantes",
      lessThanFive:"quelques"
    },
    en: {
      downloadStart: "Your download will start automatically around ",
      reloadMessage: "A download is already in progress - next Reload at ",
      autoStartMessage: "The download will start automatically at the end of the countdown",
      startSoonMessage: "🚀The download is about to start🚀",
      remainingMinutes: "🚀",
      minutesLeft: "min left",
      lessThanFive:"just a few"
    }
  }

  //------------------------------------------Functions----------------------------------------------

  // Replaces the native confirm dialog, which appears after prolonged inactivity, with a custom one that auto-validates to prevent blocking script automation purpose.
  window.confirm = function (message) {
    console.log(message)
    return true
  }

  function getLocalizedMessage(key) {
    return messages[localLangage][key]
  }

  function waitForElm(selector, all = false) {
    const elementDirect = all
      ? document.querySelectorAll(selector)
      : document.querySelector(selector)

    return new Promise(resolve => {
      if (elementDirect) {
        return resolve(elementDirect)
      }

      const observer = new MutationObserver(mutations => {
        const elementObserved = all
          ? document.querySelectorAll(selector)
          : document.querySelector(selector)

        if (elementObserved) {
          resolve(elementObserved)
          observer.disconnect()
        }
      })

      observer.observe(document.body, { childList: true, subtree: true })
    })
  }

  function moveMessage(parent, endTargetElement) {
    const newDiv = document.createElement('div')
    newDiv.className = 'moved-message'

    while (parent.firstChild !== endTargetElement) newDiv.appendChild(parent.firstChild)

    parent.prepend(newDiv)
    const lastNode = [...newDiv.childNodes].at(-1)
    const text = lastNode.nodeValue
    const minutes = text.match(/\d+/)[0]
    const beforeMinutes = text.match(/(.*?)\d+/)[1]
    const afterMinutes = text.match(/\d+(.*)/)[1]

    const formattedTimeNode = `
    <div class="time-container">
      <div class="time-node">${beforeMinutes}<span class="time-left">${minutes}</span>${afterMinutes}</div>
      <div class="time-node">${getLocalizedMessage('downloadStart')}<span class="dl-start-time"></span></div>
    </div>`

    newDiv.removeChild(lastNode)
    newDiv.insertAdjacentHTML('beforeend', formattedTimeNode)

    return newDiv
  }

  function calculateEndTime(timeInMinutes, locale) {
    const date = new Date(Date.now() + timeInMinutes * 60000)
    const options = locale === 'en' ? { hour: 'numeric', minute: 'numeric', hour12: true } : { hour: '2-digit', minute: '2-digit' }
    return date.toLocaleTimeString(locale, options)
  }

  function updateTabTitle(time) {
    document.title = time >= 2
      ? `1fichier - ⏳ ${time} ${getLocalizedMessage('minutesLeft')}`
      : getLocalizedMessage('startSoonMessage')
  }

  function updateValues(newValues, firstEl, lastEl) {
    const { remainingMinutes, endTime } = newValues
    updateTabTitle(remainingMinutes)
    firstEl.textContent = remainingMinutes >= 5 ? remainingMinutes : getLocalizedMessage('lessThanFive')
    lastEl.textContent = endTime
  }

  //---------------------------------- Bypass Subscription offer -------------------------------------

  if (bypass_subscription_offer) {
    // If a sub chart form is present use this function to get convert the time from the warning message in milliseconds (plus 1 extra minute) used for reloading the page and display remaining message on tab title
    // returned object: {ms: Number, time: Number, unit: String}
    function parseDelayInMs(t){
    const m=t.match(/(\d+)\s*([hms])/i);
    if(!m)return null;
    const v=+m[1],u=m[2].toLowerCase(),map={s:"secondes",m:"minutes",h:"heures"};
    return{ms:{s:1e3,m:6e4,h:36e5}[u]*v+6e4,time:v,unit:map[u]};
    }

    waitForElm('form#f1').then(form => {

      const spanWarn = document.querySelector("form .ct_warn span")
      if (spanWarn && /\d/.test(spanWarn.parentNode.textContent)) {
          const pageReloadDelay = parseDelayInMs(spanWarn.parentNode.textContent)
          let remainingTime = pageReloadDelay.time
          const updateTitle = (time, unit) => document.title = time > 0 ? `1fichier: ${time} ${unit} left` : `1fichier: download starting soon`
          updateTitle(remainingTime--, pageReloadDelay.unit)
          setInterval(() => updateTitle(remainingTime--, pageReloadDelay.unit), 60000)
          setTimeout(()=> location.reload(), pageReloadDelay.ms)
      } else if (document.querySelector('form .ct_warn span[style="color:red"]')) {
          let remainingMinutes = Math.round(userPageReloadDelay / 60000)
          let message = remainingMinutes > 0 ? `${remainingMinutes--} minutes` : 'Starting soon'
          document.title = `1fichier: Auto reload - ${message}`

          setInterval(() => {
            message = remainingMinutes > 0 ? `${remainingMinutes--} minutes` : 'Starting soon'
            document.title = `1fichier: Auto reload - ${message}`
          }, 60000)

          setTimeout(() => location.reload(), userPageReloadDelay)
      } else {
        form.submit()
      }
    })
  }
  //----------------------------------------------Code------------------------------------------------

  waitForElm('.ok.btn-general.btn-orange').then(dlBtn => {
    const spanWarn = document.querySelector("form .ct_warn span")
    // If "!" appears in the warning, this means that the clock is running or a download is already in progress.
    if (spanWarn && /!/gi.test(spanWarn.textContent)) {
      const spanWarnParent = spanWarn.parentNode

      // If there is a warning with no number in it, that means this is a "downloas in progress" message.
      if (!/\d/.test(spanWarnParent.textContent)) {
        const delayDisplayed = userPageReloadDelay / 60000
        const message = getLocalizedMessage('reloadMessage')
        const endTime = calculateEndTime(delayDisplayed, localLangage)
        dlBtn.value = `${message} ${endTime}`
        dlBtn.disabled = true
        console.log("A download is already in progress")
        document.title = `1fichier: Auto reload - ${endTime}`
        setTimeout(() => location.reload(), userPageReloadDelay)
      } else {
        dlBtn.disabled = true

        waitForElm('.clock.flip-clock-wrapper').then(clockWrapper => {
          // Move all nodes before clockWrapper to a new div for convenience.
          const timeMessageContainer = moveMessage(spanWarnParent, clockWrapper)
          const timeToWaitEl = timeMessageContainer.querySelector('.time-left')
          const dlStartTimeEl = timeMessageContainer.querySelector('.dl-start-time')

          // Time information initialization part
          const initialTimeToWait = +timeToWaitEl.textContent
          const startTime = Date.now()
          const calculateRemainingMinutes = (startTime, initialTime) => Math.floor((startTime + (initialTime + 1) * 60000 - Date.now()) / 60000)
          const endTime = calculateEndTime(initialTimeToWait, localLangage)
          let remainingMinutes = calculateRemainingMinutes(startTime, initialTimeToWait)
          updateValues({ remainingMinutes, endTime }, timeToWaitEl, dlStartTimeEl)

          dlBtn.value = getLocalizedMessage('autoStartMessage')

          let allInn = clockWrapper.querySelectorAll('.inn')
          const allInLength = allInn.length
          const totalDisplayedNumber = allInLength / 4

          // INTERVAL
          const countDownChecker = setInterval(() => {
            // Update remaining time message every (n) seconds
            remainingMinutes = calculateRemainingMinutes(startTime, initialTimeToWait)

            const innTextContentArray = []

            for (const inn of allInn) {
              innTextContentArray.push(+inn.textContent)
            }

            const sum = innTextContentArray.reduce((acc, value) => acc + value, 0)

            if (+sum === totalDisplayedNumber * 2) {
              clearInterval(countDownChecker)
              dlBtn.disabled = false
              dlBtn.click()
            }

            // refresh new values
            allInn = clockWrapper.querySelectorAll('.inn')
            innTextContentArray.length = 0
            updateValues({ remainingMinutes, endTime }, timeToWaitEl, dlStartTimeEl)

            console.log( `next check in ${update_time_delay }s`)
          }, userIntervalDelay)
        })
      }
    } else {
      // The element below only appears on the first page, allowing us to differentiate page 1 from page 2 and to know when to automatically close the tab/window.
      const firstPageRefElement = document.querySelector('.CKBL')
      dlBtn.click()

      if (!firstPageRefElement && tab_auto_close) {
        setTimeout(() => window.close(), 2500)
      }
    }
  })

  //------------------------------------------------CSS-----------------------------------------------

  const style = `#dlw,#dlw1{display:none!important}#dlb{display:block!important;width:unset!important}.time-container{display:flex;margin:auto;justify-content:center}.dl-start-time,.time-left{color:red;text-decoration:underline;font-style:normal}`
  GM_addStyle(style)
})()
// ==UserScript==
// @name        Focus Mode for Social Media
// @namespace   Violentmonkey Scripts
// @include     https://twitter.com/home
// @include     https://www.youtube.com*
// @include     https://www.instagram.com/
// @include     https://github.com/
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @version     2.1
// @license     MIT
// @author      KraXen72
// @description block time-wasting social media & other
// @downloadURL https://update.greasyfork.org/scripts/466089/Focus%20Mode%20for%20Social%20Media.user.js
// @updateURL https://update.greasyfork.org/scripts/466089/Focus%20Mode%20for%20Social%20Media.meta.js
// ==/UserScript==

const getStylesheetUrl = (hostname) => `https://kraxen72.github.io/focus-stylesheets/${hostname}.css`
const site = window.location.hostname
let styleSheetCSS = "";

// const resetSeconds = 30*60
const resetSeconds = 30*10

class Toggle {
  constructor(css, uuid, initialValue = true) {
    if (!css) throw new Error("Please provide CSS to inject!");
    this.css = css
    this.state = GM_getValue(`${site}_state`, initialValue)
    this.disabledTimestamp = GM_getValue(`${site}_disabled_timestamp`, -1)
    this.styleTag = null
    this.menuCommand = false;
    this.menuCommandId = uuid

    this.attemptReenable()
    this.sync()
  }
  enable() {
    this.state = true
    this.disabledTimestamp = -1

    this.sync()
  }
  disable() {
    this.state = false
    this.disabledTimestamp = new Date().getTime()

    this.sync()
  }
  toggle() {
    if (this.state) {
      this.disable()
    } else {
      this.enable()
    }
  }
  attemptReenable() {
    if (this.state) return;
    // if disabled but timestamp is -1, enable it to fix the edge-case.
    if ((new Date().getTime() - this.disabledTimestamp) <= resetSeconds*1000 && this.disabledTimestamp !== -1) {
      console.log("focusMode: resetSeconds has not elapsed yet")
      return;
    }
    console.log("focusMode: resetSeconds has elapsed, enabling.")
    this.state = true;
    this.disabledTimestamp = -1

    this.sync()
  }
  updateCSS() {
    if (this.state) {
      if (!this.styleTag) this.styleTag = GM_addStyle(this.css)
    } else {
      if (this.styleTag) this.styleTag.remove();
      this.styleTag = null
    }
  }
  saveData() {
    GM_setValue(`${site}_state`, this.state)
    if (this.disabledTimestamp === -1) {
      GM_deleteValue(`${site}_disabled_timestamp`)
    } else {
      GM_setValue(`${site}_disabled_timestamp`, this.disabledTimestamp)
    }
  }
  updateMenuCommand() {
    const caption = `focusMode: ${site}: ${this.state ? '✅' : '❌'}`
    if (this.menuCommand) {
      GM_unregisterMenuCommand(this.menuCommandId)
    }
    GM_registerMenuCommand(caption, () => this.toggle.apply(this), { id: this.menuCommandId })
    this.menuCommand = true;
  }
  sync() {
    this.saveData()
    this.updateCSS()
    this.updateMenuCommand()
  }
}

function sameDay(date1, date2) {
  return date1.getFullYear() === date2.getFullYear()
    && date1.getMonth() === date2.getMonth()
    && date1.getDate() === date2.getDate();
}

function zeropad(number, finalWidth, customCharacter) {
    customCharacter = customCharacter || '0';
    number = number + '';
    return number.length >= finalWidth ? number : new Array(finalWidth - number.length + 1).join(customCharacter) + number;
}

let togggleInstance;

function init() {
  new Promise(async (res, rej) => {
    const lastFetchDate = new Date(GM_getValue("lastFetchDate", null))
    const currDate = new Date()
    const fetchedToday = sameDay(lastFetchDate, currDate)

    const storedCSS = GM_getValue("css_"+site, null)
    console.log(lastFetchDate, currDate)

    if (fetchedToday && storedCSS) {
      console.log("focusMode: already fetched today and found stored css. not fetching.")
      res(storedCSS)
    } else {
      const data = await new Promise((resolve, reject) => GM_xmlhttpRequest({
        url: getStylesheetUrl(site),
        method: 'GET',
        onabort: () => resolve(GM_getValue("css_"+site, "")),
        onerror: () => resolve(GM_getValue("css_"+site, "")),
        onload: (response) => resolve(response.responseText)
      }))

      console.log(`focusMode: fetched updated css for ${site}`)
      GM_setValue("lastFetchDate", new Date().toDateString())
      GM_setValue("css_"+site, resText)
      res(data)
    }
  }).then(data => {
    let currDate = new Date()

    if (site === "www.youtube.com") {
      console.log("focusMode: yt override kicking in...")
      data = data.replaceAll("%focus%", (currDate.getHours() <= 6) ? `bro go to sleep please it's ${zeropad(currDate.getHours(), 2)}:${zeropad(currDate.getMinutes(), 2)}am` : "focus")
    }

    if (typeof toggleInstance === "undefined") {
      toggleInstance = new Toggle(data, btoa(Math.round(Math.random()*100)));
    }
    toggleInstance.attemptReenable();
    console.log("focusMode: initialized", toggleInstance, data)
  })
}

let lastUrl = window.location.href;
new MutationObserver(() => {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      init();
      setTimeout(() => { if (typeof toggleInstance !== "undefined") toggleInstance.sync(); }, 0);
    }
}).observe(document, { childList: true, subtree: true });

init();


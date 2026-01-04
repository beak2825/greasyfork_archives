// ==UserScript==
// @name        TweetDeck 延命
// @namespace   https://rinsuki.net
// @match       https://tweetdeck.twitter.com/*
// @version     1.0.1
// @author      -
// @description for old tweetdeck
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/459682/TweetDeck%20%E5%BB%B6%E5%91%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/459682/TweetDeck%20%E5%BB%B6%E5%91%BD.meta.js
// ==/UserScript==

function hook() {
  const xp = XMLHttpRequest.prototype
  const config = Object.getOwnPropertyDescriptor(xp, "responseText")
  let selfDestructTimer
  const myConfig = {
    ...config,
    get() {
      const orig = config.get.bind(this)()
      if (this.responseURL.startsWith("https://api.twitter.com/1.1/help/settings.json")) {
        const obj = JSON.parse(orig)
        console.info("original settings", obj)
        obj.config.tweetdeck_graphql_login = {value: true}
        const newResponseText = JSON.stringify(obj)
       console.info("feature flag hooked", newResponseText)
        if (selfDestructTimer != null) clearTimeout(selfDestructTimer)
        selfDestructTimer = setTimeout(() => {
          if (Object.getOwnPropertyDescriptor(xp, "responseText").get === myConfig.get) {
            console.info("it seems getter is not overrided, so hook will self-destruct...")
            Object.defineProperty(xp, "responseText", config)
          }
        }, 1000)
        return newResponseText
      }
      console.info("unrelated request...")
      return orig
    }
  }
  Object.defineProperty(xp, "responseText", myConfig)
}

if ("wrappedJSObject" in window) {
  console.info("hook for firefox")
  window.wrappedJSObject.eval(`(${hook.toString().replace(" hook", "")})()`)
} else {
  console.info("hook for chromium")
  hook()
}
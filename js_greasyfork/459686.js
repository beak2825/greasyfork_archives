// ==UserScript==
// @name        TweetDeck ふぁぼ復活
// @namespace   https://rinsuki.net
// @match       https://tweetdeck.twitter.com/*
// @version     1.0
// @author      -
// @description for old tweetdeck
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/459686/TweetDeck%20%E3%81%B5%E3%81%81%E3%81%BC%E5%BE%A9%E6%B4%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/459686/TweetDeck%20%E3%81%B5%E3%81%81%E3%81%BC%E5%BE%A9%E6%B4%BB.meta.js
// ==/UserScript==

function hook() {
    const xp = XMLHttpRequest.prototype
    const origOpen = xp.open
    xp.open = function (method, url, ...args) {
        if (url !== "https://api.twitter.com/1.1/favorites/create.json") {
            return origOpen.apply(this, [method, url, ...args])
        }
        console.info("hooked")
        origOpen.apply(this, [method, "https://api.twitter.com/graphql/lI07N6Otwv1PhnEgXILM7A/FavoriteTweet", ...args])
        const origSend = this.send
        this.send = function (data) {
            const d = new URLSearchParams(data)
            console.info("hook like")
            origSend.call(this, JSON.stringify({
                variables: {
                    tweet_id: d.get("id"),
                }
            }))
        }
        // override setRequestHeader to application/json
        const origSetRequestHeader = this.setRequestHeader
        this.setRequestHeader = function (key, value) {
            // key to lowercase
            if (key.toLowerCase() === "content-type") {
                return origSetRequestHeader.call(this, key, "application/json")
            }
            return origSetRequestHeader.call(this, key, value)
        }
    }
}

if ("wrappedJSObject" in window) {
    console.info("hook for firefox")
    window.wrappedJSObject.eval(`(${hook.toString().replace(" hook", "")})()`)
} else {
    console.info("hook for chromium")
    hook()
}
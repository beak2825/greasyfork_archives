// ==UserScript==
// @name         ganondorf
// @namespace    gaeulbyul.userscript
// @version      0.0.20221204
// @license      GPL-3.0
// @description  block powlink ads on namu.wiki
// @author       Gaeulbyul
// @match        https://namu.wiki/*
// @icon         https://www.google.com/s2/favicons?domain=namu.wiki
// @run-at       document-start
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/440557/ganondorf.user.js
// @updateURL https://update.greasyfork.org/scripts/440557/ganondorf.meta.js
// ==/UserScript==

"use strict"
{
  let { window, JSON } = unsafeWindow,
    cd = window["__vue__"],
    proxy = {
      get(target, key, r) {
        const result = Reflect.get(target, key, r)
        if (!result) {
          return result
        } else if (typeof result == "function") {
          return result
        } else if (typeof result == "object") {
          return new Proxy(result, proxy)
        }
        switch (key) {
          case "ep":
          case "enable_ads":
            return ""
          default:
            return result
        }
      },
    },
    itv = setInterval(
      () =>
        cd &&
        cd[1] &&
        typeof cd[1] == "object" &&
        "__ob__" in cd[1] &&
        cd[1].__ob__.dep.subs.length > 0 &&
        void ((p) => {
          try {
            const data = cd[1].__ob__.dep.subs[0].vm.$root.$store._vm.$data
            data.$$state = new Proxy(data.$$state, p)
            clearInterval(itv)
          } catch (err) {
            console.error(err)
          }
        })(proxy),
      999
    )
  try {
    const windowopen = window.open,
      JSONparse = JSON.parse
    Object.defineProperty(window, "open", {
      value: Object.defineProperty(
        function open(url, target, options) {
          if (
            !url.startsWith("https://adcr.naver.com/adcr?x=") &&
            !url.startsWith("http://adcr.naver.com/adcr?x=")
          ) {
            return windowopen(url, target, options)
          }
        }.bind(null),
        "name",
        {
          value: "open",
        }
      ),
    })
    Object.defineProperty(JSON, "parse", {
      value: Object.defineProperty(
        function parse(jsonstring, reviver) {
          const result = JSONparse(jsonstring, reviver)
          if (Array.isArray(result)) {
            cd = result
          }
          return result
        }.bind(null),
        "name",
        {
          value: "parse",
        }
      ),
    })
  } catch (err) {
    console.error(err)
  }
}

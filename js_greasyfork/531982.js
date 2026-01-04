// ==UserScript==
// @name        startpage.com pseudo bangs
// @namespace   Violentmonkey Scripts
// @match       https://www.startpage.com/do/dsearch*
// @match       https://www.startpage.com/do/search*
// @match       https://www.startpage.com/sp/search*
// @grant       none
// @version     1.0
// @license     MIT
// @author      -
// @description 06/04/2025, 7:23:21 pm
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/531982/startpagecom%20pseudo%20bangs.user.js
// @updateURL https://update.greasyfork.org/scripts/531982/startpagecom%20pseudo%20bangs.meta.js
// ==/UserScript==

const usp = new URLSearchParams(window.location.search)

const hasBang = (b, q) => q.startsWith(`!${b} `) || q.endsWith(` !${b}`) || q.includes(` !${b} `)

const gotoUrl = (u, b, q) => window.location.href = `${u}${q.replace(`!${b}`, "")}`

let query = false

if(usp.has("query")){
  query = usp.get("query").trim()
}
else if (usp.has("q")){
  query = usp.get("q").trim()
}


if(query){
  if(hasBang("", query)){
    // Running at document-start so some dom not ready yet.
    // Run at document-start to make other code run quicker as it only needs url info and not dom.
    const interval = setInterval(() => {
      const firstResult = document.querySelector('.result-link')
      if(firstResult){
        window.location.href = firstResult.href
        clearInterval(interval)
      }
    }, 0) // this is fine as dont need anything on the initial page.

  }
  if(hasBang("g", query)){
    gotoUrl(`https://www.google.com/search?q=`, "g", query)
  }
  if(hasBang("gm", query)){
    gotoUrl(`https://www.google.com/maps?search&q=`, "gm", query)
  }
}

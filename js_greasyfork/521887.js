// ==UserScript==
// @name         Kemono.su Search Query for Saucenao
// @namespace    https://greasyfork.org/en/users/1303345-kab-asaki
// @version      1.0.0
// @description  Adds search query to kemono.su url in saucenao's search results page.
// @author       Kabasaki
// @match        https://saucenao.com/search.php*
// @icon         https://www.google.com/s2/favicons?domain=https://saucenao.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521887/Kemonosu%20Search%20Query%20for%20Saucenao.user.js
// @updateURL https://update.greasyfork.org/scripts/521887/Kemonosu%20Search%20Query%20for%20Saucenao.meta.js
// ==/UserScript==

const sauceResults = document.getElementsByClassName("result")

if (sauceResults.length != 0) {
    let title = ""

    Array.from(sauceResults).forEach((sauceResult) => {
      const sauceInfo = sauceResult.getElementsByClassName("resultmiscinfo")

      try {
        title = sauceResult.getElementsByClassName("linkify")[1].textContent
      } catch (error) {
        title = ""
      }

      Array.from(sauceInfo).forEach((sauceResult) => {
        const websiteUrls = sauceResult.getElementsByTagName("a")
        
        if (websiteUrls.length != 0) {
          Array.from(websiteUrls).forEach((websiteUrl) => {
            if (websiteUrl.href == "https://kemono.party/") {
              websiteUrl.href = `https://kemono.su/posts?q=${encodeURIComponent(title)}`
            }
          })  
        }
      })
    })
}
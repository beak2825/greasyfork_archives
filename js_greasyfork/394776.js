// ==UserScript==
// @name        open_original_links_in_pocket
// @namespace   undegro
// @include     https://getpocket.com/*
// @version     4.6
// @license     MIT
// @description just open direct!
// @downloadURL https://update.greasyfork.org/scripts/394776/open_original_links_in_pocket.user.js
// @updateURL https://update.greasyfork.org/scripts/394776/open_original_links_in_pocket.meta.js
// ==/UserScript==

{
  const parent = document.getElementById("__next")
  const observeParent = new MutationObserver(records => records.filter(record => record.addedNodes[0]).some(record => record.target.tagName == "MAIN" || (record.target == parent && record.addedNodes[0].querySelector("main"))) && init())
  const observeArticle = new MutationObserver(records => records.flatMap(record => [...record.addedNodes]).forEach(rewrite))

  observeParent.observe(parent, { childList: true, subtree: true })

  async function init() {
    observeArticle.disconnect()
    const articleList = await waitElement("main > div > div > div")
    if(articleList) observeArticle.observe(articleList, { childList: true, subtree: true })
  }

  function rewrite(target) {
    if(target.tagName == "ARTICLE") {
      const links = [...target.getElementsByTagName("a")]
      const publisherLink = links.find(link => link.classList.contains("publisher"))
      links.forEach(link => {
        link.addEventListener("click", e => e.stopPropagation())
        link.href = decodeURIComponent(publisherLink.href.replace(/^https:\/\/getpocket\.com\/redirect\?url=/, ""))
        link.setAttribute("target", "_blank")
      })
    }
  }

  function waitElement(selector) {
    return new Promise((resolve) => {
      const searchElement = () => {
        const elem = document.querySelector(selector)
        if(!elem) {
          requestAnimationFrame(searchElement)
        }else{
          resolve(elem)
        }
      }

      searchElement()
      setTimeout(() => resolve(false), 5000)
    })
  }
}
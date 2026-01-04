// ==UserScript==
// @name         fofa-filter
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  fofa过滤器
// @author       Wuuconix
// @match        https://fofa.info/result*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fofa.info
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451165/fofa-filter.user.js
// @updateURL https://update.greasyfork.org/scripts/451165/fofa-filter.meta.js
// ==/UserScript==

setTimeout(() => {
  const div = document.querySelector("div.el-autocomplete")
  div.insertAdjacentElement("afterend", button)
  button.addEventListener("click", () => {
    let qbase64 = A2B(new URL(location.href).searchParams.get("qbase64"))
    const titleNodes = document.querySelectorAll("p.hsxa-two-line") //doms having title information
    const hostNodes = document.querySelectorAll("span.hsxa-host > a") //doms having host information
    const length = titleNodes.length
    const existMap = new Set() //judge if the title exist already
    for (let i = 0; i < length; i++) {
      const title = titleNodes[i].textContent.trim()
      if (title == "") { //title if empty, use host to filter
        const host = hostNodes[i].textContent.trim()
        qbase64 += `&&host!="${host}"`
      } else if (!existMap.has(title)) { //title is fresh, filter it
        qbase64 += `&&title!="${title}"`
        existMap.add(title)
      }
    }
    qbase64 = B2A(qbase64)
    const url = new URL(location.href)
    url.searchParams.set("qbase64", qbase64)
    location.replace(url.href)
  })
}, 1000)

const style = document.createElement("style")
style.innerHTML = `
.conix-button {
  position: absolute;
  margin-left: -5px;
  height: 50px;
  padding: 0 10px;
  white-space: nowrap;
  font-size: xx-large;
  background-color: transparent;
  border: none;
  transition: transform .5s;
}
.conix-button:hover {
  cursor: pointer;
  transform: rotate(135deg);
}
`
document.head.appendChild(style)

const button = document.createElement("button")
button.className = "conix-button"
button.textContent = "🗡️"
button.title = "Kill What You Have Tested Intelligently"

/**
 * Binary To Ascii (Palin To Base64) supporting Chinese
 * @param {string} str
 * @returns
 */
function B2A(str) {
  return window.btoa(unescape(encodeURIComponent(str)))
}

/**
 * Ascii To Binary (Base64 To Plain) supporting Chinese
 * @param {string} str
 * @returns
 */
function A2B(str) {
  return decodeURIComponent(escape(window.atob(str)));
}
// ==UserScript==
// @name         Zotero Plugins Install/Update
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Zotero Plugins
// @author       Polygon
// @match        https://plugins.zotero-chinese.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zotero-chinese.com
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/477266/Zotero%20Plugins%20InstallUpdate.user.js
// @updateURL https://update.greasyfork.org/scripts/477266/Zotero%20Plugins%20InstallUpdate.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // zotero://plugin/?action=install&url=https%3A%2F%2Fgithub.com%2Fvolatile-static%2FChartero%2Freleases%2Fdownload%2F2.0.0%2Fchartero.xpi
  const id = setInterval(() => {
    if (!document.querySelector("table")) {
      return
    }
    clearInterval(id)
    GM_xmlhttpRequest({
      method: "POST",
      url: "http://127.0.0.1:23119/getAllPluginVersion",
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "json",
      onload: function (res) {
        const addons = res.response;
        main(addons)
      }
    })

  }, 10)
  const main = (addons) => {
    [...document.querySelectorAll("tr td")]
      .filter(i => i.innerText == "7")
      .forEach(td => {
        const a = td.parentNode.children[0].querySelector("a") || td.parentNode.previousElementSibling.children[0].querySelector("a")
        const homepageURL = a.getAttribute("href")
        const addon = addons.find(addon => addon.homepageURL.toLowerCase().replace(/\-/g, "") == homepageURL.toLowerCase().replace(/\-/g, ""))
        const sourceNode = [...td.parentNode.children].slice(-1)[0]
        const sourceAtags = sourceNode.querySelectorAll("a")
        sourceAtags.forEach(a => {
          const href = a.getAttribute("href")
          a.innerText = `从${a.innerText}安装`;
          sourceNode.style.backgroundColor = "rgba(66, 185, 131, .2)"
          a.setAttribute("href", `zotero://plugin/?action=install&url=${encodeURIComponent(href)}`)
          a.style.color = "#42b983"
        })
        if (addon) {
          const version = td.nextElementSibling.innerText
          console.log(addon.id, "最新版本", version, "安装版本", addon.version)
          if (version.replace(/^v/, "") > addon.version.replace(/^v/, "")) {
            sourceAtags.forEach(a => {
              const href = a.getAttribute("href")
              a.innerText = a.innerText.replace("安装", "更新")
              sourceNode.style.backgroundColor = "#42b983"
              a.style.color = "white"
              a.setAttribute("href", `zotero://plugin/?action=install&url=${encodeURIComponent(href)}`)
            })
          } else {
            sourceNode.style.backgroundColor = "#42b983"
            sourceNode.innerHTML = `<span style="font-weight: bold; color: white;">⭐已安装</span>`;
          }
        }
      })
  }

})();
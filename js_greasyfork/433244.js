// ==UserScript==
// @name         nijienhance
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  nijie ajax bookmark 412305
// @author       nijietan
// @match        https://nijie.info/*
// @match        https://sp.nijie.info/*
// @icon         https://www.google.com/s2/favicons?domain=nijie.info
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/433244/nijienhance.user.js
// @updateURL https://update.greasyfork.org/scripts/433244/nijienhance.meta.js
// ==/UserScript==

;(function () {
  "use strict"
  console.log("running nijienhance")
  // sp のブックマークを fetch にする
  document
    .querySelectorAll('#bookmark_button > a[href^="bookmark_add.php"]')
    .forEach((elem) => {
      elem.removeAttribute("onclick")
      const handleBookmarkButton = (e) => {
        e.preventDefault()
        if (!confirm("[ajax] ブックマークに追加してもよろしいですか？")) return

        fetch(elem.href, {
          headers: {
            "cache-control": "no-cache",
          },
          referrer: location.href,
          referrerPolicy: "same-origin",
          method: "GET",
          credentials: "include",
        }).then((r) => {
          if (r.ok) {
            elem.href = elem.href.replace("add", "edit")
            elem.removeEventListener("click", handleBookmarkButton)
            const bookmark = elem.querySelector("#bookmark")
            if (bookmark) {
              bookmark.id = "bookmark_edit"
            }
          } else {
            alert("ブックマークの追加に失敗しました")
          }
        })
      }
      elem.addEventListener("click", handleBookmarkButton)
      console.log("applied", elem)
    })
  // pc のブックマークを fetch にする
  document.querySelectorAll('a[href^="/bookmark.php"]').forEach((elem) => {
    const url = new URL(elem.href)
    const _id = url.searchParams.get("id")
    if (!_id) return

    const handleBookmarkButton = (e) => {
      e.preventDefault()
      const bukumafolder = prompt("ブクマフォルダーを指定")
      if (bukumafolder === null) return
      fetch("https://nijie.info/bookmark_add.php", {
        headers: {
          "cache-control": "max-age=0",
          "content-type": "application/x-www-form-urlencoded",
        },
        referrer: location.href,
        referrerPolicy: "same-origin",
        body: `tag=${bukumafolder}&id=${_id}`,
        method: "POST",
        credentials: "include",
      }).then((r) => {
        if (r.ok) {
          elem.id = "bukuma"
          elem.href = elem.href.replace("add", "edit")
          elem.removeEventListener("click", handleBookmarkButton)
        } else {
          alert("ブックマークの追加に失敗しました")
        }
      })
    }
    elem.addEventListener("click", handleBookmarkButton)
    console.log("applied", elem)
  })
})()

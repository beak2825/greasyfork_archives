// ==UserScript==
// @name        4chan gpt2 checker
// @namespace   Violentmonkey Scripts
// @match       https://boards.4channel.org/*
// @grant       none
// @version     0.2
// @author      w w w w
// @license     MIT
// @description 2023-01-12, 4:05:24 a.m.
// @downloadURL https://update.greasyfork.org/scripts/458102/4chan%20gpt2%20checker.user.js
// @updateURL https://update.greasyfork.org/scripts/458102/4chan%20gpt2%20checker.meta.js
// ==/UserScript==


(function () {
  const url = "https://openai-openai-detector.hf.space/?";

  [...document.getElementsByClassName("postMessage")].forEach(e => {
    const text = e.innerText.replaceAll(/^>>[0-9]+(?:[ \s]\(OP\)){0,1}$/gm, "").trim()
    if (text.length == 0) return

    const row = document.createElement("span")
    row.style.marginLeft = "0.25em"

    const postinfo = [...e.parentElement.children].filter(e2 => e2.classList.contains("postInfo"))

    if (!postinfo) return

    postinfo[0].insertBefore(row, [...postinfo[0].children].filter(e2 => e2.tagName == "A").at(-1))

    const btn = document.createElement("a")
    btn.style.cursor = "pointer"
    btn.textContent = "Check"
    row.appendChild(btn)

    const result = document.createElement("span")
    row.appendChild(result)

    btn.addEventListener("click", e2 => {
      btn.style.cursor = ""
      fetch(url + encodeURI(text)).then(res => res.json()).then(res => {
        console.log(res)
        result.textContent = `${Math.round(res.fake_probability * 100)}% fake`
        btn.parentElement.removeChild(btn)
      })
      e2.preventDefault()
    })
  })
})()

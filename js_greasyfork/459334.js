// ==UserScript==
// @name         Make URLS clickable in MAL aboutme
// @namespace    http://myanimelist.net/profile/kyoyatempest
// @version      1.1
// @description  This script makes URLS clickable in any profile! (for modern about me.)
// @author       kyoyacchi
// @match        https://myanimelist.net/profile/*
// @license      MIT
// @icon         https://myanimelist.net/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/459334/Make%20URLS%20clickable%20in%20MAL%20aboutme.user.js
// @updateURL https://update.greasyfork.org/scripts/459334/Make%20URLS%20clickable%20in%20MAL%20aboutme.meta.js
// ==/UserScript==

const linkify = t => {
  const isValidHttpUrl = s => {
    let u
    try {u = new URL(s)}
    catch (_) {return false}
    return u.protocol.startsWith("http")
  }
  const m = t.match(/(?<=\s|^)[a-zA-Z0-9-:/]+\.[a-zA-Z0-9-].+?(?=[.,;:?!-]?(?:\s|$))/g)
  if (!m) return t
  const a = []
  m.forEach(x => {
    const [t1, ...t2] = t.split(x)
    a.push(t1)
    t = t2.join(x)
    const y = (!(x.match(/:\/\//)) ? 'https://' : '') + x
    if (isNaN(x) && isValidHttpUrl(y))
      a.push('<a href="' + y.replace("<br>","") + '" target="_blank">' + y.split('/')[2] + '</a>')
    else
      a.push(x)
  })
  a.push(t)
  return a.join('')
}
//https://stackoverflow.com/a/71734086/19276081


let i =document.querySelector(".c-aboutme-text")
if (!i) return
i.innerHTML = linkify(i.innerHTML)

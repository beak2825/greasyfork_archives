// ==UserScript==
// @name TJUPT - Direct Links
// @namespace https://github.com/whtsky/userscripts/
// @version 20200213
// @description 将 TJUPT 中的外链转换为直接链接
// @match https://tjupt.org/*
// @grant none
// @supportURL https://github.com/whtsky/userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/383866/TJUPT%20-%20Direct%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/383866/TJUPT%20-%20Direct%20Links.meta.js
// ==/UserScript==

function removeTo(s, to) {
  const index = s.search(to)
  if (index !== -1) {
    return s.substr(index + to.length)
  }
  return s
}

document.querySelectorAll('a').forEach(anchor => {
  let link = anchor.href
  if (link.startsWith('https://tjupt.org/adredir.php')) {
    link = removeTo(link, 'url=')
  } else if (link.startsWith('https://tjupt.org/jump_external.php')) {
    link = removeTo(link, 'ext_url=')
  } else {
    return
  }
  anchor.href = decodeURIComponent(link)
})

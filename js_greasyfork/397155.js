// ==UserScript==
// @name    Anti-AntiAdblock on ruanyifeng.com
// @description Make RuanYiFeng Happy
// @version 1
// @grant   none
// @inject-into auto
// @supportURL https://github.com/whtsky/userscripts/issues
// @match   *://*.ruanyifeng.com/*
// @namespace https://greasyfork.org/users/164794
// @downloadURL https://update.greasyfork.org/scripts/397155/Anti-AntiAdblock%20on%20ruanyifengcom.user.js
// @updateURL https://update.greasyfork.org/scripts/397155/Anti-AntiAdblock%20on%20ruanyifengcom.meta.js
// ==/UserScript==

const el = document.getElementById('main-content')

const ryf = el.innerHTML

function ruanyifeng() {
  document.getElementsByClassName('asset-meta')[0].nextElementSibling.style = 'display:none'
  el.innerHTML = ryf
  el.style.display = 'block'
  const e = setTimeout(ruanyifeng, 1001)
  for (let i = 0; i <= e; i++) {
    clearTimeout(i)
  }
}

const e = setTimeout(ruanyifeng, 1001)
for (let i = 0; i < e; i++) {
  clearTimeout(i)
}

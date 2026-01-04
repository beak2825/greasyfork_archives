// ==UserScript==
// @name         Torn CDs local time
// @namespace    namespace
// @version      0.1
// @description  description
// @author       tos
// @match       *.torn.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/378177/Torn%20CDs%20local%20time.user.js
// @updateURL https://update.greasyfork.org/scripts/378177/Torn%20CDs%20local%20time.meta.js
// ==/UserScript==

const APIKEY = 'api_key_here'

GM_addStyle(`
  #x_cds span {
    padding: 0.5em;
  }
  .x_drug {
    color: #c1ffbb;
  }
  .x_medical {
    color: #bdf7ff;
  }
  .x_booster {
    color: #ffd89d;
  }
`)

document.querySelector('.header-wrapper-bottom').insertAdjacentHTML('beforeend', `<div id="x_cds" class="right"></div>`)

const get_cooldowns = async () => fetch(`https://api.torn.com/user/?selections=cooldowns,timestamp&key=${APIKEY}`).then(r => r.json())

get_cooldowns().then((res) => {
  const x_cds = document.querySelector('#x_cds')
  for (const cd in res.cooldowns) {
    x_cds.insertAdjacentHTML('beforeend', `<span class="x_${cd}">${cd.toUpperCase()}: ${new Date((res.timestamp + res.cooldowns[cd])*1000).toLocaleString()}</span>`)
  }
})
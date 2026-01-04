// ==UserScript==
// @name         TC RD Racing Guide 2.0
// @namespace    namespace
// @version      0.1
// @description  description
// @license      MIT
// @author       tos
// @match       *.torn.com/loader.php*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/502519/TC%20RD%20Racing%20Guide%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/502519/TC%20RD%20Racing%20Guide%2020.meta.js
// ==/UserScript==

if (!window.location.search.includes('racing')) return

GM_addStyle(`
DIV.rd-race-pick {
  display: inline-block;
}
`)

const race_picks = {
  'Hammerhead': 'Edomondo NSX - D | SR | T2',
  'Commerce': 'Edomondo NSX - T | SR | T2',
  'Sewage': 'Edomondo NSX - T | SR | T2',
  'Underdog': 'Edomondo NSX - T | SR | T2',
  'Parkland': 'Edomondo NSX - D | SR | T3',
  'Industrial': 'Edomondo NSX - T | SR | T3',
  'Meltdown': 'Edomondo NSX - T | SR | T3',
  'Two Islands': 'Edomondo NSX - T | SR | T3',
  'Docks': 'Edomondo NSX - D | LR | T3',
  'Speedway': 'Veloria LFA - T | LR | T3',
  'Withdrawal': 'Veloria LFA - T | LR | T3',
  'Vector': 'Volt GT - T | LR | T3',
  'Uptown': 'Lambrini Torobravo - T | LR | T3',
  'Mudpit': 'Colina Tanprice - D | LR | T3',
  'Stone Park': 'Echo R8 - D | SR | T3',
  'Convict': 'Mercia SLR - T | LR | T3'
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      const rd_race_pick_DIV = document.querySelector('DIV.rd-race-pick')
      if (rd_race_pick_DIV !== null) continue
      const enlisted_btn_wrap_DIV = document.querySelector('DIV.enlisted-btn-wrap')
      if (enlisted_btn_wrap_DIV) {
        const race_name = enlisted_btn_wrap_DIV.innerText.split(' - ')[0]
        enlisted_btn_wrap_DIV.insertAdjacentHTML('beforeend', `<div class='rd-race-pick'> - ${race_picks[race_name]}</div>`)
      }
    }
  }
})
const wrapper = document.querySelector('#mainContainer')
observer.observe(wrapper, { subtree: true, childList: true })
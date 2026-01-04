// ==UserScript==
// @name         Vault Copy
// @namespace    namespace
// @version      0.1
// @description  description
// @author       tos
// @match       *.torn.com/properties.php*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/396565/Vault%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/396565/Vault%20Copy.meta.js
// ==/UserScript==

GM_addStyle(`
#x_button_right {
  background-color: #c13c3c;
  color: #eaeaea;
  cursor: pointer;
  padding: 1em;
  position: fixed;
  right: 0;
}
`)

document.querySelector('div.content').insertAdjacentHTML('beforebegin', `<div id="x_button_right">Copy Vault</div>`)

document.querySelector('#x_button_right').addEventListener('click', (e) => {
  let csv = []
  document.querySelectorAll('UL.vault-trans-list>LI').forEach((li) => {
    let line = []
    line.push(li.querySelector('li.date').innerText.replace(/ AM| PM/g, ''))
    line.push(li.querySelector('li.user img') ? li.querySelector('li.user img').title : 'User')
    line.push(li.querySelector('li.type').innerText)
    line.push(li.querySelector('li.amount').innerText)
    line.push(li.querySelector('li.balance').innerText)
    //console.log(line)
    csv.push(line.join('\t'))
  })
  GM_setClipboard(csv.join('\n'))
})
// ==UserScript==
// @name         TC Revive Check
// @namespace    namespace
// @version      0.1
// @description  description
// @license      MIT
// @author       tos
// @match       *.torn.com/factions.php*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/455073/TC%20Revive%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/455073/TC%20Revive%20Check.meta.js
// ==/UserScript==

const APIKEY = 'API_KEY_HERE'

GM_addStyle(`
#x_revive_check {
  background-color: #3675eb;
  border-radius: 0.5em;
  color: #eee;
  cursor: pointer;
  display: flex;
  font-weight: bold;
  margin: 1em;
  padding: 0.5em;
  position: absolute;
  right: 0em;
  top: 8em;
}

.x_revivable {
  background-color: #66b7ee;
}
`)

document.querySelector('BODY').insertAdjacentHTML('afterbegin', `<div id="x_revive_check">Revivable?</div>`)
const revive_check_button = document.querySelector('#x_revive_check')
revive_check_button.addEventListener('click', (e) => {
  revive_check_button.innerText = 'Working...'
  const profile_links = document.querySelectorAll('LI.table-row [href*="/profiles.php?XID="]')
  const profile_fetches = Array.from(profile_links).map((link) => {
    const playerID = link.href.split('=')[1]
    return fetch(`https://api.torn.com/user/${playerID}?selections=profile&key=${APIKEY}`)
      .then(r => r.json())
      .then((res) => {
        if (res.revivable == 1) link.closest('LI.table-row').classList.add('x_revivable')
        else if (res.error) {
          revive_check_button.innerText = 'API ERROR'
          throw res.error.error
        }
      })
      .catch(console.error)
  })
  Promise.all(profile_fetches)
    .then(f => revive_check_button.innerText = 'Complete')
    .catch(console.error)
})
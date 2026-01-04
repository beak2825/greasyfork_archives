// ==UserScript==
// @name         TC HOF Inactive Leaders
// @namespace    namespace
// @version      0.3
// @description  highlight inactive leader/co-leaders in hof -> respect
// @author       tos
// @match        *.torn.com/halloffame.php*
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/436641/TC%20HOF%20Inactive%20Leaders.user.js
// @updateURL https://update.greasyfork.org/scripts/436641/TC%20HOF%20Inactive%20Leaders.meta.js
// ==/UserScript==

const APIKEY = 'APIKEY'
const inactive_time = 24 * 60 * 60


GM_addStyle(`
#x_button {
  background-color: #333;
  border-radius: 0.5em;
  color: #DDD;
  cursor: pointer;
  padding: 1em;
  position: fixed;
  top: 10%;
  right: 5%;
}

SPAN.x_span_left {
  position: absolute;
  right: -10em;
}
SPAN.x_span_right {
  position: absolute;
  right: -20em;
}
`)

let rate_limiter = []

add_x_button()

function add_x_button() {
  document.querySelector('BODY').insertAdjacentHTML('afterbegin', `<DIV id="x_button">Check inactive leaders (ctrl-shift-f)</DIV>`)
  document.querySelector('#x_button').addEventListener('click', check_page)
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.keyCode === 70) check_page(e)
  })
}

function check_page() {
  const x_button = document.querySelector('#x_button')
  x_button.innerText = '             Loading...              '
  const faction_list = Array.from(document.querySelectorAll('DIV.hall-of-fame-wrap UL.players-list>LI'))
  Promise.all( faction_list.map(LI => check_faction(LI)) )
    .then(_ => x_button.innerText = 'Check inactive leaders (ctrl-shift-f)')
    .catch(err => {
      console.error(err)
      if (err.includes('API CALL PREVENTED BY RATE LIMITER')) x_button.innerText = 'API CALL PREVENTED RATE LIMITER'
      else x_button.innerText = 'Check failed check console for errors'
    })
}

async function check_faction(LI) {
  const timestamp_now = Math.floor(Date.now()/1000)
  const factionID = LI.querySelector('LI.player A:last-child').href.split('&ID=')[1]
  rate_limiter.push(timestamp_now)
  const previous_minute = rate_limiter.filter(timestamp => timestamp > timestamp_now - 60)
  rate_limiter = previous_minute
  if (rate_limiter.length > 75) throw('API CALL PREVENTED BY RATE LIMITER (TC HOF Inactive Leaders.js)')
  const faction = await fetch(`https://api.torn.com/faction/${factionID}?selections=basic&key=${APIKEY}`).then(r => r.json()).catch(console.error)
  const leader = faction.members[faction.leader].last_action
  const coleader = faction.members[faction['co-leader']]?.last_action
  let warn_level = 0
  if (timestamp_now - leader.timestamp > inactive_time) warn_level += 1
  if (coleader && timestamp_now - coleader.timestamp > inactive_time) warn_level += 1
  if (!coleader) warn_level += 1
  if (warn_level === 1) LI.style.backgroundColor = '#fcec72'
  if (warn_level === 2) LI.style.backgroundColor = '#ff7a6e'
  LI.insertAdjacentHTML('afterbegin', `<span class="x_span_left">${leader?.relative}</span><span class="x_span_right">${coleader?.relative ? coleader?.relative : 'N/A'}</span>`)
}

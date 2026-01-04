// ==UserScript==
// @name         Torn War Stuff
// @namespace    namespace
// @version      0.1
// @description  description
// @author       tos
// @match       *.torn.com/factions.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446374/Torn%20War%20Stuff.user.js
// @updateURL https://update.greasyfork.org/scripts/446374/Torn%20War%20Stuff.meta.js
// ==/UserScript==

const APIKEY = 'API_KEY_HERE'

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.classList && node.classList.contains('faction-war')) {
        replaceEnemyInfo(node)
      }
    }
  }
})

const wrapper = document.body//.querySelector('#mainContainer')
observer.observe(wrapper, { subtree: true, childList: true })

async function replaceEnemyInfo(node) {
  const enemy_LIs = node.querySelectorAll('LI.enemy')
  const enemy_faction_id = enemy_LIs[0].querySelector(`A[href^='/factions.php']`).href.split('ID=')[1]
  const enemy_basic = await fetch(`https://api.torn.com/faction/${enemy_faction_id}?selections=basic&key=${APIKEY}`).then(r => r.json()).catch(console.error)
  enemy_LIs.forEach((li) => {
    const status_DIV = li.querySelector('DIV.status')
    const enemy_id = li.querySelector(`A[href^='/profiles.php']`).href.split('ID=')[1]
    const enemy_status = enemy_basic.members[enemy_id].status
    enemy_status.description = enemy_status.description.replace('South Africa', 'SA').replace('Cayman Islands', 'CI').replace('United Kingdom', 'UK').replace('Argentina', 'Arg')
    switch(enemy_status.state) {
      case 'Abroad':
      case 'Traveling':
        if (enemy_status.description.includes('Traveling to ')) status_DIV.innerText = '► ' + enemy_status.description.split('Traveling to ')[1]
        else if (enemy_status.description.includes('In ')) status_DIV.innerText = enemy_status.description.split('In ')[1]
        else if (enemy_status.description.includes('Returning')) status_DIV.innerText = '◄ ' + enemy_status.description.split('Returning to Torn from ')[1]
        break
      case 'Hospital':
        const hosp_time_remaining = Math.round(enemy_status.until - (new Date().getTime() / 1000))
        if (hosp_time_remaining < 300) {
          status_DIV.innerText = hosp_time_remaining + 's'
          li.style.backgroundColor = '#afa'
        }
        break
      default:
        break
    }
  })
}
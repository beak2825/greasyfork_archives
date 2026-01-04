// ==UserScript==
// @name         Torn War Stuff
// @namespace    namespace
// @version      0.6
// @description  description
// @author       tos
// @license      MIT
// @match       *.torn.com/factions.php*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/448681/Torn%20War%20Stuff.user.js
// @updateURL https://update.greasyfork.org/scripts/448681/Torn%20War%20Stuff.meta.js
// ==/UserScript==

const APIKEY = 'API_KEY_HERE'
const sort_enemies = true

GM_addStyle(`
.warstuff_highlight {
  background-color: #afa5 !important;
}
`)

setInterval(() => {
  const warDIV = document.querySelector('DIV.faction-war')
  if (warDIV) replaceEnemyInfo(warDIV)
}, 15000)


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
    li.setAttribute('data-until', enemy_status.until)
    enemy_status.description = enemy_status.description.replace('South Africa', 'SA').replace('Cayman Islands', 'CI').replace('United Kingdom', 'UK').replace('Argentina', 'Arg').replace('Switzerland', 'Switz')
    switch(enemy_status.state) {
      case 'Abroad':
      case 'Traveling':
        if (enemy_status.description.includes('Traveling to ')) {
          li.setAttribute('data-sortA', '4')
          status_DIV.innerText = '► ' + enemy_status.description.split('Traveling to ')[1]
        }
        else if (enemy_status.description.includes('In ')) {
          li.setAttribute('data-sortA', '3')
          status_DIV.innerText = enemy_status.description.split('In ')[1]
        }
        else if (enemy_status.description.includes('Returning')) {
          li.setAttribute('data-sortA', '2')
          status_DIV.innerText = '◄ ' + enemy_status.description.split('Returning to Torn from ')[1]
        }
        else if (enemy_status.description.includes('Traveling')) {
          li.setAttribute('data-sortA', '5')
          status_DIV.innerText = 'Traveling'
        }
        break
      case 'Hospital':
        li.setAttribute('data-sortA', '1')
        const discharge_time = new Date(enemy_status.until*1000)
        const h = discharge_time.getUTCHours().toString().padStart(2, '0')
        const m = discharge_time.getUTCMinutes().toString().padStart(2, '0')
        const s = discharge_time.getUTCSeconds().toString().padStart(2, '0')
        const time_string = `${h}:${m}:${s}`
        const hosp_time_remaining = Math.round(enemy_status.until - (new Date().getTime() / 1000))
        status_DIV.innerText = time_string
        li.classList.remove('warstuff_highlight')
        //li.style.backgroundColor = 'transparent'
        if (hosp_time_remaining < 300) {
          //status_DIV.innerText = time_string//hosp_time_remaining + 's'
          li.classList.add('warstuff_highlight')
        }
        break
      default:
        li.setAttribute('data-sortA', '0')
        break
    }
  })
  if (sort_enemies) {
    const enemy_UL = document.querySelector('LI.enemy').closest('UL.members-list')
    Array.from(enemy_LIs).sort((a, b) => {
      return a.getAttribute('data-sortA') - b.getAttribute('data-sortA') || a.getAttribute('data-until') - b.getAttribute('data-until')
    }).forEach(li => enemy_UL.appendChild(li))
  }
}


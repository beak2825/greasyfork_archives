// ==UserScript==
// @name         Gym Ratio
// @namespace    namespace
// @version      0.2
// @description  description
// @author       tos
// @match        *.torn.com/gym.php
// @downloadURL https://update.greasyfork.org/scripts/37315/Gym%20Ratio.user.js
// @updateURL https://update.greasyfork.org/scripts/37315/Gym%20Ratio.meta.js
// ==/UserScript==

const specGyms = {
  'balboas': ['defence', 'dexterity'],
  'frontline': ['strength', 'speed'],
  'gym3000': ['strength'],
  'isoyamas': ['defence'],
  'rebound': ['speed'],
  'elites': ['dexterity']
}

const gymCalc = (stats, gym) => {
  let primaryStats = 0
  let secondaryStats = 0
  let secondHighest = ''
  let statsMessage = ''
  switch (gym) {
    case 'balboas':
    case 'frontline':
      for (const name in stats) {
        if (specGyms[gym].indexOf(name) < 0) secondaryStats += stats[name]
        else primaryStats += stats[name]
      }
      if ((primaryStats / 1.25) > secondaryStats) statsMessage = 'Gain no more than '+ parseInt((primaryStats / 1.25) - secondaryStats).toString().replace(/\B(?=(\d{3})+\b)/g, ",") +' '+ Object.keys(stats).filter((e) => !specGyms[gym].includes(e)).join(' and ')
      else statsMessage = 'Gain '+ parseInt((secondaryStats * 1.25) - primaryStats).toString().replace(/\B(?=(\d{3})+\b)/g, ",") +' '+ specGyms[gym].join(' and ')
      break
    case 'gym3000':
    case 'isoyamas':
    case 'rebound':
    case 'elites':
      for (const name in stats) {
        if (specGyms[gym].indexOf(name) < 0) {
          if (secondaryStats < stats[name]) {
            secondaryStats = stats[name]
            secondHighest = ' '+ name
          }
        }
        else {
          primaryStats = stats[name]
        }
      }
      if ((primaryStats / 1.25) > secondaryStats) statsMessage = 'Gain no more than '+ parseInt((primaryStats / 1.25) - secondaryStats).toString().replace(/\B(?=(\d{3})+\b)/g, ",") +' '+ secondHighest
      else statsMessage = 'Gain '+ parseInt((secondaryStats * 1.25) - primaryStats).toString().replace(/\B(?=(\d{3})+\b)/g, ",") +' '+ specGyms[gym][0]
      break
    default:
      break
  }
  return statsMessage
}

const get_stats = () => {
  let bs = {}
  for (const stat of document.querySelectorAll('.right.statTotal')) {
    bs[stat.id.replace('Total', '')] = parseInt(stat.innerText.replace(/,/g, ''))
  }
  return bs
}
let stats = get_stats()

document.querySelector('#gym_content_right').insertAdjacentHTML('afterend', `
  <div class="content right" style="width: 256px; margin-top: 10px;">
    <div class="title-black top-round">Special Gym Requirements</div>
    <div class="cont-gray bottom-round p10">
      <select id="gymSelector">
        <option value="balboas">Balboas Gym (def/dex)</option>
        <option value="frontline">Frontline Fitness (str/spd)</option>
        <option value="gym3000">Gym 3000 (str)</option>
        <option value="isoyamas">Mr. Isoyamas (def)</option>
        <option value="rebound">Total Rebound (spd)</option>
        <option value="elites">Elites (dex)</option>
      </select>
      <p id="gymRatioMsg" style="padding-top: 10px;"></p>
    </div>
  </div>
`)
const ratioMSG = document.querySelector('#gymRatioMsg')
const gymSelector = document.querySelector('#gymSelector')

gymSelector.value = localStorage.getItem('specGymSelector') || 'balboas'
ratioMSG.innerText = gymCalc(stats, gymSelector.value)

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.target.className === 'right statTotal') {
      stats = get_stats()
      ratioMSG.innerText = gymCalc(stats, gymSelector.value)
    }
  }
})
observer.observe(document.querySelector('.ability-boxes'), {childList: true, subtree: true})

gymSelector.addEventListener('change', (e) => {
  localStorage.setItem('specGymSelector', e.target.value)
  ratioMSG.innerText = gymCalc(stats, e.target.value)
})

// ==UserScript==
// @name         Special Gym Reqs
// @namespace    namespace
// @version      0.2
// @description  description
// @author       tos
// @match        *.torn.com/gym.php
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/371872/Special%20Gym%20Reqs.user.js
// @updateURL https://update.greasyfork.org/scripts/371872/Special%20Gym%20Reqs.meta.js
// ==/UserScript==

GM_addStyle(`
.xgr_container {
  display: flex;
  flex-direction: column;
  margin: 15px 0px;
}
.xgr_title {
  background-color: #303030;
  border-radius: 5px 5px 0px 0px;
  color: #FFFFFF;
  font-size: 1.5em;
  padding: 0.5em;
}

.xgr_content {
  background-color: #F2F2F2;
  border-radius: 0px 0px 5px 5px;
}

.xgr_row {
  display: flex;
  margin: 0.5em;
}

.xgr_row p {
  margin: 0.5em;
}
`)
const insert_xgr_html = new Promise((resolve, reject) => {
  unsafeWindow.addEventListener('load', () => {
    document.querySelector('#gymroot').insertAdjacentHTML('afterend', `
    <div class="xgr_container">
      <div class="xgr_title">Special Gym Requirements</div>
      <div class="xgr_content">
        <div class="xgr_row">
          <select id="xgr_selector1">
            <option value="balboas">Balboas Gym (def/dex)</option>
            <option value="frontline">Frontline Fitness (str/spd)</option>
            <option value="gym3000">Gym 3000 (str)</option>
            <option value="isoyamas">Mr. Isoyamas (def)</option>
            <option value="rebound">Total Rebound (spd)</option>
            <option value="elites">Elites (dex)</option>
          </select>
          <p id="xgr_msg1">&nbsp;</p>
        </div>
        <div class="xgr_row">
          <select id="xgr_selector2">
            <option value="balboas">Balboas Gym (def/dex)</option>
            <option value="frontline">Frontline Fitness (str/spd)</option>
            <option value="gym3000">Gym 3000 (str)</option>
            <option value="isoyamas">Mr. Isoyamas (def)</option>
            <option value="rebound">Total Rebound (spd)</option>
            <option value="elites">Elites (dex)</option>
          </select>
          <p id="xgr_msg2">&nbsp;</p>
        </div>
      </div>
    </div>
    `)
    for (const select of document.querySelectorAll('.xgr_row select')) select.addEventListener('change', e => {
      select.nextElementSibling.innerText = gymCalc(xgr_stats, select.value)
      localStorage.setItem(e.target.id, e.target.value)
    })
    resolve(true)
  })
})

const specGyms = {
  'balboas': ['defense', 'dexterity'],
  'frontline': ['strength', 'speed'],
  'gym3000': ['strength'],
  'isoyamas': ['defense'],
  'rebound': ['speed'],
  'elites': ['dexterity']
}

let xgr_stats = null

const gymCalc = (stats, gym) => {
  let primary = {}
  let secondary = {}
  for (const stat in stats) {
    if (specGyms[gym].indexOf(stat) > -1) primary[stat] = stats[stat].value
    else secondary[stat] = stats[stat].value
  }
  if (Object.keys(primary).length > 1) {
    const p = Object.values(primary).map(v => parseInt(v.replace(/,/g, ''))).reduce((a, b) => a + b)
    const s = Object.values(secondary).map(v => parseInt(v.replace(/,/g, ''))).reduce((a, b) => a + b)
    if (p >= 1.25*s) return `Gain no more than ${parseInt((p / 1.25) - s).toString().replace(/\B(?=(\d{3})+\b)/g, ",")} ${Object.keys(stats).filter((s) => !specGyms[gym].includes(s)).join(' and ')}.`
    else return `Gain ${parseInt((s * 1.25) - p).toString().replace(/\B(?=(\d{3})+\b)/g, ",")} ${specGyms[gym].join(' and ')}.`
  }
  else {
    const p = parseInt(primary[specGyms[gym][0]].replace(/,/g, ''))
    let s = Object.values(secondary).map( v => parseInt(v.replace(/,/g, '')) ).reduce((a, b) => Math.max(a, b))
    if (p >= 1.25*s) return `Gain no more than ${parseInt((p / 1.25) - s).toString().replace(/\B(?=(\d{3})+\b)/g, ",")} ${Object.entries(secondary).filter((a) => parseInt(a[1].replace(/,/g, '')) === s)[0][0]}.`
    else return `Gain ${parseInt((s * 1.25) - p).toString().replace(/\B(?=(\d{3})+\b)/g, ",")} ${specGyms[gym][0]}.`
  }
}

const xgr_update = async (stats) => {
  await insert_xgr_html
  for (const select of document.querySelectorAll('.xgr_row select')) {
    select.value = localStorage.getItem(select.id) || 'balboas'
    select.nextElementSibling.innerText = gymCalc(stats, select.value)
  }
}


const original_fetch = fetch

unsafeWindow.fetch = async (input, init) => {
	//console.log('initiating fetch', input, init)
	const response = await original_fetch(input, init)
	//console.log('fetch done', response)
	if (response.url.startsWith('https://www.torn.com/gym.php?step=getInitialGymInfo')) {
		const clone = response.clone()
		clone.json().then((r) => {xgr_stats = r.stats; xgr_update(r.stats)})
	}
	return response
}



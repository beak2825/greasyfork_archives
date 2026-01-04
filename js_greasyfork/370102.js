// ==UserScript==
// @name         Faction Last Active
// @namespace    namespace
// @version      0.9
// @description  description
// @author       tos
// @match        *.torn.com/factions.php*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/370102/Faction%20Last%20Active.user.js
// @updateURL https://update.greasyfork.org/scripts/370102/Faction%20Last%20Active.meta.js
// ==/UserScript==

const api_key = 'APIKEY'

GM_addStyle(`
  .last_action_icon {
    cursor: pointer;
    vertical-align: middle;
    display: inline-block;
    background-image: url(/images/v2/sidebar_icons_desktop_2017.png);
    background-repeat: no-repeat;
    background-position-y: -785px;
    width: 34px;
    height: 30px;
  }

  .member_active {
    color: green;
  }
  .member_idle {
    color: #ff7c23;
  }
  .member_away {
    color: red;
    font-weight: bold;
  }
`)

let faction = ''
const info_wrap = document.querySelector('.faction-info')
if (info_wrap) faction = info_wrap.getAttribute('data-faction')

const torn_api = async (args) => {
  const a = args.split('.')
  if (a.length!==3) throw(`Bad argument in torn_api(args, key): ${args}`)
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest ( {
      method: "POST",
      url: `https://api.torn.com/${a[0]}/${a[1]}?selections=${a[2]}&key=${api_key}`,
      headers: {
        "Content-Type": "application/json"
      },
      onload: (response) => {
          try {
            const resjson = JSON.parse(response.responseText)
            resolve(resjson)
          } catch(err) {
            reject(err)
          }
      },
      onerror: (err) => {
        reject(err)
      }
    })
  })
}


const toggleLastAction = (iconsTitle, memberUL) => {
  if (iconsTitle.innerText === 'Icons') {
    iconsTitle.childNodes[0].nodeValue = 'Last Action'
    torn_api(`faction.${faction}.basic`).then((res) => {
      console.log(res)
      if (res.error && res.error.code === 2) alert('Invalid API key in Faction Last Action script. Please update in line 11.')
      for (const li of memberUL.children) {
        const lastActionDIV = li.querySelector('.last-action')
        const memberID = lastActionDIV.getAttribute('data-member-ID')
        const lastAction = res.members[memberID].last_action.relative
        li.querySelector('.member-icons #iconTray').classList.toggle('hide')
        lastActionDIV.innerText = lastAction
        if (lastAction.includes('minute') && parseInt(lastAction.split(' ')[0]) <= 10) lastActionDIV.classList.add('member_active')
        if (lastAction.includes('day') && parseInt(lastAction.split(' ')[0]) < 7) lastActionDIV.classList.add('member_idle')
        if (lastAction.includes('day') && parseInt(lastAction.split(' ')[0]) >= 7) lastActionDIV.classList.add('member_away')
        lastActionDIV.classList.toggle('hide')
      }
    })
  }
  else {
    iconsTitle.childNodes[0].nodeValue = 'Icons'
    for (const li of memberUL.children) {
      li.querySelector('.member-icons #iconTray').classList.toggle('hide')
      li.querySelector('.last-action').classList.toggle('hide')
    }
  }
}

const add_toggle = (node) => {
  const iconsTitle = node.querySelector('.title .member-icons')
  const memberUL = node.querySelector('.member-list')
  iconsTitle.insertAdjacentHTML('beforeend', `<i class="last_action_icon right"></i>`)
  node.querySelector('.last_action_icon').addEventListener('click', () => { toggleLastAction(iconsTitle, memberUL) })
  for (const li of memberUL.children) {
    const memberID = li.querySelector('.user.name').getAttribute('href').split('XID=')[1]
    li.querySelector('.member-icons #iconTray').insertAdjacentHTML('afterend', `<div class="last-action hide" data-member-id="${memberID}"></div>`)
  }
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.className && node.querySelector('.f-war-list')) {
        add_toggle(node)
      }
    }
  }
})

const otherFactionUL = document.querySelector('.f-war-list')
if (otherFactionUL) {
  add_toggle(otherFactionUL)
}
else {
  const wrapper = document.querySelector('#factions')
  observer.observe(wrapper, { subtree: true, childList: true })
}



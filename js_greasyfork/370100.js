// ==UserScript==
// @name         tornStats faction members
// @namespace    namespace
// @version      0.1
// @description  description
// @author       tos
// @match        *.tornstats.com/factions.php?*
// @downloadURL https://update.greasyfork.org/scripts/370100/tornStats%20faction%20members.user.js
// @updateURL https://update.greasyfork.org/scripts/370100/tornStats%20faction%20members.meta.js
// ==/UserScript==

const apiKey = 'APIKEY'
const factionID = 'FACTION_ID'

const get_faction = async () => {
  const res = await fetch(`https://api.torn.com/faction/${factionID}?selections=basic&key=${apiKey}`)
  return await res.json()
}

get_faction().then((f) => {
  const memberIDs = Object.keys(f.members)
  const trList = document.querySelector('#member-access tbody').children
  for (const tr of trList) {
    switch(tr.firstChild.children.length) {
      case 1:
        if (!memberIDs.includes(tr.firstChild.children[0].innerText.split('[')[1].split(']')[0])) tr.firstChild.children[0].style.color = 'red'
        break
      case 2:
        if (!memberIDs.includes(tr.firstChild.children[1].innerText.split('[')[1].split(']')[0])) tr.firstChild.children[1].style.color = 'red'
        break
      default:
        console.log(tr)
        break
    }
  }
})

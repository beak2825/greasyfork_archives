// ==UserScript==
// @name         ElimLastTick
// @namespace    namespace
// @version      0.1
// @description  description
// @author       tos
// @match       *.torn.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/432677/ElimLastTick.user.js
// @updateURL https://update.greasyfork.org/scripts/432677/ElimLastTick.meta.js
// ==/UserScript==

GM_addStyle(`
#lastTick th {
  font-weight: bold;
}
#lastTick td {
  padding: 0em 1em;
}
`)

const team_names = {
  "Cereal Killers": 'cereal-killers',
  "Chicken Nuggets": 'chicken-nuggets',
  "Dongs": 'dongs',
  "G.O.A.T": 'goat',
  "Illuminati": 'illuminati',
  "Keyboard Warriors": 'keyboard-warriors',
  "Lettuce Win!": 'lettuce-win',
  "Pandemic": 'pandemic',
  "Sea Men": 'sea-men',
  "Short Bus": 'short-bus',
  "Snowflakes": 'snowflakes',
  "Victorious Secret": 'victorious-secret'
}

const eliminated_teams = ["Victorious Secret", "Pandemic", "Snowflakes", "Cereal Killers", "Chicken Nuggets", "Sea Men", "Lettuce Win!"]

const tableHTML = (td, col_labels) => `
<table>
  <tr><th>Teams</th>${col_labels.map(l => `<th>${l[1]}</th>`).join('')}</tr>
  <tr>
    <td></td>
    ${Object.entries(td).map( ([team, scores]) => `<tr>
      <td><i class="elimination-team-logo ${team_names[team]}"></i><i class="elimination-team-name ${team_names[team]}"></i></td>
      ${scores.map(s => `<td>${s}</td>`).join('')}
    </tr>`).join('')}
  </tr>
</table>
`

$( document ).ajaxComplete(function(event, jqXHR, ajaxObj) {
  if(ajaxObj.url.includes('competition.php') && ajaxObj.data?.includes('step=statisticDataset')) {
    const chart_data = JSON.parse(jqXHR.responseText)
    const tab = document.querySelector('LI.ui-tabs-active A').getAttribute('data-single-title')
    if (chart_data && tab) {
      fillTable(chart_data, tab)
    }
  }
})

function last_tick_tables (d) {
  return {
    labels: d.labels.slice(-10),
    ticket: Object.fromEntries(d.tickets.map(team => [team.label, team.data.slice(-10)])),
    life: Object.fromEntries(d.lives.map(team => [team.label, team.data.slice(-10)])),
    win: Object.fromEntries(d.wins.map(team => [team.label, team.data.slice(-10)])),
    lose: Object.fromEntries(d.losses.map(team => [team.label, team.data.slice(-10)]))
  }
}

async function fillTable(d, tab) {
  let lastTickDIV = document.querySelector('#lastTick')
  if (!lastTickDIV) {
    document.querySelector('.statistic-lives-history').insertAdjacentHTML('beforebegin', `<div id="lastTick"></div><hr class="page-head-delimiter m-bottom10">`)
    lastTickDIV = document.querySelector('#lastTick')
  }
  let tables = last_tick_tables(d.statistic)
  Object.keys(tables[tab]).forEach(k => {
    if (eliminated_teams.includes(k)) delete tables[tab][k]
  })
  //console.log(tab, tables)
  lastTickDIV.innerHTML = tableHTML(tables[tab], tables.labels)
}
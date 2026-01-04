// ==UserScript==
// @name         39thX - Warbase Filter
// @namespace    somenamespace
// @version      0.1.9
// @description  Filter things out of the war base
// @author       tos
// @match        *.torn.com/factions.php?step=your
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/30862/39thX%20-%20Warbase%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/30862/39thX%20-%20Warbase%20Filter.meta.js
// ==/UserScript==

animation_enabled = true
animation_duration = 5 //minutes

GM_addStyle(
  '#warbase_filters {'+
  'padding: 5px;}'+
  
  '#warbase_filters .wb_content_left {'+
  'display: inline-block;'+
  'width: 50%;'+
  'vertical-align: top;}'+
  
  '#warbase_filters .wb_content_right {'+
  'display: inline-block;'+
  'font-size: 110%;'+
  'font-weight: bold;'+
  'width: 50%;'+
  'vertical-align: top;}'+
  
  '#warbase_filters .wbTotals_col_left{'+
  'display: inline-block;'+
  'width: auto;}'+
  
  '#warbase_filters .wbTotals_col_right{'+
  'display: inline-block;'+
  'width: auto;}'+
  
  '#warbase_filters span{'+
  'display: block;'+
  'padding: 1px 10px;}'+
  
  '#warbase_filters input[type="checkbox"] {'+
  'margin-right: 3px;}'+
  
  '#warbase_filters input[type="number"] {'+
  'background: transparent;'+
  'border-bottom: 2px solid black;'+
  'text-align: center;'+
  'width: 50px;}'+
  
  '#warbase_filters .wbTotals_title{'+
  'padding: 1px 0px 1px 10px;}'+
  
  '#warbase_filters .wbTotals {'+
  'padding: 1px 0px;'+
  'text-align: right;'+
  'font-weight: normal;}'
);

let filters = JSON.parse(localStorage.getItem('torn_warbase_filters')) || {}
if(!filters.hasOwnProperty('fed')) filters.fed = false
if(!filters.hasOwnProperty('traveling')) filters.traveling = false
if(!filters.hasOwnProperty('jail_hosp')) filters.jail_hosp = false
if(!filters.hasOwnProperty('jail_hosp_time')) filters.jail_hosp_time = 0
if(!filters.hasOwnProperty('level')) filters.level = false
if(!filters.hasOwnProperty('level_min')) filters.level_min = 0
if(!filters.hasOwnProperty('level_max')) filters.level_max = 100

let faction_totals = {}

const count_enemies = (obj) => {
  let enemy_totals = {total:0, ok:0, hidden:0}
  for (const factionID of Object.keys(obj)) {
    enemy_totals.total += faction_totals[factionID].total
    enemy_totals.ok += faction_totals[factionID].ok
    enemy_totals.hidden += faction_totals[factionID].hidden
  }
  return enemy_totals
}
    

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.className && node.className === 'faction-respect-wars-wp') {
        const war_list = node.querySelector('.f-war-list')
//Build Filter DIV
        const filter_DIV = document.createElement('DIV')
        filter_DIV.innerHTML =
          '<div>'+
          '<div class="title-black m-top10 top-round">War Base Filters</div>'+
            '<div class="cont-gray map-wrap bottom-round " id="warbase_filters">'+
              '<div class="wb_content_left">'+
                '<span><input type="checkbox" class="wbFilter wb_fed">Federal</span>'+
                '<span><input type="checkbox" class="wbFilter wb_traveling">Traveling</span>'+
                '<span><input type="checkbox" class="wbFilter wb_jail_hosp">In Jail/Hosp for <input type="number" class="wbFilter wb_jail_hosp_time">+ minutes</span>'+
                '<span><input type="checkbox" class="wbFilter wb_level">Level<input type="number" class="wbFilter wb_level_min">to<input type="number" class="wbFilter wb_level_max"></span>'+
              '</div>'+
              '<div class="wb_content_right">'+
                '<div class="wbTotals_col_left">'+
                  '<span class="wbTotals_title">Warbase Total:&nbsp;</span>'+
                  '<span class="wbTotals_title">Enemies Okay:&nbsp;</span>'+
                  '<span class="wbTotals_title">Enemies Hidden:&nbsp;</span>'+
                '</div>'+
                '<div class="wbTotals_col_left">'+
                  '<span class="wbTotals wb_total"></span>'+
                  '<span class="wbTotals wb_ok"></span>'+
                  '<span class="wbTotals wb_hidden"></span>'+
                '</div>'+
              '</div>'+
            '</div>'+
          '</div>'
        node.insertBefore(filter_DIV, war_list)
        const filter_inputs = document.querySelectorAll('.wbFilter')
        for (const wbFilter of filter_inputs) {
          const filter_controls = wbFilter.className.split('wb_')[1]
          switch (wbFilter.type) {
            case 'checkbox':
              wbFilter.checked = filters[filter_controls]
              wbFilter.addEventListener('change', (event) => {
                filters[filter_controls] = event.target.checked
                localStorage.setItem('torn_warbase_filters', JSON.stringify(filters))
              })
              break
            case 'number':
              wbFilter.value = filters[filter_controls]
              wbFilter.addEventListener('change', (event) => {
                filters[filter_controls] = event.target.value
                localStorage.setItem('torn_warbase_filters', JSON.stringify(filters))
              })
              break
            default:
              break
          }
        }
        
        /*
        document.querySelector('#wbFilter_fed').addEventListener('change', (event) => {
          filters.fed = event.target.checked
          localStorage.setItem('torn_warbase_filters', JSON.stringify(filters))
        })
        */
      }
//Observing for tabs opening--------------------------------------------------------------------------------------------------------------------------------
      if (node.className && node.className === 'descriptions') {
        if (node.querySelector('.member-list')) {
          if (animation_enabled) {
            const chain_icon = node.parentElement.querySelector('.act .f-chain')
            chain_icon.style.borderRadius = '14px'
            chain_icon.animate(
              [{ backgroundColor: '#b2b2b2' },{ backgroundColor: '#f2f2f2' }],
              {duration: animation_duration * 60000, iterations: 1}
            );
          }
          
          const factionID = node.querySelector('.t-blue').href.split('&')[1].replace('=', '')
          faction_totals[factionID] = {}
          let targets_TOTAL = 0
          let targets_OK = 0
          let targets_HIDDEN = 0
          for (const enemy_LI of node.querySelector('.member-list').children) {
            targets_TOTAL += 1
            const status = enemy_LI.querySelector('.status').firstElementChild.innerText
            let hosp_time = 0
            if (enemy_LI.querySelector('#icon15')) {
              const time_string = enemy_LI.querySelector('#icon15').title.split('\'>')[1].split('</')[0]
              hosp_time = parseInt(time_string.split(':')[0]) * 3600 + parseInt(time_string.split(':')[1]) * 60 + parseInt(time_string.split(':')[2])
            }
            let jail_time = 0
            if (enemy_LI.querySelector('#icon16')) {
              const time_string = enemy_LI.querySelector('#icon16').title.split('\'>')[1].split('</')[0]
              jail_time = parseInt(time_string.split(':')[0]) * 3600 + parseInt(time_string.split(':')[1]) * 60 + parseInt(time_string.split(':')[2])
            }
            const level = parseInt(enemy_LI.querySelector('.lvl .t-hide').nextSibling.textContent)
            
            if (status === 'Okay') targets_OK +=1
            if (filters.fed && status === 'Federal') enemy_LI.style.display = 'none'
              
            if (filters.traveling && status === 'Traveling') enemy_LI.style.display = 'none'
              
            if (filters.jail_hosp && (filters.jail_hosp_time * 60 < jail_time || filters.jail_hosp_time * 60 < hosp_time)) enemy_LI.style.display = 'none'
              
            if (filters.level && (filters.level_min > level || filters.level_max < level)) enemy_LI.style.display = 'none'
            
            if (enemy_LI.style.display === 'none') targets_HIDDEN += 1
          }
          faction_totals[factionID].total = targets_TOTAL
          faction_totals[factionID].ok = targets_OK
          faction_totals[factionID].hidden = targets_HIDDEN
          
          const warbase_totals = count_enemies(faction_totals)
          const wbTotals = document.querySelectorAll('.wbTotals')
          for (const totals_span of wbTotals) {
            const totals_controls = totals_span.className.split('wb_')[1]
            totals_span.innerText = warbase_totals[totals_controls]
          }
        }
      }
    }
  }
});

const wrapper = document.querySelector('#faction-main')
observer.observe(wrapper, { subtree: true, childList: true })


// ==UserScript==
// @name         Warbase Filters
// @namespace    somenamespace
// @version      0.5.1
// @description  Filter things out of the war base
// @author       tos
// @include        *.torn.com/factions.php?step=your*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/30922/Warbase%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/30922/Warbase%20Filters.meta.js
// ==/UserScript==

animation_enabled = true
animation_duration = 5 //minutes

extended_desc_hide = true

difficulty_colors = {
  0: '#e0f2f2',//blue
  1: '#e0f2e9',
  2: '#e0f2e0',//green
  3: '#e6f2e0',
  4: '#ebf2e0',
  5: '#f2f2e0',//yellow
  6: '#f2ebe0',
  7: '#f2e6e0',
  8: '#f2e0e0',//red
  9: '#f2d0d0',
  10: '#f2c0c0',
  11: 'rgb(255,0,0)',
}

GM_addStyle(`
  .wb_extended.f-war-list .descriptions {
    display: none;
  }

  .wb_extended.f-war-list .act {
    padding-bottom: 0 !important;
    border-radius: 5px !important;
  }
  
  #wb_filter_wrap .arrow-wrap {display: block;}
  #wb_filter_wrap i {margin: 8px 12px 0px 0px;}
  #wb_filter_wrap .active i {margin: 11px 12px 0px 0px;}
  
  #warbase_filters {
    display: flex;}
  
  #warbase_filters .wb_content_left {
    display: inline-flex;
    flex-direction: column;
    padding: 5px;
    width: 40%;
    vertical-align: top;}
    
  #warbase_filters .wb_content_middle {
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    padding: 5px;
    width: 30%;}
    
  #warbase_filters .wb_content_right {
    display: inline-flex;
    flex-direction: column;
    padding: 5px;
    width: 30%;}
  #warbase_filters .wb_content_right span{
    justify-content: flex-end;}
  #warbase_filters .wb_content_right input{
    margin-right: 0px !important;
    margin-left: 3px;}
  
  #warbase_filters .wbTotals_col_left{
    display: inline-flex;
    flex-direction: column;
    font-size: 110%;
    font-weight: bold;
    width: auto;}
  #warbase_filters .wbTotals_col_right{
    display: inline-flex;
    flex-direction: column;
    font-size: 110%;
    text-align: right;
    font-weight: normal;
    width: auto;}
  
  #warbase_filters .wbTotals_title{
    padding: 1px 0px 1px 10px;}
  
  #warbase_filters .wbTotals {
    padding: 1px 0px;}
  
  #warbase_filters .filter-title {
    display: inline-flex;
    background-color: #BABABA;
    border-radius: 5px 0px 0px 5px;
    align-items: center;
    font-size: 150%;
    padding: 5px;}
  
  #warbase_filters .filter-content {
    display: inline-flex;
    flex-direction: column;
    background-color: #DBDBDB;
    border-radius: 0px 5px 5px 0px;
    padding: 3px 0px;}
  
  #warbase_filters .filter-row {
    display: flex;
    flex-wrap: wrap;}
  
  #warbase_filters span{
    display: flex;
    flex-wrap: wrap;
    min-height: 3px;
    padding: 1px 10px;}
  
  #warbase_filters input[type="checkbox"] {
    margin-right: 3px;}
  
  #warbase_filters input[type="number"] {
    background: transparent;
    border-bottom: 1px solid black;
    text-align: center;
    width: 50px;}
  
  .f-chain {border-radius: 14px}
  
  @keyframes linkFade {
    0% {color: #969;}
    95% {color: #769;}
    100% {color: #069;}}
  
  .animation_colorfade {
    animation-name: linkFade;
    animation-duration: ${animation_duration * 60}s;}
  
  @keyframes chainIconFade {
    from {background-color: #b2b2b2;}
    to {background-color: #f2f2f2;}}
  
  .animation_colorblind {
    animation-name: chainIconFade;
    animation-duration: ${animation_duration * 60}s;}
  
  #warbase_results {
    display: none;}
  
  #warbase_results .wbResults_placeholder {
    font-weight: bold;
    padding: 10px;}
  
  #wars_extended {
    margin-bottom:10px;}
  
  #wars_extended .descriptions-new {
    display: block;
    margin: 0;
    float: left;
    background-color: transparent;
    border-radius: 0;
    box-shadow: none;
    height: auto;
    width: 100%;}
  
  .wb_difficulty_DIV {
    float: right;
    vertical-align: middle;
  }
  
  .wb_difficulty_INPUT {
    background: white;
    border-radius: 3px;
    box-shadow: 0px 0px 2px #f2f2f2;
    text-align: center;
    float: right;
    height: 100%;
    width: 70%;
    margin: 12% 5%;
    padding: 3px 0px;
  }
  
  .wb_hide {
    overflow: hidden;
    height: 0;}
`)

const default_options = {
  fed: false,
  traveling: false,
  online: true,
  idle: true,
  offline: true,
  hosp: true,
  hosp_time: 0,
  level: false,
  level_min: 0,
  level_max: 100,
  extended: false,
  territories_inverted: false,
  colorblind: false,
  filters_collapse: false,
}

let filters = Object.assign(default_options, JSON.parse(localStorage.getItem('torn_wb_filters'))) //torn_warbase_filters
const storeFilters = () => localStorage.setItem('torn_wb_filters', JSON.stringify(filters))

let enemy_difficulty = JSON.parse(localStorage.getItem('torn_enemy_difficulty')) || {} //torn_enemy_difficulties
const difficulty_max = Object.keys(difficulty_colors).length - 1

let faction_nodes = {}
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

const run_filters = (node) => {
  const factionID = node.querySelector('.t-blue').href.split('&')[1].replace('=', '')
  let target_TOTALS = {total: 0, ok: 0, hidden: 0}
  faction_totals[factionID] = {}
  for (const enemy_LI of node.querySelector('.member-list').children) {
    target_TOTALS.total += 1
    const status = enemy_LI.querySelector('.status').firstElementChild.textContent
    const online_status_icon = enemy_LI.querySelector('#icon1') || enemy_LI.querySelector('#icon2') || enemy_LI.querySelector('#icon62')
    const online_status = online_status_icon.title.replace('<b>', '').replace('</b>', '')
    //const bountied = enemy_LI.querySelector('#icon13') || false
    //if(bountied) enemy_LI.style.backgroundColor ='#F0D9D2';
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
    const userID = enemy_LI.querySelector('.name').href.split('XID=')[1]
    const li_icon_wrap = enemy_LI.querySelector('.member-icons')
    
    if (!enemy_LI.querySelector('.wb_difficulty_DIV')) {
      const difficulty_DIV = document.createElement('DIV')
      difficulty_DIV.className = 'wb_difficulty_DIV'
      difficulty_DIV.innerHTML = `<input class="wb_difficulty_INPUT" type="number" min=0 max=${difficulty_max} data-userID="${userID}"></input>`
      li_icon_wrap.append(difficulty_DIV)
      const difficulty_INPUT = enemy_LI.querySelector('.wb_difficulty_INPUT')
      difficulty_INPUT.addEventListener('change', (event) => {
        if (difficulty_INPUT.value < 0) difficulty_INPUT.value = 0
        if (difficulty_INPUT.value > difficulty_max) difficulty_INPUT.value = difficulty_max
        const difficulty = difficulty_INPUT.value
        if (difficulty === '') {
          if (enemy_difficulty['ID_'+ userID]) delete enemy_difficulty['ID_'+ userID]
          for (const this_user of document.querySelectorAll(`.wb_difficulty_INPUT[data-userID="${userID}"`)) {
            this_user.parentElement.parentElement.parentElement.style.backgroundColor = 'initial'
            this_user.value = difficulty
          }
        }
        else {
          enemy_difficulty['ID_'+ userID] = difficulty
          for (const this_user of document.querySelectorAll(`.wb_difficulty_INPUT[data-userID="${userID}"`)) {
            this_user.parentElement.parentElement.parentElement.style.backgroundColor = difficulty_colors[enemy_difficulty['ID_'+ userID]]
            this_user.value = difficulty
          }
        }
        localStorage.setItem('torn_enemy_difficulty', JSON.stringify(enemy_difficulty))
      })
    }
    if (enemy_difficulty['ID_'+ userID]) {
      enemy_LI.querySelector('.wb_difficulty_INPUT').value = enemy_difficulty['ID_'+ userID]
      enemy_LI.style.backgroundColor = difficulty_colors[enemy_difficulty['ID_'+ userID]]
    }
    
    
    if (status === 'Okay') target_TOTALS.ok +=1
    const hide =
        (!filters.fed       && status === 'Federal') ||
        (!filters.traveling && status === 'Traveling') ||
        (!filters.online    && online_status === 'Online') ||
        (!filters.idle      && online_status === 'Idle') ||
        (!filters.offline   && online_status === 'Offline') ||
        (filters.hosp      && (filters.hosp_time * 60 < hosp_time || filters.hosp_time * 60 < jail_time)) ||
        (filters.level     && (filters.level_min > level || filters.level_max < level))
	
    enemy_LI.style.display = hide ? 'none' : 'list-item'
    
    if (enemy_LI.style.display === 'none') target_TOTALS.hidden += 1
  }
  
  faction_totals[factionID].total = target_TOTALS.total
  faction_totals[factionID].ok = target_TOTALS.ok
  faction_totals[factionID].hidden = target_TOTALS.total - target_TOTALS.hidden
  
  const warbase_totals = count_enemies(faction_totals)
  for (const totals_span of document.querySelectorAll('.wbTotals')) {
    const totals_controls = totals_span.className.split('wb_')[1]
    if (totals_controls === 'counted') totals_span.textContent = Object.keys(faction_totals).length +' / '+ totals_span.textContent.split('/')[1]
    else totals_span.textContent = warbase_totals[totals_controls] +' / '+ warbase_totals.total
  }
}


const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.className && node.className === 'faction-respect-wars-wp' && !document.querySelector('#wb_filter_wrap')) {
        faction_nodes = {}
        faction_totals = {}
        const faction_main_wrap = document.querySelector('#faction-main')
        const respect_wars_wrap = document.querySelector('#faction-main .faction-respect-wars-wp')
        const wars_UL = respect_wars_wrap.querySelector('.f-war-list')
        const territory_wrap = document.querySelector('#faction-wars-wp')
        let fac_count_total = 0
        for (const faction_tab of respect_wars_wrap.querySelector('.f-war-list').children) {
          if (faction_tab.className !== 'inactive' && faction_tab.className !== 'clear') fac_count_total += 1
        }
//Filter DIV-------------------------------------------------------------------------------------------------------------------------------------
        const filter_DIV = document.createElement('DIV')
        filter_DIV.id = 'wb_filter_wrap'
        filter_DIV.innerHTML =
         `<div class="title-black m-top10 ${filters.filters_collapse ? 'border-round': 'top-round active' }">
            <div class="arrow-wrap">
              <i class="accordion-header-arrow right"></i>
            </div>
            War Base Filters
          </div>
          <div class="cont-gray map-wrap bottom-round " id="warbase_filters">
            <div class="wb_content_left">
              <div class="filter-row">
                <div class="filter-title">Show</div>
                <div class="filter-content">
                  <div class="filter-row">
                    <span><input type="checkbox" class="wbFilter wb_fed">Federal</span>
                    <span><input type="checkbox" class="wbFilter wb_traveling">Traveling</span>
                  </div>
                  <div class="filter-row">
                    <span><input type="checkbox" class="wbFilter wb_online">Online</span>
                    <span><input type="checkbox" class="wbFilter wb_idle">Idle</span>
                    <span><input type="checkbox" class="wbFilter wb_offline">Offline</span>
                  </div>
                  <span></span>
                  <span class="filter-row"><input type="checkbox" class="wbFilter wb_hosp">Hosp/Jail time &lt;&nbsp;<input type="number" class="wbFilter wb_hosp_time" min="0"> minutes</span>
                  <span class="filter-row"><input type="checkbox" class="wbFilter wb_level">Level<input type="number" min="0" max="100" class="wbFilter wb_level_min">to<input type="number" min="0" max="100" class="wbFilter wb_level_max"></span>
                </div>
              </div>
            </div>
            <div class="wb_content_middle">
              <div class="filter_row">
                <div class="wbTotals_col_left">
                  <span class="filter-row wbTotals_title">Factions Loaded:&nbsp;</span>
                  <span class="filter-row wbTotals_title">Enemies Filtered:&nbsp;</span>
                  <span class="filter-row wbTotals_title">Enemies Okay:&nbsp;</span>
                </div>
                <div class="wbTotals_col_right">
                  <span class="filter-row wbTotals wb_counted">0 / ${fac_count_total}</span>
                  <span class="filter-row wbTotals wb_hidden">...</span>
                  <span class="filter-row wbTotals wb_ok">...</span>
                </div>
              </div>
            </div>
            <div class="wb_content_right">
              <span class="filter-row">Extended Warbase<input type="checkbox" class="wbFilter wb_extended"></span>
              <span class="filter-row">Territories on Top<input type="checkbox" class="wbFilter wb_territories_inverted"></span>
              <span class="filter-row">Color Blind Mode<input type="checkbox" class="wbFilter wb_colorblind"></span>
            </div>
          </div>`
        faction_main_wrap.insertBefore(filter_DIV, respect_wars_wrap)
        
//Show/Hide button for respect wars------------------------------------------------------------------------------------------------------------------
        const banner = respect_wars_wrap.querySelector('.f-msg')
        wars_UL.style.display = 'block'
        banner.onclick = () => wars_UL.classList.toggle('wb_hide')

//War Base Extended DIV------------------------------------------------------------------------------------------------------------------------------
        const warlist_DIV = document.createElement('DIV')
        warlist_DIV.id = 'warbase_results'
        warlist_DIV.innerHTML =
         `<div class="title-black m-top10 top-round">War Base Extended</div>
          <div class="cont-gray map-wrap bottom-round">
            <div class="wbResults_placeholder">Updates on faction tab clicks...</div>
            <ul id="wars_extended" class="f-war-list war-old">
              <li class="clear"></li>
            </ul>
          </div>`
        faction_main_wrap.insertBefore(warlist_DIV, territory_wrap)

//Event Listeners for Filter DIV----------------------------------------------------------------------------------------------------------------------
        const wb_filter_title = document.querySelector('#wb_filter_wrap .title-black')
        const wb_filter_content = document.querySelector('#warbase_filters')
        filters.filters_collapse ? wb_filter_content.style.display = 'none': wb_filter_content.style.display = 'flex'
        wb_filter_title.addEventListener('click', (event) => {
          if (filters.filters_collapse) {
            wb_filter_title.classList.add('top-round')
            wb_filter_title.classList.add('active')
            wb_filter_title.classList.remove('border-round')
            wb_filter_content.style.display = 'flex'
            filters.filters_collapse = false
          }
          else {
            wb_filter_title.classList.remove('top-round')
            wb_filter_title.classList.remove('active')
            wb_filter_title.classList.add('border-round')
            wb_filter_content.style.display = 'none'
            filters.filters_collapse = true
          }
          storeFilters()
        })
        
        const filter_inputs = document.querySelectorAll('.wbFilter')
        for (const wbFilter of filter_inputs) {
          const filter_controls = wbFilter.className.split('wb_')[1]
          switch (wbFilter.type) {
            case 'checkbox':
              wbFilter.checked = filters[filter_controls]
              wbFilter.addEventListener('change', (event) => {
                filters[filter_controls] = event.target.checked
                storeFilters()
                switch (filter_controls) {
                  case 'extended':
                    if (event.target.checked) {
                      document.querySelector('#warbase_results').style.display = 'block'
                      wars_UL.classList.add('wb_extended')
                    }
                    else {
                      document.querySelector('#warbase_results').style.display = 'none'
                      wars_UL.classList.remove('wb_extended')
                    }
                    break
                  case 'territories_inverted':
                    if (event.target.checked) faction_main_wrap.insertBefore(territory_wrap, respect_wars_wrap)
                    else {
                      faction_main_wrap.insertBefore(respect_wars_wrap, territory_wrap)
                      faction_main_wrap.insertBefore(document.querySelector('#warbase_results'), territory_wrap)
                    }
                    break
                  case 'colorblind':
                    break
                  default:
                    if (document.querySelector('#faction-main .faction-respect-wars-wp .descriptions')) {
                      run_filters(document.querySelector('#faction-main .faction-respect-wars-wp .descriptions'))
                    }
                    if (Object.keys(faction_nodes).length > 0) {
                      for (const facID of Object.keys(faction_nodes)) {
                        run_filters(faction_nodes[facID])
                      }
                    }
                    break
                }
              })
              break
            case 'number':
              wbFilter.value = filters[filter_controls]
              wbFilter.addEventListener('change', (event) => {
                filters[filter_controls] = event.target.value
                storeFilters()
                switch (filter_controls) {
                  default:
                    if (document.querySelector('#faction-main .faction-respect-wars-wp .descriptions')) {
                      run_filters(document.querySelector('#faction-main .faction-respect-wars-wp .descriptions'))
                    }
                    if (Object.keys(faction_nodes).length > 0) {
                      for (const facID of Object.keys(faction_nodes)) {
                        run_filters(faction_nodes[facID])
                      }
                    }
                    break
                }
              })
              break
            default:
              break
          }
        }
//Set Extended and Territories inverted--------------------------------------------------------------------------------------------------------------------
        if (filters.extended) {
          warlist_DIV.style.display = 'block'
          wars_UL.classList.add('wb_extended')
        }
        if (filters.territories_inverted) faction_main_wrap.insertBefore(territory_wrap, respect_wars_wrap)
      }
//Observing for tabs opening--------------------------------------------------------------------------------------------------------------------------------
      if (node.className && node.className === 'descriptions') {
        if (node.querySelector('.member-list')) {
          const factionID = node.querySelector('.t-blue').href.split('&')[1].replace('=', '')
          
          if (animation_enabled) {
            const faction_link = node.parentElement.querySelector('.act .name .t-blue')
            if (faction_link.className.includes('animation_colorfade')) {
            	faction_link.classList.remove('animation_colorfade')
            	void faction_link.offsetWidth
            }
            faction_link.classList.add('animation_colorfade')
            faction_link.addEventListener("animationend", (anim) => anim.target.classList.remove('animation_colorfade'))
            if (filters['colorblind']) {
              const chain_icon = node.parentElement.querySelector('.act .f-chain')
              if (chain_icon.className.includes('animation_colorblind')) {
            	chain_icon.classList.remove('animation_colorblind')
            	void chain_icon.offsetWidth
              }
              chain_icon.classList.add('animation_colorblind')
              chain_icon.addEventListener("animationend", (anim) => anim.target.classList.remove('animation_colorblind'))
            }
          }
          
          //clone node for extended war base
          const wars_extended = document.querySelector('#wars_extended')
          faction_nodes[factionID] = node.cloneNode(true)
          faction_nodes[factionID].id = factionID
          faction_nodes[factionID].className = 'descriptions-new'
          run_filters(faction_nodes[factionID])
          if (!document.querySelector('#'+factionID)) {
            wars_extended.parentElement.querySelector('.wbResults_placeholder').style.display = 'none'
            wars_extended.insertBefore(faction_nodes[factionID], wars_extended.lastElementChild)
          }
          else {
            wars_extended.replaceChild(faction_nodes[factionID], document.querySelector('#'+factionID))
          }
          run_filters(node)
        }
      }
    }
  }
});

const wrapper = document.querySelector('#faction-main')
observer.observe(wrapper, { subtree: true, childList: true })
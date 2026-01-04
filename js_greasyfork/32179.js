// ==UserScript==
// @name         Faction Hit Watch v4
// @namespace    namespace
// @version      1.4.1
// @description  description
// @author       tos
// @match        *.torn.com/factions.php?step=your*
// @match        *.torn.com/loader2.php*
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/32179/Faction%20Hit%20Watch%20v4.user.js
// @updateURL https://update.greasyfork.org/scripts/32179/Faction%20Hit%20Watch%20v4.meta.js
// ==/UserScript==

GM_addStyle(`
  #hit_watch {
    display: flex;
    flex-wrap: wrap;
    position: absolute;
  }
  
  #hit_watch input {
    background: transparent;
    border-bottom: 2px solid black;
    border-radius: 0;
    line-height: 25px;
    text-align: center;
    font-weight: bold;
    width: 60px;
  }
  
  #hit_watch button {
    border: none;
    border-radius: 7px;
    height: 25px;
    margin: 3px;
    padding: 3px 5px;
    text-align: center;
    text-decoration: none;
  }
  
  .hw_controls {
    align-content: center;
    padding: 5px;
  }
  .hw_controls label {
    font-weight: 600;
    font-size: 110%;
  }
  .hw_api_button {
    background-color: green;
    color: white;
  }
  .hw_api_refresh {
    background: transparent;
    color: #7f7f7f;
    cursor: pointer;
  }
  .hw_api_refresh i{
    display: inline-flex;
    vertical-align: middle;
    background: url(/images/v2/forums/reply_form_reset.png?v=1502196905656) no-repeat;
    height: 17px;
    width: 19px;
    margin: 0 3px;
  }
  .hw_api_refresh:hover {
    color: #333;
  }
  .hw_api_refresh:hover i {
    background-position: -19px 0;
  }
  
  .hw_retal_title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #2e2e2e;
    color: white;
    font-size: 120%;
    padding-left: 5px;
    height: 24px;
    width: 100%;
  }
  .hw_retal_title i {
    margin: 1px 4px 0 0;
  }
  .hw_retal_title.active i {
    margin: 4px 4px 0 0;
  }
  .hw_retal_controls {
    display: none;
    padding: 5px;
  }
  
  .hw_progress_bar {
    background-color: #838383;
    margin: 0 0 4px 0;
    width: 100%;
  }
  .hw_progress {
    background-color: #5e5e5e;
    height: 7px;
    width: 100%;
  }
  
  .hw_loading {
    display: none;
    text-align: center;
    width: 100%;
  }
  
  .hw_api_error {
    display: none;
    text-align: center;
    width: 100%;
  }
  .hw_api_error label {
    display: none;
    font-weight: bold;
  }
  #hw_invalid_api {
    display: none;
    width: 90px !important;
  }
  
  .hw_hit_list {
    padding: 5px;
  }
  .hw_hit_list li {
    margin: 4px 0;
  }
  .hw_hit_list a {
    color: inherit;
    font-weight: bold;
    text-decoration: none;
  }
  
  .incoming_hit {
    color: #bd8686;
  }
  .outgoing_hit {
    color: #9a9a9a;
  }
  .retal_hit {
    color: #b42e2e;
  }
  .bonus_hit {
    color: #4d7c1e;
    font-size: 110%;
    font-weight: 500;
  }
`)

const path = window.location.pathname
let APIkey = localStorage.getItem('torn_apiKey') || 'blank'
let API_rate = localStorage.getItem('torn_apiRate') || 20

let logged_attacks = []
let members_list = []
let retal_list = []

let api_interval = false
let api_animate = false

const get_api = async (section = 'faction', id = '', selections = ['attacknews'], key = APIkey) => {
  const response = await fetch(`https://api.torn.com/faction/${id}?selections=${selections.join(',')}&key=${key}`)
  return await response.json()
}

const api_error = (err) => {
  if (api_interval) {
    api_stop()
    document.querySelector('.hw_api_button').style.backgroundColor = 'green'
    document.querySelector('.hw_api_button').innerText = 'Start'
  }
  document.querySelector('.hw_api_error').style.display = 'block'
  document.querySelector('.hw_api_error p').innerText = `Error ${err.code}: ${err.error}`
  switch (err.code) {
    case 1:
    case 2:
    case 11:
    case 12:
      document.querySelector('.hw_api_error label').style.display = 'inline-block'
      document.querySelector('.hw_api_error input').style.display = 'inline-block'
      break
    case 7:
      document.querySelector('.hw_api_error p').insertAdjacentHTML('afterend', `
        <strong>Faction API access is required for this tool.</strong><br />
        <strong>Contact your faction leader or co-leader for access.</strong>
      `)
    default:
      document.querySelector('.hw_api_error label').style.display = 'none'
      document.querySelector('.hw_api_error input').style.display = 'none'
      break
  }
  //console.log(err)
  return
}

const _resize = () => {
  const content = document.querySelector('.content')
  const container = content.querySelector('.container')
  document.querySelector('#hit_watch').style.width = ((content.offsetWidth - container.offsetWidth)/2).toFixed(0) +'px'
}

const api_start = () => {
  if(api_interval) clearInterval(api_interval)
  api_interval = setInterval(() => {
    get_api().then((r) => {
      if (r.error) {
        api_error(r.error)
        return
      }
      parse_attacknews(r.attacknews)
    })
  }, API_rate * 1000)
  api_animate = document.querySelector('.hw_progress').animate(
    [{ width: '0%' },{ width: '100%' }],
    {duration: API_rate * 1000, iterations: Infinity}
  )
}

const api_stop = () => {
  if(api_interval) clearInterval(api_interval)
  api_interval = false
  if(api_animate) api_animate.pause()
  api_animate = false
}

const _insert_hwDIV = () => {
  document.querySelector('.content').insertAdjacentHTML('afterbegin', `
    <div id="hit_watch">
      <div class="hw_controls">
        <label for="hw_api_rate">API Interval (sec):</label>
        <input id="hw_api_rate" type="number" min="3" value="${API_rate}">
        <button class="hw_api_button">Start</button>
        <button class="hw_api_refresh"><i></i>Refresh</button>
      </div>
      <div class="hw_retal_title">Retal Watch<i class="tc-menu-arrow right"></i></div>
      <div class="hw_retal_controls">
        <label for="hw_retal_other">Faction ID:</label>
        <input id="hw_retal_other" type="text">
      </div>
      <div class="hw_progress_bar"><div class="hw_progress"></div></div>
      <div class="hw_loading"><img src="/images/v2/main/ajax-loader.gif"></div>
      <div class="hw_api_error">
        <p>Test text for what happens when shit is wrong</p>
        <label for="hw_invalid_api:">Enter API key:</label>
        <input id="hw_invalid_api" type="text" value="${APIkey}">
      </div>
      <ul class="hw_hit_list"></ul>
    </div>
  `)
}

const _add_listeners = () => {
  //Event Listener for window resize
  let timeout = false
  window.addEventListener('resize', () => {
    clearTimeout(timeout)
    timeout = setTimeout(_resize, 1000)
  })
  document.querySelector('#hw_api_rate').addEventListener('change', (e) => {
    API_rate = e.target.value
    localStorage.setItem('torn_apiRate', API_rate)
    if (api_interval) {
      api_stop()
      api_start()
    }
  })
  document.querySelector('.hw_api_button').addEventListener('click', (e) => {
    if (api_interval) {
      api_stop()
      e.target.style.backgroundColor = 'green'
      e.target.innerText = 'Start'
    }
    else {
      api_start()
      e.target.style.backgroundColor = 'red'
      e.target.innerText = 'Stop'
    }
  })
  document.querySelector('.hw_api_refresh').addEventListener('click', (e) => {
    loading_gif.style.display = 'block'
    get_api().then((r) => {
      loading_gif.style.display = 'none'
      if (r.error) {
        api_error(r.error)
        return
      }
      parse_attacknews(r.attacknews)
    })
    if (api_interval) {
      api_stop()
      api_start()
    }
  })
  document.querySelector('.hw_retal_title').addEventListener('click', (e) => {
    if (e.target.className.includes('active')) document.querySelector('.hw_retal_controls').style.display = 'none'
    else document.querySelector('.hw_retal_controls').style.display = 'flex'
    e.target.classList.toggle('active')
    
  })
  document.querySelector('#hw_invalid_api').addEventListener('change', (e) => {
    APIkey = e.target.value
    localStorage.setItem('torn_apiKey', APIkey)
    document.querySelector('.hw_api_error').style.display = 'none'
    initialize_hw()
  })
}

const parse_attacknews = (resObj) => {
  for (const attackID of Object.keys(resObj)) {
    if (logged_attacks.indexOf(attackID) < 0) {
      const news = resObj[attackID].news
      const t = resObj[attackID].timestamp
      let hit_type = ''
      
      if (1 < news.split('<a').length < 4) {
        let defenderID = 0
        if (news.split('<a').length === 2) {
          try{ defenderID = news.split('<a')[1].split('?XID=')[1].split('\">')[0] }
          catch (err) {
            //do nothing
          }
        }
        else {
          try{ defenderID = news.split('<a')[2].split('?XID=')[1].split('\"')[0] }
          catch (err) {
            //do nothing
          }
        }
        if (members_list.indexOf(defenderID) !== -1) {
          if (news.includes('hospitalized')) hit_type = 'retal_hit'
          else hit_type = 'incoming_hit'
        }
        else {
          let respectGained = 0
          try { respectGained = parseFloat(news.split('(')[1].split(')')[0]) }
          catch (err) {
            //console.log(err)
          }
          finally {
            if (respectGained > 10) hit_type = 'bonus_hit'
            else if (respectGained > 4) hit_type = 'chain_hit'
            else hit_type = 'outgoing_hit'
          }
        }
      }
      else {
        console.log('bad else:', news)
        hit_type = 'outgoing_hit'
      }
      document.querySelector('.hw_hit_list').insertAdjacentHTML('afterbegin', `
        <li class="${hit_type}">${(new Date(t * 1000)).toUTCString().split(' ')[4] +' '+ news}</li>
      `)
      logged_attacks.push(attackID)
    }
  }
}

const initialize_hw = () => {
  loading_gif.style.display = 'block'
  get_api('faction','',['attacknews', 'basic']).then((r) => {
    loading_gif.style.display = 'none'
    if (r.error) {
      api_error(r.error)
      return
    }
    members_list = Object.keys(r.members)
    localStorage.setItem('torn_myFac_members', members_list)
    parse_attacknews(r.attacknews)
  })
}
_insert_hwDIV()
const loading_gif = document.querySelector('.hw_loading')
_resize()
_add_listeners()

if (path ==='/factions.php') initialize_hw()
else if (path ==='/loader2.php') {
  members_list = localStorage.getItem('torn_myFac_members')
  document.querySelector('.hw_controls label').style.display = 'none'
  document.querySelector('.hw_controls input').style.display = 'none'
  document.querySelector('.hw_controls button').style.display = 'none'
}





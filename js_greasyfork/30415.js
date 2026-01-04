// ==UserScript==
// @name         Faction Hit Watch v3
// @namespace    namespace
// @version      0.2
// @description  description
// @author       tos
// @match        *.torn.com/factions.php?step=your*
// @match        *.torn.com/loader2.php*
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/30415/Faction%20Hit%20Watch%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/30415/Faction%20Hit%20Watch%20v3.meta.js
// ==/UserScript==

let api_rate = 20; //DEFAULT API CALL RATE (seconds)

//const pathname = window.location.pathname
//[type=number]

GM_addStyle(`
    #chainerDIV {
      margin: 5px;
      position: absolute;}
    
    #chainerDIV a {
      text-decoration: none;
      color:inherit;
      font-weight: bold;}
    
    #chainerDIV li {
      padding: 4px 0px;}
    
    #chainerDIV label{
      padding: 0px 0px 0px 5px;
      font-weight: bold;}
    
    #chainerDIV input {
      background: transparent;
      border-bottom: 2px solid black;
      border-radius: 0px;
      line-height: 25px;
      margin: 3px 5px 3px 0px;
      text-align: center;
      font-weight: bold;
      width: 60px;}
    
    #chainerDIV .api_BUTTON {
      display: inline-flex;
      border: none;
      border-radius: 20px;
      color: white;
      padding: 6px 12px;
      text-align: center;
      text-decoration: none;}
    
    #chainerDIV .progressBar {
      width: 100%;
      margin: 4px 0px 4px -5px;
      background-color: #838383;}
    
    #chainerDIV .progress {
      width: 100%;
      height: 7px;
      background-color: #5e5e5e;}
    
    #chainerDIV .invalid_APIkey_DIV{
      display: none;
      align-items: center;
      justify-content: center;}
    
    #chainerDIV .invalid_APIkey_INPUT{
      width: 75px;}
      
    #chainerDIV .api_error_DIV{
      display: flex;
      padding: 5px;}
    
    #chainerDIV .incoming-hit {
      color: #bd8686;}
    
    #chainerDIV .outgoing-hit {
      color: #9a9a9a;}
    
    #chainerDIV .chain-hit {
      color: #000000;}
    
    #chainerDIV .retal-hit {
      color: #b42e2e;}
    
    #chainerDIV .bonus-hit {
      color: #4d7c1e;
      font-size: 110%;
      font-weight: 500;}
`);

let APIkey = localStorage.getItem('torn_apiKey') || 'blank'

const fetch_bars = () => {
      fetch('https://api.torn.com/user/?selections=bars&key='+ APIkey).then(
          (response) => response.json().then((JSONdata) => {
              //console.log(JSONdata)
          }
      ))
}

const fetch_faction_info = () => {
      fetch('https://api.torn.com/faction/?selections=attacknews,basic&key='+ APIkey).then(
          (response) => response.json().then((JSONdata) => {
              if(!JSONdata.ID) {
                  api_error(JSONdata)
                  return
              }
              faction = JSONdata
              delete faction.attacks
              parseAttackNews(JSONdata)
          }
      ))
}

//let callCount = 0
const fetch_attacks = () => {
    fetch('https://api.torn.com/faction/?selections=attacknews&key='+ APIkey).then(
        (response) => response.json().then((JSONdata) => {
            //console.log('api call: ', callCount)
            //callCount +=1
            parseAttackNews(JSONdata)
        }
    ))
}

const api_start = () => {
    clearInterval(api_interval)
    const api_BUTTON = document.querySelector('#chainerDIV .api_BUTTON')
    const chainerDIV_progress = document.querySelector('#chainerDIV .progress')
    api_BUTTON.style.backgroundColor = '#c30000'
    api_BUTTON.innerText = 'Stop!'
    
    api_interval = setInterval(fetch_attacks, api_rate * 1000)
    api_animate = chainerDIV_progress.animate(
        [{ width: '0%' },{ width: '100%' }],
        {duration: api_rate * 1000, iterations: Infinity}
    )
}
const api_stop = () => {
    clearInterval(api_interval)
    api_interval = false
    api_animate.pause()
    api_animate = false
    const api_BUTTON = document.querySelector('#chainerDIV .api_BUTTON')
    api_BUTTON.style.backgroundColor = '#097210'
    api_BUTTON.innerText = 'Start'
}


//build container for output
const buildChainerDiv = () => {
    const container = document.querySelector('.content')
    const mainContainer = document.querySelector('#mainContainer')

    const chainerDIV = document.createElement('div')
    chainerDIV.id = 'chainerDIV'

//INPUT
    const api_rate_LABEL = document.createElement('LABEL')
    api_rate_LABEL.innerText = 'API refresh (sec):'
    api_rate_LABEL.for = 'api_rate_INPUT'
    chainerDIV.append(api_rate_LABEL)
    const api_rate_INPUT = document.createElement('INPUT')
    api_rate_INPUT.id = 'api_rate_INPUT'
    api_rate_INPUT.type = 'number'
    api_rate_INPUT.min = 5
    api_rate_INPUT.value = api_rate
    chainerDIV.append(api_rate_INPUT)
    api_rate_INPUT.onchange = () => {
        if(api_rate_INPUT.value < 5){api_rate_INPUT.value = 5}
        api_rate = api_rate_INPUT.value
        if(api_interval) {
            api_stop()
        }
        api_start()
    }

//BUTTON
    const api_BUTTON = document.createElement('BUTTON')
    api_BUTTON.className = 'api_BUTTON'
    api_BUTTON.style.backgroundColor = '#097210'
    api_BUTTON.innerText = 'Start'
    api_BUTTON.onclick = () => {
        if(api_interval) {
            api_stop()
        }
        else {
            api_start()
        }
    }
    chainerDIV.append(api_BUTTON)

//PROGRESS BAR
    const chainerDIV_progressBar = document.createElement('DIV')
    chainerDIV_progressBar.className = 'progressBar'
    chainerDIV.append(chainerDIV_progressBar)
    const chainerDIV_progress = document.createElement('DIV')
    chainerDIV_progress.className = 'progress'
    chainerDIV_progressBar.append(chainerDIV_progress)

//INVAILD API INPUT
    const invalid_DIV = document.createElement('DIV')
    invalid_DIV.className = 'invalid_APIkey_DIV'
    chainerDIV.append(invalid_DIV)
    
    const invalid_LABEL = document.createElement('P')
    invalid_LABEL.innerText = 'Enter a valid API key to continue...'
    invalid_LABEL.for = 'invAPIkey'
    invalid_DIV.append(invalid_LABEL)
    const invalid_INPUT = document.createElement('INPUT')
    invalid_INPUT.id = 'invAPIkey'
    invalid_INPUT.className = 'invalid_APIkey_INPUT'
    invalid_INPUT.type = 'text'
    invalid_INPUT.setAttribute('placeholder', 'API key')
    invalid_DIV.append(invalid_INPUT)

//HIT-LIST
    const hitList = document.createElement('UL')
    hitList.className = 'hit-list'
    chainerDIV.append(hitList)
    container.insertBefore(chainerDIV, mainContainer)
}

//Resize output container to fit screen
const resizeDIV = () => {
    const contentWrap = document.querySelector('.content')
    const mainContainer = document.querySelector('#mainContainer')
    const marginSpace = ((contentWrap.offsetWidth - mainContainer.offsetWidth) / 2).toFixed(1)
    const chainerDiv = document.querySelector('#chainerDIV')
    const chainerwidth = marginSpace +'px'
    chainerDiv.style.width = chainerwidth
}

//Event Listener for window resize
let timeout = false
window.addEventListener('resize', () => {
  clearTimeout(timeout)
  timeout = setTimeout(resizeDIV, 1000)
})


let api_interval = false
let api_animate = false
let faction = {}
let loggedAttacks = {}
let last_chain_hit = 0
buildChainerDiv()
resizeDIV()
fetch_faction_info()












//Parse for unlogged attacks
function parseAttackNews(res) {
    for(const attackID of Object.keys(res.attacknews)){
        if(!loggedAttacks[attackID]){
            loggedAttacks[attackID] = res.attacknews[attackID]
            printAttack(res.attacknews[attackID])
        }
    }
}

//Format and prepend new attacks
function printAttack(response){
    var hit_list = document.querySelector('#chainerDIV .hit-list')
    var timestamp = response.timestamp
    var news = response.news
    
    var new_LI = document.createElement('LI')
    new_LI.innerHTML = (new Date(timestamp * 1000)).toUTCString().split(' ')[4] + ' ' + news
    new_LI.className = 'outgoing-hit'
    //new_LI.style.padding = '2px 5px 3px 5px'
    
    if (timestamp - last_chain_hit > 305) {
        chain_count = 0
    }
    
    if (news.includes('Chain #')) {
        chain_count = parseInt(news.split('#')[1].split(' ')[0])
        new_LI.className = 'bonus-hit'
        new_LI.innerHTML = news
    }
    else if (news.includes('respect)')) {
        last_chain_hit = timestamp
        new_LI.className = 'chain-hit'
        new_LI.insertAdjacentHTML("afterbegin", chain_count.toString() + '... ')
        chain_count += 1
    }
    else if (1 < news.split('<a').length < 4) {
        let defenderID = 0
        if ( news.split('<a').length === 2) {
            defenderID = news.split('<a')[1].split('?XID=')[1].split('>')[0]
        }
        else {
            defenderID = news.split('<a')[2].split('?XID=')[1].split('>')[0]
        }
        
        if (faction.members[defenderID]) {
            if (news.includes('hospitalized')) {
                new_LI.className = 'retal-hit'
            }
            else {
                new_LI.className = 'incoming-hit'
            }
        }
    }
    hit_list.prepend(new_LI)
}


function api_error(res) {
    if(res.error) {
      if (!res.error.code) {return}
      const  error_DIV = document.createElement('DIV')
      error_DIV.className = 'api_error_DIV'
      switch (res.error.code) {
        case 1:
        case 2:
          const new_APIkey = document.querySelector('#chainerDIV .invalid_APIkey_DIV')
          const new_API_INPUT = new_APIkey.querySelector('.invalid_APIkey_INPUT')
          new_API_INPUT.onchange = () => {
            localStorage.setItem('torn_apiKey', new_API_INPUT.value)
            APIkey = new_API_INPUT.value
            fetch_faction_info()
            new_APIkey.style.display = 'none'
          }
          new_APIkey.style.display = 'flex'
          //console.log('invalid key')
          break  
        default:
          error_DIV.innerText = res.error.error
          document.querySelector('#chainerDIV').append(error_DIV)
          break
    }
}
}
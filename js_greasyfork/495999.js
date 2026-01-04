// ==UserScript==
// @name         Better RW Info
// @namespace    ViolentMonkey scripts
// @version      1.3
// @description  More and clearer info on faction RW page. Required API key. Modified from 'war stuff" script by tos
// @author       _los_
// @match        https://www.torn.com/factions.php*
// @license      MIT
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/495999/Better%20RW%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/495999/Better%20RW%20Info.meta.js
// ==/UserScript==

class Utils {
  static async sleep(ms) {
    return new Promise(e => setTimeout(e, ms));
  }
  //to do: move "wait for element" function to a class here.
}

//to do: on-screen api setting, stored in localStorage, returning API input box or "API OK"
const APIKEY = 'API_KEY' //public is fine
console.log("tornstatskey: ", localStorage.APIKey)
const sort_enemies = true //optional -- sort enemies by status if true
const sort_team = true //optional -- sort team by status if true

function updateAll() {
  waitForElementToExist('div.faction-war').then(async function () {
    let warArea = document.querySelector('div.faction-war')
    const enemyList = warArea.querySelectorAll('li.enemy')
    const teamList = warArea.querySelectorAll('li.your')

    const enemyFactionID = enemyList[0].querySelector(`A[href^='/factions.php']`).href.split('ID=')[1]
    const teamFactionID = teamList[0].querySelector(`A[href^='/factions.php']`).href.split('ID=')[1]

    const enemyFactionInfo = await fetch(`https://api.torn.com/faction/${enemyFactionID}?selections=basic&key=${APIKEY}`).then(r => r.json()).catch(console.error)
    const teamFactionInfo = await fetch(`https://api.torn.com/faction/${teamFactionID}?selections=basic&key=${APIKEY}`).then(r => r.json()).catch(console.error)

    enemyList.forEach((li) => {
      let warriorID = li.querySelector(`A[href^='/profiles.php']`).href.split('ID=')[1]
      let warriorInfo = enemyFactionInfo.members[warriorID]
      updateWarrior(li, warriorInfo)
    })

    teamList.forEach((li) => {
      let warriorID = li.querySelector(`A[href^='/profiles.php']`).href.split('ID=')[1]
      let warriorInfo = teamFactionInfo.members[warriorID]

      updateWarrior(li, warriorInfo)
    })

  })
}

//do it once when page loads
updateAll()

//watch for mutations, looking for ones that change status
let observer = new MutationObserver(mutationRecords => {
  // console.log("mutationRecords: ", mutationRecords)
  for (let mutation of mutationRecords) {
    for (let addedNodes of mutation.addedNodes) {
      if (addedNodes.classList) {
        console.log("addedNodes classList: ", addedNodes.classList)
        console.log("addedNodes attributes: ", addedNodes.attributes)
        //check to see if the mutation is either of the ones we've found that change status
        if (addedNodes.classList.contains('t-blue') || addedNodes.classList.contains('t-gray-9')) {
          //find the list item for the warrior whose status changed
          let warrior_li = addedNodes.closest('li')
          //and send it off to the fun part
          getWarriorInfo(warrior_li)
        }
      }
    }
  }
})




//refresh the whole thing every 6 seconds
//10 api calls per minute, plus one api call for every status change, should stay
//under 100 limit for most situations. could become an on-screen setting later.

setInterval(() => { updateAll() }, 6000)


async function getWarriorInfo(li) {
  //this part gets the warrior's status
  // let warriorFaction = li.querySelector(`A[href^='/factions.php']`).href.split('ID=')[1]
  let warriorID = li.querySelector(`A[href^='/profiles.php']`).href.split('ID=')[1]
  let warriorInfo = await fetch (`https://api.torn.com/user/${warriorID}?selections=basic&key=${APIKEY}`).then(r => r.json()).catch(console.error)

  // console.log("Warrior's Faction ID: ", warriorFaction)
  // let factionInfo = await fetch(`https://api.torn.com/faction/${warriorFaction}?selections=basic&key=${APIKEY}`).then(r => r.json()).catch(console.error)
  // console.log("Warrior's Faction Info: ", factionInfo)
  // updateWarrior(li, factionInfo)
  updateWarrior(li, warriorInfo)
}

//processes and updates per warrior
function updateWarrior(li, warriorInfo) {
// function updateWarrior(li, factionInfo) {
  observer.disconnect()

  // let warriorID = li.querySelector(`A[href^='/profiles.php']`).href.split('ID=')[1]
  // let warriorName = factionInfo.members[warriorID].name
  // let warriorStatus = factionInfo.members[warriorID].status
  let warriorName = warriorInfo.name
  let warriorStatus = warriorInfo.status
  console.log("Name: ", warriorName, " ||| Status: ", warriorStatus)

  //we start setting attributes
  warriorStatus.short = warriorStatus.description.replace('Mexico', 'MEX').replace('Cayman Islands', 'CAY').replace('Canada', 'CAN').replace('Hawaii', 'HAW').replace('United Kingdom', 'UK').replace('Argentina', 'ARG').replace('Switzerland', 'SWI').replace('Japan', 'JAP').replace('China', 'CHI').replace('South Africa', 'SA')
  li.setAttribute('data-until', warriorStatus.until)
  let statusDiv = li.querySelector('div.status')

  //desired order: okay (0), hospital (1), returning (2), abroad (3), traveling to (4)
  //check to see what the state of the status
  switch (warriorStatus.state) {
    //if they're Okay
    case "Okay":
      li.setAttribute("sortOrder", "0")
      statusDiv.style.backgroundColor = 'transparent'
      break

    //if they're Abroad
    case "Abroad":
      li.setAttribute("sortOrder", "3")
      statusDiv.innerText = warriorStatus.short.split("In ")[1]
      statusDiv.style.backgroundColor = 'transparent'

      break

    //if they're Traveling
    case "Traveling":
      if (warriorStatus.description.includes('Traveling to ')) {
        li.setAttribute("sortOrder", "4")
        statusDiv.innerText = '► ' + warriorStatus.short.split('Traveling to ')[1]
      }
      if (warriorStatus.description.includes('Returning')) {
        li.setAttribute("sortOrder", "2")
        statusDiv.innerText = '◄ ' + warriorStatus.short.split('Returning to Torn from ')[1]
      }
      statusDiv.style.backgroundColor = 'transparent'

      break

    //if they're in the Hospital
    case 'Hospital':
      li.setAttribute("sortOrder", "1")

      //add location
      let warriorHospLocation = " "
      if (warriorStatus.description.includes('Mexican')) {
        warriorHospLocation = "MEX•"
      }
      else if (warriorStatus.description.includes('Canadian')) {
        warriorHospLocation = "CAN•"
      }
      else if (warriorStatus.description.includes('Hawaiian')) {
        warriorHospLocation = "HAW•"
      }
      else if (warriorStatus.description.includes('Argentinian')) {
        warriorHospLocation = "ARG•"
      }
      else if (warriorStatus.description.includes('Swiss')) {
        warriorHospLocation = "SWI•"
      }
      else if (warriorStatus.description.includes('Japanese')) {
        warriorHospLocation = "JAP•"
      }
      else if (warriorStatus.description.includes('Chinese')) {
        warriorHospLocation = "CHI•"
      }
      else if (warriorStatus.description.includes('Emirati')) {
        warriorHospLocation = "UAE•"
      }
      else if (warriorStatus.description.includes('South African')) {
        warriorHospLocation = "SA•"
      }
      //end add location

      //do clock stuff
      let dischargeTime = new Date(warriorStatus.until*1000)
      const h = dischargeTime.getUTCHours().toString().padStart(2, '0')
      const m = dischargeTime.getUTCMinutes().toString().padStart(2, '0')
      const s = dischargeTime.getUTCSeconds().toString().padStart(2, '0')
      const timeString = `${h}:${m}:${s}`
      const hospTimeRemaining = Math.round(warriorStatus.until - (new Date().getTime() / 1000))
      statusDiv.innerText = warriorHospLocation + timeString

      if (hospTimeRemaining < 60 && hospTimeRemaining > 0) {
        //statusDiv.innerText = timeString//hosp_time_remaining + 's'
        statusDiv.style.backgroundColor = '#afa'
      } else {
        statusDiv.style.backgroundColor = 'transparent'
      }
      break

    //default behavior
    default:
      li.setAttribute("sortOrder", "0")
      statusDiv.style.backgroundColor = 'transparent'
      break
  }

  sort()
}
//sorting function
function sort() {
//starts with observer stopped from update function
  let warArea = document.querySelector('div.faction-war')

  const enemyList = warArea.querySelectorAll('li.enemy')
  const teamList = warArea.querySelectorAll('li.your')

    if (sort_enemies) {
      const enemy_UL = document.querySelector('LI.enemy').closest('UL.members-list')
      Array.from(enemyList).sort((a, b) => {
        return a.getAttribute('sortOrder') - b.getAttribute('sortOrder') || a.getAttribute('data-until') - b.getAttribute('data-until')
      }).forEach(li => enemy_UL.appendChild(li))
    }

    if (sort_team) {
      const team_UL = document.querySelector('LI.your').closest('UL.members-list')
      Array.from(teamList).sort((a, b) => {
        return a.getAttribute('sortOrder') - b.getAttribute('sortOrder') || a.getAttribute('data-until') - b.getAttribute('data-until')
      }).forEach(li => team_UL.appendChild(li))
    }
  //restart the observer
  observeChanges()
}



function checkRevives() {
  const reviveDiv = document.querySelector(".faction-war")
  var enemyWarriors = reviveDiv.querySelectorAll('LI.enemy')
  var teamWarriors = reviveDiv.querySelectorAll('LI.your')

  enemyWarriors.forEach((li) => {
    check(li)
  })
  teamWarriors.forEach((li) => {
    check(li)
  })
  // document.querySelector("#revivable-div").append(`${revivables} able to be revived`)

}
//checks for revive status
async function check(item) {
  const name_DIV = item.querySelector('DIV.member')
  const warrior_id = item.querySelector(`A[href^='/profiles.php']`).href.split('ID=')[1]
  const warrior_profile = await fetch(`https://api.torn.com/user/${warrior_id}?key=${APIKEY}&selections=profile`)
    .then(r => r.json())
    .catch(console.error)
    .then(await Utils.sleep(500))

  const warrior_revivable = warrior_profile.revivable
  console.log(warrior_revivable)
  if (warrior_revivable == 1) {
    name_DIV.textContent += "(R)"
  }
}


// a utility element that I should move to the right class
function waitForElementToExist(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector))
        }

        const observer = new MutationObserver(() => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector))
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            subtree: true,
            childList: true,
        })
    })
}


//the routine that kicks the observer off
const observeChanges = () => {
  waitForElementToExist('.faction-war').then (() => {
    const watchedNode = document.querySelector('div.faction-war')
    console.log("Beginning Observation (Staying Vigilant)")
    observer.observe(watchedNode, { childList: true, subtree: true })

  })

    // observer.observe(watchedNode, { childList: true, subtree: true })
}

observeChanges()
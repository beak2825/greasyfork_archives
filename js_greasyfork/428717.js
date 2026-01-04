// ==UserScript==
// @name         eSim Event Leaderboard
// @namespace    eSim-Events
// @version      0.9.1
// @description  See the Leaderboard of an e-sim Tournament
// @author       gg
// @include      https://*.e-sim.org/tournamentEvent.html?id=*
// @include      https://*.e-sim.org/teamTournament.html?id=*
// @include      https://*.e-sim.org/countryTournament.html?id=*
// @icon         https://cdn.discordapp.com/icons/316566483021070356/cfffdee309ec53078e9a9698ec4eef42.png?size=256
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428717/eSim%20Event%20Leaderboard.user.js
// @updateURL https://update.greasyfork.org/scripts/428717/eSim%20Event%20Leaderboard.meta.js
// ==/UserScript==

// I could only test finished Events, there were no running Events on any Server
// ! If you are running it for Country Tournament results, make sure you are on the 'SCHEDULER' TAB (/countryTournament.html?id=37#slideShedule)
// Country Tournaments have a lot Battles, therefore it takes much longer than other Events, however,
// if the Status color is not changing for +5s either your Internet or the E-sim is slow.

// Global variables
const eventBattleIds = [] // This will store all the Battle ids the Event has [ 7732, 7733, ...]
const jsonEventResults = {} // This will store all Player that have participated {123(Player Id): Object { damage: 123456, q5Weapons: 1234 }}
let newTab // pre-defining the new Tab that will be opened
let indexStatus = 0 // Index for color changing

// sleep function
function delay (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

(function () {
  // create and place Button, then wait for button press and call main func
  const btn = document.createElement('BUTTON')
  const place = document.getElementsByClassName('testDivwhite')[0]
  place.after(btn)
  btn.style = 'font-size: 15px'
  btn.innerText = 'Leaderboard'
  btn.addEventListener('click', function () {
    main()
  })
})()

// This function will get called when the Button is pressed.
async function main () {
  // Try to find all Battlinks.
  if ((await findAllBattleLinks()) !== false) {
    // The function findAllBattleLinks didn't return false. which means battle links have been found successfully
    createNewTabAndWriteHTML() // Create a new Empty Tab inject some HTML
    // Loop through every Battle
    for (let index = 0; index < eventBattleIds.length; index++) {
      const battleId = eventBattleIds[index]
      await calcDamageDoneInBattle(battleId) // Check which Player hit in that Battle and how much damage they have done.
    }
    // All Battle have been looped through. Now sort the Array, highest dmg first.
    // copied from https://stackoverflow.com/questions/1069666/sorting-object-property-by-values
    const sortable = []
    for (const player in jsonEventResults) {
      sortable.push([
        player,
        jsonEventResults[player].damage,
        jsonEventResults[player].q5Weapons,
        jsonEventResults[player].q1Weapons
      ])
    }
    sortable.sort(function (a, b) {
      return b[1] - a[1]
    })
    // Now update the new Tab with the sorted results
    await updateLeaderboard(sortable)
  } else {
    // No Battle links could be found > raise an Alert
    alert(
      'Do not press the Button before the Page has fully loaded and make sure that you are on the page where you self can see the Battles.\nFor County Tournament it should be the "SCHEDULER" Tab'
    )
  }
}

async function findAllBattleLinks () {
  // Find all elements <a class="battle-links" href="/battle.html?id=123">
  let arrayOfBattleLinkElements = document.querySelectorAll('.battle-link')
  /*
    Some Events are coded different than others...
    If no Battles could be find with 'battle-link' class names, it will instead
    look for elements with 'cup-final-scores' class Names
    Note: This option can find elements that aren't Battle link
  */
  if (arrayOfBattleLinkElements.length === 0) {
    const cupTable = document.getElementsByClassName('cup-final-scores')[0]
    // If this also doesn't find anything it will stop here and raise an Alert
    if (cupTable === undefined) {
      return false
    }

    arrayOfBattleLinkElements = cupTable.getElementsByTagName('a')
  }
  /*
  Loop through all elements in the Array and get their href link
  Check if it starts with 'battle.html?id=' and if so,
  remove that part, which leaves only the id behind.
  Finally, append the id to eventBattleIds
   */
  for (const element of arrayOfBattleLinkElements) {
    const link = element.getAttribute('href')
    if (link.startsWith('battle')) {
      const battleId = link.replace('battle.html?id=', '')
      if (!eventBattleIds.includes(battleId)) {
        eventBattleIds.push(battleId)
      }
    }
  }
  // If none of the elements were battleLinks -> stop here and raise an Alert
  if (eventBattleIds.length === 0) {
    return false
  }
  // Sort the eventBattleIds Array
  eventBattleIds.sort(function (a, b) {
    return a - b
  })
}

function createNewTabAndWriteHTML () {
  newTab = window.open('') // open a blank tab
  let title
  // Change the Tab Title to the Event Type. (Again, eSim has been coded so terribly that I need to do try-catch..)
  try {
    title = document.getElementsByTagName('h1')[1].innerText
  } catch {
    title = document.getElementsByClassName('tournament-state-info')[0]
      .innerText
  }
  // ? https://forum.freecodecamp.org/t/how-to-open-a-blank-tab-and-insert-js/158289/3
  // ? Doesn't seem to be the so great, but works for now.
  // TODO figure something else out
  newTab.document.write(`
  <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<style>
    h1 {
        display: inline-block;
        margin-right: 5px;
    }

    #dot {
        height: 25px;
        width: 25px;
        background-color: white;
        border-radius: 50%;
        display: inline-block;
    }
</style>

<body style="text-align: center; background-color: #333333; color:white">
    <div id="info">Important:<br />If the Status Color is changing, the script is still running<br />
    If the Colors don't change, the Server/your Internet might be slow<br/> 
    Do <strong style="color: red">not</strong> refresh any e-sim page.
        <br />Do <strong style="color: red">not</strong> fight.
    </div>
    <div style="text-align:center">
        <h1>Status: </h1>
        <span id="dot"></span>
    </div>
    <h1>Rankings</h1>
    <table id="leaderboard" style="margin: auto;">
        <tr id="table-header">
            <th>#</th>
            <th>Player</th>
            <th>Damage</th>
            <th>Q5 Weapons</th>
            <th>Q1 Weapons</th>
        </tr>
    </table>
</body>

</html>`)
  newTab.document.title = title
}
/*
  Check all hits done in a Battle. Add up how much damage every Player did and how many weapons they used.
  API Request -> loop through all hits -> Create a new Object if its the Players first hit (ex. { damage: 123456, q5Weapons: 5 } else add up the damage and weps used.)
*/
async function calcDamageDoneInBattle (battleId) {
  const currentBattleStats = {}
  const jsonApiFights = await sendApiRequest(
    '/apiFights.html?battleId=' + battleId)
  for (const hit of jsonApiFights) {
    const citizenId = hit.citizenId
    const berserkAndWepQ = checkWeaponQualityAndIfBerserk(hit)
    let q1Wep = 0
    let q5Wep = 0
    if (berserkAndWepQ[0] === 5 && berserkAndWepQ[1] === 5) {
      // Berserk and Q5
      q5Wep = 5
    } else if (berserkAndWepQ[0] === 1 && berserkAndWepQ[1] === 5) {
      // Single Hit and Q5
      q5Wep = 1
    } else if (berserkAndWepQ[0] === 5 && berserkAndWepQ[1] === 1) {
      // Berserk and Q1
      q1Wep = 5
    } else if (berserkAndWepQ[0] === 1 && berserkAndWepQ[1] === 1) {
      // Single hit and Q1
      q1Wep = 1
    }
    if (citizenId in currentBattleStats) {
      currentBattleStats[citizenId].damage += hit.damage
      currentBattleStats[citizenId].q5Weapons += q5Wep
      currentBattleStats[citizenId].q1Weapons += q1Wep
    } else {
      currentBattleStats[citizenId] = {
        damage: hit.damage,
        q5Weapons: q5Wep,
        q1Weapons: q1Wep
      }
    }
  }
  await addCitizensToFinalStats(currentBattleStats)
}
// Fetch the API
async function sendApiRequest (url) {
  console.log(url)
  changeStatusColor()
  let response
  let jsonResponse
  try {
    response = await fetch(url) // send api request
    jsonResponse = await response.json() // wait for server to return the json api
    return jsonResponse
  } catch (err) {
    /*
    An can error occur if you do  to many requests),
    simply wait 3secs and then do the same request again
    */
    await delay(3000)
    response = await fetch(url)
    jsonResponse = await response.json()
    return jsonResponse
  }
}
function changeStatusColor () {
  const dotElement = newTab.document.getElementById('dot')
  if (indexStatus === 0 || indexStatus === 6) {
    dotElement.style = 'background-color: #E50000'
    indexStatus = 1
  } else if (indexStatus === 1) {
    dotElement.style = 'background-color: #FF8D00'
    indexStatus = 2
  } else if (indexStatus === 2) {
    dotElement.style = 'background-color: #FFEE00'
    indexStatus = 3
  } else if (indexStatus === 3) {
    dotElement.style = 'background-color: #008121'
    indexStatus = 4
  } else if (indexStatus === 4) {
    dotElement.style = 'background-color: #004CFF'
    indexStatus = 5
  } else if (indexStatus === 5) {
    dotElement.style = 'background-color: #760188'
    indexStatus = 6
  }
}

// Check if the Player has used Q5 Weapons and did a 'Berserk'
function checkWeaponQualityAndIfBerserk (hit) {
  if (hit.berserk) {
    if (hit.weapon === 5) {
      return [5, 5]
    } else if (hit.weapon === 1) {
      return [5, 1]
    } else { return [5, 0] }
  } else {
    if (hit.weapon === 5) {
      return [1, 5]
    } else if (hit.weapon === 1) {
      return [1, 1]
    } else { return [1, 0] }
  }
}

// After one Battle has been checked and calculated which Player did how much damage -> Merge the Results together with the other Battles. Until all Battles are checked.
async function addCitizensToFinalStats (playersToAdd) {
  for (const player in playersToAdd) {
    if (player in jsonEventResults) {
      jsonEventResults[player].damage += playersToAdd[player].damage
      jsonEventResults[player].q5Weapons += playersToAdd[player].q5Weapons
      jsonEventResults[player].q1Weapons += playersToAdd[player].q1Weapons
    } else {
      jsonEventResults[player] = {
        damage: playersToAdd[player].damage,
        q5Weapons: playersToAdd[player].q5Weapons,
        q1Weapons: playersToAdd[player].q1Weapons
      }
    }
  }
}

async function updateLeaderboard (finalResults) {
  const lb = newTab.document.getElementById('leaderboard')
  let i = 1
  for (const element of finalResults) {
    const newRow = newTab.document.createElement('tr')
    const newCellPlace = newTab.document.createElement('th')
    const newCellPlayer = newTab.document.createElement('th')
    const newCellDamage = newTab.document.createElement('th')
    const newCellQ5Weapons = newTab.document.createElement('th')
    const newCellQ1Weapons = newTab.document.createElement('th')
    newCellPlace.innerText = i
    let citizen = element[0]
    if (i < 16) {
      const citizenApi = await sendApiRequest(
        '/apiCitizenById.html?id=' + element[0]
      )
      citizen = citizenApi.login
    }
    newCellPlayer.innerText = citizen
    newCellDamage.innerText = element[1].toLocaleString('de')
    newCellQ5Weapons.innerText = element[2].toLocaleString('fr')
    newCellQ1Weapons.innerText = element[3].toLocaleString('fr')
    lb.append(newRow)
    newRow.append(newCellPlace, newCellPlayer, newCellDamage, newCellQ5Weapons, newCellQ1Weapons)
    i++
  }
  indexStatus = 3
  changeStatusColor()
  location.reload()
}

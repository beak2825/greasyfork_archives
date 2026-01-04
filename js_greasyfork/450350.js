// ==UserScript==
// @name         FPLStats watchlist
// @namespace    http://tampermonkey.net/
// @version      1.1
// @license MIT
// @description  Updates the FPLStats websites to allow selection of players to a watchlists. Watchlist is toggleable. By default also displays every player now
// @author       DangerSalmon
// @match        http://www.fplstatistics.co.uk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fplstatistics.co.uk
// @grant       GM.setValue
// @grant       GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/450350/FPLStats%20watchlist.user.js
// @updateURL https://update.greasyfork.org/scripts/450350/FPLStats%20watchlist.meta.js
// ==/UserScript==

// Currently I'm just editing the view on the page. This means its a little slow to update as it needs all the data to be displayed, then operations to happen.
// A potential improvement would be to make this a Chrome extension which pulls the data from network and skips the inital display. But likely FPLStats will add their
// own watchlist before I get that working :P Especially since they have the link ID now. But this added ability to watch certain players so I still think its useful

// I was thinking of having two selectable lists. One for your team and one for watchlist

// Also should add loading states but can't really be arsed right now

/*
// Example of how the data is stored in greasemonkey storage. Rare occasion where same name same club could duplicate the results, may see if better way to sort later
const myTeam = [
    {club: "Man City", name: "Haaland"},
    {club: "Chelsea",name: "Mendy"},
    {club: "Leicester",name: "Ward"},
    {club: "Newcastle",name: "Trippier"},
    {club: "Liverpool",name: "Salah"},
    {club: "Fulham",name: "Andreas"},
    {club: "Leicester",name: "Barnes"},
    {club: "Arsenal",name: "Jesus"},
]*/

let latestTableRows = [] //#myDataTable > tbody > tr
let isFiltered = false

/**********
The FPLstats site when first getting results shows an error table row. Need to wait for this to go away before filtering
**********/
const waitForElement = async (whereWait) => {
    await new Promise(r => setTimeout(r, 100));
}

const waitForNoTableError = async () => {
    await waitForElement('waitForNoTableError')
    const searchError = document.querySelectorAll('#myDataTable > tbody > tr')[0]
    if (searchError.textContent.includes('Error: Invalid search / IP Ban or initialising table')) return waitForNoTableError()
    else return true
}
/**********************************************/

/**** Function show all players in data *****/
const showAllPlayers = async () => {
    const newDropdownOption = document.querySelectorAll('select[name=myDataTable_length] option')[3]
    newDropdownOption.value = 700
    newDropdownOption.text = '700'

    const select = document.querySelector('select[name=myDataTable_length]')
    select.value = 700;
    select.dispatchEvent(new Event('change'));

    await waitForNoTableError()
    latestTableRows = document.querySelectorAll('#myDataTable > tbody > tr')
    return true
}
/**********************************************/


/**** Function to toggle filtering my team *****/
const toggleFilterWatchlist = async () => {
    const storedTeam = await GM.getValue('fplStats_storedTeam')
    if (isFiltered) {
        isFiltered = false
        document.querySelector('#watchlistFilter').style.backgroundColor = 'transparent'
        latestTableRows.forEach((playerRow, index) => {playerRow.style.display = 'table-row'})
    } else {
        isFiltered = true
        document.querySelector('#watchlistFilter').style.backgroundColor = '#b3ffaa'
        latestTableRows.forEach((playerRow, index) => {
            const playerName = playerRow.querySelectorAll('td')[1].innerText
            const playerClub = playerRow.querySelectorAll('td')[2].innerText
            const isIncluded = storedTeam.some((myTeamPlayer) => {
                return myTeamPlayer.name === playerName && myTeamPlayer.club === playerClub
            })
            if (!isIncluded) playerRow.style.display = 'none'
        })
    }
}
/**********************************************/

/**** Function to add toggle filtering my team button*****/
const addFilterButton = () => {
    const filterDiv = document.querySelector('div #myDataTable_length')
    const newElement = document.createElement('div');
    newElement.id = 'watchlistFilter'
    newElement.innerText = 'Watchlist'
    newElement.style.backgroundColor = isFiltered ? '#b3ffaan' : 'transparent'
    newElement.style.border = isFiltered ? '1px solid green' : '1px solid black'
    newElement.style.cursor = 'pointer'
    newElement.style.display = 'inline-block'
    newElement.style.marginLeft = '5px'
    newElement.style.marginRight = '5px'
    newElement.style.paddingLeft = '5px'
    newElement.style.paddingRight = '5px'
    newElement.onclick = () => {toggleFilterWatchlist()}
    filterDiv.parentNode.insertBefore(newElement, filterDiv.nextSibling);
}
/**********************************************/

/**** Functions to add/remove players from watchlist*****/
const AddPlayerToWatchlist = async (newPlayer) => {
    let storedTeam = await GM.getValue('fplStats_storedTeam')
    if (!storedTeam) {
        GM.setValue('fplStats_storedTeam', [{club: newPlayer.club, name: newPlayer.name}])
    }
    else if(storedTeam.some((myTeamPlayer) => {
        return myTeamPlayer.name === newPlayer.name && myTeamPlayer.club === newPlayer.club
    })) {
         return
    }
    else {
        storedTeam.push(newPlayer)
    }
    console.log(storedTeam)
    await GM.setValue('fplStats_storedTeam', storedTeam)
}

const removePlayerFromWatchlist = async (newPlayer) => {
    let storedTeam = await GM.getValue('fplStats_storedTeam')
    if (!storedTeam) {
        return
    }
    else {
        storedTeam = storedTeam.filter(player => {
            return player.name !== newPlayer.name && player.club !== newPlayer.club;
        });
    }
    console.log(storedTeam)
    await GM.setValue('fplStats_storedTeam', storedTeam)
}
/**********************************************/

/*******Function which adds an Add/Remove button beside each player ***********/
const addTogglePlayerToTeamButton = async () => {
    if (latestTableRows.length) {

        /** Add 'Watchlist' text to header **/
        const tableHeaderRow = document.querySelector('#myDataTable > thead > tr')
        const headerWatchlistElement = document.createElement('th');
        headerWatchlistElement.className = 'all sorting ui-state-default'
        headerWatchlistElement.alignItems = 'center'
        headerWatchlistElement.display = 'flex'
        headerWatchlistElement.height = '21px'
        headerWatchlistElement.innerText = 'Watchlist'
        headerWatchlistElement.style.margin = '0px 10xp'
        tableHeaderRow.insertAdjacentElement('beforeend', headerWatchlistElement);
        /**********************************/

        const storedTeam = await GM.getValue('fplStats_storedTeam')
        latestTableRows.forEach((playerRow) => {
            const playerName = playerRow.querySelectorAll('td')[1].innerText
            const playerClub = playerRow.querySelectorAll('td')[2].innerText
            const isIncluded = storedTeam.some((myTeamPlayer) => {
                return myTeamPlayer.name === playerName && myTeamPlayer.club === playerClub
            })
            const newElement = document.createElement('td');
            newElement.innerText = isIncluded ? 'Added' : 'Add'
            newElement.style.alignItems = 'center'
            newElement.style.backgroundColor = isIncluded ? '#b3ffaa' : 'transparent';
            newElement.style.border = isIncluded ? '1px solid green' : '1px solid black';
            newElement.style.cursor = 'pointer'
            newElement.style.display = 'flex'
            newElement.style.height = '21px'
            newElement.style.margin = '0px 10xp'
            newElement.style.position = 'relative'
            newElement.style.width = '50px'
            newElement.onclick = async (event, data = {element: newElement, newPlayer: {club: playerClub, name: playerName}}) => {
                event.stopPropagation();
                const {element, newPlayer} = {...data}
                const latestStoredTeam = await GM.getValue('fplStats_storedTeam')
                const isIncluded = latestStoredTeam.some((myTeamPlayer) => {
                    return myTeamPlayer.name === newPlayer.name && myTeamPlayer.club === newPlayer.club
                })
                if (isIncluded) {
                    await removePlayerFromWatchlist(newPlayer);
                    newElement.innerText = 'Add';
                    newElement.style.backgroundColor = 'transparent';
                    newElement.style.border = '1px solid black';
                } else {
                    await AddPlayerToWatchlist(newPlayer);
                    newElement.innerText = 'Added';
                    newElement.style.backgroundColor = '#b3ffaa'
                    newElement.style.border = '1px solid green';
                }
            }
              if(playerRow.querySelector('td')) {
                  playerRow.insertAdjacentElement('beforeend',newElement);
              }
        })
    }
}

/***********
Below is whats actually ran when the FPLStats site is launched.
***********/
window.onload = async function () {
    await showAllPlayers()
    await addFilterButton()
    await addTogglePlayerToTeamButton()
}
/**********************************************/



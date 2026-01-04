// ==UserScript==
// @name        parkrun :: Run Director Assistant
// @description Augments the parkrun ems pages with useful information for RDs and volunteer coordinators
// @namespace   https://georgejames.com
// @match       https://ems.parkrun.com/Print
// @match       https://ems.parkrun.com/Vols*
// @license     GNU GPLv3
// @version     5
// @downloadURL https://update.greasyfork.org/scripts/456774/parkrun%20%3A%3A%20Run%20Director%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/456774/parkrun%20%3A%3A%20Run%20Director%20Assistant.meta.js
// ==/UserScript==


// Decorate the printed version of the volunteer roster with check boxes, narrative and credits
window.addEventListener("beforeprint", (event) => {

    const rows = document.querySelectorAll('.css-jt87mx')
    for (let i=0 ; i < rows.length ; i++) {
        const roleElement = rows[i]
        const volunteerElement = rows[i].nextSibling

        roleElement.innerHTML = `<input type="checkbox" style="transform: scale(1.5)"/> &nbsp;&nbsp; ${roleElement.innerHTML}`

        const role = roleElement.innerHTML
        const volunteer = volunteerElement.innerHTML
        if (volunteer !== '') {
            const volunteerNumber = volunteer.split("(A")[1].split(")")[0]
            if (volunteerNumber !== '') {
                const narrative = localStorage.getItem( 'rda-narrative-' + i )
                const credits = localStorage.getItem( 'rda-credits-' + i )
                volunteerElement.innerHTML = `${narrative} ${credits} ${volunteerElement.innerHTML}`
            }
        }
    }
})


if (document.readyState !== 'loading') init()
else { document.addEventListener('DOMContentLoaded', function () { init() }) }


function init() {

    // Initialize update in progress state
    localStorage.setItem('rda-updateInProgress', 'no')

    // Watch the table for any changes.  If there's a change then re-decorate the table with volunteer info
    let tableWatcher = new MutationObserver(volunteerInfoChanged)
    tableWatcher.observe(document.getElementsByClassName('rostertblT4L27')[0], {childList: true, attributes: true, characterData: true, subtree: true} )

    // Populate the table
    volunteerInfo()

}


function volunteerInfoChanged() {

    if (localStorage.getItem('rda-updateInProgress') === 'yes') return

    setTimeout(function() { volunteerInfo() }, 100)
    setTimeout(function() { volunteerInfo() }, 5_000)
}


async function volunteerInfo() {

    // In-progress check
    if (localStorage.getItem('rda-updateInProgress') === 'yes') return
    localStorage.setItem('rda-updateInProgress', 'yes')

    // Ensure checkboxes are rendered behind column headings
    document.getElementsByClassName('diagW7pZC')[0].nextSibling.style.zIndex = 100

    let rowCount = document.getElementsByClassName('rostertblT4L27')[0].children[1].children.length
    const eventNumber = thisEvent()
    const eventDate = document.querySelectorAll('.rostertblT4L27 thead tr th')[1].innerHTML
    const extraDivs = `<div style='font-size: small' class='rda-narrative'></div><div style='font-size: small' class='rda-credits'></div>`

    // For each row ... locate the role and then decorate the next column with narrative and credits
    const rows = document.querySelectorAll('.rostertblT4L27 tbody tr th')
    for (let i = 0; i<rows.length; i++) {

        const roleNameElement = rows[i].getElementsByTagName('span')[0]
        const roleName = roleNameElement.innerHTML

        const volunteerElement = rows[i].nextSibling

        // If needed, decorate the cell with our extra divs
        if (volunteerElement.getElementsByClassName('rda-narrative').length === 0) volunteerElement.innerHTML = extraDivs + volunteerElement.innerHTML

        const rawVolunteerData = volunteerElement.dataset.s

        if (rawVolunteerData !== undefined) {
            const volunteerData = JSON.parse(decodeURIComponent( rawVolunteerData ))

            const parkrunId = volunteerData.i
            const volunteerCredits = await getVolunteerCredits( parkrunId )
            const creditsForRole = getCreditsForRole( volunteerCredits, roleName )
            const totalCredits = volunteerData.vc || 0

            const confirmedId = 'rda-confirmed-' + eventNumber + '-' + eventDate + '-' + parkrunId + '-' + roleName
            let checked = ''
            if ( localStorage.getItem(confirmedId) === 'true' ) checked='checked'

            const narrative = getNarrative( creditsForRole, totalCredits )
            const credits = `[ ${creditsForRole.here} / ${creditsForRole.elsewhere} / ${totalCredits} ]`
            const checkbox =`&nbsp;&nbsp;&nbsp;<input type="checkbox" style="z-index: 10; transform: scale(1.2)" ${checked} onclick="event.stopPropagation(); localStorage.setItem('${confirmedId}',this.checked)"/>`

            const narrativeElement = volunteerElement.getElementsByClassName('rda-narrative')[0]
            if (narrativeElement !== undefined) narrativeElement.innerHTML = narrative

            const creditsElement = volunteerElement.getElementsByClassName('rda-credits')[0]
            if (creditsElement !== undefined) creditsElement.innerHTML = credits + checkbox

            localStorage.setItem( 'rda-narrative-' + i , narrative )
            localStorage.setItem( 'rda-credits-' + i , credits )

            // Decrement counter (after result received from getVolunteerCredits server call)
            rowCount--
            if (rowCount === 0) setTimeout(function() { localStorage.setItem('rda-updateInProgress', 'no' ) }, 1_000)

        }
        else {

            // No volunteer, so clear any previous values
            const narrativeElement = volunteerElement.getElementsByClassName('rda-narrative')[0]
            if (narrativeElement !== undefined) narrativeElement.innerHTML = ''

            const creditsElement = volunteerElement.getElementsByClassName('rda-credits')[0]
            if (creditsElement !== undefined) creditsElement.innerHTML = ''

            localStorage.setItem( 'rda-narrative-' + i , '')
            localStorage.setItem( 'rda-credits-' + i , '')

            // Decrement row counter
            rowCount--
            if (rowCount === 0) setTimeout(function() { localStorage.setItem('rda-updateInProgress', 'no' ) }, 1_000)

        }
    }
}


// Returns a narrative string that includes helpful info like milestones etc.
function getNarrative(creditsForRole, totalCredits) {

    let narrative = ''

    if ((creditsForRole.here + creditsForRole.elsewhere) === 0 ) narrative = '<span style="color: red">[ NOVICE ]</span>'

    if (totalCredits === 24) { narrative ='[MILESTONE: 25th]' }
    if (totalCredits === 49) { narrative ='[MILESTONE: 50th]' }
    if (totalCredits === 99) { narrative ='[MILESTONE: 100th]' }
    if (totalCredits === 199) { narrative ='[MILESTONE: 200th]' }
    if (totalCredits === 249) { narrative ='[MILESTONE: 250th]' }
    if (totalCredits === 299) { narrative ='[MILESTONE: 300th]' }
    if (totalCredits === 399) { narrative ='[MILESTONE: 400th]' }
    if (totalCredits === 499) { narrative ='[MILESTONE: 500th]' }
    if (totalCredits === 749) { narrative ='[MILESTONE: 750th]' }
    if (totalCredits === 999) { narrative ='[MILESTONE: 1000th]' }

    return narrative
}


// Returns object containing count of credits here and elsewhere for the specified role
function getCreditsForRole(credits, role) {

    // Remove any task label that may be suffixed to the role
    const bareRole = role.split(' | ')[0]

    let here = 0
    if (credits && credits.summary && credits.summary.here) {
        for (let i=0; i < credits.summary.here.length; i++) {
            if (credits.summary.here[i].n === bareRole) {
                here = credits.summary.here[i].t
            }
        }
    }

    let elsewhere = 0
    if (credits && credits.summary && credits.summary.elsewhere) {
        for (let i=0; i < credits.summary.elsewhere.length; i++) {
            if (credits.summary.elsewhere[i].n === bareRole) {
                elsewhere = credits.summary.elsewhere[i].t
            }
        }
    }

    return {here: here, elsewhere: elsewhere}
}


// Call the ShortVolSummary server-side method to get a summary of volunteer credits for the specified volunteer
async function getVolunteerCredits(volunteerNumber) {

    const eventNumber = thisEvent()

    const url = `https://ems.parkrun.com/Api?handler=ShortVolSummary&v=${volunteerNumber}&e=${eventNumber}`
    const response = await fetch(url)
    if (!response.ok) {
        console.log('Request for ' + url + ' returned ' + response.status)
        return null
    }
    else {
        const json = await response.json()
        return json
    }
}

function thisEvent() {
    return JSON.parse(decodeURIComponent(document.getElementsByClassName('jsRC')[0].value.split(',')[6])).i
}




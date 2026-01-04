// ==UserScript==
// @name     HJV.DK+
// @namespace    http://tampermonkey.net/
// @version      1.3.2
// @description  Highlight my squad-members and create some statistics about who is participating on a given HJV aktivitet under the "Deltagere" tab.
// @author       Sofus Würtz
// @match        https://www.hjv.dk/oe/*/_layouts/15/*
// @icon         https://www.google.com/s2/favicons?domain=hjv.dk
// @grant        none
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/424934/HJVDK%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/424934/HJVDK%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //********************* Options    *********************
    let myGRP = 2
    let myDEL = 1
    //let alsoHighlightTheesePersons = ["Sofus Peter Würtz"] //To add more, write a name within "" and seperate each name with a , all between the []. example: ["hans", "grete", "bob"]
    let highligthMyGRP = true //Auto-tick your group to auto highlight
    let seeAllPlatoons = true //Make stats in the corner for just myDEL or for both 1/2DEL in INFHVKEJY on this aktivitet. Set to true or false
    let firstColor = "red" //Colour for 1.GRP / 1.DEL (should be some kind of red)
    let secondColor = "#c6c6c6" //Colour for 2.GRP / 2.DEL (should be some kind of white/grey)
    let thirdColor = "#7fcde6" //Colour for 3.GRP / 3.DEL (should be some kind of blue)
    //To pick your own color, use the link and cop the hex value: https://www.google.com/search?client=firefox-b-d&q=colourpicker
    //********************* Options end*********************

    let orgs = new Map()
    let myOrg = myGRP + "-GRP-" + myDEL + "-INFDEL-INFHVK-EJY-HDEJY"
    let tables = document.getElementsByTagName("table")
    let orgRows = tables[1].rows

    //Check if the tables are even present (wait for us to navigate to the tab "Deltagere")
    if(!tables[0].className.includes("ms-formtable")){
        return
    }

    //Make map of how many of each org-unit (eg. '2-GRP-2-INFDEL-INFHVK-EJY-HDEJY') and highlight my group
    for (let row of orgRows){
        let org = row.cells[4].innerText
        if (!orgs.has(org)){
            orgs.set(org, [row])
        } else{
            orgs.get(org).push(row)
        }
    };

    //Highlight/remove highlight a given org depending on checkedStatus (True/False)
    function highligth(org, checkedStatus){
        let delColor = org.includes("1-INFDEL") ? firstColor : secondColor
        let grpColor = org.includes("1-GRP") ? firstColor : (org.includes("2-GRP") ? secondColor :thirdColor)
        let rowsToHighlight = orgs.get(org)
        //let style = checkedStatus ? "background: rgba(106, 150, 59, 0.73); font-weight: bold;" : ""
        let color = checkedStatus ? grpColor : ""
        let border = checkedStatus ? ("2px solid " + delColor) : ""
        let fontWeight = checkedStatus ? "bold" : ""
        rowsToHighlight.forEach(function(entry){
            //entry.style = style
            entry.style.backgroundColor = color
            entry.style.border = border
            entry.style.fontWeight = fontWeight
        })
    }

    //Add the summed fields for each group
    let re = seeAllPlatoons ? new RegExp('\\d-GRP', 'i') : new RegExp('\\d-GRP-'+ myDEL, 'i')
    let Adel = 0
    let Bdel = 0
    for (let org of orgs){
        Adel += org[0].includes("1-INFDEL") ? org[1].length : 0
        Bdel += org[0].includes("2-INFDEL") ? org[1].length : 0
        if (!re.test(org)){
            continue
        }
        let newRow = tables[0].insertRow(1)
        let myUnitShort = org[0].slice(10,15)
        let myUnit = org[0].slice(16,17) + "-DEL-" + myUnitShort
        let orgShortName = seeAllPlatoons ? org[0].slice(6,7) + "-DEL-" + org[0].slice(0,5) : org[0].slice(0,5) //Slice eg. "2-GRP-2-INFDEL-INFHVK-EJY-HDEJY " to 2-GRP-2-INFDEL or just 1-GRP
        let checkbox = "<input id='" + org[0] + "' type='checkbox'></input>"
        newRow.innerHTML = '<td class="ms-formbody"><span>' + orgShortName + '</span></td><td class="ms-formbody"><span>'+ org[1].length +'</span></td><td class=""><span>'+ checkbox +'</span></td>'

        //Let the checkboxes listen for change
        let checkboxTag = document.getElementById(org[0])
        checkboxTag.addEventListener('change', function (event, org, orgs) {
            highligth(checkboxTag.id, checkboxTag.checked)
        });
        //Highlight my GRP
        console.log(org[0] + " /= " + myOrg)
        if(highligthMyGRP & org[0].includes(myOrg)){
            checkboxTag.checked = true
            highligth(checkboxTag.id, true)
        }
    }

    //**********Sort the summed fields. courtesy https://www.w3schools.com/howto/howto_js_sort_table.asp
    var table, rows, switching, i, x, y, shouldSwitch;
    table = tables[0]
    switching = true;
    /*Make a loop that will continue until no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /*Loop through all table rows (except the first, which contains table headers):*/
        for (i = 1; i < (rows.length - 2); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare, one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("TD")[0];
            y = rows[i + 1].getElementsByTagName("TD")[0];
            //check if the two rows should switch place:
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                //if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
    //**********Sort the summed fields. courtesy https://www.w3schools.com/howto/howto_js_sort_table.asp

    //Insert the summed DEL (plattons) as the last thing
    function insertDEL(x){
        //let tableLength = tables[0].attributes.length
        let del = x === 1 ? Adel : Bdel
        tables[0].insertRow(-1).innerHTML = '<td class="ms-formbody"><span>' + x + '-INFDEL-SAMLET</span></td><td class="ms-formbody"><span>'+ del +'</span></td>'
    }

    if(seeAllPlatoons){
        insertDEL(2)
        insertDEL(1)
    } else{
        insertDEL(myDEL)
    }

    /*const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }*/

    /*async function sortOnLoad(){
        console.log("doing da sleeps...")
        await sleep(1750)
        orgs.get("Org-FORK")[0].cells[4].childNodes[1].click()
    }

    sortOnLoad()*/ // Work in progress

})();

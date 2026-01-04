// ==UserScript==
// @name         MH: Labyrinth Door Data Collector
// @author       Warden Slayer
// @namespace    https://greasyfork.org/en/users/227259-wardenslayer
// @version      1.2.8
// @description  Mousehunt data collection tool for avilible labyrinth doors
// @icon         https://www.mousehuntgame.com/images/items/weapons/974151e440f297f1b6d55385310ac63c.jpg?cv=2
// @include      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @include      http://www.mousehuntgame.com/*
// @include      https://www.mousehuntgame.com/*
// @downloadURL https://update.greasyfork.org/scripts/387615/MH%3A%20Labyrinth%20Door%20Data%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/387615/MH%3A%20Labyrinth%20Door%20Data%20Collector.meta.js
// ==/UserScript==
$(document).ready(function() {
    const debug = localStorage.getItem('ws.debug');
    if (user.environment_name == 'Labyrinth') {
        if (debug == true) {
            console.log('Labyrinth Door Script Running');
        }
        buildWorkingIndicator();
        copyDataNew();
    } else {
        if (debug == true) {
            console.log('Not in the Labyrinth');
        }

    }
});

$(document).ajaxStop(function(){
    if (user.environment_name == 'Labyrinth') {
        buildWorkingIndicator();
        copyDataNew();
    }
});

function buildWorkingIndicator() {
    const debug = localStorage.getItem('ws.debug');
    if ($('.workingIndicatorContainer').length > 0) return;
    const workingIndicatorContainer = document.createElement("div");
    workingIndicatorContainer.classList.add("workingIndicatorContainer");
    const hudLocation = $('.labyrinthHUD-itemContainer');
    if (debug == true) {
        console.log('HUD Element:',hudLocation);
    }
    const workingIndicator = document.createElement("div");
    workingIndicator.classList.add("workingIndicator");
    $(workingIndicator).text('Collecting Door Data');
    workingIndicator.addEventListener("click", copyDataNew);
    workingIndicatorContainer.appendChild(workingIndicator);
    $(workingIndicator).css({
        'margin-right': '5px',
        'cursor': 'pointer',
    })
    hudLocation.after(workingIndicatorContainer);
    $('.workingIndicatorContainer').css({
        'height': '5%',
        'width': '15%',
        'right':'8px',
        'bottom': '-10px',
        'position': 'absolute',
    });
}

function copyDataNew() {
    const debug = localStorage.getItem('ws.debug');
    const status = user.quests.QuestLabyrinth.status;
    if (status == 'intersection') {
        if (debug == true) {
            console.log('Collecting Data');
        }
        let resultsArray = [];
        const allFactions = user.quests.QuestLabyrinth.all_clues;
        for (let key in allFactions) {
            resultsArray.push(allFactions[key].quantity);
        }
        const allDoors = user.quests.QuestLabyrinth.doors;
        for (let key in allDoors) {
            const thisDoor = parseDoorNew(allDoors[key]);
            resultsArray.push(thisDoor.doorLength,thisDoor.doorQuality,thisDoor.doorType);
        }
        //Add flag to denote shuffling
        const journalText = $(".journaltext");
        const journalArray = journalText.toArray(0);
        const shuffleFlag = parseJournal(journalArray);
        resultsArray.push(shuffleFlag);
        const results = resultsArray.join();
        console.log('Result String: ', results);
        publishResults(results);
    } else if (status == 'intersection enterance'){
        if (debug == true) {
            console.log('At the Entrance. Submit cancelled');
            return;
        }
    } else {
        if (debug == true) {
            console.log('Not in an intersection. Submit cancelled');
            return;
        }
    }
}

function parseDoorNew(door) {
    const debug = localStorage.getItem('ws.debug');
    if (debug == true) {
        console.log("Door before shortening: ", door.name)
    }
    const doorString = door.name.replace(" Hallway","");
    const doorArray = doorString.split(" ");
    let doorLength = doorArray[0];
    let doorQuality = doorArray[1];
    let doorType = doorArray[2];
    //shorten door length
    if (doorLength == "Long") {
        doorLength = "L";
    } else if (doorLength == "Medium") {
        doorLength = "M";
    } else {
        doorLength = "S";
    }
    //shorten door quality
    if (doorQuality == "Epic") {
        doorQuality = "E";
    } else if (doorQuality == "Superior") {
        doorQuality = "S";
    } else {
        doorQuality = "P";
    }
    //shorten door type
    if (doorType == "Fealty") {
        doorType = "Y";
    } else if (doorType == "Tech") {
        doorType = "H";
    } else if (doorType == "Scholar") {
        doorType = "S";
    } else if (doorType == "Treasury") {
        doorType = "T";
    } else if (doorType == "Farming") {
        doorType = "F";
    } else {
        doorType = "M";
    }
    return {
        doorLength,
        doorQuality,
        doorType
    }
}

function parseJournal(array) {
    let shuffleFlag = 0;
    array.forEach(function(elements) {
        const text = $(elements).text();
        if (text.includes("grinding whirr")) {
            shuffleFlag = 1;
        } else {}
    })
    return shuffleFlag;
}

function publishResults(results) {
    const debug = localStorage.getItem('ws.debug');
    const lastSubmit = localStorage.getItem('Last Submission');
    if (debug == true) {
        console.log('Atempting to submit data')
    }
    if (results == lastSubmit) {
        if (debug == true) {
            console.log("Data has not changed, submit cancelled", lastSubmit)
        }
        return
    }
    const url = 'https://script.google.com/macros/s/AKfycbwDDR4REjef09wnByanmJN2-XZuNPtjY6LgLNt6Pt-HREcKI4rnam5uqosiVASz21FLiA/exec';
    const form = new submitData(results)
    const jqxhr = $.ajax({
        crossDomain: true,
        url: url,
        method: "GET",
        dataType: "json",
        data: form,
    }).success(function() {
        // do something
        console.log('Door Data Submitted!')
        localStorage.setItem('Last Submission', results);
        $('.workingIndicator').text('Data Submitted');
        setTimeout(function() {
            $('.workingIndicator').text('Collecting Door Data');
        }, 1000);
    });


}

function submitData(result_string) {
    this.The_String_From_The_Script = result_string;
}

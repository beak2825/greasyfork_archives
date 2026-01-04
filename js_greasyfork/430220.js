// ==UserScript==
// @name         fish me
// @description  FISHING TIME
// @version      0.3
// @author       ben (mushroom) / Customized by an Asher (sidefury)
// @match        https://neopetsclassic.com/water/fishing/*
// @namespace    
// @downloadURL https://update.greasyfork.org/scripts/430220/fish%20me.user.js
// @updateURL https://update.greasyfork.org/scripts/430220/fish%20me.meta.js
// ==/UserScript==

var storage;
var fishingStorage;
localStorage.getItem("fishingtracker==") != null ? fishingStorage = JSON.parse(localStorage.getItem("fishingtracker==")) : fishingStorage = {display: true, pets: {}};

var currentPage = window.location.href;
var pageHTML = document.body.innerHTML;
var documentText = document.body.innerText;
var content = document.getElementsByClassName("content")[0];
var currentDate = new Date();
var usingDefaultTheme = document.body.innerHTML.indexOf('04/top_bar_anim') < 0 ? true : false;

function fishingList() {
    var newDate = new Date();

    for (var fishingPet in fishingStorage.pets)
    {
        var endDateFish = new Date(fishingStorage.pets[fishingPet][0])
        var timeStringFish;

        if (!isNaN(Date.parse(endDateFish))) // check if valid date
        {
            var hoursLeftFish = Math.floor((endDateFish - newDate)/(1000*60*60));
            var minutesLeftFish = Math.floor(((endDateFish - newDate) % (1000*60*60)) / (1000*60));
            var secondsLeftFish = Math.floor(((endDateFish - newDate) % (1000*60)) / (1000));
            if (secondsLeftFish >= 0)
            {
                timeStringFish = hoursLeftFish + " hrs, " + minutesLeftFish + " min, " + secondsLeftFish + " sec";
            }
            else
            {
                timeStringFish = "Ready to fish again!";
            }
        }

        document.getElementById(fishingPet + "_ttf").innerText = timeStringFish;
    }
}

(function() {
    'use strict';

    // When on fishing success page, parse HTML & store in local storage
    if (currentPage == "https://neopetsclassic.com/water/fishing/" && document.body.innerText.lastIndexOf('You might be able to') > 0)
    {
        var activePet = usingDefaultTheme ? documentText.substring(documentText.lastIndexOf(' | Pet : ') + 9, documentText.lastIndexOf(' | NP : ')) : documentText.substring(documentText.lastIndexOf('\npet : ') + 7, documentText.lastIndexOf('\nNP : '))
        var hoursUntilNext = documentText.substring(documentText.lastIndexOf('You might be able to cast again in about ') + 41, documentText.lastIndexOf('You might be able to cast again in about ') + 42)
        var currentLevel = activePet in fishingStorage.pets ? fishingStorage.pets[activePet][1] : "TBD"
        if (documentText.lastIndexOf("fishing skill increases to") > 0){
            currentLevel = documentText.substring(documentText.lastIndexOf('fishing skill increases to') + 27, documentText.lastIndexOf('!\n\nYou might be'));
        }

        fishingStorage.pets[activePet] = [ new Date(currentDate.getTime() + 60*60*1000*parseInt(hoursUntilNext)) , currentLevel ]
        localStorage.setItem("fishingtracker==", JSON.stringify(fishingStorage));
    }

    // When on any page with Neopets sidebar, add fishing module
    if (document.getElementsByName("a").length > 0)
    {
        var fishContainer = document.createElement("div");
        fishContainer.id = "tt";
        fishContainer.style = "width:390px; font-size:8pt; text-align: right;";

        // Adding fishing
        var fishingDisplay = fishingStorage.display ? "inline" : "none";
        var fishingDisplayArrow = fishingStorage.display ? "↑" : "↓";
        var fishingModulePart = ""
        var fishingPetsArray = [];
        for (var pet in fishingStorage.pets)
        {
            if (!Array.isArray(fishingStorage.pets[pet])){
                var ph = fishingStorage.pets[pet]
                fishingStorage.pets[pet] = [ ph, "TBD" ]
            }
            fishingPetsArray.push([ pet, fishingStorage.pets[pet][0] ]);
        }

        fishingPetsArray.sort((a, b) => new Date(b[1]) - new Date(a[1]));

        for (var p = 0; p < fishingPetsArray.length; p++)
        {
            let petName = fishingPetsArray[p][0];
            let petLevel = fishingStorage.pets[petName][1];
            let nextFishingTime = new Date(fishingStorage.pets[petName][0]);
            var timeStringF;

            if (!isNaN(Date.parse(nextFishingTime))) // check if valid date
            {
                if (Date.parse(nextFishingTime) > currentDate)
                {
                    var hoursLeftF = Math.floor((nextFishingTime - currentDate)/(1000*60*60));
                    var minutesLeftF = Math.floor(((nextFishingTime - currentDate) % (1000*60*60)) / (1000*60));
                    var secondsLeftF = Math.floor(((nextFishingTime - currentDate) % (1000*60)) / (1000));
                    timeStringF = hoursLeftF + " hrs, " + minutesLeftF + " min, " + secondsLeftF + " sec";
                }
                else
                {
                    timeStringF = "Ready to fish again!";
                }
            }

            fishingModulePart = fishingModulePart + `<a style="font-size: 8pt;" href="/setActivePet/?pet_name=${petName}" target="_blank">${petName}</a> (lvl ${petLevel}): <span id="${petName}_ttf">${timeStringF}</span><br>`
        };

        fishContainer.innerHTML = `<br>Show pets: <span id="TBD">` + fishingDisplayArrow + `</span><br><div style="display:` + fishingDisplay + `;" id="fishingModulePets">` + fishingModulePart + `</div>`
        document.getElementsByTagName("form")[2].appendChild(fishContainer);

        //document.getElementsByTagName("body")[0].insertAdjacentHTML("afterbegin", trainingModule)

        // Add on-click event
        document.getElementById("TBD").onclick = function() {
            fishingStorage.display = !fishingStorage.display;
            if (fishingStorage.display){
                console.log("hi")
                document.getElementById("TBD").innerText = "↑";
                document.getElementById("fishingModulePets").style.display = "inline";
            }
            else{
                console.log("bye")
                document.getElementById("TBD").innerText = "↓";
                document.getElementById("fishingModulePets").style.display = "none";
            }
            localStorage.setItem("fishingtracker==", JSON.stringify(fishingStorage));
        };


        setInterval(fishingList, 1000);
    }

})();
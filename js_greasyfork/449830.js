// ==UserScript==
// @name         NPC Helper
// @description  Adds helpful timers and links to the NPC sidebar.
// @version      0.21
// @author       ben (mushroom)
// @match        https://neopetsclassic.com/*
// @icon         https://www.google.com/s2/favicons?domain=neopetsclassic.com
// @namespace https://greasyfork.org/users/727556
// @downloadURL https://update.greasyfork.org/scripts/449830/NPC%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/449830/NPC%20Helper.meta.js
// ==/UserScript==

var storage;
var fishingStorage;
localStorage.getItem("trainingtracker==") != null ? storage = JSON.parse(localStorage.getItem("trainingtracker==")) : storage = {display: true, students: {}};
localStorage.getItem("fishingtracker==") != null ? fishingStorage = JSON.parse(localStorage.getItem("fishingtracker==")) : fishingStorage = {display: true, pets: {}};

var currentPage = window.location.href;
var pageHTML = document.body.innerHTML;
var documentText = document.body.innerText;
var content = document.getElementsByClassName("content")[0];
var currentDate = new Date();
var usingDefaultTheme = document.body.innerHTML.indexOf('04/top_bar_anim') < 0 ? true : false;

function trainingList() {
    // Loop through students in storage
    var newDate = new Date();
    for (var student in storage.students)
    {
        // get name, parse date, update content of
        let studentName = student;
        var endDate = new Date(storage.students[student].timeToCompletion);
        var timeString;

        if (!isNaN(Date.parse(endDate))) // check if valid date
        {
            var hoursLeft = Math.floor((endDate - newDate)/(1000*60*60));
            var minutesLeft = Math.floor(((endDate - newDate) % (1000*60*60)) / (1000*60));
            var secondsLeft = Math.floor(((endDate - newDate) % (1000*60)) / (1000));
            if (secondsLeft >= 0)
            {
                timeString = hoursLeft + " hrs, " + minutesLeft + " min, " + secondsLeft + " sec";
            }
            else
            {
                timeString = "Course Finished!";
            }
        }
        else
        {
            timeString = storage.students[student].timeToCompletion;
        }

        document.getElementById(studentName + "_ttc").innerText = timeString;
    }

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

    // When on training status page, parse HTML & store in local storage
    if (currentPage == "https://neopetsclassic.com/island/training/status/"){

        var petTables = content.getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr");
        var numOfPets = petTables.length / 2;
        var petNames = [];

        // Loop through pets
        for (var i = 0; i < numOfPets; i++)
        {
            var courseInfo = petTables[2*i].getElementsByTagName("td")[0].getElementsByTagName("b")[0].innerText.split(" ");
            petNames.push(courseInfo[0]);

            // if last element of courseInfo == course, remove petname from students
            if (courseInfo[courseInfo.length - 1] == "course")
            {
                delete storage.students[courseInfo[0]];
            }

            // else, add student record (pet name, course, time to completion)
            else
            {
                var timeToCompletion = petTables[2*i + 1].getElementsByTagName("td")[1].getElementsByTagName("b")[0].innerText;
                if (timeToCompletion.indexOf("Codestone") > 0)
                {
                    storage.students[courseInfo[0]] = {currentCourse: courseInfo[courseInfo.length - 1], timeToCompletion: timeToCompletion + " required"};
                }
                else if (timeToCompletion == "Course Finished!")
                {
                    storage.students[courseInfo[0]] = {currentCourse: courseInfo[courseInfo.length - 1], timeToCompletion: timeToCompletion};
                }
                else
                {
                    var re = /\d+/g;
                    var timeParts = [...timeToCompletion.matchAll(re)];
                    var endTime = new Date(currentDate.getTime() + timeParts[0]*60*60*1000 + timeParts[1]*60*1000 + timeParts[2]*1000)
                    storage.students[courseInfo[0]] = {currentCourse: courseInfo[courseInfo.length - 1], timeToCompletion: endTime};
                }
            }
        }

        for (var s in storage.students)
        {
            var matchExists = 0;
            for (var j = 0; j < petNames.length; j++)
            {
                if (petNames[j] == s)
                {
                    matchExists = 1;
                }
            }
            if (matchExists == 0)
            {
                delete storage.students[s];
            }
        }

        localStorage.setItem("trainingtracker==", JSON.stringify(storage));
    }

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

    // When on any page with Neopets sidebar, add training module
    if (document.getElementsByName("a").length > 0)
    {
        var trainingModule = `<div class="tt" style="position:absolute; left:780px; top:10px;">
        <a href="https://neopetsclassic.com/safetydeposit/?page=1&query=codestone&category=2">ðŸ§</a>
        <a href="https://neopetsclassic.com/island/training/status/">Training status:</a><br>`
        var studentCount = 0;

        // Loop through students in storage
        for (var student in storage.students)
        {
            let studentName = student;
            let currentCourse = storage.students[student].currentCourse;
            var endDate = new Date(storage.students[student].timeToCompletion);
            var timeString;

            if (!isNaN(Date.parse(endDate))) // check if valid date
            {
                if (Date.parse(endDate) > currentDate)
                {
                    var hoursLeft = Math.floor((endDate - currentDate)/(1000*60*60));
                    var minutesLeft = Math.floor(((endDate - currentDate) % (1000*60*60)) / (1000*60));
                    var secondsLeft = Math.floor(((endDate - currentDate) % (1000*60)) / (1000));
                    timeString = hoursLeft + " hrs, " + minutesLeft + " min, " + secondsLeft + " sec";
                }
                else
                {
                    timeString = "Course Finished!";
                }
            }
            else
            {
                timeString = storage.students[student].timeToCompletion;
            }

            var trainingModulePart = `<li>${student} (<i>${currentCourse}</i>): <span id="${student}_ttc">${timeString}</span></li>`

            trainingModule = trainingModule + trainingModulePart;
            studentCount++;
        }

        if (studentCount == 0)
        {
            trainingModule = trainingModule + `<br>No pets in courses - go get started!`;
        }

        // Adding fishing
        var fishingDisplay = fishingStorage.display ? "inline" : "none";
        var fishingDisplayArrow = fishingStorage.display ? "â†‘" : "â†“";
        trainingModule = trainingModule + `<br><a href="https://neopetsclassic.com/water/fishing/">Underwater fishing:</a> <span style="font-size: 16px; cursor: pointer;" id="TBD">` + fishingDisplayArrow + `</span><div style="display:` + fishingDisplay + `;" id="fishingModulePets">`

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

            var fishingModulePart = `<li><a style="font-size: 10px;" href="/setActivePet/?pet_name=${petName}">${petName}</a> (lvl ${petLevel}): <span id="${petName}_ttf">${timeStringF}</span></li>`

            trainingModule = trainingModule + fishingModulePart;
        }
        trainingModule = trainingModule + `</div>`;


        // Adding dailies
        trainingModule = trainingModule + `<br><a href="https://www.jellyclassic.org/dailies">Dailies:</a><br><li>Once a day:</li>
        <a href='https://neopetsclassic.com/bank/' style='font-size:20px;font-weight:100;'>&#128176;</a>
        <a href='https://neopetsclassic.com/jelly/jelly' style='font-size: 20px; font-weight:100;'>&#127854;</a>
        <a href='https://neopetsclassic.com/prehistoric/plateau/omelette/' style='font-size: 20px;font-weight:100;'>&#127859;</a>
        <a href='https://neopetsclassic.com/island/tombola/' style='font-size: 20px; font-weight:100;'>&#128026;</a><br>
        <a href='https://neopetsclassic.com/medieval/brightvale/wheel/' style='font-size: 20px; font-weight:100;'>&#128214;</a>
        <a href='https://neopetsclassic.com/desert/fruimachine/' style='font-size: 20px; font-weight:100;'>ðŸ</a>
        <a href='https://neopetsclassic.com/lab/' style='font-size: 20px; font-weight:100;'>âš¡</a>
        <a href='https://neopetsclassic.com/petpetlab/' style='font-size: 20px; font-weight:100;'>ðŸ”¬</a><br>
        <li>Multiple a day:</li>
        <a href='https://neopetsclassic.com/winter/kiosk/' style='font-size: 20px; font-weight:100;'>ðŸ§Š</a>
        <a href='https://neopetsclassic.com/desert/shrine/' style='font-size: 20px; font-weight:100;'>ðŸª</a>
        <a href='https://neopetsclassic.com/faerieland/springs/' style='font-size: 20px; font-weight:100;'>ðŸ’§</a>
        <a href='https://neopetsclassic.com/faerieland/wheel/' style='font-size: 20px; font-weight:100;'>ðŸ§¿</a>
        <a href='https://neopetsclassic.com/halloween/wheel/' style='font-size: 20px; font-weight:100;'>ðŸŽ±</a><br>
        <a href='https://neopetsclassic.com/faerieland/employ/jobs/?page=1' style='font-size: 20px; font-weight:100;'>ðŸ’¼</a>
        <a href='https://neopetsclassic.com/winter/snowager/' style='font-size: 20px; font-weight:100;'>ðŸ</a>
        <a href='https://neopetsclassic.com/market/till/' style='font-size: 20px; font-weight:100;'>ðŸ’µ</a>
        <a href='https://neopetsclassic.com/wishing/' style='font-size: 20px; font-weight:100;'>ðŸŒ </a><br>
        <a href='https://neopetsclassic.com/winter/snowfaerie/' style='font-size: 20px; font-weight:100;'>ðŸ—»</a>
        <a href='https://neopetsclassic.com/halloween/esophagor/' style='font-size: 20px; font-weight:100;'>ðŸŒ‡</a>
        <a href='https://neopetsclassic.com/halloween/scratch' style='font-size: 20px; font-weight:100;'>ðŸ‘»</a>
        <a href='https://neopetsclassic.com/winter/shopofmystery/' style='font-size:20px;font-weight:100;'>ðŸ›„</a>
        <a href='https://neopetsclassic.com/medieval/index_farm/gardens/' style='font-size: 20px; font-weight:100;'>ðŸŒ¿</a>
        <a href='https://neopetsclassic.com/winter/neggery/' style='font-size: 20px; font-weight:100;'>ðŸ¥š</a><br>
        `

        // Adding shops
        trainingModule = trainingModule + `<br><a href="https://www.jellyclassic.org/shops">Shops:</a><br><li>Profitable:</li>
        <a href='https://neopetsclassic.com/viewshop/?shop_id=1' style='font-size:20px;font-weight:100;'>âš—ï¸</a>
        <a href='https://neopetsclassic.com/viewshop/?shop_id=16' style='font-size:20px;font-weight:100;'>ðŸ§</a>
        <a href='https://neopetsclassic.com/viewshop/?shop_id=18' style='font-size:20px;font-weight:100;'>ðŸž</a>
        <a href='https://neopetsclassic.com/viewshop/?shop_id=26' style='font-size:20px;font-weight:100;'>ðŸ¤¿</a>
        <a href='https://neopetsclassic.com/viewshop/?shop_id=2' style='font-size:20px;font-weight:100;'>ðŸ’¦</a><br>
        <li>Petpets:</li>
        <a href='https://neopetsclassic.com/viewshop/?shop_id=11' style='font-size:20px;font-weight:100;'>ðŸ¦Ž</a>
        <a href='https://neopetsclassic.com/viewshop/?shop_id=10' style='font-size:20px;font-weight:100;'>ðŸ°</a>
        <a href='https://neopetsclassic.com/viewshop/?shop_id=9' style='font-size:20px;font-weight:100;'>ðŸ¦‹</a>
        <a href='https://neopetsclassic.com/viewshop/?shop_id=8' style='font-size:20px;font-weight:100;'>ðŸ¦ž</a>
        <a href='https://neopetsclassic.com/viewshop/?shop_id=4' style='font-size:20px;font-weight:100;'>ðŸ¶</a>
        <a href='https://neopetsclassic.com/viewshop/?shop_id=22' style='font-size:20px;font-weight:100;'>ðŸœ</a>
        <a href='https://neopetsclassic.com/viewshop/?shop_id=17' style='font-size:20px;font-weight:100;'>ðŸ¦…</a>
        <a href='https://neopetsclassic.com/viewshop/?shop_id=20' style='font-size:20px;font-weight:100;'>ðŸ´</a>

        <li>Job items:</li>
        <a href='https://neopetsclassic.com/viewshop/?shop_id=24' style='font-size:20px;font-weight:100;'>ðŸ§¼</a>
        <a href='https://neopetsclassic.com/viewshop/?shop_id=25' style='font-size:20px;font-weight:100;'>ðŸ‘“</a>
        <a href='https://neopetsclassic.com/viewshop/?shop_id=5' style='font-size:20px;font-weight:100;'>ðŸº</a>
        <a href='https://neopetsclassic.com/viewshop/?shop_id=14' style='font-size:20px;font-weight:100;'>ðŸ§š</a>
        <a href='https://neopetsclassic.com/viewshop/?shop_id=33' style='font-size:20px;font-weight:100;'>ðŸ«</a>
        <a href='https://neopetsclassic.com/viewshop/?shop_id=21' style='font-size:20px;font-weight:100;'>ðŸŽƒ</a>
        <a href='https://neopetsclassic.com/viewshop/?shop_id=32' style='font-size:20px;font-weight:100;'>ðŸŒ±</a>`

        // Adding plots
        trainingModule = trainingModule + `<br><br><br><a href="https://www.jellyclassic.org/shops">Misc:</a><br><li>Plot Links:</li>
        <a href='https://neopetsclassic.com/winter/adventcalendar/' style='font-size:20px;font-weight:100;'>â›„</a>
        <a href='https://neopetsclassic.com/events/negg_festival/' style='font-size:20px;font-weight:100;'>ðŸ§šâ€â™‚ï¸</a>
        <li>New Links:</li>
        <a href='https://neopetsclassic.com/objects/craft_stall/' style='font-size:20px;font-weight:100;'>ðŸŽ¨</a>
        <a href='https://neopetsclassic.com/events/exchange/' style='font-size:20px;font-weight:100;'>ðŸ‘©â€ðŸ”§</a>`

        trainingModule = trainingModule + `</div>`;

        document.getElementsByTagName("body")[0].insertAdjacentHTML("afterbegin", trainingModule)

        // Add on-click event
        document.getElementById("TBD").onclick = function() {
            fishingStorage.display = !fishingStorage.display;
            if (fishingStorage.display){
                console.log("hi")
                document.getElementById("TBD").innerText = "â†‘";
                document.getElementById("fishingModulePets").style.display = "inline";
            }
            else{
                console.log("bye")
                document.getElementById("TBD").innerText = "â†“";
                document.getElementById("fishingModulePets").style.display = "none";
            }
            localStorage.setItem("fishingtracker==", JSON.stringify(fishingStorage));
        };


        setInterval(trainingList, 1000);
    }

})();
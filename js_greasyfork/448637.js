// ==UserScript==
// @name         GC Helper
// @description  Adds helpful timers and links to the GC sidebar.
// @version      0.1
// @author       ben (mushroom)
// @match        https://grundos.cafe/*
// @match        https://www.grundos.cafe/*
// @icon         https://www.google.com/s2/favicons?domain=grundos.cafe
// @namespace https://greasyfork.org/users/727556
// @downloadURL https://update.greasyfork.org/scripts/448637/GC%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/448637/GC%20Helper.meta.js
// ==/UserScript==

var storage;
var fishingStorage;
localStorage.getItem("trainingtrackerGC==") != null ? storage = JSON.parse(localStorage.getItem("trainingtrackerGC==")) : storage = {display: true, students: {}};
localStorage.getItem("fishingtrackerGC==") != null ? fishingStorage = JSON.parse(localStorage.getItem("fishingtrackerGC==")) : fishingStorage = {display: true, pets: {}};

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
    if (currentPage == "https://www.grundos.cafe/island/training/?type=status"){

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

        localStorage.setItem("trainingtrackerGC==", JSON.stringify(storage));
    }

    // When on fishing success page, parse HTML & store in local storage
    if (currentPage == "https://www.grundos.cafe/water/fishing/" && document.body.innerText.lastIndexOf('might be able to') > 0)
    {
        var activePet = usingDefaultTheme ? documentText.substring(documentText.lastIndexOf(' | Pet : ') + 9, documentText.lastIndexOf(' | NP : ')) : documentText.substring(documentText.lastIndexOf('\npet : ') + 7, documentText.lastIndexOf('\nNP : '))
        var hoursUntilNext = documentText.substring(documentText.lastIndexOf('might be able to cast again in about ') + 37, documentText.lastIndexOf('might be able to cast again in about ') + 38)
        var currentLevel = activePet in fishingStorage.pets ? fishingStorage.pets[activePet][1] : "TBD"
        if (documentText.lastIndexOf("fishing level increases to") > 0){
            const levRegex = /fishing level increases to (.*?)!/g;
            var levResult = levRegex.exec(documentText);

            currentLevel = levResult[1];
        }

        fishingStorage.pets[activePet] = [ new Date(currentDate.getTime() + 60*60*1000*parseInt(hoursUntilNext)) , currentLevel ]
        localStorage.setItem("fishingtrackerGC==", JSON.stringify(fishingStorage));
    }

    // When on any page with Neopets sidebar, add training module
    if (document.getElementsByName("a").length > 0)
    {
        var trainingModule = `<div class="tt" style="position:absolute; left:780px; top:10px;"><a href="https://www.grundos.cafe/island/training/?type=status">Training status:</a><br>`
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
        var fishingDisplayArrow = fishingStorage.display ? "↑" : "↓";
        trainingModule = trainingModule + `<br><br><br><a href="/water/fishing/">Underwater fishing:</a> <span style="font-size: 16px; cursor: pointer;" id="TBD">` + fishingDisplayArrow + `</span><div style="display:` + fishingDisplay + `;" id="fishingModulePets"><br><span><a class="sf" href="#" onclick='localStorage.removeItem("fishingtrackerGC==")'>Click to reset pets</a></span>`

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

            var fishingModulePart = `<li><a style="font-size: 10px;" href="/setactivepet/?pet_name=${petName}">${petName}</a> (lvl ${petLevel}): <span id="${petName}_ttf">${timeStringF}</span></li>`

            trainingModule = trainingModule + fishingModulePart;
        }
        trainingModule = trainingModule + `</div>`;


        // Adding dailies
        trainingModule = trainingModule + `<br><br><br><a href="https://www.jellyclassic.org/dailies">Dailies:</a><br><li>Once a day:</li>
        <a href='/bank/' style='font-size:20px;font-weight:100;'>&#128176;</a>
        <a href='/jelly/jelly' style='font-size: 20px; font-weight:100;'>&#127854;</a>
        <a href='/prehistoric/plateau/omelette/' style='font-size: 20px;font-weight:100;'>&#127859;</a>
        <a href='/island/tombola/' style='font-size: 20px; font-weight:100;'>&#128026;</a>
        <a href='/medieval/brightvale/wheel/' style='font-size: 20px; font-weight:100;'>&#128214;</a>
        <a href='/desert/fruitmachine/' style='font-size: 20px; font-weight:100;'>&#127825;</a><br>
        <li>Multiple a day:</li>
        <a href='/winter/kiosk/' style='font-size: 20px; font-weight:100;'>🧊</a>
        <a href='/desert/shrine/' style='font-size: 20px; font-weight:100;'>🐪</a></div>`;

        document.getElementsByTagName("body")[0].insertAdjacentHTML("afterbegin", trainingModule)

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
            localStorage.setItem("fishingtrackerGC==", JSON.stringify(fishingStorage));
        };


        setInterval(trainingList, 1000);
    }

})();
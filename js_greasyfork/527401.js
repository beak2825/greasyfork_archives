// ==UserScript==
// @name     Goatlings Accessibility Mod Unofficial Fork
// @namespace goatlings.accessibilitynew
// @description Accessibility features for Goatlings, now maintained again
// @version  1.2.5
// @grant    none
// @match https://www.goatlings.com/*
// @license GPL
// @downloadURL https://update.greasyfork.org/scripts/527401/Goatlings%20Accessibility%20Mod%20Unofficial%20Fork.user.js
// @updateURL https://update.greasyfork.org/scripts/527401/Goatlings%20Accessibility%20Mod%20Unofficial%20Fork.meta.js
// ==/UserScript==

let page = document.location.href;
let modsActive = false; // Mostly to show the "Shortcuts Active" window
let mode = ""; // Where are we, and thus what to do?
let isSearching = false; // Are we using search bar?
let debugMode = false; // Debug keybind for bug reports.

// each one of these conditions should have three parts:
// 1. assign the current mode
// 2. make mods active
// 3. style page to fit mode

// Text replacement, mode assignment
if (isSearching === false) {
    if (page.includes("battle") && !page.includes("inventory")) { // Battle stuff
        mode = "battle";
        modsActive = true;

        if (page === "https://www.goatlings.com/battle"){
            findText("Battle Center").innerHTML += " (1)";
            findText("Training Center").innerHTML += " (2)";
            findText("Your Battle").innerHTML += " (3)";
            findText("Your Goatlings").innerHTML += " (4)"
        } else if (page === "https://www.goatlings.com/battle/challengers" || page === "https://www.goatlings.com/battle/train_challengers") {
            let battleButtons = document.querySelectorAll('input[type="submit" i]');
            let letterArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
            for (var i = 1; i < battleButtons.length; i++) {
                battleButtons[i].value = battleButtons[i].value + ` (${letterArray[i - 1]})`
            }
            findText("Battle Center").innerHTML += " (1)";
            findText("Training Center").innerHTML += " (2)";
            findText("Your Battle").innerHTML += " (3)";
            findText("Manage Battle Equips").innerHTML += " (4)"
        } else if (page === "https://www.goatlings.com/battle/thebattle") {
            window.battleItems = document.querySelectorAll(".itema");
            document.getElementsByName("s")[1].value = "Press Spacebar to " + document.getElementsByName("s")[1].value
            for (i = 0; i < window.battleItems.length; i++) {
                window.battleItems[i].innerHTML += `<br> ${i+1}`;
            }
            let endLink = findText("+THE BATTLE IS OVER! CLICK HERE TO FINALIZE AND CLAIM REWARDS!+");
            if (endLink) {
                endLink.innerHTML += "<br>PRESS SPACE TO CONTINUE";
            }
        } else if (page === "https://www.goatlings.com/battle/over") {
            findText("Battle Center").innerHTML += " (1)";
            findText("Training Center").innerHTML += " (2)";
            findText("Current Explore Adventure").innerHTML += " (3)";
            findText("Your Inventory").innerHTML += " (4)";
            findText("Your Goatlings").innerHTML += " (5)";
            if (document.querySelectorAll('input[type="submit" i]')[1]) {
                document.querySelectorAll('input[type="submit" i]')[1].value = "Press Spacebar to Battle Again";
            }
        } else if (page === "https://www.goatlings.com/battle/create_temp") {
            findText("inventory").textContent += " (Press Spacebar)";
        }
    } else if (page.includes("explore")) { // Explore mode
        modsActive = true;

        if (page.includes("view")){
            mode = "explore";

            if (findText("Start Battle")) {
                findText("Start Battle").textContent += " (1)"
                findText("Run Away").textContent += " (2)"
            }
            if (findText("Go Back")) {
                findText("Go Back").textContent += " (Spacebar)"
            }
            if (findText("Explore Again!")) {
                findText("Explore Again!").textContent += " (Spacebar)"
            } else {
                document.body.innerHTML = document.body.innerHTML.replace('map anywhere', 'map anywhere <b>or press spacebar</b>');
            }
        } else if (page.includes("create")) {
            mode = "explore_back";
            modsActive = true;
        } else {
            mode = "explore_index"

            if (findText("View Current Explore")) {
                findText("View Current Explore").textContent += " (1)"
                findText("View Current Battle").textContent += " (2)"
                findText("View Explore Archives").textContent += " (3)"
            }

            // none of these variables work properly here,
            // but making them properties of the window fixes it
            // idk but it works like this, so don't change it unless you know what you're doing
            // and you probably don't
            window.eAreas = document.querySelectorAll("center > div");

            window.eAreasArray = Array.prototype.slice.call(window.eAreas);

            window.x1 = window.eAreasArray.slice(0, 5);
            window.x2 = window.eAreasArray.slice(5, 10);
            window.x3 = window.eAreasArray.slice(10, 15);
            window.x4 = window.eAreasArray.slice(15, 20);
            window.x5 = window.eAreasArray.slice(20, 25);
            window.x6 = window.eAreasArray.slice(25, 30);
            window.x7 = window.eAreasArray.slice(30, 35);
            // CM: This one is special event explores.
            // Very bandage-fixed unfortunately! Will
            // require manual updates every new or less
            // explore area(s)!
            // window.x8 = window.eAreasArray.slice(35, 36);

            window.y = [window.x1, window.x2, window.x3, window.x4, window.x5, window.x6, window.x7]
            // window.y = [window.x1, window.x2, window.x3, window.x4, window.x5, window.x6, window.x7, window.x8]


            window.yPos = 0;
            window.xPos = 0;

            window.currentOption = y[window.yPos][window.xPos];

            window.currentOption.style.border = "5px red solid";
        }
    } else if (page.includes("hol")) { // Higher Or Lower
        mode = "hol";
        modsActive = true;

        if (page === "https://www.goatlings.com/hol") {
            document.getElementsByName("s")[1].value = "Press Spacebar to Play";
        } else if (page === "https://www.goatlings.com/hol/view") {
            document.getElementsByName("high")[0].value += " (1)";
            document.getElementsByName("low")[0].value += " (2)";
        } else if (page === "https://www.goatlings.com/hol/go") {
            let battleButtons = document.getElementsByName("s");
            for (i = 1; i < battleButtons.length; i++) {
                battleButtons[i].value = battleButtons[i].value + ` (${i})`
            }
        }
    } else if (page.includes("rps")) { // Flutter Snap
        mode = "rps";
        modsActive = true;

        if (page == "https://www.goatlings.com/rps") {
            document.body.innerHTML = document.body.innerHTML.replace("https://www.goatlings.com/images/games/rps/Butterfly.jpg", "https://kittehpuppy.com/other/goatlings/Butterfly1.jpg");
            document.body.innerHTML = document.body.innerHTML.replace("https://www.goatlings.com/images/games/rps/Flower.jpg", "https://kittehpuppy.com/other/goatlings/Flower2.jpg");
            document.body.innerHTML = document.body.innerHTML.replace("https://www.goatlings.com/images/games/rps/Net.jpg", "https://kittehpuppy.com/other/goatlings/Net3.jpg");
        } else if (page.includes("play")) {
            findText("Play Again?").textContent = "Press Spacebar to play again!";
        }
    } else if (page.includes("create")) { // Adoption Options
        mode = "adopt"
        modsActive = true;
        if (page == "https://www.goatlings.com/create" || page == "https://www.goatlings.com/create/") {
            document.body.innerHTML = document.body.innerHTML.replace("https://www.goatlings.com/images/create/tradebanner.png", "https://kittehpuppy.com/other/goatlings/trade1.png");
            document.body.innerHTML = document.body.innerHTML.replace("https://www.goatlings.com/images/create/rehomebanner.png", "https://kittehpuppy.com/other/goatlings/rehome2.png");
            document.body.innerHTML = document.body.innerHTML.replace("https://www.goatlings.com/images/create/adoptbanner.png", "https://kittehpuppy.com/other/goatlings/adopt3.png");
            document.body.innerHTML = document.body.innerHTML.replace("https://www.goatlings.com/images/create/surrbanner.png", "https://kittehpuppy.com/other/goatlings/surrender4.png");
        }
    } else if (page.includes("arcade")) { // Arcade index
        mode = "arcade_index"
        modsActive = true;
        if (page == "https://www.goatlings.com/arcade" || page == "https://www.goatlings.com/arcade/") {
            window.aAreas = document.querySelectorAll("tr > td");

            window.aAreasArray = Array.prototype.slice.call(window.aAreas);

            window.x1 = window.aAreasArray.slice(0, 4);
            window.x2 = window.aAreasArray.slice(4, 8);
            window.x3 = window.aAreasArray.slice(8, 12);
            window.x4 = window.aAreasArray.slice(12, 16);
            window.x5 = window.aAreasArray.slice(17, 19);

            window.y = [window.x1, window.x2, window.x3, window.x4, window.x5]


            window.yPos = 0;
            window.xPos = 0;

            window.currentOption = y[window.yPos][window.xPos];

            window.currentOption.style.border = "5px red solid";
        }
    } else if (page.includes("drop_box")) { // Magic Hat
        mode = "mh"
        modsActive = true;
        document.body.innerHTML = document.body.innerHTML.replace("get back!", "get back!<br>Press 1 to select an item. Press 2 to drop it!")
    } else if (page.includes("daily_item")) { // Daily Gachapon
        mode = "dgp"
        modsActive = true;
        document.getElementsByName("s")[1].value = "Crank the handle! (Spacebar)";
    } else if (page.includes("token")) { // Goat Token Game
        mode = "gt";
        modsActive = true;
        if (page == "https://www.goatlings.com/token" || page == "https://www.goatlings.com/token/") {
            document.getElementsByName("s")[1].value = "Use 1 Goat Token (Spacebar)";
        }
        if (findText("Click here to play again!")) {
            findText("Click here to play again!").textContent += " (Spacebar)";
        }
    } else if (page.includes("catchstar")) { // Catch a falling star
        mode = "fallingstar";
        modsActive = true;
        if (page == "https://www.goatlings.com/catchstar" || page == "https://www.goatlings.com/catchstar/") {
            document.getElementsByName("s")[1].value = "Catch some Sugar Stars! (Spacebar)";
        }
        if (findText("Click here to play again!")) {
            findText("Click here to play again!").textContent += " (Spacebar)";
        }
    } else if (page.includes("raffle")) { // Raffle
        mode = "raffle"
        modsActive = true;
        document.getElementsByName("s")[1].value = "Buy Ticket (1)";
        findText("Back to Arcade").textContent += " (2)"
    } else if (page.includes("shops")) { // Shops
        mode = "shops"
        modsActive = true;
        window.sAreas = document.querySelectorAll(".shopItem");

        window.sAreasArray = Array.prototype.slice.call(window.sAreas);

        window.x1 = window.sAreasArray.slice(0, window.sAreasArray.length);

        window.Pos = 0;

        window.currentOption = window.x1[window.Pos];

        window.currentOption.style.border = "1px red solid";

        if (findText('Go Back To Shopping District')) {
            findText('Go Back To Shopping District').textContent += " (1)";
        }
        if (findText('Shop Stock Archive')) {
            findText('Shop Stock Archive').textContent += " (2)";
        }
    } else if (page.includes("mystuff")) { // My Stuff index
        mode = "mystuff"
        modsActive = true;
        if (page === "https://www.goatlings.com/mystuff" || page === "https://www.goatlings.com/mystuff/") {
            window.aAreas = document.querySelectorAll(".mystuff");

            window.aAreasArray = Array.prototype.slice.call(window.aAreas);

            window.x1 = window.aAreasArray.slice(0, 5);
            window.x2 = window.aAreasArray.slice(5, 10);
            window.x3 = window.aAreasArray.slice(10, 15);

            window.y = [window.x1, window.x2, window.x3]


            window.yPos = 0;
            window.xPos = 0;

            window.currentOption = y[window.yPos][window.xPos];

            window.currentOption.style.border = "3px red solid";
        }
    } else if (page.includes("ExploreArchive")) { // My Stuff index
        mode = "explore"
        modsActive = true;
    }
}

// find element that contains passed text, stored in variable toFind
function findText(toFind) {
    let xpath = `//a[text()='${toFind}']`;
    let matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    return matchingElement;
}

function battle_function(key) {
    if (page === "https://www.goatlings.com/battle") {
        // If on the main battle page
        if (key == 1) {
            findText("Battle Center (1)").click();
        } else if (key == 2) {
            findText("Training Center (2)").click();
        } else if (key == 3) {
            findText("Your Battle (3)").click();
        } else if (key == 4) {
            findText("Your Pets (4)").click();
        }
    } else if (page === "https://www.goatlings.com/battle/challengers" || page === "https://www.goatlings.com/battle/train_challengers") {
        let letterArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        if (letterArray.includes(key)) {
            let newkey = key.charCodeAt(0) - 96
            let battleButtons = document.querySelectorAll('input[type="submit" i]');
            battleButtons[newkey].click();
        }
        if (key == 1) {
            findText("Battle Center (1)").click();
        } else if (key == 2) {
            findText("Training Center (2)").click();
        } else if (key == 3) {
            findText("Your Battle (3)").click();
        } else if (key == 4) {
            findText("Your Pets (4)").click();
        }
    } else if (page === "https://www.goatlings.com/battle/thebattle") {
        // If in the actual battle

        if (key === ' ' || key === 'Spacebar'){
            let endLink = findText("+THE BATTLE IS OVER! CLICK HERE TO FINALIZE AND CLAIM REWARDS!+");
            if (endLink) {
                endLink.click();
            } else {
                endLink = document.getElementsByName("s")[1];
                endLink.click();
            }
        } else if (key < 10) {
            window.battleItems[key - 1].childNodes[0].click();
        }
    } else if (page === "https://www.goatlings.com/battle/over") {
        // If on the main battle page OR battle over page
        if (key == 1) {
            findText("Battle Center (1)").click();
        } else if (key == 2) {
            findText("Training Center (2)").click();
        } else if (key == 3) {
            findText("Current Explore Adventure (3)").click();
        } else if (key == 4) {
            findText("Your Inventory (4)").click();
        } else if (key == 5) {
            findText("Your Goatlings (5)").click();
        } else if (key === ' ' || key === "Spacebar") {
            document.querySelectorAll('input[type="submit" i]')[1].click();
        }
    } else if (page.includes("https://www.goatlings.com/battle/attack")){
        if (key === ' ' || key === 'Spacebar'){
            let returnLink = findText("Click here to go back");
            returnLink.click();
        }
    } else if (page === "https://www.goatlings.com/battle/create_temp") {
        if (key === ' ' || key === 'Spacebar'){
            findText("inventory (Press Spacebar)").click()
        }
    }
}

function explore_function(key) {
    if (page.includes("view")) {
        if (key === ' ' || key === 'Spacebar'){
            if (findText("Explore Again! (Spacebar)")) {
                let tryAgain = findText("Explore Again! (Spacebar)");
                tryAgain.click();
            } else if (findText("Go Back (Spacebar)")) {
                let goBack = findText("Go Back (Spacebar)");
                goBack.click();
            } else {
                let exploreWindow = document.querySelector("#content > center > a");
                exploreWindow.click();
            }
        } else if (key == 1) {
            let yesBattle = findText("Start Battle (1)")
            yesBattle.click()
        } else if (key == 2) {
            let noBattle = findText("Run Away (2)")
            noBattle.click()
        }
    } else if (page.includes("create")) {
        if (key === ' ' || key === 'Spacebar'){
            if (findText("Click here to continue.")) {
                let continueBattle = findText("Click here to continue.");
                continueBattle.click();
            }
        }
    } else if (page === "https://www.goatlings.com/ExploreArchive" || page === "https://www.goatlings.com/ExploreArchive/") {
        if (key === ' ' || key === 'Spacebar'){
            if (findText("Back to Explore")) {
                let backExplore = findText("Back to Explore");
                backExplore.click();
            }
        }
    }
}


function explore_index_function(key) {
    if (key == "ArrowUp") {
        if (window.yPos > 0) {
            window.yPos -= 1;
        }
    } else if (key == "ArrowDown") {
        if (window.yPos < 6) { // CM: change to 7 when event explores appear (bandage-fix)
            window.yPos += 1;
        }
        if (window.yPos == 7) {
            window.xPos = 0;
        }
    } else if (key == "ArrowLeft" && window.yPos < 7) {
        if (window.xPos > 0) {
            window.xPos -= 1;
        }
    } else if (key == "ArrowRight" && window.yPos < 7) {
        if (window.xPos < 4) {
            window.xPos += 1;
        }
    }
    window.currentOption.style.border = "";
    window.currentOption = y[window.yPos][window.xPos];
    window.currentOption.style.border = "5px red solid";

    if (key === ' ' || key === 'Spacebar'){
        window.currentOption.childNodes[0].click();
    }
    if (key == 1){
        if (findText("View Current Explore (1)")) {
            let curExplore = findText("View Current Explore (1)");
            curExplore.click();
        }
    } else if (key == 2) {
        if (findText("View Current Battle (2)")) {
            let curBattle = findText("View Current Battle (2)");
            curBattle.click();
        }
    } else if (key == 3) {
        if (findText("View Explore Archives (3)")) {
            let exploreArchives = findText("View Explore Archives (3)");
            exploreArchives.click();
        }
    }
}

function mystuff_function(key) {
    if (key == "ArrowUp") {
        if (window.yPos > 0) {
            window.yPos -= 1;
        }
    } else if (key == "ArrowDown") {
        if (window.yPos < 2) {
            window.yPos += 1;
        }
    } else if (key == "ArrowLeft") {
        if (window.xPos > 0) {
            window.xPos -= 1;
        }
    } else if (key == "ArrowRight") {
        if (window.xPos < 4) {
            window.xPos += 1;
        }
    }
    window.currentOption.style.border = "";
    window.currentOption = y[window.yPos][window.xPos];
    window.currentOption.style.border = "3px red solid";

    if (key === ' ' || key === 'Spacebar'){
        window.currentOption.childNodes[0].click();
    }
}

function shops_function(key) {
    if (key == "ArrowLeft") {
        if (window.Pos > 0) {
            window.Pos -= 1;
        }
    } else if (key == "ArrowRight") {
        if (window.Pos < window.sAreasArray.length - 1) {
            window.Pos += 1;
        }
    }
    window.currentOption.style.border = "";
    window.currentOption = window.x1[window.Pos];
    window.currentOption.style.border = "1px red solid";

    if (key === ' ' || key === 'Spacebar'){
        window.currentOption.childNodes[1].click();
    } else if (key == 1) {
        if (findText("Go Back To Shopping District (1)")) {
            let goBack = findText("Go Back To Shopping District (1)");
            goBack.click();
        }
    } else if (key == 2) {
        if (findText("Shop Stock Archive (2)")) {
            let goArchive = findText("Shop Stock Archive (2)");
            goArchive.click();
        }
    }
}

function hol_function(key) {
    if (page === "https://www.goatlings.com/hol") {
        if (key === ' ' || key === 'Spacebar'){
            // "Play" button is given name "s"
            document.getElementsByName("s")[1].click();
        }
    } else if (page === "https://www.goatlings.com/hol/view") {
        if (key == 1){
            document.getElementsByName("high")[0].click();
        } else if (key == 2) {
            document.getElementsByName("low")[0].click();
        }
    } else if (page === "https://www.goatlings.com/hol/go") {
        if (key == 1 || key == 2){
            // "Play Again" and "Collect Pot" buttons are named "s"
            // buttons are contained in separate forms
            document.getElementsByName("s")[key].click();
        }
    }
}


function mh_function(key) {
    if (key == 1){
        document.getElementsByName("itemid")[0].focus();
    } else if (key == 2) {
        document.getElementsByName("s")[1].click();
    } else if (key == ' ' || key == "Spacebar") {
        let backToArcade = findText("Go back to the Arcade")
        backToArcade.click()
    }
}

function dgp_function(key) {
    if (key == ' ' || key == "Spacebar") {
        if (document.getElementsByName("s")[1]) {
            document.getElementsByName("s")[1].click();
        }
    }
}


function raffle_function(key) {
    if (key == 1) {
        if (document.getElementsByName("s")[1]) {
            document.getElementsByName("s")[1].click();
        }
    } else if (key == 2) {
        if (findText("Back to Arcade (2)")) {
            let backToArcade = findText("Back to Arcade (2)")
            backToArcade.click()
        }
    }
}

function gt_function(key) {
    if (key == ' ' || key == "Spacebar") {
        if (document.getElementsByName("s")[1]) {
            document.getElementsByName("s")[1].click();
        }
        if (findText("Click here to play again! (Spacebar)")) {
            let playAgain = findText("Click here to play again! (Spacebar)")
            playAgain.click()
        }
    }
}

function fstar_function(key) {
    if (key == ' ' || key == "Spacebar") {
        if (document.getElementsByName("s")[1]) {
            document.getElementsByName("s")[1].click();
        }
        if (findText("Click here to play again! (Spacebar)")) {
            let playAgain = findText("Click here to play again! (Spacebar)")
            playAgain.click()
        }
    }
}


function arcade_index_function(key) {
    if (key == "ArrowUp") {
        if (window.yPos > 0) {
            window.yPos -= 1;
        }
    } else if (key == "ArrowDown") {
        if (window.yPos < 4) {
            if (window.xPos > 1 && window.yPos == 3) {
                window.xPos = 1;
                window.yPos += 1;
            } else {
                window.yPos += 1;
            }
        }
    } else if (key == "ArrowLeft" && window.yPos < 5) {
        if (window.xPos > 0) {
            window.xPos -= 1;
        }
    } else if (key == "ArrowRight" && window.yPos < 5) {
        if (window.yPos == 4) {
            if (window.xPos < 1) {
                window.xPos += 1;
            }
        } else {
            if (window.xPos < 3) {
                window.xPos += 1;
            }
        }
    }
    window.currentOption.style.border = "";
    window.currentOption = y[window.yPos][window.xPos];
    window.currentOption.style.border = "5px red solid";

    if (key === ' ' || key === 'Spacebar'){
        window.currentOption.childNodes[0].click();
    }
}

function rps_function(key) {
    if (page.includes("play") && (key === ' ' || key === 'Spacebar')) {
        findText("Press Spacebar to play again!").click();
    } else if (page == "https://www.goatlings.com/rps") {
        let butterfly = Array.prototype.slice.call(document.querySelectorAll("a[href='https://www.goatlings.com/rps/play/2']"))[0];
        let flower = Array.prototype.slice.call(document.querySelectorAll("a[href='https://www.goatlings.com/rps/play/3']"))[0];
        let net = Array.prototype.slice.call(document.querySelectorAll("a[href='https://www.goatlings.com/rps/play/1']"))[0];

        let rps_array = [butterfly, flower, net];

        if (key > 0 && key < 4) {
            rps_array[key - 1].click();
        }
    }
}

function adopt_function(key) {
    if (page.includes("create")) {
        let trade = Array.prototype.slice.call(document.querySelectorAll("a[href='https://www.goatlings.com/GoatTrades/']"))[0];
        let rehome = Array.prototype.slice.call(document.querySelectorAll("a[href='https://www.goatlings.com/create/adopt/']"))[0];
        let adopt = Array.prototype.slice.call(document.querySelectorAll("a[href='https://www.goatlings.com/create/cre/']"))[0];
        let surrender = Array.prototype.slice.call(document.querySelectorAll("a[href='https://www.goatlings.com/create/surrender/']"))[0];

        let adopt_array = [trade, rehome, adopt, surrender];

        if (key > 0 && key < 5) {
            adopt_array[key - 1].click();
        }
        if (key == ' ' || key == 'Spacebar') {
            if (findText("Back to the Adoption Center")) {
                findText("Back to the Adoption Center").click()
            }
        }
    }
}

function kPress(e) {
    switch (mode) {
        case "battle":
            battle_function(e.key);
            break;
        case "explore":
            explore_function(e.key);
            break;
        case "explore_index":
            explore_index_function(e.key);
            break;
        case "explore_back":
            explore_function(e.key);
            break;
        case "hol":
            hol_function(e.key);
            break;
        case "rps":
            rps_function(e.key);
            break;
        case "adopt":
            adopt_function(e.key);
            break;
        case "arcade_index":
            arcade_index_function(e.key);
            break;
        case "mh":
            mh_function(e.key);
            break;
        case "dgp":
            dgp_function(e.key);
            break;
        case "raffle":
            raffle_function(e.key);
            break;
        case "shops":
            shops_function(e.key);
            break;
        case "mystuff":
            mystuff_function(e.key);
            break;
        case "gt":
            gt_function(e.key);
            break;
        case "fallingstar":
            fstar_function(e.key);
            break;
    }
}

function kPressSearch(e) {
    search_function(e.key);
}

if (modsActive == true) {
    // creates the HUD element letting user know that shortcuts are active
    var hud = document.createElement("span");
    hud.innerHTML = "Shortcuts Active";
    hud.style = "top:10;left:10;position:absolute;z-index: 9999;color:white;font-weight:bold;background:green;border:5px green solid;font-size:16px"
    document.body.appendChild(hud);

    // adds key event listener
    window.addEventListener('keydown', kPress);
}

// CM: Search function. It also serves as a debug mode activator as both functions are global.
function search_function(key) {
    // CM: Search functionality
    if (key === 'Escape') {
        isSearching = !isSearching;
        if (isSearching === true) {
            document.getElementsByName('search')[0].focus();
            window.removeEventListener('keydown', kPress);
        } else {
            document.getElementsByName('search')[0].blur();
            window.addEventListener('keydown', kPress);
        }
    }
    // CM: Debug functionality
    if (key === 'Delete') {
        if (hud !== null) {
            hud.innerHTML = mode;
        }
    }
}

// CM: Global keybind event listeners.
window.addEventListener('keydown', kPressSearch);
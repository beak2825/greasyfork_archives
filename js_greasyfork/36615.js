// ==UserScript==
// @name     [deprecated] Auto Farm Change Button and Maximum Distance for not-UK33
// @description Farms automatically with loot assistant
// @version 1.2.3.4
// @require https://code.jquery.com/jquery-3.2.1.min.js
// @include https://*/game.php?village=*&screen=am_farm*


// @namespace https://greasyfork.org/users/151096
// @downloadURL https://update.greasyfork.org/scripts/36615/%5Bdeprecated%5D%20Auto%20Farm%20Change%20Button%20and%20Maximum%20Distance%20for%20not-UK33.user.js
// @updateURL https://update.greasyfork.org/scripts/36615/%5Bdeprecated%5D%20Auto%20Farm%20Change%20Button%20and%20Maximum%20Distance%20for%20not-UK33.meta.js
// ==/UserScript==

var now = new Date();
var time = 1513043460;
var timeNow = Math.round(new Date().getTime()/1000.0);

if (timeNow < time) {
    setInterval(function(){
        timeNow = Math.round(new Date().getTime()/1000.0);
        console.log(timeNow);
        if(timeNow > time) {
            farm();
            window.location.reload();
        }
    }, 1000);
}
if(timeNow > time) {
    farm();
}
function farm() {
    // Set maximum farm distance
    window.maxDistance = 20; // Change this value to set maximum farm distance for A
    window.maxDistanceA = 20;
    window.maxDistanceB = 10; // Change this value to set maximum farm distance for B and C
    window.maxDistanceC = 10; // Change this value to set maximum farm distance for C

    var menu = $('#am_widget_Farm a.farm_icon_a'); // Use farm button A to farm
    var refreshPage = 1; // No idea what this is
    var speed = 350; // No idea what this is
    var x = 0; // No idea what this is
    var myVar = ""; // No idea what this is
    var removeAttacks = 0; // No idea what this is

    // Create arrays to store units in farm button A and B and units present in village
    var butA = new Array();
    var butB = new Array();
    var unitInVill = new Array();

    // Put units in button A into array
    for(var i = 0;i < 6;i++){
        butA[i] = parseInt($("#content_value").children().eq(3).children().eq(1).children().children().children().children().eq(1).children().eq(i).children().val());
    }
    // Put units in button B into array
    for(var i = 0;i < 6;i++){
        butB[i] = parseInt($("#content_value").children().eq(3).children().eq(1).children().eq(1).children().children().children().eq(1).children().eq(i).children().val());
    }

    // Put units present in village into array
    unitInVill[0] = parseInt($("#spear").text()); // Get the number of spear units present in village
    unitInVill[1] = parseInt($("#sword").text()); // Get the number of sword units present in village
    unitInVill[2] = parseInt($("#axe").text()); // Get the number of axe units present in village
    unitInVill[3] = parseInt($("#spy").text()); // Get the number of spy units present in village
    unitInVill[4] = parseInt($("#light").text()); // Get the number of light units present in village
    unitInVill[5] = parseInt($("#heavy").text()); // Get the number of heavy units present in village
    var butABoo = 0; // This will be used later to set the maximum distance and which button to farm with
    var butBBoo = 0; // This will be used later to set the maximum distance and which button to farm with


    if (removeAttacks == 1) {
        $('img').each(function() {
            var tempStr = $(this).attr('src');
            if (tempStr.indexOf('attack') != -1) {
                $(this).addClass('tooltip');
            }
        });
    }

    // I don't know what this does
    if (refreshPage == 1) {
        setInterval(function() {
            window.location.reload();
        }, 20000);
    }

    // Sets the time how long it takes to switch villages
    var switchVillSpeed = random(3000, 4500); // Switch village between a random number between 2 and 4 seconds


    function random(maximum, minimum) {
        numPossibilities = maximum - minimum;
        aleat = Math.random() * numPossibilities;
        return Math.round(parseInt(minimum) + aleat);
    }


    // If any any of the units in the village that are present are fewer than button A requires, butABoo will be set to false, meaning there aren't enough units in the village to send an attack with button A
    if(unitInVill[0] < butA[0] || unitInVill[1] < butA[1] || unitInVill[2] < butA[2] || unitInVill[3] < butA[3] || unitInVill[4] < butA[4] || unitInVill[5] < butA[5]){
        butABoo = 0;
    } else {
        butABoo = 1;
    }
    // If any any of the units in the village that are present are fewer than button B requires, butABoo will be set to false, meaning there aren't enough units in the village to send an attack with button B
    if(unitInVill[0] < butB[0] || unitInVill[1] < butB[1] || unitInVill[2] < butB[2] || unitInVill[3] < butB[3] || unitInVill[4] < butB[4] || unitInVill[5] < butB[5]){
        butBBoo = 0;
    } else {
        butBBoo = 1;
    }
    var test = "nothing";
    // If butABoo was set to 1/true in the if-statement above, button A will be chosen to execute the farm script.
    if(butABoo){
        menu = $('#am_widget_Farm a.farm_icon_a'); // Choose button A to farm with
        console.log("Choose A");
        test = "a";
        window.maxDistance = window.maxDistanceA;
    } else if(butBBoo){
        menu = $('#am_widget_Farm a.farm_icon_b'); // Choose button B to farm with
        test = "b";
        console.log("Choose B");
        window.maxDistance = window.maxDistanceB; // Change maximum distance because there are swordmen in button B and they are much slower than lcav.
    } else {
        menu = $('#am_widget_Farm a.farm_icon_c'); // Choose button C to farm with
        test = "c";
        console.log("Choose C");
        window.maxDistance = window.maxDistanceC; // Change maximum distance because there are swordmen in button C and they are much slower than lcav.
    }


    // The actual script to launch the attacks.
    var distance = 0; // Instantiate distance. It will record the distance from the village to the first barbarian village in the farm assistant.
    for (i = 0; i < 100; i++) {
        distance = parseInt($("#plunder_list").children().children().eq(2 + i).children().eq(7).text()); // Get the distance to the barb villa
        if (distance <= window.maxDistance) {
            $(menu).eq(i).each(function() {
                if (!($(this).parent().parent().find('img.tooltip').length)) {
                    console.log(test);
                    var speedNow = (speed * ++x) - random(250, 400);
                    setTimeout(function(myVar) {
                        $(myVar).click();
                    }, speedNow, this);
                }
            });
        }
    }

    if(unitInVill[2] < 100 && unitInVill[4] < 30 && unitInVill[5] < 1){
        switchVillSpeed = random(500, 700); // Switch village after 200-400ms if there aren't many units in the village left.
    }
    console.log("Wait " + switchVillSpeed + " milliseconds to switch villages.");

    // Function to switch villages
    function switchVillage() {
        $('.arrowRight').click();
        $('.groupRight').click();
    }
    setInterval(switchVillage, switchVillSpeed);
}


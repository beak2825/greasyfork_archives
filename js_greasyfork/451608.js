// ==UserScript==

// @name BC.Game CoinDrops_Modified

// @namespace http://tampermonkey.net/

// @version 666

// @description CoinGrabber_Modified

// @author ZDeezNutZ

// @match https://bc.app/*
// @grant none

// @downloadURL https://update.greasyfork.org/scripts/451608/BCGame%20CoinDrops_Modified.user.js
// @updateURL https://update.greasyfork.org/scripts/451608/BCGame%20CoinDrops_Modified.meta.js
// ==/UserScript==





// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

//         SET THE TIMES SCRIPT RUNS

// Hours are all in your current time zone

var myHours = [8, 9, 10, 13, 14, 15, 16, 17, 18, 19];

// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||





var date = new Date();

var hours = date.getHours();

var day = date.getDay();

var myDay = false;

var isDrop = false;

var canGrab = true;

var theShit = setInterval(doThings,1000);



function dayCheck() {

    date = new Date();

    day = date.getDay();

    console.log('Hours = ' + hours);

    if (day < 32) {

        myDay = true;

        //Checks if it is your hour to grab (runs every 10 minutes)

        setInterval(hourCheck, 600000);

    }else{

        myDay = false;

        canGrab = true;

        //Check the day (runs every 60 minutes)

        setInterval(dayCheck, 3600000);

        //Don't run if not needed

        clearInterval(hourCheck);

        clearInterval(theShit);

    }

}





function hourCheck() {

    hours = date.getHours();

    var n = myHours.includes(hours);

    //Time to grab, go Hunting

    if (n == true) {

        canGrab = true;

        //Repeat process every 5 seconds

        theShit = setInterval(doThings, 1000);

    }else{

        //Remove CoinDrop Grabber, not our time

        clearInterval(theShit);

        canGrab = true;

    }

}



function doThings() {
    var theLength = document.getElementsByClassName("coindrop-status").length - 1;
    // For Loop Thru And Click Any Coin Drops Up For Grabs!

    for(var i = theLength; i >= 0; i--) {

        // Get Coin Drop Status

        if(document.getElementsByClassName("coindrop-status")[i].innerText == "Grab") {

            isDrop = true;

            if (canGrab == true) {

            // If grab Click It!

                document.getElementsByClassName("coindrop-status")[i].click();

            // Click Grab Coin Drop

                //setTimeout(function() {document.elementFromPoint(956, 611).click()},500);

                //setTimeout(function() {document.elementFromPoint(956, 611).click()},1000);

                //setTimeout(function() {document.querySelector("#cion > img.open-img-wrap").click()},550);

                //setTimeout(function() {document.querySelector("#cion > img.open-img-wrap").click()},550);
                //setTimeout(function() {console.log(document.querySelector(".coindrop-main button.open-view"))},1550);

                //setTimeout(function() {document.querySelector(".coindrop-main button.open-view").click()},1550);

                setTimeout(function() {document.elementFromPoint(962, 656).click()},580);
                setTimeout(function() {document.elementFromPoint(962, 656).click()},750);
                setTimeout(function() {document.elementFromPoint(962, 656).click()},1000);
                setTimeout(function() {document.elementFromPoint(962, 656).click()},1200);
                setTimeout(function() {document.elementFromPoint(962, 656).click()},1500);


                console.log('Grabbed bag at ' + date);

                //We just grabbed, don't grab again for another minute

                canGrab = false;

                setTimeout(gotDrop, 10000);

            }else{

                console.log('Not within our times to grab ');

            }

        }

    }

}



if(isDrop) {

    isDrop = false;

    canGrab = true;

}else{

    // Reset variable

    canGrab = true;

    // During time we can grab?

    for (var i = 0; i < myHours.length; i++) {

        if (myHours[i] == hours) {

            canGrab = true;

        }

    }

}



function gotDrop() {

    canGrab = true;

}
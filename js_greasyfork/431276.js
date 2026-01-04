// ==UserScript==
// @name         ConsoleHelper
// @namespace    https://github.com/FriendlyBaron/ConsoleHelper
// @version      1.2
// @description  Hides PC runs from the GTAV Speedrun.com Leaderboard
// @author       @Friendlybaron
// @match        https://www.speedrun.com/gtav*
// @grant        GM_xmlhttpRequest
// @require      http://code.jquery.com/jquery-3.5.1.js
// @downloadURL https://update.greasyfork.org/scripts/431276/ConsoleHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/431276/ConsoleHelper.meta.js
// ==/UserScript==

//Note: if you want to run this on games other than GTAV, you can add another @match line with, for example, 'https://www.speedrun.com/gtasa*', or just do 'https://www.speedrun.com/*' to run on any speedrun.com page

var $j = window.jQuery //Setting up variable for jQuery, which makes it easier to traverse the page's contents

var enabled = false; //varaible for whether or not we should stop hiding the PC runs

var urlText = window.location.href; //variable storing current URL browser is at\

$j("button[class='x-input-button rounded text-sm px-2.5 py-1.5 bg-input text-on-input border border-around-input hover:bg-input-hover disabled:bg-input w-32']").each(function( index ) //Searching the document for the button type we want to copy for setup
{
    if($j( this ).text().includes("Show rules")) //Selecting the "View Rules" button. For ease, we'll just copy it and modify a few things for our "Hide PC Runs" button
    {
        var buttonClone = $j( this ).clone(); //cloning the button so we can edit it
        buttonClone.attr("id", "filterPcRuns"); //setting the ID of our new button for use when it's clicked
        buttonClone.attr("href", ""); //removing the link from the button so it no longer opens the rules page
        buttonClone.text("Hide PC Runs"); //setting the name of the button
        buttonClone.appendTo($j( this ).parent()) //adding the button to the page next to the 'View Rules' and 'Submit Run' buttons
    }
});


$j("#filterPcRuns").click ( function () { //this watches for a button with the ID we setup earlier being clicked
    var theButton = $j("#filterPcRuns") //getting a variable of our button

    if(enabled) //if hiding pc runs is enabled, we will be disabling it by doing:
    {
        theButton.text("Working hide duplicate players..."); //set text of the button to let the user know things are in-progress
        enabled = !enabled //flip the enabled status
        setTimeout(checkIfDuplicateRunsDisabled, 50); //first, we need to disable duplicate runs. will explain why later in code
    }
    else //if hiding runs isnt enabled, we enable it be doing the following:
    {
        theButton.text("Working to find duplicate players..."); //set text of the button to let the user know things are in-progress
        enabled = !enabled //flip the enabled status
        setTimeout(checkIfDuplicateRunsEnabled, 50); //we need to show duplicate runs. this is to find runs that were done by players on console, who have later done faster runs on PC. at the time of writing, the Classic% Console WR is done by DatesSL on PS3, but its normally hidden by his faster runs done on PC.
    }
} );

function checkIfDuplicateRunsEnabled() //function to check if we need to
{
    $j("a[class='dropdown-item dropdown-toggle']").each(function( index ) //iterate all elements that are a "dropdown menu" type
    {
        if($j( this ).text().includes("Obsoleted runs")) //find the dropdown menu we want for obsolete runs
        {
            if($j( this ).next().children().first()[0].classList[2] == "active") //check if the "Hidden" option is selected, aka active
            {
                $j( this ).next().children().first().next().click(); //if it IS active, we go to the .next() element which is the "Show" option, and click to enable it, which loads all duplicate runs
                $j( this ).next().children().first().attr("class", "dropdown-item dropdown-toggle"); //we also have to manually set the 'active' status as on and off on the two buttons previously mentioned
                $j( this ).next().children().first().next().attr("class", "dropdown-item dropdown-toggle active"); //see above, just setting 'Show' to active
            }
        }
    });
    $j("#filterPcRuns").text("Working to hide PC runs..."); //set text of the button to let the user know things are in-progress
    setTimeout(clearPcRuns, 50); //wait a small moment to allow the text to update (50ms), then perform the main clearing of PC runs functions
}

function checkIfDuplicateRunsDisabled() //this function is basically the same as checkIfDuplicateRunsEnabled(), but doing the opposite
{
    $j("a[class='dropdown-item dropdown-toggle']").each(function( index ) //iterate all elements that are a "dropdown menu" type
    {
        if($j( this ).text().includes("Obsoleted runs")) //find the dropdown menu we want for obsolete runs
        {
            if($j( this ).next().children().first()[0].classList[2] != "active") //check if the "Hidden" option is not selected
            {
                $j( this ).next().children().first().click(); //if it is not  active, click the button
                $j( this ).next().children().first().attr("class", "dropdown-item dropdown-toggle active"); //we also have to manually set the 'active' status as on and off on the two buttons previously mentioned
                $j( this ).next().children().first().next().attr("class", "dropdown-item dropdown-toggle"); //see above
            }
        }
    });
    $j("#filterPcRuns").text("Working to show PC runs..."); //set text of the button to let the user know things are in-progress
    setTimeout(showPcRuns, 50); //wait a small moment to allow the text to update (50ms), then perform the main reshowing of PC
}

function clearPcRuns() //the main function where we search for runs with the Platform 'PC' and hide them
{
    if($j("span[class='inline-flex flex-nowrap items-center gap-1']").length == 0) //this is mainly for when the page is changed between categories: if it finds no runs in the list, then:
    {
        $j("#filterPcRuns").text("Working to hide PC runs..."); //set text of the button to let the user know things are in-progress
        setTimeout(clearPcRuns, 100); // wait 100 milliseconds and check again
        return; //end current function
    }

    $j("span[class='inline-flex flex-nowrap items-center gap-1']").each(function( index ) //this iterates through every element of a certain kind, which contains the sub-set of showing which platform a run was done on
    {
        if($j( this ).text().includes("PC")) //checking the text of the previous element search if it is 'PC' (or 'Xbox One' or 'PS4' etc), only continuing if it is 'PC' though
        {
            if($j( this ).parent().parent().parent().is(":visible")) //checking if the parent has already been hidden, no need to call twice
            {
                $j( this ).parent().parent().parent().hide(); //hide the element
            }
        }
    });

    var hasRun = new Array(); //initialize an array we will use to store a list of players names

    $j("td[class='nobr center hidden-xs hidden-md-down']").each(function( index ) //iterate all runs in the list
    {
        if($j( this ).parent().is(":visible")) //if the run hasn't already been hidden, then continue
        {
            var username = $j( this ).parent().children().first().next().text() //store the username of the run
            if(hasRun.includes(username)) //if the user already has a run in the list, then we will hide the run. the list is iterated from 1st to last, so the fastest run is stored first
            {
                $j( this ).parent().hide(); //hide the run
            }
            else
            {
                hasRun.push(username) //if they didn't have a run, store the username so that any other runs they have will be skipped
            }
        }
    });

    var position = 1; //variable for keeping track of the position of the console player

    $j("td[class='nobr center hidden-xs hidden-md-down']").each(function( index ) //same loop as above through all the runs. for programmers: i am aware i could have done this in the previous loop, but it doesn't really need optimized and cleans the code this way for now
    {
        if(!$j( this ).text().includes("PC") && $j( this ).parent().is(":visible")) //if the run is NOT a pc run (the ! symbol in front) and its not a duplicate name that has been hidden
        {
            var currentPos = $j( this ).parent().children().first().text() //store a variable of the text of the rank
            if(currentPos.includes("(")) //if the position already has a (1st) or something in it, do nothing
            {
                return; //end current proccessing
            }
            $j( this ).parent().children().first().text(currentPos + " (" + ordinal_suffix_of(position) + ")") //set the text to include the console only ranking
            position++; //increase the console position counter
        }
    });


    $j("tr[class='hidden-xs']").each(function( index ) //searching for where it says "Rank" on the top left of the leaderboard
    {
        $j( this ).children().first().text("Rank (Console)") //setting the text to show that the numbers in parenthesis are the console rankings
    });

    $j("#filterPcRuns").text("Show PC Runs"); //we're done processing, so set the button back to the toggle text
}

function showPcRuns() //function for re-showing pc runs when button is clicked a second time
{
    if($j("span[class='inline-flex flex-nowrap items-center gap-1']").length == 0) //check if the list of runs is empty
    {
        setTimeout(showPcRuns, 100); // wait 100 milliseconds and check again
        return; //end current function
    }

    $j("span[class='inline-flex flex-nowrap items-center gap-1']").each(function( index ) //iterating through every entry (even if its already hidden)
    {
        if($j( this ).text().includes("PC")) //check if its a pc run
        {
            if(!$j( this ).parent().parent().parent().is(":visible")) //if it is not visible (the ! symbol), then reshow it
            {
                $j( this ).parent().parent().parent().show(); //show the element
            }
        }
    });

    $j("td[class='nobr center hidden-xs hidden-md-down']").each(function( index ) //iterate the all runs
    {
        if(!$j( this ).text().includes("PC")) //select non pc runs
        {
            var currentPos = $j( this ).parent().children().first().text() //store current text in a variable to use later
            if(currentPos.includes("(")) //check if the text has a (1st), (2nd), etc in it
            {
                $j( this ).parent().children().first().text(currentPos.split('(')[0]); //splits the text by the character '('. So "50th (2nd)" becomes an array of [50th, 2nd)]. We then set it to the first element (0 in programming), which will be 50th, aka the "normal" ranking
            }
        }
    });

    $j("tr[class='hidden-xs']").each(function( index ) //searching for the "Rank" text again
    {
        $j( this ).children().first().text("Rank") //setting it back to normal
    });

    $j("#filterPcRuns").text("Hide PC Runs"); //we're done processing, so set the button back to the toggle text
}

function checkURL() //checking if the URL changes, which happens when changing categories (Such as Any% to 100%)
{
    if(window.location.href != urlText) //check if the url changes
    {
        urlText = window.location.href; //store the new url
        if(enabled) //only clear the runs if its actually enabled
        {
            $j("#filterPcRuns").text("Working to hide PC runs..."); //set text of the button to let the user know things are in-progress
            clearPcRuns(); //call the main run clearing function
        }
    }

    setTimeout(checkURL, 500); //recheck the url every half a second
}
setTimeout(checkURL, 500); //begin checking url for changes


window.addEventListener("change", function(e) { //listening for when the user clicks on a different sub-category (like from Trevor% to Countryside%)
    if(enabled) //if "hide pc runs" is enabled, then:
    {
        $j("#filterPcRuns").text("Working to hide PC runs..."); //set text of the button to let the user know things are in-progress
        setTimeout(clearPcRuns, 100); //clear out the runs, but wait 100 milliseconds to give it time to load the page
    }
});

//code that adds the ordinal numbers (1st, 2nd, 3rd, 21st, etc...)
//https://stackoverflow.com/a/13627586 thanks :)
function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

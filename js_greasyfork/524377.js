// ==UserScript==
// @name         NYTXW Add Prev Next Buttons
// @namespace    https://github.com/seeshanty
// @version      2026-01-10
// @description  Add Previous, 📆, and Next buttons to the New York Times Crossword Puzzle webpage for easier navigation around the calendar
// @author       seeshanty
// @license      CC0-1.0
// @supportURL   https://github.com/seeshanty/nytxw_buttons
// @match        https://www.nytimes.com/crosswords/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nytimes.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524377/NYTXW%20Add%20Prev%20Next%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/524377/NYTXW%20Add%20Prev%20Next%20Buttons.meta.js
// ==/UserScript==

// TODO: Handle bonus puzzles somehow; URL format below
// https://www.nytimes.com/crosswords/game/bonus/2024/02
// ⭐

// Changelog:
// 2025-09-21     Added function hideBannerPortal and hideAdTop

(function() {
    'use strict';

    // BOOKMARK FUNCTIONALITY FOR WORKING THROUGH THE ARCHIVE FROM MAIN /daily PUZZLE (LATEST PUZZLE)
    // When set to true, the calendar button on the latest puzzle will send you to whatever month you set here
    const useArchiveBookmark = true;
    const archiveBookmarkYear = 2025;
    const archiveBookmarkMonth = 6;

    // STYLE PARAMETERS
    const navBtnWidth = "100px";
    const navBtnSpacing = "10px";
    const navBtnBorder = "1px solid black";
    const calBtnWidth = "40px";
    const calBtnBorder = "1px solid white";
    const btnColor = "white";
    const btnHoverColor = "lightgray";
    const btnLocation = "navBar"; //  Options: navBar, crosswordDate

    // HARDCODED BASE URLS - these must end in "/" for proper URL concatenation later
    const baseUrl = "https://www.nytimes.com/crosswords/game/daily/"; // default daily puzzle page
    const archiveBaseUrl = "https://www.nytimes.com/crosswords/archive/daily/";

    // FUNCTIONALITY PARAMETERS
    const extraTimeout = 200; // increase this if the script isn't catching the correct place to put the buttons

    // INITIALIZE VARIABLES
    var currentPuzzleUrlDate = "";
    var currentPuzzleDate = new Date();
    var currentMonthArchiveUrl = "";
    var isLatestPuzzle = false;
    var targetArchiveUrl = "";

    //==========================================================================
    // THINGS WE CAN DO WHILE WINDOW IS LOADING
    //==========================================================================

    // Get the current URL
    var currentUrl = window.location.href;
    console.log("Current URL:", currentUrl);
    if (currentUrl.endsWith('/')) {
        currentUrl = currentUrl.slice(0, -1);
        console.log("Removed trailing slash in URL.\nUpdated URL:", currentUrl);
    }

    // Figure out what the date is for the latest puzzle available
    //---------------------------------------------------------------------
    // New puzzles are available at 10 PM ET M-F and 6 PM S/S (NY timezone)

    // set variables for the current date/time and date/time in NY
    const localDate = new Date();
    const dateInNY = new Date(localDate.toLocaleString("en-US", { timeZone: "America/New_York" }));
    console.log("dateInNY:",dateInNY);

    // Use date parsing to get the other needed date components (year, month, day, hour)
    const NY_YYYY = dateInNY.getFullYear();
    const NY_MM = String(dateInNY.getMonth() + 1).padStart(2, '0'); // Add 1 because January is month 0
    const NY_DD = String(dateInNY.getDate()).padStart(2, '0');
    const NY_HH24 = String(dateInNY.getHours()).padStart(2, '0');
    const NY_DAY = dateInNY.getDay();
    const NY_isWeekend = [0,6].includes(NY_DAY); // 0 = Saturday, 6 = Sunday
    console.log("Parsed date elements","\n  ",
                "NY_YYYY:", NY_YYYY,"\n  ",
                "NY_MM:", NY_MM,"\n  ",
                "NY_DD:", NY_DD,"\n  ",
                "NY_HH24:", NY_HH24,"\n  ",
                "NY_DAY:", NY_DAY,"\n  ",
                "NY_isWeekend:", NY_isWeekend);

    // Make a date object for the latest puzzle available
    // Start by assuming the date for the latest puzzle matches the date in NY
    const latestPuzzleDate = new Date(dateInNY);

    if (NY_isWeekend && NY_HH24 >= 18 && NY_HH24 < 24) { // it's a weekend and it's between 6 PM and midnight
        console.log("New weekend puzzle should be available.");
        latestPuzzleDate.setDate(latestPuzzleDate.getDate() + 1);
    } else if (NY_HH24 >= 22 && NY_HH24 < 24) { // not a weekend; between 10 PM and midnight
        console.log("New weekday puzzle should be available.");
        latestPuzzleDate.setDate(latestPuzzleDate.getDate() + 1);
    } else {
        console.log("Latest puzzle matches current date in NY.");
    }
    console.log("latestPuzzleDate:", latestPuzzleDate);

    // It's useful to have pre-formatted strings matching the URLs for the puzzle
    const latestPuzzleUrlDate = latestPuzzleDate.getFullYear() + '/' +
          String(latestPuzzleDate.getMonth() + 1).padStart(2, '0') + '/' +
          String(latestPuzzleDate.getDate()).padStart(2, '0');
    const latestMonthArchiveUrl = latestPuzzleDate.getFullYear() + '/' +
          String(latestPuzzleDate.getMonth() + 1).padStart(2, '0');
    console.log("latestPuzzleUrlDate:",latestPuzzleUrlDate);
    console.log("latestMonthArchiveUrl:",latestMonthArchiveUrl);

    // Figure out whether we are on the latest puzzle available
    //---------------------------------------------------------------------

    // Parse puzzle date from URL
    if (currentUrl == baseUrl.slice(0, -1)) {
        //There is no YYYY/MM/DD in the URL; we're on the daily page
        console.log("No date in URL. Assuming puzzle is newest puzzle.");
        currentPuzzleUrlDate = latestPuzzleUrlDate;
        currentPuzzleDate = new Date(latestPuzzleDate);
        currentMonthArchiveUrl = latestMonthArchiveUrl;
        isLatestPuzzle = true;
    } else {
        // Extract the baseUrl, year, month, and day from the URL
        // Assumption: puzzle URLs end in /YYYY/MM/DD
        const parts = currentUrl.split('/');
        // baseUrl = parts.slice(0, parts.length - 3).join('/') + '/';
        const URL_YYYY = parts[parts.length - 3];
        const URL_MM = parts[parts.length - 2];
        const URL_DD = parts[parts.length - 1];
        currentPuzzleUrlDate = URL_YYYY + "/" + URL_MM + "/" + URL_DD;
        currentPuzzleDate = new Date(URL_YYYY, URL_MM - 1, URL_DD);
        currentMonthArchiveUrl = URL_YYYY + "/" + String(URL_MM).padStart(2, '0');
        console.log("URL Date: ",currentPuzzleUrlDate,"\n",currentPuzzleDate);

        // Check if puzzleDate is the same day as the latest available puzzle
        isLatestPuzzle = latestPuzzleDate.getFullYear() === currentPuzzleDate.getFullYear() &&
            latestPuzzleDate.getMonth() === currentPuzzleDate.getMonth() &&
            latestPuzzleDate.getDate() === currentPuzzleDate.getDate();
    } // puzzle date parsing

    console.log("isLatestPuzzle:", isLatestPuzzle);

    //----------------
    // PREVIOUS
    //----------------

    // Calculate the previous date
    const previousDate = new Date(currentPuzzleDate);
    previousDate.setDate(currentPuzzleDate.getDate() - 1);
    console.log("Previous Date:", previousDate);

    // Format the previous date as YYYY/MM/DD
    const previousUrlDate = previousDate.getFullYear() + '/' +
          String(previousDate.getMonth() + 1).padStart(2, '0') + '/' +
          String(previousDate.getDate()).padStart(2, '0');

    // Concatenate previousUrl
    const previousUrl = baseUrl + previousUrlDate;
    console.log("Previous URL:", previousUrl);

    //----------------
    // NEXT
    //----------------

    // Calculate the next date
    const nextDate = new Date(currentPuzzleDate);
    nextDate.setDate(currentPuzzleDate.getDate() + 1);
    console.log("Next Date:", nextDate);

    // Format the next date as YYYY/MM/DD
    const nextUrlDate = nextDate.getFullYear() + '/' +
          String(nextDate.getMonth() + 1).padStart(2, '0') + '/' +
          String(nextDate.getDate()).padStart(2, '0');

    // Concatenate nextUrl
    const nextUrl = baseUrl + nextUrlDate;
    console.log("Next URL:", nextUrl);

    //-------------------
    //  ARCHIVE CALENDAR
    //-------------------

    // Archive Calendar URL
    if (isLatestPuzzle && useArchiveBookmark) {
        targetArchiveUrl = archiveBookmarkYear + '/' + String(archiveBookmarkMonth).padStart(2, '0');
    } else {
        targetArchiveUrl = currentMonthArchiveUrl;
    }
    const archiveCalendarUrl = archiveBaseUrl + targetArchiveUrl;
    console.log("Archive Calendar URL:", archiveCalendarUrl);

    //--------------------------------------------------------------------------
    // FUNCTIONS TO CREATE THE BUTTONS
    //--------------------------------------------------------------------------
    // Function to create the "Previous" button
    function createPreviousButton() {
        console.log("Creating the 'Previous' button...");

        var previousBtn = document.createElement("button");
        previousBtn.textContent = "Previous";
        previousBtn.id = "previousBtn";
        previousBtn.style.backgroundColor = btnColor;
        previousBtn.style.width = navBtnWidth;
        previousBtn.style.border= navBtnBorder;
        previousBtn.addEventListener("mouseenter", function() {
            previousBtn.style.backgroundColor = btnHoverColor;
        });

        previousBtn.addEventListener("mouseleave", function() {
            previousBtn.style.backgroundColor = btnColor;
        });
        previousBtn.addEventListener("click", function() {
            console.log("Previous button clicked...");
            // Redirect to the previous URL
            window.location.href = previousUrl;
        });

        console.log("Returning the 'Previous' button...");
        return previousBtn;
    }

    // Function to create the "Next" button
    function createNextButton() {
        console.log("Creating the 'Next' button...");

        var nextBtn = document.createElement("button");
        nextBtn.textContent = "Next";
        nextBtn.id = "nextBtn";
        nextBtn.style.backgroundColor = btnColor;
        nextBtn.style.width = navBtnWidth;
        nextBtn.style.marginLeft = navBtnSpacing;
        nextBtn.style.border= navBtnBorder;
        if (isLatestPuzzle) {
            nextBtn.disabled = true;
            nextBtn.style.borderColor = "lightgray";
        } else {
            nextBtn.addEventListener("mouseenter", function() {
                nextBtn.style.backgroundColor = btnHoverColor;
            });

            nextBtn.addEventListener("mouseleave", function() {
                nextBtn.style.backgroundColor = btnColor;
            });
            nextBtn.addEventListener("click", function() {
                console.log("Next button clicked...");
                // Redirect to the next URL
                window.location.href = nextUrl;
            });
        }

        console.log("Returning the 'Next' button...");
        return nextBtn;
    }

    function createArchiveCalendarButton() {

        console.log("Creating the 'Archive Calendar' button...");

        var archiveCalBtn = document.createElement("button");
        archiveCalBtn.textContent = "📆";
        archiveCalBtn.id = "archiveCalBtn";
        archiveCalBtn.style.backgroundColor = btnColor;
        archiveCalBtn.style.width = calBtnWidth;
        archiveCalBtn.style.border= calBtnBorder;
        archiveCalBtn.style.marginLeft = navBtnSpacing;
        archiveCalBtn.addEventListener("mouseenter", function() {
            archiveCalBtn.style.backgroundColor = btnHoverColor;
        });

        archiveCalBtn.addEventListener("mouseleave", function() {
            archiveCalBtn.style.backgroundColor = btnColor;
        });
        archiveCalBtn.addEventListener("click", function() {
            console.log("Archive Calendar button clicked...");
            // Redirect to the archive calendar URL
            window.location.href = archiveCalendarUrl;
        });

        console.log("Returning the 'Archive Calendar' button...");
        return archiveCalBtn;
    }

    //--------------------------------------------------------------------------
    // FUNCTION TO APPEND THE BUTTONS
    //--------------------------------------------------------------------------
    // Function to append the new navigation buttons to the specified element
    function appendExtraNavButtons() {
        var previousButton = createPreviousButton();
        console.log("Previous Button:", previousButton);

        var archiveCalButton = createArchiveCalendarButton();
        console.log("Archive Calendar button:", archiveCalButton);

        var nextButton = createNextButton();
        console.log("Next Button:", nextButton);

        // Possible targets:
        // Crossword Date
        var dateContainer = document.querySelector("div.xwd__details--date")
        console.log("Date Container:", dateContainer);
        // Nav bar
        var navContainer = document.querySelector("#js-global-nav")
        console.log("Nav Container:", navContainer);

        // Set the target
        var targetContainer = navContainer;
        if (btnLocation == "crosswordDate") {
            targetContainer = dateContainer;
        }
        console.log("Target Container:", targetContainer);

        // Append the buttons
        targetContainer.appendChild(previousButton);
        console.log("Appended the 'Previous' button to the target container.");
        targetContainer.appendChild(archiveCalButton);
        console.log("Appended the 'Archive Calendar' button to the target container.");
        targetContainer.appendChild(nextButton);
        console.log("Appended the 'Next' button to the target container.");
    }

    // Function to hide the stupid signup banner
    function hideBannerPortal() {
        const banner = document.getElementById('banner-portal');
        if (banner) {
            banner.style.display = 'none';
        }
    }

    // Function to hide the top ad
    function hideAdTop() {
        const adTop = document.getElementById('ad-top');
        if (adTop) {
            adTop.style.display = 'none';
        }
        document.querySelectorAll('.pz-ad-box').forEach(el => {
            el.remove();
        });
    }
    
    //==========================================================================
    // WAIT FOR THE WINDOW TO FINISH LOADING BEFORE ATTEMPTING TO APPEND BUTTONS
    //==========================================================================
    window.addEventListener('load', function() {

        // need to give it a small timeout to make it work more reliably
        setTimeout(function(){
            appendExtraNavButtons();
            hideBannerPortal();
            hideAdTop();
        }, extraTimeout);

    }, false); // window load listener

})(); // main wrapper
